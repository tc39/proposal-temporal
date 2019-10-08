import { ES } from './ecmascript.mjs';

import { HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { time as RAW } from './regex.mjs';
const TIME = new RegExp(`^${RAW.source}$`);

export function Time(
  hour,
  minute,
  second = 0,
  millisecond = 0,
  microsecond = 0,
  nanosecond = 0,
  disambiguation = 'constrain'
) {
  if (!(this instanceof Time))
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  if ('object' === typeof hour && !minute && !second && !millisecond && !microsecond && !nanosecond) {
    ({ hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 } = hour);
  }
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
Object.defineProperties(Time.prototype, {
  hour: {
    get: function() {
      return GetSlot(this, HOUR);
    },
    enumerable: true,
    configurable: true
  },
  minute: {
    get: function() {
      return GetSlot(this, MINUTE);
    },
    enumerable: true,
    configurable: true
  },
  second: {
    get: function() {
      return GetSlot(this, SECOND);
    },
    enumerable: true,
    configurable: true
  },
  millisecond: {
    get: function() {
      return GetSlot(this, MILLISECOND);
    },
    enumerable: true,
    configurable: true
  },
  microsecond: {
    get: function() {
      return GetSlot(this, MICROSECOND);
    },
    enumerable: true,
    configurable: true
  },
  nanosecond: {
    get: function() {
      return GetSlot(this, NANOSECOND);
    },
    enumerable: true,
    configurable: true
  }
});
Time.prototype.with = function(timeLike = {}, disambiguation = 'constrain') {
  const {
    hour = GetSlot(this, HOUR),
    minute = GetSlot(this, MINUTE),
    second = GetSlot(this, SECOND),
    millisecond = GetSlot(this, MILLISECOND),
    microsecond = GetSlot(this, MICROSECOND),
    nanosecond = GetSlot(this, NANOSECOND)
  } = timeLike;
  return new Time(hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
};
Time.prototype.plus = function plus(durationLike) {
  const duration = ES.CastToDuration(durationLike);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (years || months || days) throw new RangeError('invalid duration');
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
};
Time.prototype.minus = function minus(durationLike) {
  const duration = ES.CastToDuration(durationLike);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (years || months || days) throw new RangeError('invalid duration');
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
};
Time.prototype.difference = function difference(other = {}) {
  const [one, two] = [
    this,
    Object.assign(
      {
        hours: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0
      },
      other
    )
  ].sort(Time.compare);
  const hours = two.hour - one.hour;
  const minutes = two.minute - one.minute;
  const seconds = two.second - one.seconds;
  const milliseconds = two.millisecond - one.millisecond;
  const microseconds = two.microsecond - one.microsecond;
  const nanoseconds = two.nanosecond - one.nanosecond;
  return new Duration(0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
};

Time.prototype.toString = Time.prototype.toJSON = function toString() {
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
};
Time.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};

Time.prototype.withDate = function withDate(dateLike = {}, disambiguation = 'constrain') {
  let { year, month, day } = dateLike;
  let { hour, minute, second, millisecond, microsecond, nanosecond } = this;
  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
};

Time.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = TIME.exec(isoString);
  if (!match) throw new RangeError('invalid datetime string');
  const hour = ES.ToInteger(match[1]);
  const minute = ES.ToInteger(match[2]);
  const second = match[3] ? ES.ToInteger(match[3]) : 0;
  const millisecond = match[4] ? ES.ToInteger(match[4]) : 0;
  const microsecond = match[5] ? ES.ToInteger(match[5]) : 0;
  const nanosecond = match[6] ? ES.ToInteger(match[6]) : 0;
  return new Time(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
};
Time.compare = function compare(one, two) {
  if (one.hour !== two.hour) return one.hour - two.hour;
  if (one.minute !== two.minute) return one.minute - two.minute;
  if (one.second !== two.second) return one.second - two.second;
  if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
  if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
  if (one.nanosecond !== two.nanosecond) return one.nanosecond - two.nanosecond;
  return 0;
};
Object.defineProperty(Time.prototype, Symbol.toStringTag, {
  value: 'Temporal.Time'
});
