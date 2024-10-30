# Temporal.PlainDate

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainDate` represents a calendar date.
"Calendar date" refers to the concept of a date as expressed in everyday usage, independent of any time zone.
For example, it could be used to represent an event on a calendar which happens during the whole day no matter which time zone it's happening in.

`Temporal.PlainDate` refers to the whole of a specific day; if you need to refer to a specific time on that day, use `Temporal.PlainDateTime`.
A `Temporal.PlainDate` can be converted into a `Temporal.ZonedDateTime` by combining it with a `Temporal.PlainTime` and time zone identifier using the `toZonedDateTime()` method.
It can also be combined with a `Temporal.PlainTime` to yield a "zoneless" `Temporal.PlainDateTime` using the `toPlainDateTime()` method.

`Temporal.PlainYearMonth` and `Temporal.PlainMonthDay` carry less information than `Temporal.PlainDate` and should be used when complete information is not required.

## Constructor

### **new Temporal.PlainDate**(_isoYear_: number, _isoMonth_: number, _isoDay_: number, _calendar_: string = "iso8601") : Temporal.PlainDate

**Parameters:**

- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `calendar` (optional string): A calendar to project the date into.

**Returns:** a new `Temporal.PlainDate` object.

Use this constructor if you have the correct parameters for the date already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainDate.from()`, which accepts more kinds of input, allows inputting dates in different calendar reckonings, and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

The range of allowed values for this type is exactly enough that calling [`toPlainDate()`](./plaindatetime.md#toPlainDate) on any valid `Temporal.PlainDateTime` will succeed.
If `isoYear`, `isoMonth`, and `isoDay` form a date outside of this range, then this function will throw a `RangeError`.

`calendar` is a string containing the identifier of a built-in calendar, such as `'islamic'` or `'gregory'`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// Pi day in 2020
date = new Temporal.PlainDate(2020, 3, 14); // => 2020-03-14
```

## Static methods

### Temporal.PlainDate.**from**(_item_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `item`: a value convertible to a `Temporal.PlainDate`.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDate` object.

This static method creates a new `Temporal.PlainDate` object from another value.
If the value is another `Temporal.PlainDate` object, a new object representing the same date is returned.
If the value is any other object, it:

- Must have a `year` property or (for calendars that support eras) an `era` and `eraYear` property.
- Must have either a number `month` property or a string `monthCode` property.
- May have a `calendar` property. If omitted, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates) will be used by default.

If the value is not an object, it must be a string, which is expected to be in ISO 8601 format.
Any time part is optional and will be ignored.
Time zone or UTC offset information will also be ignored, with one exception: if a string contains a `Z` in place of a numeric UTC offset, then a `RangeError` will be thrown because interpreting these strings as a local date and time is usually a bug. `Temporal.Instant.from` should be used instead to parse these strings, and the result's `toZonedDateTimeISO` method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of `Z`-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone `'UTC'`. For example, the following code returns a "UTC date": `Temporal.Instant.from(item).toZonedDateTimeISO('UTC').toPlainDate()`.

If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`).
- In `'reject'` mode, the presence of out-of-range values (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`) will cause the function to throw a `RangeError`.

The `overflow` option is ignored if `item` is a string.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this function will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `item.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

<!-- prettier-ignore-start -->
```javascript
date = Temporal.PlainDate.from('2006-08-24'); // => 2006-08-24
date = Temporal.PlainDate.from('20060824'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27'); // => 2006-08-24
date = Temporal.PlainDate.from('2006-08-24T15:43:27+01:00[Europe/Brussels]');
  // => 2006-08-24
date === Temporal.PlainDate.from(date); // => false

date = Temporal.PlainDate.from({ year: 2006, month: 8, day: 24 }); // => 2006-08-24
date = Temporal.PlainDate.from(Temporal.PlainDateTime.from('2006-08-24T15:43:27'));
  // => 2006-08-24
  // same as above; Temporal.PlainDateTime has year, month, and day properties

date = Temporal.PlainDate.from({ year: 1427, month: 8, day: 1, calendar: 'islamic' });
  // => 2006-08-24[u-ca=islamic]

// Different overflow modes
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' });
  // => 2001-12-01
date = Temporal.PlainDate.from({ year: 2001, month: 1, day: 32 }, { overflow: 'constrain' });
  // => 2001-01-31
date = Temporal.PlainDate.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' });
  // => throws
date = Temporal.PlainDate.from({ year: 2001, month: 1, day: 32 }, { overflow: 'reject' });
  // => throws
```
<!-- prettier-ignore-end -->

### Temporal.PlainDate.**compare**(_one_: Temporal.PlainDate | object | string, _two_: Temporal.PlainDate | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainDate` or value convertible to one): First date to compare.
- `two` (`Temporal.PlainDate` or value convertible to one): Second date to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainDate` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`
- 0 if `one` and `two` are the same date when projected into the ISO 8601 calendar
- 1 if `one` comes after `two`

