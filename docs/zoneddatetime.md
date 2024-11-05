# Temporal.ZonedDateTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.ZonedDateTime` is a timezone-aware, calendar-aware date/time type that represents a real event that has happened (or will happen) at a particular instant from the perspective of a particular region on Earth.
As the broadest `Temporal` type, `Temporal.ZonedDateTime` can be considered a combination of `Temporal.Instant`, `Temporal.PlainDateTime`, and a time zone.

As the only `Temporal` type that persists a time zone, `Temporal.ZonedDateTime` is optimized for use cases that require a time zone:

- Arithmetic automatically adjusts for Daylight Saving Time, using the rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545) and adopted in other libraries like moment.js.
- Creating derived values (e.g. change time to 2:30AM) can avoid worrying that the result will be invalid due to the time zone's DST rules.
- Properties are available to easily measure attributes like "length of day" or "starting time of day" which may not be the same on all days in all time zones due to DST transitions or political changes to the definitions of time zones.
- It's easy to flip back and forth between a human-readable representation (like `Temporal.PlainDateTime`) and the UTC timeline (like `Temporal.Instant`) without having to do any work to keep the two in sync.
- A date/time, an offset, a time zone, and an optional calendar can be persisted in a single string.
  This behavior is also be helpful for developers who are not sure which of those components will be needed by later readers of this data.
- Multiple time-zone-sensitive operations can be performed in a chain without having to repeatedly provide the same time zone.

A `Temporal.ZonedDateTime` instance can be losslessly converted into every other `Temporal` type except `Temporal.Duration`.
`Temporal.Instant`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, and `Temporal.PlainMonthDay` all carry less information and can be used when complete information is not required.

The `Temporal.ZonedDateTime` API is a superset of `Temporal.PlainDateTime`, which makes it easy to port code back and forth between the two types as needed. Because `Temporal.PlainDateTime` is not aware of time zones, in use cases where the time zone is known it's recommended to use `Temporal.ZonedDateTime` which will automatically adjust for DST and can convert easily to `Temporal.Instant` without having to re-specify the time zone.


## Time zone identifiers

Time zones in `Temporal` are represented by string identifiers from the IANA Time Zone Database (like `Asia/Tokyo`, `America/Los_Angeles`, or `UTC`) or by a fixed UTC offset like `+05:30`.
For example:

```javascript
inBerlin = Temporal.ZonedDateTime.from('2022-01-28T19:53+01:00[Europe/Berlin]');
inTokyo = inBerlin.withTimeZone('Asia/Tokyo');
```

## Handling changes to the IANA Time Zone Database

Time zone identifiers are occasionally renamed or merged in the IANA Time Zone Database.
For example, `Asia/Calcutta` was renamed to `Asia/Kolkata`, and `America/Montreal` was merged into `America/Toronto` because both identifiers are in the same country and share the same time zone rules since 1970.

Identifiers that have been renamed or merged are considered equivalent by ECMAScript.
Equivalence can be tested using `Temporal.ZonedDateTime.prototype.equals`.

```javascript
function areTimeZoneIdentifiersEquivalent(id1, id2) {
  return new Temporal.ZonedDateTime(0n, id1).equals(new Temporal.ZonedDateTime(0n, id2));
  // DON'T DO THIS: return id1 === id2;
}
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', 'ASIA/KOLKATA'); // => true
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', '+05:30'); // => false
areTimeZoneIdentifiersEquivalent('UTC', '+00:00'); // => false
```

Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones use the same offsets.
Similarly, a numeric-offset identifier is never equivalent to an IANA time zone identifier, even if they always represent the same offset.

In any set of equivalent identifiers, only one identifier will be considered canonical.
To avoid redundancy, the output of `Intl.supportedValuesOf('timeZone')` and `Temporal.Now.timeZoneId()` are limited to canonical identifiers.
Other than those cases, canonicalization is not observable in ECMAScript code, which ensures that changes to the IANA Time Zone Database will have minimal impact on the behavior of existing applications.

## Variation between ECMAScript and other consumers of the IANA Time Zone Database

The IANA Time Zone Database can be built with different options that can change which time zones are equivalent.
ECMAScript implementations generally use build options that guarantee at least one canonical identifier for every <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 Alpha-2</a> country code, and that ensure that identifiers for different country codes are never equivalent.
This behavior avoids the risk that future political changes in one country can affect the behavior of ECMAScript code using a different country's time zones.

For example, the default build options consider Europe/Oslo, Europe/Stockholm, Europe/Copenhagen, and Europe/Berlin to be equivalent.
However, ECMAScript implementations generally do not treat those as equivalent.

## Constructor

### **new Temporal.ZonedDateTime**(_epochNanoseconds_: bigint, _timeZone_: string, _calendar_: string = "iso8601") : Temporal.ZonedDateTime

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.
- `timeZone` (string): The time zone in which the event takes place.
- `calendar` (optional string): Calendar used to interpret dates and times.

**Returns:** a new `Temporal.ZonedDateTime` object.

Like all `Temporal` constructors, this constructor is an advanced API used to create instances for a narrow set of use cases.
Instead of the constructor, `Temporal.ZonedDateTime.from()` is preferred instead because it accepts more kinds of input and provides options for handling ambiguity and overflow.

The range of allowed values for this type is the same as the old-style JavaScript `Date`: 100 million (10<sup>8</sup>) days before or after the Unix epoch.
This range covers approximately half a million years. If `epochNanoseconds` is outside of this range, a `RangeError` will be thrown.

`timeZone` is a string containing the identifier of a built-in time zone, such as `'UTC'`, `'Europe/Madrid'`, or `'+05:30'`.

`calendar` is a string containing the identifier of a built-in calendar, such as `'islamic'` or `'gregory'`.
If omitted, the ISO 8601 calendar will be used, which is identical to the Gregorian calendar except negative years are used instead of eras like BC/BCE or AD/CE.

Usage examples:

<!-- prettier-ignore-start -->
```javascript
// UNIX epoch in California
new Temporal.ZonedDateTime(0n, 'America/Los_Angeles', 'iso8601');
  // => 1969-12-31T16:00:00-08:00[America/Los_Angeles]
new Temporal.ZonedDateTime(0n, 'America/Los_Angeles');
  // => 1969-12-31T16:00:00-08:00[America/Los_Angeles]
  // same, but shorter
```
<!-- prettier-ignore-end -->

## Static methods

### Temporal.ZonedDateTime.**from**(_item_: Temporal.ZonedDateTime | object | string, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `item`: a value convertible to a `Temporal.ZonedDateTime`.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.
  - `disambiguation` (string): How to disambiguate if the date and time given by `zonedDateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.
  - `offset` (string): How to interpret a provided time zone offset (e.g. `-02:00`) if it conflicts with the provided time zone (e.g. `America/Sao_Paulo`).
    Allowed values are `'use'`, `'ignore'`, `'prefer'`, and `'reject'`.
    The default is `'reject'`.

**Returns:** a new `Temporal.ZonedDateTime` object.

This static method creates a new `Temporal.ZonedDateTime` object from another value.
If the value is another `Temporal.ZonedDateTime` object, a new but otherwise identical object will be returned.
If the value is any other object, a `Temporal.ZonedDateTime` will be constructed from the values of any `timeZone`, `year` (or `era` and `eraYear`), `month` (or `monthCode`), `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and/or `calendar` properties that are present.
At least the `timeZone`, `year` (or `era` and `eraYear`), `month` (or `monthCode`), and `day` properties must be present. Other properties are optional.
If `calendar` is missing, it will be assumed to be `'iso8601'` (identifying the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates)).
Any other missing properties will be assumed to be 0 (for time fields).

Date/time values will be interpreted in context of the provided offset and/or time zone, depending on the `offset` option.

Date/time values in object inputs will be interpreted in the context of `calendar`.
However, date/time values in string inputs are always interpreted in the context of the ISO 8601 calendar.

