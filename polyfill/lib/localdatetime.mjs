import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import ToInteger from 'es-abstract/2019/ToInteger.js';
import ToObject from 'es-abstract/2019/ToObject.js';
import ToString from 'es-abstract/2019/ToString.js';

const Temporal = {
  get DateTime() {
    return GetIntrinsic('%Temporal.DateTime%');
  },
  get Absolute() {
    return GetIntrinsic('%Temporal.Absolute%');
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

/** Build a `Temporal.LocalDateTime` instance from a property bag object */
function fromObject(item, options) {
  const overflowOption = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  const offsetOption = getOption(options, 'offset', OFFSET_OPTIONS, 'use');
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');

  const { timeZone: tzOrig, timeZoneOffsetNanoseconds } = item;
  if (tzOrig === undefined) {
    throw new TypeError('Required property `timeZone` is missing');
  }
  const tz = Temporal.TimeZone.from(tzOrig);

  let offset = undefined;
  if (timeZoneOffsetNanoseconds !== undefined) {
    if (typeof timeZoneOffsetNanoseconds !== 'number' || isNaN(timeZoneOffsetNanoseconds)) {
      throw RangeError(
        `The \`timeZoneOffsetNanoseconds\` numeric property has an invalid value: ${timeZoneOffsetNanoseconds}`
      );
    }
    offset = ES.FormatTimeZoneOffsetString(timeZoneOffsetNanoseconds);
  }

  // TODO: https://github.com/tc39/proposal-temporal/issues/607
  const dt = Temporal.DateTime.from(item, { disambiguation: overflowOption });
  return fromCommon(dt, tz, offset, disambiguation, offsetOption);
}

/** Build a `Temporal.LocalDateTime` instance from an ISO 8601 extended string */
function fromIsoString(isoString, options) {
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');
  const offsetOption = getOption(options, 'offset', OFFSET_OPTIONS, 'use');
  const overflowOption = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');

  // TODO: use public parse API after it lands
  const {
    zone: { ianaName, offset },
    dateTime: dateTimeString,
    calendar: calendarString
  } = ES.parse(isoString);

  if (!ianaName) {
    throw new Error(
      "Missing time zone. Either append a time zone identifier (e.g. '2011-12-03T10:15:30+01:00[Europe/Paris]')" +
        ' or create differently (e.g. `Temporal.Absolute.from(isoString).toLocalDateTime(timeZone)`).'
    );
  }

  const dateTimeWithCalendarString = calendarString == null ? dateTimeString : `${dateTimeString}[c=${calendarString}]`;
  // TODO: https://github.com/tc39/proposal-temporal/issues/607
  const dt = Temporal.DateTime.from(dateTimeWithCalendarString, { disambiguation: overflowOption });
  const tz = Temporal.TimeZone.from(ianaName);
  return fromCommon(dt, tz, offset, disambiguation, offsetOption);
}

/** Shared logic for the object and string forms of `from` */
function fromCommon(dt, timeZone, offset, disambiguation, offsetOption) {
  // TODO: switch from using offset strings to using offset nanoseconds, to
  // support those weird cases of sub-minute offsets that can't be captured in
  // an ISO string.
  if (offset == null || offsetOption === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Absolute in the given time zone.
    return fromDateTime(dt, timeZone, { disambiguation });
  }

  // Calculate the absolute for the input's date/time and offset
  const isoString = `${dt.withCalendar('iso8601')}${offset}`;
  const absWithInputOffset = Temporal.Absolute.from(isoString);

  if (
    offsetOption === 'use' ||
    absWithInputOffset.equals(dt.toAbsolute(timeZone, { disambiguation: 'earlier' })) ||
    absWithInputOffset.equals(dt.toAbsolute(timeZone, { disambiguation: 'later' }))
  ) {
    // The caller wants the offset to always win ('use') OR the caller is OK
    // with the offset winning ('prefer' or 'reject') as long as it's valid for
    // this timezone and date/time.
    return new LocalDateTime(absWithInputOffset.getEpochNanoseconds(), timeZone, dt.calendar);
  }

  // If we get here, then the user-provided offset doesn't match any absolutes
  // for this time zone and date/time.
  if (offsetOption === 'reject') {
    throw new RangeError(`Offset of '${offset}' is not valid for '${dt}' in '${timeZone}'`);
  } else {
    // offsetOption === 'prefer', but the offset doesn't match so fall back to
    // use the time zone instead.
    return fromDateTime(dt, timeZone, { disambiguation });
  }
}

function fromDateTime(dateTime, timeZone, options) {
  return new LocalDateTime(dateTime.toAbsolute(timeZone, options).getEpochNanoseconds(), timeZone, dateTime.calendar);
}

/** Identical logic for `plus` and `minus` */
function doPlusOrMinus(op, durationLike, options, localDateTime) {
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  // TODO: edit below depending on https://github.com/tc39/proposal-temporal/issues/607
  const dateTimeOverflowOption = { disambiguation: overflow };
  const { timeZone, calendar } = localDateTime;

  const { timeDuration, dateDuration } = splitDuration(durationLike);
  if (isZeroDuration(dateDuration)) {
    // If there's only a time to add/subtract, then use absolute math because
    // RFC 5545 specifies using absolute math for time units.
    const result = localDateTime.toAbsolute()[op](durationLike);
    return new LocalDateTime(result.getEpochNanoseconds(), timeZone, calendar);
  } else if (isZeroDuration(timeDuration)) {
    const newDateTime = localDateTime.toDateTime()[op](dateDuration, dateTimeOverflowOption);
    return fromDateTime(newDateTime, timeZone);
  }

  // If we get here, there's both a date and time portion of the duration. RFC
  // 5545 requires the date portion to be added/subtracted in calendar days and
  // the time portion to be added/subtracted in exact (absolute) time. The
  // easiest way to do this would be to first add/subtract the date using
  // DateTime math, then convert the intermediate result to Absolute, and then
  // add the time portion using Absolute math. The problem with that approach is
  // that the "convert the intermediate result to Absolute" step will possibly
  // require a DST disambiguation, which is weird to happen in the middle of the
  // duration instead of at the end. So instead, we'll achieve the same result
  // via a more roundabout way that avoids the intermediate disambiguation:
  // 1) First, add the entire duration using DateTime math
  // 2) Turn that DateTime into an Absolute, applying 'compatible'
  //    disambiguation (which is required by RFC 5545) at that endpoint.
  // 2) Starting from the Absolute endpoint, go backwards by the length of the
  //    time duration.
  // 3) At that point, if the offset is different from the endpoint's offset,
  //    then there was an offset change during the time duration.
  // 4) Adjust the Absolute endpoint by the difference in offsets from endpoint
  //    Absolute to intermediate Absolute...
  // 5) ...except if the adjustment causes moving back across the transition.
  // 6) Finally, create the result using the adjusted endpoint Absolute.
  const newDateTime = localDateTime.toDateTime()[op](durationLike, dateTimeOverflowOption);
  let absolute = newDateTime.toAbsolute(timeZone);
  const reverseOp = op === 'plus' ? 'minus' : 'plus';
  const backUpAbs = absolute[reverseOp]({ nanoseconds: totalNanoseconds(timeDuration) });
  const backUpOffset = timeZone.getOffsetNanosecondsFor(backUpAbs);
  const absOffset = timeZone.getOffsetNanosecondsFor(absolute);
  const backUpNanoseconds = absOffset - backUpOffset;
  if (backUpNanoseconds) {
    // RFC 5545 specifies that time units are always "exact time" meaning they
    // aren't affected by DST. Therefore, if there was a TZ transition during
    // the time duration that was added, then undo the impact of that
    // transition. However, don't adjust if applying the adjustment would cause
    // us to back up onto the other side of the transition.
    const backUpOp = backUpNanoseconds < 0 ? 'minus' : 'plus';
    const adjustedAbs = absolute[backUpOp]({ nanoseconds: backUpNanoseconds });
    if (timeZone.getOffsetNanosecondsFor(adjustedAbs) === timeZone.getOffsetNanosecondsFor(absolute)) {
      absolute = adjustedAbs;
    }
  }
  return new LocalDateTime(absolute.getEpochNanoseconds(), timeZone, calendar);
}

function totalNanoseconds(d) {
  if (!isZeroDuration(splitDuration(d).dateDuration)) {
    throw new RangeError('Duration must be limited to hours or smaller units');
  }
  return (
    d.hours * 3.6e12 + d.minutes * 6e10 + d.seconds * 1e9 + d.milliseconds * 1e6 + d.microseconds * 1000 + d.nanoseconds
  );
}

export class LocalDateTime {
  /**
   * Construct a new `Temporal.LocalDateTime` instance from an absolute
   * timestamp, time zone, and optional calendar.
   *
   * To construct a `Temporal.LocalDateTime` from an ISO 8601 string a
   * `DateTime` and time zone, use `.from()`.
   *
   * @param epochNanoseconds {Temporal.Absolute} - absolute timestamp (in
   * nanoseconds since UNIX epoch) for this instance
   * @param timeZone {Temporal.TimeZone} - time zone for this instance
   * @param [calendar=Temporal.Calendar.from('iso8601')] {Temporal.CalendarProtocol} -
   * calendar for this instance (defaults to ISO calendar)
   */
  constructor(epochNanoseconds, timeZone, calendar) {
    // TODO: remove the cast below once https://github.com/tc39/proposal-temporal/issues/810 is resolved
    this._tz = Temporal.TimeZone.from(timeZone);
    this._abs = new Temporal.Absolute(epochNanoseconds);
    this._dt = this._abs.toDateTime(this._tz, calendar && Temporal.Calendar.from(calendar));
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
   * Build a `Temporal.LocalDateTime` instance from one of the following:
   * - Another LocalDateTime instance, in which case the result will deep-clone
   *   the input.
   * - A "LocalDateTime-like" property bag object with required properties
   *   `timeZone`, `year`, `month`, and `day`. Other fields (time fields and
   *   `timeZoneOffsetNanoseconds`) are optional. If `timeZoneOffsetNanoseconds`
   *   is not provided, then the time can be ambiguous around DST transitions.
   *   The `disambiguation` option can resolve this ambiguity.
   * - An extended ISO 8601 string that includes a time zone identifier, e.g.
   *   `2007-12-03T10:15:30+01:00[Europe/Paris]`. If a timezone offset is not
   *   present, then the `disambiguation` option will be used to resolve any
   *   ambiguity. Note that an ISO string ending in "Z" (a UTC time) will not be
   *   accepted via a string parameter. Instead, the caller must explicitly
   *   opt-in to UTC, e.g.
   *   Temporal.Absolute.from(isoString).toLocalDateTime('UTC'}`
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
   * offset?: 'use' (default) | 'prefer' | 'ignore' | 'reject'
   * ```
   */
  static from(item, options) {
    if (item instanceof Temporal.DateTime) {
      throw new TypeError('Time zone is missing. Try `dateTime.toLocalDateTime(timeZone)`.');
    }
    if (item instanceof Temporal.Absolute) {
      throw new TypeError('Time zone is missing. Try `absolute.toLocalDateTime(timeZone}`.');
    }
    if (item instanceof LocalDateTime) {
      return new LocalDateTime(item._abs.getEpochNanoseconds(), item._tz, item._dt.calendar);
    }
    return typeof item === 'object' ? fromObject(item, options) : fromIsoString(item.toString(), options);
  }

  /**
   * Merge fields into an existing `Temporal.LocalDateTime`. The provided `item`
   * is a "LocalDateTime-like" object. Accepted fields include:
   * - All `Temporal.DateTime` fields, including `calendar`
   * - `timeZone` as a time zone identifier string like `Europe/Paris` or a
   *   `Temporal.TimeZone` instance
   * - `timezoneOffsetNanoseconds`
   *
   * If the `timeZone` field is included, `with` will first convert all existing
   * fields to the new time zone and then fields in the input will be played on
   * top of the new time zone. Therefore, `.with({timeZone})` is an easy way to
   * convert to a new time zone while updating the clock time.  However, to keep
   * clock time as-is while resetting the time zone, use the `toDateTime()`
   * method. Examples:
   * ```
   * const sameInstantInOtherTz = ldt.with({timeZone: 'Europe/London'});
   * const newTzSameLocalTime = ldt.toDateTime().toLocalDateTime('Europe/London');
   * ```
   *
   * If the `timezoneOffsetNanoseconds` field is provided, then it's possible
   * for it to conflict with the input object's `timeZone` property or, if
   * omitted, the object's existing time zone.  The `offset` option (which
   * defaults to `'prefer'`) will resolve the conflict.
   *
   * If the `timezoneOffsetNanoseconds` field is not provided, but the
   * `timeZone` field is not provided either, then the existing
   * `timezoneOffsetNanoseconds` field will be used by `with` as if it had been
   * provided by the caller. By default, this will prefer the existing offset
   * when resolving ambiguous results. For example, if a
   * `Temporal.LocalDateTime` is set to the "second" 1:30AM on a day where the
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
  with(localDateTimeLike, options) {
    if (typeof localDateTimeLike !== 'object') {
      throw new TypeError("Parameter 'localDateTimeLike' must be an object");
    }
    // TODO: validate and normalize input fields

    // Options are passed through to `from` with one exception: the default
    // `offset` option is `prefer` to support changing DateTime fields while
    // retaining the option if possible.
    const updatedOptions = options ? { ...options } : {};
    if (updatedOptions.offset === undefined) updatedOptions.offset = 'prefer';

    const { timeZone, calendar, timeZoneOffsetNanoseconds } = localDateTimeLike;

    const newTimeZone = timeZone && Temporal.TimeZone.from(timeZone);
    const newCalendar = calendar && Temporal.Calendar.from(calendar);

    const updateOffset = timeZoneOffsetNanoseconds !== undefined;
    const updateTimeZone = newTimeZone && newTimeZone.name !== this._tz.name;
    const updateCalendar = newCalendar && newCalendar.id !== this.calendar.id;

    if (updateOffset && (typeof timeZoneOffsetNanoseconds !== 'number' || isNaN(timeZoneOffsetNanoseconds))) {
      throw RangeError(
        `The \`timeZoneOffsetNanoseconds\` numeric property has an invalid value: ${timeZoneOffsetNanoseconds}`
      );
    }

    // Changing `timeZone` or `calendar` will create a new instance, and then
    // other input fields will be played on top of it.
    let base = this; // eslint-disable-line @typescript-eslint/no-this-alias

    if (updateTimeZone || updateCalendar) {
      const tz = newTimeZone || base._tz;
      const cal = newCalendar || base.calendar;
      base = new LocalDateTime(base._abs.getEpochNanoseconds(), tz, cal);
    }

    // Deal with the rest of the fields. If there's a change in tz offset, it'll
    // be handled by `from`. Also, if we're not changing the time zone or offset,
    // then pass the existing offset to `from`. (See docs for more info.)
    const { timeZoneOffsetNanoseconds: originalOffset, ...fields } = base.getFields();
    if (!updateOffset && !updateTimeZone) {
      fields.timeZoneOffsetNanoseconds = originalOffset;
    }
    const merged = { ...fields, ...localDateTimeLike };
    return LocalDateTime.from(merged, updatedOptions);
  }

  /**
   * Get a new `Temporal.LocalDateTime` instance that uses a specific calendar.
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
   * Returns the absolute timestamp of this `Temporal.LocalDateTime` instance as
   * a `Temporal.Absolute`.
   */
  toAbsolute() {
    return Temporal.Absolute.from(this._abs);
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
   * Returns the `Temporal.Calendar` for this `Temporal.LocalDateTime` instance.
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
   * `Temporal.LocalDateTime` instance.
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
    const today = this.toDate().toDateTime(new Temporal.Time());
    const tomorrow = today.plus({ days: 1 });
    // TODO: add tests for Azores timezone on midnight of a DST transition
    const todayAbs = today.toAbsolute(this._tz);
    const tomorrowAbs = tomorrow.toAbsolute(this._tz);
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
   * True if this `Temporal.LocalDateTime` instance falls exactly on a DST
   * transition or other change in time zone offset, false otherwise.
   *
   * To calculate if a DST transition happens on the same day (but not
   * necessarily at the same time), use `.getDayDuration()`.
   * */
  get isTimeZoneOffsetTransition() {
    const oneNsBefore = this.minus({ nanoseconds: 1 });
    return oneNsBefore.timeZoneOffsetNanoseconds !== this.timeZoneOffsetNanoseconds;
  }

  /**
   * Offset (in nanoseconds) relative to UTC of the current time zone and
   * absolute instant.
   *
   * The value of this field will change after DST transitions or after legal
   * changes to a time zone, e.g. a country switching to a new time zone.
   *
   * Because this field is able to uniquely map a `Temporal.DateTime` to an
   * absolute date/time, this field is returned by `getFields()` and is accepted
   * by `from` and `with`.
   * */
  get timeZoneOffsetNanoseconds() {
    return this._tz.getOffsetNanosecondsFor(this._abs);
  }

  /**
   * Offset (as a string like `'+05:00'` or `'-07:00'`) relative to UTC of the
   * current time zone and absolute instant.
   *
   * This property is useful for custom formatting of LocalDateTime instances.
   *
   * This field cannot be passed to `from` and `with`.  Instead, use
   * `timeZoneOffsetNanoseconds`.
   * */
  get timeZoneOffsetString() {
    return this._tz.getOffsetStringFor(this._abs);
  }

  /**
   * Returns a plain object containing enough data to uniquely identify
   * this object.
   *
   * The resulting object includes all fields returned by
   * `Temporal.DateTime.prototype.getFields()`, as well as `timeZone`,
   * and `timeZoneOffsetNanoseconds`.
   *
   * The result of this method can be used for round-trip serialization via
   * `from()`, `with()`, or `JSON.stringify`.
   */
  getFields() {
    const { timeZone, timeZoneOffsetNanoseconds } = this;
    return {
      timeZone,
      timeZoneOffsetNanoseconds,
      ...this._dt.getFields()
    };
  }

  /**
   * Method for internal use by non-ISO calendars. Normally not used.
   *
   * TODO: are calendars aware of `Temporal.LocalDateTime`?  If not, remove this
   * method.
   */
  getISOCalendarFields() {
    const { timeZone, timeZoneOffsetNanoseconds } = this;
    return {
      timeZone,
      timeZoneOffsetNanoseconds,
      ...this._dt.getISOCalendarFields()
    };
  }

  /**
   * Compare two `Temporal.LocalDateTime` values.
   *
   * Comparison will use the absolute time because sorting is almost always
   * based on when events happened in the real world, but during the hour before
   * and after DST ends in the fall, sorting of clock time will not match the
   * real-world sort order.
   *
   * In the very unusual case of sorting by clock time instead, use
   * `.toDateTime()` on both instances and use `Temporal.DateTime`'s `compare`
   * method.
   */
  static compare(one, two) {
    return Temporal.Absolute.compare(one._abs, two._abs);
  }

  /**
   * Returns `true` if both the absolute timestamp and time zone are identical
   * to the other `Temporal.LocalDateTime` instance, and `false` otherwise. To
   * compare only the absolute timestamps and ignore time zones, use
   * `.toAbsolute().compare()`.
   */
  equals(other) {
    return LocalDateTime.compare(this, other) === 0;
  }

  /**
   * Add a `Temporal.Duration` and return the result.
   *
   * Dates will be added using calendar dates while times will be added with
   * absolute time.
   *
   * Available options:
   * ```
   * overflow?: 'constrain' (default) | 'reject'
   * ```
   */
  plus(durationLike, options) {
    return doPlusOrMinus('plus', durationLike, options, this);
  }

  /**
   * Subtract a `Temporal.Duration` and return the result.
   *
   * Dates will be subtracted using calendar dates while times will be
   * subtracted with absolute time.
   *
   * Available options:
   * ```
   * overflow?: 'constrain' (default) | 'reject'
   * ```
   */
  minus(durationLike, options) {
    return doPlusOrMinus('minus', durationLike, options, this);
  }

  /**
   * Calculate the difference between two `Temporal.LocalDateTime` values and
   * return the `Temporal.Duration` result.
   *
   * The duration returned is a "hybrid" duration. The date portion represents
   * full calendar days like `DateTime.prototype.difference` would return. The
   * time portion represents real-world elapsed time like
   * `Absolute.prototype.difference` would return. This "hybrid duration"
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
   * as if `Temporal.Absolute.prototype.difference` was used.
   *
   * If both values have the same local time, then the result will be the same
   * as if `Temporal.DateTime.prototype.difference` was used.
   *
   * If the other `Temporal.LocalDateTime` is in a different time zone, then the
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
   * largestUnit: 'years' | 'months' | 'weeks' | 'days' | 'hours' (default) | 'minutes' | 'seconds'
   * ```
   */
  difference(other, options) {
    const largestUnit = toLargestTemporalUnit(options, 'hours');
    const dateUnits = ['years', 'months', 'weeks', 'days'];
    const wantDate = dateUnits.includes(largestUnit);

    // treat as absolute if the user is only asking for a time difference
    if (!wantDate) {
      const largestUnitOptionBag = { largestUnit: largestUnit };
      return this._abs.difference(other._abs, largestUnitOptionBag);
    }
    const dtDiff = this._dt.difference(other._dt, { largestUnit });

    // If there's no change in timezone offset between this and other, then we
    // don't have to do any DST-related fixups. Just return the simple DateTime
    // difference.
    const diffOffset = this.timeZoneOffsetNanoseconds - other.timeZoneOffsetNanoseconds;
    if (diffOffset === 0) return dtDiff;

    // It's the hard case: the timezone offset is different so there's a
    // transition in the middle and we may need to adjust the result for DST.
    // RFC 5545 expects that date durations are measured in nominal (DateTime)
    // days, while time durations are measured in exact (Absolute) time.
    const { dateDuration, timeDuration } = splitDuration(dtDiff);
    if (isZeroDuration(timeDuration)) return dateDuration; // even number of calendar days

    // If we get here, there's both a time and date part of the duration AND
    // there's a time zone offset transition during the duration. RFC 5545 says
    // that we should calculate full days using DateTime math and remainder
    // times using absolute time. To do this, we calculate a `dateTime`
    // difference, split it into date and time portions, and then convert the
    // time portion to an `absolute` duration before returning to the caller.  A
    // challenge: converting the time duration involves a conversion from
    // `DateTime` to `Absolute` which can be ambiguous. This can cause
    // unpredictable behavior because the disambiguation is happening inside of
    // the duration, not at its edges like in `plus` or `from`. We'll reduce the
    // chance of this unpredictability as follows:
    // 1. First, calculate the time portion as if it's closest to `other`.
    // 2. If the time portion in (1) contains a tz offset transition, then
    //    reverse the calculation and assume that the time portion is closest to
    //    `this`.
    //
    // The approach above ensures that in almost all cases, there will be no
    // "internal disambiguation" required. It's possible to construct a test
    // case where both `this` and `other` are both within 25 hours of a
    // different offset transition, but in practice this will be exceedingly
    // rare.
    let intermediateDt = this._dt.minus(dateDuration);
    let intermediateAbs = intermediateDt.toAbsolute(this._tz);
    let adjustedTimeDuration;
    if (this._tz.getOffsetNanosecondsFor(intermediateAbs) === other.timeZoneOffsetNanoseconds) {
      // The transition was in the date portion which is what we want.
      adjustedTimeDuration = intermediateAbs.difference(other._abs, { largestUnit: 'hours' });
    } else {
      // There was a transition in the time portion, so try assuming that the
      // time portion is on the other side next to `this`, where there's
      // unlikely to be another transition.
      intermediateDt = other._dt.plus(dateDuration);
      intermediateAbs = intermediateDt.toAbsolute(this._tz);
      adjustedTimeDuration = this._abs.difference(intermediateAbs, { largestUnit: 'hours' });
    }

    const hybridDuration = mergeDuration({ dateDuration, timeDuration: adjustedTimeDuration });
    return hybridDuration;
    // TODO: more tests for cases where intermediate value lands on a discontinuity
  }

  /**
   * Convert to a localized string.
   *
   * This works the same as `DateTime.prototype.toLocaleString`, except time
   * zone option is automatically set and cannot be overridden by the caller.
   */
  toLocaleString(locales, options) {
    const timeZoneOption = options == null ? undefined : options.timeZone;
    if (timeZoneOption !== undefined && new Temporal.TimeZone(timeZoneOption).name !== this._tz.name) {
      throw new RangeError(`Time zone option ${timeZoneOption} does not match actual time zone ${this._tz.toString()}`);
    }
    const revisedOptions = options ? { ...options, timeZone: this._tz.name } : { timeZone: this._tz.name };
    return this._abs.toLocaleString(locales, revisedOptions);
  }

  /**
   * String representation of this `Temporal.LocalDateTime` in ISO 8601 format
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
   * String representation of this `Temporal.LocalDateTime` in ISO 8601 format
   * extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toString() {
    const calendar = this._dt.calendar.id === 'iso8601' ? '' : `[c=${this._dt.calendar.id}]`;
    return `${this._dt.withCalendar('iso8601')}${this.timeZoneOffsetString}[${this._tz.name}]${calendar}`;
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
    throw new TypeError('use compare() or equals() to compare Temporal.LocalDateTime');
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

/** Returns true if every unit is zero, false otherwise. */
function isZeroDuration(duration) {
  const { months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  return !months && !weeks && !days && !hours && !minutes && !seconds && !milliseconds && !microseconds && !nanoseconds;
}

const PARSE = (() => {
  // Copied from regex.mjs. Once parsing lands, we can remove this copypasta and use the public API
  const yearpart = /(?:[+-]\d{6}|\d{4})/;
  const datesplit = new RegExp(`(${yearpart.source})(?:-(\\d{2})-(\\d{2})|(\\d{2})(\\d{2}))`);
  const timesplit = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/;
  const zonesplit = /(?:([zZ])|(?:([+-]\d{2})(?::?(\d{2}))?(?:\[([^c\]\s](?:[^=\]\s][^\]\s]*))?\])?))/;
  const calendar = /\[c=([^\]\s]+)\]/;

  const absolute = new RegExp(
    `^((${datesplit.source})(?:T)(${timesplit.source}))${zonesplit.source}(?:${calendar.source})?$`,
    'i'
  );

  const datetime = new RegExp(
    `^${datesplit.source}(?:(?:T|\\s+)${timesplit.source}(?:${zonesplit.source})?)?(?:${calendar.source})?$`,
    'i'
  );

  const time = new RegExp(`^${timesplit.source}(?:${zonesplit.source})?(?:${calendar.source})?$`, 'i');

  // The short forms of YearMonth and MonthDay are only for the ISO calendar.
  // Non-ISO calendar YearMonth and MonthDay have to parse as a Temporal.Date,
  // with the reference fields.
  // YYYYMM forbidden by ISO 8601, but since it is not ambiguous with anything
  // else we could parse in a YearMonth context, we allow it
  const yearmonth = new RegExp(`^(${yearpart.source})-?(\\d{2})$`);
  const monthday = /^(?:--)?(\d{2})-?(\d{2})$/;

  const offset = /([+-])([0-2][0-9])(?::?([0-5][0-9]))?/;
  const duration = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:[.,](\d{1,9}))?S)?)?/i;

  return { absolute, datetime, time, yearmonth, monthday, offset, duration, calendar };
})();

