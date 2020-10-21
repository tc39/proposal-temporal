# Temporal.Instant

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Instant` is a single point in time (called **"exact time"**), with a precision in nanoseconds.
No time zone or calendar information is present.
As such `Temporal.Instant` has no concept of days, months or even hours.

For convenience of interoperability, it internally uses nanoseconds since the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) (midnight UTC on January 1, 1970).
However, a `Temporal.Instant` can be created from any of several expressions that refer to an exact time, including an ISO 8601 string with a time zone such as `'2020-01-23T17:04:36.491865121-08:00'`.

If you have a legacy `Date` instance, you can use its `toTemporalInstant()` method to convert to a `Temporal.Instant`.

Since `Temporal.Instant` doesn't contain any information about time zones, a `Temporal.TimeZone` is needed in order to convert it into a `Temporal.DateTime` (and from there into any of the other `Temporal` objects.)

Like Unix time, `Temporal.Instant` ignores leap seconds.

## Constructor

### **new Temporal.Instant**(_epochNanoseconds_ : bigint) : Temporal.Instant

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Instant` object.

Creates a new `Temporal.Instant` object that represents an exact time.

`epochNanoseconds` is the number of nanoseconds (10<sup>&minus;9</sup> seconds) between the Unix epoch (midnight UTC on January 1, 1970) and the desired exact time.

Use this constructor directly if you know the precise number of nanoseconds already and have it in bigint form, for example from a database.
Otherwise, `Temporal.Instant.from()`, which accepts more kinds of input, is probably more convenient.

The range of allowed values for this type is the same as the old-style JavaScript `Date`, 100 million (10<sup>8</sup>) days before or after the Unix epoch.
This range covers approximately half a million years. If `epochNanoseconds` is outside of this range, a `RangeError` will be thrown.

Example usage:

```js
instant = new Temporal.Instant(1553906700000000000n);
// When was the Unix epoch?
epoch = new Temporal.Instant(0n); // => 1970-01-01T00:00Z
// Dates before the Unix epoch are negative
turnOfTheCentury = new Temporal.Instant(-2208988800000000000n); // => 1900-01-01T00:00Z
```

## Static methods

### Temporal.Instant.**from**(_thing_: any) : Temporal.Instant

**Parameters:**

- `thing`: The value representing the desired exact time.

**Returns:** a new `Temporal.Instant` object.

This static method creates a new `Temporal.Instant` object from another value.
If the value is another `Temporal.Instant` object, a new object representing the same exact time is returned.

Any other value is converted to a string, which is expected to be in ISO 8601 format, including a date, a time, and a time zone.
If the exact time cannot be uniquely determined from the string, then this function throws an exception.
This includes the case when `thing` is a validly-formatted ISO 8601 string denoting a time that doesn't exist, for example because it was skipped in a daylight saving time transition.

Example usage:

<!-- prettier-ignore-start -->
```js
instant = Temporal.Instant.from('2019-03-30T01:45:00+01:00[Europe/Berlin]');
instant = Temporal.Instant.from('2019-03-30T01:45+01:00');
instant = Temporal.Instant.from('2019-03-30T00:45Z');
instant === Temporal.Instant.from(instant); // => true

// Not enough information to denote an exact time:
/* WRONG */ instant = Temporal.Instant.from('2019-03-30'); // no time; throws
/* WRONG */ instant = Temporal.Instant.from('2019-03-30T01:45'); // no time zone; throws
/* WRONG */ instant = Temporal.Instant.from('2019-03031T02:45+01:00[Europe/Berlin]');
    // time skipped in DST transition; throws
```
<!-- prettier-ignore-end -->

### Temporal.Instant.**fromEpochSeconds**(_epochSeconds_: number) : Temporal.Instant

**Parameters:**

- `epochSeconds` (number): A number of seconds.

**Returns:** a new `Temporal.Instant` object.

This static method creates a new `Temporal.Instant` object with seconds precision.
`epochSeconds` is the number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and the desired exact time.

