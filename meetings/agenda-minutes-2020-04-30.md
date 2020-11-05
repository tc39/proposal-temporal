# Apr 30, 2020

## Attendees:
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Jase Williams (JWS)
- Shane F Carr (SFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)

## Agenda:
### How did the NearForm podcast go?
- PDL: Good. It's not published yet, but I'm happy.
- USA: Recently we got a pull request from someone improving the wording of the README. Once the podcast is out, I hope we'll get more interest like that.

### [#294](https://github.com/tc39/proposal-temporal/issues/294), idToCalendar / idToTimeZone; follow up after discussing with SES?
- RGN was going to discuss this with SES but he's not here yet.

### [#262](https://github.com/tc39/proposal-temporal/issues/294), calendar priority for toLocaleString()
- SFC: This is really going to be influenced by the default calendar. Let's defer this. I'd really like to write a larger document comprehensively detailing the default calendar.

### [#523](https://github.com/tc39/proposal-temporal/issues/523), calendar-dependent compare()
- PDL: I don't think this comparison is valid in the first place.
- SFC: We're talking about comparing dates within the same calendar, not across calendars. I agree we should throw when comparing YearMonth and MonthDay across calendars.
- PDL: Then you don't need the reference fields.
- PFC: You don't need them if you delegate to the calendar.
- SFC: The problem with MonthDay is that a calendar can pick different reference years. If we don't delegate comparison to the calendar, then calendars should have to pick reference years such that the comparison always works out.
- PDL: Is there any reason not to delegate it to the calendar?
- PFC: Less burden on calendar implementors.
- PDL: The benefit is that the calendar can actually make an intelligent choice about what to do when comparing cross calendars.

### [#517](https://github.com/tc39/proposal-temporal/issues/517), comparison operators
- SFC: When I was playing around with the polyfill I noticed that the comparison operators work a dangerously high amount of the time, but not all the time. ISO strings can't be compared if the year is negative. JHD suggested that if we _can_ make comparison operators work, then we _should_. Various ideas include limiting to positive years, or use valueOf with a bigint.
- PDL: valueOf with a bigint is dangerous. valueOf was designed to be a number.
  - DE (commenting after the meeting): I disagree with this. BigInt.prototype.valueOf has always returned a BigInt.
- JWS: It's a primitive, no?
- PDL: What's `String(1).valueOf()`?
- SFC: There's also Symbol.toPrimitive, so we could do it with that.
- PDL: In previous discussions we always encountered this as a problem. If we use Symbol.toPrimitive, then we could cast them all to bigints which are sortable. I suggested this about a year ago and got a lot of responses saying that we couldn't do that with bigint. Admittedly bigint was less established then.
  - DE (commenting after the meeting): This was not the reason. It was that this would permit incorrect comparisons between types.
