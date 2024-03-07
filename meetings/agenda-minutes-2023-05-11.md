# May 11, 2023

## Attendees
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)

## Agenda

### Status reports
- JGT: I went through open PRs and found a few that I wonder if we are planning on continuing: [#2412](https://github.com/tc39/proposal-temporal/pull/2412), [#2290](https://github.com/tc39/proposal-temporal/pull/2290). But we don't have to discuss it during the meeting.
- PFC: I saw a new draft was published of the IETF document.
- JGT: This was with editorial edits from Carsten. We seem to be on track for last call, but I don't know anything about the timeline.
- RGN: I concur, I think it's in good shape.
- PFC: Slides are ready for TC39 next week, I'm presenting 3 minor normative PRs.
- PFC: As I posted in the channel the other day, the integer math PR was derailed when I got Covid. I'm now planning to present it in July.

### Concern from Firefox about loops in duration balancing/unbalancing
- PFC: MAG, who is reviewing ABL's Temporal patches for Firefox, expressed a concern about the loops in UnbalanceDurationRelative. There are also similar loops in BalanceDurationRelative and RoundDuration. The concern is somewhat mitigated because you can skip the loops for builtin calendars, but MAG pointed out that ABL's patches don't implement that fast path. I think this fits into the integer math change and can be done at the same time.
- PDL: If it fits into the integer change, great. If not, I'd suggest preparing a PR for it anyway, but leaving it up to the plenary whether to accept it or not.
- PFC: I seem to remember researching a couple years ago whether these loops were necessary, but I now can't remember why I concluded they were. It seems like they could be removed.
- JGT: Agreed, it seems plausible that we could just use DateUntil here. Sounds like the action is to do some research.

### Concern from JHD about PR [#2570](https://github.com/tc39/proposal-temporal/pull/2570)
- RGN: The list here is a list of property names to be applied to one target, so it feels like it has Set semantics. I get where JHD is coming from, but I'm not sure what purpose would be served by an extra Get.
- PFC: Agreed.
- RGN: I wonder if it could be refactored so that the list is more clearly a set. The smell is that you have a list where you ignore some of the entries. Maybe we could make it clearer whose responsibility that is.
- PFC: Anba's feedback was that it's easier to do the deduplication after sorting, which we do in PrepareTemporalFields.
- RGN: Agreed.
- PFC: I'd also be fine with throwing if calendar.fields() returned a duplicate, but that's not the only way you can get duplicates.
- Action for PFC to respond on the thread that we'd like to have a short call on this topic before the Temporal item at the plenary.
- RGN: Is ToTemporalZonedDateTime the only place where fields are appended to the list?
- PFC: It also happens in ZonedDateTime.p.with and ToRelativeTemporalObject.

### ABL's feedback on date difference order of operations ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT: Not had time to look into this yet.

### RGN’s open PRs - are they still moving forward or can be closed?
- Editorial: Pass Duration Records rather than individual components [#2290](https://github.com/tc39/proposal-temporal/pull/2290) 
    - RGN: I'm still in favour of passing Records rather than having operations with 6, 7, more arguments. The objection at the time was around the highlighting, visually tracking what happens to each component. I've added highlighting for slots and fields to ecmarkup, so that you can now do that visual tracking. Still worth pursuing?
    - JGT: Yes, sounds good.
    - PFC: Agreed. If you rebase this I'd suggest rebasing it on top of #2519.
- Editorial: Introduce ToTimeZoneIdentifier to handle offset-or-name processing [#2412](https://github.com/tc39/proposal-temporal/pull/2412) 
    - RGN: A lot of changes have been made since this one was open, as well. A lot of the uses of ParseText have been cleaned up, but there are still some steps in the TimeZone constructor that I think would make more sense if they moved into ToTemporalTimeZoneIdentifier. I'd say this is still worth doing but low priority, and not worth blocking anything for.

### Normative: fix accepted types of calendar & timeZone options of toLocaleString & Intl.DateTimeFormat ([#2106](https://github.com/tc39/proposal-temporal/pull/2106))
- JGT: Where we left off was that TG2 ultimately intends to use Temporal objects for time zones and calendars.
- SFC: If I remember right, we are not actually going to change the types of the slots because 402 can only handle builtin calendars and time zones, so we only need the string representation.
- JGT: So that part of the PR is solved already. Does the Intl.DateTimeFormat constructor use the same process as the rest of Temporal to convert the value of calendar and timeZone to a string?
- PFC: For calendar, it uses ToString. To be consistent with the rest of Temporal, we'd use ToTemporalCalendarSlotValue + ToTemporalCalendarIdentifier. For time zone, similar.
- RGN: I think there's an AO that does both.
- SFC: I'm slightly worried about breaking users with the plain Calendar and TimeZone protocol objects. I'd like to do this for only branded Temporal objects.
- RGN: In ToTemporal__SlotValue, if it's a branded Temporal object, it sails right through. If it's a plain object, it checks for all the protocol methods. So if you had an object that only implemented part of the protocol, it would be rejected.
- SFC: I'm not sure if we want to check for the protocols. Although you probably already get an exception with plain objects if you get the "[object Object]" string.
- RGN: I see, there's technically a backwards incompatibility where if you have an object that implements the protocol, you'd call the `id` getter instead of `toString`.
- JGT: Right, that would be the only case, if the object didn't implement toString, or toString and id didn't agree.
- PFC: That's not the only backwards incompatibility. Currently an object like `{ toString() { return "gregory"; } }` would be accepted, and after this change it would be rejected.
- JGT: Would it make more sense to do the ToTemporalCalendarSlotValue semantics but not throw if the object didn't implement the protocol?
- SFC: I think it's easier to reason about just not doing anything with the protocol. But I wouldn't be opposed to doing something with the protocol if we did it carefully.
- JGT: There are two options, create a variation of ToTemporalCalendarSlotValue that checks for Temporal branding first, or use the old code path first and only check for Temporal branding if that fails to produce a valid identifier.
- SFC: I prefer the latter.
- RGN: It's weird to prioritize generic ToString over the special case, but I can see it for backwards compatibility.
- PFC: I prefer checking for Temporal branding first, but I don't care that much.
- RGN: You can optimize the code path even if ToString comes first, but I think performance is not the perspective from which to answer the question.
- JGT: That seems good, because if you convert ZonedDateTime to a string, you have to do a lot of extra work.
- Conclusion: Treat Temporal branded objects specially first, then fall back to the current code path (ToString), only if that fails try the protocol.
- SFC: I suggest making a separate AO for this. I don't think this should go into the Temporal spec, it's purely an Intl.DateTimeFormat thing.
- PFC: I'd also rather see this solved in 402.
- JGT: I just realized that there's other Temporal behaviour, parsing an ISO string. Presumably that behaviour would have to be retained as well. I'm skeptical about copying a long and complicated AO in two places.
- PFC: You can reuse ToTemporal__Identifier(ToTemporal__SlotValue(...)) in the branded case and in the case where ToString fails.
- SFC: Is anyone opposed to only doing the brand check?
- JGT: I'd like it to be consistent with what you get in the rest of Temporal.
- SFC: I'd prefer to be more conservative with backwards compatibility.
- RGN: Realistically, no one will hit this case, with a toString that doesn't agree.
- SFC: What if you implement id but forget toString?
- RGN: The Calendar.prototype.toString calls RequireInternalSlot, so you can't put it on a plain object. A plain object's toString will return `[object Object]`.
- JGT: Consensus:
    - Desired steps:
        - 1. Brand-check, and if built-in object then use calendar/tz ID from it
        - 2. ToString
        - 3. If (2) doesn’t return a valid built-in ID, then call ToTemporal___SlotValue / ToTemporal___Identifier
    - Process:
        - PR in proposal-temporal
        - Bring to TG2
        - Present to TG1 as a normative 402 PR (TBD: decide whether this goes in the Intl part or the Temporal section of that plenary meeting)
    - Ideally, confine all changes to the 402 part of the Temporal spec