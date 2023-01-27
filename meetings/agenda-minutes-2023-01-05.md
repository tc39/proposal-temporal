# January 5, 2023

## Attendees
- Jason Williams (JWS)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)

## Agenda

### Any IETF update? ([#1450](https://github.com/tc39/proposal-temporal/issues/1450))
- USA still on vacation.

### Finalize rounding modes ([#1038](https://github.com/tc39/proposal-temporal/issues/1038))
- PFC: I marked this as Stage "3.5" in our bugtracker sweep last month, but can't remember what action is left to do. Can we close?
- RGN: Yes, verify that the behaviour matches NumberFormat and then close.

### Const aliases in polyfill ([#1222](https://github.com/tc39/proposal-temporal/issues/1222))
- PFC: I can't remember why we decided to put this on the agenda. Can we close?
- JGT: This was for making the polyfill robust against monkeypatching. That's more important for production polyfills. We can close it.

### `daysInMonth` last day of month ([#1315](https://github.com/tc39/proposal-temporal/issues/1315))
- PFC: This slipped off my radar.
- RGN: If it's an index then it shouldn't be named as if it's a count.
- JGT: `lastDayOfMonth` would be an obvious name for `daysInMonth`, but what about the other properties?
- RGN: What would make sense for `daysInYear` other than being a count?
- JGT: Which of `daysInWeek`, `daysInMonth`, `daysInYear`, `monthsInYear` would make sense as an index? Not `daysInYear`, `monthsInYear`.
- RGN: ???
- JGT: Essentially every time you render a calendar component you need to know the index of the last day in the month. Skipping days is really rare.
- RGN: Have both properties?
- JGT: I'm not sure that having both properties solve the problem because people will use one arbitrarily.
- RGN: If it's possible for the name to convey what it is for, we could rename it.
- SFC: It's not clear to me what the use case is for using this correctly. You should use date arithmetic in a loop until the month code changes. What are you then going to use the property for?
- JGT: Given that date skipping is so rare, I'd hesitate to make a common use case like that more complicated. One week in the 1500s and one day in one time zone.
- PDL: You might need to allocate space beforehand when you iterate, so you want to know the count beforehand.
- RGN: In those rare cases, don't you still need to allocate space for the skipped day in your layout?
- PFC: I'd argue that the Samoa transition in 2011 isn't an instance of this anyway, because `daysInMonth` is a calendar property, independent of the time zone.
- SFC: We solved these problems for years by having month codes and ordinal month numbers. Something like that for days would solve these problems too. Or we define that the day of month is an ordinal day of month and you have to use `toLocaleString()` to get the human day of month.
- PDL: There's no skippage in the ICU calendars.
- JGT: I'm not sure about that?
- PDL: In the Gregorian calendar, I mean. But if you're not on the proleptic Gregorian calendar, this property makes no sense anyway. The calendar can define it.
- JGT: My understanding is that some of the non-ICU calendars have a Gregorian transition, so they will skip days.
- PDL: Non-ICU calendars can do anything they want including skip days, so the assumption that months are contiguous is meaningless anyway.
- Summarizing:
  - One option is to rename the property to lastDayOfMonth and leave everything the same
  - One option is to do nothing
  - One option is to change it to be the 1-based index of the last day
  - Add a second property so we have both
- RGN: We had previously agreed to change it to the 1-based index, and both PFC and I forgot about it. Looking at it with fresh eyes, I think it doesn't make sense to do that in light of the naming. Things are consistent in the spec, just not consistent with the earlier decision.
- JGT: My suggestion is to rename.
- PDL: I don't want to lose the ability to get a count of daysInMonth.
- JGT: I don't want two properties because they'll be misused arbitrarily.
- RGN: Renaming it would make it inconsistent with all the others.
- SFC: I don't think the inconsistency matters because we don't have a coherent story like we do with `era`/`eraYear`. The most compelling story I've heard is allocating the number of boxes in a calendar component.
- PFC: I'm assuming there are no skipped days in any current ICU calendars. That's something we can investigate and verify. We got a strong negative signal about adding new APIs from TC39 when we added `yearOfWeek` in November. I think we should collect more information offline about use cases, but I'm leaning towards doing nothing. Unlike `yearOfWeek`, either of these quantities are easy to obtain using existing APIs:
  - Count of days in month: `date.with({day: 1}).until(date.with({day: 1}).add({months: 1}), {largestUnit: 'days'}).days`
  - Index of last day in month: `date.with({day: 1}).add({months: 1}).subtract({days: 1}).day`
- JGT: Agreed, postpone and research.
- SFC: There is a strong interest in adding a Julian-Gregorian calendar in ICU.
- RGN: Even if not, it's the kind of thing that user code could certainly add.

### `era`/`eraYear` in 262, again ([#2169](https://github.com/tc39/proposal-temporal/issues/2169) / PR [#2442](https://github.com/tc39/proposal-temporal/pull/2442))
- How to proceed?
- SFC: I don't understand JHD's comment.
- PDL: I would ignore this and merge the PR.
- JWS: Did he not bring this up when the issue was discussed in plenary?
- SFC: I wanted to make sure we had the narrow discussion in plenary, about whether it is legal for 402 to extend primordials. The answer was yes. Now I feel like the argument has shifted to the universal polyfill. So we need to discuss the problem as it relates to Temporal.
- JWS: So we should discuss this again in plenary with a more narrow scope?
- SFC: Now that the issue is settled we can give a recommendation from the champions group.
- PDL: The vibe I got from plenary was "why are you even asking this?" We have an answer already, I'd like us not to bring this to plenary again. The burden should be on JHD if he disagrees.
- JWS: I'd like to merge this if we can get away with it, but we can wait if we need to.
- PFC: We can ask for clarification on the universal polyfill use case while being firm that we already got a clear signal from the plenary.
- SFC: I think it would not be correct to categorize the conclusion of the plenary topic as that clear-cut.
- Conclusion: Leave open for 3 weeks and mention in the presentation.

