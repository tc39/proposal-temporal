# February 17, 2022

## Attendees
- Shane F. Carr (SFC)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Philip Chimento (PFC)

## Agenda

### IETF status
- SFC: USA shared an update. He believes there are no more open questions on the draft so he plans to ask for adoption on the next IETF meeting.
- JGT: I thought there was one open issue on the mailing list about interpretation of timestamps.
- We'll discuss this with USA on Matrix.

### ECMA-402 status - discuss any open issues after last week’s ECMA 402 meeting
Did the presentation achieve what we wanted?
- SFC: I think it did. The goal was transparency and we achieved that.
- PFC: We discussed passing calendar and time zone objects into the options parameter of DateTimeFormat, anything else while I was out of the meeting?
- SFC: Mainly that. We got an explicit signal to go ahead with the plan that we had formulated on that issue, that it's OK to do things in 402 that are strongly dependent on Temporal.
- JGT: The calendar standardization pull request is close, but it would be great to be able to merge it.
- PFC to follow up about that pull request.

### Is 12-07 standardized in ISO 8601, and if not should we use a standard format instead? ([#2049](https://github.com/tc39/proposal-temporal/issues/2049))
- PFC: I know the 2-dashes format was in previous editions of ISO 8601, not in current ones, and it's still in the grammar in RFC 3339
- RGN: I did some digging. The semantics were of an "implied" year, where it would be clear from context.
- PDL: I thought that both the dash and the X syntax referred to missing data. That is, there is a year but we don't know what it is. That's different from PlainMonthDay, where the year is intentionally not there. I wonder if the Xs or the dashes would be the right semantic format.
- RGN: I think the Xs definitely not. They mean unspecified, rather than a collection that may mean multiple values. There is a specified syntax for month-day in HTML, which supports either 0 or 2 leading dashes, which doesn't provide clarity here, but confirms that either seem reasonable.
- PFC: After reading RGN's comment on GitHub I think it's OK to use the current format, since PlainMonthDay was added originally to match the corresponding HTML input type.
- SFC: My interpretation is that the Xs mean missing information, that is supposed to be there but is unknown. So I don't think PlainMonthDay is what the X is intended for.
- RGN: Agreed. Given that, it looks like the two good choices are `MM-DD` and `--MM-DD` and the choice is arbitrary since HTML will accept either.
- PDL: If you look at what a PlainDate looks like, you get `YYYY-MM-DD`, so if you replace `YYYY` with `-` you get `--MM-DD`. To my mind that's also an indication that the year is missing rather than unspecified, so I have a preference for not using `--MM-DD`.
- PFC: Would anyone object to the status quo, accepting both `--MM-DD` and `MM-DD`, and emitting `MM-DD`?
- PDL: That's what I'm proposing.
- JGT: The reason I opened this issue is that we got pushback on appearing to choose an unstandardized format. If this format is standardized, even if not in ISO 8601, that seems fine. The argument about interoperation with HTML seems most compelling to me.
- PFC: Agreed.
- JGT: Does anyone foresee any problems with that?
- SFC: We could ask USA whether this format would be in scope of the IETF draft.
- PFC: My recollection was that the chairs of that working group asked to limit the scope of that draft. We dropped things for that reason.
- SFC: True, but that was mainly about the scope of replacing RFC 3339. I don't think that adding MM-DD would necessarily be out of scope. I think if we were to make a small addendum before going for ratification, maybe it would meet resistance but I don't think it would be out of scope.
- JGT to follow up with USA about this.
- SFC: Why prefer the format without the dashes?
- PFC: I prefer it because it's less surprising when people see it in the output of toString.
- PDL: I see it as a dash for the year and a second dash for the separator, implying that the year is missing.
- SFC: The two dashes are less ambiguous to my mind, but I don't have a strong preference.
- PDL: I think the ambiguity is already eliminated because we always have components in descending order: Y-M-D, M-D. We never have D-M. Also other formats are likelier to have / or . as separators, so the - already sets it off.
- SFC: I have a slight preference for `--` in the output, but the thing that sways me is that we haven't had those dashes the whole time we've been at Stage 3, and there hasn't been an issue. So it's working and I don't see a compelling reason to change.
- JGT: Agreed.
- Conclusion:
  - keep the status quo
  - update the documentation to point to the HTML format if necessary
  - and investigate adding this format to the IETF draft, but do the above regardless.
### -0 in Temporal.Duration ([#1715](https://github.com/tc39/proposal-temporal/issues/1715))
Any new thoughts?
- JGT: What's the status quo?
- PFC: -0 is not supported in Temporal.Duration, except there are some places in the spec where it is accidentally inconsistent and you can get -0.
- JGT: Does anybody think we should support -0?
- SFC: I think we should, but I was the only one. I think this is something we could look to TC39 for guidance about.
- JGT: My point of view is that Durations are not IEEE floating point numbers, so there is no reason to have -0.
- PFC: I agree, BigInt does not have -0. Duration is still a bit ambiguous. On one hand it is a collection of numbers that overflow to infinity, but on the other hand they are integers so are not floating point numbers.
- SFC: My point from last week is that -0 has meaning, it's a negative Duration that has no magnitude.
- PFC: My understanding of -0 in IEEE floats is so that when they underflow to 0 they preserve the sign. I don't think we have that use case in Duration.
- JGT: I always assumed they just exposed the sign bit because it was easier.
- SFC: In NumberFormat we preserve the sign when rounding down, so that is akin to the underflow use case. It seems useful to preserve the sign as well when rounding down in DurationFormat.
- JGT: If we do have -0, then yes I agree it should work like -0 in other contexts. For me the higher order bit is, does it help or hurt in the contexts where people would use Duration. I think it's a net harm, and I think there's a reason that more recent numeric types like BigInt eschew it.
- SFC: BigInt not having it is certainly a precedent we could cite.
- RGN: https://github.com/tc39/proposal-bigint/issues/29 is the original issue from BigInt where it was decided (without much discussion) to not have -0.
- SFC: In Duration, all of the values are integer Numbers?
- PFC: Indeed, they cannot have a fractional part, they can be infinity, and they can't be NaN. (note afterwards: I was mistaken, valid Duration objects cannot have fields that are infinity; Duration arithmetic overflows to infinity the same way Number does, but then the operation throws)
- SFC: If we are already disallowing some legal Number values then it's not such a stretch to disallow -0.
- JGT: I see it as defining which collection Number values are a valid Duration object. Is this discussion on BigInt the precedent that we need?
- SFC: I would like to explicitly call it out to the plenary.
- PFC: That will happen in any case, because we'll need to present a normative change to fix the inconsistencies in the spec where you can accidentally get -0 out in the status quo. We can point it out at that point.
- JGT: Works for me.
- SFC: I'd like to make sure we explicitly call it out in the slide, we should be very explicit about it and not brush it under the rug, since it was an implicit decision before.

### New community polyfill!
https://github.com/fullcalendar/temporal/tree/main/packages/temporal-polyfill
- JGT: I've used Adam Shaw's work in my startup and it's good stuff. It doesn't seem to be 100% spec compliant and I wonder if TC39 has any guidelines on that.
- PFC: He does say that he optimizes for bundle size at the expense of spec compliance?
- JGT: It wasn't clear whether that meant, "not work on pre-BigInt browsers" or "be OK with gaps in spec compliance".
- PFC: If they add test262 tests, we'll have more information.