If the value is not an object, it must be a string, which is expected to be an ISO 8601 string that includes a time zone ID in brackets, and an optional calendar.
For example:

```
2020-08-05T20:06:13+09:00[Asia/Tokyo][u-ca=japanese]
```

If the string isn't valid, then a `RangeError` will be thrown regardless of the value of `overflow`.

Note that this string format (albeit limited to the ISO 8601 calendar system) is also used by `java.time` and some other time-zone-aware libraries.
For more information on `Temporal`'s extensions to the ISO 8601 / RFC 3339 string format and the progress towards becoming a published standard, see [String Parsing, Serialization, and Formatting](./strings.md).

The time zone ID is always required.
`2020-08-05T20:06:13+09:00` and `2020-08-05T11:06:13Z` are not valid inputs to this method because they don't include a time zone ID in square brackets.
To parse these string formats, use `Temporal.Instant`:

```javascript
Temporal.Instant.from('2020-08-05T20:06:13+0900').toZonedDateTimeISO('Asia/Tokyo');
```

Usually a named IANA time zone like `Europe/Paris` or `America/Los_Angeles` is used, but there are cases where adjusting for DST or other time zone offset changes is not desired.
For these cases, non-DST-adjusting, single-offset time zones are available, e.g. `Etc/GMT-14` through `Etc/GMT+12`.
For historical reasons, signs are reversed between these time zones' names and their offsets.
For example, `Etc/GMT+8` would be used for cases where the UTC offset is always `-08:00`, e.g. ocean shipping off the coast of California.
If a non-whole-hour single-offset time zone is needed, the offset can be used as the time zone ID of an offset time zone.

```javascript
Temporal.ZonedDateTime.from('2020-08-05T20:06:13+05:45[+05:45]');
// OR
Temporal.Instant.from('2020-08-05T20:06:13+05:45').toZonedDateTimeISO('+05:45');
// => 2020-08-05T20:06:13+05:45[+05:45]
```

Note that using `Temporal.ZonedDateTime` with a single-offset time zone will not adjust for Daylight Saving Time or other time zone changes.
Therefore, using offset time zones with `Temporal.ZonedDateTime` is relatively unusual.
Instead of using `Temporal.ZonedDateTime` with an offset time zone, it may be easier for most use cases to use `Temporal.PlainDateTime` and/or `Temporal.Instant` instead.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`).
- In `'reject'` mode, the presence of out-of-range values (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`) will cause the function to throw a `RangeError`.

The `overflow` option is ignored if `item` is a string.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> In the default `'constrain'` mode and when parsing an ISO 8601 string, this will be converted to 59.
> In `'reject'` mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use `'reject'`.

If the input contains a time zone offset, in rare cases it's possible for those values to conflict for a particular local date and time.
For example, this could happen if the definition of a time zone is changed (e.g. to abolish DST) after storing a `Temporal.ZonedDateTime` as a string representing a far-future event.
If the time zone and offset are in conflict, then the `offset` option is used to resolve the conflict:

- `'use'`: Evaluate date/time values using the time zone offset if it's provided in the input.
  This will keep the exact time unchanged even if local time will be different than what was originally stored.
- `'ignore'`: Never use the time zone offset provided in the input. Instead, calculate the offset from the time zone.
  This will keep local time unchanged but may result in a different exact time than was originally stored.
- `'prefer'`: Evaluate date/time values using the offset if it's valid for this time zone.
  If the offset is invalid, then calculate the offset from the time zone.
  This option is rarely used when calling `from()`.
  See the documentation of `with()` for more details about why this option is used.
- `'reject'`: Throw a `RangeError` if the offset is not valid for the provided date and time in the provided time zone.

An example of why `offset` is needed is Brazil's abolition of DST in 2019.
This change meant that previously-stored values for 2020 and beyond might now be ambiguous.
For details about problems like this and how to solve them with `offset`, see [Ambiguity Caused by Permanent Changes to a Time Zone Definition](./timezone.md#ambiguity-caused-by-permanent-changes-to-a-time-zone-definition).

The `offset` option is ignored if an offset is not present in the input.
In that case, the time zone and the `disambiguation` option are used to convert date/time values to exact time.

The `disambiguation` option controls what time zone offset is used when the input time is ambiguous (as in the repeated clock hour after DST ends) or invalid due to offset changes skipping clock time (as in the skipped clock hour after DST starts):

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting nonexistent local time values to `Temporal.ZonedDateTime`.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Time Zones and Resolving Ambiguity](./timezone.md).

The `disambiguation` option is only used if there is no offset in the input, or if the offset is ignored by using the `offset` option as described above.
If the offset in the input is used, then there is no ambiguity and the `disambiguation` option is ignored.

> **NOTE**: The allowed values for the `item.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo]');
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo][u-ca=islamic]');
zdt = Temporal.ZonedDateTime.from('19951207T032430+0200[Africa/Cairo]');
/* WRONG */ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30');  // => throws RangeError: time zone ID required
/* WRONG */ zdt = Temporal.ZonedDateTime.from('1995-12-07T01:24:30Z');  // => throws RangeError: time zone ID required
/* WRONG */ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00');  // => throws RangeError: time zone ID required
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[+02:00]');  // OK (offset time zone) but rarely used
/* WRONG */ zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+03:00[Africa/Cairo]');
  // => RangeError: Offset is invalid for '1995-12-07T03:24:30' in 'Africa/Cairo'. Provided: +03:00, expected: +02:00.

zdt = Temporal.ZonedDateTime.from({
    timeZone: 'America/Los_Angeles',
    year: 1995,
    month: 12,
    day: 7,
    hour: 3,
    minute: 24,
    second: 30,
    millisecond: 0,
    microsecond: 3,
    nanosecond: 500
});  // => 1995-12-07T03:24:30.0000035-08:00[America/Los_Angeles]

// Different overflow modes
zdt = Temporal.ZonedDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'constrain' })
  // => 2001-12-01T00:00:00+01:00[Europe/Paris]
zdt = Temporal.ZonedDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'reject' })
  // => throws RangeError
```
<!-- prettier-ignore-end -->

### Temporal.ZonedDateTime.**compare**(_one_: Temporal.ZonedDateTime, _two_: Temporal.ZonedDateTime) : number

**Parameters:**

- `one` (`Temporal.ZonedDateTime`): First value to compare.
- `two` (`Temporal.ZonedDateTime`): Second value to compare.

**Returns:** an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` is less than `two`
- Zero if the two instances describe the same exact instant, ignoring the time zone and calendar
- 1 if `one` is greater than `two`

Comparison uses exact time, not calendar date and clock time, because sorting is almost always based on when events happen in the real world (and note that sorting by clock time may not match the order of actual occurrence near discontinuities such as DST transitions).

Calendars and time zones are also ignored in the comparison for the same reason.
For example, this method returns `0` for instances that fall on the same date and time in the ISO 8601 calendar and UTC time zone, even if fields like `day` or `hour` do not match due to use of different calendars and/or time zones.

This function can be used to sort arrays of `Temporal.ZonedDateTime` objects.
For example:

```javascript
arr = [
  Temporal.ZonedDateTime.from('2020-02-01T12:30-05:00[America/Toronto]'),
  Temporal.ZonedDateTime.from('2020-02-01T12:30-05:00[America/New_York]'),
  Temporal.ZonedDateTime.from('2020-02-01T12:30+01:00[Europe/Brussels]'),
  Temporal.ZonedDateTime.from('2020-02-01T12:30+00:00[Europe/London]')
];
sorted = arr.sort(Temporal.ZonedDateTime.compare);
JSON.stringify(sorted, undefined, 2);
// =>
// '[
//   "2020-02-01T12:30+01:00[Europe/Brussels]",
//   "2020-02-01T12:30+00:00[Europe/London]",
//   "2020-02-01T12:30-05:00[America/Toronto]",
//   "2020-02-01T12:30-05:00[America/New_York]"
// ]'
```

Note that in unusual cases like the repeated clock hour after DST ends, values that are later in the real world can be earlier in clock time, or vice versa.
To sort `Temporal.ZonedDateTime` values according to clock time only (which is a very rare use case), convert each value to `Temporal.PlainDateTime`.
For example:

<!-- prettier-ignore-start -->
```javascript
one = Temporal.ZonedDateTime.from('2020-11-01T01:45-07:00[America/Los_Angeles]');
two = Temporal.ZonedDateTime.from('2020-11-01T01:15-08:00[America/Los_Angeles]');
Temporal.ZonedDateTime.compare(one, two);
  // => -1
  // (because `one` is earlier in the real world)
