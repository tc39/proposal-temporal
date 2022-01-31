# December 9, 2021
## Attendees
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Jesse Alama (JMN)

## Agenda
### Presentation at December TC39 meeting
- Slides are at http://ptomato.name/talks/tc39-2021-12
- The plenary is Tuesday and Wednesday next week (10-12, 1-3 Pacific Time)
- The presentation doesn't contain anything likely to be controversial, and we don't expect there will be much discussion.

### Next meeting time
- There was some miscommunication after we postponed last week's meeting to today.
- Igalians will not be available next week, due to all-hands meeting.
- PFC will be out from 2021-12-17 through the end of the year.
- Next meeting scheduled for 2022-01-06. Not sure if this is on our current schedule of odd or even weeks, but let's restart it from there.

### Specifying calendar operations ([#1899](https://github.com/tc39/proposal-temporal/issues/1899))
- JGT: Waiting on USA to make changes.
- PFC: Don't need to present this at plenary meeting, as the calendar implementor recommendations are non-normative.

### Test262 and Time Zone testing
- JGT: how are timezone corner cases (e.g. Samoa's move across the international date line in 2011) tested in Test262?
- PFC: One way to do it is to put them in the `test/intl402` section of test262 where Intl can be assumed to be present. The downside is that a whole section of features may not be tested on platforms that don't have Intl. Won't affect browsers, but may affect embedded engines for IoT, etc.
- JGT: Maybe test a subset in 262, and the rest in the 402-dependent section?
- PFC: Another approach would be to use a custom time zone from TZDB data, like in my cookbook example.
- JGT: I like that suggestion.

### Polyfill vs. spec mismatch in PrepareTemporalFields ([#1963](https://github.com/tc39/proposal-temporal/issues/1963))
- PFC: It should be easy enough to change this one in the polyfill code and see if anything breaks.
- JGT to PR this one.

### When internally creating new Temporal instances, should we use intrinsic or monkeypatchable prototype? ([#1965](https://github.com/tc39/proposal-temporal/issues/1965))
- PFC: What happens if you replace the prototype on any builtin other than Temporal?
- JGT: The prototype is readonly on all builtin types except `Intl.DateTimeFormat`.
- PFC: That may be due to our polyfill as well.
- (Verifying that prototype is readonly on builtin Intl.DateTimeFormat)
- JGT: So this is a polyfill bug. Now that we know it should not be writable, then we can rely on it not being replaced as long as we have the %Temporal.PlainDate% intrinsic. I'm surprised we don't have test262 tests for this.
- (Checking if we have test262 tests — we don't)
- PFC: It seems that we test every other property descriptor in Temporal except for the `prototype` properties.
- JGT: Should we change the polyfill to use the %...prototype% intrinsic directly?
- PFC: If we're not using it anywhere else, we could also avoid storing it.

### Fix TS types for required CalendarProtocol methods ([#1964](https://github.com/tc39/proposal-temporal/issues/1964))
- PFC: My answer to this would depend on what the intention of the TS types is. You can create a calendar without most of the methods and nothing will complain until you actually try to do an operation that requires them. But to have a complete calendar you need to implement all of the methods except those 4.
- JMN: Are these operations all well-defined even on historical calendars that people might implement in userland?
- Consensus: yes, let's change this.

### `halfExpand` rounding in `PlainDate.p.until` doesn't actually round up at the midpoint of a month with an odd number of days ([#1949](https://github.com/tc39/proposal-temporal/issues/1949))
- JGT: Let's leave this open for now, to see if others have feedback. We'll discuss it another time when more people are present.

### Editorial (?): a few questions/issues in RoundDuration AO ([#1958](https://github.com/tc39/proposal-temporal/issues/1958))
- Consensus: should be OK to refactor for DRY

### GetIntrinsic: remove from PlainDate, add monkeypatching test ([@js-temporal/temporal-polyfill#105](https://github.com/js-temporal/temporal-polyfill/pull/105))
- PFC: TS polyfill intrinsics must match property descriptors. If TS can do that natively, then could maybe replace GetIntrinsic with a function that is called after each TS class is defined that edits the property descriptors of the class that was just defined.
- JGT: Test262 changes for [#1965](https://github.com/tc39/proposal-temporal/issues/1965) should include tests that verify that every property descriptor is `writable: false, enumerable: false, configurable: false`. Let's get those tests built first, then we can run Test262 against any refactor in the prod polyfill (or any other polyfill!) to ensure that monkeypatching behavior matches the spec.