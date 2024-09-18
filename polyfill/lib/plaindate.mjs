import { RangeError as RangeError, TypeError as TypeError } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  CALENDAR,
  GetSlot
} from './slots.mjs';

export class PlainDate {
  constructor(isoYear, isoMonth, isoDay, calendar = 'iso8601') {
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    isoDay = ES.ToIntegerWithTruncation(isoDay);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    if (!ES.IsBuiltinCalendar(calendar)) throw new RangeError(`unknown calendar ${calendar}`);
    calendar = ES.CanonicalizeCalendar(calendar);

    ES.CreateTemporalDateSlots(this, isoYear, isoMonth, isoDay, calendar);
  }
  get calendarId() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEra(GetSlot(this, CALENDAR), isoDate);
  }
  get eraYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarYear(GetSlot(this, CALENDAR), isoDate);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get monthCode() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDay(GetSlot(this, CALENDAR), isoDate);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), isoDate);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), isoDate);
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarYearOfWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalDateLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalDateLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.TemporalObjectToFields(this);
    const partialDate = ES.PrepareCalendarFields(
      calendar,
      temporalDateLike,
      ['day', 'month', 'monthCode', 'year'],
      [],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialDate);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const { year, month, day } = ES.CalendarDateFromFields(calendar, fields, overflow);
    return ES.CreateTemporalDate(year, month, day, calendar);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendarIdentifier(calendar);
    return ES.CreateTemporalDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToDate('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToDate('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDate('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDate('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other);
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(options);
    return ES.TemporalDateToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainDate');
  }
  toPlainDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    temporalTime = ES.ToTemporalTimeOrMidnight(temporalTime);
    return ES.CreateTemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(temporalTime, ISO_HOUR),
      GetSlot(temporalTime, ISO_MINUTE),
      GetSlot(temporalTime, ISO_SECOND),
      GetSlot(temporalTime, ISO_MILLISECOND),
      GetSlot(temporalTime, ISO_MICROSECOND),
      GetSlot(temporalTime, ISO_NANOSECOND),
      GetSlot(this, CALENDAR)
    );
  }
  toZonedDateTime(item) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let timeZone, temporalTime;
    if (ES.Type(item) === 'Object') {
      const timeZoneLike = item.timeZone;
      if (timeZoneLike === undefined) {
        timeZone = ES.ToTemporalTimeZoneIdentifier(item);
      } else {
        timeZone = ES.ToTemporalTimeZoneIdentifier(timeZoneLike);
        temporalTime = item.plainTime;
      }
    } else {
      timeZone = ES.ToTemporalTimeZoneIdentifier(item);
    }

    const calendar = GetSlot(this, CALENDAR);
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    let epochNs;
    if (temporalTime === undefined) {
      epochNs = ES.GetStartOfDay(timeZone, { year, month, day });
    } else {
      temporalTime = ES.ToTemporalTime(temporalTime);
      const dt = {
        year,
        month,
        day,
        hour: GetSlot(temporalTime, ISO_HOUR),
        minute: GetSlot(temporalTime, ISO_MINUTE),
        second: GetSlot(temporalTime, ISO_SECOND),
        millisecond: GetSlot(temporalTime, ISO_MILLISECOND),
        microsecond: GetSlot(temporalTime, ISO_MICROSECOND),
        nanosecond: GetSlot(temporalTime, ISO_NANOSECOND)
      };
      epochNs = ES.GetEpochNanosecondsFor(timeZone, dt, 'compatible');
    }
    return ES.CreateTemporalZonedDateTime(epochNs, timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.TemporalObjectToFields(this);
    const { year, month, day } = ES.CalendarYearMonthFromFields(calendar, fields);
    return ES.CreateTemporalYearMonth(year, month, calendar, day);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.TemporalObjectToFields(this);
    const { year, month, day } = ES.CalendarMonthDayFromFields(calendar, fields);
    return ES.CreateTemporalMonthDay(month, day, calendar, year);
  }

  static from(item, options = undefined) {
    if (ES.IsTemporalDate(item)) {
      ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
      return ES.CreateTemporalDate(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR)
      );
    }
    return ES.ToTemporalDate(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDate(one);
    two = ES.ToTemporalDate(two);
    return ES.CompareISODate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY)
    );
  }
}

MakeIntrinsicClass(PlainDate, 'Temporal.PlainDate');