The number of seconds since the Unix epoch is a common measure of exact time in many computer systems.
Use this method if you need to interface with such a system.

Example usage:

```js
// Same examples as in new Temporal.Instant(), but with seconds precision
instant = Temporal.Instant.fromEpochSeconds(1553906700);
epoch = Temporal.Instant.fromEpochSeconds(0); // => 1970-01-01T00:00Z
turnOfTheCentury = Temporal.Instant.fromEpochSeconds(-2208988800); // => 1900-01-01T00:00Z
```

### Temporal.Instant.**fromEpochMilliseconds**(_epochMilliseconds_: number) : Temporal.Instant

**Parameters:**

- `epochMilliseconds` (number): A number of milliseconds.

**Returns:** a new `Temporal.Instant` object.

Same as `Temporal.Instant.fromEpochSeconds()`, but with millisecond (10<sup>&minus;3</sup> second) precision.

The number of milliseconds since the Unix epoch is also returned from the `getTime()` and `valueOf()` methods of legacy JavaScript `Date` objects, as well as `Date.now()`.
However, for conversion from legacy `Date` to `Temporal.Instant`, use `Date.prototype.toTemporalInstant`:

```js
legacyDate = new Date('December 17, 1995 03:24:00 GMT');
instant = Temporal.Instant.fromEpochMilliseconds(legacyDate.getTime()); // => 1995-12-17T03:24Z
instant = Temporal.Instant.fromEpochMilliseconds(+legacyDate); // valueOf() called implicitly
instant = legacyDate.toTemporalInstant(); // recommended

// Use fromEpochMilliseconds, for example, if you have epoch millisecond
// data stored in a file:
todayMs = Temporal.Instant.fromEpochMilliseconds(msReadFromFile);
```

### Temporal.Instant.**fromEpochMicroseconds**(_epochMilliseconds_ : bigint) : Temporal.Instant

**Parameters:**

- `epochMicroseconds` (bigint): A number of microseconds.

**Returns:** a new `Temporal.Instant` object.

Same as `Temporal.Instant.fromEpochSeconds()`, but with microsecond (10<sup>&minus;6</sup> second) precision.

### Temporal.Instant.**fromEpochNanoseconds**(_epochNanoseconds_ : bigint) : Temporal.Instant

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Instant` object.

Same as `Temporal.Instant.fromEpochSeconds()`, but with nanosecond (10<sup>&minus;9</sup> second) precision.
Also the same as `new Temporal.Instant(epochNanoseconds)`.

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
one = Temporal.Instant.fromEpochSeconds(1.0e9);
two = Temporal.Instant.fromEpochSeconds(1.1e9);
three = Temporal.Instant.fromEpochSeconds(1.2e9);
sorted = [three, one, two].sort(Temporal.Instant.compare);
sorted.join(' ');
// => 2001-09-09T01:46:40Z 2004-11-09T11:33:20Z 2008-01-10T21:20Z
```

## Properties

### instant.**epochSeconds** : number

The value of this property is an integer number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and `instant`.
This number will be negative if `instant` is before 1970.
The number of seconds is truncated towards zero.

Use this property if you need to interface with some other system that reckons time in seconds since the Unix epoch.

Example usage:

```js
instant = Temporal.Instant.from('2019-03-30T01:45+01:00');
instant.epochSeconds; // => 1554000300
```

### instant.**epochMilliseconds** : number

Same as `epochSeconds`, but with millisecond (10<sup>&minus;3</sup> second) precision.
The number of seconds is truncated towards zero.

This method can be useful in particular to create an old-style JavaScript `Date` object, if one is needed.
An example:

```js
instant = Temporal.Instant.from('2019-03-30T00:45Z');
new Date(instant.epochMilliseconds); // => 2019-03-30T00:45:00.000Z
```

### instant.**epochMicroseconds** : bigint

Same as `epochSeconds`, but the value is a bigint with microsecond (10<sup>&minus;6</sup> second) precision.
The number of seconds is truncated towards zero.

### instant.**epochNanoseconds** : bigint

