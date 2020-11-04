/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  YEAR_MONTH_BRAND,
  CALENDAR,
  CALENDAR_ID,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

function YearMonthToString(yearMonth, showCalendar = 'auto') {
  const year = ES.ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendar = GetSlot(yearMonth, CALENDAR);
  if (!(ES.IsTemporalCalendar(calendar) && GetSlot(calendar, CALENDAR_ID) === 'iso8601')) {
    const day = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString += `-${day}`;
  }
  const calendarString = ES.FormatCalendarAnnotation(calendar, showCalendar);
  if (calendarString) resultString += calendarString;
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
        value: `${this[Symbol.toStringTag]} <${YearMonthToString(this)}>`,
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
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).inLeapYear(this);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if ('calendar' in temporalYearMonthLike) {
      throw new RangeError('invalid calendar property in year-month-like');
    }
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const props = ES.ToPartialRecord(temporalYearMonthLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid year-month-like');
    }
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(fields, options, Construct);
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
    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
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
    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? 1 : calendar.daysInMonth(this);
    const startDate = calendar.dateFromFields({ ...fields, day }, {}, TemporalDate);
    const subtractedDate = calendar.dateSubtract(startDate, { ...duration, days }, options, TemporalDate);

    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = calendar.yearMonthFromFields(subtractedDate, options, Construct);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other, YearMonth);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarID = ES.CalendarToString(calendar);
    const otherCalendarID = ES.CalendarToString(otherCalendar);
    if (calendarID !== otherCalendarID) {
      throw new RangeError(
        `cannot compute difference between months of ${calendarID} and ${otherCalendarID} calendars`
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
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const otherFields = ES.ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const otherDate = calendar.dateFromFields({ ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = calendar.dateFromFields({ ...thisFields, day: 1 }, {}, TemporalDate);

    const result = calendar.dateUntil(thisDate, otherDate, { largestUnit });
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
  since(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other, YearMonth);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarID = ES.CalendarToString(calendar);
    const otherCalendarID = ES.CalendarToString(otherCalendar);
    if (calendarID !== otherCalendarID) {
      throw new RangeError(
        `cannot compute difference between months of ${calendarID} and ${otherCalendarID} calendars`
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
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const otherFields = ES.ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const TemporalDate = GetIntrinsic('%Temporal.Date%');
    const otherDate = calendar.dateFromFields({ ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = calendar.dateFromFields({ ...thisFields, day: 1 }, {}, TemporalDate);

    const result = calendar.dateUntil(otherDate, thisDate, { largestUnit });
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
      -years,
      -months,
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
      ES.NegateTemporalRoundingMode(roundingMode),
      relativeTo
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(-years, -months, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other, YearMonth);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    return YearMonthToString(this, showCalendar);
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
  toPlainDate(item) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);

    const receiverFieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, receiverFieldNames);

    const inputFieldNames = ES.CalendarFields(calendar, ['day']);
    const entries = [['day']];
    // Add extra fields from the calendar at the end
    inputFieldNames.forEach((fieldName) => {
      if (!entries.some(([name]) => name === fieldName)) {
        entries.push([fieldName, undefined]);
      }
    });
    ObjectAssign(fields, ES.ToRecord(item, entries));

    const Date = GetIntrinsic('%Temporal.Date%');
    return calendar.dateFromFields(fields, { overflow: 'reject' }, Date);
  }
  getFields() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['month', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    fields.calendar = calendar;
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
