# `Temporal.Date`

A representation of a calendar date.

## new Temporal.Date(year: number, month: number, day: number, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

Creates a new `Date` object that represents a calendar date

## Temporal.Date.from(thing: string | object) : Temporal.Date

## date.year : number

Returns the year this `Date` represents

## date.month : number

Returns the month this `Date` represents

## date.day : number

Returns the day this `Date` represents

## date.dayOfWeek : number

Returns the day of the week this `Date` represents

```js
const date = new Temporal.Date(2019, 11, 18); // Monday
date.dayOfWeek; // 1
```

## date.weekOfYear : number

Returns the week in a calendar year

## date.daysInMonth : number

Returns the number of days in the month the `Date` Object represents

## date.daysInYear : number

Returns the number of days in the year the `Date` Object represents

## date.leapYear : boolean

Returns a boolean indicating whether the `Date` is in a leap year or not

## date.with(dateLike: object, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

## date.plus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

Returns a new `Date` object which is the sum of the current object plus the additional argument.

## date.minus(duration: Temporal.Duration | object | string, disambiguation: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.Date

Returns a new `Date` object which is the sum of the current object minus the additional argument.

## date.difference(other: Temporal.Date | object) : Temporal.Duration

Returns a new `Duration` object which is the difference between the current `Date` object and the argument `Date` value.

## date.toString() : string

Returns an ISO 8601 string representing the current `Date` object

## date.toLocaleString(locale?: string, options?: object) : string

Returns a string with a locally sensitive representation of the specified `Date` object. Overrides the `Object.prototype.toLocaleString()` method.

## date.withTime(time: Temporal.Time | object) : Temporal.DateTime

Returns a new [`DateTime`](./DateTime) object using the combination of this `Date` and the `Time` object passed in.

## date.getYearMonth() : Temporal.YearMonth

Returns a new [`YearMonth`](./YearMonth) object.

## date.getMonthDay() : Temporal.MonthDay

Returns a new [`YearMonth`](./MonthDay) object.

## Temporal.Date.compare(one: Temporal.Date | object, two: Temporal.Date | object) : number

Allows for easier comparison of `Date` objects, returns:

- `-1` if the first object represents a lower value than the second
- `0` if the 2 objects represent the same value
- `1` if the first object represents a higher value than the second
