Jan 20, 2020

Attendees

Ujjwal Sharma (USA)
Shane Carr (SFC)
Dan Ehrenberg (DE)
Philipp Dunkel (PDL)
Philip Chimento (PFC)

Agenda:

* [#289](https://github.com/tc39/proposal-temporal/issues/289) Work out the details of the Temporal.TimeZone/Calendar interfaces
    * (continued from last week)
    * DE: We should try to draw a conclusion on string versus symbols.
    * SFC: only expressed interest in symbols in the vein of being consistent with other proposals.
    * PDL: Symbols are useful for things like iterators, but I think for Calendar, it's a different type of object, so I think symbols are not the right thing to use here.
    * DE: I don't think we have enough experience with protocols in JavaScript to know whether we should use strings or symbols.  The champions of the protocols proposal have been pushing to use more symbols.  But the status quo is that protocols today in JS use strings.
    * SFC: no strong opinion, waiting on MF for this. ACTION: Reach out. Fine to use strings, move forward with strings in case MF doesn’t reach back.
    * PDL: provisionally, once MF responds, we’re good to go.
    * DE: Mention it in a meeting since people pay more attention there anyway.
* Intl.DurationFormat effort in ECMA-402: Younies Mahmoud to propose for Stage 1 in February
    * SFC: procedural questions. Formally bring to Stage 1 in Feb. Needed to have a definition of DurationFormat in order to move ahead with this. We need DurationFormat to move Temporal ahead anyway.
    * PDL: conversation with Dan, calendars set us back and April stage 3 seems unrealistic. Be more honest and go w/ an update in Feb, last update in April and stage advancement in July.
    * SFC: concrete action items needed before stage advancement, direct function of amount of available time.
    * DE: it’s just lots of work to do, and we should be "done" a little ahead of time for better testing. We can be procedurally flexible and let this go incrementally. Going about this incrementally is okay, as long as we’ve investigated this enough to understand if there are cross-cutting issues.
    * SFC: procedurally it would be better for DurationFormat to hit stage 2 in order for Temporal to get to stage 3.
    * PDL: About when Temporal goes to Stage 3, I agree that it's just things that need to get done, but I would rather move things back in one big jump, to do this in July rather than June and later postpone again.  Part 2 is that, because of the size of the API surface, I'm a bit afraid that it will take a bit longer for people to review and get into the details that they want for Stage 3.  So I think we need at least 6 weeks between when we're done with work and the meeting where we ask for Stage 3. Month and a half of actual review time before the final stage upgrade meeting.
    * SFC: I was under the impression that we were doing weekly meetings in January exactly so that we could get the work items done before the February TC39 meeting.
    * PDL: What's changed is the availability of different parties involved.  Igalia and I don't have time any more in January or February.
* [#273](https://github.com/tc39/proposal-temporal/issues/273) Is the protocol proposed for timezones enough for this?
    * DE: not exactly an SES topic. If TimeZones are handled by calling methods on a special "TimeZone" object.
    * PDL: Richard’s concerns are unclear.
    * DE: Let’s proceed to the next item, and revisit this withRichard
* Backlog of small semantic issues: #116, #118, #119, #121, #231, #232, #233, #237, #239, #251, #260, #261 (these are all spec issues too)
    * [116](https://github.com/tc39/proposal-temporal/issues/116)
        * PDL: don’t really have a choice here. On this kind of thing, consistency will pay dividends, in this case, go with the SpeciesConstructor.
        * Conclusion: Follow existing conventions, including NewTarget for constructor and SpeciesConstructor for plus
    * 118
        * PDL: the argument that’s passed into plus (or minus, or difference), you would need the object from a method. Whether we do it via from or the internal logic, doesn’t matter.
    * 233:
        * SFC: Let's revisit with Richard, who's been advocating for these APIs
        * PDL: This introduced a redundancy. I think these are redundant, so we should remove them.
        * SFC: The JavaScripty way would be "to be redundant". MonthDay and YearMonth need the calendar information. We might not want a .from method on MonthDay depending on what we choose for calendar.
        * DE: I’d like to understand why we’d want this exact kind of redundancy.
    * [264](https://github.com/tc39/proposal-temporal/issues/264):
        * SFC: Probably one of the most important unresolved issues. Thread has changed shape. Question posted has been the most important one. According to the model, each Object should convert back and from an ISO-equivalents. YM and MD cannot uphold this, so what does this mean?
        * PDL: No sensible answer. 24th of Kislev is a different day each year (you need a year field to convert).
        * DE: having a different calendar to me is operating between different types. You don’t need interoperability.
        * PDL: no autoconversion, throw when dealing with objects of different calendars.
        * SFC: magic was good for more transparency. Throwing on mismatching calendars can solve a lot of problems. Still one question: the same code written by different people shouldn’t have different outcomes.
        * PDL: that shouldn’t be a problem here.
        * SFC: if the programmers’ calendar preference shouldn’t determine *if* the code will throw.
        * PDL: basically the same thing as a divide by zero error.
        * DE: Partial ISO is indeed softer on these concerns.
        * PDL: case in which the programmer gets the locale-based calendar, passes in the explicit yet unknown calendar choice. E.g. the user is asked for their calendar, selects a date, and the program converts it to ISO, then back to YearMonth/MonthDay and back into the user's calendar? That would throw in some calendars.
        * DE: why do you need conversions?
        * SFC: reasonable to not have withCalendar for YM and MD.
        * PDL: no automatic calendar conversions, and removing withCalendar for YM and MD (CONCLUSION).
    * #[237](https://github.com/tc39/proposal-temporal/issues/237)
        * DE: Do we want casting in .compare() and .difference() functions?
        * PDL: Now that we've said we're not going to subclass Date and DateTime, providing a default calendar, then we don't need to cast them. Imagine a scenario where we used a subclassing approach for Date, Time and DateTime. In that case, the comparison methods needed casting, but the status quo makes sure you don’t need casts anymore.
        * USA: We were going to have some sort of duck typing?
        * PDL: Doesn't seem to be necessary any longer
        * DE: There's an ergonomics question here too.
        * PDL: I'd actually prefer that it be less ergonomic to use anything other than Date/DateTime so that people are pushed towards using the real Date/DateTime classes.
        * Conclusion — no casting in .compare() and .difference().
* Meeting scheduling
    * SFC: Is everyone happy with this meeting time?
    * PDL: Would prefer Tuesday or Thursday
    * SFC: Propose Thursday same time

