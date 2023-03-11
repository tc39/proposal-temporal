import * as ES from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';
import { TimeZoneMethodRecord } from './methodrecord.mjs';

const instant = () => {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
};
const plainDateTime = (calendarLike, temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendarSlotValue(calendarLike);
  const inst = instant();
  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor']);
  return ES.GetPlainDateTimeFor(timeZoneRec, inst, calendar);
};
const plainDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
  const inst = instant();
  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor']);
  return ES.GetPlainDateTimeFor(timeZoneRec, inst, 'iso8601');
};
const zonedDateTime = (calendarLike, temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  const timeZone = ES.ToTemporalTimeZoneSlotValue(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendarSlotValue(calendarLike);
  return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, calendar);
};
const zonedDateTimeISO = (temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return zonedDateTime('iso8601', temporalTimeZoneLike);
};
const plainDate = (calendarLike, temporalTimeZoneLike = ES.DefaultTimeZone()) => {
  return ES.TemporalDateTimeToDate(plainDateTime(calendarLike, temporalTimeZoneLike));
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
  plainDateTime,
  plainDateTimeISO,
  plainDate,
  plainDateISO,
  plainTimeISO,
  timeZoneId,
  zonedDateTime,
  zonedDateTimeISO
};
Object.defineProperty(Now, Symbol.toStringTag, {
  value: 'Temporal.Now',
  writable: false,
  enumerable: false,
  configurable: true
});