Temporal.PlainDateTime.compare(one.toPlainDateTime(), two.toPlainDateTime());
  // => 1
  // (because `one` is later in clock time)
Temporal.Instant.compare(one.toInstant(), two.toInstant());
  // => -1
  // (because `Temporal.Instant` and `Temporal.ZonedDateTime` both compare real-world exact times)
```
<!-- prettier-ignore-end -->

## Properties

### zonedDateTime.**year** : number

### zonedDateTime.**month** : number

### zonedDateTime.**day** : number

### zonedDateTime.**hour**: number

### zonedDateTime.**minute**: number

### zonedDateTime.**second**: number

### zonedDateTime.**millisecond**: number

### zonedDateTime.**microsecond**: number

### zonedDateTime.**nanosecond**: number

The above read-only properties allow accessing each component of a date or time individually.

Date unit details:

- `year` is a signed integer representing the number of years relative to a calendar-specific epoch.
  For calendars that use eras, the anchor is usually aligned with the latest era so that `eraYear === year` for all dates in that era.
  However, some calendars use a different anchor (e.g., the Japanese calendar `year` matches the ISO 8601 and Gregorian calendars in counting from ISO year 0001 as `1`).
- `month` is a positive integer representing the ordinal index of the month in the current year.
  For calendars like Hebrew or Chinese that use leap months, the same-named month may have a different `month` value depending on the year.
  The first month in every year has `month` equal to `1`.
  The last month of every year has `month` equal to the `monthsInYear` property.
  `month` values start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).
- `monthCode` is a calendar-specific string that identifies the month in a year-independent way.
  For common (non-leap) months, `monthCode` should be `` `M${month}` ``, where `month` is zero padded up to two digits.
  For uncommon (leap) months in lunisolar calendars like Hebrew or Chinese, the month code is the previous month's code with an "L" suffix appended.
  Examples: `'M02'` => February; `'M08L'` => repeated 8th month in the Chinese calendar; `'M05L'` => Adar I in the Hebrew calendar.
- `day` is a positive integer representing the day of the month.

Either `month` or `monthCode` can be used in `from` or `with` to refer to the month.
Similarly, in calendars that use eras, an `era`/`eraYear` pair can be used in place of `year` when calling `from` or `with`.

Time unit details:

- `hour` is an integer between 0 and 23
- `minute` is an integer between 0 and 59
- `second` is an integer between 0 and 59.
  If 60 (for a leap second) was provided to `from` or `with`, 59 will stored and will be returned by this property.
- `millisecond` is an integer between 0 and 999
- `microsecond` is an integer between 0 and 999
- `nanosecond` is an integer between 0 and 999

Usage examples:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500[Europe/Rome]');
dt.year;        // => 1995
dt.month;       // => 12
dt.monthCode;   // => 'M12'
dt.day;         // => 7
dt.hour;        // => 3
dt.minute;      // => 24
dt.second;      // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond;  // => 500

dt = Temporal.ZonedDateTime.from('2019-02-23T03:24:30.000003500[Europe/Rome][u-ca=hebrew]');
dt.year;        // => 5779
dt.month;       // => 6
dt.monthCode;   // => 'M05L'
dt.day;         // => 18
dt.hour;        // => 3
dt.minute;      // => 24
dt.second;      // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond;  // => 500
```
<!-- prettier-ignore-end -->

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

### zonedDateTime.**epochMilliseconds**: number

### zonedDateTime.**epochNanoseconds**: bigint

The above two read-only properties give the integer number of milliseconds or nanoseconds (respectively) from the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) of January 1, 1970 at 00:00 UTC until `zonedDateTime`, ignoring leap seconds.

These properties are equivalent to `zonedDateTime.toInstant().epochMilliseconds` and `zonedDateTime.toInstant().epochNanoseconds`, respectively.
Any fractional milliseconds are truncated towards the beginning of time.
The time zone is irrelevant to these properties, because there is only one epoch, not one per time zone.

Note that the `epochMilliseconds` property is of type `number` (although only integers are returned) while the `epochNanoseconds` property is of type `bigint`.

The `epochMilliseconds` property is the easiest way to construct a legacy `Date` object from a `Temporal.ZonedDateTime` instance.

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-02-01T12:30+09:00[Asia/Tokyo]');
epochMs = zdt.epochMilliseconds;
  // => 1580527800000
zdt.toInstant().epochMilliseconds;
  // => 1580527800000
legacyDate = new Date(epochMs);
  // => 2020-02-01T03:30:00.000Z
  // (if the system time zone is America/Los_Angeles)
epochNanos = zdt.epochNanoseconds;
  // => 1580527800000000000n

// If you need epoch seconds data:
epochSecs = Math.floor(zdt.epochMillieconds / 1000); // => 1553906700
  // => 1580527800

// If you need epoch microseconds data:
// (Note the extra check for correct floor rounding with bigints)
ns = zdt.epochNanoseconds;
epochMicros = ns / 1000n + ((ns % 1000n) < 0n ? -1n : 0n);
  // => 1580527800000000n
```
<!-- prettier-ignore-end -->

### zonedDateTime.**calendarId** : object

The `calendarId` read-only property gives the identifier of the calendar used to calculate date/time field values.

Calendar-sensitive values are used in most places, including:

- Accessing properties like `.year` or `.month`
- Setting properties using `.from()` or `.with()`.
- Creating `Temporal.Duration` instances with `.since()`
- Interpreting `Temporal.Duration` instances with `.add()` or `.subtract()`
- Localized formatting with `toLocaleString()`, although if the calendar is ISO then the calendar can be overridden via an option
- All other places where date/time values are read or written, except as noted below

Calendar-specific date/time values are NOT used in only a few places:

- Extended ISO strings emitted by `.toString()`, because ISO-string date/time values are, by definition, using the ISO 8601 calendar
- In the values returned by the `getISOFields()` method which is explicitly used to provide ISO 8601 calendar values
- In arguments to the `Temporal.ZonedDateTime` constructor which is used for advanced use cases only

### zonedDateTime.**timeZoneId** : string

The `timeZoneId` read-only property is the identifier of the persistent time zone of `zonedDateTime`.

By storing its time zone, `Temporal.ZonedDateTime` is able to use that time zone when deriving other values, e.g. to automatically perform DST adjustment when adding or subtracting time.

Usually, the time zone ID will be an IANA time zone ID.
However, in unusual cases, a time zone can also be created from a time zone offset string like `+05:30`.
Offset time zones function just like IANA time zones except that their offset can never change due to DST or political changes.
This can be problematic for many use cases because by using an offset time zone you lose the ability to safely derive past or future dates because, even in time zones without DST, offsets sometimes change for political reasons (e.g. countries change their time zone).
Therefore, using an IANA time zone is recommended wherever possible.

Time zone identifiers are normalized before being used to determine the time zone.
For example, capitalization will be corrected to match the [IANA time zone database](https://www.iana.org/time-zones), and offsets like `+01` or `+0100` will be converted to `+01:00`.
Link names in the IANA Time Zone Database are not resolved to Zone names.

In very rare cases, you may choose to use `UTC` as your time zone ID.
This is generally not advised because no humans actually live in the UTC time zone; it's just for computers.
Also, UTC has no DST and always has a zero offset, which means that any action you'd take with `Temporal.ZonedDateTime` would return identical results to the same action on `Temporal.PlainDateTime` or `Temporal.Instant`.
Therefore, you should almost always use `Temporal.Instant` to represent UTC times.
When you want to convert UTC time to a real time zone, that's when `Temporal.ZonedDateTime` will be useful.

To change the time zone while keeping the exact time constant, use `.withTimeZone(timeZone)`.

The time zone is a required property when creating `Temporal.ZonedDateTime` instances.
If you don't know the time zone of your underlying data, please use `Temporal.Instant` and/or `Temporal.PlainDateTime`, neither of which have awareness of time zones.

Usage example:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
`Time zone is: ${zdt.timeZoneId}`;
  // => 'Time zone is: America/Los_Angeles'
zdt.withTimeZone('Asia/Kolkata').timeZoneId;
  // => Asia/Kolkata
zdt.withTimeZone('Asia/Calcutta').timeZoneId;
  // => Asia/Calcutta (does not follow links in the IANA Time Zone Database)

zdt.withTimeZone('europe/paris').timeZoneId;
  // => Europe/Paris (normalized to match IANA Time Zone Database capitalization)

zdt.withTimeZone('+05:00').timeZoneId;
  // => +05:00
zdt.withTimeZone('+05').timeZoneId;
  // => +05:00  (normalized to ±HH:MM)
zdt.withTimeZone('+0500').timeZoneId;
  // => +05:00  (normalized to ±HH:MM)
```
<!-- prettier-ignore-end -->