Same as `epochSeconds`, but the value is a bigint with nanosecond (10<sup>&minus;9</sup> second) precision.

The value of this property is suitable to be passed to `new Temporal.Instant()`.

## Methods

### instant.**toZonedDateTimeISO**(_timeZone_: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (object or string): A `Temporal.TimeZone` object, or an object implementing the [time zone protocol](./timezone.md#protocol), or a string description of the time zone; either its IANA name or UTC offset.

**Returns:** a `Temporal.ZonedDateTime` object representing the calendar date, wall-clock time, time zone offset, and `timeZone`, according to the reckoning of the ISO 8601 calendar, at the exact time indicated by `instant`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

This method is one way to convert a `Temporal.Instant` to a `Temporal.ZonedDateTime`.
It is the same as `toZonedDateTime()`, but always uses the ISO 8601 calendar.
Use this method if you are not doing computations in other calendars.

Example usage:

```js
// Converting a specific exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
timestamp.toZonedDateTimeISO('Europe/Berlin'); // => 2019-03-31T01:45+02:00[Europe/Berlin]
timestamp.toZonedDateTimeISO('UTC'); // => 2019-03-31T00:45+00:00[UTC]
timestamp.toZonedDateTimeISO('-08:00'); // => 2019-03-30T16:45-08:00[-08:00]
```

### instant.**toZonedDateTime**(_timeZone_: object | string, _calendar_: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (object or string): A `Temporal.TimeZone` object, or an object implementing the [time zone protocol](./timezone.md#protocol), or a string description of the time zone; either its IANA name or UTC offset.
- `calendar` (object or string): A `Temporal.Calendar` object, or a plain object, or a calendar identifier.

**Returns:** a `Temporal.ZonedDateTime` object representing the calendar date, wall-clock time, time zone offset, and `timeZone`, according to the reckoning of `calendar`, at the exact time indicated by `instant`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

For a list of calendar identifiers, see the documentation for [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters).

If you only want to use the ISO 8601 calendar, use `toDateTimeISO()`.

Example usage:

<!-- prettier-ignore-start -->
```js
// What time was the Unix epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA) in the Gregorian calendar?
epoch = Temporal.Instant.fromEpochSeconds(0);
tz = Temporal.TimeZone.from('America/New_York');
epoch.toZonedDateTime(tz, 'gregory');
  // => 1969-12-31T19:00-05:00[America/New_York][c=gregory]

// What time was the Unix epoch in Tokyo in the Japanese calendar?
tz = Temporal.TimeZone.from('Asia/Tokyo');
cal = Temporal.Calendar.from('japanese');
zdt = epoch.toZonedDateTime(tz, cal);
  // => 1970-01-01T09:00+09:00[Asia/Tokyo][c=japanese]
console.log(zdt.year, zdt.era);
  // => 45 showa
```
<!-- prettier-ignore-end -->

### instant.**toDateTimeISO**(_timeZone_: object | string) : Temporal.DateTime

**Parameters:**

