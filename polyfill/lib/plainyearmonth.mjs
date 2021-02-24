/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR_RECORD,
  CreateSlots,
  GetSlot,
  ISO_DAY,
  ISO_MONTH,
  ISO_YEAR,
  SetSlot,
  YEAR_MONTH_BRAND
} from './slots.mjs';

const ObjectAssign = Object.assign;

function YearMonthToString(yearMonth, showCalendar = 'auto') {
  const year = ES.ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendarRecord = GetSlot(yearMonth, CALENDAR_RECORD);
  const calendarID = ES.CalendarToString(calendarRecord);
  if (calendarID !== 'iso8601') {
    const day = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString += `-${day}`;
  }
  const calendarString = ES.FormatCalendarAnnotation(calendarID, showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export class PlainYearMonth {
  constructor(isoYear, isoMonth, calendar = ES.GetISO8601Calendar(), referenceISODay = 1) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    let calendarRecord;
    if (ES.IsCalendarRecord(calendar)) {
      calendarRecord = calendar;
      calendar = calendar.object;
    } else {
      calendar = ES.ToTemporalCalendar(calendar);
    }
    referenceISODay = ES.ToInteger(referenceISODay);

    // Note: if the arguments are not passed, ToInteger(undefined) will have returned 0, which will
    //       be rejected by RejectDate below. This check exists only to improve the error message.
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoYear and isoMonth are required');
    }

    ES.RejectISODate(isoYear, isoMonth, referenceISODay);
    ES.RejectYearMonthRange(isoYear, isoMonth);
    if (!calendarRecord) calendarRecord = ES.NewCalendarRecord(calendar);

    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, referenceISODay);
    SetSlot(this, CALENDAR_RECORD, calendarRecord);
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
    return ES.CalendarYear(GetSlot(this, CALENDAR_RECORD), this);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR_RECORD), this);
  }
  get monthCode() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR_RECORD), this);
  }
  get calendar() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_RECORD).object;
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR_RECORD), this);
  }
  get eraYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR_RECORD), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR_RECORD), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR_RECORD), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR_RECORD), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR_RECORD), this);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalYearMonthLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    if (temporalYearMonthLike.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (temporalYearMonthLike.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }

    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, ['month', 'monthCode', 'year']);
    const props = ES.ToPartialRecord(temporalYearMonthLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid year-month-like');
    }
    let fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendarRecord, fields, props);

    options = ES.NormalizeOptionsObject(options);

    const Construct = ES.SpeciesConstructor(this, PlainYearMonth);
    return ES.CalendarYearMonthFromFields(calendarRecord, fields, options, Construct);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));

    options = ES.NormalizeOptionsObject(options);

    const TemporalDate = GetIntrinsic('%Temporal.PlainDate%');
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ES.CalendarDaysInMonth(calendarRecord, this) : 1;
    const startDate = ES.CalendarDateFromFields(calendarRecord, { ...fields, day }, {}, TemporalDate);
    const addedDate = ES.CalendarDateAdd(calendarRecord, startDate, { ...duration, days }, options, TemporalDate);
    const addedDateFields = ES.ToTemporalYearMonthFields(addedDate, fieldNames);

    const Construct = ES.SpeciesConstructor(this, PlainYearMonth);
    return ES.CalendarYearMonthFromFields(calendarRecord, addedDateFields, options, Construct);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    duration = {
      years: -duration.years,
      months: -duration.months,
      weeks: -duration.weeks,
      days: -duration.days,
      hours: -duration.hours,
      minutes: -duration.minutes,
      seconds: -duration.seconds,
      milliseconds: -duration.milliseconds,
      microseconds: -duration.microseconds,
      nanoseconds: -duration.nanoseconds
    };
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));

    options = ES.NormalizeOptionsObject(options);

    const TemporalDate = GetIntrinsic('%Temporal.PlainDate%');
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ES.CalendarDaysInMonth(calendarRecord, this) : 1;
    const startDate = ES.CalendarDateFromFields(calendarRecord, { ...fields, day }, {}, TemporalDate);
    const addedDate = ES.CalendarDateAdd(calendarRecord, startDate, { ...duration, days }, options, TemporalDate);
    const addedDateFields = ES.ToTemporalYearMonthFields(addedDate, fieldNames);

    const Construct = ES.SpeciesConstructor(this, PlainYearMonth);
    return ES.CalendarYearMonthFromFields(calendarRecord, addedDateFields, options, Construct);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other, PlainYearMonth);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const otherCalendarRecord = GetSlot(other, CALENDAR_RECORD);
    const calendarID = ES.CalendarToString(calendarRecord);
    const otherCalendarID = ES.CalendarToString(otherCalendarRecord);
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
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const fieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const otherFields = ES.ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const TemporalDate = GetIntrinsic('%Temporal.PlainDate%');
    const otherDate = ES.CalendarDateFromFields(calendarRecord, { ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = ES.CalendarDateFromFields(calendarRecord, { ...thisFields, day: 1 }, {}, TemporalDate);

    const untilOptions = { ...options, largestUnit };
    const result = ES.CalendarDateUntil(calendarRecord, thisDate, otherDate, untilOptions);
    if (smallestUnit === 'months' && roundingIncrement === 1) return result;

    let { years, months } = result;
    const TemporalDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
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
      calendarRecord
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
    other = ES.ToTemporalYearMonth(other, PlainYearMonth);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const otherCalendarRecord = GetSlot(other, CALENDAR_RECORD);
    const calendarID = ES.CalendarToString(calendarRecord);
    const otherCalendarID = ES.CalendarToString(otherCalendarRecord);
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
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false);

    const fieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const otherFields = ES.ToTemporalYearMonthFields(other, fieldNames);
    const thisFields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const TemporalDate = GetIntrinsic('%Temporal.PlainDate%');
    const otherDate = ES.CalendarDateFromFields(calendarRecord, { ...otherFields, day: 1 }, {}, TemporalDate);
    const thisDate = ES.CalendarDateFromFields(calendarRecord, { ...thisFields, day: 1 }, {}, TemporalDate);

    const untilOptions = { ...options, largestUnit };
    let { years, months } = ES.CalendarDateUntil(calendarRecord, thisDate, otherDate, untilOptions);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    if (smallestUnit === 'months' && roundingIncrement === 1) {
      return new Duration(-years, -months, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    const TemporalDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
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
      calendarRecord
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
      ES.NegateTemporalRoundingMode(roundingMode),
      relativeTo
    ));

    return new Duration(-years, -months, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other, PlainYearMonth);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(GetSlot(this, CALENDAR_RECORD), GetSlot(other, CALENDAR_RECORD));
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
    throw new TypeError('use compare() or equals() to compare Temporal.PlainYearMonth');
  }
  toPlainDate(item) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);

    const receiverFieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, receiverFieldNames);

    const inputFieldNames = ES.CalendarFields(calendarRecord, ['day']);
    const entries = [['day']];
    // Add extra fields from the calendar at the end
    inputFieldNames.forEach((fieldName) => {
      if (!entries.some(([name]) => name === fieldName)) {
        entries.push([fieldName, undefined]);
      }
    });
    ObjectAssign(fields, ES.PrepareTemporalFields(item, entries));

    const Date = GetIntrinsic('%Temporal.PlainDate%');
    return ES.CalendarDateFromFields(calendarRecord, fields, { overflow: 'reject' }, Date);
  }
  getISOFields() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR_RECORD).object,
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    if (ES.IsTemporalYearMonth(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      const year = GetSlot(item, ISO_YEAR);
      const month = GetSlot(item, ISO_MONTH);
      const calendar = GetSlot(item, CALENDAR_RECORD).object;
      const referenceISODay = GetSlot(item, ISO_DAY);
      const result = new this(year, month, calendar, referenceISODay);
      if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalYearMonth(item, this, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalYearMonth(one, PlainYearMonth);
    two = ES.ToTemporalYearMonth(two, PlainYearMonth);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return ES.CalendarCompare(GetSlot(one, CALENDAR_RECORD), GetSlot(two, CALENDAR_RECORD));
  }
}

MakeIntrinsicClass(PlainYearMonth, 'Temporal.PlainYearMonth');
