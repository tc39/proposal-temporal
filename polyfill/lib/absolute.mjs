import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  EPOCHNANOSECONDS,
  CreateSlots,
  GetSlot,
  SetSlot,
  YEARS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS
} from './slots.mjs';
import { absolute as STRING } from './regex.mjs';

export class Absolute {
  constructor(epochNanoseconds) {
    if ('bigint' !== typeof epochNanoseconds) throw RangeError('bigint required');
    const epochMilliseconds = Number(epochNanoseconds / BigInt(1e6));
    const restNanoseconds = Number(epochNanoseconds % BigInt(1e6));
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, { ms: epochMilliseconds, ns: restNanoseconds });
  }

  getEpochSeconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    const epochSeconds = Math[value.ms < 0 ? 'ceil' : 'floor'](value.ms / 1000);
    return epochSeconds;
  }
  getEpochMilliseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    const epochMilliSeconds = value.ms;
    return epochMilliSeconds;
  }
  getEpochMicroseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    const epochNanoseconds = BigInt(value.ms) * BigInt(1e6) + (BigInt(value.ns) % BigInt(1e6));
    return epochNanoseconds / BigInt(1e3);
  }
  getEpochNanoseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    const epochMicroseconds = BigInt(value.ms) * BigInt(1e6) + (BigInt(value.ns) % BigInt(1e6));
    return epochMicroseconds;
  }

  plus(durationLike = {}) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (GetSlot(duration, YEARS) !== 0) throw new RangeError(`invalid duration field years`);
    if (GetSlot(duration, MONTHS) !== 0) throw new RangeError(`invalid duration field months`);

    let { ms, ns } = GetSlot(this, EPOCHNANOSECONDS);
    let negative = ms < 0 || ns < 0;
    ns += GetSlot(duration, MICROSECONDS) * 1000;
    ns += GetSlot(duration, NANOSECONDS);
    if (negative && ns > 0) {
      ms += Math.floor(ns / 1e6);
      ns = 1e6 - (ns % 1e6);
    }
    ms += GetSlot(duration, DAYS) * 86400000;
    ms += GetSlot(duration, HOURS) * 3600000;
    ms += GetSlot(duration, MINUTES) * 60000;
    ms += GetSlot(duration, SECONDS) * 1000;
    ms += GetSlot(duration, MILLISECONDS);

    if (negative && ms > 0) {
      ms -= 1;
      ns += 1e6;
    }

    const Construct = ES.SpeciesConstructor(this, Absolute);
    if (Construct !== Absolute) {
      return new Construct(BigInt(ms) * BigInt(1e6) + BigInt(ns));
    }
    const result = Object.create(Absolute.prototype);
    CreateSlots(result);
    SetSlot(result, EPOCHNANOSECONDS, { ms, ns });
    return result;
  }
  minus(durationLike = {}) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (GetSlot(duration, YEARS) !== 0) throw new RangeError(`invalid duration field years`);
    if (GetSlot(duration, MONTHS) !== 0) throw new RangeError(`invalid duration field months`);

    let { ms, ns } = GetSlot(this, EPOCHNANOSECONDS);
    let negative = ms < 0 || ns < 0;
    ns -= GetSlot(duration, NANOSECONDS);
    ns -= GetSlot(duration, MICROSECONDS);
    if (!negative && ns < 0) {
      ms += Math.ceil(ns / 1e6);
      ns = 1e6 + (ns % 1e6);
    }
    ms -= GetSlot(duration, DAYS) * 86400000;
    ms -= GetSlot(duration, HOURS) * 3600000;
    ms -= GetSlot(duration, MINUTES) * 60000;
    ms -= GetSlot(duration, SECONDS) * 1000;
    ms -= GetSlot(duration, MILLISECONDS);

    const Construct = ES.SpeciesConstructor(this, Absolute);
    if (Construct !== Absolute) {
      return new Construct(BigInt(ms) * BigInt(1e6) + BigInt(ns));
    }
    const result = Object.create(Absolute.prototype);
    CreateSlots(result);
    SetSlot(result, EPOCHNANOSECONDS, { ms, ns });
    return result;
  }
  difference(other) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    other = ES.CastAbsolute(other);

    const [one, two] = [this, other].sort(Absolute.compare);
    const { ms: onems, ns: onens } = GetSlot(one, EPOCHNANOSECONDS);
    const { ms: twoms, ns: twons } = GetSlot(two, EPOCHNANOSECONDS);

    const ns = twons - onens;
    const ms = twoms - onems;

    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    const duration = new Duration(0, 0, 0, 0, 0, 0, ms, 0, ns, 'balance');
    return duration;
  }
  toString(timeZoneParam = 'UTC') {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    let timeZone = ES.CastTimeZone(timeZoneParam);
    let dateTime = timeZone.getDateTimeFor(this);
    let year = ES.ISOYearString(dateTime.year);
    let month = ES.ISODateTimePartString(dateTime.month);
    let day = ES.ISODateTimePartString(dateTime.day);
    let hour = ES.ISODateTimePartString(dateTime.hour);
    let minute = ES.ISODateTimePartString(dateTime.minute);
    let seconds = ES.ISOSecondsString(dateTime.second, dateTime.millisecond, dateTime.microsecond, dateTime.nanosecond);
    let timeZoneString = ES.ISOTimeZoneString(timeZone, this);
    let resultString = `${year}-${month}-${day}T${hour}:${minute}${seconds ? `:${seconds}` : ''}${timeZoneString}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  inZone(timeZoneParam = 'UTC') {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTimeZone(timeZoneParam);
    return timeZone.getDateTimeFor(this);
  }

  static fromEpochSeconds(epochSecondsParam) {
    const epochMilliseconds = ES.ToNumber(epochSecondsParam) * 1000;
    const resultObject = Object.create(Absolute.prototype);
    CreateSlots(resultObject);
    SetSlot(resultObject, EPOCHNANOSECONDS, { ms: epochMilliseconds, ns: 0 });
    return this === Absolute ? resultObject : new this(resultObject.getEpochNanoseconds());
  }
  static fromEpochMilliseconds(epochMillisecondsParam) {
    const epochMilliseconds = ES.ToNumber(epochMillisecondsParam);
    const resultObject = Object.create(Absolute.prototype);
    CreateSlots(resultObject);
    SetSlot(resultObject, EPOCHNANOSECONDS, { ms: epochMilliseconds, ns: 0 });
    return this === Absolute ? resultObject : new this(resultObject.getEpochNanoseconds());
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    if ('bigint' !== typeof epochMicroseconds) throw RangeError('bigint required');
    const epochMilliseconds = epochMicroseconds / BigInt(1e3);
    const restNanoseconds = (epochMicroseconds % BigInt(1e3)) * BigInt(1e3);
    const resultObject = Object.create(Absolute.prototype);
    CreateSlots(resultObject);
    SetSlot(resultObject, EPOCHNANOSECONDS, { ms: epochMilliseconds, ns: restNanoseconds });
    return this === Absolute ? resultObject : new this(resultObject.getEpochNanoseconds());
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    if ('bigint' !== typeof epochNanoseconds) throw RangeError('bigint required');
    const epochMilliseconds = epochNanoseconds / BigInt(1e6);
    const restNanoseconds = epochNanoseconds % BigInt(1e6);
    const resultObject = Object.create(Absolute.prototype);
    CreateSlots(resultObject);
    SetSlot(resultObject, EPOCHNANOSECONDS, { ms: epochMilliseconds, ns: restNanoseconds });
    return this === Absolute ? resultObject : new this(resultObject.getEpochNanoseconds());
  }
  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid absolute: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const day = ES.ToInteger(match[3]);
    const hour = ES.ToInteger(match[4]);
    const minute = ES.ToInteger(match[5]);
    const second = ES.ToInteger(match[6]);
    const millisecond = ES.ToInteger(match[7]);
    const microsecond = ES.ToInteger(match[8]);
    const nanosecond = ES.ToInteger(match[9]);
    const zone = match[11] || match[10] || 'UTC';
    const datetime = ES.CastDateTime({
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    });
    const result = datetime.inZone(zone || 'UTC', match[11] ? match[10] : 'earlier');
    return this === Absolute ? result : new this(result.getEpochNanoseconds());
  }
  static from(...args) {
    const result = ES.CastAbsolute(...args);
    return this === Absolute ? result : new this(result.getEpochNanoseconds());
  }
  static compare(one, two) {
    one = ES.CastAbsolute(one);
    two = ES.CastAbsolute(two);
    one = GetSlot(one, EPOCHNANOSECONDS);
    two = GetSlot(two, EPOCHNANOSECONDS);
    if (one.ms !== two.ms) return ES.ComparisonResult(one.ms - two.ms);
    if (one.ns !== two.ns) return ES.ComparisonResult(one.ns - two.ns);
    return ES.ComparisonResult(0);
  }
}
Absolute.prototype.toJSON = Absolute.prototype.toString;

MakeIntrinsicClass(Absolute, 'Temporal.Absolute');
