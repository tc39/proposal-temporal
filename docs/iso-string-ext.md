ECMAScript Extended ISO-8601 Strings
====================================

ISO-8601 is the industry standard when it comes to serialization of dates and times in a computer.  However, there are two key use cases that are helpful for ECMAScript users that are not covered in ISO-8601:

1. IANA Time Zone Names
2. Calendar systems

This document addresses addenda to the ISO-8601 spec for string serialization in the ECMAScript Temporal proposal.

## IANA Time Zone Names

There is precedent in other popular datetime libraries, such as Joda Time (now java.time), for appending time zone names in brackets.  We intend to fully support this syntax in ECMAScript, both input and output.  For example:

```
2007-12-03T10:15:30+01:00[Europe/Paris]
```

The ISO-8601 specification makes no mention of this syntax.  It is adopted here as a de-facto industry standard.

The time zone string is written according to the rules of the time zone database (see [timezone.md](timezone.md)).  These rules are documented [here](https://htmlpreview.github.io/?https://github.com/eggert/tz/blob/master/theory.html):

> Use only valid POSIX file name components (i.e., the parts of names other than `'/'`). Do not use the file name components `'.'` and `'..'`. Within a file name component, use only ASCII letters, `'.'`, `'-'` and `'_'`. Do not use digits, as that might create an ambiguity with POSIX TZ strings. A file name component must not exceed 14 characters or start with `'-'`.

## MonthDay Syntax

ISO-8601 specifies syntax appropriate for Temporal.Date, Temporal.DateTime, and Temporal.YearMonth, but not Temporal.MonthDay, except in the special case of a duration.  We are establishing the following convention:

```
07-04
```

The above string would signify July 4 in the ISO calendar.

RFC 3339 also has `--07-04` for a date without year component.  In the current spec, we accept this but don't emit it.

## Calendar Systems

With ECMAScript Temporal's first-class calendar system support, we have found the desire to add a calendar system identifier to the string syntax, allowing for Temporal types to round-trip to strings.

The authors of this proposal are unaware of existing precedent for expressing a calendar system in an ISO-8601 string.  Therefore, we are considering the following data model: *Calendar-specific dates are expressed as their equivalent date in the ISO calendar system, with a suffix signifying the calendar system into which the ISO date should be converted when read by a computer.*

For example, when parsed, the following string would represent the date **28 Iyar 5780** in the Hebrew calendar:

```
2020-05-22[c=hebrew]
```

The syntax of the prefix is open for debate.  Options we have considered:

- `[c=hebrew]`, using the same non-standard syntax as time zone names, with `c=` to distinguish the calendar identifier from a time zone identifier.
- `[hebrew]`, distinguished from time zone names by starting with a lowercase letter.
- `{hebrew}`, using a different type of bracket.
- `{ca-hebrew}`, including a UTS 35 locale identifier key.

The calendar identifiers [are defined by CLDR](http://unicode.org/reports/tr35/#UnicodeCalendarIdentifier) as [a sequence of 3-8 character BCP47 subtags](http://unicode.org/reports/tr35/#unicode_locale_extensions).  The list of calendar identifiers currently supported by CLDR is:

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
2020-05-22T07:19:35.356-04:00[America/Indiana/Indianapolis]{islamic-umalqura}
```

### Calendar-dependent YearMonth and MonthDay

Based on the data model discussion in [#391](https://github.com/tc39/proposal-temporal/issues/391), YearMonth and MonthDay use the Temporal.Date data model when in a non-ISO calendar system.  For example, the Hebrew calendar might express the YearMonth "Iyar 5780" as 2020-03-25, the first day of that month in the ISO calendar.

When expressed as an ISO string, we would say:

    2020-03-25{hebrew}

Since it is ambiguous whether that string represents a Date, YearMonth, or MonthDay, the appropriate Temporal constructor must be chosen in order to get the expected data type back out.
