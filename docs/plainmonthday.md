# Temporal.PlainMonthDay

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainMonthDay` represents a particular day on the calendar, but without a year.
For example, it could be used to represent a yearly recurring event, like "Bastille Day is on the 14th of July."

If you need to refer to a certain instance of a calendar event, in a particular year, use `Temporal.PlainDate` or even `Temporal.PlainDateTime`.
A `Temporal.PlainMonthDay` can be converted into a `Temporal.PlainDate` by combining it with a year, using the `toPlainDate()` method.

## Constructor

### **new Temporal.PlainMonthDay**(_isoMonth_: number, _isoDay_: number, _calendar_: string = "iso8601", _referenceISOYear_: number = 1972) : Temporal.PlainMonthDay

**Parameters:**

- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `isoDay` (number): A day of the month, ranging between 1 and 31 inclusive.
- `calendar` (optional string): A calendar to project the date into.
- `referenceISOYear` (optional for ISO 8601 calendar; required for other calendars):
  A reference year in the ISO 8601 calendar for disambiguation when implementing calendar systems.
  The default for the ISO 8601 calendar is the first leap year after the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time).
  This value is required for other calendar systems. If you don't know what to put here, use the `from` method instead.

**Returns:** a new `Temporal.PlainMonthDay` object.

> The `calendar` and `referenceISOYear` parameters should be avoided because `equals` or `compare` will consider `new Temporal.PlainMonthDay(3, 14, 'iso8601', 1977)` and `new Temporal.PlainMonthDay(3, 14, 'iso8601', 2000)` unequal even though they refer to the same month and day.
> When creating instances for non-ISO-8601 calendars use the `from()` method which will automatically set a valid and `equals`-compatible reference year.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `referenceISOYear`, `isoMonth`, and `isoDay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

`calendar` is a string containing the identifier of a built-in calendar, such as `'islamic'` or `'gregory'`.

The `referenceISOYear` ensures that month/day combinations like February 29 (a leap day in the ISO 8601 calendar) or 15 Adar I (in a leap month in the Hebrew calendar) can be used for `Temporal.PlainMonthDay`, even though those dates don't occur every calendar year.
`referenceISOYear` corresponds to a calendar year where this month and day actually exist.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:

```javascript
// Pi day
md = new Temporal.PlainMonthDay(3, 14); // => 03-14
// Leap day
md = new Temporal.PlainMonthDay(2, 29); // => 02-29
```

## Static methods

### Temporal.PlainMonthDay.**from**(_item_: Temporal.PlainMonthDay | object | string, _options_?: object) : Temporal.PlainMonthDay

**Parameters:**

- `item`: a value convertible to a `Temporal.PlainMonthDay`.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainMonthDay` object.

This static method creates a new `Temporal.PlainMonthDay` object from another value.
If the value is a `Temporal.PlainMonthDay`, `Temporal.PlainDate`, `Temporal.PlainDateTime`, or `Temporal.ZonedDateTime` object, a new object representing the object's same month and day is returned.
If the value is any other object, it:

- Must have a `day` property
- Must have either a string `monthCode` or `month` property.
  If `month` is used and `calendar` is provided, then `year` must be provided as well because `month` is ambiguous in some calendars without knowing the year.
- May have a `calendar` property. If omitted, the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates) will be used by default.

If the value is not an object, it must be a string, which is expected to be in ISO 8601 format.
For the ISO 8601 calendar, only the month and day will be parsed from the string.
For other calendars, the year and calendar are also parsed in addition to month and day.
Any other parts of the string are optional and will be ignored.

If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `overflow`.
A `RangeError` will also be thrown for strings that contain a `Z` in place of a numeric UTC offset, because interpreting these strings as a local date is usually a bug.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value, with "nearest" defined by the calendar.
- In `'reject'` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.
  If `day`, `month` and `year` are provided, that calendar date must exist in the provided calendar or a `RangeError` will be thrown.

The `overflow` option is ignored if `item` is a string.

> **NOTE**: The allowed values for the `item.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:

