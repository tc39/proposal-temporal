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
    disambiguation: 'constrain' | 'reject';
  };

  /**
   * Options for assigning fields using `Duration.prototype.with()` or entire
   * objects with `Duration.prototype.from()`.
   * */
  export type DurationAssignmentOptions = {
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
    disambiguation: 'constrain' | 'balance' | 'reject';
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
    disambiguation: 'constrain' | 'reject';
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
     * The default is `'balanceConstrain'`.
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
    static from(
      item: Temporal.Duration | DurationLike | string,
      options?: DurationAssignmentOptions
    ): Temporal.Duration;
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
    with(durationLike: DurationLike, options?: DurationAssignmentOptions): Temporal.Duration;
    plus(other: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.Duration;
    minus(other: Temporal.Duration | DurationLike, options?: DurationMinusOptions): Temporal.Duration;
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
      options?: DifferenceOptions<'days' | 'hours' | 'minutes' | 'seconds'>
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
    daysInMonth?(date: Temporal.Date): number;
    daysInYear?(date: Temporal.Date): number;
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
    plus?(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    minus?(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    difference?(
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
    daysInMonth(date: Temporal.Date): number;
    daysInYear(date: Temporal.Date): number;
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
    plus(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    minus(
      date: Temporal.Date,
      duration: Temporal.Duration,
      options: ArithmeticOptions,
      constructor: ConstructorOf<Temporal.Date>
    ): Temporal.Date;
    difference(
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

  type DateISOCalendarFields = {
    year: number;
    month: number;
    day: number;
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
    readonly daysInYear: number;
    readonly daysInMonth: number;
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
      temporalTime: Temporal.Time,
      options?: ToAbsoluteOptions
    ): Temporal.LocalDateTime;
    toDateTime(temporalTime: Temporal.Time): Temporal.DateTime;
    toYearMonth(): Temporal.YearMonth;
    toMonthDay(): Temporal.MonthDay;
    getFields(): DateFields;
    getISOCalendarFields(): DateISOCalendarFields;
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

  type DateTimeISOCalendarFields = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
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
    readonly daysInYear: number;
    readonly daysInMonth: number;
    readonly isLeapYear: boolean;
    equals(other: Temporal.DateTime): boolean;
    with(dateTimeLike: DateTimeLike, options?: AssignmentOptions): Temporal.DateTime;
    withCalendar(calendar: CalendarProtocol | string): Temporal.DateTime;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.DateTime;
    difference(
      other: Temporal.DateTime,
      options?: DifferenceOptions<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'>
    ): Temporal.Duration;
    toLocalDateTime(tzLike: TimeZoneProtocol | string, options?: ToAbsoluteOptions): Temporal.LocalDateTime;
    toAbsolute(tzLike: TimeZoneProtocol | string, options?: ToAbsoluteOptions): Temporal.Absolute;
    toDate(): Temporal.Date;
    toYearMonth(): Temporal.YearMonth;
    toMonthDay(): Temporal.MonthDay;
    toTime(): Temporal.Time;
    getFields(): DateTimeFields;
    getISOCalendarFields(): DateTimeISOCalendarFields;
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
    toDate(year: number | { era?: string | undefined; year: number }): Temporal.Date;
    getFields(): MonthDayFields;
    getISOCalendarFields(): DateISOCalendarFields;
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
    difference(other: Temporal.Time, options?: DifferenceOptions<'hours' | 'minutes' | 'seconds'>): Temporal.Duration;
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
    readonly isLeapYear: boolean;
    equals(other: Temporal.YearMonth): boolean;
    with(yearMonthLike: YearMonthLike, options?: AssignmentOptions): Temporal.YearMonth;
    plus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.YearMonth;
    minus(durationLike: Temporal.Duration | DurationLike, options?: ArithmeticOptions): Temporal.YearMonth;
    difference(other: Temporal.YearMonth, options?: DifferenceOptions<'years' | 'months'>): Temporal.Duration;
    toDate(day: number): Temporal.Date;
    getFields(): YearMonthFields;
    getISOCalendarFields(): DateISOCalendarFields;
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
    /**`Temporal.Absolute` or ISO "Z" string */
    absolute?: Temporal.Absolute | string;
    /** Enables `from` using only local time values */
    timeZoneOffsetNanoseconds?: number;
  };
  type LocalDateTimeFields = ReturnType<Temporal.DateTime['getFields']> & {
    timeZone: Temporal.TimeZone;
    absolute: Temporal.Absolute;
    timeZoneOffsetNanoseconds: number;
  };
  type LocalDateTimeISOCalendarFields = ReturnType<Temporal.DateTime['getISOCalendarFields']> & {
    timeZone: Temporal.TimeZone;
    absolute: Temporal.Absolute;
    timeZoneOffsetNanoseconds: number;
  };
  /**
   * The `durationKind` option allows users to customize how calculations behave
   * when days aren't exactly 24 hours long. This occurs on days when Daylight
   * Savings Time (DST) starts or ends, or when a country or region legally
   * changes its time zone offset.
   *
   * Choices are:
   * - `'absolute'` - Days are treated as 24 hours long, even if there's a
   *   change in local timezone offset. Math is performed on the underlying
   *   Absolute timestamp and then local time fields are refreshed to match the
   *   updated timestamp.
   * - `'dateTime'` - Day length will vary according to time zone offset changes
   *   like DST transitions. Math is performed on the calendar date and clock
   *   time, and then the Absolute timestamp is refreshed to match the new
   *   calendar date and clock time.
   * - `'hybrid'` - Math is performed by using `'absolute'` math on the time
   *   portion, and `'dateTime'` math on the date portion.
   *
   * Days are almost always 24 hours long, these options produce identical
   * results if the time zone offset of the endpoint matches the time zone offset
   * of the original LocalDateTime. But they may return different results if
   * there's a time zone offset change like a DST transition.
   *
   * For `plus` and `minus` operations the default is `'hybrid'` which matches
   * most users' expectations:
   * - Adding or subtracting whole days should keep clock time unchanged, even
   *   if a DST transition happens. For example: "Postpone my 6:00PM dinner by 7
   *   days, but make sure that the time stays 6:00PM, not 5:00PM or 7:00PM if
   *   DST starts over the weekend."
   * - Adding or removing time should ignore DST changes. For example: "Meet me
   *   at the party in 2 hours, not 1 hour or 3 hours if DST starts tonight".
   *
   * The default is also `'hybrid'` for `difference` operations. In this case,
   * typical users expect that short durations that span a DST boundary
   * are measured using real-world durations, while durations of one day or longer
   * are measured by default using calendar days and clock time. For example:
   * - 1:30AM -> 4:30AM on the day that DST starts is "2 hours", because that's
   *   how much time elapsed in the real word despite a 3-hour difference on the
   *   wall clock.
   * - 1:30AM on the day DST starts -> next day 1:30AM is "1 day" even though only
   *   23 hours have elapsed in the real world.
   *
   * To support these expectations, `'hybrid'` for `difference` works as follows:
   * - If `hours` in clock time is identical at start and end, then an integer
   *   number of days is reported with no `hours` remainder, even if there was a
   *   DST transition in between.
   * - Otherwise, periods of 24 or more real-world hours are reported using clock
   *   time, while periods less than 24 hours are reported using elapsed time.
   */
  export interface DurationKindOptions {
    durationKind: 'absolute' | 'dateTime' | 'hybrid';
  }
  /**
   * For `compare` operations, the default is `'absolute'` because sorting
   * almost always is based on the actual instant that something happened in the
   * real world, even during unusual periods like the hour before and after DST
   * ends where the same clock hour is replayed twice in the real world. During
   * that period, an earlier clock time like "2:30AM Pacific Standard Time" is
   * actually later in the real world than "2:15AM Pacific Daylight Time" which
   * was 45 minutes earlier in the real world but 15 minutes later according to
   * a wall clock. To sort by wall clock times instead, use `'dateTime'`. (`'hybrid'`
   * is not needed nor available for `compare` operations.)
   */
  export interface CompareCalculationOptions {
    calculation: 'absolute' | 'dateTime';
  }
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
  }
  /**
   * Time zone definitions can change. If an application stores data about events
   * in the future, then stored data about future events may become ambiguous,
   * for example if a country permanently abolishes DST. The `prefer` option
   * controls this unusual case.
   *
   * - The default is `'offset'` which will keep the real-world time constant for
   *   these future events, even if their local times change.
   * - The `'dateTime'` option will instead try to keep the local time constant,
   *   even if that results in a different real-world instant.
   * - The `'reject'` option will throw an exception if the the time zone offset
   *   and the time zone identifier result in different real-world instants.
   *
   * If a time zone offset is not present in the input, then this option is
   * ignored.
   */
  export interface TimeZoneOffsetDisambiguationOptions {
    prefer: 'offset' | 'dateTime' | 'reject';
  }
  export type LocalDateTimeAssignmentOptions = Partial<
    OverflowOptions & Temporal.ToAbsoluteOptions & TimeZoneOffsetDisambiguationOptions
  >;
  export type LocalDateTimeMathOptions = Partial<DurationKindOptions & Temporal.ToAbsoluteOptions & OverflowOptions>;
  export type LocalDateTimeDifferenceOptions = Partial<
    Temporal.DifferenceOptions<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'> &
      DurationKindOptions &
      Temporal.ToAbsoluteOptions
  >;
  export class LocalDateTime {
    private _abs;
    private _tz;
    private _dt;
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
    constructor(absolute: Temporal.Absolute, timeZone: Temporal.TimeZone, calendar?: Temporal.CalendarProtocol);
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
    static from(
      item: LocalDateTimeLike | string | Record<string, unknown>,
      options?: LocalDateTimeAssignmentOptions
    ): LocalDateTime;
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
    with(localDateTimeLike: LocalDateTimeLike, options?: LocalDateTimeAssignmentOptions): LocalDateTime;
    /**
     * Get a new `LocalDateTime` instance that uses a specific calendar.
     *
     * Developers using only the default ISO 8601 calendar will probably not need
     * to call this method.
     *
     * @param [calendar=Temporal.Calendar.from('iso8601')]
     * {Temporal.CalendarProtocol} -
     */
    withCalendar(calendar: Temporal.CalendarProtocol): LocalDateTime;
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
    get absolute(): Temporal.Absolute;
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
     * Returns the String representation of this `Temporal.LocalDateTime` in ISO
     * 8601 format extended to include the time zone.
     *
     * Example: `2011-12-03T10:15:30+01:00[Europe/Paris]`
     *
     * If the calendar is not the default ISO 8601 calendar, then it will be
     * appended too. Example: `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`
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
     * True if this `Temporal.LocalDateTime` instance falls exactly on a DST
     * transition or other change in time zone offset, false otherwise.
     *
     * To calculate if a DST transition happens on the same day (but not
     * necessarily at the same time), use `.getDayDuration()`.
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
     * `timeZoneOffsetNanoseconds`, and `absolute`.
     *
     * The result of this method can be used for round-trip serialization via
     * `from()`, `with()`, or `JSON.stringify`.
     */
    getFields(): LocalDateTimeFields;
    /**
     * Method for internal use by non-ISO calendars. Normally not used.
     *
     * TODO: are calendars aware of `Temporal.LocalDateTime`?  If not, remove this
     * method.
     */
    getISOCalendarFields(): LocalDateTimeISOCalendarFields;
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
    static compare(
      one: LocalDateTime,
      two: LocalDateTime,
      options?: CompareCalculationOptions
    ): Temporal.ComparisonResult;
    /**
     * Returns `true` if both the absolute timestamp and time zone are identical
     * to the other `Temporal.LocalDateTime` instance, and `false` otherwise. To
     * compare only the absolute timestamps and ignore time zones, use
     * `.absolute.compare()`.
     */
    equals(other: LocalDateTime): boolean;
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
    plus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
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
    minus(durationLike: Temporal.DurationLike, options?: LocalDateTimeMathOptions): LocalDateTime;
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
    get isLeapYear(): boolean;
    toDate(): Temporal.Date;
    toYearMonth(): Temporal.YearMonth;
    toMonthDay(): Temporal.MonthDay;
    toTime(): Temporal.Time;
    valueOf(): never;
  }
  export {};
}
