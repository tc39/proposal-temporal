# Temporal.Instant

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Instant` is a single point in time (called **"exact time"**), with a precision in nanoseconds.
No time zone or calendar information is present.
To obtain local date/time units like year, month, day, or hour, a `Temporal.Instant` must be combined with a time zone identifier.

<!-- prettier-ignore-start -->
```javascript
instant = Temporal.Instant.from('2020-01-01T00:00+05:30'); // => 2019-12-31T18:30:00Z
instant.epochNanoseconds; // => 1577817000000000000n

// `Temporal.Instant` lacks properties that depend on time zone or calendar
instant.year; // => undefined

zdtTokyo = instant.toZonedDateTimeISO('Asia/Tokyo'); // => 2020-01-01T03:30:00+09:00[Asia/Tokyo]
zdtTokyo.year; // => 2020
zdtTokyo.toPlainDate(); // => 2020-01-01
```
<!-- prettier-ignore-end -->

`Temporal.Instant` stores an integer count of nanoseconds since the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC, ignoring leap seconds.
For interoperability with `Date` and other APIs, `Temporal.Instant` also offers conversion properties and methods for seconds, milliseconds, or microseconds since epoch.
A `Temporal.Instant` can also be created from an ISO 8601 / RFC 3339 string like `'2020-01-23T17:04:36.491865121-08:00'` or `'2020-01-24T01:04Z'`.

Like Unix time, `Temporal.Instant` ignores leap seconds.

## Interoperability with `Date`

`Temporal.Instant` is the easiest way to interoperate between `Temporal` objects and code using `Date`.
Because `Date` and `Temporal.Instant` both use a time-since-epoch data model, conversions between them are zero-parameter method calls that are lossless (except sub-millisecond precision is truncated when converting to `Date`).

<!-- prettier-ignore-start -->
```javascript
// Convert from `Temporal.Instant` to `Date` (which uses millisecond precision)
instant = Temporal.Instant.from('2020-01-01T00:00:00.123456789+05:30');
                                                           // => 2019-12-31T18:30:00.123456789Z
date = new Date(instant.epochMilliseconds);
date.toISOString();                                        // => 2019-12-31T18:30:00.123Z

// Convert from `Date` to `Temporal.Instant`
sameInstant = date.toTemporalInstant();                    // => 2019-12-31T18:30:00.123Z
```
<!-- prettier-ignore-end -->

A `Date` that's been converted to a `Temporal.Instant` can be easily converted to a `Temporal.ZonedDateTime` object by providing a time zone.
From there, calendar and clock properties like `day` or `hour` are available.
Conversions to narrower types like `Temporal.PlainDate` or `Temporal.PlainTime` are also provided.

<!-- prettier-ignore-start -->
```javascript
date = new Date(2019, 11, 31, 18, 30);  // => Tue Dec 31 2019 18:30:00 GMT-0800 (Pacific Standard Time)
instant = date.toTemporalInstant();     // => 2020-01-01T02:30:00Z
zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());
                                        // => 2019-12-31T18:30:00-08:00[America/Los_Angeles]
zonedDateTime.day;                      // => 31
dateOnly = zonedDateTime.toPlainDate(); // => 2019-12-31
```
<!-- prettier-ignore-end -->

Bugs in `Date`=>`Temporal` conversions can be caused by picking the wrong time zone when converting from `Temporal.Instant` to `Temporal.ZonedDateTime`.
For example, the example above constructs the `Date` using local-timezone parameters, so it uses the system time zone: `Temporal.Now.timeZoneId()`.
But if the `Date` had been initialized with a string like `'2019-12-31'`, then getting the same date back in a `Temporal.PlainDate` would require using the `'UTC'` time zone instead.

For discussion and code examples about picking the correct time zone, and also about `Date`<=>`Temporal` interoperability in general, see [Converting between `Temporal` types and legacy `Date`](cookbook.md#converting-between-temporal-types-and-legacy-date) in the documentation cookbook.

## Constructor

### **new Temporal.Instant**(_epochNanoseconds_ : bigint) : Temporal.Instant

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Instant` object.

Creates a new `Temporal.Instant` object that represents an exact time.

