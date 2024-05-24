This is a draft design document for a `Temporal.parse` API, which is not currently planned to be implemented for several reasons:
- `Temporal`'s approach to most operations&mdash;including parsing&mdash;is to encourage strong typing, e.g. `Temporal.Instant.from` vs. `Temporal.PlainDateTime.from`. A type-spanning "parse anything" API goes against that strongly-typed model.
- The main use case beyond type-specific parsing that was identified for a `parse` API was handling "partially correct" ISO strings, e.g. where only one unit was out of range. Most of these use cases were addressed via the `overflow` option in the `from` method of all types which either clamps out-of-range values (`'constrain'`) to the nearest in-range value or throws (`'reject'`) in that case.
- The final remaining case for a `parse` API was resolving the case where a time zone and a time zone offset can be in conflict, as would happen for future `Temporal.ZonedDateTime` values stored before a country permanently abolishes DST. This use case is now handled via the `offset` option of `Temporal.ZonedDateTime.from`.

# parse

Use cases we identified:

1. **"Parsing ISO"** — Parse an ISO 8601 string and get the exact information that is mandated by ISO 8601, which means that the whole string is relevant. (24:00 is midnight the following day, :60 seconds are allowed although we follow POSIX in coercing them to :59).
2. **"Parsing parts"** — Parse something that might look like an ISO 8601 string but might have been generated incorrectly by some other program. In this case it's important to ignore irrelevant parts of the string.

## Pros and cons

|                                                 | 👍️                                                                                              | 👎️                                                                                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Proposal 1. Always ISO 8601 semantics in from() | 👍️ **Parsing ISO** easy<br>👍️ Prioritizes common use case?                                     | 👎️ **Parsing parts** needs workaround via Temporal.parse()<br>👎️ Inconsistency in not validating time zone offset/name mismatch                                                      |
| Proposal 2. No irrelevant parts in from()       | 👍️ Always unambiguous about what parts of the string are parsed                                 | 👎️ **Parsing ISO** needs workaround via Absolute.from() or Temporal.parse()<br>👎️ **Parsing parts** no easier than in proposal 1<br>👎️ Prioritizes less common use case?<br>        |
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
onlyMonthDay = '09-09'; // not valid ISO 8601, but we accept it in a MonthDay context
onlyTime = '01:46:40';
```

The Temporal.parse() assumed in this document has been repurposed from its original intent, for extracting component parts of an ISO 8601 string, for the case where you need to ignore the other parts.

So, for example, on the above strings:

```javascript
Temporal.parse(valid);
// {
//   instant: '2001-09-08T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(time24);
// {
//   instant: '2020-04-07T24:00:00-07:00[America/Vancouver]',
//   dateTime: '2020-04-07T24:00:00',
//   date: '2020-04-07',
//   yearMonth: '2020-04',
//   monthDay: '04-07',
//   time: '24:00:00',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidZone);
// {
//   instant: '2001-09-08T18:46:40+01:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '+01:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidDate);
// {
//   instant: '2020-99-99T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2020-99-99T18:46:40',
//   date: '2020-99-99',
//   yearMonth: '2020-99',
//   monthDay: '99-99',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(invalidTime);
// {
//   instant: '2001-09-08T99:99:99-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T99:99:99',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '99:99:99',
//   offset: '-07:00',
//   timeZone: 'America/Vancouver',
// }
Temporal.parse(onlyOffset);
// {
//   instant: '2001-09-08T18:46:40-07:00[America/Vancouver]',
//   dateTime: '2001-09-08T18:46:40',
//   date: '2001-09-08',
//   yearMonth: '2001-09',
//   monthDay: '09-08',
//   time: '18:46:40',
//   offset: '-07:00',
//   timeZone: '-07:00',  /* or null? */
// }
Temporal.parse(onlyDateTime);
// {
//   instant: null,
//   dateTime: '2001-09-09T01:46:40',
//   date: '2001-09-09',
//   yearMonth: '2001-09',
//   monthDay: '09-09',
//   time: '01:46:40',
//   offset: null,
//   timeZone: null,
// }
Temporal.parse(onlyDate);
// {
//   instant: null,
//   dateTime: null,  // time doesn't default to midnight in parse()
//   date: '2001-09-09',
//   yearMonth: '2001-09',
//   monthDay: '09-09',
//   time: null,
//   offset: null,
//   timeZone: null,
// }
Temporal.parse(onlyTime);
// {
//   instant: null,
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

