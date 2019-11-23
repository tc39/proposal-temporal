if ('undefined' === typeof Symbol) {
  const gt = 'object' === typeof globalThis ? globalThis : new Function('return this')();
  const ltr = Array(26)
    .fill(0)
    .map((_, idx) => String.fromCharCode(idx + 65));
  const Symbol = (gt.Symbol = function Symbol(name) {
    if (!(this instanceof Symbol)) return new Symbol(name);
    const rnd = Array(100)
      .fill(0)
      .map(() => ltr[Math.floor(Math.random() * ltr.length)])
      .join('');
    this.id = `Symbol(${name})-${rnd}`;
  });
  Symbol.prototype.toString = function() {
    return this.id;
  };
  Symbol.iterator = Symbol('iterator');
  Symbol.toStringTag = Symbol('toStringTag');
}

import { ES } from './ecmascript.mjs';

export const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
export const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
export const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
export const Date = ES.GetIntrinsic('%Temporal.Date%');
export const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
export const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
export const Time = ES.GetIntrinsic('%Temporal.Time%');
export const Duration = ES.GetIntrinsic('%Temporal.Duration%');

export { now } from './now.mjs';
