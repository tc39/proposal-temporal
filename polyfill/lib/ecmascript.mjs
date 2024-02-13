/* global __debug__ */

const ArrayIncludes = Array.prototype.includes;
const ArrayPrototypeMap = Array.prototype.map;
const ArrayPrototypePush = Array.prototype.push;
const ArrayPrototypeSort = Array.prototype.sort;
const ArrayPrototypeFind = Array.prototype.find;
const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
const IntlSupportedValuesOf = globalThis.Intl.supportedValuesOf;
const MapCtor = Map;
const MapPrototypeSet = Map.prototype.set;
const MathAbs = Math.abs;
const MathFloor = Math.floor;
const MathMax = Math.max;
const MathMin = Math.min;
const MathSign = Math.sign;
const MathTrunc = Math.trunc;
const NumberIsFinite = Number.isFinite;
const NumberIsNaN = Number.isNaN;
const NumberIsSafeInteger = Number.isSafeInteger;
const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
const ObjectCreate = Object.create;
const ObjectDefineProperty = Object.defineProperty;
const ObjectEntries = Object.entries;
const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const SetPrototypeHas = Set.prototype.has;
const StringCtor = String;
const StringFromCharCode = String.fromCharCode;
const StringPrototypeCharCodeAt = String.prototype.charCodeAt;
const StringPrototypeMatchAll = String.prototype.matchAll;
const StringPrototypeReplace = String.prototype.replace;
const StringPrototypeSlice = String.prototype.slice;

import bigInt from 'big-integer';
import callBound from 'call-bind/callBound';
import Call from 'es-abstract/2022/Call.js';
import CompletionRecord from 'es-abstract/2022/CompletionRecord.js';
import CreateDataPropertyOrThrow from 'es-abstract/2022/CreateDataPropertyOrThrow.js';
import Get from 'es-abstract/2022/Get.js';
import GetIterator from 'es-abstract/2022/GetIterator.js';
import GetMethod from 'es-abstract/2022/GetMethod.js';
import HasOwnProperty from 'es-abstract/2022/HasOwnProperty.js';
import IsArray from 'es-abstract/2022/IsArray.js';
import IsIntegralNumber from 'es-abstract/2022/IsIntegralNumber.js';
import IsPropertyKey from 'es-abstract/2022/IsPropertyKey.js';
import IteratorClose from 'es-abstract/2022/IteratorClose.js';
import IteratorStep from 'es-abstract/2022/IteratorStep.js';
import IteratorValue from 'es-abstract/2022/IteratorValue.js';
import SameValue from 'es-abstract/2022/SameValue.js';
import ToIntegerOrInfinity from 'es-abstract/2022/ToIntegerOrInfinity.js';
import ToNumber from 'es-abstract/2022/ToNumber.js';
import ToObject from 'es-abstract/2022/ToObject.js';
import ToPrimitive from 'es-abstract/2022/ToPrimitive.js';
import ToString from 'es-abstract/2022/ToString.js';
import ToZeroPaddedDecimalString from 'es-abstract/2022/ToZeroPaddedDecimalString.js';
import Type from 'es-abstract/2022/Type.js';

import every from 'es-abstract/helpers/every.js';
import forEach from 'es-abstract/helpers/forEach.js';
import OwnPropertyKeys from 'es-abstract/helpers/OwnPropertyKeys.js';
import some from 'es-abstract/helpers/some.js';

import { GetIntrinsic } from './intrinsicclass.mjs';
import { FMAPowerOf10, TruncatingDivModByPowerOf10 } from './math.mjs';
import { CalendarMethodRecord, TimeZoneMethodRecord } from './methodrecord.mjs';
import { TimeDuration } from './timeduration.mjs';
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
const DAY_NANOS = DAY_SECONDS * 1e9;
// Instant range is 100 million days (inclusive) before or after epoch.
const NS_MIN = bigInt(DAY_NANOS).multiply(-1e8);
const NS_MAX = bigInt(DAY_NANOS).multiply(1e8);
// PlainDateTime range is 24 hours wider (exclusive) than the Instant range on
// both ends, to allow for valid Instant=>PlainDateTime conversion for all
// built-in time zones (whose offsets must have a magnitude less than 24 hours).
const DATETIME_NS_MIN = NS_MIN.subtract(DAY_NANOS).add(bigInt.one);
const DATETIME_NS_MAX = NS_MAX.add(DAY_NANOS).subtract(bigInt.one);
// The pattern of leap years in the ISO 8601 calendar repeats every 400 years.
// The constant below is the number of nanoseconds in 400 years. It is used to
// avoid overflows when dealing with values at the edge legacy Date's range.
const NS_IN_400_YEAR_CYCLE = bigInt(400 * 365 + 97).multiply(DAY_NANOS);
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

const ICU_LEGACY_TIME_ZONE_IDS = new Set([
  'ACT',
  'AET',
  'AGT',
  'ART',
  'AST',
  'BET',
  'BST',
  'CAT',
  'CNT',
  'CST',
  'CTT',
  'EAT',
  'ECT',
  'IET',
  'IST',
  'JST',
  'MIT',
  'NET',
  'NST',
  'PLT',
  'PNT',
  'PRT',
  'PST',
  'SST',
  'VST'
]);

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

// This convenience function isn't in the spec, but is useful in the polyfill
// for DRY and better error messages.
export function RequireString(value) {
  if (Type(value) !== 'String') {
    // Use String() to ensure that Symbols won't throw
    throw new TypeError(`expected a string, not ${StringCtor(value)}`);
  }
  return value;
}

// This function is an enum in the spec, but it's helpful to make it a
// function in the polyfill.
function ToPrimitiveAndRequireString(value) {
  value = ToPrimitive(value, StringCtor);
  return RequireString(value);
}

