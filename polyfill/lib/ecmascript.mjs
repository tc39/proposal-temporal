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

export function ToIntegerWithTruncation(value) {
  const number = ToNumber(value);
  if (number === 0) return 0;
  if (NumberIsNaN(number) || !NumberIsFinite(number)) {
    throw new RangeError('invalid number value');
  }
  const integer = MathTrunc(number);
  if (integer === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return integer;
}

export function ToPositiveIntegerWithTruncation(value, property) {
  const integer = ToIntegerWithTruncation(value);
  if (integer <= 0) {
    if (property !== undefined) {
      throw new RangeError(`property '${property}' cannot be a a number less than one`);
    }
    throw new RangeError('Cannot convert a number less than one to a positive integer');
  }
  return integer;
}

export function ToIntegerIfIntegral(value) {
  const number = ToNumber(value);
  if (!NumberIsFinite(number)) throw new RangeError('infinity is out of range');
  if (!IsIntegralNumber(number)) throw new RangeError(`unsupported fractional value ${value}`);
  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return number;
}

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

export {
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

// copied from es-abstract/2022/CopyDataProperties.js
// with modifications per Temporal spec/mainadditions.html

export function CopyDataProperties(target, source, excludedKeys, excludedValues) {
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

    var enumerable =
      $isEnumerable(from, nextKey) ||
      // this is to handle string keys being non-enumerable in older engines
      (typeof source === 'string' && nextKey >= 0 && IsIntegralNumber(ToNumber(nextKey)));
    if (excluded === false && enumerable) {
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
}

export function IsTemporalInstant(item) {
  return HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR);
}

export function IsTemporalTimeZone(item) {
  return HasSlot(item, TIMEZONE_ID);
}

export function IsTemporalCalendar(item) {
  return HasSlot(item, CALENDAR_ID);
}

export function IsTemporalDuration(item) {
  return HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS);
}

export function IsTemporalDate(item) {
  return HasSlot(item, DATE_BRAND);
}

export function IsTemporalTime(item) {
  return (
    HasSlot(item, ISO_HOUR, ISO_MINUTE, ISO_SECOND, ISO_MILLISECOND, ISO_MICROSECOND, ISO_NANOSECOND) &&
    !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY)
  );
}

export function IsTemporalDateTime(item) {
  return HasSlot(
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
  );
}

export function IsTemporalYearMonth(item) {
  return HasSlot(item, YEAR_MONTH_BRAND);
}

export function IsTemporalMonthDay(item) {
  return HasSlot(item, MONTH_DAY_BRAND);
}

export function IsTemporalZonedDateTime(item) {
  return HasSlot(item, EPOCHNANOSECONDS, TIME_ZONE, CALENDAR);
}

export function RejectObjectWithCalendarOrTimeZone(item) {
  if (HasSlot(item, CALENDAR) || HasSlot(item, TIME_ZONE)) {
    throw new TypeError('with() does not support a calendar or timeZone property');
  }
  if (item.calendar !== undefined) {
    throw new TypeError('with() does not support a calendar property');
  }
  if (item.timeZone !== undefined) {
    throw new TypeError('with() does not support a timeZone property');
  }
}

export function ParseTemporalTimeZone(stringIdent) {
  const { ianaName, offset, z } = ParseTemporalTimeZoneString(stringIdent);
  if (ianaName) return GetCanonicalTimeZoneIdentifier(ianaName);
  if (z) return 'UTC';
  return offset; // if !ianaName && !z then offset must be present
}

export function MaybeFormatCalendarAnnotation(calendar, showCalendar) {
  if (showCalendar === 'never') return '';
  return FormatCalendarAnnotation(ToString(calendar), showCalendar);
}

export function FormatCalendarAnnotation(id, showCalendar) {
  if (showCalendar === 'never') return '';
  if (showCalendar === 'auto' && id === 'iso8601') return '';
  const flag = showCalendar === 'critical' ? '!' : '';
  return `[${flag}u-ca=${id}]`;
}

export function ParseISODateTime(isoString) {
  // ZDT is the superset of fields for every other Temporal type
  const match = PARSE.zoneddatetime.exec(isoString);
  if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
  let yearString = match[1];
  if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
  if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
  const year = ToIntegerOrInfinity(yearString);
  const month = ToIntegerOrInfinity(match[2] || match[4]);
  const day = ToIntegerOrInfinity(match[3] || match[5]);
  const hasTime = match[6] !== undefined;
  const hour = ToIntegerOrInfinity(match[6]);
  const minute = ToIntegerOrInfinity(match[7] || match[10]);
  let second = ToIntegerOrInfinity(match[8] || match[11]);
  if (second === 60) second = 59;
  const fraction = (match[9] || match[12]) + '000000000';
  const millisecond = ToIntegerOrInfinity(fraction.slice(0, 3));
  const microsecond = ToIntegerOrInfinity(fraction.slice(3, 6));
  const nanosecond = ToIntegerOrInfinity(fraction.slice(6, 9));
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
  RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
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
}

export function ParseTemporalInstantString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.z && !result.offset) throw new RangeError('Temporal.Instant requires a time zone offset');
  return result;
}

export function ParseTemporalZonedDateTimeString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.ianaName) throw new RangeError('Temporal.ZonedDateTime requires a time zone ID in brackets');
  return result;
}

export function ParseTemporalDateTimeString(isoString) {
  return ParseISODateTime(isoString);
}

export function ParseTemporalDateString(isoString) {
  return ParseISODateTime(isoString);
}

export function ParseTemporalTimeString(isoString) {
  const match = PARSE.time.exec(isoString);
  let hour, minute, second, millisecond, microsecond, nanosecond, annotations, calendar;
  if (match) {
    hour = ToIntegerOrInfinity(match[1]);
    minute = ToIntegerOrInfinity(match[2] || match[5]);
    second = ToIntegerOrInfinity(match[3] || match[6]);
    if (second === 60) second = 59;
    const fraction = (match[4] || match[7]) + '000000000';
    millisecond = ToIntegerOrInfinity(fraction.slice(0, 3));
    microsecond = ToIntegerOrInfinity(fraction.slice(3, 6));
    nanosecond = ToIntegerOrInfinity(fraction.slice(6, 9));
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
      ParseISODateTime(isoString));
    if (!hasTime) throw new RangeError(`time is missing in string: ${isoString}`);
    if (z) throw new RangeError('Z designator not supported for PlainTime');
  }
  // if it's a date-time string, OK
  if (/[tT ][0-9][0-9]/.test(isoString)) {
    return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
  }
  // Reject strings that are ambiguous with PlainMonthDay or PlainYearMonth.
  try {
    const { month, day } = ParseTemporalMonthDayString(isoString);
    RejectISODate(1972, month, day);
  } catch {
    try {
      const { year, month } = ParseTemporalYearMonthString(isoString);
      RejectISODate(year, month, 1);
    } catch {
      return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
    }
  }
  throw new RangeError(`invalid ISO 8601 time-only string ${isoString}; may need a T prefix`);
}

export function ParseTemporalYearMonthString(isoString) {
  const match = PARSE.yearmonth.exec(isoString);
  let year, month, calendar, referenceISODay;
  if (match) {
    let yearString = match[1];
    if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
    if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    year = ToIntegerOrInfinity(yearString);
    month = ToIntegerOrInfinity(match[2]);
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
    ({ year, month, calendar, day: referenceISODay, z } = ParseISODateTime(isoString));
    if (z) throw new RangeError('Z designator not supported for PlainYearMonth');
  }
  return { year, month, calendar, referenceISODay };
}

export function ParseTemporalMonthDayString(isoString) {
  const match = PARSE.monthday.exec(isoString);
  let month, day, calendar, referenceISOYear;
  if (match) {
    month = ToIntegerOrInfinity(match[1]);
    day = ToIntegerOrInfinity(match[2]);
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
    ({ month, day, calendar, year: referenceISOYear, z } = ParseISODateTime(isoString));
    if (z) throw new RangeError('Z designator not supported for PlainMonthDay');
  }
  return { month, day, calendar, referenceISOYear };
}

export function ParseTemporalTimeZoneString(stringIdent) {
  const bareID = new RegExp(`^${PARSE.timeZoneID.source}$`, 'i');
  if (bareID.test(stringIdent)) return { ianaName: stringIdent };
  try {
    // Try parsing ISO string instead
    const result = ParseISODateTime(stringIdent);
    if (result.z || result.offset || result.ianaName) {
      return result;
    }
  } catch {
    // fall through
  }
  throw new RangeError(`Invalid time zone: ${stringIdent}`);
}

export function ParseTemporalDurationString(isoString) {
  const match = PARSE.duration.exec(isoString);
  if (!match) throw new RangeError(`invalid duration: ${isoString}`);
  if (match.slice(2).every((element) => element === undefined)) {
    throw new RangeError(`invalid duration: ${isoString}`);
  }
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : 1;
  const years = match[2] === undefined ? 0 : ToIntegerWithTruncation(match[2]) * sign;
  const months = match[3] === undefined ? 0 : ToIntegerWithTruncation(match[3]) * sign;
  const weeks = match[4] === undefined ? 0 : ToIntegerWithTruncation(match[4]) * sign;
  const days = match[5] === undefined ? 0 : ToIntegerWithTruncation(match[5]) * sign;
  const hours = match[6] === undefined ? 0 : ToIntegerWithTruncation(match[6]) * sign;
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
    excessNanoseconds = ToIntegerWithTruncation((fHours + '000000000').slice(0, 9)) * 3600 * sign;
  } else {
    minutes = minutesStr === undefined ? 0 : ToIntegerWithTruncation(minutesStr) * sign;
    if (fMinutes !== undefined) {
      if (secondsStr ?? fSeconds ?? false) {
        throw new RangeError('only the smallest unit can be fractional');
      }
      excessNanoseconds = ToIntegerWithTruncation((fMinutes + '000000000').slice(0, 9)) * 60 * sign;
    } else {
      seconds = secondsStr === undefined ? 0 : ToIntegerWithTruncation(secondsStr) * sign;
      if (fSeconds !== undefined) {
        excessNanoseconds = ToIntegerWithTruncation((fSeconds + '000000000').slice(0, 9)) * sign;
      }
    }
  }

  const nanoseconds = excessNanoseconds % 1000;
  const microseconds = MathTrunc(excessNanoseconds / 1000) % 1000;
  const milliseconds = MathTrunc(excessNanoseconds / 1e6) % 1000;
  seconds += MathTrunc(excessNanoseconds / 1e9) % 60;
  minutes += MathTrunc(excessNanoseconds / 6e10);

  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function ParseTemporalInstant(isoString) {
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offset, z } =
    ParseTemporalInstantString(isoString);

  if (!z && !offset) throw new RangeError('Temporal.Instant requires a time zone offset');
  const offsetNs = z ? 0 : ParseTimeZoneOffsetString(offset);
  ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceISODateTime(
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
  const epochNs = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (epochNs === null) throw new RangeError('DateTime outside of supported range');
  return epochNs;
}

export function RegulateISODate(year, month, day, overflow) {
  switch (overflow) {
    case 'reject':
      RejectISODate(year, month, day);
      break;
    case 'constrain':
      ({ year, month, day } = ConstrainISODate(year, month, day));
      break;
  }
  return { year, month, day };
}

