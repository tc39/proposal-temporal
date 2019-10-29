import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import { HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { time as STRING } from './regex.mjs';

export class Time {
  constructor(
    hour,
    minute,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0,
    disambiguation = 'constrain'
  ) {
    hour = ES.ToInteger(hour);
    minute = ES.ToInteger(minute);
    second = ES.ToInteger(second);
    millisecond = ES.ToInteger(millisecond);
    microsecond = ES.ToInteger(microsecond);
    nanosecond = ES.ToInteger(nanosecond);
    switch (disambiguation) {
      case 'reject':
        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
        break;
      case 'constrain':
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        break;
      case 'balance':
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
    }

    CreateSlots(this);
    SetSlot(this, HOUR, hour);
    SetSlot(this, MINUTE, minute);
    SetSlot(this, SECOND, second);
    SetSlot(this, MILLISECOND, millisecond);
    SetSlot(this, MICROSECOND, microsecond);
    SetSlot(this, NANOSECOND, nanosecond);
  }

  get hour() {
    return GetSlot(this, HOUR);
  }
  get minute() {
    return GetSlot(this, MINUTE);
  }
  get second() {
    return GetSlot(this, SECOND);
  }
  get millisecond() {
    return GetSlot(this, MILLISECOND);
  }
  get microsecond() {
    return GetSlot(this, MICROSECOND);
  }
  get nanosecond() {
    return GetSlot(this, NANOSECOND);
  }

  with(timeLike = {}, disambiguation = 'constrain') {
    const props = ES.ValidPropertyBag(timeLike, [
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
    const {
      hour = GetSlot(this, HOUR),
      minute = GetSlot(this, MINUTE),
      second = GetSlot(this, SECOND),
      millisecond = GetSlot(this, MILLISECOND),
      microsecond = GetSlot(this, MICROSECOND),
      nanosecond = GetSlot(this, NANOSECOND)
    } = props;
    const Construct = ES.SpeciesConstructor(this, Time);
    return new Construct(hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }
  plus(durationLike) {
    const duration = ES.CastDuration(durationLike);
    if (!ES.ValidDuration(duration, ['years', 'months', 'days'])) {
      throw new RangeError('invalid duration');
    }
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
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
    const Construct = ES.SpeciesConstructor(this, Time);
    return new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(durationLike) {
    const duration = ES.CastDuration(durationLike);
    if (!ES.ValidDuration(duration, ['years', 'months', 'days'])) {
      throw new RangeError('invalid duration');
    }
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.SubtractTime(
      hour,
      minute,
      second,
      minute,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    const Construct = ES.SpeciesConstructor(this, Time);
    return new Construct(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  difference(other) {
    other = ES.CastTime(other);
    const [earlier, later] = [this, other].sort(Time.compare);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(earlier, later);
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'balance');
  }

  toString() {
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
    return new Intl.DateTimeFormat(...args).format(this);
  }

  withDate(dateLike = {}, disambiguation = 'constrain') {
    let { year, month, day } = ES.CastDate(dateLike);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }

  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid time: ${isoString}`);
    const hour = ES.ToInteger(match[1]);
    const minute = ES.ToInteger(match[2]);
    const second = ES.ToInteger(match[3]);
    const millisecond = ES.ToInteger(match[4]);
    const microsecond = ES.ToInteger(match[5]);
    const nanosecond = ES.ToInteger(match[6]);
    const Construct = this;
    return new Construct(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
  }
  static from(...args) {
    const result = ES.CastTime(...args);
    return this === Time
      ? result
      : new this(result.hour, result.minute, result.second, result.millisecond, result.microsecond, result.nanosecond);
  }
  static compare(one, two) {
    one = ES.CastTime(one);
    two = ES.CastTime(two);
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
