# Temporal Polyfill

This is an implementation of a polyfill for the [TC39 Termporal Proposal](https://github.com/tc39/proposal-temporal).

## Implementation Issues:

## Proposed Changes / Additions to the Proposal

### `Instant.prototype.format(locale = navigator.language, options = {})` & `ZonedInstant.prototype.format(locale = navigator.language, options = {})`

Considering the frequency of converting date/time values to customized strings, the `format`
convenience method seems to make sense. It should follow the same signature as
`Intl.DateTimeFormat.prototype.format` with the notable exception that `locale` is defaulted
to `navigator.language` and the `timeZone` option is overriddent to the `ZonedInstant`'s time
zone or UTC for `Instant`s.
