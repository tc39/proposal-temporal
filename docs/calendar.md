# Temporal.Calendar

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Calendar` is a representation of a calendar system.
It includes information about how many days are in each year, how many months are in each year, how many days are in each month, and how to do arithmetic in that calendar system.

Much of the world uses the [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar), which was invented in 1582 C.E.
On the modern Internet, the most often used calendar system is the calendar standardized by ISO 8601, which is the same as the Gregorian calendar with the addition of week-numbering rules.
In general it is extended backwards ("proleptically") to cover the period of history before its invention, which is an optional modification allowed by the ISO 8601 standard.

However, the ISO 8601 calendar is not the only calendar in common use in the world.
Some places use another calendar system as the main calendar, or have a separate calendar system as a commonly-used civil or religious calendar.

### When to use `Temporal.Calendar`

It is best practice to specify a calendar system when performing calendar-sensitive operations, which are those involving arithmetic or other calculation in months or years.

For example, to add a month to a date in the Hebrew calendar:

```javascript
date.withCalendar('hebrew').add({ months: 1 });
```

Temporal types' `toLocaleString()` methods use the user's preferred calendar, without needing to call `withCalendar()`.
To perform arithmetic consistently with the `toLocaleString()` calendar system:

```javascript
const calendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
date.withCalendar(calendar).add({ months: 1 });
```

### Invariants Across Calendars

The following "invariants" (statements that are always true) hold for all built-in calendars, and should also hold for any properly-authored custom calendar that supports years, months, and days units:

- `year` is always an integer that increases as time goes forward
- `month` and `day` are always positive integers that increase as time goes forward, except they reset at the boundary of a year or month, respectively
- `date.month === 1` during the first month of any year
- `date.month === date.monthsInYear` during the last month of any year
- `month` is always continuous (no gaps)
- Any date can be serialized to an object using only four properties: `{ year, month, day, calendar }`

### Writing Cross-Calendar Code

Here are best practices for writing code that will work regardless of the calendar used:

- Validate or coerce the calendar of all external input. If your code receives a Temporal object from an external source, you should check that its calendar is what you expect, and if you are not prepared to handle other calendars, convert it to the ISO calendar using `withCalendar('iso8601')`. Otherwise, you may end up with unexpected behavior in your app or introduce security or performance issues by introducing an unexpected calendar.
- Use `compare` methods (e.g. `Temporal.PlainDate.compare(date1, '2000-01-01')`) instead of manually comparing individual properties (e.g. `date.year > 2000`) whose meaning may vary across calendars.
- Never compare field values in different calendars. A `month` or `year` in one calendar is unrelated to the same property values in another calendar. If dates in different calendars must be compared, use `compare`.
- When comparing dates for equality that might be in different calendars, convert them both to the same calendar using `withCalendar`. The same ISO date in different calendars will return `false` from the `equals` method and will return a non-zero value from `compare` because the calendars are not equal.
- When looping through all months in a year, use `monthsInYear` as the upper bound instead of assuming that every year has 12 months.
- Don't assume that `date.month===12` is the last month of the year. Instead, use `date.month===date.monthsInYear`.
- Use `until` or `since` to count years, months, or days between dates. Manually calculating differences (e.g. `Math.floor(months/12)`) will fail for some calendars.
- Use `daysInMonth` instead of assuming that each month has the same number of days in every year.
- Days in a month are not always continuous. There can be gaps due to political changes in calendars and/or time zones. For this reason, instead of looping through a month from 1 to `date.daysInMonth`, it's better to start a loop with the first day of the month (`.with({day: 1})`) and `add` one day at a time until the `month` property returns a different value.
- Use `daysInYear` instead of assuming that every year has 365 days (366 in a leap year).
- Don't assume that `inLeapYear===true` implies that the year is one day longer than a regular year. Some calendars add leap months, making the year 29 or 30 days longer than a normal year!
- Use `toLocaleString` to format dates to users. DO NOT localize manually with code like `${month}/${day}/${year}`.
- Don't assume that `month` has the same name in every year. Some calendars like Hebrew or Chinese have leap months that cause months to vary across years.
- Use the correct property to refer to months. If you care about the order of the month in a particular year (e..g. when looping through all the months in a year) use `month`. If you care about the month regardless of what year it is (e.g. storing a birthday), use the `monthCode` string property.
- When using the `Temporal.PlainMonthDay` type (e.g. for birthdays or holidays), use its `monthCode` property only. The `month` property is not present on this type because some calendars' month indexes vary from year to year.
- When calling `Temporal.PlainMonthDay.prototype.toPlainDate(year)`, be prepared for the resulting date to have a different day of the month and/or a different month, because leap days and leap months are not present in every year.
- Use `toLocaleString` to fetch month names instead instead of caching an array of names. Example: `date.toLocaleString('en-US', { calendar: date.calendar, month: 'long' })`. If you absolutely must cache month names, a string key like `${date.calendar.id}|{date.monthCode}|{date.inLeapYear}` will work for all built-in calendars.
- Don't assume that `era` or `eraYear` properties are always present. They are not present in some calendars.
- `era` and `eraYear` should always be used as a pair. Don't use one property without also using the other.
- Don't combine `month` and `monthCode` in the same property bag. Pick one month representation and use it consistently.
- Don't combine `year` and `era`/`eraYear` in the same property bag. Pick one year representation and use it consistently.
- Read the documentation of your calendar to determine the meaning of `monthCode` and `era`.
- Don't show `monthCode` and `era` values in a UI. Instead, use `toLocaleString` to convert these values into localized strings.
- Don't assume that the year before `{ eraYear: 1 }` is the last year of the previous era. Some calendars have a "year zero", and the oldest era in era-using calendars typically allows negative `eraYear` values.

### Custom calendars

For specialized applications where you need to do calculations in a calendar system that is not supported by Intl, you can implement a custom calendar.
There are two ways to do this.

The recommended way is to create a class inheriting from `Temporal.Calendar`.
You must use one of the built-in calendars as the "base calendar".
In the class's constructor, call `super()` with the identifier of the base calendar.
The class must override `toString()` to return its own identifier.
Overriding all the other members is optional.
If you don't override the optional members, then they will behave as in the base calendar.

The other, more difficult, way to create a custom calendar is to create a plain object implementing the `Temporal.Calendar` protocol, without subclassing.
The object must implement all of the `Temporal.Calendar` properties and methods except for `id`, `fields()`, `mergeFields()`, and `toJSON()`.
Any object with the required methods will return the correct output from any Temporal property or method.
However, most other code will assume that custom calendars act like built-in `Temporal.Calendar` objects.
To interoperate with libraries or other code that you didn't write, then you should implement the `id` property and the `fields()`, `mergeFields()`, and `toJSON()` methods as well.
Your object must not have a `calendar` property, so that it can be distinguished in `Temporal.Calendar.from()` from other Temporal objects that have a calendar.

The identifier of a custom calendar must consist of one or more components of between 3 and 8 ASCII alphanumeric characters each, separated by dashes, as described in [Unicode Technical Standard 35](https://unicode.org/reports/tr35/tr35.html#Unicode_locale_identifier).

Custom calendars are responsible for interpreting and validating all inputs, including options.
Calendars should (and built-in calendars will) throw a TypeError if a required option is missing or has the wrong type, but throw a RangeError if it's present but has an invalid value.

Calendars are also responsible for assigning default values.
For example, if the `overflow` option is undefined, it will be interpreted by built-in calendars as `'constrain'`.
Custom calendars should maintain this behavior unless there's a good reason not to.
Calendars can also accept additional non-default values for existing options or can accept new options that built-in calendars don't.
When adding new options, calendar authors should use a unique prefix, e.g. the name of the calendar, to avoid potential conflicts with future options which may be used by Temporal.

## Constructor

### **new Temporal.Calendar**(_calendarIdentifier_: string) : Temporal.Calendar

**Parameters:**

- `calendarIdentifier` (string): An identifier for the calendar.

**Returns:** a new `Temporal.Calendar` object.

For a list of calendar identifiers, see the documentation for [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters).
If `calendarIdentifier` is not a built-in calendar, then a `RangeError` is thrown.

Use this constructor directly if you have a string that is known to be a correct built-in calendar identifier.
If you have an ISO 8601 date-time string with a `[u-ca=identifier]` annotation, then `Temporal.Calendar.from()` is more convenient than parsing the identifier out of the string, and also the only way to parse strings annotated with a non-built-in calendar.

Example usage:

```javascript
cal = new Temporal.Calendar('iso8601');
cal = new Temporal.Calendar('gregory');
/* WRONG */ cal = new Temporal.Calendar('discordian'); // => throws, not a built-in calendar
```

## Static methods

### Temporal.Calendar.**from**(_thing_: any) : Temporal.Calendar

**Parameters:**

- `thing`: A calendar object, a Temporal object that carries a calendar, or a value from which to create a `Temporal.Calendar`.

**Returns:** a calendar object.

This static method creates a new calendar from another value.
If the value is another `Temporal.Calendar` object, or object implementing the calendar protocol, the same object is returned.
If the value is another Temporal object that carries a calendar or an object with a `calendar` property, such as a `Temporal.ZonedDateTime`, the object's calendar is returned.

Any other value is converted to a string, which is expected to be either:

- a string that is accepted by `new Temporal.Calendar()`; or
- a string in the ISO 8601 format.

Note that the ISO 8601 string can be extended with a `[u-ca=identifier]` annotation in square brackets appended to it.
Without such an annotation, the calendar is taken to be `iso8601`.

This function is often more convenient to use than `new Temporal.Calendar()` because it handles a wider range of input.

Usage examples:

```javascript
// Calendar names
cal = Temporal.Calendar.from('iso8601');
cal = Temporal.Calendar.from('gregory');

