import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';
import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

export class Date {
  constructor(year, month, day) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    ES.RejectDate(year, month, day);
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, year);
    SetSlot(this, ISO_MONTH, month);
    SetSlot(this, ISO_DAY, day);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_YEAR);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_MONTH);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, ISO_DAY);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DayOfWeek(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY));
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DayOfYear(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY));
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.WeekOfYear(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY));
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, ISO_YEAR)) ? 366 : 365;
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH));
  }
  get isLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, ISO_YEAR));
  }
  with(temporalDateLike = {}, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToTemporalDisambiguation(options);
    const props = ES.ToPartialRecord(temporalDateLike, ['day', 'month', 'year']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    let { year = GetSlot(this, ISO_YEAR), month = GetSlot(this, ISO_MONTH), day = GetSlot(this, ISO_DAY) } = props;
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = new Construct(year, month, day);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { year, month, day } = this;
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
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = new Construct(year, month, day);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticTemporalDisambiguation(options);
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { year, month, day } = this;
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
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = new Construct(year, month, day);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days', ['hours', 'minutes', 'seconds']);
    const [smaller, larger] = [this, other].sort(Date.compare);
    const { years, months, days } = ES.DifferenceDate(smaller, larger, largestUnit);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, days, 0, 0, 0, 0, 0, 0);
  }
  toString() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, ISO_YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, ISO_MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, ISO_DAY));
    let resultString = `${year}-${month}-${day}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }
  withTime(temporalTime) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalTime(temporalTime)) throw new TypeError('invalid Temporal.Time object');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const hour = GetSlot(temporalTime, HOUR);
    const minute = GetSlot(temporalTime, MINUTE);
    const second = GetSlot(temporalTime, SECOND);
    const millisecond = GetSlot(temporalTime, MILLISECOND);
    const microsecond = GetSlot(temporalTime, MICROSECOND);
    const nanosecond = GetSlot(temporalTime, NANOSECOND);
    const DateTime = GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  getYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    return new YearMonth(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH));
  }
  getMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    return new MonthDay(GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY));
  }
  getFields() {
    const fields = ES.ToRecord(this, [['day'], ['month'], ['year']]);
    if (!fields) throw new TypeError('invalid receiver');
    return fields;
  }
  static from(item, options = undefined) {
    const disambiguation = ES.ToTemporalDisambiguation(options);
    let year, month, day;
    if (typeof item === 'object' && item) {
      if (ES.IsTemporalDate(item)) {
        year = GetSlot(item, ISO_YEAR);
        month = GetSlot(item, ISO_MONTH);
        day = GetSlot(item, ISO_DAY);
      } else {
        // Intentionally alphabetical
        ({ year, month, day } = ES.ToRecord(item, [['day'], ['month'], ['year']]));
      }
    } else {
      ({ year, month, day } = ES.ParseTemporalDateString(ES.ToString(item)));
    }
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    const result = new this(year, month, day);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalDate(one) || !ES.IsTemporalDate(two)) throw new TypeError('invalid Date object');
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    return ES.ComparisonResult(0);
  }
}
Date.prototype.toJSON = Date.prototype.toString;

MakeIntrinsicClass(Date, 'Temporal.Date');
