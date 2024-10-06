/* global __debug__ */

import {
  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ObjectCreate,
  ObjectDefineProperty,
  SymbolToStringTag
} from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import bigInt from 'big-integer';

export class Instant {
  constructor(epochNanoseconds) {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    if (arguments.length < 1) {
      throw new TypeErrorCtor('missing argument: epochNanoseconds is required');
    }

    const ns = ES.ToBigInt(epochNanoseconds);
    ES.ValidateEpochNanoseconds(ns);
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, ns);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      const iso = ES.GetISOPartsFromEpoch(ns);
      const repr = ES.ISODateTimeToString(iso, 'iso8601', 'auto', 'never') + 'Z';
      ObjectDefineProperty(this, '_repr_', {
        value: `${this[SymbolToStringTag]} <${repr}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get epochMilliseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return ES.epochNsToMs(value, 'floor');
  }
  get epochNanoseconds() {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.BigIntIfAvailable(GetSlot(this, EPOCHNANOSECONDS));
  }

  add(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToInstant('add', this, temporalDurationLike);
  }
  subtract(temporalDurationLike) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToInstant('subtract', this, temporalDurationLike);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalInstant('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalInstant('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
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
    const smallestUnit = ES.GetTemporalUnitValuedOption(roundTo, 'smallestUnit', 'time', ES.REQUIRED);
    const maximumIncrements = {
      hour: 24,
      minute: 1440,
      second: 86400,
      millisecond: 86400e3,
      microsecond: 86400e6,
      nanosecond: 86400e9
    };
    ES.ValidateTemporalRoundingIncrement(roundingIncrement, maximumIncrements[smallestUnit], true);
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = ES.RoundTemporalInstant(ns, roundingIncrement, smallestUnit, roundingMode);
    return new Instant(roundedNs);
  }
  equals(other) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalInstant(other);
    const one = GetSlot(this, EPOCHNANOSECONDS);
    const two = GetSlot(other, EPOCHNANOSECONDS);
    return bigInt(one).equals(two);
  }
  toString(options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    let timeZone = resolvedOptions.timeZone;
    if (timeZone !== undefined) timeZone = ES.ToTemporalTimeZoneIdentifier(timeZone);
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    const ns = GetSlot(this, EPOCHNANOSECONDS);
    const roundedNs = ES.RoundTemporalInstant(ns, increment, unit, roundingMode);
    const roundedInstant = new Instant(roundedNs);
    return ES.TemporalInstantToString(roundedInstant, timeZone, precision);
  }
  toJSON() {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TemporalInstantToString(this, undefined, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('Instant');
  }
  toZonedDateTimeISO(timeZone) {
    if (!ES.IsTemporalInstant(this)) throw new TypeErrorCtor('invalid receiver');
    timeZone = ES.ToTemporalTimeZoneIdentifier(timeZone);
    return ES.CreateTemporalZonedDateTime(GetSlot(this, EPOCHNANOSECONDS), timeZone, 'iso8601');
  }

  static fromEpochMilliseconds(epochMilliseconds) {
    epochMilliseconds = ES.ToNumber(epochMilliseconds);
    const epochNanoseconds = bigInt(epochMilliseconds).multiply(1e6);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    epochNanoseconds = ES.ToBigInt(epochNanoseconds);
    ES.ValidateEpochNanoseconds(epochNanoseconds);
    return new Instant(epochNanoseconds);
  }
  static from(item) {
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