export function RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow) {
  switch (overflow) {
    case 'reject':
      RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
      break;
    case 'constrain':
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ConstrainTime(
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
}

export function RegulateISOYearMonth(year, month, overflow) {
  const referenceISODay = 1;
  switch (overflow) {
    case 'reject':
      RejectISODate(year, month, referenceISODay);
      break;
    case 'constrain':
      ({ year, month } = ConstrainISODate(year, month));
      break;
  }
  return { year, month };
}

export function ToTemporalDurationRecord(item) {
  if (Type(item) !== 'Object') {
    return ParseTemporalDurationString(ToString(item));
  }
  if (IsTemporalDuration(item)) {
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
  let partial = ToTemporalPartialDurationRecord(item);
  for (let index = 0; index < DURATION_FIELDS.length; index++) {
    const property = DURATION_FIELDS[index];
    const value = partial[property];
    if (value !== undefined) {
      result[property] = value;
    }
  }
  let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = result;
  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  return result;
}

export function ToTemporalPartialDurationRecord(temporalDurationLike) {
  if (Type(temporalDurationLike) !== 'Object') {
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
      result[property] = ToIntegerIfIntegral(value);
    }
  }
  if (!any) {
    throw new TypeError('invalid duration-like');
  }
  return result;
}

export function ToLimitedTemporalDuration(item, disallowedProperties) {
  let record = ToTemporalDurationRecord(item);
  for (const property of disallowedProperties) {
    if (record[property] !== 0) {
      throw new RangeError(
        `Duration field ${property} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`
      );
    }
  }
  return record;
}

export function ToTemporalOverflow(options) {
  if (options === undefined) return 'constrain';
  return GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
}

export function ToTemporalDisambiguation(options) {
  if (options === undefined) return 'compatible';
  return GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
}

export function ToTemporalRoundingMode(options, fallback) {
  return GetOption(
    options,
    'roundingMode',
    ['ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'],
    fallback
  );
}

export function NegateTemporalRoundingMode(roundingMode) {
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
}

export function ToTemporalOffset(options, fallback) {
  if (options === undefined) return fallback;
  return GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback);
}

export function ToCalendarNameOption(options) {
  return GetOption(options, 'calendarName', ['auto', 'always', 'never', 'critical'], 'auto');
}

export function ToTimeZoneNameOption(options) {
  return GetOption(options, 'timeZoneName', ['auto', 'never', 'critical'], 'auto');
}

export function ToShowOffsetOption(options) {
  return GetOption(options, 'offset', ['auto', 'never'], 'auto');
}

export function ToTemporalRoundingIncrement(options) {
  let increment = options.roundingIncrement;
  if (increment === undefined) return 1;
  increment = ToNumber(increment);
  if (!NumberIsFinite(increment) || increment < 1) {
    throw new RangeError(`roundingIncrement must be at least 1 and finite, not ${increment}`);
  }
  return MathTrunc(increment);
}

export function ValidateTemporalRoundingIncrement(increment, dividend, inclusive) {
  const maximum = inclusive ? dividend : dividend - 1;
  if (increment > maximum) {
    throw new RangeError(`roundingIncrement must be at least 1 and less than ${maximum}, not ${increment}`);
  }
  if (dividend % increment !== 0) {
    throw new RangeError(`Rounding increment must divide evenly into ${dividend}`);
  }
}

export function ToFractionalSecondDigits(normalizedOptions) {
  let digitsValue = normalizedOptions.fractionalSecondDigits;
  if (digitsValue === undefined) return 'auto';
  if (Type(digitsValue) !== 'Number') {
    if (ToString(digitsValue) !== 'auto') {
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
    }
    return 'auto';
  }
  const digitCount = MathFloor(digitsValue);
  if (!NumberIsFinite(digitCount) || digitCount < 0 || digitCount > 9) {
    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
  }
  return digitCount;
}

export function ToSecondsStringPrecisionRecord(smallestUnit, precision) {
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
}

export const REQUIRED = Symbol('~required~');

export function GetTemporalUnit(options, key, unitGroup, requiredOrDefault, extraValues = []) {
  const allowedSingular = [];
  for (let index = 0; index < SINGULAR_PLURAL_UNITS.length; index++) {
    const unitInfo = SINGULAR_PLURAL_UNITS[index];
    const singular = unitInfo[1];
    const category = unitInfo[2];
    if (unitGroup === 'datetime' || unitGroup === category) {
      allowedSingular.push(singular);
    }
  }
  Call(ArrayPrototypePush, allowedSingular, extraValues);
  let defaultVal = requiredOrDefault;
  if (defaultVal === REQUIRED) {
    defaultVal = undefined;
  } else if (defaultVal !== undefined) {
    allowedSingular.push(defaultVal);
  }
  const allowedValues = [];
  Call(ArrayPrototypePush, allowedValues, allowedSingular);
  for (let index = 0; index < allowedSingular.length; index++) {
    const singular = allowedSingular[index];
    const plural = PLURAL_FOR.get(singular);
    if (plural !== undefined) allowedValues.push(plural);
  }
  let retval = GetOption(options, key, allowedValues, defaultVal);
  if (retval === undefined && requiredOrDefault === REQUIRED) {
    throw new RangeError(`${key} is required`);
  }
  if (SINGULAR_FOR.has(retval)) retval = SINGULAR_FOR.get(retval);
  return retval;
}

export function ToRelativeTemporalObject(options) {
  const relativeTo = options.relativeTo;
  if (relativeTo === undefined) return relativeTo;

  let offsetBehaviour = 'option';
  let matchMinutes = false;
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, timeZone, offset;
  if (Type(relativeTo) === 'Object') {
    if (IsTemporalZonedDateTime(relativeTo) || IsTemporalDate(relativeTo)) return relativeTo;
    if (IsTemporalDateTime(relativeTo)) return TemporalDateTimeToDate(relativeTo);
    calendar = GetTemporalCalendarWithISODefault(relativeTo);
    const fieldNames = CalendarFields(calendar, [
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
    Call(ArrayPrototypePush, fieldNames, ['timeZone', 'offset']);
    const fields = PrepareTemporalFields(relativeTo, fieldNames, []);
    const dateOptions = ObjectCreate(null);
    dateOptions.overflow = 'constrain';
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendar,
      fields,
      dateOptions
    ));
    offset = fields.offset;
    if (offset === undefined) offsetBehaviour = 'wall';
    timeZone = fields.timeZone;
  } else {
    let ianaName, z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, ianaName, offset, z } =
      ParseISODateTime(ToString(relativeTo)));
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
    if (!calendar) calendar = GetISO8601Calendar();
    calendar = ToTemporalCalendar(calendar);
  }
  if (timeZone === undefined) return CreateTemporalDate(year, month, day, calendar);
  timeZone = ToTemporalTimeZone(timeZone);
  const offsetNs = offsetBehaviour === 'option' ? ParseTimeZoneOffsetString(offset) : 0;
  const epochNanoseconds = InterpretISODateTimeOffset(
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
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
}

export function DefaultTemporalLargestUnit(
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
) {
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
}

export function LargerOfTwoTemporalUnits(unit1, unit2) {
  if (UNITS_DESCENDING.indexOf(unit1) > UNITS_DESCENDING.indexOf(unit2)) return unit2;
  return unit1;
}

export function PrepareTemporalFields(
  bag,
  fields,
  requiredFields,
  { emptySourceErrorMessage = 'no supported properties found' } = {}
) {
  const result = ObjectCreate(null);
  let any = false;
  Call(ArrayPrototypeSort, fields, []);
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
      if (Call(ArrayIncludes, requiredFields, [property])) {
        throw new TypeError(`required property '${property}' missing or undefined`);
      }
      value = BUILTIN_DEFAULTS.get(property);
      result[property] = value;
    }
  }
  if (requiredFields === 'partial' && !any) {
    throw new TypeError(emptySourceErrorMessage);
  }
  if ((result['era'] === undefined) !== (result['eraYear'] === undefined)) {
    throw new RangeError("properties 'era' and 'eraYear' must be provided together");
  }
  return result;
}

export function ToTemporalTimeRecord(bag, completeness = 'complete') {
  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
  const partial = PrepareTemporalFields(bag, fields, 'partial', { emptySourceErrorMessage: 'invalid time-like' });
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
}

export function ToTemporalDate(item, options) {
  if (Type(item) === 'Object') {
    if (IsTemporalDate(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      ToTemporalOverflow(options); // validate and ignore
      item = GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
      ToTemporalOverflow(options); // validate and ignore
      return CreateTemporalDate(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR)
      );
    }
    const calendar = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    return CalendarDateFromFields(calendar, fields, options);
  }
  ToTemporalOverflow(options); // validate and ignore
  let { year, month, day, calendar, z } = ParseTemporalDateString(ToString(item));
  if (z) throw new RangeError('Z designator not supported for PlainDate');
  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
  return new TemporalPlainDate(year, month, day, calendar); // include validation
}

export function InterpretTemporalDateTimeFields(calendar, fields, options) {
  let { hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(fields);
  const overflow = ToTemporalOverflow(options);
  const date = CalendarDateFromFields(calendar, fields, options);
  const year = GetSlot(date, ISO_YEAR);
  const month = GetSlot(date, ISO_MONTH);
  const day = GetSlot(date, ISO_DAY);
  ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    overflow
  ));
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}

export function ToTemporalDateTime(item, options) {
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar;
  if (Type(item) === 'Object') {
    if (IsTemporalDateTime(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      ToTemporalOverflow(options); // validate and ignore
      return GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDate(item)) {
      ToTemporalOverflow(options); // validate and ignore
      return CreateTemporalDateTime(
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

    calendar = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar, [
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
    const fields = PrepareTemporalFields(item, fieldNames, []);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendar,
      fields,
      options
    ));
  } else {
    ToTemporalOverflow(options); // validate and ignore
    let z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, z } =
      ParseTemporalDateTimeString(ToString(item)));
    if (z) throw new RangeError('Z designator not supported for PlainDateTime');
    RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (calendar === undefined) calendar = GetISO8601Calendar();
    calendar = ToTemporalCalendar(calendar);
  }
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
}

export function ToTemporalDuration(item) {
  if (IsTemporalDuration(item)) return item;
  let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(item);
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
}

export function ToTemporalInstant(item) {
  if (IsTemporalInstant(item)) return item;
  if (IsTemporalZonedDateTime(item)) {
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
  }
  const ns = ParseTemporalInstant(ToString(item));
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  return new TemporalInstant(ns);
}

