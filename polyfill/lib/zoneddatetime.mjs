import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import ToObject from 'es-abstract/2019/ToObject.js';
import ToString from 'es-abstract/2019/ToString.js';

const Temporal = {
  get DateTime() {
    return GetIntrinsic('%Temporal.DateTime%');
  },
  get Instant() {
    return GetIntrinsic('%Temporal.Instant%');
  },
  get TimeZone() {
    return GetIntrinsic('%Temporal.TimeZone%');
  },
  get Calendar() {
    return GetIntrinsic('%Temporal.Calendar%');
  },
  get Duration() {
    return GetIntrinsic('%Temporal.Duration%');
  }
};

/** Build a `Temporal.ZonedDateTime` instance from a property bag object */
function fromObject(item, options) {
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');
  const offsetOption = getOption(options, 'offset', OFFSET_OPTIONS, 'reject');

  const { timeZone: tzOrig, offset } = item;
  if (tzOrig === undefined) {
    throw new TypeError('Required property `timeZone` is missing');
  }
  const tz = Temporal.TimeZone.from(tzOrig);

  const offsetNanoseconds = offset !== undefined ? parseOffsetString(offset) : undefined;
  if (offsetNanoseconds === null) {
    throw RangeError(`The \`offset\` property has an invalid value: ${offset}`);
  }

  const dt = Temporal.DateTime.from(item, { overflow });
  return fromCommon(dt, tz, offsetNanoseconds, disambiguation, offsetOption);
}

/** Build a `Temporal.ZonedDateTime` instance from an ISO 8601 extended string */
function fromIsoString(isoString, options) {
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');
  const offsetOption = getOption(options, 'offset', OFFSET_OPTIONS, 'reject');

  // TODO: replace this placeholder parser
  const formatRegex = /^(.+?)\[([^\]\s]+)\](?:\[c=([^\]\s]+)\])?/;
  const match = formatRegex.exec(isoString);
  if (!match) throw new Error('Invalid extended ISO 8601 string');
  const absString = match[1];
  const tzString = match[2];
  const calendarString = match[3] || 'iso8601';

  if (!tzString) {
    throw new Error(
      "Missing time zone. Either append a time zone identifier (e.g. '2011-12-03T10:15:30+01:00[Europe/Paris]')" +
        ' or create differently (e.g. `Temporal.Instant.from(isoString).toZonedDateTimeISO(timeZone)`).'
    );
  }

  const dt = Temporal.DateTime.from(absString);
  const tz = Temporal.TimeZone.from(tzString);
  const cal = Temporal.Calendar.from(calendarString);

  // Calculate the offset by comparing the DateTime to the Instant parsed from
  // the same string. Note that current Temporal parsing regexes fail when "Z"
  // is used instead of a numeric offset (e.g.
  // 2020-03-08T09:00Z[America/Los_Angeles]). This is why we can't parse the
  // whole original string into an Instant. But the Java.time parser accepts
  // "Z" as an offset, so for compatibility and ergonomics we do too. Below is a
  // quote from Jon Skeet (creator of Joda Time which java.time was based on)
  // that may explain why Java accepts this format. From
  // https://stackoverflow.com/a/61245186:
  // > It's really unfortunate that ISO-8601 talks about this as a time zone,
  // > when it's only a UTC offset - it definitely doesn't specify the actual
  // > time zone. (So you can't tell what the local time will be one minute
  // > later, for example.)
  const isZ = absString.trimEnd().toUpperCase().endsWith('Z');
  let abs;
  let ignoreOffsetOption = isZ;
  try {
    abs = Temporal.Instant.from(absString);
  } catch (e) {
    // presumably, parsing to Instant failed because offset is missing,
    // so we'll just infer the offset from the time zone.
    abs = dt.toInstant(tz, { disambiguation });
    ignoreOffsetOption = true;
  }
  const offsetNs = dt.difference(abs.toDateTime('UTC', dt.calendar), { largestUnit: 'nanoseconds' }).nanoseconds;
  return fromCommon(dt.withCalendar(cal), tz, offsetNs, disambiguation, ignoreOffsetOption ? 'use' : offsetOption);
}

/** Shared logic for the object and string forms of `from` */
function fromCommon(dt, timeZone, offsetNs, disambiguation, offsetOption) {
  if (offsetNs === undefined || offsetOption === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Instant in the given time zone.
    return fromDateTime(dt, timeZone, { disambiguation });
  }

  // Calculate the instant for the input's date/time and offset
  const absWithInputOffset = dt.toInstant('UTC').add({ nanoseconds: -offsetNs });

  if (
    offsetOption === 'use' ||
    absWithInputOffset.equals(dt.toInstant(timeZone, { disambiguation: 'earlier' })) ||
    absWithInputOffset.equals(dt.toInstant(timeZone, { disambiguation: 'later' }))
  ) {
    // The caller wants the offset to always win ('use') OR the caller is OK
    // with the offset winning ('prefer' or 'reject') as long as it's valid for
    // this timezone and date/time.
    return new ZonedDateTime(absWithInputOffset.epochNanoseconds, timeZone, dt.calendar);
  }

  // If we get here, then the user-provided offset doesn't match any instants
  // for this time zone and date/time.
  if (offsetOption === 'reject') {
    const earlierOffset = timeZone.getOffsetStringFor(dt.toInstant(timeZone, { disambiguation: 'earlier' }));
    const laterOffset = timeZone.getOffsetStringFor(dt.toInstant(timeZone, { disambiguation: 'later' }));
    const validOffsets = earlierOffset === laterOffset ? [earlierOffset] : [earlierOffset, laterOffset];
    const joined = validOffsets.join(' or ');
    const offsetString = formatOffsetString(offsetNs);
    throw new RangeError(
      `Offset is invalid for '${dt}' in '${timeZone}'. Provided: ${offsetString}, expected: ${joined}.`
    );
  }
  // fall through: offsetOption === 'prefer', but the offset doesn't match so
  // fall back to use the time zone instead.
  return fromDateTime(dt, timeZone, { disambiguation });
}

