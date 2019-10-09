if ('undefined' === typeof Symbol) {
  const gt = ('object' === typeof globalThis) ? globalThis : (new Function('return this'))();
  const ltr = Array(26).fill(0).map((_, idx)=>String.fromCharCode(idx + 65));
  const Symbol = gt.Symbol = function Symbol(name) {
    if (!(this instanceof Symbol)) return new Symbol(name);
    const rnd = Array(100).fill(0).map(()=>ltr[Math.floor(Math.random() * ltr.length)]).join('');
    this.id = `Symbol(${name})-${rnd}`;
  };
  Symbol.prototype.toString = function() {
    return this.id;
  };
  Symbol.iterator = Symbol('iterator');
  Symbol.toStringTag = Symbol('toStringTag');
}

import { ES } from './ecmascript.mjs';
import { EPOCHNANOSECONDS, CreateSlots, SetSlot } from './slots.mjs';

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
  const { ms, ns } = ES.SystemUTCEpochNanoSeconds();
  const result = Object.create(Absolute.prototype);
  CreateSlots(result);
  SetSlot(result, EPOCHNANOSECONDS, { ms, ns });
  return result;
}
export function getDateTime(timeZone = getTimeZone()) {
  timeZone = ES.ToTimeZone(timeZone);
  const absolute = getAbsolute();
  let dateTime = timeZone.getDateTimeFor(absolute);
  return dateTime;
}
export function getDate(timeZone) {
  return getDateTime(timeZone).getDate();
}
export function getTime(timeZone) {
  return getDateTime(timeZone).getTime();
}
export function getTimeZone() {
  let timeZone = ES.SystemTimeZone();
  return timeZone;
}
