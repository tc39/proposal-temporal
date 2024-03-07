# June 8, 2023

## Attendees
- Chris de Almeida (CDA)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Shane F. Carr (SFC)

## Agenda

### Status reports
- IETF
    - PFC: Last call went out last week, and the security directorate has approved of the security considerations that were added in the last draft, giving the document a status of Ready.
    - Don't know what the timeline is after last call ends on 06-15.
    - CDA: If it's been sitting around for a while, it's good to report movement.
    - RGN: It goes to the RFC editor next.
    - CDA: I believe IESG needs to approve for publication prior to going to RFC editor.
- Integer math change
    - PFC: I'm still working on the algorithms for doing the calculations with two Numbers in JS, to verify that it's possible and check if we need bounds anywhere else. I'm confident I'll be able to present something at the July meeting.
    - JGT: Are there any PRs that are approved and still needed to be merged?
    - PFC: Yes, the same 4 as last week.

### Maximum precision of offset time zones ([#2593](https://github.com/tc39/proposal-temporal/issues/2593))
- JGT: Context is a discussion at the last TG2 meeting. Many folks were skeptical or negative about using offset strings with sub-minute precision in 402. Nobody cared that much about what Temporal was doing, but it seems like a heavy lift to do it in DateTimeFormat.
- RGN: i.e. supplying it as the value of the timeZone property of DateTimeFormat options.
- JGT: There were several options:
    1. Convince implementers that nanoseconds (48 bits required) in time zone offsets is OK. Based on today's TG2 discussion, this seems unlikely to be successful; there was very strong pushback to making nanoseconds work with Intl.DateTimeFormat.
    2. Reduce offset precision to minutes, to match IETF - 12 bits required.
    3. Reduce offset precision to seconds, to match iCalendar - 18 bits required
    4. Reduce offset precision to 0.01 second, to match the most granular offset in the IANA TZDB - 25 bits required
    5. Keep nanoseconds precision for offsets in Temporal (and hence 262) but round to the nearest minute when storing in Intl.DateTimeFormat's internal slot.
- PFC: Is this issue scoped to DateTimeFormat? It doesn't constrain what we do in Temporal?
- JGT: My sense from what I heard in the meeting, I suspect that whatever we do in Temporal would not bother TG2.
- PFC: I was previously concerned that TG2 was contradicting a decision that TG1 already made, but it sounds like that's not the case. I'm not a fan of making it inconsistent, but I think it's better for DateTimeFormat to be inconsistent and adjust later if needed, than for us to go back and redo a TG1 discussion that we already had.
- SFC: I think it's important that all states of an input for a formatting algorithm produce a unique output. This sounds like it breaks that invariant. It's basically rounding, but no way to opt out.
- JGT: IXDTF doesn't support nanoseconds precision.
- PFC: It does in the bracketed annotation.
- RGN: I discovered that it actually does not.
- PFC: Changing IXDTF at this point would jeopardize much more.
- RGN: Realistically we need to treat IXDTF as a fixed point.
- SFC: Keeping sub-minute offset time zones and just not printing them out either in DateTimeFormat or in IXDTF seems a reasonable alternative. Might be bad, but less bad?
- JGT: I think if it's supported, it should be visible. I wouldn't be in favour of having the feature and paying the storage cost but keeping it hidden.
- SFC: Fair enough, agreed on the storage cost.
- RGN: I don't think bytes of storage should serve as the foundation for this decision. Rather, the absence of use cases and the misalignment with external ecosystem.
- Conclusion: Change granularity of offset time zones to minutes. Seconds in an offset string in the TimeZone constructor are rejected even if zero (to support possible future extension). Named time zones can still have sub-minute offsets, so the `offset` property of ZonedDateTime and the `getOffsetNanosecondsFor` method of TimeZone remain the same.

### Editorial: Refactor time zone identifier spec text ([#2573](https://github.com/tc39/proposal-temporal/pull/2573))
- JGT: This is the Temporal counterpart to PR [ecma262#3035](https://github.com/tc39/ecma262/pull/3035) that was just merged yesterday after 2+ months of editor reviews. Reviews requested on the Temporal PR!
- PFC: Congrats on landing the 262 change!
- RGN: I'm reviewing it today.
- PFC: I can take a look tomorrow.
- JGT: It removes a bunch of new definitions that now exist in 262. Will consider doing a 402 PR ahead of Temporal.
- SFC: If there's a mismatch with 402, that seems like a bug that should be fixed.
- RGN: I have a strong preference that the overrides in 402 are kept to a minimum.

### ABL's feedback on date difference order of operations ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT: will get to this later this week now that the 262 PR above is finally done

### Normative: don't coerce non-strings to strings before parsing ISO strings (esp. calendars, time zones and offsets) ([#2574](https://github.com/tc39/proposal-temporal/pull/2574))
- JGT: Explanation of issue. (`Calendar.from(10)`, `TimeZone.from(-10)`.)
- PFC: I wonder if ParseTemporalCalendarString considering ISO time-only syntax is an oversight from removing calendars from times.
- JGT: The issue is anywhere an ISO string is parsed.
- Discussion about objects with toString and whether anyone in committee is likely to be particular about these.
- JGT: Do we want to do this PR and is the scope correct?
- RGN: I think this PR is worth doing.
- PFC: String values in options bags?
- JGT: 402 has already blazed a lot of trail with options bags. Continuing to coerce to strings seems better for options bags.
- RGN: I agree especially in 402 there is a strong precedent. But JGT's position is coherent.
- JGT: There also isn't any possibility for confusion in options. I think this PR as it currently is, eliminates things that users would legitimately get wrong.
- PFC: But month codes and eras also don't have a possibility for confusion.
- JGT: Offsets have confusion though, and so it makes sense to be consistent in values in Temporal-object-like property bags.
- RGN: I agree. Options bags values go through GetOption.
- PFC: I would rather not do this, but I wouldn't block it if there's this much support from everyone else.
- Conclusion: We'll change this, with the current scope of the PR.

### ZonedDateTime.p.with({offset}) is a no-op but doesn't throw if the offset is invalid ([#2590](https://github.com/tc39/proposal-temporal/issues/2590))
- JGT: This is a consequence of removing the ability to spread objects and of having a timeZone property in a with() property bag.
- RGN: Is offset ignored entirely, just like a property called foo?
- JGT: It's used for one thing, to disambiguate between repeated wall-clock times. E.g. `.with({ hour: 1, minute: 30, offset: '-07:00' })` on a DST day. This probably won't cause user confusion, but it just doesn't do anything.
- RGN: It conditionally doesn't do anything. The ideal behaviour would be to throw in that case, but I'm not sure it's justified.
- PFC: Would it cause an extra user-code lookup?
- (We determine that it would not)
- Conclusion: We won't change this.