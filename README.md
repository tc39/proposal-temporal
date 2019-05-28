# Temporal Proposal

Provides standard objects and functions for working with dates and times.

## Champions

- Maggie Pint  ([@maggiepint](https://github.com/maggiepint))
- Philipp Dunkel ([@pipobscure](https://github.com/pipobscure))
- Matt Johnson ([@mj1856](https://github.com/mj1856))
- Brian Terlson ([@bterlson](https://github.com/bterlson))

## Status

This proposal is currently stage 2

[Proposed Spec Text is viewable here.](https://tc39.github.io/proposal-temporal/spec-rendered)  
(Note, this is a work in progress.)

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

## Polyfill

A complete polyfill can be found [here](https://github.com/std-proposal/temporal). It will be developed to remain in sync with this proposal.

---------------------------------------------------------------------------------------------------

# Overview of Standard Objects in the `temporal` module

Please see the [Object Description](./objects.md) for details on the shape and functionality of
temporal objects.

There are also some [Example Use-Cases](./examples.md) to describe how these objects can be used
in practice.

### Civil Vs Instant Objects

The word Civil indicates an object that does not have a relationship to the global timeline (UTC). The object could be anywhere/in any place.

The word Instant indicates an object that has a relationship to the global timeline (UTC), and can assertively be mapped to a UTC date.

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
`Instant`       | A point on the universal timeline, typically represented in UTC.    | `2017-12-31T00:00:00Z`
`OffsetDateTime`| A point on the universal timeline, with an associated offset.       | `2017‑12‑31T09:00:00+09:00`
`ZonedDateTime` | A point on the universal timeline, with an associated time zone.    | `2017‑12‑31T09:00:00+09:00[Asia/Tokyo]`

Note that the time zone of a `ZonedDateTime` needs to be a valid `Zone` or `Link` name from the
[IANA time zone database](https://www.iana.org/time-zones), as also listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

---------------------------------------------------------------------------------------------------

# Technical Design Decision Record

As part of creating/improving the *temporal* proposal, a discussions took place involving [@maggiepint](https://twitter.com/maggiepint), [@RedSquirrelious](https://twitter.com/RedSquirrelious), [@bterlson](https://twitter.com/bterlson) and  [@pipobscure](https://twitter.com/pipobscure) as well as at times [@littledan](https://twitter.com/littledan) and others. These are the conclusions we arrived at. This is the summary of my recollections of the reasoning behind these decisions.

## Omit `toDate()` methods

We did not want to tie the *temporal* proposals to the existing `Date` built-in objects. The creating an explicit dependency makes future evolution of the standards harder.

For that reason we omitted the `toDate()` methods from the proposal. This is simply a shortcut for `new Date(instant.milliseconds)` to begin with, so there is very little benefit to that tie.

## Naming `fromEpochMilliseconds()` rather than `fromDate()` method

In the same vein as omitting `toDate()` we also decided to name the method to create an Instant from a `Date` as `fromEpochMilliseconds()` rather than `fromDate()`. For one thing, the name `fromEpochMilliseconds()` is actually more reflective of what the method is supposed to do as it is supposed to accept a numeric argument representing the *milliseconds since epoch* as well.

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

`ZonedDateTime.prototype.toString` always outputs **&lt;year>-&lt;month>-&lt;day>T&lt;hours>:&lt;minutes>:&lt;seconds>.&lt;nanoseconds>[Z|&lt;offset>]**

Other formats of parts will not be output, so the `fromString()` methods can be extremely restrictive.

### ZonedDateTime.prototype.timeZone will be the offset rather than the IANA name

The offset at a point in time is unique an clear. It can also be parsed back allowing for serialisation as described above.

In contrast the *IANA Zones* are unclear and are hard to parse back requiring a full timezone database. In order to keep the proposal interoperable with IoT and other low-spec scenarios, requiring full *IANA* support seemed contraindicated.

At the same time we felt it's critical to allow for fully supporting *IANA Zones* in the `ZonedDateTime` constructor as well as the `withZone()` methods.
