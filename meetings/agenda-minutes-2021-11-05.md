# November 5, 2021

## Attendees
- Shane F. Carr (SFC)
- Frank Yung-Fong Tang (FYT)
- Philip Chimento (PFC)
- Sarah Hennigh-Palermo (SHO)
- Richard Gibson (RGN)

## Agenda

### TimeFractionalPart in ParseISODateTime is ambiguous ([#1794](https://github.com/tc39/proposal-temporal/issues/1794))
- FYT: Case 2 and 3 in this issue are still ambiguous. In the string `2021-09-01T02:03:04.56789+23:12:07.987654321[+11:22:33.444445555]` there are three substrings produced by _TimeFractionalPart_. Did I miss anything?
- PFC: I agree this is a bug.
- FYT: Which is it referring to?
- PFC: The first one.

### Should all the parsing routines only validate the syntax? ([#1901](https://github.com/tc39/proposal-temporal/issues/1901))
- SFC: When parsing a syntactically valid string, you pull out only the parts you need, and ignore the rest. The question is what is syntactically valid for TimeZone and Calendar. If it doesn't need a time zone or calendar, then it should ignore everything inside brackets, as long as the brackets are balanced. One of the questions we're answering on the IETF side is should we allow ASCII or all Unicode?
- FYT: I disagree, there is a specific grammar for these annotations. Syntactically valid is not only balanced brackets. Annotations have to start with `u-ca=`.
- SFC: I'm saying that is too strict. In the IETF we are leaning towards allowing everything inside the brackets.
- FYT: So you are going to propose a different change depending on what comes out of the IETF. But what should be done in the current spec? I don't think we should discuss the other issue until that is resolved in IETF.
- PFC: For the short-term question, it seems like whether a calendar or time zone is supported by the system, should not determine whether the string is syntactically valid.
- FYT: But we also check if the time is syntactically valid when we only need a date.
- PFC: I'm not sure what exactly is valid according to ISO 8601 but there are some contextually dependent things in there.
- RGN: Like leap seconds.
- PFC: Right, or February 31, I'm not sure if that is specifically mentioned.
- FYT: Why is that in our grammar?
- RGN: It requires context, like :60 might be a leap second, but leap seconds can't occur everywhere.
- FYT: So we validate that in the parsing routine even though it can't be expressed in the grammar.
- PFC: We should still check in ISO 8601 that we are correctly saying what's syntactically valid or not.
- Consensus: We'll remove the builtin calendar validation from the parsing operations, and check that we are doing the date/time validation correctly according to ISO.

### Restrict the return value of Calendar.fields? ([#1610](https://github.com/tc39/proposal-temporal/issues/1610))
- FYT: I think we can consider this closed.

### Mathematical values in Duration ([#1604](https://github.com/tc39/proposal-temporal/issues/1604))
- SFC: The issue is that Temporal.Duration does something that other duration libraries don't do. We support an arbitrary amount of time in every field, whereas e.g. Java duration is only one number that is measured in hours and below, and they have a separate class called Period which is valid for days and above. This means that implementors have to store a lot of extra information for each field, instead of a double. The common case is that a Duration is only a single field, so maybe there's a more efficient way. If the spec text says that Durations store mathematical values, then effectively we have to store BigInt for all fields, probably even in the single-field case.
- FYT: Currently the storage for Duration is integer Number value. So there should be a strong reason to change it in Stage 3.
- RGN: Is it implementable and coherent as written now? If not, that's a reason for changing it.
- PFC: I think it is. There's an implementation currently in JavaScriptCore that uses doubles. The motivation originally was from SYG in his editorial review. In the previous discussion JGT raised another point that it might be better in any case to have a bounded value.
- SHO: I'm generally pro-permissiveness when possible.
- SFC: It's really the storage that's the problem. I think the storage should be in integer-valued Numbers. Based on the thread that I was on, I think storing unbounded BigInts could be a memory and performance issue. Mathematical values are fine as an algorithm thing, but not a storage thing.
- RGN: I'm not clear on that distinction.
- SFC: If you had some operation that would be fine in mathematical value space and imprecise in Number space.
- FYT: Basic question, do we see Duration as an assistant object for doing math with Temporal, or a first-class citizen that can be used by itself? If we use Duration with other dates and times, and those are bounded, then we don't have a reason to make it unbounded.
- RGN: The practical reason for dates and times being bounded is to match the bounds of legacy Date.
- FYT: So, since there was no legacy Duration, there are no historical bounds?
- RGN: My proposal was that Duration be limited to the maximum possible Duration between two valid Instants. But given the structured nature of Duration even that is not crystal clear, because of calendar units.
- PFC: This is only really a problem because you can add and subtract durations.
- RGN: You can also compose them.
- SFC: What happens now if you add two durations and the result is higher than max safe integer?
- PFC: You get the same result as if you had added those Numbers in JS.
- RGN: For hours and lower, or all units?
- PFC: I'm not 100% sure. 
- SFC: I'm just not convinced that there's enough of a need for this. I know the editors are trying to use mathematical values more consistently, maybe we should talk with them to understand this motivation better, and communicate the objections from implementors?
- Consensus: We will approach SYG about this.
- PFC: If we keep Number values in Duration, we need to decide what to do with -0.
- RGN: I feel strongly that -0 does not belong in Duration.
- SFC: I see Durations conceptually as having a single sign bit, that isn't associated with a particular field.
