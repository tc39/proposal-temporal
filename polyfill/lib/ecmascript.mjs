/* global __debug__ */

const ArrayIncludes = Array.prototype.includes;
const ArrayPrototypeMap = Array.prototype.map;
const ArrayPrototypePush = Array.prototype.push;
const ArrayPrototypeSlice = Array.prototype.slice;
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
import Call from 'es-abstract/2024/Call.js';
import CompletionRecord from 'es-abstract/2024/CompletionRecord.js';
import CreateDataPropertyOrThrow from 'es-abstract/2024/CreateDataPropertyOrThrow.js';
import Get from 'es-abstract/2024/Get.js';
import GetIterator from 'es-abstract/2024/GetIterator.js';
import GetMethod from 'es-abstract/2024/GetMethod.js';
import HasOwnProperty from 'es-abstract/2024/HasOwnProperty.js';
import IsArray from 'es-abstract/2024/IsArray.js';
import IsIntegralNumber from 'es-abstract/2024/IsIntegralNumber.js';
import IsPropertyKey from 'es-abstract/2024/IsPropertyKey.js';
import IteratorClose from 'es-abstract/2024/IteratorClose.js';
import IteratorStep from 'es-abstract/2024/IteratorStep.js';
import IteratorValue from 'es-abstract/2024/IteratorValue.js';
import SameValue from 'es-abstract/2024/SameValue.js';
import ToNumber from 'es-abstract/2024/ToNumber.js';
import ToObject from 'es-abstract/2024/ToObject.js';
import ToPrimitive from 'es-abstract/2024/ToPrimitive.js';
import ToString from 'es-abstract/2024/ToString.js';
import ToZeroPaddedDecimalString from 'es-abstract/2024/ToZeroPaddedDecimalString.js';
import Type from 'es-abstract/2024/Type.js';

import every from 'es-abstract/helpers/every.js';
import forEach from 'es-abstract/helpers/forEach.js';
import OwnPropertyKeys from 'es-abstract/helpers/OwnPropertyKeys.js';
import some from 'es-abstract/helpers/some.js';

import { DefineIntrinsic, GetIntrinsic } from './intrinsicclass.mjs';
import {
  ApplyUnsignedRoundingMode,
  FMAPowerOf10,
  GetUnsignedRoundingMode,
  TruncatingDivModByPowerOf10
} from './math.mjs';
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

// each item is [plural, singular, category, (length in ns)]
const TEMPORAL_UNITS = [
  ['years', 'year', 'date'],
  ['months', 'month', 'date'],
  ['weeks', 'week', 'date'],
  ['days', 'day', 'date', DAY_NANOS],
  ['hours', 'hour', 'time', 3600e9],
  ['minutes', 'minute', 'time', 60e9],
  ['seconds', 'second', 'time', 1e9],
  ['milliseconds', 'millisecond', 'time', 1e6],
  ['microseconds', 'microsecond', 'time', 1e3],
  ['nanoseconds', 'nanosecond', 'time', 1]
];
const SINGULAR_FOR = new Map(TEMPORAL_UNITS);
const PLURAL_FOR = new Map(TEMPORAL_UNITS.map(([p, s]) => [s, p]));
const UNITS_DESCENDING = TEMPORAL_UNITS.map(([, s]) => s);
const NS_PER_TIME_UNIT = new Map(TEMPORAL_UNITS.map(([, s, , l]) => [s, l]).filter(([, l]) => l));

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

// copied from es-abstract/2024/CopyDataProperties.js
// with modifications per Temporal spec/mainadditions.html

