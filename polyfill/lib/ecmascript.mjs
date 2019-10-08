import ES2019 from 'es-abstract/es2019.js';

const IntlDateTimeFormat = Intl.DateTimeFormat;

import { DateTime as TemporalDateTime } from './datetime.mjs';
import { Date as TemporalDate } from './date.mjs';
import { YearMonth as TemporalYearMonth } from './yearmonth.mjs';
import { MonthDay as TemporalMonthDay } from './monthday.mjs';
import { Time as TemporalTime } from './time.mjs';
import { Absolute as Temporalabsolute } from './absolute.mjs';
import { TimeZone as TemporalTimeZone } from './timezone.mjs';
import { Duration as TemporalDuration } from './duration.mjs';

const DAYNANOS = 3600000000000n;

const INTRINSICS = {
  '%Temporal.DateTime%': TemporalDateTime,
  '%Temporal.Date%': TemporalDate,
  '%Temporal.YearMonth%': TemporalYearMonth,
  '%Temporal.MonthDay%': TemporalMonthDay,
  '%Temporal.Time%': TemporalTime,
  '%Temporal.TimeZone%': TemporalTimeZone,
  '%Temporal.Absolute%': Temporalabsolute,
  '%Temporal.Duration%': TemporalDuration
};

export const ES = Object.assign(Object.assign({}, ES2019), {
  GetIntrinsic: (intrinsic) => {
    return intrinsic in INTRINSICS ? INTRINSICS[intrinsic] : ES2019.GetIntrinsic(intrinsic);
  },

  ToTimeZone: (tz) => {
    const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
    return tz instanceof TimeZone ? tz : new TimeZone(`${tz}`);
  },
  ISOTimeZoneString: (timeZone, absolute) => {
    let offset = timeZone.getOffsetFor(absolute);
    let timeZoneString;
    switch (true) {
      case 'UTC' === timeZone.name:
        timeZoneString = 'Z';
        break;
      case timeZone.name === offset:
        timeZoneString = offset;
        break;
      default:
        timeZoneString = `${offset}[${timeZone.name}]`;
        break;
    }
    return timeZoneString;
  },
  ISOYearString: (year) => {
    let yearString;
    if (year < 1000 || year > 9999) {
      let sign = year < 0 ? '-' : '+';
      let yearNumber = Math.abs(year);
      yearString = sign + `000000${yearNumber}`.slice(-6);
    } else {
      yearString = `${year}`;
    }
    return yearString;
  },
  ISODateTimePartString: (part) => `00${part}`.slice(-2),
  ISOSecondsString: (seconds, millis, micros, nanos) => {
    if (!seconds && !millis && !micros && !nanos) return '';

    let parts = [];
    if (nanos) parts.unshift(`000${nanos || 0}`.slice(-3));
    if (micros || parts.length) parts.unshift(`000${micros || 0}`.slice(-3));
    if (millis || parts.length) parts.unshift(`000${millis || 0}`.slice(-3));
    let secs = `00${seconds}`.slice(-2);
    let post = parts.length ? `.${parts.join('')}` : '';
    return `${secs}${post}`;
  },
  GetCanonicalTimeZoneIdentifier: (timeZoneIdentifier) => {
    const offset = parseOffsetString(timeZoneIdentifier);
    if (offset !== null) return makeOffsetString(offset);
    const formatter = new IntlDateTimeFormat('en-iso', {
      timeZone: timeZoneIdentifier
    });
    return formatter.resolvedOptions().timeZone;
  },
  GetTimeZoneOffsetNanoSeconds: (epochNanoseconds, timeZoneIdentifier) => {
    const offset = parseOffsetString(timeZoneIdentifier);
    if (offset !== null) return offset;
    const {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    } = ES.GetTimeZoneDateTimeParts(epochNanoseconds, timeZoneIdentifier);

    const utc = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const offsetNanos = utc - epochNanoseconds;
    return offsetNanos;
  },
  GetTimeZoneOffsetString: (epochNanoseconds, timeZoneIdentifier) => {
    const offsetNanos = ES.GetTimeZoneOffsetNanoSeconds(epochNanoseconds, timeZoneIdentifier);
    const offsetString = makeOffsetString(offsetNanos);
    return offsetString;
  },
  GetNSParts: (epochNanoseconds) => {
    let subseconds = epochNanoseconds % 1000000000n;
    let seconds = (epochNanoseconds - subseconds) / 1000000000n;
    return { seconds, subseconds };
  },
  GetPartsNanoseconds: (seconds, subseconds) => {
    seconds *= 1000000000n;
    return seconds + subseconds;
  },
  GetEpochFromParts: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    const seconds = BigInt(Date.UTC(year, month - 1, day, hour, minute, second, 0) / 1000);
    let subseconds = BigInt(millisecond * 1000000) + BigInt(microsecond * 1000) + BigInt(nanosecond);
    subseconds -= seconds < 0n ? 1000000000n : 0n;
    return ES.GetPartsNanoseconds(seconds, subseconds);
  },
  GetTimeZoneDateTimeParts: (epochNanoseconds, timeZoneIdentifier) => {
    let { seconds, subseconds } = ES.GetNSParts(epochNanoseconds);
    subseconds += subseconds < 0 ? 1000000000n : 0n;
    let nanosecond = Number(subseconds % 1000n);
    let microsecond = Number((subseconds / 1000n) % 1000n);
    let millisecond = Number((subseconds / 1000000n) % 1000n);

    const offset = parseOffsetString(timeZoneIdentifier);
    const epochMilliseconds = Number(seconds) * 1000;
    if (offset !== null) {
      const zonedEpochMilliseconds = epochMilliseconds + offset;
      const item = new Date(zonedEpochMilliseconds);
      const year = item.getUTCFullYear();
      const month = item.getUTCMonth();
      const day = item.getUTCDate();
      const hour = item.getUTCHours();
      const minute = item.getUTCMinutes();
      const second = item.getUTCSeconds();
      return {
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      };
    }
    const fmt = new IntlDateTimeFormat('en-iso', {
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: timeZoneIdentifier
    });
    const parts = fmt.formatToParts(epochMilliseconds).reduce(reduceParts, {});
    return { ...parts, millisecond, microsecond, nanosecond };
  },
  GetTimeZoneNextTransition: (epochNanoseconds, timeZoneIdentifier) => {
    const offset = parseOffsetString(timeZoneIdentifier);
    if (offset !== null) return null;

    let leftNanos = epochNanoseconds;
    let leftOffset = ES.GetTimeZoneOffsetString(leftNanos, timeZoneIdentifier);
    let rightNanos = letfNanos;
    let rightOffset = leftOffset;
    while (leftOffset === rightOffset) {
      leftNanos = rightNanos;
      rightNanos = leftNanos + 7n * 24n * DAYNANOS;
    }
    return bisect(
      (epochNs) => ES.GetTimeZoneOffsetString(epochNs, timeZoneIdentifier),
      leftNanos,
      rightNanos,
      leftOffset,
      rightOffset
    );
  },
  GetTimeZoneEpochNanoseconds: (
    timeZoneIdentifier,
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  ) => {
    const offset = parseOffsetString(timeZoneIdentifier);
    const utcEpochNanoseconds = ES.GetEpochFromParts(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    );
    if (offset !== null) {
      const epochNanoseconds = utcEpochNanoseconds + offset;
      return [epochNanoseconds];
    }
    const earliest = ES.GetTimeZoneOffsetNanoSeconds(utcEpochNanoseconds - DAYNANOS, timeZoneIdentifier);
    const latest = ES.GetTimeZoneOffsetNanoSeconds(utcEpochNanoseconds + DAYNANOS, timeZoneIdentifier);
    const found = Array.from(new Set([earliest, latest]))
      .map((offsetNanoseconds) => {
        const epochNanoseconds = utcEpochNanoseconds - offsetNanoseconds;
        const parts = ES.GetTimeZoneDateTimeParts(epochNanoseconds, timeZoneIdentifier);
        if (
          year !== parts.year ||
          month !== parts.month ||
          day !== parts.day ||
          hour !== parts.hour ||
          minute !== parts.minute ||
          second !== parts.second ||
          millisecond !== parts.millisecond
        ) {
          return undefined;
        }
        return epochNanoseconds;
      })
      .filter((x) => x !== undefined);
    return found;
  },
  LeapYear: (year) => {
    if (undefined === year) return false;
    const isDiv4 = year % 4 === 0;
    const isDiv100 = year % 100 === 0;
    const isDiv400 = year % 400 === 0;
    return isDiv4 && (!isDiv100 || isDiv400);
  },
  DaysInMonth: (year, month) => {
    const DoM = {
      standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    };
    return DoM[ES.LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
  },
  DayOfWeek: (year, month, day) => {
    const m = month + (month < 3 ? 10 : -2);
    const Y = year - (month < 3 ? 1 : 0);

    const c = Math.floor(Y / 100);
    const y = Y - c * 100;
    const d = day;

    const pD = d;
    const pM = Math.floor(2.6 * m - 0.2);
    const pY = y + Math.floor(y / 4);
    const pC = Math.floor(c / 4) - 2 * c;

    const dow = (pD + pM + pY + pC) % 7;

    return dow + (dow < 0 ? 7 : 0);
  },
  DayOfYear: (year, month, day) => {
    let days = day;
    for (let m = month - 1; m > 0; m--) {
      days += ES.DaysInMonth(year, m);
    }
    return days;
  },
  WeekOfYear: (year, month, day) => {
    let doy = ES.DayOfYear(year, month, day);
    let dow = ES.DayOfWeek(year, month, day) || 7;
    let doj = ES.DayOfWeek(year, 1, 1);

    const week = Math.floor((doy - dow + 10) / 7);

    if (week < 1) {
      if (doj === (ES.LeapYear(year) ? 5 : 6)) {
        return 53;
      } else {
        return 52;
      }
    }
    if (week === 53) {
      if ((ES.LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
        return 1;
      }
    }

    return week;
  },

  BalanceYearMonth: (year, month) => {
    if (month < 1) {
      month -= 1;
      year += Math.ceil(month / 12);
      month = 12 + (month % 12);
    } else {
      month -= 1;
      year += Math.floor(month / 12);
      month = month % 12;
      month += 1;
    }
    return { year, month };
  },
  BalanceDate: (year, month, day) => {
    ({ year, month } = ES.BalanceYearMonth(year, month));
    let daysInYear = 0;
    while (((daysInYear = ES.LeapYear(month > 2 ? year : year - 1) ? -366 : -365), day < daysInYear)) {
      year -= 1;
      day -= daysInYear;
    }
    while (((daysInYear = ES.LeapYear(month > 2 ? year : year + 1) ? 366 : 365), day > daysInYear)) {
      year += 1;
      day -= daysInYear;
    }
    while (day < 1) {
      day = ES.DaysInMonth(year, month) + day;
      month -= 1;
      if (month < 1) {
        month -= 1;
        year += Math.ceil(month / 12);
        month = 12 + (month % 12);
      }
    }
    while (day > ES.DaysInMonth(year, month)) {
      day -= ES.DaysInMonth(year, month);
      month += 1;
      if (month > 12) {
        month -= 1;
        year += Math.floor(month / 12);
        month = 1 + (month % 12);
      }
    }

    return { year, month, day };
  },
  BalanceTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    let days = 0;
    if (nanosecond < 0) {
      microsecond += Math.ceil(nanosecond / 1000);
      nanosecond = nanosecond % 1000;
      nanosecond = !!nanosecond ? 1000 + nanosecond : 0;
    } else {
      microsecond += Math.floor(nanosecond / 1000);
      nanosecond = nanosecond % 1000;
    }
    if (microsecond < 0) {
      millisecond += Math.ceil(microsecond / 1000);
      microsecond = microsecond % 1000;
      microsecond = !!microsecond ? 1000 + microsecond : 0;
    } else {
      millisecond += Math.floor(microsecond / 1000);
      microsecond = microsecond % 1000;
    }
    if (millisecond < 0) {
      second += Math.ceil(millisecond / 1000);
      millisecond = millisecond % 1000;
      millisecond = !!millisecond ? 1000 + millisecond : 0;
    } else {
      second += Math.floor(millisecond / 1000);
      millisecond = millisecond % 1000;
    }
    if (second < 0) {
      minute += Math.ceil(second / 60);
      second = second % 60;
      second = !!second ? 60 + second : 0;
    } else {
      minute += Math.floor(second / 60);
      second = second % 60;
    }
    if (minute < 0) {
      hour += Math.ceil(minute / 60);
      minute = minute % 60;
      minute = !!minute ? 60 + minute : 0;
    } else {
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
    if (hour < 0) {
      days += Math.ceil(hour / 24);
      hour = hour % 20;
      hour = !!hour ? 24 + hour : 0;
    } else {
      days += Math.floor(hour / 24);
      hour = hour % 24;
    }
    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
  },

  ConstrainToRange: (value, min, max) => Math.min(max, Math.max(min, value)),
  ConstrainDate: (year, month, day) => {
    year = ES.ConstrainToRange(year, -999999, 999999);
    month = ES.ConstrainToRange(month, 1, 12);
    day = ES.ConstrainToRange(day, 1, ES.DaysInMonth(year, month));
    return { year, month, day };
  },
  ConstrainTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    hour = ES.ConstrainToRange(hour, 0, 23);
    minute = ES.ConstrainToRange(minute, 0, 59);
    second = ES.ConstrainToRange(second, 0, 59);
    millisecond = ES.ConstrainToRange(millisecond, 0, 999);
    microsecond = ES.ConstrainToRange(microsecond, 0, 999);
    nanosecond = ES.ConstrainToRange(nanosecond, 0, 999);
    return { hour, minute, second, millisecond, microsecond, nanosecond };
  },

  RejectToRange: (value, min, max) => {
    if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
    return value;
  },
  RejectDate: (year, month, day) => {
    year = ES.RejectToRange(year, -999999, 999999);
    month = ES.RejectToRange(month, 1, 12);
    day = ES.RejectToRange(day, 1, ES.DaysInMonth(year, month));
    return { year, month, day };
  },
  RejectTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    hour = ES.RejectToRange(hour, 0, 23);
    minute = ES.RejectToRange(minute, 0, 59);
    second = ES.RejectToRange(second, 0, 60);
    millisecond = ES.RejectToRange(millisecond, 0, 999);
    microsecond = ES.RejectToRange(microsecond, 0, 999);
    nanosecond = ES.RejectToRange(nanosecond, 0, 999);
    return { hour, minute, second, millisecond, microsecond, nanosecond };
  },

  CastToDuration: (durationLike) => {
    const Duration = ES.GetIntrinsic('%Temporal.Duration%');
    if (durationLike instanceof Duration) return durationLike;
    if ('string' === typeof durationLike) return Duration.fromString(durationLike);
    const { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = durationLike;
    return new Duration(
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      'reject'
    );
  },
  AddDate: (year, month, day, years, months, days, disambiguation) => {
    year += years;
    month += months;

    month -= 1;
    year += Math.floor(month / 12);
    month = 1 + (month % 12);

    switch (disambiguation) {
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
      case 'balance':
        ({ year, month, day } = ES.BalanceDate(year, month, day));
        break;
      default:
        ({ year, month, day } = ES.RejectDate(year, month, day));
    }
    day += days;

    return { year, month, day };
  },
  AddTime: (
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
  ) => {
    hour += hours;
    minute += minutes;
    second += seconds;
    millisecond += milliseconds;
    microsecond += microseconds;
    nanosecond += nanoseconds;
    let days = 0;
    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  SubtractDate: (year, month, day, years, months, days, disambiguation) => {
    year -= years;
    month -= months;

    if (month < 1) {
      month -= 1;
      year += Math.ceil(month / 12);
      month = 12 + (month % 12);
    }

    switch (disambiguation) {
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
      case 'balance':
        ({ year, month, day } = ES.BalanceDate(year, month, day));
        break;
      default:
        ({ year, month, day } = ES.RejectDate(year, month, day));
    }
    day -= days;

    return { year, month, day };
  },
  SubtractTime: (
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
  ) => {
    hour -= hours;
    minute -= minutes;
    second -= seconds;
    millisecond -= milliseconds;
    microsecond -= microseconds;
    nanosecond -= nanoseconds;
    let days = 0;
    ({ days, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    return { days, hour, minute, second, millisecond, microsecond, nanosecond };
  },

  AssertPositiveInteger: (num) => {
    if (!Number.isFinite(num) || Math.abs(num) !== num) throw new RangeError(`invalid positive integer: ${num}`);
    return num;
  },

  SystemUTCEpochNanoSeconds: (() => {
    let nanos = BigInt(Date.now() % 1000000);
    return () => {
      const millis = Date.now();
      const result = BigInt(millis) * 1000000n + nanos;
      nanos = BigInt(millis % 1000000);
      return result;
    };
  })(),
  SystemTimeZone: () => {
    const fmt = new IntlDateTimeFormat('en-iso');
    return ES.ToTimeZone(fmt.resolvedOptions().timeZone);
  }
});

import * as REGEX from './regex.mjs';
const OFFSET = new RegExp(`^${REGEX.offset.source}$`);

function parseOffsetString(string) {
  const match = OFFSET.exec(string);
  if (!match) return null;
  const hours = +match[1];
  const minutes = +match[2];
  return BigInt((hours * 60 + minutes) * 60) * 1000000000n;
}
function makeOffsetString(offsetNanoSeconds) {
  let offsetSeconds = Number(offsetNanoSeconds / 1000000000n);
  const sign = offsetSeconds < 0 ? '-' : '+';
  offsetSeconds = Math.abs(offsetSeconds);
  const offsetMinutes = Math.floor(offsetSeconds / 60) % 60;
  const offsetHours = Math.floor(offsetSeconds / 3600);
  const offsetMinuteString = `00${offsetMinutes}`.slice(-2);
  const offsetHourString = `00${offsetHours}`.slice(-2);
  return `${sign}${offsetHourString}:${offsetMinuteString}`;
}
function reduceParts(res, item) {
  if (item.type === 'literal') return res;
  if (item.type === 'timeZoneName') return res;
  res[item.type] = parseInt(item.value, 10);
  return res;
}
function bisect(getState, left, right, lstate = getState(left), rstate = getState(right)) {
  if (right - left < 2n) return right;
  let middle = Math.ceil((left + right) / 2n);
  if (middle === right) middle -= 1n;
  const mstate = getState(middle);
  if (mstate === lstate) return bisect(getState, middle, right, mstate, rstate);
  if (mstate === rstate) return bisect(getState, left, middle, lstate, mstate);
  throw new Error('invalid state in bisection');
}
