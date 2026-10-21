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
  ArrayPrototypeEvery,
  ArrayPrototypeFilter,
  ArrayPrototypeIncludes,
  ArrayPrototypeJoin,
  ArrayPrototypeMap,
  ArrayPrototypePush,
  ArrayPrototypeSort,
  ArrayPrototypeUnshift,
  DateNow,
  DatePrototypeGetUTCFullYear,
  DatePrototypeGetUTCMonth,
  DatePrototypeGetUTCDate,
  DatePrototypeGetUTCHours,
  DatePrototypeGetUTCMinutes,
  DatePrototypeGetUTCSeconds,
  DatePrototypeGetUTCMilliseconds,
  IntlDateTimeFormat,
  IntlDateTimeFormatPrototypeGetFormat,
  IntlDateTimeFormatPrototypeResolvedOptions,
  IntlSupportedValuesOf,
  JSONStringify,
  MapPrototypeGet,
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
  StringPrototypePadStart,
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
import Type from 'es-abstract/2024/Type.js';
import modulo from 'es-abstract/2024/modulo.js';

import { assert, assertNotReached } from './assert.mjs';
import { GetIntrinsic } from './intrinsicclass.mjs';
import {
  ApplyUnsignedRoundingMode,
  FMAPowerOf10,
  GetUnsignedRoundingMode,
  TruncatingDivModByPowerOf10
} from './math.mjs';
import { CreateMonthCode, ParseMonthCode } from './monthcode.mjs';
import { TimeDuration } from './timeduration.mjs';
import {
  CreateSlots,
  GetSlot,
  HasSlot,
  SetSlot,
  EPOCHNANOSECONDS,
  ISO_DATE,
  ISO_DATE_TIME,
  TIME,
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

export const MILLISECONDS_PER_DAY = 86400_000;
export const NANOSECONDS_PER_DAY = MILLISECONDS_PER_DAY * 1e6;
const NANOSECONDS_PER_HOUR = 3600e9;
const NANOSECONDS_PER_MINUTE = 60e9;
const NANOSECONDS_PER_SECOND = 1e9;
const NANOSECONDS_PER_MILLISECOND = 1e6;
const NANOSECONDS_PER_MICROSECOND = 1e3;
// Instant range is 100 million days (inclusive) before or after epoch.
const MS_MAX = MILLISECONDS_PER_DAY * 1e8;
const NS_MIN = bigInt(NANOSECONDS_PER_DAY).multiply(-1e8);
export const NS_MAX = bigInt(NANOSECONDS_PER_DAY).multiply(1e8);
// PlainDateTime range is 24 hours wider (exclusive) than the Instant range on
// both ends, to allow for valid Instant=>PlainDateTime conversion for all
// built-in time zones (whose offsets must have a magnitude less than 24 hours).
const DATETIME_NS_MIN = NS_MIN.subtract(NANOSECONDS_PER_DAY).add(bigInt.one);
const DATETIME_NS_MAX = NS_MAX.add(NANOSECONDS_PER_DAY).subtract(bigInt.one);
const YEAR_MIN = -271821;
const YEAR_MAX = 275760;
const BEFORE_FIRST_DST = ISODateToEpochDays(1847, 1, 1) * MILLISECONDS_PER_DAY; // 1847-01-01T00:00:00Z

const BUILTIN_CALENDAR_IDS = [
  'iso8601',
  'hebrew',
  'islamic-umalqura',
  'islamic-tbla',
  'islamic-civil',
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

export function SnapToInteger(arg, nonIntHandling, property = 'value', minimum = -Infinity, maximum = Infinity) {
  const number = ToNumber(arg);
  if (NumberIsNaN(number) || !NumberIsFinite(number)) {
    throw new RangeErrorCtor(`'${property}' cannot be Infinity or NaN`);
  }
  // ℝ(value) in spec text; converts -0 to 0
  let mv = number === 0 ? 0 : number;
  if (nonIntHandling === 'truncate') mv = MathTrunc(mv);
  if (!IsIntegralNumber(mv)) throw new RangeErrorCtor(`'${property}' must be an integer, not ${arg}`);
  if (mv < minimum) throw new RangeErrorCtor(`'${property}' cannot be less than ${minimum}`);
  if (mv > maximum) throw new RangeErrorCtor(`'${property}' cannot be greater than ${maximum}`);
  return mv;
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
  return HasSlot(item, TIME);
}

export function IsTemporalDateTime(item) {
  return HasSlot(item, ISO_DATE_TIME);
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

function ParseISODateTime(isoString) {
  // ZDT is the superset of fields for every other Temporal type
  const match = Call(RegExpPrototypeExec, PARSE.zoneddatetime, [isoString]);
  if (!match) throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}`);
  const calendar = processAnnotations(match.groups.annotation);
  let yearString = match.groups.yearpart;
  if (yearString === '-000000') throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}`);
  const year = +yearString;
  const month = +match.groups.monthpart;
  const day = +match.groups.daypart;
  assert(NumberIsFinite(month) && NumberIsFinite(day), `Month and day must be present if string ${isoString} matched`);
  const hasTime = match.groups.hour !== undefined;
  const hasMinute = match.groups.minute !== undefined;
  const hasSecond = match.groups.second !== undefined;
  const hasFraction = match.groups.fraction !== undefined;
  if (hasFraction && (!hasSecond || (!hasMinute && hasTime))) {
    throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}, only seconds may be fractional`);
  }
  const hour = +(match.groups.hour ?? 0);
  const minute = +(match.groups.minute ?? 0);
  let second = +(match.groups.second ?? 0);
  if (second === 60) second = 59;
  const fraction = (match.groups.fraction ?? '') + '000000000';
  const millisecond = +Call(StringPrototypeSlice, fraction, [0, 3]);
  const microsecond = +Call(StringPrototypeSlice, fraction, [3, 6]);
  const nanosecond = +Call(StringPrototypeSlice, fraction, [6, 9]);
  let offset;
  let z = false;
  if (match.groups.z) {
    offset = undefined;
    z = true;
  } else if (match.groups.offset) {
    offset = match.groups.offset;
  }
  const tzAnnotation = match.groups.timeZoneID;
  // Note: Not assertions as in the spec, because our regexes use [0-9] and
  // don't support the spec's Early Errors.
  if (!IsValidISODate(year, month, day)) throw new RangeErrorCtor(`${isoString} is not a valid date`);
  const time = hasTime ? CreateTimeRecord(hour, minute, second, millisecond, microsecond, nanosecond) : 'start-of-day';
  return {
    year,
    month,
    day,
    time,
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
  let hour, minute, second, millisecond, microsecond, nanosecond, calendar;
  if (match) {
    calendar = processAnnotations(match.groups.annotation);
    const hasFraction = match.groups.fraction !== undefined;
    const hasSecond = match.groups.second !== undefined;
    const hasMinute = match.groups.minute !== undefined;
    const hasHour = match.groups.hour !== undefined;
    if (hasFraction && (!hasSecond || (!hasMinute && hasHour))) {
      throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}, only seconds may be fractional`);
    }
    hour = +match.groups.hour;
    assert(hasHour, `Hour must be present if string ${isoString} matched`);
    minute = +(match.groups.minute ?? 0);
    second = +(match.groups.second ?? 0);
    if (second === 60) second = 59;
    const fraction = (match.groups.fraction ?? '') + '000000000';
    millisecond = +Call(StringPrototypeSlice, fraction, [0, 3]);
    microsecond = +Call(StringPrototypeSlice, fraction, [3, 6]);
    nanosecond = +Call(StringPrototypeSlice, fraction, [6, 9]);
    if (match.groups.z) throw new RangeErrorCtor('Z designator not supported for PlainTime');
    // Not an assertion as in the spec, because our regexes use [0-9]
    if (!IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond)) {
      throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}, time components invalid`);
    }
  } else {
    const { time, z } = ParseISODateTime(isoString);
    if (time === 'start-of-day') throw new RangeErrorCtor(`time is missing in string: ${isoString}`);
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainTime');
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = time);
  }
  // if it's a date-time string, OK
  if (Call(RegExpPrototypeTest, /[tT ][0-9][0-9]/, [isoString])) {
    return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
  }
  // Reject strings that are ambiguous with PlainMonthDay or PlainYearMonth.
  try {
    ParseTemporalMonthDayString(isoString);
  } catch {
    try {
      ParseTemporalYearMonthString(isoString);
    } catch {
      return { hour, minute, second, millisecond, microsecond, nanosecond, calendar };
    }
  }
  throw new RangeErrorCtor(`invalid RFC 9557 time-only string ${isoString}; may need a T prefix`);
}

export function ParseTemporalYearMonthString(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.yearmonth, [isoString]);
  let year, month, calendar, referenceISODay;
  if (match) {
    calendar = processAnnotations(match[3]);
    let yearString = match[1];
    if (yearString === '-000000') throw new RangeErrorCtor(`invalid RFC 9557 string: ${isoString}`);
    year = +yearString;
    month = +match[2];
    referenceISODay = 1;
    if (calendar !== undefined) {
      calendar = ASCIILowercase(calendar);
      if (calendar !== 'iso8601') {
        throw new RangeErrorCtor('YYYY-MM format is only valid with iso8601 calendar');
      }
    }
    // Not an assertion as in the spec, because our regexes don't have the
    // spec's Early Errors
    if (!IsValidISODate(year, month, referenceISODay)) {
      throw new RangeErrorCtor(`${isoString} invalid for YYYY-MM format`);
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
    referenceISOYear = 1972;
    if (calendar !== undefined) {
      calendar = ASCIILowercase(calendar);
      if (calendar !== 'iso8601') {
        throw new RangeErrorCtor('MM-DD format is only valid with iso8601 calendar');
      }
    }
    // Not an assertion as in the spec, because our regexes don't have the
    // spec's Early Errors
    if (!IsValidISODate(referenceISOYear, month, day)) {
      throw new RangeErrorCtor(`${isoString} invalid for MM-DD format`);
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
    return { offsetMinutes: offsetNanoseconds / NANOSECONDS_PER_MINUTE };
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
  /* c8 ignore next */ assertNotReached();
}

export function ParseTemporalDurationStringRaw(isoString) {
  const match = Call(RegExpPrototypeExec, PARSE.duration, [isoString]);
  if (!match) throw new RangeErrorCtor(`invalid duration: ${isoString}`);
  if (Call(ArrayPrototypeEvery, match, [(part, i) => i < 2 || part === undefined])) {
    throw new RangeErrorCtor(`invalid duration: ${isoString}`);
  }
  const sign = match[1] === '-' ? -1 : 1;
  const years = match[2] === undefined ? 0 : SnapToInteger(match[2], 'truncate') * sign;
  const months = match[3] === undefined ? 0 : SnapToInteger(match[3], 'truncate') * sign;
  const weeks = match[4] === undefined ? 0 : SnapToInteger(match[4], 'truncate') * sign;
  const days = match[5] === undefined ? 0 : SnapToInteger(match[5], 'truncate') * sign;
  const hours = match[6] === undefined ? 0 : SnapToInteger(match[6], 'truncate') * sign;
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
    excessNanoseconds =
      SnapToInteger(Call(StringPrototypeSlice, fHours + '000000000', [0, 9]), 'truncate') * 3600 * sign;
  } else {
    minutes = minutesStr === undefined ? 0 : SnapToInteger(minutesStr, 'truncate') * sign;
    if (fMinutes !== undefined) {
      if (secondsStr ?? fSeconds ?? false) {
        throw new RangeErrorCtor('only the smallest unit can be fractional');
      }
      excessNanoseconds =
        SnapToInteger(Call(StringPrototypeSlice, fMinutes + '000000000', [0, 9]), 'truncate') * 60 * sign;
    } else {
      seconds = secondsStr === undefined ? 0 : SnapToInteger(secondsStr, 'truncate') * sign;
      if (fSeconds !== undefined) {
        excessNanoseconds =
          SnapToInteger(Call(StringPrototypeSlice, fSeconds + '000000000', [0, 9]), 'truncate') * sign;
      }
    }
  }

  const nanoseconds = excessNanoseconds % NANOSECONDS_PER_MICROSECOND;
  const microseconds = MathTrunc(excessNanoseconds / NANOSECONDS_PER_MICROSECOND) % 1000;
  const milliseconds = MathTrunc(excessNanoseconds / NANOSECONDS_PER_MILLISECOND) % 1000;
  seconds += MathTrunc(excessNanoseconds / NANOSECONDS_PER_SECOND) % 60;
  minutes += MathTrunc(excessNanoseconds / NANOSECONDS_PER_MINUTE);

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
  if (overflow === 'constrain') {
    month = ConstrainToRange(month, 1, 12);
    const daysInMonth = ISODaysInMonth(year, month);
    day = ConstrainToRange(day, 1, daysInMonth);
    return CreateISODateRecordInfallible(year, month, day);
  }
  return CreateISODateRecord(year, month, day);
}

export function RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow) {
  if (overflow === 'constrain') {
    hour = ConstrainToRange(hour, 0, 23);
    minute = ConstrainToRange(minute, 0, 59);
    second = ConstrainToRange(second, 0, 59);
    millisecond = ConstrainToRange(millisecond, 0, 999);
    microsecond = ConstrainToRange(microsecond, 0, 999);
    nanosecond = ConstrainToRange(nanosecond, 0, 999);
    return CreateTimeRecordInfallible(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  return CreateTimeRecord(hour, minute, second, millisecond, microsecond, nanosecond);
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
      result[property] = SnapToInteger(value, 'reject', property);
    }
  }
  if (!any) {
    throw new TypeErrorCtor('invalid duration-like');
  }
  return result;
}

export function AdjustDateDurationRecord(dateDuration, newDays, newWeeks, newMonths) {
  assert(newDays !== undefined, 'days must be provided to AdjustDateDurationRecord');
  const months = newMonths ?? dateDuration.months;
  const weeks = newWeeks ?? dateDuration.weeks;
  RejectDuration(dateDuration.years, months, weeks, newDays, 0, 0, 0, 0, 0, 0);
  return {
    years: dateDuration.years,
    months,
    weeks,
    days: newDays
  };
}

export function ZeroDateDuration() {
  return { years: 0, months: 0, weeks: 0, days: 0 };
}

export function MidnightTimeRecord() {
  return { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
}

export function NoonTimeRecord() {
  return { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
}

// Helper function for throwing errors with good messages
function validateStringValue(property, value, allowedValues) {
  if (!Call(ArrayPrototypeIncludes, allowedValues, [value])) {
    throw new RangeErrorCtor(
      `${property} must be one of ${Call(ArrayPrototypeJoin, allowedValues, [', '])}, not ${value}`
    );
  }
}

export function GetTemporalOverflowOption(options) {
  const value = options.overflow;
  if (value === undefined) return 'constrain';
  const stringValue = ToString(value);
  validateStringValue('overflow', stringValue, ['constrain', 'reject']);
  return stringValue;
}

export function GetTemporalDisambiguationOption(options) {
  const value = options.disambiguation;
  if (value === undefined) return 'compatible';
  const stringValue = ToString(value);
  validateStringValue('disambiguation', stringValue, ['compatible', 'earlier', 'later', 'reject']);
  return stringValue;
}

export function GetRoundingModeOption(options, fallback) {
  const value = options.roundingMode;
  if (value === undefined) return fallback;
  const stringValue = ToString(value);
  validateStringValue('roundingMode', stringValue, [
    'ceil',
    'floor',
    'expand',
    'trunc',
    'halfCeil',
    'halfFloor',
    'halfExpand',
    'halfTrunc',
    'halfEven'
  ]);
  return stringValue;
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
  const value = options.offset;
  if (value === undefined) return fallback;
  const stringValue = ToString(value);
  validateStringValue('offset', stringValue, ['prefer', 'use', 'ignore', 'reject']);
  return stringValue;
}

export function GetTemporalShowCalendarNameOption(options) {
  const value = options.calendarName;
  if (value === undefined) return 'auto';
  const stringValue = ToString(value);
  validateStringValue('calendarName', stringValue, ['auto', 'always', 'never', 'critical']);
  return stringValue;
}

export function GetTemporalShowTimeZoneNameOption(options) {
  const value = options.timeZoneName;
  if (value === undefined) return 'auto';
  const stringValue = ToString(value);
  validateStringValue('timeZoneName', stringValue, ['auto', 'never', 'critical']);
  return stringValue;
}

export function GetTemporalShowOffsetOption(options) {
  const value = options.offset;
  if (value === undefined) return 'auto';
  const stringValue = ToString(value);
  validateStringValue('offset', stringValue, ['auto', 'never']);
  return stringValue;
}

export function GetDirectionOption(options) {
  const value = options.direction;
  if (value === undefined) throw new RangeErrorCtor("'direction' option is required");
  const stringValue = ToString(value);
  validateStringValue('direction', stringValue, ['next', 'previous']);
  return stringValue;
}

export function GetRoundingIncrementOption(options) {
  let increment = options.roundingIncrement;
  if (increment === undefined) return 1;
  return SnapToInteger(increment, 'truncate', 'roundingIncrement', 1, 1e9);
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
    const digitsString = ToString(digitsValue);
    if (digitsString !== 'auto') {
      throw new RangeErrorCtor(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digitsString}`);
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