function fromDateTime(dateTime, timeZone, options) {
  return new ZonedDateTime(dateTime.toInstant(timeZone, options).epochNanoseconds, timeZone, dateTime.calendar);
}

/** Identical logic for `add` and `subtract` */
function doAddOrSubtract(op, durationLike, options, zonedDateTime) {
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  const { timeZone, calendar } = zonedDateTime;
  const { timeDuration, dateDuration } = splitDuration(durationLike);

  // If only time to be added/subtracted, then use Instant math only. It's not
  // OK to fall fall through to the date/time code below because compatible
  // disambiguation in the PDT=>Instant conversion will change the offset of any
  // ZDT in the repeated clock time after a backwards transition. When
  // adding/subtracting time units and not dates, this disambiguation is not
  // expected and so is avoided below via a fast path for time-only arithmetic.
  // BTW, this behavior is similar in spirit to`offset: 'prefer'` in `with`.
  if (dateDuration.isZero()) {
    const instantResult = zonedDateTime.toInstant()[op](timeDuration);
    return new ZonedDateTime(instantResult.epochNanoseconds, timeZone, calendar);
  }

  // RFC 5545 requires the date portion to be added/subtracted in calendar days
  // and the time portion to be added/subtracted in exact time.
  // TODO: remove the manual order-of-operations hack below after #993 fix lands
  // const dtIntermediate = zonedDateTime.toDateTime()[op](dateDuration, { overflow });
  const { years, months, weeks, days } = dateDuration;
  let dtIntermediate = zonedDateTime.toDateTime();
  dtIntermediate = years ? dtIntermediate[op]({ years }, { overflow }) : dtIntermediate;
  dtIntermediate = months ? dtIntermediate[op]({ months }, { overflow }) : dtIntermediate;
  dtIntermediate = weeks ? dtIntermediate[op]({ weeks }, { overflow }) : dtIntermediate;
  dtIntermediate = days ? dtIntermediate[op]({ days }, { overflow }) : dtIntermediate;
  // Note that `{ disambiguation: 'compatible' }` is used below (in `toInstant`)
  // because this disambiguation behavior is required by RFC 5545.
  const instantIntermediate = dtIntermediate.toInstant(timeZone);
  const instantResult = instantIntermediate[op](timeDuration);
  return new ZonedDateTime(instantResult.epochNanoseconds, timeZone, calendar);
}

