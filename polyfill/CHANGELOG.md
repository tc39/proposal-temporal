## 0.9.0

This version is being released in order to add deprecation warnings.
See https://github.com/tc39/proposal-temporal#polyfills for replacements.

## 0.8.0

This version is being released in order to correspond with the state of the proposal that reached Stage 3.
Expect this polyfill to be replaced by other, more production-ready polyfills.

- All supported calendars are now included in the polyfill. Implementations of some calendars may be slow.
- The previous behaviour of monkeypatching Temporal.Calendar.from() and Temporal.TimeZone.from() to make custom calendars and time zones globally available is no longer supported.
- Month codes are now formatted as `"M03"` or (`"M03L"` for a leap month) instead of `"3"`
- Calendar annotations in ISO strings are now formatted as `[u-ca=name]` instead of `[u-ca-name]`
- Renamed `nearest` rounding mode to `halfExpand`
- Removed Symbol.species from all types
- Methods that return an instance of the class that they belong to will now always return an instance of the Temporal class, even if the method is invoked on a subclass of it
- Removed constructor parameters from Temporal.Calendar.dateFromFields(), Temporal.Calendar.monthDayFromFields(), Temporal.Calendar.yearMonthFromFields(), Temporal.Calendar.dateAdd(), and Temporal.Calendar.dateUntil()
- compare() methods no longer take the calendar or time zone into account
- Temporal.Calendar.fields() may accept an iterable instead of an array as its argument
- Custom calendar implementations may return an iterable instead of an array from Temporal.Calendar.fields()
- Custom time zone implementations may return an iterable instead of an array from Temporal.TimeZone.getPossibleInstantsFor()

## 0.7.0

- New APIs:
  - Temporal.Calendar.era
  - Temporal.Calendar.eraYear
  - Temporal.Calendar.mergeFields
  - Temporal.Calendar.monthCode
  - Temporal.Calendar.toJSON
  - Temporal.PlainDate.era
  - Temporal.PlainDate.eraYear
  - Temporal.PlainDate.monthCode
  - Temporal.PlainDateTime.era
  - Temporal.PlainDateTime.eraYear
  - Temporal.PlainDateTime.monthCode
  - Temporal.PlainMonthDay.monthCode
  - Temporal.PlainYearMonth.era
  - Temporal.PlainYearMonth.eraYear
  - Temporal.PlainYearMonth.monthCode
  - Temporal.PlainZonedDateTime.era
  - Temporal.PlainZonedDateTime.eraYear
  - Temporal.PlainZonedDateTime.monthCode
- Removals:
  - Temporal.Duration.getFields
  - Temporal.PlainDate.getFields
  - Temporal.PlainDateTime.getFields
  - Temporal.PlainMonthDay.getFields
  - Temporal.PlainTime.getFields
  - Temporal.PlainYearMonth.getFields
  - Temporal.ZonedDateTime.getFields
- Removed the options argument from Temporal.PlainTime.add() and Temporal.PlainTime.subtract().
- Temporal.Duration.toString() gains `fractionalSecondDigits`,
  `smallestUnit`, and `roundingMode` options to control the precision
  used in the output string.
- The form of the calendar annotation in ISO strings is changed from `[c=calendar]` to `[u-ca-calendar]`.

## 0.6.0

- API renames:
  - Temporal.TimeZone.getDateTimeFor -> Temporal.TimeZone.getPlainDateTimeFor
- New APIs:
  - Temporal.Duration.compare
  - Temporal.PlainDateTime.withPlainDate
  - Temporal.PlainDateTime.withPlainTime
  - Temporal.ZonedDateTime.offsetNanoseconds
  - Temporal.ZonedDateTime.withPlainDate
  - Temporal.ZonedDateTime.withPlainTime
- Removals:
  - Temporal.PlainTime.withCalendar
- Removed the options argument from Temporal.PlainMonthDay.toPlainDate(), Temporal.PlainDate.toZonedDateTime(), Temporal.PlainTime.toZonedDateTime().
- with() methods no longer accept strings as their first argument.
- The default for the roundingMode option in until()/since() methods is now 'trunc'.
- The `time` property in the first argument of Temporal.PlainDate.toZonedDateTime() is renamed to `plainTime`.
- The `date` property in the first argument of Temporal.PlainTime.toZonedDateTime() is renamed to `plainDate`.
- Temporal.Duration.add(), Temporal.Duration.subtract(), Temporal.Duration.round(), and Temporal.Duration.total() now accept a Temporal.ZonedDateTime, or a value convertible to one, as the `relativeTo` option.
- Temporal.PlainTime may now only have an 'iso8601' calendar. The calendar argument is removed from its constructor.

## 0.5.0

