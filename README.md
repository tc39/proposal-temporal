# Temporal Proposal

Provides standard objects and functions for working with dates and times.

## Champions

- Maggie Pint  ([@maggiepint](https://github.com/maggiepint))
- Matt Johnson ([@mj1856](https://github.com/mj1856))
- Brian Terlson ([@bterlson](https://github.com/bterlson))

## Status

This proposal is currently stage 1

[Proposed Spec Text is viewable here.](https://tc39.github.io/proposal-temporal/spec-rendered)  
(Note, this is a work in progress.)

## Overview / Motivation

Date has been a long time pain point in ECMAScript.
This proposes `temporal`, a built in module that brings a modern date time API to the ECMAScript language.
For a detailed breakdown of motivations see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

- All temporal APIs are non-mutating.  All temporal objects are effectively immutable.
- All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).  Other calendar systems are out-of-scope for this proposal.  However, we will consider how future APIs may interact with this one such that extending it to support other calendars may be possible in a future proposal.
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

---------------------------------------------------------------------------------------------------

# Overview of Standard Objects in the `temporal` module

### Objects representing Civil Time

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`CivilDate`     | A date without any time or time zone reference.                     | `2017-12-31`
`CivilTime`     | A time-of-day without any date or time zone reference.              | `17:00:00`
`CivilDateTime` | A date and a time without any time zone reference.                  | `2017-12-31T12:00:00`

### Objects representing Absolute Time

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`Instant`       | A point on the universal timeline, typically represented in UTC.    | `2017-12-31T00:00:00Z`
`ZonedInstant`  | A point on the universal timeline, with an associated time zone.    | `2017‑12‑31T09:00:00+09:00[Asia/Tokyo]`

Note that the time zone of a `ZonedInstant` can be any of:

- Coordinated Universal Time, indicated by the string `'UTC'`
- The system local time zone, indicated by the string `'SYSTEM'`
- A fixed offset from UTC, indicated by a string in `'±HH:MM'` or `'±HHMM'` format
- A `Zone` or `Link` name from the [IANA time zone database](https://www.iana.org/time-zones),
  as also listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Because a fixed offset is supported, there is no need for a separate `OffsetDateTime` type.

---------------------------------------------------------------------------------------------------

# Scenario-Based Examples

### Convert a time in one time zone to a time at the same instant in another time zone.

```js
// Temporal
let dateTimeInChicago = new CivilDateTime(2000, 12, 31, 23, 59)
let instantInChicago = dateTimeInChicago.withZone('America/Chicago');
let instantInSydney = new ZonedInstant(instantInChicago.instant, 'Australia/Sydney')
let dateTimeInSydney = instantInSydney.toCivilDateTime()
dateTimeInChicago.toString() // 2000-12-31T23:59:00.000000000
dateTimeInSydney.toString()  // 2001-01-01T16:59:00.000000000

// Date
// A time zone is not supported, so an offset must be used instead.
// Whatever provides the offset needs to know when to provide -05:00 vs -06:00 for Chicago.
let timestampInChicago = Date.parse("2000-12-31T23:59:00-06:00")
let dateInLocalTimeZone = new Date(timestampInChicago)
let formatterInSydney = new Intl.DateTimeFormat('en-US', { timeZone: 'Australia/Sydney', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
let formatterInChicago = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }))
dateInLocalTimeZone.toISOString()              // 2001-01-01T05:59:00.000Z
formatterInSydney.format(dateInLocalTimeZone)  // 1/1/2001, 4:59:00 PM
formatterInChicago.format(dateInLocalTimeZone) // 12/31/2000, 11:59:00 PM

// Performing calendar operations such as finding the start of month
dateTimeInChicago.with({ day: 1 }).toString() // 2000-12-01T23:59:00.000000000
dateTimeInSydney.with({ day: 1 }).toString()  // 2001-01-01T16:59:00.000000000
dateInLocalTimeZone.setDate(1)
dateInLocalTimeZone.toISOString()             // dependent on local time zone
// A Date object is unable to perform calendar operations in time zones other than local time or UTC.
```

---------------------------------------------------------------------------------------------------

# Object: `CivilDate`
Represents a whole day, as a date on the proleptic Gregorian calendar.

## Constructor
```js
new CivilDate(year, month, day)
```

#### Parameters
 - `year` : Integer value representing the year.
 - `month` : Integer value representing the month, from `1` through `12`.
 - `day` : Integer value representing the day, from `1` through the number of days for the given `month` and `year`, which may be `28`, `29`, `30`, or `31`.

### Properties
```js
let year = civilDate.year;
let month = civilDate.month;
let day = civilDate.day;
```

### Functions
```js
let civilDate2 = civilDate1.plus({months: 1});
let civilDateTime = civilDate.withTime(time);
```

---------------------------------------------------------------------------------------------------

# Object: `CivilTime`
Represents a position on a 24-hour clock.

### Constructor
```js
new CivilTime(hour, minute[[[, second], millisecond], nanosecond])
```


#### Parameters
 - `hour` : Integer value representing the hour of the day, from `0` through `23`.
 - `minute` : Integer value representing the minute within the hour, from `0` through `59`.
 - `second` : Optional. Integer value representing the second within the minute, from `0` through `59`.
 - `millisecond` : Optional. Integer value representing the millisecond within the second, from `0` through `999`.
 - `nanosecond` : Optional. Integer value representing the nanosecond within the millisecond, from `0` through `999999`.

### Properties
```js
let hour = civilTime.hour;
let minute = civilTime.minute;
let second = civilTime.second;
let millisecond = civilTime.millisecond;
let nanosecond = civilTime.nanosecond;
```

### Functions
```js
let civilTime2 = civilTime1.plus({hours: 2, minutes: 4});
let civilDateTime = civilTime.withDate(date);
```

---------------------------------------------------------------------------------------------------

# Object: `CivilDateTime`
Represents a whole day, and the position within that day.

### Constructor
```js
new CivilDateTime(year, month, day, hour, minute[, second[, millisecond[, nanosecond]]])
```

#### Parameters
 - `year` : Integer value representing the year.
 - `month` : Integer value representing the month, from `1` through `12`.
 - `day` : Integer value representing the day, from `1` through the number of days for the given `month` and `year`, which may be `28`, `29`, `30`, or `31`.
 - `hour` : Integer value representing the hour of the day, from `0` through `23`.
 - `minute` : Integer value representing the minute within the hour, from `0` through `59`.
 - `second` : Optional. Integer value representing the second within the minute, from `0` through `59`.
 - `millisecond` : Optional. Integer value representing the millisecond within the second, from `0` through `999`.
 - `nanosecond` : Optional. Integer value representing the nanosecond within the millisecond, from `0` through `999999`.

### Properties
```js
let year = civilDateTime.year;
let month = civilDateTime.month;
let day = civilDateTime.day;
let hour = civilDateTime.hour;
let minute = civilDateTime.minute;
let second = civilDateTime.second;
let millisecond = civilDateTime.millisecond;
let nanosecond = civilDateTime.nanosecond;
```

### Functions
```js
let civilDateTime = CivilDateTime.from(date, time);
let civilDateTime2 = civilDateTime1.plus({days: 3, hours: 4, minutes: 2, seconds: 12});
let civilDate = civilDateTime.toCivilDate();
let civilTime = civilDateTime.toCivilTime();
let zonedInstant = civilDateTime.withZone(timeZone[, options]);
```

---------------------------------------------------------------------------------------------------

# Object: `Instant`
Represents an absolute point in time.
Counted as number of nanoseconds from `1970-01-01T00:00:00.000000000Z`.

### Constructor
```js
new Instant(milliseconds[, nanoseconds])
```

#### Parameters
 - `milliseconds` : Integer value representing the number of milliseconds elapsed from 1970-01-01 00:00:00.000 UTC, without regarding leap seconds.
 - `nanoseconds` : Optional. Integer value representing the nanosecond within the millisecond.

### Properties
```js
let milliseconds = instant.milliseconds;
let nanoseconds = instant.nanoseconds;
```

### Functions
```js
let zonedInstant = instant.withZone(timeZone);
```

---------------------------------------------------------------------------------------------------

# Object: `ZonedInstant`
Represents an absolute point in time, with an associated time zone.

### Constructor
```js
new ZonedInstant(instant, timeZone)
```

### Properties
```js
let milliseconds = zonedInstant.milliseconds;
let nanoseconds = zonedInstant.nanoseconds;
let timeZone = zonedInstant.timeZone;
```

### Functions
```js
let civilDateTime = zonedInstant.toCivilDateTime();
let civilDate = zonedInstant.toCivilDate();
let civilTime = zonedInstant.toCivilTime();
let instant = zonedInstant.toInstant();
```
---------------------------------------------------------------------------------------------
# `with` function  (all civil objects)
Allows the user to create a new instance of any temporal object with new date-part values.

```js
let myCivilDate = new CivilDate(2016, 2, 29);
let newCivilDate = myCivilDate.with({year: 2017, month: 3});
//results in civil date with value 2017-03-29
```

----------------------------------------------------------------------------------------------
# `plus` function  (all objects)
Returns a new temporal object with the specified date parts added. Units will be added in order of size, descending.

```js
let myCivilDate = new CivilDate(2016, 2, 29);
let newCivilDate = myCivilDate.plus({years: 1, months: 2});
//results in civil date with value 2017-4-28
```

# Technical Design Decision Record

As part of creating/improving the *temporal* proposal, a discussions took place involving [@maggiepint](https://twitter.com/maggiepint), [@RedSquirrelious](https://twitter.com/RedSquirrelious), [@bterlson](https://twitter.com/bterlson) and  [@pipobscure](https://twitter.com/pipobscure) as well as at times [@littledan](https://twitter.com/littledan) and others. These are the conclusions we arrived at. This is the summary of my recollections of the reasoning behind these decisions.

## Omit `toDate()` methods

We did not want to tie the *temporal* proposals to the existing `Date` built-in objects. The creating an explicit dependency makes future evolution of the standards harder.

For that reason we omitted the `toDate()` methods from the proposal. This is simply a shortcut for `new Date(instant.milliseconds)` to begin with, so there is very little benefit to that tie.

## Naming `fromMilliseconds()` rather than `fromDate()` method

In the same vein as omitting `toDate()` we also decided to name the method to create an Instant from a `Date` as `fromMilliseconds()` rather than `fromDate()`. For one thing, the name `fromMilliseconds()` is actually more reflective of what the method is supposed to do as it is supposed to accept a numeric argument representing the *milliseconds since epoch* as well.

The semantics of the method will be:

1. _ms_ is the value of `ToNumber(argument)`
1. _ns_ is set to `0`
1. a new instant is created with the *value of* `(ms * 1e6) + ns`

In this logic, the first step would convert a `Date` object to its numeric value via `Date.prototype.valueOf()` which is the *milliseconds since epoch*. As such even though the methods was renamed it can still function as `fromDate()` without making an explicit tie to the build-in `Date` object.

## Naming method `fromString()` rather than `parse()`

There has been long lived discussions on the inconsistencies in the implementations of `Date.parse()`. The aim of naming `fromString()` as that rather than `parse()` was to avoid these. `fromString()` should mirror the behaviour of `toString()` rather than implementing an actual parse. The only functionality `fromString()` should support is parsing the *strings* produced by `toString()` and nothing more.

This is narrowed down to an exceedingly narrow set of formats by explicitly and tightly specifying the relevant `toString()` operations.

The purpose of `fromString()` and the reason we felt we still wanted it as part of the api is that we wanted to allow round-tripping like `Instant.fromString(instant.toString())` which allows for easier serialisation.

**Examples**

`Instant.prototype.toString()` always outputs **&lt;year>-&lt;month>-&lt;day>T&lt;hours>:&lt;minutes>:&lt;seconds>.&lt;nanoseconds>Z**

`ZonedInstant.prototype.toString` always outputs **&lt;year>-&lt;month>-&lt;day>T&lt;hours>:&lt;minutes>:&lt;seconds>.&lt;nanoseconds>[Z|&lt;offset>]**

Other formats of parts will not be output, so the `fromString()` methods can be extremely restrictive.

### ZonedInstant.prototype.timezone will be the offset rather than the IANA name

The offset at a point in time is unique an clear. It can also be parsed back allowing for serialisation as described above.

In contrast the *IANA Zones* are unclear and are hard to parse back requiring a full timezone database. In order to keep the proposal interoperable with IoT and other low-spec scenarios, requiring full *IANA* support seemed contraindicated.

At the same time we felt it's critical to allow for fully supporting *IANA Zones* in the `ZonedInstant` constructor as well as the `withZone()` methods.
