# August 18, 2022

## Attendees
- Ujjwal Sharma (USA)
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)

## Agenda

### IETF SEDATE next steps
- USA: Thanks JGT for joining the IETF meeting, it was a game changer. We got consensus on the remaining issues. It is roughly equivalent to a Stage 3 in TC39. There are outstanding PRs by both JGT and Carsten Bormann implementing that consensus, and Carsten is going to combine them soon. According to Bron Gondwana, we also need a signal or acknowledgement from the ISO liaison, before submitting this to publication, but we don't have to wait for the next IETF.
- JGT: When is the next IETF meeting in case we do have to wait?
- USA: 5th November in London.
- JGT: Clearly the outcome wasn't what Carsten wanted, but the consensus in the room was strong enough that we got what we wanted.
- USA: Yes, this is going smoothly. We got approval from the area directors.
- JGT: Next step is to get those PRs merged that implement the conclusions.
- Discussion about how this will be implemented in CBOR.
- SFC: Glad that this is moving forward. In ICU4X we want to start consuming strings, so I think we want to start writing a parser for IXDTF as a Rust crate. What grammar would you recommend using?
- USA: I would recommend using the grammar in the draft, which is purposely more relaxed on some points than Temporal.
- PFC: You'll also need to decide which "agreed by communicating parties" extensions from ISO are required for your application, for example extended year format.
- RGN: What are the differences between the IXDTF grammar and Temporal?
- USA: Temporal has more restrictive grammar in some cases.
- PFC: We have a list of differences between ISO 8601 and Temporal at the top of the [grammar section](https://tc39.es/proposal-temporal/#sec-temporal-iso8601grammar).
- SFC: If anyone is interested in working on this Rust crate, contact me.
- PFC: Now we come to what needs to change in the proposal:
  - Recognize critical flags in time zone and calendar annotations
  - Offset option should still override time zone critical flag in ZonedDateTime.from, precedent has been that the programmer gets the last word
  - Calendar annotations are already always treated as critical
  - What to do when annotations with critical flag are passed to a data type that doesn't treat them as relevant, e.g. Instant.from()?
  - What to do when duplicate calendar annotations are given?
- JGT: It does seem reasonable that if the sender makes an explicit opt-in decision to add the critical flag, we don't discard that.
- USA: On the other hand, if you explicitly write Instant.from instead of `ZonedDateTime.from(...).toInstant()`, you are making a choice that says time zone is not relevant.
- JGT: One reason to ignore is that if we rejected Instants with the critical flag, anybody parsing anything would need to handle the case where there is a conflict, which they've already signalled they don't care about.
- USA: If we reject on extraneous information, do we also reject on passing a full string into TimeZone.from or Calendar.from? Ignoring extraneous information fits with the precedent.
- JGT: I'm convinced.
- USA: For the duplicate calendar annotations, let's file an issue on SEDATE. Happy to reject when that happens and handle it in the future.
- PFC: Sounds good.
- SFC: Do what BCP47 does if there are duplicate keywords: first wins.
- PFC: Also sounds good.
- JGT: If it was a JS Object, the last would win.
- RGN: If no one has a good reason for any particular behaviour, then rejecting it with an error allows adoption of reasonable behaviour in the future.
- SFC: A use case for last wins is that if you want to override the calendar field, you can append it to the string.
- USA: Does Temporal ever produce a string with a critical flag for output?
- PFC: I don't see a good reason to at this time. It's not part of our data model and I'm not sure incorporating it should be a Stage 3 question. This could be part of a follow up proposal if there later come to be applications out in the wild that consume this flag.
- JGT: If we were to implement this, there are both `timeZoneName` and `calendarName` options in `toString()`. If we did want to support this, we could add a `"critical"` value to those options. Maybe a compromise between doing nothing and incorporating it into the data model would be to add this option in `toString()`.
- USA: I think it should be per-call of `toString()` anyway, not part of the data model, even if it's less ergonomic.
- JGT: I don't care so much about the ergonomics, but if I'm sending a string to a receiver that requires the critical flag, it's nice to have a way to produce it.

**Conclusions:**
- Parse critical flags in time zone and calendar annotations
- Parse syntactically correct but unrecognized annotations, ignore them unless they have a critical flag, in which case reject the string
- Critical flag in time zone annotation doesn't change behaviour. Default `offset` option in ZonedDateTime.from() is `"reject"`, so the string is already rejected if there is a conflict, and the `offset` option should give the last word.
- Critical flag in calendar annotation doesn't change behaviour. Calendar annotations are already always treated as critical, i.e. `PlainDate.from('2022-08-18[u-ca=hebrew]')` should never return a date with ISO calendar if the implementation doesn't support the Hebrew calendar.
- Data types for which time zone or calendar annotations are irrelevant (e.g. Instant), still discard the annotations even if they include a critical flag, so that doesn't change behaviour.
- Add a value `"critical"` to the `timeZoneName` option in `ZonedDateTime.toString()`, and to the `calendarName` option in PlainDate, PlainDateTime, PlainYearMonth, PlainMonthDay, and ZonedDateTime `toString()`. This option causes the critical flag to be output in the time zone or calendar annotation, respectively.
- In case of duplicate calendar annotations, we'll tentatively go with first wins, pending the outcome of SEDATE issue [#25](https://github.com/ietf-wg-sedate/draft-ietf-sedate-datetime-extended/issues/25)

### Ross's concerns about precision loss ([#2195](https://github.com/tc39/proposal-temporal/issues/2195))
- PFC: This is also related to [#2380](https://github.com/tc39/proposal-temporal/issues/2380).

**Conclusion:** Need more time for this, and invite RKG and FYT.

### FYT's specification of ToISOWeekOfYear
- PFC: How do people feel about this? I'm mostly surprised there is no external reference.
- SFC: I'm fine with this.
- RGN: I think it's an indication that the operations we have in Temporal are probably not the correct ones. You could have e.g. a date in January 2022 which is in week 53 of week-year 2021.
- SFC: CLDR has patterns for this.
- RGN: It makes me think that the correct operation to have is a composite one that returns both pieces of data. As for the algorithm as long as it's correct that's OK.
- SFC: In ICU4X we realized you can't just subtract 1 from the year to get the week-year in era-year calendars.

**Conclusion:** Go ahead with Frank's initiative, put week-years more broadly on the agenda next time: add `yearWeek` property or remove `weekOfYear` property
