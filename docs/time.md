# Temporal.Time

A `Temporal.Time` represents a wall-clock time, with a precision in nanoseconds, and without any time zone.
"Wall-clock time" refers to the concept of a time as expressed in everyday usage &mdash; the time that you read off the clock on the wall.
For example, it could be used to represent an event that happens daily at a certain time, no matter what time zone.

`Temporal.Time` refers to a time with no associated calendar date; if you need to refer to a specific time on a specific day, use `Temporal.DateTime`.
A `Temporal.Time` can be converted into a `Temporal.DateTime` by combining it with a `Temporal.Date` using the `withDate()` method.

## Constructor

### **new Temporal.Time**(_hour_: number = 0, _minute_: number = 0, _second_: number = 0, _millisecond_: number = 0, _microsecond_: number = 0, _nanosecond_: number = 0) : Temporal.Time

**Parameters:**
- `hour` (optional number): An hour of the day, ranging between 0 and 23 inclusive.
- `minute` (optional number): A minute, ranging between 0 and 59 inclusive.
- `second` (optional number): A second, ranging between 0 and 59 inclusive.
- `millisecond` (optional number): A number of milliseconds, ranging between 0 and 999 inclusive.
- `microsecond` (optional number): A number of microseconds, ranging between 0 and 999 inclusive.
- `nanosecond` (optional number): A number of nanoseconds, ranging between 0 and 999 inclusive.

**Returns:** a new `Temporal.Time` object.

Use this constructor if you have the correct parameters for the time already as individual number values.
Otherwise, `Temporal.Time.from()`, which accepts more kinds of input and allows disambiguation behaviour, is probably more convenient.

Usage examples:
```javascript
// Leet hour
time = new Temporal.Time(13, 37)  // => 13:37
```

## Static methods

### Temporal.Time.**from**(_thing_: any, _options_?: object) : Temporal.Time

**Parameters:**
- `thing`: The value representing the desired time.
- `options` (optional object): An object with properties representing options for constructing the time.
  The following options are recognized:
  - `disambiguation` (optional string): How to deal with out-of-range values of the other parameters.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Time` object.

This static method creates a new `Temporal.Time` object from another value.
If the value is another `Temporal.Time` object, a new object representing the same time is returned.
If the value is any other object, a `Temporal.Time` will be constructed from the values of any `hour`, `minute`, `second`, `millisecond`, `microsecond`, and `nanosecond` properties that are present.
Any missing ones will be assumed to be 0.

Any non-object value will be converted to a string, which is expected to be in ISO 8601 format.
If the string designates a date or a time zone, they will be ignored.

The `disambiguation` option works as follows:
- In `constrain` mode (the default), any out-of-range values are clamped to the nearest in-range value.
- In `balance` mode, any out-of-range values are resolved by balancing them with the next highest unit.
- In `reject` mode, the presence of out-of-range values will cause the function to throw a `RangeError`.

> **NOTE**: Although Temporal does not deal with leap seconds, times coming from other software may have a `second` value of 60.
> In the default `constrain` disambiguation mode, this will be converted to 59, and in `balance` mode, to 00 of the next minute.
> In `reject` mode, the constructor will throw, so if you have to interoperate with times that may contain leap seconds, don't use `reject`.
> However, if parsing an ISO 8601 string with a seconds component of `:60`, then it will always result in a `second` value of 59, in accordance with POSIX.

Example usage:
```javascript
time = Temporal.Time.from('03:24:30');  // => 03:24:30
time = Temporal.Time.from('1995-12-07T03:24:30');  // => 03:24:30
time = Temporal.Time.from('1995-12-07T03:24:30Z');  // => 03:24:30
time = Temporal.Time.from('1995-12-07T03:24:30+01:00[Europe/Brussels]');
  // => same as above; time zone is ignored
time === Temporal.Time.from(time)  // => true