### Remove fallback paths in CalendarFields and CalendarMergeFields ([#2310](https://github.com/tc39/proposal-temporal/issues/2310))
- With [#1808](https://github.com/tc39/proposal-temporal/issues/1808) the case where the properties can be deleted off the prototype won't occur.
- JGT: It's pretty rare to make custom calendars, if we want to simplify the spec but it makes custom calendars slightly harder, that still seems reasonable to me.
- PFC: Agree.
- RGN: Agree.
- SFC: Seems like custom calendars should implement all the functions.
- PDL: You could derive from an existing calendar if you wanted a default implementation.
- JWS: Seems like most custom calendars would do that anyway.
- Conclusion: Do this

### Forward progress checks when calling user-controlled methods ([#2356](https://github.com/tc39/proposal-temporal/issues/2356))
- PFC: I'm mildly negative about this because no matter what checks you put in, it's always possible to write a custom calendar that will go into an infinite loop. The calendar math is already complicated enough.
- PDL: Strongly opposed, we have no proof that the underlying assumption is true.
- RGN: We don't know what use cases custom calendars might have. (Facetious examples: Calendar chronicling the life of a time traveler; Groundhog Day)
- SFC: It would be hard to add this later if we did not add it to start with. Anba's example is pretty good.
- PDL: You can add that check to Anba's calendar manually.
- SFC: We were just talking about the use case for looping over the days of a month with calendar arithmetic.
- RGN: If you're using someone else's custom calendar, you don't have any guarantees anyway.
- SFC: The calendar specification can state in prose that methods must behave this way.
- PDL: The effect of that is the same as if we do nothing at all. The calendar author documents the interface, and the calendar consumer relies on that. Adding a restriction would only eliminate possible use cases and complicate the spec.
- SFC: I'm thinking about it in terms of the contract of the calendar protocol. In Rust, you might write a bullet-point list of safety requirements, that someone implementing the trait must adhere to.
- PFC: Concretely, you are talking about adding a note to CalendarDateAddition?
- SFC: Maybe an uncontroversial requirement would be to say that if the duration is positive, the resulting date may not be before the receiver.
- RGN: CalendarDateAddition wouldn't be encountered in a custom calendar anyway. Does it even belong in the spec?
- SFC: Client code needs to point to something in order to make decisions.
- RGN: Right now there is no specification of the protocol.
- PDL: The built-in calendars are precisely defined by ICU. The custom calendars are not.
- Conclusion: We won't add the checks to the algorithm steps. Move the issue to the stage 4 milestone. PFC to ping SFC and RGN once that is done, to propose where to add a prose description.

### Modify values returned from invoking calendar methods ([#2443](https://github.com/tc39/proposal-temporal/issues/2443))
- RGN: Basic position is that when you write a custom calendar, you should be expected to do things correctly. Same argument here.
- PFC: My hesitation would be that that was a justification for simplifying the spec, but here it is already simple.
- RGN: The algorithm steps might not be simpler, but the concept becomes simpler.
- SFC: For me this is the same as the previous question. If you are writing a custom calendar you need to return the correct type from the method. I don't have a strong opinion on whether a wrong type is coerced or an exception is thrown.
- PDL: I see it differently from the previous question. I objected to validating the semantics in the previous question, but I'm happy to validate the syntactic question here. I think we shouldn't coerce those values.
- RGN: I provided a few examples in the issue of other calendar and time zone methods that don't coerce. So there is a consistency argument as well.
- SFC: Valid values for `era` and `eraYear` aren't things that the Temporal spec is expected to know about.
- PDL: We know the type, though.
- SFC: If the Temporal algorithm doesn't require an invariant to be upheld, then there's no reason to enforce it.
- RGN: The only purpose that CalendarEra and CalendarEraYear serve is to back the getter implementations.
- JGT: I propose we just throw. Custom calendars can be held to a high standard.
- SFC: I generally come down on the side of garbage-in-garbage-out.
- RGN: Coercion is worse than garbage-in-garbage-out.
- PDL: ???
- SFC: Looking at [#1229](https://github.com/tc39/proposal-temporal/issues/1229), we documented the types we expected.
- PDL: We said that "Temporal will do validation". In that case, we don't coerce, we have to throw.
- RGN: Syntactic validation. You must have given something of the right shape, but what it means is up to you.
- JGT: Propose the conclusion to change this to throw if the type is wrong.
- SFC: Slight preference for keeping the status quo but I won't object to the change.
- RGN feels strongly that coercion masks bugs and makes it harder to reason about the behaviour of a system.
- Conclusion: Make the change.

### Builtin calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- From last time: Open discussion is about keeping/removing the nested property bag. Contemplate our stances on the preference of reducing the set of changes vs reducing complexity.
- JGT: RGN did the research on `Id` versus `ID` in TC39. The only instances are in internal variable names in the spec. Users are going to be familiar with things like `getElementById()`.
- PDL: I agree with DE that we should avoid jurisdictional fights and reference the W3C documents.
- JGT: I recommend we go to plenary with `Id`.
- PFC: Re. the dependent issues with nested property bag etc., I propose we just go ahead with [#1808](https://github.com/tc39/proposal-temporal/issues/1808) and see how the dependent issues shake out.
