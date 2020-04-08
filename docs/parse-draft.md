parse
=====

Use cases we identified:

1. **"Parsing ISO"** — Parse an ISO 8601 string and get the exact information that is mandated by ISO 8601, which means that the whole string is relevant. (24:00 is midnight the following day, :60 seconds are allowed although we follow POSIX in coercing them to :59).
2. **"Parsing parts"** — Parse something that might look like an ISO 8601 string but might have been generated incorrectly by some other program. In this case it's important to ignore irrelevant parts of the string.

## Pros and cons

|   | 👍️ | 👎️ |
|---|---|---|
| Proposal 1. Always ISO 8601 semantics in from() | 👍️ **Parsing ISO** easy<br>👍️ Prioritizes common use case? | 👎️ **Parsing parts** needs workaround via Temporal.parse()<br>👎️ Inconsistency in not validating time zone offset/name mismatch |
| Proposal 2. No irrelevant parts in from()       | 👍️ Always unambiguous about what parts of the string are parsed | 👎️ **Parsing ISO** needs workaround via Absolute.from() or Temporal.parse()<br>👎️ **Parsing parts** no easier than in proposal 1<br>👎️ Prioritizes less common use case?<br>  |
| Proposal 3. Irrelevant parts ignored in from()  | 👍️ **Parsing parts** easy<br>👍️ Temporal.parse() not needed<br>👍️ from() less likely to throw | 👎️ from() is a mix of **parsing ISO** and **parsing parts**<br>👎️ Can parse an ISO string and not get the result specified by ISO<br>👎️ Not clear what API to use for each use case |

## Details

Here are some strings of interest, used in the examples below:
```javascript
// Valid string
valid = '2001-09-08T18:46:40-07:00[America/Vancouver]';

// String where the time affects the date
time24 = '2020-04-07T24:00:00-07:00[America/Vancouver]';

// Invalid time zone (although valid ISO 8601 string)
invalidZone = '2001-09-08T18:46:40+01:00[America/Vancouver]';

// Invalid date part, also invalid ISO 8601
invalidDate = '2020-99-99T18:46:40-07:00[America/Vancouver]';

// Invalid time part, also invalid ISO 8601
invalidTime = '2001-09-08T99:99:99-07:00[America/Vancouver]';

// Time zone with only an offset, no IANA name
onlyOffset = '2001-09-08T18:46:40-07:00';

// Only date/time
onlyDateTime = '2001-09-09T01:46:40';

// Only date
onlyDate = '2001-09-09';

// In any of the proposals, these would only be accepted by YearMonth.from,
// MonthDay.from, or Time.from, respectively
onlyYearMonth = '2001-09';
onlyMonthDay = '09-09';  // not valid ISO 8601, but we accept it in a MonthDay context
onlyTime = '01:46:40';
```

The Temporal.parse() assumed in this document has been repurposed from its original intent, for extracting component parts of an ISO 8601 string, for the case where you need to ignore the other parts.

So, for example, on the above strings:
```javascript
Temporal.parse(valid)
// {
//   absolute: '2001-09-08T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(time24)
// {
//   absolute: '2020-04-07T24:00:00-07:00[America/Vancouver]',
//   dateTime: '2020-04-07T24:00:00',
//   date: '2020-04-07',
//   yearMonth: '2020-04',
//   monthDay: '04-07',
//   time: '24:00:00',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidZone)
// {
//   absolute: '2001-09-08T18:46:40+01:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '+01:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidDate)
// {
//   absolute: '2020-99-99T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2020-99-99T18:46:40',
//   date: '2020-99-99',
//   yearMonth: '2020-99',
//   monthDay: '99-99',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidTime)
// {
//   absolute: '2001-09-08T99:99:99-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T99:99:99',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '99:99:99',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(onlyOffset)
// {
//   absolute: '2001-09-08T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: '-07:00',  /* or null? */
// }
Temporal.parse(onlyDateTime)
// {
//   absolute: null,
//   dateTime: '2001-09-09T01:46:40',
//   date: '2001-09-09',
//   yearMonth: '2001-09',
//   monthDay: '09-09',
//   time: '01:46:40',
//   offset: null,
//   timeZone: null,
// }
Temporal.parse(onlyDate)
// {
//   absolute: null,
//   dateTime: null,  // time doesn't default to midnight in parse()
//   date: '2001-09-09',
//   yearMonth: '2001-09',
//   monthDay: '09-09',
//   time: null,
//   offset: null,
//   timeZone: null,
// }
Temporal.parse(onlyTime)
// {
//   absolute: null,
//   dateTime: null,
//   date: null,
//   yearMonth: null,
//   monthDay: null,
//   time: '01:46:40',
//   offset: null,
//   timeZone: null,
// }
// etc.
```

