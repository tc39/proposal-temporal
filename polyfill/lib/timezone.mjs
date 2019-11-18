import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { IDENTIFIER, EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';
import { ZONES } from './zones.mjs';
import { timezone as STRING } from './regex.mjs';

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
    absolute = ES.CastAbsolute(absolute);
    return ES.GetTimeZoneOffsetString(absolute.getEpochMilliseconds(), GetSlot(this, IDENTIFIER));
  }
  getDateTimeFor(absolute) {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    absolute = ES.CastAbsolute(absolute);
    const { ms, ns } = GetSlot(absolute, EPOCHNANOSECONDS);
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
    } = ES.GetTimeZoneDateTimeParts(ms, ns, GetSlot(this, IDENTIFIER));
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  getAbsoluteFor(dateTime, disambiguation = 'earlier') {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    dateTime = ES.CastDateTime(dateTime);
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

    const { ms: utcms } = ES.GetEpochFromParts(
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
    const before = ES.GetTimeZoneOffsetMilliseconds(utcms - 86400000, GetSlot(this, IDENTIFIER));
    const after = ES.GetTimeZoneOffsetMilliseconds(utcms + 86400000, GetSlot(this, IDENTIFIER));
    const diff = ES.CastToDuration({
      milliseconds: after - before
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
    startingPoint = ES.CastAbsolute(startingPoint);
    let { ms } = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
    return {
      next: () => {
        ms = ES.GetTimeZoneNextTransition(ms, GetSlot(this, IDENTIFIER));
        const done = epochNanoseconds !== null;
        const value = epochNanoseconds !== null ? null : new Absolute(epochNanoseconds);
        return { done, value };
      }
    };
  }
  toString() {
    if (!ES.IsTimeZone(this)) throw new TypeError('invalid receiver');
    return this.name;
  }
  static from(arg) {
    if (typeof arg === 'object') {
      return ES.CastTimeZone(arg);
    } else if (typeof arg === 'string') {
      const isoString = ES.ToString(arg);
      const match = STRING.exec(isoString);
      if (!match) throw new RangeError(`invalid timezone: ${isoString}`);
      const zone = match[1] ? 'UTC' : match[3] || match[2];
      return new TimeZone(zone);
    } else {
      throw new TypeError(`invalid timezone: ${arg}`);
    }
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
