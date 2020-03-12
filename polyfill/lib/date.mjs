import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  YEAR,
  MONTH,
  DAY,
  CreateSlots,
  GetSlot,
  SetSlot,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS,
} from './slots.mjs';

export class Date {
  constructor(year, month, day) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    ES.RejectDate(year, month, day);
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
  get isLeapYear() {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, options) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToDisambiguation(options);
    const props = ES.ValidPropertyBag(dateLike, ['year', 'month', 'day']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH), day = GetSlot(this, DAY) } = props;
    const result = ES.ToDate({ year, month, day }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, Date);
    return Construct === Date ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
    );
  }
  plus(durationLike = {}, options) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticDisambiguation(options);
    const duration = ES.ToLimitedDuration(durationLike, [HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS]);
    let { year, month, day } = this;
    const { years, months, days } = duration;
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    const result = ES.ToDate({ year, month, day }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, Date);
    return Construct === Date ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
    );
  }
  minus(durationLike = {}, options) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticDisambiguation(options);
    const duration = ES.ToLimitedDuration(durationLike, [HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS]);
    let { year, month, day } = this;
    const { years, months, days } = duration;
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    const result = ES.ToDate({ year, month, day }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, Date);
    return Construct === Date ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
    );
  }
  difference(other, options) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsDate(other)) throw new TypeError('invalid Date object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days', ['hours', 'minutes', 'seconds']);
    const [smaller, larger] = [this, other].sort(Date.compare);
    const { years, months, days } = ES.DifferenceDate(smaller, larger, largestUnit);
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
  withTime(timeLike) {
    if (!ES.IsDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const day = GetSlot(this, DAY);
    timeLike = ES.ToTime(timeLike, 'reject');
    const { hour, minute, second, millisecond, microsecond, nanosecond } = timeLike;
    const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
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
  static from(arg, options = undefined) {
    const disambiguation = ES.ToDisambiguation(options);
    let result = ES.ToDate(arg, disambiguation);
    return this === Date ? result : new this(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
    );
  }
  static compare(one, two) {
    if (!ES.IsDate(one) || !ES.IsDate(two)) throw new TypeError('invalid Date object');
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
Date.prototype.toJSON = Date.prototype.toString;

MakeIntrinsicClass(Date, 'Temporal.Date');
