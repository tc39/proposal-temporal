# Temporal.LocalDateTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

> **NOTE**: This type has been approved and will be merged soon (probably early October 2020), but it's not in current builds yet.
> Also, "LocalDateTime" is a placeholder name. Its final name is being discussed [here](https://github.com/tc39/proposal-temporal/issues/707).
> If you have feedback about this new type, visit https://github.com/tc39/proposal-temporal/issues/700.

A `Temporal.LocalDateTime` is a time-zone-aware, calendar-aware date/time type that represents a real event that has happened (or will happen) at a particular instant in a real place on Earth.
As the broadest `Temporal` type, `Temporal.LocalDateTime` can be considered a combination of `Temporal.TimeZone`, `Temporal.Instant`, and `Temporal.DateTime` (which includes `Temporal.Calendar`).

As the only `Temporal` type that persists a time zone, `Temporal.LocalDateTime` is optimized for use cases that require a time zone:

- Arithmetic automatically adjusts for Daylight Saving Time, using the rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545) and adopted in other libraries like moment.js.
- Creating derived values (e.g. change time to 2:30AM) can avoid worrying that the result will be invalid due to the time zone's DST rules.
- Properties are available to easily measure attributes like "length of day" or "starting time of day" which may not be the same on all days in all time zones due to DST transitions or political changes to the definitions of time zones.
- It's easy to flip back and forth between a human-readable representation (like `Temporal.DateTime`) and the UTC timeline (like `Temporal.Instant`) without having to do any work to keep the two in sync.
- A date/time, an offset, a time zone, and an optional calendar can be persisted in a single string that can be sorted alphabetically by when instants happened in the real world.
  This behavior is also be helpful for developers who are not sure which of those components will be needed by later readers of this data.
- Multiple time-zone-sensitive operations can be performed in a chain without having to repeatedly provide the same time zone.

A `Temporal.LocalDateTime` instance can be losslessly converted into every other `Temporal` type except `Temporal.Duration`.
`Temporal.Instant`, `Temporal.DateTime`, `Temporal.Date`, `Temporal.Time`, `Temporal.YearMonth`, and `Temporal.MonthDay` all carry less information and can be used when complete information is not required.

The `Temporal.LocalDateTime` API is a superset of `Temporal.DateTime`, which makes it easy to port code back and forth between the two types as needed. Because `Temporal.DateTime` is not aware of time zones, in use cases where the time zone is known it's recommended to use `Temporal.LocalDateTime` which will automatically adjust for DST and can convert easily to `Temporal.Instant` without having to re-specify the time zone.

## Constructor

### **new Temporal.LocalDateTime**(_epochNanoseconds_: bigint, _timeZone_: string | object, _calendar_: string | object) : Temporal.LocalDateTime

**Parameters:**

- `epochNanoseconds` (bigint): A number of nanoseconds.
- `timeZone` (`Temporal.TimeZone` or plain object): The time zone in which the event takes place.
- `calendar` (optional `Temporal.Calendar` or plain object): Calendar used to interpret dates and times. Usually set to `'iso8601'`.

**Returns:** a new `Temporal.LocalDateTime` object.

Like all `Temporal` constructors, this constructor is an advanced API used to create instances for a narrow set of use cases.
Instead of the constructor, `Temporal.LocalDateTime.from()` is preferred instead because it accepts more kinds of input and provides options for handling ambiguity and overflow.

The range of allowed values for this type is the same as the old-style JavaScript `Date`: 100 million (10<sup>8</sup>) days before or after the Unix epoch.
This range covers approximately half a million years. If `epochNanoseconds` is outside of this range, a `RangeError` will be thrown.

Usage examples:

```javascript
// UNIX epoch in California
new Temporal.LocalDateTime(0n, Temporal.TimeZone.from('America/Los_Angeles), Temporal.Calendar.from('iso8601'))
  // => 1969-12-31T16:00-08:00[America/Los_Angeles]
new Temporal.LocalDateTime(0n, 'America/Los_Angeles')  // same, but shorter
```

## Static methods

### Temporal.LocalDateTime.**from**(_thing_: any, _options_?: object) : Temporal.LocalDateTime

**Parameters:**

- `thing`: The value representing the desired date, time, time zone, and calendar.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.
  - `disambiguation` (string): How to disambiguate if the date and time given by `localDateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.
  - `offset` (string): How to interpret a provided time zone offset (e.g. `-02:00`) if it conflicts with the provided time zone (e.g. `America/Sao_Paulo`).
    Allowed values are `'use'`, `'ignore'`, `'prefer'`, and `'reject'`.
    The default is `'reject'`.

**Returns:** a new `Temporal.LocalDateTime` object.

This static method creates a new `Temporal.LocalDateTime` object from another value.
If the value is another `Temporal.LocalDateTime` object, a new but otherwise identical object will be returned.
If the value is any other object, a `Temporal.LocalDateTime` will be constructed from the values of any `timeZone`, `timeZoneOffsetNanoseconds`, `era`, `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and/or `calendar` properties that are present.
At least the `timeZone`, `year`, `month`, and `day` properties must be present. Other properties are optional.
If `calendar` is missing, it will be assumed to be `Temporal.Calendar.from('iso8601')`.
Any other missing properties will be assumed to be 0 (for time fields).

All date/time values will be interpreted in context of the provided time zone.
Also, if `calendar` is present then all date/time values will also be interpreted in context of that calendar.

Any non-object value is converted to a string, which is expected to be an ISO 8601 string that includes a time zone ID in brackets, and an optional calendar. For example:

```
2020-08-05T20:06:13+09:00[Asia/Tokyo][c=japanese]
```

If the string isn't valid, then a `RangeError` will be thrown regardless of the value of `overflow`.

Note that this string format (albeit limited to the ISO calendar system) is also used by `java.time` and some other time-zone-aware libraries.
For more information on `Temporal`'s extensions to the ISO string format and the progress towards becoming a published standard, see [ISO standard extensions](./iso-string-ext.md).

The time zone ID is always required.
`2020-08-05T20:06:13+09:00` and `2020-08-05T11:06:13Z` are not valid inputs to this method because they don't include a time zone ID in square brackets.
To parse these string formats, use `Temporal.Instant`:

```javascript
Temporal.Instant.from('2020-08-05T20:06:13+0900').toLocalDateTime('Asia/Tokyo', 'iso8601');
```

