# August 5, 2021

## Attendees
- Philipp Dunkel (PDL)
- Justin Grant (JGT)
- Philip Chimento (PFC)
- Shane F. Carr (SFC)
- James Wright (JWT)
- Ujjwal Sharma (USA)

## Agenda
### Restrict the return value of Calendar.fields? [#1610](https://github.com/tc39/proposal-temporal/issues/1610)
- Not sure if FYT followed up about the security concerns. Deferred until next time.

### Revisit the [[Calendar]] slot of PlainTime? [#1588](https://github.com/tc39/proposal-temporal/issues/1588)
- Received implementor feedback about this and we are trying to reconstruct whether the reasons we decided that it was needed for web compatibility are still valid. See https://github.com/tc39/proposal-temporal/blob/main/meetings/agenda-minutes-2020-11-12.md

### Revisit [#797](https://github.com/tc39/proposal-temporal/issues/797), overflow for strings? (see [#1606](https://github.com/tc39/proposal-temporal/issues/1606))
- PDL: I would need to see an overriding benefit in order to do this.
- JGT: The RFC that we're based on, explicitly excludes these values. Other platforms will always fail on these values. Unlike the property bags.
- PFC: The benefit is that it's confusing for users that we have an options argument which is ignored.
- PDL: I don't even see that as a benefit. It's in the best JS tradition to ignore extra arguments passed to a function. Maybe we could redirect the discussion as to whether we would type-split early on, treating it as three different functions: `from(property bag, options)` - `from(string)` - `from(plainDate)`. Then we'd ignore the options in the latter two cases. But I don't feel strongly about this, I'm wondering if there's a benefit.
- JGT: I wouldn't want the type of the first argument to control whether I'd get an exception from `{ overflow: 'foo' }`. I wouldn't change this.
- SFC: No opinion on this.
- PDL: Currently, we throw if the options bag is misshapen. So, code that produces a misshapen options bag doesn't work. Therefore it's not a web compatibility issue if we would want to change this in the future, because it would only make code that was previously invalid work.
- SFC: Does `overflow: 'constrain'` have any meaningful behaviour with strings?
- PDL: No.
- No-one is in favour of changing the current behaviour here.

### Polyfilled string interpolation will call `valueOf()`, which will throw [#1681](https://github.com/tc39/proposal-temporal/issues/1681)
- JGT: I don't think there is anything we need to do here, TypeScript should fix this. But we should be aware that due to the TypeScript bug, you could take perfectly valid JS code and it would throw an exception in TypeScript.
- JWT: I was going to try to submit a PR to TypeScript.
- PDL: I don't think we can do anything about this. I don't want to change the behaviour of `valueOf()`.
- JWT: I had a question about the history of why `valueOf()` throws.
- PDL: `valueOf()` also allows conversion to numbers in a `+` or `<` operation, for example. This is bad when you mix types, or have non-exact types, and is pretty much always a mistake. `valueOf()` throwing makes you immediately aware that what you're doing is wrong.
- JWT: Can we document this in the spec? It's currently in the documentation, but the spec text doesn't give any rationale.
- PFC: Seems like that might be good material for `<emu-note>` in the spec.

### Expanding the charter of IETF to wall-time formats
- Do we have an opinion about expanding the charter of IETF to more/all Temporal string formats (e.g. PlainDate, PlainTime, etc.)?
- PDL: Fundamentally yes, but not now. First we need to unblock ourselves for Stage 3. Better compatibility in the future would be good.
- PFC: Agreed.
- JGT: I think once we get to the end of adopting the calendar annotation, we'd have a better idea of whether expanding the charter would be likely to be successful, or stall.
- USA: Agreed. The only gotcha that Neil raised is that Temporal is operating on a technicality. RFC 3339 is exact-time, and we use things from ISO 8601-1 and a few from ISO 8601-2. It could be beneficial to define these wall-time formats.
- JGT: I think that's a slippery slope and we don't want to get ahead of ourselves and delay the calendar annotation.
- PDL: I disagree that we'd need to specify that this is allowed, because nowhere in ISO 8601 does it say that it's not allowed.
- USA: I talked to SFC a few days ago and his opinion was similar.

### IETF discussion about conflicting TZDB versions
- JGT: Would we be OK if IETF decides that the instant should "win" if there's a conflict with the TZID (e.g. new TZDB since the value was stored)? Background:
there's some concerns on the IETF list about our current plan to throw exceptions if there's a conflict between the TZID and the offset. I suspect there may be enthusiasm on the list for having the timestamp "win". If that's the consensus of the IETF folks, is this something we could live with? Specifically, it'd mean a normative change to `ZonedDateTime.from()` from `{offset: 'reject'}` to `{offset: 'use'}`. Or we could choose to keep our reject default, but that would mean throwing for values that are accepted by other platforms that follow the new IETF spec. My impression is that the people on the SEDATE list are concerned about ambiguity. I described how our offset option works. One reply was that another option was to not allow any ambiguity at all. I don't agree with that, but I can see where they're coming from.
- PDL: I interpreted it differently. They suggested that the sender of the information encode the preference into the string. You could do that: specify `Z` as the offset and specify the time zone, or specify the offset. But we already do that. Just, we also allow the receiver to choose what to do.
- JGT: Exactly. If the developer sending the information has a preference, they can serialize the string such that that preference wins. I'm curious if SEDATE decides that the timestamp wins, is that something we would be OK with?
- PDL: No. It removes the flexibility that we added. If the discussion stalls, could we point them to our notes?
- USA: The issue is that we allow this way of letting the sender determine what happens, but it's not in the RFC.
- PDL: I would push for getting the calendar annotation standardized before tackling this.
- USA: Agreed. To answer the original question, I think it's the case that in what is currently in scope of the RFC, the timestamp already always wins. Moreover, I'm willing to defend that the receiver's preference should always win in the end.
- JGT: This means though that a valid string would get rejected by Temporal by default.
- PDL: I don't think that's what it means.
- JGT: I think what the list participant is saying, is that both the `Z` and the numeric offset should cause the timestamp to win.
- Action: JGT to respond to the IETF list with a summary of the discussion.
