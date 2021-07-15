# Temporal.Duration

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Duration` represents a duration of time which can be used in date/time arithmetic.

`Temporal.Duration` can be constructed directly or returned from `Temporal.Duration.from()`.
It can also be obtained from the `since()` method of any other `Temporal` type that supports arithmetic, and is used in those types' `add()` and `subtract()` methods.

When printed, a `Temporal.Duration` produces a string according to the ISO 8601 notation for durations.
The examples in this page use this notation extensively.

Briefly, the ISO 8601 notation consists of a `P` character, followed by years, months, weeks, and days, followed by a `T` character, followed by hours, minutes, and seconds with a decimal part, each with a single-letter suffix that indicates the unit.
Any zero components may be omitted.
For more detailed information, see the ISO 8601 standard or the [Wikipedia page](https://en.wikipedia.org/wiki/ISO_8601#Durations).

| ISO 8601             | Meaning                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| **P1Y1M1DT1H1M1.1S** | One year, one month, one day, one hour, one minute, one second, and 100 milliseconds |
| **P40D**             | Forty days                                                                           |
| **P1Y1D**            | A year and a day                                                                     |
| **P3DT4H59M**        | Three days, four hours and 59 minutes                                                |
| **PT2H30M**          | Two and a half hours                                                                 |
| **P1M**              | One month                                                                            |
| **PT1M**             | One minute                                                                           |
| **PT0.0021S**        | 2.1 milliseconds (two milliseconds and 100 microseconds)                             |
| **PT0S**             | Zero                                                                                 |
| **P0D**              | Zero                                                                                 |

> **NOTE:** According to the ISO 8601-1 standard, weeks are not allowed to appear together with any other units, and durations can only be positive.
> As extensions to the standard, ISO 8601-2 allows a sign character at the start of the string, and allows combining weeks with other units.
> If you intend to use a string such as **P3W1D**, **+P1M**, or **-P1M** for interoperability, note that other programs may not accept it.

## Constructor

### **new Temporal.Duration**(_years_?: number, _months_?: number, _weeks_?: number, _days_?: number, _hours_?: number, _minutes_?: number, _seconds_?: number, _milliseconds_?: number, _microseconds_?: number, _nanoseconds_?: number) : Temporal.Duration

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
new Temporal.Duration(1, 2, 3, 4, 5, 6, 7, 987, 654, 321); // => P1Y2M3W4DT5H6M7.987654321S
new Temporal.Duration(0, 0, 0, 40); // => P40D
new Temporal.Duration(undefined, undefined, undefined, 40); // => P40D
new Temporal.Duration(); // => PT0S
```

## Static methods

### Temporal.Duration.**from**(_thing_: any) : Temporal.Duration

**Parameters:**

- `thing`: A `Duration`-like object or a string from which to create a `Temporal.Duration`.

**Returns:** a new `Temporal.Duration` object.

This static method creates a new `Temporal.Duration` from another value.
If the value is another `Temporal.Duration` object, a new object representing the same duration is returned.
If the value is any other object, a `Temporal.Duration` will be constructed from the values of any `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `microseconds`, and `nanoseconds` properties that are present.
Any missing ones will be assumed to be 0.

All non-zero values must have the same sign, and must not be infinite.
Otherwise, the function will throw a `RangeError`.

Any non-object value is converted to a string, which is expected to be in ISO 8601 format.

> **NOTE:** This function understands strings where weeks and other units are combined, and strings with a single sign character at the start, which are extensions to the ISO 8601 standard described in ISO 8601-2.
> For example, `P3W1D` is understood to mean three weeks and one day, `-P1Y1M` is a negative duration of one year and one month, and `+P1Y1M` is one year and one month.
> If no sign character is present, then the sign is assumed to be positive.

Usage examples:

```javascript
d = Temporal.Duration.from({ years: 1, days: 1 }); // => P1Y1D
d = Temporal.Duration.from({ days: -2, hours: -12 }); // => -P2DT12H

Temporal.Duration.from(d) === d; // => false

d = Temporal.Duration.from('P1Y1D'); // => P1Y1D
d = Temporal.Duration.from('-P2DT12H'); // => -P2DT12H
d = Temporal.Duration.from('P0D'); // => PT0S

