import { ES } from './ecmascript.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';
import { absolute as STRING } from './regex.mjs';

export class Absolute {
  constructor(epochNanoseconds) {
    CreateSlots(this);
    SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
  }

  getEpochSeconds() {
    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
    let epochSecondsBigInt = epochNanoSeconds / 1000000000n;
    let epochSeconds = ES.ToNumber(epochSecondsBigInt);
    return epochSeconds;
  }
  getEpochMilliseconds() {
    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
    let epochMillisecondsBigInt = epochNanoSeconds / 1000000n;
    let epochMilliseconds = ES.ToNumber(epochMillisecondsBigInt);
    return epochMilliseconds;
  }
  getEpochMicroseconds() {
    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
    let epochMicroseconds = epochNanoSeconds / 1000n;
    return epochMicroseconds;
  }
  getEpochNanoseconds() {
    let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
    return epochNanoSeconds;
  }

  plus(durationLike = {}) {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    if (duration.years) throw new RangeError(`invalid duration field years`);
    if (duration.months) throw new RangeError(`invalid duration field months`);

    let delta = BigInt(duration.days) * 86400000000000n;
    delta += BigInt(duration.hours) * 3600000000000n;
    delta += BigInt(duration.minutes) * 60000000000n;
    delta += BigInt(duration.seconds) * 1000000000n;
    delta += BigInt(duration.milliseconds) * 1000000n;
    delta += BigInt(duration.microseconds) * 1000n;
    delta += BigInt(duration.nanosecond);

    const result = GetSlot(this, EPOCHNANOSECONDS) + delta;
    return new Absolute(result);
  }
  minus(durationLike = {}) {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    if (duration.years) throw new RangeError(`invalid duration field years`);
    if (duration.months) throw new RangeError(`invalid duration field months`);

    let delta = BigInt(duration.days) * 86400000000000n;
    delta += BigInt(duration.hours) * 3600000000000n;
    delta += BigInt(duration.minutes) * 60000000000n;
    delta += BigInt(duration.seconds) * 1000000000n;
    delta += BigInt(duration.milliseconds) * 1000000n;
    delta += BigInt(duration.microseconds) * 1000n;
    delta += BigInt(duration.nanosecond);

    const result = GetSlot(this, EPOCHNANOSECONDS) - delta;
    return new Absolute(result);
  }
  difference(other) {
    other = ES.GetIntrinsic('%Temporal.absolute%')(other);

    const [one, two] = [this, other].sort(Absoulte.compare);
    const delta = two.getEpochNanoseconds() - one.getEpochNanoseconds();
    const duration = ES.GetIntrinsic('%Temporal.duration%')(delta);
    return duration;
  }
  toString(timeZoneParam = 'UTC') {
    let timeZone = ES.GetIntrinsic('%Temporal.timezone%')(timeZoneParam);
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
    return new Intl.DateTimeFormat(...args).format(this);
  }
  inZone(timeZoneParam = 'UTC') {
    const timeZone = ES.ToTimeZone(timeZoneParam);
    return timeZone.getDateTimeFor(this);
  }

  static fromEpochSeconds(epochSecondsParam) {
    let epochSeconds = ES.ToNumber(epochSecondsParam);
    let epochSecondsBigInt = BigInt(epochSeconds);
    let epochNanoSeconds = epochSecondsBigInt * 1000000000n;
    let resultObject = new Absolute(epochNanoSeconds);
    return resultObject;
  }
  static fromEpochMilliseconds(epochMillisecondsParam) {
    let epochMilliseconds = ES.ToNumber(epochMillisecondsParam);
    let epochMillisecondsBigInt = BigInt(epochMilliseconds);
    let epochNanoSeconds = epochMillisecondsBigInt * 1000000n;
    let resultObject = new Absolute(epochNanoSeconds);
    return resultObject;
  }
  static fromEpochMicroseconds(epochMicrosecondsParam) {
    let epochMicroseconds = BigInt(epochMicrosecondsParam);
    let epochNanoSeconds = epochMicroseconds * 1000n;
    let resultObject = new Absolute(epochNanoSeconds);
    return resultObject;
  }
  static fromEpochNanoseconds(epochNanosecondsParam) {
    let epochNanoseconds = BigInt(epochNanosecondsParam);
    let resultObject = new Absolute(epochNanoseconds);
    return resultObject;
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
    const datetime = ES.GetIntrinsic('%Temporal.datetime%', {
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
    return datetime.inZone(zone || 'UTC', match[11] ? match[10] : 'earlier');
  }
}
Absolute.prototype.toJSON = Absolute.prototype.toString;
Object.defineProperty(Absolute.prototype, Symbol.toStringTag, {
  value: 'Temporal.Absolute'
});
