# August 19, 2021

## Attendees
- Shane F. Carr (SFC)
- Cam Tenny (CJT)
- Philip Chimento (PFC)
- Ujjwal Sharma (USA)
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Philipp Dunkel (PDL)
- Jase Williams (JWS)

## Agenda
### IETF update
- USA: The draft is now adopted by the SEDATE working group. Unfortunately there is no co-editor yet. My plan is to wait for a few days and then start pinging likely people who could help. JGT had a conversation with the calendaring folks, and I had a conversation with the NTP folks. There is only one remaining discussion about the syntax, about whether we should namespace the extension keys or not. We can present the progress at the plenary, and we should be explicit that this is the only thing that could possibly change in the syntax.
- PFC: When exactly can we tell implementors to remove the flag from Temporal?
- USA: We had originally said that this was the time. But there is still a syntax issue to be resolved.
- PFC: Can we say that the flag can be removed once the syntax discussion is resolved and the results are incorporated into the proposal?
- USA: Yes. I will try to get the discussion resolved before plenary.
- RGN: The wording needs to be careful and precise. "Adopted" is great but "adopted" is not concrete. Anything could change until it is "published".
- USA: I don't think there's going to be a substantial amount of time where Temporal will be implemented,
- RGN: I have seen major changes result from working group last call in IETF. We should be careful not to overstate the status.
PFC: Do you think we should not tell implementors to remove the flag until it's published?
- RGN: It depends on the implementer policy. Changes are possible, though unlikely, at this stage.
- USA: Let's collaborate on the wording for plenary.

### V8 implementation update
- SFC: FYT has ~20,000 lines of code written: https://chromium-review.googlesource.com/q/hashtag:temporal+(status:open%20OR%20status:merged)

### Nanosecond precision ([#1700](https://github.com/tc39/proposal-temporal/issues/1700))
- SFC: Jakob Kummerow's comment in the thread summarizes the point and is the reason why I opened this issue. I don't think there's anything wrong with using nanoseconds, but I'm not sure why we picked nanoseconds (not larger or smaller units). It takes more space to store nanoseconds. We don't have any documentation on why we picked nanoseconds rather than microseconds, or picoseconds.
- CJT: I have an update to Jakob's comment, I can get a finer resolution in timestamps in Python on my machine using a few more lines of code. So it does make a difference in current hardware.
- PDL: I'm not sure we should relitigate this. We've had the discussion already and there are reasons for interoperation, and besides that, we could be storing data from scientific instruments.
- SFC: Scientific instruments might have even finer resolution for which nanoseconds are not sufficient. To CJT's point, the kernel-to-JS already takes 300 ns just to get the timestamp.
- PDL: One more point, the storage capacity. Even for µs precision we'd need a 64-bit integer. Nanoseconds seems like the sweet spot for optimizing calculations yet still being fine enough to be somewhat future proof.
- SFC: I'm satisfied with the explanation. Can we add this to the explainer?
- USA: When we add it we should also mention the interoperation reason as well. Other standard libraries use the same unit.
- CJT: I agree this isn't a Stage 3 concern.
- SFC: I do disagree with that part, the feedback is coming from implementers.

### Storing nanoseconds as time zone offsets ([#1699](https://github.com/tc39/proposal-temporal/issues/1699))
- JGT: Unlike storing nanoseconds for times, storing them for time zone offsets seems less useful. Could we discuss this?
- PFC: I'd prefer to have more of a concrete counterproposal before we discuss this.
- SFC: Let's wait for FYT to be present.

### Mathematical values in Duration ([#1604](https://github.com/tc39/proposal-temporal/issues/1604))
- SFC: One interesting observation from Jacob Kummerow was `java.time`'s Duration and Period separate classes. The exact durations are just stored as 64-bits. Temporal.Duration has 10 fields which all have to store 64 bits.
- JGT: At least according to the docs, I don't think we have to store 64 bits. We already warn users about precision loss.
- SFC: We need at least 53 bits because it's a JS integer.
- JGT: How long is 32-bits of nanoseconds?
- RGN: If unsigned, 4 seconds.
- USA: Isn't this a design decision? I'm not sure if this is something we should spend as much time on to discuss.
- SFC: I didn't file this issue because we don't have data to actually show that this would be slower. If we run benchmarks on Frank's implementation and find that it is actually significantly slow, then I'd file an issue.
- JGT: Performance or RAM usage?
- SFC: Both are potential problems.
- JGT: I'm curious about how variable length data structures work in V8.
- SFC: Not sure how it's being implemented exactly. I don't know whether that's feasible but if it is, that's probably how we should think of it.
- PDL: This may be a case where the first implementation doesn't give the performance we want, because if I were implementing it, I'd just go for the naive implementation, and optimize if necessary.
- JGT: Agree. That's what I didn't understand about the comment; it implied that there was no optimization possible.
- USA: That's consistent with my experience with how V8 does things, starting out with a general implementation and then optimize as needed.

