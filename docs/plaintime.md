# Temporal.PlainTime

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.PlainTime` represents a wall-clock time, with a precision in nanoseconds, and without any time zone.
"Wall-clock time" refers to the concept of a time as expressed in everyday usage &mdash; the time that you read off the clock on the wall.
For example, it could be used to represent an event that happens daily at a certain time, no matter what time zone.

`Temporal.PlainTime` refers to a time with no associated calendar date; if you need to refer to a specific time on a specific day, use `Temporal.PlainDateTime`.

## Constructor

### **new Temporal.PlainTime**(_isoHour_: number = 0, _isoMinute_: number = 0, _isoSecond_: number = 0, _isoMillisecond_: number = 0, _isoMicrosecond_: number = 0, _isoNanosecond_: number = 0) : Temporal.PlainTime

**Parameters:**

- `isoHour` (optional number): An hour of the day, ranging between 0 and 23 inclusive.
- `isoMinute` (optional number): A minute, ranging between 0 and 59 inclusive.
- `isoSecond` (optional number): A second, ranging between 0 and 59 inclusive.
- `isoMillisecond` (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
- `isoMicrosecond` (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
- `isoNanosecond` (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.

**Returns:** a new `Temporal.PlainTime` object.

Use this constructor if you have the correct parameters for the time already as individual number values in the ISO 8601 calendar.
Otherwise, `Temporal.PlainTime.from()`, which accepts more kinds of input and allows controlling the overflow behavior, is probably more convenient.

All values are given as reckoned in the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates).

Usage examples:

```javascript
// Leet hour
time = new Temporal.PlainTime(13, 37); // => 13:37:00
```

## Static methods

### Temporal.PlainTime.**from**(_item_: Temporal.PlainTime | object | string, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `item`: a value convertible to a `Temporal.PlainTime`.
- `options` (optional object): An object with properties representing options for constructing the time.
  The following options are recognized:
  - `overflow` (optional string): How to deal with out-of-range values if `item` is an object.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainTime` object.

This static method creates a new `Temporal.PlainTime` object from another value.
If the value is another `Temporal.PlainTime` object, a new object representing the same time is returned.
If the value is any other object, a `Temporal.PlainTime` will be constructed from the values of any `hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond` properties that are present.
Any missing ones will be assumed to be 0.

If the `calendar` property is present, it must be the string `'iso8601'` or the [ISO 8601 calendar](https://en.wikipedia.org/wiki/ISO_8601#Dates), for future compatibility.

If the value is not an object, it must be a string, which is expected to be in ISO 8601 format.
If the string designates a date, it will be ignored.
Time zone or UTC offset information will also be ignored, with one exception: if a string contains a `Z` in place of a numeric UTC offset, then a `RangeError` will be thrown because interpreting these strings as a local time is usually a bug. `Temporal.Instant.from` should be used instead to parse these strings, and the result's `toZonedDateTimeISO` method can be used to obtain a timezone-local date and time.

In unusual cases of needing date or time components of `Z`-terminated timestamp strings (e.g. daily rollover of a UTC-timestamped log file), use the time zone `'UTC'`. For example, the following code returns a "UTC time": `Temporal.Instant.from(item).toZonedDateTimeISO('UTC').toPlainTime()`.

The `overflow` option works as follows, if `item` is an object:

- In `'constrain'` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `'reject'` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

The `overflow` option is ignored if `item` is a string.

> **NOTE**: Although Temporal does not deal with leap seconds, times coming from other software may have a `second` value of 60.
> In the default `'constrain'` mode, this will be converted to 59.
> In `'reject'` mode, the constructor will throw, so if you have to interoperate with times that may contain leap seconds, don't use `'reject'`.
> However, if parsing an ISO 8601 string with a seconds component of `:60`, then it will always result in a `second` value of 59, in accordance with POSIX.

Example usage:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('032430'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30'); // => 03:24:30
time = Temporal.PlainTime.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => 03:24:30
  // (same as above; time zone is ignored)
time === Temporal.PlainTime.from(time); // => false

time = Temporal.PlainTime.from({
  hour: 19,
  minute: 39,
  second: 9,
  millisecond: 68,
  microsecond: 346,
  nanosecond: 205
}); // => 19:39:09.068346205
time = Temporal.PlainTime.from({ hour: 19, minute: 39, second: 9 }); // => 19:39:09
time = Temporal.PlainTime.from(Temporal.PlainDateTime.from('2020-02-15T19:39:09'));
  // => 19:39:09
  // (same as above; Temporal.PlainDateTime has hour, minute, etc. properties)

// Different overflow modes
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'constrain' });
  // => 15:59:00
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'constrain' });
  // => 15:00:00