Usually a named IANA time zone like `Europe/Paris` or `America/Los_Angeles` is used, but there are cases where adjusting for DST or other time zone offset changes is not desired.
For these cases, non-DST-adjusting, single-offset time zones are available, e.g. `Etc/GMT-14` through `Etc/GMT+12`.
For historical reasons, signs are reversed between these time zones' names and their offsets.
For example, `Etc/GMT+8` would be used for cases where the UTC offset is always `-08:00`, e.g. ocean shipping off the coast of California.
If a non-whole-hour single-offset time zone is needed, the offset can be used as the time zone ID of an offset time zone.

```javascript
Temporal.Instant.from('2020-08-05T20:06:13+05:45[+05:45]');
// OR
Temporal.Instant('2020-08-05T20:06:13+05:45').toLocalDateTime('+05:45', 'iso8601');
```

Note that using `Temporal.LocalDateTime` with a single-offset time zone will not adjust for Daylight Savings Time or other time zone changes.
Therefore, using offset time zones with `Temporal.LocalDateTime` is relatively unusual.
Instead of using `Temporal.LocalDateTime` with an offset time zone, it may be easier for most use cases to use `Temporal.DateTime` and/or `Temporal.Instant` instead.

The `overflow` option works as follows:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

Additionally, if the result is earlier or later than the range of dates that `Temporal.DateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> In the default `'constrain'` mode and when parsing an ISO 8601 string, this will be converted to 59.
> In `'reject'` mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use `reject`.

If the input contains a time zone offset, in rare cases it's possible for those values to conflict for a particular local date and time.
For example, this could happen if the definition of a time zone is changed (e.g. to abolish DST) after storing a `Temporal.LocalDateTime` as a string representing a far-future event.
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

An example of why `offset` is needed is Brazil which permanently stopped using DST in 2019.
This change meant that previously-stored values for 2020 and beyond might now be ambiguous.
For details about problems like this and how to solve them with `offset`, see [Ambiguity Caused by Permanent Changes to a Time Zone Definition](./ambiguity.md#ambiguity-caused-by-permanent-changes-to-a-time-zone-definition).

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
This behavior avoids exceptions when converting non-existent local time values to `Temporal.LocalDateTime`.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving Ambiguity](./ambiguity.md).

The `disambiguation` option is only used if there is no offset in the input, or if the offset is ignored by using the `offset` option as described above.
If the offset in the input is used, then there is no ambiguity and the `disambiguation` option is ignored.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo]');
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+02:00[Africa/Cairo][c=islamic]');
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30');  // RangeError; time zone ID required
ldt = Temporal.LocalDateTime.from('1995-12-07T01:24:30Z');  // RangeError; time zone ID required
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+02:00');  // RangeError; time zone ID required
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+02:00[+02:00]');  // OK (offset time zone) but rarely used
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+03:00[Africa/Cairo]');
// => RangeError: Offset is invalid for '1995-12-07T03:24:30' in 'Africa/Cairo'. Provided: +03:00, expected: +02:00.

ldt = Temporal.LocalDateTime.from({
    timeZone: 'America/Los_Angeles'
    year: 1995,
    month: 12,
    day: 7,
    hour: 3,
    minute: 24,
    second: 30,
    millisecond: 0,
    microsecond: 3,
    nanosecond: 500
});  // => 1995-12-07T03:24:30.000003500+08:00[America/Los_Angeles]

// Different overflow modes
ldt = Temporal.LocalDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'constrain' })
  // => 2001-12-01T00:00+01:00[Europe/Paris]
ldt = Temporal.LocalDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: -1, day: 1 }, { overflow: 'constrain' })
  // => 2001-01-01T00:00+01:00[Europe/Paris]
ldt = Temporal.LocalDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: 13, day: 1 }, { overflow: 'reject' })
  // => throws RangeError
ldt = Temporal.LocalDateTime.from({ timeZone: 'Europe/Paris', year: 2001, month: -1, day: 1 }, { overflow: 'reject' })
  // => throws RangeError
```

### Temporal.LocalDateTime.**compare**(_one_: Temporal.LocalDateTime, _two_: Temporal.LocalDateTime) : number

**Parameters:**

- `one` (`Temporal.LocalDateTime`): First value to compare.
- `two` (`Temporal.LocalDateTime`): Second value to compare.

**Returns:** an integer indicating whether `one` comes before or after or is equal to `two`.

- Zero if all fields are equal, including the calendar ID and the time zone ID.
- &minus;1 if `one` is less than `two`
- 1 if `one` is greater than `two`.

This function can be used to sort arrays of `Temporal.LocalDateTime` objects.

Comparison will use exact time, not clock time, because sorting is almost always based on when events happened in the real world.
Note that during the hour before and after DST ends, sorting of clock time may not match the order the events actually occurred.

If exact timestamps are equal, then `.calendar.id` will be compared lexicographically, in order to ensure a deterministic sort order.
If those are equal too, then `.timeZone.name` will be compared lexicographically.

For example:

```javascript
arr = [
  Temporal.LocalDateTime.from('2020-02-01T12:30-05:00[America/Toronto]'),
  Temporal.LocalDateTime.from('2020-02-01T12:30-05:00[America/New_York]'),
  Temporal.LocalDateTime.from('2020-02-01T12:30+01:00[Europe/Brussels]'),
  Temporal.LocalDateTime.from('2020-02-01T12:30+00:00[Europe/London]')
];
sorted = arr.sort(Temporal.LocalDateTime.compare);
JSON.stringify(sorted, undefined, 2);
// => "[
//   "2020-02-01T12:30+01:00[Europe/Brussels]",
//   "2020-02-01T12:30+00:00[Europe/London]",
//   "2020-02-01T12:30-05:00[America/New_York]",
//   "2020-02-01T12:30-05:00[America/Toronto]"
// ]"
```

Note that in unusual cases like the repeated clock hour after DST ends, values that are later in the real world can be earlier in clock time, or vice versa.
To sort `Temporal.LocalDateTime` values according to clock time only (which is a very rare use case), convert each value to `Temporal.DateTime`.
For example:

