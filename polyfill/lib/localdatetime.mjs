import ES2019 from 'es-abstract/es2019.js';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';

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
  const { absolute, timeZone, calendar, timeZoneOffsetNanoseconds } = item;
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');

  if (!timeZone) {
    throw new TypeError("Required property 'timeZone' is missing");
  }

  const tz = Temporal.TimeZone.from(timeZone);
  const cal = calendar ? Temporal.Calendar.from(calendar) : undefined;

  // Simplest case: absolute + time zone + optional calendar
  if (absolute !== undefined) {
    const abs = Temporal.Absolute.from(absolute);
    const dt = abs.inTimeZone(tz, cal);
    if (timeZoneOffsetNanoseconds !== undefined) {
      checkCompareProperty('timeZoneOffsetNanoseconds', timeZoneOffsetNanoseconds, tz.getOffsetNanosecondsFor(abs), tz);
    }
    checkDateTimeFieldMatch(item, dt, tz);
    return new LocalDateTime(abs, tz, cal);
  } else {
    // there's no `absolute` so it's DateTime fields + time zone, with optional
    // time zone offset for disambiguation

    if (!isDateTimeLike(item)) {
      throw new Error('Either `absolute` or `year`, `month`, and `day` fields are required');
    }

    if (timeZoneOffsetNanoseconds === undefined) {
      // Simple case: no time zone offset, so use user-supplied disambiguation options
      // TODO: edit below depending on https://github.com/tc39/proposal-temporal/issues/607
      const dt = Temporal.DateTime.from(item, { disambiguation: overflow });
      const abs = dt.inTimeZone(tz, { disambiguation });
      return new LocalDateTime(abs, tz, dt.calendar);
    } else {
      // There is a time zone offset, so we'll have to pick the correct `Absolute`
      // matching that offset.
      // TODO: edit below depending on https://github.com/tc39/proposal-temporal/issues/607
      const dt = Temporal.DateTime.from(item, { disambiguation: overflow });
      const earlier = dt.inTimeZone(tz, { disambiguation: 'earlier' });
      const later = dt.inTimeZone(tz, { disambiguation: 'later' });
      if (Temporal.Absolute.compare(earlier, later) === 0) {
        // no ambiguity
        return new LocalDateTime(earlier, tz, dt.calendar);
      }

      // there are two choices, so figure out which one to return

      if (disambiguation === 'reject') {
        // delegate the exception throwing to Temporal.DateTime
        dt.inTimeZone(tz, { disambiguation });
        throw new Error('This code should be unreachable');
      }

      const earlierOffset = tz.getOffsetNanosecondsFor(earlier);
      const laterOffset = tz.getOffsetNanosecondsFor(later);

      if (earlierOffset === timeZoneOffsetNanoseconds) {
        if (disambiguation !== 'earlier') {
          throw new Error(
            `Requested \`timeZoneOffsetNanoseconds: ${timeZoneOffsetNanoseconds}\` conflicts with ` +
              "`options: {disambiguation: 'earlier'}` because the provided date and time is the later '" +
              `(not earlier) of two ambiguous times in time zone '${tz.toString()}'`
          );
        }
        return new LocalDateTime(earlier, tz, dt.calendar);
      } else if (laterOffset === timeZoneOffsetNanoseconds) {
        if (disambiguation !== 'later') {
          throw new Error(
            `Requested \`timeZoneOffsetNanoseconds: ${timeZoneOffsetNanoseconds}\` conflicts with ` +
              "`options: {disambiguation: 'later'}` because the provided date and time is the earlier " +
              `(not later) of two ambiguous times in time zone '${tz.toString()}'`
          );
        }
        return new LocalDateTime(later, tz, dt.calendar);
      } else {
        throw new Error(
          `Requested \`timeZoneOffsetNanoseconds: ${timeZoneOffsetNanoseconds}\` does not match either actual ` +
            `time zone offset ('${earlierOffset}' or '${laterOffset}') in time zone '${tz.toString()}'`
        );
      }
    }
  }
}

