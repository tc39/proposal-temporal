import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { YEAR, MONTH, DAY, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

import { date as STRING } from './regex.mjs';

export class Date {
  constructor(year, month, day, disambiguation = 'constrain') {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    disambiguation = ES.ToString(disambiguation);
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, day);
        break;
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
      case 'balance':
        ({ year, month, day } = ES.BalanceDate(year, month, day));
        break;
      default:
        throw new TypeError('disambiguation should be either reject, constrain or balance');
    }

    CreateSlots(this);
    SetSlot(this, YEAR, year);
    SetSlot(this, MONTH, month);
    SetSlot(this, DAY, day);
  }
  get year() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEAR);
  }
  get month() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get day() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAY);
  }
  get dayOfWeek() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.DayOfWeek(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get dayOfYear() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.DayOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get weekOfYear() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.WeekOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get daysInYear() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get daysInMonth() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get leapYear() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const props = ES.ValidPropertyBag(dateLike, ['year', 'month', 'day']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    const Construct = ES.SpeciesConstructor(this, Date);
    return new Construct(year, month, day, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToDuration(durationLike);
    if (!ES.ValidDuration(duration, ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'])) {
      throw new RangeError('invalid duration');
    }
    let { year, month, day } = this;
    const { years, months, days } = duration;
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    const Construct = ES.SpeciesConstructor(this, Date);
    return new Construct(year, month, day);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const duration = ES.ToDuration(durationLike);
    if (!ES.ValidDuration(duration, ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'])) {
      throw new RangeError('invalid duration');
    }
    let { year, month, day } = this;
    const { years, months, days } = duration;
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    const Construct = ES.SpeciesConstructor(this, Date);
    return new Construct(year, month, day);
  }
  difference(other) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    other = ES.ToDate(other);
    const [smaller, larger] = [this, other].sort(Date.compare);
    const { years, months, days } = ES.DifferenceDate(smaller, larger);
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, days, 0, 0, 0, 0, 0, 0);
  }
  toString() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let resultString = `${year}-${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withTime(timeLike, disambiguation = 'constrain') {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    timeLike = ES.ToTime(timeLike);
    const { hour, minute, second, millisecond, microsecond, nanosecond } = timeLike;
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }
  getYearMonth() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
    return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  getMonthDay() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  static from(arg) {
    let result = ES.ToDate(arg);
    return this === Date ? result : new this(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
      'reject'
    );
  }
  static compare(one, two) {
    one = ES.ToDate(one);
    two = ES.ToDate(two);
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
Date.prototype.toJSON = Date.prototype.toString;

MakeIntrinsicClass(Date, 'Temporal.Date');
