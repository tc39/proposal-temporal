# Temporal

Temporal is the proposal of a new date & time handling API for ECMA-Script. The design principles are:

- All temporal APIs are non-mutating.  All temporal objects are effectively immutable.
- All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).  Other calendar systems are out-of-scope for this proposal.  However, we will consider how future APIs may interact with this one such that extending it to support other calendars may be possible in a future proposal.
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Timeline Objects

There is a subset of temporal objects that are tied to the absolute timeline. They represent a specific point in time.

These are `Instant`, `OffsetDateTime`, and `ZonedDateTime` in order of amount of detail information available in them.

`Instant` just represents an absolute point in time. No timezone or offset information is present. As such Instants have no concept of days or months or even hours.

OffsetDateTime is the combination of an Instant with an offset from UTC. As such it has the ability to know about days, months, etc. However it does not know what timezone or locality it is in. As such it cannot know which daylight saving rules apply.

ZonedDateTime represents an OffsetDateTime combined with an *IANA Timezone*. With that added information ZonedDateTime is able to observe daylight saving rules.

### Instant
An `Instant` is an object that specifies a specific point in time. For convenience of interoperability it uses *nanoseconds since the unix-epoch* to do so.
#### Instant() - constuctor

#### Instant.prototype.epochSeconds : number

The `epochSeconds` property of an `Instant` object is readonly and represents the *seconds
since unix-epoch*.

#### Instant.prototype.epochMilliseconds: number

The `epochMilliseconds` property of an `Instant` object is readonly and represents the *milliseconds
since unix-epoch*.

#### Instant.prototype.epochMicroseconds: BigInt

The `epochMicroseconds` property of an `Instant` object is readonly and represents the *microseconds
since unix-epoch*.

#### Instant.prototype.epochNanoseconds: BigInt

The `epochNanoseconds` property of an `Instant` object is readonly and represents the *nanoseconds
since unix-epoch*.

#### Instant.prototype.withZone(zone: string) : ZonedDateTime

This creates a `ZonedDateTime` by applying a *iana timezone* to the instant.

This is equivalent to `new ZonedDateTime(instant, zone)`

#### Instant.prototype.withOffset(offset: string) : OffsetDateTime

This creates a `OffsetDateTime` by applying an *offset-string* to the instant.

This is equivalent to `new OffsetDateTime(instant, offset)`

#### Instant.fromString(iso: string) : Instant

Parses a `string` that must be in the same ISO-8601 format as produced by `Instant.prototype.toString()` and creates a new `Instant` object from it.

#### Instant.fromEpochSeconds(epochseconds: number) : Instant

Equivalent to `Instant.fromMilliseconds(seconds * 1000)`.

#### Instant.fromEpochMilliseconds(epochmillis: number) : Instant

Equivalent to `Instant.fromEpochMicroseconds(BigInt(epochmillis) * 1000n)`.

#### Instant.fromEpochMicroseconds(epochmicros: BigInt) : Instant

Equivalent to `Instant.fromEpochNanoseconds(epochmicros * 1000n)`.

#### Instant.fromEpochNanoseconds(epochnanos: BigInt) : Instant

Equivalent to `new Instant(epochnanos)`.

### OffsetDateTime

An `OffsetDateTime` is an object that specifies a specific point in time with a specific offset from *UTC*.
It bases this on an `Instant` and an offsett `string`.

#### OffsetDateTime(instant: Instant, offset: string) - constructor

The constructor may only be called as such. It takes two arguments. The first is an instance
of `Instant` and the second is a `string` representing a valid time offset.

#### OffsetDateTime.prototype.instant : BigInt

The instance of `Instant` that was used to create this `OffsetDateTime`.

#### OffsetDateTime.prototype.offset : string

The time-zone offset represented as a `string`.

This must always have the format: `sign``hours`:`minutes` where

- `sign` is eitner `+` or `-`
- `hours` is the hours offset 0-padded to 2 digits.
- `minutes` is the minutes offset 0-padded to 2 digits.

Examples: `+00:00`, `-04:00`, `+03:00`, ...

#### OffsetDateTime.prototype.year: number

The `.year` property represents the year of the `OffsetDateTime` according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.month: number

The `.month` property represents the month of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.day: number

The `.day` property represents the day of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.hour: number

The `.hour` property represents the hour of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.minute: number

The `.minute` property represents the minute of the hour of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.second: number

The `.second` property represents the seconds of the minute of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.millisecond: number

The `.millisecond` property represents the milliseconds of the seconds of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.microsecond: number