export function CopyDataProperties(target, source, excludedKeys, excludedValues) {
  if (Type(target) !== 'Object') {
    throw new $TypeError('Assertion failed: "target" must be an Object');
  }

  if (!IsArray(excludedKeys) || !every(excludedKeys, IsPropertyKey)) {
    throw new $TypeError('Assertion failed: "excludedKeys" must be a List of Property Keys');
  }

  if (excludedValues !== undefined && !IsArray(excludedValues)) {
    throw new $TypeError('Assertion failed: "excludedValues" must be a List of ECMAScript language values');
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
  const calendar = processAnnotations(match[16]);
  let yearString = match[1];
  if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
  if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
  const year = +yearString;
  const month = +(match[2] ?? match[4] ?? 1);
  const day = +(match[3] ?? match[5] ?? 1);
  const hasTime = match[6] !== undefined;
  const hour = +(match[6] ?? 0);
  const minute = +(match[7] ?? match[10] ?? 0);
  let second = +(match[8] ?? match[11] ?? 0);
  if (second === 60) second = 59;
  const fraction = (match[9] ?? match[12] ?? '') + '000000000';
  const millisecond = +fraction.slice(0, 3);
  const microsecond = +fraction.slice(3, 6);
  const nanosecond = +fraction.slice(6, 9);
  let offset;
  let z = false;
  if (match[13]) {
    offset = undefined;
    z = true;
  } else if (match[14]) {
    offset = match[14];
  }
  const tzAnnotation = match[15];
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
    processAnnotations(match[10]); // ignore found calendar
    hour = +(match[1] ?? 0);
    minute = +(match[2] ?? match[5] ?? 0);
    second = +(match[3] ?? match[6] ?? 0);
    if (second === 60) second = 59;
    const fraction = (match[4] ?? match[7] ?? '') + '000000000';
    millisecond = +fraction.slice(0, 3);
    microsecond = +fraction.slice(3, 6);
    nanosecond = +fraction.slice(6, 9);
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
    calendar = processAnnotations(match[3]);
    let yearString = match[1];
    if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
    if (yearString === '-000000') throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    year = +yearString;
    month = +match[2];
    referenceISODay = 1;
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
    calendar = processAnnotations(match[3]);
    month = +match[1];
    day = +match[2];
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

export function GetTemporalOverflowOption(options) {
  if (options === undefined) return 'constrain';
  return GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain');
}

export function GetTemporalDisambiguationOption(options) {
  if (options === undefined) return 'compatible';
  return GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
}

export function GetRoundingModeOption(options, fallback) {
  return GetOption(
    options,
    'roundingMode',
    ['ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'],
    fallback
  );
}

export function GetTemporalOffsetOption(options, fallback) {
  if (options === undefined) return fallback;
  return GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback);
}

export function GetTemporalShowCalendarNameOption(options) {
  return GetOption(options, 'calendarName', ['auto', 'always', 'never', 'critical'], 'auto');
}

export function GetTemporalShowTimeZoneNameOption(options) {
  return GetOption(options, 'timeZoneName', ['auto', 'never', 'critical'], 'auto');
}

export function GetTemporalShowOffsetOption(options) {
  return GetOption(options, 'offset', ['auto', 'never'], 'auto');
}

export function GetRoundingIncrementOption(options) {
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

export function GetTemporalFractionalSecondDigitsOption(options) {
  let digitsValue = options.fractionalSecondDigits;
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

export function GetTemporalUnitValuedOption(options, key, unitGroup, requiredOrDefault, extraValues = []) {
  const allowedSingular = [];
  for (let index = 0; index < TEMPORAL_UNITS.length; index++) {
    const unitInfo = TEMPORAL_UNITS[index];
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

export function GetTemporalRelativeToOption(options) {
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
    const fields = PrepareCalendarFields(
      calendarRec,
      relativeTo,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'],
      []
    );
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
  microseconds
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
    microseconds
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

export function PrepareCalendarFieldsAndFieldNames(
  calendarRec,
  bag,
  calendarFieldNames,
  nonCalendarFieldNames = [],
  requiredFieldNames = []
) {
  // Special-case built-in method, because we should skip the observable array
  // iteration in Calendar.prototype.fields
  let fieldNames;
  if (calendarRec.isBuiltIn()) {
    if (calendarRec.receiver !== 'iso8601') {
      fieldNames = GetIntrinsic('%calendarFieldsImpl%')(calendarRec.receiver, calendarFieldNames);
    } else {
      fieldNames = Call(ArrayPrototypeSlice, calendarFieldNames, []);
    }
  } else {
    fieldNames = [];
    for (const name of calendarRec.fields(calendarFieldNames)) {
      if (Type(name) !== 'String') throw new TypeError('bad return from calendar.fields()');
      Call(ArrayPrototypePush, fieldNames, [name]);
    }
  }
  Call(ArrayPrototypePush, fieldNames, nonCalendarFieldNames);
  const fields = PrepareTemporalFields(bag, fieldNames, requiredFieldNames);
  return { fields, fieldNames };
}

export function PrepareCalendarFields(calendarRec, bag, calendarFieldNames, nonCalendarFieldNames, requiredFieldNames) {
  const { fields } = PrepareCalendarFieldsAndFieldNames(
    calendarRec,
    bag,
    calendarFieldNames,
    nonCalendarFieldNames,
    requiredFieldNames
  );
  return fields;
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
      GetTemporalOverflowOption(options); // validate and ignore
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
      GetTemporalOverflowOption(options); // validate and ignore
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
    const fields = PrepareCalendarFields(calendarRec, item, ['day', 'month', 'monthCode', 'year'], [], []);
    return CalendarDateFromFields(calendarRec, fields, options);
  }
  let { year, month, day, calendar, z } = ParseTemporalDateString(RequireString(item));
  if (z) throw new RangeError('Z designator not supported for PlainDate');
  if (!calendar) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  GetTemporalOverflowOption(options); // validate and ignore
  return CreateTemporalDate(year, month, day, calendar);
}

export function InterpretTemporalDateTimeFields(calendarRec, fields, options) {
  // dateFromFields must be looked up
  let { hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(fields);
  const overflow = GetTemporalOverflowOption(options);
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
      GetTemporalOverflowOption(resolvedOptions); // validate and ignore
      const timeZoneRec = new TimeZoneMethodRecord(GetSlot(item, TIME_ZONE), ['getOffsetNanosecondsFor']);
      return GetPlainDateTimeFor(timeZoneRec, GetSlot(item, INSTANT), GetSlot(item, CALENDAR));
    }
    if (IsTemporalDate(item)) {
      GetTemporalOverflowOption(resolvedOptions); // validate and ignore
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
    const fields = PrepareCalendarFields(
      calendarRec,
      item,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'],
      []
    );
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
    GetTemporalOverflowOption(resolvedOptions); // validate and ignore
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
    const fields = PrepareCalendarFields(calendarRec, item, ['day', 'month', 'monthCode', 'year'], [], []);
    return CalendarMonthDayFromFields(calendarRec, fields, options);
  }

  let { month, day, referenceISOYear, calendar } = ParseTemporalMonthDayString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  GetTemporalOverflowOption(options); // validate and ignore

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

export function ToTemporalTimeOrMidnight(item) {
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  if (item === undefined) return new TemporalPlainTime();
  return ToTemporalTime(item);
}

export function ToTemporalYearMonth(item, options) {
  if (options !== undefined) options = SnapshotOwnProperties(GetOptionsObject(options), null);
  if (Type(item) === 'Object') {
    if (IsTemporalYearMonth(item)) return item;
    const calendar = GetTemporalCalendarSlotValueWithISODefault(item);
    const calendarRec = new CalendarMethodRecord(calendar, ['fields', 'yearMonthFromFields']);
    const fields = PrepareCalendarFields(calendarRec, item, ['month', 'monthCode', 'year'], [], []);
    return CalendarYearMonthFromFields(calendarRec, fields, options);
  }

  let { year, month, referenceISODay, calendar } = ParseTemporalYearMonthString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeError(`invalid calendar identifier ${calendar}`);
  calendar = ASCIILowercase(calendar);
  GetTemporalOverflowOption(options); // validate and ignore

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
      const roundedCandidateOffset = RoundNumberToIncrement(candidateOffset, 60e9, 'halfExpand');
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
      : typeof timeZoneRec.receiver === 'string'
        ? timeZoneRec.receiver
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
    const fields = PrepareCalendarFields(
      calendarRec,
      item,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'],
      ['timeZone']
    );
    timeZone = ToTemporalTimeZoneSlotValue(fields.timeZone);
    offset = fields.offset;
    if (offset === undefined) {
      offsetBehaviour = 'wall';
    }
    disambiguation = GetTemporalDisambiguationOption(resolvedOptions);
    offsetOpt = GetTemporalOffsetOption(resolvedOptions, 'reject');
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
    disambiguation = GetTemporalDisambiguationOption(resolvedOptions);
    offsetOpt = GetTemporalOffsetOption(resolvedOptions, 'reject');
    GetTemporalOverflowOption(resolvedOptions); // validate and ignore
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
  if (typeof result !== 'number' && result !== undefined) {
    throw new TypeError('calendar weekOfYear result must be a positive integer');
  }
  if ((!IsIntegralNumber(result) || result < 1) && result !== undefined) {
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
  if (typeof result !== 'number' && result !== undefined) {
    throw new TypeError('calendar yearOfWeek result must be an integer');
  }
  if (!IsIntegralNumber(result) && result !== undefined) {
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
      const earlierDate = BalanceISODate(year, month, day + earlierTime.deltaDays);
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
      const laterDate = BalanceISODate(year, month, day + laterTime.deltaDays);
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
    const sign = year < 0 ? '-' : '+';
    const yearNumber = MathAbs(year);
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
    const ns = RoundTemporalInstant(GetSlot(zdt, EPOCHNANOSECONDS), increment, unit, roundingMode);
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
  offsetNanoseconds = RoundNumberToIncrement(offsetNanoseconds, 60e9, 'halfExpand');
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

export function UnbalanceDateDurationRelative(years, months, weeks, days, plainRelativeTo, calendarRec) {
  // calendarRec must have looked up dateAdd, unless calendar units 0
  if (years === 0 && months === 0 && weeks === 0) return days;

  // balance years, months, and weeks down to days
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  const later = CalendarDateAdd(calendarRec, plainRelativeTo, new TemporalDuration(years, months, weeks));
  const yearsMonthsWeeksInDays = DaysUntil(plainRelativeTo, later);
  return days + yearsMonthsWeeksInDays;
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
  return RoundTimeDuration(0, diff, increment, smallestUnit, roundingMode);
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
  const untilOptions = SnapshotOwnProperties(options, null);
  untilOptions.largestUnit = dateLargestUnit;
  const untilResult = DifferenceDate(calendarRec, date1, date2, untilOptions);
  const years = GetSlot(untilResult, YEARS);
  const months = GetSlot(untilResult, MONTHS);
  const weeks = GetSlot(untilResult, WEEKS);
  let days = GetSlot(untilResult, DAYS);
  if (largestUnit !== dateLargestUnit) {
    // largestUnit < days, so add the days in to the normalized duration
    timeDuration = timeDuration.add24HourDays(days);
    days = 0;
  }
  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, timeDuration);
  return { years, months, weeks, days, norm: timeDuration };
}

export function DifferenceZonedDateTime(ns1, ns2, timeZoneRec, calendarRec, largestUnit, options, dtStart) {
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
  const sign = nsDiff.lt(0) ? -1 : 1;

  // Convert start/end instants to datetimes
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const end = new TemporalInstant(ns2);
  const dtEnd = GetPlainDateTimeFor(timeZoneRec, end, calendarRec.receiver);

  // Simulate moving ns1 as many years/months/weeks/days as possible without
  // surpassing ns2. This value is stored in intermediateDateTime/intermediateInstant/intermediateNs.
  // We do not literally move years/months/weeks/days with calendar arithmetic,
  // but rather assume intermediateDateTime will have the same time-parts as
  // dtStart and the date-parts from dtEnd, and move backward from there.
  // The number of days we move backward is stored in dayCorrection.
  // Credit to Adam Shaw for devising this algorithm.
  let dayCorrection = 0;
  let intermediateDateTime;
  let norm;

  // The max number of allowed day corrections depends on the direction of travel.
  // Both directions allow for 1 day correction due to an ISO wall-clock overshoot (see below).
  // Only the forward direction allows for an additional 1 day correction caused by a push-forward
  // 'compatible' DST transition causing the wall-clock to overshoot again.
  // This max value is inclusive.
  let maxDayCorrection = sign === 1 ? 2 : 1;

  // Detect ISO wall-clock overshoot.
  // If the diff of the ISO wall-clock times is opposite to the overall diff's sign,
  // we are guaranteed to need at least one day correction.
  let timeDuration = DifferenceTime(
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
  if (timeDuration.sign() === -sign) {
    dayCorrection++;
  }

  for (; dayCorrection <= maxDayCorrection; dayCorrection++) {
    const intermediateDate = BalanceISODate(
      GetSlot(dtEnd, ISO_YEAR),
      GetSlot(dtEnd, ISO_MONTH),
      GetSlot(dtEnd, ISO_DAY) - dayCorrection * sign
    );

    // Incorporate time parts from dtStart
    intermediateDateTime = CreateTemporalDateTime(
      intermediateDate.year,
      intermediateDate.month,
      intermediateDate.day,
      GetSlot(dtStart, ISO_HOUR),
      GetSlot(dtStart, ISO_MINUTE),
      GetSlot(dtStart, ISO_SECOND),
      GetSlot(dtStart, ISO_MILLISECOND),
      GetSlot(dtStart, ISO_MICROSECOND),
      GetSlot(dtStart, ISO_NANOSECOND),
      calendarRec.receiver
    );

    // Convert intermediate datetime to epoch-nanoseconds (may disambiguate)
    const intermediateInstant = GetInstantFor(timeZoneRec, intermediateDateTime, 'compatible');
    const intermediateNs = GetSlot(intermediateInstant, EPOCHNANOSECONDS);

    // Compute the nanosecond diff between the intermediate instant and the final destination
    norm = TimeDuration.fromEpochNsDiff(ns2, intermediateNs);

    // Did intermediateNs NOT surpass ns2?
    // If so, exit the loop with success (without incrementing dayCorrection past maxDayCorrection)
    if (norm.sign() !== -sign) {
      break;
    }
  }

  if (dayCorrection > maxDayCorrection) {
    throw new RangeError(
      `inconsistent return from calendar or time zone method: more than ${maxDayCorrection} day correction needed`
    );
  }

  // Similar to what happens in DifferenceISODateTime with date parts only:
  const date1 = TemporalDateTimeToDate(dtStart);
  const date2 = TemporalDateTimeToDate(intermediateDateTime);
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const untilOptions = SnapshotOwnProperties(options, null);
  untilOptions.largestUnit = dateLargestUnit;
  const dateDifference = DifferenceDate(calendarRec, date1, date2, untilOptions);
  const years = GetSlot(dateDifference, YEARS);
  const months = GetSlot(dateDifference, MONTHS);
  const weeks = GetSlot(dateDifference, WEEKS);
  const days = GetSlot(dateDifference, DAYS);

  CombineDateAndNormalizedTimeDuration(years, months, weeks, days, norm);
  return { years, months, weeks, days, norm };
}

// Epoch-nanosecond bounding technique where the start/end of the calendar-unit
// interval are converted to epoch-nanosecond times and destEpochNs is nudged to
// either one.
function NudgeToCalendarUnit(
  sign,
  duration,
  destEpochNs,
  dateTime,
  calendarRec,
  timeZoneRec,
  increment,
  unit,
  roundingMode
) {
  // unit must be day, week, month, or year
  // timeZoneRec may be undefined

  // Create a duration with smallestUnit trunc'd towards zero
  // Create a separate duration that incorporates roundingIncrement
  let r1, r2, startDuration, endDuration;
  switch (unit) {
    case 'year': {
      const years = RoundNumberToIncrement(duration.years, increment, 'trunc');
      r1 = years;
      r2 = years + increment * sign;
      startDuration = { years: r1, months: 0, weeks: 0, days: 0, norm: TimeDuration.ZERO };
      endDuration = { ...startDuration, years: r2 };
      break;
    }
    case 'month': {
      const months = RoundNumberToIncrement(duration.months, increment, 'trunc');
      r1 = months;
      r2 = months + increment * sign;
      startDuration = { ...duration, months: r1, weeks: 0, days: 0, norm: TimeDuration.ZERO };
      endDuration = { ...startDuration, months: r2 };
      break;
    }
    case 'week': {
      const year = dateTime.year + duration.years;
      const month = dateTime.month + duration.months;
      const day = dateTime.day;
      const isoResult1 = BalanceISODate(year, month, day);
      const isoResult2 = BalanceISODate(year, month, day + duration.days);
      const weeksStart = CreateTemporalDate(isoResult1.year, isoResult1.month, isoResult1.day, calendarRec.receiver);
      const weeksEnd = CreateTemporalDate(isoResult2.year, isoResult2.month, isoResult2.day, calendarRec.receiver);
      const untilOptions = ObjectCreate(null);
      untilOptions.largestUnit = 'week';
      const untilResult = DifferenceDate(calendarRec, weeksStart, weeksEnd, untilOptions);
      const weeks = RoundNumberToIncrement(duration.weeks + GetSlot(untilResult, WEEKS), increment, 'trunc');
      r1 = weeks;
      r2 = weeks + increment * sign;
      startDuration = { ...duration, weeks: r1, days: 0, norm: TimeDuration.ZERO };
      endDuration = { ...startDuration, weeks: r2 };
      break;
    }
    case 'day': {
      const days = RoundNumberToIncrement(duration.days, increment, 'trunc');
      r1 = days;
      r2 = days + increment * sign;
      startDuration = { ...duration, days: r1, norm: TimeDuration.ZERO };
      endDuration = { ...startDuration, days: r2 };
      break;
    }
    default:
      throw new Error('assert not reached');
  }

  // Apply to origin, output PlainDateTimes
  const start = AddDateTime(
    dateTime.year,
    dateTime.month,
    dateTime.day,
    dateTime.hour,
    dateTime.minute,
    dateTime.second,
    dateTime.millisecond,
    dateTime.microsecond,
    dateTime.nanosecond,
    calendarRec,
    startDuration.years,
    startDuration.months,
    startDuration.weeks,
    startDuration.days,
    startDuration.norm
  );
  const end = AddDateTime(
    dateTime.year,
    dateTime.month,
    dateTime.day,
    dateTime.hour,
    dateTime.minute,
    dateTime.second,
    dateTime.millisecond,
    dateTime.microsecond,
    dateTime.nanosecond,
    calendarRec,
    endDuration.years,
    endDuration.months,
    endDuration.weeks,
    endDuration.days,
    endDuration.norm
  );

  // Convert to epoch-nanoseconds
  let startEpochNs, endEpochNs;
  if (timeZoneRec) {
    const startDateTime = CreateTemporalDateTime(
      start.year,
      start.month,
      start.day,
      start.hour,
      start.minute,
      start.second,
      start.millisecond,
      start.microsecond,
      start.nanosecond,
      calendarRec.receiver
    );
    startEpochNs = GetSlot(GetInstantFor(timeZoneRec, startDateTime, 'compatible'), EPOCHNANOSECONDS);
    const endDateTime = CreateTemporalDateTime(
      end.year,
      end.month,
      end.day,
      end.hour,
      end.minute,
      end.second,
      end.millisecond,
      end.microsecond,
      end.nanosecond,
      calendarRec.receiver
    );
    endEpochNs = GetSlot(GetInstantFor(timeZoneRec, endDateTime, 'compatible'), EPOCHNANOSECONDS);
  } else {
    startEpochNs = GetUTCEpochNanoseconds(
      start.year,
      start.month,
      start.day,
      start.hour,
      start.minute,
      start.second,
      start.millisecond,
      start.microsecond,
      start.nanosecond
    );
    endEpochNs = GetUTCEpochNanoseconds(
      end.year,
      end.month,
      end.day,
      end.hour,
      end.minute,
      end.second,
      end.millisecond,
      end.microsecond,
      end.nanosecond
    );
  }

  // Round the smallestUnit within the epoch-nanosecond span
  if (endEpochNs.equals(startEpochNs)) {
    throw new RangeError(`custom calendar reported a ${unit} that is 0 days long`);
  }
  const numerator = TimeDuration.fromEpochNsDiff(destEpochNs, startEpochNs);
  const denominator = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
  const unsignedRoundingMode = GetUnsignedRoundingMode(roundingMode, sign < 0 ? 'negative' : 'positive');
  const cmp = numerator.add(numerator).abs().subtract(denominator.abs()).sign();
  const even = (r1 / (increment * sign)) % 2 === 0;
  const roundedUnit = numerator.isZero() ? r1 : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);

  // Trick to minimize rounding error, due to the lack of fma() in JS
  const fakeNumerator = new TimeDuration(denominator.totalNs.times(r1).add(numerator.totalNs.times(increment * sign)));
  const total = fakeNumerator.fdiv(denominator.totalNs);

  // Determine whether expanded or contracted
  const didExpandCalendarUnit = MathSign(roundedUnit - total) === sign;
  duration = didExpandCalendarUnit ? endDuration : startDuration;

  return {
    duration,
    total,
    nudgedEpochNs: didExpandCalendarUnit ? endEpochNs : startEpochNs,
    didExpandCalendarUnit
  };
}

// Attempts rounding of time units within a time zone's day, but if the rounding
// causes time to exceed the total time within the day, rerun rounding in next
// day.
function NudgeToZonedTime(sign, duration, dateTime, calendarRec, timeZoneRec, increment, unit, roundingMode) {
  // unit must be hour or smaller

  // Apply to origin, output start/end of the day as PlainDateTimes
  const start = AddDateTime(
    dateTime.year,
    dateTime.month,
    dateTime.day,
    dateTime.hour,
    dateTime.minute,
    dateTime.second,
    dateTime.millisecond,
    dateTime.microsecond,
    dateTime.nanosecond,
    calendarRec,
    duration.years,
    duration.months,
    duration.weeks,
    duration.days,
    TimeDuration.ZERO
  );
  const startDateTime = CreateTemporalDateTime(
    start.year,
    start.month,
    start.day,
    start.hour,
    start.minute,
    start.second,
    start.millisecond,
    start.microsecond,
    start.nanosecond,
    calendarRec.receiver
  );
  const endDate = BalanceISODate(start.year, start.month, start.day + sign);
  const endDateTime = CreateTemporalDateTime(
    endDate.year,
    endDate.month,
    endDate.day,
    start.hour,
    start.minute,
    start.second,
    start.millisecond,
    start.microsecond,
    start.nanosecond,
    calendarRec.receiver
  );

  // Compute the epoch-nanosecond start/end of the final whole-day interval
  // If duration has negative sign, startEpochNs will be after endEpochNs
  const startEpochNs = GetSlot(GetInstantFor(timeZoneRec, startDateTime, 'compatible'), EPOCHNANOSECONDS);
  const endEpochNs = GetSlot(GetInstantFor(timeZoneRec, endDateTime, 'compatible'), EPOCHNANOSECONDS);

  // The signed amount of time from the start of the whole-day interval to the end
  const daySpan = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
  if (daySpan.sign() !== sign) throw new RangeError('time zone returned inconsistent Instants');

  // Compute time parts of the duration to nanoseconds and round
  // Result could be negative
  let roundedNorm = duration.norm.round(NS_PER_TIME_UNIT.get(unit) * increment, roundingMode);

  // Does the rounded time exceed the time-in-day?
  const beyondDaySpan = roundedNorm.subtract(daySpan);
  const didRoundBeyondDay = beyondDaySpan.sign() !== -sign;

  let dayDelta, nudgedEpochNs;
  if (didRoundBeyondDay) {
    // If rounded into next day, use the day-end as the local origin and rerun
    // the rounding
    dayDelta = sign;
    roundedNorm = beyondDaySpan.round(NS_PER_TIME_UNIT.get(unit) * increment, roundingMode);
    nudgedEpochNs = roundedNorm.addToEpochNs(endEpochNs);
  } else {
    // Otherwise, if time not rounded beyond day, use the day-start as the local
    // origin
    dayDelta = 0;
    nudgedEpochNs = roundedNorm.addToEpochNs(startEpochNs);
  }

  duration = {
    years: duration.years,
    months: duration.months,
    weeks: duration.weeks,
    days: duration.days + dayDelta,
    norm: roundedNorm
  };
  return {
    duration,
    total: NaN, // Not computed in this path, so we assert that it is not NaN later on
    nudgedEpochNs,
    didExpandCalendarUnit: didRoundBeyondDay
  };
}

// Converts all fields to nanoseconds and does integer rounding.
function NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode) {
  // unit must be day or smaller

  const norm = duration.norm.add24HourDays(duration.days);
  // Convert to nanoseconds and round
  const unitLength = NS_PER_TIME_UNIT.get(smallestUnit);
  const total = norm.fdiv(unitLength);
  const roundedNorm = norm.round(increment * unitLength, roundingMode);
  const diffNorm = roundedNorm.subtract(norm);

  // Determine if whole days expanded
  const { quotient: wholeDays } = norm.divmod(DAY_NANOS);
  const { quotient: roundedWholeDays, remainder: roundedDaysRemainder } = roundedNorm.divmod(DAY_NANOS);
  const didExpandDays = MathSign(roundedWholeDays - wholeDays) === norm.sign();

  const nudgedEpochNs = diffNorm.addToEpochNs(destEpochNs);

  let days = 0;
  let remainder = roundedNorm;
  if (LargerOfTwoTemporalUnits(largestUnit, 'day') === largestUnit) {
    days = roundedWholeDays;
    remainder = roundedDaysRemainder;
  }

  duration = { ...duration, days, norm: remainder };
  return {
    duration,
    total,
    nudgedEpochNs,
    didExpandCalendarUnit: didExpandDays
  };
}

// Given a potentially bottom-heavy duration, bubble up smaller units to larger
// units. Any units smaller than smallestUnit are already zeroed-out.
function BubbleRelativeDuration(
  sign,
  duration,
  nudgedEpochNs,
  plainDateTime,
  calendarRec,
  timeZoneRec,
  largestUnit,
  smallestUnit
) {
  // smallestUnit is day or larger

  if (smallestUnit === 'year') return duration;

  // Check to see if nudgedEpochNs has hit the boundary of any units higher than
  // smallestUnit, in which case increment the higher unit and clear smaller
  // units.
  const largestUnitIndex = UNITS_DESCENDING.indexOf(largestUnit);
  const smallestUnitIndex = UNITS_DESCENDING.indexOf(smallestUnit);
  for (let unitIndex = smallestUnitIndex - 1; unitIndex >= largestUnitIndex; unitIndex--) {
    // The only situation where days and smaller bubble-up into weeks is when
    // largestUnit is 'week' (not to be confused with the situation where
    // smallestUnit is 'week', in which case days and smaller are ROUNDED-up
    // into weeks, but that has already happened by the time this function
    // executes)
    // So, if days and smaller are NOT bubbled-up into weeks, and the current
    // unit is weeks, skip.
    const unit = UNITS_DESCENDING[unitIndex];
    if (unit === 'week' && largestUnit !== 'week') {
      continue;
    }

    let endDuration;
    switch (unit) {
      case 'year': {
        const years = duration.years + sign;
        endDuration = { years, months: 0, weeks: 0, days: 0, norm: TimeDuration.ZERO };
        break;
      }
      case 'month': {
        const months = duration.months + sign;
        endDuration = { ...duration, months, weeks: 0, days: 0, norm: TimeDuration.ZERO };
        break;
      }
      case 'week': {
        const weeks = duration.weeks + sign;
        endDuration = { ...duration, weeks, days: 0, norm: TimeDuration.ZERO };
        break;
      }
      case 'day': {
        const days = duration.days + sign;
        endDuration = { ...duration, days, norm: TimeDuration.ZERO };
        break;
      }
      default:
        throw new Error('assert not reached');
    }

    // Compute end-of-unit in epoch-nanoseconds
    const end = AddDateTime(
      plainDateTime.year,
      plainDateTime.month,
      plainDateTime.day,
      plainDateTime.hour,
      plainDateTime.minute,
      plainDateTime.second,
      plainDateTime.millisecond,
      plainDateTime.microsecond,
      plainDateTime.nanosecond,
      calendarRec,
      endDuration.years,
      endDuration.months,
      endDuration.weeks,
      endDuration.days,
      TimeDuration.ZERO
    );
    let endEpochNs;
    if (timeZoneRec) {
      const endDateTime = CreateTemporalDateTime(
        end.year,
        end.month,
        end.day,
        end.hour,
        end.minute,
        end.second,
        end.millisecond,
        end.microsecond,
        end.nanosecond,
        calendarRec.receiver
      );
      endEpochNs = GetSlot(GetInstantFor(timeZoneRec, endDateTime, 'compatible'), EPOCHNANOSECONDS);
    } else {
      endEpochNs = GetUTCEpochNanoseconds(
        end.year,
        end.month,
        end.day,
        end.hour,
        end.minute,
        end.second,
        end.millisecond,
        end.microsecond,
        end.nanosecond
      );
    }

    const didExpandToEnd = nudgedEpochNs.compare(endEpochNs) !== -sign;

    // Is nudgedEpochNs at the end-of-unit? This means it should bubble-up to
    // the next highest unit (and possibly further...)
    if (didExpandToEnd) {
      duration = endDuration;
    } else {
      // NOT at end-of-unit. Stop looking for bubbling
      break;
    }
  }

  return duration;
}

function RoundRelativeDuration(
  duration,
  destEpochNs,
  dateTime,
  calendarRec,
  timeZoneRec,
  largestUnit,
  increment,
  smallestUnit,
  roundingMode
) {
  // The duration must already be balanced. This should be achieved by calling
  // one of the non-rounding since/until internal methods prior. It's okay to
  // have a bottom-heavy weeks because weeks don't bubble-up into months. It's
  // okay to have >24 hour day assuming the final day of relativeTo+duration has
  // >24 hours in its timezone. (should automatically end up like this if using
  // non-rounding since/until internal methods prior)
  const irregularLengthUnit = IsCalendarUnit(smallestUnit) || (timeZoneRec && smallestUnit === 'day');
  const sign =
    DurationSign(duration.years, duration.months, duration.weeks, duration.days, duration.norm.sign()) < 0 ? -1 : 1;

  let nudgeResult;
  if (irregularLengthUnit) {
    // Rounding an irregular-length unit? Use epoch-nanosecond-bounding technique
    nudgeResult = NudgeToCalendarUnit(
      sign,
      duration,
      destEpochNs,
      dateTime,
      calendarRec,
      timeZoneRec,
      increment,
      smallestUnit,
      roundingMode
    );
  } else if (timeZoneRec) {
    // Special-case for rounding time units within a zoned day. total() never
    // takes this path because largestUnit is then also a time unit, so
    // DifferenceZonedDateTimeWithRounding uses Instant math
    nudgeResult = NudgeToZonedTime(
      sign,
      duration,
      dateTime,
      calendarRec,
      timeZoneRec,
      increment,
      smallestUnit,
      roundingMode
    );
  } else {
    // Rounding uniform-length days/hours/minutes/etc units. Simple nanosecond
    // math. years/months/weeks unchanged
    nudgeResult = NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode);
  }

  duration = nudgeResult.duration;
  // Did nudging cause the duration to expand to the next day or larger?
  // Bubble-up smaller calendar units into higher ones, except for weeks, which
  // don't balance up into months
  if (nudgeResult.didExpandCalendarUnit && smallestUnit !== 'week') {
    duration = BubbleRelativeDuration(
      sign,
      duration,
      nudgeResult.nudgedEpochNs, // The destEpochNs after expanding/contracting
      dateTime,
      calendarRec,
      timeZoneRec,
      largestUnit, // where to STOP bubbling
      LargerOfTwoTemporalUnits(smallestUnit, 'day') // where to START bubbling-up from
    );
  }

  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
    largestUnit = 'hour';
  }
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
    duration.norm,
    largestUnit
  );
  return {
    years: duration.years,
    months: duration.months,
    weeks: duration.weeks,
    days: duration.days,
    hours,
    minutes,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    total: nudgeResult.total
  };
}

export function DifferencePlainDateTimeWithRounding(
  plainDate1,
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
  roundingIncrement,
  smallestUnit,
  roundingMode,
  resolvedOptions
) {
  const y1 = GetSlot(plainDate1, ISO_YEAR);
  const mon1 = GetSlot(plainDate1, ISO_MONTH);
  const d1 = GetSlot(plainDate1, ISO_DAY);
  if (CompareISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2) == 0) {
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
      nanoseconds: 0,
      total: 0
    };
  }

  let { years, months, weeks, days, norm } = DifferenceISODateTime(
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
    resolvedOptions
  );

  const roundingIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
  if (roundingIsNoop) {
    const normWithDays = norm.add24HourDays(days);
    let hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      normWithDays,
      largestUnit
    ));
    const total = norm.totalNs.toJSNumber();
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, total };
  }

  const dateTime = {
    year: y1,
    month: mon1,
    day: d1,
    hour: h1,
    minute: min1,
    second: s1,
    millisecond: ms1,
    microsecond: µs1,
    nanosecond: ns1
  };
  const destEpochNs = GetUTCEpochNanoseconds(y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2);
  return RoundRelativeDuration(
    { years, months, weeks, days, norm },
    destEpochNs,
    dateTime,
    calendarRec,
    null,
    largestUnit,
    roundingIncrement,
    smallestUnit,
    roundingMode
  );
}

