# Temporal.TimeZone

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.TimeZone` is a representation of a time zone: either an [IANA time zone](https://www.iana.org/time-zones), including information about the time zone such as the offset between the local time and UTC at a particular time, and daylight saving time (DST) changes; or simply a particular UTC offset with no DST.

Since `Temporal.Instant` and `Temporal.PlainDateTime` do not contain any time zone information, a `Temporal.TimeZone` object is required to convert between the two.

## Custom time zones

For specialized applications where you need to do calculations in a time zone that is not built in, you can implement a custom time zone.
There are two ways to do this.

The recommended way is to create a class inheriting from `Temporal.TimeZone`.
You must use one of the built-in time zones as the "base time zone".
In the class's constructor, call `super()` with the identifier of the base time zone.
The class must override `toString()` to return its own identifier.
Overriding `getOffsetNanosecondsFor()`, `getPossibleInstantsFor()`, `getNextTransition()`, and `getPreviousTransition()` is optional.
If you don't override the optional members, then they will behave as in the base time zone.
You don't need to override any other methods such as `getOffsetStringFor()` because they will call `getOffsetNanosecondsFor()`, `getPossibleInstantsFor()`, and `toString()` internally.

The other, more difficult, way to create a custom time zone is to create a plain object implementing the `Temporal.TimeZone` protocol, without subclassing.
The object must have at least `getOffsetNanosecondsFor()`, `getPossibleInstantsFor()`, and `toString()` methods.
Any object with those three methods will return the correct output from any Temporal property or method.
However, most other code will assume that custom time zones act like built-in `Temporal.TimeZone` objects.
To interoperate with libraries or other code that you didn't write, then you should implement all the other `Temporal.TimeZone` members as well: `id`, `getOffsetStringFor()`, `getPlainDateTimeFor()`, `getInstantFor()`, `getNextTransition()`, `getPreviousTransition()`, and `toJSON()`.
Your object must not have a `timeZone` property, so that it can be distinguished in `Temporal.TimeZone.from()` from other Temporal objects that have a time zone.

The identifier of a custom time zone must consist of one or more components separated by slashes (`/`), as described in the [tzdata documentation](https://htmlpreview.github.io/?https://github.com/eggert/tz/blob/master/theory.html#naming).
Each component must consist of between one and 14 characters.
Valid characters are ASCII letters, `.`, `-`, and `_`.
`-` may not appear as the first character of a component, and a component may not be a single dot `.` or two dots `..`.

## Constructor

### **new Temporal.TimeZone**(_timeZoneIdentifier_: string) : Temporal.TimeZone

**Parameters:**

- `timeZoneIdentifier` (string): A description of the time zone; either its IANA name, or a UTC offset.

**Returns:** a new `Temporal.TimeZone` object.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

The string `timeZoneIdentifier` is canonicalized before being used to determine the time zone.
For example, values like `+01` will be understood to mean `+01:00`, and capitalization will be corrected.
If no time zone can be determined from `timeZoneIdentifier`, then a `RangeError` is thrown.

Use this constructor directly if you have a string that is known to be a correct time zone identifier.
If you have an ISO 8601 date-time string, `Temporal.TimeZone.from()` is probably more convenient.

Example usage:

```javascript
tz = new Temporal.TimeZone('UTC');
tz = new Temporal.TimeZone('Africa/Cairo');
tz = new Temporal.TimeZone('america/VANCOUVER');
tz = new Temporal.TimeZone('Asia/Katmandu'); // alias of Asia/Kathmandu
tz = new Temporal.TimeZone('-04:00');
tz = new Temporal.TimeZone('+0645');
/* WRONG */ tz = new Temporal.TimeZone('local'); // => throws, not a time zone
```

#### Difference between IANA time zones and UTC offsets

The returned time zone object behaves slightly differently depending on whether an IANA time zone name (e.g. `Europe/Berlin`) is given, or a UTC offset (e.g. `+01:00`).
IANA time zones may have DST transitions, and UTC offsets do not.
For example:

```javascript
tz1 = new Temporal.TimeZone('-08:00');
tz2 = new Temporal.TimeZone('America/Vancouver');
inst = Temporal.ZonedDateTime.from({ year: 2020, month: 1, day: 1, timeZone: tz2 }).toInstant();
tz2.getPreviousTransition(inst); // => 2019-11-03T09:00:00Z
tz1.getNextTransition(inst); // => null
```

## Static methods

### Temporal.TimeZone.**from**(_thing_: any) : Temporal.TimeZone

**Parameters:**

- `thing`: A time zone object, a Temporal object that carries a time zone, or a value from which to create a `Temporal.TimeZone`.

**Returns:** a time zone object.

This static method creates a new time zone from another value.
If the value is another `Temporal.TimeZone` object, or object implementing the time zone protocol, the same object is returned.
If the value is another Temporal object that carries a time zone or an object with a `timeZone` property, such as `Temporal.ZonedDateTime`, the object's time zone is returned.

Any other value is converted to a string, which is expected to be either:

- a string that is accepted by `new Temporal.TimeZone()`; or
- a string in the ISO 8601 format including a time zone offset part.

Note that the ISO 8601 string can optionally be extended with an IANA time zone name in square brackets appended to it.

This function is often more convenient to use than `new Temporal.TimeZone()` because it handles a wider range of input.

Usage examples:

```javascript
// IANA time zone names and UTC offsets
tz = Temporal.TimeZone.from('UTC');
tz = Temporal.TimeZone.from('Africa/Cairo');
tz = Temporal.TimeZone.from('america/VANCOUVER');
tz = Temporal.TimeZone.from('Asia/Katmandu'); // alias of Asia/Kathmandu
tz = Temporal.TimeZone.from('-04:00');
tz = Temporal.TimeZone.from('+0645');