time = Temporal.Time.from({
    hour: 19,
    minute: 39,
    second: 9,
    millisecond: 68,
    microsecond: 346,
    nanosecond: 205
});  // => 19:39:09.068346205
time = Temporal.Time.from({ hour: 19, minute: 39, second: 9 });  // => 19:39:09
time = Temporal.Time.from(Temporal.DateTime.from('2020-02-15T19:39:09'));
  // => same as above; Temporal.DateTime has hour, minute, etc. properties

// Different disambiguation modes
time = Temporal.Time.from({ hour: 15, minute: 60 }, { disambiguation: 'constrain' });
  // => 15:59
time = Temporal.Time.from({ hour: 15, minute: -1 }, { disambiguation: 'constrain' });
  // => 15:00
time = Temporal.Time.from({ hour: 15, minute: 60 }, { disambiguation: 'balance' });
  // => 16:00
time = Temporal.Time.from({ hour: 15, minute: -1 }, { disambiguation: 'balance' });
  // => 14:59
time = Temporal.Time.from({ hour: 15, minute: 60 }, { disambiguation: 'reject' });
  // throws
time = Temporal.Time.from({ hour: 15, minute: -1 }, { disambiguation: 'reject' });
  // throws
```

### Temporal.Time.**compare**(_one_: Temporal.Time, _two_: Temporal.Time) : number

**Parameters:**
- `one` (`Temporal.Time`): First time to compare.
- `two` (`Temporal.Time`): Second time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.Time` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.
- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` are the same;
- 1 if `one` comes after `two`.

This function can be used to sort arrays of `Temporal.Time` objects.
For example:
```javascript
one = Temporal.Time.from('03:24');
two = Temporal.Time.from('01:24');
three = Temporal.Time.from('01:24:05');
sorted = [one, two, three].sort(Temporal.Time.compare);
sorted.join(' ');  // => 01:24 01:24:05 03:24
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
```javascript
time = Temporal.Time.from('19:39:09.068346205');
time.hour         // => 19
time.minute       // => 39
time.second       // => 9
time.millisecond  // => 68
time.microsecond  // => 346
time.nanosecond   // => 205
```

## Methods

### time.**with**(_timeLike_: object, _options_?: object) : Temporal.Time

**Parameters:**
- `timeLike` (object): an object with some or all of the properties of a `Temporal.Time`.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to deal with out-of-range values.
    Allowed values are `constrain`, `balance`, and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Time` object.

This method creates a new `Temporal.Time` which is a copy of `time`, but any properties present on `timeLike` override the ones already present on `time`.

Since `Temporal.Time` objects are immutable, use this method instead of modifying one.

Usage example:
```javascript
time = Temporal.Time.from('19:39:09.068346205');
// What's the top of the next hour?
time.with({
    hour: time.hour + 1,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
}, { disambiguation: 'balance' })  // => 20:00
```

### time.**plus**(_duration_: object, _options_?: object) : Temporal.Time

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the addition.
  The following options are recognized:
  - `disambiguation` (string): How to deal with additions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Time` object which is the time indicated by `time` plus `duration`.

This method adds `duration` to `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

The `disambiguation` parameter has no effect in the default ISO calendar, because the units of hours, minutes, and seconds are always the same length and therefore not ambiguous.
However, it may have an effect in other calendars where those units are not always the same length.

Usage example:
```javascript
time = Temporal.Time.from('19:39:09.068346205');
time.plus({ minutes: 5, nanoseconds: 800 })  // => 19:44:09.068347005
```

### time.**minus**(_duration_: object, _options_?: object) : Temporal.Time

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.
- `options` (optional object): An object with properties representing options for the subtraction.
  The following options are recognized:
  - `disambiguation` (string): How to deal with subtractions that result in out-of-range values.
    Allowed values are `constrain` and `reject`.
    The default is `constrain`.

**Returns:** a new `Temporal.Time` object which is the time indicated by `time` minus `duration`.

This method subtracts `duration` from `time`.
Due to times wrapping around when reaching 24 hours, the returned point in time may be either in the future or in the past relative to `time`, or even the same time.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

The `disambiguation` parameter has no effect in the default ISO calendar, because the units of hours, minutes, and seconds are always the same length and therefore not ambiguous.
However, it may have an effect in other calendars where those units are not always the same length.

Usage example:
```javascript
time = Temporal.Time.from('19:39:09.068346205');
time.minus({ minutes: 5, nanoseconds: 800 })  // => 19:34:09.068345405
```

### time.**difference**(_other_: Temporal.Time, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (`Temporal.Time`): Another time with which to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'years'`, `'months'`, `'days'`, `'hours'`, `'minutes'`, and `'seconds'`.
    The default is `days`.

