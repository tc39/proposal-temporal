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
function dateTime(temporalTimeZoneLike = timeZone(), calendar = undefined) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
  const abs = absolute();
  return ES.GetTemporalDateTimeFor(timeZone, abs, calendar);
}
function date(temporalTimeZoneLike, calendar = undefined) {
  return dateTime(temporalTimeZoneLike, calendar).toDate();
}
function time(temporalTimeZoneLike) {
  return dateTime(temporalTimeZoneLike).toTime();
}
function timeZone() {
  return ES.SystemTimeZone();
}
