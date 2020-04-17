# Temporal Cookbook

## Overview

<!-- toc -->

## Running the cookbook files

Running cookbook files:

```bash
node --experimental-modules --no-warnings \
	--icu-data-dir ./polyfill/node_modules/full-icu/ \
	-r ./polyfill/index.js ./docs/cookbook/${cookbookFile}
```

_The above code allows `Temporal` to exist as a global object before the cookbook file runs._

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

### Comparison of an instant to business hours

This example takes a roster of opening and closing times for a business, and maps a localized date and time of day into a time-sensitive state indicator ("opening soon" vs. "open" vs. "closing soon" vs. "closed").

```javascript
{{cookbook/getBusinessOpenStateText.mjs}}
```

### Nth weekday of the month

Example of getting a `Temporal.Date` representing the first Tuesday of the given `Temporal.YearMonth`, adaptable to other weekdays.

```javascript
{{cookbook/getFirstTuesdayOfMonth.mjs}}
```
