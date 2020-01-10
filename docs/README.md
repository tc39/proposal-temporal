# Temporal

## Object Relationship

<div class="mermaid">
graph LR;
  timezone(Time-Zone);
  subgraph " ";
    absolute(Absolute);
  end;
  subgraph " ";
    datetime(DateTime);
      date(Date);
        yearmonth(YearMonth);
        monthday(MonthDay);
      time(Time);
    datetime --- date;
    datetime --- time;
    date --- yearmonth;
    date --- monthday;
  end;
  absolute === timezone;
  timezone === datetime;
</div>

## API Overview

### `Temporal.Absolute`

An `Temporal.Absolute` represents a fixed point in time along the POSIX timeline. It does this by internally maintaining a slot for "Nanoseconds since the POSIX-Epoch".

See [Temporal.Absolute Documentation](./absolute.md) for more detailed documentation.

### `Temporal.TimeZone`

A `Temporal.TimeZone` represents an IANA time zone, a specific UTC offset or UTC itself. Because of this `Temporal.TimeZone` can be used to convert between `Temporal.Absolute` and `Temporal.DateTime` as well as finding out the offset at a specific `Temporal.Absolute`.

`Temporal.TimeZone` is also an iterable that gives access to the IANA time zones supported by the system from the [IANA time zone database](https://www.iana.org/time-zones) (also listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)).

See [Temporal.TimeZone Documentation](./timezone.md) for more detailed documentation.

### `Temporal.DateTime`

A `Temporal.DateTime` represents a calendar date and wall-clock time. That means it does not carry time zone information. However it can be converted to a `Temporal.Absolute` using a `Temporal.TimeZone`.

This can also be converted to object containing only partial information such as `Temporal.Date` and `Temporal.Time`.

See [Temporal.DateTime Documentation](./datetime.md) for more detailed documentation.

### `Temporal.Time`

A `Temporal.Time` object represents a wall-clock time. Since there is no date component this can not be directly translated to an absolute point in time. However it can be converted to a `Temporal.Absolute` by combining with a `Temporal.Date` using a `Temporal.TimeZone`.

See [Temporal.Time Documentation](./time.md) for more detailed documentation.

### `Temporal.Date`

A `Temporal.Date` object represents a calendar date. This means there is no way to convert this to an absolute point in time, however combining with a `Temporal.Time` a `Temporal.DateTime` can be obtained which in turn can be pinned to the absolute timeline.

This can also be converted to partial dates such as `Temporal.YearMonth` and `Temporal.MonthDay`.

See [Temporal.Date Documentation](./date.md) for more detailed documentation.

### `Temporal.YearMonth`

A date without a day component. This is useful to express things like "the November 2010 meeting".

See [Temporal.YearMonth Documentation](./yearmonth.md) for more detailed documentation.

### `Temporal.MonthDay`

A date without a year component. This is useful to express things like "Bastille-Day is on the 14th of July".

See [Temporal.MonthDay Documentation](./monthday.md) for more detailed documentation.

### `Temporal.Duration`

A `Temporal.Duration` expresses a length of time. This is used for date/time maths.

See [Temporal.Duration Documentation](./duration.md) for more detailed documentation.

### `Temporal` functions

 * `Temporal.getAbsolute()` - get the current system absolute time
 * `Temporal.getTimeZone()` - get the current system time zone
 * `Temporal.getDateTime()` - get the current system date/time
 * `Temporal.getTime()` - get the current system time
 * `Temporal.getDate()` - get the current system date
 * `Temporal.getYearMonth()` - get the current system year/month
 * `Temporal.getMonthDay()` - get the current system month/day

See [Temporal Functions Documentation](./functions.md) for more detailed documentation.

## Examples

**Now open your developer tools, and try it out!**

<script type="application/javascript" src="./playground.js"></script>
<script type="application/javascript" src="./mermaid.js"></script>
<script>mermaid.initialize({startOnLoad:true, flowchart:{ useMaxWidth:false } });</script>
<style>.mermaid svg { height: 13em; }</style>
