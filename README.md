# Temporal

Provides standard objects and functions for working with dates and times.

**NOTE: The current working version is the [Polyfill](./polyfill). Specification text is being written based on that!**

## Champions

- Maggie Pint  ([@maggiepint](https://github.com/maggiepint))
- Philipp Dunkel ([@pipobscure](https://github.com/pipobscure))
- Matt Johnson ([@mj1856](https://github.com/mj1856))
- Brian Terlson ([@bterlson](https://github.com/bterlson))

## Status

This proposal is currently stage 2

Stage 3 Reviewers:
- Richard Gibson
- Bradley Farias
- Daniel Ehrenberg

## Overview / Motivation

Date has been a long time pain point in ECMAScript.
This proposes `Temporal`, a global object that acts as a top-level namespace (like `Math`) that brings a modern date time API to the ECMAScript language.
For a detailed breakdown of motivations see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

- All temporal APIs are non-mutating.  All temporal objects are effectively immutable.
- All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).  Other calendar systems are out-of-scope for this proposal.  However, we will consider how future APIs may interact with this one such that extending it to support other calendars may be possible in a future proposal.
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Specification Text

**The specification text is currently being updated to match the polyfill. Please rely on the polyfill linked from here for authoritative information until then.**

## Polyfill

A complete polyfill can be found [here](./polyfill). It is being developed as specification in code.

## Overview of Classes in the `Temporal` global

### `Temporal.Absolute`

An `Temporal.Absolute` represents a fixed point in time along the POSIX timeline. It does this by internally maintaining a slot for "Nanoseconds since the POSIX-Epoch".

See [Temporal.Absolute Documentation](./docs/absolute.md) for more detailed documentation.

### `Temporal.TimeZone`

A `Temporal.TimeZone` represents an IANA Timezone, a specific UTC-Offset or UTC itself. Because of this `Temporal.TimeZone` can be used to convert between `Temporal.Absolute` and `Temporal.DateTime` as well as finding out the offset at a specific `Temporal.Absolute`.

`Temporal.TimeZone` is also an iterable that give access to the IANA-Timezones supported by the system from the [IANA time zone database](https://www.iana.org/time-zones) (also listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)).

See [Temporal.TimeZone Documentation](./docs/timezone.md) for more detailed documentation.

### `Temporal.DateTime`

A `Temporal.DateTime` represents a caldendar date and wall-clock time. That means it does not carry timezone information. However it can be converted to a `Temporal.Absolute` using a `Temporal.TimeZone`.

This can also be converted to object containing only partial information such as `Temporal.Date` and `Temporal.Time`.

See [Temporal.DateTime Documentation](./docs/datetime.md) for more detailed documentation.

### `Temporal.Time`

A `Temporal.Time` object represents a wall-clock time. Since there is no date component this can not be directly translated to an absolute point in time. However it can be converted to a `Temporal.Absolute` by combining with a `Temporal.Date` using a `Temporal.TimeZone`.

See [Temporal.Time Documentation](./docs/time.md) for more detailed documentation.

### `Temporal.Date`

A `Temporal.Date` object represents a calendar date. This means there is no way to convert this to an absolute point in time, however combining with a `Temporal.Time` a `Temporal.DateTime` can be obtained which in turn can be pinned to the absolute timeline.

This can also be converted to partial dates such as `Temporal.YearMonth` and `Temporal.MonthDay`.

See [Temporal.Date Documentation](./docs/date.md) for more detailed documentation.

### `Temporal.YearMonth`

A date without a day component. This is useful to express things like "the November 2010 meeting".

See [Temporal.YearMonth Documentation](./docs/yearmonth.md) for more detailed documentation.

### `Temporal.MonthDay`

A date without a year component. This is useful to express things like "Bastille-Day is on the 14th of July".

See [Temporal.MonthDay Documentation](./docs/monthay.md) for more detailed documentation.

### `Temporal.Duration`

A `Temporal.Duration` expresses a length of time. This is used fo date/time maths.

See [Temporal.Duration Documentation](./docs/duration.md) for more detailed documentation.

### `Temporal` functions

 * `Temporal.getAbsolute()` - get the current system absolute time
 * `Temporal.getTimeZone()` - get the current system timezone
 * `Temporal.getDateTime()` - get the current system date/time
 * `Temporal.getTime()` - get the current system time
 * `Temporal.getDate()` - get the current system date
 * `Temporal.getYearMonth()` - get the current system year/month
 * `Temporal.getMonthDay()` - get the current system month/day

See [Temporal Functions Documentation](./docs/functions.md) for more detailed documentation.
