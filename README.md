### Temporal Proposal

## Champions

Maggie Pint

Brian Terlson

## Status

This proposal is currently stage 0

## Motivation

Date has been a long time pain point in ECMAScript. This proposes `temporal`, a built in module
that brings a DateTime API similar to Java 8's to the ECMAScript language.

Because of the size of the problem domain, this proposal brings only `ZonedDateTime` and `LocalDateTime`. The remaining types - `Instant`, `DateTimeOffset`, `LocalDate`, and `LocalTime` will be left for later proposals.

*Similar APIs:*

[Java 8](https:docs.oracle.com/javase/8/docs/api/)

[NodaTime](http:nodatime.org/)

[JS-Joda](https:github.com/js-joda/js-joda)

## Examples


  ZonedDateTime

  A date and a time that are bound to a time zone and a specific instant in time.

  The first parameter is the time zone or time zone offset.  It can be any of:

  - A zone or link name from the IANA/Olson time zone database. (BCP175/RFC6557)
     - Ex:  'America/New_York', 'Europe/London', 'Asia/Shanghai', 'UTC'

  - A fixed offset from UTC in ±HH:MM or ±HHMM format, with positive values are East of GMT. (ISO8601)
     - Ex:  '-08:00', '-05:00', '+05:30', '+12:45'

  - A fixed offset from UTC in number of minutes West of GMT (for compatibility with Date.getTimeZoneOffset()).
     - Ex:  480, 300, -330, -765

  - An indicator that denotes the local time zone of the computer where the code is executing.
     - This can be either undefined, or the string 'SYSTEM'.

 Note that Instant and OffsetDateTime from Noda-Time and Java 8 can be represented with this scheme
 without explicitly defining them as separate types.

### possible input parameters
```
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, options);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, 456789);
var zdt = new temporal.ZonedDateTime('America/New_York', 2017, 12, 31, 23, 59, 59, 123, 456789, options);
```

### default options
```
{
    calendar: 'gregory'   uses ECMA-402 calendar names
    resolver: (mapping) => ({
        skipped: mapping.forwardShifted(),
        ambiguous: mapping.firstOccurrence()
    })
}
```

 Any resolver function that returns a ZonedDateTime is allowed.
 Properties on mapping are TBD

 Built-in skipped local time resolver functions are:
   - forwardShifted()        Shifts forward by the duration of the gap. (ex: 02:30 => 03:30)
   - nextValid()             Uses the next valid local time. (ex: 02:30 => 03:00)
   - lastValid()             Uses the last valid local time. (ex: 02:30 => 01:59:59.999999999)
   - throws()                Skipped local time causes an error to be thrown.

 Built-in ambiguous local time resolver functions are:
   - firstOccurrence()       Chooses the first occurance of an ambiguous value. (ex: 01:30 EDT)
   - lastOccurrence()        Chooses the last occurance of an ambiguous value.  (ex: 01:30 EST)
   - throws()                Ambiguous local time causes an error to be thrown.

 ------------------------------------------------------------------------------------------------------------------------------


  LocalDateTime

  A date and a time without any time zone reference.
  The term "local" here derives from ISO-8601 §2.1.16, and means "locally applicable".
  In other words, local to somebody, somewhere.  Does not mean local to the user or computer.


```
var ldt = new temporal.LocalDateTime(year, month, day, hours, minutes[, seconds[, millis[, nanosOfMillis]]][, options]);
```
### possible input parameters
```
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, options);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, 456789);
var ldt = new temporal.LocalDateTime(2017, 12, 31, 23, 59, 59, 123, 456789, options);
```

### default options
```
{
    calendar: 'gregory'   // uses ECMA-402 calendar names
}
```

 ------------------------------------------------------------------------------------------------------------------------------

 Other types TBD in this module

 LocalDate  : A date without any time or time zone reference.  (ex 2017-12-31)
 LocalTime  : A time-of-day without any date or time zone reference. (ex: 17:00)
 Duration   : A time-based amount of time, as if measured by a stopwatch. (ex: 5 minutes)
 Period     : A date-based amount of time in the ISO8601 calendar system. (ex: 3 months)