### zonedDateTime.**era** : string | undefined

### zonedDateTime.**eraYear** : number | undefined

In calendars that use eras, the `era` and `eraYear` read-only properties can be used together to resolve an era-relative year.
Both properties are `undefined` when using the ISO 8601 calendar.
As inputs to `from` or `with`, `era` and `eraYear` can be used instead of `year`.
Unlike `year`, `eraYear` may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

```javascript
date = Temporal.ZonedDateTime.from('-000015-01-01T12:30[Europe/Rome][u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
```

### zonedDateTime.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][zdt.dayOfWeek - 1]; // => 'THU'
```

### zonedDateTime.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
// ISO ordinal date
console.log(zdt.year, zdt.dayOfYear); // => '1995 341'
```

### zonedDateTime.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

When combining the week number with a year number, make sure to use `zonedDateTime.yearOfWeek` instead of `zonedDateTime.year`.
This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('2022-01-01T03:24-08:00[America/Los_Angeles]');
// ISO week date
console.log(zdt.yearOfWeek, zdt.weekOfYear, zdt.dayOfWeek); // => '2021 52 6'
```

### zonedDateTime.**yearOfWeek** : number

The `yearOfWeek` read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number.
For the ISO 8601 calendar, this is normally the same as `zonedDateTime.year`, but in a few cases it may be the previous or following year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

See `weekOfYear` for a usage example.

### zonedDateTime.**daysInWeek** : number

The `daysInWeek` read-only property gives the number of days in the week that the date falls in.
For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
zdt.daysInWeek; // => 7
```

### zonedDateTime.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const zdt = Temporal.Now.zonedDateTimeISO().with({ month });
  monthsByDays[zdt.daysInMonth] = (monthsByDays[zdt.daysInMonth] || []).concat(zdt);
}

