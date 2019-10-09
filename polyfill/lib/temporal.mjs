import { ES } from './ecmascript.mjs';

export const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
export const absolute = ES.GetIntrinsic('%Temporal.absolute%');
export const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
export const timezone = ES.GetIntrinsic('%Temporal.timezone%');
export const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
export const datetime = ES.GetIntrinsic('%Temporal.datetime%');
export const Date = ES.GetIntrinsic('%Temporal.Date%');
export const date = ES.GetIntrinsic('%Temporal.date%');
export const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
export const yearmonth = ES.GetIntrinsic('%Temporal.yearmonth%');
export const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
export const monthday = ES.GetIntrinsic('%Temporal.monthday%');
export const Time = ES.GetIntrinsic('%Temporal.Time%');
export const time = ES.GetIntrinsic('%Temporal.time%');
export const Duration = ES.GetIntrinsic('%Temporal.Duration%');
export const duration = ES.GetIntrinsic('%Temporal.duration%');

export function getAbsolute() {
  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
  let absolute = new Absolute(epochNanoSeconds);
  return absolute;
}
export function getDateTime(timeZone = ES.SystemTimeZone()) {
  timeZone = ES.ToTimeZone(timeZone);
  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
  let absolute = new Absolute(epochNanoSeconds);
  let dateTime = timeZone.getDateTimeFor(absolute);
  return dateTime;
}
export function getDate(timeZone = ES.SystemTimeZone()) {
  timeZone = ES.ToTimeZone(timeZone);
  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
  let absolute = new Absolute(epochNanoSeconds);
  let dateTime = timeZone.getDateTimeFor(absolute);
  let date = dateTime.getDate();
  return date;
}
export function getTime(timeZone = ES.SystemTimeZone()) {
  timeZone = ES.ToTimeZone(timeZone);
  let epochNanoSeconds = ES.SystemUTCEpochNanoSeconds();
  let absolute = new Absolute(epochNanoSeconds);
  let dateTime = timeZone.getDateTimeFor(absolute);
  let time = dateTime.getTime();
  return time;
}
export function getTimeZone() {
  let timeZone = ES.ToTimeZone(timeZone);
  return timeZone;
}