- API renames:
  - Temporal.Calendar.dateDifference -> Temporal.Calendar.dateUntil
  - Temporal.Calendar.datePlus -> Temporal.Calendar.dateAdd
  - Temporal.Calendar.isLeapYear -> Temporal.Calendar.inLeapYear
  - Temporal.Date -> Temporal.PlainDate
  - Temporal.Date.difference -> Temporal.PlainDate.since
  - Temporal.Date.isLeapYear -> Temporal.PlainDate.inLeapYear
  - Temporal.Date.minus -> Temporal.PlainDate.subtract
  - Temporal.Date.plus -> Temporal.PlainDate.add
  - Temporal.Date.toDateTime -> Temporal.PlainDate.toPlainDateTime
  - Temporal.Date.toMonthDay -> Temporal.PlainDate.toPlainMonthDay
  - Temporal.Date.toYearMonth -> Temporal.PlainDate.toPlainYearMonth
  - Temporal.DateTime -> Temporal.PlainDateTime
  - Temporal.DateTime.difference -> Temporal.PlainDateTime.since
  - Temporal.DateTime.isLeapYear -> Temporal.PlainDateTime.inLeapYear
  - Temporal.DateTime.minus -> Temporal.PlainDateTime.subtract
  - Temporal.DateTime.plus -> Temporal.PlainDateTime.add
  - Temporal.DateTime.toDate -> Temporal.PlainDateTime.toPlainDate
  - Temporal.DateTime.toMonthDay -> Temporal.PlainDateTime.toPlainMonthDay
  - Temporal.DateTime.toTime -> Temporal.PlainDateTime.toPlainTime
  - Temporal.DateTime.toYearMonth -> Temporal.PlainDateTime.toPlainYearMonth
  - Temporal.Duration.minus -> Temporal.Duration.subtract
  - Temporal.Duration.plus -> Temporal.Duration.add
  - Temporal.Instant.difference -> Temporal.Instant.since
  - Temporal.Instant.getEpochMicroseconds (method) -> Temporal.Instant.epochMicroseconds (property)
  - Temporal.Instant.getEpochMilliseconds (method) -> Temporal.Instant.epochMilliseconds (property)
  - Temporal.Instant.getEpochNanoseconds (method) -> Temporal.Instant.epochNanoseconds (property)
  - Temporal.Instant.getEpochSeconds (method) -> Temporal.Instant.epochSeconds (property)
  - Temporal.Instant.minus -> Temporal.Instant.subtract
  - Temporal.Instant.plus -> Temporal.Instant.add
  - Temporal.MonthDay -> Temporal.PlainMonthDay
  - Temporal.MonthDay.toDateInYear -> Temporal.MonthDay.toPlainDate
  - Temporal.now.time -> Temporal.now.plainTimeISO
  - Temporal.Time -> Temporal.PlainTime
  - Temporal.Time.difference -> Temporal.PlainTime.since
  - Temporal.Time.minus -> Temporal.PlainTime.subtract
  - Temporal.Time.plus -> Temporal.PlainTime.add
  - Temporal.Time.toDateTime -> Temporal.PlainTime.toPlainDateTime
  - Temporal.TimeZone.name -> Temporal.TimeZone.id
  - Temporal.YearMonth -> Temporal.PlainYearMonth
  - Temporal.YearMonth.difference -> Temporal.PlainYearMonth.since
  - Temporal.YearMonth.isLeapYear -> Temporal.PlainYearMonth.inLeapYear
  - Temporal.YearMonth.minus -> Temporal.PlainYearMonth.subtract
  - Temporal.YearMonth.plus -> Temporal.PlainYearMonth.add
  - Temporal.YearMonth.toDateOnDay -> Temporal.PlainYearMonth.toPlainDate
- New APIs:
  - Temporal.Calendar.fields
  - Temporal.Duration.blank
  - Temporal.Duration.round
  - Temporal.Duration.total
  - Temporal.Instant.toZonedDateTime
  - Temporal.Instant.toZonedDateTimeISO
  - Temporal.Instant.until
  - Temporal.now.plainDateISO
  - Temporal.now.plainDateTimeISO
  - Temporal.now.zonedDateTime
  - Temporal.now.zonedDateTimeISO
  - Temporal.PlainDate.until
  - Temporal.PlainDateTime.toZonedDateTime
  - Temporal.PlainDateTime.until
  - Temporal.PlainTime.until
  - Temporal.PlainYearMonth.until
  - Temporal.ZonedDateTime
- Removals:
  - Temporal.Calendar.dateMinus
  - Temporal.DateTime.toInstant
  - Temporal.Instant.toDateTime
- Conversion methods that add information, such as
  Temporal.PlainYearMonth.toPlainDate(), now always take a property bag
  with the fields to add.
- Temporal.Instant.toString() now takes one argument, an options bag.
  The time zone may be specified as the value of the `timeZone` property
  in this argument.
- The toString() methods of Temporal.PlainDate, Temporal.PlainDateTime,
  Temporal.PlainMonthDay, Temporal.PlainTime, and
  Temporal.PlainYearMonth now take a `calendar` property which controls
  whether to include the calendar annotation in the string.
- The `overflow` option has been removed from Temporal.Duration.add()
  and Temporal.Duration.subtract().
- Temporal.Instant.toString(), Temporal.PlainDateTime.toString(), and
  Temporal.PlainTime.toString() gain `fractionalSecondDigits`,
  `smallestUnit`, and `roundingMode` options to control the precision
  used in the output string.
- The options argument is removed from Temporal.Duration.from() and Temporal.Duration.with().
- In general, property bags and strings are allowed as arguments
  wherever Temporal objects are accepted.

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
- The 'disambiguation' option is renamed to 'overflow' in context where
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
