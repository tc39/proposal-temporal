# `Temporal.Date`

A representatio nof a calendar date.

## new Temporal.Date(year: number, month: number, day: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

## date.year : number

## date.month : number

## date.day : number

## date.dayOfWeek : number

## date.weekOfYear : number

## date.daysInMonth : number

## date.daysInYear : number

## date.leapYear : boolean

## date.with(dateLike: object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

## date.plus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

## date.minus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

## date.difference(other: Temporal.Date | object) : Temporal.Duration

## date.toString() : string

## date.toLocaleString(locale?: string, options?: object) : string

## date.withTime(time: Temporal.Time | object) : Temporal.DateTime

## date.getYearMonth() : Temporal.YearMonth

## date.getMonthDay() : Temporal.MonthDay

## Temporal.Date.fromString(iso: string) : Temporal.Date

## Temporal.Date.from(thing: string | object) : Temporal.Date

## Temporal.Date.compare(one: Temporal.Date | object, two: Temporal.Date | object) : number
