# Calendars in Temporal

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

Much of the world uses the [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar), which was invented in 1582 C.E.
The ISO 8601 standard extends the Gregorian date reckoning backwards ("proleptically") to cover the period of history before its invention, to allow designating dates before 1582.
The ISO 8601 calendar is the system most often used in computing, on the modern Internet.

A significant number of places in the world use another calendar system as the main calendar, or use the Gregorian calendar alongside another calendar system as a commonly-used civil or religious calendar.
Even places that use almost exclusively the Gregorian calendar today, often use a different calendar to denote dates before the invention or adoption of the Gregorian calendar.

### When to use calendars in Temporal

It is best practice to specify a calendar system when performing calendar-sensitive operations, which are those involving arithmetic or other calculation in months or years.

For example, to add a month to a date in the Hebrew calendar:

```javascript
date.withCalendar('hebrew').add({ months: 1 });
```

Temporal types' `toLocaleString()` methods use the user's preferred calendar, without needing to call `withCalendar()`.
To perform arithmetic consistently with the `toLocaleString()` calendar system:

```javascript
const calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
date.withCalendar(calendar).add({ months: 1 });
```

### Invariants Across Calendars

The following "invariants" (statements that are always true) hold for all built-in calendars:

- Any date can be serialized to an object using only four properties: `{ year, month, day, calendar }`
- `year` is always an integer (which may be zero or negative) that increases as time goes forward
- `month` and `day` are always positive integers that increase as time goes forward, except they reset at the boundary of a year or month, respectively
- `month` is always continuous (no gaps)
- `date.month === 1` during the first month of any year, because `month` always represents the order of months in that year.
- `obj.with({ day: 1 })` will always return the first day of the object's month, even if the resulting `day` is not 1.
- `obj.with({ day: Number.MAX_VALUE })` will always return the last day of the object's month.
- `obj.with({ month: 1, day: 1 })` will always return the first day of the object's year.
- `obj.with({ month: obj.monthsInYear, day: Number.MAX_VALUE })` will always return the last day of the object's year.
- `obj.month === obj.monthsInYear` during the last month of any year
- `dayOfWeek`, `dayOfYear`, and `weekOfYear` are 1-based positive integers, that increase consecutively as time goes forward, except they reset at the boundary of a week or year, respectively

### Writing Cross-Calendar Code

Here are best practices for writing code that will work regardless of the calendar used:

- Validate or coerce the calendar of all external input.
  If your code receives a Temporal object from an external source, you should check that its calendar is what you expect, and if you are not prepared to handle other calendars, convert it to the ISO 8601 calendar using `obj.withCalendar('iso8601')`.
  Otherwise, you may end up with unexpected behavior in your app or introduce security or performance issues by introducing an unexpected calendar.
- Use `compare` methods (e.g. `Temporal.PlainDate.compare(date1, '2000-01-01')`) instead of manually comparing individual properties (e.g. `date.year > 2000`) whose meaning may vary across calendars.
- Never compare field values in different calendars.
  A `month` or `year` in one calendar is unrelated to the same property values in another calendar.
  To compare dates across calendars, use the `compare` method.
- When comparing dates for equality that might be in different calendars, convert them both to the same calendar using `withCalendar`.
  The same ISO date in different calendars will return `false` from the `equals` method because the calendars are not equal.
- When looping through all months in a year, use `monthsInYear` as the upper bound instead of assuming that every year has 12 months.
- Don't assume that `date.month === 12` is the last month of the year.
  Instead, use `date.month === date.monthsInYear`.
- Use `until` or `since` to count years, months, or days between dates.
  Manually calculating differences (e.g. `Math.floor(months / 12)`) will fail for some calendars.
- Use `daysInMonth` instead of assuming that each month has the same number of days in every year.
- Days in a month are not always continuous.
  There can be gaps due to political changes in calendars.
  For this reason, instead of looping through a month from 1 to `date.daysInMonth`, it's better to start a loop with the first day of the month (`date.with({day: 1})`) and `add` one day at a time until the `month` property returns a different value.
- Use `daysInYear` instead of assuming that every year has 365 days (366 in a leap year).
- Don't assume that `inLeapYear === true` implies that the year is one day longer than a regular year.
  Some calendars add leap months, making the year 29 or 30 days longer than a normal year!
