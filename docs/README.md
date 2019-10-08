<!-- headingDivider: 4 -->

# Temporal

## Object Relationship

<div class="mermaid">
graph LR;
  timezone(Time-Zone);
  subgraph " ";
    absolute(Absolute);
  end;
  subgraph " ";
    datetime(DateTime);
      date(Date);
        yearmonth(YearMonth);
        monthday(MonthDay);
      time(Time);
    datetime --- date;
    datetime --- time;
    date --- yearmonth;
    date --- monthday;
  end;
  absolute === timezone;
  timezone === datetime;
</div>

## API

### Temporal.Absolute

An absolute point in time.


#### new Temporal.Absolute(epochNanoSeconds : bigint) : Temporal.Absolute

#### absolute.getEpochSeconds() : number

#### absolute.getEpochMilliseconds() : number

#### absolute.getEpochMicroseconds() : bigint

#### absolute.getEpochNanoseconds() : bigint

#### absolute.inZone(timeZone: Temporal.TimeZone | string) : Temporal.DateTime

#### absolute.plus(duration: Temporal.Duration | string | object) : Temporal.Absolute

#### absolute.minus(duration: Temporal.Duration | string | object) : Temporal.Absolute

#### absolute.difference(other: Temporal.Absolute) : Temporal.Duration

#### absolute.toString(timeZone?: Temporal.TimeZone | string) : string

#### absolute.toLocaleString(locale?: string, options: object) : string

#### Temporal.Absolute.fromString(spec: string) : Temporal.Absolute

#### Temporal.Absolute.compare(one: Temporal.Absolute, two: Temporal.Absolute) : number


### Temporal.TimeZone

A representation of a time-zone giving access to information about offsets & dst-changes as well as allowing for conversions.


#### new Temporal.TimeZone(timeZone: string) : Temporal.TimeZone

#### timeZone.name : string

#### timeZone.getOffsetFor(absolute: Temporal.Absolute) : string

#### timeZone.getDateTimeFor(absolute: Temporal.Absolute) : Temporal.DateTime

#### timeZone.getAbsoluteFor(dateTime: Temporal.DateTime, disambiguation: 'earlier' | 'later' | 'reject' = 'earlier') : Temporal.Absolute

#### timeZone.getTransitions(starPoint: Temporal.Absolute) : iterator<Temporal.Absolute>

#### timeZone.toString() : string

#### Temporal.TimeZone.fromString(spec: string) : Temporal.TimeZone

#### Temporal.TimeZone: iterator<Temporal.TimeZone>


### Temporal.Duration

A representations of a duration of time whcih can be used in date/time arithmetic.


#### new Temporal.Duration(durationLike: object) : Temporal.Duration

#### new Temporal.Duration(iso: string) : Temporal.Duration

#### new Temporal.Duration(years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number, microseconds?: number, nanoseconds?: number) : Temporal.Duration

#### duration.years : number

#### duration.months : number

#### duration.days : number

#### duration.hours : number

#### duration.minutes : number

#### duration.seconds : number

#### duration.milliseconds : number

#### duration.microseconds : number

#### duration.nanoseconds : number

#### duration.years : number

#### duration.toString() : string

#### Temporal.Duration.fromString(iso: string) : Temporal.Duration


### Temporal.Date

A representatio nof a calendar date.


#### new Temporal.Date({ year: number, month: number, day: number }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

#### new Temporal.Date(year: number, month: number, day: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

#### date.year : number

#### date.month : number

#### date.day : number

#### date.dayOfWeek : number

#### date.weekOfYear : number

#### date.daysInMonth : number

#### date.daysInYear : number

#### date.leapYear : boolean

#### date.with(dateLike: object) : Temporal.Date

#### date.plus(duration: Temporal.Duration | object | string) : Temporal.Date

#### date.minus(duration: Temporal.Duration | object | string) : Temporal.Date

#### date.difference(other: Temporal.Date | object) : Temporal.Duration

#### date.toString() : string

#### date.toLocaleString(locale?: string, options?: object) : string

#### date.withTime(time: Temporal.Time | object) : Temporal.DateTime

#### date.getYearMonth() : Temporal.YearMonth

#### date.getMonthDay() : Temporal.MonthDay

#### Temporal.Date.fromString(iso: string) : Temporal.Date

#### Temporal.Date.compare(one: Temporal.Date | object, two: Temporal.Date | object) : number


### Temporal.Time

A representation of wall-clock time.


#### new Temporal.Time(hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0) : Temporal.Time

#### new Temporal.Time({ hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0 }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain')

#### time.hour: number

#### time.minute: number

#### time.second: number

#### time.millisecond: number

#### time.microsecond: number

#### time.nanosecond: number

#### time.with({ hour: number = this.hour, minute: number = this.minute, second: numer = this.second ...}) : Temporal.Time

#### time.plus(duration: string | object) : Temporal.Time

