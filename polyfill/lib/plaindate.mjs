/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
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
  DATE_BRAND,
  CALENDAR,
  EPOCHNANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

function TemporalDateToString(date, showCalendar = 'auto') {
  const year = ES.ISOYearString(GetSlot(date, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(date, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(date, ISO_DAY));
  const calendarID = ES.ToString(GetSlot(date, CALENDAR));
  const calendar = ES.FormatCalendarAnnotation(calendarID, showCalendar);
  return `${year}-${month}-${day}${calendar}`;
}

export class PlainDate {
  constructor(isoYear, isoMonth, isoDay, calendar = ES.GetISO8601Calendar()) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);

    // Note: if the arguments are not passed, ToInteger(undefined) will have returned 0, which will
    //       be rejected by RejectDate below. This check exists only to improve the error message.
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required');
    }

    ES.RejectISODate(isoYear, isoMonth, isoDay);
    ES.RejectDateRange(isoYear, isoMonth, isoDay);
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, CALENDAR, calendar);
    SetSlot(this, DATE_BRAND, true);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${TemporalDateToString(this)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR), this);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalDateLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    if (temporalDateLike.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (temporalDateLike.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const props = ES.ToPartialRecord(temporalDateLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid date-like');
    }
    let fields = ES.ToTemporalDateFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);

    options = ES.NormalizeOptionsObject(options);

    return ES.DateFromFields(calendar, fields, PlainDate, options);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    return new PlainDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    options = ES.NormalizeOptionsObject(options);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years, months, weeks, days };
    return ES.CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options, PlainDate);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    options = ES.NormalizeOptionsObject(options);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years: -years, months: -months, weeks: -weeks, days: -days };
    return ES.CalendarDateAdd(GetSlot(this, CALENDAR), this, duration, options, PlainDate);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }

    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const result = ES.CalendarDateUntil(calendar, this, other, options);
    if (smallestUnit === 'days' && roundingIncrement === 1) return result;

    let { years, months, weeks, days } = result;
    const TemporalDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const relativeTo = new TemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0,
      GetSlot(this, CALENDAR)
    );
    ({ years, months, weeks, days } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      relativeTo
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }

    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    let { years, months, weeks, days } = ES.CalendarDateUntil(calendar, this, other, options);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    if (smallestUnit === 'days' && roundingIncrement === 1) {
      return new Duration(-years, -months, -weeks, -days, 0, 0, 0, 0, 0, 0);
    }
    const TemporalDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const relativeTo = new TemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0,
      GetSlot(this, CALENDAR)
    );
    ({ years, months, weeks, days } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode),
      relativeTo
    ));

    return new Duration(-years, -months, -weeks, -days, 0, 0, 0, 0, 0, 0);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    return TemporalDateToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return TemporalDateToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.PlainDate');
  }
  toPlainDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');

    if (temporalTime === undefined) return new DateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);

    temporalTime = ES.ToTemporalTime(temporalTime);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  toZonedDateTime(item) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let timeZone, temporalTime;
    if (ES.Type(item) === 'Object') {
      let timeZoneLike = item.timeZone;
      if (timeZoneLike === undefined) {
        timeZone = ES.ToTemporalTimeZone(item);
      } else {
        timeZone = ES.ToTemporalTimeZone(timeZoneLike);
        temporalTime = item.plainTime;
      }
    } else {
      timeZone = ES.ToTemporalTimeZone(item);
    }

    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);

    let hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      microsecond = 0,
      nanosecond = 0;
    if (temporalTime !== undefined) {
      temporalTime = ES.ToTemporalTime(temporalTime);
      hour = GetSlot(temporalTime, ISO_HOUR);
      minute = GetSlot(temporalTime, ISO_MINUTE);
      second = GetSlot(temporalTime, ISO_SECOND);
      millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
      microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
      nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    }

    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible');
    const ZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
    return new ZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    return ES.YearMonthFromFields(calendar, fields, YearMonth);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    return ES.MonthDayFromFields(calendar, fields, MonthDay);
  }
  getISOFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    if (ES.IsTemporalDate(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      return new PlainDate(
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
