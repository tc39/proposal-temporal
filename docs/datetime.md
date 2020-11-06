# Temporal.PlainDateTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainDateTime` represents a calendar date and wall-clock time, with a precision in nanoseconds, and without any time zone.
Of the `Temporal` classes carrying human-readable time information, it is the most general and complete one.
`Temporal.PlainDate`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, and `Temporal.PlainMonthDay` all carry less information and should be used when complete information is not required.

"Calendar date" and "wall-clock time" refer to the concept of time as expressed in everyday usage.
`Temporal.PlainDateTime` does not represent an exact point in time; that is what `Temporal.Instant` is for.

One example of when it would be appropriate to use `Temporal.PlainDateTime` and not `Temporal.Instant` is when integrating with wearable devices.
FitBit, for example, always records sleep data in the user's wall-clock time, wherever they are in the world.
Otherwise they would be recorded as sleeping at strange hours when travelling, even if their sleep rhythm was on a healthy schedule for the time zone they were in.

A `Temporal.PlainDateTime` can be converted to a `Temporal.Instant` using a `Temporal.TimeZone`.
A `Temporal.PlainDateTime` can also be converted into any of the other `Temporal` objects that carry less information, such as `Temporal.PlainDate` for the date or `Temporal.PlainTime` for the time.

## Constructor

### **new Temporal.PlainDateTime**(_isoYear_: number, _isoMonth_: number, _isoDay_: number, _isoHour_: number = 0, _isoMinute_: number = 0, _isoSecond_: number = 0, _isoMillisecond_: number = 0, _isoMicrosecond_: number = 0, _isoNanosecond_: number = 0, _calendar_?: object) : Temporal.PlainDateTime

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
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the datetime into.

**Returns:** a new `Temporal.PlainDateTime` object.

Use this constructor if you have the correct parameters for the datetime already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainDateTime.from()`, which accepts more kinds of input, allows inputting dates and times in different calendar reckonings, and allows controlling the overflow behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter, and the time parameters must represent a valid time of day.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> This value will cause the constructor will throw, so if you have to interoperate with times that may contain leap seconds, use `Temporal.PlainDateTime.from()` instead.

The range of allowed values for this type is exactly enough that calling [`toPlainDateTime()`](./instant.html#toPlainDateTime) on any valid `Temporal.Instant` with any valid `Temporal.TimeZone` will succeed.
If the parameters passed in to this constructor form a date outside of this range, then this function will throw a `RangeError`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// Leet hour on pi day in 2020
datetime = new Temporal.PlainDateTime(2020, 3, 14, 13, 37); // => 2020-03-14T13:37
```

## Static methods

### Temporal.PlainDateTime.**from**(_thing_: any, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `thing`: The value representing the desired date and time.
- `options` (optional object): An object with properties representing options for constructing the date and time.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDateTime` object.

This static method creates a new `Temporal.PlainDateTime` object from another value.
If the value is another `Temporal.PlainDateTime` object, a new object representing the same date and time is returned.
If the value is any other object, a `Temporal.PlainDateTime` will be constructed from the values of any `era`, `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and `calendar` properties that are present.

At least the `year`, `month`, and `day` properties must be present.
If `calendar` is a calendar that requires `era` (such as the Japanese calendar), then the `era` property must also be present.
Default values for other missing fields are determined by the calendar.

If the `calendar` property is not present, it will be assumed to be `Temporal.Calendar.from('iso8601')`, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
In this calendar, `era` is ignored, and the default values for other missing fields are all 0.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.
Any time zone part is optional and will be ignored.
If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.

The `overflow` option works as follows:

- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> In the default `constrain` mode and when parsing an ISO 8601 string, this will be converted to 59.
> In `reject` mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use `reject`.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30');
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30Z'); // => 1995-12-07T03:24:30
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => same as above; time zone is ignored
dt === Temporal.PlainDateTime.from(dt); // => true

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
}); // => 1995-12-07T03:24:30.000003500
dt = Temporal.PlainDateTime.from({ year: 1995, month: 12, day: 7 }); // => 1995-12-07T00:00
dt = Temporal.PlainDateTime.from(Temporal.PlainDate.from('1995-12-07T03:24:30'));
  // => same as above; Temporal.PlainDate has year, month, and day properties

calendar = Temporal.Calendar.from('hebrew');
dt = Temporal.PlainDateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar });
  // => 1995-12-07T03:24:30[c=hebrew]
dt = Temporal.PlainDateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar: 'hebrew' });
  // => same as above

// Different overflow modes
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'constrain' });
  // => 2001-12-01T00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: -1, day: 1 }, { overflow: 'constrain' });
  // => 2001-01-01T00:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'constrain' });
  // => 2001-01-01T23:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'constrain' });
  // => 2001-01-01T00:59
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { overflow: 'constrain' });
  // => 2001-01-01T01:00
