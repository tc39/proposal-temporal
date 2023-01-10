# October 27, 2022

## Attendees
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)

## Agenda

### Status updates / Implementations progress
No updates.
- PFC: Following up from last time on the task of getting era and month codes into CLDR, we'll discuss offline.

### Status of open normative issues
Short overview of issues in progress that don't have anything specific to discuss.

### Recursive calendar/timeZone property bag edge case ([#2104](https://github.com/tc39/proposal-temporal/issues/2104))
Where we left off: Fix proposed, but the fix brings new inconsistencies. So either we need another fix or stick with the status quo after all.
- PFC: I would be OK with closing this issue. The behaviour is a bit weird but it arises from a consistent rule set.
- RGN: I feel like it is a wart, but not a fatal one. I liked the proposed fix. What was the inconsistency?
- PFC: The fix makes property bags that are valid for PlainDate.from, not work in Calendar.from.
- JGT: I don't remember what the disagreement was.
- RGN: It was about having no deep processing in Calendar.from. JGT presented some use cases but I wasn't thrilled with them.
- JGT: RGN, are you proposing that we no longer use full ISO strings to stand in for a calendar or a time zone? So you would have to construct another Temporal object with the ISO string?
- RGN: Correct. Recognizing the distinction between the name of a calendar and an actual calendar object.
- RGN: This probably would be affected if we went with the related proposal to pass built-in calendars as strings rather than instances ([#1808](https://github.com/tc39/proposal-temporal/issues/)). So I think this ticket should be a dependency of the other one.

### Break from ToIntegerOrInfinity precedent ([#2112](https://github.com/tc39/proposal-temporal/issues/2112))
Where we left off: No conclusion yet. PFC informally polled delegates and it seems this change would not be contentious. Need to discuss what exactly the changes would be.
- PFC: I'm fine to go with what we have in that table. I compared it with Web IDL.
- RGN: I don't care much, but I have a very small preference to go with undefined throwing. E.g., my intuition is that the behaviour should match what would happen if you converted all the arguments to numbers manually. The convention that absent should equal present-but-undefined is there, but not so strong that it couldn't be overridden in this case.
- PFC: You could also make the distinction between trailing undefined and non-trailing undefined.
- JGT: My intuition is that no proposal that treats absent differently from present-but-undefined will pass plenary.
- RGN: That's reasonable. We can go with the table as the plan of record. Does it agree or disagree with Web IDL?
- PFC: Disagree; Web IDL throws TypeError when converting undefined to 0.
- RGN: There might not be an actual divergence, if interfaces "shield" ConvertToInt from undefined by substituting a default argument for undefined. I'm in favour of going with what's in the table either way, though.

**Conclusion:** Proceed with the semantics in the table.

- RGN: I found an example of a Web IDL interface with an optional unsigned long long parameter, where passing 'undefined' works: `document.createNodeIterator()`. Aligning with Web IDL would mean that undefined is never explicitly converted to an integer, but undefined in the place of an optional parameter gets the default value.
- RGN: Confirmed, [ES overloads](https://webidl.spec.whatwg.org/#es-overloads) specifies conversion of explicit undefined arguments for optional parameters to the relevant default value. And there it includes similar language for dictionaries.
- PFC: So `new PlainDate(undefined, 10, 27)` would be an error.

**Conclusion:** Amend the table to do this.

### Allowing more than 9 digits in fractional part strings ([#1712](https://github.com/tc39/proposal-temporal/issues/1712))
- PFC recommendation: save for a future addition to Temporal
- RGN: As long as we reject it with an error, it's viable as a future possibility.
- SFC: There's not a lot of precision that would be gained here. For seconds, there's at most nine digits. For minutes, we only gain one such digit. For hours, you only get at most 11 digits before you get into fractional nanoseconds. Based on my discussions with FYT, anytime you do arithmetic on strings it gets complicated from an implementation standpoint. I think limiting it to 9 digits is fine and would prefer to keep it the way it is.
- RGN: Aren't there already inexact values possible?
- PFC: `"PT0.00001H"`
- SFC: That will give you an exact number of nanoseconds.
- RGN: Is that the case for any fractional string?
- SFC: A minute is 60 billion nanoseconds, so every 9-digit fraction is exact.
- RGN: As long as the behaviour is reject with error, it's an acceptable quirk that we can revisit if the need arises.

**Conclusion:** Move issue to Temporal V2.

### Non-IANA time zones in non-Intl implementations ([#1996](https://github.com/tc39/proposal-temporal/issues/1996) and [#2209](https://github.com/tc39/proposal-temporal/issues/2209))
Where we left off: These two alternatives seem mutually exclusive. Recently unblocked now that ECMA-262 uses DefaultTimeZone, so let's make a decision.
- RGN: We do already have a resolution for this, I think. ECMA-402 issue [#683](https://github.com/tc39/ecma402/issues/683) hasn't been implemented yet, but my goal for it is that ECMA-402 will not need to override DefaultTimeZone. ECMA-402 "does not prohibit behaviour that is otherwise permissible in 262". If 262 allows for a DefaultTimeZone of something that is not IANA, (which is currently the case with numeric offsets), then 402 should as well.
- PFC: 262 currently says IANA time zone strings are "recommended".
- RGN: We could have a normative change in 262 that removes that ability, in which case whatever the constraint is would apply to 402. Or we could keep it technically wide open and 402 has to deal with that. In either case, 402 has to deal with numeric offset time zones.
- PFC: A 262-only environment doesn't have to have a TZDB, but a 402 environment does. (is recommended to?) What do you do if you are polyfilling Intl onto an environment without a TZDB? Is it acceptable to make a fictitious `Etc/System` time zone to represent the one time zone that 262 is aware of?
- RGN: Yes, after [#683](https://github.com/tc39/ecma402/issues/683) is fixed. That would be unrecommended, but acceptable. As long as the implementation agrees with itself, between DefaultTimeZone, NamedTimeZoneGetOffsetNanoseconds, and NamedTimeZoneGetEpochNanoseconds. Concretely for Temporal, I think we should close both [#1996](https://github.com/tc39/proposal-temporal/issues/1996) and [#2209](https://github.com/tc39/proposal-temporal/issues/2209) — 262 discourages but allows arbitrary time zone names, and 402 uses the 262 operations without override. With Temporal, 262 has a reasonable set of time zone operations, that allow coloring outside of the lines, and what we want is for 402 not to override them.
- PFC: This means a divergence between calendars and time zones, because neither 262 nor 402 allow arbitrary calendar identifiers, but I think that's justified.
- RGN: Agreed. We avoid introducing the problem in the first place.

**Conclusion:** Close [#2209](https://github.com/tc39/proposal-temporal/issues/2209), leave [#1996](https://github.com/tc39/proposal-temporal/issues/1996) open until the 402 fix is in, although it might become a no-op.

### Check calendar in fast-path conversion to PlainTime ([#2221](https://github.com/tc39/proposal-temporal/issues/2221))
Where we left off: PFC would prefer to take the proposed PR. JGT and SFC have asked to be present for this discussion
- JGT: I reviewed this one beforehand. My main proposal was that today we don't have any use cases for time calendars at all and it's not clear we'll ever add them, so we'd be able to solve this one if we planned that time calendars would be added under `timeCalendar` if they were ever added.
- RGN: The association of calendar with time never seemed sufficiently fleshed out to me anyway.
- SFC: (via comment) Can we have a sketch of what time calendars would look like if they were introduced via a `timeCalendar` property, and whether that would be web-compatible?
- JGT: It sounds like the goal is to have a field that people can check, to see if the behaviour is what they expect?
- PFC: The goal that we decided on before, was that anytime you would otherwise create a PlainTime with a non-ISO calendar, we throw instead.
- JGT: One proposal is to introduce timeCalendar now. Would we need this property in V1 at all, in order to support it in V2?
- PFC: I can't speak for PDL but my understanding was that as the biggest proponent of time calendars, he didn't think that `timeCalendar` property would be sufficient.

**Conclusion:** Table this until PDL is present. JGT to outline `timeCalendar` on the issue.

### Unforeseen problems with plain-object calendars and time zones ([#2354](https://github.com/tc39/proposal-temporal/issues/2354))
Where we left off: we had a temperature check. Seems like most proposed solutions have at least one strong positive and at least one negative preference, unfortunately
- JGT: I support number 2 and number 4.
- PFC: Same.
- JGT: I wouldn't support 3 even regardless of JHD's comment, but that's another indication we shouldn't do it.
- JGT: I think they are not mutually exclusive and 4 is a good idea anyway. If we know that one of the objects is wrong, why not do something about that?
- JGT: Would 4 cause `z = Temporal.Now.zonedDateTimeISO(); new Temporal.ZonedDateTime(0n, z, z)` to throw?
- PFC: No.
- RGN: I'd think that should throw anyway.
- JGT: If we did 2, what methods would we check for?
- PFC: Unclear, I guess we'd check that all required methods of the protocol are present.
- JGT: I'd really prefer we do number 4, it's a small adjustment that catches the vast majority of the cases. It's unclear anyone will ever use plain object time zones. Temperature check on number 4 only?
- RGN: It's weird, but I wouldn't object. The language doesn't really put up those kinds of guardrails, where we check for a specific kind of probably unintentional construct. I don't see any negative consequences, it's just odd.
- JGT: Maybe an analogy is if you pass a number into an API that expects a bigint, it complains. The difference is this is an object instead of a primitive.
- RGN: Theoretically I can take a calendar instance and slap on time zone methods.
- JGT: I'm inclined to ignore that use case.
- RGN: No objection to number 4.
- PFC: Explicitly support number 4.
- PFC: Do we want to still consider number 2 in addition?
- JGT: I don't think so, it's a very marginal case.
- PFC: I agree, the remaining weirdness is not worth the can of worms that would be opened by deciding what shape checks to do.

**Conclusion:** Implement number 4.

### Optimize built-in calendars ([#1808](https://github.com/tc39/proposal-temporal/issues/))
- DE commented on the issue.
- (Some discussion about the SES constraint of having all built-ins be reachable from the global object)
- JGT: Can you have frozen objects without having a frozen class?
- RGN: What happens in hardened JS, you have to freeze all of the built-in objects. There are some built-ins that can't be reached by property traversal and we don't want to increase that set.
- PFC: My understanding of the frozen objects proposal would be that it's fine if we add already-frozen objects, whether or not they are reachable by property traversal.
- RGN: You have to do things like ensure all of that object's function properties themselves are frozen, but in theory yes.
- (More discussion of communication channels)
