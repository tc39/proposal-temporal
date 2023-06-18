# September 1, 2022

## Attendees
- Philipp Dunkel (PDL)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Justin Grant (JGT)

## Agenda

### Status: Presentation at September plenary
To present: [#2377](https://github.com/tc39/proposal-temporal/issues/2377), [#2387](https://github.com/tc39/proposal-temporal/issues/2387), [#2392](https://github.com/tc39/proposal-temporal/issues/2392), [#2394](https://github.com/tc39/proposal-temporal/issues/2394), [#2395](https://github.com/tc39/proposal-temporal/issues/2395), [#2397](https://github.com/tc39/proposal-temporal/issues/2398), [#2398](https://github.com/tc39/proposal-temporal/issues/2320), and an upcoming PR for [#2320](https://github.com/tc39/proposal-temporal/issues/).

### Status: the "big four" issues
(Frozen builtins [#1808](https://github.com/tc39/proposal-temporal/issues/1808), use Temporal objects in 402 [#2005](https://github.com/tc39/proposal-temporal/issues/2005), remove calendar slot from PlainTime [#1588](https://github.com/tc39/proposal-temporal/issues/1588), Duration precision concerns [#2195](https://github.com/tc39/proposal-temporal/issues/2195).)

Discussion on these issues. It seems like [#1588](https://github.com/tc39/proposal-temporal/issues/1588) could become moot if we adopt the proposal for [#1808](https://github.com/tc39/proposal-temporal/issues/1808). [#2005](https://github.com/tc39/proposal-temporal/issues/2005) doesn't need a lot of discussion, is just a bunch of work, and is gated on resolving conflicting intentions with Intl.Enumeration proposal.

Plan for [#2195](https://github.com/tc39/proposal-temporal/issues/2195) is to write an explainer with solutions considered until now, and invite implementors to a future champions meeting to discuss it.

### Frozen built-in calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
If no comments about the proposed solution, we can get this moving after the plenary.

- PDL: Is this likely to meet resistance from SES?
- PFC: As far as I know it isn't possible to use these as a covert communication channel.
- PDL: Worth talking to people in the hallway track in September, otherwise we should go for it.
- USA: If everything on Temporal is on the global object, doesn't that mean that nothing is shared cross-realm? Each context would have its own instance of everything.
- RGN: I'd be shocked if anyone were in favour of making it global at a greater scope than realm. There's a Hardened JS meeting on Wednesday, so there'd be an opportunity to ask before the next plenary.

### ECMA-402 concerns ([#1932](https://github.com/tc39/proposal-temporal/issues/1932) and [#2363](https://github.com/tc39/proposal-temporal/issues/2363))
- USA: FYT has concerns about making DateTimeFormat heavier. I would like to make it possible to initialize DateTimeFormat lazily, for example if you don't format PlainMonthDays, no need to load the formatting patterns for PlainMonthDay.
- PFC: I don't see any throwing or method calls in that loop, so it seems like it could be lazily initialized.
- JGT: In the polyfill we lazily initialize these, and use `resolvedOptions()` to avoid observable reading of options.
- USA: The second issue is about throwing in `formatRange()`. The proposal effectively changes a RangeError to a TypeError, but I think TypeError is the right thing to throw here.
- PFC: I think FYT is saying the opposite, that it changes TypeError to RangeError. I still think it's a rebase error.
