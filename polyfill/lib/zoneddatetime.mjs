/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  CALENDAR_RECORD,
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
  TIME_ZONE_RECORD,
  CreateSlots,
  GetSlot,
  SetSlot
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
    let timeZoneRecord;
    if (ES.IsTimeZoneRecord(timeZone)) {
      timeZoneRecord = timeZone;
      timeZone = timeZone.object;
    } else {
      timeZone = ES.ToTemporalTimeZone(timeZone);
    }
    let calendarRecord;
    if (ES.IsCalendarRecord(calendar)) {
      calendarRecord = calendar;
      calendar = calendar.object;
    } else {
      calendar = ES.ToTemporalCalendar(calendar);
    }

    ES.RejectInstantRange(epochNanoseconds);
    if (!timeZoneRecord) timeZoneRecord = ES.NewTimeZoneRecord(timeZone);
    if (!calendarRecord) calendarRecord = ES.NewCalendarRecord(calendar);

    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
    SetSlot(this, TIME_ZONE_RECORD, timeZoneRecord);
    SetSlot(this, CALENDAR_RECORD, calendarRecord);

    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const instant = new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
    SetSlot(this, INSTANT, instant);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${zonedDateTimeToString(this, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR_RECORD).object;
  }
  get timeZone() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIME_ZONE_RECORD).object;
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonth(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get monthCode() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthCode(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDay(GetSlot(this, CALENDAR_RECORD), dateTime(this));
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
    return ES.CalendarEra(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get eraYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarEraYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
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
    return ES.CalendarDayOfWeek(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDayOfYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarWeekOfYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
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
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const todayNs = GetSlot(ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, today, 'compatible'), EPOCHNANOSECONDS);
    const tomorrowNs = GetSlot(
      ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, tomorrow, 'compatible'),
      EPOCHNANOSECONDS
    );
    return tomorrowNs.subtract(todayNs).toJSNumber() / 3.6e12;
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInWeek(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInMonth(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarDaysInYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarMonthsInYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.CalendarInLeapYear(GetSlot(this, CALENDAR_RECORD), dateTime(this));
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.BuiltinTimeZoneGetOffsetStringFor(GetSlot(this, TIME_ZONE_RECORD), GetSlot(this, INSTANT));
  }
  get offsetNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    return ES.GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE_RECORD), GetSlot(this, INSTANT));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      throw new TypeError('invalid zoned-date-time-like');
    }
    if (temporalZonedDateTimeLike.calendar !== undefined) {
      throw new TypeError('calendar invalid for with(). use withCalendar()');
    }
    if (temporalZonedDateTimeLike.timeZone !== undefined) {
      throw new TypeError('timeZone invalid for with(). use withTimeZone()');
    }

    options = ES.NormalizeOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const offset = ES.ToTemporalOffset(options, 'prefer');

    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, [
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
    fields = ES.CalendarMergeFields(calendarRecord, fields, props);
    let {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    } = ES.InterpretTemporalDateTimeFields(calendarRecord, fields, options);
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
      timeZoneRecord,
      disambiguation,
      offset
    );

    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZoneRecord.object, calendarRecord.object);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  withPlainDate(temporalDate) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    temporalDate = ES.ToTemporalDate(temporalDate, GetIntrinsic('%Temporal.PlainDate%'));

    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    let calendarRecord = GetSlot(temporalDate, CALENDAR_RECORD);
    const thisDt = dateTime(this);
    const hour = GetSlot(thisDt, ISO_HOUR);
    const minute = GetSlot(thisDt, ISO_MINUTE);
    const second = GetSlot(thisDt, ISO_SECOND);
    const millisecond = GetSlot(thisDt, ISO_MILLISECOND);
    const microsecond = GetSlot(thisDt, ISO_MICROSECOND);
    const nanosecond = GetSlot(thisDt, ISO_NANOSECOND);

    calendarRecord = ES.ConsolidateCalendars(GetSlot(this, CALENDAR_RECORD), calendarRecord);
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendarRecord
    );
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, dt, 'compatible');
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    return new Construct(GetSlot(instant, EPOCHNANOSECONDS), timeZoneRecord.object, calendarRecord.object);
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');

    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
    temporalTime = temporalTime == undefined ? new PlainTime() : ES.ToTemporalTime(temporalTime, PlainTime);

    const thisDt = dateTime(this);
    const year = GetSlot(thisDt, ISO_YEAR);
    const month = GetSlot(thisDt, ISO_MONTH);
    const day = GetSlot(thisDt, ISO_DAY);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const hour = GetSlot(temporalTime, ISO_HOUR);
    const minute = GetSlot(temporalTime, ISO_MINUTE);
    const second = GetSlot(temporalTime, ISO_SECOND);
    const millisecond = GetSlot(temporalTime, ISO_MILLISECOND);
    const microsecond = GetSlot(temporalTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(temporalTime, ISO_NANOSECOND);

    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendarRecord
    );
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, dt, 'compatible');
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    return new Construct(GetSlot(instant, EPOCHNANOSECONDS), timeZoneRecord.object, calendarRecord.object);
  }
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    timeZone = ES.ToTemporalTimeZone(timeZone);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR_RECORD).object);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE_RECORD).object, calendar);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(this, INSTANT),
      timeZoneRecord,
      calendarRecord,
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
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZoneRecord.object, calendarRecord.object);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    options = ES.NormalizeOptionsObject(options);
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(this, INSTANT),
      timeZoneRecord,
      calendarRecord,
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
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZoneRecord.object, calendarRecord.object);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const otherCalendarRecord = GetSlot(other, CALENDAR_RECORD);
    const calendarId = ES.CalendarToString(calendarRecord);
    const otherCalendarId = ES.CalendarToString(otherCalendarRecord);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('hours', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== 'years' && largestUnit !== 'months' && largestUnit !== 'weeks' && largestUnit !== 'days') {
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
      const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
      if (!ES.TimeZoneEquals(timeZoneRecord, GetSlot(other, TIME_ZONE_RECORD))) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        );
      }
      const untilOptions = { ...options, largestUnit };
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.DifferenceZonedDateTime(ns1, ns2, timeZoneRecord, calendarRecord, largestUnit, untilOptions));
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.RoundDuration(
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
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.AdjustRoundedDurationDays(
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
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const otherCalendarRecord = GetSlot(other, CALENDAR_RECORD);
    const calendarId = ES.CalendarToString(calendarRecord);
    const otherCalendarId = ES.CalendarToString(otherCalendarRecord);
    if (calendarId !== otherCalendarId) {
      throw new RangeError(`cannot compute difference between dates of ${calendarId} and ${otherCalendarId} calendars`);
    }
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds');
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('hours', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    let roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    roundingMode = ES.NegateTemporalRoundingMode(roundingMode);
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit);

    const ns1 = GetSlot(this, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (largestUnit !== 'years' && largestUnit !== 'months' && largestUnit !== 'weeks' && largestUnit !== 'days') {
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
      const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
      if (!ES.TimeZoneEquals(timeZoneRecord, GetSlot(other, TIME_ZONE_RECORD))) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        );
      }
      const untilOptions = { ...options, largestUnit };
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.DifferenceZonedDateTime(ns1, ns2, timeZoneRecord, calendarRecord, largestUnit, untilOptions));
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.RoundDuration(
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
      ({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      } = ES.AdjustRoundedDurationDays(
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
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'nearest');
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
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const instantStart = ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, dtStart, 'compatible');
    const endNs = ES.AddZonedDateTime(instantStart, timeZoneRecord, calendarRecord, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    const dayLengthNs = endNs.subtract(GetSlot(instantStart, EPOCHNANOSECONDS));
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
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZoneRecord, GetSlot(this, INSTANT));
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
      timeZoneRecord,
      'compatible',
      'prefer'
    );

    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(epochNanoseconds, timeZoneRecord.object, calendarRecord.object);
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other, ZonedDateTime);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE_RECORD), GetSlot(other, TIME_ZONE_RECORD))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR_RECORD), GetSlot(other, CALENDAR_RECORD));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    options = ES.NormalizeOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const showCalendar = ES.ToShowCalendarOption(options);
    const showTimeZone = ES.ToShowTimeZoneNameOption(options);
    const showOffset = ES.ToShowOffsetOption(options);
    return zonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
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
    return zonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.ZonedDateTime');
  }
  startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dtStart = new DateTime(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), 0, 0, 0, 0, 0, 0);
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZoneRecord, dtStart, 'compatible');
    const Construct = ES.SpeciesConstructor(this, ZonedDateTime);
    const result = new Construct(
      GetSlot(instant, EPOCHNANOSECONDS),
      timeZoneRecord.object,
      GetSlot(this, CALENDAR_RECORD).object
    );
    if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
    return result;
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
    const YearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, ['monthCode', 'year']);
    const fields = ES.ToTemporalYearMonthFields(this, fieldNames);
    return ES.CalendarYearMonthFromFields(calendarRecord, fields, {}, YearMonth);
  }
  toPlainMonthDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const calendarRecord = GetSlot(this, CALENDAR_RECORD);
    const fieldNames = ES.CalendarFields(calendarRecord, ['day', 'monthCode']);
    const fields = ES.ToTemporalMonthDayFields(this, fieldNames);
    return ES.CalendarMonthDayFromFields(calendarRecord, fields, {}, MonthDay);
  }
  getISOFields() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeError('invalid receiver');
    const dt = dateTime(this);
    const timeZoneRecord = GetSlot(this, TIME_ZONE_RECORD);
    return {
      calendar: GetSlot(this, CALENDAR_RECORD).object,
      isoDay: GetSlot(dt, ISO_DAY),
      isoHour: GetSlot(dt, ISO_HOUR),
      isoMicrosecond: GetSlot(dt, ISO_MICROSECOND),
      isoMillisecond: GetSlot(dt, ISO_MILLISECOND),
      isoMinute: GetSlot(dt, ISO_MINUTE),
      isoMonth: GetSlot(dt, ISO_MONTH),
      isoNanosecond: GetSlot(dt, ISO_NANOSECOND),
      isoSecond: GetSlot(dt, ISO_SECOND),
      isoYear: GetSlot(dt, ISO_YEAR),
      offset: ES.BuiltinTimeZoneGetOffsetStringFor(timeZoneRecord, GetSlot(this, INSTANT)),
      timeZone: timeZoneRecord.object
    };
  }
  static from(item, options = undefined) {
    options = ES.NormalizeOptionsObject(options);
    if (ES.IsTemporalZonedDateTime(item)) {
      ES.ToTemporalOverflow(options); // validate and ignore
      ES.ToTemporalDisambiguation(options);
      ES.ToTemporalOffset(options, 'reject');
      const result = new this(
        GetSlot(item, EPOCHNANOSECONDS),
        GetSlot(item, TIME_ZONE_RECORD).object,
        GetSlot(item, CALENDAR_RECORD).object
      );
      if (!ES.IsTemporalZonedDateTime(result)) throw new TypeError('invalid result');
      return result;
    }
    return ES.ToTemporalZonedDateTime(item, this, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalZonedDateTime(one, ZonedDateTime);
    two = ES.ToTemporalZonedDateTime(two, ZonedDateTime);
    const ns1 = GetSlot(one, EPOCHNANOSECONDS);
    const ns2 = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(ns1).lesser(ns2)) return -1;
    if (bigInt(ns1).greater(ns2)) return 1;
    const calendarResult = ES.CalendarCompare(GetSlot(one, CALENDAR_RECORD), GetSlot(two, CALENDAR_RECORD));
    if (calendarResult) return calendarResult;
    return ES.TimeZoneCompare(GetSlot(one, TIME_ZONE_RECORD), GetSlot(two, TIME_ZONE_RECORD));
  }
}

