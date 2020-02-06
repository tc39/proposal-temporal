import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { IDENTIFIER, EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';
import { ZONES } from './zones.mjs';
import { timezone as STRING } from './regex.mjs';

import bigInt from 'big-integer';

export class TimeZone {
  constructor(timeZoneIndentifier) {
    CreateSlots(this);
    SetSlot(this, IDENTIFIER, ES.GetCanonicalTimeZoneIdentifier(timeZoneIndentifier));
  }
  get name() {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    return String(GetSlot(this, IDENTIFIER));
  }
  getOffsetFor(absolute) {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsAbsolute(absolute)) throw new TypeError('invalid Absolute object');
    return ES.GetTimeZoneOffsetString(GetSlot(absolute, EPOCHNANOSECONDS), GetSlot(this, IDENTIFIER));
  }
  getDateTimeFor(absolute) {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsAbsolute(absolute)) throw new TypeError('invalid Absolute object');
    const ns = GetSlot(absolute, EPOCHNANOSECONDS);
    const {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    } = ES.GetTimeZoneDateTimeParts(ns, GetSlot(this, IDENTIFIER));
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  getAbsoluteFor(dateTime, disambiguation = 'earlier') {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    dateTime = ES.ToDateTime(dateTime);
    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
    const options = ES.GetTimeZoneEpochValue(
      GetSlot(this, IDENTIFIER),
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    );
    if (options.length === 1) {
      const absolute = Object.create(Absolute.prototype);
      CreateSlots(absolute);
      SetSlot(absolute, EPOCHNANOSECONDS, options[0]);
      return absolute;
    }
    if (options.length) {
      switch (disambiguation) {
        case 'earlier': {
          const result = Object.create(Absolute.prototype);
          CreateSlots(result);
          SetSlot(result, EPOCHNANOSECONDS, options[0]);
          return result;
        }
        case 'later': {
          const result = Object.create(Absolute.prototype);
          CreateSlots(result);
          SetSlot(result, EPOCHNANOSECONDS, options[1]);
          return result;
        }
        default:
          throw new RangeError(`multiple absolute found`);
      }
    }

    if (!~['earlier', 'later'].indexOf(disambiguation)) throw new RangeError(`no such absolute found`);

    const utcns = ES.GetEpochFromParts(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    );
    const before = ES.GetTimeZoneOffsetNanoseconds(utcns.minus(bigInt(86400 * 1e9)), GetSlot(this, IDENTIFIER));
    const after = ES.GetTimeZoneOffsetNanoseconds(utcns.plus(bigInt(86400 * 1e9)), GetSlot(this, IDENTIFIER));
    const diff = ES.ToDuration({
      nanoseconds: after.minus(before)
    });
    switch (disambiguation) {
      case 'earlier':
        const earlier = dateTime.minus(diff);
        return this.getAbsoluteFor(earlier, disambiguation);
      case 'later':
        const later = dateTime.plus(diff);
        return this.getAbsoluteFor(later, disambiguation);
      default:
        throw new RangeError(`no such absolute found`);
    }
  }
  getTransitions(startingPoint) {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    startingPoint = ES.ToAbsolute(startingPoint);
    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
    const timeZone = GetSlot(this, IDENTIFIER);
    const result = {
      next: () => {
        epochNanoseconds = ES.GetTimeZoneNextTransition(epochNanoseconds, timeZone);
        const done = epochNanoseconds === null;
        const value = epochNanoseconds === null ? null : new Absolute(epochNanoseconds);
        return { done, value };
      }
    };
    if (typeof Symbol === 'function') {
      result[Symbol.iterator] = ()=>result;
    }
    return result;
  }
  toString() {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    return this.name;
  }
  static from(arg) {
    let result = ES.ToTimeZone(arg);
    return this === TimeZone ? result : new this(
      GetSlot(result, IDENTIFIER)
    );
  }
}

TimeZone.prototype.toJSON = TimeZone.prototype.toString;

if ('undefined' !== typeof Symbol) {
  TimeZone[Symbol.iterator] = function() {
    const iter = ZONES[Symbol.iterator]();
    return {
      next: () => {
        while (true) {
          let { value, done } = iter.next();
          if (done) return { done };
          try {
            value = new TimeZone(value);
            done = false;
            return { done, value };
          } catch (ex) {}
        }
      }
    };
  };
}

MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
