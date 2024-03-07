# May 25, 2023

## Attendees
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Richard Gibson (RGN)

## Agenda

### Status reports
- IETF
    - JGT: Not on the agenda for the upcoming IETF meeting. Hopefully we have a draft that  will be approved as is.
- Integer math change
    - PFC: Have reached the point in the refactoring where everything needs to be converted.
    - PFC: Any opinions on whether we should follow SYG's or WH's preference on expressing the 96-bit integer as a mathematical value or two numbers?
    - JGT: Suggest encapsulating all arithmetic operations in AOs.
    - SFC: Could express the integer as a mathematical value. Some platforms and languages (like Rust) support 128-bit integers, so some abstraction involving 64+32 seems superfluous. 
- Status of approved normative PRs
    - [#2570](https://github.com/tc39/proposal-temporal/pull/2570) is waiting on tests. Guillaume is working on those.
    - [#2519](https://github.com/tc39/proposal-temporal/pull/2519) on PFC's plate. Prioritizing the integer math, which is helpful because it has uncovered a few bugs in this one. Tests are partially completed.
    - [#2571](https://github.com/tc39/proposal-temporal/pull/2571) is stacked on top of #2519. Also on PFC's plate. Otherwise complete, but waiting for the earlier one to merge.
    - [#2500](https://github.com/tc39/proposal-temporal/pull/2500) has a polyfill implementation and tests from ADT. She discovered something that might be a bug. RGN to take a look.

### Anba's feedback on date difference order of operations ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- Come back to this next time.

### [#2482](https://github.com/tc39/proposal-temporal/pull/2482) made DefaultTimeZone's result observable (matters for offset strings) ([#2584](https://github.com/tc39/proposal-temporal/issues/2584))
- JGT: Related ecma262 PR is just about ready to merge
- JGT: Because ECMA-402 does not yet support offset time zones, there’s a gap
- SFC: The only place where the platform returns time zone strings is DefaultTimeZone and Intl.supportedValuesOf, and those should absolutely be in canonicalized/normalized form.
- JGT: Should we just consider this to be part of the change to 402 for supporting offset strings?
- SFC: It could be fixed as above, in a normative PR in 262, or in the time zone canonicalization proposal.
- JGT: Preference for the third.
- JGT: Related: ICU (via CLDR dependency) replaces unknown host time zone with “Etc/Unknown”. Should we specify that?
- RGN: Problem: it’s _emitted_ but not _accepted_. The best outcome would be adding to IANA tzdb, but in the absence of that we should just specify it in ECMAScript with a privileged position similar to “UTC”.
- Conclusion: handle this problem in proposal-canonical-tz.

### Numbers as ISO strings (PR [#2574](https://github.com/tc39/proposal-temporal/pull/2574))
- JGT: The core problem is that some cases exist for which double-digit integers are accepted (with varying interpretation) but single-digit integers and non-integer numbers are rejected.
- JGT: IIRC, plenary was in favor of being more strict than the rest of the language in rejecting numbers where strings are expected.
- JGT: options: 
    1. Do nothing, number → string coercion is weird
    2. Objects are accepted and ISO strings are parsed. Input of other types (particularly numbers) is rejected:
        - 2a. Everywhere we parse an ISO string
        - 2b. only for offsets, time zones, and calendars (not any other Temporal type)
        - 2c. for all Temporal types EXCEPT PlainDate, PlainDateTime, and PlainMonthYear where numbers after 2000 usually work, e.g.  20200101. (What about 3330101 January first of 333 CE? or -10101 January 1st 1 BCE)
    3. Accept numbers and have logic to process them in types where it's relevant.
- Conclusion: champions think we should do (2a). JGT will post in the issue to see if ABL also supports 2a (he previously expressed support for 2b).

### Offset strings for 402 ([ecma-402/#683](https://github.com/tc39/ecma402/issues/683))
- RGN plans to have a PR in time for the next TG2 meeting (1 week from today)