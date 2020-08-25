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
- Dealing only with immutable objects
- Parsing a strictly specified string format
- Supporting non-Gregorian calendars, and time zones other than the user's local time and UTC

## Cookbook

A cookbook to help you get started and learn the ins and outs of Temporal is available [here](./cookbook.md).

## API Documentation

### **Temporal.now**

 * `Temporal.now.absolute()` - get the current system absolute time
 * `Temporal.now.timeZone()` - get the current system time zone
 * `Temporal.now.dateTime()` - get the current system date/time
 * `Temporal.now.time()` - get the current system time
 * `Temporal.now.date()` - get the current system date

See [Temporal.now Documentation](./now.md) for more detailed documentation.

### **Temporal.Absolute**

A `Temporal.Absolute` represents a fixed point in time, without regard to calendar or location.

See [Temporal.Absolute Documentation](./absolute.md) for more detailed documentation.

### **Temporal.DateTime**

A `Temporal.DateTime` represents a calendar date and wall-clock time. That means it does not carry time zone information. However it can be converted to a `Temporal.Absolute` using a `Temporal.TimeZone`.

This can also be converted to object containing only partial information such as `Temporal.Date` and `Temporal.Time`.

See [Temporal.DateTime Documentation](./datetime.md) for more detailed documentation.

#### Ambiguity

Converting between `Temporal.DateTime` and `Temporal.Absolute` is not a one-to-one operation and can be ambiguous, because of time zones and daylight saving time.

Read more about this in [Resolving ambiguity](./ambiguity.md).

### **Temporal.Time**

A `Temporal.Time` object represents a wall-clock time. Since there is no date component this can not be directly translated to an absolute point in time. However it can be converted to a `Temporal.Absolute` by combining with a `Temporal.Date` using a `Temporal.TimeZone`.

See [Temporal.Time Documentation](./time.md) for more detailed documentation.

### **Temporal.Date**

A `Temporal.Date` object represents a calendar date. This means there is no way to convert this to an absolute point in time, however combining with a `Temporal.Time` a `Temporal.DateTime` can be obtained which in turn can be pinned to the absolute timeline.

This can also be converted to partial dates such as `Temporal.YearMonth` and `Temporal.MonthDay`.

See [Temporal.Date Documentation](./date.md) for more detailed documentation.

### **Temporal.YearMonth**

A date without a day component. This is useful to express things like "the November 2010 meeting".

See [Temporal.YearMonth Documentation](./yearmonth.md) for more detailed documentation.

### **Temporal.MonthDay**

A date without a year component. This is useful to express things like "Bastille-Day is on the 14th of July".

See [Temporal.MonthDay Documentation](./monthday.md) for more detailed documentation.

### **Temporal.Duration**

A `Temporal.Duration` expresses a length of time. This is used for date/time maths.

See [Temporal.Duration Documentation](./duration.md) for more detailed documentation.

#### Balancing

Unlike the other Temporal types, the units in `Temporal.Duration` don't naturally wrap around to 0: you may want to have a duration of "90 minutes," and you don't want it to unexpectedly turn into "1 hour and 30 minutes."

See [Duration balancing](./balancing.md) for more on this topic.

### **Temporal.TimeZone**

A `Temporal.TimeZone` represents an IANA time zone, a specific UTC offset or UTC itself. Because of this `Temporal.TimeZone` can be used to convert between `Temporal.Absolute` and `Temporal.DateTime` as well as finding out the offset at a specific `Temporal.Absolute`.

See [Temporal.TimeZone Documentation](./timezone.md) for more detailed documentation.

### **Temporal.Calendar**

A `Temporal.Calendar` represents a calendar system.
Most code will use the ISO 8601 calendar, but other calendar systems are available.

See [Temporal.Calendar Documentation](./calendar.md) for more detailed documentation.

## Other Documentation

### **Key Concepts**

- [Ambiguity](./ambiguity.md) &mdash; Explanation of missing times and double times due to daylight saving and time zone changes.
- [Balancing](./balancing.md) &mdash; Explanation of when `Temporal.Duration` units wrap around to 0 and when they don't.

### **Design drafts**

- [Calendar Draft](./calendar-draft.md) &mdash; Draft design document for calendar support in Temporal.
  Mostly superseded by the documentation of [Temporal.Calendar](./calendar.md), but also contains some discussion about whether to have a default calendar.
- [ISO string extensions](./iso-string-ext.md) &mdash; Discussion of extensions to the ISO 8601 standard which are used by Temporal and intended to be put on a standards track.
- [Parse Draft](./parse-draft.md) &mdash; Draft design document for a `Temporal.parse` API, which is not currently planned to be implemented.
- [Zoned Date/Time Type Draft](./localdatetime-draft.md) &mdash; Explanation of `Temporal.LocalDateTime` (not the final name) which is a new type combining an absolute time with a time zone.
  Currently in progress.

### Obsolete Pages

- [Calendar Subclassing Draft](./calendar-subclass.md) &mdash; Draft design document for alternative approach for calendar support.
  (**Obsolete;** rejected.)
- [Custom Time Zone Draft](./timezone-draft.md) &mdash; Draft design document for custom time zone support in Temporal.
  (**Obsolete;** superseded by the documentation of [Temporal.TimeZone](./timezone.md).)

## Object Relationship

<div class="mermaid">
graph LR;
  timezone(TimeZone);
  subgraph " ";
    absolute(Absolute);
  end;
  subgraph " ";
    datetime(DateTime);
      date(Date);
        yearmonth(YearMonth);
        monthday(MonthDay);
      time(Time);
    datetime --- date;
    datetime --- time;
    date --- yearmonth;
    date --- monthday;
  end;
  absolute === timezone;
  timezone === datetime;
</div>
