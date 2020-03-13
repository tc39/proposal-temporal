import GetIntrinsic from 'es-abstract/GetIntrinsic.js';
import ES2019 from 'es-abstract/es2019.js';
import { assign as ObjectAssign, unique } from './compat.mjs';

const IntlDateTimeFormat = Intl.DateTimeFormat;

import { DateTime as TemporalDateTime } from './datetime.mjs';
import { Date as TemporalDate } from './date.mjs';
import { YearMonth as TemporalYearMonth } from './yearmonth.mjs';
import { MonthDay as TemporalMonthDay } from './monthday.mjs';
import { Time as TemporalTime } from './time.mjs';
import { Absolute as TemporalAbsolute } from './absolute.mjs';
import { TimeZone as TemporalTimeZone } from './timezone.mjs';
import { Duration as TemporalDuration } from './duration.mjs';

import bigInt from 'big-integer';

import {
  GetSlot,
  HasSlot,
  EPOCHNANOSECONDS,
  IDENTIFIER,
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

const DAYMILLIS = 86400000;
const NS_MIN = bigInt(-86400).multiply(1e17);
const NS_MAX = bigInt(86400).multiply(1e17);
const YEAR_MIN = -271821;
const YEAR_MAX = 275760;

const INTRINSICS = {
  '%Temporal.DateTime%': TemporalDateTime,
  '%Temporal.Date%': TemporalDate,
  '%Temporal.YearMonth%': TemporalYearMonth,
  '%Temporal.MonthDay%': TemporalMonthDay,
  '%Temporal.Time%': TemporalTime,
  '%Temporal.TimeZone%': TemporalTimeZone,
  '%Temporal.Absolute%': TemporalAbsolute,
  '%Temporal.Duration%': TemporalDuration
};

import * as PARSE from './regex.mjs';


export const ES = ObjectAssign(ObjectAssign({}, ES2019), {
  IsAbsolute: (item) => HasSlot(item, EPOCHNANOSECONDS),
  IsTimeZone: (item) => HasSlot(item, IDENTIFIER),
  IsDuration: (item) =>
    HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS),
  IsDate: (item) =>
    HasSlot(item, YEAR, MONTH, DAY) && !HasSlot(item, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND),
  IsTime: (item) =>
    HasSlot(item, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND) && !HasSlot(item, YEAR, MONTH, DAY),
  IsDateTime: (item) => HasSlot(item, YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND),
  IsYearMonth: (item) => HasSlot(item, YEAR, MONTH) && !HasSlot(item, DAY),
  IsMonthDay: (item) => HasSlot(item, MONTH, DAY) && !HasSlot(item, YEAR),
  ToTimeZone: (item) => {
    if (ES.IsTimeZone(item)) return item;
    const stringIdent = ES.ToString(item);
    const {zone, ianaName, offset} = ES.ParseTimeZoneString(stringIdent);
    const result = new TemporalTimeZone(zone);
    if (offset && ianaName) {
      const absolute = TemporalAbsolute.from(stringIdent);
      if (result.getOffsetFor(absolute) !== offset) {
        throw new RangeError(`invalid offset ${offset}[${ianaName}]`);
      }
    }
    return result;
  },
  ParseISODateTime: (isoString, { zoneRequired }) => {
    const regex = zoneRequired ? PARSE.absolute : PARSE.datetime;
    const match = regex.exec(isoString);
    if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    const year = ES.ToInteger(match[1]);
    const month = ES.ToInteger(match[2]);
    const day = ES.ToInteger(match[3]);
    const hour = ES.ToInteger(match[4]);
    const minute = ES.ToInteger(match[5]);
    let second = ES.ToInteger(match[6]);
    if (second === 60) second = 59;
    const millisecond = ES.ToInteger(match[7]);
    const microsecond = ES.ToInteger(match[8]);
    const nanosecond = ES.ToInteger(match[9]);
    const offset = `${match[11]}:${match[12] || '00'}`;
    let ianaName = match[13];
    if (ianaName) ianaName = ES.GetCanonicalTimeZoneIdentifier(ianaName).toString();
    const zone = match[10] ? 'UTC' : ianaName || offset;
    return {year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, zone, ianaName, offset};
  },
  ParseAbsoluteString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: true });
  },
  ParseDateTimeString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: false });
  },
  ParseDateString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: false });
  },
  ParseTimeString: (isoString) => {
    const match = PARSE.time.exec(isoString);
    let hour, minute, second, millisecond, microsecond, nanosecond;
    if (match) {
      hour = ES.ToInteger(match[1]);
      minute = ES.ToInteger(match[2]);
      second = ES.ToInteger(match[3]);
      if (second === 60) second = 59;
      millisecond = ES.ToInteger(match[4]);
      microsecond = ES.ToInteger(match[5]);
      nanosecond = ES.ToInteger(match[6]);
    } else {
      ({
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
      } = ES.ParseISODateTime(isoString, { zoneRequired: false }));
    }
    return {hour, minute, second, millisecond, microsecond, nanosecond};
  },
  ParseYearMonthString: (isoString) => {
    const match = PARSE.yearmonth.exec(isoString);
    let year, month;
    if (match) {
      year = ES.ToInteger(match[1]);
      month = ES.ToInteger(match[2]);
    } else {
      ({year, month} = ES.ParseISODateTime(isoString, { zoneRequired: false }));
    }
    return {year, month};
  },
  ParseMonthDayString: (isoString) => {
    const match = PARSE.monthday.exec(isoString);
    let month, day;
    if (match) {
      month = ES.ToInteger(match[1]);
      day = ES.ToInteger(match[2]);
    } else {
      ({month, day} = ES.ParseISODateTime(isoString, { zoneRequired: false }));
    }
    return {month, day};
  },
  ParseTimeZoneString: (stringIdent) => {
    try {
      const canonicalIdent = ES.GetCanonicalTimeZoneIdentifier(stringIdent);
      if (canonicalIdent) return {zone: canonicalIdent.toString()};
    } catch {
      // fall through
    }
    // Try parsing ISO string instead
    return ES.ParseISODateTime(stringIdent, { zoneRequired: true });
  },
  ParseDurationString: (isoString) => {
    const match = PARSE.duration.exec(isoString);
    if (!match) throw new RangeError(`invalid duration: ${isoString}`);
    const years = ES.ToInteger(match[1]);
    const months = ES.ToInteger(match[2]);
    const days = ES.ToInteger(match[3]);
    const hours = ES.ToInteger(match[4]);
    const minutes = ES.ToInteger(match[5]);
    const seconds = ES.ToInteger(match[6]);
    const milliseconds = ES.ToInteger(match[7]);
    const microseconds = ES.ToInteger(match[8]);
    const nanoseconds = ES.ToInteger(match[9]);
    return {years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds};
  },
  ToAbsolute: (item) => {
    if (ES.IsAbsolute(item)) return item;
    const isoString = ES.ToString(item);
    const { zone, ...props } = ES.ParseAbsoluteString(isoString);
    const datetime = ES.ToDateTime(props, 'reject');
    return datetime.inTimeZone(zone, 'reject');
  },
  ToDateTime: (item, disambiguation) => {
    if (ES.IsDateTime(item)) return item;
    let props = ES.ValidDateTimeFrom(item, [
      'year',
      'month',
      'day',
    ], [
      'hour',
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond'
    ]);
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseDateTimeString(isoString);
    }
    let {
      hour = 0,
      day,
      microsecond = 0,
      millisecond = 0,
      minute = 0,
      month,
      nanosecond = 0,
      second = 0,
      year,
    } = props;

    switch (disambiguation) {
      case 'reject':
        ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
        break;
      case 'constrain':
        ({
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
        } = ES.ConstrainDateTime(
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        break;
      case 'balance': {
        let deltaDays;
        ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond
        ));
        ({ year, month, day } = ES.BalanceDate(year, month, day + deltaDays));
        // Still rejected if balanced DateTime is outside valid range
        ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
        break;
      }
    }

    return new TemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  },
  ToDate: (item, disambiguation) => {
    if (ES.IsDate(item)) return item;
    let props = ES.ValidDateTimeFrom(item, [
      'year',
      'month',
      'day'
    ]);
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseDateString(isoString);
    }
    let {
      day,
      month,
      year,
    } = props;
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    return new TemporalDate(year, month, day);
  },
  RegulateDate: (year, month, day, disambiguation) => {
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, day);
        break;
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
      case 'balance':
        ({ year, month, day } = ES.BalanceDate(year, month, day));
        // Still rejected if balanced Date is outside valid range
        ES.RejectDate(year, month, day);
        break;
    }
    return { year, month, day };
  },
  ToTime: (item, disambiguation) => {
    if (ES.IsTime(item)) return item;
    let props = ES.ValidDateTimeFrom(item, [], [
      'hour',
      'minute',
      'second',
      'millisecond',
      'microsecond',
      'nanosecond'
    ]);
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseTimeString(isoString);
    }
    let {
      hour = 0,
      microsecond = 0,
      millisecond = 0,
      minute = 0,
      nanosecond = 0,
      second = 0,
    } = props;

    switch (disambiguation) {
      case 'reject':
        ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
        break;
      case 'constrain':
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
        ));
        break;
      case 'balance':
        ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
        ));
        break;
    }

    return new TemporalTime(hour, minute, second, millisecond, microsecond, nanosecond);
  },
  ToYearMonth: (item, disambiguation) => {
    if (ES.IsYearMonth(item)) return item;
    let props = ES.ValidDateTimeFrom(item, [
      'year',
      'month'
    ]);
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseYearMonthString(isoString);
    }
    let {
      month,
      year,
    } = props;

    switch (disambiguation) {
      case 'reject':
        ES.RejectYearMonth(year, month);
        break;
      case 'constrain':
        ({ year, month } = ES.ConstrainYearMonth(year, month));
        break;
      case 'balance':
        ({ year, month } = ES.BalanceYearMonth(year, month));
        // Still rejected if balanced YearMonth is outside valid range
        ES.RejectYearMonth(year, month);
        break;
    }

    return new TemporalYearMonth(year, month);
  },
  ToMonthDay: (item, disambiguation) => {
    if (ES.IsMonthDay(item)) return item;
    let props = ES.ValidDateTimeFrom(item, [
      'month',
      'day'
    ]);
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseMonthDayString(isoString);
    }
    let {
      day,
      month,
    } = props;

    const leapYear = 1972;
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(leapYear, month, day);
        break;
      case 'constrain':
        ({ month, day } = ES.ConstrainDate(leapYear, month, day));
        break;
      case 'balance':
        ({ month, day } = ES.BalanceDate(leapYear, month, day));
        break;
    }

    return new TemporalMonthDay(month, day);
  },
  ToDuration: (item, disambiguation) => {
    if (ES.IsDuration(item)) return item;
    let props = ES.ValidPropertyBag(item, [
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
    if (!props) {
      const isoString = ES.ToString(item);
      props = ES.ParseDurationString(isoString);
    }
    let {
      days = 0,
      hours = 0,
      microseconds = 0,
      milliseconds = 0,
      minutes = 0,
      months = 0,
      nanoseconds = 0,
      seconds = 0,
      years = 0,
    } = props;

    switch (disambiguation) {
      case 'reject':
        for (const prop of [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
          if (prop < 0) throw new RangeError('negative values not allowed as duration fields');
          if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
        }
        break;
      case 'constrain': {
        const arr = [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds];
        for (const idx in arr) {
          if (arr[idx] < 0) arr[idx] = -arr[idx];
          if (!Number.isFinite(arr[idx])) arr[idx] = Number.MAX_VALUE;
        }
        [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds] = arr;
        break;
      }
      case 'balance': {
        ({
          hours,
          minutes,
          seconds,
          milliseconds,
          microseconds,
          nanoseconds,
        } = ES.BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'hours'));
        for (const prop of [years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
          if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
        }
        break;
      }
    }

    return new TemporalDuration(
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
    );
  },
  ToLimitedDuration: (item, disallowedSlots = []) => {
    const duration = ES.ToDuration(item, 'reject');
    for (let slot of disallowedSlots) {
      if (GetSlot(duration, slot) !== 0) {
        throw new RangeError(`invalid duration field ${slot}`);
      }
    }
    return duration;
  },
  ToDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['constrain', 'balance', 'reject'], 'constrain');
  },
  ToArithmeticDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['constrain', 'reject'], 'constrain');
  },
  ToTimeZoneDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['earlier', 'later', 'reject'], 'earlier');
  },
  ToLargestTemporalUnit: (options, fallback, disallowedStrings = []) => {
    const largestUnit = ES.GetOption(options, 'largestUnit',
      ['years', 'months', 'days', 'hours', 'minutes', 'seconds'], fallback);
    if (disallowedStrings.includes(largestUnit)) {
      throw new RangeError(`${largestUnit} not allowed as the largest unit here`);
    }
    return largestUnit;
  },
  GetIntrinsic: (intrinsic) => {
    return intrinsic in INTRINSICS ? INTRINSICS[intrinsic] : GetIntrinsic(intrinsic);
  },
  ValidPropertyBag: (bag, anyof = []) => {
    if (!bag || 'object' !== typeof bag) return false;
    let any;
    for (let prop of anyof) {
      if (prop in bag) {
        const value = ES.ToNumber(bag[prop]);
        if (Number.isFinite(value)) {
          any = any || {};
          any[prop] = value;
        }
      }
    }
    return any ? any : false;
  },
  ValidDateTimeFrom: (bag, required, optional = []) => {
    if (!bag || 'object' !== typeof bag) return false;
    let result = {};
    for (let prop of required) {
      if (!(prop in bag) || typeof bag[prop] === 'undefined') {
        throw new TypeError(`required property '${prop}' missing or undefined`);
      }
      result[prop] = ES.ToNumber(bag[prop]);
    }
    for (let prop of optional) {
      if (prop in bag) {
        const value = ES.ToNumber(bag[prop]);
        if (Number.isFinite(value)) result[prop] = value;
      }
    }
    return result;
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
    const formatter = new IntlDateTimeFormat('en-us', {
      timeZone: String(timeZoneIdentifier),
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    formatter.toString = tzIdent;
    return formatter;
  },
  GetTimeZoneOffsetNanoseconds: (epochNanoseconds, timeZone) => {
    const offset = parseOffsetString(`${timeZone}`);
    if (offset !== null) return bigInt(offset).multiply(1e6);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.GetTimeZoneDateTimeParts(
      epochNanoseconds,
      timeZone
    );
    const utc = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (utc === null) throw new RangeError('Date outside of supported range');
    return utc.minus(epochNanoseconds);
  },
  GetTimeZoneOffsetString: (epochNanoseconds, timeZone) => {
    const offsetNanos = bigInt(ES.GetTimeZoneOffsetNanoseconds(epochNanoseconds, timeZone));
    const offsetString = makeOffsetString(offsetNanos.divide(1e6));
    return offsetString;
  },
  GetEpochFromParts: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    let ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    if (Number.isNaN(ms)) return null;
    // Date.UTC interprets one and two-digit years as being in the 20th century
    if (year >= 0 && year < 100) ms = new Date(ms).setUTCFullYear(year);
    let ns = bigInt(ms).multiply(1e6);
    ns = ns.plus(bigInt(microsecond).multiply(1e3));
    ns = ns.plus(bigInt(nanosecond));
    if (ns.lesser(NS_MIN) || ns.greater(NS_MAX)) return null;
    return ns;
  },
  GetTimeZoneDateTimeParts: (epochNanoseconds, timeZone) => {
    const offset = parseOffsetString(timeZone);
    let nanos = bigInt(epochNanoseconds).mod(1e9);
    let epochMilliseconds = bigInt(epochNanoseconds).divide(1e9).multiply(1e3).plus(Math.floor(nanos / 1e6));
    nanos = +((epochNanoseconds < 0 ? 1e9 : 0) + nanos);
    let millisecond = Math.floor(nanos / 1e6) % 1e3;
    let microsecond = Math.floor(nanos / 1e3) % 1e3;
    let nanosecond = Math.floor(nanos / 1e0) % 1e3;

    if (offset !== null) {
      millisecond += offset;
      let item = new Date(+epochMilliseconds);
      let year = item.getUTCFullYear();
      let month = item.getUTCMonth() + 1;
      let day = item.getUTCDate();
      let hour = item.getUTCHours();
      let minute = item.getUTCMinutes();
      let second = item.getUTCSeconds();

      let deltaDays = 0;
      ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond
      ));
      day += deltaDays;
      ({ year, month, day } = ES.BalanceDate(year, month, day));
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
    let year, month, day, hour, minute, second;
    ({ year, month, day, hour, minute, second } = ES.GetFormatterParts(timeZone, epochMilliseconds).reduce(
      reduceParts,
      {}
    ));
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    day += deltaDays;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  GetTimeZoneNextTransition: (epochNanoseconds, timeZone) => {
    const offset = parseOffsetString(timeZone);
    if (offset !== null) {
      return null;
    }

    let leftNanos = epochNanoseconds;
    let leftOffset = ES.GetTimeZoneOffsetString(leftNanos, timeZone);
    let rightNanos = leftNanos;
    let rightOffset = leftOffset;
    let weeks = 0;
    while ((leftOffset === rightOffset) && (weeks < 104)) {
      rightNanos = bigInt(leftNanos).plus(7 * 24 * DAYMILLIS * 1e6);
      rightOffset = ES.GetTimeZoneOffsetString(rightNanos, timeZone);
      if (leftOffset === rightOffset) {
        leftNanos = rightNanos;
      }
      weeks++;
    }
    if (leftOffset === rightOffset) return null;
    const result = bisect(
      (epochNS) => ES.GetTimeZoneOffsetString(epochNS, timeZone),
      leftNanos,
      rightNanos,
      leftOffset,
      rightOffset
    );
    return result;
  },
  GetFormatterParts: (timeZone, epochMilliseconds) => {
    const formatter = new IntlDateTimeFormat('en-us', {
      timeZone,
      hour12: false,
      era: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    // FIXME: can this use formatToParts instead?
    const datetime = formatter.format(new Date(epochMilliseconds));
    const [date, fullYear, time] = datetime.split(/,\s+/);
    const [month, day] = date.split(' ');
    const [year, era] = fullYear.split(' ');
    const [hour, minute, second] = time.split(':');
    return [
      { type: 'year', value: era === 'BC' ? -year + 1 : +year },
      { type: 'month', value: +month },
      { type: 'day', value: +day },
      { type: 'hour', value: +hour },
      { type: 'minute', value: +minute },
      { type: 'second', value: +second }
    ];
  },
  GetTimeZoneEpochValue: (timeZone, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    const offset = parseOffsetString(timeZone);
    let ns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (ns === null) throw new RangeError('DateTime outside of supported range');

    if (offset !== null) {
      ns = ns.minus(bigInt(offset).multiply(1e6));
      return [ns];
    }

    const dayNanos = bigInt(DAYMILLIS).multiply(1e6);
    let nsEarlier = ns.minus(dayNanos);
    if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
    let nsLater = ns.plus(dayNanos);
    if (nsLater.greater(NS_MAX)) nsLater = ns;
    const earliest = ES.GetTimeZoneOffsetNanoseconds(nsEarlier, timeZone);
    const latest = ES.GetTimeZoneOffsetNanoseconds(nsLater, timeZone);
    const found = unique([earliest, latest])
      .map((offsetNanoseconds) => {
        const epochNanoseconds = bigInt(ns).minus(offsetNanoseconds);
        const parts = ES.GetTimeZoneDateTimeParts(epochNanoseconds, timeZone);
        if (
          year !== parts.year ||
          month !== parts.month ||
          day !== parts.day ||
          hour !== parts.hour ||
          minute !== parts.minute ||
          second !== parts.second ||
          millisecond !== parts.millisecond ||
          microsecond !== parts.microsecond ||
          nanosecond !== parts.nanosecond
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

    return dow + (dow <= 0 ? 7 : 0);
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
    month -= 1;
    year += Math.floor(month / 12);
    month %= 12;
    if (month < 0) month += 12;
    month += 1;
    return { year, month };
  },
  BalanceDate: (year, month, day) => {
    ({ year, month } = ES.BalanceYearMonth(year, month));
    let daysInYear = 0;
    let testYear = month > 2 ? year : year - 1;
    while (((daysInYear = ES.LeapYear(testYear) ? 366 : 365), day < -daysInYear)) {
      year -= 1;
      testYear -= 1;
      day += daysInYear;
    }
    testYear += 1;
    while (((daysInYear = ES.LeapYear(testYear) ? 366 : 365), day > daysInYear)) {
      year += 1;
      testYear += 1;
      day -= daysInYear;
    }

    while (day < 1) {
      ({ year, month } = ES.BalanceYearMonth(year, month - 1));
      day += ES.DaysInMonth(year, month);
    }
    while (day > ES.DaysInMonth(year, month)) {
      day -= ES.DaysInMonth(year, month);
      ({ year, month } = ES.BalanceYearMonth(year, month + 1));
    }

    return { year, month, day };
  },
  BalanceSubSecond: (millisecond, microsecond, nanosecond) => {
    microsecond += Math.floor(nanosecond / 1000);
    nanosecond = nanosecond % 1000;
    nanosecond = nanosecond < 0 ? 1000 + nanosecond : nanosecond;

    millisecond += Math.floor(microsecond / 1000);
    microsecond = microsecond % 1000;
    microsecond = microsecond < 0 ? 1000 + microsecond : microsecond;

    const seconds = Math.floor(millisecond / 1000);
    millisecond = millisecond % 1000;
    millisecond = millisecond < 0 ? 1000 + millisecond : millisecond;

    return { seconds, millisecond, microsecond, nanosecond };
  },
  BalanceTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    let seconds;
    ({ seconds, millisecond, microsecond, nanosecond } = ES.BalanceSubSecond(millisecond, microsecond, nanosecond));

    second += seconds;

    minute += Math.floor(second / 60);
    second = second % 60;
    second = second < 0 ? 60 + second : second;

    hour += Math.floor(minute / 60);
    minute = minute % 60;
    minute = minute < 0 ? 60 + minute : minute;

    let deltaDays = Math.floor(hour / 24);
    hour = hour % 24;
    hour = hour < 0 ? 24 + hour : hour;

    return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  BalanceDurationDate: (years, months, startYear, startMonth, startDay) => {
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    let { year, month } = ES.BalanceYearMonth(startYear + years, startMonth + months);
    while (startDay > ES.DaysInMonth(year, month)) {
      months -= 1;
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      ({ year, month } = ES.BalanceYearMonth(startYear + years, startMonth + months));
    }
    return { year, month, years, months };
  },
  BalanceDuration: (days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit) => {
    let deltaDays;
    ({
      deltaDays,
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: milliseconds,
      microsecond: microseconds,
      nanosecond: nanoseconds,
    } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
    days += deltaDays;

    switch (largestUnit) {
      case 'hours':
        hours += 24 * days;
        days = 0;
        break;
      case 'minutes':
        minutes += 60 * (hours + 24 * days);
        hours = days = 0;
        break;
      case 'seconds':
        seconds += 60 * (minutes + 60 * (hours + 24 * days));
        minutes = hours = days = 0;
        break;
      case 'years':
      case 'months':
      case 'days':
        break;
      default:
        throw new Error('assert not reached');
    }

    return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },

  ConstrainToRange: (value, min, max) => Math.min(max, Math.max(min, value)),
  ConstrainDate: (year, month, day) => {
    // Noon avoids trouble at edges of DateTime range (excludes midnight)
    ({ year, month, day } = ES.ConstrainDateTime(year, month, day, 12, 0, 0, 0, 0, 0));
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
  ConstrainDateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    year = ES.ConstrainToRange(year, YEAR_MIN, YEAR_MAX);
    month = ES.ConstrainToRange(month, 1, 12);
    day = ES.ConstrainToRange(day, 1, ES.DaysInMonth(year, month));
    ({
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
    } = ES.ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond));
    // Constrain to within 24 hours outside the Absolute range
    if (year === YEAR_MIN &&
      null === ES.GetEpochFromParts(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1)) {
      month = 4;
      day = 19;
      hour = minute = second = millisecond = microsecond = 0;
      nanosecond = 1;
    } else if (year === YEAR_MAX &&
      null === ES.GetEpochFromParts(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1)) {
      month = 9;
      day = 13;
      hour = 23;
      minute = second = 59;
      millisecond = microsecond = nanosecond = 999;
    }
    return ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond });
  },
  ConstrainYearMonth: (year, month) => {
    year = ES.ConstrainToRange(year, YEAR_MIN, YEAR_MAX);
    if (year === YEAR_MIN) {
      month = ES.ConstrainToRange(month, 4, 12);
    } else if (year === YEAR_MAX) {
      month = ES.ConstrainToRange(month, 1, 9);
    } else {
      month = ES.ConstrainToRange(month, 1, 12);
    }
    return ({ year, month });
  },

  RejectToRange: (value, min, max) => {
    if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
  },
  RejectDate: (year, month, day) => {
    // Noon avoids trouble at edges of DateTime range (excludes midnight)
    ES.RejectDateTime(year, month, day, 12, 0, 0, 0, 0, 0);
  },
  RejectTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    ES.RejectToRange(hour, 0, 23);
    ES.RejectToRange(minute, 0, 59);
    ES.RejectToRange(second, 0, 59);
    ES.RejectToRange(millisecond, 0, 999);
    ES.RejectToRange(microsecond, 0, 999);
    ES.RejectToRange(nanosecond, 0, 999);
  },
  RejectDateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);
    ES.RejectToRange(month, 1, 12);
    ES.RejectToRange(day, 1, ES.DaysInMonth(year, month));
    ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    // Reject any DateTime 24 hours or more outside the Absolute range
    if ((year === YEAR_MIN &&
      null == ES.GetEpochFromParts(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1)) ||
      (year === YEAR_MAX &&
      null == ES.GetEpochFromParts(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1))) {
      throw new RangeError('DateTime outside of supported range');
    }
  },
  RejectAbsolute: (epochNanoseconds) => {
    if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
      throw new RangeError('Absolute outside of supported range');
    }
  },
  RejectYearMonth: (year, month) => {
    ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);
    if (year === YEAR_MIN) {
      ES.RejectToRange(month, 4, 12);
    } else if (year === YEAR_MAX) {
      ES.RejectToRange(month, 1, 9);
    } else {
      ES.RejectToRange(month, 1, 12);
    }
  },

  DifferenceDate: (smaller, larger, largestUnit = 'days') => {
    let years = larger.year - smaller.year;
    let months, days;

    switch (largestUnit) {
      case 'years':
      case 'months': {
        months = larger.month - smaller.month;
        let year, month;
        ({ year, month, years, months } = ES.BalanceDurationDate(years, months, smaller.year, smaller.month, smaller.day));
        days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);
        if (days < 0) {
          months -= 1;
          ({ year, month, years, months } = ES.BalanceDurationDate(years, months, smaller.year, smaller.month, smaller.day));
          days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);
          if (larger.year > year) days += ES.LeapYear(year) ? 366 : 365;
        }
        if (largestUnit === 'months') {
          months += years * 12;
          years = 0;
        }
        break;
      }
      case 'days':
        months = 0;
        days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(smaller.year, smaller.month, smaller.day);
        while (years > 0) {
          days += ES.LeapYear(smaller.year + years - 1) ? 366 : 365;
          years -= 1;
        }
        break;
      default:
        throw new Error('assert not reached');
    }
    return { years, months, days };
  },
  DifferenceTime(earlier, later) {
    let hours = later.hour - earlier.hour;
    let minutes = later.minute - earlier.minute;
    let seconds = later.second - earlier.second;
    let milliseconds = later.millisecond - earlier.millisecond;
    let microseconds = later.microsecond - earlier.microsecond;
    let nanoseconds = later.nanosecond - earlier.nanosecond;
    let deltaDays = 0;
    ({
      deltaDays,
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: milliseconds,
      microsecond: microseconds,
      nanosecond: nanoseconds
    } = ES.BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));
    return { deltaDays, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  AddDate: (year, month, day, years, months, days, disambiguation) => {
    year += years;
    month += months;
    ({ year, month } = ES.BalanceYearMonth(year, month));

    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, day);
        break;
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
    }

    day += days;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
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
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  SubtractDate: (year, month, day, years, months, days, disambiguation) => {
    day -= days;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    month -= months;
    year -= years;
    ({ year, month } = ES.BalanceYearMonth(year, month));

    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, day);
        break;
      case 'constrain':
        ({ year, month, day } = ES.ConstrainDate(year, month, day));
        break;
    }
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
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
  },

  AssertPositiveInteger: (num) => {
    if (!Number.isFinite(num) || Math.abs(num) !== num) throw new RangeError(`invalid positive integer: ${num}`);
    return num;
  },
  // Note: This method returns values with bogus nanoseconds based on the previous iteration's
  // milliseconds. That way there is a guarantee that the full nanoseconds are always going to be
  // increasing at least and that the microsecond and nanosecond fields are likely to be non-zero.
  SystemUTCEpochNanoSeconds: (() => {
    let ns = Date.now() % 1e6;
    return () => {
      const ms = Date.now();
      const result = bigInt(ms).multiply(1e6).plus(ns);
      ns = ms % 1e6;
      return result;
    };
  })(),
  SystemTimeZone: () => {
    const fmt = new IntlDateTimeFormat('en-us');
    return ES.ToTimeZone(fmt.resolvedOptions().timeZone);
  },
  ComparisonResult: (value) => (value < 0 ? -1 : value > 0 ? 1 : value),
  GetOption: (options, property, allowedValues, fallback) => {
    if (options === null || options === undefined) return fallback;
    options = ES.ToObject(options);
    let value = options[property];
    if (value !== undefined) {
      value = ES.ToString(value);
      if (!allowedValues.includes(value)) {
        throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`)
      }
      return value;
    }
    return fallback;
  },
});

import * as REGEX from './regex.mjs';
const OFFSET = new RegExp(`^${REGEX.offset.source}$`);

function parseOffsetString(string) {
  const match = OFFSET.exec(String(string));
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  return sign * (hours * 60 + minutes) * 60 * 1000;
}
function makeOffsetString(offsetMilliSeconds) {
  let offsetSeconds = Math.round(offsetMilliSeconds / 1000);
  const sign = (offsetSeconds < 0) ? '-' : '+';
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
  left = bigInt(left);
  right = bigInt(right);
  while (right.minus(left).greater(1)) {
    let middle = left.plus(right).divide(2);
    const mstate = getState(middle);
    if (mstate === lstate) {
      left = middle;
      lstate = mstate;
    } else if(mstate === rstate) {
      right = middle;
      rstate = mstate;
    } else {
      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}

function tzIdent() {
  return this.resolvedOptions().timeZone;
}
