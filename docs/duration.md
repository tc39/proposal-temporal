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

### Temporal.Duration.**from**(_thing_: string | object, _options_?: object) : Temporal.Duration

**Parameters:**
- `thing` (string or object): A `Duration`-like object or a string from which to create a `Temporal.Duration`.
- `options` (optional object): An object with properties representing options for constructing the duration.
  The following options are recognized:
  - `disambiguation` (optional string): How to disambiguate if any of the other arguments are out of range.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Duration` object.

This static method creates a new duration from another value.
The value can be a string in the ISO 8601 format described above.
Or, if the value is an object, it can either be another `Temporal.Duration` object, or a plain object with properties `years`, `months`, etc.

When creating a duration from an object, this function is often more readable to use than `new Temporal.Duration()` because the names of the properties are visible in the code.

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

### duration.**toString**() : string

**Returns:** the duration as an ISO 8601 string.

This method overrides `Object.prototype.toString()` and provides the ISO 8601 description of the duration.

> **NOTE**: If any of the `milliseconds`, `microseconds`, or `nanoseconds` properties are greater than 999, then `Temporal.Duration.from(duration.toString())` will not yield an identical `Temporal.Duration` object.
> The returned object will represent an identical duration, but the sub-second fields will be balanced with the `seconds` field so that they become 999 or less.
> For example, 1000 nanoseconds will become 1 microsecond.
>
> This is because the ISO 8601 string format for durations does not allow for specifying sub-second units separately, only as a decimal fraction of seconds.
> If you need to serialize a `Temporal.Duration` in a way that will preserve unbalanced sub-second fields, you will need to use a custom serialization format.

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

This method uses `toString()` to usefully serialize `Temporal.Duration` objects during JSON serialization to a value that can be reconstructed during deserialization.

> **NOTE**: The same caution about `milliseconds`, `microseconds`, or `nanoseconds` greater than 999 applies to this method as well.

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