MakeIntrinsicClass(ZonedDateTime, 'Temporal.ZonedDateTime');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}

function dateTime(zdt) {
  return ES.BuiltinTimeZoneGetPlainDateTimeFor(
    GetSlot(zdt, TIME_ZONE_RECORD),
    GetSlot(zdt, INSTANT),
    GetSlot(zdt, CALENDAR_RECORD)
  );
}

function zonedDateTimeToString(
  zdt,
  precision,
  showCalendar = 'auto',
  showTimeZone = 'auto',
  showOffset = 'auto',
  options = undefined
) {
  let instant = GetSlot(zdt, INSTANT);

  if (options) {
    const { unit, increment, roundingMode } = options;
    const ns = ES.RoundInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    instant = new TemporalInstant(ns);
  }

  const timeZoneRecord = GetSlot(zdt, TIME_ZONE_RECORD);
  const iso = ES.NewCalendarRecord(ES.GetISO8601Calendar());
  const dateTime = ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZoneRecord, instant, iso);

  const year = ES.ISOYearString(GetSlot(dateTime, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
  const hour = ES.ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
  const minute = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
  const seconds = ES.FormatSecondsStringPart(
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND),
    precision
  );
  let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`;
  if (showOffset !== 'never') result += ES.BuiltinTimeZoneGetOffsetStringFor(timeZoneRecord, instant);
  if (showTimeZone !== 'never') result += `[${ES.TimeZoneToString(timeZoneRecord)}]`;
  const calendarID = ES.CalendarToString(GetSlot(zdt, CALENDAR_RECORD));
  result += ES.FormatCalendarAnnotation(calendarID, showCalendar);
  return result;
}
