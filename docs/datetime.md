# `Temporal.DateTime`

## new Temporal.DateTime(year: number, month: number, day: number, hour: number, minute: number, second: number = 0, milliseconds: number =0, microsecond: number = 0, nanosecond: nunber = 0, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Time

## Temporal.DateTime.from(thing: string | object) : Temporal.DateTime

## datetime.year : number

## datetime.month : number

## datetime.day : number

## datetime.hour: number

## datetime.minute: number

## datetime.second: number

## datetime.millisecond: number

## datetime.microsecond: number

## datetime.nanosecond: number

## datetime.dayOfWeek : number

## datetime.weekOfYear : number

## datetime.daysInMonth : number

## datetime.daysInYear : number

## datetime.leapYear : boolean

## datetime.with({ year: number, month: number, hour: number, hour: number = this.hour, minute: number = this.minute, ...}, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

## datetime.plus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

## datetime.minus(duration: string | object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.DateTime

## datetime.difference(other: Temporal.DateTime) : Temporal.Duration

## datetime.toString() : string

## datetime.toLocaleString(locale?:string, options?: object) : string

## datetime.inTimeZone(timeZoneParam = 'UTC', disambiguation = 'earlier') : Temporal.Absolute

## datetime.getDate() : Temporal.Date

## datetime.getYearMonth() : Temporal.YearMonth

## datetime.getMonthDay() : Temporal.MonthDay

## datetime.getTime() : Temporal.Time

## Temporal.DateTime.compare(one: Temporal.DateTime, two: Temporal.DateTime) : number;

<script type="application/javascript" src="./prism.js"></script>
<link rel="stylesheet" type="text/css" href="./prism.css">
