import { Temporal } from '../..';
// @ts-ignore
import ToInteger from 'es-abstract/2019/ToInteger.js';
// @ts-ignore
import ToObject from 'es-abstract/2019/ToObject.js';
// @ts-ignore
import ToString from 'es-abstract/2019/ToString.js';
// import { ToInteger, ToObject, ToString } from 'es-abstract';

export type LocalDateTimeLike = Temporal.DateTimeLike & {
  /**`Temporal.TimeZone`, IANA time zone identifier, or offset string */
  timeZone?: Temporal.TimeZone | string;

  /** Enables `from` using only local time values */
  timeZoneOffsetNanoseconds?: number;
};

type LocalDateTimeFields = ReturnType<Temporal.DateTime['getFields']> & {
  timeZone: Temporal.TimeZone;
  timeZoneOffsetNanoseconds: number;
};

type LocalDateTimeISOCalendarFields = ReturnType<Temporal.DateTime['getISOCalendarFields']> & {
  timeZone: Temporal.TimeZone;
  timeZoneOffsetNanoseconds: number;
};

export interface OverflowOptions {
  /**
   * How to deal with out-of-range values
   *
   * - In `'constrain'` mode, out-of-range values are clamped to the nearest
   *   in-range value.
   * - In `'reject mode'`, out-of-range values will cause the function to throw
   *   a RangeError.
   *
   * The default is `'constrain'`.
   */
  overflow: 'constrain' | 'reject';
  // Assuming name change from `disambiguation` to `overflow`. See #607.
}

/**
 * Time zone definitions can change. If an application stores data about events
 * in the future, then stored data about future events may become ambiguous, for
 * example if a country permanently abolishes DST. The `offset` option controls
 * this unusual case.
 *
 * - `'use'` always uses the offset (if it's provided) to calculate the absolute
 *   time. This ensures that the result will match the absolute time that was
 *   originally stored, even if local clock time is different.
 * - `'prefer'` uses the offset if it's valid for the date/time in this time
 *   zone, but if it's not valid then the time zone will be used as a fallback
 *   to calculate the absolute time.
 * - `'ignore'` will disregard any provided offset. Instead, the time zone and
 *    date/time value are used to calculate the absolute time. This will keep
 *    local clock time unchanged but may result in a different real-world
 *    instant.
 * - `'reject'` acts like `'prefer'`, except it will throw a RangeError if the
 *   offset is not valid for the given time zone identifier and date/time value.
 *
 * If a time zone offset is not present in the input, then this option is
 * ignored.
 *
 * If the offset is not used, and if the date/time and time zone don't uniquely
 * identify a single absolute time, then the `disambiguation` option will be
 * used to choose the correct absolute time. However, if the offset is used
 * then the `disambiguation` option will be ignored.
 */
export interface TimeZoneOffsetDisambiguationOptions {
  offset: 'use' | 'prefer' | 'ignore' | 'reject';
}

export type LocalDateTimeAssignmentOptions = Partial<
  OverflowOptions & Temporal.ToAbsoluteOptions & TimeZoneOffsetDisambiguationOptions
>;
export type LocalDateTimeMathOptions = OverflowOptions;
export type LocalDateTimeDifferenceOptions = Partial<
  Temporal.DifferenceOptions<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'>
>;

