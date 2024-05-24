import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CalendarMethodRecord, TimeZoneMethodRecord } from './methodrecord.mjs';

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
  EPOCHNANOSECONDS,
  GetSlot
} from './slots.mjs';

const ArrayPrototypePush = Array.prototype.push;
const ObjectCreate = Object.create;

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
    calendar = ES.ToTemporalCalendarSlotValue(calendar);

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
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarIdentifier(GetSlot(this, CALENDAR));
  }
  get year() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), this);
  }
  get month() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), this);
  }
  get monthCode() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), this);
  }
  get day() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['day']);
    return ES.CalendarDay(calendarRec, this);
  }
  get hour() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_NANOSECOND);
  }
  get era() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), this);
  }
  get eraYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), this);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), this);
  }
  get yearOfWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYearOfWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), this);
  }
  get inLeapYear() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), this);
  }
  with(temporalDateTimeLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalDateTimeLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalDateTimeLike);

    const resolvedOptions = ES.SnapshotOwnProperties(ES.GetOptionsObject(options), null);
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['dateFromFields', 'fields', 'mergeFields']);
    let { fields, fieldNames } = ES.PrepareCalendarFieldsAndFieldNames(calendarRec, this, [
      'day',
      'month',
      'monthCode',
      'year'
    ]);
    fields.hour = GetSlot(this, ISO_HOUR);
    fields.minute = GetSlot(this, ISO_MINUTE);
    fields.second = GetSlot(this, ISO_SECOND);
    fields.millisecond = GetSlot(this, ISO_MILLISECOND);
    fields.microsecond = GetSlot(this, ISO_MICROSECOND);
    fields.nanosecond = GetSlot(this, ISO_NANOSECOND);
    ES.Call(ArrayPrototypePush, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);
    const partialDateTime = ES.PrepareTemporalFields(temporalDateTimeLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendarRec, fields, partialDateTime);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
      ES.InterpretTemporalDateTimeFields(calendarRec, fields, resolvedOptions);

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
      calendarRec.receiver
    );
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
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
  withPlainDate(temporalDate) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');

    temporalDate = ES.ToTemporalDate(temporalDate);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendar = GetSlot(temporalDate, CALENDAR);

    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);

    calendar = ES.ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
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
  withCalendar(calendar) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
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
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToPlainDateTime(this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDateTime('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalPlainDateTime('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    if (roundTo === undefined) throw new TypeError('options parameter is required');
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
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
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
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(options);
    const roundingMode = ES.GetRoundingModeOption(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    return ES.TemporalDateTimeToString(this, precision, showCalendar, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToString(this, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainDateTime');
  }

  toZonedDateTime(temporalTimeZoneLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
    options = ES.GetOptionsObject(options);
    const disambiguation = ES.GetTemporalDisambiguationOption(options);
    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
    const instant = ES.GetInstantFor(timeZoneRec, this, disambiguation);
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  toPlainDate() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(this);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'yearMonthFromFields']);
    const fields = ES.PrepareCalendarFields(calendarRec, this, ['monthCode', 'year'], [], []);
    return ES.CalendarYearMonthFromFields(calendarRec, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendarRec = new CalendarMethodRecord(GetSlot(this, CALENDAR), ['fields', 'monthDayFromFields']);
    const fields = ES.PrepareCalendarFields(calendarRec, this, ['day', 'monthCode'], [], []);
    return ES.CalendarMonthDayFromFields(calendarRec, fields);
  }
  toPlainTime() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(this);
  }
  getISOFields() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoHour: GetSlot(this, ISO_HOUR),
      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
      isoMinute: GetSlot(this, ISO_MINUTE),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
      isoSecond: GetSlot(this, ISO_SECOND),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  getCalendar() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalCalendarObject(GetSlot(this, CALENDAR));
  }

  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalDateTime(item)) {
      ES.GetTemporalOverflowOption(options); // validate and ignore
      return ES.CreateTemporalDateTime(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, ISO_HOUR),
        GetSlot(item, ISO_MINUTE),
        GetSlot(item, ISO_SECOND),
        GetSlot(item, ISO_MILLISECOND),
        GetSlot(item, ISO_MICROSECOND),
        GetSlot(item, ISO_NANOSECOND),
        GetSlot(item, CALENDAR)
      );
    }
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
