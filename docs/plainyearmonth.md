# Temporal.PlainYearMonth

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainYearMonth` represents a particular month on the calendar.
For example, it could be used to represent a particular instance of a monthly recurring event, like "the June 2019 meeting".

`Temporal.PlainYearMonth` refers to the whole of a specific month; if you need to refer to a calendar event on a certain day, use `Temporal.PlainDate` or even `Temporal.PlainDateTime`.
A `Temporal.PlainYearMonth` can be converted into a `Temporal.PlainDate` by combining it with a day of the month, using the `toPlainDate()` method.

## Constructor

### **new Temporal.PlainYearMonth**(_isoYear_: number, _isoMonth_: number, _calendar_: string = "iso8601", _referenceISODay_: number = 1) : Temporal.PlainYearMonth

**Parameters:**

- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `calendar` (optional string): A calendar to project the month into.
- `referenceISODay` (optional for ISO 8601 calendar; required for other calendars): A reference day, used for disambiguation when implementing calendar systems.
  For the ISO 8601 calendar, this parameter will default to 1 if omitted.
  For other calendars, this parameter must be the ISO-calendar day corresponding to the first day of the desired calendar year and month.

> The `calendar` and `referenceISODay` parameters should be avoided because `equals` or `compare` will consider `new Temporal.PlainYearMonth(2000, 3, 'iso8601', 14)` and `PlainYearMonth(2000, 3, 'iso8601', 1)` unequal even though they refer to the same year and month.
> When creating instances for non-ISO-8601 calendars use the `from()` method which will automatically set a valid and `equals`-compatible reference day.

> NOTE: To avoid infinite recursion, `referenceISODay` is accepted as-is without validating that the day provided is actually the first day of the month in the desired calendar system.
> This lack of validation means that `equals` or `compare` may return `false` for `Temporal.PlainYearMonth` instances where the year and month and day are identical, but the reference days don't match.
> For this reason, it is STRONGLY recommended that this constructor SHOULD NOT be used except when only using the ISO 8601 calendar.
> For other calendars, use `Temporal.PlainYearMonth.from()` which will automatically set the correct always set the `referenceISODay` to the first of the month when constructing the new object.

**Returns:** a new `Temporal.PlainYearMonth` object.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `referenceISODay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

The range of allowed values for this type is exactly enough that calling [`toPlainYearMonth()`](./plaindate.md#toPlainYearMonth) on any valid `Temporal.PlainDate` will succeed.
If `isoYear` and `isoMonth` are outside of this range, then this function will throw a `RangeError`.

`calendar` is a string containing the identifier of a built-in calendar, such as `'islamic'` or `'gregory'`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// The June 2019 meeting
ym = new Temporal.PlainYearMonth(2019, 6);
// => 2019-06
```

## Static methods

### Temporal.PlainYearMonth.**from**(_item_: Temporal.PlainYearMonth | object | string, _options_?: object) : Temporal.PlainYearMonth

**Parameters:**

- `item`: a value convertible to a `Temporal.PlainYearMonth`.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainYearMonth` object.

This static method creates a new `Temporal.PlainYearMonth` object from another value.
If the value is another `Temporal.PlainYearMonth` object, a new object representing the same month is returned.
If the value is any other object, it must have `year` (or `era` and `eraYear`), `month` (or `monthCode`) properties, and optionally a `calendar` property.
A `Temporal.PlainYearMonth` will be constructed from these properties.

If the `calendar` property is not present, it's assumed to be `'iso8601'` (identifying the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates)).
In this calendar, `era` is ignored.

If the value is not an object, it must be a string, which is expected to be in ISO 8601 format.
Any parts of the string other than the year and the month are optional and will be ignored.

If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.
A `RangeError` will also be thrown for strings that contain a `Z` in place of a numeric UTC offset, because interpreting these strings as a local date is usually a bug.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`).
- In `'reject'` mode, the presence of out-of-range values (after assuming extension of eras over arbitrary years to substitute `era` and `eraYear` with appropriate values for the `item`) will cause the function to throw a `RangeError`.

The `overflow` option is ignored if `item` is a string.

Additionally, if the result is earlier or later than the range of dates that `Temporal.PlainYearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `item.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

<!-- prettier-ignore-start -->
```javascript
ym = Temporal.PlainYearMonth.from('2019-06'); // => 2019-06
ym = Temporal.PlainYearMonth.from('2019-06-24'); // => 2019-06
ym = Temporal.PlainYearMonth.from('2019-06-24T15:43:27'); // => 2019-06
ym = Temporal.PlainYearMonth.from('2019-06-24T15:43:27+01:00[Europe/Brussels]');
  // => 2019-06
ym === Temporal.PlainYearMonth.from(ym); // => false

ym = Temporal.PlainYearMonth.from({ year: 2019, month: 6 }); // => 2019-06
ym = Temporal.PlainYearMonth.from(Temporal.PlainDate.from('2019-06-24'));
  // => 2019-06
  // (same as above; Temporal.PlainDate has year and month properties)

// Different overflow modes
ym = Temporal.PlainYearMonth.from({ year: 2001, month: 13 }, { overflow: 'constrain' });
  // => 2001-12
ym = Temporal.PlainYearMonth.from({ year: 2001, month: 13 }, { overflow: 'reject' });
  // => throws
```
<!-- prettier-ignore-end -->

### Temporal.PlainYearMonth.**compare**(_one_: Temporal.PlainYearMonth | object | string, _two_: Temporal.PlainYearMonth | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainYearMonth` or value convertible to one): First month to compare.
- `two` (`Temporal.PlainYearMonth` or value convertible to one): Second month to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainYearMonth` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`
- 0 if `one` and `two` start on the same date when projected into the ISO 8601 calendar
- 1 if `one` comes after `two`