dt = Temporal.PlainDateTime.from({ year: 2001, month: 13, day: 1 }, { overflow: 'reject' });
  // throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: -1, day: 1 }, { overflow: 'reject' });
  // throws
dt = Temporal.PlainDateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { overflow: 'reject' });
  // throws
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

- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

If `one` and `two` are not `Temporal.PlainDateTime` objects, then they will be converted to one as if they were passed to `Temporal.PlainDateTime.from()`.

This function can be used to sort arrays of `Temporal.PlainDateTime` objects.
For example:

```javascript
one = Temporal.PlainDateTime.from('1995-12-07T03:24');
two = Temporal.PlainDateTime.from('1995-12-07T01:24');
three = Temporal.PlainDateTime.from('2015-12-07T01:24');
sorted = [one, two, three].sort(Temporal.PlainDateTime.compare);
sorted.join(' ');
// => 1995-12-07T01:24 1995-12-07T03:24 2015-12-07T01:24
```

## Properties

### datetime.**year** : number

### datetime.**month** : number

### datetime.**day** : number

### datetime.**hour**: number

### datetime.**minute**: number

### datetime.**second**: number

### datetime.**millisecond**: number

### datetime.**microsecond**: number

### datetime.**nanosecond**: number

The above read-only properties allow accessing each component of the date or time individually.

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.year;        // => 1995
dt.month;       // => 12
dt.day;         // => 7
dt.hour;        // => 3
dt.minute;      // => 24
dt.second;      // => 30
dt.millisecond; // => 0
dt.microsecond; // => 3
dt.nanosecond;  // => 500
```
<!-- prettier-ignore-end -->

### datetime.**calendar** : object

The `calendar` read-only property gives the calendar that the `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond` properties are interpreted in.

### datetime.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][dt.dayOfWeek - 1]; // => THU
```

### datetime.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
// ISO ordinal date
console.log(dt.year, dt.dayOfYear); // => 1995 341
```

### datetime.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
// ISO week date
console.log(dt.year, dt.weekOfYear, dt.dayOfWeek); // => 1995 49 4
```

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
  const dt = Temporal.now.plainDateTime().with({ month });
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
dt = Temporal.now.plainDateTime();
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

Usage example:

```javascript
// Is this year a leap year?
dt = Temporal.now.plainDateTime();
dt.inLeapYear; // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
dt.with({ year: 2100 }).inLeapYear; // => false
```

## Methods

### datetime.**with**(_dateTimeLike_: object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `dateTimeLike` (object): an object with some or all of the properties of a `Temporal.PlainDateTime`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDateTime` object.

This method creates a new `Temporal.PlainDateTime` which is a copy of `datetime`, but any properties present on `dateTimeLike` override the ones already present on `datetime`.

Since `Temporal.PlainDateTime` objects are immutable, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `dateTimeLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `dateTimeLike`.
> See the `withCalendar` and `toZonedDateTime` methods instead.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.with({ year: 2015, second: 31 }); // => 2015-12-07T03:24:31.000003500
```

### datetime.**withCalendar**(_calendar_: object | string) : Temporal.PlainDateTime

**Parameters:**

- `calendar` (`Temporal.Calendar` or plain object or string): The calendar into which to project `datetime`.

**Returns:** a new `Temporal.PlainDateTime` object which is the date indicated by `datetime`, projected into `calendar`.

This method is the same as `datetime.with({ calendar })`, but may be more efficient.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500[c=japanese]');
dt.withCalendar('iso8601'); // => 1995-12-07T03:24:30.000003500
```

### datetime.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDateTime` object which is the date and time indicated by `datetime` plus `duration`.

This method adds `duration` to `datetime`, returning a point in time that is in the future relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some additions may be ambiguous, because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.add({ years: 20, months: 4, nanoseconds: 500 }); // => 2016-04-07T03:24:30.000004

dt = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt.add({ months: 1 }); // => 2019-02-28T15:30
dt.add({ months: 1 }, { overflow: 'reject' }); // => throws
```

### datetime.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainDateTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDateTime` object which is the time indicated by `datetime` minus `duration`.

This method subtracts `duration` from `datetime`, returning a point in time that is in the past relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Some subtractions may be ambiguous, because months have different lengths.
For example, subtracting one month from July 31 would result in June 31, which doesn't exist.
For these cases, the `overflow` option tells what to do:

- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.subtract({ years: 20, months: 4, nanoseconds: 500 }); // => 1975-08-07T03:24:30.000003

dt = Temporal.PlainDateTime.from('2019-03-31T15:30');
dt.subtract({ months: 1 }, { overflow: 'constrain' }); // => 2019-02-28T15:30
dt.subtract({ months: 1 }); // => throws
```

### datetime.**until**(_other_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDateTime` or value convertible to one): Another date/time until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the elapsed time after `datetime` and until `other`.