time = Temporal.PlainTime.from({ hour: 15, minute: 60 }, { overflow: 'reject' });
  // => throws
time = Temporal.PlainTime.from({ hour: 15, minute: -1 }, { overflow: 'reject' });
  // => throws
```
<!-- prettier-ignore-end -->

### Temporal.PlainTime.**compare**(_one_: Temporal.PlainTime | object | string, _two_: Temporal.PlainTime | object | string) : number

**Parameters:**

- `one` (`Temporal.PlainTime` or value convertible to one): First time to compare.
- `two` (`Temporal.PlainTime` or value convertible to one): Second time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.PlainTime` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.

- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

If `one` and `two` are not `Temporal.PlainTime` objects, then they will be converted to one as if they were passed to `Temporal.PlainTime.from()`.

This function can be used to sort arrays of `Temporal.PlainTime` objects.
For example:

```javascript
one = Temporal.PlainTime.from('03:24');
two = Temporal.PlainTime.from('01:24');
three = Temporal.PlainTime.from('01:24:05');
sorted = [one, two, three].sort(Temporal.PlainTime.compare);
sorted.join(' '); // => '01:24:00 01:24:05 03:24:00'
```

Note that time zone offset transitions (like when Daylight Saving Time starts or ends ends) can produce unexpected results when comparing times, because clock times can be skipped or repeated.
Therefore, `Temporal.ZonedDateTime.compare` (not `Temporal.PlainTime.compare`) should be used if the caller's actual intent is to compare specific instants, e.g. arrivals of two airplane flights.
For example:

```javascript
// Backward transitions will repeat clock times
zdtDst = Temporal.ZonedDateTime.from('2020-11-01T01:45-07:00[America/Los_Angeles]');
zdtStandard = Temporal.ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]');
// The "first" 1:45 (in Daylight Time) is earlier than the "second" 1:30 (in Standard Time)
Temporal.ZonedDateTime.compare(zdtDst, zdtStandard); // => -1
// 1:45 is later than 1:30 when looking at a wall clock
Temporal.PlainTime.compare(zdtDst, zdtStandard); // => 1

// Forward transitions will skip clock times. Skipped times will be disambiguated.
zdtBase = Temporal.ZonedDateTime.from('2020-03-08[America/Los_Angeles]');
timeSkipped = Temporal.PlainTime.from('02:30');
timeValid = Temporal.PlainTime.from('03:30');
zdtSkipped = zdtBase.withPlainTime(timeSkipped);
zdtValid = zdtBase.withPlainTime(timeValid);
// The skipped time 2:30AM is disambiguated to 3:30AM, so the instants are equal
Temporal.ZonedDateTime.compare(zdtSkipped, zdtValid); // => 0
// 2:30 is earlier than 3:30 on a wall clock
Temporal.PlainTime.compare(timeSkipped, timeValid); // => -1
```

## Properties

### time.**hour**: number

### time.**minute**: number

### time.**second**: number

### time.**millisecond**: number

### time.**microsecond**: number

### time.**nanosecond**: number

The above read-only properties allow accessing each component of the time individually.