const strings = monthsByDays[30].map((zdt) => zdt.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### zonedDateTime.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the date falls in.
For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

```javascript
zdt = Temporal.Now.zonedDateTimeISO();
percent = zdt.dayOfYear / zdt.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
```

### zonedDateTime.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the date falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1900-01-01T12:00+09:00[Asia/Tokyo]');
zdt.monthsInYear; // => 12
```

### zonedDateTime.**inLeapYear** : boolean

The `inLeapYear` read-only property tells whether the year of this `Temporal.ZonedDateTime` is a leap year.
Its value is `true` if the year is a leap year, and `false` if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

```javascript
// Is this year a leap year?
zdt = Temporal.Now.zonedDateTimeISO();
zdt.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
zdt.with({ year: 2100 }).inLeapYear; // => false
```

### zonedDateTime.**hoursInDay** : number

The `hoursInDay` read-only property returns the number of real-world hours between the start of the current day (usually midnight) in `zonedDateTime.timeZone` to the start of the next calendar day in the same time zone.
Normally days will be 24 hours long, but on days where there are DST changes or other time zone transitions, this property may return 23 or 25.
In rare cases, other integers or even non-integer values may be returned, e.g. when time zone definitions change by less than one hour.

If a time zone offset transition happens exactly at midnight, the transition will impact the previous day's length.

Note that transitions that skip entire days (like the 2011 [change](https://en.wikipedia.org/wiki/Time_in_Samoa#2011_time_zone_change) of `Pacific/Apia` to the opposite side of the International Date Line) will return `24` because there are 24 real-world hours between one day's midnight and the next day's midnight.

When the same day starts twice (due to an offset transition), `hoursInDay` reflects the total amount of time between the first start of the day, and the second end of the day. For example, on 2010-11-07 at 00:00:59 (1 minute after midnight), the `America/St_Johns` time zone transitioned from offset `-02:30` to offset `-03:30`, meaning that the time transitioned to 23:01:00 on the previous day. After 1 hour of wall-clock time passed, 2010-11-07 began again:

```javascript
const zdt = Temporal.ZonedDateTime.from('2010-11-07T23:00:00-03:30[America/St_Johns]);
zdt.hoursInDay; // 25
```
Similar examples include `America/Goose_Bay` before 2010, `America/Moncton` before 2006, `Pacific/Guam` and `Pacific/Saipan` in 1969, and `America/Phoenix` in 1944.

Usage example:

<!-- prettier-ignore-start -->
```javascript
Temporal.ZonedDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
  // => 24
  // (normal day)
Temporal.ZonedDateTime.from('2020-03-08T12:00-07:00[America/Los_Angeles]').hoursInDay;
  // => 23
  // (DST starts on this day)
Temporal.ZonedDateTime.from('2020-11-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
  // => 25
  // (DST ends on this day)
```
<!-- prettier-ignore-end -->

### zonedDateTime.**offsetNanoseconds** : number

The `offsetNanoseconds` read-only property is the offset (in nanoseconds) relative to UTC of `zonedDateTime`.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

To change the offset using `with` (or `from` using an property bag object instead of a string), use the string-typed `offset` field.
The numeric `offsetNanoseconds` field is read-only and is ignored in `with` and `from`.

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
zdt.offsetNanoseconds;
  // => -25200000000000
  // (-7 * 3600 * 1e9)
```
<!-- prettier-ignore-end -->

### zonedDateTime.**offset** : string

The `offset` read-only property is the offset (formatted as a string) relative to UTC of the current time zone and exact instant. Examples: `'-08:00'` or `'+05:30'`

The format used is defined in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC) standard.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

This field is used to uniquely map date/time fields to an exact date/time in cases where the calendar date and clock time are ambiguous due to time zone offset transitions.
Therefore, this field is accepted by `from` and `with`.
The presence of this field means that `zonedDateTime.toInstant()` requires no parameters.

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
zdt.offset;
  // => '-07:00'
zdt.withTimeZone('Asia/Kolkata').offset;
  // => '+05:30'

minus8Hours = '-08:00';
daylightTime0130 = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
  // => 2020-11-01T01:30:00-07:00[America/Los_Angeles]
  // This is Pacific Daylight Time 1:30AM
repeated0130 = daylightTime0130.with({ offset: minus8Hours });
  // => 2020-11-01T01:30:00-08:00[America/Los_Angeles]
  // This is Pacific Standard Time 1:30AM
```
<!-- prettier-ignore-end -->

## Methods

### zonedDateTime.**with**(_zonedDateTimeLike_: object, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `zonedDateTimeLike` (object): an object with some of the properties of a `Temporal.ZonedDateTime` (including `offset`, but not `timeZone` or `calendar`).
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.
  - `disambiguation` (string): How to handle date/time values that are ambiguous or invalid due to DST or other time zone offset changes.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.
  - `offset` (string): How to handle conflicts between time zone offset and time zone.
    Allowed values are `'prefer'`, `'use'`, `'ignore'`, and `'reject'`.
    The default is `'prefer'`.

**Returns:** a new `Temporal.ZonedDateTime` object.

This method creates a new `Temporal.ZonedDateTime` which is a copy of `zonedDateTime`, but any properties present on `zonedDateTimeLike` override the ones already present on `zonedDateTime`.

Since `Temporal.ZonedDateTime` objects each represent a fixed date and time, this method will create a new instance instead of modifying the existing instance.

If the result is earlier or later than the range of dates that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `zonedDateTimeLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

If a `timeZone` or `calendar` property is included, this function will throw an exception.
To convert to a new time zone while updating the clock time, use the `withTimeZone()` method, and to keep clock time as-is while resetting the time zone, use the `.toPlainDateTime()` method instead. Examples:

```javascript
// update local time to match new time zone
const sameInstantInOtherTz = zdt.withTimeZone('Europe/London');
// create instance with same local time in a new time zone
const newTzSameLocalTime = zdt.toPlainDateTime().toZonedDateTime('Europe/London');
```

Some input values can cause conflict between `zonedDateTime`'s time zone and its UTC offset.
This can happen when `offset` is included in the input, and can also happen when setting date/time values on the opposite side of a time zone offset transition like DST starting or ending.
The `offset` option can resolve this conflict.

Unlike the `from()` method where `offset` defaults to `'reject'`, the offset option in `with` defaults to `'prefer'`.
This default prevents DST disambiguation from causing unexpected one-hour changes in exact time after making small changes to clock time fields.
For example, if a `Temporal.ZonedDateTime` is set to the "second" 1:30AM on a day where the 1-2AM clock hour is repeated after a backwards DST transition, then calling `.with({minute: 45})` will result in an ambiguity which is resolved using the default `offset: 'prefer'` option.
Because the existing offset is valid for the new time, it will be retained so the result will be the "second" 1:45AM.
However, if the existing offset is not valid for the new result (e.g. `.with({hour: 0})`), then the default behavior will change the offset to match the new local time in that time zone.

If the `offset` option is set to `'ignore'` (or in very rare cases when `'prefer'` is used), then the object's current time zone and the `disambiguation` option determine the offset is used for times that are ambiguous due to DST and other time zone offset transitions.
Otherwise, the `offset` option determines the offset during skipped or repeated clock times and the `disambiguation` option is ignored.

Other than the `offset` option behaviors noted above, options on `with` behave identically to options on `from`.
See the documentation of `from` for more details on options behavior.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:00-06:00[America/Chicago]');
zdt.with({ year: 2015, minute: 31 }); // => 2015-12-07T03:31:00-06:00[America/Chicago]
```

### zonedDateTime.**withPlainTime**(_plainTime_?: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `plainTime` (optional `Temporal.PlainTime` or plain object or string): The clock time that should replace the current clock time of `zonedDateTime`.

**Returns:** a new `Temporal.ZonedDateTime` object which replaces the clock time of `zonedDateTime` with the clock time represented by `plainTime`.

The default `plainTime`, if it's not provided, is the first valid local time in `zonedDateTime`'s time zone on its calendar date.
Usually this is midnight (`00:00`), but may be a different time in rare circumstances like DST skipping midnight.

If provided, valid input to `withPlainTime` is the same as valid input to `Temporal.PlainTime.from`, including strings like `12:15:36`, plain object property bags like `{ hour: 20, minute: 30 }`, or `Temporal` objects that contain time fields: `Temporal.PlainTime`, `Temporal.ZonedDateTime`, or `Temporal.PlainDateTime`.

This method is similar to `with`, but with a few important differences:

- `withPlainTime` accepts strings, Temporal objects, or object property bags.
  `with` only accepts object property bags and does not accept strings nor `Temporal.PlainTime` objects because they can contain calendar information.
- `withPlainTime` will default all missing time units to zero, while `with` will only change units that are present in the input object.
- `withPlainTime` does not accept options like `disambiguation` or `offset`.
  For fine-grained control, use `with`.

If `plainTime` is a `Temporal.PlainTime` object, then this method returns the same result as `plainTime.toZonedDateTime({ plainTime: zonedDateTime, timeZone: zonedDateTime})` but can be easier to use, especially when chained to previous operations that return a `Temporal.ZonedDateTime`.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('2015-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');
zdt.withPlainTime({ hour: 10 }); // => 2015-12-07T10:00:00-08:00[America/Los_Angeles]
time = Temporal.PlainTime.from('11:22');
zdt.withPlainTime(time); // => 2015-12-07T11:22:00-08:00[America/Los_Angeles]
zdt.withPlainTime('12:34'); // => 2015-12-07T12:34:00-08:00[America/Los_Angeles]

// easier for chaining
zdt.add({ days: 2, hours: 22 }).withPlainTime('00:00'); // => 2015-12-10T00:00:00-08:00[America/Los_Angeles]
```

### zonedDateTime.**withTimeZone**(_timeZone_: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (object or string): The time zone into which to project `zonedDateTime`.

**Returns:** a new `Temporal.ZonedDateTime` object which is the date indicated by `zonedDateTime`, projected into `timeZone`.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+09:00[Asia/Tokyo]');
zdt.toString(); // => '1995-12-07T03:24:30+09:00[Asia/Tokyo]'
zdt.withTimeZone('Africa/Accra').toString(); // => '1995-12-06T18:24:30+00:00[Africa/Accra]'
```

### zonedDateTime.**withCalendar**(_calendar_: object | string) : Temporal.ZonedDateTime

**Parameters:**

- `calendar` (object or string): The calendar into which to project `zonedDateTime`.

**Returns:** a new `Temporal.ZonedDateTime` object which is the date indicated by `zonedDateTime`, projected into `calendar`.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+09:00[Asia/Tokyo][u-ca=japanese]');
`${zdt.era} ${zdt.eraYear}`; // => 'heisei 7'
zdt.withCalendar('gregory').eraYear; // => 1995
```

### zonedDateTime.**add**(_duration_: object, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.ZonedDateTime` object representing the sum of `zonedDateTime` plus `duration`.

This method adds `duration` to `zonedDateTime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object. Adding a negative duration like `{ hours: -5, minutes: -30 }` is equivalent to subtracting the absolute value of that duration.

Addition and subtraction are performed according to rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545):

- Add/subtract the date portion of a duration using calendar arithmetic (like `Temporal.PlainDateTime`).
  The result will automatically adjust for Daylight Saving Time using the rules of this instance's `timeZone` field.
- Add/subtract the time portion of a duration using real-world time (like `Temporal.Instant`).
- If a result is ambiguous or invalid due to a time zone offset transition, the later of the two possible instants will be used for time-skipped transitions and the earlier of the two possible instants will be used for time-repeated transitions.
  This behavior corresponds to the default `disambiguation: 'compatible'` option used in `from` and used by legacy `Date` and moment.js.

These rules make arithmetic with `Temporal.ZonedDateTime` "DST-safe", which means that the results most closely match the expectations of both real-world users and implementers of other standards-compliant calendar applications. These expectations include:

- Adding or subtracting days should keep clock time consistent across DST transitions.
  For example, if you have an appointment on Saturday at 1:00PM and you ask to reschedule it 1 day later, you would expect the reschedule appointment to still be at 1:00PM, even if there was a DST transition overnight.
- Adding or subtracting the time portion of a duration should ignore DST transitions.
  For example, a friend you've asked to meet in in 2 hours will be annoyed if you show up 1 hour or 3 hours later.
- There should be a consistent and relatively-unsurprising order of operations.
- If results are at or near a DST transition, ambiguities should be handled automatically (no crashing) and deterministically.

Some arithmetic operations may be ambiguous, e.g. because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, a result that would be out of range causes a `RangeError` to be thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-03-08T00:00-08:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
laterDay = zdt.add({ days: 1 });
  // => 2020-03-09T00:00:00-07:00[America/Los_Angeles]
  // Note that the new offset is different, indicating the result is adjusted for DST.
laterDay.since(zdt, { largestUnit: 'hour' }).hours;
  // => 23
  // because one clock hour lost to DST

laterHours = zdt.add({ hours: 24 });
  // => 2020-03-09T01:00:00-07:00[America/Los_Angeles]
  // Adding time units doesn't adjust for DST. Result is 1:00AM: 24 real-world
  // hours later because a clock hour was skipped by DST.
laterHours.since(zdt, { largestUnit: 'hour' }).hours; // => 24
```
<!-- prettier-ignore-end -->

### zonedDateTime.**subtract**(_duration_: object, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.ZonedDateTime` object representing the result of `zonedDateTime` minus `duration`.

This method subtracts a `duration` from `zonedDateTime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object. Subtracting a negative duration like `{ hours: -5, minutes: -30 }` is equivalent to adding the absolute value of that duration.

Addition and subtraction are performed according to rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545), as described above in `add()`.

Some arithmetic operations may be ambiguous, e.g. because months have different lengths.
For example, subtracting one month from October 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, a result that would be out of range causes a `RangeError` to be thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-03-09T00:00-07:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
earlierDay = zdt.subtract({ days: 1 });
  // => 2020-03-08T00:00:00-08:00[America/Los_Angeles]
  // Note that the new offset is different, indicating the result is adjusted for DST.
earlierDay.since(zdt, { largestUnit: 'hour' }).hours;
  // => -23
  // because one clock hour lost to DST

earlierHours = zdt.subtract({ hours: 24 });
  // => 2020-03-07T23:00:00-08:00[America/Los_Angeles]
  // Subtracting time units doesn't adjust for DST. Result is 11:00PM: 24 real-world
  // hours earlier because a clock hour was skipped by DST.
earlierHours.since(zdt, { largestUnit: 'hour' }).hours; // => -24
```
<!-- prettier-ignore-end -->

### zonedDateTime.**until**(_other_: Temporal.ZonedDateTime, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.LocalZonedDateTime`): Another date/time until when to compute the difference.
- `options` (optional object): An object which may have some or all of the following properties:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time after `zonedDateTime` and until `other`.

This method computes the difference between the two times represented by `zonedDateTime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `zonedDateTime` then the resulting duration will be negative.
If using the default `options`, adding the returned `Temporal.Duration` to `zonedDateTime` will yield `other`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
For example, a difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`.
However, a difference of 30 seconds will still be 30 seconds if `largestUnit` is `"hours"`.
A value of `'auto'` means `'hour'`, unless `smallestUnit` is `'year'`, `'month'`, `'week'`, or `'day'`, in which case `largestUnit` is equal to `smallestUnit`.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to an increment expressed in days or larger units requires a reference point, `zonedDateTime` is used as the starting point in that case.
The default is to do no rounding.

The duration returned is a "hybrid" duration.
This means that the duration's date portion represents full calendar days like `Temporal.PlainDateTime.prototype.until()` would return, while its time portion represents real-world elapsed time like `Temporal.Instant.prototype.until()` would return.
This "hybrid duration" approach automatically adjusts for DST and matches widely-adopted industry standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).
It also matches the behavior of popular JavaScript libraries like moment.js and date-fns.

Examples:

- Difference between 2:30AM on the day before DST starts and 3:30AM on the day DST starts => `P1DT1H`
  (even though it's only 24 hours of real-world elapsed time)
- Difference between 1:45AM on the day before DST starts and the "second" 1:15AM on the day DST ends => `PT24H30M`
  (because it hasn't been a full calendar day even though it's been 24.5 real-world hours).

If `largestUnit` is `'hour'` or smaller, then the result will be the same as if `Temporal.Instant.prototype.until()` was used.
If both values have the same local time, then the result will be the same as if `Temporal.PlainDateTime.prototype.until()` was used.
To calculate the difference between calendar dates only, use `.toPlainDate().until(other.toPlainDate())`.
To calculate the difference between clock times only, use `.toPlainTime().until(other.toPlainTime())`.

If the other `Temporal.ZonedDateTime` is in a different time zone, then the same days can be different lengths in each time zone, e.g. if only one of them observes DST.
Therefore, a `RangeError` will be thrown if `largestUnit` is `'day'` or larger and the two instances' time zones are not equal, using the same equality algorithm as `Temporal.ZonedDateTime.prototype.equals`.
To work around this same-time-zone requirement, transform one of the instances to the other's time zone using `.withTimeZone(other.timeZone)` and then calculate the same-timezone difference.
Because of the complexity and ambiguity involved in cross-timezone calculations involving days or larger units, `'hour'` is the default for `largestUnit`.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two dates in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `zonedDateTime.withCalendar`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+05:30[Asia/Kolkata]');
zdt2 = Temporal.ZonedDateTime.from('2019-01-31T15:30+05:30[Asia/Kolkata]');
zdt1.until(zdt2);
  // => PT202956H5M29.9999965S
zdt1.until(zdt2, { largestUnit: 'year' });
  // => P23Y1M24DT12H5M29.9999965S
zdt2.until(zdt1, { largestUnit: 'year' });
  // => -P23Y1M24DT12H5M29.9999965S
zdt1.until(zdt2, { largestUnit: 'nanosecond' });
  // => PT730641929.999996544S
  // (precision lost)

// Rounding, for example if you don't care about sub-seconds
zdt1.until(zdt2, { smallestUnit: 'second' });
  // => PT202956H5M29S

// Months and years can be different lengths
[jan1, feb1, mar1] = [1, 2, 3].map((month) =>
  Temporal.ZonedDateTime.from({ year: 2020, month, day: 1, timeZone: 'Asia/Seoul' })
);
jan1.until(feb1, { largestUnit: 'day' }); // => P31D
jan1.until(feb1, { largestUnit: 'month' }); // => P1M
feb1.until(mar1, { largestUnit: 'day' }); // => P29D
feb1.until(mar1, { largestUnit: 'month' }); // => P1M
jan1.until(mar1, { largestUnit: 'day' }); // => P60D
```
<!-- prettier-ignore-end -->

### zonedDateTime.**since**(_other_: Temporal.ZonedDateTime, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.LocalZonedDateTime`): Another date/time since when to compute the difference.
- `options` (optional object): An object which may have some or all of the following properties:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time before `zonedDateTime` and since `other`.

This method computes the difference between the two times represented by `zonedDateTime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `zonedDateTime` then the resulting duration will be negative.

This method is similar to `Temporal.ZonedDateTime.prototype.until()`, but reversed.
If using the default `options`, subtracting the returned `Temporal.Duration` from `zonedDateTime` will yield `other`, and `zdt1.since(zdt2)` will yield the same result as `zdt1.until(zdt2).negated()`.

Usage example:

```javascript
zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+05:30[Asia/Kolkata]');
zdt2 = Temporal.ZonedDateTime.from('2019-01-31T15:30+05:30[Asia/Kolkata]');
zdt2.since(zdt1); // => PT202956H5M29.9999965S
```

### zonedDateTime.**round**(_roundTo_: string | object) : Temporal.ZonedDateTime

**Parameters:**

- `roundTo` (string | object): A required string or object to control the operation.
  - If a string is provided, the resulting `Temporal.ZonedDateTime` object will be rounded to that unit.
    Valid values are `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    A string parameter is treated the same as an object whose `smallestUnit` property value is that string.
  - If an object is passed, the following properties are recognized:
    - `smallestUnit` (required string): The unit to round to.
      Valid values are `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
      The default is 1.
    - `roundingMode` (string): How to handle the remainder.
      Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
      The default is `'halfExpand'`.

**Returns:** a new `Temporal.ZonedDateTime` object which is `zonedDateTime` rounded to `roundTo` (if a string parameter is used) or `roundingIncrement` of `smallestUnit` (if an object parameter is used).

Rounds `zonedDateTime` to the given unit and increment, and returns the result as a new `Temporal.ZonedDateTime` object.

The `smallestUnit` option (or the value of `roundTo` if a string parameter is used) determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `{ smallestUnit: 'minute', roundingIncrement: 30 }`.

The value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
(For example, if `smallestUnit` is `'minute'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.)

