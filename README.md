# Temporal

Provides standard objects and functions for working with dates and times.

**NOTE: The [Polyfill](./polyfill), specification text and documentation are under continuing development and should be understood to be unstable.**

## Champions

-   Maggie Pint ([@maggiepint](https://github.com/maggiepint))
-   Philipp Dunkel ([@pipobscure](https://github.com/pipobscure))
-   Matt Johnson ([@mj1856](https://github.com/mj1856))
-   Brian Terlson ([@bterlson](https://github.com/bterlson))
-   Shane Carr ([@sffc](https://github.com/sffc))

## Status

This proposal is currently stage 2

Stage 3 Reviewers:

-   Richard Gibson
-   Bradley Farias
-   Daniel Ehrenberg

## Overview / Motivation

Date has been a long time pain point in ECMAScript.
This proposes `Temporal`, a global object that acts as a top-level namespace (like `Math`) that brings a modern date time API to the ECMAScript language.
For a detailed breakdown of motivations see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

-   All temporal APIs are non-mutating. All temporal objects are effectively immutable.
-   All date values are based on the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar). Other calendar systems are out-of-scope for this proposal. However, we will consider how future APIs may interact with this one such that extending it to support other calendars may be possible in a future proposal.
-   All time-of-day values are based on a standard 24-hour clock.
-   [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Specification Text

**The specification text is currently being updated to match the polyfill. Please rely on the polyfill linked from here for authoritative information until then.**

## Polyfill

A complete polyfill can be found [here](./polyfill). It is being developed as specification in code.
When viewing the [reference documentation](https://tc39.es/proposal-temporal/docs/index.html), the polyfill is automatically loaded in your browser, so you can try it out by opening your browser's developer tools.

## Cookbook

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](./cookbook/README.md)

## API Documentation

Reference documentation and examples are in progress and can be found [here](https://tc39.es/proposal-temporal/docs/index.html).