<!-- prettier-ignore-start -->
```javascript
one = Temporal.LocalDateTime.from('2020-11-01T01:45-07:00[America/Los_Angeles]');
two = Temporal.LocalDateTime.from('2020-11-01T01:15-08:00[America/Los_Angeles]');
Temporal.LocalDateTime.compare(one, two);
  // => -1, because `one` is earlier in the real world
Temporal.DateTime.compare(one.toDateTime(), two.toDateTime());
  // => 1, because `one` is later in clock time
Temporal.Instant.compare(one.toInstant(), two.toInstant());
  // => -1, because `Temporal.Instant` and `Temporal.LocalDateTime` both compare real-world exact times
```
<!-- prettier-ignore-end -->

## Properties

### localDateTime.**year** : number

### localDateTime.**month** : number

### localDateTime.**day** : number

### localDateTime.**hour**: number

### localDateTime.**minute**: number

### localDateTime.**second**: number

### localDateTime.**millisecond**: number

### localDateTime.**microsecond**: number

### localDateTime.**nanosecond**: number

The above read-only properties allow accessing each component of the date or time individually.
Keep in mind that the values above are dependent on the calendar.
For example:

<!-- prettier-ignore-start -->
```javascript
inIsoCalendar = Temporal.LocalDateTime.from('2020-02-01T12:30+09:00[Asia/Tokyo]');
  // => 2020-02-01T12:30+09:00[Asia/Tokyo]
inIsoCalendar.year;
  // => 2020
inIsoCalendar.withCalendar('japanese').year;
  // => 2
```
<!-- prettier-ignore-end -->

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

### localDateTime.**calendar** : object

The `calendar` read-only property gives the calendar used to calculate date/time field values.
Calendar-sensitive values are used in most places, including:

- Accessing properties like `.year` or `.month`
- Setting properties using `.from()` or `.with()`.
- Creating `Temporal.Duration` instances with `.difference()`
- Interpreting `Temporal.Duration` instances with `.plus()` or `.minus()`
- Localized formatting with `toLocaleString()`, although if the calendar is ISO then the calendar can be overridden via an option
- All other places where date/time values are read or written, except as noted below

Calendar-specific date/time values are NOT used in only a few places:

- Extended ISO strings emitted by `.toString()`, because ISO-string date/time values are, by definition, using the ISO 8601 calendar
- In the values returned by the `getISOFields()` method which is explicitly used to provide ISO 8601 calendar values
- In arguments to the `Temporal.LocalDateTime` constructor which is used for advanced use cases only

### localDateTime.**era** : unknown

The `era` read-only property is `undefined` when using the ISO 8601 calendar.
It's used for calendar systems like `japanese` that specify an era in addition to the year.

### localDateTime.**timeZone** : Temporal.TimeZoneProtocol

The `timeZone` read-only property represents the persistent time zone of `localDateTime`.
By storing its time zone, `Temporal.LocalDateTime` is able to use that time zone when deriving other values, e.g. to automatically perform DST adjustment when adding or subtracting time.