const BUILTIN_CASTS = new Map([
  ['year', ToIntegerWithTruncation],
  ['month', ToPositiveIntegerWithTruncation],
  ['monthCode', ToPrimitiveAndRequireString],
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
  ['offset', ToPrimitiveAndRequireString]
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
  CompletionRecord,
  GetIterator,
  GetMethod,
  HasOwnProperty,
  IsIntegralNumber,
  IteratorClose,
  IteratorStep,
  IteratorValue,
  ToIntegerOrInfinity,
  ToNumber,
  ToObject,
  ToPrimitive,
  ToString,
  Type
};

const IntlDateTimeFormatEnUsCache = new Map();

function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier) {
  const lowercaseIdentifier = ASCIILowercase(timeZoneIdentifier);
  let instance = IntlDateTimeFormatEnUsCache.get(lowercaseIdentifier);
  if (instance === undefined) {
    instance = new IntlDateTimeFormat('en-us', {
      timeZone: lowercaseIdentifier,
      hour12: false,
      era: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    IntlDateTimeFormatEnUsCache.set(lowercaseIdentifier, instance);
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
    return;
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

export function RejectTemporalLikeObject(item) {
  if (HasSlot(item, CALENDAR) || HasSlot(item, TIME_ZONE)) {
    throw new TypeError('with() does not support a calendar or timeZone property');
  }
  if (IsTemporalTime(item)) {
    throw new TypeError('with() does not accept Temporal.PlainTime, use withPlainTime() instead');
  }
  if (item.calendar !== undefined) {
    throw new TypeError('with() does not support a calendar property');
  }
  if (item.timeZone !== undefined) {
    throw new TypeError('with() does not support a timeZone property');
  }
}

export function MaybeFormatCalendarAnnotation(calendar, showCalendar) {
  if (showCalendar === 'never') return '';
  return FormatCalendarAnnotation(ToTemporalCalendarIdentifier(calendar), showCalendar);
}

export function FormatCalendarAnnotation(id, showCalendar) {
  if (showCalendar === 'never') return '';
  if (showCalendar === 'auto' && id === 'iso8601') return '';
  const flag = showCalendar === 'critical' ? '!' : '';
  return `[${flag}u-ca=${id}]`;
}

// Not a separate abstract operation in the spec, because it only occurs in one
// place: ParseISODateTime. In the code it's more convenient to split up
// ParseISODateTime for the YYYY-MM, MM-DD, and THH:MM:SS parse goals, so it's
// repeated four times.
function processAnnotations(annotations) {
  let calendar;
  let calendarWasCritical = false;
  for (const [, critical, key, value] of Call(StringPrototypeMatchAll, annotations, [PARSE.annotation])) {
    if (key === 'u-ca') {
      if (calendar === undefined) {
        calendar = value;
        calendarWasCritical = critical === '!';
      } else if (critical === '!' || calendarWasCritical) {
        throw new RangeError(`Invalid annotations in ${annotations}: more than one u-ca present with critical flag`);
      }
    } else if (critical === '!') {
      throw new RangeError(`Unrecognized annotation: !${key}=${value}`);
    }
  }
  return calendar;
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
  } else if (match[14]) {
    offset = match[14];
  }
  const tzAnnotation = match[15];
  const calendar = processAnnotations(match[16]);
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
    tzAnnotation,
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
  if (!result.tzAnnotation) throw new RangeError('Temporal.ZonedDateTime requires a time zone ID in brackets');
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
  let hour, minute, second, millisecond, microsecond, nanosecond;
  if (match) {
    hour = ToIntegerOrInfinity(match[1]);
    minute = ToIntegerOrInfinity(match[2] || match[5]);
    second = ToIntegerOrInfinity(match[3] || match[6]);
    if (second === 60) second = 59;
    const fraction = (match[4] || match[7]) + '000000000';
    millisecond = ToIntegerOrInfinity(fraction.slice(0, 3));
    microsecond = ToIntegerOrInfinity(fraction.slice(3, 6));
    nanosecond = ToIntegerOrInfinity(fraction.slice(6, 9));
    processAnnotations(match[10]); // ignore found calendar
    if (match[8]) throw new RangeError('Z designator not supported for PlainTime');
  } else {
    let z, hasTime;
    ({ hasTime, hour, minute, second, millisecond, microsecond, nanosecond, z } = ParseISODateTime(isoString));
    if (!hasTime) throw new RangeError(`time is missing in string: ${isoString}`);
    if (z) throw new RangeError('Z designator not supported for PlainTime');
  }
  // if it's a date-time string, OK
  if (/[tT ][0-9][0-9]/.test(isoString)) {
    return { hour, minute, second, millisecond, microsecond, nanosecond };
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
      return { hour, minute, second, millisecond, microsecond, nanosecond };
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
    calendar = processAnnotations(match[3]);
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
    calendar = processAnnotations(match[3]);
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

const TIMEZONE_IDENTIFIER = new RegExp(`^${PARSE.timeZoneID.source}$`, 'i');
const OFFSET_IDENTIFIER = new RegExp(`^${PARSE.offsetIdentifier.source}$`);

function throwBadTimeZoneStringError(timeZoneString) {
  // Offset identifiers only support minute precision, but offsets in ISO
  // strings support nanosecond precision. If the identifier is invalid but
  // it's a valid ISO offset, then it has sub-minute precision. Show a clearer
  // error message in that case.
  const msg = OFFSET.test(timeZoneString) ? 'Seconds not allowed in offset time zone' : 'Invalid time zone';
  throw new RangeError(`${msg}: ${timeZoneString}`);
}

export function ParseTimeZoneIdentifier(identifier) {
  if (!TIMEZONE_IDENTIFIER.test(identifier)) {
    throwBadTimeZoneStringError(identifier);
  }
  if (OFFSET_IDENTIFIER.test(identifier)) {
    const offsetNanoseconds = ParseDateTimeUTCOffset(identifier);
    // The regex limits the input to minutes precision, so we know that the
    // division below will result in an integer.
    return { offsetMinutes: offsetNanoseconds / 60e9 };
  }
  return { tzName: identifier };
}

// This operation doesn't exist in the spec, but in the polyfill it's split from
// ParseTemporalTimeZoneString so that parsing can be tested separately from the
// logic of converting parsed values into a named or offset identifier.
export function ParseTemporalTimeZoneStringRaw(timeZoneString) {
  if (TIMEZONE_IDENTIFIER.test(timeZoneString)) {
    return { tzAnnotation: timeZoneString, offset: undefined, z: false };
  }
  try {
    // Try parsing ISO string instead
    const { tzAnnotation, offset, z } = ParseISODateTime(timeZoneString);
    if (z || tzAnnotation || offset) {
      return { tzAnnotation, offset, z };
    }
  } catch {
    // fall through
  }
  throwBadTimeZoneStringError(timeZoneString);
}

export function ParseTemporalTimeZoneString(stringIdent) {
  const { tzAnnotation, offset, z } = ParseTemporalTimeZoneStringRaw(stringIdent);
  if (tzAnnotation) return ParseTimeZoneIdentifier(tzAnnotation);
  if (z) return ParseTimeZoneIdentifier('UTC');
  if (offset) return ParseTimeZoneIdentifier(offset);
  throw new Error('this line should not be reached');
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
  minutes += MathTrunc(excessNanoseconds / 60e9);

  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
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
    return ParseTemporalDurationString(RequireString(item));
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
  if (!NumberIsFinite(increment)) {
    throw new RangeError('roundingIncrement must be finite');
  }
  const integerIncrement = MathTrunc(increment);
  if (integerIncrement < 1 || integerIncrement > 1e9) {
    throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${increment}`);
  }
  return integerIncrement;
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
  // returns: {
  //   plainRelativeTo: Temporal.PlainDate | undefined
  //   zonedRelativeTo: Temporal.ZonedDateTime | undefined
  //   timeZoneRec: TimeZoneMethodRecord | undefined
  // }
  // plainRelativeTo and zonedRelativeTo are mutually exclusive.
  // If zonedRelativeTo is defined, then timeZoneRec is defined.
  const relativeTo = options.relativeTo;
  if (relativeTo === undefined) return {};

  let offsetBehaviour = 'option';
  let matchMinutes = false;
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, timeZone, offset;
  if (Type(relativeTo) === 'Object') {
    if (IsTemporalZonedDateTime(relativeTo)) {
      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(relativeTo, TIME_ZONE), [
        'getOffsetNanosecondsFor',
        'getPossibleInstantsFor'
      ]);
      return { zonedRelativeTo: relativeTo, timeZoneRec };
    }
    if (IsTemporalDate(relativeTo)) return { plainRelativeTo: relativeTo };
    if (IsTemporalDateTime(relativeTo)) return { plainRelativeTo: TemporalDateTimeToDate(relativeTo) };
    calendar = GetTemporalCalendarSlotValueWithISODefault(relativeTo);
    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    Call(ArrayPrototypePush, fieldNames, [
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'nanosecond',
      'offset',
      'second',
      'timeZone'
    ]);
    const fields = PrepareTemporalFields(relativeTo, fieldNames, []);
    const dateOptions = ObjectCreate(null);
    dateOptions.overflow = 'constrain';
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendarRec,
      fields,
      dateOptions
    ));
    offset = fields.offset;
    if (offset === undefined) offsetBehaviour = 'wall';
    timeZone = fields.timeZone;
    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneSlotValue(timeZone);
  } else {
    let tzAnnotation, z;
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
      calendar,
      tzAnnotation,
      offset,
      z
    } = ParseISODateTime(RequireString(relativeTo)));
    if (tzAnnotation) {
      timeZone = ToTemporalTimeZoneSlotValue(tzAnnotation);
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
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
    calendar = ASCIILowercase(calendar);
  }
  if (timeZone === undefined) return { plainRelativeTo: CreateTemporalDate(year, month, day, calendar) };
  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
  const offsetNs = offsetBehaviour === 'option' ? ParseDateTimeUTCOffset(offset) : 0;
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
    timeZoneRec,
    'compatible',
    'reject',
    matchMinutes
  );
  return { zonedRelativeTo: CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar), timeZoneRec };
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

export function IsCalendarUnit(unit) {
  return unit === 'year' || unit === 'month' || unit === 'week';
}

export function PrepareTemporalFields(
  bag,
  fields,
  requiredFields,
  extraFieldDescriptors = [],
  duplicateBehaviour = 'throw',
  { emptySourceErrorMessage = 'no supported properties found' } = {}
) {
  const result = ObjectCreate(null);
  let any = false;
  if (extraFieldDescriptors) {
    for (let index = 0; index < extraFieldDescriptors.length; index++) {
      let desc = extraFieldDescriptors[index];
      Call(ArrayPrototypePush, fields, [desc.property]);
      if (desc.required === true && requiredFields !== 'partial') {
        Call(ArrayPrototypePush, requiredFields, [desc.property]);
      }
    }
  }
  Call(ArrayPrototypeSort, fields, []);
  let previousProperty = undefined;
  for (let index = 0; index < fields.length; index++) {
    const property = fields[index];
    if (property === 'constructor' || property === '__proto__') {
      throw new RangeError(`Calendar fields cannot be named ${property}`);
    }
    if (property !== previousProperty) {
      let value = bag[property];
      if (value !== undefined) {
        any = true;
        if (BUILTIN_CASTS.has(property)) {
          value = BUILTIN_CASTS.get(property)(value);
        } else if (extraFieldDescriptors) {
          const matchingDescriptor = Call(ArrayPrototypeFind, extraFieldDescriptors, [
            (desc) => desc.property === property
          ]);
          if (matchingDescriptor) {
            const convertor = matchingDescriptor.conversion;
            value = convertor(value);
          }
        }
        result[property] = value;
      } else if (requiredFields !== 'partial') {
        if (Call(ArrayIncludes, requiredFields, [property])) {
          throw new TypeError(`required property '${property}' missing or undefined`);
        }
        value = BUILTIN_DEFAULTS.get(property);
        result[property] = value;
      }
    } else if (duplicateBehaviour === 'throw') {
      throw new RangeError('Duplicate calendar fields');
    }
    previousProperty = property;
  }
  if (requiredFields === 'partial' && !any) {
    throw new TypeError(emptySourceErrorMessage);
  }
  return result;
}

export function ToTemporalTimeRecord(bag, completeness = 'complete') {
  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
  const partial = PrepareTemporalFields(bag, fields, 'partial', undefined, undefined, {
    emptySourceErrorMessage: 'invalid time-like'
  });
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
  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
  if (Type(item) === 'Object') {
    if (IsTemporalDate(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      ToTemporalOverflow(options); // validate and ignore
      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
      item = GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
      return CreateTemporalDate(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR)
      );
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
    const calendarRec = new CalendarMethodRecord(GetTemporalCalendarSlotValueWithISODefault(item), [
      'dateFromFields',
      'fields'
    ]);
    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    return CalendarDateFromFields(calendarRec, fields, options);
  }
  let { year, month, day, calendar, z } = ParseTemporalDateString(RequireString(item));
  if (z) throw new RangeError('Z designator not supported for PlainDate');
  if (!calendar) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  ToTemporalOverflow(options); // validate and ignore
  return CreateTemporalDate(year, month, day, calendar);
}

export function InterpretTemporalDateTimeFields(calendarRec, fields, options) {
  // dateFromFields must be looked up
  let { hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(fields);
  const overflow = ToTemporalOverflow(options);
  options.overflow = overflow; // options is always an internal object, so not observable
  const date = CalendarDateFromFields(calendarRec, fields, options);
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
  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);

  if (Type(item) === 'Object') {
    if (IsTemporalDateTime(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      ToTemporalOverflow(resolvedOptions); // validate and ignore
      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
      return GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDate(item)) {
      ToTemporalOverflow(resolvedOptions); // validate and ignore
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

    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    Call(ArrayPrototypePush, fieldNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendarRec,
      fields,
      resolvedOptions
    ));
  } else {
    let z;
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar, z } =
      ParseTemporalDateTimeString(RequireString(item)));
    if (z) throw new RangeError('Z designator not supported for PlainDateTime');
    RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
    calendar = ASCIILowercase(calendar);
    ToTemporalOverflow(resolvedOptions); // validate and ignore
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
  if (Type(item === 'Object')) {
    if (IsTemporalInstant(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
      return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
    }
    item = ToPrimitive(item, StringCtor);
  }
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, offset, z } =
    ParseTemporalInstantString(RequireString(item));

  // ParseTemporalInstantString ensures that either `z` is true or or `offset` is non-undefined
  const offsetNanoseconds = z ? 0 : ParseDateTimeUTCOffset(offset);
  const epochNanoseconds = GetUTCEpochNanoseconds(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    offsetNanoseconds
  );
  ValidateEpochNanoseconds(epochNanoseconds);

  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  return new TemporalInstant(epochNanoseconds);
}

export function ToTemporalMonthDay(item, options) {
  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
  if (Type(item) === 'Object') {
    if (IsTemporalMonthDay(item)) return item;
    let calendar;
    if (HasSlot(item, CALENDAR)) {
      calendar = GetSlot(item, CALENDAR);
    } else {
      calendar = item.calendar;
      if (calendar === undefined) calendar = 'iso8601';
      calendar = ToTemporalCalendarSlotValue(calendar);
    }
    const calendarRec = new CalendarMethodRecord(calendar, ['fields', 'monthDayFromFields']);
    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    return CalendarMonthDayFromFields(calendarRec, fields, options);
  }

  let { month, day, referenceISOYear, calendar } = ParseTemporalMonthDayString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  ToTemporalOverflow(options); // validate and ignore

  if (referenceISOYear === undefined) {
    if (calendar !== 'iso8601') {
      throw new Error(`assertion failed: missing year with non-"iso8601" calendar identifier ${calendar}`);
    }
    RejectISODate(1972, month, day);
    return CreateTemporalMonthDay(month, day, calendar);
  }
  const result = CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
  const calendarRec = new CalendarMethodRecord(calendar, ['monthDayFromFields']);
  return CalendarMonthDayFromFields(calendarRec, result);
}

export function ToTemporalTime(item, overflow = 'constrain') {
  let hour, minute, second, millisecond, microsecond, nanosecond;
  if (Type(item) === 'Object') {
    if (IsTemporalTime(item)) return item;
    if (IsTemporalZonedDateTime(item)) {
      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
      item = GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
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
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ParseTemporalTimeString(RequireString(item)));
    RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

export function ToTemporalYearMonth(item, options) {
  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
  if (Type(item) === 'Object') {
    if (IsTemporalYearMonth(item)) return item;
    const calendar = GetTemporalCalendarSlotValueWithISODefault(item);
    const calendarRec = new CalendarMethodRecord(calendar, ['fields', 'yearMonthFromFields']);
    const fieldNames = CalendarFields(calendarRec, ['month', 'monthCode', 'year']);
    const fields = PrepareTemporalFields(item, fieldNames, []);
    return CalendarYearMonthFromFields(calendarRec, fields, options);
  }

  let { year, month, referenceISODay, calendar } = ParseTemporalYearMonthString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  ToTemporalOverflow(options); // validate and ignore

  if (referenceISODay === undefined) {
    RejectISODate(year, month, 1);
    return CreateTemporalYearMonth(year, month, calendar);
  }
  const result = CreateTemporalYearMonth(year, month, calendar, referenceISODay);
  const calendarRec = new CalendarMethodRecord(calendar, ['yearMonthFromFields']);
  return CalendarYearMonthFromFields(calendarRec, result);
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
  timeZoneRec,
  disambiguation,
  offsetOpt,
  matchMinute
) {
  // getPossibleInstantsFor and getOffsetNanosecondsFor should be looked up.
  const dt = CreateTemporalDateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    'iso8601'
  );

  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Instant in the given time zone
    const instant = GetInstantFor(timeZoneRec, dt, disambiguation);
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
      nanosecond,
      offsetNs
    );
    ValidateEpochNanoseconds(epochNs);
    return epochNs;
  }

  // "prefer" or "reject"
  const possibleInstants = GetPossibleInstantsFor(timeZoneRec, dt);
  if (possibleInstants.length > 0) {
    for (let index = 0; index < possibleInstants.length; index++) {
      const candidate = possibleInstants[index];
      const candidateOffset = GetOffsetNanosecondsFor(timeZoneRec, candidate);
      const roundedCandidateOffset = RoundNumberToIncrement(bigInt(candidateOffset), 60e9, 'halfExpand').toJSNumber();
      if (candidateOffset === offsetNs || (matchMinute && roundedCandidateOffset === offsetNs)) {
        return GetSlot(candidate, EPOCHNANOSECONDS);
      }
    }
  }

  // the user-provided offset doesn't match any instants for this time
  // zone and date/time.
  if (offsetOpt === 'reject') {
    const offsetStr = FormatUTCOffsetNanoseconds(offsetNs);
    const timeZoneString = IsTemporalTimeZone(timeZoneRec.receiver)
      ? GetSlot(timeZoneRec.receiver, TIMEZONE_ID)
      : 'time zone';
    throw new RangeError(`Offset ${offsetStr} is invalid for ${dt} in ${timeZoneString}`);
  }
  // fall through: offsetOpt === 'prefer', but the offset doesn't match
  // so fall back to use the time zone instead.
  const instant = DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dt, disambiguation);
  return GetSlot(instant, EPOCHNANOSECONDS);
}

export function ToTemporalZonedDateTime(item, options) {
  let year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, timeZone, offset, calendar;
  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  let disambiguation, offsetOpt;
  let matchMinute = false;
  let offsetBehaviour = 'option';
  if (Type(item) === 'Object') {
    if (IsTemporalZonedDateTime(item)) return item;
    calendar = GetTemporalCalendarSlotValueWithISODefault(item);
    const calendarRec = new CalendarMethodRecord(calendar, ['dateFromFields', 'fields']);
    const fieldNames = CalendarFields(calendarRec, ['day', 'month', 'monthCode', 'year']);
    Call(ArrayPrototypePush, fieldNames, [
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'nanosecond',
      'offset',
      'second',
      'timeZone'
    ]);
    const fields = PrepareTemporalFields(item, fieldNames, ['timeZone']);
    timeZone = ToTemporalTimeZoneSlotValue(fields.timeZone);
    offset = fields.offset;
    if (offset === undefined) {
      offsetBehaviour = 'wall';
    }
    disambiguation = ToTemporalDisambiguation(resolvedOptions);
    offsetOpt = ToTemporalOffset(resolvedOptions, 'reject');
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = InterpretTemporalDateTimeFields(
      calendarRec,
      fields,
      resolvedOptions
    ));
  } else {
    let tzAnnotation, z;
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
      tzAnnotation,
      offset,
      z,
      calendar
    } = ParseTemporalZonedDateTimeString(RequireString(item)));
    timeZone = ToTemporalTimeZoneSlotValue(tzAnnotation);
    if (z) {
      offsetBehaviour = 'exact';
    } else if (!offset) {
      offsetBehaviour = 'wall';
    }
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
    calendar = ASCIILowercase(calendar);
    matchMinute = true; // ISO strings may specify offset with less precision
    disambiguation = ToTemporalDisambiguation(resolvedOptions);
    offsetOpt = ToTemporalOffset(resolvedOptions, 'reject');
    ToTemporalOverflow(resolvedOptions); // validate and ignore
  }
  let offsetNs = 0;
  if (offsetBehaviour === 'option') offsetNs = ParseDateTimeUTCOffset(offset);
  const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
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
    timeZoneRec,
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
    let repr = TemporalDateToString(result, 'never');
    if (typeof calendar === 'string') {
      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
    } else {
      repr += '[u-ca=<calendar object>]';
    }
    ObjectDefineProperty(result, '_repr_', {
      value: `Temporal.PlainDate <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalDate(isoYear, isoMonth, isoDay, calendar = 'iso8601') {
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
    let repr = TemporalDateTimeToString(result, 'auto', 'never');
    if (typeof calendar === 'string') {
      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
    } else {
      repr += '[u-ca=<calendar object>]';
    }
    Object.defineProperty(result, '_repr_', {
      value: `Temporal.PlainDateTime <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalDateTime(isoYear, isoMonth, isoDay, h, min, s, ms, µs, ns, calendar = 'iso8601') {
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
    let repr = TemporalMonthDayToString(result, 'never');
    if (typeof calendar === 'string') {
      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
    } else {
      repr += '[u-ca=<calendar object>]';
    }
    Object.defineProperty(result, '_repr_', {
      value: `Temporal.PlainMonthDay <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalMonthDay(isoMonth, isoDay, calendar = 'iso8601', referenceISOYear = 1972) {
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
    let repr = TemporalYearMonthToString(result, 'never');
    if (typeof calendar === 'string') {
      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
    } else {
      repr += '[u-ca=<calendar object>]';
    }
    Object.defineProperty(result, '_repr_', {
      value: `Temporal.PlainYearMonth <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalYearMonth(isoYear, isoMonth, calendar = 'iso8601', referenceISODay = 1) {
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
    let repr;
    if (typeof timeZone === 'string') {
      let offsetNs;
      const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
      if (offsetMinutes !== undefined) {
        offsetNs = offsetMinutes * 60e9;
      } else {
        offsetNs = GetNamedTimeZoneOffsetNanoseconds(timeZone, epochNanoseconds);
      }
      const dateTime = GetPlainDateTimeFor(undefined, instant, 'iso8601', offsetNs);
      repr = TemporalDateTimeToString(dateTime, 'auto', 'never');
      repr += FormatDateTimeUTCOffsetRounded(offsetNs);
      repr += `[${timeZone}]`;
    } else {
      const dateTime = GetPlainDateTimeFor(undefined, instant, 'iso8601', 0);
      repr = TemporalDateTimeToString(dateTime, 'auto', 'never') + 'Z[<time zone object>]';
    }
    if (typeof calendar === 'string') {
      repr += MaybeFormatCalendarAnnotation(calendar, 'auto');
    } else {
      repr += '[u-ca=<calendar object>]';
    }

    Object.defineProperty(result, '_repr_', {
      value: `Temporal.ZonedDateTime <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar = 'iso8601') {
  const TemporalZonedDateTime = GetIntrinsic('%Temporal.ZonedDateTime%');
  const result = ObjectCreate(TemporalZonedDateTime.prototype);
  CreateTemporalZonedDateTimeSlots(result, epochNanoseconds, timeZone, calendar);
  return result;
}

export function CalendarFields(calendarRec, fieldNames) {
  // Special-case built-in method, because we should skip the observable array
  // iteration in Calendar.prototype.fields
  if (calendarRec.isBuiltIn()) {
    if (calendarRec.receiver === 'iso8601') return fieldNames;
    return GetIntrinsic('%calendarFieldsImpl%')(calendarRec.receiver, fieldNames);
  }

  fieldNames = calendarRec.fields(fieldNames);
  const result = [];
  for (const name of fieldNames) {
    if (Type(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
    Call(ArrayPrototypePush, result, [name]);
  }
  return result;
}

export function CalendarMergeFields(calendarRec, fields, additionalFields) {
  const result = calendarRec.mergeFields(fields, additionalFields);
  if (!calendarRec.isBuiltIn() && Type(result) !== 'Object') {
    throw new TypeError('bad return from calendar.mergeFields()');
  }
  return result;
}

export function CalendarDateAdd(calendarRec, date, duration, options) {
  const result = calendarRec.dateAdd(date, duration, options);
  if (!calendarRec.isBuiltIn() && !IsTemporalDate(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarDateUntil(calendarRec, date, otherDate, options) {
  const result = calendarRec.dateUntil(date, otherDate, options);
  if (!calendarRec.isBuiltIn() && !IsTemporalDuration(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.year%'), calendar, [dateLike]);
  }
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
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.month%'), calendar, [dateLike]);
  }
  const month = GetMethod(calendar, 'month');
  const result = Call(month, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar month result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar month result must be a positive integer');
  }
  return result;
}

export function CalendarMonthCode(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.monthCode%'), calendar, [dateLike]);
  }
  const monthCode = GetMethod(calendar, 'monthCode');
  const result = Call(monthCode, calendar, [dateLike]);
  if (typeof result !== 'string') {
    throw new TypeError('calendar monthCode result must be a string');
  }
  return result;
}

export function CalendarDay(calendarRec, dateLike) {
  const result = calendarRec.day(dateLike);
  // No validation needed for built-in method
  if (calendarRec.isBuiltIn()) return result;
  if (typeof result !== 'number') {
    throw new TypeError('calendar day result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar day result must be a positive integer');
  }
  return result;
}

export function CalendarEra(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.era%'), calendar, [dateLike]);
  }
  const era = GetMethod(calendar, 'era');
  let result = Call(era, calendar, [dateLike]);
  if (result === undefined) {
    return result;
  }
  if (typeof result !== 'string') {
    throw new TypeError('calendar era result must be a string or undefined');
  }
  return result;
}

export function CalendarEraYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.eraYear%'), calendar, [dateLike]);
  }
  const eraYear = GetMethod(calendar, 'eraYear');
  let result = Call(eraYear, calendar, [dateLike]);
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
}

export function CalendarDayOfWeek(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.dayOfWeek%'), calendar, [dateLike]);
  }
  const dayOfWeek = GetMethod(calendar, 'dayOfWeek');
  const result = Call(dayOfWeek, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar dayOfWeek result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar dayOfWeek result must be a positive integer');
  }
  return result;
}

export function CalendarDayOfYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.dayOfYear%'), calendar, [dateLike]);
  }
  const dayOfYear = GetMethod(calendar, 'dayOfYear');
  const result = Call(dayOfYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar dayOfYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar dayOfYear result must be a positive integer');
  }
  return result;
}

export function CalendarWeekOfYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.weekOfYear%'), calendar, [dateLike]);
  }
  const weekOfYear = GetMethod(calendar, 'weekOfYear');
  const result = Call(weekOfYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar weekOfYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar weekOfYear result must be a positive integer');
  }
  return result;
}

export function CalendarYearOfWeek(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.yearOfWeek%'), calendar, [dateLike]);
  }
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
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.daysInWeek%'), calendar, [dateLike]);
  }
  const daysInWeek = GetMethod(calendar, 'daysInWeek');
  const result = Call(daysInWeek, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInWeek result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar daysInWeek result must be a positive integer');
  }
  return result;
}

export function CalendarDaysInMonth(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.daysInMonth%'), calendar, [dateLike]);
  }
  const daysInMonth = GetMethod(calendar, 'daysInMonth');
  const result = Call(daysInMonth, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInMonth result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar daysInMonth result must be a positive integer');
  }
  return result;
}

export function CalendarDaysInYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.daysInYear%'), calendar, [dateLike]);
  }
  const daysInYear = GetMethod(calendar, 'daysInYear');
  const result = Call(daysInYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar daysInYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar daysInYear result must be a positive integer');
  }
  return result;
}

export function CalendarMonthsInYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.monthsInYear%'), calendar, [dateLike]);
  }
  const monthsInYear = GetMethod(calendar, 'monthsInYear');
  const result = Call(monthsInYear, calendar, [dateLike]);
  if (typeof result !== 'number') {
    throw new TypeError('calendar monthsInYear result must be a positive integer');
  }
  if (!IsIntegralNumber(result) || result < 1) {
    throw new RangeError('calendar monthsInYear result must be a positive integer');
  }
  return result;
}

export function CalendarInLeapYear(calendar, dateLike) {
  if (typeof calendar === 'string') {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    calendar = new TemporalCalendar(calendar);
    return Call(GetIntrinsic('%Temporal.Calendar.prototype.inLeapYear%'), calendar, [dateLike]);
  }
  const inLeapYear = GetMethod(calendar, 'inLeapYear');
  const result = Call(inLeapYear, calendar, [dateLike]);
  if (typeof result !== 'boolean') {
    throw new TypeError('calendar inLeapYear result must be a boolean');
  }
  return result;
}

export function ObjectImplementsTemporalCalendarProtocol(object) {
  if (IsTemporalCalendar(object)) return true;
  return (
    'dateAdd' in object &&
    'dateFromFields' in object &&
    'dateUntil' in object &&
    'day' in object &&
    'dayOfWeek' in object &&
    'dayOfYear' in object &&
    'daysInMonth' in object &&
    'daysInWeek' in object &&
    'daysInYear' in object &&
    'fields' in object &&
    'id' in object &&
    'inLeapYear' in object &&
    'mergeFields' in object &&
    'month' in object &&
    'monthCode' in object &&
    'monthDayFromFields' in object &&
    'monthsInYear' in object &&
    'weekOfYear' in object &&
    'year' in object &&
    'yearMonthFromFields' in object &&
    'yearOfWeek' in object
  );
}

export function ToTemporalCalendarSlotValue(calendarLike) {
  if (Type(calendarLike) === 'Object') {
    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
    if (!ObjectImplementsTemporalCalendarProtocol(calendarLike)) {
      throw new TypeError('expected a Temporal.Calendar or object implementing the Temporal.Calendar protocol');
    }
    return calendarLike;
  }
  const identifier = RequireString(calendarLike);
  if (IsBuiltinCalendar(identifier)) return ASCIILowercase(identifier);
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
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  return ASCIILowercase(calendar);
}

export function GetTemporalCalendarSlotValueWithISODefault(item) {
  if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
  const { calendar } = item;
  if (calendar === undefined) return 'iso8601';
  return ToTemporalCalendarSlotValue(calendar);
}

export function ToTemporalCalendarIdentifier(slotValue) {
  if (typeof slotValue === 'string') return slotValue;
  const result = slotValue.id;
  if (typeof result !== 'string') throw new TypeError('calendar.id should be a string');
  return result;
}

export function ToTemporalCalendarObject(slotValue) {
  if (Type(slotValue) === 'Object') return slotValue;
  const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
  return new TemporalCalendar(slotValue);
}

export function CalendarEquals(one, two) {
  if (one === two) return true;
  const cal1 = ToTemporalCalendarIdentifier(one);
  const cal2 = ToTemporalCalendarIdentifier(two);
  return cal1 === cal2;
}

// This operation is not in the spec, it implements the following:
// "If ? CalendarEquals(one, two) is false, throw a RangeError exception."
// This is so that we can build an informative error message without
// re-getting the .id properties.
export function ThrowIfCalendarsNotEqual(one, two, errorMessageAction) {
  if (one === two) return;
  const cal1 = ToTemporalCalendarIdentifier(one);
  const cal2 = ToTemporalCalendarIdentifier(two);
  if (cal1 !== cal2) {
    throw new RangeError(`cannot ${errorMessageAction} of ${cal1} and ${cal2} calendars`);
  }
}

export function ConsolidateCalendars(one, two) {
  if (one === two) return two;
  const sOne = ToTemporalCalendarIdentifier(one);
  const sTwo = ToTemporalCalendarIdentifier(two);
  if (sOne === sTwo || sOne === 'iso8601') {
    return two;
  } else if (sTwo === 'iso8601') {
    return one;
  } else {
    throw new RangeError('irreconcilable calendars');
  }
}

export function CalendarDateFromFields(calendarRec, fields, options) {
  const result = calendarRec.dateFromFields(fields, options);
  if (!calendarRec.isBuiltIn() && !IsTemporalDate(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarYearMonthFromFields(calendarRec, fields, options) {
  const result = calendarRec.yearMonthFromFields(fields, options);
  if (!calendarRec.isBuiltIn() && !IsTemporalYearMonth(result)) throw new TypeError('invalid result');
  return result;
}

export function CalendarMonthDayFromFields(calendarRec, fields, options) {
  const result = calendarRec.monthDayFromFields(fields, options);
  if (!calendarRec.isBuiltIn() && !IsTemporalMonthDay(result)) throw new TypeError('invalid result');
  return result;
}

export function ObjectImplementsTemporalTimeZoneProtocol(object) {
  if (IsTemporalTimeZone(object)) return true;
  return 'getOffsetNanosecondsFor' in object && 'getPossibleInstantsFor' in object && 'id' in object;
}

export function ToTemporalTimeZoneSlotValue(temporalTimeZoneLike) {
  if (Type(temporalTimeZoneLike) === 'Object') {
    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
    if (!ObjectImplementsTemporalTimeZoneProtocol(temporalTimeZoneLike)) {
      throw new TypeError('expected a Temporal.TimeZone or object implementing the Temporal.TimeZone protocol');
    }
    return temporalTimeZoneLike;
  }
  const timeZoneString = RequireString(temporalTimeZoneLike);

  const { tzName, offsetMinutes } = ParseTemporalTimeZoneString(timeZoneString);
  if (offsetMinutes !== undefined) {
    return FormatOffsetTimeZoneIdentifier(offsetMinutes);
  }
  // if offsetMinutes is undefined, then tzName must be present
  const record = GetAvailableNamedTimeZoneIdentifier(tzName);
  if (!record) throw new RangeError(`Unrecognized time zone ${tzName}`);
  return record.identifier;
}

export function ToTemporalTimeZoneIdentifier(slotValue) {
  if (typeof slotValue === 'string') return slotValue;
  const result = slotValue.id;
  if (typeof result !== 'string') throw new TypeError('timeZone.id should be a string');
  return result;
}

export function ToTemporalTimeZoneObject(slotValue) {
  if (Type(slotValue) === 'Object') return slotValue;
  const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
  return new TemporalTimeZone(slotValue);
}

export function TimeZoneEquals(one, two) {
  if (one === two) return true;
  const tz1 = ToTemporalTimeZoneIdentifier(one);
  const tz2 = ToTemporalTimeZoneIdentifier(two);
  if (tz1 === tz2) return true;
  const offsetMinutes1 = ParseTimeZoneIdentifier(tz1).offsetMinutes;
  const offsetMinutes2 = ParseTimeZoneIdentifier(tz2).offsetMinutes;
  if (offsetMinutes1 === undefined && offsetMinutes2 === undefined) {
    // Calling GetAvailableNamedTimeZoneIdentifier is costly, so (unlike the
    // spec) the polyfill will early-return if one of them isn't recognized. Try
    // the second ID first because it's more likely to be unknown, because it
    // can come from the argument of TimeZone.p.equals as opposed to the first
    // ID which comes from the receiver.
    const idRecord2 = GetAvailableNamedTimeZoneIdentifier(tz2);
    if (!idRecord2) return false;
    const idRecord1 = GetAvailableNamedTimeZoneIdentifier(tz1);
    if (!idRecord1) return false;
    return idRecord1.primaryIdentifier === idRecord2.primaryIdentifier;
  } else {
    return offsetMinutes1 === offsetMinutes2;
  }
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

export function GetOffsetNanosecondsFor(timeZoneRec, instant) {
  const offsetNs = timeZoneRec.getOffsetNanosecondsFor(instant);
  // No validation needed for built-in method
  if (timeZoneRec.isBuiltIn()) return offsetNs;

  if (typeof offsetNs !== 'number') {
    throw new TypeError('bad return from getOffsetNanosecondsFor');
  }
  if (!IsIntegralNumber(offsetNs) || MathAbs(offsetNs) >= 86400e9) {
    throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
  }
  return offsetNs;
}

export function GetOffsetStringFor(timeZoneRec, instant) {
  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
  return FormatUTCOffsetNanoseconds(offsetNs);
}

export function FormatUTCOffsetNanoseconds(offsetNs) {
  const sign = offsetNs < 0 ? '-' : '+';
  const absoluteNs = MathAbs(offsetNs);
  const hour = MathFloor(absoluteNs / 3600e9);
  const minute = MathFloor(absoluteNs / 60e9) % 60;
  const second = MathFloor(absoluteNs / 1e9) % 60;
  const subSecondNs = absoluteNs % 1e9;
  const precision = second === 0 && subSecondNs === 0 ? 'minute' : 'auto';
  const timeString = FormatTimeString(hour, minute, second, subSecondNs, precision);
  return `${sign}${timeString}`;
}

export function GetPlainDateTimeFor(timeZoneRec, instant, calendar, precalculatedOffsetNs = undefined) {
  // Either getOffsetNanosecondsFor must be looked up, or
  // precalculatedOffsetNs should be supplied
  const ns = GetSlot(instant, EPOCHNANOSECONDS);
  const offsetNs = precalculatedOffsetNs ?? GetOffsetNanosecondsFor(timeZoneRec, instant);
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

export function GetInstantFor(timeZoneRec, dateTime, disambiguation) {
  // getPossibleInstantsFor and getOffsetNanosecondsFor must be looked up.
  const possibleInstants = GetPossibleInstantsFor(timeZoneRec, dateTime);
  return DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation);
}

export function DisambiguatePossibleInstants(possibleInstants, timeZoneRec, dateTime, disambiguation) {
  // getPossibleInstantsFor must be looked up already.
  // getOffsetNanosecondsFor must be be looked up if possibleInstants is empty
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

  if (disambiguation === 'reject') throw new RangeError('multiple instants found');
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

  // In the spec, range validation of `dayBefore` and `dayAfter` happens here.
  // In the polyfill, it happens in the Instant constructor.
  const dayBefore = new Instant(utcns.minus(DAY_NANOS));
  const dayAfter = new Instant(utcns.plus(DAY_NANOS));

  const offsetBefore = GetOffsetNanosecondsFor(timeZoneRec, dayBefore);
  const offsetAfter = GetOffsetNanosecondsFor(timeZoneRec, dayAfter);
  const nanoseconds = offsetAfter - offsetBefore;
  if (MathAbs(nanoseconds) > DAY_NANOS) {
    throw new RangeError('bad return from getOffsetNanosecondsFor: UTC offset shift longer than 24 hours');
  }

  switch (disambiguation) {
    case 'earlier': {
      const norm = TimeDuration.normalize(0, 0, 0, 0, 0, -nanoseconds);
      const earlierTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
      const earlierDate = AddISODate(year, month, day, 0, 0, 0, earlierTime.deltaDays, 'constrain');
      const earlierPlainDateTime = CreateTemporalDateTime(
        earlierDate.year,
        earlierDate.month,
        earlierDate.day,
        earlierTime.hour,
        earlierTime.minute,
        earlierTime.second,
        earlierTime.millisecond,
        earlierTime.microsecond,
        earlierTime.nanosecond
      );
      return GetPossibleInstantsFor(timeZoneRec, earlierPlainDateTime)[0];
    }
    case 'compatible':
    // fall through because 'compatible' means 'later' for "spring forward" transitions
    case 'later': {
      const norm = TimeDuration.normalize(0, 0, 0, 0, 0, nanoseconds);
      const laterTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
      const laterDate = AddISODate(year, month, day, 0, 0, 0, laterTime.deltaDays, 'constrain');
      const laterPlainDateTime = CreateTemporalDateTime(
        laterDate.year,
        laterDate.month,
        laterDate.day,
        laterTime.hour,
        laterTime.minute,
        laterTime.second,
        laterTime.millisecond,
        laterTime.microsecond,
        laterTime.nanosecond
      );
      const possible = GetPossibleInstantsFor(timeZoneRec, laterPlainDateTime);
      return possible[possible.length - 1];
    }
    case 'reject': {
      throw new Error('should not be reached: reject handled earlier');
    }
  }
  throw new Error(`assertion failed: invalid disambiguation value ${disambiguation}`);
}

export function GetPossibleInstantsFor(timeZoneRec, dateTime) {
  const possibleInstants = timeZoneRec.getPossibleInstantsFor(dateTime);
  // No validation needed for built-in method
  if (timeZoneRec.isBuiltIn()) return possibleInstants;

  const result = [];
  for (const instant of possibleInstants) {
    if (!IsTemporalInstant(instant)) {
      throw new TypeError('bad return from getPossibleInstantsFor');
    }
    Call(ArrayPrototypePush, result, [instant]);
  }

  const numResults = result.length;
  if (numResults > 1) {
    const mapped = Call(ArrayPrototypeMap, result, [(i) => GetSlot(i, EPOCHNANOSECONDS)]);
    const min = bigInt.min(...mapped);
    const max = bigInt.max(...mapped);
    if (bigInt(max).subtract(min).abs().greater(DAY_NANOS)) {
      throw new RangeError('bad return from getPossibleInstantsFor: UTC offset shift longer than 24 hours');
    }
  }

  return result;
}

export function ISOYearString(year) {
  let yearString;
  if (year < 0 || year > 9999) {
    let sign = year < 0 ? '-' : '+';
    let yearNumber = MathAbs(year);
    yearString = sign + ToZeroPaddedDecimalString(yearNumber, 6);
  } else {
    yearString = ToZeroPaddedDecimalString(year, 4);
  }
  return yearString;
}

export function ISODateTimePartString(part) {
  return ToZeroPaddedDecimalString(part, 2);
}

export function FormatFractionalSeconds(subSecondNanoseconds, precision) {
  let fraction;
  if (precision === 'auto') {
    if (subSecondNanoseconds === 0) return '';
    const fractionFullPrecision = ToZeroPaddedDecimalString(subSecondNanoseconds, 9);
    // now remove any trailing zeroes
    fraction = Call(StringPrototypeReplace, fractionFullPrecision, [/0+$/, '']);
  } else {
    if (precision === 0) return '';
    const fractionFullPrecision = ToZeroPaddedDecimalString(subSecondNanoseconds, 9);
    fraction = Call(StringPrototypeSlice, fractionFullPrecision, [0, precision]);
  }
  return `.${fraction}`;
}

export function FormatTimeString(hour, minute, second, subSecondNanoseconds, precision) {
  let result = `${ISODateTimePartString(hour)}:${ISODateTimePartString(minute)}`;
  if (precision === 'minute') return result;

  result += `:${ISODateTimePartString(second)}`;
  result += FormatFractionalSeconds(subSecondNanoseconds, precision);
  return result;
}

export function TemporalInstantToString(instant, timeZone, precision) {
  let outputTimeZone = timeZone;
  if (outputTimeZone === undefined) outputTimeZone = 'UTC';
  const timeZoneRec = new TimeZoneMethodRecord(outputTimeZone, ['getOffsetNanosecondsFor']);
  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
  const dateTime = GetPlainDateTimeFor(timeZoneRec, instant, 'iso8601', offsetNs);
  const dateTimeString = TemporalDateTimeToString(dateTime, precision, 'never');
  let timeZoneString = 'Z';
  if (timeZone !== undefined) {
    timeZoneString = FormatDateTimeUTCOffsetRounded(offsetNs);
  }
  return `${dateTimeString}${timeZoneString}`;
}

function formatAsDecimalNumber(num) {
  if (num <= NumberMaxSafeInteger) return num.toString(10);
  return bigInt(num).toString();
}

export function TemporalDurationToString(years, months, weeks, days, hours, minutes, normSeconds, precision = 'auto') {
  const sign = DurationSign(years, months, weeks, days, hours, minutes, normSeconds.sec, 0, 0, normSeconds.subsec);

  let datePart = '';
  if (years !== 0) datePart += `${formatAsDecimalNumber(MathAbs(years))}Y`;
  if (months !== 0) datePart += `${formatAsDecimalNumber(MathAbs(months))}M`;
  if (weeks !== 0) datePart += `${formatAsDecimalNumber(MathAbs(weeks))}W`;
  if (days !== 0) datePart += `${formatAsDecimalNumber(MathAbs(days))}D`;

  let timePart = '';
  if (hours !== 0) timePart += `${formatAsDecimalNumber(MathAbs(hours))}H`;
  if (minutes !== 0) timePart += `${formatAsDecimalNumber(MathAbs(minutes))}M`;

  if (
    !normSeconds.isZero() ||
    (years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0) ||
    precision !== 'auto'
  ) {
    const secondsPart = formatAsDecimalNumber(MathAbs(normSeconds.sec));
    const subSecondsPart = FormatFractionalSeconds(MathAbs(normSeconds.subsec), precision);
    timePart += `${secondsPart}${subSecondsPart}S`;
  }
  let result = `${sign < 0 ? '-' : ''}P${datePart}`;
  if (timePart) result = `${result}T${timePart}`;
  return result;
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

  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  const timeString = FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
  const calendar = MaybeFormatCalendarAnnotation(GetSlot(dateTime, CALENDAR), showCalendar);
  return `${yearString}-${monthString}-${dayString}T${timeString}${calendar}`;
}

export function TemporalMonthDayToString(monthDay, showCalendar = 'auto') {
  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar = GetSlot(monthDay, CALENDAR);
  const calendarID = ToTemporalCalendarIdentifier(calendar);
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
  const calendarID = ToTemporalCalendarIdentifier(calendar);
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
  const timeZoneRec = new TimeZoneMethodRecord(tz, ['getOffsetNanosecondsFor']);
  const offsetNs = GetOffsetNanosecondsFor(timeZoneRec, instant);
  const dateTime = GetPlainDateTimeFor(timeZoneRec, instant, 'iso8601', offsetNs);
  let dateTimeString = TemporalDateTimeToString(dateTime, precision, 'never');
  if (showOffset !== 'never') {
    dateTimeString += FormatDateTimeUTCOffsetRounded(offsetNs);
  }
  if (showTimeZone !== 'never') {
    const identifier = ToTemporalTimeZoneIdentifier(tz);
    const flag = showTimeZone === 'critical' ? '!' : '';
    dateTimeString += `[${flag}${identifier}]`;
  }
  dateTimeString += MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
  return dateTimeString;
}

export function IsOffsetTimeZoneIdentifier(string) {
  return OFFSET.test(string);
}

export function ParseDateTimeUTCOffset(string) {
  const match = OFFSET_WITH_PARTS.exec(string);
  if (!match) {
    throw new RangeError(`invalid time zone offset: ${string}`);
  }
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  const seconds = +(match[4] || 0);
  const nanoseconds = +((match[5] || 0) + '000000000').slice(0, 9);
  const offsetNanoseconds = sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
  return offsetNanoseconds;
}

let canonicalTimeZoneIdsCache = undefined;

export function GetAvailableNamedTimeZoneIdentifier(identifier) {
  // The most common case is when the identifier is a canonical time zone ID.
  // Fast-path that case by caching all canonical IDs. For old ECMAScript
  // implementations lacking this API, set the cache to `null` to avoid retries.
  if (canonicalTimeZoneIdsCache === undefined) {
    const canonicalTimeZoneIds = IntlSupportedValuesOf?.('timeZone');
    if (canonicalTimeZoneIds) {
      canonicalTimeZoneIdsCache = new MapCtor();
      for (let ix = 0; ix < canonicalTimeZoneIds.length; ix++) {
        const id = canonicalTimeZoneIds[ix];
        Call(MapPrototypeSet, canonicalTimeZoneIdsCache, [ASCIILowercase(id), id]);
      }
    } else {
      canonicalTimeZoneIdsCache = null;
    }
  }

  const lower = ASCIILowercase(identifier);
  let primaryIdentifier = canonicalTimeZoneIdsCache?.get(lower);
  if (primaryIdentifier) return { identifier: primaryIdentifier, primaryIdentifier };

  // It's not already a primary identifier, so get its primary identifier (or
  // return if it's not an available named time zone ID).
  try {
    const formatter = getIntlDateTimeFormatEnUsForTimeZone(identifier);
    primaryIdentifier = formatter.resolvedOptions().timeZone;
  } catch {
    return undefined;
  }

  // Some legacy identifiers are aliases in ICU but not legal IANA identifiers.
  // Reject them even if the implementation's Intl supports them, as they are
  // not present in the IANA time zone database.
  if (Call(SetPrototypeHas, ICU_LEGACY_TIME_ZONE_IDS, [identifier])) {
    throw new RangeError(`${identifier} is a legacy time zone identifier from ICU. Use ${primaryIdentifier} instead`);
  }

  // The identifier is an alias (a deprecated identifier that's a synonym for a
  // primary identifier), so we need to case-normalize the identifier to match
  // the IANA TZDB, e.g. america/new_york => America/New_York. There's no
  // built-in way to do this using Intl.DateTimeFormat, but the we can normalize
  // almost all aliases (modulo a few special cases) using the TZDB's basic
  // capitalization pattern:
  // 1. capitalize the first letter of the identifier
  // 2. capitalize the letter after every slash, dash, or underscore delimiter
  const standardCase = [...lower]
    .map((c, i) => (i === 0 || '/-_'.includes(lower[i - 1]) ? c.toUpperCase() : c))
    .join('');
  const segments = standardCase.split('/');

  if (segments.length === 1) {
    // If a single-segment legacy ID is 2-3 chars or contains a number or dash, then
    // (except for the "GB-Eire" special case) the case-normalized form is uppercase.
    // These are: GMT+0, GMT-0, GB, NZ, PRC, ROC, ROK, UCT, GMT, GMT0, CET, CST6CDT,
    // EET, EST, HST, MET, MST, MST7MDT, PST8PDT, WET, NZ-CHAT, and W-SU.
    // Otherwise it's standard form: first letter capitalized, e.g. Iran, Egypt, Hongkong
    if (lower === 'gb-eire') return { identifier: 'GB-Eire', primaryIdentifier };
    return {
      identifier: lower.length <= 3 || /[-0-9]/.test(lower) ? lower.toUpperCase() : segments[0],
      primaryIdentifier
    };
  }

  // All Etc zone names are uppercase except three exceptions.
  if (segments[0] === 'Etc') {
    const etcName = ['Zulu', 'Greenwich', 'Universal'].includes(segments[1]) ? segments[1] : segments[1].toUpperCase();
    return { identifier: `Etc/${etcName}`, primaryIdentifier };
  }

  // Legacy US identifiers like US/Alaska or US/Indiana-Starke are 2 segments and use standard form.
  if (segments[0] === 'Us') return { identifier: `US/${segments[1]}`, primaryIdentifier };

  // For multi-segment IDs, there's a few special cases in the second/third segments
  const specialCases = {
    Act: 'ACT',
    Lhi: 'LHI',
    Nsw: 'NSW',
    Dar_Es_Salaam: 'Dar_es_Salaam',
    Port_Of_Spain: 'Port_of_Spain',
    Isle_Of_Man: 'Isle_of_Man',
    Comodrivadavia: 'ComodRivadavia',
    Knox_In: 'Knox_IN',
    Dumontdurville: 'DumontDUrville',
    Mcmurdo: 'McMurdo',
    Denoronha: 'DeNoronha',
    Easterisland: 'EasterIsland',
    Bajanorte: 'BajaNorte',
    Bajasur: 'BajaSur'
  };
  segments[1] = specialCases[segments[1]] ?? segments[1];
  if (segments.length > 2) segments[2] = specialCases[segments[2]] ?? segments[2];
  return { identifier: segments.join('/'), primaryIdentifier };
}

export function GetNamedTimeZoneOffsetNanoseconds(id, epochNanoseconds) {
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } =
    GetNamedTimeZoneDateTimeParts(id, epochNanoseconds);
  const utc = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  return utc.minus(epochNanoseconds).toJSNumber();
}

export function FormatOffsetTimeZoneIdentifier(offsetMinutes) {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absoluteMinutes = MathAbs(offsetMinutes);
  const hour = MathFloor(absoluteMinutes / 60);
  const minute = absoluteMinutes % 60;
  const timeString = FormatTimeString(hour, minute, 0, 0, 'minute');
  return `${sign}${timeString}`;
}

export function FormatDateTimeUTCOffsetRounded(offsetNanoseconds) {
  offsetNanoseconds = RoundNumberToIncrement(bigInt(offsetNanoseconds), 60e9, 'halfExpand').toJSNumber();
  return FormatOffsetTimeZoneIdentifier(offsetNanoseconds / 60e9);
}

export function GetUTCEpochNanoseconds(
  year,
  month,
  day,
  hour,
  minute,
  second,
  millisecond,
  microsecond,
  nanosecond,
  offsetNs = 0
) {
  // The pattern of leap years in the ISO 8601 calendar repeats every 400
  // years. To avoid overflowing at the edges of the range, we reduce the year
  // to the remainder after dividing by 400, and then add back all the
  // nanoseconds from the multiples of 400 years at the end.
  const reducedYear = year % 400;
  const yearCycles = (year - reducedYear) / 400;

  // Note: Date.UTC() interprets one and two-digit years as being in the
  // 20th century, so don't use it
  const legacyDate = new Date();
  legacyDate.setUTCHours(hour, minute, second, millisecond);
  legacyDate.setUTCFullYear(reducedYear, month - 1, day);
  const ms = legacyDate.getTime();
  let ns = bigInt(ms).multiply(1e6);
  ns = ns.plus(bigInt(microsecond).multiply(1e3));
  ns = ns.plus(bigInt(nanosecond));

  let result = ns.plus(NS_IN_400_YEAR_CYCLE.multiply(bigInt(yearCycles)));
  if (offsetNs) result = result.subtract(bigInt(offsetNs));
  return result;
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
  if (epochNanoseconds.lesser(BEFORE_FIRST_DST)) {
    return GetNamedTimeZoneNextTransition(id, BEFORE_FIRST_DST);
  }
  // Optimization: the farthest that we'll look for a next transition is 3 years
  // after the later of epochNanoseconds or the current time. If there are no
  // transitions found before then, we'll assume that there will not be any more
  // transitions after that.
  const now = SystemUTCEpochNanoSeconds();
  const base = epochNanoseconds.greater(now) ? epochNanoseconds : now;
  const uppercap = base.plus(bigInt(DAY_NANOS).multiply(366 * 3));
  let leftNanos = epochNanoseconds;
  let leftOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, leftNanos);
  let rightNanos = leftNanos;
  let rightOffsetNs = leftOffsetNs;
  while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
    rightNanos = bigInt(leftNanos).plus(bigInt(DAY_NANOS).multiply(2 * 7));
    if (rightNanos.greater(NS_MAX)) return null;
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
  // Optimization: if the instant is more than 3 years in the future and there
  // are no transitions between the present day and 3 years from now, assume
  // there are none after.
  const now = SystemUTCEpochNanoSeconds();
  const lookahead = now.plus(bigInt(DAY_NANOS).multiply(366 * 3));
  if (epochNanoseconds.gt(lookahead)) {
    const prevBeforeLookahead = GetNamedTimeZonePreviousTransition(id, lookahead);
    if (prevBeforeLookahead === null || prevBeforeLookahead.lt(now)) {
      return prevBeforeLookahead;
    }
  }

  // We assume most time zones either have regular DST rules that extend
  // indefinitely into the future, or they have no DST transitions between now
  // and next year. Africa/Casablanca and Africa/El_Aaiun are unique cases
  // that fit neither of these. Their irregular DST transitions are
  // precomputed until 2087 in the current time zone database, so requesting
  // the previous transition for an instant far in the future may take an
  // extremely long time as it loops backward 2 weeks at a time.
  if (id === 'Africa/Casablanca' || id === 'Africa/El_Aaiun') {
    const lastPrecomputed = GetSlot(ToTemporalInstant('2088-01-01T00Z'), EPOCHNANOSECONDS);
    if (lastPrecomputed.lesser(epochNanoseconds)) {
      return GetNamedTimeZonePreviousTransition(id, lastPrecomputed);
    }
  }

  let rightNanos = bigInt(epochNanoseconds).minus(1);
  if (rightNanos.lesser(BEFORE_FIRST_DST)) return null;
  let rightOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, rightNanos);
  let leftNanos = rightNanos;
  let leftOffsetNs = rightOffsetNs;
  while (rightOffsetNs === leftOffsetNs && bigInt(rightNanos).compare(BEFORE_FIRST_DST) === 1) {
    leftNanos = bigInt(rightNanos).minus(bigInt(DAY_NANOS).multiply(2 * 7));
    if (leftNanos.lesser(BEFORE_FIRST_DST)) return null;
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

// The goal of this function is to find the exact time(s) that correspond to a
// calendar date and clock time in a particular time zone. Normally there will
// be only one match. But for repeated clock times after backwards transitions
// (like when DST ends) there may be two matches. And for skipped clock times
// after forward transitions, there will be no matches.
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
  // Get the offset of one day before and after the requested calendar date and
  // clock time, avoiding overflows if near the edge of the Instant range.
  let ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  let nsEarlier = ns.minus(DAY_NANOS);
  if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
  let nsLater = ns.plus(DAY_NANOS);
  if (nsLater.greater(NS_MAX)) nsLater = ns;
  const earlierOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, nsEarlier);
  const laterOffsetNs = GetNamedTimeZoneOffsetNanoseconds(id, nsLater);

  // If before and after offsets are the same, then we assume there was no
  // offset transition in between, and therefore only one exact time can
  // correspond to the provided calendar date and clock time. But if they're
  // different, then there was an offset transition in between, so test both
  // offsets to see which one(s) will yield a matching exact time.
  const found = earlierOffsetNs === laterOffsetNs ? [earlierOffsetNs] : [earlierOffsetNs, laterOffsetNs];
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

  // The pattern of leap years in the ISO 8601 calendar repeats every 400
  // years. So if we have more than 400 years in days, there's no need to
  // convert days to a year 400 times. We can convert a multiple of 400 all at
  // once.
  const daysIn400YearCycle = 400 * 365 + 97;
  if (MathAbs(day) > daysIn400YearCycle) {
    const nCycles = MathTrunc(day / daysIn400YearCycle);
    year += 400 * nCycles;
    day -= nCycles * daysIn400YearCycle;
  }

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

export function NormalizedTimeDurationToDays(norm, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime) {
  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const sign = norm.sign();
  if (sign === 0) return { days: 0, norm, dayLengthNs: DAY_NANOS };

  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
  const start = GetSlot(zonedRelativeTo, INSTANT);
  const endNs = norm.addToEpochNs(startNs);
  const end = new TemporalInstant(endNs);
  const calendar = GetSlot(zonedRelativeTo, CALENDAR);

  // Find the difference in days only. Inline DifferenceISODateTime because we
  // don't need the path that potentially calls calendar methods.
  const dtStart = precalculatedPlainDateTime ?? GetPlainDateTimeFor(timeZoneRec, start, 'iso8601');
  const dtEnd = GetPlainDateTimeFor(timeZoneRec, end, 'iso8601');
  const date1 = TemporalDateTimeToDate(dtStart);
  const date2 = TemporalDateTimeToDate(dtEnd);
  let days = DaysUntil(date1, date2);

  const timeSign = CompareTemporalTime(
    GetSlot(dtStart, ISO_HOUR),
    GetSlot(dtStart, ISO_MINUTE),
    GetSlot(dtStart, ISO_SECOND),
    GetSlot(dtStart, ISO_MILLISECOND),
    GetSlot(dtStart, ISO_MICROSECOND),
    GetSlot(dtStart, ISO_NANOSECOND),
    GetSlot(dtEnd, ISO_HOUR),
    GetSlot(dtEnd, ISO_MINUTE),
    GetSlot(dtEnd, ISO_SECOND),
    GetSlot(dtEnd, ISO_MILLISECOND),
    GetSlot(dtEnd, ISO_MICROSECOND),
    GetSlot(dtEnd, ISO_NANOSECOND)
  );

  if (days > 0 && timeSign > 0) {
    days--;
  } else if (days < 0 && timeSign < 0) {
    days++;
  }

  let relativeResult = AddDaysToZonedDateTime(start, dtStart, timeZoneRec, calendar, days);
  // may disambiguate

  // If clock time after addition was in the middle of a skipped period, the
  // endpoint was disambiguated to a later clock time. So it's possible that
  // the resulting disambiguated result is later than endNs. If so, then back
  // up one day and try again. Repeat if necessary (some transitions are
  // > 24 hours) until either there's zero days left or the date duration is
  // back inside the period where it belongs. Note that this case only can
  // happen for positive durations because the only direction that
  // `disambiguation: 'compatible'` can change clock time is forwards.
  if (sign === 1 && days > 0 && relativeResult.epochNs.greater(endNs)) {
    days--;
    relativeResult = AddDaysToZonedDateTime(start, dtStart, timeZoneRec, calendar, days);
    // may do disambiguation
    if (days > 0 && relativeResult.epochNs.greater(endNs)) {
      throw new RangeError('inconsistent result from custom time zone getInstantFor()');
    }
  }
  norm = TimeDuration.fromEpochNsDiff(endNs, relativeResult.epochNs);

  // calculate length of the next day (day that contains the time remainder)
  let oneDayFarther = AddDaysToZonedDateTime(
    relativeResult.instant,
    relativeResult.dateTime,
    timeZoneRec,
    calendar,
    sign
  );
  let dayLengthNs = TimeDuration.fromEpochNsDiff(oneDayFarther.epochNs, relativeResult.epochNs);
  const oneDayLess = norm.subtract(dayLengthNs);
  let isOverflow = oneDayLess.sign() * sign >= 0;
  if (isOverflow) {
    norm = oneDayLess;
    relativeResult = oneDayFarther;
    days += sign;

    // ensure there was no more overflow
    oneDayFarther = AddDaysToZonedDateTime(
      relativeResult.instant,
      relativeResult.dateTime,
      timeZoneRec,
      calendar,
      sign
    );

    dayLengthNs = TimeDuration.fromEpochNsDiff(oneDayFarther.epochNs, relativeResult.epochNs);
    isOverflow = norm.subtract(dayLengthNs).sign() * sign >= 0;
    if (isOverflow) throw new RangeError('inconsistent result from custom time zone getPossibleInstantsFor()');
  }
  if (days !== 0 && MathSign(days) != sign) {
    throw new RangeError('Time zone or calendar converted nanoseconds into a number of days with the opposite sign');
  }
  if (sign === -1) {
    if (norm.sign() === 1) {
      throw new RangeError('Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign');
    }
  } else if (norm.sign() === -1) {
    throw new Error('assert not reached');
  }
  if (norm.abs().cmp(dayLengthNs.abs()) >= 0) {
    throw new Error('assert not reached');
  }
  const daylen = dayLengthNs.abs().totalNs.toJSNumber();
  if (!NumberIsSafeInteger(daylen)) {
    const h = daylen / 3600e9;
    throw new RangeError(`Time zone calculated a day length of ${h} h, longer than ~2502 h causes precision loss`);
  }
  if (MathAbs(days) > NumberMaxSafeInteger / 86400) throw new Error('assert not reached');
  return { days, norm, dayLengthNs: daylen };
}

export function BalanceTimeDuration(norm, largestUnit) {
  const sign = norm.sign();
  let nanoseconds = norm.abs().subsec;
  let microseconds = 0;
  let milliseconds = 0;
  let seconds = norm.abs().sec;
  let minutes = 0;
  let hours = 0;
  let days = 0;

  switch (largestUnit) {
    case 'year':
    case 'month':
    case 'week':
    case 'day':
      microseconds = MathTrunc(nanoseconds / 1000);
      nanoseconds %= 1000;
      milliseconds = MathTrunc(microseconds / 1000);
      microseconds %= 1000;
      seconds += MathTrunc(milliseconds / 1000);
      milliseconds %= 1000;
      minutes = MathTrunc(seconds / 60);
      seconds %= 60;
      hours = MathTrunc(minutes / 60);
      minutes %= 60;
      days = MathTrunc(hours / 24);
      hours %= 24;
      break;
    case 'hour':
      microseconds = MathTrunc(nanoseconds / 1000);
      nanoseconds %= 1000;
      milliseconds = MathTrunc(microseconds / 1000);
      microseconds %= 1000;
      seconds += MathTrunc(milliseconds / 1000);
      milliseconds %= 1000;
      minutes = MathTrunc(seconds / 60);
      seconds %= 60;
      hours = MathTrunc(minutes / 60);
      minutes %= 60;
      break;
    case 'minute':
      microseconds = MathTrunc(nanoseconds / 1000);
      nanoseconds %= 1000;
      milliseconds = MathTrunc(microseconds / 1000);
      microseconds %= 1000;
      seconds += MathTrunc(milliseconds / 1000);
      milliseconds %= 1000;
      minutes = MathTrunc(seconds / 60);
      seconds %= 60;
      break;
    case 'second':
      microseconds = MathTrunc(nanoseconds / 1000);
      nanoseconds %= 1000;
      milliseconds = MathTrunc(microseconds / 1000);
      microseconds %= 1000;
      seconds += MathTrunc(milliseconds / 1000);
      milliseconds %= 1000;
      break;
    case 'millisecond':
      microseconds = MathTrunc(nanoseconds / 1000);
      nanoseconds %= 1000;
      milliseconds = FMAPowerOf10(seconds, 3, MathTrunc(microseconds / 1000));
      microseconds %= 1000;
      seconds = 0;
      break;
    case 'microsecond':
      microseconds = FMAPowerOf10(seconds, 6, MathTrunc(nanoseconds / 1000));
      nanoseconds %= 1000;
      seconds = 0;
      break;
    case 'nanosecond':
      nanoseconds = FMAPowerOf10(seconds, 9, nanoseconds);
      seconds = 0;
      break;
    default:
      throw new Error('assert not reached');
  }

  days *= sign;
  hours *= sign;
  minutes *= sign;
  seconds *= sign;
  milliseconds *= sign;
  microseconds *= sign;
  nanoseconds *= sign;

  RejectDuration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function BalanceTimeDurationRelative(
  days,
  norm,
  largestUnit,
  zonedRelativeTo,
  timeZoneRec,
  precalculatedPlainDateTime
) {
  const startNs = GetSlot(zonedRelativeTo, EPOCHNANOSECONDS);
  const startInstant = GetSlot(zonedRelativeTo, INSTANT);

  let intermediateNs = startNs;
  if (days !== 0) {
    precalculatedPlainDateTime ??= GetPlainDateTimeFor(timeZoneRec, startInstant, 'iso8601');
    intermediateNs = AddDaysToZonedDateTime(
      startInstant,
      precalculatedPlainDateTime,
      timeZoneRec,
      'iso8601',
      days
    ).epochNs;
  }

  const endNs = AddInstant(intermediateNs, norm);
  norm = TimeDuration.fromEpochNsDiff(endNs, startNs);
  if (norm.isZero()) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  }

  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
    precalculatedPlainDateTime ??= GetPlainDateTimeFor(timeZoneRec, startInstant, 'iso8601');
    ({ days, norm } = NormalizedTimeDurationToDays(norm, zonedRelativeTo, timeZoneRec, precalculatedPlainDateTime));
    largestUnit = 'hour';
  } else {
    days = 0;
  }

  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, largestUnit);
  return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function UnbalanceDateDurationRelative(years, months, weeks, days, largestUnit, plainRelativeTo, calendarRec) {
  // calendarRec must have looked up dateAdd and dateUntil
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  const defaultLargestUnit = DefaultTemporalLargestUnit(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const effectiveLargestUnit = LargerOfTwoTemporalUnits(largestUnit, 'day');
  if (LargerOfTwoTemporalUnits(defaultLargestUnit, effectiveLargestUnit) === effectiveLargestUnit) {
    // no-op
    return { years, months, weeks, days };
  }
  if (!calendarRec) throw new RangeError(`a starting point is required for ${largestUnit}s balancing`);

  switch (effectiveLargestUnit) {
    case 'year':
      throw new Error('assert not reached');
    case 'month': {
      // balance years down to months
      const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years));
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'month';
      const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
      const yearsInMonths = GetSlot(untilResult, MONTHS);
      return { years: 0, months: months + yearsInMonths, weeks, days };
    }
    case 'week': {
      // balance years and months down to days
      const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years, months));
      const yearsMonthsInDays = DaysUntil(plainRelativeTo, later);
      return { years: 0, months: 0, weeks, days: days + yearsMonthsInDays };
    }
    default: {
      // largestUnit is "day", or any time unit
      // balance years, months, and weeks down to days
      const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years, months, weeks));
      const yearsMonthsWeeksInDays = DaysUntil(plainRelativeTo, later);
      return { years: 0, months: 0, weeks: 0, days: days + yearsMonthsWeeksInDays };
    }
  }
}

