# Apr 1, 2021

## Attendees
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Cam Tenny (CJT)
- Daniel Ehrenberg (DE)

## Agenda
### Where to host production polyfill developed by this group?
- PFC: DE had the idea of asking if Moment.js would like to host it.
- SFC: If the Moment people agree then it sounds like a nice endorsement.
- DE: Even more than an endorsement, hopefully the community will want to pick it up.
- RGN: Agreed.
- DE: Ok, so let’s go ahead and bring it up with the Moment community — in an issue or something like that.

### Other post-Stage-3 updates
- PFC: Species subclassing has landed! Continuing on with the list of other things that popped up in delegate review.

### Meeting frequency
- CJT: Move to every other week?
- SFC: Sounds good, I’ll make the change - canceling next week and meeting again the week after.

### Moving the Temporal documentation to MDN
- DE: Eric Meyer will start working with us in a few weeks on moving the Temporal documentation into MDN. We'll probably start helping JSC with the implementation.
- USA: The text will need to be relicensed.
- CJT: Let’s confirm by GitHub issue, I’ll take care of that.

### Calendar hack
- SFC: About the polyfill, are you planning to stick with the calendar hack of parsing string data from Intl?
- DE: I think that's important to change. However, we can't prioritize a large amount of work on the polyfill.
- SFC: The thing that FYT and SYG said they would like the most is higher test262 coverage.
- DE: Our priorities are to get the polyfill set up, but then focus on test262 and the browser implementation.
- CJT: Do we have a steward since it’s not in Igalia’s bandwidth?
- SFC: We had a discussion with Mozilla and V8 about how to implement the proposal, especially time zone and calendar logic. We talked about approaches to take. Proposed two: ICU4C or ICU4X. Mozilla is excited about ICU4X, V8 also interested but not accepting Rust code yet so probably will go with ICU4C. ICU4C has bugs in the Chinese calendar, among others, that need to be fixed. Possibly ICU4X compiled to WASM. We have a [document](https://docs.google.com/document/d/1UOrM-dQsqkVP9CRWdKMGVcfOxlc2xI53s4qAeqZJMaw/edit) pitching ICU4X as a backend for Temporal.
- PFC: JHD's proposed polyfill will probably support older environments, so taking advantage of more modern environments with WASM is a good way to ensure that the different polyfills serve different needs.
- CJT: Sounds like not something any of us will work on soon, but largely on the same page regarding WASM.
- PFC: After moving and forking the polyfill would be a good time to talk about what’s important for production quality, not now.