If a non-canonical time zone ID is used, it will be normalized by `Temporal` into its canonical name listed in the [IANA time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Usually, the time zone ID will be an IANA time zone ID.
However, in unusual cases, a time zone can also be created from a time zone offset string like `+05:30`.
Offset time zones function just like IANA time zones except that their offset can never change due to DST or political changes.
This can be problematic for many use cases because by using an offset time zone you lose the ability to safely derive past or future dates because, even in time zones without DST, offsets sometimes change for political reasons (e.g. countries change their time zone).
Therefore, using an IANA time zone is recommended wherever possible.

In very rare cases, you may choose to use `UTC` as your time zone ID.
This is generally not advised because no humans actually live in the UTC time zone; it's just for computers.
Also, UTC has no DST and always has a zero offset, which means that any action you'd take with `Temporal.LocalDateTime` would return identical results to the same action on `Temporal.DateTime` or `Temporal.Instant`.
Therefore, you should almost always use `Temporal.Instant` to represent UTC times.
When you want to convert UTC time to a real time zone, that's when `Temporal.LocalDateTime` will be useful.

To change the time zone while keeping the exact time constant, use `.with({timeZone})`.

The time zone is a required property when creating `Temporal.LocalDateTime` instances.
If you don't know the time zone of your underlying data, please use `Temporal.Instant` and/or `Temporal.DateTime`, neither of which have awareness of time zones.

Although this property is a `Temporal.TimeZoneProtocol` object (which is usually a `Temporal.TimeZone` except custom timezones), it will be automatically coerced to its string form (e.g. `"Europe/Paris"`) when displayed by `console.log`, `JSON.stringify`, `${localDateTime.timeZone}`, or other similar APIs.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
`Time zone is: ${ldt.timeZone}`;
  // => "Time zone is: America/Los_Angeles"
ldt.with({ timeZone: 'Asia/Singapore' }).timeZone;
  // => Asia/Singapore
ldt.with({ timeZone: 'Asia/Chongqing' }).timeZone;
  // => Asia/Shanghai (time zone IDs are normalized, e.g. Asia/Chongqing -> Asia/Shanghai)
ldt.with({ timeZone: '+05:00' }).timeZone;
  // => +05:00
ldt.with({ timeZone: '+05' }).timeZone;
  // => +05:00 (normalized to canonical form)
ldt.with({ timeZone: 'utc' }).timeZone;
  // => UTC (normalized to canonical form which is uppercase)
ldt.with({ timeZone: 'GMT' }).timeZone;
  // => UTC (normalized to canonical form)
```
<!-- prettier-ignore-end -->

### localDateTime.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][ldt.dayOfWeek - 1]; // => THU
```

### localDateTime.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
// ISO ordinal date
console.log(ldt.year, ldt.dayOfYear); // => 1995 341
```

### localDateTime.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
// ISO week date
console.log(ldt.year, ldt.weekOfYear, ldt.dayOfWeek); // => 1995 49 4
```

### localDateTime.**daysInWeek** : number

The `daysInWeek` read-only property gives the number of days in the week that the date falls in.
For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-08:00[America/Los_Angeles]');
ldt.daysInWeek; // => 7
```

### localDateTime.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const ldt = Temporal.now.localDateTime().with({ month });
  monthsByDays[ldt.daysInMonth] = (monthsByDays[ldt.daysInMonth] || []).concat(ldt);
}

const strings = monthsByDays[30].map((ldt) => ldt.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### localDateTime.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the date falls in.
For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

```javascript
ldt = Temporal.now.localDateTime();
percent = ldt.dayOfYear / ldt.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
```

### localDateTime.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the date falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1900-01-01T12:00+09:00[Asia/Tokyo]');
ldt.monthsInYear; // => 12
```

### localDateTime.**isLeapYear** : boolean

The `isLeapYear` read-only property tells whether the year of this `Temporal.LocalDateTime` is a leap year.
Its value is `true` if the year is a leap year, and `false` if not.

For the ISO calendar, leap years are years evenly divisible by 4, except years evenly divisible by 100 but not evenly divisible by 400.
Other calendar systems may calculate leap years differently.

Usage example:

```javascript
// Is this year a leap year?
ldt = Temporal.now.localDateTime();
ldt.isLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
ldt.with({ year: 2100 }).isLeapYear; // => false
```

### localDateTime.**hoursInDay** : number

The `hoursInDay` read-only property returns the number of real-world hours between the start of the current day (usually midnight) in `localDateTime.timeZone` to the start of the next calendar day in the same time zone.
Normally days will be 24 hours long, but on days where there are DST changes or other time zone transitions, this property may return 23 or 25.
In rare cases, other integers or even non-integer values may be returned, e.g. when time zone definitions change by less than one hour.

If a time zone offset transition happens exactly at midnight, the transition will impact the previous day's length.

Note that transitions that skip entire days (like the 2011 [change](https://en.wikipedia.org/wiki/Time_in_Samoa#2011_time_zone_change) of `Pacific/Apia` to the opposite side of the International Date Line) will return `24` because there are 24 real-world hours between one day's midnight and the next day's midnight.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
  // => 24 (normal day)
ldt = Temporal.LocalDateTime.from('2020-03-08T12:00-07:00[America/Los_Angeles]').hoursInDay;
  // => 23 (DST starts on this day)
ldt = Temporal.LocalDateTime.from('2020-11-01T12:00-08:00[America/Los_Angeles]').hoursInDay;
  // => 25 (DST ends on this day)
```
<!-- prettier-ignore-end -->

### localDateTime.**startOfDay** : Temporal.LocalDateTime

The `startOfDay` read-only property returns a new `Temporal.LocalDateTime` instance representing the earliest valid local clock time during the current calendar day and time zone of `localDateTime`.

The local time of the result is almost always `00:00`, but in rare cases it could be a later time e.g. if DST starts at midnight in a time zone. For example:

```javascript
const ldt = Temporal.LocalDateTime.from('2015-10-18T12:00-02:00[America/Sao_Paulo]');
ldt.startOfDay; // => 2015-10-18T01:00-02:00[America/Sao_Paulo]
```

Also note that some calendar systems (e.g. `ethiopic`) may not start days at `00:00`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-01-01T12:00-08:00[America/Los_Angeles]').startOfDay;
  // => 2020-01-01T00:00-08:00[America/Los_Angeles]
ldt = Temporal.LocalDateTime.from('2018-11-04T12:00-02:00[America/Sao_Paulo]').startOfDay;
  // => 2018-11-04T01:00-02:00[America/Sao_Paulo]
  // Note the 1:00AM start time because the first clock hour was skipped due to DST transition
  // that started at midnight.
```
<!-- prettier-ignore-end -->

### localDateTime.**isTimeZoneOffsetTransition** : boolean

The `isTimeZoneOffsetTransition` read-only property is `true` if this `Temporal.LocalDateTime` instance is immediately after a DST transition or other change in time zone offset, `false` otherwise.

"Immediately after" means that subtracting one nanosecond would yield a `Temporal.LocalDateTime` instance that has a different value for `timeZoneOffsetNanoseconds`.
In the ISO 8601 calendar, to calculate if a DST transition happens on the same day (but not necessarily at the same time), use `.hoursInDay() !== 24`.

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-11-01T01:00-07:00[America/Denver]').isTimeZoneOffsetTransition;
  // => true (DST ended right before this time)
ldt = Temporal.LocalDateTime.from('2020-11-01T01:00-07:00[America/Phoenix]').isTimeZoneOffsetTransition;
  // => false (Phoenix doesn't observe DST)
```
<!-- prettier-ignore-end -->

### localDateTime.**timeZoneOffsetNanoseconds** : number

The `timeZoneOffsetNanoseconds` read-only property is the offset (in nanoseconds) relative to UTC of `localDateTime`.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

This field is used to uniquely map date/time fields to an exact date/time in cases where the calendar date and clock time are ambiguous due to time zone offset transitions.
Therefore, this field is returned by `getFields()` and is accepted by `from` and `with`.
The presence of this field means that `localDateTime.toInstant()` requires no parameters.

<!-- prettier-ignore-start -->
```javascript
minus8Hours = -8 * 3600 * 1e9;
daylightTime0130 = Temporal.LocalDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
  // => 2020-11-01T01:30-07:00[America/Los_Angeles]
  // This is Pacific Daylight Time 1:30AM
repeated0130 = daylightTime0130.with({ timeZoneOffsetNanoseconds: minus8Hours });
  // => 2020-11-01T01:30-08:00[America/Los_Angeles]
  // This is Pacific Standard Time 1:30AM
const { timeZoneOffsetNanoseconds, ...otherFields } = repeated0130.getFields();
ldt = Temporal.LocalDateTime.from(otherFields, { disambiguation: 'earlier' });
  // => 2020-11-01T01:30-07:00[America/Los_Angeles]
ldt = Temporal.LocalDateTime.from({ ...otherFields, timeZoneOffsetNanoseconds }, { disambiguation: 'earlier' });
  // => 2020-11-01T01:30-08:00[America/Los_Angeles]
  // Note that the `{disambiguation: 'earlier'}` option is ignored because `timeZoneOffsetNanoseconds`
  // is included in the input so the result is not ambiguous.
```
<!-- prettier-ignore-end -->

### localDateTime.**timeZoneOffsetString** : number

The `timeZoneOffsetString` read-only property is the offset (formatted as a string) relative to UTC of the current time zone and exact instant. Examples: `'-08:00'` or `'+05:30'`

The format used is defined in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC) standard.

The value of this field will change after DST transitions or after political changes to a time zone, e.g. a country switching to a new time zone.

Note that when setting the offset using `with` (or `from` using an property bag object instead of a string), the only way to set the time zone offset is via the `timeZoneOffsetNanoseconds` field.
String values are not accepted for offsets in these cases, nor is this property emitted by `.getFields()`.

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]');
ldt.timeZoneOffsetString;
  // => "-07:00"
ldt.with({ timeZone: 'Asia/Kolkata' }).timeZoneOffsetString;
  // => "+05:30"
```
<!-- prettier-ignore-end -->

## Methods

### localDateTime.**with**(_localDateTimeLike_: object, _options_?: object) : Temporal.LocalDateTime

**Parameters:**

- `localDateTimeLike` (object): an object with some or all of the properties of a `Temporal.LocalDateTime`. Accepted fields include:
  - All date/time fields
  - `calendar` as a calendar identifier string like `japanese` or `iso8601`, a `Temporal.Calendar` instance, or a `Temporal.CalendarProtocol` object
  - `timeZone` as a time zone identifier string like `Europe/Paris`, a `Temporal.TimeZone` instance, or a `Temporal.TimeZoneProtocol` object.
  - `timezoneOffsetNanoseconds` to uniquely identify a time that's ambiguous or invalid due to DST.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.
  - `disambiguation` (string): How to handle date/time values that are ambiguous or invalid due to DST or other time zone offset changes.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.
  - `offset` (string): How to handle conflicts between time zone offset and time zone
    Allowed values are `'prefer'`, `'use'`, `'ignore'`, and `'reject'`.
    The default is `'prefer'`.

**Returns:** a new `Temporal.LocalDateTime` object.

This method creates a new `Temporal.LocalDateTime` which is a copy of `localDateTime`, but any properties present on `localDateTimeLike` override the ones already present on `localDateTime`.

Since `Temporal.LocalDateTime` objects are immutable, this method will create a new instance instead of modifying the existing instance.

If the result is earlier or later than the range of dates that `Temporal.LocalDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `localDateTimeLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

If a `timeZone` and/or `calendar` field is included with a different ID than the current object's fields, then `with` will first convert all existing fields to the new time zone and/or calendar and then fields in the input will be played on top of the new time zone or calendar.
This makes `.with({timeZone})` is an easy way to convert to a new time zone while updating the clock time.
However, to keep clock time as-is while resetting the time zone, use the `.toDateTime()` method instead. Examples:

```javascript
// update local time to match new time zone
const sameInstantInOtherTz = ldt.with({ timeZone: 'Europe/London' });
// create instance with same local time in a new time zone
const newTzSameLocalTime = ldt.toDateTime().toLocalDateTime('Europe/London');
```

Some input values can cause conflict between the `timezoneOffsetNanoseconds` field and the `timeZone` field.
This can happen when either of these fields are included in the input, and can also happen when setting date/time values on the opposite side of a time zone offset transition like DST starting or ending.
The `offset` option can resolve this offset vs. time zone conflict or ambiguity.

Unlike the `from()` method where `offset` defaults to `'reject'`, the offset option in `with` defaults to `'prefer'`.
This default prevents DST disambiguation from causing unexpected one-hour changes in exact time after making small changes to clock time fields.
For example, if a `Temporal.LocalDateTime` is set to the "second" 1:30AM on a day where the 1-2AM clock hour is repeated after a backwards DST transition, then calling `.with({minute: 45})` will result in an ambiguity which is resolved using the default `offset: 'prefer'` option.
Because the existing offset is valid for the new time, it will be retained so the result will be the "second" 1:45AM.
However, if the existing offset is not valid for the new result (e.g. `.with({hour: 0})`), then the default behavior will change the offset to match the new local time in that time zone.

Options on `with` behave identically to options on `from`, with only the following exceptions:

- The default for `offset` is `'prefer'` to support the use case described above.
- If the input's `timeZone` field is both provided and has a different ID than the current object, then the object's current `timeZoneOffsetNanoseconds` field will be ignored regardless of the `offset` option chosen.

Please see the documentation of `from` for more details on options behavior.

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24-06:00[America/Chicago]');
ldt.with({ year: 2015, minute: 31 }); // => 2015-12-07T03:31-06:00[America/Chicago]

midnight = Temporal.Time.from({ hour: 0 });
ldt.with(midnight); // => 1995-12-07T00:00-06:00[America/Chicago]
// Note: not the same as ldt.with({ hour: 0 }), because all time units are set to zero.
date = Temporal.Date.from('2015-05-31');
ldt.with(date); // => 2015-05-31T03:24-05:00[America/Chicago] (automatically adjusted for DST)
yearMonth = Temporal.YearMonth.from('2018-04');
ldt.with(yearMonth); // => 2018-04-07T03:24-05:00[America/Chicago]
```

### localDateTime.**withCalendar**(_calendar_: object | string) : Temporal.LocalDateTime

**Parameters:**

- `calendar` (`Temporal.Calendar` or plain object or string): The calendar into which to project `localDateTime`.

**Returns:** a new `Temporal.LocalDateTime` object which is the date indicated by `localDateTime`, projected into `calendar`.

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500+09:00[Asia/Tokyo][c=japanese]');
`${ldt.era} ${ldt.year}`; // => "heisei 7"
ldt.withCalendar('iso8601').year; // => 1995
```

### localDateTime.**plus**(_duration_: object, _options_?: object) : Temporal.LocalDateTime

**Parameters:**

- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.LocalDateTime` object representing the sum of `localDateTime` plus `duration`.

This method adds `duration` to `localDateTime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object. Adding a negative duration like `{ hours: -5, minutes: -30 }` is equivalent to subtracting the absolute value of that duration.

Addition and subtraction are performed according to rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545):

- Add/subtract the date portion of a duration using calendar days, like (like `Temporal.DateTime`).
  The result will automatically adjust for Daylight Saving Time using the rules of this instance's `timeZone` field.
- Add/subtract the time portion of a duration using real-world time, like (like `Temporal.Instant`).
- Addition (or subtraction of a negative duration) is performed in order from largest unit to smallest unit.
- Subtraction (or addition of a negative duration) is performed in order from smallest unit to largest unit.
- If a result is ambiguous or invalid due to a time zone offset transition, the later of the two possible instants will be used for time-skipped transitions and the earlier of the two possible instants will be used for time-repeated transitions.
  This behavior corresponds to the default `disambiguation: 'compatible'` option used in `from` and used by legacy `Date` and moment.js.

These rules make arithmetic with `Temporal.LocalDateTime` "DST-safe", which means that the results most closely match the expectations of both real-world users and implementers of other standards-compliant calendar applications. These expectations include:

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

Additionally, if the result is earlier or later than the range of dates that `Temporal.LocalDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-03-08T00:00-08:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
laterDay = ldt.plus({ days: 1 });
  // => 2020-03-09T00:00-07:00[America/Los_Angeles];
  // Note that the new offset is different, indicating the result is adjusted for DST.
laterDay.difference(ldt, { largestUnit: 'hours' }).hours;
  // => 23, because one clock hour lost to DST

laterHours = ldt.plus({ hours: 24 });
  // => 2020-03-09T01:00-07:00[America/Los_Angeles]
  // Adding time units doesn't adjust for DST. Result is 1:00AM: 24 real-world
  // hours later because a clock hour was skipped by DST.
laterHours.difference(ldt, { largestUnit: 'hours' }).hours; // => 24
```
<!-- prettier-ignore-end -->

### localDateTime.**minus**(_duration_: object, _options_?: object) : Temporal.LocalDateTime

**Parameters:**

- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object which may have some or all of the following properties:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.LocalDateTime` object representing the result of `localDateTime` minus `duration`.

This method subtracts a `duration` from `localDateTime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object. Subtracting a negative duration like `{ hours: -5, minutes: -30 }` is equivalent to adding the absolute value of that duration.

Addition and subtraction are performed according to rules defined in [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545):

- Add/subtract the date portion of a duration using calendar days, like (like `Temporal.DateTime`).
  The result will automatically adjust for Daylight Saving Time using the rules of this instance's `timeZone` field.
- Add/subtract the time portion of a duration using real-world time, like (like `Temporal.Instant`).
- Addition (or subtraction of a negative duration) is performed in order from largest unit to smallest unit.
- Subtraction (or addition of a negative duration) is performed in order from smallest unit to largest unit.
- If a result is ambiguous or invalid due to a time zone offset transition, the later of the two possible instants will be used for time-skipped transitions and the earlier of the two possible instants will be used for time-repeated transitions.
  This behavior corresponds to the default `disambiguation: 'compatible'` option used in `from` and used by legacy `Date` and moment.js.

These rules make arithmetic with `Temporal.LocalDateTime` "DST-safe", which means that the results most closely match the expectations of both real-world users and implementers of other standards-compliant calendar applications. These expectations include:

- Adding or subtracting days should keep clock time consistent across DST transitions.
  For example, if you have an appointment on Saturday at 1:00PM and you ask to reschedule it 1 day later, you would expect the reschedule appointment to still be at 1:00PM, even if there was a DST transition overnight.
- Adding or subtracting the time portion of a duration should ignore DST transitions.
  For example, a friend you've asked to meet in in 2 hours will be annoyed if you show up 1 hour or 3 hours later.
- There should be a consistent and relatively-unsurprising order of operations.
- If results are at or near a DST transition, ambiguities should be handled automatically (no crashing) and deterministically.

Some arithmetic operations may be ambiguous, e.g. because months have different lengths.
For example, subtracting one month from October 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, a result that would be out of range causes a `RangeError` to be thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.LocalDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2020-03-09T00:00-07:00[America/Los_Angeles]');
// Add a day to get midnight on the day after DST starts
earlierDay = ldt.minus({ days: 1 });
  // => 2020-03-08T00:00-08:00[America/Los_Angeles]
  // Note that the new offset is different, indicating the result is adjusted for DST.
earlierDay.difference(ldt, { largestUnit: 'hours' }).hours;
  // => -23, because one clock hour lost to DST

earlierHours = ldt.minus({ hours: 24 });
  // => 2020-03-07T23:00-08:00[America/Los_Angeles]
  // Subtracting time units doesn't adjust for DST. Result is 11:00PM: 24 real-world
  // hours earlier because a clock hour was skipped by DST.
earlierHours.difference(ldt, { largestUnit: 'hours' }).hours; // => -24
```
<!-- prettier-ignore-end -->

### localDateTime.**difference**(_other_: Temporal.LocalDateTime, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.LocalLocalDateTime`): Another date/time with which to compute the difference.
- `options` (optional object): An object which may have some or all of the following properties:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `days`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are the same as for `largestUnit`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the difference between `localDateTime` and `other`.

This method computes the difference between the two times represented by `localDateTime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `localDateTime` then the resulting duration will be negative.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
For example, a difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`.
However, a difference of 30 seconds will still be 30 seconds if `largestUnit` is `"hours"`.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to an increment expressed in days or larger units requires a reference point, `localDateTime` is used as the reference point in that case.
The default is to do no rounding.

The duration returned is a "hybrid" duration.
This means that the duration's date portion represents full calendar days like `DateTime.prototype.difference` would return, while its time portion represents real-world elapsed time like `Temporal.Instant.prototype.difference` would return.
This "hybrid duration" approach automatically adjusts for DST and matches widely-adopted industry standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).
It also matches the behavior of popular JavaScript libraries like moment.js and date-fns.

