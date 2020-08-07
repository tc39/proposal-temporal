/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import bigInt from 'big-integer';

export class Absolute {
  constructor(epochNanoseconds) {
    const ns = ES.ToBigInt(epochNanoseconds);
    ES.RejectAbsoluteRange(ns);
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, ns);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  getEpochSeconds() {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  getEpochMilliseconds() {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return +value.divide(1e6);
  }
  getEpochMicroseconds() {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  getEpochNanoseconds() {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }

  plus(temporalDurationLike) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks']);
    ES.RejectDurationSign(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    let add = bigInt(0);
    add = add.plus(bigInt(nanoseconds));
    add = add.plus(bigInt(microseconds).multiply(1e3));
    add = add.plus(bigInt(milliseconds).multiply(1e6));
    add = add.plus(bigInt(seconds).multiply(1e9));
    add = add.plus(bigInt(minutes).multiply(60 * 1e9));
    add = add.plus(bigInt(hours).multiply(60 * 60 * 1e9));
    add = add.plus(bigInt(days).multiply(24 * 60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).plus(add);
    ES.RejectAbsoluteRange(ns);

    const Construct = ES.SpeciesConstructor(this, Absolute);
    const result = new Construct(bigIntIfAvailable(ns));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks']);
    ES.RejectDurationSign(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    let add = bigInt(0);
    add = add.plus(bigInt(nanoseconds));
    add = add.plus(bigInt(microseconds).multiply(1e3));
    add = add.plus(bigInt(milliseconds).multiply(1e6));
    add = add.plus(bigInt(seconds).multiply(1e9));
    add = add.plus(bigInt(minutes).multiply(60 * 1e9));
    add = add.plus(bigInt(hours).multiply(60 * 60 * 1e9));
    add = add.plus(bigInt(days).multiply(24 * 60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).minus(add);
    ES.RejectAbsoluteRange(ns);

    const Construct = ES.SpeciesConstructor(this, Absolute);
    const result = new Construct(bigIntIfAvailable(ns));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalAbsolute(other)) throw new TypeError('invalid Absolute object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'seconds', ['years', 'months', 'weeks']);

    const comparison = Absolute.compare(this, other);
    if (comparison < 0) throw new RangeError('other instance cannot be larger than `this`');
    const onens = GetSlot(other, EPOCHNANOSECONDS);
    const twons = GetSlot(this, EPOCHNANOSECONDS);
    const diff = twons.minus(onens);

    const ns = +diff.mod(1e3);
    const us = +diff.divide(1e3).mod(1e3);
    const ms = +diff.divide(1e6).mod(1e3);
    const ss = +diff.divide(1e9);

    const Duration = GetIntrinsic('%Temporal.Duration%');
    const { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      0,
      0,
      ss,
      ms,
      us,
      ns,
      largestUnit
    );
    return new Duration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  equals(other) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalAbsolute(other)) throw new TypeError('invalid Absolute object');
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    return bigInt(one).equals(two);
  }
  toString(temporalTimeZoneLike = 'UTC') {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    return ES.TemporalAbsoluteToString(this, timeZone);
  }
  toJSON() {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    const timeZone = new TemporalTimeZone('UTC');
    return ES.TemporalAbsoluteToString(this, timeZone);
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Absolute');
  }
  toDateTime(temporalTimeZoneLike, calendarLike = GetDefaultCalendar()) {
    if (!ES.IsTemporalAbsolute(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    const calendar = ES.ToTemporalCalendar(calendarLike);
    return ES.GetTemporalDateTimeFor(timeZone, this, calendar);
  }

  static fromEpochSeconds(epochSeconds) {
    epochSeconds = ES.ToNumber(epochSeconds);
    const epochNanoseconds = bigInt(epochSeconds).multiply(1e9);
    ES.RejectAbsoluteRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMilliseconds(epochMilliseconds) {
    epochMilliseconds = ES.ToNumber(epochMilliseconds);
    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
    ES.RejectAbsoluteRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    epochMicroseconds = ES.ToBigInt(epochMicroseconds);
    const epochNanoseconds = epochMicroseconds.multiply(1e3);
    ES.RejectAbsoluteRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    ES.RejectAbsoluteRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static from(item) {
    let ns;
    if (ES.IsTemporalAbsolute(item)) {
      ns = GetSlot(item, EPOCHNANOSECONDS);
    } else {
      ns = ES.ParseTemporalAbsolute(ES.ToString(item));
    }
    const result = new this(bigIntIfAvailable(ns));
    if (!ES.IsTemporalAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalAbsolute(one) || !ES.IsTemporalAbsolute(two)) throw new TypeError('invalid Absolute object');
    one = GetSlot(one, EPOCHNANOSECONDS);
    two = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(one).lesser(two)) return -1;
    if (bigInt(one).greater(two)) return 1;
    return 0;
  }
}

MakeIntrinsicClass(Absolute, 'Temporal.Absolute');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}