export function GetTemporalUnitValuedOption(options, key, requiredOrUndefined = undefined) {
  const value = options[key];
  if (value === undefined) {
    if (requiredOrUndefined === REQUIRED) throw new RangeErrorCtor(`'${key}' option is required`);
    return undefined;
  }
  let stringValue = ToString(value);
  if (stringValue === 'auto') return 'auto';
  if (stringValue === 'year' || stringValue === 'years') return 'year';
  if (stringValue === 'month' || stringValue === 'months') return 'month';
  if (stringValue === 'week' || stringValue === 'weeks') return 'week';
  if (stringValue === 'day' || stringValue === 'days') return 'day';
  if (stringValue === 'hour' || stringValue === 'hours') return 'hour';
  if (stringValue === 'minute' || stringValue === 'minutes') return 'minute';
  if (stringValue === 'second' || stringValue === 'seconds') return 'second';
  if (stringValue === 'millisecond' || stringValue === 'milliseconds') return 'millisecond';
  if (stringValue === 'microsecond' || stringValue === 'microseconds') return 'microsecond';
  if (stringValue === 'nanosecond' || stringValue === 'nanoseconds') return 'nanosecond';
  throw new RangeErrorCtor(`invalid value ${stringValue} for ${key} property`);
}

export function ValidateTemporalUnitValue(value, unitGroup, extraValues = []) {
  if (value === undefined) return;
  if (Call(ArrayPrototypeIncludes, extraValues, [value])) return;
  if (IsDateUnit(value) && (unitGroup === 'date' || unitGroup === 'datetime')) return;
  if (IsTimeUnit(value) && (unitGroup === 'time' || unitGroup === 'datetime')) return;
  throw new RangeErrorCtor(`${value} not allowed as a ${unitGroup} unit`);
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
  let isoDate, time, calendar, timeZone, offset;
  if (Type(relativeTo) === 'Object') {
    if (IsTemporalZonedDateTime(relativeTo)) {
      return { zonedRelativeTo: relativeTo };
    }
    if (IsTemporalDate(relativeTo)) return { plainRelativeTo: relativeTo };
    if (IsTemporalDateTime(relativeTo)) {
      return {
        plainRelativeTo: CreateTemporalDate(GetSlot(relativeTo, ISO_DATE_TIME).isoDate, GetSlot(relativeTo, CALENDAR))
      };
    }
    calendar = GetTemporalCalendarIdentifierWithISODefault(relativeTo);
    const fields = PrepareCalendarFields(
      calendar,
      relativeTo,
      'date-fields',
      'time-fields-with-time-zone-and-offset',
      'no-required-fields'
    );
    ({ isoDate, time } = InterpretTemporalDateTimeFields(calendar, fields, 'constrain'));
    ({ offset, timeZone } = fields);
    if (offset === undefined) offsetBehaviour = 'wall';
  } else {
    let tzAnnotation, z, year, month, day;
    ({ year, month, day, time, calendar, tzAnnotation, offset, z } = ParseISODateTime(RequireString(relativeTo)));
    if (tzAnnotation) {
      timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
      if (z) {
        offsetBehaviour = 'exact';
      } else if (!offset) {
        offsetBehaviour = 'wall';
      }
      // Allow imprecise offset matching unless the provided offset is precise
      matchMinutes = true;
      if (offset) {
        const offsetParseResult = Call(RegExpPrototypeExec, OFFSET_WITH_PARTS, [offset]);
        assert(offsetParseResult, 'offset string must re-parse');
        const offsetSecondsPart = offsetParseResult.groups.offsetSecond;
        if (offsetSecondsPart) matchMinutes = false;
      }
    } else if (z) {
      throw new RangeErrorCtor(
        'Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone'
      );
    }
    if (!calendar) calendar = 'iso8601';
    calendar = CanonicalizeCalendar(calendar);
    isoDate = CreateISODateRecordInfallible(year, month, day);
  }
  if (timeZone === undefined) {
    return { plainRelativeTo: CreateTemporalDate(isoDate, calendar) };
  }
  const offsetNs = offsetBehaviour === 'option' ? ParseDateTimeUTCOffset(offset) : 0;
  const epochNanoseconds = InterpretISODateTimeOffset(
    isoDate,
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

export function LargerOfTwoTemporalUnits(xUnit, yUnit) {
  if (xUnit === 'year' || yUnit === 'year') return 'year';
  if (xUnit === 'month' || yUnit === 'month') return 'month';
  if (xUnit === 'week' || yUnit === 'week') return 'week';
  if (xUnit === 'day' || yUnit === 'day') return 'day';
  if (xUnit === 'hour' || yUnit === 'hour') return 'hour';
  if (xUnit === 'minute' || yUnit === 'minute') return 'minute';
  if (xUnit === 'second' || yUnit === 'second') return 'second';
  if (xUnit === 'millisecond' || yUnit === 'millisecond') return 'millisecond';
  if (xUnit === 'microsecond' || yUnit === 'microsecond') return 'microsecond';
  return 'nanosecond';
}

export function IsCalendarUnit(unit) {
  return unit === 'year' || unit === 'month' || unit === 'week';
}

export function IsDateUnit(unit) {
  return IsCalendarUnit(unit) || unit === 'day';
}

export function IsTimeUnit(unit) {
  return !IsDateUnit(unit);
}

function TemporalUnitLength(unit) {
  switch (unit) {
    case 'day':
      return NANOSECONDS_PER_DAY;
    case 'hour':
      return NANOSECONDS_PER_HOUR;
    case 'minute':
      return NANOSECONDS_PER_MINUTE;
    case 'second':
      return NANOSECONDS_PER_SECOND;
    case 'millisecond':
      return NANOSECONDS_PER_MILLISECOND;
    case 'microsecond':
      return NANOSECONDS_PER_MICROSECOND;
    case 'nanosecond':
      return 1;
    default:
      /* c8 ignore next */ assertNotReached(`${unit} shouldn't be passed to TemporalUnitLength`);
  }
}

function calendarImplForID(calendar) {
  return GetIntrinsic('%calendarImpl%')(calendar);
}

export function calendarImplForObj(temporalObj) {
  return GetIntrinsic('%calendarImpl%')(GetSlot(temporalObj, CALENDAR));
}

export function ISODateToFields(calendar, isoDate, type = 'date') {
  const fields = ObjectCreate(null);
  const calendarImpl = calendarImplForID(calendar);
  const calendarDate = calendarImpl.isoToDate(isoDate, { year: true, monthCode: true, day: true });

  fields.monthCode = calendarDate.monthCode;
  if (type === 'month-day' || type === 'date') {
    fields.day = calendarDate.day;
  }
  if (type === 'year-month' || type === 'date') {
    fields.year = calendarDate.year;
  }
  return fields;
}

export function PrepareCalendarFields(calendar, bag, calendarFields, nonCalendarFields, requiredFields) {
  let propertyNames;
  switch (calendarFields) {
    case 'date-fields':
      propertyNames = ['day', 'month', 'monthCode', 'year'];
      break;
    case 'year-month-fields':
      propertyNames = ['month', 'monthCode', 'year'];
      break;
    case 'only-day':
      propertyNames = ['day'];
      break;
    case 'only-year':
      propertyNames = ['year'];
      break;
    default:
      /* c8 ignore next */ assertNotReached(`invalid calendarFields ${calendarFields}`);
  }
  const extraFieldNames = calendarImplForID(calendar).extraFields(propertyNames);
  switch (nonCalendarFields) {
    case 'time-fields-with-time-zone-and-offset':
      Call(ArrayPrototypePush, propertyNames, ['timeZone']);
    // fallthrough
    case 'time-fields-with-offset':
      Call(ArrayPrototypePush, propertyNames, ['offset']);
    //fallthrough
    case 'time-fields':
      Call(ArrayPrototypePush, propertyNames, ['hour', 'microsecond', 'millisecond', 'minute', 'nanosecond', 'second']);
      break;
    case 'no-non-calendar-fields':
      break;
    default:
      /* c8 ignore next */ assertNotReached(`invalid nonCalendarFields ${nonCalendarFields}`);
  }
  Call(ArrayPrototypePush, propertyNames, extraFieldNames);
  const result = ObjectCreate(null);
  if (requiredFields !== 'partial') {
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    result.millisecond = 0;
    result.microsecond = 0;
    result.nanosecond = 0;
  }
  let anyPresent = false;
  Call(ArrayPrototypeSort, propertyNames, []);
  for (let index = 0; index < propertyNames.length; index++) {
    const property = propertyNames[index];
    const value = bag[property];
    if (value === undefined) {
      if (requiredFields === 'time-zone' && property === 'timeZone') {
        throw new TypeErrorCtor("required property 'timeZone' missing or undefined");
      }
    } else {
      anyPresent = true;
      switch (property) {
        case 'eraYear':
        case 'year':
        case 'hour':
        case 'minute':
        case 'second':
        case 'millisecond':
        case 'microsecond':
        case 'nanosecond':
          result[property] = SnapToInteger(value, 'truncate', property);
          break;
        case 'month':
        case 'day':
          result[property] = SnapToInteger(value, 'truncate', property, 1);
          break;
        case 'era':
          result.era = ToString(value);
          break;
        case 'timeZone':
          result.timeZone = ToTemporalTimeZoneIdentifier(value);
          break;
        case 'monthCode':
          {
            const parsed = ParseMonthCode(value);
            result.monthCode = CreateMonthCode(parsed.monthNumber, parsed.isLeapMonth);
          }
          break;
        case 'offset':
          {
            const offset = ToPrimitive(value, StringCtor);
            RequireString(offset);
            ParseDateTimeUTCOffset(offset);
            result.offset = offset;
          }
          break;
        default:
          /* c8 ignore next */ assertNotReached(`wrong property ${property}`);
      }
    }
  }
  if (requiredFields === 'partial' && !anyPresent) {
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
      result[field] = SnapToInteger(value, 'truncate', field);
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
      return CreateTemporalDate(GetSlot(item, ISO_DATE), GetSlot(item, CALENDAR));
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
      const isoDate = isoDateTime.isoDate;
      return CreateTemporalDate(isoDate, GetSlot(item, CALENDAR));
    }
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
      return CreateTemporalDate(GetSlot(item, ISO_DATE_TIME).isoDate, GetSlot(item, CALENDAR));
    }
    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(calendar, item, 'date-fields', 'no-non-calendar-fields', 'no-required-fields');
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const isoDate = CalendarDateFromFields(calendar, fields, overflow);
    return CreateTemporalDate(isoDate, calendar);
  }
  let { year, month, day, calendar, z } = ParseTemporalDateString(RequireString(item));
  if (z) throw new RangeErrorCtor('Z designator not supported for PlainDate');
  if (!calendar) calendar = 'iso8601';
  calendar = CanonicalizeCalendar(calendar);
  GetTemporalOverflowOption(GetOptionsObject(options)); // validate and ignore
  const isoDate = CreateISODateRecordInfallible(year, month, day);
  return CreateTemporalDate(isoDate, calendar);
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
  return { isoDate, time };
}

export function ToTemporalDateTime(item, options = undefined) {
  let isoDate, time, calendar;

  if (Type(item) === 'Object') {
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalDateTime(GetSlot(item, ISO_DATE_TIME), GetSlot(item, CALENDAR));
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalDateTime(isoDateTime, GetSlot(item, CALENDAR));
    }
    if (IsTemporalDate(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalDateTime(
        { isoDate: GetSlot(item, ISO_DATE), time: MidnightTimeRecord() },
        GetSlot(item, CALENDAR)
      );
    }

    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(calendar, item, 'date-fields', 'time-fields', 'no-required-fields');
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    ({ isoDate, time } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
  } else {
    let z, year, month, day;
    ({ year, month, day, time, calendar, z } = ParseTemporalDateTimeString(RequireString(item)));
    if (z) throw new RangeErrorCtor('Z designator not supported for PlainDateTime');
    if (time === 'start-of-day') time = MidnightTimeRecord();
    if (!calendar) calendar = 'iso8601';
    calendar = CanonicalizeCalendar(calendar);
    GetTemporalOverflowOption(GetOptionsObject(options));
    isoDate = CreateISODateRecordInfallible(year, month, day);
  }
  return CreateTemporalDateTime({ isoDate, time }, calendar);
}

export function ToTemporalDuration(item) {
  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  if (IsTemporalDuration(item)) {
    return new TemporalDuration(
      GetSlot(item, YEARS),
      GetSlot(item, MONTHS),
      GetSlot(item, WEEKS),
      GetSlot(item, DAYS),
      GetSlot(item, HOURS),
      GetSlot(item, MINUTES),
      GetSlot(item, SECONDS),
      GetSlot(item, MILLISECONDS),
      GetSlot(item, MICROSECONDS),
      GetSlot(item, NANOSECONDS)
    );
  }
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
  const TemporalInstant = GetIntrinsic('%Temporal.Instant%');
  if (Type(item) === 'Object') {
    if (IsTemporalInstant(item) || IsTemporalZonedDateTime(item)) {
      return new TemporalInstant(GetSlot(item, EPOCHNANOSECONDS));
    }
    item = ToPrimitive(item, StringCtor);
  }
  const { year, month, day, time, offset, z } = ParseTemporalInstantString(RequireString(item));
  assert(time !== 'start-of-day', 'Instant string must include a time');
  const { hour, minute, second, millisecond, microsecond, nanosecond } = time;

  // ParseTemporalInstantString ensures that either `z` is true or or `offset` is non-undefined
  const offsetNanoseconds = z ? 0 : ParseDateTimeUTCOffset(offset);
  const balanced = BalanceISODateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    microsecond,
    nanosecond - offsetNanoseconds
  );
  ValidateISODaysRange(balanced.isoDate);
  const epochNanoseconds = GetUTCEpochNanoseconds(balanced);
  ValidateEpochNanoseconds(epochNanoseconds);
  return new TemporalInstant(epochNanoseconds);
}

