# Temporal.Absolute

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.Absolute` is an absolute point in time, with a precision in nanoseconds.
No time zone or calendar information is present.
As such `Temporal.Absolute` has no concept of days, months or even hours.

For convenience of interoperability, it internally uses nanoseconds since the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time) (midnight UTC on January 1, 1970).
However, a `Temporal.Absolute` can be created from any of several expressions that refer to a single point in time, including an ISO 8601 string with a time zone such as `'2020-01-23T17:04:36.491865121-08:00'`.

Since `Temporal.Absolute` doesn't contain any information about time zones, a `Temporal.TimeZone` is needed in order to convert it into a `Temporal.DateTime` (and from there into any of the other `Temporal` objects.)

Like Unix time, `Temporal.Absolute` ignores leap seconds.

## Constructor

### **new Temporal.Absolute**(_epochNanoseconds_ : bigint) : Temporal.Absolute

**Parameters:**
- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Absolute` object.

Creates a new `Temporal.Absolute` object that represents a single point in time.

`epochNanoseconds` is the number of nanoseconds (10<sup>&minus;9</sup> seconds) between the Unix epoch (midnight UTC on January 1, 1970) and the desired point in time.

Use this constructor directly if you know the precise number of nanoseconds already and have it in bigint form, for example from a database.
Otherwise, `Temporal.Absolute.from()`, which accepts more kinds of input, is probably more convenient.

The range of allowed values for this type is the same as the old-style JavaScript `Date`, 100 million (10<sup>8</sup>) days before or after the Unix epoch.
This range covers approximately half a million years. If `epochNanoseconds` is outside of this range, a `RangeError` will be thrown.

Example usage:
```js
abs = new Temporal.Absolute(1553906700000000000n);
// When was the Unix epoch?
epoch = new Temporal.Absolute(0n);  // => 1970-01-01T00:00Z
// Dates before the Unix epoch are negative
turnOfTheCentury = new Temporal.Absolute(-2208988800000000000n);  // => 1900-01-01T00:00Z
```

## Static methods

### Temporal.Absolute.**from**(_thing_: any) : Temporal.Absolute

**Parameters:**
- `thing`: The value representing the desired point in time.

**Returns:** a new `Temporal.Absolute` object.

This static method creates a new `Temporal.Absolute` object from another value.
If the value is another `Temporal.Absolute` object, a new object representing the same point in time is returned.

Any other value is converted to a string, which is expected to be in ISO 8601 format, including a date, a time, and a time zone.
If the point in time cannot be uniquely determined from the string, then this function throws an exception.
This includes the case when `thing` is a validly-formatted ISO 8601 string denoting a time that doesn't exist, for example because it was skipped in a daylight saving time transition.

Example usage:
```js
abs = Temporal.Absolute.from('2019-03-30T01:45:00+01:00[Europe/Berlin]');
abs = Temporal.Absolute.from('2019-03-30T01:45+01:00');
abs = Temporal.Absolute.from('2019-03-30T00:45Z');
abs === Temporal.Absolute.from(abs);  // => true

// Not enough information to denote a single point in time:
/* WRONG */ abs = Temporal.Absolute.from('2019-03-30');  // no time; throws
/* WRONG */ abs = Temporal.Absolute.from('2019-03-30T01:45');  // no time zone; throws
/* WRONG */ abs = Temporal.Absolute.from('2019-03031T02:45+01:00[Europe/Berlin]');
    // time skipped in DST transition; throws
```

### Temporal.Absolute.**fromEpochSeconds**(_epochSeconds_: number) : Temporal.Absolute

**Parameters:**
- `epochSeconds` (number): A number of seconds.

**Returns:** a new `Temporal.Absolute` object.

This static method creates a new `Temporal.Absolute` object with seconds precision.
`epochSeconds` is the number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and the desired point in time.

The number of seconds since the Unix epoch is a common measure of time in many computer systems.
Use this method if you need to interface with such a system.

