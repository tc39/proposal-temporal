# Temporal

Provides standard objects and functions for working with dates and times.

**NOTE: The [Polyfill](./polyfill), specification text and documentation are under review and should be understood to be unstable.**

## Champions

-   Philipp Dunkel ([@pipobscure](https://github.com/pipobscure))
-   Maggie Johnson-Pint ([@maggiepint](https://github.com/maggiepint))
-   Matt Johnson-Pint ([@mattjohnsonpint](https://github.com/mattjohnsonpint))
-   Brian Terlson ([@bterlson](https://github.com/bterlson))
-   Shane Carr ([@sffc](https://github.com/sffc))
-   Ujjwal Sharma ([@ryzokuken](https://github.com/ryzokuken))
-   Philip Chimento ([@ptomato](https://github.com/ptomato))
-   Jason Williams ([@jasonwilliams](https://github.com/jasonwilliams))
-   Justin Grant ([@justingrant](https://github.com/justingrant))

## Status

This proposal is currently [Stage 2](https://github.com/tc39/proposals#stage-2).

At the time of writing, all the major design decisions that we are aware of have been made.
The proposal is under review by the TC39 delegates and the bar for making subsequent changes is high.
Nonetheless, changes may occur as the result of feedback from TC39 reviews and implementation in JS engines.

Stage 3 Reviewers:

-   Richard Gibson
-   Bradley Farias
-   Daniel Ehrenberg

## Overview / Motivation

`Date` has been a long-standing pain point in ECMAScript.
This proposes `Temporal`, a global `Object` that acts as a top-level namespace (like `Math`), that brings a modern date/time API to the ECMAScript language.
For a detailed breakdown of motivations, see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

- All Temporal objects are immutable.
- Date values can be represented in local calendar systems, but they should be convertable to and from the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Specification Text

The specification text can be found [here](https://tc39.es/proposal-temporal/).

## Polyfill

A complete polyfill can be found [here](./polyfill).
When viewing the [reference documentation](https://tc39.es/proposal-temporal/docs/index.html), the polyfill is automatically loaded in your browser, so you can try it out by opening your browser's developer tools.

**NOTE:** We encourage you to experiment with the polyfill, but don't use it in production!
The API may change before the proposal reaches Stage 3.

## Documentation

Reference documentation and examples can be found [here](https://tc39.es/proposal-temporal/docs/index.html).

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](https://tc39.es/proposal-temporal/docs/index.html)
