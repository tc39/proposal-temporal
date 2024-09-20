/* global __debug__ */

import {
  // constructors and similar
  BigInt as BigIntCtor,
  Date as DateCtor,
  Map as MapCtor,
  Number as NumberCtor,
  RegExp as RegExpCtor,
  Set as SetCtor,
  String as StringCtor,
  Symbol as SymbolCtor,

  // error constructors
  Error as ErrorCtor,
  RangeError as RangeErrorCtor,
  SyntaxError as SyntaxErrorCtor,
  TypeError as TypeErrorCtor,

  // class static functions and methods
  ArrayPrototypeConcat,
  ArrayPrototypeEvery,
  ArrayPrototypeFilter,
  ArrayPrototypeFlatMap,
  ArrayPrototypeIncludes,
  ArrayPrototypeIndexOf,
  ArrayPrototypeJoin,
  ArrayPrototypeMap,
  ArrayPrototypePush,
  ArrayPrototypeReduce,
  ArrayPrototypeSort,
  DateNow,
  DatePrototypeGetTime,
  DatePrototypeGetUTCFullYear,
  DatePrototypeGetUTCMonth,
  DatePrototypeGetUTCDate,
  DatePrototypeGetUTCHours,
  DatePrototypeGetUTCMinutes,
  DatePrototypeGetUTCSeconds,
  DatePrototypeGetUTCMilliseconds,
  DatePrototypeSetUTCFullYear,
  DatePrototypeSetUTCHours,
  IntlDateTimeFormat,
  IntlDateTimeFormatPrototypeGetFormat,
  IntlDateTimeFormatPrototypeResolvedOptions,
  IntlSupportedValuesOf,
  MapPrototypeGet,
  MapPrototypeHas,
  MapPrototypeSet,
  MathAbs,
  MathFloor,
  MathMax,
  MathMin,
  MathSign,
  MathTrunc,
  NumberIsFinite,
  NumberIsNaN,
  NumberIsSafeInteger,
  NumberMaxSafeInteger,
  NumberPrototypeToString,
  ObjectAssign,
  ObjectCreate,
  ObjectDefineProperty,
  RegExpPrototypeExec,
  RegExpPrototypeTest,
  SetPrototypeHas,
  StringFromCharCode,
  StringPrototypeCharCodeAt,
  StringPrototypeMatch,
  StringPrototypeReplace,
  StringPrototypeSlice,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
  StringPrototypeToUpperCase
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';
import CopyDataProperties from 'es-abstract/2024/CopyDataProperties.js';
import GetMethod from 'es-abstract/2024/GetMethod.js';
import HasOwnProperty from 'es-abstract/2024/HasOwnProperty.js';
import IsIntegralNumber from 'es-abstract/2024/IsIntegralNumber.js';
import ToNumber from 'es-abstract/2024/ToNumber.js';
import ToObject from 'es-abstract/2024/ToObject.js';
import ToPrimitive from 'es-abstract/2024/ToPrimitive.js';
import ToString from 'es-abstract/2024/ToString.js';
import ToZeroPaddedDecimalString from 'es-abstract/2024/ToZeroPaddedDecimalString.js';
import Type from 'es-abstract/2024/Type.js';

import { GetIntrinsic } from './intrinsicclass.mjs';
import {
  ApplyUnsignedRoundingMode,
  FMAPowerOf10,
  GetUnsignedRoundingMode,
  TruncatingDivModByPowerOf10
} from './math.mjs';
import { TimeDuration } from './timeduration.mjs';
import {
  CreateSlots,
  GetSlot,
  HasSlot,
  SetSlot,
  EPOCHNANOSECONDS,
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

import bigInt from 'big-integer';

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
  'ethiopic-amete-alem',
  'coptic',
  'chinese',
  'dangi',
  'roc',
  'indian',
  'buddhist',
  'japanese',
  'gregory'
];

const ICU_LEGACY_TIME_ZONE_IDS = new SetCtor([
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
    throw new RangeErrorCtor('invalid number value');
  }
  const integer = MathTrunc(number);
  if (integer === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return integer;
}

export function ToPositiveIntegerWithTruncation(value, property) {
  const integer = ToIntegerWithTruncation(value);
  if (integer <= 0) {
    if (property !== undefined) {
      throw new RangeErrorCtor(`property '${property}' cannot be a a number less than one`);
    }
    throw new RangeErrorCtor('Cannot convert a number less than one to a positive integer');
  }
  return integer;
}

export function ToIntegerIfIntegral(value) {
  const number = ToNumber(value);
  if (!NumberIsFinite(number)) throw new RangeErrorCtor('infinity is out of range');
  if (!IsIntegralNumber(number)) throw new RangeErrorCtor(`unsupported fractional value ${value}`);
  if (number === 0) return 0; // ℝ(value) in spec text; converts -0 to 0
  return number;
}

// This convenience function isn't in the spec, but is useful in the polyfill
// for DRY and better error messages.
export function RequireString(value) {
  if (Type(value) !== 'String') {
    // Use String() to ensure that Symbols won't throw
    throw new TypeErrorCtor(`expected a string, not ${StringCtor(value)}`);
  }
  return value;
}

// This function is an enum in the spec, but it's helpful to make it a
// function in the polyfill.
function ToPrimitiveAndRequireString(value) {
  value = ToPrimitive(value, StringCtor);
  return RequireString(value);
}

const CALENDAR_FIELD_KEYS = [
  'era',
  'eraYear',
  'year',
  'month',
  'monthCode',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
  'microsecond',
  'nanosecond',
  'offset',
  'timeZone'
];

const BUILTIN_CASTS = new MapCtor([
  ['era', ToString],
  ['eraYear', ToIntegerWithTruncation],
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
  ['offset', ToPrimitiveAndRequireString],
  ['timeZone', ToTemporalTimeZoneIdentifier]
]);

const BUILTIN_DEFAULTS = new MapCtor([
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
const SINGULAR_FOR = new MapCtor(TEMPORAL_UNITS);
// Iterable destructuring is acceptable in this first-run code.
const PLURAL_FOR = new MapCtor(Call(ArrayPrototypeMap, TEMPORAL_UNITS, [([p, s]) => [s, p]]));
const UNITS_DESCENDING = Call(ArrayPrototypeMap, TEMPORAL_UNITS, [([, s]) => s]);
const NS_PER_TIME_UNIT = new MapCtor(
  Call(ArrayPrototypeFlatMap, TEMPORAL_UNITS, [([, s, , l]) => (l ? [[s, l]] : [])])
);

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

export { Call, CopyDataProperties, GetMethod, HasOwnProperty, ToNumber, ToObject, ToString, Type };

const IntlDateTimeFormatEnUsCache = new MapCtor();

function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier) {
  const lowercaseIdentifier = ASCIILowercase(timeZoneIdentifier);
  let instance = Call(MapPrototypeGet, IntlDateTimeFormatEnUsCache, [lowercaseIdentifier]);
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
    Call(MapPrototypeSet, IntlDateTimeFormatEnUsCache, [lowercaseIdentifier, instance]);
  }
  return instance;
}

export function IsTemporalInstant(item) {
  return HasSlot(item, EPOCHNANOSECONDS) && !HasSlot(item, TIME_ZONE, CALENDAR);
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
    throw new TypeErrorCtor('with() does not support a calendar or timeZone property');
  }
  if (IsTemporalTime(item)) {
    throw new TypeErrorCtor('with() does not accept Temporal.PlainTime, use withPlainTime() instead');
  }
  if (item.calendar !== undefined) {
    throw new TypeErrorCtor('with() does not support a calendar property');
  }
  if (item.timeZone !== undefined) {
    throw new TypeErrorCtor('with() does not support a timeZone property');
  }
}

export function MaybeFormatCalendarAnnotation(calendar, showCalendar) {
  if (showCalendar === 'never') return '';
  return FormatCalendarAnnotation(calendar, showCalendar);
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
  // Avoid the user code minefield of matchAll.
  let match;
  PARSE.annotation.lastIndex = 0;
  while ((match = Call(RegExpPrototypeExec, PARSE.annotation, [annotations]))) {
    const { 1: critical, 2: key, 3: value } = match;
    if (key === 'u-ca') {
      if (calendar === undefined) {
        calendar = value;
        calendarWasCritical = critical === '!';
      } else if (critical === '!' || calendarWasCritical) {
        throw new RangeErrorCtor(
          `Invalid annotations in ${annotations}: more than one u-ca present with critical flag`
        );
      }
    } else if (critical === '!') {
      throw new RangeErrorCtor(`Unrecognized annotation: !${key}=${value}`);
    }
  }
  return calendar;
}

export function ParseISODateTime(isoString) {
  // ZDT is the superset of fields for every other Temporal type
  const match = Call(RegExpPrototypeExec, PARSE.zoneddatetime, [isoString]);
  if (!match) throw new RangeErrorCtor(`invalid ISO 8601 string: ${isoString}`);
  const calendar = processAnnotations(match[16]);
  let yearString = match[1];
  if (yearString === '-000000') throw new RangeErrorCtor(`invalid ISO 8601 string: ${isoString}`);
  const year = +yearString;
  const month = +(match[2] ?? match[4] ?? 1);
  const day = +(match[3] ?? match[5] ?? 1);
  const hasTime = match[6] !== undefined;
  const hour = +(match[6] ?? 0);
  const minute = +(match[7] ?? match[10] ?? 0);
  let second = +(match[8] ?? match[11] ?? 0);
  if (second === 60) second = 59;
  const fraction = (match[9] ?? match[12] ?? '') + '000000000';
  const millisecond = +Call(StringPrototypeSlice, fraction, [0, 3]);
  const microsecond = +Call(StringPrototypeSlice, fraction, [3, 6]);
  const nanosecond = +Call(StringPrototypeSlice, fraction, [6, 9]);
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
    time: hasTime ? { hour, minute, second, millisecond, microsecond, nanosecond } : 'start-of-day',
    tzAnnotation,
    offset,
    z,
    calendar
  };
}

export function ParseTemporalInstantString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.z && !result.offset) throw new RangeErrorCtor('Temporal.Instant requires a time zone offset');
  return result;
}

export function ParseTemporalZonedDateTimeString(isoString) {
  const result = ParseISODateTime(isoString);
  if (!result.tzAnnotation) throw new RangeErrorCtor('Temporal.ZonedDateTime requires a time zone ID in brackets');
  return result;
}

export function ParseTemporalDateTimeString(isoString) {
  return ParseISODateTime(isoString);
}

export function ParseTemporalDateString(isoString) {
  return ParseISODateTime(isoString);
}

export function ParseTemporalTimeString(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.time, [isoString]);
  let hour, minute, second, millisecond, microsecond, nanosecond;
  if (match) {
    processAnnotations(match[10]); // ignore found calendar
    hour = +(match[1] ?? 0);
    minute = +(match[2] ?? match[5] ?? 0);
    second = +(match[3] ?? match[6] ?? 0);
    if (second === 60) second = 59;
    const fraction = (match[4] ?? match[7] ?? '') + '000000000';
    millisecond = +Call(StringPrototypeSlice, fraction, [0, 3]);
    microsecond = +Call(StringPrototypeSlice, fraction, [3, 6]);
    nanosecond = +Call(StringPrototypeSlice, fraction, [6, 9]);
    if (match[8]) throw new RangeErrorCtor('Z designator not supported for PlainTime');
  } else {
    const { time, z } = ParseISODateTime(isoString);
    if (time === 'start-of-day') throw new RangeErrorCtor(`time is missing in string: ${isoString}`);
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainTime');
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = time);
  }
  // if it's a date-time string, OK
  if (Call(RegExpPrototypeTest, /[tT ][0-9][0-9]/, [isoString])) {
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
  throw new RangeErrorCtor(`invalid ISO 8601 time-only string ${isoString}; may need a T prefix`);
}

export function ParseTemporalYearMonthString(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.yearmonth, [isoString]);
  let year, month, calendar, referenceISODay;
  if (match) {
    calendar = processAnnotations(match[3]);
    let yearString = match[1];
    if (yearString === '-000000') throw new RangeErrorCtor(`invalid ISO 8601 string: ${isoString}`);
    year = +yearString;
    month = +match[2];
    referenceISODay = 1;
    if (calendar !== undefined && calendar !== 'iso8601') {
      throw new RangeErrorCtor('YYYY-MM format is only valid with iso8601 calendar');
    }
  } else {
    let z;
    ({ year, month, calendar, day: referenceISODay, z } = ParseISODateTime(isoString));
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainYearMonth');
  }
  return { year, month, calendar, referenceISODay };
}

export function ParseTemporalMonthDayString(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.monthday, [isoString]);
  let month, day, calendar, referenceISOYear;
  if (match) {
    calendar = processAnnotations(match[3]);
    month = +match[1];
    day = +match[2];
    if (calendar !== undefined && calendar !== 'iso8601') {
      throw new RangeErrorCtor('MM-DD format is only valid with iso8601 calendar');
    }
  } else {
    let z;
    ({ month, day, calendar, year: referenceISOYear, z } = ParseISODateTime(isoString));
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainMonthDay');
  }
  return { month, day, calendar, referenceISOYear };
}

