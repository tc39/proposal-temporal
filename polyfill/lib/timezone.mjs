/* global __debug__ */

import { GetISO8601Calendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import {
  TIMEZONE_ID,
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
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

import * as REGEX from './regex.mjs';
const OFFSET = new RegExp(`^${REGEX.offset.source}$`);
const IANA_NAME = new RegExp(`^${REGEX.timeZoneID.source}$`);

export class TimeZone {
  constructor(timeZoneIdentifier) {
    if (new.target === TimeZone) {
      timeZoneIdentifier = ES.GetCanonicalTimeZoneIdentifier(timeZoneIdentifier);
    }
    if (!OFFSET.exec(timeZoneIdentifier) && !IANA_NAME.exec(timeZoneIdentifier)) {
      throw new RangeError(`invalid time zone identifier ${timeZoneIdentifier}`);
    }
    CreateSlots(this);
    SetSlot(this, TIMEZONE_ID, timeZoneIdentifier);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${timeZoneIdentifier}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    return ES.TimeZoneToString(this);
  }
  getOffsetNanosecondsFor(instant) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    instant = ES.ToTemporalInstant(instant, GetIntrinsic('%Temporal.Instant%'));
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetNs = ES.ParseOffsetString(id);
    if (offsetNs !== null) return offsetNs;

    return ES.GetIANATimeZoneOffsetNanoseconds(GetSlot(instant, EPOCHNANOSECONDS), id);
  }
  getOffsetStringFor(instant) {
    instant = ES.ToTemporalInstant(instant, GetIntrinsic('%Temporal.Instant%'));
    const offsetNs = ES.GetOffsetNanosecondsFor(this, instant);
    return ES.FormatTimeZoneOffsetString(offsetNs);
  }
  getDateTimeFor(instant, calendar = GetISO8601Calendar()) {
    instant = ES.ToTemporalInstant(instant, GetIntrinsic('%Temporal.Instant%'));
    calendar = ES.ToTemporalCalendar(calendar);

    const ns = GetSlot(instant, EPOCHNANOSECONDS);
    const offsetNs = ES.GetOffsetNanosecondsFor(this, instant);
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
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  getInstantFor(dateTime, options = undefined) {
    dateTime = ES.ToTemporalDateTime(dateTime, GetIntrinsic('%Temporal.PlainDateTime%'));
    options = ES.NormalizeOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);

    const Instant = GetIntrinsic('%Temporal.Instant%');
    const possibleInstants = this.getPossibleInstantsFor(dateTime);
    if (!Array.isArray(possibleInstants)) {
      throw new TypeError('bad return from getPossibleInstantsFor');
    }
    const numInstants = possibleInstants.length;

    function validateInstant(instant) {
      if (!ES.IsTemporalInstant(instant)) {
        throw new TypeError('bad return from getPossibleInstantsFor');
      }
      return instant;
    }

    if (numInstants === 1) return validateInstant(possibleInstants[0]);
    if (numInstants) {
      switch (disambiguation) {
        case 'compatible':
        // fall through because 'compatible' means 'earlier' for "fall back" transitions
        case 'earlier':
          return validateInstant(possibleInstants[0]);
        case 'later':
          return validateInstant(possibleInstants[numInstants - 1]);
        case 'reject': {
          throw new RangeError('multiple instants found');
        }
      }
    }

    const utcns = ES.GetEpochFromParts(
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, ISO_HOUR),
      GetSlot(dateTime, ISO_MINUTE),
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND)
    );
    if (utcns === null) throw new RangeError('DateTime outside of supported range');
    const dayBefore = new Instant(utcns.minus(86400e9));
    const dayAfter = new Instant(utcns.plus(86400e9));
    const offsetBefore = this.getOffsetNanosecondsFor(dayBefore);
    const offsetAfter = this.getOffsetNanosecondsFor(dayAfter);
    const nanoseconds = offsetAfter - offsetBefore;
    const diff = ES.ToTemporalDurationRecord({ nanoseconds }, 'reject');
    switch (disambiguation) {
      case 'earlier': {
        const earlier = dateTime.subtract(diff);
        return this.getPossibleInstantsFor(earlier)[0];
      }
      case 'compatible':
      // fall through because 'compatible' means 'later' for "spring forward" transitions
      case 'later': {
        const later = dateTime.add(diff);
        const possible = this.getPossibleInstantsFor(later);
        return possible[possible.length - 1];
      }
      case 'reject': {
        throw new RangeError('no such instant found');
      }
    }
  }
  getPossibleInstantsFor(dateTime) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    dateTime = ES.ToTemporalDateTime(dateTime, GetIntrinsic('%Temporal.PlainDateTime%'));
    const Instant = GetIntrinsic('%Temporal.Instant%');
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetNs = ES.ParseOffsetString(id);
    if (offsetNs !== null) {
      const epochNs = ES.GetEpochFromParts(
        GetSlot(dateTime, ISO_YEAR),
        GetSlot(dateTime, ISO_MONTH),
        GetSlot(dateTime, ISO_DAY),
        GetSlot(dateTime, ISO_HOUR),
        GetSlot(dateTime, ISO_MINUTE),
        GetSlot(dateTime, ISO_SECOND),
        GetSlot(dateTime, ISO_MILLISECOND),
        GetSlot(dateTime, ISO_MICROSECOND),
        GetSlot(dateTime, ISO_NANOSECOND)
      );
      if (epochNs === null) throw new RangeError('DateTime outside of supported range');
      return [new Instant(epochNs.minus(offsetNs))];
    }

    const possibleEpochNs = ES.GetIANATimeZoneEpochValue(
      id,
      GetSlot(dateTime, ISO_YEAR),
      GetSlot(dateTime, ISO_MONTH),
      GetSlot(dateTime, ISO_DAY),
      GetSlot(dateTime, ISO_HOUR),
      GetSlot(dateTime, ISO_MINUTE),
      GetSlot(dateTime, ISO_SECOND),
      GetSlot(dateTime, ISO_MILLISECOND),
      GetSlot(dateTime, ISO_MICROSECOND),
      GetSlot(dateTime, ISO_NANOSECOND)
    );
    return possibleEpochNs.map((ns) => new Instant(ns));
  }
  getNextTransition(startingPoint) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    startingPoint = ES.ToTemporalInstant(startingPoint, GetIntrinsic('%Temporal.Instant%'));
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (ES.ParseOffsetString(id) !== null || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant = GetIntrinsic('%Temporal.Instant%');
    epochNanoseconds = ES.GetIANATimeZoneNextTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
  }
  getPreviousTransition(startingPoint) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    startingPoint = ES.ToTemporalInstant(startingPoint, GetIntrinsic('%Temporal.Instant%'));
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (ES.ParseOffsetString(id) !== null || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant = GetIntrinsic('%Temporal.Instant%');
    epochNanoseconds = ES.GetIANATimeZonePreviousTransition(epochNanoseconds, id);
    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
  }
  toString() {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    return String(GetSlot(this, TIMEZONE_ID));
  }
  toJSON() {
    return ES.TimeZoneToString(this);
  }
  static from(item) {
    if (ES.Type(item) === 'Object') {
      if (!('timeZone' in item)) return item;
      item = item.timeZone;
      if (ES.Type(item) === 'Object' && !('timeZone' in item)) return item;
    }
    const timeZone = ES.TemporalTimeZoneFromString(ES.ToString(item));
    const result = new this(timeZone);
    if (!ES.IsTemporalTimeZone(result)) throw new TypeError('invalid result');
    return result;
  }
}

MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
DefineIntrinsic('Temporal.TimeZone.from', TimeZone.from);
DefineIntrinsic('Temporal.TimeZone.prototype.getDateTimeFor', TimeZone.prototype.getDateTimeFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getInstantFor', TimeZone.prototype.getInstantFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetStringFor', TimeZone.prototype.getOffsetStringFor);
DefineIntrinsic('Temporal.TimeZone.prototype.toString', TimeZone.prototype.toString);