export function DifferenceZonedDateTimeWithRounding(
  ns1,
  ns2,
  calendarRec,
  timeZoneRec,
  precalculatedPlainDateTime,
  resolvedOptions,
  largestUnit,
  roundingIncrement,
  smallestUnit,
  roundingMode
) {
  if (!IsCalendarUnit(largestUnit) && largestUnit !== 'day') {
    // The user is only asking for a time difference, so return difference of instants.
    const { norm, total } = DifferenceInstant(ns1, ns2, roundingIncrement, smallestUnit, largestUnit, roundingMode);
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, largestUnit);
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds,
      total
    };
  }

  let { years, months, weeks, days, norm } = DifferenceZonedDateTime(
    ns1,
    ns2,
    timeZoneRec,
    calendarRec,
    largestUnit,
    resolvedOptions,
    precalculatedPlainDateTime
  );

  const roundingIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
  if (roundingIsNoop) {
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, 'hour');
    const total = norm.totalNs.toJSNumber();
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, total };
  }

  const dateTime = {
    year: GetSlot(precalculatedPlainDateTime, ISO_YEAR),
    month: GetSlot(precalculatedPlainDateTime, ISO_MONTH),
    day: GetSlot(precalculatedPlainDateTime, ISO_DAY),
    hour: GetSlot(precalculatedPlainDateTime, ISO_HOUR),
    minute: GetSlot(precalculatedPlainDateTime, ISO_MINUTE),
    second: GetSlot(precalculatedPlainDateTime, ISO_SECOND),
    millisecond: GetSlot(precalculatedPlainDateTime, ISO_MILLISECOND),
    microsecond: GetSlot(precalculatedPlainDateTime, ISO_MICROSECOND),
    nanosecond: GetSlot(precalculatedPlainDateTime, ISO_NANOSECOND)
  };
  return RoundRelativeDuration(
    { years, months, weeks, days, norm },
    ns2,
    dateTime,
    calendarRec,
    timeZoneRec,
    largestUnit,
    roundingIncrement,
    smallestUnit,
    roundingMode
  );
}

