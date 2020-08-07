# Temporal.YearMonth

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.YearMonth` represents a particular month on the calendar.
For example, it could be used to represent a particular instance of a monthly recurring event, like "the June 2019 meeting".

`Temporal.YearMonth` refers to the whole of a specific month; if you need to refer to a calendar event on a certain day, use `Temporal.Date` or even `Temporal.DateTime`.
A `Temporal.YearMonth` can be converted into a `Temporal.Date` by combining it with a day of the month, using the `toDateOnDay()` method.

## Constructor

### **new Temporal.YearMonth**(_isoYear_: number, _isoMonth_: number, _calendar_?: object, _refISODay_: number = 1) : Temporal.YearMonth

**Parameters:**
- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `calendar` (optional `Temporal.Calendar` or plain object): A calendar to project the month into.
- `refISODay` (optional number): A reference day, used for disambiguation when implementing other calendar systems.
  You can omit this parameter unless using a non-ISO-8601 calendar.

**Returns:** a new `Temporal.YearMonth` object.

Use this constructor if you have the correct parameters already as individual number values in the ISO 8601 calendar, or you are implementing a custom calendar.
Otherwise, `Temporal.YearMonth.from()`, which accepts more kinds of input, allows months in other calendar systems, and allows disambiguation behaviour, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).
Together, `isoYear`, `isoMonth`, and `refISODay` must represent a valid date in that calendar, even if you are passing a different calendar as the `calendar` parameter.

The range of allowed values for this type is exactly enough that calling [`toYearMonth()`](./date.html#toYearMonth) on any valid `Temporal.Date` will succeed.
If `isoYear` and `isoMonth` are outside of this range, then this function will throw a `RangeError`.

> **NOTE**: The `isoMonth` argument ranges from 1 to 12, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:
```javascript
// The June 2019 meeting
ym = new Temporal.YearMonth(2019, 6)  // => 2019-06
```

## Static methods

### Temporal.YearMonth.**from**(_thing_: any, _options_?: object) : Temporal.YearMonth

**Parameters:**
- `thing`: The value representing the desired month.
- `options` (optional object): An object with properties representing options for constructing the date.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values in `thing`.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object.

This static method creates a new `Temporal.YearMonth` object from another value.
If the value is another `Temporal.YearMonth` object, a new object representing the same month is returned.
If the value is any other object, it must have `year` and `month` properties, and a `Temporal.YearMonth` will be constructed from them.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.
Any parts of the string other than the year and the month are optional and will be ignored.
If the string isn't valid according to ISO 8601, then a `RangeError` will be thrown regardless of the value of `disambiguation`.

The `disambiguation` option works as follows:
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

Additionally, if the result is earlier or later than the range of dates that `Temporal.YearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

> **NOTE**: The allowed values for the `thing.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Example usage:
```javascript
ym = Temporal.YearMonth.from('2019-06');  // => 2019-06
ym = Temporal.YearMonth.from('2019-06-24');  // => 2019-06
ym = Temporal.YearMonth.from('2019-06-24T15:43:27');  // => 2019-06
ym = Temporal.YearMonth.from('2019-06-24T15:43:27Z');  // => 2019-06
ym = Temporal.YearMonth.from('2019-06-24T15:43:27+01:00[Europe/Brussels]');
  // => 2019-06
ym === Temporal.YearMonth.from(ym)  // => true

ym = Temporal.YearMonth.from({year: 2019, month: 6});  // => 2019-06
ym = Temporal.YearMonth.from(Temporal.Date.from('2019-06-24'));
  // => same as above; Temporal.Date has year and month properties

// Different disambiguation modes
ym = Temporal.YearMonth.from({ year: 2001, month: 13 }, { disambiguation: 'constrain' })
  // => 2001-12
ym = Temporal.YearMonth.from({ year: 2001, month: -1 }, { disambiguation: 'constrain' })
  // => 2001-01
ym = Temporal.YearMonth.from({ year: 2001, month: 13 }, { disambiguation: 'reject' })
  // throws
ym = Temporal.YearMonth.from({ year: 2001, month: -1 }, { disambiguation: 'reject' })
  // throws
```

### Temporal.YearMonth.**compare**(_one_: Temporal.YearMonth, _two_: Temporal.YearMonth) : number

**Parameters:**
- `one` (`Temporal.YearMonth`): First month to compare.
- `two` (`Temporal.YearMonth`): Second month to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.YearMonth` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.
- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

This function can be used to sort arrays of `Temporal.YearMonth` objects.
For example:
```javascript
one = Temporal.YearMonth.from('2006-08');
two = Temporal.YearMonth.from('2015-07');
three = Temporal.YearMonth.from('1930-02');
sorted = [one, two, three].sort(Temporal.YearMonth.compare);
sorted.join(' ');  // => 1930-02 2006-08 2015-07
```

## Properties

### yearMonth.**year** : number

