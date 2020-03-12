import { ES } from './ecmascript.mjs';
const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');

export const now = {
  absolute,
  dateTime,
  date,
  time,
  timeZone
};

function absolute() {
  const ns = ES.SystemUTCEpochNanoSeconds();
  return new Absolute(ns);
}
function dateTime(temporalTimeZoneLike = timeZone()) {
  const timeZone = ES.ToTemporalTimeZone(temporalTimeZoneLike);
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