Note: The `absolute` member on the object returned from parse() is a bit redundant here, it's always either equal to the input, or null.

## Proposal 1. Always ISO 8601 semantics in from()

**Use case 1:** Use from(), which always returns the string according to ISO 8601's semantics. Any information that is _present_ in the string, is validated. Not all information is _required_ to be present if the type doesn't use it. If the time is not present, it defaults to midnight.

The exception to validation is, when parsing a type that's not Temporal.Absolute, from() does not check that the time zone offset matches the bracketed IANA name.
The reason for this is that political changes (abolishing DST, for example) may make a string incorrect even though it was correct at the time it was serialized.

```javascript
Temporal.Absolute.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.DateTime.from(valid)  // => 2001-09-08T18:46:40
Temporal.Date.from(valid)      // => 2001-09-08
Temporal.YearMonth.from(valid) // => 2001-09
Temporal.MonthDay.from(valid)  // => 09-08
Temporal.Time.from(valid)      // => 18:46:40
Temporal.TimeZone.from(valid)  // => America/Vancouver

Temporal.Absolute.from(time24)  // => 2020-04-08T07:00Z
Temporal.DateTime.from(time24)  // => 2020-04-08T00:00
Temporal.Date.from(time24)      // => 2020-04-08
Temporal.YearMonth.from(time24) // => 2020-04
Temporal.MonthDay.from(time24)  // => 04-08
Temporal.Time.from(time24)      // => 00:00
Temporal.TimeZone.from(time24)  // => America/Vancouver

Temporal.Absolute.from(invalidZone)  // throws
Temporal.{everything else}.from(invalidZone)  // => doesn't throw
Temporal.*.from(invalidDate)  // throws
Temporal.*.from(invalidTime)  // throws

Temporal.Absolute.from(onlyDateTime)  // throws
Temporal.DateTime.from(onlyDateTime)  // 2001-09-09T01:46:40
Temporal.Date.from(onlyDateTime)      // => 2001-09-09
Temporal.YearMonth.from(onlyDateTime) // => 2001-09
Temporal.MonthDay.from(onlyDateTime)  // => 09-09
Temporal.Time.from(onlyDateTime)      // => 01:46:40
Temporal.TimeZone.from(onlyDateTime)  // throws

Temporal.Absolute.from(onlyDate)  // throws
Temporal.DateTime.from(onlyDate)  // => 2001-09-09T00:00
Temporal.Date.from(onlyDate)      // => 2001-09-09
Temporal.YearMonth.from(onlyDate) // => 2001-09
Temporal.MonthDay.from(onlyDate)  // => 09-09
Temporal.Time.from(onlyDate)      // => 00:00
Temporal.TimeZone.from(onlyDate)  // throws
```

**Use case 2:** Use Temporal.parse(), which returns an object with members containing the portions of the string exactly as they are spelled in the input, that are relevant for each Temporal type.

Temporal.parse() doesn't do validation; if a portion is present but invalid, it is still returned. Validation happens in from(). Only if a required portion is _not present_, the member is null.

```javascript
Temporal.parse(valid);
// Not necessary to do anything for `valid` that from() can't do

parsed = Temporal.parse(time24);
// The following would give different results than passing the string directly
// to from():
Temporal.Date.from(parsed.date)          // => 2020-04-07
Temporal.MonthDay.from(parsed.monthDay)  // => 04-07
Temporal.time.from(parsed.time)          // throws? it's still valid ISO 8601 though

parsed = Temporal.parse(invalidZone);
Temporal.Absolute.from(parsed.absolute)  // throws
Temporal.DateTime.from(parsed.dateTime)  // => 2001-09-08T18:46:40
// etc.

// Likewise:
Temporal.DateTime.from(Temporal.parse(invalidDate).dateTime)  // throws
Temporal.DateTime.from(Temporal.parse(invalidTime).dateTime)  // throws
Temporal.Time.from(Temporal.parse(invalidDate).time)  // => 18:46:40
Temporal.Date.from(Temporal.parse(invalidTime).date)  // => 2001-09-08
```

