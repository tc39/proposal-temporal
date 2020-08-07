# Duration balancing

With most types in Temporal, each unit has a natural maximum.
For example, there is no such time as 11:87, so when creating a `Temporal.Time` from 11:87 the time is either clipped to 11:59 ("constrain" mode) or an exception is thrown ("reject" mode).

## Constructing a duration

With [`Temporal.Duration`](./duration.md), however, maximums are less clear-cut.
Take, for example, a duration of 100 seconds: `Temporal.Duration.from({ seconds: 100 })`.
100 seconds is equal to 1 minute and 40 seconds. Instead of clipping this to 59 seconds it's more likely that we would want to "balance" it, wrapping 60 seconds around to 0 to make 1 minute and 40 seconds.
However, it's an equally valid use case to want to track the duration of something in seconds only, and not balance the duration to 1 minute and 40 seconds.

What is done with the duration depends on the `disambiguation` option when creating the `Temporal.Duration` object.
Unlike with the other Temporal types, constrain mode doesn't clip the seconds value to 59, and reject mode doesn't throw.
They just leave the value as it is.
Balance mode lets you opt in to the balancing behaviour:

```javascript
d = Temporal.Duration.from({ seconds: 100 }, { disambiguation: 'balance' });
d.minutes  // => 1
d.seconds  // => 40
```

Balancing between the different units of durations excludes years and months, because years and months can have different lengths.
In the default ISO calendar, a year can be 365 or 366 days, and a month can be 28, 29, 30, or 31 days.
Therefore, any `Duration` object with nonzero years or months can refer to a different length of time depending on when the start date is.
No balancing is ever performed between years, months, and days, because such conversion would be ambiguous.
If you need such a conversion, you must implement it yourself, since the rules can depend on the start date and the calendar in use.

`Temporal.Duration` fields are not allowed to have mixed signs.
For example, passing one positive and one negative argument to `new Temporal.Duration()` or as properties in the object passed to `Temporal.Duration.from()` will always throw an exception, regardless of the disambiguation mode.

Therefore, the only case where constrain and reject mode have any effect when creating a duration, is integer overflow.
If one of the values overflows, constrain mode will cap it to `Number.MAX_VALUE` or `-Number.MAX_VALUE`.

## Duration arithmetic

When adding two `Temporal.Duration`s of opposite sign, or subtracting two durations of the same sign, the situation is different.
As well as the same possibility of integer overflow, the fields may also need to be balanced.

Consider a duration of 90 minutes, from which is subtracted 30 seconds.
Subtracting the fields directly would result in 90 minutes and &minus;30 seconds, which is invalid.
Therefore, it's necessary to balance the seconds with the minutes, resulting in 89 minutes and 30 seconds.

By default, the fields of the resulting duration are only converted between each other if one unit is negative but a larger unit is positive, or vice versa, in which case the smaller is balanced with the larger to avoid having mixed-sign fields.

That's not all the balancing that _could_ be done on the resulting value.
It could further be balanced into 1 hour, 29 minutes, and 30 seconds.
However, that would likely conflict with the intention of having a duration of 90 minutes in the first place, so this should be behaviour that the Temporal user opts in to.
Here, we make a distinction between "necessary balancing" and "optional balancing".

In order to accommodate this, the `disambiguation` option when performing arithmetic on `Temporal.Duration`s is different from all the other arithmetic methods' disambiguation options.
Necessary balancing is called `constrain` mode, because values are constrained to be non-negative through balancing.
Optional balancing is called `balance` mode.
The usual `reject` mode is also available, and does the same thing as `constrain` but throws on integer overflow.

The default is `constrain` mode.
The `balance` mode is only provided for convenience, since the following code snippets give the same result:

```javascript
duration3 = duration1.minus(duration2, { disambiguation: 'balance' });

tmp = duration1.minus(duration2);
// duration3 = Temporal.Duration.from(tmp, { disambiguation: 'balance' }); - FIXME: https://github.com/tc39/proposal-temporal/issues/232
duration3 = tmp.with(tmp, { disambiguation: 'balance' });
```

Here are some more examples of what each mode does:

```javascript
// Simple, no balancing possible
one = Temporal.Duration.from({ hours: 3 });
two = Temporal.Duration.from({ hours: 1 });
one.minus(two);                                 // => PT2H
one.minus(two, { disambiguation: 'balance' });  // => PT2H

// Balancing possible but not necessary
one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ minutes: 60 });
one.minus(two);                                 // => PT120M
one.minus(two, { disambiguation: 'balance' });  // => PT2H

// Some balancing necessary, more balancing possible
one = Temporal.Duration.from({ minutes: 180 });
two = Temporal.Duration.from({ seconds: 30 });
one.minus(two);                                 // => PT179M30S
one.minus(two, { disambiguation: 'balance' });  // => PT2H59M30S

// Balancing necessary, result is positive
one = Temporal.Duration.from({ hours: 4, minutes: 15 });
two = Temporal.Duration.from({ hours: 2, minutes: 30 });
one.minus(two);                                 // => PT1H45M
one.minus(two, { disambiguation: 'balance' });  // => PT1H45M

// Result is negative
one = Temporal.Duration.from({ hours: 2, minutes: 30 });
two = Temporal.Duration.from({ hours: 3 });
one.minus(two);                                 // -PT30M
one.minus(two, { disambiguation: 'balance' });  // -PT30M

// Unbalanceable units, but also no balancing possible
one = Temporal.Duration.from({ months: 3, days: 15 });
two = Temporal.Duration.from({ days: 10 });
one.minus(two);                                 // => P3M5D
one.minus(two, { disambiguation: 'balance' });  // => P3M5D

// Result is in theory positive in the ISO calendar, but unbalanceable units
one = Temporal.Duration.from({ months: 3, days: 15 });
two = Temporal.Duration.from({ days: 30 });
one.minus(two);                                 // throws
one.minus(two, { disambiguation: 'balance' });  // throws
```

## Serialization

Normally, any Temporal object can be serialized to a string with its `toString()` method, and deserialized by calling `from()` on the string.
This goes for `Temporal.Duration` as well.
However, if any of the `milliseconds`, `microseconds`, or `nanoseconds` properties are greater than 999, then `Temporal.Duration.from(duration.toString())` will not yield an identical `Temporal.Duration` object.
The deserialized object will represent an equally long duration, but the sub-second fields will be balanced with the `seconds` field so that they become 999 or less.
For example, 1000 nanoseconds will become 1 microsecond.

This is because the ISO 8601 string format for durations, which is used for serialization for reasons of interoperability, does not allow for specifying sub-second units separately, only as a decimal fraction of seconds.
If you need to serialize a `Temporal.Duration` in a way that will preserve unbalanced sub-second fields, you will need to use a custom serialization format.
