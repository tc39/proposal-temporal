# String Parsing, Serialization, and Formatting in ECMAScript Temporal

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

## Machine-readable vs. human-readable string formats

There are two kinds of string representations for ECMAScript `Temporal` objects:

- **"Machine-readable" formats** are based on industry standards and standards-track extensions.
  As their name suggests, machine-readable formats are optimized for unambiguous and efficient parsing by computers, so they are not suitable for display to non-technical end users.
  They are never localized.
  Examples:
  - `"2022-02-28"`
  - `"2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai][u-ca=chinese]"`
  - `"2022-02-28T03:06:00.092121729Z"`
- **"Human-readable" formats** - These formats are optimized for displaying to end users according to the language and conventions of users' locale, and the needs of specific UI applications.
  Examples:
  - `"2/28/2022, 11:06:00 AM PST"`
  - `"Monday, February 28, 2022"`
  - `"正月28日 GMT+8 11:06:00"`

Temporal objects can be parsed from machine-readable formats and can also be serialized ("round-tripped") into these formats.

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai][u-ca=chinese]');
zdt.toString();
  // => "2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai][u-ca=chinese]"

date = Temporal.PlainDate.from('2022-02-28');
date.toString();
  // => "2022-02-28"

duration = Temporal.Duration.from('P1DT12H30M');
duration.toString();
  // => "P1DT12H30M"
```
<!-- prettier-ignore-end -->

Temporal can also produce localized, human-readable string representations.

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai][u-ca=chinese]');
zdt.toLocaleString('zh-CN', { calendar: 'chinese' });
  // => "正月28日 GMT+8 11:06:00"

// `toLocaleString` on `Temporal` objects works the same as `Intl.DateTimeFormat#format`
zdt = Temporal.ZonedDateTime.from('2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai][u-ca=chinese]');
new Intl.DateTimeFormat('zh-CN', { calendar: 'chinese' }).format(zdt);
  // => "正月28日 GMT+8 11:06:00"

zdt = zdt.withCalendar('gregory');
zdt.withTimeZone('America/Los_Angeles')
  .toLocaleString('en-US', { calendar: 'gregory' });
  // => "2/27/2022, 7:06:00 PM PST"

zdt.withTimeZone('Europe/Paris')
  .toPlainDate()
  .toLocaleString('fr-FR', { calendar: 'gregory', dateStyle: 'long' });
  // => "28 février 2022"

zdt.withTimeZone('Europe/Paris')
  .toPlainDate()
  .subtract({ years: 3000 })
  .toLocaleString('fr-FR', { calendar: 'gregory', dateStyle: 'long' });
  // => "28 février 2022"

