import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { YEAR, MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { date as STRING } from './regex.mjs';

export class Date {
  constructor(year, month, day, disambiguation) {
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
  get year() {
    return GetSlot(this, YEAR);
  }
  get month() {
    return GetSlot(this, MONTH);
  }
  get day() {
    return GetSlot(this, DAY);
  }
  get dayOfWeek() {
    return ES.DayOfWeek(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get dayOfYear() {
    return ES.DayOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get weekOfYear() {
    return ES.WeekOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get daysInYear() {
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get daysInMonth() {
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get leapYear() {
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateLike;
    return new Date(year, month, day, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.CastDuration(durationLike);
    let { year, month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    return new Date(year, month, day);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.CastDuration(durationLike);
    let { year, month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (hours !== 0 || minutes !== 0 || seconds !== 0 || milliseconds !== 0 || microseconds !== 0 || nanoseconds !== 0)
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    return new Date(year, month, day);
  }
  difference(other) {
    other = ES.CastDate(other);
    const [smaller, larger] = [this, other].sort(Date.compare);
    const { years, months, days } = ES.DifferenceDate(smaller, larger);
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, days, 0, 0, 0, 0, 0, 0);
  }
  toString() {
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${year}-${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withTime(timeLike, disambiguation = 'constrain') {
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    timeLike = ES.CastTime(timeLike);
    const { hour, minute, second, millisecond, microsecond, nanosecond } = timeLike;
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }
  getYearMonth() {
    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
    return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  getMonthDay() {
    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
  }

  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid date: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const day = ES.ToInteger(match[3]);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day, 'reject');
  }
  static from(...args) {
    return ES.CastDate(...args);
  }
  static compare(one, two) {
    one = ES.CastDate(one);
    two = ES.CastDate(two);
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
Date.prototype.toJSON = Date.prototype.toString;

if ('undefined' !== typeof Symbol) {
  Object.defineProperty(Date.prototype, Symbol.toStringTag, {
    value: 'Temporal.Date'
  });
}

MakeIntrinsicClass(Date);
