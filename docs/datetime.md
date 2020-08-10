# Temporal.DateTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.DateTime` represents a calendar date and wall-clock time, with a precision in nanoseconds, and without any time zone.
Of the `Temporal` classes carrying human-readable time information, it is the most general and complete one.
`Temporal.Date`, `Temporal.Time`, `Temporal.YearMonth`, and `Temporal.MonthDay` all carry less information and should be used when complete information is not required.

"Calendar date" and "wall-clock time" refer to the concept of time as expressed in everyday usage.
`Temporal.DateTime` does not represent an absolute, unique point in time; that is what `Temporal.Absolute` is for.

One example of when it would be appropriate to use `Temporal.DateTime` and not `Temporal.Absolute` is when integrating with wearable devices.
FitBit, for example, always records sleep data in the user's wall-clock time, wherever they are in the world.
Otherwise they would be recorded as sleeping at strange hours when travelling, even if their sleep rhythm was on a healthy schedule for the time zone they were in.

A `Temporal.DateTime` can be converted to a `Temporal.Absolute` using a `Temporal.TimeZone`.
A `Temporal.DateTime` can also be converted into any of the other `Temporal` objects that carry less information, such as `Temporal.Date` for the date or `Temporal.Time` for the time.

## Constructor

### **new Temporal.DateTime**(_isoYear_: number, _isoMonth_: number, _isoDay_: number, _hour_: number = 0, _minute_: number = 0, _second_: number = 0, _millisecond_: number = 0, _microsecond_: number = 0, _nanosecond_: number = 0, _calendar_?: object) : Temporal.DateTime