Note: The `instant` member on the object returned from parse() is a bit redundant here, it's always either equal to the input, or null.

## Proposal 1. Always ISO 8601 semantics in from()

**Use case 1:** Use from(), which always returns the string according to ISO 8601's semantics. Any information that is _present_ in the string, is validated. Not all information is _required_ to be present if the type doesn't use it. If the time is not present, it defaults to midnight.

The exception to validation is, when parsing a type that's not Temporal.Instant, from() does not check that the time zone offset matches the bracketed IANA name.
The reason for this is that political changes (abolishing DST, for example) may make a string incorrect even though it was correct at the time it was serialized.

```javascript
Temporal.Instant.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.PlainDateTime.from(valid)  // => 2001-09-08T18:46:40
Temporal.PlainDate.from(valid)      // => 2001-09-08
Temporal.PlainYearMonth.from(valid) // => 2001-09
Temporal.PlainMonthDay.from(valid)  // => 09-08
Temporal.PlainTime.from(valid)      // => 18:46:40
Temporal.ZonedDateTime.from(valid)  // => 2001-09-08T18:46:40-07:00[America/Vancouver]

Temporal.Instant.from(time24)  // => 2020-04-08T07:00Z
Temporal.PlainDateTime.from(time24)  // => 2020-04-08T00:00
Temporal.PlainDate.from(time24)      // => 2020-04-08
Temporal.PlainYearMonth.from(time24) // => 2020-04
Temporal.PlainMonthDay.from(time24)  // => 04-08
Temporal.PlainTime.from(time24)      // => 00:00
Temporal.ZonedDateTime.from(time24)  // => 2020-04-08T00:00-07:00[America/Vancouver]

Temporal.Instant.from(invalidZone)  // throws
Temporal.{everything else}.from(invalidZone)  // => doesn't throw
Temporal.*.from(invalidDate)  // throws
Temporal.*.from(invalidTime)  // throws

Temporal.Instant.from(onlyDateTime)  // throws
Temporal.PlainDateTime.from(onlyDateTime)  // 2001-09-09T01:46:40
Temporal.PlainDate.from(onlyDateTime)      // => 2001-09-09
Temporal.PlainYearMonth.from(onlyDateTime) // => 2001-09
Temporal.PlainMonthDay.from(onlyDateTime)  // => 09-09
Temporal.PlainTime.from(onlyDateTime)      // => 01:46:40
Temporal.ZonedDateTime.from(onlyDateTime)  // throws

Temporal.Instant.from(onlyDate)  // throws
Temporal.PlainDateTime.from(onlyDate)  // => 2001-09-09T00:00
Temporal.PlainDate.from(onlyDate)      // => 2001-09-09
Temporal.PlainYearMonth.from(onlyDate) // => 2001-09
Temporal.PlainMonthDay.from(onlyDate)  // => 09-09
Temporal.PlainTime.from(onlyDate)      // => 00:00
Temporal.ZonedDateTime.from(onlyDate)  // throws
```

**Use case 2:** Use Temporal.parse(), which returns an object with members containing the portions of the string exactly as they are spelled in the input, that are relevant for each Temporal type.

Temporal.parse() doesn't do validation; if a portion is present but invalid, it is still returned. Validation happens in from(). Only if a required portion is _not present_, the member is null.