export function BalanceDateDurationRelative(
  years,
  months,
  weeks,
  days,
  largestUnit,
  smallestUnit,
  plainRelativeTo,
  calendarRec
) {
  // calendarRec must have looked up dateAdd and dateUntil
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');

  // If no nonzero calendar units, then there's nothing to balance.
  // If largestUnit is 'day' or lower, then the balance is a no-op.
  // In both cases, return early. Anything after this requires a calendar.
  if (
    (years === 0 && months === 0 && weeks === 0 && days === 0) ||
    (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week')
  ) {
    return { years, months, weeks, days };
  }

  if (!plainRelativeTo) throw new RangeError(`a starting point is required for ${largestUnit}s balancing`);

  const untilOptions = ObjectCreate(null);
  untilOptions.largestUnit = largestUnit;

  switch (largestUnit) {
    case 'year': {
      // There is a special case for smallestUnit === week, because months and
      // years aren't equal to an integer number of weeks. We don't want "1 year
      // and 5 weeks" to balance to "1 year, 1 month, and 5 days" which would
      // contravene the requested smallestUnit.
      if (smallestUnit === 'week') {
        // balance months up to years
        const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(years, months));
        const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
        return {
          years: GetSlot(untilResult, YEARS),
          months: GetSlot(untilResult, MONTHS),
          weeks,
          days: 0
        };
      }
      // balance weeks, months and days up to years
      const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(years, months, weeks, days));
      const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
      return {
        years: GetSlot(untilResult, YEARS),
        months: GetSlot(untilResult, MONTHS),
        weeks: GetSlot(untilResult, WEEKS),
        days: GetSlot(untilResult, DAYS)
      };
    }
    case 'month': {
      // Same special case for rounding to weeks as above; in this case we
      // don't need to balance.
      if (smallestUnit === 'week') {
        return { years: 0, months, weeks, days: 0 };
      }
      // balance weeks and days up to months
      const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(0, months, weeks, days));
      const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
      return {
        years: 0,
        months: GetSlot(untilResult, MONTHS),
        weeks: GetSlot(untilResult, WEEKS),
        days: GetSlot(untilResult, DAYS)
      };
    }
    case 'week': {
      // balance days up to weeks
      const later = AddDate(calendarRec, plainRelativeTo, new TemporalDuration(0, 0, weeks, days));
      const untilResult = CalendarDateUntil(calendarRec, plainRelativeTo, later, untilOptions);
      return {
        years: 0,
        months: 0,
        weeks: GetSlot(untilResult, WEEKS),
        days: GetSlot(untilResult, DAYS)
      };
    }
    default:
    // not reached
  }
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
  const ns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  if (ns.lesser(DATETIME_NS_MIN) || ns.greater(DATETIME_NS_MAX)) {
    // Because PlainDateTime's range is wider than Instant's range, the line
    // below will always throw. Calling `ValidateEpochNanoseconds` avoids
    // repeating the same error message twice.
    ValidateEpochNanoseconds(ns);
  }
}

