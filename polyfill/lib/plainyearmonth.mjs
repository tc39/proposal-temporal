import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_YEAR, ISO_MONTH, ISO_DAY, CALENDAR, GetSlot } from './slots.mjs';

const ObjectCreate = Object.create;

export class PlainYearMonth {
  constructor(isoYear, isoMonth, calendar = ES.GetISO8601Calendar(), referenceISODay = 1) {
    isoYear = ES.ToIntegerThrowOnInfinity(isoYear);
    isoMonth = ES.ToIntegerThrowOnInfinity(isoMonth);
    calendar = ES.ToTemporalCalendar(calendar);
    referenceISODay = ES.ToIntegerThrowOnInfinity(referenceISODay);

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
    //       be rejected by RejectISODate in CreateTemporalYearMonthSlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoYear and isoMonth are required');
    }

    ES.CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar, referenceISODay);
  }
  get year() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get calendar() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalYearMonthLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectObjectWithCalendarOrTimeZone(temporalYearMonthLike);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['month', 'monthCode', 'year']);
    const props = ES.ToPartialRecord(temporalYearMonthLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid year-month-like');
    }
    let fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.ToTemporalYearMonthFields(fields, fieldNames);

    options = ES.GetOptionsObject(options);

    return ES.CalendarYearMonthFromFields(calendar, fields, options);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToTemporalDurationRecord(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'day'));

    options = ES.GetOptionsObject(options);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ES.ToPositiveInteger(ES.CalendarDaysInMonth(calendar, this)) : 1;
    const startDate = ES.CalendarDateFromFields(calendar, { ...fields, day });
    const optionsCopy = { ...options };
    const addedDate = ES.CalendarDateAdd(calendar, startDate, { ...duration, days }, options);
    const addedDateFields = ES.ToTemporalYearMonthFields(addedDate, fieldNames);

    return ES.CalendarYearMonthFromFields(calendar, addedDateFields, optionsCopy);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToTemporalDurationRecord(temporalDurationLike);
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
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'day'));

    options = ES.GetOptionsObject(options);

    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const day = sign < 0 ? ES.ToPositiveInteger(ES.CalendarDaysInMonth(calendar, this)) : 1;
    const startDate = ES.CalendarDateFromFields(calendar, { ...fields, day });
    const optionsCopy = { ...options };
    const addedDate = ES.CalendarDateAdd(calendar, startDate, { ...duration, days }, options);
    const addedDateFields = ES.ToTemporalYearMonthFields(addedDate, fieldNames);

    return ES.CalendarYearMonthFromFields(calendar, addedDateFields, optionsCopy);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalYearMonth(other);
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    return ES.TemporalYearMonthToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.TemporalYearMonthToString(this);
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
    if (ES.Type(item) !== 'Object') throw new TypeError('argument should be an object');
    const calendar = GetSlot(this, CALENDAR);

    const receiverFieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    let fields = ES.ToTemporalYearMonthFields(this, receiverFieldNames);

    const inputFieldNames = ES.CalendarFields(calendar, ['day']);
    const inputEntries = [['day']];
    // Add extra fields from the calendar at the end
    inputFieldNames.forEach((fieldName) => {
      if (!inputEntries.some(([name]) => name === fieldName)) {
        inputEntries.push([fieldName, undefined]);
      }
    });
    const inputFields = ES.PrepareTemporalFields(item, inputEntries);
    let mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);

    const mergedFieldNames = [...new Set([...receiverFieldNames, ...inputFieldNames])];
    const mergedEntries = [];
    mergedFieldNames.forEach((fieldName) => {
      if (!mergedEntries.some(([name]) => name === fieldName)) {
        mergedEntries.push([fieldName, undefined]);
      }
    });
    mergedFields = ES.PrepareTemporalFields(mergedFields, mergedEntries);
    const options = ObjectCreate(null);
    options.overflow = 'reject';
    return ES.CalendarDateFromFields(calendar, mergedFields, options);
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
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalYearMonth(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      return ES.CreateTemporalYearMonth(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, CALENDAR),
        GetSlot(item, ISO_DAY)
      );
    }
    return ES.ToTemporalYearMonth(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalYearMonth(one);
    two = ES.ToTemporalYearMonth(two);
    return ES.CompareISODate(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY)
    );
  }
}

MakeIntrinsicClass(PlainYearMonth, 'Temporal.PlainYearMonth');
