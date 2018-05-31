# Temporal Polyfill

This is an implementation of a polyfill for the [TC39 Termporal Proposal](https://github.com/tc39/proposal-temporal).

## Implementation Issues:

## Proposed Changes / Additions to the Proposal

### `Instant` constructor to take single `BigInt` argument

### `Instant.toDate()` & `Instant.fromDate()` for interoperability with `Date()`

### `Instant.prototype.valueOf()` & `ZonedInstant.prototype.valueOf()`

To facilitate comparisons between `Intant`s and/or `ZonedInstant`s it would be extremely useful to implement `valueOf()`.
Considering the fact that these have nanosecond precision, the proposed `[BigInt](https://github.com/tc39/proposal-bigint)`
seems to be the right choice of primitive.

### `Instant.prototype.toDate()` & `ZonedInstant.prototype.toDate()`

To facilitate better interoperation with existing `Date` APIs it would be useful to add a casting method to
`Instant` & `ZonedInstant`.

An example of such APIs would be the `Intl.DateTimeFormat` apis which work well with Dates, but not (yet?) with `Instant` &
`ZonedInstant`. Though for this specific case it might be better to add `format()` (see below).

### `Instant.prototype.format(locale = navigator.language, options = {})` & `ZonedInstant.prototype.format(locale = navigator.language, options = {})`

Considering the frequency of converting date/time values to customized strings, the `format` convenience method seems
to make sense. It should follow the same signature as `Intl.DateTimeFormat.prototype.format` with the notable exception
that `locale` ise defaulted to `navigator.language` and the `timeZone` option is overriddent to the `ZonedInstant`'s time
zone or UTC for `Instant`s.

### static `Instant.now()`

This would facilitate easier creation of Instant objects eliminating the need to work with `Date` objects. In addition,
when implemented natively, this would enable a higher precision timer.
