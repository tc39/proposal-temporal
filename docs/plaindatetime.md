# Temporal.PlainDateTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainDateTime` represents a calendar date and wall-clock time, with a precision in nanoseconds, and without any time zone.

For use cases that require a time zone, especially using arithmetic or other derived values, consider using [`Temporal.ZonedDateTime`](./zoneddatetime.md) instead because that type automatically adjusts for Daylight Saving Time.
A `Temporal.PlainDateTime` can be converted to a `Temporal.ZonedDateTime` using a time zone identifier.

`Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, and `Temporal.PlainMonthDay` all carry less information and should be used when complete information is not required.

A `Temporal.PlainDateTime` can be converted into any of the types mentioned above using conversion methods like `toZonedDateTime` or `toPlainDate`.

Because `Temporal.PlainDateTime` does not represent an exact point in time, most date/time use cases are better handled using exact time types like `Temporal.ZonedDateTime` and `Temporal.Instant`.
But there are cases where `Temporal.PlainDateTime` is the correct type to use:

- Representing timezone-specific events where the time zone is not stored together with the date/time data.
  In this case, `Temporal.PlainDateTime` is an intermediate step before converting to/from `Temporal.ZonedDateTime` or `Temporal.Instant` using the separate time zone.
  Examples:
  - When the time zone is stored separately in a separate database column or a per-user setting.
  - Implicit time zones, e.g. stock exchange data that is always `America/New_York`
  - Interacting with poorly-designed legacy systems that record data in the server's non-UTC time zone.
- Passing data to/from a component that is unaware of time zones, e.g. a UI date/time picker.
- Modeling events that happen at the same local time in every time zone.
  For example, the British Commonwealth observes a [two minute silence](https://en.wikipedia.org/wiki/Two-minute_silence) every November 11th at 11:00AM in local time.
- When time zone is irrelevant, e.g. a sleep tracking device that only cares about the local time you went to sleep and woke up, regardless of where in the world you are.
- Parsing local time from ISO 8601 strings like `2020-04-09T16:08-08:00` that have a numeric offset without an IANA time zone like `America/Los_Angeles`.
  These strings can also be parsed by `Temporal.Instant`, but to parse the local date and time then `Temporal.PlainDateTime.from` is required.
- Performing arithmetic that deliberately ignores DST.
  Example: in a day-planner UI, the visual height of a meeting may be the same even if DST skips or repeats an hour.

To learn more about time zones and DST best practices, visit [Time Zones and Resolving Ambiguity](./timezone.md).

## Constructor

### **new Temporal.PlainDateTime**(_isoYear_: number, _isoMonth_: number, _isoDay_: number, _isoHour_: number = 0, _isoMinute_: number = 0, _isoSecond_: number = 0, _isoMillisecond_: number = 0, _isoMicrosecond_: number = 0, _isoNanosecond_: number = 0, _calendar_: string = "iso8601") : Temporal.PlainDateTime

**Parameters:**

- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `isoHour` (optional number): An hour of the day, ranging between 0 and 23 inclusive.
- `isoMinute` (optional number): A minute, ranging between 0 and 59 inclusive.
- `isoSecond` (optional number): A second, ranging between 0 and 59 inclusive.
- `isoMillisecond` (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
- `isoMicrosecond` (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
- `isoNanosecond` (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.
- `calendar` (optional string): A calendar to project the datetime into.

**Returns:** a new `Temporal.PlainDateTime` object.

Use this constructor if you have the correct parameters for the datetime already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainDateTime.from()`, which accepts more kinds of input, allows inputting dates and times in different calendar reckonings, and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter, and the time parameters must represent a valid time of day.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> This value will cause the constructor will throw, so if you have to interoperate with times that may contain leap seconds, use `Temporal.PlainDateTime.from()` instead.

The range of allowed values for this type is wider (by one nanosecond smaller than one day) on each end than the range of `Temporal.Instant`.
Because the magnitude of built-in time zones' UTC offset will always be less than 24 hours, this extra range ensures that a valid `Temporal.Instant` can always be converted to a valid `Temporal.PlainDateTime` using any built-in time zone.
Note that the reverse conversion is not guaranteed to succeed; a valid `Temporal.PlainDateTime` at the edge of its range may, for some built-in time zones, be out of range of `Temporal.Instant`.
If the parameters passed in to this constructor are out of range, then this function will throw a `RangeError`.

