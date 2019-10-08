import { ES } from './ecmascript.mjs';
import { MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { monthday as RAW } from './regex.mjs';
const DATE = new RegExp(`^${RAW.source}$`);

export function MonthDay(month, day, disambiguation) {
  if (!(this instanceof MonthDay)) return new MonthDay(month, day, disambiguation);
  if ('object' === typeof month) {
    ({ month, day } = month);
  }
  month = ES.ToInteger(month);
  day = ES.ToInteger(day);
  switch (disambiguation) {
    case 'constrain':
      ({ month, day } = ES.ConstrainDate(1970, month, day));
      break;
    case 'balance':
      ({ month, day } = ES.BalanceDate(1970, month, day));
      break;
    default:
      ES.RejectDate(1970, month, day);
  }

  CreateSlots(this);
  SetSlot(this, MONTH, month);
  SetSlot(this, DAY, day);
}
Object.defineProperties(MonthDay.prototype, {
  month: {
    get: function() {
      return GetSlot(this, MONTH);
    },
    enumerable: true,
    configurable: true
  },
  day: {
    get: function() {
      return GetSlot(this, DAY);
    },
    enumerable: true,
    configurable: true
  }
});
MonthDay.prototype.with = function(dateLike = {}, disambiguation = 'constrain') {
  const { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
  return new MonthDay(month, day, disambiguation);
};
MonthDay.prototype.plus = function plus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { month, day } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (years || hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
    throw new RangeError('invalid duration');
  ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
  ({ month, day } = ES.BalanceDate(1970, month, day));
  return new MonthDay(month, day);
};
MonthDay.prototype.minus = function minus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
    throw new RangeError('invalid duration');
  ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new MonthDay(month, day);
};
MonthDay.prototype.difference = function difference(other, disambiguation = 'constrain') {
  const [one, two] = [this, other].sort(MonthDay.compare);
  let months = two.month - one.month;
  let days = (two.days = one.days);
  if (days < 0) {
    days = ES.DaysInMonth(1970, two.month) + days;
    months -= 1;
  }
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  return new Duration(0, months, days, 0, 0, 0, 0, 0, 0);
};
MonthDay.prototype.toString = MonthDay.prototype.toJSON = function toString() {
  let year = ES.ISOYearString(GetSlot(this, YEAR));
  let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
  let day = ES.ISODateTimePartString(GetSlot(this, DAY));
  let resultString = `${year}-${month}-${day}`;
  return resultString;
};
MonthDay.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
MonthDay.prototype.withYear = function withYear(year) {
  const month = GetSlot(this, MONTH);
  const day = GetSlot(this, DAY);
  const Date = ES.GetIntrinsic('%Temporal.Date%');
  return new Date(year, month, day);
};

MonthDay.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = DATE.exec(isoString);
  if (!match) throw new RangeError('invalid yearmonth string');
  const month = ES.ToInteger(match[1]);
  const day = ES.ToInteger(match[2]);
  return new MonthDay(month, day, 'reject');
};
MonthDay.compare = function compare(one, two) {
  if (one.month !== two.month) return one.month - two.month;
  if (one.day !== two.day) return one.day - two.day;
  return 0;
};
Object.defineProperty(MonthDay.prototype, Symbol.toStringTag, {
  value: 'Temporal.MonthDay'
});