This method computes the difference between the two times represented by `datetime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `datetime` then the resulting duration will be negative.
The returned `Temporal.Duration`, when added to `datetime` with the same `options`, will yield `other`.

If `other` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.
A value of `'auto'` means `'days'`, unless `smallestUnit` is `'years'`, `'months'`, or `'weeks'`, in which case `largestUnit` is equal to `smallestUnit`.

By default, the largest unit in the result is days.
This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of days and larger are allowed.
Because rounding to an increment expressed in days or larger units requires a reference point, `datetime` is used as the starting point in that case.
The default is to do no rounding.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two datetimes in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `datetime.withCalendar()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt1.until(dt2);
  // =>    P8456DT12H5M29.999996500S
dt1.until(dt2, { largestUnit: 'years' });
  // => P23Y1M24DT12H5M29.999996500S
dt2.until(dt1, { largestUnit: 'years' });
  // => -P23Y1M24DT12H5M29.999996500S
dt1.until(dt2, { largestUnit: 'nanoseconds' });
  // =>       PT730641929.999996544S (precision lost)

// Rounding, for example if you don't care about sub-seconds
dt1.until(dt2, { smallestUnit: 'seconds' });
  // => P8456DT12H5M30S

// Months and years can be different lengths
[jan1, feb1, mar1] = [1, 2, 3].map((month) =>
  Temporal.PlainDateTime.from({ year: 2020, month, day: 1 }));
jan1.until(feb1);                            // => P31D
jan1.until(feb1, { largestUnit: 'months' }); // => P1M
feb1.until(mar1);                            // => P29D
feb1.until(mar1, { largestUnit: 'months' }); // => P1M
jan1.until(mar1);                            // => P121D
```
<!-- prettier-ignore-end -->

### datetime.**since**(_other_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainDateTime` or value convertible to one): Another date/time since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `'nanoseconds'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a `Temporal.Duration` representing the elapsed time before `datetime` and since `other`.

This method computes the difference between the two times represented by `datetime` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `datetime` then the resulting duration will be negative.

This method is similar to `Temporal.PlainDateTime.prototype.until()`, but reversed.
The returned `Temporal.Duration`, when subtracted from `datetime` using the same `options`, will yield `other`.
Using default options, `dt1.since(dt2)` yields the same result as `dt1.until(dt2).negated()`, but results may differ with options like `{ largestUnit: 'months' }`.

Usage example:

```javascript
dt1 = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.PlainDateTime.from('2019-01-31T15:30');
dt2.since(dt1); // => P8456DT12H5M29.999996500S
```

### datetime.**round**(_options_: object) : Temporal.PlainDateTime

**Parameters:**

- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `smallestUnit` (required string): The unit to round to.
    Valid values are `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'nearest'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'nearest'`.

**Returns:** a new `Temporal.PlainDateTime` object which is `datetime` rounded to `roundingIncrement` of `smallestUnit`.

Rounds `datetime` to the given unit and increment, and returns the result as a new `Temporal.PlainDateTime` object.

The `smallestUnit` option determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

The value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
(For example, if `smallestUnit` is `'minutes'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.)

If `smallestUnit` is `'day'`, then 1 is the only allowed value for `roundingIncrement`.

The `roundingMode` option controls how the rounding is performed.

- `ceil`: Always round up, towards the end of time.
- `floor`, `trunc`: Always round down, towards the beginning of time.
  (These two modes behave the same, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.)
- `nearest`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `ceil`.

Example usage:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');

// Round to a particular unit
dt.round({ smallestUnit: 'hour' }); // => 1995-12-07T03:00
// Round to an increment of a unit, e.g. half an hour:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 1995-12-07T03:30
// Round to the same increment but round down instead:
dt.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'floor' });
  // => 1995-12-07T03:00
```
<!-- prettier-ignore-end -->

### datetime.**equals**(_other_: Temporal.PlainDateTime | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainDateTime`): Another date/time to compare.

**Returns:** `true` if `datetime` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainDateTime` objects for equality.

This function exists because it's not possible to compare using `datetime == other` or `datetime === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates/times occur, then this function may be less typing and more efficient than `Temporal.PlainDateTime.compare`.

Note that this function will return `true` if the two datetimes are equal, even if they are expressed in different calendar systems.

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
    Valid values are `'auto'`, `'always'`, and `'never'`.
    The default is `'auto'`.
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'trunc'`, and `'nearest'`.
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
For more information on the calendar annotation, see [ISO string extensions](./iso-string-ext.md#calendar-systems).

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
dt.toString(); // => 1999-12-31T23:59:59.999999999

dt.toString({ smallestUnit: 'minute' });    // => 1999-12-31T23:59
dt.toString({ fractionalSecondDigits: 0 }); // => 1999-12-31T23:59:59
dt.toString({ fractionalSecondDigits: 4 }); // => 1999-12-31T23:59:59.9999
dt.toString({ fractionalSecondDigits: 8, roundingMode: 'nearest' });
// => 2000-01-01T00:00:00.00000000
```
<!-- prettier-ignore-end -->

