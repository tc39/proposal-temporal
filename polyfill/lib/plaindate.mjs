/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
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

const ObjectAssign = Object.assign;

function TemporalDateToString(date, showCalendar = 'auto') {
  const year = ES.ISOYearString(GetSlot(date, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(date, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(date, ISO_DAY));
  const calendar = ES.FormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
  return `${year}-${month}-${day}${calendar}`;
}

export class PlainDate {
  constructor(isoYear, isoMonth, isoDay, calendar = GetISO8601Calendar()) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);

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
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(this);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(this);
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
      const str = ES.ToString(temporalDateLike);
      temporalDateLike = ES.RelevantTemporalObjectFromString(str);
    }
    let source;
    let calendar = temporalDateLike.calendar;
    if (calendar) {
      const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
      calendar = TemporalCalendar.from(calendar);
      source = new PlainDate(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    } else {
      calendar = GetSlot(this, CALENDAR);
      source = this;
    }
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const props = ES.ToPartialRecord(temporalDateLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid date-like');
    }
    const fields = ES.ToTemporalDateFields(source, fieldNames);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, PlainDate);
    const result = calendar.dateFromFields(fields, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = TemporalCalendar.from(calendar);
    const Construct = ES.SpeciesConstructor(this, PlainDate);
    const result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
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
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }

    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const result = calendar.dateUntil(this, other, { largestUnit });
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
    const calendarId = ES.CalendarToString(calendar);
    const otherCalendarId = ES.CalendarToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }

    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    let { years, months, weeks, days } = calendar.dateUntil(this, other, { largestUnit });
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
    const dateCalendar = GetSlot(this, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');

    if (temporalTime === undefined) return new DateTime(year, month, day, 0, 0, 0, 0, 0, 0, dateCalendar);

    temporalTime = ES.ToTemporalTime(temporalTime, GetIntrinsic('%Temporal.PlainTime%'));
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);
    const timeCalendar = GetSlot(temporalTime, CALENDAR);

    const calendar = ES.ConsolidateCalendars(dateCalendar, timeCalendar);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  toZonedDateTime(timeZoneLike, temporalTime = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(timeZoneLike);
    options = ES.NormalizeOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);

    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');

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

    const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
    const instant = ES.GetTemporalInstantFor(timeZone, dt, disambiguation);
    const ZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
    return new ZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  getFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'year']);
    const fields = ES.ToTemporalDateFields(this, fieldNames);
    fields.calendar = calendar;
    return fields;
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
    const overflow = ES.ToTemporalOverflow(options);
    if (ES.IsTemporalDate(item)) {
      const year = GetSlot(item, ISO_YEAR);
      const month = GetSlot(item, ISO_MONTH);
      const day = GetSlot(item, ISO_DAY);
      const calendar = GetSlot(item, CALENDAR);
      const result = new this(year, month, day, calendar);
      if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalDate(item, this, overflow);
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