Example usage:
```js
// Same examples as in new Temporal.Absolute(), but with seconds precision
abs = Temporal.Absolute.fromEpochSeconds(1553906700);
epoch = Temporal.Absolute.fromEpochSeconds(0);  // => 1970-01-01T00:00Z
turnOfTheCentury = Temporal.Absolute.fromEpochSeconds(-2208988800);  // => 1900-01-01T00:00Z
```

### Temporal.Absolute.**fromEpochMilliseconds**(_epochMilliseconds_: number) : Temporal.Absolute

**Parameters:**
- `epochMilliseconds` (number): A number of milliseconds.

**Returns:** a new `Temporal.Absolute` object.

Same as `Temporal.Absolute.fromEpochSeconds()`, but with millisecond (10<sup>&minus;3</sup> second) precision.

The number of milliseconds since the Unix epoch is also returned from the `getTime()` and `valueOf()` methods of old-style JavaScript `Date` objects, as well as `Date.now()`.
Use this method to create a `Temporal.Absolute` object from a `Date` object, for example:
```js
jsdate = new Date('December 17, 1995 03:24:00 GMT')
abs = Temporal.Absolute.fromEpochMilliseconds(jsdate.getTime());  // => 1995-12-17T03:24Z
abs = Temporal.Absolute.fromEpochMilliseconds(+jsdate);  // valueOf() called implicitly

// This is a way to get the current time, but Temporal.now.absolute()
// would give the same with higher accuracy
todayMs = Temporal.Absolute.fromEpochMilliseconds(Date.now());
todayNs = Temporal.now.absolute();
```

### Temporal.Absolute.**fromEpochMicroseconds**(_epochMilliseconds_ : bigint) : Temporal.Absolute

**Parameters:**
- `epochMicroseconds` (bigint): A number of microseconds.

**Returns:** a new `Temporal.Absolute` object.

Same as `Temporal.Absolute.fromEpochSeconds()`, but with microsecond (10<sup>&minus;6</sup> second) precision.

### Temporal.Absolute.**fromEpochNanoseconds**(_epochNanoseconds_ : bigint) : Temporal.Absolute

**Parameters:**
- `epochNanoseconds` (bigint): A number of nanoseconds.

**Returns:** a new `Temporal.Absolute` object.

Same as `Temporal.Absolute.fromEpochSeconds()`, but with nanosecond (10<sup>&minus;9</sup> second) precision.
Also the same as `new Temporal.Absolute(epochNanoseconds)`.

### Temporal.Absolute.**compare**(_one_: Temporal.Absolute, _two_: Temporal.Absolute) : number

**Parameters:**
- `one` (`Temporal.Absolute`): First time to compare.
- `two` (`Temporal.Absolute`): Second time to compare.

**Returns:** &minus;1, 0, or 1.

Compares two `Temporal.Absolute` objects.
Returns an integer indicating whether `one` comes before or after or is equal to `two`.
- &minus;1 if `one` comes before `two`;
- 0 if `one` and `two` represent the same time;
- 1 if `one` comes after `two`.

This function can be used to sort arrays of `Temporal.Absolute` objects.
For example:
```javascript
one = Temporal.Absolute.fromEpochSeconds(1.0e9);
two = Temporal.Absolute.fromEpochSeconds(1.1e9);
three = Temporal.Absolute.fromEpochSeconds(1.2e9);
sorted = [three, one, two].sort(Temporal.Absolute.compare);
sorted.join(' ');
// => 2001-09-09T01:46:40Z 2004-11-09T11:33:20Z 2008-01-10T21:20Z
```

## Methods

### absolute.**getEpochSeconds**() : number

**Returns:** an integer number of seconds.

Returns the number of seconds between the Unix epoch (midnight UTC on January 1, 1970) and `absolute`.
This number will be negative if `absolute` is before 1970.
The number of seconds is rounded towards zero.

Use this method if you need to interface with some other system that reckons time in seconds since the Unix epoch.

Example usage:
```js
abs = Temporal.Absolute.from('2019-03-30T01:45+01:00');
abs.getEpochSeconds();  // => 1554000300
```

### absolute.**getEpochMilliseconds**() : number

**Returns:** an integer number of milliseconds.

Same as `getEpochSeconds()`, but with millisecond (10<sup>&minus;3</sup> second) precision.

