import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { YEAR, MONTH, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { yearmonth as STRING } from './regex.mjs';

export class YearMonth {
  constructor(year, month, disambiguation = 'constrain') {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, 1);
        break;
      case 'constrain':
        ({ year, month } = ES.ConstrainDate(year, month, 1));
        break;
      case 'balance':
        ({ year, month } = ES.BalanceYearMonth(year, month));
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
    }
    CreateSlots(this);
    SetSlot(this, YEAR, year);
    SetSlot(this, MONTH, month);
  }
  get year() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEAR);
  }
  get month() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get daysInMonth() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get leapYear() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    const props = ES.ValidPropertyBag(dateLike, ['year', 'month']);
    if (!props) {
      throw new RangeError('invalid year-month-like');
    }
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH) } = props;
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return new Construct(year, month, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (
      !ES.ValidDuration(duration, [
        'days',
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
    let { year, month } = this;
    const { years, months } = duration;
    ({ year, month } = ES.AddDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return new Construct(year, month);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    const duration = ES.CastDuration(durationLike);
    if (
      !ES.ValidDuration(duration, [
        'days',
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
    let { year, month } = this;
    const { years, months } = duration;
    ({ year, month } = ES.SubtractDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return new Construct(year, month);
  }
  difference(other) {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    other = ES.CastYearMonth(other);
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
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let resultString = `${year}-${month}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withDay(day, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day, disambiguation);
  }

  static fromString(isoString) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid yearmonth: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const Construct = this;
    return new Construct(year, month, 'reject');
  }
  static from(...args) {
    const result = ES.CastYearMonth(...args);
    return this === YearMonth ? result : new this(result.year, result.month);
  }
  static compare(one, two) {
    one = ES.CastYearMonth(one);
    two = ES.CastYearMonth(two);
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    return ES.ComparisonResult(0);
  }
}
YearMonth.prototype.toJSON = YearMonth.prototype.toString;

MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');