// ISO 8601 string with or without calendar annotation
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086');
cal = Temporal.Calendar.from('2020-01-13T16:31:00.065858086-08:00[America/Vancouver][u-ca=iso8601]');

// Existing calendar object
cal2 = Temporal.Calendar.from(cal);

// Custom calendar that is a plain object (this calendar does not do much)
/* WRONG */ cal = Temporal.Calendar.from('discordian'); // => throws, not a built-in calendar
/* WRONG */ cal = Temporal.Calendar.from('[u-ca-iso8601]'); // => throws, lone annotation not a valid ISO 8601 string
```

## Properties

### calendar.**id** : string

The `id` property gives an unambiguous identifier for the calendar.
Effectively, this is whatever `calendarIdentifier` was passed as a parameter to the constructor.

When subclassing `Temporal.Calendar`, this property doesn't need to be overridden because the default implementation gives the result of calling `toString()`.

## Methods

### calendar.**era**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : string | undefined

### calendar.**eraYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number | undefined

### calendar.**year**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number

### calendar.**month**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string) : number

### calendar.**monthCode**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | Temporal.PlainMonthDay | object | string) : string

### calendar.**day**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainMonthDay | object | string) : number

### calendar.**dayOfWeek**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**dayOfYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**weekOfYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**daysInWeek**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | object | string): number

### calendar.**daysInMonth**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**daysInYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**monthsInYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): number

### calendar.**inLeapYear**(_date_: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.PlainYearMonth | object | string): boolean

The above methods are all similar.
They provide a way to query properties of a particular date in the calendar's date reckoning.

**Parameters:**

- `date` (`Temporal.PlainDate`, or value convertible to one): A date.

**Returns:** some piece of data (year, month, day, etc., depending on the method) associated with `date`, in `calendar`'s calendar system.

If `date` is not one of the appropriate Temporal objects, then it will be converted to a `Temporal.PlainDate` as if it were passed to `Temporal.PlainDate.from()`.

None of the above methods need to be called directly except in specialized code.
They are called indirectly when reading the various properties of `Temporal.ZonedDateTime`, `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainMonthDay`, or `Temporal.PlainYearMonth`.

For example:

```javascript
const date = Temporal.PlainDate.from('2019-02-06').withCalendar('hebrew');
date.year; // => 5779
date.calendar.year(date); // same result, but calling the method directly
date.monthCode; // => 'M05L'
date.calendar.monthCode(date); // same result, but calling the method directly
date.daysInYear; // => 385
date.calendar.daysInYear(date); // same result, but calling the method directly
```

### calendar.**dateFromFields**(_fields_: object, _options_: object) : Temporal.PlainDate

### calendar.**yearMonthFromFields**(_fields_: object, _options_: object) : Temporal.PlainYearMonth

### calendar.**monthDayFromFields**(_fields_: object, _options_: object) : Temporal.PlainMonthDay

The above three methods are similar.
They provide a way to construct other Temporal objects from values in the calendar's date or time reckoning.

**Parameters:**

- `fields` (object): An object with properties similar to what is passed to `Temporal.PlainDate.from()`, `Temporal.PlainYearMonth.from()`, or `Temporal.PlainMonthDay.from()`, respectively.
- `options`: (object): An object with properties representing options for constructing the Temporal object.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in `fields`.
    Allowed values are `constrain`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate`, `Temporal.PlainYearMonth`, or `Temporal.PlainMonthDay` object, respectively.