Examples:

- Difference between 2:30AM on the day before DST starts and 3:30AM on the day DST starts => `P1DT1H`
  (even though it's only 24 hours of real-world elapsed time)
- Difference between 1:45AM on the day before DST starts and the "second" 1:15AM on the day DST ends => `PT24H30M`
  (because it hasn't been a full calendar day even though it's been 24.5 real-world hours).

If `largestUnit` is `'hours'` or smaller, then the result will be the same as if `Temporal.Instant.prototype.difference` was used.
If both values have the same local time, then the result will be the same as if `Temporal.DateTime.prototype.difference` was used.
To calculate the difference between calendar dates only, use `.toDate().difference(other.toDate())`.
To calculate the difference between clock times only, use `.toTime().difference(other.toTime())`.

If the other `Temporal.LocalDateTime` is in a different time zone, then the same days can be different lengths in each time zone, e.g. if only one of them observes DST.
Therefore, a `RangeError` will be thrown if `largestUnit` is `'days'` or larger and the two instances' time zones have different `id` fields.
To work around this limitation, transform one of the instances to the other's time zone using `.with({timeZone: other.timeZone})` and then calculate the same-timezone difference.
Because of the complexity and ambiguity involved in cross-timezone calculations involving days or larger units, `'hours'` is the default for `largestUnit`.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two dates in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `localDateTime.withCalendar`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ldt1 = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500+05:30[Asia/Kolkata]');
ldt2 = Temporal.LocalDateTime.from('2019-01-31T15:30+05:30[Asia/Kolkata]');
ldt2.difference(ldt1);
  // =>      PT202956H5M29.999996500S
ldt2.difference(ldt1, { largestUnit: 'years' });
  // =>  P23Y1M24DT12H5M29.999996500S
ldt1.difference(ldt2, { largestUnit: 'years' });
  // => -P23Y1M24DT12H5M29.999996500S
ldt2.difference(ldt1, { largestUnit: 'nanoseconds' });
  // =>       PT730641929.999996544S (precision lost)

// Rounding, for example if you don't care about sub-seconds
ldt2.difference(ldt1, { smallestUnit: 'seconds' });
  // => PT202956H5M30S

// Months and years can be different lengths
[jan1, feb1, mar1] = [1, 2, 3].map((month) =>
  Temporal.LocalDateTime.from({ year: 2020, month, day: 1, timeZone: 'Asia/Seoul' })
);
feb1.difference(jan1, { largestUnit: 'days' }); // => P31D
feb1.difference(jan1, { largestUnit: 'months' }); // => P1M
mar1.difference(feb1, { largestUnit: 'days' }); // => P29D
mar1.difference(feb1, { largestUnit: 'months' }); // => P1M
mar1.difference(jan1, { largestUnit: 'days' }); // => P60D
```
<!-- prettier-ignore-end -->

### localDateTime.**round**(_options_: object) : Temporal.LocalDateTime

**Parameters:**

- `options` (object): An object which may have some or all of the following properties:
  - `smallestUnit` (required string): The unit to round to.
    Valid values are `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'trunc'`, and `'nearest'`.
    The default is `'nearest'`.

**Returns:** a new `Temporal.LocalDateTime` object which is `localDateTime` rounded to `roundingIncrement` of `smallestUnit`.

Rounds `localDateTime` to the given unit and increment, and returns the result as a new `Temporal.LocalDateTime` object.

The `smallestUnit` option determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `{ smallestUnit: 'minute', roundingIncrement: 30 }`.

The value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
(For example, if `smallestUnit` is `'minutes'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.)

