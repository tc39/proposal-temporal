# Temporal Cookbook

## Overview

<!-- toc -->

## Running the cookbook files

Running cookbook files: see instructions in [../polyfill/README.md](https://github.com/tc39/proposal-temporal/tree/main/polyfill#running-cookbook-files)

## Frequently Asked Questions

These are some of the most common tasks that people ask questions about on StackOverflow with legacy Date.
Here's how they would look using Temporal.

### Current date and time

How to get the current date and time in the local time zone?

```javascript
{{cookbook/getCurrentDate.mjs}}
```

### Unix timestamp

How to get a Unix timestamp?

```javascript
{{cookbook/getTimeStamp.mjs}}
```

## Converting between Temporal types and legacy Date

### Absolute from legacy Date

Map a legacy ECMAScript Date instance into a Temporal.Absolute instance corresponding to the same instant in absolute time.

```javascript
{{cookbook/absoluteFromLegacyDate.mjs}}
```

## Construction

### Time zone object from name

`Temporal.TimeZone.from()` can convert an IANA time zone name into a `Temporal.TimeZone` object.

```javascript
{{cookbook/getTimeZoneObjectFromIanaName.mjs}}
```

## Serialization

### Zoned instant from instant and time zone

Use the optional parameter of `Temporal.Absolute.prototype.toString()` to map a Temporal.Absolute instance and a time zone name into a string serialization of the local time in that zone corresponding to the instant in absolute time.

Without the parameter, `Temporal.Absolute.prototype.toString()` gives a serialization in UTC time.
Using the parameter is useful if you need your serialized strings to be in a specific time zone.

```javascript
{{cookbook/getParseableZonedStringAtInstant.mjs}}
```

## Sorting

Each Temporal type has a `compare()` static method, which can be passed to `Array.prototype.sort()` as the compare function in order to sort an array of Temporal types.

### Sort DateTimes

Sort a list of `Temporal.DateTime`s, for example in order to get a conference schedule in the correct order.
Sorting other Temporal types would work exactly the same way as this.

```javascript
{{cookbook/getSortedLocalDateTimes.mjs}}
```

### Sort ISO date/time strings

Sort a list of ISO 8601 date/time strings, for example to place log entries in order.

```javascript
{{cookbook/sortAbsoluteInstants.mjs}}
```

## Time zone conversion

### Preserving absolute instant

Map a zoned date and time of day into a string serialization of the local time in a target zone at the corresponding instant in absolute time.
This could be used when converting user-input date-time values between time zones.

```javascript
{{cookbook/getParseableZonedStringWithLocalTimeInOtherZone.mjs}}
```

Here is another example similar to the previous one, using the time zone for future events.
The times and locations of a series of future meetings are stored as a pair of strings: one for the calendar date and wall-clock time, and one for the time zone.
They cannot be stored as an absolute point in UTC because between now and the time when the event happens, the time zone rules for daylight saving time could change &mdash; for example, Brazil abolished daylight saving time in 2019 &mdash; but the meeting would still be held at the same wall-clock time on that date.
So if the time zone rules changed, the event's absolute point in time would change.

This example calculates the starting times of all the Ecma TC39 meetings in 2019, in local time in Tokyo.

```javascript
{{cookbook/localTimeForFutureEvents.mjs}}
```

### Daily occurrence in local time

Similar to the previous recipe, calculate the absolute times of a daily occurrence that happens at a particular local time in a particular time zone.

```javascript
{{cookbook/calculateDailyOccurrence.mjs}}
```

### UTC offset for a zoned event, as a string

Use `Temporal.TimeZone.getOffsetFor()` to map a `Temporal.Absolute` instance and a time zone into the UTC offset at that instant in that time zone, as a string.

```javascript
{{cookbook/getUtcOffsetStringAtInstant.mjs}}
```

### UTC offset for a zoned event, as a number of seconds

It's a bit more complicated to do the above mapping as a number of seconds instead of a string.

```javascript
{{cookbook/getUtcOffsetSecondsAtInstant.mjs}}
```

### Offset between two time zones at an instant

With a small variation on the previous recipe we can map a `Temporal.Absolute` instance and two time zones into the signed difference of UTC offsets between those time zones at that instant, as a number of seconds.

```javascript
{{cookbook/getUtcOffsetDifferenceSecondsAtInstant.mjs}}
```

## Arithmetic

### Unit-constrained duration between now and a past/future zoned event

Map two Temporal.Absolute instances into an ascending/descending order indicator and a Temporal.Duration instance representing the duration between the two instants without using units coarser than specified (e.g., for presenting a meaningful countdown with vs. without using months or days).

```javascript
{{cookbook/getElapsedDurationSinceInstant.mjs}}
```

### Nearest offset transition in a time zone

Map a Temporal.Absolute instance and a Temporal.TimeZone object into a Temporal.Absolute instance representing the nearest following instant at which there is an offset transition in the time zone (e.g., for setting reminders).

```javascript
{{cookbook/getInstantOfNearestOffsetTransitionToInstant.mjs}}
```

### Comparison of an instant to business hours

This example takes a roster of opening and closing times for a business, and maps a localized date and time of day into a time-sensitive state indicator ("opening soon" vs. "open" vs. "closing soon" vs. "closed").

```javascript
{{cookbook/getBusinessOpenStateText.mjs}}
```

### Flight arrival/departure/duration

Map localized trip departure and arrival times into trip duration in units no larger than hours.

```javascript
{{cookbook/getTripDurationInHrMinSec.mjs}}
```

Map localized departure time and duration into localized arrival time.

```javascript
{{cookbook/getLocalizedArrival.mjs}}
```

### Push back a launch date

Add the number of days it took to get an approval, and advance to the start of the following month.

```javascript
{{cookbook/plusAndRoundToMonthStart.mjs}}
```

### Schedule a reminder ahead of matching a record-setting duration

When considering a record (for example, a personal-best time in a sport), you might want to receive an alert just before the record is about to be broken.
This example takes a record as a `Temporal.Duration`, the starting instant of the current attempt as a `Temporal.Absolute`, and another `Temporal.Duration` indicating how long before the potentially record-setting instant you would like to receive an alert.
It returns the instant at which a notification could be sent, for example "Keep going! 5 more minutes and it will be your personal best!"

This could be used for workout tracking, racing (including _long_ and potentially time-zone-crossing races like the Bullrun Rally, Iditarod, Self-Transcendence 3100, and Clipper Round The World), or even open-ended analogs like event-every-day "streaks".

```javascript
{{cookbook/getInstantBeforeOldRecord.mjs}}
```

### Nth weekday of the month

Example of getting a `Temporal.Date` representing the first Tuesday of the given `Temporal.YearMonth`, adaptable to other weekdays.

```javascript
{{cookbook/getFirstTuesdayOfMonth.mjs}}
```

### Next weekly occurrence

From a `Temporal.Absolute` instance and a local `Temporal.TimeZone`, get a `Temporal.DateTime` representing the next occurrence of a weekly event that is scheduled on a particular weekday and time in a particular time zone. (For example, "weekly on Thursdays at 08:45 California time").

```javascript
{{cookbook/nextWeeklyOccurrence.mjs}}
```

### Weekday of yearly occurrence

In some countries, when a public holiday falls on a Tuesday or Thursday, an extra "bridge" public holiday is observed on Monday or Friday in order to give workers a long weekend off.
The following example calculates this.

```javascript
{{cookbook/bridgePublicHolidays.mjs}}
```
