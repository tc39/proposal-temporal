import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

export const now = {
  instant,
  plainDateTime,
  plainDateTimeISO,
  plainDate,
  plainDateISO,
  plainTimeISO,
  timeZone,
  zonedDateTime,
  zonedDateTimeISO
};

function instant() {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
}
function plainDateTime(calendarLike, temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  const inst = instant();
  return ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZone, inst, calendar);
}
function plainDateTimeISO(temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.GetISO8601Calendar();
  const inst = instant();
  return ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZone, inst, calendar);
}
function zonedDateTime(calendarLike, temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, calendar);
}
function zonedDateTimeISO(temporalTimeZoneLike = timeZone()) {
  return zonedDateTime(ES.GetISO8601Calendar(), temporalTimeZoneLike);
}
function plainDate(calendarLike, temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(plainDateTime(calendarLike, temporalTimeZoneLike));
}
function plainDateISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(plainDateTimeISO(temporalTimeZoneLike));
}
function plainTimeISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToTime(plainDateTimeISO(temporalTimeZoneLike));
}
function timeZone() {
  return ES.SystemTimeZone();
}
