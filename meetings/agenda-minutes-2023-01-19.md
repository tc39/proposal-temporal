# January 19, 2023

## Attendees
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)
- Justin Grant (JGT)

## Agenda

### Status of "stage 3.5"
- 18 normative issues in milestone
  - 8 ready or nearly ready to present
  - 3 to be discussed here
  - 1 small and in progress
  - 3 big, of which 1 in progress but won't make the deadline
  - 3 need no action at the moment
- "Verify and close" checklist finished
- No change in editorial issues since last time

### Status of TC39 presentation
- No slides yet
- Need help with id/ID discussion
- Need help with messaging around "stage 3.5"

### Any IETF update? ([#1450](https://github.com/tc39/proposal-temporal/issues/1450))
- USA reported that IESG review asked for a "security concerns" section, which he and Carsten wrote, and got one positive reaction so far on the SEDATE mailing list.
- RGN: If that's the only substantive concern then it sounds like it's in good shape. I wouldn't be surprised if it's published by the March plenary. They've done a fantastic job.

### mergeFields for non-ISO ([#2407](https://github.com/tc39/proposal-temporal/issues/2407))
- Draft solution to discuss: PR [#2474](https://github.com/tc39/proposal-temporal/pull/2474)
- SFC: If this is only an error case when you call mergeFields directly, and not when you write code as described in the documentation, then my opinion isn't very strong. As long as it's cohesive from an editorial point of view then I'm happy with the outcome.
- Given the discussion on the below issues, we'll proceed with this, it doesn't preclude a change in [#2466](https://github.com/tc39/proposal-temporal/issues/2466) should we decide to make one.

### Inconsistent input validation between Calendar.p.&lt;type>fromFields and Calendar.p.mergeFields ([#2466](https://github.com/tc39/proposal-temporal/issues/2466))
- SFC: It's surprising that the era/eraYear validation is in a Temporal AO; it belongs in calendar code.
- PFC: We have one mergeFields operation with validation done outside, because otherwise we'd have to have separate operations for PlainDate.with, PlainYearMonth.with, etc.
- RGN: In mergeFields, the first argument is a collection of fields representing a particular Temporal object. The properties present on that argument are enough to determine which situation you're in.
- PFC: So you would pass a Temporal object as the first argument?
- RGN: Not necessarily, but that might make sense.
- RGN to try to sketch out an alternate vision for validation. This would likely be presented in March if we decided to make a change.
- JGT: I originally opened this issue because in all cases PrepareTemporalFields was called twice. Once in preparation for xFromFields and once inside xFromFields which also checks if the required fields are present. The second call therefore only checks required fields.
- PFC: It's not redundant if you're calling xFromFields directly, so I think we could only consider removing the first call to PrepareTemporalFields.
- PFC: I can see how RGN's alternative would be coherent, if mergeFields' first argument is a PD/PYM/PMD and it's responsible for returning an object of the same type. That pulls the pre- and post-validation into mergeFields. But I'd like to have something concrete to discuss.
- JGT: That increases the complexity of mergeFields a lot, basically making it an implementation of with(). Currently it's really simple. That would be my concern about this, is there value in making it more complicated?
- RGN: What do you think would need to take place in mergeFields that doesn't now?
- JGT: It's moving from dealing with plain objects to Temporal objects.
- RGN: Would it be a problem in either a 402 or non-402 implementation if mergeFields removed fields from the input? E.g. the output doesn't include year/month/day. I'll explore that as a separate alternative.

### Merge ECMA-402 PrepareTemporalFields into ECMA-262 PrepareTemporalFields ([#2465](https://github.com/tc39/proposal-temporal/issues/2465))
- We discussed this last week but FYT provided new information. Examine scenario where working code could break if an implementation adopted 402
- RGN: In what situation would it break?
- PFC: The easiest one to explain is with a custom calendar with a fields() method that returns era and not eraYear or vice versa. It would also break in some cases with date/yearMonth/monthDayFromFields() that are not implemented as intended.
- PFC: Given above discussion, proposal is to take FYT's pull request but remove the era/eraYear validation from PrepareTemporalFields.
- RGN: I'm not familiar with the specifics but that sounds plausible.

### Draft of strings-for-builtin-calendars-and-time-zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- Draft PR: [#2482](https://github.com/tc39/proposal-temporal/pull/2482)
- First cut of tests: [diff](https://github.com/ptomato/test262/compare/temporal-regularize-coverage...ptomato:test262:temporal-1808?expand=1)
- Closes [#1588](https://github.com/tc39/proposal-temporal/issues/1588), likely also closes [#2005](https://github.com/tc39/proposal-temporal/issues/2005), [#2104](https://github.com/tc39/proposal-temporal/issues/2104) 
- Open question: are we happy with what is now accepted by TimeZone.from and Calendar.from? (identifier string, Temporal object, plain object)
    - JGT: I'm concerned about losing the ISO string to calendar/time zone conversion. The use case is in the code sample I commented on the PR, `Temporal.Instant.from(s).toZonedDateTimeISO(s).toPlainDate()`.
    - PFC: That code sample would break, but can you use PlainDate.from() for that purpose?
    - JGT: PlainDate.from() throws if there is a Z in the string. This code sample works whether or not Z is present. This has come up several times in feedback and without the ISO string conversion there's not an easy way to do it.
    - PFC: I don't feel too strongly about keeping the ISO string conversion. I do think the nested properties now don't make sense anymore.
    - RGN: This code sample looks like a hack to me and is not clear what it's doing. Weird and unexpected.
    - JGT: Let me try to figure out what this code would look like if we couldn't do this. Would you have to parse the string?
    - RGN: What you just described is that you have a string that you want to interpret as a ZonedDateTime, correct?
    - JGT: Right. But what you described as weird and unexpected I see as a feature. This use case is valid but maybe has to do with legacy code. E.g., parsing string timestamps from a database, which may have Z or -HH:MM offsets. It's OK that that looks weird.
    - RGN: If what you want is a ZonedDateTime, you can replace the Z with +00:00 to get a ZonedDateTime.
    - PFC: You can't get a ZonedDateTime from a string without an annotation.
    - JGT: Right, I think it's helpful for callers to be reminded that you need to go find the "real" time zone, but in some cases you do actually want to do this. The alternative is writing your own parser.
    - RGN: What's the reason we don't create ZonedDateTime from strings without an annotation? Because the person writing this will realize what you explained but the person copying it from Stack Overflow will not.
    - JGT: Why we did this, it's almost certainly a bug to create ZonedDateTime from an offset time zone because normally you will want a named time zone. So that's why we require `[-08:00]` as an annotation. It shouldn't be easy to create ZonedDateTime with an offset time zone by accident.
    - RGN: If this is important, maybe it should be an option for ZonedDateTime.from()? An option that promotes an offset into an offset time zone? If this code is going to be written anyway, I'd rather have it be clear and not Stack Overflow copypasta.
    - JGT: The other reason to support it is that all the other methods in Temporal that accept a subset of ZonedDateTime fields allow you to get that subset from an ISO string, so why not Calendar and TimeZone.
    - PFC: That's the rationale that I think makes less sense with this change.
    - RGN: For me, TimeZone and Calendar are not the same kind of data that a year or a minute are, so that consistency doesn't hold up. They're different because they have identity and functionality. If that has negative practical consequences, there are different solutions possible.
    - JGT: They feel different, but if you're looking at it from the point of view of a string parser, the identifiers are just strings.
    - RGN: For a string parser, it has to have two branches, either an identifier or an ISO string that you might be able to get an identifier from. That's different from the other pieces of data.
    - JGT: That's the same kind of difference between a reduced ISO string and a full ISO string. When you try to define exactly what the difference is, it gets squishy.
    - RGN: Agreed that it is squishy, but I do see a difference. The subsetting is a convenience that Temporal offers.
    - JGT: It is actually convenient.
    - RGN: It wouldn't be that much more inconvenient to parse it to the full type and then subset it. I do think we made the right tradeoff there, but there are likely weirdnesses. The inconsistency with Calendar and TimeZone doesn't bother me, though.
    - JGT: I don't think it's bad enough to justify a breaking change at this point.
    - RGN: That may be the case, I don't think a change specifically to break TimeZone.from(ISO string) is well-motivated, but that's not what's on the table.
    - JGT: I disagree, I think this is separable.
    - PFC: They are separable, I've added it on in separate commits in the branch.
    - JGT: Propose that we remove these commits from this PR and discuss them separately.
    - PFC: Agreed, but practically I'd suggest putting that separate PR on the agenda, discuss it next week, and withdraw it if we end up not wanting it. This would put [#2104](https://github.com/tc39/proposal-temporal/issues/2104) back on the agenda.
- Open question: What about `toJSON()`, does it still observably call `toString()`?
    - PFC: I'd like to not call toString here since the other Temporal objects' methods don't call it. The drawback is that it's easy to forget to override toJSON, but we've previously said we don't care about making custom calendars easy at the expense of other things.
    - RGN: I'd prefer that too.
    - JGT: Agreed.
- Open question: Do the `calendarId` and `timeZoneId` getters perform the lookup of the `id` property every time they are executed?
    - JGT: I think it has to be yes.
    - RGN: You could snapshot it the first time it happens.
    - JGT: That seems dicey. Is it more immutable and therefore able to be more optimized?
    - RGN: It seems like this is about what guarantees you can give. What would break if the id changed, or what would be bizarrely observable with continued lookups?
    - JGT: Worst case is a malicious time zone that returns a different IANA id each time.
    - PFC: The id is only used in strings. For everything else, you call the methods.
    - RGN: In that case I don't think caching is necessary.
    - JGT: Observable lookups seem fine.
    - RGN: It means the calendar or time zone can detect when a serialization is happening. I don't see a problem with that.
- Open question: If the caller passes in a Calendar or TimeZone object that is a built-in instance, should the constructor convert it into a string to get fast-path behavior? No, but ... what about an instance returned from a user call to a Calendar method, e.g. `cal.dateFromFields({...})`? Is that doomed to always put an object in the internal slot?
    - PFC: This was surprising to me.
    - JGT: Would we allow dateFromFields to put a string in the internal slot?
    - PFC: We'd have to check that Calendar.prototype is untouched, which is what we were trying to avoid in the first place with this change.
    - RGN: Can we always have the builtin dateFromFields return an instance with a string calendar?
    - PFC: That would break calendars that extend builtin calendars.
    - JGT: You'd just have to override dateFromFields.
    - RGN: That puts a burden on calendar authors to override &lt;type>FromFields, but we’ve said elsewhere that such a burden is appropriate.
- Open question: Does [https://tc39.es/proposal-set-methods/](https://tc39.es/proposal-set-methods/) set a precedent as to what to do if the calendar/time zone is a property bag? i.e. the Calendar Record and Time Zone Record behaviour described in 1294?
    - (summary of [GetSetRecord](https://tc39.es/proposal-set-methods/#sec-getsetrecord))
    - JGT: Are these methods cached anywhere after the original method call returns?
    - RGN: No, the methods return a new Set object that is uninfluenced by the Set Record.
    - JGT: The rule that they seem to be setting up here is that within the context of one method call, the methods will be extracted exactly once.
    - RGN: It's the right call for Set methods that the methods provided by arbitrary code are extracted once and called an unpredictable number of times.
    - JGT: For Calendar and TimeZone it's a little weirder because in a Set Record there are only two methods. It doesn't make sense to always extract all the methods of Calendar and TimeZone when usually they're not used.
    - RGN: That probably has a negligible impact on performance either way.
    - JGT: We're doing a lot of work in #1808 to prevent a calendar object being created unnecessarily, it doesn't make sense to store 10 methods all the time.
    - PFC: After this discussion I think JGT's formulation makes sense: within the context of one method call, the methods should be extracted exactly once. We don't currently pay attention to that, there are a lot of observable Get-Call-Get-Call-Get-Call pairs, but fixing this was planned as part of [#2289](https://github.com/tc39/proposal-temporal/issues/2289) anyway. So, no need to raise anything as part of this issue.