The `.microsecond` property represents the microseconds of the milliseconds of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.nanosecond: number

The `.nanosecond` property represents the nanoseconds of the microseconds of the `OffsetDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### OffsetDateTime.prototype.dayOfWeek: number

The `.dayOfWeek` property represents the day of the week according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601. 

#### OffsetDateTime.prototype.dayOfYear: number

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

#### OffsetDateTime.prototype.weekOfYear: number

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a year may be part of a week from the preceding year, and dates at the end of a year may be part of a week at the beginning of the next year, as the first week of any year is defined as the week that contains the first Thursday of the week.

#### OffsetDateTime.prototype.plus(data: IntervalLike): ZonedDateTime

Creates a new `ZonedDateTime` object by adding (subtracting for negative values) values to its members. The specified values must be numeric if specified.

The algorithm is such that:

1. the individual values are added to the existing values.
2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
7. the range of `hours` is ensured to be between 0 and 23 by adjusting `days`
8. the range of `days` is ensured to be between 1 and 29-31 depending on the month by adjusting `month`
9. the range of `months` is ensured to be between 1 and 12 by adjusting the `years`.

#### OffsetDateTime.prototype.minus(other: ZonedDateTime): Interval
#### OffsetDateTime.prototype.withZone(iana: string) : ZonedDateTime
#### OffsetDateTime.prototype.toString() : string

This creates an ISO-8601 string in the following format:
```js
${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${nanoseconds}${offset}

The `year` is 0-padded to a minimum of 4 digits. `month`, `day`, `hours`, `minutes`, `seconds` are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits. The `offset` is the timezone offset as created by `zoned.offset`.

Examples:

- `1976-11-18T15:23:30.123456789+01:00` - created with `+01:00` offset

#### OffsetDateTime.prototype.toJSON() : string

Equivalent to `OffsetDateTime.prototype.toString() : string`

#### OffsetDateTime.fromString(iso: string) : ZonedDateTime

Parses a `string` in the specific ISO-8601 format emitted by `OffsetDateTime.prototype.toString()`.

#### OffsetDateTime.fromZonedDateTime(zoned : ZonedDateTime) : OffsetDateTime





### ZonedDateTime

An `ZonedDateTime` is an object that specifies a specific point in time with an *IANA timezone*.
It bases this on an `Instant` and an iana `string`.

#### ZonedDateTime(instant: Instant, zone: string) - constructor

The constructor may only be called as such. It takes two arguments. The first is an instance
of `Instant` and the second is a `string` representing a valid IANA timezone.

#### ZonedDateTime.prototype.instant : BigInt

The instance of `Instant` that was used to create this `ZonedDateTime`.

#### ZonedDateTime.prototype.timeZone : string
#### ZonedDateTime.prototype.offset : string

The time-zone offset represented as a `string`.

This must always have the format: `sign``hours`:`minutes` where

- `sign` is eitner `+` or `-`
- `hours` is the hours offset 0-padded to 2 digits.
- `minutes` is the minutes offset 0-padded to 2 digits.

Examples: `+00:00`, `-04:00`, `+03:00`, ...

#### ZonedDateTime.prototype.year: number

The `.year` property represents the year of the `ZonedDateTime` according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.month: number

The `.month` property represents the month of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.day: number

The `.day` property represents the day of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.hour: number

The `.hour` property represents the hour of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.minute: number

The `.minute` property represents the minute of the hour of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.second: number

The `.second` property represents the seconds of the minute of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.millisecond: number

The `.millisecond` property represents the milliseconds of the seconds of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.microsecond: number

The `.microsecond` property represents the microseconds of the milliseconds of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.nanosecond: number

The `.nanosecond` property represents the nanoseconds of the microseconds of the `ZonedDateTime `  according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day.

#### ZonedDateTime.prototype.dayOfWeek: number

The `.dayOfWeek` property represents the day of the week according to the proleptic Gregorian calendar with a midnight to midnight 24 hour day where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601. 

#### ZonedDateTime.prototype.dayOfYear: number

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

#### ZonedDateTime.prototype.weekOfYear: number

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a
year may be part of a week from the preceding year, and dates at the end of a year may be part of
a week at the beginning of the next year, as the first week of any year is defined as the week that
contains the first Thursday of the week.

#### ZonedDateTime.prototype.plus(data: IntervalLike): ZonedDateTime

Creates a new `ZonedDateTime` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:

1. the individual values are added to the existing values.
2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
7. the range of `hours` is ensured to be between 0 and 23 by adjusting `days`
8. the range of `days` is ensured to be between 1 and 29-31 depending on the month by adjusting `month`
9. the range of `months` is ensured to be between 1 and 12 by adjusting the `years`.

#### ZonedDateTime.prototype.minus(other: ZonedDateTime): Interval
#### ZonedDateTime.prototype.toString() : string

This creates an ISO-8601 string in the following format **`year`-`month`-`day`T`hours`:`minutes`:`seconds`.`nanoseconds``offset`[`iana`]**
if an *IANA-Timezone* is available.

The `year` is 0-padded to a minimum of 4 digits. `month`, `day`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits. The
`offset` is the timezone offset as created by `zoned.offset. `iana` is the *IANA-Timezone*
string.

Examples:

- `1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]` - created with `Europe/Vienna` timezone
- `1976-11-18T15:23:30.123456789+01:00[Europe/Berlin]` - created with `Europe/Berlin` timezone

#### ZonedDateTime.prototype.toJSON() : string

Equivalent to `ZonedDateTime.prototype.toString() : string`

#### ZonedDateTime.fromString(iso: string) : ZonedDateTime

Creates a new `ZonedDateTime` object from parsing a string that must be in the same ISO 8601 format used for `ZonedDateTime.prototype.toString()`, with precision at or exceeding the minute level, non-empty non-"Z" UTC offset representation, and a bracketed IANA time zone name in which the offset is correct for the represented date and time.

## Unbound Objects

Unbound objects are objects that do not represent a date or time tied to the actual concrete timeline. Imagine a note saying "be home by 14:45". That information is not tied to a specific point in time. You don't know where the note came from. It could have been written at any time in the past. No date attaches to it. Equally you can't tell what timezone it belongs in. It may not mean local time.

Even information like "I was born on the 18th of November 1976 at 15:23:30" does not attach to a specific point in time. We still lack the location of where the speaker was born.

In addition there are more abstract dates that are used frequently in civil discourse. Such as "Christmas is on the 25th of December". Which year? Or "I moved to Britain in August 2014". Which day in August?

These objects all have in common is that they are not tied to a specific point on the timeline.

### CivilDate

`CivilDate` (and its siblings) represents a date and time corresponding to the requirements of ISO-8601.

This means specifically that it uses the *proleptic Gregorian calendar* whose days are 24 hours
long and begin and end at midnight.

#### CivilDate() - constructor

The constructor may only be called as such. It takes 3 numeric arguments.

- `year` the Gregorian year
- `month` the Gregorian month
- `day` the Gregorian day of the month

#### CivilDate.prototype.year : number

The `.year` property represents the year of the `CivilDate`.

#### CivilDate.prototype.month : number

The `.month` property represents the month of the `CivilDate`.

#### CivilDate.prototype.day : number

The `.day` property represents the day of the month of the `CivilDate`.

#### CivilDate.prototype.dayOfWeek : number

The `.dayOfWeek` property represents the day of the week where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601.

#### CivilDate.prototype.dayOfYear : number

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

#### CivilDate.prototype.weekOfYear : number

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a year may be part of a week from the preceding year, and dates at the end of a year may be part of a week at the beginning of the next year, as the first week of any year is defined as the week that contains the first Thursday of the week.

#### CivilDate.prototype.plus(value: IntervalLike) : CivilDate

Creates a new `CivilDate` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
  1. the individual values are added to the existing values.
  2. the range of `days` is ensured to be between 1 and 29-31 depending on the month by adjusting `month`
  3. the range of `months` is ensured to be between 1 and 12 by adjusting the `years`.

#### CivilDate.prototype.with(values: DateLike) : CivilDate

Creates a new `CivilDate` object by overriding specified values to its members.
The specified values must be numeric if specified.

#### CivilDate.prototype.withTime(time : CivilTime) : CivilDateTime

Combines this `CivilDate` with the passed `CivilTime` to create a new `CivilDateTime` object.

#### CivilDate.prototype.toString() : string

Equivalent to `date.toDateString()`

#### CivilDate.prototype.toJSON() : string

Equivalent to `date.toString()`

#### CivilDate.prototype.toDateTimeString() : string

`.toDateString()` creates an ISO-8601 compliant string in the format:
**`year`-`month`-`day`**. The `year` is 0-padded to a minimum of 4 digits. `month` and `day`.

#### CivilDate.prototype.toWeekDateString() : string

`.toWeekDateString()` creates an ISO-8601 compliant string in the format:
**`year`-W`week`-`weekday`**.

The `year` is 0-padded to a minimum of 4 digits. `week`is 0-padded to a minimum of 2 digits.

The `week` is the ISO week as calculated by `.weekOfYear` and the `weekday` is the ISO week-day as
calculated by `.dayOfWeek`. The `year` may be one year before/after the `.year` property of the
`CivilDate` if the specified date is part of the last week of the previous year or the first
week of the following year.

#### CivilDate.prototype.toOrdinalDateString() : string

`.toOrdinalDateString()` creates an ISO-8601 compliant strung in the format:
**`year`-`day-of-year`**.

The `year` is 0-padded to a minimum of 4 digits. `dof-of-year` is 0-padded to a minimum of 3 digits.

The `day-of-year` is the ordinal day as calculated by `.dayOfYear`.

#### CivilDate.fromDateString(isostring : string): string

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toDateString()`.

