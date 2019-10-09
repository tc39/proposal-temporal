import { ES } from './ecmascript.mjs';

export function absolute(arg) {
  const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
  if (arg instanceof Absolute) return arg;
  if ('bigint' === typeof arg) return new Absolute(arg);
  if ('string' === typeof arg) {
    try {
      return Absolute.fromString(arg);
    } catch (ex) {}
  }
  if (Number.isFinite(+arg)) return Absolute.fromEpochMilliseconds(+arg);
  throw RangeError(`invalid absolute value: ${arg}`);
}

export function datetime(arg, add) {
  const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
  if (arg instanceof DateTime) return arg;
  if ('string' === typeof arg) {
    try {
      return DateTime.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg)) return absolute(arg).inZone('UTC');
  if ('object' === typeof arg) {
    const { year, month, day } = time('object' === typeof add ? add : arg);
    const { hour, minute, second, millisecond, microsecond, nanosecond } = date(arg);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  throw new RangeError(`invalid datetime ${arg}`);
}

export function date(arg) {
  const Date = ES.GetIntrinsic('%Temporal.Date%');
  if (arg instanceof Date) return arg;
  if ('string' === typeof arg) {
    try {
      return Date.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
    return absolute(arg)
      .getDate()
      .inZone('UTC')
      .getDate();
  if ('object' === typeof arg) {
    const { year, month, day } = arg;
    return new Date(year, month, day);
  }
  throw new RangeError(`invalid date ${arg}`);
}

export function time(arg) {
  const Time = ES.GetIntrinsic('%Temporal.Time%');
  if (arg instanceof Time) return arg;
  if ('string' === typeof arg) {
    try {
      return Time.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
    return absolute(arg)
      .getDate()
      .inZone('UTC')
      .getTime();
  if ('object' === typeof arg) {
    const { hour, minute, second, millisecond, microsecond, nanosecond } = time(arg);
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
}

export function yearmonth(arg) {
  const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
  if (arg instanceof YearMonth) return arg;
  if ('string' === typeof arg) {
    try {
      return YearMonth.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
    return absolute(arg)
      .getDate()
      .inZone('UTC')
      .getYearMonth();
  if ('object' === typeof arg) {
    const { year, month } = arg;
    return new YearMonth(year, month);
  }
}

export function monthday(arg) {
  const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
  if (arg instanceof MonthDay) return arg;
  if ('string' === typeof arg) {
    try {
      return MonthDay.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg || 'number' === typeof arg || Number.isFinite(+arg))
    return absolute(arg)
      .getDate()
      .inZone('UTC')
      .getMonthDay();
  if ('object' === typeof arg) {
    const { month, day } = arg;
    return new MonthDay(month, day);
  }
}

export function duration(arg) {
  const Duration = ES.GetIntrinsic('%Temporal.Duration%');
  if (arg instanceof Duration) return arg;
  if ('string' === typeof arg) {
    try {
      return Duration.fromString(arg);
    } catch (ex) {}
  }
  if ('bigint' === typeof arg) return new Duration(0, 0, 0, 0, 0, 0, 0, 0, arg);
  if (Number.isFinite(+arg)) return new Duration(0, 0, 0, 0, 0, 0, +arg, 0, 0);
  if ('object' === typeof arg) {
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
    } = arg;
    return new Duration(years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }
}

export function timezone(arg) {
  const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
  if (arg instanceof TimeZone) return arg;
  return new TimeZone(`${arg}`);
}