None of the above methods need to be called directly except in specialized code.
They are called indirectly when using `Temporal.PlainDate.from()`, `Temporal.PlainDateTime.from()`, `Temporal.PlainYearMonth.from()`, and `Temporal.PlainMonthDay.from()`.

A custom implementation of these methods would convert the calendar-space arguments to the ISO calendar, and return an object created using `new Temporal.PlainDate(...isoArgs)`, with `PlainYearMonth` and `PlainMonthDay` substituted for `PlainDate` as appropriate.

For example:

<!-- prettier-ignore-start -->
```javascript
date = Temporal.PlainDate.from({ year: 5779, monthCode: 'M05L', day: 18, calendar: 'hebrew' });
date.year; // => 5779
date.month; // => 6
date.monthCode; // => 'M05L'
date.day; // => 18
date.toString(); // => '2019-02-23[u-ca=hebrew]'
date.toLocaleString('en-US', { calendar: 'hebrew' }); // => '18 Adar I 5779'

// same result, but calling the method directly and using month index instead of month code:
date = Temporal.Calendar.from('hebrew').dateFromFields(
  { year: 5779, month: 6, day: 18 },
  { overflow: 'constrain' }
);
```
<!-- prettier-ignore-end -->

### calendar.**dateAdd**(_date_: Temporal.PlainDate | object | string, _duration_: Temporal.Duration | object | string, _options_: object) : Temporal.PlainDate

