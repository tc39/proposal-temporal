import { ES } from './ecmascript.mjs';
import { MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { monthday as RAW } from './regex.mjs';
const DATE = new RegExp(`^${RAW.source}$`);

export class MonthDay {
  constructor(month, day, disambiguation) {
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

  get month() {
    return GetSlot(this, MONTH);
  }
  get day() {
    return GetSlot(this, DAY);
  }

  with(dateLike = {}, disambiguation = 'constrain') {
    const { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = dateTimeLike;
    return new MonthDay(month, day, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration')(durationLike);
    let { month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (
      years !== 0 ||
      hours !== 0 ||
      minutes !== 0 ||
      seconds !== 0 ||
      milliseconds !== 0 ||
      microseconds !== 0 ||
      nanoseconds !== 0
    )
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    ({ month, day } = ES.BalanceDate(1970, month, day));
    return new MonthDay(month, day);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration')(durationLike);
    let { year, month, day } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    if (hours !== 0 || minutes !== 0 || seconds !== 0 || milliseconds !== 0 || microseconds !== 0 || nanoseconds !== 0)
      throw new RangeError('invalid duration');
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return new MonthDay(month, day);
  }
  difference(other, disambiguation = 'constrain') {
    other = ES.GetIntrinsic('%Temporal.monthday')(other);
    const [one, two] = [this, other].sort(MonthDay.compare);
    let months = two.month - one.month;
    let days = (two.days = one.days);
    if (days < 0) {
      days = ES.DaysInMonth(1970, two.month) + days;
      months -= 1;
    }
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, months, days, 0, 0, 0, 0, 0, 0);
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
  withYear(year) {
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day);
  }

  static fromString(isoStringParam) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid monthday: ${isoString}`);
    const month = ES.ToInteger(match[1]);
    const day = ES.ToInteger(match[2]);
    return new ES.GetIntrinsic('%Temporal.MonthDay%')(month, day, 'reject');
  }
  static from(...args) {
    return ES.GetIntrinsic('%Temporal.monthday%')(...args);
  }
  static compare(one, two) {
    one = ES.GetIntrinsic('%Temporal.monthday')(one);
    two = ES.GetIntrinsic('%Temporal.monthday')(two);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;
if ('undefined' !== typeof Symbol) {
  Object.defineProperty(MonthDay.prototype, Symbol.toStringTag, {
    value: 'Temporal.MonthDay'
  });
}
ES.MakeInstrinsicClass(MonthDay);