#### CivilDate.fromWeekDateString(isostring : string): string

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toWeekDateString()`.

#### CivilDate.fromOrdinalDateString(isostring : string): string

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toOrdinalDateString()`.

#### CivilDate.fromString(isostring: string): CivilDate

Creates a new `CivilDate` by parsing an ISO-8601 string in the one of the formats created `.toDateString()`, `.toWeekDateString()` or `.toOrdinalDateString()`.

### CivilTime

`CivilTime` (and its siblings) represents a time corresponding to the requirements of ISO-8601.

This means specifically that days are 24 hours long and begin and end at midnight.

#### CivilTime() - constructor

The constructor may only be called as such. It takes between 2 and 4 numeric arguments.

- `hours` hour of the day
- `minutes` minutes of the hour
- `seconds` seconds of the minutes *(default: 0)*
- `milliseconds` milliseconds of the second *(default: 0)*
- `microseconds` microseconds of the millisecond *(default: 0)*
- `nanoseconds` nanoseconds of the microseconds *(default: 0)*

#### CivilTime.prototype.hour : number

The `.hour` property represents the hour of the `CivilTime`.

#### CivilTime.prototype.minute : number

The `.minute` property represents the minute of the hour of the `CivilTime`.

#### CivilTime.prototype.second : number

The `.second` property represents the second of the minute of the `CivilTime`.

