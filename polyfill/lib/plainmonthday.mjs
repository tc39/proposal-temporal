import { TypeError as TypeErrorCtor } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR, GetSlot, ISO_DATE } from './slots.mjs';

export class PlainMonthDay {
  constructor(isoMonth, isoDay, calendar = 'iso8601', referenceISOYear = 1972) {
    const month = ES.ToIntegerWithTruncation(isoMonth);
    const day = ES.ToIntegerWithTruncation(isoDay);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    calendar = ES.CanonicalizeCalendar(calendar);
    const year = ES.ToIntegerWithTruncation(referenceISOYear);

    ES.RejectISODate(year, month, day);
    ES.CreateTemporalMonthDaySlots(this, { year, month, day }, calendar);
  }

  get monthCode() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthCode: true }).monthCode;
  }
  get day() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { day: true }).day;
  }
  get calendarId() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }

  with(temporalMonthDayLike, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalMonthDayLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalMonthDayLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE), 'month-day');
    const partialMonthDay = ES.PrepareCalendarFields(
      calendar,
      temporalMonthDayLike,
      ['year', 'month', 'monthCode', 'day'],
      [],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialMonthDay);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const isoDate = ES.CalendarMonthDayFromFields(calendar, fields, overflow);
    return ES.CreateTemporalMonthDay(isoDate, calendar);
  }
  equals(other) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalMonthDay(other);
    if (ES.CompareISODate(GetSlot(this, ISO_DATE), GetSlot(other, ISO_DATE)) !== 0) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(resolvedOptions);
    return ES.TemporalMonthDayToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalMonthDayToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainMonthDay');
  }
  toPlainDate(item) {
    if (!ES.IsTemporalMonthDay(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(item) !== 'Object') throw new TypeErrorCtor('argument should be an object');
    const calendar = GetSlot(this, CALENDAR);

    const fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE), 'month-day');
    const inputFields = ES.PrepareCalendarFields(calendar, item, ['year'], [], []);
    let mergedFields = ES.CalendarMergeFields(calendar, fields, inputFields);
    const isoDate = ES.CalendarDateFromFields(calendar, mergedFields, 'constrain');
    return ES.CreateTemporalDate(isoDate, calendar);
  }

  static from(item, options = undefined) {
    return ES.ToTemporalMonthDay(item, options);
  }
}

MakeIntrinsicClass(PlainMonthDay, 'Temporal.PlainMonthDay');
