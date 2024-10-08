import { TypeError as TypeErrorCtor } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR, GetSlot, ISO_DATE } from './slots.mjs';

export class PlainYearMonth {
  constructor(isoYear, isoMonth, calendar = 'iso8601', referenceISODay = 1) {
    const year = ES.ToIntegerWithTruncation(isoYear);
    const month = ES.ToIntegerWithTruncation(isoMonth);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    calendar = ES.CanonicalizeCalendar(calendar);
    const day = ES.ToIntegerWithTruncation(referenceISODay);

    ES.RejectISODate(year, month, day);
    ES.CreateTemporalYearMonthSlots(this, { year, month, day }, calendar);
  }
  get year() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { year: true }).year;
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { month: true }).month;
  }
  get monthCode() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthCode: true }).monthCode;
  }
  get calendarId() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { era: true }).era;
  }
  get eraYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { eraYear: true }).eraYear;
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInMonth: true }).daysInMonth;
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInYear: true }).daysInYear;
  }
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthsInYear: true }).monthsInYear;
  }
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { inLeapYear: true }).inLeapYear;
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalYearMonthLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalYearMonthLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE), 'year-month');
    const partialYearMonth = ES.PrepareCalendarFields(
      calendar,
      temporalYearMonthLike,
      ['year', 'month', 'monthCode'],
      [],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialYearMonth);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const isoDate = ES.CalendarYearMonthFromFields(calendar, fields, overflow);
    return ES.CreateTemporalYearMonth(isoDate, calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToYearMonth('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToYearMonth('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainYearMonth('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalYearMonth(other);
    if (ES.CompareISODate(GetSlot(this, ISO_DATE), GetSlot(other, ISO_DATE)) !== 0) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(resolvedOptions);
    return ES.TemporalYearMonthToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalYearMonthToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainYearMonth');
  }
  toPlainDate(item) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(item) !== 'Object') throw new TypeErrorCtor('argument should be an object');
    const calendar = GetSlot(this, CALENDAR);

    const fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE), 'year-month');
    const inputFields = ES.PrepareCalendarFields(calendar, item, ['day'], [], []);
    const mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);
    const isoDate = ES.CalendarDateFromFields(calendar, mergedFields, 'constrain');
    return ES.CreateTemporalDate(isoDate, calendar);
  }

  static from(item, options = undefined) {
    return ES.ToTemporalYearMonth(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalYearMonth(one);
    two = ES.ToTemporalYearMonth(two);
    return ES.CompareISODate(GetSlot(one, ISO_DATE), GetSlot(two, ISO_DATE));
  }
}

MakeIntrinsicClass(PlainYearMonth, 'Temporal.PlainYearMonth');
