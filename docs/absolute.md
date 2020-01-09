# `Temporal.Absolute`

An absolute point in time.  
No time zone or offset information is present. As such `Absolute`s have no concept of days, months or even hours. For convenience of interoperability it uses _nanoseconds since the unix-epoch_

## new Temporal.Absolute(epochNanoSeconds : bigint) : Temporal.Absolute

Creates a new `Absolute` object that represents an absolute point on the timeline.

## Temporal.Absolute.from(thing: string | object) : Temporal.Absolute

Creates a new `Absolute` object from either an object or IEO-8601 string.

## absolute.getEpochSeconds() : number

Returns the numeric value of the specified date as the number of seconds since January 1, 1970, 00:00:00 UTC (negative for prior times).

## absolute.getEpochMilliseconds() : number

Returns the numeric value of the specified date as the number of milliseconds since January 1, 1970, 00:00:00 UTC (negative for prior times).

## absolute.getEpochMicroseconds() : bigint

Returns the numeric value of the specified date as the number of microseconds since January 1, 1970, 00:00:00 UTC (negative for prior times).

## absolute.getEpochNanoseconds() : bigint

Returns the numeric value of the specified date as the number of nanoseconds since January 1, 1970, 00:00:00 UTC (negative for prior times).

## absolute.inTimeZone(timeZone: Temporal.TimeZone | string) : Temporal.DateTime

Returns the time zone offset as a `DateTime` object for the current time zone.

## absolute.plus(duration: Temporal.Duration | string | object) : Temporal.Absolute

Returns a new `Absolute` object which is the sum of the current object plus the additional argument.

## absolute.minus(duration: Temporal.Duration | string | object) : Temporal.Absolute

Returns a new `Absolute` object which is the sum of the current object minus the additional argument.

## absolute.difference(other: Temporal.Absolute) : Temporal.Duration

Returns a new `Duration` object which is the difference between the current `Absolute` object and the argument `Absolute` value.

## absolute.toString(timeZone?: Temporal.TimeZone | string) : string

Returns a string in the ISO 8601 date format representing the specified `Absolute` object. Overrides the `Object.prototype.toString()` method.

```js
const date = new Temporal.Absolute(1574074321816000000n);
date.toString(); // 2019-11-18T10:52:01.816Z
```

## absolute.toLocaleString(locale?: string, options: object) : string

Returns a string with a locally sensitive representation of the specified `Absolute` object. Overrides the `Object.prototype.toLocaleString()` method.

### String Example

```js
const date = Temporal.Absolute.from("2019-11-18T11:00:00.000Z");
date.toString(); // 2019-11-18T11:00Z
```

### Object Example

## Temporal.Absolute.compare(one: Temporal.Absolute, two: Temporal.Absolute) : number

Allows for easier comparison of Absolute objects, returns:

- `-1` if the first object represents a lower value than the second
- `0` if the 2 objects represent the same value
- `1` if the first object represents a higher value than the second
