import { ES } from './ecmascript.mjs';

export const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
export const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
export const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
export const Date = ES.GetIntrinsic('%Temporal.Date%');
export const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
export const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
export const Time = ES.GetIntrinsic('%Temporal.Time%');
export const Duration = ES.GetIntrinsic('%Temporal.Duration%');

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
