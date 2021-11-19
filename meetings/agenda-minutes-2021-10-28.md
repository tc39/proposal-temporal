# October 28, 2021

## Attendees:
- Frank Yung-Fong Tang (FYT)
- Sarah Hennigh-Palermo (SHO)
- Shane Carr (SFC)
- Justin Grant (JGT)
- Philip Chimento (PFC)

## Agenda:

### TimeZone GetNextTransition / GetPreviousTransition for far-future and far-past dates ([#60](https://github.com/js-temporal/polyfill/issues/60) in polyfill repo)
- JGT: I'm assuming the native implementations of getNextTransition and getPreviousTransition don't have this loop, that it's O(1), so non-polyfill implementations wouldn't have this opportunity for denial of service.
- SFC: My understanding is that the TZDB has a rules file for future dates, so it should be a cheap operation. If there's an expensive operation, you can always give it some input that will make it take a long time, so I'm not sure what the issue is.
- JGT: Mostly I'm looking for advice for what we think is a good workaround here.
- FYT: Native implementations loop through a limited number of rulesets, so there's a lot fewer things to iterate through. So at the spec level I don't think it's an issue.
- JGT: Good to know. I think in the production polyfill we could diverge from the spec and just throw if the value is too far in the future.

### Inconsistent brand checks in TimeZone ([#1692](https://github.com/tc39/proposal-temporal/issues/1692))
- Decision to be made: support the case described in the comment?
- FYT: What is intended to be supported here?
- PFC: We want to support custom time zones via `extends Temporal.TimeZone`, and via plain objects. I'm not sure if those logically require us to support this case as well.
- FYT: It's odd that these methods don't have brand checks.
- JGT: Is it because these methods are not required to implement, or something else?
- PFC: I think it's a leftover from a way that it used to work. Reading the code sample more carefully I think the operative thing here that we're deciding to support is `Temporal.TimeZone.prototype.toJSON.call(...)`. I guess that is a pretty rare use case.
- JGT: To be clear, the methods are still optional if you inherit?
- PFC: If you inherit `Temporal.TimeZone`, everything is fine. If you use a plain object, everything is also fine, because nothing inside Temporal calls toJSON. What you can't do if we change this, is call the `Temporal.TimeZone.prototype.toJSON` method with a plain-object time zone as the receiver.
- JGT: The advantage of doing a brand check is that we can remove it later without breaking the web.
- PFC: As long as there's at least one method with a brand check, so that callers can test against that.
- FYT: Currently it's half and half.
- Consensus to make this consistent, in favour of adding the brand checks.

