# Duration Balancing

With most types in Temporal, each unit has a natural maximum.
For example, there is no such time as 11:87, so when creating a `Temporal.PlainTime` from 11:87 the time is either clipped to 11:59 ("constrain" mode) or an exception is thrown ("reject" mode).

With [`Temporal.Duration`](./duration.md), however, maximums are less clear-cut.
Take, for example, a duration of 100 seconds: `Temporal.Duration.from({ seconds: 100 })`.
100 seconds is equal to 1 minute and 40 seconds.
In some cases you may want to "balance" it, yielding 1 minute and 40 seconds.
In other cases you may want to keep it as an "unbalanced" duration of 100 seconds.

When a `Temporal.Duration` object is constructed from a string or a property bag object, no balancing is performed.

```javascript
d = Temporal.Duration.from({ seconds: 100 });
d.minutes; // => 0
d.seconds; // => 100
d = Temporal.Duration.from('PT100S');
d.minutes; // => 0
d.seconds; // => 100
```

The most common kind of unbalanced duration is a "top-heavy" duration where only the largest nonzero unit is unbalanced, e.g. `{ days: 45, hours: 10 }`.
Unbalanced durations that are not top-heavy, like `{ days: 4, hours: 60 }`, are rarely used.

## Balancing Durations with `round()`

`Temporal.Duration.prototype.round()`, in addition to rounding duration units at the low end, can also balance durations too.

By default, `round()` will not enlarge a top-heavy unbalanced duration.
By default, the largest unit in the input will be largest unit in the output.

```javascript
d = Temporal.Duration.from({ minutes: 80, seconds: 30 }); // => PT80M30S
d.round({ largestUnit: 'auto' }); // => PT80M30S (unchanged)
```

However, `round()` will balance units smaller than the largest one.
This only matters in the rare case that an unbalanced duration isn't top-heavy.

<!-- prettier-ignore-start -->
```javascript
d = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d.round({ largestUnit: 'auto' });
  // => PT81M30S (seconds balance to minutes, but not minutes=>hours)
```
<!-- prettier-ignore-end -->

To fully balance a duration, use the `largestUnit` option:

```javascript
d = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d.round({ largestUnit: 'hour' }); // => PT1H21M30S (fully balanced)
```

## Balancing Relative to a Reference Point

Balancing that includes days, weeks, months, and years is more complicated because those units can be different lengths.
In the default ISO 8601 calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days.
In other calendars, years aren't always 12 months long and weeks aren't always 7 days.
Finally, in time zones that use Daylight Saving Time (DST) days are not always 24 hours long.

Therefore, any `Duration` object with nonzero days, weeks, months, or years can refer to a different length of time depending on the specific date and time that it starts from.
To handle this potential ambiguity, the `relativeTo` option is used to provide a starting point.
`relativeTo` must be (or be parseable into) a `Temporal.ZonedDateTime` for timezone-specific durations or `Temporal.PlainDate` for timezone-neutral data.
`relativeTo` is required when balancing to or from weeks, months, or years.

```javascript
d = Temporal.Duration.from({ days: 370 }); // => P370D
/* WRONG */ d.round({ largestUnit: 'year' }); // => RangeError (`relativeTo` is required)
d.round({ largestUnit: 'year', relativeTo: '2019-01-01' }); // => P1Y5D
d.round({ largestUnit: 'year', relativeTo: '2020-01-01' }); // => P1Y4D (leap year)
```

`relativeTo` is optional when balancing to or from `days`, and if `relativeTo` is omitted then days are assumed to be 24 hours long.
However, if the duration is timezone-specific, then it's recommended to use a `Temporal.ZonedDateTime` reference point to ensure that DST transitions are accounted for.

<!-- prettier-ignore-start -->
```javascript
d = Temporal.Duration.from({ hours: 48 }); // => PT48H
d.round({ largestUnit: 'day' });
  // => P2D
d.round({ largestUnit: 'day', relativeTo: '2020-03-08T00:00-08:00[America/Los_Angeles]' });
  // => P2DT1H
  // (because one clock hour was skipped by DST starting)
```
<!-- prettier-ignore-end -->

## Balancing in Duration Arithmetic

In addition to `round()` as described above, `add()` and `subtract()` also balance their output into either a fully-balanced or a top-heavy duration depending on the `largestUnit` option.

By default, `add()` and `subtract()` on `Temporal.Duration` instances will only balance up to the largest unit in either input duration.

```javascript
d1 = Temporal.Duration.from({ hours: 26, minutes: 45 }); // => PT26H45M
d2 = Temporal.Duration.from({ minutes: 30 }); // => PT30M
d1.add(d2); // => PT27H15M
```

The `largestUnit` option can be used to balance to larger units than the inputs.

```javascript
d1 = Temporal.Duration.from({ minutes: 80, seconds: 90 }); // => PT80M90S
d2 = Temporal.Duration.from({ minutes: 100, seconds: 15 }); // => PT100M15S
d1.add(d2).round({ largestUnit: 'hour' }); // => PT3H1M45S (fully balanced)
```

The `relativeTo` option can be used to balance to, or from, weeks, months or years (or days for timezone-aware durations).
`relativeTo` is interpreted relative to `this`, not to `other`, which allows the same `relativeTo` value to be used for a chain of arithmetic operations.

<!-- prettier-ignore-start -->
```javascript
d1 = Temporal.Duration.from({ hours: 48 }); // => PT48H
d2 = Temporal.Duration.from({ hours: 24 }); // => PT24H
d1.add(d2).round({ largestUnit: 'day' });
  // => P3D
d1.add(d2).round({ largestUnit: 'day', relativeTo: '2020-03-08T00:00-08:00[America/Los_Angeles]' });
  // => P3DT1H
  // (because one clock hour was skipped by DST starting)
```
<!-- prettier-ignore-end -->

## Serialization of Fractional Seconds

Normally, any Temporal object can be serialized to a string with its `toString()` method, and deserialized by calling `from()` on the string.
This goes for `Temporal.Duration` as well.
However, if any of the `milliseconds`, `microseconds`, or `nanoseconds` properties are greater than 999, then `Temporal.Duration.from(duration.toString())` will not yield an identical `Temporal.Duration` object.
The deserialized object will represent an equally long duration, but the sub-second fields will be balanced with the `seconds` field so that they become 999 or less.
For example, 1000 nanoseconds will become 1 microsecond.

This is because the ISO 8601 string format for durations, which is used for serialization for reasons of interoperability, does not allow for specifying sub-second units separately, only as a decimal fraction of seconds.
If you need to serialize a `Temporal.Duration` into a string that preserves unbalanced sub-second fields, you will need to use a custom serialization format or serialize it into an object or JSON instead.
