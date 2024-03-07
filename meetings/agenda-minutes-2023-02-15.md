# February 15, 2023

## Attendees
- Jase Williams (JWS)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)

## Agenda

### Plans between now and 03-21
- Code review needed: [PR #2482](https://github.com/tc39/proposal-temporal/pull/2482), [PR #2485](https://github.com/tc39/proposal-temporal/pull/2485)

### ZonedDateTime in Intl.DateTimeFormat.format ([#2479](https://github.com/tc39/proposal-temporal/pull/2479))
- PFC: I didn't comment on the thread but I agree with JGT's last comment. (option 3 or 8)
- RGN: Fundamentally this is a question about what DTF should be.
- JGT: I think there are two good options; either disallow conflicts, or keep track of whether the time zone is undefined.
- RGN: There could be another way to push it into the mode of using the ZDT's time zone than giving an undefined time zone. I don't want to be too prescriptive.
- PFC: That would be the "extra option" option.
- RGN: It seems there is some implementor push to have it remain what it is now, where the time zone is locked in at construction time.
- PFC: What I mostly care about is that `new Intl.DateTimeFormat().format(zdt)` gets the ZDT's time zone.
- RGN: So you advocate for a dynamic mode and you also want it to be the default.
- PFC: Yes.
- JGT: I think if it's not the default, it doesn't add much value. It'll be a niche mode that is not very discoverable.
- RGN: You could use toLocaleString. There's no savings in constructing a DTF for multiple formats if each format becomes as expensive as constructing a DTF.
- JGT: I don't know enough about the internals to know if most of the expense of constructing DTF is loading the time zone.
- RGN: I suspect it is.
- SFC: With ICU4C, you'd have to basically clone the DTF inside format() with a different time zone, use it, then discard it. With ICU4X, we could make it more efficient. Formatting with a time zone is not a cheap operation.
- JGT: What are next steps if the 402 folks don't agree with this?
- SFC: As with anything that might result in a slower web, as PFC suggested we look at priority of constituencies. There's probably not a solution that satisfies all constituencies.
- JGT: Re. slower web, what is the precise concern? It seems like the slowdown would only apply to ZDT.
- SFC: V8 is a bit weird in how it stores objects. The concern might be that adding 1 bit could push the object into a higher storage class, e.g. 6-words from 5-words.
- RGN: The number of DTFs in active use in most programs indicates that shouldn't be too big of a concern.
- SFC: DTF constructor is very slow, which is something we're hoping to fix with ICU4X. It's the slowest part of the front page of facebook.com, for example. People cache them because they're so expensive to create.
- RGN: Even if you cache one for each IANA time zone you'll have max 1000.
- PDL: I think with Temporal the use of DTF will increase, but not the number of DTFs in active use.
- PFC: It's theoretical, we don't know if storing this extra bit will push the object to a higher storage class in V8.
- SFC: Right, most likely it'll be fine.
- RGN: What I'm hearing is that the champions feel strongly there should be a dynamic mode for ZDT and that it should be the default. And we should work with implementors to resolve their concerns about it. The options 3, 4, and 8 embody this.
- JGT: The problem with 4 is that it's weird that the time zone is entirely overridden.
- RGN: I agree.
- SFC: FYT didn't like 4 either. Let's eliminate it. I'll advocate for 8. I like it because the way to get into dynamic mode is to construct it with `timeZone` undefined, and a ZDT is only accepted in dynamic mode, not strict mode. 3 allows accepting ZDT in strict mode if the time zones are the same, but that could bring a bunch of weird cases (e.g. Calcutta vs Kolkata) that we could otherwise avoid.
- RGN: Agreed, it's possible to have a situation where you don't catch a mismatch in testing but it occurs in production.
- PDL: I don't like the idea of rejecting it. To me, creating a DTF is because I want to control the output. If I specify `timeZone` then I want the output to be in that time zone, and the DTF is capable of doing that.
- PFC: That's an option that's not yet on the list.
- RGN: It's a question of whether you want that to be implicit.
- PDL: I don't see the benefit of requiring it to be explicit.
- RGN: It'd be showing the cost of the implicit operation, and avoiding the surprise of "hey, I gave you an object with a time zone, why did you print it with a different time zone." I wouldn't object to format() doing time zone conversion, but option 8 is fine too. It depends on other considerations.
- PFC: So option 9 is "Accept ZDT; if the DTF was constructed with an undefined time zone, use the ZDT's time zone; otherwise use the DTF's time zone"
- SFC: We treat the ISO calendar as a sort of dynamic mode in the same way, rejecting with runtime exception on mismatch.
- PDL: I don't think it's the same thing. They are different from a human perspective. While the arguments of similarity might hold technologically, I don’t think they hold culturally. I carry my calendar preference with me, but can be forced into a different time zone by geography.
- RGN: I'm OK with option 9. I do have a preference that calendars and time zones are treated the same, but I'm comfortable if the divergence makes sense for reasons that PDL just expressed.
- SFC: My preference is option 8. I'm uneasy about time zones and calendars having different strictness levels in a mismatch. I could be persuaded to option 9 for both time zones and calendars, but am uncomfortable with it.
- PFC: It's not possible to treat calendars as in option 9 in the case of PlainYearMonth and PlainMonthDay. I don't want to open that discussion again.
- SFC: Agreed.
- SFC: I think there's an implicit assumption that giving a `timeZone` option to DTF constructor weighs more than the ZDT's time zone, and I don't necessarily agree with that.
- PDL: I prefer option 9 over 8, but I won't die on that hill.
- SFC: If we conservatively throw an exception in option 8, we can change the behaviour to be more lenient later. For that reason my real preference is option 1, but it seems unlikely we'll get alignment on that. I'll make one more case for option 8: you could have a DTF with no time zone display, then the ZDT would get converted to a different time.
- PDL: That's intended behaviour.
- Straw poll:
    - PFC: any of 3, 8, 9
    - RGN: prefer 8, 9, would not object to 3
    - PDL: strong preference for 9
    - JGT: prefer 8, but fine with 9 and 3
    - SFC: 8 > 9 > 3
- Defer until next week to make sure we haven't just exhausted people's will to discuss. We'll have a very quick vote.

### Inconsistent input validation between Calendar.p.&lt;type>fromFields and Calendar.p.mergeFields ([#2466](https://github.com/tc39/proposal-temporal/issues/2466))
- Homework: Review [PR #2500](https://github.com/tc39/proposal-temporal/pull/2500)
- PFC: This seemed to be less invasive than I thought it'd be so I'm positive about it. I'd like to form a better opinion after looking at only the normative changes.
- JGT: Can we postpone this until next week?
- RGN to separate the editorial changes into a different PR, PFC to review before next week's meeting.

### Added and skipped days due to timezone changes ([#2495](https://github.com/tc39/proposal-temporal/issues/2495))
- Homework: Review algorithm in [#2495 comment](https://github.com/tc39/proposal-temporal/issues/2495#issuecomment-1423248740)
- More homework: review proposed `overflow: 'constrain'` algorithm from [#2503](https://github.com/tc39/proposal-temporal/pull/2503/files#diff-e8db6300241a118a610f0e0daf507e3aea6d4a7272927b6fa0a4fc88de8308bcR121) when a calendar date doesn't exist, e.g. Feb 29, 2023 or days skipped by Julian=>Gregorian transition:
    - First, pick the closest `day` in the same month. If there are two equally-close dates in that month, pick the later one.
    - If the month is a leap month that doesn't exist in the desired year, then pick another date according to the cultural conventions of that calendar's users. Usually this will result in the same `day` in the month before or the month after where that month would normally fall in a leap year.
    - Otherwise, pick the closest date to the provided date that is still in the same year. If there are two equally-close dates, pick the later one.
    - If the entire year doesn't exist, then pick the closest date to the provided date. If there are two equally-close dates, pick the later one.
- JGT: The goal here is to make ZDT's implementation of daysInMonth, daysInYear, etc., take time zones into account. This came from a customer suggested idea. The basic idea is to check if there is any transition that stretches from local midnight to local midnight. It works for the case where one day is skipped by the time zone, and I think it works for further cases as well.
- JGT: Separately, I found it's hard to use the Calendar API to come up with a straight answer about what the first or last day of a month is, in the face of skipped days.
- PFC: I didn't look into it as closely as I wanted to yet. I am a bit worried that we are introducing a complicated algorithm that it's hard to ensure is correct.
- PDL: I haven't looked into it but I leave it to you.
- RGN: I'm worried the same as PFC. I think the right algorithm to use is ICALENDAR's one for resolving recurrence rules, which needs more inputs than we provide in Temporal.
- JGT: I think those are two different things. The constrain algorithm of [#2503](https://github.com/tc39/proposal-temporal/pull/2503/) matches what you said about ICALENDAR.
- RGN: Changes are needed in Temporal to count the number of days in a month, in a time zone?
- JGT: Yes, that's the discussion from last week.
- JGT: Let's save the [#2495](https://github.com/tc39/proposal-temporal/issues/2495) algorithm for next week and only discuss the constrain algorithm this week.
- SFC: I'm not sure why we are revisiting the algorithm for overflow-constrain because dateFromFields has existed with that option for a long time.
- JGT: This has been specified only with prose that doesn't take skipped days into account.
- SFC: We have to specify what to do for the ISO calendar, yes?
- PFC: That is fully specified.
- RGN: ICALENDAR handles the month first, and then it handles the day of the month. And it takes an "omit", "backward", or "forward" option. "Omit" is the default.
- JGT: I think the difference is that dealing with recurring events, there's intentionality on the part of the person creating the event, which is not present in creating a date. My goal with this algorithm was to make it easy to get the first and last day of the month in the presence of skipped days.
- RGN: Isn't mapping the invalid space to the valid space calendar-dependent?
- JGT: It's calendar-dependent for handling leap months. I think it's important to have the handling of skipped days be deterministic though.
- RGN: With the risk of getting it wrong with a calendar that we haven't considered.
- JGT: If it works for intra-month skipped days I'm confident that it makes sense.
- PFC: I think this case could occur, but we don't know of any occurrences - I don't think any of the Julian-Gregorian transitions anywhere in the world happened across two calendar months. I'd be OK with leaving the constrain algorithm to be calendar-dependent, but specifying that calendar implementations should uphold the invariant of `{day: 1}` giving the first day and `{day: largeNumber}` giving the last day.
- JGT: I'm OK with that. Is this prose sufficient for that?
- RGN: I'd like to review it again in that light.
- JGT: Propose to put a short note in the spec about builtin calendars being expected to follow these bullet points if there are skipped days, as well as the docs clarification that is currently in the PR.
- RGN: I think we should relax the prose a bit, but we can work out those details in the PR. I'm in favour of capturing this kind of guidance.

### Era codes discussion
- Homework: review
    - Era Code proposal: [https://github.com/tc39/proposal-intl-era-monthcode](https://github.com/tc39/proposal-intl-era-monthcode)
    - CLDR: [https://github.com/unicode-org/cldr/pull/2665](https://github.com/unicode-org/cldr/pull/2665)
- JGT: Overall I agree with standardizing this. Two changes that I'd like to see in the current proposal:
    - 1) Don't allow eras to be used in calendars where they don't belong. E.g., reject `{ calendar: 'gregory', era: 'meiji', eraYear: 1 }`
    - 2) Use more-recognizable era codes, i.e. `bce` not `gregory-inverse`. I'm concerned that we'd be inventing some new format.
- PFC: Is the idea that this proposal gets absorbed into Temporal?
- JGT: Don't know.
- Discussion postponed until SFC is present, he had to leave early.

### ISOMonthDayFromFields ignores year when monthCode is present ([#2497](https://github.com/tc39/proposal-temporal/issues/2497))
- Discussion tabled from last week
- RGN: One of the commits in PR [#2500](https://github.com/tc39/proposal-temporal/pull/2500) now solves this. If no-one feels strongly about it enough to object, we could just go with that.
- JGT: I don't feel strongly about it.
- PFC: I'd want to look at it again in that light, but probably I'd be OK with that. If we're presenting this anyway.

### Nanosecond precision
- Next week, SYG will join us starting 08:30 America/Los_Angeles. Jakob may or may not join. ABL is invited but hasn't confirmed. RKG is invited but declined due to time zone incompatibility, we may want to talk to him separately.
- Homework: Understand the situations ABL mentions where you still need 64+32 arithmetic even if using only 64 bits to store epoch microseconds
- Would be good to have a sense of whether this changes our decision on bounding Duration fields
- JGT: That was my only strong opinion here, we should consider those two things to be the same decision. They have a strong influence on each other.
- PDL: I see nanosecond precision as influenced by bounding Duration fields, but not the other way around. Could we decide that first?
- PFC: We already decided not to bound Duration fields. But that's a tradeoff that RKG is not happy with and ABL is only grudgingly OK with. I don't think we should keep reconsidering decisions we've already made unless there is new information, but going from nanosecond to microsecond precision is definitely new information.
- JGT: Right, my request is that we make a decision on both at the same time.
- PDL: Reiterate that the goal of the meeting is to listen and understand the implementor concerns, not to have a back-and-forth discussion.
