# Temporal Proposal

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
This proposes `temporal`, a built in module that brings a modern date time API to the ECMAScript language.
For a detailed breakdown of motivations see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

- All temporal APIs are non-mutating.  All temporal objects are effectively immutable.
- All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).  Other calendar systems are out-of-scope for this proposal.  However, we will consider how future APIs may interact with this one such that extending it to support other calendars may be possible in a future proposal.
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Specification Text

**The specification text is currently out of date. It will be updated as the proposal get closer to a stable state. Please rely on the markdown files linked from here for authoritative information until then.**

## Polyfill

A complete polyfill can be found [here](./polyfill). It will be developed to remain in sync with this proposal.

---------------------------------------------------------------------------------------------------

# Overview of Standard Objects in the `temporal` module

Please see the [Object Description](./archive/objects.md) for details on the shape and functionality of
temporal objects as well as the [Mental Model](./archive/mentalmodel.md) which underlies that API and explain the relationship between these objects.

There are also some [Example Use-Cases](./archive/examples.md) to describe how these objects can be used
in practice.

Also there were many long discussions on the naming of the `Civil*` objects. There is a short piece describing the pros and cons and arguments on [how we reached the decision to name them `Civil`](./archive/civil.md).

### Civil Vs Instant Objects

The word 'Civil' indicates an object that does not have a relationship to the global timeline (UTC). The object could be anywhere/in any place.

The word 'Instant' indicates an object that has a relationship to the global timeline (UTC), and can assertively be mapped to a UTC date.

### Objects representing Civil Time

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`CivilDate`     | A date without any time or time zone reference.                     | `2017-12-31`
`CivilTime`     | A time-of-day without any date or time zone reference.              | `17:00:00`
`CivilDateTime` | A date and a time without any time zone reference.                  | `2017-12-31T12:00:00`
`CivilYearMonth`| A date without a day component                                      | `2017-12`
`CivilMonthDay` | A date without a year component                                     | `12-25`

### Objects representing Absolute Time

Object name     | Description                                                         | Example
----------------|---------------------------------------------------------------------|-------------
`Instant`       | A point on the universal timeline.                                  | `2017-12-31T00:00:00Z`
`OffsetDateTime`| A point on the universal timeline, with an associated offset.       | `2017‑12‑31T09:00:00+09:00`
`ZonedDateTime` | A point on the universal timeline, with an associated time zone.    | `2017‑12‑31T09:00:00+09:00[Asia/Tokyo]`

Note that the time zone of a `ZonedDateTime` needs to be a valid `Zone` or `Link` name from the
[IANA time zone database](https://www.iana.org/time-zones), as also listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

---------------------------------------------------------------------------------------------------

[Technical Decision Record](./techrecord.md)