- `timeZone` (object or string): A `Temporal.TimeZone` object, or an object implementing the [time zone protocol](./timezone.md#protocol), or a string description of the time zone; either its IANA name or UTC offset.

**Returns:** a `Temporal.DateTime` object representing the calendar date, wall-clock time in `timeZone`, according to the reckoning of the ISO 8601 calendar, at the exact time indicated by `instant`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

This method is one way to convert a `Temporal.Instant` to a `Temporal.DateTime`.
It is the same as `toDateTime()`, but always uses the ISO 8601 calendar.
Use this method if you are not doing computations in other calendars.

Example usage:

```js
// Converting an exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
timestamp.toDateTime('Europe/Berlin'); // => 2019-03-31T01:45
timestamp.toDateTime('UTC'); // => 2019-03-31T00:45
timestamp.toDateTime('-08:00'); // => 2019-03-30T16:45
```

### instant.**toDateTime**(_timeZone_: object | string, _calendar_: object | string) : Temporal.DateTime

**Parameters:**

- `timeZone` (object or string): A `Temporal.TimeZone` object, or an object implementing the [time zone protocol](./timezone.md#protocol), or a string description of the time zone; either its IANA name or UTC offset.
- `calendar` (object or string): A `Temporal.Calendar` object, or a plain object, or a calendar identifier.

**Returns:** a `Temporal.DateTime` object indicating the calendar date and wall-clock time in `timeZone`, according to the reckoning of `calendar`, at the instant time indicated by `instant`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

For a list of calendar identifiers, see the documentation for [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters).

This method is one way to convert a `Temporal.Instant` to a `Temporal.DateTime`.

If you only want to use the ISO 8601 calendar, use `toDateTimeISO()`.

Example usage:

<!-- prettier-ignore-start -->
```js
// What time was the Unix epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA) in the Gregorian calendar?
epoch = Temporal.Instant.fromEpochSeconds(0);
tz = Temporal.TimeZone.from('America/New_York');
epoch.toDateTime(tz, 'gregory');
  // => 1969-12-31T19:00[c=gregory]

// What time was the Unix epoch in Tokyo in the Japanese calendar?
tz = Temporal.TimeZone.from('Asia/Tokyo');
cal = Temporal.Calendar.from('japanese');
dt = epoch.toDateTime(tz, cal);
  // => 1970-01-01T09:00[c=japanese]
console.log(dt.year, dt.era);
  // => 45 showa
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
If you need to do this, convert the `Temporal.Instant` to a `Temporal.DateTime` by specifying the desired calendar and time zone, add the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Example usage:

```js
// Temporal.Instant representing five hours from now
Temporal.now.instant().add({ hours: 5 });
fiveHours = Temporal.Duration.from({ hours: 5 });
Temporal.now.instant().add(fiveHours);
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
If you need to do this, convert the `Temporal.Instant` to a `Temporal.DateTime` by specifying the desired calendar and time zone, subtract the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Example usage:

```js
// Temporal.Instant representing this time an hour ago
Temporal.now.instant().subtract({ hours: 1 });
oneHour = Temporal.Duration.from({ hours: 1 });
Temporal.now.instant().subtract(oneHour);
```

### instant.**difference**(_other_: Temporal.Instant | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.Instant` or value convertible to one): Another exact time with which to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are the same as for `largestUnit`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the difference between `instant` and `other`.

This method computes the difference between the two exact times represented by `instant` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `instant` then the resulting duration will be negative.

If `other` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.
A value of `'auto'` means `'seconds'`, unless `smallestUnit` is `'hours'` or `'minutes'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is seconds.
Weeks, months, years, and days are not allowed, unlike the difference methods of the other Temporal types.
This is because months and years can be different lengths depending on which month is meant, and whether the year is a leap year, which all depends on the start and end date of the difference.
You cannot determine the start and end date of a difference between `Temporal.Instant`s, because `Temporal.Instant` has no time zone or calendar.
In addition, weeks can be different lengths in different calendars, and days can be different lengths when the time zone has a daylight saving transition.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method.
The default is to do no rounding.

If you do need to calculate the difference between two `Temporal.Instant`s in years, months, weeks, or days, then you can make an explicit choice on how to eliminate this ambiguity, choosing your starting point by converting to a `Temporal.DateTime`.
For example, you might decide to base the calculation on your user's current time zone, or on UTC, in the Gregorian calendar.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Example usage:

<!-- prettier-ignore-start -->
```js
startOfMoonMission = Temporal.Instant.from('1969-07-16T13:32:00Z');
endOfMoonMission = Temporal.Instant.from('1969-07-24T16:50:35Z');
missionLength = endOfMoonMission.difference(startOfMoonMission, { largestUnit: 'days' });
  // => PT195H18M35S
startOfMoonMission.difference(endOfMoonMission, { largestUnit: 'days' });
  // => throws RangeError
missionLength.toLocaleString();
  // example output: '195 hours 18 minutes 35 seconds'

// Rounding, for example if you don't care about the minutes and seconds
approxMissionLength = endOfMoonMission.difference(startOfMoonMission, {
  largestUnit: 'days',
  smallestUnit: 'hours'
});
  // => P8DT3H

// A billion (10^9) seconds since the epoch in different units
epoch = Temporal.Instant.fromEpochSeconds(0);
billion = Temporal.Instant.fromEpochSeconds(1e9);
billion.difference(epoch);
  // =>    PT1000000000S
billion.difference(epoch, { largestUnit: 'hours' });
  // =>  PT277777H46M40S
ns = billion.difference(epoch, { largestUnit: 'nanoseconds' });
  // =>    PT1000000000S
ns.add({ nanoseconds: 1 });
  // =>    PT1000000000S (lost precision)

// Calculate the difference in years, eliminating the ambiguity by
// explicitly using the corresponding calendar date in UTC:
utc = Temporal.TimeZone.from('UTC');
billion.toDateTime(utc).difference(epoch.toDateTime(utc), { largestUnit: 'years' });
  // => P31Y8M8DT1H46M40S
```
<!-- prettier-ignore-end -->

### instant.**round**(_options_: object) : Temporal.Instant

**Parameters:**

- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `smallestUnit` (required string): The unit to round to.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a new `Temporal.Instant` object which is `instant` rounded to `roundingIncrement` of `smallestUnit`.

Rounds `instant` to the given unit and increment, and returns the result as a new `Temporal.Instant` object.

The `smallestUnit` option determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

The combination of `roundingIncrement` and `smallestUnit` must make an increment that divides evenly into 86400 seconds (one 24-hour solar day).
(For example, increments of 15 minutes and 45 seconds are both allowed.
25 minutes, and 7 seconds are both not allowed.)

The `roundingMode` option controls how the rounding is performed.

- `ceil`: Always round up, towards the end of time.
- `floor`, `trunc`: Always round down, towards the beginning of time.
  (These two modes behave the same, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.)
- `nearest`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `ceil`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
instant = Temporal.Instant.from('2019-03-30T02:45:59.999999999Z');

// Round to a particular unit
instant.round({ smallestUnit: 'second' }); // => 2019-03-30T02:46Z
// Round to an increment of a unit, e.g. an hour:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute' });
  // => 2019-03-30T03:00Z
// Round to the same increment but round down instead:
instant.round({ roundingIncrement: 60, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 2019-03-30T02:00Z
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
one = Temporal.Instant.fromEpochSeconds(1.0e9);
two = Temporal.Instant.fromEpochSeconds(1.1e9);
one.equals(two); // => false
one.equals(one); // => true
```

### instant.**toString**(_timeZone_?: object | string) : string

**Parameters:**

- `timeZone` (optional string or object): the time zone to express `instant` in, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
  The default is to use UTC.

**Returns:** a string in the ISO 8601 date format representing `instant`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `instant`.
The string can be passed to `Temporal.Instant.from()` to create a new `Temporal.Instant` object.

Example usage:

```js
instant = Temporal.Instant.fromEpochMilliseconds(1574074321816);
instant.toString(); // => 2019-11-18T10:52:01.816Z
instant.toString(Temporal.TimeZone.from('UTC')); // => 2019-11-18T10:52:01.816Z
instant.toString('Asia/Seoul'); // => 2019-11-18T19:52:01.816+09:00[Asia/Seoul]
```

### instant.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `instant`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `instant`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

Example usage:

```js
instant = Temporal.Instant.from('2019-11-18T11:00:00.000Z');
instant.toLocaleString(); // => example output: 2019-11-18, 3:00:00 a.m.
instant.toLocaleString('de-DE'); // => example output: 18.11.2019, 03:00:00
instant.toLocaleString('de-DE', {
  timeZone: 'Europe/Berlin',
  weekday: 'long'
}); // => Montag, 18.11.2019, 12:00:00
instant.toLocaleString('en-US-u-nu-fullwide-hc-h12', {
  timeZone: 'Asia/Kolkata'
}); // => １１/１８/２０１９, ４:３０:００ PM
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
