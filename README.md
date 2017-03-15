### Temporal Proposal

## Champions

Maggie Pint

Brian Terlson

## Status

This proposal is currently stage 0

## Overview / Motivation

Date has been a long time pain point in ECMAScript. This proposes `temporal`, a built in module
that brings a DateTime API similar to Java 8's to the ECMAScript language.

Because of the size of the problem domain, this proposal brings only two standard objects.
The remaining objects will be left for later proposals.  See below for details. 

## Standard objects defined in this proposal

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`LocalDateTime` | A date and a time without any time zone reference.                  | `2017-12-31T12:00:00`
`ZonedDateTime` | A date and a time, at a specific instant in time, with a time zone. | `2017-12-31T12:00:00-08:00 America/New_York`

### Other standard objects in this module (TBD)

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`Instant`       | A point on the universal timeline, typically represented in UTC.    | `2017-12-31T20:00:00Z` 
`OffsetDateTime`| A date, time, and fixed offset from UTC.                            | `2017-21-31T08:00:00-08:00`
`LocalDate`     | A date without any time or time zone reference.                     | `2017-12-31`
`LocalTime`     | A time-of-day without any date or time zone reference.              | `17:00`
`Duration`      | A time-based amount of time, as if measured by a stopwatch.         | 5 minutes
`Period`        | A date-based amount of time in the ISO8601 calendar system.         | 3 months

### Other Similar APIs:

- [`java.time` native package (Java 8)](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html)
- [ThreeTen Backport (Java)](http://www.threeten.org/threetenbp/)
- [Joda-Time library (Java)](http://www.joda.org/joda-time/)
- [Noda Time library (.NET)](http://nodatime.org/)
- [JS-Joda library (JavaScript)](https://github.com/js-joda/js-joda)

### Principles:

- Immutable API design
- Nanosecond precision
- ISO-8601 compliance

## Examples

---------------------------------------------------------------------------------------------------

## Standard Object: `LocalDateTime`

A date and a time without any time zone reference.

*The term "local" here derives from ISO-8601 §2.1.16, and means "locally applicable".
In other words, local to somebody, somewhere.  Does not mean local to the user or computer.*

### Constructor Syntax

```js
var ldt = new temporal.LocalDateTime(year, month, day, hours, minutes[, seconds[, millis[, nanosOfMillis]]][, options]);
```

### Possible Input Parameters

```js
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, 456789);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, 456789, options);
```

### Default Options

```js
var options = {
    calendar: 'gregory'  // uses ECMA-402 calendar names
};
```

### Usage Examples

```js
// add/subtract time  (Dec 31 2017 23:00 + 2h = Jan 1 2018 01:00)
// TBD

// add/subtract months  (Mar 31 + 1M = Apr 30)
// TBD

// add/subtract years  (Feb 29 2020 - 1Y = Feb 28 2019)
// TBD

```

---------------------------------------------------------------------------------------------------

## Standard Object: `ZonedDateTime`

A date and a time with a time zone, at a specific instant in time.

### Constructor Syntax

```js
var ldt = new temporal.ZonedDateTime(timeZone, year, month, day, hours, minutes[, seconds[, millis[, nanosOfMillis]]][, options]);
```

The first parameter is the time zone or time zone offset.  It can be any of:

- A zone or link name from the IANA/Olson time zone database. (BCP175/RFC6557)
  - Ex:  `'America/New_York'`, `'Europe/London'`, `'Asia/Shanghai'`, `'UTC'`

- A fixed offset from UTC in ±HH:MM or ±HHMM format, with positive values East of *GMT*. (ISO8601)
  - Ex:  `'-08:00'`, `'-05:00'`, `'+05:30'`, `'+12:45'`

- A fixed offset from UTC in minutes, with positive values *West* of GMT (for compatibility with `Date.getTimezoneOffset`).
  - Ex:  `480`, `300`, `-330`, `-765`

- An indicator that denotes the local time zone of the computer where the code is executing.
  - This can be either `undefined`, or the string `'SYSTEM'`.

Note that `Instant` and `OffsetDateTime` from Noda Time and Java 8 can be represented in this scheme
without explicitly defining them as seperate types.

### Possible Input Parameters

```js
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, 456789);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, 456789, options);
```

### Default Options

```js
var options = {
    calendar: 'gregory' // uses ECMA-402 calendar names
    resolver: (mapping) => ({
        skipped: mapping.forwardShifted(),
        ambiguous: mapping.firstOccurrence()
    })
};
```

### Resolver Functions

Any resolver function that returns a ZonedDateTime is allowed.
Properties on mapping are TBD

Built-in skipped local time resolver functions are:

- `forwardShifted()`   Shifts forward by the duration of the gap. (ex: 02:30 => 03:30)
- `nextValid()`        Uses the next valid local time. (ex: 02:30 => 03:00)
- `lastValid()`        Uses the last valid local time. (ex: 02:30 => 01:59:59.999999999)
- `throws()`           Skipped local time causes an error to be thrown.

Built-in ambiguous local time resolver functions are:

- `firstOccurrence()`  Chooses the first occurance of an ambiguous value. (ex: 01:30 EDT)
- `lastOccurrence()`   Chooses the last occurance of an ambiguous value.  (ex: 01:30 EST)
- `throws()`           Ambiguous local time causes an error to be thrown.

### Usage Examples

```js
// Convert between various time zones
var eastUS = new ZonedDateTime('America/New_York', 2017, 1, 1, 0, 0);
var france = eastUS.withZone('Europe/Paris');
var utc = eastUS.withZone('UTC');
var localSystem = eastUS.withZone('SYSTEM');
```

```js
// Calculate the daily occurrence for 8AM Pacific that respects DST
var zdt = new ZonedDateTime('America/Los_Angeles', 2017, 3, 10, 8, 0);
for (var i = 0; i < 4; i++) {
    var occurrenceTimeUTC = zdt.withZone('UTC');
    console.log([zdt, occurrenceTimeUTC]);
    zdt = zdt.addDays(1);
}

// Output:
["2017-03-10T08:00:00.000000000-08:00", "2017-03-10T16:00:00.000000000Z"]
["2017-03-11T08:00:00.000000000-08:00", "2017-03-11T16:00:00.000000000Z"]
["2017-03-12T08:00:00.000000000-07:00", "2017-03-12T15:00:00.000000000Z"]
["2017-03-13T08:00:00.000000000-07:00", "2017-03-13T15:00:00.000000000Z"]
```
