/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_YEAR, ISO_MONTH, REF_ISO_DAY, CALENDAR, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

const ObjectAssign = Object.assign;

export class YearMonth {
  constructor(isoYear, isoMonth, calendar = undefined, refISODay = 1) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    if (calendar === undefined) calendar = GetDefaultCalendar();
    refISODay = ES.ToInteger(refISODay);
    ES.RejectDate(isoYear, isoMonth, refISODay);
    ES.RejectYearMonthRange(isoYear, isoMonth);
    if (!calendar || typeof calendar !== 'object') throw new RangeError('invalid calendar');
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, REF_ISO_DAY, refISODay);
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
  get year() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(this);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get calendar() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).era(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get isLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).isLeapYear(this);
  }
  with(temporalYearMonthLike = {}, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if ('calendar' in temporalYearMonthLike) {
      throw new RangeError('invalid calendar property in year-month-like');
    }
    const props = ES.ToPartialRecord(temporalYearMonthLike, ['era', 'month', 'year']);
    if (!props) {
      throw new RangeError('invalid year-month-like');
    }
    const fields = ES.ToTemporalYearMonthRecord(this);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = GetSlot(this, CALENDAR).yearMonthFromFields(fields, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));

    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalYearMonthRecord(this);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? calendar.daysInMonth(this) : 1;
    const startDate = calendar.dateFromFields({ ...fields, day }, {}, TemporalDate);
    const addedDate = calendar.datePlus(startDate, { ...duration, days }, options, TemporalDate);

    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(addedDate, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));

    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalYearMonthRecord(this);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? 1 : calendar.daysInMonth(this);
    const startDate = calendar.dateFromFields({ ...fields, day }, {}, TemporalDate);
    const subtractedDate = calendar.dateMinus(startDate, { ...duration, days }, options, TemporalDate);

    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(subtractedDate, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    if (calendar.id !== otherCalendar.id) {
      throw new RangeError(
        `cannot compute difference between months of ${calendar.id} and ${otherCalendar.id} calendars`
      );
    }
    const largestUnit = ES.ToLargestTemporalUnit(options, 'years', [
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ]);

    const otherFields = ES.ToTemporalYearMonthRecord(other);
    const thisFields = ES.ToTemporalYearMonthRecord(this);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const otherDate = calendar.dateFromFields({ ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = calendar.dateFromFields({ ...thisFields, day: 1 }, {}, TemporalDate);
    return calendar.dateDifference(otherDate, thisDate, { ...options, largestUnit });
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
    for (const slot of [ISO_YEAR, ISO_MONTH, REF_ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
  }
  toString() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
    let resultString = `${year}-${month}`;
    const calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
    if (calendar) {
      const day = ES.ISODateTimePartString(GetSlot(this, REF_ISO_DAY));
      resultString = `${resultString}-${day}${calendar}`;
    }
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.YearMonth');
  }
  toDateOnDay(day) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalYearMonthRecord(this);
    const Date = GetIntrinsic('%Temporal.Date%');
    return calendar.dateFromFields({ ...fields, day }, { disambiguation: 'reject' }, Date);
  }
  getFields() {
    const fields = ES.ToTemporalYearMonthRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    fields.calendar = GetSlot(this, CALENDAR);
    return fields;
  }
  getISOCalendarFields() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return {
      year: GetSlot(this, ISO_YEAR),
      month: GetSlot(this, ISO_MONTH),
      day: GetSlot(this, REF_ISO_DAY)
    };
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let result;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalYearMonth(item)) {
        const year = GetSlot(item, ISO_YEAR);
        const month = GetSlot(item, ISO_MONTH);
        const calendar = GetSlot(item, CALENDAR);
        const refISODay = GetSlot(item, REF_ISO_DAY);
        result = new this(year, month, calendar, refISODay);
      } else {
        let calendar = item.calendar;
        if (calendar === undefined) calendar = GetDefaultCalendar();
        calendar = TemporalCalendar.from(calendar);
        result = calendar.yearMonthFromFields(item, options, this);
      }
    } else {
      let { year, month, refISODay, calendar } = ES.ParseTemporalYearMonthString(ES.ToString(item));
      ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
      if (!calendar) calendar = GetDefaultCalendar();
      calendar = TemporalCalendar.from(calendar);
      if (refISODay === undefined) refISODay = 1;
      result = new this(year, month, calendar, refISODay);
    }
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalYearMonth(one) || !ES.IsTemporalYearMonth(two)) throw new TypeError('invalid YearMonth object');
    for (const slot of [ISO_YEAR, ISO_MONTH, REF_ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    const cal1 = GetSlot(one, CALENDAR).id;
    const cal2 = GetSlot(two, CALENDAR).id;
    return ES.ComparisonResult(cal1 < cal2 ? -1 : cal1 > cal2 ? 1 : 0);
  }
}
YearMonth.prototype.toJSON = YearMonth.prototype.toString;

MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');
