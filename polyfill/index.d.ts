export namespace Temporal {
  export type ComparisonResult = -1 | 0 | 1;

  // TODO: the `XXXOptions` types below helper types below are useful while
  // Temporal is being designed, beacuse they make it easier to understand how
  // options are shared across types and methods. But once the API is finalized
  // it may make sense to explicitly list all options inside each method
  // declaration, because later changes to options accepted by some but not all
  // methods won't result in a breaking change.

  /**
   * Options for assigning fields using `with()` or entire objects with
   * `from()`.
   * */
  export type AssignmentOptions = {
    /**
     * How to deal with out-of-range values
     *
     * - In `'constrain'` mode, out-of-range values are clamped to the nearest
     *   in-range value.
     * - In `'balance mode'`, out-of-range values are resolved by balancing them
     *   with the next highest unit.
     * - In `'reject mode'`, out-of-range values will cause the function to
     *   throw a RangeError.
     *
     * The default is `'constrain'`.
     */
    disambiguation: 'constrain' | 'balance' | 'reject';
    // TODO: should change name from `disambiguation` to `overflow`? See #607.
    // TODO: should remove `balance` from non-Duration types? See #609.
  };

  /**
   * Options for conversions of `Temporal.DateTime` to `Temporal.Absolute`
   * */
  export type ToAbsoluteOptions = {
    /**
     * Controls handling of invalid or ambiguous times caused by time zone
     * offset changes like Daylight Saving time (DST) transitions.
     *
     * This option is only relevant if a `DateTime` value does not exist in the
     * destination time zone (e.g. near "Spring Forward" DST transitions), or
     * exists more than once (e.g. near "Fall Back" DST transitions).
     *
     * In case of ambiguous or non-existent times, this option controls what
     * absolute time to return:
     * - `'earlier'`: The earlier time of two possible times
     * - `'later'`: The later of two possible times
     * - `'reject'`: Throw a RangeError instead.
     *
     * The default is `'earlier'`.
     *
     * Compatibility Note: the legacy `Date` object (and libraries like
     * moment.js and Luxon) gives the same result as `earlier` when turning the
     * clock back, and `later` when setting the clock forward.
     *
     * */
    disambiguation: 'earlier' | 'later' | 'reject';
    // TODO: should there be a `compatible` (to legacy `Date`, moment, etc.)
    //       disambiguation option? See #614.
  };

  /**
   * Options for arithmetic operations like `plus()` and `minus()`
   * */
  export type ArithmeticOptions = {
    /**
     * Controls handling of out-of-range arithmetic results.
     *
     * If a result is out of range, then `'constrain'` will clamp the result to
     * the allowed range, while `'reject'` will throw a RangeError.
     *
     * The default is `'constrain'`.
     */
    disambiguation: 'constrain' | 'reject';
    // TODO: may change name from `disambiguation` to `overflow`. See #607.
  };

  /**
   * Options to control `Duration.prototype.minus()` behavior
   * */
  export type DurationMinusOptions = {
    /**
     * Controls how to deal with subtractions that result in negative overflows
     *
     * In `'balanceConstrain'` mode, negative fields are balanced with the next
     * highest field so that none of the fields are negative in the result. If
     * this is not possible, a `RangeError` is thrown.
     *
     * In `'balance'` mode, all fields are balanced with the next highest field,
     * no matter if they are negative or not.
     *
     * TODO: add an example of each mode.
     *
     * The default is `'balanceConstrain'`.
     *
     */
    disambiguation: 'balanceConstrain' | 'balance';
  };

  export interface DifferenceOptions<T extends string> {
    /**
     * The largest unit to allow in the resulting `Temporal.Duration` object.
     *
     * Valid values may include `'years'`, `'months'`, `'days'`, `'hours'`,
     * `'minutes'`, and `'seconds'`, although some types may throw an exception
     * if a value is used that would produce an invalid result. For example,
     * `hours` is not accepted by `Date.prototype.difference()`.
     *
     * The default depends on the type being used.
     *
     * TODO: document which types use which defaults.
     */
    largestUnit: T;
  }

  export type DurationLike = {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
  };

  export class Duration extends Required<DurationLike> {
    static from(
      item: Temporal.Duration | DurationLike | string | object,
      options?: AssignmentOptions
    ): Temporal.Duration;
    constructor(
      years?: number,
      months?: number,
      days?: number,
      hours?: number,
      minutes?: number,
      seconds?: number,
      milliseconds?: number,
      microseconds?: number,
      nanoseconds?: number
    );
    readonly years: number;
    readonly months: number;
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    readonly microseconds: number;
    readonly nanoseconds: number;
    with(durationLike: DurationLike, options: AssignmentOptions): Temporal.Duration;
    plus(other: Temporal.Duration, options: ArithmeticOptions): Temporal.Duration;
    minus(other: Temporal.Duration, options: DurationMinusOptions): Temporal.Duration;
    getFields(): Required<DurationLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export class Absolute extends Required<AbsoluteLike> {
    static fromEpochSeconds(epochSeconds: number): Temporal.Absolute;
    static fromEpochMilliseconds(epochMilliseconds: number): Temporal.Absolute;
    static fromEpochMicroseconds(epochMicroseconds: bigint): Temporal.Absolute;
    static fromEpochNanoseconds(epochNanoseconds: bigint): Temporal.Absolute;
    static from(item: Temporal.Absolute | string | object): Temporal.Absolute;
    static compare(one: Temporal.Absolute, two: Temporal.Absolute): 1 | -1 | 0;
    constructor(epochNanoseconds: bigint);
    getEpochSeconds(): number;
    getEpochMilliseconds(): number;
    getEpochMicroseconds(): bigint;
    getEpochNanoseconds(): bigint;
    plus(temporalDurationLike: DurationLike): Temporal.Absolute;
    minus(temporalDurationLike: DurationLike): Temporal.Absolute;
    difference(
      other: Temporal.Absolute,
      options?: DifferenceOptions<'days' | 'hours' | 'minutes' | 'seconds'>
    ): Temporal.Duration;
    // Should Absolute and DateTime have different names for `inTimeZone`? See #574.
    inTimeZone(temporalTimeZoneLike?: TimeZoneLike): Temporal.DateTime;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(temporalTimeZoneLike?: TimeZoneLike): string;
  }

  export type DateLike = {
    year?: number;
    month?: number;
    day?: number;
  };

  export class Date extends Required<DateLike> {
    static from(item: Temporal.Date | string | object, options?: AssignmentOptions): Temporal.Date;
    static compare(one: Temporal.Date, two: Temporal.Date): ComparisonResult;
    constructor(year: number, month: number, day: number);
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly dayOfWeek: number;
    readonly dayOfYear: number;
    readonly weekOfYear: number;
    readonly daysInYear: number;
    readonly daysInMonth: number;
    readonly isLeapYear: boolean;
    with(temporalDateLike: DateLike, options?: AssignmentOptions): Temporal.Date;
    plus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.Date;
    minus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.Date;
    difference(other: Temporal.Date, options?: DifferenceOptions<'years' | 'months' | 'days'>): Temporal.Duration;
    withTime(temporalTime: Temporal.Time): Temporal.DateTime;
    getYearMonth(): Temporal.YearMonth;
    getMonthDay(): Temporal.MonthDay;
    getFields(): Required<DateLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type DateTimeLike = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    microsecond?: number;
    nanosecond?: number;
  };

  export class DateTime extends Required<DateTimeLike> {
    static from(item: Temporal.DateTime | string | object, options?: AssignmentOptions): Temporal.DateTime;
    static compare(one: Temporal.DateTime, two: Temporal.DateTime): ComparisonResult;
    constructor(
      year: number,
      month: number,
      day: number,
      hour?: number,
      minute?: number,
      second?: number,
      millisecond?: number,
      microsecond?: number,
      nanosecond?: number
    );
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    readonly microsecond: number;
    readonly nanosecond: number;
    readonly dayOfWeek: number;
    readonly dayOfYear: number;
    readonly weekOfYear: number;
    readonly daysInYear: number;
    readonly daysInMonth: number;
    readonly isLeapYear: boolean;
    with(temporalDateTimeLike: DateTimeLike, options?: AssignmentOptions): Temporal.DateTime;
    plus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    minus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    difference(
      other: Temporal.DateTime,
      options?: DifferenceOptions<'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'>
    ): Temporal.Duration;
    // Should Absolute and DateTime have different names for `inTimeZone`? See #574.
    inTimeZone(temporalTimeZoneLike: TimeZoneLike, options?: ToAbsoluteOptions): Temporal.Absolute;
    getDate(): Temporal.Date;
    getYearMonth(): Temporal.YearMonth;
    getMonthDay(): Temporal.MonthDay;
    getTime(): Temporal.Time;
    getFields(): Required<DateTimeLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type MonthDayLike = {
    month?: number;
    day?: number;
  };

  export class MonthDay extends Required<MonthDayLike> {
    static from(item: Temporal.MonthDay | string | object, options?: AssignmentOptions): Temporal.MonthDay;
    static compare(one: Temporal.MonthDay, two: Temporal.MonthDay): ComparisonResult;
    constructor(month: number, day: number);
    readonly month: number;
    readonly day: number;
    with(temporalMonthDayLike: MonthDayLike, options?: AssignmentOptions): Temporal.MonthDay;
    withYear(year: number | { year: number }): Temporal.Date;
    getFields(): Required<MonthDayLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type TimeLike = {
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    microsecond?: number;
    nanosecond?: number;
  };

  export class Time extends Required<TimeLike> {
    static from(item: Temporal.Time | string | object, options?: AssignmentOptions): Temporal.Time;
    static compare(one: Temporal.Time, two: Temporal.Time): ComparisonResult;
    constructor(
      hour?: number,
      minute?: number,
      second?: number,
      millisecond?: number,
      microsecond?: number,
      nanosecond?: number
    );
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    readonly microsecond: number;
    readonly nanosecond: number;
    with(temporalTimeLike: TimeLike, options?: AssignmentOptions): Temporal.Time;
    plus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.Time;
    minus(temporalDurationLike: DurationLike, options?: ArithmeticOptions): Temporal.Time;
    // TODO: should 'days' be included?  Or would that be false advertising? See #580.
    difference(other: Temporal.Time, options?: DifferenceOptions<'hours' | 'minutes' | 'seconds'>): Temporal.Duration;
    withDate(temporalDate: Temporal.Date): Temporal.DateTime;
    getFields(): Required<TimeLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type TimeZoneLike = Temporal.TimeZone | string;

  export class TimeZone {
    static from(timeZone: TimeZoneLike): Temporal.TimeZone;
    constructor(timeZoneIdentifier: string);
    readonly name: string;
    getOffsetNanosecondsFor(absolute: Temporal.Absolute): number;
    getOffsetStringFor(absolute: Temporal.Absolute): string;
    getDateTimeFor(absolute: Temporal.Absolute): Temporal.DateTime;
    getAbsoluteFor(dateTime: Temporal.DateTime, options?: ToAbsoluteOptions): Temporal.Absolute;
    // TODO: should this be changed to getNextTransition/getPreviousTransition? See #613.
    getTransitions(startingPoint: Temporal.Absolute): IteratorResult<Temporal.Absolute>;
    toString(): string;
    toJSON(): string;
  }

  export type YearMonthLike = {
    year?: number;
    month?: number;
  };

  export class YearMonth extends Required<YearMonthLike> {
    static from(item: string | object, options?: AssignmentOptions): Temporal.YearMonth;
    static compare(one: Temporal.YearMonth, two: Temporal.YearMonth): ComparisonResult;
    constructor(year: number, month: number);
    readonly year: number;
    readonly month: number;
    readonly daysInMonth: number;
    readonly daysInYear: number;
    readonly isLeapYear: boolean;
    with(temporalYearMonthLike: YearMonthLike, options: AssignmentOptions): Temporal.YearMonth;
    plus(temporalDurationLike: YearMonthLike, options: ArithmeticOptions): Temporal.YearMonth;
    minus(temporalDurationLike: DurationLike, options: ArithmeticOptions): Temporal.YearMonth;
    difference(other: Temporal.YearMonth, options: DifferenceOptions<'years' | 'months'>): Temporal.Duration;
    withDay(day: number): Temporal.Date;
    getFields(): Required<YearMonthLike>;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export namespace now {
    function absolute(): Temporal.Absolute;
    function dateTime(temporalTimeZoneLike?: TimeZoneLike): Temporal.DateTime;
    function date(temporalTimeZoneLike?: TimeZoneLike): Temporal.Date;
    function time(temporalTimeZoneLike?: TimeZoneLike): Temporal.Time;
    function timeZone(): Temporal.TimeZone;
  }
}
