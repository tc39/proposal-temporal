/* global __debug__ */

import * as ES from './ecmascript.mjs';
import { GetIntrinsic, MakeIntrinsicClass, DefineIntrinsic } from './intrinsicclass.mjs';
import { TimeZoneMethodRecord } from './methodrecord.mjs';
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
  constructor(identifier) {
    let stringIdentifier = ES.RequireString(identifier);
    const parseResult = ES.ParseTimeZoneIdentifier(identifier);
    if (parseResult.offsetMinutes !== undefined) {
      stringIdentifier = ES.FormatOffsetTimeZoneIdentifier(parseResult.offsetMinutes);
    } else {
      const record = ES.GetAvailableNamedTimeZoneIdentifier(stringIdentifier);
      if (!record) throw new RangeError(`Invalid time zone identifier: ${stringIdentifier}`);
      stringIdentifier = record.identifier;
    }
    CreateSlots(this);
    SetSlot(this, TIMEZONE_ID, stringIdentifier);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `Temporal.TimeZone <${stringIdentifier}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get id() {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIMEZONE_ID);
  }
  equals(other) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    const timeZoneSlotValue = ES.ToTemporalTimeZoneSlotValue(other);
    return ES.TimeZoneEquals(this, timeZoneSlotValue);
  }
  getOffsetNanosecondsFor(instant) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    instant = ES.ToTemporalInstant(instant);
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetMinutes = ES.ParseTimeZoneIdentifier(id).offsetMinutes;
    if (offsetMinutes !== undefined) return offsetMinutes * 60e9;

    return ES.GetNamedTimeZoneOffsetNanoseconds(id, GetSlot(instant, EPOCHNANOSECONDS));
  }
  getOffsetStringFor(instant) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    instant = ES.ToTemporalInstant(instant);
    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor']);
    return ES.GetOffsetStringFor(timeZoneRec, instant);
  }
  getPlainDateTimeFor(instant, calendar = 'iso8601') {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    instant = ES.ToTemporalInstant(instant);
    calendar = ES.ToTemporalCalendarSlotValue(calendar);
    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor']);
    return ES.GetPlainDateTimeFor(timeZoneRec, instant, calendar);
  }
  getInstantFor(dateTime, options = undefined) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    dateTime = ES.ToTemporalDateTime(dateTime);
    options = ES.GetOptionsObject(options);
    const disambiguation = ES.GetTemporalDisambiguationOption(options);
    const timeZoneRec = new TimeZoneMethodRecord(this, ['getOffsetNanosecondsFor', 'getPossibleInstantsFor']);
    return ES.GetInstantFor(timeZoneRec, dateTime, disambiguation);
  }
  getPossibleInstantsFor(dateTime) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    dateTime = ES.ToTemporalDateTime(dateTime);
    const Instant = GetIntrinsic('%Temporal.Instant%');
    const id = GetSlot(this, TIMEZONE_ID);

    const offsetMinutes = ES.ParseTimeZoneIdentifier(id).offsetMinutes;
    if (offsetMinutes !== undefined) {
      const epochNs = ES.GetUTCEpochNanoseconds(
        GetSlot(dateTime, ISO_YEAR),
        GetSlot(dateTime, ISO_MONTH),
        GetSlot(dateTime, ISO_DAY),
        GetSlot(dateTime, ISO_HOUR),
        GetSlot(dateTime, ISO_MINUTE),
        GetSlot(dateTime, ISO_SECOND),
        GetSlot(dateTime, ISO_MILLISECOND),
        GetSlot(dateTime, ISO_MICROSECOND),
        GetSlot(dateTime, ISO_NANOSECOND),
        offsetMinutes * 60e9
      );
      return [new Instant(epochNs)];
    }

    const possibleEpochNs = ES.GetNamedTimeZoneEpochNanoseconds(
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
    startingPoint = ES.ToTemporalInstant(startingPoint);
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (ES.IsOffsetTimeZoneIdentifier(id) || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant = GetIntrinsic('%Temporal.Instant%');
    epochNanoseconds = ES.GetNamedTimeZoneNextTransition(id, epochNanoseconds);
    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
  }
  getPreviousTransition(startingPoint) {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    startingPoint = ES.ToTemporalInstant(startingPoint);
    const id = GetSlot(this, TIMEZONE_ID);

    // Offset time zones or UTC have no transitions
    if (ES.IsOffsetTimeZoneIdentifier(id) || id === 'UTC') {
      return null;
    }

    let epochNanoseconds = GetSlot(startingPoint, EPOCHNANOSECONDS);
    const Instant = GetIntrinsic('%Temporal.Instant%');
    epochNanoseconds = ES.GetNamedTimeZonePreviousTransition(id, epochNanoseconds);
    return epochNanoseconds === null ? null : new Instant(epochNanoseconds);
  }
  toString() {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIMEZONE_ID);
  }
  toJSON() {
    if (!ES.IsTemporalTimeZone(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, TIMEZONE_ID);
  }
  static from(item) {
    const timeZoneSlotValue = ES.ToTemporalTimeZoneSlotValue(item);
    return ES.ToTemporalTimeZoneObject(timeZoneSlotValue);
  }
}

MakeIntrinsicClass(TimeZone, 'Temporal.TimeZone');
DefineIntrinsic('Temporal.TimeZone.prototype.getOffsetNanosecondsFor', TimeZone.prototype.getOffsetNanosecondsFor);
DefineIntrinsic('Temporal.TimeZone.prototype.getPossibleInstantsFor', TimeZone.prototype.getPossibleInstantsFor);