**Parameters:**
- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `hour` (optional number): An hour of the day, ranging between 0 and 23 inclusive.
- `minute` (optional number): A minute, ranging between 0 and 59 inclusive.
- `second` (optional number): A second, ranging between 0 and 59 inclusive.
- `millisecond` (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
- `microsecond` (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
- `nanosecond` (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the date into.

**Returns:** a new `Temporal.DateTime` object.

Use this constructor if you have the correct parameters for the date already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.DateTime.from()`, which accepts more kinds of input, allows inputting dates in different calendar reckonings, and allows disambiguation behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter, and the time parameters must represent a valid time of day.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> This value will cause the constructor will throw, so if you have to interoperate with times that may contain leap seconds, use `Temporal.DateTime.from()` instead.

The range of allowed values for this type is exactly enough that calling [`toDateTime()`](./absolute.html#toDateTime) on any valid `Temporal.Absolute` with any valid `Temporal.TimeZone` will succeed.
If the parameters passed in to this constructor form a date outside of this range, then this function will throw a `RangeError`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:
```javascript
// Leet hour on pi day in 2020
datetime = new Temporal.DateTime(2020, 3, 14, 13, 37)  // => 2020-03-14T13:37
```

## Static methods

### Temporal.DateTime.**from**(_thing_: any, _options_?: object) : Temporal.DateTime

**Parameters:**
- `thing`: The value representing the desired date and time.
- `options` (optional object): An object with properties representing options for constructing the date and time.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.DateTime` object.

This static method creates a new `Temporal.DateTime` object from another value.
If the value is another `Temporal.DateTime` object, a new object representing the same date and time is returned.
If the value is any other object, a `Temporal.DateTime` will be constructed from the values of any `year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `microsecond`, `nanosecond`, and `calendar` properties that are present.
At least the `year`, `month`, and `day` properties must be present.
If `calendar` is missing, it will be assumed to be `Temporal.Calendar.from('iso8601')`.
Any other missing ones will be assumed to be 0.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.
Any time zone part is optional and will be ignored.
If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `disambiguation`.

The `disambiguation` option works as follows:
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

Additionally, if the result is earlier or later than the range of dates that `Temporal.DateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

> **NOTE**: Although Temporal does not deal with leap seconds, dates coming from other software may have a `second` value of 60.
> In the default `constrain` disambiguation mode and when parsing an ISO 8601 string, this will be converted to 59.
> In `reject` mode, this function will throw, so if you have to interoperate with times that may contain leap seconds, don't use `reject`.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:
```javascript
dt = Temporal.DateTime.from('1995-12-07T03:24:30');
dt = Temporal.DateTime.from('1995-12-07T03:24:30Z');  // => 1995-12-07T03:24:30
dt = Temporal.DateTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => same as above; time zone is ignored
dt === Temporal.DateTime.from(dt)  // => true

dt = Temporal.DateTime.from({
    year: 1995,
    month: 12,
    day: 7,
    hour: 3,
    minute: 24,
    second: 30,
    millisecond: 0,
    microsecond: 3,
    nanosecond: 500
});  // => 1995-12-07T03:24:30.000003500
dt = Temporal.DateTime.from({year: 1995, month: 12, day: 7});  // => 1995-12-07T00:00
dt = Temporal.DateTime.from(Temporal.Date.from('1995-12-07T03:24:30'));
  // => same as above; Temporal.Date has year, month, and day properties

calendar = Temporal.Calendar.from('hebrew');
dt = Temporal.DateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar });
  // => 1995-12-07T03:24:30[c=hebrew]
dt = Temporal.DateTime.from({ year: 5756, month: 3, day: 14, hour: 3, minute: 24, second: 30, calendar: 'hebrew' });
  // => same as above

// Different disambiguation modes
dt = Temporal.DateTime.from({ year: 2001, month: 13, day: 1 }, { disambiguation: 'constrain' })
  // => 2001-12-01T00:00
dt = Temporal.DateTime.from({ year: 2001, month: -1, day: 1 }, { disambiguation: 'constrain' })
  // => 2001-01-01T00:00
dt = Temporal.DateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { disambiguation: 'constrain' })
  // => 2001-01-01T23:00
dt = Temporal.DateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { disambiguation: 'constrain' })
  // => 2001-01-01T00:59
dt = Temporal.DateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { disambiguation: 'constrain' })
  // => 2001-01-01T01:00
dt = Temporal.DateTime.from({ year: 2001, month: 13, day: 1 }, { disambiguation: 'reject' })
  // throws
dt = Temporal.DateTime.from({ year: 2001, month: -1, day: 1 }, { disambiguation: 'reject' })
  // throws
dt = Temporal.DateTime.from({ year: 2001, month: 1, day: 1, hour: 25 }, { disambiguation: 'reject' })
  // throws
dt = Temporal.DateTime.from({ year: 2001, month: 1, day: 1, minute: 60 }, { disambiguation: 'reject' })
  // => throws
```

### Temporal.DateTime.**compare**(_one_: Temporal.DateTime, _two_: Temporal.DateTime) : number

**Parameters:**
- `one` (`Temporal.DateTime`): First date/time to compare.
- `two` (`Temporal.DateTime`): Second date/time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.DateTime` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.
- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

This function can be used to sort arrays of `Temporal.DateTime` objects.
For example:
```javascript
one = Temporal.DateTime.from('1995-12-07T03:24');
two = Temporal.DateTime.from('1995-12-07T01:24');
three = Temporal.DateTime.from('2015-12-07T01:24');
sorted = [one, two, three].sort(Temporal.DateTime.compare);
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
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.year         // => 1995
dt.month        // => 12
dt.day          // => 7
dt.hour         // => 3
dt.minute       // => 24
dt.second       // => 30
dt.millisecond  // => 0
dt.microsecond  // => 3
dt.nanosecond   // => 500
```

### datetime.**calendar** : object

The `calendar` read-only property gives the calendar that the `year`, `month`, and `day` properties are interpreted in.

### datetime.**era** : unknown

The `era` read-only property is `undefined` when using the ISO 8601 calendar.
It's used for calendar systems that specify an era in addition to the year.

### datetime.**dayOfWeek** : number

The `dayOfWeek` read-only property gives the weekday number that the date falls on.
For the ISO 8601 calendar, the weekday number is defined as in the ISO 8601 standard: a value between 1 and 7, inclusive, with Monday being 1, and Sunday 7.
For an overview, see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Week_dates).

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][dt.dayOfWeek - 1]  // => THU
```

### datetime.**dayOfYear** : number

The `dayOfYear` read-only property gives the ordinal day of the year that the date falls on.
For the ISO 8601 calendar, this is a value between 1 and 365, or 366 in a leap year.

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
// ISO ordinal date
console.log(dt.year, dt.dayOfYear);  // => 1995 341
```

### datetime.**weekOfYear** : number

The `weekOfYear` read-only property gives the ISO week number of the date.
For the ISO 8601 calendar, this is normally a value between 1 and 52, but in a few cases it can be 53 as well.
ISO week 1 is the week containing the first Thursday of the year.
For more information on ISO week numbers, see for example the Wikipedia article on [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date).

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
// ISO week date
console.log(dt.year, dt.weekOfYear, dt.dayOfWeek);  // => 1995 49 4
```

### datetime.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month that the date falls in.
For the ISO 8601 calendar, this is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:
```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
    const dt = Temporal.now.dateTime().with({month});
    monthsByDays[dt.daysInMonth] = (monthsByDays[dt.daysInMonth] || []).concat(dt);
}

const strings = monthsByDays[30].map(dt => dt.toLocaleString('en', {month: 'long'}));
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
dt = Temporal.now.dateTime();
percent = dt.dayOfYear / dt.daysInYear;
`The year is ${percent.toLocaleString('en', {style: 'percent'})} over!`
// example output: "The year is 10% over!"
```

### datetime.**isLeapYear** : boolean

The `isLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

Usage example:
```javascript
// Is this year a leap year?
dt = Temporal.now.dateTime();
dt.isLeapYear  // example output: true
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
dt.with({year: 2100}).isLeapYear  // => false
```

## Methods

### datetime.**with**(_dateTimeLike_: object, _options_?: object) : Temporal.DateTime

**Parameters:**
- `dateTimeLike` (object): an object with some or all of the properties of a `Temporal.DateTime`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.DateTime` object.

This method creates a new `Temporal.DateTime` which is a copy of `datetime`, but any properties present on `dateTimeLike` override the ones already present on `datetime`.

Since `Temporal.DateTime` objects are immutable, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.DateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

> **NOTE**: The allowed values for the `dateTimeLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: If a `calendar` property is provided on `dateTimeLike`, the new calendar is applied first, before any of the other properties.
> If you are passing in an object with _only_ a `calendar` property, it is recommended to use the `withCalendar` method instead.

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.with({year: 2015, second: 31})  // => 2015-12-07T03:24:31.000003500

// Temporal.Time, Temporal.Date, Temporal.YearMonth and
// Temporal.MonthDay also have some of the properties of
// Temporal.DateTime:
midnight = Temporal.Time.from({ hour: 0 });
dt.with(midnight)  // => 1995-12-07T00:00
// Note: not the same as dt.with({ hour: 0 })!
date = Temporal.Date.from('2015-03-31');
dt.with(date)  // => 2015-03-31T03:24:31.000003500
yearMonth = Temporal.YearMonth.from('2018-04');
date.with(yearMonth)  // => 2018-04-07T03:24:31.000003500
monthDay = Temporal.MonthDay.from('02-29')
date.with(monthDay)  // => 1995-02-28T03:24:30.000003500
```

### datetime.**withCalendar**(_calendar_: object | string) : Temporal.DateTime

**Parameters:**
- `calendar` (`Temporal.Calendar` or plain object or string): The calendar into which to project `datetime`.

**Returns:** a new `Temporal.DateTime` object which is the date indicated by `datetime`, projected into `calendar`.

This method is the same as `datetime.with({ calendar })`, but may be more efficient.

Usage example:
```javascript
dt = Temporal.DateTime.from('1995-12-07T03:24:30.000003500[c=japanese]');
dt.withCalendar('iso8601')  // => 1995-12-07T03:24:30.000003500
```

### datetime.**plus**(_duration_: object, _options_?: object) : Temporal.DateTime

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `disambiguation` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.DateTime` object which is the date and time indicated by `datetime` plus `duration`.

This method adds `duration` to `datetime`, returning a point in time that is in the future relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

Some additions may be ambiguous, because months have different lengths.
For example, adding one month to August 31 would result in September 31, which doesn't exist.
For these cases, the `disambiguation` option tells what to do:
- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.DateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.plus({years: 20, months: 4, nanoseconds: 500})  // => 2016-04-07T03:24:30.000004

dt = Temporal.DateTime.from('2019-01-31T15:30')
dt.plus({ months: 1 })  // => 2019-02-28T15:30
dt.plus({ months: 1 }, { disambiguation: 'reject' })  // => throws
```

### datetime.**minus**(_duration_: object, _options_?: object) : Temporal.DateTime

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `disambiguation` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.DateTime` object which is the time indicated by `datetime` minus `duration`.

This method subtracts `duration` from `datetime`, returning a point in time that is in the past relative to `datetime`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

Some subtractions may be ambiguous, because months have different lengths.
For example, subtracting one month from July 31 would result in June 31, which doesn't exist.
For these cases, the `disambiguation` option tells what to do:
- In `constrain` mode (the default), out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, an addition that would result in an out-of-range value fails, and a `RangeError` is thrown.

Additionally, if the result is earlier or later than the range of dates that `Temporal.DateTime` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.minus({years: 20, months: 4, nanoseconds: 500})  // => 1975-08-07T03:24:30.000003

dt = Temporal.DateTime.from('2019-03-31T15:30')
dt.minus({ months: 1 }, { disambiguation: 'constrain' })  // => 2019-02-28T15:30
dt.minus({ months: 1 })  // => throws
```

### datetime.**difference**(_other_: Temporal.DateTime, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (`Temporal.DateTime`): Another date/time with which to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'weeks'`, `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `days`.

**Returns:** a `Temporal.Duration` representing the difference between `datetime` and `other`.

This method computes the difference between the two times represented by `datetime` and `other`, and returns it as a `Temporal.Duration` object.
If `other` is later than `datetime` then the resulting duration will be negative.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.

By default, the largest unit in the result is days.
This is because months and years can be different lengths depending on which month is meant and whether the year is a leap year.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Computing the difference between two dates in different calendar systems is not supported.
If you need to do this, choose the calendar in which the computation takes place by converting one of the dates with `datetime.withCalendar()`.

Usage example:
```javascript
dt1 = Temporal.DateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.DateTime.from('2019-01-31T15:30');
dt2.difference(dt1);
  // =>    P8456DT12H5M29.999996500S
dt2.difference(dt1, { largestUnit: 'years' });
  // => P23Y1M24DT12H5M29.999996500S
dt1.difference(dt2, { largestUnit: 'years' });  
  // => -P23Y1M24DT12H5M29.999996500S
dt2.difference(dt1, { largestUnit: 'nanoseconds' });
  // =>       PT730641929.999996544S (precision lost)

// Months and years can be different lengths
[jan1, feb1, mar1] = [1, 2, 3].map(month => 
  Temporal.DateTime.from({ year: 2020, month, day: 1 }));
feb1.difference(jan1);                                   // => P31D
feb1.difference(jan1, { largestUnit: 'months' });        // => P1M
mar1.difference(feb1);                                   // => P29D
mar1.difference(feb1, { largestUnit: 'months' });        // => P1M
may1.difference(jan1);                                   // => P121D
```

### datetime.**equals**(_other_: Temporal.DateTime) : boolean

**Parameters:**
- `other` (`Temporal.DateTime`): Another date/time to compare.

**Returns:** `true` if `datetime` and `other` are equal, or `false` if not.

Compares two `Temporal.DateTime` objects for equality.

This function exists because it's not possible to compare using `datetime == other` or `datetime === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two dates/times occur, then this function may be less typing and more efficient than `Temporal.DateTime.compare`.

Note that this function will return `true` if the two date/times are equal, even if they are expressed in different calendar systems.

Example usage:
```javascript
dt1 = Temporal.DateTime.from('1995-12-07T03:24:30.000003500');
dt2 = Temporal.DateTime.from('2019-01-31T15:30');
dt1.equals(dt2)  // => false
dt1.equals(dt1)  // => true
```

### datetime.**toString**() : string

**Returns:** a string in the ISO 8601 date format representing `datetime`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `datetime`.
The string can be passed to `Temporal.DateTime.from()` to create a new `Temporal.DateTime` object.

Example usage:
```js
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.toString();  // => 1995-12-07T03:24:30.000003500
```

### datetime.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `datetime`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `datetime`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

> **NOTE**: Unlike in [`Temporal.Absolute.prototype.toLocaleString()`](./absolute.html#toLocaleString), `options.timeZone` will have no effect, because `Temporal.DateTime` carries no time zone information and is just a wall-clock time.

Example usage:
```js
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.toLocaleString();  // => example output: 1995-12-07, 3:24:30 a.m.
dt.toLocaleString('de-DE');  // => example output: 7.12.1995, 03:24:30
dt.toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' });  // => Donnerstag, 7.12.1995, 03:24:30
dt.toLocaleString('en-US-u-nu-fullwide-hc-h12');  // => １２/７/１９９５, ３:２４:３０ AM
```

### datetime.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `datetime`.

This method is the same as `datetime.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.DateTime` object from a string, is `Temporal.DateTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.DateTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.DateTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const event = {
  id: 311,
  name: 'FictionalConf 2018',
  openingDateTime: Temporal.DateTime.from('2018-07-06T10:00'),
  closingDateTime: Temporal.DateTime.from('2018-07-08T18:15'),
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
  if (key.endsWith('DateTime'))
    return Temporal.DateTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### datetime.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.DateTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.DateTime.compare()` for this, or `datetime.equals()` for equality.

### datetime.**toAbsolute**(_timeZone_ : object | string, _options_?: object) : Temporal.Absolute

**Parameters:**
- `timeZone` (optional string or object): The time zone in which to interpret `dateTime`, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `dateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** A `Temporal.Absolute` object indicating the absolute time in `timeZone` at the time of the calendar date and wall-clock time from `dateTime`.

This method is one way to convert a `Temporal.DateTime` to a `Temporal.Absolute`.
It is identical to [`(Temporal.TimeZone.from(timeZone || 'UTC')).getAbsoluteFor(dateTime, disambiguation)`](./timezone.html#getAbsoluteFor).

In the case of ambiguity, the `disambiguation` option controls what absolute time to return:
- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting non-existent `Temporal.DateTime` values to `Temporal.Absolute`, but it also means that values during these periods will result in a different `Temporal.DateTime` in "round-trip" conversions to `Temporal.Absolute` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.Absolute` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

### datetime.**toDate**() : Temporal.Date

**Returns:** a `Temporal.Date` object that is the same as the date portion of `datetime`.

### datetime.**toYearMonth**() : Temporal.YearMonth

**Returns:** a `Temporal.YearMonth` object that is the same as the year and month of `datetime`.

### datetime.**toMonthDay**() : Temporal.MonthDay

**Returns:** a `Temporal.MonthDay` object that is the same as the month and day of `datetime`.

### datetime.**toTime**() : Temporal.Time

**Returns:** a `Temporal.Time` object that is the same as the wall-clock time portion of `datetime`.

The above four methods can be used to convert `Temporal.DateTime` into a `Temporal.Date`, `Temporal.YearMonth`, `Temporal.MonthDay`, or `Temporal.Time` respectively.
The converted object carries a copy of all the relevant fields of `datetime` (for example, in `toDate()`, the `year`, `month`, and `day` properties are copied.)

Usage example:
```javascript
dt = new Temporal.DateTime(1995, 12, 7, 3, 24, 30, 0, 3, 500);
dt.toDate()  // => 1995-12-07
dt.toYearMonth()  // => 1995-12
dt.toMonthDay()  // => 12-07
dt.toTime()  // => 03:24:30.000003500
```

### datetime.**getFields**() : { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `datetime`.

This method can be used to convert a `Temporal.DateTime` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:
```javascript
dt = Temporal.DateTime.from('1995-12-07T03:24:30.000003500');
Object.assign({}, dt).day  // => undefined
Object.assign({}, dt.getFields()).day  // => 7
```

### datetime.**getISOCalendarFields**(): { year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number }

**Returns:** a plain object with properties expressing `datetime` in the ISO 8601 calendar.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `datetime.getFields()` instead, or `datetime.withCalendar('iso8601').getFields()`.

Usage example:
```javascript
dt = Temporal.Date.from('1995-12-07T03:24:30.000003500');
date.getISOCalendarFields().day  // => 7

// Date in other calendar
dt = dt.withCalendar('hebrew');
dt.getFields().day  // => 14
dt.getISOCalendarFields().day  // => 7

// Most likely what you need is this:
dt.withCalendar('iso8601').day  // => 7
```
