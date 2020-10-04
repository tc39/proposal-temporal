# Sep 17, 2020

**Attendees:**

Shane Carr (SFC)

Ujjwal Sharma (USA)

Richard Gibson (RGN)

Philip Chimento (PFC)

Jason Williams (JSW)

Matt Johnson Pint (MJP)

Justin Grant (JGT)

**Agenda:**

* Scheduling

    * We will announce at the September meeting that we've made all the design decisions, and that freezing the proposal is a few weeks away. Hopefully mid-October, we'll do another press cycle and release of the polyfill, and give the proposal to reviewers, giving them two months plus a bit more to take many people's winter holidays into account. Then we will ask for Stage 3 in January.

    * SFC: I am a bit concerned that developers won't have enough time to test-drive LocalDateTime.

    * DE: Stage 3 is aspirational; in the end if we get feedback that there is a serious problem with LocalDateTime, then we would need to change it.

* LocalDateTime

    * Comparison of LocalDateTime instances in different timezones (and maybe different calendars too)  [#912](https://github.com/tc39/proposal-temporal/issues/912)

        * PDL: I'd be strict and drop the equalsISO. It's something that we did as a convenience, it's not so necessary.

        * JGT: If we remove them all from Date and DateTime, then sure, but this isn't worth breaking consistency over.

        * PDL: Yes, let's remove it from the other types.

        * SFC: Could we name it equalsFuzzy()?

        * RGN: I think that "are these two instances the same moment" is a very useful thing to do concisely.

        * MJP: NodaTime has comparer objects: [https://nodatime.org/3.0.x/api/NodaTime.ZonedDateTime.Comparer.html](https://nodatime.org/3.0.x/api/NodaTime.ZonedDateTime.Comparer.html) They throw an exception when the calendars are different.

        * PDL: I like the idea of externalizing this complexity.

        * PFC: I think the two common cases will be equals() and "same instant" equality. I think it's OK to have a method for the latter, named something like sameInstant().

        * PDL: I'd rather remove equals().

        * JGT/MJP: equals() method with an options bag?

        * Continue discussion on GitHub and/or come back later

    * "use" vs “prefer” (10 min) [#569](https://github.com/tc39/proposal-temporal/issues/569#issuecomment-686805322)

        * PFC: My questions on this are answered.

        * RGN: I haven't had a chance to read the response yet, but I agree that the two cases mentioned in the issue are important cases. I think another case is changing the time zone or calendar while preserving the instant. I think that case is at odds with the others, due to the default value.

        * JGT: The default is 'reject'

        * RGN: Oh, then that solves my problem.

        * MJP: The way Moment does it is to pass a boolean option for keeping the time zone the same.

        * JGT: That doesn't cover the use case of parsing a string where the time zone offset is no longer valid. We chose 'reject' as the default because it's something that should be brought to the programmer's attention, and whatever other value we chose would be wrong for someone's valid use case.

        * MJP: Do we offer an isValid() or some such check before making these decisions?

        * JGT: The validity check is on the way in, instances are always valid.

        * Provisionally resolved, pending RGN's review.

    * Allow optionally parsing/formatting w/o the offset? (5 min) [#869](https://github.com/tc39/proposal-temporal/issues/869) (reject unless we get feedback from OP?)

        * JGT: The OP did give feedback a few hours ago.

        * MJP: This is a use case that happens in scheduling systems, but usually they're separate fields. He's asking for combined fields.

        * PDL: The correct way to do this is to parse it into a DateTime, and add the time zone to get to LocalDateTime. I don't want to pave the cowpath of "do a string concatenation, and then parse it".

        * MJP: I've never seen any other system use the bracketed time zone without the offset.

        * JGT: Java throws an exception if you do that.

        * Consensus: Reject this for now, it can always be added later if there is a standardized string format.

        * JGT will ask the JSCalendar folks if there are any plans for such a format.

    * Bikeshed option for LocalDateTime.toString({omit: ‘timeZone’}) - [#703](https://github.com/tc39/proposal-temporal/issues/703)

        * Some recapping of "+04:00[+04:00]"

        * Does LocalDateTime add a lot of value in the case where you need to store to a database offset-datetime type?

        * MJP: I think somehow you will need to be able to roundtrip a date-time-offset string.

        * PDL: You can do Absolute.from() and TimeZone.from() on that string, and then absolute.toString(timeZone).

        * MJP: How do you do that when you parse JSON?

        * PFC: You need to write it in your reviver function anyway.

        * USA: Is this a use case for a parse functionality?

        * Do we agree that there should be an option to omit these things in toString()?

        * MJP: Yes, although it may be better to call it "include" for consistency with Intl.DateTimeFormat. Include everything if you don't pass an options bag, but include nothing by default

        * JWS: It's good to align with prior art, but it seems less intuitive to me.

        * JGT: Anecdotally, I ran into that behaviour of Intl myself a few days ago and I was confused.

        * PDL: Me too.

        * MJP: Me too, that's why I know about it.

        * PDL: I think an options bag could open support for alternate-form ISO strings in the future such as week-number dates or ordinal dates.

        * MJP: I think Intl's behaviour is surprising, but inconsistency is even more surprising.

        * JGT: I think there's a use case for controlling the format that comes out, but I think it's a secondary use case for omitting things as described in this issue. Does the "omit" proposal work?

        * PDL/MJP: No, an options bag is good, but the form should be discussed further.

        * SFC: As long as the default is to include the time zone and calendar.

* Follow up, Instant vs. Timestamp - [#602](https://github.com/tc39/proposal-temporal/issues/602) (5 min) - see if more poll results come in, then decide

    * Over 250 votes on the poll!

    * JGT: We should mention both Instant and timestamp in the docs, but Instant is a good name.

    * SFC: The only reason for me to prefer Instant is that it's the same name in other libraries, but I think that's a strong reason.

    * PFC: This is one of the few places where it makes sense to have a popularity contest.

    * Consensus: Rename to Temporal.Instant.

* Should we support alternate ways of telling time (?? min) - [#522](https://github.com/tc39/proposal-temporal/issues/522)

    * MJP: Strongly against this. It gets into the concept of timekeeping systems, whereas we currently support UTC as the timekeeping system. You don't want to introduce TAI, Mars time, etc. I'm not familiar with the Ethiopian calendar, but I'll read the link.

    * PDL: Agreed, we don't want to introduce TAI etc. This is just adding the ability to the calendar to control when the date flips over.

    * SFC: The status quo is that Temporal.Calendar wouldn't support the Ethiopian calendar.

    * MJP: OK, as long as we don't add an axis for alternate timekeeping systems.

* Form of calendar annotation in string (c=, ca=, brackets) - [#293](https://github.com/tc39/proposal-temporal/issues/293) (5 min.)

    * SFC: I'm in contact with several different groups about standardizing this in RFC 3339. The reception so far has been positive.

    * Proposal is that we do include this in strings if it is not ISO, contingent upon standardization. We'll keep using the status quo, [c=] for the time being, until

    * MJP: When we show an offset, the date and time are in that offset. When we show a calendar, the date and time aren't in that calendar. That's contradictory.

    * PDL: That's why they're in the brackets.

* Should field properties be enumerable? Why can’t Temporal objects have own-property (spreadable) fields? [#917](https://github.com/tc39/proposal-temporal/issues/917) (rehash of [#403](https://github.com/tc39/proposal-temporal/issues/403 ))

    * Our top customer complaint is re: brevity, and ...date is more ergonomic and discoverable than ...date.getFields().

    * USA: We already discussed it in the plenary and it would be strange to rehash this.

    * PDL: The feedback from the plenary was abundantly clear that these should not be own data properties.

    * JGT: I think we should try to document the decision better.

    * USA: The rationale was that this is not something that exists elsewhere in 262.

    * RGN: I'm not aware of any other record-like classes in 262.

    * USA: Things like DateTime are more than just record-like. But consider Error, which is conceptually a collection of properties. It has its properties on the prototype.

    * RGN: I believe Error.message is an own data property.

    * PDL: Adding to this, everything else in ES predates spreading. If spreading had been part of the language earlier, there might be more examples of this. But the feedback we got from the plenary was adamant.

    * PFC: I'd be happy to go with this if the plenary decided otherwise, but I'm not comfortable arguing for it myself. I think the improvement in ergonomics is marginal, since I didn't need to use getFields() at all when writing the cookbook.

    * Consensus is to bring it up in the plenary again, with the new information that it helps ergonomics and brevity. RGN is maybe most in the position to make this argument in the plenary.
