# October 14, 2021

## Attendees:
- Frank Yung-Fong Tang (FYT)
- James Wright (JWT)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Justin Grant (JGT)
- Philip Chimento (PFC)

## Agenda:

### `PlainDate.from('2020-01-01T00:00Z')` is problematic ([#1751](https://github.com/tc39/proposal-temporal/issues/1751))
- PFC: After JGT's latest [comment](https://github.com/tc39/proposal-temporal/issues/1751#issuecomment-943103609) I finally understand why this is dangerous. I am still concerned about making a semantic change in Stage 3, though.
- JGT: If you have a function that expects a date, typically the first line of the function will call `PlainDate.from()`, optionally wrapped in a try-catch block. My concern is, if we keep the current behaviour, every function that takes a PlainDate will have to guard against this. Most developers won't know that they need to write this code in the first place and you'll get errors with off-by-one dates. It also occurs when refactoring things to use primitives in frameworks like React. I've seen a similar bug happen at every company I've worked at in the last 10 years. I think the `Temporal.Instant.from(instantString).toZonedDateTime(...).toPlainDate()` pattern is much clearer about the intention.
- PDL: I think where we are not on the same page is that you call this string an instant string. I don't consider the string to carry those semantics. If I want to parse an exact time out of it, the `Z` indicates UTC, and so I can, but it's not inherently typed.
- JGT: Most of the uses of strings with `Z` are going to come from Instant, in the future.
- PDL: I think of most strings as coming from storage and databases, the generic "toISOString" of some other app.
- PFC: I agree with PDL that these strings don't have a semantic meaning. Not having "stringly-typed" APIs is a principle we've affirmed repeatedly. But I think the bug that JGT described is a serious enough potential pitfall that we should make an exception for this particular type of string.
- PDL: I did think we had precluded this kind of bug by introducing ZonedDateTime. Why would people be using Instant here in the first place?
- JGT: I'll describe a few use cases. The serialization layer of MongoDB, when you have a UTC string, gives you a legacy Date. At some point they would be likely to change it to give an Instant.
- PDL: No, they would give you a ZonedDateTime at that instant in your local time zone.
- JGT: I wouldn't design MongoDB like that. It's a misfeature of legacy Date that it's interpreted in the local time zone. Postgres has data types that are UTC vs offset and SQLDB works the same way. I'd use Instant for cases where I don't know the time zone, but I do know the exact time.
- RGN: I largely agree with JGT on the purpose of Instant. I don't know what it means in terms of this API surface.
- FYT: Are you proposing that data types with a time zone should throw on a string that ends in `Z`?
- JGT: The opposite; data types that don't have a time zone. Z has a special meaning to Temporal, meaning that there is no time zone. If it's a string with an offset, then it will use the wall date.
- FYT: So we are not treating `Z` as UTC, we're treating it as a special case.
- PDL: That's where we disagree. `Z` means UTC.
- JGT: I'm claiming that the systems that I'm most familiar with, mostly databases, do make that distinction. And by having both Instant and ZonedDateTime, we make this distinction in Temporal as well.
- PDL: I know that Oracle and MySQL don't look these up. For most data origins, a `Z` doesn't mean anything about the underlying data.
- JGT: This is actually a new feature in Oracle that they added recently. MySQL typically lags behind on this stuff. .NET and Java also have this distinction.
- FYT: I would like to consult ISO 8601 on this, which I believe says that `Z` is the UTC designator.
- RGN: It's important to keep in mind that ISO 8601 misuses that vocabulary. It doesn't actually have time zones, but it defines `Z` as an offset of +00:00.
- FYT: If Z is exactly equivalent to +00:00, should we throw when we have +00:00? I don't think so.
- PFC: I actually agree that `Z` is not different from +00:00, but I think that's a red herring in this discussion. I'd agree with making this change because of the potential pitfall that JGT mentioned and how it affects users of the web.
- PDL: I think both sides of this discussion are valid and we can't come to a technical conclusion. Rather, we need a value judgement. Is it more important to prevent bugs from people who are misusing strings, or is it more important to be consistent with the definition of Z in ISO 8601? Maybe we can resolve this by prepping the change for plenary and asking what we value in TC39 as a whole?
- PFC: That is an insightful remark. I don't think we can prepare this before the agenda deadline. I am booked up with other normative changes that are already in the queue.
- JGT: I will try to prepare it today, if we don't succeed then we can do it in December.

### Options should be optional ([#1756](https://github.com/tc39/proposal-temporal/issues/1756))
- PDL: I'd suggest not bringing this up until and unless we have a proposal to present. If JHD wants to raise it, that's fine, but until we have a proposal our position is the status quo.
- (Summarizing state of discussion and the different [options](https://github.com/tc39/proposal-temporal/issues/1756#issuecomment-906842753) on the table)
- PDL: One proposal would be to make the change, but only if there is a consensus that the invariant JHD is invoking is actually an invariant.
- Conclusion:
  - Consensus that we like the API change being proposed
  - JGT to prepare spec-change PR and accompanying slide for plenary

### Revisit the [[Calendar]] slot of PlainTime? ([#1588](https://github.com/tc39/proposal-temporal/issues/1588))
- Consensus to remove this if it would not break the web when possibly adding time calendars in the future. (That was the only reason we added it in the first place.)
- Check with SFC that it's OK to remove.
- Bring to Plenary in Dec.

### Problem with `relativeTo` object ([#1862](https://github.com/tc39/proposal-temporal/issues/1862))
- FYT: What direction do you think this is going? What should the spec text philosophically say?
- PFC: I think I need to split ToTemporalTimeRecord into two operations, one where at least one property is required and one where they are all optional. What should happen is that relativeTo property bags, the time units default to 0, and in PlainTime property bags we should require at least one unit. Finishing this is my highest priority today.

### Options of `Calendar.dateAdd()` is not undefined but null ([test262#3262](https://github.com/tc39/test262/issues/3262))
- PFC: If we implement [#1685](https://github.com/tc39/proposal-temporal/issues/1685), would that fix the problem?
- FYT: I'm not sure how to solve [#1685](https://github.com/tc39/proposal-temporal/issues/1685), so I don't know. What would be the resolution of [#1685](https://github.com/tc39/proposal-temporal/issues/1685)?
- PFC: The idea is that we would pass undefined everywhere as the options parameter, to user-observable methods, when we are not explicitly passing an option. I'd probably present this in the December plenary.
- FYT: Works for me.
