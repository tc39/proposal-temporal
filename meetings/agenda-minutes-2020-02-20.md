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
    * JWS: Sounds like it's in line with precedent.
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