/** Build a `Temporal.LocalDateTime` instance from an ISO 8601 extended string */
function fromIsoString(isoString, options) {
  // TODO: use public parse API after it lands
  const {
    zone: { ianaName, offset },
    dateTime
  } = ES.parse(isoString);

  // TODO: should the string representation of an "offset time zone" include
  // the offset in brackets, or have nothing in brackets?  If "nothing", then
  // should `LocalDateTime.from` also accept bracket-less strings when parsing?
  if (!ianaName) {
    throw new Error(
      'Missing time zone in ISO 8601 string. Either append a time zone identifier ' +
        "(e.g. '2011-12-03T10:15:30+01:00[Europe/Paris]') or provide an `{absolute, timeZone}` object."
    );
  }

  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');
  const prefer = getOption(options, 'prefer', PREFER_OPTIONS, 'offset');
  const timeZone = Temporal.TimeZone.from(ianaName);
  const dt = Temporal.DateTime.from(dateTime);

  if (!offset) {
    // Simple case: ISO string without a TZ offset, so just convert the DateTime
    // to Absolute in the given time zone.
    const absolute = dt.inTimeZone(timeZone, { disambiguation });
    return new LocalDateTime(absolute, timeZone, dt.calendar);
  }

  // Find possible absolutes. Note that we can't use
  // `TimeZone.prototype.getPossibleAbsolutesFor` because we also need results
  // for the hour skipped by Spring DST transitions, and that API won't return
  // any values for those times.
  let possibleAbsolutes = [
    dt.inTimeZone(timeZone, { disambiguation: 'earlier' }),
    dt.inTimeZone(timeZone, { disambiguation: 'later' })
  ];

  if (possibleAbsolutes[0].equals(possibleAbsolutes[1])) possibleAbsolutes = [possibleAbsolutes[0]];

  // There are three possibilities:
  // 1) the user-provided offset matches one of the absolutes for the DateTime
  //    fields, so this is the correct offset
  // 2) the user-provided offset doesn't match any offset parsed from the
  //    DateTime fields, so rely on `prefer` to choose
  // 3) the user gave us an invalid DateTime. Throw.

  // If the user-provided tz offset matches one of the offsets of the DateTime
  // in this timezone, then this is the correct Absolute.
  for (const absolute of possibleAbsolutes) {
    const possibleOffset = timeZone.getOffsetStringFor(absolute);
    if (possibleOffset === offset) return new LocalDateTime(absolute, timeZone, dt.calendar);
  }

  // if we get here the offset in the ISO string doesn't match any of the
  // possible offsets of the DateTime in this timezone.
  if (prefer === 'reject') {
    throw new RangeError(`'${isoString}' doesn't uniquely identify a Temporal.LocalDateTime`);
  } else if (prefer === 'dateTime') {
    // User wants the IANA time zone identifier to win in case of ambiguity
    if (possibleAbsolutes.length === 1) return new LocalDateTime(possibleAbsolutes[0], timeZone, dt.calendar);
    let absolute;
    switch (disambiguation) {
      case 'earlier':
        absolute = possibleAbsolutes[0];
        break;
      case 'later':
        absolute = possibleAbsolutes[1];
        break;
      case 'compatible':
        absolute = timeZone.getPossibleAbsolutesFor(dt)[0] || dt.inTimeZone(timeZone, { disambiguation: 'later' });
        break;
      case 'reject':
      default:
        throw new RangeError(`'${isoString}' doesn't uniquely identify a Temporal.LocalDateTime`);
    }

    return new LocalDateTime(absolute, timeZone, dt.calendar);
  } else {
    // prefer === 'offset' (default)
    // User wants the offset to win, so build an ISO string with the DateTime
    // and this offset, and turn it into an Absolute.
    return new LocalDateTime(Temporal.Absolute.from(`${dt.toString()}${offset}`), timeZone, dt.calendar);
  }
}