#### CivilTime.prototype.millisecond : number

The `.millisecond` property represents the sub-second component of the second of the `CivilTime` with millisecond precision. It will have a value between 0 and 999.

#### CivilTime.prototype.microsecond : number

The `.microsecond` property represents the sub-millisecond component of the millisecond of the `CivilTime` with microsecond precision. It will have a value between 0 and 999.

#### CivilTime.prototype.nanosecond : number

The `.nanosecond` property represents the sub-microsecond component of the microsecond of the `CivilTime` with nanosecond precision. It will have a value between 0 and 999.

#### CivilTime.prototype.plus(values: IntervalLike) : CivilTime

Creates a new `CivilTime` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
 1. the individual values are added to the existing values.
 2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
 3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
 4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
 5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
 6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
 7. the range of `hours` is ensured to be between 0 and 23

#### CivilTime.prototype.with(values: TimeLike) : CivilTime

Creates a new `CivilTime` object by overriding specified values to its members.
The specified values must be numeric if specified.

#### CivilTime.prototype.withDate(date : CivilDate) : CivilDateTime

Combines this `CivilTime` with the passed `CivilDate` to create a new `CivilDateTime` object.

#### CivilTime.prototype.toString() : string

`.toString()` creates an ISO-8601 compliant string in the format:
**`hour`:`minute`:`second`.`nanosecond`**.

The `hours`, `minutes`, and `seconds` are 0-padded to a minimum of 2 digits.
`nanoseconds` is 0-padded to a minimum of 9 digits.

#### CivilTime.prototype.toJSON() : string

Equivalent to `datetime.toString()`

#### CivilTime.fromString(isostring : string): string

Creates a new `CivilTime` by parsing an ISO-8601 string in the format created by `.toString()`.

### CivilDateTime

`CivilDateTime` (and its siblings) represents a date and time corresponding to the requirements of ISO-8601.

This means specifically that it uses the *proleptic Gregorian calendar* whose days are 24 hours
long and begin and end at midnight.

#### CivilDateTime() - constructor

The constructor may only be called as such. It takes between 5 and 7 numeric arguments.

