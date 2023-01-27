# January 12, 2023

## Attendees
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Daniel Ehrenberg (DE)

## Agenda

### Status of "stage 3.5"
- 17 normative issues in milestone
  - 2 ready to present
  - 6 small
  - 2 medium
  - 4 big, of which 2 in progress
  - 3 need no action at the moment
- [#2407](https://github.com/tc39/proposal-temporal/issues/2407) and [#2466](https://github.com/tc39/proposal-temporal/issues/2466) remain to be solved offline after today's meeting.
- "Verify and close" checklist almost done - 1 remaining
- 12 editorial issues in milestone
  - 4 affect the ISO 8601 grammar
  - 7 do not
  - 1 finished but will be merged after TC39
- PFC: After the Matrix chat yesterday we should follow SFC's suggestion of going through remaining editorial issues with FYT and figuring out which ones would be disruptive.
- PDL: I'd like to propose auto-closing new issues at this point.
- PFC: I generally support not accepting new issues, although there's almost always more nuance there than auto-closing.
- SFC: I'd make exceptions for spec bugs.
- PDL: The point is the level of exceptions. If we accept the issue, the spec should really be not working.
- SFC: We can make changes after a period when implementations have caught up.
- JGT: Is this discussion urgent for the deadline for the January meeting? I'm always skeptical of telling people we won't listen to them. The message needs to be careful. We can craft it after getting the other stuff ready.
- PDL: I think this should be an announcement at the January meeting.
- JGT: We can do that.

### Any IETF update? ([#1450](https://github.com/tc39/proposal-temporal/issues/1450))
- USA says, there was some back and forth with the chairperson but we're on track again.
- JGT: I've been watching the mailing list and the chair said everything is on a glide path to being done before the next IETF meeting.

### Builtin calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- Important part is in progress. What to do next with `Id`/`ID`
- PDL: It's OK to say that I made a concession that I shouldn't have made on behalf of the group.
- JGT: Proposal is to explain that we met as a group and concluded to continue to use `timeZoneId`/`calendarId`.
- PFC: Do we need to provide a separate outlet for the discussion so that it doesn't take up our agenda slot?
- PDL: We can ask the chairs to host it.
- JGT: Do we have enough consensus on this that we can take it offline and resolve it outside of the meeting?
- Yes.
- JGT: Backup plan in case the discussion doesn't go our way?
- PFC: `Identifier`?
- JGT: Too long.
- SFC: We have `monthCode` and era code so it's natural to continue the "code" convention.
- PDL: `Name`?
- PFC: I prefer "name" for human-readable strings.
- Consensus on backup option is `calendarCode`/`timeZoneCode`.
- (Discussion resumed later after DE joined)
- DE: We're extremely unlikely to get consensus on the committee on either adopting or rejecting W3C guidelines. This agenda item is not going to work.
- PDL: What I asked was to consider them as a valid precedent, not to adopt them.
- DE: JHD has already disagreed with them, so I don't know what this will achieve. There's a contingent in committee who object to web standards interfering with our jurisdiction.
- PDL: So your recommendation is that we present `calendarId`/`timeZoneId` and have the discussion, and not have a discussion on the general item at all.
- DE: If we want to discuss the general item, we should not expect to come to consensus.
- JGT: This is a good point, let's cancel the agenda item.

### `mergeFields()` for non-ISO ([#2407](https://github.com/tc39/proposal-temporal/issues/2407))
- JGT: The core question that RGN raised was, are Calendar methods general purpose validation or garbage-in-garbage-out? I don't have a strong preference but I'd like to hear from RGN.
- RGN: With the structure of something that is necessary to make things work but exposed to user code, we may as well thread the calendar all the way through. PrepareTemporalFields can perform the independent validation. The responsibility of `mergeFields()` becomes to look at the presence or absence of fields.
- JGT: Is what we have now bad enough that we need to make a change? If so, what is the minimum amount of change that we need to make? My concern around this feedback is that it seems like it's more change than is needed right now.
- RGN: It's a big issue of currently unknown magnitude, relating to observable reactions with input. For instance, avoiding duplicate reads of fields.
- JGT: Can we figure out a specific minimal list of changes that will address FYT and RGN's concerns and bring them up next week in the meeting?
- RGN: If we don't have `era` and `eraYear` in PrepareTemporalFields
- JGT: Compare this to FYT's proposed changes, moving `era`/`eraYear` into 262 PrepareTemporalFields.
- RGN: Comparing the two is a different exercise. My proposal would be that nothing looks at `era`/`eraYear` until the calendars that are defined in 402.
- JGT: The 402 PrepareTemporalFields ensures they are present together but doesn't validate them.
- PFC: I think it does validate them.
- JGT: It's a fairly widely used operation so I want to make sure that it's worth the changes.
- RGN: My minimal proposal would be to remove `era`/`eraYear` from PrepareTemporalFields.
- JGT: It's worked this way for a while, changing it will probably involve ripples, and we have a lot to do. Does it need to change?
- RGN: I don't know.
- PDL: My understanding of last plenary was that fields such as `era`/`eraYear` don't belong in 262.
- JGT: That sounds great if we were starting from scratch. Is it worth doing the work?
- RGN: Some work has to be done. The issue is open and the feedback is from an implementor, who is not comfortable with the spec as is.
- JGT: One possible way of resolving it would be to say, "for built-in calendars don't call `mergeFields()`". One of the things FYT identified is that you can add garbage to mergeFields.
- RGN: mergeFields can receive garbage, it must be specified what happens.
- JGT: My point is that if a calendar implementation does things that no calendar should be doing, we can add validation, or we can write spec text saying that built-in calendars shouldn't do that.
- PFC: I think we can address FYT's concern with just a couple of lines, I suggested a way earlier in the thread.
- JGT: Proposal, we make a PR with that minimal change and discuss whether we like it or not.
- RGN: It's valuable to have a concrete option on the table.
- Action: PFC to make this PR.

### Merge ECMA-402 PrepareTemporalFields into ECMA-262 PrepareTemporalFields ([#2465](https://github.com/tc39/proposal-temporal/issues/2465))
- PFC: Not in favour of this, it seems like a violation of the priority of constituencies to make a normative change because it's easier to write in the spec. However, FYT did correctly identify a bug (the sorting is missing from the 402 version) which we have to fix.
- RGN: I don't understand the concern because V8 is going to have the 402 version.
- PFC: Concretely, maybe we can rewrite the 402 version so it doesn't duplicate steps from the 262 version. "Insert the following steps after step X of PrepareTemporalFields"
- RGN: Makes sense.

### Inconsistent input validation between Calendar.p.<type>fromFields and Calendar.p.mergeFields ([#2466](https://github.com/tc39/proposal-temporal/issues/2466))
- JGT: I opened this to check if the inconsistency was OK. The benefit of changing it was consistency, but also knowing that your inputs were validated if you were building a custom calendar.
- RGN: I don't think it would address the other issue, but ... these are at a different layer of processing.
- (Examining what exactly happens in the `with()` methods)
- JGT: This might be a polyfill-only issue. Let's take this offline.
- RGN: For the record, this is another case where I don't have a good model of the layering, which is the complexity I wanted to address for [#2407](https://github.com/tc39/proposal-temporal/issues/2407). But it at least appears to be consistent right now.

### Limits on `roundingIncrement` for hour, month, week, and day ([#2458](https://github.com/tc39/proposal-temporal/issues/2458))
- SFC: Yes. Do what NumberFormat V3 does, it has an enumeration.
- RGN: Tenths, fifths, quarters, and halves of powers of 10, up to 5000.
- JGT: I don't think that would work for dates and times, because you would need 30-day periods, 90-day periods, etc.
- PFC: I don't understand what problem this would solve, Anba mentioned a storage issue with fixed-size integers, but I don't understand why you couldn't store the value in a double.
- JGT: 32-bit integer seems reasonable.
- PFC: I'm not against that, but in light of our agreement not to accept new issues I don't understand why we're doing this.
- JGT: Let's call it an even 1 billion instead of 4 point something billion.
- PDL: Edge case clarification, go for it.
- SFC: Anba's point about implementability is real. I strongly think we should put an upper limit, at least, and we could always raise the limit later.
- Consensus: We'll do this.

### Many failed Test262 tests for polyfill's DateTimeFormat implementation [#2471](https://github.com/tc39/proposal-temporal/issues/2471))
- How much do we care about making the polyfill match the DTF spec?
- PFC: I think we do care about this but it's not a priority right now.
- JGT: Is it likely to help us find mistakes in the spec?
- PDL: Probably not, the polyfill DTF is just "roughly `Intl.DTF` just to make it work"

### Align Temporal changes to 402 change: InitializeDateTimeFormat=>CreateDateTimeFormat ([#2473](https://github.com/tc39/proposal-temporal/issues/2473))
- Do we want to make these changes for the Jan plenary, or wait until March?
- PFC: I don't think we need to present these, if the change gets into 402 then we have an automatic mandate to adapt to it.

### Normative: In `.toLocaleString()` options, property-bag or ISO string forms of `calendar` and `timeZone` will throw ([#2005](https://github.com/tc39/proposal-temporal/issues/2005))
- How much do we care about `Intl.DTF` and `Date.toLocaleString` matching the behavior of `Temporal.*.p.toLocaleString`?
- JGT: My recommendation is that I think it would be good for Temporal to be internally consistent regardless of what 402 does.
- RGN: Can you clarify internal consistency?
- JGT: Everywhere a time zone or calendar ID is required, you can put in a property bag or ISO string as you would for `Calendar.from()`.
- RGN: `toLocaleString()` is owned by 402.
- SFC: I think eventually we should align the behaviour between Temporal and 402, but it doesn't need to be done right now.
- PFC: I thought this behaviour in Temporal was going to change anyway as a result of [#1808](https://github.com/tc39/proposal-temporal/issues/1808).
- JGT: Possible outcomes: (1) 402 makes a change, (2) nobody makes a change and `toLocaleString(..., {timeZone: Temporal.ZonedDateTime.from(...)})` throws, (3) `toLocaleString()` on the Temporal side pre-processes the arguments. SFC wants (1), FYT wants (3).
- SFC: I need to sync with FYT on this. Ultimately it's all the same ecosystem.
- DE: Agree with SFC.
- PDL: I understand where FYT is coming from, Temporal is the moving part. But I don't think any change is required right now. If we implement what we already said we'd implement, that calendars and time zones become strings, then it's a non-issue right now.
- Decision: Temporal will NOT make a change to `toLocaleString()` in order to be consistent with other Temporal methods. We'll wait for 402 to make the change.

### Check calendar in fast-path conversion to PlainTime ([#2221](https://github.com/tc39/proposal-temporal/issues/2221))
- PFC: I wonder if we can just close this.
- JGT: What changes would [#1808](https://github.com/tc39/proposal-temporal/issues/1808) have on this?
- PFC: It wouldn't affect it, I think.
- PDL: Why would PlainTime still have a mandatory ISO calendar? Shouldn't it maintain the calendar from `toPlainTime()`?
- JGT: We have yet to find a single use case for time calendars, so we don't know whether having the same calendar as for date calendars.
- PDL: That's irrelevant because it would require a time calendar slot anyway.
- JGT: I outlined a way on the thread in which we could introduce time calendars web-compatibly. I feel strongly that PlainTime shouldn't have a calendar slot.
- PDL: This is about maintaining calendar integrity throughout a chain of conversions. If we don't maintain it in PlainTime we have an opportunity to drop the calendar.
- PFC: I don't think you can drop it because you need a PlainDate to convert back to a PlainDateTime. Also, I'm strongly against revisiting this.
- PDL: Why do we have the calendar property on PlainTime then?
- PFC: In order to be able to introduce time calendars web-compatibly.
- PDL: We don't do the spreading anymore anyway, so can we remove the calendar property?
- PFC: My understanding was that it was a non-starter in this group to preclude date and time calendars being the same object, but I think it'd be great if we could relax that constraint.
- JGT: That would be my preference too.
- Consensus: Close this issue, remove the calendar property of PlainTime as part of [#1808](https://github.com/tc39/proposal-temporal/issues/1808).

### Arithmetic on earliest possible PlainYearMonth
`Temporal.PlainYearMonth.from('-271821-04').until(...)`
- PFC: Do we even want to do anything about this? It's a super edge case so I think not.
- JGT: Does it throw a RangeError?
- PDL: Yes.
- Consensus: No, let's not change anything.
- PDL: I look forward to the Stack Overflow question on this.

### `daysInMonth` last day of month ([#1315](https://github.com/tc39/proposal-temporal/issues/1315))
- JGT: My question was whether any of the CLDR calendars are supposed to have skipped days.
- RGN: CLDR is considering adding a Julian-Gregorian calendar where the primary features is the skipped days.
- JGT: I'd rather not add a new property.
- RGN: There's a demonstration of the relative ease with which you can get one quantity given the other.
- PDL: To me it has to be the count, unless we rename the field.
- PFC: What does the spec currently say?
- RGN: It's inconsistent.
- PFC: It's specified to return the count, but in PlainYearMonth arithmetic it's used as the index. We'll have to change the latter.
- Consensus: Keep `daysInMonth` as is but specify the PlainYearMonth arithmetic in an alternate way.
