# February 29, 2024

## Attendees
- Jase Williams (JWS)
- Justin Grant (JGT)
- Kevin Ness
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Adam Shaw
- Chris de Almeida (CDA)
- Ujjwal Sharma (USA)
- Shane F. Carr (SFC)
- Philipp Dunkel (PDL)

## Agenda

### Status ([#2628](https://github.com/tc39/proposal-temporal/issues/2628))
- Reviews would be helpful on:
    - [#2766](https://github.com/tc39/proposal-temporal/pull/2766)
    - [#2767](https://github.com/tc39/proposal-temporal/pull/2767)
    - [test262#4007](https://github.com/tc39/test262/pull/4007)
    - [test262#4012](https://github.com/tc39/test262/pull/4012)
- JGT: Have we heard from IETF recently? What's the status there?
- RGN: The publication queue says it's been in the current state for 4 weeks. "Submitted to IESG for publication, undergoing final internal review before awaiting final author approvals."
- USA: It’s been a few weeks since it’s progressed in the current queue. The status says RFC editor, which means it’s being edited right now. At some point they will pass the ball to us, we would need to read through and confirm it, at which point it gets out of the editor and be published. So anytime now.
- JGT: That’s great.

### Binary size concerns [#2786](https://github.com/tc39/proposal-temporal/issues/2786)
- PFC: SYG said the Android team considers features >250k "large", and features 100-250k "medium". Our goal is to get the size of Temporal on 32-bit Android as close to the low end of "medium" as possible.
- PFC: Many of the types have property getters where the action is to check it's called on the right receiver and then call the calendar method which is named the same as the getter. I’ve found you can collapse those all into 1 C++ built in, that works pretty well. I talked to SYG how he measured those sizes and that was done with a proprietary google tool, but I took another tool to test this. You can shave 68kb off the file size and 69kb off the virtual memory size. I don’t know which is more important.
- JGT: I think it's file size.
- JGT: There was a question SYG had for FYT “is all the implementation already in there?” My assumption is not.
PFC: I think all the code is there, there’s no large unimplemented blocks. I don’t think the changes FYT would have to catch up with are going to be large blocks of code that don’t exist.
- JWS: What was the total size you managed to get it down to?
- PFC: My baseline number was 355k. I measured 301k in those object files that Shu mentioned. I think there’s Temporal stuff in other files but not so much so the real baseline number is slightly larger. But then on the other hand the number that SYG mentioned is smaller to begin with, so I'm not taking the absolute numbers seriously, only the increase or decrease.
- RGN: OK so it's close but it's not quite there.
- PFC: Additionally I turned all of the valueOf methods into 1 C++ builtin, there’s no need to have 6 C++ functions that all just throw the same TypeError. Since C++ builtins take up a lot of space, there's room for more optimization. You could even collapse everything into only one C++ builtin if you wanted to get ridiculous, but at the cost of performance.
- PFC: I’m also looking into how much gain would we get if we removed certain parts of the proposal. I don’t want to start the discussion on that though and overshadow the actual gains we can get without changing the proposal. I’ve tested removing PlainYearMonth and PlainMonthDay, that shaves it down by another 48k. I’m going to try a couple of other things, like ripping out other parts of the proposal and I'll share those numbers among us. I'll also see if I have any more ideas on shaving down the size without changing functionality.
- JWS: Should we get SYG into one of these meetings? What are the next steps once you've gathered the numbers?
- PFC: I'll get some internal review on the PR, then I'll share it with SYG first and ask him to try it out and see how it can solve the problem.
- JWS: SYG also mentioned the number of globals, and the effect on memory size. Is that a concern?
- PFC: SYG said that if your code doesn’t use Temporal then it’s not loaded.
- JGT: If this patch doesn't solve the problem, we should cross that bridge when we come to it. I think we probably fix this by a combination of technical solutions and human solutions.
- JWS: Agreed. I think this effort will show some goodwill and earn us some leeway.
- Adam: Parts of the diffing and rounding algorithm can be DRYed so that might make some more normative changes worth it.

### Further user code call optimizations ([list](https://github.com/fullcalendar/temporal-polyfill/issues/3#issuecomment-1971448129))
- Adam: There’s areas where internal code is supposed to call the calendar protocol to ask it for information. My polyfill calls it fewer times, that goes hand in hand for efficient algos. It’s pretty different when dealing with planYearMonth math, different when diffing 2 points in time different when rounding those durations after the diff occurs. It’s a lot of work to re-shift these algorithms in the spec, if we hold these implementations to the exact spec where they have to follow these protocols then we obligating them to build a less-than-optimial version of these things. For custom calendars the code could take this slower path but for the built in ones it can take a faster path, but it might result in 2 code paths for everything. Adam: I was able to get my polyfill so small is by merging those codepaths, so we need to decide whether we want to relax the spec on the exact order of all these calls to user code.
- RGN: I don't believe it's viable to allow implementation divergence in user code calls. It's absolutely required by the nature of the spec. We should update the spec if the algorithms are suboptimal. That said, minor relaxation is possible, there is a small amount of freedom in Set methods, for example.
- PFC: I see some risks in updating the algorithms. They can change the results in edge cases that we don't yet have test cases for. It also delays the ship date in browsers by 2 months every time we have to bring something to another TC39 meeting. I'm increasingly thinking we should never have added custom calendars and time zones — that would have allowed us to optimize whatever we liked.
- JGT: We have to balance things between shipping on Android with a smaller code size, or arguing about it for a year and not shipping.
- PFC: Or continuing to optimize for a year and not shipping.
- JGT: I wonder if we could get TC39 to agree that changes to the user code calls are editorial.
- RGN: I don't think that would fly. Specifically, delegates from Agoric would block it, because the order of user calls has implications for reasoning about integrity. But maybe we could ask for a carte blanche to make changes to the user code calls until a certain time, and avoid the round-tripping to plenary.
- SFC: Can we add an exmple?
- Adam: Since or until methods on a plainDateTime, it calls the calendar to get the larger units, then it essentially rounds parts to see if there’s a date overflow. It rebalances excess days, its retreading the same codepath twice. There’s 2 highly repeated codepath one for diffing and one  for rounding.
- RGN: If you’rre trying to diff 2 values that are equal then its unnecessary user code, but Shane is saying that right now the calls to user code are indepemnedant of the values provided.
- Adam: My implementation does rely on data, so if you have an overflow of a day so it may add more date until calls, but its possible to make my algorithm not data dependant and still have fewer calls. It’s possible to optimize the algorithm,
- RGN: Does anyone care that the observable sequence of calls are data dependent.
- PFC: it’s already data dependent.
- RGN: I’m not aware of anyone who cares, that its consistent across data variants.
- PFC: Yes, I think thats right.
- SFC: I think this helps clarify that then, I like moving forward on this front. It’s getting permission to change this area, keeping it deterministic but tweaking around the edges which functions get called in which scenarios. 
- RGN: The framing of this is “This is addressing implementor concerns around size required to support the proposal”.
- PFC: I think we should verify that, for example by implementing one change in V8 that we think will reduce the code size by the most, then extrapolating to how much smaller Adam's polyfill is to get a rough size reduction number.
- Conclusions
    - No-brainer work: Consolidating the builtins
    - Maybe work: Prototype the user code call optimizations out, and see if they result in significant savings
- Kevin: Can we measure the size of the temporal-rs crate?
- SFC: It'd be better to measure the total size of the Boa binary with and without. Measuring the size of libraries is iffy.
- JWS: Adam, does the polyfill run against test262 and how do the user code calls compare?
- Adam: The tests that fail are the user code call ones.

### Potential bugs
- [#2760 (comment)](https://github.com/tc39/proposal-temporal/pull/2760#issuecomment-1957939708)
    - Adam: This is about how we do diffing for ZDT when there are two possible answers due to DST ambiguity. Which of these answers do we want? You can add two different negative durations (-P1M, -P30D23H) to this ZDT and get the same result, because the result falls into a DST gap.
    - JGT: The general approach that we've taken is to follow RFC 5545. Operations on the date, then the disambiguation adjustment, then operations on the time. Does that provide any guidance for this situation?
    - Adam: The disambiguation there is calendar disambiguation. The DST disambiguation can only happen after you add in the time. Information is lost if you fall into a DST gap.
    - RGN: Does this still hold if we reduce it to a day?
    - Adam: Yes.
    - JGT: I think we've addressed in the past by saying the diff is the final time after the DST adjustment. So if DST moves you to 3:00, then you would say 23 hours. That would imply that the second one is correct here.
    - RGN: Is the difference relevant if you try to invert the operation?
    - Adam: You won't run into the same situation, because DST gaps only push you forwards.
    - RGN: But in a diff, you have a fixed start and end.
    - JGT: Good point, the end has already been disambiguated.
    - RGN: Any 02:00 to the previous day's 03:00 is always 23 hours.
    - Adam: The difference here is that this day's 02:00 to the previous day's 02:00 is also 23 hours.
    - Adam: I can take the next step to modify the PR to get the result that we want here.
- [#2790](https://github.com/tc39/proposal-temporal/issues/2790#issuecomment-1971250440)
    - Adam: I found a bug with ZDT rounding with smallestUnit day. Currently the ZDT looks at the current day, figures out how many hours are in that day, and uses that as a denominator. That doesn't work on DST days, because 23:01 on a 23 hour day gives you a fraction > 1, and you round to the following day.
    - Adam: Two ways to solve this:
        - Figure out how many of the nanoseconds have been consumed in the day, and use that as the denominator.
        - Round the wall-clock day.
    - JGT: The intention when I wrote this was to, e.g. on a 25 hour day, round down if the time was before 12:30, and up if later. What's the second one?
    - Adam: You take the start of the previous day (which might be disambiguated away from midnight) and the next day (which also might be disambiguated away from midnight) and round to the one that's closer in exact time terms.
    - JGT: What I'm hearing is that the fraction method may not even be correct if midnight isn't the start of the day.
    - RGN: Both of these seem like they give equivalent results but the difference is probably observable in a custom time zone.
    - Adam: Will try option 1 and make a PR.

### Implementation questions
- Kevin: About the Rust Temporal crate, can you store the calendar units as i32?
- PFC: I think you can store years, months, and weeks as u32, and use the sign of the time units. Even though they are officially stored as f64 in the spec.
- Kevin: Is it possible to store the test262 tests in a more universal format, so that we can try to get the test data for the temporal-rs crate?
- PFC: Probably not automatically extracted from the current state of the tests. It might be possible to rewrite the tests so that the data is separated.
- JGT: With all that's going on right now, not something we would do from the Temporal group.