`epochNanoseconds` is the number of nanoseconds (10<sup>&minus;9</sup> seconds) from the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC until the desired exact time, ignoring leap seconds.

Use this constructor directly if you know the precise number of nanoseconds already and have it in bigint form, for example from a database.
Otherwise, `Temporal.Instant.from()`, which accepts more kinds of input, is probably more convenient.

The range of allowed values for this type is the same as the old-style JavaScript `Date`, 100 million (10<sup>8</sup>) days before or after the Unix epoch.
This range covers approximately half a million years. If `epochNanoseconds` is outside of this range, a `RangeError` will be thrown.

Example usage:

```js
instant = new Temporal.Instant(1553906700000000000n);
// When was the Unix epoch?
epoch = new Temporal.Instant(0n); // => 1970-01-01T00:00:00Z
// Dates before the Unix epoch are negative
turnOfTheCentury = new Temporal.Instant(-2208988800000000000n); // => 1900-01-01T00:00:00Z
```

## Static methods

### Temporal.Instant.**from**(_item_: Temporal.Instant | string) : Temporal.Instant

**Parameters:**

- `item`: a value convertible to a `Temporal.Instant`.

**Returns:** a new `Temporal.Instant` object.

This static method creates a new `Temporal.Instant` object from another value.
If the value is another `Temporal.Instant` object, a new object representing the same exact time is returned.

Otherwise, the value must be a string, which is expected to be in ISO 8601 format, including a date, a time, and a time zone.
The time zone name, if given, is ignored; only the time zone offset is taken into account.

Example usage:

<!-- prettier-ignore-start -->
```js
instant = Temporal.Instant.from('2019-03-30T01:45:00+01:00[Europe/Berlin]');
instant = Temporal.Instant.from('2019-03-30T01:45+01:00');
instant = Temporal.Instant.from('2019-03-30T00:45Z');
instant === Temporal.Instant.from(instant); // => false

// Not enough information to denote an exact time:
/* WRONG */ instant = Temporal.Instant.from('2019-03-30'); // => throws, no time
/* WRONG */ instant = Temporal.Instant.from('2019-03-30T01:45'); // => throws, no UTC offset
```
<!-- prettier-ignore-end -->

### Temporal.Instant.**fromEpochMilliseconds**(_epochMilliseconds_: number) : Temporal.Instant

**Parameters:**

- `epochMilliseconds` (number): A number of milliseconds.

**Returns:** a new `Temporal.Instant` object.

This static method creates a new `Temporal.Instant` object with milliseconds precision (i.e., zero values in all units smaller than a millisecond).
`epochMilliseconds` is the number of milliseconds from the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC until the desired exact time, ignoring leap seconds.

The number of seconds or milliseconds since the Unix epoch is a common measure of exact time in many computer systems.
Use this method if you need to interface with such a system.

The number of milliseconds since the Unix epoch is also returned from the `getTime()` and `valueOf()` methods of legacy JavaScript `Date` objects, as well as `Date.now()`.
However, for conversion from legacy `Date` to `Temporal.Instant`, use `Date.prototype.toTemporalInstant`:

```js
legacyDate = new Date('1995-12-17T03:24Z');
instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime()); // => 1995-12-17T03:24:00Z
instant = Temporal.Instant.fromEpochMilliseconds(legacyDate); // valueOf() called implicitly
instant = legacyDate.toTemporalInstant(); // recommended

// Use fromEpochMilliseconds, for example, if you have epoch millisecond data stored in a file
todayMs = Temporal.Instant.fromEpochMilliseconds(msReadFromFile);

// If you have epoch seconds data:
epochSecs = 1553906700;  // e.g., read from a file
instant = Temporal.Instant.fromEpochMilliseconds(epochSecs * 1000);
```

