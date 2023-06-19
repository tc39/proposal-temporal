# Nov 12, 2020

## Attendees:
- Daniel Ehrenberg (DE)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Younies Mahmoud (YMD)
- Philipp Dunkel (PDL)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)

## Agenda:

### Progress towards TC39 meeting
- PFC: Explains progress on open issues.
- DE: Explains the purpose and the status of the presentation.
- PDL: As discussed last week, we won't ask for a stage advancement until we have polled the reviewers.
- DE: The designated reviewers are a subset of the people in the committee who actually will be reviewing the proposal. They aren't a set of people you can poll.
- PDL: We won't be pushing people, we'll ask if the committee is comfortable.
- DE: We also want to say that we're open to more feedback, but we stand behind the proposal as is, and we are not iterating anymore. Changes should originate from reviews.
- DE: Do we want people to fill out the feedback survey or open new issues?
- PFC: I think people should open issues, but we treat them differently than before. We'll be more likely to close them or move them to proposal-temporal-v2.
- PDL: Some issues have been more noise than helpful, when they relitigate things that we have already thought about carefully.
- PFC: Many questions on the current feedback survey are outdated.

### Time calendars
The Ethiopian use case seems to be more like AM/PM than a different calendar. Ethiopian AM/PM cases are apparently orthogonal to date calendars, e.g. Gregorian date with Ethiopian time, Gregorian with AM/PM. CLDR isn’t supporting time calendars for Ethiopic: https://unicode-org.atlassian.net/browse/CLDR-9716

