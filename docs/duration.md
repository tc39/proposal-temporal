# Temporal.Duration

A `Temporal.Duration` represents an immutable duration of time which can be used in date/time arithmetic.

`Temporal.Duration` can be constructed directly or returned from `Temporal.Duration.from()`.
It can also be obtained from the `difference()` method of any other `Temporal` type that supports arithmetic, and is used in those types' `plus()` and `minus()` methods.

When printed, a `Temporal.Duration` produces a string according to the ISO 8601 notation for durations.
The examples in this page use this notation extensively.

Briefly, the ISO 8601 notation consists of a `P` character, followed by years, months, and days, followed by a `T` character, followed by hours, minutes, and seconds with a decimal part, each with a single-letter suffix that indicates the unit.
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

## Constructor

### **new Temporal.Duration**(_years_?: number, _months_?: number, _days_?: number, _hours_?: number, _minutes_?: number, _seconds_?: number, _milliseconds_?: number, _microseconds_?: number, _nanoseconds_?: number) : Temporal.Duration

**Parameters:**
- `years` (optional number): A number of years.
- `months` (optional number): A number of months.
- `days` (optional number): A number of days.
- `hours` (optional number): A number of hours.
- `minutes` (optional number): A number of minutes.
- `seconds` (optional number): A number of seconds.
- `milliseconds` (optional number): A number of milliseconds.
- `microseconds` (optional number): A number of microseconds.
- `nanoseconds` (optional number): A number of nanoseconds.

**Returns:** a new `Temporal.Duration` object.

All of the arguments are optional.
Any missing or `undefined` numerical arguments are taken to be zero, and all non-integer numerical arguments are rounded down to the nearest integer.
Negative numbers are not allowed.

Use this constructor directly if you have the correct parameters already as numerical values, but otherwise `Temporal.Duration.from()`, which accepts more kinds of input and allows disambiguation behaviour, is probably more convenient.

Usage examples:
```javascript
new Temporal.Duration(1, 2, 3, 4, 5, 6, 987, 654, 321)  // => P1Y2M3DT4H5M6.987654321S
new Temporal.Duration(0, 0, 40)  // => P40D
new Temporal.Duration(undefined, undefined, 40)  // => P40D
new Temporal.Duration()  // => PT0S
```

## Static methods

### Temporal.Duration.**from**(_thing_: any, _options_?: object) : Temporal.Duration

**Parameters:**
- `thing`: A `Duration`-like object or a string from which to create a `Temporal.Duration`.
- `options` (optional object): An object with properties representing options for constructing the duration.
  The following options are recognized:
  - `disambiguation` (optional string): How to disambiguate if any of the other arguments are out of range.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object.

This static method creates a new `Temporal.Duration` from another value.
If the value is another `Temporal.Duration` object, a new object representing the same duration is returned.
If the value is any other object, a `Temporal.Duration` will be constructed from the values of any `years`, `months`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `microseconds`, and `nanoseconds` properties that are present.
Any missing ones will be assumed to be 0.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.

The `disambiguation` option controls how out-of-range values are interpreted:
- `constrain` (the default): Infinite values are clamped to `Number.MAX_VALUE`.
  Values higher than the next highest unit (for example, 90 minutes) are left as-is.
- `balance`: Infinite values will cause the function to throw a `RangeError`.
  Values higher than the next highest unit, are converted to be in-range by incrementing the next highest unit accordingly.
  For example, 90 minutes becomes one hour and 30 minutes.
- `reject`: Infinite values will cause the function to throw a `RangeError`.
  Values higher than the next highest unit (for example, 90 minutes) are left as-is.

No matter which disambiguation mode is selected, negative values are never allowed and will cause the function to throw a `RangeError`.

> **NOTE:** Years and months can have different lengths.
In the default ISO calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days.
Therefore, any `Duration` object with nonzero years or months can refer to a different length of time depending on when the start date is.
No conversion is ever performed between years, months, and days, even in `balance` disambiguation mode, because such conversion would be ambiguous.