#### time.minus(duration: string | object) : Temporal.Time

#### time.difference(other: Temporal.Time | object) : Temporal.Duration

#### time.toString() : string

#### time.toLocaleString(locale?:string, options?: object) : string

#### time.withDate(date: Temporal.Date | object) : Temporal.DateTime

#### Temporal.Time.fromString(iso: string) : Temporal.Time

#### Temporal.Time.compare(one: Temporal.Time | object, two: Temporal.Time | object) : number;

### Temporal.DateTime


#### new Temporal.DateTime(year: number, month: number, day: number, hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0) : Temporal.Time

#### new Temporal.DateTime({ year: number, month: number, day: number, hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0 }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain')

#### new Temporal.DateTime({ year: number, month: number, day: number }, { hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0 }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain')

#### datetime.year : number

#### datetime.month : number

#### datetime.day : number

#### datetime.hour: number

#### datetime.minute: number

#### datetime.second: number

#### datetime.millisecond: number

#### datetime.microsecond: number

#### datetime.nanosecond: number

#### datetime.dayOfWeek : number

#### datetime.weekOfYear : number

#### datetime.daysInMonth : number

#### datetime.daysInYear : number

#### datetime.leapYear : boolean

#### datetime.with({ year: number, month: number, hour: number, hour: number = this.hour, minute: number = this.minute, ...}) : Temporal.DateTime

#### datetime.plus(duration: string | object) : Temporal.DateTime

#### datetime.minus(duration: string | object) : Temporal.DateTime

#### datetime.difference(other: Temporal.DateTime | object) : Temporal.Duration

#### datetime.toString() : string

#### datetime.toLocaleString(locale?:string, options?: object) : string

#### datetime.getYearMonth() : Temporal.YearMonth

#### datetime.getMonthDay() : Temporal.MonthDay

#### Temporal.DateTime.fromString(iso: string) : Temporal.DateTime

#### Temporal.DateTime.compare(one: Temporal.DateTime | object, two: Temporal.DateTime | object) : number;

### Temporal.YearMonth

A representatio nof a calendar date.


#### new Temporal.YearMonth({ year: number, month: number }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

#### new Temporal.YearMonth(year: number, month: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

#### yearMonth.year : number

#### yearMonth.month : number

#### yearMonth.daysInMonth : number

#### yearMonth.daysInYear : number

#### yearMonth.leapYear : boolean

#### yearMonth.with(yearMonthLike: object) : Temporal.YearMonth

#### yearMonth.plus(duration: Temporal.Duration | object | string) : Temporal.YearMonth

#### yearMonth.minus(duration: Temporal.Duration | object | string) : Temporal.YearMonth

#### yearMonth.difference(other: Temporal.YearMonth | object) : Temporal.Duration

#### yearMonth.toString() : string

#### yearMonth.toLocaleString(locale?: string, options?: object) : string

#### yearMonth.withDay(day: number) : Temporal.Date

#### Temporal.YearMonth.fromString(iso: string) : Temporal.YearMonth

#### Temporal.YearMonth.compare(one: Temporal.YearMonth | object, two: Temporal.YearMonth | object) : number

### Temporal.MonthDay

#### new Temporal.MonthDay({ month: number, day: number }, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

#### new Temporal.MonthDay(month: number, day: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.MonthDay

#### monthDay.month : number

#### monthDay.day : number

#### monthDay.daysInMonth : number

#### monthDay.with(monthDayLike: object) : Temporal.MonthDay

#### monthDay.plus(duration: Temporal.Duration | object | string) : Temporal.MonthDay

#### monthDay.minus(duration: Temporal.Duration | object | string) : Temporal.MonthDay

#### monthDay.difference(other: Temporal.MonthDay | object) : Temporal.Duration

#### monthDay.toString() : string

#### monthDay.toLocaleString(locale?: string, options?: object) : string

#### monthDay.withYear(year: number) : Temporal.Date

#### Temporal.MonthDay.fromString(iso: string) : Temporal.MonthDay

#### Temporal.MonthDay.compare(one: Temporal.MonthDay | object, two: Temporal.MonthDay | object) : number

### Temporal System Information

#### Temporal.getAbsolute() : Temporal.Absolute

#### Temporal.getTimeZone() : Temporal.TimeZone

#### Temporal.getDateTime(timeZone: Temporal.TimeZone | string) : Temporal.DateTime

#### Temporal.getDate(timeZone: Temporal.TimeZone | string) : Temporal.Date

#### Temporal.getTime(timeZone: Temporal.TimeZone | string) : Temporal.Time

## Examples

**Now open your developer tools, and try it out!**

<script type="application/javascript" src="./playground.js"></script>
<script type="application/javascript" src="./mermaid.js"></script>
<script>mermaid.initialize({startOnLoad:true, flowchart:{ useMaxWidth:false } });</script>
<style>.mermaid svg { height: 13em; }</style>