- `year` the Gregorian year
- `month` the Gregorian month
- `day` the Gregorian day of the month
- `hours` hour of the day
- `minutes` minutes of the hour
- `seconds` seconds of the minutes *(default: 0)*
- `milliseconds` milliseconds of the seconds *(default: 0)*
- `microseconds` microseconds of the milliseconds *(default: 0)*
- `nanoseconds` nanoseconds of the microseconds *(default: 0)*

#### CivilDateTime.prototype.year : number

The `.year` property represents the year of the `CivilDateTime`.

#### CivilDateTime.prototype.month : number

The `.month` property represents the month of the `CivilDateTime`.

#### CivilDateTime.prototype.day : number

The `.day` property represents the day of the month of the `CivilDateTime`.

#### CivilDateTime.prototype.dayOfWeek : number

The `.dayOfWeek` property represents the day of the week where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601.

#### CivilDateTime.prototype.dayOfYear : number

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

#### CivilDateTime.prototype.weekOfYear : number

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a year may be part of a week from the preceding year, and dates at the end of a year may be part of a week at the beginning of the next year, as the first week of any year is defined as the week that contains the first Thursday of the week.

#### CivilDateTime.prototype.hour : number

The `.hour` property represents the hour of the `CivilDateTime`.

#### CivilDateTime.prototype.minute : number

The `.minute` property represents the minute of the hour of the `CivilDateTime`.

#### CivilDateTime.prototype.second : number

The `.second` property represents the second of the minute of the `CivilDateTime`.

#### CivilDateTime.prototype.millisecond : number

The `.millisecond` property represents the sub-second component of the second of the `CivilDateTime` with millisecond precision. It will have a value between 0 and 999.

#### CivilDateTime.prototype.microsecond : number

The `.microsecond` property represents the sub-millisecond component of the millisecond of the `CivilDateTime` with microsecond precision. It will have a value between 0 and 999.

#### CivilDateTime.prototype.nanosecond : number

The `.nanosecond` property represents the sub-microsecond component of the microsecond of the `CivilDateTime` with nanosecond precision. It will have a value between 0 and 999.

#### CivilDateTime.prototype.plus(inteval: IntervalLike) : CivilTime

Creates a new `CivilDateTime` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
 1. the individual values are added to the existing values.
 2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
 3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
 4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
 5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
 6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
 7. the range of `hours` is ensured to be between 0 and 23

#### CivilDateTime.prototype.with(values: DateTimeLike) : CivilTime

Creates a new `CivilTime` object by overriding specified values to its members.
The specified values must be numeric if specified.

#### CivilDateTime.prototype.toString() : string

`.toString()` creates an ISO-8601 compliant string in the format:
**`hour`:`minute`:`second`.`nanosecond`**.

The `hours`, `minutes` and `seconds` are 0-padded to a minimum of 2 digits.
`nanoseconds` is 0-padded to a minimum of 9 digits.

#### CivilDateTime.prototype.toJSON() : string

Equivalent to `datetime.toString()`

#### CivilDateTime.fromString(isostring : string): string

Creates a new `CivilTime` by parsing an ISO-8601 string in the format created by `.toString()`.

### CivilYearMonth

A `CivilYearMonth` is used to represent dates that have an unkown day component.

#### CivilYearMonth() - constructor

The constructor may only be called as such. It takes 2 numeric arguments.

- `year` the Gregorian year
- `month` the Gregorian month

#### CivilYearMonth.prototype.withDay(day: number) : CivilDate
#### CivilYearMonth.prototype.with(values: DateLike) : CivilYearMonth
#### CivilYearMonth.prototype.plus(value: IntervalLike) : CivilYearMonth
#### CivilYearMonth.prototype.minus(other: CivilYearMonth) : Interval
#### CivilYearMonth.prototype.toString() : string

Produces a string representation of the value in the format `yyyy/mm` where `yyyy` is the year with a minimum of 4 digits and a optional sign. and `mm` is the months with a minimum of 2 digits.

#### CivilYearMonth.fromString(str: string) : CivilYearMonth

Parses a string in the exact format produced by `CivilYearMonth.prototype.toString()`.

### CivilMonthDay

The `CivilMonthDay` is used to represent dates that have an unknown year component. 

Example:
 * `The 25th of December`
 * `The 1st of January`

Since no year is present calculations act as if any instances fall into non-leap-years.

#### CivilMonthDay() - constructor

The constructor may only be called as such. It takes 2 numeric arguments.

- `month` the Gregorian month
- `day` the Gregorian day of month