Usage examples:
```javascript
d = Temporal.Duration.from({ years: 1, days: 1 })  // => P1Y1D
d = Temporal.Duration.from({ days: 2, hours: 12 })  // => P2DT12H

Temporal.Duration.from(d) === d  // => true

d = Temporal.Duration.from('P1Y1D')  // => P1Y1D
d = Temporal.Duration.from('P2DT12H')  // => P2DT12H
d = Temporal.Duration.from('P0D')  // => PT0S

// Negative values are never allowed, even if overall positive:
d = Temporal.Duration.from({ hours: 1, minutes: -30 })  // throws
// FIXME https://github.com/tc39/proposal-temporal/issues/408

// Disambiguation

d = Temporal.Duration.from({ minutes: 120 }, { disambiguation: 'constrain' })  // => PT120M
d = Temporal.Duration.from({ minutes: 120 }, { disambiguation: 'balance' })  // => PT2H
d = Temporal.Duration.from({ minutes: 120 }, { disambiguation: 'reject' })  // => PT120M
```

## Properties

### duration.**years** : number

### duration.**months** : number

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
d = new Temporal.Duration(1, 2, 3, 4, 5, 6, 987, 654, 321);
d.years         // => 1
d.months        // => 2
d.days          // => 3
d.hours         // => 4
d.minutes       // => 5
d.seconds       // => 6
d.milliseconds  // => 987
d.microseconds  // => 654
d.nanoseconds   // => 321
```

## Methods

### duration.**with**(_durationLike_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `durationLike` (object): an object with some or all of the properties of a `Temporal.Duration`.
- `options` (optional object): An object with properties representing options for the copy.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object.

This method creates a new `Temporal.Duration` which is a copy of `duration`, but any properties present on `durationLike` override the ones already present on `duration`.

Since `Temporal.Duration` objects are immutable, use this method instead of modifying one.

The `disambiguation` option specifies what to do with out-of-range or overly large values.
Negative numbers are never allowed as properties of `durationLike`.
If a property of `durationLike` is infinity, then constrain mode will clamp it to `Number.MAX_VALUE`.
Reject and balance modes will throw a `RangeError` in that case.
Additionally, balance mode will behave like it does in `Duration.from()` and perform a balance operation on the result.

For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md).

Usage example:
```javascript
duration = Temporal.Duration.from({ months: 50, days: 50, hours: 50, minutes: 100 });
// Perform a balance operation using additional ISO calendar rules:
let { years, months } = duration;
years += Math.floor(months / 12);
months %= 12;
duration = duration.with({ years, months }, { disambiguation: 'balance' });
  // => P4Y2M52DT3H40M
```

### duration.**plus**(_other_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `disambiguation` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object which represents the sum of the durations of `duration` and `other`.

This method adds `other` to `duration`, resulting in a longer duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

The `disambiguation` argument tells what to do in the case where the addition results in an out-of-range value:
- In `constrain` mode (the default), additions that result in a value too large to be represented in a Number are capped at `Number.MAX_VALUE`.
- In `reject` mode, if any addition results in a value too large to be represented in a Number, a `RangeError` is thrown.

The fields of the resulting duration are never converted between each other.
If you need this behaviour, use `Duration.from()` with balance disambiguation, which will convert overly large units into the next highest unit, up to days.

For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md).

No conversion is ever performed between years, months, days, and other units, as that could be ambiguous depending on the start date.
If you need such a conversion, you must implement it yourself, since the rules can depend on the start date and the calendar in use.

Usage example:
```javascript
hour = Temporal.Duration.from('PT1H');
hour.plus({ minutes: 30 })  // => PT1H30M

// Examples of balancing:
one = Temporal.Duration.from({ hours: 1, minutes: 30 });
two = Temporal.Duration.from({ hours: 2, minutes: 45 });
result = one.plus(two)  // => PT3H75M
result.with(result, { disambiguation: 'balance' })  // => PT4H15M

