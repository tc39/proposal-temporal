import {
  // error constructors
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ObjectAssign,
  ObjectCreate
} from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import { GetSlot, TIME } from './slots.mjs';

export class PlainTime {
  constructor(isoHour = 0, isoMinute = 0, isoSecond = 0, isoMillisecond = 0, isoMicrosecond = 0, isoNanosecond = 0) {
    const hour = isoHour === undefined ? 0 : ES.ToIntegerWithTruncation(isoHour);
    const minute = isoMinute === undefined ? 0 : ES.ToIntegerWithTruncation(isoMinute);
    const second = isoSecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoSecond);
    const millisecond = isoMillisecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoMillisecond);
    const microsecond = isoMicrosecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoMicrosecond);
    const nanosecond = isoNanosecond === undefined ? 0 : ES.ToIntegerWithTruncation(isoNanosecond);

    ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    const time = { hour, minute, second, millisecond, microsecond, nanosecond };

    ES.CreateTemporalTimeSlots(this, time);
  }

  get hour() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).hour;
  }
  get minute() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).minute;
  }
  get second() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).second;
  }
  get millisecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).millisecond;
  }
  get microsecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).microsecond;
  }
  get nanosecond() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return GetSlot(this, TIME).nanosecond;
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

    const time = ES.RoundTime(GetSlot(this, TIME), roundingIncrement, smallestUnit, roundingMode);
    return ES.CreateTemporalTime(time);
  }
  equals(other) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    other = ES.ToTemporalTime(other);
    return ES.CompareTimeRecord(GetSlot(this, TIME), GetSlot(other, TIME)) === 0;
  }

  toString(options = undefined) {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    const resolvedOptions = ES.GetOptionsObject(options);
    const digits = ES.GetTemporalFractionalSecondDigitsOption(resolvedOptions);
    const roundingMode = ES.GetRoundingModeOption(resolvedOptions, 'trunc');
    const smallestUnit = ES.GetTemporalUnitValuedOption(resolvedOptions, 'smallestUnit', 'time', undefined);
    if (smallestUnit === 'hour') throw new RangeErrorCtor('smallestUnit must be a time unit other than "hour"');
    const { precision, unit, increment } = ES.ToSecondsStringPrecisionRecord(smallestUnit, digits);
    const time = ES.RoundTime(GetSlot(this, TIME), increment, unit, roundingMode);
    return ES.TimeRecordToString(time, precision);
  }
  toJSON() {
    if (!ES.IsTemporalTime(this)) throw new TypeErrorCtor('invalid receiver');
    return ES.TimeRecordToString(GetSlot(this, TIME), 'auto');
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
    return ES.CompareTimeRecord(GetSlot(one, TIME), GetSlot(two, TIME));
  }
}

MakeIntrinsicClass(PlainTime, 'Temporal.PlainTime');
