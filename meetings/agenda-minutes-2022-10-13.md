# October 13, 2022

## Attendees
- Justin Grant (JGT)
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)

## Agenda

### Implementations progress
- PFC: JSC about ⅓ done. Concerns about floating-points in Duration.
- SFC: My understanding of Firefox is that Anba's PRs are being reviewed and merged. On V8, FYT has been blocked for some time on era codes and month codes and is working out a separate proposal.
- JGT: Is there something we should discuss about what is blocking FYT?
- PFC: My understanding is that we should discuss with FYT whether it needs to be part of Temporal but no action is needed right now from us to unblock.
- JGT: Can I read about it somewhere?
- PFC: [Intl Era and Month Codes proposal](https://github.com/FrankYFTang/proposal-intl-era-monthcode).
- PDL: Is this blocking only V8 or all the implementations?
- SFC: My understanding is that FYT is close to shipping iso8601-only Temporal, but the month and era codes are blocking non-iso8601 implementations.
- PDL: Should we make a call on where this goes, in order to support FYT? I'm worried about delaying by starting this as a separate proposal.
- PFC: I think we can achieve that call by starting a discussion on the proposal repo.
- JGT: How is this proposal different from any other data-driven stuff such as time zone data?
- SFC: I agree that this might not belong in ECMAScript, rather in Unicode. But you can't implement it in ECMAScript without knowing what codes to use for eras and months.
- JGT: So FYT's concern is that the data for these things do not exist upstream in the source data for Unicode.
- SFC: That's my concern. Temporal requires that era codes exist, but they don't exist.
- JGT: So the work item here is to work with CLDR to ensure that they exist.
- SFC: That, and also determine to what extent the era and month code behaviours need to be specified in ECMAScript. Do we rely 100% on what CLDR supplies or lay down some ground rules?
- JGT: For the second question, that seems fine to include in ECMA-402 or Temporal. If we did that, does it unblock FYT?
- PFC: We would best ask FYT on an issue thread.
- JGT: Are there any objections in this group to doing that?
- No.
- JGT: Can we solve this with a PR to Temporal?
- SFC: I was hoping USA would drive that process. This has been something we need to do for a long time, and it's more of a resourcing problem than a difficult technical problem.
- JGT: Would it involve working with the CLDR folks? Is the data already there?
- SFC: The data's not there yet. FYT has a good proposal for how the era codes should behave, but someone needs to work on getting it upstream.
- JGT: For the ground rules, do you think it's more appropriate to have in ECMA-262 or Temporal?
- SFC: I'll leave it to this group.
- JGT: What are the next steps?
- SFC: Find an owner.
- JGT: I can put the PR into 402, since FYT has already specified it in the proposal. But I don't have time to work upstream with CLDR.
- SFC: We need an owner for the whole task. If no one steps up FYT can do it but that's not preferable.
- Action: PFC to check with Igalia's Google Intl contract.

### Status updates
- PFC: Regarding the IETF standardization work [#1450](https://github.com/tc39/proposal-temporal/issues/1450), no further changes needed. IETF needs to publish the document before we can close the issue.
- PFC: Regarding [#1876](https://github.com/tc39/proposal-temporal/issues/1876) and [#2169](https://github.com/tc39/proposal-temporal/issues/2169): seems like the champions group is agreed on wanting to close the issue, but it needs to be done in a way that won't cause further problems.
- PFC: There are several issues that are only waiting on test262 tests in order to be closed. I hoped to have all of those done by today, but didn't succeed. Certainly by next week.

### Week-year support: remove `weekOfYear` or add `weekYear` ([#2405](https://github.com/tc39/proposal-temporal/issues/2405))
- PFC recommendation: either close, or quickly add `weekYear`
- PDL: No objections to making YearWeek a thing, but only if the week number remains available as an independent thing. Week numbers are a frequently used concept in communications in Europe. I don't like making it only available together with the year.
- SFC: I don't understand that objection, do you mean you're not on board with a `yearWeek` getter that returns the year and the week together?
- PDL: No, that's fine. As long as you can get the number by itself.
- JGT: The big missing part from year-weeks was string parsing, correct?
- PDL: The follow-on proposal would also introduce Temporal.YearWeek. Parsing it is the easy bit, it's what object you put the data into.
- JGT: If we do string parsing of `YYYY-WWW-D`
- RGN: This is confusing a few things. The issue was raised because there's no getter to get the week-year, which makes `weekOfYear` useless and potentially harmful. If I say `W01-5` you don't know whether it's December or January.
- PFC: I disagree that it's useless, but it's got a potential for bugs if you are in a context where you need the year number.
- PDL: `W01-5` is January because day 5 is Friday.
- JGT: RGN, is your concern that we can go one way from date to week but not in reverse? It's a straightforward calculation but not obvious.
RGN: If you pull the week number off a PlainDate, then you need to know the week-year.
- PDL: It's the same as pulling off the month number or month code, you don't always need to know the year.
- PFC: Could we agree on having a getter despite disagreement on whether week numbers are useless by themselves?
- PDL: OK with me.
- RGN: That's one issue. The parsing of `YYYY-WWW-D` is the other issue.
- PDL: That we can support, because we can put it in a PlainDate. `YYYY-WWW` is problematic because we don't have PlainYearWeek.
- PFC: I would recommend not supporting the string parsing for now. The getter or combined getter still makes perfect sense without it.
- PDL, JGT agreed
- JGT: What should we call the getter?
- RGN: "Week calendar year" is the ISO 8601 term.
- PDL: I would prefer a separate getter rather than a combined getter with half-baked object return, so that we don't preclude Temporal.PlainYearWeek in the future, which _should_ be the return of that combined getter.
- RGN, PFC agreed
- RGN: Also getters returning non-primitives is problematic in itself.
- RGN: I confirmed the ISO term, `weekCalendarYear` would be a possible getter name.
- PDL: I'd rather call it `weekYear`. "Calendar" already has a meaning in Temporal.
- JGT: It's a bit weird to have `weekOfYear` and `weekYear`.
- PDL: `yearOfWeek` and `weekOfYear`?
- JGT: Makes sense to me. It's something you can skip over; if you don't know what it is, you probably don't need it.
- PFC: Does anyone have a source for the calculation so that we don't go through the whole same process as we did with the ISOWeekOfYear calculation?
- RGN: It's already embedded in ISOWeekOfYear. Just requires a bit of rearranging so that both getters refer to the operation.

### Unforeseen problems with plain-object calendars and time zones ([#2354](https://github.com/tc39/proposal-temporal/issues/2354))
Summary: E.g. `new Temporal.ZonedDateTime(0n, calendar, timeZone)` is silently wrong. One solution is to remove plain-object implementations of the protocol; one solution is to do nothing since constructors are low-level; one solution is to require certain methods be present on plain-object calendar or time zone.
- JGT: I like the last one. Plain objects are a weird and infrequently used way to do it, so it seems reasonable to require some methods to exist. That may be useful even outside of this constructor.
- PDL: To understand, the question is that we don't check these objects? What happens with `Temporal.TimeZone.from({})`?
- PFC: Currently, it returns the same `{}`.
- PDL: We should require certain methods.
- JGT: Reading the docs:
> The object must have at least `getOffsetNanosecondsFor()`, `getPossibleInstantsFor()`, and `toString()` methods. 
> For calendars: The object must implement all of the Temporal.Calendar properties and methods except for `id`, `fields()`, `mergeFields()`, and `toJSON()`.
- PFC: I think the previous thought was to call as few user-visible operations as possible, but this seems like it's worth deviating from that.
- PDL: What's the user visible operation?
- PFC: HasProperty for each required method.
- PDL: You can only observe that with a Proxy.
- PFC: Maybe also GetProperty to determine if the value is callable.
- PDL: I don't think we need to do that. I don't think it's that important to care about the Proxy case.
- RGN: There's enough for the committee to care about there, though.
- PDL: I'm very surprised that ToTemporalTimeZone and ToTemporalCalendar don't already throw in this case.
- PFC: I always considered plain-object time zones and calendars weird, and something that I don't care about - only needing to be there for precedent.
- PFC: Another solution that just occurred to me is to check the [[TemporalTimeZone]] internal slot in ToTemporalCalendar, and vice versa, which covers the bug for strings and Temporal instances, but not for weird plain objects.
- JGT: I like that.
- RGN: I think we should just not rely on argument ordering here and instead use a bag with named arguments.
- JGT: Why not do the easy, fast, unobservable thing here?
- RGN: That doesn't have any precedent in the language. It feels like a hack. If getting all the properties, it'd be better to collect them into an internal bag.
- PFC: I investigated that in [#1294](https://github.com/tc39/proposal-temporal/issues/1294) and it has very strange consequences.
- RGN: I'm not surprised.
- PDL: I can also get on board with not fixing the bug.
- RGN: If it's a fix worth doing, then I think named arguments would be the way to go.
- PFC: I think we have our temperature check, I'll summarize it on the issue.