// ISO 8601 string with time zone offset part
tz = Temporal.TimeZone.from('2020-01-14T00:31:00.065858086Z');
tz = Temporal.TimeZone.from('2020-01-13T16:31:00.065858086-08:00');
tz = Temporal.TimeZone.from('2020-01-13T16:31:00.065858086-08:00[America/Vancouver]');

// Existing TimeZone object
tz2 = Temporal.TimeZone.from(tz);

/* WRONG */ tz = Temporal.TimeZone.from('local'); // => throws, not a time zone
/* WRONG */ tz = Temporal.TimeZone.from('2020-01-14T00:31:00'); // => throws, ISO 8601 string without time zone offset part
/* WRONG */ tz = Temporal.TimeZone.from('-08:00[America/Vancouver]'); // => throws, ISO 8601 string without date-time part
```

## Properties

### timeZone.**id** : string

The `id` property gives an unambiguous identifier for the time zone.
Effectively, this is the canonicalized version of whatever `timeZoneIdentifier` was passed as a parameter to the constructor.

When subclassing `Temporal.TimeZone`, this property doesn't need to be overridden because the default implementation gives the result of calling `toString()`.

## Methods

### timeZone.**getOffsetNanosecondsFor**(_instant_: Temporal.Instant | string) : number

**Parameters:**

- `instant` (`Temporal.Instant` or value convertible to one): The time for which to compute the time zone's UTC offset.

**Returns:** The UTC offset at the given time, in nanoseconds.

Since the UTC offset can change throughout the year in time zones that employ DST, this method queries the UTC offset at a particular time.

Note that only `Temporal.TimeZone` objects constructed from an IANA time zone name may have DST transitions; those constructed from a UTC offset do not.
If `timeZone` is a UTC offset time zone, the return value of this method is always the same regardless of `instant`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

Example usage:

```javascript
// Getting the UTC offset for a time zone at a particular time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getOffsetNanosecondsFor(timestamp); // => 3600000000000

// TimeZone with a fixed UTC offset
tz = Temporal.TimeZone.from('-08:00');
tz.getOffsetNanosecondsFor(timestamp); // => -28800000000000
// UTC is always 0 offset
tz = Temporal.TimeZone.from('UTC');
tz.getOffsetNanosecondsFor(timestamp); // => 0