// In the spec, IsValidEpochNanoseconds returns a boolean and call sites are
// responsible for throwing. In the polyfill, ValidateEpochNanoseconds takes its
// place so that we can DRY the throwing code.
export function ValidateEpochNanoseconds(epochNanoseconds) {
  if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
    throw new RangeError('date/time value is outside of supported range');
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
  if (MathAbs(y) >= 2 ** 32 || MathAbs(mon) >= 2 ** 32 || MathAbs(w) >= 2 ** 32) {
    throw new RangeError('years, months, and weeks must be < 2³²');
  }
  const msResult = TruncatingDivModByPowerOf10(ms, 3);
  const µsResult = TruncatingDivModByPowerOf10(µs, 6);
  const nsResult = TruncatingDivModByPowerOf10(ns, 9);
  const remainderSec = TruncatingDivModByPowerOf10(msResult.mod * 1e6 + µsResult.mod * 1e3 + nsResult.mod, 9).div;
  const totalSec = d * 86400 + h * 3600 + min * 60 + s + msResult.div + µsResult.div + nsResult.div + remainderSec;
  if (!NumberIsSafeInteger(totalSec)) {
    throw new RangeError('total of duration time units cannot exceed 9007199254740991.999999999 s');
  }
}

function ISODateSurpasses(sign, y1, m1, d1, y2, m2, d2) {
  const cmp = CompareISODate(y1, m1, d1, y2, m2, d2);
  return sign * cmp === 1;
}