If `smallestUnit` is `'day'`, then 1 is the only allowed value for `roundingIncrement`.

The `roundingMode` option controls how the rounding is performed.

- `'ceil'`, `'expand'`: Always round up, towards the end of time.
- `'floor'`, `'trunc'`: Always round down, towards the beginning of time.
- `'halfCeil'`, `'halfExpand'`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `'ceil'`.
- `'halfFloor'`, `'halfTrunc'`: Round to the nearest of the allowed values, like `'halfExpand'`, but when there is a tie, round down, like `'floor'`.
- `'halfEven'`: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of `roundingIncrement`.
  For example, with a `roundingIncrement` of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).

Several pairs of modes behave the same as each other, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.

The default rounding mode is `'halfExpand'` to match how rounding is often taught in school.
Note that this is different than the `'trunc'` default used by `until` and `since` options because rounding up would be an unexpected default for those operations.
Other properties behave identically between these methods.

Example usage:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');

// Round to a particular unit
zdt.round({ smallestUnit: 'hour' });
  // => 1995-12-07T03:00:00-08:00[America/Los_Angeles]
// Round to an increment of a unit, e.g. half an hour:
zdt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 1995-12-07T03:30:00-08:00[America/Los_Angeles]
// Round to the same increment but round down instead:
zdt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 1995-12-07T03:00:00-08:00[America/Los_Angeles]
```
<!-- prettier-ignore-end -->

### zonedDateTime.**startOfDay**() : Temporal.ZonedDateTime

**Returns:** A new `Temporal.ZonedDateTime` instance representing the earliest valid local clock time during the current calendar day and time zone of `zonedDateTime`.

This method returns a new `Temporal.ZonedDateTime` indicating the start of the day.
The local time of the result is almost always `00:00`, but in rare cases it could be a later time e.g. if DST skips midnight in a time zone. For example:

```javascript
const zdt = Temporal.ZonedDateTime.from('2015-10-18T12:00-02:00[America/Sao_Paulo]');
zdt.startOfDay(); // => 2015-10-18T01:00:00-02:00[America/Sao_Paulo]
```

When the same day starts twice (due to an offset transition), the earlier time is used for `startOfDay`. For example, the `America/St_Johns` time zone transitioned from offset `-02:30` to offset `-03:30` on 2010-11-07:

```javascript
const zdt = Temporal.ZonedDateTime.from('2010-11-07T23:00:00-03:30[America/St_Johns]');
zdt.startOfDay(); // 2010-11-07T00:00:00-02:30[America/St_Johns]
```

Usage example:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').startOfDay();
  // => 2020-01-01T00:00:00-08:00[America/Los_Angeles]
zdt = Temporal.ZonedDateTime.from('2018-11-04T12:00-02:00[America/Sao_Paulo]').startOfDay();
  // => 2018-11-04T01:00:00-02:00[America/Sao_Paulo]
  // Note the 1:00AM start time because the first clock hour was skipped due to DST transition
  // that started at midnight.
```
<!-- prettier-ignore-end -->

