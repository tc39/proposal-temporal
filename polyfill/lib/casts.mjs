import { ES } from './ecmascript.mjs';
import {
  GetSlot,
  HasSlot,
  IDENTIFIER,
  EPOCHNANOSECONDS,
  YEAR,
  MONTH,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  YEARS,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS
} from './slots.mjs';
import { time as TIMESTRING } from './regex.mjs';

export function CastAbsolute(arg, aux) {
  const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
  if (HasSlot(arg, EPOCHNANOSECONDS)) {
    return arg;
  }
  if (HasSlot(arg, YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND)) {
    const tz = CastTimeZone(aux);
    return tz.getAbsoluteFor(arg);
  }
  if ('bigint' === typeof arg) return new Absolute(arg);
  if ('string' === typeof arg) {
    try {
      return Absolute.from(arg);
    } catch (ex) {}
  }
  if (Number.isFinite(arg)) return Absolute.fromEpochMilliseconds(+arg);
  throw RangeError(`invalid absolute value: ${arg}`);
}

export function CastDateTime(arg, aux) {
  if ('string' === typeof arg) {
    return DateTime.from(arg);
  }
  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
  if (ES.IsDateTime(arg)) {
    return arg;
  }
  const props = ES.ValidPropertyBag(arg, [
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
  if (props) {
    const {
      year = 0,
      month = 1,
      day = 1,
      hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      microsecond = 0,
      nanosecond = 0
    } = props;
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, 'constrain');
  }
  if ('string' === typeof arg) {
    try {
      return DateTime.from(arg);
    } catch (ex) {}
  }
  throw new RangeError(`invalid datetime ${arg}`);
}

export function CastDate(arg, aux) {
  const Date = ES.GetIntrinsic('%Temporal.Date%');
  if (HasSlot(arg, YEAR, MONTH, DAY)) {
    if (!HasSlot(arg, HOUR)) return arg;
    return new Date(GetSlot(arg, YEAR), GetSlot(arg, MONTH), GetSlot(arg, DAY));
  }
  if ('string' === typeof arg) {
    try {
      return Date.from(arg);
    } catch (ex) {}
  }
  const props = ES.ValidPropertyBag(arg, ['year', 'month', 'day']);
  if (props) {
    const { year, month, day } = props;
    return new Date(year, month, day);
  }
  throw new RangeError(`invalid date ${arg}`);
}

export function TimeFromString(arg, Construct) {
  if (typeof arg !== 'string') {
    throw new TypeError('Internal error: wrong argument type for TimeFromString');
  }

  const match = TIMESTRING.exec(arg);
  if (!match) {
    throw new RangeError(`invalid time: ${isoString}`);
  }
  const hour = ES.ToInteger(match[1]);
  const minute = ES.ToInteger(match[2]);
  const second = ES.ToInteger(match[3]);
  const millisecond = ES.ToInteger(match[4]);
  const microsecond = ES.ToInteger(match[5]);
  const nanosecond = ES.ToInteger(match[6]);
  return new Construct(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
}

export function CastTime(arg, aux) {
  const Time = ES.GetIntrinsic('%Temporal.Time%');
  if ('string' === typeof arg) {
    return TimeFromString(arg, Time);
  }
  const props = ES.ValidPropertyBag(arg, ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond']);
  if (props) {
    const { hour, minute, second, millisecond, microsecond, nanosecond } = props;
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  throw RangeError(`invalid time value: ${arg}`);
}

export function CastYearMonth(arg, aux) {
  const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
  if (HasSlot(arg, YEAR, MONTH) && !HasSlot(arg, DAY)) {
    return arg;
  }
  if ('string' === typeof arg) {
    try {
      return YearMonth.from(arg);
    } catch (ex) {}
  }
  const props = ES.ValidPropertyBag(arg, ['year', 'month']);
  if (props) {
    const { year = 0, month = 1 } = props;
    return new YearMonth(year, month);
  }
  throw RangeError(`invalid yearmonth value: ${arg}`);
}

export function CastMonthDay(arg) {
  const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
  if (ES.IsYearMonth(arg)) {
    return arg;
  }
  if ('string' === typeof arg) {
    try {
      return MonthDay.from(arg);
    } catch (ex) {}
  }
  const props = ES.ValidPropertyBag(arg, ['month', 'day']);
  if (props) {
    const { month = 1, day = 1 } = arg;
    return new MonthDay(month, day);
  }
  throw RangeError(`invalid monthday value: ${arg}`);
}

export function CastDuration(arg) {
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  if (HasSlot(arg, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS)) {
    if (arg instanceof Duration) return arg;
  }
  if ('string' === typeof arg) {
    try {
      return Duration.from(arg);
    } catch (ex) {}
  }
  const props = ES.ValidPropertyBag(arg, [
    'years',
    'months',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
    'microseconds',
    'nanoseconds'
  ]);
  if (props) {
    const {
      years = 0,
      months = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
      microseconds = 0,
      nanoseconds = 0
    } = props;
    return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
  throw new RangeError(`invalid duration value ${arg}`);
}

export function CastTimeZone(arg) {
  const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
  if (HasSlot(arg, IDENTIFIER)) {
    return arg;
  }
  return new TimeZone(`${arg}`);
}
