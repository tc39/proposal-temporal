# Temporal.TimeZone

A `Temporal.TimeZone` is a representation of a time zone: either an [IANA time zone](https://www.iana.org/time-zones), including information about the time zone such as the offset between the local time and UTC at a particular time, and daylight saving time (DST) changes; or simply a particular UTC offset with no DST.

Since `Temporal.Absolute` and `Temporal.DateTime` do not contain any time zone information, a `Temporal.TimeZone` object is required to convert between the two.

Finally, the `Temporal.TimeZone` object itself provides access to a list of the time zones in the IANA time zone database.

## Constructor

### **new Temporal.TimeZone**(_timeZoneIdentifier_: string) : Temporal.TimeZone

**Parameters:**
- `timeZoneIdentifier` (string): A description of the time zone; either its IANA name, or a UTC offset.

**Returns:** a new `Temporal.TimeZone` object.

For a list of IANA time zone names, see the current version of the [IANA time zone database](https://www.iana.org/time-zones).
A convenient list is also available [on Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), although it might not reflect the latest official status.

The string `timeZoneIdentifier` is canonicalized before being used to determine the time zone.
For example, values like `+100` will be understood to mean `+01:00`, and capitalization will be corrected.
If no time zone can be determined from `timeZoneIdentifier`, then a `RangeError` is thrown.

Example usage:
```javascript
tz = new Temporal.TimeZone('UTC');
tz = new Temporal.TimeZone('Africa/Cairo');
tz = new Temporal.TimeZone('america/VANCOUVER');
tz = new Temporal.TimeZone('Asia/Katmandu');  // alias of Asia/Kathmandu
tz = new Temporal.TimeZone('-04:00');
tz = new Temporal.TimeZone('+645');
/* WRONG */ tz = new Temporal.TimeZone('local');  // not a time zone, throws
```

#### Difference between IANA time zones and UTC offsets

The returned time zone object behaves slightly differently depending on whether an IANA time zone name (e.g. `Europe/Berlin`) is given, or a UTC offset (e.g. `+01:00`).
IANA time zones may have DST transitions, and UTC offsets do not.
For example:

```javascript
tz1 = new Temporal.TimeZone('-08:00');
tz2 = new Temporal.TimeZone('America/Vancouver');
now = Temporal.now.absolute();
tz1.getTransitions(now).next().done;  // => true
tz2.getTransitions(now).next().done;  // => false
```

## Static methods

### **Temporal.TimeZone**: iterator<Temporal.TimeZone>

The `Temporal.TimeZone` object is itself iterable, and can be used to iterate through all of the IANA time zones supported by the implementation.

Example usage:

```javascript
// List all supported IANA time zones
for (let zone of Temporal.TimeZone) console.log(zone.name);
// example output:
// Africa/Abidjan
// Africa/Accra
// Africa/Addis_Ababa
// ...and many more
```

## Properties

### timeZone.**name** : string

The `name` property gives an unambiguous identifier for the time zone.
Effectively, this is the canonicalized version of whatever `timeZoneIdentifier` was passed as a parameter to the constructor.

## Methods

### timeZone.**getOffsetFor**(_absolute_: Temporal.Absolute) : string

**Parameters:**
- `absolute` (`Temporal.Absolute`): The time for which to compute the time zone's UTC offset.

**Returns**: a string indicating the UTC offset at the given time.

Since the UTC offset can change throughout the year in time zones that employ DST, this method queries the UTC offset at a particular time.

Note that only `Temporal.TimeZone` objects constructed from an IANA time zone name may have DST transitions; those constructed from a UTC offset do not.
If `timeZone` is a UTC offset time zone, the return value of this method is effectively the same as `timeZone.name`.

Example usage:
```javascript
// Getting the UTC offset for a time zone at a particular time
timestamp = new Temporal.Absolute(1553993100000000000n);
tz = new Temporal.TimeZone('Europe/Berlin');
tz.getOffsetFor(timestamp);  // => +01:00

// TimeZone with a fixed UTC offset
tz = new Temporal.TimeZone('-08:00');
tz.getOffsetFor(timestamp);  // => -08:00
// UTC is always 0 offset
tz = new Temporal.TimeZone('UTC');
tz.getOffsetFor(timestamp);  // => +00:00
```

### timeZone.**getDateTimeFor**(_absolute_: Temporal.Absolute) : Temporal.DateTime

**Parameters:**
- `absolute` (`Temporal.Absolute`): An absolute time to convert.

**Returns:** A `Temporal.DateTime` object indicating the calendar date and wall-clock time in `timeZone` at the absolute time indicated by `absolute`.

This method is one way to convert a `Temporal.Absolute` to a `Temporal.DateTime`.

Example usage:

```javascript
// Converting a specific absolute time to a calendar date / wall-clock time
timestamp = new Temporal.Absolute(1553993100000000000n);
tz = new Temporal.TimeZone('Europe/Berlin');
tz.getDateTimeFor(timestamp);  // => 2019-03-31T01:45

// What time was the Unix Epoch (timestamp 0) in Bell Labs (Murray Hill, New Jersey, USA)?
epoch = new Temporal.Absolute(0n);
tz = new Temporal.TimeZone('America/New_York');
tz.getDateTimeFor(epoch);  // => 1969-12-31T19:00
```

### timeZone.**getAbsoluteFor**(_dateTime_: Temporal.DateTime, _disambiguation_: 'earlier' | 'later' | 'reject' = 'earlier') : Temporal.Absolute

**Parameters:**
- `dateTime` (`Temporal.DateTime`): A calendar date and wall-clock time to convert.
- `disambiguation` (optional `string`): How to disambiguate if the date and time given by `dateTime` does not exist in the time zone, or exists more than once.
  Allowed values are `earlier`, `later`, and `reject`.
  The default is `earlier`.

**Returns:** A `Temporal.Absolute` object indicating the absolute time in `timeZone` at the time of the calendar date and wall-clock time from `dateTime`.

This method is one way to convert a `Temporal.DateTime` to a `Temporal.Absolute`.

#### Resolving ambiguity

> This explanation was adapted from the [moment-timezone documentation](https://github.com/moment/momentjs.com/blob/master/docs/moment-timezone/01-using-timezones/02-parsing-ambiguous-inputs.md).

This conversion is not necessarily one-to-one.
Due to DST time changes, there is a possibility that a wall-clock time either does not exist, or has existed twice.
The `disambiguation` argument controls what absolute time to return in the case of ambiguity:
- `earlier` (the default): The earlier of the two possible absolute times will be returned.
- `later`: The later of the two possible absolute times will be returned.
- `reject`: A `RangeError` will be thrown.

When entering DST, clocks move forward an hour.
In reality, it is not time that is moving, it is the offset moving.
Moving the offset forward gives the illusion that an hour has disappeared.
As the clock ticks, you can see it move from 1:58 to 1:59 to 3:00.
It is easier to see what is actually happening when you include the offset.

```
1:58 +1
1:59 +1
3:00 +2
3:01 +2
```

The result is that any time between 1:59:59 and 3:00:00 never actually happened.
In `earlier` mode, the absolute time will skip backwards by the amount of the DST gap (usually 1 hour).
In `later` mode, the absolute time will skip forwards by the amount of the DST gap.

```javascript
tz = new Temporal.TimeZone('Europe/Berlin');
dt = new Temporal.DateTime(2019, 3, 31, 2, 45);
tz.getAbsoluteFor(dt, 'earlier');  // => 2019-03-31T00:45Z
tz.getAbsoluteFor(dt, 'later');    // => 2019-03-31T01:45Z
tz.getAbsoluteFor(dt, 'reject');   // throws
```

In this example, the wall-clock time 2:45 doesn't exist, so it is treated as either 1:45 +01:00 or 3:45 +02:00.

Likewise, at the end of DST, clocks move backward an hour.
In this case, the illusion is that an hour repeats itself.
In `earlier` mode, the absolute time will be the earlier instance of the duplicated wall-clock time.
In `later` mode, the absolute time will be the later instance of the duplicated time.

```javascript
tz = new Temporal.TimeZone('America/Sao_Paulo');
dt = new Temporal.DateTime(2019, 2, 16, 23, 45);
tz.getAbsoluteFor(dt, 'earlier');  // => 2019-02-17T01:45Z
tz.getAbsoluteFor(dt, 'later');    // => 2019-02-17T02:45Z
tz.getAbsoluteFor(dt, 'reject');   // throws
```

In this example, the wall-clock time 23:45 exists twice.

> *Compatibility Note*: The built-in behaviour of the Moment Timezone and Luxon libraries is to give the same result as `earlier` when turning the clock back, and `later` when setting the clock forward.

### timeZone.**getTransitions**(_startingPoint_: Temporal.Absolute) : iterator<Temporal.Absolute>

**Parameters:**
- `startingPoint` (`Temporal.Absolute`): Time after which to start calculating DST transitions.

**Returns:** An iterable yielding `Temporal.Absolute` objects indicating subsequent DST transitions in the given time zone.

This method is used to calculate future DST transitions for the time zone, starting at `startingPoint`.

Note that if the time zone was constructed from a UTC offset, there will be no DST transitions.
In that case, the iterable will be empty.

Example usage:

```javascript
// How long until the next DST change from now, in the current location?
tz = Temporal.now.timeZone();
now = Temporal.now.absolute();
[nextTransition] = tz.getTransitions(now);
duration = nextTransition.difference(now);
duration.toLocaleString();  // output will vary
```

### timeZone.**toString**() : string

**Returns:** The string given by `timeZone.name`.

This method overrides `Object.prototype.toString()` and provides the time zone's `name` property as a human-readable description.