// Differences between DST and non-DST
tz = Temporal.TimeZone.from('Europe/London');
tz.getOffsetNanosecondsFor('2020-08-06T15:00Z'); // => 3600000000000
tz.getOffsetNanosecondsFor('2020-11-06T01:00Z'); // => 0
```

### timeZone.**getOffsetStringFor**(_instant_: Temporal.Instant | string) : string

**Parameters:**

- `instant` (`Temporal.Instant` or value convertible to one): The time for which to compute the time zone's UTC offset.

**Returns**: a string indicating the UTC offset at the given time.

This method is similar to `timeZone.getOffsetNanosecondsFor()`, but returns the offset formatted as a string, with sign, hours, and minutes.

If `timeZone` is a UTC offset time zone, the return value of this method is effectively the same as `timeZone.id`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden because the default implementation creates an offset string using the result of calling `timeZone.getOffsetNanosecondsFor()`.

Example usage:

```javascript
// Getting the UTC offset for a time zone at a particular time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getOffsetStringFor(timestamp); // => '+01:00'

// TimeZone with a fixed UTC offset
tz = Temporal.TimeZone.from('-08:00');
tz.getOffsetStringFor(timestamp); // => '-08:00'
```

### timeZone.**getPlainDateTimeFor**(_instant_: Temporal.Instant | string, _calendar_?: object | string) : Temporal.PlainDateTime

**Parameters:**

- `instant` (`Temporal.Instant` or value convertible to one): An exact time to convert.
- `calendar` (optional object or string): A `Temporal.Calendar` object, or a plain object, or a calendar identifier.
  The default is to use the ISO 8601 calendar.

**Returns:** A `Temporal.PlainDateTime` object indicating the calendar date and wall-clock time in `timeZone`, according to the reckoning of `calendar`, at the exact time indicated by `instant`.

This method is one way to convert a `Temporal.Instant` to a `Temporal.PlainDateTime`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden because the default implementation creates a `Temporal.PlainDateTime` from `instant` using a UTC offset which is the result of calling `timeZone.getOffsetNanosecondsFor()`.

Example usage:

```javascript
// Converting an exact time to a calendar date / wall-clock time
timestamp = Temporal.Instant.fromEpochSeconds(1553993100);
tz = Temporal.TimeZone.from('Europe/Berlin');
tz.getPlainDateTimeFor(timestamp); // => 2019-03-31T01:45:00

