/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_MONTH,
  ISO_DAY,
  ISO_YEAR,
  CALENDAR,
  CALENDAR_ID,
  MONTH_DAY_BRAND,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

function MonthDayToString(monthDay, showCalendar = 'auto') {
  const month = ES.ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar = GetSlot(monthDay, CALENDAR);
  if (!(ES.IsTemporalCalendar(calendar) && GetSlot(calendar, CALENDAR_ID) === 'iso8601')) {
    const year = ES.ISOYearString(GetSlot(monthDay, ISO_YEAR));
    resultString = `${year}-${resultString}`;
  }
  const calendarString = ES.FormatCalendarAnnotation(GetSlot(monthDay, CALENDAR), showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export class PlainMonthDay {
  constructor(isoMonth, isoDay, calendar = GetISO8601Calendar(), referenceISOYear = 1972) {
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);
    referenceISOYear = ES.ToInteger(referenceISOYear);
    ES.RejectDate(referenceISOYear, isoMonth, isoDay);
    ES.RejectDateRange(referenceISOYear, isoMonth, isoDay);

    CreateSlots(this);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, ISO_YEAR, referenceISOYear);
    SetSlot(this, CALENDAR, calendar);
    SetSlot(this, MONTH_DAY_BRAND, true);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${MonthDayToString(this)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get month() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get day() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(this);
  }
  get calendar() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }

  with(temporalMonthDayLike, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if ('calendar' in temporalMonthDayLike) {
      throw new RangeError('invalid calendar property in month-day-like');
    }
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month']);
    const props = ES.ToPartialRecord(temporalMonthDayLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid month-day-like');
    }
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, PlainMonthDay);
    const result = calendar.monthDayFromFields(fields, options, Construct);
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalMonthDay(other, PlainMonthDay);
    for (const slot of [ISO_MONTH, ISO_DAY, ISO_YEAR]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    return MonthDayToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return MonthDayToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use equals() to compare Temporal.PlainMonthDay');
  }
  toPlainDate(item, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);

    const receiverFieldNames = ES.CalendarFields(calendar, ['day', 'month']);
    const fields = ES.ToTemporalMonthDayFields(this, receiverFieldNames);

    const inputFieldNames = ES.CalendarFields(calendar, ['year']);
    const entries = [['year']];
    // Add extra fields from the calendar at the end
    inputFieldNames.forEach((fieldName) => {
      if (!entries.some(([name]) => name === fieldName)) {
        entries.push([fieldName, undefined]);
      }
    });
    ObjectAssign(fields, ES.ToRecord(item, entries));

    const Date = GetIntrinsic('%Temporal.PlainDate%');
    return calendar.dateFromFields(fields, options, Date);
  }
  getFields() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'month']);
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    fields.calendar = calendar;
    return fields;
  }
  getISOFields() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
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
    if (ES.IsTemporalMonthDay(item)) {
      const month = GetSlot(item, ISO_MONTH);
      const day = GetSlot(item, ISO_DAY);
      const calendar = GetSlot(item, CALENDAR);
      const referenceISOYear = GetSlot(item, ISO_YEAR);
      const result = new this(month, day, calendar, referenceISOYear);
      if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalMonthDay(item, this, overflow);
  }
}

MakeIntrinsicClass(PlainMonthDay, 'Temporal.PlainMonthDay');
