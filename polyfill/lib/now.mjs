import { ObjectDefineProperty, SymbolToStringTag } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

function SystemDateTime(timeZone) {
  return ES.GetISODateTimeFor(timeZone, ES.SystemUTCEpochNanoSeconds());
}

const instant = () => {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
};
const plainDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  const isoDateTime = SystemDateTime(timeZone);
  return ES.CreateTemporalDateTime(isoDateTime, 'iso8601');
};
const zonedDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, 'iso8601');
};
const plainDateISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  const isoDateTime = SystemDateTime(timeZone);
  return ES.CreateTemporalDate(isoDateTime.isoDate, 'iso8601');
};
const plainTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  const isoDateTime = SystemDateTime(timeZone);
  return ES.CreateTemporalTime(isoDateTime.time);
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