function CombineDateAndNormalizedTimeDuration(y, m, w, d, norm) {
  const dateSign = DurationSign(y, m, w, d, 0, 0, 0, 0, 0, 0);
  const timeSign = norm.sign();
  if (dateSign !== 0 && timeSign !== 0 && dateSign !== timeSign) {
    throw new RangeError('mixed-sign values not allowed as duration fields');
  }
}

function ISODateToEpochDays(y, m, d) {
  // This is inefficient, but we use GetUTCEpochNanoseconds to avoid duplicating
  // the workarounds for legacy Date. (see that function for explanation)
  return GetUTCEpochNanoseconds(y, m, d, 0, 0, 0, 0, 0, 0).divide(DAY_NANOS).toJSNumber();
}

export function DifferenceISODate(y1, m1, d1, y2, m2, d2, largestUnit = 'days') {
  const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
  if (sign === 0) return { years: 0, months: 0, weeks: 0, days: 0 };

  let years = 0;
  let months = 0;
  let intermediate;
  if (largestUnit === 'year' || largestUnit === 'month') {
    // We can skip right to the neighbourhood of the correct number of years,
    // it'll be at least one less than y2 - y1 (unless it's zero)
    let candidateYears = y2 - y1;
    if (candidateYears !== 0) candidateYears -= sign;
    // loops at most twice
    while (!ISODateSurpasses(sign, y1 + candidateYears, m1, d1, y2, m2, d2)) {
      years = candidateYears;
      candidateYears += sign;
    }

    let candidateMonths = sign;
    intermediate = BalanceISOYearMonth(y1 + years, m1 + candidateMonths);
    // loops at most 12 times
    while (!ISODateSurpasses(sign, intermediate.year, intermediate.month, d1, y2, m2, d2)) {
      months = candidateMonths;
      candidateMonths += sign;
      intermediate = BalanceISOYearMonth(intermediate.year, intermediate.month + sign);
    }

    if (largestUnit === 'month') {
      months += years * 12;
      years = 0;
    }
  }

  intermediate = BalanceISOYearMonth(y1 + years, m1 + months);
  const constrained = ConstrainISODate(intermediate.year, intermediate.month, d1);

  let weeks = 0;
  let days = ISODateToEpochDays(y2, m2, d2) - ISODateToEpochDays(constrained.year, constrained.month, constrained.day);

  if (largestUnit === 'week') {
    weeks = MathTrunc(days / 7);
    days %= 7;
  }

  return { years, months, weeks, days };
}

