import { Temporal } from '../../poc';
export declare type ZonedDateTimeLike = Temporal.DateTimeLike & {
  /**`Temporal.TimeZone`, IANA time zone identifier, or offset string */
  timeZone?: Temporal.TimeZone | string;
  /** Enables `from` using only local time values */
  offsetNanoseconds?: number;
};
declare type ZonedDateTimeFields = ReturnType<Temporal.DateTime['getFields']> & {
  timeZone: Temporal.TimeZone;
  offsetNanoseconds: number;
};
declare type ZonedDateTimeISOFields = ReturnType<Temporal.DateTime['getISOFields']> & {
  timeZone: Temporal.TimeZone;
  offsetNanoseconds: number;
};
/**
 * Time zone definitions can change. If an application stores data about events
 * in the future, then stored data about future events may become ambiguous, for
 * example if a country permanently abolishes DST. The `offset` option controls
 * this unusual case.
 *
 * - `'use'` always uses the offset (if it's provided) to calculate the instant.
 *   This ensures that the result will match the instant that was originally
 *   stored, even if local clock time is different.
 * - `'prefer'` uses the offset if it's valid for the date/time in this time
 *   zone, but if it's not valid then the time zone will be used as a fallback
 *   to calculate the instant.
 * - `'ignore'` will disregard any provided offset. Instead, the time zone and
 *    date/time value are used to calculate the instant. This will keep local
 *    clock time unchanged but may result in a different real-world instant.
 * - `'reject'` acts like `'prefer'`, except it will throw a RangeError if the
 *   offset is not valid for the given time zone identifier and date/time value.
 *
 * If the ISO string ends in 'Z' then this option is ignored because there is no
 * possibility of ambiguity.
 *
 * If a time zone offset is not present in the input, then this option is
 * ignored because the time zone will always be used to calculate the offset.
 *
 * If the offset is not used, and if the date/time and time zone don't uniquely
 * identify a single instant, then the `disambiguation` option will be used to
 * choose the correct instant. However, if the offset is used then the
 * `disambiguation` option will be ignored.
 */
export interface offsetDisambiguationOptions {
  offset: 'use' | 'prefer' | 'ignore' | 'reject';
}
export declare type ZonedDateTimeAssignmentOptions = Partial<
  Temporal.AssignmentOptions & Temporal.ToInstantOptions & offsetDisambiguationOptions