This method provides a way to do time arithmetic in the calendar's date reckoning.

**Parameters:**

- `date` (`Temporal.PlainDate`, or value convertible to one): A date.
- `duration` (`Temporal.Duration`, or value convertible to one): A duration to add to `date`.
  For subtraction, add a negative duration.
- `options` (object): An object with properties representing options for performing the addition or subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values in the result of the addition or subtraction.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.PlainDate` object.

If `date` is not a `Temporal.PlainDate` object, or `duration` not a `Temporal.Duration` object, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()` or `Temporal.Duration.from()`, respectively.

This method does not need to be called directly except in specialized code.
It is called indirectly when using `add()` and `subtract()` of `Temporal.PlainDateTime`, `Temporal.PlainDate`, and `Temporal.PlainYearMonth`.

A custom implementation of this method would perform the calendar-specific addition, convert the result to the ISO calendar, and return an object created using `new Temporal.PlainDate(...isoArgs)`.

For example:

```javascript
date = Temporal.PlainDate.from('2020-05-29')
  .withCalendar('islamic')
  .add(Temporal.Duration.from({ months: 1 }), { overflow: 'reject' });
date.year; // => 1441
date.month; // => 11
date.day; // => 7
date.toString(); // => '2020-06-28[u-ca=islamic]'

// same result, but calling the method directly:
date = Temporal.Calendar.from('islamic').dateAdd(
  Temporal.PlainDate.from('2020-05-29'),
  Temporal.Duration.from({ months: 1 }),
  { overflow: 'reject' }
);
date.year; // => 1441
date.month; // => 11
date.day; // => 7
date.toString(); // => '2020-06-28[u-ca=islamic]'
```

### calendar.**dateUntil**(_one_: Temporal.PlainDate | object | string, _two_: Temporal.PlainDate | object | string, _options_: object) : Temporal.Duration

**Parameters:**