If `one` or `two` are not `Temporal.PlainDate` objects, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()`.

Calendars are ignored in the comparison.
For example, this method returns `0` for instances that fall on the same day in the ISO 8601 calendar, even if their calendars describe it with a different `month`, `year`, and/or `day`.

This function can be used to sort arrays of `Temporal.PlainDate` objects.
For example:

```javascript
one = Temporal.PlainDate.from('2006-08-24');
two = Temporal.PlainDate.from('2015-07-14');
three = Temporal.PlainDate.from('1930-02-18');
sorted = [one, two, three].sort(Temporal.PlainDate.compare);
sorted.join(' '); // => '1930-02-18 2006-08-24 2015-07-14'
```

## Properties

### date.**year** : number

### date.**month** : number

### date.**monthCode** : string

### date.**day** : number

The above read-only properties allow accessing each component of a date individually.

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

Usage examples:

<!-- prettier-ignore-start -->
```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.year;      // => 2006
date.month;     // => 8
date.monthCode; // => 'M08'
date.day;       // => 24

date = Temporal.PlainDate.from('2019-02-23[u-ca=hebrew]');
date.year;      // => 5779
date.month;     // => 6
date.monthCode; // => 'M05L'
date.day;       // => 18
```
<!-- prettier-ignore-end -->

### date.**calendarId** : string

The `calendarId` read-only property gives the identifier of the calendar that the `year`, `month`, `monthCode`, and `day` properties are interpreted in.

### date.**era** : string | undefined

### date.**eraYear** : number | undefined

In calendars that use eras, the `era` and `eraYear` read-only properties can be used together to resolve an era-relative year.
Both properties are `undefined` when using the ISO 8601 calendar.
As inputs to `from` or `with`, `era` and `eraYear` can be used instead of `year`.
Unlike `year`, `eraYear` may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

```javascript
date = Temporal.PlainDate.from('-000015-01-01[u-ca=gregory]');
date.era;
// => 'bce'
date.eraYear;
// => 16
date.year;
// => -15
```

### date.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][date.dayOfWeek - 1]; // => 'THU'
```

### date.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
// ISO ordinal date
console.log(date.year, date.dayOfYear); // => '2006 236'
```

### date.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

When combining the week number with a year number, make sure to use `date.yearOfWeek` instead of `date.year`.
This is because the first few days of a calendar year may be part of the last week of the previous year, and the last few days of a calendar year may be part of the first week of the new year, depending on which year the first Thursday falls in.

Usage example:

```javascript
date = Temporal.PlainDate.from('2022-01-01');
// ISO week date
console.log(date.yearOfWeek, date.weekOfYear, date.dayOfWeek); // => '2021 52 6'
```

### date.**yearOfWeek** : number

The `yearOfWeek` read-only property gives the ISO "week calendar year" of the date, which is the year number corresponding to the ISO week number.
For the ISO 8601 calendar, this is normally the same as `date.year`, but in a few cases it may be the previous or following year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

See `weekOfYear` for a usage example.

### date.**daysInWeek** : number

The `daysInWeek` read-only property gives the number of days in the week that the date falls in.
For the ISO 8601 calendar, this is always 7, but in other calendar systems it may differ from week to week.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.daysInWeek; // => 7
```

### date.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const date = Temporal.Now.plainDateISO().with({ month });
  monthsByDays[date.daysInMonth] = (monthsByDays[date.daysInMonth] || []).concat(date);
}

