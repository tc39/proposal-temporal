/* global __debug__ */

import {
  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ArrayPrototypeEvery,
  ObjectAssign,
  ObjectCreate,
  ObjectDefineProperty,
  SymbolToStringTag
} from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

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

  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  return ES.FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
}

export class PlainTime {
  constructor(isoHour = 0, isoMinute = 0, isoSecond = 0, isoMillisecond = 0, isoMicrosecond = 0, isoNanosecond = 0) {
    isoHour = isoHour === undefined ? 0 : ES.ToIntegerWithTruncation(isoHour);
    isoMinute = isoMinute === undefined ? 0 : ES.ToIntegerWithTruncation(isoMinute);
    isoSecond = isoSecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoSecond);
    isoMillisecond = isoMillisecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoMillisecond);
    isoMicrosecond = isoMicrosecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoMicrosecond);
    isoNanosecond = isoNanosecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoNanosecond);

    ES.RejectTime(isoHour, isoMinute, isoSecond, isoMillisecond, isoMicrosecond, isoNanosecond);
    CreateSlots(this);
    SetSlot(this, ISO_HOUR, isoHour);
    SetSlot(this, ISO_MINUTE, isoMinute);
    SetSlot(this, ISO_SECOND, isoSecond);
    SetSlot(this, ISO_MILLISECOND, isoMillisecond);
    SetSlot(this, ISO_MICROSECOND, isoMicrosecond);
    SetSlot(this, ISO_NANOSECOND, isoNanosecond);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      ObjectDefineProperty(this, '_repr_', {
        value: `${this[SymbolToStringTag]} <${TemporalTimeToString(this, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  get hour() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_HOUR);
  }
  get minute() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MINUTE);
  }
  get second() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_SECOND);
  }
  get millisecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, ISO_NANOSECOND);
  }

  with(temporalTimeLike, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    if (ES.Type(temporalTimeLike) !== 'Object') {
      throw new TypeErrorCtor('invalid argument');
    }
    ES.RejectTemporalLikeObject(temporalTimeLike);

    const partialTime = ES.ToTemporalTimeRecord(temporalTimeLike, 'partial');

    const fields = ES.ToTemporalTimeRecord(this);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ObjectAssign(fields, partialTime);
    const overflow = ES.GetTemporalOverflowOption(ES.GetOptionsObject(options));
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
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToTime('add', this, temporalDurationLike);
  }
  subtract(temporalDurationLike) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.AddDurationToTime('subtract', this, temporalDurationLike);
  }
  until(other, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainTime('until', this, other, options);
  }
  since(other, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.DifferenceTemporalPlainTime('since', this, other, options);
  }
  round(roundTo) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
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
    const MAX_INCREMENTS = {
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    ES.ValidateTemporalRoundingIncrement(roundingIncrement, MAX_INCREMENTS[smallestUnit], false);

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
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalTime(other);
    return ES.Call(
      ArrayPrototypeEvery,
      [ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND],
      [(slot) => GetSlot(this, slot) === GetSlot(other, slot)]
    );
  }

  toString(options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    options = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(options);
    const roundingMode = ES.GetRoundingModeOption(options, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(options, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    return TemporalTimeToString(this, precision, { unit, increment, roundingMode });
  }
  toJSON() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return TemporalTimeToString(this, 'auto');
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    ES.ValueOfThrows('PlainTime');
  }

  static from(item, options = undefined) {
    return ES.ToTemporalTime(item, options);
  }
  static compare(one, two) {
    one = ES.ToTemporalTime(one);
    two = ES.ToTemporalTime(two);
    return ES.CompareTemporalTime(
      GetSlot(one, ISO_HOUR),
      GetSlot(one, ISO_MINUTE),
      GetSlot(one, ISO_SECOND),
      GetSlot(one, ISO_MILLISECOND),
      GetSlot(one, ISO_MICROSECOND),
      GetSlot(one, ISO_NANOSECOND),
      GetSlot(two, ISO_HOUR),
      GetSlot(two, ISO_MINUTE),
      GetSlot(two, ISO_SECOND),
      GetSlot(two, ISO_MILLISECOND),
      GetSlot(two, ISO_MICROSECOND),
      GetSlot(two, ISO_NANOSECOND)
    );
  }
}

MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');
