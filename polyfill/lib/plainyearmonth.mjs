import { RangeError as RangeErrorCtor, TypeError as TypeErrorCtor } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { ISO_YEAR, ISO_MONTH, ISO_DAY, CALENDAR, GetSlot } from './slots.mjs';

export class PlainYearMonth {
  constructor(isoYear, isoMonth, calendar = 'iso8601', referenceISODay = 1) {
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    if (!ES.IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`unknown calendar ${calendar}`);
    calendar = ES.CanonicalizeCalendar(calendar);
    referenceISODay = ES.ToIntegerWithTruncation(referenceISODay);

    ES.CreateTemporalYearMonthSlots(this, isoYear, isoMonth, calendar, referenceISODay);
  }
  get year() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarYear(GetSlot(this, CALENDAR), isoDate);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get monthCode() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
  }
  get calendarId() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEra(GetSlot(this, CALENDAR), isoDate);
  }
  get eraYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get monthsInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get inLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
  }
  with(temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalYearMonthLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalYearMonthLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.TemporalObjectToFields(this);
    const partialYearMonth = ES.PrepareCalendarFields(
      calendar,
      temporalYearMonthLike,
      ['month', 'monthCode', 'year'],
      [],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialYearMonth);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const { year, month, day } = ES.CalendarYearMonthFromFields(calendar, fields, overflow);
    return ES.CreateTemporalYearMonth(year, month, calendar, day);
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
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeErrorCtor('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(options);
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

    const fields = ES.TemporalObjectToFields(this);
    const inputFields = ES.PrepareCalendarFields(calendar, item, ['day'], [], []);
    const mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);
    const { year, month, day } = ES.CalendarDateFromFields(calendar, mergedFields, 'constrain');
    return ES.CreateTemporalDate(year, month, day, calendar);
  }

  static from(item, options = undefined) {
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
