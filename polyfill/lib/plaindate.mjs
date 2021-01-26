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

    ES.RejectDate(isoYear, isoMonth, isoDay);
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
    let result = GetSlot(this, CALENDAR).era(this);
    if (result !== undefined) {
      result = ES.ToString(result);
    }
    return result;
  }
  get eraYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let result = GetSlot(this, CALENDAR).eraYear(this);
    if (result !== undefined) {
      result = ES.ToInteger(result);
    }
    return result;
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const result = GetSlot(this, CALENDAR).year(this);
    if (result === undefined) {
      throw new RangeError('calendar year result must be an integer');
    }
    return ES.ToInteger(result);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const result = GetSlot(this, CALENDAR).month(this);
    if (result === undefined) {
      throw new RangeError('calendar month result must be a positive integer');
    }
    return ES.ToPositiveInteger(result);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const result = GetSlot(this, CALENDAR).day(this);
    if (result === undefined) {
      throw new RangeError('calendar day result must be a positive integer');
    }
    return ES.ToPositiveInteger(result);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInWeek(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).inLeapYear(this);
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
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const props = ES.ToPartialRecord(temporalDateLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid date-like');
    }
    let fields = ES.ToTemporalDateFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);

    options = ES.NormalizeOptionsObject(options);

    const Construct = ES.SpeciesConstructor(this, PlainDate);
    return ES.DateFromFields(calendar, fields, Construct, options);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, PlainDate);
    const result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    options = ES.NormalizeOptionsObject(options);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, PlainDate);
    const result = GetSlot(this, CALENDAR).dateAdd(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');

    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    options = ES.NormalizeOptionsObject(options);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years: -years, months: -months, weeks: -weeks, days: -days };
    const Construct = ES.SpeciesConstructor(this, PlainDate);
    const result = GetSlot(this, CALENDAR).dateAdd(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDate(other, PlainDate);
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

    const result = calendar.dateUntil(this, other, options);
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
    other = ES.ToTemporalDate(other, PlainDate);
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

    let { years, months, weeks, days } = calendar.dateUntil(this, other, options);
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
    other = ES.ToTemporalDate(other, PlainDate);
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

    temporalTime = ES.ToTemporalTime(temporalTime, GetIntrinsic('%Temporal.PlainTime%'));
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
      temporalTime = ES.ToTemporalTime(temporalTime, GetIntrinsic('%Temporal.PlainTime%'));
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
    const instant = ES.GetTemporalInstantFor(timeZone, dt, 'compatible');
    const ZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
    return new ZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    return ES.YearMonthFromFields(calendar, fields, YearMonth);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month']);
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
      const year = GetSlot(item, ISO_YEAR);
      const month = GetSlot(item, ISO_MONTH);
      const day = GetSlot(item, ISO_DAY);
      const calendar = GetSlot(item, CALENDAR);
      const result = new this(year, month, day, calendar);
      if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalDate(item, this, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDate(one, PlainDate);
    two = ES.ToTemporalDate(two, PlainDate);
    const result = ES.CompareTemporalDate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY)
    );
    if (result !== 0) return result;
    return ES.CalendarCompare(GetSlot(one, CALENDAR), GetSlot(two, CALENDAR));
  }
}

MakeIntrinsicClass(PlainDate, 'Temporal.PlainDate');
