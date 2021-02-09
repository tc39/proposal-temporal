# Dec 17, 2020

## Attendees
- Justin Grant (JGT)
- Richard Gibson (RGN)
- Shane F. Carr (SFC)
- Philipp Dunkel (PDL)

## Agenda

### Invalid non-numeric field values should throw [#1228](https://github.com/tc39/proposal-temporal/issues/1228)
- The current behavior is bad. `"5L"` should not coerce to 1.
- Coercion from string to number is OK, but only if the resulting number exactly matches the original string.
- The calendar should be doing the checking and coercing.

### Document whether Calendar's `dayOfWeek`, `dayOfYear` , and `weekOfYear` methods are 0-based or 1-based [#1225](https://github.com/tc39/proposal-temporal/issues/1225)
- Unless there's a strong compelling reason not to, calendars should match ISO 8601 behavior for `dayOfWeek`, `dayOfYear`, and `weekOfYear`, including being 1-based. The reason for this invariant is to enable cross-calendar code:
  - "Is this the first day of the year?"
  - "Is this the first week of the year?"
  - Store an array of all days of the week, indexed by `dayOfWeek - 1`
- In Temporal, it is a strong convention that sequences (like `dayOfWeek`, `dayOfYear`, and `weekOfYear`) will be consecutive `Number`s starting with 1, and will have meaning that matches (as closely as possible) the ISO 8601 spec.
- All built-in Temporal/Intl calendars will follow this convention.
- Library authors can depend on this convention, but it won't be enforced by Temporal.
- Calendar authors who break the convention should expect that existing code (e.g. libraries) may break if they don't follow the convention.

### Safer handling of negative years in non-ISO calendars [#1231](https://github.com/tc39/proposal-temporal/issues/1231)
- No consensus on this yet.
- One idea is making `year` into a signed year and adding an additional `eraYear` property.
- Downsides of an additional `eraYear` property: complexity, and if developers are (incorrectly) directly showing Temporal property values to users instead of going through `toLocaleString` or similar Intl APIs, then this change would break those apps for far-past dates or for calendars like `"japanese"` or `"roc"` where era changes happened relatively recently.