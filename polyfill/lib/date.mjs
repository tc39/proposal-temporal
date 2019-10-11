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
    return ES.DaysInMonth(GetSlot(this, THIS).year, GetSlot(this, MONTH));
  }
  get leapYear() {
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
    return new Date(year, month, day, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (hours || minutes || seconds || milliseconds || microseconds || nanoseconds)
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return new Date(year, month, day);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (hours !== 0 || minutes !== 0 || seconds !== 0 || milliseconds !== 0 || microseconds !== 0 || nanoseconds !== 0)
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return new Date(year, month, day);
  }
  difference(other, disambiguation = 'constrain') {
    other = ES.GetIntrinsic('%Temporal.date%')(other);
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
    timeLike = ES.GetIntrinsic('%Temporal.time%')(timeLike);
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

  static fromString(isoStringParam) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid date: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const day = ES.ToInteger(match[3]);
    return new ES.GetIntrinsic('%Temporal.Date%')(year, month, day, 'reject');
  }
  static from(...args) {
    return ES.GetIntrinsic('%Temporal.date%')(...args);
  }
  static compare(one, two) {
    one = ES.GetIntrinsic('%Temporal.date%')(one);
    two = ES.GetIntrinsic('%Temporal.date%')(two);
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
