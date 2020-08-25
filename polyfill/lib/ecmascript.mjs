const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat;
const ObjectAssign = Object.assign;

import bigInt from 'big-integer';
import Call from 'es-abstract/2019/Call.js';
import SpeciesConstructor from 'es-abstract/2019/SpeciesConstructor.js';
import ToInteger from 'es-abstract/2019/ToInteger.js';
import ToNumber from 'es-abstract/2019/ToNumber.js';
import ToObject from 'es-abstract/2019/ToObject.js';
import ToPrimitive from 'es-abstract/2019/ToPrimitive.js';
import ToString from 'es-abstract/2019/ToString.js';

import { GetIntrinsic } from './intrinsicclass.mjs';
import {
  GetSlot,
  HasSlot,
  EPOCHNANOSECONDS,
  TIMEZONE_ID,
  CALENDAR_ID,
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  REF_ISO_YEAR,
  REF_ISO_DAY,
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

const DAYMILLIS = 86400000;
const NS_MIN = bigInt(-86400).multiply(1e17);
const NS_MAX = bigInt(86400).multiply(1e17);
const YEAR_MIN = -271821;
const YEAR_MAX = 275760;
const BEFORE_FIRST_DST = bigInt(-388152).multiply(1e13); // 1847-01-01T00:00:00Z

import * as PARSE from './regex.mjs';

const ES2019 = {
  Call,
  SpeciesConstructor,
  ToInteger,
  ToNumber,
  ToObject,
  ToPrimitive,
  ToString
};

export const ES = ObjectAssign({}, ES2019, {
  IsTemporalAbsolute: (item) => HasSlot(item, EPOCHNANOSECONDS),
  IsTemporalTimeZone: (item) => HasSlot(item, TIMEZONE_ID),
  IsTemporalCalendar: (item) => HasSlot(item, CALENDAR_ID),
  IsTemporalDuration: (item) =>
    HasSlot(item, YEARS, MONTHS, DAYS, HOURS, MINUTES, SECONDS, MILLISECONDS, MICROSECONDS, NANOSECONDS),
  IsTemporalDate: (item) =>
    HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY) &&
    !HasSlot(item, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND),
  IsTemporalTime: (item) =>
    HasSlot(item, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND) &&
    !HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY),
  IsTemporalDateTime: (item) =>
    HasSlot(item, ISO_YEAR, ISO_MONTH, ISO_DAY, HOUR, MINUTE, SECOND, MILLISECOND, MICROSECOND, NANOSECOND),
  IsTemporalYearMonth: (item) => HasSlot(item, ISO_YEAR, ISO_MONTH, REF_ISO_DAY),
  IsTemporalMonthDay: (item) => HasSlot(item, ISO_MONTH, ISO_DAY, REF_ISO_YEAR),
  TemporalTimeZoneFromString: (stringIdent) => {
    const { zone, ianaName, offset } = ES.ParseTemporalTimeZoneString(stringIdent);
    const result = ES.GetCanonicalTimeZoneIdentifier(zone);
    if (offset && ianaName) {
      const ns = ES.ParseTemporalAbsolute(stringIdent);
      const offsetNs = ES.GetIANATimeZoneOffsetNanoseconds(ns, result);
      if (ES.FormatTimeZoneOffsetString(offsetNs) !== offset) {
        throw new RangeError(`invalid offset ${offset}[${ianaName}]`);
      }
    }
    return result;
  },
  FormatCalendarAnnotation: (calendar) => {
    if (calendar.id === 'iso8601') return '';
    return `[c=${calendar.id}]`;
  },
  ParseISODateTime: (isoString, { zoneRequired }) => {
    const regex = zoneRequired ? PARSE.absolute : PARSE.datetime;
    const match = regex.exec(isoString);
    if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`);
    let yearString = match[1];
    if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
    const year = ES.ToInteger(yearString);
    const month = ES.ToInteger(match[2] || match[4]);
    const day = ES.ToInteger(match[3] || match[5]);
    const hour = ES.ToInteger(match[6]);
    const minute = ES.ToInteger(match[7] || match[10]);
    let second = ES.ToInteger(match[8] || match[11]);
    if (second === 60) second = 59;
    const fraction = (match[9] || match[12]) + '000000000';
    const millisecond = ES.ToInteger(fraction.slice(0, 3));
    const microsecond = ES.ToInteger(fraction.slice(3, 6));
    const nanosecond = ES.ToInteger(fraction.slice(6, 9));
    const offsetSign = match[14] === '-' || match[14] === '\u2212' ? '-' : '+';
    const offset = `${offsetSign}${match[15] || '00'}:${match[16] || '00'}`;
    let ianaName = match[17];
    if (ianaName) {
      try {
        // Canonicalize name if it is an IANA link name or is capitalized wrong
        ianaName = ES.GetCanonicalTimeZoneIdentifier(ianaName).toString();
      } catch {
        // Not an IANA name, may be a custom ID, pass through unchanged
      }
    }
    const zone = match[13] ? 'UTC' : ianaName || offset;
    const calendar = match[18] || null;
    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      zone,
      ianaName,
      offset,
      calendar
    };
  },
  ParseTemporalAbsoluteString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: true });
  },
  ParseTemporalDateTimeString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: false });
  },
  ParseTemporalDateString: (isoString) => {
    return ES.ParseISODateTime(isoString, { zoneRequired: false });
  },
  ParseTemporalTimeString: (isoString) => {
    const match = PARSE.time.exec(isoString);
    let hour, minute, second, millisecond, microsecond, nanosecond;
    if (match) {
      hour = ES.ToInteger(match[1]);
      minute = ES.ToInteger(match[2] || match[5]);
      second = ES.ToInteger(match[3] || match[6]);
      if (second === 60) second = 59;
      const fraction = (match[4] || match[7]) + '000000000';
      millisecond = ES.ToInteger(fraction.slice(0, 3));
      microsecond = ES.ToInteger(fraction.slice(3, 6));
      nanosecond = ES.ToInteger(fraction.slice(6, 9));
    } else {
      ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ParseISODateTime(isoString, {
        zoneRequired: false
      }));
    }
    return { hour, minute, second, millisecond, microsecond, nanosecond };
  },
  ParseTemporalYearMonthString: (isoString) => {
    const match = PARSE.yearmonth.exec(isoString);
    let year, month, calendar, refISODay;
    if (match) {
      let yearString = match[1];
      if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`;
      year = ES.ToInteger(yearString);
      month = ES.ToInteger(match[2]);
      calendar = match[3] || null;
    } else {
      ({ year, month, calendar, day: refISODay } = ES.ParseISODateTime(isoString, { zoneRequired: false }));
      if (!calendar) refISODay = undefined;
    }
    return { year, month, calendar, refISODay };
  },
  ParseTemporalMonthDayString: (isoString) => {
    const match = PARSE.monthday.exec(isoString);
    let month, day, calendar, refISOYear;
    if (match) {
      month = ES.ToInteger(match[1]);
      day = ES.ToInteger(match[2]);
    } else {
      ({ month, day, calendar, year: refISOYear } = ES.ParseISODateTime(isoString, { zoneRequired: false }));
      if (!calendar) refISOYear = undefined;
    }
    return { month, day, calendar, refISOYear };
  },
  ParseTemporalTimeZoneString: (stringIdent) => {
    try {
      const canonicalIdent = ES.GetCanonicalTimeZoneIdentifier(stringIdent);
      if (canonicalIdent) return { zone: canonicalIdent.toString() };
    } catch {
      // fall through
    }
    try {
      // Try parsing ISO string instead
      return ES.ParseISODateTime(stringIdent, { zoneRequired: true });
    } catch {
      throw new RangeError(`Invalid time zone: ${stringIdent}`);
    }
  },
  ParseTemporalDurationString: (isoString) => {
    const match = PARSE.duration.exec(isoString);
    if (!match) throw new RangeError(`invalid duration: ${isoString}`);
    if (match.slice(1).every((element) => element === undefined)) {
      throw new RangeError(`invalid duration: ${isoString}`);
    }
    const years = ES.ToInteger(match[1]);
    const months = ES.ToInteger(match[2]);
    const weeks = ES.ToInteger(match[3]);
    const days = ES.ToInteger(match[4]);
    const hours = ES.ToInteger(match[5]);
    const minutes = ES.ToInteger(match[6]);
    const seconds = ES.ToInteger(match[7]);
    const fraction = match[8] + '000000000';
    const milliseconds = ES.ToInteger(fraction.slice(0, 3));
    const microseconds = ES.ToInteger(fraction.slice(3, 6));
    const nanoseconds = ES.ToInteger(fraction.slice(6, 9));
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  ParseTemporalAbsolute: (isoString) => {
    const {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offset,
      zone
    } = ES.ParseTemporalAbsoluteString(isoString);

    const DateTime = GetIntrinsic('%Temporal.DateTime%');

    const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const tz = ES.TimeZoneFrom(zone);

    const possibleAbsolutes = tz.getPossibleAbsolutesFor(dt);
    if (possibleAbsolutes.length === 1) return GetSlot(possibleAbsolutes[0], EPOCHNANOSECONDS);
    for (const absolute of possibleAbsolutes) {
      const possibleOffsetNs = tz.getOffsetNanosecondsFor(absolute);
      if (ES.FormatTimeZoneOffsetString(possibleOffsetNs) === offset) return GetSlot(absolute, EPOCHNANOSECONDS);
    }
    throw new RangeError(`'${isoString}' doesn't uniquely identify a Temporal.Absolute`);
  },
  RegulateDateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, disambiguation) => {
    switch (disambiguation) {
      case 'reject':
        ES.RejectDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
        break;
      case 'constrain':
        ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainDateTime(
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
    }
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  RegulateDate: (year, month, day, disambiguation) => {
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
  RegulateTime: (hour, minute, second, millisecond, microsecond, nanosecond, disambiguation) => {
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
          nanosecond
        ));
        break;
    }
    return { hour, minute, second, millisecond, microsecond, nanosecond };
  },
  RegulateYearMonth: (year, month, disambiguation) => {
    const refISODay = 1;
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(year, month, refISODay);
        break;
      case 'constrain':
        ({ year, month } = ES.ConstrainDate(year, month));
        break;
    }
    return { year, month };
  },
  RegulateMonthDay: (month, day, disambiguation) => {
    const refISOYear = 1972;
    switch (disambiguation) {
      case 'reject':
        ES.RejectDate(refISOYear, month, day);
        break;
      case 'constrain':
        ({ month, day } = ES.ConstrainDate(refISOYear, month, day));
        break;
    }
    return { month, day };
  },
  ToTemporalDurationRecord: (item) => {
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
    return ES.ToRecord(item, [
      ['days', 0],
      ['hours', 0],
      ['microseconds', 0],
      ['milliseconds', 0],
      ['minutes', 0],
      ['months', 0],
      ['nanoseconds', 0],
      ['seconds', 0],
      ['weeks', 0],
      ['years', 0]
    ]);
  },
  RegulateDuration: (
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
    disambiguation
  ) => {
    for (const prop of [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds]) {
      if (prop < 0) throw new RangeError('negative values not allowed as duration fields');
    }

    switch (disambiguation) {
      case 'reject':
        for (const prop of [
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
        ]) {
          if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
        }
        break;
      case 'constrain': {
        const arr = [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds];
        for (const idx in arr) {
          if (!Number.isFinite(arr[idx])) arr[idx] = Number.MAX_VALUE;
        }
        [years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds] = arr;
        break;
      }
      case 'balance': {
        ({ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = ES.BalanceDuration(
          days,
          hours,
          minutes,
          seconds,
          milliseconds,
          microseconds,
          nanoseconds,
          'days'
        ));
        for (const prop of [
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
        ]) {
          if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields');
        }
        break;
      }
    }

    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },
  ToLimitedTemporalDuration: (item, disallowedProperties = []) => {
    if (typeof item !== 'object' || item === null) {
      throw new TypeError('Unexpected type for duration');
    }
    const {
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
    } = ES.ToTemporalDurationRecord(item);
    const duration = ES.RegulateDuration(
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
      'reject'
    );
    for (const property of disallowedProperties) {
      if (duration[property] !== 0) {
        throw new RangeError(`invalid duration field ${property}`);
      }
    }
    return duration;
  },
  ToDurationTemporalDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['constrain', 'balance', 'reject'], 'constrain');
  },
  ToTemporalDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['constrain', 'reject'], 'constrain');
  },
  ToTimeZoneTemporalDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible');
  },
  ToDurationSubtractionTemporalDisambiguation: (options) => {
    return ES.GetOption(options, 'disambiguation', ['balanceConstrain', 'balance'], 'balanceConstrain');
  },
  ToLargestTemporalUnit: (options, fallback, disallowedStrings = []) => {
    const allowed = new Set(['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']);
    for (const s of disallowedStrings) {
      allowed.delete(s);
    }
    return ES.GetOption(options, 'largestUnit', [...allowed], fallback);
  },
  ToPartialRecord: (bag, fields) => {
    if (!bag || 'object' !== typeof bag) return false;
    let any;
    for (const property of fields) {
      const value = bag[property];
      if (value !== undefined) {
        any = any || {};
        if (property === 'calendar') {
          // FIXME: this is terrible
          const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
          any.calendar = TemporalCalendar.from(value);
        } else if (property === 'era') {
          any.era = value;
        } else {
          any[property] = ES.ToInteger(value);
        }
      }
    }
    return any ? any : false;
  },
  ToRecord: (bag, fields) => {
    if (!bag || 'object' !== typeof bag) return false;
    const result = {};
    for (const fieldRecord of fields) {
      const [property, defaultValue] = fieldRecord;
      let value = bag[property];
      if (value === undefined) {
        if (fieldRecord.length === 1) {
          throw new TypeError(`required property '${property}' missing or undefined`);
        }
        value = defaultValue;
      }
      if (property === 'calendar') {
        // FIXME: this is terrible
        const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
        result.calendar = TemporalCalendar.from(value);
      } else if (property === 'era') {
        result.era = value;
      } else {
        result[property] = ES.ToInteger(value);
      }
    }
    return result;
  },
  // field access in the following operations is intentionally alphabetical
  ToTemporalDateRecord: (bag) => {
    return ES.ToRecord(bag, [['day'], ['era', undefined], ['month'], ['year']]);
  },
  ToTemporalDateTimeRecord: (bag) => {
    return ES.ToRecord(bag, [
      ['day'],
      ['era', undefined],
      ['hour', 0],
      ['microsecond', 0],
      ['millisecond', 0],
      ['minute', 0],
      ['month'],
      ['nanosecond', 0],
      ['second', 0],
      ['year']
    ]);
  },
  ToTemporalMonthDayRecord: (bag) => {
    return ES.ToRecord(bag, [['day'], ['month']]);
  },
  ToTemporalTimeRecord: (bag) => {
    return ES.ToRecord(bag, [
      ['hour', 0],
      ['microsecond', 0],
      ['millisecond', 0],
      ['minute', 0],
      ['nanosecond', 0],
      ['second', 0]
    ]);
  },
  ToTemporalYearMonthRecord: (bag) => {
    return ES.ToRecord(bag, [['era', undefined], ['month'], ['year']]);
  },
  CalendarFrom: (calendarLike) => {
    const TemporalCalendar = GetIntrinsic('%Temporal.Calendar%');
    let from = TemporalCalendar.from;
    if (from === undefined) {
      from = GetIntrinsic('%Temporal.Calendar.from%');
    }
    return ES.Call(from, TemporalCalendar, [calendarLike]);
  },
  ToTemporalCalendar: (calendarLike) => {
    if (typeof calendarLike === 'object' && calendarLike) {
      return calendarLike;
    }
    const identifier = ES.ToString(calendarLike);
    return ES.CalendarFrom(identifier);
  },
  TimeZoneFrom: (temporalTimeZoneLike) => {
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    let from = TemporalTimeZone.from;
    if (from === undefined) {
      from = GetIntrinsic('%Temporal.TimeZone.from%');
    }
    return ES.Call(from, TemporalTimeZone, [temporalTimeZoneLike]);
  },
  ToTemporalTimeZone: (temporalTimeZoneLike) => {
    if (typeof temporalTimeZoneLike === 'object' && temporalTimeZoneLike) {
      return temporalTimeZoneLike;
    }
    const identifier = ES.ToString(temporalTimeZoneLike);
    return ES.TimeZoneFrom(identifier);
  },
  TemporalDateTimeToDate: (dateTime) => {
    const Date = GetIntrinsic('%Temporal.Date%');
    return new Date(
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, CALENDAR)
    );
  },
  TemporalDateTimeToTime: (dateTime) => {
    const Time = GetIntrinsic('%Temporal.Time%');
    return new Time(
      GetSlot(dateTime, HOUR),
      GetSlot(dateTime, MINUTE),
      GetSlot(dateTime, SECOND),
      GetSlot(dateTime, MILLISECOND),
      GetSlot(dateTime, MICROSECOND),
      GetSlot(dateTime, NANOSECOND)
    );
  },
  GetOffsetNanosecondsFor: (timeZone, absolute) => {
    let getOffsetNanosecondsFor = timeZone.getOffsetNanosecondsFor;
    if (getOffsetNanosecondsFor === undefined) {
      getOffsetNanosecondsFor = GetIntrinsic('%Temporal.TimeZone.prototype.getOffsetNanosecondsFor%');
    }
    const offsetNs = ES.Call(getOffsetNanosecondsFor, timeZone, [absolute]);
    if (typeof offsetNs !== 'number') {
      throw new TypeError('bad return from getOffsetNanosecondsFor');
    }
    if (!Number.isInteger(offsetNs) || Math.abs(offsetNs) > 86400e9) {
      throw new RangeError('out-of-range return from getOffsetNanosecondsFor');
    }
    return offsetNs;
  },
  GetOffsetStringFor: (timeZone, absolute) => {
    let getOffsetStringFor = timeZone.getOffsetStringFor;
    if (getOffsetStringFor === undefined) {
      getOffsetStringFor = GetIntrinsic('%Temporal.TimeZone.prototype.getOffsetStringFor%');
    }
    return ES.ToString(ES.Call(getOffsetStringFor, timeZone, [absolute]));
  },
  GetTemporalDateTimeFor: (timeZone, absolute, calendar) => {
    let getDateTimeFor = timeZone.getDateTimeFor;
    if (getDateTimeFor === undefined) {
      getDateTimeFor = GetIntrinsic('%Temporal.TimeZone.prototype.getDateTimeFor%');
    }
    const dateTime = ES.Call(getDateTimeFor, timeZone, [absolute, calendar]);
    if (!ES.IsTemporalDateTime(dateTime)) {
      throw new TypeError('Unexpected result from getDateTimeFor');
    }
    return dateTime;
  },
  GetTemporalAbsoluteFor: (timeZone, dateTime, disambiguation) => {
    let getAbsoluteFor = timeZone.getAbsoluteFor;
    if (getAbsoluteFor === undefined) {
      getAbsoluteFor = GetIntrinsic('%Temporal.TimeZone.prototype.getAbsoluteFor%');
    }
    return ES.Call(getAbsoluteFor, timeZone, [dateTime, { disambiguation }]);
  },
  TimeZoneToString: (timeZone) => {
    let toString = timeZone.toString;
    if (toString === undefined) {
      toString = GetIntrinsic('%Temporal.TimeZone.prototype.toString%');
    }
    return ES.ToString(ES.Call(toString, timeZone));
  },
  ISOTimeZoneString: (timeZone, absolute) => {
    const name = ES.TimeZoneToString(timeZone);
    const offset = ES.GetOffsetStringFor(timeZone, absolute);

    if (name === 'UTC') {
      return 'Z';
    }

    if (name === offset) {
      return offset;
    }

    return `${offset}[${name}]`;
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
  FormatSecondsStringPart: (seconds, millis, micros, nanos) => {
    if (!seconds && !millis && !micros && !nanos) return '';

    let parts = [];
    if (nanos) parts.unshift(`000${nanos || 0}`.slice(-3));
    if (micros || parts.length) parts.unshift(`000${micros || 0}`.slice(-3));
    if (millis || parts.length) parts.unshift(`000${millis || 0}`.slice(-3));
    let secs = `00${seconds}`.slice(-2);
    let post = parts.length ? `.${parts.join('')}` : '';
    return `:${secs}${post}`;
  },
  TemporalAbsoluteToString: (absolute, timeZone) => {
    const dateTime = ES.GetTemporalDateTimeFor(timeZone, absolute);
    const year = ES.ISOYearString(dateTime.year);
    const month = ES.ISODateTimePartString(dateTime.month);
    const day = ES.ISODateTimePartString(dateTime.day);
    const hour = ES.ISODateTimePartString(dateTime.hour);
    const minute = ES.ISODateTimePartString(dateTime.minute);
    const seconds = ES.FormatSecondsStringPart(
      dateTime.second,
      dateTime.millisecond,
      dateTime.microsecond,
      dateTime.nanosecond
    );
    const timeZoneString = ES.ISOTimeZoneString(timeZone, absolute);
    return `${year}-${month}-${day}T${hour}:${minute}${seconds}${timeZoneString}`;
  },
  TemporalDurationToString: (duration) => {
    function formatNumber(num) {
      if (num <= Number.MAX_SAFE_INTEGER) return num.toString(10);
      return bigInt(num).toString();
    }
    const dateParts = [];
    if (GetSlot(duration, YEARS)) dateParts.push(`${formatNumber(GetSlot(duration, YEARS))}Y`);
    if (GetSlot(duration, MONTHS)) dateParts.push(`${formatNumber(GetSlot(duration, MONTHS))}M`);
    if (GetSlot(duration, WEEKS)) dateParts.push(`${formatNumber(GetSlot(duration, WEEKS))}W`);
    if (GetSlot(duration, DAYS)) dateParts.push(`${formatNumber(GetSlot(duration, DAYS))}D`);

    const timeParts = [];
    if (GetSlot(duration, HOURS)) timeParts.push(`${formatNumber(GetSlot(duration, HOURS))}H`);
    if (GetSlot(duration, MINUTES)) timeParts.push(`${formatNumber(GetSlot(duration, MINUTES))}M`);

    const secondParts = [];
    let ms = GetSlot(duration, MILLISECONDS);
    let µs = GetSlot(duration, MICROSECONDS);
    let ns = GetSlot(duration, NANOSECONDS);
    let seconds;
    ({ seconds, millisecond: ms, microsecond: µs, nanosecond: ns } = ES.BalanceSubSecond(ms, µs, ns));
    const s = GetSlot(duration, SECONDS) + seconds;
    if (ns) secondParts.unshift(`${ns}`.padStart(3, '0'));
    if (µs || secondParts.length) secondParts.unshift(`${µs}`.padStart(3, '0'));
    if (ms || secondParts.length) secondParts.unshift(`${ms}`.padStart(3, '0'));
    if (secondParts.length) secondParts.unshift('.');
    if (s || secondParts.length) secondParts.unshift(formatNumber(s));
    if (secondParts.length) timeParts.push(`${secondParts.join('')}S`);
    if (timeParts.length) timeParts.unshift('T');
    if (!dateParts.length && !timeParts.length) return 'PT0S';
    return `P${dateParts.join('')}${timeParts.join('')}`;
  },

  GetCanonicalTimeZoneIdentifier: (timeZoneIdentifier) => {
    const offsetNs = parseOffsetString(timeZoneIdentifier);
    if (offsetNs !== null) return ES.FormatTimeZoneOffsetString(offsetNs);
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
    return formatter.resolvedOptions().timeZone;
  },
  GetIANATimeZoneOffsetNanoseconds: (epochNanoseconds, id) => {
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
    } = ES.GetIANATimeZoneDateTimeParts(epochNanoseconds, id);
    const utc = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (utc === null) throw new RangeError('Date outside of supported range');
    return +utc.minus(epochNanoseconds);
  },
  FormatTimeZoneOffsetString: (offsetNanoseconds) => {
    const sign = offsetNanoseconds < 0 ? '-' : '+';
    offsetNanoseconds = Math.abs(offsetNanoseconds);
    const offsetMinutes = Math.floor(offsetNanoseconds / 60e9);
    const offsetMinuteString = `00${offsetMinutes % 60}`.slice(-2);
    const offsetHourString = `00${Math.floor(offsetMinutes / 60)}`.slice(-2);
    return `${sign}${offsetHourString}:${offsetMinuteString}`;
  },
  GetEpochFromParts: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    // Note: Date.UTC() interprets one and two-digit years as being in the
    // 20th century, so don't use it
    const legacyDate = new Date();
    legacyDate.setUTCHours(hour, minute, second, millisecond);
    legacyDate.setUTCFullYear(year, month - 1, day);
    const ms = legacyDate.getTime();
    if (Number.isNaN(ms)) return null;
    let ns = bigInt(ms).multiply(1e6);
    ns = ns.plus(bigInt(microsecond).multiply(1e3));
    ns = ns.plus(bigInt(nanosecond));
    if (ns.lesser(NS_MIN) || ns.greater(NS_MAX)) return null;
    return ns;
  },
  GetPartsFromEpoch: (epochNanoseconds) => {
    const { quotient, remainder } = bigInt(epochNanoseconds).divmod(1e6);
    let epochMilliseconds = +quotient;
    let nanos = +remainder;
    if (nanos < 0) {
      nanos += 1e6;
      epochMilliseconds -= 1;
    }
    const microsecond = Math.floor(nanos / 1e3) % 1e3;
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
  GetIANATimeZoneDateTimeParts: (epochNanoseconds, id) => {
    const { epochMilliseconds, millisecond, microsecond, nanosecond } = ES.GetPartsFromEpoch(epochNanoseconds);
    const { year, month, day, hour, minute, second } = ES.GetFormatterParts(id, epochMilliseconds);
    return ES.BalanceDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  },
  GetIANATimeZoneNextTransition: (epochNanoseconds, id) => {
    const uppercap = ES.SystemUTCEpochNanoSeconds() + 366 * DAYMILLIS * 1e6;
    let leftNanos = epochNanoseconds;
    let leftOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(leftNanos, id);
    let rightNanos = leftNanos;
    let rightOffsetNs = leftOffsetNs;
    while (leftOffsetNs === rightOffsetNs && bigInt(leftNanos).compare(uppercap) === -1) {
      rightNanos = bigInt(leftNanos).plus(2 * 7 * DAYMILLIS * 1e6);
      rightOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(rightNanos, id);
      if (leftOffsetNs === rightOffsetNs) {
        leftNanos = rightNanos;
      }
    }
    if (leftOffsetNs === rightOffsetNs) return null;
    const result = bisect(
      (epochNs) => ES.GetIANATimeZoneOffsetNanoseconds(epochNs, id),
      leftNanos,
      rightNanos,
      leftOffsetNs,
      rightOffsetNs
    );
    return result;
  },
  GetIANATimeZonePreviousTransition: (epochNanoseconds, id) => {
    const lowercap = BEFORE_FIRST_DST; // 1847-01-01T00:00:00Z
    let rightNanos = epochNanoseconds;
    let rightOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(rightNanos, id);
    let leftNanos = rightNanos;
    let leftOffsetNs = rightOffsetNs;
    while (rightOffsetNs === leftOffsetNs && bigInt(rightNanos).compare(lowercap) === 1) {
      leftNanos = bigInt(rightNanos).minus(2 * 7 * DAYMILLIS * 1e6);
      leftOffsetNs = ES.GetIANATimeZoneOffsetNanoseconds(leftNanos, id);
      if (rightOffsetNs === leftOffsetNs) {
        rightNanos = leftNanos;
      }
    }
    if (rightOffsetNs === leftOffsetNs) return null;
    const result = bisect(
      (epochNs) => ES.GetIANATimeZoneOffsetNanoseconds(epochNs, id),
      leftNanos,
      rightNanos,
      leftOffsetNs,
      rightOffsetNs
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
    return {
      year: era === 'BC' ? -year + 1 : +year,
      month: +month,
      day: +day,
      hour: hour === '24' ? 0 : +hour, // bugs.chromium.org/p/chromium/issues/detail?id=1045791
      minute: +minute,
      second: +second
    };
  },
  GetIANATimeZoneEpochValue: (id, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    let ns = ES.GetEpochFromParts(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    if (ns === null) throw new RangeError('DateTime outside of supported range');
    const dayNanos = bigInt(DAYMILLIS).multiply(1e6);
    let nsEarlier = ns.minus(dayNanos);
    if (nsEarlier.lesser(NS_MIN)) nsEarlier = ns;
    let nsLater = ns.plus(dayNanos);
    if (nsLater.greater(NS_MAX)) nsLater = ns;
    const earliest = ES.GetIANATimeZoneOffsetNanoseconds(nsEarlier, id);
    const latest = ES.GetIANATimeZoneOffsetNanoseconds(nsLater, id);
    const found = earliest === latest ? [earliest] : [earliest, latest];
    return found
      .map((offsetNanoseconds) => {
        const epochNanoseconds = bigInt(ns).minus(offsetNanoseconds);
        const parts = ES.GetIANATimeZoneDateTimeParts(epochNanoseconds, id);
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
    if (!Number.isFinite(year) || !Number.isFinite(month)) throw new RangeError('infinity is out of range');
    month -= 1;
    year += Math.floor(month / 12);
    month %= 12;
    if (month < 0) month += 12;
    month += 1;
    return { year, month };
  },
  BalanceDate: (year, month, day) => {
    if (!Number.isFinite(day)) throw new RangeError('infinity is out of range');
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
  BalanceDateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
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
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },
  BalanceSubSecond: (millisecond, microsecond, nanosecond) => {
    if (!Number.isFinite(millisecond) || !Number.isFinite(microsecond) || !Number.isFinite(nanosecond)) {
      throw new RangeError('infinity is out of range');
    }

    microsecond += Math.floor(nanosecond / 1000);
    nanosecond = ES.NonNegativeModulo(nanosecond, 1000);

    millisecond += Math.floor(microsecond / 1000);
    microsecond = ES.NonNegativeModulo(microsecond, 1000);

    const seconds = Math.floor(millisecond / 1000);
    millisecond = ES.NonNegativeModulo(millisecond, 1000);

    return { seconds, millisecond, microsecond, nanosecond };
  },
  BalanceTime: (hour, minute, second, millisecond, microsecond, nanosecond) => {
    if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(second)) {
      throw new RangeError('infinity is out of range');
    }

    let seconds;
    ({ seconds, millisecond, microsecond, nanosecond } = ES.BalanceSubSecond(millisecond, microsecond, nanosecond));

    second += seconds;

    minute += Math.floor(second / 60);
    second = ES.NonNegativeModulo(second, 60);

    hour += Math.floor(minute / 60);
    minute = ES.NonNegativeModulo(minute, 60);

    let deltaDays = Math.floor(hour / 24);
    hour = ES.NonNegativeModulo(hour, 24);

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
      nanosecond: nanoseconds
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
      case 'weeks':
      case 'days':
        break;
      default:
        throw new Error('assert not reached');
    }

    return { days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },

  ConstrainToRange: (value, min, max) => Math.min(max, Math.max(min, value)),
  ConstrainDate: (year, month, day) => {
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
  ConstrainDateTime: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    ({ year, month, day } = ES.ConstrainDate(year, month, day));
    ({ hour, minute, second, millisecond, microsecond, nanosecond } = ES.ConstrainTime(
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond
    ));
    return { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  },

  RejectToRange: (value, min, max) => {
    if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`);
  },
  RejectDate: (year, month, day) => {
    ES.RejectToRange(month, 1, 12);
    ES.RejectToRange(day, 1, ES.DaysInMonth(year, month));
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
    ES.RejectDate(year, month, day);
    ES.RejectTime(hour, minute, second, millisecond, microsecond, nanosecond);
  },
  RejectDateTimeRange: (year, month, day, hour, minute, second, millisecond, microsecond, nanosecond) => {
    ES.RejectToRange(year, YEAR_MIN, YEAR_MAX);
    // Reject any DateTime 24 hours or more outside the Absolute range
    if (
      (year === YEAR_MIN &&
        null ==
          ES.GetEpochFromParts(year, month, day + 1, hour, minute, second, millisecond, microsecond, nanosecond - 1)) ||
      (year === YEAR_MAX &&
        null ==
          ES.GetEpochFromParts(year, month, day - 1, hour, minute, second, millisecond, microsecond, nanosecond + 1))
    ) {
      throw new RangeError('DateTime outside of supported range');
    }
  },
  RejectAbsoluteRange: (epochNanoseconds) => {
    if (epochNanoseconds.lesser(NS_MIN) || epochNanoseconds.greater(NS_MAX)) {
      throw new RangeError('Absolute outside of supported range');
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

  DifferenceDate: (smaller, larger, largestUnit = 'days') => {
    let years = larger.year - smaller.year;
    let weeks = 0;
    let months, days;

    switch (largestUnit) {
      case 'years':
      case 'months': {
        months = larger.month - smaller.month;
        let year, month;
        ({ year, month, years, months } = ES.BalanceDurationDate(
          years,
          months,
          smaller.year,
          smaller.month,
          smaller.day
        ));
        days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);
        if (days < 0) {
          months -= 1;
          ({ year, month, years, months } = ES.BalanceDurationDate(
            years,
            months,
            smaller.year,
            smaller.month,
            smaller.day
          ));
          days = ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(year, month, smaller.day);
          if (larger.year > year) days += ES.LeapYear(year) ? 366 : 365;
        }
        if (largestUnit === 'months') {
          months += years * 12;
          years = 0;
        }
        break;
      }
      case 'weeks':
      case 'days':
        months = 0;
        days =
          ES.DayOfYear(larger.year, larger.month, larger.day) - ES.DayOfYear(smaller.year, smaller.month, smaller.day);
        while (years > 0) {
          days += ES.LeapYear(smaller.year + years - 1) ? 366 : 365;
          years -= 1;
        }
        if (largestUnit === 'weeks') {
          weeks = Math.floor(days / 7);
          days %= 7;
        }
        break;
      default:
        throw new Error('assert not reached');
    }
    return { years, months, weeks, days };
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
  AddDate: (year, month, day, years, months, weeks, days, disambiguation) => {
    year += years;
    month += months;
    ({ year, month } = ES.BalanceYearMonth(year, month));
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
    days += 7 * weeks;
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
  SubtractDate: (year, month, day, years, months, weeks, days, disambiguation) => {
    days += 7 * weeks;
    day -= days;
    ({ year, month, day } = ES.BalanceDate(year, month, day));
    month -= months;
    year -= years;
    ({ year, month } = ES.BalanceYearMonth(year, month));
    ({ year, month, day } = ES.RegulateDate(year, month, day, disambiguation));
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
    disambiguation
  ) => {
    let years = y1 + y2;
    let months = mon1 + mon2;
    let weeks = w1 + w2;
    let days = d1 + d2;
    let hours = h1 + h2;
    let minutes = min1 + min2;
    let seconds = s1 + s2;
    let milliseconds = ms1 + ms2;
    let microseconds = µs1 + µs2;
    let nanoseconds = ns1 + ns2;

    return ES.RegulateDuration(
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
      disambiguation
    );
  },
  SubtractDuration: (
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
    disambiguation
  ) => {
    let years = y1 - y2;
    let months = mon1 - mon2;
    let weeks = w1 - w2;
    let days = d1 - d2;
    let hours = h1 - h2;
    let minutes = min1 - min2;
    let seconds = s1 - s2;
    let milliseconds = ms1 - ms2;
    let microseconds = µs1 - µs2;
    let nanoseconds = ns1 - ns2;

    if (nanoseconds < 0) {
      microseconds += Math.floor(nanoseconds / 1000);
      nanoseconds = ES.NonNegativeModulo(nanoseconds, 1000);
    }
    if (microseconds < 0) {
      milliseconds += Math.floor(microseconds / 1000);
      microseconds = ES.NonNegativeModulo(microseconds, 1000);
    }
    if (milliseconds < 0) {
      seconds += Math.floor(milliseconds / 1000);
      milliseconds = ES.NonNegativeModulo(milliseconds, 1000);
    }
    if (seconds < 0) {
      minutes += Math.floor(seconds / 60);
      seconds = ES.NonNegativeModulo(seconds, 60);
    }
    if (minutes < 0) {
      hours += Math.floor(minutes / 60);
      minutes = ES.NonNegativeModulo(minutes, 60);
    }
    if (hours < 0) {
      days += Math.floor(hours / 24);
      hours = ES.NonNegativeModulo(hours, 24);
    }

    for (const prop of [years, months, weeks, days]) {
      if (prop < 0) throw new RangeError('negative values not allowed as duration fields');
    }

    if (disambiguation === 'balance') {
      return ES.RegulateDuration(
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
        'balance'
      );
    }

    return { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  },

  AssertPositiveInteger: (num) => {
    if (!Number.isFinite(num) || Math.abs(num) !== num) throw new RangeError(`invalid positive integer: ${num}`);
    return num;
  },
  NonNegativeModulo: (x, y) => {
    let result = x % y;
    if (Object.is(result, -0)) return 0;
    if (result < 0) result += y;
    return result;
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
          return bigInt(0);
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
      return result;
    };
  })(),
  SystemTimeZone: () => {
    const fmt = new IntlDateTimeFormat('en-us');
    const TemporalTimeZone = GetIntrinsic('%Temporal.TimeZone%');
    return new TemporalTimeZone(ES.TemporalTimeZoneFromString(fmt.resolvedOptions().timeZone));
  },
  ComparisonResult: (value) => (value < 0 ? -1 : value > 0 ? 1 : value),
  GetOption: (options, property, allowedValues, fallback) => {
    if (options === null || options === undefined) return fallback;
    options = ES.ToObject(options);
    let value = options[property];
    if (value !== undefined) {
      value = ES.ToString(value);
      if (!allowedValues.includes(value)) {
        throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`);
      }
      return value;
    }
    return fallback;
  }
});

const OFFSET = new RegExp(`^${PARSE.offset.source}$`);

function parseOffsetString(string) {
  const match = OFFSET.exec(String(string));
  if (!match) return null;
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  return sign * (hours * 60 + minutes) * 60 * 1e9;
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
    } else if (mstate === rstate) {
      right = middle;
      rstate = mstate;
    } else {
      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`);
    }
  }
  return right;
}