fifty = Temporal.Duration.from('P50Y50M50DT50H50M50.500500500S');
result = fifty.plus(fifty)  // => P100Y100M100DT100H100M101.001001S'
// Temporal.Duration.from(result, { disambiguation: 'balance' }); - FIXME: https://github.com/tc39/proposal-temporal/issues/232
result.with(result, { disambiguation: 'balance' })
  // => P100Y100M104DT5H41M41.001001S

// Example of not balancing:
oneAndAHalfYear = Temporal.Duration.from({ years: 1, months: 6 });
result = oneAndAHalfYear.plus(oneAndAHalfYear)  // => P2Y12M
// Temporal.Duration.from(result, { disambiguation: 'balance' }); - FIXME: https://github.com/tc39/proposal-temporal/issues/232
result.with(result, { disambiguation: 'balance' })  // => P2Y12M
// Example of custom conversion using ISO calendar rules:
function monthsToYears(duration) {
    const { years, months } = duration;
    years += Math.floor(months / 12);
    months %= 12;
    return duration.with({ years, months });
}
monthsToYears(result)  // => P3Y

```

### duration.**minus**(_other_: object, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `disambiguation` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `balanceConstrain` and `balance`.
    The default is `balanceConstrain`.

**Returns:** a new `Temporal.Duration` object which represents the duration of `duration` less the duration of `other`.

This method subtracts `other` from `duration`, resulting in a shorter duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

If `other` is larger than `duration` and the subtraction would result in a negative duration, the method will throw a `RangeError`.

In order to be valid, the resulting duration must not have any negative fields.
However, it's possible to have one or more of the fields be negative while the overall duration is still positive.
For example, "4 hours and 15 minutes" minus "2 hours and 30 minutes" results in "2 hours and &minus;15 minutes".
The `disambiguation` option tells what to do in this case.
- In `balanceConstrain` mode (the default), negative fields are balanced with the next highest field so that none of the fields are negative in the result.
  If this is not possible, a `RangeError` is thrown.
- In `balance` mode, all fields are balanced with the next highest field, no matter if they are negative or not.

For usage examples and a more complete explanation of how balancing works and why it is necessary, especially for subtracting `Temporal.Duration`, see [Duration balancing](./balancing.md#duration-arithmetic).

Usage example:
```javascript
hourAndAHalf = Temporal.Duration.from('PT1H30M');
hourAndAHalf.minus({ hours: 1 })  // => PT30M

one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ seconds: 30 });
one.minus(two);  // => PT179M30S
one.minus(two, { disambiguation: 'balance' });  // => PT2H59M30S

// Example of not balancing:
threeYears = Temporal.Duration.from({ years: 3 });
oneAndAHalfYear = Temporal.Duration.from({ years: 1, months: 6 });
threeYears.minus(oneAndAHalfYear)  // throws; months are negative and cannot be balanced
// Example of a custom conversion using ISO calendar rules:
function yearsToMonths(duration) {
    const { years, months } = duration;
    months += years * 12;
    return duration.with({ years: 0, months });
}
yearsToMonths(threeYears).minus(yearsToMonths(oneAndAHalfYear))  // => P18M
```

### duration.**getFields**() : { years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number, microseconds: number, nanoseconds: number }

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
d = Temporal.Duration.from({ milliseconds: 1000 });
d.toString();  // => PT1S

// The output format always balances units under 1 s, even if the
// underlying Temporal.Duration object doesn't.
nobal = Temporal.Duration.from({ milliseconds: 3500 });
console.log(`${nobal}`, nobal.seconds, nobal.milliseconds);  // => PT3.500S 0 3500
bal = Temporal.Duration.from({ milliseconds: 3500 }, { disambiguation: 'balance'});
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

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

Usage examples:
```javascript
d = Temporal.Duration.from('P1DT6H30M')
d.toLocaleString()  // => 1 day 6 hours 30 minutes
d.toLocaleString('de-DE')  // => 1 Tag 6 Stunden 30 Minuten
d.toLocaleString('en-US', {day: 'numeric', hour: 'numeric'})  // => 1 day 6 hours
```