**Returns:** a `Temporal.Duration` representing the difference between `time` and `other`.

This method computes the difference between the two times represented by `time` and `other`, and returns it as a `Temporal.Duration` object.
The difference is always positive, and always 12 hours or less, no matter the order of `time` and `other`, because `Temporal.Duration` objects cannot represent negative durations.

The `largestUnit` parameter controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.

The default largest unit in the result is hours.
Since this method never returns any duration longer than 12 hours, largest units of years, months, or days, are by definition ignored and treated as hours.

Usage example:
```javascript
time = Temporal.Time.from('19:39:09.068346205');
time.difference(Temporal.Time.from('20:13:20.971398099'))  // => PT34M11.903051894S

// The difference is always less than 12 hours, crossing midnight if needed
Temporal.Time.from('01:00').difference(Temporal.Time.from('23:00'))  // => P2H
```

### time.**toString**() : string

**Returns:** a string in the ISO 8601 time format representing `time`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `time`.
The string can be passed to `Temporal.Time.from()` to create a new `Temporal.Time` object.

Example usage:
```js
time = Temporal.Time.from('19:39:09.068346205');
time.toString();  // => 19:39:09.068346205
```

### time.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `time`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `time`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

> **NOTE**: Unlike in [`Temporal.Absolute.prototype.toLocaleString()`](./absolute.html#toLocaleString), `locales.timeZone` will have no effect, because `Temporal.Time` carries no time zone information and is just a wall-clock time.

Example usage:
```js
time = Temporal.Time.from('19:39:09.068346205');
time.toLocaleString();  // => example output: 7:39:09 p.m.
time.toLocaleString('de-DE');  // => example output: 19:39:09
time.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });  // => 19:39:09
time.toLocaleString('en-US-u-nu-fullwide-hc-h24');  // => １９:３９:０９
```

### time.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `time`.

This method is the same as `time.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.Time` object from a string, is `Temporal.Time.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.Time` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.Time`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const workBreak = {
  type: 'mandatory',
  name: 'Lunch',
  startTime: Temporal.Time.from({ hour: 12 }),
  endTime: Temporal.Time.from({ hour: 13 }),
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
  if (key.endsWith('Time'))
    return Temporal.Time.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### time.**withDate**(_date_: Temporal.Date) : Temporal.DateTime

**Parameters:**
- `date` (`Temporal.Date`): A calendar date on which to place `time`.

**Returns:** a `Temporal.DateTime` object that represents the wall-clock time `time` on the calendar date `date`.

This method can be used to convert `Temporal.Time` into a `Temporal.DateTime`, by supplying the calendar date to use.
The converted object carries a copy of all the relevant fields of `date` and `time`.

This is exactly equivalent to [`date.withTime(time)`](./date.html#withTime).

Usage example:
```javascript
time = Temporal.Time.from('15:23:30.003');
date = Temporal.Date.from('2006-08-24');
time.withDate(date)  // => 2006-08-24T15:23:30.003
```

### time.**getFields**() : { hour: number, minute: number, second: number, millisecond: number, microsecond: number, nanosecond: number }

**Returns:** a plain object with properties equal to the fields of `time`.

This method can be used to convert a `Temporal.Time` into a record-like data structure.
It returns a new plain JavaScript object, with all the fields as enumerable, writable, own data properties.

Usage example:
```javascript
time = Temporal.Time.from('15:23:30.003');
Object.assign({}, time).minute  // => undefined
Object.assign({}, time.getFields()).minute  // => 23
```