If `one` and `two` are not `Temporal.PlainYearMonth` objects, then they will be converted to one as if they were passed to `Temporal.PlainYearMonth.from()`.

Comparison is based on the first day of the month in the real world, regardless of the `calendar`.
For example, this method returns `0` for months that start on the same day in the ISO 8601 calendar, even if their calendars describe that day with a different `year` and/or `month`.

This function can be used to sort arrays of `Temporal.PlainYearMonth` objects.
For example:

```javascript
one = Temporal.PlainYearMonth.from('2006-08');
two = Temporal.PlainYearMonth.from('2015-07');
three = Temporal.PlainYearMonth.from('1930-02');
sorted = [one, two, three].sort(Temporal.PlainYearMonth.compare);
sorted.join(' '); // => '1930-02 2006-08 2015-07'
```

## Properties

### yearMonth.**year** : number

### yearMonth.**month** : number

### yearMonth.**monthCode** : string

The above read-only properties allow accessing the year or month individually.

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

Either `month` or `monthCode` can be used in `from` or `with` to refer to the month.
Similarly, in calendars that use eras, an `era`/`eraYear` pair can be used in place of `year` when calling `from` or `with`.

Usage examples:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
ym.year; // => 2019
ym.month; // => 6
ym.monthCode; // => 'M06'

ym = Temporal.PlainYearMonth.from('2019-02-23[u-ca=hebrew]');
ym.year; // => 5779
ym.month; // => 6
ym.monthCode; // => 'M05L'
```

### yearMonth.**calendarId** : object

The `calendarId` read-only property gives the identifier of the calendar that the `year`, `month`, and `monthCode` properties are interpreted in.

### yearMonth.**era** : string | undefined

### yearMonth.**eraYear** : number | undefined

In calendars that use eras, the `era` and `eraYear` read-only properties can be used together to resolve an era-relative year.
Both properties are `undefined` when using the ISO 8601 calendar.
As inputs to `from` or `with`, `era` and `eraYear` can be used instead of `year`.
Unlike `year`, `eraYear` may decrease as time proceeds because some eras (like the BCE era in the Gregorian calendar) count years backwards.

```javascript
ym = Temporal.PlainYearMonth.from('-000015-01-01[u-ca=gregory]');
ym.era;
// => 'bce'
ym.eraYear;
// => 16
ym.year;
// => -15
```

### yearMonth.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month.
This is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:

```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
  const ym = Temporal.PlainYearMonth.from({ year: 2020, calendar: 'iso8601', month });
  monthsByDays[ym.daysInMonth] = (monthsByDays[ym.daysInMonth] || []).concat(ym);
}

