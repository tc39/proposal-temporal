Sept 4, 2020

Attendees:

Justin Grant

Ujjwal Sharma

Philipp Dunkel

Richard Gibson

Philip Chimento

Agenda:

* Bikeshed threads (30 min total? Please indicate your preferred shed color on the threads beforehand)

    * Bikeshed largestUnit vs largestField - [#533](https://github.com/tc39/proposal-temporal/issues/533)

        * largestUnit

    * Bikeshed getISOCalendarFields - [#630](https://github.com/tc39/proposal-temporal/issues/630)

        * Proposals:

            * Keep it as a method (but rename fields to isoYear, etc), named getISOCalendarFields(), getRawFields(), or getISOFields()

            * Make the method name into a symbol

            * A static method on Temporal.Calendar

        * SFC: The main choice is, either make the method easy to use for power users, or hide it using some language feature.

        * getISOFields

    * Bikeshed Absolute vs Timestamp - [#602](https://github.com/tc39/proposal-temporal/issues/602)

        * PFC: 3, Timestamp > Instant/Absolute

        * SFC: Timestamp ≫ Instant > Absolute

            * By the end of this conversation, my preferences have changed to:

            * Timestamp > Instant ≫ Absolute

        * PDL: Absolute > Instant ≫ Timestamp

        * USA: Absolute, Instant, Timestamp

        * RGN: 1.5, Instant ≳ Timestamp  ≫  Absolute

        * JGT: 3, Timestamp/Instant ≫ Absolute

        * Instant is the choice that doesn't elicit strong negative feelings for anyone, either in the champions group or from the feedback we received. We'll let this sit for a week.

    * Bikeshed type conversion methods - [#747](https://github.com/tc39/proposal-temporal/issues/747)

        * Principles to resolve issues with MonthDay and YearMonth? [#874](https://github.com/tc39/proposal-temporal/issues/874)

            * 1. We don't degrade the usability of the rest of Temporal just to make something work with MonthDay and YearMonth.

            * 2. It's OK to make people drop into Date to do some operation that isn't well-defined on MonthDay and YearMonth.

            * JGT to add to the issue and close it.

        * Continue discussing on #747

    * Bikeshed plus/minus vs add/subtract - [#770](https://github.com/tc39/proposal-temporal/issues/770)

        * add/subtract

    * Bikeshed option for LocalDateTime.toString({omit: ‘timeZone’}) - [#703](https://github.com/tc39/proposal-temporal/issues/703)

        * Defer until next time

    * Bikeshed name of LocalDateTime and DateTime - [#707](https://github.com/tc39/proposal-temporal/issues/707)

        * PDL: I agree, but we disagree on how to achieve them.

        * JGT: What about Local vs Abstract?

* Remaining blockers for big features that need to land in order to freeze the spec and API

    * Rounding

        * Implementation progress

            * In progress, resolving the below issue would unblock this.

        * Allowed rounding increments ([#827 comment](https://github.com/tc39/proposal-temporal/issues/827#issuecomment-686052579))

            * Keep as-is, with e.g. 60 minutes not allowed

            * PFC to review the proposal text in the issue and check that it is up to date with the implementation

        * Reviewers?

    * LocalDateTime

        * Discuss next time.

* Remaining small discussion items needing resolution before freezing

    * Remove time zone parameter from Absolute.toString? - [#741](https://github.com/tc39/proposal-temporal/issues/741) (10 min)

        * Yes, but with a timeZone option in an options bag, instead of an optional argument.

    * Discuss the rest next time.

* What decisions need to be reviewed in light of the feedback in order to freeze the API and spec? (Many of these can be short, i.e. is what we have working now and did we receive any feedback about it that would change our minds)

    * Letting the non-ISO calendar 'win' in toLocaleString - [#262](https://github.com/tc39/proposal-temporal/issues/262) (5 min.)

        * For YearMonth and MonthDay, avoid throwing by doing ym.toLocaleString(..., { calendar: ym.calendar })

    * Default calendar - [#292](https://github.com/tc39/proposal-temporal/issues/292) (30 min.)

        * Idea is to have a separate meeting for this. Some discussion happened after this meeting.

    * Discuss the rest next time.

* Review feedback (1 hour? Use remaining time)

    * Discuss next time.
