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
import bigInt from 'big-integer';

export class Absolute {
  constructor(epochNanoseconds) {
    if (('bigint' !== typeof epochNanoseconds) && !bigInt.isInstance(epochNanoseconds)) throw RangeError('bigint required');
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, bigInt(epochNanoseconds));
  }

  getEpochSeconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = GetSlot(this, EPOCHNANOSECONDS);
    return value.divide(1e9);
  }
  getEpochMilliseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return value.divide(1e6);
  }
  getEpochMicroseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const value = bigInt(GetSlot(this, EPOCHNANOSECONDS));
    return value.divide(1e3).value;
  }
  getEpochNanoseconds() {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    return bigInt(GetSlot(this, EPOCHNANOSECONDS)).value;
  }

  plus(durationLike) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (GetSlot(duration, YEARS) !== 0) throw new RangeError(`invalid duration field years`);
    if (GetSlot(duration, MONTHS) !== 0) throw new RangeError(`invalid duration field months`);

    let add = bigInt(0);
    add = add.plus(bigInt(GetSlot(duration, NANOSECONDS)).multiply(1e0));
    add = add.plus(bigInt(GetSlot(duration, MICROSECONDS)).multiply(1e3));
    add = add.plus(bigInt(GetSlot(duration, MILLISECONDS)).multiply(1e6));
    add = add.plus(bigInt(GetSlot(duration, SECONDS)).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, MINUTES)).multiply(60).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, HOURS)).multiply(60 * 60).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, DAYS)).multiply(24 * 60 * 60).multiply(1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).plus(add);
    const Construct = ES.SpeciesConstructor(this, Absolute);
    return new Construct(ns);
  }
  minus(durationLike) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (GetSlot(duration, YEARS) !== 0) throw new RangeError(`invalid duration field years`);
    if (GetSlot(duration, MONTHS) !== 0) throw new RangeError(`invalid duration field months`);

    let add = bigInt(0);
    add = add.plus(bigInt(GetSlot(duration, NANOSECONDS)).multiply(1e0));
    add = add.plus(bigInt(GetSlot(duration, MICROSECONDS)).multiply(1e3));
    add = add.plus(bigInt(GetSlot(duration, MILLISECONDS)).multiply(1e6));
    add = add.plus(bigInt(GetSlot(duration, SECONDS)).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, MINUTES)).multiply(60).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, HOURS)).multiply(60 * 60).multiply(1e9));
    add = add.plus(bigInt(GetSlot(duration, DAYS)).multiply(24 * 60 * 60).multiply(1e9));

    const ns = bigInt(GetSlot(this, EPOCHNANOSECONDS)).minus(add);
    const Construct = ES.SpeciesConstructor(this, Absolute);
    return new Construct(bigInt(ns));
  }
  difference(other) {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    other = ES.CastAbsolute(other);

    const [one, two] = [this, other].sort(Absolute.compare);
    const onens = GetSlot(one, EPOCHNANOSECONDS);
    const twons = GetSlot(two, EPOCHNANOSECONDS);
    const diff = twons.minus(onens);

    const ns = diff.mod(1e3);
    const us = diff.divide(1e3).mod(1e3);
    const ms = diff.divide(1e6).mod(1e3);
    const ss = diff.divide(1e9);

    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    const duration = new Duration(0, 0, 0, 0, 0, ss, ms, us, ns, 'balance');
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
  inTimeZone(timeZoneParam = 'UTC') {
    if (!ES.IsAbsolute(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTimeZone(timeZoneParam);
    return timeZone.getDateTimeFor(this);
  }

  static fromEpochSeconds(epochSecondsParam) {
    return new Absolute(bigInt(epochSecondsParam).multiply(1e9));
  }
  static fromEpochMilliseconds(epochMillisecondsParam) {
    return new Absolute(bigInt(epochMillisecondsParam).multiply(1e6));
  }
  static fromEpochMicroseconds(epochMicroseconds) {
    return new Absolute(bigInt(epochMicroseconds).multiply(1e3));
  }
  static fromEpochNanoseconds(epochNanoseconds) {
    return new Absolute(bigInt(epochNanoseconds));
  }
  static from(arg) {
    let result;
    if (typeof arg === 'object') {
      result = ES.CastAbsolute(arg);
    } else if (typeof arg === 'string') {
      const isoString = ES.ToString(arg);
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
      result = datetime.inTimeZone(zone || 'UTC', match[11] ? match[10] : 'earlier');
    } else {
      throw new TypeError(`invalid absolute: ${arg}`);
    }
    return this === Absolute ? result : new this(result.getEpochNanoseconds());
  }
  static compare(one, two) {
    one = ES.CastAbsolute(one);
    two = ES.CastAbsolute(two);
    one = GetSlot(one, EPOCHNANOSECONDS);
    two = GetSlot(two, EPOCHNANOSECONDS);
    if (bigInt(one).lesser(two)) return -1;
    if (bigInt(one).greater(two)) return 1;
    return 0;
  }
}
Absolute.prototype.toJSON = Absolute.prototype.toString;

MakeIntrinsicClass(Absolute, 'Temporal.Absolute');
