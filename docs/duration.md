# Temporal.Duration

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Duration` represents an immutable duration of time which can be used in date/time arithmetic.

`Temporal.Duration` can be constructed directly or returned from `Temporal.Duration.from()`.
It can also be obtained from the `difference()` method of any other `Temporal` type that supports arithmetic, and is used in those types' `add()` and `subtract()` methods.

When printed, a `Temporal.Duration` produces a string according to the ISO 8601 notation for durations.
The examples in this page use this notation extensively.

Briefly, the ISO 8601 notation consists of a `P` character, followed by years, months, weeks, and days, followed by a `T` character, followed by hours, minutes, and seconds with a decimal part, each with a single-letter suffix that indicates the unit.
Any zero components may be omitted.
For more detailed information, see the ISO 8601 standard or the [Wikipedia page](https://en.wikipedia.org/wiki/ISO_8601#Durations).

| ISO 8601             | Meaning |
| -------------------- | ------- |
| **P1Y1M1DT1H1M1.1S** | One year, one month, one day, one hour, one minute, one second, and 100 milliseconds |
| **P40D**             | Forty days |
| **P1Y1D**            | A year and a day |
| **P3DT4H59M**        | Three days, four hours and 59 minutes |
| **PT2H30M**          | Two and a half hours |
| **P1M**              | One month |
| **PT1M**             | One minute |
| **PT0.0021S**        | 2.1 milliseconds (two milliseconds and 100 microseconds) |
| **PT0S**             | Zero |
| **P0D**              | Zero |

> **NOTE:** According to the ISO 8601-1 standard, weeks are not allowed to appear together with any other units, and durations can only be positive.
> As extensions to the standard, ISO 8601-2 allows a sign character at the start of the string, and allows combining weeks with other units.
> If you intend to use a string such as **P3W1D**, **+P1M**, or **-P1M** for interoperability, note that other programs may not accept it.

## Constructor

### **new Temporal.Duration**(_years_?: number, _months_?: number, _days_?: number, _hours_?: number, _minutes_?: number, _seconds_?: number, _milliseconds_?: number, _microseconds_?: number, _nanoseconds_?: number) : Temporal.Duration

**Parameters:**
- `years` (optional number): A number of years.
- `months` (optional number): A number of months.
- `weeks` (optional number): A number of weeks.
- `days` (optional number): A number of days.
- `hours` (optional number): A number of hours.
- `minutes` (optional number): A number of minutes.
- `seconds` (optional number): A number of seconds.
- `milliseconds` (optional number): A number of milliseconds.
- `microseconds` (optional number): A number of microseconds.
- `nanoseconds` (optional number): A number of nanoseconds.

**Returns:** a new `Temporal.Duration` object.

All of the arguments are optional.
Any missing or `undefined` numerical arguments are taken to be zero, and all non-integer numerical arguments are rounded to the nearest integer, towards zero.
Any non-zero arguments must all have the same sign.

Use this constructor directly if you have the correct parameters already as numerical values.
Otherwise `Temporal.Duration.from()` is probably more convenient because it accepts more kinds of input and allows controlling the overflow behaviour.

Usage examples:
```javascript
new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321)  // => P1Y2M3W4DT5H6M7.987654321S
new Temporal.Duration(0, 0, 0, 40)  // => P40D
new Temporal.Duration(undefined, undefined, undefined, 40)  // => P40D
new Temporal.Duration()  // => PT0S
```

## Static methods

### Temporal.Duration.**from**(_thing_: any, _options_?: object) : Temporal.Duration

**Parameters:**
- `thing`: A `Duration`-like object or a string from which to create a `Temporal.Duration`.
- `options` (optional object): An object with properties representing options for constructing the duration.
  The following options are recognized:
  - `overflow` (optional string): What to do if any of the values are larger than the next highest unit.
    Allowed values are `constrain` and `balance`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object.

This static method creates a new `Temporal.Duration` from another value.
If the value is another `Temporal.Duration` object, a new object representing the same duration is returned.
If the value is any other object, a `Temporal.Duration` will be constructed from the values of any `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `microseconds`, and `nanoseconds` properties that are present.
Any missing ones will be assumed to be 0.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.

The `overflow` option controls how out-of-range values are interpreted:
- `constrain` (the default): Values higher than the next highest unit (for example, 90 minutes) are left as-is.
- `balance`: Values higher than the next highest unit, are converted to be in-range by incrementing the next highest unit accordingly.
  For example, 90 minutes becomes one hour and 30 minutes.