If `smallestUnit` is `'day'`, then 1 is the only allowed value for `roundingIncrement`.

The `roundingMode` option controls how the rounding is performed.

- `'ceil'`: Always round up, towards the end of time.
- `'floor'`, `'trunc'`: Always round down, towards the beginning of time.
  (These two modes behave the same, but are both included for consistency with `Temporal.Duration.prototype.round()`, where they are not the same.)
- `'nearest'`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `'ceil'`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');

// Round to a particular unit
ldt.round({ smallestUnit: 'hour' }); // => 1995-12-07T03:00-08:00[America/Los_Angeles]
// Round to an increment of a unit, e.g. half an hour:
ldt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 1995-12-07T03:30-08:00[America/Los_Angeles]
// Round to the same increment but round down instead:
ldt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 1995-12-07T03:00-08:00[America/Los_Angeles]
```
<!-- prettier-ignore-end -->

### localDateTime.**equals**(_other_: Temporal.LocalDateTime) : boolean

**Parameters:**

- `other` (`Temporal.LocalDateTime`): Another date/time to compare.

**Returns:** `true` if `localDateTime` and `other` are have equivalent fields (date/time fields, offset, time zone ID, and calendar ID), or `false` if not.

Compares two `Temporal.LocalDateTime` objects for equality.

This function exists because it's not possible to compare using `localDateTime == other` or `localDateTime === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which two events occur, then this function is easier to use than `Temporal.LocalDateTime.compare`.
But both methods do the same thing, so a `0` returned from `compare` implies a `true` result from `equals`, and vice-versa.

