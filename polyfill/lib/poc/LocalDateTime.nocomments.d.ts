import { Temporal } from '../..';
export declare type LocalDateTimeLike = Temporal.DateTimeLike & {
  timeZone?: Temporal.TimeZone | string;
  absolute?: Temporal.Absolute | string;
  timeZoneOffsetNanoseconds?: number;
};
declare type LocalDateTimeFields = ReturnType<Temporal.DateTime['getFields']> & {
  timeZone: Temporal.TimeZone;
  absolute: Temporal.Absolute;
  timeZoneOffsetNanoseconds: number;
};
declare type LocalDateTimeISOCalendarFields = ReturnType<Temporal.DateTime['getISOCalendarFields']> & {
  timeZone: Temporal.TimeZone;
  absolute: Temporal.Absolute;
  timeZoneOffsetNanoseconds: number;
};
export interface DurationKindOptions {
  durationKind: 'absolute' | 'dateTime' | 'hybrid';
}
export interface CompareCalculationOptions {
  calculation: 'absolute' | 'dateTime';
}
export interface OverflowOptions {
  overflow: 'constrain' | 'reject';
}
export interface TimeZoneOffsetDisambiguationOptions {
  prefer: 'offset' | 'dateTime' | 'reject';
}
export declare type LocalDateTimeAssignmentOptions = Partial<
  OverflowOptions & Temporal.ToAbsoluteOptions & TimeZoneOffsetDisambiguationOptions
>;
export declare type LocalDateTimeMathOptions = Partial<
  DurationKindOptions & Temporal.ToAbsoluteOptions & OverflowOptions
>;
export declare type LocalDateTimeDifferenceOptions = Partial<
  Temporal.DifferenceOptions<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'> &
    DurationKindOptions &
    Temporal.ToAbsoluteOptions
>;
export declare class LocalDateTime {
  private _abs;
  private _tz;
  private _dt;
  constructor(absolute: Temporal.Absolute, timeZone: Temporal.TimeZone, calendar?: Temporal.CalendarProtocol);
  static from(
    item: LocalDateTimeLike | string | Record<string, unknown>,
    options?: LocalDateTimeAssignmentOptions
  ): LocalDateTime;
  with(localDateTimeLike: LocalDateTimeLike, options?: LocalDateTimeAssignmentOptions): LocalDateTime;
  withCalendar(calendar: Temporal.CalendarProtocol): LocalDateTime;
  get absolute(): Temporal.Absolute;
  get timeZone(): Temporal.TimeZone;
  get calendar(): Temporal.CalendarProtocol;
  toDateTime(): Temporal.DateTime;
  get hoursInDay(): number;
  get isTimeZoneOffsetTransition(): boolean;
  get timeZoneOffsetNanoseconds(): number;
  get timeZoneOffsetString(): string;
  getFields(): LocalDateTimeFields;
  getISOCalendarFields(): LocalDateTimeISOCalendarFields;
  static compare(
    one: LocalDateTime,
    two: LocalDateTime,
    options?: CompareCalculationOptions
  ): Temporal.ComparisonResult;
  equals(other: LocalDateTime): boolean;
  plus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
  minus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
  difference(other: LocalDateTime, options?: LocalDateTimeDifferenceOptions): Temporal.Duration;
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
  get isLeapYear(): boolean;
  toDate(): Temporal.Date;
  toYearMonth(): Temporal.YearMonth;
  toMonthDay(): Temporal.MonthDay;
  toTime(): Temporal.Time;
  valueOf(): never;
}
export {};
