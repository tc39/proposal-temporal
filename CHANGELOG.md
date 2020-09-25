## 0.4.0

- API renames:
  - Temporal.Absolute -> Temporal.Instant
  - Temporal.Calendar.plus -> Temporal.Calendar.datePlus
  - Temporal.Calendar.minus -> Temporal.Calendar.dateMinus
  - Temporal.Calendar.difference -> Temporal.Calendar.dateDifference
  - Temporal.Date.getISOCalendarFields -> Temporal.Date.getISOFields
  - Temporal.DateTime.getISOCalendarFields -> Temporal.DateTime.getISOFields
  - Temporal.MonthDay.getISOCalendarFields -> Temporal.MonthDay.getISOFields
  - Temporal.Time.getISOCalendarFields -> Temporal.Time.getISOFields
  - Temporal.YearMonth.getISOCalendarFields -> Temporal.YearMonth.getISOFields
- New APIs:
  - Temporal.Calendar.daysInWeek
  - Temporal.Calendar.monthsInYear
  - Temporal.Date.daysInWeek
  - Temporal.Date.monthsInYear
  - Temporal.DateTime.daysInWeek
  - Temporal.DateTime.monthsInYear
  - Temporal.DateTime.round
  - Temporal.Duration.abs
  - Temporal.Duration.negated
  - Temporal.Instant.round
  - Temporal.Time.round
  - Temporal.YearMonth.monthsInYear
- Temporal.Durations are now allowed to be negative. Mixed signs are not
  allowed, all fields of Temporal.Duration must have the same sign.
- If `a.difference(b)` is positive, then `b.difference(a)` is the same
  duration but negative, and vice versa.
- The 'disambiguation' option is renamed to 'overflow' in contextx where
  it refers to out-of-range values. (It's still called 'disambiguation'
  in the context of time zones.)
- Temporal.Instant.plus and Temporal.Instant.minus now do not allow
  weeks units in their Temporal.Duration arguments.
- Temporal.Instant.difference, Temporal.DateTime.difference, and
  Temporal.Time.difference now accept milliseconds, microseconds, and
  nanoseconds as values for largestUnit, and also accept the rounding
  options smallestUnit, roundingIncrement, and roundingMode.
- Temporal.Time.difference now does not accept years, months, weeks, or
  days as values for largestUnit.
- Temporal.Date.toDateTime's Temporal.Time argument defaults to
  midnight.
- Temporal.Duration's overflow options no longer allow 'reject', since
  it was the same as 'constrain'.
- Throw in more cases when trying to do an operation on two Temporal
  objects with different calendars.
- The polyfill now does not automatically copy Temporal to the global
  object. We do not want `if (typeof Temporal === undefined)` checks
  appearing in the wild, because this could break the web when Temporal
  is shipped by browsers. If you are using this polyfill, make sure to
  import the object yourself.
- Bug and edge case fixes.

## 0.3.1

- Bug fixes.

## 0.3.0

- Bug fixes.
- For Temporal.Date, Temporal.DateTime, and Temporal.YearMonth, now
  disambiguation only applies to when the fields are internally
  inconsistent. If the value is outside of the representable range, a
  RangeError is always thrown.
- API renames:
  - Temporal.Absolute.inTimeZone -> Temporal.Absolute.toDateTime
  - Temporal.Date.getMonthDay -> Temporal.Date.toMonthDay
  - Temporal.Date.getYearMonth -> Temporal.Date.toYearMonth
  - Temporal.Date.withTime -> Temporal.Date.toDateTime
  - Temporal.DateTime.getDate -> Temporal.DateTime.toDate
  - Temporal.DateTime.getMonthDay -> Temporal.DateTime.toMonthDay
  - Temporal.DateTime.getTime -> Temporal.DateTime.toTime
  - Temporal.DateTime.getYearMonth -> Temporal.DateTime.toYearMonth
  - Temporal.DateTime.inTimeZone -> Temporal.DateTime.toAbsolute
  - Temporal.MonthDay.withYear -> Temporal.MonthDay.toDateInYear
  - Temporal.Time.withDate -> Temporal.Time.toDateTime
  - Temporal.YearMonth.withDay -> Temporal.YearMonth.toDateOnDay
- Disambiguation option added to Temporal.MonthDay.toDateInYear.
- UMD module now included in distribution.
- Better output formatting in the Node.js REPL.
- Smaller bundle size.

## 0.2.0

This new version is being released mainly in order to update the README
on npmjs.com to link to the blog post and survey.

API changes:
- { disambiguation: 'compatible' } when converting Absolute->DateTime

## 0.1.0

Initial release.