No matter which overflow mode is selected, all non-zero values must have the same sign, and must not be infinite.
Otherwise, the function will throw a `RangeError`.

> **NOTE:** Years and months can have different lengths.
In the default ISO calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days.
Therefore, any `Duration` object with nonzero years or months can refer to a different length of time depending on when the start date is.
No conversion is ever performed between years, months, weeks, and days, even in `balance` mode, because such conversion would be ambiguous.

> **NOTE:** This function understands strings where weeks and other units are combined, and strings with a single sign character at the start, which are extensions to the ISO 8601 standard described in ISO 8601-2.
> (For example, `P3W1D` is understood to mean three weeks and one day, `-P1Y1M` is a negative duration of one year and one month, and `+P1Y1M` is one year and one month.)
> If no sign character is present, then the sign is assumed to be positive.

Usage examples:
```javascript
d = Temporal.Duration.from({ years: 1, days: 1 })  // => P1Y1D
d = Temporal.Duration.from({ days: -2, hours: -12 })  // => -P2DT12H

Temporal.Duration.from(d) === d  // => true

d = Temporal.Duration.from('P1Y1D')  // => P1Y1D
d = Temporal.Duration.from('-P2DT12H')  // => -P2DT12H
d = Temporal.Duration.from('P0D')  // => PT0S

// Mixed-sign values are never allowed, even if overall positive:
d = Temporal.Duration.from({ hours: 1, minutes: -30 })  // throws

// Disambiguation

d = Temporal.Duration.from({ minutes: 120 }, { overflow: 'constrain' })  // => PT120M
d = Temporal.Duration.from({ minutes: 120 }, { overflow: 'balance' })  // => PT2H
```

## Properties

### duration.**years** : number

### duration.**months** : number

### duration.**weeks** : number

### duration.**days** : number

### duration.**hours** : number

### duration.**minutes** : number

### duration.**seconds** : number

### duration.**milliseconds** : number

### duration.**microseconds** : number

### duration.**nanoseconds** : number

The above read-only properties allow accessing each component of the duration individually.

Usage examples:
```javascript
d = Temporal.Duration.from('P1Y2M3W4DT5H6M7.987654321S');
d.years         // => 1
d.months        // => 2
d.weeks         // => 3
d.days          // => 4
d.hours         // => 5
d.minutes       // => 6
d.seconds       // => 7
d.milliseconds  // => 987
d.microseconds  // => 654
d.nanoseconds   // => 321
```

### duration.**sign** : number

The read-only `sign` property has the value –1, 0, or 1, depending on whether the duration is negative, zero, or positive.

## Methods

### duration.**with**(_durationLike_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `durationLike` (object): an object with some or all of the properties of a `Temporal.Duration`.
- `options` (optional object): An object with properties representing options for the copy.
  The following options are recognized:
  - `overflow` (string): How to deal with values that are larger than the next highest unit.
    Allowed values are `constrain` and `balance`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object.

This method creates a new `Temporal.Duration` which is a copy of `duration`, but any properties present on `durationLike` override the ones already present on `duration`.

Since `Temporal.Duration` objects are immutable, use this method instead of modifying one.

All non-zero properties of `durationLike` must have the same sign, and they must additionally have the same sign as the non-zero properties of `duration`, unless they override all of these non-zero properties.
If a property of `durationLike` is infinity, then this function will throw a `RangeError`.

The `overflow` option specifies what to do with overly large values, that are larger than the next unit.
(For example, 90 minutes is larger than 1 hour.)
Constrain mode will leave these values as they are.
Balance mode will behave like it does in `Duration.from()` and perform a balance operation on the result, changing 90 minutes to 1 hour and 30 minutes.

For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md).

Usage example:
```javascript
duration = Temporal.Duration.from({ months: 50, days: 50, hours: 50, minutes: 100 });
// Perform a balance operation using additional ISO calendar rules:
let { years, months } = duration;
years += Math.floor(months / 12);
months %= 12;
duration = duration.with({ years, months }, { overflow: 'balance' });
  // => P4Y2M52DT3H40M
```