### Temporal.Instant.**fromEpochNanoseconds**(_epochNanoseconds_ : bigint) : Temporal.Instant

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Instant` object.

Same as `Temporal.Instant.fromEpochMilliseconds()`, but with nanosecond (10<sup>&minus;9</sup> second) precision.
Also the same as `new Temporal.Instant(epochNanoseconds)`.

If you have epoch microseconds data, you can use this function to create a `Temporal.Instant` from that:
```js
epochMicros = 1553906700_000_000n;
instant = Temporal.Instant.fromEpochNanoseconds(epochMicros * 1000n);
```

### Temporal.Instant.**compare**(_one_: Temporal.Instant | string, _two_: Temporal.Instant | string) : number

**Parameters:**

- `one` (`Temporal.Instant` or value convertible to one): First time to compare.
- `two` (`Temporal.Instant` or value convertible to one): Second time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.Instant` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` represent the same time;
- 1 if `one` comes after `two`.

If `one` and `two` are not `Temporal.Instant` objects, then they will be converted to one as if they were passed to `Temporal.Instant.from()`.

This function can be used to sort arrays of `Temporal.Instant` objects.
For example:

```javascript
one = Temporal.Instant.fromEpochMilliseconds(1.0e12);
two = Temporal.Instant.fromEpochMilliseconds(1.1e12);
three = Temporal.Instant.fromEpochMilliseconds(1.2e12);
sorted = [three, one, two].sort(Temporal.Instant.compare);
sorted.join(' ');
// => '2001-09-09T01:46:40Z 2004-11-09T11:33:20Z 2008-01-10T21:20:00Z'
```

## Properties

### instant.**epochMilliseconds** : number

The value of this property is an integer number of milliseconds from the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC until `instant`, ignoring leap seconds.
This number will be negative if `instant` is before 1970.
The number of milliseconds is truncated towards the beginning of time.

Use this property if you need to interface with some other system that reckons time in milliseconds since the Unix epoch.

This method can be useful in particular to create an old-style JavaScript `Date` object, if one is needed.
An example:

```js
instant = Temporal.Instant.from('2019-03-30T00:45Z');
new Date(instant.epochMilliseconds); // => 2019-03-30T00:45:00.000Z

// If you need epoch seconds data:
epochSecs = Math.floor(instant.epochMillieconds / 1000); // => 1553906700
```

### instant.**epochNanoseconds** : bigint

Same as `epochMilliseconds`, but the value is a bigint with nanosecond (10<sup>&minus;9</sup> second) precision.

The value of this property is suitable to be passed to `new Temporal.Instant()`.

If you need epoch microseconds data, you can divide the epoch nanoseconds by 1000, but note that bigint division is a truncation, whereas you should use floor rounding to calculate epoch microseconds in the case of a negative value.
That can be done with bigints like this:

```js
ns = instant.epochNanoseconds;
epochMicros = ns / 1000n + ((ns % 1000n) < 0n ? -1n : 0n);
```

## Methods

### instant.**toZonedDateTimeISO**(_timeZone_: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (string or `Temporal.ZonedDateTime`): The time zone to use for the conversion. Can be the time zone's string identifier, or a `Temporal.ZonedDateTime` object, whose time zone will be used.

**Returns:** a `Temporal.ZonedDateTime` object representing the calendar date, wall-clock time, time zone offset, and `timeZone`, according to the reckoning of the ISO 8601 calendar, at the exact time indicated by `instant`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

This method always returns a `Temporal.ZonedDateTime` with the ISO 8601 calendar.
Remember to use `withCalendar()` on the result if you need to do computations in other calendars.

Example usage:

```js
// Converting a specific exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochMilliseconds(1553993100_000);
timestamp.toZonedDateTimeISO('Europe/Berlin'); // => 2019-03-31T01:45:00+01:00[Europe/Berlin]
timestamp.toZonedDateTimeISO('UTC'); // => 2019-03-31T00:45:00+00:00[UTC]
timestamp.toZonedDateTimeISO('-08:00'); // => 2019-03-30T16:45:00-08:00[-08:00]

// What time was the Unix epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA) in the Gregorian calendar?
epoch = Temporal.Instant.fromEpochMilliseconds(0);
epoch.toZonedDateTimeISO('America/New_York').withCalendar('gregory');
  // => 1969-12-31T19:00:00-05:00[America/New_York][u-ca=gregory]

// What time was the Unix epoch in Tokyo in the Japanese calendar?
zdt = epoch.toZonedDateTimeISO('Asia/Tokyo').withCalendar('japanese');
  // => 1970-01-01T09:00:00+09:00[Asia/Tokyo][u-ca=japanese]
