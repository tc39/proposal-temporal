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
function dateTime(temporalTimeZoneLike = timeZone()) {
  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
  const timeZone = TemporalTimeZone.from(temporalTimeZoneLike);
  const abs = absolute();
  const dateTime = timeZone.getDateTimeFor(abs);
  return dateTime;
}
function date(temporalTimeZoneLike) {
  return dateTime(temporalTimeZoneLike).getDate();
}
function time(temporalTimeZoneLike) {
  return dateTime(temporalTimeZoneLike).getTime();
}
function timeZone() {
  return ES.SystemTimeZone();
}
