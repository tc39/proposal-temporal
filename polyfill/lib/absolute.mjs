import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  EPOCHNANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot,
  YEARS,
  MONTHS,
} from './slots.mjs';

import bigInt from 'big-integer';

export class Absolute {
  constructor(epochNanoseconds) {
    if (('bigint' !== typeof epochNanoseconds) && !bigInt.isInstance(epochNanoseconds)) throw RangeError('bigint required');
    const ns = bigInt(epochNanoseconds);
    ES.RejectAbsolute(ns);
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, ns);
  }

  getEpochSeconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  getEpochMilliseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return +value.divide(1e6);
  }
  getEpochMicroseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return value.divide(1e3).value;
  }
  getEpochNanoseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    return bigInt(GetSlot(this, EPOCHNANOSECONDS)).value;
  }

  plus(durationLike) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedDuration(durationLike, [YEARS, MONTHS]);

    let add = bigInt(0);
    add = add.plus(bigInt(nanoseconds));
    add = add.plus(bigInt(microseconds).multiply(1e3));
    add = add.plus(bigInt(milliseconds).multiply(1e6));
    add = add.plus(bigInt(seconds).multiply(1e9));
    add = add.plus(bigInt(minutes).multiply(60 * 1e9));
    add = add.plus(bigInt(hours).multiply(60 * 60 * 1e9));
    add = add.plus(bigInt(days).multiply(24 * 60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).plus(add);
    ES.RejectAbsolute(ns);

    const Construct = ES.SpeciesConstructor(this, Absolute);
    const result = new Construct(ns.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(durationLike) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    } = ES.ToLimitedDuration(durationLike, [YEARS, MONTHS]);

    let add = bigInt(0);
    add = add.plus(bigInt(nanoseconds));
    add = add.plus(bigInt(microseconds).multiply(1e3));
    add = add.plus(bigInt(milliseconds).multiply(1e6));
    add = add.plus(bigInt(seconds).multiply(1e9));
    add = add.plus(bigInt(minutes).multiply(60 * 1e9));
    add = add.plus(bigInt(hours).multiply(60 * 60 * 1e9));
    add = add.plus(bigInt(days).multiply(24 * 60 * 60 * 1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).minus(add);
    ES.RejectAbsolute(ns);

    const Construct = ES.SpeciesConstructor(this, Absolute);
    const result = new Construct(ns.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    if (!ES.IsAbsolute(other)) throw new TypeError('invalid Absolute object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'seconds', ['years', 'months']);

    const [one, two] = [this, other].sort(Absolute.compare);
    const onens = GetSlot(one, EPOCHNANOSECONDS);
    const twons = GetSlot(two, EPOCHNANOSECONDS);
    const diff = twons.minus(onens);

    const ns = diff.mod(1e3);
    const us = diff.divide(1e3).mod(1e3);
    const ms = diff.divide(1e6).mod(1e3);
    const ss = diff.divide(1e9);

    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    const {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
    } = ES.BalanceDuration(0, 0, 0, ss, ms, us, ns, largestUnit);
    return new Duration(0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  toString(timeZoneParam = 'UTC') {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    let timeZone = ES.ToTimeZone(timeZoneParam);
    return ES.AbsoluteToString(this, timeZone);
  }
  toJSON() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const TemporalTimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
    const timeZone = new TemporalTimeZone('UTC');
    return ES.AbsoluteToString(this, timeZone);
  }
  toLocaleString(...args) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  inTimeZone(timeZoneParam = 'UTC') {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTimeZone(timeZoneParam);
    return timeZone.getDateTimeFor(this);
  }

  static fromEpochSeconds(epochSecondsParam) {
    const epochNanoseconds = bigInt(epochSecondsParam).multiply(1e9);
    ES.RejectAbsolute(epochNanoseconds);
    const result = new this(epochNanoseconds.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMilliseconds(epochMillisecondsParam) {
    const epochNanoseconds = bigInt(epochMillisecondsParam).multiply(1e6);
    ES.RejectAbsolute(epochNanoseconds);
    const result = new this(epochNanoseconds.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    const epochNanoseconds = bigInt(epochMicroseconds).multiply(1e3);
    ES.RejectAbsolute(epochNanoseconds);
    const result = new this(epochNanoseconds.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    epochNanoseconds = bigInt(epochNanoseconds);
    ES.RejectAbsolute(epochNanoseconds);
    const result = new this(epochNanoseconds.value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static from(arg) {
    const absolute = ES.ToAbsolute(arg);
    if (this === Absolute) return absolute;
    const result = new this(GetSlot(absolute, EPOCHNANOSECONDS).value);
    if (!ES.IsAbsolute(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsAbsolute(one) || !ES.IsAbsolute(two)) throw new TypeError('invalid Absolute object');
    one = GetSlot(one, EPOCHNANOSECONDS);
    two = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(one).lesser(two)) return -1;
    if (bigInt(one).greater(two)) return 1;
    return 0;
  }
}

MakeIntrinsicClass(Absolute, 'Temporal.Absolute');
