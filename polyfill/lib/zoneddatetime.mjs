/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR,
  EPOCHNANOSECONDS,
  HOUR,
  INSTANT,
  ISO_DAY,
  ISO_MONTH,
  ISO_YEAR,
  MICROSECOND,
  MILLISECOND,
  MINUTE,
  NANOSECOND,
  SECOND,
  TIME_ZONE,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

import bigInt from 'big-integer';

export class ZonedDateTime {
  constructor(epochNanoseconds, timeZone, calendar = GetISO8601Calendar()) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    timeZone = ES.ToTemporalTimeZone(timeZone);
    calendar = ES.ToTemporalCalendar(calendar);

    ES.RejectInstantRange(epochNanoseconds);

    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
    SetSlot(this, TIME_ZONE, timeZone);
    SetSlot(this, CALENDAR, calendar);

    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const instant = new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
    SetSlot(this, INSTANT, instant);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${zonedDateTimeToString(this)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get timeZone() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIME_ZONE);
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(dateTime(this));
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(dateTime(this));
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(dateTime(this));
  }
  get hour() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), HOUR);
  }
  get minute() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), MINUTE);
  }
  get second() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), NANOSECOND);
  }
  get epochSeconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e6);
  }
  get epochMicroseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(dateTime(this));
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(dateTime(this));
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(dateTime(this));
  }
  get hoursInDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    throw new Error('hoursInDay not implemented yet');
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInWeek(dateTime(this));
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(dateTime(this));
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(dateTime(this));
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(dateTime(this));
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).inLeapYear(dateTime(this));
  }
  get startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    throw new Error('startOfDay not implemented yet');
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      const str = ES.ToString(temporalZonedDateTimeLike);
      temporalZonedDateTimeLike = ES.RelevantTemporalObjectFromString(str);
    }
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'prefer');

    void overflow;
    void disambiguation;
    void offset;
    throw new Error('with() not implemented yet');
  }
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    timeZone = ES.ToTemporalTimeZone(timeZone);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    void overflow;
    throw new Error('add() not implemented yet');
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    void overflow;
    throw new Error('subtract() not implemented yet');
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
    void roundingMode;
    void roundingIncrement;
    throw new Error('until() not implemented yet');
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    let roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    roundingMode = ES.NegateTemporalRoundingMode(roundingMode);
    const maximumIncrements = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
    void roundingMode;
    void roundingIncrement;
    throw new Error('since() not implemented yet');
  }
  round(options) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);
    void roundingMode;
    void roundingIncrement;
    throw new Error('round() not implemented yet');
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    return zonedDateTimeToString(this, precision, { unit, increment, roundingMode });
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  toJSON() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return zonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  toInstant() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toDate() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(dateTime(this));
  }
  toTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(dateTime(this));
  }
  toDateTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return dateTime(this);
  }
  toYearMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  toMonthDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  getFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    void fieldNames;
    throw new Error('getFields() not implemented yet');
  }
  getISOFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const tz = GetSlot(this, TIME_ZONE);
    return {
      calendar: GetSlot(this, CALENDAR),
      hour: GetSlot(dt, HOUR),
      isoDay: GetSlot(dt, ISO_DAY),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoYear: GetSlot(dt, ISO_YEAR),
      microsecond: GetSlot(dt, MICROSECOND),
      millisecond: GetSlot(dt, MILLISECOND),
      minute: GetSlot(dt, MINUTE),
      nanosecond: GetSlot(dt, NANOSECOND),
      offset: ES.GetOffsetStringFor(tz, GetSlot(this, INSTANT)),
      second: GetSlot(dt, SECOND),
      timeZone: tz
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'reject');
    if (ES.IsTemporalZonedDateTime(item)) {
      return new ZonedDateTime(GetSlot(item, EPOCHNANOSECONDS), GetSlot(item, TIME_ZONE), GetSlot(item, CALENDAR));
    }
    return ES.ToTemporalZonedDateTime(item, this, overflow, disambiguation, offset);
  }
  static compare(one, two) {
    one = ES.ToTemporalZonedDateTime(one, ZonedDateTime);
    two = ES.ToTemporalZonedDateTime(two, ZonedDateTime);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(ns1).lesser(ns2)) return -1;
    if (bigInt(ns1).greater(ns2)) return 1;
    const calendarResult = ES.CalendarCompare(GetSlot(one, CALENDAR), GetSlot(two, CALENDAR));
    if (calendarResult) return calendarResult;
    return ES.TimeZoneCompare(GetSlot(one, TIME_ZONE), GetSlot(two, TIME_ZONE));
  }
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}

function dateTime(zdt) {
  return ES.GetTemporalDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
}

function zonedDateTimeToString(zdt, precision, options = undefined) {
  const dt = dateTime(zdt);
  let year = GetSlot(dt, ISO_YEAR);
  let month = GetSlot(dt, ISO_MONTH);
  let day = GetSlot(dt, ISO_DAY);
  let hour = GetSlot(dt, HOUR);
  let minute = GetSlot(dt, MINUTE);
  let second = GetSlot(dt, SECOND);
  let millisecond = GetSlot(dt, MILLISECOND);
  let microsecond = GetSlot(dt, MICROSECOND);
  let nanosecond = GetSlot(dt, NANOSECOND);

  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      increment,
      unit,
      roundingMode
    ));
  }

  year = ES.ISOYearString(year);
  month = ES.ISODateTimePartString(month);
  day = ES.ISODateTimePartString(day);
  hour = ES.ISODateTimePartString(hour);
  minute = ES.ISODateTimePartString(minute);
  const seconds = ES.FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  const tz = GetSlot(zdt, TIME_ZONE);
  const offset = ES.GetOffsetStringFor(tz, GetSlot(zdt, INSTANT));
  const zone = ES.TimeZoneToString(tz);
  const calendar = ES.FormatCalendarAnnotation(GetSlot(zdt, CALENDAR));
  return `${year}-${month}-${day}T${hour}:${minute}${seconds}${offset}[${zone}]${calendar}`;
}