export function DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
  const hours = h2 - h1;
  const minutes = min2 - min1;
  const seconds = s2 - s1;
  const milliseconds = ms2 - ms1;
  const microseconds = µs2 - µs1;
  const nanoseconds = ns2 - ns1;
  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);

  if (norm.abs().sec >= 86400) throw new Error('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');

  return norm;
}

export function DifferenceInstant(ns1, ns2, increment, smallestUnit, roundingMode) {
  const diff = TimeDuration.fromEpochNsDiff(ns2, ns1);
  if (smallestUnit === 'nanosecond' && increment === 1) return diff;

  return RoundDuration(0, 0, 0, 0, diff, increment, smallestUnit, roundingMode).norm;
}

export function DifferenceDate(calendarRec, plainDate1, plainDate2, options) {
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(plainDate1, ISO_YEAR) === GetSlot(plainDate2, ISO_YEAR) &&
    GetSlot(plainDate1, ISO_MONTH) === GetSlot(plainDate2, ISO_MONTH) &&
    GetSlot(plainDate1, ISO_DAY) === GetSlot(plainDate2, ISO_DAY)
  ) {
    return new TemporalDuration();
  }
  if (options.largestUnit === 'day') {
    return new TemporalDuration(0, 0, 0, DaysUntil(plainDate1, plainDate2));
  }
  return CalendarDateUntil(calendarRec, plainDate1, plainDate2, options);
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
  calendarRec,
  largestUnit,
  options
) {
  // dateUntil must be looked up if date parts are not identical and largestUnit
  // is greater than 'day'
  let timeDuration = DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);

  const timeSign = timeDuration.sign();
  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);
  if (dateSign === -timeSign) {
    ({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 - timeSign));
    timeDuration = timeDuration.add24HourDays(-timeSign);
  }

  const date1 = CreateTemporalDate(y1, mon1, d1, calendarRec.receiver);
  const date2 = CreateTemporalDate(y2, mon2, d2, calendarRec.receiver);
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const untilOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  untilOptions.largestUnit = dateLargestUnit;
  const untilResult = DifferenceDate(calendarRec, date1, date2, untilOptions);
  const years = GetSlot(untilResult, YEARS);
  const months = GetSlot(untilResult, MONTHS);
  const weeks = GetSlot(untilResult, WEEKS);
  const days = GetSlot(untilResult, DAYS);
  return { years, months, weeks, days, norm: timeDuration };
}

export function DifferenceZonedDateTime(
  ns1,
  ns2,
  timeZoneRec,
  calendarRec,
  largestUnit,
  options,
  precalculatedDtStart = undefined
) {
  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
  // dateAdd must be looked up if the instants are not identical (and the date
  // difference has no years, months, or weeks, which can't be determined)
  // dateUntil must be looked up if the instants are not identical, the date
  // parts are not identical, and largestUnit is greater than 'day'
  const nsDiff = ns2.subtract(ns1);
  if (nsDiff.isZero()) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      norm: TimeDuration.ZERO
    };
  }

  // Find the difference in dates only.
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const start = new TemporalInstant(ns1);
  const end = new TemporalInstant(ns2);
  const dtStart = precalculatedDtStart ?? GetPlainDateTimeFor(timeZoneRec, start, calendarRec.receiver);
  const dtEnd = GetPlainDateTimeFor(timeZoneRec, end, calendarRec.receiver);

  let { years, months, weeks } = DifferenceISODateTime(
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
    calendarRec,
    largestUnit,
    options
  );
  let intermediateNs = AddZonedDateTime(
    start,
    timeZoneRec,
    calendarRec,
    years,
    months,
    weeks,
    0,
    TimeDuration.ZERO,
    dtStart
  );
  // may disambiguate

  let norm = TimeDuration.fromEpochNsDiff(ns2, intermediateNs);
  const intermediate = CreateTemporalZonedDateTime(intermediateNs, timeZoneRec.receiver, calendarRec.receiver);
  let days;
  ({ norm, days } = NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec));

  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
  return { years, months, weeks, days, norm };
}

export function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
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

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'second');

  const onens = GetSlot(instant, EPOCHNANOSECONDS);
  const twons = GetSlot(other, EPOCHNANOSECONDS);
  const norm = DifferenceInstant(
    onens,
    twons,
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  );
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
    norm,
    settings.largestUnit
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
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', [], 'day', 'day');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(plainDate, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(plainDate, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(plainDate, ISO_DAY) === GetSlot(other, ISO_DAY)
  ) {
    return new Duration();
  }

  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);

  resolvedOptions.largestUnit = settings.largestUnit;
  const untilResult = DifferenceDate(calendarRec, plainDate, other, resolvedOptions);
  let years = GetSlot(untilResult, YEARS);
  let months = GetSlot(untilResult, MONTHS);
  let weeks = GetSlot(untilResult, WEEKS);
  let days = GetSlot(untilResult, DAYS);

  const roundingIsNoop = settings.smallestUnit === 'day' && settings.roundingIncrement === 1;
  if (!roundingIsNoop) {
    ({ years, months, weeks, days } = RoundDuration(
      years,
      months,
      weeks,
      days,
      TimeDuration.ZERO,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode,
      plainDate,
      calendarRec
    ));
    ({ years, months, weeks, days } = BalanceDateDurationRelative(
      years,
      months,
      weeks,
      days,
      settings.largestUnit,
      settings.smallestUnit,
      plainDate,
      calendarRec
    ));
  }

  return new Duration(sign * years, sign * months, sign * weeks, sign * days, 0, 0, 0, 0, 0, 0);
}

export function DifferenceTemporalPlainDateTime(operation, plainDateTime, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalDateTime(other);
  const calendar = GetSlot(plainDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'day');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  const datePartsIdentical =
    GetSlot(plainDateTime, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(plainDateTime, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(plainDateTime, ISO_DAY) === GetSlot(other, ISO_DAY);
  if (
    datePartsIdentical &&
    GetSlot(plainDateTime, ISO_HOUR) == GetSlot(other, ISO_HOUR) &&
    GetSlot(plainDateTime, ISO_MINUTE) == GetSlot(other, ISO_MINUTE) &&
    GetSlot(plainDateTime, ISO_SECOND) == GetSlot(other, ISO_SECOND) &&
    GetSlot(plainDateTime, ISO_MILLISECOND) == GetSlot(other, ISO_MILLISECOND) &&
    GetSlot(plainDateTime, ISO_MICROSECOND) == GetSlot(other, ISO_MICROSECOND) &&
    GetSlot(plainDateTime, ISO_NANOSECOND) == GetSlot(other, ISO_NANOSECOND)
  ) {
    return new Duration();
  }

  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);

  let { years, months, weeks, days, norm } = DifferenceISODateTime(
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
    calendarRec,
    settings.largestUnit,
    resolvedOptions
  );

  let hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
  const roundingIsNoop = settings.smallestUnit === 'nanosecond' && settings.roundingIncrement === 1;
  if (!roundingIsNoop) {
    const relativeTo = TemporalDateTimeToDate(plainDateTime);
    ({ years, months, weeks, days, norm } = RoundDuration(
      years,
      months,
      weeks,
      days,
      norm,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode,
      relativeTo,
      calendarRec
    ));
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm.add24HourDays(days),
      settings.largestUnit
    ));
    ({ years, months, weeks, days } = BalanceDateDurationRelative(
      years,
      months,
      weeks,
      days,
      settings.largestUnit,
      settings.smallestUnit,
      relativeTo,
      calendarRec
    ));
  } else {
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm.add24HourDays(days),
      settings.largestUnit
    ));
  }

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

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');

  let norm = DifferenceTime(
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
  if (settings.smallestUnit !== 'nanosecond' || settings.roundingIncrement !== 1) {
    ({ norm } = RoundDuration(
      0,
      0,
      0,
      0,
      norm,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ));
  }
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
    norm,
    settings.largestUnit
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

export function DifferenceTemporalPlainYearMonth(operation, yearMonth, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalYearMonth(other);
  const calendar = GetSlot(yearMonth, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between months');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', ['week', 'day'], 'month', 'year');
  resolvedOptions.largestUnit = settings.largestUnit;

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(yearMonth, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(yearMonth, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(yearMonth, ISO_DAY) === GetSlot(other, ISO_DAY)
  ) {
    return new Duration();
  }

  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateFromFields', 'dateUntil', 'fields']);

  const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
  const thisFields = PrepareTemporalFields(yearMonth, fieldNames, []);
  thisFields.day = 1;
  const thisDate = CalendarDateFromFields(calendarRec, thisFields);
  const otherFields = PrepareTemporalFields(other, fieldNames, []);
  otherFields.day = 1;
  const otherDate = CalendarDateFromFields(calendarRec, otherFields);

  resolvedOptions.largestUnit = settings.largestUnit;
  let { years, months } = CalendarDateUntil(calendarRec, thisDate, otherDate, resolvedOptions);

  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
    ({ years, months } = RoundDuration(
      years,
      months,
      0,
      0,
      TimeDuration.ZERO,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode,
      thisDate,
      calendarRec
    ));
    ({ years, months } = BalanceDateDurationRelative(
      years,
      months,
      0,
      0,
      settings.largestUnit,
      settings.smallestUnit,
      thisDate,
      calendarRec
    ));
  }

  return new Duration(sign * years, sign * months, 0, 0, 0, 0, 0, 0, 0, 0);
}

export function DifferenceTemporalZonedDateTime(operation, zonedDateTime, other, options) {
  const sign = operation === 'since' ? -1 : 1;
  other = ToTemporalZonedDateTime(other);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'hour');

  const ns1 = GetSlot(zonedDateTime, EPOCHNANOSECONDS);
  const ns2 = GetSlot(other, EPOCHNANOSECONDS);

  const Duration = GetIntrinsic('%Temporal.Duration%');

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
    const norm = DifferenceInstant(ns1, ns2, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode);
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm,
      settings.largestUnit
    ));
  } else {
    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
      throw new RangeError(
        "When calculating difference between time zones, largestUnit must be 'hours' " +
          'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
      );
    }

    if (ns1.equals(ns2)) return new Duration();

    const timeZoneRec = new TimeZoneMethodRecord(timeZone, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
    // dateAdd and dateUntil may not be needed if the two exact times resolve to
    // the same wall-clock time in the time zone, but there's no way to predict
    // that in advance
    const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);

    const precalculatedPlainDateTime = GetPlainDateTimeFor(
      timeZoneRec,
      GetSlot(zonedDateTime, INSTANT),
      calendarRec.receiver
    );
    const plainRelativeTo = TemporalDateTimeToDate(precalculatedPlainDateTime);

    resolvedOptions.largestUnit = settings.largestUnit;
    let norm;
    ({ years, months, weeks, days, norm } = DifferenceZonedDateTime(
      ns1,
      ns2,
      timeZoneRec,
      calendarRec,
      settings.largestUnit,
      resolvedOptions,
      precalculatedPlainDateTime
    ));

    const roundingIsNoop = settings.smallestUnit === 'nanosecond' && settings.roundingIncrement === 1;
    if (!roundingIsNoop) {
      ({ years, months, weeks, days, norm } = RoundDuration(
        years,
        months,
        weeks,
        days,
        norm,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode,
        plainRelativeTo,
        calendarRec,
        zonedDateTime,
        timeZoneRec,
        precalculatedPlainDateTime
      ));
      let deltaDays;
      ({ days: deltaDays, norm } = NormalizedTimeDurationToDays(norm, zonedDateTime, timeZoneRec));
      days += deltaDays;
      ({ years, months, weeks, days, norm } = AdjustRoundedDurationDays(
        years,
        months,
        weeks,
        days,
        norm,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode,
        zonedDateTime,
        calendarRec,
        timeZoneRec,
        precalculatedPlainDateTime
      ));
      // BalanceTimeDuration already performed in AdjustRoundedDurationDays
      ({ years, months, weeks, days } = BalanceDateDurationRelative(
        years,
        months,
        weeks,
        days,
        settings.largestUnit,
        settings.smallestUnit,
        plainRelativeTo,
        calendarRec
      ));
      CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
    }
    ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, 'hour'));
  }

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

