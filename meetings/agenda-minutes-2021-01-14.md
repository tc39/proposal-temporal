# Jan 14, 2021

## Attendees

- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Younies Mahmoud (YMD)
- Cam Tenny (CJT)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Justin Grant (JGT)
- Leo Balter (LEO)
- Philipp Dunkel (PDL)
- Manish Goregaokar (MG)
- Daniel Ehrenberg (DE)

## Agenda

### Stage 3 status
- PFC: Currently the open questions are the IETF draft, the question of whether DurationFormat stage 3 is a blocker, and the issues that came up during the calendar research that are included on the agenda below.

### Do Temporal Stage 3 and DurationFormat Stage 3 depend on each other?
- USA: What do others think, should Temporal Stage 3 be blocked on DurationFormat Stage 3? Given the agenda deadline of tomorrow.
- JGT: If they could be done in parallel, that would be great.
- LEO: If the sentiment in the group is to advance to Stage 3, even if there are some open questions, it should go on the agenda, but please make sure to include slides with the open questions such as this one.
- USA: Even if we are dealing with larger questions for DurationFormat, such as "should there be a DurationFormat object or part of RelativeTimeFormat"?
- PFC: That might be an objection for Stage 3 of DurationFormat, but not Temporal.
- USA: I agree it doesn't make sense to do DurationFormat before Temporal, but does it make sense to do Temporal before DurationFormat?
- SFC: Temporal is one of the most expensive proposals to implement that will have been passed by TC39 in a while. Implementations won't have gotten around to implementing `Duration.toLocaleString()` by the time DurationFormat proceeds.

### IETF draft
- USA: The agreed-upon format for annotations is `[namespace-key-value]`. One-letter namespaces are reserved for BCP 47, so Unicode Consortium gets the namespace "u". If everyone in this call is happy with it, my intention is to finish the draft this week and submit it for adoption.
- RGN: High-level question, where do you expect the registry of extensions to live? IANA, or Unicode Consortium?
- USA: I'm copying the process described in BCP 47 for this. They are managed by IANA.
- RGN: That's the norm for IETF. Since there were other groups involved I wasn't sure, but this is fine. I think it's the best possible outcome.
- USA: This also allows registering extensions without amending the RFC.
- RGN: What's the best way to give feedback on the draft?
- USA: GitHub issues or email.
- PFC: Do we need to register our calendar key, or is it already registered because it gets the existing `u-ca-` one from BCP 47?
- USA: Possibly, but given its prior existence I think it's pretty safe.

### DurationFormat issues; `Duration.toLocaleString()`
- Should we format absolute duration? e.g. “3 days” or “4 days and 5 hours”
- JGT: If we adopt RelativeTimeFormat, then the default is already decided for us. What's the argument in favour of a separate object?
- USA: The argument is that it feels weird to have an option to RelativeTimeFormat to format a duration as absolute.
- YMD: RelativeTimeFormat for relative, DurationFormat for absolute.
- SFC: It's good to have the output of `toLocaleString()` represent the same concept as the output of `toString()`, which is absolute, disregarding the sign for the moment. The second issue is that RelativeTimeFormat currently does not support formatting of mixed units. That would require an additional proposal, and neither CLDR or ICU currently support it. This feature has been requested, but that's a 2022 time scale feature.
- JGT: That's the same problem as DurationFormat.
- SFC: It's a completely different code path.
- YMD: ???
- JGT: If you send a negative duration into a localized method, it should not just drop the sign.
- SFC: Negative durations should not determine the decision. We should optimize for the case of positive durations, and then decide how to handle a negative sign.
- JGT: Do you think that the localized output for `+PT2H` and `-PT2H` should be the same?
- SFC: I don't have a strong feeling either way.
- JGT: That question drives me to think that the default output should be relative.
- SFC: Why could it not be the absolute output with a minus sign?
- YMD: I would prefer to agree whether we need the DurationFormat or not, and then decide what to do with negative durations.
- JGT: I disagree. Given that the three formats exist, spreading them across two separate objects seems wrong.

