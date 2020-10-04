Aug 28, 2020

Attendees:

Ujjwal Sharma (USA)

Justin Grant (JGT)

Shane Carr (SFC)

Richard Gibson (RGN)

Philip Chimento (PFC)

Philipp Dunkel (PDL)

Agenda:

* [#827](https://github.com/tc39/proposal-temporal/issues/827) Proposal: Rounding method (and rounding for `difference` and `toString`) for non-Duration types (60 min) - Let's discuss this first and see if we can reach consensus based on people's reviews in the issue thread. If not, move down.

    * Decision: smallestUnit is restricted to 'days' and smaller, so Date and YearMonth do not get a round() method. Lack of compelling use case, lack of clear approach, and it's possible to add it in the future if either of those two things change.

    * SFC: Concerns about rounding on Absolute, how do you know what a whole hour is, when the time zone may be a half-hour time zone?

    * RGN: A use case for rounding Absolute to larger increments than 1 minute is log partitioning.

    * SFC: A use case for rounding to a number of seconds that doesn't divide into a minute, is partitioning a day into 100 equal parts of 864 seconds each.

    * Decision: smallestUnit in Absolute.round() is restricted to 'minutes' and smaller, and the reference point for roundingIncrement is epoch time 0. roundingIncrement must divide evenly into 86400 seconds.

    * Decision: For non-Duration types, rounding modes 'floor' and 'trunc' act the same, always rounding towards the big bang rather than an arbitrary 0 point such as year 0. Year 0 depends on the calendar.

    * Decision: The options bag is a required argument in round() (not difference()), and smallestUnit is required in it. obj.round() returning a clone of the object would be harmless, but probably never what is intended.

    * Decision: Include rounding in difference().

    * Decision: Don't include rounding in toString(), move that discussion to issue #329.

    * Decision: Don't include rounding in toLocaleString().

    * Decision: In LocalDateTime.round({smallestUnit: 'hour', roundingIncrement: 3}) on a non-24-hour DST day, round to 00:00, 03:00, 06:00 etc according to the clock time, not to actual 3-hour periods.

* [#856](https://github.com/tc39/proposal-temporal/issues/856) Proposal: rounding and balancing for Duration type (replaces #789)

    * Decision: Don't include rounding in Duration.toString().

    * Decision: overflow: 'balance' | 'constrain', no 'reject'. We should review the name of this option throughout the other Duration methods separately.

    * Decision: relativeTo accepts LocalDateTime, DateTime, and Date. If not present (undefined), or a DateTime, then days are treated as 24 hours long.

    * Decision: If relativeTo is absent, then largestUnit is restricted to 'days' and smaller.

    * SFC: When we first added weeks, we decided to make it calendar-dependent because there were historical calendars (none in common use) where a week was not 7 days. At the time we didn't have a good use case for defaulting to 7 days. Now with Duration rounding, we do; the use case is the ability to round to weeks without a calendar.

    * Decision: Include rounding options in Duration.plus() and Duration.minus().

* What big features need to land in order to freeze the API and spec? (5 min; objective is to have a list, not hash out all the open questions with these features)

    * Negative durations

    * LocalDateTime

    * Rounding

    * Not included: Additional calendars, but these do need to be implemented before Stage 3

    * (For smaller issues, see below)

* What decisions need to be made in order to move to a PR for LocalDateTime?

    * The thorny issue of whether to accept strings with no IANA name - [#703](https://github.com/tc39/proposal-temporal/issues/703) (30 min). If we can't agree on this, can we agree to do it provisionally one way or the other and revisit it before November, as with the default calendar?

        * PDL and  JGT will discuss this separately.

    * [#706](https://github.com/tc39/proposal-temporal/issues/706) - is there anything left to resolve here?

        * SFC posted a comment saying that the original concerns have been addressed.

    * [#702](https://github.com/tc39/proposal-temporal/issues/702) - Need to finalize the algorithm for plus/minus & difference on LocalDateTime. Main open issues are how to handle ambiguity at the border between date duration and time duration.  (JSCalendar folks proposed solutions; JGT is reviewing)

        * Finalize the algorithm for difference with JSCalendar folks

        * Not really a blocker for starting the implementation of LocalDateTime.

    * Bikeshed the name - will do below, in the bikeshed section

    * Are customizable disambiguation options needed?  Or should all disambiguation be 'compatible' like iCalendar/JSCalendar/RFC5545 uses?

        * Not needed for DST. 'compatible' only.

    * Do a final review of options in each method. Can any options be removed?

        * Everyone interested should do this individually.

* What decisions need to be made in order to move to a PR for rounding? (20 min)

    * Need to resolve open issues in Non-Duration-type rounding ([#827](https://github.com/tc39/proposal-temporal/issues/827))

    * Need review & resolve issues in Duration-type rounding ([#856](https://github.com/tc39/proposal-temporal/issues/856))

* What smaller issues need to land, in order to freeze the API and spec?

    * Rename option to overflow - [#607](https://github.com/tc39/proposal-temporal/issues/607) - already has consensus (2 min)

    * [#810](https://github.com/tc39/proposal-temporal/issues/810) Stop taking objects in `TimeZone.from` and `Calendar.from`. - already has consensus (2 min)

        * RGN: Given the current state, this makes sense, because any object with a conforming interface is as valid as an instance.

    * [#802](https://github.com/tc39/proposal-temporal/issues/802) Limit `Absolute` math to hours or smaller units (no days)? (10 min)

        * SFC: It makes sense to remove days (and weeks) from Absolute math, since we now have LocalDateTime.

        * Proposal:

            1. Limit largestUnit in Absolute.prototype.difference to `hours` or less

                * SFC: There are solid use cases: for example, the number of hours between two log events.  "This log event occurred 36 hours after this other log event."

                * PDL: If we allow largestUnit: "hours", we should also have fromEpochHours and getEpochHours.

            2. Add fromEpochMinutes and getEpochMinutes

                * SFC: This is OK, but it seems unnecessary.

            3. Add fromEpochHours and getEpochHours

                * SFC: Talking about epoch hours is misleading because time zones have different starting points, and hours do not align with each other. This is the same line of reasoning as disallowing smallestUnit: "hours" in Absolute.prototype.round.

        * Separate discussion: add rounding to getEpochXxx methods (specific rounding options [https://github.com/tc39/proposal-temporal/issues/858](https://github.com/tc39/proposal-temporal/issues/858))

        * Previous discussion about Absolute difference in days: [https://github.com/tc39/proposal-temporal/blob/main/meetings/agenda-minutes-2020-02-27.md](https://github.com/tc39/proposal-temporal/blob/main/meetings/agenda-minutes-2020-02-27.md)

        * Decision: Adopt 1, reject 2 and 3.