export function ToTemporalMonthDay(item, options) {
  if (Type(item) === 'Object') {
    if (IsTemporalMonthDay(item)) return item;
    let calendar, calendarAbsent;
    if (HasSlot(item, CALENDAR)) {
      calendar = GetSlot(item, CALENDAR);
      calendarAbsent = false;
    } else {
      calendar = item.calendar;
      calendarAbsent = calendar === undefined;
      if (calendar === undefined) calendar = GetISO8601Calendar();
      calendar = ToTemporalCalendar(calendar);
    }
    const fieldNames = CalendarFields(calendar, ['day', 'month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    // Callers who omit the calendar are not writing calendar-independent
    // code. In that case, `monthCode`/`year` can be omitted; `month` and
    // `day` are sufficient. Add a `year` to satisfy calendar validation.
    if (calendarAbsent && fields.month !== undefined && fields.monthCode === undefined && fields.year === undefined) {
      fields.year = 1972;
    }
    return CalendarMonthDayFromFields(calendar, fields, options);
  }

  ToTemporalOverflow(options); // validate and ignore
  let { month, day, referenceISOYear, calendar } = ParseTemporalMonthDayString(ToString(item));
  if (calendar === undefined) calendar = GetISO8601Calendar();
  calendar = ToTemporalCalendar(calendar);

  if (referenceISOYear === undefined) {
    RejectISODate(1972, month, day);
    return CreateTemporalMonthDay(month, day, calendar);
  }
  const result = CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
  return CalendarMonthDayFromFields(calendar, result);
}

export function ToTemporalTime(item, overflow = 'constrain') {
  let hour, minute, second, millisecond, microsecond, nanosecond, calendar;
  if (Type(item) === 'Object') {
    if (IsTemporalTime(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      item = GetPlainDateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
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
    calendar = GetTemporalCalendarWithISODefault(item);
    if (ToString(calendar) !== 'iso8601') {
      throw new RangeError('PlainTime can only have iso8601 calendar');
    }
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(item));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      overflow
    ));
  } else {
    ({ hour, minute, second, millisecond, microsecond, nanosecond, calendar } = ParseTemporalTimeString(
      ToString(item)
    ));
    RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
    if (calendar !== undefined && calendar !== 'iso8601') {
      throw new RangeError('PlainTime can only have iso8601 calendar');
    }
  }
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

export function ToTemporalYearMonth(item, options) {
  if (Type(item) === 'Object') {
    if (IsTemporalYearMonth(item)) return item;
    const calendar = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar, ['month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    return CalendarYearMonthFromFields(calendar, fields, options);
  }

  ToTemporalOverflow(options); // validate and ignore
  let { year, month, referenceISODay, calendar } = ParseTemporalYearMonthString(ToString(item));
  if (calendar === undefined) calendar = GetISO8601Calendar();
  calendar = ToTemporalCalendar(calendar);

  if (referenceISODay === undefined) {
    RejectISODate(year, month, 1);
    return CreateTemporalYearMonth(year, month, calendar);
  }
  const result = CreateTemporalYearMonth(year, month, calendar, referenceISODay);
  return CalendarYearMonthFromFields(calendar, result);
}

export function InterpretISODateTimeOffset(
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
) {
  const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
  const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Instant in the given time zone
    const instant = GetInstantFor(timeZone, dt, disambiguation);
    return GetSlot(instant, EPOCHNANOSECONDS);
  }

  // The caller wants the offset to always win ('use') OR the caller is OK
  // with the offset winning ('prefer' or 'reject') as long as it's valid
  // for this timezone and date/time.
  if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
    // Calculate the instant for the input's date/time and offset
    const epochNs = GetUTCEpochNanoseconds(
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
  const possibleInstants = GetPossibleInstantsFor(timeZone, dt);
  for (let index = 0; index < possibleInstants.length; index++) {
    const candidate = possibleInstants[index];
    const candidateOffset = GetOffsetNanosecondsFor(timeZone, candidate);
    const roundedCandidateOffset = RoundNumberToIncrement(bigInt(candidateOffset), 60e9, 'halfExpand').toJSNumber();
    if (candidateOffset === offsetNs || (matchMinute && roundedCandidateOffset === offsetNs)) {
      return GetSlot(candidate, EPOCHNANOSECONDS);
    }
  }

  // the user-provided offset doesn't match any instants for this time
  // zone and date/time.
  if (offsetOpt === 'reject') {
    const offsetStr = FormatTimeZoneOffsetString(offsetNs);
    const timeZoneString = IsTemporalTimeZone(timeZone) ? GetSlot(timeZone, TIMEZONE_ID) : 'time zone';
    throw new RangeError(`Offset ${offsetStr} is invalid for ${dt} in ${timeZoneString}`);
  }
  // fall through: offsetOpt === 'prefer', but the offset doesn't match
  // so fall back to use the time zone instead.
  const instant = DisambiguatePossibleInstants(possibleInstants, timeZone, dt, disambiguation);
  return GetSlot(instant, EPOCHNANOSECONDS);
}

export function ToTemporalZonedDateTime(item, options) {
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone, offset, calendar;
  let disambiguation, offsetOpt;
  let matchMinute = false;
  let offsetBehaviour = 'option';
  if (Type(item) === 'Object') {
    if (IsTemporalZonedDateTime(item)) return item;
    calendar = GetTemporalCalendarWithISODefault(item);
    const fieldNames = CalendarFields(calendar, [
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
    Call(ArrayPrototypePush, fieldNames, ['timeZone', 'offset']);
    const fields = PrepareTemporalFields(item, fieldNames, ['timeZone']);
    timeZone = ToTemporalTimeZone(fields.timeZone);
    offset = fields.offset;
    if (offset === undefined) {
      offsetBehaviour = 'wall';
    }
    disambiguation = ToTemporalDisambiguation(options);
    offsetOpt = ToTemporalOffset(options, 'reject');
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendar,
      fields,
      options
    ));
  } else {
    let ianaName, z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, ianaName, offset, z, calendar } =
      ParseTemporalZonedDateTimeString(ToString(item)));
    if (z) {
      offsetBehaviour = 'exact';
    } else if (!offset) {
      offsetBehaviour = 'wall';
    }
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    timeZone = new TemporalTimeZone(ianaName);
    if (!calendar) calendar = GetISO8601Calendar();
    calendar = ToTemporalCalendar(calendar);
    matchMinute = true; // ISO strings may specify offset with less precision
    disambiguation = ToTemporalDisambiguation(options);
    offsetOpt = ToTemporalOffset(options, 'reject');
    ToTemporalOverflow(options); // validate and ignore
  }
  let offsetNs = 0;
  if (offsetBehaviour === 'option') offsetNs = ParseTimeZoneOffsetString(offset);
  const epochNanoseconds = InterpretISODateTimeOffset(
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
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
}

export function CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar) {
  RejectISODate(isoYear, isoMonth, isoDay);
  RejectDateRange(isoYear, isoMonth, isoDay);

  CreateSlots(result);
  SetSlot(result, ISO_YEAR, isoYear);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, isoDay);
  SetSlot(result, CALENDAR, calendar);
  SetSlot(result, DATE_BRAND, true);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    ObjectDefineProperty(result, '_repr_', {
      value: `${result[Symbol.toStringTag]} <${TemporalDateToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalDate(isoYear, isoMonth, isoDay, calendar = GetISO8601Calendar()) {
  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
  const result = ObjectCreate(TemporalPlainDate.prototype);
  CreateTemporalDateSlots(result, isoYear, isoMonth, isoDay, calendar);
  return result;
}

export function CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar) {
  RejectDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);
  RejectDateTimeRange(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns);

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
      value: `${result[Symbol.toStringTag]} <${TemporalDateTimeToString(result, 'auto')}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalDateTime(
  isoYear,
  isoMonth,
  isoDay,
  h,
  min,
  s,
  ms,
  µs,
  ns,
  calendar = GetISO8601Calendar()
) {
  const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
  const result = ObjectCreate(TemporalPlainDateTime.prototype);
  CreateTemporalDateTimeSlots(result, isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar);
  return result;
}

export function CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar, referenceISOYear) {
  RejectISODate(referenceISOYear, isoMonth, isoDay);
  RejectDateRange(referenceISOYear, isoMonth, isoDay);

  CreateSlots(result);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, isoDay);
  SetSlot(result, ISO_YEAR, referenceISOYear);
  SetSlot(result, CALENDAR, calendar);
  SetSlot(result, MONTH_DAY_BRAND, true);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    Object.defineProperty(result, '_repr_', {
      value: `${result[Symbol.toStringTag]} <${TemporalMonthDayToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalMonthDay(isoMonth, isoDay, calendar = GetISO8601Calendar(), referenceISOYear = 1972) {
  const TemporalPlainMonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
  const result = ObjectCreate(TemporalPlainMonthDay.prototype);
  CreateTemporalMonthDaySlots(result, isoMonth, isoDay, calendar, referenceISOYear);
  return result;
}

export function CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay) {
  RejectISODate(isoYear, isoMonth, referenceISODay);
  RejectYearMonthRange(isoYear, isoMonth);

  CreateSlots(result);
  SetSlot(result, ISO_YEAR, isoYear);
  SetSlot(result, ISO_MONTH, isoMonth);
  SetSlot(result, ISO_DAY, referenceISODay);
  SetSlot(result, CALENDAR, calendar);
  SetSlot(result, YEAR_MONTH_BRAND, true);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    Object.defineProperty(result, '_repr_', {
      value: `${result[Symbol.toStringTag]} <${TemporalYearMonthToString(result)}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalYearMonth(isoYear, isoMonth, calendar = GetISO8601Calendar(), referenceISODay = 1) {
  const TemporalPlainYearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
  const result = ObjectCreate(TemporalPlainYearMonth.prototype);
  CreateTemporalYearMonthSlots(result, isoYear, isoMonth, calendar, referenceISODay);
  return result;
}

export function CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar) {
  ValidateEpochNanoseconds(epochNanoseconds);

  CreateSlots(result);
  SetSlot(result, EPOCHNANOSECONDS, epochNanoseconds);
  SetSlot(result, TIME_ZONE, timeZone);
  SetSlot(result, CALENDAR, calendar);

  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const instant = new TemporalInstant(GetSlot(result, EPOCHNANOSECONDS));
  SetSlot(result, INSTANT, instant);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    Object.defineProperty(result, '_repr_', {
      value: `${result[Symbol.toStringTag]} <${TemporalZonedDateTimeToString(result, 'auto')}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar = GetISO8601Calendar()) {
  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
  const result = ObjectCreate(TemporalZonedDateTime.prototype);
  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
  return result;
}

export function GetISO8601Calendar() {
  const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
  return new TemporalCalendar('iso8601');
}

export function CalendarFields(calendar, fieldNames) {
  const fields = GetMethod(calendar, 'fields');
  if (fields === undefined) return fieldNames;
  fieldNames = Call(fields, calendar, [fieldNames]);
  const result = [];
  for (const name of fieldNames) {
    if (Type(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
    Call(ArrayPrototypePush, result, [name]);
  }
  return result;
}

export function CalendarMergeFields(calendar, fields, additionalFields) {
  const mergeFields = GetMethod(calendar, 'mergeFields');
  if (mergeFields === undefined) return { ...fields, ...additionalFields };
  const result = Call(mergeFields, calendar, [fields, additionalFields]);
  if (Type(result) !== 'Object') throw new TypeError('bad return from calendar.mergeFields()');
  return result;
}

export function CalendarDateAdd(calendar, date, duration, options, dateAdd) {
  if (dateAdd === undefined) {
    dateAdd = GetMethod(calendar, 'dateAdd');
  }
  const result = Call(dateAdd, calendar, [date, duration, options]);
  if (!IsTemporalDate(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarDateUntil(calendar, date, otherDate, options, dateUntil) {
  if (dateUntil === undefined) {
    dateUntil = GetMethod(calendar, 'dateUntil');
  }
  const result = Call(dateUntil, calendar, [date, otherDate, options]);
  if (!IsTemporalDuration(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarYear(calendar, dateLike) {
  const year = GetMethod(calendar, 'year');
  const result = Call(year, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar year result must be an integer');
  }
  if (!IsIntegralNumber(result)) {
    throw new RangeError('calendar year result must be an integer');
  }
  return result;
}

export function CalendarMonth(calendar, dateLike) {
  const month = GetMethod(calendar, 'month');
  const result = Call(month, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar month result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar month result must be a positive integer');
  }
  return result;
}

export function CalendarMonthCode(calendar, dateLike) {
  const monthCode = GetMethod(calendar, 'monthCode');
  const result = Call(monthCode, calendar, [dateLike]);
  if (typeof result !== 'string') {
    throw new TypeError('calendar monthCode result must be a string');
  }
  return result;
}

export function CalendarDay(calendar, dateLike) {
  const day = GetMethod(calendar, 'day');
  const result = Call(day, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar day result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar day result must be a positive integer');
  }
  return result;
}

export function CalendarEra(calendar, dateLike) {
  const era = GetMethod(calendar, 'era');
  let result = Call(era, calendar, [dateLike]);
  if (result === undefined) {
    return result;
  }
  if (typeof result !== 'string') {
    throw new TypeError('calendar era result must be a string');
  }
  return result;
}

export function CalendarEraYear(calendar, dateLike) {
  const eraYear = GetMethod(calendar, 'eraYear');
  let result = Call(eraYear, calendar, [dateLike]);
  if (result === undefined) {
    return result;
  }
  if (typeof result !== 'number') {
    throw new TypeError('calendar eraYear result must be an integer');
  }
  if (!IsIntegralNumber(result)) {
    throw new RangeError('calendar eraYear result must be an integer');
  }
  return result;
}

export function CalendarDayOfWeek(calendar, dateLike) {
  const dayOfWeek = GetMethod(calendar, 'dayOfWeek');
  const result = Call(dayOfWeek, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar dayOfWeek result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar dayOfWeek result must be a positive integer');
  }
  return result;
}

export function CalendarDayOfYear(calendar, dateLike) {
  const dayOfYear = GetMethod(calendar, 'dayOfYear');
  const result = Call(dayOfYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar dayOfYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar dayOfYear result must be a positive integer');
  }
  return result;
}

export function CalendarWeekOfYear(calendar, dateLike) {
  const weekOfYear = GetMethod(calendar, 'weekOfYear');
  const result = Call(weekOfYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar weekOfYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar weekOfYear result must be a positive integer');
  }
  return result;
}

export function CalendarYearOfWeek(calendar, dateLike) {
  const yearOfWeek = GetMethod(calendar, 'yearOfWeek');
  const result = Call(yearOfWeek, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar yearOfWeek result must be an integer');
  }
  if (!IsIntegralNumber(result)) {
    throw new RangeError('calendar yearOfWeek result must be an integer');
  }
  return result;
}

export function CalendarDaysInWeek(calendar, dateLike) {
  const daysInWeek = GetMethod(calendar, 'daysInWeek');
  const result = Call(daysInWeek, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInWeek result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar daysInWeek result must be a positive integer');
  }
  return result;
}

export function CalendarDaysInMonth(calendar, dateLike) {
  const daysInMonth = GetMethod(calendar, 'daysInMonth');
  const result = Call(daysInMonth, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInMonth result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar daysInMonth result must be a positive integer');
  }
  return result;
}

export function CalendarDaysInYear(calendar, dateLike) {
  const daysInYear = GetMethod(calendar, 'daysInYear');
  const result = Call(daysInYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar daysInYear result must be a positive integer');
  }
  return result;
}

export function CalendarMonthsInYear(calendar, dateLike) {
  const monthsInYear = GetMethod(calendar, 'monthsInYear');
  const result = Call(monthsInYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar monthsInYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result <= 0) {
    throw new RangeError('calendar monthsInYear result must be a positive integer');
  }
  return result;
}

export function CalendarInLeapYear(calendar, dateLike) {
  const inLeapYear = GetMethod(calendar, 'inLeapYear');
  const result = Call(inLeapYear, calendar, [dateLike]);
  if (typeof result !== 'boolean') {
    throw new TypeError('calendar inLeapYear result must be a boolean');
  }
  return result;
}

export function ToTemporalCalendar(calendarLike) {
  if (Type(calendarLike) === 'Object') {
    if (IsTemporalCalendar(calendarLike)) return calendarLike;
    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
    if (IsTemporalTimeZone(calendarLike)) {
      throw new RangeError('Expected a calendar object but received a Temporal.TimeZone');
    }
    if (!('calendar' in calendarLike)) return calendarLike;
    calendarLike = calendarLike.calendar;
    if (Type(calendarLike) === 'Object') {
      if (IsTemporalTimeZone(calendarLike)) {
        throw new RangeError('Expected a calendar object as the calendar property but received a Temporal.TimeZone');
      }
      if (!('calendar' in calendarLike)) return calendarLike;
    }
  }
  const identifier = ToString(calendarLike);
  const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
  if (IsBuiltinCalendar(identifier)) return new TemporalCalendar(identifier);
  let calendar;
  try {
    ({ calendar } = ParseISODateTime(identifier));
  } catch {
    try {
      ({ calendar } = ParseTemporalYearMonthString(identifier));
    } catch {
      ({ calendar } = ParseTemporalMonthDayString(identifier));
    }
  }
  if (!calendar) calendar = 'iso8601';
  return new TemporalCalendar(calendar);
}

export function GetTemporalCalendarWithISODefault(item) {
  if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
  const { calendar } = item;
  if (calendar === undefined) return GetISO8601Calendar();
  return ToTemporalCalendar(calendar);
}

export function CalendarEquals(one, two) {
  if (one === two) return true;
  const cal1 = ToString(one);
  const cal2 = ToString(two);
  return cal1 === cal2;
}
// This operation is not in the spec, it implements the following:
// "If ? CalendarEquals(one, two) is false, throw a RangeError exception."
// This is so that we can build an informative error message without
// re-getting the .id properties.

export function CalendarEqualsOrThrow(one, two, errorMessageAction) {
  if (one === two) return true;
  const cal1 = ToString(one);
  const cal2 = ToString(two);
  if (cal1 !== cal2) {
    throw new RangeError(`cannot ${errorMessageAction} of ${cal1} and ${cal2} calendars`);
  }
}

export function ConsolidateCalendars(one, two) {
  if (one === two) return two;
  const sOne = ToString(one);
  const sTwo = ToString(two);
  if (sOne === sTwo || sOne === 'iso8601') {
    return two;
  } else if (sTwo === 'iso8601') {
    return one;
  } else {
    throw new RangeError('irreconcilable calendars');
  }
}

export function CalendarDateFromFields(calendar, fields, options) {
  const dateFromFields = GetMethod(calendar, 'dateFromFields');
  const result = Call(dateFromFields, calendar, [fields, options]);
  if (!IsTemporalDate(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarYearMonthFromFields(calendar, fields, options) {
  const yearMonthFromFields = GetMethod(calendar, 'yearMonthFromFields');
  const result = Call(yearMonthFromFields, calendar, [fields, options]);
  if (!IsTemporalYearMonth(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarMonthDayFromFields(calendar, fields, options) {
  const monthDayFromFields = GetMethod(calendar, 'monthDayFromFields');
  const result = Call(monthDayFromFields, calendar, [fields, options]);
  if (!IsTemporalMonthDay(result)) throw new TypeError('invalid result');
  return result;
}

export function ToTemporalTimeZone(temporalTimeZoneLike) {
  if (Type(temporalTimeZoneLike) === 'Object') {
    if (IsTemporalTimeZone(temporalTimeZoneLike)) return temporalTimeZoneLike;
    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
    if (IsTemporalCalendar(temporalTimeZoneLike)) {
      throw new RangeError('Expected a time zone object but received a Temporal.Calendar');
    }
    if (!('timeZone' in temporalTimeZoneLike)) return temporalTimeZoneLike;
    temporalTimeZoneLike = temporalTimeZoneLike.timeZone;
    if (Type(temporalTimeZoneLike) === 'Object') {
      if (IsTemporalCalendar(temporalTimeZoneLike)) {
        throw new RangeError('Expected a time zone object as the timeZone property but received a Temporal.Calendar');
      }
      if (!('timeZone' in temporalTimeZoneLike)) return temporalTimeZoneLike;
    }
  }
  const identifier = ToString(temporalTimeZoneLike);
  const timeZone = ParseTemporalTimeZone(identifier);
  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
  return new TemporalTimeZone(timeZone);
}

export function TimeZoneEquals(one, two) {
  if (one === two) return true;
  const tz1 = ToString(one);
  const tz2 = ToString(two);
  return tz1 === tz2;
}

export function TemporalDateTimeToDate(dateTime) {
  return CreateTemporalDate(
    GetSlot(dateTime, ISO_YEAR),
    GetSlot(dateTime, ISO_MONTH),
    GetSlot(dateTime, ISO_DAY),
    GetSlot(dateTime, CALENDAR)
  );
}

export function TemporalDateTimeToTime(dateTime) {
  const Time = GetIntrinsic('%Temporal.PlainTime%');
  return new Time(
    GetSlot(dateTime, ISO_HOUR),
    GetSlot(dateTime, ISO_MINUTE),
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND)
  );
}

export function GetOffsetNanosecondsFor(timeZone, instant) {
  const getOffsetNanosecondsFor = GetMethod(timeZone, 'getOffsetNanosecondsFor');
  const offsetNs = Call(getOffsetNanosecondsFor, timeZone, [instant]);
  if (typeof offsetNs !== 'number') {
    throw new TypeError('bad return from getOffsetNanosecondsFor');
  }
  if (!IsIntegralNumber(offsetNs) || MathAbs(offsetNs) >= 86400e9) {
    throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
  }
  return offsetNs;
}

export function GetOffsetStringFor(timeZone, instant) {
  const offsetNs = GetOffsetNanosecondsFor(timeZone, instant);
  return FormatTimeZoneOffsetString(offsetNs);
}

export function GetPlainDateTimeFor(timeZone, instant, calendar) {
  const ns = GetSlot(instant, EPOCHNANOSECONDS);
  const offsetNs = GetOffsetNanosecondsFor(timeZone, instant);
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = GetISOPartsFromEpoch(ns);
  ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceISODateTime(
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
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
}

export function GetInstantFor(timeZone, dateTime, disambiguation) {
  const possibleInstants = GetPossibleInstantsFor(timeZone, dateTime);
  return DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation);
}

export function DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation) {
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
  const utcns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (utcns === null) throw new RangeError('DateTime outside of supported range');
  const dayBefore = new Instant(utcns.minus(86400e9));
  const dayAfter = new Instant(utcns.plus(86400e9));
  const offsetBefore = GetOffsetNanosecondsFor(timeZone, dayBefore);
  const offsetAfter = GetOffsetNanosecondsFor(timeZone, dayAfter);
  const nanoseconds = offsetAfter - offsetBefore;
  switch (disambiguation) {
    case 'earlier': {
      const calendar = GetSlot(dateTime, CALENDAR);
      const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
      const earlier = AddDateTime(
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
      return GetPossibleInstantsFor(timeZone, earlierPlainDateTime)[0];
    }
    case 'compatible':
    // fall through because 'compatible' means 'later' for "spring forward" transitions
    case 'later': {
      const calendar = GetSlot(dateTime, CALENDAR);
      const PlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
      const later = AddDateTime(
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
      const possible = GetPossibleInstantsFor(timeZone, laterPlainDateTime);
      return possible[possible.length - 1];
    }
    case 'reject': {
      throw new RangeError('no such instant found');
    }
  }
  throw new Error(`assertion failed: invalid disambiguation value ${disambiguation}`);
}

export function GetPossibleInstantsFor(timeZone, dateTime) {
  let getPossibleInstantsFor = GetMethod(timeZone, 'getPossibleInstantsFor');
  const possibleInstants = Call(getPossibleInstantsFor, timeZone, [dateTime]);
  const result = [];
  for (const instant of possibleInstants) {
    if (!IsTemporalInstant(instant)) {
      throw new TypeError('bad return from getPossibleInstantsFor');
    }
    Call(ArrayPrototypePush, result, [instant]);
  }
  return result;
}

export function ISOYearString(year) {
  let yearString;
  if (year < 0 || year > 9999) {
    let sign = year < 0 ? '-' : '+';
    let yearNumber = MathAbs(year);
    yearString = sign + `000000${yearNumber}`.slice(-6);
  } else {
    yearString = `0000${year}`.slice(-4);
  }
  return yearString;
}

export function ISODateTimePartString(part) {
  return `00${part}`.slice(-2);
}

export function FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision) {
  if (precision === 'minute') return '';

  const secs = `:${ISODateTimePartString(second)}`;
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
}

export function TemporalInstantToString(instant, timeZone, precision) {
  let outputTimeZone = timeZone;
  if (outputTimeZone === undefined) {
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    outputTimeZone = new TemporalTimeZone('UTC');
  }
  const iso = GetISO8601Calendar();
  const dateTime = GetPlainDateTimeFor(outputTimeZone, instant, iso);
  const year = ISOYearString(GetSlot(dateTime, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
  const hour = ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
  const minute = ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
  const seconds = FormatSecondsStringPart(
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND),
    precision
  );
  let timeZoneString = 'Z';
  if (timeZone !== undefined) {
    const offsetNs = GetOffsetNanosecondsFor(outputTimeZone, instant);
    timeZoneString = FormatISOTimeZoneOffsetString(offsetNs);
  }
  return `${year}-${month}-${day}T${hour}:${minute}${seconds}${timeZoneString}`;
}

export function TemporalDurationToString(duration, precision = 'auto', options = undefined) {
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
  const sign = DurationSign(years, months, weeks, days, hours, minutes, seconds, ms, µs, ns);

  if (options) {
    const { unit, increment, roundingMode } = options;
    ({
      seconds,
      milliseconds: ms,
      microseconds: µs,
      nanoseconds: ns
    } = RoundDuration(0, 0, 0, 0, 0, 0, seconds, ms, µs, ns, increment, unit, roundingMode));
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
  let total = TotalDurationNanoseconds(0, 0, 0, seconds, ms, µs, ns, 0);
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
}

export function TemporalDateToString(date, showCalendar = 'auto') {
  const year = ISOYearString(GetSlot(date, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(date, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(date, ISO_DAY));
  const calendar = MaybeFormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
  return `${year}-${month}-${day}${calendar}`;
}

export function TemporalDateTimeToString(dateTime, precision, showCalendar = 'auto', options = undefined) {
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
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = RoundISODateTime(
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

  year = ISOYearString(year);
  month = ISODateTimePartString(month);
  day = ISODateTimePartString(day);
  hour = ISODateTimePartString(hour);
  minute = ISODateTimePartString(minute);
  const seconds = FormatSecondsStringPart(second, millisecond, microsecond, nanosecond, precision);
  const calendar = MaybeFormatCalendarAnnotation(GetSlot(dateTime, CALENDAR), showCalendar);
  return `${year}-${month}-${day}T${hour}:${minute}${seconds}${calendar}`;
}

export function TemporalMonthDayToString(monthDay, showCalendar = 'auto') {
  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar = GetSlot(monthDay, CALENDAR);
  const calendarID = ToString(calendar);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
    const year = ISOYearString(GetSlot(monthDay, ISO_YEAR));
    resultString = `${year}-${resultString}`;
  }
  const calendarString = FormatCalendarAnnotation(calendarID, showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export function TemporalYearMonthToString(yearMonth, showCalendar = 'auto') {
  const year = ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendar = GetSlot(yearMonth, CALENDAR);
  const calendarID = ToString(calendar);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendarID !== 'iso8601') {
    const day = ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString += `-${day}`;
  }
  const calendarString = FormatCalendarAnnotation(calendarID, showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export function TemporalZonedDateTimeToString(
  zdt,
  precision,
  showCalendar = 'auto',
  showTimeZone = 'auto',
  showOffset = 'auto',
  options = undefined
) {
  let instant = GetSlot(zdt, INSTANT);

  if (options) {
    const { unit, increment, roundingMode } = options;
    const ns = RoundInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    instant = new TemporalInstant(ns);
  }

  const tz = GetSlot(zdt, TIME_ZONE);
  const iso = GetISO8601Calendar();
  const dateTime = GetPlainDateTimeFor(tz, instant, iso);

  const year = ISOYearString(GetSlot(dateTime, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(dateTime, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(dateTime, ISO_DAY));
  const hour = ISODateTimePartString(GetSlot(dateTime, ISO_HOUR));
  const minute = ISODateTimePartString(GetSlot(dateTime, ISO_MINUTE));
  const seconds = FormatSecondsStringPart(
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND),
    precision
  );
  let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`;
  if (showOffset !== 'never') {
    const offsetNs = GetOffsetNanosecondsFor(tz, instant);
    result += FormatISOTimeZoneOffsetString(offsetNs);
  }
  if (showTimeZone !== 'never') {
    const flag = showTimeZone === 'critical' ? '!' : '';
    result += `[${flag}${tz}]`;
  }
  result += MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
  return result;
}

export function IsTimeZoneOffsetString(string) {
  return OFFSET.test(String(string));
}

export function ParseTimeZoneOffsetString(string) {
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
}

export function GetCanonicalTimeZoneIdentifier(timeZoneIdentifier) {
  if (IsTimeZoneOffsetString(timeZoneIdentifier)) {
    const offsetNs = ParseTimeZoneOffsetString(timeZoneIdentifier);
    return FormatTimeZoneOffsetString(offsetNs);
  }
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(String(timeZoneIdentifier));
  return formatter.resolvedOptions().timeZone;
}

export function GetNamedTimeZoneOffsetNanoseconds(id, epochNanoseconds) {
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
    GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
  const utc = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (utc === null) throw new RangeError('Date outside of supported range');
  return +utc.minus(epochNanoseconds);
}

export function FormatTimeZoneOffsetString(offsetNanoseconds) {
  const sign = offsetNanoseconds < 0 ? '-' : '+';
  offsetNanoseconds = MathAbs(offsetNanoseconds);
  const nanoseconds = offsetNanoseconds % 1e9;
  const seconds = MathFloor(offsetNanoseconds / 1e9) % 60;
  const minutes = MathFloor(offsetNanoseconds / 60e9) % 60;
  const hours = MathFloor(offsetNanoseconds / 3600e9);

  const hourString = ISODateTimePartString(hours);
  const minuteString = ISODateTimePartString(minutes);
  const secondString = ISODateTimePartString(seconds);
  let post = '';
  if (nanoseconds) {
    let fraction = `${nanoseconds}`.padStart(9, '0');
    while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1);
    post = `:${secondString}.${fraction}`;
  } else if (seconds) {
    post = `:${secondString}`;
  }
  return `${sign}${hourString}:${minuteString}${post}`;
}

export function FormatISOTimeZoneOffsetString(offsetNanoseconds) {
  offsetNanoseconds = RoundNumberToIncrement(bigInt(offsetNanoseconds), 60e9, 'halfExpand').toJSNumber();
  const sign = offsetNanoseconds < 0 ? '-' : '+';
  offsetNanoseconds = MathAbs(offsetNanoseconds);
  const minutes = (offsetNanoseconds / 60e9) % 60;
  const hours = MathFloor(offsetNanoseconds / 3600e9);

  const hourString = ISODateTimePartString(hours);
  const minuteString = ISODateTimePartString(minutes);
  return `${sign}${hourString}:${minuteString}`;
}

export function GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
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
}

export function GetISOPartsFromEpoch(epochNanoseconds) {
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
}

export function GetNamedTimeZoneDateTimeParts(id, epochNanoseconds) {
  const { epochMilliseconds, millisecond, microsecond, nanosecond } = GetISOPartsFromEpoch(epochNanoseconds);
  const { year, month, day, hour, minute, second } = GetFormatterParts(id, epochMilliseconds);
  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
}

export function GetNamedTimeZoneNextTransition(id, epochNanoseconds) {
  const uppercap = SystemUTCEpochNanoSeconds().plus(DAY_NANOS.multiply(366));
  let leftNanos = epochNanoseconds;
  let leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
  let rightNanos = leftNanos;
  let rightOffsetNs = leftOffsetNs;
  while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
    rightNanos = bigInt(leftNanos).plus(DAY_NANOS.multiply(2 * 7));
    rightOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
    if (leftOffsetNs === rightOffsetNs) {
      leftNanos = rightNanos;
    }
  }
  if (leftOffsetNs === rightOffsetNs) return null;
  const result = bisect(
    (epochNs) => GetNamedTimeZoneOffsetNanoseconds(id, epochNs),
    leftNanos,
    rightNanos,
    leftOffsetNs,
    rightOffsetNs
  );
  return result;
}

export function GetNamedTimeZonePreviousTransition(id, epochNanoseconds) {
  // Optimization: if the instant is more than a year in the future and there
  // are no transitions between the present day and a year from now, assume
  // there are none after
  const now = SystemUTCEpochNanoSeconds();
  const yearLater = now.plus(DAY_NANOS.multiply(366));
  if (epochNanoseconds.gt(yearLater)) {
    const prevBeforeNextYear = GetNamedTimeZonePreviousTransition(id, yearLater);
    if (prevBeforeNextYear === null || prevBeforeNextYear.lt(now)) {
      return prevBeforeNextYear;
    }
  }

  const lowercap = BEFORE_FIRST_DST; // 1847-01-01T00:00:00Z
  let rightNanos = bigInt(epochNanoseconds).minus(1);
  let rightOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
  let leftNanos = rightNanos;
  let leftOffsetNs = rightOffsetNs;
  while (rightOffsetNs === leftOffsetNs && bigInt(rightNanos).compare(lowercap) === 1) {
    leftNanos = bigInt(rightNanos).minus(DAY_NANOS.multiply(2 * 7));
    leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
    if (rightOffsetNs === leftOffsetNs) {
      rightNanos = leftNanos;
    }
  }
  if (rightOffsetNs === leftOffsetNs) return null;
  const result = bisect(
    (epochNs) => GetNamedTimeZoneOffsetNanoseconds(id, epochNs),
    leftNanos,
    rightNanos,
    leftOffsetNs,
    rightOffsetNs
  );
  return result;
}

export function GetFormatterParts(timeZone, epochMilliseconds) {
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
}

export function GetNamedTimeZoneEpochNanoseconds(
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
) {
  let ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (ns === null) throw new RangeError('DateTime outside of supported range');
  let nsEarlier = ns.minus(DAY_NANOS);
  if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
  let nsLater = ns.plus(DAY_NANOS);
  if (nsLater.greater(NS_MAX)) nsLater = ns;
  const earliest = GetNamedTimeZoneOffsetNanoseconds(id, nsEarlier);
  const latest = GetNamedTimeZoneOffsetNanoseconds(id, nsLater);
  const found = earliest === latest ? [earliest] : [earliest, latest];
  return found
    .map((offsetNanoseconds) => {
      const epochNanoseconds = bigInt(ns).minus(offsetNanoseconds);
      const parts = GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
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
}

export function LeapYear(year) {
  if (undefined === year) return false;
  const isDiv4 = year % 4 === 0;
  const isDiv100 = year % 100 === 0;
  const isDiv400 = year % 400 === 0;
  return isDiv4 && (!isDiv100 || isDiv400);
}

export function ISODaysInMonth(year, month) {
  const DoM = {
    standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  };
  return DoM[LeapYear(year) ? 'leapyear' : 'standard'][month - 1];
}

export function DayOfWeek(year, month, day) {
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
}

export function DayOfYear(year, month, day) {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += ISODaysInMonth(year, m);
  }
  return days;
}

export function WeekOfYear(year, month, day) {
  let doy = DayOfYear(year, month, day);
  let dow = DayOfWeek(year, month, day) || 7;
  let doj = DayOfWeek(year, 1, 1);

  const week = MathFloor((doy - dow + 10) / 7);

  if (week < 1) {
    if (doj === 5 || (doj === 6 && LeapYear(year - 1))) {
      return { week: 53, year: year - 1 };
    } else {
      return { week: 52, year: year - 1 };
    }
  }
  if (week === 53) {
    if ((LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
      return { week: 1, year: year + 1 };
    }
  }

  return { week, year };
}

export function DurationSign(y, mon, w, d, h, min, s, ms, µs, ns) {
  const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
  for (let index = 0; index < fields.length; index++) {
    const prop = fields[index];
    if (prop !== 0) return prop < 0 ? -1 : 1;
  }
  return 0;
}

export function BalanceISOYearMonth(year, month) {
  if (!NumberIsFinite(year) || !NumberIsFinite(month)) throw new RangeError('infinity is out of range');
  month -= 1;
  year += MathFloor(month / 12);
  month %= 12;
  if (month < 0) month += 12;
  month += 1;
  return { year, month };
}

export function BalanceISODate(year, month, day) {
  if (!NumberIsFinite(day)) throw new RangeError('infinity is out of range');
  ({ year, month } = BalanceISOYearMonth(year, month));
  let daysInYear = 0;
  let testYear = month > 2 ? year : year - 1;
  while (((daysInYear = LeapYear(testYear) ? 366 : 365), day < -daysInYear)) {
    year -= 1;
    testYear -= 1;
    day += daysInYear;
  }
  testYear += 1;
  while (((daysInYear = LeapYear(testYear) ? 366 : 365), day > daysInYear)) {
    year += 1;
    testYear += 1;
    day -= daysInYear;
  }

  while (day < 1) {
    ({ year, month } = BalanceISOYearMonth(year, month - 1));
    day += ISODaysInMonth(year, month);
  }
  while (day > ISODaysInMonth(year, month)) {
    day -= ISODaysInMonth(year, month);
    ({ year, month } = BalanceISOYearMonth(year, month + 1));
  }

  return { year, month, day };
}

export function BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  let deltaDays;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  ));
  ({ year, month, day } = BalanceISODate(year, month, day + deltaDays));
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}

export function BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  hour = bigInt(hour);
  minute = bigInt(minute);
  second = bigInt(second);
  millisecond = bigInt(millisecond);
  microsecond = bigInt(microsecond);
  nanosecond = bigInt(nanosecond);

  let quotient;

  ({ quotient, remainder: nanosecond } = NonNegativeBigIntDivmod(nanosecond, 1000));
  microsecond = microsecond.add(quotient);

  ({ quotient, remainder: microsecond } = NonNegativeBigIntDivmod(microsecond, 1000));
  millisecond = millisecond.add(quotient);

  ({ quotient, remainder: millisecond } = NonNegativeBigIntDivmod(millisecond, 1000));
  second = second.add(quotient);

  ({ quotient, remainder: second } = NonNegativeBigIntDivmod(second, 60));
  minute = minute.add(quotient);

  ({ quotient, remainder: minute } = NonNegativeBigIntDivmod(minute, 60));
  hour = hour.add(quotient);

  ({ quotient, remainder: hour } = NonNegativeBigIntDivmod(hour, 24));

  return {
    deltaDays: quotient.toJSNumber(),
    hour: hour.toJSNumber(),
    minute: minute.toJSNumber(),
    second: second.toJSNumber(),
    millisecond: millisecond.toJSNumber(),
    microsecond: microsecond.toJSNumber(),
    nanosecond: nanosecond.toJSNumber()
  };
}