const strings = monthsByDays[30].map((ym) => ym.toLocaleString('en', { month: 'long', calendar: 'iso8601' }));
// Shuffle to improve poem as determined empirically
strings.unshift(strings.pop());
const format = new Intl.ListFormat('en');
const poem = `Thirty days hath ${format.format(strings)}`;

console.log(poem);
```

### yearMonth.**daysInYear** : number

The `daysInYear` read-only property gives the number of days in the year that the month falls in.
This is 365 or 366, depending on whether the year is a leap year.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ym = Temporal.PlainYearMonth.from({ year: 2019, month: 6, calendar: 'iso8601' });
percent = ym.daysInMonth / ym.daysInYear;
`${ym.toLocaleString('en', {month: 'long', year: 'numeric', calendar: 'iso8601' })} was ${percent.toLocaleString('en', {style: 'percent'})} of the year!`
  // => 'June 2019 was 8% of the year!'
```
<!-- prettier-ignore-end -->

### yearMonth.**monthsInYear**: number

The `monthsInYear` read-only property gives the number of months in the year that the month falls in.
For the ISO 8601 calendar, this is always 12, but in other calendar systems it may differ from year to year.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('1900-01');
ym.monthsInYear; // => 12
```

### yearMonth.**inLeapYear** : boolean

The `inLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

NOTE: A "leap year" is a year that contains more days than other years (for solar or lunar calendars) or more months than other years (for lunisolar calendars like Hebrew or Chinese). In the ISO 8601 calendar, a year is a leap year (and has exactly one extra day, February 29) if it is evenly divisible by 4 but not 100 or if it is evenly divisible by 400.

Usage example:

```javascript
// Was June 2019 in a leap year?
ym = Temporal.PlainYearMonth.from('2019-06');
ym.inLeapYear; // => false
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
ym.with({ year: 2100 }).inLeapYear; // => false
```

## Methods

### yearMonth.**with**(_yearMonthLike_: object, _options_?: object) : Temporal.PlainYearMonth

**Parameters:**

- `yearMonthLike` (object): an object with some or all of the properties of a `Temporal.PlainYearMonth`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainYearMonth` object.

This method creates a new `Temporal.PlainYearMonth` which is a copy of `yearMonth`, but any properties present on `yearMonthLike` override the ones already present on `yearMonth`.

Since `Temporal.PlainYearMonth` objects each represent a fixed year and month, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.PlainYearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

> **NOTE**: The allowed values for the `yearMonthLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `yearMonthLike`.
> It is not possible to convert a `Temporal.PlainYearMonth` to another calendar system without knowing the day of the month.
> If you need to do this, use `yearMonth.toPlainDate({ day }).withCalendar(calendar).toPlainYearMonth()`.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
// Get December of that year
ym.with({ month: 12 }); // => 2019-12
```

### yearMonth.**add**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainYearMonth

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainYearMonth` object which is the month indicated by `yearMonth` plus `duration`.

This method adds `duration` to `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument is an object with properties denoting a duration, such as `{ months: 5 }`, or a string such as `P5M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

If `duration` has any units smaller than `months`, they will be treated as if they are being added to the first moment of the month given by `yearMonth`.
Effectively, this means that adding things like `{ days: 1 }` will be ignored.

If the result is earlier or later than the range of dates that `Temporal.PlainYearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

The `overflow` option has no effect in the default ISO 8601 calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.PlainYearMonth` does not distinguish days.
However, `overflow` may have an effect in other calendars where years can be different numbers of months.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
ym.add({ years: 20, months: 4 }); // => 2039-10
```

### yearMonth.**subtract**(_duration_: Temporal.Duration | object | string, _options_?: object) : Temporal.PlainYearMonth

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainYearMonth` object which is the month indicated by `yearMonth` minus `duration`.

