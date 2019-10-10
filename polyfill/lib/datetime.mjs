import { ES } from './ecmascript.mjs';

import { datetime as STRING } from './regex.mjs';

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
  constructor(
    year,
    month,
    day,
    hour,
    minute,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0,
    disambiguation = 'constrain'
  ) {
    year = ES.ToInteger(year);
    month = ES.ToInteger(month);
    day = ES.ToInteger(day);
    hour = ES.ToInteger(hour);
    minute = ES.ToInteger(minute);
    second = ES.ToInteger(second);
    millisecond = ES.ToInteger(millisecond);
    microsecond = ES.ToInteger(microsecond);
    nanosecond = ES.ToInteger(nanosecond);
    switch (disambiguation) {
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        break;
      case 'balance':
        ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        ({ year, month, day } = ES.BalanceDate(year, month, day + days));
        break;
      default:
        ES.RejectDate(year, month, day);
        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    }

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
    return GetSlot(this, YEAR);
  }
  get month() {
    return GetSlot(this, MONTH);
  }
  get day() {
    return GetSlot(this, DAY);
  }
  get hour() {
    return GetSlot(this, HOUR);
  }
  get minute() {
    return GetSlot(this, MINUTE);
  }
  get second() {
    return GetSlot(this, SECOND);
  }
  get millisecond() {
    return GetSlot(this, MILLISECOND);
  }
  get microsecond() {
    return GetSlot(this, MICROSECOND);
  }
  get nanosecond() {
    return GetSlot(this, NANOSECOND);
  }
  get dayOfWeek() {
    return ES.DayOfWeek(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get dayOfYear() {
    return ES.DayOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get weekOfYear() {
    return ES.WeekOfYear(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  get daysInYear() {
    return ES.LeapYear(GetSlot(this, YEAR)) ? 366 : 365;
  }
  get daysInMonth() {
    return ES.DaysInMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  get leapYear() {
    return ES.LeapYear(GetSlot(this, YEAR));
  }
  with(dateTimeLike = {}, disambiguation = 'constrain') {
    const {
      year = GetSlot(this, YEAR),
      month = GetSlot(this, MONTH),
      day = GetSlot(this, DAY),
      hour = GetSlot(this, HOUR),
      minute = GetSlot(this, MINUTE),
      second = GetSlot(this, SECOND),
      millisecond = GetSlot(this, MILLISECOND),
      microsecond = GetSlot(this, MICROSECOND),
      nanosecond = GetSlot(this, NANOSECOND)
    } = dateTimeLike;
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation);
  }
  plus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ year, month, day } = ES.AddDate(year, month, day, years, months, days, disambiguation));
    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
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
    day += days;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(durationLike = {}, disambiguation = 'constrain') {
    const duration = ES.GetIntrinsic('%Temporal.duration%')(durationLike);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = this;
    let { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ year, month, day } = ES.SubtractDate(year, month, day, years, months, days, disambiguation));
    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.SubtractTime(
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
    day += days;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  difference(other, disambiguation = 'constrain') {
    other = ES.GetIntrinsic('%Temporal.datetime%')(other);
    const [one, two] = [this, other].sort(DateTime.compare);
    let years = two.year - one.year;

    let days = ES.DayOfYear(two.year, two.month, two.day) - ES.DayOfYear(one.year, one.month, one.day);
    if (days < 0) {
      years -= 1;
      days = (ES.LeapYear(two.year) ? 366 : 365) + days;
    }
    if (disambiguation === 'constrain' && month === 2 && ES.LeapYear(one.year) && !ES.LeapYear(one.year + years))
      days + 1;

    let hours = two.hour - one.hour;
    let minutes = two.minute - one.minute;
    let seconds = two.second - one.second;
    let milliseconds = two.millisecond - one.millisecond;
    let microseconds = two.microsecond - one.microsecond;
    let nanoseconds = two.nanosecond - one.nanosecond;
    let deltaDays = 0;
    ({
      days: deltaDays,
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: milliseconds,
      microsecond: microseconds,
      nanosecond: nanoseconds
    } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
    days += deltaDays;
    if (days < 0) {
      years -= 1;
      days += ES.DaysInMonth(two.year, two.month);
    }
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  toString() {
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
    return new Intl.DateTimeFormat(...args).format(this);
  }

  inZone(timeZoneParam = 'UTC', disambiguation = 'earlier') {
    const timeZone = ES.GetIntrinsic('%Temporal.timezone%')(timeZoneParam);
    return timeZone.getAbsoluteFor(this, disambiguation);
  }
  getDate() {
    const Date = ES.GetIntrinsic('%Temporal.Date%');
    return new Date(GetSlot(this, YEAR), GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  getYearMonth() {
    const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
    return new YearMonth(GetSlot(this, YEAR), GetSlot(this, MONTH));
  }
  getMonthDay() {
    const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
    return new MonthDay(GetSlot(this, MONTH), GetSlot(this, DAY));
  }
  getTime() {
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

  static fromString(isoStringParam) {
    isoString = ES.ToString(isoString);
    const match = STRING.exec(isoString);
    if (!match) throw new RangeError(`invalid datetime: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const day = ES.ToInteger(match[3]);
    const hour = ES.ToInteger(match[4]);
    const minute = ES.ToInteger(match[5]);
    const second = ES.ToInteger(match[6]);
    const millisecond = ES.ToInteger(match[7]);
    const microsecond = ES.ToInteger(match[8]);
    const nanosecond = ES.ToInteger(match[9]);
    return new ES.GetIntrinsic('%Temporal.DateTime%')(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'reject'
    );
  }
  static from(...args) {
    return ES.GetIntrinsic('%Temporal.datetime%')(...args);
  }
  static compare(one, two) {
    one = ES.GetIntrinsic('%Temporal.datetime%')(one);
    two = ES.GetIntrinsic('%Temporal.datetime%')(two);
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
if ('undefined' !== typeof Symbol) {
  Object.defineProperty(DateTime.prototype, Symbol.toStringTag, {
    value: 'Temporal.DateTime'
  });
}
ES.MakeInstrinsicClass(DateTime);