`calendar` is a string containing the identifier of a built-in calendar, such as `'islamic'` or `'gregory'`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// Leet hour on pi day in 2020
datetime = new Temporal.PlainDateTime(2020, 3, 14, 13, 37); // => 2020-03-14T13:37:00
```

## Static methods

### Temporal.PlainDateTime.**from**(_item_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `item`: a value convertible to a `Temporal.PlainDateTime`.
- `options` (optional object): An object with properties representing options for constructing the date and time.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDateTime` object.

This static method creates a new `Temporal.PlainDateTime` object from another value.
If the value is another `Temporal.PlainDateTime` object, a new object representing the same date and time is returned.
If the value is any other object, a `Temporal.PlainDateTime` will be constructed from the values of any `year` (or `era` and `eraYear`), `month` (or `monthCode`), `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and `calendar` properties that are present.

At least the `year` (or `era` and `eraYear`), `month` (or `monthCode`), and `day` properties must be present.
Default values for other missing fields are determined by the calendar.

If the `calendar` property is not present, it's assumed to be `'iso8601'` (identifying the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates)).
Any other missing properties will be assumed to be 0 (for time fields).

If the value is not an object, it must be a string, which is expected to be in ISO 8601 format.
Time zone or UTC offset information will be ignored, with one exception: if a string contains a `Z` in place of a numeric UTC offset, then a `RangeError` will be thrown because interpreting these strings as a local date and time is usually a bug. `Temporal.Instant.from` should be used instead to parse these strings, and the result's `toZonedDateTimeISO` method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of `Z`-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone `'UTC'`. For example, the following code returns a "UTC date": `Temporal.Instant.from(item).toZonedDateTimeISO('UTC').toPlainDate()`.

If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`).
- In `'reject'` mode, the presence of out-of-range values (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`) will cause the function to throw a `RangeError`.

The `overflow` option is ignored if `item` is a string.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> In the default `'constrain'` mode and when parsing an ISO 8601 string, this will be converted to 59.
> In `'reject'` mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use `'reject'`.

> **NOTE**: The allowed values for the `item.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30');
dt = Temporal.PlainDateTime.from('19951207T032430');
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => 1995-12-07T03:24:30
  // same as above; time zone is ignored
dt === Temporal.PlainDateTime.from(dt); // => false

dt = Temporal.PlainDateTime.from({
  year: 1995,
  month: 12,
  day: 7,
  hour: 3,
  minute: 24,
  second: 30,
  millisecond: 0,
  microsecond: 3,
  nanosecond: 500
}); // => 1995-12-07T03:24:30.0000035
dt = Temporal.PlainDateTime.from({ year: 1995, month: 12, day: 7 }); // => 1995-12-07T00:00:00
dt = Temporal.PlainDateTime.from(Temporal.PlainDate.from('1995-12-07T03:24:30'));
  // => 1995-12-07T00:00:00
  // same as above; Temporal.PlainDate has year, month, and day properties

dt = Temporal.PlainDateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar: 'hebrew' });
  // => 1995-12-07T03:24:30[u-ca=hebrew]

// Different overflow modes
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' });
  // => 2001-12-01T00:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 32 }, { overflow: 'constrain' });
  // => 2001-01-31T00:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'constrain' });
  // => 2001-01-01T23:00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'constrain' });
  // => 2001-01-01T00:59:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' });
  // => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 32 }, { overflow: 'reject' });
  // => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'reject' });
  // => throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'reject' });
  // => throws
```
<!-- prettier-ignore-end -->

### Temporal.PlainDateTime.**compare**(_one_: Temporal.PlainDateTime | object | string, _two_: Temporal.PlainDateTime | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainDateTime` or value convertible to one): First date/time to compare.
- `two` (`Temporal.PlainDateTime` or value convertible to one): Second date/time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainDateTime` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`
- 0 if `one` and `two` are the same date and time when projected into the ISO 8601 calendar
- 1 if `one` comes after `two`