zdt.withTimeZone('America/New_York')
  .toPlainDate()
  .subtract({ years: 3000 })
  .toLocaleString('en-US', { calendar: 'gregory', era: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  // => "February 27, 979 BC"
```
<!-- prettier-ignore-end -->

Unlike machine-readable strings, human-readable strings cannot be parsed by Temporal.
<a href="#localized-parsing">Why not?</a>

## Machine-readable string persistence overview

All `Temporal` types have a machine-readable string representation for persistence and interoperability.
These representations are based on existing industry standards, with a few standards-track extensions noted below.

<img src="persistence-model.svg">

## Industry standards for machine-readable date/time strings

[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) and [RFC 3339](https://tools.ietf.org/html/rfc3339) are the industry standards for machine-readable serialization of dates and times.
Temporal's string serialization is based on these existing standards, with exception of IANA Time Zones (like `Europe/Paris`) and non-Gregorian calendars like Hebrew or Chinese.
These standard formats also match the [formats accepted by the HTML `<time>` element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTimeElement/dateTime).
For IANA time zones and non-Gregorian calendars, a standards-track extension to RFC 3339 is being worked on as part of the [IETF SEDATE](https://datatracker.ietf.org/wg/sedate/about/) working group.

Because neither ISO 8601 nor RFC 3339 include a standardized month/day format (for birthdays, holidays, etc.), Temporal relies on the [HTML standard's yearless date format](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#parse-a-yearless-date-component) which accepts strings like `12-25` and `--12-25`.
Using the HTML standard format also ensures that `Temporal.PlainMonthDay` can be used as input to the HTML `<time>` element.

The sections below explain the proposed extensions to RFC 3339 for time zones and calendars.

### IANA time zone names

For many years, a popular way to combine a timestamp and a time zone into a single string has been the format used in the [Java standard library](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html#parse-java.lang.CharSequence-).
Before this format was adopted by Java in [JSR-310](https://jcp.org/en/jsr/detail?id=310) in 2014, other open-source libraries like [Joda Time](https://www.joda.org/joda-time/) (which JSR-310 was based on) used the same format.
For example:

```
2007-12-03T10:15:30+01:00[Europe/Paris]
```

Because of this format's long-term industry adoption, it was chosen for use in ECMAScript `Temporal` for both input and output.

Although neither ISO-8601 nor RFC 3339 specifications currently use this syntax, it's on a standards track led by the [IETF SEDATE](https://datatracker.ietf.org/wg/sedate/about/) working group which includes ECMAScript `Temporal` champions as well as other industry participants.

The time zone ID itself follows the rules of the time zone database, usually called TZDB.

> Use only valid POSIX file name components (i.e., the parts of names other than `'/'`).
> Do not use the file name components `'.'` and `'..'`.
> Within a file name component, use only ASCII letters, `'.'`, `'-'` and `'_'`.
> Do not use digits, as that might create an ambiguity with POSIX TZ strings.
> A file name component must not exceed 14 characters or start with `'-'`.

For more about TZDB, see the [TZDB documentation](https://htmlpreview.github.io/?https://github.com/eggert/tz/blob/master/theory.html).

### Calendar systems

In order to achieve round-trip persistence for `Temporal` objects using non-ISO calendar systems, a calendar system identifier can be added.

Therefore, we are proposing the following extension:
_Calendar-specific dates are expressed as their equivalent date in the ISO 8601 calendar system, with a suffix signifying the calendar system into which the ISO date should be converted when read by a computer._

For example, when parsed, the following string would represent the date **28 Iyar 5780** in the Hebrew calendar:

```
2020-05-22[u-ca=hebrew]
```

The syntax of the calendar suffix is currently on a standards track led by the [IETF SEDATE](https://datatracker.ietf.org/wg/sedate/about/) working group.

The calendar identifiers [are defined by CLDR](http://unicode.org/reports/tr35/#UnicodeCalendarIdentifier) as [a sequence of 3-8 character BCP47 subtags](http://unicode.org/reports/tr35/#unicode_locale_extensions).
Usually there's only one subtag in the sequence, although some calendars may use more.
The list of calendar identifiers currently supported by CLDR is:

- `buddhist`
- `chinese`
- `coptic`
- `dangi`
- `ethioaa`
- `ethiopic`
- `gregory`
- `hebrew`
- `indian`
- `islamic`
- `islamic-umalqura`
- `islamic-tbla`
- `islamic-civil`
- `islamic-rgsa`
- `iso8601`
- `japanese`
- `persian`
- `roc`
- `islamicc` (deprecated in favor of `islamic-civil`)

Note that extensions can more than double the size of a date/time string.
For example, here's a long string containing both an IANA time zone name and a calendar system:

```
2020-05-22T07:19:35.123456789-04:00[America/Indiana/Indianapolis][u-ca=islamic-umalqura]
```

### Calendar-dependent `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay`

Many `Temporal` types include a `calendar` property that controls the value of the `year`, `month` and `day` properties as well as other calendar-related behavior like adding months or calculating the number of number of days in a month.
But regardless of the calendar used, the string representation always uses the ISO 8601 calendar year, month, and day.
Doing this allows easier sorting and comparison of strings across different calendar systems, and it ensures better compatibility with other systems that are not aware of other calendar systems.

For example, the following strings represent the same day in different calendar systems.

```javascript
function localizedDate(s) {
  date = Temporal.PlainDate.from(s);
  calendar = Temporal.Calendar.from(s);
  return date.toLocaleString('en-US', { calendar, dateStyle: 'long' });
}
localizedDate('2020-04-25[u-ca=hebrew]'); // => "1 Iyar 5780"
localizedDate('2020-04-25[u-ca=islamic]'); // => "Ramadan 2, 1441 AH"
localizedDate('2020-04-25'); // => "April 25, 2020" (ISO 8601 calendar is default)
```

In the ISO 8601 calendar, the string representation of `Temporal.PlainYearMonth` omits the day (e.g. `"2020-04"`) and the `Temporal.PlainMonthDay` representation omits the year (e.g. `"04-25"`).
But in other calendar systems, the year, month, and day are all needed in order to unambiguously determine the correct year and month (for `Temporal.PlainYearMonth`) or month and day (for `Temporal.PlainMonthDay`) in that calendar.
Therefore, the string representation of `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay` in non-ISO calendar systems matches the representation of `Temporal.PlainDate`.
For example:

```javascript
function localizedMonthDay(s) {
  monthDay = Temporal.PlainMonthDay.from(s);
  calendar = Temporal.Calendar.from(s);
  return monthDay.toLocaleString('en-US', { calendar, month: 'long', day: 'numeric' });
}
localizedMonthDay('2020-04-25[u-ca=hebrew]'); // => "1 Iyar"
localizedMonthDay('2020-04-25[u-ca=islamic]'); // => "Ramadan 2"
localizedMonthDay('04-25'); // => "April 25"
```

## String parsing and formatting FAQ

#### What is the right `Temporal` type to use for parsing a particular string?

To determine the `Temporal` class that should be used to parse a string, it's important to pick the type whose data model matches the data in the string.

- `Temporal.Instant` represents an exact time.
  Its data model is the number of integer nanoseconds since January 1, 1970 UTC.
  This type is unaware of time zones and does not provide a way to access calendar/clock units like month or hour. It's just a timestamp.
- `Temporal.ZonedDateTime` represents an exact time from the perspective of a specific time zone.
  Its data model is a timestamp (like `Temporal.Instant`), a time zone (usually an IANA zone), and a calendar.
  The time zone is needed because this `Temporal` type (and only this type) allows DST-safe creation of derived values.
  When you add 1 day to a `Temporal.ZonedDateTime` instance, the exact time will usually be 24 hours later but it may be 23 or 25 if the addition crossed a DST transition.
- `Temporal.PlainDate` represents a timezone-less date: a local date without a time and without any reference to the time zone.
  Its data model is a year/month/day and a calendar.
- `Temporal.PlainMonthDay` represents a birthday, anniversary, or other recurring event.
  Its data model is a month, day, and calendar.
- `Temporal.PlainYearMonth` represents a month in a specific year, e.g. January 2022.
  Its data model is a year, month, and calendar.
- `Temporal.PlainTime` represents a timezone-less time of day: a local time without reference to date, time zone, or calendar.
  Its data model is an hour/minute/second, with seconds resolution down to 9 decimal digits (nanoseconds).
- `Temporal.PlainDateTime` represents a local date and time without any reference to the time zone.
  Its data model is year/month/day/hour/minute/second and a calendar.
  This type is rarely used, because the types above cover most use cases.
  If you only care about the exact timestamp and don't care about time zones, then use `Temporal.Instant`.
  If you only care about the local date, then use `Temporal.PlainDate`.
  If you care about the exact time and the time zone, then use `Temporal.ZonedDateTime`.
  Other than the few use cases detailed in the [`Temporal.PlainDateTime` documentation](plaindatetime.html), most of the time it's better to use a different type.
- `Temporal.Duration` represents a period of time.
  Its data model is a number of years, months, days, hours, minutes, seconds, milliseconds, microseconds, and nanoseconds.

#### Is there one function I can call to parse any string into the appropriate `Temporal` type?

No.
To parse a string into a `Temporal` type, you must know ahead of time what type to use, because the same string can be used to parse many different `Temporal` types.
For example, `2020-04-25[u-ca=hebrew]` can be successfully parsed by `Temporal.PlainDate.from`, `Temporal.PlainMonthDay.from`, `Temporal.PlainYearMonth.from`, or even `Temporal.PlainDateTime.from`.
This ambiguity requires choosing a `Temporal` type before parsing.

#### When should I use `toString` vs. `toLocaleString` when converting `Temporal` types to a string?

To display human-readable information to non-technical end users, use `toLocaleString()`.
To store data that can later be read by computers, use `toString()`.

#### Why are IANA time zones needed? Why can't I just use timestamps like `2020-01-01T00:00-08:00`?

Timestamps are good if you want to know the specific instant where something took place.
However, they're not good for:

- Deriving new timestamps, e.g. "2 days later" where the new result needs to follow time zone rules
- Knowing what time zone was captured along with the data, which can be helpful later when deciding what time zone to show in a UI for that timestamp
- Solving [conflicts between time zone and UTC offset](ambiguity.html#ambiguity-caused-by-permanent-changes-to-a-time-zone-definition).

For these reasons, it's helpful to capture and store the time zone (not just the offset) when strings are serialized.

#### Why is a bracketed time zone annotation required to parse a string into a `Temporal.ZonedDateTime` object?

To construct a `Temporal.ZonedDateTime`, three pieces of information are required:

- A timestamp (which is the same data model as a `Temporal.Instant`)
- A calendar (which defaults to the `iso8601` calendar)
- A time zone, e.g. `America/Los_Angeles`

A string like `"2022-02-28T03:06:00Z"` or `"2022-02-28T03:06:00+02:00"` lacks the time zone annotation (e.g. `[America/Los_Angeles]`), so it will throw an exception when parsed by `Temporal.ZonedDateTime.from`.

A reasonable question is why `Temporal.ZonedDateTime` doesn't automatically use the offset (e.g. `Z` or `+02:00`) if there's no time zone suffix.
The answer is that `Temporal.ZonedDateTime` is designed to ensure DST-safe arithmetic, which in turn requires knowing when DST starts or stops in a particular time zone.
Here's a short example illustrating why this matters.

<!-- prettier-ignore-start -->
```javascript
function oneDayLaterInstant(s) {
  return Temporal.ZonedDateTime.from(s).add({ days: 1 }).toInstant();
}
oneDayLaterInstant('2021-03-28T00:00+01:00[Europe/Paris]');
  // => 2021-03-28T22:00:00Z
oneDayLaterInstant('2021-03-28T00:00+01:00[+01:00]');
  // => 2021-03-28T23:00:00Z (one hour later!)
oneDayLaterInstant('2021-03-28T00:00+01:00');
  // throws, because there's no time zone suffix
```
<!-- prettier-ignore-end -->

The calls above use the same timestamp, but return a different result when called with a day that happens to contain a DST transition.
As the second call above shows, if you really do want to do arithmetic or otherwise use `Temporal.ZonedDateTime` functionality, it can be done using an offset time zone suffix like `[+01:00]`.

But if there's no time zone suffix, then `Temporal.ZonedDateTime.from` will throw an exception.
This exception has the effect of forcing developers to provide the time zone in a different way, e.g. by parsing the string into a `Temporal.Instant` and using its `toZonedDateTimeISO()` method to convert to `Temporal.ZonedDateTime`.
This is a good outcome because whether the time zone is part of the string or called separately, requiring it enables developers to know that any `Temporal.ZonedDateTime` APIs will always return time-zone-aware results.
If timezone-aware results are not needed, then use another type like `Temporal.Instant`.

#### How can I parse the offset of timestamp strings like `2022-02-28T03:06:00+02:00` or `2022-02-28T03:06:00Z`?

Timestamp strings like `2022-02-28T03:06:00+02:00` or `2022-02-28T03:06:00Z` are normally parsed by `Temporal.Instant`.
Because the data model of `Temporal.Instant` is limited to the number of nanoseconds since January 1, 1970 UTC), the offset is not stored when parsing a string into a `Temporal.Instant`.
If the offset of the string is needed, use `Temporal.Instant.toZonedDateTimeISO()` with the string as the time zone:

```javascript
s = `2022-02-28T03:06:00Z`;
offset = Temporal.Instant.from(s).toZonedDateTimeISO(s).timeZoneId; // => UTC

s = `2022-02-28T03:06:00+02:00`;
offset = Temporal.Instant.from(s).toZonedDateTimeISO(s).timeZoneId; // => +02:00
```

#### Why can't I parse a UTC "Z" string using `Temporal.PlainXxx` types?

One of the most common date/time-related bugs is treating a UTC timestamp as if it were a local date and time.
For example, `2022-02-01T00:00Z` is 1:00AM on February 1 in Paris but 7:00PM on January 31 in New York.
If a program assumes that `2022-02-01` is a local-timezone date, then that program will be wrong in half the world.

Another, more subtle version of this bug is when an external data source switches its format for storing or sending timestamps.
For example, imagine a remote web service or database that provides a date/time string in this format: `2022-01-31T19:00-05:00`.
Developers can safely assume that `2022-01-31T19:00` is the local time in the time zone where this data was recorded, and so can parse this string with `Temporal.PlainDate.from`, `Temporal.PlainTime.from`, etc.
But now assume that the remote service or database is refactored to emit strings using a "Z" suffix like `2022-02-01T00:00Z`.
Code that only parses these strings into a `Temporal.Instant` won't break because the timestamps represent the same instant.
But code using `Temporal.PlainDate.from` will encounter off-by-one-day bugs, which can be maddening to track down because they're intermittent (only show up in some time zones and only at some times of day) and aren't attributable to code changes in the client app.

To prevent these types of bugs, an exception will be thrown if a `Temporal.PlainXxx` type is asked to parse a timestamp string with a `Z` suffix.

#### In the unusual case where I want to get the calendar/clock units from a UTC "Z" string, how can I do that?

In rare cases, developers may want to extract the date and time units from a timestamp string that uses a `Z` suffix.
The answer above explains why this is usually a bad idea, but sometimes it's needed.
For example, code that stores a new log file every day may need to flip over to a new file at midnight UTC.
To handle cases like this, first parse the string into a `Temporal.Instant` and then convert to a `Temporal.ZonedDateTime` using the `UTC` time zone.

```javascript
s = `2022-02-01T00:00Z`;
Temporal.PlainDate.from(s); // throws
zdt = Temporal.Instant.from(s).toZonedDateTimeISO(s).toPlainDate(); // => 2022-02-01
```

#### Can I parse a subset of data in a string?

Yes!
Temporal parsing methods accept strings that have more information than the type needs.
Information not needed for that type's data model is ignored.
This works for all Temporal types (except `Temporal.Duration` for which it is irrelevant.)

```javascript
s = '2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai]';
Temporal.ZonedDateTime.from(s); // => 2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai]
Temporal.PlainTime.from(s); // => 11:06:00.092121729
Temporal.PlainDate.from(s); // => 2022-02-28
Temporal.PlainDateTime.from(s); // => 2022-02-28T11:06:00.092121729
Temporal.PlainYearMonth.from(s); // => 2022-02
Temporal.PlainMonthDay.from(s); // => 02-28
Temporal.Instant.from(s); // => 2022-02-28T03:06:00.092121729Z
```

<a name="localized-parsing"></a>

#### Why doesn't `Temporal` support parsing localized formats like `MM/DD/YY`?

Parsing of localized date/time formats is notoriously difficult and brittle.
For example, here's what MDN has to say about [`Date.parse`]()

> It is not recommended to use `Date.parse` as until ES5, parsing of strings was entirely implementation dependent.
> There are still many differences in how different hosts parse date strings, therefore date strings should be manually parsed (a library can help if many different formats are to be accommodated).

Because of the complexity involved in standardizing and implementing localized date parsing, TC39 (the standards committee responsible for ECMAScript) has learned from the painful experience of `Date.parse` that localized parsing is best left to userland libraries, not platform specifications.

For more background, see [this discussion](https://github.com/tc39/ecma402/issues/342#issuecomment-486857111) about localized parsing in `Intl.DateTimeFormat`.

For future proposals that extend the Temporal API, there's a [feature request](https://github.com/js-temporal/proposal-temporal-v2/issues/2) for a limited form of parsing.
Feel free to add feedback to that issue.

#### What industry standards apply to the string formats that `Temporal` uses?

See the [standards](#industry-standards-for-machine-readable-datetime-strings) section above.

#### When and how will `Temporal`'s string extensions be standardized?

For IANA time zones and non-Gregorian calendars, a standards-track extension to RFC 3339 is being worked on as part of the [IETF SEDATE](https://datatracker.ietf.org/wg/sedate/about/) working group.
A draft RFC is available and is currently on the path to standardization.

#### Can I use a string in place of an object in `Temporal` APIs?

Yes!
Any ECMAScript `Temporal` method that accepts a `Temporal` object parameter will also accept a string or property-bag representation of that object.

```javascript
newYear = Temporal.PlainDate.from('2022-01-01');
newYear.until(Temporal.PlainDate.from('2022-01-15')); // => P14D
newYear.until('2022-01-15'); // => P14D
newYear.until({ year: 2022, month: 1, day: 15 }); // => P14D
```

#### Will `Temporal` parse ISO 8601 year-week-day strings, e.g. `2020-W13-5`?

No.
Year-week-day strings like `2020-W13-5` are not parsed by the initial `Temporal` API.
This is a fairly common request for a future proposal that extends `Temporal`.
See https://github.com/js-temporal/proposal-temporal-v2/issues/11 for more details.