/** Identical logic for `plus` and `minus` */
function doPlusOrMinus(op, durationLike, options, localDateTime) {
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');
  const durationKind = getOption(options, 'durationKind', CALCULATION_OPTIONS, 'hybrid');
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  // TODO: edit below depending on https://github.com/tc39/proposal-temporal/issues/607
  const dateTimeOverflowOption = { disambiguation: overflow };
  const { timeZone, calendar } = localDateTime;

  // Absolute doesn't use disambiguation, while RFC 5455 specifies 'compatible' behavior
  // for disambiguation. Therefore, only 'dateTime' durations can use this option.
  if (disambiguation !== 'compatible' && durationKind !== 'dateTime') {
    throw new RangeError('Arithmetic disambiguation is only allowed for `dateTime` durations');
  }

  switch (durationKind) {
    case 'absolute': {
      const result = localDateTime.absolute[op](durationLike);
      return new LocalDateTime(result, timeZone, calendar);
    }
    case 'dateTime': {
      const dateTime = localDateTime.toDateTime();
      const newDateTime = dateTime[op](durationLike, dateTimeOverflowOption);
      // If empty duration (no local date/time change), then clone `this` to
      // avoid disambiguation that might change the absolute.
      if (newDateTime.equals(dateTime)) return LocalDateTime.from(localDateTime);
      // Otherwise, return the result.
      const abs = newDateTime.inTimeZone(timeZone, { disambiguation });
      return new LocalDateTime(abs, timeZone, calendar);
    }
    case 'hybrid': {
      const { timeDuration, dateDuration } = splitDuration(durationLike);
      if (isZeroDuration(dateDuration)) {
        // If there's only a time to add/subtract, then use absolute math
        // because RFC 5545 specifies using absolute math for time units.
        const result = localDateTime.absolute[op](durationLike);
        return new LocalDateTime(result, timeZone, calendar);
      }

      // Add the units according to the largest-to-smallest order of operations
      // required by RFC 5545. Note that the same breakout is not required for
      // the time duration because all time units are the same length (because
      // Temporal ignores leap seconds).
      let newDateTime = localDateTime.toDateTime();
      const { years, months, weeks, days } = dateDuration;
      // TODO: if https://github.com/tc39/proposal-temporal/issues/653
      // changes order of operations, then coalesce 4 calls to 1.
      if (years) newDateTime = newDateTime[op]({ years }, dateTimeOverflowOption);
      if (months) newDateTime = newDateTime[op]({ months }, dateTimeOverflowOption);
      if (weeks) newDateTime = newDateTime[op]({ weeks }, dateTimeOverflowOption);
      if (days) newDateTime = newDateTime[op]({ days }, dateTimeOverflowOption);
      if (isZeroDuration(timeDuration)) {
        const absolute = newDateTime.inTimeZone(timeZone);
        return LocalDateTime.from({ absolute, timeZone, calendar: localDateTime.calendar });
      } else {
        // Now add/subtract the time. Because all time units are always the same
        // length, we can add/subtract all of them together without worrying about
        // order of operations.
        newDateTime = newDateTime[op](timeDuration, dateTimeOverflowOption);
        let absolute = newDateTime.inTimeZone(timeZone);
        const reverseOp = op === 'plus' ? 'minus' : 'plus';
        const backUpAbs = absolute[reverseOp]({ nanoseconds: totalNanoseconds(timeDuration) });
        const backUpOffset = timeZone.getOffsetNanosecondsFor(backUpAbs);
        const absOffset = timeZone.getOffsetNanosecondsFor(absolute);
        const backUpNanoseconds = absOffset - backUpOffset;
        if (backUpNanoseconds) {
          // RFC 5545 specifies that time units are always "exact time" meaning
          // they aren't affected by DST. Therefore, if there was a TZ
          // transition during the time duration that was added, then undo the
          // impact of that transition. However, don't adjust if applying the
          // adjustment would cause us to back up onto the other side of the
          // transition.
          const backUpOp = backUpNanoseconds < 0 ? 'minus' : 'plus';
          const adjustedAbs = absolute[backUpOp]({ nanoseconds: backUpNanoseconds });
          if (timeZone.getOffsetNanosecondsFor(adjustedAbs) === timeZone.getOffsetNanosecondsFor(absolute)) {
            absolute = adjustedAbs;
          }
        }

        return LocalDateTime.from({ absolute, timeZone, calendar });
      }
    }
    default:
      throw new Error(`Invalid \`durationKind\` option value: ${durationKind}`);
  }
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
   * @param absolute {Temporal.Absolute} - absolute timestamp for this instance
   * @param timeZone {Temporal.TimeZone} - time zone for this instance
   * @param [calendar=Temporal.Calendar.from('iso8601')] {Temporal.CalendarProtocol} -
   * calendar for this instance (defaults to ISO calendar)
   */
  constructor(absolute, timeZone, calendar) {
    this._tz = Temporal.TimeZone.from(timeZone);
    this._abs = Temporal.Absolute.from(absolute);
    this._dt = this._abs.inTimeZone(this._tz, calendar);
  }

  /**
   * Build a `Temporal.LocalDateTime` instance from one of the following:
   * - Another LocalDateTime instance, in which case the result will deep-clone
   *   the input.
   * - A "LocalDateTime-like" object with a `timeZone` field and either an
   *   `absolute` field OR `year`, `month`, and `day` fields. All non-required
   *   `Temporal.LocalDateTime` fields are accepted too, with the caveat that
   *   fields must be consistent. For example, if an object with `absolute` and
   *   `hours` is provided, then the `hours` value must match the `absolute` in
   *   the given time zone. Note: if neither `absolute` nor
   *   `timeZoneOffsetNanoseconds` are provided, then the time can be ambiguous
   *   around DST transitions.  The `disambiguation` option can resolve this
   *   ambiguity.
   * - An extended ISO 8601 string that includes a time zone identifier, e.g.
   *   `2007-12-03T10:15:30+01:00[Europe/Paris]`. If a timezone offset is not
   *   present, then the `disambiguation` option will be used to resolve any
   *   ambiguity. Note that an ISO string ending in "Z" (a UTC time) will not be
   *   accepted via a string parameter. Instead, the caller must explicitly
   *   opt-in to UTC using the object form `{absolute: isoString, timeZone:
   *   'utc'}`
   * - An object that can be converted to the string format above.
   *
   * If the input contains both a time zone offset and a time zone, in rare
   * cases it's possible for those values to conflict for a particular local
   * date and time. For example, this could happen for future summertime events
   * that were stored before a country permanently abolished DST. If the time
   * zone and offset are in conflict, then the `prefer` option is used to
   * resolve the conflict.  Note that the default for ISO strings is `'offset'`
   * which will ensure that ISO strings that were valid when they were stored
   * will still parse into a valid LocalDateTime at the same UTC value, even if
   * local times have changed. For object initializers, the default is `reject`
   * to help developers learn that `from({...getFields(), timeZone: newTz})`
   * requires removing the `timeZoneOffsetNanoseconds` field from the
   * `getFields` result before passing to `from` or `with`.
   *
   * Available options:
   * ```
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * prefer?: 'offset' (default for ISO strings) | 'dateTime' | 'reject' (default for objects)
   * ```
   */
  static from(item, options) {
    if (item instanceof Temporal.DateTime) {
      throw new TypeError('Time zone is missing. Try `{...dateTime.getFields(), timeZone}`.');
    }
    if (item instanceof Temporal.Absolute) {
      throw new TypeError('Time zone is missing. Try `{absolute, timeZone}`.');
    }
    return typeof item === 'object' ? fromObject(item, options) : fromIsoString(item.toString(), options);
  }

  /**
   * Merge fields into an existing `Temporal.LocalDateTime`. The provided `item`
   * is a "LocalDateTime-like" object. Fields accepted include: all
   * `Temporal.DateTime` fields, `timeZone`, `absolute` (as an ISO string ending
   * in "Z", or an `Absolute` instance), and `timezoneOffsetNanoseconds`.
   *
   * If the `absolute` field is included, all other input fields must be
   * consistent with this value or this method will throw.
   *
   * If the `timezoneOffsetNanoseconds` field is provided, then it's possible for
   * it to conflict with the `timeZone` (the input `timeZone` property or, if
   * omitted, the object's existing time zone).  In that case, the `prefer`
   * option is used to resolve the conflict.
   *
   * If the `timezoneOffsetNanoseconds` field is provided, then that offset will
   * be used and the `disambiguation` option will be ignored unless: a)
   * `timezoneOffsetNanoseconds` conflicts with the time zone, as noted above;
   * AND b) `prefer: 'dateTime'` is used.
   *
   * If the `timeZone` field is included, the result will convert all fields to
   * the new time zone, except that fields included in the input will be set
   * directly. Therefore, `.with({timeZone})` is an easy way to convert to a new
   * time zone while updating the local time.
   *
   * To keep local time unchanged while changing only the time zone, call
   * `getFields()`, revise the `timeZone`, remove the
   * `timeZoneOffsetNanoseconds` field so it won't conflict with the new time
   * zone, and then pass the resulting object to `with`. For example:
   * ```
   * const {timeZoneOffsetNanoseconds, timeZone, ...fields} = ldt.getFields();
   * const newTzSameLocalTime = ldt.with({...fields, timeZone: 'Europe/London'});
   * ```
   *
   * Available options:
   * ```
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * prefer?: 'offset' (default) | 'dateTime' | 'reject'
   * ```
   */
  with(localDateTimeLike, options) {
    if (typeof localDateTimeLike !== 'object') {
      throw new TypeError("Parameter 'localDateTimeLike' must be an object");
    }
    // TODO: validate and normalize input fields

    const { timeZone, absolute, calendar, timeZoneOffsetNanoseconds } = localDateTimeLike;

    const newTimeZone = timeZone && Temporal.TimeZone.from(timeZone);
    const newAbsolute = absolute && Temporal.Absolute.from(absolute);
    const newCalendar = calendar && Temporal.Calendar.from(calendar);

    const updateOffset = timeZoneOffsetNanoseconds !== undefined;
    const updateTimeZone = newTimeZone && newTimeZone.name !== this._tz.name;
    const updateAbsolute = newAbsolute && newAbsolute.equals(this._abs);
    const updateCalendar = newCalendar && newCalendar.id === this.calendar.id;

    if (updateOffset && typeof timeZoneOffsetNanoseconds !== 'number') {
      throw RangeError(
        `The \`timeZoneOffsetNanoseconds\` numeric property has an invalid value: ${timeZoneOffsetNanoseconds}`
      );
    }

    // Changing `timeZone`, `absolute`, or `calendar` will create a new
    // instance, and then other input fields will be played on top of it.
    let base = this; // eslint-disable-line @typescript-eslint/no-this-alias

    if (updateAbsolute || updateTimeZone || updateCalendar) {
      const abs = newAbsolute || base._abs;
      const tz = newTimeZone || base._tz;
      const cal = newCalendar || base.calendar;
      base = new LocalDateTime(abs, tz, cal);
      if (updateOffset && updateAbsolute) {
        // If we get here, the offset was specified. It's not allowed to
        // conflict because the absolute is being set, so we know exactly what
        // the offset must be.
        if (timeZoneOffsetNanoseconds !== base.timeZoneOffsetNanoseconds) {
          throw RangeError(
            `The \`timeZoneOffsetNanoseconds\` value ${timeZoneOffsetNanoseconds}` +
              ` does not match the offset ${base.timeZoneOffsetNanoseconds} in time zone '${tz.name}'`
          );
        }
      }
    }
    // Deal with the rest of the fields. If there's a change in tz offset, it'll
    // be handled by `from`. Also, unless we're changing the `absolute` then
    // omit it so that it won't conflict with any other fields that we're adding
    // here.
    const { absolute: baseAbsolute, timeZoneOffsetNanoseconds: baseOffset, ...fields } = base.getFields();
    if (updateAbsolute) fields.absolute = baseAbsolute;
    if (updateOffset) fields.timeZoneOffsetNanoseconds = baseOffset;
    const merged = { ...fields, ...localDateTimeLike };
    return LocalDateTime.from(merged, options);
  }

  /**
   * Get a new `LocalDateTime` instance that uses a specific calendar.
   *
   * Developers using only the default ISO 8601 calendar will probably not need
   * to call this method.
   *
   * @param [calendar=Temporal.Calendar.from('iso8601')]
   * {Temporal.CalendarProtocol} -
   */
  withCalendar(calendar) {
    return this.with({ calendar });
  }

  // `inTimeZone` is replaced by the `absolute` field.
  // inTimeZone(tzLike: Temporal.TimeZone | string, options?: Temporal.ToAbsoluteOptions): Temporal.Absolute;

  /**
   * Returns the absolute timestamp of this `Temporal.LocalDateTime` instance as
   * a `Temporal.Absolute`.
   *
   * It's a `get` property (not a `getAbsolute()` method) to support
   * round-tripping via `getFields` and `with`.
   *
   * Although this property is a `Temporal.Absolute` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly ISO 8601 string (ending in
   * `Z`) when persisting to JSON.
   */
  get absolute() {
    return this._abs;
  }

  /**
   * Returns the `Temporal.TimeZone` representing this object's time zone.
   *
   * Although this property is a `Temporal.TimeZone` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly IANA time zone identifier
   * string (e.g. `'Europe/Paris'`) when persisting to JSON.
   */
  get timeZone() {
    return this._tz;
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
    return this._dt.calendar;
  }

  /**
   * Returns the String representation of this `Temporal.LocalDateTime` in ISO
   * 8601 format extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toDateTime() {
    return this._dt;
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
    const today = this.toDate().withTime(new Temporal.Time());
    const tomorrow = today.plus({ days: 1 });
    // TODO: add tests for Azores timezone on midnight of a DST transition
    const todayAbs = today.inTimeZone(this._tz);
    const tomorrowAbs = tomorrow.inTimeZone(this._tz);
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
   * `timeZoneOffsetNanoseconds`, and `absolute`.
   *
   * The result of this method can be used for round-trip serialization via
   * `from()`, `with()`, or `JSON.stringify`.
   */
  getFields() {
    const { absolute, timeZone, timeZoneOffsetNanoseconds } = this;
    return {
      absolute,
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
    const { absolute, timeZone, timeZoneOffsetNanoseconds } = this;
    return {
      absolute,
      timeZone,
      timeZoneOffsetNanoseconds,
      ...this._dt.getISOCalendarFields()
    };
  }

  /**
   * Compare two `Temporal.LocalDateTime` values.
   *
   * By default, comparison will use the absolute time because sorting is almost
   * always based on when events happened in the real world, but during the hour
   * before and after DST ends in the fall, sorting of clock time will not match
   * the real-world sort order.
   *
   * Available options:
   * ```
   * calculation?: 'absolute' (default) | 'dateTime'
   * ```
   */
  static compare(one, two, options) {
    const calculation = getOption(options, 'calculation', COMPARE_CALCULATION_OPTIONS, 'absolute');
    return calculation === 'dateTime'
      ? Temporal.DateTime.compare(one._dt, two._dt)
      : Temporal.Absolute.compare(one._abs, two._abs);
  }

  /**
   * Returns `true` if both the absolute timestamp and time zone are identical
   * to the other `Temporal.LocalDateTime` instance, and `false` otherwise. To
   * compare only the absolute timestamps and ignore time zones, use
   * `.absolute.compare()`.
   */
  equals(other) {
    return LocalDateTime.compare(this, other) === 0;
  }

  /**
   * Add a `Temporal.Duration` and return the result.
   *
   * By default, the `'hybrid'` calculation method will be used where dates will
   * be added using calendar dates while times will be added with absolute time.
   *
   * Available options:
   * ```
   * durationKind?: 'hybrid' (default) | 'absolute'  | 'dateTime'
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * ```
   */
  plus(durationLike, options) {
    return doPlusOrMinus('plus', durationLike, options, this);
  }

  /**
   * Subtract a `Temporal.Duration` and return the result.
   *
   * By default, the `'hybrid'` calculation method will be used where dates will
   * be added using calendar dates while times will be subtracted with absolute
   * time.
   *
   * Available options:
   * ```
   * durationKind?: 'hybrid' (default) | 'absolute'  | 'dateTime'
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
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
   * The kind of duration returned depends on the `durationKind` option:
   * - `absolute` will calculate the difference using real-world elapsed time.
   * - `dateTime` will calculate the difference in clock time and calendar
   *   dates.
   * - By default, `'hybrid'` durations are returned because they usually match
   *   users' expectations that short durations are measured in real-world
   *   elapsed time that ignores DST transitions, while differences of calendar
   *   days are calculated by taking DST transitions into account.
   *
   * If `'hybrid'` is chosen but `largestUnit` is hours or less, then the
   * calculation will be the same as if `absolute` was chosen.
   *
   * However, if `'hybrid'` is used with `largestUnit` of `'days'` or larger,
   * then (as RFC 5545 requires) date differences will be calculated using
   * `dateTime` math which adjusts for DST, while the time remainder will be
   * calculated using real-world elapsed time. Examples:
   * - 2:30AM on the day before DST starts -> 3:30AM on the day DST starts =
   *   P1DT1H (even though it's only 24 hours of real-world elapsed time)
   * - 1:45AM on the day before DST starts -> "second" 1:15AM on the day DST
   *   ends = PT24H30M (because it hasn't been a full calendar day even though
   *   it's been 24.5 real-world hours).
   *
   * The `'disambiguation'` option is ony used if all of the following are true:
   * - `durationKind: 'hybrid'` is used.
   * - The difference between `this` and `other` is larger than one full
   *   calendar day.
   * - `this` and `other` have different clock times. If clock times are the
   *   same then an integer number of days will be returned.
   * - When the date portion of the difference is subtracted from `this`, the
   *   resulting local time is ambiguous (e.g. the repeated hour after DST ends,
   *   or the skipped hour after DST starts). If all of the above conditions are
   *   true, then the `'disambiguation'` option determines the
   *   `Temporal.Absolute` chosen for the end of the date portion. The time
   *   portion of the resulting duration will be calculated from that
   *   `Temporal.Absolute`.
   *
   * Calculations using `durationKind: 'absolute'` are limited to `largestUnit:
   * 'days'` or smaller units.  For larger units, use `'hybrid'` or
   * `'dateTime'`.
   *
   * If the other `Temporal.LocalDateTime` is in a different time zone, then the
   * same days can be different lengths in each time zone, e.g. if only one of
   * them observes DST. Therefore, a `RangeError` will be thrown if all of the
   * following conditions are true:
   * - `durationKind` is  `'hybrid'` or `'dateTime'`
   * - `largestUnit` is `'days'` or larger
   * - the two instances' time zones have different `name` fields.
   *
   * Here are commonly used alternatives for cross-timezone calculations:
   * - Use `durationKind: 'absolute'`, as long as it's OK if all days are
   *   assumed to be 24 hours long and DST is ignored.
   * - If you need weeks, months, or years in the result, or if you need to take
   *   DST transitions into account, transform one of the instances to the
   *   other's time zone using `.with({timeZone: other.timeZone})` and then
   *   calculate the same-timezone difference.
   * - To calculate with calendar dates only, use
   *   `.toDate().difference(other.toDate())`.
   * - To calculate with clock times only, use
   *   `.toTime().difference(other.toTime())`.
   *
   * Because of the complexity and ambiguity involved in cross-timezone
   * calculations, `hours` is the default for `largestUnit`.
   *
   * Available options:
   * ```
   * largestUnit: 'years' | 'months' | 'weeks' | 'days' | 'hours' (default) | 'minutes' | 'seconds'
   * durationKind?: 'hybrid' (default) | 'absolute'  | 'dateTime'
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * ```
   */
  difference(other, options) {
    const durationKind = getOption(options, 'durationKind', CALCULATION_OPTIONS, 'hybrid');
    const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');

    const largestUnit = toLargestTemporalUnit(options, 'years');
    const dateUnits = ['years', 'months', 'weeks', 'days'];
    const wantDate = dateUnits.includes(largestUnit);

    // treat hybrid as absolute if the user is only asking for a time difference
    if (durationKind === 'absolute' || (durationKind === 'hybrid' && !wantDate)) {
      if (wantDate) throw new Error("For absolute difference calculations, `largestUnit` must be 'hours' or smaller");
      const largestUnitOptionBag = { largestUnit: largestUnit };
      return this._abs.difference(other._abs, largestUnitOptionBag);
    } else if (durationKind === 'dateTime') {
      return this._dt.difference(other._dt, { largestUnit });
    } else {
      // durationKind === 'hybrid'
      const dtDiff = this._dt.difference(other._dt, { largestUnit });

      // If there's no change in timezone offset between this and other, then we
      // don't have to do any DST-related fixups. Just return the simple
      // DateTime difference.
      const diffOffset = this.timeZoneOffsetNanoseconds - other.timeZoneOffsetNanoseconds;
      if (diffOffset === 0) return dtDiff;

      // It's the hard case: the timezone offset is different so there's a
      // transition in the middle and we may need to adjust the result for DST.
      // RFC 5545 expects that date durations are measured in nominal (DateTime)
      // days, while time durations are measured in exact (Absolute) time.
      const { dateDuration, timeDuration } = splitDuration(dtDiff);
      if (isZeroDuration(timeDuration)) return dateDuration; // even number of calendar days

      // If we get here, there's both a time and date part of the duration AND
      // there's a time zone offset transition during the duration. RFC 5545
      // says that we should calculate full days using DateTime math and
      // remainder times using absolute time. To do this, we calculate a
      // `dateTime` difference, split it into date and time portions, and then
      // convert the time portion to an `absolute` duration before returning to
      // the caller.  A challenge: converting the time duration involves a
      // conversion from `DateTime` to `Absolute` which can be ambiguous. This
      // can cause unpredictable behavior because the disambiguation is
      // happening inside of the duration, not at its edges like in `plus` or
      // `from`. We'll reduce the chance of this unpredictability as follows:
      // 1. First, calculate the time portion as if it's closest to `other`.
      // 2. If the time portion in (1) contains a tz offset transition, then
      //    reverse the calculation and assume that the time portion is closest
      //    to `this`.
      //
      // The approach above ensures that in almost all cases, there will be no
      // "internal disambiguation" required. It's possible to construct a test
      // case where both `this` and `other` are both within 25 hours of an
      // offset transition, but in practice this will be exceedingly rare.
      let intermediateDt = this._dt.minus(dateDuration);
      let intermediateAbs = intermediateDt.inTimeZone(this._tz, { disambiguation });
      let adjustedTimeDuration;
      if (this._tz.getOffsetNanosecondsFor(intermediateAbs) === other.timeZoneOffsetNanoseconds) {
        // The transition was in the date portion which is what we want.
        adjustedTimeDuration = intermediateAbs.difference(other._abs, { largestUnit: 'hours' });
      } else {
        // There was a transition in the time portion, so try assuming that the
        // time portion is on the other side next to `this`, where there's
        // unlikely to be another transition.
        intermediateDt = other._dt.plus(dateDuration);
        intermediateAbs = intermediateDt.inTimeZone(this._tz, { disambiguation });
        adjustedTimeDuration = this._abs.difference(intermediateAbs, { largestUnit: 'hours' });
      }

      const hybridDuration = mergeDuration({ dateDuration, timeDuration: adjustedTimeDuration });
      return hybridDuration;
      // TODO: tests for cases where intermediate value lands on a discontinuity
    }
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
    // TODO: should the string representation of an "offset time zone" include
    // the offset in brackets, or have nothing in brackets?  If "nothing", then
    // should `LocalDateTime.from` also accept bracket-less strings when parsing?
    return `${this._dt.toString()}${this._tz.getOffsetStringFor(this._abs)}[${this._tz.name}]`;
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
    return this._dt.getDate();
  }
  toYearMonth() {
    return this._dt.getYearMonth();
  }
  toMonthDay() {
    return this._dt.getMonthDay();
  }
  toTime() {
    return this._dt.getTime();
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.LocalDateTime');
  }
}

const dateTimeFields = [
  ['day'],
  ['month'],
  ['year'],
  ['era', undefined],
  ['hour', 0],
  ['microsecond', 0],
  ['millisecond', 0],
  ['minute', 0],
  ['nanosecond', 0],
  ['second', 0]
];

function toPartialRecord(bag, fields) {
  const result = {};
  for (const [property] of fields) {
    const value = bag[property];
    if (value !== undefined) {
      result[property] = ES.ToInteger(value);
    }
  }
  return result;
}

/**
 * If the user includes an `absolute` property in `from` or `with`, make sure
 * that the other fields that the user provided (e.g. `year`) match the
 * `Absolute`.
 * */
function checkDateTimeFieldMatch(fromUser, fromAbsolute, timeZoneLike) {
  const fromUserDateTimeLike = toPartialRecord(fromUser, dateTimeFields);
  for (const key in fromUserDateTimeLike) {
    const fromUserValue = fromUserDateTimeLike[key];
    const fromAbsoluteValue = fromAbsolute[key];
    checkCompareProperty(key, fromUserValue, fromAbsoluteValue, timeZoneLike);
  }
}

function checkCompareProperty(key, fromUserValue, fromAbsoluteValue, timeZoneLike) {
  if (fromUserValue !== fromAbsoluteValue) {
    throw new Error(
      `property '${key}: ${fromUserValue}' does not match '${key}: ${fromAbsoluteValue}' ` +
        `calculated from the provided absolute timestamp in time zone ${timeZoneLike.toString()}`
    );
  }
}

function isDateTimeLike(o) {
  const test = o;
  return test.year !== undefined && test.month !== undefined && test.day !== undefined;
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

const CALCULATION_OPTIONS = ['absolute', 'dateTime', 'hybrid'];
const COMPARE_CALCULATION_OPTIONS = ['absolute', 'dateTime'];
const DISAMBIGUATION_OPTIONS = ['compatible', 'earlier', 'later', 'reject'];

const PREFER_OPTIONS = ['dateTime', 'offset', 'reject'];
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
  ToInteger: ES2019.ToInteger,
  ToString: ES2019.ToString,
  ToObject: ES2019.ToObject,

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
  }
};

MakeIntrinsicClass(LocalDateTime, 'Temporal.LocalDateTime');