If `one` and `two` are not `Temporal.PlainDateTime` objects, then they will be converted to one as if they were passed to `Temporal.PlainDateTime.from()`.

Calendars are ignored in the comparison.
For example, this method returns `0` for instances that fall on the same day and time in the ISO 8601 calendar, even if their calendars describe it with a different `year`, `month`, and/or `day`.

This function can be used to sort arrays of `Temporal.PlainDateTime` objects.
For example:

```javascript
one = Temporal.PlainDateTime.from('1995-12-07T03:24');
two = Temporal.PlainDateTime.from('1995-12-07T01:24');
three = Temporal.PlainDateTime.from('2015-12-07T01:24');
sorted = [one, two, three].sort(Temporal.PlainDateTime.compare);
sorted.join(' ');
// => '1995-12-07T01:24:00 1995-12-07T03:24:00 2015-12-07T01:24:00'
```

## Properties

### datetime.**year** : number

### datetime.**month** : number

### datetime.**monthCode** : string

### datetime.**day** : number

### datetime.**hour**: number

### datetime.**minute**: number

### datetime.**second**: number

### datetime.**millisecond**: number

### datetime.**microsecond**: number

### datetime.**nanosecond**: number

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
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
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

dt = Temporal.PlainDateTime.from('2019-02-23T03:24:30.000003500[u-ca=hebrew]');
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

### datetime.**calendarId** : string

The `calendarId` read-only property gives the identifier of the calendar that the `year`, `month`, `monthCode`, and `day` properties are interpreted in.

### datetime.**era** : string | undefined

### datetime.**eraYear** : number | undefined

In calendars that use eras, the `era` and `eraYear` read-only properties can be used together to resolve an era-relative year.
Both properties are `undefined` when using the ISO 8601 calendar.
As inputs to `from` or `with`, `era` and `eraYear` can be used instead of `year`.
Unlike `year`, `eraYear` may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

```javascript
date = Temporal.PlainDateTime.from('-000015-01-01T12:30[u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
```

### datetime.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][dt.dayOfWeek - 1]; // => 'THU'
```

### datetime.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
// ISO ordinal date
console.log(dt.year, dt.dayOfYear); // => '1995 341'
```

### datetime.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

When combining the week number with a year number, make sure to use `datetime.yearOfWeek` instead of `datetime.year`.
This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('2022-01-01T03:24:30.000003500');
// ISO week date
console.log(dt.yearOfWeek, dt.weekOfYear, dt.dayOfWeek); // => '2021 52 6'
```

### datetime.**yearOfWeek** : number

The `yearOfWeek` read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number.
For the ISO 8601 calendar, this is normally the same as `datetime.year`, but in a few cases it may be the previous or following year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

See `weekOfYear` for a usage example.

### datetime.**daysInWeek** : number

The `daysInWeek` read-only property gives the number of days in the week that the date falls in.
For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.daysInWeek; // => 7
```

### datetime.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const dt = Temporal.Now.plainDateTimeISO().with({ month });
  monthsByDays[dt.daysInMonth] = (monthsByDays[dt.daysInMonth] || []).concat(dt);
}

