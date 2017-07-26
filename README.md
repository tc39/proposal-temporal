# Temporal Proposal

Provides standard objects and functions for working with dates and times.

## Champions

- Maggie Pint  ([@maggiepint](https://github.com/maggiepint))
- Matt Johnson ([@mj1856](https://github.com/mj1856))
- Brian Terlson ([@bterlson](https://github.com/bterlson))

## Status

This proposal is currently stage 1

## Overview / Motivation

Date has been a long time pain point in ECMAScript.
This proposes `temporal`, a built in module that brings a modern date time API to the ECMAScript language.

### Principles:

- All temporal APIs are non-mutating.  All temporal objects are effectively immutable.
- All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).  Other calendar systems are out-of-scope for this proposal.
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
TBD

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
 - `hour` : Integer value representing the hour of the day, from `0` through `24`.
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
 - `hour` : Integer value representing the hour of the day, from `0` through `24`.
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
let newCivilDate = myDate.with({year: 2017, month: 3});
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