This method subtracts `duration` from `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument is an object with properties denoting a duration, such as `{ months: 5 }`, or a string such as `P5M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

If `duration` has any units smaller than `months`, they will be treated as if they are being subtracted from the last moment of the month given by `yearMonth`.
Effectively, this means that subtracting things like `{ days: 1 }` will be ignored.

If the result is earlier or later than the range of dates that `Temporal.PlainYearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `overflow`.

The `overflow` option has no effect in the default ISO 8601 calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.PlainYearMonth` does not distinguish days.
However, `overflow` may have an effect in other calendars where years can be different numbers of months.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
ym.subtract({ years: 20, months: 4 }); // => 1999-02
```

### yearMonth.**until**(_other_: Temporal.PlainYearMonth | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainYearMonth` or value convertible to one): Another month until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'` and `'month'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'` and `'month'`.
    The default is `'month'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time after `yearMonth` and until `other`.

This method computes the difference between the two months represented by `yearMonth` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `yearMonth` then the resulting duration will be negative.
If using the default `options`, adding the returned `Temporal.Duration` to `yearMonth` will yield `other`.

If `other` is not a `Temporal.PlainYearMonth` object, then it will be converted to one as if it were passed to `Temporal.PlainYearMonth.from()`.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of one year and two months will become 14 months when `largestUnit` is `"months"`, for example.
However, a difference of one month will still be one month even if `largestUnit` is `"years"`.
A value of `'auto'` means `'year'`.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method, but increments of months and larger are allowed.
Because rounding to calendar units requires a reference point, the first day of `yearMonth` is used as the starting point.
The default is to do no rounding.

Unlike other Temporal types, weeks and lower are not allowed for either `largestUnit` or `smallestUnit`, because the data model of `Temporal.PlainYearMonth` doesn't have that accuracy.

Computing the difference between two months in different calendar systems is not supported.

Usage example:

<!-- prettier-ignore-start -->
```javascript
ym = Temporal.PlainYearMonth.from('2006-08');
other = Temporal.PlainYearMonth.from('2019-06');
ym.until(other);                            // => P12Y10M
ym.until(other, { largestUnit: 'month' }); // => P154M
other.until(ym, { largestUnit: 'month' }); // => -P154M

// If you really need to calculate the difference between two YearMonths
// in days, you can eliminate the ambiguity by explicitly choosing the
// day of the month (and if applicable, the time of that day) from which
// you want to reckon the difference. For example, using the first of
// the month to calculate a number of days:
ym.toPlainDate({ day: 1 }).until(other.toPlainDate({ day: 1 }), { largestUnit: 'day' }); // => P4687D
```
<!-- prettier-ignore-end -->

### yearMonth.**since**(_other_: Temporal.PlainYearMonth | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainYearMonth` or value convertible to one): Another month since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'` and `'month'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'` and `'month'`.
    The default is `'month'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time before `yearMonth` and since `other`.

This method computes the difference between the two months represented by `yearMonth` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `yearMonth` then the resulting duration will be negative.

This method is similar to `Temporal.PlainYearMonth.prototype.until()`, but reversed.
If using the default `options`, subtracting the returned `Temporal.Duration` from `yearMonth` will yield `other`, and `ym1.since(ym2)` will yield the same result as `ym1.until(ym2).negated()`.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
other = Temporal.PlainYearMonth.from('2006-08');
ym.since(other); // => P12Y10M
```

### yearMonth.**equals**(_other_: Temporal.PlainYearMonth | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainYearMonth` or value convertible to one): Another month to compare.

**Returns:** `true` if `yearMonth` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainYearMonth` objects for equality.

This function exists because it's not possible to compare using `yearMonth == other` or `yearMonth === other`, due to ambiguity in the primitive representation and between Temporal types.

If `other` is not a `Temporal.PlainYearMonth` object, then it will be converted to one as if it were passed to `Temporal.PlainYearMonth.from()`.

Note that this function will return `false` if the two objects have different `calendar` properties, even if the actual years and months are equal.

If you don't need to know the order in which the two months occur, then this function may be less typing and more efficient than `Temporal.PlainYearMonth.compare`.

Example usage:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
other = Temporal.PlainYearMonth.from('2006-08');
ym.equals(other); // => false
ym.equals(ym); // => true
```

