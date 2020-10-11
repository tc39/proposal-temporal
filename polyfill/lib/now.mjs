import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';

export const now = {
  instant,
  dateTime,
  dateTimeISO,
  zonedDateTime,
  date,
  dateISO,
  timeISO,
  timeZone
};

function instant() {
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ES.SystemUTCEpochNanoSeconds());
}
function dateTime(calendarLike, temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = ES.ToTemporalCalendar(calendarLike);
  const inst = instant();
  return ES.GetTemporalDateTimeFor(timeZone, inst, calendar);
}
function dateTimeISO(temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const calendar = GetISO8601Calendar();
  const inst = instant();
  return ES.GetTemporalDateTimeFor(timeZone, inst, calendar);
}
function zonedDateTime(temporalTimeZoneLike = timeZone(), calendar = undefined) {
  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
  const timeZone = TemporalTimeZone.from(temporalTimeZoneLike);
  const abs = instant();
  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
  return new TemporalZonedDateTime(abs.getEpochNanoseconds(), timeZone, calendar);
}
function date(calendarLike, temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(dateTime(calendarLike, temporalTimeZoneLike));
}
function dateISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToDate(dateTimeISO(temporalTimeZoneLike));
}
function timeISO(temporalTimeZoneLike = timeZone()) {
  return ES.TemporalDateTimeToTime(dateTimeISO(temporalTimeZoneLike));
}
function timeZone() {
  return ES.SystemTimeZone();
}