export function AddDate(calendarRec, plainDate, duration, options = undefined) {
  // dateAdd must be looked up
  const years = GetSlot(duration, YEARS);
  const months = GetSlot(duration, MONTHS);
  const weeks = GetSlot(duration, WEEKS);
  if (years !== 0 || months !== 0 || weeks !== 0) {
    return CalendarDateAdd(calendarRec, plainDate, duration, options);
  }

  // Fast path skipping the calendar call if we are only adding days
  let year = GetSlot(plainDate, ISO_YEAR);
  let month = GetSlot(plainDate, ISO_MONTH);
  let day = GetSlot(plainDate, ISO_DAY);
  const overflow = ToTemporalOverflow(options);
  const norm = TimeDuration.normalize(
    GetSlot(duration, HOURS),
    GetSlot(duration, MINUTES),
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  );
  const days = GetSlot(duration, DAYS) + BalanceTimeDuration(norm, 'day').days;
  ({ year, month, day } = AddISODate(year, month, day, 0, 0, 0, days, overflow));
  return CreateTemporalDate(year, month, day, calendarRec.receiver);
}

export function AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm) {
  second += norm.sec;
  nanosecond += norm.subsec;
  return BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
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
  plainRelativeTo,
  zonedRelativeTo,
  calendarRec,
  timeZoneRec,
  precalculatedPlainDateTime
) {
  // dateAdd must be looked up if zonedRelativeTo or plainRelativeTo not
  // undefined, and years...weeks != 0 in either duration
  // dateUntil must additionally be looked up if duration 2 not zero
  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1, ns1);
  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2, ns2);
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);

  let years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
  if (!zonedRelativeTo && !plainRelativeTo) {
    if (IsCalendarUnit(largestUnit)) {
      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
    }
    years = months = weeks = 0;
    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm1.add(norm2).add24HourDays(d1 + d2),
      largestUnit
    ));
  } else if (plainRelativeTo) {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');

    const dateDuration1 = new TemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
    const dateDuration2 = new TemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
    const intermediate = AddDate(calendarRec, plainRelativeTo, dateDuration1);
    const end = AddDate(calendarRec, intermediate, dateDuration2);

    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
    const differenceOptions = ObjectCreate(null);
    differenceOptions.largestUnit = dateLargestUnit;
    const untilResult = DifferenceDate(calendarRec, plainRelativeTo, end, differenceOptions);
    years = GetSlot(untilResult, YEARS);
    months = GetSlot(untilResult, MONTHS);
    weeks = GetSlot(untilResult, WEEKS);
    days = GetSlot(untilResult, DAYS);
    // Signs of date part and time part may not agree; balance them together
    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm1.add(norm2).add24HourDays(days),
      largestUnit
    ));
  } else {
    // zonedRelativeTo is defined
    const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
    const calendar = GetSlot(zonedRelativeTo, CALENDAR);
    const startInstant = GetSlot(zonedRelativeTo, INSTANT);
    let startDateTime = precalculatedPlainDateTime;
    if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
      startDateTime ??= GetPlainDateTimeFor(timeZoneRec, startInstant, calendar);
    }
    const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
    const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
    const intermediateNs = AddZonedDateTime(
      startInstant,
      timeZoneRec,
      calendarRec,
      y1,
      mon1,
      w1,
      d1,
      norm1,
      startDateTime
    );
    const endNs = AddZonedDateTime(
      new TemporalInstant(intermediateNs),
      timeZoneRec,
      calendarRec,
      y2,
      mon2,
      w2,
      d2,
      norm2
    );
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0;
      months = 0;
      weeks = 0;
      days = 0;
      const norm = TimeDuration.fromEpochNsDiff(endNs, GetSlot(zonedRelativeTo, EPOCHNANOSECONDS));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, largestUnit));
    } else {
      let norm;
      ({ years, months, weeks, days, norm } = DifferenceZonedDateTime(
        GetSlot(zonedRelativeTo, EPOCHNANOSECONDS),
        endNs,
        timeZoneRec,
        calendarRec,
        largestUnit,
        ObjectCreate(null),
        startDateTime
      ));
      ({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, 'hour'));
    }
  }

  return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
}

export function AddInstant(epochNanoseconds, norm) {
  const result = norm.addToEpochNs(epochNanoseconds);
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
  calendarRec,
  years,
  months,
  weeks,
  days,
  norm,
  options
) {
  // dateAdd must be looked up if years, months, weeks != 0
  // Add the time part
  let deltaDays = 0;
  ({ deltaDays, hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    norm
  ));
  days += deltaDays;

  // Delegate the date part addition to the calendar
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  const datePart = CreateTemporalDate(year, month, day, calendarRec.receiver);
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = AddDate(calendarRec, datePart, dateDuration, options);

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
  timeZoneRec,
  calendarRec,
  years,
  months,
  weeks,
  days,
  norm,
  precalculatedPlainDateTime = undefined,
  options = undefined
) {
  // getPossibleInstantsFor must be looked up
  // getOffsetNanosecondsFor must be looked up if precalculatedDateTime is not
  // supplied
  // getOffsetNanosecondsFor may be looked up and timeZoneRec modified, if
  // precalculatedDateTime is supplied but converting to instant requires
  // disambiguation
  // dateAdd must be looked up if years, months, or weeks are not 0

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
    return AddInstant(GetSlot(instant, EPOCHNANOSECONDS), norm);
  }

  const dt = precalculatedPlainDateTime ?? GetPlainDateTimeFor(timeZoneRec, instant, calendarRec.receiver);
  if (DurationSign(years, months, weeks, 0, 0, 0, 0, 0, 0, 0) === 0) {
    const overflow = ToTemporalOverflow(options);
    const intermediate = AddDaysToZonedDateTime(instant, dt, timeZoneRec, calendarRec.receiver, days, overflow).epochNs;
    return AddInstant(intermediate, norm);
  }

  // RFC 5545 requires the date portion to be added in calendar days and the
  // time portion to be added in exact time.
  const datePart = CreateTemporalDate(
    GetSlot(dt, ISO_YEAR),
    GetSlot(dt, ISO_MONTH),
    GetSlot(dt, ISO_DAY),
    calendarRec.receiver
  );
  const dateDuration = new TemporalDuration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendarRec, datePart, dateDuration, options);
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
    calendarRec.receiver
  );

  // Note that 'compatible' is used below because this disambiguation behavior
  // is required by RFC 5545.
  const instantIntermediate = GetInstantFor(timeZoneRec, dtIntermediate, 'compatible');
  return AddInstant(GetSlot(instantIntermediate, EPOCHNANOSECONDS), norm);
}

export function AddDaysToZonedDateTime(instant, dateTime, timeZoneRec, calendar, days, overflow = 'constrain') {
  // getPossibleInstantsFor must be looked up
  // getOffsetNanosecondsFor may be looked up for disambiguation, modifying timeZoneRec

  // Same as AddZonedDateTime above, but an optimized version with fewer
  // observable calls that only adds a number of days. Returns an object with
  // all three versions of the ZonedDateTime: epoch nanoseconds, Instant, and
  // PlainDateTime
  if (days === 0) {
    return { instant, dateTime, epochNs: GetSlot(instant, EPOCHNANOSECONDS) };
  }

  const addedDate = AddISODate(
    GetSlot(dateTime, ISO_YEAR),
    GetSlot(dateTime, ISO_MONTH),
    GetSlot(dateTime, ISO_DAY),
    0,
    0,
    0,
    days,
    overflow
  );
  const dateTimeResult = CreateTemporalDateTime(
    addedDate.year,
    addedDate.month,
    addedDate.day,
    GetSlot(dateTime, ISO_HOUR),
    GetSlot(dateTime, ISO_MINUTE),
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND),
    calendar
  );

  const instantResult = GetInstantFor(timeZoneRec, dateTimeResult, 'compatible');
  return {
    instant: instantResult,
    dateTime: dateTimeResult,
    epochNs: GetSlot(instantResult, EPOCHNANOSECONDS)
  };
}

export function AddDurationToOrSubtractDurationFromDuration(operation, duration, other, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(other);
  options = GetOptionsObject(options);
  const { plainRelativeTo, zonedRelativeTo, timeZoneRec } = ToRelativeTemporalObject(options);

  const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, [
    'dateAdd',
    'dateUntil'
  ]);

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
    plainRelativeTo,
    zonedRelativeTo,
    calendarRec,
    timeZoneRec
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
  const norm = TimeDuration.normalize(
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), norm);
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ns);
}

export function AddDurationToOrSubtractDurationFromPlainDateTime(operation, dateTime, durationLike, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);

  const calendarRec = new CalendarMethodRecord(GetSlot(dateTime, CALENDAR), ['dateAdd']);

  const norm = TimeDuration.normalize(
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
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
    calendarRec,
    sign * years,
    sign * months,
    sign * weeks,
    sign * days,
    norm,
    options
  );
  return CreateTemporalDateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond,
    calendarRec.receiver
  );
}

export function AddDurationToOrSubtractDurationFromPlainTime(operation, temporalTime, durationLike) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToTemporalDurationRecord(durationLike);
  const norm = TimeDuration.normalize(
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
  let { hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
    GetSlot(temporalTime, ISO_HOUR),
    GetSlot(temporalTime, ISO_MINUTE),
    GetSlot(temporalTime, ISO_SECOND),
    GetSlot(temporalTime, ISO_MILLISECOND),
    GetSlot(temporalTime, ISO_MICROSECOND),
    GetSlot(temporalTime, ISO_NANOSECOND),
    norm
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
  options = GetOptionsObject(options);
  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  days += BalanceTimeDuration(norm, 'day').days;
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0, 0, 0);

  const calendarRec = new CalendarMethodRecord(GetSlot(yearMonth, CALENDAR), [
    'dateAdd',
    'dateFromFields',
    'day',
    'fields',
    'yearMonthFromFields'
  ]);

  const fieldNames = CalendarFields(calendarRec, ['monthCode', 'year']);
  const fields = PrepareTemporalFields(yearMonth, fieldNames, []);
  const fieldsCopy = SnapshotOwnProperties(fields, null);
  fields.day = 1;
  let startDate = CalendarDateFromFields(calendarRec, fields);
  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (sign < 0) {
    const oneMonthDuration = new Duration(0, 1, 0, 0, 0, 0, 0, 0, 0, 0);
    const nextMonth = CalendarDateAdd(calendarRec, startDate, oneMonthDuration);
    const endOfMonthISO = AddISODate(
      GetSlot(nextMonth, ISO_YEAR),
      GetSlot(nextMonth, ISO_MONTH),
      GetSlot(nextMonth, ISO_DAY),
      0,
      0,
      0,
      -1,
      'constrain'
    );
    const endOfMonth = CreateTemporalDate(
      endOfMonthISO.year,
      endOfMonthISO.month,
      endOfMonthISO.day,
      calendarRec.receiver
    );
    fieldsCopy.day = CalendarDay(calendarRec, endOfMonth);
    startDate = CalendarDateFromFields(calendarRec, fieldsCopy);
  }
  const durationToAdd = new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
  const optionsCopy = SnapshotOwnProperties(options, null);
  const addedDate = AddDate(calendarRec, startDate, durationToAdd, options);
  const addedDateFields = PrepareTemporalFields(addedDate, fieldNames, []);

  return CalendarYearMonthFromFields(calendarRec, addedDateFields, optionsCopy);
}

export function AddDurationToOrSubtractDurationFromZonedDateTime(operation, zonedDateTime, durationLike, options) {
  const sign = operation === 'subtract' ? -1 : 1;
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);
  const timeZoneRec = new TimeZoneMethodRecord(GetSlot(zonedDateTime, TIME_ZONE), [
    'getOffsetNanosecondsFor',
    'getPossibleInstantsFor'
  ]);
  const calendarRec = new CalendarMethodRecord(GetSlot(zonedDateTime, CALENDAR), ['dateAdd']);
  const norm = TimeDuration.normalize(
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
  const epochNanoseconds = AddZonedDateTime(
    GetSlot(zonedDateTime, INSTANT),
    timeZoneRec,
    calendarRec,
    sign * years,
    sign * months,
    sign * weeks,
    sign * days,
    norm,
    undefined,
    options
  );
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.receiver, calendarRec.receiver);
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

export function RoundJSNumberToIncrement(quantity, increment, mode) {
  let quotient = MathTrunc(quantity / increment);
  const remainder = quantity % increment;
  if (remainder === 0) return quantity;
  const sign = remainder < 0 ? -1 : 1;
  const tiebreaker = MathAbs(remainder * 2);
  const tie = tiebreaker === increment;
  const expandIsNearer = tiebreaker > increment;
  switch (mode) {
    case 'ceil':
      if (sign > 0) quotient += sign;
      break;
    case 'floor':
      if (sign < 0) quotient += sign;
      break;
    case 'expand':
      // always expand if there is a remainder
      quotient += sign;
      break;
    case 'trunc':
      // no change needed, because divmod is a truncation
      break;
    case 'halfCeil':
      if (expandIsNearer || (tie && sign > 0)) quotient += sign;
      break;
    case 'halfFloor':
      if (expandIsNearer || (tie && sign < 0)) quotient += sign;
      break;
    case 'halfExpand':
      // "half up away from zero"
      if (expandIsNearer || tie) quotient += sign;
      break;
    case 'halfTrunc':
      if (expandIsNearer) quotient += sign;
      break;
    case 'halfEven': {
      if (expandIsNearer || (tie && quotient % 2 === 1)) quotient += sign;
      break;
    }
  }
  return quotient * increment;
}

