Aug 27, 2020

Attendees:

Philipp Dunkel (PDL)

Richard Gibson (RGN)

Ujjwal Sharma (USA)

Younies Mahmoud (YMD)

Philip Chimento (PFC)

Shane Carr (SFC)

Agenda:

* [proposal-intl-duration-format#29](https://github.com/tc39/proposal-intl-duration-format/issues/29) - Negative durations in Intl.DurationFormat (10 min)

    * USA: How are negative durations represented in Intl.DurationFormat? Throwing seems wrong. Should it be combined with Intl.RelativeTimeFormat? The goal is to express a preference from the Temporal champions group, to give to the Intl.DurationFormat champions group.

    * PDL: How do we think positive durations should be formatted? That influences how negative durations should be formatted. Also, does a negative duration need to be formatted any differently than a positive duration at all? It's just a number in the other direction.

    * USA: Indeed, we originally thought of durations as having no direction. But now that there's a sign involved, they are relative. The sign is actually a direction. I think formatting it the same is viable.

    * PDL: If you think about it as a direction, then it becomes the same as distance formatting. 10 meters is formatted as 10 meters no matter which direction it's in.

    * JGT: I find it strange that we have Intl.RelativeTimeFormat and then a new Intl.DurationFormat API that essentially does the same thing only for multiple units instead of one unit. I'd rather make Intl.RelativeTimeFormat handle durations.

    * PDL: I like that thought, but on the other hand I think durations and relative durations are different things semantically.

    * USA: I am starting to rethink negative durations. A negative duration makes no sense without a reference point.

    * JGT: I disagree. If you are averaging a list of durations then the sign matters even without the reference point.

    * PDL: I disagree that negative durations have an inherent meaning.

    * JGT: I think there are 3 interpretations of the inherent meaning of negative durations. Relative to now, relative to another event, and sign-doesn't-matter. We don't know which one the user means, but Intl.RelativeTimeFormat's default interpretation is relative-to-now.

    * PDL: I see the sign only as a mathematical concept.

    * YMD: Should we combine DurationFormat with RelativeTimeFormat? Is that something we should bring to the TC39 meeting?

    * USA: I propose ignoring the sign of the duration in DurationFormat, and discuss extending RelativeTimeFormat to accept durations.

    * PFC: I like that idea, but I think ignoring the sign will be surprising to users who intentionally have a negative sign in the duration. Especially because DurationFormat is what will be used by toLocaleString to format the duration.

    * USA: Does it change your mind to consider that users should not expect to be able to format a relative unit with a non-relative formatter?

    * PFC: I still think it would be surprising. The use case of the average of an array of durations is arguably not relative.

    * USA: Proposal 2, should we rework DurationFormat to be part of RelativeTimeFormat, and make sure to include those 3 interpretations as formatting options? Justification would be that duration doesn't make sense without being relative to the reference point.

    * PDL: I agree with that but I don't agree that durations don't make sense on their own.

    * JGT: Because relative-to-now is the existing default of RelativeTimeFormat, that should be the default for consistency, but we do need to have the other 2 options.

    * YMD: Indeed, although DurationFormat is useful for users who just want to format the duration without regard to the sign. Should we rewrite the DurationFormat proposal to be part of RelativeTimeFormat?

    * PDL: I was looking at the ECMA-402 unit formatting proposal, you also need to be able to format degrees/minutes/seconds. Duration can be the same.

    * YMD: DurationFormat has all sorts of options for hiding zeroes, etc. That is different.

    * PDL: I think the same options might apply to degrees/minutes/seconds of angle. I see what you're saying though. What I'm proposing is to go with the RelativeTimeFormat, and use unit format if you want an absolute duration that's not relative to anything, which is probably not going to be the default of what people want.

    * USA: I don't think we would be able to get unit formatting to Stage 3 by November, meaning that toLocaleString would be locked in to using RelativeTimeFormat.

    * PDL: If we are saying that durations are mostly relative, should there even be a toLocaleString?

    * YMD: Durations are not relative, they are made relative by RelativeTimeFormat.

    * USA: Negative durations do have a direction.

    * JGT: Is there an existing JS API that prints, say, "2 days" in a localized format, without regard to direction?

    * USA: That's what unit formatting was intended to be.

    * JGT: Are there some small decisions we could make? Do we agree that RelativeTimeFormat should take a duration?

    * Yes.

    * JGT: Do we agree that we want to be able to have an absolute value display of durations (regardless of what form the API takes)?

    * Yes.

    * JGT: Which of the three options for displaying a duration as an absolute value (unit formatting, or an option in RelativeTimeFormat, or a separate API like DurationFormat) seems better?

    * USA: My opinion is DurationFormat because we've already convinced TC39 of the need for it, which is not the case for unit formatting. Using RelativeTimeFormat to output a string that is not relative.

    * PDL: RelativeTimeFormat is actually a kind of DurationFormat, then.

    * JGT: The name doesn't matter very much, as you will usually access it via toLocaleString.

    * Conclusion: this is sufficient input for the DurationFormat champions, YMD will bring this back to the next meeting.

* [#822](https://github.com/tc39/proposal-temporal/pull/822) - Which calendar 'wins' in difference() and formatRange()? (5 min)

    * PDL: This depends on the default calendar discussion. If the ISO calendar is the default, then I agree with this, otherwise not.

    * PFC: SFC's point was that you get the ISO calendar when you parse an ISO string, regardless of what the default calendar is.

    * JGT: I've been convinced that we should just disallow cross-calendar here. It's bug-prone.

    * PDL: I prefer that too.

    * SFC: Does anyone agree with the mental model of the ISO calendar being weaker than another calendar?

    * USA: The original rationale was keeping a reference date in ISO, but doing calendar math against that reference date.

    * PFC: I do see that use case, but I think it's marginal. If we think that allowing this math is bug-prone, then I'm fine disallowing it.

    * PDL: Consensus?

    * SFC: Agreed, on the condition that iso8601 and gregory are treated as different.