### zonedDateTime.**getTimeZoneTransition**(direction: string | object) : Temporal.ZonedDateTime | null

**Parameters:**

- `direction` (string | object): A required string or object to control the operation.
  A string parameter is treated the same as an object whose `direction` property value is that string.
  If an object is passed, the following properties are recognized:
    - `direction` (required string): The direction in which to search for the closest UTC offset transition.
      Valid values are `'next'` and `'previous'`.

**Returns:** A `Temporal.ZonedDateTime` object representing the following UTC offset transition in `zonedDateTime`'s time zone in the given direction, or `null` if no transitions farther than `zonedDateTime` could be found.

This method is used to calculate the closest past or future UTC offset transition from `zonedDateTime` for its time zone.
A "transition" is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops.
Transitions can also be caused by other political changes like a country permanently changing the UTC offset of its time zone.

The returned `Temporal.ZonedDateTime` will represent the first nanosecond where the newer UTC offset is used, not the last nanosecond where the previous UTC offset is used.

When no more transitions are expected in the given directoin, this method will return `null`.
Some time zones (e.g., `Etc/GMT+5` or `-05:00`) have no offset transitions.
If `zonedDateTime` has one of these time zones, this method will always return `null`.

Example usage:

```javascript
// How long until the next offset change from now, in the current location?
tz = Temporal.Now.timeZoneId();
now = Temporal.Now.zonedDateTimeISO(tz);
nextTransition = now.getTimeZoneTransition('next');
duration = nextTransition.since(now);
duration.toLocaleString(); // output will vary

// How long until the previous offset change from now, in the current location?
previousTransition = now.getTimeZoneTransition('previous');
duration = now.since(previousTransition);
duration.toLocaleString(); // output will vary
```

### zonedDateTime.**equals**(_other_: Temporal.ZonedDateTime) : boolean

**Parameters:**

- `other` (`Temporal.ZonedDateTime`): Another date/time to compare.

**Returns:** `true` if `zonedDateTime` and `other` are have equivalent fields (date/time fields, offset, time zone ID, and calendar ID), or `false` if not.

Compares two `Temporal.ZonedDateTime` objects for equality.

This function exists because it's not possible to compare using `zonedDateTime == other` or `zonedDateTime === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which two events occur, then this function is easier to use than `Temporal.ZonedDateTime.compare`.
However, there are subtle differences between the two methods—a `true` result from `equals` includes comparison of calendar and time zone, and is therefore stronger than a `0` result from compare (which ignores calendar and time zone).

Note that two `Temporal.ZonedDateTime` instances can have the same clock time, time zone, and calendar but still be unequal, e.g. when a clock hour is repeated after DST ends in the Fall.
In this case, the two instances will have different `offsetNanoseconds` field values.

To ignore calendars, convert both instances to use the ISO 8601 calendar:

```javascript
zdt.withCalendar('iso8601').equals(other.withCalendar('iso8601'));
```

To ignore both time zones and calendars, compare the instants of both:

```javascript
zdt.toInstant().equals(other.toInstant());
```

To compare time zone IDs directly, compare two ZonedDateTimes with the same instant and calendar:

```javascript
zdt.withTimeZone(id1).equals(zdt.withTimeZone(id2));
```

The time zones of _zonedDateTime_ and _other_ are considered equivalent by the following algorithm:

