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

import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  CALENDAR,
  GetSlot
} from './slots.mjs';

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
    isoYear = ES.ToIntegerWithTruncation(isoYear);
    isoMonth = ES.ToIntegerWithTruncation(isoMonth);
    isoDay = ES.ToIntegerWithTruncation(isoDay);
    hour = hour === undefined ? 0 : ES.ToIntegerWithTruncation(hour);
    minute = minute === undefined ? 0 : ES.ToIntegerWithTruncation(minute);
    second = second === undefined ? 0 : ES.ToIntegerWithTruncation(second);
    millisecond = millisecond === undefined ? 0 : ES.ToIntegerWithTruncation(millisecond);
    microsecond = microsecond === undefined ? 0 : ES.ToIntegerWithTruncation(microsecond);
    nanosecond = nanosecond === undefined ? 0 : ES.ToIntegerWithTruncation(nanosecond);
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    if (!ES.IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`unknown calendar ${calendar}`);
    calendar = ES.CanonicalizeCalendar(calendar);

    ES.CreateTemporalDateTimeSlots(
      this,
      isoYear,
      isoMonth,
      isoDay,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
  }
  get calendarId() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get year() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarYear(GetSlot(this, CALENDAR), isoDate);
  }
  get month() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get monthCode() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), isoDate);
  }
  get day() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDay(GetSlot(this, CALENDAR), isoDate);
  }
  get hour() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_NANOSECOND);
  }
  get era() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEra(GetSlot(this, CALENDAR), isoDate);
  }
  get eraYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), isoDate);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), isoDate);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), isoDate);
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarYearOfWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), isoDate);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), isoDate);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDate = ES.TemporalObjectToISODateRecord(this);
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), isoDate);
  }
  with(temporalDateTimeLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalDateTimeLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalDateTimeLike);

    const calendar = GetSlot(this, CALENDAR);
    let fields = ES.TemporalObjectToFields(this);
    fields.hour = GetSlot(this, ISO_HOUR);
    fields.minute = GetSlot(this, ISO_MINUTE);
    fields.second = GetSlot(this, ISO_SECOND);
    fields.millisecond = GetSlot(this, ISO_MILLISECOND);
    fields.microsecond = GetSlot(this, ISO_MICROSECOND);
    fields.nanosecond = GetSlot(this, ISO_NANOSECOND);
    const partialDateTime = ES.PrepareCalendarFields(
      calendar,
      temporalDateTimeLike,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialDateTime);

    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
    const { year, month, day, time } = ES.InterpretTemporalDateTimeFields(calendar, fields, overflow);
    const {
      hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      microsecond = 0,
      nanosecond = 0
    } = time === 'start-of-day' ? {} : time;

    return ES.CreateTemporalDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    temporalTime = ES.ToTemporalTimeOrMidnight(temporalTime);
    return ES.CreateTemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(temporalTime, ISO_HOUR),
      GetSlot(temporalTime, ISO_MINUTE),
      GetSlot(temporalTime, ISO_SECOND),
      GetSlot(temporalTime, ISO_MILLISECOND),
      GetSlot(temporalTime, ISO_MICROSECOND),
      GetSlot(temporalTime, ISO_NANOSECOND),
      GetSlot(this, CALENDAR)
    );
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    calendar = ES.ToTemporalCalendarIdentifier(calendar);
    return ES.CreateTemporalDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND),
      calendar
    );
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

    let year = GetSlot(this, ISO_YEAR);
    let month = GetSlot(this, ISO_MONTH);
    let day = GetSlot(this, ISO_DAY);
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    if (roundingIncrement === 1 && smallestUnit === 'nanosecond') {
      return ES.CreateTemporalDateTime(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        GetSlot(this, CALENDAR)
      );
    }
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundISODateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ));

    return ES.CreateTemporalDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      GetSlot(this, CALENDAR)
    );
  }
  equals(other) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalDateTime(other);
    if (
      ES.CompareISODateTime(
        GetSlot(this, ISO_YEAR),
        GetSlot(this, ISO_MONTH),
        GetSlot(this, ISO_DAY),
        GetSlot(this, ISO_HOUR),
        GetSlot(this, ISO_MINUTE),
        GetSlot(this, ISO_SECOND),
        GetSlot(this, ISO_MILLISECOND),
        GetSlot(this, ISO_MICROSECOND),
        GetSlot(this, ISO_NANOSECOND),
        GetSlot(other, ISO_YEAR),
        GetSlot(other, ISO_MONTH),
        GetSlot(other, ISO_DAY),
        GetSlot(other, ISO_HOUR),
        GetSlot(other, ISO_MINUTE),
        GetSlot(other, ISO_SECOND),
        GetSlot(other, ISO_MILLISECOND),
        GetSlot(other, ISO_MICROSECOND),
        GetSlot(other, ISO_NANOSECOND)
      ) !== 0
    ) {
      return false;
    }
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(options);
    const roundingMode = ES.GetRoundingModeOption(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    const result = ES.RoundISODateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND),
      increment,
      unit,
      roundingMode
    );
    ES.RejectDateTimeRange(
      result.year,
      result.month,
      result.day,
      result.hour,
      result.minute,
      result.second,
      result.millisecond,
      result.microsecond,
      result.nanosecond
    );
    return ES.TemporalDateTimeToString(result, GetSlot(this, CALENDAR), precision, showCalendar);
  }
  toJSON() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const isoDateTime = {
      year: GetSlot(this, ISO_YEAR),
      month: GetSlot(this, ISO_MONTH),
      day: GetSlot(this, ISO_DAY),
      hour: GetSlot(this, ISO_HOUR),
      minute: GetSlot(this, ISO_MINUTE),
      second: GetSlot(this, ISO_SECOND),
      millisecond: GetSlot(this, ISO_MILLISECOND),
      microsecond: GetSlot(this, ISO_MICROSECOND),
      nanosecond: GetSlot(this, ISO_NANOSECOND)
    };
    return ES.TemporalDateTimeToString(isoDateTime, GetSlot(this, CALENDAR), 'auto');
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
    options = ES.GetOptionsObject(options);
    const disambiguation = ES.GetTemporalDisambiguationOption(options);
    const isoDateTime = ES.PlainDateTimeToISODateTimeRecord(this);
    const epochNs = ES.GetEpochNanosecondsFor(timeZone, isoDateTime, disambiguation);
    return ES.CreateTemporalZonedDateTime(epochNs, timeZone, GetSlot(this, CALENDAR));
  }
  toPlainDate() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalDateTimeToDate(this);
  }
  toPlainTime() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalDateTimeToTime(this);
  }

  static from(item, options = undefined) {
    return ES.ToTemporalDateTime(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalDateTime(one);
    two = ES.ToTemporalDateTime(two);
    return ES.CompareISODateTime(
      GetSlot(one, ISO_YEAR),
      GetSlot(one, ISO_MONTH),
      GetSlot(one, ISO_DAY),
      GetSlot(one, ISO_HOUR),
      GetSlot(one, ISO_MINUTE),
      GetSlot(one, ISO_SECOND),
      GetSlot(one, ISO_MILLISECOND),
      GetSlot(one, ISO_MICROSECOND),
      GetSlot(one, ISO_NANOSECOND),
      GetSlot(two, ISO_YEAR),
      GetSlot(two, ISO_MONTH),
      GetSlot(two, ISO_DAY),
      GetSlot(two, ISO_HOUR),
      GetSlot(two, ISO_MINUTE),
      GetSlot(two, ISO_SECOND),
      GetSlot(two, ISO_MILLISECOND),
      GetSlot(two, ISO_MICROSECOND),
      GetSlot(two, ISO_NANOSECOND)
    );
  }
}

MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');
