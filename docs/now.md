# `Temporal.now`

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

The `Temporal.now` object has several methods which give information about the current time and date.

## Methods

### Temporal.now.**absolute**() : Temporal.Absolute

**Returns:** a `Temporal.Absolute` object representing the current system time.

This method gets the current absolute system time, without regard to calendar or time zone.
This is a good way to get a timestamp for an event, for example.
It works like the old-style JavaScript `Date.now()`, but with nanosecond accuracy instead of milliseconds.

Example usage:
```js
function timeit(func) {
    start = Temporal.now.absolute();
    try {
        return func();
    } finally {
        end = Temporal.now.absolute();
        console.log(`The function took ${end.difference(start)}`);
    }
}
timeit(() => JSON.parse(someData));
// example output:
// The function took PT0.001031756S
```

### Temporal.now.**timeZone**() : Temporal.TimeZone

**Returns:** a `Temporal.TimeZone` object representing the time zone according to the current system settings.

This method gets the current system time zone.
This will usually be a named [IANA time zone](https://www.iana.org/time-zones), as that is how most people configure their computers.

Example usage:
```js
// When is the next daylight saving change from now, in the current location?
tz = Temporal.now.timeZone();
now = Temporal.now.absolute();
[nextTransition] = tz.getTransitions(now);
before = tz.getOffsetStringFor(nextTransition.minus({nanoseconds: 1}));
after = tz.getOffsetStringFor(nextTransition.plus({nanoseconds: 1}));
console.log(`On ${nextTransition.inTimeZone(tz)} the clock will change from UTC ${before} to ${after}`);
nextTransition.inTimeZone(tz);
// example output:
// On 2020-03-08T03:00 the clock will change from UTC -08:00 to -07:00
```

### Temporal.now.**dateTime**(_timeZone_: object | string = Temporal.now.timeZone()) : Temporal.DateTime

**Parameters:**
- `timeZone` (optional object or string): The time zone to get the current date and time in, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.DateTime` object representing the current system date and time.

This method gets the current calendar date and wall-clock time according to the system settings.
Optionally a time zone can be given in which the time is computed.

Example usage:
```js
financialCentres = {
    'New York': 'America/New_York',
    'London': 'Europe/London',
    'Tokyo': 'Asia/Tokyo',
};
console.log(`Here: ${Temporal.now.dateTime()}`);
Object.entries(financialCentres).forEach(([name, timeZone]) => {
    console.log(`${name}: ${Temporal.now.dateTime(timeZone)}`);
});
// example output:
// Here: 2020-01-24T21:51:02.142905166
// New York: 2020-01-25T00:52:14.756462142
// London: 2020-01-25T05:52:14.758534756
// Tokyo: 2020-01-25T14:52:14.759534758
```

### Temporal.now.**date**(_timeZone_: object | string = Temporal.now.timeZone()) : Temporal.Date

**Parameters:**
- `timeZone` (optional object or string): The time zone to get the current date and time in, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.Date` object representing the current system date.

Example usage:
```js
// Is it Leap Day?
date = Temporal.now.date();
if (date.month === 2 && date.day === 29) console.log('Leap Day!');
```

### Temporal.now.**time**(_timeZone_: object | string = Temporal.now.timeZone()) : Temporal.Time

**Parameters:**
- `timeZone` (optional object or string): The time zone to get the current date and time in, as a `Temporal.TimeZone` object, an object implementing the [time zone protocol](./timezone.md#protocol), or a string.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.Time` object representing the current system time.

This method gets the current wall-clock time according to the system settings.
Optionally a time zone can be given in which the time is computed.

Example usage:
```js
// Is it lunchtime?
time = Temporal.now.time();
if (time.hour === 12) console.log('Lunchtime!');
```