### IETF discussion about ZonedDateTime.from() / offset option ([#1695](https://github.com/tc39/proposal-temporal/issues/1695) / [#1696](https://github.com/tc39/proposal-temporal/issues/1696))
- JGT: 1696 is a bug in the spec, either way. We should resolve this one.
- PDL: Agreed. This seems like a mistake, not consistent with other decisions we've made.
- RGN: Agreed, but `Z` is shorthand for `+00:00`.
- USA: RGN is right from the point of view of RFC 3339, but we had some sort of agreement within Temporal champions that `Z` indicates 'not a human time zone'.
- PDL: Right, the only other way would be to specify `[Etc/UTC]`.
- PFC: Can we resolve that 1696 should be changed to be consistent with the other string parsing operations, and discuss 1695?
- JGT: OK. About 1695, see the example at the top of the issue.
- PDL: This is where we might not agree on `Z`. I would say that `Z` is `+00:00[UTC]`, but in this case I'd say that `Z` in a ZonedDateTime string means "I want this UTC instant, but in this time zone."
- USA: That is also how the IETF people think about this. They talk about other implementations that don't have a ZonedDateTime, where you could parse the string as an Instant, and interpret it in the Time zone.
- PDL: This is important for conflict resolution. If I wanted 0 offset, I'd put `+00:00`.
- USA: Is there any reason not to proceed with this?
- JGT: There are three options: 
  1. As-is: `Z` and offsets throw if conflict (current spec)
  2. `Z` doesn't throw, other offsets do (PDL suggestion)
  3. No offsets throw; instant gets calculated and time zone is then applied (Java behaviour, like defaulting `offset` to `'use'`)
- PDL: With `2021-08-19T17:30:00Z[Europe/London]`, it's not that Europe/London would win and it's 17:30 in London, it's that the instant wins and is then projected into Europe/London. This is important for calendaring applications. If we take option 3 that the IETF folks are pushing, then we lose that disambiguation ability or the ability to catch a conflict.
- JGT: We already have the ability to disambiguate because of the offset option, regardless of what the IETF folks choose. The discussion is more about the default value of that option.
- USA: As far as the IETF is concerned, as long as the format we're using is not illegal according to the RFC, we can do what we want.
- PDL: That's not necessarily true. They are attaching an implementation to that format, they're saying that the instant wins and is projected into the time zone.
- USA: Well, the user of a calendar application doesn't have that ability to disambiguate.
- PDL: This is leading users into wrong expectations. There is ambiguity, but the IETF is ignoring that. This is why I'm for keeping that rejection.
- USA: I agree, the RFC should not be phrasing things in a way that precludes us from giving that freedom to users of Temporal. I'll CC you on the thread when we phrase that part of the RFC.
- JGT: Can we all agree on allowing the Z format with brackets?
- (Consensus on that)
- JGT: Can we agree on treating it as an error by default if there is a numeric offset with brackets and they don't agree?
- JWS: Are there any potential issues with throwing in the case of `+00:00`?
- JGT: My interpretation which I think PDL shares is that `+00:00[timezone]` means that you measured the local date and time and offset in the time zone. `Z[timezone]` means it's an instant unmoored from a time zone.
- PDL: Agreed.
- USA: The RFC allows this but Temporal doesn't, which is OK. The RFC doesn't define the semantics.
- JGT: My concern with the IETF discussion was that it seemed like there was a maximalist position being taken, where the offset plus brackets wouldn't be allowed.
- USA: I think they weren't asking us to remove that, they were asking us to allow omitting the offset, which we already allow.
- JGT: I think the best outcome is that we keep the status quo with the change that we allow `Z` + brackets.
- PDL: A string serialization spec shouldn't dictate the behaviour here.

### Default options for `round()` and `total()`? [#1720](https://github.com/tc39/proposal-temporal/issues/1720)
- JGT: Currently for `Duration.total()` and `Duration.round()` the options parameter is not optional, because for `round()`, one of `smallestUnit` and `largestUnit` is required.
- PDL: Call it a parameters object instead of an options object?
- PFC: I don't know if the objection is to the name of the parameter or to the fact that there's a required parameter in `total()` that you have to stick on an object.
- JGT: Can we agree that we don't want to change anything, but if we're forced to, we'd rather pick a default unit than change the method signatures?
- PFC: I'd rather keep the status quo, but if forced, I'd be fine with changing the method signature of `total()`, since there's only one required parameter (`unit`).
- PDL: What would be the default if we did pick one? Nanoseconds?
- JGT: I don't like that because `round()` with no arguments would be a no-op.
- PDL: I'm fine with a no-op.
- JGT: That backs us into where we were when we made the options parameter required in the first place.
- PDL: A no-op you would notice because it doesn't do anything.
- JGT: So, we do have consensus that the current behaviour is what we want to stick with, but we don't have consensus on what default unit we'd replace it with if forced.
- JWS: I could see either side of what we'd choose as a default unit but I also prefer the status quo.
- PDL: Let's rename the parameter to "parameters" in any case.

### Restrict the return value of `Calendar.fields`? [#1610](https://github.com/tc39/proposal-temporal/issues/1610)
(Deferred until FYT can attend)

### Revisit the [[Calendar]] slot of PlainTime? [#1588](https://github.com/tc39/proposal-temporal/issues/1588)
(Deferred until FYT can attend)