const strings = monthsByDays[30].map((dt) => dt.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### datetime.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the date falls in.
For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

```javascript
dt = Temporal.Now.plainDateTimeISO();
percent = dt.dayOfYear / dt.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
```

### datetime.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the date falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
dt = Temporal.PlainDate.from('1900-01-01T12:00');
dt.monthsInYear; // => 12
```

### datetime.**inLeapYear** : boolean

The `inLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

```javascript
// Is this year a leap year?
dt = Temporal.Now.plainDateTime('iso8601');
dt.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
dt.with({ year: 2100 }).inLeapYear; // => false
```

## Methods

### datetime.**with**(_dateTimeLike_: object, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `dateTimeLike` (object): an object with some or all of the properties of a `Temporal.PlainDateTime`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDateTime` object.

This method creates a new `Temporal.PlainDateTime` which is a copy of `datetime`, but any properties present on `dateTimeLike` override the ones already present on `datetime`.

Since `Temporal.PlainDateTime` objects each represent a fixed date and time, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `dateTimeLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `dateTimeLike`.
> See the `withCalendar` and `toZonedDateTime` methods instead.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.with({ year: 2015, second: 31 }); // => 2015-12-07T03:24:31.0000035
```

### datetime.**withPlainTime**(_plainTime_?: object | string) : Temporal.PlainDateTime

**Parameters:**

- `plainTime` (optional `Temporal.PlainTime` or plain object or string): The clock time that should replace the current clock time of `datetime`.
  If omitted, the clock time of the result will be `00:00:00`.

**Returns:** a new `Temporal.PlainDateTime` object which is the date indicated by `datetime`, combined with the time represented by `plainTime`.

Valid input to `withPlainTime` is the same as valid input to `Temporal.PlainTime.from`, including strings like `12:15:36`, plain object property bags like `{ hour: 20, minute: 30 }`, or `Temporal` objects that contain time fields: `Temporal.PlainTime`, `Temporal.ZonedDateTime`, or `Temporal.PlainDateTime`.

This method is similar to `with`, but with a few important differences:

- `withPlainTime` accepts strings, Temporal objects, or object property bags.
  `with` only accepts object property bags and does not accept strings nor `Temporal.PlainTime` objects because they can contain calendar information.
- `withPlainTime` will default all missing time units to zero, while `with` will only change units that are present in the input object.

If `plainTime` is a `Temporal.PlainTime` object, then this method returns the same result as `plainTime.toPlainDateTime(datetime)` but can be easier to use, especially when chained to previous operations that return a `Temporal.PlainDateTime`.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('2015-12-07T03:24:30.000003500');
dt.withPlainTime({ hour: 10 }); // => 2015-12-07T10:00:00
time = Temporal.PlainTime.from('11:22');
dt.withPlainTime(time); // => 2015-12-07T11:22:00
dt.withPlainTime('12:34'); // => 2015-12-07T12:34:00

// easier for chaining
dt.add({ days: 2, hours: 22 }).withPlainTime('00:00'); // => 2015-12-10T00:00:00
```

### datetime.**withCalendar**(_calendar_: object | string) : Temporal.PlainDateTime

**Parameters:**

- `calendar` (object or string): The calendar into which to project `datetime`.

**Returns:** a new `Temporal.PlainDateTime` object which is the date indicated by `datetime`, projected into `calendar`.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500[u-ca=japanese]');
dt.withCalendar('iso8601'); // => 1995-12-07T03:24:30.0000035
```

### datetime.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDateTime` object which is the date and time indicated by `datetime` plus `duration`.

This method adds `duration` to `datetime`, returning a point in time that is in the future relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some additions may be ambiguous, because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.add({ years: 20, months: 4, nanoseconds: 500 }); // => 2016-04-07T03:24:30.000004

dt = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt.add({ months: 1 }); // => 2019-02-28T15:30:00
dt.add({ months: 1 }, { overflow: 'reject' }); // => throws
```

### datetime.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDateTime` object which is the time indicated by `datetime` minus `duration`.

This method subtracts `duration` from `datetime`, returning a point in time that is in the past relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some subtractions may be ambiguous, because months have different lengths.
For example, subtracting one month from July 31 would result in June 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.subtract({ years: 20, months: 4, nanoseconds: 500 }); // => 1975-08-07T03:24:30.000003

dt = Temporal.PlainDateTime.from('2019-03-31T15:30');
dt.subtract({ months: 1 }); // => 2019-02-28T15:30:00
dt.subtract({ months: 1 }, { overflow: 'reject' }); // => throws
```

### datetime.**until**(_other_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDateTime` or value convertible to one): Another date/time until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
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

**Returns:** a `Temporal.Duration` representing the elapsed time after `datetime` and until `other`.

