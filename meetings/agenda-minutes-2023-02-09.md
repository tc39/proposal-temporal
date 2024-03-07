# February 9, 2023

## Attendees
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Jase Williams (JWS)
- Philipp Dunkel (PDL)
- Shane F. Carr (SFC)


## Agenda

### Plans between now and 03-21
- PFC: Built-in calendars and time zones as strings PR is ready for review.

### Inconsistent input validation between Calendar.p.&lt;type>fromFields and Calendar.p.mergeFields ([#2466](https://github.com/tc39/proposal-temporal/issues/2466))
- RGN: Have a solution for this, will open a PR that we can discuss next week. Will leave a comment on [#2474](https://github.com/tc39/proposal-temporal/issues/2474) requesting that mergeFields return a null prototype object.

### Added and skipped days due to timezone changes ([#2495](https://github.com/tc39/proposal-temporal/issues/2495))
- Should ZDT daysInMonth/daysInYear/etc take time zones into account (like with add/subtract) ?
- JGT: We found a contributor who is really into time zone corner cases. They pointed out the interaction between daysInMonth etc with skipped days due to UTC offset changes. In the process of researching this I did come up with an algorithm to take these into account. I don't have a strong opinion about this. All it would require is calling GetNextTransition/GetPreviousTransition. Note, this code was really difficult to write so it's likely not something that users are just going to stumble upon.
- RGN: ZDT is time zone aware, so having any of its exposed surface area be ignorant of time zones feels like a miss.
- JWS: Was there a reason why it didn't do this before?
- JGT: I just didn't think it was possible. Or didn't think about it much at all.
- PFC: What do callers of daysInMonth expect? For example, did printed wall calendars for 2011 in Samoa include December 30?
- RGN: I'd expect that you'd include December 30 but mark it specially as not present.
- JGT: I think that is separate from iteration, which is still a bit problematic.
- PFC: I still think this is going to be unexpected. e.g., if you are checking `zdt.daysInMonth === 31`.
- RGN: It'll be unexpected for _someone_ either way, whether you take the skipped days into account or not.
- JWS: I'm interested in going through this algorithm properly and discussing it next week.
- JGT: A corollary to this is what to do with repeated days in calendars.
- RGN: Are you aware of any repeated days?
- JGT: No, although I wouldn't be surprised if it happened some time in history.
- RGN: Unlikely to show up in a builtin, though. In a custom calendar you're on your own. The builtins don't have the tools to even differentiate which of the repeated days you are in.
- JWS: A custom calendar would be an escape hatch for this.
- PFC: Same. A lot of assumptions break down if months are not contiguous, so custom calendars can figure out how to deal with that.
- RGN: The builtins deal with leap months, skipped days, and nothing else.

### ISOMonthDayFromFields ignores year when monthCode is present ([#2497](https://github.com/tc39/proposal-temporal/issues/2497))
- RGN: It's shocking to me that year is taken into account when you provide month, but not when you provide monthCode. In other respects, month and monthCode tend to be equivalent. Especially since year is read but not used.
- JGT: When a field in an input property bag isn't needed for a piece of data, it's ignored. I think this is consistent with the rules we have elsewhere, if slightly odd.
- RGN: It still gets the year's value.
- JGT: Could we change the algorithm to not read the year if the monthCode is there?
- RGN: It's still surprising to me that year isn't used.
- JGT: What would you expect for YearMonth.from({ year: ..., monthCode: ..., day: 300 })?
- RGN: Day isn't part of the data model, so I'd expect that to be ignored.
- JWS: I'm kind of with RGN on this one, I'd imagine using this API with data from a foreign source, and expecting an error to be thrown.
- RGN: I could see it going the other way, where you don't use the year for validation in either case. E.g. `{ year: 2023, month: 2, day: 29 }` instead of throwing a RangeError would be treated as `{ monthCode 'M02', day: 29 }`.
- PFC: I think the status quo is consistent with a design principle and not broken, if a bit odd.
- RGN: Can you articulate the design principle?
- PDL: It reads the year because we read all possible data sources first. But I don't have a principle for the validation.
- JGT: I don't think this is that bad. We don't lose much by validating here.
- SFC: I'd say we get the monthCode and day, but Temporal has no concept of how to convert month/day to monthCode/day without the full triple. Therefore we need the full triple to be valid. The difference is that the first case doesn't need to do any conversion and the second case does.
- RGN: So why wouldn't you get the error on `{ year: 2023, monthCode: 'M02', day: 29 }`?
- PDL: Are we short-circuiting too much for non-ISO calendars?
- RGN: I'm specifically talking about the ISO calendar here, not non-ISO calendars.
- PDL: What I'm saying, is there a principle to be derived if we take non-ISO into account?
- RGN: The principle I'd suggest is that the input is used to determine a monthCode and day, and those are the result.
- JGT: For month/day, you need to call into the calendar to get the monthCode, and so the triple needs to be valid. Technically this happens inside the calendar's implementation-defined monthDayFromFields, so we don't see it.
- PDL: If the calendar is not a built-in, in the implementation calls an internal method to validate the triple.
- RGN: Would there be extra observable calls for this?
- PFC: No, it would all happen inside monthDayFromFields.
- JGT: I don't think it's bad to throw here. We'd just be doing what implementations would naturally do.
- PDL: I can think of the opposite case where a developer has `{ month: ..., day: ... }` and knows they need to provide a year, but doesn't realize that the year has to be a leap year.
- (We table this for next week)
- RGN: Does anyone have strong feelings about this?
- JWS: Not strong, but I agree with the initial premise.
- PFC: I don't have strong feelings about the issue, but I do feel strongly that we should not be opening these discussions and bringing them to plenary.
- RGN: This doesn't have to go up to plenary separately.

### Nanosecond precision
- PDL: Bloomberg won't object to going to microseconds, although we think it's short-sighted.
- JWS: There's some discussion within Bloomberg looking at potential use cases for nanosecond precision.
- RGN: It's a fairly substantial change to the spec, so it has to be well-motivated. Are there any other examples in the field of software that have a data-model-relevant boundary at microseconds or nanoseconds?
- PDL: MS Windows' internal time data type is microseconds. Abseil stores to a precision of 250 ps, quarter nanoseconds.
- (Discussion of use cases)
- PFC: I don't think we need to justify use cases, we should decide what we're going to do with the request.
- PDL: But Jakob's discussion on the thread has been about use cases.
- PFC: I think Jakob is out of date on that thread — he's talking about having to use BigInt to implement Instant. I already discussed with SYG that it's not necessary to use BigInt. For JSC I used int128 with fallback to 2x64. My understanding of SYG's objection is that their codegen doesn't work with int128 and int128 isn't portable enough. We could maybe solve the problem by submitting a CL to V8 to use 64+32 but the question is, is that worth it?
- PDL: The 128 bits question seems to be only a V8 problem. The issue that SpiderMonkey and JSC had is with Duration range.
- PFC: That's [#2195](https://github.com/tc39/proposal-temporal/issues/2195) which we decided, it's bad no matter what we do, so we're not changing that. But maybe if we change Instant, that tradeoff changes.
- PFC: I think we should do at least some minimal effort to find a solution that makes everyone happy
- (I missed writing notes for some of the discussion here. Summary: we would like to invite SYG and Jakob to a discussion, not to discuss use cases, but to understand the technical concerns with codegen.)
- JWS: We should consider what we want to get out of a meeting with implementors.
- PFC: What I'd like is to have explored whether there's an option that will address the implementation concerns. If there isn't a solution possible, then I think we should remove nanoseconds, as I think it'd be difficult to move forward.
- JGT: Agreed.
- JWS: It'd be good to get other implementors in the room as well, from SpiderMonkey and JSC.
- PDL: I think we should discuss the changes to Duration and Instant in the same meeting.
- SFC: Is a change to the data model of Duration on the table?
- PDL: Only in so far as it would buy us nanoseconds: if we can keep nanoseconds by putting an upper limit on Duration fields.

### Era codes discussion
- SFC: We've been working on this in December and January, on the CLDR side. It was merged a few days ago.
    - Era Code proposal: [https://github.com/tc39/proposal-intl-era-monthcode](https://github.com/tc39/proposal-intl-era-monthcode)
    - CLDR: [https://github.com/unicode-org/cldr/pull/2665](https://github.com/unicode-org/cldr/pull/2665)
- JGT: I have a few discussion items for next week if folks have a chance to read through that proposal.