export function TotalDurationNanoseconds(
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
  microseconds,
  nanoseconds,
  offsetShift
) {
  if (days !== 0) nanoseconds = bigInt(nanoseconds).subtract(offsetShift);
  hours = bigInt(hours).add(bigInt(days).multiply(24));
  minutes = bigInt(minutes).add(hours.multiply(60));
  seconds = bigInt(seconds).add(minutes.multiply(60));
  milliseconds = bigInt(milliseconds).add(seconds.multiply(1000));
  microseconds = bigInt(microseconds).add(milliseconds.multiply(1000));
  return bigInt(nanoseconds).add(microseconds.multiply(1000));
}

export function NanosecondsToDays(nanoseconds, relativeTo) {
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const sign = MathSign(nanoseconds);
  nanoseconds = bigInt(nanoseconds);
  let dayLengthNs = 86400e9;
  if (sign === 0) return { days: 0, nanoseconds: bigInt.zero, dayLengthNs };
  if (!IsTemporalZonedDateTime(relativeTo)) {
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
  const dtStart = GetPlainDateTimeFor(timeZone, start, calendar);
  const dtEnd = GetPlainDateTimeFor(timeZone, end, calendar);
  let { days } = DifferenceISODateTime(
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
  let intermediateNs = AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days, 0, 0, 0, 0, 0, 0);
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
      intermediateNs = AddZonedDateTime(start, timeZone, calendar, 0, 0, 0, days.toJSNumber(), 0, 0, 0, 0, 0, 0);
      // may do disambiguation
    }
  }
  nanoseconds = endNs.subtract(intermediateNs);

  let isOverflow = false;
  let relativeInstant = new TemporalInstant(intermediateNs);
  do {
    // calculate length of the next day (day that contains the time remainder)
    const oneDayFartherNs = AddZonedDateTime(relativeInstant, timeZone, calendar, 0, 0, 0, sign, 0, 0, 0, 0, 0, 0);
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
}

