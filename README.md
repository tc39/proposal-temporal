# Temporal Proposal

Provides standard objects and functions for working with dates and times.

## Champions

- Maggie Pint
- Matt Johnson
- Brian Terlson

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
`PlainDate`     | A date without any time or time zone reference.                     | `2017-12-31`
`PlainTime`     | A time-of-day without any date or time zone reference.              | `17:00`
`PlainDateTime` | A date and a time without any time zone reference.                  | `2017-12-31T12:00:00`

### Objects representing Absolute Time

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`Instant`       | A point on the universal timeline, typically represented in UTC.    | `2017-12-31T00:00:00Z` 
`ZonedInstant`  | A point on the universal timeline, with an associated time zone.    | `2017-12-31T09:00:00+09:00[Asia/Tokyo]`

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

# Top-Level Functions

## Function: `createDate`
Creates a `PlainDate` object, representing a whole date.
The combined values must be representable within the range of `PlainDate.MIN_VALUE` through `PlainDate.MAX_VALUE`.

#### Syntax
```js
let date = temporal.createDate(year, month, day);
```

#### Parameters
 - `year` : Integer value representing the year.
 - `month` : Integer value representing the month, from `1` through `12`.
 - `day` : Integer value representing the day, from `1` through the number of days for the given `month` and `year`, which may be `28`, `29`, `30`, or `31`.

#### Return Value
A `PlainDate` object, representing the date specified.

#### Examples
TBD

---------------------------------------------------------------------------------------------------

## Function: `createTime`
Creates a `PlainTime` object, representing a time-of-day.
The combined values must be representable within the range of `PlainTime.MIN_VALUE` through `PlainTime.MAX_VALUE`.

#### Syntax
```js
let time = temporal.createTime(hour, minute[, second[, millisecond[, nanosecond]]]);
```

#### Parameters
 - `hour` : Integer value representing the hour of the day, from `0` through `24`.
 - `minute` : Integer value representing the minute within the hour, from `0` through `59`.
 - `second` : Optional. Integer value representing the second within the minute, from `0` through `59`.
 - `millisecond` : Optional. Integer value representing the millisecond within the second, from `0` through `999`.
 - `nanosecond` : Optional. Integer value representing the nanosecond within the millisecond, from `0` through `999999`.

#### Return Value
A `PlainTime` object, representing the time-of-day specified.

#### Examples
TBD

---------------------------------------------------------------------------------------------------

## Function: `createDateTime`
Creates a `PlainDateTime` object, representing a date and a time on that date.
The combined values must be representable within the range of `PlainDateTime.MIN_VALUE` through `PlainDateTime.MAX_VALUE`.

#### Syntax
```js
let dateTime = temporal.createDateTime(year, month, day, hour, minute[, second[, millisecond[, nanosecond]]]);
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

#### Return Value
A `PlainDateTime` object, representing the date and time-of-day specified.

#### Examples
TBD

---------------------------------------------------------------------------------------------------

## Function: `createInstant`
Creates an `Instant` object, representing an absolute point in time.
The combined values must be representable within the range of `Instant.MIN_VALUE` through `Instant.MAX_VALUE`.

#### Syntax
```js
let instant = temporal.createInstant(milliseconds[, nanoseconds]);
```

#### Parameters
 - `milliseconds` : Integer value representing the number of milliseconds elapsed from 1970-01-01 00:00:00.000 UTC, without regarding leap seconds.
 - `nanoseconds` : Optional. Integer value representing the nanosecond within the millisecond.

#### Return Value
An `Instant` object, representing the absolute point in time specified.

#### Examples
TBD

---------------------------------------------------------------------------------------------------

# Object: `PlainDate`
Represents a whole day, as a date on the proleptic Gregorian calendar.

## Constructor
```js
new PlainDate(year, month, day)
```

### Properties
```js
let year = plainDate.year;
let month = plainDate.month;
let day = plainDate.day;
```

### Functions
```js
let plainDate2 = plainDate1.add(number, unit);
let plainDateTime = plainDate.withTime(time);
```

---------------------------------------------------------------------------------------------------

# Object: `PlainTime`
Represents a position on a 24-hour clock.

### Constructor
```js
new PlainTime(hour, minute[[[, second], millisecond], nanosecond])
```

### Properties
```js
let hour = plainTime.hour;
let minute = plainTime.minute;
let second = plainTime.second;
let millisecond = plainTime.millisecond;
let nanosecond = plainTime.nanosecond;
```

### Functions
```js
let plainTime2 = plainTime1.add(number, unit);
let plainDateTime = plainTime.withDate(date);
```

---------------------------------------------------------------------------------------------------

# Object: `PlainDateTime`
Represents a whole day, and the position within that day.

### Constructor
```js
new PlainDateTime(plainDate, plainTime)
```

### Properties
```js
let year = plainDateTime.year;
let month = plainDateTime.month;
let day = plainDateTime.day;
let hour = plainDateTime.hour;
let minute = plainDateTime.minute;
let second = plainDateTime.second;
let millisecond = plainDateTime.millisecond;
let nanosecond = plainDateTime.nanosecond;
```

### Functions
```js
let plainDateTime2 = plainDateTime1.add(number, unit);
let plainDate = plainDateTime.toPlainDate();
let plainTime = plainDateTime.toPlainTime();
let zonedInstant = plainDateTime.withZone(timeZone[, options]);
```

---------------------------------------------------------------------------------------------------

# Object: `Instant`
Represents an absolute point in time.
Counted as number of nanoseconds from `1970-01-01T00:00:00.000000000Z`.

### Constructor
```js
new Instant(milliseconds[, nanoseconds])
```

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

## Object: `ZonedInstant`
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
let plainDateTime = zonedInstant.toPlainDateTime();
let plainDate = zonedInstant.toPlainDate();
let plainTime = zonedInstant.toPlainTime();
let instant = zonedInstant.toInstant();
```

