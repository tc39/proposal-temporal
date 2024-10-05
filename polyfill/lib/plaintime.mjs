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
      const time = {
        hour: isoHour,
        minute: isoMinute,
        second: isoSecond,
        millisecond: isoMillisecond,
        microsecond: isoMicrosecond,
        nanosecond: isoNanosecond
      };
      ObjectDefineProperty(this, '_repr_', {
        value: `${this[SymbolToStringTag]} <${ES.TimeRecordToString(time, 'auto')}>`,
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

    const { hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundTime(
      {
        hour: GetSlot(this, ISO_HOUR),
        minute: GetSlot(this, ISO_MINUTE),
        second: GetSlot(this, ISO_SECOND),
        millisecond: GetSlot(this, ISO_MILLISECOND),
        microsecond: GetSlot(this, ISO_MICROSECOND),
        nanosecond: GetSlot(this, ISO_NANOSECOND)
      },
      roundingIncrement,
      smallestUnit,
      roundingMode
    );

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
    const resolvedOptions = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    const time = ES.RoundTime(
      {
        hour: GetSlot(this, ISO_HOUR),
        minute: GetSlot(this, ISO_MINUTE),
        second: GetSlot(this, ISO_SECOND),
        millisecond: GetSlot(this, ISO_MILLISECOND),
        microsecond: GetSlot(this, ISO_MICROSECOND),
        nanosecond: GetSlot(this, ISO_NANOSECOND)
      },
      increment,
      unit,
      roundingMode
    );
    return ES.TimeRecordToString(time, precision);
  }
  toJSON() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    const time = {
      hour: GetSlot(this, ISO_HOUR),
      minute: GetSlot(this, ISO_MINUTE),
      second: GetSlot(this, ISO_SECOND),
      millisecond: GetSlot(this, ISO_MILLISECOND),
      microsecond: GetSlot(this, ISO_MICROSECOND),
      nanosecond: GetSlot(this, ISO_NANOSECOND)
    };
    return ES.TimeRecordToString(time, 'auto');
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
    return ES.CompareTimeRecord(
      {
        hour: GetSlot(one, ISO_HOUR),
        minute: GetSlot(one, ISO_MINUTE),
        second: GetSlot(one, ISO_SECOND),
        millisecond: GetSlot(one, ISO_MILLISECOND),
        microsecond: GetSlot(one, ISO_MICROSECOND),
        nanosecond: GetSlot(one, ISO_NANOSECOND)
      },
      {
        hour: GetSlot(two, ISO_HOUR),
        minute: GetSlot(two, ISO_MINUTE),
        second: GetSlot(two, ISO_SECOND),
        millisecond: GetSlot(two, ISO_MILLISECOND),
        microsecond: GetSlot(two, ISO_MICROSECOND),
        nanosecond: GetSlot(two, ISO_NANOSECOND)
      }
    );
  }
}

MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');
