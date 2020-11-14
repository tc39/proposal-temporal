# Temporal

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

## Introduction

`Date` has been a long-standing pain point in ECMAScript.
This is a proposal for `Temporal`, a global `Object` that acts as a top-level namespace (like `Math`), that brings a modern date/time API to the ECMAScript language.
For a detailed look at some of the problems with `Date`, and the motivations for Temporal, see:
[Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/).

Temporal fixes these problems by:

- Providing easy-to-use APIs for date and time computations
- First-class support for all time zones, including DST-safe arithmetic
- Dealing only with immutable objects
- Parsing a strictly specified string format
- Supporting non-Gregorian calendars

## Cookbook

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](./cookbook.md).

## API Documentation

### **Temporal.now**

- `Temporal.now.instant()` - get the exact time since [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)
- `Temporal.now.timeZone()` - get the current system time zone
- `Temporal.now.zonedDateTime(calendar)` - get the current date and wall-clock time in the system time zone and specified calendar
- `Temporal.now.zonedDateTimeISO()` - get the current date and wall-clock time in the system time zone and ISO-8601 calendar
- `Temporal.now.plainDate(calendar)` - get the current date in the system time zone and specified calendar
- `Temporal.now.plainDateISO()` - get the current date in the system time zone and ISO-8601 calendar
- `Temporal.now.plainTime(calendar)` - get the current wall-clock time in the system time zone and specified calendar
- `Temporal.now.plainTimeISO()` - get the current wall-clock time in the system time zone and ISO-8601 calendar
- `Temporal.now.plainDateTime(calendar)` - get the current system date/time in the system time zone, but return an object that doesn't remember its time zone so should NOT be used to derive other values (e.g. 12 hours later) in time zones that use Daylight Saving Time (DST).
- `Temporal.now.plainDateTimeISO()` - same as above, but return the DateTime in the ISO-8601 calendar

See [Temporal.now Documentation](./now.md) for detailed documentation.

### **Temporal.Instant**

A `Temporal.Instant` represents a fixed point in time (called **"exact time"**), without regard to calendar or location.
For a human-readable local calendar date or clock time, use a `Temporal.TimeZone` and `Temporal.Calendar` to obtain a `Temporal.ZonedDateTime` or `Temporal.PlainDateTime`.

See [Temporal.Instant Documentation](./instant.md) for detailed documentation.

### **Temporal.ZonedDateTime**

_NOTE: Not all methods of this type are available in the polyfill yet._

A `Temporal.ZonedDateTime` is a timezone-aware, calendar-aware date/time type that represents a real event that has happened (or will happen) at a particular exact time from the perspective of a particular region on Earth.
This type is optimized for use cases that require a time zone, including DST-safe arithmetic and interoperability with RFC 5545 (iCalendar).

As the broadest `Temporal` type, `Temporal.ZonedDateTime` can be considered a combination of `Temporal.TimeZone`, `Temporal.Instant`, and `Temporal.PlainDateTime` (which includes `Temporal.Calendar`).

See [Temporal.ZonedDateTime Documentation](./zoneddatetime.md) for detailed documentation.

### **Temporal.PlainDate**

A `Temporal.PlainDate` object represents a calendar date that is not associated with a particular time or time zone.

This can also be converted to partial dates such as `Temporal.PlainYearMonth` and `Temporal.PlainMonthDay`.

See [Temporal.PlainDate Documentation](./plaindate.md) for detailed documentation.

#### Time Zones and Resolving Ambiguity

Converting between wall-clock/calendar-date types (like `Temporal.PlainDate`, `Temporal.PlainTime`, and `Temporal.PlainDateTime`) and exact time types (`Temporal.Instant` and `Temporal.ZonedDateTime`) can be ambiguous because of time zones and daylight saving time.

Read more about [handling time zones, DST, and ambiguity in `Temporal`](./ambiguity.md).

### **Temporal.PlainTime**

A `Temporal.PlainTime` object represents a wall-clock time that is not associated with a particular date or time zone.

See [Temporal.PlainTime Documentation](./plaintime.md) for detailed documentation.

### **Temporal.PlainDateTime**

A `Temporal.PlainDateTime` represents a calendar date and wall-clock time that does not carry time zone information.
It can be converted to a `Temporal.ZonedDateTime` using a `Temporal.TimeZone`.
For use cases that require a time zone, especially using arithmetic or other derived values, consider using `Temporal.ZonedDateTime` instead because that type automatically adjusts for Daylight Saving Time.

See [Temporal.PlainDateTime Documentation](./plaindatetime.md) for detailed documentation.

### **Temporal.PlainYearMonth**

A date without a day component.
This is useful to express things like "the November 2010 meeting".

See [Temporal.PlainYearMonth Documentation](./plainyearmonth.md) for detailed documentation.

### **Temporal.PlainMonthDay**

A date without a year component.
This is useful to express things like "Bastille Day is on the 14th of July".

See [Temporal.PlainMonthDay Documentation](./plainmonthday.md) for detailed documentation.

### **Temporal.Duration**

A `Temporal.Duration` expresses a length of time.
This is used for date/time arithmetic and for measuring differences between `Temporal` objects.

See [Temporal.Duration Documentation](./duration.md) for detailed documentation.

#### Balancing

Unlike the other Temporal types, the units in `Temporal.Duration` don't naturally wrap around to 0: you may want to have a duration of "90 minutes," and you don't want it to unexpectedly turn into "1 hour and 30 minutes."

See [Duration balancing](./balancing.md) for more on this topic.

### **Temporal.TimeZone**

A `Temporal.TimeZone` represents an IANA time zone, a specific UTC offset, or UTC itself.
Because of this `Temporal.TimeZone` can be used to convert between `Temporal.Instant` and `Temporal.PlainDateTime` as well as finding out the offset at a specific `Temporal.Instant`.

See [Temporal.TimeZone Documentation](./timezone.md) for detailed documentation.
A conceptual explanation of handling [time zones, DST, and ambiguity in Temporal](./ambiguity.md) is also available.

### **Temporal.Calendar**

A `Temporal.Calendar` represents a calendar system.
Most code will use the ISO 8601 calendar, but other calendar systems are available.

See [Temporal.Calendar Documentation](./calendar.md) for detailed documentation.

## Object Relationship

<img src="object-model.svg">

## String Persistence

All `Temporal` types have a string representation for persistence and interoperability.
The correspondence between types and strings is shown below.
For more information about extensions to the ISO 8601 / RFC 3339 standards that are used by Temporal and which are intended to be put on a standards track, see [ISO string extensions](./iso-string-ext.md).

<img src="persistence-model.svg">

## Other Documentation

### **Key Concepts**

- [Ambiguity](./ambiguity.md) &mdash; Explanation of missing times and double times due to daylight saving and time zone changes.
- [Balancing](./balancing.md) &mdash; Explanation of when `Temporal.Duration` units wrap around to 0 and when they don't.
- [ISO String Extensions](./iso-string-ext.md) &mdash; Discussion of extensions to the ISO 8601 and/or RFC 3339 standards which are used by `Temporal`.
  These extensions are being actively worked on with IETF to get them on a standards track.

