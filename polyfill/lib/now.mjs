import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

export const now = {
  instant,
  dateTime,
  date,
  timeISO,
  timeZone
};

function instant() {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
}
function dateTime(temporalTimeZoneLike = timeZone(), calendarLike = GetDefaultCalendar()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  const abs = instant();
  return ES.GetTemporalDateTimeFor(timeZone, abs, calendar);
}
function date(temporalTimeZoneLike = timeZone(), calendarLike = undefined) {
  return ES.TemporalDateTimeToDate(dateTime(temporalTimeZoneLike, calendarLike));
}
function timeISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToTime(dateTimeISO(temporalTimeZoneLike));
}
function timeZone() {
  return ES.SystemTimeZone();
}
