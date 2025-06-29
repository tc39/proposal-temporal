# Temporal

Provides standard objects and functions for working with dates and times.

## Status

This proposal is currently [Stage 3](https://github.com/tc39/proposals#stage-3) and was reviewed for Stage 3 by Richard Gibson, Bradley Farias, and Daniel Ehrenberg.

This proposal is now in the hands of ECMAScript engine implementers, so the bar for making API changes is extremely high.
Nonetheless, changes may occur as the result of feedback from implementation in JS engines.
Editorial changes to the spec and bug fixes to the spec, tests, and docs are also ongoing, as is customary for Stage 3 proposals.
Additional tests and documentation content are also being added during Stage 3.

Implementation status:

- [SpiderMonkey/Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1912511): [shipping](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/139#javascript) in Firefox 139
- [V8/Chrome](https://crbug.com/42201538) + [Node.js](https://github.com/nodejs/node/issues/57127)
- [JavaScriptCore/Safari](https://bugs.webkit.org/show_bug.cgi?id=223166)
- [Boa](https://github.com/boa-dev/boa/issues/1804)
- [GraalJS](https://github.com/oracle/graaljs/issues/851)
- [Kiesel](https://codeberg.org/kiesel-js/kiesel/issues/124)

## Champions

- Philipp Dunkel ([@pipobscure](https://github.com/pipobscure))
- Maggie Johnson-Pint ([@maggiepint](https://github.com/maggiepint))
- Matt Johnson-Pint ([@mattjohnsonpint](https://github.com/mattjohnsonpint))
- Brian Terlson ([@bterlson](https://github.com/bterlson))
- Shane Carr ([@sffc](https://github.com/sffc))
- Ujjwal Sharma ([@ryzokuken](https://github.com/ryzokuken))
- Philip Chimento ([@ptomato](https://github.com/ptomato))
- Jason Williams ([@jasonwilliams](https://github.com/jasonwilliams))
- Justin Grant ([@justingrant](https://github.com/justingrant))

## Overview / Motivation

`Date` has been a long-standing pain point in ECMAScript.
This proposes `Temporal`, a global `Object` that acts as a top-level namespace (like `Math`), that brings a modern date/time API to the ECMAScript language.
For a detailed breakdown of motivations, see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)

### Principles:

- All Temporal objects are immutable.
- Date values can be represented in local calendar systems ([why?](./docs/calendar-review.md)), but they should be convertable to and from the [Proleptic Gregorian Calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar).
- All time-of-day values are based on a standard 24-hour clock.
- [Leap seconds](https://en.wikipedia.org/wiki/Leap_second) are not represented.

## Specification Text

The specification text can be found [here](https://tc39.es/proposal-temporal/).

## Documentation

Reference documentation and examples can be found below.

- [Temporal Documentation (English)](https://tc39.es/proposal-temporal/docs/index.html)
- [Temporal のドキュメント (Japanese)](https://tc39.es/proposal-temporal/docs/ja/index.html) (translated a part of the English document into Japanese)
- [Temporal 文档 (Chinese)](https://tc39.es/proposal-temporal/docs/zh_CN/index.html) (translated a part of the English document into Chinese)

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](https://tc39.es/proposal-temporal/docs/cookbook.html)

## Polyfills

| Polyfill                                                                         | Repo                                                                                | Status                  |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| **[@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill)** | [js-temporal/temporal-polyfill](https://github.com/js-temporal/temporal-polyfill)   | Alpha release available |
| **[temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill)**         | [fullcalendar/temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill) | Beta release available  |

If you're working on a polyfill, please file an issue or PR so we can add yours here.

A [non-production polyfill](./polyfill) was built to validate this proposal.
This polyfill continues to live in this repo, but only for the purposes of running tests and powering the documentation "playground" as described below.

**DO NOT use this polyfill in your own projects!
Instead, please use a polyfill from the table above.**

## Documentation Playground

When viewing the [reference documentation](https://tc39.es/proposal-temporal/docs/index.html), the non-production polyfill is automatically loaded in your browser, so you can try out Temporal by opening your browser's developer tools console.
