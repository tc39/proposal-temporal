import { ObjectDefineProperty, SymbolToStringTag } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';
import { GetSlot, ISO_DATE_TIME } from './slots.mjs';

const instant = () => {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
};
const plainDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  const isoDateTime = ES.GetISODateTimeFor(timeZone, ES.SystemUTCEpochNanoSeconds());
  return ES.CreateTemporalDateTime(isoDateTime, 'iso8601');
};
const zonedDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, 'iso8601');
};
const plainDateISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return ES.CreateTemporalDate(GetSlot(plainDateTimeISO(temporalTimeZoneLike), ISO_DATE_TIME).isoDate, 'iso8601');
};
const plainTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return ES.CreateTemporalTime(GetSlot(plainDateTimeISO(temporalTimeZoneLike), ISO_DATE_TIME).time);
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
ObjectDefineProperty(Now, SymbolToStringTag, {
  value: 'Temporal.Now',
  writable: false,
  enumerable: false,
  configurable: true
});