```javascript
Temporal.parse(valid);
// Not necessary to do anything for `valid` that from() can't do

parsed = Temporal.parse(time24);
// The following would give different results than passing the string directly
// to from():
Temporal.PlainDate.from(parsed.date); // => 2020-04-07
Temporal.PlainMonthDay.from(parsed.monthDay); // => 04-07
Temporal.time.from(parsed.time); // throws? it's still valid ISO 8601 though

parsed = Temporal.parse(invalidZone);
Temporal.Instant.from(parsed.instant); // throws
Temporal.PlainDateTime.from(parsed.dateTime); // => 2001-09-08T18:46:40
// etc.

// Likewise:
Temporal.PlainDateTime.from(Temporal.parse(invalidDate).dateTime); // throws
Temporal.PlainDateTime.from(Temporal.parse(invalidTime).dateTime); // throws
Temporal.PlainTime.from(Temporal.parse(invalidDate).time); // => 18:46:40
Temporal.PlainDate.from(Temporal.parse(invalidTime).date); // => 2001-09-08
```

## Proposal 2. No irrelevant parts in from()

**Use case 1:** If a string contains any parts that are not relevant to the type, from() throws an exception. To process strings as ISO 8601 requires, use Absolute.from(), or Temporal.parse().dateTime with Temporal.parse().timeZone, depending on whether you need the time zone.

```javascript
Temporal.Instant.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.PlainDateTime.from(valid)  // throws
Temporal.PlainDate.from(valid)      // throws
Temporal.PlainYearMonth.from(valid) // throws
Temporal.PlainMonthDay.from(valid)  // throws
Temporal.PlainTime.from(valid)      // throws
Temporal.ZonedDateTiem.from(valid)  // throws

parsed = Temporal.parse(valid);
dateTime = Temporal.PlainDateTime.from(parsed.dateTime)  // => 2001-09-08T18:46:40
dateTime.getDate()                                  // => 2001-09-08
dateTime.getDate().getYearMonth()                   // => 2001-09
dateTime.getDate().getMonthDay()                    // => 09-08
dateTime.getTime()                                  // => 18:46:40

Temporal.Instant.from(time24)  // => 2020-04-08T07:00Z
Temporal.PlainDateTime.from(time24)  // throws
Temporal.PlainDate.from(time24)      // throws
Temporal.PlainYearMonth.from(time24) // throws
Temporal.PlainMonthDay.from(time24)  // throws
Temporal.PlainTime.from(time24)      // throws
Temporal.ZonedDateTime.from(time24)  // throws

parsed = Temporal.parse(time24);
dateTime = Temporal.PlainDateTime.from(parsed.dateTime);  // => 2020-04-08T00:00
dateTime.getDate()                                   // => 2020-04-08
dateTime.getDate().getYearMonth()                    // => 2020-04
dateTime.getDate().getMonthDay()                     // => 04-08
dateTime.getTime()                                   // => 00:00

Temporal.*.from(invalidZone)  // throws
Temporal.*.from(invalidDate)  // throws
Temporal.*.from(invalidTime)  // throws

Temporal.Instant.from(onlyDateTime)  // throws
dateTime = Temporal.PlainDateTime.from(onlyDateTime)  // 2001-09-09T01:46:40
Temporal.PlainDate.from(onlyDateTime)      // throws
Temporal.PlainYearMonth.from(onlyDateTime) // throws
Temporal.PlainMonthDay.from(onlyDateTime)  // throws
Temporal.PlainTime.from(onlyDateTime)      // throws
Temporal.ZonedDateTime.from(onlyDateTime)  // throws

dateTime.getDate()                 // 2001-09-09
dateTime.getDate().getYearMonth()  // 2001-09
dateTime.getDate().getMonthDay()   // 09-09
dateTime.getTime()                 // 01:46:40

Temporal.Instant.from(onlyDate)  // throws
Temporal.PlainDateTime.from(onlyDate)  // throws
Temporal.PlainDate.from(onlyDate)      // => 2001-09-09
Temporal.PlainYearMonth.from(onlyDate) // throws
Temporal.PlainMonthDay.from(onlyDate)  // throws
Temporal.PlainTime.from(onlyDate)      // throws
Temporal.ZonedDateTime.from(onlyDate)  // throws
// No longer possible to get a DateTime with time defaulting to midnight, instead use:
Temporal.PlainDate.from(onlyDate).withTime(Temporal.PlainTime.from('00:00'))  // => 2001-09-09T00:00
```

**Use case 2:** As in proposal 1.

## Proposal 3. Irrelevant parts ignored in from()