### Ambiguous PlainTime formats ([#1765](https://github.com/tc39/proposal-temporal/issues/1765))
- Decision to be made: accept the proposal as described in the comment?
- JGT: If the ISO 8601 spec says so, then we should do it.
- PFC: It says that we should do it if there's a risk of ambiguity, so the decision is whether there's a risk of ambiguity. I think there is now that we support strings in more places.
- FYT: Is it important to support without the colon?
- PFC: ISO calls these Basic and Extended format. I can't remember whether it's required or "by-mutual-agreement", but I think it's good that we support both.
- SFC: This seems like a good thing to do, but I'd be interested to see what exactly changes in the spec. Is it the case that a PlainTime string will have to have either a colon or a T?
- PFC: What changes is that now a PlainTime string with no colon and no T will be rejected.
- FYT: I believe the T syntax is not supported in our grammar.
- SFC: That's a bug then. ISO says the T is allowed but not required.
- JGT: If ISO says it's allowed and we don't allow it, then we should fix that.
- Consensus to go with the proposal in the comment.
- PFC: The other, more minor issue, is `PlainTime.from('2020-01-01')` gives you midnight.
- JGT: I see it as a layer where a lower layer parses the string and gives back any components that are present, and a higher layer throws if the required components are not present.
- PFC: I could see that is parallel with `PlainTime.from({year: 2020, month:1, day: 1})`, which also throws. I could go either way.
- SHO: It seems like not throwing is better for people who would expect to default to midnight here.
- JGT: I think this would usually be a bug.
- PFC: Not sure about usually; I think there are valid cases for passing a date string and expecting midnight. It'd be consistent with calling `PlainDateTime.from(...).toPlainTime()`.
- JGT: I think my opinion would still be the same. We recently changed the `Z` string because the string and the property bag disagreed.
- SFC: I think either of the two behaviours is reasonable, fine, and predictable. Is it easier, or worse for developers, if we throw? It could be more friendly not to throw, or it could be better to let them know.
- JGT: The worst outcome is if a real bug is being hidden by not throwing. I could imagine a case where you are getting the wrong string from an external source, and instead of throwing you silently always get midnight. If you do want the behaviour, the workaround is super simple.
- PFC: One approach we could take is to not change this unless we have a smoking gun bug like we did in the `Z` string case.
- SFC: I think all three strings mentioned in the OP should throw or not throw.
- PFC: Not sure I agree; in `2020-01` we never default days to 1 anywhere, but we do always default times to midnight.
- JGT: Unlike in the `Z` string case, where we were sure where the bugs would come from, we aren't sure here. But maybe it's better to be more restrictive now because it's reversible later, which being more permissive now would not.
- SHO: Counter intuition as a practitioner, if I want things to throw then I want them to throw all the time. So if we don't think people will get mixed dates and datetime strings then we should throw.
- JGT: To add to that, I'm not aware of a database that would output mixed date and datetime strings from a datetime data source. The rule of thumb could be, if you want the time to default to midnight, then parse it with PlainDateTime.
- Consensus:
  - Accept `T` for time strings (case insensitive)
  - Time strings that are ambiguous (meaning they would be accepted by PlainDate.from, PlainYearMonth.from, or PlainMonthDay.from) should throw if there's no `T` (case insensitive) prefix
  - Case (2) includes `2020-01-01`. It's a valid PlainDate so it's invalid as a PlainTime string.

### Missing ‘offset’ in ToTemporalZonedDateTime ([#1892](https://github.com/tc39/proposal-temporal/issues/1892) / [#1893](https://github.com/tc39/proposal-temporal/issues/1893))
- Approved this morning.

