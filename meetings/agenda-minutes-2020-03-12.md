Mar 12, 2020

Attendees:

* Richard Gibson (RGN)
* Philip Chimento (PFC)
* Shane Carr (SFC)

Agenda:

* [#408](https://github.com/tc39/proposal-temporal/issues/408) Any comments on proposed Duration.minus there?
    * PFC summarizes the issue.
    * SFC: Over the past few weeks we've gone back and forth on whether to balance 24 hours into one day. Most recently we landed on "yes".
    * RGN: If you add a day to a DateTime, then you can end up with a different  Because we have a case where 1 day and 24 hours are not the same, we should not balance hours into days anywhere.
    * SFC: They are the same, but the types on which you are doing arithmetic interpret them differently. 1 hour in DateTime means you turn the hour hand of a clock 60 minutes in one direction, and in Absolute it means 60 minutes on the timeline.
    * PFC: I agree, that's not particular to balancing hours into days, even adding only 1 hour to an Absolute and to a DateTime are different operations and can result in different times.
    * RGN: It really comes down to, do Absolutes have a concept of days, if so, then we should document that they are always 24 hours.
    * Exploratory discussion on what Duration.minus actually means and what disambiguation modes apply.
    * RGN: I think in no case should short.minus(long) succeed.
    * SFC: I think that if fields are balanced into other fields then it should be called "balance". If we need to add balance to the disambiguation modes here even though we don't have it for other arithmetic methods, then we should.
    * PFC: There are two kinds of balancing here, balancing negative fields, and balancing e.g. 100 minutes into 1 hour 40 minutes.
    * RGN: "Necessary balance" and "optional balance"? Is there ever a situation where you would not want "necessary balance"?
    * PFC: I don't think there is.
    * SFC: We might consider adding an extra disambiguation mode, "balance-constrain" or something like that.
    * RGN: It would be useful to add a decision table in the issue, that shows what happens in each mode for a number of subtractions.
    * RGN: We should also have an explainer in the docs directory.
    * Action: PFC to write the decision table and explainer.
* [#244](https://github.com/tc39/proposal-temporal/issues/244) Combined Parsing Convenience Method.
    * SFC: Before December, I was in favour of getters, but after seeing Shu's presentation about regexes I'm in favour of data properties, since optimizations can be done under the hood anyway.
    * SFC: The only fields you need anyway are DateTime and TimeZone, the others you can derive from those two. Can we only return those two types?
    * PFC: I'm not sure of the use case of this method, so I don't know if that would be sufficient.
    * SFC: I think it would be fine, since any of the other types are just one method call away.
    * PFC: If we do that, then data properties makes sense, because you're no longer returning fields with overlapping information.
    * SFC: We should see if this covers Maggie's use case and if so, do it.
    * SFC: I'd also rather the name be Temporal.parseISOString() because Temporal.parse() sounds like Date.parse() which supports all kinds of weird formats.
* [#425](https://github.com/tc39/proposal-temporal/pull/425) PR: Adding initial calendar-subclass.md explainer
    * SFC walks everyone through the markdown document.
    * PFC: I hadn't read through it yet. I'll have to read the enumerable properties section more carefully to understand it, but my impression is that the calendar approach is better in all the cases listed here except the MonthDay issue.
    * SFC: The subclassing approach allows every calendar to pick its own data model which is useful in some cases, but the calendar approach requires a single data model, and if we can get a data model that works for all the cases then the calendar approach is more accessible. If we can't figure out a data model then subclassing is the more likely approach.
* [#415](https://github.com/tc39/proposal-temporal/issues/415) Accept invalid ISO strings if invalid parts are irrelevant (e.g. Date.from('2020-03-02T99:99'))?
    * Deferred until PDL is in the meeting. In the meantime we can comment in the issue.