**Use case 1:** Only Temporal.Instant.from(), Temporal.ZonedDateTime.from() and Temporal.PlainDateTime.from() still have ISO 8601 semantics. To process strings as ISO 8601 requires, use one of those depending on whether you need the time zone.

Temporal.parse() isn't necessary in this scenario.

```javascript
Temporal.Instant.from(valid)  // => 2001-09-09T01:46:40Z
Temporal.PlainDateTime.from(valid)  // => 2001-09-08T18:46:40
Temporal.PlainDate.from(valid)      // => 2001-09-08
Temporal.PlainYearMonth.from(valid) // => 2001-09
Temporal.PlainMonthDay.from(valid)  // => 09-08
Temporal.PlainTime.from(valid)      // => 18:46:40
Temporal.ZonedDateTime.from(valid)  // => 2001-09-08T18:46:40-07:00[America/Vancouver]

Temporal.Instant.from(time24)              // => 2020-04-08T07:00Z
dateTime = Temporal.PlainDateTime.from(time24);  // => 2020-04-08T00:00
dateTime.getDate()                          // => 2020-04-08
dateTime.getDate().getYearMonth()           // => 2020-04
dateTime.getDate().getMonthDay()            // => 04-08
dateTime.getTime()                          // => 00:00
Temporal.ZonedDateTime.from(time24)         // => 2020-04-08T00:00-07:00[America/Vancouver]

// Depending on which type you pass them to, it may be difficult to
// reject strings with mismatching time zones or invalid ISO 8601:
Temporal.Instant.from(invalidZone)  // throws
Temporal.{everything else}.from(invalidZone)   // doesn't throw
Temporal.{Absolute,Time,DateTime}.from(invalidTime)  // throws
Temporal.{Date,YearMonth,MonthDay,TimeZone}.from(invalidTime)  // doesn't throw

Temporal.Instant.from(onlyDateTime)  // throws
Temporal.PlainDateTime.from(onlyDateTime)  // => 2001-09-09T01:46:40
Temporal.PlainDate.from(onlyDateTime)      // => 2001-09-09
Temporal.PlainYearMonth.from(onlyDateTime) // => 2001-09
Temporal.PlainMonthDay.from(onlyDateTime)  // => 09-09
Temporal.PlainTime.from(onlyDateTime)      // => 01:46:40
Temporal.ZonedDateTime.from(onlyDateTime)  // throws

Temporal.Instant.from(onlyDate)  // throws
Temporal.PlainDateTime.from(onlyDate)  // => 2001-09-09T00:00
Temporal.PlainDate.from(onlyDate)      // => 2001-09-09
Temporal.PlainYearMonth.from(onlyDate) // => 2001-09
Temporal.PlainMonthDay.from(onlyDate)  // => 09-09
Temporal.PlainTime.from(onlyDate)      // => 00:00
Temporal.ZonedDateTime.from(onlyDate)  // throws
```

**Use case 2:** Now from() is more useful for this case.

```javascript
// The following would give different results than ISO 8601:
Temporal.PlainDate.from(time24); // => 2020-04-07
Temporal.PlainMonthDay.from(time24); // => 04-07
Temporal.time.from(time24); // throws

Temporal.PlainDateTime.from(invalidZone); // => 2001-09-08T18:46:40
Temporal.PlainDate.from(invalidZone); // => 2001-09-08
Temporal.PlainYearMonth.from(invalidZone); // => 2001-09
Temporal.PlainMonthDay.from(invalidZone); // => 09-08
Temporal.PlainTime.from(invalidZone); // => 18:46:40

Temporal.PlainDate.from(invalidTime); // => 2001-09-08
Temporal.PlainYearMonth.from(invalidTime); // => 2001-09
Temporal.PlainMonthDay.from(invalidTime); // => 09-08
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
- When parsing a date representation for a Temporal.PlainMonthDay, the year may be omitted.
  The year may optionally be replaced by `"--"` as in RFC 3339.
- When parsing a date representation without a day for a Temporal.PlainYearMonth, the expression is allowed to be in Basic format.
- Anything else described by the standard as requiring mutual agreement between communicating parties, is disallowed.