Usage examples:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.hour;        // => 19
time.minute;      // => 39
time.second;      // => 9
time.millisecond; // => 68
time.microsecond; // => 346
time.nanosecond;  // => 205
```
<!-- prettier-ignore-end -->

## Methods

### time.**with**(_timeLike_: object, _options_?: object) : Temporal.PlainTime

**Parameters:**

- `timeLike` (object): an object with some or all of the properties of a `Temporal.PlainTime`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `overflow` (string): How to deal with out-of-range values.
    Allowed values are `'constrain'` and `'reject'`.
    The default is `'constrain'`.

**Returns:** a new `Temporal.PlainTime` object.

This method creates a new `Temporal.PlainTime` which is a copy of `time`, but any properties present on `timeLike` override the ones already present on `time`.

Since `Temporal.PlainTime` objects each represent a fixed time, use this method instead of modifying one.

> **NOTE**: `calendar` and `timeZone` properties are not allowed on `timeLike`.
> See the `toPlainDateTime` and `toZonedDateTime` methods instead.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
// What's the top of the next hour?
time.add({ hours: 1 }).with({
  minute: 0,
  second: 0,
  millisecond: 0,
  microsecond: 0,
  nanosecond: 0
}); // => 20:00:00
```

### time.**add**(_duration_: Temporal.Duration | object | string) : Temporal.PlainTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to add.

**Returns:** a new `Temporal.PlainTime` object which is the time indicated by `time` plus `duration`.

This method adds `duration` to `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.add({ minutes: 5, nanoseconds: 800 }); // => 19:44:09.068347005
```

### time.**subtract**(_duration_: Temporal.Duration | object | string) : Temporal.PlainTime

**Parameters:**

- `duration` (`Temporal.Duration` or value convertible to one): The duration to subtract.

**Returns:** a new `Temporal.PlainTime` object which is the time indicated by `time` minus `duration`.

This method subtracts `duration` from `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a string such as `PT5H30M`, or a `Temporal.Duration` object.
If `duration` is not a `Temporal.Duration` object, then it will be converted to one as if it were passed to `Temporal.Duration.from()`.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Usage example:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
time.subtract({ minutes: 5, nanoseconds: 800 }); // => 19:34:09.068345405
```

### time.**until**(_other_: Temporal.PlainTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time until when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time after `time` and until `other`.

This method computes the difference between the two times represented by `time` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is earlier than `time` then the resulting duration will be negative.
If using the default `options`, adding the returned `Temporal.Duration` to `time` will yield `other`.

If `other` is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

The `largestUnit` parameter controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `'second'`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `'hour'`.
A value of `'auto'` means `'hour'`.

You can round the result using the `smallestUnit`, `roundingIncrement`, and `roundingMode` options.
These behave as in the `Temporal.Duration.round()` method.
The default is to do no rounding.

Usage example:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('20:13:20.971398099');
time.until(Temporal.PlainTime.from('22:39:09.068346205')); // => PT2H25M48.096948106S
time.until(Temporal.PlainTime.from('19:39:09.068346205')); // => -PT34M11.903051894S

// Rounding, for example if you don't care about sub-seconds
time.until(Temporal.PlainTime.from('22:39:09.068346205'), { smallestUnit: 'second' });
  // => PT2H25M48S
```
<!-- prettier-ignore-end -->

### time.**since**(_other_: Temporal.PlainTime | object | string, _options_?: object) : Temporal.Duration

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time since when to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'auto'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to round to in the resulting `Temporal.Duration` object.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    The default is `'nanosecond'`, i.e., no rounding.
  - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
    The default is 1.
  - `roundingMode` (string): How to handle the remainder, if rounding.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`, which truncates any remainder towards zero.

**Returns:** a `Temporal.Duration` representing the elapsed time before `time` and since `other`.

This method computes the difference between the two times represented by `time` and `other`, optionally rounds it, and returns it as a `Temporal.Duration` object.
If `other` is later than `time` then the resulting duration will be negative.

This method is similar to `Temporal.PlainTime.prototype.until()`, but reversed.
If using the default `options`, subtracting the returned `Temporal.Duration` from `time` will yield `other`, and `time1.since(time2)` will yield the same result as `time1.until(time2).negated()`.

