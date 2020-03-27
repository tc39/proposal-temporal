How to take notes in this document:

* Find the current meeting at the top
* Take notes inline in the agenda
* Try to capture things thoroughly so we can retrace who said what (important when there are disagreements)

Current schedule: weekly on Thursdays 8:45am America/Los_Angeles. 

-----

Apr 2, 2020

Attendees:

Agenda:

* [#387](https://github.com/tc39/proposal-temporal/issues/387) species
* Next steps for calendar
    * [#354](https://github.com/tc39/proposal-temporal/issues/354) How is data passed into the calendar methods?
    * [#357](https://github.com/tc39/proposal-temporal/issues/357) Should Temporal.Duration have a [[Calendar]] slot?
* Volunteers to finish / review stalled pull requests
    * [#302](https://github.com/tc39/proposal-temporal/pull/302) what's the correct license for the repo?
    * [#334](https://github.com/tc39/proposal-temporal/pull/334) needs rebase, consider DE's comment about shorter snippets
    * [#400](https://github.com/tc39/proposal-temporal/pull/400) needs rebase, a few comments to consider
    * [#404](https://github.com/tc39/proposal-temporal/pull/404) needs review, depends on outcome of #428 discussion
    * [#409](https://github.com/tc39/proposal-temporal/pull/409) needs rebase, a few comments to consider
    * [#418](https://github.com/tc39/proposal-temporal/pull/418) needs review
* Can we consolidate chat channels?

-----

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
        * SFC: while talking about the Data Model, we realized that userland calendars still need a way to access these internal slots. Taking a simple example that supposes which added accessors for the slots. In that case, when you call plus on Temporal.Calendar and that Calendar can needs to access the slots, it uses the accessors and returns the appropriate values. Another option is to pass an option bag with the three fields in it instead of the Temporal.Date object. The third option allows you to hide the slots further would be to add an accessor called "raw" which allows you to convert the object into a record. A closely related question: what to do when the data goes out again? Does it return a new Date? In which case, all the slots need to be on the constructor. If not, we can just make functions return object bags and trans
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
    * RGN: I also find it convenient. It doesn't seem Javascript-y to get in the way of that. Ultimately I'd regret the loss, but I'd get over it, so no strong opinion.
    * SFC: I don't remember why we dropped string support from other methods, but I agree with Richard. It can always be relaxed later if strings throw TypeError.
    * RGN: Whether it can be relaxed later depends on how it's implemented. It would have to be reading fields off an object if the argument is an object and otherwise throw.
    * MS2: That's how it's implemented.

-----

Mar 19, 2020

Attendees:

Ujjwal Sharma (USA)

Philipp Dunkel (PDL)

Philip Chimento (PFC)

Jase Williams (JWS)

Shane F. Carr (SFC)

Agenda:

* [#415](https://github.com/tc39/proposal-temporal/issues/415)/[#428](https://github.com/tc39/proposal-temporal/issues/428) Accept invalid ISO strings if invalid parts are irrelevant (e.g. Date.from('2020-03-02T99:99'))?
    * PDL: last comment was from Shane asking what to do if IANA and the offset don’t match? If you do an Absolute which requires an IANA timezone and an offset, it’ll throw because it’s invalid, but if you parse it with a DateTime, it works because it ignores everything else. We don’t want to validate stuff that is ignored. It would make no sense for Date.parse to fail for the invalid Time component. I can parse stuff individually and check for myself. 24 hours should fail for Time, DateTime but not Date.
    * PFC: I see your point, but it seems to me that you should get the same date out of the same ISO string no matter in what context you parse it. For an ISO string with hour 24 meaning the next day, Temporal.DateTime.parse(string).getDate() should not return a different Temporal.Date than Temporal.Date.parse(string).
    * PDL: I disagree because that attitude got us into this Date mess to begin with. I need an easy way to be able to do the correct thing. If you’re taking into account the Time part when parsing a Date, you’re not doing the correct thing. If I do an Absolute.parse, it should throw on an invalid TimeZone, but it shouldn’t be the case when parsing DateTime. By default, I’d encourage people to parse into an Absolute.
    * USA: Bakkot proposed that we throw on any extraneous part in the ISO string.
    * PDL: I can live with that, as long as we have *some* method to extract a given component from a larger ISO String.
    * USA: I can live with that, I’ll check back with Bakkot if they agree too.
    * PDL: Can we get consensus for that?
    * PFC: The less common use-case is fulfilled by this, but I’m not quite sure about the more common use-case.
    * PDL: The more common use case would be fulfilled by using Absolute.parse and projecting into the type that you need.
    * PFC: Absolute.parse may fail if you are parsing a time that is in the future, and the time zone changes before then.
    * PFC: I’d like to think about it more. It does seem more plausible now.
    * PDL: My biggest concerns are consistency and correctness. The actual specifics matter less.
    * PFC: My concern is that when you feed in an ISO string, you should never get out any other result than what ISO would specify for that string.
    * PDL: We can revisit this later.	
    * PFC: Apart from this discussion, I believe the code originally described in #415 is a bug.
    * PDL: the IANA timezone and offset should match, let’s fix that bug.
* [#408](https://github.com/tc39/proposal-temporal/issues/408) Duration.minus, necessary and optional balance
    * PDL: Duration was just a property bag for a long time, so we need to think this through. I do expect to run into these kinds of issues by making it a type. I’d suggest you go with your instinct.
    * PFC: Feedback is appreciated on the table / pull request.
    * SFC: I couldn't think of anything for the cell marked "Nothing sensible to constrain to, throw?" I'm fine adding disambiguation modes, although should it be consistent with "reject", "balance", "constrain"? It doesn't seem right to call any of these modes "constrain".
    * PDL: We already have different disambiguation terms ("earlier" and "later") for time zone disambiguation, so it doesn't need to be consistent.
    * PFC: I can't think of any use case for reject, though we could add it for completeness, but I think we should come up with more concise names than "necessary balance" and "optional balance".
* [#244](https://github.com/tc39/proposal-temporal/issues/244) Do we still want Temporal.parse?
    * Deferred to next week while we figure out how this interacts with redesigning the parsing methods ([#428](https://github.com/tc39/proposal-temporal/issues/428)).
* [#452](https://github.com/tc39/proposal-temporal/issues/452) How to format Durations
    * SFC: This is being handled in a separate ECMA 402 proposal, Intl.DurationFormat.
    * USA: So how should we work accordingly?
    * PDL: I would proposing leaving the spec stuff to Intl.DurationFormat and just polyfilling the spec inside the Temporal polyfill.
    * USA: Okay, I’ll do that.
* Sidenote: Why do we have years and months in Durations?
    * PFC: This was discussed recently, please check notes from a few weeks ago. There are real use cases for them, but this is why we don't balance days into months and years.
    * PDL goes over the use cases.
* Volunteers to finish / review stalled pull requests
    * Everyone please take a look at these, we'll discuss next week if there are any left.
* Next steps for calendar
    * Deferred to next week.
* Can we consolidate chat channels?
    * Deferred to next week.

-----

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

-----

Mar 5, 2020

Attendees:

* Ujjwal Sharma (USA)
* Shane Carr (SFC)
* Philipp Dunkel (PDL)
* Philip Chimento (PFC)
* Jase Williams (JWS)

Agenda:

* [#403](https://github.com/tc39/proposal-temporal/issues/403) Should field properties be enumerable?
    * We haven't made a decision yet about this and ran out of time last week during the discussion.
    * SFC: The remark I made last week but didn't add to the comment thread was that enumerability fits with the concept of making these types "glorified structs".
    * SFC: Which properties should be enumerable? What about additional properties added by calendars, such as "era"?
    * Decision: Core properties are enumerable, and calendars can add additional enumerable properties.
    * JWS: Do they now have to be own properties?
    * PDL: My understanding is making them enumerable for Object.assign also requires making them show up in Object.keys, and that means they have to be own properties.
    * SFC: It sounds like we can answer this question editorially as part of the issue.
    * PDL: Let's flag that as something to check back with the committee on, because deviating from what ES generally does will be something that the committee will want to have input on.
    * SFC: Let's ask at the March meeting.
    * PDL: I booked 15 minutes at the March meeting, maybe I should increase that. JWS and I will be there in person.
    * SFC: I'm local, so I'll be there. I'd recommend 45 or 60 minutes. Let's make a label for needs-plenary-input.
* [#324](https://github.com/tc39/proposal-temporal/issues/324) Behaviour when adding units too large or small for the type (e.g. date.plus({hours:24}))
    * PDL: Under the assumption that duration units always balanced, it made sense to me to throw if there were invalid units present.
    * PFC: I agree, but if we can have e.g. hours > 24, then it seems inconsistent to me (time.plus(P2D) throws vs time.plus(PT48H) doesn't)
    * JWS: Is that how it works now?
    * PFC: Yes
    * SFC: PDL has pointed out before that durations can be data driven, so it might not be good to throw in the presence of invalid units at all.
    * PDL: The difference between then and now is that you previously couldn't have unbalanced durations. So I would actually say now let's depart from that, throwing with invalid units is the desirable behaviour.
    * SFC: There are three options listed in the issue. Throw, ignore, or convert to in-range?
    * PDL: If some duration fields can be undefined rather than 0, then we can have Date arithmetic create durations that are valid for Date, Time arithmetic create durations that are valid for Time, etc., and throw. If on the other hand we say a duration is a duration, then we can ignore the fields.
    * SFC: We can make balance the default, would your opinion change then? The only time when you need to balance is when you're doing arithmetic on a Date and trying to add a duration which has hours or smaller.
    * JWS: If I saw this API for the first time I wouldn't expect time.plus(P2D) to throw.
    * SFC: I think we agree on Time, but the question is e.g. Date.from(2020-01-31).plus(PT48H)
    * PDL: This is what I was referring to.
    * SFC: I'm suggesting that in Date arithmetic, we first balance the lower units into days if possible, and then do the arithmetic.
    * PDL: Agreed
    * PFC: Agreed, although in other places we avoid balancing hours into days.
    * SFC: I thought we changed that.
    * PDL: Straw poll, does anyone have strong opinions on what we pick?
    * PFC: I care that we don't throw and I care that we don't ignore the user's intention.
    * JWS: Agreed
    * Consensus: we pick SFC's solution, which he writes out in the issue.
    * PDL: There's always a way to get the different behaviour if that's what you want, by Object.assign()ing the duration, which is why I'm relaxed about this.
* Jordan's follow up to [#231](https://github.com/tc39/proposal-temporal/issues/231) (someDate.with(someYearMonth) use internal slots?)
    * PFC: The follow up to our decision not to use internal slots for with(), from Jordan, was date.with(yearMonth).
    * PDL: I think we should use Get in the case of date.with(yearMonth), because the use case has always been passing in a plain JS object, usually an object literal. This goes with the question about enumerability, because that's most like a plain object literal.
    * JWS: Is there a use case?
    * PDL: There's no use case for date.with(date), but there is for date.with(yearMonth) or date.with(monthDay), though I'm not sure how useful or frequent it is.
    * Consensus: we are OK with using Get.
    * Action: PDL to respond on the issue.
* [#407](https://github.com/tc39/proposal-temporal/issues/407) Remove DateTime arithmetic?
    * SFC summarizes the discussion from last week
    * PDL: The rationale is that Temporal allows you to do both. If you want to make sure DST boundaries are respected, then you convert to Absolute and add/subtract the Duration. DateTime itself is agnostic of time zone, adding/subtracting is literally moving the hands on the clock and removing/adding calendar leaves.
    * SFC: That's understood, but DateTime arithmetic could be likely to be misused.
    * PDL: I see it as our job beyond stage 3 to promote this mental model so that users understand it. Whatever we do, it will be misused simply because dates and times are complicated.
    * SFC: If we start with a more conservative API surface, we can always add it later once we identify what the use cases are. It's not clear what the use case is for DateTime arithmetic.
    * PDL: If you are just storing dates/times then you don't need Temporal. This is the whole point of Temporal.
    * JWS: What's the common misuse that you see happening with DateTime arithmetic?
    * SFC: I can't think of a use case where it's correct to do the DateTime arithmetic instead of the Absolute arithmetic. I'm not even sure about the DateTime type, maybe we should start there.
    * PDL: Putting a future time in an Absolute can actually be wrong. If you want to schedule a meeting for the first of every month at 3 PM, then you cannot store that as an absolute, because the time zone may change.
    * SFC: You could do that with a Time and a series of Dates.
    * PDL: Let's schedule the TC39 March meeting on March 31 at 10 AM. But we don't yet know who's going to host it, so we don't know the time zone.
    * SFC: Would we be open to using a pair of Date/Time for that use case instead of a DateTime type?
    * PDL: We did consider it way back when, and therefore I wouldn't consider it now. Happy to go through the reasons, but I think it's OK to have an API that reflects how people think.
    * USA: In the process of looking at removing the arithmetic methods I did find a use case for DateTime arithmetic already in the code base.
    * PFC: Can you describe the use case more? I think the question was not "people might misuse this", but that we could not think of a use case last week that was not more correctly done with Absolute arithmetic.
    * PDL: You have a meeting this Monday at 3 PM and you need to move it three days ahead, same time. You want it to be the same time even if there's a DST change.
    * SFC: I see. I still think this is easy to misuse, but I agree.
    * PDL: I agree it's easy to misuse. It's our job to write the explainers.
    * PFC: Let's change the issue to make sure the difference between DateTime arithmetic and Absolute arithmetic is explained in the reference docs.
    * USA: Close the issue and start a new one?
    * Action: SFC creating a new issue.
* PDL: Send me and JWS anything relevant that you think should go into the March update.
* JWS: Once we know what we want to talk about we'll also have a better idea of how long our section should be.

-----

Feb 27, 2020

Attendees:

* Ujjwal Sharma (USA)
* Shane Carr (SFC)
* Philip Chimento (PFC)
* Ms2ger (MS2)
* Richard Gibson (RGN)

Agenda:

* [#401](https://github.com/tc39/proposal-temporal/pull/401) Any objections to breaking roundtripping for this case?
    * PFC: *Explains the issue*
    * SFC: (looks up syntax in 8601). LGTM
* [#24](https://github.com/tc39/proposal-temporal/issues/24#issuecomment-589898896) Any objections to the proposed range for each type?
    * SFC: What are we putting limits on?
    * PFC: The maximum values allowed to be represented by each type.  For example, it ends up being about 270 thousand years before and after 1970.
    * SFC: LGTM
* [#307](https://github.com/tc39/proposal-temporal/issues/307#issuecomment-588567138) Any objections to merging this now?
    * Default cutoff of hours instead of seconds for Absolute.difference()?
    * SFC: Is it an antipattern to allow DateTime.difference, since the result will not take any DST changes into account? Should we require converting to Absolute to take the difference?
    * PFC: Good question. I guess if your difference is in days or higher it'll be correct, though hours might be wrong
    * SFC: You can convert to Absolute in that case.
    * RGN: I can see dropping difference() or even plus and minus from DateTime
    * RGN: If you convert DateTime to Absolute in UTC, then how do you get a difference in days? Absolute doesn't support difference in days.
    * SFC: It seems we should allow days difference in Absolute after all
    * RGN: What's the use case that would require a difference that includes years/months and hours and seconds?
    * We can't think of one presently, that wouldn't be covered by years/months/days (Date.difference) or days/hours/minutes/seconds (Absolute.difference).
    * SFC: You can take both the Absolute difference and the Date difference and combine them, and in that case the programmer owns the inaccuracy instead of the library.
    * Consensus: merge this PR and open another issue ([#407](https://github.com/tc39/proposal-temporal/issues/407)) to remove DateTime.{plus, minus, difference} so that others can weigh in.
* Should Duration throw in 'balance' disambiguation mode if the total duration after balancing is still negative? E.g. {hours: 1, minutes: -90}.
    * PFC: Am I understanding the Duration type correctly that negative Durations are never allowed?
    * SFC: Yes, if this is possible then it's a bug.
    * SFC: What about {hours: 1, minutes: -30}? (or -20)?
    * PFC: It flips the sign.
    * SFC: Slightly odd but okay.
    * RGN: Does Duration support arithmetic?
    * PFC: No.
    * RGN: It seems like we'd want to support arithmetic and disallow any negative values at all as input. Duration.from(durationObj) should not be less powerful than Duration.from(propertyBag). If you want {hours: 1, minutes: -30} then you should use arithmetic methods.
    * PFC: Duration.difference doesn't seem useful but I can see plus and minus for this use case, now that we're moving disambiguation out of the constructor.
    * SFC: Would it be bad to clamp or take the absolute value in this balance case?
    * RGN: I think that would result in undetected bugs.
    * PFC: Constrain mode would no longer do anything, so we should remove it and pick a different default.
    * MS2: It could become a synonym for reject.
    * PFC: Or it could constrain infinity to Number.MAX_VALUE or something like that, but I don't know if that's a good idea.
    * SFC: We might pick a lower limit or not bother constraining, because adding Number.MAX_VALUE to any other type would exceed the limits of that type.
    * RGN: You might as well allow any integer, because otherwise the limit is arbitrary and hard to explain. You could say the limit is the difference between min Absolute and max Absolute, that's not MAX_VALUE but it's well past MAX_SAFE_INTEGER, and kind of arbitrary where it lands.
    * Summary: Change Duration.from to never allow negative values as input in fields, and add plus() and minus() methods. Open issue for this ([#408](https://github.com/tc39/proposal-temporal/issues/408))
* [#231](https://github.com/tc39/proposal-temporal/issues/231) Do we actually want to use internal slots in with(), plus(), minus()?
    * If yes, only internal slots of the type itself, or of other Temporal types too?
    * PFC: Passing DateTime.with(Date)
    * MS2: You could do DateTime.getTime().withDate(Date) in that case.
    * PFC: Close this for now?
    * MS2: OK.
    * SFC: No strong opinion.
* [#403](https://github.com/tc39/proposal-temporal/issues/403) Should field properties be enumerable?
    * RGN: Seems like it would be useful. It maps to the mental model of these types being like records.
    * MS2: This is something we could ask TC39 for advice on.
    * MS2 included a link in the thread showing that e.g. length and name are not enumerable.
    * RGN: "Unless otherwise specified."
    * SFC: If we have a reason, we can make them enumerable, and I think there may be a reason here. These types could be considered a "glorified struct" so it makes sense for them to be enumerable. We are saying there's an equivalence between a Temporal object and a plain object with the same fields as the Temporal object.

-----

Feb 20, 2020

Attendees:

	Shane Carr (SFC)

	Jase Williams (JWS)

	Maggie Pint (MPT)

	Richard Gibson (RGN)

	Jeff Walden (JSW)

	Philip Chimento (PFC)

	Philipp Dunkel (PDL)

	Daniel Ehrenberg (DE)

Agenda:

* [#310](https://github.com/tc39/proposal-temporal/issues/310) Symbols or strings post-TC39 follow-up
    * SFC: Discussed in last 10 minutes of TC39. Summarizing, the sentiment there was that calendars are the primary identity of the object, unlike e.g. iterators where you add Symbol.iterator to another object. Two other alternatives, Richard's suggestion of adding Temporal compatibility to an already existing object, and have a Temporal API object with string methods that is accessible by a Symbol (like Symbol.iterator has a next() method)
    * JWS: Sounds like it's in line with precdent.
    * MPT: Is the value proposition of chaining it off of a Symbol, encapsulation?
    * SFC: Indeed, avoiding conflicts with other properties with conflicting names.
    * JWS: Any personal preference?
    * SFC: Wrapping it in a Symbol seems to be unnecessary complexity.
    * Consensus on string methods.
* [#344](https://github.com/tc39/proposal-temporal/issues/344) Subtracting months in 'balance' disambiguation mode
    * Keep same behaviour? Change subtraction to subtract the number of days in current month? Throw if 'balance' is used when adding/subtracting months?
        * PFC: Surprising behaviour when subtracting months while balancing. Is this a case of "you get what you ask for" or is it a sign that our balancing algorithm needs to be different?
        * MPT: I'd like to read the issue for a few minutes.
        * JWS: Where do the names "constrain", "balance", and "reject" come from?
        * SFC: Discussion between PDL, RGN, and myself.
        * MPT: Constrain is what users expect the behaviour to be, in my experience.
        * PDL: You get 31 March - 1 month = 3 March because you manipulate one unit at a time. Balance is an abomination, so if you ask for it you get it.
        * JWS: What's the use case for balance?
        * PDL: JavaScript Date compatibility, that's all.
        * SFC: There are other use cases, like adding 30 days.
        * PDL: Adding 30 days always counts 30 days on your calendar, regardless of disambiguation.
        * PFC: That's what I noted in the thread.
        * MPT: Looking at the code, constrain is the only behaviour I've ever seen users want.
        * DE: How did we determine Date compatibility was a requirement? Do we have a use case that we care about, other than Date compatibility?
        * RGN: There are several places in Temporal where we have disambiguation. This particular case is plus and minus, where balance doesn't seem meaningful. Do we want to have each place in the API where it's used justified separately?
        * DE: It seems unworkable for users to keep track of where each disambiguation method is valid.
        * RGN: They really are different use cases.
        * MPT: ?
        * SFC: It seems reasonable to allow different disambiguations in the arithmetic methods vs. the from() and with() methods.
        * MPT: That sounds good to me
        * PDL: Summarizing, should we remove the balance disambiguation from arithmetic?
        * JWS: It's a string parameter so it can always be extended back.
        * RGN: I would say that except for the specific case of duration.
        * PFC: Right, duration doesn't wrap around naturally.
        * (Also discussed 388 below)
        * Resolution is to remove balance from plus() / minus() on all types.
* [#388](https://github.com/tc39/proposal-temporal/issues/388) Allow Duration objects with too-large values, e.g. PT100M? What does "balance" do in this case, and how to specifically request balancing?
        * PDL: PT1M40S and PT100S are identical, so for time units it does wrap around naturally.
        * RGN: They're not identical in serialization.
        * PDL: That seems to me a distinction like 1e3 vs 1000.
        * RGN: There's also a difference when rendering the value.
        * PDL: That's an output formatting question.
        * PFC: If we go that way, then we need to change the resolution of #307 because cutoff parameters of minutes and seconds no longer make sense.
        * RGN: I think there is utility in treating Duration as a record, storing either 2 minutes 40 seconds or 1 minute 100 seconds distinctly.
        * SFC: If we can defer the logic into the Duration class, that would be more convenient than putting it in Intl.DurationFormat.
        * PDL: I'm fine with what Richard said. But then, if we don't do balance in arithmetic, maybe we should remove it altogether.
        * SFC: There's a use case for balancing a duration, though.
        * PDL: What I mean is allow balance in with() / from() for any of the types, and don't allow it in plus() / minus() for any of the types. I can always balance a duration by doing Duration.from(otherDuration, 'balance').
        * RGN: Agreed, especially because there are cases where there's not a choice, like PT2M40S minus 60 seconds.
        * PFC: We don't actually have arithmetic on Duration at all.
        * SFC: Everyone agreed that Temporal.Duration.from({seconds: 100, 'balance'}) should balance to PT1M40S?
        * RGN: Makes sense.
        * PFC: Especially in combination with a largestUnit parameter.
        * Resolution: Duration.from with balance will convert to the largest possible unit, up to hours.
    * Disambiguation really needed for Time and YearMonth plus/minus?
        * PFC: YearMonth maybe needs it for calendars where not all years are 12 months, but I don't see where Time arithmetic is ever ambiguous.
        * PDL: For consistency.
* [#392](https://github.com/tc39/proposal-temporal/issues/392) Subclassing
    * SFC: Would be better to have PDL here, so let's defer this.
    * SFC: We decided to treat Date as a record of ISO year, month, day, one approach would be that other calendars add subclasses of Date, e.g. HebrewDate.
    * JWS: Anecdotally, I think users expect things to be subclassable.
    * PDL: Is supporting subclassing a question on the table?
    * SFC: We can't not support subclassing. The question is do we want to treat subclassing as the first-class way to implement custom calendars?
    * PDL: I like where we already landed. We came to the conclusion that subclassing is a valid way to do custom calendar support, so we don't necessarily need to provide any or all calendars. So we are back to the question, can we just make the base objects ISO and let people subclass for whatever else they need?
    * DE: I don't have a clear idea of the API being proposed.
    * SFC: I disagree with the assertion that subclassing means that Date etc. don't have to delegate to a calendar type.
    * PDL: I think the approach of delegating to a calendar object is the better one, but if it's subclassable, I don't want to take the 20 most-used calendars and add them to the spec.
    * SFC: That's exactly what I think we should do, but on the 402 side, not in Temporal.
    * DE: ?
    * SFC: It leaves calendars open to use their own data model.
    * JWS: Example?
    * SFC: Japanese date requires an "era" field.
    * JWS: How are these new bespoke fields on the subclasses exposed?
    * SFC: isoDate.withCalendar('japanese'), the constructor is responsible for figuring out how to do that conversion.
    * PDL: I'm happy with that outcome, but being intentionally cynical, that just means that we offload it to 402 which is optional. Are we doing this just to make it more palatable to the committee because we'll get laughed out of the room if we show up with 60 calendar-based questions?
    * SFC: I think we were in agreement that with the current data model the calendars were all going to be in 402 space anyway.
    * PDL: The difference is that the actual logic is encapsulated in one optional object.
    * JWS: Regardless of where it lives, I think subclassing is a valid use case.
    * JWS: ?
    * SFC: We had a discussion and came up with a solution, then we dismissed it in favour of what we have now.
    * PDL: I'm happy to investigate whichever solution.

-----

Feb 13, 2020

Attendees:

	Philipp Dunkel (PDL)

	Philip Chimento (PFC)

	Shane Carr (SFC)

	Richard Gibson (RGN)

Dan Ehrenberg (DE)

Jase Williams (JWS)

Agenda:

* [#339](https://github.com/tc39/proposal-temporal/issues/339) Reject seconds :60 in 'reject' disambiguation mode?
    * PDL: there is a definition for how POSIX handles leap seconds. 60 is identical to 59.
    * PFC: so the current behaviour for 'balance' is wrong as well
    * PDL: What if you put in 61?  I think the issue is that balance in itself is an abomination, and one that we only really have because it's the way that the current JavaScript date works.  I think that if we go in and go with reject, then it should accept 60 as 59, and so should constrain, and for balance, we should balance it to 00.
    * RGN: A goal I would have here is that 60 in the seconds place does not get any special case treatment.  It is exactly the same as if you had 61 or 100 in the seconds place, or if you have values over 59 in the minutes place.  For all of the disambiguations.
    * PDL: We can't do that because 60 is actually a special case because of leap seconds.
    * RGN: We don't know whether input is a leap second.  It should have that behavior in minutes.
    * PDL: There is no such thing as a leap minute.
    * PFC: The special case is only in reject mode.  It rounds down to 59.
    * RGN: In which case you probably shouldn't use reject mode.
    * SFC: Is it valid to have an ISO string with :60 in the seconds place? If so, I don't think it's friendly to throw.
    * RGN: It's a valid input for a time scale that our system doesn't use.
    * PDL: I think we should try to accept valid ISO values.
    * RGN: I think it's ok to have this edge case.
    * PDL: I agree fundamentally, for the constructor, but for string parsing, I disagree.  If we're doing string parsing, we should do the reject but with the special case for leap seconds.
    * SFC: It would be nicer if the default was to round up instead of down.
    * RGN: No matter how you round it, you are always changing it because there's no way to represent it in the POSIX timeline.
    * RGN: Should we introduce an extra parameter to from()?
    * PDL: I think that just makes it more complicated for a bad edge case.
    * SFC: The default disambiguation is 'constrain', so the default will be fine for most users. It's only a problem if you opt in to 'reject'.
    * PDL: Except in the string parsing case. It's still a valid string.
    * RGN: ISO says the :60 representation may only be used to denote a positive leap second.
    * PDL: But they could decide tomorrow that there's a leap second in any minute of any day, and we don't know.
    * RGN: Summarizing, we special case it only when parsing ISO strings, and if you don't want that behaviour then you use the constructor or the property bag form.
    * SFC: Do we need to handle it only at 23:59:60?
    * PFC: That's what I originally thought, but the leap second time can be at any time due to time zones (and historical time zones)
* [#340](https://github.com/tc39/proposal-temporal/issues/340) Make all constructor parameters optional?
    * PFC: This is about the constructors and constructing from property bags.
    * PDL: The parameters should be optional up to seconds.
    * PFC: Why not all?
    * PDL: What would be the default value for the month?
    * PFC: 1
    * PDL: What about calendars for which that's not a good default value?
    * SFC: The constructor would take ISO numbers, no? Because the internal slots are ISO?
    * PDL: The constructor would take the calendar, so the numbers would be calendar-dependent.
    * DE: Where do we pass the calendar in?
    * PDL: It's not implemented yet. First position makes sense to me.
    * SFC: It makes sense for me for the constructor to take ISO values, because it's a low level API. I'd say the calendar should come last.
    * PDL: If we do this, then it makes sense for the constructor to always be in 'reject' mode.
    * PFC: We do already have an issue open for that.
    * PDL: Let's mark this conclusion there. And this affects the leap second question as well, so the constructor should be fully strict and reject leap seconds.
    * SFC: So, parameters optional?
    * DE: Propose that year, month, day are required, and the rest optional. "Midnight" is a reasonable value in a way that "jan 1, year 0" is not.
    * PFC: Then when constructing from a property bag, then year, month, and day should also be required.
    * PDL: The calendar parameter should come last.
* [#290](https://github.com/tc39/proposal-temporal/issues/290) [#331](https://github.com/tc39/proposal-temporal/issues/331) Data model questions
    * SFC: I haven't gotten any comments on #331 yet, so maybe a productive use of time is to review those and follow up next time.
    * PDL: To me partial ISO is the worst of all worlds and I have yet to hear a good argument for it.
    * DE: I think partial ISO is less worse than ... but I'd prefer full ISO. I'm not convinced it's worth the extra complexity, and the broad API changes to accommodate partial ISO.
    * SFC: It doesn't have any effect on API until you reach what I call the "calendar-sensitive operations".
    * SFC: I think it's worth talking about #290. See the comment at the bottom. If we have these getters, then regardless of which default calendar we have, the getters/slots remain the same, and then you can have calendar-dependent getters as well. So this question is orthogonal to what the default calendar is.
    * DE: If this were a purely editorial issue then I'd agree, but since you can provide your own calendar object, then we need to decide whether it's cached or not.
    * SFC: We'd cache for built in calendars and not for custom calendars, so custom calendars would have to be slightly slower.
    * DE: But you should be able to monkeypatch the built in calendar as well.
    * SFC: If you monkeypatch then it would have to take a different code path.
    * DE: So the semantics would have to be that the calendar method is always called.
    * PDL: I think this would be actually quite ergonomic combined with full ISO.
    * SFC: If we have this data model, then that opens up the possibility to talk about some of these other issues with a better framework.
    * PDL: Summarizing, our internal slots are going to be isoDay, isoMonth, isoYear, and the calendar is responsible for translating those.
    * SFC: I think it would be convenient for isoDay, isoMonth, and isoYear be getters as well.
    * DE: I'm not convinced about that.
    * PDL: It would suggest that the right way to do it is to use the getters, whereas the right way is to use the ISO calendar.
    * SFC: Next question, #291, what's the best way to access this calendaric information? Should we put it on a separate object?
    * DE: Why is it needed to change the current API?
    * SFC: Some calendars have concepts/fields that are not in others. Should we stick the union of all calendars' fields on Temporal.Date[Time]? Or maybe there's a way to forward all requests to the calendar object?
    * DE: We could make Temporal.Date[Time] an exotic object, like a proxy, but that seems overly complicated. I'd rather throw (for missing method) or return undefined (for missing property)
    * PDL: Let's think about year and era as an example. Does era always show up or only when the calendar has an era?
    * DE: I think all the getters should be on Temporal.Date[Time].prototype and just return undefined if N/A.
    * PDL: That means we have to add all possible fields now.
    * DE: We can add fields in the future. If there is something really unusual then the calendar can expose a method, which wouldn't be the same API but it would be OK.
    * PDL: Another possibility is to bundle era and year, since they are related, and have '.year' return a string including the era. If you really need the separate bits then you can query the calendar.
    * DE: I feel that this is overly complicated.
    * PFC: I'm not a fan of the year getter returning a string, it seems like it would have sorting implications and possibly localization as well.
    * SFC: If you introduce a custom calendar with a new field, you can always polyfill your field onto Temporal.Date[Time].prototpe.
    * PDL: +1
    * DE: Summarizing, the calendar-specific date and time properties are all on the prototype and return undefined if not present.
    * SFC: For any field that exists in any specced calendar, we have getters on Temporal.Date[Time].prototype. When you call those getters, they access the a method on the calendar slot, and it's up to the calendar to define the behaviour. If the method doesn't exist, then the getter returns undefined.
    * JWS: so we'll have date.year, date.era, etc. which proxy through to the calendar.
    * SFC: There's another question that RGN raised last week, but I'll file an issue for it.
* [#292](https://github.com/tc39/proposal-temporal/issues/292) Default calendar
    * SFC: Does anyone have new information?
    * JWS: Do we need to come to a resolution on it?
    * SFC: It's currently stalled until we get new information.
    * PDL: It doesn't seem that we'll get much new information, can we come to a resolution with the current information?
    * DE: I think it's worth talking about it so we can make a collective design decision.
    * SFC: I think we should resolve some of the other lower-level issues first, and then revisit this one once we have a more concrete picture.
* [#344](https://github.com/tc39/proposal-temporal/issues/344) Subtracting months in 'balance' disambiguation mode
* Should Duration throw in 'balance' disambiguation mode if the total duration after balancing is still negative? E.g. {hours: 1, minutes: -90}.
* [#310](https://github.com/tc39/proposal-temporal/issues/310) Symbols or strings post-TC39 follow-up
* Open questions in [#198](https://github.com/tc39/proposal-temporal/issues/198);
    * 1. Range of expanded years?
    * 2. Mixture of punctuation/no punctuation? (*3446-0508T03:2815-0630*)
    * 3. Fractional part without seconds? (*17:45.10*)

-----

Jan 27, 2020

Attendees

	Shane Carr (SFC)

	Philip Chimento (PFC)

	Jason Williams (JWS)

	Daniel Ehrenberg (DE)

	Richard Gibson (RGN)

Agenda:

* Issues
    * [#273](https://github.com/tc39/proposal-temporal/issues/273) Is the protocol proposed for timezones enough for attenuating time zone data for security reasons?
        * DE: I was wondering if it would be enough to monkeypatch methods?
        * RGN: Biggest concern when doing parsing, that that needs to have some intercept path, or else anyone who wants to attenuate temporal has to re-create the whole thing. So when you pass in a string with a timeZone name, internally a lookup is going to be created with a lookup, that's the concerning pattern.
        * PFC: The TimeZone object as specified currently only gets the information from the database on construction.
        * DE: It would still do that, but in #300 we’ll have internal methods to do any calculations with the time zone, and those would be monkeypatched.
        * RGN: I think this works.
    * #[313](https://github.com/tc39/proposal-temporal/issues/313) (pull request #[321](https://github.com/tc39/proposal-temporal/pull/321)) What kind of strings to accept in TimeZone.from()? "Z" or no “Z”?
        * PFC: Either a datetime and timezone and it will pick out the timezone or an unambiguous timezone name, but not an iso string with the date and time chopped off
        * DE: I think we should move the different formats to different methods, OR-ing together different grammar seems dangerous.
        * RGN: I think if it’s valid input for DateTime.from(), etc., it should be valid for TimeZone.from().
        * JWS: Agreed.
        * DE: Let’s do Philip’s proposal then.
        * PFC: I’d be happy with from(isostring) and fromName(name) as well.
        * DE: I’m not that happy with from() taking strings at all, but this is what the design currently is and we can revisit that separately.
        * JWS: What’s your objection to strings?
        * DE: It was part of Maggie’s original design to have methods like fromISOString() that explicitly say what they take.
        * JWS: I see.
        * RGN: We know what revisiting that looks like, so we can revisit it if necessary in the future.
    * #[198](https://github.com/tc39/proposal-temporal/issues/198) What stipulations to add to ISO 8601 in general? Are we happy with the list in the [comment](https://github.com/tc39/proposal-temporal/issues/198#issuecomment-547552203)?
        * PFC:
        * RGN: If I understand PDL’s position it should be 0, 3, 6, or 9 decimal places in serialization.
        * DE: Richard, what do you suggest for parsing?
        * RGN: 0 through 9 accepted, more than 9 throws.
        * DE: I like Richard’s proposal. I also agree with omitting weeks and ordinal dates, as they’re uncommon, and agree with allowing date/time separately modulo our earlier discussion about not allowing time zones by themselves.
        * DE: Are ISO duration strings in wide use?
        * JWS: They are used within the BBC to describe the length of programmes.
        * RGN: That seems to be the argument, that some representation is needed and ISO 8601 is a well-known published standard
        * DE: Should we support weeks in duration strings?
        * RGN: If we did, we’d have to put that in the data model all the way through.
        * SFC: There’s another question about calendar notation in ISO strings -> we add it to the agenda.
    * #[260](https://github.com/tc39/proposal-temporal/issues/260) Why do constructors accept invalid input, e.g. new Temporal.Date(2019, 13, -7)?
        * RGN: Very surprised that out-of-bounds input is accepted. I remember that one of the main reasons for pursuing Temporal was to eliminate that kind of sloppiness.
        * JWS: I found the polyfill was accepting a lot of invalid input. Is that intentional?
        * DE: This seems to be a consequence of how disambiguation parameters are layered into the API. I agree we should be stricter if we can be, it’s a question of how to put the disambiguation at the right layer. I think the constructor should be strict.
        * RGN: Does everyone agree that constructors should be strict?
        * PFC: Yes, although not sure what method to use if you have data that needs to be balanced.
        * DE: In that case you’re responsible for your own business logic.
    * #[307](https://github.com/tc39/proposal-temporal/issues/307) ([comment](https://github.com/tc39/proposal-temporal/issues/307#issuecomment-577440493)) Cutoff parameter in difference()?
        * PFC: The problem is with differences like February 1 to March 1 being non-constant, e.g. 1 month vs. 28 days vs. 29 days.
        * PFC: There are four levels of proposed fixes in GitHub, where 1 through 3 (a customizable cutoff down to days [number 2] or seconds [number 3]) make sense here but number 4 (arbitrary cutoff down to nanoseconds) should be split off because it calls into question Number vs. BigInt.
        * DE: Doing 1 to 3 seems reasonable.
        * JWS: I can think of good use cases for hours, minutes, and seconds cutoff, not so much for milliseconds, microseconds, and nanoseconds.
        * RGN: If the range of DateTime is the same as the built-in Date, then seconds could be safely representable. If we have a longer range then seconds might not be safe.
        * PFC: I wrote "hours and lower" in proposal #3 but it’d have to be “hours, minutes, and seconds” if we didn’t want to get into changing the data model to use BigInt.

    * Calendar notation and round-tripping in ISO 8601 strings (#[293](https://github.com/tc39/proposal-temporal/issues/293))
        * SFC: Right now we have an invariant that ISO 8601 strings can be round-tripped exactly. If we have an internal slot for the calendar, then that invariant is broken because you can call toString() on a Hebrew date and you’d get back a Gregorian date. Possible solutions are to add a syntax extension for the calendar name, or throw if the calendar is non-ISO.
        * DE: I looked at the grammar in RFC 3339, and it limits months to 1–12.
        * SFC: The serialized string would be an ISO date but with an annotation for the calendar name, so you’d parse the string into an ISO date but then convert it into e.g. the Hebrew calendar.
        * DE: Is there some kind of compatibility risk from innovating in the comment area here?
        * RGN: I don’t think we can say that there’s definitely not a risk.
        * DE: Is this motivated by the roundtripping invariant?
        * SFC: A use case pointed out in the issue is passing dates between iframes or workers. If we threw, then you’d have to convert to ISO and send your own information about the calendar alongside.
        * SFC: Another motivation is why do we treat time zone as different from calendar, why is time zone important enough to include as an annotation in the string?
        * DE: Makes sense.
        * RGN: Makes sense, but I believe that the bracketed time zone was just invented by Joda-Time. It’s not widely adopted, but wide enough that we feel comfortable enough adopting it. Calendar we’d be introducing ourselves in Temporal.
        * DE: How about the proposed c= syntax?
        * RGN: Without the c= and just brackets, there’s the possibility for collision with the time zone.
        * JWS: I’ve never seen the bracket syntax before, is that going to be parsed?
        * RGN: Depends on the software that’s parsing it. Java and some other languages’ standard libraries would parse the time zone.
        * DE: v8’s parser accepts "trailing garbage" but would put it in legacy mode.
        * RGN: Somewhat irrelevant in the context of existing JS because the Date object doesn’t have a time zone component. In Temporal it does matter because it affects what happens when you do arithmetic on the resulting data.
        * JWS: Does it give rise to compatibility issues?
        * RGN: There are compatibility issues, but minimal, and it’s widely recognized enough that the benefit is worth it. If we add a calendar annotation, then the compatibility risk is higher.
        * DE: I’m wondering about making toString() not serialize the calendar.
        * RGN: If we make toString() throw on a non-ISO calendar, then that allows improvement in the future. If we specify it to always project into ISO, then we’d have to make a different method.
        * DE: If toString() were called toISOString() as Maggie originally proposed then the risk would be lower.
        * RGN: What does toString() do in that case?
        * SFC: Another complication is going from a string identifier back to a calendar object when parsing the string.
        * DE: We should avoid having a global registry.
        * SFC: What I suggested is that you’d have to pass in your mapping function when you parse.
        * DE: That seems like a complicated API. People get confused by JSON.parse and JSON.stringify having replacer arguments.
        * SFC: In any case I think we shouldn’t let toString() succeed and lose the information. It would be better to throw and reserve the possibility of improving it in the future.
        * DE: toString() throwing doesn’t sound good.
        * SFC: We have two constraints here; toString() shouldn’t lose information and it shouldn’t throw.
        * DE: If you have a custom TimeZone object then you also lose information. Maybe that requirement is too hard.
        * JWS: Is it off the table to have toString and serialization be two separate methods? It seems like two separate use cases.
        * RGN: Not off the table, but toString does have to do something.
        * DE: What if we made toString just return [Object Temporal.DateTime] and toISOString serialize it and throw on non-ISO calendar?
        * SFC: What happens on Temporal.Absolute.toString()?
        * RGN: Right now it returns RFC 3339 with a Z offset.
        * DE: toString() doesn’t usually take a parameter.
        * PFC: We do have an optional time zone parameter on Absolute.toString().
        * DE: I can imagine that being on DateTime.toString as well.
        * DE: Let’s discuss this more next meeting.
        * SFC: DE, can you post your suggestion about splitting toString and toISOString in the issue? (ACTION)

* Work items:
    * Polyfill
        * Implement [calendar/timezone protocol](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-draft.md) + [#300](https://github.com/tc39/proposal-temporal/issues/300) ([tag](https://github.com/tc39/proposal-temporal/labels/calendar))
        * Temporal.parse method: Ujjwal has on his plate, but he's a bit busy and open to help
    * Spec text
        * Specify [calendar/timezone protocol](https://github.com/tc39/proposal-temporal/blob/main/docs/calendar-draft.md) + [#300](https://github.com/tc39/proposal-temporal/issues/300) ([tag](https://github.com/tc39/proposal-temporal/labels/calendar))
        * Audit polyfill and spec text for doing the same thing
        * File for a new TAG review when this is all done
    * Documentation
        * Cookbook: Jason
        * Introductory article: Tara
        * Reference documentation: PFC + others?
        * Cross-language/library comparison (optional) #105
    * Tests
        * Test262 harness and conversion: Ms2ger
        * Review the project for test coverage and correctness: Owner??
* Timeline:
    * Aim to finish all tasks by April
    * Propose for Stage 3 in July TC39 meeting
        * Hope is that this will be aligned with Intl.DurationFormat for Stage 2
    * Are we on track for this goal?

-----

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
        * PDL: No sensible answer. 24th of Kiselev is a different day each year (you need a year field to convert).
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

-----

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
        * MPT: Is there a link for the cookbook? ([https://github.com/tc39/proposal-temporal/pull/305](https://github.com/tc39/proposal-temporal/pull/305))
        * DE: Do you know if Jason was still planning on working on this?
        * PDL: I think his idea was that he wanted to check in the PR, and address the comments people left.  I'll check in with him tomorrow.
        * Action item: MPT to review the cookbook pull request.
        * Action item: SFC to make the changes for each of the default calendar options, after the cookbook code is checked in.
        * Action item: PDL to ping JNW to land/complete cookbook
    * [#291](https://github.com/tc39/proposal-temporal/issues/291) Move calendar-specific getters off of Temporal.DateTime.prototype?
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
        * [#300](https://github.com/tc39/proposal-temporal/issues/300) Any issues with this plan for Temporal.TimeZone and Temporal.DateTime?
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

-----

Dec 10, 2019

Attendees

Philipp Dunkel (PDL)

Ujjwal Sharma (USA)

Jason Williams (JWS)

Shane Carr (SFC)

Tara Z Manicsic (new: TZM)

Caio Lima (CLA)	Richard Gibson (RGN)

PDL: Everyone should take a look at [https://github.com/tc39/proposal-temporal/pull/287](https://github.com/tc39/proposal-temporal/pull/287) if you're not familiar with it, i am about to merge it now.

PDL: We don't want to talk about it now but we should also take a look at [https://github.com/tc39/proposal-temporal/issues/292](https://github.com/tc39/proposal-temporal/issues/292)

PDL: What is next on our timeline? 

- SFC: will create PR for table of pros and cons of default calendar options

- USA: next step is clean up spec

- PDL: mine is add calendar support to the polyfill

- JWS and TZM: start the next step of reviews?

RGN: I think that's a bit premature because the cookbook that was requested is still empty. We don't know if the API is desired because it hasn't been applied to those real world examples.

Cookbook: [https://github.com/tc39/proposal-temporal/issues/240](https://github.com/tc39/proposal-temporal/issues/240)

PDL: What do you think the next steps should be? creating the cookbook?

RGN: I think so.

RGN: it guides the design questions, rather than follow them.

PDL: Jase, can you fill in the cookbook?

JSW: Yeah, sounds good

New AI for JWS and TZM: fill in the cookbook examples.

SFC: Let's make a new top-level directory called "examples".

PDL: Create a JavaScript file for each cookbook recipe in the examples directory.  I suggest making a PR for each recipe, so that we can have a discussion about each one.

PDL: I think the realistic timeline is we're stable with the issues resolved and spec written, and we can point committee members and delegates at it.  I’ll do an update presentation on Feb TC39 meeting and ask for stage advancement on April.

-----

Nov 12, 2019

Attendees

	Richard Gibson

	Ujjwal Sharma

	Jaideep Bhoosreddy

	Daniel Ehrenberg

	Philipp Dunkel

	Jeff Walden

	Shane Carr

Agenda:

* Status of project
    * Open issues
        * [https://github.com/tc39/proposal-temporal/issues/255](https://github.com/tc39/proposal-temporal/issues/255) -- No, PD to follow up to close issue
        * [https://github.com/tc39/proposal-temporal/issues/236](https://github.com/tc39/proposal-temporal/issues/236)
            * PD: Do we really want 5 of these? Here and now is enough
            * DE: I think we probably want three of them, DateTime, Absolute and TimeZone
            * Resolution: post on the issue getCurrentDateTime, getCurrentAbsolute, getCurrentTimeZone, and follow up
        * [https://github.com/tc39/proposal-temporal/issues/233](https://github.com/tc39/proposal-temporal/issues/233)
            * PD: Let's drop them
            * Resolution: Drop
        * [https://github.com/tc39/proposal-temporal/issues/237](https://github.com/tc39/proposal-temporal/issues/237)
            * DE: We should check the types. If you want to sort just by time, project explicitly.
            * PD: OK, I'm convinced. Except! It shouldn't throw, since array sort doesn't throw with the default comparator.
            * RG: It should throw, e.g., if you have a string that can't parse. The default comparator will throw if you pass a symbol.
            * Resolution: throw a type error if there's a mismatch
        * [https://github.com/tc39/proposal-temporal/issues/244](https://github.com/tc39/proposal-temporal/issues/244)
            * PD: When you parse an ISO string, you want an Absolute and TimeZone, or DateTime and TimeZone
            * DE: Isn't this logically a DateTime + TimeZone? You could calculate an absolute, but that's not what you're parsing
            * PD: Not quite--the string may have both an offset (+- num) and a timezone ([/])
            * DE: What's used in interchange?
            * PD: Right now, it's mostly just offset, and not timezone. C# and MS are pushing for offset and timezone. That's the only thing that will allow full information interchange. It's an extension on ISO because the [] is allowed as a comment (!) So, the proposal here is to give you all the information that you end up having.
            * SC: Does this round-trip?
            * PD: You can pass in the TimeZone to an Absolute.toString()
            * US: Do we need to have subtypes to DateTime, like Date or Time?
            * DE: I guess the reason why not is that you might pass just a Date or just a Time?
            * SC: We could follow the pattern of Intl.Segmenter and return an object that has getters, so it woulld be lazy
            * PD to comment with a resolution
        * [https://github.com/tc39/proposal-temporal/issues/198](https://github.com/tc39/proposal-temporal/issues/198) 
            * RG: ISO allows alphabetic components in any case; ISO expresses a preference for a , but allows a .
            * PD: Can we not?
            * RG: We certainly can specify something that doesn't. I saw a change come in that was looser than ISO, allowing a space instead of a T
            * PD: This matches RFC 3339, an ISO profile, that allows that
            * RG: No, it doesn't. It also uses the T.
            * PD: It lets you alternate case in RFC 3339
            * DE: Is this in use in interchange?
            * PD: The space is in use
            * RG: Yes
            * PD: Lower case? I don't care. Separation of , vs ., let's just stick with .
            * RG: If we're going to allow any variation at all, I believe we should allow all valid 
            * Resolution: Yes, let's get a profile that makes sense, and follow up on the issue.
        * [https://github.com/tc39/proposal-temporal/issues/129](https://github.com/tc39/proposal-temporal/issues/129) 
    * Polyfill
        * US: I had been working on things like from/fromString, and just picking up all the design issues that have a conclusion, and working on getting as much consensus as I can. So I'm working to make sure we don't have open polyfill issues.
    * Documentation
        * Jason will do Absolute
        * Philipp will do DateTime
        * Jaideep will do TimeZone
        * (We'll assign more later)
    * Tests
        * PD: I'm running coverage on the tests. They show a lot of holes.
        * US: Ms2ger configured codeconv on the tests
        * PD: It's simple, you can use npm run coverage
    * Spec text
        * [https://github.com/tc39/proposal-temporal/issues/198#issuecomment-552367929](https://github.com/tc39/proposal-temporal/issues/198#issuecomment-552367929)
        * [https://github.com/tc39/proposal-temporal/issues/207#issuecomment-552684236](https://github.com/tc39/proposal-temporal/issues/207#issuecomment-552684236)
        * Ms2ger is all in, adding more and more spec text; US to join in
    * PD: I'm more relaxed about the time goals, more tests are being written to make sure that things are really sensible
    * US: I'm planning on working on various additional issues, like parsing. Hoping that this week, we'd have the API issues done, and no more big open issues for the API. Ms2ger is working through spec issues. I hope in a week or so, we're at a point where we're just finishing up the spec text. We might've hit the phase where the proposal was probably moving too fast and it was a bit concerning, so I do think it'd be good to keep it relaxing for a couple of weeks, to make sure that everyone has had time to review things.
    * PD: I think that's what the last two weeks were about, and I'm glad we're moving more slowly. Maybe with another week we'll be good
    * DE: I haven't seen activity on several of the issues I've filed; I'm not sure if we'll be ready in a week
    * RG: I'm working on a list of use cases, extracted from issues, and plan to upload this soon.
* Next steps
    * New goals:

------

October 8, 2019

Attendees:

Agenda (proposed):

* Review feedback from TC39
    * Everyone's happy, right?
* Collectively review the current proposal in detail
    * High level set of classes -- already reviewed, but any concerns?
    * Details of namespace object and Local sub-object
    * Examine each method/constructor and its detailed semantics, including
        * Behavior when the day is re-adjusted (e.g., January 31st, 2019 + 1 month)
        * Type overloading semantics
        * Negative duration/comparison design
* Take action items on next steps -- ideally shared among multiple people
    * Documentation updates
        * Reference documentation in the polyfill repo
        * Update each document in the main repository
        * Low priority: prepare MDN-style documentation, to post in MDN when we reach Stage 3
        * Owners: Philipp, Jase
    * Spec text
        * Update to the new API
        * Fix existing issues with precision
        * Update Intl connection, based on conclusions of meeting
        * Owners: Ms2ger, Ujjwal
    * Polyfill
        * Merging the polyfill into the main repository (performance?)
        * Fixing polyfill bugs
        * Uploading new version of the polyfill to npm
        * Owners: Philipp, Jase
* Schedule going forwards
    * October 24th: finalize all semantics issues
    * October 31st: Completed the polyfill and docs
    * December 31st: Finalize the spec text
    * February 2020 TC39 meeting: Stage 3

-----

September 10, 2019

Attendees:

	Shane Carr - Google i18n (SC)

	Jeff Walden - Mozilla SpiderMonkey (JW)

	Richard Gibson - OpenJS Foundation (RG)

	Philipp Dunnkel (PD)

	Daniel Ehrenberg (DE)

PD: Update: I was looking over feedback from the C++ side, the polyfill itself, and the repetitive nag/desire for something that resembles a timezone API directly.  As a consequence of that, a lot of the things that came out of the C++ review work better if we have a timezone object.  So what I've done with the timezone object in the polyfill is you say TimeZone.for(name) and you get a TimeZone object that is the same across GC cycles (always the same object), so this way we don't create a billion of them.  That object gives you several pieces of information: the time zone name, the list of offsets within a year, and a list of all the instants when a new offset takes effect (DST changes).  It also gets you the instants for datetime, and the datetime for an instant.  And based on that you have the full data accessible.  So with TimeZone, you no longer need ZonedDateTime, and you can use OffsetDateTime.  That's one collection of changes.

PD: The second set of changes is that Instant was, don't expose the value of the instant.  Having epoch seconds, milliseconds, etc., sounds bad.  It never felt quite right.  So rather than exposing the instant as value, it has methods to extract the epoch seconds, etc., which means Instant is OK.  I've put all this into the PR, and I'll be adding more.

DE: Those APIs that took a string for the timezone.  Are those in place, so you can put a string or TimeZone, or do you have to make a TimeZone?

PD: Both are in place; spec-wise, toString is called on the argument, and then TimeZone gets created from it.

PD: Duration gets an ISO 8601 method for string round-trip.

PD: The last big change is the local namespace, which I think is the most controversial.  The Local namespace, Temporal.Local, contains Instant, the current time in hi-fidelity, Instant.TimeZone, the current system timezone, and Date, DateTime, ZonedDateTime, etc.  That gets filed with the current value.  Because they're not in any constructors, like new Date, I think that's a good compromise between the ergonomics and the needs of SES/Security, because you can mock those out with less-precise needs, in a single spot.

DE: Where are those accessed from?

PD: Temporal.Local.Instant

DE: The other option would be to just not provide those methods?

PD: Yes, except a lot of the feedback from the polyfill is that people expect a starting point.  A lot of apps start with "today".  You would have to go through a lot of steps to convert from Date.now(), which is painful for users.  If we put the system information in one specific spot, then hopefully that is OK.  I hope to have that discussion with Mark, etc., at TC39.

DE: Did you talk about being an object without the Civil prefix?

PD: Yes; the Civil prefix has been dropped since they are in the Temporal namespace: Temporal.Date, Temporal.DateTime, etc.

PD: On ZonedDateTime, we removed withZone, since it is ambiguous about whether it keeps the Instant or the DateTime form.  So now you have to be explicit.

PD: The last big addition is Instant.compare, DateTime.compare, etc., which are static functions that you can use in Array.sort, which sort those types.

PD: The polyfill already reflects these changes.  I hope to involve Ms2ger to write the spec.  My goal for TC39 is to have the spec, polyfill, docs, etc., all done, asking for a full Stage 3 review at that point, since that is the first point when we have all our ducks in a row.

SC: What form is the time zone name?

PD: It could be an IANA string (America/New_York), or "+HH:MM".

SC: How does it round-trip?  If you give America/Miami, do you get America/New_York back?

PD: The polyfill goes off Intl.  I used the resolvedOptions.

DE: Temporal should call into Intl canonicalizeTimeZone.

SC: Since TimeZone is becoming a first-class object, should we revisit adding time zone names to Intl.DisplayNames?  Users might expect a toLocaleString function.

PD: I feel it's a can of worms that I don't want to be a part of this proposal.

DE: I'm OK with the status quo.

JW: When you said that you want to get the list of offsets within a year, that is a list of instants.  Should that be a list of DateTime or something else?

PD: They have to be Instants because it reflects the exact time when the shift happens.  For example, for a DateTime, there might be more or less than one instant that reflects that (2am skips to 3am, or 3am rewinds to 2am).

JW: The way that people are used to thinking about offset changes is, "March 15 at 2am".  So it seems weird to map that onto an instant.  I see that in the timezone database.

PD: Those strings are used for you to calculate the instant at which the change takes place.  They are not used in the implementation.

RG: I wanted to bring up Duration.  I saw some spec text that indicated that negative durations are not supported.  I think that's a necessary capability.

PD: Negative durations are not supported by ISO 8601 strings either.  We support them secondarily, because you can use the + or - operations on them, taking differences, etc.  But the difference between two times is never going to be negative.  If you have a date, say August 1, 2018, 12:00:00, and August 2, 2018, 8:00:00, which is afterwards, you have the time part, which is negative, and the date part is positive, and now you have a mix.  So you really want the difference between two dates and times, which is a length of time, a duration.  With + and -, we can do the addition and subtract, and you can do it explicitly, but the duration value is always positive.  It makes life simpler, but you can still do the math you need.

RG: I agree it's possible to recover it, but that's the nature of my objection.  + and - are operations, but Duration is state.  Before we introduced compare, you couldn't even tell the order.

PD: That's why compare is important, but for me, I think going with ISO 8601, saying durations are never negative (there's no syntax to express negative durations), I would rather follow that route.  We need compare anyhow for list sorting, and I would rather go down that route.

DE: Would it be possible to throw an exception if you ask for the difference in the wrong order?  That would follow what we did with Intl.DateTimeFormat.prototype.formatRange.

PD: It makes sense to subtract the smaller from the bigger.  Throwing an exception makes it not as nice as a usability issue.

DE: It seems weird to be handling dates where you don't know which one is greater.

PD: It seems like the expected behavior to me to just get the difference.

DE: Would this fix your issue, RG?

RG: I think it would highlight the issue for authors.  This solution doesn't solve it.  The solution in user code is an object that has a Duration as well as a sign.

PD: I have DateTime A and B, and I get the difference between them.

RG: I'm working on an issue to collect use cases that people want to be able to do with Temporal, which would provide a reference point to help discussions like this.  For example, the introduction of compare means that users now have all the tools, so now the question is whether the tools are clear and easy to use.

PD: My suggestion would be (a), let's leave it as-is for now, and remember that this is something we need to discuss, and (b), we can have a meeting in New York where we hash this out.

DE: I have some more bikeshedding issues.  When you do toString on a timezone, we should follow what we decided for Intl.Locale, where in cases where you can take multiple types, you should check the internal slot, and use the object directly.  Because we don't want to create vectors where you override the toString method.

PD: For TimeZone, I agree.  For others, maybe not, … 

DE: This is just a way to say, if you mess up your environment, you don't get these weird effects.

RG: To dig in on that a little bit.  If you have an input where duration is expected, there are 3 cases: you have a real Duration, you have an object which has the same fields as Duration, or you have something else.  You have a string that can be deserialized into a Duration.  If you have an object that could be a string, or something exotic like an object that has a toString method, which takes priority?

PD: You both said about the same thing, and I think you're both right on it.

DE: So we never call toString?

PD: No, you get in an argument.  If it has a duration slot, use it straight on.  If no, does it have year/month/day/hours/etc?  If it has at least one of those, create a duration using what it has.  Else, use toString.

DE: That sounds more complex than what we normally do in JS standard libraries.  Checking whether a property exist doesn't really happen.  We read from a property, and undefined turns into NaN.

PD: I would be getting year/month/day/hour/minute/second, etc.

DE: This is kind-of an anti-pattern.

RG: We should first make sure we preserve Duration, and then go through the details about whether you choose something is string-like or object-like.  Where else has this come up in the web platform?

DE: WebIDL overloads in restricted, limited ways.

RG: I'm specifically referring to a case where the overload is object or string.

DE: Generally, overloads are difficult.  If we do overload, it should be in a limited way.

DE: Next topic.  About using the same TimeZone object, that's a big no.  It's like document.getElementsByTagName.  We added WeakRef, which makes GC visible.

PD: The heuristic I wanted is, basically TimeZone.for() gives you a TimeZone object.  You don't construct an object.

DE: Oh, OK.

PD: If you do TimeZone.for() 5 times in a row, you should get the same object.

DE: Yeah, but I think you shouldn't do that, because of standards across the web.  You could say that within the TimeZone object, you could say that you have an internal structure used within other classes.  And you never actually construct a TimeZone unless the user specifically asks for it.

DE: Finally, you mentioned you have methods to getEpochSeconds, etc., instead of getters.  It just sounds like it doesn't accomplish anything.

PD: To me, two different properties of an object should not have the same semantic meaning.  If I am at epoch absolute zero, the meaning of getEpochSeconds and getEpochMilliseconds is the same thing, just at different granularity.  Different properties to get the same thing with different granularity seems bad.

SC: Could you have a getEpochDuration, and let the Duration handle whether you have seconds, milliseconds, etc?

PD: I don't get it.

RG: Non-method properties should be orthogonal from each other.

SC: I'd also like to iterate on Intl integration offline.

DE: And publishing the polyfill before the TC39 meeting, does that sound good?

SC: For TC39, the global object route may be controversial, even more so than the other details we've been discussing today.  We should be prepared with several arguments in favor of global object, not just the timeline problem.

DE: Built-in modules are stuck at Stage 1.  Let's not bikeshed on any other issues.

PD: Let's sync in New York to go over the presentation.

------

Temporal/Date call

August 13, 2019

Attendees:

	Shane Carr - Google i18n (SC)

	Jeff Walden - Mozilla SpiderMonkey (JW)

	Richard Gibson - OpenJS Foundation (RG)

	Ujjwal Sharma - Node.js / V8, Igalia student program (US)

SC: Thanks Ujjwal for triaging the tickets!

SC: Ms2ger has a PR to add the Intl.DateTimeFormat integration: [https://github.com/tc39/proposal-temporal/pull/140](https://github.com/tc39/proposal-temporal/pull/140)

We need to figure out the logistics for checking it in.

SC: What's the status of the spec text?  Stage 3 reviewers?

SC: Status of remaining open issues?

RG: I still want to triage issues.  I think there are still some big gaps.  I need to evaluate the process document to evaluate if those are Stage 3 concerns.  Before the next meeting, I want to collect things from GitHub and share code that solves those use cases.  For example, someone shared flight time calculation, event scheduling, and other use cases we want to resolve with Temporal.

SC: We shouldn't feel bad to punt for another cycle, but I would like to see progress.

RG: Not sure yet if they are Stage 3 blocking issues.

US: I've done triaging work; not time yet for spec work.  But now I should have more time for the spec.  PD suggested working on Instant first.  I've been spending time doing research on prior art to get a handle on what's expected.

SC: I’m really happy with the progress we’re seeing. Philipp has a PR for OffsetDateTime & ZonedDateTime spec text at [https://github.com/tc39/proposal-temporal/pull/145](https://github.com/tc39/proposal-temporal/pull/145), there has been some initial review and some still-open questions.

RG: If there's missing surface area, the use cases should expose that.  My opinion hasn't changed since I wrote the comment on the PR.

US: One issue is that even if the PR is perfect on technical grounds, DD raised concerns about the built-in module interactions.

SC: I’m skeptical about advancing Temporal as a built-in module, in part because others in the committee and in the web platform are concerned about confusion from having both globals and built-in modules (which itself is only at Stage 1). I think Temporal needs to move ahead as a global and we can pivot if that blocks advancement.

US: We would have to do weird things in the spec with built-in modules.  JHD had some more comments on built-in module, something along the lines of this being a crucial part of the spec that shouldn't be changed at this stage if possible.

SC: We *could* come into October with an update rather than seeking advancement. It’s more a political decision than a technical one, subject to our own time and resources.

JW: Stage 3 is when implementers have a green light.  Global vs Built-In Module should be decided by that point.

SC: If TC39 gives us approval for Stage 3, then that answers the question.

RG: It would be worth sharing how big this feature is.  Everyone deserves congratulations for how far it's come.  There's a lot of depth, complexity, and surface area.

SC: I’m tentatively planning to attend TC39 October in person. Next Temporal call is on September 10.

-----

Temporal/Date call

July 9, 2019

Attendees:

	Shane Carr - Google i18n (SC)

	Jeff Walden - Mozilla SpiderMonkey (JW)

	Richard Gibson - OpenJS Foundation (RG)

	Ujjwal Sharma - Node.js / V8, Igalia student program (US)

	Philipp Dunkel - Bloomberg, current champion (PD)

SC: Where do we stand in terms of stage advancement?

PD: My aim is to have the spec text in place by the September/October meeting at Bloomberg in New York.  Whoever can or wants to help with anything is appreciated.

SC: We discussed Temporal a bit in the ECMA 402 meeting last month and recommended that Ms2ger move forward with writing spec text for Intl and Temporal based on global objects.

SC: What are actionable items to prepare for Stage 3 advancement?

- Write spec text for Intl DateTimeFormat interaction (Ms2ger)

PD: I'm working on spec text in Markdown.  I'm hoping to have that done by the end of this month.

RG: We have several different places with the same information.  We have the Markdown docs, the spec text, the reference implementation.  Which one do you consider the authoritative state of the proposal?

PD: There's a document that describes the API.  The Markdown file.  That is probably the closest to current.  The spec text is woefully outdated.  The rationale Markdown files … and I've spent some time bringing the polyfill up to date.  In my mind, that is up with what the spec should do.

RG: If there is a disagreement between Markdown and the polyfill, which one wins?

PD: There should not be a discrepancy.  The documents in the polyfill are copied over from the Markdown proposal.  They are not separately maintained.  The intent is to ship documentation with the polyfill.  They are not actually separate documents.

PD: I think there shouldn't be discrepancies.  If there are, it's a case-by-case basis.  I think there shouldn't be any disagreements, and if there are, they are accidental.  Markdown and Polyfill are at the same state of current.

RG: So there's no general rule?

PD: I guess the polyfill is more likely to be working, since I tool around with that a lot.  My workflow is that I work on the polyfill, and then I write it into the documentation.  And I'm basically at the point now that I need to spin that around and write the spec text, and then update the polyfill based on discoveries during the spec text.

SC: Is there something that US can help with?

PD: I'm not good at dividing up the work, but I know there's a ton to do.  Maybe, pick one of the object, send me a message and say that I'm now speccing this object out, and go for it.  The other thing is Test 262, getting actual tests in.

US: That's close to what I had in mind.  I was afraid to step on people's toes.  So I'll contact you privately and decide which object to start with.

SC: Why are there 58 open issues?

PD: Before Berlin, I closed a bunch of issues.  The response I got was, don't do that, because they are valid.

US: Don't you think we can make a single issue for things like, complete the spec text for object Y, and then close all the related issues?  Maybe I can help set up a GitHub project board.

SC: That sounds great if you can help with project management.

PD: Go for it!  I find though that we have trouble getting contributions from contributors who don't have much time.

SC: It might help if the tasks were more well-defined.

PD: Do we have any more unknowns?  Is there anything else that we haven't spent time designing yet?

RG: There are some issues that we need to look if they're valid or not, that could affect the shape of the interface.

PD: Last time I looked, I didn't see one that met that criteria.  RG, maybe you can help label them?  And make that initial judgement?

RG: I can rule out the ones that are definitely unimportant.  But for example, there's the big one from the March meeting.

PD: It would help if there are bullet points for what are still the gaps, because as far as I know, there shouldn't be any.

SC: Another issue to look at is #139, the one from the Google Abseil folks, who wrote a similar date/time library in C++.  I was able to solicit feedback from them.

PD: There's probably some discussion to be had on issue 2.  We are happy having hybrid types.  So we really should have that discussion at some point.  Whether you expose the epoch or not is an implementation detail.  If you create an instance, you should be able to know what instant it is, and the only way to know that is to know the epoch.  That's point 1. But on point 2, basically what he's saying is to not have ZonedDateTime and OffsetDateTime at all.  How and when do we want to have that discussion?

SC: Discussing asynchronously on GItHub should work, or I can help facilitate setting up a meeting.

PD: Let's discuss asynchronously for now and see if that works.

------

Temporal/Date call

February 12, 2019

Attendees:

	Shane Carr (SC)

	Jeff Walden (JW)

	Philipp Dunkel (PD)

Agenda and notes:

* Temporal
    * Explainer/documentation update
        * PD: I’m still working on MDN docs; I will join TC39 in March

-------

Temporal/Date call

January 8, 2019, 18:00 UTC

Attendees:

	Daniel Ehrenberg (DE)

	Shane Carr (SC)

	Richard Gibson (RG)

	Maggie Pint (MP)

	Jeff Walden (JW)

	Philipp Dunkel (PD)

	Sasha Pierson (SP)

Agenda and notes  (please suggest your own additions/refinements):

* Temporal
    * Summarizing TC39 status
        * DE: Stage 2! Hooray
        * PD: Actual management buy-in!
    * Explainer/documentation
        * PD: I can get a start on this, and coordinate with those who want to do the heavy lifting of comparative linguistics
        * DE: It's also important to have documentation in MDN.  The MDN folks are really interested in getting documentation for in-progress proposals so they can be a vector to get feedback.  There is a TC39 outreach group and we are working with MDN.  PD, are you interested in writing MDN documentation?
        * MP: I would expect to see API churn… we could try… maybe it would be helpful for us to write MDN documentation as an exercise that could be informative.
        * DE: Yeah, maybe the process of writing up documentation could make us realize that it is weird.
        * PD: I think we should start from MDN documentation.  It might help us make clearer spec text.  So write docs first, spec text second.
    * Specification
        * MP: This sort of blocks on the modules question
    * Strategy for modules
        * DE: Apple, Google are both pushing for built-in modules outside TC39.  There are GitHub comments I've read.  Apple doesn't really have time to write the spec.  And there are open questions about how polyfills, namespaces, etc., should work with built-in modules.  I expect to see this come up at TC39.  We could be a force on this, or we could go with the flow.
        * PD: The question to me is, if we push for this / advance it as a good use case, which I think it is, what are the chances of this getting blocked on built-in modules since there is always disagreement when we bring it up?  Because I think it's more important to get Temporal through than to hitch it to built-in modules, even though it is a perfect use case.
        * DE: The points of disagreement have been shifting.  No one is really saying "no built-in modules", but people have specific concerns now.  My feeling is that, Temporal is a proposal that polyfills really well.  So one part is getting this shipped in browsers, and another step is getting API adoption.  So, it would be OK if it takes a little longer to get into browsers if it gets high ecosystem adoption first with the polyfill.  So this is an opportunity for us to be a champion of built-in modules.
        * PD: I think it makes sense.  We should re-evaluate it in March and June.
        * MP: Is built-in modules on the agenda for January?
        * DE: I talked to someone who wanted to put it on the agenda, but I don't know the details.
        * DE: If we're going to back up built-in modules, are we going to choose a module specifier?  We could be @std/temporal, for example.
        * PD: Sounds like a plan.
        * DE: So what do you think should be the name?
        * MP: "Temporal" was a "if this has to be global, this is an obscure name" solution.  Are people going to make fun of the name in 10 years?
        * DE: Have you heard anyone say "Temporal" is a bad name?
        * MP: No; the disagreement is mainly about the "civil" prefix.  (talks about the justification for the civil prefix.)
        * DE, RG, MP discuss prefixes.
        * DE: I want to propose that we set a deadline of the end of February for finalizing the spec.  Then we can release a polyfill on npm under @std/temporal, and everything will be great.
        * RG: Love it.
    * Polyfill in npm -- covered above
    * Conformance tests
        * PD: There's one main hiccup… on daylight borders, there could be multiple answers, so you really have to iterate over all of them to figure it out.  There is probably a better way to do this if you're in a browser implementing this in C, but not a performance test in JS.
        * DE: Performance or conformance?
        * PD: Oh, yeah, conformance is easy.
        * DE: Performance we can wait on until it's implemented in browsers.  I think conformance is a good thing to have so we can turn it into test262.  Does anyone want to volunteer to fill out the test suite?
        * MP: I will!
        * DE: Great!
    * Integration with ECMA-402
        * DE: I think this is important and SC could help.
        * MP: I'm happy to join the Ecma 402 meetings.
        * SC: Is this just sugar over date?
        * DE: Temporal has a richer data model than date
        * SC: Is it theoretically possible to write a pure JS library that converts from Temporal to Date with options for Intl.DateTimeFormat that creates a perfect localized string?  Is there anything in Temporal that Intl.DateTimeFormat simply doesn't support right now?
        * JW: Some of this stuff you could fake by making  a Date in 1970 or something with specific bits added, then use Intl.DateTimeFormat to format just those specific parts.  But mostly they’re quite different concepts.
        * ??: Nanosecond granularity?
        * SC: I think it does not make sense to have something like Intl.TemporalFormat; we should just overload Intl.DateTimeFormat.  I'm trying to think ahead to see if there is anything that Intl.DateTimeFormat needs to support that could be done in preparation for Temporal.
        * ??: Temporal and Date are quite different concepts; we can use Intl.DateTimeFormat but I think it needs a lot of internal wiring to be different.
    * Collecting and analyzing feedback
        * MP: This would be interesting
        * PD: It's early for this, since we need to get the polyfill out first
* - Date
    * Summarize TC39 status
        * RG: The proposal was accepted for Stage 1 in September 2018, and I'm starting to work on it more. There was enthusiasm; someone called it taking out the trash.
    * How specific do we want to be?
        * RG: My goal is to provide a safe subset that all implementations ship in the same way, and then have a neighborhood around that which must be rejected as invalid.
        * DE: I'd like to fully specify this, what do you think, Shane and Jeff?
        * JW: In theory, it would break existing websites to force everyone to do the same thing. It could be too many, it could be few enough that we could just do it.
        * RG: I'd like this to be a sequence of proposals.
        * JW: I could believe that proceeding in stages could be useful, if we're defining one bit of syntax, continuing on, we could collect in-field telemetry.
        * RG: It's also possible that we could end up in a good state where the spec says, if the input is not fully specified, then implementations are free to fall back to whatever, but it's recommended to take a certain action. When I talk about multiple proposals, I'm talking about two: the preferred syntax, and then defining it fully. I don't want to do nothing just because we can't do everything.
        * DE: Maybe we could start towards trying to define things completely, and then 
    * Do we want to propose adding new features to Date, or only to Temporal?
        * DE: I thought we were going to focus on adding things to Temporal, and not add things to Date.
        * RG: I agree, this is a good default position. I don't think we need to add timezones into Date.
        * MP: We looked into whether we could fix Date. I made a series of blog posts. There's no way Date will ever be immutable.
        * PD: We want people to migrate to Temporal. Shoehorning more things into Date is counterproductive.
        * DE: OK, sounds like we all agree, and I probably misunderstood about adding timezone syntax to Date. We won't do it!
    * Spec text, implementation, and tests?
    * [yulia] Mozilla is retracting [Date.parse fallback semantics proposal](https://github.com/tc39/proposal-date-time-string-format), will this be replaced?
        * RG: The Mozilla proposal was about extending the space of must-be-accepted, which is the second part we were talking about. I'
        * DE: So their goals are important, but I want to be flexible about whether this is in a second proposal or the first proposal.  I'm fine saying that this happens second.  Can we say one doesn't subsume the other?
        * RG: I think yes, the new one replaces the old.
        * JW: Realistically, I don't think there's anyone here who is likely to champion the old proposal.
        * PD: So the new proposal is not really subsuming the old one, but it's the prerequisites for extending the space?  So the new one is the foundation for the old one?
        * RG: Yeah, that's totally fair.
        * JW: I think the extension idea is sort-of right, but really it's more of a union.
* Next steps
    * Should we make this a recurring (e.g., monthly) meeting?	
        * Yes, will repeat monthly

