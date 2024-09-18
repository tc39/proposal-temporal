import { ObjectDefineProperty, SymbolToStringTag } from './primordials.mjs';

import * as ES from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

const instant = () => {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
};
const plainDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
  const iso = ES.GetISODateTimeFor(timeZone, ES.SystemUTCEpochNanoSeconds());
  return ES.CreateTemporalDateTime(
    iso.year,
    iso.month,
    iso.day,
    iso.hour,
    iso.minute,
    iso.second,
    iso.millisecond,
    iso.microsecond,
    iso.nanosecond,
    'iso8601'
  );
};
const zonedDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneIdentifier(temporalTimeZoneLike);
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
ObjectDefineProperty(Now, SymbolToStringTag, {
  value: 'Temporal.Now',
  writable: false,
  enumerable: false,
  configurable: true
});
