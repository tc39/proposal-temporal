July 31, 2020 (5-hour marathon)

Attendees:

Ujjwal Sharma (USA)

Shane Carr (SFC)

Philip Chimento (PFC)

Philipp Dunkel (PDL)

Justin Grant (JGT)
Jeff Walden (JSW)

Richard Gibson (RGN)

Younies Mahmoud (YMD)

* Draft agenda for Friday’s meeting.

    * Quick Topics

    * Durations

    * LocalDateTime

    * Plan (sequence, assignment, etc.) for making the changes above

    * What else? (time permitting)

* Quick Topics

    * [#693](https://github.com/tc39/proposal-temporal/pull/693) Require `options` bags to be object or undefined

        * Assign to PFC, to discuss in the next 402 meeting.

* Durations

    * [#782](https://github.com/tc39/proposal-temporal/issues/782) Proposal: Negative Durations *(nothing to discuss other than FYI that this proposal has no known blocking issues and no thumbs-down feedback so it’s on deck for PR.** ** If you disagree, speak up ASAP!**)*

        * We are in favour of proceeding with this.

    * [#789](https://github.com/tc39/proposal-temporal/issues/789) Proposal: balancing/rounding method & total method for Duration type

        * PDL objection to the relativeTo option.

        * RGN objection to having rounding and balancing be the same operation, they should be two different methods.

        * Conclusion: No consensus yet. We are agreed on adding rounding options to the difference() methods, but that doesn't yet solve [#337](https://github.com/tc39/proposal-temporal/issues/337) which is needed for Intl.DurationFormat.

        * For rounding mode names, we'll follow what Intl is doing.

        * If the method is called `round`, then the default mode will be rounding; if it's a separate method not called `round`, we'll decide later what the default is; if it's part of `difference`, then there is no default because the rounding mode is required if `smallestUnit` is specified.

        * Rounding to other increments (e.g. minutes) is definitely wanted, but we're not sure of exactly what for this needs to take.

        * Agreed on weeks as in point 6.

        * Agreed to skip the remainder-only option in point 7.

        * No options needed to be added to `plus` and `minus` until we figure out the bigger question of how to add the `balance` method.

        * [#805](https://github.com/tc39/proposal-temporal/issues/805) We'll allow milliseconds, microseconds, and nanoseconds in largestUnit.

        * Instead of `totalFoo` methods we'd have one `total` method and always return Number, not BigInt. But the `total` method is still blocked on deciding what to do with `relativeTo`.

        * For now, no `datePortion` and `timePortion` methods.

        * Keep the balance options in `from` and `with`.

            * principle: anything that returns a Duration should expose configuration of balancing (and rounding) behavior

        * Consider what would be involved in adding an Interval type

        * Add `round` methods to other types that are not Duration. Accept pluralized units for `largestUnit`. No `last` or `first` options.

    * [#802](https://github.com/tc39/proposal-temporal/issues/802) Limit `Absolute` math to hours or smaller units (no days) ?

    * What else?

* LocalDateTime *(we may want to prune some of the issues below to focus on the most difficult/contentious issues)*

    * Main issue: [#700](https://github.com/tc39/proposal-temporal/issues/700).  The bullet points below are all open/related issues to discuss.

        * Fundamentally, we do want this type, and this discussion is about the details.

    * [706#issuecomment-654507834](https://github.com/tc39/proposal-temporal/issues/706#issuecomment-654507834) – Is LocalDateTime an everything type, a minimal type, or something in between?

        * Let's think of it not as an "everything type" but as an "event that happened / will happen in a place", and ask ourselves what _not_ to have in the type, taking that into account. We'll evaluate the other questions using this framework.

        * We do need an option for parsing strings where the offset doesn't agree with the IANA time zone.

        * No `durationKind` option in math methods. The use case for using e.g. an Absolute duration on a LocalDateTime is rare enough that it's better to drop into Absolute for that use case, rather than adding the cognitive load of this option. (In other words, Durations don't have a meaning other than a collection of units and their scalar values. The meaning comes from the type that you apply them to.)

    * [#742](https://github.com/tc39/proposal-temporal/issues/742) - How should LocalDateTime expose its Absolute, TimeZone, Calendar, and (calculated) DateTime?

        * It's a full fledged type, so it has getters for the Calendar and TimeZone  fields.

        * On the question of whether we have an `absolute` field in `getFields`/`from`. Not having it makes `getFields` lossy, but having it can cause conflicts. We decided not to have it. `Absolute.toLocalDateTime` should be a better way to solve that in most cases.

    * [#724](https://github.com/tc39/proposal-temporal/issues/724) - Should parameterless toFoo & getFoo methods be property getters instead?

    * [#718](https://github.com/tc39/proposal-temporal/issues/718) - Should LocalDateTime.from accept a timezoneOffsetNanoseconds field?

    * [#703](https://github.com/tc39/proposal-temporal/issues/703) - What extended ISO string representation should be used when the time zone is an offset, not an IANA name? Should the offset be in brackets?

    * [#704](https://github.com/tc39/proposal-temporal/issues/704) - Is getISOCalendarFields() needed? Or is it not needed because all calendar access is delegated through DateTime? [@ptomato](https://github.com/ptomato) may have an opinion.

    * [#716](https://github.com/tc39/proposal-temporal/issues/716) - Should Absolute.from() have an option to resolve offset vs. timezone conflicts?

    * [#741](https://github.com/tc39/proposal-temporal/issues/741) - Should Absolute.prototype.toString(timeZone) have options to omit the offset or time zone?

    * [#719](https://github.com/tc39/proposal-temporal/issues/719) - Concerns about options parameter in LocalDateTime.prototype.compare

    * [#607](https://github.com/tc39/proposal-temporal/issues/607) - Suggestion: split option name into disambiguation (for DST) vs. overflow (for ranges)

    * [#725](https://github.com/tc39/proposal-temporal/issues/725) - Crazy idea: should Temporal.now be a method that returns a LocalDateTime instance?

    * [#702](https://github.com/tc39/proposal-temporal/issues/702) - RFC 5545 vs DST questions for IETF calendar standards ("calext") group

* Execution

    * Sequencing: how to parallelize work & minimize rebase pain? Tentative suggestion:

        * 1) Negative Durations (AFAIK no dependencies)

        * 2) Changes to existing Temporal types to prepare for LocalDateTime, e.g. [#607](https://github.com/tc39/proposal-temporal/issues/607) & [#724](https://github.com/tc39/proposal-temporal/issues/724) if we decide to do those.

        * 3) LocalDateTime (AFAIK no dependencies)

        * 4) Duration Balancing method (depends on negative durations & LocalDateTime)

    * Granularity: a few big PRs?  Lots of small ones?

    * Assignment: Lots of work above. Who’s gonna do what?

* What else? Anything above we should omit?  Any other marathon meeting topics to cover in case we move faster than expected?

* Progress on main work items (time permitting):

    * Upgrade guide / comparison with other libraries

    * Shim for interoperating with other libraries' types

    * Documentation page for DST best practices

    * Finish the spec

    * Add other Intl-supported calendars (Q3/Q4?)

    * Production-quality polyfill (after Stage 3)

    * Complete test262 suite (after Stage 3)