### Calendar is not part of TemporalTimeString ([test262#3256](https://github.com/tc39/test262/issues/3256))
- FYT: Need to confirm if this is a spec bug or a test262 bug.
If this is not a spec bug, then please confirm on [test262/pull/3257](https://github.com/tc39/test262/pull/3257). 
- PFC: I think this is a spec bug, because we should be able to pass a PlainDateTime string as long as it has a time in it, and that may include a calendar annotation.
- SFC: Yes, this is a bug.
- PFC: The one thing I'm not sure about is whether to accept a string like `T09:48[u-ca=iso8601]`.
- JGT: Java has the concept of a time string with a time zone annotation, so in parallel with that I don't think we should throw in that case.
- PFC: But should we throw if the calendar is not ISO?
- JGT: Never mind, I was thinking about time zones.
- PFC: I guess we need to parse the annotations, and ignore annotations that we don't recognize, which means we should recognize the calendar one, which means we have to throw if the calendar is not ISO.
- JGT: I don't feel strongly. Not accepting it is another decision that's reversible.
- PFC: Neither do I feel strongly about this, but I do feel strongly about not backing ourselves into a corner with adding time calendars.
- Consensus:
  - Accept calendar annotations in date-time strings in any case
  - Accept calendar annotations in time-only strings, but throw if the calendar is not ISO

### Time zone annotation is ignored in input ISO string ([test262#3265](https://github.com/tc39/test262/issues/3265))
- FYT: If this is not a spec bug, then please confirm on [test262#3265](https://github.com/tc39/test262/issues/3265).  
- JGT: I think Instant should not care about the meaning behind the IANA annotation.
- FYT: Currently the parsing routine does canonicalization, but before that it does validation. Should that be in there?
- JGT: I don't think we should constrain the implementation to do an expensive lookup here.
- PFC: I agree the test is correct here and there's a bug in the spec.
- SFC: Ignoring the parts that are not relevant is our general principle, not just here.
- FYT: It'd be clearer to make a distinction in the spec text between parsing a time zone in order to construct a time zone, and parsing it in order to construct something else.
- JGT: And consider changing calendars if they are structured the same. Doesn't look like an issue, though.
- Consensus: change the spec to make the test correct.

### Duration.toString with `fractionalSecondDigits` while s = ms = µs = ns = 0 (#1763)
- Decision to be made: keep the status quo or not?
- FYT: This output is for machines to parse, not humans to read. If the caller puts `fractionalSecondDigits`, then we should assume they want the zeroes.
- SFC: One use case for `fractionalSecondDigits` is that the caller wants to indicate how precise their duration is. So if the caller provides `fractionalSecondDigits: 2`, that's how precise their data is, even if it's `P3Y`.
- JGT: I think the purpose of that is to protect the receiver of the data from receiving more precision than they can handle.
- SFC: The other argument for outputting the zeroes is that the user requested it.
- JGT: For other types, if there's no data for seconds, the zeroes are not printed.
- PFC: That's because in other toString methods, `smallestUnit: 'minutes'` and `fractionalSecondDigits` conflict, and we decided that `smallestUnit` wins. Here there's no conflict.
- JGT: Is the intent of `fractionalSecondDigits` a ceiling or a floor?
- SFC: My opinion is `fractionalSecondDigits` is both minimum and maximum. Intl.NumberFormat, Intl.DurationFormat, Intl.DateTimeFormat all treat it that way. If the programmer wants to enforce a maximum fractional digits, they can use the round() method.
- FYT: Agreed.
- (Testing what Intl.DateTimeFormat currently does)
- JGT: If you have one of these behaviours, and you want the other one, how hard is it to get the other one?
- PFC: If `fractionalSecondDigits` shows the zeroes and you don't want that, you can do `d.round({ ... }).toString()`. The other way around, there isn't currently a way to get the trailing zeroes behaviour other than `fractionalSecondDigits`.
- JGT: Are there consumers of duration strings that will not accept duration strings unless they have seconds on them?
- SHO: Is it the case that the reason not to elide seconds would be to accommodate callers that can't handle leaving them out?
- SFC: That's not what I meant. I meant the purpose of `fractionalSecondDigits` is to assert the precision of the string
- SHO: Agreed, that makes sense.
- JGT: So if you had `PT22M` you would not be able to use that string if your consumer cares about the precision?
- SFC: Another option is to say that `fractionalSecondDigits` in Duration.toString is flawed, and add a mode to DurationFormat that outputs ISO strings, and you can use all the additional options in DurationFormat. I'm not advocating for that though.
- JGT: That's an interesting idea, what options does Duration.toString have currently?
- PFC: `fractionalSecondDigits` and `smallestUnit`, and unlike other types `smallestUnit` is not allowed to be minute.
- SFC: My opinion would be to keep the status quo and optionally add some of the formatting options from DurationFormat.
- FYT: The status quo is actually different. Step 21 of TemporalDurationToString will generate `P3Y`, not `P3YT0.00S`.
- PFC: We could resolve this by saying that the original question is addressed with the status quo, or we could resolve this by changing the spec since we now know that it's hard to get the other behaviour.
- SFC: What was the original reason for getting the `fractionalSecondDigits`?
- JGT: My opinion is the original goal was to accommodate consumers of the string that couldn't handle the full precision.
- SFC: `smallestUnit` serves that goal.
- JGT: `fractionalSecondDigits` was additionally added to accommodate consumers that could only handle e.g. 2 digits of precision.
- SFC: I think the value you send out should always have that number of digits.
- JGT: My primary goal is constraining the precision if there is more.
- SFC: We could rename the option to `maximumFractionDigits`, then the spec behaviour would be correct. If it's called `fractionalSecondDigits`, it should output that number of digits all the time.
- SHO: I agree. I understand the use case for maximum, though, but you don't want a heterogeneous collection of strings.
- JGT: As long as my use case is met I'm flexible.
- PFC: I think if we just add "precision is not "auto"" to the spec it will be sufficient here.
- Consensus: make this change.