```javascript
md = Temporal.PlainMonthDay.from('08-24'); // => 08-24
md = Temporal.PlainMonthDay.from('0824'); // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24'); // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24T15:43:27'); // => 08-24
md = Temporal.PlainMonthDay.from('2006-08-24T15:43:27+01:00[Europe/Brussels]');
// => 08-24
md === Temporal.PlainMonthDay.from(md); // => false

md = Temporal.PlainMonthDay.from({ monthCode: 'M08', day: 24 }); // => 08-24
md = Temporal.PlainMonthDay.from(Temporal.PlainDate.from('2006-08-24'));
// => 08-24
// (same as above; Temporal.PlainDate has month and day properties)

// Different overflow modes
md = Temporal.PlainMonthDay.from({ month: 13, day: 1, year: 2000 }, { overflow: 'constrain' });
// => 12-01
md = Temporal.PlainMonthDay.from({ month: 1, day: 32, year: 2000 }, { overflow: 'constrain' });
// => 01-31
md = Temporal.PlainMonthDay.from({ month: 13, day: 1, year: 2000 }, { overflow: 'reject' });
// => throws
md = Temporal.PlainMonthDay.from({ month: 1, day: 32, year: 2000 }, { overflow: 'reject' });
// => throws
md = Temporal.PlainMonthDay.from({ month: 2, day: 29, year: 2001 }, { overflow: 'reject' });
// => throws (this year is not a leap year in the ISO 8601 calendar)

// non-ISO calendars
md = Temporal.PlainMonthDay.from({ monthCode: 'M05L', day: 15, calendar: 'hebrew' });
// => 1970-02-21[u-ca=hebrew]
md = Temporal.PlainMonthDay.from({ month: 6, day: 15, year: 5779, calendar: 'hebrew' });
// => 1970-02-21[u-ca=hebrew]
/* WRONG */ md = Temporal.PlainMonthDay.from({ month: 6, day: 15, calendar: 'hebrew' });
// => throws (either year or monthCode is required)
md = Temporal.PlainMonthDay.from('2019-02-20[u-ca=hebrew]');
md.monthCode; // => 'M05L'
md.day; // => 15
md.month; // undefined
// (month property is not present in this type; use monthCode instead)
```

## Properties

### monthDay.**monthCode** : string

### monthDay.**day** : number

The above read-only properties allow accessing each component of the date individually.

- `monthCode` is a calendar-specific string that identifies the month in a year-independent way.
  For common (non-leap) months, `monthCode` should be ` ` `M${month}` ` `, where `month` is zero padded up to two digits.
  For uncommon (leap) months in lunisolar calendars like Hebrew or Chinese, the month code is the previous month's code with an "L" suffix appended.
  Examples: `'M02'` => February; `'M08L'` => repeated 8th month in the Chinese calendar; `'M05L'` => Adar I in the Hebrew calendar.
- `day` is a positive integer representing the day of the month.

Note that this type has no `month` property, because `month` is ambiguous for some calendars without knowing the year.
Instead, the `monthCode` property is used which is year-independent in all calendars.

Usage examples:

```javascript
md = Temporal.PlainMonthDay.from('08-24');
md.monthCode; // => 'M08'
md.day; // => 24
md.month; // => undefined
// (no `month` property; use `monthCode` instead)

md = Temporal.PlainMonthDay.from('2019-02-20[u-ca=hebrew]');
md.monthCode; // => 'M05L'
md.day; // => 15
md.month; // => undefined
// (no `month` property; use `monthCode` instead)
```

### monthDay.**calendarId** : object

The `calendarId` read-only property gives the calendar that the `monthCode` and `day` properties are interpreted in.

## Methods

### monthDay.**with**(_monthDayLike_: object, _options_?: object) : Temporal.PlainMonthDay

**Parameters:**

- `monthDayLike` (object): an object with some or all of the properties that are accepted by `Temporal.PlainMonthDay.from`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

There are two ways to change the month: providing `monthCode` or `month`.
If `month` is used and `calendar` is provided, then `year` must be provided as well because `month` is ambiguous in some calendars without knowing the year.
If `monthCode` is provided in addition to `month` and/or `year`, then the properties must not conflict or a `RangeError` will be thrown.

**Returns:** a new `Temporal.PlainMonthDay` object.

This method creates a new `Temporal.PlainMonthDay` which is a copy of `monthDay`, but any properties present on `monthDayLike` override the ones already present on `monthDay`.

The `overflow` option tells what should happen when out-of-range values are given or when the result would be an invalid month-day combination, such as "June 31":

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value, so June 31 would become June 30.
- In `'reject'` mode, the presence of out-of-range values will cause the constructor to throw a `RangeError`.

> **NOTE:** For the purpose of this method, February is treated as having 29 days, so that it remains possible to construct a `Temporal.PlainMonthDay` for February 29.

> **NOTE**: The allowed values for the `monthDayLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Since `Temporal.PlainMonthDay` objects each represent a fixed month and day, use this method instead of modifying one.

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `monthDayLike`.
> It is not possible to convert a `Temporal.PlainMonthDay` to another calendar system without knowing the year.
> If you need to do this, use `monthDay.toPlainDate({ year }).withCalendar(calendar).toPlainMonthDay()`.

Usage example:

```javascript
md = Temporal.PlainMonthDay.from('11-15');
// What's the last day of that month?
md.with({ day: 31 }); // => 11-30
Temporal.PlainMonthDay.from('02-01').with({ day: 31 }); // => 02-29
```

### monthDay.**equals**(_other_: Temporal.PlainMonthDay | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainMonthDay` or value convertible to one): Another month-day to compare.

