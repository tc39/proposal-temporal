/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import {
  TIMEZONE_ID,
  EPOCHNANOSECONDS,
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

import * as REGEX from './regex.mjs';
const OFFSET = new RegExp(`^${REGEX.offset.source}$`);

function parseOffsetString(string) {
  const match = OFFSET.exec(String(string));
  if (!match) return null;
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1;
  const hours = +match[2];
  const minutes = +(match[3] || 0);
  return sign * (hours * 60 + minutes) * 60 * 1e9;
}

export class TimeZone {
  constructor(timeZoneIdentifier) {
    if (new.target === TimeZone) {
      timeZoneIdentifier = ES.GetCanonicalTimeZoneIdentifier(timeZoneIdentifier);
    }
    CreateSlots(this);
    SetSlot(this, TIMEZONE_ID, timeZoneIdentifier);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get name() {
    return ES.TimeZoneToString(this);
  }
  getOffsetNanosecondsFor(absolute) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalAbsolute(absolute)) throw new TypeError('invalid Absolute object');
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetNs = parseOffsetString(id);
    if (offsetNs !== null) return offsetNs;

    return ES.GetIANATimeZoneOffsetNanoseconds(GetSlot(absolute, EPOCHNANOSECONDS), id);
  }
  getOffsetStringFor(absolute) {
    if (!ES.IsTemporalAbsolute(absolute)) throw new TypeError('invalid Absolute object');
    const offsetNs = ES.GetOffsetNanosecondsFor(this, absolute);
    return ES.FormatTimeZoneOffsetString(offsetNs);
  }
  getDateTimeFor(absolute, calendar = GetDefaultCalendar()) {
    if (!ES.IsTemporalAbsolute(absolute)) throw new TypeError('invalid Absolute object');
    calendar = ES.ToTemporalCalendar(calendar);

    const ns = GetSlot(absolute, EPOCHNANOSECONDS);
    const offsetNs = ES.GetOffsetNanosecondsFor(this, absolute);
    let { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.GetPartsFromEpoch(ns);
    ({ year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = ES.BalanceDateTime(
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
    const DateTime = GetIntrinsic('%Temporal.DateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  getAbsoluteFor(dateTime, options) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid DateTime object');
    const disambiguation = ES.ToTimeZoneTemporalDisambiguation(options);

    const Absolute = GetIntrinsic('%Temporal.Absolute%');
    const possibleAbsolutes = this.getPossibleAbsolutesFor(dateTime);
    if (!Array.isArray(possibleAbsolutes)) {
      throw new TypeError('bad return from getPossibleAbsolutesFor');
    }
    const numAbsolutes = possibleAbsolutes.length;

    function validateAbsolute(absolute) {
      if (!ES.IsTemporalAbsolute(absolute)) {
        throw new TypeError('bad return from getPossibleAbsolutesFor');
      }
      return absolute;
    }

    if (numAbsolutes === 1) return validateAbsolute(possibleAbsolutes[0]);
    if (numAbsolutes) {
      switch (disambiguation) {
        case 'compatible':
        // fall through because 'compatible' means 'earlier' for "fall back" transitions
        case 'earlier':
          return validateAbsolute(possibleAbsolutes[0]);
        case 'later':
          return validateAbsolute(possibleAbsolutes[numAbsolutes - 1]);
        case 'reject': {
          throw new RangeError('multiple absolute found');
        }
      }
    }

    const utcns = ES.GetEpochFromParts(
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, HOUR),
      GetSlot(dateTime, MINUTE),
      GetSlot(dateTime, SECOND),
      GetSlot(dateTime, MILLISECOND),
      GetSlot(dateTime, MICROSECOND),
      GetSlot(dateTime, NANOSECOND)
    );
    if (utcns === null) throw new RangeError('DateTime outside of supported range');
    const dayBefore = new Absolute(utcns.minus(86400e9));
    const dayAfter = new Absolute(utcns.plus(86400e9));
    const offsetBefore = this.getOffsetNanosecondsFor(dayBefore);
    const offsetAfter = this.getOffsetNanosecondsFor(dayAfter);
    const nanoseconds = offsetAfter - offsetBefore;
    const diff = ES.ToTemporalDurationRecord({ nanoseconds }, 'reject');
    switch (disambiguation) {
      case 'earlier': {
        const earlier = dateTime.minus(diff);
        return this.getPossibleAbsolutesFor(earlier)[0];
      }
      case 'compatible':
      // fall through because 'compatible' means 'later' for "spring forward" transitions
      case 'later': {
        const later = dateTime.plus(diff);
        const possible = this.getPossibleAbsolutesFor(later);
        return possible[possible.length - 1];
      }
      case 'reject': {
        throw new RangeError('no such absolute found');
      }
    }
  }
  getPossibleAbsolutesFor(dateTime) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid DateTime object');
    const Absolute = GetIntrinsic('%Temporal.Absolute%');
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetNs = parseOffsetString(id);
    if (offsetNs !== null) {
      const epochNs = ES.GetEpochFromParts(
        GetSlot(dateTime, ISO_YEAR),
        GetSlot(dateTime, ISO_MONTH),
        GetSlot(dateTime, ISO_DAY),
        GetSlot(dateTime, HOUR),
        GetSlot(dateTime, MINUTE),
        GetSlot(dateTime, SECOND),
        GetSlot(dateTime, MILLISECOND),
        GetSlot(dateTime, MICROSECOND),
        GetSlot(dateTime, NANOSECOND)
      );
      if (epochNs === null) throw new RangeError('DateTime outside of supported range');
      return [new Absolute(epochNs.minus(offsetNs))];
    }

    const possibleEpochNs = ES.GetIANATimeZoneEpochValue(
      id,
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, HOUR),
      GetSlot(dateTime, MINUTE),
      GetSlot(dateTime, SECOND),
      GetSlot(dateTime, MILLISECOND),
      GetSlot(dateTime, MICROSECOND),
      GetSlot(dateTime, NANOSECOND)
    );
    return possibleEpochNs.map((ns) => new Absolute(ns));
  }
  getNextTransition(startingPoint) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalAbsolute(startingPoint)) throw new TypeError('invalid Absolute object');
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (parseOffsetString(id) !== null || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Absolute = GetIntrinsic('%Temporal.Absolute%');
    epochNanoseconds = ES.GetIANATimeZoneNextTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Absolute(epochNanoseconds);
  }
  getPreviousTransition(startingPoint) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalAbsolute(startingPoint)) throw new TypeError('invalid Absolute object');
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (parseOffsetString(id) !== null || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Absolute = GetIntrinsic('%Temporal.Absolute%');
    epochNanoseconds = ES.GetIANATimeZonePreviousTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Absolute(epochNanoseconds);
  }
  toString() {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    return String(GetSlot(this, TIMEZONE_ID));
  }
  toJSON() {
    return this.toString();
  }
  static from(item) {
    if (typeof item === 'object' && item) return item;
    const timeZone = ES.TemporalTimeZoneFromString(ES.ToString(item));
    const result = new this(timeZone);
    if (!ES.IsTemporalTimeZone(result)) throw new TypeError('invalid result');
    return result;
  }
}

MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
DefineIntrinsic('Temporal.TimeZone.from', TimeZone.from);
DefineIntrinsic('Temporal.TimeZone.prototype.getDateTimeFor', TimeZone.prototype.getDateTimeFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getAbsoluteFor', TimeZone.prototype.getAbsoluteFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetStringFor', TimeZone.prototype.getOffsetStringFor);
DefineIntrinsic('Temporal.TimeZone.prototype.toString', TimeZone.prototype.toString);
