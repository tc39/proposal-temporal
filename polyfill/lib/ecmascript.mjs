/* global __debug__ */

const ArrayIncludes = Array.prototype.includes;
const ArrayPrototypePush = Array.prototype.push;
const ArrayPrototypeSort = Array.prototype.sort;
const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
const MathMin = Math.min;
const MathMax = Math.max;
const MathAbs = Math.abs;
const MathFloor = Math.floor;
const MathSign = Math.sign;
const MathTrunc = Math.trunc;
const NumberIsNaN = Number.isNaN;
const NumberIsFinite = Number.isFinite;
const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
const ObjectAssign = Object.assign;
const ObjectCreate = Object.create;
const ObjectDefineProperty = Object.defineProperty;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const ObjectEntries = Object.entries;
const StringFromCharCode = String.fromCharCode;
const StringPrototypeCharCodeAt = String.prototype.charCodeAt;
const StringPrototypeReplace = String.prototype.replace;

import bigInt from 'big-integer';
import callBound from 'call-bind/callBound';
import Call from 'es-abstract/2022/Call.js';
import CreateDataPropertyOrThrow from 'es-abstract/2022/CreateDataPropertyOrThrow.js';
import Get from 'es-abstract/2022/Get.js';
import GetMethod from 'es-abstract/2022/GetMethod.js';
import IsArray from 'es-abstract/2022/IsArray.js';
import IsIntegralNumber from 'es-abstract/2022/IsIntegralNumber.js';
import ToIntegerOrInfinity from 'es-abstract/2022/ToIntegerOrInfinity.js';
import IsPropertyKey from 'es-abstract/2022/IsPropertyKey.js';
import SameValue from 'es-abstract/2022/SameValue.js';
import ToLength from 'es-abstract/2022/ToLength.js';
import ToNumber from 'es-abstract/2022/ToNumber.js';
import ToObject from 'es-abstract/2022/ToObject.js';
import ToPrimitive from 'es-abstract/2022/ToPrimitive.js';
import ToString from 'es-abstract/2022/ToString.js';
import Type from 'es-abstract/2022/Type.js';
import HasOwnProperty from 'es-abstract/2022/HasOwnProperty.js';

import every from 'es-abstract/helpers/every.js';
import forEach from 'es-abstract/helpers/forEach.js';
import OwnPropertyKeys from 'es-abstract/helpers/OwnPropertyKeys.js';
import some from 'es-abstract/helpers/some.js';

import { GetIntrinsic } from './intrinsicclass.mjs';
import {
  CreateSlots,
  GetSlot,
  HasSlot,
  SetSlot,
  EPOCHNANOSECONDS,
  TIMEZONE_ID,
  CALENDAR_ID,
  INSTANT,
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  ISO_HOUR,
  ISO_MINUTE,
  ISO_SECOND,
  ISO_MILLISECOND,
  ISO_MICROSECOND,
  ISO_NANOSECOND,
  DATE_BRAND,
  YEAR_MONTH_BRAND,
  MONTH_DAY_BRAND,
  TIME_ZONE,
  CALENDAR,
  YEARS,
  MONTHS,
  WEEKS,
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  MICROSECONDS,
  NANOSECONDS
} from './slots.mjs';

const $TypeError = GetIntrinsic('%TypeError%');
const $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

const DAY_SECONDS = 86400;
const DAY_NANOS = bigInt(DAY_SECONDS).multiply(1e9);
const NS_MIN = bigInt(-DAY_SECONDS).multiply(1e17);
const NS_MAX = bigInt(DAY_SECONDS).multiply(1e17);
const YEAR_MIN = -271821;
const YEAR_MAX = 275760;
const BEFORE_FIRST_DST = bigInt(-388152).multiply(1e13); // 1847-01-01T00:00:00Z

const BUILTIN_CALENDAR_IDS = [
  'iso8601',
  'hebrew',
  'islamic',
  'islamic-umalqura',
  'islamic-tbla',
  'islamic-civil',
  'islamic-rgsa',
  'islamicc',
  'persian',
  'ethiopic',
  'ethioaa',
  'coptic',
  'chinese',
  'dangi',
  'roc',
  'indian',
  'buddhist',
  'japanese',
  'gregory'
];