This method can be useful in particular to create an old-style JavaScript `Date` object, if one is needed.
An example:
```js
abs = Temporal.Absolute.from('2019-03-30T00:45Z');
new Date(abs.getEpochMilliseconds());  // => 2019-03-30T00:45:00.000Z
```

### absolute.**getEpochMicroseconds**() : bigint

**Returns:** a number of microseconds, as a bigint.

Same as `getEpochSeconds()`, but with microsecond (10<sup>&minus;6</sup> second) precision.

### absolute.**getEpochNanoseconds**() : bigint

**Returns:** a number of nanoseconds, as a bigint.

Same as `getEpochSeconds()`, but with nanosecond (10<sup>&minus;9</sup> second) precision.

The value returned from this method is suitable to be passed to `new Temporal.Absolute()`.

### absolute.**toDateTime**(_timeZone_: object | string, _calendar_?: object | string) : Temporal.DateTime

**Parameters:**
- `timeZone` (object or string): A `Temporal.TimeZone` object, or an object implementing the [time zone protocol](./timezone.md#protocol), or a string description of the time zone; either its IANA name or UTC offset.
- `calendar` (optional object or string): A `Temporal.Calendar` object, or a plain object, or a calendar identifier.
  The default is to use the ISO 8601 calendar.

**Returns:** a `Temporal.DateTime` object indicating the calendar date and wall-clock time in `timeZone`, according to the reckoning of `calendar`, at the absolute time indicated by `absolute`.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

For a list of calendar identifiers, see the documentation for [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#Parameters).

This method is one way to convert a `Temporal.Absolute` to a `Temporal.DateTime`.

Example usage:

```js
// Converting a specific absolute time to a calendar date / wall-clock time
timestamp = new Temporal.Absolute(1553993100000000000n);
timestamp.toDateTime('Europe/Berlin');  // => 2019-03-31T01:45
timestamp.toDateTime('UTC');  // => 2019-03-31T00:45
timestamp.toDateTime('-08:00');  // => 2019-02-01T16:45

// What time was the Unix epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA)?
epoch = new Temporal.Absolute(0n);
tz = new Temporal.TimeZone('America/New_York');
epoch.toDateTime(tz);  // => 1969-12-31T19:00
```

### absolute.**plus**(_duration_: object) : Temporal.Absolute

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.

**Returns:** a new `Temporal.Absolute` object which is the time indicated by `absolute` plus `duration`.

This method adds `duration` to `absolute`, returning a point in time that is in the future relative to `absolute`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

The `years` and `months` fields of `duration` must be zero, because adding a year or a month to a `Temporal.Absolute` is invalid and will throw a `RangeError`.
`Temporal.Absolute` is independent of time zones and calendars, and so years and months may be different lengths.
If you need to do this, convert the `Temporal.Absolute` to a `Temporal.DateTime` by specifying the desired time zone, add the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Absolute` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Adding a negative duration is equivalent to subtracting the absolute value of that duration.

Example usage:
```js
// Temporal.Absolute representing five hours from now
Temporal.now.absolute().plus({ hours: 5 });
fiveHours = new Temporal.Duration(0, 0, 0, 5);
Temporal.now.absolute().plus(fiveHours);
```

### absolute.**minus**(_duration_: object) : Temporal.Absolute

**Parameters:**
- `duration` (object): A `Temporal.Duration` object or a duration-like object.

**Returns:** a new `Temporal.Absolute` object which is the time indicated by `absolute` minus `duration`.

This method subtracts `duration` from `absolute`, returning a point in time that is in the past relative to `absolute`.

The `duration` argument is an object with properties denoting a duration, such as `{ hours: 5, minutes: 30 }`, or a `Temporal.Duration` object.

The `years` and `months` fields of `duration` must be zero, because subtracting a year or a month from a `Temporal.Absolute` is invalid and will throw a `RangeError`.
`Temporal.Absolute` is independent of time zones and calendars, and so years and months may be different lengths.
If you need to do this, convert the `Temporal.Absolute` to a `Temporal.DateTime` by specifying the desired time zone, subtract the duration, and then convert it back.

If the result is earlier or later than the range that `Temporal.Absolute` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), a `RangeError` will be thrown.

Subtracting a negative duration is equivalent to adding the absolute value of that duration.

Example usage:
```js
// Temporal.Absolute representing this time yesterday
Temporal.now.absolute().minus({ days: 1 });
oneDay = new Temporal.Duration(0, 0, 1);
Temporal.now.absolute().minus(oneDay);
```

### absolute.**difference**(_other_: Temporal.Absolute, _options_?: object) : Temporal.Duration

**Parameters:**
- `other` (`Temporal.Absolute`): Another time with which to compute the difference.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `largestUnit` (string): The largest unit of time to allow in the resulting `Temporal.Duration` object.
    Valid values are `'days'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'microseconds'`, and `'nanoseconds'`.
    The default is `"seconds"`.

**Returns:** a `Temporal.Duration` representing the difference between `absolute` and `other`.

This method computes the difference between the two times represented by `absolute` and `other`, and returns it as a `Temporal.Duration` object.
If `other` is later than `absolute` then the resulting duration will be negative.

The `largestUnit` option controls how the resulting duration is expressed.
The returned `Temporal.Duration` object will not have any nonzero fields that are larger than the unit in `largestUnit`.
A difference of two hours will become 7200 seconds when `largestUnit` is `"seconds"`, for example.
However, a difference of 30 seconds will still be 30 seconds even if `largestUnit` is `"hours"`.

By default, the largest unit in the result is seconds.
Weeks, months and years are not allowed, unlike the difference methods of the other Temporal types.
This is because months and years can be different lengths depending on which month is meant, and whether the year is a leap year, which all depends on the start and end date of the difference.
You cannot determine the start and end date of a difference between `Temporal.Absolute`s, because `Temporal.Absolute` has no time zone or calendar.

If you do need to calculate the difference between two `Temporal.Absolute`s in years, months, or weeks, then you can make an explicit choice on how to eliminate this ambiguity, choosing your starting point by converting to a `Temporal.DateTime`.
For example, you might decide to base the calculation on your user's current time zone, or on UTC.

Take care when using milliseconds, microseconds, or nanoseconds as the largest unit.
For some durations, the resulting value may overflow `Number.MAX_SAFE_INTEGER` and lose precision in its least significant digit(s).
Nanoseconds values will overflow and lose precision after about 104 days. Microseconds can fit about 285 years without losing precision, and milliseconds can handle about 285,000 years without losing precision.

Example usage:
```js
startOfMoonMission = Temporal.Absolute.from('1969-07-16T13:32:00Z');
endOfMoonMission = Temporal.Absolute.from('1969-07-24T16:50:35Z');
missionLength = endOfMoonMission.difference(startOfMoonMission, { largestUnit: 'days' });
  // => P8DT3H18M35S
startOfMoonMission.difference(endOfMoonMission, { largestUnit: 'days' });
  // => throws RangeError
missionLength.toLocaleString();
  // example output: '8 days 3 hours 18 minutes 35 seconds'

// A billion (10^9) seconds since the epoch in different units
epoch = new Temporal.Absolute(0n);
billion = Temporal.Absolute.fromEpochSeconds(1e9);
billion.difference(epoch);
  // =>    PT1000000000S
billion.difference(epoch, { largestUnit: 'hours' });
  // =>  PT277777H46M40S
billion.difference(epoch, { largestUnit: 'days' });
  // => P11574DT1H46M40S
ns = billion.difference(epoch, { largestUnit: 'nanoseconds' });
  // =>    PT1000000000S
ns.plus({nanoseconds: 1});
  // =>    PT1000000000S (lost precision)

// Calculate the difference in years, eliminating the ambiguity by
// explicitly using the corresponding calendar date in UTC:
utc = Temporal.TimeZone.from('UTC');
billion.toDateTime(utc).difference(epoch.toDateTime(utc), { largestUnit: 'years' });
  // => P31Y8M8DT1H46M40S
```

### absolute.**equals**(_other_: Temporal.Absolute) : boolean

**Parameters:**
- `other` (`Temporal.Absolute`): Another time to compare.

**Returns:** `true` if `absolute` and `other` are equal, or `false` if not.

Compares two `Temporal.Absolute` objects for equality.

This function exists because it's not possible to compare using `absolute == other` or `absolute === other`, due to ambiguity in the primitive representation and between Temporal types.

If you don't need to know the order in which the two times occur, then this function may be less typing and more efficient than `Temporal.Absolute.compare`.

Example usage:
```javascript
one = Temporal.Absolute.fromEpochSeconds(1.0e9);
two = Temporal.Absolute.fromEpochSeconds(1.1e9);
one.equals(two)  // => false
one.equals(one)  // => true
```

### absolute.**toString**(_timeZone_?: object | string) : string

**Parameters:**
- `timeZone` (optional string or object): the time zone to express `absolute` in, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
  The default is to use UTC.

**Returns:** a string in the ISO 8601 date format representing `absolute`.

This method overrides the `Object.prototype.toString()` method and provides a convenient, unambiguous string representation of `absolute`.
The string can be passed to `Temporal.Absolute.from()` to create a new `Temporal.Absolute` object.

Example usage:
```js
abs = new Temporal.Absolute(1574074321816000000n);
abs.toString();  // => 2019-11-18T10:52:01.816Z
abs.toString(Temporal.TimeZone.from('UTC'));  // => 2019-11-18T10:52:01.816Z
abs.toString('Asia/Seoul');  // => 2019-11-18T19:52:01.816+09:00[Asia/Seoul]
```

### absolute.**toLocaleString**(_locales_?: string | array&lt;string&gt;, _options_?: object) : string

**Parameters:**
- `locales` (optional string or array of strings): A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.
- `options` (optional object): An object with properties influencing the formatting.

**Returns:** a language-sensitive representation of `absolute`.

This method overrides `Object.prototype.toLocaleString()` to provide a human-readable, language-sensitive representation of `absolute`.

The `locales` and `options` arguments are the same as in the constructor to [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).

Example usage:
```js
abs = Temporal.Absolute.from("2019-11-18T11:00:00.000Z");
abs.toLocaleString();  // => example output: 2019-11-18, 3:00:00 a.m.
abs.toLocaleString('de-DE');  // => example output: 18.11.2019, 03:00:00
abs.toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
});  // => Montag, 18.11.2019, 12:00:00
abs.toLocaleString('en-US-u-nu-fullwide-hc-h12', {
    timeZone: 'Asia/Kolkata',
});  // => １１/１８/２０１９, ４:３０:００ PM
```

### absolute.**toJSON**() : string

**Returns:** a string in the ISO 8601 date format representing `absolute`, in the UTC time zone.

This method is like `absolute.toString()` but always produces a string in UTC time.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.Absolute` object from a string, is `Temporal.Absolute.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.Absolute` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.Absolute`s.
In that case you can build a custom "reviver" function for your use case.

Example usage:
```js
const meeting = {
  id: 355,
  name: 'Budget review',
  location: 'https://meet.jit.si/ObjectiveTomatoesJokeSurely',
  startAbsolute: Temporal.Absolute.from('2020-03-30T15:00-04:00[America/New_York]'),
  endAbsolute: Temporal.Absolute.from('2020-03-30T16:00-04:00[America/New_York]'),
};
const str = JSON.stringify(meeting, null, 2);
console.log(str);
// =>
// {
//   "id": 355,
//   "name": "Budget review",
//   "location": "https://meet.jit.si/ObjectiveTomatoesJokeSurely",
//   "startAbsolute": "2020-03-30T19:00Z",
//   "endAbsolute": "2020-03-30T20:00Z"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('Absolute'))
    return Temporal.Absolute.from(value);
  return value;
}
JSON.parse(str, reviver);
```

### absolute.**valueOf**()

This method overrides `Object.prototype.valueOf()` and always throws an exception.
This is because it's not possible to compare `Temporal.Absolute` objects with the relational operators `<`, `<=`, `>`, or `>=`.
Use `Temporal.Absolute.compare()` for this, or `absolute.equals()` for equality.
