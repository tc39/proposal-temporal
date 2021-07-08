import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';

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
  TIME_ZONE,
  EPOCHNANOSECONDS,
  GetSlot,
  HasSlot
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
    calendar = ES.GetISO8601Calendar()
  ) {
    isoYear = ES.ToFiniteInteger(isoYear);
    isoMonth = ES.ToFiniteInteger(isoMonth);
    isoDay = ES.ToFiniteInteger(isoDay);
    hour = ES.ToFiniteInteger(hour);
    minute = ES.ToFiniteInteger(minute);
    second = ES.ToFiniteInteger(second);
    millisecond = ES.ToFiniteInteger(millisecond);
    microsecond = ES.ToFiniteInteger(microsecond);
    nanosecond = ES.ToFiniteInteger(nanosecond);
    calendar = ES.ToTemporalCalendar(calendar);

    // Note: if the arguments are not passed, ToInteger(undefined) will have returned 0, which will
    //       be rejected by RejectDateTime in CreateTemporalDateTimeSlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required');
    }

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
  get calendar() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
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
    if (HasSlot(temporalDateTimeLike, CALENDAR) || HasSlot(temporalDateTimeLike, TIME_ZONE)) {
      throw new TypeError('with() does not support a calendar or timeZone property');
    }
    if (temporalDateTimeLike.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (temporalDateTimeLike.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }

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
    const props = ES.ToPartialRecord(temporalDateTimeLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid date-time-like');
    }
    let fields = ES.ToTemporalDateTimeFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.ToTemporalDateTimeFields(fields, fieldNames);
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
    calendar = ES.ToTemporalCalendar(calendar);
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
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    options = ES.GetOptionsObject(options);
    const calendar = GetSlot(this, CALENDAR);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND),
      calendar,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      options
    );
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
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    options = ES.GetOptionsObject(options);
    const calendar = GetSlot(this, CALENDAR);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddDateTime(
      GetSlot(this, ISO_YEAR),
      GetSlot(this, ISO_MONTH),
      GetSlot(this, ISO_DAY),
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND),
      calendar,
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds,
      options
    );
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
  until(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDateTime(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond');
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.DifferenceISODateTime(
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
        GetSlot(other, ISO_NANOSECOND),
        calendar,
        largestUnit,
        options
      );

    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.RoundDuration(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        roundingIncrement,
        smallestUnit,
        roundingMode,
        this
      ));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalDateTime(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond');
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.DifferenceISODateTime(
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
        GetSlot(other, ISO_NANOSECOND),
        calendar,
        largestUnit,
        options
      );

    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.RoundDuration(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        roundingIncrement,
        smallestUnit,
        ES.NegateTemporalRoundingMode(roundingMode),
        this
      ));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds
    );
  }
  round(options) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, undefined, ['year', 'month', 'week']);
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required');
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand');
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

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
    for (const slot of [
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarEquals(this, other);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const showCalendar = ES.ToShowCalendarOption(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
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
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    options = ES.GetOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, this, disambiguation);
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
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    return ES.YearMonthFromFields(calendar, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    return ES.MonthDayFromFields(calendar, fields);
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
    for (const slot of [
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return 0;
  }
}

MakeIntrinsicClass(PlainDateTime, 'Temporal.PlainDateTime');