>;
export declare class ZonedDateTime {
  private _abs;
  private _tz;
  private _dt;
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
  constructor(epochNanoseconds: bigint, timeZone: Temporal.TimeZoneProtocol, calendar?: Temporal.CalendarProtocol);
  /**
   * Build a `Temporal.ZonedDateTime` instance from one of the following:
   * - Another ZonedDateTime instance, in which case the result will deep-clone
   *   the input.
   * - A "ZonedDateTime-like" property bag object with required properties
   *   `timeZone`, `year`, `month`, and `day`. Other fields (time fields and
   *   `offsetNanoseconds`) are optional. If `offsetNanoseconds` is not
   *   provided, then the time can be ambiguous around DST transitions. The
   *   `disambiguation` option can resolve this ambiguity.
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
  static from(
    item: ZonedDateTimeLike | string | Record<string, unknown>,
    options?: ZonedDateTimeAssignmentOptions
  ): ZonedDateTime;
  /**
   * Merge fields into an existing `Temporal.ZonedDateTime`. The provided `item`
   * is a "ZonedDateTime-like" object. Accepted fields include:
   * - All `Temporal.DateTime` fields, including `calendar`
   * - `timeZone` as a time zone identifier string like `Europe/Paris` or a
   *   `Temporal.TimeZone` instance
   * - `offsetNanoseconds`
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
   * If the `offsetNanoseconds` field is provided, then it's possible for it to
   * conflict with the input object's `timeZone` property or, if omitted, the
   * object's existing time zone.  The `offset` option (which defaults to
   * `'prefer'`) will resolve the conflict.
   *
   * If the `offsetNanoseconds` field is not provided, but the `timeZone` field
   * is not provided either, then the existing `offsetNanoseconds` field will be
   * used by `with` as if it had been provided by the caller. By default, this
   * will prefer the existing offset when resolving ambiguous results. For
   * example, if a `Temporal.ZonedDateTime` is set to the "second" 1:30AM on a
   * day where the 1-2AM clock hour is repeated after a backwards DST
   * transition, then calling `.with({minute: 45})` will result in an ambiguity
   * which is resolved using the default `offset: 'prefer'` option. Because the
   * existing offset is valid for the new time, it will be retained so the
   * result will be the "second" 1:45AM.  However, if the existing offset is not
   * valid for the new result (e.g. `.with({hour: 0})`), then the default
   * behavior will change the offset.
   *
   * Available options:
   * ```
   * disambiguation?: 'compatible' (default) |  'earlier' | 'later' | 'reject'
   * overflow?: 'constrain' (default) | 'reject'
   * offset?: 'use' | 'prefer' (default) | 'ignore' | 'reject'
   * ```
   */
  with(zonedDateTimeLike: ZonedDateTimeLike, options?: ZonedDateTimeAssignmentOptions): ZonedDateTime;
  /**
   * Get a new `Temporal.ZonedDateTime` instance that uses a specific calendar.
   *
   * Developers using only the default ISO 8601 calendar will probably not need
   * to call this method.
   *
   * @param [calendar=Temporal.Calendar.from('iso8601')]
   * {Temporal.CalendarProtocol} - new calendar to use
   */
  withCalendar(calendar: Temporal.CalendarProtocol): ZonedDateTime;
  /**
   * Returns the exact time of this `Temporal.ZonedDateTime` instance as a
   * `Temporal.Instant`.
   */
  toInstant(): Temporal.Instant;
  /**
   * Returns the `Temporal.TimeZone` representing this object's time zone.
   *
   * Although this property is a `Temporal.TimeZone` object, `JSON.stringify`
   * will automatically convert it to a JSON-friendly IANA time zone identifier
   * string (e.g. `'Europe/Paris'`) when persisting to JSON.
   */
  get timeZone(): Temporal.TimeZone;
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
  get calendar(): Temporal.CalendarProtocol;
  /**
   * Returns a new `Temporal.DateTime` instance that corresponds to this
   * `Temporal.ZonedDateTime` instance.
   *
   * The resulting `Temporal.DateTime` instance will use the same date, time,
   * and calendar as `this`.
   */
  toDateTime(): Temporal.DateTime;
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
  get hoursInDay(): number;
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
  get startOfDay(): ZonedDateTime;
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
  get isOffsetTransition(): boolean;
  /**
   * Offset (in nanoseconds) relative to UTC of the current time zone and
   * instant of this `Temporal.ZonedDateTime` instance.
   *
   * The value of this field will change after DST transitions or after legal
   * changes to a time zone, e.g. a country switching to a new time zone.
   *
   * Because this field is able to uniquely map a `Temporal.DateTime` to an
   * instant, this field is returned by `getFields()` and is accepted by `from`
   * and `with`.
   * */
  get offsetNanoseconds(): number;
  /**
   * Offset (as a string like `'+05:00'` or `'-07:00'`) relative to UTC of the
   * current time zone and instant of this `Temporal.ZonedDateTime` instance.
   *
   * This property is useful for custom formatting of ZonedDateTime instances.
   *
   * This field cannot be passed to `from` and `with`.  Instead, use
   * `offsetNanoseconds`.
   * */
  get offsetString(): string;
  /**
   * Returns a plain object containing enough data to uniquely identify
   * this object.
   *
   * The resulting object includes all fields returned by
   * `Temporal.DateTime.prototype.getFields()`, as well as `timeZone`,
   * and `offsetNanoseconds`.
   *
   * The result of this method can be used for round-trip serialization via
   * `from()`, `with()`, or `JSON.stringify`.
   */
  getFields(): ZonedDateTimeFields;
  /**
   * Method for internal use by non-ISO calendars. Normally not used.
   */
  getISOFields(): ZonedDateTimeISOFields;
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
  static compare(one: ZonedDateTime, two: ZonedDateTime): Temporal.ComparisonResult;
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
  equals(other: ZonedDateTime): boolean;
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
  add(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): ZonedDateTime;
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
  subtract(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): ZonedDateTime;
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
  difference(
    other: ZonedDateTime,
    options?: Temporal.DifferenceOptions<
      | 'years'
      | 'months'
      | 'weeks'
      | 'days'
      | 'hours'
      | 'minutes'
      | 'seconds'
      | 'milliseconds'
      | 'microseconds'
      | 'nanoseconds'
    >
  ): Temporal.Duration;
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
  round(
    options: Temporal.RoundOptions<'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond'>
  ): ZonedDateTime;
  /**
   * Convert to a localized string.
   *
   * This works the same as `DateTime.prototype.toLocaleString`, except time
   * zone option is automatically set and cannot be overridden by the caller.
   */
  toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
  /**
   * String representation of this `Temporal.ZonedDateTime` in ISO 8601 format
   * extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toJSON(): string;
  /**
   * String representation of this `Temporal.ZonedDateTime` in ISO 8601 format
   * extended to include the time zone.
   *
   * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
   *
   * If the calendar is not the default ISO 8601 calendar, then it will be
   * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
   */
  toString(): string;
  get era(): string | undefined;
  get year(): number;
  get month(): number;
  get day(): number;
  get hour(): number;
  get minute(): number;
  get second(): number;
  get millisecond(): number;
  get microsecond(): number;
  get nanosecond(): number;
  get dayOfWeek(): number;
  get dayOfYear(): number;
  get weekOfYear(): number;
  get daysInYear(): number;
  get daysInMonth(): number;
  get daysInWeek(): number;
  get monthsInYear(): number;
  get isLeapYear(): boolean;
  toDate(): Temporal.Date;
  toYearMonth(): Temporal.YearMonth;
  toMonthDay(): Temporal.MonthDay;
  toTime(): Temporal.Time;
  valueOf(): never;
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
  get epochSeconds(): number;
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
  get epochMilliseconds(): number;
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
  get epochMicroseconds(): bigint;
  /**
   * Returns the `bigint` number of nanoseconds (one billionth of a second)
   * between `this` and 00:00 UTC on 1970-01-01, otherwise known as the [UNIX
   * Epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   * This property has the same value as `this.toInstant().epochNanoseconds`.
   * Note that the time zone is irrelevant to this property because time because
   * there is only one epoch, not one per time zone.
   */
  get epochNanoseconds(): bigint;
}
export {};