console.log(zdt.eraYear, zdt.era);
  // => '45 showa'
```
<!-- prettier-ignore-end -->

### instant.**add**(_duration_: Temporal.Duration | object | string) : Temporal.Instant

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.

**Returns:** a new `Temporal.Instant` object which is the exact time indicated by `instant` plus `duration`.

This method adds `duration` to `instant`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

The `years`, `months`, `weeks`, and `days` fields of `duration` must be zero.
`Temporal.Instant` is independent of time zones and calendars, and so years, months, weeks, and days may be different lengths depending on which calendar or time zone they are reckoned in.
This makes an addition with those units ambiguous.
To add those units, convert the `Temporal.Instant` to a `Temporal.ZonedDateTime` by specifying the desired calendar and time zone, add the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Example usage:

```js
// Temporal.Instant representing five hours from now
Temporal.Now.instant().add({ hours: 5 });
fiveHours = Temporal.Duration.from({ hours: 5 });
Temporal.Now.instant().add(fiveHours);
```

### instant.**subtract**(_duration_: Temporal.Duration | object | string) : Temporal.Instant

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.

**Returns:** a new `Temporal.Instant` object which is the exact time indicated by `instant` minus `duration`.

This method subtracts `duration` from `instant`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

The `years`, `months`, `weeks`, and `days` fields of `duration` must be zero.
`Temporal.Instant` is independent of time zones and calendars, and so years, months, weeks, and days may be different lengths depending on which calendar or time zone they are reckoned in.
This makes a subtraction with those units ambiguous.
To subtract those units, convert the `Temporal.Instant` to a `Temporal.ZonedDateTime` by specifying the desired calendar and time zone, subtract the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Example usage:

```js
// Temporal.Instant representing this time an hour ago
Temporal.Now.instant().subtract({ hours: 1 });
oneHour = Temporal.Duration.from({ hours: 1 });
Temporal.Now.instant().subtract(oneHour);
```

### instant.**until**(_other_: Temporal.Instant | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.Instant` or value convertible to one): Another exact time until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are the same as for `largestUnit`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the difference between `instant` and `other`.

This method computes the elapsed time after the exact time represented by `instant` and until the exact time represented by `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `instant` then the resulting duration will be negative.

If `other` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.
A value of `'auto'` means `'second'`, unless `smallestUnit` is `'hour'` or `'minute'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is seconds.
Weeks, months, years, and days are not allowed, unlike the difference methods of other Temporal types.
This is because months and years can be different lengths depending on which month is meant, and whether the year is a leap year, which all depends on the start and end date of the difference.
You cannot determine the start and end date of a difference between `Temporal.Instant`s, because `Temporal.Instant` has no time zone or calendar.
In addition, weeks can be different lengths in different calendars, and days can be different lengths when the time zone has a daylight saving transition.

To calculate the difference in days or larger units between two `Temporal.Instant`s, first convert both (using the `toZonedDateTimeISO` or `toZonedDateTime` methods) to `Temporal.ZonedDateTime` objects in the same time zone and calendar.
For example, you might decide to base the calculation on your user's current time zone, or on UTC, in the Gregorian calendar.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method.
The default is to do no rounding.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Example usage:

<!-- prettier-ignore-start -->
```js
startOfMoonMission = Temporal.Instant.from('1969-07-16T13:32:00Z');
endOfMoonMission = Temporal.Instant.from('1969-07-24T16:50:35Z');
missionLength = startOfMoonMission.until(endOfMoonMission, { largestUnit: 'hour' });
  // => PT195H18M35S
missionLength.toLocaleString();
  // example output: '195 hours 18 minutes 35 seconds'

// Rounding, for example if you don't care about the minutes and seconds
approxMissionLength = startOfMoonMission.until(endOfMoonMission, {
  largestUnit: 'hour',
  smallestUnit: 'hour'
});
  // => PT195H

// A billion (10^9) seconds since the epoch in different units
epoch = Temporal.Instant.fromEpochMilliseconds(0);
billion = Temporal.Instant.fromEpochMilliseconds(1e9);
epoch.until(billion);
  // => PT1000000000S
epoch.until(billion, { largestUnit: 'hour' });
  // => PT277777H46M40S
ns = epoch.until(billion, { largestUnit: 'nanosecond' });
  // => PT1000000000S
ns.add({ nanoseconds: 1 });
  // => PT1000000000S
  // (lost precision)

// Calculate the difference in years, eliminating the ambiguity by
// explicitly using the corresponding calendar date in UTC:
epoch.toZonedDateTimeISO('UTC').until(
  billion.toZonedDateTimeISO('UTC'),
  { largestUnit: 'year' }
);
  // => P31Y8M8DT1H46M40S
```
<!-- prettier-ignore-end -->