export function ToTemporalMonthDay(item, options = undefined) {
  if (Type(item) === 'Object') {
    if (IsTemporalMonthDay(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalMonthDay(GetSlot(item, ISO_DATE), GetSlot(item, CALENDAR));
    }
    let calendar;
    if (HasSlot(item, CALENDAR)) {
      calendar = GetSlot(item, CALENDAR);
    } else {
      calendar = item.calendar;
      if (calendar === undefined) calendar = 'iso8601';
      calendar = ToTemporalCalendarIdentifier(calendar);
    }
    const fields = PrepareCalendarFields(calendar, item, 'date-fields', 'no-non-calendar-fields', 'no-required-fields');
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const isoDate = CalendarMonthDayFromFields(calendar, fields, overflow);
    return CreateTemporalMonthDay(isoDate, calendar);
  }

  let { month, day, referenceISOYear, calendar } = ParseTemporalMonthDayString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  calendar = CanonicalizeCalendar(calendar);

  GetTemporalOverflowOption(GetOptionsObject(options));
  if (calendar === 'iso8601') {
    const isoCalendarReferenceYear = 1972; // First leap year after Unix epoch
    const isoDate = CreateISODateRecordInfallible(isoCalendarReferenceYear, month, day);
    return CreateTemporalMonthDay(isoDate, calendar);
  }
  let isoDate = CreateISODateRecordInfallible(referenceISOYear, month, day);
  RejectDateRange(isoDate);
  const result = ISODateToFields(calendar, isoDate, 'month-day');
  isoDate = CalendarMonthDayFromFields(calendar, result, 'constrain');
  return CreateTemporalMonthDay(isoDate, calendar);
}

export function ToTemporalTime(item, options = undefined) {
  let time;
  if (Type(item) === 'Object') {
    if (IsTemporalTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalTime(GetSlot(item, TIME));
    }
    if (IsTemporalDateTime(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalTime(GetSlot(item, ISO_DATE_TIME).time);
    }
    if (IsTemporalZonedDateTime(item)) {
      const isoDateTime = GetISODateTimeFor(GetSlot(item, TIME_ZONE), GetSlot(item, EPOCHNANOSECONDS));
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalTime(isoDateTime.time);
    }
    const { hour, minute, second, millisecond, microsecond, nanosecond } = ToTemporalTimeRecord(item);
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    time = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, overflow);
  } else {
    time = ParseTemporalTimeString(RequireString(item));
    GetTemporalOverflowOption(GetOptionsObject(options));
  }
  return CreateTemporalTime(time);
}

export function ToTimeRecordOrMidnight(item) {
  if (item === undefined) return MidnightTimeRecord();
  return GetSlot(ToTemporalTime(item), TIME);
}

export function ToTemporalYearMonth(item, options = undefined) {
  if (Type(item) === 'Object') {
    if (IsTemporalYearMonth(item)) {
      GetTemporalOverflowOption(GetOptionsObject(options));
      return CreateTemporalYearMonth(GetSlot(item, ISO_DATE), GetSlot(item, CALENDAR));
    }
    const calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(
      calendar,
      item,
      'year-month-fields',
      'no-non-calendar-fields',
      'no-required-fields'
    );
    const overflow = GetTemporalOverflowOption(GetOptionsObject(options));
    const isoDate = CalendarYearMonthFromFields(calendar, fields, overflow);
    return CreateTemporalYearMonth(isoDate, calendar);
  }

  let { year, month, referenceISODay, calendar } = ParseTemporalYearMonthString(RequireString(item));
  if (calendar === undefined) calendar = 'iso8601';
  calendar = CanonicalizeCalendar(calendar);

  GetTemporalOverflowOption(GetOptionsObject(options));
  let isoDate = CreateISODateRecordInfallible(year, month, referenceISODay);
  const result = ISODateToFields(calendar, isoDate, 'year-month');
  isoDate = CalendarYearMonthFromFields(calendar, result, 'constrain');
  return CreateTemporalYearMonth(isoDate, calendar);
}

export function InterpretISODateTimeOffset(
  isoDate,
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
    assert(offsetBehaviour === 'wall', 'offset cannot be provided in YYYY-MM-DD[Zone] string');
    assert(offsetNs === 0, 'offset cannot be provided in YYYY-MM-DD[Zone] string');
    return GetStartOfDay(timeZone, isoDate);
  }

  const dt = { isoDate, time };

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
    const balanced = BalanceISODateTime(
      isoDate.year,
      isoDate.month,
      isoDate.day,
      time.hour,
      time.minute,
      time.second,
      time.millisecond,
      time.microsecond,
      time.nanosecond - offsetNs
    );
    ValidateISODaysRange(balanced.isoDate);
    const epochNs = GetUTCEpochNanoseconds(balanced);
    ValidateEpochNanoseconds(epochNs);
    return epochNs;
  }

  ValidateISODaysRange(isoDate);
  const utcEpochNs = GetUTCEpochNanoseconds(dt);

  // "prefer" or "reject"
  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, dt);
  for (let index = 0; index < possibleEpochNs.length; index++) {
    const candidate = possibleEpochNs[index];
    const candidateOffset = utcEpochNs.subtract(candidate).toJSNumber();
    const roundedCandidateOffset = RoundNumberToIncrement(candidateOffset, NANOSECONDS_PER_MINUTE, 'halfExpand');
    if (candidateOffset === offsetNs || (matchMinute && roundedCandidateOffset === offsetNs)) {
      return candidate;
    }
  }

  // the user-provided offset doesn't match any instants for this time
  // zone and date/time.
  if (offsetOpt === 'reject') {
    const offsetStr = FormatUTCOffsetNanoseconds(offsetNs);
    const dtStr = ISODateTimeToString(dt, 'iso8601', 'auto');
    throw new RangeErrorCtor(`Offset ${offsetStr} is invalid for ${dtStr} in ${timeZone}`);
  }
  // fall through: offsetOpt === 'prefer', but the offset doesn't match
  // so fall back to use the time zone instead.
  return DisambiguatePossibleEpochNanoseconds(possibleEpochNs, timeZone, dt, disambiguation);
}

