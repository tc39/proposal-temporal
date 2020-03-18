import { ES } from './ecmascript.mjs';
import { MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  YEAR,
  MONTH,
  DAY,
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

export class DateTime {
  constructor(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    hour = ES.ToInteger(hour);
    minute = ES.ToInteger(minute);
    second = ES.ToInteger(second);
    millisecond = ES.ToInteger(millisecond);
    microsecond = ES.ToInteger(microsecond);
    nanosecond = ES.ToInteger(nanosecond);
    ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    CreateSlots(this);
    SetSlot(this, YEAR, year);
    SetSlot(this, MONTH, month);
    SetSlot(this, DAY, day);
    SetSlot(this, HOUR, hour);
    SetSlot(this, MINUTE, minute);
    SetSlot(this, SECOND, second);
    SetSlot(this, MILLISECOND, millisecond);
    SetSlot(this, MICROSECOND, microsecond);
    SetSlot(this, NANOSECOND, nanosecond);
  }
  get year() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, YEAR);
  }
  get month() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MONTH);
  }
  get day() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, DAY);
  }
  get hour() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, HOUR);
  }
  get minute() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MINUTE);
  }
  get second() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, SECOND);
  }
  get millisecond() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MILLISECOND);
  }
  get microsecond() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, MICROSECOND);
  }
  get nanosecond() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, NANOSECOND);
  }
  get dayOfWeek() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DayOfWeek(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get dayOfYear() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DayOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get weekOfYear() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.WeekOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get daysInYear() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get daysInMonth() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get isLeapYear() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateTimeLike, options) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToDisambiguation(options);
    const props = ES.ValidPropertyBag(dateTimeLike, [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond'
    ]);
    if (!props) {
      throw new RangeError('invalid date-time-like');
    }
    let {
      year = GetSlot(this, YEAR),
      month = GetSlot(this, MONTH),
      day = GetSlot(this, DAY),
      hour = GetSlot(this, HOUR),
      minute = GetSlot(this, MINUTE),
      second = GetSlot(this, SECOND),
      millisecond = GetSlot(this, MILLISECOND),
      microsecond = GetSlot(this, MICROSECOND),
      nanosecond = GetSlot(this, NANOSECOND)
    } = props;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(durationLike, options) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticDisambiguation(options);
    const duration = ES.ToLimitedDuration(durationLike);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    day += deltaDays;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(durationLike, options) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const disambiguation = ES.ToArithmeticDisambiguation(options);
    const duration = ES.ToLimitedDuration(durationLike);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    ));
    days -= deltaDays;
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      disambiguation
    ));
    const Construct = ES.SpeciesConstructor(this, DateTime);
    const result = new Construct(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (!ES.IsDateTime(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    if (!ES.IsDateTime(other)) throw new TypeError('invalid DateTime object');
    const largestUnit = ES.ToLargestTemporalUnit(options, 'days');
    const [smaller, larger] = [this, other].sort(DateTime.compare);
    let { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      smaller,
      larger
    );
    let { year, month, day } = larger;
    day += deltaDays;
    ({ year, month, day } = ES.BalanceDate(year, month, day));

    let dateLargestUnit = 'days';
    if (largestUnit === 'years' || largestUnit === 'months') {
      dateLargestUnit = largestUnit;
    }

    let { years, months, days } = ES.DifferenceDate(smaller, { year, month, day }, dateLargestUnit);

    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit
    ));

    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  toString() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    let year = ES.ISOYearString(GetSlot(this, YEAR));
    let month = ES.ISODateTimePartString(GetSlot(this, MONTH));
    let day = ES.ISODateTimePartString(GetSlot(this, DAY));
    let hour = ES.ISODateTimePartString(GetSlot(this, HOUR));
    let minute = ES.ISODateTimePartString(GetSlot(this, MINUTE));
    let second = ES.ISOSecondsString(
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND)
    );
    let resultString = `${year}-${month}-${day}T${hour}:${minute}${second ? `:${second}` : ''}`;
    return resultString;
  }
  toLocaleString(...args) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    return new Intl.DateTimeFormat(...args).format(this);
  }

  inTimeZone(timeZoneParam = 'UTC', options) {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const timeZone = ES.ToTimeZone(timeZoneParam);
    const disambiguation = ES.ToTimeZoneDisambiguation(options);
    return timeZone.getAbsoluteFor(this, { disambiguation });
  }
  getDate() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  getYearMonth() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
    return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  getMonthDay() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  getTime() {
    if (!ES.IsDateTime(this)) throw new TypeError('invalid receiver');
    const Time = ES.GetIntrinsic('%Temporal.Time%');
    return new Time(
      GetSlot(this, HOUR),
      GetSlot(this, MINUTE),
      GetSlot(this, SECOND),
      GetSlot(this, MILLISECOND),
      GetSlot(this, MICROSECOND),
      GetSlot(this, NANOSECOND)
    );
  }

  static from(arg, options = undefined) {
    const disambiguation = ES.ToDisambiguation(options);
    let result = ES.ToDateTime(arg, disambiguation);
    if (this === DateTime) return result;
    return new this(
      GetSlot(result, YEAR),
      GetSlot(result, MONTH),
      GetSlot(result, DAY),
      GetSlot(result, HOUR),
      GetSlot(result, MINUTE),
      GetSlot(result, SECOND),
      GetSlot(result, MILLISECOND),
      GetSlot(result, MICROSECOND),
      GetSlot(result, NANOSECOND)
    );
  }
  static compare(one, two) {
    if (!ES.IsDateTime(one) || !ES.IsDateTime(two)) throw new TypeError('invalid DateTime object');
    if (one.year !== two.year) return ES.ComparisonResult(one.year - two.year);
    if (one.month !== two.month) return ES.ComparisonResult(one.month - two.month);
    if (one.day !== two.day) return ES.ComparisonResult(one.day - two.day);
    if (one.hour !== two.hour) return ES.ComparisonResult(one.hour - two.hour);
    if (one.minute !== two.minute) return ES.ComparisonResult(one.minute - two.minute);
    if (one.second !== two.second) return ES.ComparisonResult(one.second - two.second);
    if (one.millisecond !== two.millisecond) return ES.ComparisonResult(one.millisecond - two.millisecond);
    if (one.microsecond !== two.microsecond) return ES.ComparisonResult(one.microsecond - two.microsecond);
    if (one.nanosecond !== two.nanosecond) return ES.ComparisonResult(one.nanosecond - two.nanosecond);
    return ES.ComparisonResult(0);
  }
}
DateTime.prototype.toJSON = DateTime.prototype.toString;

MakeIntrinsicClass(DateTime, 'Temporal.DateTime');