- Use `toLocaleString` to format dates to users.
  DO NOT localize manually with code like `${month}/${day}/${year}`.
- Don't assume that `month` has the same name in every year.
  Some calendars like Hebrew or Chinese have leap months that cause months to vary across years.
- Use the correct property to refer to months.
  If you care about the order of the month in a particular year (e.g. when looping through all the months in a year) use `month`.
  If you care about the name of the month regardless of what year it is (e.g. storing a birthday), use the `monthCode` string property.
- When using the `Temporal.PlainMonthDay` type (e.g. for birthdays or holidays), use its `monthCode` property only.
  The `month` property is not present on this type because some calendars' month indexes vary from year to year.
- When calling `Temporal.PlainMonthDay.prototype.toPlainDate(year)`, be prepared for the resulting date to have a different day of the month and/or a different month, because leap days and leap months are not present in every year.
- Use `toLocaleString` to fetch month names instead of caching an array of names.
  Example: `date.toLocaleString('en-US', { calendar: date.calendar, month: 'long' })`.
  If you absolutely must cache month names, a string key like `${date.calendar.id}|{date.monthCode}|{date.inLeapYear}` will work for all built-in calendars.
- Don't assume that `era` or `eraYear` properties are always present.
  They are not present in some calendars.
- `era` and `eraYear` should always be used as a pair.
  Don't use one property without also using the other.
- Don't combine `month` and `monthCode` in the same property bag.
  Pick one month representation and use it consistently.
- Don't combine `year` and `era`/`eraYear` in the same property bag.
  Pick one year representation and use it consistently.
- Read the documentation of your calendar to determine the meaning of `monthCode` and `era`.
- Don't show `monthCode` and `era` values in a UI.
  Instead, use `toLocaleString` to convert these values into localized strings.
- Don't assume that the year before `{ eraYear: 1 }` is the last year of the previous era.
  Some calendars have a "year zero", and the oldest era in era-using calendars typically allows negative `eraYear` values.

### Handling unusual dates: leap days, leap months, and skipped or repeated periods

Calendars can vary from year to year.
[Solar calendars](https://en.wikipedia.org/wiki/Solar_calendar) like `'gregory'` use leap days.
[Lunar calendars](https://en.wikipedia.org/wiki/Lunar_calendar) like `'islamic'` adjust month lengths to lunar cycles.
[Lunisolar calendars](https://en.wikipedia.org/wiki/Lunisolar_calendar) like `'hebrew'` or `'chinese'` have "leap months": extra months added every few years.

Calendars may also have one-time changes.
The built-in `'gregory'` calendar in ECMAScript doesn't skip days because it's a [proleptic Gregorian calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar), but other calendars may skip days, months, or even years.
For example, a non-proleptic custom calendar for France would have 4 October 1582 (the last day of the [Julian calendar](https://en.wikipedia.org/wiki/Julian_calendar)) directly followed by 15 October 1582 (the first day of the [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar)), skipping 10 calendar days.

Calendar variation across years means that programs may encounter historical dates that are valid in one year but invalid in another.
A common example is calling `toPlainDate` on a `Temporal.PlainMonthDay` object to convert a birthday or anniversary that originally fell on a leap day, leap month, or other skipped period.
Temporal types' `with` or `from` methods can run into the same issue.

When Temporal encounters inputs representing a month and/or day that doesn't exist in the desired calendar year, by default (overridable in `with` or `from` via the `overflow` option) the inputs will be adjusted using the following algorithm:

- First, pick the closest `day` in the same month.
  If there are two equally-close dates in that month, pick the later one.
- If the month is a leap month that doesn't exist in the desired year, then pick another date according to the cultural conventions of that calendar's users.
  Usually this will result in the same `day` in the month before or the month after where that month would normally fall in a leap year.
- Otherwise, pick the closest date to the provided date that is still in the same year.
  If there are two equally-close dates, pick the later one.
- If the entire year doesn't exist, then pick the closest date to the provided date.
  If there are two equally-close dates, pick the later one.

Finally, just like calendars can sometimes skip days or months, it is possible for real-world calendars to repeat dates, for example when a country transitions from one calendar system to another.
No current built-in calendar repeats dates, but may in the future.
