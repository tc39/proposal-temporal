/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import bigInt from 'big-integer';

export class Instant {
  constructor(epochNanoseconds) {
    const ns = ES.ToBigInt(epochNanoseconds);
    ES.RejectInstantRange(ns);
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
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  getEpochMilliseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return +value.divide(1e6);
  }
  getEpochMicroseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  getEpochNanoseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }

  add(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const {
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks', 'days']);
    ES.RejectDurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    let sum = bigInt(0);
    sum = sum.plus(bigInt(nanoseconds));
    sum = sum.plus(bigInt(microseconds).multiply(1e3));
    sum = sum.plus(bigInt(milliseconds).multiply(1e6));
    sum = sum.plus(bigInt(seconds).multiply(1e9));
    sum = sum.plus(bigInt(minutes).multiply(60 * 1e9));
    sum = sum.plus(bigInt(hours).multiply(60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).plus(sum);
    ES.RejectInstantRange(ns);

    const Construct = ES.SpeciesConstructor(this, Instant);
    const result = new Construct(bigIntIfAvailable(ns));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  subtract(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const {
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedTemporalDuration(temporalDurationLike, ['years', 'months', 'weeks', 'days']);
    ES.RejectDurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

    let sum = bigInt(0);
    sum = sum.plus(bigInt(nanoseconds));
    sum = sum.plus(bigInt(microseconds).multiply(1e3));
    sum = sum.plus(bigInt(milliseconds).multiply(1e6));
    sum = sum.plus(bigInt(seconds).multiply(1e9));
    sum = sum.plus(bigInt(minutes).multiply(60 * 1e9));
    sum = sum.plus(bigInt(hours).multiply(60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).minus(sum);
    ES.RejectInstantRange(ns);

    const Construct = ES.SpeciesConstructor(this, Instant);
    const result = new Construct(bigIntIfAvailable(ns));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalInstant(other)) throw new TypeError('invalid Instant object');
    const disallowedUnits = ['years', 'months', 'weeks', 'days'];
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalDurationUnit(options, 'nanoseconds', disallowedUnits);
    const defaultLargestUnit = ES.LargerOfTwoTemporalDurationUnits('seconds', smallestUnit);
    const largestUnit = ES.ToLargestTemporalUnit(options, defaultLargestUnit, disallowedUnits);
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit);
    const roundingMode = ES.ToTemporalRoundingMode(options);
    const maximumIncrements = {
      hours: 24,
      minutes: 60,
      seconds: 60,
      milliseconds: 1000,
      microseconds: 1000,
      nanoseconds: 1000
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false);

    const onens = GetSlot(other, EPOCHNANOSECONDS);
    const twons = GetSlot(this, EPOCHNANOSECONDS);
    const diff = twons.minus(onens);

    let incrementNs = roundingIncrement;
    switch (smallestUnit) {
      case 'hours':
        incrementNs *= 60;
      // fall through
      case 'minutes':
        incrementNs *= 60;
      // fall through
      case 'seconds':
        incrementNs *= 1000;
      // fall through
      case 'milliseconds':
        incrementNs *= 1000;
      // fall through
      case 'microseconds':
        incrementNs *= 1000;
    }
    const remainder = diff.mod(86400e9);
    const wholeDays = diff.minus(remainder);
    const roundedRemainder = ES.RoundNumberToIncrement(remainder.toJSNumber(), incrementNs, roundingMode);
    const roundedDiff = wholeDays.plus(roundedRemainder);

    const ns = +roundedDiff.mod(1e3);
    const us = +roundedDiff.divide(1e3).mod(1e3);
    const ms = +roundedDiff.divide(1e6).mod(1e3);
    const ss = +roundedDiff.divide(1e9);

    const Duration = GetIntrinsic('%Temporal.Duration%');
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      0,
      0,
      ss,
      ms,
      us,
      ns,
      largestUnit
    );
    return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  round(options) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (options === undefined) throw new TypeError('options parameter is required');
    options = ES.NormalizeOptionsObject(options);
    const smallestUnit = ES.ToSmallestTemporalUnit(options, ['day']);
    const roundingMode = ES.ToTemporalRoundingMode(options);
    const maximumIncrements = {
      hour: 24,
      minute: 1440,
      second: 86400,
      millisecond: 86400e3,
      microsecond: 86400e6,
      nanosecond: 86400e9
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], true);

    let incrementNs = roundingIncrement;
    switch (smallestUnit) {
      case 'hour':
        incrementNs *= 60;
      // fall through
      case 'minute':
        incrementNs *= 60;
      // fall through
      case 'second':
        incrementNs *= 1000;
      // fall through
      case 'millisecond':
        incrementNs *= 1000;
      // fall through
      case 'microsecond':
        incrementNs *= 1000;
    }
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    // Note: NonNegativeModulo, but with BigInt
    let remainder = ns.mod(86400e9);
    if (remainder.lesser(0)) remainder = remainder.plus(86400e9);
    const wholeDays = ns.minus(remainder);
    const roundedRemainder = ES.RoundNumberToIncrement(remainder.toJSNumber(), incrementNs, roundingMode);
    const roundedNs = wholeDays.plus(roundedRemainder);

    const Construct = ES.SpeciesConstructor(this, Instant);
    const result = new Construct(bigIntIfAvailable(roundedNs));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  equals(other) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalInstant(other)) throw new TypeError('invalid Instant object');
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    return bigInt(one).equals(two);
  }
  toString(temporalTimeZoneLike = 'UTC') {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    return ES.TemporalInstantToString(this, timeZone);
  }
  toJSON() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    const timeZone = new TemporalTimeZone('UTC');
    return ES.TemporalInstantToString(this, timeZone);
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Instant');
  }
  toDateTime(temporalTimeZoneLike, calendarLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    const calendar = ES.ToTemporalCalendar(calendarLike);
    return ES.GetTemporalDateTimeFor(timeZone, this, calendar);
  }

  static fromEpochSeconds(epochSeconds) {
    epochSeconds = ES.ToNumber(epochSeconds);
    const epochNanoseconds = bigInt(epochSeconds).multiply(1e9);
    ES.RejectInstantRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMilliseconds(epochMilliseconds) {
    epochMilliseconds = ES.ToNumber(epochMilliseconds);
    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
    ES.RejectInstantRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    epochMicroseconds = ES.ToBigInt(epochMicroseconds);
    const epochNanoseconds = epochMicroseconds.multiply(1e3);
    ES.RejectInstantRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    ES.RejectInstantRange(epochNanoseconds);
    const result = new this(bigIntIfAvailable(epochNanoseconds));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  static from(item) {
    let ns;
    if (ES.IsTemporalInstant(item)) {
      ns = GetSlot(item, EPOCHNANOSECONDS);
    } else {
      ns = ES.ParseTemporalInstant(ES.ToString(item));
    }
    const result = new this(bigIntIfAvailable(ns));
    if (!ES.IsTemporalInstant(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalInstant(one) || !ES.IsTemporalInstant(two)) throw new TypeError('invalid Instant object');
    one = GetSlot(one, EPOCHNANOSECONDS);
    two = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(one).lesser(two)) return -1;
    if (bigInt(one).greater(two)) return 1;
    return 0;
  }
}

MakeIntrinsicClass(Instant, 'Temporal.Instant');

function bigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
}