export function BalanceDuration(
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
  microseconds,
  nanoseconds,
  largestUnit,
  relativeTo = undefined
) {
  let result = BalancePossiblyInfiniteDuration(
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
}

export function BalancePossiblyInfiniteDuration(
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
  microseconds,
  nanoseconds,
  largestUnit,
  relativeTo = undefined
) {
  if (IsTemporalZonedDateTime(relativeTo)) {
    const endNs = AddZonedDateTime(
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
    nanoseconds = TotalDurationNanoseconds(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
  }
  if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week' || largestUnit === 'day') {
    ({ days, nanoseconds } = NanosecondsToDays(nanoseconds, relativeTo));
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
}

export function UnbalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  if (sign === 0) return { years, months, weeks, days };

  let calendar;
  if (relativeTo) {
    relativeTo = ToTemporalDate(relativeTo);
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
        const dateAdd = GetMethod(calendar, 'dateAdd');
        const dateUntil = GetMethod(calendar, 'dateUntil');
        while (!years.abs().isZero()) {
          const newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
          const untilOptions = ObjectCreate(null);
          untilOptions.largestUnit = 'month';
          const untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
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
        const dateAdd = GetMethod(calendar, 'dateAdd');
        // balance years down to days
        while (!years.abs().isZero()) {
          let oneYearDays;
          ({ relativeTo, days: oneYearDays } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
          days = days.add(oneYearDays);
          years = years.subtract(sign);
        }

        // balance months down to days
        while (!months.abs().isZero()) {
          let oneMonthDays;
          ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
          days = days.add(oneMonthDays);
          months = months.subtract(sign);
        }
      }
      break;
    default:
      {
        if (years.isZero() && months.isZero() && weeks.isZero()) break;
        if (!calendar) throw new RangeError('a starting point is required for balancing calendar units');
        const dateAdd = GetMethod(calendar, 'dateAdd');
        // balance years down to days
        while (!years.abs().isZero()) {
          let oneYearDays;
          ({ relativeTo, days: oneYearDays } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
          days = days.add(oneYearDays);
          years = years.subtract(sign);
        }

        // balance months down to days
        while (!months.abs().isZero()) {
          let oneMonthDays;
          ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
          days = days.add(oneMonthDays);
          months = months.subtract(sign);
        }

        // balance weeks down to days
        while (!weeks.abs().isZero()) {
          let oneWeekDays;
          ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
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
}

export function BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo) {
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  if (sign === 0) return { years, months, weeks, days };

  let calendar;
  if (relativeTo) {
    relativeTo = ToTemporalDate(relativeTo);
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
      const dateAdd = GetMethod(calendar, 'dateAdd');
      // balance days up to years
      let newRelativeTo, oneYearDays;
      ({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
      while (days.abs().geq(MathAbs(oneYearDays))) {
        days = days.subtract(oneYearDays);
        years = years.add(sign);
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd));
      }

      // balance days up to months
      let oneMonthDays;
      ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      while (days.abs().geq(MathAbs(oneMonthDays))) {
        days = days.subtract(oneMonthDays);
        months = months.add(sign);
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      }

      // balance months up to years
      newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
      const dateUntil = GetMethod(calendar, 'dateUntil');
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'month';
      let untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
      let oneYearMonths = GetSlot(untilResult, MONTHS);
      while (months.abs().geq(MathAbs(oneYearMonths))) {
        months = months.subtract(oneYearMonths);
        years = years.add(sign);
        relativeTo = newRelativeTo;
        newRelativeTo = CalendarDateAdd(calendar, relativeTo, oneYear, undefined, dateAdd);
        const untilOptions = ObjectCreate(null);
        untilOptions.largestUnit = 'month';
        untilResult = CalendarDateUntil(calendar, relativeTo, newRelativeTo, untilOptions, dateUntil);
        oneYearMonths = GetSlot(untilResult, MONTHS);
      }
      break;
    }
    case 'month': {
      if (!calendar) throw new RangeError('a starting point is required for months balancing');
      const dateAdd = GetMethod(calendar, 'dateAdd');
      // balance days up to months
      let newRelativeTo, oneMonthDays;
      ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      while (days.abs().geq(MathAbs(oneMonthDays))) {
        days = days.subtract(oneMonthDays);
        months = months.add(sign);
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      }
      break;
    }
    case 'week': {
      if (!calendar) throw new RangeError('a starting point is required for weeks balancing');
      const dateAdd = GetMethod(calendar, 'dateAdd');
      // balance days up to weeks
      let newRelativeTo, oneWeekDays;
      ({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
      while (days.abs().geq(MathAbs(oneWeekDays))) {
        days = days.subtract(oneWeekDays);
        weeks = weeks.add(sign);
        relativeTo = newRelativeTo;
        ({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
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
}

export function CalculateOffsetShift(relativeTo, y, mon, w, d) {
  if (IsTemporalZonedDateTime(relativeTo)) {
    const instant = GetSlot(relativeTo, INSTANT);
    const timeZone = GetSlot(relativeTo, TIME_ZONE);
    const calendar = GetSlot(relativeTo, CALENDAR);
    const offsetBefore = GetOffsetNanosecondsFor(timeZone, instant);
    const after = AddZonedDateTime(instant, timeZone, calendar, y, mon, w, d, 0, 0, 0, 0, 0, 0);
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const instantAfter = new TemporalInstant(after);
    const offsetAfter = GetOffsetNanosecondsFor(timeZone, instantAfter);
    return offsetAfter - offsetBefore;
  }
  return 0;
}

export function CreateNegatedTemporalDuration(duration) {
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
}

export function ConstrainToRange(value, min, max) {
  return MathMin(max, MathMax(min, value));
}

export function ConstrainISODate(year, month, day) {
  month = ConstrainToRange(month, 1, 12);
  day = ConstrainToRange(day, 1, ISODaysInMonth(year, month));
  return { year, month, day };
}

export function ConstrainTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  hour = ConstrainToRange(hour, 0, 23);
  minute = ConstrainToRange(minute, 0, 59);
  second = ConstrainToRange(second, 0, 59);
  millisecond = ConstrainToRange(millisecond, 0, 999);
  microsecond = ConstrainToRange(microsecond, 0, 999);
  nanosecond = ConstrainToRange(nanosecond, 0, 999);
  return { hour, minute, second, millisecond, microsecond, nanosecond };
}

export function RejectToRange(value, min, max) {
  if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
}

export function RejectISODate(year, month, day) {
  RejectToRange(month, 1, 12);
  RejectToRange(day, 1, ISODaysInMonth(year, month));
}

export function RejectDateRange(year, month, day) {
  // Noon avoids trouble at edges of DateTime range (excludes midnight)
  RejectDateTimeRange(year, month, day, 12, 0, 0, 0, 0, 0);
}

export function RejectTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectToRange(hour, 0, 23);
  RejectToRange(minute, 0, 59);
  RejectToRange(second, 0, 59);
  RejectToRange(millisecond, 0, 999);
  RejectToRange(microsecond, 0, 999);
  RejectToRange(nanosecond, 0, 999);
}

export function RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectISODate(year, month, day);
  RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

export function RejectDateTimeRange(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  RejectToRange(year, YEAR_MIN, YEAR_MAX);
  // Reject any DateTime 24 hours or more outside the Instant range
  if (
    (year === YEAR_MIN &&
      null ==
        GetUTCEpochNanoseconds(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1)) ||
    (year === YEAR_MAX &&
      null ==
        GetUTCEpochNanoseconds(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1))
  ) {
    throw new RangeError('DateTime outside of supported range');
  }
}

export function ValidateEpochNanoseconds(epochNanoseconds) {
  if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
    throw new RangeError('Instant outside of supported range');
  }
}

export function RejectYearMonthRange(year, month) {
  RejectToRange(year, YEAR_MIN, YEAR_MAX);
  if (year === YEAR_MIN) {
    RejectToRange(month, 4, 12);
  } else if (year === YEAR_MAX) {
    RejectToRange(month, 1, 9);
  }
}

export function RejectDuration(y, mon, w, d, h, min, s, ms, µs, ns) {
  const sign = DurationSign(y, mon, w, d, h, min, s, ms, µs, ns);
  const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
  for (let index = 0; index < fields.length; index++) {
    const prop = fields[index];
    if (!NumberIsFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
    const propSign = MathSign(prop);
    if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields');
  }
}

export function DifferenceISODate(y1, m1, d1, y2, m2, d2, largestUnit = 'days') {
  switch (largestUnit) {
    case 'year':
    case 'month': {
      const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
      if (sign === 0) return { years: 0, months: 0, weeks: 0, days: 0 };

      const start = { year: y1, month: m1, day: d1 };
      const end = { year: y2, month: m2, day: d2 };

      let years = end.year - start.year;
      let mid = AddISODate(y1, m1, d1, years, 0, 0, 0, 'constrain');
      let midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
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
      mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
      midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2);
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
        mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain');
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
        days = -mid.day - (ISODaysInMonth(end.year, end.month) - end.day);
      } else {
        // 3) end is next month from intermediate (positive duration)
        // Example: intermediate: Jan 29, end: Feb 1, DaysInMonth = 31, days = 3
        days = end.day + (ISODaysInMonth(mid.year, mid.month) - mid.day);
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
      if (CompareISODate(y1, m1, d1, y2, m2, d2) < 0) {
        smaller = { year: y1, month: m1, day: d1 };
        larger = { year: y2, month: m2, day: d2 };
        sign = 1;
      } else {
        smaller = { year: y2, month: m2, day: d2 };
        larger = { year: y1, month: m1, day: d1 };
        sign = -1;
      }
      let days = DayOfYear(larger.year, larger.month, larger.day) - DayOfYear(smaller.year, smaller.month, smaller.day);
      for (let year = smaller.year; year < larger.year; ++year) {
        days += LeapYear(year) ? 366 : 365;
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
}

export function DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
  let hours = h2 - h1;
  let minutes = min2 - min1;
  let seconds = s2 - s1;
  let milliseconds = ms2 - ms1;
  let microseconds = µs2 - µs1;
  let nanoseconds = ns2 - ns1;

  const sign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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
  } = BalanceTime(hours, minutes, seconds, milliseconds, microseconds, nanoseconds));

  if (deltaDays != 0) throw new Error('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');
  hours *= sign;
  minutes *= sign;
  seconds *= sign;
  milliseconds *= sign;
  microseconds *= sign;
  nanoseconds *= sign;

  return { hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function DifferenceInstant(ns1, ns2, increment, smallestUnit, largestUnit, roundingMode) {
  const diff = ns2.minus(ns1);

  let hours = 0;
  let minutes = 0;
  let nanoseconds = diff.mod(1e3).toJSNumber();
  let microseconds = diff.divide(1e3).mod(1e3).toJSNumber();
  let milliseconds = diff.divide(1e6).mod(1e3).toJSNumber();
  let seconds = diff.divide(1e9).toJSNumber();

  ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(
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
  return BalanceDuration(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, largestUnit);
}

export function DifferenceISODateTime(
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
) {
  let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceTime(
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

  const timeSign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);
  if (dateSign === -timeSign) {
    ({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 - timeSign));
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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

  const date1 = CreateTemporalDate(y1, mon1, d1, calendar);
  const date2 = CreateTemporalDate(y2, mon2, d2, calendar);
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const untilOptions = ObjectCreate(null);
  CopyDataProperties(untilOptions, options, []);
  untilOptions.largestUnit = dateLargestUnit;
  let { years, months, weeks, days } = CalendarDateUntil(calendar, date1, date2, untilOptions);
  // Signs of date part and time part may not agree; balance them together
  ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
}

export function DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit, options) {
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
  const dtStart = GetPlainDateTimeFor(timeZone, start, calendar);
  const dtEnd = GetPlainDateTimeFor(timeZone, end, calendar);
  let { years, months, weeks, days } = DifferenceISODateTime(
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
  let intermediateNs = AddZonedDateTime(start, timeZone, calendar, years, months, weeks, 0, 0, 0, 0, 0, 0, 0);
  // may disambiguate
  let timeRemainderNs = ns2.subtract(intermediateNs);
  const intermediate = CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
  ({ nanoseconds: timeRemainderNs, days } = NanosecondsToDays(timeRemainderNs, intermediate));

  // Finally, merge the date and time durations and return the merged result.
  let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
}

export function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
  options = GetOptionsObject(options);

  const ALLOWED_UNITS = SINGULAR_PLURAL_UNITS.reduce((allowed, unitInfo) => {
    const p = unitInfo[0];
    const s = unitInfo[1];
    const c = unitInfo[2];
    if ((group === 'datetime' || c === group) && !Call(ArrayIncludes, disallowed, [s])) {
      allowed.push(s, p);
    }
    return allowed;
  }, []);

  let largestUnit = GetTemporalUnit(options, 'largestUnit', group, 'auto');
  if (Call(ArrayIncludes, disallowed, [largestUnit])) {
    throw new RangeError(`largestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${largestUnit}`);
  }

  const roundingIncrement = ToTemporalRoundingIncrement(options);

  let roundingMode = ToTemporalRoundingMode(options, 'trunc');
  if (op === 'since') roundingMode = NegateTemporalRoundingMode(roundingMode);

  const smallestUnit = GetTemporalUnit(options, 'smallestUnit', group, fallbackSmallest);
  if (Call(ArrayIncludes, disallowed, [smallestUnit])) {
    throw new RangeError(`smallestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${smallestUnit}`);
  }

  const defaultLargestUnit = LargerOfTwoTemporalUnits(smallestLargestDefaultUnit, smallestUnit);
  if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
  if (LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
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
  if (maximum !== undefined) ValidateTemporalRoundingIncrement(roundingIncrement, maximum, false);

  return { largestUnit, roundingIncrement, roundingMode, smallestUnit };
}

export function DifferenceTemporalInstant(operation, instant, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalInstant(other);

  const settings = GetDifferenceSettings(operation, options, 'time', [], 'nanosecond', 'second');

  const onens = GetSlot(instant, EPOCHNANOSECONDS);
  const twons = GetSlot(other, EPOCHNANOSECONDS);
  let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(
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
}

export function DifferenceTemporalPlainDate(operation, plainDate, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalDate(other);
  const calendar = GetSlot(plainDate, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

  const settings = GetDifferenceSettings(operation, options, 'date', [], 'day', 'day');

  const untilOptions = ObjectCreate(null);
  CopyDataProperties(untilOptions, options, []);
  untilOptions.largestUnit = settings.largestUnit;
  let { years, months, weeks, days } = CalendarDateUntil(calendar, plainDate, other, untilOptions);

  if (settings.smallestUnit !== 'day' || settings.roundingIncrement !== 1) {
    ({ years, months, weeks, days } = RoundDuration(
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
}

export function DifferenceTemporalPlainDateTime(operation, plainDateTime, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalDateTime(other);
  const calendar = GetSlot(plainDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

  const settings = GetDifferenceSettings(operation, options, 'datetime', [], 'nanosecond', 'day');

  let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    DifferenceISODateTime(
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
      options
    );

  const relativeTo = TemporalDateTimeToDate(plainDateTime);
  ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(
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
  ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
}

export function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalTime(other);

  const settings = GetDifferenceSettings(operation, options, 'time', [], 'nanosecond', 'hour');

  let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceTime(
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
  ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(
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
  ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
}

export function DifferenceTemporalPlainYearMonth(operation, yearMonth, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalYearMonth(other);
  const calendar = GetSlot(yearMonth, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between months');

  const settings = GetDifferenceSettings(operation, options, 'date', ['week', 'day'], 'month', 'year');

  const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
  const otherFields = PrepareTemporalFields(other, fieldNames, []);
  otherFields.day = 1;
  const otherDate = CalendarDateFromFields(calendar, otherFields);
  const thisFields = PrepareTemporalFields(yearMonth, fieldNames, []);
  thisFields.day = 1;
  const thisDate = CalendarDateFromFields(calendar, thisFields);

  const untilOptions = ObjectCreate(null);
  CopyDataProperties(untilOptions, options, []);
  untilOptions.largestUnit = settings.largestUnit;
  let { years, months } = CalendarDateUntil(calendar, thisDate, otherDate, untilOptions);

  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
    ({ years, months } = RoundDuration(
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
}

export function DifferenceTemporalZonedDateTime(operation, zonedDateTime, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalZonedDateTime(other);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  CalendarEqualsOrThrow(calendar, otherCalendar, 'compute difference between dates');

  const settings = GetDifferenceSettings(operation, options, 'datetime', [], 'nanosecond', 'hour');

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
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(
      ns1,
      ns2,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.largestUnit,
      settings.roundingMode
    ));
  } else {
    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
      throw new RangeError(
        "When calculating difference between time zones, largestUnit must be 'hours' " +
          'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
      );
    }
    const untilOptions = ObjectCreate(null);
    CopyDataProperties(untilOptions, options, []);
    untilOptions.largestUnit = settings.largestUnit;
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, settings.largestUnit, untilOptions));
    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = RoundDuration(
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
      AdjustRoundedDurationDays(
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
}

export function AddISODate(year, month, day, years, months, weeks, days, overflow) {
  year += years;
  month += months;
  ({ year, month } = BalanceISOYearMonth(year, month));
  ({ year, month, day } = RegulateISODate(year, month, day, overflow));
  days += 7 * weeks;
  day += days;
  ({ year, month, day } = BalanceISODate(year, month, day));
  return { year, month, day };
}

export function AddTime(
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
) {
  hour += hours;
  minute += minutes;
  second += seconds;
  millisecond += milliseconds;
  microsecond += microseconds;
  nanosecond += nanoseconds;
  let deltaDays = 0;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = BalanceTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond
  ));
  return { deltaDays, hour, minute, second, millisecond, microsecond, nanosecond };
}

export function AddDuration(
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
) {
  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);

  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
  if (!relativeTo) {
    if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week') {
      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
    }
    years = months = weeks = 0;
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
      d1 + d2,
      bigInt(h1).add(h2),
      bigInt(min1).add(min2),
      bigInt(s1).add(s2),
      bigInt(ms1).add(ms2),
      bigInt(µs1).add(µs2),
      bigInt(ns1).add(ns2),
      largestUnit
    ));
  } else if (IsTemporalDate(relativeTo)) {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    const calendar = GetSlot(relativeTo, CALENDAR);

    const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
    const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
    const dateAdd = GetMethod(calendar, 'dateAdd');
    const intermediate = CalendarDateAdd(calendar, relativeTo, dateDuration1, undefined, dateAdd);
    const end = CalendarDateAdd(calendar, intermediate, dateDuration2, undefined, dateAdd);

    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
    const differenceOptions = ObjectCreate(null);
    differenceOptions.largestUnit = dateLargestUnit;
    ({ years, months, weeks, days } = CalendarDateUntil(calendar, relativeTo, end, differenceOptions));
    // Signs of date part and time part may not agree; balance them together
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
    const intermediateNs = AddZonedDateTime(
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
    const endNs = AddZonedDateTime(
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
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = DifferenceInstant(
        GetSlot(relativeTo, EPOCHNANOSECONDS),
        endNs,
        1,
        'nanosecond',
        largestUnit,
        'halfExpand'
      ));
    } else {
      ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
        DifferenceZonedDateTime(
          GetSlot(relativeTo, EPOCHNANOSECONDS),
          endNs,
          timeZone,
          calendar,
          largestUnit,
          ObjectCreate(null)
        ));
    }
  }

  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function AddInstant(epochNanoseconds, h, min, s, ms, µs, ns) {
  let sum = bigInt.zero;
  sum = sum.plus(bigInt(ns));
  sum = sum.plus(bigInt(µs).multiply(1e3));
  sum = sum.plus(bigInt(ms).multiply(1e6));
  sum = sum.plus(bigInt(s).multiply(1e9));
  sum = sum.plus(bigInt(min).multiply(60 * 1e9));
  sum = sum.plus(bigInt(h).multiply(60 * 60 * 1e9));

  const result = bigInt(epochNanoseconds).plus(sum);
  ValidateEpochNanoseconds(result);
  return result;
}

export function AddDateTime(
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
) {
  // Add the time part
  let deltaDays = 0;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
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
  const datePart = CreateTemporalDate(year, month, day, calendar);
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendar, datePart, dateDuration, options);

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
}

export function AddZonedDateTime(
  instant,
  timeZone,
  calendar,
  years,
  months,
  weeks,
  days,
  h,
  min,
  s,
  ms,
  µs,
  ns,
  options
) {
  // If only time is to be added, then use Instant math. It's not OK to fall
  // through to the date/time code below because compatible disambiguation in
  // the PlainDateTime=>Instant conversion will change the offset of any
  // ZonedDateTime in the repeated clock time after a backwards transition.
  // When adding/subtracting time units and not dates, this disambiguation is
  // not expected and so is avoided below via a fast path for time-only
  // arithmetic.
  // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  if (DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0) === 0) {
    return AddInstant(GetSlot(instant, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
  }

  // RFC 5545 requires the date portion to be added in calendar days and the
  // time portion to be added in exact time.
  let dt = GetPlainDateTimeFor(timeZone, instant, calendar);
  const datePart = CreateTemporalDate(GetSlot(dt, ISO_YEAR), GetSlot(dt, ISO_MONTH), GetSlot(dt, ISO_DAY), calendar);
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendar, datePart, dateDuration, options);
  const dtIntermediate = CreateTemporalDateTime(
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
  const instantIntermediate = GetInstantFor(timeZone, dtIntermediate, 'compatible');
  return AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), h, min, s, ms, µs, ns);
}

export function AddDurationToOrSubtractDurationFromDuration(operation, duration, other, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(other);
  options = GetOptionsObject(options);
  const relativeTo = ToRelativeTemporalObject(options);
  ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = AddDuration(
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
}

export function AddDurationToOrSubtractDurationFromInstant(operation, instant, durationLike) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(durationLike, [
    'years',
    'months',
    'weeks',
    'days'
  ]);
  const ns = AddInstant(
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
}

export function AddDurationToOrSubtractDurationFromPlainDateTime(operation, dateTime, durationLike, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);
  const calendar = GetSlot(dateTime, CALENDAR);
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = AddDateTime(
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
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
}

export function AddDurationToOrSubtractDurationFromPlainTime(operation, temporalTime, durationLike) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToTemporalDurationRecord(durationLike);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
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
  ({ hour, minute, second, millisecond, microsecond, nanosecond } = RegulateTime(
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
}

export function AddDurationToOrSubtractDurationFromPlainYearMonth(operation, yearMonth, durationLike, options) {
  let duration = ToTemporalDurationRecord(durationLike);
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
  ({ days } = BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'day'));

  options = GetOptionsObject(options);

  const calendar = GetSlot(yearMonth, CALENDAR);
  const fieldNames = CalendarFields(calendar, ['monthCode', 'year']);
  const fields = PrepareTemporalFields(yearMonth, fieldNames, []);
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  fields.day = sign < 0 ? CalendarDaysInMonth(calendar, yearMonth) : 1;
  const startDate = CalendarDateFromFields(calendar, fields);
  const Duration = GetIntrinsic('%Temporal.Duration%');
  const durationToAdd = new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const optionsCopy = ObjectCreate(null);
  CopyDataProperties(optionsCopy, options, []);
  const addedDate = CalendarDateAdd(calendar, startDate, durationToAdd, options);
  const addedDateFields = PrepareTemporalFields(addedDate, fieldNames, []);

  return CalendarYearMonthFromFields(calendar, addedDateFields, optionsCopy);
}

export function AddDurationToOrSubtractDurationFromZonedDateTime(operation, zonedDateTime, durationLike, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);
  const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const epochNanoseconds = AddZonedDateTime(
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
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
}

export function RoundNumberToIncrement(quantity, increment, mode) {
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
}

export function RoundInstant(epochNs, increment, unit, roundingMode) {
  let { remainder } = NonNegativeBigIntDivmod(epochNs, 86400e9);
  const wholeDays = epochNs.minus(remainder);
  const roundedRemainder = RoundNumberToIncrement(remainder, nsPerTimeUnit[unit] * increment, roundingMode);
  return wholeDays.plus(roundedRemainder);
}

export function RoundISODateTime(
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
) {
  let deltaDays = 0;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = RoundTime(
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
  ({ year, month, day } = BalanceISODate(year, month, day + deltaDays));
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}

export function RoundTime(
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
) {
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
  const rounded = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode);
  const result = rounded.divide(nsPerUnit).toJSNumber();
  switch (unit) {
    case 'day':
      return { deltaDays: result, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case 'hour':
      return BalanceTime(result, 0, 0, 0, 0, 0);
    case 'minute':
      return BalanceTime(hour, result, 0, 0, 0, 0);
    case 'second':
      return BalanceTime(hour, minute, result, 0, 0, 0);
    case 'millisecond':
      return BalanceTime(hour, minute, second, result, 0, 0);
    case 'microsecond':
      return BalanceTime(hour, minute, second, millisecond, result, 0);
    case 'nanosecond':
      return BalanceTime(hour, minute, second, millisecond, microsecond, result);
  }
}

export function DaysUntil(earlier, later) {
  return DifferenceISODate(
    GetSlot(earlier, ISO_YEAR),
    GetSlot(earlier, ISO_MONTH),
    GetSlot(earlier, ISO_DAY),
    GetSlot(later, ISO_YEAR),
    GetSlot(later, ISO_MONTH),
    GetSlot(later, ISO_DAY),
    'day'
  ).days;
}

export function MoveRelativeDate(calendar, relativeTo, duration, dateAdd) {
  const later = CalendarDateAdd(calendar, relativeTo, duration, undefined, dateAdd);
  const days = DaysUntil(relativeTo, later);
  return { relativeTo: later, days };
}

export function MoveRelativeZonedDateTime(relativeTo, years, months, weeks, days) {
  const timeZone = GetSlot(relativeTo, TIME_ZONE);
  const calendar = GetSlot(relativeTo, CALENDAR);
  const intermediateNs = AddZonedDateTime(
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
  return CreateTemporalZonedDateTime(intermediateNs, timeZone, calendar);
}

export function AdjustRoundedDurationDays(
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
) {
  if (
    !IsTemporalZonedDateTime(relativeTo) ||
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
  let timeRemainderNs = TotalDurationNanoseconds(
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
  const dayStart = AddZonedDateTime(
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
  const dayEnd = AddZonedDateTime(
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
    ({ years, months, weeks, days } = AddDuration(
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
    timeRemainderNs = RoundInstant(timeRemainderNs.subtract(dayLengthNs), increment, unit, roundingMode);
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceDuration(
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
}

export function RoundDuration(
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
) {
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  let calendar, zdtRelative;
  if (relativeTo) {
    if (IsTemporalZonedDateTime(relativeTo)) {
      zdtRelative = relativeTo;
      relativeTo = ToTemporalDate(relativeTo);
    } else if (!IsTemporalDate(relativeTo)) {
      throw new TypeError('starting point must be PlainDate or ZonedDateTime');
    }
    calendar = GetSlot(relativeTo, CALENDAR);
  }

  // First convert time units up to days, if rounding to days or higher units.
  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
  let dayLengthNs;
  if (unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day') {
    nanoseconds = TotalDurationNanoseconds(0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 0);
    let intermediate;
    if (zdtRelative) {
      intermediate = MoveRelativeZonedDateTime(zdtRelative, years, months, weeks, days);
    }
    let deltaDays;
    ({ days: deltaDays, nanoseconds, dayLengthNs } = NanosecondsToDays(nanoseconds, intermediate));
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
      const dateAdd = GetMethod(calendar, 'dateAdd');
      const yearsLater = CalendarDateAdd(calendar, relativeTo, yearsDuration, undefined, dateAdd);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const yearsMonthsWeeksLater = CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
      const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater);
      relativeTo = yearsLater;
      days += monthsWeeksInDays;

      const wholeDays = new TemporalDuration(0, 0, 0, days);
      const wholeDaysLater = CalendarDateAdd(calendar, relativeTo, wholeDays, undefined, dateAdd);
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'year';
      const yearsPassed = CalendarDateUntil(calendar, relativeTo, wholeDaysLater, untilOptions).years;
      years += yearsPassed;
      const oldRelativeTo = relativeTo;
      const yearsPassedDuration = new TemporalDuration(yearsPassed);
      relativeTo = CalendarDateAdd(calendar, relativeTo, yearsPassedDuration, undefined, dateAdd);
      const daysPassed = DaysUntil(oldRelativeTo, relativeTo);
      days -= daysPassed;
      const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
      let { days: oneYearDays } = MoveRelativeDate(calendar, relativeTo, oneYear, dateAdd);

      // Note that `nanoseconds` below (here and in similar code for months,
      // weeks, and days further below) isn't actually nanoseconds for the
      // full date range.  Instead, it's a BigInt representation of total
      // days multiplied by the number of nanoseconds in the last day of
      // the duration. This lets us do days-or-larger rounding using BigInt
      // math which reduces precision loss.
      oneYearDays = MathAbs(oneYearDays);
      const divisor = bigInt(oneYearDays).multiply(dayLengthNs);
      nanoseconds = divisor.multiply(years).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment).toJSNumber(), roundingMode);
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
      const dateAdd = GetMethod(calendar, 'dateAdd');
      const yearsMonthsLater = CalendarDateAdd(calendar, relativeTo, yearsMonths, undefined, dateAdd);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const yearsMonthsWeeksLater = CalendarDateAdd(calendar, relativeTo, yearsMonthsWeeks, undefined, dateAdd);
      const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
      relativeTo = yearsMonthsLater;
      days += weeksInDays;

      // Months may be different lengths of days depending on the calendar,
      // convert days to months in a loop as described above under 'years'.
      const sign = MathSign(days);
      const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
      let oneMonthDays;
      ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        months += sign;
        days -= oneMonthDays;
        ({ relativeTo, days: oneMonthDays } = MoveRelativeDate(calendar, relativeTo, oneMonth, dateAdd));
      }
      oneMonthDays = MathAbs(oneMonthDays);
      const divisor = bigInt(oneMonthDays).multiply(dayLengthNs);
      nanoseconds = divisor.multiply(months).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
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
      const dateAdd = GetMethod(calendar, 'dateAdd');
      let oneWeekDays;
      ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
      while (MathAbs(days) >= MathAbs(oneWeekDays)) {
        weeks += sign;
        days -= oneWeekDays;
        ({ relativeTo, days: oneWeekDays } = MoveRelativeDate(calendar, relativeTo, oneWeek, dateAdd));
      }
      oneWeekDays = MathAbs(oneWeekDays);
      const divisor = bigInt(oneWeekDays).multiply(dayLengthNs);
      nanoseconds = divisor.multiply(weeks).plus(bigInt(days).multiply(dayLengthNs)).plus(nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
      const { quotient, remainder } = nanoseconds.divmod(divisor);
      total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
      weeks = rounded.divide(divisor).toJSNumber();
      nanoseconds = days = 0;
      break;
    }
    case 'day': {
      const divisor = bigInt(dayLengthNs);
      nanoseconds = divisor.multiply(days).plus(nanoseconds);
      const rounded = RoundNumberToIncrement(nanoseconds, divisor.multiply(increment), roundingMode);
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
      const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
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
      const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
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
      const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
      seconds = rounded.divide(divisor).toJSNumber();
      milliseconds = microseconds = nanoseconds = 0;
      break;
    }
    case 'millisecond': {
      const divisor = 1e6;
      nanoseconds = bigInt(milliseconds).multiply(1e6).plus(bigInt(microseconds).multiply(1e3)).plus(nanoseconds);
      const { quotient, remainder } = nanoseconds.divmod(divisor);
      total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
      const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
      milliseconds = rounded.divide(divisor).toJSNumber();
      microseconds = nanoseconds = 0;
      break;
    }
    case 'microsecond': {
      const divisor = 1e3;
      nanoseconds = bigInt(microseconds).multiply(1e3).plus(nanoseconds);
      const { quotient, remainder } = nanoseconds.divmod(divisor);
      total = quotient.toJSNumber() + remainder.toJSNumber() / divisor;
      const rounded = RoundNumberToIncrement(nanoseconds, divisor * increment, roundingMode);
      microseconds = rounded.divide(divisor).toJSNumber();
      nanoseconds = 0;
      break;
    }
    case 'nanosecond': {
      total = nanoseconds;
      nanoseconds = RoundNumberToIncrement(bigInt(nanoseconds), increment, roundingMode).toJSNumber();
      break;
    }
  }
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, total };
}

export function CompareISODate(y1, m1, d1, y2, m2, d2) {
  if (y1 !== y2) return ComparisonResult(y1 - y2);
  if (m1 !== m2) return ComparisonResult(m1 - m2);
  if (d1 !== d2) return ComparisonResult(d1 - d2);
  return 0;
}

export function NonNegativeBigIntDivmod(x, y) {
  let { quotient, remainder } = x.divmod(y);
  if (remainder.lesser(0)) {
    quotient = quotient.prev();
    remainder = remainder.plus(y);
  }
  return { quotient, remainder };
}

export function ToBigInt(arg) {
  if (bigInt.isInstance(arg)) {
    return arg;
  }

  const prim = ToPrimitive(arg, Number);
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
}

// Note: This method returns values with bogus nanoseconds based on the previous iteration's
// milliseconds. That way there is a guarantee that the full nanoseconds are always going to be
// increasing at least and that the microsecond and nanosecond fields are likely to be non-zero.

export const SystemUTCEpochNanoSeconds = (() => {
  let ns = Date.now() % 1e6;
  return () => {
    const ms = Date.now();
    const result = bigInt(ms).multiply(1e6).plus(ns);
    ns = ms % 1e6;
    return bigInt.min(NS_MAX, bigInt.max(NS_MIN, result));
  };
})();

export function SystemTimeZone() {
  const fmt = new IntlDateTimeFormat('en-us');
  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
  return new TemporalTimeZone(ParseTemporalTimeZone(fmt.resolvedOptions().timeZone));
}

export function ComparisonResult(value) {
  return value < 0 ? -1 : value > 0 ? 1 : value;
}

export function GetOptionsObject(options) {
  if (options === undefined) return ObjectCreate(null);
  if (Type(options) === 'Object') return options;
  throw new TypeError(`Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`);
}

export function GetOption(options, property, allowedValues, fallback) {
  let value = options[property];
  if (value !== undefined) {
    value = ToString(value);
    if (!allowedValues.includes(value)) {
      throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
    }
    return value;
  }
  return fallback;
}

export function IsBuiltinCalendar(id) {
  return Call(ArrayIncludes, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)]);
}

export function ASCIILowercase(str) {
  return Call(StringPrototypeReplace, str, [
    /[A-Z]/g,
    (l) => {
      const code = Call(StringPrototypeCharCodeAt, l, [0]);
      return StringFromCharCode(code + 0x20);
    }
  ]);
}

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
