# Zoned Date/Time Type

**Name:** It's currently being referred to as `Temporal.LocalDateTime`, but we already know this is not a good name for reasons discussed years ago.
This name is not intended to stick.

**What it is:** The LocalDateTime type is intended to refer to an event, that happened (or will happen) in a particular place.

**Motivation:**

- "Event that happened in a particular place" is a very common use case, perhaps the most common.
  So we want a type that does the right thing for that use case.
- Both Absolute and DateTime have cases where they do the right thing for this use case, and cases where they do the wrong thing.
  (ex.: "Move a meeting three days later" is correct with DateTime and wrong with Absolute; "Postpone a reminder by one hour" is correct with Absolute and wrong with DateTime.)
- The cases where Absolute and DateTime do the wrong thing will only produce the wrong result when used across a DST transition, so in many places the bugs will only pop up twice per year, if at all.
- When writing the cookbook, to deal with this use case, we found that it was actually necessary a lot of the time to pass around a record consisting of `{ instant, timeZone }`.
  If that is so common, then we may as well have a type for it.
- Even worse, there is a temptation to pass around a serialized string instead of such a record, which is wrong because the time zone offset may have changed when you read in the string again with `Temporal.Instant.from()`.

**API**: The API looks something like this:

```typescript
class Temporal.LocalDateTime {
  // creation
  constructor(instant: Temporal.Instant, timeZone: Temporal.TimeZone, calendar: Temporal.Calendar);
  static from(item: string | object, options?: object) : Temporal.LocalDateTime;

  // immutable 'mutation'
  with(localDateTimeLike: object, options?: object) : Temporal.LocalDateTime;
  withCalendar(calendar: Temporal.Calendar) : Temporal.LocalDateTime;
  get startOfDay() : Temporal.LocalDateTime;

  // getters / field access
  get era(): string | undefined;
  get year(): number;
  get month(): number;
  get day(): number;
  get hour(): number;
  get minute(): number;
  get second(): number;
  get millisecond(): number;
  get microsecond(): number;
  get nanosecond(): number;
  get timeZone(): Temporal.TimeZone;
  get timeZoneOffsetNanoseconds(): number;
  get timeZoneOffsetString(): string;
  get calendar(): Temporal.Calendar;
  get dayOfWeek(): number;
  get dayOfYear(): number;
  get weekOfYear(): number;
  get hoursInDay(): number;
  get daysInMonth(): number;
  get daysInYear(): number;
  get inLeapYear(): boolean;
  get isTimeZoneOffsetTransition(): boolean;
  getFields(): object;
  getISOFields(): object;

  // type conversion
  toInstant(): Temporal.Instant;
  toPlainDateTime(): Temporal.PlainDateTime;
  toPlainDate(): Temporal.PlainDate;
  toPlainYearMonth(): Temporal.PlainYearMonth;
  toPlainMonthDay(): Temporal.PlainMonthDay;
  toPlainTime(): Temporal.PlainTime;

  // comparison
  static compare(one: Temporal.LocalDateTime, two: Temporal.LocalDateTime): number;
  equals(other: Temporal.LocalDateTime): boolean;

  // arithmetic
  add(duration: Temporal.Duration | object, options?: object) : Temporal.LocalDateTime;
  subtract(duration: Temporal.Duration | object, options?: object) : Temporal.LocalDateTime;
  since(other: Temporal.LocalDateTime, options?: object) : Temporal.Duration;

  // serialization / presentation
  toString() : string;
  toJSON() : string;
  toLocaleString(locales?: string | Array<string>, options?: object): string;
}
```

(This is not a fully functional description, it's made concise for readability.
For example, the details of the options bags are omitted.)

It basically has all the API of DateTime, but with a time zone as well, adding the time zone offset for disambiguating near transitions, and several time-zone-related convenience properties.
But since it represents an unambiguous moment in time (like Absolute, and unlike DateTime), the internal model is more like Absolute with a time zone and calendar.

To create one, you use `Temporal.LocalDateTime.from`, or the `toLocalDateTime()` method of another Temporal type.

- From a string: `from(string)`
- From raw DateTime fields: `from({ year, month, day, etc., timeZone, timeZoneOffsetNanoseconds })`
- From an Absolute: `instant.toLocalDateTime(timeZone)`
- From a DateTime, which potentially needs disambiguation: `dateTime.toLocalDateTime(timeZone, { disambiguation })`

As in the other Temporal types, the constructor is more low-level and takes an Absolute, a TimeZone, and a Calendar.

"New" API that is not on DateTime:

- `hoursInDay` - this is not possible with Absolute (no concept of days and no time zone) nor with DateTime (no time zone), but it makes sense for this type.
- `timeZoneOffsetNanoseconds` - without this, you'd need to do `ldt.timeZone.getOffsetNanoseconds(ldt.toInstant())`.
- `timeZoneOffsetString` - ditto, you'd need `ldt.timeZone.getOffsetString(ldt.toInstant())`.
- `startOfDay` - this is a convenient way to get the start of the day, especially if the day does not start at 00:00 due to DST.
  Also not needed with Absolute (no concept of days) nor with DateTime (day always starts at 00:00), but it makes sense for this type.
- `isTimeZoneOffsetTransition` - convenience property getter.
