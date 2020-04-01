import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  YEAR,
  MONTH,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
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
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond'
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
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
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
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
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
    const [earlier, later] = [this, other].sort(Time.compare);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(earlier, later);
    if (hours >= 12) {
      hours = 24 - hours;
      minutes *= -1;
      seconds *= -1;
      milliseconds *= -1;
      microseconds *= -1;
      nanoseconds *= -1;
    }
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
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }

  toString() {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
    let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
    let seconds = ES.ISOSecondsString(
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND)
    );
    let resultString = `${hour}:${minute}${seconds ? `:${seconds}` : ''}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }

  withDate(temporalDate) {
    if (!ES.IsTemporalTime(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(temporalDate)) throw new TypeError('invalid Temporal.Date object');
    const year = GetSlot(temporalDate, YEAR);
    const month = GetSlot(temporalDate, MONTH);
    const day = GetSlot(temporalDate, DAY);
    const hour = GetSlot(this, HOUR);
    const minute = GetSlot(this, MINUTE);
    const second = GetSlot(this, SECOND);
    const millisecond = GetSlot(this, MILLISECOND);
    const microsecond = GetSlot(this, MICROSECOND);
    const nanosecond = GetSlot(this, NANOSECOND);
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }

  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let result = ES.ToTemporalTime(item, disambiguation);
    if (this === Time) return result;
    return new this(
      GetSlot(result, HOUR),
      GetSlot(result, MINUTE),
      GetSlot(result, SECOND),
      GetSlot(result, MILLISECOND),
      GetSlot(result, MICROSECOND),
      GetSlot(result, NANOSECOND)
    );
  }
  static compare(one, two) {
    if (!ES.IsTemporalTime(one) || !ES.IsTemporalTime(two)) throw new TypeError('invalid Time object');
    if (one.hour !== two.hour) return ES.ComparisonResult(one.hour - two.hour);
    if (one.minute !== two.minute) return ES.ComparisonResult(one.minute - two.minute);
    if (one.second !== two.second) return ES.ComparisonResult(one.second - two.second);
    if (one.millisecond !== two.millisecond) return ES.ComparisonResult(one.millisecond - two.millisecond);
    if (one.microsecond !== two.microsecond) return ES.ComparisonResult(one.microsecond - two.microsecond);
    if (one.nanosecond !== two.nanosecond) return ES.ComparisonResult(one.nanosecond - two.nanosecond);
    return ES.ComparisonResult(0);
  }
}
Time.prototype.toJSON = Time.prototype.toString;

MakeIntrinsicClass(Time, 'Temporal.Time');
