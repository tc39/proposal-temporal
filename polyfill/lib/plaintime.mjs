/* global __debug__ */

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
  CreateSlots,
  GetSlot,
  HasSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

const DISALLOWED_UNITS = ['year', 'month', 'week', 'day'];
const MAX_INCREMENTS = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1000,
  microsecond: 1000,
  nanosecond: 1000
};

function TemporalTimeToString(time, precision, options = undefined) {
  let hour = GetSlot(time, ISO_HOUR);
  let minute = GetSlot(time, ISO_MINUTE);
  let second = GetSlot(time, ISO_SECOND);
  let millisecond = GetSlot(time, ISO_MILLISECOND);
  let microsecond = GetSlot(time, ISO_MICROSECOND);
  let nanosecond = GetSlot(time, ISO_NANOSECOND);

  if (options) {
    const { unit, increment, roundingMode } = options;
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      increment,
      unit,
      roundingMode
    ));
  }

  hour = ES.ISODateTimePartString(hour);
  minute = ES.ISODateTimePartString(minute);
  const seconds = ES.FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  return `${hour}:${minute}${seconds}`;
}

export class PlainTime {
  constructor(isoHour = 0, isoMinute = 0, isoSecond = 0, isoMillisecond = 0, isoMicrosecond = 0, isoNanosecond = 0) {
    isoHour = ES.ToFiniteInteger(isoHour);
    isoMinute = ES.ToFiniteInteger(isoMinute);
    isoSecond = ES.ToFiniteInteger(isoSecond);
    isoMillisecond = ES.ToFiniteInteger(isoMillisecond);
    isoMicrosecond = ES.ToFiniteInteger(isoMicrosecond);
    isoNanosecond = ES.ToFiniteInteger(isoNanosecond);

    ES.RejectTime(isoHour, isoMinute, isoSecond, isoMillisecond, isoMicrosecond, isoNanosecond);
    CreateSlots(this);
    SetSlot(this, ISO_HOUR, isoHour);
    SetSlot(this, ISO_MINUTE, isoMinute);
    SetSlot(this, ISO_SECOND, isoSecond);
    SetSlot(this, ISO_MILLISECOND, isoMillisecond);
    SetSlot(this, ISO_MICROSECOND, isoMicrosecond);
    SetSlot(this, ISO_NANOSECOND, isoNanosecond);
    SetSlot(this, CALENDAR, ES.GetISO8601Calendar());

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${TemporalTimeToString(this, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get calendar() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get hour() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_NANOSECOND);
  }

  with(temporalTimeLike, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (ES.Type(temporalTimeLike) !== 'Object') {
      throw new TypeError('invalid argument');
    }
    if (HasSlot(temporalTimeLike, CALENDAR) || HasSlot(temporalTimeLike, TIME_ZONE)) {
      throw new TypeError('with() does not support a calendar or timeZone property');
    }
    if (temporalTimeLike.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (temporalTimeLike.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }

    options = ES.GetOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);

    const props = ES.ToPartialRecord(temporalTimeLike, [
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'nanosecond',
      'second'
    ]);
    if (!props) {
      throw new TypeError('invalid time-like');
    }
    const fields = ES.ToTemporalTimeRecord(this);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ObjectAssign(fields, props);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  add(temporalDurationLike) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'reject'
    ));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  subtract(temporalDurationLike) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds
    ));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'reject'
    ));
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalTime(other);
    options = ES.GetOptionsObject(options);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'hour');
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond', DISALLOWED_UNITS);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND),
      GetSlot(other, ISO_HOUR),
      GetSlot(other, ISO_MINUTE),
      GetSlot(other, ISO_SECOND),
      GetSlot(other, ISO_MILLISECOND),
      GetSlot(other, ISO_MICROSECOND),
      GetSlot(other, ISO_NANOSECOND)
    );
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalTime(other);
    options = ES.GetOptionsObject(options);
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'hour');
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'nanosecond', DISALLOWED_UNITS);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(other, ISO_HOUR),
      GetSlot(other, ISO_MINUTE),
      GetSlot(other, ISO_SECOND),
      GetSlot(other, ISO_MILLISECOND),
      GetSlot(other, ISO_MICROSECOND),
      GetSlot(other, ISO_NANOSECOND),
      GetSlot(this, ISO_HOUR),
      GetSlot(this, ISO_MINUTE),
      GetSlot(this, ISO_SECOND),
      GetSlot(this, ISO_MILLISECOND),
      GetSlot(this, ISO_MICROSECOND),
      GetSlot(this, ISO_NANOSECOND)
    );
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode)
    ));
    hours = -hours;
    minutes = -minutes;
    seconds = -seconds;
    milliseconds = -milliseconds;
    microseconds = -microseconds;
    nanoseconds = -nanoseconds;
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(options) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.GetOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, undefined, DISALLOWED_UNITS);
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required');
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand');
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false);

    let hour = GetSlot(this, ISO_HOUR);
    let minute = GetSlot(this, ISO_MINUTE);
    let second = GetSlot(this, ISO_SECOND);
    let millisecond = GetSlot(this, ISO_MILLISECOND);
    let microsecond = GetSlot(this, ISO_MICROSECOND);
    let nanosecond = GetSlot(this, ISO_NANOSECOND);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundTime(
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

    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  equals(other) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalTime(other);
    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return true;
  }

  toString(options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    return TemporalTimeToString(this, precision, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return TemporalTimeToString(this, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.PlainTime');
  }

  toPlainDateTime(temporalDate) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');

    temporalDate = ES.ToTemporalDate(temporalDate);
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    const calendar = GetSlot(temporalDate, CALENDAR);

    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);

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
  toZonedDateTime(item) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');

    if (ES.Type(item) !== 'Object') {
      throw new TypeError('invalid argument');
    }

    const dateLike = item.plainDate;
    if (dateLike === undefined) {
      throw new TypeError('missing date property');
    }
    const temporalDate = ES.ToTemporalDate(dateLike);

    const timeZoneLike = item.timeZone;
    if (timeZoneLike === undefined) {
      throw new TypeError('missing timeZone property');
    }
    const timeZone = ES.ToTemporalTimeZone(timeZoneLike);

    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    const calendar = GetSlot(temporalDate, CALENDAR);
    const hour = GetSlot(this, ISO_HOUR);
    const minute = GetSlot(this, ISO_MINUTE);
    const second = GetSlot(this, ISO_SECOND);
    const millisecond = GetSlot(this, ISO_MILLISECOND);
    const microsecond = GetSlot(this, ISO_MICROSECOND);
    const nanosecond = GetSlot(this, ISO_NANOSECOND);

    const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new PlainDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible');
    return ES.CreateTemporalZonedDateTime(GetSlot(instant, EPOCHNANOSECONDS), timeZone, calendar);
  }
  getISOFields() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoHour: GetSlot(this, ISO_HOUR),
      isoMicrosecond: GetSlot(this, ISO_MICROSECOND),
      isoMillisecond: GetSlot(this, ISO_MILLISECOND),
      isoMinute: GetSlot(this, ISO_MINUTE),
      isoNanosecond: GetSlot(this, ISO_NANOSECOND),
      isoSecond: GetSlot(this, ISO_SECOND)
    };
  }

  static from(item, options = undefined) {
    options = ES.GetOptionsObject(options);
    const overflow = ES.ToTemporalOverflow(options);
    if (ES.IsTemporalTime(item)) {
      return new PlainTime(
        GetSlot(item, ISO_HOUR),
        GetSlot(item, ISO_MINUTE),
        GetSlot(item, ISO_SECOND),
        GetSlot(item, ISO_MILLISECOND),
        GetSlot(item, ISO_MICROSECOND),
        GetSlot(item, ISO_NANOSECOND)
      );
    }
    return ES.ToTemporalTime(item, overflow);
  }
  static compare(one, two) {
    one = ES.ToTemporalTime(one);
    two = ES.ToTemporalTime(two);
    for (const slot of [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return 0;
  }
}

MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');
