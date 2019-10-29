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
      return Absolute.fromString(arg);
    } catch (ex) {}
  }
  if (Number.isFinite(arg)) return Absolute.fromEpochMilliseconds(+arg);
  throw RangeError(`invalid absolute value: ${arg}`);
}

export function CastDateTime(arg, aux) {
  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
  if (HasSlot(arg, YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND)) {
    return arg;
  }
  if (HasSlot(arg, EPOCHNANOSECONDS)) return arg.inZone(aux);
  if (HasSlot(arg, YEAR, MONTH, DAY) && HasSlot(aux, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND)) {
    return new DateTime(
      GetSlot(arg, YEAR),
      GetSlot(arg, MONTH),
      GetSlot(arg, DAY),
      GetSlot(aux, HOUR),
      GetSlot(aux, MINUTE),
      GetSlot(aux, SECOND),
      GetSlot(aux, MILLISECOND),
      GetSlot(aux, MICROSECOND),
      GetSlot(aux, NANOSECOND)
    );
  }
  if (HasSlot(aux, YEAR, MONTH, DAY) && HasSlot(arg, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND)) {
    return new DateTime(
      GetSlot(aux, YEAR),
      GetSlot(aux, MONTH),
      GetSlot(aux, DAY),
      GetSlot(arg, HOUR),
      GetSlot(arg, MINUTE),
      GetSlot(arg, SECOND),
      GetSlot(arg, MILLISECOND),
      GetSlot(arg, MICROSECOND),
      GetSlot(arg, NANOSECOND)
    );
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
      return DateTime.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg)) return CastAbsolute(arg).inZone(aux);
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
      return Date.fromString(arg);
    } catch (ex) {}
  }
  const props = ES.ValidPropertyBag(arg, ['year', 'month', 'day']);
  if (props) {
    const { year, month, day } = props;
    return new Date(year, month, day);
  }
  throw new RangeError(`invalid date ${arg}`);
}

export function CastTime(arg, aux) {
  const Time = ES.GetIntrinsic('%Temporal.Time%');
  if ('string' === typeof arg) {
    return Time.fromString(arg);
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
  if (HasSlot(arg, YEAR, MONTH)) {
    if (!HasSlot(arg, DAY)) return arg;
    return new YearMonth(GetSlot(arg, year), GetSlot(arg, MONTH));
  }
  if ('string' === typeof arg) {
    try {
      return YearMonth.fromString(arg);
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
  if (HasSlot(arg, MONTH, DAY)) {
    if (!HasSlot(arg, YEAR)) return arg;
    return new MonthDay(GetSlot(arg, MONTH), GetSlot(arg, DAY));
  }
  if ('string' === typeof arg) {
    try {
      return MonthDay.fromString(arg);
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
      return Duration.fromString(arg);
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