### instant.**since**(_other_: Temporal.Instant | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.Instant` or value convertible to one): Another exact time since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are the same as for `largestUnit`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the difference between `instant` and `other`.

This method computes the elapsed time before the exact time represented by `instant` and since the exact time represented by `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `instant` then the resulting duration will be negative.

This method does the same thing as the `Temporal.Instant.prototype.until()` method, but reversed.
The outcome of `instant1.since(instant2)` is the same as `instant1.until(instant2).negated()`.

Example usage:

```js
// A billion (10^9) seconds since the epoch in different units
epoch = Temporal.Instant.fromEpochSeconds(0);
billion = Temporal.Instant.fromEpochSeconds(1e9);
billion.since(epoch); // => PT1000000000S
```

### instant.**round**(_roundTo_: string | object) : Temporal.Instant

**Parameters:**

- `roundTo` (string | object): A required string or object to control the operation.
  - If a string is provided, the resulting `Temporal.Instant` object will be rounded to that unit.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    A string parameter is treated the same as an object whose `smallestUnit` property value is that string.
  - If an object is passed, the following properties are recognized:
    - `smallestUnit` (required string): The unit to round to.
      Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
      The default is 1.
    - `roundingMode` (string): How to handle the remainder.
      Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
      The default is `'halfExpand'`.

**Returns:** a new `Temporal.Instant` object which is `instant` rounded to `roundTo` (if a string parameter is used) or `roundingIncrement` of `smallestUnit` (if an object parameter is used).

Rounds `instant` to the given unit and increment, and returns the result as a new `Temporal.Instant` object.

The `smallestUnit` option (or the value of `roundTo` if a string parameter is used) determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

The combination of `roundingIncrement` and `smallestUnit` must make an increment that divides evenly into 86400 seconds (one 24-hour solar day).
(For example, increments of 15 minutes and 45 seconds are both allowed.
25 minutes, and 7 seconds are both not allowed.)

The `roundingMode` option controls how the rounding is performed.

- `'ceil'`, `'expand'`: Always round up, towards the end of time.
- `'floor'`, `'trunc'`: Always round down, towards the beginning of time.
- `'halfCeil'`, `'halfExpand'`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `'ceil'`.
- `'halfFloor'`, `'halfTrunc'`: Round to the nearest of the allowed values, like `'halfExpand'`, but when there is a tie, round down, like `'floor'`.
- `'halfEven'`: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of `roundingIncrement`.
  For example, with a `roundingIncrement` of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).

Several pairs of modes behave the same as each other, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.

The default rounding mode is `'halfExpand'` to match how rounding is often taught in school.
Note that this is different than the `'trunc'` default used by `until` and `since` options because rounding up would be an unexpected default for those operations.
Other properties behave identically between these methods.

Example usage:

<!-- prettier-ignore-start -->
```javascript
instant = Temporal.Instant.from('2019-03-30T02:45:59.999999999Z');

// Round to a particular unit
instant.round({ smallestUnit: 'second' }); // => 2019-03-30T02:46:00Z
// Round to an increment of a unit, e.g. an hour:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute' });
  // => 2019-03-30T03:00:00Z
// Round to the same increment but round down instead:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 2019-03-30T02:00:00Z
```
<!-- prettier-ignore-end -->

### instant.**equals**(_other_: Temporal.Instant | string) : boolean

**Parameters:**

- `other` (`Temporal.Instant` or value convertible to one): Another exact time to compare.

**Returns:** `true` if `instant` and `other` are equal, or `false` if not.

Compares two `Temporal.Instant` objects for equality.

This function exists because it's not possible to compare using `instant == other` or `instant === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than `Temporal.Instant.compare`.