Note that two `Temporal.LocalDateTime` instances can have the same clock time, time zone, and calendar but still be unequal, e.g. when a clock hour is repeated after DST ends in the Fall.
In this case, the two instances will have different `timeZoneOffsetNanoseconds` field values.

To ignore calendars, convert both instances to use the ISO 8601 calendar:

```javascript
ldt.withCalendar('iso8601').equals(other.withCalendar('iso8601'));
```

To ignore both time zones and calendars, compare the instants of both:

```javascript
ldt.toInstant().equals(other.toInstant()));
```

Example usage:

```javascript
ldt1 = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Paris]');
ldt2 = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Brussels]');
ldt1.equals(ldt2); // => false (same offset but different time zones)
ldt1.equals(ldt1); // => true
```

### localDateTime.**toString**() : string

**Returns:** a string containing an ISO 8601 date+time+offset format, a bracketed time zone suffix, and (if the calendar is not `iso8601`) a calendar suffix.

Examples:

- `2011-12-03T10:15:30+01:00[Europe/Paris]`
- `2011-12-03T10:15:30+09:00[Asia/Tokyo][c=japanese]`

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `localDateTime`.
The string is "round-trippable".
This means that it can be passed to `Temporal.LocalDateTime.from()` to create a new `Temporal.LocalDateTime` object with the same field values as the original.