- `one` (`Temporal.PlainDate`, or value convertible to one): A date.
- `two` (`Temporal.PlainDate`, or value convertible to one): Another date.
- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (optional string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, and `'day'`.
    The default is `'auto'`.

**Returns:** a `Temporal.Duration` representing the time elapsed after `one` and until `two`.

If either of `one` or `two` are not `Temporal.PlainDate` objects, then they will be converted to one as if they were passed to `Temporal.PlainDate.from()`.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `until()` and `since()` methods of `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainYearMonth`, and `Temporal.ZonedDateTime`.

If `one` is later than `two`, then the resulting duration should be negative.

The default `largestUnit` value of `'auto'` is the same as `'day'`.

> **NOTE:** Unlike `Temporal.Calendar.dateAdd()`, the `options` object that this method receives is not always the same object passed to the respective `until()` or `since()` method.
> Depending on the type, a copy may be made of the object.

For example:

```javascript
d1 = Temporal.PlainDate.from('2020-07-29').withCalendar('chinese');
d2 = Temporal.PlainDate.from('2020-08-29').withCalendar('chinese');
d1.until(d2, { largestUnit: 'month' }); // => P1M2D

// same result, but calling the method directly:
Temporal.Calendar.from('chinese').dateUntil(
  Temporal.PlainDate.from('2020-07-29'),
  Temporal.PlainDate.from('2020-08-29'),
  { largestUnit: 'month' }
); // => P1M2D
```

### calendar.**fields**(_fields_: Iterable&lt;string>) : Iterable&lt;string>

**Parameters:**

- `fields` (array of strings, or other iterable yielding strings): A list of field names.

**Returns:** a new list of field names.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `from()` static methods and `with()` methods of `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainMonthDay`, `Temporal.PlainYearMonth`, and `Temporal.ZonedDateTime`, and a number of other methods.

Custom calendars should override this method if they accept fields in `from()` or `with()` other than the standard set of built-in calendar fields: `year`, `month`, `monthCode`, and `day`.
The input array contains the field names that are necessary for a particular operation (for example, `'monthCode'` and `'day'` for `Temporal.PlainMonthDay.prototype.with()`).
The method should make a copy of the array and add additional fields as needed.

When subclassing `Temporal.Calendar`, this method doesn't need to be overridden, unless your calendar requires extra fields, because the default implementation returns a copy of `fields`.

Usage example:

<!-- prettier-ignore-start -->
```js
// In the ISO calendar, this method just makes a copy of the input array
Temporal.Calendar.from('iso8601').fields(['monthCode', 'day']);
// => [ 'monthCode', 'day' ]
```
<!-- prettier-ignore-end -->

### calendar.**mergeFields**(_fields_: object, _additionalFields_: object) : object

**Parameters:**

- `fields` (object): A plain object with properties representing calendar units.
- `additionalFields` (object): Another plain object with properties representing calendar units.

**Returns:** a new object with properties from both `fields` and `additionalFields`.

This method does not need to be called directly except in specialized code.
It is called indirectly when using the `with()` methods of `Temporal.PlainDateTime`, `Temporal.PlainDate`, `Temporal.PlainMonthDay`, `Temporal.PlainYearMonth`, and `Temporal.ZonedDateTime`.

Custom calendars should override this method if they allow a calendar unit to be specified in more than one way.
(For example, the Gregorian calendar allows years to be specified either by a `year` property or a combination of `era` and `eraYear`.)
The overridden implementation should return an object with some or all of the properties from the original `fields` object and `additionalFields` copied onto it.

When subclassing `Temporal.Calendar`, this method doesn't need to be overridden, unless your calendar adds more ways to specify a unit other than the built-in properties `monthCode`, `era`, and `eraYear`.
The default implementation copies all properties from `additionalFields` onto `fields`, taking into account that months may be specified either by `month` or `monthCode` properties, and any other special cases required by built-in calendars.

Usage example:

<!-- prettier-ignore-start -->
```js
// In built-in calendars, this method copies properties, taking `month`
// and `monthCode` into account
Temporal.Calendar.from('iso8601').mergeFields(
  { year: 2006, month: 7, day: 31 },
  { monthCode: 'M08' }
);
// => { year: 2006, monthCode: 'M08', day: 31 }
```
<!-- prettier-ignore-end -->

### calendar.**toString**() : string

**Returns:** The string given by `calendar.id`.

This method overrides `Object.prototype.toString()` and provides the calendar's `id` property as a human-readable description.

Example usage:

```javascript
Temporal.PlainDate.from('2020-05-29[u-ca=gregory]').calendar.toString(); // => 'gregory'
```

### calendar.**toJSON**() : string

**Returns:** The string given by `calendar.id`.

This method is the same as `calendar.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.Calendar` object from a string, is `Temporal.Calendar.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.Calendar` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.Calendar`s.
In that case you can build a custom "reviver" function for your use case.

When subclassing `Temporal.Calendar`, this method doesn't need to be overridden because the default implementation returns the result of calling `calendar.toString()`.

Example usage:

```js
const user = {
  id: 775,
  username: 'robotcat',
  password: 'hunter2', // Note: Don't really store passwords like that
  userCalendar: Temporal.Calendar.from('gregory')
};
const str = JSON.stringify(user, null, 2);
console.log(str);
// =>
// {
//   "id": 775,
//   "username": "robotcat",
//   "password": "hunter2",
//   "userCalendar": "gregory"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Calendar')) return Temporal.Calendar.from(value);
  return value;
}
JSON.parse(str, reviver);
```
