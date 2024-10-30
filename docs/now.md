# `Temporal.Now`

<details>
  <summary><strong>Table of Contents</strong></summary>
<!-- toc -->
</details>

The `Temporal.Now` object has several methods which give information about the current time and date.

> **NOTE:** Because these methods return the current time, the return value will likely be different every time they are called. If you need to use the same value in more than one place, save the return value in a variable.

> **NOTE**: These methods allow for up to nanosecond accuracy, but browsers and other environments may limit the accuracy for security reasons.

## Methods

### Temporal.Now.**zonedDateTimeISO**(_timeZone_: object | string = Temporal.Now.timeZoneId()) : Temporal.ZonedDateTime

**Parameters:**

- `timeZone` (optional string or `Temporal.ZonedDateTime`): The time zone to get the current date and time in, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.ZonedDateTime` object representing the current system date, time, time zone, and time zone offset.

This method gets the current date, time, time zone, and time zone offset according to the system settings, in the reckoning of the ISO 8601 calendar system.
Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method always returns a `Temporal.ZonedDateTime` with the ISO 8601 calendar.
Remember to use `withCalendar()` on the result if you need to do computations in other calendars.

Example usage:

```js
financialCentres = {
  'New York': 'America/New_York',
  London: 'Europe/London',
  Tokyo: 'Asia/Tokyo'
};
console.log(`Here: ${Temporal.Now.zonedDateTimeISO()}`);
Object.entries(financialCentres).forEach(([name, timeZone]) => {
  console.log(`${name}: ${Temporal.Now.zonedDateTimeISO(timeZone)}`);
});
// example output:
// Here: 2020-09-18T01:17:48.431957915-07:00[America/Los_Angeles]
// New York: 2020-09-18T04:17:48.435068431-04:00[America/New_York]
// London: 2020-09-18T09:17:48.438068435+01:00[Europe/London]
// Tokyo: 2020-09-18T17:17:48.441068438+09:00[Asia/Tokyo]
```

### Temporal.Now.**instant**() : Temporal.Instant

**Returns:** a `Temporal.Instant` object representing the current system time.

This method gets the current exact system time, without regard to calendar or time zone.
This is a good way to get a timestamp for an event, for example.
It works like the old-style JavaScript `Date.now()`, but with nanosecond accuracy instead of milliseconds.

Example usage:

```js
function timeit(func) {
  start = Temporal.Now.instant();
  try {
    return func();
  } finally {
    end = Temporal.Now.instant();
    console.log(`The function took ${end.since(start)}`);
  }
}
timeit(() => JSON.parse(someData));
// example output:
// The function took PT0.001031756S
```

### Temporal.Now.**timeZoneId**() : string

**Returns:** The identifier of time zone according to the current system settings.

This method gets the identifier of the current system time zone.
This will usually be a named [IANA time zone](https://www.iana.org/time-zones), as that is how most people configure their computers.

Example usage:

```js
// When is the first daylight saving change in 2025, in the current location?
id = Temporal.Now.timeZoneId();
start2025 = Temporal.ZonedDateTime.from({ year: 2025, month: 1, day: 1, timeZone: id });
nextTransition = start2025.getTimeZoneTransition('next');
before = nextTransition.subtract({ nanoseconds: 1 }).offset;
after = nextTransition.add({ nanoseconds: 1 }).offset;
console.log(`At ${nextTransition} the offset will change from UTC ${before} to ${after}`);
// example output:
// At 2025-03-09T03:00:00-07:00[America/Los_Angeles] the offset will change from UTC -08:00 to -07:00
```

### Temporal.Now.**plainDateTimeISO**(_timeZone_: object | string = Temporal.Now.timeZoneId()) : Temporal.PlainDateTime

**Parameters:**

- `timeZone` (optional string or `Temporal.ZonedDateTime`): The time zone to get the current date and time in, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.PlainDateTime` object representing the current system date and time in the reckoning of the ISO 8601 calendar.

This method gets the current calendar date and wall-clock time according to the system settings.
Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method always returns a `Temporal.PlainDateTime` with the ISO 8601 calendar.
Remember to use `withCalendar()` on the result if you need to do computations in other calendars.

Example usage:

<!-- prettier-ignore-start -->
```js
financialCentres = {
  'New York': 'America/New_York',
  'London': 'Europe/London',
  'Tokyo': 'Asia/Tokyo',
};
console.log(`Here: ${Temporal.Now.plainDateTimeISO()}`);
Object.entries(financialCentres).forEach(([name, timeZone]) => {
  console.log(`${name}: ${Temporal.Now.plainDateTimeISO(timeZone)}`);
});
// example output:
// Here: 2020-01-24T21:51:02.142905166
// New York: 2020-01-25T00:52:14.756462142
// London: 2020-01-25T05:52:14.758534756
// Tokyo: 2020-01-25T14:52:14.759534758
```
<!-- prettier-ignore-end -->

### Temporal.Now.**plainDateISO**(_timeZone_: object | string = Temporal.Now.timeZoneId()) : Temporal.PlainDate

**Parameters:**

- `timeZone` (optional string or `Temporal.ZonedDateTime`): The time zone to get the current date and time in, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.PlainDate` object representing the current system date in the reckoning of the ISO 8601 calendar.

This method gets the current calendar date according to the system settings.
Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

This method always returns a `Temporal.PlainDate` with the ISO 8601 calendar.
Remember to use `withCalendar()` on the result if you need to do computations in other calendars.

Example usage:

```js
// Is it New Year in the ISO 8601 calendar?
date = Temporal.Now.plainDateISO();
if (date.month === 1 && date.day === 1) console.log('New year!');

// Is it Nowruz (New Year in the Persian calendar)?
date = Temporal.Now.plainDateISO().withCalendar('persian');
if (date.month === 1 && date.day === 1) console.log('New year!');
```

### Temporal.Now.**plainTimeISO**(_timeZone_: object | string = Temporal.Now.timeZoneId()) : Temporal.PlainTime

**Parameters:**

- `timeZone` (optional string or `Temporal.ZonedDateTime`): The time zone to get the current date and time in, as a time zone identifier, or a `Temporal.ZonedDateTime` object whose time zone will be used.
  If not given, the current system time zone will be used.

**Returns:** a `Temporal.PlainTime` object representing the current system time in the reckoning of the ISO 8601 calendar.

This method gets the current wall-clock time according to the system settings.
Optionally a time zone can be given in which the time is computed, instead of the current system time zone.

Example usage:

```js
// Is it lunchtime?
time = Temporal.Now.plainTimeISO();
if (time.hour === 12) console.log('Lunchtime!');
```
