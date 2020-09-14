/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_MONTH, ISO_DAY, ISO_YEAR, CALENDAR, MONTH_DAY_BRAND, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

const ObjectAssign = Object.assign;

function MonthDayToString(monthDay) {
  const month = ES.ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar = ES.FormatCalendarAnnotation(GetSlot(monthDay, CALENDAR));
  if (calendar) {
    const year = ES.ISOYearString(GetSlot(monthDay, ISO_YEAR));
    resultString = `${year}-${resultString}${calendar}`;
  }
  return resultString;
}

export class MonthDay {
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
        value: `${this[Symbol.toStringTag]} <${this}>`,
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
    const props = ES.ToPartialRecord(temporalMonthDayLike, ['day', 'month']);
    if (!props) {
      throw new TypeError('invalid month-day-like');
    }
    const fields = ES.ToTemporalMonthDayRecord(this);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    const result = GetSlot(this, CALENDAR).monthDayFromFields(fields, options, Construct);
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalMonthDay(other)) throw new TypeError('invalid MonthDay object');
    for (const slot of [ISO_MONTH, ISO_DAY, ISO_YEAR]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
  }
  toString() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return MonthDayToString(this);
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
    throw new TypeError('use equals() to compare Temporal.MonthDay');
  }
  toDateInYear(item, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    let era, year;
    if (ES.Type(item) === 'Object') {
      ({ era, year } = ES.ToRecord(item, [['era', undefined], ['year']]));
    } else {
      year = ES.ToInteger(item);
    }
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalMonthDayRecord(this);
    const Date = GetIntrinsic('%Temporal.Date%');
    return calendar.dateFromFields({ ...fields, era, year }, options, Date);
  }
  getFields() {
    const fields = ES.ToTemporalMonthDayRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    fields.calendar = GetSlot(this, CALENDAR);
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
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let result;
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalMonthDay(item)) {
        const month = GetSlot(item, ISO_MONTH);
        const day = GetSlot(item, ISO_DAY);
        const calendar = GetSlot(item, CALENDAR);
        const referenceISOYear = GetSlot(item, ISO_YEAR);
        result = new this(month, day, calendar, referenceISOYear);
      } else {
        let calendar = item.calendar;
        if (calendar === undefined) calendar = GetISO8601Calendar();
        calendar = TemporalCalendar.from(calendar);
        const fields = ES.ToTemporalMonthDayRecord(item);
        result = calendar.monthDayFromFields(fields, options, this);
      }
    } else {
      let { month, day, referenceISOYear, calendar } = ES.ParseTemporalMonthDayString(ES.ToString(item));
      ({ month, day } = ES.RegulateMonthDay(month, day, overflow));
      if (!calendar) calendar = GetISO8601Calendar();
      calendar = TemporalCalendar.from(calendar);
      if (referenceISOYear === undefined) referenceISOYear = 1972;
      result = new this(month, day, calendar, referenceISOYear);
    }
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
}

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