export function GetDifferenceSettings(options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
  const ALLOWED_UNITS = TEMPORAL_UNITS.reduce((allowed, unitInfo) => {
    const p = unitInfo[0];
    const s = unitInfo[1];
    const c = unitInfo[2];
    if ((group === 'datetime' || c === group) && !Call(ArrayIncludes, disallowed, [s])) {
      allowed.push(s, p);
    }
    return allowed;
  }, []);

  let largestUnit = GetTemporalUnitValuedOption(options, 'largestUnit', group, 'auto');
  if (Call(ArrayIncludes, disallowed, [largestUnit])) {
    throw new RangeError(`largestUnit must be one of ${ALLOWED_UNITS.join(', ')}, not ${largestUnit}`);
  }

  const roundingIncrement = GetRoundingIncrementOption(options);

  let roundingMode = GetRoundingModeOption(options, 'trunc');

  const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', group, fallbackSmallest);
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

export function DifferenceTemporalInstant(instant, other, options) {
  other = ToTemporalInstant(other);

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'time', [], 'nanosecond', 'second');

  const onens = GetSlot(instant, EPOCHNANOSECONDS);
  const twons = GetSlot(other, EPOCHNANOSECONDS);
  const { norm } = DifferenceInstant(
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
  return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}

export function DifferenceTemporalPlainDate(plainDate, other, options) {
  other = ToTemporalDate(other);
  const calendar = GetSlot(plainDate, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'date', [], 'day', 'day');

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
    const dateTime = {
      year: GetSlot(plainDate, ISO_YEAR),
      month: GetSlot(plainDate, ISO_MONTH),
      day: GetSlot(plainDate, ISO_DAY),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    };
    const destEpochNs = GetUTCEpochNanoseconds(
      GetSlot(other, ISO_YEAR),
      GetSlot(other, ISO_MONTH),
      GetSlot(other, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0
    );
    ({ years, months, weeks, days } = RoundRelativeDuration(
      { years, months, weeks, days, norm: TimeDuration.ZERO },
      destEpochNs,
      dateTime,
      calendarRec,
      null,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ));
  }

  return new Duration(years, months, weeks, days, 0, 0, 0, 0, 0, 0);
}

export function DifferenceTemporalPlainDateTime(plainDateTime, other, options) {
  other = ToTemporalDateTime(other);
  const calendar = GetSlot(plainDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'datetime', [], 'nanosecond', 'day');

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

  const plainDate1 = TemporalDateTimeToDate(plainDateTime);
  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateUntil']);
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    DifferencePlainDateTimeWithRounding(
      plainDate1,
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
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode,
      resolvedOptions
    );

  return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}

export function DifferenceTemporalPlainTime(plainTime, other, options) {
  other = ToTemporalTime(other);

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'time', [], 'nanosecond', 'hour');

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
    ({ norm } = RoundTimeDuration(0, norm, settings.roundingIncrement, settings.smallestUnit, settings.roundingMode));
  }
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
    norm,
    settings.largestUnit
  );
  const Duration = GetIntrinsic('%Temporal.Duration%');
  return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}

