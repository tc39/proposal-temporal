import { Temporal } from '../../poc';
export declare type ZonedDateTimeLike = Temporal.DateTimeLike & {
  timeZone?: Temporal.TimeZone | string;
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
  constructor(epochNanoseconds: bigint, timeZone: Temporal.TimeZoneProtocol, calendar?: Temporal.CalendarProtocol);
  static from(
    item: ZonedDateTimeLike | string | Record<string, unknown>,
    options?: ZonedDateTimeAssignmentOptions
  ): ZonedDateTime;
  with(zonedDateTimeLike: ZonedDateTimeLike, options?: ZonedDateTimeAssignmentOptions): ZonedDateTime;
  withCalendar(calendar: Temporal.CalendarProtocol): ZonedDateTime;
  toInstant(): Temporal.Instant;
  get timeZone(): Temporal.TimeZone;
  get calendar(): Temporal.CalendarProtocol;
  toDateTime(): Temporal.DateTime;
  get hoursInDay(): number;
  get startOfDay(): ZonedDateTime;
  get isOffsetTransition(): boolean;
  get offsetNanoseconds(): number;
  get offsetString(): string;
  getFields(): ZonedDateTimeFields;
  getISOFields(): ZonedDateTimeISOFields;
  static compare(one: ZonedDateTime, two: ZonedDateTime): Temporal.ComparisonResult;
  equals(other: ZonedDateTime): boolean;
  add(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): ZonedDateTime;
  subtract(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): ZonedDateTime;
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
  round(
    options: Temporal.RoundOptions<'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond'>
  ): ZonedDateTime;
  toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
  toJSON(): string;
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
  get epochSeconds(): number;
  get epochMilliseconds(): number;
  get epochMicroseconds(): bigint;
  get epochNanoseconds(): bigint;
}
export {};
