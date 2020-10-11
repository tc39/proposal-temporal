import { Temporal } from '../..';
export declare type LocalDateTimeLike = Temporal.DateTimeLike & {
  timeZone?: Temporal.TimeZone | string;
  timeZoneOffsetNanoseconds?: number;
};
declare type LocalDateTimeFields = ReturnType<Temporal.DateTime['getFields']> & {
  timeZone: Temporal.TimeZone;
  timeZoneOffsetNanoseconds: number;
};
declare type LocalDateTimeISOFields = ReturnType<Temporal.DateTime['getISOFields']> & {
  timeZone: Temporal.TimeZone;
  timeZoneOffsetNanoseconds: number;
};
export interface TimeZoneOffsetDisambiguationOptions {
  offset: 'use' | 'prefer' | 'ignore' | 'reject';
}
export declare type LocalDateTimeAssignmentOptions = Partial<
  Temporal.AssignmentOptions & Temporal.ToInstantOptions & TimeZoneOffsetDisambiguationOptions
>;
export declare class LocalDateTime {
  private _abs;
  private _tz;
  private _dt;
  constructor(epochNanoseconds: bigint, timeZone: Temporal.TimeZoneProtocol, calendar?: Temporal.CalendarProtocol);
  static from(
    item: LocalDateTimeLike | string | Record<string, unknown>,
    options?: LocalDateTimeAssignmentOptions
  ): LocalDateTime;
  with(localDateTimeLike: LocalDateTimeLike, options?: LocalDateTimeAssignmentOptions): LocalDateTime;
  withCalendar(calendar: Temporal.CalendarProtocol): LocalDateTime;
  toInstant(): Temporal.Instant;
  get timeZone(): Temporal.TimeZone;
  get calendar(): Temporal.CalendarProtocol;
  toDateTime(): Temporal.DateTime;
  get hoursInDay(): number;
  get startOfDay(): LocalDateTime;
  get isTimeZoneOffsetTransition(): boolean;
  get timeZoneOffsetNanoseconds(): number;
  get timeZoneOffsetString(): string;
  getFields(): LocalDateTimeFields;
  getISOFields(): LocalDateTimeISOFields;
  static compare(one: LocalDateTime, two: LocalDateTime): Temporal.ComparisonResult;
  equals(other: LocalDateTime): boolean;
  plus(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): LocalDateTime;
  minus(durationLike: Temporal.DurationLike, options?: Temporal.ArithmeticOptions): LocalDateTime;
  difference(
    other: LocalDateTime,
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
  ): LocalDateTime;
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
