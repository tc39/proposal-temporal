import { TypeError as TypeErrorCtor } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR, GetSlot, ISO_DATE, TIME } from './slots.mjs';

export class PlainDate {
  constructor(isoYear, isoMonth, isoDay, calendar = 'iso8601') {
    const year = ES.ToIntegerWithTruncation(isoYear);
    const month = ES.ToIntegerWithTruncation(isoMonth);
    const day = ES.ToIntegerWithTruncation(isoDay);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    calendar = ES.CanonicalizeCalendar(calendar);
    ES.RejectISODate(year, month, day);

    ES.CreateTemporalDateSlots(this, { year, month, day }, calendar);
  }
  get calendarId() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { era: true }).era;
  }
  get eraYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { eraYear: true }).eraYear;
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { year: true }).year;
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { month: true }).month;
  }
  get monthCode() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthCode: true }).monthCode;
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { day: true }).day;
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { dayOfWeek: true }).dayOfWeek;
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { dayOfYear: true }).dayOfYear;
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { weekOfYear: true }).weekOfYear.week;
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { weekOfYear: true }).weekOfYear.year;
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInWeek: true }).daysInWeek;
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInMonth: true }).daysInMonth;
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInYear: true }).daysInYear;
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthsInYear: true }).monthsInYear;
  }
  get inLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE);
    return ES.calendarImplForObj(this).isoToDate(isoDate, { inLeapYear: true }).inLeapYear;
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalDateLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalDateLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE));
    const partialDate = ES.PrepareCalendarFields(
      calendar,
      temporalDateLike,
      ['year', 'month', 'monthCode', 'day'],
      [],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialDate);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const isoDate = ES.CalendarDateFromFields(calendar, fields, overflow);
    return ES.CreateTemporalDate(isoDate, calendar);
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    calendar = ES.ToTemporalCalendarIdentifier(calendar);
    return ES.CreateTemporalDate(GetSlot(this, ISO_DATE), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToDate('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToDate('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainDate('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainDate('since', this, other, options);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalDate(other);
    if (ES.CompareISODate(GetSlot(this, ISO_DATE), GetSlot(other, ISO_DATE)) !== 0) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(resolvedOptions);
    return ES.TemporalDateToString(this, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalDateToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainDate');
  }
  toPlainDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const time = ES.ToTimeRecordOrMidnight(temporalTime);
    const isoDateTime = ES.CombineISODateAndTimeRecord(GetSlot(this, ISO_DATE), time);
    return ES.CreateTemporalDateTime(isoDateTime, GetSlot(this, CALENDAR));
  }
  toZonedDateTime(item) {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');

    let timeZone, temporalTime;
    if (ES.Type(item) === 'Object') {
      const timeZoneLike = item.timeZone;
      if (timeZoneLike === undefined) {
        timeZone = ES.ToTemporalTimeZoneIdentifier(item);
      } else {
        timeZone = ES.ToTemporalTimeZoneIdentifier(timeZoneLike);
        temporalTime = item.plainTime;
      }
    } else {
      timeZone = ES.ToTemporalTimeZoneIdentifier(item);
    }

    const isoDate = GetSlot(this, ISO_DATE);
    let epochNs;
    if (temporalTime === undefined) {
      epochNs = ES.GetStartOfDay(timeZone, isoDate);
    } else {
      temporalTime = ES.ToTemporalTime(temporalTime);
      const isoDateTime = ES.CombineISODateAndTimeRecord(isoDate, GetSlot(temporalTime, TIME));
      epochNs = ES.GetEpochNanosecondsFor(timeZone, isoDateTime, 'compatible');
    }
    return ES.CreateTemporalZonedDateTime(epochNs, timeZone, GetSlot(this, CALENDAR));
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE));
    const isoDate = ES.CalendarYearMonthFromFields(calendar, fields);
    return ES.CreateTemporalYearMonth(isoDate, calendar);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeErrorCtor('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE));
    const isoDate = ES.CalendarMonthDayFromFields(calendar, fields);
    return ES.CreateTemporalMonthDay(isoDate, calendar);
  }

  static from(item, options = undefined) {
    return ES.ToTemporalDate(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDate(one);
    two = ES.ToTemporalDate(two);
    return ES.CompareISODate(GetSlot(one, ISO_DATE), GetSlot(two, ISO_DATE));
  }
}

MakeIntrinsicClass(PlainDate, 'Temporal.PlainDate');