- If both time zone identifiers are Zone or Link names in the [IANA Time Zone Database](https://www.iana.org/time-zones), and they resolve to the same Zone name, the time zones are equivalent.
  This resolution is case-insensitive.
- If both identifiers are numeric offset time zone identifiers like "+05:30", and they represent the same offset, the time zones are equivalent.
- Otherwise, the time zones are not equivalent.

Note that "resolve to the same Zone name" noted above is behavior that can vary between ECMAScript and other consumers of the IANA Time Zone Database.
ECMAScript implementations generally do not allow identifiers to be equivalent if they represent different <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 Alpha-2</a> country codes.
However, non-ECMAScript platforms may merge Zone names across country boundaries.
See [above](#variation-between-ecmascript-and-other-consumers-of-the-iana-time-zone-database) to learn more about this variation.

Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones always use the same offsets.
Offset time zones and IANA time zones are also never equivalent.

Example usage:

```javascript
zdt1 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Paris]');
zdt2 = Temporal.ZonedDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Brussels]');
zdt1.equals(zdt2); // => false (same offset but different time zones)
zdt1.equals(zdt1); // => true

// To compare time zone IDs, use withTimeZone() with each ID on the same
// ZonedDateTime instance, and use equals() to compare
kolkata = zdt1.withTimeZone('Asia/Kolkata');
kolkata.equals(zdt.withTimeZone('Asia/Calcutta')); // => true

// Offset time zones are never equivalent to named time zones
kolkata.equals(zdt.withTimeZone('+05:30')); // => false
zeroOffset = zdt1.withTimeZone('+00:00');
zeroOffset.equals(zdt1.withTimeZone('UTC'));  // => false

// For offset time zones, any valid format is accepted
zeroOffset.equals(zdt1.withTimeZone('+00:00')); // => true
zeroOffset.equals(zdt1.withTimeZone('+0000')); // => true
zeroOffset.equals(zdt1.withTimeZone('+00')); // => true
```

### zonedDateTime.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `offset` (string): Whether to show the time zone offset in the return value.
    Valid values are `'auto'` and `'never'`.
    The default is `'auto'`.
  - `timeZoneName` (string): Whether to show the time zone name annotation in the return value.
    Valid values are `'auto'`, `'never'`, and `'critical'`.
    The default is `'auto'`.
  - `calendarName` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, `'never'`, and `'critical'`.
    The default is `'auto'`.
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`.

**Returns:** a string containing an ISO 8601 date+time+offset format, a bracketed time zone suffix, and (if the calendar is not `iso8601`) a calendar suffix.

Examples:

- `2011-12-03T10:15:30+01:00[Europe/Paris]`
- `2011-12-03T10:15:30+09:00[Asia/Tokyo][u-ca=japanese]`

This method overrides the `Object.prototype.toString()` method and provides a convenient string representation of `zonedDateTime`.
The string is "round-trippable".
This means that it can be passed to `Temporal.ZonedDateTime.from()` to create a new `Temporal.ZonedDateTime` object with the same field values as the original.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.PlainDateTime.round()`.
Note that rounding may change the value of other units as well.

Normally, a calendar annotation is shown when `zonedDateTime`'s calendar is not the ISO 8601 calendar.
By setting the `calendarName` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
Normally not necessary, a value of `'critical'` is equivalent to `'always'` but the annotation will contain an additional `!` for certain interoperation use cases.
For more information on the calendar annotation, see [ISO string extensions](./strings.md#calendar-systems).

Likewise, passing `'never'` to the `timeZoneName` or `offset` options controls whether the time zone offset (`+01:00`) or name annotation (`[Europe/Paris]`) are shown.
If the time zone offset is shown, it is always shown rounded to the nearest minute.
The `timeZoneName` option can additionally be `'critical'` which will add an additional `!` to the annotation, similar to `calendarName`.

The string format output by this method can be parsed by [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html) as long as the calendar annotation is not output and `'critical'` is not used.
For more information on `Temporal`'s extensions to the ISO 8601 / RFC 3339 string format and the progress towards becoming a published standard, see [String Parsing, Serialization, and Formatting](./strings.md).

Example usage:

```javascript
zdt = Temporal.ZonedDateTime.from({ year: 2019, month: 12, day: 1, hour: 12, timeZone: 'Africa/Lagos' });
zdt.toString(); // => '2019-12-01T12:00:00+01:00[Africa/Lagos]'
zdt = zdt.withCalendar('japanese');
zdt.toString(); // => '2019-12-01T12:00:00+01:00[Africa/Lagos][u-ca=japanese]'
```

### zonedDateTime.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `zonedDateTime`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `zonedDateTime`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

`options.timeZone` will be automatically set from the time zone of `zonedDateTime`.
If a different time zone ID is provided in `options.timeZone`, a RangeError will be thrown.
To display a `Temporal.ZonedDateTime` value in a different time zone, use `withTimeZone(timeZone).toLocaleString()`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
zdt = Temporal.ZonedDateTime.from('2019-12-01T12:00+01:00[Europe/Berlin]');
zdt.toLocaleString(); // example output: 12/1/2019, 12:00:00 PM
zdt.toLocaleString('de-DE'); // => '1.12.2019, 12:00:00 MEZ'
options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
zdt.toLocaleString('de-DE', options); // => 'Sonntag, 1. Dezember 2019'
/* WRONG */ zdt.toLocaleString('de-DE', { timeZone: 'Pacific/Auckland' });
  // => RangeError: Time zone option Pacific/Auckland does not match actual time zone Europe/Berlin
zdt.withTimeZone('Pacific/Auckland').toLocaleString('de-DE'); // => '2.12.2019, 0:00:00 GMT+13'
zdt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => '１２/１/２０１９, １２:００:００ PM GMT+１'
```
<!-- prettier-ignore-end -->

### zonedDateTime.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `zonedDateTime`.

This method is the same as `zonedDateTime.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.ZonedDateTime` object from a string, is `Temporal.ZonedDateTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.ZonedDateTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.ZonedDateTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const event = {
  id: 311,
  name: 'FictionalConf 2018',
  openingZonedDateTime: Temporal.ZonedDateTime.from('2018-07-06T10:00+05:30[Asia/Kolkata]'),
  closingZonedDateTime: Temporal.ZonedDateTime.from('2018-07-08T18:15+05:30[Asia/Kolkata]')
};
const str = JSON.stringify(event, null, 2);
console.log(str);
// =>
// {
//   "id": 311,
//   "name": "FictionalConf 2018",
//   "openingZonedDateTime": "2018-07-06T10:00+05:30[Asia/Kolkata]",
//   "closingZonedDateTime": "2018-07-08T18:15+05:30[Asia/Kolkata]"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('ZonedDateTime')) return Temporal.ZonedDateTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### zonedDateTime.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.ZonedDateTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.ZonedDateTime.compare()` for this, or `zonedDateTime.equals()` for equality.

### zonedDateTime.**toInstant**() : Temporal.Instant

**Returns:** A `Temporal.Instant` object that represents the same instant as `zonedDateTime`.

### zonedDateTime.**toPlainDate**() : Temporal.PlainDate

**Returns:** a `Temporal.PlainDate` object that is the same as the date portion of `zonedDateTime`.

### zonedDateTime.**toPlainTime**() : Temporal.PlainTime

**Returns:** a `Temporal.PlainTime` object that is the same as the wall-clock time portion of `zonedDateTime`.

### zonedDateTime.**toPlainDateTime**() : Temporal.PlainDateTime

**Returns:** a `Temporal.PlainDateTime` object that is the same as the date and time portion of `zonedDateTime`.

> **NOTE**: After a `Temporal.ZonedDateTime` is converted to `Temporal.PlainDateTime`, it will no longer be aware of its time zone.
> This means that subsequent operations like arithmetic or `with` will not adjust for DST and may not yield the same results as equivalent operations with `Temporal.ZonedDateTime`.
> However, unless you perform those operations across a time zone offset transition, it's impossible to notice the difference.
> Therefore, be very careful when performing this conversion because subsequent results may look correct most of the time while failing around time zone transitions like when DST starts or ends.

The above four methods can be used to convert `Temporal.ZonedDateTime` into a `Temporal.Instant`, `Temporal.PlainDate`, `Temporal.PlainTime`, or `Temporal.PlainDateTime`, respectively.
The converted object carries a copy of all the relevant data of `zonedDateTime` (for example, in `toPlainDate()`, the `year`, `month`, and `day` properties are the same.)

To convert to `Temporal.PlainYearMonth` or `Temporal.PlainMonthDay`, first use `toPlainDate()` and go from there.

Usage example:

```javascript
zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30+02:00[Africa/Johannesburg]');
zdt.toInstant(); // => 1995-12-07T01:24:30Z
zdt.toPlainDateTime(); // => 1995-12-07T03:24:30
zdt.toPlainDate(); // => 1995-12-07
zdt.toPlainTime(); // => 03:24:30
zdt.toPlainDate().toPlainYearMonth(); // => 1995-12
zdt.toPlainDate().toPlainMonthDay(); // => 12-07
```