Usage example:

```javascript
time = Temporal.PlainTime.from('20:13:20.971398099');
time.since(Temporal.PlainTime.from('19:39:09.068346205')); // => PT34M11.903051894S
time.since(Temporal.PlainTime.from('22:39:09.068346205')); // => -PT2H25M48.096948106S
```

### time.**round**(_roundTo_: string | object) : Temporal.PlainTime

**Parameters:**

- `roundTo` (string | object): A required string or object to control the operation.
  - If a string is provided, the resulting `Temporal.PlainTime` object will be rounded to that unit.
    Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    A string parameter is treated the same as an object whose `smallestUnit` property value is that string.
  - If an object is passed, the following properties are recognized:
    - `smallestUnit` (required string): The unit to round to.
      Valid values are `'hour'`, `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
    - `roundingIncrement` (number): The granularity to round to, of the unit given by `smallestUnit`.
      The default is 1.
    - `roundingMode` (string): How to handle the remainder.
      Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
      The default is `'halfExpand'`.

**Returns:** a new `Temporal.PlainTime` object which is `time` rounded to `roundTo` (if a string parameter is used) or `roundingIncrement` of `smallestUnit` (if an object parameter is used).

Rounds `time` to the given unit and increment, and returns the result as a new `Temporal.PlainTime` object.

The `smallestUnit` option (or the value of `roundTo` if a string parameter is used) determines the unit to round to.
For example, to round to the nearest minute, use `smallestUnit: 'minute'`.
This option is required.

The `roundingIncrement` option allows rounding to an integer number of units.
For example, to round to increments of a half hour, use `smallestUnit: 'minute', roundingIncrement: 30`.

The value given as `roundingIncrement` must divide evenly into the next highest unit after `smallestUnit`, and must not be equal to it.
(For example, if `smallestUnit` is `'minute'`, then the number of minutes given by `roundingIncrement` must divide evenly into 60 minutes, which is one hour.
The valid values in this case are 1 (default), 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.
Instead of 60 minutes, use 1 hour.)

The `roundingMode` option controls how the rounding is performed.

- `'ceil'`, `'expand'`: Always round up, towards 23:59:59.999999999.
- `'floor'`, `'trunc'`: Always round down, towards 00:00.
- `'halfCeil'`, `'halfExpand'`: Round to the nearest of the values allowed by `roundingIncrement` and `smallestUnit`.
  When there is a tie, round up, like `'ceil'`.
- `'halfFloor'`, `'halfTrunc'`: Round to the nearest of the allowed values, like `'halfExpand'`, but when there is a tie, round down, like `'floor'`.
- `'halfEven'`: Round to the nearest of the allowed values, but when there is a tie, round towards the value that is an even multiple of `roundingIncrement`.
  For example, with a `roundingIncrement` of 2, the number 7 would round up to 8 instead of down to 6, because 8 is an even multiple of 2 (2 × 4 = 8, and 4 is even), whereas 6 is an odd multiple (2 × 3 = 6, and 3 is odd).

Several pairs of modes behave the same as each other, but are both included for consistency with `Temporal.Duration.round()`, where they are not the same.

The default rounding mode is `'halfExpand'` to match how rounding is often taught in school.
Note that this is different than the `'trunc'` default used by `until` and `since` options because rounding up would be an unexpected default for those operations.
Other properties behave identically between these methods.

Example usage:

<!-- prettier-ignore-start -->
```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');

// Round to a particular unit
time.round({ smallestUnit: 'hour' }); // => 20:00:00
// Round to an increment of a unit, e.g. half an hour:
time.round({ roundingIncrement: 30, smallestUnit: 'minute' });
  // => 19:30:00
// Round to the same increment but round up instead:
time.round({ roundingIncrement: 30, smallestUnit: 'minute', roundingMode: 'ceil' });
  // => 20:00:00
