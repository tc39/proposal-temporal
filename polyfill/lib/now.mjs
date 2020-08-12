import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

export const now = {
  absolute,
  dateTime,
  date,
  time,
  timeZone
};

function absolute() {
  const Absolute = GetIntrinsic('%Temporal.Absolute%');
  return new Absolute(ES.SystemUTCEpochNanoSeconds());
}
function dateTime(temporalTimeZoneLike = timeZone(), calendarLike = GetDefaultCalendar()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  const abs = absolute();
  return ES.GetTemporalDateTimeFor(timeZone, abs, calendar);
}
function date(temporalTimeZoneLike, calendarLike = undefined) {
  return ES.TemporalDateTimeToDate(dateTime(temporalTimeZoneLike, calendarLike));
}
function time(temporalTimeZoneLike) {
  return ES.TemporalDateTimeToTime(dateTime(temporalTimeZoneLike));
}
function timeZone() {
  return ES.SystemTimeZone();
}