The string format output by this method can be parsed by [`java.time.ZonedDateTime`](https://docs.oracle.com/javase/8/docs/api/java/time/ZonedDateTime.html) as long as the calendar is `iso8601`.
For more information on `Temporal`'s extensions to the ISO string format and the progress towards becoming a published standard, see [ISO standard extensions](./iso-string-ext.md).

Example usage:

```javascript
ldt = Temporal.LocalDateTime.from({ year: 2019, month: 12, day: 1, hour: 12, timeZone: 'Africa/Lagos' });
ldt.toString(); // => 2019-12-01T12:00+01:00[Africa/Lagos]
ldt.withCalendar('japanese');
ldt.toString(); // => 2019-12-01T12:00+01:00[Africa/Lagos][c=japanese]
```

### localDateTime.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `localDateTime`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `localDateTime`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.LocalDateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

`options.timeZone` will be automatically set from the time zone of of `localDateTime`.
If a different time zone ID is provided in `options.timeZone`, a RangeError will be thrown.
To display a `Temporal.LocalDateTime` value in a different time zone, use `with({timeZone}).toLocaleString()`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
ldt = Temporal.LocalDateTime.from('2019-12-01T12:00+01:00[Europe/Berlin]');
ldt.toLocaleString(); // => example output: 12/1/2019, 12:00:00 PM
ldt.toLocaleString('de-DE'); // => 1.12.2019, 12:00:00
options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
ldt.toLocaleString('de-DE', options); // => Sonntag, 1. Dezember 2019
ldt.toLocaleString('de-DE', { timeZone: 'Pacific/Auckland' });
  // => RangeError: Time zone option Pacific/Auckland does not match actual time zone Europe/Berlin
ldt.with({ timeZone: 'Pacific/Auckland' }).toLocaleString('de-DE'); // => 2.12.2019, 00:00:00
ldt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => １２/１/２０１９, １２:００:００ PM
```
<!-- prettier-ignore-end -->

### localDateTime.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `localDateTime`.

This method is the same as `localDateTime.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.LocalDateTime` object from a string, is `Temporal.LocalDateTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.LocalDateTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.LocalDateTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const event = {
  id: 311,
  name: 'FictionalConf 2018',
  openingLocalDateTime: Temporal.LocalDateTime.from('2018-07-06T10:00+05:30[Asia/Kolkata]'),
  closingLocalDateTime: Temporal.LocalDateTime.from('2018-07-08T18:15+05:30[Asia/Kolkata]')
};
const str = JSON.stringify(event, null, 2);
console.log(str);
// =>
// {
//   "id": 311,
//   "name": "FictionalConf 2018",
//   "openingLocalDateTime": "2018-07-06T10:00+05:30[Asia/Calcutta]",
//   "closingLocalDateTime": "2018-07-08T18:15+05:30[Asia/Calcutta]"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('LocalDateTime')) return Temporal.LocalDateTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### localDateTime.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.LocalDateTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.LocalDateTime.compare()` for this, or `localDateTime.equals()` for equality.

### localDateTime.**toInstant**() : Temporal.Instant

**Returns:** A `Temporal.Instant` object that represents the same instant as `localDateTime`.

### localDateTime.**toDate**() : Temporal.Date

**Returns:** a `Temporal.Date` object that is the same as the date portion of `localDateTime`.

### localDateTime.**toTime**() : Temporal.Time

**Returns:** a `Temporal.Time` object that is the same as the wall-clock time portion of `localDateTime`.

### localDateTime.**toDateTime**() : Temporal.DateTime

**Returns:** a `Temporal.DateTime` object that is the same as the date and time portion of `localDateTime`.

> **NOTE**: After a `Temporal.LocalDateTime` is converted to `Temporal.DateTime`, it will no longer be aware of its time zone.
> This means that subsequent operations like arithmetic or `with` will not adjust for DST and may not yield the same results as equivalent operations with `Temporal.LocalDateTime`.
> However, unless you perform those operations across a time zone offset transition, it's impossible to notice the difference.
> Therefore, be very careful when performing this conversion because subsequent results may look correct most of the time while failing around time zone transitions like when DST starts or ends.

### localDateTime.**toYearMonth**() : Temporal.YearMonth

**Returns:** a `Temporal.YearMonth` object that is the same as the year and month of `localDateTime`.

### localDateTime.**toMonthDay**() : Temporal.MonthDay

**Returns:** a `Temporal.MonthDay` object that is the same as the month and day of `localDateTime`.

The above six methods can be used to convert `Temporal.LocalDateTime` into a `Temporal.Instant`, `Temporal.Date`, `Temporal.Time`, `Temporal.DateTime`, `Temporal.YearMonth`, or `Temporal.MonthDay` respectively.
The converted object carries a copy of all the relevant data of `localDateTime` (for example, in `toDate()`, the `year`, `month`, and `day` properties are the same.)

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30+02:00[Africa/Johannesburg]');
ldt.toInstant(); // => 1995-12-07T01:24:30Z
ldt.toDateTime(); // => 1995-12-07T03:24:30
ldt.toDate(); // => 1995-12-07
ldt.toYearMonth(); // => 1995-12
ldt.toMonthDay(); // => 12-07
ldt.toTime(); // => 03:24:30
```

### localDateTime.**getFields**() : { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `localDateTime`, including all date/time fields (expressed in the current calendar) as well as the `calendar`, `timeZone`, and `timeZoneOffsetNanoseconds` properties.

This method can be used to convert a `Temporal.LocalDateTime` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

This method is helpful when you want to use the ES6 "object spread" (`...`) feature (or equivalent code like `Object.assign`) on a `Temporal.LocalDateTime` instance.  
Because `Temporal.LocalDateTime` fields are not "own properties" according to JavaScript, they cannot be enumerated by `...` or `Object.assign`.
But calling `.getFields()` creates a new object whose properties can be enumerated by `...` or `Object.assign`.

The `timeZone` and `calendar` properties are returned as objects, not as their string IDs.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:

```javascript
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500-08:00[America/Los_Angeles]');

const thisWontWork = { ...ldt, hour: 12 };
JSON.stringify(thisWontWork);
// => { "hour": 12 }
// There are no other properties because Temporal.LocalDateTime has no enumerable own properties

const thisWillWork = { ...ldt.getFields(), hour: 12 };
JSON.stringify(thisWillWork, undefined, 2);
// => "{
//   "timeZone": "America/Los_Angeles",
//   "timeZoneOffsetNanoseconds": -28800000000000,
//   "day": 7,
//   "hour": 12,    // note that `hour` has been updated
//   "microsecond": 3,
//   "millisecond": 0,
//   "minute": 24,
//   "month": 12,
//   "nanosecond": 500,
//   "second": 30,
//   "year": 1995,
//   "calendar": {}
// }"
```

### localDateTime.**getISOFields**(): { isoYear: number, isoMonth: number, isoDay: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number, calendar: object }

**Returns:** a plain object with properties expressing `localDateTime` in the ISO 8601 calendar, including all date/time fields as well as the `calendar`, `timeZone`, and `timeZoneOffsetNanoseconds` properties.
Note that date/time properties have different names with an `iso` prefix to better differentiate from "normal" `getFields` results.

This is an advanced method that's mainly useful if you are implementing a custom calendar.
Most developers will not need to use it.
Instead, most applications will use `localDateTime.getFields()` (for fields in the current calendar) or `localDateTime.withCalendar('iso8601').getFields()` (for fields expressed using the ISO 8601 calendar).

Usage example:

```javascript
// get a Temporal.LocalDateTime in `japanese` calendar system
ldt = Temporal.LocalDateTime.from('1995-12-07T03:24:30.000003500+01:00[Europe/Paris]').withCalendar('japanese');

// Year in japanese calendar is year 7 of Heisei era
ldt.getFields().year; // => 7
ldt.getISOFields().isoYear; // => 1995

// Instead of calling getISOFields, the pattern below is recommended for most use cases
ldt.withCalendar('iso8601').year; // => 1995
```