If `other` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

Example usage:

```javascript
one = Temporal.Instant.fromEpochMilliseconds(1.0e12);
two = Temporal.Instant.fromEpochMilliseconds(1.1e12);
one.equals(two); // => false
one.equals(one); // => true
```

### instant.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `timeZone` (string or `Temporal.ZonedDateTime`): the time zone to express `instant` in, as a string identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
    The default is to use UTC.
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`.

**Returns:** a string in the ISO 8601 date format representing `instant`.

This method overrides the `Object.prototype.toString()` method and provides a convenient string representation of `instant`.
The string can be passed to `Temporal.Instant.from()` to create a new `Temporal.Instant` object.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.ZonedDateTime.round()`.
Note that rounding may change the value of other units as well.

If the `timeZone` option is not provided or is `undefined`, then the string will express the date and time in UTC and the `Z` offset designator will be appended.
However, if the `timeZone` option is given, then the string will express the date and time in the given time zone, and contain the time zone's numeric UTC offset, rounded to the nearest minute.

Example usage:

```js
instant = Temporal.Instant.fromEpochMilliseconds(1574074321816);
instant.toString(); // => '2019-11-18T10:52:01.816Z'
instant.toString({ timeZone: 'UTC' });
// => '2019-11-18T10:52:01.816+00:00'
instant.toString({ timeZone: 'Asia/Seoul' });
// => '2019-11-18T19:52:01.816+09:00'

instant.toString({ smallestUnit: 'minute' });
// => '2019-11-18T10:52Z'
instant.toString({ fractionalSecondDigits: 0 });
// => '2019-11-18T10:52:01Z'
instant.toString({ fractionalSecondDigits: 4 });
// => '2019-11-18T10:52:01.8160Z'
instant.toString({ smallestUnit: 'second', roundingMode: 'halfExpand' });
// => '2019-11-18T10:52:02Z'
```

### instant.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `instant`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `instant`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

Because `Temporal.Instant` does not carry a time zone, the time zone used for the output will be the `timeZone` property of `options`, if present; and otherwise, the current time zone from the environment, which is usually the system's time zone.

This is identical to how the time zone is determined in legacy `Date`'s `toLocaleString` method.

> **NOTE**: Be careful when calling this method in a server environment, where the server's time zone may be set to UTC.

Example usage:

```js
instant = Temporal.Instant.from('2019-11-18T11:00:00.000Z');
instant.toLocaleString(); // example output: '2019-11-18, 3:00:00 a.m.'
instant.toLocaleString('de-DE'); // example output: '18.11.2019, 03:00:00'
instant.toLocaleString('de-DE', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'long'
}); // => '18.11.2019, 12:00 Mitteleuropäische Normalzeit'
instant.toLocaleString('en-US-u-nu-fullwide-hc-h12', {
  timeZone: 'Asia/Kolkata'
}); // => '１１/１８/２０１９, ４:３０:００ PM'
```

### instant.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `instant`, in the UTC time zone.

This method is like `instant.toString()` but always produces a string in UTC time.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.Instant` object from a string, is `Temporal.Instant.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.Instant` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.Instant`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const meeting = {
  id: 355,
  name: 'Budget review',
  location: 'https://meet.jit.si/ObjectiveTomatoesJokeSurely',
  startInstant: Temporal.Instant.from('2020-03-30T15:00-04:00[America/New_York]'),
  endInstant: Temporal.Instant.from('2020-03-30T16:00-04:00[America/New_York]')
};
const str = JSON.stringify(meeting, null, 2);
console.log(str);
// =>
// {
//   "id": 355,
//   "name": "Budget review",
//   "location": "https://meet.jit.si/ObjectiveTomatoesJokeSurely",
//   "startInstant": "2020-03-30T19:00Z",
//   "endInstant": "2020-03-30T20:00Z"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Instant')) return Temporal.Instant.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### instant.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.Instant` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.Instant.compare()` for this, or `instant.equals()` for equality.
