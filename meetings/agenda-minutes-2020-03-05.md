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

