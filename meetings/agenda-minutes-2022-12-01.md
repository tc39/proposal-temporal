# December 1, 2022

## Attendees
- Shane F. Carr (SFC)
- Ujjwal Sharma (USA)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Jase Williams (JWS)

## Agenda

### Era and eraYear getters in 262 ([#2169](https://github.com/tc39/proposal-temporal/issues/2169))
- SFC: Propose that we add a non-normative note in 262 that says there may be other properties defined in 402.
- SFC: We also had a suggestion during the plenary item to have `.getCalendarField('era')` so that we don't need to extend the prototype. Maybe worth considering.
- USA: I'd consider that maybe if we had more widespread opposition to extending the prototype.
- PFC: I'm not sure how `getCalendarField()` would work with property bags, e.g. `PlainDate.from({ era: ..., eraYear: ..., ... })`
- SFC: You'd still put the properties in the property bag, but you'd access them through the method.
- PDL: It seems less consistent to me. There's a symmetry between putting a Temporal object with these properties in and a property bag.
- SFC: Makes sense. Can someone explain how this process currently works with the change we're making to the calendar getters?
- PDL: If the property bag is a Temporal object and [[Calendar]] is a string, you use the builtin methods, and if it's a property bag you read the `calendar` property.
- SFC: That's compelling. Let's dismiss the `getCalendarField()` idea then.
- PFC: Do we need to mention that a non-402 implementation may add properties to the prototype as well?
- PDL: The consensus we reached is limited to 402.
- SFC: We do already have [section 19](https://tc39.es/ecma402/#locale-sensitive-functions), with `toLocaleString()` and other definitions. That seems like an appropriate place to put this. 
- RGN: Care is probably required here. I don't think there are any parts of the 262 spec that prohibit extension by default. It would be unusual to prohibit extension.
- PDL: I didn't mean that only 402 is allowed to extend, but the consensus for the note is to refer specifically to 402, and neither deny nor endorse extension by anyone else.
- RGN: I agree, the general form exists elsewhere. "An implementation supporting ECMA-402 may extend this prototype ..."

### Builtin calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- PDL: The topic of `getCalendar()` is resolved after the presentation?
- PFC: I intentionally left it open what the exact form of the API is.
- PDL: I won't die on the hill of not having `getCalendar()`.
- PFC: Same.
- PFC: I have some notes from starting the implementation, with open questions.
- PFC: Should `Temporal.Now.timeZone()` return a string? I say yes.
- PDL: You're saying this because we don't want to create superfluous objects when we don't need them? To create the object you would say `Temporal.TimeZone.from(Temporal.Now.timeZone())`.
- RGN: I agree strongly that it should return a string. Otherwise you'll have accidentally custom instances.
- PDL: Agreed.
- USA: On the other hand, that's also kind of a footgun because none of the other `Temporal.Now` functions return a string. They all return instances.
- PDL: To be consistent, `Temporal.Now.timeZone` would have to be a getter for the time zone string. In which case I'd rename it to `Temporal.Now.timeZoneId`.
- USA: That would work.
- RGN: Is this a value that can change over time? It shouldn't be a getter.
- SFC: Yes, time zone can change during execution.
- RGN: It should be a function in that case.
- PDL: So, `Temporal.Now.timeZoneId()` is a function that returns a string. `Temporal.Now.timeZone()` is removed. Consensus?
- Consensus.
- RGN: and _if_ we later wanted to introduce a function to get the instance, we'd make it have a more awkward name than `timeZoneId`.
- PFC: Does anything change about the implementation of [CalendarEquals](https://tc39.es/proposal-temporal/#sec-temporal-calendarequals) or [TimeZoneEquals](https://tc39.es/proposal-temporal/#sec-temporal-timezoneequals), e.g. in difference methods to determine whether the two objects have the "same calendar"? (Do they change from calling `toString()` to getting `id` or `calendarId` on the instance?)
- PDL: I like the `toString()` version but I don't have a rationale for why. Is there a compelling reason not to go with `toString()`? Otherwise we should stick with the status quo.
- Consensus: stick with the status quo.
- PFC: Next question is about ISO strings and property bags as `calendar` properties in property bags. Do we want to keep this behaviour? IMO it makes less sense now that we have strings and property bags meaning something specific. E.g.
   ```js
  Temporal.PlainDate.from({ year: 2022, month: 12, day: 1, calendar: '2022-11-30T01:23[u-ca=gregory]' })
  Temporal.PlainDate.from({ year: 2022, month: 12, day: 1, calendar: { calendar: 'gregory' } })
  ```
- PDL: I think this is no longer necessary and I'd get rid of it. What I would keep is passing a Temporal object with a [[Calendar]] slot.
- PFC: I'd keep that as well.
- RGN: Mild preference for dropping this.
- PDL: I generally agree, because introducing string-as-calendar creates some ambiguity.
- RGN: ISO string is not a monolithic concept. You can parse it as a PlainDate, PlainDateTime, etc. If you want a calendar from e.g. a zoned datetime string, you parse it as a ZonedDateTime and extract the calendar.
- SFC: You pass an ISO string into Calendar.from in order to get the relevant part of the string, without instantiating a separate object. I'd keep that.
- RGN: I'd object to that because ISO strings are not just one concept.
- USA: (missed)
- PDL: I agree with Richard on this, it does give me an odd feeling to not specify which rules to parse the ISO string under.
- JWS: As a user who has a string with a calendar annotation, being able to pass it in here would be something I'd expect.
- USA: We also already made the design decision to let other `from()` methods extract the relevant parts of a string.
- JWS: We already made the design decision to default to ISO 8601 if we got an ISO string without a calendar annotation.
- USA: Maybe I gave the wrong example. E.g. PlainTime
- RGN: PlainDateTime is a superset of PlainDate and PlainTime, but Calendar isn't a superset of anything and doesn’t have any supersets.
- PFC: You could say that all ISO strings are a superset of Calendar; they either contain a calendar annotation, or they indicate the ISO calendar by omitting the annotation.
- PDL: Calendar and TimeZone don't actually contain any data in themselves, they are kind of like "time metadata". They are about how you calculate the time rather than what the time is. I think we might have made a mistake in the status quo.
- SFC: The other `from()` methods of Plain types reject strings with a `Z` because we thought that would be a footgun. There would be a precedent for rejecting some kinds of ISO strings. But I don't understand why we need to revisit this.
- PDL: Worth revisiting because things have changed with the value of [[Calendar]] potentially being a string.
- USA: How is passing a Temporal object with [[Calendar]] slot different from passing in a timestamp string.
- PDL: Paraphrasing JWS' question, we have a status quo, is there a strong reason not to maintain the status quo.
- RGN: That's subjective, what defines a strong reason? I'd say a meta-argument is that we, the authors of this proposal, aren't even sure how this mechanism works.
- JWS: I feel strongly about maintaining the status quo. It'd be a shame to lose the ability to parse ISO strings into instances.
- SFC: RGN, can you summarize your reasons for wanting to drop that?
- RGN: (1) Potential ambiguity from not knowing how to interpret a string; (2) complexity and the resulting confusion from it, people not having a good model of how it behaves; (3) as opposed to the other places where a string is parsed, the subset-superset relation doesn't exist.
- SFC: The way that I think ambiguity is resolved, first you try to parse it as a calendar ID, if that doesn't exist then as an ISO string.
- RGN: ISO string isn't a singular concept.
- SFC: I see ISO string as a bag of fields; many of them are optional.
- PDL: I mildly agree with RGN but ultimately I don't see enough motivation to depart from the status quo.
- SFC: How would you feel if the parsing of an ISO string in Calendar.from would fail if the string didn't contain a calendar annotation?
- RGN: I think that'd be an improvement over the status quo.
- RGN: I don't feel so strongly that I'd try to rebut an argument about relitigation. I think it'd be better to have something with clear behaviour and a data model that can be understood, but we don't have that now. If we want to close this question I'd accept that.
- JWS: The difference is that we would throw if the string didn't have `[u-ca=...]`?
- RGN: Yes.
- SFC: An example of a string that parses as a ZonedDateTime but not a subset (PlainTime) is a string with `Z`. So the subset invariant doesn't hold.
- RGN: I think it's a category error to include Calendar and TimeZone as subsets.
- PDL: Agreed, "time metadata".
- PFC: Another thing we could consider is to depart from the invariant that anything you pass to Calendar.from, and allow ISO strings in Calendar.from but not in property bags.
- SFC: Any position where we accept a Temporal type instance…
- PDL: In my mind, `$type.from(propertyBag)` was never intended to be recursive.
- PFC: It was intentional and discussed many times, but I think it makes less sense now that time zones and calendars can be strings.
- PDL: (missed)
- (Sorry, there was a bunch of discussion around this point that I missed)
- SFC: This currently works:
`Temporal.PlainDate.from({ calendar: { calendar: "2020-01-01[u-ca=gregory]" }, year: 2020, month: 1, day: 1 })`
- RGN: Even worse, so does this!
`Temporal.PlainDate.from({ calendar: { calendar: "2020-02-02" }, year: 3030, month: 3, day: 3 })`
- SFC: Is there anyone who would object to keeping the status quo except for throwing if the ISO string doesn't contain an annotation?
- PFC: To me, that doesn't remove any of the complexity from the proposal, but it does remove convenience.
- USA: ISO 8601 as the default calendar
- What is the status quo?
  - Calendar ID
  - ISO string with annotation (with arbitrary components missing)
  - ISO string without annotation, defaulting to ISO 8601
  - Temporal object with [[Calendar]] internal slot
  - object (presumably implementing calendar methods)
  - Property bag with `calendar` property, interpreted recursively up to depth 1
- SFC: Note that `Temporal.Calendar.from("T00:00")` does not currently work.
- SFC leaves but votes for accepting an IXDTF string but requiring an explicit calendar annotation in that IXDTF string.
- PDL: I see two issues: one for the nested property bags, [#2104](https://github.com/tc39/proposal-temporal/issues/2104), and one for `from()` accepting ISO strings (probably generalizes [#2105](https://github.com/tc39/proposal-temporal/issues/2105).) Both of these issues represent unanticipated complexity resulting from earlier decisions. For next week we should also contemplate our stances on the preference of reducing the set of changes vs reducing complexity.
- RGN: That connects to the other big potential change around "too many" observable calls: [#2289](https://github.com/tc39/proposal-temporal/issues/2289), [#2290](https://github.com/tc39/proposal-temporal/pull/2290#discussion_r895404543), etc.