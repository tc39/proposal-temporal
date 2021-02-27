/* global __debug__ */

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

export class TimeZone {
  constructor(timeZoneIdentifier) {
    // Note: if the argument is not passed, GetCanonicalTimeZoneIdentifier(undefined) will throw.
    //       This check exists only to improve the error message.
    if (arguments.length < 1) {
      throw new RangeError('missing argument: identifier is required');
    }

    timeZoneIdentifier = ES.GetCanonicalTimeZoneIdentifier(timeZoneIdentifier);
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
    return ES.ToString(this);
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
  getPlainDateTimeFor(instant, calendar = ES.GetISO8601Calendar()) {
    instant = ES.ToTemporalInstant(instant, GetIntrinsic('%Temporal.Instant%'));
    calendar = ES.ToTemporalCalendar(calendar);

    const ns = GetSlot(instant, EPOCHNANOSECONDS);
    const offsetNs = ES.GetOffsetNanosecondsFor(this, instant);
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
    const DateTime = GetIntrinsic('%Temporal.PlainDateTime%');
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  getInstantFor(dateTime, options = undefined) {
    dateTime = ES.ToTemporalDateTime(dateTime, GetIntrinsic('%Temporal.PlainDateTime%'));
    options = ES.NormalizeOptionsObject(options);
    const disambiguation = ES.ToTemporalDisambiguation(options);

    const Instant = GetIntrinsic('%Temporal.Instant%');
    const possibleInstants = ES.GetPossibleInstantsFor(this, dateTime);
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

    const utcns = ES.GetEpochFromISOParts(
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
      const epochNs = ES.GetEpochFromISOParts(
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
    return ES.ToString(this);
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
DefineIntrinsic('Temporal.TimeZone.prototype.getPlainDateTimeFor', TimeZone.prototype.getPlainDateTimeFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getInstantFor', TimeZone.prototype.getInstantFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetStringFor', TimeZone.prototype.getOffsetStringFor);