/** Build a `Temporal.LocalDateTime` instance from a property bag object */
function fromObject(item: Record<string, unknown>, options?: LocalDateTimeAssignmentOptions) {
  const overflowOption = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  const offsetOption = getOption(options, 'offset', OFFSET_OPTIONS, 'use');
  const disambiguation = getOption(options, 'disambiguation', DISAMBIGUATION_OPTIONS, 'compatible');

  const { timeZone: tzOrig, timeZoneOffsetNanoseconds } = item as LocalDateTimeLike;
  if (tzOrig === undefined) {
    throw new TypeError('Required property `timeZone` is missing');
  }
  const tz = Temporal.TimeZone.from(tzOrig);

  let offset: string | undefined = undefined;
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
function fromIsoString(isoString: string, options?: LocalDateTimeAssignmentOptions) {
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
function fromCommon(
  dt: Temporal.DateTime,
  timeZone: Temporal.TimeZone,
  offset: string | undefined,
  disambiguation: Temporal.ToAbsoluteOptions['disambiguation'],
  offsetOption: TimeZoneOffsetDisambiguationOptions['offset']
) {
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

function fromDateTime(
  dateTime: Temporal.DateTime,
  timeZone: Temporal.TimeZoneProtocol,
  options?: Temporal.ToAbsoluteOptions
) {
  return new LocalDateTime(dateTime.toAbsolute(timeZone, options).getEpochNanoseconds(), timeZone, dateTime.calendar);
}

/** Identical logic for `plus` and `minus` */
function doPlusOrMinus(
  op: 'plus' | 'minus',
  durationLike: Temporal.DurationLike,
  options: LocalDateTimeMathOptions | undefined,
  localDateTime: LocalDateTime
): LocalDateTime {
  const overflow = getOption(options, 'overflow', OVERFLOW_OPTIONS, 'constrain');
  // TODO: edit below depending on https://github.com/tc39/proposal-temporal/issues/607
  const dateTimeOverflowOption = { disambiguation: overflow };
  const { timeZone, calendar } = localDateTime;

  const { timeDuration, dateDuration } = splitDuration(durationLike);
  if (isZeroDuration(dateDuration)) {
    // If there's only a time to add/subtract, then use absolute math
    // because RFC 5545 specifies using absolute math for time units.
    const result = localDateTime.toAbsolute()[op](durationLike);
    return new LocalDateTime(result.getEpochNanoseconds(), timeZone, calendar);
  }

  // Add the units according to the largest-to-smallest order of operations
  // required by RFC 5545. Note that the same breakout is not required for
  // the time duration because all time units are the same length (because
  // Temporal ignores leap seconds).
  let newDateTime: Temporal.DateTime = localDateTime.toDateTime();
  const { years, months, weeks, days } = dateDuration;
  // TODO: if https://github.com/tc39/proposal-temporal/issues/653
  // changes order of operations, then coalesce 4 calls to 1.
  if (years) newDateTime = newDateTime[op]({ years }, dateTimeOverflowOption);
  if (months) newDateTime = newDateTime[op]({ months }, dateTimeOverflowOption);
  if (weeks) newDateTime = newDateTime[op]({ weeks }, dateTimeOverflowOption);
  if (days) newDateTime = newDateTime[op]({ days }, dateTimeOverflowOption);
  if (isZeroDuration(timeDuration)) {
    return fromDateTime(newDateTime, timeZone);
  } else {
    // Now add/subtract the time. Because all time units are always the same
    // length, we can add/subtract all of them together without worrying about
    // order of operations.
    newDateTime = newDateTime[op](timeDuration, dateTimeOverflowOption);
    let absolute = newDateTime.toAbsolute(timeZone);
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

    return new LocalDateTime(absolute.getEpochNanoseconds(), timeZone, calendar);
  }
}

function totalNanoseconds(d: Temporal.Duration) {
  if (!isZeroDuration(splitDuration(d).dateDuration)) {
    throw new RangeError('Duration must be limited to hours or smaller units');
  }
  return (
    d.hours * 3.6e12 + d.minutes * 6e10 + d.seconds * 1e9 + d.milliseconds * 1e6 + d.microseconds * 1000 + d.nanoseconds
  );
}

export class LocalDateTime {
  private _abs: Temporal.Absolute;
  private _tz: Temporal.TimeZone;
  private _dt: Temporal.DateTime;

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
  constructor(epochNanoseconds: bigint, timeZone: Temporal.TimeZoneProtocol, calendar?: Temporal.CalendarProtocol) {
    // TODO: remove the cast below once https://github.com/tc39/proposal-temporal/issues/810 is resolved
    this._tz = Temporal.TimeZone.from(timeZone as string | Temporal.TimeZone);
    this._abs = new Temporal.Absolute(epochNanoseconds);
    this._dt = this._abs.toDateTime(this._tz, calendar && Temporal.Calendar.from(calendar));
    // @ts-ignore
    // eslint-disable-next-line no-undef
    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        // @ts-ignore
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
  static from(
    item: LocalDateTimeLike | string | Record<string, unknown>,
    options?: LocalDateTimeAssignmentOptions
  ): LocalDateTime {
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
  with(localDateTimeLike: LocalDateTimeLike, options?: LocalDateTimeAssignmentOptions): LocalDateTime {
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
    let base: LocalDateTime = this; // eslint-disable-line @typescript-eslint/no-this-alias

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
      (fields as LocalDateTimeLike).timeZoneOffsetNanoseconds = originalOffset;
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
  withCalendar(calendar: Temporal.CalendarProtocol): LocalDateTime {
    return this.with({ calendar });
  }

  /**
   * Returns the absolute timestamp of this `Temporal.LocalDateTime` instance as
   * a `Temporal.Absolute`.
   */
  toAbsolute(): Temporal.Absolute {
    return Temporal.Absolute.from(this._abs);
  }

  /**
   * Returns the `Temporal.TimeZone` representing this object's time zone.
   *
   * Although this property is a `Temporal.TimeZone` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly IANA time zone identifier
   * string (e.g. `'Europe/Paris'`) when persisting to JSON.
   */
  get timeZone(): Temporal.TimeZone {
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
  get calendar(): Temporal.CalendarProtocol {
    return Temporal.Calendar.from(this._dt.calendar);
  }

  /**
   * Returns a new `Temporal.DateTime` instance that corresponds to this
   * `Temporal.LocalDateTime` instance.
   *
   * The resulting `Temporal.DateTime` instance will use the same date, time,
   * and calendar as `this`.
   */
  toDateTime(): Temporal.DateTime {
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
  get hoursInDay(): number {
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
  get isTimeZoneOffsetTransition(): boolean {
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
  get timeZoneOffsetNanoseconds(): number {
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
  get timeZoneOffsetString(): string {
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
  getFields(): LocalDateTimeFields {
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
  getISOCalendarFields(): LocalDateTimeISOCalendarFields {
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
  static compare(one: LocalDateTime, two: LocalDateTime): Temporal.ComparisonResult {
    return Temporal.Absolute.compare(one._abs, two._abs);
  }

  /**
   * Returns `true` if both the absolute timestamp and time zone are identical
   * to the other `Temporal.LocalDateTime` instance, and `false` otherwise. To
   * compare only the absolute timestamps and ignore time zones, use
   * `.toAbsolute().compare()`.
   */
  equals(other: LocalDateTime): boolean {
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
  plus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime {
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
  minus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime {
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
  difference(other: LocalDateTime, options?: LocalDateTimeDifferenceOptions): Temporal.Duration {
    const largestUnit = toLargestTemporalUnit(options, 'hours');
    const dateUnits = ['years', 'months', 'weeks', 'days'] as LargestDifferenceUnit[];
    const wantDate = dateUnits.includes(largestUnit);

    // treat as absolute if the user is only asking for a time difference
    if (!wantDate) {
      const largestUnitOptionBag = { largestUnit: largestUnit as 'hours' | 'minutes' | 'seconds' };
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
    let adjustedTimeDuration: Temporal.Duration;
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
  toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
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
  toJSON(): string {
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
  toString(): string {
    const calendar = this._dt.calendar.id === 'iso8601' ? '' : `[c=${this._dt.calendar.id}]`;
    return `${this._dt.withCalendar('iso8601')}${this.timeZoneOffsetString}[${this._tz.name}]${calendar}`;
  }

  // the fields and methods below are identical to DateTime

  get era(): string | undefined {
    return this._dt.era;
  }
  get year(): number {
    return this._dt.year;
  }
  get month(): number {
    return this._dt.month;
  }
  get day(): number {
    return this._dt.day;
  }
  get hour(): number {
    return this._dt.hour;
  }
  get minute(): number {
    return this._dt.minute;
  }
  get second(): number {
    return this._dt.second;
  }
  get millisecond(): number {
    return this._dt.millisecond;
  }
  get microsecond(): number {
    return this._dt.microsecond;
  }
  get nanosecond(): number {
    return this._dt.nanosecond;
  }
  get dayOfWeek(): number {
    return this._dt.dayOfWeek;
  }
  get dayOfYear(): number {
    return this._dt.dayOfYear;
  }
  get weekOfYear(): number {
    return this._dt.weekOfYear;
  }
  get daysInYear(): number {
    return this._dt.daysInYear;
  }
  get daysInMonth(): number {
    return this._dt.daysInMonth;
  }
  get isLeapYear(): boolean {
    return this._dt.isLeapYear;
  }
  toDate(): Temporal.Date {
    return this._dt.toDate();
  }
  toYearMonth(): Temporal.YearMonth {
    return this._dt.toYearMonth();
  }
  toMonthDay(): Temporal.MonthDay {
    return this._dt.toMonthDay();
  }
  toTime(): Temporal.Time {
    return this._dt.toTime();
  }
  valueOf(): never {
    throw new TypeError('use compare() or equals() to compare Temporal.LocalDateTime');
  }
}

/** Split a duration into a {dateDuration, timeDuration} */
function splitDuration(durationLike: Temporal.DurationLike) {
  const { years = 0, months = 0, weeks = 0, days = 0 } = durationLike;
  const dateDuration = Temporal.Duration.from({ years, months, weeks, days });
  const { hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 } = durationLike;
  const timeDuration = Temporal.Duration.from({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
  return { dateDuration, timeDuration };
}

/** Merge a {dateDuration, timeDuration} into one duration */
function mergeDuration({
  dateDuration,
  timeDuration
}: {
  dateDuration: Temporal.Duration;
  timeDuration: Temporal.Duration;
}) {
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
function isZeroDuration(duration: Temporal.Duration) {
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

type LargestDifferenceUnit = Exclude<LocalDateTimeDifferenceOptions['largestUnit'], undefined>;
const LARGEST_DIFFERENCE_UNITS: LargestDifferenceUnit[] = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds'
];
const DISAMBIGUATION_OPTIONS: Temporal.ToAbsoluteOptions['disambiguation'][] = [
  'compatible',
  'earlier',
  'later',
  'reject'
];
const OFFSET_OPTIONS: TimeZoneOffsetDisambiguationOptions['offset'][] = ['use', 'prefer', 'ignore', 'reject'];
const OVERFLOW_OPTIONS: OverflowOptions['overflow'][] = ['constrain', 'reject'];

function getOption<K extends string, U extends string>(
  options: { [k in K]?: string } | undefined,
  property: K,
  allowedValues: U[],
  fallback: U
): U {
  if (options === null || options === undefined) return fallback;
  options = ES.ToObject(options) as { [k in K]: U };
  let value = options[property];
  if (value !== undefined) {
    value = ES.ToString(value);
    if (!allowedValues.includes(value as U)) {
      throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
    }
    return value as U;
  }
  return fallback;
}

function toLargestTemporalUnit<V extends keyof Temporal.DurationLike, F extends LargestDifferenceUnit>(
  options: { largestUnit?: V } | undefined,
  fallback: F,
  disallowedStrings: LargestDifferenceUnit[] = []
) {
  if (disallowedStrings.includes(fallback)) {
    throw new RangeError(`Fallback ${fallback} cannot be disallowed`);
  }
  const largestUnit = getOption<'largestUnit', LargestDifferenceUnit>(
    options,
    'largestUnit',
    LARGEST_DIFFERENCE_UNITS,
    fallback
  );
  if (disallowedStrings.includes(largestUnit)) {
    throw new RangeError(`${largestUnit} not allowed as the largest unit here`);
  }
  return largestUnit;
}

const ES = {
  ToInteger: ToInteger as (x: unknown) => number,
  ToString: ToString as (x: unknown) => string,
  ToObject: ToObject as (x: unknown) => Record<string, unknown>,

  // replace this with public parsing API after it lands
  ParseFullISOString: (isoString: string) => {
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

  parse: (isoString: string) => {
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

  parseOffsetString: (string: string) => {
    const OFFSET = new RegExp(`^${PARSE.offset.source}$`);
    const match = OFFSET.exec(String(string));
    if (!match) return null;
    const sign = match[1] === '-' ? -1 : +1;
    const hours = +match[2];
    const minutes = +(match[3] || 0);
    return sign * (hours * 60 + minutes) * 60 * 1000;
  },

  FormatTimeZoneOffsetString: (offsetNanoseconds: number) => {
    const sign = offsetNanoseconds < 0 ? '-' : '+';
    offsetNanoseconds = Math.abs(offsetNanoseconds);
    const offsetMinutes = Math.floor(offsetNanoseconds / 60e9);
    const offsetMinuteString = `00${offsetMinutes % 60}`.slice(-2);
    const offsetHourString = `00${Math.floor(offsetMinutes / 60)}`.slice(-2);
    return `${sign}${offsetHourString}:${offsetMinuteString}`;
  }
};