**Returns:** `true` if `monthDay` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainMonthDay` objects for equality.

This function exists because it's not possible to compare using `monthDay == other` or `monthDay === other`, due to ambiguity in the primitive representation and between Temporal types.

Note that two `Temporal.PlainMonthDay`s expressed in different calendar systems can never be equal, because it's impossible to tell whether they fall on the same day without knowing the year.

If `other` is not a `Temporal.PlainMonthDay` object, then it will be converted to one as if it were passed to `Temporal.PlainMonthDay.from()`.

Example usage:

```javascript
md1 = Temporal.PlainMonthDay.from('02-28');
md2 = Temporal.PlainMonthDay.from('02-29');
md1.equals(md2); // => false
md1.equals('02-29'); // => false
md1.equals({ monthCode: 'M02', day: 29 }); // => false
md2.equals(md2); // => true
md2.equals('02-29'); // => true
md2.equals({ monthCode: 'M02', day: 29 }); // => true
```

### monthDay.**toString**() : string

**Parameters:**

- `options` (optional object): An object with properties influencing the formatting.
  The following options are recognized:
  - `calendarName` (string): Whether to show the calendar annotation in the return value.
    Valid values are `'auto'`, `'always'`, `'never'`, and `'critical'`.
    The default is `'auto'`.

**Returns:** a string in the ISO 8601 date format representing `monthDay`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `monthDay`.
The string can be passed to `Temporal.PlainMonthDay.from()` to create a new `Temporal.PlainMonthDay` object.

Normally, a calendar annotation is shown when `monthDay`'s calendar is not the ISO 8601 calendar.
By setting the `calendarName` option to `'always'` or `'never'` this can be overridden to always or never show the annotation, respectively.
Normally not necessary, a value of `'critical'` is equivalent to `'always'` but the annotation will contain an additional `!` for certain interoperation use cases.
For more information on the calendar annotation, see [the `Temporal` string formats documentation](./strings.md#calendar-systems).

Example usage:

```js
md = Temporal.PlainMonthDay.from('08-24');
md.toString(); // => '08-24'
```

### monthDay.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `monthDay`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `monthDay`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

The calendar in the output locale (given by `new Intl.DateTimeFormat(locales, options).resolvedOptions().calendar`) must match `monthDay.calendar`, or this method will throw an exception.
This is because it's not possible to convert a Temporal.PlainMonthDay from one calendar to another without more information.
In order to ensure that the output always matches `monthDay`'s internal calendar, you must either explicitly construct `monthDay` with the locale's calendar, or explicitly specify the calendar in the `options` parameter:

```js
monthDay.toLocaleString(locales, { calendar: monthDay.calendar });

// OR

monthDay = Temporal.PlainMonthDay.from({ /* ... */, calendar: localeCalendar });
monthDay.toLocaleString();
```

Example usage:

```js
let calendar;
({ calendar } = new Intl.DateTimeFormat().resolvedOptions());
md = Temporal.PlainMonthDay.from({ monthCode: 'M08', day: 24, calendar });
md.toLocaleString(); // example output: '8/24'
// Same as above, but explicitly specifying the calendar:
md.toLocaleString(undefined, { calendar }); // example output: '8/24'

md.toLocaleString('de-DE', { calendar }); // => '24.8.'
md.toLocaleString('de-DE', { month: 'long', day: 'numeric', calendar }); // => '24. August'
md.toLocaleString(`en-US-u-nu-fullwide-ca-${calendar}`); // => '８/２４'
```

### monthDay.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `monthDay`.

This method is the same as `monthDay.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainMonthDay` object from a string, is `Temporal.PlainMonthDay.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainMonthDay` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainMonthDay`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const holiday = {
  name: 'Canada Day',
  holidayMonthDay: Temporal.PlainMonthDay.from({ monthCode: 'M07', day: 1 })
};
const str = JSON.stringify(holiday, null, 2);
console.log(str);
// =>
// {
//   "name": "Canada Day",
//   "holidayMonthDay": "07-01"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('MonthDay')) return Temporal.PlainMonthDay.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### monthDay.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainMonthDay` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Instead, use `monthDay.equals()` to check for equality.

### monthDay.**toPlainDate**(_year_: object) : Temporal.PlainDate

**Parameters:**

- `year` (object): An object with a `'year'` property, which must have a day corresponding to `monthDay`.

**Returns:** a `Temporal.PlainDate` object that represents the calendar date of `monthDay` in `year`.

This method can be used to convert `Temporal.PlainMonthDay` into a `Temporal.PlainDate`, by supplying a year to use.
The converted object carries a copy of all the relevant fields of `monthDay`.

Usage example:

```javascript
md = Temporal.PlainMonthDay.from('08-24');
md.toPlainDate({ year: 2017 }); // => 2017-08-24

md = Temporal.PlainMonthDay.from('02-29');
md.toPlainDate({ year: 2020 }); // => 2020-02-29
md.toPlainDate({ year: 2017 }); // => 2017-02-28
```

In calendars where more information than just the year is needed to convert a `Temporal.PlainMonthDay` to a `Temporal.PlainDate`, you can pass the necessary properties in the _year_ object.

Example:

```javascript
md = Temporal.PlainMonthDay.from({
  calendar: 'japanese',
  monthCode: 'M01',
  day: 1
});

date = md.toPlainDate({ era: 'reiwa', eraYear: 2 }); // => 2020-01-01[u-ca=japanese]
```
