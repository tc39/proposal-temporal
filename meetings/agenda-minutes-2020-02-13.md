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
    * SFC: Some calendars have concepts/fields that are not in others. Should we stick the union of all calendars' fields on Temporal.PlainDate[Time]? Or maybe there's a way to forward all requests to the calendar object?
    * DE: We could make Temporal.PlainDate[Time] an exotic object, like a proxy, but that seems overly complicated. I'd rather throw (for missing method) or return undefined (for missing property)
    * PDL: Let's think about year and era as an example. Does era always show up or only when the calendar has an era?
    * DE: I think all the getters should be on Temporal.PlainDate[Time].prototype and just return undefined if N/A.
    * PDL: That means we have to add all possible fields now.
    * DE: We can add fields in the future. If there is something really unusual then the calendar can expose a method, which wouldn't be the same API but it would be OK.
    * PDL: Another possibility is to bundle era and year, since they are related, and have '.year' return a string including the era. If you really need the separate bits then you can query the calendar.
    * DE: I feel that this is overly complicated.
    * PFC: I'm not a fan of the year getter returning a string, it seems like it would have sorting implications and possibly localization as well.
    * SFC: If you introduce a custom calendar with a new field, you can always polyfill your field onto Temporal.PlainDate[Time].prototype.
    * PDL: +1
    * DE: Summarizing, the calendar-specific date and time properties are all on the prototype and return undefined if not present.
    * SFC: For any field that exists in any specced calendar, we have getters on Temporal.PlainDate[Time].prototype. When you call those getters, they access the a method on the calendar slot, and it's up to the calendar to define the behaviour. If the method doesn't exist, then the getter returns undefined.
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

