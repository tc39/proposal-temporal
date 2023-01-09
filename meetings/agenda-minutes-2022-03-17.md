# March 17, 2022

## Attendees
- Shane F. Carr (SFC)
- Ujjwal Sharma (USA)
- Philip Chimento (PFC)
- Justin Grant (JGT)
- Richard Gibson (RGN)

## Agenda

### IETF status
- USA: Our session is the first one in the afternoon on Monday (2022-03-21T12:00Z). Open threads have been closed off and I hope we can reach some tentative consensus in this meeting and close all discussion items for good. Open question is about the liaison, I can ask about this more emphatically on the mailing list.
- JGT: I have seen a resolution to the brackets issue, but not the "how to deal with conflicts" issue. That one hasn't been active in a while.
- USA: I can DM Bron Gondwana about this. But Temporal is in a special position about this issue, because we can give the choice to the developer, which some of these other applications can't.
- JGT: Agreed, as long as we can give the choice, the default doesn't matter that much. Would we change our default for `ZonedDateTime.from()` if the default in IETF was that the offset always wins?
- RGN: There's no point in doing this until the draft is settled.
- USA: Offset-wins is the only default that makes sense to put in the standard.
- RGN: I disagree. The case has been made for future dates to trust the annotation over the offset when conflicts occur.
- USA: I think the IETF will probably push for offset-wins and it's OK for us to follow that default if it's the case.
- JGT: Do we need to have some explicit escape hatch in the draft that allows us to give the choice to the developer?
- USA: I don't think so. It applies to non-interactive interpretation of a timestamp, Temporal is an interactive environment.

**Consensus:** We are OK with the default behaviour in the draft being either offset-wins or conflicts-not-allowed, and will change the default behaviour of `ZonedDateTime.from()` (if no option is specified) accordingly.

### ECMA 402 spec update ([#1928](https://github.com/tc39/proposal-temporal/issues/1928))
- USA: Will fix the linter issue expediently and open an issue in ecmarkup.

### Return value of `Duration.prototype.total()` when the result is not representable as a Number ([#2079](https://github.com/tc39/proposal-temporal/issues/2079))
- PFC: This was not correctly specified so it led to an assertion failure in the spec. The polyfill has a behaviour already.
- SFC: Could `total()` return BigInt?
- JGT: It can return non-integer values.
- JGT: Why would we not have bounds on the Duration fields so that this situation wouldn't occur?
- SFC: I think it's better for any throwing behaviour to happen in constructors. Throwing in `total()` here could be considered a data-driven exception. I'd rather downsample to a representable Number.
- RGN: I've proposed in the past that the limit for a Duration be the difference between the earliest and latest possible Instant. That would fix this problem, even if there were precision loss.
- JGT: Agree.
- PFC: I disagree that an edge case like this would justify making a fundamental change to how Duration works. I think we should pick one of the options for this weird unlikely case and move on.
- SFC: I think `Infinity` is the best option here. It avoids the data-driven exception. It would be weird for Number overflow to throw an exception.
- JGT: Why is it a fundamental change to have a limit?
- PFC: It changes the semantics of Duration, implementers have mostly implemented it already, they'd have to check the arbitrary limit everywhere.
- JGT: Presumably checking at construction would only happen in one place. Why not make this case impossible by limiting every field to the equivalent of `Number.MAX_VALUE` in nanoseconds? Otherwise conscientious developers have to check the return value.
- SFC: Conscientious developers have to check the return value anyway, for loss of precision.
- RGN: What cases would require checking for `Infinity`, if we were to return `Infinity` in this situation?
- JGT: For display.
- RGN: Such things occurring in display are annoying, but really only if the input was reasonable. The input wouldn't be reasonable in this case. Displaying `Infinity` is better than `NaN` because `Infinity` has a meaning in informal discourse.
- SFC: If we were not at Stage 3, I'd be more interested in going back and adding limits, but as it is I think we should just fix this case. I'm in favour of `Infinity`.

**Consensus:** Return `Infinity` in this situation.

### Canonical representation for 0000~0999 years in ISO8601 ([#2082](https://github.com/tc39/proposal-temporal/issues/2082))
- JGT: I would prefer to match the Date behaviour because (???)
- SFC: Does legacy Date parse both of the options?
- JGT: Yes, but other systems don't.
- SFC: Those other systems are broken anyway, then.
- PFC: Agreed.
- JGT: My main concern is if people already have code that works with legacy Date, and we have a somewhat arbitrary choice, it's better to match Date.
- SFC: What does ISO say about this?
- PFC: Years before 1582 are not allowed except by mutual agreement of the communicating parties, so it doesn't come up.
- JGT: Would anyone object to changing this?
- PFC: I wouldn't object. But I don't find any of the reasons convincing. Other systems not parsing it would still be broken for years < 0. On the other hand, I don't find PDL's argument for the boundary being at 1000 very convincing either. I guess there could be some weirdness when people port their code from legacy Date to Temporal.
- JGT: I think it's unavoidable that there are some differences, like nanosecond precision, but having this discrepancy in years seems like an own goal.
- SFC: Agreed. The last comment on the thread from Livia Medeiros mentions RFC 3339. Does RFC 3339 not accept extended years?
- JGT: No.
- SFC: It seems undesirable to shrink the space of interoperable dates by 1000 years, then.

**Consensus:** we'll make the proposed change to output 0000-0999 as 4-digit years.

- RGN: Not every engine accepts excess precision in Date.parse, in fact most don't.
- JGT: Can we change Date.parse to handle this in a consistent way?
- SFC: RGN proposed some improvements to Date.parse some time ago, but it was shot down.
- JGT: This seems like a bad compatibility issue.
- RGN: There's still time to put this on the agenda for the plenary.
- PFC: I propose to mention it alongside this PR in my presentation, but not make a rushed proposal.
- RGN: Actually, I typoed. Engines do all accept nanoseconds precision in Date.parse. They treat it slightly differently though.
- JGT: Let's not bring this up in the plenary, then.

### `MIN_VALUE` and `MAX_VALUE` ([#2092](https://github.com/tc39/proposal-temporal/issues/2092))
- PFC: My opinion is this belongs in Temporal V2
- SFC: If we do this, I'd want to do it as in JGT's comment in the issue.
- JGT: I don't think this meets the bar for a Stage 3 change.

**Consensus:** Save this for a follow-on proposal.

### Bug tracker sweep!
Postponed to next time.
