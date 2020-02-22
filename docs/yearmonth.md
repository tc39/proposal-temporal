# Temporal.YearMonth

A `Temporal.YearMonth` represents a particular month on the calendar.
For example, it could be used to represent a particular instance of a monthly recurring event, like "the June 2019 meeting".

`Temporal.YearMonth` refers to the whole of a specific month; if you need to refer to a calendar event on a certain day, use `Temporal.Date` or even `Temporal.DateTime`.
A `Temporal.YearMonth` can be converted into a `Temporal.Date` by combining it with a day of the month, using the `withDay()` method.

## Constructor

### **new Temporal.YearMonth**(_isoYear_: number, _isoMonth_: number, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

**Parameters:**
- `isoYear` (number): A year.
- `isoMonth` (number): A month, ranging between 1 and 12 inclusive.
- `disambiguation` (optional string): How to deal with out-of-range values of the other parameters.
  Allowed values are `constrain`, `balance`, and `reject`.
  The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object.

Use this constructor if you have the correct parameters already as individual number values, or you need the disambiguation behaviour.
Otherwise, `Temporal.YearMonth.from()`, which accepts more kinds of input, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).

The `disambiguation` parameter works as follows:
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `balance` mode, any out-of-range values are resolved by balancing them with the next highest unit.
- In `reject` mode, the presence of out-of-range values will cause the constructor to throw a `RangeError`.

Usage examples:
```javascript
// The June 2019 meeting
ym = new Temporal.YearMonth(2019, 6)  // => 2019-06

// Different disambiguation modes
ym = new Temporal.YearMonth(2001, 13, 'constrain')  // => 2001-12
ym = new Temporal.YearMonth(2001, -1, 'constrain')  // => 2001-01
ym = new Temporal.YearMonth(2001, 13, 'balance')  // => 2002-01
ym = new Temporal.YearMonth(2001, -1, 'balance')  // => 2000-11
ym = new Temporal.YearMonth(2001, 13, 'reject')  // throws
ym = new Temporal.YearMonth(2001, -1, 'reject')  // throws
```

## Static methods

### Temporal.YearMonth.**from**(_thing_: string | object) : Temporal.YearMonth

**Parameters:**
- `thing` (string or object): The value representing the desired month.

**Returns:** a new `Temporal.YearMonth` object (or the same object if `thing` was a `Temporal.YearMonth` object.)

This static method creates a new `Temporal.YearMonth` object from another value.
If the value is a string, it must be in ISO 8601 format.
Any parts of the string other than the year and the month will be ignored.
If the value is another `Temporal.YearMonth` object, the same object is returned.
If the value is any other object, it must have `year` and `month` properties, and a `Temporal.YearMonth` will be constructed from them.

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

Usage examples:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.year   // => 2019
ym.month  // => 6
```

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

### yearMonth.**with**(_yearMonthLike_: object, _disambiguation_: 'constrain' | 'balance' | 'reject' = 'constrain') : Temporal.YearMonth

**Parameters:**
- `yearMonthLike` (object): an object with some or all of the properties of a `Temporal.YearMonth`.
- `disambiguation` (optional string): How to deal with out-of-range values.
  Allowed values are `constrain`, `balance`, and `reject`.
  The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object.

This method creates a new `Temporal.YearMonth` which is a copy of `yearMonth`, but any properties present on `yearMonthLike` override the ones already present on `yearMonth`.

Since `Temporal.YearMonth` objects are immutable, use this method instead of modifying one.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
// Get December of that year
ym.with({month: 12})  // => 2019-12
```

### yearMonth.**plus**(_duration_: string | object, _disambiguation_: 'constrain' | 'reject' = 'constrain') : Temporal.YearMonth

**Parameters:**
- `duration` (string or object): A `Temporal.Duration` object, a duration-like object, or a string from which to create a `Temporal.Duration`.
- `disambiguation` (optional string): How to deal with additions that result in out-of-range values.
  Allowed values are `constrain` and `reject`.
  The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object which is the month indicated by `yearMonth` plus `duration`.

This method adds `duration` to `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument can be any value that could be passed to `Temporal.Duration.from()`:
- a `Temporal.Duration` object;
- any object with properties denoting a duration, such as `{ months: 5 }`;
- a string in ISO 8601 duration format, such as `P5M`.

The `disambiguation` parameter has no effect in the default ISO calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.YearMonth` does not distinguish days.
However, disambiguation may have an effect in other calendars where years can be different numbers of months.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.plus({years: 20, months: 4})  // => 2039-10
ym.plus('P14Y')  // => 2033-06
```

### yearMonth.**minus**(_duration_: string | object, _disambiguation_: 'constrain' | 'reject' = 'constrain') : Temporal.YearMonth

**Parameters:**
- `duration` (string or object): A `Temporal.Duration` object, a duration-like object, or a string from which to create a `Temporal.Duration`.
- `disambiguation` (optional string): How to deal with additions that result in out-of-range values.
  Allowed values are `constrain` and `reject`.
  The default is `constrain`.

**Returns:** a new `Temporal.YearMonth` object which is the month indicated by `yearMonth` minus `duration`.

This method subtracts `duration` from `yearMonth`, returning a month that is in the future relative to `yearMonth`.

The `duration` argument can be any value that could be passed to `Temporal.Duration.from()`:
- a `Temporal.Duration` object;
- any object with properties denoting a duration, such as `{ months: 5 }`;
- a string in ISO 8601 duration format, such as `P5M`.

The `disambiguation` parameter has no effect in the default ISO calendar, because a year is always 12 months and therefore not ambiguous.
It doesn't matter in this case that years and months can be different numbers of days, as the resolution of `Temporal.YearMonth` does not distinguish days.
However, disambiguation may have an effect in other calendars where years can be different numbers of months.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.minus({years: 20, months: 4})  // => 1999-02
ym.minus('P14Y')  // => 2005-06
```

### yearMonth.**difference**(_other_: Temporal.YearMonth) : Temporal.Duration

**Parameters:**
- `other` (`Temporal.YearMonth`): Another month with which to compute the difference.

**Returns:** a `Temporal.Duration` representing the difference between `yearMonth` and `other`.

This method computes the difference between the two months represented by `yearMonth` and `other`, and returns it as a `Temporal.Duration` object.
The difference is always positive, no matter the order of `yearMonth` and `other`, because `Temporal.Duration` objects cannot represent negative durations.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.difference(Temporal.YearMonth.from('2006-08'))  // => P12Y10M
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

### yearMonth.**toLocaleString**(_locale_?: string, _options_?: object) : string

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

### yearMonth.**withDay**(_day_: number) : Temporal.Date

**Parameters:**
- `day` (number): A day of the month, which must be a valid day of `yearMonth`.

**Returns:** a `Temporal.Date` object that represents the calendar date of `day` in `yearMonth`.

This method can be used to convert `Temporal.YearMonth` into a `Temporal.Date`, by supplying a calendar day to use.
The converted object carries a copy of all the relevant fields of `yearMonth`.

Usage example:
```javascript
ym = Temporal.YearMonth.from('2019-06');
ym.withDay(24)  // => 2019-06-24
```
