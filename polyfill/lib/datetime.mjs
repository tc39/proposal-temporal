import { ES } from './ecmascript.mjs';

import { datetime as RAW } from './regex.mjs';
const DATETIME = new RegExp(`^${RAW.source}$`);

import {
  YEAR,
  MONTH,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

export function DateTime(
  year,
  month,
  day,
  hour,
  minute,
  second = 0,
  millisecond = 0,
  microsecond = 0,
  nanosecond = 0,
  disambiguation = 'constrain'
) {
  if (!(this instanceof DateTime))
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  if (
    'object' === typeof year &&
    'object' === typeof month &&
    !day &&
    !hour &&
    !minute &&
    !second &&
    !millisecond &&
    !microsecond &&
    !nanosecond
  ) {
    ({ hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 } = month);
    ({ year, month, day } = year);
  }
  if (
    'object' === typeof year &&
    !month &&
    !day &&
    !hour &&
    !minute &&
    !second &&
    !millisecond &&
    !microsecond &&
    !nanosecond
  ) {
    ({ year, month, day, hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 } = year);
  }
  year = ES.ToInteger(year);
  month = ES.ToInteger(month);
  day = ES.ToInteger(day);
  hour = ES.ToInteger(hour);
  minute = ES.ToInteger(minute);
  second = ES.ToInteger(second);
  millisecond = ES.ToInteger(millisecond);
  microsecond = ES.ToInteger(microsecond);
  nanosecond = ES.ToInteger(nanosecond);
  switch (disambiguation) {
    case 'constrain':
      ({ year, month, day } = ES.ConstrainDate(year, month, day));
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ));
      break;
    case 'balance':
      ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ));
      ({ year, month, day } = ES.BalanceDate(year, month, day + days));
      break;
    default:
      ES.RejectDate(year, month, day);
      ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }

  CreateSlots(this);
  SetSlot(this, YEAR, year);
  SetSlot(this, MONTH, month);
  SetSlot(this, DAY, day);
  SetSlot(this, HOUR, hour);
  SetSlot(this, MINUTE, minute);
  SetSlot(this, SECOND, second);
  SetSlot(this, MILLISECOND, millisecond);
  SetSlot(this, MICROSECOND, microsecond);
  SetSlot(this, NANOSECOND, nanosecond);
}
Object.defineProperties(DateTime.prototype, {
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
  hour: {
    get: function() {
      return GetSlot(this, HOUR);
    },
    enumerable: true,
    configurable: true
  },
  minute: {
    get: function() {
      return GetSlot(this, MINUTE);
    },
    enumerable: true,
    configurable: true
  },
  second: {
    get: function() {
      return GetSlot(this, SECOND);
    },
    enumerable: true,
    configurable: true
  },
  millisecond: {
    get: function() {
      return GetSlot(this, MILLISECOND);
    },
    enumerable: true,
    configurable: true
  },
  microsecond: {
    get: function() {
      return GetSlot(this, MICROSECOND);
    },
    enumerable: true,
    configurable: true
  },
  nanosecond: {
    get: function() {
      return GetSlot(this, NANOSECOND);
    },
    enumerable: true,
    configurable: true
  },
  dayOfWeek: {
    get: function() {
      return ES.DayOfWeek(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
    },
    enumerable: true,
    configurable: true
  },
  dayOfYear: {
    get: function() {
      return ES.DayOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
    },
    enumerable: true,
    configurable: true
  },
  weekOfYear: {
    get: function() {
      return ES.WeekOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
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
      return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
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
DateTime.prototype.with = function(dateTimeLike = {}, disambiguation = 'constrain') {
  const {
    year = GetSlot(this, YEAR),
    month = GetSlot(this, MONTH),
    day = GetSlot(this, DAY),
    hour = GetSlot(this, HOUR),
    minute = GetSlot(this, MINUTE),
    second = GetSlot(this, SECOND),
    millisecond = GetSlot(this, MILLISECOND),
    microsecond = GetSlot(this, MICROSECOND),
    nanosecond = GetSlot(this, NANOSECOND)
  } = dateTimeLike;
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
};
DateTime.prototype.plus = function plus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
  ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ));
  day += days;
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
};
DateTime.prototype.minus = function minus(durationLike = {}, disambiguation = 'constrain') {
  const duration = ES.CastToDuration(durationLike);
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
  let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
  ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
  ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ));
  day += days;
  ({ year, month, day } = ES.BalanceDate(year, month, day));
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
};
DateTime.prototype.difference = function difference(other, disambiguation = 'constrain') {
  const [one, two] = [this, other].sort(DateTime.compare);
  let years = two.year - one.year;

  let days = ES.DayOfYear(two.year, two.month, two.day) - ES.DayOfYear(one.year, one.month, one.day);
  if (days < 0) {
    years -= 1;
    days = (ES.LeapYear(two.year) ? 366 : 365) + days;
  }
  if (disambiguation === 'constrain' && month === 2 && ES.LeapYear(one.year) && !ES.LeapYear(one.year + years))
    days + 1;

  let hours = two.hour - one.hour;
  let minutes = two.minute - one.minute;
  let seconds = two.second - one.second;
  let milliseconds = two.millisecond - one.millisecond;
  let microseconds = two.microsecond - one.microsecond;
  let nanoseconds = two.nanosecond - one.nanosecond;
  let deltaDays = 0;
  ({
    days: deltaDays,
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds,
    microsecond: microseconds,
    nanosecond: nanoseconds
  } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
  days += deltaDays;
  if (days < 0) {
    years -= 1;
    days += ES.DaysInMonth(two.year, two.month);
  }
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  return new Duration(years, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
};
DateTime.prototype.toString = DateTime.prototype.toJSON = function toString() {
  let year = ES.ISOYearString(GetSlot(this, YEAR));
  let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
  let day = ES.ISODateTimePartString(GetSlot(this, DAY));
  let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
  let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
  let second = ES.ISOSecondsString(
    GetSlot(this, SECOND),
    GetSlot(this, MILLISECOND),
    GetSlot(this, MICROSECOND),
    GetSlot(this, NANOSECOND)
  );
  let resultString = `${year}-${month}-${day}T${hour}:${minute}${second ? `:${second}` : ''}`;
  return resultString;
};
DateTime.prototype.toLocaleString = function toLocaleString(...args) {
  return new Intl.DateTimeFormat(...args).format(this);
};

DateTime.prototype.inZone = function inZone(timeZoneParam = 'UTC', disambiguation = 'earlier') {
  let timeZone = ES.ToTimeZone(timeZoneParam);
  return timeZone.getAbsoluteFor(this, disambiguation);
};
DateTime.prototype.getDate = function getDate() {
  const Date = ES.GetIntrinsic('%Temporal.Date%');
  return new Date(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
};
DateTime.prototype.getYearMonth = function getYearMonth() {
  const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
  return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
};
DateTime.prototype.getMonthDay = function getMonthDay() {
  const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
  return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
};
DateTime.prototype.getTime = function getTime() {
  const Time = ES.GetIntrinsic('%Temporal.Time%');
  return new Time(
    GetSlot(this, HOUR),
    GetSlot(this, MINUTE),
    GetSlot(this, SECOND),
    GetSlot(this, MILLISECOND),
    GetSlot(this, MICROSECOND),
    GetSlot(this, NANOSECOND)
  );
};

DateTime.fromString = function fromString(isoStringParam) {
  const isoString = ES.ToString(isoStringParam);
  const match = DATETIME.exec(isoString);
  if (!match) throw new RangeError('invalid datetime string');
  const year = ES.ToInteger(match[1]);
  const month = ES.ToInteger(match[2]);
  const day = ES.ToInteger(match[3]);
  const hour = ES.ToInteger(match[4]);
  const minute = ES.ToInteger(match[5]);
  const second = match[6] ? ES.ToInteger(match[6]) : 0;
  const millisecond = match[7] ? ES.ToInteger(match[7]) : 0;
  const microsecond = match[8] ? ES.ToInteger(match[8]) : 0;
  const nanosecond = match[9] ? ES.ToInteger(match[9]) : 0;
  return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
};
DateTime.compare = function compare(one, two) {
  if (one.year !== two.year) return one.year - two.year;
  if (one.month !== two.month) return one.month - two.month;
  if (one.day !== two.day) return one.day - two.day;
  if (one.hour !== two.hour) return one.hour - two.hour;
  if (one.minute !== two.minute) return one.minute - two.minute;
  if (one.second !== two.second) return one.second - two.second;
  if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
  if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
  if (one.nanosecond !== two.nanosecond) return one.nanosecond - two.nanosecond;
  return 0;
};
Object.defineProperty(DateTime.prototype, Symbol.toStringTag, {
  value: 'Temporal.DateTime'
});
