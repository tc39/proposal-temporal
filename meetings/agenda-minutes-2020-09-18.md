# Sept 18, 2020

## Attendees

- Ujjwal Sharma
- Philip Chimento
- Philipp Dunkel
- Shane F Carr
- Justin Grant
- Matt Johnson-Pint
- Richard Gibson

## Agenda

* Is there any other feedback from the feedback spreadsheet that we should consider incorporating? (30 min)

    * isBefore/isAfter:

        * MJP: This functionality is well-used in Moment.

        * SFC: isBefore/isAfter/isSame?

        * MJP: What about providing them only on Absolute?

        * Come back to this when we talk about equalsISO()/isSame()/whatever

        * MJP: We need a list of ideas for library authors who want to build on top of Temporal.

* Conversion methods rollup topic (30 min)

    * Make fields enumerable own data properties on instances [#917](https://github.com/tc39/proposal-temporal/issues/917)

        * PDL: JHD's argument is that we have avoided own properties in the past, because these things should be done as cleanly as possible and the prototype is the clean way to do it. However, that doesn't take object spread into account, and we should consider Temporal objects more like Records/Tuples which are spreadable.

        * SFC: Agree

        * PDL: If Records/Tuples were farther along, I'd propose to make Temporal objects actually be Records. Our argument should be that the old pattern is simply out of date.

        * JGT: Will post some ideas about a general pattern on the thread.

    * Proposal: consistent pattern for additive conversion method parameters [#889](https://github.com/tc39/proposal-temporal/issues/889)

        * JGT: This is assuming that Temporal objects do not become spreadable.

        * RGN: I don't like the invented 'time' field.

        * PFC: Less concise in some cases.

        * SFC: In general, I like named arguments. I also like the model of being able to express 'time' as a separate concept.

        * PDL: I also don't like 'time' as a separate field in the options bag because it allows for conflicts.

        * JGT: That would be a problem in with(), but not in conversion methods.

        * PDL: It adds more confusion. I'm not convinced of the benefit of this. I think it's dangerous to pass strings because you don't know what the string is.

        * RGN: What you're passing in is a Temporal object, but it might be in the form of a string or property bag.

        * PDL: What if you do date.toDateTime('2020-09-18T12:00')? The date part of the string is dropped.

        * PDL: We did call Temporal.X.from() on every entry point earlier, then we removed that. Have we addressed all the objections that there were at that time?

        * JGT: At the time, options were strings, not options bags. So there was confusion.

        * MJP: Is there a provision to provide options to the string conversion?

        * PFC: If you want something other than the default then you can call from() and pass the options.

        * PDL: I have a problem with using the toX() method's options to pass in options for from().

        * PFC: The other argument that DE made at the time was that we should be encouraging people to use strongly typed Temporal objects, instead of passing strings around in their code.

        * PDL: I don't like to say this, but in this case ergonomics should trump purity.

        * RGN: We've really gotten a lot of feedback that it's cumbersome.

        * SFC: Any comments about my comment about allowing the value to be a function?

        * PDL: I'd like to avoid that case.

        * USA: Could you just call the function instead?

        * JGT: If you passed in Temporal.now, you might not realize that there's more than one property on it, and you'd get all of them where you might not expect it.

        * Conclusion: We will do this. (Even regardless of spreadability.) With the exception of passing in a callable.

    * Easier way to combine multiple Temporal objects in one `from` or `with` call? [#720](https://github.com/tc39/proposal-temporal/issues/720)

        * JGT: This is very similar to the previous one, but for from() and with().

        * PDL: This one I don't like because unlike the previous item, this one can conflict.

        * JGT: If any conflict is possible, then the method would throw.

        * PDL: I don't think this is really necessary, because you can always just pass in the string directly.

        * JGT: This is mainly useful when assembling a LocalDateTime, because it has so many pieces.

        * PDL: You can also just spread and use the from() methods and achieve the same thing. It's sugar, but it makes things more ambiguous and is therefore bad.

        * SFC: It's a pretty big brevity improvement.

        * PDL: The brevity improvement is less if Temporal objects are spreadable, so you don't have to call getFields(), and you can just pass the string.

        * JGT: You can't pass a string to with().

        * PDL: I'd propose to have `dateTime.with('00:00:00')`. It would convert into a Time because it would fail to convert into a DateTime or Date. Same for `dateTime.with('1970-01-01')`. We do that elsewhere as well.

        * PFC: We only do that in relativeTo, currently.

        * RGN: I wonder if we should have withTime() as a restricted form of with() and similar.

        * JGT: Not in favour. LocalDateTime is order-dependent. It's safer, when you're making multiple changes, to make them in one with() call.

        * RGN: I agree, but I don't understand the multiple changes use case. When do I have a LocalDateTime and want to change the date and the time?

        * JGT: Start of the month would be a use case. Set the day of the month to 1 and the time to midnight.

        * RGN: In that case you couldn't pass a string anyway.

        * PDL: That's why I don't see the point of this.

        * MJP: The whole point of with() was to avoid having a more specific API for each field (???)

        * (Note-taker's browser crashed)

        * PDL: I'm fine with allowing a string but not `time: string`

        * SFC: (paraphrasing) there's a calendar concern if the strings bring in different calendars.

        * MJP: Many other calendars might not even use Arabic numerals in their strings.

        * SFC: That's exactly why we say that strings are always ISO.

        * JGT: Even without strings, you actually get the calendar property if you spread a Temporal.PlainDate.

        * Could we have a null calendar on Time?

        * Could we have a calendar on DateTime but not Time?

        * Could we backpedal and ignore calendar in with() and go back to withCalendar()?

        * JGT: Is there a reason to have Time not carry a calendar?

        * PDL: Strongly disagree.

        * RGN: The motivation for suggesting this is now solved in a different way.

        * USA: time.withCalendar('ethiopic') needs to shift the time by 6 hours.

        * SFC: Time really needs to have a calendar in order to be able to express calendars where time is measured in different hour/minute/second lengths.

        * JGT: Duration wouldn't support that.

        * SFC: You could have the calendar accept some other units in the arithmetic methods.

        * RGN: If we're this close to supporting it, we may as well go the whole way.

        * JGT: Problematic case is `hebrewDateTime.with({ day: 10, time: timeInstance })`, where the `day` is interpreted in the calendar of timeInstance.

        * PDL: Is that just a case of sloppy programming?

        * PFC: Should the Time instance's calendar only be used to interpret the Time fields and the Date instance's calendar only be used to interpret the Date fields?

        * JGT: If we find a solution to this, then I'm on board with leaving the data model of Time as it was.

        * SFC: My preferred resolution is to keep Time as is, encourage separate options, and otherwise encourage separate with() calls.

        * PDL: I still don't agree with the original proposal, because of the potential for conflicts with `time` and time fields, and `date` as date fields.

        * JGT: I'm OK with dropping the original proposal, the only change would be adding the acceptance of a string to with(), where we work our way backwards from most comprehensive type to least comprehensive type.

        * Discussion about whether date+time+time zone with no offset is a well-formed ISO string.

        * **Decision**: Add a withTimeZone() method to LocalDateTime.

        * **Decision**: Data model of Time stays as-is (plan of record is for it to gain a calendar.)

        * **Decision**: timeZone and calendar control _interpretation_ of `with` input, but don’t "infect" the output (e.g., `ldt.with({ hour: 0, timeZone: "Etc/UTC" }).hour` is probably not 0)

        * **Decision**: with() accepts a string, which is subject to the same parsing as `relativeTo`: LocalDateTime, Absolute?, DateTime, Date, Time, YearMonth, MonthDay (subject to proposed clarification by JGT).

        * **Decision**: The interpretation of ISO strings as well-formed is consistent throughout the methods (from(), with(), ...) although we are not agreed on whether '2020-09-18T14:26[America/New_York]' is well-formed.

    * Bikeshed type conversion methods - [#747](https://github.com/tc39/proposal-temporal/issues/747)

        * Resolved by decisions above in [#889](https://github.com/tc39/proposal-temporal/issues/889)

    * Conversions to/from LocalDateTime and what that implies about the mental models that Temporal supports [#887](https://github.com/tc39/proposal-temporal/issues/887)

* Default calendar - [#292](https://github.com/tc39/proposal-temporal/issues/292) (20 min.)

    * Given that there is no way to achieve perfection for everyone's constraints on this topic, we'll accept the most recent proposal put forward by SFC on the thread. With the amendment that Temporal.now.date() and friends require the calendar argument, instead of being removed or taking the environment calendar.

    * PDL: Add a static property Temporal.Calendar.iso8601, Temporal.Calendar.japanese, ...

    * RGN: I disagree, use `.from('iso8601')`, `.from('japanese`)`...

    * PDL: I would at least like an easy-access single instance of the ISO calendar.

    * SFC: Temporal.calendars.iso?

    * RGN: That exposes SES concerns as to which calendars are available on the host. And you would have to do more work to override from().

    * SFC: Intl.calendars.iso? Open a new thread for this discussion?

    * PDL: No, it's fine. We don't need singleton calendars.

    * [Calendar interviews](https://docs.google.com/document/d/1ZTuBbtAHv6gShFiojM7qMJt6-GCIj8JVSsRrM8xJzDI/edit#heading=h.g97xe2z5n4tv) (don't put this link in the minutes)

* Bikeshedding (20 min)

    * Bikeshed name of LocalDateTime and DateTime - [#707](https://github.com/tc39/proposal-temporal/issues/707)

        * We'll do another Twitter poll. JGT and SFC to work offline to determine a good set of poll options.

        * JGT: I'm primarily concerned that it's a pair, of renaming LocalDateTime and DateTime.

        * SFC: I'm primarily concerned with not accidentally using the wrong calendar.

        * PDL: I'm primarily concerned with consistency, so if we rename DateTime then we have to rename Date and Time, and possibly YearMonth and MonthDay.

        * RGN: I think the Twitter poll can be rationalized by breaking it up. If we poll for the name of LocalDateTime, where DateTime is one of the options. Then, we poll for the name of what is currently called DateTime.

* Remaining small issues (20 min) ([list](https://github.com/tc39/proposal-temporal/milestone/5))

    * Temporal.now.calendar() ? [#873](https://github.com/tc39/proposal-temporal/issues/873)

        * Decision: We won't have this, for the reasons described in #292. It can be added later.

    * calendar.id vs. timeZone.name [#920](https://github.com/tc39/proposal-temporal/issues/920)

        * Decision: Change both to 'id'

    * Truncating toString decimal output ([#329](https://github.com/tc39/proposal-temporal/issues/329))

        * JGT - should default be truncated or trailing zeroes?  (which is better for DBMS sorting of LDT?)

        * No proposal on the table at the moment. Some discussion about whether it's better to allow arbitrary precision. Discuss on GitHub, and mention in the slides that this is unresolved.

    * Legacy Date conversion methods ([#515](https://github.com/tc39/proposal-temporal/issues/515))

        * PDL: The committee has shot down other attempts to make changes to legacy Date.

        * PFC: This seems different than changing the way that legacy Date works.

        * RGN: I'm in favour of trying it.

        * Decision: We will have this, named toTemporalInstant().

    * Rounding in Absolute.getEpochSeconds()? ([#858](https://github.com/tc39/proposal-temporal/issues/858))

        * Decision: keep the status quo. getEpochMilliseconds() has to truncate anyway, because bigints don't have a fractional part, so to be consistent we should truncate in getEpochSeconds and getEpochMilliseconds.

    * `era` isn't implemented in ISO calendar. Expected? ([#901](https://github.com/tc39/proposal-temporal/issues/901))

        * JGT: Either 'era' should do something on ISO-calendar, or

        * SFC: The ISO calendar should not write 'era' to the output of getFields.

        * Decision: We remove 'era' from getFields() output.

    * Should `difference`'s default largestUnit be more consistent across types? [#919](https://github.com/tc39/proposal-temporal/issues/919)

        * SFC: We did intentionally pick the defaults for each of these types.

        * JGT: The remaining question is why would DateTime have 'days' and not 'hours'?

        * PDL: It uses a 24 hour clock so it's possible to have days.

        * SFC: We'd rather have LocalDateTime have days, but that's not possible for well-known reasons.

        * Decision: keep the status quo.

* Revisit from yesterday, time permitting

    * Comparison of LocalDateTime instances in different timezones (and maybe different calendars too)  [#912](https://github.com/tc39/proposal-temporal/issues/912) / [#625](https://github.com/tc39/proposal-temporal/issues/625)

        * Decision: No equalsISO(), no isSame(), no isBefore()/isAfter(). We would consider adding these in a V2.

        * Decision: Add Duration.prototype.isZero().

    * Bikeshed option for LocalDateTime.toString({omit: ‘timeZone’}) - [#703](https://github.com/tc39/proposal-temporal/issues/703)

        * We agreed yesterday that we want to have this option but not on the form of it.

        * SFC: Taking the same options from Intl.DateTimeFormat (year, month, day, hour, minute, second, fractionalSecondDigits) would solve the toString precision problem as well.

        * No proposal on the table at the moment. PDL to come up with one.
