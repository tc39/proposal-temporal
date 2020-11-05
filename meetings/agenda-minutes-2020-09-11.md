# Sept 11, 2020

Attendees:

Agenda:

* Remaining blockers for big features that need to land in order to freeze the spec and API

    * LocalDateTime

        * options review

            * From @ptomato review: [https://github.com/tc39/proposal-temporal/issues/569#issuecomment-686805322](https://github.com/tc39/proposal-temporal/issues/569#issuecomment-686805322)

            * We will continue discussing this on GitHub.

            * Anyone else who wants to review this should do it for next time.

            * RGN: What's the difference between "use" and "prefer"?

            * JGT: "prefer" uses the offset if correct, the time zone name otherwise.

            * PDL: "prefer" uses whichever of the offset and time zone is correct. If neither is correct, it should reject.

            * JGT: Not sure about that.

            * We will also continue discussing this on GitHub.

        * Allow optionally parsing/formatting w/o the offset? [#869](https://github.com/tc39/proposal-temporal/issues/869)

            * PDL: We should not have this. That's what DateTime and withZone is for.

            * JGT: Let's wait and see what the OP's answer is about the use case.

            * PFC: Agreed, I'm inclined not to allow this but maybe there's a good reason.

            * RGN: I see a minor use case of letting the string mirror a property bag, but I'm OK with rejecting this.

            * JGT: Let’s wait until we get feedback from the OP before rejecting this.

        * Implementer(s)?

            * PFC: Assuming the above issues can be settled, can we start adding this to the polyfill?

            * PDL: Aside from that, I think we should start splitting the polyfill out into a separate repo and making it production-ready.

        * Reviewers?

            * JGT

            * SFC will look at specific parts of the PRs.

* API/spec freeze decisions

    * Many of these can be short, i.e. is what we have working now and did we receive any feedback about it that would change our minds

    * Follow up, Absolute vs Timestamp - [#602](https://github.com/tc39/proposal-temporal/issues/602) (10 min)

        * SFC put out a poll on Twitter, but there haven't been enough responses to be statistically significant. Unscientifically, Instant and Timestamp are approximately tied and Absolute has very few.

        * JGT: Let's let the poll run for a bit longer.

        * SFC: The purpose of the poll was not so much to get an answer but to see the relative popularity among non-champions.

        * PDL: Any strong objections to Instant?

        * JGT: I'd really rather let it run for longer.

    * Should we support alternate ways of telling time - [#522](https://github.com/tc39/proposal-temporal/issues/522)

        * PDL: Any calendar where the date boundary is not at midnight, such as the Ethiopian calendar, does require this.

        * SFC: The way we have it set up is that the time calendar is easy to add in the future. Software that involves calendars, such as ICU, is mostly focused at the day level. Even if we support time calendars I think it's still useful to be able to implement a calendar that only deals with days. And furthermore I think we should stipulate that days are still 24 hours.

        * JGT: How did the example of the NYSE calendar work?

        * PDL: At Friday 5 PM it becomes Monday 9 AM.

        * SFC: So it has discontinuities.

        * PDL: You can only represent those discontinuities when you have a time calendar. Anyway, the point was that it was dropped because there were no use cases, but here are two use cases. I'd expect that date-only calendars would inherit the time part from the ISO calendar.

        * PFC: How does ICU currently implement the Ethiopian calendar, if ICU calendars are date-only?

        * We checked and it looks like ICU doesn't do anything smart here.

        * SFC: ICU has a number of known calendar bugs, this could be one of them.

        * PDL: Nonetheless, time calendars would be necessary to allow someone in Ethiopia to actually implement this correctly.

        * PFC: I'm concerned about our ability to still freeze the spec for the September TC39 meeting if we do this.

        * PDL: I think it should be possible to ask reviewers to "reserve" this area of the spec until last.

        * Discussion about plan to prioritize the spec in order to hand it over to the reviewers, and catching up the documentation and polyfill after the TC39 meeting.

        * SFC: Maybe we only need the calendar on DateTime and not Time?

        * PDL: If you do time.toDateTime(propertyBag) then you need a calendar in the property bag.

        * SFC: Either the Temporal.PlainDate has a calendar, or you pass a calendar in the property bag, or the ISO calendar is assumed, which we agreed for property bags.

        * PDL: You also can't extract from the time what the Ethiopic hour is, if the time doesn't have a calendar. And if you add a time to an Ethiopic date, then you have to shift the data model, because it's no longer an iso hour, iso minute, etc.

        * SFC: The other question is, with the Hebrew religious calendar, the days are cyclic with respect to the sun, but they are not all the same length. You need to know the date in order to know what time it is. How does that work if the time has a calendar?

        * PDL: My data model doesn't solve that. My suggestion is to add the calendar to Time, and leave it up to the calendar implementer what that means.

        * JGT: How do you handle conflicts between the time and the date?

        * PDL: Either the programmer has to translate one to the other, or you have to throw.

        * SFC: Does this have an effect on rounding?

        * PDL: I would be OK with stating that rounding is explicitly in the ISO realm, minutes are 60 seconds and hours are 60 minutes.

        * SFC: Right now if you round to the nearest hour, you can just look at the ISO fields. That works for the Ethiopic calendar if the day starts at the top of the hour. It might not work for the Hebrew religious calendar.

        * PDL: It would, because the Hebrew calendar doesn't touch the time, it just changes the time that the day number flips over.

    * Do we need to do anything in the API to convert between kinds of durations? Or just solve with docs? (10 min)

        * JGT: Docs-only seems fine

    * Any SES issues to resolve? (2 min)

        * PDL: As long as we don't leak any information about locale or local stuff except on Temporal.now, we should be fine.

    * Behaviour of date.with({...someFields, calendar}) - [#640](https://github.com/tc39/proposal-temporal/issues/640) (5 min.)

        * Consensus: keep current behaviour.

    * Comparison and equality of dates in different calendars - [#625](https://github.com/tc39/proposal-temporal/issues/625) (20 min.)

        * Status quo is that equals() and compare() are strict with regard to the calendar but don't throw.

        * PDL: compare() should throw because it's a source of hard-to-find bugs if you are able to sort dates with different calendars.

        * Consensus: Keep the status quo but add an equalsISO() method that compares the ISO slots and ignores the calendar.

    * Temporal.parse (whether to include, and if so, naming concern) - [#244](https://github.com/tc39/proposal-temporal/issues/244) (5 min.)

        * PDL: I think now that we have LocalDateTime we don't need this. It was originally proposed by MPT specifically because we didn't have a LocalDateTime type.

        * string->string parsing: Intl or Temporal?

        * Consensus: We don't need this.

        * Related: What about parsing non-canonical formats for interop? [#796](https://github.com/tc39/proposal-temporal/issues/796)

            * PDL: My opinion is not to accept the other formats, we should restrict things to ISO in parsing. You can always output the non-canonical format via legacy Date. Newer versions of HTTP (1.1 and 2.0) accept strings as ISO, as well.

            * RGN: That's not correct, the HTTP date format doesn't match the legacy Date toString format. The point about HTTP 1.1 and 2.0 is also not correct according to the spec.

            * Consensus: We won't do this for now, but will provide cookbook recipes, stay open to feedback and keep this idea as a possible follow-up proposal and small npm library.

    * Duration.prototype.compare / Duration.prototype.equals - [#608](https://github.com/tc39/proposal-temporal/issues/608) (10 min)

        * compare() is a complicated question.

        * PFC: What about having only equals() and not compare()?

        * PDL: So 60 minutes and 1 hour would be unequal? In that case you could round them relative to a reference point, with smallestUnit nanoseconds.

        * RGN: I'm not sure there's a tremendous utility in having this, but it should probably have a different name than equals(). I do see value in comparing which duration is longer, though.

        * PDL: The only way you can sensibly do that is rounding to smallestUnit nanoseconds.

        * Conclusion: roll this into the Duration rounding issue below.

    * Proposal: rounding and balancing for Duration type (replaces #789) [#856](https://github.com/tc39/proposal-temporal/issues/856)

        * PDL: Time rounding is still meaningful if relativeTo is a Temporal.PlainDate.

        * Discussion about whether relativeTo must be required even if you are rounding Temporal.Duration.from({months: 10}).round({smallestUnit: 'months'}). Conclusion: We'll adopt this behaviour but will reconsider relaxing the error for v2 if the suggestion "just add a random relativeTo" shows up on Stack Overflow due to this decision.

        * Added a compare() method as per the issue description

        * Consensus: proposal is approved with edits made during the meeting.

    * Throw on wrong singular Duration fields - [#325](https://github.com/tc39/proposal-temporal/issues/325) (5 min.)

        * Consensus: Require at least one, correctly spelled, field. Temporal.Duration.from({}), Temporal.Duration.from({millennia: 5}), Temporal.Duration.from({year: 1}), Temporal.PlainTime.from({}), etc. will all throw. Temporal.Duration.from({years: 1, hour: 1}) will not throw, we don't care about catching this case because it is more obviously wrong.

        * Will keep the more flexible behaviour for property *values* such as smallestUnit, but mark the wrong ones as 'deprecated' in TypeScript. duration.round({smallestUnit: "minutes"}) and time.round({smallestUnit:

    * Precise definition of complete format syntax, for knowing what to reject vs. ignore in `Absolute.from(string)` - [#716#issuecomment-677768469](https://github.com/tc39/proposal-temporal/issues/716#issuecomment-677768469) (10 min.)

        * Can be discussed on GitHub.

    * Status quo vs. composite fields vs. enumerable own fields - [#720](https://github.com/tc39/proposal-temporal/issues/720) (10 min.)

        * Consider turning fields back into own properties?

        * PFC: Since the last time we had this discussion, we now have calendars. Property getters are now method calls into the calendar.

        * SFC: If we do have own properties, they should be calendar dependent.

        * RGN to open an issue to discuss this.

    * Conversion methods rollup topic

        * Allowing strings in toDateTime - [#592](https://github.com/tc39/proposal-temporal/issues/592) (20 min.)

            * SFC: For types that carry calendars, I think strings make things more error-prone because you can accidentally lose the calendar information.

            * RGN: Does that apply if it's literally calling Temporal.X.from() on the string?

            * JGT: It sounds like eslint is a better way to solve this problem and we should give people the brevity that they're asking for.

            * SFC: OK. It seems there is a reasonable calendar-friendly solution that addresses my concern.

            * RGN: This applies to everywhere that an object is given?

            * PFC: We did decide explicitly to disallow strings in plus and minus earlier.

            * JGT: DE made that point, but I think things have changed now that options are not strings anymore.

            * SFC: Previous discussion: [2020-01-20](https://github.com/tc39/proposal-temporal/blob/main/meetings/agenda-minutes-2020-01-20.md)

            * RGN: Is there any place in Temporal where we only accept Temporal objects and not fields bags or strings?

            * PFC: In the relativeTo option.

            * RGN: Having a string there seems convenient but I agree with not accepting fields bags.

            * JGT: It's different from the other places, because it accepts more than one type.

            * SFC: Is it possible to define a protocol for that object rather than accepting multiple types?

            * Consensus: We'll allow strings for brevity wherever possible (where Temporal objects and fields bags are accepted). This is syntactic sugar for Temporal.X.from(string), as it is with the fields bags. We'll follow up on the relativeTo discussion in the relativeTo thread.

        * Proposal: consistent pattern for additive conversion method parameters [#889](https://github.com/tc39/proposal-temporal/issues/889)

            * SFC: What about allowing you to pass fields to with() and converting to a new type if the fields are sufficient?

            * RGN: Unknowable return types are problematic.

            * (We'll think over this suggestion.)

            * PFC: These do solve some of the problems, but on the other hand they make things more verbose.

            * RGN: Are there places where we could eliminate the multiple parameters from additive conversion methods?

            * toLocalDateTime is a separate thing, depends on the default calendar discussion.

            * JGT: Date.toLocalDateTime seems important since it will be a very common use case, so it should be possible to elide the intervening toDateTime call.

            * RGN: The problem I have with that is that we're basically inventing a nonexistent field called "time". This seems very related to #720.

            * JGT: I think the API described in #720 feels really natural.

            * RGN: But inconsistent. What if you provide both 'time' and 'hour'?

            * JGT: You throw. That's the reason we originally rejected #720, but I'm increasingly thinking that it's OK and that's the price you pay for brevity. If you need the more expressive API then you can do the long way.

        * Easier way to combine multiple Temporal objects in one `from` or `with` call? [#720](https://github.com/tc39/proposal-temporal/issues/720)

        * Conversions to/from LocalDateTime and what that implies about the mental models that Temporal supports [#887](https://github.com/tc39/proposal-temporal/issues/887)

        * Bikeshed type conversion methods - [#747](https://github.com/tc39/proposal-temporal/issues/747)

    * Balancing 24 hours / 1 day or no? - [#559](https://github.com/tc39/proposal-temporal/issues/559) (20 min.)

        * Consensus: keep the status quo; it seems like any issues raised in that thread no longer apply.

    * Default calendar - [#292](https://github.com/tc39/proposal-temporal/issues/292) (30 min.)

        * Temporal.now.calendar() ? [#873](https://github.com/tc39/proposal-temporal/issues/873)

        * [Calendar interviews](https://docs.google.com/document/d/1ZTuBbtAHv6gShFiojM7qMJt6-GCIj8JVSsRrM8xJzDI/edit#heading=h.g97xe2z5n4tv) (don't put this link in the minutes)

    * Form of calendar annotation in string (c=, ca=, brackets) - [#293](https://github.com/tc39/proposal-temporal/issues/293) (5 min.)

    * Specification of balanceConstrain algorithm (#857)

        * This probably exists but needs to be checked. PFC to add to stable API milestone

* Bikeshedding

    * *Use remaining time? Please indicate your preferred shed color on the threads beforehand.*

    * Bikeshed type conversion methods - [#747](https://github.com/tc39/proposal-temporal/issues/747)

    * Bikeshed option for LocalDateTime.toString({omit: ‘timeZone’}) - [#703](https://github.com/tc39/proposal-temporal/issues/703)

    * Bikeshed name of LocalDateTime and DateTime - [#70](https://github.com/tc39/proposal-temporal/issues/707)

* Precise definition of complete format syntax, for knowing what to reject vs. ignore in `Absolute.from(string)` - [#716#issuecomment-677768469](https://github.com/tc39/proposal-temporal/issues/716#issuecomment-677768469) (10 min.)

    * Can be discussed on GitHub.
