import { ES } from './ecmascript.mjs';

export function parse(isoString) {
  const { absolute, dateTime, date, time, yearMonth, monthDay, ianaName, offset } = ES.ParseFullISOString(isoString);
  return {
    absolute,
    dateTime,
    date,
    time,
    yearMonth,
    monthDay,
    zone: { ianaName, offset }
  };
}
