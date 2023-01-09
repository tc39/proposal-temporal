# April 28, 2022

## Attendees
- Richard Gibson (RGN)
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Frank Yung-Fong Tang (FYT)
- Philipp Dunkel (PDL)

## Agenda

### Non-ISO calendars in implementations without 402 ([#2160](https://github.com/tc39/proposal-temporal/issues/2160))
- RGN: It's surprising that a 262 implementation would be prohibited from adding calendars that would be valid if it included 402. E.g., `"gregory"`, `"islamicc"`.
- PFC: I agree in theory, but I've been assuming that we should not add more implementation-defined behaviour if we can help it.
- RGN: I don't feel strongly about it, it's possible to change later, but it should be intentional. It might matter for XS.
- USA: Is there a reason for XS to implement anything other than `"iso8601"`?
- RGN: Unclear.
- USA: Espruino might have a valid use case.
- RGN to make a pull request.

### Need to be more specific about "according to ISO-8601" in ToISOWeekOfYear ([#1641](https://github.com/tc39/proposal-temporal/issues/1641))
- FYT: We need to tie this to a published algorithm. I referenced Wikipedia's description but my patch to v8 got rejected.
- PDL: It's specified as the first week in January that contains a Thursday. What is the reviewer looking for?
- FYT: An algorithm, instead of a description.
- PFC: I can prioritize this more if it's blocking landing your patch in v8.

### ECMA-402 refactors ([#1928](https://github.com/tc39/proposal-temporal/pull/1928))
- PFC: Slightly related to the previous issue, but probably doesn't solve it completely.
- USA: What's missing on this?
- PFC: Only the ecmarkup failures.

### Bug tracker sweep!
We started discussing the list of issues labeled "spec-text", starting from the most recent.