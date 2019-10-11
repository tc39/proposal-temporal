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
        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
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
    const {
      hour = GetSlot(this, HOUR),
      minute = GetSlot(this, MINUTE),
      second = GetSlot(this, SECOND),
      millisecond = GetSlot(this, MILLISECOND),
      microsecond = GetSlot(this, MICROSECOND),
      nanosecond = GetSlot(this, NANOSECOND)
    } = timeLike;
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }
  plus(durationLike) {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (years !== 0 || months !== 0 || days !== 0) throw new RangeError('invalid duration');
    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.AddTime(
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
    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.BalanceTime(
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
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(durationLike) {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (years !== 0 || months !== 0 || days !== 0) throw new RangeError('invalid duration');
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
    ({ hour, minute, second, minute, microsecond, nanosecond } = ES.BalanceTime(
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
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  difference(other = {}) {
    other = ES.GetIntrinsic('%Temporal.time%')(other);
    const [one, two] = [this, other].sort(Time.compare);
    const hours = two.hour - one.hour;
    const minutes = two.minute - one.minute;
    const seconds = two.second - one.seconds;
    const milliseconds = two.millisecond - one.millisecond;
    const microseconds = two.microsecond - one.microsecond;
    const nanoseconds = two.nanosecond - one.nanosecond;
    return new Duration(0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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
    let { year, month, day } = ES.GetIntrinsic('%Temporal.date%')(dateLike);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }

  static fromString(isoStringParam) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid time: ${isoString}`);
    const hour = ES.ToInteger(match[1]);
    const minute = ES.ToInteger(match[2]);
    const second = ES.ToInteger(match[3]);
    const millisecond = ES.ToInteger(match[4]);
    const microsecond = ES.ToInteger(match[5]);
    const nanosecond = ES.ToInteger(match[6]);
    return new ES.GetIntrinsic('%Temporal.Time%')(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
  }
  static from(...args) {
    return ES.GetIntrinsic('%Temporal.time%')(...args);
  }
  static compare(one, two) {
    one = ES.GetIntrinsic('%Temporal.time%')(one);
    two = ES.GetIntrinsic('%Temporal.time%')(two);
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
if ('undefined' !== typeof Symbol) {
  Object.defineProperty(Time.prototype, Symbol.toStringTag, {
    value: 'Temporal.Time'
  });
}
MakeIntrinsicClass(Time);
