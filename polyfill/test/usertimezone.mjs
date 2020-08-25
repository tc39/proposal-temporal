#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { after, before, describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';

// FIXME: add tests to make sure these cases work with LocalDateTime

describe('Userland time zone', () => {
  describe('Trivial subclass', () => {
    class CustomUTCSubclass extends Temporal.TimeZone {
      constructor() {
        super('Etc/Custom_UTC_Subclass');
      }
      getOffsetNanosecondsFor(/* absolute */) {
        return 0;
      }
      getPossibleAbsolutesFor(dateTime) {
        const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
        const dayNum = MakeDay(year, month, day);
        const time = MakeTime(hour, minute, second, millisecond, microsecond, nanosecond);
        const epochNs = MakeDate(dayNum, time);
        return [new Temporal.Absolute(epochNs)];
      }
      getNextTransition(/* absolute */) {
        return null;
      }
      getPreviousTransition(/* absolute */) {
        return null;
      }
    }

    const obj = new CustomUTCSubclass();
    const abs = Temporal.Absolute.fromEpochNanoseconds(0n);
    const dt = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);

    it('is a time zone', () => equal(typeof obj, 'object'));
    it('.name property', () => equal(obj.name, 'Etc/Custom_UTC_Subclass'));
    // FIXME: what should happen in Temporal.TimeZone.from(obj)?
    it('.name is not available in from()', () => {
      throws(() => Temporal.TimeZone.from('Etc/Custom_UTC_Subclass'), RangeError);
      throws(() => Temporal.TimeZone.from('2020-05-26T16:02:46.251163036+00:00[Etc/Custom_UTC_Subclass]'), RangeError);
    });
    it('has offset string +00:00', () => equal(obj.getOffsetStringFor(abs), '+00:00'));
    it('converts to DateTime', () => {
      equal(`${obj.getDateTimeFor(abs)}`, '1970-01-01T00:00');
      equal(`${abs.toDateTime(obj)}`, '1970-01-01T00:00');
    });
    it('converts to Absolute', () => {
      equal(`${obj.getAbsoluteFor(dt)}`, '1976-11-18T15:23:30.123456789Z');
      equal(`${dt.toAbsolute(obj)}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('converts to string', () => equal(`${obj}`, obj.name));
    it('has no next transitions', () => assert.equal(obj.getNextTransition(), null));
    it('has no previous transitions', () => assert.equal(obj.getPreviousTransition(), null));
    it('works in Temporal.now', () => {
      assert(Temporal.now.dateTime(obj) instanceof Temporal.DateTime);
      assert(Temporal.now.date(obj) instanceof Temporal.Date);
      assert(Temporal.now.time(obj) instanceof Temporal.Time);
    });
    describe('Making available globally', () => {
      const originalTemporalTimeZoneFrom = Temporal.TimeZone.from;
      before(() => {
        Temporal.TimeZone.from = function (item) {
          let id;
          if (item instanceof Temporal.TimeZone) {
            id = item.name;
          } else {
            id = `${item}`;
            // TODO: Use Temporal.parse here to extract the ID from an ISO string
          }
          if (id === 'Etc/Custom_UTC_Subclass') return new CustomUTCSubclass();
          return originalTemporalTimeZoneFrom.call(this, id);
        };
      });
      it('works for TimeZone.from(id)', () => {
        const tz = Temporal.TimeZone.from('Etc/Custom_UTC_Subclass');
        assert(tz instanceof CustomUTCSubclass);
      });
      it.skip('works for TimeZone.from(ISO string)', () => {
        const tz = Temporal.TimeZone.from('1970-01-01T00:00+00:00[Etc/Custom_UTC_Subclass]');
        assert(tz instanceof CustomUTCSubclass);
      });
      it('works for Absolute.from', () => {
        const abs = Temporal.Absolute.from('1970-01-01T00:00+00:00[Etc/Custom_UTC_Subclass]');
        equal(`${abs}`, '1970-01-01T00:00Z');
      });
      it('works for Absolute.toDateTime', () => {
        const abs = Temporal.Absolute.fromEpochSeconds(0);
        equal(`${abs.toDateTime('Etc/Custom_UTC_Subclass')}`, '1970-01-01T00:00');
      });
      it('works for DateTime.toAbsolute', () => {
        const dt = Temporal.DateTime.from('1970-01-01T00:00');
        equal(dt.toAbsolute('Etc/Custom_UTC_Subclass').getEpochSeconds(), 0);
      });
      it('works for Temporal.now', () => {
        assert(Temporal.now.dateTime('Etc/Custom_UTC_Subclass') instanceof Temporal.DateTime);
        assert(Temporal.now.date('Etc/Custom_UTC_Subclass') instanceof Temporal.Date);
        assert(Temporal.now.time('Etc/Custom_UTC_Subclass') instanceof Temporal.Time);
      });
      after(() => {
        Temporal.TimeZone.from = originalTemporalTimeZoneFrom;
      });
    });
  });
  describe('Trivial protocol implementation', () => {
    const obj = {
      getOffsetNanosecondsFor(/* absolute */) {
        return 0;
      },
      getPossibleAbsolutesFor(dateTime) {
        const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = dateTime;
        const dayNum = MakeDay(year, month, day);
        const time = MakeTime(hour, minute, second, millisecond, microsecond, nanosecond);
        const epochNs = MakeDate(dayNum, time);
        return [new Temporal.Absolute(epochNs)];
      },
      toString() {
        return 'Etc/Custom_UTC_Protocol';
      }
    };

    const abs = Temporal.Absolute.fromEpochNanoseconds(0n);
    const dt = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);

    it('has offset string +00:00', () =>
      equal(Temporal.TimeZone.prototype.getOffsetStringFor.call(obj, abs), '+00:00'));
    it('converts to DateTime', () => {
      equal(`${Temporal.TimeZone.prototype.getDateTimeFor.call(obj, abs)}`, '1970-01-01T00:00');
      equal(`${abs.toDateTime(obj)}`, '1970-01-01T00:00');
    });
    it('converts to Absolute', () => {
      equal(`${Temporal.TimeZone.prototype.getAbsoluteFor.call(obj, dt)}`, '1976-11-18T15:23:30.123456789Z');
      equal(`${dt.toAbsolute(obj)}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('works in Temporal.now', () => {
      assert(Temporal.now.dateTime(obj) instanceof Temporal.DateTime);
      assert(Temporal.now.date(obj) instanceof Temporal.Date);
      assert(Temporal.now.time(obj) instanceof Temporal.Time);
    });
    describe('Making available globally', () => {
      const originalTemporalTimeZoneFrom = Temporal.TimeZone.from;
      before(() => {
        Temporal.TimeZone.from = function (item) {
          let id;
          if (item instanceof Temporal.TimeZone) {
            id = item.name;
          } else {
            id = `${item}`;
            // TODO: Use Temporal.parse here to extract the ID from an ISO string
          }
          if (id === 'Etc/Custom_UTC_Protocol') return obj;
          return originalTemporalTimeZoneFrom.call(this, id);
        };
      });
      it('works for TimeZone.from(id)', () => {
        const tz = Temporal.TimeZone.from('Etc/Custom_UTC_Protocol');
        assert(Object.is(tz, obj));
      });
      it.skip('works for TimeZone.from(ISO string)', () => {
        const tz = Temporal.TimeZone.from('1970-01-01T00:00+00:00[Etc/Custom_UTC_Protocol]');
        assert(Object.is(tz, obj));
      });
      it('works for Absolute.from', () => {
        const abs = Temporal.Absolute.from('1970-01-01T00:00+00:00[Etc/Custom_UTC_Protocol]');
        equal(`${abs}`, '1970-01-01T00:00Z');
      });
      it('works for Absolute.toDateTime', () => {
        const abs = Temporal.Absolute.fromEpochSeconds(0);
        equal(`${abs.toDateTime('Etc/Custom_UTC_Protocol')}`, '1970-01-01T00:00');
      });
      it('works for DateTime.toAbsolute', () => {
        const dt = Temporal.DateTime.from('1970-01-01T00:00');
        equal(dt.toAbsolute('Etc/Custom_UTC_Protocol').getEpochSeconds(), 0);
      });
      it('works for Temporal.now', () => {
        assert(Temporal.now.dateTime('Etc/Custom_UTC_Protocol') instanceof Temporal.DateTime);
        assert(Temporal.now.date('Etc/Custom_UTC_Protocol') instanceof Temporal.Date);
        assert(Temporal.now.time('Etc/Custom_UTC_Protocol') instanceof Temporal.Time);
      });
      after(() => {
        Temporal.TimeZone.from = originalTemporalTimeZoneFrom;
      });
    });
  });
});

const nsPerDay = 86400_000_000_000n;
const nsPerMillisecond = 1_000_000n;

function Day(t) {
  return t / nsPerDay;
}

function MakeDate(day, time) {
  return day * nsPerDay + time;
}

function MakeDay(year, month, day) {
  const m = month - 1;
  const ym = year + Math.floor(m / 12);
  const mn = m % 12;
  const t = BigInt(Date.UTC(ym, mn, 1)) * nsPerMillisecond;
  return Day(t) + BigInt(day) - 1n;
}

function MakeTime(h, min, s, ms, µs, ns) {
  const MinutesPerHour = 60n;
  const SecondsPerMinute = 60n;
  const nsPerSecond = 1_000_000_000n;
  const nsPerMinute = nsPerSecond * SecondsPerMinute;
  const nsPerHour = nsPerMinute * MinutesPerHour;
  return (
    BigInt(h) * nsPerHour +
    BigInt(min) * nsPerMinute +
    BigInt(s) * nsPerSecond +
    BigInt(ms) * nsPerMillisecond +
    BigInt(µs) * 1000n +
    BigInt(ns)
  );
}

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
