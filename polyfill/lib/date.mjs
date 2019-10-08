import { ES } from './ecmascript.mjs';
import { YEAR, MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { date as RAW } from './regex.mjs';
const DATE = new RegExp(`^${RAW.source}$`);

export function Date(year, month, day, disambiguation) {
  if (!(this instanceof Date)) return new Date(year, month, day, disambiguation);
  if ('object' === typeof year && !month && !day) {
    ({ year, month, day } = year);
  }
  year = ES.ToInteger(year);
  month = ES.ToInteger(month);
  day = ES.ToInteger(day);
  switch (disambiguation) {
    case 'constrain':
      ({ year, month, day } = ES.ConstrainDate(year, month, day));
      break;
    case 'balance':
      ({ year, month, day } = ES.BalanceDate(year, month, day));
      break;
    default:
      ES.RejectDate(year, month, day);
  }

  CreateSlots(this);
  SetSlot(this, YEAR, year);
  SetSlot(this, MONTH, month);
  SetSlot(this, DAY, day);
}
Object.defineProperties(Date.prototype, {
  year: {
    get: function() {
      return GetSlot(this, YEAR);
    },
    enumerable: true,
    configurable: true
  },
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
  },
  dayOfWeek: {
    get: function() {
      return ES.DayOfWeek(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
    },
    enumerable: true,
    configurable: true
  },
  dayOfYear: {
    get: function() {
      return ES.DayOfYear(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
    },
    enumerable: true,
    configurable: true
  },
  weekOfYear: {
    get: function() {
      return ES.WeekOfYear(GetSlot(this, THIS).year, GetSlot(this, THIS).month, GetSlot(this, DAY));
    },
    enumerable: true,
    configurable: true
  },
  daysInYear: {
    get: function() {
      return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
    },
    enumerable: true,
    configurable: true
  },
  daysInMonth: {
    get: function() {
      return ES.DaysInMonth(GetSlot(this, THIS).year, GetSlot(this, MONTH));
    },
    enumerable: true,
    configurable: true
  },
  leapYear: {
    get: function() {
      return ES.LeapYear(GetSlot(this, YEAR));
    },
    enumerable: true,
    configurable: true
  }
});
Date.prototype.with = function(dateLike = {}, disambiguation = 'constrain') {
  const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
  return new Date(year, month, day, disambiguation);
};
Date.prototype.plus = function plus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
    throw new RangeError('invalid duration');
  ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Date(year, month, day);
};
Date.prototype.minus = function minus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
    throw new RangeError('invalid duration');
  ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new Date(year, month, day);
};
Date.prototype.difference = function difference(other, disambiguation = 'constrain') {
  const [one, two] = [this, other].sort(DateTime.compare);
  let years = two.year - one.year;

  let days = ES.DayOfYear(two.year, two.month, two.day) - ES.DayOfYear(one.year, one.month, one.day);
  if (days < 0) {
    years -= 1;
    days = (ES.LeapYear(two.year) ? 366 : 365) + days;
  }
  if (disambiguation === 'constrain' && month === 2 && ES.LeapYear(one.year) && !ES.LeapYear(one.year + years))
    days + 1;

  if (days < 0) {
    years -= 1;
    days += ES.DaysInMonth(two.year, two.month);
  }
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  return new Duration(years, 0, days, 0, 0, 0, 0, 0, 0);
};
Date.prototype.toString = Date.prototype.toJSON = function toString() {
  let year = ES.ISOYearString(GetSlot(this, YEAR));
  let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
  let day = ES.ISODateTimePartString(GetSlot(this, DAY));
  let resultString = `${year}-${month}-${day}`;
  return resultString;
};
Date.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};
Date.prototype.withTime = function withTime(timeLike, disambiguation = 'constrain') {
  const year = GetSlot(this, YEAR);
  const month = GetSlot(this, MONTH);
  const day = GetSlot(this, DAY);
  const { hour, minute, second, millisecond, microsecond, nanosecond } = timeLike;
  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
};
Date.prototype.getYearMonth = function getYearMonth() {
  const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
  return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
};
Date.prototype.getMonthDay = function getMonthDay() {
  const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
  return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
};

Date.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = DATE.exec(isoString);
  if (!match) throw new RangeError('invalid date string');
  const year = ES.ToInteger(match[1]);
  const month = ES.ToInteger(match[2]);
  const day = ES.ToInteger(match[3]);
  return new Date(year, month, day, 'reject');
};
Date.compare = function compare(one, two) {
  if (one.year !== two.year) return one.year - two.year;
  if (one.month !== two.month) return one.month - two.month;
  if (one.day !== two.day) return one.day - two.day;
  return 0;
};
Object.defineProperty(Date.prototype, Symbol.toStringTag, {
  get: () => 'Temporal.Date'
});