export function DifferenceTemporalPlainYearMonth(yearMonth, other, options) {
  other = ToTemporalYearMonth(other);
  const calendar = GetSlot(yearMonth, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between months');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'date', ['week', 'day'], 'month', 'year');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(yearMonth, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(yearMonth, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(yearMonth, ISO_DAY) === GetSlot(other, ISO_DAY)
  ) {
    return new Duration();
  }

  const calendarRec = new CalendarMethodRecord(calendar, ['dateAdd', 'dateFromFields', 'dateUntil', 'fields']);

  const { fields: thisFields, fieldNames } = PrepareCalendarFieldsAndFieldNames(calendarRec, yearMonth, [
    'monthCode',
    'year'
  ]);
  thisFields.day = 1;
  const thisDate = CalendarDateFromFields(calendarRec, thisFields);
  const otherFields = PrepareTemporalFields(other, fieldNames, []);
  otherFields.day = 1;
  const otherDate = CalendarDateFromFields(calendarRec, otherFields);

  resolvedOptions.largestUnit = settings.largestUnit;
  let { years, months } = CalendarDateUntil(calendarRec, thisDate, otherDate, resolvedOptions);

  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
    const dateTime = {
      year: GetSlot(thisDate, ISO_YEAR),
      month: GetSlot(thisDate, ISO_MONTH),
      day: GetSlot(thisDate, ISO_DAY),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    };
    const destEpochNs = GetUTCEpochNanoseconds(
      GetSlot(otherDate, ISO_YEAR),
      GetSlot(otherDate, ISO_MONTH),
      GetSlot(otherDate, ISO_DAY),
      0,
      0,
      0,
      0,
      0,
      0
    );
    ({ years, months } = RoundRelativeDuration(
      { years, months, weeks: 0, days: 0, norm: TimeDuration.ZERO },
      destEpochNs,
      dateTime,
      calendarRec,
      null,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ));
  }

  return new Duration(years, months, 0, 0, 0, 0, 0, 0, 0, 0);
}

