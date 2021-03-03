# Feb 11, 2021

## Attendees
- Shane F Carr (SFC)
- Cam Tenny (CJT)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Manish Goregaokar (MG)
- Philip Chimento (PFC)
- Younies Mahmoud (YMD)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)

## Agenda

### Remaining tasks for Stage 3
- USA: Nothing new in the IETF draft. Bron Gondwana from the CalExt group has agreed to help us on the organizational side to charter a group that can adopt the RFCs. We are on track to present at IETF 110 in March.
- PFC: The other things are some minor spec changes from delegate review that CJT is working on and rebasing the Intl part on ECMA 402 2020.
- USA: Slightly tricky because formatRange isn't merged into ECMA 402 yet. I will have a draft of dateStyle/timeStyle next week.

### [#1293](https://github.com/tc39/proposal-temporal/issues/1293) Overriding Calendar.from/TimeZone.from
- PFC: KG has joined JHD in objecting to observable lookups of Calendar.from and TimeZone.from. What's the temperature? I think we can keep this in the proposal and remove it if it really can't progress.
- USA: We should invite KG and JHD to the next meeting.
- JGT: Is there a point to keeping it in if we think it'll get the proposal rejected?
- RGN: There are groups with competing values here.
- CJT: RGN can you describe those values on #1293 as you did to us here? I think that would help the discussion.
- PFC: That sounds good and we should invite them to the meeting if that doesn’t move the discussion forward enough.

### Meeting schedule going forward
Going monthly after the March plenary, no objections.

### [#711](https://github.com/tc39/proposal-temporal/issues/711) Work items
Nothing to address today in these.

### DurationFormat issues
- YMD: Two issues to discuss.
- SFC: I don't think the style/width/display issue is relevant to this group, but I'd like to discuss the other one.
- YMD: Summarizes [#32](https://github.com/tc39/proposal-intl-duration-format/issues/32):
  1. `smallestUnit`/`largestUnit` in Temporal.Duration.prototype.round() for arithmetic; `smallestUnit` in Intl.DurationFormat for controlling the display of zero-valued fields.
  2. `smallestUnit`/`largestUnit` in Intl.DurationFormat; implicitly call Duration rounding function. No separate `hideZeroValued` option.
  3. `smallestUnit`/`largestUnit` in Intl.DurationFormat; implicitly call Duration rounding function. Include `hideZeroValued` option.
  4. `smallestUnit`/`largestUnit` in Temporal.Duration.prototype.round() for arithmetic; `requiredFields` in Intl.DurationFormat for controlling the display of zero-valued fields.
  5. `smallestUnit`/`largestUnit` in Temporal.Duration.prototype.round() for arithmetic; Include `hideZeroValued` option.
- SFC: Another relevant example is displaying a timer on your website, and you want to display 4 minutes, 0 seconds. We should add this example here. It wouldn't be covered by option 5. It would work with option 3, but to me option 3 combines arithmetic with display concerns, but maybe that's OK.
- YMD: From the user's perspective option 3 would be much better. They only have to choose the largest unit and smallest unit once.
- SFC: What if there's a case where you want to do truncation instead of rounding?
- YMD: This would be solvable if we added smallestUnit and largestUnit to option 5 as well.
- JGT: Would toLocaleString() truncate in the case of option 5?
- USA: toLocaleString() wouldn't round at all in that case.
- JGT: There's nothing in option 5 that would always show hours, minutes, and seconds.
- SFC: Is there anything in Temporal that lets you easily throw away units larger than minutes?
- JGT: No.
- USA: Option 3 internally calls round() on the duration, option 5 doesn't.
- SFC: Option 1 is the only one that covers this case. You would have to pass `smallestUnit` and `largestUnit` to round() and again to toLocaleString() which would be annoying.
- YMD: It only shows fields from hours to seconds and if there's a zero value in the middle, it will appear.
- USA: If you pass `smallestUnit` and `largestUnit` to round(), there won't be any fields outside of that range after the rounding.
- YMD: Option 5 will show zero values outside of that range if `hideZeroValued` is 'none'.
- USA: I have something to propose. Can we first agree that option 4, the status quo, is not useful as is?
- SFC: The advantage of option 4 is that it's the most flexible. It's not the most ergonomic.
- USA: Option 4 doesn't allow you to hide zero values dynamically. It always produces the exact same fields, zero or not.
- JGT: ???
- USA: What I want to propose is a combination of option 1 and option 3. You can use round() to round the duration to whatever range you have. In toLocaleString() you have `smallestUnit`, `largestUnit`, and `hideZeroValued`, but it doesn't round, it only drops fields.
- JGT: Does this API accept plain objects? Of course toLocaleString() doesn't.
- SFC: Intl.DurationFormat.format() will call Temporal.Duration.from() on the input.
- JGT: If I were to spread the hours/minutes/seconds fields from a Duration and pass that in as a property bag, then my expectation would be that only those three fields should be displayed. One crazy idea might be that toLocaleString() has a much more restricted set of display options, and if you want more specific behaviour you could use Intl.DurationFormat.
- USA: It would depend on what the defaults are.
- JGT: I meant, we could have only the defaults in toLocaleString(), and remove `smallestUnit`/`largestUnit` in favour of passing a plain object to Intl.DurationFormat.format().
- USA: I'm not in favour of that, because it goes against the common expectation of passing in an options object.
- JGT: I just want to highlight that even if we don't have options, it's still possible to get this behaviour. I think it would be bad if we balance by default.
- USA: I agree that balancing by default is bad. My proposal is that toLocaleString()'s options should only concern itself with truncation, since we have balancing and rounding by a separate method.
- YMD: What happens if we pass no options and what would be the default output?
- USA: We should agree on which options there are before discussing that.
- JGT: If it is true that we have a plain-object escape hatch, then the use cases for these options can always be supported that way as a fallback. That's why I think we should not be balancing the duration by default.
- SFC: I'm not sure I prefer this option, but it's a valid option.
- Conclusion: YMD and JGT to write this up as option 6 in the issue.
