/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_MONTH, ISO_DAY, REF_ISO_YEAR, CALENDAR, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

const ObjectAssign = Object.assign;

export class MonthDay {
  constructor(isoMonth, isoDay, calendar = undefined, refISOYear = 1972) {
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    if (calendar === undefined) calendar = GetDefaultCalendar();
    refISOYear = ES.ToInteger(refISOYear);
    ES.RejectDate(refISOYear, isoMonth, isoDay);
    ES.RejectDateRange(refISOYear, isoMonth, isoDay);
    if (!calendar || typeof calendar !== 'object') throw new RangeError('invalid calendar');

    CreateSlots(this);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, REF_ISO_YEAR, refISOYear);
    SetSlot(this, CALENDAR, calendar);

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

  with(temporalMonthDayLike, options) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    if ('calendar' in temporalMonthDayLike) {
      throw new RangeError('invalid calendar property in month-day-like');
    }
    const props = ES.ToPartialRecord(temporalMonthDayLike, ['day', 'month']);
    if (!props) {
      throw new RangeError('invalid month-day-like');
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
    for (const slot of [ISO_MONTH, ISO_DAY, REF_ISO_YEAR]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
  }
  toString() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    let month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
    let resultString = `${month}-${day}`;
    const calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
    if (calendar) {
      const year = ES.ISOYearString(GetSlot(this, REF_ISO_YEAR));
      resultString = `${year}-${resultString}${calendar}`;
    }
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use equals() to compare Temporal.MonthDay');
  }
  toDateInYear(item, options) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeError('invalid receiver');
    let era, year;
    if (typeof item === 'object' && item !== null) {
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
      refISOYear: GetSlot(this, REF_ISO_YEAR),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoDay: GetSlot(this, ISO_DAY),
      calendar: GetSlot(this, CALENDAR)
    };
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let result;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalMonthDay(item)) {
        const month = GetSlot(item, ISO_MONTH);
        const day = GetSlot(item, ISO_DAY);
        const calendar = GetSlot(item, CALENDAR);
        const refISOYear = GetSlot(item, REF_ISO_YEAR);
        result = new this(month, day, calendar, refISOYear);
      } else {
        let calendar = item.calendar;
        if (calendar === undefined) calendar = GetDefaultCalendar();
        calendar = TemporalCalendar.from(calendar);
        result = calendar.monthDayFromFields(item, options, this);
      }
    } else {
      let { month, day, refISOYear, calendar } = ES.ParseTemporalMonthDayString(ES.ToString(item));
      ({ month, day } = ES.RegulateMonthDay(month, day, disambiguation));
      if (!calendar) calendar = GetDefaultCalendar();
      calendar = TemporalCalendar.from(calendar);
      if (refISOYear === undefined) refISOYear = 1972;
      result = new this(month, day, calendar, refISOYear);
    }
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