const LARGEST_DIFFERENCE_UNITS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

const DISAMBIGUATION_OPTIONS = ['compatible', 'earlier', 'later', 'reject'];

const OFFSET_OPTIONS = ['use', 'prefer', 'ignore', 'reject'];
const OVERFLOW_OPTIONS = ['constrain', 'reject'];

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

function toLargestTemporalUnit(options, fallback, disallowedStrings = []) {
  if (disallowedStrings.includes(fallback)) {
    throw new RangeError(`Fallback ${fallback} cannot be disallowed`);
  }
  const largestUnit = getOption(options, 'largestUnit', LARGEST_DIFFERENCE_UNITS, fallback);

  if (disallowedStrings.includes(largestUnit)) {
    throw new RangeError(`${largestUnit} not allowed as the largest unit here`);
  }
  return largestUnit;
}

const ES = {
  ToInteger: ToInteger,
  ToString: ToString,
  ToObject: ToObject,

  // replace this with public parsing API after it lands
  ParseFullISOString: (isoString) => {
    const match = PARSE.absolute.exec(isoString);
    if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    const absolute = match[0];
    const dateTime = match[1];
    const date = match[2];
    const yearMonth = `${match[3]}-${match[4]}`;
    const monthDay = `${match[4]}-${match[5]}`;
    const year = ES.ToInteger(match[3]);
    const month = ES.ToInteger(match[4]);
    const day = ES.ToInteger(match[5]);
    const time = match[8];
    const hour = ES.ToInteger(match[9]);
    const minute = ES.ToInteger(match[10]);
    let second = ES.ToInteger(match[11]);
    if (second === 60) second = 59;
    // Instead of figuring out what was wrong with the `absolute` regex, just
    // hack around the problem for now, because soon we'll have a public parse
    // method and can remove this code altogether.
    const fractionalSeconds = match[12] ? ES.ToInteger(`0.${match[12]}`) : 0;
    const millisecond = ES.ToInteger(fractionalSeconds * 1000);
    const microsecond = ES.ToInteger(fractionalSeconds * 1e6 - millisecond * 1000);
    const nanosecond = ES.ToInteger(fractionalSeconds * 1e9 - microsecond * 1000 - millisecond * 1e6);
    const offset = `${match[17]}:${match[18] || '00'}`;
    let ianaName = match[19];
    if (ianaName) {
      try {
        // Canonicalize name if it is an IANA link name or is capitalized wrong
        ianaName = Temporal.TimeZone.from(ianaName).toString();
      } catch {
        // Not an IANA name, may be a custom ID, pass through unchanged
      }
    }
    const zone = match[16] ? 'UTC' : ianaName || offset;
    const calendar = match[20] || null;
    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      zone,
      ianaName,
      offset,
      absolute,
      date,
      dateTime,
      yearMonth,
      monthDay,
      time,
      calendar
    };
  },

  parse: (isoString) => {
    const { absolute, dateTime, date, time, yearMonth, monthDay, ianaName, offset, calendar } = ES.ParseFullISOString(
      isoString
    );

    return {
      absolute,
      dateTime,
      date,
      time,
      yearMonth,
      monthDay,
      calendar,
      zone: { ianaName, offset }
    };
  },

  parseOffsetString: (string) => {
    const OFFSET = new RegExp(`^${PARSE.offset.source}$`);
    const match = OFFSET.exec(String(string));
    if (!match) return null;
    const sign = match[1] === '-' ? -1 : +1;
    const hours = +match[2];
    const minutes = +(match[3] || 0);
    return sign * (hours * 60 + minutes) * 60 * 1000;
  },

  FormatTimeZoneOffsetString: (offsetNanoseconds) => {
    const sign = offsetNanoseconds < 0 ? '-' : '+';
    offsetNanoseconds = Math.abs(offsetNanoseconds);
    const offsetMinutes = Math.floor(offsetNanoseconds / 60e9);
    const offsetMinuteString = `00${offsetMinutes % 60}`.slice(-2);
    const offsetHourString = `00${Math.floor(offsetMinutes / 60)}`.slice(-2);
    return `${sign}${offsetHourString}:${offsetMinuteString}`;
  }
};

MakeIntrinsicClass(LocalDateTime, 'Temporal.LocalDateTime');