const ToIntegerWithTruncation = (value) => {
  const number = ToNumber(value);
  if (number === 0) return 0;
  if (NumberIsNaN(number) || !NumberIsFinite(number)) {
    throw new RangeError('invalid number value');
  }
  const integer = MathTrunc(number);
  if (integer === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return integer;
};

const ToPositiveIntegerWithTruncation = (value, property) => {
  const integer = ToIntegerWithTruncation(value);
  if (integer <= 0) {
    if (property !== undefined) {
      throw new RangeError(`property '${property}' cannot be a a number less than one`);
    }
    throw new RangeError('Cannot convert a number less than one to a positive integer');
  }
  return integer;
};
const ToIntegerIfIntegral = (value) => {
  const number = ES.ToNumber(value);
  if (!NumberIsFinite(number)) throw new RangeError('infinity is out of range');
  if (!IsIntegralNumber(number)) throw new RangeError(`unsupported fractional value ${value}`);
  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return number;
};

const BUILTIN_CASTS = new Map([
  ['year', ToIntegerWithTruncation],
  ['month', ToPositiveIntegerWithTruncation],
  ['monthCode', ToString],
  ['day', ToPositiveIntegerWithTruncation],
  ['hour', ToIntegerWithTruncation],
  ['minute', ToIntegerWithTruncation],
  ['second', ToIntegerWithTruncation],
  ['millisecond', ToIntegerWithTruncation],
  ['microsecond', ToIntegerWithTruncation],
  ['nanosecond', ToIntegerWithTruncation],
  ['years', ToIntegerIfIntegral],
  ['months', ToIntegerIfIntegral],
  ['weeks', ToIntegerIfIntegral],
  ['days', ToIntegerIfIntegral],
  ['hours', ToIntegerIfIntegral],
  ['minutes', ToIntegerIfIntegral],
  ['seconds', ToIntegerIfIntegral],
  ['milliseconds', ToIntegerIfIntegral],
  ['microseconds', ToIntegerIfIntegral],
  ['nanoseconds', ToIntegerIfIntegral],
  ['era', ToString],
  ['eraYear', ToIntegerOrInfinity],
  ['offset', ToString]
]);

const BUILTIN_DEFAULTS = new Map([
  ['hour', 0],
  ['minute', 0],
  ['second', 0],
  ['millisecond', 0],
  ['microsecond', 0],
  ['nanosecond', 0]
]);

// each item is [plural, singular, category]
const SINGULAR_PLURAL_UNITS = [
  ['years', 'year', 'date'],
  ['months', 'month', 'date'],
  ['weeks', 'week', 'date'],
  ['days', 'day', 'date'],
  ['hours', 'hour', 'time'],
  ['minutes', 'minute', 'time'],
  ['seconds', 'second', 'time'],
  ['milliseconds', 'millisecond', 'time'],
  ['microseconds', 'microsecond', 'time'],
  ['nanoseconds', 'nanosecond', 'time']
];
const SINGULAR_FOR = new Map(SINGULAR_PLURAL_UNITS);
const PLURAL_FOR = new Map(SINGULAR_PLURAL_UNITS.map(([p, s]) => [s, p]));
const UNITS_DESCENDING = SINGULAR_PLURAL_UNITS.map(([, s]) => s);

const DURATION_FIELDS = [
  'days',
  'hours',
  'microseconds',
  'milliseconds',
  'minutes',
  'months',
  'nanoseconds',
  'seconds',
  'weeks',
  'years'
];

import * as PARSE from './regex.mjs';

const ES2022 = {
  Call,
  GetMethod,
  HasOwnProperty,
  IsIntegralNumber,
  ToIntegerOrInfinity,
  ToLength,
  ToNumber,
  ToObject,
  ToPrimitive,
  ToString,
  Type
};

const IntlDateTimeFormatEnUsCache = new Map();

function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier) {
  let instance = IntlDateTimeFormatEnUsCache.get(timeZoneIdentifier);
  if (instance === undefined) {
    instance = new IntlDateTimeFormat('en-us', {
      timeZone: String(timeZoneIdentifier),
      hour12: false,
      era: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    IntlDateTimeFormatEnUsCache.set(timeZoneIdentifier, instance);
  }
  return instance;
}

export const ES = ObjectAssign({}, ES2022, {
  // copied from es-abstract/2022/CopyDataProperties.js
  // with modifications per Temporal spec/mainadditions.html
  CopyDataProperties: (target, source, excludedKeys, excludedValues) => {
    if (Type(target) !== 'Object') {
      throw new $TypeError('Assertion failed: "target" must be an Object');
    }

    if (!IsArray(excludedKeys) || !every(excludedKeys, IsPropertyKey)) {
      throw new $TypeError('Assertion failed: "excludedKeys" must be a List of Property Keys');
    }

    if (typeof source === 'undefined' || source === null) {
      return target;
    }

    var from = ToObject(source);

    var keys = OwnPropertyKeys(from);
    forEach(keys, function (nextKey) {
      var excluded = some(excludedKeys, function (e) {
        return SameValue(e, nextKey) === true;
      });
      if (excluded) return;

      var enumerable =
        $isEnumerable(from, nextKey) ||
        // this is to handle string keys being non-enumerable in older engines
        (typeof source === 'string' && nextKey >= 0 && IsIntegralNumber(ToNumber(nextKey)));
      if (enumerable) {
        var propValue = Get(from, nextKey);
        if (excludedValues !== undefined) {
          forEach(excludedValues, function (e) {
            if (SameValue(e, propValue) === true) {
              excluded = true;
            }
          });
        }
        if (excluded === false) CreateDataPropertyOrThrow(target, nextKey, propValue);
      }
    });

    return target;
  },
  ToPositiveIntegerWithTruncation,
  ToIntegerWithTruncation,
  ToIntegerIfIntegral,
  IsTemporalInstant: (item) => HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR),
  IsTemporalTimeZone: (item) => HasSlot(item, TIMEZONE_ID),
  IsTemporalCalendar: (item) => HasSlot(item, CALENDAR_ID),
  IsTemporalDuration: (item) =>
    HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS),
  IsTemporalDate: (item) => HasSlot(item, DATE_BRAND),
  IsTemporalTime: (item) =>
    HasSlot(item, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND) &&
    !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY),
  IsTemporalDateTime: (item) =>
    HasSlot(
      item,
      ISO_YEAR,
      ISO_MONTH,
      ISO_DAY,
      ISO_HOUR,
      ISO_MINUTE,
      ISO_SECOND,
      ISO_MILLISECOND,
      ISO_MICROSECOND,
      ISO_NANOSECOND
    ),
  IsTemporalYearMonth: (item) => HasSlot(item, YEAR_MONTH_BRAND),
  IsTemporalMonthDay: (item) => HasSlot(item, MONTH_DAY_BRAND),
  IsTemporalZonedDateTime: (item) => HasSlot(item, EPOCHNANOSECONDS, TIME_ZONE, CALENDAR),
  RejectObjectWithCalendarOrTimeZone: (item) => {
    if (HasSlot(item, CALENDAR) || HasSlot(item, TIME_ZONE)) {
      throw new TypeError('with() does not support a calendar or timeZone property');
    }
    if (item.calendar !== undefined) {
      throw new TypeError('with() does not support a calendar property');
    }
    if (item.timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property');
    }
  },

  ParseTemporalTimeZone: (stringIdent) => {
    const { ianaName, offset, z } = ES.ParseTemporalTimeZoneString(stringIdent);
    if (ianaName) return ES.GetCanonicalTimeZoneIdentifier(ianaName);
    if (z) return 'UTC';
    return offset; // if !ianaName && !z then offset must be present
  },
  MaybeFormatCalendarAnnotation: (calendar, showCalendar) => {
    if (showCalendar === 'never') return '';
    return ES.FormatCalendarAnnotation(ES.ToString(calendar), showCalendar);
  },
  FormatCalendarAnnotation: (id, showCalendar) => {
    if (showCalendar === 'never') return '';
    if (showCalendar === 'auto' && id === 'iso8601') return '';
    const flag = showCalendar === 'critical' ? '!' : '';
    return `[${flag}u-ca=${id}]`;
  },
  ParseISODateTime: (isoString) => {
    // ZDT is the superset of fields for every other Temporal type
    const match = PARSE.zoneddatetime.exec(isoString);
    if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    let yearString = match[1];
    if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
    if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    const year = ES.ToIntegerOrInfinity(yearString);
    const month = ES.ToIntegerOrInfinity(match[2] || match[4]);
    const day = ES.ToIntegerOrInfinity(match[3] || match[5]);
    const hasTime = match[6] !== undefined;
    const hour = ES.ToIntegerOrInfinity(match[6]);
    const minute = ES.ToIntegerOrInfinity(match[7] || match[10]);
    let second = ES.ToIntegerOrInfinity(match[8] || match[11]);
    if (second === 60) second = 59;
    const fraction = (match[9] || match[12]) + '000000000';
    const millisecond = ES.ToIntegerOrInfinity(fraction.slice(0, 3));
    const microsecond = ES.ToIntegerOrInfinity(fraction.slice(3, 6));
    const nanosecond = ES.ToIntegerOrInfinity(fraction.slice(6, 9));
    let offset;
    let z = false;
    if (match[13]) {
      offset = undefined;
      z = true;
    } else if (match[14] && match[15]) {
      const offsetSign = match[14] === '-' || match[14] === '\u2212' ? '-' : '+';
      const offsetHours = match[15] || '00';
      const offsetMinutes = match[16] || '00';
      const offsetSeconds = match[17] || '00';
      let offsetFraction = match[18] || '0';
      offset = `${offsetSign}${offsetHours}:${offsetMinutes}`;
      if (+offsetFraction) {
        while (offsetFraction.endsWith('0')) offsetFraction = offsetFraction.slice(0, -1);
        offset += `:${offsetSeconds}.${offsetFraction}`;
      } else if (+offsetSeconds) {
        offset += `:${offsetSeconds}`;
      }
      if (offset === '-00:00') offset = '+00:00';
    }
    const ianaName = match[19];
    const annotations = match[20];
    let calendar;
    for (const [, critical, key, value] of annotations.matchAll(PARSE.annotation)) {
      if (key === 'u-ca') {
        if (calendar === undefined) calendar = value;
      } else if (critical === '!') {
        throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
      }
    }
    ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    return {
      year,
      month,
      day,
      hasTime,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      ianaName,
      offset,
      z,
      calendar
    };
  },
  ParseTemporalInstantString: (isoString) => {
    const result = ES.ParseISODateTime(isoString);
    if (!result.z && !result.offset) throw new RangeError('Temporal.Instant requires a time zone offset');
    return result;
  },
  ParseTemporalZonedDateTimeString: (isoString) => {
    const result = ES.ParseISODateTime(isoString);
    if (!result.ianaName) throw new RangeError('Temporal.ZonedDateTime requires a time zone ID in brackets');
    return result;
  },
  ParseTemporalDateTimeString: (isoString) => {
    return ES.ParseISODateTime(isoString);
  },
  ParseTemporalDateString: (isoString) => {
    return ES.ParseISODateTime(isoString);
  },
  ParseTemporalTimeString: (isoString) => {
    const match = PARSE.time.exec(isoString);
    let hour, minute, second, millisecond, microsecond, nanosecond, annotations, calendar;
    if (match) {
      hour = ES.ToIntegerOrInfinity(match[1]);
      minute = ES.ToIntegerOrInfinity(match[2] || match[5]);
      second = ES.ToIntegerOrInfinity(match[3] || match[6]);
      if (second === 60) second = 59;
      const fraction = (match[4] || match[7]) + '000000000';
      millisecond = ES.ToIntegerOrInfinity(fraction.slice(0, 3));
      microsecond = ES.ToIntegerOrInfinity(fraction.slice(3, 6));
      nanosecond = ES.ToIntegerOrInfinity(fraction.slice(6, 9));
      annotations = match[14];
      for (const [, critical, key, value] of annotations.matchAll(PARSE.annotation)) {
        if (key === 'u-ca') {
          if (calendar === undefined) calendar = value;
        } else if (critical === '!') {
          throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
        }
      }
      if (match[8]) throw new RangeError('Z designator not supported for PlainTime');
    } else {
      let z, hasTime;
      ({ hasTime, hour, minute, second, millisecond, microsecond, nanosecond, calendar, z } =
        ES.ParseISODateTime(isoString));
      if (!hasTime) throw new RangeError(`time is missing in string: ${isoString}`);
      if (z) throw new RangeError('Z designator not supported for PlainTime');
    }
    // if it's a date-time string, OK
    if (/[tT ][0-9][0-9]/.test(isoString)) {
      return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
    }
    // Reject strings that are ambiguous with PlainMonthDay or PlainYearMonth.
    try {
      const { month, day } = ES.ParseTemporalMonthDayString(isoString);
      ES.RejectISODate(1972, month, day);
    } catch {
      try {
        const { year, month } = ES.ParseTemporalYearMonthString(isoString);
        ES.RejectISODate(year, month, 1);
      } catch {
        return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
      }
    }
    throw new RangeError(`invalid ISO 8601 time-only string ${isoString}; may need a T prefix`);
  },
  ParseTemporalYearMonthString: (isoString) => {
    const match = PARSE.yearmonth.exec(isoString);
    let year, month, calendar, referenceISODay;
    if (match) {
      let yearString = match[1];
      if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
      if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
      year = ES.ToIntegerOrInfinity(yearString);
      month = ES.ToIntegerOrInfinity(match[2]);
      const annotations = match[3];
      for (const [, critical, key, value] of annotations.matchAll(PARSE.annotation)) {
        if (key === 'u-ca') {
          if (calendar === undefined) calendar = value;
        } else if (critical === '!') {
          throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
        }
      }
      if (calendar !== undefined && calendar !== 'iso8601') {
        throw new RangeError('YYYY-MM format is only valid with iso8601 calendar');
      }
    } else {
      let z;
      ({ year, month, calendar, day: referenceISODay, z } = ES.ParseISODateTime(isoString));
      if (z) throw new RangeError('Z designator not supported for PlainYearMonth');
    }
    return { year, month, calendar, referenceISODay };
  },
  ParseTemporalMonthDayString: (isoString) => {
    const match = PARSE.monthday.exec(isoString);
    let month, day, calendar, referenceISOYear;
    if (match) {
      month = ES.ToIntegerOrInfinity(match[1]);
      day = ES.ToIntegerOrInfinity(match[2]);
      const annotations = match[3];
      for (const [, critical, key, value] of annotations.matchAll(PARSE.annotation)) {
        if (key === 'u-ca') {
          if (calendar === undefined) calendar = value;
        } else if (critical === '!') {
          throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
        }
      }
      if (calendar !== undefined && calendar !== 'iso8601') {
        throw new RangeError('MM-DD format is only valid with iso8601 calendar');
      }
    } else {
      let z;
      ({ month, day, calendar, year: referenceISOYear, z } = ES.ParseISODateTime(isoString));
      if (z) throw new RangeError('Z designator not supported for PlainMonthDay');
    }
    return { month, day, calendar, referenceISOYear };
  },
  ParseTemporalTimeZoneString: (stringIdent) => {
    const bareID = new RegExp(`^${PARSE.timeZoneID.source}$`, 'i');
    if (bareID.test(stringIdent)) return { ianaName: stringIdent };
    try {
      // Try parsing ISO string instead
      const result = ES.ParseISODateTime(stringIdent);
      if (result.z || result.offset || result.ianaName) {
        return result;
      }
    } catch {
      // fall through
    }
    throw new RangeError(`Invalid time zone: ${stringIdent}`);
  },
  ParseTemporalDurationString: (isoString) => {
    const match = PARSE.duration.exec(isoString);
    if (!match) throw new RangeError(`invalid duration: ${isoString}`);
    if (match.slice(2).every((element) => element === undefined)) {
      throw new RangeError(`invalid duration: ${isoString}`);
    }
    const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : 1;
    const years = match[2] === undefined ? 0 : ES.ToIntegerWithTruncation(match[2]) * sign;
    const months = match[3] === undefined ? 0 : ES.ToIntegerWithTruncation(match[3]) * sign;
    const weeks = match[4] === undefined ? 0 : ES.ToIntegerWithTruncation(match[4]) * sign;
    const days = match[5] === undefined ? 0 : ES.ToIntegerWithTruncation(match[5]) * sign;
    const hours = match[6] === undefined ? 0 : ES.ToIntegerWithTruncation(match[6]) * sign;
    let fHours = match[7];
    let minutesStr = match[8];
    let fMinutes = match[9];
    let secondsStr = match[10];
    let fSeconds = match[11];
    let minutes = 0;
    let seconds = 0;
    // fractional hours, minutes, or seconds, expressed in whole nanoseconds:
    let excessNanoseconds = 0;

    if (fHours !== undefined) {
      if (minutesStr ?? fMinutes ?? secondsStr ?? fSeconds ?? false) {
        throw new RangeError('only the smallest unit can be fractional');
      }
      excessNanoseconds = ES.ToIntegerWithTruncation((fHours + '000000000').slice(0, 9)) * 3600 * sign;
    } else {
      minutes = minutesStr === undefined ? 0 : ES.ToIntegerWithTruncation(minutesStr) * sign;
      if (fMinutes !== undefined) {
        if (secondsStr ?? fSeconds ?? false) {
          throw new RangeError('only the smallest unit can be fractional');
        }
        excessNanoseconds = ES.ToIntegerWithTruncation((fMinutes + '000000000').slice(0, 9)) * 60 * sign;
      } else {
        seconds = secondsStr === undefined ? 0 : ES.ToIntegerWithTruncation(secondsStr) * sign;
        if (fSeconds !== undefined) {
          excessNanoseconds = ES.ToIntegerWithTruncation((fSeconds + '000000000').slice(0, 9)) * sign;
        }
      }
    }

    const nanoseconds = excessNanoseconds % 1000;
    const microseconds = MathTrunc(excessNanoseconds / 1000) % 1000;
    const milliseconds = MathTrunc(excessNanoseconds / 1e6) % 1000;
    seconds += MathTrunc(excessNanoseconds / 1e9) % 60;
    minutes += MathTrunc(excessNanoseconds / 6e10);

    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  ParseTemporalInstant: (isoString) => {
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offset, z } =
      ES.ParseTemporalInstantString(isoString);

    if (!z && !offset) throw new RangeError('Temporal.Instant requires a time zone offset');
    const offsetNs = z ? 0 : ES.ParseTimeZoneOffsetString(offset);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceISODateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond - offsetNs
    ));
    const epochNs = ES.GetUTCEpochNanoseconds(
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
    if (epochNs === null) throw new RangeError('DateTime outside of supported range');
    return epochNs;
  },
  RegulateISODate: (year, month, day, overflow) => {
    switch (overflow) {
      case 'reject':
        ES.RejectISODate(year, month, day);
        break;
      case 'constrain':
        ({ year, month, day } = ES.ConstrainISODate(year, month, day));
        break;
    }
    return { year, month, day };
  },
  RegulateTime: (hour, minute, second, millisecond, microsecond, nanosecond, overflow) => {
    switch (overflow) {
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
          nanosecond
        ));
        break;
    }
    return { hour, minute, second, millisecond, microsecond, nanosecond };
  },
  RegulateISOYearMonth: (year, month, overflow) => {
    const referenceISODay = 1;
    switch (overflow) {
      case 'reject':
        ES.RejectISODate(year, month, referenceISODay);
        break;
      case 'constrain':
        ({ year, month } = ES.ConstrainISODate(year, month));
        break;
    }
    return { year, month };
  },
  ToTemporalDurationRecord: (item) => {
    if (ES.Type(item) !== 'Object') {
      return ES.ParseTemporalDurationString(ES.ToString(item));
    }
    if (ES.IsTemporalDuration(item)) {
      return {
        years: GetSlot(item, YEARS),
        months: GetSlot(item, MONTHS),
        weeks: GetSlot(item, WEEKS),
        days: GetSlot(item, DAYS),
        hours: GetSlot(item, HOURS),
        minutes: GetSlot(item, MINUTES),
        seconds: GetSlot(item, SECONDS),
        milliseconds: GetSlot(item, MILLISECONDS),
        microseconds: GetSlot(item, MICROSECONDS),
        nanoseconds: GetSlot(item, NANOSECONDS)
      };
    }
    const result = {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      microseconds: 0,
      nanoseconds: 0
    };
    let partial = ES.ToTemporalPartialDurationRecord(item);
    for (let index = 0; index < DURATION_FIELDS.length; index++) {
      const property = DURATION_FIELDS[index];
      const value = partial[property];
      if (value !== undefined) {
        result[property] = value;
      }
    }
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = result;
    ES.RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    return result;
  },
  ToTemporalPartialDurationRecord: (temporalDurationLike) => {
    if (ES.Type(temporalDurationLike) !== 'Object') {
      throw new TypeError('invalid duration-like');
    }
    const result = {
      years: undefined,
      months: undefined,
      weeks: undefined,
      days: undefined,
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      milliseconds: undefined,
      microseconds: undefined,
      nanoseconds: undefined
    };
    let any = false;
    for (let index = 0; index < DURATION_FIELDS.length; index++) {
      const property = DURATION_FIELDS[index];
      const value = temporalDurationLike[property];
      if (value !== undefined) {
        any = true;
        result[property] = ES.ToIntegerIfIntegral(value);
      }
    }
    if (!any) {
      throw new TypeError('invalid duration-like');
    }
    return result;
  },
  ToLimitedTemporalDuration: (item, disallowedProperties) => {
    let record = ES.ToTemporalDurationRecord(item);
    for (const property of disallowedProperties) {
      if (record[property] !== 0) {
        throw new RangeError(
          `Duration field ${property} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`
        );
      }
    }
    return record;
  },
  ToTemporalOverflow: (options) => {
    if (options === undefined) return 'constrain';
    return ES.GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
  },
  ToTemporalDisambiguation: (options) => {
    if (options === undefined) return 'compatible';
    return ES.GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
  },
  ToTemporalRoundingMode: (options, fallback) => {
    return ES.GetOption(
      options,
      'roundingMode',
      ['ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'],
      fallback
    );
  },
  NegateTemporalRoundingMode: (roundingMode) => {
    switch (roundingMode) {
      case 'ceil':
        return 'floor';
      case 'floor':
        return 'ceil';
      case 'halfCeil':
        return 'halfFloor';
      case 'halfFloor':
        return 'halfCeil';
      default:
        return roundingMode;
    }
  },
  ToTemporalOffset: (options, fallback) => {
    if (options === undefined) return fallback;
    return ES.GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback);
  },
  ToCalendarNameOption: (options) => {
    return ES.GetOption(options, 'calendarName', ['auto', 'always', 'never', 'critical'], 'auto');
  },
  ToTimeZoneNameOption: (options) => {
    return ES.GetOption(options, 'timeZoneName', ['auto', 'never', 'critical'], 'auto');
  },
  ToShowOffsetOption: (options) => {
    return ES.GetOption(options, 'offset', ['auto', 'never'], 'auto');
  },
  ToTemporalRoundingIncrement: (options) => {
    let increment = options.roundingIncrement;
    if (increment === undefined) return 1;
    increment = ES.ToNumber(increment);
    if (!NumberIsFinite(increment)) {
      throw new RangeError('roundingIncrement must be finite');
    }
    const integerIncrement = MathTrunc(increment);
    if (integerIncrement < 1 || integerIncrement > 1e9) {
      throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${increment}`);
    }
    return integerIncrement;
  },
  ValidateTemporalRoundingIncrement: (increment, dividend, inclusive) => {
    const maximum = inclusive ? dividend : dividend - 1;
    if (increment > maximum) {
      throw new RangeError(`roundingIncrement must be at least 1 and less than ${maximum}, not ${increment}`);
    }
    if (dividend % increment !== 0) {
      throw new RangeError(`Rounding increment must divide evenly into ${dividend}`);
    }
  },
  ToFractionalSecondDigits: (normalizedOptions) => {
    let digitsValue = normalizedOptions.fractionalSecondDigits;
    if (digitsValue === undefined) return 'auto';
    if (ES.Type(digitsValue) !== 'Number') {
      if (ES.ToString(digitsValue) !== 'auto') {
        throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
      }
      return 'auto';
    }
    const digitCount = MathFloor(digitsValue);
    if (!NumberIsFinite(digitCount) || digitCount < 0 || digitCount > 9) {
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
    }
    return digitCount;
  },
  ToSecondsStringPrecisionRecord: (smallestUnit, precision) => {
    switch (smallestUnit) {
      case 'minute':
        return { precision: 'minute', unit: 'minute', increment: 1 };
      case 'second':
        return { precision: 0, unit: 'second', increment: 1 };
      case 'millisecond':
        return { precision: 3, unit: 'millisecond', increment: 1 };
      case 'microsecond':
        return { precision: 6, unit: 'microsecond', increment: 1 };
      case 'nanosecond':
        return { precision: 9, unit: 'nanosecond', increment: 1 };
      default: // fall through if option not given
    }
    switch (precision) {
      case 'auto':
        return { precision, unit: 'nanosecond', increment: 1 };
      case 0:
        return { precision, unit: 'second', increment: 1 };
      case 1:
      case 2:
      case 3:
        return { precision, unit: 'millisecond', increment: 10 ** (3 - precision) };
      case 4:
      case 5:
      case 6:
        return { precision, unit: 'microsecond', increment: 10 ** (6 - precision) };
      case 7:
      case 8:
      case 9:
        return { precision, unit: 'nanosecond', increment: 10 ** (9 - precision) };
    }
  },
  REQUIRED: Symbol('~required~'),
  GetTemporalUnit: (options, key, unitGroup, requiredOrDefault, extraValues = []) => {
    const allowedSingular = [];
    for (let index = 0; index < SINGULAR_PLURAL_UNITS.length; index++) {
      const unitInfo = SINGULAR_PLURAL_UNITS[index];
      const singular = unitInfo[1];
      const category = unitInfo[2];
      if (unitGroup === 'datetime' || unitGroup === category) {
        allowedSingular.push(singular);
      }
    }
    ES.Call(ArrayPrototypePush, allowedSingular, extraValues);
    let defaultVal = requiredOrDefault;
    if (defaultVal === ES.REQUIRED) {
      defaultVal = undefined;
    } else if (defaultVal !== undefined) {
      allowedSingular.push(defaultVal);
    }
    const allowedValues = [];
    ES.Call(ArrayPrototypePush, allowedValues, allowedSingular);
    for (let index = 0; index < allowedSingular.length; index++) {
      const singular = allowedSingular[index];
      const plural = PLURAL_FOR.get(singular);
      if (plural !== undefined) allowedValues.push(plural);
    }
    let retval = ES.GetOption(options, key, allowedValues, defaultVal);
    if (retval === undefined && requiredOrDefault === ES.REQUIRED) {
      throw new RangeError(`${key} is required`);
    }
    if (SINGULAR_FOR.has(retval)) retval = SINGULAR_FOR.get(retval);
    return retval;
  },
  ToRelativeTemporalObject: (options) => {
    const relativeTo = options.relativeTo;
    if (relativeTo === undefined) return relativeTo;

    let offsetBehaviour = 'option';
    let matchMinutes = false;
    let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, timeZone, offset;
    if (ES.Type(relativeTo) === 'Object') {
      if (ES.IsTemporalZonedDateTime(relativeTo) || ES.IsTemporalDate(relativeTo)) return relativeTo;
      if (ES.IsTemporalDateTime(relativeTo)) return ES.TemporalDateTimeToDate(relativeTo);
      calendar = ES.GetTemporalCalendarWithISODefault(relativeTo);
      const fieldNames = ES.CalendarFields(calendar, [
        'day',
        'hour',
        'microsecond',
        'millisecond',
        'minute',
        'month',
        'monthCode',
        'nanosecond',
        'second',
        'year'
      ]);
      ES.Call(ArrayPrototypePush, fieldNames, ['timeZone', 'offset']);
      const fields = ES.PrepareTemporalFields(relativeTo, fieldNames, []);
      const dateOptions = ObjectCreate(null);
      dateOptions.overflow = 'constrain';
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
        ES.InterpretTemporalDateTimeFields(calendar, fields, dateOptions));
      offset = fields.offset;
      if (offset === undefined) offsetBehaviour = 'wall';
      timeZone = fields.timeZone;
    } else {
      let ianaName, z;
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, ianaName, offset, z } =
        ES.ParseISODateTime(ES.ToString(relativeTo)));
      if (ianaName) {
        timeZone = ianaName;
        if (z) {
          offsetBehaviour = 'exact';
        } else if (!offset) {
          offsetBehaviour = 'wall';
        }
        matchMinutes = true;
      } else if (z) {
        throw new RangeError(
          'Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone'
        );
      }
      if (!calendar) calendar = ES.GetISO8601Calendar();
      calendar = ES.ToTemporalCalendar(calendar);
    }
    if (timeZone === undefined) return ES.CreateTemporalDate(year, month, day, calendar);
    timeZone = ES.ToTemporalTimeZone(timeZone);
    const offsetNs = offsetBehaviour === 'option' ? ES.ParseTimeZoneOffsetString(offset) : 0;
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offsetBehaviour,
      offsetNs,
      timeZone,
      'compatible',
      'reject',
      matchMinutes
    );
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  },
  DefaultTemporalLargestUnit: (
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds
  ) => {
    const entries = ObjectEntries({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    });
    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      const prop = entry[0];
      const v = entry[1];
      if (v !== 0) return SINGULAR_FOR.get(prop);
    }
    return 'nanosecond';
  },
  LargerOfTwoTemporalUnits: (unit1, unit2) => {
    if (UNITS_DESCENDING.indexOf(unit1) > UNITS_DESCENDING.indexOf(unit2)) return unit2;
    return unit1;
  },
  PrepareTemporalFields: (
    bag,
    fields,
    requiredFields,
    { emptySourceErrorMessage = 'no supported properties found' } = {}
  ) => {
    const result = ObjectCreate(null);
    let any = false;
    ES.Call(ArrayPrototypeSort, fields, []);
    for (let index = 0; index < fields.length; index++) {
      const property = fields[index];
      let value = bag[property];
      if (value !== undefined) {
        any = true;
        if (BUILTIN_CASTS.has(property)) {
          value = BUILTIN_CASTS.get(property)(value);
        }
        result[property] = value;
      } else if (requiredFields !== 'partial') {
        if (ES.Call(ArrayIncludes, requiredFields, [property])) {
          throw new TypeError(`required property '${property}' missing or undefined`);
        }
        value = BUILTIN_DEFAULTS.get(property);
        result[property] = value;
      }
    }
    if (requiredFields === 'partial' && !any) {
      throw new TypeError(emptySourceErrorMessage);
    }
    return result;
  },
  ToTemporalTimeRecord: (bag, completeness = 'complete') => {
    const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
    const partial = ES.PrepareTemporalFields(bag, fields, 'partial', { emptySourceErrorMessage: 'invalid time-like' });
    const result = {};
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      const valueDesc = ObjectGetOwnPropertyDescriptor(partial, field);
      if (valueDesc !== undefined) {
        result[field] = valueDesc.value;
      } else if (completeness === 'complete') {
        result[field] = 0;
      }
    }
    return result;
  },

  ToTemporalDate: (item, options) => {
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalDate(item)) return item;
      if (ES.IsTemporalZonedDateTime(item)) {
        ES.ToTemporalOverflow(options); // validate and ignore
        item = ES.GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
      }
      if (ES.IsTemporalDateTime(item)) {
        ES.ToTemporalOverflow(options); // validate and ignore
        return ES.CreateTemporalDate(
          GetSlot(item, ISO_YEAR),
          GetSlot(item, ISO_MONTH),
          GetSlot(item, ISO_DAY),
          GetSlot(item, CALENDAR)
        );
      }
      const calendar = ES.GetTemporalCalendarWithISODefault(item);
      const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
      const fields = ES.PrepareTemporalFields(item, fieldNames, []);
      return ES.CalendarDateFromFields(calendar, fields, options);
    }
    ES.ToTemporalOverflow(options); // validate and ignore
    let { year, month, day, calendar, z } = ES.ParseTemporalDateString(ES.ToString(item));
    if (z) throw new RangeError('Z designator not supported for PlainDate');
    const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
    return new TemporalPlainDate(year, month, day, calendar); // include validation
  },
  InterpretTemporalDateTimeFields: (calendar, fields, options) => {
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ES.ToTemporalTimeRecord(fields);
    const overflow = ES.ToTemporalOverflow(options);
    const date = ES.CalendarDateFromFields(calendar, fields, options);
    const year = GetSlot(date, ISO_YEAR);
    const month = GetSlot(date, ISO_MONTH);
    const day = GetSlot(date, ISO_DAY);
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  ToTemporalDateTime: (item, options) => {
    let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar;
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalDateTime(item)) return item;
      if (ES.IsTemporalZonedDateTime(item)) {
        ES.ToTemporalOverflow(options); // validate and ignore
        return ES.GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
      }
      if (ES.IsTemporalDate(item)) {
        ES.ToTemporalOverflow(options); // validate and ignore
        return ES.CreateTemporalDateTime(
          GetSlot(item, ISO_YEAR),
          GetSlot(item, ISO_MONTH),
          GetSlot(item, ISO_DAY),
          0,
          0,
          0,
          0,
          0,
          0,
          GetSlot(item, CALENDAR)
        );
      }

      calendar = ES.GetTemporalCalendarWithISODefault(item);
      const fieldNames = ES.CalendarFields(calendar, [
        'day',
        'hour',
        'microsecond',
        'millisecond',
        'minute',
        'month',
        'monthCode',
        'nanosecond',
        'second',
        'year'
      ]);
      const fields = ES.PrepareTemporalFields(item, fieldNames, []);
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
        ES.InterpretTemporalDateTimeFields(calendar, fields, options));
    } else {
      ES.ToTemporalOverflow(options); // validate and ignore
      let z;
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, z } =
        ES.ParseTemporalDateTimeString(ES.ToString(item)));
      if (z) throw new RangeError('Z designator not supported for PlainDateTime');
      ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
      if (calendar === undefined) calendar = ES.GetISO8601Calendar();
      calendar = ES.ToTemporalCalendar(calendar);
    }
    return ES.CreateTemporalDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
  },
  ToTemporalDuration: (item) => {
    if (ES.IsTemporalDuration(item)) return item;
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.ToTemporalDurationRecord(item);
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    return new TemporalDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    );
  },
  ToTemporalInstant: (item) => {
    if (ES.IsTemporalInstant(item)) return item;
    if (ES.IsTemporalZonedDateTime(item)) {
      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
      return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
    }
    const ns = ES.ParseTemporalInstant(ES.ToString(item));
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(ns);
  },
  ToTemporalMonthDay: (item, options) => {
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalMonthDay(item)) return item;
      let calendar, calendarAbsent;
      if (HasSlot(item, CALENDAR)) {
        calendar = GetSlot(item, CALENDAR);
        calendarAbsent = false;
      } else {
        calendar = item.calendar;
        calendarAbsent = calendar === undefined;
        if (calendar === undefined) calendar = ES.GetISO8601Calendar();
        calendar = ES.ToTemporalCalendar(calendar);
      }
      const fieldNames = ES.CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
      const fields = ES.PrepareTemporalFields(item, fieldNames, []);
      // Callers who omit the calendar are not writing calendar-independent
      // code. In that case, `monthCode`/`year` can be omitted; `month` and
      // `day` are sufficient. Add a `year` to satisfy calendar validation.
      if (calendarAbsent && fields.month !== undefined && fields.monthCode === undefined && fields.year === undefined) {
        fields.year = 1972;
      }
      return ES.CalendarMonthDayFromFields(calendar, fields, options);
    }

    ES.ToTemporalOverflow(options); // validate and ignore
    let { month, day, referenceISOYear, calendar } = ES.ParseTemporalMonthDayString(ES.ToString(item));
    if (calendar === undefined) calendar = ES.GetISO8601Calendar();
    calendar = ES.ToTemporalCalendar(calendar);

    if (referenceISOYear === undefined) {
      ES.RejectISODate(1972, month, day);
      return ES.CreateTemporalMonthDay(month, day, calendar);
    }
    const result = ES.CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
    return ES.CalendarMonthDayFromFields(calendar, result);
  },
  ToTemporalTime: (item, overflow = 'constrain') => {
    let hour, minute, second, millisecond, microsecond, nanosecond, calendar;
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalTime(item)) return item;
      if (ES.IsTemporalZonedDateTime(item)) {
        item = ES.GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
      }
      if (ES.IsTemporalDateTime(item)) {
        const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
        return new TemporalPlainTime(
          GetSlot(item, ISO_HOUR),
          GetSlot(item, ISO_MINUTE),
          GetSlot(item, ISO_SECOND),
          GetSlot(item, ISO_MILLISECOND),
          GetSlot(item, ISO_MICROSECOND),
          GetSlot(item, ISO_NANOSECOND)
        );
      }
      calendar = ES.GetTemporalCalendarWithISODefault(item);
      if (ES.ToString(calendar) !== 'iso8601') {
        throw new RangeError('PlainTime can only have iso8601 calendar');
      }
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ToTemporalTimeRecord(item));
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        overflow
      ));
    } else {
      ({ hour, minute, second, millisecond, microsecond, nanosecond, calendar } = ES.ParseTemporalTimeString(
        ES.ToString(item)
      ));
      ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
      if (calendar !== undefined && calendar !== 'iso8601') {
        throw new RangeError('PlainTime can only have iso8601 calendar');
      }
    }
    const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
    return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  },
  ToTemporalYearMonth: (item, options) => {
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalYearMonth(item)) return item;
      const calendar = ES.GetTemporalCalendarWithISODefault(item);
      const fieldNames = ES.CalendarFields(calendar, ['month', 'monthCode', 'year']);
      const fields = ES.PrepareTemporalFields(item, fieldNames, []);
      return ES.CalendarYearMonthFromFields(calendar, fields, options);
    }

    ES.ToTemporalOverflow(options); // validate and ignore
    let { year, month, referenceISODay, calendar } = ES.ParseTemporalYearMonthString(ES.ToString(item));
    if (calendar === undefined) calendar = ES.GetISO8601Calendar();
    calendar = ES.ToTemporalCalendar(calendar);

    if (referenceISODay === undefined) {
      ES.RejectISODate(year, month, 1);
      return ES.CreateTemporalYearMonth(year, month, calendar);
    }
    const result = ES.CreateTemporalYearMonth(year, month, calendar, referenceISODay);
    return ES.CalendarYearMonthFromFields(calendar, result);
  },
  InterpretISODateTimeOffset: (
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    offsetBehaviour,
    offsetNs,
    timeZone,
    disambiguation,
    offsetOpt,
    matchMinute
  ) => {
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

    if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
      // Simple case: ISO string without a TZ offset (or caller wants to ignore
      // the offset), so just convert DateTime to Instant in the given time zone
      const instant = ES.GetInstantFor(timeZone, dt, disambiguation);
      return GetSlot(instant, EPOCHNANOSECONDS);
    }

    // The caller wants the offset to always win ('use') OR the caller is OK
    // with the offset winning ('prefer' or 'reject') as long as it's valid
    // for this timezone and date/time.
    if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
      // Calculate the instant for the input's date/time and offset
      const epochNs = ES.GetUTCEpochNanoseconds(
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
      if (epochNs === null) throw new RangeError('ZonedDateTime outside of supported range');
      return epochNs.minus(offsetNs);
    }

    // "prefer" or "reject"
    const possibleInstants = ES.GetPossibleInstantsFor(timeZone, dt);
    for (let index = 0; index < possibleInstants.length; index++) {
      const candidate = possibleInstants[index];
      const candidateOffset = ES.GetOffsetNanosecondsFor(timeZone, candidate);
      const roundedCandidateOffset = ES.RoundNumberToIncrement(
        bigInt(candidateOffset),
        60e9,
        'halfExpand'
      ).toJSNumber();
      if (candidateOffset === offsetNs || (matchMinute && roundedCandidateOffset === offsetNs)) {
        return GetSlot(candidate, EPOCHNANOSECONDS);
      }
    }

    // the user-provided offset doesn't match any instants for this time
    // zone and date/time.
    if (offsetOpt === 'reject') {
      const offsetStr = ES.FormatTimeZoneOffsetString(offsetNs);
      const timeZoneString = ES.IsTemporalTimeZone(timeZone) ? GetSlot(timeZone, TIMEZONE_ID) : 'time zone';
      throw new RangeError(`Offset ${offsetStr} is invalid for ${dt} in ${timeZoneString}`);
    }
    // fall through: offsetOpt === 'prefer', but the offset doesn't match
    // so fall back to use the time zone instead.
    const instant = ES.DisambiguatePossibleInstants(possibleInstants, timeZone, dt, disambiguation);
    return GetSlot(instant, EPOCHNANOSECONDS);
  },
  ToTemporalZonedDateTime: (item, options) => {
    let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone, offset, calendar;
    let disambiguation, offsetOpt;
    let matchMinute = false;
    let offsetBehaviour = 'option';
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalZonedDateTime(item)) return item;
      calendar = ES.GetTemporalCalendarWithISODefault(item);
      const fieldNames = ES.CalendarFields(calendar, [
        'day',
        'hour',
        'microsecond',
        'millisecond',
        'minute',
        'month',
        'monthCode',
        'nanosecond',
        'second',
        'year'
      ]);
      ES.Call(ArrayPrototypePush, fieldNames, ['timeZone', 'offset']);
      const fields = ES.PrepareTemporalFields(item, fieldNames, ['timeZone']);
      timeZone = ES.ToTemporalTimeZone(fields.timeZone);
      offset = fields.offset;
      if (offset === undefined) {
        offsetBehaviour = 'wall';
      }
      disambiguation = ES.ToTemporalDisambiguation(options);
      offsetOpt = ES.ToTemporalOffset(options, 'reject');
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
        ES.InterpretTemporalDateTimeFields(calendar, fields, options));
    } else {
      let ianaName, z;
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, ianaName, offset, z, calendar } =
        ES.ParseTemporalZonedDateTimeString(ES.ToString(item)));
      if (z) {
        offsetBehaviour = 'exact';
      } else if (!offset) {
        offsetBehaviour = 'wall';
      }
      const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
      timeZone = new TemporalTimeZone(ianaName);
      if (!calendar) calendar = ES.GetISO8601Calendar();
      calendar = ES.ToTemporalCalendar(calendar);
      matchMinute = true; // ISO strings may specify offset with less precision
      disambiguation = ES.ToTemporalDisambiguation(options);
      offsetOpt = ES.ToTemporalOffset(options, 'reject');
      ES.ToTemporalOverflow(options); // validate and ignore
    }
    let offsetNs = 0;
    if (offsetBehaviour === 'option') offsetNs = ES.ParseTimeZoneOffsetString(offset);
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offsetBehaviour,
      offsetNs,
      timeZone,
      disambiguation,
      offsetOpt,
      matchMinute
    );
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  },

  CreateTemporalDateSlots: (result, isoYear, isoMonth, isoDay, calendar) => {
    ES.RejectISODate(isoYear, isoMonth, isoDay);
    ES.RejectDateRange(isoYear, isoMonth, isoDay);

    CreateSlots(result);
    SetSlot(result, ISO_YEAR, isoYear);
    SetSlot(result, ISO_MONTH, isoMonth);
    SetSlot(result, ISO_DAY, isoDay);
    SetSlot(result, CALENDAR, calendar);
    SetSlot(result, DATE_BRAND, true);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      ObjectDefineProperty(result, '_repr_', {
        value: `${result[Symbol.toStringTag]} <${ES.TemporalDateToString(result)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  },
  CreateTemporalDate: (isoYear, isoMonth, isoDay, calendar = ES.GetISO8601Calendar()) => {
    const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
    const result = ObjectCreate(TemporalPlainDate.prototype);
    ES.CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar);
    return result;
  },
  CreateTemporalDateTimeSlots: (result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar) => {
    ES.RejectDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);
    ES.RejectDateTimeRange(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);

    CreateSlots(result);
    SetSlot(result, ISO_YEAR, isoYear);
    SetSlot(result, ISO_MONTH, isoMonth);
    SetSlot(result, ISO_DAY, isoDay);
    SetSlot(result, ISO_HOUR, h);
    SetSlot(result, ISO_MINUTE, min);
    SetSlot(result, ISO_SECOND, s);
    SetSlot(result, ISO_MILLISECOND, ms);
    SetSlot(result, ISO_MICROSECOND, µs);
    SetSlot(result, ISO_NANOSECOND, ns);
    SetSlot(result, CALENDAR, calendar);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(result, '_repr_', {
        value: `${result[Symbol.toStringTag]} <${ES.TemporalDateTimeToString(result, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  },
  CreateTemporalDateTime: (isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar = ES.GetISO8601Calendar()) => {
    const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    const result = ObjectCreate(TemporalPlainDateTime.prototype);
    ES.CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar);
    return result;
  },
  CreateTemporalMonthDaySlots: (result, isoMonth, isoDay, calendar, referenceISOYear) => {
    ES.RejectISODate(referenceISOYear, isoMonth, isoDay);
    ES.RejectDateRange(referenceISOYear, isoMonth, isoDay);

    CreateSlots(result);
    SetSlot(result, ISO_MONTH, isoMonth);
    SetSlot(result, ISO_DAY, isoDay);
    SetSlot(result, ISO_YEAR, referenceISOYear);
    SetSlot(result, CALENDAR, calendar);
    SetSlot(result, MONTH_DAY_BRAND, true);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(result, '_repr_', {
        value: `${result[Symbol.toStringTag]} <${ES.TemporalMonthDayToString(result)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  },
  CreateTemporalMonthDay: (isoMonth, isoDay, calendar = ES.GetISO8601Calendar(), referenceISOYear = 1972) => {
    const TemporalPlainMonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
    const result = ObjectCreate(TemporalPlainMonthDay.prototype);
    ES.CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar, referenceISOYear);
    return result;
  },
  CreateTemporalYearMonthSlots: (result, isoYear, isoMonth, calendar, referenceISODay) => {
    ES.RejectISODate(isoYear, isoMonth, referenceISODay);
    ES.RejectYearMonthRange(isoYear, isoMonth);

    CreateSlots(result);
    SetSlot(result, ISO_YEAR, isoYear);
    SetSlot(result, ISO_MONTH, isoMonth);
    SetSlot(result, ISO_DAY, referenceISODay);
    SetSlot(result, CALENDAR, calendar);
    SetSlot(result, YEAR_MONTH_BRAND, true);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(result, '_repr_', {
        value: `${result[Symbol.toStringTag]} <${ES.TemporalYearMonthToString(result)}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  },
  CreateTemporalYearMonth: (isoYear, isoMonth, calendar = ES.GetISO8601Calendar(), referenceISODay = 1) => {
    const TemporalPlainYearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
    const result = ObjectCreate(TemporalPlainYearMonth.prototype);
    ES.CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay);
    return result;
  },
  CreateTemporalZonedDateTimeSlots: (result, epochNanoseconds, timeZone, calendar) => {
    ES.ValidateEpochNanoseconds(epochNanoseconds);

    CreateSlots(result);
    SetSlot(result, EPOCHNANOSECONDS, epochNanoseconds);
    SetSlot(result, TIME_ZONE, timeZone);
    SetSlot(result, CALENDAR, calendar);

    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const instant = new TemporalInstant(GetSlot(result, EPOCHNANOSECONDS));
    SetSlot(result, INSTANT, instant);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(result, '_repr_', {
        value: `${result[Symbol.toStringTag]} <${ES.TemporalZonedDateTimeToString(result, 'auto')}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  },
  CreateTemporalZonedDateTime: (epochNanoseconds, timeZone, calendar = ES.GetISO8601Calendar()) => {
    const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
    const result = ObjectCreate(TemporalZonedDateTime.prototype);
    ES.CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
    return result;
  },

  GetISO8601Calendar: () => {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    return new TemporalCalendar('iso8601');
  },
  CalendarFields: (calendar, fieldNames) => {
    const fields = ES.GetMethod(calendar, 'fields');
    fieldNames = ES.Call(fields, calendar, [fieldNames]);
    const result = [];
    for (const name of fieldNames) {
      if (ES.Type(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
      ES.Call(ArrayPrototypePush, result, [name]);
    }
    return result;
  },
  CalendarMergeFields: (calendar, fields, additionalFields) => {
    const mergeFields = ES.GetMethod(calendar, 'mergeFields');
    const result = ES.Call(mergeFields, calendar, [fields, additionalFields]);
    if (ES.Type(result) !== 'Object') throw new TypeError('bad return from calendar.mergeFields()');
    return result;
  },
  CalendarDateAdd: (calendar, date, duration, options, dateAdd) => {
    if (dateAdd === undefined) {
      dateAdd = ES.GetMethod(calendar, 'dateAdd');
    }
    const result = ES.Call(dateAdd, calendar, [date, duration, options]);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  },
  CalendarDateUntil: (calendar, date, otherDate, options, dateUntil) => {
    if (dateUntil === undefined) {
      dateUntil = ES.GetMethod(calendar, 'dateUntil');
    }
    const result = ES.Call(dateUntil, calendar, [date, otherDate, options]);
    if (!ES.IsTemporalDuration(result)) throw new TypeError('invalid result');
    return result;
  },
  CalendarYear: (calendar, dateLike) => {
    const year = ES.GetMethod(calendar, 'year');
    const result = ES.Call(year, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar year result must be an integer');
    }
    if (!IsIntegralNumber(result)) {
      throw new RangeError('calendar year result must be an integer');
    }
    return result;
  },
  CalendarMonth: (calendar, dateLike) => {
    const month = ES.GetMethod(calendar, 'month');
    const result = ES.Call(month, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar month result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar month result must be a positive integer');
    }
    return result;
  },
  CalendarMonthCode: (calendar, dateLike) => {
    const monthCode = ES.GetMethod(calendar, 'monthCode');
    const result = ES.Call(monthCode, calendar, [dateLike]);
    if (typeof result !== 'string') {
      throw new TypeError('calendar monthCode result must be a string');
    }
    return result;
  },
  CalendarDay: (calendar, dateLike) => {
    const day = ES.GetMethod(calendar, 'day');
    const result = ES.Call(day, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar day result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar day result must be a positive integer');
    }
    return result;
  },
  CalendarEra: (calendar, dateLike) => {
    const era = ES.GetMethod(calendar, 'era');
    let result = ES.Call(era, calendar, [dateLike]);
    if (result === undefined) {
      return result;
    }
    if (typeof result !== 'string') {
      throw new TypeError('calendar era result must be a string or undefined');
    }
    return result;
  },
  CalendarEraYear: (calendar, dateLike) => {
    const eraYear = ES.GetMethod(calendar, 'eraYear');
    let result = ES.Call(eraYear, calendar, [dateLike]);
    if (result === undefined) {
      return result;
    }
    if (typeof result !== 'number') {
      throw new TypeError('calendar eraYear result must be an integer or undefined');
    }
    if (!IsIntegralNumber(result)) {
      throw new RangeError('calendar eraYear result must be an integer or undefined');
    }
    return result;
  },
  CalendarDayOfWeek: (calendar, dateLike) => {
    const dayOfWeek = ES.GetMethod(calendar, 'dayOfWeek');
    const result = ES.Call(dayOfWeek, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar dayOfWeek result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar dayOfWeek result must be a positive integer');
    }
    return result;
  },
  CalendarDayOfYear: (calendar, dateLike) => {
    const dayOfYear = ES.GetMethod(calendar, 'dayOfYear');
    const result = ES.Call(dayOfYear, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar dayOfYear result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar dayOfYear result must be a positive integer');
    }
    return result;
  },
  CalendarWeekOfYear: (calendar, dateLike) => {
    const weekOfYear = ES.GetMethod(calendar, 'weekOfYear');
    const result = ES.Call(weekOfYear, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar weekOfYear result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar weekOfYear result must be a positive integer');
    }
    return result;
  },
  CalendarYearOfWeek: (calendar, dateLike) => {
    const yearOfWeek = ES.GetMethod(calendar, 'yearOfWeek');
    const result = ES.Call(yearOfWeek, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar yearOfWeek result must be an integer');
    }
    if (!IsIntegralNumber(result)) {
      throw new RangeError('calendar yearOfWeek result must be an integer');
    }
    return result;
  },
  CalendarDaysInWeek: (calendar, dateLike) => {
    const daysInWeek = ES.GetMethod(calendar, 'daysInWeek');
    const result = ES.Call(daysInWeek, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar daysInWeek result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar daysInWeek result must be a positive integer');
    }
    return result;
  },
  CalendarDaysInMonth: (calendar, dateLike) => {
    const daysInMonth = ES.GetMethod(calendar, 'daysInMonth');
    const result = ES.Call(daysInMonth, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar daysInMonth result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar daysInMonth result must be a positive integer');
    }
    return result;
  },
  CalendarDaysInYear: (calendar, dateLike) => {
    const daysInYear = ES.GetMethod(calendar, 'daysInYear');
    const result = ES.Call(daysInYear, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar daysInYear result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar daysInYear result must be a positive integer');
    }
    return result;
  },
  CalendarMonthsInYear: (calendar, dateLike) => {
    const monthsInYear = ES.GetMethod(calendar, 'monthsInYear');
    const result = ES.Call(monthsInYear, calendar, [dateLike]);
    if (typeof result !== 'number') {
      throw new TypeError('calendar monthsInYear result must be a positive integer');
    }
    if (!IsIntegralNumber(result) || result < 1) {
      throw new RangeError('calendar monthsInYear result must be a positive integer');
    }
    return result;
  },
  CalendarInLeapYear: (calendar, dateLike) => {
    const inLeapYear = ES.GetMethod(calendar, 'inLeapYear');
    const result = ES.Call(inLeapYear, calendar, [dateLike]);
    if (typeof result !== 'boolean') {
      throw new TypeError('calendar inLeapYear result must be a boolean');
    }
    return result;
  },

  ToTemporalCalendar: (calendarLike) => {
    if (ES.Type(calendarLike) === 'Object') {
      if (ES.IsTemporalCalendar(calendarLike)) return calendarLike;
      if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
      if (ES.IsTemporalTimeZone(calendarLike)) {
        throw new RangeError('Expected a calendar object but received a Temporal.TimeZone');
      }
      if (!('calendar' in calendarLike)) return calendarLike;
      calendarLike = calendarLike.calendar;
      if (ES.Type(calendarLike) === 'Object') {
        if (ES.IsTemporalTimeZone(calendarLike)) {
          throw new RangeError('Expected a calendar object as the calendar property but received a Temporal.TimeZone');
        }
        if (!('calendar' in calendarLike)) return calendarLike;
      }
    }
    const identifier = ES.ToString(calendarLike);
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    if (ES.IsBuiltinCalendar(identifier)) return new TemporalCalendar(identifier);
    let calendar;
    try {
      ({ calendar } = ES.ParseISODateTime(identifier));
    } catch {
      try {
        ({ calendar } = ES.ParseTemporalYearMonthString(identifier));
      } catch {
        ({ calendar } = ES.ParseTemporalMonthDayString(identifier));
      }
    }
    if (!calendar) calendar = 'iso8601';
    return new TemporalCalendar(calendar);
  },
  GetTemporalCalendarWithISODefault: (item) => {
    if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
    const { calendar } = item;
    if (calendar === undefined) return ES.GetISO8601Calendar();
    return ES.ToTemporalCalendar(calendar);
  },
  CalendarEquals: (one, two) => {
    if (one === two) return true;
    const cal1 = ES.ToString(one);
    const cal2 = ES.ToString(two);
    return cal1 === cal2;
  },
  // This operation is not in the spec, it implements the following:
  // "If ? CalendarEquals(one, two) is false, throw a RangeError exception."
  // This is so that we can build an informative error message without
  // re-getting the .id properties.
  CalendarEqualsOrThrow: (one, two, errorMessageAction) => {
    if (one === two) return true;
    const cal1 = ES.ToString(one);
    const cal2 = ES.ToString(two);
    if (cal1 !== cal2) {
      throw new RangeError(`cannot ${errorMessageAction} of ${cal1} and ${cal2} calendars`);
    }
  },
  ConsolidateCalendars: (one, two) => {
    if (one === two) return two;
    const sOne = ES.ToString(one);
    const sTwo = ES.ToString(two);
    if (sOne === sTwo || sOne === 'iso8601') {
      return two;
    } else if (sTwo === 'iso8601') {
      return one;
    } else {
      throw new RangeError('irreconcilable calendars');
    }
  },
  CalendarDateFromFields: (calendar, fields, options) => {
    const dateFromFields = ES.GetMethod(calendar, 'dateFromFields');
    const result = ES.Call(dateFromFields, calendar, [fields, options]);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  },
  CalendarYearMonthFromFields: (calendar, fields, options) => {
    const yearMonthFromFields = ES.GetMethod(calendar, 'yearMonthFromFields');
    const result = ES.Call(yearMonthFromFields, calendar, [fields, options]);
    if (!ES.IsTemporalYearMonth(result)) throw new TypeError('invalid result');
    return result;
  },
  CalendarMonthDayFromFields: (calendar, fields, options) => {
    const monthDayFromFields = ES.GetMethod(calendar, 'monthDayFromFields');
    const result = ES.Call(monthDayFromFields, calendar, [fields, options]);
    if (!ES.IsTemporalMonthDay(result)) throw new TypeError('invalid result');
    return result;
  },

  ToTemporalTimeZone: (temporalTimeZoneLike) => {
    if (ES.Type(temporalTimeZoneLike) === 'Object') {
      if (ES.IsTemporalTimeZone(temporalTimeZoneLike)) return temporalTimeZoneLike;
      if (ES.IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
      if (ES.IsTemporalCalendar(temporalTimeZoneLike)) {
        throw new RangeError('Expected a time zone object but received a Temporal.Calendar');
      }
      if (!('timeZone' in temporalTimeZoneLike)) return temporalTimeZoneLike;
      temporalTimeZoneLike = temporalTimeZoneLike.timeZone;
      if (ES.Type(temporalTimeZoneLike) === 'Object') {
        if (ES.IsTemporalCalendar(temporalTimeZoneLike)) {
          throw new RangeError('Expected a time zone object as the timeZone property but received a Temporal.Calendar');
        }
        if (!('timeZone' in temporalTimeZoneLike)) return temporalTimeZoneLike;
      }
    }
    const identifier = ES.ToString(temporalTimeZoneLike);
    const timeZone = ES.ParseTemporalTimeZone(identifier);
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    return new TemporalTimeZone(timeZone);
  },
  TimeZoneEquals: (one, two) => {
    if (one === two) return true;
    const tz1 = ES.ToString(one);
    const tz2 = ES.ToString(two);
    return tz1 === tz2;
  },
  TemporalDateTimeToDate: (dateTime) => {
    return ES.CreateTemporalDate(
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, CALENDAR)
    );
  },
  TemporalDateTimeToTime: (dateTime) => {
    const Time = GetIntrinsic('%Temporal.PlainTime%');
    return new Time(
      GetSlot(dateTime, ISO_HOUR),
      GetSlot(dateTime, ISO_MINUTE),
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND)
    );
  },
  GetOffsetNanosecondsFor: (timeZone, instant) => {
    const getOffsetNanosecondsFor = ES.GetMethod(timeZone, 'getOffsetNanosecondsFor');
    const offsetNs = ES.Call(getOffsetNanosecondsFor, timeZone, [instant]);
    if (typeof offsetNs !== 'number') {
      throw new TypeError('bad return from getOffsetNanosecondsFor');
    }
    if (!ES.IsIntegralNumber(offsetNs) || MathAbs(offsetNs) >= 86400e9) {
      throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
    }
    return offsetNs;
  },
  GetOffsetStringFor: (timeZone, instant) => {
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, instant);
    return ES.FormatTimeZoneOffsetString(offsetNs);
  },
  GetPlainDateTimeFor: (timeZone, instant, calendar) => {
    const ns = GetSlot(instant, EPOCHNANOSECONDS);
    const offsetNs = ES.GetOffsetNanosecondsFor(timeZone, instant);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.GetISOPartsFromEpoch(ns);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceISODateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond + offsetNs
    ));
    return ES.CreateTemporalDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
  },
  GetInstantFor: (timeZone, dateTime, disambiguation) => {
    const possibleInstants = ES.GetPossibleInstantsFor(timeZone, dateTime);
    return ES.DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation);
  },
  DisambiguatePossibleInstants: (possibleInstants, timeZone, dateTime, disambiguation) => {
    const Instant = GetIntrinsic('%Temporal.Instant%');
    const numInstants = possibleInstants.length;

    if (numInstants === 1) return possibleInstants[0];
    if (numInstants) {
      switch (disambiguation) {
        case 'compatible':
        // fall through because 'compatible' means 'earlier' for "fall back" transitions
        case 'earlier':
          return possibleInstants[0];
        case 'later':
          return possibleInstants[numInstants - 1];
        case 'reject': {
          throw new RangeError('multiple instants found');
        }
      }
    }

    const year = GetSlot(dateTime, ISO_YEAR);
    const month = GetSlot(dateTime, ISO_MONTH);
    const day = GetSlot(dateTime, ISO_DAY);
    const hour = GetSlot(dateTime, ISO_HOUR);
    const minute = GetSlot(dateTime, ISO_MINUTE);
    const second = GetSlot(dateTime, ISO_SECOND);
    const millisecond = GetSlot(dateTime, ISO_MILLISECOND);
    const microsecond = GetSlot(dateTime, ISO_MICROSECOND);
    const nanosecond = GetSlot(dateTime, ISO_NANOSECOND);
    const utcns = ES.GetUTCEpochNanoseconds(
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
    if (utcns === null) throw new RangeError('DateTime outside of supported range');
    const dayBefore = new Instant(utcns.minus(86400e9));
    const dayAfter = new Instant(utcns.plus(86400e9));
    const offsetBefore = ES.GetOffsetNanosecondsFor(timeZone, dayBefore);
    const offsetAfter = ES.GetOffsetNanosecondsFor(timeZone, dayAfter);
    const nanoseconds = offsetAfter - offsetBefore;
    switch (disambiguation) {
      case 'earlier': {
        const calendar = GetSlot(dateTime, CALENDAR);
        const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
        const earlier = ES.AddDateTime(
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
          calendar,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          -nanoseconds,
          undefined
        );
        const earlierPlainDateTime = new PlainDateTime(
          earlier.year,
          earlier.month,
          earlier.day,
          earlier.hour,
          earlier.minute,
          earlier.second,
          earlier.millisecond,
          earlier.microsecond,
          earlier.nanosecond,
          calendar
        );
        return ES.GetPossibleInstantsFor(timeZone, earlierPlainDateTime)[0];
      }
      case 'compatible':
      // fall through because 'compatible' means 'later' for "spring forward" transitions
      case 'later': {
        const calendar = GetSlot(dateTime, CALENDAR);
        const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
        const later = ES.AddDateTime(
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond,
          microsecond,
          nanosecond,
          calendar,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          nanoseconds,
          undefined
        );
        const laterPlainDateTime = new PlainDateTime(
          later.year,
          later.month,
          later.day,
          later.hour,
          later.minute,
          later.second,
          later.millisecond,
          later.microsecond,
          later.nanosecond,
          calendar
        );
        const possible = ES.GetPossibleInstantsFor(timeZone, laterPlainDateTime);
        return possible[possible.length - 1];
      }
      case 'reject': {
        throw new RangeError('no such instant found');
      }
    }
    throw new Error(`assertion failed: invalid disambiguation value ${disambiguation}`);
  },
  GetPossibleInstantsFor: (timeZone, dateTime) => {
    let getPossibleInstantsFor = ES.GetMethod(timeZone, 'getPossibleInstantsFor');
    const possibleInstants = ES.Call(getPossibleInstantsFor, timeZone, [dateTime]);
    const result = [];
    for (const instant of possibleInstants) {
      if (!ES.IsTemporalInstant(instant)) {
        throw new TypeError('bad return from getPossibleInstantsFor');
      }
      ES.Call(ArrayPrototypePush, result, [instant]);
    }
    return result;
  },
  ISOYearString: (year) => {
    let yearString;
    if (year < 0 || year > 9999) {
      let sign = year < 0 ? '-' : '+';
      let yearNumber = MathAbs(year);
      yearString = sign + `000000${yearNumber}`.slice(-6);
    } else {
      yearString = `0000${year}`.slice(-4);
    }
    return yearString;
  },
  ISODateTimePartString: (part) => `00${part}`.slice(-2),
  FormatSecondsStringPart: (second, millisecond, microsecond, nanosecond, precision) => {
    if (precision === 'minute') return '';

    const secs = `:${ES.ISODateTimePartString(second)}`;
    let fraction = millisecond * 1e6 + microsecond * 1e3 + nanosecond;

    if (precision === 'auto') {
      if (fraction === 0) return secs;
      fraction = `${fraction}`.padStart(9, '0');
      while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1);
    } else {
      if (precision === 0) return secs;
      fraction = `${fraction}`.padStart(9, '0').slice(0, precision);
    }
    return `${secs}.${fraction}`;
  },
  TemporalInstantToString: (instant, timeZone, precision) => {
    let outputTimeZone = timeZone;
    if (outputTimeZone === undefined) {
      const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
      outputTimeZone = new TemporalTimeZone('UTC');
    }
    const iso = ES.GetISO8601Calendar();
    const dateTime = ES.GetPlainDateTimeFor(outputTimeZone, instant, iso);
    const year = ES.ISOYearString(GetSlot(dateTime, ISO_YEAR));
    const month = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
    const day = ES.ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
    const hour = ES.ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
    const minute = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
    const seconds = ES.FormatSecondsStringPart(
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND),
      precision
    );
    let timeZoneString = 'Z';
    if (timeZone !== undefined) {
      const offsetNs = ES.GetOffsetNanosecondsFor(outputTimeZone, instant);
      timeZoneString = ES.FormatISOTimeZoneOffsetString(offsetNs);
    }
    return `${year}-${month}-${day}T${hour}:${minute}${seconds}${timeZoneString}`;
  },
  TemporalDurationToString: (duration, precision = 'auto', options = undefined) => {
    function formatNumber(num) {
      if (num <= NumberMaxSafeInteger) return num.toString(10);
      return bigInt(num).toString();
    }

    const years = GetSlot(duration, YEARS);
    const months = GetSlot(duration, MONTHS);
    const weeks = GetSlot(duration, WEEKS);
    const days = GetSlot(duration, DAYS);
    const hours = GetSlot(duration, HOURS);
    const minutes = GetSlot(duration, MINUTES);
    let seconds = GetSlot(duration, SECONDS);
    let ms = GetSlot(duration, MILLISECONDS);
    let µs = GetSlot(duration, MICROSECONDS);
    let ns = GetSlot(duration, NANOSECONDS);
    const sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, ms, µs, ns);

    if (options) {
      const { unit, increment, roundingMode } = options;
      ({
        seconds,
        milliseconds: ms,
        microseconds: µs,
        nanoseconds: ns
      } = ES.RoundDuration(0, 0, 0, 0, 0, 0, seconds, ms, µs, ns, increment, unit, roundingMode));
    }

    const dateParts = [];
    if (years) dateParts.push(`${formatNumber(MathAbs(years))}Y`);
    if (months) dateParts.push(`${formatNumber(MathAbs(months))}M`);
    if (weeks) dateParts.push(`${formatNumber(MathAbs(weeks))}W`);
    if (days) dateParts.push(`${formatNumber(MathAbs(days))}D`);

    const timeParts = [];
    if (hours) timeParts.push(`${formatNumber(MathAbs(hours))}H`);
    if (minutes) timeParts.push(`${formatNumber(MathAbs(minutes))}M`);

    const secondParts = [];
    let total = ES.TotalDurationNanoseconds(0, 0, 0, seconds, ms, µs, ns, 0);
    ({ quotient: total, remainder: ns } = total.divmod(1000));
    ({ quotient: total, remainder: µs } = total.divmod(1000));
    ({ quotient: seconds, remainder: ms } = total.divmod(1000));
    let fraction = MathAbs(ms.toJSNumber()) * 1e6 + MathAbs(µs.toJSNumber()) * 1e3 + MathAbs(ns.toJSNumber());
    let decimalPart;
    if (precision === 'auto') {
      if (fraction !== 0) {
        decimalPart = `${fraction}`.padStart(9, '0');
        while (decimalPart[decimalPart.length - 1] === '0') {
          decimalPart = decimalPart.slice(0, -1);
        }
      }
    } else if (precision !== 0) {
      decimalPart = `${fraction}`.padStart(9, '0').slice(0, precision);
    }
    if (decimalPart) secondParts.unshift('.', decimalPart);
    if (!seconds.isZero() || secondParts.length || precision !== 'auto') secondParts.unshift(seconds.abs().toString());
    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
    if (timeParts.length) timeParts.unshift('T');
    if (!dateParts.length && !timeParts.length) return 'PT0S';
    return `${sign < 0 ? '-' : ''}P${dateParts.join('')}${timeParts.join('')}`;
  },
  TemporalDateToString: (date, showCalendar = 'auto') => {
    const year = ES.ISOYearString(GetSlot(date, ISO_YEAR));
    const month = ES.ISODateTimePartString(GetSlot(date, ISO_MONTH));
    const day = ES.ISODateTimePartString(GetSlot(date, ISO_DAY));
    const calendar = ES.MaybeFormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
    return `${year}-${month}-${day}${calendar}`;
  },
  TemporalDateTimeToString: (dateTime, precision, showCalendar = 'auto', options = undefined) => {
    let year = GetSlot(dateTime, ISO_YEAR);
    let month = GetSlot(dateTime, ISO_MONTH);
    let day = GetSlot(dateTime, ISO_DAY);
    let hour = GetSlot(dateTime, ISO_HOUR);
    let minute = GetSlot(dateTime, ISO_MINUTE);
    let second = GetSlot(dateTime, ISO_SECOND);
    let millisecond = GetSlot(dateTime, ISO_MILLISECOND);
    let microsecond = GetSlot(dateTime, ISO_MICROSECOND);
    let nanosecond = GetSlot(dateTime, ISO_NANOSECOND);

    if (options) {
      const { unit, increment, roundingMode } = options;
      ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundISODateTime(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        increment,
        unit,
        roundingMode
      ));
    }

    year = ES.ISOYearString(year);
    month = ES.ISODateTimePartString(month);
    day = ES.ISODateTimePartString(day);
    hour = ES.ISODateTimePartString(hour);
    minute = ES.ISODateTimePartString(minute);
    const seconds = ES.FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
    const calendar = ES.MaybeFormatCalendarAnnotation(GetSlot(dateTime, CALENDAR), showCalendar);
    return `${year}-${month}-${day}T${hour}:${minute}${seconds}${calendar}`;
  },
  TemporalMonthDayToString: (monthDay, showCalendar = 'auto') => {
    const month = ES.ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
    const day = ES.ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
    let resultString = `${month}-${day}`;
    const calendar = GetSlot(monthDay, CALENDAR);
    const calendarID = ES.ToString(calendar);
    if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
      const year = ES.ISOYearString(GetSlot(monthDay, ISO_YEAR));
      resultString = `${year}-${resultString}`;
    }
    const calendarString = ES.FormatCalendarAnnotation(calendarID, showCalendar);
    if (calendarString) resultString += calendarString;
    return resultString;
  },
  TemporalYearMonthToString: (yearMonth, showCalendar = 'auto') => {
    const year = ES.ISOYearString(GetSlot(yearMonth, ISO_YEAR));
    const month = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
    let resultString = `${year}-${month}`;
    const calendar = GetSlot(yearMonth, CALENDAR);
    const calendarID = ES.ToString(calendar);
    if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
      const day = ES.ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
      resultString += `-${day}`;
    }
    const calendarString = ES.FormatCalendarAnnotation(calendarID, showCalendar);
    if (calendarString) resultString += calendarString;
    return resultString;
  },
  TemporalZonedDateTimeToString: (
    zdt,
    precision,
    showCalendar = 'auto',
    showTimeZone = 'auto',
    showOffset = 'auto',
    options = undefined
  ) => {
    let instant = GetSlot(zdt, INSTANT);

    if (options) {
      const { unit, increment, roundingMode } = options;
      const ns = ES.RoundInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
      instant = new TemporalInstant(ns);
    }

    const tz = GetSlot(zdt, TIME_ZONE);
    const iso = ES.GetISO8601Calendar();
    const dateTime = ES.GetPlainDateTimeFor(tz, instant, iso);

    const year = ES.ISOYearString(GetSlot(dateTime, ISO_YEAR));
    const month = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
    const day = ES.ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
    const hour = ES.ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
    const minute = ES.ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
    const seconds = ES.FormatSecondsStringPart(
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND),
      precision
    );
    let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`;
    if (showOffset !== 'never') {
      const offsetNs = ES.GetOffsetNanosecondsFor(tz, instant);
      result += ES.FormatISOTimeZoneOffsetString(offsetNs);
    }
    if (showTimeZone !== 'never') {
      const flag = showTimeZone === 'critical' ? '!' : '';
      result += `[${flag}${tz}]`;
    }
    result += ES.MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
    return result;
  },

  IsTimeZoneOffsetString: (string) => {
    return OFFSET.test(String(string));
  },
  ParseTimeZoneOffsetString: (string) => {
    const match = OFFSET.exec(String(string));
    if (!match) {
      throw new RangeError(`invalid time zone offset: ${string}`);
    }
    const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
    const hours = +match[2];
    const minutes = +(match[3] || 0);
    const seconds = +(match[4] || 0);
    const nanoseconds = +((match[5] || 0) + '000000000').slice(0, 9);
    return sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
  },
  GetCanonicalTimeZoneIdentifier: (timeZoneIdentifier) => {
    if (ES.IsTimeZoneOffsetString(timeZoneIdentifier)) {
      const offsetNs = ES.ParseTimeZoneOffsetString(timeZoneIdentifier);
      return ES.FormatTimeZoneOffsetString(offsetNs);
    }
    const formatter = getIntlDateTimeFormatEnUsForTimeZone(String(timeZoneIdentifier));
    return formatter.resolvedOptions().timeZone;
  },
  GetNamedTimeZoneOffsetNanoseconds: (id, epochNanoseconds) => {
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
      ES.GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
    const utc = ES.GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (utc === null) throw new RangeError('Date outside of supported range');
    return +utc.minus(epochNanoseconds);
  },
  FormatTimeZoneOffsetString: (offsetNanoseconds) => {
    const sign = offsetNanoseconds < 0 ? '-' : '+';
    offsetNanoseconds = MathAbs(offsetNanoseconds);
    const nanoseconds = offsetNanoseconds % 1e9;
    const seconds = MathFloor(offsetNanoseconds / 1e9) % 60;
    const minutes = MathFloor(offsetNanoseconds / 60e9) % 60;
    const hours = MathFloor(offsetNanoseconds / 3600e9);

    const hourString = ES.ISODateTimePartString(hours);
    const minuteString = ES.ISODateTimePartString(minutes);
    const secondString = ES.ISODateTimePartString(seconds);
    let post = '';
    if (nanoseconds) {
      let fraction = `${nanoseconds}`.padStart(9, '0');
      while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1);
      post = `:${secondString}.${fraction}`;
    } else if (seconds) {
      post = `:${secondString}`;
    }
    return `${sign}${hourString}:${minuteString}${post}`;
  },
  FormatISOTimeZoneOffsetString: (offsetNanoseconds) => {
    offsetNanoseconds = ES.RoundNumberToIncrement(bigInt(offsetNanoseconds), 60e9, 'halfExpand').toJSNumber();
    const sign = offsetNanoseconds < 0 ? '-' : '+';
    offsetNanoseconds = MathAbs(offsetNanoseconds);
    const minutes = (offsetNanoseconds / 60e9) % 60;
    const hours = MathFloor(offsetNanoseconds / 3600e9);

    const hourString = ES.ISODateTimePartString(hours);
    const minuteString = ES.ISODateTimePartString(minutes);
    return `${sign}${hourString}:${minuteString}`;
  },
  GetUTCEpochNanoseconds: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    // Note: Date.UTC() interprets one and two-digit years as being in the
    // 20th century, so don't use it
    const legacyDate = new Date();
    legacyDate.setUTCHours(hour, minute, second, millisecond);
    legacyDate.setUTCFullYear(year, month - 1, day);
    const ms = legacyDate.getTime();
    if (NumberIsNaN(ms)) return null;
    let ns = bigInt(ms).multiply(1e6);
    ns = ns.plus(bigInt(microsecond).multiply(1e3));
    ns = ns.plus(bigInt(nanosecond));
    if (ns.lesser(NS_MIN) || ns.greater(NS_MAX)) return null;
    return ns;
  },
  GetISOPartsFromEpoch: (epochNanoseconds) => {
    const { quotient, remainder } = bigInt(epochNanoseconds).divmod(1e6);
    let epochMilliseconds = +quotient;
    let nanos = +remainder;
    if (nanos < 0) {
      nanos += 1e6;
      epochMilliseconds -= 1;
    }
    const microsecond = MathFloor(nanos / 1e3) % 1e3;
    const nanosecond = nanos % 1e3;

    const item = new Date(epochMilliseconds);
    const year = item.getUTCFullYear();
    const month = item.getUTCMonth() + 1;
    const day = item.getUTCDate();
    const hour = item.getUTCHours();
    const minute = item.getUTCMinutes();
    const second = item.getUTCSeconds();
    const millisecond = item.getUTCMilliseconds();

    return { epochMilliseconds, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  GetNamedTimeZoneDateTimeParts: (id, epochNanoseconds) => {
    const { epochMilliseconds, millisecond, microsecond, nanosecond } = ES.GetISOPartsFromEpoch(epochNanoseconds);
    const { year, month, day, hour, minute, second } = ES.GetFormatterParts(id, epochMilliseconds);
    return ES.BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  },
  GetNamedTimeZoneNextTransition: (id, epochNanoseconds) => {
    const uppercap = ES.SystemUTCEpochNanoSeconds().plus(DAY_NANOS.multiply(366));
    let leftNanos = epochNanoseconds;
    let leftOffsetNs = ES.GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
    let rightNanos = leftNanos;
    let rightOffsetNs = leftOffsetNs;
    while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
      rightNanos = bigInt(leftNanos).plus(DAY_NANOS.multiply(2 * 7));
      rightOffsetNs = ES.GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
      if (leftOffsetNs === rightOffsetNs) {
        leftNanos = rightNanos;
      }
    }
    if (leftOffsetNs === rightOffsetNs) return null;
    const result = bisect(
      (epochNs) => ES.GetNamedTimeZoneOffsetNanoseconds(id, epochNs),
      leftNanos,
      rightNanos,
      leftOffsetNs,
      rightOffsetNs
    );
    return result;
  },
  GetNamedTimeZonePreviousTransition: (id, epochNanoseconds) => {
    // Optimization: if the instant is more than a year in the future and there
    // are no transitions between the present day and a year from now, assume
    // there are none after
    const now = ES.SystemUTCEpochNanoSeconds();
    const yearLater = now.plus(DAY_NANOS.multiply(366));
    if (epochNanoseconds.gt(yearLater)) {
      const prevBeforeNextYear = ES.GetNamedTimeZonePreviousTransition(id, yearLater);
      if (prevBeforeNextYear === null || prevBeforeNextYear.lt(now)) {
        return prevBeforeNextYear;
      }
    }

    const lowercap = BEFORE_FIRST_DST; // 1847-01-01T00:00:00Z
    let rightNanos = bigInt(epochNanoseconds).minus(1);
    let rightOffsetNs = ES.GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
    let leftNanos = rightNanos;
    let leftOffsetNs = rightOffsetNs;
    while (rightOffsetNs === leftOffsetNs && bigInt(rightNanos).compare(lowercap) === 1) {
      leftNanos = bigInt(rightNanos).minus(DAY_NANOS.multiply(2 * 7));
      leftOffsetNs = ES.GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
      if (rightOffsetNs === leftOffsetNs) {
        rightNanos = leftNanos;
      }
    }
    if (rightOffsetNs === leftOffsetNs) return null;
    const result = bisect(
      (epochNs) => ES.GetNamedTimeZoneOffsetNanoseconds(id, epochNs),
      leftNanos,
      rightNanos,
      leftOffsetNs,
      rightOffsetNs
    );
    return result;
  },
  GetFormatterParts: (timeZone, epochMilliseconds) => {
    const formatter = getIntlDateTimeFormatEnUsForTimeZone(timeZone);
    // Using `format` instead of `formatToParts` for compatibility with older clients
    const datetime = formatter.format(new Date(epochMilliseconds));
    const splits = datetime.split(/[^\w]+/);
    const month = splits[0];
    const day = splits[1];
    const year = splits[2];
    const era = splits[3];
    const hour = splits[4];
    const minute = splits[5];
    const second = splits[6];
    return {
      year: era.toUpperCase().startsWith('B') ? -year + 1 : +year,
      month: +month,
      day: +day,
      hour: hour === '24' ? 0 : +hour, // bugs.chromium.org/p/chromium/issues/detail?id=1045791
      minute: +minute,
      second: +second
    };
  },
  GetNamedTimeZoneEpochNanoseconds: (
    id,
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
    let ns = ES.GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (ns === null) throw new RangeError('DateTime outside of supported range');
    let nsEarlier = ns.minus(DAY_NANOS);
    if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
    let nsLater = ns.plus(DAY_NANOS);
    if (nsLater.greater(NS_MAX)) nsLater = ns;
    const earliest = ES.GetNamedTimeZoneOffsetNanoseconds(id, nsEarlier);
    const latest = ES.GetNamedTimeZoneOffsetNanoseconds(id, nsLater);
    const found = earliest === latest ? [earliest] : [earliest, latest];
    return found
      .map((offsetNanoseconds) => {
        const epochNanoseconds = bigInt(ns).minus(offsetNanoseconds);
        const parts = ES.GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
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
  },
  LeapYear: (year) => {
    if (undefined === year) return false;
    const isDiv4 = year % 4 === 0;
    const isDiv100 = year % 100 === 0;
    const isDiv400 = year % 400 === 0;
    return isDiv4 && (!isDiv100 || isDiv400);
  },
  ISODaysInMonth: (year, month) => {
    const DoM = {
      standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    };
    return DoM[ES.LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
  },
  DayOfWeek: (year, month, day) => {
    const m = month + (month < 3 ? 10 : -2);
    const Y = year - (month < 3 ? 1 : 0);

    const c = MathFloor(Y / 100);
    const y = Y - c * 100;
    const d = day;

    const pD = d;
    const pM = MathFloor(2.6 * m - 0.2);
    const pY = y + MathFloor(y / 4);
    const pC = MathFloor(c / 4) - 2 * c;

    const dow = (pD + pM + pY + pC) % 7;

    return dow + (dow <= 0 ? 7 : 0);
  },
  DayOfYear: (year, month, day) => {
    let days = day;
    for (let m = month - 1; m > 0; m--) {
      days += ES.ISODaysInMonth(year, m);
    }
    return days;
  },
  WeekOfYear: (year, month, day) => {
    let doy = ES.DayOfYear(year, month, day);
    let dow = ES.DayOfWeek(year, month, day) || 7;
    let doj = ES.DayOfWeek(year, 1, 1);

    const week = MathFloor((doy - dow + 10) / 7);

    if (week < 1) {
      if (doj === 5 || (doj === 6 && ES.LeapYear(year - 1))) {
        return { week: 53, year: year - 1 };
      } else {
        return { week: 52, year: year - 1 };
      }
    }
    if (week === 53) {
      if ((ES.LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
        return { week: 1, year: year + 1 };
      }
    }

    return { week, year };
  },
  DurationSign: (y, mon, w, d, h, min, s, ms, µs, ns) => {
    const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
    for (let index = 0; index < fields.length; index++) {
      const prop = fields[index];
      if (prop !== 0) return prop < 0 ? -1 : 1;
    }
    return 0;
  },

  BalanceISOYearMonth: (year, month) => {
    if (!NumberIsFinite(year) || !NumberIsFinite(month)) throw new RangeError('infinity is out of range');
    month -= 1;
    year += MathFloor(month / 12);
    month %= 12;
    if (month < 0) month += 12;
    month += 1;
    return { year, month };
  },
  BalanceISODate: (year, month, day) => {
    if (!NumberIsFinite(day)) throw new RangeError('infinity is out of range');
    ({ year, month } = ES.BalanceISOYearMonth(year, month));
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
      ({ year, month } = ES.BalanceISOYearMonth(year, month - 1));
      day += ES.ISODaysInMonth(year, month);
    }
    while (day > ES.ISODaysInMonth(year, month)) {
      day -= ES.ISODaysInMonth(year, month);
      ({ year, month } = ES.BalanceISOYearMonth(year, month + 1));
    }

    return { year, month, day };
  },
  BalanceISODateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    let deltaDays;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    ({ year, month, day } = ES.BalanceISODate(year, month, day + deltaDays));
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  BalanceTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    hour = bigInt(hour);
    minute = bigInt(minute);
    second = bigInt(second);
    millisecond = bigInt(millisecond);
    microsecond = bigInt(microsecond);
    nanosecond = bigInt(nanosecond);

    let quotient;

    ({ quotient, remainder: nanosecond } = ES.NonNegativeBigIntDivmod(nanosecond, 1000));
    microsecond = microsecond.add(quotient);

    ({ quotient, remainder: microsecond } = ES.NonNegativeBigIntDivmod(microsecond, 1000));
    millisecond = millisecond.add(quotient);

    ({ quotient, remainder: millisecond } = ES.NonNegativeBigIntDivmod(millisecond, 1000));
    second = second.add(quotient);

    ({ quotient, remainder: second } = ES.NonNegativeBigIntDivmod(second, 60));
    minute = minute.add(quotient);

    ({ quotient, remainder: minute } = ES.NonNegativeBigIntDivmod(minute, 60));
    hour = hour.add(quotient);

    ({ quotient, remainder: hour } = ES.NonNegativeBigIntDivmod(hour, 24));

    return {
      deltaDays: quotient.toJSNumber(),
      hour: hour.toJSNumber(),
      minute: minute.toJSNumber(),
      second: second.toJSNumber(),
      millisecond: millisecond.toJSNumber(),
      microsecond: microsecond.toJSNumber(),
      nanosecond: nanosecond.toJSNumber()
    };
  },
  TotalDurationNanoseconds: (days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, offsetShift) => {
    if (days !== 0) nanoseconds = bigInt(nanoseconds).subtract(offsetShift);
    hours = bigInt(hours).add(bigInt(days).multiply(24));
    minutes = bigInt(minutes).add(hours.multiply(60));
    seconds = bigInt(seconds).add(minutes.multiply(60));
    milliseconds = bigInt(milliseconds).add(seconds.multiply(1000));
    microseconds = bigInt(microseconds).add(milliseconds.multiply(1000));
    return bigInt(nanoseconds).add(microseconds.multiply(1000));
  },
  NanosecondsToDays: (nanoseconds, relativeTo) => {
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const sign = MathSign(nanoseconds);
    nanoseconds = bigInt(nanoseconds);
    let dayLengthNs = 86400e9;
    if (sign === 0) return { days: 0, nanoseconds: bigInt.zero, dayLengthNs };
    if (!ES.IsTemporalZonedDateTime(relativeTo)) {
      let days;
      ({ quotient: days, remainder: nanoseconds } = nanoseconds.divmod(dayLengthNs));
      days = days.toJSNumber();
      return { days, nanoseconds, dayLengthNs };
    }

    const startNs = GetSlot(relativeTo, EPOCHNANOSECONDS);
    const start = GetSlot(relativeTo, INSTANT);
    const endNs = startNs.add(nanoseconds);
    const end = new TemporalInstant(endNs);
    const timeZone = GetSlot(relativeTo, TIME_ZONE);
    const calendar = GetSlot(relativeTo, CALENDAR);

    // Find the difference in days only.
    const dtStart = ES.GetPlainDateTimeFor(timeZone, start, calendar);
    const dtEnd = ES.GetPlainDateTimeFor(timeZone, end, calendar);
    let { days } = ES.DifferenceISODateTime(
      GetSlot(dtStart, ISO_YEAR),
      GetSlot(dtStart, ISO_MONTH),
      GetSlot(dtStart, ISO_DAY),
      GetSlot(dtStart, ISO_HOUR),
      GetSlot(dtStart, ISO_MINUTE),
      GetSlot(dtStart, ISO_SECOND),
      GetSlot(dtStart, ISO_MILLISECOND),
      GetSlot(dtStart, ISO_MICROSECOND),
      GetSlot(dtStart, ISO_NANOSECOND),
      GetSlot(dtEnd, ISO_YEAR),
      GetSlot(dtEnd, ISO_MONTH),
      GetSlot(dtEnd, ISO_DAY),
      GetSlot(dtEnd, ISO_HOUR),
      GetSlot(dtEnd, ISO_MINUTE),
      GetSlot(dtEnd, ISO_SECOND),
      GetSlot(dtEnd, ISO_MILLISECOND),
      GetSlot(dtEnd, ISO_MICROSECOND),
      GetSlot(dtEnd, ISO_NANOSECOND),
      calendar,
      'day',
      ObjectCreate(null)
    );
    let intermediateNs = ES.AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days, 0, 0, 0, 0, 0, 0);
    // may disambiguate

    // If clock time after addition was in the middle of a skipped period, the
    // endpoint was disambiguated to a later clock time. So it's possible that
    // the resulting disambiguated result is later than endNs. If so, then back
    // up one day and try again. Repeat if necessary (some transitions are
    // > 24 hours) until either there's zero days left or the date duration is
    // back inside the period where it belongs. Note that this case only can
    // happen for positive durations because the only direction that
    // `disambiguation: 'compatible'` can change clock time is forwards.
    days = bigInt(days);
    if (sign === 1) {
      while (days.greater(0) && intermediateNs.greater(endNs)) {
        days = days.prev();
        intermediateNs = ES.AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days.toJSNumber(), 0, 0, 0, 0, 0, 0);
        // may do disambiguation
      }
    }
    nanoseconds = endNs.subtract(intermediateNs);

    let isOverflow = false;
    let relativeInstant = new TemporalInstant(intermediateNs);
    do {
      // calculate length of the next day (day that contains the time remainder)
      const oneDayFartherNs = ES.AddZonedDateTime(relativeInstant, timeZone, calendar, 0, 0, 0, sign, 0, 0, 0, 0, 0, 0);
      const relativeNs = GetSlot(relativeInstant, EPOCHNANOSECONDS);
      dayLengthNs = oneDayFartherNs.subtract(relativeNs).toJSNumber();
      isOverflow = nanoseconds.subtract(dayLengthNs).multiply(sign).geq(0);
      if (isOverflow) {
        nanoseconds = nanoseconds.subtract(dayLengthNs);
        relativeInstant = new TemporalInstant(oneDayFartherNs);
        days = days.add(sign);
      }
    } while (isOverflow);
    if (!days.isZero() && MathSign(days.toJSNumber()) != sign) {
      throw new RangeError('Time zone or calendar converted nanoseconds into a number of days with the opposite sign');
    }
    if (!nanoseconds.isZero() && MathSign(nanoseconds.toJSNumber()) != sign) {
      if (nanoseconds.lt(0) && sign === 1) {
        throw new Error('assert not reached');
      }
      throw new RangeError('Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign');
    }
    if (nanoseconds.abs().geq(MathAbs(dayLengthNs))) {
      throw new Error('assert not reached');
    }
    return { days: days.toJSNumber(), nanoseconds, dayLengthNs: MathAbs(dayLengthNs) };
  },
  BalanceDuration: (
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    largestUnit,
    relativeTo = undefined
  ) => {
    let result = ES.BalancePossiblyInfiniteDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      largestUnit,
      relativeTo
    );
    if (result === 'positive overflow' || result === 'negative overflow') {
      throw new RangeError('Duration out of range');
    } else {
      return result;
    }
  },
  BalancePossiblyInfiniteDuration: (
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    largestUnit,
    relativeTo = undefined
  ) => {
    if (ES.IsTemporalZonedDateTime(relativeTo)) {
      const endNs = ES.AddZonedDateTime(
        GetSlot(relativeTo, INSTANT),
        GetSlot(relativeTo, TIME_ZONE),
        GetSlot(relativeTo, CALENDAR),
        0,
        0,
        0,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds
      );
      const startNs = GetSlot(relativeTo, EPOCHNANOSECONDS);
      nanoseconds = endNs.subtract(startNs);
    } else {
      nanoseconds = ES.TotalDurationNanoseconds(
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        0
      );
    }
    if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week' || largestUnit === 'day') {
      ({ days, nanoseconds } = ES.NanosecondsToDays(nanoseconds, relativeTo));
    } else {
      days = 0;
    }

    const sign = nanoseconds.lesser(0) ? -1 : 1;
    nanoseconds = nanoseconds.abs();
    microseconds = milliseconds = seconds = minutes = hours = bigInt.zero;

    switch (largestUnit) {
      case 'year':
      case 'month':
      case 'week':
      case 'day':
      case 'hour':
        ({ quotient: microseconds, remainder: nanoseconds } = nanoseconds.divmod(1000));
        ({ quotient: milliseconds, remainder: microseconds } = microseconds.divmod(1000));
        ({ quotient: seconds, remainder: milliseconds } = milliseconds.divmod(1000));
        ({ quotient: minutes, remainder: seconds } = seconds.divmod(60));
        ({ quotient: hours, remainder: minutes } = minutes.divmod(60));
        break;
      case 'minute':
        ({ quotient: microseconds, remainder: nanoseconds } = nanoseconds.divmod(1000));
        ({ quotient: milliseconds, remainder: microseconds } = microseconds.divmod(1000));
        ({ quotient: seconds, remainder: milliseconds } = milliseconds.divmod(1000));
        ({ quotient: minutes, remainder: seconds } = seconds.divmod(60));
        break;
      case 'second':
        ({ quotient: microseconds, remainder: nanoseconds } = nanoseconds.divmod(1000));
        ({ quotient: milliseconds, remainder: microseconds } = microseconds.divmod(1000));
        ({ quotient: seconds, remainder: milliseconds } = milliseconds.divmod(1000));
        break;
      case 'millisecond':
        ({ quotient: microseconds, remainder: nanoseconds } = nanoseconds.divmod(1000));
        ({ quotient: milliseconds, remainder: microseconds } = microseconds.divmod(1000));
        break;
      case 'microsecond':
        ({ quotient: microseconds, remainder: nanoseconds } = nanoseconds.divmod(1000));
        break;
      case 'nanosecond':
        break;
      default:
        throw new Error('assert not reached');
    }

    hours = hours.toJSNumber() * sign;
    minutes = minutes.toJSNumber() * sign;
    seconds = seconds.toJSNumber() * sign;
    milliseconds = milliseconds.toJSNumber() * sign;
    microseconds = microseconds.toJSNumber() * sign;
    nanoseconds = nanoseconds.toJSNumber() * sign;

    if (
      !NumberIsFinite(days) ||
      !NumberIsFinite(hours) ||
      !NumberIsFinite(minutes) ||
      !NumberIsFinite(seconds) ||
      !NumberIsFinite(milliseconds) ||
      !NumberIsFinite(microseconds) ||
      !NumberIsFinite(nanoseconds)
    ) {
      if (sign === 1) {
        return 'positive overflow';
      } else if (sign === -1) {
        return 'negative overflow';
      }
    }
    return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  UnbalanceDurationRelative: (years, months, weeks, days, largestUnit, relativeTo) => {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    if (sign === 0) return { years, months, weeks, days };

    let calendar;
    if (relativeTo) {
      relativeTo = ES.ToTemporalDate(relativeTo);
      calendar = GetSlot(relativeTo, CALENDAR);
    }

    const oneYear = new TemporalDuration(sign);
    const oneMonth = new TemporalDuration(0, sign);
    const oneWeek = new TemporalDuration(0, 0, sign);

    // Perform arithmetic in the mathematical integer domain
    years = bigInt(years);
    months = bigInt(months);
    weeks = bigInt(weeks);
    days = bigInt(days);

    switch (largestUnit) {
      case 'year':
        // no-op
        break;
      case 'month':
        {
          if (!calendar) throw new RangeError('a starting point is required for months balancing');
          // balance years down to months
          const dateAdd = ES.GetMethod(calendar, 'dateAdd');
          const dateUntil = ES.GetMethod(calendar, 'dateUntil');
          while (!years.abs().isZero()) {
            const newRelativeTo = ES.CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
            const untilOptions = ObjectCreate(null);
            untilOptions.largestUnit = 'month';
            const untilResult = ES.CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
            const oneYearMonths = GetSlot(untilResult, MONTHS);
            relativeTo = newRelativeTo;
            months = months.add(oneYearMonths);
            years = years.subtract(sign);
          }
        }
        break;
      case 'week':
        {
          if (!calendar) throw new RangeError('a starting point is required for weeks balancing');
          const dateAdd = ES.GetMethod(calendar, 'dateAdd');
          // balance years down to days
          while (!years.abs().isZero()) {
            let oneYearDays;
            ({ relativeTo, days: oneYearDays } = ES.MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
            days = days.add(oneYearDays);
            years = years.subtract(sign);
          }

          // balance months down to days
          while (!months.abs().isZero()) {
            let oneMonthDays;
            ({ relativeTo, days: oneMonthDays } = ES.MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
            days = days.add(oneMonthDays);
            months = months.subtract(sign);
          }
        }
        break;
      default:
        {
          if (years.isZero() && months.isZero() && weeks.isZero()) break;
          if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');
          const dateAdd = ES.GetMethod(calendar, 'dateAdd');
          // balance years down to days
          while (!years.abs().isZero()) {
            let oneYearDays;
            ({ relativeTo, days: oneYearDays } = ES.MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
            days = days.add(oneYearDays);
            years = years.subtract(sign);
          }

          // balance months down to days
          while (!months.abs().isZero()) {
            let oneMonthDays;
            ({ relativeTo, days: oneMonthDays } = ES.MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
            days = days.add(oneMonthDays);
            months = months.subtract(sign);
          }

          // balance weeks down to days
          while (!weeks.abs().isZero()) {
            let oneWeekDays;
            ({ relativeTo, days: oneWeekDays } = ES.MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
            days = days.add(oneWeekDays);
            weeks = weeks.subtract(sign);
          }
        }
        break;
    }

    return {
      years: years.toJSNumber(),
      months: months.toJSNumber(),
      weeks: weeks.toJSNumber(),
      days: days.toJSNumber()
    };
  },
  BalanceDurationRelative: (years, months, weeks, days, largestUnit, relativeTo) => {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    if (sign === 0) return { years, months, weeks, days };

    let calendar;
    if (relativeTo) {
      relativeTo = ES.ToTemporalDate(relativeTo);
      calendar = GetSlot(relativeTo, CALENDAR);
    }

    const oneYear = new TemporalDuration(sign);
    const oneMonth = new TemporalDuration(0, sign);
    const oneWeek = new TemporalDuration(0, 0, sign);

    // Perform arithmetic in the mathematical integer domain
    years = bigInt(years);
    months = bigInt(months);
    weeks = bigInt(weeks);
    days = bigInt(days);

    switch (largestUnit) {
      case 'year': {
        if (!calendar) throw new RangeError('a starting point is required for years balancing');
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        // balance days up to years
        let newRelativeTo, oneYearDays;
        ({ relativeTo: newRelativeTo, days: oneYearDays } = ES.MoveRelativeDate(
          calendar,
          relativeTo,
          oneYear,
          dateAdd
        ));
        while (days.abs().geq(MathAbs(oneYearDays))) {
          days = days.subtract(oneYearDays);
          years = years.add(sign);
          relativeTo = newRelativeTo;
          ({ relativeTo: newRelativeTo, days: oneYearDays } = ES.MoveRelativeDate(
            calendar,
            relativeTo,
            oneYear,
            dateAdd
          ));
        }

        // balance days up to months
        let oneMonthDays;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = ES.MoveRelativeDate(
          calendar,
          relativeTo,
          oneMonth,
          dateAdd
        ));
        while (days.abs().geq(MathAbs(oneMonthDays))) {
          days = days.subtract(oneMonthDays);
          months = months.add(sign);
          relativeTo = newRelativeTo;
          ({ relativeTo: newRelativeTo, days: oneMonthDays } = ES.MoveRelativeDate(
            calendar,
            relativeTo,
            oneMonth,
            dateAdd
          ));
        }

        // balance months up to years
        newRelativeTo = ES.CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
        const dateUntil = ES.GetMethod(calendar, 'dateUntil');
        const untilOptions = ObjectCreate(null);
        untilOptions.largestUnit = 'month';
        let untilResult = ES.CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
        let oneYearMonths = GetSlot(untilResult, MONTHS);
        while (months.abs().geq(MathAbs(oneYearMonths))) {
          months = months.subtract(oneYearMonths);
          years = years.add(sign);
          relativeTo = newRelativeTo;
          newRelativeTo = ES.CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
          const untilOptions = ObjectCreate(null);
          untilOptions.largestUnit = 'month';
          untilResult = ES.CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
          oneYearMonths = GetSlot(untilResult, MONTHS);
        }
        break;
      }
      case 'month': {
        if (!calendar) throw new RangeError('a starting point is required for months balancing');
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        // balance days up to months
        let newRelativeTo, oneMonthDays;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = ES.MoveRelativeDate(
          calendar,
          relativeTo,
          oneMonth,
          dateAdd
        ));
        while (days.abs().geq(MathAbs(oneMonthDays))) {
          days = days.subtract(oneMonthDays);
          months = months.add(sign);
          relativeTo = newRelativeTo;
          ({ relativeTo: newRelativeTo, days: oneMonthDays } = ES.MoveRelativeDate(
            calendar,
            relativeTo,
            oneMonth,
            dateAdd
          ));
        }
        break;
      }
      case 'week': {
        if (!calendar) throw new RangeError('a starting point is required for weeks balancing');
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        // balance days up to weeks
        let newRelativeTo, oneWeekDays;
        ({ relativeTo: newRelativeTo, days: oneWeekDays } = ES.MoveRelativeDate(
          calendar,
          relativeTo,
          oneWeek,
          dateAdd
        ));
        while (days.abs().geq(MathAbs(oneWeekDays))) {
          days = days.subtract(oneWeekDays);
          weeks = weeks.add(sign);
          relativeTo = newRelativeTo;
          ({ relativeTo: newRelativeTo, days: oneWeekDays } = ES.MoveRelativeDate(
            calendar,
            relativeTo,
            oneWeek,
            dateAdd
          ));
        }
        break;
      }
      default:
        // no-op
        break;
    }

    return {
      years: years.toJSNumber(),
      months: months.toJSNumber(),
      weeks: weeks.toJSNumber(),
      days: days.toJSNumber()
    };
  },
  CalculateOffsetShift: (relativeTo, y, mon, w, d) => {
    if (ES.IsTemporalZonedDateTime(relativeTo)) {
      const instant = GetSlot(relativeTo, INSTANT);
      const timeZone = GetSlot(relativeTo, TIME_ZONE);
      const calendar = GetSlot(relativeTo, CALENDAR);
      const offsetBefore = ES.GetOffsetNanosecondsFor(timeZone, instant);
      const after = ES.AddZonedDateTime(instant, timeZone, calendar, y, mon, w, d, 0, 0, 0, 0, 0, 0);
      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
      const instantAfter = new TemporalInstant(after);
      const offsetAfter = ES.GetOffsetNanosecondsFor(timeZone, instantAfter);
      return offsetAfter - offsetBefore;
    }
    return 0;
  },
  CreateNegatedTemporalDuration: (duration) => {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    return new TemporalDuration(
      -GetSlot(duration, YEARS),
      -GetSlot(duration, MONTHS),
      -GetSlot(duration, WEEKS),
      -GetSlot(duration, DAYS),
      -GetSlot(duration, HOURS),
      -GetSlot(duration, MINUTES),
      -GetSlot(duration, SECONDS),
      -GetSlot(duration, MILLISECONDS),
      -GetSlot(duration, MICROSECONDS),
      -GetSlot(duration, NANOSECONDS)
    );
  },

  ConstrainToRange: (value, min, max) => MathMin(max, MathMax(min, value)),
  ConstrainISODate: (year, month, day) => {
    month = ES.ConstrainToRange(month, 1, 12);
    day = ES.ConstrainToRange(day, 1, ES.ISODaysInMonth(year, month));
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
  },
  RejectISODate: (year, month, day) => {
    ES.RejectToRange(month, 1, 12);
    ES.RejectToRange(day, 1, ES.ISODaysInMonth(year, month));
  },
  RejectDateRange: (year, month, day) => {
    // Noon avoids trouble at edges of DateTime range (excludes midnight)
    ES.RejectDateTimeRange(year, month, day, 12, 0, 0, 0, 0, 0);
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
    ES.RejectISODate(year, month, day);
    ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
  },
  RejectDateTimeRange: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);
    // Reject any DateTime 24 hours or more outside the Instant range
    if (
      (year === YEAR_MIN &&
        null ==
          ES.GetUTCEpochNanoseconds(
            year,
            month,
            day + 1,
            hour,
            minute,
            second,
            millisecond,
            microsecond,
            nanosecond - 1
          )) ||
      (year === YEAR_MAX &&
        null ==
          ES.GetUTCEpochNanoseconds(
            year,
            month,
            day - 1,
            hour,
            minute,
            second,
            millisecond,
            microsecond,
            nanosecond + 1
          ))
    ) {
      throw new RangeError('DateTime outside of supported range');
    }
  },
  ValidateEpochNanoseconds: (epochNanoseconds) => {
    if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
      throw new RangeError('Instant outside of supported range');
    }
  },
  RejectYearMonthRange: (year, month) => {
    ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);
    if (year === YEAR_MIN) {
      ES.RejectToRange(month, 4, 12);
    } else if (year === YEAR_MAX) {
      ES.RejectToRange(month, 1, 9);
    }
  },
  RejectDuration: (y, mon, w, d, h, min, s, ms, µs, ns) => {
    const sign = ES.DurationSign(y, mon, w, d, h, min, s, ms, µs, ns);
    const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
    for (let index = 0; index < fields.length; index++) {
      const prop = fields[index];
      if (!NumberIsFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
      const propSign = MathSign(prop);
      if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
    }
  },

  DifferenceISODate: (y1, m1, d1, y2, m2, d2, largestUnit = 'days') => {
    switch (largestUnit) {
      case 'year':
      case 'month': {
        const sign = -ES.CompareISODate(y1, m1, d1, y2, m2, d2);
        if (sign === 0) return { years: 0, months: 0, weeks: 0, days: 0 };

        const start = { year: y1, month: m1, day: d1 };
        const end = { year: y2, month: m2, day: d2 };

        let years = end.year - start.year;
        let mid = ES.AddISODate(y1, m1, d1, years, 0, 0, 0, 'constrain');
        let midSign = -ES.CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
        if (midSign === 0) {
          return largestUnit === 'year'
            ? { years, months: 0, weeks: 0, days: 0 }
            : { years: 0, months: years * 12, weeks: 0, days: 0 };
        }
        let months = end.month - start.month;
        if (midSign !== sign) {
          years -= sign;
          months += sign * 12;
        }
        mid = ES.AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
        midSign = -ES.CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
        if (midSign === 0) {
          return largestUnit === 'year'
            ? { years, months, weeks: 0, days: 0 }
            : { years: 0, months: months + years * 12, weeks: 0, days: 0 };
        }
        if (midSign !== sign) {
          // The end date is later in the month than mid date (or earlier for
          // negative durations). Back up one month.
          months -= sign;
          if (months === -sign) {
            years -= sign;
            months = 11 * sign;
          }
          mid = ES.AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
        }

        let days = 0;
        // If we get here, months and years are correct (no overflow), and `mid`
        // is within the range from `start` to `end`. To count the days between
        // `mid` and `end`, there are 3 cases:
        // 1) same month: use simple subtraction
        // 2) end is previous month from intermediate (negative duration)
        // 3) end is next month from intermediate (positive duration)
        if (mid.month === end.month) {
          // 1) same month: use simple subtraction
          days = end.day - mid.day;
        } else if (sign < 0) {
          // 2) end is previous month from intermediate (negative duration)
          // Example: intermediate: Feb 1, end: Jan 30, DaysInMonth = 31, days = -2
          days = -mid.day - (ES.ISODaysInMonth(end.year, end.month) - end.day);
        } else {
          // 3) end is next month from intermediate (positive duration)
          // Example: intermediate: Jan 29, end: Feb 1, DaysInMonth = 31, days = 3
          days = end.day + (ES.ISODaysInMonth(mid.year, mid.month) - mid.day);
        }

        if (largestUnit === 'month') {
          months += years * 12;
          years = 0;
        }
        return { years, months, weeks: 0, days };
      }
      case 'week':
      case 'day': {
        let larger, smaller, sign;
        if (ES.CompareISODate(y1, m1, d1, y2, m2, d2) < 0) {
          smaller = { year: y1, month: m1, day: d1 };
          larger = { year: y2, month: m2, day: d2 };
          sign = 1;
        } else {
          smaller = { year: y2, month: m2, day: d2 };
          larger = { year: y1, month: m1, day: d1 };
          sign = -1;
        }
        let days =
          ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(smaller.year, smaller.month, smaller.day);
        for (let year = smaller.year; year < larger.year; ++year) {
          days += ES.LeapYear(year) ? 366 : 365;
        }
        let weeks = 0;
        if (largestUnit === 'week') {
          weeks = MathFloor(days / 7);
          days %= 7;
        }
        weeks *= sign;
        days *= sign;
        return { years: 0, months: 0, weeks, days };
      }
      default:
        throw new Error('assert not reached');
    }
  },
  DifferenceTime: (h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) => {
    let hours = h2 - h1;
    let minutes = min2 - min1;
    let seconds = s2 - s1;
    let milliseconds = ms2 - ms1;
    let microseconds = µs2 - µs1;
    let nanoseconds = ns2 - ns1;

    const sign = ES.DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    hours *= sign;
    minutes *= sign;
    seconds *= sign;
    milliseconds *= sign;
    microseconds *= sign;
    nanoseconds *= sign;

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

    if (deltaDays != 0) throw new Error('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');
    hours *= sign;
    minutes *= sign;
    seconds *= sign;
    milliseconds *= sign;
    microseconds *= sign;
    nanoseconds *= sign;

    return { hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  DifferenceInstant(ns1, ns2, increment, smallestUnit, largestUnit, roundingMode) {
    const diff = ns2.minus(ns1);

    let hours = 0;
    let minutes = 0;
    let nanoseconds = diff.mod(1e3).toJSNumber();
    let microseconds = diff.divide(1e3).mod(1e3).toJSNumber();
    let milliseconds = diff.divide(1e6).mod(1e3).toJSNumber();
    let seconds = diff.divide(1e9).toJSNumber();

    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      0,
      0,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      increment,
      smallestUnit,
      roundingMode
    ));
    return ES.BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);
  },
  DifferenceISODateTime: (
    y1,
    mon1,
    d1,
    h1,
    min1,
    s1,
    ms1,
    µs1,
    ns1,
    y2,
    mon2,
    d2,
    h2,
    min2,
    s2,
    ms2,
    µs2,
    ns2,
    calendar,
    largestUnit,
    options
  ) => {
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      h1,
      min1,
      s1,
      ms1,
      µs1,
      ns1,
      h2,
      min2,
      s2,
      ms2,
      µs2,
      ns2
    );

    const timeSign = ES.DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    const dateSign = ES.CompareISODate(y2, mon2, d2, y1, mon1, d1);
    if (dateSign === -timeSign) {
      ({ year: y1, month: mon1, day: d1 } = ES.BalanceISODate(y1, mon1, d1 - timeSign));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        -timeSign,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        largestUnit
      ));
    }

    const date1 = ES.CreateTemporalDate(y1, mon1, d1, calendar);
    const date2 = ES.CreateTemporalDate(y2, mon2, d2, calendar);
    const dateLargestUnit = ES.LargerOfTwoTemporalUnits('day', largestUnit);
    const untilOptions = ObjectCreate(null);
    ES.CopyDataProperties(untilOptions, options, []);
    untilOptions.largestUnit = dateLargestUnit;
    let { years, months, weeks, days } = ES.CalendarDateUntil(calendar, date1, date2, untilOptions);
    // Signs of date part and time part may not agree; balance them together
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
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  DifferenceZonedDateTime: (ns1, ns2, timeZone, calendar, largestUnit, options) => {
    const nsDiff = ns2.subtract(ns1);
    if (nsDiff.isZero()) {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        microseconds: 0,
        nanoseconds: 0
      };
    }

    // Find the difference in dates only.
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const start = new TemporalInstant(ns1);
    const end = new TemporalInstant(ns2);
    const dtStart = ES.GetPlainDateTimeFor(timeZone, start, calendar);
    const dtEnd = ES.GetPlainDateTimeFor(timeZone, end, calendar);
    let { years, months, weeks, days } = ES.DifferenceISODateTime(
      GetSlot(dtStart, ISO_YEAR),
      GetSlot(dtStart, ISO_MONTH),
      GetSlot(dtStart, ISO_DAY),
      GetSlot(dtStart, ISO_HOUR),
      GetSlot(dtStart, ISO_MINUTE),
      GetSlot(dtStart, ISO_SECOND),
      GetSlot(dtStart, ISO_MILLISECOND),
      GetSlot(dtStart, ISO_MICROSECOND),
      GetSlot(dtStart, ISO_NANOSECOND),
      GetSlot(dtEnd, ISO_YEAR),
      GetSlot(dtEnd, ISO_MONTH),
      GetSlot(dtEnd, ISO_DAY),
      GetSlot(dtEnd, ISO_HOUR),
      GetSlot(dtEnd, ISO_MINUTE),
      GetSlot(dtEnd, ISO_SECOND),
      GetSlot(dtEnd, ISO_MILLISECOND),
      GetSlot(dtEnd, ISO_MICROSECOND),
      GetSlot(dtEnd, ISO_NANOSECOND),
      calendar,
      largestUnit,
      options
    );
    let intermediateNs = ES.AddZonedDateTime(start, timeZone, calendar, years, months, weeks, 0, 0, 0, 0, 0, 0, 0);
    // may disambiguate
    let timeRemainderNs = ns2.subtract(intermediateNs);
    const intermediate = ES.CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
    ({ nanoseconds: timeRemainderNs, days } = ES.NanosecondsToDays(timeRemainderNs, intermediate));

    // Finally, merge the date and time durations and return the merged result.
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      0,
      0,
      0,
      0,
      0,
      timeRemainderNs,
      'hour'
    );
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  GetDifferenceSettings: (op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) => {
    const ALLOWED_UNITS = SINGULAR_PLURAL_UNITS.reduce((allowed, unitInfo) => {
      const p = unitInfo[0];
      const s = unitInfo[1];
      const c = unitInfo[2];
      if ((group === 'datetime' || c === group) && !ES.Call(ArrayIncludes, disallowed, [s])) {
        allowed.push(s, p);
      }
      return allowed;
    }, []);

    let largestUnit = ES.GetTemporalUnit(options, 'largestUnit', group, 'auto');
    if (ES.Call(ArrayIncludes, disallowed, [largestUnit])) {
      throw new RangeError(`largestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${largestUnit}`);
    }

    const roundingIncrement = ES.ToTemporalRoundingIncrement(options);

    let roundingMode = ES.ToTemporalRoundingMode(options, 'trunc');
    if (op === 'since') roundingMode = ES.NegateTemporalRoundingMode(roundingMode);

    const smallestUnit = ES.GetTemporalUnit(options, 'smallestUnit', group, fallbackSmallest);
    if (ES.Call(ArrayIncludes, disallowed, [smallestUnit])) {
      throw new RangeError(`smallestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${smallestUnit}`);
    }

    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits(smallestLargestDefaultUnit, smallestUnit);
    if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
    if (ES.LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
      throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
    }
    const MAX_DIFFERENCE_INCREMENTS = {
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    };
    const maximum = MAX_DIFFERENCE_INCREMENTS[smallestUnit];
    if (maximum !== undefined) ES.ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false);

    return { largestUnit, roundingIncrement, roundingMode, smallestUnit };
  },
  DifferenceTemporalInstant: (operation, instant, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalInstant(other);

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'second');

    const onens = GetSlot(instant, EPOCHNANOSECONDS);
    const twons = GetSlot(other, EPOCHNANOSECONDS);
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceInstant(
      onens,
      twons,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.largestUnit,
      settings.roundingMode
    );
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      0,
      0,
      0,
      0,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
  },
  DifferenceTemporalPlainDate: (operation, plainDate, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalDate(other);
    const calendar = GetSlot(plainDate, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    ES.CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'date', [], 'day', 'day');
    resolvedOptions.largestUnit = settings.largestUnit;

    let { years, months, weeks, days } = ES.CalendarDateUntil(calendar, plainDate, other, resolvedOptions);

    if (settings.smallestUnit !== 'day' || settings.roundingIncrement !== 1) {
      ({ years, months, weeks, days } = ES.RoundDuration(
        years,
        months,
        weeks,
        days,
        0,
        0,
        0,
        0,
        0,
        0,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode,
        plainDate
      ));
    }

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(sign * years, sign * months, sign * weeks, sign * days, 0, 0, 0, 0, 0, 0);
  },
  DifferenceTemporalPlainDateTime: (operation, plainDateTime, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalDateTime(other);
    const calendar = GetSlot(plainDateTime, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    ES.CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'day');

    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.DifferenceISODateTime(
        GetSlot(plainDateTime, ISO_YEAR),
        GetSlot(plainDateTime, ISO_MONTH),
        GetSlot(plainDateTime, ISO_DAY),
        GetSlot(plainDateTime, ISO_HOUR),
        GetSlot(plainDateTime, ISO_MINUTE),
        GetSlot(plainDateTime, ISO_SECOND),
        GetSlot(plainDateTime, ISO_MILLISECOND),
        GetSlot(plainDateTime, ISO_MICROSECOND),
        GetSlot(plainDateTime, ISO_NANOSECOND),
        GetSlot(other, ISO_YEAR),
        GetSlot(other, ISO_MONTH),
        GetSlot(other, ISO_DAY),
        GetSlot(other, ISO_HOUR),
        GetSlot(other, ISO_MINUTE),
        GetSlot(other, ISO_SECOND),
        GetSlot(other, ISO_MILLISECOND),
        GetSlot(other, ISO_MICROSECOND),
        GetSlot(other, ISO_NANOSECOND),
        calendar,
        settings.largestUnit,
        resolvedOptions
      );

    const relativeTo = ES.TemporalDateTimeToDate(plainDateTime);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.RoundDuration(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        microseconds,
        nanoseconds,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode,
        relativeTo
      ));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      settings.largestUnit
    ));

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      sign * years,
      sign * months,
      sign * weeks,
      sign * days,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
  },
  DifferenceTemporalPlainTime: (operation, plainTime, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalTime(other);

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');

    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceTime(
      GetSlot(plainTime, ISO_HOUR),
      GetSlot(plainTime, ISO_MINUTE),
      GetSlot(plainTime, ISO_SECOND),
      GetSlot(plainTime, ISO_MILLISECOND),
      GetSlot(plainTime, ISO_MICROSECOND),
      GetSlot(plainTime, ISO_NANOSECOND),
      GetSlot(other, ISO_HOUR),
      GetSlot(other, ISO_MINUTE),
      GetSlot(other, ISO_SECOND),
      GetSlot(other, ISO_MILLISECOND),
      GetSlot(other, ISO_MICROSECOND),
      GetSlot(other, ISO_NANOSECOND)
    );
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      settings.largestUnit
    ));
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      0,
      0,
      0,
      0,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
  },
  DifferenceTemporalPlainYearMonth: (operation, yearMonth, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalYearMonth(other);
    const calendar = GetSlot(yearMonth, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    ES.CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between months');

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'date', ['week', 'day'], 'month', 'year');
    resolvedOptions.largestUnit = settings.largestUnit;

    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const thisFields = ES.PrepareTemporalFields(yearMonth, fieldNames, []);
    thisFields.day = 1;
    const thisDate = ES.CalendarDateFromFields(calendar, thisFields);
    const otherFields = ES.PrepareTemporalFields(other, fieldNames, []);
    otherFields.day = 1;
    const otherDate = ES.CalendarDateFromFields(calendar, otherFields);

    let { years, months } = ES.CalendarDateUntil(calendar, thisDate, otherDate, resolvedOptions);

    if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
      ({ years, months } = ES.RoundDuration(
        years,
        months,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode,
        thisDate
      ));
    }

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(sign * years, sign * months, 0, 0, 0, 0, 0, 0, 0, 0);
  },
  DifferenceTemporalZonedDateTime: (operation, zonedDateTime, other, options) => {
    const sign = operation === 'since' ? -1 : 1;
    other = ES.ToTemporalZonedDateTime(other);
    const calendar = GetSlot(zonedDateTime, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    ES.CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

    const resolvedOptions = ObjectCreate(null);
    ES.CopyDataProperties(resolvedOptions, ES.GetOptionsObject(options), []);
    const settings = ES.GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'hour');
    resolvedOptions.largestUnit = settings.largestUnit;

    const ns1 = GetSlot(zonedDateTime, EPOCHNANOSECONDS);
    const ns2 = GetSlot(other, EPOCHNANOSECONDS);
    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (
      settings.largestUnit !== 'year' &&
      settings.largestUnit !== 'month' &&
      settings.largestUnit !== 'week' &&
      settings.largestUnit !== 'day'
    ) {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceInstant(
        ns1,
        ns2,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.largestUnit,
        settings.roundingMode
      ));
    } else {
      const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
      if (!ES.TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        );
      }
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, settings.largestUnit, resolvedOptions));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.RoundDuration(
          years,
          months,
          weeks,
          days,
          hours,
          minutes,
          seconds,
          milliseconds,
          microseconds,
          nanoseconds,
          settings.roundingIncrement,
          settings.smallestUnit,
          settings.roundingMode,
          zonedDateTime
        ));
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        ES.AdjustRoundedDurationDays(
          years,
          months,
          weeks,
          days,
          hours,
          minutes,
          seconds,
          milliseconds,
          microseconds,
          nanoseconds,
          settings.roundingIncrement,
          settings.smallestUnit,
          settings.roundingMode,
          zonedDateTime
        ));
    }

    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(
      sign * years,
      sign * months,
      sign * weeks,
      sign * days,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
  },

  AddISODate: (year, month, day, years, months, weeks, days, overflow) => {
    year += years;
    month += months;
    ({ year, month } = ES.BalanceISOYearMonth(year, month));
    ({ year, month, day } = ES.RegulateISODate(year, month, day, overflow));
    days += 7 * weeks;
    day += days;
    ({ year, month, day } = ES.BalanceISODate(year, month, day));
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
  AddDuration: (
    y1,
    mon1,
    w1,
    d1,
    h1,
    min1,
    s1,
    ms1,
    µs1,
    ns1,
    y2,
    mon2,
    w2,
    d2,
    h2,
    min2,
    s2,
    ms2,
    µs2,
    ns2,
    relativeTo
  ) => {
    const largestUnit1 = ES.DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
    const largestUnit2 = ES.DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
    const largestUnit = ES.LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);

    let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    if (!relativeTo) {
      if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week') {
        throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
      }
      years = months = weeks = 0;
      ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        d1 + d2,
        bigInt(h1).add(h2),
        bigInt(min1).add(min2),
        bigInt(s1).add(s2),
        bigInt(ms1).add(ms2),
        bigInt(µs1).add(µs2),
        bigInt(ns1).add(ns2),
        largestUnit
      ));
    } else if (ES.IsTemporalDate(relativeTo)) {
      const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
      const calendar = GetSlot(relativeTo, CALENDAR);

      const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
      const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
      const dateAdd = ES.GetMethod(calendar, 'dateAdd');
      const intermediate = ES.CalendarDateAdd(calendar, relativeTo, dateDuration1, undefined, dateAdd);
      const end = ES.CalendarDateAdd(calendar, intermediate, dateDuration2, undefined, dateAdd);

      const dateLargestUnit = ES.LargerOfTwoTemporalUnits('day', largestUnit);
      const differenceOptions = ObjectCreate(null);
      differenceOptions.largestUnit = dateLargestUnit;
      ({ years, months, weeks, days } = ES.CalendarDateUntil(calendar, relativeTo, end, differenceOptions));
      // Signs of date part and time part may not agree; balance them together
      ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        days,
        bigInt(h1).add(h2),
        bigInt(min1).add(min2),
        bigInt(s1).add(s2),
        bigInt(ms1).add(ms2),
        bigInt(µs1).add(µs2),
        bigInt(ns1).add(ns2),
        largestUnit
      ));
    } else {
      // relativeTo is a ZonedDateTime
      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
      const timeZone = GetSlot(relativeTo, TIME_ZONE);
      const calendar = GetSlot(relativeTo, CALENDAR);
      const intermediateNs = ES.AddZonedDateTime(
        GetSlot(relativeTo, INSTANT),
        timeZone,
        calendar,
        y1,
        mon1,
        w1,
        d1,
        h1,
        min1,
        s1,
        ms1,
        µs1,
        ns1
      );
      const endNs = ES.AddZonedDateTime(
        new TemporalInstant(intermediateNs),
        timeZone,
        calendar,
        y2,
        mon2,
        w2,
        d2,
        h2,
        min2,
        s2,
        ms2,
        µs2,
        ns2
      );
      if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
        // The user is only asking for a time difference, so return difference of instants.
        years = 0;
        months = 0;
        weeks = 0;
        days = 0;
        ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.DifferenceInstant(
          GetSlot(relativeTo, EPOCHNANOSECONDS),
          endNs,
          1,
          'nanosecond',
          largestUnit,
          'halfExpand'
        ));
      } else {
        ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
          ES.DifferenceZonedDateTime(
            GetSlot(relativeTo, EPOCHNANOSECONDS),
            endNs,
            timeZone,
            calendar,
            largestUnit,
            ObjectCreate(null)
          ));
      }
    }

    ES.RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  AddInstant: (epochNanoseconds, h, min, s, ms, µs, ns) => {
    let sum = bigInt.zero;
    sum = sum.plus(bigInt(ns));
    sum = sum.plus(bigInt(µs).multiply(1e3));
    sum = sum.plus(bigInt(ms).multiply(1e6));
    sum = sum.plus(bigInt(s).multiply(1e9));
    sum = sum.plus(bigInt(min).multiply(60 * 1e9));
    sum = sum.plus(bigInt(h).multiply(60 * 60 * 1e9));

    const result = bigInt(epochNanoseconds).plus(sum);
    ES.ValidateEpochNanoseconds(result);
    return result;
  },
  AddDateTime: (
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    calendar,
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    options
  ) => {
    // Add the time part
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
    days += deltaDays;

    // Delegate the date part addition to the calendar
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    const datePart = ES.CreateTemporalDate(year, month, day, calendar);
    const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const addedDate = ES.CalendarDateAdd(calendar, datePart, dateDuration, options);

    return {
      year: GetSlot(addedDate, ISO_YEAR),
      month: GetSlot(addedDate, ISO_MONTH),
      day: GetSlot(addedDate, ISO_DAY),
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    };
  },
  AddZonedDateTime: (instant, timeZone, calendar, years, months, weeks, days, h, min, s, ms, µs, ns, options) => {
    // If only time is to be added, then use Instant math. It's not OK to fall
    // through to the date/time code below because compatible disambiguation in
    // the PlainDateTime=>Instant conversion will change the offset of any
    // ZonedDateTime in the repeated clock time after a backwards transition.
    // When adding/subtracting time units and not dates, this disambiguation is
    // not expected and so is avoided below via a fast path for time-only
    // arithmetic.
    // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    if (ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0) === 0) {
      return ES.AddInstant(GetSlot(instant, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
    }

    // RFC 5545 requires the date portion to be added in calendar days and the
    // time portion to be added in exact time.
    let dt = ES.GetPlainDateTimeFor(timeZone, instant, calendar);
    const datePart = ES.CreateTemporalDate(
      GetSlot(dt, ISO_YEAR),
      GetSlot(dt, ISO_MONTH),
      GetSlot(dt, ISO_DAY),
      calendar
    );
    const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const addedDate = ES.CalendarDateAdd(calendar, datePart, dateDuration, options);
    const dtIntermediate = ES.CreateTemporalDateTime(
      GetSlot(addedDate, ISO_YEAR),
      GetSlot(addedDate, ISO_MONTH),
      GetSlot(addedDate, ISO_DAY),
      GetSlot(dt, ISO_HOUR),
      GetSlot(dt, ISO_MINUTE),
      GetSlot(dt, ISO_SECOND),
      GetSlot(dt, ISO_MILLISECOND),
      GetSlot(dt, ISO_MICROSECOND),
      GetSlot(dt, ISO_NANOSECOND),
      calendar
    );

    // Note that 'compatible' is used below because this disambiguation behavior
    // is required by RFC 5545.
    const instantIntermediate = ES.GetInstantFor(timeZone, dtIntermediate, 'compatible');
    return ES.AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
  },
  AddDurationToOrSubtractDurationFromDuration: (operation, duration, other, options) => {
    const sign = operation === 'subtract' ? -1 : 1;
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.ToTemporalDurationRecord(other);
    options = ES.GetOptionsObject(options);
    const relativeTo = ES.ToRelativeTemporalObject(options);
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.AddDuration(
      GetSlot(duration, YEARS),
      GetSlot(duration, MONTHS),
      GetSlot(duration, WEEKS),
      GetSlot(duration, DAYS),
      GetSlot(duration, HOURS),
      GetSlot(duration, MINUTES),
      GetSlot(duration, SECONDS),
      GetSlot(duration, MILLISECONDS),
      GetSlot(duration, MICROSECONDS),
      GetSlot(duration, NANOSECONDS),
      sign * years,
      sign * months,
      sign * weeks,
      sign * days,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds,
      relativeTo
    ));
    const Duration = GetIntrinsic('%Temporal.Duration%');
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  },
  AddDurationToOrSubtractDurationFromInstant: (operation, instant, durationLike) => {
    const sign = operation === 'subtract' ? -1 : 1;
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.ToLimitedTemporalDuration(
      durationLike,
      ['years', 'months', 'weeks', 'days']
    );
    const ns = ES.AddInstant(
      GetSlot(instant, EPOCHNANOSECONDS),
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
    const Instant = GetIntrinsic('%Temporal.Instant%');
    return new Instant(ns);
  },
  AddDurationToOrSubtractDurationFromPlainDateTime: (operation, dateTime, durationLike, options) => {
    const sign = operation === 'subtract' ? -1 : 1;
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.ToTemporalDurationRecord(durationLike);
    options = ES.GetOptionsObject(options);
    const calendar = GetSlot(dateTime, CALENDAR);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddDateTime(
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, ISO_HOUR),
      GetSlot(dateTime, ISO_MINUTE),
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND),
      calendar,
      sign * years,
      sign * months,
      sign * weeks,
      sign * days,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds,
      options
    );
    return ES.CreateTemporalDateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      calendar
    );
  },
  AddDurationToOrSubtractDurationFromPlainTime: (operation, temporalTime, durationLike) => {
    const sign = operation === 'subtract' ? -1 : 1;
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.ToTemporalDurationRecord(durationLike);
    let { hour, minute, second, millisecond, microsecond, nanosecond } = ES.AddTime(
      GetSlot(temporalTime, ISO_HOUR),
      GetSlot(temporalTime, ISO_MINUTE),
      GetSlot(temporalTime, ISO_SECOND),
      GetSlot(temporalTime, ISO_MILLISECOND),
      GetSlot(temporalTime, ISO_MICROSECOND),
      GetSlot(temporalTime, ISO_NANOSECOND),
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds
    );
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      'reject'
    ));
    const PlainTime = GetIntrinsic('%Temporal.PlainTime%');
    return new PlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
  },
  AddDurationToOrSubtractDurationFromPlainYearMonth: (operation, yearMonth, durationLike, options) => {
    let duration = ES.ToTemporalDurationRecord(durationLike);
    if (operation === 'subtract') {
      duration = {
        years: -duration.years,
        months: -duration.months,
        weeks: -duration.weeks,
        days: -duration.days,
        hours: -duration.hours,
        minutes: -duration.minutes,
        seconds: -duration.seconds,
        milliseconds: -duration.milliseconds,
        microseconds: -duration.microseconds,
        nanoseconds: -duration.nanoseconds
      };
    }
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'day'));

    options = ES.GetOptionsObject(options);

    const calendar = GetSlot(yearMonth, CALENDAR);
    const fieldNames = ES.CalendarFields(calendar, ['monthCode', 'year']);
    const fields = ES.PrepareTemporalFields(yearMonth, fieldNames, []);
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    fields.day = sign < 0 ? ES.CalendarDaysInMonth(calendar, yearMonth) : 1;
    const startDate = ES.CalendarDateFromFields(calendar, fields);
    const Duration = GetIntrinsic('%Temporal.Duration%');
    const durationToAdd = new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
    const optionsCopy = ObjectCreate(null);
    ES.CopyDataProperties(optionsCopy, options, []);
    const addedDate = ES.CalendarDateAdd(calendar, startDate, durationToAdd, options);
    const addedDateFields = ES.PrepareTemporalFields(addedDate, fieldNames, []);

    return ES.CalendarYearMonthFromFields(calendar, addedDateFields, optionsCopy);
  },
  AddDurationToOrSubtractDurationFromZonedDateTime: (operation, zonedDateTime, durationLike, options) => {
    const sign = operation === 'subtract' ? -1 : 1;
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      ES.ToTemporalDurationRecord(durationLike);
    options = ES.GetOptionsObject(options);
    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
    const calendar = GetSlot(zonedDateTime, CALENDAR);
    const epochNanoseconds = ES.AddZonedDateTime(
      GetSlot(zonedDateTime, INSTANT),
      timeZone,
      calendar,
      sign * years,
      sign * months,
      sign * weeks,
      sign * days,
      sign * hours,
      sign * minutes,
      sign * seconds,
      sign * milliseconds,
      sign * microseconds,
      sign * nanoseconds,
      options
    );
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
  },

  RoundNumberToIncrement: (quantity, increment, mode) => {
    if (increment === 1) return quantity;
    let { quotient, remainder } = quantity.divmod(increment);
    if (remainder.equals(bigInt.zero)) return quantity;
    const sign = remainder.lt(bigInt.zero) ? -1 : 1;
    const tiebreaker = remainder.multiply(2).abs();
    const tie = tiebreaker.equals(increment);
    const expandIsNearer = tiebreaker.gt(increment);
    switch (mode) {
      case 'ceil':
        if (sign > 0) quotient = quotient.add(sign);
        break;
      case 'floor':
        if (sign < 0) quotient = quotient.add(sign);
        break;
      case 'expand':
        // always expand if there is a remainder
        quotient = quotient.add(sign);
        break;
      case 'trunc':
        // no change needed, because divmod is a truncation
        break;
      case 'halfCeil':
        if (expandIsNearer || (tie && sign > 0)) quotient = quotient.add(sign);
        break;
      case 'halfFloor':
        if (expandIsNearer || (tie && sign < 0)) quotient = quotient.add(sign);
        break;
      case 'halfExpand':
        // "half up away from zero"
        if (expandIsNearer || tie) quotient = quotient.add(sign);
        break;
      case 'halfTrunc':
        if (expandIsNearer) quotient = quotient.add(sign);
        break;
      case 'halfEven': {
        if (expandIsNearer || (tie && quotient.isOdd())) quotient = quotient.add(sign);
        break;
      }
    }
    return quotient.multiply(increment);
  },
  RoundInstant: (epochNs, increment, unit, roundingMode) => {
    let { remainder } = ES.NonNegativeBigIntDivmod(epochNs, 86400e9);
    const wholeDays = epochNs.minus(remainder);
    const roundedRemainder = ES.RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
    return wholeDays.plus(roundedRemainder);
  },
  RoundISODateTime: (
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    increment,
    unit,
    roundingMode,
    dayLengthNs = 86400e9
  ) => {
    let deltaDays = 0;
    ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = ES.RoundTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      increment,
      unit,
      roundingMode,
      dayLengthNs
    ));
    ({ year, month, day } = ES.BalanceISODate(year, month, day + deltaDays));
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  RoundTime: (
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    increment,
    unit,
    roundingMode,
    dayLengthNs = 86400e9
  ) => {
    let quantity = bigInt.zero;
    switch (unit) {
      case 'day':
      case 'hour':
        quantity = bigInt(hour);
      // fall through
      case 'minute':
        quantity = quantity.multiply(60).plus(minute);
      // fall through
      case 'second':
        quantity = quantity.multiply(60).plus(second);
      // fall through
      case 'millisecond':
        quantity = quantity.multiply(1000).plus(millisecond);
      // fall through
      case 'microsecond':
        quantity = quantity.multiply(1000).plus(microsecond);
      // fall through
      case 'nanosecond':
        quantity = quantity.multiply(1000).plus(nanosecond);
    }
    const nsPerUnit = unit === 'day' ? dayLengthNs : nsPerTimeUnit[unit];
    const rounded = ES.RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode);
    const result = rounded.divide(nsPerUnit).toJSNumber();
    switch (unit) {
      case 'day':
        return { deltaDays: result, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
      case 'hour':
        return ES.BalanceTime(result, 0, 0, 0, 0, 0);
      case 'minute':
        return ES.BalanceTime(hour, result, 0, 0, 0, 0);
      case 'second':
        return ES.BalanceTime(hour, minute, result, 0, 0, 0);
      case 'millisecond':
        return ES.BalanceTime(hour, minute, second, result, 0, 0);
      case 'microsecond':
        return ES.BalanceTime(hour, minute, second, millisecond, result, 0);
      case 'nanosecond':
        return ES.BalanceTime(hour, minute, second, millisecond, microsecond, result);
    }
  },
  DaysUntil: (earlier, later) => {
    return ES.DifferenceISODate(
      GetSlot(earlier, ISO_YEAR),
      GetSlot(earlier, ISO_MONTH),
      GetSlot(earlier, ISO_DAY),
      GetSlot(later, ISO_YEAR),
      GetSlot(later, ISO_MONTH),
      GetSlot(later, ISO_DAY),
      'day'
    ).days;
  },
  MoveRelativeDate: (calendar, relativeTo, duration, dateAdd) => {
    const later = ES.CalendarDateAdd(calendar, relativeTo, duration, undefined, dateAdd);
    const days = ES.DaysUntil(relativeTo, later);
    return { relativeTo: later, days };
  },
  MoveRelativeZonedDateTime: (relativeTo, years, months, weeks, days) => {
    const timeZone = GetSlot(relativeTo, TIME_ZONE);
    const calendar = GetSlot(relativeTo, CALENDAR);
    const intermediateNs = ES.AddZonedDateTime(
      GetSlot(relativeTo, INSTANT),
      timeZone,
      calendar,
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      0,
      0
    );
    return ES.CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
  },
  AdjustRoundedDurationDays: (
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    increment,
    unit,
    roundingMode,
    relativeTo
  ) => {
    if (
      !ES.IsTemporalZonedDateTime(relativeTo) ||
      unit === 'year' ||
      unit === 'month' ||
      unit === 'week' ||
      unit === 'day' ||
      (unit === 'nanosecond' && increment === 1)
    ) {
      return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
    }

    // There's one more round of rounding possible: if relativeTo is a
    // ZonedDateTime, the time units could have rounded up into enough hours
    // to exceed the day length. If this happens, grow the date part by a
    // single day and re-run exact time rounding on the smaller remainder. DO
    // NOT RECURSE, because once the extra hours are sucked up into the date
    // duration, there's no way for another full day to come from the next
    // round of rounding. And if it were possible (e.g. contrived calendar
    // with 30-minute-long "days") then it'd risk an infinite loop.
    let timeRemainderNs = ES.TotalDurationNanoseconds(
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      0
    );
    const direction = MathSign(timeRemainderNs.toJSNumber());

    const timeZone = GetSlot(relativeTo, TIME_ZONE);
    const calendar = GetSlot(relativeTo, CALENDAR);
    const dayStart = ES.AddZonedDateTime(
      GetSlot(relativeTo, INSTANT),
      timeZone,
      calendar,
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      0,
      0
    );
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const dayEnd = ES.AddZonedDateTime(
      new TemporalInstant(dayStart),
      timeZone,
      calendar,
      0,
      0,
      0,
      direction,
      0,
      0,
      0,
      0,
      0,
      0
    );
    const dayLengthNs = dayEnd.subtract(dayStart);

    if (timeRemainderNs.subtract(dayLengthNs).multiply(direction).geq(0)) {
      ({ years, months, weeks, days } = ES.AddDuration(
        years,
        months,
        weeks,
        days,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        direction,
        0,
        0,
        0,
        0,
        0,
        0,
        relativeTo
      ));
      timeRemainderNs = ES.RoundInstant(timeRemainderNs.subtract(dayLengthNs), increment, unit, roundingMode);
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
        0,
        0,
        0,
        0,
        0,
        0,
        timeRemainderNs.toJSNumber(),
        'hour'
      ));
    }
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  RoundDuration: (
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    increment,
    unit,
    roundingMode,
    relativeTo = undefined
  ) => {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    let calendar, zdtRelative;
    if (relativeTo) {
      if (ES.IsTemporalZonedDateTime(relativeTo)) {
        zdtRelative = relativeTo;
        relativeTo = ES.ToTemporalDate(relativeTo);
      } else if (!ES.IsTemporalDate(relativeTo)) {
        throw new TypeError('starting point must be PlainDate or ZonedDateTime');
      }
      calendar = GetSlot(relativeTo, CALENDAR);
    }

    // First convert time units up to days, if rounding to days or higher units.
    // If rounding relative to a ZonedDateTime, then some days may not be 24h.
    let dayLengthNs;
    if (unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day') {
      nanoseconds = ES.TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
      let intermediate;
      if (zdtRelative) {
        intermediate = ES.MoveRelativeZonedDateTime(zdtRelative, years, months, weeks, days);
      }
      let deltaDays;
      ({ days: deltaDays, nanoseconds, dayLengthNs } = ES.NanosecondsToDays(nanoseconds, intermediate));
      days += deltaDays;
      hours = minutes = seconds = milliseconds = microseconds = 0;
    }

    let total;
    switch (unit) {
      case 'year': {
        if (!calendar) throw new RangeError('A starting point is required for years rounding');

        // convert months and weeks to days by calculating difference(
        // relativeTo + years, relativeTo + { years, months, weeks })
        const yearsDuration = new TemporalDuration(years);
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        const yearsLater = ES.CalendarDateAdd(calendar, relativeTo, yearsDuration, undefined, dateAdd);
        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
        const yearsMonthsWeeksLater = ES.CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
        const monthsWeeksInDays = ES.DaysUntil(yearsLater, yearsMonthsWeeksLater);
        relativeTo = yearsLater;
        days += monthsWeeksInDays;

        const wholeDays = new TemporalDuration(0, 0, 0, days);
        const wholeDaysLater = ES.CalendarDateAdd(calendar, relativeTo, wholeDays, undefined, dateAdd);
        const untilOptions = ObjectCreate(null);
        untilOptions.largestUnit = 'year';
        const yearsPassed = ES.CalendarDateUntil(calendar, relativeTo, wholeDaysLater, untilOptions).years;
        years += yearsPassed;
        const oldRelativeTo = relativeTo;
        const yearsPassedDuration = new TemporalDuration(yearsPassed);
        relativeTo = ES.CalendarDateAdd(calendar, relativeTo, yearsPassedDuration, undefined, dateAdd);
        const daysPassed = ES.DaysUntil(oldRelativeTo, relativeTo);
        days -= daysPassed;
        const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
        let { days: oneYearDays } = ES.MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd);

        // Note that `nanoseconds` below (here and in similar code for months,
        // weeks, and days further below) isn't actually nanoseconds for the
        // full date range.  Instead, it's a BigInt representation of total
        // days multiplied by the number of nanoseconds in the last day of
        // the duration. This lets us do days-or-larger rounding using BigInt
        // math which reduces precision loss.
        oneYearDays = MathAbs(oneYearDays);
        const divisor = bigInt(oneYearDays).multiply(dayLengthNs);
        nanoseconds = divisor.multiply(years).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor.multiply(increment).toJSNumber(), roundingMode);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        years = rounded.divide(divisor).toJSNumber();
        nanoseconds = months = weeks = days = 0;
        break;
      }
      case 'month': {
        if (!calendar) throw new RangeError('A starting point is required for months rounding');

        // convert weeks to days by calculating difference(relativeTo +
        //   { years, months }, relativeTo + { years, months, weeks })
        const yearsMonths = new TemporalDuration(years, months);
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        const yearsMonthsLater = ES.CalendarDateAdd(calendar, relativeTo, yearsMonths, undefined, dateAdd);
        const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
        const yearsMonthsWeeksLater = ES.CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
        const weeksInDays = ES.DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
        relativeTo = yearsMonthsLater;
        days += weeksInDays;

        // Months may be different lengths of days depending on the calendar,
        // convert days to months in a loop as described above under 'years'.
        const sign = MathSign(days);
        const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
        let oneMonthDays;
        ({ relativeTo, days: oneMonthDays } = ES.MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
        while (MathAbs(days) >= MathAbs(oneMonthDays)) {
          months += sign;
          days -= oneMonthDays;
          ({ relativeTo, days: oneMonthDays } = ES.MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
        }
        oneMonthDays = MathAbs(oneMonthDays);
        const divisor = bigInt(oneMonthDays).multiply(dayLengthNs);
        nanoseconds = divisor.multiply(months).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        months = rounded.divide(divisor).toJSNumber();
        nanoseconds = weeks = days = 0;
        break;
      }
      case 'week': {
        if (!calendar) throw new RangeError('A starting point is required for weeks rounding');
        // Weeks may be different lengths of days depending on the calendar,
        // convert days to weeks in a loop as described above under 'years'.
        const sign = MathSign(days);
        const oneWeek = new TemporalDuration(0, 0, days < 0 ? -1 : 1);
        const dateAdd = ES.GetMethod(calendar, 'dateAdd');
        let oneWeekDays;
        ({ relativeTo, days: oneWeekDays } = ES.MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
        while (MathAbs(days) >= MathAbs(oneWeekDays)) {
          weeks += sign;
          days -= oneWeekDays;
          ({ relativeTo, days: oneWeekDays } = ES.MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
        }
        oneWeekDays = MathAbs(oneWeekDays);
        const divisor = bigInt(oneWeekDays).multiply(dayLengthNs);
        nanoseconds = divisor.multiply(weeks).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        weeks = rounded.divide(divisor).toJSNumber();
        nanoseconds = days = 0;
        break;
      }
      case 'day': {
        const divisor = bigInt(dayLengthNs);
        nanoseconds = divisor.multiply(days).plus(nanoseconds);
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        days = rounded.divide(divisor).toJSNumber();
        nanoseconds = 0;
        break;
      }
      case 'hour': {
        const divisor = 3600e9;
        nanoseconds = bigInt(hours)
          .multiply(3600e9)
          .plus(bigInt(minutes).multiply(60e9))
          .plus(bigInt(seconds).multiply(1e9))
          .plus(bigInt(milliseconds).multiply(1e6))
          .plus(bigInt(microseconds).multiply(1e3))
          .plus(nanoseconds);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
        hours = rounded.divide(divisor).toJSNumber();
        minutes = seconds = milliseconds = microseconds = nanoseconds = 0;
        break;
      }
      case 'minute': {
        const divisor = 60e9;
        nanoseconds = bigInt(minutes)
          .multiply(60e9)
          .plus(bigInt(seconds).multiply(1e9))
          .plus(bigInt(milliseconds).multiply(1e6))
          .plus(bigInt(microseconds).multiply(1e3))
          .plus(nanoseconds);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
        minutes = rounded.divide(divisor).toJSNumber();
        seconds = milliseconds = microseconds = nanoseconds = 0;
        break;
      }
      case 'second': {
        const divisor = 1e9;
        nanoseconds = bigInt(seconds)
          .multiply(1e9)
          .plus(bigInt(milliseconds).multiply(1e6))
          .plus(bigInt(microseconds).multiply(1e3))
          .plus(nanoseconds);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
        seconds = rounded.divide(divisor).toJSNumber();
        milliseconds = microseconds = nanoseconds = 0;
        break;
      }
      case 'millisecond': {
        const divisor = 1e6;
        nanoseconds = bigInt(milliseconds).multiply(1e6).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
        milliseconds = rounded.divide(divisor).toJSNumber();
        microseconds = nanoseconds = 0;
        break;
      }
      case 'microsecond': {
        const divisor = 1e3;
        nanoseconds = bigInt(microseconds).multiply(1e3).plus(nanoseconds);
        const { quotient, remainder } = nanoseconds.divmod(divisor);
        total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
        const rounded = ES.RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
        microseconds = rounded.divide(divisor).toJSNumber();
        nanoseconds = 0;
        break;
      }
      case 'nanosecond': {
        total = nanoseconds;
        nanoseconds = ES.RoundNumberToIncrement(bigInt(nanoseconds), increment, roundingMode).toJSNumber();
        break;
      }
    }
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, total };
  },

  CompareISODate: (y1, m1, d1, y2, m2, d2) => {
    if (y1 !== y2) return ES.ComparisonResult(y1 - y2);
    if (m1 !== m2) return ES.ComparisonResult(m1 - m2);
    if (d1 !== d2) return ES.ComparisonResult(d1 - d2);
    return 0;
  },

  NonNegativeBigIntDivmod: (x, y) => {
    let { quotient, remainder } = x.divmod(y);
    if (remainder.lesser(0)) {
      quotient = quotient.prev();
      remainder = remainder.plus(y);
    }
    return { quotient, remainder };
  },
  ToBigInt: (arg) => {
    if (bigInt.isInstance(arg)) {
      return arg;
    }

    const prim = ES.ToPrimitive(arg, Number);
    switch (typeof prim) {
      case 'undefined':
      case 'object':
      case 'number':
      case 'symbol':
        throw new TypeError(`cannot convert ${typeof arg} to bigint`);
      case 'string':
        if (!prim.match(/^\s*(?:[+-]?\d+\s*)?$/)) {
          throw new SyntaxError('invalid BigInt syntax');
        }
      // eslint: no-fallthrough: false
      case 'bigint':
        try {
          return bigInt(prim);
        } catch (e) {
          if (e instanceof Error && e.message.startsWith('Invalid integer')) throw new SyntaxError(e.message);
          throw e;
        }
      case 'boolean':
        if (prim) {
          return bigInt(1);
        } else {
          return bigInt.zero;
        }
    }
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
      return bigInt.min(NS_MAX, bigInt.max(NS_MIN, result));
    };
  })(),
  DefaultTimeZone: () => {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
  ComparisonResult: (value) => (value < 0 ? -1 : value > 0 ? 1 : value),
  GetOptionsObject: (options) => {
    if (options === undefined) return ObjectCreate(null);
    if (ES.Type(options) === 'Object') return options;
    throw new TypeError(
      `Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`
    );
  },
  GetOption: (options, property, allowedValues, fallback) => {
    let value = options[property];
    if (value !== undefined) {
      value = ES.ToString(value);
      if (!allowedValues.includes(value)) {
        throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
      }
      return value;
    }
    return fallback;
  },
  IsBuiltinCalendar: (id) => {
    return ES.Call(ArrayIncludes, BUILTIN_CALENDAR_IDS, [ES.ASCIILowercase(id)]);
  },
  ASCIILowercase: (str) => {
    return ES.Call(StringPrototypeReplace, str, [
      /[A-Z]/g,
      (l) => {
        const code = ES.Call(StringPrototypeCharCodeAt, l, [0]);
        return StringFromCharCode(code + 0x20);
      }
    ]);
  }
});

const OFFSET = new RegExp(`^${PARSE.offset.source}$`);

function bisect(getState, left, right, lstate = getState(left), rstate = getState(right)) {
  left = bigInt(left);
  right = bigInt(right);
  while (right.minus(left).greater(1)) {
    let middle = left.plus(right).divide(2);
    const mstate = getState(middle);
    if (mstate === lstate) {
      left = middle;
      lstate = mstate;
    } else if (mstate === rstate) {
      right = middle;
      rstate = mstate;
    } else {
      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}

const nsPerTimeUnit = {
  hour: 3600e9,
  minute: 60e9,
  second: 1e9,
  millisecond: 1e6,
  microsecond: 1e3,
  nanosecond: 1
};
