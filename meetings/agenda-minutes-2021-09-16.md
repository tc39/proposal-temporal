# September 16, 2021

## Attendees
- Shane F. Carr (SFC)
- James Wright (JWT)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Frank Yung-Fong Tang (FYT)
- Richard Gibson (RGN)

## Agenda
### IETF update
SFC: USA has a new co-champion from IETF. At this point the thing to do is to let the draft proceed through the process there.

### Restrict the return value of `Calendar.fields`? ([#1610](https://github.com/tc39/proposal-temporal/issues/1610))
FYT to follow up on this about the security issue.

### Revisit the [[Calendar]] slot of PlainTime? ([#1588](https://github.com/tc39/proposal-temporal/issues/1588))
- PFC: The conclusion from last time was to determine whether this slot could be added later without breaking the web. I didn't get a chance to think about this in the meantime. Did anyone else?

### `Duration.negate()` should produce -0? ([#1715](https://github.com/tc39/proposal-temporal/issues/1715))
- PFC: The conclusion was to write out a concrete overview of what would have to change either way to be consistent. I didn't get a chance to think about this in the meantime either.
- JGT: My opinion is still unchanged, -0 is evil.

### `PlainDate.from('2020-01-01T00:00Z')` is problematic ([#1751](https://github.com/tc39/proposal-temporal/issues/1751))
(Deferred until PDL is here.)
- JGT: The second part of this question: when (what issue or meeting) did we decide that `PlainDate.from('2020-01-01T00:00Z')` is OK?
- PFC: The principle was that irrelevant parts of ISO strings were ignored. This was one of the first discussions I was involved in. I'll take an action to look this up.

### Step 2 of GetOffsetNanosecondsFor ([#1724](https://github.com/tc39/proposal-temporal/issues/1724))
- FYT: My feeling about this is that we're trying to fix something we don't need to fix. The only time step 2 takes effect is with a faulty userland time zone.
- PFC: This would fit with the design principle that we don't go out of our way to make things easy for custom time zone or calendar authors. On the other hand, it's a Stage 3 normative change that's not motivated by an optimization. From the thread it looks like JHD wants this to stay. I don't feel strongly either way.
- FYT: The documentation at least would need to be changed, since it says that it's required to implement `getOffsetNanosecondsFor`. Also, if you had a plain object time zone without `getOffsetNanosecondsFor`, you'd fail the brand check anyway.
- PFC: I think the case that JHD is referring to is when you `delete Temporal.TimeZone.prototype.getOffsetNanosecondsFor`.
- JGT: I don't have a strong opinion. Whatever allows us to move forward.
- FYT: I think this wastes memory for no good reason, even if it's a tiny amount of memory. You have to have a slot to remember the intrinsic function, even if it's not used often.
- SFC: I thought the idea of this fallback was to accommodate plain-object time zones. FYT says that that's not the case. I think this is an inconsistency. But FYT, why does remembering the intrinsic function take memory? The function is already there.
- FYT: You need a pointer, and in V8 there are a bunch of hoops to jump through.
- PFC: Propose going ahead with deleting step 2 from this algorithm.
- Conclusion: do that.

### ICU4X in a polyfill? ([discussion](https://github.com/unicode-org/icu4x/discussions/979))
- SFC: One thing is (??), the other thing is we actually need to get the features implemented and we're working on that. I think we need to be able to plug in multiple implementations for time zone and calendrical calculations in a polyfill. The bundle size is what it is, and if it works in a web app, great. The best thing to do for the polyfill would be to make the interface pluggable.
- JGT: The takeaway is that we can't count on the bundle size being small enough, so making it pluggable sounds good.
- PFC: Making it optional is what Moment had to do as well.
- JGT: I've had the 50k size of Moment in my head as a target that a polyfill has to aim for.
- SFC: This is a common problem for Intl as well.
- JGT: Conclusion, can we rip out the DateTimeFormat-based calendar implementation because we're going to use ICU4X? My opinion is no, because of potential large bundle size.
- SFC: At least keep it until ICU4X is ready and we know what the bundle size is.
- PFC: I agree.

### Discrepancy between `new Temporal.Duration(0, 0, 0, 0, 1.1)` vs `Temporal.Duration.from({ hours: 1.1 })` ([#1704](https://github.com/tc39/proposal-temporal/issues/1704))
- JGT: One could make an argument that this was the wrong decision, and that we should keep from() consistent with the constructor. If we throw, we can always add it in later.
- PFC: For example, if we get Decimal.
- SFC: I think it's misleading to throw away the fractional part in the constructor.
- PFC: Do you mean for Duration, or for all the other types?
- SFC: It's more acute for Duration. I don't feel as strongly about the other types.
- JGT: Another option, which I'm not sure I agree with, is to allow non-integer values since the precision in nanoseconds. Oh, never mind: I could say `PT1000000000H` which causes the non-exact problem. 
- Conclusion: Make the change to Temporal.Duration constructor to throw on non-integer values.

