# Time Zones and Resolving Ambiguity

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

## Understanding Clock Time vs. Exact Time

The core concept in Temporal is the distinction between **wall-clock time** (also called "local time" or "clock time") which depends on the time zone of the clock and **exact time** (also called "UTC time") which is the same everywhere.

Wall-clock time is controlled by local governmental authorities, so it can abruptly change.
When Daylight Saving Time (DST) starts or if a country moves to another time zone, then local clocks will instantly change.
Exact time however has a consistent global definition and is represented by a special time zone called [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (from Wikipedia):

> **Coordinated Universal Time (or UTC)** is the primary time standard by which the world regulates clocks and time.
> It is within about 1 second of mean solar time at 0° longitude, and is not adjusted for daylight saving time.
> It is effectively a successor to Greenwich Mean Time (GMT).

Every wall-clock time is defined using a **UTC Offset**: the amount of exact time that a particular clock is set ahead or behind UTC.
For example, on January 19, 2020 in California, the UTC Offset (or "offset" for short) was `-08:00` which means that wall-clock time in San Francisco was 8 hours behind UTC, so 10:00AM locally on that day was 18:00 UTC.
However the same calendar date and wall-clock time India would have an offset of `+05:30`: 5½ hours later than UTC.

[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and [RFC 3339](https://tools.ietf.org/html/rfc3339) define standard representations for exact times as a date and time value, e.g. `2020-09-06T17:35:24.485Z`. The `Z` suffix indicates that this is an exact UTC time.

Temporal has two types that store exact time: `Temporal.Instant` (which only stores exact time and no other information) and `Temporal.ZonedDateTime` which stores exact time, a time zone, and a calendar system

Another way to represent exact time is using a single number representing temporal distance from the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC.
For example, `Temporal.Instant` (an exact-time type) can be constructed using only a `BigInt` value of nanoseconds since epoch, ignoring leap seconds.

Another term developers often encounter is "timestamp".
This most often refers to an exact time represented by the number of seconds since Unix epoch.
Temporal avoids using this terminology, however, because of historical ambiguity surrounding the term "timestamp".
For example, many databases have a type called `TIMESTAMP`, but its meaning varies: in [MySQL](https://dev.mysql.com/doc/refman/8.0/en/datetime.html), it is an exact time; in [Oracle Database](https://docs.oracle.com/cd/B19306_01/server.102/b14225/ch4datetime.htm#i1006050), it is the number of seconds since the *wall-clock time* 00:00 on January 1, 1970 (a quantity one might call a "local timestamp"); and in [Microsoft SQL Server](https://docs.microsoft.com/en-us/answers/questions/238819/purpose-to-use-timestamp-datatype-in-sql-server.html), it is a monotonically increasing value unrelated to date and time.

## Understanding Time Zones, Offset Changes, and DST

A **Time Zone** defines the rules that control how local wall-clock time relates to UTC. You can think of a time zone as a function that accepts an exact time and returns a UTC offset, and a corresponding function for conversions in the opposite direction. (See [below](#ambiguity-due-to-dst-or-other-time-zone-offset-changes) for why exact → local conversions are 1:1, but local → exact conversions can be ambiguous.)

Temporal uses the [**IANA Time Zone Database**](https://en.wikipedia.org/wiki/Tz_database) (or "TZ database"), which you can think of as a global repository of time zone functions. Each IANA time zone has:

- A **time zone ID** that usually refers to a geographic area anchored by a city (e.g. `Europe/Paris` or `Africa/Kampala`) but can also denote single-offset time zones like `UTC` (a consistent `+00:00` offset) or `Etc/GMT+5` (which for historical reasons is a negative offset `-05:00`).
- A **time zone definition** defines the offset for any UTC value since January 1, 1970. You can think of these definitions as a table that maps UTC date/time ranges (including future ranges) to specific offsets.
  In some time zones, temporary offset changes happen twice each year due to **Daylight Saving Time (DST)** starting in the Spring and ending each Fall.
  Offsets can also change permanently due to political changes, e.g. a country switching time zones.

The IANA Time Zone Database is updated several times per year in response to political changes around the world.
Each update contains changes to time zone definitions.
These changes usually affect only future date/time values, but occasionally fixes are made to past ranges too, for example when new historical sources are discovered about early-20th century timekeeping.

## Wall-Clock Time, Exact Time, and Time Zones in Temporal

In Temporal:

- The [`Temporal.Instant`](./instant.md) type represents exact time only.
- The [`Temporal.PlainDateTime`](./plaindatetime.md) type represents calendar date and wall-clock time, as do other narrower types: [`Temporal.PlainDate`](./plaindate.md), [`Temporal.PlainTime`](./plaintime.md), [`Temporal.PlainYearMonth`](./plainyearmonth.md), and [`Temporal.PlainMonthDay`](./plainmonthday.md).
  These types all carry a calendar system, which by default is `'iso8601'` (the ISO 8601 calendar) but can be overridden for other calendars like `'islamic'` or `'japanese'`.
- The time zone identifier represents a time zone function that converts between exact time and wall-clock time and vice-versa.
- The [`Temporal.ZonedDateTime`](./zoneddatetime.md) type encapsulates all of the types above: an exact time (like a [`Temporal.Instant`](./instant.md)), its wall-clock equivalent (like a [`Temporal.PlainDateTime`](./plaindatetime.md)), and the time zone that links the two.

There are two ways to get a human-readable calendar date and clock time from a `Temporal` type that stores exact time.

- If the exact time is already represented by a [`Temporal.ZonedDateTime`](./zoneddatetime.md) instance then the wall-clock time values are trivially available using the properties and methods of that type, e.g. [`.year`](./zoneddatetime.md#year), [`.hour`](./zoneddatetime.md#hour), or [`.toLocaleString()`](./zoneddatetime.md#toLocaleString).
- However, if the exact time is represented by a [`Temporal.Instant`](./instant.md), use a time zone and optional calendar to create a [`Temporal.ZonedDateTime`](./zoneddatetime.md). Example:

<!-- prettier-ignore-start -->
```javascript
instant = Temporal.Instant.from('2019-09-03T08:34:05Z');
formatOptions = {
  era: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

zdt = instant.toZonedDateTimeISO('Asia/Tokyo');
  // => 2019-09-03T17:34:05+09:00[Asia/Tokyo]
zdt.toLocaleString('en-us', { ...formatOptions, calendar: zdt.calendar });
  // => 'Sep 3, 2019 AD, 5:34:05 PM'
zdt.year;
  // => 2019
zdt.toLocaleString('ja-jp', formatOptions);
  // => '西暦2019年9月3日 17:34:05'

zdt = zdt.withCalendar('japanese');
  // => 2019-09-03T17:34:05+09:00[Asia/Tokyo][u-ca=japanese]
zdt.toLocaleString('en-us', { ...formatOptions, calendar: zdt.calendar });
  // => 'Sep 3, 1 Reiwa, 5:34:05 PM'
zdt.eraYear;
  // => 1
```
<!-- prettier-ignore-end -->

Conversions from calendar date and/or wall clock time to exact time are also supported:

<!-- prettier-ignore-start -->
```javascript
// Convert various local time types to an exact time type by providing a time zone
date = Temporal.PlainDate.from('2019-12-17');
// If time is omitted, local time defaults to start of day
zdt = date.toZonedDateTime('Asia/Tokyo');
  // => 2019-12-17T00:00:00+09:00[Asia/Tokyo]
zdt = date.toZonedDateTime({ timeZone: 'Asia/Tokyo', plainTime: '10:00' });
  // => 2019-12-17T10:00:00+09:00[Asia/Tokyo]
time = Temporal.PlainTime.from('14:35');
zdt = time.toZonedDateTime({ timeZone: 'Asia/Tokyo', plainDate: Temporal.PlainDate.from('2020-08-27') });
  // => 2020-08-27T14:35:00+09:00[Asia/Tokyo]
dateTime = Temporal.PlainDateTime.from('2019-12-17T07:48');
zdt = dateTime.toZonedDateTime('Asia/Tokyo');
  // => 2019-12-17T07:48:00+09:00[Asia/Tokyo]

// Get the exact time in seconds, milliseconds or nanoseconds since the UNIX epoch.
inst = zdt.toInstant();
epochNano = inst.epochNanoseconds; // => 1576536480000000000n
epochMilli = inst.epochMilliseconds; // => 1576536480000
epochSecs = Math.floor(inst.epochMilliseconds / 1000); // => 1576536480
```
<!-- prettier-ignore-end -->

## Ambiguity Due to DST or Other Time Zone Offset Changes

Usually, a time zone definition provides a bidirectional 1:1 mapping between any particular local date and clock time and its corresponding UTC date and time. However, near a time zone offset transition there can be **time ambiguity** where it's not clear what offset should be used to convert a wall-clock time into an exact time. This ambiguity leads to two possible UTC times for one clock time.

- When offsets change in a backward direction, the same clock time will be repeated.
  For example, 1:30AM happened twice on Sunday, 4 November 2018 in California.
  The "first" 1:30AM on that date was in Pacific Daylight Time (offset `-07:00`).
  30 exact minutes later, DST ended and Pacific Standard Time (offset `-08:00`) became active.
  After 30 more exact minutes, the "second" 1:30AM happened.
  This means that "1:30AM on Sunday, 4 November 2018" is not sufficient to know _which_ 1:30AM it is.
  The clock time is ambiguous.
- When offsets change in a forward direction, local clock times are skipped.
  For example, DST started on Sunday, 11 March 2018 in California.
  When the clock advanced from 1:59AM to 2:00AM, local time immediately skipped to 3:00AM.
  2:30AM didn't happen!
  To avoid errors in this one-hour-per year case, most computing environments (including ECMAScript) will convert skipped clock times to exact times using either the offset before the transition or the offset after the transition.

In both cases, resolving the ambiguity when converting the local time into exact time requires choosing which of two possible offsets to use, or deciding to throw an exception.

## Resolving Time Ambiguity in Temporal

In `Temporal`, if the exact time or time zone offset is known, then there is no ambiguity possible. For example:

<!-- prettier-ignore-start -->
```javascript
// No ambiguity possible because source is exact time in UTC
inst = Temporal.Instant.from('2020-09-06T17:35:24.485Z');
  // => 2020-09-06T17:35:24.485Z
// An offset can make a local time "exact" with no ambiguity possible.
inst = Temporal.Instant.from('2020-09-06T10:35:24.485-07:00');
  // => 2020-09-06T17:35:24.485Z
zdt = Temporal.ZonedDateTime.from('2020-09-06T10:35:24.485-07:00[America/Los_Angeles]');
  // => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
// if the source is an exact Temporal object, then no ambiguity is possible.
zdt = inst.toZonedDateTimeISO('America/Los_Angeles');
  // => 2020-09-06T10:35:24.485-07:00[America/Los_Angeles]
inst2 = zdt.toInstant();
  // => 2020-09-06T17:35:24.485Z
```
<!-- prettier-ignore-end -->

However, opportunities for ambiguity are present when creating an exact-time type (`Temporal.ZonedDateTime` or `Temporal.Instant`) from a non-exact source. For example:

<!-- prettier-ignore-start -->
```javascript
// Offset is not known. Ambiguity is possible!
zdt = Temporal.PlainDate.from('2019-02-19').toZonedDateTime('America/Sao_Paulo'); // can be ambiguous
zdt = Temporal.PlainDateTime.from('2019-02-19T00:00').toZonedDateTime('America/Sao_Paulo'); // can be ambiguous

// Even if the offset is present in the source string, if the type (like PlainDateTime)
// isn't an exact type then the offset is ignored when parsing so ambiguity is possible.
dt = Temporal.PlainDateTime.from('2019-02-19T00:00-03:00');
zdt = dt.toZonedDateTime('America/Sao_Paulo'); // can be ambiguous

// the offset is lost when converting from an exact type to a non-exact type
zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]');
  // => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
dt = zdt.toPlainDateTime(); // offset is lost!
  // => 2020-11-01T01:30:00
zdtAmbiguous = dt.toZonedDateTime('America/Los_Angeles'); // can be ambiguous
  // => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
  // note that the offset is now -07:00 (Pacific Daylight Time) which is the "first" 1:30AM
  // not -08:00 (Pacific Standard Time) like the original time which was the "second" 1:30AM
```
<!-- prettier-ignore-end -->

To resolve this possible ambiguity, `Temporal` methods that create exact types from inexact sources accept a `disambiguation` option, which controls what exact time to return in the case of ambiguity:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible exact times will be returned.
- `'later'`: The later of two possible exact times will be returned.
- `'reject'`: A `RangeError` will be thrown.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

Methods where this option is present include:

- [`Temporal.ZonedDateTime.from` with object argument](./zoneddatetime.md#from)
- [`Temporal.ZonedDateTime.prototype.with`](./zoneddatetime.md#with)
- [`Temporal.PlainDateTime.prototype.toZonedDateTime`](./plaindatetime.md#toZonedDateTime)

## Examples: DST Disambiguation

> This explanation was adapted from the [moment-timezone documentation](https://github.com/moment/momentjs.com/blob/master/docs/moment-timezone/01-using-timezones/02-parsing-ambiguous-inputs.md).

When entering DST, clocks move forward an hour.
In reality, it is not time that is moving, it is the offset moving.
Moving the offset forward gives the illusion that an hour has disappeared.
If you watch your computer's digital clock, you can see it move from 1:58 to 1:59 to 3:00.
It is easier to see what is actually happening when you include the offset.

```
1:58 -08:00
1:59 -08:00
3:00 -07:00
3:01 -07:00
```

The result is that any time between 1:59:59 and 3:00:00 never actually happened.
In `'earlier'` mode, the exact time that is returned will be as if the post-change UTC offset had continued before the change, effectively skipping backwards by the amount of the DST gap (usually 1 hour).
In `'later'` mode, the exact time that is returned will be as if the pre-change UTC offset had continued after the change, effectively skipping forwards by the amount of the DST gap.
In `'compatible'` mode, the same time is returned as `'later'` mode, which matches the behavior of existing JavaScript code that uses legacy `Date`.

<!-- prettier-ignore-start -->
```javascript
// Different disambiguation modes for times in the skipped clock hour after DST starts in the Spring
// Offset of -07:00 is Daylight Saving Time, while offset of -08:00 indicates Standard Time.
props = { timeZone: 'America/Los_Angeles', year: 2020, month: 3, day: 8, hour: 2, minute: 30 };
zdt = Temporal.ZonedDateTime.from(props, { disambiguation: 'compatible' });
  // => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from(props);
  // => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
  // ('compatible' is the default)
earlier = Temporal.ZonedDateTime.from(props, { disambiguation: 'earlier' });
  // => 2020-03-08T01:30:00-08:00[America/Los_Angeles]
  // (1:30 clock time; still in Standard Time)
later = Temporal.ZonedDateTime.from(props, { disambiguation: 'later' });
  // => 2020-03-08T03:30:00-07:00[America/Los_Angeles]
  // ('later' is same as 'compatible' for backwards transitions)
later.toPlainDateTime().since(earlier.toPlainDateTime());
  // => PT2H
  // (2 hour difference in clock time...
later.since(earlier);
  // => PT1H
  // ... but 1 hour later in real-world time)
```
<!-- prettier-ignore-end -->

Likewise, at the end of DST, clocks move backward an hour.
In this case, the illusion is that an hour repeats itself.
In `'earlier'` mode, the exact time will be the earlier instance of the duplicated wall-clock time.
In `'later'` mode, the exact time will be the later instance of the duplicated time.
In `'compatible'` mode, the same time is returned as `'earlier'` mode, which matches the behavior of existing JavaScript code that uses legacy `Date`.

<!-- prettier-ignore-start -->
```javascript
// Different disambiguation modes for times in the repeated clock hour after DST ends in the Fall
// Offset of -07:00 is Daylight Saving Time, while offset of -08:00 indicates Standard Time.
props = { timeZone: 'America/Los_Angeles', year: 2020, month: 11, day: 1, hour: 1, minute: 30 };
zdt = Temporal.ZonedDateTime.from(props, { disambiguation: 'compatible' });
  // => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from(props);
  // => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
  // 'compatible' is the default.
earlier = Temporal.ZonedDateTime.from(props, { disambiguation: 'earlier' });
  // => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
  // 'earlier' is same as 'compatible' for backwards transitions.
later = Temporal.ZonedDateTime.from(props, { disambiguation: 'later' });
  // => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
  // Same clock time, but one hour later.
  // -08:00 offset indicates Standard Time.
later.toPlainDateTime().since(earlier.toPlainDateTime());
  // => PT0S
  // (same clock time...
later.since(earlier);
  // => PT1H
  // ... but 1 hour later in real-world time)
```
<!-- prettier-ignore-end -->

## Ambiguity Caused by Permanent Changes to a Time Zone Definition

Time zone definitions can change.
Almost always these changes are forward-looking so don't affect historical data.
But computers sometimes store data about the future!
For example, a calendar app might record that a user wants to be reminded of a friend's birthday next year.

When date/time data for future times is stored with both the offset and the time zone, and if the time zone definition changes, then it's possible that the new time zone definition may conflict with previously-stored data.
In this case, then the `offset` option to [`Temporal.ZonedDateTime.from`](./zoneddatetime.md#from) is used to resolve the conflict:

- `'use'`: Evaluate date/time values using the time zone offset if it's provided in the input.
  This will keep the exact time unchanged even if local time will be different than what was originally stored.
- `'ignore'`: Never use the time zone offset provided in the input. Instead, calculate the offset from the time zone.
  This will keep local time unchanged but may result in a different exact time than was originally stored.
- `'prefer'`: Evaluate date/time values using the offset if it's valid for this time zone.
  If the offset is invalid, then calculate the offset from the time zone.
  This option is rarely used when calling `from()`.
  See the documentation of `with()` for more details about why this option is used.
- `'reject'`: Throw a `RangeError` if the offset is not valid for the provided date and time in the provided time zone.

The default is `'reject'` for [`Temporal.ZonedDateTime.from`](./zoneddatetime.md#from) because there is no obvious default solution.
Instead, the developer needs to decide how to fix the now-invalid data.

For [`Temporal.ZonedDateTime.with`](./zoneddatetime.md#with) the default is `'prefer'`.
This default is helpful to prevent DST disambiguation from causing unexpected one-hour changes in exact time after making small changes to clock time fields.
For example, if a [`Temporal.ZonedDateTime`](./zoneddatetime.md) is set to the "second" 1:30AM on a day where the 1-2AM clock hour is repeated after a backwards DST transition, then calling `.with({minute: 45})` will result in an ambiguity which is resolved using the default `offset: 'prefer'` option.
Because the existing offset is valid for the new time, it will be retained so the result will be the "second" 1:45AM.
However, if the existing offset is not valid for the new result (e.g. `.with({hour: 0})`), then the default behavior will change the offset to match the new local time in that time zone.

Note that offset vs. timezone conflicts only matter for [`Temporal.ZonedDateTime`](./zoneddatetime.md) because no other Temporal type accepts both an IANA time zone and a time zone offset as an input to any method.
For example, [`Temporal.Instant.from`](./instant.md#from) will never run into conflicts because the [`Temporal.Instant`](./instant.md) type ignores the time zone in the input and only uses the offset.

## Examples: `offset` option

The primary reason to use the `offset` option is for parsing values which were saved before a change to that time zone's time zone definition.
For example, Brazil stopped observing Daylight Saving Time in 2019, with the final transition out of DST on February 16, 2019.
The change to stop DST permanently was announced in April 2019.
Now imagine that an app running in 2018 (before these changes were announced) had saved a far-future time in a string format that contained both offset and IANA time zone.
Such a format is used by [`Temporal.ZonedDateTime.prototype.toString`](./zoneddatetime.md#toString) as well as other platforms and libraries that use the same format like [`Java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.md).
Let's assume the stored future time was noon on January 15, 2020 in São Paulo:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from({ year: 2020, month: 1, day: 15, hour: 12, timeZone: 'America/Sao_Paulo' });
zdt.toString();
  // => '2020-01-15T12:00:00-02:00[America/Sao_Paulo]'
  // Assume this string is saved in an external database.
  // Note that the offset is `-02:00` which is Daylight Saving Time

// Also note that if you run the code above today, it will return an offset
// of `-03:00` because that reflects the current time zone definition after
// DST was abolished.  But this code running in 2018 would have returned `-02:00`
// which corresponds to the then-current Daylight Saving Time in Brazil.
```
<!-- prettier-ignore-end -->

This string was valid at the time is was created and saved in 2018.
But after the time zone rules were changed in April 2019, `2020-01-15T12:00-02:00[America/Sao_Paulo]` is no longer valid because the correct offset for this time is now `-03:00`.
When parsing this string using current time zone rules, `Temporal` needs to know how to interpret it.
The `offset` option helps deal with this case.

<!-- prettier-ignore-start -->
```javascript
savedUsingOldTzDefinition = '2020-01-01T12:00-02:00[America/Sao_Paulo]'; // string that was saved earlier
/* WRONG */ zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition);
  // => RangeError: Offset is invalid for '2020-01-01T12:00' in 'America/Sao_Paulo'. Provided: -02:00, expected: -03:00.
  // Default is to throw when the offset and time zone conflict.
/* WRONG */ zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'reject' });
  // => RangeError: Offset is invalid for '2020-01-01T12:00' in 'America/Sao_Paulo'. Provided: -02:00, expected: -03:00.
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'use' });
  // => 2020-01-01T11:00:00-03:00[America/Sao_Paulo]
  // Evaluate date/time string using old offset, which keeps UTC time constant as local time changes to 11:00
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'ignore' });
  // => 2020-01-01T12:00:00-03:00[America/Sao_Paulo]
  // Use current time zone rules to calculate offset, ignoring any saved offset
zdt = Temporal.ZonedDateTime.from(savedUsingOldTzDefinition, { offset: 'prefer' });
  // => 2020-01-01T12:00:00-03:00[America/Sao_Paulo]
  // Saved offset is invalid for current time zone rules, so use time zone to to calculate offset.
```
<!-- prettier-ignore-end -->
