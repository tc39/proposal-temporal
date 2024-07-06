import * as ES from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

const instant = () => {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
};
const plainDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
  const inst = instant();
  return ES.GetPlainDateTimeFor(timeZone, inst, 'iso8601');
};
const zonedDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
  return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, 'iso8601');
};
const plainDateISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return ES.TemporalDateTimeToDate(plainDateTimeISO(temporalTimeZoneLike));
};
const plainTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return ES.TemporalDateTimeToTime(plainDateTimeISO(temporalTimeZoneLike));
};
const timeZoneId = () => {
  return ES.DefaultTimeZone();
};

export const Now = {
  instant,
  plainDateTimeISO,
  plainDateISO,
  plainTimeISO,
  timeZoneId,
  zonedDateTimeISO
};
Object.defineProperty(Now, Symbol.toStringTag, {
  value: 'Temporal.Now',
  writable: false,
  enumerable: false,
  configurable: true
});
