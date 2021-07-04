# ECMAScript Extended ISO-8601 / RFC 3339 Strings

[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) and [RFC 3339](https://tools.ietf.org/html/rfc3339) are the industry standards for machine-readable serialization of dates and times.
However, there are three key use cases that are helpful for ECMAScript users that are not covered in ISO-8601 or RFC 3339:

1. IANA Time Zone Names
2. Month/Day Syntax
3. Calendar Systems

This document addresses addenda to the ISO-8601 and/or RFC 3339 spec for string serialization in the ECMAScript `Temporal` proposal.

## IANA Time Zone Names

There is precedent in other popular datetime libraries, such as Joda Time (now java.time), for appending time zone names in brackets.
We intend to fully support this syntax in ECMAScript, both input and output.
For example:

```
2007-12-03T10:15:30+01:00[Europe/Paris]
```

Neither ISO-8601 nor RFC 3339 specifications mention this syntax, but it is adopted in `Temporal` as a de-facto industry standard.

The time zone string is written according to the rules of the time zone database (see [timezone.md](timezone.md)).
These rules are documented [here](https://htmlpreview.github.io/?https://github.com/eggert/tz/blob/master/theory.html):

> Use only valid POSIX file name components (i.e., the parts of names other than `'/'`).
> Do not use the file name components `'.'` and `'..'`.
> Within a file name component, use only ASCII letters, `'.'`, `'-'` and `'_'`.
> Do not use digits, as that might create an ambiguity with POSIX TZ strings.
> A file name component must not exceed 14 characters or start with `'-'`.

## Month/Day Syntax

ISO-8601 and RFC 3339 specify syntax appropriate for `Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.PlainDateTime`, and `Temporal.PlainYearMonth`, but not `Temporal.PlainMonthDay` except in the special case of a duration.
Therefore, `Temporal` defines the following convention for month/day strings:

```
07-04
```

The above string would signify July 4 in the ISO calendar.

RFC 3339 includes `--07-04` for a date without year component.
In the current spec, we accept this but don't emit it.

## Calendar Systems

In order to achieve round-trip persistence for `Temporal` objects using non-ISO calendar systems, it's needed to add a calendar system identifier to the string syntax.

The authors of this proposal are unaware of existing precedent for expressing a calendar system in an ISO 8601 and/or RFC 3339 string.
Therefore, we are proposing the following extension:
_Calendar-specific dates are expressed as their equivalent date in the ISO calendar system, with a suffix signifying the calendar system into which the ISO date should be converted when read by a computer._

For example, when parsed, the following string would represent the date **28 Iyar 5780** in the Hebrew calendar:

```
2020-05-22[u-ca=hebrew]
```

The syntax of the calendar suffix is currently being proposed for standardization with the CalConnect and IETF Calsify standards bodies.

The calendar identifiers [are defined by CLDR](http://unicode.org/reports/tr35/#UnicodeCalendarIdentifier) as [a sequence of 3-8 character BCP47 subtags](http://unicode.org/reports/tr35/#unicode_locale_extensions).
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

Example of a maximal length string containing both an IANA time zone name and a calendar system:

```
2020-05-22T07:19:35.356-04:00[America/Indiana/Indianapolis][u-ca=islamic-umalqura]
```

### Calendar-dependent YearMonth and MonthDay

Based on the data model discussion in [#391](https://github.com/tc39/proposal-temporal/issues/391), `Temporal.YearMonth` and `Temporal.MonthDay` use the `Temporal.PlainDate` data model when in a non-ISO calendar system.
For example, a `Temporal` object using the Hebrew calendar might store "Iyar 5780" in a `Temporal.YearMonth` using `2020-04-25` which is the first day of that month in the ISO calendar.

When expressed as an ISO string, we would say:

```
2020-04-25[u-ca=hebrew]
```

Because it is ambiguous whether that string represents a `Temporal.PlainDate`, `Temporal.YearMonth`, or `Temporal.MonthDay`, the appropriate `Temporal` constructor must be chosen in order to get the expected data type back out.

## String Persistence Overview

All `Temporal` types have a string representation for persistence and interoperability.
Most of these types only require existing standards, with a few exceptions noted above.
The correspondence between types and strings is shown below.

<img src="persistence-model.svg">
