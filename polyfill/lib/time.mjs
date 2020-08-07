/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CALENDAR,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

export class Time {
  constructor(hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    hour = ES.ToInteger(hour);
    minute = ES.ToInteger(minute);
    second = ES.ToInteger(second);
    millisecond = ES.ToInteger(millisecond);
    microsecond = ES.ToInteger(microsecond);
    nanosecond = ES.ToInteger(nanosecond);
    ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);

    CreateSlots(this);
    SetSlot(this, HOUR, hour);
    SetSlot(this, MINUTE, minute);
    SetSlot(this, SECOND, second);
    SetSlot(this, MILLISECOND, millisecond);
    SetSlot(this, MICROSECOND, microsecond);
    SetSlot(this, NANOSECOND, nanosecond);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get hour() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, HOUR);
  }
  get minute() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MINUTE);
  }
  get second() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, NANOSECOND);
  }

  with(temporalTimeLike = {}, options) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const props = ES.ToPartialRecord(temporalTimeLike, [
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'nanosecond',
      'second'
    ]);
    if (!props) {
      throw new RangeError('invalid time-like');
    }
    let {
      hour = GetSlot(this, HOUR),
      minute = GetSlot(this, MINUTE),
      second = GetSlot(this, SECOND),
      millisecond = GetSlot(this, MILLISECOND),
      microsecond = GetSlot(this, MICROSECOND),
      nanosecond = GetSlot(this, NANOSECOND)
    } = props;
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, Time);
    const result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    const sign = ES.DurationSign(
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
    );
    if (sign < 0) {
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
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
    } else {
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
    }
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, Time);
    const result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    const sign = ES.DurationSign(
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
    );
    if (sign < 0) {
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
    } else {
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
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
    }
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, Time);
    const result = new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalTime(other)) throw new TypeError('invalid Time object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'hours');
    const comparison = Time.compare(this, other);
    if (comparison < 0) throw new RangeError('other instance cannot be larger than `this`');
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(other, this);
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
  equals(other) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalTime(other)) throw new TypeError('invalid Time object');
    for (const slot of [HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return true;
  }

  toString() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
    let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
    let seconds = ES.FormatSecondsStringPart(
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND)
    );
    let resultString = `${hour}:${minute}${seconds}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Time');
  }

  toDateTime(temporalDate) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(temporalDate)) throw new TypeError('invalid Temporal.Date object');
    const year = GetSlot(temporalDate, ISO_YEAR);
    const month = GetSlot(temporalDate, ISO_MONTH);
    const day = GetSlot(temporalDate, ISO_DAY);
    const hour = GetSlot(this, HOUR);
    const minute = GetSlot(this, MINUTE);
    const second = GetSlot(this, SECOND);
    const millisecond = GetSlot(this, MILLISECOND);
    const microsecond = GetSlot(this, MICROSECOND);
    const nanosecond = GetSlot(this, NANOSECOND);
    const calendar = GetSlot(temporalDate, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  getFields() {
    const fields = ES.ToTemporalTimeRecord(this);
    if (!fields) throw new TypeError('invalid receiver');
    return fields;
  }

  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let hour, minute, second, millisecond, microsecond, nanosecond;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalTime(item)) {
        hour = GetSlot(item, HOUR);
        minute = GetSlot(item, MINUTE);
        second = GetSlot(item, SECOND);
        millisecond = GetSlot(item, MILLISECOND);
        microsecond = GetSlot(item, MICROSECOND);
        nanosecond = GetSlot(item, NANOSECOND);
      } else {
        // Intentionally largest to smallest units
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ToTemporalTimeRecord(item));
      }
    } else {
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ParseTemporalTimeString(ES.ToString(item)));
    }
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const result = new this(hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsTemporalTime(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalTime(one) || !ES.IsTemporalTime(two)) throw new TypeError('invalid Time object');
    for (const slot of [HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    return ES.ComparisonResult(0);
  }
}
Time.prototype.toJSON = Time.prototype.toString;

MakeIntrinsicClass(Time, 'Temporal.Time');
