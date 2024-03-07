# February 01, 2024

## Attendees
- Chris de Almeida (CDA)
- Kevin Ness
- Richard Gibson (RGN)
- Jase Williams (JWS)
- Philip Chimento (PFC)
- Philipp Dunkel (PDL)
- Shane Carr (SFC) – at 08:20

## Agenda

### Kevin Ness (Nekevss) Introduction
- JWS: Kevin has been working on the Boa implementation of Temporal. Have been quite a few PRs lately, adding PlainDateTime and PlainTime. Another contributor, Jedel, has been speaking to Shane about ICU4X.
- Kevin: Getting calendars figured out, especially custom calendars, and how to integrate ICU4X is the big thing right now. We are trying to make a pure Rust implementation that's separate from the engine.
- JWS: SFC wanted to ask something about the standalone crate, but we can ask that another time.
- JWS: What's the conformance like?
- Kevin: About 15-16%. We need to figure out dealing with the IANA time zone DB, ICU4X is still working on that.
- SFC discusses ICU4X's plan for consuming TZDB.
- SFC: I think it'd be good for the ecosystem to have as much functionality as possible in the standalone crate. Engines could link this library and use it for their Temporal implementations. That lets me make the case for V8 to do the same.
- Kevin: The crate is currently standalone but is an early work in progress. [(link)](https://github.com/boa-dev/boa/tree/main/core/temporal)
- Discussion of where to draw the line for what lives in the crate.
- SFC: Should we set aside some time in the Temporal meetings going forward for implementation questions?
- JWS: Would prefer doing it here.
- PDL: We can see ourselves as resources for implementors to consult, going forward.

### Status ([#2628](https://github.com/tc39/proposal-temporal/issues/2628))
- PFC: Especially the round/until refactor I have my doubts about. It seems to cause a lot more user code calls and I haven't yet figured out why.
- PDL: Is it possible that we separated those code paths because of the audit of user code calls?
- PFC: That's quite possible. I don't remember.
- RGN: Do we have a cause for the discrepancy in user calls?
- PFC: Not yet. It may just be something silly.
- PDL: I prioritize correctness over minimizing user calls.
- PFC: We can fix the correctness, but unifying the code paths is to prevent possible bugs that we don't know about. If that unavoidably means more user code calls, I'm OK with that conclusion.
- PDL, RGN agreed
- JWS: Anything we can help with before plenary?
- Reviews would be helpful on:
    - [test262#3999](https://github.com/tc39/test262/pull/3999)
    - [#2612](https://github.com/tc39/proposal-temporal/pull/2612)
    - [#2763](https://github.com/tc39/proposal-temporal/pull/2763)