### Mathematical values in Duration ([#1604](https://github.com/tc39/proposal-temporal/issues/1604))
- SFC: The problem with this is when you actually go to implement it, you have to store it as a BigInt.
- PFC: You could have an upper bound.
- SFC: I don't agree with having an upper bound.
- JGT: I think it's reasonable to have an upper bound, which could always be relaxed later.
- SFC: In my opinion, if we want an upper bound, we should stick with the current solution which is Number values.
- JGT: So the question is should we support bounds at all?
- SFC: If the MVs were internal, that would be OK, but here you store MVs in slots that have to be returned to users. It's weird that you would store MVs but return them to users as Numbers. Do the getters work differently in the MV case?
- PFC: Anba has a comment early in the thread about how you could have two Durations where the nanoseconds getter returns Infinity, but if you subtract them from each other then you get a nonzero value.
- SFC: That's just weird. If you store a MV then you should return a BigInt.
- FYT: Currently the spec says to store an integer Number value.
- JGT: If we make this change, does it enable any use case? Is there an advantage to having an upper bound?
- PFC: If we decided to store them as MVs, then the upper bound would mitigate the cost to implementors of potentially storing a very large BigInt. If we don't store them as MVs, then we don't need an upper bound.
- JGT: (??)
- FYT: In V8 Duration is the biggest object in memory in Temporal.
- JGT: Most Durations will probably be something like `{ minutes: 10 }`, so that's concerning.
- SFC: Implementors are free to optimize Duration so that durations like that are smaller.
- PFC: It sounds like there's plenty of reasons not to store MVs, so we can push back on the guidance from the editors to store MVs.
- JGT: Separately from that, are there other reasons to make the upper bound more restrictive than `Number.MAX_VALUE`?
- SFC: I think `Number.MAX_SAFE_INTEGER` is a natural bound that fits with the rest of JS.
- RGN: What is the reason for overturning the obvious bounds of the maximum exact time in Temporal minus the minimum exact time, in nanoseconds?
- PFC: That's larger than `Number.MAX_SAFE_INTEGER`.
- RGN: It seems like a natural bound to me, even if it is outside Number.MAX_SAFE_INTEGER.
- FYT: If you put a large number like that in hours, and then balance it to nanoseconds, you'll exceed the bound.
- JGT: I think what RGN is suggesting is to put a bound on the Duration overall, not on each individual field.
- RGN: Yes.
- PFC: In that case you wouldn't be able to tell whether a Duration instance is within the bound, without consulting a calendar.
- SFC: I have to drop, but my position is open to storing BigInts, but if we store BigInts we should not have a bound.
- RGN: It's already the case with Date that you can set a large number of years that isn't representable, and you get implementation-dependent behaviour.
- JGT: I think that that limits the ability of implementations to optimize, if the lossiness and weirdnesses of very large Number values had to be respected.
- RGN: I think it's a leaky abstraction either way.
- JGT: One idea is to put a bound on Duration fields which would allow implementations to do every calculation with 64-bit integers at most.
- RGN: I agree with that, but it does seem weird that you can have Instant A and Instant B, and no exact Duration that represents their difference. It could be exploitable in some weird way.
- FYT: 64 bits would not cover that. 128 would. You need 75 bits.
- JGT: Are there really compelling use cases for this maximum duration?
- RGN: That's a hard question to answer. There's this abstract purity argument that I'm making. If you think that argument isn't compelling, then 64 bits seems like a good choice for the machines of 2021.
- JGT: You'll bump into the bound anyway when you add Durations together. So I come back to the question, why would you want to do that? Are there good use cases for this? If it's true that you can bump into the bound anyway, then why not set a bound that allows good optimization?
- RGN: I don't think the analogy is very strong. I put Instant A − Instant B in a different category than I do Duration A + Duration B. Subtraction can never increase the overall scale. However if it's bounded now to 64 bits of nanoseconds, then I think a future proposal could increase that bound. There might be exploitable cases, but I don't think there are any use cases as such.
- JGT: What about a bound slightly smaller than 64 bits to avoid overflows?
- PFC: The operations that could overflow are addition, and balancing to a smaller `largestUnit` than you currently have. I don't think either of those could be prevented from overflowing.
- We'll adjourn this discussion here and resume it next time with SFC present.

### Fix to ParseTemporalDurationString ([#1759](https://github.com/tc39/proposal-temporal/issues/1759))
- FYT: Is PR 1759 the way to go? If so, there are a few other places that would need to be changed accordingly.
- RGN: Agreed, but this PR was intentionally narrow.

### DateSpecMonthDay in the ISO8601 grammar ([#1800](https://github.com/tc39/proposal-temporal/issues/1800))
- PFC: I think option 3 is the correct interpretation, the `--` is one token that must be present or absent.
- FYT: OK, that's what I suspected.
- RGN: I think a sequence of code points must be abstracted into a nonterminal, because 262 says that terminals are Unicode code points.