### duration.**add**(_other_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `overflow` (string): How to deal with additions that result in mixed-sign values or values that are larger than the next highest unit.
    Allowed values are `constrain` and `balance`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object which represents the sum of the durations of `duration` and `other`.

This method adds `other` to `duration`, resulting in a longer duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

In order to be valid, the resulting duration must not have fields with mixed signs.
However, before the result is balanced, it's possible that the intermediate result will have one or more negative fields while the overall duration is positive, or vice versa.
For example, "4 hours and 15 minutes" minus "2 hours and 30 minutes" results in "2 hours and &minus;15 minutes".
The `overflow` option tells what to do in this case:
- In `constrain` mode (the default), additions that result in mixed-sign fields will balance those fields with the next-highest field so that all the fields of the result are constrained to have the same sign.
- In `balance` mode, all fields are balanced with the next highest field, no matter if they have mixed signs or not.

For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md).

No conversion is ever performed between years, months, days, and other units, as that could be ambiguous depending on the start date.
If you need such a conversion, you must implement it yourself, since the rules can depend on the start date and the calendar in use.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:
```javascript
hour = Temporal.Duration.from('PT1H');
hour.add({ minutes: 30 })  // => PT1H30M

// Examples of balancing:
one = Temporal.Duration.from({ hours: 1, minutes: 30 });
two = Temporal.Duration.from({ hours: 2, minutes: 45 });
result = one.add(two)  // => PT3H75M
result.with(result, { overflow: 'balance' })  // => PT4H15M

fifty = Temporal.Duration.from('P50Y50M50DT50H50M50.500500500S');
result = fifty.add(fifty)  // => P100Y100M100DT100H100M101.001001S'
Temporal.Duration.from(result, { overflow: 'balance' })
  // => P100Y100M104DT5H41M41.001001S

// Example of not balancing:
oneAndAHalfYear = Temporal.Duration.from({ years: 1, months: 6 });
result = oneAndAHalfYear.add(oneAndAHalfYear)  // => P2Y12M
Temporal.Duration.from(result, { overflow: 'balance' }) // => P2Y12M
// Example of custom conversion using ISO calendar rules:
function monthsToYears(duration) {
    let { years, months } = duration;
    years += Math.floor(months / 12);
    months %= 12;
    return duration.with({ years, months });
}
monthsToYears(result)  // => P3Y

```

### duration.**subtract**(_other_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `overflow` (string): How to deal with subtractions that result in values with mixed signs or values that are larger than the next highest unit.
    Allowed values are `constrain` and `balance`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object which represents the duration of `duration` less the duration of `other`.

This method subtracts `other` from `duration`, resulting in a shorter duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

If `other` is larger than `duration` and the subtraction would result in a negative duration, the method will throw a `RangeError`.

In order to be valid, the resulting duration must not have fields with mixed signs.
However, before the result is balanced, it's possible that the intermediate result will have one or more negative fields while the overall duration is positive, or vice versa.
For example, "4 hours and 15 minutes" minus "2 hours and 30 minutes" results in "2 hours and &minus;15 minutes".
The `overflow` argument tells what to do in this case:
- In `constrain` mode (the default), subtractions that result in mixed-sign fields will balance those fields with the next-highest field so that all the fields of the result are constrained to have the same sign.
- In `balance` mode, all fields are balanced with the next highest field, no matter if they have mixed signs or not.

