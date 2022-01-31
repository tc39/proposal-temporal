# January 20, 2022
## Attendees
- Richard Gibson (RGN)
- Justin Grant (JGT)
- Jesse Alama (JMN)
- Shane F. Carr (SFC)
- Philip Chimento (PFC)

## Agenda
### Specifying calendar operations ([#1899](https://github.com/tc39/proposal-temporal/issues/1899))
- PFC: USA says he'll have an update next week

### Mathematical values on Duration ([#1604](https://github.com/tc39/proposal-temporal/issues/1604))
- (SYG wrote some feedback in the issue)
- PFC: I joined the editors call last week, SYG actually changed his opinion and the rest of the editors concurred. It's OK to store integer Number values in the internal slots, which is what we already do. We just have to make sure that there is no type confusion in the spec, which I believe there still is some. They'll still talk about it in an upcoming meeting.
- JGT: Does this affect whether we should put in bounds on Duration values in order to help implementors optimize?
- PFC: It shouldn't affect that, that can still be a separate question that we work out with implementors. That said I don't see a clear benefit right now to putting in bounds other than the ones we naturally have on Number values, but maybe we can get more feedback from implementors.
- JGT: Still need to resolve ["-0 in Temporal.Duration.prototype.negated ( ) ???" (#1715)](https://github.com/tc39/proposal-temporal/issues/1715)
- PFC: Will ask this at the editor call next week.

### In toLocaleString() options, property-bag form of calendar and timeZone will throw ([#2005](https://github.com/tc39/proposal-temporal/issues/2005))
- SFC agrees with JGT in the issue.
- SFC: Temporal is part of 262, and 402 assumes 262 exists, so it makes sense to accept these objects in 402.
- JGT: Should we add this to the Temporal spec?
- SFC: It makes sense to go in the 402 annex of the Temporal proposal. By the way, I found that some people in TG2 are not aware of the 402 annex of this proposal. One of us should give a presentation in TG2 about this annex.
- PFC: I can do that.
- SFC: I'll add Temporal and particularly this issue to the agenda of TG2 in February.

### `YYYY-MM[u-ca=iso8601]` and `MM-DD[u-ca=iso8601]` formats are not round-trippable ([#1971](https://github.com/tc39/proposal-temporal/issues/1971))
- PFC: Does anyone remember whether emitting these strings was intentional?
- SFC: I don't remember discussing this case. It seems to me that `YYYY-MM-DD[calendar]` is the right thing to print if `calendarName` is given, or we should accept `MM-DD[calendar]`. Allowing the short syntax for the ISO calendar is a convenience thing, but in the general case we need the year to disambiguate.
- JGT: Agreed.
- PFC: Agreed.
- Consensus: Emit the `YYYY-MM-DD` if we emit the calendar.

### IETF status
- SFC: Not a lot of progress since USA's last update a couple weeks ago. We had a SEDATE meeting in December and will have another next month. Namespacing continues to elude consensus, but we did reach consensus for USA and Carsten Bormann (co-champion) to create a draft that will be discussed next month. It's moving at standards speed.
- JGT: I was most worried about disagreement on how conflicts between offsets and time zones should be handled.
- SFC: There was discussion on that on the mailing list, but that doesn't affect the syntax.
- JGT: It would affect the behaviour of Temporal though. The namespacing doesn't affect us that much, this would though. I'm concerned that the working group might want a different default for the offset-time zone resolution.
- SFC: These are good questions and I'll talk to USA about the next meeting.
