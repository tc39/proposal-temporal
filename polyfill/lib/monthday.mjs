import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { monthday as STRING } from './regex.mjs';

export class MonthDay {
  constructor(month, day, disambiguation = 'constrain') {
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(1970, month, day);
        break;
      case 'constrain':
        ({ month, day } = ES.ConstrainDate(1970, month, day));
        break;
      case 'balance':
        ({ month, day } = ES.BalanceDate(1970, month, day));
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
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
    const props = ES.ValidPropertyBag(dateLike, ['month', 'day']);
    if (!props) {
      throw new RangeError('invalid month-day-like');
    }
    const { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.CastDuration(durationLike);
    if (
      !ES.ValidDuration(duration, [
        'years',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds'
      ])
    ) {
      throw new RangeError('invalid duration');
    }
    let { month, day } = this;
    const { months, days } = duration;
    const year = 1970; // non-leap year
    ({ month, day } = ES.AddDate(year, month, day, 0, months, days, disambiguation));
    ({ month, day } = ES.BalanceDate(year, month, day));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.CastDuration(durationLike);
    if (
      !ES.ValidDuration(duration, [
        'years',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds'
      ])
    ) {
      throw new RangeError('invalid duration');
    }
    let { month, day } = this;
    const year = 1970; // non-leap year (any will do)
    const { months, days } = duration;
    ({ month, day } = ES.SubtractDate(year, month, day, 0, months, days, disambiguation));
    ({ month, day } = ES.BalanceDate(year, month, day));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day);
  }
  difference(other) {
    other = ES.CastMonthDay(other);
    const [one, two] = [this, other].sort(MonthDay.compare);
    let months = two.month - one.month;
    let days = two.days - one.days;
    let month = two.month;
    if (days < 0) {
      months -= 1;
      month = one.month + months;
      days = ES.DaysInMonth(1970, month) + days;
    }
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, months, days, 0, 0, 0, 0, 0, 0);
  }
  toString() {
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${month}-${day}`;
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

  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid monthday: ${isoString}`);
    const month = ES.ToInteger(match[1] || match[3]);
    const day = ES.ToInteger(match[2] || match[4]);
    const Construct = this;
    return new Construct(month, day, 'reject');
  }
  static from(...args) {
    const result = ES.CastYearMonth(...args);
    return this === MonthDay ? result : new this(result.month, result.day);
  }
  static compare(one, two) {
    one = ES.CastMonthDay(one);
    two = ES.CastMonthDay(two);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
