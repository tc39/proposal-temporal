import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';
import { YEAR, MONTH, CreateSlots, GetSlot, SetSlot } from './slots.mjs';

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
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEAR);
  }
  get month() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get daysInMonth() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get daysInYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get isLeapYear() {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(temporalYearMonthLike = {}, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const props = ES.ToPartialRecord(temporalYearMonthLike, ['year', 'month']);
    if (!props) {
      throw new RangeError('invalid year-month-like');
    }
    let { year = GetSlot(this, YEAR), month = GetSlot(this, MONTH) } = props;
    ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = new Construct(year, month);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { year, month } = this;
    const { years, months, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    const { days } = ES.BalanceDuration(
      duration.days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    );
    ({ year, month } = ES.AddDate(year, month, 1, years, months, days, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = new Construct(year, month);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { year, month } = this;
    const { years, months, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    const { days } = ES.BalanceDuration(
      duration.days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'days'
    );
    const lastDay = ES.DaysInMonth(year, month);
    ({ year, month } = ES.SubtractDate(year, month, lastDay, years, months, days, disambiguation));
    ({ year, month } = ES.BalanceYearMonth(year, month));
    ({ year, month } = ES.RegulateYearMonth(year, month, disambiguation));
    const Construct = ES.SpeciesConstructor(this, YearMonth);
    const result = new Construct(year, month);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalYearMonth(other)) throw new TypeError('invalid YearMonth object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'years', ['days', 'hours', 'minutes', 'seconds']);
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
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let resultString = `${year}-${month}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withDay(day) {
    if (!ES.IsTemporalYearMonth(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, YEAR);
    const month = GetSlot(this, MONTH);
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(year, month, day);
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let result = ES.ToTemporalYearMonth(item, disambiguation);
    if (this === YearMonth) return result;
    return new this(GetSlot(result, YEAR), GetSlot(result, MONTH));
  }
  static compare(one, two) {
    if (!ES.IsTemporalYearMonth(one) || !ES.IsTemporalYearMonth(two)) throw new TypeError('invalid YearMonth object');
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    return ES.ComparisonResult(0);
  }
}
YearMonth.prototype.toJSON = YearMonth.prototype.toString;

MakeIntrinsicClass(YearMonth, 'Temporal.YearMonth');
