import { ES } from './ecmascript.mjs';
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
  EPOCHNANOSECONDS,
  GetSlot
} from './slots.mjs';

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
    return ES.CalendarDay(GetSlot(this, CALENDAR), this);
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
    ES.RejectTemporalObject(temporalDateTimeLike);

    options = ES.GetOptionsObject(options);
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, [
      'day',
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'month',
      'monthCode',
      'nanosecond',
      'second',
      'year'
    ]);
    let fields = ES.PrepareTemporalFields(this, fieldNames, []);
    const partialDateTime = ES.PrepareTemporalFields(temporalDateTimeLike, fieldNames, 'partial');
    fields = ES.CalendarMergeFields(calendar, fields, partialDateTime);
    fields = ES.PrepareTemporalFields(fields, fieldNames, []);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
      ES.InterpretTemporalDateTimeFields(calendar, fields, options);

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
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);

    if (temporalTime === undefined) return ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);

    temporalTime = ES.ToTemporalTime(temporalTime);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

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
    return new PlainDateTime(
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
    return ES.AddDurationToOrSubtractDurationFromPlainDateTime('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.AddDurationToOrSubtractDurationFromPlainDateTime('subtract', this, temporalDurationLike, options);
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
    const roundingIncrement = ES.ToTemporalRoundingIncrement(roundTo);
    const roundingMode = ES.ToTemporalRoundingMode(roundTo, 'halfExpand');
    const smallestUnit = ES.GetTemporalUnit(roundTo, 'smallestUnit', 'time', ES.REQUIRED, ['day']);
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
    if (GetSlot(this, ISO_YEAR) !== GetSlot(other, ISO_YEAR)) return false;
    if (GetSlot(this, ISO_MONTH) !== GetSlot(other, ISO_MONTH)) return false;
    if (GetSlot(this, ISO_DAY) !== GetSlot(other, ISO_DAY)) return false;
    if (GetSlot(this, ISO_HOUR) !== GetSlot(other, ISO_HOUR)) return false;
    if (GetSlot(this, ISO_MINUTE) !== GetSlot(other, ISO_MINUTE)) return false;
    if (GetSlot(this, ISO_SECOND) !== GetSlot(other, ISO_SECOND)) return false;
    if (GetSlot(this, ISO_MILLISECOND) !== GetSlot(other, ISO_MILLISECOND)) return false;
    if (GetSlot(this, ISO_MICROSECOND) !== GetSlot(other, ISO_MICROSECOND)) return false;
    if (GetSlot(this, ISO_NANOSECOND) !== GetSlot(other, ISO_NANOSECOND)) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const showCalendar = ES.ToCalendarNameOption(options);
    const digits = ES.ToFractionalSecondDigits(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnit(options, 'smallestUnit', 'time', undefined);
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
    throw new TypeError('use compare() or equals() to compare Temporal.PlainDateTime');
  }

  toZonedDateTime(temporalTimeZoneLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
    options = ES.GetOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const instant = ES.GetInstantFor(timeZone, this, disambiguation);
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  toPlainDate() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(this);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarYearMonthFromFields(calendar, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.PrepareTemporalFields(this, fieldNames, []);
    return ES.CalendarMonthDayFromFields(calendar, fields);
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
      ES.ToTemporalOverflow(options); // validate and ignore
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
    const slots = [
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ];
    for (let index = 0; index < slots.length; index++) {
      const slot = slots[index];
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return 0;
  }
}

MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');