export class ZonedDateTime {
  /**
   * Construct a new `Temporal.ZonedDateTime` instance from an exact timestamp,
   * time zone, and optional calendar.
   *
   * Use `Temporal.ZonedDateTime.from()`To construct a `Temporal.ZonedDateTime`
   * from an ISO 8601 string or from a time zone and `DateTime` fields (like
   * year or hour).
   *
   * @param epochNanoseconds {bigint} - instant (in nanoseconds since UNIX
   * epoch) for this instance
   * @param timeZone {Temporal.TimeZoneProtocol} - time zone for this instance
   * @param [calendar=Temporal.Calendar.from('iso8601')] {Temporal.CalendarProtocol} -
   * calendar for this instance (defaults to ISO calendar)
   */
  constructor(epochNanoseconds, timeZone, calendar) {
    // TODO: remove the cast below once https://github.com/tc39/proposal-temporal/issues/810 is resolved
    this._tz = Temporal.TimeZone.from(timeZone);
    this._abs = new Temporal.Instant(epochNanoseconds);
    this._dt = this._abs.toDateTime(this._tz, calendar ? Temporal.Calendar.from(calendar) : 'iso8601');
    // eslint-disable-next-line no-undef
    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  /**
   * Build a `Temporal.ZonedDateTime` instance from one of the following:
   * - Another ZonedDateTime instance, in which case the result will deep-clone
   *   the input.
   * - A "ZonedDateTime-like" property bag object with required properties
   *   `timeZone`, `year`, `month`, and `day`. Other fields (time fields and
   *   `offset`) are optional. If `offset` is not provided, then the time can be
   *   ambiguous around DST transitions. The `disambiguation` option can resolve
   *   this ambiguity.
   * - An ISO 8601 date+time+offset string (the same format used by
   *   `Temporal.Instant.from`) with a time zone identifier suffix appended in
   *   square brackets, e.g. `2007-12-03T10:15:30+01:00[Europe/Paris]` or
   *   `2007-12-03T09:15:30Z[Europe/Paris]`.
   * - An object that can be converted to the string format above.
   *
   * If the input contains both a time zone offset and a time zone, in rare
   * cases it's possible for those values to conflict for a particular local
   * date and time. For example, this could happen for future summertime events
   * that were stored before a country permanently abolished DST. If the time
   * zone and offset are in conflict, then the `offset` option is used to
   * resolve the conflict.
   *
   * Available options:
   * ```
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * offset?: 'use' | 'prefer' | 'ignore' | 'reject' (default)
   * ```
   */
  static from(item, options) {
    if (item instanceof Temporal.DateTime) {
      throw new TypeError('Time zone is missing. Try `dateTime.toZonedDateTime(timeZone)`.');
    }
    if (item instanceof Temporal.Instant) {
      throw new TypeError('Time zone is missing. Try `instant.toZonedDateTime(timeZone}`.');
    }
    if (item instanceof ZonedDateTime) {
      return new ZonedDateTime(item._abs.epochNanoseconds, item._tz, item._dt.calendar);
    }
    return typeof item === 'object' ? fromObject(item, options) : fromIsoString(item.toString(), options);
  }

  /**
   * Merge fields into an existing `Temporal.ZonedDateTime`. The provided `item`
   * is a "ZonedDateTime-like" object. Accepted fields include:
   * - All `Temporal.DateTime` fields, including `calendar`
   * - `timeZone` as a time zone identifier string like `Europe/Paris` or a
   *   `Temporal.TimeZone` instance
   * - `offset`
   *
   * If the `timeZone` field is included, `with` will first convert all existing
   * fields to the new time zone and then fields in the input will be played on
   * top of the new time zone. Therefore, `.with({timeZone})` is an easy way to
   * convert to a new time zone while updating the clock time.  However, to keep
   * clock time as-is while resetting the time zone, use the `toDateTime()`
   * method. Examples:
   * ```
   * const sameInstantInOtherTz = zdt.with({timeZone: 'Europe/London'});
   * const newTzSameLocalTime = zdt.toDateTime().toZonedDateTime('Europe/London');
   * ```
   *
   * If the `offset` field is provided, then it's possible for it to conflict
   * with the input object's `timeZone` property or, if omitted, the object's
   * existing time zone.  The `offset` option (which defaults to `'prefer'`)
   * will resolve the conflict.
   *
   * If the `offset` field is not provided, but the `timeZone` field is not
   * provided either, then the existing `offset` field will be used by `with` as
   * if it had been provided by the caller. By default, this will prefer the
   * existing offset when resolving ambiguous results. For example, if a
   * `Temporal.ZonedDateTime` is set to the "second" 1:30AM on a day where the
   * 1-2AM clock hour is repeated after a backwards DST transition, then calling
   * `.with({minute: 45})` will result in an ambiguity which is resolved using
   * the default `offset: 'prefer'` option. Because the existing offset is valid
   * for the new time, it will be retained so the result will be the "second"
   * 1:45AM.  However, if the existing offset is not valid for the new result
   * (e.g. `.with({hour: 0})`), then the default behavior will change the
   * offset.
   *
   * Available options:
   * ```
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * offset?: 'use' | 'prefer' (default) | 'ignore' | 'reject'
   * ```
   */
  with(zonedDateTimeLike, options) {
    if (typeof zonedDateTimeLike !== 'object') {
      throw new TypeError("Parameter 'zonedDateTimeLike' must be an object");
    }
    if (typeof zonedDateTimeLike.getFields === 'function') {
      // If the input object is a Temporal instance, then fetch its fields so that
      // we can spread those fields below.  Ideally, we could remove this test
      // if Temporal objects could have own properties so could be spread!
      zonedDateTimeLike = zonedDateTimeLike.getFields();
    }
    // TODO: validate and normalize input fields

    // Options are passed through to `from` with one exception: the default
    // `offset` option is `prefer` to support changing DateTime fields while
    // retaining the option if possible.
    const updatedOptions = options ? { ...options } : {};
    if (updatedOptions.offset === undefined) updatedOptions.offset = 'prefer';

    const { timeZone, calendar, offset } = zonedDateTimeLike;

    const newTimeZone = timeZone && Temporal.TimeZone.from(timeZone);
    const newCalendar = calendar && Temporal.Calendar.from(calendar);

    const updateOffset = offset !== undefined;
    const updateTimeZone = newTimeZone && newTimeZone.id !== this._tz.id;
    const updateCalendar = newCalendar && newCalendar.id !== this.calendar.id;

    // Changing `timeZone` or `calendar` will create a new instance, and then
    // other input fields will be played on top of it.
    let base = this; // eslint-disable-line @typescript-eslint/no-this-alias

    if (updateTimeZone || updateCalendar) {
      const tz = newTimeZone || base._tz;
      const cal = newCalendar || base.calendar;
      base = new ZonedDateTime(base._abs.epochNanoseconds, tz, cal);
    }

    // Deal with the rest of the fields. If there's a change in tz offset, it'll
    // be handled by `from`. Also, if we're not changing the time zone or offset,
    // then pass the existing offset to `from`. (See docs for more info.)
    const { offset: originalOffset, ...fields } = base.getFields();
    if (!updateOffset && !updateTimeZone) {
      fields.offset = originalOffset;
    }
    const merged = { ...fields, ...zonedDateTimeLike };
    return ZonedDateTime.from(merged, updatedOptions);
  }

  /**
   * Get a new `Temporal.ZonedDateTime` instance that uses a specific calendar.
   *
   * Developers using only the default ISO 8601 calendar will probably not need
   * to call this method.
   *
   * @param [calendar=Temporal.Calendar.from('iso8601')]
   * {Temporal.CalendarProtocol} - new calendar to use
   */
  withCalendar(calendar) {
    return this.with({ calendar });
  }

  /**
   * Get a new `Temporal.ZonedDateTime` instance that represents the same
   * instant and calendar in a different time zone.
   *
   * @param [calendar=Temporal.Calendar.from('iso8601')]
   * {Temporal.CalendarProtocol} - new calendar to use
   */
  withTimeZone(timeZone) {
    const tz = Temporal.TimeZone.from(timeZone);
    return this.with({ timeZone: tz });
  }

  /**
   * Returns the exact time of this `Temporal.ZonedDateTime` instance as a
   * `Temporal.Instant`.
   */
  toInstant() {
    return Temporal.Instant.from(this._abs);
  }

  /**
   * Returns the `Temporal.TimeZone` representing this object's time zone.
   *
   * Although this property is a `Temporal.TimeZone` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly IANA time zone identifier
   * string (e.g. `'Europe/Paris'`) when persisting to JSON.
   */
  get timeZone() {
    return Temporal.TimeZone.from(this._tz);
  }

  /**
   * Returns the `Temporal.Calendar` for this `Temporal.ZonedDateTime` instance.
   *
   * ISO 8601 (the Gregorian calendar with a specific week numbering scheme
   * defined) is the default calendar.
   *
   * Although this property is a `Temporal.Calendar` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly calendar ID string IANA
   * time zone identifier string (e.g. `'iso8601'` or `'japanese'`) when
   * persisting to JSON.
   */
  get calendar() {
    return Temporal.Calendar.from(this._dt.calendar);
  }

  /**
   * Returns a new `Temporal.DateTime` instance that corresponds to this
   * `Temporal.ZonedDateTime` instance.
   *
   * The resulting `Temporal.DateTime` instance will use the same date, time,
   * and calendar as `this`.
   */
  toDateTime() {
    return Temporal.DateTime.from(this._dt);
  }

  /**
   * Returns the number of real-world hours between midnight of the current day
   * until midnight of the next calendar day. Normally days will be 24 hours
   * long, but on days where there are DST changes or other time zone
   * transitions, this duration may be 23 hours or 25 hours. In rare cases,
   * other integers or even non-integer values may be returned, e.g. when time
   * zone definitions change by less than one hour.
   *
   * If a time zone offset transition happens exactly at midnight, the
   * transition will be counted as part of the previous day's length.
   *
   * Note that transitions that skip entire days (like the 2011
   * [change](https://en.wikipedia.org/wiki/Time_in_Samoa#2011_time_zone_change)
   * of `Pacific/Apia` to the opposite side of the International Date Line) will
   * return `24` because there are 24 real-world hours between one day's
   * midnight and the next day's midnight.
   */
  get hoursInDay() {
    const todayDate = this.toDate();
    const today = ZonedDateTime.from({ ...todayDate.getFields(), timeZone: this.timeZone });
    const tomorrow = ZonedDateTime.from({ ...todayDate.add({ days: 1 }).getFields(), timeZone: this.timeZone });
    const todayAbs = today.toInstant();
    const tomorrowAbs = tomorrow.toInstant();
    const diff = tomorrowAbs.difference(todayAbs, { largestUnit: 'hours' });
    const hours =
      diff.hours +
      diff.minutes / 60 +
      diff.seconds / 3600 +
      diff.milliseconds / 3.6e6 +
      diff.microseconds / 3.6e9 +
      diff.nanoseconds / 3.6e12;
    return hours;
  }

  /**
   * Returns a new `Temporal.ZonedDateTime` instance representing the first
   * valid time during the current calendar day and time zone of `this`.
   *
   * The local time of the result is almost always `00:00`, but in rare cases it
   * could be a later time e.g. if DST starts at midnight in a time zone. For
   * example:
   * ```
   * const zdt = Temporal.ZonedDateTime.from('2015-10-18T12:00-02:00[America/Sao_Paulo]');
   * zdt.startOfDay; // => 2015-10-18T01:00-02:00[America/Sao_Paulo]
   * ```
   */
  get startOfDay() {
    const date = this.toDate();
    const zdt = ZonedDateTime.from({ ...date.getFields(), timeZone: this.timeZone });
    return zdt;
  }

  /**
   * True if this `Temporal.ZonedDateTime` instance is immediately after a DST
   * transition or other change in time zone offset, false otherwise.
   *
   * "Immediately after" means that subtracting one nanosecond would yield a
   * `Temporal.ZonedDateTime` instance that has a different value for
   * `offsetNanoseconds`.
   *
   * To calculate if a DST transition happens on the same day (but not
   * necessarily at the same time), use `.hoursInDay() !== 24`.
   * */
  get isOffsetTransition() {
    const oneNsBefore = this.subtract({ nanoseconds: 1 });
    return oneNsBefore.offsetNanoseconds !== this.offsetNanoseconds;
  }

  /**
   * Offset (in nanoseconds) relative to UTC of the current time zone and
   * instant of this `Temporal.ZonedDateTime` instance.
   *
   * The value of this field will change after DST transitions or after
   * political changes to a time zone, e.g. a country switching to a new time
   * zone.
   *
   * This field cannot be passed to `from` and `with`.  Instead, use `offset`.
   * */
  get offsetNanoseconds() {
    return this._tz.getOffsetNanosecondsFor(this._abs);
  }

  /**
   * Offset (as a string like `'+05:00'` or `'-07:00'`) relative to UTC of the
   * current time zone and instant of this `Temporal.ZonedDateTime` instance.
   *
   * The value of this field will change after DST transitions or after
   * political changes to a time zone, e.g. a country switching to a new time
   * zone.
   *
   * Because this field is able to uniquely map a `Temporal.DateTime` to an
   * instant, this field is returned by `getFields()` and is accepted by `from`
   * and `with`.
   *
   * This property is also useful for custom formatting of
   * `Temporal.ZonedDateTime` instances.
   * */
  get offset() {
    return this._tz.getOffsetStringFor(this._abs);
  }

  /**
   * Returns a plain object containing enough data to uniquely identify
   * this object.
   *
   * The resulting object includes all fields returned by
   * `Temporal.DateTime.prototype.getFields()`, as well as `timeZone`,
   * and `offset`.
   *
   * The result of this method can be used for round-trip serialization via
   * `from()`, `with()`, or `JSON.stringify`.
   */
  getFields() {
    const { timeZone, offset } = this;
    return {
      timeZone,
      offset,
      ...this._dt.getFields()
    };
  }

  /**
   * Method for internal use by non-ISO calendars. Normally not used.
   */
  getISOFields() {
    const { timeZone, offset } = this;
    return {
      timeZone,
      offset,
      ...this._dt.getISOFields()
    };
  }

  /**
   * Compare two `Temporal.ZonedDateTime` values.
   *
   * Returns:
   * * Zero if all fields are equivalent, including the calendar ID and the time
   *   zone name.
   * * -1 if `one` is less than `two`
   * * 1 if `one` is greater than `two`.
   *
   * Comparison will use the instant, not clock time, because sorting is
   * almost always based on when events happened in the real world, but during
   * the hour before and after DST ends in the fall, sorting of clock time will
   * not match the real-world sort order.
   *
   * If instants are equal, then `.calendar.id` will be compared
   * alphabetically. If those are equal too, then `.timeZone.id` will be
   * compared alphabetically. Even though alphabetic sort carries no meaning,
   * it's used to ensure that unequal instances have a deterministic sort order.
   *
   * In the very unusual case of sorting by clock time instead, use
   * `.toDateTime()` on both instances and use `Temporal.DateTime`'s `compare`
   * method.
   */
  static compare(one, two) {
    return (
      Temporal.Instant.compare(one._abs, two._abs) ||
      compareStrings(one.calendar.id, two.calendar.id) ||
      compareStrings(one.timeZone.id, two.timeZone.id)
    );
  }

  /**
   * Returns `true` if the exact time, time zone, and calendar are
   * identical to `other`, and `false` otherwise.
   *
   * To compare only the exact times and ignore time zones and
   * calendars, use `.toInstant().compare(other.toInstant())`.
   *
   * To ignore calendars but not time zones when comparing, convert both
   * instances to the ISO 8601 calendar:
   * ```
   * Temporal.ZonedDateTime.compare(
   *   one.with({ calendar: 'iso8601' }),
   *   two.with({ calendar: 'iso8601' })
   * );
   * ```
   *
   * In the very unusual case of sorting by clock time instead, use
   * `.toDateTime()` on both instances and use `Temporal.DateTime`'s `compare`
   * method.
   */
  equals(other) {
    return ZonedDateTime.compare(this, other) === 0;
  }

  /**
   * Add a `Temporal.Duration` and return the result.
   *
   * Dates will be added using calendar dates while times will be added with
   * instant.
   *
   * Available options:
   * ```
   * overflow?: 'constrain' (default) | 'reject'
   * ```
   */
  add(durationLike, options) {
    return doAddOrSubtract('add', durationLike, options, this);
  }

  /**
   * Subtract a `Temporal.Duration` and return the result.
   *
   * Dates will be subtracted using calendar dates while times will be
   * subtracted with instant.
   *
   * Available options:
   * ```
   * overflow?: 'constrain' (default) | 'reject'
   * ```
   */
  subtract(durationLike, options) {
    return doAddOrSubtract('subtract', durationLike, options, this);
  }

  /**
   * Calculate the difference between two `Temporal.ZonedDateTime` values and
   * return the `Temporal.Duration` result.
   *
   * The duration returned is a "hybrid" duration. The date portion represents
   * full calendar days like `DateTime.prototype.difference` would return. The
   * time portion represents real-world elapsed time like
   * `Instant.prototype.difference` would return. This "hybrid duration"
   * approach matches widely-adopted industry standards like RFC 5545
   * (iCalendar). It also matches the behavior of popular JavaScript libraries
   * like moment.js and date-fns.
   *
   * Examples:
   * - Difference between 2:30AM on the day before DST starts and 3:30AM on the
   *   day DST starts = `P1DT1H` (even though it's only 24 hours of real-world
   *   elapsed time)
   * - Difference between 1:45AM on the day before DST starts and the "second"
   *   1:15AM on the day DST ends => `PT24H30M` (because it hasn't been a full
   *   calendar day even though it's been 24.5 real-world hours).
   *
   * If `largestUnit` is `'hours'` or smaller, then the result will be the same
   * as if `Temporal.Instant.prototype.difference` was used.
   *
   * If both values have the same local time, then the result will be the same
   * as if `Temporal.DateTime.prototype.difference` was used.
   *
   * If the other `Temporal.ZonedDateTime` is in a different time zone, then the
   * same days can be different lengths in each time zone, e.g. if only one of
   * them observes DST. Therefore, a `RangeError` will be thrown if
   * `largestUnit` is `'days'` or larger and the two instances' time zones have
   * different `name` fields.  To work around this limitation, transform one of
   * the instances to the other's time zone using `.with({timeZone:
   * other.timeZone})` and then calculate the same-timezone difference.
   *
   * To calculate the difference between calendar dates only, use
   *   `.toDate().difference(other.toDate())`.
   *
   * To calculate the difference between clock times only, use
   *   `.toTime().difference(other.toTime())`.
   *
   * Because of the complexity and ambiguity involved in cross-timezone
   * calculations involving days or larger units, `hours` is the default for
   * `largestUnit`.
   *
   * Available options:
   * ```
   * largestUnit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes'
   *   | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' | 'auto' (default)
   * smallestUnit: 'years' | 'months' | 'weeks' | 'days' | 'hours'
   *   | 'minutes' | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds' (default)
   * roundingIncrement: number (default = 1)
   * roundingMode: 'nearest' (default) | 'ceil'  | 'trunc' | 'floor'`
   * ```
   */
  difference(other, options) {
    // The default of `largestUnit: 'hours'` is different from DateTime and
    // Instant, which is why we can't passthrough the options to those types.
    let largestUnit = getOption(options, 'largestUnit', LARGEST_UNITS, 'auto');
    if (largestUnit === 'auto') largestUnit = 'hours';
    const smallestUnit = getOption(options, 'smallestUnit', SMALLEST_UNITS, 'nanoseconds');

    // If smallestUnit is larger than largestUnit, then set largestUnit = smallestUnit
    const smallestUnitIndex = SMALLEST_UNITS.indexOf(smallestUnit);
    const largestUnitIndex = SMALLEST_UNITS.indexOf(largestUnit);
    if (largestUnitIndex > smallestUnitIndex) largestUnit = smallestUnit;

    const roundingIncrement = options && options.roundingIncrement;
    const roundingMode = getOption(options, 'roundingMode', ROUNDING_MODES, 'nearest');
    const dateUnits = ['years', 'months', 'weeks', 'days'];
    const wantDateUnits = dateUnits.includes(largestUnit);
    const wantDateUnitsOnly = dateUnits.includes(smallestUnit);

    if (wantDateUnits && this._tz.id != other._tz.id) {
      throw new RangeError(
        "When calculating difference between time zones, `largestUnit` must be `'hours'` " +
          'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
      );
    }

    if (wantDateUnitsOnly && roundingIncrement !== undefined && roundingIncrement !== 1) {
      throw new RangeError('`roundingIncrement` other than 1 is not allowed for `smallestUnit` of `days` or larger');
    }

    // TODO: remove this after relativeTo lands for duration.add
    function adjustDay(d, direction, relativeTo) {
      const sum = relativeTo._dt.add(d);
      const oneDayEarlier = sum.add({ days: direction });
      const result = oneDayEarlier.difference(relativeTo._dt, {
        largestUnit: 'years',
        smallestUnit: 'days',
        roundingMode: 'ceil'
      });

      return result;
    }

    const direction = ZonedDateTime.compare(this, other);
    if (direction === 0) return new Temporal.Duration();

    if (!wantDateUnits) {
      // The user is only asking for a time difference, so return difference of instants.
      return this._abs.difference(other._abs, {
        largestUnit: largestUnit,
        smallestUnit: smallestUnit,
        roundingIncrement,
        roundingMode
      });
    }

    // Find the difference in dates only.
    let dateDuration = this._dt.difference(other._dt, { largestUnit, smallestUnit: 'days', roundingMode: 'trunc' });
    let zdtIntermediate = other.add(dateDuration); // may disambiguate

    // If clock time after addition was in the middle of a skipped period, the
    // endpoint was disambiguated to a later clock time. So it's possible that
    // the resulting disambiguated result is later than `this`. If so, then back
    // up one day and try again. Repeat if necessary (some transitions are
    // > 24 hours) until either there's zero days left or the date duration is
    // back inside the period where it belongs. Note that this case only can
    // happen for positive durations because the only direction that
    // `disambiguation: 'compatible'` can change clock time is forwards.
    while (direction === 1 && dateDuration.sign === 1 && ZonedDateTime.compare(zdtIntermediate, this) > 0) {
      // TODO: after PlainDate.add rounding lands, uncomment use of relativeTo
      // dateDuration = dateDuration.subtract({ days: -1, relativeTo: other._dt });
      dateDuration = adjustDay(dateDuration, -1, other);
      zdtIntermediate = other.add(dateDuration); // may do disambiguation
    }

    let isOverflow = false;
    let dayLengthNs = 0;
    let timeRemainderNs = 0;
    do {
      // calculate length of the next day (day that contains the time remainder)
      const oneDayFartherDuration = adjustDay(dateDuration, direction, other);
      const oneDayFarther = other.add(oneDayFartherDuration);
      dayLengthNs = oneDayFarther._abs.difference(zdtIntermediate._abs, { largestUnit: 'nanoseconds' }).nanoseconds;
      timeRemainderNs = this._abs.difference(zdtIntermediate._abs, { largestUnit: 'nanoseconds' }).nanoseconds;
      isOverflow = (timeRemainderNs - dayLengthNs) * direction >= 0;
      if (isOverflow) {
        dateDuration = oneDayFartherDuration;
        zdtIntermediate = oneDayFarther;
      }
    } while (isOverflow);

    // if there's no time remainder, we're done!
    if (timeRemainderNs === 0) return dateDuration;

    if (wantDateUnitsOnly) {
      // There's a time remainder and `smallestUnit` is `days` or larger. This
      // means that there will be no time remainder in the final result. and
      // that we may have to round from hours to days. there will be no time
      // remainder in the final result.
      const fraction = direction * (timeRemainderNs / dayLengthNs);
      // Conveniently, rounding methods' names mostly match `Math` functions. If
      // we add more rounding methods, probably need to change this trick.
      const roundingMethod = roundingMode === 'nearest' ? 'round' : roundingMode;
      const rounded = Math[roundingMethod](fraction);
      if (rounded) dateDuration = adjustDay(dateDuration, direction, other);
      return dateDuration;
    } else {
      // There's a time remainder and `smallestUnit` is `hours` or smaller.
      // Calculate the time remainder (with rounding).
      let timeDuration = this._abs.difference(zdtIntermediate._abs, {
        largestUnit: 'hours',
        smallestUnit: smallestUnit,
        roundingIncrement,
        roundingMode
      });

      // There's one more round of rounding possible: the time duration above
      // could have rounded up into enough hours to exceed the day length. If
      // this happens, grow the date duration by a single day and re-run the
      // time rounding on the smaller remainder. DO NOT RECURSE, because once
      // the extra hours are sucked up into the date duration, there's no way
      // for another full day to come from the next round of rounding. And if
      // it were possible (e.g. contrived calendar with 30-minute-long "days")
      // then it'd risk an infinite loop.
      timeRemainderNs = timeDuration.round({ largestUnit: 'nanoseconds', smallestUnit: 'nanoseconds' }).nanoseconds;
      isOverflow = (timeRemainderNs - dayLengthNs) * direction >= 0;
      if (isOverflow) {
        dateDuration = adjustDay(dateDuration, direction, other);
        timeRemainderNs -= dayLengthNs;
        timeDuration = Temporal.Duration.from({ nanoseconds: timeRemainderNs }).round({
          largestUnit: 'hours',
          smallestUnit: smallestUnit,
          roundingIncrement,
          roundingMode
        });
      }

      // Finally, merge the date and time durations and return the merged result.
      return mergeDuration({ dateDuration, timeDuration });
    }
  }

  /**
   * Rounds a `Temporal.ZonedDateTime` to a particular unit
   *
   * Available options:
   * - `smallestUnit` (required string) - The unit to round to. Valid values are
   *   'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', and
   *   'nanosecond'.
   * - `roundingIncrement` (number) - The granularity to round to, of the unit
   *   given by smallestUnit. The default is 1.
   * - `roundingMode` (string) - How to handle the remainder. Valid values are
   *   'ceil', 'floor', 'trunc', and 'nearest'. The default is 'nearest'.
   */
  round(options) {
    // first, round the underlying DateTime fields
    const rounded = this._dt.round(options);

    // TODO: there's a case not yet implemented here: if there's a DST
    // transition during the current day, then it's ignored by rounding. For
    // example, using the `nearest` mode a time of 11:45 would round up in
    // DateTime rounding but should round down if the day is 23 hours long.
    // The difference() implementation below shows one way to do this rounding.

    // Now reset all DateTime fields but leave the TimeZone. The offset will
    // also be retained (using the default `offset: 'prefer'` option of `with`)
    // if the new date/time values are still OK with the old offset. Otherwise
    // the offset will be changed to be compatible with the new date/time
    // values. If DST disambiguation is required, the `compatible`
    // disambiguation algorithm will be used.
    const result = this.with(rounded.getFields());
    return result;
  }

  /**
   * Convert to a localized string.
   *
   * This works the same as `DateTime.prototype.toLocaleString`, except time
   * zone option is automatically set and cannot be overridden by the caller.
   */
  toLocaleString(locales, options) {
    const timeZoneOption = options == null ? undefined : options.timeZone;
    if (timeZoneOption !== undefined && new Temporal.TimeZone(timeZoneOption).id !== this._tz.id) {
      throw new RangeError(`Time zone option ${timeZoneOption} does not match actual time zone ${this._tz.toString()}`);
    }
    const revisedOptions = options ? { ...options, timeZone: this._tz.id } : { timeZone: this._tz.id };
    return this._abs.toLocaleString(locales, revisedOptions);
  }

  /**
   * String representation of this `Temporal.ZonedDateTime` in ISO 8601 format
   * extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toJSON() {
    return this.toString();
  }
  /**
   * String representation of this `Temporal.ZonedDateTime` in ISO 8601 format
   * extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toString() {
    const calendar = this._dt.calendar.id === 'iso8601' ? '' : `[c=${this._dt.calendar.id}]`;
    return `${this._dt.withCalendar('iso8601')}${this.offset}[${this._tz.id}]${calendar}`;
  }

  // the fields and methods below are identical to DateTime

  get era() {
    return this._dt.era;
  }
  get year() {
    return this._dt.year;
  }
  get month() {
    return this._dt.month;
  }
  get day() {
    return this._dt.day;
  }
  get hour() {
    return this._dt.hour;
  }
  get minute() {
    return this._dt.minute;
  }
  get second() {
    return this._dt.second;
  }
  get millisecond() {
    return this._dt.millisecond;
  }
  get microsecond() {
    return this._dt.microsecond;
  }
  get nanosecond() {
    return this._dt.nanosecond;
  }
  get dayOfWeek() {
    return this._dt.dayOfWeek;
  }
  get dayOfYear() {
    return this._dt.dayOfYear;
  }
  get weekOfYear() {
    return this._dt.weekOfYear;
  }
  get daysInYear() {
    return this._dt.daysInYear;
  }
  get daysInMonth() {
    return this._dt.daysInMonth;
  }
  get daysInWeek() {
    return this._dt.daysInWeek;
  }
  get monthsInYear() {
    return this._dt.monthsInYear;
  }
  get isLeapYear() {
    return this._dt.isLeapYear;
  }
  toDate() {
    return this._dt.toDate();
  }
  toYearMonth() {
    return this._dt.toYearMonth();
  }
  toMonthDay() {
    return this._dt.toMonthDay();
  }
  toTime() {
    return this._dt.toTime();
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  /**
   * Returns the number of full seconds between `this` and 00:00 UTC on
   * 1970-01-01, otherwise known as the [UNIX
   * Epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   * This property has the same value as `this.toInstant().epochSeconds`. Any
   * fractional seconds are truncated towards zero. Note that the time zone is
   * irrelevant to this property because time because there is only one epoch,
   * not one per time zone.
   */
  get epochSeconds() {
    return this._abs.epochSeconds;
  }
  /**
   * Returns the integer number of full milliseconds between `this` and 00:00
   * UTC on 1970-01-01, otherwise known as the [UNIX
   * Epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   * This property has the same value as `this.toInstant().epochMilliseconds`.
   * Any fractional milliseconds are truncated towards zero. Note that the time
   * zone is irrelevant to this property because time because there is only one
   * epoch, not one per time zone.
   *
   * Use this property to convert a Temporal.ZonedDateTime to a legacy `Date`
   * object:
   * ```
   * legacyDate = new Date(zdt.epochMilliseconds);
   * ```
   */
  get epochMilliseconds() {
    return this._abs.epochMilliseconds;
  }
  /**
   * Returns the `bigint` number of full microseconds (one millionth of a
   * second) between `this` and 00:00 UTC on 1970-01-01, otherwise known as the
   * [UNIX Epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   * This property has the same value as `this.toInstant().epochMicroseconds`.
   * Any fractional microseconds are truncated towards zero. Note that the time
   * zone is irrelevant to this property because time because there is only one
   * epoch, not one per time zone.
   */
  get epochMicroseconds() {
    return this._abs.epochMicroseconds;
  }
  /**
   * Returns the `bigint` number of nanoseconds (one billionth of a second)
   * between `this` and 00:00 UTC on 1970-01-01, otherwise known as the [UNIX
   * Epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   * This property has the same value as `this.toInstant().epochNanoseconds`.
   * Note that the time zone is irrelevant to this property because time because
   * there is only one epoch, not one per time zone.
   */
  get epochNanoseconds() {
    return this._abs.epochNanoseconds;
  }
}

/** Split a duration into a {dateDuration, timeDuration} */
function splitDuration(durationLike) {
  const { years = 0, months = 0, weeks = 0, days = 0 } = durationLike;
  const dateDuration = Temporal.Duration.from({ years, months, weeks, days });
  const { hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 } = durationLike;
  const timeDuration = Temporal.Duration.from({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
  return { dateDuration, timeDuration };
}

/** Merge a {dateDuration, timeDuration} into one duration */
function mergeDuration({ dateDuration, timeDuration }) {
  const { years = 0, months = 0, weeks = 0, days = 0 } = dateDuration;
  const { hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 } = timeDuration;
  return Temporal.Duration.from({
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  });
}

const SMALLEST_UNITS = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds'
];

const LARGEST_UNITS = [...SMALLEST_UNITS, 'auto'];

const DISAMBIGUATION_OPTIONS = ['compatible', 'earlier', 'later', 'reject'];

const OFFSET_OPTIONS = ['use', 'prefer', 'ignore', 'reject'];

const OVERFLOW_OPTIONS = ['constrain', 'reject'];

const ROUNDING_MODES = ['nearest', 'ceil', 'trunc', 'floor'];

function getOption(options, property, allowedValues, fallback) {
  if (options === null || options === undefined) return fallback;
  options = ES.ToObject(options);
  let value = options[property];
  if (value !== undefined) {
    value = ES.ToString(value);
    if (!allowedValues.includes(value)) {
      throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
    }
    return value;
  }
  return fallback;
}

const ES = {
  ToString: ToString,
  ToObject: ToObject
};

// copied from ecmascript.mjs
// TODO: update to support sub-minute offsets https://github.com/tc39/proposal-temporal/issues/935
function formatOffsetString(offsetNanoseconds) {
  const sign = offsetNanoseconds < 0 ? '-' : '+';
  offsetNanoseconds = Math.abs(offsetNanoseconds);
  const offsetMinutes = Math.floor(offsetNanoseconds / 60e9);
  const offsetMinuteString = `00${offsetMinutes % 60}`.slice(-2);
  const offsetHourString = `00${Math.floor(offsetMinutes / 60)}`.slice(-2);
  return `${sign}${offsetHourString}:${offsetMinuteString}`;
}

// copied from ecmascript.mjs
// TODO: update to support sub-minute offsets https://github.com/tc39/proposal-temporal/issues/935
const OFFSET = /^([+-\u2212])([0-2][0-9])(?::?([0-5][0-9]))?$/;
function parseOffsetString(s) {
  const match = OFFSET.exec(String(s));
  if (!match) return null;
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  return sign * (hours * 60 + minutes) * 60 * 1e9;
}

function compareStrings(s1, s2) {
  if (s1 === s2) return 0;
  if (s1 < s2) return -1;
  return 1;
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');
