/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  DATE_BRAND,
  CALENDAR,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

export class Date {
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
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
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
  get calendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).era(this);
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
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(this);
  }
  get isLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).isLeapYear(this);
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let source;
    let calendar = temporalDateLike.calendar;
    if (calendar) {
      const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
      calendar = TemporalCalendar.from(calendar);
      source = new Date(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    } else {
      calendar = GetSlot(this, CALENDAR);
      source = this;
    }
    const props = ES.ToPartialRecord(temporalDateLike, ['day', 'era', 'month', 'year']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    const fields = ES.ToTemporalDateRecord(source);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = calendar.dateFromFields(fields, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = TemporalCalendar.from(calendar);
    const Construct = ES.SpeciesConstructor(this, Date);
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
    const Construct = ES.SpeciesConstructor(this, Date);
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
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = GetSlot(this, CALENDAR).dateSubtract(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    if (calendar.id !== otherCalendar.id) {
      throw new RangeError(
        `cannot compute difference between dates of ${calendar.id} and ${otherCalendar.id} calendars`
      );
    }

    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'days', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('days', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options);
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const result = calendar.dateDifference(other, this, { largestUnit });
    if (smallestUnit === 'days' && roundingIncrement === 1) return result;

    let { years, months, weeks, days } = result;
    const TemporalDateTime = GetIntrinsic('%Temporal.DateTime%');
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
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return GetSlot(this, CALENDAR).id === GetSlot(other, CALENDAR).id;
  }
  toString() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
    const calendar = ES.FormatCalendarAnnotation(GetSlot(this, CALENDAR));
    let resultString = `${year}-${month}-${day}${calendar}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Date');
  }
  toDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.DateTime%');

    if (!temporalTime) return new DateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);

    if (!ES.IsTemporalTime(temporalTime)) throw new TypeError('invalid Temporal.Time object');
    const hour = GetSlot(temporalTime, HOUR);
    const minute = GetSlot(temporalTime, MINUTE);
    const second = GetSlot(temporalTime, SECOND);
    const millisecond = GetSlot(temporalTime, MILLISECOND);
    const microsecond = GetSlot(temporalTime, MICROSECOND);
    const nanosecond = GetSlot(temporalTime, NANOSECOND);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  toYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    return calendar.yearMonthFromFields(fields, {}, YearMonth);
  }
  toMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    return calendar.monthDayFromFields(fields, {}, MonthDay);
  }
  getFields() {
    const fields = ES.ToTemporalDateRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    fields.calendar = GetSlot(this, CALENDAR);
    return fields;
  }
  getISOFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return {
      isoYear: GetSlot(this, ISO_YEAR),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoDay: GetSlot(this, ISO_DAY),
      calendar: GetSlot(this, CALENDAR)
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let result;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalDate(item)) {
        const year = GetSlot(item, ISO_YEAR);
        const month = GetSlot(item, ISO_MONTH);
        const day = GetSlot(item, ISO_DAY);
        const calendar = GetSlot(item, CALENDAR);
        result = new this(year, month, day, calendar);
      } else {
        let calendar = item.calendar;
        if (calendar === undefined) calendar = GetISO8601Calendar();
        calendar = TemporalCalendar.from(calendar);
        const fields = ES.ToTemporalDateRecord(item);
        result = calendar.dateFromFields(fields, options, this);
      }
    } else {
      let { year, month, day, calendar } = ES.ParseTemporalDateString(ES.ToString(item));
      ({ year, month, day } = ES.RegulateDate(year, month, day, overflow));
      if (!calendar) calendar = GetISO8601Calendar();
      calendar = TemporalCalendar.from(calendar);
      result = new this(year, month, day, calendar);
    }
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalDate(one) || !ES.IsTemporalDate(two)) throw new TypeError('invalid Date object');
    const result = ES.CompareTemporalDate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY)
    );
    if (result !== 0) return result;
    const calendarOne = ES.CalendarToString(GetSlot(one, CALENDAR));
    const calendarTwo = ES.CalendarToString(GetSlot(two, CALENDAR));
    if (calendarOne < calendarTwo) return -1;
    if (calendarOne > calendarTwo) return 1;
    return 0;
  }
}
Date.prototype.toJSON = Date.prototype.toString;

MakeIntrinsicClass(Date, 'Temporal.Date');
