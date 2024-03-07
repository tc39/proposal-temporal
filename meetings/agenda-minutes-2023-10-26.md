# October 26, 2023

## Attendees
- Jase Williams (JWS)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- Philipp Dunkel (PDL)

## Agenda

### Status report
- IETF
    - Good news, the IETF document is approved and in the publication queue. Will include in presentation for TC39 that we can unflag implementations when they are complete.
- Pending PRs [#2628](https://github.com/tc39/proposal-temporal/issues/2628)
    - PR [#2633](https://github.com/tc39/proposal-temporal/pull/2633) - Only thing blocking is RGN OKing the tests
    - PR [#2519](https://github.com/tc39/proposal-temporal/pull/2519) - Blocked on test262 maintainer review. PFC's Igalia colleague CJT is looking into it
    - PR [#2571](https://github.com/tc39/proposal-temporal/pull/2571) - Needs review from champions (only last commit - PR is stacked on 2519). If you want to help speed this along, this is a good place to start.
    - PR [#2612](https://github.com/tc39/proposal-temporal/pull/2612) - has the duration change, may be easier to split it up, no champions have reviewed it yet either so that would be a good place to start looking if we want to speed it along. 
- V8
    - SFC: Had a conversation with SYG and FYT. There was some interest in having a native (Rust/C++) Temporal library. Some things are tied to the engine, but algorithms could definitely be put into native code. Especially if we could collaborate with Boa on a Rust library, that would be a good value proposition for more Rust in V8.
    - PFC: I didn't think to check Boa against the test suite because eshost doesn't support them yet.
    - JWS: Yes, would be interested in a collaboration like this. Will encourage Boa engineers to join the Matrix channel.
    - SFC: The important thing would be to keep the algorithm-like code separated from the JS-like code.
    - PFC: Any other news from SYG and FYT?
    - SFC: Most of FYT's work was based on the 2022 version of the proposal. He's waiting for a signal. SYG had some concerns about Temporal adding global objects to every JS process, so might require more work in V8 to optimize that, e.g. don't load Temporal into memory until it's been called.

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- JGT: I dug into how we defined the invariants, and concluded that the invariants were intentional, but the polyfill doesn't correctly implement the invariants, and we have a test gap in the datemath tests. So my conclusion is that we do have a bug to fix.
- PFC: I researched other date libraries, most of which can't even do differences in months. Of the ones that can, we match the behaviour of Moment and Luxon. ICU4X returns mixed-sign durations. So my conclusion is that there's not an obvious answer and we may as well match Moment and Luxon.
- JGT: I would be fine with formulating new invariants if we wanted to do that. Only if we couldn't describe that behaviour in invariants, then I'd prefer we have behaviour that can be described.
- SFC: ICU4X's diff arithmetic is unstable, and the intention is actually to match Temporal, so maybe it doesn't belong in this table.
- PDL: I'd advocate for matching Moment and Luxon as part of the environment in which we operate. But we should also describe it in invariants.
- JGT: I propose that we try to formulate these invariants for the next meeting, Nov. 9.
- Action for PFC.
- RGN: I would like to change the current behaviour, in that it produces collisions in pairs that should be distinguishable in the output.
- JGT: Can you try to come up with an algorithm that does what you want in the meantime?
- Action for RGN.
- PFC: I think the bar should be high - both for a normative change as usual, and for deviating from what libraries in the ecosystem do.
- RGN: Is there evidence that Moment and Luxon are happy with the current state?
- PFC: A bit. I found an old Moment PR ([moment#571](https://github.com/moment/moment/pull/571)) that talks about buggy month/year diffs, so it seems they struggled with this and eventually settled on one thing. We should talk to MPT or MAJ to see if they know more of the story.
- SFC: We've made decisions in the past based on use cases, so it'd be useful to list out a few.
- RGN: Use cases: How much time until Temporal reaches stage 1, how much time until the next Burning Man, etc.
- PDL: Also reversing durations, which is the invariant we're not quite meeting. Counting back up using the reverse of the duration that you generated while counting down.
- SFC: PDL's invariant (also in PFC's comment from Apr 27) seems like the right one to enforce. Aligning with java.time is not necessarily a goal because we've made a lot of decisions that deviate from it with good reason. The commutativity invariant is a user-oriented goal.
- PDL: Commutativity was a design goal, but I'm not sure if the algorithm we've specified fulfills that in 100% of edge cases.
- JGT: It does not.
- PDL: So my question is we need to find out what's the reason for that. Is it because it's impossible to achieve all edge cases and we just had to pick one of the options? I suspect yes.
- RGN: I disagree. I think the deviation comes from privileging the last day of a month. I don't like the loss of information in the current algorithm that directly corresponds with a failure to commute.
- JGT: There are (at least) three possible paths forward.
    - Option 1: if `A.until(B, {largestUnit: 'month'})` is D, then `B.subtract(D)` is A
        - This was the intended behavior but, due to a test gap and spec bug, our algorithm doesn't satisfy this invariant.
        - If we want to revise the algorithm to match this invariant, then we need to figure out why the current spec text doesn't satisfy it, and to figure out if there is _any_ algorithm that meets this invariant.
    - Option 2: align behavior with Moment and Luxon (no normative change; leave current behavior as-is)
        - PFC will try to come up with a simple invariant that describes the current algorithm, along the lines of the invariant in (1).
        - PFC will reach out to MPT and MAJ to see if they have context from their Moment days.
    - Option 3: since and until should both behave such that varying one input while keeping the other constant should always produce distinguishable non-colliding output
        - RGN will try to define an algorithm that passes for the same pairs of dates from ABL's test cases.
    - SFC suggested that everyone should suggest use cases, so please add them as comments!
    - We'll discuss the research from (2) and (3) at the next champions' meeting, and plan to make a decision at that point, using the following decision path:
        - If the research into (2) and (3) yields one obvious winner, then we’ll use that.
        - Otherwise, we’ll fall back to the intended behavior (1).
            - If we can improve the algorithm so that it satisfies the invariant from (1), then make that change.
            - If no algorithm can satisfy (1), then leave the current spec as-is.
- PDL: I think if you provide smallestUnit, there is no solution.
- PFC: smallestUnit is always non-commutative, because rounding loses information.
- SFC: Option 3 is user oriented because you want monotonically increasing/decreasing durations.