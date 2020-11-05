Jan 13, 2019

Attendees

Ms2ger (MS2)
Philip Chimento (PFC)
Philipp Dunkel (PDL)
Richard Gibson (RGN)
Shane Carr (SFC)
Dan Ehrenberg (DE)
Maggie Pint (MPT)

Agenda:

* Introductions
    * Ptomato joining the effort
* Issues:
    * Default calendar? [#292](https://github.com/tc39/proposal-temporal/issues/292)
        * Supporting table: [#309](https://github.com/tc39/proposal-temporal/pull/309)
        * DE: The default calendar would be purely region-based, not taking into account OS preferences
        * SFC: I don't want to default to the user's implicit default calendar anyway; lots of i18n experts think it's not optimal either
        * DE: What do people think of partial ISO?
        * PDL: I think it'd be really confusing
        * SFC: None of the options are perfect. Let's make sure the table reflects all the pros and cons accurately. This might be more of a TC39 level decision, and we can come up with a recommendation.
        * DE: We can come up with a recommendation but as the champion group we should have an answer prepared.
        * PDL: Agreed.
        * SFC: What are the next steps to move this forward to agreement within the champions group?
        * DE: Prototyping different versions might be too heavyweight. The cookbook might be good here.
        * PDL: I have other things on my plate, so I won't be able to prototype this before February.
        * DE: Could we write code samples?
        * PDL: Action item: Let's try to get some code samples into this issue for next week.
        * SFC: We can start with the cookbook code and make versions for each of the default calendar options.
        * MPT: Is there a link for the cookbook? ([#305](https://github.com/tc39/proposal-temporal/pull/305))
        * DE: Do you know if Jason was still planning on working on this?
        * PDL: I think his idea was that he wanted to check in the PR, and address the comments people left.  I'll check in with him tomorrow.
        * Action item: MPT to review the cookbook pull request.
        * Action item: SFC to make the changes for each of the default calendar options, after the cookbook code is checked in.
        * Action item: PDL to ping JNW to land/complete cookbook
    * [#291](https://github.com/tc39/proposal-temporal/issues/291) Move calendar-specific getters off of Temporal.PlainDateTime.prototype?
        * Related: [#290](https://github.com/tc39/proposal-temporal/issues/290) Should we have calendar-specific internal slots?
        * SFC: There are properties such as dayOfWeek, isLeapYear that call into the calendar code, the question is to move them into a sub-object so that calendars that don't have those properties can
        * PDL: Have them not as properties on the DateTime object at all but as methods of the calendar where you can inquire given a Date or a DateTime?
        * SFC: That's one option
        * PDL: Is it the right understanding that you would have subtypes of e.g. year with a number plus a string era, whereas other years might be a pure number?
        * SFC: Yes, or the alternative would be to have a superset of all possible properties.
        * DE:
        * SFC: With PDL's design calendars are immutable, the state is stored in DateTime. So the calendar can't just add a new property into the DateTime object.
        * PDL: We need to group these things into two groups: 1) things that a calendar can calculate, for those, you can just ask the calendar. 2) I understand there are also things such as an era, that some calendars require, but not all. Is it possible to have a complete superset on DateTime objects that cover all calendars, or not? If so, we can just have some undefineds in there
        * DE: Issue 291 is about calculated properties.
        * SFC: Issue 290 is about the slots or non-computed data.
        * DE: We are trying to do this in an object-oriented way.
        * (PDL leaves)
        * SFC:
        * DE: We're already supporting all the calendars we know about; I'm worried it would be less ergonomic to go to the calendar for this.
        * SFC: I'm in favour of the computed properties being calendar-specific, dayOfWeek etc, so that each calendar can give its own computed properties.
        * DE: When you call e.g. the dayOfWeek getter would it invoke the calendar?
        * SFC: One way is for it to compute all the properties at once and give a JS object that's immutable
        * DE: Since the calendar is subclassable it could make it difficult to optimize if there's a whole separate object that's created when it's constructed; maybe better if it's lazy
        * MPT: Why hang it off the DateTime and not the Calendar?
        * SFC: Since the calendar doesn't know the date, you'd have to pass the DateTime back into it.
        * MPT: A static Calendar method such as Calendar.isLeapYear(Date) wouldn't be bad.
        * DE: We want to have one Calendar class (issue 300)
        * DE: I also don't see a problem with date.calendar.isLeapYear(date)
        * Action item: SFC: I'll think about that more and post a few ideas on these threads.
    * [#289](https://github.com/tc39/proposal-temporal/issues/289) Work out the details of the Temporal.TimeZone/Calendar interfaces
        * [#300](https://github.com/tc39/proposal-temporal/issues/300) Any issues with this plan for Temporal.TimeZone and Temporal.PlainDateTime?
        * [#310](https://github.com/tc39/proposal-temporal/issues/310) Symbols or strings for the interface methods?
        * DE: My idea was to have Temporal.TimeZone and Temporal.Calendar be classes with one identity, but also to have internal slots, i.e. you have a built-in single implementation that you can have other implementations for. How do you feel about going ahead with this?
        * SFC: Would you extend Temporal.Calendar?
        * DE: You could, but you could also just make another object with the same methods (protocol).
        * SFC: What does 402 do?
        * DE: 402 would patch the internal methods inside of Temporal.Calendar.
        * SFC: What's the advantage of Calendar being a protocol?
        * DE: Having lots of different classes adds a lot of complexity. We also have to think about the identity of the instances now that Calendar is monkey-patchable. I think it would be good for DateTime to have its own Calendar instance.
        * SFC: Another option could be to have the calendars be raw objects and no identity at all.
        * DE: Custom calendars could be raw objects, but I don't see an advantage of the built-in calendars being raw objects. If all the methods live on the prototype, then that helps objects be smaller.
        * SFC: You said the calendar should be constructible, but how is that possible if 402 is monkey patching the methods for e.g. the Hebrew calendar?
        * DE: In 262 you pass a string in that's always "iso" and in 402 more strings are allowed.
        * SFC: This is sounding reasonable
        * DE: Other ideas?
        * SFC: I was thinking the calendars could be global immutable objects that could share a prototype with the base calendar. But maybe it's better to construct a new Calendar each time so that changing the calendar in one DateTime doesn't affect another DateTime?
        * DE: Every time we try to make a built-in immutable thing we run into SES objections.
        * SFC: I'm fine with issue 300
        * MPT: I'm fine with constructing a new calendar each time, but I'm struggling to find a use case for when you mutate the calendar the old objects should stay the same.
        * DE: We need a well defined lifetime for the calendar, either they all change or they never change.
        * SFC: You don't want to download some module from NPM that hacks all your bitcoins
        * DE:
        * RGN: It gets complex quickly
        * SFC: Financial calendars that act like Gregorian but calculate the week differently
        * SFC: How do you subclass the Hebrew calendar?
        * DE: Call the superclass constructor with the correct calendar in the constructor
        * (MS2 leaves)
        * MPT: We prefer 'from' over constructors
        * (January 20 continuation)
        * DE: We should try to draw a conclusion on string versus symbols.
        * SFC: only expressed interest in symbols in the vein of being consistent with other proposals.
        * PDL: Symbols are useful for things like iterators, but I think for Calendar, it's a different type of object, so I think symbols are not the right thing to use here.
        * DE: I don't think we have enough experience with protocols in JavaScript to know whether we should use strings or symbols.  The champions of the protocols proposal have been pushing to use more symbols.  But the status quo is that protocols today in JS use strings.
        * SFC: no strong opinion, waiting on MF for this. ACTION: Reach out. Fine to use strings, move forward with strings in case MF doesn’t reach back.
        * PDL: provisionally, once MF responds, we’re good to go.
        * DE: Mention it in a meeting since people pay more attention there anyway.
    * Intl.DurationFormat effort in ECMA-402: Younies Mahmoud to propose for Stage 1 in February
    * Do we have disambiguation parameters? Was this deleted from the polyfill on purpose or by accident?
    * [#273](https://github.com/tc39/proposal-temporal/issues/273) Is the protocol proposed for timezones enough for this?
* Work items:
    * Polyfill
        * Implement [calendar/timezone protocol](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-draft.md) + [#300](https://github.com/tc39/proposal-temporal/issues/300)
        * Backlog of small semantic issues: #116, #118, #119, #121, #231, #232, #233, #237, #239, #251, #260, #261 (these are all spec issues too)
        * Temporal.parse method: Ujjwal has on his plate, but he's a bit busy and open to help
    * Spec text
        * Specify [calendar/timezone protocol](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-draft.md) + [#300](https://github.com/tc39/proposal-temporal/issues/300)
        * Audit polyfill and spec text for doing the same thing
        * File for a new TAG review when this is all done
    * Documentation
        * Cookbook: Jason
        * Introductory article: Tara
        * Reference documentation: Ptomato + others?
        * Cross-language/library comparison (optional) #105
    * Tests
        * Test262 harness and conversion: Ms2ger
        * Review the project for test coverage and correctness: Owner??
* Timeline:
    * Aim to finish all tasks by the early February TC39 meeting
    * Propose for Stage 3 in early April TC39 meeting
        * Hope is that this will be aligned with Intl.DurationFormat for Stage 2
    * Are we on track for this goal?