// What time was the Unix Epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA)?
epoch = Temporal.Instant.fromEpochSeconds(0);
tz = Temporal.TimeZone.from('America/New_York');
tz.getPlainDateTimeFor(epoch); // => 1969-12-31T19:00:00
```

### timeZone.**getInstantFor**(_dateTime_: Temporal.PlainDateTime | object | string, _options_?: object) : Temporal.Instant

**Parameters:**

- `dateTime` (`Temporal.PlainDateTime` or value convertible to one): A calendar date and wall-clock time to convert.
- `options` (optional object): An object with properties representing options for the operation.
  The following options are recognized:
  - `disambiguation` (string): How to disambiguate if the date and time given by `dateTime` does not exist in the time zone, or exists more than once.
    Allowed values are `'compatible'`, `'earlier'`, `'later'`, and `'reject'`.
    The default is `'compatible'`.

**Returns:** A `Temporal.Instant` object indicating the exact time in `timeZone` at the time of the calendar date and wall-clock time from `dateTime`.

This method is one way to convert a `Temporal.PlainDateTime` to a `Temporal.Instant`.
The result is identical to `dateTime.toZonedDateTime(timeZone, { disambiguation }).toInstant()`.

If `dateTime` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

In the case of ambiguity, the `disambiguation` option controls what instant to return:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible times.
- `'later'`: The later of two possible times.
- `'reject'`: Throw a `RangeError` instead.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like the hour after DST starts in the Spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting non-existent `Temporal.PlainDateTime` values to `Temporal.Instant`, but it also means that values during these periods will result in a different `Temporal.PlainDateTime` in "round-trip" conversions to `Temporal.Instant` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden because the default implementation calls `timeZone.getPossibleInstantsFor()`, and if there is more than one possible instant, uses `disambiguation` to pick which one to return.

### timeZone.**getPossibleInstantsFor**(_dateTime_: Temporal.PlainDateTime | object | string) : array&lt;Temporal.Instant&gt;

**Parameters:**

- `dateTime` (`Temporal.PlainDateTime` or value convertible to one): A calendar date and wall-clock time to convert.

**Returns:** An array of `Temporal.Instant` objects, which may be empty.

This method returns an array of all the possible exact times that could correspond to the calendar date and wall-clock time indicated by `dateTime`.

If `dateTime` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

Normally there is only one possible exact time corresponding to a wall-clock time, but around a daylight saving change, a wall-clock time may not exist, or the same wall-clock time may exist twice in a row.
See [Resolving ambiguity](./ambiguity.md) for usage examples and a more complete explanation.

Although this method is useful for implementing a custom time zone or custom disambiguation behaviour, usually you won't have to use this method; `Temporal.TimeZone.prototype.getInstantFor()` will be more convenient for most use cases.
During "skipped" clock time like the hour after DST starts in the Spring, `Temporal.TimeZone.prototype.getInstantFor()` returns a `Temporal.Instant` (by default interpreting the `Temporal.PlainDateTime` using the pre-transition time zone offset), while this method returns zero results during those skipped periods.

### timeZone.**getNextTransition**(_startingPoint_: Temporal.Instant | string) : Temporal.Instant

**Parameters:**

- `startingPoint` (`Temporal.Instant` or value convertible to one): Time after which to find the next DST transition.

**Returns:** A `Temporal.Instant` object representing the next DST transition in this time zone, or `null` if no transitions later than `startingPoint` could be found.

This method is used to calculate future DST transitions after `startingPoint` for this time zone.

Note that if the time zone was constructed from a UTC offset, there will be no DST transitions.
In that case, this method will return `null`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method should be overridden if the time zone changes offsets.
Single-offset time zones can use the default implementation which returns `null`.

Example usage:

```javascript
// How long until the next DST change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
nextTransition = tz.getNextTransition(now);
duration = nextTransition.since(now);
duration.toLocaleString(); // output will vary
```

### timeZone.**getPreviousTransition**(_startingPoint_: Temporal.Instant | string) : Temporal.Instant

**Parameters:**

- `startingPoint` (`Temporal.Instant` or value convertible to one): Time before which to find the previous DST transition.

**Returns:** A `Temporal.Instant` object representing the previous DST transition in this time zone, or `null` if no transitions earlier than `startingPoint` could be found.

This method is used to calculate past DST transitions before `startingPoint` for this time zone.

Note that if the time zone was constructed from a UTC offset, there will be no DST transitions.
In that case, this method will return `null`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method should be overridden if the time zone changes offsets.
Single-offset time zones can use the default implementation which returns `null`.

Example usage:

```javascript
// How long until the previous DST change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
previousTransition = tz.getPreviousTransition(now);
duration = now.since(previousTransition);
duration.toLocaleString(); // output will vary
```

### timeZone.**toString**() : string

**Returns:** The string given by `timeZone.id`.

This method overrides `Object.prototype.toString()` and provides the time zone's `id` property as a human-readable description.

### timeZone.**toJSON**() : string

**Returns:** the string given by `timeZone.id`.

This method is the same as `timeZone.toString()`.
It is usually not called directly, but it can be called automatically by `JSON.stringify()`.

The reverse operation, recovering a `Temporal.TimeZone` object from a string, is `Temporal.TimeZone.from()`, but it cannot be called automatically by `JSON.parse()`.
If you need to rebuild a `Temporal.TimeZone` object from a JSON string, then you need to know the names of the keys that should be interpreted as `Temporal.TimeZone`s.
In that case you can build a custom "reviver" function for your use case.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden because the default implementation returns the result of calling `timeZone.toString()`.

Example usage:

```js
const user = {
  id: 775,
  username: 'robotcat',
  password: 'hunter2', // Note: Don't really store passwords like that
  userTimeZone: Temporal.TimeZone.from('Europe/Madrid')
};
const str = JSON.stringify(user, null, 2);
console.log(str);
// =>
// {
//   "id": 775,
//   "username": "robotcat",
//   "password": "hunter2",
//   "userTimeZone": "Europe/Madrid"
// }

// To rebuild from the string:
function reviver(key, value) {
  if (key.endsWith('TimeZone')) return Temporal.TimeZone.from(value);
  return value;
}
JSON.parse(str, reviver);
```