export function DifferenceTemporalZonedDateTime(zonedDateTime, other, options) {
  other = ToTemporalZonedDateTime(other);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  ThrowIfCalendarsNotEqual(calendar, otherCalendar, 'compute difference between dates');

  const resolvedOptions = SnapshotOwnProperties(GetOptionsObject(options), null);
  const settings = GetDifferenceSettings(resolvedOptions, 'datetime', [], 'nanosecond', 'hour');

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
    const { norm } = DifferenceInstant(
      ns1,
      ns2,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
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

    ({ years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
      DifferenceZonedDateTimeWithRounding(
        ns1,
        ns2,
        calendarRec,
        timeZoneRec,
        precalculatedPlainDateTime,
        resolvedOptions,
        settings.largestUnit,
        settings.roundingIncrement,
        settings.smallestUnit,
        settings.roundingMode
      ));
  }

  return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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
  const overflow = GetTemporalOverflowOption(options);
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
    const overflow = GetTemporalOverflowOption(options);
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

export function AddDurations(duration, other, options) {
  other = ToTemporalDurationRecord(other);
  options = GetOptionsObject(options);
  const { plainRelativeTo, zonedRelativeTo, timeZoneRec } = GetTemporalRelativeToOption(options);

  const calendarRec = CalendarMethodRecord.CreateFromRelativeTo(plainRelativeTo, zonedRelativeTo, [
    'dateAdd',
    'dateUntil'
  ]);

  const y1 = GetSlot(duration, YEARS);
  const mon1 = GetSlot(duration, MONTHS);
  const w1 = GetSlot(duration, WEEKS);
  const d1 = GetSlot(duration, DAYS);
  const h1 = GetSlot(duration, HOURS);
  const min1 = GetSlot(duration, MINUTES);
  const s1 = GetSlot(duration, SECONDS);
  const ms1 = GetSlot(duration, MILLISECONDS);
  const µs1 = GetSlot(duration, MICROSECONDS);
  const ns1 = GetSlot(duration, NANOSECONDS);
  const y2 = other.years;
  const mon2 = other.months;
  const w2 = other.weeks;
  const d2 = other.days;
  const h2 = other.hours;
  const min2 = other.minutes;
  const s2 = other.seconds;
  const ms2 = other.milliseconds;
  const µs2 = other.microseconds;
  const ns2 = other.nanoseconds;

  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1, µs1);
  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2, µs2);
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);

  const norm1 = TimeDuration.normalize(h1, min1, s1, ms1, µs1, ns1);
  const norm2 = TimeDuration.normalize(h2, min2, s2, ms2, µs2, ns2);
  const Duration = GetIntrinsic('%Temporal.Duration%');

  if (!zonedRelativeTo && !plainRelativeTo) {
    if (IsCalendarUnit(largestUnit)) {
      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic');
    }
    const { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm1.add(norm2).add24HourDays(d1 + d2),
      largestUnit
    );
    return new Duration(0, 0, 0, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }

  if (plainRelativeTo) {
    const dateDuration1 = new Duration(y1, mon1, w1, d1, 0, 0, 0, 0, 0, 0);
    const dateDuration2 = new Duration(y2, mon2, w2, d2, 0, 0, 0, 0, 0, 0);
    const intermediate = AddDate(calendarRec, plainRelativeTo, dateDuration1);
    const end = AddDate(calendarRec, intermediate, dateDuration2);

    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
    const differenceOptions = ObjectCreate(null);
    differenceOptions.largestUnit = dateLargestUnit;
    const untilResult = DifferenceDate(calendarRec, plainRelativeTo, end, differenceOptions);
    const years = GetSlot(untilResult, YEARS);
    const months = GetSlot(untilResult, MONTHS);
    const weeks = GetSlot(untilResult, WEEKS);
    let days = GetSlot(untilResult, DAYS);
    // Signs of date part and time part may not agree; balance them together
    let hours, minutes, seconds, milliseconds, microseconds, nanoseconds;
    ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(
      norm1.add(norm2).add24HourDays(days),
      largestUnit
    ));
    return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }

  // zonedRelativeTo is defined
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  const calendar = GetSlot(zonedRelativeTo, CALENDAR);
  const startInstant = GetSlot(zonedRelativeTo, INSTANT);
  let startDateTime;
  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
    startDateTime = GetPlainDateTimeFor(timeZoneRec, startInstant, calendar);
  }
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
    const norm = TimeDuration.fromEpochNsDiff(endNs, GetSlot(zonedRelativeTo, EPOCHNANOSECONDS));
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, largestUnit);
    return new Duration(0, 0, 0, 0, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  }

  const { years, months, weeks, days, norm } = DifferenceZonedDateTime(
    GetSlot(zonedRelativeTo, EPOCHNANOSECONDS),
    endNs,
    timeZoneRec,
    calendarRec,
    largestUnit,
    ObjectCreate(null),
    startDateTime
  );
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = BalanceTimeDuration(norm, 'hour');
  return new Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
}

