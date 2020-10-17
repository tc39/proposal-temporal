/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_YEAR, ISO_MONTH, ISO_DAY, YEAR_MONTH_BRAND, CALENDAR, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

const ObjectAssign = Object.assign;

function YearMonthToString(yearMonth) {
  const year = ES.ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendar = ES.FormatCalendarAnnotation(GetSlot(yearMonth, CALENDAR));
  if (calendar) {
    const day = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString = `${resultString}-${day}${calendar}`;
  }
  return resultString;
}

export class YearMonth {
  constructor(isoYear, isoMonth, calendar = GetISO8601Calendar(), referenceISODay = 1) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    calendar = ES.ToTemporalCalendar(calendar);
    referenceISODay = ES.ToInteger(referenceISODay);
    ES.RejectDate(isoYear, isoMonth, referenceISODay);
    ES.RejectYearMonthRange(isoYear, isoMonth);
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, referenceISODay);
    SetSlot(this, CALENDAR, calendar);
    SetSlot(this, YEAR_MONTH_BRAND, true);

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
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(this);
  }
  get isLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).isLeapYear(this);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if ('calendar' in temporalYearMonthLike) {
      throw new RangeError('invalid calendar property in year-month-like');
    }
    const props = ES.ToPartialRecord(temporalYearMonthLike, ['era', 'month', 'year']);
    if (!props) {
      throw new TypeError('invalid year-month-like');
    }
    const fields = ES.ToTemporalYearMonthRecord(this);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = GetSlot(this, CALENDAR).yearMonthFromFields(fields, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
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
    const addedDate = calendar.dateAdd(startDate, { ...duration, days }, options, TemporalDate);

    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(addedDate, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike, options = undefined) {
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
    const subtractedDate = calendar.dateSubtract(startDate, { ...duration, days }, options, TemporalDate);

    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(subtractedDate, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    if (calendar.id !== otherCalendar.id) {
      throw new RangeError(
        `cannot compute difference between months of ${calendar.id} and ${otherCalendar.id} calendars`
      );
    }
    options = ES.NormalizeOptionsObject(options);
    const disallowedUnits = [
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ];
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'months', disallowedUnits);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'years', disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options);
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const otherFields = ES.ToTemporalYearMonthRecord(other);
    const thisFields = ES.ToTemporalYearMonthRecord(this);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const otherDate = calendar.dateFromFields({ ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = calendar.dateFromFields({ ...thisFields, day: 1 }, {}, TemporalDate);

    const result = calendar.dateDifference(otherDate, thisDate, { largestUnit });
    if (smallestUnit === 'months' && roundingIncrement === 1) return result;

    let { years, months } = result;
    const TemporalDateTime = GetIntrinsic('%Temporal.DateTime%');
    const relativeTo = new TemporalDateTime(
      GetSlot(thisDate, ISO_YEAR),
      GetSlot(thisDate, ISO_MONTH),
      GetSlot(thisDate, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0,
      calendar
    );
    ({ years, months } = ES.RoundDuration(
      years,
      months,
      0,
      0,
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
    return new Duration(years, months, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return YearMonthToString(this);
  }
  toJSON() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return YearMonthToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.YearMonth');
  }
  toDateOnDay(day) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalYearMonthRecord(this);
    const Date = GetIntrinsic('%Temporal.Date%');
    return calendar.dateFromFields({ ...fields, day }, { overflow: 'reject' }, Date);
  }
  getFields() {
    const fields = ES.ToTemporalYearMonthRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    fields.calendar = GetSlot(this, CALENDAR);
    return fields;
  }
  getISOFields() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
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
    if (ES.IsTemporalYearMonth(item)) {
      const year = GetSlot(item, ISO_YEAR);
      const month = GetSlot(item, ISO_MONTH);
      const calendar = GetSlot(item, CALENDAR);
      const referenceISODay = GetSlot(item, ISO_DAY);
      const result = new this(year, month, calendar, referenceISODay);
      if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalYearMonth(item, this, overflow);
  }
  static compare(one, two) {
    one = ES.ToTemporalYearMonth(one, YearMonth);
    two = ES.ToTemporalYearMonth(two, YearMonth);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return ES.CalendarCompare(GetSlot(one, CALENDAR), GetSlot(two, CALENDAR));
  }
}

MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');
