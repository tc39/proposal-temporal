July 9, 2020

Attendees:

* Ujjwal Sharma (USA)

* Philip Chimento (PFC)

* Shane Carr (SFC)

* Richard Gibson (RGN)

* Justin Grant (JGT)

* Philipp Dunkel (PDL)

* Daniel Ehrenerg (DE)

* Bradley Farias (BFS)

Agenda:

* Update on incoming survey results (short)

    * PFC: We have 2 responses so far. One of them talks about negative durations and the other was about localize timezone names.

    * USA: shouldn’t that be done using DisplayNames?

    * SFC: they should already be able to do it through .toLocaleString

    * JGT: Can we open issues on the issue trackers of Moment and date-fns?

    * DE: We can ask MPT. PFC has also written a short text to send to the editors of JS newsletters.

    * USA: ???

    * Action: JGT will open a ticket with date-fns, PFC will send the text first

* [#692](https://github.com/tc39/proposal-temporal/issues/692)/[#693](https://github.com/tc39/proposal-temporal/pull/693#issuecomment-647858712) Can we fix ECMA-402 GetOption? (short)

    * USA: If it's a normative change, we can submit a PR and have it discussed.

    * SFC: The way to proceed is to make a PR to ECMA-402.

    * Action: JGT to send the PR.

* Goals for July TC39 meeting (short)

    * USA: Deadline for submitting agenda items is tomorrow. We have requested 15 minutes for a status update. The goal was to announce that we have frozen the API but I'm not sure we have enough feedback collected for that.

    * PFC: We have had 2 survey responses and one person commenting on the issue tracker. I'm not sure that's enough to say with confidence that we have the right API, but on the other hand I haven't been through this process before, so I would be interested in other opinions.

    * ??? (dropped from call)

* [#559](https://github.com/tc39/proposal-temporal/issues/559)/[#686](https://github.com/tc39/proposal-temporal/issues/686) "3 kinds of durations" discussion

    * JGT: ???

    * PFC: There was a bug in the business open cookbook example.

    * RGN: What does the wrong code look like?

    * PFC: I'll find the commit. [https://github.com/tc39/proposal-temporal/commit/750a946a105ccb2623138ea6afd7391f6d8c707a#diff-3da5b323f4f398fa6cdf36d9c62b205e](https://github.com/tc39/proposal-temporal/commit/750a946a105ccb2623138ea6afd7391f6d8c707a#diff-3da5b323f4f398fa6cdf36d9c62b205e)

    * JGT: It's too easy to take a duration that results from Absolute.difference and use it in DateTime arithmetic, or a duration from DateTime.difference and use it in Absolute arithmetic.

    * PDL: I'm not opposed to this.

    * RGN: The explanation and the example have made this clearer, thanks.

    * PDL: I can see four kinds of durations here: Absolute, DateTime, Date-only, and Time-only. If you have to create the duration type explicitly, then that would solve the problem. On the other hand, where we're coming from is the convenience of property bags, e.g. plus({months: 1}). Those two approaches are in opposition. Do we still find the latter desirable?

    * RGN: I would add the question, is there any existing library for JS that handles this well?

    * JGT: Three options (see GitHub comment ...); (1) leave things as they are but provide some helpers, e.g. an option to all math methods telling how the duration should be interpreted; (2) strongly typed durations as PDL mentioned; (3) fix the meaning, say "Temporal.Duration means X", and provide examples.

        * Disadvantage of the math option is that once you have established that a duration is of a certain type, you keep having to tell the API.

        * Could add a time zone-aware type such as ZonedAbsolute with a correct default.

        * Property bags would be assumed to have the correct type unless they were specifically specified otherwise. This preserves ergonomics, since property bags are really handy.

    * SFC: My preference is option 3 and define durations according to RFC 5545.

    * JGT: I think defining them as anything else (3a, 3b) would lead to a dealbreaker (see issue)

    * USA: I did have something in mind close to 3b, where we define durations as DateTime durations, and use only delta nanoseconds for Absolute arithmetic. I would have to investigate whether that has the fatal flaw you mentioned.

    * JGT: That also sounds close to option 2, where the Absolute duration type is a scalar bigint instead of a class.

    * SFC: To elaborate on option 3, a few months ago we had a conversation on how durations relate to calendar systems. Does P1M mean one month in the Gregorian or Hebrew calendar? Basically the duration's meaning is dependent on the context of the date that it's added to. However, we have now seen that this approach can cause software bugs. So, if we are moving away from having durations be defined by their contexts, one other option could be to do option 3 with RFC 5545 durations, but give it a time zone and calendar slot. You still have to interpret it in the context though, because the length of P1M depends on the starting date. That's why we had originally decided not to put the calendar in the duration.

    * PFC: I like USA's idea of using delta nanoseconds for Absolute durations since it is a low-friction way to get this strong typing. I also like the RFC 5545 approach since it is at least unambiguous and although the behaviour may still be surprising it seems like it mostly aligns with programmers' expectations, so hopefully the surprises will be few.

    * SFC: We can also make sure we throw exceptions when doing arithmetic with a type that is unexpected for that kind of duration.

    * JGT: The developer experience of delta nanoseconds does seem worse though. If you want a one-hour warning before the shop closes then you need to turn that hour into nanoseconds.

    * USA: I understand that, but I also think it's valuable for developers to know that they have to convert between these values.

    * JGT: I also think it's difficult to split out the hours from days in a duration like P2DT2H.

    * USA: I think we should have a static method on Duration to convert Duration objects to delta nanoseconds and vice versa.

    * PDL: The only reservation I have is that if we want to keep property bags working, then strong typing is pointless. No-one will use the strong types if a property bag is available.

    * JGT: Unless the property bag is required to have information about the type.

    * PDL: But at that point it runs counter to what we intended. Therefore I think if we go that route we should go fully with AbsoluteDuration.from(propertyBag).

    * RGN: The more I think about it, the more I like paving the cowpath that iCal/RFC 5545 has already established. It's a compelling position to be conveniently compatible with it. If we need to add things to that, then those are the things that can have cumbersome APIs.

    * We will tentatively move forward with RFC 5545 durations.