### datetime.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `datetime`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `datetime`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

> **NOTE**: Unlike in [`Temporal.Instant.prototype.toLocaleString()`](./instant.html#toLocaleString), `options.timeZone` will have no effect, because `Temporal.PlainDateTime` carries no time zone information.
> It's not always possible to uniquely determine the localized time zone name using the `Temporal.PlainDateTime` instance and the `options.timeZone`.
> Therefore, to display a localized date and time including its time zone, convert the `Temporal.PlainDateTime` to a `Temporal.ZonedDateTime` or `Temporal.Instant` and then call the `toLocaleString()` method.

Example usage:

```js
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toLocaleString(); // => example output: 1995-12-07, 3:24:30 a.m.
dt.toLocaleString('de-DE'); // => example output: 7.12.1995, 03:24:30
dt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' }); // => Donnerstag
dt.toLocaleString('en-US-u-nu-fullwide-hc-h12'); // => １２/７/１９９５, ３:２４:３０ AM
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

- `timeZone` (optional string or object): The time zone in which to interpret `dateTime`, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `dateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** A `Temporal.ZonedDateTime` object representing the calendar date and wall-clock time from `dateTime` projected into `timeZone`.

This method is one way to convert a `Temporal.PlainDateTime` to a `Temporal.ZonedDateTime`.
It is identical to [`(Temporal.TimeZone.from(timeZone)).getZonedDateTimeFor(dateTime, disambiguation)`](./timezone.html#getZonedDateTimeFor).

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
This behavior avoids exceptions when converting non-existent `Temporal.PlainDateTime` values to `Temporal.ZonedDateTime`, but it also means that values during these periods will result in a different `Temporal.PlainDateTime` in "round-trip" conversions to `Temporal.ZonedDateTime` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.ZonedDateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

### datetime.**toPlainDate**() : Temporal.PlainDate

**Returns:** a `Temporal.PlainDate` object that is the same as the date portion of `datetime`.

### datetime.**toPlainYearMonth**() : Temporal.PlainYearMonth

**Returns:** a `Temporal.PlainYearMonth` object that is the same as the year and month of `datetime`.

### datetime.**toPlainMonthDay**() : Temporal.PlainMonthDay

**Returns:** a `Temporal.PlainMonthDay` object that is the same as the month and day of `datetime`.

### datetime.**toPlainTime**() : Temporal.PlainTime

**Returns:** a `Temporal.PlainTime` object that is the same as the wall-clock time portion of `datetime`.

The above four methods can be used to convert `Temporal.PlainDateTime` into a `Temporal.PlainDate`, `Temporal.PlainYearMonth`, `Temporal.PlainMonthDay`, or `Temporal.PlainTime` respectively.
The converted object carries a copy of all the relevant fields of `datetime` (for example, in `toPlainDate()`, the `year`, `month`, and `day` properties are copied.)

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
dt.toPlainDate(); // => 1995-12-07
dt.toPlainYearMonth(); // => 1995-12
dt.toPlainMonthDay(); // => 12-07
dt.toPlainTime(); // => 03:24:30.000003500
```

### datetime.**getFields**() : { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `datetime`.

This method can be used to convert a `Temporal.PlainDateTime` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values and may include extra properties such as `era`.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:

```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
Object.assign({}, dt).day; // => undefined
Object.assign({}, dt.getFields()).day; // => 7
```

### datetime.**getISOFields**(): { isoYear: number, isoMonth: number, isoDay: number, isoHour: number, isoMinute: number, isoSecond: number, isoMillisecond: number, isoMicrosecond: number, isoNanosecond: number, calendar: object }

**Returns:** a plain object with properties expressing `datetime` in the ISO 8601 calendar, as well as the value of `datetime.calendar`.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `datetime.getFields()` instead, or `datetime.withCalendar('iso8601').getFields()`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30.000003500');
f = dt.getISOFields();
f.isoDay; // => 7
// Fields correspond exactly to constructor arguments:
dt2 = new Temporal.PlainDateTime(f.isoYear, f.isoMonth, f.isoDay, f.isoHour, f.isoMinute,
  f.isoSecond, f.isoMillisecond, f.isoMicrosecond, f.isoNanosecond, f.calendar);
dt.equals(dt2); // => true

// Date in other calendar
dt = dt.withCalendar('hebrew');
dt.getFields().day; // => 14
dt.getISOFields().isoDay; // => 7

// Most likely what you need is this:
dt.withCalendar('iso8601').day; // => 7
```
<!-- prettier-ignore-end -->
