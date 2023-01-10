# September 15, 2022

## Attendees
- Shane F. Carr (SFC)
- Richard Gibson (RGN)
- Philip Chimento (PFC)

## Agenda

### Status: Presentation at September plenary
- PFC: Presentation was successful, after handling JHD's objection about preserving the critical flag in the data model.

### Frozen built-in calendars and time zones ([#1808](https://github.com/tc39/proposal-temporal/issues/1808))
- PFC: We got some comments from Anba on this issue. Anba disagrees with Yusuke and thinks this should be easy enough to optimize without any change, by comparing object shapes. I guess my recommendation would be to proceed with preparing a normative change, and then see whether Anba dislikes it strongly enough.
- SFC: Remind me how this issue would also solve [#1588](https://github.com/tc39/proposal-temporal/issues/1588)?
- PFC: The PlainTime.calendar getter returns an ISO 8601 calendar object, and subsequent accesses return the same object. Frank's concern was that you have to reserve space for a pointer to the calendar object in PlainTime's storage, even if you create the calendar lazily. If the ISO 8601 calendar was a frozen singleton, you wouldn't need any space in PlainTime.

### ECMA-402 concerns ([#1932](https://github.com/tc39/proposal-temporal/issues/1932) and [#2363](https://github.com/tc39/proposal-temporal/issues/2363))
- PFC: I talked to USA about these since the last time we met. He originally thought these would be difficult to solve but I think they are both pretty straightforward, and I think USA agrees now.
- SFC: We talked about these in the August TG2 meeting. There's a concrete path forward, but someone needs to work on it.

### Annotations on `YYYY-MM` and `MM-DD` ([#2379](https://github.com/tc39/proposal-temporal/issues/2379))
- SFC: My perspective comes from a few places. I want to figure out how to write an IXDTF parser, and I want to add on Temporal support fairly easily. It concerns me that the grammar is ambiguous, it makes it harder to write a parser. We can already omit things that IXDTF requires, but YearMonth and MonthDay are already a bit of a mess. I'd propose that we only allow `YYYY-MM` and `MM-DD` in those two constructors and not accept annotations on them.
- RGN: The problem that I feel strongly about is that if a calendar syntax is acceptable for a PlainTime, then it should be applicable for `YYYY-MM` and `MM-DD`. I would also be fine removing it from times.
- SFC: But if the UTC offset is ambiguous with the day, then that indicates we shouldn't have it on `YYYY-MM`.
- PFC: We could solve it by not allowing the offset after `YYYY-MM` and only a time zone annotation.
- SFC: Is an offset allowed after `YYYY-MM-DD`?
- RGN: I'd prefer not.
- PFC: Currently it is, and I think ISO 8601 allows it, or at least `YYYY-MM-DDZ`.
- SFC: If we only allowed offsets after time components, that seems like a good solution too.
- RGN: I don't think ISO 8601 allows offsets without times, and I'd prefer that we don't. Even if we might have to make an exception for `YYYY-MM-DDZ` for ISO, although I'd prefer not to have that exception.
- PFC: So if we removed the ability to give a UTC offset without a time component, would that solve the problem?
- SFC: If we were able to make that change, that would solve my objection to annotations on `YYYY-MM` and `MM-DD`.
- RGN: We can say that an offset has no meaning without a time component.
- PFC: But a time zone annotation? If we want to have the same collection of annotations on `YYYY-MM` and `MM-DD` as on `YYYY-MM-DD`, then we'd have to allow a time zone annotation.
- SFC: I don't think an IANA time zone is strongly linked to a `YYYY-MM-DD`, but it's less poorly linked than a UTC offset to a `YYYY-MM-DD`. You can say "September 15 in the Los Angeles time zone".
- PFC: This is the ZonedDate that PDL has brought up from time to time.
- RGN: It's a coherent concept.
- SFC: What about `Temporal.PlainDate.from('2022-09-15[!UTC]')`?
- PFC: We covered this when originally discussing annotations. We should do the same thing as e.g. `Temporal.Instant.from('2022-09-15T17:00Z[!u-ca=gregory]')`, that is, drop the annotation.
- RGN: What do we do with `Temporal.PlainDate.from('2022-09-15[!No_Such_Timezone]')`?
- PFC: If it's a well-formed string syntactically, we drop the annotation. If it's not well-formed we reject it.
- SFC: I really don't want any IANA lookup to have to happen during parsing.
- RGN: In the API surface of Temporal it's never possible to separate parsing from validation.
- SFC: Right, but I'm talking about internally in Chrome's IXDTF parser.
- RGN: It's strange that an annotation like `[!No_Such_Timezone]` would be ignored even by a data type that doesn't use it. Maybe not fatally strange, but strange.
- SFC: I don't find that strange. If we're going to ignore it, we should not do further work to validate it. It seems like a weird middle ground to not use the annotation but do a TZDB lookup to validate it. Note, the TZDB is not constant, so it could parse one day and fail the next.
- RGN: I can agree with that, it all gets very strange at that point anyway.
- SFC: So the critical flag doesn't actually change any behaviour for time zones and calendars.
PFC: Right, it's a text mechanism for what we already have an out-of-band code mechanism for in Temporal: the `offset` option to `ZonedDateTime.from()`. It exists to resolve conflicts between offset and time zone, and was added to other annotations for consistency.
- SFC: Got it.

### `era` and `eraYear` getters in 262 ([#2169](https://github.com/tc39/proposal-temporal/issues/2169))
- PFC: Would it be so bad to just include the `era` and `eraYear` getters in 262, since 262 allows supporting a subset of the 402 calendars?
- SFC: Somewhat relevant is the Chinese calendar which may actually have other fields that are not `era` and `eraYear`, for the cycle and the cycle year which isn't relevant to any other calendar. It's not really transferable. `era` and `eraYear` don't exist on the Chinese calendar or the ISO calendar for that matter. So even if we add them to 262, that doesn't really solve the problem. That would put us in the situation where if Intl wants to specify a new calendar, they have to go to 262 and ask for the field to be added.
- PFC: I can see the problems with that approach as well.
- SFC: `era` and `eraYear` are different enough from cycle and cycle year that they really don't merit being stuffed into the same property. If you treated it like eras you'd have to choose an epoch, while cycles are more like weeks in that regard - nobody thinks in terms of week number since the epoch.

### Order of fields in Duration Record Fields table ([#2286](https://github.com/tc39/proposal-temporal/issues/2286))
- PFC: I don't really understand this issue.
- RGN: Maybe one of the algorithms depends on ordering?
- SFC: The issue here is that with Date we read the fields in alphabetical order because we don't want to be in the business of putting custom calendar fields in order of magnitude. With Duration that problem doesn't exist, so we could read them in order of magnitude. So the question is should we really have alphabetical order for Duration? That's my understanding of the issue.
- RGN: There's a third option that corresponds to PR [#2245](https://github.com/tc39/proposal-temporal/pull/2245). You make a copy in iteration order and then it doesn't matter in which order you read from the copy.
- PFC: PR [#2245](https://github.com/tc39/proposal-temporal/pull/2245) is still open because I still needs to write tests for it. But I don't think it changes any cases where we say "For each row of Table XX in table order" which is alphabetical. I think it only changes `mergeFields()`.
- RGN: I propose that we change the tables to be in magnitude order. Alphabetical order there is confusing. But in the algorithms, introduce an explicit sorting to the algorithms that iterate over those tables.
- SFC: That seems like a good solution.
- PFC: Would we include custom calendar fields in the sort?
- RGN: Right.
- PFC: And then once we have the list of sorted fields, either make a copy or create a Record, in any case do something that makes further reads unobservable.
- RGN: Right. I'd prefer that we read in source order, but I think there are cases where that's not possible, where you're explicitly looking for information that's not there, or the field is not enumerable. That may not be possible to do consistently one or the other, but I think all cases fit into one of those two approaches.
- PFC: Right, you could not do `mergeFields()` in alphabetical order and you could not do ToTemporalTimeRecord in source order.