### yearMonth.**month** : number

The above read-only properties allow accessing the year and month individually.

> **NOTE**: The possible values for the `month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage examples:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.year   // => 2019
ym.month  // => 6
```

### yearMonth.**calendar** : object

The `calendar` read-only property gives the calendar that the `year` and `month` properties are interpreted in.

### yearmonth.**era** : unknown

The `era` read-only property is `undefined` when using the ISO 8601 calendar.
It's used for calendar systems that specify an era in addition to the year.

### yearMonth.**daysInMonth** : number

The `daysInMonth` read-only property gives the number of days in the month.
This is 28, 29, 30, or 31, depending on the month and whether the year is a leap year.

Usage example:
```javascript
// Attempt to write some mnemonic poetry
const monthsByDays = {};
for (let month = 1; month <= 12; month++) {
    const ym = Temporal.YearMonth.from({year: 2020, month});
    monthsByDays[ym.daysInMonth] = (monthsByDays[ym.daysInMonth] || []).concat(ym);
}

const strings = monthsByDays[30].map(ym => ym.toLocaleString('en', {month: 'long'}));
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
```javascript
ym = Temporal.YearMonth.from('2019-06');
percent = ym.daysInMonth / ym.daysInYear;
`${ym.toLocaleString('en', {month: 'long', year: 'numeric'})} was ${percent.toLocaleString('en', {style: 'percent'})} of the year!`
  // => example output: "June 2019 was 8% of the year!"
```

### yearMonth.**isLeapYear** : boolean

The `isLeapYear` read-only property tells whether the year that the date falls in is a leap year or not.
Its value is `true` if the year is a leap year, and `false` if not.

Usage example:
```javascript
// Was June 2019 in a leap year?
ym = Temporal.YearMonth.from('2019-06');
ym.isLeapYear  // => false
// Is 2100 a leap year? (no, because it's divisible by 100 and not 400)
ym.with({year: 2100}).isLeapYear  // => false
```

## Methods

### yearMonth.**with**(_yearMonthLike_: object, _options_?: object) : Temporal.YearMonth

**Parameters:**
- `yearMonthLike` (object): an object with some or all of the properties of a `Temporal.YearMonth`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object.

This method creates a new `Temporal.YearMonth` which is a copy of `yearMonth`, but any properties present on `yearMonthLike` override the ones already present on `yearMonth`.

Since `Temporal.YearMonth` objects are immutable, use this method instead of modifying one.

If the result is earlier or later than the range of dates that `Temporal.YearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

> **NOTE**: The allowed values for the `yearMonthLike.month` property start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

> **NOTE**: Unlike in `Temporal.Date.prototype.with()`, a `calendar` property is not allowed on `yearMonthLike`.
> It is not possible to convert a `Temporal.YearMonth` to another calendar system without knowing the day of the month.
> If you need to do this, use `yearMonth.toDateOnDay(day).withCalendar(calendar).toYearMonth()`.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
// Get December of that year
ym.with({month: 12})  // => 2019-12
```

### yearMonth.**plus**(_duration_: object, _options_?: object) : Temporal.YearMonth

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `disambiguation` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object which is the month indicated by `yearMonth` plus `duration`.

This method adds `duration` to `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument is an object with properties denoting a duration, such as `{ months: 5 }`, or a `Temporal.Duration` object.

If the result is earlier or later than the range of dates that `Temporal.YearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

Other than for out-of-range values, the `disambiguation` option has no effect in the default ISO calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.YearMonth` does not distinguish days.
However, disambiguation may have an effect in other calendars where years can be different numbers of months.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.plus({years: 20, months: 4})  // => 2039-10
```

### yearMonth.**minus**(_duration_: object, _options_?: object) : Temporal.YearMonth

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `disambiguation` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object which is the month indicated by `yearMonth` minus `duration`.

This method subtracts `duration` from `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument is an object with properties denoting a duration, such as `{ months: 5 }`, or a `Temporal.Duration` object.

If the result is earlier or later than the range of dates that `Temporal.YearMonth` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then this method will throw a `RangeError` regardless of `disambiguation`.

Other than for out-of-range values, the `disambiguation` option has no effect in the default ISO calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.YearMonth` does not distinguish days.
However, disambiguation may have an effect in other calendars where years can be different numbers of months.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.minus({years: 20, months: 4})  // => 1999-02
```

### yearMonth.**difference**(_other_: Temporal.YearMonth, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (`Temporal.YearMonth`): Another month with which to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'years'` and `'months'`.
    The default is `years`.


**Returns:** a `Temporal.Duration` representing the difference between `yearMonth` and `other`.

This method computes the difference between the two months represented by `yearMonth` and `other`, and returns it as a `Temporal.Duration` object.
A `RangeError` will be thrown if `other` is later than `yearMonth`, because `Temporal.Duration` objects cannot represent negative durations.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of one year and two months will become 14 months when `largestUnit` is `"months"`, for example.
However, a difference of one month will still be one month even if `largestUnit` is `"years"`.