This method computes the difference between the two times represented by `datetime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `datetime` then the resulting duration will be negative.
If using the default `options`, adding the returned `Temporal.Duration` to `datetime` will yield `other`.

If `other` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.
A value of `'auto'` means `'day'`, unless `smallestUnit` is `'year'`, `'month'`, or `'week'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is days.
This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to an increment expressed in days or larger units requires a reference point, `datetime` is used as the starting point in that case.
The default is to do no rounding.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two date/times in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `datetime.withCalendar()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.until(dt2);
  // => P8456DT12H5M29.9999965S
dt1.until(dt2, { largestUnit: 'year' });
  // => P23Y1M24DT12H5M29.9999965S
dt2.until(dt1, { largestUnit: 'year' });
  // => -P23Y1M24DT12H5M29.9999965S
dt1.until(dt2, { largestUnit: 'nanosecond' });
  // => PT730641929.999996544S
  // (precision lost)

// Rounding, for example if you don't care about sub-seconds
dt1.until(dt2, { smallestUnit: 'second' });
  // => P8456DT12H5M29S

// Months and years can be different lengths
let [jan1, feb1, mar1] = [1, 2, 3].map((month) =>
  Temporal.PlainDateTime.from({ year: 2020, month, day: 1 }));
jan1.until(feb1);                            // => P31D
jan1.until(feb1, { largestUnit: 'month' }); // => P1M
feb1.until(mar1);                            // => P29D
feb1.until(mar1, { largestUnit: 'month' }); // => P1M
jan1.until(mar1);                            // => P60D
```
<!-- prettier-ignore-end -->

### datetime.**since**(_other_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDateTime` or value convertible to one): Another date/time since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
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

**Returns:** a `Temporal.Duration` representing the elapsed time before `datetime` and since `other`.

This method computes the difference between the two times represented by `datetime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `datetime` then the resulting duration will be negative.

This method is similar to `Temporal.PlainDateTime.prototype.until()`, but reversed.
If using the default `options`, subtracting the returned `Temporal.Duration` from `datetime` will yield `other`, and `dt1.since(dt2)` will yield the same result as `dt1.until(dt2).negated()`.

Usage example:

```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt2.since(dt1); // => P8456DT12H5M29.9999965S
```

### datetime.**round**(_roundTo_: string | object) : Temporal.PlainDateTime

**Parameters:**

- `roundTo` (string | object): A required string or object to control the operation.
  - If a string is provided, the resulting `Temporal.PlainDateTime` object will be rounded to that unit.
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

**Returns:** a new `Temporal.PlainDateTime` object which is `datetime` rounded to `roundTo` (if a string parameter is used) or `roundingIncrement` of `smallestUnit` (if an object parameter is used).

Rounds `datetime` to the given unit and increment, and returns the result as a new `Temporal.PlainDateTime` object.

The `smallestUnit` option (or the value of `roundTo` if a string parameter is used) determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

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
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');

// Round to a particular unit
dt.round({ smallestUnit: 'hour' }); // => 1995-12-07T03:00:00
// Round to an increment of a unit, e.g. half an hour:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 1995-12-07T03:30:00
// Round to the same increment but round down instead:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 1995-12-07T03:00:00
```
<!-- prettier-ignore-end -->

### datetime.**equals**(_other_: Temporal.PlainDateTime | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainDateTime`): Another date/time to compare.

**Returns:** `true` if `datetime` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainDateTime` objects for equality.

This function exists because it's not possible to compare using `datetime == other` or `datetime === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates/times occur, then this function may be less typing and more efficient than `Temporal.PlainDateTime.compare`.

Note that this function will return `false` if the two objects have different `calendar` properties, even if the actual dates and times are equal.

If `other` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

Example usage:

```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.equals(dt2); // => false
dt1.equals(dt1); // => true
```

### datetime.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
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

**Returns:** a string in the ISO 8601 date format representing `datetime`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `datetime`.
The string can be passed to `Temporal.PlainDateTime.from()` to create a new `Temporal.PlainDateTime` object.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.PlainDateTime.round()`.
Note that rounding may change the value of other units as well.

Normally, a calendar annotation is shown when `datetime`'s calendar is not the ISO 8601 calendar.
By setting the `calendarName` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
Normally not necessary, a value of `'critical'` is equivalent to `'always'` but the annotation will contain an additional `!` for certain interoperation use cases.
For more information on the calendar annotation, see [the `Temporal` string formats documentation](./strings.md#calendar-systems).

Example usage:

<!-- prettier-ignore-start -->
```js
dt = Temporal.PlainDateTime.from({
  year: 1999,
  month: 12,
  day: 31,
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999,
  microsecond: 999,
  nanosecond: 999
});
dt.toString(); // => '1999-12-31T23:59:59.999999999'