Notes from the CLDR issue:
> However, users may still refer to the day of the week / day of the month as pertaining to the 'western' time cycle. So it seems that the calendar may flip over to a new day at midnight (whether it's Gregorian or Ethiopic), just as in 'western time'. The Ethiopic time may only affect the time of day.
> 
> An exception to the above might be relative time. If I woke up an hour before sunrise this morning, I stayed up until "11 yesterday" (11 hours after sunset = 5 AM = 05:00).

- JGT: I'd like to understand the NYSE calendar use case ([#1177](https://github.com/tc39/proposal-temporal/issues/1177)) better because that was the problem with Ethiopian calendars, we didn't understand the use case well enough before we designed the feature.
- PDL: What is the problem with Ethiopian calendars?
- JGT: The time reckoning is just like AM/PM but shifted 6 hours.
- PDL: No, the date flips over 6 hours later than in Gregorian.
- JGT: We thought that, but as far as we can tell that's incorrect. My understanding from reading the CLDR issue and talking with SFC is that the date flips at midnight.
- PDL: That's not my understanding. What would be Nov 1 05:00 in our reckoning would be Oct 31 23:00 in the Ethiopian calendar. I believe there is also disagreement about this within Ethiopia.
- (The comment in the CLDR issue is slightly unclear about this. It says the date flips over at midnight but 05:00 is "11 yesterday".)
- PDL: Even if CLDR doesn't support Ethiopian we should not make it impossible to support.
- DE: I don't think adding hooks just in case is a good way to design software.
- SFC: It's important to have date calendars in the business logic because "add a month" is a calendar-dependent operation. In time calendars, hours are still hours, so it can be in the presentation layer. I agree with JGT's point about the Ethiopian hour cycle being like AM/PM.
- PDL: The reason why I think it will work and that having a combined calendar is the better choice, is that I can always take a date calendar and include it as part of my pure time calendar, because of how inheritance works. If I have a pure date calendar and it lacks the time capabilities then that doesn't work in V2. That said, I'll abstain from this.
- JGT: It seems risky because we don't understand the use cases and might foreclose implementing them properly when we understand them better. The chance of getting it wrong seems high since we have no current users of the feature.
- SFC: I agree with PDL that it seems better to have a combined date/time calendar but I also agree with JGT that it seems better to understand and do it properly. 402 is not going to be using it anytime soon. If we do have this feature, don't put it in because we think that 402 will be using it. We should only add it if we feel that we know enough about the problem. Otherwise I will abstain from this decision.
- JGT: I would strongly recommend removing it.
- PFC: Agreed.
- DE: I like the idea of taking it out but I'll abstain.
- USA: Consensus seems to be remove it.
- SFC: I do feel that we should keep all the methods and slots named such that we can still add time calendars in a forward compatible way.
- PDL: I think times should still have a calendar property with some value, even if it is inoperative. Otherwise you can pass them to `with()` and then your app will break when time calendars are added.
- JGT: This code will break in the presence of time calendars either way: `plainDateTime.with({...time.getFields(), calendar: undefined})` If they end up separate, then we could give them separate fields, and if they end up being the same thing, then we could say that the date calendar wins in order to preserve compatibility.
- PDL: To me the only likely outcome is that time calendars and date calendars are the same thing.
- JGT: How do you envision the Ethiopian calendar working where the date and time reckoning are separate?
- PDL: The ISO calendar implements a midnight-to-midnight day. Another calendar might implement a 6AM-to-6AM day. I don't think it makes sense to make a separate field since date/time calendars being the same thing is the only thing that makes sense for me. We'd be eliminating the only solution that seems likely.
- JGT: If the way that a calendar works is that its fields change, then the code that I mentioned will still break. If code assumes that the values of the fields are always equal to the ISO fields, then the values will change.
- SFC: If we remove the calendar slot from PlainTime then you can pass PlainTimes to `with()`. Most of the discussion about how to resolve mismatched fields is very theoretical. We've decided to go the strictest route. If we add time calendars then we'll have a lot more basis to make a reasoned decision about how to consolidate the calendar properties of dates and times.
- PDL: That's wishful thinking about the problem solving itself.
- DE: Would one way to resolve that be making a DateTimeCalendar class that delegates to both a date and a time calendar?
- PDL: No.
- SFC: Adding slots is probably not going to be web compatible. One idea is renaming PlainTime to ISOTime and saying that it will never gain a new slot.
- USA: I'd rather keep the calendar slot and property. That means you still can't pass it to `with()`.
- PDL: Agreed.
- JGT: That would break existing code in the way that I outlined:  `date.toPlainDateTime(tz, time)`
- PDL: If we keep the calendar slot, then the only way the code would break is if the developer changes the time calendar when that becomes possible. If we don't keep the calendar slot, then unchanged code that is loaded in a web page could break. Keeping the calendar slot is preferable because it only requires changes if you are already updating your code.
- JGT: The time could come from a time picker and have the calendar that way.
- PDL: That would require a code update as well. Libraries don't update themselves.
- JGT: The ecosystem wouldn't be able to update in that case.
- PDL: The important thing is not breaking the web. If code breaks where the only thing that's changed is a new browser version, that's breaking the web. If you have to opt in, that's not breaking the web.
- JGT: If a future version of the HTML time picker returns a PlainTime, does that mean it could never return a PlainTime with a non-ISO calendar?
- PDL: Yes.
- JGT: Another proposal I had was date calendars overriding time calendars.
- USA: Strongly against, because I don't think it's an accurate assumption to consider date calendars as having more weight.
- PDL: Agreed.
- SFC: I think there's a strong use case for having time types in the `with()` method. If we don't do that then there will be Stack Overflow cases saying 'delete the calendar slot', and that is bad for l10n. I think removing the calendar slot is best and I don't agree on holding the ergonomics of combining dates and times hostage in v1 to accommodate the possible future addition of time calendars.
- PDL: I'd like to put a hold on the decision to remove time calendars in light of this discussion.
- Discussion about how one solution breaks the web vs. opt-in breaking.
- PDL: I'm OK with removing the calendar field from PlainTime if we make it so that with() still throws when it gets a PlainTime.
- JGT: If we decide that time calendars and date calendars are actually different things, then would that foreclose that solution?
- PDL: No, because we can then drop the date calendar slot from PlainTime. That makes no difference to any existing code.
- JGT: So the downside would be that you never have the ability to do `with(time)`, but you could add a `withTime()`. And if you want to spread fields from a time and a date, then one would always override the other. We'd be making permanently bad ergonomics in order to accommodate the possibility of time calendars.
- USA: If something throws now, we can still change it to not throw later.
- JGT: What if we renamed the slot to something like `PlainTime.timeCalendar`? That way you could still spread it and never conflict.
- USA: The same spreading issue applies to PlainYearMonth and PlainDate.
- PDL: To me that combines all the worst aspects of the solutions we've discussed. It doesn't prevent the `with()` use case that we want to prevent.
- JGT: Because we don't know the semantics of time calendars and date calendars, we don't know whether they will be independent or not.
- PDL: That's what this argument comes down to. If there's one thing I've learned from researching this, it's that they cannot possibly be independent of each other.
- JGT: One compromise would be to add a `withPlainTime()` to address the concern that SFC mentioned and make it unnecessary to spread.
- USA: Add `withPlainDate()` as well?
- JGT: I'd recommend against that in V1, since there isn't a conflict or forward-compatibility issue. Dates are easier to deal with than times anyway, because they have fewer fields.
- USA: I see your point, but the issue with deleting the calendar property is just as dangerous for dates.
- Proposal that we believe addresses everyone's concerns:
  - Add `PlainDateTime.withPlainDate()`, `PlainDateTime.withPlainTime()`, `ZonedDateTime.withPlainDate()`, and `ZonedDateTime.withPlainTime()` to address the use case of combining dates and times without spreading. These methods use the 'consolidate' behaviour for calendars (throw if non-ISO and different).
  - Remove `Calendar.timeFromFields()`, `Calendar.timeAdd()`, `Calendar.timeUntil()`, `Calendar.hour()`, ..., `Calendar.nanosecond()`.
  - Remove `PlainTime.withCalendar()`.
  - Remove the calendar argument from PlainTime constructor.
  - Throw if there's a non-ISO calendar passed to `PlainTime.from()`.
  - Leave the names of the slots, the properties returned from `PlainTime.getFields()` and `PlainTime.getISOFields()`, and the `PlainTime.calendar` property as is.
