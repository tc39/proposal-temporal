# November 16, 2023

## Attendees
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Chris de Almeida (CDA)
- Cam Tenny (CJT)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)
- Shane Carr (SFC)
- Jason Williams (JWS)

## Agenda

### Status of pending PRs ([#2628](https://github.com/tc39/proposal-temporal/issues/2628))
- PR [#2722](https://github.com/tc39/proposal-temporal/pull/2722) - Ready to merge. If any comments on the special case for smallestUnit weeks, would appreciate hearing them now.
    - RGN: Could test this exhaustively on 0-53 weeks, with relativeTo every day in a common and leap year.
    - JGT: The invariant is that weeks only show up in the output if largestUnit or smallestUnit is week.
    - RGN: Any other invariants?
    - JGT: smallestUnit: “weeks” ⇒ balanced output has days: 0 and weeks balanced up to months
    - PFC: let’s consider `{ months: 1, weeks: 6, days: 1 }` relative to 2023-01-01 with smallestUnit “week”...
    - RGN: Better to keep this open longer to resolve this, or merge it now and consider it for a follow up?
    - JGT: Better to go to plenary only once, instead of twice.
    - PFC: I can try to come up with an algorithm that does what we want, if we can specify what we want.
    - RGN: three cases to consider: `{ …, months: maybeBig1, weeks: maybeBig2 }` vs. `{ …, months: maybeBig, weeks: 0 }` vs. `{ …, years: 0, months: 0, weeks: maybeBig }`
    - We'll go ahead and merge this, and roll the potential bugfix into part 3.
- PR [#2727](https://github.com/tc39/proposal-temporal/pull/2727) - Next thing to review if anyone has time. Will soon be the bottleneck.
    - JWS: By when would you want to merge this?
    - PFC: Hopefully mid next week.
- PR [#2612](https://github.com/tc39/proposal-temporal/pull/2612) - Only the last commit, the others are split out into [#2722](https://github.com/tc39/proposal-temporal/pull/2722) and [#2727](https://github.com/tc39/proposal-temporal/pull/2727). PFC investigating for potential bug. Still, can be reviewed.
    - (We'll also put the weeks fix in here)
- Plenary
    - Will present one normative PR
    - Will hopefully be able to say that everything's caught up and implementation should start again
    - SFC: I think it might make sense to land a lot of this Duration arithmetic into ICU4X.

### GetOffsetNanosecondsFor limit ([#2725](https://github.com/tc39/proposal-temporal/issues/2725))
- JWS did the research and it seems like nobody cares. This probably won't affect the way that we look at stock exchanges.
- Conclusion: Close this and do nothing.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- PFC: Summary, RGN came up with an algorithm that upholds the invariant of varying one input while holding the other constant always producing different output. However, it produces outputs that would be surprising to users.
- JGT: Defaulting to output that looks unbalanced just seems wrong.
- PFC: I also looked at java.time's algorithm. RGN values an invariant where changing either start or end while holding the other constant always changes the output. Java.time maintains it for many inputs, but not all, and just seems to be plain wrong for negative differences.
- JGT: So just adopting java.time compatibility would not be satisfactory.
- RGN: Is there a middle ground, where the algorithm doesn't produce those cases that look unbalanced, while it doesn't produce lossy results when the number of days is small? Enter 'lossy mode' if the number of days is above a certain threshold. The results I'm most troubled by are the ones Anba identified at the top of the ticket.
- JGT: So in your proposal, what is the maximum number of days that could be returned? 31?
- RGN: That's the secondary question. If we do this middle ground, we'd have to pick that. We could say 31, or it could depend on the month.
- JGT: Does that still achieve the invariant that diverging inputs always produce diverging outputs?
- RGN: Only for small durations. Say, 1971-12-30 to 1972-03-10 is 1 month, 40 days. You go to January 30th but you can't go to February 30th, so it's all 29 days of February plus 1 day of December plus 10 days of March. This would go into lossy mode.
- SFC: Does lossy mode only trigger on days that are at the end of the month, 29, 30, and 31?
- RGN: Yes, probably if the start or end day is ≥ 29.
- SFC: It sounds like there are two ways to handle end-of-month lossiness. Either you truncate to the last day of the month, or you keep the month in days. Are those basically the two modes and we have to pick one?
- RGN: You can dynamically select the threshold to move from one mode to the other.
- SFC: So, mode A, mode B, and a hybrid mode. Mode A is 2 months, 10 days for the example above. Mode B is 1 month, 40 days.
- JGT: I think mode B should never be the default because it's contrary to user expectations.
- JGT: In a lot of ways the algorithm we choose doesn't matter, as long as it's clear to users. Is the current behaviour clearly explainable as considering each unit in turn independently and constraining after each one?
- RGN: I may be wrong but I suspect not.
- JGT: If it is clearly explainable, following the spirit of iCalendar in that it starts with the largest unit first, I'd be in favour of keeping it.
- RGN: I agree that clearly explainable is better, but I disagree that that makes it worth preserving the current behaviour. Anba's examples are really problematic to me.
- PFC: From a pragmatic approach, we don't have this hybrid algorithm yet. All the algorithms on the table have weird cases and I'm not confident that this new algorithm won't.
- JGT: The advancement deadline is tomorrow. We're not at a point where this has crystallized enough to be ready in 24 hours. I'd prefer that we research this some more.
- SFC: Research could include visualizing whether the algorithm gives monotonically increasing distinct results.
- Conclusion: We will continue discussing this.