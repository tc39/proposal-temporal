import { ES } from './ecmascript.mjs';
import { IDENTIFIER, CreateSlots, GetSlot, SetSlot } from './slots.mjs';
import { ZONES } from './zones.mjs';
import { timezone as STRING } from './regex.mjs';

export class TimeZone {
  constructor(timeZoneIndentifier) {
    CreateSlots(this);
    SetSlot(this, IDENTIFIER, ES.GetCanonicalTimeZoneIdentifier(timeZoneIndentifier));
  }
  get name() {
    return GetSlot(this, IDENTIFIER);
  }
  getOffsetFor(absolute) {
    absolute = ES.GetIntrinsic('%Temporal.absolute%')(absolute);
    return ES.GetTimeZoneOffsetString(absolute.getEpochNanoseconds(), GetSlot(this, IDENTIFIER));
  }
  getDateTimeFor(absolute) {
    absolute = ES.GetIntrinsic('%Temporal.absolute%')(absolute);
    const epochNanoseconds = absolute.getEpochNanoseconds();
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
    } = ES.GetTimeZoneDateTimeParts(epochNanoseconds, GetSlot(this, IDENTIFIER));
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  getAbsoluteFor(dateTime, disambiguation = 'earlier') {
    dateTime = ES.GetIntrinsic('%Temporal.datetime%')(dateTime);
    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
    const options = ES.GetTimeZoneEpochNanoseconds(
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
    if (options.length === 1) return new Absolute(options[0]);
    if (options.length) {
      switch (disambiguation) {
        case 'earlier':
          return new Ansolute(options[0]);
        case 'later':
          return new Absolute(options[1]);
        default:
          throw new RangeError(`multiple absolute found`);
      }
    }

    if (!['earlier', 'later'].includes(disambiguation)) throw new RangeError(`no such absolute found`);

    const utcns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const before = ES.GetTimeZoneOffsetNanoSeconds(utcns - 86400000000000n, GetSlot(this, IDENTIFIER));
    const after = ES.GetTimeZoneOffsetNanoSeconds(utcns + 86400000000000n, GetSlot(this, IDENTIFIER));
    const diff = ES.CastToDuration({
      nanoseconds: Number(after - before)
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
    startingPoint = ES.GetIntrinsic('%Temporal.absolute%')(startingPoint);
    let epochNanoseconds = startingPoint.getEpochNanoseconds();
    const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
    return {
      next: () => {
        epochNanoseconds = ES.GetTimeZoneNextTransition(epochNanoseconds, GetSlot(this, IDENTIFIER));
        const done = epochNanoseconds !== null;
        const value = epochNanoseconds !== null ? null : new Absolute(epochNanoseconds);
        return { done, value };
      }
    };
  }
  toString() {
    return this.name;
  }
  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid timezone: ${isoString}`);
    const zone = match[1] ? 'UTC' : (match[3] || match[2]);
    return new TimeZone(zone);
  }
  [Symbol.iterator]() {
    const iter = ZONES[Symbol.iterator]();
    return {
      next: () => {
        while (true) {
          let { value, done } = iter.next();
          if (done) return { done };
          try {
            value = TimeZone(value);
            done = false;
            return { done, value };
          } catch (ex) {}
        }
      }
    };
  }
}
TimeZone.prototype.toJSON = TimeZone.prototype.toString;
Object.defineProperty(TimeZone.prototype, Symbol.toStringTag, {
  value: 'Temporal.TimeZone'
});
