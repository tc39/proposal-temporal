# November 9, 2023

## Attendees
- Richard Gibson (RGN)
- Chris de Almeida (CDA)
- Philip Chimento (PFC)
- Jase Williams (JWS)
- Cam Tenny (CJT)
- Shane F. Carr (SFC)
- Justin Grant (JGT)

## Agenda

### Status of pending PRs ([#2628](https://github.com/tc39/proposal-temporal/issues/2628))
- PR [#2571](https://github.com/tc39/proposal-temporal/pull/2571) - Thanks JWS for review. Expect tests to be merged within the next few days. If you want to review, do soon!
- PR [#2722](https://github.com/tc39/proposal-temporal/pull/2722) - Next thing to review if anyone has time. Then [2612](https://github.com/tc39/proposal-temporal/pull/2612)

### Adjustment to method records lookups ([#2724](https://github.com/tc39/proposal-temporal/issues/2724))
- PFC: Agree with RGN that this is overly complex, would not mind changing it. If we make the change, we probably don't have to go back to plenary, but we should do it soon.
- JWS: Will take a look.
- PFC: Decision to make is, is it OK to look up a method in some situations but never call it?
- JWS: What situations are these?
- PFC: e.g. in RGN's example, PYM.add/subtract, we only call calendar.day if adding a negative duration or subtracting a positive one.
- No strong feelings. PFC to prepare a PR and RGN to review.

### Request from ABL to move GetOptionsObject ([#2721](https://github.com/tc39/proposal-temporal/issues/2721))
- JWS: What motivation is there to move GetOptionsObject before BalanceTimeDuration?
- CDA: There's no explicit motivation provided, doesn't seem overly compelling.
- RGN: I think consistency is probably the motivation. Looking at the steps, I agree with ABL, though I don't know how strongly. Once you're interacting with the receiver's calendar, you really ought to have been done with basic validation. Don't know what the importance is.
- JWS: So ABL's point is that GetOptionsObject is basic validation that should happen before CalendarFields etc.
- RGN: We are a bit vague about this, we say that argument processing should happen in order, but we don't really define what that entails.
- PFC: To me it doesn't meet the bar for a change at this point.
- RGN: If I put myself in the shoes of someone looking at this 10 years from now, how big of a wart is it? Very small. It only matters for what error is thrown. By itself, I don't think it meets the bar, I'd need to see a demonstration of where it's actually a problem or how it is gratuitously different than the rest of Temporal.
- JWS: Agree.

### Oops, the example NY Stock Exchange time zone has been broken since May 2020
- PFC: We limit UTC offsets to &lt; nsPerDay. The NYSE time zone would disambiguate an instant on Friday evening forwards to the next market opening on Monday morning, which is a UTC offset larger than 24 hours. Unfortunately our tests never covered this case.
- SFC: Seems like some limit is still necessary.
- RGN: What would be the effects downstream of changing this?
- PFC: Not sure.
- JGT: We should look back at the notes and verify that this is a real problem. If it's a real use case, it seems OK to relax.
- JWS: Why was this restriction there in the first place?
- PFC: It was before we introduced custom time zones, so more than 24 hours would go across the international date line twice.
- JGT: The time zone changes its offset all the time.
- CJT: The NYSE time zone is unique in that it has "less time" than a normal time zone.
- JGT: The NYSE time zone is the only example we've ever found that would need this functionality. Even if we wanted to, is it worth it to support a normative change for this? How important is the use case? Certainly we'd need the functionality to get the next market plain time for a given instant, and there's a certain elegance in using a time zone, but does it need to be a time zone?
- JWS: Will talk to PDL and come back to you.
- JGT: What does toString look like on a ZDT with one of these weird offsets?
- JGT: Is there a code snippet that breaks the time zone?
- PFC: `zdt = Temporal.ZonedDateTime.from('2023-11-10T21:00-05:00[America/New_York]').withTimeZone(tzNYSE); zdt.toPlainDateTime();` gives a UTC offset of 55:30.
- JGT: Could you get away with overriding getPlainDateTimeFor?
- PFC: We only call getOffsetNanosecondsFor internally, because we decided that getOffsetNanosecondsFor and getPossibleInstantsFor would be the two building blocks that we would call internally.
- PFC: I think it's OK to say in this case that you have to use the TimeZone.prototype methods directly.
- JGT: That seems reasonable.
- JGT: Would it be web-compatible to make that change directly? Probably not.
- Options:
    1. Do nothing. NYSE time zone would need to use TimeZone.prototype methods directly.
        - Document that most operations won't work in Temporal if your custom time zone has offsets >= 24 hours.
    2. Relax the restriction after determining that nothing else would break.
    3. Change Temporal to call getPlainDateTimeFor/getInstantFor internally.
        - 3.a) If the method doesn't exist, do it the way we currently do. If it does exist, call it.
- JWS: Feels weird to do something different with these time zones, even if they are weird. Would prefer 2 if it's possible.
- JGT: Regardless, it still won't be serializable - UTC offset `+55:30` is not a valid ISO string. I wonder if there are any other operations that don't work.
- JGT: With option 2 we'd have to add a check in toString to make sure the offset wasn't >= 24:00 before serializing.
- PFC: If we did go with option 2, what would a reasonable limit be?
- JGT: 1 week? 1 year? Max safe integer of ns is 104 days. It seems convenient for implementers that they can currently know that the offset is &lt;48 bits.
- We'll open an issue about this.
- JGT: 3.a) could be an option, although it wouldn't be web-compatible. Makes me a bit nervous that I can build a custom time zone with a getPlainDateTimeFor method that might give me a different result than ZonedDateTime.p.toPlainDateTime, if my method had a bug. Might be too late to change that.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- PFC: Listed new invariants in [a comment](https://github.com/tc39/proposal-temporal/issues/2535#issuecomment-1800702988).
- RGN: New algorithm in [another comment](https://github.com/tc39/proposal-temporal/issues/2535#issuecomment-1804302061).
- JGT: The 1 month 40 days result seems counterintuitive to me, where the remainder of days is larger than a month. Seems to me the most common use case for this subtraction would be to put the result into DurationFormat and show it to an end user. I guarantee that showing "this task took 1 month and 40 days" will be an end-user complaint. I think the weirdness we currently have can be odd to developers in some cases, but I don't think it's an end-user complaint.
- Looks like the long term solution is to pick which algorithm needs to be default, and provide an option if we get complaints in the future.
- We'll put our input into GitHub during the week and revisit this next week.
