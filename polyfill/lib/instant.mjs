/* global __debug__ */

import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import bigInt from 'big-integer';

const ObjectCreate = Object.create;

export class Instant {
  constructor(epochNanoseconds) {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochNanoseconds is required');
    }

    const ns = ES.ToBigInt(epochNanoseconds);
    ES.ValidateEpochNanoseconds(ns);
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, ns);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      const repr = ES.TemporalInstantToString(this, undefined, 'auto');
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${repr}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get epochSeconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return +value.divide(1e9);
  }
  get epochMilliseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return +value.divide(1e6);
  }
  get epochMicroseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return bigIntIfAvailable(value.divide(1e3));
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return bigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }

  add(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.ToLimitedTemporalDuration(
      temporalDurationLike,
      ['years', 'months', 'weeks', 'days']
    );
    const ns = ES.AddInstant(
      GetSlot(this, EPOCHNANOSECONDS),
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
    return new Instant(ns);
  }
  subtract(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.ToLimitedTemporalDuration(
      temporalDurationLike,
      ['years', 'months', 'weeks', 'days']
    );
    const ns = ES.AddInstant(
      GetSlot(this, EPOCHNANOSECONDS),
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      -microseconds,
      -nanoseconds
    );
    return new Instant(ns);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalInstant('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return ES.DifferenceTemporalInstant('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (roundTo === undefined) throw new TypeError('options parameter is required');
    if (ES.Type(roundTo) === 'String') {
      const stringParam = roundTo;
      roundTo = ObjectCreate(null);
      roundTo.smallestUnit = stringParam;
    } else {
      roundTo = ES.GetOptionsObject(roundTo);
    }
    const DISALLOWED_UNITS = ['year', 'month', 'week', 'day'];
    const smallestUnit = ES.ToSmallestTemporalUnit(roundTo, undefined, DISALLOWED_UNITS);
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required');
    const roundingMode = ES.ToTemporalRoundingMode(roundTo, 'halfExpand');
    const maximumIncrements = {
      hour: 24,
      minute: 1440,
      second: 86400,
      millisecond: 86400e3,
      microsecond: 86400e6,
      nanosecond: 86400e9
    };
    const roundingIncrement = ES.ToTemporalRoundingIncrement(roundTo, maximumIncrements[smallestUnit], true);
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = ES.RoundInstant(ns, roundingIncrement, smallestUnit, roundingMode);
    return new Instant(roundedNs);
  }
  equals(other) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    other = ES.ToTemporalInstant(other);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    return bigInt(one).equals(two);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    options = ES.GetOptionsObject(options);
    let timeZone = options.timeZone;
    if (timeZone !== undefined) timeZone = ES.ToTemporalTimeZone(timeZone);
    const { precision, unit, increment } = ES.ToSecondsStringPrecision(options);
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = ES.RoundInstant(ns, increment, unit, roundingMode);
    const roundedInstant = new Instant(roundedNs);
    return ES.TemporalInstantToString(roundedInstant, timeZone, precision);
  }
  toJSON() {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return ES.TemporalInstantToString(this, undefined, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Instant');
  }
  toZonedDateTime(item) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (ES.Type(item) !== 'Object') {
      throw new TypeError('invalid argument in toZonedDateTime');
    }
    const calendarLike = item.calendar;
    if (calendarLike === undefined) {
      throw new TypeError('missing calendar property in toZonedDateTime');
    }
    const calendar = ES.ToTemporalCalendar(calendarLike);
    const temporalTimeZoneLike = item.timeZone;
    if (temporalTimeZoneLike === undefined) {
      throw new TypeError('missing timeZone property in toZonedDateTime');
    }
    const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, calendar);
  }
  toZonedDateTimeISO(item) {
    if (!ES.IsTemporalInstant(this)) throw new TypeError('invalid receiver');
    if (ES.Type(item) === 'Object') {
      const timeZoneProperty = item.timeZone;
      if (timeZoneProperty !== undefined) {
        item = timeZoneProperty;
      }
    }
    const timeZone = ES.ToTemporalTimeZone(item);
    const calendar = ES.GetISO8601Calendar();
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, calendar);
  }

  static fromEpochSeconds(epochSeconds) {
    epochSeconds = ES.ToNumber(epochSeconds);
    const epochNanoseconds = bigInt(epochSeconds).multiply(1e9);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochMilliseconds(epochMilliseconds) {
    epochMilliseconds = ES.ToNumber(epochMilliseconds);
    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    epochMicroseconds = ES.ToBigInt(epochMicroseconds);
    const epochNanoseconds = epochMicroseconds.multiply(1e3);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static from(item) {
    if (ES.IsTemporalInstant(item)) {
      return new Instant(GetSlot(item, EPOCHNANOSECONDS));
    }
    return ES.ToTemporalInstant(item);
  }
  static compare(one, two) {
    one = ES.ToTemporalInstant(one);
    two = ES.ToTemporalInstant(two);
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
