import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  YEAR,
  MONTH,
  CreateSlots,
  GetSlot,
  SetSlot,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS,
} from './slots.mjs';

export class YearMonth {
  constructor(year, month) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    ES.RejectYearMonth(year, month);
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
  get daysInYear() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get isLeapYear() {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateLike = {}, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    disambiguation = ES.ToDisambiguation(disambiguation);
    const props = ES.ValidPropertyBag(dateLike, ['year', 'month']);
    if (!props) {
      throw new RangeError('invalid year-month-like');
    }
    const { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH) } = props;
    const result = ES.ToYearMonth({ year, month }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return Construct === YearMonth ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
    );
  }
  plus(durationLike, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    disambiguation = ES.ToArithmeticDisambiguation(disambiguation);
    const duration = ES.ToLimitedDuration(durationLike, [DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS]);
    let { year, month } = this;
    const { years, months } = duration;
    ({ year, month } = ES.AddDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    const result = ES.ToYearMonth({ year, month }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return Construct === YearMonth ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
    );
  }
  minus(durationLike, disambiguation = 'constrain') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    disambiguation = ES.ToArithmeticDisambiguation(disambiguation);
    const duration = ES.ToLimitedDuration(durationLike, [DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS]);
    let { year, month } = this;
    const { years, months } = duration;
    ({ year, month } = ES.SubtractDate(year, month, 1, years, months, 0, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    const result = ES.ToYearMonth({ year, month }, disambiguation);
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    return Construct === YearMonth ? result : new Construct(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
    );
  }
  difference(other, largestUnit = 'years') {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsYearMonth(other)) throw new TypeError('invalid YearMonth object');
    largestUnit = ES.ToLargestTemporalUnit(largestUnit, ['days', 'hours', 'minutes', 'seconds']);
    const [one, two] = [this, other].sort(YearMonth.compare);
    let years = two.year - one.year;
    let months = two.month - one.month;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    if (largestUnit === 'months') {
      months += 12 * years;
      years = 0;
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
  withDay(day) {
    if (!ES.IsYearMonth(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day);
  }
  static from(arg, options) {
    const disambiguation = ES.GetOption(options, 'disambiguation', ES.ToDisambiguation, 'constrain');
    let result = ES.ToYearMonth(arg, disambiguation);
    return this === YearMonth ? result : new this(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
    );
  }
  static compare(one, two) {
    if (!ES.IsYearMonth(one) || !ES.IsYearMonth(two)) throw new TypeError('invalid YearMonth object');
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    return ES.ComparisonResult(0);
  }
}
YearMonth.prototype.toJSON = YearMonth.prototype.toString;

MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');
