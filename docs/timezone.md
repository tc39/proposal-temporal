# Temporal.TimeZone

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

A `Temporal.TimeZone` is a representation of a time zone:

- either an [IANA time zone](https://www.iana.org/time-zones) that defines the offset between local time and UTC and how that offset changes in response to daylight saving time (DST) and/or other political changes;
- or an "offset time zone": a fixed UTC offset.

To combine a time zone with a date/time value, and to perform DST-safe operations like "add one day", use [`Temporal.ZonedDateTime`](./zoneddatetime.md).

## Time zone identifiers

Time zones in `Temporal` are represented by string identifiers from the IANA Time Zone Database (like `Asia/Tokyo`, `America/Los_Angeles`, or `UTC`) or by a fixed UTC offset like `+05:30`.

A string identifier can be used in place of a `Temporal.TimeZone` object when passing parameters to ECMAScript methods.
Furthermore, string identifiers allow ECMAScript implementations to perform optimizations that are not possible when passing time zone objects.
Therefore, it's recommended to always pass string identifiers instead of time zone objects whenever this is convenient.
For example:

```javascript
inBerlin = Temporal.ZonedDateTime.from('2022-01-28T19:53+01:00[Europe/Berlin]');
inTokyo = inBerlin.withTimeZone('Asia/Tokyo'); // May be faster and/or use less RAM
inTokyo = inBerlin.withTimeZone(Temporal.TimeZone.from('Asia/Tokyo')); // OK, but not optimal
```

### Handling changes to the IANA Time Zone Database

Time zone identifiers are occasionally renamed or merged in the IANA Time Zone Database.
For example, `Asia/Calcutta` was renamed to `Asia/Kolkata`, and `America/Montreal` was merged into `America/Toronto` because both identifiers are in the same country and share the same time zone rules since 1970.

Identifiers that have been renamed or merged are considered equivalent by ECMAScript.
Both identifiers will continue to be accepted by ECMAScript methods and will behave identically, except for `toString()`, `id`, and other code that returns the identifier string.
Equivalence can be tested using `Temporal.TimeZone.prototype.equals`.

```javascript
function areTimeZoneIdentifiersEquivalent(id1, id2) {
  return Temporal.TimeZone.from(id1).equals(id2);
  // DON'T DO THIS: return id1 === id2;
}
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', 'ASIA/KOLKATA'); // => true
areTimeZoneIdentifiersEquivalent('Asia/Calcutta', '+05:30'); // => false
areTimeZoneIdentifiersEquivalent('UTC', '+00:00'); // => false
```

Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones use the same offsets.
Similarly, a numeric-offset identifier is never equivalent to an IANA time zone identifier, even if they always represent the same offset.

In any set of equivalent identifiers, only one identifier will be considered canonical.
To avoid redundancy, only canonical identifiers are returned by `Intl.supportedValuesOf('timeZone')`.
Furthermore, only canonical identifiers are output methods that returns the system's current time zone, such as `Temporal.Now.timeZoneId()`.
Other than those few cases, canonicalization is not observable in ECMAScript code, which ensures that changes to the IANA Time Zone Database will have minimal impact on the behavior of existing applications.

### Variation between ECMAScript and other consumers of the IANA Time Zone Database

The IANA Time Zone Database can be built with different options that can change which time zones are equivalent.
ECMAScript implementations generally use build options that guarantee at least one canonical identifier for every <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 Alpha-2</a> country code, and that ensure that identifiers for different country codes are never equivalent.
This behavior avoids the risk that future political changes in one country can affect the behavior of ECMAScript code using a different country's time zones.

For example, the default build options consider Europe/Oslo, Europe/Stockholm, Europe/Copenhagen, and Europe/Berlin to be equivalent.
However, ECMAScript implementations generally do not treat those as equivalent.

## Custom time zones

To enable specialized applications to perform calculations in a time zone that is not built-in, a custom time zone can be implemented.
There are two ways to do this.

The recommended way is to create a class inheriting from `Temporal.TimeZone`.
You must use one of the built-in time zones as the "base time zone".
In the class's constructor, call `super()` with the identifier of a built-in time zone to serve as a base.
The class must override the `id` prototype property, and should override `toString()` and `toJSON()` to match.
Overriding all the other properties of `Temporal.TimeZone.prototype` is optional.
Any property that is not overridden will behave as in the base time zone.

The other, more difficult, way to create a custom time zone is to create a plain object implementing the `Temporal.TimeZone` protocol, without subclassing.
The object must have at least `getOffsetNanosecondsFor()` and `getPossibleInstantsFor()` methods, and an `id` property.
Any object with those three methods will return the correct output from any Temporal property or method.
However, most other code will assume that custom time zones act like built-in `Temporal.TimeZone` objects.
To interoperate with libraries or other code that you didn't write, then you should implement all the other `Temporal.TimeZone` members as well: `toString()`, `toJSON()`, `equals()`, `getOffsetStringFor()`, `getPlainDateTimeFor()`, `getInstantFor()`, `getNextTransition()`, `getPreviousTransition()`.

### Custom time zone identifiers

Identifiers of custom time zones are returned from the time zone's `id` getter (as well as `toString()` and `toJSON()`) and must follow the rules described in the [tzdata documentation](https://data.iana.org/time-zones/tzdb/theory.html#naming):

- A valid identifier has one or more components separated by slashes (`/`)
- Each component must consist of between one and 14 characters.
- Valid characters are ASCII letters, `.`, `-`, and `_`.
- `-` may not appear as the first character of a component, and a component may not be a single dot `.` nor two dots `..`.

If a custom time zone is not intended to be equivalent to any built-in time zone, then its `id` must not case-insensitively match the identifier of any IANA time zone.
A list of all IANA time zone identifiers is available [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

However, a custom time zone that is intended to be equivalent to a built-in time zone must return the same `id` as the corresponding built-in time zone.

## Constructor

### **new Temporal.TimeZone**(_timeZoneIdentifier_: string) : Temporal.TimeZone

**Parameters:**

- `timeZoneIdentifier` (string): A description of the time zone; either its IANA name, or a UTC offset.

**Returns:** a new `Temporal.TimeZone` object.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

The string `timeZoneIdentifier` is normalized before being used to determine the time zone.
For example, capitalization will be corrected to match the IANA Time Zone Database, and offsets like `+01` or `+0100` will be converted to ±HH:MM format like`+01:00`.
If no time zone can be determined from `timeZoneIdentifier`, then a `RangeError` is thrown.

Use this constructor directly if you have a string that is known to be a correct time zone identifier.
If you have an ISO 8601 date-time string, `Temporal.TimeZone.from()` is probably more convenient.

Example usage:

<!-- prettier-ignore-start -->
```javascript
new Temporal.TimeZone('UTC');            // => UTC
new Temporal.TimeZone('Etc/UTC');        // => Etc/UTC (Links are not followed)
new Temporal.TimeZone('Africa/Cairo');   // => Africa/Cairo
new Temporal.TimeZone('aSiA/TOKYO');     // => Asia/Tokyo (capitalization is normalized)
new Temporal.TimeZone('Asia/Kolkata');   // => Asia/Kolkata
new Temporal.TimeZone('Asia/Calcutta');  // => Asia/Calcutta (Links are not followed)
new Temporal.TimeZone('-04:00');         // => -04:00
new Temporal.TimeZone('-0400');          // => -04:00 (offset formats are normalized)
new Temporal.TimeZone('-04');            // => -04:00 (offset formats are normalized)

/* WRONG */ new Temporal.TimeZone('hi'); // => throws, not a time zone identifier
/* WRONG */ new Temporal.TimeZone('2020-01-13T16:31:00.06-08:00[America/Vancouver]');
   // => throws, use from() to parse time zones from ISO 8601 strings
```
<!-- prettier-ignore-end -->

#### Difference between IANA time zones and numeric UTC offsets

The returned time zone object behaves slightly differently, depending on whether an IANA time zone name is given (e.g., `Europe/Berlin`), or a numeric UTC offset (e.g., `+01:00`).
IANA time zones may have UTC offset transitions (e.g., because of DST), while the other kind never changes its offset.
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

Any other value is required to be a string in one of the following formats:

- A time zone identifier accepted by `new Temporal.TimeZone()`.
- A string like `2020-01-01[Asia/Tokyo]` or `2020-01-01T00:00+09:00[Asia/Tokyo]` in ISO 8601 format with a time zone identifier suffix in square brackets.
  When a time zone identifier suffix is present, any UTC offset outside the brackets will be ignored.
- An ISO 8601 string like `2020-01-01T00:00+09:00` that includes a numeric time zone offset, which results in a `Temporal.TimeZone` object with an identifier that is the normalized ±HH:MM form of the offset.
- An ISO 8601 string like `2020-01-01T00:00Z` that uses the Z offset designator, which results in a `Temporal.TimeZone` object with the identifier `"UTC"`.

This function is often more convenient to use than `new Temporal.TimeZone()` because it handles a wider range of input.

Usage examples:

<!-- prettier-ignore-start -->
```javascript
// IANA time zone names and UTC offsets
Temporal.TimeZone.from('UTC');           // => UTC
Temporal.TimeZone.from('Etc/UTC');       // => Etc/UTC (Links are not followed)
Temporal.TimeZone.from('Africa/Cairo');  // => Africa/Cairo
Temporal.TimeZone.from('aSiA/TOKYO');    // => Asia/Tokyo (capitalization is normalized)
Temporal.TimeZone.from('Asia/Kolkata');  // => Asia/Kolkata
Temporal.TimeZone.from('Asia/Calcutta'); // => Asia/Calcutta (Links are not followed)
Temporal.TimeZone.from('-04:00');        // => -04:00
Temporal.TimeZone.from('-0400');         // => -04:00 (offset formats are normalized)
Temporal.TimeZone.from('-04');           // => -04:00 (offset formats are normalized)

// ISO 8601 string with bracketed time zone identifier
Temporal.TimeZone.from('2020-01-13T16:31:00.06+09:00[Asia/Tokyo]'); // => Asia/Tokyo
Temporal.TimeZone.from('2020-01-14T00:31:00.06Z[Asia/Tokyo]');      // => Asia/Tokyo
Temporal.TimeZone.from('2020-01-13T16:31:00.06+09:00[+09:00]');     // => +09:00

// ISO 8601 string with only a time zone offset part
Temporal.TimeZone.from('2020-01-14T00:31:00.065858086Z');           // => UTC
Temporal.TimeZone.from('2020-01-13T16:31:00.065858086-08:00');      // => -08:00

// Existing TimeZone object
Temporal.TimeZone.from(Temporal.TimeZone.from('Asia/Tokyo'));       // => Asia/Tokyo

/* WRONG */ tz = Temporal.TimeZone.from('local');             // => throws, not a time zone
/* WRONG */ tz = Temporal.TimeZone.from('2020-01-14T00:31');  // => throws, no time zone
/* WRONG */ tz = Temporal.TimeZone.from('-08:00[Asia/Aden]'); // => throws, no date/time
```
<!-- prettier-ignore-end -->

## Properties

### timeZone.**id** : string

The `id` property gives an unambiguous identifier for the time zone.
This is the normalized version of whatever `timeZoneIdentifier` was passed as a parameter to the constructor.

When subclassing `Temporal.TimeZone`, this property must be overridden to provide an identifier for the custom time zone.
When overriding `id`, `toString()` and `toJSON()` should also be overridden.

## Methods

### timeZone.**equals**(_other_: Temporal.TimeZone | object | string) : boolean

**Parameters:**

- `other` (`Temporal.TimeZone` object, object implementing the `Temporal.TimeZone` protocol, or a string time zone identifier): Another time zone to compare.

**Returns:** `true` if `timeZone` and `other` are equivalent, or `false` if not.

Compares two time zones for equivalence.
Equality is determined by the following algorithm:

- If `timeZone === other`, then the time zones are equivalent.
- Otherwise, `timeZone.id` is compared to `other` (or `other.id` if `other` is an object).
  If any of the following conditions are true, then the time zones are equivalent:
  - Both string identifiers are Zone or Link names in the [IANA Time Zone Database](https://www.iana.org/time-zones), and they resolve to the same Zone name.
    This resolution is case-insensitive.
  - Both string identifiers are custom time zone identifiers that are equal according to `===`.
    This comparison is case-sensitive and does not normalize different Unicode characters.
  - Both identifiers are numeric offset time zone identifiers like "+05:30", and they represent the same offset.
- Otherwise, the time zones are not equivalent.

Note that "resolve to the same Zone name" noted above is behavior that can vary between ECMAScript and other consumers of the IANA Time Zone Database.
ECMAScript implementations generally do not allow identifiers to be equivalent if they represent different <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1 Alpha-2</a> country codes.
However, non-ECMAScript platforms may merge Zone names across country boundaries.
See [above](#variation-between-ecmascript-and-other-consumers-of-the-iana-time-zone-database) to learn more about this variation.

Time zones that resolve to different Zones in the IANA Time Zone Database are not equivalent, even if those Zones always use the same offsets.
Offset time zones and IANA time zones are also never equivalent.

Example usage:

<!-- prettier-ignore-start -->
```javascript
kolkata = Temporal.TimeZone.from('Asia/Kolkata');
kolkata.id; // => "Asia/Kolkata"
calcutta = Temporal.TimeZone.from('Asia/Calcutta');
calcutta.id; // => "Asia/Calcutta"
kolkata.equals(calcutta); // => true
kolkata.equals('Asia/Calcutta'); // => true
kolkata.equals('Asia/Colombo'); // => false

// IANA Time Zone Database identifiers are case insensitive
kolkata.equals('asia/calcutta'); // => true

// Offset time zones are never equivalent to named time zones
kolkata.equals('+05:30'); // => false
zeroOffset = Temporal.TimeZone.from('+00:00');
zeroOffset.equals('UTC'); // false

// For offset time zones, any valid format is accepted
zeroOffset.equals('+00:00'); // => true
zeroOffset.equals('+0000'); // => true
zeroOffset.equals('+00'); // => true

// Custom time zone identifiers are compared case-sensitively
class Custom1 extends Temporal.TimeZone {
  constructor() { super('UTC'); }
  get id() { return 'Moon/Cheese'; }
}
class Custom2 extends Temporal.TimeZone {
  constructor() { super('UTC'); }
  get id() { return 'Moon/CHEESE'; }
}
new Custom1().equals(new Custom1()); // => true
new Custom1().equals(new Custom2()); // => false
```
<!-- prettier-ignore-end -->

### timeZone.**getOffsetNanosecondsFor**(_instant_: Temporal.Instant | string) : number

**Parameters:**

- `instant` (`Temporal.Instant` or value convertible to one): The time for which to compute the time zone's UTC offset.

**Returns:** The UTC offset at the given time, in nanoseconds.

Since the UTC offset can change throughout the year in time zones that employ DST as well as because of special political decisions, this method queries the UTC offset at a particular time.

Note that `Temporal.TimeZone` objects constructed from an IANA time zone name may change offsets, depending on `instant`.
However, other time zones (some IANA time zones like `Etc/GMT+5` and all time zones constructed from numeric UTC offsets) have fixed offsets that never change, regardless of `instant`.

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

If `timeZone` is a time zone constructed from a numeric UTC offset, this method returns the same value as `timeZone.id`.

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
tz.id; // => '-08:00'
```

### timeZone.**getPlainDateTimeFor**(_instant_: Temporal.Instant | string, _calendar_?: object | string) : Temporal.PlainDateTime

**Parameters:**

- `instant` (`Temporal.Instant` or value convertible to one): An exact time to convert.
- `calendar` (optional object or string): A `Temporal.Calendar` object, or a plain object, or a calendar identifier.
  The default is to use the ISO 8601 calendar.

**Returns:** A `Temporal.PlainDateTime` object indicating the calendar date and wall-clock time in `timeZone`, according to the reckoning of `calendar`, at the exact time indicated by `instant`.

This method is one way to convert a `Temporal.Instant` to a `Temporal.PlainDateTime`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden, because the default implementation creates a `Temporal.PlainDateTime` from `instant` using a UTC offset which is the result of calling `timeZone.getOffsetNanosecondsFor()`.

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

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like Moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

During "skipped" clock time like, e.g., the hour after DST starts in the spring, this method interprets invalid times using the pre-transition time zone offset if `'compatible'` or `'later'` is used, or the post-transition time zone offset if `'earlier'` is used.
This behavior avoids exceptions when converting nonexistent `Temporal.PlainDateTime` values to `Temporal.Instant`, but it also means that values during these periods will result in a different `Temporal.PlainDateTime` in "round-trip" conversions to `Temporal.Instant` and back again.

For usage examples and a more complete explanation of how this disambiguation works and why it is necessary, see [Resolving ambiguity](./ambiguity.md).

If the result is earlier or later than the range that `Temporal.Instant` can represent (approximately half a million years centered on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)), then a `RangeError` will be thrown, no matter the value of `disambiguation`.

When subclassing `Temporal.TimeZone`, this method doesn't need to be overridden, because the default implementation calls `timeZone.getPossibleInstantsFor()`, and, if there is more than one possible instant, uses `disambiguation` to pick which one to return.

### timeZone.**getPossibleInstantsFor**(_dateTime_: Temporal.PlainDateTime | object | string) : array&lt;Temporal.Instant&gt;

**Parameters:**

- `dateTime` (`Temporal.PlainDateTime` or value convertible to one): A calendar date and wall-clock time to convert.

**Returns:** An array of `Temporal.Instant` objects, which may be empty.

This method returns an array of all the possible exact times that could correspond to the calendar date and wall-clock time indicated by `dateTime`.

If `dateTime` is not a `Temporal.PlainDateTime` object, then it will be converted to one as if it were passed to `Temporal.PlainDateTime.from()`.

Normally there is only one possible exact time corresponding to a wall-clock time, but around a daylight saving or other offset change, a wall-clock time may not exist, or the same wall-clock time may exist twice.
See [Resolving ambiguity](./ambiguity.md) for usage examples and a more complete explanation.

Although this method is useful for implementing a custom time zone or custom disambiguation behavior, but otherwise `getInstantFor()` should be used instead, because it is more convenient, because it's compatible with the behavior of other methods and libraries, and because it always returns a single value.
For example, during "skipped" clock time like the hour after DST starts in the spring, `getPossibleInstantsFor()` returns an empty array while `getInstantFor()` returns a `Temporal.Instant`.

### timeZone.**getNextTransition**(_startingPoint_: Temporal.Instant | string) : Temporal.Instant

**Parameters:**

- `startingPoint` (`Temporal.Instant` or value convertible to one): Time after which to find the next UTC offset transition.

**Returns:** A `Temporal.Instant` object representing the next UTC offset transition in this time zone, or `null` if no transitions later than `startingPoint` could be found.

This method is used to calculate a possible future UTC offset transition after `startingPoint` for this time zone.
A "transition" is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops.
Transitions can also be caused by other political changes like a country permanently changing the UTC offset of its time zone.

The returned `Temporal.Instant` will represent the first nanosecond where the new UTC offset is used, not the last nanosecond where the previous UTC offset is used.

When no more transitions are expected, this method will return `null`.
Some time zones (e.g., `Etc/GMT+5` or `-05:00`) have no offset transitions and will return `null` for all values of `startingPoint`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method should be overridden if the time zone changes offsets.
Single-offset time zones can use the default implementation which returns `null`.

Example usage:

```javascript
// How long until the next offset change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
nextTransition = tz.getNextTransition(now);
duration = nextTransition.since(now);
duration.toLocaleString(); // output will vary
```

### timeZone.**getPreviousTransition**(_startingPoint_: Temporal.Instant | string) : Temporal.Instant

**Parameters:**

- `startingPoint` (`Temporal.Instant` or value convertible to one): Time before which to find the previous UTC offset transition.

**Returns:** A `Temporal.Instant` object representing the previous UTC offset transition in this time zone, or `null` if no transitions earlier than `startingPoint` could be found.

This method is used to calculate a possible past UTC offset transition before `startingPoint` for this time zone.
A "transition" is a point in time where the UTC offset of a time zone changes, for example when Daylight Saving Time starts or stops.
Transitions can also be caused by other political changes like a country permanently changing the UTC offset of its time zone.

The returned `Temporal.Instant` will represent the first nanosecond where the new UTC offset is used, not the last nanosecond where the previous UTC offset is used.

When no previous transitions exist, this method will return `null`.
Some time zones (e.g., `Etc/GMT+5` or `-05:00`) have no offset transitions and will return `null` for all values of `startingPoint`.

If `instant` is not a `Temporal.Instant` object, then it will be converted to one as if it were passed to `Temporal.Instant.from()`.

When subclassing `Temporal.TimeZone`, this method should be overridden if the time zone changes offsets.
Single-offset time zones can use the default implementation which returns `null`.

Example usage:

```javascript
// How long until the previous offset change from now, in the current location?
tz = Temporal.Now.timeZone();
now = Temporal.Now.instant();
previousTransition = tz.getPreviousTransition(now);
duration = now.since(previousTransition);
duration.toLocaleString(); // output will vary
```

### timeZone.**toString**() : string

**Returns:** The string given by `timeZone.id`.

By overriding `Object.prototype.toString()`, this method ensures that coercing a `Temporal.TimeZone` to a string will yield its identifier.

This capability allows allows `Temporal.TimeZone` instances to be used in contexts where a time zone identifier string is expected, like the `timeZone` option of the `Intl.DateTimeFormat` constructor.

```javascript
ins = Temporal.Instant.from('2020-06-10T00:00Z');
timeZone = Temporal.TimeZone.from('America/Chicago');
new Intl.DateTimeFormat('en', { timeZone: timeZone.id }).format(ins); // => '6/9/2020, 7:00:00 PM'
new Intl.DateTimeFormat('en', { timeZone }).format(ins); // => '6/9/2020, 7:00:00 PM'
```

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
