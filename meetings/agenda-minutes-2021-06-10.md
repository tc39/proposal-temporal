# June 10, 2021

## Attendees
- James Wright (JWT)
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Richard Gibson (RGN)
- Philipp Dunkel (PDL)
- Shane F. Carr (SFC)

## Agenda
### IETF update
- Link to DISPATCH mailing list and SEDATE mailing list
- USA: We have almost chartered the new working group SEDATE (Serializing Extensions to Date And Time Elements). Progress has stalled due to many minor comments. I had a meeting with the area director and Bron Gondwana today. We have decided to split out the extensions draft into a hollowed-out core, of just the annotation format that we have, and not the other things. This could be problematic for Temporal because we support a subset of ISO 8601 but a superset of RFC 3339. So, for example, 6-digit years still wouldn't exist in RFC 3339.
- RGN: My opinion with respect to Temporal is that this isn't a problem. We can describe Temporal as a subset of ISO 8601, with optional extensions from RFC 3339-successor. We will continue to push for having it unified into one thing, but as long as they are published anywhere it should be OK.
- USA: One concern that implementors might look for a parsing routine which they wouldn't be able to find because it's not unified in one existing standard.
- RGN: You see things like this elsewhere in the RFC series, where an RFC updates but does not replace an older RFC.
- USA: Maybe we can include some text in the RFC itself that can say something like, this extension can be used with any ISO-like date format. With this, not making any changes to RFC 3339, I'm confident that I can move this through.
- PFC: What are we losing from the draft? The 6-digit years and the sub-minute time zone offsets?
- USA: We aren't losing anything because those are just things that are not covered in RFC 3339, but as RGN said we base Temporal on ISO 8601 with the extensions.
- SFC: Can the draft say, "these are the suffix extensions to something representing an instant, e.g. RFC 3339" to leave it open?
- USA: That would be ideal.
- PFC: Sub-minute time zone offsets aren't standardized anywhere else. Is that a problem for Temporal?
- USA: It's the case that they aren't standardized, but it seems like an edge case (only occurs in pre-1972 dates). It's very rare that these strings occur.
- PFC: If you get a string from another application representing an exact time where the current offset is not aligned to a minute boundary, then `ZonedDateTime.from()` will throw on it. We can either do nothing, or make a special case for offset: 'reject' that will still accept a HH:MM offset even if it isn't exact.
- USA: Yes, that seems correct.
- PDL: We have a certain precision that the comparison takes place at, which should be the lowest precision.
- USA: Yes, the comparison can take place at minutes precision.
- PDL: I agree, but I don't think it's a special case.
- USA: `+06` means `+06:00` though.
- PDL: The precision at which the offset is rendered is minutes, even if the precision of the data is higher.
- PFC: This seems like the right choice. The other choice is whether to include an option in `ZonedDateTime.toString()` to output the string with minutes precision or full precision.
- PDL: I wouldn't do that. If the standard says that the offset has a precision of minutes, then we should output that even if we store a higher precision. It's up to whoever is working with that data to make sure that the precisions from two sources agree.
- USA: So we would accept the full precision but emit only the minutes precision.
- PDL: I think we should add an explainer about the precision to the spec text.
- USA: Seems like the repo documentation is a good place for that.
- PDL: What does the spec actually say about offset precision? Does it give a maximum precision?
- RGN: What spec are you talking about? RFC 3339 requires hour and minute. ISO 8601 has an abbreviated form which is hour-only. Neither of them support precision greater than minute. Omitting the minutes means 0.
- PDL: In that case we are future compatible.
- USA: We hope to see this change in the future.
- PFC: https://github.com/tc39/proposal-temporal/issues/935#issuecomment-703018002 is the decision that we are revisiting now, with good reason: our nanoseconds extension is not going to get standardized. I would recommend that we leave the `ZonedDateTime.offset` property as-is and only make this change to the ISO string serialization and deserialization, because JGT gave good reasons in that discussion for `ZonedDateTime.offset` to be the way it is.
- Consensus:
  - Change `ZonedDateTime.toString()` and `Instant.toString()` to output time zone offsets only with minutes precision.
  - Change `ZonedDateTime.from()` to accept `HH:MM` precision for non-minute-offset time zones, even with `offset: 'reject'`.
  - No change to `ZonedDateTime.offset` property, `offset` property in property bags, and `TimeZone.getOffsetStringFor()`.
- RGN: I see that ISO 8601-2 does allow a seconds timezone offset, but those are the extensions that aren't generally supported anywhere, even in Temporal.
- USA: My issue with ISO 8601-2 is that it's a mixed bag, there are things that make sense and things that don't.

### Polyfill updates
- PFC: The production polyfill is published at @js-temporal/polyfill. JGT is working on the deprecation message for the polyfill in the proposal repo.
- PDL: I will deprecate the two other modules that are under my control and forward them to @js-temporal/polyfill.
- Discussion about converting the sources of @js-temporal/polyfill to TypeScript.