### Make reference year / day required in MonthDay / YearMonth [#1240](https://github.com/tc39/proposal-temporal/issues/1240) and MonthDay.equals() [#1239](https://github.com/tc39/proposal-temporal/issues/1239)
- PFC: I think we should close these two given the stage that we're in.
- JGT: Should the calendar canonicalize the reference year?
- SFC: You only get these weird cases if you use the constructor. That's just an unfortunate corner of the API and I'm not sure there's a way around it.
- JGT: How does the calendar choose a reference year given a month and day in `from()`?
- SFC: First year after 1970?
- JGT: Many calendars have a 60-year cycle.
- SFC: Then a different standard, as long as it is consistent. It's OK if the reference year is in the future.
- PFC: I think this is out of scope for Temporal. The calendar is responsible for picking the reference year.
- (Some confusion about the term "canonicalize")
- SFC: In the ISO calendar, if you pass a PlainDate to `PlainYearMonth.from()`, it does discard the year and picks 1972, correct?
- PFC: Correct.
- We agree to keep the status quo where the calendar is always responsible for choosing the reference year (except in the type's constructor where it is given exactly), and `from()` always ignores a passed-in `year` field.

### Move validation of fields and options objects into calendar implementations [#1229](https://github.com/tc39/proposal-temporal/issues/1229) / [#1235](https://github.com/tc39/proposal-temporal/issues/1235) / [#1253](https://github.com/tc39/proposal-temporal/issues/1253)
- PFC: I think that this does meet the bar for changes at this point, so can we agree to go ahead with these?
- USA: Agreed, if you are using a non-ISO calendar then validation can mean something very different.
- JGT: One question I had was that we currently access custom fields after the built-in fields, do we have to do that?
- PFC: If we go ahead with this, then we no longer have to specify it except for the ISO calendar.
- SFC: Very much agreed to not do pre-processing on the options bag.

### Month / monthCode / monthIndex [#1203](https://github.com/tc39/proposal-temporal/issues/1203)
- JGT: I have five points that we can discuss before deciding on the names.

1. iCalendar string representation of months
   - SFC: I'm not comfortable making this decision without Manish here. The other thing not covered by this is Hindu calendar months that may be combined.
   - RGN: Are you saying that the spec does not accommodate this?
   - JGT: Correct, you can end up with a month that's month 3 and month 4 combined, and that's not accommodated by the "L" syntax.
   - RGN: It doesn't specify exactly how, but it does accommodate it. If you merge months 3 and 4, there are multiple ways to represent that; skipping "3" or "4", for one. It's underspecified, but not impossible to accommodate.
   - JGT: We can safely say that there's no specification for the Hindu calendar.
   - USA: The Indian national calendar is the one that's supported by ICU.
   - JGT: All the ICU-supported calendars are fine.
   - SFC: Maybe JGT, MG, and I can meet to work this out.
   - JGT: Sounds good. My standpoint is that the name of the month should not matter for the identifier.
   - SFC: I understand that point of view. The goals of having an identifier for use in formatting and having equality semantics are mutually exclusive.

2. We need both a month code and a month index property
   - SFC: You've definitely presented use cases for a monotonically increasing month index property. I don't feel strongly about it, but I'm OK to have it.

3. Either the month code or the month index should be able to be used in `from()` and `with()`.
   - RGN: Is the idea that they'd be passed with the same property name? Or would there be no ambiguity because they would use different property names?
   - JGT: The latter.
   - RGN: So by the naming, both would be equally "dis-privileged" or one of them privileged by virtue of having the name `"month"`?
   - JGT: That's the bikeshed.
   - PDL: What do you imagine the month code for the ISO calendar to be?
   - JGT: The string versions of the integers.
   - PDL: Can we have disambiguation depending on the type?
   - ???

### `eraYear` [#1231](https://github.com/tc39/proposal-temporal/issues/1231)
We decide to have an overflow meeting to close out these questions. Since the editors have not reviewed the spec for the January meeting, and SFC is not comfortable proceeding without resolving these questions, we will attempt to go to Stage 3 in the March meeting. We will need to make it extra clear that the spec is ready for review. PDL, DE, PFC stress the need of not changing spec text from our side, and only accepting changes that originate from delegate reviews.
