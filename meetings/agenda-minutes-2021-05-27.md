# May 27, 2021

## Attendees:
- Richard Gibson (RGN)
- Justin Grant (JGT)
- James Wright (JWT)
- Daniel Ehrenberg (DE)
- Philip Chimento (PFC)

## Agenda:

### How best to snapshot/permalink the [2021-05-25 plenary slides](https://justingrant.github.io/temporal-slides-in-progress/)?
- PFC: I thought that PDL was archiving the slides somewhere.
- Action: PFC to ask PDL about archiving the slides

### Node 14 test failures re: calendar internationalization bugs
- JGT: Should we merge the PR ([#1509](https://github.com/tc39/proposal-temporal/issues/1509)) before or after fixing the bugs?
- PFC: I can't merge it because the tests are failing.
- Action: JGT to investigate the tests; the theory is that Node 14 fixed the bugs so we don't need the workarounds anymore.

### Polyfill updates
- JGT: Merge the new pull requests before moving to the new repo?
- PFC: I assume yes, I'll just sync the old and the new polyfill during this short window of overlap.
- JGT: I'll wordsmith the deprecation message for the old polyfill package.
- PFC: It should include something like "this is only for validating 262 tests, for production use try ..."

Current deprecation plan:
1. Fix Intl tests - JGT
1. Merge pull requests - PFC
1. Publish new polyfill from new repo - PFC
1. Make pull request for README changes in old repo - JGT
1. `npm deprecate` old polyfill - PFC
1. Make pull request to add runtime console warning - JGT
1. Cut new release of old polyfill - PFC
1. Update issues [#1447](https://github.com/tc39/proposal-temporal/issues/1447) and [#1446](https://github.com/tc39/proposal-temporal/issues/1446) - JGT
