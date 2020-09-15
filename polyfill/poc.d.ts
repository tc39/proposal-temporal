export namespace Temporal {
  export type ComparisonResult = -1 | 0 | 1;
  type ConstructorOf<T> = new (...args: unknown[]) => T;

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
     * - In `'reject'` mode, out-of-range values will cause the function to
     *   throw a RangeError.
     *
     * The default is `'constrain'`.
     */
    overflow: 'constrain' | 'reject';
  };

  /**
   * Options for assigning fields using `Duration.prototype.with()` or entire
   * objects with `Duration.prototype.from()`, and for arithmetic with
   * `Duration.prototype.plus()` and `Duration.prototype.minus()`.
   * */
  export type DurationOptions = {
    /**
     * How to deal with out-of-range values
     *
     * - In `'constrain'` mode, out-of-range values are clamped to the nearest
     *   in-range value.
     * - In `'balance'` mode, out-of-range values are resolved by balancing them
     *   with the next highest unit.
     * - In `'reject'` mode, out-of-range values will cause the function to
     *   throw a RangeError.
     *
     * The default is `'constrain'`.
     */
    overflow: 'constrain' | 'balance' | 'reject';
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
     * - `'compatible'`: Equivalent to `'earlier'` for backward transitions like
     *   the start of DST in the Spring, and `'later'` for forward transitions
     *   like the end of DST in the Fall. This matches the behavior of legacy
     *   `Date`, of libraries like moment.js, Luxon, or date-fns, and of
     *   cross-platform standards like [RFC 5545
     *   (iCalendar)](https://tools.ietf.org/html/rfc5545).
     * - `'earlier'`: The earlier time of two possible times
     * - `'later'`: The later of two possible times
     * - `'reject'`: Throw a RangeError instead
     *
     * The default is `'compatible'`.
     *
     * */
    disambiguation: 'compatible' | 'earlier' | 'later' | 'reject';
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
    overflow: 'constrain' | 'reject';
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
     */
    largestUnit: T;
  }

  export type DurationLike = {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
  };

  type DurationFields = Required<DurationLike>;

  /**
   *
   * A `Temporal.Duration` represents an immutable duration of time which can be
   * used in date/time arithmetic.
   *
   * See https://tc39.es/proposal-temporal/docs/duration.html for more details.
   */
  export class Duration implements DurationFields {
    static from(item: Temporal.Duration | DurationLike | string, options?: DurationOptions): Temporal.Duration;
    constructor(
      years?: number,
      months?: number,
      weeks?: number,
      days?: number,
      hours?: number,
      minutes?: number,
      seconds?: number,
      milliseconds?: number,
      microseconds?: number,
      nanoseconds?: number
    );
    readonly sign: -1 | 0 | 1;
    readonly years: number;
    readonly months: number;
    readonly weeks: number;
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    readonly microseconds: number;
    readonly nanoseconds: number;
    negated(): Temporal.Duration;
    abs(): Temporal.Duration;
    with(durationLike: DurationLike, options?: DurationOptions): Temporal.Duration;
    plus(other: Temporal.Duration | DurationLike, options?: DurationOptions): Temporal.Duration;
    minus(other: Temporal.Duration | DurationLike, options?: DurationOptions): Temporal.Duration;
    getFields(): DurationFields;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  /**
   * A `Temporal.Absolute` is an absolute point in time, with a precision in
   * nanoseconds. No time zone or calendar information is present. Therefore,
   * `Temporal.Absolute` has no concept of days, months, or even hours.
   *
   * For convenience of interoperability, it internally uses nanoseconds since
   * the {@link https://en.wikipedia.org/wiki/Unix_time|Unix epoch} (midnight
   * UTC on January 1, 1970). However, a `Temporal.Absolute` can be created from
   * any of several expressions that refer to a single point in time, including
   * an {@link https://en.wikipedia.org/wiki/ISO_8601|ISO 8601 string} with a
   * time zone offset such as '2020-01-23T17:04:36.491865121-08:00'.
   *
   * See https://tc39.es/proposal-temporal/docs/absolute.html for more details.
   */
  export class Absolute {
    static fromEpochSeconds(epochSeconds: number): Temporal.Absolute;
    static fromEpochMilliseconds(epochMilliseconds: number): Temporal.Absolute;
    static fromEpochMicroseconds(epochMicroseconds: bigint): Temporal.Absolute;
    static fromEpochNanoseconds(epochNanoseconds: bigint): Temporal.Absolute;
    static from(item: Temporal.Absolute | string): Temporal.Absolute;
    static compare(one: Temporal.Absolute, two: Temporal.Absolute): ComparisonResult;
    constructor(epochNanoseconds: bigint);
    getEpochSeconds(): number;
    getEpochMilliseconds(): number;
    getEpochMicroseconds(): bigint;
    getEpochNanoseconds(): bigint;
    equals(other: Temporal.Absolute): boolean;
    plus(durationLike: Temporal.Duration | DurationLike): Temporal.Absolute;
    minus(durationLike: Temporal.Duration | DurationLike): Temporal.Absolute;
    difference(
      other: Temporal.Absolute,
      options?: DifferenceOptions<'hours' | 'minutes' | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds'>
    ): Temporal.Duration;
    toLocalDateTime(tzLike: TimeZoneProtocol | string, calendar?: CalendarProtocol | string): Temporal.LocalDateTime;
    toDateTime(tzLike: TimeZoneProtocol | string, calendar?: CalendarProtocol | string): Temporal.DateTime;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(tzLike?: TimeZoneProtocol | string): string;
  }

  export interface CalendarProtocol {
    id: string;
    year(date: Temporal.Date): number;
    month(date: Temporal.Date): number;
    day(date: Temporal.Date): number;
    era(date: Temporal.Date): string | undefined;
    dayOfWeek?(date: Temporal.Date): number;
    dayOfYear?(date: Temporal.Date): number;
    weekOfYear?(date: Temporal.Date): number;
    daysInWeek?(date: Temporal.Date): number;
    daysInMonth?(date: Temporal.Date): number;
    daysInYear?(date: Temporal.Date): number;
    monthsInYear?(date: Temporal.Date): number;
    isLeapYear?(date: Temporal.Date): boolean;
    dateFromFields(
      fields: DateLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    yearMonthFromFields(
      fields: YearMonthLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.YearMonth>
    ): Temporal.YearMonth;
    monthDayFromFields(
      fields: MonthDayLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.MonthDay>
    ): Temporal.MonthDay;
    datePlus?(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    dateMinus?(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    dateDifference?(
      smaller: Temporal.Date,
      larger: Temporal.Date,
      options: DifferenceOptions<'years' | 'months' | 'weeks' | 'days'>
    ): Temporal.Duration;
  }

  /**
   * A `Temporal.Calendar` is a representation of a calendar system. It includes
   * information about how many days are in each year, how many months are in
   * each year, how many days are in each month, and how to do arithmetic in\
   * that calendar system.
   *
   * See https://tc39.es/proposal-temporal/docs/calendar.html for more details.
   */
  export class Calendar implements Required<CalendarProtocol> {
    static from(item: CalendarProtocol | string): Temporal.Calendar;
    constructor(calendarIdentifier: string);
    readonly id: string;
    year(date: Temporal.Date): number;
    month(date: Temporal.Date): number;
    day(date: Temporal.Date): number;
    era(date: Temporal.Date): string | undefined;
    dayOfWeek(date: Temporal.Date): number;
    dayOfYear(date: Temporal.Date): number;
    weekOfYear(date: Temporal.Date): number;
    daysInWeek(date: Temporal.Date): number;
    daysInMonth(date: Temporal.Date): number;
    daysInYear(date: Temporal.Date): number;
    monthsInYear(date: Temporal.Date): number;
    isLeapYear(date: Temporal.Date): boolean;
    dateFromFields(
      fields: DateLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    yearMonthFromFields(
      fields: YearMonthLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.YearMonth>
    ): Temporal.YearMonth;
    monthDayFromFields(
      fields: MonthDayLike,
      options: AssignmentOptions,
      constructor: ConstructorOf<Temporal.MonthDay>
    ): Temporal.MonthDay;
    datePlus(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    dateMinus(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    dateDifference(
      smaller: Temporal.Date,
      larger: Temporal.Date,
      options?: DifferenceOptions<'years' | 'months' | 'weeks' | 'days'>
    ): Temporal.Duration;
    toString(): string;
  }

  export type DateLike = {
    era?: string | undefined;
    year?: number;
    month?: number;
    day?: number;
    calendar?: CalendarProtocol | string;
  };

  type DateFields = {
    era: string | undefined;
    year: number;
    month: number;
    day: number;
    calendar: CalendarProtocol;
  };

  type DateISOFields = {
    isoYear: number;
    isoMonth: number;
    isoDay: number;
    calendar: CalendarProtocol;
  };

  /**
   * A `Temporal.Date` represents a calendar date. "Calendar date" refers to the
   * concept of a date as expressed in everyday usage, independent of any time
   * zone. For example, it could be used to represent an event on a calendar
   * which happens during the whole day no matter which time zone it's happening
   * in.
   *
   * See https://tc39.es/proposal-temporal/docs/date.html for more details.
   */
  export class Date implements DateFields {
    static from(item: Temporal.Date | DateLike | string, options?: AssignmentOptions): Temporal.Date;
    static compare(one: Temporal.Date, two: Temporal.Date): ComparisonResult;
    constructor(isoYear: number, isoMonth: number, isoDay: number, calendar?: CalendarProtocol);
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly calendar: CalendarProtocol;
    readonly era: string | undefined;
    readonly dayOfWeek: number;
    readonly dayOfYear: number;
    readonly weekOfYear: number;
    readonly daysInWeek: number;
    readonly daysInYear: number;
    readonly daysInMonth: number;
    readonly monthsInYear: number;
    readonly isLeapYear: boolean;
    equals(other: Temporal.Date): boolean;
    with(dateLike: DateLike, options?: AssignmentOptions): Temporal.Date;
    withCalendar(calendar: CalendarProtocol | string): Temporal.Date;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.Date;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.Date;
    difference(
      other: Temporal.Date,
      options?: DifferenceOptions<'years' | 'months' | 'weeks' | 'days'>
    ): Temporal.Duration;
    toLocalDateTime(
      tzLike: TimeZoneProtocol | string,
      temporalTime?: Temporal.Time,
      options?: ToAbsoluteOptions
    ): Temporal.LocalDateTime;
    toDateTime(temporalTime: Temporal.Time): Temporal.DateTime;
    toYearMonth(): Temporal.YearMonth;
    toMonthDay(): Temporal.MonthDay;
    getFields(): DateFields;
    getISOFields(): DateISOFields;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type DateTimeLike = {
    era?: string | undefined;
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
    microsecond?: number;
    nanosecond?: number;
    calendar?: CalendarProtocol | string;
  };

  type DateTimeFields = {
    era: string | undefined;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
    calendar: CalendarProtocol;
  };

  type DateTimeISOFields = {
    isoYear: number;
    isoMonth: number;
    isoDay: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
    calendar: CalendarProtocol;
  };

  /**
   * A `Temporal.DateTime` represents a calendar date and wall-clock time, with
   * a precision in nanoseconds, and without any time zone. Of the Temporal
   * classes carrying human-readable time information, it is the most general
   * and complete one. `Temporal.Date`, `Temporal.Time`, `Temporal.YearMonth`,
   * and `Temporal.MonthDay` all carry less information and should be used when
   * complete information is not required.
   *
   * See https://tc39.es/proposal-temporal/docs/datetime.html for more details.
   */
  export class DateTime implements DateTimeFields {
    static from(item: Temporal.DateTime | DateTimeLike | string, options?: AssignmentOptions): Temporal.DateTime;
    static compare(one: Temporal.DateTime, two: Temporal.DateTime): ComparisonResult;
    constructor(
      isoYear: number,
      isoMonth: number,
      isoDay: number,
      hour?: number,
      minute?: number,
      second?: number,
      millisecond?: number,
      microsecond?: number,
      nanosecond?: number,
      calendar?: CalendarProtocol
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
    readonly calendar: CalendarProtocol;
    readonly era: string | undefined;
    readonly dayOfWeek: number;
    readonly dayOfYear: number;
    readonly weekOfYear: number;
    readonly daysInWeek: number;
    readonly daysInYear: number;
    readonly daysInMonth: number;
    readonly monthsInYear: number;
    readonly isLeapYear: boolean;
    equals(other: Temporal.DateTime): boolean;
    with(dateTimeLike: DateTimeLike, options?: AssignmentOptions): Temporal.DateTime;
    withCalendar(calendar: CalendarProtocol | string): Temporal.DateTime;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    difference(
      other: Temporal.DateTime,
      options?: DifferenceOptions<
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
    toLocalDateTime(tzLike: TimeZoneProtocol | string, options?: ToAbsoluteOptions): Temporal.LocalDateTime;
    toAbsolute(tzLike: TimeZoneProtocol | string, options?: ToAbsoluteOptions): Temporal.Absolute;
    toDate(): Temporal.Date;
    toYearMonth(): Temporal.YearMonth;
    toMonthDay(): Temporal.MonthDay;
    toTime(): Temporal.Time;
    getFields(): DateTimeFields;
    getISOFields(): DateTimeISOFields;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  export type MonthDayLike = {
    month?: number;
    day?: number;
  };

  type MonthDayFields = {
    month: number;
    day: number;
    calendar: CalendarProtocol;
  };

  type MonthDayISOFields = {
    refISOYear: number;
    isoMonth: number;
    isoDay: number;
    calendar: CalendarProtocol;
  };

  /**
   * A `Temporal.MonthDay` represents a particular day on the calendar, but
   * without a year. For example, it could be used to represent a yearly
   * recurring event, like "Bastille Day is on the 14th of July."
   *
   * See https://tc39.es/proposal-temporal/docs/monthday.html for more details.
   */
  export class MonthDay implements MonthDayFields {
    static from(item: Temporal.MonthDay | MonthDayLike | string, options?: AssignmentOptions): Temporal.MonthDay;
    constructor(isoMonth: number, isoDay: number, calendar?: CalendarProtocol, refISOYear?: number);
    readonly month: number;
    readonly day: number;
    readonly calendar: CalendarProtocol;
    equals(other: Temporal.MonthDay): boolean;
    with(monthDayLike: MonthDayLike, options?: AssignmentOptions): Temporal.MonthDay;
    toDateInYear(year: number | { era?: string | undefined; year: number }, options?: AssignmentOptions): Temporal.Date;
    getFields(): MonthDayFields;
    getISOFields(): MonthDayISOFields;
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

  type TimeFields = Required<TimeLike>;

  /**
   * A `Temporal.Time` represents a wall-clock time, with a precision in
   * nanoseconds, and without any time zone. "Wall-clock time" refers to the
   * concept of a time as expressed in everyday usage — the time that you read
   * off the clock on the wall. For example, it could be used to represent an
   * event that happens daily at a certain time, no matter what time zone.
   *
   * `Temporal.Time` refers to a time with no associated calendar date; if you
   * need to refer to a specific time on a specific day, use
   * `Temporal.DateTime`. A `Temporal.Time` can be converted into a
   * `Temporal.DateTime` by combining it with a `Temporal.Date` using the
   * `toDateTime()` method.
   *
   * See https://tc39.es/proposal-temporal/docs/time.html for more details.
   */
  export class Time implements TimeFields {
    static from(item: Temporal.Time | TimeLike | string, options?: AssignmentOptions): Temporal.Time;
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
    equals(other: Temporal.Time): boolean;
    with(timeLike: Temporal.Time | TimeLike, options?: AssignmentOptions): Temporal.Time;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.Time;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.Time;
    difference(
      other: Temporal.Time,
      options?: DifferenceOptions<'hours' | 'minutes' | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds'>
    ): Temporal.Duration;
    toLocalDateTime(
      tzLike: TimeZoneProtocol | string,
      temporalDate: DateLike,
      options?: ToAbsoluteOptions
    ): Temporal.LocalDateTime;
    toDateTime(temporalDate: Temporal.Date): Temporal.DateTime;
    getFields(): TimeFields;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  /**
   * A plain object implementing the protocol for a custom time zone.
   */
  export interface TimeZoneProtocol {
    name?: string;
    getOffsetNanosecondsFor(absolute: Temporal.Absolute): number;
    getOffsetStringFor?(absolute: Temporal.Absolute): string;
    getDateTimeFor(absolute: Temporal.Absolute, calendar?: CalendarProtocol | string): Temporal.DateTime;
    getAbsoluteFor?(dateTime: Temporal.DateTime, options?: ToAbsoluteOptions): Temporal.Absolute;
    getNextTransition?(startingPoint: Temporal.Absolute): Temporal.Absolute | null;
    getPreviousTransition?(startingPoint: Temporal.Absolute): Temporal.Absolute | null;
    getPossibleAbsolutesFor(dateTime: Temporal.DateTime): Temporal.Absolute[];
    toString(): string;
    toJSON?(): string;
  }

  /**
   * A `Temporal.TimeZone` is a representation of a time zone: either an
   * {@link https://www.iana.org/time-zones|IANA time zone}, including
   * information about the time zone such as the offset between the local time
   * and UTC at a particular time, and daylight saving time (DST) changes; or
   * simply a particular UTC offset with no DST.
   *
   * Since `Temporal.Absolute` and `Temporal.DateTime` do not contain any time
   * zone information, a `Temporal.TimeZone` object is required to convert
   * between the two.
   *
   * See https://tc39.es/proposal-temporal/docs/timezone.html for more details.
   */
  export class TimeZone implements Required<TimeZoneProtocol> {
    static from(timeZone: Temporal.TimeZone | string): Temporal.TimeZone;
    constructor(timeZoneIdentifier: string);
    readonly name: string;
    getOffsetNanosecondsFor(absolute: Temporal.Absolute): number;
    getOffsetStringFor(absolute: Temporal.Absolute): string;
    getDateTimeFor(absolute: Temporal.Absolute, calendar?: CalendarProtocol | string): Temporal.DateTime;
    getLocalDateTimeFor(absolute: Temporal.Absolute, calendar?: CalendarProtocol | string): Temporal.LocalDateTime;
    getAbsoluteFor(dateTime: Temporal.DateTime, options?: ToAbsoluteOptions): Temporal.Absolute;
    getNextTransition(startingPoint: Temporal.Absolute): Temporal.Absolute | null;
    getPreviousTransition(startingPoint: Temporal.Absolute): Temporal.Absolute | null;
    getPossibleAbsolutesFor(dateTime: Temporal.DateTime): Temporal.Absolute[];
    toString(): string;
    toJSON(): string;
  }

  export type YearMonthLike = {
    era?: string | undefined;
    year?: number;
    month?: number;
  };

  type YearMonthFields = {
    era: string | undefined;
    year: number;
    month: number;
    calendar: CalendarProtocol;
  };

  type YearMonthISOFields = {
    isoYear: number;
    isoMonth: number;
    refISODay: number;
    calendar: CalendarProtocol;
  };

  /**
   * A `Temporal.YearMonth` represents a particular month on the calendar. For
   * example, it could be used to represent a particular instance of a monthly
   * recurring event, like "the June 2019 meeting".
   *
   * See https://tc39.es/proposal-temporal/docs/yearmonth.html for more details.
   */
  export class YearMonth implements YearMonthFields {
    static from(item: Temporal.YearMonth | YearMonthLike | string, options?: AssignmentOptions): Temporal.YearMonth;
    static compare(one: Temporal.YearMonth, two: Temporal.YearMonth): ComparisonResult;
    constructor(isoYear: number, isoMonth: number, calendar?: CalendarProtocol, refISODay?: number);
    readonly year: number;
    readonly month: number;
    readonly calendar: CalendarProtocol;
    readonly era: string | undefined;
    readonly daysInMonth: number;
    readonly daysInYear: number;
    readonly monthsInYear: number;
    readonly isLeapYear: boolean;
    equals(other: Temporal.YearMonth): boolean;
    with(yearMonthLike: YearMonthLike, options?: AssignmentOptions): Temporal.YearMonth;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.YearMonth;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.YearMonth;
    difference(other: Temporal.YearMonth, options?: DifferenceOptions<'years' | 'months'>): Temporal.Duration;
    toDateOnDay(day: number): Temporal.Date;
    getFields(): YearMonthFields;
    getISOFields(): YearMonthISOFields;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toJSON(): string;
    toString(): string;
  }

  /**
   * The `Temporal.now` object has several methods which give information about
   * the current date, time, and time zone.
   *
   * See https://tc39.es/proposal-temporal/docs/now.html for more details.
   */
  export namespace now {
    /**
     * Get the system date and time as a `Temporal.Absolute`.
     *
     * This method gets the current absolute system time, without regard to
     * calendar or time zone. This is a good way to get a timestamp for an
     * event, for example. It works like the old-style JavaScript `Date.now()`,
     * but with nanosecond precision instead of milliseconds.
     * */
    export function absolute(): Temporal.Absolute;

    /**
     * Get the current calendar date and clock time in a specific time zone.
     *
     * @param {TimeZoneProtocol | string} [tzLike] -
     * {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|IANA time zone identifier}
     * string (e.g. `'Europe/London'`), `Temporal.TimeZone` instance, or an
     * object implementing the time zone protocol. If omitted,
     * the environment's current time zone will be used.
     * @param {Temporal.Calendar | string} [calendar] - calendar identifier, or
     * a `Temporal.Calendar` instance, or an object implementing the calendar
     * protocol. If omitted, the ISO 8601 calendar is used.
     */
    export function dateTime(
      tzLike?: TimeZoneProtocol | string,
      calendar?: CalendarProtocol | string
    ): Temporal.DateTime;

    /**
     * Get the current calendar date in a specific time zone.
     *
     * @param {TimeZoneProtocol | string} [tzLike] -
     * {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|IANA time zone identifier}
     * string (e.g. `'Europe/London'`), `Temporal.TimeZone` instance, or an
     * object implementing the time zone protocol. If omitted,
     * the environment's current time zone will be used.
     * @param {Temporal.Calendar | string} [calendar] - calendar identifier, or
     * a `Temporal.Calendar` instance, or an object implementing the calendar
     * protocol. If omitted, the ISO 8601 calendar is used.
     */
    export function date(tzLike?: TimeZoneProtocol | string, calendar?: CalendarProtocol | string): Temporal.Date;

    /**
     * Get the current clock time in a specific time zone.
     *
     * @param {TimeZoneProtocol | string} [tzLike] -
     * {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|IANA time zone identifier}
     * string (e.g. `'Europe/London'`), `Temporal.TimeZone` instance, or an
     * object implementing the time zone protocol. If omitted, the environment's
     * current time zone will be used.
     */
    export function time(tzLike?: TimeZoneProtocol | string): Temporal.Time;

    /**
     * Get the environment's current time zone.
     *
     * This method gets the current system time zone. This will usually be a
     * named
     * {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|IANA time zone}.
     */
    export function timeZone(): Temporal.TimeZone;
  }

  // ========== POC Types===========

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
  type LocalDateTimeISOFields = ReturnType<Temporal.DateTime['getISOFields']> & {
    timeZone: Temporal.TimeZone;
    timeZoneOffsetNanoseconds: number;
  };
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
   * If the ISO string ends in 'Z' then this option is ignored because there is no
   * possibility of ambiguity.
   *
   * If a time zone offset is not present in the input, then this option is
   * ignored because the time zone will always be used to calculate the offset.
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
    Temporal.AssignmentOptions & Temporal.ToAbsoluteOptions & TimeZoneOffsetDisambiguationOptions
  >;
  export type LocalDateTimeMathOptions = Temporal.AssignmentOptions;
  export type LocalDateTimeDifferenceOptions = Partial<
    Temporal.DifferenceOptions<
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
  >;
  export class LocalDateTime {
    private _abs;
    private _tz;
    private _dt;
    /**
     * Construct a new `Temporal.LocalDateTime` instance from an absolute
     * timestamp, time zone, and optional calendar.
     *
     * Use `Temporal.LocalDateTime.from()`To construct a `Temporal.LocalDateTime`
     * from an ISO 8601 string or from a time zone and `DateTime` fields (like
     * year or hour).
     *
     * @param epochNanoseconds {bigint} - absolute timestamp (in nanoseconds since
     * UNIX epoch) for this instance
     * @param timeZone {Temporal.TimeZoneProtocol} - time zone for this instance
     * @param [calendar=Temporal.Calendar.from('iso8601')] {Temporal.CalendarProtocol} -
     * calendar for this instance (defaults to ISO calendar)
     */
    constructor(epochNanoseconds: bigint, timeZone: Temporal.TimeZoneProtocol, calendar?: Temporal.CalendarProtocol);
    /**
     * Build a `Temporal.LocalDateTime` instance from one of the following:
     * - Another LocalDateTime instance, in which case the result will deep-clone
     *   the input.
     * - A "LocalDateTime-like" property bag object with required properties
     *   `timeZone`, `year`, `month`, and `day`. Other fields (time fields and
     *   `timeZoneOffsetNanoseconds`) are optional. If `timeZoneOffsetNanoseconds`
     *   is not provided, then the time can be ambiguous around DST transitions.
     *   The `disambiguation` option can resolve this ambiguity.
     * - An ISO 8601 date+time+offset string (the same format used by
     *   `Temporal.Absolute.from`) with a time zone identifier suffix appended in
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
      item: LocalDateTimeLike | string | Record<string, unknown>,
      options?: LocalDateTimeAssignmentOptions
    ): LocalDateTime;
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
    with(localDateTimeLike: LocalDateTimeLike, options?: LocalDateTimeAssignmentOptions): LocalDateTime;
    /**
     * Get a new `Temporal.LocalDateTime` instance that uses a specific calendar.
     *
     * Developers using only the default ISO 8601 calendar will probably not need
     * to call this method.
     *
     * @param [calendar=Temporal.Calendar.from('iso8601')]
     * {Temporal.CalendarProtocol} - new calendar to use
     */
    withCalendar(calendar: Temporal.CalendarProtocol): LocalDateTime;
    /**
     * Returns the absolute timestamp of this `Temporal.LocalDateTime` instance as
     * a `Temporal.Absolute`.
     */
    toAbsolute(): Temporal.Absolute;
    /**
     * Returns the `Temporal.TimeZone` representing this object's time zone.
     *
     * Although this property is a `Temporal.TimeZone` object, `JSON.stringify`
     * will automatically convert it to a JSON-friendly IANA time zone identifier
     * string (e.g. `'Europe/Paris'`) when persisting to JSON.
     */
    get timeZone(): Temporal.TimeZone;
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
    get calendar(): Temporal.CalendarProtocol;
    /**
     * Returns a new `Temporal.DateTime` instance that corresponds to this
     * `Temporal.LocalDateTime` instance.
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
     * Returns a new `Temporal.LocalDateTime` instance representing the first
     * valid time during the current calendar day and time zone of `this`.
     *
     * The local time of the result is almost always `00:00`, but in rare cases it
     * could be a later time e.g. if DST starts at midnight in a time zone. For
     * example:
     * ```
     * const ldt = Temporal.LocalDateTime.from('2015-10-18T12:00-02:00[America/Sao_Paulo]');
     * ldt.startOfDay; // => 2015-10-18T01:00-02:00[America/Sao_Paulo]
     * ```
     */
    get startOfDay(): LocalDateTime;
    /**
     * True if this `Temporal.LocalDateTime` instance is immediately after a DST
     * transition or other change in time zone offset, false otherwise.
     *
     * "Immediately after" means that subtracting one nanosecond would yield a
     * `Temporal.LocalDateTime` instance that has a different value for
     * `timeZoneOffsetNanoseconds`.
     *
     * To calculate if a DST transition happens on the same day (but not
     * necessarily at the same time), use `.hoursInDay() !== 24`.
     * */
    get isTimeZoneOffsetTransition(): boolean;
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
    get timeZoneOffsetNanoseconds(): number;
    /**
     * Offset (as a string like `'+05:00'` or `'-07:00'`) relative to UTC of the
     * current time zone and absolute instant.
     *
     * This property is useful for custom formatting of LocalDateTime instances.
     *
     * This field cannot be passed to `from` and `with`.  Instead, use
     * `timeZoneOffsetNanoseconds`.
     * */
    get timeZoneOffsetString(): string;
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
    getFields(): LocalDateTimeFields;
    /**
     * Method for internal use by non-ISO calendars. Normally not used.
     */
    getISOFields(): LocalDateTimeISOFields;
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
    static compare(one: LocalDateTime, two: LocalDateTime): Temporal.ComparisonResult;
    /**
     * Returns `true` if both the absolute timestamp and time zone are identical
     * to the other `Temporal.LocalDateTime` instance, and `false` otherwise. To
     * compare only the absolute timestamps and ignore time zones, use
     * `.toAbsolute().compare()`.
     */
    equals(other: LocalDateTime): boolean;
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
    plus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
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
    minus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
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
     * largestUnit: 'years' | 'months' | 'weeks' | 'days' | 'hours' (default)
     *   | 'minutes' | 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds'
     * ```
     */
    difference(other: LocalDateTime, options?: LocalDateTimeDifferenceOptions): Temporal.Duration;
    /**
     * Convert to a localized string.
     *
     * This works the same as `DateTime.prototype.toLocaleString`, except time
     * zone option is automatically set and cannot be overridden by the caller.
     */
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    /**
     * String representation of this `Temporal.LocalDateTime` in ISO 8601 format
     * extended to include the time zone.
     *
     * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
     *
     * If the calendar is not the default ISO 8601 calendar, then it will be
     * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
     */
    toJSON(): string;
    /**
     * String representation of this `Temporal.LocalDateTime` in ISO 8601 format
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
  }
  export {};
}