### yearMonth.**toString**() : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `calendarName` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, `'never'`, and `'critical'`.
    The default is `'auto'`.

**Returns:** a string in the ISO 8601 date format representing `yearMonth`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `yearMonth`.
The string can be passed to `Temporal.PlainYearMonth.from()` to create a new `Temporal.PlainYearMonth` object.

Normally, a calendar annotation is shown when `yearMonth`'s calendar is not the ISO 8601 calendar.
By setting the `calendarName` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
Normally not necessary, a value of `'critical'` is equivalent to `'always'` but the annotation will contain an additional `!` for certain interoperation use cases.
For more information on the calendar annotation, see [the `Temporal` string formats documentation](./strings.md#calendar-systems).

Example usage:

```js
ym = Temporal.PlainYearMonth.from('2019-06');
ym.toString(); // => '2019-06'
```

### yearMonth.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `yearMonth`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `yearMonth`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

The calendar in the output locale (given by `new Intl.DateTimeFormat(locales, options).resolvedOptions().calendar`) must match `monthDay.calendar`, or this method will throw an exception.
This is because it's not possible to convert a Temporal.PlainMonthDay from one calendar to another without more information.
In order to ensure that the output always matches `monthDay`'s internal calendar, you must either explicitly construct `monthDay` with the locale's calendar, or explicitly specify the calendar in the `options` parameter:

```js
yearMonth.toLocaleString(locales, { calendar: yearMonth.calendar });

// OR

yearMonth = Temporal.PlainYearMonth.from({ /* ... */, calendar: localeCalendar });
yearMonth.toLocaleString();
```

Example usage:

```js
({ calendar } = new Intl.DateTimeFormat().resolvedOptions());
ym = Temporal.PlainYearMonth.from({ year: 2019, month: 6, calendar });
ym.toLocaleString(); // example output: '6/2019'
// Same as above, but explicitly specifying the calendar:
ym.toLocaleString(undefined, { calendar });

ym.toLocaleString('de-DE', { calendar }); // example output: '6.2019'
ym.toLocaleString('de-DE', { month: 'long', year: 'numeric', calendar }); // => 'Juni 2019'
ym.toLocaleString(`en-US-u-nu-fullwide-ca-${calendar}`); // => '６/２０１９'
```

### yearMonth.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `yearMonth`.

This method is the same as `yearMonth.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainYearMonth` object from a string, is `Temporal.PlainYearMonth.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainYearMonth` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainYearMonth`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const boardMeeting = {
  id: 4,
  agenda: ['Roll call', 'Budget'],
  meetingYearMonth: Temporal.PlainYearMonth.from({ year: 2019, month: 3 })
};
const str = JSON.stringify(boardMeeting, null, 2);
console.log(str);
// =>
// {
//   "id": 4,
//   "agenda": [
//     "Roll call",
//     "Budget"
//   ],
//   "meetingYearMonth": "2019-03"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('YearMonth')) return Temporal.PlainYearMonth.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### yearMonth.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainYearMonth` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainYearMonth.compare()` for this, or `yearMonth.equals()` for equality.

### yearMonth.**toPlainDate**(_day_: object) : Temporal.PlainDate

**Parameters:**

- `day` (object): An object with a `'day'` property, which must be a valid day of `yearMonth`.

**Returns:** a `Temporal.PlainDate` object that represents the calendar date of `day` in `yearMonth`.

This method can be used to convert `Temporal.PlainYearMonth` into a `Temporal.PlainDate`, by supplying a calendar day to use.
The converted object carries a copy of all the relevant fields of `yearMonth`.

Usage example:

```javascript
ym = Temporal.PlainYearMonth.from('2019-06');
ym.toPlainDate({ day: 24 }); // => 2019-06-24
```
