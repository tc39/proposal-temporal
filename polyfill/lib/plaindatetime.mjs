import {
  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ObjectCreate
} from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import { CALENDAR, GetSlot, ISO_DATE_TIME } from './slots.mjs';

export class PlainDateTime {
  constructor(
    isoYear,
    isoMonth,
    isoDay,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0,
    calendar = 'iso8601'
  ) {
    const year = ES.ToIntegerWithTruncation(isoYear);
    const month = ES.ToIntegerWithTruncation(isoMonth);
    const day = ES.ToIntegerWithTruncation(isoDay);
    hour = hour === undefined ? 0 : ES.ToIntegerWithTruncation(hour);
    minute = minute === undefined ? 0 : ES.ToIntegerWithTruncation(minute);
    second = second === undefined ? 0 : ES.ToIntegerWithTruncation(second);
    millisecond = millisecond === undefined ? 0 : ES.ToIntegerWithTruncation(millisecond);
    microsecond = microsecond === undefined ? 0 : ES.ToIntegerWithTruncation(microsecond);
    nanosecond = nanosecond === undefined ? 0 : ES.ToIntegerWithTruncation(nanosecond);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    calendar = ES.CanonicalizeCalendar(calendar);

    ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

    ES.CreateTemporalDateTimeSlots(
      this,
      { isoDate: { year, month, day }, time: { hour, minute, second, millisecond, microsecond, nanosecond } },
      calendar
    );
  }
  get calendarId() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get year() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { year: true }).year;
  }
  get month() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { month: true }).month;
  }
  get monthCode() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthCode: true }).monthCode;
  }
  get day() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { day: true }).day;
  }
  get hour() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.hour;
  }
  get minute() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.minute;
  }
  get second() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.second;
  }
  get millisecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.millisecond;
  }
  get microsecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.microsecond;
  }
  get nanosecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_DATE_TIME).time.nanosecond;
  }
  get era() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { era: true }).era;
  }
  get eraYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { eraYear: true }).eraYear;
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { dayOfWeek: true }).dayOfWeek;
  }
  get dayOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { dayOfYear: true }).dayOfYear;
  }
  get weekOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { weekOfYear: true }).weekOfYear.week;
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { weekOfYear: true }).weekOfYear.year;
  }
  get daysInWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInWeek: true }).daysInWeek;
  }
  get daysInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInYear: true }).daysInYear;
  }
  get daysInMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { daysInMonth: true }).daysInMonth;
  }
  get monthsInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { monthsInYear: true }).monthsInYear;
  }
  get inLeapYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = GetSlot(this, ISO_DATE_TIME).isoDate;
    return ES.calendarImplForObj(this).isoToDate(isoDate, { inLeapYear: true }).inLeapYear;
  }
  with(temporalDateTimeLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalDateTimeLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalDateTimeLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.ISODateToFields(calendar, GetSlot(this, ISO_DATE_TIME).isoDate);
    const isoDateTime = GetSlot(this, ISO_DATE_TIME);
    fields = { ...fields, ...isoDateTime.time };
    const partialDateTime = ES.PrepareCalendarFields(
      calendar,
      temporalDateTimeLike,
      ['year', 'month', 'monthCode', 'day'],
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialDateTime);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const newDateTime = ES.InterpretTemporalDateTimeFields(calendar, fields, overflow);
    return ES.CreateTemporalDateTime(newDateTime, calendar);
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const time = ES.ToTimeRecordOrMidnight(temporalTime);
    const isoDateTime = ES.CombineISODateAndTimeRecord(GetSlot(this, ISO_DATE_TIME).isoDate, time);
    return ES.CreateTemporalDateTime(isoDateTime, GetSlot(this, CALENDAR));
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    calendar = ES.ToTemporalCalendarIdentifier(calendar);
    return ES.CreateTemporalDateTime(GetSlot(this, ISO_DATE_TIME), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToDateTime('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToDateTime('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainDateTime('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainDateTime('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    if (roundTo === undefined) throw new TypeErrorCtor('options parameter is required');
    if (ES.Type(roundTo) === 'String') {
      const stringParam = roundTo;
      roundTo = ObjectCreate(null);
      roundTo.smallestUnit = stringParam;
    } else {
      roundTo = ES.GetOptionsObject(roundTo);
    }
    const roundingIncrement = ES.GetRoundingIncrementOption(roundTo);
    const roundingMode = ES.GetRoundingModeOption(roundTo, 'halfExpand');
    const smallestUnit = ES.GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', ES.REQUIRED, ['day']);
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const maximum = maximumIncrements[smallestUnit];
    const inclusive = maximum === 1;
    ES.ValidateTemporalRoundingIncrement(roundingIncrement, maximum, inclusive);

    const isoDateTime = GetSlot(this, ISO_DATE_TIME);
    if (roundingIncrement === 1 && smallestUnit === 'nanosecond') {
      return ES.CreateTemporalDateTime(isoDateTime, GetSlot(this, CALENDAR));
    }
    const result = ES.RoundISODateTime(isoDateTime, roundingIncrement, smallestUnit, roundingMode);

    return ES.CreateTemporalDateTime(result, GetSlot(this, CALENDAR));
  }
  equals(other) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalDateTime(other);
    if (ES.CompareISODateTime(GetSlot(this, ISO_DATE_TIME), GetSlot(other, ISO_DATE_TIME)) !== 0) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(resolvedOptions);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    const result = ES.RoundISODateTime(GetSlot(this, ISO_DATE_TIME), increment, unit, roundingMode);
    ES.RejectDateTimeRange(result);
    return ES.ISODateTimeToString(result, GetSlot(this, CALENDAR), precision, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.ISODateTimeToString(GetSlot(this, ISO_DATE_TIME), GetSlot(this, CALENDAR), 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainDateTime');
  }

  toZonedDateTime(temporalTimeZoneLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
    const resolvedOptions = ES.GetOptionsObject(options);
    const disambiguation = ES.GetTemporalDisambiguationOption(resolvedOptions);
    const epochNs = ES.GetEpochNanosecondsFor(timeZone, GetSlot(this, ISO_DATE_TIME), disambiguation);
    return ES.CreateTemporalZonedDateTime(epochNs, timeZone, GetSlot(this, CALENDAR));
  }
  toPlainDate() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateTemporalDate(GetSlot(this, ISO_DATE_TIME).isoDate, GetSlot(this, CALENDAR));
  }
  toPlainTime() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateTemporalTime(GetSlot(this, ISO_DATE_TIME).time);
  }

  static from(item, options = undefined) {
    return ES.ToTemporalDateTime(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDateTime(one);
    two = ES.ToTemporalDateTime(two);
    return ES.CompareISODateTime(GetSlot(one, ISO_DATE_TIME), GetSlot(two, ISO_DATE_TIME));
  }
}

MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');