const strings = monthsByDays[30].map((date) => date.toLocaleString('en', { month: 'long' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### date.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the date falls in.
For the ISO 8601 calendar, this is 365 or 366, depending on whether the year is a leap year.

Usage example:

```javascript
date = Temporal.Now.plainDateISO();
percent = date.dayOfYear / date.daysInYear;
`The year is ${percent.toLocaleString('en', { style: 'percent' })} over!`;
// example output: "The year is 10% over!"
```

### date.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the date falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
date = Temporal.PlainDate.from('1900-01-01');
date.monthsInYear; // => 12
```

### date.**inLeapYear** : boolean

The `inLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

```javascript
// Is this year a leap year?
date = Temporal.Now.plainDateISO();
date.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
date.with({ year: 2100 }).inLeapYear; // => false
```

## Methods

### date.**with**(_dateLike_: object, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `dateLike` (object): an object with some or all of the properties of a `Temporal.PlainDate`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDate` object.

This method creates a new `Temporal.PlainDate` which is a copy of `date`, but any properties present on `dateLike` override the ones already present on `date`.

Since `Temporal.PlainDate` objects each represent a fixed date, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `dateLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `dateLike`.
> See the `withCalendar` and `toZonedDateTime` methods instead.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-01-24');
// What's the first day of this month?
date.with({ day: 1 }); // => 2006-01-01
// What's the last day of the next month?
const nextMonthDate = date.add({ months: 1 });
nextMonthDate.with({ day: nextMonthDate.daysInMonth }); // => 2006-02-28
```

### date.**withCalendar**(_calendar_: object | string) : Temporal.PlainDate

**Parameters:**

- `calendar` (object or string): The calendar into which to project `date`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date`, projected into `calendar`.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24[u-ca=japanese]');
date.withCalendar('iso8601'); // => 2006-08-24
```

### date.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (optional string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date` plus `duration`.

This method adds `duration` to `date`, returning a date that is in the future relative to `date`.

The `duration` argument is an object with properties denoting a duration, such as `{ days: 5 }`, or a string such as `P5D`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

If `duration` has any units smaller than `days`, they will be treated as if they are being added to the first moment of the day given by `date`.
Effectively, this means that adding things like `{ minutes: 5 }` will be ignored.

Some additions may be ambiguous, because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.add({ years: 20, months: 4 }); // => 2026-12-24

date = Temporal.PlainDate.from('2019-01-31');
date.add({ months: 1 }); // => 2019-02-28
date.add({ months: 1 }, { overflow: 'reject' }); // => throws
```

### date.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDate

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainDate` object which is the date indicated by `date` minus `duration`.

This method subtracts `duration` from `date`, returning a date that is in the past relative to `date`.

The `duration` argument is an object with properties denoting a duration, such as `{ days: 5 }`, or a string such as `P5D`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

If `duration` has any units smaller than `days`, they will be treated as if they are being subtracted from the last moment of the day given by `date`.
Effectively, this means that subtracting things like `{ minutes: 5 }` will be ignored.

Some subtractions may be ambiguous, because months have different lengths.
For example, subtracting one month from July 31 would result in June 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `'constrain'` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDate` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.subtract({ years: 20, months: 4 }); // => 1986-04-24

date = Temporal.PlainDate.from('2019-03-31');
date.subtract({ months: 1 }); // => 2019-02-28
date.subtract({ months: 1 }, { overflow: 'reject' }); // => throws
```

### date.**until**(_other_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, `'week'`, and `'day'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`.
    The default is `'day'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the time elapsed after `date` and until `other`.

This method computes the difference between the two dates represented by `date` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `date` then the resulting duration will be negative.
If using the default `options`, adding the returned `Temporal.Duration` to `date` will yield `other`.

If `other` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two years will become 24 months when `largestUnit` is `'months'`, for example.
However, a difference of two months will still be two months even if `largestUnit` is `'years'`.
A value of `'auto'` means `'day'`, unless `smallestUnit` is `'year'`, `'month'`, or `'week'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is days.
This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to calendar units requires a reference point, `date` is used as the starting point.
The default is to do no rounding.

For rounding purposes, a `Temporal.PlainDate` instance will be treated the same as a `Temporal.PlainDateTime` instance with the time set to midnight.
Therefore when rounding using the `'halfExpand'` rounding mode, dates at the exact midpoint of the `smallestUnit` will be rounded down.

Unlike other Temporal types, hours and lower are not allowed for either `largestUnit` or `smallestUnit`, because the data model of `Temporal.PlainDate` doesn't have that accuracy.

Computing the difference between two dates in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `date.withCalendar()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
earlier.until(later);                           // => P4543D
earlier.until(later, { largestUnit: 'year' }); // => P12Y5M7D
later.until(earlier, { largestUnit: 'year' }); // => -P12Y5M7D

// If you really need to calculate the difference between two Dates in
// hours, you can eliminate the ambiguity by explicitly choosing the
// point in time from which you want to reckon the difference. For
// example, using noon:
noon = Temporal.PlainTime.from('12:00');
earlier.toPlainDateTime(noon).until(later.toPlainDateTime(noon), { largestUnit: 'hour' });
  // => PT109032H

newyear = Temporal.PlainDate.from('2020-01-01');
newyear.until('2020-01-15', { smallestUnit: 'month', roundingMode: 'halfExpand' });
  // => PT0S
newyear.until('2020-01-16', { smallestUnit: 'month', roundingMode: 'halfExpand' });
  // => PT0S (mid-month dates rounded down to match `Temporal.PlainDateTime` behavior)
newyear.until('2020-01-17', { smallestUnit: 'month', roundingMode: 'halfExpand' });
  // => PT1M
```
<!-- prettier-ignore-end -->

### date.**since**(_other_: Temporal.PlainDate | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, `'week'`, and `'day'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`.
    The default is `'day'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the time elapsed before `date` and since `other`.

This method computes the difference between the two dates represented by `date` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `date` then the resulting duration will be negative.

This method is similar to `Temporal.PlainDate.prototype.until()`, but reversed.
If using the default `options`, subtracting the returned `Temporal.Duration` from `date` will yield `other`, and `date1.since(date2)` will yield the same result as `date1.until(date2).negated()`.

Usage example:

```javascript
earlier = Temporal.PlainDate.from('2006-08-24');
later = Temporal.PlainDate.from('2019-01-31');
later.since(earlier); // => P4543D
```

### date.**equals**(_other_: Temporal.PlainDate | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainDate` or value convertible to one): Another date to compare.

**Returns:** `true` if `date` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainDate` objects for equality.

This function exists because it's not possible to compare using `date == other` or `date === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates occur, then this function may be less typing and more efficient than `Temporal.PlainDate.compare`.

Note that this function will return `false` if the two objects have different `calendar` properties, even if the actual dates are equal.

If `other` is not a `Temporal.PlainDate` object, then it will be converted to one as if it were passed to `Temporal.PlainDate.from()`.

Example usage:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
other = Temporal.PlainDate.from('2019-01-31');
date.equals(other); // => false
date.equals(date); // => true
```

### date.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `calendarName` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, `'never'`, and `'critical'`.
    The default is `'auto'`.

**Returns:** a string in the ISO 8601 date format representing `date`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `date`.
The string can be passed to `Temporal.PlainDate.from()` to create a new `Temporal.PlainDate` object.

Normally, a calendar annotation is shown when `date`'s calendar is not the ISO 8601 calendar.
By setting the `calendarName` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
Normally not necessary, a value of `'critical'` is equivalent to `'always'` but the annotation will contain an additional `!` for certain interoperation use cases.
For more information on the calendar annotation, see [the `Temporal` string formats documentation](./strings.md#calendar-systems).

Example usage:

```js
date = Temporal.PlainDate.from('2006-08-24');
date.toString(); // => '2006-08-24'
```

### date.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `date`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `date`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

Example usage:

```js
date = Temporal.PlainDate.from('2006-08-24');
date.toLocaleString(); // example output: 8/24/2006
date.toLocaleString('de-DE'); // example output: '24.8.2006'
date.toLocaleString('de-DE', { weekday: 'long' }); // => 'Donnerstag'
date.toLocaleString('en-US-u-nu-fullwide'); // => '８/２４/２００６'
```

### date.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `date`.

This method is the same as `date.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainDate` object from a string, is `Temporal.PlainDate.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainDate` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainDate`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const student = {
  id: 429,
  name: 'Emilia Connor',
  birthDate: Temporal.PlainDate.from('1997-09-08')
};
const str = JSON.stringify(student, null, 2);
console.log(str);
// =>
// {
//   "id": 429,
//   "name": "Emilia Connor",
//   "birthDate": "1997-09-08"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Date')) return Temporal.PlainDate.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### date.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainDate` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainDate.compare()` for this, or `date.equals()` for equality.

### date.**toZonedDateTime**(_item_: object) : Temporal.ZonedDateTime

**Parameters:**

- `item` (object): an object with properties to be added to `date`. The following properties are recognized:
  - `plainTime` (optional `Temporal.PlainTime` or value convertible to one): a time of day on `date` used to merge into a `Temporal.ZonedDateTime`.
  - `timeZone` (required string or `Temporal.ZonedDateTime`): the time zone in which to interpret `date` and `plainTime`, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.

**Returns:** a `Temporal.ZonedDateTime` object that represents the wall-clock time `plainTime` on the calendar date `date` projected into `timeZone`.

This method can be used to convert `Temporal.PlainDate` into a `Temporal.ZonedDateTime`, by supplying the time zone and time of day.
The default `plainTime`, if it's not provided, is the first valid local time in `timeZone` on the calendar date `date`.
Usually this is midnight (`00:00`), but may be a different time in rare circumstances like DST skipping midnight.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

In addition to the `timeZone`, the converted object carries a copy of all the relevant fields of `date` and `plainTime`.
If `plainTime` is provided but is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.
If `plainTime` is provided, this method is equivalent to [`Temporal.PlainTime.from(plainTime).toPlainDateTime(date).toZonedDateTime(timeZone)`](./plaintime.md#toZonedDateTime).


In the case of ambiguity caused by DST or other time zone changes, the earlier time will be used for backward transitions and the later time for forward transitions.
When interoperating with existing code or services, this matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset.
This behavior avoids exceptions when converting nonexistent date/time values to `Temporal.ZonedDateTime`, but it also means that values during these periods will result in a different `Temporal.PlainTime` value in "round-trip" conversions to `Temporal.ZonedDateTime` and back again.

For usage examples and a more complete explanation of how this disambiguation works, see [Time Zones and Resolving Ambiguity](./timezone.md).

If the result is outside the range that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown.

Usage example:

```javascript
plainDate = Temporal.PlainDate.from('2006-08-24');
plainTime = Temporal.PlainTime.from('15:23:30.003');
plainDate.toZonedDateTime({ timeZone: 'America/Los_Angeles', plainTime });
// => 2006-08-24T15:23:30.003-07:00[America/Los_Angeles]
plainDate.toZonedDateTime({ timeZone: 'America/Los_Angeles' });
// => 2006-08-24T00:00:00-07:00[America/Los_Angeles]
```

### date.**toPlainDateTime**(_time_?: Temporal.PlainTime | object | string) : Temporal.PlainDateTime

**Parameters:**

- `time` (optional `Temporal.PlainTime` or value convertible to one): A time of day on `date`.

**Returns:** a `Temporal.PlainDateTime` object that represents the wall-clock time `time` on the calendar date `date`.

This method can be used to convert `Temporal.PlainDate` into a `Temporal.PlainDateTime`, by supplying the time of day to use.
The default `time`, if it is not given, is midnight (00:00).
The converted object carries a copy of all the relevant fields of `date` and `time`.

If `time` is given, this is equivalent to [`Temporal.PlainTime.from(time).toPlainDateTime(date)`](./plaintime.md#toPlainDateTime).

If `time` is given and is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
time = Temporal.PlainTime.from('15:23:30.003');
date.toPlainDateTime(time); // => 2006-08-24T15:23:30.003
date.toPlainDateTime(); // => 2006-08-24T00:00:00
```

### date.**toPlainYearMonth**() : Temporal.PlainYearMonth

**Returns:** a `Temporal.PlainYearMonth` object that is the same as the year and month of `date`.

### date.**toPlainMonthDay**() : Temporal.PlainMonthDay

**Returns:** a `Temporal.PlainMonthDay` object that is the same as the month and day of `date`.

The above two methods can be used to convert `Temporal.PlainDate` into a `Temporal.PlainYearMonth` or `Temporal.PlainMonthDay` respectively.
The converted object carries a copy of all the relevant fields of `date` (for example, in `toPlainYearMonth()`, the `year` and `month` properties are copied.)

Usage example:

```javascript
date = Temporal.PlainDate.from('2006-08-24');
date.toPlainYearMonth(); // => 2006-08
date.toPlainMonthDay(); // => 08-24
```