```
<!-- prettier-ignore-end -->

### time.**equals**(_other_: Temporal.PlainTime | object | string) : boolean

**Parameters:**

- `other` (`Temporal.PlainTime` or value convertible to one): Another time to compare.

**Returns:** `true` if `time` and `other` are equal, or `false` if not.

Compares two `Temporal.PlainTime` objects for equality.

This function exists because it's not possible to compare using `time == other` or `time === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than `Temporal.PlainTime.compare`.

If `other` is not a `Temporal.PlainTime` object, then it will be converted to one as if it were passed to `Temporal.PlainTime.from()`.

Example usage:

```javascript
time = Temporal.PlainTime.from('19:39:09.068346205');
other = Temporal.PlainTime.from('20:13:20.971398099');
time.equals(other); // => false
time.equals(time); // => true
```

### time.**toString**(_options_?: object) : string

**Parameters:**

- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `fractionalSecondDigits` (number or string): How many digits to print after the decimal point in the output string.
    Valid values are `'auto'`, 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9.
    The default is `'auto'`.
  - `smallestUnit` (string): The smallest unit of time to include in the output string.
    This option overrides `fractionalSecondDigits` if both are given.
    Valid values are `'minute'`, `'second'`, `'millisecond'`, `'microsecond'`, and `'nanosecond'`.
  - `roundingMode` (string): How to handle the remainder.
    Valid values are `'ceil'`, `'floor'`, `'expand'`, `'trunc'`, `'halfCeil'`, `'halfFloor'`, `'halfExpand'`, `'halfTrunc'`, and `'halfEven'`.
    The default is `'trunc'`.

**Returns:** a string in the ISO 8601 time format representing `time`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `time`.
The string can be passed to `Temporal.PlainTime.from()` to create a new `Temporal.PlainTime` object.

The output precision can be controlled with the `fractionalSecondDigits` or `smallestUnit` option.
If no options are given, the default is `fractionalSecondDigits: 'auto'`, which omits trailing zeroes after the decimal point.

The value is truncated to fit the requested precision, unless a different rounding mode is given with the `roundingMode` option, as in `Temporal.PlainDateTime.round()`.
Note that rounding may change the value of other units as well.

Example usage:

<!-- prettier-ignore-start -->
```js
time = Temporal.PlainTime.from('19:39:09.068346205');
time.toString(); // => '19:39:09.068346205'

time.toString({ smallestUnit: 'minute' }); // => '19:39'
time.toString({ fractionalSecondDigits: 0 }); // => '19:39:09'
time.toString({ fractionalSecondDigits: 4 }); // => '19:39:09.0683'
time.toString({ fractionalSecondDigits: 5, roundingMode: 'halfExpand' });
  // => '19:39:09.06835'
```
<!-- prettier-ignore-end -->

### time.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**

- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `time`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `time`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters).

> **NOTE**: Unlike in [`Temporal.Instant.prototype.toLocaleString()`](./instant.md#toLocaleString), `locales.timeZone` will have no effect, because `Temporal.PlainTime` carries no time zone information and is just a wall-clock time.

Example usage:

```js
time = Temporal.PlainTime.from('19:39:09.068346205');
time.toLocaleString(); // example output: '7:39:09 PM'
time.toLocaleString('de-DE'); // example output: '19:39:09'
time.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }); // => '19:39:09'
time.toLocaleString('en-US-u-nu-fullwide-hc-h24'); // => '１９:３９:０９'
```

### time.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `time`.

This method is the same as `time.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.PlainTime` object from a string, is `Temporal.PlainTime.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.PlainTime` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.PlainTime`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:

```js
const workBreak = {
  type: 'mandatory',
  name: 'Lunch',
  startTime: Temporal.PlainTime.from({ hour: 12 }),
  endTime: Temporal.PlainTime.from({ hour: 13 })
};
const str = JSON.stringify(workBreak, null, 2);
console.log(str);
// =>
// {
//   "type": "mandatory",
//   "name": "Lunch",
//   "startTime": "12:00",
//   "endTime": "13:00"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Time')) return Temporal.PlainTime.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### time.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.PlainTime` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.PlainTime.compare()` for this, or `time.equals()` for equality.