export function ToTemporalZonedDateTime(item, options = undefined) {
  let isoDate, time, timeZone, offset, calendar;
  let matchMinute = false;
  let hasUTCDesignator = false;
  let disambiguation, offsetOpt;
  if (Type(item) === 'Object') {
    if (IsTemporalZonedDateTime(item)) {
      const resolvedOptions = GetOptionsObject(options);
      GetTemporalDisambiguationOption(resolvedOptions); // validate and ignore
      GetTemporalOffsetOption(resolvedOptions, 'reject');
      GetTemporalOverflowOption(resolvedOptions);
      return CreateTemporalZonedDateTime(
        GetSlot(item, EPOCHNANOSECONDS),
        GetSlot(item, TIME_ZONE),
        GetSlot(item, CALENDAR)
      );
    }
    calendar = GetTemporalCalendarIdentifierWithISODefault(item);
    const fields = PrepareCalendarFields(
      calendar,
      item,
      'date-fields',
      'time-fields-with-time-zone-and-offset',
      'time-zone'
    );
    ({ offset, timeZone } = fields);
    const resolvedOptions = GetOptionsObject(options);
    disambiguation = GetTemporalDisambiguationOption(resolvedOptions);
    offsetOpt = GetTemporalOffsetOption(resolvedOptions, 'reject');
    const overflow = GetTemporalOverflowOption(resolvedOptions);
    ({ isoDate, time } = InterpretTemporalDateTimeFields(calendar, fields, overflow));
  } else {
    let tzAnnotation, z, year, month, day;
    ({ year, month, day, time, tzAnnotation, offset, z, calendar } = ParseTemporalZonedDateTimeString(
      RequireString(item)
    ));
    timeZone = ToTemporalTimeZoneIdentifier(tzAnnotation);
    if (z) hasUTCDesignator = true;
    if (!calendar) calendar = 'iso8601';
    calendar = CanonicalizeCalendar(calendar);
    // Allow imprecise offset matching unless the provided offset is precise
    matchMinute = true;
    if (offset) {
      const offsetParseResult = Call(RegExpPrototypeExec, OFFSET_WITH_PARTS, [offset]);
      assert(offsetParseResult, 'offset string must re-parse');
      const offsetSecondsPart = offsetParseResult.groups.offsetSecond;
      if (offsetSecondsPart) matchMinute = false;
    }
    const resolvedOptions = GetOptionsObject(options);
    disambiguation = GetTemporalDisambiguationOption(resolvedOptions);
    offsetOpt = GetTemporalOffsetOption(resolvedOptions, 'reject');
    GetTemporalOverflowOption(resolvedOptions); // validate and ignore
    isoDate = CreateISODateRecordInfallible(year, month, day);
  }
  let offsetBehaviour = 'option';
  if (hasUTCDesignator) {
    offsetBehaviour = 'exact';
  } else if (!offset) {
    offsetBehaviour = 'wall';
  }
  let offsetNs = 0;
  if (offsetBehaviour === 'option') offsetNs = ParseDateTimeUTCOffset(offset);
  const epochNanoseconds = InterpretISODateTimeOffset(
    isoDate,
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

export function CreateTemporalDateSlots(result, isoDate, calendar) {
  RejectDateRange(isoDate);

  CreateSlots(result);
  SetSlot(result, ISO_DATE, isoDate);
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

export function CreateTemporalDate(isoDate, calendar = 'iso8601') {
  const TemporalPlainDate = GetIntrinsic('%Temporal.PlainDate%');
  const result = ObjectCreate(TemporalPlainDate.prototype);
  CreateTemporalDateSlots(result, isoDate, calendar);
  return result;
}

export function CreateTemporalDateTimeSlots(result, isoDateTime, calendar) {
  RejectDateTimeRange(isoDateTime);

  CreateSlots(result);
  SetSlot(result, ISO_DATE_TIME, isoDateTime);
  SetSlot(result, CALENDAR, calendar);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    let repr = ISODateTimeToString(isoDateTime, calendar, 'auto');
    ObjectDefineProperty(result, '_repr_', {
      value: `Temporal.PlainDateTime <${repr}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalDateTime(isoDateTime, calendar = 'iso8601') {
  const TemporalPlainDateTime = GetIntrinsic('%Temporal.PlainDateTime%');
  const result = ObjectCreate(TemporalPlainDateTime.prototype);
  CreateTemporalDateTimeSlots(result, isoDateTime, calendar);
  return result;
}

export function CreateTemporalMonthDaySlots(result, isoDate, calendar) {
  RejectDateRange(isoDate);

  CreateSlots(result);
  SetSlot(result, ISO_DATE, isoDate);
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

export function CreateTemporalMonthDay(isoDate, calendar) {
  const TemporalPlainMonthDay = GetIntrinsic('%Temporal.PlainMonthDay%');
  const result = ObjectCreate(TemporalPlainMonthDay.prototype);
  CreateTemporalMonthDaySlots(result, isoDate, calendar);
  return result;
}

export function CreateTemporalTimeSlots(result, time) {
  CreateSlots(result);
  SetSlot(result, TIME, time);

  if (typeof __debug__ !== 'undefined' && __debug__) {
    ObjectDefineProperty(result, '_repr_', {
      value: `Temporal.PlainTime <${TimeRecordToString(time, 'auto')}>`,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export function CreateTemporalTime(time) {
  const TemporalPlainTime = GetIntrinsic('%Temporal.PlainTime%');
  const result = ObjectCreate(TemporalPlainTime.prototype);
  CreateTemporalTimeSlots(result, time);
  return result;
}

export function CreateTemporalYearMonthSlots(result, isoDate, calendar) {
  RejectYearMonthRange(isoDate);

  CreateSlots(result);
  SetSlot(result, ISO_DATE, isoDate);
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

export function CreateTemporalYearMonth(isoDate, calendar) {
  const TemporalPlainYearMonth = GetIntrinsic('%Temporal.PlainYearMonth%');
  const result = ObjectCreate(TemporalPlainYearMonth.prototype);
  CreateTemporalYearMonthSlots(result, isoDate, calendar);
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

export function CalendarMergeFields(calendar, fields, additionalFields) {
  const overriddenKeys = calendarImplForID(calendar).fieldKeysToIgnore(additionalFields);
  const merged = ObjectCreate(null);
  if (fields.era !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['era'])) {
    merged.era = fields.era;
  }
  if (additionalFields.era !== undefined) merged.era = additionalFields.era;
  if (fields.eraYear !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['eraYear'])) {
    merged.eraYear = fields.eraYear;
  }
  if (additionalFields.eraYear !== undefined) merged.eraYear = additionalFields.eraYear;
  if (fields.year !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['year'])) {
    merged.year = fields.year;
  }
  if (additionalFields.year !== undefined) merged.year = additionalFields.year;
  if (fields.month !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['month'])) {
    merged.month = fields.month;
  }
  if (additionalFields.month !== undefined) merged.month = additionalFields.month;
  if (fields.monthCode !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['monthCode'])) {
    merged.monthCode = fields.monthCode;
  }
  if (additionalFields.monthCode !== undefined) merged.monthCode = additionalFields.monthCode;
  if (fields.day !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['day'])) {
    merged.day = fields.day;
  }
  if (additionalFields.day !== undefined) merged.day = additionalFields.day;
  if (fields.hour !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['hour'])) {
    merged.hour = fields.hour;
  }
  if (additionalFields.hour !== undefined) merged.hour = additionalFields.hour;
  if (fields.minute !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['minute'])) {
    merged.minute = fields.minute;
  }
  if (additionalFields.minute !== undefined) merged.minute = additionalFields.minute;
  if (fields.second !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['second'])) {
    merged.second = fields.second;
  }
  if (additionalFields.second !== undefined) merged.second = additionalFields.second;
  if (fields.millisecond !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['millisecond'])) {
    merged.millisecond = fields.millisecond;
  }
  if (additionalFields.millisecond !== undefined) merged.millisecond = additionalFields.millisecond;
  if (fields.microsecond !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['microsecond'])) {
    merged.microsecond = fields.microsecond;
  }
  if (additionalFields.microsecond !== undefined) merged.microsecond = additionalFields.microsecond;
  if (fields.nanosecond !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['nanosecond'])) {
    merged.nanosecond = fields.nanosecond;
  }
  if (additionalFields.nanosecond !== undefined) merged.nanosecond = additionalFields.nanosecond;
  if (fields.offset !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['offset'])) {
    merged.offset = fields.offset;
  }
  if (additionalFields.offset !== undefined) merged.offset = additionalFields.offset;
  if (fields.timeZone !== undefined && !Call(ArrayPrototypeIncludes, overriddenKeys, ['timeZone'])) {
    merged.timeZone = fields.timeZone;
  }
  if (additionalFields.timeZone !== undefined) merged.timeZone = additionalFields.timeZone;
  return merged;
}

export function CalendarDateAdd(calendar, isoDate, dateDuration, overflow) {
  const result = calendarImplForID(calendar).dateAdd(isoDate, dateDuration, overflow);
  RejectDateRange(result);
  return result;
}

export function CalendarDateUntil(calendar, isoDate, isoOtherDate, largestUnit) {
  if (CompareISODate(isoDate, isoOtherDate) === 0) {
    return { years: 0, months: 0, weeks: 0, days: 0 };
  }
  return calendarImplForID(calendar).dateUntil(isoDate, isoOtherDate, largestUnit);
}

export function ToTemporalCalendarIdentifier(calendarLike) {
  if (Type(calendarLike) === 'Object') {
    if (HasSlot(calendarLike, CALENDAR)) return GetSlot(calendarLike, CALENDAR);
  }
  const identifier = RequireString(calendarLike);
  try {
    // Fast path: identifier is a calendar type, no ISO string parsing needed
    return CanonicalizeCalendar(identifier);
  } catch {
    // fall through
  }
  let calendar;
  try {
    ({ calendar } = ParseISODateTime(identifier));
  } catch {
    try {
      ({ calendar } = ParseTemporalTimeString(identifier));
    } catch {
      try {
        ({ calendar } = ParseTemporalYearMonthString(identifier));
      } catch {
        ({ calendar } = ParseTemporalMonthDayString(identifier));
      }
    }
  }
  if (!calendar) calendar = 'iso8601';
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
  const calendarImpl = calendarImplForID(calendar);
  calendarImpl.resolveFields(fields, 'date');
  const result = calendarImpl.dateToISO(fields, overflow);
  RejectDateRange(result);
  return result;
}

export function CalendarYearMonthFromFields(calendar, fields, overflow) {
  const calendarImpl = calendarImplForID(calendar);
  calendarImpl.resolveFields(fields, 'year-month');
  fields.day = 1;
  const result = calendarImpl.dateToISO(fields, overflow);
  RejectYearMonthRange(result);
  return result;
}

export function CalendarMonthDayFromFields(calendar, fields, overflow) {
  const calendarImpl = calendarImplForID(calendar);
  calendarImpl.resolveFields(fields, 'month-day');
  const result = calendarImpl.monthDayToISOReferenceDate(fields, overflow);
  RejectDateRange(result);
  return result;
}

export function ToTemporalTimeZoneIdentifier(temporalTimeZoneLike) {
  if (Type(temporalTimeZoneLike) === 'Object') {
    if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetSlot(temporalTimeZoneLike, TIME_ZONE);
  }
  const timeZoneString = RequireString(temporalTimeZoneLike);
  if (timeZoneString === 'UTC') return 'UTC'; // UTC fast path

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
  if (!IsOffsetTimeZoneIdentifier(one) && !IsOffsetTimeZoneIdentifier(two)) {
    const idRecord1 = GetAvailableNamedTimeZoneIdentifier(one);
    const idRecord2 = GetAvailableNamedTimeZoneIdentifier(two);
    assert(idRecord1, `${JSONStringify(one)} has an invalid time zone`);
    assert(idRecord2, `${JSONStringify(two)} has an invalid time zone`);
    return idRecord1.primaryIdentifier === idRecord2.primaryIdentifier;
  }
  assert(ParseTimeZoneIdentifier(one).offsetMinutes !== ParseTimeZoneIdentifier(two).offsetMinutes);
  return false;
}

export function GetOffsetNanosecondsFor(timeZone, epochNs) {
  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
  if (offsetMinutes !== undefined) return offsetMinutes * NANOSECONDS_PER_MINUTE;

  return GetNamedTimeZoneOffsetNanoseconds(timeZone, epochNs);
}

export function FormatUTCOffsetNanoseconds(offsetNs) {
  const sign = offsetNs < 0 ? '-' : '+';
  const absoluteNs = MathAbs(offsetNs);
  const hour = MathFloor(absoluteNs / NANOSECONDS_PER_HOUR);
  const minute = MathFloor(absoluteNs / NANOSECONDS_PER_MINUTE) % 60;
  const second = MathFloor(absoluteNs / NANOSECONDS_PER_SECOND) % 60;
  const subSecondNs = absoluteNs % NANOSECONDS_PER_SECOND;
  const precision = second === 0 && subSecondNs === 0 ? 'minute' : 'auto';
  const timeString = FormatTimeString(hour, minute, second, subSecondNs, precision);
  return `${sign}${timeString}`;
}

export function GetISODateTimeFor(timeZone, epochNs) {
  const offsetNs = GetOffsetNanosecondsFor(timeZone, epochNs);
  let {
    isoDate: { year, month, day },
    time: { hour, minute, second, millisecond, microsecond, nanosecond }
  } = GetISOPartsFromEpoch(epochNs);
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
  const utcns = GetUTCEpochNanoseconds(isoDateTime);

  const dayBefore = utcns.minus(NANOSECONDS_PER_DAY);
  ValidateEpochNanoseconds(dayBefore);
  const offsetBefore = GetOffsetNanosecondsFor(timeZone, dayBefore);
  const dayAfter = utcns.plus(NANOSECONDS_PER_DAY);
  ValidateEpochNanoseconds(dayAfter);
  const offsetAfter = GetOffsetNanosecondsFor(timeZone, dayAfter);
  const nanoseconds = offsetAfter - offsetBefore;
  assert(MathAbs(nanoseconds) <= NANOSECONDS_PER_DAY, 'UTC offset shift longer than 24 hours');

  switch (disambiguation) {
    case 'earlier': {
      const timeDuration = TimeDuration.fromComponents(0, 0, 0, 0, 0, -nanoseconds);
      const earlierTime = AddTime(isoDateTime.time, timeDuration);
      const earlierDate = AddDaysToISODate(isoDateTime.isoDate, earlierTime.deltaDays);
      const earlier = { isoDate: earlierDate, time: earlierTime };
      return GetPossibleEpochNanoseconds(timeZone, earlier)[0];
    }
    case 'compatible':
    // fall through because 'compatible' means 'later' for "spring forward" transitions
    case 'later': {
      const timeDuration = TimeDuration.fromComponents(0, 0, 0, 0, 0, nanoseconds);
      const laterTime = AddTime(isoDateTime.time, timeDuration);
      const laterDate = AddDaysToISODate(isoDateTime.isoDate, laterTime.deltaDays);
      const later = { isoDate: laterDate, time: laterTime };
      const possible = GetPossibleEpochNanoseconds(timeZone, later);
      return possible[possible.length - 1];
    }
    case 'reject':
      /* c8 ignore next */ assertNotReached('reject handled earlier');
  }
  /* c8 ignore next */ assertNotReached(`invalid disambiguation value ${disambiguation}`);
}

export function GetPossibleEpochNanoseconds(timeZone, isoDateTime) {
  // UTC fast path
  if (timeZone === 'UTC') {
    ValidateISODaysRange(isoDateTime.isoDate);
    const epochNs = GetUTCEpochNanoseconds(isoDateTime);
    ValidateEpochNanoseconds(epochNs);
    return [epochNs];
  }

  const offsetMinutes = ParseTimeZoneIdentifier(timeZone).offsetMinutes;
  if (offsetMinutes !== undefined) {
    const balanced = BalanceISODateTime(
      isoDateTime.isoDate.year,
      isoDateTime.isoDate.month,
      isoDateTime.isoDate.day,
      isoDateTime.time.hour,
      isoDateTime.time.minute - offsetMinutes,
      isoDateTime.time.second,
      isoDateTime.time.millisecond,
      isoDateTime.time.microsecond,
      isoDateTime.time.nanosecond
    );
    ValidateISODaysRange(balanced.isoDate);
    const epochNs = GetUTCEpochNanoseconds(balanced);
    ValidateEpochNanoseconds(epochNs);
    return [epochNs];
  }

  return GetNamedTimeZoneEpochNanoseconds(timeZone, isoDateTime);
}

export function GetStartOfDay(timeZone, isoDate) {
  const isoDateTime = { isoDate, time: MidnightTimeRecord() };
  const possibleEpochNs = GetPossibleEpochNanoseconds(timeZone, isoDateTime);
  // If not a DST gap, return the single or earlier epochNs
  if (possibleEpochNs.length) return possibleEpochNs[0];

  // Otherwise, 00:00:00 lies within a DST gap. Compute an epochNs that's
  // guaranteed to be before the transition
  assert(!IsOffsetTimeZoneIdentifier(timeZone), 'should only be reached with named time zone');

  const utcns = GetUTCEpochNanoseconds(isoDateTime);
  const dayBefore = utcns.minus(NANOSECONDS_PER_DAY);
  ValidateEpochNanoseconds(dayBefore);
  return GetNamedTimeZoneNextTransition(timeZone, dayBefore);
}

// Fast version of es-abstract ToZeroPaddedDecimalString without assertions
function ToZeroPaddedDecimalString(n, minLength) {
  const s = StringCtor(n);
  return Call(StringPrototypePadStart, s, [minLength, '0']);
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
  const dateTimeString = ISODateTimeToString(iso, 'iso8601', precision, 'never');
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
  const secondsDuration = TimeDuration.fromComponents(
    0,
    0,
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  );
  if (
    !secondsDuration.isZero() ||
    Call(
      ArrayPrototypeIncludes,
      ['second', 'millisecond', 'microsecond', 'nanosecond'],
      [DefaultTemporalLargestUnit(duration)]
    ) ||
    precision !== 'auto'
  ) {
    const secondsPart = formatAsDecimalNumber(MathAbs(secondsDuration.sec));
    const subSecondsPart = FormatFractionalSeconds(MathAbs(secondsDuration.subsec), precision);
    timePart += `${secondsPart}${subSecondsPart}S`;
  }
  let result = `${sign < 0 ? '-' : ''}P${datePart}`;
  if (timePart) result = `${result}T${timePart}`;
  return result;
}

function ISODateToString({ year, month, day }) {
  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  return `${yearString}-${monthString}-${dayString}`;
}

export function TemporalDateToString(date, showCalendar = 'auto') {
  const dateString = ISODateToString(GetSlot(date, ISO_DATE));
  const calendar = FormatCalendarAnnotation(GetSlot(date, CALENDAR), showCalendar);
  return dateString + calendar;
}

export function TimeRecordToString({ hour, minute, second, millisecond, microsecond, nanosecond }, precision) {
  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  return FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
}

export function ISODateTimeToString(isoDateTime, calendar, precision, showCalendar = 'auto') {
  const {
    isoDate: { year, month, day },
    time: { hour, minute, second, millisecond, microsecond, nanosecond }
  } = isoDateTime;
  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  const subSecondNanoseconds = millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  const timeString = FormatTimeString(hour, minute, second, subSecondNanoseconds, precision);
  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
  return `${yearString}-${monthString}-${dayString}T${timeString}${calendarString}`;
}

export function TemporalMonthDayToString(monthDay, showCalendar = 'auto') {
  const { year, month, day } = GetSlot(monthDay, ISO_DATE);
  const monthString = ISODateTimePartString(month);
  const dayString = ISODateTimePartString(day);
  let resultString = `${monthString}-${dayString}`;
  const calendar = GetSlot(monthDay, CALENDAR);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
    const yearString = ISOYearString(year);
    resultString = `${yearString}-${resultString}`;
  }
  const calendarString = FormatCalendarAnnotation(calendar, showCalendar);
  if (calendarString) resultString += calendarString;
  return resultString;
}

export function TemporalYearMonthToString(yearMonth, showCalendar = 'auto') {
  const { year, month, day } = GetSlot(yearMonth, ISO_DATE);
  const yearString = ISOYearString(year);
  const monthString = ISODateTimePartString(month);
  let resultString = `${yearString}-${monthString}`;
  const calendar = GetSlot(yearMonth, CALENDAR);
  if (showCalendar === 'always' || showCalendar === 'critical' || calendar !== 'iso8601') {
    const dayString = ISODateTimePartString(day);
    resultString += `-${dayString}`;
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
  let dateTimeString = ISODateTimeToString(iso, 'iso8601', precision, 'never');
  if (showOffset !== 'never') {
    dateTimeString += FormatDateTimeUTCOffsetRounded(offsetNs);
  }
  if (showTimeZone !== 'never') {
    const flag = showTimeZone === 'critical' ? '!' : '';
    dateTimeString += `[${flag}${tz}]`;
  }
  dateTimeString += FormatCalendarAnnotation(GetSlot(zdt, CALENDAR), showCalendar);
  return dateTimeString;
}

export function IsOffsetTimeZoneIdentifier(string) {
  return Call(RegExpPrototypeTest, OFFSET_IDENTIFIER, [string]);
}

export function ParseDateTimeUTCOffset(string) {
  const match = Call(RegExpPrototypeExec, OFFSET_WITH_PARTS, [string]);
  if (!match) {
    throw new RangeErrorCtor(`invalid time zone offset: ${string}; must match ±HH:MM[:SS.SSSSSSSSS]`);
  }
  const sign = match.groups.offsetSign === '-' ? -1 : +1;
  const hours = +match.groups.offsetHour;
  const minutes = +(match.groups.offsetMinute || 0);
  const seconds = +(match.groups.offsetSecond || 0);
  const nanoseconds = +Call(StringPrototypeSlice, (match.groups.offsetSubseconds || 0) + '000000000', [0, 9]);
  const offsetNanoseconds = sign * (((hours * 60 + minutes) * 60 + seconds) * NANOSECONDS_PER_SECOND + nanoseconds);
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

  // Special case this legacy identifier that is listed both in `backzone` and
  // `backward` in the TZDB. Work around implementations that incorrectly use
  // the `backward` data.
  if (lower === 'antarctica/south_pole') primaryIdentifier = 'Antarctica/McMurdo';

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

function GetNamedTimeZoneOffsetNanosecondsImpl(id, epochMilliseconds) {
  const { year, month, day, hour, minute, second } = GetFormatterParts(id, epochMilliseconds);
  let millisecond = epochMilliseconds % 1000;
  if (millisecond < 0) millisecond += 1000;
  const utc = GetUTCEpochMilliseconds({ year, month, day }, { hour, minute, second, millisecond });
  return (utc - epochMilliseconds) * 1e6;
}

export function GetNamedTimeZoneOffsetNanoseconds(id, epochNanoseconds) {
  // Optimization: We get the offset nanoseconds only with millisecond
  // resolution, assuming that time zone offset changes don't happen in the
  // middle of a millisecond
  return GetNamedTimeZoneOffsetNanosecondsImpl(id, epochNsToMs(epochNanoseconds, 'floor'));
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
  offsetNanoseconds = RoundNumberToIncrement(offsetNanoseconds, NANOSECONDS_PER_MINUTE, 'halfExpand');
  return FormatOffsetTimeZoneIdentifier(offsetNanoseconds / NANOSECONDS_PER_MINUTE);
}

export function GetUTCEpochMilliseconds(isoDate, time) {
  const { year, month, day } = isoDate;
  const { hour, minute, second, millisecond /* ignored: microsecond, nanosecond */ } = time;

  const epochDays = ISODateToEpochDays(year, month, day);
  const millisecondOfDay = hour * 3600e3 + minute * 60e3 + second * 1e3 + millisecond;
  return epochDays * MILLISECONDS_PER_DAY + millisecondOfDay;
}

export function GetUTCEpochNanoseconds(isoDateTime) {
  const {
    isoDate: { year, month, day },
    time: { hour, minute, second, millisecond, microsecond, nanosecond }
  } = isoDateTime;
  const epochDays = ISODateToEpochDays(year, month, day);
  const nanosecondOfDay =
    hour * 3600e9 + minute * 60e9 + second * 1e9 + millisecond * 1e6 + microsecond * 1e3 + nanosecond;
  return bigInt(epochDays).multiply(NANOSECONDS_PER_DAY).plus(nanosecondOfDay);
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

  return {
    epochMilliseconds,
    isoDate: { year, month, day },
    time: { hour, minute, second, millisecond, microsecond, nanosecond }
  };
}

export function GetNamedTimeZoneDateTimeParts(id, epochNanoseconds) {
  const {
    epochMilliseconds,
    time: { millisecond, microsecond, nanosecond }
  } = GetISOPartsFromEpoch(epochNanoseconds);
  const { year, month, day, hour, minute, second } = GetFormatterParts(id, epochMilliseconds);
  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
}

// Most time zones never transition twice within a short span of days. We still
// accommodate twitchy zones, albeit at a performance penalty. 19 days is the
// default window, past which we'd need to start adding many more special cases.
function searchWindowForTransitions(id) {
  if (id === 'Africa/El_Aaiun') return MILLISECONDS_PER_DAY * 17;
  if (id === 'America/Argentina/Tucuman') return MILLISECONDS_PER_DAY * 12;
  if (id === 'Europe/Tirane') return MILLISECONDS_PER_DAY * 11;
  if (id === 'Europe/Riga') return MILLISECONDS_PER_DAY * 10;
  if (id === 'Europe/Simferopol' || id === 'Europe/Vienna') return MILLISECONDS_PER_DAY * 9;
  if (id === 'Africa/Tunis') return MILLISECONDS_PER_DAY * 8;
  if (
    id === 'America/Boa_Vista' ||
    id === 'America/Fortaleza' ||
    id === 'America/Maceio' ||
    id === 'America/Noronha' ||
    id === 'America/Recife' ||
    id === 'Asia/Gaza' || // dubious, only in future calculations
    id === 'Asia/Hebron' || // ditto
    id === 'Brazil/DeNoronha'
  ) {
    return MILLISECONDS_PER_DAY * 6;
  }
  return MILLISECONDS_PER_DAY * 19;
}

export function GetNamedTimeZoneNextTransition(id, epochNanoseconds) {
  if (id === 'UTC') return null; // UTC fast path

  // Optimization: we floor the instant to the previous millisecond boundary
  // so that we can do Number math instead of BigInt math. This assumes that
  // time zone transitions don't happen in the middle of a millisecond.
  const epochMilliseconds = epochNsToMs(epochNanoseconds, 'floor');
  if (epochMilliseconds < BEFORE_FIRST_DST) {
    return GetNamedTimeZoneNextTransition(id, bigInt(BEFORE_FIRST_DST).multiply(1e6));
  }

  // Optimization: the farthest that we'll look for a next transition is 3 years
  // after the later of epochNanoseconds or the current time. If there are no
  // transitions found before then, we'll assume that there will not be any more
  // transitions after that.
  const now = DateNow();
  const base = MathMax(epochMilliseconds, now);
  const uppercap = base + MILLISECONDS_PER_DAY * 366 * 3;
  let leftMs = epochMilliseconds;
  let leftOffsetNs = GetNamedTimeZoneOffsetNanosecondsImpl(id, leftMs);
  let rightMs = leftMs;
  let rightOffsetNs = leftOffsetNs;
  const searchWindow = searchWindowForTransitions(id);
  while (leftOffsetNs === rightOffsetNs && leftMs < uppercap) {
    rightMs = leftMs + searchWindow;
    if (rightMs > MS_MAX) return null;
    rightOffsetNs = GetNamedTimeZoneOffsetNanosecondsImpl(id, rightMs);
    if (leftOffsetNs === rightOffsetNs) {
      leftMs = rightMs;
    }
  }
  if (leftOffsetNs === rightOffsetNs) return null;
  const result = bisect(
    (epochMs) => GetNamedTimeZoneOffsetNanosecondsImpl(id, epochMs),
    leftMs,
    rightMs,
    leftOffsetNs,
    rightOffsetNs
  );
  return bigInt(result).multiply(1e6);
}

export function GetNamedTimeZonePreviousTransition(id, epochNanoseconds) {
  if (id === 'UTC') return null; // UTC fast path

  // Optimization: we raise the instant to the next millisecond boundary so
  // that we can do Number math instead of BigInt math. This assumes that time
  // zone transitions don't happen in the middle of a millisecond.
  const epochMilliseconds = epochNsToMs(epochNanoseconds, 'ceil');

  // Optimization: if the instant is more than 3 years in the future and there
  // are no transitions between the present day and 3 years from now, assume
  // there are none after.
  const now = DateNow();
  const lookahead = now + MILLISECONDS_PER_DAY * 366 * 3;
  if (epochMilliseconds > lookahead) {
    const prevBeforeLookahead = GetNamedTimeZonePreviousTransition(id, bigInt(lookahead).multiply(1e6));
    if (prevBeforeLookahead === null || prevBeforeLookahead.lt(bigInt(now).multiply(1e6))) {
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
    const lastPrecomputed = ISODateToEpochDays(2088, 1, 1) * MILLISECONDS_PER_DAY; // 2088-01-01T00Z
    if (lastPrecomputed < epochMilliseconds) {
      return GetNamedTimeZonePreviousTransition(id, bigInt(lastPrecomputed).multiply(1e6));
    }
  }

  let rightMs = epochMilliseconds - 1;
  if (rightMs < BEFORE_FIRST_DST) return null;
  let rightOffsetNs = GetNamedTimeZoneOffsetNanosecondsImpl(id, rightMs);
  let leftMs = rightMs;
  let leftOffsetNs = rightOffsetNs;
  const searchWindow = searchWindowForTransitions(id);
  while (rightOffsetNs === leftOffsetNs && rightMs > BEFORE_FIRST_DST) {
    leftMs = rightMs - searchWindow;
    if (leftMs < BEFORE_FIRST_DST) return null;
    leftOffsetNs = GetNamedTimeZoneOffsetNanosecondsImpl(id, leftMs);
    if (rightOffsetNs === leftOffsetNs) {
      rightMs = leftMs;
    }
  }
  if (rightOffsetNs === leftOffsetNs) return null;
  const result = bisect(
    (epochMs) => GetNamedTimeZoneOffsetNanosecondsImpl(id, epochMs),
    leftMs,
    rightMs,
    leftOffsetNs,
    rightOffsetNs
  );
  return bigInt(result).multiply(1e6);
}

export function GetFormatterParts(timeZone, epochMilliseconds) {
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(timeZone);
  // Using `format` instead of `formatToParts` for compatibility with older
  // clients and because it is twice as fast
  const boundFormat = Call(IntlDateTimeFormatPrototypeGetFormat, formatter, []);
  const datetime = Call(boundFormat, formatter, [epochMilliseconds]);
  const splits = Call(StringPrototypeSplit, datetime, [/[^\w]+/]);
  const month = splits[0];
  const day = splits[1];
  const year = splits[2];
  const era = splits[3];
  const hour = splits[4];
  const minute = splits[5];
  const second = splits[6];
  return {
    year: era[0] === 'b' || era[0] === 'B' ? -year + 1 : +year,
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
function GetNamedTimeZoneEpochNanoseconds(id, isoDateTime) {
  // Get the offset of one day before and after the requested calendar date and
  // clock time, avoiding overflows if near the edge of the Instant range.
  let ns = GetUTCEpochNanoseconds(isoDateTime);
  // Note, ns may be up to DAY_NANOS outside the NS_MIN...NS_MAX range here,
  // even if isoDateTime represents a valid wall time in a non-UTC time zone.
  // The TZDB does not describe any transitions that would occur in that extra
  // day, so we just clip in order not to throw in GetFormatterParts.
  let nsEarlier = ns.minus(NANOSECONDS_PER_DAY);
  if (nsEarlier.lesser(NS_MIN)) nsEarlier = NS_MIN;
  let nsLater = ns.plus(NANOSECONDS_PER_DAY);
  if (nsLater.greater(NS_MAX)) nsLater = NS_MAX;
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
      if (CompareISODateTime(isoDateTime, parts) !== 0) return undefined;
      ValidateEpochNanoseconds(epochNanoseconds);
      return epochNanoseconds;
    }
  ]);
  return Call(ArrayPrototypeFilter, candidates, [(x) => x !== undefined]);
}

export function LeapYear(year) {
  assert(year !== undefined, 'undefined year in LeapYear');
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
  if (dateDuration.years < 0) return -1;
  if (dateDuration.years > 0) return 1;
  if (dateDuration.months < 0) return -1;
  if (dateDuration.months > 0) return 1;
  if (dateDuration.weeks < 0) return -1;
  if (dateDuration.weeks > 0) return 1;
  if (dateDuration.days < 0) return -1;
  if (dateDuration.days > 0) return 1;
  return 0;
}

function InternalDurationSign(duration) {
  const dateSign = DateDurationSign(duration.date);
  if (dateSign !== 0) return dateSign;
  return duration.time.sign();
}

export function BalanceISOYearMonth(year, month) {
  assert(NumberIsFinite(year) && NumberIsFinite(month), 'BalanceISOYearMonth: infinity is out of range');
  month -= 1;
  year += MathFloor(month / 12);
  month %= 12;
  if (month < 0) month += 12;
  month += 1;
  return { year, month };
}

export function AddDaysToISODate(isoDate, days) {
  let day = isoDate.day + days;
  let { year, month } = BalanceISOYearMonth(isoDate.year, isoDate.month);

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

  return CreateISODateRecordInfallible(year, month, day);
}

export function BalanceISODateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) {
  const time = BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond);
  const isoDate = AddDaysToISODate({ year, month, day }, time.deltaDays);
  return { isoDate, time };
}

export function BalanceTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  let div;

  ({ div, mod: nanosecond } = TruncatingDivModByPowerOf10(nanosecond, 3));
  microsecond += div;
  if (nanosecond < 0) {
    microsecond -= 1;
    nanosecond += 1000;
  }

  ({ div, mod: microsecond } = TruncatingDivModByPowerOf10(microsecond, 3));
  millisecond += div;
  if (microsecond < 0) {
    millisecond -= 1;
    microsecond += 1000;
  }

  second += MathTrunc(millisecond / 1000);
  millisecond %= 1000;
  if (millisecond < 0) {
    second -= 1;
    millisecond += 1000;
  }

  minute += MathTrunc(second / 60);
  second %= 60;
  if (second < 0) {
    minute -= 1;
    second += 60;
  }

  hour += MathTrunc(minute / 60);
  minute %= 60;
  if (minute < 0) {
    hour -= 1;
    minute += 60;
  }

  let deltaDays = MathTrunc(hour / 24);
  hour %= 24;
  if (hour < 0) {
    deltaDays -= 1;
    hour += 24;
  }

  // Results are possibly -0 at this point, but these are mathematical values in
  // the spec. Force -0 to +0.
  deltaDays += 0;
  hour += 0;
  minute += 0;
  second += 0;
  millisecond += 0;
  microsecond += 0;
  nanosecond += 0;

  return CreateTimeRecordInfallible(hour, minute, second, millisecond, microsecond, nanosecond, deltaDays);
}

export function DateDurationDays(dateDuration, plainRelativeTo) {
  const yearsMonthsWeeksDuration = AdjustDateDurationRecord(dateDuration, 0);
  if (DateDurationSign(yearsMonthsWeeksDuration) === 0) return dateDuration.days;

  // balance years, months, and weeks down to days
  const isoDate = GetSlot(plainRelativeTo, ISO_DATE);
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

export function RejectToRange(value, min, max) {
  if (value < min || value > max) throw new RangeErrorCtor(`value out of range: ${min} <= ${value} <= ${max}`);
}

function IsValidISODate(year, month, day) {
  if (month < 1 || month > 12) return false;
  const daysInMonth = ISODaysInMonth(year, month);
  return day >= 1 && day <= daysInMonth;
}

export function CreateISODateRecord(year, month, day) {
  if (!IsValidISODate(year, month, day)) throw new RangeErrorCtor(`${year}-${month}-${day} is not a valid ISO date`);
  return { year, month, day };
}

// Separate function to validate spec's "! CreateISODateRecord(_year_, ...)"
export function CreateISODateRecordInfallible(year, month, day) {
  assert(IsValidISODate(year, month, day), `${year}-${month}-${day} must be a valid ISO date`);
  return { year, month, day };
}

function IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond) {
  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;
  if (second < 0 || second > 59) return false;
  if (millisecond < 0 || millisecond > 999) return false;
  if (microsecond < 0 || microsecond > 999) return false;
  return nanosecond >= 0 && nanosecond <= 999;
}

export function CreateTimeRecord(hour, minute, second, millisecond, microsecond, nanosecond, deltaDays = 0) {
  if (!IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond)) {
    throw new RangeErrorCtor(
      `${hour}, ${minute}, ${second}, ${millisecond}, ${microsecond}, ${nanosecond} is not a valid time`
    );
  }
  return { hour, minute, second, millisecond, microsecond, nanosecond, deltaDays };
}

function CreateTimeRecordInfallible(hour, minute, second, millisecond, microsecond, nanosecond, deltaDays = 0) {
  assert(
    IsValidTime(hour, minute, second, millisecond, microsecond, nanosecond),
    `${hour}, ${minute}, ${second}, ${millisecond}, ${microsecond}, ${nanosecond} must be a valid time`
  );
  return { hour, minute, second, millisecond, microsecond, nanosecond, deltaDays };
}

function RejectDateRange(isoDate) {
  // Noon avoids trouble at edges of DateTime range (excludes midnight)
  const isoDateTime = { isoDate, time: NoonTimeRecord() };
  const ns = GetUTCEpochNanoseconds(isoDateTime);
  if (ns.lesser(DATETIME_NS_MIN) || ns.greater(DATETIME_NS_MAX)) {
    const dateString = ISODateToString(isoDateTime.isoDate);
    throw new RangeErrorCtor(`${dateString} is outside of supported range`);
  }
}

export function RejectDateTimeRange(isoDateTime) {
  const ns = GetUTCEpochNanoseconds(isoDateTime);
  if (ns.lesser(DATETIME_NS_MIN) || ns.greater(DATETIME_NS_MAX)) {
    const dateTimeString = ISODateTimeToString(isoDateTime, 'iso8601', 'auto', 'never');
    throw new RangeErrorCtor(`${dateTimeString} is outside of supported range`);
  }
}

// Same as above, but throws a different, non-user-facing error
function AssertISODateTimeWithinLimits(isoDateTime) {
  const ns = GetUTCEpochNanoseconds(isoDateTime);
  assert(
    ns.geq(DATETIME_NS_MIN) && ns.leq(DATETIME_NS_MAX),
    `${ISODateTimeToString(isoDateTime, 'iso8601', 'auto', 'never')} is outside the representable range`
  );
}

// In the spec, IsWithinEpochNanosecondsInterval returns a boolean and call
// sites are responsible for throwing. In the polyfill, ValidateEpochNanoseconds
// takes its place so that we can DRY the throwing code.
export function ValidateEpochNanoseconds(epochNanoseconds) {
  if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
    throw new RangeErrorCtor('date/time value is outside of supported range');
  }
}

function RejectYearMonthRange({ year, month }) {
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
    assert(NumberIsFinite(prop), 'infinite values not allowed as duration fields');
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

export function ToInternalDurationRecord(duration) {
  const date = {
    years: GetSlot(duration, YEARS),
    months: GetSlot(duration, MONTHS),
    weeks: GetSlot(duration, WEEKS),
    days: GetSlot(duration, DAYS)
  };
  const time = TimeDuration.fromComponents(
    GetSlot(duration, HOURS),
    GetSlot(duration, MINUTES),
    GetSlot(duration, SECONDS),
    GetSlot(duration, MILLISECONDS),
    GetSlot(duration, MICROSECONDS),
    GetSlot(duration, NANOSECONDS)
  );
  return { date, time };
}

export function ToInternalDurationRecordWith24HourDays(duration) {
  const time = TimeDuration.fromComponents(
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
  return { date, time };
}

function ToDateDurationRecordWithoutTime(duration) {
  const internalDuration = ToInternalDurationRecordWith24HourDays(duration);
  const days = MathTrunc(internalDuration.time.sec / 86400);
  RejectDuration(
    internalDuration.date.years,
    internalDuration.date.months,
    internalDuration.date.weeks,
    days,
    0,
    0,
    0,
    0,
    0,
    0
  );
  return { ...internalDuration.date, days };
}

export function TemporalDurationFromInternal(internalDuration, largestUnit) {
  const sign = internalDuration.time.sign();
  let nanoseconds = internalDuration.time.abs().subsec;
  let microseconds = 0;
  let milliseconds = 0;
  let seconds = internalDuration.time.abs().sec;
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
      /* c8 ignore next */ assertNotReached();
  }

  const TemporalDuration = GetIntrinsic('%Temporal.Duration%');
  return new TemporalDuration(
    internalDuration.date.years,
    internalDuration.date.months,
    internalDuration.date.weeks,
    internalDuration.date.days + sign * days,
    sign * hours,
    sign * minutes,
    sign * seconds,
    sign * milliseconds,
    sign * microseconds,
    sign * nanoseconds
  );
}

export function CombineDateAndTimeDuration(dateDuration, timeDuration) {
  const dateSign = DateDurationSign(dateDuration);
  const timeSign = timeDuration.sign();
  assert(
    dateSign === 0 || timeSign === 0 || dateSign === timeSign,
    'should not be able to create mixed sign duration fields here'
  );
  return { date: dateDuration, time: timeDuration };
}

export function ISODateToEpochDays(year, month, day) {
  const resolvedYear = year + MathFloor((month - 1) / 12);
  const resolvedMonth = modulo(month - 1, 12) + 1;
  let shiftedYear = resolvedYear;
  let shiftedMonth = resolvedMonth - 3;
  const dayIsInRange = day >= 1 && day <= ISODaysInMonth(resolvedYear, resolvedMonth);
  if (shiftedMonth < 0) {
    shiftedYear--;
    shiftedMonth += 12;
  }
  assert(shiftedMonth >= 0 && shiftedMonth <= 11, 'shiftedMonth in range 0..11');
  const cycle = MathFloor(shiftedYear / 400);
  const yearOfCycle = modulo(shiftedYear, 400);
  assert(yearOfCycle >= 0 && yearOfCycle <= 399, 'yearOfCycle in range 0..399');
  const dayOfYear = MathTrunc((153 * shiftedMonth + 2) / 5) + day - 1;
  assert(dayOfYear >= 0, 'dayOfYear positive');
  if (dayIsInRange) assert(dayOfYear <= 365, 'dayOfYear in range 0..365');
  const dayOfCycle = yearOfCycle * 365 + MathTrunc(yearOfCycle / 4) - MathTrunc(yearOfCycle / 100) + dayOfYear;
  assert(dayOfCycle >= 0, 'dayOfCycle positive');
  if (dayIsInRange) assert(dayOfCycle <= 146096, 'dayOfCycle in range 0..146096');
  return cycle * 146097 + dayOfCycle - 719468;
}

// This is needed before calling GetUTCEpochNanoseconds, because it uses MakeDay
// which is ill-defined in how it handles large year numbers. If the issue
// https://github.com/tc39/ecma262/issues/1087 is fixed, this can be removed
// with no observable changes.
function ValidateISODaysRange({ year, month, day }) {
  if (MathAbs(ISODateToEpochDays(year, month, day)) > 1e8) {
    throw new RangeErrorCtor(`date/time value ${year}-${month}-${day} is outside the supported range`);
  }
}

function DifferenceTime(time1, time2) {
  const hours = time2.hour - time1.hour;
  const minutes = time2.minute - time1.minute;
  const seconds = time2.second - time1.second;
  const milliseconds = time2.millisecond - time1.millisecond;
  const microseconds = time2.microsecond - time1.microsecond;
  const nanoseconds = time2.nanosecond - time1.nanosecond;
  const timeDuration = TimeDuration.fromComponents(hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
  assert(timeDuration.abs().sec < 86400, '_bt_.[[Days]] should be 0');
  return timeDuration;
}

function DifferenceEpochNanoseconds(epochNanosecondsFrom, epochNanosecondsTo, increment, smallestUnit, roundingMode) {
  let timeDuration = TimeDuration.fromEpochNsDiff(epochNanosecondsFrom, epochNanosecondsTo);
  timeDuration = RoundTimeDuration(timeDuration, increment, smallestUnit, roundingMode);
  return CombineDateAndTimeDuration(ZeroDateDuration(), timeDuration);
}

function DifferenceISODateTime(isoDateTime1, isoDateTime2, calendar, largestUnit) {
  AssertISODateTimeWithinLimits(isoDateTime1);
  AssertISODateTimeWithinLimits(isoDateTime2);
  let timeDuration = DifferenceTime(isoDateTime1.time, isoDateTime2.time);

  const timeSign = timeDuration.sign();
  const dateSign = CompareISODate(isoDateTime1.isoDate, isoDateTime2.isoDate);

  // back-off a day from date2 so that the signs of the date and time diff match
  let adjustedDate = isoDateTime2.isoDate;
  if (dateSign === timeSign) {
    adjustedDate = AddDaysToISODate(adjustedDate, timeSign);
    timeDuration = timeDuration.add24HourDays(-timeSign);
  }

  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const dateDifference = CalendarDateUntil(calendar, isoDateTime1.isoDate, adjustedDate, dateLargestUnit);
  if (largestUnit !== dateLargestUnit) {
    // largestUnit < days, so add the days in to the internal duration
    timeDuration = timeDuration.add24HourDays(dateDifference.days);
    dateDifference.days = 0;
  }
  return CombineDateAndTimeDuration(dateDifference, timeDuration);
}

export function DifferenceZonedDateTime(epochNanosecondsFrom, epochNanosecondsTo, timeZone, calendar, largestUnit) {
  const nsDiff = epochNanosecondsTo.subtract(epochNanosecondsFrom);
  if (nsDiff.isZero()) return { date: ZeroDateDuration(), time: TimeDuration.ZERO };
  const sign = nsDiff.lt(0) ? 1 : -1;

  // Convert start/end instants to datetimes
  const isoDtStart = GetISODateTimeFor(timeZone, epochNanosecondsFrom);
  const isoDtEnd = GetISODateTimeFor(timeZone, epochNanosecondsTo);

  // If year-month-day values are same-day,
  // there's no point involving the calendar/timezone for zdt->pdt conversions.
  // It also avoids a situation where dayCorrection backs up too far on same-day diffs
  // with reverse-direction wallclock delta due to DST:
  // https://github.com/tc39/proposal-temporal/issues/3141
  if (
    isoDtStart.isoDate.year === isoDtEnd.isoDate.year &&
    isoDtStart.isoDate.month === isoDtEnd.isoDate.month &&
    isoDtStart.isoDate.day === isoDtEnd.isoDate.day
  ) {
    const timeDuration = new TimeDuration(nsDiff);
    return { date: ZeroDateDuration(), time: timeDuration };
  }

  // Simulate moving epochNanosecondsFrom as many years/months/weeks/days as
  // possible without surpassing epochNanosecondsTo. This value is stored in
  // intermediateDateTime/intermediateInstant/intermediateNs. We do not
  // literally move years/months/weeks/days with calendar arithmetic, but rather
  // assume intermediateDateTime will have the same time-parts as dtStart and
  // the date-parts from dtEnd, and move backward from there. The number of days
  // we move backward is stored in dayCorrection. Credit to Adam Shaw for
  // devising this algorithm.
  let dayCorrection = 0;
  let intermediateDateTime;

  // The max number of allowed day corrections depends on the direction of travel.
  // Both directions allow for 1 day correction due to an ISO wall-clock overshoot (see below).
  // Only the forward direction allows for an additional 1 day correction caused by a push-forward
  // 'compatible' DST transition causing the wall-clock to overshoot again.
  // This max value is inclusive.
  let maxDayCorrection = sign === -1 ? 2 : 1;

  // Detect ISO wall-clock overshoot.
  // If the diff of the ISO wall-clock times is opposite to the overall diff's sign,
  // we are guaranteed to need at least one day correction.
  let timeDuration = DifferenceTime(isoDtStart.time, isoDtEnd.time);
  if (timeDuration.sign() === sign) {
    dayCorrection++;
  }

  for (; dayCorrection <= maxDayCorrection; dayCorrection++) {
    const intermediateDate = AddDaysToISODate(isoDtEnd.isoDate, dayCorrection * sign);

    // Incorporate time parts from dtStart
    intermediateDateTime = { isoDate: intermediateDate, time: isoDtStart.time };

    // Convert intermediate datetime to epoch-nanoseconds (may disambiguate)
    const intermediateNs = GetEpochNanosecondsFor(timeZone, intermediateDateTime, 'compatible');

    // Compute the nanosecond diff between the intermediate instant and the final destination
    timeDuration = TimeDuration.fromEpochNsDiff(intermediateNs, epochNanosecondsTo);

    // Did intermediateNs NOT surpass epochNanosecondsTo?
    // If so, exit the loop with success (without incrementing dayCorrection past maxDayCorrection)
    if (timeDuration.sign() !== sign) {
      break;
    }
  }

  assert(dayCorrection <= maxDayCorrection, `more than ${maxDayCorrection} day correction needed`);

  // Similar to what happens in DifferenceISODateTime with date parts only:
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit);
  const dateDifference = CalendarDateUntil(calendar, isoDtStart.isoDate, intermediateDateTime.isoDate, dateLargestUnit);
  return CombineDateAndTimeDuration(dateDifference, timeDuration);
}

// Returns: { r1, r2, startEpochNs, endEpochNs, startDuration, endDuration }
function ComputeNudgeWindow(
  sign,
  duration,
  originEpochNs,
  isoDateTime,
  timeZone,
  calendar,
  increment,
  unit,
  additionalShift
) {
  // Create a duration with smallestUnit trunc'd towards zero
  // Create a separate duration that incorporates roundingIncrement
  let r1, r2, startDuration, endDuration;
  switch (unit) {
    case 'year': {
      const years = RoundNumberToIncrement(duration.date.years, increment, 'trunc');
      r1 = !additionalShift ? years : years + increment * sign;
      r2 = r1 + increment * sign;
      startDuration = { years: r1, months: 0, weeks: 0, days: 0 };
      endDuration = { ...startDuration, years: r2 };
      break;
    }
    case 'month': {
      const months = RoundNumberToIncrement(duration.date.months, increment, 'trunc');
      r1 = !additionalShift ? months : months + increment * sign;
      r2 = r1 + increment * sign;
      startDuration = AdjustDateDurationRecord(duration.date, 0, 0, r1);
      endDuration = AdjustDateDurationRecord(duration.date, 0, 0, r2);
      break;
    }
    case 'week': {
      const yearsMonths = AdjustDateDurationRecord(duration.date, 0, 0);
      const weeksStart = CalendarDateAdd(calendar, isoDateTime.isoDate, yearsMonths, 'constrain');
      const weeksEnd = AddDaysToISODate(weeksStart, duration.date.days);
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
      /* c8 ignore next */ assertNotReached();
  }

  if (sign === 1) assert(r1 >= 0 && r1 < r2, `positive ordering of r1, r2: 0 ≤ ${r1} < ${r2}`);
  if (sign === -1) assert(r1 <= 0 && r1 > r2, `negative ordering of r1, r2: 0 ≥ ${r1} > ${r2}`);

  // Convert to bound-START to epoch-nanoseconds
  let startEpochNs;
  if (DateDurationSign(startDuration) === 0) {
    // If the start of the bound is the same as the "origin" (aka relativeTo),
    // use the origin's epoch-nanoseconds as-is instead of relying on isoDateTime,
    // which then gets zoned and converted back to epoch-nanoseconds,
    // which loses precision and creates a distorted bounding window.
    startEpochNs = originEpochNs;
  } else {
    const start = CalendarDateAdd(calendar, isoDateTime.isoDate, startDuration, 'constrain');
    const startDateTime = { isoDate: start, time: isoDateTime.time };
    startEpochNs = timeZone
      ? GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible')
      : GetUTCEpochNanoseconds(startDateTime);
  }

  // Convert to bound-END to epoch-nanoseconds
  const end = CalendarDateAdd(calendar, isoDateTime.isoDate, endDuration, 'constrain');
  const endDateTime = { isoDate: end, time: isoDateTime.time };
  const endEpochNs = timeZone
    ? GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible')
    : GetUTCEpochNanoseconds(endDateTime);

  return { r1, r2, startEpochNs, endEpochNs, startDuration, endDuration };
}

// Epoch-nanosecond bounding technique where the start/end of the calendar-unit
// interval are converted to epoch-nanosecond times and destEpochNs is nudged to
// either one.
function NudgeToCalendarUnit(
  sign,
  duration,
  originEpochNs,
  destEpochNs,
  isoDateTime,
  timeZone,
  calendar,
  increment,
  unit,
  roundingMode
) {
  // unit must be day, week, month, or year
  // timeZone may be undefined

  var didExpandCalendarUnit = false;
  let nudgeWindow = ComputeNudgeWindow(
    sign,
    duration,
    originEpochNs,
    isoDateTime,
    timeZone,
    calendar,
    increment,
    unit,
    false
  );
  var { r1, r2, startEpochNs, endEpochNs, startDuration, endDuration } = nudgeWindow;

  // Round the smallestUnit within the epoch-nanosecond span
  if (sign === 1) {
    if (!(nudgeWindow.startEpochNs.leq(destEpochNs) && destEpochNs.leq(nudgeWindow.endEpochNs))) {
      // Retry nudge window if it's out of bounds
      nudgeWindow = ComputeNudgeWindow(
        sign,
        duration,
        originEpochNs,
        isoDateTime,
        timeZone,
        calendar,
        increment,
        unit,
        true
      );
      assert(
        nudgeWindow.startEpochNs.leq(destEpochNs) && destEpochNs.leq(nudgeWindow.endEpochNs),
        `${unit} was 0 days long`
      );
      didExpandCalendarUnit = true;
    }
  } else if (sign == -1) {
    if (!(nudgeWindow.endEpochNs.leq(destEpochNs) && destEpochNs.leq(nudgeWindow.startEpochNs))) {
      // Retry nudge window if it's out of bounds
      nudgeWindow = ComputeNudgeWindow(
        sign,
        duration,
        originEpochNs,
        isoDateTime,
        timeZone,
        calendar,
        increment,
        unit,
        true
      );
      assert(
        nudgeWindow.endEpochNs.leq(destEpochNs) && destEpochNs.leq(nudgeWindow.startEpochNs),
        `${unit} was 0 days long`
      );
      didExpandCalendarUnit = true;
    }
  }
  ({ r1, r2, startEpochNs, endEpochNs, startDuration, endDuration } = nudgeWindow);

  assert(!endEpochNs.equals(startEpochNs), 'startEpochNs must ≠ endEpochNs');
  const numerator = TimeDuration.fromEpochNsDiff(startEpochNs, destEpochNs);
  const denominator = TimeDuration.fromEpochNsDiff(startEpochNs, endEpochNs);
  const unsignedRoundingMode = GetUnsignedRoundingMode(roundingMode, sign < 0 ? 'negative' : 'positive');
  const cmp = numerator.add(numerator).abs().subtract(denominator.abs()).sign();
  const even = (MathAbs(r1) / increment) % 2 === 0;
  const roundedUnit = numerator.isZero()
    ? MathAbs(r1)
    : !numerator.cmp(denominator) // equal?
      ? MathAbs(r2)
      : ApplyUnsignedRoundingMode(MathAbs(r1), MathAbs(r2), cmp, even, unsignedRoundingMode);

  let total = null;
  if (increment === 1) {
    // Calculate total with a trick to minimize rounding error, due to the lack
    // of fma() in JS. total is only used when calling from total(), which is
    // definitely not the case when increment ≠ 1
    const fakeNumerator = new TimeDuration(denominator.totalNs.times(r1).add(numerator.totalNs.times(sign)));
    total = fakeNumerator.fdiv(denominator.totalNs);
    assert(MathAbs(r1) <= MathAbs(total) && MathAbs(total) <= MathAbs(r2), 'r1 ≤ total ≤ r2');
  }

  // Determine whether expanded or contracted
  didExpandCalendarUnit ||= roundedUnit === MathAbs(r2);
  duration = { date: roundedUnit == MathAbs(r2) ? endDuration : startDuration, time: TimeDuration.ZERO };

  const nudgeResult = {
    duration,
    nudgedEpochNs: didExpandCalendarUnit ? endEpochNs : startEpochNs,
    didExpandCalendarUnit
  };
  return { nudgeResult, total };
}

// Attempts rounding of time units within a time zone's day, but if the rounding
// causes time to exceed the total time within the day, rerun rounding in next
// day.
function NudgeToZonedTime(sign, duration, isoDateTime, timeZone, calendar, increment, unit, roundingMode) {
  // unit must be hour or smaller

  // Apply to origin, output start/end of the day as PlainDateTimes
  const start = CalendarDateAdd(calendar, isoDateTime.isoDate, duration.date, 'constrain');
  const startDateTime = { isoDate: start, time: isoDateTime.time };
  const endDate = AddDaysToISODate(start, sign);
  const endDateTime = { isoDate: endDate, time: isoDateTime.time };

  // Compute the epoch-nanosecond start/end of the final whole-day interval
  // If duration has negative sign, startEpochNs will be after endEpochNs
  const startEpochNs = GetEpochNanosecondsFor(timeZone, startDateTime, 'compatible');
  const endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');

  // The signed amount of time from the start of the whole-day interval to the end
  const daySpan = TimeDuration.fromEpochNsDiff(startEpochNs, endEpochNs);
  if (daySpan.sign() !== sign) throw new RangeErrorCtor('time zone returned inconsistent Instants');

  // Compute time parts of the duration to nanoseconds and round
  // Result could be negative
  const unitIncrement = TemporalUnitLength(unit) * increment;
  let roundedTimeDuration = duration.time.round(unitIncrement, roundingMode);

  // Does the rounded time exceed the time-in-day?
  const beyondDaySpan = roundedTimeDuration.subtract(daySpan);
  const didRoundBeyondDay = beyondDaySpan.sign() !== -sign;

  let dayDelta, nudgedEpochNs;
  if (didRoundBeyondDay) {
    // If rounded into next day, use the day-end as the local origin and rerun
    // the rounding
    dayDelta = sign;
    roundedTimeDuration = beyondDaySpan.round(unitIncrement, roundingMode);
    nudgedEpochNs = roundedTimeDuration.addToEpochNs(endEpochNs);
  } else {
    // Otherwise, if time not rounded beyond day, use the day-start as the local
    // origin
    dayDelta = 0;
    nudgedEpochNs = roundedTimeDuration.addToEpochNs(startEpochNs);
  }

  const dateDuration = AdjustDateDurationRecord(duration.date, duration.date.days + dayDelta);
  const resultDuration = CombineDateAndTimeDuration(dateDuration, roundedTimeDuration);
  return {
    duration: resultDuration,
    nudgedEpochNs,
    didExpandCalendarUnit: didRoundBeyondDay
  };
}

// Converts all fields to nanoseconds and does integer rounding.
function NudgeToDayOrTime(duration, destEpochNs, largestUnit, increment, smallestUnit, roundingMode) {
  // unit must be day or smaller

  const timeDuration = duration.time.add24HourDays(duration.date.days);
  // Convert to nanoseconds and round
  const unitLength = TemporalUnitLength(smallestUnit);
  const roundedTime = timeDuration.round(bigInt(increment).multiply(unitLength), roundingMode);
  const diffTime = roundedTime.subtract(timeDuration);

  // Determine if whole days expanded
  const { quotient: wholeDays } = timeDuration.divmod(NANOSECONDS_PER_DAY);
  const { quotient: roundedWholeDays } = roundedTime.divmod(NANOSECONDS_PER_DAY);
  const didExpandDays = MathSign(roundedWholeDays - wholeDays) === timeDuration.sign();

  const nudgedEpochNs = diffTime.addToEpochNs(destEpochNs);

  let days = 0;
  let remainder = roundedTime;
  if (IsDateUnit(largestUnit)) {
    days = roundedWholeDays;
    remainder = roundedTime.add(TimeDuration.fromComponents(-roundedWholeDays * 24, 0, 0, 0, 0, 0));
  }

  const dateDuration = AdjustDateDurationRecord(duration.date, days);
  return {
    duration: { date: dateDuration, time: remainder },
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
  isoDateTime,
  timeZone,
  calendar,
  largestUnit,
  startUnit
) {
  // startUnit is month or day
  if (LargerOfTwoTemporalUnits(startUnit, largestUnit) === startUnit) return duration;

  // Check to see if nudgedEpochNs has hit the boundary of any units higher than
  // smallestUnit, in which case increment the higher unit and clear smaller
  // units.
  const bubbleUnits = [];
  if (largestUnit === 'year') Call(ArrayPrototypeUnshift, bubbleUnits, ['year']);
  if (startUnit === 'day') {
    if (largestUnit === 'month' || largestUnit === 'year') Call(ArrayPrototypeUnshift, bubbleUnits, ['month']);
    // The only situation where days and smaller bubble-up into weeks is when
    // largestUnit is 'week' (not to be confused with the situation where
    // smallestUnit is 'week', in which case days and smaller are ROUNDED-up
    // into weeks, but that has already happened by the time this function
    // executes)
    // So, if days and smaller are NOT bubbled-up into weeks, skip weeks.
    if (largestUnit === 'week') Call(ArrayPrototypeUnshift, bubbleUnits, ['week']);
  }

  for (let ix = 0; ix < bubbleUnits.length; ix++) {
    const unit = bubbleUnits[ix];

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
        /* c8 ignore next */ assertNotReached();
    }

    // Compute end-of-unit in epoch-nanoseconds
    const end = CalendarDateAdd(calendar, isoDateTime.isoDate, endDuration, 'constrain');
    const endDateTime = { isoDate: end, time: isoDateTime.time };
    let endEpochNs;
    if (timeZone) {
      endEpochNs = GetEpochNanosecondsFor(timeZone, endDateTime, 'compatible');
    } else {
      endEpochNs = GetUTCEpochNanoseconds(endDateTime);
    }

    const didExpandToEnd = nudgedEpochNs.compare(endEpochNs) !== -sign;

    // NOT at end-of-unit. Stop looking for bubbling
    if (!didExpandToEnd) return duration;
    // Is nudgedEpochNs at the end-of-unit? This means it should bubble-up to
    // the next highest unit (and possibly further...)
    duration = { date: endDuration, time: TimeDuration.ZERO };
  }

  return duration;
}

function RoundRelativeDuration(
  duration,
  originEpochNs,
  destEpochNs,
  isoDateTime,
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
  const sign = InternalDurationSign(duration) < 0 ? -1 : 1;

  let nudgeResult;
  if (irregularLengthUnit) {
    // Rounding an irregular-length unit? Use epoch-nanosecond-bounding technique
    ({ nudgeResult } = NudgeToCalendarUnit(
      sign,
      duration,
      originEpochNs,
      destEpochNs,
      isoDateTime,
      timeZone,
      calendar,
      increment,
      smallestUnit,
      roundingMode
    ));
  } else if (timeZone) {
    // Special-case for rounding time units within a zoned day
    nudgeResult = NudgeToZonedTime(
      sign,
      duration,
      isoDateTime,
      timeZone,
      calendar,
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
  if (nudgeResult.didExpandCalendarUnit && smallestUnit !== 'year' && smallestUnit !== 'week') {
    duration = BubbleRelativeDuration(
      sign,
      duration,
      nudgeResult.nudgedEpochNs, // The destEpochNs after expanding/contracting
      isoDateTime,
      timeZone,
      calendar,
      largestUnit, // where to STOP bubbling
      LargerOfTwoTemporalUnits(smallestUnit, 'day') // where to START bubbling-up from
    );
  }

  return duration;
}

function TotalRelativeDuration(duration, originEpochNs, destEpochNs, isoDateTime, timeZone, calendar, unit) {
  // The duration must already be balanced. This should be achieved by calling
  // one of the non-rounding since/until internal methods prior. It's okay to
  // have a bottom-heavy weeks because weeks don't bubble-up into months. It's
  // okay to have >24 hour day assuming the final day of relativeTo+duration has
  // >24 hours in its timezone. (should automatically end up like this if using
  // non-rounding since/until internal methods prior)
  if (IsCalendarUnit(unit) || (timeZone && unit === 'day')) {
    // Rounding an irregular-length unit? Use epoch-nanosecond-bounding technique
    const sign = InternalDurationSign(duration) < 0 ? -1 : 1;
    return NudgeToCalendarUnit(
      sign,
      duration,
      originEpochNs,
      destEpochNs,
      isoDateTime,
      timeZone,
      calendar,
      1,
      unit,
      'trunc'
    ).total;
  }
  // Rounding uniform-length days/hours/minutes/etc units. Simple nanosecond
  // math. years/months/weeks unchanged
  const timeDuration = duration.time.add24HourDays(duration.date.days);
  return TotalTimeDuration(timeDuration, unit);
}

export function DifferencePlainDateTimeWithRounding(
  isoDateTime1,
  isoDateTime2,
  calendar,
  largestUnit,
  roundingIncrement,
  smallestUnit,
  roundingMode
) {
  if (CompareISODateTime(isoDateTime1, isoDateTime2) == 0) {
    return { date: ZeroDateDuration(), time: TimeDuration.ZERO };
  }

  RejectDateTimeRange(isoDateTime1);
  RejectDateTimeRange(isoDateTime2);
  const duration = DifferenceISODateTime(isoDateTime1, isoDateTime2, calendar, largestUnit);

  if (smallestUnit === 'nanosecond' && roundingIncrement === 1) return duration;

  const originEpochNs = GetUTCEpochNanoseconds(isoDateTime1);
  const destEpochNs = GetUTCEpochNanoseconds(isoDateTime2);
  return RoundRelativeDuration(
    duration,
    originEpochNs,
    destEpochNs,
    isoDateTime1,
    null,
    calendar,
    largestUnit,
    roundingIncrement,
    smallestUnit,
    roundingMode
  );
}

export function DifferencePlainDateTimeWithTotal(isoDateTime1, isoDateTime2, calendar, unit) {
  if (CompareISODateTime(isoDateTime1, isoDateTime2) == 0) return 0;

  RejectDateTimeRange(isoDateTime1);
  RejectDateTimeRange(isoDateTime2);
  const duration = DifferenceISODateTime(isoDateTime1, isoDateTime2, calendar, unit);

  if (unit === 'nanosecond') return duration.time.totalNs.toJSNumber();

  const originEpochNs = GetUTCEpochNanoseconds(isoDateTime1);
  const destEpochNs = GetUTCEpochNanoseconds(isoDateTime2);
  return TotalRelativeDuration(duration, originEpochNs, destEpochNs, isoDateTime1, null, calendar, unit);
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
  if (IsTimeUnit(largestUnit)) {
    // The user is only asking for a time difference, so return difference of instants.
    return DifferenceEpochNanoseconds(ns1, ns2, roundingIncrement, smallestUnit, roundingMode);
  }

  const duration = DifferenceZonedDateTime(ns1, ns2, timeZone, calendar, largestUnit);

  if (smallestUnit === 'nanosecond' && roundingIncrement === 1) return duration;

  const dateTime = GetISODateTimeFor(timeZone, ns1);
  return RoundRelativeDuration(
    duration,
    ns1,
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

export function DifferenceZonedDateTimeWithTotal(epochNanosecondsFrom, epochNanosecondsTo, timeZone, calendar, unit) {
  if (IsTimeUnit(unit)) {
    // The user is only asking for a time difference, so return difference of instants.
    return TotalTimeDuration(TimeDuration.fromEpochNsDiff(epochNanosecondsFrom, epochNanosecondsTo), unit);
  }

  const duration = DifferenceZonedDateTime(epochNanosecondsFrom, epochNanosecondsTo, timeZone, calendar, unit);
  const dateTime = GetISODateTimeFor(timeZone, epochNanosecondsFrom);
  return TotalRelativeDuration(duration, epochNanosecondsFrom, epochNanosecondsTo, dateTime, timeZone, calendar, unit);
}

export function GetDifferenceSettings(op, options, group, disallowed, fallbackSmallest, smallestLargestDefaultUnit) {
  const ALLOWED_UNITS = Call(
    ArrayPrototypeFilter,
    ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'],
    [
      (unit) =>
        (group === 'datetime' || (group === 'date' && IsDateUnit(unit)) || (group === 'time' && IsTimeUnit(unit))) &&
        !Call(ArrayPrototypeIncludes, disallowed, [unit])
    ]
  );

  let largestUnit = GetTemporalUnitValuedOption(options, 'largestUnit');
  const roundingIncrement = GetRoundingIncrementOption(options);
  let roundingMode = GetRoundingModeOption(options, 'trunc');
  let smallestUnit = GetTemporalUnitValuedOption(options, 'smallestUnit');

  ValidateTemporalUnitValue(largestUnit, group, ['auto']);
  if (!largestUnit) largestUnit = 'auto';
  if (Call(ArrayPrototypeIncludes, disallowed, [largestUnit])) {
    throw new RangeErrorCtor(
      `largestUnit must be one of ${Call(ArrayPrototypeJoin, ALLOWED_UNITS, [', '])}, not ${largestUnit}`
    );
  }

  if (op === 'since') roundingMode = NegateRoundingMode(roundingMode);

  ValidateTemporalUnitValue(smallestUnit, group);
  if (!smallestUnit) smallestUnit = fallbackSmallest;
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
  const duration = DifferenceEpochNanoseconds(
    onens,
    twons,
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  );
  let result = TemporalDurationFromInternal(duration, settings.largestUnit);
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
  const isoDate = GetSlot(plainDate, ISO_DATE);
  const isoOther = GetSlot(other, ISO_DATE);
  if (CompareISODate(isoDate, isoOther) === 0) return new Duration();

  const dateDifference = CalendarDateUntil(calendar, isoDate, isoOther, settings.largestUnit);

  let duration = { date: dateDifference, time: TimeDuration.ZERO };
  const roundingIsNoop = settings.smallestUnit === 'day' && settings.roundingIncrement === 1;
  if (!roundingIsNoop) {
    const isoDateTime = { isoDate, time: MidnightTimeRecord() };
    const isoDateTimeOther = { isoDate: isoOther, time: MidnightTimeRecord() };
    const originEpochNs = GetUTCEpochNanoseconds(isoDateTime);
    const destEpochNs = GetUTCEpochNanoseconds(isoDateTimeOther);
    duration = RoundRelativeDuration(
      duration,
      originEpochNs,
      destEpochNs,
      isoDateTime,
      null,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
  }

  let result = TemporalDurationFromInternal(duration, 'day');
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
  const isoDateTime1 = GetSlot(plainDateTime, ISO_DATE_TIME);
  const isoDateTime2 = GetSlot(other, ISO_DATE_TIME);
  if (CompareISODateTime(isoDateTime1, isoDateTime2) === 0) return new Duration();

  const duration = DifferencePlainDateTimeWithRounding(
    isoDateTime1,
    isoDateTime2,
    calendar,
    settings.largestUnit,
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  );

  let result = TemporalDurationFromInternal(duration, settings.largestUnit);
  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function DifferenceTemporalPlainTime(operation, plainTime, other, options) {
  other = ToTemporalTime(other);

  const resolvedOptions = GetOptionsObject(options);
  const settings = GetDifferenceSettings(operation, resolvedOptions, 'time', [], 'nanosecond', 'hour');

  let timeDuration = DifferenceTime(GetSlot(plainTime, TIME), GetSlot(other, TIME));
  timeDuration = RoundTimeDuration(
    timeDuration,
    settings.roundingIncrement,
    settings.smallestUnit,
    settings.roundingMode
  );
  const duration = CombineDateAndTimeDuration(ZeroDateDuration(), timeDuration);

  let result = TemporalDurationFromInternal(duration, settings.largestUnit);
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
  if (CompareISODate(GetSlot(yearMonth, ISO_DATE), GetSlot(other, ISO_DATE)) == 0) {
    return new Duration();
  }

  const thisFields = ISODateToFields(calendar, GetSlot(yearMonth, ISO_DATE), 'year-month');
  thisFields.day = 1;
  const thisDate = CalendarDateFromFields(calendar, thisFields, 'constrain');
  const otherFields = ISODateToFields(calendar, GetSlot(other, ISO_DATE), 'year-month');
  otherFields.day = 1;
  const otherDate = CalendarDateFromFields(calendar, otherFields, 'constrain');

  const dateDifference = CalendarDateUntil(calendar, thisDate, otherDate, settings.largestUnit);
  let duration = { date: AdjustDateDurationRecord(dateDifference, 0, 0), time: TimeDuration.ZERO };
  if (settings.smallestUnit !== 'month' || settings.roundingIncrement !== 1) {
    const isoDateTime = { isoDate: thisDate, time: MidnightTimeRecord() };
    const isoDateTimeOther = { isoDate: otherDate, time: MidnightTimeRecord() };
    const originEpochNs = GetUTCEpochNanoseconds(isoDateTime);
    const destEpochNs = GetUTCEpochNanoseconds(isoDateTimeOther);
    duration = RoundRelativeDuration(
      duration,
      originEpochNs,
      destEpochNs,
      isoDateTime,
      null,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
  }

  let result = TemporalDurationFromInternal(duration, 'day');
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
  if (IsTimeUnit(settings.largestUnit)) {
    // The user is only asking for a time difference, so return difference of instants.
    const duration = DifferenceEpochNanoseconds(
      ns1,
      ns2,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
    result = TemporalDurationFromInternal(duration, settings.largestUnit);
  } else {
    const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
    if (!TimeZoneEquals(timeZone, GetSlot(other, TIME_ZONE))) {
      throw new RangeErrorCtor(
        "When calculating difference between time zones, largestUnit must be 'hours' " +
          'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
      );
    }

    if (ns1.equals(ns2)) return new Duration();

    const duration = DifferenceZonedDateTimeWithRounding(
      ns1,
      ns2,
      timeZone,
      calendar,
      settings.largestUnit,
      settings.roundingIncrement,
      settings.smallestUnit,
      settings.roundingMode
    );
    result = TemporalDurationFromInternal(duration, 'hour');
  }

  if (operation === 'since') result = CreateNegatedTemporalDuration(result);
  return result;
}

export function AddTime({ hour, minute, second, millisecond, microsecond, nanosecond }, timeDuration) {
  // timeDuration.sec is a safe integer, but second+timeDuration.sec may not be.
  // minute+trunc(timeDuration.sec/60) is safe. nanosecond+timeDuration.subsec
  // is also safe.
  const minutes = Math.trunc(timeDuration.sec / 60);
  const seconds = timeDuration.sec - minutes * 60;
  return BalanceTime(
    hour,
    minute + minutes,
    second + seconds,
    millisecond,
    microsecond,
    nanosecond + timeDuration.subsec
  );
}

export function AddInstant(epochNanoseconds, timeDuration) {
  const result = timeDuration.addToEpochNs(epochNanoseconds);
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
  if (DateDurationSign(duration.date) === 0) return AddInstant(epochNs, duration.time);

  // RFC 5545 requires the date portion to be added in calendar days and the
  // time portion to be added in exact time.
  const dt = GetISODateTimeFor(timeZone, epochNs);
  const addedDate = CalendarDateAdd(calendar, dt.isoDate, duration.date, overflow);
  const dtIntermediate = { isoDate: addedDate, time: dt.time };

  // Note that 'compatible' is used below because this disambiguation behavior
  // is required by RFC 5545.
  const intermediateNs = GetEpochNanosecondsFor(timeZone, dtIntermediate, 'compatible');
  return AddInstant(intermediateNs, duration.time);
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

  const d1 = ToInternalDurationRecordWith24HourDays(duration);
  const d2 = ToInternalDurationRecordWith24HourDays(other);
  const result = CombineDateAndTimeDuration(ZeroDateDuration(), d1.time.add(d2.time));
  return TemporalDurationFromInternal(result, largestUnit);
}

export function AddDurationToInstant(operation, instant, durationLike) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const largestUnit = DefaultTemporalLargestUnit(duration);
  if (IsDateUnit(largestUnit)) {
    throw new RangeErrorCtor(
      `Duration field ${largestUnit} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`
    );
  }
  const internalDuration = ToInternalDurationRecordWith24HourDays(duration);
  const ns = AddInstant(GetSlot(instant, EPOCHNANOSECONDS), internalDuration.time);
  const Instant = GetIntrinsic('%Temporal.Instant%');
  return new Instant(ns);
}

export function AddDurationToDate(operation, plainDate, durationLike, options) {
  const calendar = GetSlot(plainDate, CALENDAR);

  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const dateDuration = ToDateDurationRecordWithoutTime(duration);

  const resolvedOptions = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(resolvedOptions);

  const addedDate = CalendarDateAdd(calendar, GetSlot(plainDate, ISO_DATE), dateDuration, overflow);
  return CreateTemporalDate(addedDate, calendar);
}

export function AddDurationToDateTime(operation, dateTime, durationLike, options) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const resolvedOptions = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(resolvedOptions);

  const calendar = GetSlot(dateTime, CALENDAR);

  const internalDuration = ToInternalDurationRecordWith24HourDays(duration);

  // Add the time part
  const isoDateTime = GetSlot(dateTime, ISO_DATE_TIME);
  const timeResult = AddTime(isoDateTime.time, internalDuration.time);
  const dateDuration = AdjustDateDurationRecord(internalDuration.date, timeResult.deltaDays);

  // Delegate the date part addition to the calendar
  RejectDuration(dateDuration.years, dateDuration.months, dateDuration.weeks, dateDuration.days, 0, 0, 0, 0, 0, 0);
  const addedDate = CalendarDateAdd(calendar, isoDateTime.isoDate, dateDuration, overflow);

  return CreateTemporalDateTime({ isoDate: addedDate, time: timeResult }, calendar);
}

export function AddDurationToTime(operation, temporalTime, durationLike) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const internalDuration = ToInternalDurationRecordWith24HourDays(duration);
  const { hour, minute, second, millisecond, microsecond, nanosecond } = AddTime(
    GetSlot(temporalTime, TIME),
    internalDuration.time
  );
  const time = RegulateTime(hour, minute, second, millisecond, microsecond, nanosecond, 'reject');
  return CreateTemporalTime(time);
}

export function AddDurationToYearMonth(operation, yearMonth, durationLike, options) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);
  const internalDuration = ToInternalDurationRecord(duration);

  const resolvedOptions = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(resolvedOptions);

  const durationToAdd = internalDuration.date;
  if (durationToAdd.weeks !== 0 || durationToAdd.days !== 0 || !internalDuration.time.isZero()) {
    throw new RangeErrorCtor('only years and months can be added to Temporal.PlainYearMonth');
  }

  const calendar = GetSlot(yearMonth, CALENDAR);
  const fields = ISODateToFields(calendar, GetSlot(yearMonth, ISO_DATE), 'year-month');
  fields.day = 1;
  const date = CalendarDateFromFields(calendar, fields, 'constrain');
  const addedDate = CalendarDateAdd(calendar, date, durationToAdd, overflow);
  const addedDateFields = ISODateToFields(calendar, addedDate, 'year-month');

  const isoDate = CalendarYearMonthFromFields(calendar, addedDateFields, overflow);
  return CreateTemporalYearMonth(isoDate, calendar);
}

export function AddDurationToZonedDateTime(operation, zonedDateTime, durationLike, options) {
  let duration = ToTemporalDuration(durationLike);
  if (operation === 'subtract') duration = CreateNegatedTemporalDuration(duration);

  const resolvedOptions = GetOptionsObject(options);
  const overflow = GetTemporalOverflowOption(resolvedOptions);
  const timeZone = GetSlot(zonedDateTime, TIME_ZONE);
  const calendar = GetSlot(zonedDateTime, CALENDAR);
  const internalDuration = ToInternalDurationRecord(duration);
  const epochNanoseconds = AddZonedDateTime(
    GetSlot(zonedDateTime, EPOCHNANOSECONDS),
    timeZone,
    calendar,
    internalDuration,
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
  const rounded = remainder === 0 ? r1 : ApplyUnsignedRoundingMode(r1, r2, cmp, even, unsignedRoundingMode);
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
  // Similar to the comparison in RoundNumberToIncrement, but multiplied by an
  // extra sign to make sure we treat it as positive
  const cmp = remainder.times(2).abs().compare(increment) * (quantity.lt(0) ? -1 : 1);
  const rounded = remainder.isZero()
    ? quotient
    : ApplyUnsignedRoundingMode(r1, r2, cmp, r1.isEven(), unsignedRoundingMode);
  return rounded.times(increment);
}

export function RoundTemporalInstant(epochNs, increment, unit, roundingMode) {
  const incrementNs = TemporalUnitLength(unit) * increment;
  return RoundNumberToIncrementAsIfPositive(epochNs, incrementNs, roundingMode);
}

export function RoundISODateTime(isoDateTime, increment, unit, roundingMode) {
  AssertISODateTimeWithinLimits(isoDateTime);
  const time = RoundTime(isoDateTime.time, increment, unit, roundingMode);
  const isoDate = AddDaysToISODate(isoDateTime.isoDate, time.deltaDays);
  return { isoDate, time };
}

export function RoundTime(
  { hour, minute, second, millisecond, microsecond, nanosecond },
  increment,
  unit,
  roundingMode
) {
  let quantity = 0;
  switch (unit) {
    case 'day':
    case 'hour':
      quantity = hour * NANOSECONDS_PER_HOUR;
    // fallthrough
    case 'minute':
      quantity += minute * NANOSECONDS_PER_MINUTE;
    // fallthrough
    case 'second':
      quantity += second * NANOSECONDS_PER_SECOND;
    // fallthrough
    case 'millisecond':
      quantity += millisecond * NANOSECONDS_PER_MILLISECOND;
    // fallthrough
    case 'microsecond':
      quantity += microsecond * NANOSECONDS_PER_MICROSECOND;
    // fallthrough
    case 'nanosecond':
      quantity += nanosecond;
  }
  const nsPerUnit = TemporalUnitLength(unit);
  const result = RoundNumberToIncrement(quantity, nsPerUnit * increment, roundingMode) / nsPerUnit;
  switch (unit) {
    case 'day':
      return CreateTimeRecordInfallible(0, 0, 0, 0, 0, 0, result);
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

export function RoundTimeDuration(timeDuration, increment, unit, roundingMode) {
  const unitLength = TemporalUnitLength(unit);
  // Use bigInt multiplication to avoid exceeding MAX_SAFE_INTEGER
  return timeDuration.round(bigInt(unitLength).multiply(increment), roundingMode);
}

export function TotalTimeDuration(timeDuration, unit) {
  return timeDuration.fdiv(TemporalUnitLength(unit));
}

export function CompareISODate(isoDate1, isoDate2) {
  if (isoDate1.year !== isoDate2.year) return ComparisonResult(isoDate1.year - isoDate2.year);
  if (isoDate1.month !== isoDate2.month) return ComparisonResult(isoDate1.month - isoDate2.month);
  if (isoDate1.day !== isoDate2.day) return ComparisonResult(isoDate1.day - isoDate2.day);
  return 0;
}

export function CompareTimeRecord(time1, time2) {
  if (time1.hour !== time2.hour) return ComparisonResult(time1.hour - time2.hour);
  if (time1.minute !== time2.minute) return ComparisonResult(time1.minute - time2.minute);
  if (time1.second !== time2.second) return ComparisonResult(time1.second - time2.second);
  if (time1.millisecond !== time2.millisecond) return ComparisonResult(time1.millisecond - time2.millisecond);
  if (time1.microsecond !== time2.microsecond) return ComparisonResult(time1.microsecond - time2.microsecond);
  if (time1.nanosecond !== time2.nanosecond) return ComparisonResult(time1.nanosecond - time2.nanosecond);
  return 0;
}

export function CompareISODateTime(isoDateTime1, isoDateTime2) {
  const dateResult = CompareISODate(isoDateTime1.isoDate, isoDateTime2.isoDate);
  if (dateResult !== 0) return dateResult;
  return CompareTimeRecord(isoDateTime1.time, isoDateTime2.time);
}

// Not abstract operations from the spec

// rounding modes supported: floor, ceil
export function epochNsToMs(epochNanoseconds, mode) {
  const { quotient, remainder } = bigInt(epochNanoseconds).divmod(1e6);
  let epochMilliseconds = +quotient;
  if (mode === 'floor' && +remainder < 0) epochMilliseconds -= 1;
  if (mode === 'ceil' && +remainder > 0) epochMilliseconds += 1;
  return epochMilliseconds;
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

// This is a temporary implementation. Ideally we'd rely on Intl.DateTimeFormat
// here, to provide the latest CLDR alias data, when implementations catch up to
// the ECMA-402 change. The aliases below are taken from
// https://github.com/unicode-org/cldr/blob/main/common/bcp47/calendar.xml
export function CanonicalizeCalendar(id) {
  id = ASCIILowercase(id);

  if (!Call(ArrayPrototypeIncludes, BUILTIN_CALENDAR_IDS, [ASCIILowercase(id)])) {
    throw new RangeErrorCtor(`invalid calendar identifier ${id}`);
  }

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
  while (right - left > 1) {
    let middle = MathTrunc((left + right) / 2);
    const mstate = getState(middle);
    if (mstate === lstate) {
      left = middle;
      lstate = mstate;
    } else if (mstate === rstate) {
      right = middle;
      rstate = mstate;
    } else {
      /* c8 ignore next */ assertNotReached(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}