## Proposal 2. No irrelevant parts in from()

**Use case 1:** If a string contains any parts that are not relevant to the type, from() throws an exception. To process strings as ISO 8601 requires, use Absolute.from(), or Temporal.parse().dateTime with Temporal.parse().timeZone, depending on whether you need the time zone.

```javascript
Temporal.Absolute.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.DateTime.from(valid)  // throws
Temporal.Date.from(valid)      // throws
Temporal.YearMonth.from(valid) // throws
Temporal.MonthDay.from(valid)  // throws
Temporal.Time.from(valid)      // throws
Temporal.TimeZone.from(valid)  // throws

parsed = Temporal.parse(valid);
dateTime = Temporal.DateTime.from(parsed.dateTime)  // => 2001-09-08T18:46:40
dateTime.getDate()                                  // => 2001-09-08
dateTime.getDate().getYearMonth()                   // => 2001-09
dateTime.getDate().getMonthDay()                    // => 09-08
dateTime.getTime()                                  // => 18:46:40
Temporal.TimeZone.from(parsed.timeZone)             // => America/Vancouver

Temporal.Absolute.from(time24)  // => 2020-04-08T07:00Z
Temporal.DateTime.from(time24)  // throws
Temporal.Date.from(time24)      // throws
Temporal.YearMonth.from(time24) // throws
Temporal.MonthDay.from(time24)  // throws
Temporal.Time.from(time24)      // throws
Temporal.TimeZone.from(time24)  // throws

parsed = Temporal.parse(time24);
dateTime = Temporal.DateTime.from(parsed.dateTime);  // => 2020-04-08T00:00
dateTime.getDate()                                   // => 2020-04-08
dateTime.getDate().getYearMonth()                    // => 2020-04
dateTime.getDate().getMonthDay()                     // => 04-08
dateTime.getTime()                                   // => 00:00
Temporal.TimeZone.from(parsed.timeZone)              // => America/Vancouver

Temporal.*.from(invalidZone)  // throws
Temporal.*.from(invalidDate)  // throws
Temporal.*.from(invalidTime)  // throws

Temporal.Absolute.from(onlyDateTime)  // throws
dateTime = Temporal.DateTime.from(onlyDateTime)  // 2001-09-09T01:46:40
Temporal.Date.from(onlyDateTime)      // throws
Temporal.YearMonth.from(onlyDateTime) // throws
Temporal.MonthDay.from(onlyDateTime)  // throws
Temporal.Time.from(onlyDateTime)      // throws
Temporal.TimeZone.from(onlyDateTime)  // throws

dateTime.getDate()                 // 2001-09-09
dateTime.getDate().getYearMonth()  // 2001-09
dateTime.getDate().getMonthDay()   // 09-09
dateTime.getTime()                 // 01:46:40

Temporal.Absolute.from(onlyDate)  // throws
Temporal.DateTime.from(onlyDate)  // throws
Temporal.Date.from(onlyDate)      // => 2001-09-09
Temporal.YearMonth.from(onlyDate) // throws
Temporal.MonthDay.from(onlyDate)  // throws
Temporal.Time.from(onlyDate)      // throws
Temporal.TimeZone.from(onlyDate)  // throws
// No longer possible to get a DateTime with time defaulting to midnight, instead use:
Temporal.Date.from(onlyDate).withTime(Temporal.Time.from('00:00'))  // => 2001-09-09T00:00
```

**Use case 2:** As in proposal 1.

## Proposal 3. Irrelevant parts ignored in from()

**Use case 1:** Only Temporal.Absolute().from() and Temporal.DateTime.from() still have ISO 8601 semantics. To process strings as ISO 8601 requires, use Absolute.from(), or Temporal.DateTime.from() with Temporal.TimeZone.from(), depending on whether you need the time zone.

Temporal.parse() isn't necessary in this scenario.

