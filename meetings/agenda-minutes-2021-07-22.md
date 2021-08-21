# July 22, 2021

## Attendees
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)
- Frank Yung-Fong Tang (FYT)
- Jase Williams (JWS) 

## Agenda
### Accept PlainDateTime as well as PlainDate, PlainYearMonth, PlainMonthDay in Calendar methods? [#1613](https://github.com/tc39/proposal-temporal/issues/1613)
- PFC: I think this is fine, and I can't remember why we decided not to do it earlier.
- SFC: Probably because calendars don't expect objects with time on them.
- FYT: This is probably not that much of a performance improvement.
- SFC: I don't see a downside to this. It seems like a good idea even if it doesn't impact FYT's implementation directly.
- PFC: Agree.

### Restrict the accepted input of Calendar.fields? [#1610](https://github.com/tc39/proposal-temporal/issues/1610)
- FYT: This API is mainly designed for Temporal to call internally. It's an unnecessary burden for the implementation to iterate through a 10000-item array. There are only 10 possible input items, so it shouldn't accept more than that. Otherwise it can be misused.
- PFC: Given that people were skeptical on the thread about no longer accepting an iterable, we could implement these restrictions while still accepting an iterable.
- FYT: It's an internal API, does it really need to accept general things? It's more complicated to implement accepting an iterable. But my main concern is garbage in. Also garbage out; Temporal treats the return value as an iterable as well. Should we limit those as well?
- PFC: I'm not sure how to implement a good restriction on garbage out.
- FYT: Me neither. It would happen with an Array as well.
- PFC: I'm less concerned about garbage-out because it's like user code implementing an infinite loop.
- FYT: I'm concerned about security review for the implementation.
- PFC: I'm not an expert, but I'm not sure how it's a security risk. JHD was wondering that on the thread as well.
- FYT: Maybe I should talk to security people about this.
- SFC: What are you proposing should change here?
- FYT: First ask: on input, throw if there are more than 10 items, any repeated items, or any items not in the 10 accepted fields (for example, not era). Second ask: mandate this for all calendars, not just ISO. The other thing with an iterable is with CreateListFromIterable, you can't throw an exception until you've iterated through the whole thing.
- PFC: I don't think we have to use CreateListFromIterable there.
- FYT: Currently it's written so that other calendars have no opportunity to do that.
- SFC: About accepting duplicate fields, you would still have to create the list in order to check for duplicates.
- FYT: If you limit it to 10 items, creating the list isn't a problem.
- SFC: I think 10 items is restrictive. Non-ISO calendars should be able to handle more fields.
- FYT: Not for input. Temporal only ever calls `Calendar.fields()` with a fixed set of at most 10 items. For return from `Calendar.fields()`, you're right.
- PFC: Propose that we throw on iterables that yield more than 10 items, that yield duplicate items, and that yield items that are not `year`, `month`, `monthCode`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, or `nanosecond`. I still don't know what to do about the return value, though.
- SFC: The concern about the malicious return value seems kind of abstract. If there's malicious code running, then ...
- FYT: But now we create the array in Temporal.
- PFC: Could you elide the array? It goes through IterableToListOfType, which isn't observable. You could feed the iterable directly into PrepareTemporalFields, though if it was infinite you'd still have to create an infinite number of data properties.
- FYT: I'd like to set an upper limit on the number of items, but I'm not sure what a reasonable limit to set is.
- PFC: What is a next step? Should we talk to the security review people, or talk to people implementing custom calendars, or arbitrarily set a limit of 100?
- FYT: I would rather set a limit, more like 20 than 100.
- SFC: I'm not convinced about the security issue, but if we chose a limit I'd prefer 100. There are a few places in 402 where we use it as a limit already, and it's obviously a human-chosen number.
- PFC: Can we get more information for next time on whether it's a security issue or not?
- SFC: For it to be a security issue, I'd think there has to be malicious code running. Malicious code can already allocate memory arbitrarily.
- FYT: If we don't have a limit, we'll have to write unit tests to cover very large amounts of output. V8 will probably pick a limit anyway.

### Revisit [#797](https://github.com/tc39/proposal-temporal/issues/797), overflow for strings?
- See implementor feedback in [#1606](https://github.com/tc39/proposal-temporal/issues/1606)
- (Defer to next meeting)
