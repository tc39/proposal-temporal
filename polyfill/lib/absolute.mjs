import { ES } from './ecmascript.mjs';
import { EPOCHNANOSECONDS, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

export function Absolute(epochNanoseconds) {
  if (!(this instanceof Absolute)) return new Absolute(epochNanoseconds);
  CreateSlots(this);
  SetSlot(this, EPOCHNANOSECONDS, epochNanoseconds);
}

Absolute.prototype.getEpochSeconds = function getEpochSeconds() {
  let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
  let epochSecondsBigInt = epochNanoSeconds / 1000000000n;
  let epochSeconds = ES.ToNumber(epochSecondsBigInt);
  return epochSeconds;
};
Absolute.prototype.getEpochMilliseconds = function getEpochMilliseconds() {
  let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
  let epochMillisecondsBigInt = epochNanoSeconds / 1000000n;
  let epochMilliseconds = ES.ToNumber(epochMillisecondsBigInt);
  return epochMilliseconds;
};
Absolute.prototype.getEpochMicroseconds = function getEpochMicroseconds() {
  let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
  let epochMicroseconds = epochNanoSeconds / 1000n;
  return epochMicroseconds;
};
Absolute.prototype.getEpochNanoseconds = function getEpochNanoseconds() {
  let epochNanoSeconds = GetSlot(this, EPOCHNANOSECONDS);
  return epochNanoSeconds;
};

Absolute.prototype.plus = function plus(durationLike = {}) {
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  const duration = new Duration(durationLike);
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
};
Absolute.prototype.minus = function minus(durationLike = {}) {
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  const duration = new Duration(durationLike);
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
};
Absolute.prototype.difference = function difference(other) {
  const [one, two] = [this, other].sort(Absoulte.compare);
  const delta = two.getEpochNanoseconds() - one.getEpochNanoseconds();
  const nanos = Number(delta % 1000);
  const micro = Number((delta / 1000n) % 1000);
  const milli = Number((delta / 1000000n) % 1000);
  const secds = Number(delta / 1000000000n);
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  return new Duration(0, 0, 0, 0, 0, secds, milli, micro, nanos);
};
Absolute.prototype.toString = Absolute.prototype.toJSON = function toString(timeZoneParam = 'UTC') {
  let timeZone = ES.ToTimeZone(timeZoneParam);
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
};
Absolute.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
Absolute.prototype.inZone = function inZone(timeZoneParam = 'UTC') {
  const timeZone = ES.ToTimeZone(timeZoneParam);
  return timeZone.getDateTimeFor(this);
};

Absolute.fromEpochSeconds = function fromEpochSeconds(epochSecondsParam) {
  let epochSeconds = ES.ToNumber(epochSecondsParam);
  let epochSecondsBigInt = BigInt(epochSeconds);
  let epochNanoSeconds = epochSecondsBigInt * 1000000000n;
  let resultObject = new Absolute(epochNanoSeconds);
  return resultObject;
};
Absolute.fromEpochMilliseconds = function fromEpochMilliseconds(epochMillisecondsParam) {
  let epochMilliseconds = ES.ToNumber(epochMillisecondsParam);
  let epochMillisecondsBigInt = BigInt(epochMilliseconds);
  let epochNanoSeconds = epochMillisecondsBigInt * 1000000n;
  let resultObject = new Absolute(epochNanoSeconds);
  return resultObject;
};
Absolute.fromEpochMicroseconds = function fromEpochMicroseconds(epochMicrosecondsParam) {
  let epochMicroseconds = BigInt(epochMicrosecondsParam);
  let epochNanoSeconds = epochMicroseconds * 1000n;
  let resultObject = new Absolute(epochNanoSeconds);
  return resultObject;
};
Absolute.fromEpochNanoseconds = function fromEpochNanoseconds(epochNanosecondsParam) {
  let epochNanoseconds = BigInt(epochNanosecondsParam);
  let resultObject = new Absolute(epochNanoseconds);
  return resultObject;
};
Absolute.fromString = function fromString(isoString) {};

Object.defineProperty(Absolute.prototype, Symbol.toStringTag, {
  get: () => 'Temporal.Absolute'
});
