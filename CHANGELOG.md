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
