# January 25, 2024

## Attendees
- Shane Carr (SFC)
- Richard Gibson (RGN)
- Jase Williams (JWS)
- Adam Shaw
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Phillip Dunkel (PDL)

## Agenda

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT presents the topic: [(GitHub comment)](https://github.com/tc39/proposal-temporal/issues/2535#issuecomment-1909798554)
- Where should `add` constrain intermediate values?
    - JGT: One question was why we don't constrain between years and months, and we do constrain between months and weeks/days. I thought that constraining only the next lowest unit might be a good way to express the answer to this. I think this is consistent with the way we thought about the algorithm initially.
    - PFC: I think this explanation makes a lot of sense.
    - RGN: Makes sense. It's not a change in intent.
    - PFC: I think we might be constraining to a real time after adding months, looking at the bug Adam found.
    - Adam: The bug is more in until().
- Why don't round() and until() always agree?
    - JGT: It seems like we probably don't have enough test coverage for this.
    - PFC: I'm working on it. I have something that works but still makes extraneous method calls. I'm planning to take a look at Adam's polyfill today.
    - Adam: Happy to help.
    - PFC: This seems like it will also close the thread about weeks rounding ([#2728](https://github.com/tc39/proposal-temporal/issues/2728)), because we'll do the same thing as until() which is well-defined.
    - JGT: Does this help with the round() on plain types in [#1785](https://github.com/tc39/proposal-temporal/issues/1785)?
    - Discussion of why round() on plain types is different from round() on duration
    - PDL: We're changing duration rounding, but that doesn't apply to plain types.
- JGT: Do we have consensus on #1?
    - Yes.
- Where should until constrain intermediate values?
    - Adam: I saw the previous comments were all constraint-based explanations, so I attempted to write an imperative explanation that could be used for an implementation. Not sure if it agrees with what Richard wrote earlier.
    - Adam: When doing this for ZonedDateTime it has to offload some of the calculations to PlainDateTime so that it can do calculations with the calendar. The problem is that there's an intermediate value that only adds years/months/weeks.
    - JGT: This sounds right to me, and very clear.
    - PDL: If you constrain to real month/day at every point, do you introduce errors at the edges? E.g. 2020-02-29 + 3 years 1 month = 2023-03-28?
    - JGT: Do you always end up at the correct endpoint?
    - PFC: I think with the current algorithm you'd end up at 2023-03-29.
    - JGT: So maybe we don't take days into account when constraining after adding years?
    - RGN: I think this generalizes to inversion but it's not 100% clear to me. Also it would be nice to work out an example that I find troublesome.
    - (Discussion of algorithm below)
    - SFC: Is it necessary to constrain in step 1?
    - JGT: For lunisolar calendars it is.
    - RGN: Re. 6, -2 y -1 m -1 d is a wrong result from my perspective because you'd get the same result if you started from 2022-03-31.
    - JGT: Let's look at an example 6-prime.
    - RGN proposes an alternative for 6-prime.
    - JGT: This is a concern with the proposal, 32 days is obviously more than a month and will seem like an error to the user unless they're familiar with the intricacies of the algorithm.
    - PDL: The result with 32 days is reversible.
    - JGT: We have a choice between an algorithm that's reversible but gives results that can seem obviously wrong, and an algorithm that does neither of those things.
    - PDL: I'm with RGN on this one.
    - JGT: I'll switch gears for a moment away from the algorithm. In my company's software it's often the use case to generate a duration showing how long something took. In that case you don't have the reference point. It would just look weird to see "this took 0 months 32 days"
    - PDL: I think that's a question for DurationFormat. You shouldn't sabotage the correctness of the result in order to display it to the user.
    - PFC: The philosophy of DurationFormat is that they don't do math on the Duration, math should be scoped to Temporal. This comes back to the crux of the discussion, that I think there are use cases for both. I'd prefer controlling it with an option that we introduce in Temporal V2.
    - RGN: Also this is specifically happening for negative durations. Those are already weird to display to users.
    - PFC: Is it really only happening for negative durations? Weren't there examples in the original issue that had positive durations?
    - JGT: Re. 7, I think the use case of until() and since() is to generate a duration to display. While I agree with the principle of reversibility, if the tradeoff is to generate 0 months 60 days, I think we need to go for the one that looks balanced.
    - PDL: I disagree, correctness and reversibility is much more important. You can definitely go from 0 months 60 days to the balanced duration.
    - PFC: I don't think you can, unless the option for the other algorithm is there. round() would also give you the unbalanced duration.
    - PDL: You can write your own algorithm if you have the starting point and you know what you want.
    - SFC: Month codes can be compared ordinally, so there is ambiguity. In example 9, M12 is ordinal month 13 in that year.
    - RGN: 9b is clearly correct to me and it works because we're doing a lexicographic treatment, with awareness that M05 &lt; M05L &lt; M06.
    - SFC: I agree. This is evidence that we should be thinking of this in terms of month codes.
    - PFC: Month codes seem like the right way to do it.
    - No conclusion; continue tomorrow.


### Proposed algorithm

1. Add (without constraining) as many years as possible to `d0` without surpassing `d1`.  “Surpassing” here (and in all steps below) means to take YMDT all into account lexicographically. 
2. After we have a result, constrain to a real year/month (NOT year/month/day). (Only matters for lunisolar calendars.)
3. Add (without constraining) as many months as possible to `d0` without surpassing `d1`. (taking all units into account). 
4. After we have a result, constrain to a real year/month/day. 
5. If largestUnit=week, add as many weeks as possible to `d0` without surpassing `d1`.
6. Add as many days as possible to `d0` without surpassing `d1`.
7. Constrain `d0` to a real time
8. Find the nanosecond difference between `d0` and `d1`.
9. If the nanosecond sign agrees with the sign from the original `d0`->`d1`, done
10. Otherwise, repeat the algorithm but with `d1` moved a day closer to `d0` for all steps

### Worked examples

1. 1970-12-31 to 1971-02-28 (current alg: = 2 months)
    - Years = 0 (1970-12-31)
    - Months = 1 (1971-01-31)
    - Days = 28 (1971-02-28)

2. 1970-12-31 to 1971-03-05 (current = 2 months 5 days)
    - Years = 0 (1970-12-31)
    - Months = 2 (1971-02-31 → 1971-02-28)
    - Days = 5 (1971-03-05)

3. 1971-01-29 to 1971-02-28 (current = 1 month)
    - Years = 0 (1971-01-29)
    - Months = 0 (1971-01-29)
    - Days = 30 (1971-02-28)

4. 2024-02-29 to 2028-02-28 (current = 3 years 11 months 30 days)
    - Years = 3 (2027-02-*29)
    - Months = 11 (2028-01-29)
    - Days = 30 (2028-02-28)

5. 2020-02-29 to 2023-03-29 (current = 3 years 1 month)
    - Years  = 3 (2023-02-*29)
    - Months = 1 (2023-03-29)
    - Days = 0

	Original Proposal (constrain to real date after every step)
    - y=3 (2023-02-28)
    - m=1 (2023-03-28)
    - d=1 (2023-03-29)

6. 2022-03-30 to 2020-02-28 (current = -2 years -1 month -1 day)
    - Years  = -2 (2020-03-30)
    - Months = -1 (2020-02-30 -> 2020-02-29)
    - Days = -1 (2020-02-28)

    **6′.** 2022-03-31 to 2020-02-27 (current = -2 years -1 month -2 days)
    - Years  = -2 (2020-03-31)
    - Months = -1 (2020-02-31 -> 2020-02-29)
    - Days = -2 (2020-02-27)

    (RGN’s suggestion)
    - Years  = -2 (2020-03-31)
    - Months = 0 (2020-03-31)
    - Days = -34 (2020-02-27)
 
7. ("Big forward") 1971-12-30 to 1972-03-10 (current = 2 months 10 days)
    - Years = 0 (1971-12-30)
    - Months = 2 (1972-02-30 → 1972-02-29)
    - Days = 10 (1972-03-10)

8. 2022-07-17 to 2024-07-15
    - Years = 1 (2023-07-17)
    - Months = 11 (2023-06-17)
    - Days = 28

9. (Hebrew calendar) (a) 5784-13-15 to 5786-12-17 (note: leap years in 5784, 5787) (current = 2 years 2 days)
    - Years = 1 (5785-12-15) ← constrain to real month?
    - Months = 12 (5786-12-15)
    - Days = 2
    - ✘

    (b) With month codes: 5784-M12-15 to 5786-M12-17
    - Years = 2 (5786-M12-15)
    - Months = 0
    - Days = 2
    - ✔

10. (Hebrew calendar) (a) 5784-06-19 to 5786-05-18
    - Years = 1 (5785-06-19)
    - Months = 10 (5786-04-19)
    - Days = xx

    (b) With month codes: 5784-M05L-19 to 5786-M05-18 (current = 1 year 10 months 28 days)
    - Years = 1 (5785-M05L-19 → 5785-M06-19)
    - Months = 10 (5786-M04-19)
    - Days = 28 (5786-M05-18)