```javascript
Temporal.Absolute.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.DateTime.from(valid)  // => 2001-09-08T18:46:40
Temporal.Date.from(valid)      // => 2001-09-08
Temporal.YearMonth.from(valid) // => 2001-09
Temporal.MonthDay.from(valid)  // => 09-08
Temporal.Time.from(valid)      // => 18:46:40
Temporal.TimeZone.from(valid)  // => America/Vancouver

Temporal.Absolute.from(time24)              // => 2020-04-08T07:00Z
dateTime = Temporal.DateTime.from(time24);  // => 2020-04-08T00:00
dateTime.getDate()                          // => 2020-04-08
dateTime.getDate().getYearMonth()           // => 2020-04
dateTime.getDate().getMonthDay()            // => 04-08
dateTime.getTime()                          // => 00:00
Temporal.TimeZone.from(time24)              // => America/Vancouver

// Depending on which type you pass them to, it may be difficult to
// reject strings with mismatching time zones or invalid ISO 8601:
Temporal.Absolute.from(invalidZone)  // throws
Temporal.{everything else}.from(invalidZone)   // doesn't throw
Temporal.{Absolute,Time,DateTime}.from(invalidTime)  // throws
Temporal.{Date,YearMonth,MonthDay,TimeZone}.from(invalidTime)  // doesn't throw

Temporal.Absolute.from(onlyDateTime)  // throws
Temporal.DateTime.from(onlyDateTime)  // => 2001-09-09T01:46:40
Temporal.Date.from(onlyDateTime)      // => 2001-09-09
Temporal.YearMonth.from(onlyDateTime) // => 2001-09
Temporal.MonthDay.from(onlyDateTime)  // => 09-09
Temporal.Time.from(onlyDateTime)      // => 01:46:40
Temporal.TimeZone.from(onlyDateTime)  // throws

Temporal.Absolute.from(onlyDate)  // throws
Temporal.DateTime.from(onlyDate)  // => 2001-09-09T00:00
Temporal.Date.from(onlyDate)      // => 2001-09-09
Temporal.YearMonth.from(onlyDate) // => 2001-09
Temporal.MonthDay.from(onlyDate)  // => 09-09
Temporal.Time.from(onlyDate)      // => 00:00
Temporal.TimeZone.from(onlyDate)  // throws
```

**Use case 2:** Now from() is more useful for this case.

```javascript
// The following would give different results than ISO 8601:
Temporal.Date.from(time24)      // => 2020-04-07
Temporal.MonthDay.from(time24)  // => 04-07
Temporal.time.from(time24)      // throws

Temporal.DateTime.from(invalidZone)   // => 2001-09-08T18:46:40
Temporal.Date.from(invalidZone)       // => 2001-09-08
Temporal.YearMonth.from(invalidZone)  // => 2001-09
Temporal.MonthDay.from(invalidZone)   // => 09-08
Temporal.Time.from(invalidZone)       // => 18:46:40
Temporal.TimeZone.from(invalidZone)   // => America/Vancouver

Temporal.Date.from(invalidTime)       // => 2001-09-08
Temporal.YearMonth.from(invalidTime)  // => 2001-09
Temporal.MonthDay.from(invalidTime)   // => 09-08
Temporal.TimeZone.from(invalidTime)   // => America/Vancouver
// etc.
```

## What is meant by "ISO string"

"ISO 8601 string" actually means Temporal's subset / interpretation of ISO 8601 which is specified in a grammar in the spec (currently in PR [#404](https://github.com/tc39/proposal-temporal/pull/404)).
The format is intended to be a combination of ISO 8601, RFC 3339, and JavaScript convention.

- Only the calendar date format is supported, not the weekdate or ordinal date format.
- Two-digit years are disallowed.
- [Expanded Years](https://tc39.es/ecma262/#sec-expanded-years) of 6 digits are allowed.
- Fractional parts may have 1 through 9 decimal places.
- Only seconds are allowed to have a fractional part.
- The time zone, if given as a UTC offset, may be suffixed by an [IANA time zone name](https://www.iana.org/time-zones) in square brackets.
- A space may be used to separate the date and time in a combined date / time representation, but not in a duration.
- Alphabetic designators may be in lower or upper case.
- Period or comma may be used as the decimal separator.
- A time zone offset of `"-00:00"` is allowed, and means the same thing as `"+00:00"`.
- In a combined representation, combinations of date, time, and time zone offset with Basic (no `-` or `:` separators) and Extended (with `-` or `:` separators) formatting are allowed.
  (The date, time, and time zone offset must each be fully in Basic format or Extended format.)
- When parsing a date representation for a Temporal.MonthDay, the year may be omitted.
  The year may optionally be replaced by `"--"` as in RFC 3339.
- When parsing a date representation without a day for a Temporal.YearMonth, the expression is allowed to be in Basic format.
- Anything else described by the standard as requiring mutual agreement between communicating parties, is disallowed.