// Mixed-sign values are never allowed, even if overall positive:
/* WRONG */ d = Temporal.Duration.from({ hours: 1, minutes: -30 }); // => throws
```

### Temporal.Duration.**compare**(_one_: Temporal.Duration | object | string, _two_: Temporal.Duration | object | string, _options_?: object) : number

**Parameters:**

- `one` (`Temporal.Duration` or value convertible to one): First duration to compare.
- `two` (`Temporal.Duration` or value convertible to one): Second duration to compare.
- `options` (object): An object with properties representing options for the operation.
  The following option is recognized:
  - `relativeTo` (`Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, or value convertible to one of those): The starting point to use when converting between years, months, weeks, and days.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.Duration` objects.
Returns an integer indicating whether `one` is shorter or longer or is equal to `two`.

- &minus;1 if `one` is shorter than `two`;
- 0 if `one` and `two` are equally long;
- 1 if `one` is longer than `two`.

If `one` and `two` are not `Temporal.Duration` objects, then they will be converted to one as if they were passed to `Temporal.Duration.from()`.

If any of the `years`, `months`, or `weeks` properties of either of the durations are nonzero, then the `relativeTo` option is required, since comparing durations with years, months, or weeks requires a point on the calendar to figure out how long they are.

Negative durations are treated as the same as negative numbers for comparison purposes: they are "less" (shorter) than zero.

The `relativeTo` option may be a `Temporal.ZonedDateTime` in which case time zone offset changes will be taken into account when comparing days with hours. If `relativeTo` is a `Temporal.PlainDateTime`, then days are always considered equal to 24 hours.

If `relativeTo` is neither a `Temporal.PlainDateTime` nor a `Temporal.ZonedDateTime`, then it will be converted to one of the two, as if it were first attempted with `Temporal.ZonedDateTime.from()` and then with `Temporal.PlainDateTime.from()`.
This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a `timeZone` property, will be converted to a `Temporal.ZonedDateTime`, and an ISO 8601 string without a time zone name or a property bag without a `timeZone` property will be converted to a `Temporal.PlainDateTime`.

This function can be used to sort arrays of `Temporal.Duration` objects.
For example:

```javascript
one = Temporal.Duration.from({ hours: 79, minutes: 10 });
two = Temporal.Duration.from({ days: 3, hours: 7, seconds: 630 });
three = Temporal.Duration.from({ days: 3, hours: 6, minutes: 50 });
sorted = [one, two, three].sort(Temporal.Duration.compare);
sorted.join(' ');
// => 'P3DT6H50M PT79H10M P3DT7H630S'

// Sorting relative to a date, taking DST changes into account:
relativeTo = Temporal.ZonedDateTime.from('2020-11-01T00:00-07:00[America/Los_Angeles]');
sorted = [one, two, three].sort((one, two) => Temporal.Duration.compare(one, two, { relativeTo }));
sorted.join(' ');
// => 'PT79H10M P3DT6H50M P3DT7H630S'
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

<!-- prettier-ignore-start -->
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
<!-- prettier-ignore-end -->

### duration.**sign** : number

The read-only `sign` property has the value –1, 0, or 1, depending on whether the duration is negative, zero, or positive.

### duration.**blank** : boolean

The read-only `blank` property is a convenience property that tells whether `duration` represents a zero length of time.
In other words, `duration.blank === (duration.sign === 0)`.

Usage example:

```javascript
d = Temporal.Duration.from('PT0S');
d.blank; // => true

d = Temporal.Duration.from({ days: 0, hours: 0, minutes: 0 });
d.blank; // => true
```

## Methods

### duration.**with**(_durationLike_: object) : Temporal.Duration

**Parameters:**

- `durationLike` (object): an object with some or all of the properties of a `Temporal.Duration`.

**Returns:** a new `Temporal.Duration` object.

This method creates a new `Temporal.Duration` which is a copy of `duration`, but any properties present on `durationLike` override the ones already present on `duration`.

Since `Temporal.Duration` objects each represent a fixed duration, use this method instead of modifying one.

All non-zero properties of `durationLike` must have the same sign, and they must additionally have the same sign as the non-zero properties of `duration`, unless they override all of these non-zero properties.
If a property of `durationLike` is infinity, then this function will throw a `RangeError`.