#### CivilMonthDay.prototype.withYear(year: number) : CivilDate
#### CivilMonthDay.prototype.with(values: DateLike) : CivilMonthDay
#### CivilMonthDay.prototype.plus(value: IntervalLike) : CivilMonthDay
#### CivilMonthDay.prototype.minus(other: CivilMonthDay) : Interval

## Intervals & Operations

### Interval

Interval objects are produced by subtracting two temporal object from each other using the `minus()` method. Subtraction is limited to operations between objects of the same type.

All `Interval` fields are integer values. Intervals are immutable like all temporal objects.

Intervals can only be created through the `minus` method on temporal objects.

#### Interval.prototype.years: number

Is the **integer** number of years difference this interval represents.

#### Interval.prototype.months: number

Is the **integer** number of months difference this interval represents.

#### Interval.prototype.days: number

Is the **integer** number of day difference this interval represents.

#### Interval.prototype.hours: number

Is the **integer** number of hours difference this interval represents.

#### Interval.prototype.minutes: number

Is the **integer** number of minutes difference this interval represents.

#### Interval.prototype.seconds: number

Is the **integer** number of seconds difference this interval represents.

#### Interval.prototype.milliseconds: number

Is the **integer** number of milliseconds difference this interval represents.

#### Interval.prototype.microseconds: number

Is the **integer** number of microseconds difference this interval represents.

#### Interval.prototype.nanoseconds: number

Is the **integer** number of nanoseconds difference this interval represents.

#### Interval.prototype.minus(other: Interval) : Interval

Creates a new `Interval` where each of the fields is defined as:

 `field = mine.field - other.field`

This can result in mixed intervals where some fields are positive and some negative. Such intervals are fully valid.

#### Interval.prototype.plus(values: IntervalLike) : Interval

Creates a new `Interval` where each of the fields is defined as:

 `field = mine.field + other.field`

This can result in mixed intervals where some fields are positive and some negative. Such intervals are fully valid.

#### Interval.prototype.with(values: IntervalLike) : Interval

Creates a new `Interval` where each of the fields is defined as:

 `field = other.field !== undefined ? other.field : mine.field`

This can result in mixed intervals where some fields are positive and some negative. Such intervals are fully valid.

### Operations

#### Difference

The difference operation implimented via the `minus` method on temporal objects allow taking the difference between like objects, resulting in an `Interval`. The specificity of the interval will depend on the objects involved.

Example:
 * CivilDate - will produce an Interval with potential *non-zero* values in `years`, `months` and `days` with all other fields nulled out.
 * CivilTime - will prodce an Interval with potential *non-zero* values in `hours`, `minutes`,  `seconds`, `milliseconds`, `microseconds` and `nanoeconds` with all other fields nulled out.
 * `CivilDateTime` - will produce an Interval where all fields are potentially *non-zero*

#### Addition

The addition operation is implemented via the `plus` method on temporal objects. These methods take an IntervalLike as an argument that is first converted to an actual Interval. That means that *non-integer* value in interval fields will be floored.

Adding an interval to a type means taking only the corresponding interval values and ignoring all others.

Example: CivilDate plus { hours: 48 } is a no-op since hours does not have a corresponding member to hours and they are therefore ignored.

## Interfaces

Interfaces are not actually defined, they are simply conveniences to make conversing about temporal objects, methods and their arguments easier.

### DateLike

Any JS object that has date like properties. These are:

* year - a numeric representing the gregorian year
* month - a numeric representing the gregorian month
* day - a numeric representing the gregorian day

These properties are all optional, but if they are on a DateLike object they have to be numeric.

### TimeLike

Any JS object that has time like properties. These are:

- hour - a numeric representing the hour of the day
- minute - a numeric representing the minute of the hour
- second - a numeric representing the second of the minute
- millisecond - a numeric representing the millisecond of the second
- microsecond - a numeric representing the microsecond of the second
- nanosecond - a numeric representing the nanoseconds of the microsecond

These properties are all optional, but if they are on a TimeLike object they have to be numeric.

### DateTimeLike

Any JS object that is both a DateLike and a TimeLike.

### IntervalLike

Any JS object that has interval properties. These are:

* years - number of years difference
* months - number of months difference
* days -  number of day difference
* hours - number of hours difference
* minutes - number of minutes difference
* seconds - number of seconds difference
* milliseconds - number of milliseconds difference
* microseconds - number of microseconds difference
* nanoseconds - number of nanoseconds difference

These properties are all optional, but if they are on an IntervalLike object they have to be numeric.

---

## Table of Contents

[TOC]