- SFC: We should ask the people who were not in favour at the time.
- PDL: DE was one of them.
- RGN: For Absolute, I understand the reason why it doesn't work with Number and it does with BigInt. What is the number you get for a DateTime?
- PDL: Because it doesn't have a time zone, we can just always cast it to UTC, there is no weird time zone behaviour.
- RGN: Is it then possible to compare a DateTime with an Absolute?
- PDL: Yes, that would be possible, and maybe even correct if we use the default time zone?
- RGN: I don't necessarily support that we should say that that comparison is meaningful. We have to take it into account though.
- SFC: That's unfortunate.
- RGN: Although you can take a legacy Date object right now and compare it with a string.
- PDL: For Temporal.PlainDate, we can take the number of days since the epoch since that is the granularity we're working with.
- SFC: For MonthDay, we'd use the reference year and days since the epoch.
- PDL: You could use day number in the leap year.
- RGN: Reference year or epoch doesn't matter in this case.
- PDL: For calendars this would get difficult, since the calendar implementor would have a lot of restrictions on choosing the reference year.
- RGN: The only restriction for implementors is that they pick a reference year with all the possible MonthDays in it.
- PDL: Is that even possible?
- RGN: No.
- RGN: We could stipulate that the calendar chooses a primitive that preserves the comparison order.
- PDL: Then you can't guarantee the comparison order because you don't know the calendar. I think we either give them a very strict choice, or you have to delegate toPrimitive to the calendar, which is even worse in my view.
- SFC: If we say that cross-calendar comparisons are out of scope, then the calendar can just pick reference years that make the comparison work.
- PDL: That's the same problem with something working just frequently enough to be dangerous.
- RGN: It's also possible to make toPrimitive throw. That might be the answer to MonthDay.
- SFC: Another idea is to use refYear 1900 for MonthDays in January, 1908 for MonthDays in February; there are enough dates between
- PDL: I'd find that really difficult for calendar implementors.
- SFC: We have to pick _some_ primitive space.
- PFC: We could use the string representation for MonthDay. But then it would only be comparable within the same calendar.
- RGN: MonthDay really is the odd one out.
- SFC: JHD would say, January 1st is less than January 2nd, why would we want to throw? This is the argument PFC has been making, we don't want to make the API do weird things because of the existence of calendars.
- RGN: Is there an example of a calendar where you cannot compare MonthDays directly?
- SFC: In the Chinese calendar, leap months occur very rarely, and in a leap year one of the months is chosen.
- RGN: What we're talking about here is comparison via the operators. In toPrimitive, the context of "comparison" is lost, all you know is that you have to convert yourself to a primitive. For MonthDays within the ISO calendar, it is for sure possible to say "here is how far I am within a reference year." The question is, would that work for all calendars we know of?
- SFC: Related question, do we have an issue open for what is the ISO string representation of a non-ISO-calendar YearMonth and MonthDay?
- RGN: In ISO 8601, it's Xs if unspecified, and I think I've seen an empty component as well, although maybe that was only in RFC 3339.
- SFC: We could say those operations are allowed on the ISO calendar but not on any other.
- SFC: I also don't know if we have an issue open for this, but there are calendars that don't go back all the way in the past, should those throw?
- RGN: My gut feeling is yes.
- RGN: If we use lexicographical comparison for MonthDay, is there any reason we couldn't do that?
- SFC: What does a non-ISO calendar do in that case?
- RGN: Map it via refYear into ISO.
- SFC: That doesn't work in all cases.
- PDL: We are assuming that all calendars have a numeric representation of months. For calendars where a month might not exist in a given year, do we put all the possible months in the order that they _could_ occur and have holes in the years in which they don't occur?
- SFC: Another observation of MonthDays that makes them different from the other types, is that the number of them is bounded. There are only 366 possible ones. We could use 0 for January 1, 10 for January 2, 20 for January 3, etc., and let the calendars interleave themselves however they prefer.
- RGN: So it seems that toPrimitive really does need to be delegated to the calendar.
- SFC: If we didn't want to do that, then we could make that primitive part of the data model instead.
- PDL: A leap month disturbs the ordering of months in two given years relative to each other. If we didn't have that, we could just number the months and days through. It's only when you introduce leap months that you have a doubling-up of a month number. For calendars with leap months, we could require the calendar to number its months _including_ any possible leap months. That would allow us to just take the day and the month, and use that. As long as the number of months and days are <100, then it works.
- RGN: toPrimitive would produce a MM-DD string.
- PDL: I think allowing comparison only within the same calendar is fine for MonthDay. For everything but MonthDay, it would be possible to compare across calendars.
- SFC: Regarding the numbering of months, are we still delegating that to the calendar or do you propose putting that into the data model of MonthDay?
- PDL: I'm behind relative to you on the merits of the refYear / refDay data model. It seems to make sense to use the calendar data model for the partial types.
- SFC: We can relitigate that, but it's issue #390 and #391. If we do, we should read back on what led to that decision.
- PFC: My gut feeling is that it would make this easier but make other things harder.
- SFC: If we go with RGN's suggestion then inter-calendar comparisons don't work.
- RGN: I'm not sure we need to make those work.
- SFC: If they don't need to work, then the system I proposed with days since epoch also works.
- RGN: I'm not sure that's true. If there are different ref years
- SFC: It's up to the calendar to pick a ref year that makes those comparisons correct.
- PDL: Putting constraints on how the calendar picks the reference year makes implementing a calendar harder than it needs to be.
- SFC: Agreed, this is not optimizing for the simplicity of the calendar implementation, but I don't think we do need to optimize for that.
- PDL: I don't have a problem with making implementors think about the reference year, but this way we are doing a lot of magic with it. I agree that calendar implementation ergonomics are not our primary concern, but I'm concerned about the magic.
- RGN: What are the current uses of refYear?
- SFC: There are none, it's only for allowing the calendar to disambiguate.
- RGN: PDL, what mechanics are you actually proposing for `MonthDay.prototype[Symbol.toPrimitive]`? Is it going to call out to the calendar?
- PDL: Yes. I don't think we can avoid that and still preserve some sanity for calendar implementors.
- RGN: My preference is, once that call is made, it ends there. It's the responsibility of the calendar to pick a suitable primitive.
- PDL: My preference in the ISO calendar is to return the day number in a leap year, then if another calendar wishes they can interleave with that.
- RGN: Equivalently, we can do strings. You can get equivalent power if you do MM-DD.
- SFC: I like numbers because real-valued numbers allow interleaving.
- RGN: Strings also allow interleaving.
- PDL: Numbers allow for better interleaving. The string is also something that humans will read, and my worry is that people will start constructing and interpreting them, and that's not a legitimate use case. I'd rather see that we mention as a side note in the Symbol.toPrimitive documentation what the ISO calendar does.
- RGN: I have no preference for string vs. number, but both are internally consistent.
- SFC: I think it's weird to have toPrimitive delegate to the calendar at all. toPrimitive should be a representation of your own data model. What if the calendar starts making http requests or something like that? TC39 isn't going to like that.
- RGN: What do you imagine the data model of `MonthDay.prototype[Symbol.toPrimitive]` looks like?
- SFC: Use the reference year and do epoch days.
- RGN: That refers to the ISO calendar years?
- SFC: Yes.
- RGN: That doesn't work for January vs. March year start, e.g. in the Chinese calendar.
- SFC: I have to drop off for the time being, I'll post a more detailed explanation in the issue.