const TIMEZONE_IDENTIFIER = new RegExpCtor(`^${PARSE.timeZoneID.source}$`, 'i');
const OFFSET_IDENTIFIER = new RegExpCtor(`^${PARSE.offsetIdentifier.source}$`);

function throwBadTimeZoneStringError(timeZoneString) {
  // Offset identifiers only support minute precision, but offsets in ISO
  // strings support nanosecond precision. If the identifier is invalid but
  // it's a valid ISO offset, then it has sub-minute precision. Show a clearer
  // error message in that case.
  const msg = Call(RegExpPrototypeTest, OFFSET, [timeZoneString])
    ? 'Seconds not allowed in offset time zone'
    : 'Invalid time zone';
  throw new RangeErrorCtor(`${msg}: ${timeZoneString}`);
}

export function ParseTimeZoneIdentifier(identifier) {
  if (!Call(RegExpPrototypeTest, TIMEZONE_IDENTIFIER, [identifier])) {
    throwBadTimeZoneStringError(identifier);
  }
  if (Call(RegExpPrototypeTest, OFFSET_IDENTIFIER, [identifier])) {
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
  if (Call(RegExpPrototypeTest, TIMEZONE_IDENTIFIER, [timeZoneString])) {
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
  throw new ErrorCtor('this line should not be reached');
}

export function ParseTemporalDurationStringRaw(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.duration, [isoString]);
  if (!match) throw new RangeErrorCtor(`invalid duration: ${isoString}`);
  if (Call(ArrayPrototypeEvery, match, [(part, i) => i < 2 || part === undefined])) {
    throw new RangeErrorCtor(`invalid duration: ${isoString}`);
  }
  const sign = match[1] === '-' ? -1 : 1;
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
      throw new RangeErrorCtor('only the smallest unit can be fractional');
    }
    excessNanoseconds = ToIntegerWithTruncation(Call(StringPrototypeSlice, fHours + '000000000', [0, 9])) * 3600 * sign;
  } else {
    minutes = minutesStr === undefined ? 0 : ToIntegerWithTruncation(minutesStr) * sign;
    if (fMinutes !== undefined) {
      if (secondsStr ?? fSeconds ?? false) {
        throw new RangeErrorCtor('only the smallest unit can be fractional');
      }
      excessNanoseconds =
        ToIntegerWithTruncation(Call(StringPrototypeSlice, fMinutes + '000000000', [0, 9])) * 60 * sign;
    } else {
      seconds = secondsStr === undefined ? 0 : ToIntegerWithTruncation(secondsStr) * sign;
      if (fSeconds !== undefined) {
        excessNanoseconds = ToIntegerWithTruncation(Call(StringPrototypeSlice, fSeconds + '000000000', [0, 9])) * sign;
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

function ParseTemporalDurationString(isoString) {
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } =
    ParseTemporalDurationStringRaw(isoString);
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

export function ToTemporalPartialDurationRecord(temporalDurationLike) {
  if (Type(temporalDurationLike) !== 'Object') {
    throw new TypeErrorCtor('invalid duration-like');
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
    throw new TypeErrorCtor('invalid duration-like');
  }
  return result;
}

export function AdjustDateDurationRecord({ years, months, weeks, days }, newDays, newWeeks, newMonths) {
  return {
    years,
    months: newMonths ?? months,
    weeks: newWeeks ?? weeks,
    days: newDays ?? days
  };
}

function ZeroDateDuration() {
  return { years: 0, months: 0, weeks: 0, days: 0 };
}

function ZeroNormalizedDuration() {
  return {
    date: ZeroDateDuration(),
    norm: TimeDuration.ZERO
  };
}

export function TemporalObjectToISODateRecord(temporalObject) {
  return {
    year: GetSlot(temporalObject, ISO_YEAR),
    month: GetSlot(temporalObject, ISO_MONTH),
    day: GetSlot(temporalObject, ISO_DAY)
  };
}

export function PlainDateTimeToISODateTimeRecord(plainDateTime) {
  return {
    year: GetSlot(plainDateTime, ISO_YEAR),
    month: GetSlot(plainDateTime, ISO_MONTH),
    day: GetSlot(plainDateTime, ISO_DAY),
    hour: GetSlot(plainDateTime, ISO_HOUR),
    minute: GetSlot(plainDateTime, ISO_MINUTE),
    second: GetSlot(plainDateTime, ISO_SECOND),
    millisecond: GetSlot(plainDateTime, ISO_MILLISECOND),
    microsecond: GetSlot(plainDateTime, ISO_MICROSECOND),
    nanosecond: GetSlot(plainDateTime, ISO_NANOSECOND)
  };
}

function ISODateTimeToDateRecord({ year, month, day }) {
  return { year, month, day };
}

export function CombineISODateAndTimeRecord(date, time) {
  const { year, month, day } = date;
  const { hour, minute, second, millisecond, microsecond, nanosecond } = time;
  return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
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

export function NegateRoundingMode(roundingMode) {
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

export function GetDirectionOption(options) {
  return GetOption(options, 'direction', ['next', 'previous'], REQUIRED);
}

export function GetRoundingIncrementOption(options) {
  let increment = options.roundingIncrement;
  if (increment === undefined) return 1;
  const integerIncrement = ToIntegerWithTruncation(increment);
  if (integerIncrement < 1 || integerIncrement > 1e9) {
    throw new RangeErrorCtor(`roundingIncrement must be at least 1 and at most 1e9, not ${increment}`);
  }
  return integerIncrement;
}

export function ValidateTemporalRoundingIncrement(increment, dividend, inclusive) {
  const maximum = inclusive ? dividend : dividend - 1;
  if (increment > maximum) {
    throw new RangeErrorCtor(`roundingIncrement must be at least 1 and less than ${maximum}, not ${increment}`);
  }
  if (dividend % increment !== 0) {
    throw new RangeErrorCtor(`Rounding increment must divide evenly into ${dividend}`);
  }
}

export function GetTemporalFractionalSecondDigitsOption(options) {
  let digitsValue = options.fractionalSecondDigits;
  if (digitsValue === undefined) return 'auto';
  if (Type(digitsValue) !== 'Number') {
    if (ToString(digitsValue) !== 'auto') {
      throw new RangeErrorCtor(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
    }
    return 'auto';
  }
  const digitCount = MathFloor(digitsValue);
  if (!NumberIsFinite(digitCount) || digitCount < 0 || digitCount > 9) {
    throw new RangeErrorCtor(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsValue}`);
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

export const REQUIRED = SymbolCtor('~required~');

export function GetTemporalUnitValuedOption(options, key, unitGroup, requiredOrDefault, extraValues = []) {
  const allowedSingular = [];
  for (let index = 0; index < TEMPORAL_UNITS.length; index++) {
    const unitInfo = TEMPORAL_UNITS[index];
    const singular = unitInfo[1];
    const category = unitInfo[2];
    if (unitGroup === 'datetime' || unitGroup === category) {
      Call(ArrayPrototypePush, allowedSingular, [singular]);
    }
  }
  Call(ArrayPrototypePush, allowedSingular, extraValues);
  let defaultVal = requiredOrDefault;
  if (defaultVal === REQUIRED) {
    defaultVal = undefined;
  } else if (defaultVal !== undefined) {
    Call(ArrayPrototypePush, allowedSingular, [defaultVal]);
  }
  const allowedValues = [];
  Call(ArrayPrototypePush, allowedValues, allowedSingular);
  for (let index = 0; index < allowedSingular.length; index++) {
    const singular = allowedSingular[index];
    const plural = Call(MapPrototypeGet, PLURAL_FOR, [singular]);
    if (plural !== undefined) Call(ArrayPrototypePush, allowedValues, [plural]);
  }
  let retval = GetOption(options, key, allowedValues, defaultVal);
  if (retval === undefined && requiredOrDefault === REQUIRED) {
    throw new RangeErrorCtor(`${key} is required`);
  }
  if (Call(MapPrototypeHas, SINGULAR_FOR, [retval])) retval = Call(MapPrototypeGet, SINGULAR_FOR, [retval]);
  return retval;
}

export function GetTemporalRelativeToOption(options) {
  // returns: {
  //   plainRelativeTo: Temporal.PlainDate | undefined
  //   zonedRelativeTo: Temporal.ZonedDateTime | undefined
  // }
  // plainRelativeTo and zonedRelativeTo are mutually exclusive.
  const relativeTo = options.relativeTo;
  if (relativeTo === undefined) return {};

  let offsetBehaviour = 'option';
  let matchMinutes = false;
  let year, month, day, time, calendar, timeZone, offset;
  if (Type(relativeTo) === 'Object') {
    if (IsTemporalZonedDateTime(relativeTo)) {
      return { zonedRelativeTo: relativeTo };
    }
    if (IsTemporalDate(relativeTo)) return { plainRelativeTo: relativeTo };
    if (IsTemporalDateTime(relativeTo)) return { plainRelativeTo: TemporalDateTimeToDate(relativeTo) };
    calendar = GetTemporalCalendarIdentifierWithISODefault(relativeTo);
    const fields = PrepareCalendarFields(
      calendar,
      relativeTo,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'],
      []
    );
    ({ year, month, day, time } = InterpretTemporalDateTimeFields(calendar, fields, 'constrain'));
    offset = fields.offset;
    if (offset === undefined) offsetBehaviour = 'wall';
    timeZone = fields.timeZone;
    if (timeZone !== undefined) timeZone = ToTemporalTimeZoneIdentifier(timeZone);
  } else {
    let tzAnnotation, z;
    ({ year, month, day, time, calendar, tzAnnotation, offset, z } = ParseISODateTime(RequireString(relativeTo)));
    if (tzAnnotation) {
      timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
      if (z) {
        offsetBehaviour = 'exact';
      } else if (!offset) {
        offsetBehaviour = 'wall';
      }
      matchMinutes = true;
    } else if (z) {
      throw new RangeErrorCtor(
        'Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone'
      );
    }
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
    calendar = CanonicalizeCalendar(calendar);
  }
  if (timeZone === undefined) return { plainRelativeTo: CreateTemporalDate(year, month, day, calendar) };
  const offsetNs = offsetBehaviour === 'option' ? ParseDateTimeUTCOffset(offset) : 0;
  const epochNanoseconds = InterpretISODateTimeOffset(
    year,
    month,
    day,
    time,
    offsetBehaviour,
    offsetNs,
    timeZone,
    'compatible',
    'reject',
    matchMinutes
  );
  return { zonedRelativeTo: CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar) };
}

export function DefaultTemporalLargestUnit(duration) {
  if (GetSlot(duration, YEARS) !== 0) return 'year';
  if (GetSlot(duration, MONTHS) !== 0) return 'month';
  if (GetSlot(duration, WEEKS) !== 0) return 'week';
  if (GetSlot(duration, DAYS) !== 0) return 'day';
  if (GetSlot(duration, HOURS) !== 0) return 'hour';
  if (GetSlot(duration, MINUTES) !== 0) return 'minute';
  if (GetSlot(duration, SECONDS) !== 0) return 'second';
  if (GetSlot(duration, MILLISECONDS) !== 0) return 'millisecond';
  if (GetSlot(duration, MICROSECONDS) !== 0) return 'microsecond';
  return 'nanosecond';
}

export function LargerOfTwoTemporalUnits(unit1, unit2) {
  const i1 = Call(ArrayPrototypeIndexOf, UNITS_DESCENDING, [unit1]);
  const i2 = Call(ArrayPrototypeIndexOf, UNITS_DESCENDING, [unit2]);
  if (i1 > i2) {
    return unit2;
  }
  return unit1;
}

export function IsCalendarUnit(unit) {
  return unit === 'year' || unit === 'month' || unit === 'week';
}

export function TemporalObjectToFields(temporalObject) {
  const calendar = GetSlot(temporalObject, CALENDAR);
  const isoDate = TemporalObjectToISODateRecord(temporalObject);
  let type = 'date';
  if (IsTemporalYearMonth(temporalObject)) {
    type = 'year-month';
  } else if (IsTemporalMonthDay(temporalObject)) {
    type = 'month-day';
  }
  return ISODateToFields(calendar, isoDate, type);
}

export function ISODateToFields(calendar, isoDate, type = 'date') {
  const fields = ObjectCreate(null);
  fields.monthCode = CalendarMonthCode(calendar, isoDate);
  if (type === 'month-day' || type === 'date') {
    fields.day = CalendarDay(calendar, isoDate);
  }
  if (type === 'year-month' || type === 'date') {
    fields.year = CalendarYear(calendar, isoDate);
  }
  return fields;
}

export function PrepareCalendarFields(calendar, bag, calendarFieldNames, nonCalendarFieldNames, requiredFields) {
  const extraFieldNames = GetIntrinsic('%calendarImpl%')(calendar).extraFields();
  const fields = Call(ArrayPrototypeConcat, calendarFieldNames, [nonCalendarFieldNames, extraFieldNames]);
  const result = ObjectCreate(null);
  let any = false;
  Call(ArrayPrototypeSort, fields, []);
  for (let index = 0; index < fields.length; index++) {
    const property = fields[index];
    const value = bag[property];
    if (value !== undefined) {
      any = true;
      result[property] = Call(MapPrototypeGet, BUILTIN_CASTS, [property])(value);
    } else if (requiredFields !== 'partial') {
      if (Call(ArrayPrototypeIncludes, requiredFields, [property])) {
        throw new TypeErrorCtor(`required property '${property}' missing or undefined`);
      }
      result[property] = Call(MapPrototypeGet, BUILTIN_DEFAULTS, [property]);
    }
  }
  if (requiredFields === 'partial' && !any) {
    throw new TypeErrorCtor('no supported properties found');
  }
  return result;
}

export function ToTemporalTimeRecord(bag, completeness = 'complete') {
  const fields = ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'];
  let any = false;
  const result = ObjectCreate(null);
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    const value = bag[field];
    if (value !== undefined) {
      result[field] = ToIntegerWithTruncation(value);
      any = true;
    } else if (completeness === 'complete') {
      result[field] = 0;
    }
  }
  if (!any) throw new TypeErrorCtor('invalid time-like');
  return result;
}

export function ToTemporalDate(item, options = undefined) {
  if (Type(item) === 'Object') {
    if (IsTemporalDate(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return item;
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
      return CreateTemporalDate(isoDateTime.year, isoDateTime.month, isoDateTime.day, GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
      return CreateTemporalDate(
        GetSlot(item, ISO_YEAR),
        GetSlot(item, ISO_MONTH),
        GetSlot(item, ISO_DAY),
        GetSlot(item, CALENDAR)
      );
    }
    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], [], []);
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const { year, month, day } = CalendarDateFromFields(calendar, fields, overflow);
    return CreateTemporalDate(year, month, day, calendar);
  }
  let { year, month, day, calendar, z } = ParseTemporalDateString(RequireString(item));
  if (z) throw new RangeErrorCtor('Z designator not supported for PlainDate');
  if (!calendar) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
  calendar = CanonicalizeCalendar(calendar);
  GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
  return CreateTemporalDate(year, month, day, calendar);
}

export function InterpretTemporalDateTimeFields(calendar, fields, overflow) {
  const isoDate = CalendarDateFromFields(calendar, fields, overflow);
  const time = RegulateTime(
    fields.hour,
    fields.minute,
    fields.second,
    fields.millisecond,
    fields.microsecond,
    fields.nanosecond,
    overflow
  );
  return { ...isoDate, time };
}

export function ToTemporalDateTime(item, options = undefined) {
  let year, month, day, time, calendar;

  if (Type(item) === 'Object') {
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return item;
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalDateTime(
        isoDateTime.year,
        isoDateTime.month,
        isoDateTime.day,
        isoDateTime.hour,
        isoDateTime.minute,
        isoDateTime.second,
        isoDateTime.millisecond,
        isoDateTime.microsecond,
        isoDateTime.nanosecond,
        GetSlot(item, CALENDAR)
      );
    }
    if (IsTemporalDate(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
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

    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(
      calendar,
      item,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second'],
      []
    );
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    ({ year, month, day, time } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
  } else {
    let z;
    ({ year, month, day, time, calendar, z } = ParseTemporalDateTimeString(RequireString(item)));
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainDateTime');
    if (time === 'start-of-day') {
      time = { hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    }
    RejectDateTime(
      year,
      month,
      day,
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond
    );
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
    calendar = CanonicalizeCalendar(calendar);
    GetTemporalOverflowOption(GetOptionsObject(options));
  }
  const { hour, minute, second, millisecond, microsecond, nanosecond } = time;
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
}

export function ToTemporalDuration(item) {
  if (IsTemporalDuration(item)) return item;
  if (Type(item) !== 'Object') {
    return ParseTemporalDurationString(RequireString(item));
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
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  return new TemporalDuration(
    result.years,
    result.months,
    result.weeks,
    result.days,
    result.hours,
    result.minutes,
    result.seconds,
    result.milliseconds,
    result.microseconds,
    result.nanoseconds
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
  const { year, month, day, time, offset, z } = ParseTemporalInstantString(RequireString(item));
  const {
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0
  } = time === 'start-of-day' ? {} : time;

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

export function ToTemporalMonthDay(item, options = undefined) {
  if (Type(item) === 'Object') {
    if (IsTemporalMonthDay(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return item;
    }
    let calendar;
    if (HasSlot(item, CALENDAR)) {
      calendar = GetSlot(item, CALENDAR);
    } else {
      calendar = item.calendar;
      if (calendar === undefined) calendar = 'iso8601';
      calendar = ToTemporalCalendarIdentifier(calendar);
    }
    const fields = PrepareCalendarFields(calendar, item, ['day', 'month', 'monthCode', 'year'], [], []);
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const { year, month, day } = CalendarMonthDayFromFields(calendar, fields, overflow);
    return CreateTemporalMonthDay(month, day, calendar, year);
  }

  let { month, day, referenceISOYear, calendar } = ParseTemporalMonthDayString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
  calendar = CanonicalizeCalendar(calendar);

  GetTemporalOverflowOption(GetOptionsObject(options));
  if (referenceISOYear === undefined) {
    if (calendar !== 'iso8601') {
      throw new ErrorCtor(`assertion failed: missing year with non-"iso8601" calendar identifier ${calendar}`);
    }
    const isoCalendarReferenceYear = 1972; // First leap year after Unix epoch
    return CreateTemporalMonthDay(month, day, calendar, isoCalendarReferenceYear);
  }
  const isoDate = { year: referenceISOYear, month, day };
  const result = ISODateToFields(calendar, isoDate, 'month-day');
  ({ year: referenceISOYear, month, day } = CalendarMonthDayFromFields(calendar, result, 'constrain'));
  return CreateTemporalMonthDay(month, day, calendar, referenceISOYear);
}

export function ToTemporalTime(item, options = undefined) {
  let hour, minute, second, millisecond, microsecond, nanosecond;
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  if (Type(item) === 'Object') {
    if (IsTemporalTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return item;
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options));
      return new TemporalPlainTime(
        isoDateTime.hour,
        isoDateTime.minute,
        isoDateTime.second,
        isoDateTime.millisecond,
        isoDateTime.microsecond,
        isoDateTime.nanosecond
      );
    }
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
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
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
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
    GetTemporalOverflowOption(GetOptionsObject(options));
  }
  return new TemporalPlainTime(hour, minute, second, millisecond, microsecond, nanosecond);
}

export function ToTemporalTimeOrMidnight(item) {
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  if (item === undefined) return new TemporalPlainTime();
  return ToTemporalTime(item);
}

export function ToTemporalYearMonth(item, options = undefined) {
  if (Type(item) === 'Object') {
    if (IsTemporalYearMonth(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return item;
    }
    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(calendar, item, ['month', 'monthCode', 'year'], [], []);
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const { year, month, day } = CalendarYearMonthFromFields(calendar, fields, overflow);
    return CreateTemporalYearMonth(year, month, calendar, day);
  }

  let { year, month, referenceISODay, calendar } = ParseTemporalYearMonthString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
  calendar = CanonicalizeCalendar(calendar);

  const result = ISODateToFields(calendar, { year, month, day: referenceISODay }, 'year-month');
  GetTemporalOverflowOption(GetOptionsObject(options));
  ({ year, month, day: referenceISODay } = CalendarYearMonthFromFields(calendar, result, 'constrain'));
  return CreateTemporalYearMonth(year, month, calendar, referenceISODay);
}

export function InterpretISODateTimeOffset(
  year,
  month,
  day,
  time,
  offsetBehaviour,
  offsetNs,
  timeZone,
  disambiguation,
  offsetOpt,
  matchMinute
) {
  // start-of-day signifies that we had a string such as YYYY-MM-DD[Zone]. It is
  // grammatically not possible to specify a UTC offset in that string, so the
  // behaviour collapses into ~WALL~, which is equivalent to offset: "ignore".
  if (time === 'start-of-day') {
    if (offsetBehaviour !== 'wall' || offsetNs !== 0) {
      throw new ErrorCtor('assertion failure: offset cannot be provided in YYYY-MM-DD[Zone] string');
    }
    return GetStartOfDay(timeZone, { year, month, day });
  }

  const dt = CombineISODateAndTimeRecord({ year, month, day }, time);

  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Instant in the given time zone
    return GetEpochNanosecondsFor(timeZone, dt, disambiguation);
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
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond,
      offsetNs
    );
    ValidateEpochNanoseconds(epochNs);
    return epochNs;
  }

  // "prefer" or "reject"
  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, dt);
  if (possibleEpochNs.length > 0) {
    const utcEpochNs = GetUTCEpochNanoseconds(
      year,
      month,
      day,
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond
    );
    for (let index = 0; index < possibleEpochNs.length; index++) {
      const candidate = possibleEpochNs[index];
      const candidateOffset = utcEpochNs - candidate;
      const roundedCandidateOffset = RoundNumberToIncrement(candidateOffset, 60e9, 'halfExpand');
      if (candidateOffset === offsetNs || (matchMinute && roundedCandidateOffset === offsetNs)) {
        return candidate;
      }
    }
  }

  // the user-provided offset doesn't match any instants for this time
  // zone and date/time.
  if (offsetOpt === 'reject') {
    const offsetStr = FormatUTCOffsetNanoseconds(offsetNs);
    const dtStr = TemporalDateTimeToString(dt, 'iso8601', 'auto');
    throw new RangeErrorCtor(`Offset ${offsetStr} is invalid for ${dtStr} in ${timeZone}`);
  }
  // fall through: offsetOpt === 'prefer', but the offset doesn't match
  // so fall back to use the time zone instead.
  return DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, dt, disambiguation);
}

export function ToTemporalZonedDateTime(item, options = undefined) {
  let year, month, day, time, timeZone, offset, calendar;
  let matchMinute = false;
  let offsetBehaviour = 'option';
  let disambiguation, offsetOpt;
  if (Type(item) === 'Object') {
    if (IsTemporalZonedDateTime(item)) {
      options = GetOptionsObject(options);
      GetTemporalDisambiguationOption(options); // validate and ignore
      GetTemporalOffsetOption(options, 'reject');
      GetTemporalOverflowOption(options);
      return item;
    }
    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(
      calendar,
      item,
      ['day', 'month', 'monthCode', 'year'],
      ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'offset', 'second', 'timeZone'],
      ['timeZone']
    );
    timeZone = ToTemporalTimeZoneIdentifier(fields.timeZone);
    offset = fields.offset;
    if (offset === undefined) {
      offsetBehaviour = 'wall';
    }
    options = GetOptionsObject(options);
    disambiguation = GetTemporalDisambiguationOption(options);
    offsetOpt = GetTemporalOffsetOption(options, 'reject');
    const overflow = GetTemporalOverflowOption(options);
    ({ year, month, day, time } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
  } else {
    let tzAnnotation, z;
    ({ year, month, day, time, tzAnnotation, offset, z, calendar } = ParseTemporalZonedDateTimeString(
      RequireString(item)
    ));
    timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
    if (z) {
      offsetBehaviour = 'exact';
    } else if (!offset) {
      offsetBehaviour = 'wall';
    }
    if (!calendar) calendar = 'iso8601';
    if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
    calendar = CanonicalizeCalendar(calendar);
    matchMinute = true; // ISO strings may specify offset with less precision
    options = GetOptionsObject(options);
    disambiguation = GetTemporalDisambiguationOption(options);
    offsetOpt = GetTemporalOffsetOption(options, 'reject');
    GetTemporalOverflowOption(options); // validate and ignore
  }
  let offsetNs = 0;
  if (offsetBehaviour === 'option') offsetNs = ParseDateTimeUTCOffset(offset);
  const epochNanoseconds = InterpretISODateTimeOffset(
    year,
    month,
    day,
    time,
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
    const repr = TemporalDateToString(result, 'auto');
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
    const iso = {
      year: isoYear,
      month: isoMonth,
      day: isoDay,
      hour: h,
      minute: min,
      second: s,
      millisecond: ms,
      microsecond: µs,
      nanosecond: ns
    };
    let repr = TemporalDateTimeToString(iso, calendar, 'auto');
    ObjectDefineProperty(result, '_repr_', {
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
    const repr = TemporalMonthDayToString(result, 'auto');
    ObjectDefineProperty(result, '_repr_', {
      value: `Temporal.PlainMonthDay <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalMonthDay(isoMonth, isoDay, calendar, referenceISOYear) {
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
    const repr = TemporalYearMonthToString(result, 'auto');
    ObjectDefineProperty(result, '_repr_', {
      value: `Temporal.PlainYearMonth <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalYearMonth(isoYear, isoMonth, calendar, referenceISODay) {
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

  if (typeof __debug__ !== 'undefined' && __debug__) {
    const repr = TemporalZonedDateTimeToString(result, 'auto');
    ObjectDefineProperty(result, '_repr_', {
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

function CalendarFieldKeysPresent(fields) {
  return Call(ArrayPrototypeFilter, CALENDAR_FIELD_KEYS, [(key) => fields[key] !== undefined]);
}

export function CalendarMergeFields(calendar, fields, additionalFields) {
  const additionalKeys = CalendarFieldKeysPresent(additionalFields);
  const overriddenKeys = GetIntrinsic('%calendarImpl%')(calendar).fieldKeysToIgnore(additionalKeys);
  const merged = ObjectCreate(null);
  const fieldsKeys = CalendarFieldKeysPresent(fields);
  for (let ix = 0; ix < CALENDAR_FIELD_KEYS.length; ix++) {
    let propValue = undefined;
    const key = CALENDAR_FIELD_KEYS[ix];
    if (Call(ArrayPrototypeIncludes, fieldsKeys, [key]) && !Call(ArrayPrototypeIncludes, overriddenKeys, [key])) {
      propValue = fields[key];
    }
    if (Call(ArrayPrototypeIncludes, additionalKeys, [key])) {
      propValue = additionalFields[key];
    }
    if (propValue !== undefined) merged[key] = propValue;
  }
  return merged;
}

export function CalendarDateAdd(calendar, isoDate, dateDuration, overflow) {
  return GetIntrinsic('%calendarImpl%')(calendar).dateAdd(isoDate, dateDuration, overflow);
}

export function CalendarDateUntil(calendar, isoDate, isoOtherDate, largestUnit) {
  return GetIntrinsic('%calendarImpl%')(calendar).dateUntil(isoDate, isoOtherDate, largestUnit);
}

export function CalendarYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).year(isoDate);
}

export function CalendarMonth(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).month(isoDate);
}

export function CalendarMonthCode(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).monthCode(isoDate);
}

export function CalendarDay(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).day(isoDate);
}

export function CalendarEra(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).era(isoDate);
}

export function CalendarEraYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).eraYear(isoDate);
}

export function CalendarDayOfWeek(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).dayOfWeek(isoDate);
}

export function CalendarDayOfYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).dayOfYear(isoDate);
}

export function CalendarWeekOfYear(calendar, isoDate) {
  return GetIntrinsic('%calendarDateWeekOfYear%')(calendar, isoDate).week;
}

export function CalendarYearOfWeek(calendar, isoDate) {
  return GetIntrinsic('%calendarDateWeekOfYear%')(calendar, isoDate).year;
}

export function CalendarDaysInWeek(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).daysInWeek(isoDate);
}

export function CalendarDaysInMonth(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).daysInMonth(isoDate);
}

export function CalendarDaysInYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).daysInYear(isoDate);
}

export function CalendarMonthsInYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).monthsInYear(isoDate);
}

export function CalendarInLeapYear(calendar, isoDate) {
  return GetIntrinsic('%calendarImpl%')(calendar).inLeapYear(isoDate);
}

export function ToTemporalCalendarIdentifier(calendarLike) {
  if (Type(calendarLike) === 'Object') {
    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
  }
  const identifier = RequireString(calendarLike);
  if (IsBuiltinCalendar(identifier)) return CanonicalizeCalendar(identifier);
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
  if (!IsBuiltinCalendar(calendar)) throw new RangeErrorCtor(`invalid calendar identifier ${calendar}`);
  return CanonicalizeCalendar(calendar);
}

export function GetTemporalCalendarIdentifierWithISODefault(item) {
  if (HasSlot(item, CALENDAR)) return GetSlot(item, CALENDAR);
  const { calendar } = item;
  if (calendar === undefined) return 'iso8601';
  return ToTemporalCalendarIdentifier(calendar);
}

export function CalendarEquals(one, two) {
  return CanonicalizeCalendar(one) === CanonicalizeCalendar(two);
}

export function CalendarDateFromFields(calendar, fields, overflow) {
  return GetIntrinsic('%calendarImpl%')(calendar).dateFromFields(fields, overflow);
}

export function CalendarYearMonthFromFields(calendar, fields, overflow) {
  return GetIntrinsic('%calendarImpl%')(calendar).yearMonthFromFields(fields, overflow);
}

export function CalendarMonthDayFromFields(calendar, fields, overflow) {
  return GetIntrinsic('%calendarImpl%')(calendar).monthDayFromFields(fields, overflow);
}

export function ToTemporalTimeZoneIdentifier(temporalTimeZoneLike) {
  if (Type(temporalTimeZoneLike) === 'Object') {
    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
  }
  const timeZoneString = RequireString(temporalTimeZoneLike);

  const { tzName, offsetMinutes } = ParseTemporalTimeZoneString(timeZoneString);
  if (offsetMinutes !== undefined) {
    return FormatOffsetTimeZoneIdentifier(offsetMinutes);
  }
  // if offsetMinutes is undefined, then tzName must be present
  const record = GetAvailableNamedTimeZoneIdentifier(tzName);
  if (!record) throw new RangeErrorCtor(`Unrecognized time zone ${tzName}`);
  return record.identifier;
}

export function TimeZoneEquals(one, two) {
  if (one === two) return true;
  const offsetMinutes1 = ParseTimeZoneIdentifier(one).offsetMinutes;
  const offsetMinutes2 = ParseTimeZoneIdentifier(two).offsetMinutes;
  if (offsetMinutes1 === undefined && offsetMinutes2 === undefined) {
    // Calling GetAvailableNamedTimeZoneIdentifier is costly, so (unlike the
    // spec) the polyfill will early-return if one of them isn't recognized. Try
    // the second ID first because it's more likely to be unknown, because it
    // can come from the argument of TimeZone.p.equals as opposed to the first
    // ID which comes from the receiver.
    const idRecord2 = GetAvailableNamedTimeZoneIdentifier(two);
    if (!idRecord2) return false;
    const idRecord1 = GetAvailableNamedTimeZoneIdentifier(one);
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

export function GetOffsetNanosecondsFor(timeZone, epochNs) {
  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
  if (offsetMinutes !== undefined) return offsetMinutes * 60e9;

  return GetNamedTimeZoneOffsetNanoseconds(timeZone, epochNs);
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

export function GetISODateTimeFor(timeZone, epochNs) {
  const offsetNs = GetOffsetNanosecondsFor(timeZone, epochNs);
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = GetISOPartsFromEpoch(epochNs);
  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond + offsetNs);
}

export function GetEpochNanosecondsFor(timeZone, isoDateTime, disambiguation) {
  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, isoDateTime);
  return DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, isoDateTime, disambiguation);
}

// TODO: See if this logic can be removed in favour of GetNamedTimeZoneEpochNanoseconds
export function DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, isoDateTime, disambiguation) {
  const numInstants = possibleEpochNs.length;

  if (numInstants === 1) return possibleEpochNs[0];
  if (numInstants) {
    switch (disambiguation) {
      case 'compatible':
      // fall through because 'compatible' means 'earlier' for "fall back" transitions
      case 'earlier':
        return possibleEpochNs[0];
      case 'later':
        return possibleEpochNs[numInstants - 1];
      case 'reject': {
        throw new RangeErrorCtor('multiple instants found');
      }
    }
  }

  if (disambiguation === 'reject') throw new RangeErrorCtor('multiple instants found');
  const {
    year,
    month,
    day,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0
  } = isoDateTime;
  const utcns = GetUTCEpochNanoseconds(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

  const dayBefore = utcns.minus(DAY_NANOS);
  ValidateEpochNanoseconds(dayBefore);
  const offsetBefore = GetOffsetNanosecondsFor(timeZone, dayBefore);
  const dayAfter = utcns.plus(DAY_NANOS);
  ValidateEpochNanoseconds(dayAfter);
  const offsetAfter = GetOffsetNanosecondsFor(timeZone, dayAfter);
  const nanoseconds = offsetAfter - offsetBefore;
  if (MathAbs(nanoseconds) > DAY_NANOS) {
    throw new ErrorCtor('assertion failure: UTC offset shift longer than 24 hours');
  }

  switch (disambiguation) {
    case 'earlier': {
      const norm = TimeDuration.normalize(0, 0, 0, 0, 0, -nanoseconds);
      const earlierTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
      const earlierDate = BalanceISODate(year, month, day + earlierTime.deltaDays);
      return GetPossibleEpochNanoseconds(timeZone, { ...earlierTime, ...earlierDate })[0];
    }
    case 'compatible':
    // fall through because 'compatible' means 'later' for "spring forward" transitions
    case 'later': {
      const norm = TimeDuration.normalize(0, 0, 0, 0, 0, nanoseconds);
      const laterTime = AddTime(hour, minute, second, millisecond, microsecond, nanosecond, norm);
      const laterDate = BalanceISODate(year, month, day + laterTime.deltaDays);
      const possible = GetPossibleEpochNanoseconds(timeZone, { ...laterTime, ...laterDate });
      return possible[possible.length - 1];
    }
    case 'reject': {
      throw new ErrorCtor('should not be reached: reject handled earlier');
    }
  }
  throw new ErrorCtor(`assertion failed: invalid disambiguation value ${disambiguation}`);
}

export function GetPossibleEpochNanoseconds(timeZone, isoDateTime) {
  const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = isoDateTime;
  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
  if (offsetMinutes !== undefined) {
    return [
      GetUTCEpochNanoseconds(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
        nanosecond,
        offsetMinutes * 60e9
      )
    ];
  }

  return GetNamedTimeZoneEpochNanoseconds(
    timeZone,
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
}

export function GetStartOfDay(timeZone, isoDate) {
  const isoDateTime = { ...isoDate, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, isoDateTime);
  // If not a DST gap, return the single or earlier epochNs
  if (possibleEpochNs.length) return possibleEpochNs[0];

  // Otherwise, 00:00:00 lies within a DST gap. Compute an epochNs that's
  // guaranteed to be before the transition
  if (IsOffsetTimeZoneIdentifier(timeZone)) {
    throw new ErrorCtor('assertion failure: should only be reached with named time zone');
  }

  const utcns = GetUTCEpochNanoseconds(isoDate.year, isoDate.month, isoDate.day, 0, 0, 0, 0, 0, 0);
  const dayBefore = utcns.minus(DAY_NANOS);
  ValidateEpochNanoseconds(dayBefore);
  return GetNamedTimeZoneNextTransition(timeZone, dayBefore);
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
  const epochNs = GetSlot(instant, EPOCHNANOSECONDS);
  const iso = GetISODateTimeFor(outputTimeZone, epochNs);
  const dateTimeString = TemporalDateTimeToString(iso, 'iso8601', precision, 'never');
  let timeZoneString = 'Z';
  if (timeZone !== undefined) {
    const offsetNs = GetOffsetNanosecondsFor(outputTimeZone, epochNs);
    timeZoneString = FormatDateTimeUTCOffsetRounded(offsetNs);
  }
  return `${dateTimeString}${timeZoneString}`;
}

function formatAsDecimalNumber(num) {
  if (num <= NumberMaxSafeInteger) return Call(NumberPrototypeToString, num, [10]);
  return bigInt(num).toString();
}

export function TemporalDurationToString(duration, precision) {
  const years = GetSlot(duration, YEARS);
  const months = GetSlot(duration, MONTHS);
  const weeks = GetSlot(duration, WEEKS);
  const days = GetSlot(duration, DAYS);
  const hours = GetSlot(duration, HOURS);
  const minutes = GetSlot(duration, MINUTES);
  const sign = DurationSign(duration);

  let datePart = '';
  if (years !== 0) datePart += `${formatAsDecimalNumber(MathAbs(years))}Y`;
  if (months !== 0) datePart += `${formatAsDecimalNumber(MathAbs(months))}M`;
  if (weeks !== 0) datePart += `${formatAsDecimalNumber(MathAbs(weeks))}W`;
  if (days !== 0) datePart += `${formatAsDecimalNumber(MathAbs(days))}D`;

  let timePart = '';
  if (hours !== 0) timePart += `${formatAsDecimalNumber(MathAbs(hours))}H`;
  if (minutes !== 0) timePart += `${formatAsDecimalNumber(MathAbs(minutes))}M`;

  // Keeping sub-second units separate avoids losing precision after resolving
  // any overflows from rounding
  const normSeconds = TimeDuration.normalize(
    0,
    0,
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  );
  if (
    !normSeconds.isZero() ||
    Call(
      ArrayPrototypeIncludes,
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      [DefaultTemporalLargestUnit(duration)]
    ) ||
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

export function TemporalDateTimeToString(isoDateTime, calendar, precision, showCalendar = 'auto') {
  let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = isoDateTime;
  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  const timeString = FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
  const calendarString = MaybeFormatCalendarAnnotation(calendar, showCalendar);
  return `${yearString}-${monthString}-${dayString}T${timeString}${calendarString}`;
}

export function TemporalMonthDayToString(monthDay, showCalendar = 'auto') {
  const month = ISODateTimePartString(GetSlot(monthDay, ISO_MONTH));
  const day = ISODateTimePartString(GetSlot(monthDay, ISO_DAY));
  let resultString = `${month}-${day}`;
  const calendar = GetSlot(monthDay, CALENDAR);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
    const year = ISOYearString(GetSlot(monthDay, ISO_YEAR));
    resultString = `${year}-${resultString}`;
  }
  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export function TemporalYearMonthToString(yearMonth, showCalendar = 'auto') {
  const year = ISOYearString(GetSlot(yearMonth, ISO_YEAR));
  const month = ISODateTimePartString(GetSlot(yearMonth, ISO_MONTH));
  let resultString = `${year}-${month}`;
  const calendar = GetSlot(yearMonth, CALENDAR);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
    const day = ISODateTimePartString(GetSlot(yearMonth, ISO_DAY));
    resultString += `-${day}`;
  }
  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
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
  let epochNs = GetSlot(zdt, EPOCHNANOSECONDS);

  if (options) {
    const { unit, increment, roundingMode } = options;
    epochNs = RoundTemporalInstant(epochNs, increment, unit, roundingMode);
  }

  const tz = GetSlot(zdt, TIME_ZONE);
  const offsetNs = GetOffsetNanosecondsFor(tz, epochNs);
  const iso = GetISODateTimeFor(tz, epochNs);
  let dateTimeString = TemporalDateTimeToString(iso, 'iso8601', precision, 'never');
  if (showOffset !== 'never') {
    dateTimeString += FormatDateTimeUTCOffsetRounded(offsetNs);
  }
  if (showTimeZone !== 'never') {
    const flag = showTimeZone === 'critical' ? '!' : '';
    dateTimeString += `[${flag}${tz}]`;
  }
  dateTimeString += MaybeFormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
  return dateTimeString;
}

export function IsOffsetTimeZoneIdentifier(string) {
  return Call(RegExpPrototypeTest, OFFSET, [string]);
}

export function ParseDateTimeUTCOffset(string) {
  const match = Call(RegExpPrototypeExec, OFFSET_WITH_PARTS, [string]);
  if (!match) {
    throw new RangeErrorCtor(`invalid time zone offset: ${string}`);
  }
  const sign = match[1] === '-' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  const seconds = +(match[4] || 0);
  const nanoseconds = +Call(StringPrototypeSlice, (match[5] || 0) + '000000000', [0, 9]);
  const offsetNanoseconds = sign * (((hours * 60 + minutes) * 60 + seconds) * 1e9 + nanoseconds);
  return offsetNanoseconds;
}

let canonicalTimeZoneIdsCache = undefined;
const isTZIDSep = ObjectAssign(ObjectCreate(null), { '/': true, '-': true, _: true });

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
  let primaryIdentifier = canonicalTimeZoneIdsCache
    ? Call(MapPrototypeGet, canonicalTimeZoneIdsCache, [lower])
    : undefined;
  if (primaryIdentifier) return { identifier: primaryIdentifier, primaryIdentifier };

  // It's not already a primary identifier, so get its primary identifier (or
  // return if it's not an available named time zone ID).
  try {
    const formatter = getIntlDateTimeFormatEnUsForTimeZone(identifier);
    primaryIdentifier = Call(IntlDateTimeFormatPrototypeResolvedOptions, formatter, []).timeZone;
  } catch {
    return undefined;
  }

  // Some legacy identifiers are aliases in ICU but not legal IANA identifiers.
  // Reject them even if the implementation's Intl supports them, as they are
  // not present in the IANA time zone database.
  if (Call(SetPrototypeHas, ICU_LEGACY_TIME_ZONE_IDS, [identifier])) {
    throw new RangeErrorCtor(
      `${identifier} is a legacy time zone identifier from ICU. Use ${primaryIdentifier} instead`
    );
  }

  // The identifier is an alias (a deprecated identifier that's a synonym for a
  // primary identifier), so we need to case-normalize the identifier to match
  // the IANA TZDB, e.g. america/new_york => America/New_York. There's no
  // built-in way to do this using Intl.DateTimeFormat, but the we can normalize
  // almost all aliases (modulo a few special cases) using the TZDB's basic
  // capitalization pattern:
  // 1. capitalize the first letter of the identifier
  // 2. capitalize the letter after every slash, dash, or underscore delimiter
  const chars = Call(ArrayPrototypeMap, lower, [
    (c, i) => (i === 0 || isTZIDSep[lower[i - 1]] ? Call(StringPrototypeToUpperCase, c, []) : c)
  ]);
  const standardCase = Call(ArrayPrototypeJoin, chars, ['']);
  const segments = Call(StringPrototypeSplit, standardCase, ['/']);

  if (segments.length === 1) {
    // If a single-segment legacy ID is 2-3 chars or contains a number or dash, then
    // (except for the "GB-Eire" special case) the case-normalized form is uppercase.
    // These are: GMT+0, GMT-0, GB, NZ, PRC, ROC, ROK, UCT, GMT, GMT0, CET, CST6CDT,
    // EET, EST, HST, MET, MST, MST7MDT, PST8PDT, WET, NZ-CHAT, and W-SU.
    // Otherwise it's standard form: first letter capitalized, e.g. Iran, Egypt, Hongkong
    if (lower === 'gb-eire') return { identifier: 'GB-Eire', primaryIdentifier };
    return {
      identifier:
        lower.length <= 3 || Call(RegExpPrototypeTest, /[-0-9]/, [lower])
          ? Call(StringPrototypeToUpperCase, lower, [])
          : segments[0],
      primaryIdentifier
    };
  }

  // All Etc zone names are uppercase except three exceptions.
  if (segments[0] === 'Etc') {
    const etcName = Call(ArrayPrototypeIncludes, ['Zulu', 'Greenwich', 'Universal'], [segments[1]])
      ? segments[1]
      : Call(StringPrototypeToUpperCase, segments[1], []);
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
  return { identifier: Call(ArrayPrototypeJoin, segments, ['/']), primaryIdentifier };
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
  const legacyDate = new DateCtor();
  Call(DatePrototypeSetUTCHours, legacyDate, [hour, minute, second, millisecond]);
  Call(DatePrototypeSetUTCFullYear, legacyDate, [reducedYear, month - 1, day]);
  const ms = Call(DatePrototypeGetTime, legacyDate, []);
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

  const item = new DateCtor(epochMilliseconds);
  const year = Call(DatePrototypeGetUTCFullYear, item, []);
  const month = Call(DatePrototypeGetUTCMonth, item, []) + 1;
  const day = Call(DatePrototypeGetUTCDate, item, []);
  const hour = Call(DatePrototypeGetUTCHours, item, []);
  const minute = Call(DatePrototypeGetUTCMinutes, item, []);
  const second = Call(DatePrototypeGetUTCSeconds, item, []);
  const millisecond = Call(DatePrototypeGetUTCMilliseconds, item, []);

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
  const boundFormat = Call(IntlDateTimeFormatPrototypeGetFormat, formatter, []);
  const datetime = Call(boundFormat, formatter, [new DateCtor(epochMilliseconds)]);
  const splits = Call(StringPrototypeSplit, datetime, [/[^\w]+/]);
  const month = splits[0];
  const day = splits[1];
  const year = splits[2];
  const era = splits[3];
  const hour = splits[4];
  const minute = splits[5];
  const second = splits[6];
  return {
    year: Call(StringPrototypeStartsWith, Call(StringPrototypeToUpperCase, era, []), ['B']) ? -year + 1 : +year,
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
  const candidates = Call(ArrayPrototypeMap, found, [
    (offsetNanoseconds) => {
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
    }
  ]);
  return Call(ArrayPrototypeFilter, candidates, [(x) => x !== undefined]);
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

export function DurationSign(duration) {
  const fields = [
    GetSlot(duration, YEARS),
    GetSlot(duration, MONTHS),
    GetSlot(duration, WEEKS),
    GetSlot(duration, DAYS),
    GetSlot(duration, HOURS),
    GetSlot(duration, MINUTES),
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  ];
  for (let index = 0; index < fields.length; index++) {
    const prop = fields[index];
    if (prop !== 0) return prop < 0 ? -1 : 1;
  }
  return 0;
}

function DateDurationSign(dateDuration) {
  const fieldNames = ['years', 'months', 'weeks', 'days'];
  for (let index = 0; index < fieldNames.length; index++) {
    const prop = dateDuration[fieldNames[index]];
    if (prop !== 0) return prop < 0 ? -1 : 1;
  }
  return 0;
}

function NormalizedDurationSign(duration) {
  const dateSign = DateDurationSign(duration.date);
  if (dateSign !== 0) return dateSign;
  return duration.norm.sign();
}

export function BalanceISOYearMonth(year, month) {
  if (!NumberIsFinite(year) || !NumberIsFinite(month)) throw new RangeErrorCtor('infinity is out of range');
  month -= 1;
  year += MathFloor(month / 12);
  month %= 12;
  if (month < 0) month += 12;
  month += 1;
  return { year, month };
}

export function BalanceISODate(year, month, day) {
  if (!NumberIsFinite(day)) throw new RangeErrorCtor('infinity is out of range');
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
  const time = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
  const isoDate = BalanceISODate(year, month, day + time.deltaDays);
  return CombineISODateAndTimeRecord(isoDate, time);
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

export function UnbalanceDateDurationRelative(dateDuration, plainRelativeTo) {
  const yearsMonthsWeeksDuration = AdjustDateDurationRecord(dateDuration, 0);
  if (DateDurationSign(yearsMonthsWeeksDuration) === 0) return dateDuration.days;

  // balance years, months, and weeks down to days
  const isoDate = TemporalObjectToISODateRecord(plainRelativeTo);
  const later = CalendarDateAdd(GetSlot(plainRelativeTo, CALENDAR), isoDate, yearsMonthsWeeksDuration, 'constrain');
  const epochDaysEarlier = ISODateToEpochDays(isoDate.year, isoDate.month, isoDate.day);
  const epochDaysLater = ISODateToEpochDays(later.year, later.month, later.day);
  const yearsMonthsWeeksInDays = epochDaysLater - epochDaysEarlier;
  return dateDuration.days + yearsMonthsWeeksInDays;
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
  if (value < min || value > max) throw new RangeErrorCtor(`value out of range: ${min} <= ${value} <= ${max}`);
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
    throw new RangeErrorCtor('date/time value is outside of supported range');
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
  let sign = 0;
  const fields = [y, mon, w, d, h, min, s, ms, µs, ns];
  for (let index = 0; index < fields.length; index++) {
    const prop = fields[index];
    if (!NumberIsFinite(prop)) throw new RangeErrorCtor('infinite values not allowed as duration fields');
    const propSign = MathSign(prop);
    if (propSign !== 0) {
      if (sign !== 0 && propSign !== sign) throw new RangeErrorCtor('mixed-sign values not allowed as duration fields');
      sign = propSign;
    }
  }
  if (MathAbs(y) >= 2 ** 32 || MathAbs(mon) >= 2 ** 32 || MathAbs(w) >= 2 ** 32) {
    throw new RangeErrorCtor('years, months, and weeks must be < 2³²');
  }
  const msResult = TruncatingDivModByPowerOf10(ms, 3);
  const µsResult = TruncatingDivModByPowerOf10(µs, 6);
  const nsResult = TruncatingDivModByPowerOf10(ns, 9);
  const remainderSec = TruncatingDivModByPowerOf10(msResult.mod * 1e6 + µsResult.mod * 1e3 + nsResult.mod, 9).div;
  const totalSec = d * 86400 + h * 3600 + min * 60 + s + msResult.div + µsResult.div + nsResult.div + remainderSec;
  if (!NumberIsSafeInteger(totalSec)) {
    throw new RangeErrorCtor('total of duration time units cannot exceed 9007199254740991.999999999 s');
  }
}

function ISODateSurpasses(sign, y1, m1, d1, y2, m2, d2) {
  const cmp = CompareISODate(y1, m1, d1, y2, m2, d2);
  return sign * cmp === 1;
}

export function NormalizeDuration(duration) {
  const date = {
    years: GetSlot(duration, YEARS),
    months: GetSlot(duration, MONTHS),
    weeks: GetSlot(duration, WEEKS),
    days: GetSlot(duration, DAYS)
  };
  const norm = TimeDuration.normalize(
    GetSlot(duration, HOURS),
    GetSlot(duration, MINUTES),
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  );
  return { date, norm };
}

export function NormalizeDurationWith24HourDays(duration) {
  const norm = TimeDuration.normalize(
    GetSlot(duration, HOURS),
    GetSlot(duration, MINUTES),
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  ).add24HourDays(GetSlot(duration, DAYS));
  const date = {
    years: GetSlot(duration, YEARS),
    months: GetSlot(duration, MONTHS),
    weeks: GetSlot(duration, WEEKS),
    days: 0
  };
  return { date, norm };
}

function NormalizeDurationWithoutTime(duration) {
  const normalizedDuration = NormalizeDurationWith24HourDays(duration);
  const days = MathTrunc(normalizedDuration.norm.sec / 86400);
  RejectDuration(
    normalizedDuration.date.years,
    normalizedDuration.date.months,
    normalizedDuration.date.weeks,
    days,
    0,
    0,
    0,
    0,
    0,
    0
  );
  return { ...normalizedDuration.date, days };
}

export function UnnormalizeDuration(normalizedDuration, largestUnit) {
  const sign = normalizedDuration.norm.sign();
  let nanoseconds = normalizedDuration.norm.abs().subsec;
  let microseconds = 0;
  let milliseconds = 0;
  let seconds = normalizedDuration.norm.abs().sec;
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
      throw new ErrorCtor('assert not reached');
  }

  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  return new TemporalDuration(
    normalizedDuration.date.years,
    normalizedDuration.date.months,
    normalizedDuration.date.weeks,
    normalizedDuration.date.days + sign * days,
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
}

function CombineDateAndNormalizedTimeDuration(dateDuration, norm) {
  const dateSign = DateDurationSign(dateDuration);
  const timeSign = norm.sign();
  if (dateSign !== 0 && timeSign !== 0 && dateSign !== timeSign) {
    throw new RangeErrorCtor('mixed-sign values not allowed as duration fields');
  }
  return { date: dateDuration, norm };
}

function ISODateToEpochDays(y, m, d) {
  // This is inefficient, but we use GetUTCEpochNanoseconds to avoid duplicating
  // the workarounds for legacy Date. (see that function for explanation)
  return GetUTCEpochNanoseconds(y, m, d, 0, 0, 0, 0, 0, 0).divide(DAY_NANOS).toJSNumber();
}

export function DifferenceISODate(y1, m1, d1, y2, m2, d2, largestUnit = 'days') {
  const sign = -CompareISODate(y1, m1, d1, y2, m2, d2);
  if (sign === 0) return ZeroDateDuration();

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

  if (norm.abs().sec >= 86400) throw new ErrorCtor('assertion failure in DifferenceTime: _bt_.[[Days]] should be 0');

  return norm;
}

function DifferenceInstant(ns1, ns2, increment, smallestUnit, roundingMode) {
  const diff = { date: ZeroDateDuration(), norm: TimeDuration.fromEpochNsDiff(ns2, ns1) };
  return RoundTimeDuration(diff, increment, smallestUnit, roundingMode);
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
  largestUnit
) {
  let timeDuration = DifferenceTime(h1, min1, s1, ms1, µs1, ns1, h2, min2, s2, ms2, µs2, ns2);

  const timeSign = timeDuration.sign();
  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1);

  // back-off a day from date2 so that the signs of the date a time diff match
  if (dateSign === -timeSign) {
    ({ year: y2, month: mon2, day: d2 } = BalanceISODate(y2, mon2, d2 + timeSign));
    timeDuration = timeDuration.add24HourDays(-timeSign);
  }

  const date1 = { year: y1, month: mon1, day: d1 };
  const date2 = { year: y2, month: mon2, day: d2 };
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const dateDifference = CalendarDateUntil(calendar, date1, date2, dateLargestUnit);
  if (largestUnit !== dateLargestUnit) {
    // largestUnit < days, so add the days in to the normalized duration
    timeDuration = timeDuration.add24HourDays(dateDifference.days);
    dateDifference.days = 0;
  }
  return CombineDateAndNormalizedTimeDuration(dateDifference, timeDuration);
}

export function DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit) {
  const nsDiff = ns2.subtract(ns1);
  if (nsDiff.isZero()) return ZeroNormalizedDuration();
  const sign = nsDiff.lt(0) ? -1 : 1;

  // Convert start/end instants to datetimes
  const isoDtStart = GetISODateTimeFor(timeZone, ns1);
  const isoDtEnd = GetISODateTimeFor(timeZone, ns2);

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
    isoDtStart.hour,
    isoDtStart.minute,
    isoDtStart.second,
    isoDtStart.millisecond,
    isoDtStart.microsecond,
    isoDtStart.nanosecond,
    isoDtEnd.hour,
    isoDtEnd.minute,
    isoDtEnd.second,
    isoDtEnd.millisecond,
    isoDtEnd.microsecond,
    isoDtEnd.nanosecond
  );
  if (timeDuration.sign() === -sign) {
    dayCorrection++;
  }

  for (; dayCorrection <= maxDayCorrection; dayCorrection++) {
    const intermediateDate = BalanceISODate(isoDtEnd.year, isoDtEnd.month, isoDtEnd.day - dayCorrection * sign);

    // Incorporate time parts from dtStart
    intermediateDateTime = {
      year: intermediateDate.year,
      month: intermediateDate.month,
      day: intermediateDate.day,
      hour: isoDtStart.hour,
      minute: isoDtStart.minute,
      second: isoDtStart.second,
      millisecond: isoDtStart.millisecond,
      microsecond: isoDtStart.microsecond,
      nanosecond: isoDtStart.nanosecond
    };

    // Convert intermediate datetime to epoch-nanoseconds (may disambiguate)
    const intermediateNs = GetEpochNanosecondsFor(timeZone, intermediateDateTime, 'compatible');

    // Compute the nanosecond diff between the intermediate instant and the final destination
    norm = TimeDuration.fromEpochNsDiff(ns2, intermediateNs);

    // Did intermediateNs NOT surpass ns2?
    // If so, exit the loop with success (without incrementing dayCorrection past maxDayCorrection)
    if (norm.sign() !== -sign) {
      break;
    }
  }

  if (dayCorrection > maxDayCorrection) {
    throw new ErrorCtor(`assertion failed: more than ${maxDayCorrection} day correction needed`);
  }

  // Similar to what happens in DifferenceISODateTime with date parts only:
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const dateDifference = CalendarDateUntil(calendar, isoDtStart, intermediateDateTime, dateLargestUnit);
  return CombineDateAndNormalizedTimeDuration(dateDifference, norm);
}

// Epoch-nanosecond bounding technique where the start/end of the calendar-unit
// interval are converted to epoch-nanosecond times and destEpochNs is nudged to
// either one.
function NudgeToCalendarUnit(sign, duration, destEpochNs, dateTime, timeZone, calendar, increment, unit, roundingMode) {
  // unit must be day, week, month, or year
  // timeZone may be undefined

  // Create a duration with smallestUnit trunc'd towards zero
  // Create a separate duration that incorporates roundingIncrement
  let r1, r2, startDuration, endDuration;
  switch (unit) {
    case 'year': {
      const years = RoundNumberToIncrement(duration.date.years, increment, 'trunc');
      r1 = years;
      r2 = years + increment * sign;
      startDuration = { years: r1, months: 0, weeks: 0, days: 0 };
      endDuration = { ...startDuration, years: r2 };
      break;
    }
    case 'month': {
      const months = RoundNumberToIncrement(duration.date.months, increment, 'trunc');
      r1 = months;
      r2 = months + increment * sign;
      startDuration = AdjustDateDurationRecord(duration.date, 0, 0, r1);
      endDuration = AdjustDateDurationRecord(duration.date, 0, 0, r2);
      break;
    }
    case 'week': {
      const yearsMonths = AdjustDateDurationRecord(duration.date, 0, 0);
      const weeksStart = CalendarDateAdd(calendar, dateTime, yearsMonths, 'constrain');
      const weeksEnd = BalanceISODate(weeksStart.year, weeksStart.month, weeksStart.day + duration.date.days);
      const untilResult = CalendarDateUntil(calendar, weeksStart, weeksEnd, 'week');
      const weeks = RoundNumberToIncrement(duration.date.weeks + untilResult.weeks, increment, 'trunc');
      r1 = weeks;
      r2 = weeks + increment * sign;
      startDuration = AdjustDateDurationRecord(duration.date, 0, r1);
      endDuration = AdjustDateDurationRecord(duration.date, 0, r2);
      break;
    }
    case 'day': {
      const days = RoundNumberToIncrement(duration.date.days, increment, 'trunc');
      r1 = days;
      r2 = days + increment * sign;
      startDuration = AdjustDateDurationRecord(duration.date, r1);
      endDuration = AdjustDateDurationRecord(duration.date, r2);
      break;
    }
    default:
      throw new ErrorCtor('assert not reached');
  }

  if ((sign === 1 && (r1 < 0 || r1 >= r2)) || (sign === -1 && (r1 > 0 || r1 <= r2))) {
    throw new ErrorCtor('assertion failed: ordering of r1, r2 according to sign');
  }

  // Apply to origin, output PlainDateTimes
  const startDate = ISODateTimeToDateRecord(dateTime);
  const start = CalendarDateAdd(calendar, startDate, startDuration, 'constrain');
  const end = CalendarDateAdd(calendar, startDate, endDuration, 'constrain');

  // Convert to epoch-nanoseconds
  let startEpochNs, endEpochNs;
  if (timeZone) {
    const startDateTime = CombineISODateAndTimeRecord(start, dateTime);
    startEpochNs = GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible');
    const endDateTime = CombineISODateAndTimeRecord(end, dateTime);
    endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');
  } else {
    startEpochNs = GetUTCEpochNanoseconds(
      start.year,
      start.month,
      start.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.millisecond,
      dateTime.microsecond,
      dateTime.nanosecond
    );
    endEpochNs = GetUTCEpochNanoseconds(
      end.year,
      end.month,
      end.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
      dateTime.millisecond,
      dateTime.microsecond,
      dateTime.nanosecond
    );
  }

  // Round the smallestUnit within the epoch-nanosecond span
  if (
    (sign === 1 && (startEpochNs.gt(destEpochNs) || destEpochNs.gt(endEpochNs))) ||
    (sign === -1 && (endEpochNs.gt(destEpochNs) || destEpochNs.gt(startEpochNs)))
  ) {
    throw new RangeErrorCtor(`custom calendar reported a ${unit} that is 0 days long`);
  }
  if (endEpochNs.equals(startEpochNs)) {
    throw new ErrorCtor('assertion failed: startEpochNs ≠ endEpochNs');
  }
  const numerator = TimeDuration.fromEpochNsDiff(destEpochNs, startEpochNs);
  const denominator = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
  const unsignedRoundingMode = GetUnsignedRoundingMode(roundingMode, sign < 0 ? 'negative' : 'positive');
  const cmp = numerator.add(numerator).abs().subtract(denominator.abs()).sign();
  const even = (MathAbs(r1) / increment) % 2 === 0;
  const roundedUnit = numerator.isZero()
    ? MathAbs(r1)
    : !numerator.cmp(denominator) // equal?
      ? MathAbs(r2)
      : ApplyUnsignedRoundingMode(MathAbs(r1), MathAbs(r2), cmp, even, unsignedRoundingMode);

  // Trick to minimize rounding error, due to the lack of fma() in JS
  const fakeNumerator = new TimeDuration(denominator.totalNs.times(r1).add(numerator.totalNs.times(increment * sign)));
  const total = fakeNumerator.fdiv(denominator.totalNs);
  if (MathAbs(total) < MathAbs(r1) || MathAbs(total) > MathAbs(r2)) {
    throw new ErrorCtor('assertion failed: r1 ≤ total ≤ r2');
  }

  // Determine whether expanded or contracted
  const didExpandCalendarUnit = roundedUnit === MathAbs(r2);
  duration = { date: didExpandCalendarUnit ? endDuration : startDuration, norm: TimeDuration.ZERO };

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
function NudgeToZonedTime(sign, duration, dateTime, timeZone, calendar, increment, unit, roundingMode) {
  // unit must be hour or smaller

  // Apply to origin, output start/end of the day as PlainDateTimes
  const date = ISODateTimeToDateRecord(dateTime);
  const start = CalendarDateAdd(calendar, date, duration.date, 'constrain');
  const startDateTime = CombineISODateAndTimeRecord(start, dateTime);
  const endDate = BalanceISODate(start.year, start.month, start.day + sign);
  const endDateTime = CombineISODateAndTimeRecord(endDate, dateTime);

  // Compute the epoch-nanosecond start/end of the final whole-day interval
  // If duration has negative sign, startEpochNs will be after endEpochNs
  const startEpochNs = GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible');
  const endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');

  // The signed amount of time from the start of the whole-day interval to the end
  const daySpan = TimeDuration.fromEpochNsDiff(endEpochNs, startEpochNs);
  if (daySpan.sign() !== sign) throw new RangeErrorCtor('time zone returned inconsistent Instants');

  // Compute time parts of the duration to nanoseconds and round
  // Result could be negative
  let roundedNorm = duration.norm.round(Call(MapPrototypeGet, NS_PER_TIME_UNIT, [unit]) * increment, roundingMode);

  // Does the rounded time exceed the time-in-day?
  const beyondDaySpan = roundedNorm.subtract(daySpan);
  const didRoundBeyondDay = beyondDaySpan.sign() !== -sign;

  let dayDelta, nudgedEpochNs;
  if (didRoundBeyondDay) {
    // If rounded into next day, use the day-end as the local origin and rerun
    // the rounding
    dayDelta = sign;
    roundedNorm = beyondDaySpan.round(Call(MapPrototypeGet, NS_PER_TIME_UNIT, [unit]) * increment, roundingMode);
    nudgedEpochNs = roundedNorm.addToEpochNs(endEpochNs);
  } else {
    // Otherwise, if time not rounded beyond day, use the day-start as the local
    // origin
    dayDelta = 0;
    nudgedEpochNs = roundedNorm.addToEpochNs(startEpochNs);
  }

  const dateDuration = AdjustDateDurationRecord(duration.date, duration.date.days + dayDelta);
  const resultDuration = CombineDateAndNormalizedTimeDuration(dateDuration, roundedNorm);
  return {
    duration: resultDuration,
    total: NaN, // Not computed in this path, so we assert that it is not NaN later on
    nudgedEpochNs,
    didExpandCalendarUnit: didRoundBeyondDay
  };
}

// Converts all fields to nanoseconds and does integer rounding.
function NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode) {
  // unit must be day or smaller

  const norm = duration.norm.add24HourDays(duration.date.days);
  // Convert to nanoseconds and round
  const unitLength = Call(MapPrototypeGet, NS_PER_TIME_UNIT, [smallestUnit]);
  const total = norm.fdiv(unitLength);
  const roundedNorm = norm.round(increment * unitLength, roundingMode);
  const diffNorm = roundedNorm.subtract(norm);

  // Determine if whole days expanded
  const { quotient: wholeDays } = norm.divmod(DAY_NANOS);
  const { quotient: roundedWholeDays } = roundedNorm.divmod(DAY_NANOS);
  const didExpandDays = MathSign(roundedWholeDays - wholeDays) === norm.sign();

  const nudgedEpochNs = diffNorm.addToEpochNs(destEpochNs);

  let days = 0;
  let remainder = roundedNorm;
  if (LargerOfTwoTemporalUnits(largestUnit, 'day') === largestUnit) {
    days = roundedWholeDays;
    remainder = roundedNorm.subtract(TimeDuration.normalize(roundedWholeDays * 24, 0, 0, 0, 0, 0));
  }

  const dateDuration = AdjustDateDurationRecord(duration.date, days);
  return {
    duration: { date: dateDuration, norm: remainder },
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
  timeZone,
  calendar,
  largestUnit,
  smallestUnit
) {
  // smallestUnit is day or larger

  if (smallestUnit === largestUnit) return duration;

  // Check to see if nudgedEpochNs has hit the boundary of any units higher than
  // smallestUnit, in which case increment the higher unit and clear smaller
  // units.
  const largestUnitIndex = Call(ArrayPrototypeIndexOf, UNITS_DESCENDING, [largestUnit]);
  const smallestUnitIndex = Call(ArrayPrototypeIndexOf, UNITS_DESCENDING, [smallestUnit]);
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
        const years = duration.date.years + sign;
        endDuration = { years, months: 0, weeks: 0, days: 0 };
        break;
      }
      case 'month': {
        const months = duration.date.months + sign;
        endDuration = AdjustDateDurationRecord(duration.date, 0, 0, months);
        break;
      }
      case 'week': {
        const weeks = duration.date.weeks + sign;
        endDuration = AdjustDateDurationRecord(duration.date, 0, weeks);
        break;
      }
      default:
        throw new ErrorCtor('assert not reached');
    }

    // Compute end-of-unit in epoch-nanoseconds
    const date = ISODateTimeToDateRecord(plainDateTime);
    const end = CalendarDateAdd(calendar, date, endDuration, 'constrain');
    let endEpochNs;
    if (timeZone) {
      const endDateTime = CombineISODateAndTimeRecord(end, plainDateTime);
      endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');
    } else {
      endEpochNs = GetUTCEpochNanoseconds(
        end.year,
        end.month,
        end.day,
        plainDateTime.hour,
        plainDateTime.minute,
        plainDateTime.second,
        plainDateTime.millisecond,
        plainDateTime.microsecond,
        plainDateTime.nanosecond
      );
    }

    const didExpandToEnd = nudgedEpochNs.compare(endEpochNs) !== -sign;

    // Is nudgedEpochNs at the end-of-unit? This means it should bubble-up to
    // the next highest unit (and possibly further...)
    if (didExpandToEnd) {
      duration = { date: endDuration, norm: TimeDuration.ZERO };
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
  timeZone,
  calendar,
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
  const irregularLengthUnit = IsCalendarUnit(smallestUnit) || (timeZone && smallestUnit === 'day');
  const sign = NormalizedDurationSign(duration) < 0 ? -1 : 1;

  let nudgeResult;
  if (irregularLengthUnit) {
    // Rounding an irregular-length unit? Use epoch-nanosecond-bounding technique
    nudgeResult = NudgeToCalendarUnit(
      sign,
      duration,
      destEpochNs,
      dateTime,
      timeZone,
      calendar,
      increment,
      smallestUnit,
      roundingMode
    );
  } else if (timeZone) {
    // Special-case for rounding time units within a zoned day. total() never
    // takes this path because largestUnit is then also a time unit, so
    // DifferenceZonedDateTimeWithRounding uses Instant math
    nudgeResult = NudgeToZonedTime(sign, duration, dateTime, timeZone, calendar, increment, smallestUnit, roundingMode);
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
      timeZone,
      calendar,
      largestUnit, // where to STOP bubbling
      LargerOfTwoTemporalUnits(smallestUnit, 'day') // where to START bubbling-up from
    );
  }

  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
    largestUnit = 'hour';
  }
  const result = UnnormalizeDuration(duration, largestUnit);
  return { duration: result, total: nudgeResult.total };
}

export function DifferencePlainDateTimeWithRounding(
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
  roundingIncrement,
  smallestUnit,
  roundingMode
) {
  if (CompareISODateTime(y1, mon1, d1, h1, min1, s1, ms1, µs1, ns1, y2, mon2, d2, h2, min2, s2, ms2, µs2, ns2) == 0) {
    const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
    return {
      duration: new TemporalDuration(),
      total: 0
    };
  }

  const duration = DifferenceISODateTime(
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
    largestUnit
  );

  const roundingIsNoop = smallestUnit === 'nanosecond' && roundingIncrement === 1;
  if (roundingIsNoop) {
    return {
      duration: UnnormalizeDuration(duration, largestUnit),
      total: duration.norm.totalNs.toJSNumber()
    };
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
    duration,
    destEpochNs,
    dateTime,
    null,
    calendar,
    largestUnit,
    roundingIncrement,
    smallestUnit,
    roundingMode
  );
}

export function DifferenceZonedDateTimeWithRounding(
  ns1,
  ns2,
  timeZone,
  calendar,
  largestUnit,
  roundingIncrement,
  smallestUnit,
  roundingMode
) {
  if (!IsCalendarUnit(largestUnit) && largestUnit !== 'day') {
    // The user is only asking for a time difference, so return difference of instants.
    const { duration, total } = DifferenceInstant(ns1, ns2, roundingIncrement, smallestUnit, largestUnit, roundingMode);
    return {
      duration: UnnormalizeDuration(duration, largestUnit),
      total
    };
  }

  const duration = DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit);

  if (smallestUnit === 'nanosecond' && roundingIncrement === 1) {
    return {
      duration: UnnormalizeDuration(duration, 'hour'),
      total: duration.norm.totalNs.toJSNumber()
    };
  }

  const dateTime = GetISODateTimeFor(timeZone, ns1);
  return RoundRelativeDuration(
    duration,
    ns2,
    dateTime,
    timeZone,
    calendar,
    largestUnit,
    roundingIncrement,
    smallestUnit,
    roundingMode
  );
}

export function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
  const ALLOWED_UNITS = Call(ArrayPrototypeReduce, TEMPORAL_UNITS, [
    (allowed, unitInfo) => {
      const p = unitInfo[0];
      const s = unitInfo[1];
      const c = unitInfo[2];
      if ((group === 'datetime' || c === group) && !Call(ArrayPrototypeIncludes, disallowed, [s])) {
        Call(ArrayPrototypePush, allowed, [s, p]);
      }
      return allowed;
    },
    []
  ]);

  let largestUnit = GetTemporalUnitValuedOption(options, 'largestUnit', group, 'auto');
  if (Call(ArrayPrototypeIncludes, disallowed, [largestUnit])) {
    throw new RangeErrorCtor(
      `largestUnit must be one of ${Call(ArrayPrototypeJoin, ALLOWED_UNITS, [', '])}, not ${largestUnit}`
    );
  }

  const roundingIncrement = GetRoundingIncrementOption(options);

  let roundingMode = GetRoundingModeOption(options, 'trunc');
  if (op === 'since') roundingMode = NegateRoundingMode(roundingMode);

  const smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit', group, fallbackSmallest);
  if (Call(ArrayPrototypeIncludes, disallowed, [smallestUnit])) {
    throw new RangeErrorCtor(
      `smallestUnit must be one of ${Call(ArrayPrototypeJoin, ALLOWED_UNITS, [', '])}, not ${smallestUnit}`
    );
  }

  const defaultLargestUnit = LargerOfTwoTemporalUnits(smallestLargestDefaultUnit, smallestUnit);
  if (largestUnit === 'auto') largestUnit = defaultLargestUnit;
  if (LargerOfTwoTemporalUnits(largestUnit, smallestUnit) !== largestUnit) {
    throw new RangeErrorCtor(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`);
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
  other = ToTemporalInstant(other);

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'second');

  const onens = GetSlot(instant, EPOCHNANOSECONDS);
  const twons = GetSlot(other, EPOCHNANOSECONDS);
  const { duration } = DifferenceInstant(
    onens,
    twons,
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  );
  let result = UnnormalizeDuration(duration, settings.largestUnit);
  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalPlainDate(operation, plainDate, other, options) {
  other = ToTemporalDate(other);
  const calendar = GetSlot(plainDate, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  if (!CalendarEquals(calendar, otherCalendar)) {
    throw new RangeErrorCtor(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
  }

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', [], 'day', 'day');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(plainDate, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(plainDate, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(plainDate, ISO_DAY) === GetSlot(other, ISO_DAY)
  ) {
    return new Duration();
  }

  const isoDate = TemporalObjectToISODateRecord(plainDate);
  const isoOther = TemporalObjectToISODateRecord(other);
  const dateDifference = CalendarDateUntil(calendar, isoDate, isoOther, settings.largestUnit);

  const duration = { date: dateDifference, norm: TimeDuration.ZERO };
  let result;
  const roundingIsNoop = settings.smallestUnit === 'day' && settings.roundingIncrement === 1;
  if (!roundingIsNoop) {
    const dateTime = {
      ...isoDate,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    };
    const destEpochNs = GetUTCEpochNanoseconds(isoOther.year, isoOther.month, isoOther.day, 0, 0, 0, 0, 0, 0);
    result = RoundRelativeDuration(
      duration,
      destEpochNs,
      dateTime,
      null,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ).duration;
  } else {
    result = UnnormalizeDuration(duration, settings.largestUnit);
  }

  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalPlainDateTime(operation, plainDateTime, other, options) {
  other = ToTemporalDateTime(other);
  const calendar = GetSlot(plainDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  if (!CalendarEquals(calendar, otherCalendar)) {
    throw new RangeErrorCtor(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
  }

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'day');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(plainDateTime, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(plainDateTime, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(plainDateTime, ISO_DAY) === GetSlot(other, ISO_DAY) &&
    GetSlot(plainDateTime, ISO_HOUR) == GetSlot(other, ISO_HOUR) &&
    GetSlot(plainDateTime, ISO_MINUTE) == GetSlot(other, ISO_MINUTE) &&
    GetSlot(plainDateTime, ISO_SECOND) == GetSlot(other, ISO_SECOND) &&
    GetSlot(plainDateTime, ISO_MILLISECOND) == GetSlot(other, ISO_MILLISECOND) &&
    GetSlot(plainDateTime, ISO_MICROSECOND) == GetSlot(other, ISO_MICROSECOND) &&
    GetSlot(plainDateTime, ISO_NANOSECOND) == GetSlot(other, ISO_NANOSECOND)
  ) {
    return new Duration();
  }

  let result = DifferencePlainDateTimeWithRounding(
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
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  ).duration;

  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
  other = ToTemporalTime(other);

  const resolvedOptions = GetOptionsObject(options);
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
  let duration = { date: ZeroDateDuration(), norm };
  if (settings.smallestUnit !== 'nanosecond' || settings.roundingIncrement !== 1) {
    ({ duration } = RoundTimeDuration(
      duration,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ));
  }

  let result = UnnormalizeDuration(duration, settings.largestUnit);
  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalPlainYearMonth(operation, yearMonth, other, options) {
  other = ToTemporalYearMonth(other);
  const calendar = GetSlot(yearMonth, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  if (!CalendarEquals(calendar, otherCalendar)) {
    throw new RangeErrorCtor(`cannot compute difference between months of ${calendar} and ${otherCalendar} calendars`);
  }

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'date', ['week', 'day'], 'month', 'year');

  const Duration = GetIntrinsic('%Temporal.Duration%');
  if (
    GetSlot(yearMonth, ISO_YEAR) === GetSlot(other, ISO_YEAR) &&
    GetSlot(yearMonth, ISO_MONTH) === GetSlot(other, ISO_MONTH) &&
    GetSlot(yearMonth, ISO_DAY) === GetSlot(other, ISO_DAY)
  ) {
    return new Duration();
  }

  const thisFields = TemporalObjectToFields(yearMonth);
  thisFields.day = 1;
  const thisDate = CalendarDateFromFields(calendar, thisFields, 'constrain');
  const otherFields = TemporalObjectToFields(other);
  otherFields.day = 1;
  const otherDate = CalendarDateFromFields(calendar, otherFields, 'constrain');

  const dateDifference = CalendarDateUntil(calendar, thisDate, otherDate, settings.largestUnit);
  const duration = { date: AdjustDateDurationRecord(dateDifference, 0, 0), norm: TimeDuration.ZERO };
  let result;
  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
    const dateTime = {
      year: thisDate.year,
      month: thisDate.month,
      day: thisDate.day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    };
    const destEpochNs = GetUTCEpochNanoseconds(otherDate.year, otherDate.month, otherDate.day, 0, 0, 0, 0, 0, 0);
    result = RoundRelativeDuration(
      duration,
      destEpochNs,
      dateTime,
      null,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ).duration;
  } else {
    result = UnnormalizeDuration(duration, settings.largestUnit);
  }

  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalZonedDateTime(operation, zonedDateTime, other, options) {
  other = ToTemporalZonedDateTime(other);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const otherCalendar = GetSlot(other, CALENDAR);
  if (!CalendarEquals(calendar, otherCalendar)) {
    throw new RangeErrorCtor(`cannot compute difference between dates of ${calendar} and ${otherCalendar} calendars`);
  }

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'datetime', [], 'nanosecond', 'hour');

  const ns1 = GetSlot(zonedDateTime, EPOCHNANOSECONDS);
  const ns2 = GetSlot(other, EPOCHNANOSECONDS);

  const Duration = GetIntrinsic('%Temporal.Duration%');

  let result;
  if (
    settings.largestUnit !== 'year' &&
    settings.largestUnit !== 'month' &&
    settings.largestUnit !== 'week' &&
    settings.largestUnit !== 'day'
  ) {
    // The user is only asking for a time difference, so return difference of instants.
    const { duration } = DifferenceInstant(
      ns1,
      ns2,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
    result = UnnormalizeDuration(duration, settings.largestUnit);
  } else {
    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
      throw new RangeErrorCtor(
        "When calculating difference between time zones, largestUnit must be 'hours' " +
          'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
      );
    }

    if (ns1.equals(ns2)) return new Duration();

    result = DifferenceZonedDateTimeWithRounding(
      ns1,
      ns2,
      timeZone,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    ).duration;
  }

  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
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

export function AddZonedDateTime(epochNs, timeZone, calendar, duration, overflow = 'constrain') {
  // If only time is to be added, then use Instant math. It's not OK to fall
  // through to the date/time code below because compatible disambiguation in
  // the PlainDateTime=>Instant conversion will change the offset of any
  // ZonedDateTime in the repeated clock time after a backwards transition.
  // When adding/subtracting time units and not dates, this disambiguation is
  // not expected and so is avoided below via a fast path for time-only
  // arithmetic.
  // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
  if (DateDurationSign(duration.date) === 0) return AddInstant(epochNs, duration.norm);

  // RFC 5545 requires the date portion to be added in calendar days and the
  // time portion to be added in exact time.
  const dt = GetISODateTimeFor(timeZone, epochNs);
  const addedDate = CalendarDateAdd(calendar, dt, duration.date, overflow);
  const dtIntermediate = CombineISODateAndTimeRecord(addedDate, dt);

  // Note that 'compatible' is used below because this disambiguation behavior
  // is required by RFC 5545.
  const intermediateNs = GetEpochNanosecondsFor(timeZone, dtIntermediate, 'compatible');
  return AddInstant(intermediateNs, duration.norm);
}

export function AddDurations(operation, duration, other) {
  other = ToTemporalDuration(other);
  if (operation === 'subtract') other = CreateNegatedTemporalDuration(other);

  const largestUnit1 = DefaultTemporalLargestUnit(duration);
  const largestUnit2 = DefaultTemporalLargestUnit(other);
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2);
  if (IsCalendarUnit(largestUnit)) {
    throw new RangeErrorCtor(
      'For years, months, or weeks arithmetic, use date arithmetic relative to a starting point'
    );
  }

  const d1 = NormalizeDurationWith24HourDays(duration);
  const d2 = NormalizeDurationWith24HourDays(other);
  const result = CombineDateAndNormalizedTimeDuration(ZeroDateDuration(), d1.norm.add(d2.norm));
  return UnnormalizeDuration(result, largestUnit);
}

export function AddDurationToOrSubtractDurationFromInstant(operation, instant, durationLike) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const largestUnit = DefaultTemporalLargestUnit(duration);
  if (IsCalendarUnit(largestUnit) || largestUnit === 'day') {
    throw new RangeErrorCtor(
      `Duration field ${largestUnit} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`
    );
  }
  const normalizedDuration = NormalizeDurationWith24HourDays(duration);
  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), normalizedDuration.norm);
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ns);
}

export function AddDurationToDate(operation, plainDate, durationLike, options) {
  const isoDate = TemporalObjectToISODateRecord(plainDate);
  const calendar = GetSlot(plainDate, CALENDAR);

  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const dateDuration = NormalizeDurationWithoutTime(duration);

  options = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(options);

  const addedDate = CalendarDateAdd(calendar, isoDate, dateDuration, overflow);
  return CreateTemporalDate(addedDate.year, addedDate.month, addedDate.day, calendar);
}

export function AddDurationToOrSubtractDurationFromPlainDateTime(operation, dateTime, durationLike, options) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  options = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(options);

  const calendar = GetSlot(dateTime, CALENDAR);

  const normalizedDuration = NormalizeDurationWith24HourDays(duration);

  // Add the time part
  const timeResult = AddTime(
    GetSlot(dateTime, ISO_HOUR),
    GetSlot(dateTime, ISO_MINUTE),
    GetSlot(dateTime, ISO_SECOND),
    GetSlot(dateTime, ISO_MILLISECOND),
    GetSlot(dateTime, ISO_MICROSECOND),
    GetSlot(dateTime, ISO_NANOSECOND),
    normalizedDuration.norm
  );
  const dateDuration = AdjustDateDurationRecord(normalizedDuration.date, timeResult.deltaDays);

  // Delegate the date part addition to the calendar
  RejectDuration(dateDuration.years, dateDuration.months, dateDuration.weeks, dateDuration.days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(
    calendar,
    { year: GetSlot(dateTime, ISO_YEAR), month: GetSlot(dateTime, ISO_MONTH), day: GetSlot(dateTime, ISO_DAY) },
    dateDuration,
    overflow
  );

  const result = CombineISODateAndTimeRecord(addedDate, timeResult);

  return CreateTemporalDateTime(
    result.year,
    result.month,
    result.day,
    result.hour,
    result.minute,
    result.second,
    result.millisecond,
    result.microsecond,
    result.nanosecond,
    calendar
  );
}

export function AddDurationToOrSubtractDurationFromPlainTime(operation, temporalTime, durationLike) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const normalizedDuration = NormalizeDurationWith24HourDays(duration);
  let { hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
    GetSlot(temporalTime, ISO_HOUR),
    GetSlot(temporalTime, ISO_MINUTE),
    GetSlot(temporalTime, ISO_SECOND),
    GetSlot(temporalTime, ISO_MILLISECOND),
    GetSlot(temporalTime, ISO_MICROSECOND),
    GetSlot(temporalTime, ISO_NANOSECOND),
    normalizedDuration.norm
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
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  options = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(options);
  const sign = DurationSign(duration);

  const calendar = GetSlot(yearMonth, CALENDAR);
  const fields = TemporalObjectToFields(yearMonth);
  fields.day = 1;
  let startDate = CalendarDateFromFields(calendar, fields, 'constrain');
  if (sign < 0) {
    const nextMonth = CalendarDateAdd(calendar, startDate, { months: 1 }, 'constrain');
    startDate = BalanceISODate(nextMonth.year, nextMonth.month, nextMonth.day - 1);
  }
  const durationToAdd = NormalizeDurationWithoutTime(duration);
  RejectDateRange(startDate.year, startDate.month, startDate.day);
  const addedDate = CalendarDateAdd(calendar, startDate, durationToAdd, overflow);
  const addedDateFields = ISODateToFields(calendar, addedDate, 'year-month');

  const { year, month, day } = CalendarYearMonthFromFields(calendar, addedDateFields, overflow);
  return CreateTemporalYearMonth(year, month, calendar, day);
}

export function AddDurationToOrSubtractDurationFromZonedDateTime(operation, zonedDateTime, durationLike, options) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);

  options = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(options);
  const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const normalized = NormalizeDuration(duration);
  const epochNanoseconds = AddZonedDateTime(
    GetSlot(zonedDateTime, EPOCHNANOSECONDS),
    timeZone,
    calendar,
    normalized,
    overflow
  );
  return CreateTemporalZonedDateTime(epochNanoseconds, timeZone, calendar);
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
  const incrementNs = Call(MapPrototypeGet, NS_PER_TIME_UNIT, [unit]) * increment;
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
  const time = RoundTime(hour, minute, second, millisecond, microsecond, nanosecond, increment, unit, roundingMode);
  const isoDate = BalanceISODate(year, month, day + time.deltaDays);
  return CombineISODateAndTimeRecord(isoDate, time);
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
  const nsPerUnit = Call(MapPrototypeGet, NS_PER_TIME_UNIT, [unit]);
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

export function RoundTimeDuration(duration, increment, unit, roundingMode) {
  // unit must not be a calendar unit

  let days = duration.date.days;
  let norm = duration.norm;
  let total;
  if (unit === 'day') {
    // First convert time units up to days
    const { quotient, remainder } = norm.divmod(DAY_NANOS);
    days += quotient;
    total = days + remainder.fdiv(DAY_NANOS);
    days = RoundNumberToIncrement(total, increment, roundingMode);
    norm = TimeDuration.ZERO;
  } else {
    const divisor = Call(MapPrototypeGet, NS_PER_TIME_UNIT, [unit]);
    total = norm.fdiv(divisor);
    norm = norm.round(divisor * increment, roundingMode);
  }
  const dateDuration = AdjustDateDurationRecord(duration.date, days);
  return { duration: CombineDateAndNormalizedTimeDuration(dateDuration, norm), total };
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
  return typeof BigIntCtor === 'undefined' ? wrapper : wrapper.value;
}

export function ToBigInt(arg) {
  if (bigInt.isInstance(arg)) {
    return arg;
  }

  const prim = ToPrimitive(arg, NumberCtor);
  switch (typeof prim) {
    case 'undefined':
    case 'object':
    case 'number':
    case 'symbol':
      throw new TypeErrorCtor(`cannot convert ${typeof arg} to bigint`);
    case 'string':
      if (!Call(StringPrototypeMatch, prim, [/^\s*(?:[+-]?\d+\s*)?$/])) {
        throw new SyntaxErrorCtor('invalid BigInt syntax');
      }
    // eslint: no-fallthrough: false
    case 'bigint':
      try {
        return bigInt(prim);
      } catch (e) {
        if (e instanceof ErrorCtor && Call(StringPrototypeStartsWith, e.message, ['Invalid integer'])) {
          throw new SyntaxErrorCtor(e.message);
        }
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
  let ns = DateNow() % 1e6;
  return () => {
    const ms = DateNow();
    const result = bigInt(ms).multiply(1e6).plus(ns);
    ns = ms % 1e6;
    return bigInt.min(NS_MAX, bigInt.max(NS_MIN, result));
  };
})();

export function DefaultTimeZone() {
  return Call(IntlDateTimeFormatPrototypeResolvedOptions, new IntlDateTimeFormat(), []).timeZone;
}

export function ComparisonResult(value) {
  return value < 0 ? -1 : value > 0 ? 1 : value;
}

export function GetOptionsObject(options) {
  if (options === undefined) return ObjectCreate(null);
  if (Type(options) === 'Object') return options;
  throw new TypeErrorCtor(
    `Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`
  );
}

export function GetOption(options, property, allowedValues, fallback) {
  let value = options[property];
  if (value !== undefined) {
    value = ToString(value);
    if (!Call(ArrayPrototypeIncludes, allowedValues, [value])) {
      throw new RangeErrorCtor(
        `${property} must be one of ${Call(ArrayPrototypeJoin, allowedValues, [', '])}, not ${value}`
      );
    }
    return value;
  }
  if (fallback === REQUIRED) throw new RangeErrorCtor(`${property} option is required`);
  return fallback;
}

export function IsBuiltinCalendar(id) {
  return Call(ArrayPrototypeIncludes, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)]);
}

// This is a temporary implementation. Ideally we'd rely on Intl.DateTimeFormat
// here, to provide the latest CLDR alias data, when implementations catch up to
// the ECMA-402 change. The aliases below are taken from
// https://github.com/unicode-org/cldr/blob/main/common/bcp47/calendar.xml
export function CanonicalizeCalendar(id) {
  id = ASCIILowercase(id);
  switch (id) {
    case 'ethiopic-amete-alem':
      // May need to be removed in the future.
      // See https://github.com/tc39/ecma402/issues/285
      return 'ethioaa';
    // case 'gregorian':
    // (Skip 'gregorian'. It isn't a valid identifier as it's a single
    // subcomponent longer than 8 letters. It can only be used with the old
    // @key=value syntax.)
    case 'islamicc':
      return 'islamic-civil';
  }
  return id;
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

// This function isn't in the spec, but we put it in the polyfill to avoid
// repeating the same (long) error message in many files.
export function ValueOfThrows(constructorName) {
  const compareCode =
    constructorName === 'PlainMonthDay'
      ? 'Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))'
      : `Temporal.${constructorName}.compare(obj1, obj2)`;

  throw new TypeErrorCtor(
    'Do not use built-in arithmetic operators with Temporal objects. ' +
      `When comparing, use ${compareCode}, not obj1 > obj2. ` +
      "When coercing to strings, use `${obj}` or String(obj), not '' + obj. " +
      'When coercing to numbers, use properties or methods of the object, not `+obj`. ' +
      'When concatenating with strings, use `${str}${obj}` or str.concat(obj), not str + obj. ' +
      'In React, coerce to a string before rendering a Temporal object.'
  );
}

const OFFSET = new RegExpCtor(`^${PARSE.offset.source}$`);
const OFFSET_WITH_PARTS = new RegExpCtor(`^${PARSE.offsetWithParts.source}$`);

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
      throw new ErrorCtor(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}
