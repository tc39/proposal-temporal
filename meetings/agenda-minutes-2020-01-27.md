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
    * #[260](https://github.com/tc39/proposal-temporal/issues/260) Why do constructors accept invalid input, e.g. new Temporal.PlainDate(2019, 13, -7)?
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
        * DE: What if we made toString just return [Object Temporal.PlainDateTime] and toISOString serialize it and throw on non-ISO calendar?
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

