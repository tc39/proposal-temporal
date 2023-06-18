Mar 26, 2020

Attendees:

Ujjwal Sharma (USA)
Philipp Dunkel (PDL)
Philip Chimento (PFC)
Ms2ger (MS2)
Shane F. Carr (SFC)
Richard Gibson (RGN)

Agenda:

* [#428](https://github.com/tc39/proposal-temporal/issues/428) Design of parsing methods
    * USA: KG (bakkot) was happy with the interim conclusion that we discussed last time. He was wondering what the less common use case is that we mentioned.
    * PDL: one of the use cases are for supporting future dates where the time zone has changed in between when the date was stored and when it is retrieved. For example, where the time zone changes by law.
    * Action - PDL to weigh in on the thread and explain the use case
* [#449](https://github.com/tc39/proposal-temporal/issues/449) Drop support for environments that don't support Symbols
    * USA: On further reflection not only Symbols but all shims. There has been some work done in this direction. Removing could speed up development time. The intention would be to add them back in later, when the polyfill is more complete, and we want to make it more suitable for production.
    * PDL: I’d be happy with the idea of dropping all shims altogether. I think that for the polyfill we are more likely to be successful by helping the core-js people write a polyfill for Temporal, than maintaining our own polyfill in perpetuity.
    * PFC: I'm happy either way. It makes the code easier and we're not shipping something that we don't test, but I don't think it speeds up development time.
    * PDL: With shims our API can never be precisely correct, anyway.
    * RGN: It comes down to what the purpose is of the polyfill. It's for experimentation, not production. So not shimming Symbols should be fine. BigInt is not in a published version of the ES spec but it has been merged into the draft. It seems to me it doesn't need to be shimmed, but it needs to be shimmable, so let's only use the BigInt constructor and not the literals. If someone needs to experiment with the polyfill and doesn't have an environment that supports BigInt, then they can look for a shim themselves.
    * Consensus: agree with RGN.
* Next steps for calendar
    * [#391](https://github.com/tc39/proposal-temporal/issues/391) Verify data model liked by PFC and SFC
        * SFC: The proposal is to use isoYear, isoMonth, isoDay slots inside YearMonth and MonthDay in order to accommodate months that are shorter than ISO months, and the calendar interprets them as needed. This seems like a clean design if no-one objects to the fact that these objects carry an extra slot that isn't relevant for the ISO calendar.
        * MS2: It doesn't make sense to convert "January 1" to some other calendar system. I fail to see the use case for the extra slot.
        * SFC: YearMonth and MonthDay don't have calendar conversion methods, you can only get YearMonth and MonthDay in a different calendar by calling getYearMonth or getMonthDay on a Date in a different calendar.
        * PFC: I agree that this is the cleanest option that's been proposed so far.
        * MS2: Can you construct e.g. a YearMonth in a different calendar from a property bag with from()?
        * SFC: Yes, it would delegate to the calendar's yearMonthFromFields method, which would interpret the year and month as being indexed in its own calendar system, and spits out a YearMonth with the correct ISO slots. It would possibly be necessary to add another argument to the constructor, discussed below.
    * [#354](https://github.com/tc39/proposal-temporal/issues/354) How is data passed into the calendar methods?
        * SFC: while talking about the Data Model, we realized that userland calendars still need a way to access these internal slots. Taking a simple example that supposes which added accessors for the slots. In that case, when you call plus on Temporal.Calendar and that Calendar can needs to access the slots, it uses the accessors and returns the appropriate values. Another option is to pass an option bag with the three fields in it instead of the Temporal.PlainDate object. The third option allows you to hide the slots further would be to add an accessor called "raw" which allows you to convert the object into a record. A closely related question: what to do when the data goes out again? Does it return a new Date? In which case, all the slots need to be on the constructor. If not, we can just make functions return object bags and trans
        * PFC: I like option 2 because it exposes as little as possible in the public API, and using constructors for the return values.
        * SFC: If we use constructors for the return values, we would have to pass the ISO year to MonthDay or the ISO day to YearMonth somehow.
        * USA: What is the objection to exposing things on the public API?
        * RGN: Can we take a step back and examine the current philosophy of constructor vs. from()?
        * USA: The idea is that the constructor is a mapping from arguments to slots, with the only additional processing being validation. For anything "magical" you have to use from().
        * RGN: Do we require all arguments to be present?
        * PFC: Currently not.
        * RGN: I think that's fine, there is an obvious default for "seconds", for example.
        * SFC: We could allow defaulting by reordering arguments, e.g. YearMonth(isoYear, isoMonth, calendar = ..., isoDay = 1) and MonthDay(isoMonth, isoDay, calendar = ..., isoYear = 2000), which is a leap year.
        * RGN: It's always valid to be strict and require everything, it can always be relaxed later on. But you'd have to have the arguments in the right order. The above sounds reasonable.
        * PFC: I think we could make the intent of those arguments clearer by naming them ref(Iso)Year and ref(Iso)Day.
        * Conclusion: consensus on the constructor behaviour, please continue posting thoughts on the issue about the rest.
* [#469](https://github.com/tc39/proposal-temporal/pull/469) Drop support for passing ISO Duration strings to plus()/minus()?
    * RGN: Is there an issue with strings?
    * MS2: We've been dropping support for strings from other methods, so this is consistent.
    * USA: ISO Duration strings aren't very readable, it makes code more readable to use property bags or Duration objects.
    * PFC: Once you understand ISO Duration strings it's convenient to use them, but I think not many people will do that. I could go either way.
    * RGN: I also find it convenient. It doesn't seem JavaScript-y to get in the way of that. Ultimately I'd regret the loss, but I'd get over it, so no strong opinion.
    * SFC: I don't remember why we dropped string support from other methods, but I agree with Richard. It can always be relaxed later if strings throw TypeError.
    * RGN: Whether it can be relaxed later depends on how it's implemented. It would have to be reading fields off an object if the argument is an object and otherwise throw.
    * MS2: That's how it's implemented.
