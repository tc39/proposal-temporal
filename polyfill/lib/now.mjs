import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

export const now = {
  instant,
  plainDateTime,
  plainDateTimeISO,
  plainDate,
  plainDateISO,
  plainTime,
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
  return ES.GetTemporalDateTimeFor(timeZone, inst, calendar);
}
function plainDateTimeISO(temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.GetISO8601Calendar();
  const inst = instant();
  return ES.GetTemporalDateTimeFor(timeZone, inst, calendar);
}
function zonedDateTime(calendarLike, temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  const ZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
  return new ZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, calendar);
}
function zonedDateTimeISO(temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.GetISO8601Calendar();
  const ZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
  return new ZonedDateTime(ES.SystemUTCEpochNanoSeconds(), timeZone, calendar);
}
function plainDate(calendarLike, temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(plainDateTime(calendarLike, temporalTimeZoneLike));
}
function plainDateISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(plainDateTimeISO(temporalTimeZoneLike));
}
function plainTime(calendarLike, temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToTime(plainDateTime(calendarLike, temporalTimeZoneLike));
}
function plainTimeISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToTime(plainDateTimeISO(temporalTimeZoneLike));
}
function timeZone() {
  return ES.SystemTimeZone();
}
