# Resolving ambiguity

> This explanation was adapted from the [moment-timezone documentation](https://github.com/moment/momentjs.com/blob/master/docs/moment-timezone/01-using-timezones/02-parsing-ambiguous-inputs.md).

Converting a [`Temporal.DateTime`](./datetime.md) wall-clock time to a [`Temporal.Absolute`](./absolute.md) is not necessarily a one-to-one conversion.
Due to DST time changes, there is a possibility that a wall-clock time either does not exist, or has existed twice.

There are two mostly equivalent methods that accomplish this conversion: [`Temporal.DateTime.prototype.toAbsolute`](./datetime.html#toAbsolute) and [`Temporal.TimeZone.prototype.getAbsoluteFor`](./timezone.html#getAbsoluteFor).
The `disambiguation` option to these methods controls what absolute time to return in the case of ambiguity:

- `'compatible'` (the default): Acts like `'earlier'` for backward transitions and `'later'` for forward transitions.
- `'earlier'`: The earlier of two possible absolute times will be returned.
- `'later'`: The later of two possible absolute times will be returned.
- `'reject'`: A `RangeError` will be thrown.

When interoperating with existing code or services, `'compatible'` mode matches the behavior of legacy `Date` as well as libraries like moment.js, Luxon, and date-fns.
This mode also matches the behavior of cross-platform standards like [RFC 5545 (iCalendar)](https://tools.ietf.org/html/rfc5545).

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
In `'earlier'` mode, the absolute time that is returned will be as if the post-change UTC offset had continued before the change, effectively skipping backwards by the amount of the DST gap (usually 1 hour).
In `'later'` mode, the absolute time that is returned will be as if the pre-change UTC offset had continued after the change, effectively skipping forwards by the amount of the DST gap.
In `'compatible'` mode, the same time is returned as `'later'` mode, which matches the behavior of existing JavaScript code that uses legacy `Date`.

```javascript
tz = new Temporal.TimeZone('Europe/Berlin');
dt = new Temporal.DateTime(2019, 3, 31, 2, 45);
tz.getAbsoluteFor(dt, { disambiguation: 'earlier' }); // => 2019-03-31T00:45Z
tz.getAbsoluteFor(dt, { disambiguation: 'later' }); // => 2019-03-31T01:45Z
tz.getAbsoluteFor(dt, { disambiguation: 'compatible' }); // => 2019-03-31T01:45Z
tz.getAbsoluteFor(dt, { disambiguation: 'reject' }); // throws
```

In this example, the wall-clock time 2:45 doesn't exist, so it is treated as either 1:45 +01:00 or 3:45 +02:00, which can be seen by converting the absolute back to a wall-clock time in the time zone:

```javascript
tz.getAbsoluteFor(dt, { disambiguation: 'earlier' }).toDateTime(tz); // => 2019-03-31T01:45
tz.getAbsoluteFor(dt, { disambiguation: 'later' }).toDateTime(tz); // => 2019-03-31T03:45
tz.getAbsoluteFor(dt, { disambiguation: 'compatible' }).toDateTime(tz); // => 2019-03-31T03:45
```

Using [`Temporal.TimeZone.prototype.getPossibleAbsolutesFor`](./timezone.html#getPossibleAbsolutesFor) we can show that the wall-clock time doesn't exist:

```javascript
tz.getPossibleAbsolutesFor(dt); // => []
```

Likewise, at the end of DST, clocks move backward an hour.
In this case, the illusion is that an hour repeats itself.
In `'earlier'` mode, the absolute time will be the earlier instance of the duplicated wall-clock time.
In `'later'` mode, the absolute time will be the later instance of the duplicated time.
In `'compatible'` mode, the same time is returned as `'earlier'` mode, which matches the behavior of existing JavaScript code that uses legacy `Date`.

```javascript
tz = new Temporal.TimeZone('America/Sao_Paulo');
dt = new Temporal.DateTime(2019, 2, 16, 23, 45);
dt.toAbsolute(tz, { disambiguation: 'earlier' }); // => 2019-02-17T01:45Z
dt.toAbsolute(tz, { disambiguation: 'later' }); // => 2019-02-17T02:45Z
dt.toAbsolute(tz, { disambiguation: 'compatible' }); // => 2019-02-17T01:45Z
dt.toAbsolute(tz, { disambiguation: 'reject' }); // throws
```

In this example, the wall-clock time 23:45 exists twice, which can also be verified with `getPossibleAbsolutesFor`:

```javascript
tz.getPossibleAbsolutesFor(dt); // => [2019-02-17T01:45Z, 2019-02-17T02:45Z]
```