Usage example:

<!-- prettier-ignore-start -->
```javascript
duration = Temporal.Duration.from({ months: 50, days: 50, hours: 50, minutes: 100 });
// Perform a balance operation using additional ISO calendar rules:
let { years, months } = duration;
years += Math.floor(months / 12);
months %= 12;
duration = duration.with({ years, months });
  // => P4Y2M50DT50H100M
```
<!-- prettier-ignore-end -->

### duration.**add**(_other_: Temporal.Duration | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.Duration` or value convertible to one): The duration to add.
- `options` (optional object): An object with properties representing options for the addition.
  The following option is recognized:
  - `relativeTo` (`Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, or value convertible to one of those): The starting point to use when adding years, months, weeks, and days.

**Returns:** a new `Temporal.Duration` object which represents the sum of the durations of `duration` and `other`.

This method adds `other` to `duration`, resulting in a longer duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `other` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

In order to be valid, the resulting duration must not have fields with mixed signs, and so the result is balanced.
For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md).

By default, you cannot add durations with years, months, or weeks, as that could be ambiguous depending on the start date.
To do this, you must provide a start date using the `relativeTo` option.

The `relativeTo` option may be a `Temporal.ZonedDateTime` in which case time zone offset changes will be taken into account when converting between days and hours. If `relativeTo` is omitted or is a `Temporal.PlainDateTime`, then days are always considered equal to 24 hours.

If `relativeTo` is neither a `Temporal.PlainDateTime` nor a `Temporal.ZonedDateTime`, then it will be converted to one of the two, as if it were first attempted with `Temporal.ZonedDateTime.from()` and then with `Temporal.PlainDateTime.from()`.
This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a `timeZone` property, will be converted to a `Temporal.ZonedDateTime`, and an ISO 8601 string without a time zone name or a property bag without a `timeZone` property will be converted to a `Temporal.PlainDateTime`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

<!-- prettier-ignore-start -->

```javascript
hour = Temporal.Duration.from('PT1H');
hour.add({ minutes: 30 }); // => PT1H30M

// Examples of balancing:
one = Temporal.Duration.from({ hours: 1, minutes: 30 });
two = Temporal.Duration.from({ hours: 2, minutes: 45 });
result = one.add(two); // => PT4H15M

fifty = Temporal.Duration.from('P50Y50M50DT50H50M50.500500500S');
/* WRONG */ result = fifty.add(fifty); // => throws, need relativeTo
result = fifty.add(fifty, { relativeTo: '1900-01-01' }); // => P108Y7M12DT5H41M41.001001S

// Example of converting ambiguous units relative to a start date
oneAndAHalfMonth = Temporal.Duration.from({ months: 1, days: 15 });
/* WRONG */ oneAndAHalfMonth.add(oneAndAHalfMonth); // => throws
oneAndAHalfMonth.add(oneAndAHalfMonth, { relativeTo: '2000-02-01' }); // => P3M
oneAndAHalfMonth.add(oneAndAHalfMonth, { relativeTo: '2000-03-01' }); // => P2M30D
```

<!-- prettier-ignore-start -->

### duration.**subtract**(_other_: Temporal.Duration | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.Duration` or value convertible to one): The duration to subtract.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following option is recognized:
  - `relativeTo` (`Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, or value convertible to one of those): The starting point to use when adding years, months, weeks, and days.

**Returns:** a new `Temporal.Duration` object which represents the duration of `duration` less the duration of `other`.

This method subtracts `other` from `duration`, resulting in a shorter duration.

The `other` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

If `other` is larger than `duration` and the subtraction would result in a negative duration, the method will throw a `RangeError`.

In order to be valid, the resulting duration must not have fields with mixed signs, and so the result is balanced.
For usage examples and a more complete explanation of how balancing works and why it is necessary, see [Duration balancing](./balancing.md#duration-arithmetic).

By default, you cannot subtract durations with years, months, or weeks, as that could be ambiguous depending on the start date.
To do this, you must provide a start date using the `relativeTo` option.

The `relativeTo` option may be a `Temporal.ZonedDateTime` in which case time zone offset changes will be taken into account when converting between days and hours. If `relativeTo` is omitted or is a `Temporal.PlainDateTime`, then days are always considered equal to 24 hours.

If `relativeTo` is neither a `Temporal.PlainDateTime` nor a `Temporal.ZonedDateTime`, then it will be converted to one of the two, as if it were first attempted with `Temporal.ZonedDateTime.from()` and then with `Temporal.PlainDateTime.from()`.
This means that an ISO 8601 string with a time zone name annotation in it, or a property bag with a `timeZone` property, will be converted to a `Temporal.ZonedDateTime`, and an ISO 8601 string without a time zone name or a property bag without a `timeZone` property will be converted to a `Temporal.PlainDateTime`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
hourAndAHalf = Temporal.Duration.from('PT1H30M');
hourAndAHalf.subtract({ hours: 1 }); // => PT30M

one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ seconds: 30 });
one.subtract(two); // => PT179M30S
one.subtract(two).round({ largestUnit: 'hour' }); // => PT2H59M30S

// Example of converting ambiguous units relative to a start date
threeMonths = Temporal.Duration.from({ months: 3 });
oneAndAHalfMonth = Temporal.Duration.from({ months: 1, days: 15 });
/* WRONG */ threeMonths.subtract(oneAndAHalfMonth); // => throws
threeMonths.subtract(oneAndAHalfMonth, { relativeTo: '2000-02-01' }); // => P1M16D
threeMonths.subtract(oneAndAHalfMonth, { relativeTo: '2000-03-01' }); // => P1M15D
```

### duration.**negated**() : Temporal.Duration

**Returns:** a new `Temporal.Duration` object with the opposite sign.

This method gives the negation of `duration`.
It returns a newly constructed `Temporal.Duration` with all the fields having the opposite sign (positive if negative, and vice versa.)
If `duration` is zero, then the returned object is a copy of `duration`.

Usage example:

```javascript
d = Temporal.Duration.from('P1Y2M3DT4H5M6.987654321S');
d.sign; // 1
d.negated(); // -P1Y2M3DT4H5M6.987654321S
d.negated().sign; // -1
```

### duration.**abs**() : Temporal.Duration

**Returns:** a new `Temporal.Duration` object that is always positive.

This method gives the absolute value of `duration`.
It returns a newly constructed `Temporal.Duration` with all the fields having the same magnitude as those of `duration`, but positive.
If `duration` is already positive or zero, then the returned object is a copy of `duration`.

Usage example:

```javascript
d = Temporal.Duration.from('-PT8H30M');
d.abs(); // PT8H30M
```

### duration.**round**(_options_: object) : Temporal.Duration

**Parameters:**

- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'nanosecond'`, i.e. no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'halfExpand'`, `'ceil'`, `'trunc'`, and `'floor'`.
    The default is `'halfExpand'`.
  - `relativeTo` (`Temporal.PlainDateTime`): The starting point to use when converting between years, months, weeks, and days.
    It must be a `Temporal.PlainDateTime`, or a value that can be passed to `Temporal.PlainDateTime.from()`.

**Returns:** a new `Temporal.Duration` object which is `duration`, rounded and/or balanced.

Rounds and/or balances `duration` to the given largest and smallest units and rounding increment, and returns the result as a new `Temporal.Duration` object.

The `largestUnit` determines the largest unit allowed in the result.
It will cause units larger than `largestUnit` to be converted into smaller units, and units smaller than `largestUnit` to be converted into larger units as much as possible.
For example, with `largestUnit: 'minute'`, a duration of 1 hour and 125 seconds will be converted into a duration of 62 minutes and 5 seconds.
These durations are equally long, so no rounding takes place, but they are expressed differently.
This operation is called "balancing."

For usage examples and a more complete explanation of how balancing works, see [Duration balancing](./balancing.md).

A `largestUnit` value of `'auto'`, which is the default if only `smallestUnit` is given, means that `largestUnit` should be the largest nonzero unit in the duration that is larger than `smallestUnit`.
For example, in a duration of 3 days and 12 hours, `largestUnit: 'auto'` would mean the same as `largestUnit: 'day'`.
This behavior implies that the default balancing behaviour of this method to not 'grow' the duration beyond its current largest unit unless needed for rounding.

The `smallestUnit` option determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
The default, if only `largestUnit` is given, is to do no rounding.

At least one of `largestUnit` or `smallestUnit` is required.

Converting between years, months, weeks, and other units requires a reference point.
If `largestUnit` or `smallestUnit` is years, months, or weeks, or the duration has nonzero years, months, or weeks, then the `relativeTo` option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

Unless `smallestUnit` is years, months, weeks, or days, the value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
For example, if `smallestUnit` is `'minute'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.

The `roundingMode` option controls how the rounding is performed.

- `halfExpand`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round away from zero like `ceil` for positive durations and like `floor` for negative durations.
- `ceil`: Always round towards positive infinity.
  For negative durations this option will decrease the absolute value of the duration which may be unexpected.
  To round away from zero, use `ceil` for positive durations and `floor` for negative durations.
- `trunc`: Always round towards zero, chopping off the part after the decimal point.
- `floor`: Always round down, towards negative infinity.
  This mode acts the same as `trunc` for positive durations but for negative durations it will increase the absolute value of the result which may be unexpected.
  For this reason, `trunc` is recommended for most "round down" use cases.

The `relativeTo` option gives the starting point used when converting between or rounding to years, months, weeks, or days.
It is a `Temporal.PlainDateTime` instance.
If any other type of value is given, then it will be converted to a `Temporal.PlainDateTime` as if it were passed to `Temporal.PlainDateTime.from(..., { overflow: 'reject' })`.
A `Temporal.PlainDate` or a date string like `2020-01-01` is also accepted because time is optional when creating a `Temporal.PlainDateTime`.

Example usage:

```javascript
// Balance a duration as far as possible without knowing a starting point
d = Temporal.Duration.from({ minutes: 130 });
d.round({ largestUnit: 'day' }); // => PT2H10M

// Round to the nearest unit
d = Temporal.Duration.from({ minutes: 10, seconds: 52 });
d.round({ smallestUnit: 'minute' }); // => PT11M
d.round({ smallestUnit: 'minute', roundingMode: 'trunc' }); // => PT10M

// How many seconds in a multi-unit duration?
d = Temporal.Duration.from('PT2H34M18S');
d.round({ largestUnit: 'second' }).seconds; // => 9258

// Normalize, with and without taking DST into account
d = Temporal.Duration.from({ hours: 2756 });
d.round({
  relativeTo: '2020-01-01T00:00+01:00[Europe/Rome]',
  largestUnit: 'year'
}); // => P114DT21H
// (one hour longer because DST skipped an hour)
d.round({
  relativeTo: '2020-01-01',
  largestUnit: 'year'
}); // => P114DT20H
// (one hour shorter if ignoring DST)

// Normalize days into months or years
d = Temporal.Duration.from({ days: 190 });
refDate = Temporal.PlainDate.from('2020-01-01');
d.round({ relativeTo: refDate, largestUnit: 'year' }); // => P6M8D

// Same, but in a different calendar system
d.round({
  relativeTo: refDate.withCalendar('hebrew'),
  largestUnit: 'year'
}); // => P6M13D

// Round a duration up to the next 5-minute billing period
d = Temporal.Duration.from({ minutes: 6 });
d.round({
  smallestUnit: 'minute',
  roundingIncrement: 5,
  roundingMode: 'ceil'
}); // => PT10M

// How many full 3-month quarters of this year, are in this duration?
d = Temporal.Duration.from({ months: 10, days: 15 });
d = d.round({
  smallestUnit: 'month',
  roundingIncrement: 3,
  roundingMode: 'trunc',
  relativeTo: Temporal.Now.plainDateISO()
});
quarters = d.months / 3;
quarters; // => 3
```

### duration.**total**(_options_: object) : number

**Parameters:**

- `options` (object): An object with properties representing options for the operation.
  The following options are recognized:
  - `unit` (string): The unit of time that will be returned.
    Valid values are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    There is no default; `unit` is required.
  - `relativeTo` (`Temporal.PlainDateTime`): The starting point to use when converting between years, months, weeks, and days.
    It must be a `Temporal.PlainDateTime`, or a value that can be passed to `Temporal.PlainDateTime.from()`.

**Returns:** a floating-point number representing the number of desired units in the `Temporal.Duration`.

Calculates the number of units of time that can fit in a particular `Temporal.Duration`.
If the duration IS NOT evenly divisible by the desired unit, then a fractional remainder will be present in the result.
If the duration IS evenly divisible by the desired unit, then the integer result will be identical to `duration.round({ smallestUnit: unit, largestUnit: unit, relativeTo })[unit]`.

Interpreting years, months, or weeks requires a reference point.
Therefore, `unit` is `'year'`, `'month'`, or `'week'`, or the duration has nonzero 'year', 'month', or 'week', then the `relativeTo` option is required.

The `relativeTo` option gives the starting point used when converting between or rounding to years, months, weeks, or days.
It is a `Temporal.PlainDateTime` instance.
If any other type is provided, then it will be converted to a `Temporal.PlainDateTime` as if it were passed to `Temporal.PlainDateTime.from(..., { overflow: 'reject' })`.
A `Temporal.PlainDate` or a date string like `2020-01-01` is also accepted because time is optional when creating a `Temporal.PlainDateTime`.

Example usage:

```javascript
// How many seconds in 18 hours and 20 minutes?
d = Temporal.Duration.from({ hours: 130, minutes: 20 });
d.total({ unit: 'second' }); // => 469200

// How many 24-hour days is 123456789 seconds?
d = Temporal.Duration.from('PT123456789S');
d.total({ unit: 'day' }); // 1428.8980208333332

// Find totals in months, with and without taking DST into account
d = Temporal.Duration.from({ hours: 2756 });
d.total({
  relativeTo: '2020-01-01T00:00+01:00[Europe/Rome]',
  unit: 'month'
}); // => 3.7958333333333334
d.total({
  unit: 'month',
  relativeTo: '2020-01-01'
}); // => 3.7944444444444443
```

### duration.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'trunc'`, and `'halfExpand'`.
    The default is `'trunc'`.

**Returns:** the duration as an ISO 8601 string.

This method overrides `Object.prototype.toString()` and provides the ISO 8601 description of the duration.

> **NOTE**: If any of `duration.milliseconds`, `duration.microseconds`, or `duration.nanoseconds` are over 999, then deserializing from the result of `duration.toString()` will yield an equal but different object.
> See [Duration balancing](./balancing.md#serialization) for more information.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.Duration.round()`.
Note that rounding may change the value of other units as well.

Usage examples:

```javascript
d = Temporal.Duration.from({ years: 1, days: 1 });
d.toString(); // => P1Y1D
d = Temporal.Duration.from({ years: -1, days: -1 });
d.toString(); // => -P1Y1D
d = Temporal.Duration.from({ milliseconds: 1000 });
d.toString(); // => PT1S

// The output format always balances units under 1 s, even if the
// underlying Temporal.Duration object doesn't.
nobal = Temporal.Duration.from({ milliseconds: 3500 });
console.log(`${nobal}`, nobal.seconds, nobal.milliseconds); // => 'PT3.5S 0 3500'
bal = nobal.round({ largestUnit: 'year' }); // balance through round
console.log(`${bal}`, bal.seconds, bal.milliseconds); // => 'PT3.5S 3 500'

d = Temporal.Duration.from('PT59.999999999S');
d.toString({ smallestUnit: 'second' }); // => PT59S
d.toString({ fractionalSecondDigits: 0 }); // => PT59S
d.toString({ fractionalSecondDigits: 4 }); // => PT59.9999S
d.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' });
// => PT60.00000000S
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
  banDuration: Temporal.Duration.from({ hours: 48 })
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
  if (key.endsWith('Duration')) return Temporal.Duration.from(value);
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
d = Temporal.Duration.from('P1DT6H30M');
d.toLocaleString(); // example output: '1 day 6 hours 30 minutes'
d.toLocaleString('de-DE'); // example output: '1 Tag 6 Stunden 30 Minuten'
d.toLocaleString('en-US', { day: 'numeric', hour: 'numeric' }); // example output: '1 day 6 hours'
```

### duration.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.Duration` objects with the relational operators `<`, `<=`, `>`, or `>=`.
