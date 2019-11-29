import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { monthday as STRING } from './regex.mjs';

export class MonthDay {
  constructor(month, day, disambiguation = 'constrain') {
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    disambiguation = ES.ToString(disambiguation);
    const leapYear = 1972; // XXX #261 leap year
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(leapYear, month, day);
        break;
      case 'constrain':
        ({ month, day } = ES.ConstrainDate(leapYear, month, day));
        break;
      case 'balance':
        ({ month, day } = ES.BalanceDate(leapYear, month, day));
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
    }

    CreateSlots(this);
    SetSlot(this, MONTH, month);
    SetSlot(this, DAY, day);
  }

  get month() {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get day() {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAY);
  }

  with(dateLike, disambiguation = 'constrain') {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const props = ES.ValidPropertyBag(dateLike, ['month', 'day']);
    if (!props) {
      throw new RangeError('invalid month-day-like');
    }
    const { month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day, disambiguation);
  }
  plus(durationLike, disambiguation = 'constrain') {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToDuration(durationLike);
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
    const year = 1970; // XXX #261 non-leap year
    ({ month, day } = ES.AddDate(year, month, day, 0, months, days, disambiguation));
    ({ month, day } = ES.BalanceDate(year, month, day));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day);
  }
  minus(durationLike, disambiguation = 'constrain') {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToDuration(durationLike);
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
    const year = 1970; // XXX #261 non-leap year
    const { months, days } = duration;
    ({ month, day } = ES.SubtractDate(year, month, day, 0, months, days, disambiguation));
    ({ month, day } = ES.BalanceDate(year, month, day));
    const Construct = ES.SpeciesConstructor(this, MonthDay);
    return new Construct(month, day);
  }
  difference(other) {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    other = ES.ToMonthDay(other);
    const [one, two] = [this, other].sort(MonthDay.compare);
    let months = two.month - one.month;
    let days = two.days - one.days;
    if (days < 0) {
      months -= 1;
      let month = one.month + months;
      // XXX #261 leap days?
      days = ES.DaysInMonth(1970, month) + days;
    }
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(0, months, days, 0, 0, 0, 0, 0, 0);
  }
  toString() {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withYear(year, disambiguation = 'constrain') {
    if (!ES.IsMonthDay(this)) throw new TypeError('invalid receiver');
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day, disambiguation);
  }
  static from(arg) {
    let result = ES.ToMonthDay(arg);
    return this === MonthDay ? result : new this(
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
      'reject'
    );
  }
  static compare(one, two) {
    one = ES.ToMonthDay(one);
    two = ES.ToMonthDay(two);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
MonthDay.prototype.toJSON = MonthDay.prototype.toString;

MakeIntrinsicClass(MonthDay, 'Temporal.MonthDay');
