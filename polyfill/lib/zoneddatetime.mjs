import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR,
  EPOCHNANOSECONDS,
  ISO_HOUR,
  INSTANT,
  ISO_DAY,
  ISO_MONTH,
  ISO_YEAR,
  ISO_MICROSECOND,
  ISO_MILLISECOND,
  ISO_MINUTE,
  ISO_NANOSECOND,
  ISO_SECOND,
  TIME_ZONE,
  GetSlot,
  HasSlot
} from './slots.mjs';

import bigInt from 'big-integer';

const ArrayPrototypePush = Array.prototype.push;

export class ZonedDateTime {
  constructor(epochNanoseconds, timeZone, calendar = ES.GetISO8601Calendar()) {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    //       ToTemporalTimeZone(undefined) will end up calling TimeZone.from("undefined"), which
    //       could succeed.
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochNanoseconds is required');
    }
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    timeZone = ES.ToTemporalTimeZone(timeZone);
    calendar = ES.ToTemporalCalendar(calendar);

    ES.CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone, calendar);
  }
  get calendar() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get timeZone() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIME_ZONE);
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthCode() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR), dateTime(this));
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hour() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(dateTime(this), ISO_NANOSECOND);
  }
  get era() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEra(GetSlot(this, CALENDAR), dateTime(this));
  }
  get eraYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get epochSeconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e6);
  }
  get epochMicroseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get hoursInDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const year = GetSlot(dt, ISO_YEAR);
    const month = GetSlot(dt, ISO_MONTH);
    const day = GetSlot(dt, ISO_DAY);
    const today = new DateTime(year, month, day, 0, 0, 0, 0, 0, 0);
    const tomorrowFields = ES.AddISODate(year, month, day, 0, 0, 0, 1, 'reject');
    const tomorrow = new DateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0, 0, 0);
    const timeZone = GetSlot(this, TIME_ZONE);
    const todayNs = GetSlot(ES.BuiltinTimeZoneGetInstantFor(timeZone, today, 'compatible'), EPOCHNANOSECONDS);
    const tomorrowNs = GetSlot(ES.BuiltinTimeZoneGetInstantFor(timeZone, tomorrow, 'compatible'), EPOCHNANOSECONDS);
    return tomorrowNs.subtract(todayNs).toJSNumber() / 3.6e12;
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR), dateTime(this));
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR), dateTime(this));
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.BuiltinTimeZoneGetOffsetStringFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  get offsetNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      throw new TypeError('invalid zoned-date-time-like');
    }
    if (HasSlot(temporalZonedDateTimeLike, CALENDAR) || HasSlot(temporalZonedDateTimeLike, TIME_ZONE)) {
      throw new TypeError('with() does not support a calendar or timeZone property');
    }
    if (temporalZonedDateTimeLike.calendar !== undefined) {
      throw new TypeError('calendar invalid for with(). use withCalendar()');
    }
    if (temporalZonedDateTimeLike.timeZone !== undefined) {
      throw new TypeError('timeZone invalid for with(). use withTimeZone()');
    }

    options = ES.GetOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'prefer');

    const timeZone = GetSlot(this, TIME_ZONE);
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
    ArrayPrototypePush.call(fieldNames, 'offset');
    const props = ES.ToPartialRecord(temporalZonedDateTimeLike, fieldNames);
    if (!props) {
      throw new TypeError('invalid zoned-date-time-like');
    }
    let fields = ES.ToTemporalZonedDateTimeFields(this, fieldNames);
    fields = ES.CalendarMergeFields(calendar, fields, props);
    fields = ES.ToTemporalZonedDateTimeFields(fields, fieldNames);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
      ES.InterpretTemporalDateTimeFields(calendar, fields, options);
    const offsetNs = ES.ParseOffsetString(fields.offset);
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offsetNs,
      timeZone,
      disambiguation,
      offset
    );

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, GetSlot(this, TIME_ZONE), calendar);
  }
  withPlainDate(temporalDate) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    temporalDate = ES.ToTemporalDate(temporalDate);

    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendar = GetSlot(temporalDate, CALENDAR);
    const thisDt = dateTime(this);
    const hour = GetSlot(thisDt, ISO_HOUR);
    const minute = GetSlot(thisDt, ISO_MINUTE);
    const second = GetSlot(thisDt, ISO_SECOND);
    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);

    calendar = ES.ConsolidateCalendars(GetSlot(this, CALENDAR), calendar);
    const timeZone = GetSlot(this, TIME_ZONE);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
    temporalTime = temporalTime == undefined ? new PlainTime() : ES.ToTemporalTime(temporalTime);

    const thisDt = dateTime(this);
    const year = GetSlot(thisDt, ISO_YEAR);
    const month = GetSlot(thisDt, ISO_MONTH);
    const day = GetSlot(thisDt, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

    const timeZone = GetSlot(this, TIME_ZONE);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    timeZone = ES.ToTemporalTimeZone(timeZone);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    options = ES.GetOptionsObject(options);
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(this, INSTANT),
      timeZone,
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
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    options = ES.GetOptionsObject(options);
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(this, INSTANT),
      timeZone,
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
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond');
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('hour', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceInstant(
        ns1,
        ns2,
        roundingIncrement,
        smallestUnit,
        roundingMode
      ));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        0,
        0,
        0,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        largestUnit
      ));
    } else {
      const timeZone = GetSlot(this, TIME_ZONE);
      if (!ES.TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        );
      }
      const untilOptions = { ...options, largestUnit };
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit, untilOptions));
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
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.AdjustRoundedDurationDays(
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
    }

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other);
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    const calendarId = ES.ToString(calendar);
    const otherCalendarId = ES.ToString(otherCalendar);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond');
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('hour', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    let roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    roundingMode = ES.NegateTemporalRoundingMode(roundingMode);
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceInstant(
        ns1,
        ns2,
        roundingIncrement,
        smallestUnit,
        roundingMode
      ));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        0,
        0,
        0,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        largestUnit
      ));
    } else {
      const timeZone = GetSlot(this, TIME_ZONE);
      if (!ES.TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        );
      }
      const untilOptions = { ...options, largestUnit };
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit, untilOptions));
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
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.AdjustRoundedDurationDays(
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
    }

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
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
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

    // first, round the underlying DateTime fields
    const dt = dateTime(this);
    let year = GetSlot(dt, ISO_YEAR);
    let month = GetSlot(dt, ISO_MONTH);
    let day = GetSlot(dt, ISO_DAY);
    let hour = GetSlot(dt, ISO_HOUR);
    let minute = GetSlot(dt, ISO_MINUTE);
    let second = GetSlot(dt, ISO_SECOND);
    let millisecond = GetSlot(dt, ISO_MILLISECOND);
    let microsecond = GetSlot(dt, ISO_MICROSECOND);
    let nanosecond = GetSlot(dt, ISO_NANOSECOND);

    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const instantStart = ES.BuiltinTimeZoneGetInstantFor(timeZone, dtStart, 'compatible');
    const endNs = ES.AddZonedDateTime(instantStart, timeZone, calendar, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    const dayLengthNs = endNs.subtract(GetSlot(instantStart, EPOCHNANOSECONDS));
    if (dayLengthNs.isZero()) {
      throw new RangeError('cannot round a ZonedDateTime in a calendar with zero-length days');
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
      roundingMode,
      dayLengthNs
    ));

    // Now reset all DateTime fields but leave the TimeZone. The offset will
    // also be retained if the new date/time values are still OK with the old
    // offset. Otherwise the offset will be changed to be compatible with the
    // new date/time values. If DST disambiguation is required, the `compatible`
    // disambiguation algorithm will be used.
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, GetSlot(this, INSTANT));
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offsetNs,
      timeZone,
      'compatible',
      'prefer'
    );

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const showCalendar = ES.ToShowCalendarOption(options);
    const showTimeZone = ES.ToShowTimeZoneNameOption(options);
    const showOffset = ES.ToShowOffsetOption(options);
    return ES.TemporalZonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
      unit,
      increment,
      roundingMode
    });
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  toJSON() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalZonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const timeZone = GetSlot(this, TIME_ZONE);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dtStart, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  toInstant() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toPlainDate() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToDate(dateTime(this));
  }
  toPlainTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.TemporalDateTimeToTime(dateTime(this));
  }
  toPlainDateTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return dateTime(this);
  }
  toPlainYearMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    return ES.YearMonthFromFields(calendar, fields);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const calendar = GetSlot(this, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['day', 'monthCode']);
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    return ES.MonthDayFromFields(calendar, fields);
  }
  getISOFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const tz = GetSlot(this, TIME_ZONE);
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(dt, ISO_DAY),
      isoHour: GetSlot(dt, ISO_HOUR),
      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
      isoMinute: GetSlot(dt, ISO_MINUTE),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
      isoSecond: GetSlot(dt, ISO_SECOND),
      isoYear: GetSlot(dt, ISO_YEAR),
      offset: ES.BuiltinTimeZoneGetOffsetStringFor(tz, GetSlot(this, INSTANT)),
      timeZone: tz
    };
  }
  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    if (ES.IsTemporalZonedDateTime(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      ES.ToTemporalDisambiguation(options);
      ES.ToTemporalOffset(options, 'reject');
      return ES.CreateTemporalZonedDateTime(
        GetSlot(item, EPOCHNANOSECONDS),
        GetSlot(item, TIME_ZONE),
        GetSlot(item, CALENDAR)
      );
    }
    return ES.ToTemporalZonedDateTime(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalZonedDateTime(one);
    two = ES.ToTemporalZonedDateTime(two);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(ns1).lesser(ns2)) return -1;
    if (bigInt(ns1).greater(ns2)) return 1;
    return 0;
  }
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}

function dateTime(zdt) {
  return ES.BuiltinTimeZoneGetPlainDateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, INSTANT), GetSlot(zdt, CALENDAR));
}