dt.toString({ smallestUnit: 'minute' });    // => '1999-12-31T23:59'
dt.toString({ fractionalSecondDigits: 0 }); // => '1999-12-31T23:59:59'
dt.toString({ fractionalSecondDigits: 4 }); // => '1999-12-31T23:59:59.9999'
dt.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' });
// => '2000-01-01T00:00:00.00000000'
```
<!-- prettier-ignore-end -->

### datetime.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `datetime`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `datetime`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

> **NOTE**: Unlike in [`Temporal.Instant.prototype.toLocaleString()`](./instant.md#toLocaleString), `options.timeZone` will have no effect, because `Temporal.PlainDateTime` carries no time zone information.
> It's not always possible to uniquely determine the localized time zone name using the `Temporal.PlainDateTime` instance and the `options.timeZone`.
> Therefore, to display a localized date and time including its time zone, convert the `Temporal.PlainDateTime` to a `Temporal.ZonedDateTime` or `Temporal.Instant` and then call the `toLocaleString()` method.

Example usage:

```js
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toLocaleString(); // example output: 1995-12-07, 3:24:30 a.m.
dt.toLocaleString('de-DE'); // example output: 7.12.1995, 03:24:30
dt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' }); // => 'Donnerstag'
dt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => '１２/７/１９９５, ３:２４:３０ AM'
```

### datetime.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `datetime`.

This method is the same as `datetime.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainDateTime` object from a string, is `Temporal.PlainDateTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainDateTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainDateTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const event = {
  id: 311,
  name: 'FictionalConf 2018',
  openingDateTime: Temporal.PlainDateTime.from('2018-07-06T10:00'),
  closingDateTime: Temporal.PlainDateTime.from('2018-07-08T18:15')
};
const str = JSON.stringify(event, null, 2);
console.log(str);
// =>
// {
//   "id": 311,
//   "name": "FictionalConf 2018",
//   "openingDateTime": "2018-07-06T10:00",
//   "closingDateTime": "2018-07-08T18:15"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('DateTime')) return Temporal.PlainDateTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### datetime.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainDateTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainDateTime.compare()` for this, or `datetime.equals()` for equality.

### datetime.**toZonedDateTime**(_timeZone_ : object | string, _options_?: object) : Temporal.ZonedDateTime

**Parameters:**

 - `timeZone` (string or `Temporal.ZonedDateTime`): the time zone in which to interpret `dateTime`, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `dateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** A `Temporal.ZonedDateTime` object representing the calendar date and wall-clock time from `dateTime` projected into `timeZone`.

This method converts a `Temporal.PlainDateTime` to a `Temporal.ZonedDateTime` by adding a time zone.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

In the case of ambiguity caused by DST or other time zone changes, the `disambiguation` option controls how to resolve the ambiguity:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting nonexistent `Temporal.PlainDateTime` values to `Temporal.ZonedDateTime`, but it also means that values during these periods will result in a different `Temporal.PlainDateTime` in "round-trip" conversions to `Temporal.ZonedDateTime` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Time Zones and Resolving Ambiguity](./timezone.md).

If the result is earlier or later than the range that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

### datetime.**toPlainDate**() : Temporal.PlainDate

**Returns:** a `Temporal.PlainDate` object that is the same as the date portion of `datetime`.

### datetime.**toPlainTime**() : Temporal.PlainTime

**Returns:** a `Temporal.PlainTime` object that is the same as the wall-clock time portion of `datetime`.

The above two methods can be used to convert `Temporal.PlainDateTime` into a `Temporal.PlainDate` or `Temporal.PlainTime` respectively.
The converted object carries a copy of all the relevant fields of `datetime` (for example, in `toPlainDate()`, the `year`, `month`, and `day` properties are copied.)

To convert to `Temporal.PlainYearMonth` or `Temporal.PlainMonthDay`, first use `toPlainDate()` and go from there.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toPlainDate(); // => 1995-12-07
dt.toPlainTime(); // => 03:24:30.0000035
dt.toPlainDate().toPlainYearMonth(); // => 1995-12
dt.toPlainDate().toPlainMonthDay(); // => 12-07
```