export function RoundInstant(epochNs, increment, unit, roundingMode) {
  let { remainder } = NonNegativeBigIntDivmod(epochNs, DAY_NANOS);
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

export function MoveRelativeDate(calendarRec, relativeTo, duration) {
  // dateAdd must be looked up if years, months, weeks != 0
  const later = AddDate(calendarRec, relativeTo, duration);
  const days = DaysUntil(relativeTo, later);
  return { relativeTo: later, days };
}

export function MoveRelativeZonedDateTime(
  relativeTo,
  calendarRec,
  timeZoneRec,
  years,
  months,
  weeks,
  days,
  precalculatedPlainDateTime
) {
  // getOffsetNanosecondsFor and getPossibleInstantsFor must be looked up
  // dateAdd must be looked up if years, months, weeks != 0
  const intermediateNs = AddZonedDateTime(
    GetSlot(relativeTo, INSTANT),
    timeZoneRec,
    calendarRec,
    years,
    months,
    weeks,
    days,
    TimeDuration.ZERO,
    precalculatedPlainDateTime
  );
  return CreateTemporalZonedDateTime(intermediateNs, timeZoneRec.receiver, calendarRec.receiver);
}

export function AdjustRoundedDurationDays(
  years,
  months,
  weeks,
  days,
  norm,
  increment,
  unit,
  roundingMode,
  zonedRelativeTo,
  calendarRec,
  timeZoneRec,
  precalculatedPlainDateTime
) {
  // both dateAdd and dateUntil must be looked up if unit <= hour, any rounding
  // is requested, and any of years...weeks != 0
  if (IsCalendarUnit(unit) || unit === 'day' || (unit === 'nanosecond' && increment === 1)) {
    return { years, months, weeks, days, norm };
  }

  // There's one more round of rounding possible: if relativeTo is a
  // ZonedDateTime, the time units could have rounded up into enough hours
  // to exceed the day length. If this happens, grow the date part by a
  // single day and re-run exact time rounding on the smaller remainder. DO
  // NOT RECURSE, because once the extra hours are sucked up into the date
  // duration, there's no way for another full day to come from the next
  // round of rounding. And if it were possible (e.g. contrived calendar
  // with 30-minute-long "days") then it'd risk an infinite loop.
  const direction = norm.sign();

  const calendar = GetSlot(zonedRelativeTo, CALENDAR);
  // requires dateAdd if years...weeks != 0
  const dayStart = AddZonedDateTime(
    GetSlot(zonedRelativeTo, INSTANT),
    timeZoneRec,
    calendarRec,
    years,
    months,
    weeks,
    days,
    TimeDuration.ZERO,
    precalculatedPlainDateTime
  );
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const dayStartInstant = new TemporalInstant(dayStart);
  const dayStartDateTime = GetPlainDateTimeFor(timeZoneRec, dayStartInstant, calendar);
  const dayEnd = AddDaysToZonedDateTime(dayStartInstant, dayStartDateTime, timeZoneRec, calendar, direction).epochNs;
  const dayLength = TimeDuration.fromEpochNsDiff(dayEnd, dayStart);

  const oneDayLess = norm.subtract(dayLength);
  if (oneDayLess.sign() * direction >= 0) {
    // requires dateAdd and dateUntil if years...weeks != 0
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
      /* plainRelativeTo = */ undefined,
      zonedRelativeTo,
      calendarRec,
      timeZoneRec,
      precalculatedPlainDateTime
    ));
    ({ norm } = RoundDuration(0, 0, 0, 0, oneDayLess, increment, unit, roundingMode));
  }
  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
  return { years, months, weeks, days, norm };
}

export function RoundDuration(
  years,
  months,
  weeks,
  days,
  norm,
  increment,
  unit,
  roundingMode,
  plainRelativeTo = undefined,
  calendarRec = undefined,
  zonedRelativeTo = undefined,
  timeZoneRec = undefined,
  precalculatedPlainDateTime = undefined
) {
  // dateAdd and dateUntil must be looked up
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');

  if (IsCalendarUnit(unit) && !plainRelativeTo) {
    throw new RangeError(`A starting point is required for ${unit}s rounding`);
  }

  // First convert time units up to days, if rounding to days or higher units.
  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
  let dayLengthNs;
  if (IsCalendarUnit(unit) || unit === 'day') {
    let deltaDays;
    if (zonedRelativeTo) {
      const intermediate = MoveRelativeZonedDateTime(
        zonedRelativeTo,
        calendarRec,
        timeZoneRec,
        years,
        months,
        weeks,
        days,
        precalculatedPlainDateTime
      );
      ({ days: deltaDays, norm, dayLengthNs } = NormalizedTimeDurationToDays(norm, intermediate, timeZoneRec));
    } else {
      ({ quotient: deltaDays, remainder: norm } = norm.divmod(DAY_NANOS));
      dayLengthNs = DAY_NANOS;
    }
    days += deltaDays;
  }

  let total;
  switch (unit) {
    case 'year': {
      // convert months and weeks to days by calculating difference(
      // relativeTo + years, relativeTo + { years, months, weeks })
      const yearsDuration = new TemporalDuration(years);
      const yearsLater = AddDate(calendarRec, plainRelativeTo, yearsDuration);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const yearsMonthsWeeksLater = AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks);
      const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater);
      plainRelativeTo = yearsLater;
      days += monthsWeeksInDays;

      const isoResult = AddISODate(
        GetSlot(plainRelativeTo, ISO_YEAR),
        GetSlot(plainRelativeTo, ISO_MONTH),
        GetSlot(plainRelativeTo, ISO_DAY),
        0,
        0,
        0,
        days,
        'constrain'
      );
      const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'year';
      const yearsPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), YEARS);
      years += yearsPassed;
      const yearsPassedDuration = new TemporalDuration(yearsPassed);
      let daysPassed;
      ({ relativeTo: plainRelativeTo, days: daysPassed } = MoveRelativeDate(
        calendarRec,
        plainRelativeTo,
        yearsPassedDuration
      ));
      days -= daysPassed;
      const oneYear = new TemporalDuration(days < 0 ? -1 : 1);
      let { days: oneYearDays } = MoveRelativeDate(calendarRec, plainRelativeTo, oneYear);

      oneYearDays = MathAbs(oneYearDays);
      if (oneYearDays === 0) throw new RangeError('custom calendar reported that a year is 0 days long');
      total = years + (days + norm.fdiv(dayLengthNs)) / oneYearDays;
      years = RoundJSNumberToIncrement(total, increment, roundingMode);
      months = weeks = days = 0;
      norm = TimeDuration.ZERO;
      break;
    }
    case 'month': {
      // convert weeks to days by calculating difference(relativeTo +
      //   { years, months }, relativeTo + { years, months, weeks })
      const yearsMonths = new TemporalDuration(years, months);
      const yearsMonthsLater = AddDate(calendarRec, plainRelativeTo, yearsMonths);
      const yearsMonthsWeeks = new TemporalDuration(years, months, weeks);
      const yearsMonthsWeeksLater = AddDate(calendarRec, plainRelativeTo, yearsMonthsWeeks);
      const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater);
      plainRelativeTo = yearsMonthsLater;
      days += weeksInDays;

      const isoResult = AddISODate(
        GetSlot(plainRelativeTo, ISO_YEAR),
        GetSlot(plainRelativeTo, ISO_MONTH),
        GetSlot(plainRelativeTo, ISO_DAY),
        0,
        0,
        0,
        days,
        'constrain'
      );
      const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'month';
      const monthsPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), MONTHS);
      months += monthsPassed;
      const monthsPassedDuration = new TemporalDuration(0, monthsPassed);
      let daysPassed;
      ({ relativeTo: plainRelativeTo, days: daysPassed } = MoveRelativeDate(
        calendarRec,
        plainRelativeTo,
        monthsPassedDuration
      ));
      days -= daysPassed;
      const oneMonth = new TemporalDuration(0, days < 0 ? -1 : 1);
      let { days: oneMonthDays } = MoveRelativeDate(calendarRec, plainRelativeTo, oneMonth);

      oneMonthDays = MathAbs(oneMonthDays);
      if (oneMonthDays === 0) throw new RangeError('custom calendar reported that a month is 0 days long');
      total = months + (days + norm.fdiv(dayLengthNs)) / oneMonthDays;
      months = RoundJSNumberToIncrement(total, increment, roundingMode);
      weeks = days = 0;
      norm = TimeDuration.ZERO;
      break;
    }
    case 'week': {
      const isoResult = AddISODate(
        GetSlot(plainRelativeTo, ISO_YEAR),
        GetSlot(plainRelativeTo, ISO_MONTH),
        GetSlot(plainRelativeTo, ISO_DAY),
        0,
        0,
        0,
        days,
        'constrain'
      );
      const wholeDaysLater = CreateTemporalDate(isoResult.year, isoResult.month, isoResult.day, calendarRec.receiver);
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'week';
      const weeksPassed = GetSlot(DifferenceDate(calendarRec, plainRelativeTo, wholeDaysLater, untilOptions), WEEKS);
      weeks += weeksPassed;
      const weeksPassedDuration = new TemporalDuration(0, 0, weeksPassed);
      let daysPassed;
      ({ relativeTo: plainRelativeTo, days: daysPassed } = MoveRelativeDate(
        calendarRec,
        plainRelativeTo,
        weeksPassedDuration
      ));
      days -= daysPassed;
      const oneWeek = new TemporalDuration(0, 0, days < 0 ? -1 : 1);
      let { days: oneWeekDays } = MoveRelativeDate(calendarRec, plainRelativeTo, oneWeek);

      oneWeekDays = MathAbs(oneWeekDays);
      if (oneWeekDays === 0) throw new RangeError('custom calendar reported that a week is 0 days long');
      total = weeks + (days + norm.fdiv(dayLengthNs)) / oneWeekDays;
      weeks = RoundJSNumberToIncrement(total, increment, roundingMode);
      days = 0;
      norm = TimeDuration.ZERO;
      break;
    }
    case 'day': {
      total = days + norm.fdiv(dayLengthNs);
      days = RoundJSNumberToIncrement(total, increment, roundingMode);
      norm = TimeDuration.ZERO;
      break;
    }
    case 'hour': {
      const divisor = 3600e9;
      total = norm.fdiv(divisor);
      norm = norm.round(divisor * increment, roundingMode);
      break;
    }
    case 'minute': {
      const divisor = 60e9;
      total = norm.fdiv(divisor);
      norm = norm.round(divisor * increment, roundingMode);
      break;
    }
    case 'second': {
      const divisor = 1e9;
      total = norm.fdiv(divisor);
      norm = norm.round(divisor * increment, roundingMode);
      break;
    }
    case 'millisecond': {
      const divisor = 1e6;
      total = norm.fdiv(divisor);
      norm = norm.round(divisor * increment, roundingMode);
      break;
    }
    case 'microsecond': {
      const divisor = 1e3;
      total = norm.fdiv(divisor);
      norm = norm.round(divisor * increment, roundingMode);
      break;
    }
    case 'nanosecond': {
      total = norm.totalNs.toJSNumber();
      norm = norm.round(increment, roundingMode);
      break;
    }
  }
  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
  return { years, months, weeks, days, norm, total };
}

export function CompareISODate(y1, m1, d1, y2, m2, d2) {
  if (y1 !== y2) return ComparisonResult(y1 - y2);
  if (m1 !== m2) return ComparisonResult(m1 - m2);
  if (d1 !== d2) return ComparisonResult(d1 - d2);
  return 0;
}

export function CompareTemporalTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2) {
  if (h1 !== h2) return ComparisonResult(h1 - h2);
  if (min1 !== min2) return ComparisonResult(min1 - min2);
  if (s1 !== s2) return ComparisonResult(s1 - s2);
  if (ms1 !== ms2) return ComparisonResult(ms1 - ms2);
  if (µs1 !== µs2) return ComparisonResult(µs1 - µs2);
  if (ns1 !== ns2) return ComparisonResult(ns1 - ns2);
  return 0;
}

export function CompareISODateTime(y1, m1, d1, h1, min1, s1, ms1, µs1, ns1, y2, m2, d2, h2, min2, s2, ms2, µs2, ns2) {
  const dateResult = CompareISODate(y1, m1, d1, y2, m2, d2);
  if (dateResult !== 0) return dateResult;
  return CompareTemporalTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);
}

// Not abstract operations from the spec

export function NonNegativeBigIntDivmod(x, y) {
  let { quotient, remainder } = x.divmod(y);
  if (remainder.lesser(0)) {
    quotient = quotient.prev();
    remainder = remainder.plus(y);
  }
  return { quotient, remainder };
}

export function BigIntFloorDiv(left, right) {
  left = bigInt(left);
  right = bigInt(right);
  const { quotient, remainder } = left.divmod(right);
  if (!remainder.isZero() && !left.isNegative() != !right.isNegative()) {
    return quotient.prev();
  }
  return quotient;
}

export function BigIntIfAvailable(wrapper) {
  return typeof BigInt === 'undefined' ? wrapper : wrapper.value;
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

export function DefaultTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function ComparisonResult(value) {
  return value < 0 ? -1 : value > 0 ? 1 : value;
}

export function GetOptionsObject(options) {
  if (options === undefined) return ObjectCreate(null);
  if (Type(options) === 'Object') return options;
  throw new TypeError(`Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`);
}

export function SnapshotOwnProperties(source, proto, excludedKeys = [], excludedValues = []) {
  const copy = ObjectCreate(proto);
  CopyDataProperties(copy, source, excludedKeys, excludedValues);
  return copy;
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
  // The spec defines this operation distinct from String.prototype.lowercase,
  // so we'll follow the spec here. Note that nasty security issues that can
  // happen for some use cases if you're comparing case-modified non-ASCII
  // values. For example, Turkish's "I" character was the source of a security
  // issue involving "file://" URLs. See
  // https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/.
  return Call(StringPrototypeReplace, str, [
    /[A-Z]/g,
    (l) => {
      const code = Call(StringPrototypeCharCodeAt, l, [0]);
      return StringFromCharCode(code + 0x20);
    }
  ]);
}

// This function isn't in the spec, but we put it in the polyfill to avoid
// repeating the same (long) error message in many files.
export function ValueOfThrows(constructorName) {
  const compareCode =
    constructorName === 'PlainMonthDay'
      ? 'Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))'
      : `Temporal.${constructorName}.compare(obj1, obj2)`;

  throw new TypeError(
    'Do not use built-in arithmetic operators with Temporal objects. ' +
      `When comparing, use ${compareCode}, not obj1 > obj2. ` +
      "When coercing to strings, use `${obj}` or String(obj), not '' + obj. " +
      'When coercing to numbers, use properties or methods of the object, not `+obj`. ' +
      'When concatenating with strings, use `${str}${obj}` or str.concat(obj), not str + obj. ' +
      'In React, coerce to a string before rendering a Temporal object.'
  );
}

const OFFSET = new RegExp(`^${PARSE.offset.source}$`);
const OFFSET_WITH_PARTS = new RegExp(`^${PARSE.offsetWithParts.source}$`);

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