export function AddDurationToOrSubtractDurationFromInstant(instant, durationLike) {
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToLimitedTemporalDuration(durationLike, [
    'years',
    'months',
    'weeks',
    'days'
  ]);
  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), norm);
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ns);
}

export function AddDurationToOrSubtractDurationFromPlainDateTime(dateTime, durationLike, options) {
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);

  const calendarRec = new CalendarMethodRecord(GetSlot(dateTime, CALENDAR), ['dateAdd']);

  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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
    years,
    months,
    weeks,
    days,
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

export function AddDurationToOrSubtractDurationFromPlainTime(temporalTime, durationLike) {
  const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ToTemporalDurationRecord(durationLike);
  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
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

export function AddDurationToOrSubtractDurationFromPlainYearMonth(yearMonth, durationLike, options) {
  let duration = ToTemporalDurationRecord(durationLike);
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

  const { fields, fieldNames } = PrepareCalendarFieldsAndFieldNames(calendarRec, yearMonth, ['monthCode', 'year']);
  const fieldsCopy = SnapshotOwnProperties(fields, null);
  fields.day = 1;
  let startDate = CalendarDateFromFields(calendarRec, fields);
  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (sign < 0) {
    const oneMonthDuration = new Duration(0, 1, 0, 0, 0, 0, 0, 0, 0, 0);
    const nextMonth = CalendarDateAdd(calendarRec, startDate, oneMonthDuration);
    const endOfMonthISO = BalanceISODate(
      GetSlot(nextMonth, ISO_YEAR),
      GetSlot(nextMonth, ISO_MONTH),
      GetSlot(nextMonth, ISO_DAY) - 1
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

export function AddDurationToOrSubtractDurationFromZonedDateTime(zonedDateTime, durationLike, options) {
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ToTemporalDurationRecord(durationLike);
  options = GetOptionsObject(options);
  const timeZoneRec = new TimeZoneMethodRecord(GetSlot(zonedDateTime, TIME_ZONE), [
    'getOffsetNanosecondsFor',
    'getPossibleInstantsFor'
  ]);
  const calendarRec = new CalendarMethodRecord(GetSlot(zonedDateTime, CALENDAR), ['dateAdd']);
  const norm = TimeDuration.normalize(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  const epochNanoseconds = AddZonedDateTime(
    GetSlot(zonedDateTime, INSTANT),
    timeZoneRec,
    calendarRec,
    years,
    months,
    weeks,
    days,
    norm,
    undefined,
    options
  );
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZoneRec.receiver, calendarRec.receiver);
}

export function RoundNumberToIncrement(quantity, increment, mode) {
  const quotient = MathTrunc(quantity / increment);
  const remainder = quantity % increment;
  const sign = quantity < 0 ? 'negative' : 'positive';
  const r1 = MathAbs(quotient);
  const r2 = r1 + 1;
  const cmp = ComparisonResult(MathAbs(remainder * 2) - increment);
  const even = r1 % 2 === 0;
  const unsignedRoundingMode = GetUnsignedRoundingMode(mode, sign);
  const rounded =
    MathAbs(quantity) === r1 * increment ? r1 : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
  return increment * (sign === 'positive' ? rounded : -rounded);
}

export function RoundNumberToIncrementAsIfPositive(quantity, increment, mode) {
  const { quotient, remainder } = quantity.divmod(increment);
  const unsignedRoundingMode = GetUnsignedRoundingMode(mode, 'positive');
  let r1, r2;
  if (quantity.lt(0)) {
    r1 = quotient.add(-1);
    r2 = quotient;
  } else {
    r1 = quotient;
    r2 = quotient.add(1);
  }
  const cmp = remainder.times(2).abs().compare(increment) * (quantity.lt(0) ? -1 : 1);
  const even = r1.isEven();
  const rounded = quotient.times(increment).eq(quantity)
    ? quotient
    : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
  return rounded.times(increment);
}

export function RoundTemporalInstant(epochNs, increment, unit, roundingMode) {
  const incrementNs = NS_PER_TIME_UNIT.get(unit) * increment;
  return RoundNumberToIncrementAsIfPositive(epochNs, incrementNs, roundingMode);
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
  roundingMode
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
    roundingMode
  ));
  ({ year, month, day } = BalanceISODate(year, month, day + deltaDays));
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
}

export function RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode) {
  let quantity;
  switch (unit) {
    case 'day':
    case 'hour':
      quantity = ((((hour * 60 + minute) * 60 + second) * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
      break;
    case 'minute':
      quantity = (((minute * 60 + second) * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
      break;
    case 'second':
      quantity = ((second * 1000 + millisecond) * 1000 + microsecond) * 1000 + nanosecond;
      break;
    case 'millisecond':
      quantity = (millisecond * 1000 + microsecond) * 1000 + nanosecond;
      break;
    case 'microsecond':
      quantity = microsecond * 1000 + nanosecond;
      break;
    case 'nanosecond':
      quantity = nanosecond;
  }
  const nsPerUnit = NS_PER_TIME_UNIT.get(unit);
  const result = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode) / nsPerUnit;
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

export function RoundTimeDuration(days, norm, increment, unit, roundingMode) {
  // unit must not be a calendar unit

  let total;
  if (unit === 'day') {
    // First convert time units up to days
    const { quotient, remainder } = norm.divmod(DAY_NANOS);
    days += quotient;
    total = days + remainder.fdiv(DAY_NANOS);
    days = RoundNumberToIncrement(total, increment, roundingMode);
    norm = TimeDuration.ZERO;
  } else {
    const divisor = NS_PER_TIME_UNIT.get(unit);
    total = norm.fdiv(divisor);
    norm = norm.round(divisor * increment, roundingMode);
  }
  CombineDateAndNormalizedTimeDuration(0, 0, 0, days, norm);
  return { days, norm, total };
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
  let lowercase = '';
  for (let ix = 0; ix < str.length; ix++) {
    const code = Call(StringPrototypeCharCodeAt, str, [ix]);
    if (code >= 0x41 && code <= 0x5a) {
      lowercase += StringFromCharCode(code + 0x20);
    } else {
      lowercase += StringFromCharCode(code);
    }
  }
  return lowercase;
}

// %TemporalValueOf%
class DummyValueOf {
  valueOf() {
    let constructorName;
    if (IsTemporalDuration(this)) {
      constructorName = 'Duration';
    } else if (IsTemporalInstant(this)) {
      constructorName = 'Instant';
    } else if (IsTemporalDate(this)) {
      constructorName = 'PlainDate';
    } else if (IsTemporalDateTime(this)) {
      constructorName = 'PlainDateTime';
    } else if (IsTemporalMonthDay(this)) {
      constructorName = 'PlainMonthDay';
    } else if (IsTemporalTime(this)) {
      constructorName = 'PlainTime';
    } else if (IsTemporalYearMonth(this)) {
      constructorName = 'PlainYearMonth';
    } else if (IsTemporalZonedDateTime(this)) {
      constructorName = 'ZonedDateTime';
    } else {
      throw new TypeError('invalid receiver');
    }

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
}
DefineIntrinsic('TemporalValueOf', DummyValueOf.prototype.valueOf);

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