Unlike other Temporal types, days and lower units are not allowed, because the data model of `Temporal.YearMonth` doesn't have that accuracy.

Computing the difference between two months in different calendar systems is not supported.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
other = Temporal.YearMonth.from('2006-08');
ym.difference(other)                             // => P12Y10M
ym.difference(other, { largestUnit: 'months' })  // => P154M
other.difference(ym, { largestUnit: 'months' })  // => throws RangeError

// If you really need to calculate the difference between two YearMonths
// in days, you can eliminate the ambiguity by explicitly choosing the
// day of the month (and if applicable, the time of that day) from which
// you want to reckon the difference. For example, using the first of
// the month to calculate a number of days:
ym.toDateOnDay(1).difference(other.toDateOnDay(1), { largestUnit: 'days' });  // => P4687D
```

### yearMonth.**equals**(_other_: Temporal.YearMonth) : boolean

**Parameters:**
- `other` (`Temporal.YearMonth`): Another month to compare.

**Returns:** `true` if `yearMonth` and `other` are equal, or `false` if not.

Compares two `Temporal.YearMonth` objects for equality.

This function exists because it's not possible to compare using `yearMonth == other` or `yearMonth === other`, due to ambiguity in the primitive representation and between Temporal types.

Note that equality of two months from different calendar systems only makes sense in a few cases, such as when the two calendar systems both use the Gregorian year.

Even if you are using the same calendar system, if you don't need to know the order in which the two months occur, then this function may be less typing and more efficient than `Temporal.YearMonth.compare`.

Example usage:
```javascript
ym = Temporal.YearMonth.from('2019-06');
other = Temporal.YearMonth.from('2006-08');
ym.equals(other)  // => false
ym.equals(ym)  // => true
```

### yearMonth.**toString**() : string

**Returns:** a string in the ISO 8601 date format representing `yearMonth`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `yearMonth`.
The string can be passed to `Temporal.YearMonth.from()` to create a new `Temporal.YearMonth` object.

Example usage:
```js
ym = Temporal.YearMonth.from('2019-06');
ym.toString();  // => 2019-06
```

### yearMonth.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `yearMonth`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `yearMonth`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

Example usage:
```js
ym = Temporal.YearMonth.from('2019-06');
ym.toLocaleString();  // => example output: 2019-06
ym.toLocaleString('de-DE');  // => example output: 6.2019
ym.toLocaleString('de-DE', {month: 'long', year: 'numeric'});  // => Juni 2019
ym.toLocaleString('en-US-u-nu-fullwide');  // => ６/２０１９
```

### yearMonth.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `yearMonth`.

This method is the same as `yearMonth.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.YearMonth` object from a string, is `Temporal.YearMonth.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.YearMonth` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.YearMonth`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const boardMeeting = {
  id: 4,
  agenda: [
    'Roll call',
    'Budget',
  ],
  meetingYearMonth: Temporal.YearMonth.from({ year: 2019, month: 3 }),
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
  if (key.endsWith('YearMonth'))
    return Temporal.YearMonth.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### yearMonth.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.YearMonth` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.YearMonth.compare()` for this, or `yearMonth.equals()` for equality.

### yearMonth.**toDateOnDay**(_day_: number) : Temporal.Date

**Parameters:**
- `day` (number): A day of the month, which must be a valid day of `yearMonth`.

**Returns:** a `Temporal.Date` object that represents the calendar date of `day` in `yearMonth`.

This method can be used to convert `Temporal.YearMonth` into a `Temporal.Date`, by supplying a calendar day to use.
The converted object carries a copy of all the relevant fields of `yearMonth`.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.toDateOnDay(24)  // => 2019-06-24
```

### yearMonth.**getFields**() : { year: number, month: number, calendar: object, [propName: string]: unknown }

**Returns:** a plain object with properties equal to the fields of `yearMonth`.

This method can be used to convert a `Temporal.YearMonth` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Note that if using a different calendar from ISO 8601, these will be the calendar-specific values.

> **NOTE**: The possible values for the `month` property of the returned object start at 1, which is different from legacy `Date` where months are represented by zero-based indices (0 to 11).

Usage example:
```javascript
ym = Temporal.DateTime.from('2019-06');
Object.assign({}, ym).year  // => undefined
Object.assign({}, ym.getFields()).year  // => 2019
```

### yearMonth.**getISOCalendarFields**(): { year: number, month: number, day: number }

**Returns:** a plain object with properties expressing `yearMonth` in the ISO 8601 calendar.

This method is mainly useful if you are implementing a custom calendar.
Most code will not need to use it.
Use `yearMonth.getFields()` instead.

The value of the `day` property will be equal to the `refISODay` constructor argument passed when `yearMonth` was constructed.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.getISOCalendarFields().year  // => 2019
```
