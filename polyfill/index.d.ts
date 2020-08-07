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
      options?: DifferenceOptions<'days' | 'hours' | 'minutes' | 'seconds'>
    ): Temporal.Duration;
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
    toDateInYear(year: number | { era?: string | undefined; year: number }, options?: AssignmentOptions): Temporal.Date;
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
    toDateOnDay(day: number): Temporal.Date;
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
}