For usage examples and a more complete explanation of how balancing works and why it is necessary, especially for subtracting `Temporal.Duration`, see [Duration balancing](./balancing.md#duration-arithmetic).

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:
```javascript
hourAndAHalf = Temporal.Duration.from('PT1H30M');
hourAndAHalf.subtract({ hours: 1 })  // => PT30M

one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ seconds: 30 });
one.subtract(two);  // => PT179M30S
one.subtract(two, { overflow: 'balance' });  // => PT2H59M30S

// Example of not balancing:
threeYears = Temporal.Duration.from({ years: 3 });
oneAndAHalfYear = Temporal.Duration.from({ years: 1, months: 6 });
threeYears.subtract(oneAndAHalfYear)  // throws; mixed months and years signs cannot be balanced
// Example of a custom conversion using ISO calendar rules:
function yearsToMonths(duration) {
    let { years, months } = duration;
    months += years * 12;
    return duration.with({ years: 0, months });
}
yearsToMonths(threeYears).subtract(yearsToMonths(oneAndAHalfYear))  // => P18M
```

### duration.**negated**() : Temporal.Duration

**Returns:** a new `Temporal.Duration` object with the opposite sign.

This method gives the negation of `duration`.
It returns a newly constructed `Temporal.Duration` with all the fields having the opposite sign (positive if negative, and vice versa.)
If `duration` is zero, then the returned object is a copy of `duration`.

Usage example:
```javascript
d = Temporal.Duration.from('P1Y2M3DT4H5M6.987654321S');
d.sign  // 1
d.negated()  // -P1Y2M3DT4H5M6.987654321S
d.negated().sign  // -1
```

### duration.**abs**() : Temporal.Duration

**Returns:** a new `Temporal.Duration` object that is always positive.

This method gives the absolute value of `duration`.
It returns a newly constructed `Temporal.Duration` with all the fields having the same magnitude as those of `duration`, but positive.
If `duration` is already positive or zero, then the returned object is a copy of `duration`.

Usage example:
```javascript
d = Temporal.Duration.from('-PT8H30M');
d.abs()  // PT8H30M
```

### duration.**getFields**() : { years: number, months: number, weeks: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number, microseconds: number, nanoseconds: number }

**Returns:** a plain object with properties equal to the fields of `duration`.

This method can be used to convert a `Temporal.Duration` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Usage example:
```javascript
d = Temporal.Duration.from('P1Y2M3DT4H5M6.987654321S');
Object.assign({}, d).days  // => undefined
Object.assign({}, d.getFields()).days  // => 3
```

### duration.**toString**() : string

**Returns:** the duration as an ISO 8601 string.

This method overrides `Object.prototype.toString()` and provides the ISO 8601 description of the duration.

> **NOTE**: If any of `duration.milliseconds`, `duration.microseconds`, or `duration.nanoseconds` are over 999, then deserializing from the result of `duration.toString()` will yield an equal but different object.
> See [Duration balancing](./balancing.md#serialization) for more information.

Usage examples:
```javascript
d = Temporal.Duration.from({ years: 1, days: 1 });
d.toString();  // => P1Y1D
d = Temporal.Duration.from({ years: -1, days: -1 });
d.toString();  // => -P1Y1D
d = Temporal.Duration.from({ milliseconds: 1000 });
d.toString();  // => PT1S

// The output format always balances units under 1 s, even if the
// underlying Temporal.Duration object doesn't.
nobal = Temporal.Duration.from({ milliseconds: 3500 });
console.log(`${nobal}`, nobal.seconds, nobal.milliseconds);  // => PT3.500S 0 3500
bal = Temporal.Duration.from({ milliseconds: 3500 }, { overflow: 'balance'});
console.log(`${bal}`, bal.seconds, bal.milliseconds);  // => PT3.500S 3 500
```

### duration.**toJSON**() : string

**Returns:** a string representation of the duration that can be passed to `Temporal.Duration.from()`.

This method is the same as `duration.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

> **NOTE**: The same caution about `milliseconds`, `microseconds`, or `nanoseconds` greater than 999 applies to this method as well.

The reverse operation, recovering a `Temporal.Duration` object from a string, is `Temporal.Duration.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.Duration` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.Duration`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const ban = {
  reason: 'cooldown',
  banDuration: Temporal.Duration.from({ hours: 48 }),
};
const str = JSON.stringify(ban, null, 2);
console.log(str);
// =>
// {
//   "reason": "cooldown",
//   "banDuration": "PT48H"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Duration'))
    return Temporal.Duration.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### duration.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of the duration.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `duration`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DurationFormat`](http://tc39.es/proposal-intl-duration-format/).

> **NOTE**: This method requires that your JavaScript environment supports `Intl.DurationFormat`.
> That is still an early-stage proposal and at the time of writing it is not supported anywhere.
> If `Intl.DurationFormat` is not available, then the output of this method is the same as that of `duration.toString()`, and the `locales` and `options` arguments are ignored.

Usage examples:
```javascript
d = Temporal.Duration.from('P1DT6H30M')
d.toLocaleString()  // => 1 day 6 hours 30 minutes
d.toLocaleString('de-DE')  // => 1 Tag 6 Stunden 30 Minuten
d.toLocaleString('en-US', {day: 'numeric', hour: 'numeric'})  // => 1 day 6 hours
```

### duration.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.Duration` objects with the relational operators `<`, `<=`, `>`, or `>=`.
