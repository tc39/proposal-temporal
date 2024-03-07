# January 11, 2024

## Attendees
- Philip Chimento (PFC)
- Richard Gibson (RGN)

## Agenda

### Compatibility with Java date arithmetic ([#2535](https://github.com/tc39/proposal-temporal/issues/2535))
- We will try to talk about this next week in a larger group.

### All return values of SystemInstant must be distinct? [#2713 (comment)](https://github.com/tc39/proposal-temporal/issues/2713#issuecomment-1831541199)
- We don't think this is actionable. We wonder if it's theoretically possible for SystemInstant to be called in the same nanosecond from two different Worker threads. Anyway, if HTML wants to implement always-distinct return values, they could do so in the host hook.

### weekOfYear/yearOfWeek for non-ISO calendars ([#2744](https://github.com/tc39/proposal-temporal/issues/2744))
- RGN: What are the possibilities? Throw, sentinel value such as undefined/NaN?
- PFC: Always the ISO week?
- RGN: That seems like the worst of the possibilities. We can conceive of situations where someone might want the ISO week, but that's best achieved with a calendar conversion.
- RGN: Second question, is it required for the non-ISO calendar to send this signal about invalid data?
- PFC: It's possible that human calendars have week numbers. For example, the Gregorian calendar might use the ISO week numbers.
- RGN: My preference would be the exception. That seems like something you really don't want to slip through.
- PFC: I see your point, we don't want apps to say "Welcome to week undefined!" On the other hand, we don't want apps to break in production when they are opened by someone whose calendar doesn't have week numbers.
- RGN: In that case the app is essentially broken anyway. I don't have too strong of an opinion about this but I do feel strongly that it should not be null because `+null === 0`.
- PFC: I'm thinking that falling back to the ISO week numbers, if the calendar doesn't have its own week numbering system, might be the best for end users.
- RGN: I don't really like that, it seems like subtle bugs might come out of that even though I don't yet understand how.
- PFC: I don't like either of the exception or sentinel value — both seem like they will not be caught in development, only in production.
- RGN: Do any of the other calendar operations throw here?
- PFC: CalendarDateEra and CalendarDateEraYear return undefined if the calendar has no eras.
- RGN: I'm all for that, then.
- PFC: Another option could be 0 for weekOfYear and the year for yearOfWeek.
- RGN: I'd prefer undefined. 0 could be a valid week number in a calendar, potentially.
- Other things we discussed:
    - Calendars that do have non-ISO weeks should share that data in CLDR
    - If using TypeScript, the undefined value will be easy to catch
- Conclusion: PFC to prepare a normative change for this.
