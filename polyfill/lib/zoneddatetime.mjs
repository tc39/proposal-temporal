import {
  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ObjectCreate
} from './primordials.mjs';
import { assert } from './assert.mjs';
import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { CALENDAR, EPOCHNANOSECONDS, GetSlot, TIME, TIME_ZONE } from './slots.mjs';
import { TimeDuration } from './timeduration.mjs';

import bigInt from 'big-integer';

const customResolvedOptions = DateTimeFormat.prototype.resolvedOptions;

export class ZonedDateTime {
  constructor(epochNanoseconds, timeZone, calendar = 'iso8601') {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    if (arguments.length < 1) {
      throw new TypeErrorCtor('missing argument: epochNanoseconds is required');
    }
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    timeZone = ES.RequireString(timeZone);
    const { tzName, offsetMinutes } = ES.ParseTimeZoneIdentifier(timeZone);
    if (offsetMinutes === undefined) {
      // if offsetMinutes is undefined, then tzName must be present
      const record = ES.GetAvailableNamedTimeZoneIdentifier(tzName);
      if (!record) throw new RangeErrorCtor(`unknown time zone ${tzName}`);
      timeZone = record.identifier;
    } else {
      timeZone = ES.FormatOffsetTimeZoneIdentifier(offsetMinutes);
    }
    calendar = calendar === undefined ? 'iso8601' : ES.RequireString(calendar);
    calendar = ES.CanonicalizeCalendar(calendar);

    ES.CreateTemporalZonedDateTimeSlots(this, epochNanoseconds, timeZone, calendar);
  }
  get calendarId() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get timeZoneId() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME_ZONE);
  }
  get year() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { year: true }).year;
  }
  get month() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { month: true }).month;
  }
  get monthCode() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { monthCode: true }).monthCode;
  }
  get day() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { day: true }).day;
  }
  get hour() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.hour;
  }
  get minute() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.minute;
  }
  get second() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.second;
  }
  get millisecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.millisecond;
  }
  get microsecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.microsecond;
  }
  get nanosecond() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return dateTime(this).time.nanosecond;
  }
  get era() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { era: true }).era;
  }
  get eraYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { eraYear: true }).eraYear;
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return ES.epochNsToMs(value, 'floor');
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.BigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }
  get dayOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { dayOfWeek: true }).dayOfWeek;
  }
  get dayOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { dayOfYear: true }).dayOfYear;
  }
  get weekOfYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { weekOfYear: true }).weekOfYear.week;
  }
  get yearOfWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { weekOfYear: true }).weekOfYear.year;
  }
  get hoursInDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const timeZone = GetSlot(this, TIME_ZONE);
    const today = dateTime(this).isoDate;
    const tomorrow = ES.BalanceISODate(today.year, today.month, today.day + 1);
    const todayNs = ES.GetStartOfDay(timeZone, today);
    const tomorrowNs = ES.GetStartOfDay(timeZone, tomorrow);
    const diff = TimeDuration.fromEpochNsDiff(tomorrowNs, todayNs);
    return ES.TotalTimeDuration(diff, 'hour');
  }
  get daysInWeek() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { daysInWeek: true }).daysInWeek;
  }
  get daysInMonth() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { daysInMonth: true }).daysInMonth;
  }
  get daysInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { daysInYear: true }).daysInYear;
  }
  get monthsInYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { monthsInYear: true }).monthsInYear;
  }
  get inLeapYear() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.calendarImplForObj(this).isoToDate(dateTime(this).isoDate, { inLeapYear: true }).inLeapYear;
  }
  get offset() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const offsetNs = ES.GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, EPOCHNANOSECONDS));
    return ES.FormatUTCOffsetNanoseconds(offsetNs);
  }
  get offsetNanoseconds() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.GetOffsetNanosecondsFor(GetSlot(this, TIME_ZONE), GetSlot(this, EPOCHNANOSECONDS));
  }
  with(temporalZonedDateTimeLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalZonedDateTimeLike) !== 'Object') {
      throw new TypeErrorCtor('invalid zoned-date-time-like');
    }
    ES.RejectTemporalLikeObject(temporalZonedDateTimeLike);

    const calendar = GetSlot(this, CALENDAR);
    const timeZone = GetSlot(this, TIME_ZONE);
    const epochNs = GetSlot(this, EPOCHNANOSECONDS);
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, epochNs);
    const isoDateTime = dateTime(this);
    let fields = ES.ISODateToFields(calendar, isoDateTime.isoDate);
    fields = {
      ...fields,
      ...isoDateTime.time,
      offset: ES.FormatUTCOffsetNanoseconds(offsetNs)
    };
    const partialZonedDateTime = ES.PrepareCalendarFields(
      calendar,
      temporalZonedDateTimeLike,
      ['year', 'month', 'monthCode', 'day'],
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond', 'offset'],
      'partial'
    );
    fields = ES.CalendarMergeFields(calendar, fields, partialZonedDateTime);

    const resolvedOptions = ES.GetOptionsObject(options);
    const disambiguation = ES.GetTemporalDisambiguationOption(resolvedOptions);
    const offset = ES.GetTemporalOffsetOption(resolvedOptions, 'prefer');
    const overflow = ES.GetTemporalOverflowOption(resolvedOptions);

    const newDateTime = ES.InterpretTemporalDateTimeFields(calendar, fields, overflow);
    const newOffsetNs = ES.ParseDateTimeUTCOffset(fields.offset);
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      newDateTime.isoDate,
      newDateTime.time,
      'option',
      newOffsetNs,
      timeZone,
      disambiguation,
      offset,
      /* matchMinute = */ false
    );

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  }
  withPlainTime(temporalTime = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');

    const timeZone = GetSlot(this, TIME_ZONE);
    const calendar = GetSlot(this, CALENDAR);
    const iso = dateTime(this).isoDate;

    let epochNs;
    if (temporalTime === undefined) {
      epochNs = ES.GetStartOfDay(timeZone, iso);
    } else {
      temporalTime = ES.ToTemporalTime(temporalTime);
      const dt = ES.CombineISODateAndTimeRecord(iso, GetSlot(temporalTime, TIME));
      epochNs = ES.GetEpochNanosecondsFor(timeZone, dt, 'compatible');
    }
    return ES.CreateTemporalZonedDateTime(epochNs, timeZone, calendar);
  }
  withTimeZone(timeZone) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    timeZone = ES.ToTemporalTimeZoneIdentifier(timeZone);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, GetSlot(this, CALENDAR));
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    calendar = ES.ToTemporalCalendarIdentifier(calendar);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), GetSlot(this, TIME_ZONE), calendar);
  }
  add(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToZonedDateTime('add', this, temporalDurationLike, options);
  }
  subtract(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToZonedDateTime('subtract', this, temporalDurationLike, options);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalZonedDateTime('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalZonedDateTime('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
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

    if (smallestUnit === 'nanosecond' && roundingIncrement === 1) {
      return ES.CreateTemporalZonedDateTime(
        GetSlot(this, EPOCHNANOSECONDS),
        GetSlot(this, TIME_ZONE),
        GetSlot(this, CALENDAR)
      );
    }

    // first, round the underlying DateTime fields
    const timeZone = GetSlot(this, TIME_ZONE);
    const thisNs = GetSlot(this, EPOCHNANOSECONDS);
    const iso = dateTime(this);
    let epochNanoseconds;

    if (smallestUnit === 'day') {
      // Compute Instants for start-of-day and end-of-day
      // Determine how far the current instant has progressed through this span.
      const dateStart = iso.isoDate;
      const dateEnd = ES.BalanceISODate(dateStart.year, dateStart.month, dateStart.day + 1);

      const startNs = ES.GetStartOfDay(timeZone, dateStart);
      assert(thisNs.geq(startNs), 'cannot produce an instant during a day that occurs before start-of-day instant');

      const endNs = ES.GetStartOfDay(timeZone, dateEnd);
      assert(thisNs.lt(endNs), 'cannot produce an instant during a day that occurs on or after end-of-day instant');

      const dayLengthNs = endNs.subtract(startNs);
      const dayProgressNs = TimeDuration.fromEpochNsDiff(thisNs, startNs);
      const roundedDayNs = dayProgressNs.round(dayLengthNs, roundingMode);
      epochNanoseconds = roundedDayNs.addToEpochNs(startNs);
    } else {
      // smallestUnit < day
      // Round based on ISO-calendar time units
      const roundedDateTime = ES.RoundISODateTime(iso, roundingIncrement, smallestUnit, roundingMode);

      // Now reset all DateTime fields but leave the TimeZone. The offset will
      // also be retained if the new date/time values are still OK with the old
      // offset. Otherwise the offset will be changed to be compatible with the
      // new date/time values. If DST disambiguation is required, the `compatible`
      // disambiguation algorithm will be used.
      const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, thisNs);
      epochNanoseconds = ES.InterpretISODateTimeOffset(
        roundedDateTime.isoDate,
        roundedDateTime.time,
        'option',
        offsetNs,
        timeZone,
        'compatible',
        'prefer',
        /* matchMinute = */ false
      );
    }

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
  }
  equals(other) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalZonedDateTime(other);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    if (!bigInt(one).equals(two)) return false;
    if (!ES.TimeZoneEquals(GetSlot(this, TIME_ZONE), GetSlot(other, TIME_ZONE))) return false;
    return ES.CalendarEquals(GetSlot(this, CALENDAR), GetSlot(other, CALENDAR));
  }
  toString(options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const showCalendar = ES.GetTemporalShowCalendarNameOption(resolvedOptions);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const showOffset = ES.GetTemporalShowOffsetOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const showTimeZone = ES.GetTemporalShowTimeZoneNameOption(resolvedOptions);
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    return ES.TemporalZonedDateTimeToString(this, precision, showCalendar, showTimeZone, showOffset, {
      unit,
      increment,
      roundingMode
    });
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);

    // This is not quite per specification, but this polyfill's DateTimeFormat
    // already doesn't match the InitializeDateTimeFormat operation, and the
    // access order might change anyway;
    // see https://github.com/tc39/ecma402/issues/747
    const optionsCopy = ObjectCreate(null);
    ES.CopyDataProperties(optionsCopy, resolvedOptions, ['timeZone']);

    if (resolvedOptions.timeZone !== undefined) {
      throw new TypeErrorCtor('ZonedDateTime toLocaleString does not accept a timeZone option');
    }

    if (
      optionsCopy.year === undefined &&
      optionsCopy.month === undefined &&
      optionsCopy.day === undefined &&
      optionsCopy.era === undefined &&
      optionsCopy.weekday === undefined &&
      optionsCopy.dateStyle === undefined &&
      optionsCopy.hour === undefined &&
      optionsCopy.minute === undefined &&
      optionsCopy.second === undefined &&
      optionsCopy.fractionalSecondDigits === undefined &&
      optionsCopy.timeStyle === undefined &&
      optionsCopy.dayPeriod === undefined &&
      optionsCopy.timeZoneName === undefined
    ) {
      optionsCopy.timeZoneName = 'short';
      // The rest of the defaults will be filled in by formatting the Instant
    }

    const timeZoneIdentifier = GetSlot(this, TIME_ZONE);
    if (ES.IsOffsetTimeZoneIdentifier(timeZoneIdentifier)) {
      // Note: https://github.com/tc39/ecma402/issues/683 will remove this
      throw new RangeErrorCtor('toLocaleString does not currently support offset time zones');
    } else {
      const record = ES.GetAvailableNamedTimeZoneIdentifier(timeZoneIdentifier);
      if (!record) throw new RangeErrorCtor(`toLocaleString formats built-in time zones, not ${timeZoneIdentifier}`);
      optionsCopy.timeZone = record.identifier;
    }

    const formatter = new DateTimeFormat(locales, optionsCopy);

    const localeCalendarIdentifier = ES.Call(customResolvedOptions, formatter, []).calendar;
    const calendarIdentifier = GetSlot(this, CALENDAR);
    if (
      calendarIdentifier !== 'iso8601' &&
      localeCalendarIdentifier !== 'iso8601' &&
      !ES.CalendarEquals(localeCalendarIdentifier, calendarIdentifier)
    ) {
      throw new RangeErrorCtor(
        `cannot format ZonedDateTime with calendar ${calendarIdentifier}` +
          ` in locale with calendar ${localeCalendarIdentifier}`
      );
    }

    const Instant = GetIntrinsic('%Temporal.Instant%');
    return formatter.format(new Instant(GetSlot(this, EPOCHNANOSECONDS)));
  }
  toJSON() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalZonedDateTimeToString(this, 'auto');
  }
  valueOf() {
    ES.ValueOfThrows('ZonedDateTime');
  }
  startOfDay() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const timeZone = GetSlot(this, TIME_ZONE);
    const isoDate = dateTime(this).isoDate;
    const epochNanoseconds = ES.GetStartOfDay(timeZone, isoDate);
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
  }
  getTimeZoneTransition(directionParam) {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const timeZone = GetSlot(this, TIME_ZONE);

    if (directionParam === undefined) throw new TypeErrorCtor('options parameter is required');
    if (ES.Type(directionParam) === 'String') {
      const stringParam = directionParam;
      directionParam = ObjectCreate(null);
      directionParam.direction = stringParam;
    } else {
      directionParam = ES.GetOptionsObject(directionParam);
    }
    const direction = ES.GetDirectionOption(directionParam);
    if (direction === undefined) throw new TypeErrorCtor('direction option is required');

    // Offset time zones or UTC have no transitions
    if (ES.IsOffsetTimeZoneIdentifier(timeZone) || timeZone === 'UTC') {
      return null;
    }

    const thisEpochNanoseconds = GetSlot(this, EPOCHNANOSECONDS);
    const epochNanoseconds =
      direction === 'next'
        ? ES.GetNamedTimeZoneNextTransition(timeZone, thisEpochNanoseconds)
        : ES.GetNamedTimeZonePreviousTransition(timeZone, thisEpochNanoseconds);
    return epochNanoseconds === null ? null : new ZonedDateTime(epochNanoseconds, timeZone, GetSlot(this, CALENDAR));
  }
  toInstant() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(this, EPOCHNANOSECONDS));
  }
  toPlainDate() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateTemporalDate(dateTime(this).isoDate, GetSlot(this, CALENDAR));
  }
  toPlainTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateTemporalTime(dateTime(this).time);
  }
  toPlainDateTime() {
    if (!ES.IsTemporalZonedDateTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.CreateTemporalDateTime(dateTime(this), GetSlot(this, CALENDAR));
  }

  static from(item, options = undefined) {
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

function dateTime(zdt) {
  return ES.GetISODateTimeFor(GetSlot(zdt, TIME_ZONE), GetSlot(zdt, EPOCHNANOSECONDS));
}
