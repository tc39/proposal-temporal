import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { YEAR, MONTH, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { yearmonth as STRING } from './regex.mjs';

export class YearMonth {
  constructor(year, month, disambiguation) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    ({ year, month } = ES.ConstrainDate(year, month, 1));
    switch (disambiguation) {
      case 'constrain':
        ({ year, month } = ES.ConstrainDate(year, month, 1));
        break;
      case 'balance':
        ({ year, month } = ES.BalanceYearMonth(year, month));
        break;
      default:
        ES.RejectDate(year, month, 1);
    }
    CreateSlots(this);
    SetSlot(this, YEAR, year);
    SetSlot(this, MONTH, month);
  }
  get year() {
    return GetSlot(this, YEAR);
  }
  get month() {
    return GetSlot(this, MONTH);
  }
  get daysInMonth() {
    return ES.DaysInMonth(GetSlot(this, THIS).year, GetSlot(this, MONTH));
  }
  get leapYear() {
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH) } = dateTimeLike;
    return new YearMonth(year, month, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if ((days, hours || minutes || seconds || milliseconds || microseconds || nanoseconds))
      throw new RangeError('invalid duration');
    ({ year, month } = ES.AddDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    return new YearMonth(year, month);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (
      days !== 0 ||
      hours !== 0 ||
      minutes !== 0 ||
      seconds !== 0 ||
      milliseconds !== 0 ||
      microseconds !== 0 ||
      nanoseconds !== 0
    )
      throw new RangeError('invalid duration');
    ({ year, month } = ES.SubtractDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    return new YearMonth(year, month);
  }
  difference(other) {
    other = ES.GetIntrinsic('%Temporal.yearmonth%')(other);
    const [one, two] = [this, other].sort(DateTime.compare);
    let years = two.year - one.year;
    let months = two.month - one.month;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months);
  }
  toString() {
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let resultString = `${year}-${month}`;
    return resultString;
  }
  toLocaleString(...args) {
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withDay(day, disambiguation = 'constrain') {
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day, disambiguation);
  }

  static fromString(isoStringParam) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid yearmonth: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    return new ES.GetIntrinsic('%Temporal.YearMonth%')(year, month, 'reject');
  }
  static from(...args) {
    return ES.GetIntrinsic('%Temporal.yearmonth%')(...args);
  }
  static compare(one, two) {
    one = ES.GetIntrinsic('%Temporal.yearmonth%')(one);
    two = ES.GetIntrinsic('%Temporal.yearmonth%')(two);
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    return ES.ComparisonResult(0);
  }
}
YearMonth.prototype.toJSON = YearMonth.prototype.toString;
if ('undefined' !== typeof Symbol) {
  Object.defineProperty(YearMonth.prototype, Symbol.toStringTag, {
    value: 'Temporal.YearMonth'
  });
}
MakeIntrinsicClass(YearMonth);
