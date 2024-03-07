# December 7, 2023

## Attendees
- Chris de Almeida (CDA)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Richard Gibson (RGN)

## Agenda

### Status of pending PRs ([#2628](https://github.com/tc39/proposal-temporal/issues/2628))
- PR [2727](https://github.com/tc39/proposal-temporal/pull/2727)
    - PFC: Anba has found issues with this one, which I've been addressing. Would also be useful to have a review from a champion on it, when it's ready.
- PR [2612](https://github.com/tc39/proposal-temporal/pull/2612)
    - PFC: Still investigating the last commit for a potential bug. Also this PR will contain any resolution to the weeks rounding weirdness [#2728](https://github.com/tc39/proposal-temporal/issues/2728) if we decide to do anything different there.
- PFC: Plan is to get these merged and give signal to implementors sometime between now and next plenary.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- Last time we discussed expressing the candidate algorithms in a clearly explainable way, and visualizing whether they give monotonically increasing distinct results. 
- PFC and RGN to prepare this clear explanation, and maybe the visualization if we can make sense of what to visualize, for next meeting on 2024-01-11.
