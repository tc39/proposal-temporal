#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { DateTime, LocalDateTime } = Temporal;

describe('LocalDateTime', () => {
  const tz = new Temporal.TimeZone('America/Los_Angeles');
  // const dstEnd = LocalDateTime.from({ ...new DateTime(2020, 11, 1, 2).getFields(), timeZone: tz });
  const hourBeforeDstStart = LocalDateTime.from({ ...new DateTime(2020, 3, 8, 1).getFields(), timeZone: tz });
  const dayBeforeDstStart = LocalDateTime.from({ ...new DateTime(2020, 3, 7, 2, 30).getFields(), timeZone: tz });

  describe('toLocalDateTime() on other Temporal objects', () => {
    it('Date.toLocalDateTime() works', () => {
      const date = Temporal.Date.from('2020-01-01');
      const time = Temporal.Time.from('12:00');
      const ldt = date.toLocalDateTime('America/Los_Angeles', time);
      equal(ldt.toString(), '2020-01-01T12:00-08:00[America/Los_Angeles]');
    });
    it('Date.toLocalDateTime() works with time omitted', () => {
      const date = Temporal.Date.from('2020-01-01');
      const ldt = date.toLocalDateTime('America/Los_Angeles');
      equal(ldt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('Date.toLocalDateTime() works with disambiguation option', () => {
      const date = Temporal.Date.from('2020-03-08');
      const time = Temporal.Time.from('02:00');
      const ldt = date.toLocalDateTime('America/Los_Angeles', time, { disambiguation: 'earlier' });
      equal(ldt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('Time.toLocalDateTime works', () => {
      const date = Temporal.Date.from('2020-01-01');
      const time = Temporal.Time.from('12:00');
      const ldt = time.toLocalDateTime('America/Los_Angeles', date);
      equal(ldt.toString(), '2020-01-01T12:00-08:00[America/Los_Angeles]');
    });
    it('Time.toLocalDateTime() works with disambiguation option', () => {
      const date = Temporal.Date.from('2020-03-08');
      const time = Temporal.Time.from('02:00');
      const ldt = time.toLocalDateTime('America/Los_Angeles', date, { disambiguation: 'earlier' });
      equal(ldt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('Instant.toLocalDateTime works', () => {
      const instant = Temporal.Instant.from('2020-01-01T00:00-08:00');
      const ldt = instant.toLocalDateTime('America/Los_Angeles');
      equal(ldt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('DateTime.toLocalDateTime works', () => {
      const dt = Temporal.DateTime.from('2020-01-01T00:00');
      const ldt = dt.toLocalDateTime('America/Los_Angeles');
      equal(ldt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('DateTime.toLocalDateTime works with disambiguation option', () => {
      const dt = Temporal.DateTime.from('2020-03-08T02:00');
      const ldt = dt.toLocalDateTime('America/Los_Angeles', { disambiguation: 'earlier' });
      equal(ldt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
  });

  describe('string parsing', () => {
    it('parses with an IANA zone', () => {
      const ldt = Temporal.LocalDateTime.from('2020-03-08T01:00-08:00[America/Los_Angeles]');
      equal(ldt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('parses with an offset in brackets', () => {
      const ldt = Temporal.LocalDateTime.from('2020-03-08T01:00-08:00[-08:00]');
      equal(ldt.toString(), '2020-03-08T01:00-08:00[-08:00]');
    });
    it('parses with "Z" used as an offset', () => {
      const iso = '2020-03-08T01:00-08:00[America/Los_Angeles]';
      const instant = Temporal.LocalDateTime.from(iso).toInstant();
      equal(instant.toString(), '2020-03-08T09:00Z');
      const ldt = Temporal.LocalDateTime.from(`${instant.toString()}[America/Los_Angeles]`);
      equal(ldt.toString(), iso);
    });
    it('throws if no brackets', () => {
      throws(() => Temporal.LocalDateTime.from('2020-03-08T01:00-08:00'));
    });
    it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
      throws(() => Temporal.LocalDateTime.from('2020-03-08T01:00-04:00[-08:00]', { offset: 'reject' }));
    });
    it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
      throws(() => Temporal.LocalDateTime.from('2020-03-08T01:00-04:00[America/Chicago]', { offset: 'reject' }));
    });
    it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
      const ldt = Temporal.LocalDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(ldt.toString(), '2020-11-01T01:30-07:00[America/Los_Angeles]');
    });
    it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
      const ldt = Temporal.LocalDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(ldt.toString(), '2020-11-01T01:30-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'prefer' } if offset does not match time zone", () => {
      const ldt = Temporal.LocalDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(ldt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'ignore' } uses time zone only", () => {
      const ldt = Temporal.LocalDateTime.from('2020-11-01T04:00-12:00[America/Los_Angeles]', { offset: 'ignore' });
      equal(ldt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'use' } uses offset only", () => {
      const ldt = Temporal.LocalDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'use' });
      equal(ldt.toString(), '2020-11-01T03:00-08:00[America/Los_Angeles]');
    });
  });

  describe('properties around DST', () => {
    it('hoursInDay works with DST start', () => {
      equal(hourBeforeDstStart.hoursInDay, 23);
    });
    it('hoursInDay works with non-DST days', () => {
      equal(dayBeforeDstStart.hoursInDay, 24);
    });
    it('hoursInDay works with DST end', () => {
      const dstEnd = LocalDateTime.from('2020-11-01T01:00-08:00[America/Los_Angeles]');
      equal(dstEnd.hoursInDay, 25);
    });
    it('hoursInDay works when day starts at 1:00 due to DST start at midnight', () => {
      const ldt = Temporal.LocalDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]');
      equal(ldt.hoursInDay, 23);
    });
    it('startOfDay works', () => {
      const start = dayBeforeDstStart.startOfDay;
      equal(start.toDate().toString(), dayBeforeDstStart.toDate().toString());
      equal('00:00', start.toTime().toString());
    });
    it('startOfDay works when day starts at 1:00 due to DST start at midnight', () => {
      const ldt = LocalDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]');
      const start = ldt.startOfDay;
      equal('01:00', start.toTime().toString());
    });

    const dayAfterSamoaDateLineChange = LocalDateTime.from('2011-12-31T22:00+14:00[Pacific/Apia]');
    const dayBeforeSamoaDateLineChange = LocalDateTime.from('2011-12-29T22:00-10:00[Pacific/Apia]');
    it('startOfDay works after Samoa date line change', () => {
      const start = dayAfterSamoaDateLineChange.startOfDay;
      equal('00:00', start.toTime().toString());
    });
    it('hoursInDay works after Samoa date line change', () => {
      equal(dayAfterSamoaDateLineChange.hoursInDay, 24);
    });
    it('hoursInDay works before Samoa date line change', () => {
      equal(dayBeforeSamoaDateLineChange.hoursInDay, 24);
    });

    it('isOffsetTransition normally returns false', () => {
      equal(hourBeforeDstStart.isOffsetTransition, false);
    });
    it('isOffsetTransition returns true at a DST start transition', () => {
      const dstStart = hourBeforeDstStart.plus({ hours: 1 });
      equal(dstStart.isOffsetTransition, true);
    });
    it('isOffsetTransition returns true at a DST end transition', () => {
      const dstEnd = LocalDateTime.from('2020-11-01T01:00-08:00[America/Los_Angeles]');
      equal(dstEnd.isOffsetTransition, true);
    });
    it('isOffsetTransition returns true right after Samoa date line change', () => {
      const rightAfterSamoaDateLineChange = LocalDateTime.from('2011-12-31T00:00+14:00[Pacific/Apia]');
      equal(rightAfterSamoaDateLineChange.isOffsetTransition, true);
    });
  });

  describe('math around DST', () => {
    it('add 1 hour to get to DST start', () => {
      const added = hourBeforeDstStart.plus({ hours: 1 });
      equal(added.hour, 3);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 1);
      equal(diff.minutes, 0);
      const undo = added.minus(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('add 2 hours to get to DST start +1', () => {
      const added = hourBeforeDstStart.plus({ hours: 2 });
      equal(added.hour, 4);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 2);
      equal(diff.minutes, 0);
      const undo = added.minus(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('add 1.5 hours to get to 0.5 hours after DST start', () => {
      const added = hourBeforeDstStart.plus({ hours: 1, minutes: 30 });
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 1);
      equal(diff.minutes, 30);
      const undo = added.minus(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('Samoa date line change (plus): 10:00PM 29 Dec 2011 -> 11:00PM 31 Dec 2011', () => {
      const dayBeforeSamoaDateLineChangeAbs = new Temporal.DateTime(2011, 12, 29, 22).toInstant('Pacific/Apia');
      const start = dayBeforeSamoaDateLineChangeAbs.toLocalDateTime('Pacific/Apia');
      const added = start.plus({ days: 1, hours: 1 });
      equal(added.day, 31);
      equal(added.hour, 23);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 2);
      const undo = added.minus(diff);
      equal(`${undo}`, `${start}`);
    });

    /* skipping this test until we fix difference()
        it('Samoa date line change (minus): 11:00PM 31 Dec 2011 -> 10:00PM 29 Dec 2011', () => {
          const dayAfterSamoaDateLineChangeAbs = new Temporal.DateTime(2011, 12, 31, 23).toInstant('Pacific/Apia');
          const start = dayAfterSamoaDateLineChangeAbs.toLocalDateTime('Pacific/Apia');
          const added = start.minus({ days: 1, hours: 1 });
          equal(added.day, 29);
          equal(added.hour, 22);
          equal(added.minute, 0);
          const diff = added.difference(start, { largestUnit: 'days' });
          equal(diff.minutes, 0);
          equal(diff.hours, -1);
          equal(diff.days, -2);
          const undo = added.minus(diff);
          equal(`${undo}`, `${start}`);
        });
        */

    it('3:30 day before DST start -> 3:30 day of DST start', () => {
      const start = dayBeforeDstStart.plus({ hours: 1 }); // 3:30AM
      const added = start.plus({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);
      const undo = added.minus(diff);
      equal(`${undo}`, `${start}`);
    });

    it('2:30 day before DST start -> 3:30 day of DST start', () => {
      const added = dayBeforeDstStart.plus({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(dayBeforeDstStart, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);
      // TODO: uncomment and revise these tests after
      // difference algorithm round-trip issue is resolved.
      // See https://mailarchive.ietf.org/arch/msg/calsify/9rPGjL2YRM6SUmW1uDY_wmZ4kPk/
      // const undo = added.minus(diff);
      // equal(`${undo}`, `${dayBeforeDstStart}`);
    });

    it('1:30 day DST starts -> 4:30 day DST starts', () => {
      const start = dayBeforeDstStart.plus({ hours: 23 }); // 1:30AM
      const added = start.plus({ hours: 2 });
      equal(added.day, 8);
      equal(added.hour, 4);
      equal(added.minute, 30);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 2);
      equal(diff.days, 0);
      const undo = added.minus(diff);
      equal(`${undo}`, `${start}`);
    });

    it('2:00 day before DST starts -> 3:00 day DST starts', () => {
      const start = hourBeforeDstStart.minus({ days: 1 }).plus({ hours: 1 }); // 2:00AM
      const added = start.plus({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);
      // TODO: uncomment and revise these tests after
      // difference algorithm round-trip issue is resolved.
      // See https://mailarchive.ietf.org/arch/msg/calsify/9rPGjL2YRM6SUmW1uDY_wmZ4kPk/
      // const undo = added.minus(diff);
      // equal(`${undo}`, `${start}`);
    });

    it('1:00AM day DST starts -> (add 24 hours) -> 2:00AM day after DST starts', () => {
      const start = hourBeforeDstStart; // 1:00AM
      const added = start.plus({ hours: 24 });
      equal(added.day, 9);
      equal(added.hour, 2);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 1);
      const undo = added.minus(diff);
      equal(`${undo}`, `${start}`);
    });

    it('12:00AM day DST starts -> (add 24 hours) -> 1:00AM day after DST starts', () => {
      const start = hourBeforeDstStart.minus({ hours: 1 }); // 1:00AM
      const added = start.plus({ hours: 24 });
      equal(added.day, 9);
      equal(added.hour, 1);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 1);
      const undo = added.minus(diff);
      equal(`${undo}`, `${start}`);
    });

    it('addition and difference work near DST start', () => {
      // Test the difference between different distances near DST start
      const stepsPerHour = 2;
      const minutesPerStep = 60 / stepsPerHour;
      const hoursUntilEnd = 26;
      const startHourRange = 3;
      for (let i = 0; i < startHourRange * stepsPerHour; i++) {
        const start = hourBeforeDstStart.plus({ minutes: minutesPerStep * i });
        for (let j = 0; j < hoursUntilEnd * stepsPerHour; j++) {
          const end = start.plus({ minutes: j * minutesPerStep });
          const diff = end.difference(start, { largestUnit: 'days' });
          const expectedMinutes = minutesPerStep * (j % stepsPerHour);
          equal(diff.minutes, expectedMinutes);
          const diff60 = Math.floor(j / stepsPerHour);
          if (i >= stepsPerHour) {
            // DST transition already happened
            const expectedDays = diff60 < 24 ? 0 : diff60 < 48 ? 1 : 2;
            const expectedHours = diff60 < 24 ? diff60 : diff60 < 48 ? diff60 - 24 : diff60 - 48;
            equal(diff.hours, expectedHours);
            equal(diff.days, expectedDays);
          } else {
            // DST transition hasn't happened yet
            const expectedDays = diff60 < 23 ? 0 : diff60 < 47 ? 1 : 2;
            const expectedHours = diff60 < 23 ? diff60 : diff60 < 47 ? diff60 - 23 : diff60 - 47;
            equal(diff.hours, expectedHours);
            equal(diff.days, expectedDays);
          }
        }
      }
    });
  });

  describe('Structure', () => {
    it('LocalDateTime is a Function', () => {
      equal(typeof LocalDateTime, 'function');
    });
    it('LocalDateTime has a prototype', () => {
      assert(LocalDateTime.prototype);
      equal(typeof LocalDateTime.prototype, 'object');
    });
    describe('LocalDateTime.prototype', () => {
      it('LocalDateTime.prototype has year', () => {
        assert('year' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has month', () => {
        assert('month' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has day', () => {
        assert('day' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has hour', () => {
        assert('hour' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has minute', () => {
        assert('minute' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has second', () => {
        assert('second' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has millisecond', () => {
        assert('millisecond' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has microsecond', () => {
        assert('microsecond' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has nanosecond', () => {
        assert('nanosecond' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype.with is a Function', () => {
        equal(typeof LocalDateTime.prototype.with, 'function');
      });
      it('LocalDateTime.prototype.plus is a Function', () => {
        equal(typeof LocalDateTime.prototype.plus, 'function');
      });
      it('LocalDateTime.prototype.minus is a Function', () => {
        equal(typeof LocalDateTime.prototype.minus, 'function');
      });
      it('LocalDateTime.prototype.difference is a Function', () => {
        equal(typeof LocalDateTime.prototype.difference, 'function');
      });
      it('LocalDateTime.prototype.equals is a Function', () => {
        equal(typeof LocalDateTime.prototype.equals, 'function');
      });
      it('LocalDateTime.prototype.getDate is a Function', () => {
        equal(typeof LocalDateTime.prototype.toDate, 'function');
      });
      it('LocalDateTime.prototype.getTime is a Function', () => {
        equal(typeof LocalDateTime.prototype.toTime, 'function');
      });
      it('LocalDateTime.prototype.getFields is a Function', () => {
        equal(typeof LocalDateTime.prototype.getFields, 'function');
      });
      it('LocalDateTime.prototype.getISOFields is a Function', () => {
        equal(typeof LocalDateTime.prototype.getISOFields, 'function');
      });
      it('LocalDateTime.prototype.toString is a Function', () => {
        equal(typeof LocalDateTime.prototype.toString, 'function');
      });
      it('LocalDateTime.prototype.toJSON is a Function', () => {
        equal(typeof LocalDateTime.prototype.toJSON, 'function');
      });
      it('LocalDateTime.prototype has toInstant', () => {
        assert('toInstant' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has timeZone', () => {
        assert('timeZone' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has hoursInDay', () => {
        assert('hoursInDay' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has offsetNanoseconds', () => {
        assert('offsetNanoseconds' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype has offsetString', () => {
        assert('offsetString' in LocalDateTime.prototype);
      });
      it('LocalDateTime.prototype.getDateTime is a Function', () => {
        equal(typeof LocalDateTime.prototype.toDateTime, 'function');
      });
    });
    it('LocalDateTime.from is a Function', () => {
      equal(typeof LocalDateTime.from, 'function');
    });
    it('LocalDateTime.compare is a Function', () => {
      equal(typeof LocalDateTime.compare, 'function');
    });
  });

  describe('Construction', () => {
    const epochMillis = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
    const ldt = new LocalDateTime(epochNanos, tz);
    assert(ldt);
    equal(typeof ldt, 'object');
    equal(
      ldt.toInstant().getEpochSeconds(),
      Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3),
      'getEpochSeconds'
    );

    equal(ldt.toInstant().getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30, 123), 'getEpochMilliseconds');

    describe('LocalDateTime for (1976, 11, 18, 15, 23, 30, 123, 456, 789)', () => {
      it('datetime can be constructed', () => {
        const localDateTime = new LocalDateTime(epochNanos, new Temporal.TimeZone('UTC'));
        assert(localDateTime);
        equal(typeof localDateTime, 'object');
      });
      const localDateTime = new LocalDateTime(epochNanos, new Temporal.TimeZone('UTC'));
      it('localDateTime.year is 1976', () => equal(localDateTime.year, 1976));
      it('localDateTime.month is 11', () => equal(localDateTime.month, 11));
      it('localDateTime.day is 18', () => equal(localDateTime.day, 18));
      it('localDateTime.hour is 15', () => equal(localDateTime.hour, 15));
      it('localDateTime.minute is 23', () => equal(localDateTime.minute, 23));
      it('localDateTime.second is 30', () => equal(localDateTime.second, 30));
      it('localDateTime.millisecond is 123', () => equal(localDateTime.millisecond, 123));
      it('localDateTime.microsecond is 456', () => equal(localDateTime.microsecond, 456));
      it('localDateTime.nanosecond is 789', () => equal(localDateTime.nanosecond, 789));
      it('localDateTime.dayOfWeek is 4', () => equal(localDateTime.dayOfWeek, 4));
      it('localDateTime.dayOfYear is 323', () => equal(localDateTime.dayOfYear, 323));
      it('localDateTime.weekOfYear is 47', () => equal(localDateTime.weekOfYear, 47));
      it('`${localDateTime}` is 1976-11-18T15:23:30.123456789+00:00[UTC]', () =>
        equal(`${localDateTime}`, '1976-11-18T15:23:30.123456789+00:00[UTC]'));
    });

    describe('epochXXX properties', () => {
      const ins = Temporal.Instant.from('1976-11-18T15:23:30.123456789Z');
      const ldt = ins.toLocalDateTime('America/Los_Angeles');
      it('localDateTime.epochNanoseconds is 217178610123456789n', () => equal(ldt.epochMicroseconds, 217178610123456n));
      it('localDateTime.epochMicroseconds is 217178610123456n', () => equal(ldt.epochMicroseconds, 217178610123456n));
      it('localDateTime.epochMilliseconds is 217178610123', () => equal(ldt.epochMilliseconds, 217178610123));
      it('localDateTime.epochSeconds is 217178610', () => equal(ldt.epochSeconds, 217178610));
    });
  });
  describe('.with manipulation', () => {
    const dt = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    const localDateTime = LocalDateTime.from({ ...dt.getFields(), timeZone: 'UTC' });
    it('localDateTime.with({ year: 2019 } works', () => {
      equal(`${localDateTime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ month: 5 } works', () => {
      equal(`${localDateTime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ day: 5 } works', () => {
      equal(`${localDateTime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ hour: 5 } works', () => {
      equal(`${localDateTime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ minute: 5 } works', () => {
      equal(`${localDateTime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ second: 5 } works', () => {
      equal(`${localDateTime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789+00:00[UTC]');
    });
    it('localDateTime.with({ millisecond: 5 } works', () => {
      equal(`${localDateTime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789+00:00[UTC]');
    });
    it('localDateTime.with({ microsecond: 5 } works', () => {
      equal(`${localDateTime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789+00:00[UTC]');
    });
    it('localDateTime.with({ nanosecond: 5 } works', () => {
      equal(`${localDateTime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005+00:00[UTC]');
    });
    it('localDateTime.with({ month: 5, second: 15 } works', () => {
      equal(`${localDateTime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789+00:00[UTC]');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => localDateTime.with({ day: 5 }, { overflow }), RangeError)
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}

/*
    // The tests below here were copied from DateTime.
    // Consider adapting them to LocalDateTime.
    describe('DateTime.compare() works', () => {
      const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
      const dt2 = DateTime.from('2019-10-29T10:46:38.271986102');
      it('equal', () => equal(DateTime.compare(dt1, dt1), 0));
      it('smaller/larger', () => equal(DateTime.compare(dt1, dt2), -1));
      it('larger/smaller', () => equal(DateTime.compare(dt2, dt1), 1));
      it("doesn't cast first argument", () => {
        throws(() => DateTime.compare({ year: 1976, month: 11, day: 18, hour: 15 }, dt2), TypeError);
        throws(() => DateTime.compare('1976-11-18T15:23:30.123456789', dt2), TypeError);
      });
      it("doesn't cast second argument", () => {
        throws(() => DateTime.compare(dt1, { year: 2019, month: 10, day: 29, hour: 10 }), TypeError);
        throws(() => DateTime.compare('2019-10-29T10:46:38.271986102', dt2), TypeError);
      });
    });
    describe('DateTime.equals() works', () => {
      const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
      const dt2 = DateTime.from('2019-10-29T10:46:38.271986102');
      it('equal', () => assert(dt1.equals(dt1)));
      it('unequal', () => assert(!dt1.equals(dt2)));
      it("doesn't cast argument", () => {
        throws(() => dt2.equals({ year: 1976, month: 11, day: 18, hour: 15 }), TypeError);
        throws(() => dt2.equals('1976-11-18T15:23:30.123456789'), TypeError);
      });
    });
    describe("Comparison operators don't work", () => {
      const dt1 = DateTime.from('1963-02-13T09:36:29.123456789');
      const dt1again = DateTime.from('1963-02-13T09:36:29.123456789');
      const dt2 = DateTime.from('1976-11-18T15:23:30.123456789');
      it('=== is object equality', () => equal(dt1, dt1));
      it('!== is object equality', () => notEqual(dt1, dt1again));
      it('<', () => throws(() => dt1 < dt2));
      it('>', () => throws(() => dt1 > dt2));
      it('<=', () => throws(() => dt1 <= dt2));
      it('>=', () => throws(() => dt1 >= dt2));
    });
    describe('date/time maths', () => {
      const earlier = DateTime.from('1976-11-18T15:23:30.123456789');
      const later = DateTime.from('2019-10-29T10:46:38.271986102');
      const units: Temporal.DifferenceOptions<
        'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
      >['largestUnit'][] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
      units.forEach((largestUnit) => {
        const diff = later.difference(earlier, { largestUnit });
        // it('throws if out of order', () => throws(() => earlier.difference(later), RangeError));
        it(`(${earlier}).plus(${diff}) == (${later})`, () => {
          earlier.plus(diff).equals(later);
        });
        it(`(${later}).minus(${diff}) == (${earlier})`, () => {
          later.minus(diff).equals(earlier);
        });
      });
    });
    describe('date/time maths: hours overflow', () => {
      const later = DateTime.from('2019-10-29T10:46:38.271986102');
      const earlier = later.minus({ hours: 12 });
      it('result', () => equal(`${earlier}`, '2019-10-28T22:46:38.271986102'));
    });
    describe('DateTime.plus() works', () => {
      it('constrain when ambiguous result', () => {
        const jan31 = DateTime.from('2020-01-31T15:00');
        equal(`${jan31.plus({ months: 1 })}`, '2020-02-29T15:00');
        equal(`${jan31.plus({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00');
      });
      it('throw when ambiguous result with reject', () => {
        const jan31 = DateTime.from('2020-01-31T15:00:00');
        throws(() => jan31.plus({ months: 1 }, { overflow: 'reject' }), RangeError);
      });
      it('invalid overflow', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
          throws(() => DateTime.from('2019-11-18T15:00').plus({ months: 1 }, { overflow }), RangeError)
        );
      });
    });
    describe('date.minus() works', () => {
      it('constrain when ambiguous result', () => {
        const mar31 = DateTime.from('2020-03-31T15:00');
        equal(`${mar31.minus({ months: 1 })}`, '2020-02-29T15:00');
        equal(`${mar31.minus({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00');
      });
      it('throw when ambiguous result with reject', () => {
        const mar31 = DateTime.from('2020-03-31T15:00');
        throws(() => mar31.minus({ months: 1 }, { overflow: 'reject' }), RangeError);
      });
      it('invalid overflow', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
          throws(() => DateTime.from('2019-11-18T15:00').minus({ months: 1 }, { overflow }), RangeError)
        );
      });
    });
    describe('DateTime.difference()', () => {
      const dt = DateTime.from('1976-11-18T15:23:30.123456789');
      it("doesn't cast argument", () => {
        throws(() => dt.difference({ year: 2019, month: 10, day: 29, hour: 10 }), TypeError);
        throws(() => dt.difference('2019-10-29T10:46:38.271986102'), TypeError);
      });
      const feb20 = DateTime.from('2020-02-01T00:00');
      const feb21 = DateTime.from('2021-02-01T00:00');
      it('defaults to returning days', () => {
        equal(`${feb21.difference(feb20)}`, 'P366D');
        equal(`${feb21.difference(feb20, { largestUnit: 'days' })}`, 'P366D');
        equal(`${DateTime.from('2021-02-01T00:00:00.000000001').difference(feb20)}`, 'P366DT0.000000001S');
        equal(`${feb21.difference(DateTime.from('2020-02-01T00:00:00.000000001'))}`, 'P365DT23H59M59.999999999S');
      });
      it('can return lower or higher units', () => {
        equal(`${feb21.difference(feb20, { largestUnit: 'years' })}`, 'P1Y');
        equal(`${feb21.difference(feb20, { largestUnit: 'months' })}`, 'P12M');
        equal(`${feb21.difference(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
        equal(`${feb21.difference(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
        equal(`${feb21.difference(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
      });
      it('does not include higher units than necessary', () => {
        const lastFeb20 = DateTime.from('2020-02-29T00:00');
        const lastFeb21 = DateTime.from('2021-02-28T00:00');
        equal(`${lastFeb21.difference(lastFeb20)}`, 'P365D');
        equal(`${lastFeb21.difference(lastFeb20, { largestUnit: 'months' })}`, 'P11M30D');
        equal(`${lastFeb21.difference(lastFeb20, { largestUnit: 'years' })}`, 'P11M30D');
      });
      it('weeks and months are mutually exclusive', () => {
        const laterDateTime = dt.plus({ days: 42, hours: 3 });
        const weeksDifference = laterDateTime.difference(dt, { largestUnit: 'weeks' });
        notEqual(weeksDifference.weeks, 0);
        equal(weeksDifference.months, 0);
        const monthsDifference = laterDateTime.difference(dt, { largestUnit: 'months' });
        equal(monthsDifference.weeks, 0);
        notEqual(monthsDifference.months, 0);
      });
    });
    describe('DateTime.from() works', () => {
      it('DateTime.from("1976-11-18 15:23:30")', () =>
        equal(`${DateTime.from('1976-11-18 15:23:30')}`, '1976-11-18T15:23:30'));
      it('DateTime.from("1976-11-18 15:23:30.001")', () =>
        equal(`${DateTime.from('1976-11-18 15:23:30.001')}`, '1976-11-18T15:23:30.001'));
      it('DateTime.from("1976-11-18 15:23:30.001123")', () =>
        equal(`${DateTime.from('1976-11-18 15:23:30.001123')}`, '1976-11-18T15:23:30.001123'));
      it('DateTime.from("1976-11-18 15:23:30.001123456")', () =>
        equal(`${DateTime.from('1976-11-18 15:23:30.001123456')}`, '1976-11-18T15:23:30.001123456'));
      it('DateTime.from(1976-11-18) == 1976-11-18', () => {
        const orig = new DateTime(1976, 11, 18, 15, 23, 20, 123, 456, 789);
        const actual = DateTime.from(orig);
        notEqual(actual, orig);
      });
      it('DateTime.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18T00:00', () =>
        equal(`${DateTime.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18T00:00'));
      it('DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 }) == 1976-11-18T00:00:00.123', () =>
        equal(`${DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 })}`, '1976-11-18T00:00:00.123'));
      it('DateTime.from({ month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }) throws', () =>
        throws(
          () => DateTime.from({ month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }),
          TypeError
        ));
      it('DateTime.from({}) throws', () => throws(() => DateTime.from({}), TypeError));
      it('DateTime.from(required prop undefined) throws', () =>
        throws(() => DateTime.from({ year: undefined, month: 11, day: 18 }), TypeError));
      it('DateTime.from(ISO string leap second) is constrained', () => {
        equal(`${DateTime.from('2016-12-31T23:59:60')}`, '2016-12-31T23:59:59');
      });
      it('DateTime.from(number) is converted to string', () =>
        assert(DateTime.from(19761118).equals(DateTime.from('19761118'))));
      describe('Overflow', () => {
        const bad = { year: 2019, month: 1, day: 32 };
        it('reject', () => throws(() => DateTime.from(bad, { overflow: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${DateTime.from(bad)}`, '2019-01-31T00:00');
          equal(`${DateTime.from(bad, { overflow: 'constrain' })}`, '2019-01-31T00:00');
        });
        it('throw when bad overflow', () => {
          [new DateTime(1976, 11, 18, 15, 23), { year: 2019, month: 1, day: 1 }, '2019-01-31T00:00'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
              throws(() => DateTime.from(input, { overflow }), RangeError)
            );
          });
        });
        const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60 };
        it('reject leap second', () => throws(() => DateTime.from(leap, { overflow: 'reject' }), RangeError));
        it('constrain leap second', () => equal(`${DateTime.from(leap)}`, '2016-12-31T23:59:59'));
      });
      it('variant time separators', () => {
        equal(`${DateTime.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23');
        equal(`${DateTime.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23');
      });
      it('any number of decimal places', () => {
        equal(`${DateTime.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120');
        equal(`${DateTime.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123');
        equal(`${DateTime.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.123400');
        equal(`${DateTime.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.123450');
        equal(`${DateTime.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456');
        equal(`${DateTime.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.123456700');
        equal(`${DateTime.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.123456780');
        equal(`${DateTime.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789');
      });
      it('variant decimal separator', () => {
        equal(`${DateTime.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120');
      });
      it('mixture of basic and extended format', () => {
        equal(`${DateTime.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('19761118T152330.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
        equal(`${DateTime.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100');
      });
      it('optional parts', () => {
        equal(`${DateTime.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30');
        equal(`${DateTime.from('1976-11-18T15')}`, '1976-11-18T15:00');
        equal(`${DateTime.from('1976-11-18')}`, '1976-11-18T00:00');
      });
    });
    describe('Min/max range', () => {
      it('constructing from numbers', () => {
        throws(() => new DateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 0), RangeError);
        throws(() => new DateTime(275760, 9, 14, 0, 0, 0, 0, 0, 0), RangeError);
        equal(`${new DateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 1)}`, '-271821-04-19T00:00:00.000000001');
        equal(`${new DateTime(275760, 9, 13, 23, 59, 59, 999, 999, 999)}`, '+275760-09-13T23:59:59.999999999');
      });
      it('constructing from property bag', () => {
        const tooEarly = { year: -271821, month: 4, day: 19 };
        const tooLate = { year: 275760, month: 9, day: 14 };
        ['reject', 'constrain'].forEach((overflow: Temporal.AssignmentOptions['overflow']) => {
          [tooEarly, tooLate].forEach((props) => {
            throws(() => DateTime.from(props, { overflow }), RangeError);
          });
        });
        equal(
          `${DateTime.from({ year: -271821, month: 4, day: 19, nanosecond: 1 })}`,
          '-271821-04-19T00:00:00.000000001'
        );
        equal(
          `${DateTime.from({
            year: 275760,
            month: 9,
            day: 13,
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 999,
            microsecond: 999,
            nanosecond: 999
          })}`,
          '+275760-09-13T23:59:59.999999999'
        );
      });
      it('constructing from ISO string', () => {
        ['reject', 'constrain'].forEach((overflow: Temporal.AssignmentOptions['overflow']) => {
          ['-271821-04-19T00:00', '+275760-09-14T00:00'].forEach((str) => {
            throws(() => DateTime.from(str, { overflow }), RangeError);
          });
        });
        equal(`${DateTime.from('-271821-04-19T00:00:00.000000001')}`, '-271821-04-19T00:00:00.000000001');
        equal(`${DateTime.from('+275760-09-13T23:59:59.999999999')}`, '+275760-09-13T23:59:59.999999999');
      });
      it('converting from Instant', () => {
        const min = Temporal.Instant.from('-271821-04-20T00:00Z');
        const max = Temporal.Instant.from('+275760-09-13T00:00Z');
        equal(`${min.toDateTime('-23:59')}`, '-271821-04-19T00:01');
        equal(`${max.toDateTime('+23:59')}`, '+275760-09-13T23:59');
      });
      it('converting from Date and Time', () => {
        const midnight = Temporal.Time.from('00:00');
        const firstNs = Temporal.Time.from('00:00:00.000000001');
        const lastNs = Temporal.Time.from('23:59:59.999999999');
        const min = Temporal.Date.from('-271821-04-19');
        const max = Temporal.Date.from('+275760-09-13');
        throws(() => min.toDateTime(midnight), RangeError);
        throws(() => midnight.toDateTime(min), RangeError);
        equal(`${min.toDateTime(firstNs)}`, '-271821-04-19T00:00:00.000000001');
        equal(`${firstNs.toDateTime(min)}`, '-271821-04-19T00:00:00.000000001');
        equal(`${max.toDateTime(lastNs)}`, '+275760-09-13T23:59:59.999999999');
        equal(`${lastNs.toDateTime(max)}`, '+275760-09-13T23:59:59.999999999');
      });
      it('adding and subtracting beyond limit', () => {
        const min = DateTime.from('-271821-04-19T00:00:00.000000001');
        const max = DateTime.from('+275760-09-13T23:59:59.999999999');
        ['reject', 'constrain'].forEach((overflow: Temporal.AssignmentOptions['overflow']) => {
          throws(() => min.minus({ nanoseconds: 1 }, { overflow }), RangeError);
          throws(() => max.plus({ nanoseconds: 1 }, { overflow }), RangeError);
        });
      });
    });
    describe('dateTime.getFields() works', () => {
      const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
      const fields = dt1.getFields();
      it('fields', () => {
        equal(fields.year, 1976);
        equal(fields.month, 11);
        equal(fields.day, 18);
        equal(fields.hour, 15);
        equal(fields.minute, 23);
        equal(fields.second, 30);
        equal(fields.millisecond, 123);
        equal(fields.microsecond, 456);
        equal(fields.nanosecond, 789);
      });
      it('enumerable', () => {
        const fields2 = { ...fields };
        equal(fields2.year, 1976);
        equal(fields2.month, 11);
        equal(fields2.day, 18);
        equal(fields2.hour, 15);
        equal(fields2.minute, 23);
        equal(fields2.second, 30);
        equal(fields2.millisecond, 123);
        equal(fields2.microsecond, 456);
        equal(fields2.nanosecond, 789);
      });
      it('as input to from()', () => {
        const dt2 = DateTime.from(fields);
        equal(DateTime.compare(dt1, dt2), 0);
      });
      it('as input to with()', () => {
        const dt2 = DateTime.from('2019-06-30').with(fields);
        equal(DateTime.compare(dt1, dt2), 0);
      });
    });
    describe('dateTime.getISOFields() works', () => {
      const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
      const fields = dt1.getISOFields();
      it('fields', () => {
        equal(fields.isoYear, 1976);
        equal(fields.isoMonth, 11);
        equal(fields.isoDay, 18);
        equal(fields.hour, 15);
        equal(fields.minute, 23);
        equal(fields.second, 30);
        equal(fields.millisecond, 123);
        equal(fields.microsecond, 456);
        equal(fields.nanosecond, 789);
      });
      it('enumerable', () => {
        const fields2 = { ...fields };
        equal(fields2.isoYear, 1976);
        equal(fields2.isoMonth, 11);
        equal(fields2.isoDay, 18);
        equal(fields2.hour, 15);
        equal(fields2.minute, 23);
        equal(fields2.second, 30);
        equal(fields2.millisecond, 123);
        equal(fields2.microsecond, 456);
        equal(fields2.nanosecond, 789);
      });
    });
  
      const dt = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
      const localDatetime = LocalDateTime.from({ ...dt.getFields(), timeZone: 'UTC' });
      const datetime = localDatetime.toDateTime();
      it('datetime.with({ year: 2019 } works', () => {
        equal(`${datetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789');
      });
      it('datetime.with({ month: 5 } works', () => {
        equal(`${datetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789');
      });
      it('datetime.with({ day: 5 } works', () => {
        equal(`${datetime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789');
      });
      it('datetime.with({ hour: 5 } works', () => {
        equal(`${datetime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789');
      });
      it('datetime.with({ minute: 5 } works', () => {
        equal(`${datetime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789');
      });
      it('datetime.with({ second: 5 } works', () => {
        equal(`${datetime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789');
      });
      it('datetime.with({ millisecond: 5 } works', () => {
        equal(`${datetime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789');
      });
      it('datetime.with({ microsecond: 5 } works', () => {
        equal(`${datetime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789');
      });
      it('datetime.with({ nanosecond: 5 } works', () => {
        equal(`${datetime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005');
      });
      it('datetime.with({ month: 5, second: 15 } works', () => {
        equal(`${datetime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789');
      });
      it('invalid overflow', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
          throws(() => datetime.with({ day: 5 }, { overflow }), RangeError)
        );
      });
    */

/*
       // The tests below were copied from Instant tests.
       // TODO: consider adapting the to LocalDateTime.
       describe('Instant', () => {
         describe('Construction', () => {
           it('can construct', () => {
             const epochMillis = Date.UTC(1976, 10, 18, 14, 23, 30, 123);
             const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
             const instant = new Temporal.Instant(epochNanos);
             assert(instant);
             equal(typeof instant, 'object');
             equal(instant.getEpochSeconds(), Math.floor(Date.UTC(1976, 10, 18, 14, 23, 30, 123) / 1e3), 'getEpochSeconds');
             equal(instant.getEpochMilliseconds(), Date.UTC(1976, 10, 18, 14, 23, 30, 123), 'getEpochMilliseconds');
           });
           it('constructs from string', () => {
             equal(`${new Instant('0')}`, '1970-01-01T00:00Z');
           });
           it('throws on number', () => throws(() => new Instant(1234), TypeError));
           it('throws on string that does not convert to BigInt', () => throws(() => new Instant('abc123'), SyntaxError));
         });
         describe('instant.toString() works', () => {
           it('`1976-11-18T14:23:30.123456789Z`.toString()', () => {
             const iso = '1976-11-18T14:23:30.123456789Z';
             const instant = Instant.from(iso);
             assert(instant);
             equal(`${instant}`, iso);
           });
           it('`1963-02-13T09:36:29.123456789Z`.toString()', () => {
             const iso = '1963-02-13T09:36:29.123456789Z';
             const instant = Instant.from(iso);
             assert(instant);
             equal(`${instant}`, iso);
           });
           it('optional time zone parameter UTC', () => {
             const iso = '1976-11-18T14:23:30.123456789Z';
             const instant = Instant.from(iso);
             const tz = Temporal.TimeZone.from('UTC');
             equal(instant.toString(tz), iso);
           });
           it('optional time zone parameter non-UTC', () => {
             const instant = Instant.from('1976-11-18T14:23:30.123456789Z');
             const tz = Temporal.TimeZone.from('America/New_York');
             equal(instant.toString(tz), '1976-11-18T09:23:30.123456789-05:00[America/New_York]');
           });
         });
         describe('Instant.toJSON() works', () => {
           it('`1976-11-18T15:23:30.123456789+01:00`.toJSON()', () => {
             const instant = Instant.from('1976-11-18T15:23:30.123456789+01:00');
             assert(instant);
             equal(instant.toJSON(), '1976-11-18T14:23:30.123456789Z');
           });
           it('`1963-02-13T10:36:29.123456789+01:00`.toJSON()', () => {
             const instant = Instant.from('1963-02-13T10:36:29.123456789+01:00');
             assert(instant);
             equal(instant.toJSON(), '1963-02-13T09:36:29.123456789Z');
           });
           it('argument is ignored', () => {
             const instant = Instant.from('1976-11-18T15:23:30.123456789+01:00');
             equal(instant.toJSON('+01:00'), instant.toJSON());
           });
       
         describe('Instant.getEpochSeconds() works', () => {
           it('post-epoch', () => {
             const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochSeconds(), Math.trunc(epochMs / 1e3));
             equal(typeof instant.getEpochSeconds(), 'number');
           });
           it('pre-epoch', () => {
             const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochSeconds(), Math.trunc(epochMs / 1e3));
             equal(typeof instant.getEpochSeconds(), 'number');
           });
         });
         describe('Instant.fromEpochSeconds() works', () => {
           it('1976-11-18T15:23:30', () => {
             const epochSeconds = Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3);
             const instant = Instant.fromEpochSeconds(epochSeconds);
             equal(instant.getEpochSeconds(), epochSeconds);
           });
           it('1963-02-13T09:36:29', () => {
             const epochSeconds = Math.floor(Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1e3);
             const instant = Instant.fromEpochSeconds(epochSeconds);
             equal(instant.getEpochSeconds(), epochSeconds);
           });
         });
         describe('Instant.getEpochMilliseconds() works', () => {
           it('post-epoch', () => {
             const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochMilliseconds(), epochMs);
             equal(typeof instant.getEpochMilliseconds(), 'number');
           });
           it('pre-epoch', () => {
             const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochMilliseconds(), epochMs);
             equal(typeof instant.getEpochMilliseconds(), 'number');
           });
         });
         describe('Instant.fromEpochMilliseconds() works', () => {
           it('1976-11-18T15:23:30.123', () => {
             const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
             const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
             equal(instant.getEpochMilliseconds(), epochMilliseconds);
           });
           it('1963-02-13T09:36:29.123', () => {
             const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
             const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
             equal(instant.getEpochMilliseconds(), epochMilliseconds);
           });
         });
         describe('Instant.getEpochMicroseconds() works', () => {
           it('post-epoch', () => {
             const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
             equal(typeof instant.getEpochMicroseconds(), 'bigint');
           });
           it('pre-epoch', () => {
             const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
             equal(typeof instant.getEpochMicroseconds(), 'bigint');
           });
         });
         describe('Instant.fromEpochMicroseconds() works', () => {
           it('1976-11-18T15:23:30.123456', () => {
             const epochMicroseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456);
             const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
             equal(instant.getEpochMicroseconds(), epochMicroseconds);
           });
           it('1963-02-13T09:36:29.123456', () => {
             const epochMicroseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e3) + BigInt(456);
             const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
             equal(instant.getEpochMicroseconds(), epochMicroseconds);
           });
         });
         describe('Instant.getEpochNanoseconds() works', () => {
           it('post-epoch', () => {
             const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochNanoseconds(), epochNs);
             equal(typeof instant.getEpochNanoseconds(), 'bigint');
           });
           it('pre-epoch', () => {
             const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
             const epochNs = BigInt(epochMs) * BigInt(1e6);
             const instant = new Instant(epochNs);
             equal(instant.getEpochNanoseconds(), epochNs);
             equal(typeof instant.getEpochNanoseconds(), 'bigint');
           });
         });
         describe('Instant.fromEpochNanoseconds() works', () => {
           it('1976-11-18T15:23:30.123456789', () => {
             const epochNanoseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789);
             const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
             equal(instant.getEpochNanoseconds(), epochNanoseconds);
           });
           it('1963-02-13T09:36:29.123456789', () => {
             const epochNanoseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e6) + BigInt(456789);
             const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
             equal(instant.getEpochNanoseconds(), epochNanoseconds);
           });
           it('-1n', () => {
             const instant = Instant.fromEpochNanoseconds(-1n);
             equal(`${instant}`, '1969-12-31T23:59:59.999999999Z');
           });
         });
         describe('Instant.from() works', () => {
           it('1976-11-18T15:23Z', () => {
             equal(Instant.from('1976-11-18T15:23Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23));
           });
           it('1976-11-18T15:23:30Z', () => {
             equal(Instant.from('1976-11-18T15:23:30Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30));
           });
           it('1976-11-18T15:23:30.123Z', () => {
             equal(Instant.from('1976-11-18T15:23:30.123Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30, 123));
           });
           it('1976-11-18T15:23:30.123456Z', () => {
             equal(
               Instant.from('1976-11-18T15:23:30.123456Z').getEpochMicroseconds(),
               BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
             );
           });
           it('1976-11-18T15:23:30.123456789Z', () => {
             equal(
               Instant.from('1976-11-18T15:23:30.123456789Z').getEpochNanoseconds(),
               BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
             );
           });
           it('2020-02-12T11:42-08:00', () => {
             equal(
               Instant.from('2020-02-12T11:42-08:00').getEpochNanoseconds(),
               BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
             );
           });
           it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
             equal(
               Instant.from('2020-02-12T11:42-08:00[America/Vancouver]').getEpochNanoseconds(),
               BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
             );
           });
           it('2020-02-12T11:42+01:00', () => {
             equal(
               Instant.from('2020-02-12T11:42+01:00').getEpochNanoseconds(),
               BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
             );
           });
           it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
             equal(
               Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').getEpochNanoseconds(),
               BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
             );
           });
           it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
             equal(
               Instant.from('2019-02-16T23:45-02:00[America/Sao_Paulo]').getEpochNanoseconds(),
               BigInt(Date.UTC(2019, 1, 17, 1, 45)) * BigInt(1e6)
             );
           });
           it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
             equal(
               Instant.from('2019-02-16T23:45-03:00[America/Sao_Paulo]').getEpochNanoseconds(),
               BigInt(Date.UTC(2019, 1, 17, 2, 45)) * BigInt(1e6)
             );
           });
           it('throws when unable to disambiguate using offset', () => {
             throws(() => Instant.from('2019-02-16T23:45-04:00[America/Sao_Paulo]'), RangeError);
           });
           it('Instant.from(string-convertible) converts to string', () => {
             const obj = {
               toString() {
                 return '2020-02-12T11:42+01:00[Europe/Amsterdam]';
               }
             };
             equal(`${Instant.from(obj)}`, '2020-02-12T10:42Z');
           });
       
           it('Instant.from(1) throws', () => throws(() => Instant.from(1), RangeError));
           it('Instant.from(-1) throws', () => throws(() => Instant.from(-1), RangeError));
           it('Instant.from(1n) throws', () => throws(() => Instant.from(1n), RangeError));
           it('Instant.from(-1n) throws', () => throws(() => Instant.from(-1n), RangeError));
           it('Instant.from({}) throws', () => throws(() => Instant.from({}), RangeError));
           it('Instant.from(instant) is not the same object', () => {
             const instant = Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
             notEqual(Instant.from(instant), instant);
           });
           it('Instant.from(ISO string leap second) is constrained', () => {
             equal(`${Instant.from('2016-12-31T23:59:60Z')}`, '2016-12-31T23:59:59Z');
           });
           it('variant time separators', () => {
             equal(`${Instant.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23Z');
             equal(`${Instant.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23Z');
           });
           it('variant UTC designator', () => {
             equal(`${Instant.from('1976-11-18T15:23z')}`, '1976-11-18T15:23Z');
           });
           it('any number of decimal places', () => {
             equal(`${Instant.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120Z');
             equal(`${Instant.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123Z');
             equal(`${Instant.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.123400Z');
             equal(`${Instant.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.123450Z');
             equal(`${Instant.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456Z');
             equal(`${Instant.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.123456700Z');
             equal(`${Instant.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.123456780Z');
             equal(`${Instant.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789Z');
           });
           it('variant decimal separator', () => {
             equal(`${Instant.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120Z');
           });
           it('mixture of basic and extended format', () => {
             equal(`${Instant.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
             equal(`${Instant.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
           });
           it('optional parts', () => {
             equal(`${Instant.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30Z');
             equal(`${Instant.from('1976-11-18T15Z')}`, '1976-11-18T15:00Z');
           });
         });
         describe('Instant.plus works', () => {
           const instant = Instant.from('1969-12-25T12:23:45.678901234Z');
           describe('cross epoch in ms', () => {
             const one = instant.minus({ hours: 10 * 24, nanoseconds: 800 });
             const two = instant.plus({ hours: 10 * 24, nanoseconds: 800 });
             const three = two.minus({ hours: 20 * 24, nanoseconds: 1600 });
             const four = one.plus({ hours: 20 * 24, nanoseconds: 1600 });
             it(`(${instant}).minus({ days: 10, nanoseconds: 800 }) = ${one}`, () =>
               equal(`${one}`, '1969-12-15T12:23:45.678900434Z'));
             it(`(${instant}).plus({ days: 10, nanoseconds: 800 }) = ${two}`, () =>
               equal(`${two}`, '1970-01-04T12:23:45.678902034Z'));
             it(`(${two}).minus({ days: 20, nanoseconds: 1600 }) = ${one}`, () => assert(three.equals(one)));
             it(`(${one}).plus( days: 20, nanoseconds: 1600 }) = ${two}`, () => assert(four.equals(two)));
           });
           it('instant.plus(durationObj)', () => {
             const later = instant.plus(Temporal.Duration.from('PT240H0.000000800S'));
             equal(`${later}`, '1970-01-04T12:23:45.678902034Z');
           });
           it('invalid to add years or months', () => {
             throws(() => instant.plus({ years: 1 }), RangeError);
             throws(() => instant.plus({ months: 1 }), RangeError);
           });
         });
         describe('Instant.minus works', () => {
           const instant = Instant.from('1969-12-25T12:23:45.678901234Z');
           it('instant.minus(durationObj)', () => {
             const earlier = instant.minus(Temporal.Duration.from('PT240H0.000000800S'));
             equal(`${earlier}`, '1969-12-15T12:23:45.678900434Z');
           });
           it('invalid to subtract years or months', () => {
             throws(() => instant.minus({ years: 1 }), RangeError);
             throws(() => instant.minus({ months: 1 }), RangeError);
           });
         });
         describe('Instant.compare works', () => {
           const instant1 = Instant.from('1963-02-13T09:36:29.123456789Z');
           const instant2 = Instant.from('1976-11-18T15:23:30.123456789Z');
           const instant3 = Instant.from('1981-12-15T14:34:31.987654321Z');
           it('pre epoch equal', () => equal(Instant.compare(instant1, Instant.from(instant1)), 0));
           it('epoch equal', () => equal(Instant.compare(instant2, Instant.from(instant2)), 0));
           it('cross epoch smaller/larger', () => equal(Instant.compare(instant1, instant2), -1));
           it('cross epoch larger/smaller', () => equal(Instant.compare(instant2, instant1), 1));
           it('epoch smaller/larger', () => equal(Instant.compare(instant2, instant3), -1));
           it('epoch larger/smaller', () => equal(Instant.compare(instant3, instant2), 1));
           it("doesn't cast first argument", () => {
             throws(() => Instant.compare(instant1, instant1.toString()), TypeError);
             throws(() => Instant.compare(instant1, {}), TypeError);
           });
           it("doesn't cast second argument", () => {
             throws(() => Instant.compare(instant2.getEpochNanoseconds(), instant2), TypeError);
             throws(() => Instant.compare({}, instant2), TypeError);
           });
         });
         describe('Instant.equals works', () => {
           const instant1 = Instant.from('1963-02-13T09:36:29.123456789Z');
           const instant2 = Instant.from('1976-11-18T15:23:30.123456789Z');
           const instant3 = Instant.from('1981-12-15T14:34:31.987654321Z');
           it('pre epoch equal', () => assert(instant1.equals(instant1)));
           it('epoch equal', () => assert(instant2.equals(instant2)));
           it('cross epoch unequal', () => assert(!instant1.equals(instant2)));
           it('epoch unequal', () => assert(!instant2.equals(instant3)));
           it("doesn't cast argument", () => {
             throws(() => instant1.equals(instant1.getEpochNanoseconds()), TypeError);
             throws(() => instant1.equals({}), TypeError);
           });
         });
         describe("Comparison operators don't work", () => {
           const instant1 = Instant.from('1963-02-13T09:36:29.123456789Z');
           const instant1again = Instant.from('1963-02-13T09:36:29.123456789Z');
           const instant2 = Instant.from('1976-11-18T15:23:30.123456789Z');
           it('=== is object equality', () => equal(instant1, instant1));
           it('!== is object equality', () => notEqual(instant1, instant1again));
           it('<', () => throws(() => instant1 < instant2));
           it('>', () => throws(() => instant1 > instant2));
           it('<=', () => throws(() => instant1 <= instant2));
           it('>=', () => throws(() => instant1 >= instant2));
         });
         describe('Instant.difference works', () => {
           const earlier = Instant.from('1976-11-18T15:23:30.123456789Z');
           const later = Instant.from('2019-10-29T10:46:38.271986102Z');
           const diff = later.difference(earlier);
           // it('throws if out of order', () => throws(() => earlier.difference(later), RangeError));
           it(`(${earlier}).plus(${diff}) == (${later})`, () => assert(earlier.plus(diff).equals(later)));
           it(`(${later}).minus(${diff}) == (${earlier})`, () => assert(later.minus(diff).equals(earlier)));
           it("doesn't cast argument", () => {
             throws(() => earlier.difference(later.toString()), TypeError);
             throws(() => earlier.difference({}), TypeError);
           });
           const feb20 = Instant.from('2020-02-01T00:00Z');
           const feb21 = Instant.from('2021-02-01T00:00Z');
           it('defaults to returning seconds', () => {
             equal(`${feb21.difference(feb20)}`, 'PT31622400S');
             equal(`${feb21.difference(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
             equal(`${Instant.from('2021-02-01T00:00:00.000000001Z').difference(feb20)}`, 'PT31622400.000000001S');
             equal(`${feb21.difference(Instant.from('2020-02-01T00:00:00.000000001Z'))}`, 'PT31622399.999999999S');
           });
           it('can return minutes, hours, and days', () => {
             equal(`${feb21.difference(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
             equal(`${feb21.difference(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
             // equal(`${feb21.difference(feb20, { largestUnit: 'days' })}`, 'P366D');
           });
           it('cannot return weeks, months, and years', () => {
             throws(() => feb21.difference(feb20, { largestUnit: 'days' }), RangeError);
             throws(() => feb21.difference(feb20, { largestUnit: 'weeks' }), RangeError);
             throws(() => feb21.difference(feb20, { largestUnit: 'months' }), RangeError);
             throws(() => feb21.difference(feb20, { largestUnit: 'years' }), RangeError);
           });
         });
         describe('Min/max range', () => {
           it('constructing from ns', () => {
             const limit = 8_640_000_000_000_000_000_000n;
             throws(() => new Instant(-limit - 1n), RangeError);
             throws(() => new Instant(limit + 1n), RangeError);
             equal(`${new Instant(-limit)}`, '-271821-04-20T00:00Z');
             equal(`${new Instant(limit)}`, '+275760-09-13T00:00Z');
           });
           it('constructing from ms', () => {
             const limit = 86400e11;
             throws(() => Instant.fromEpochMilliseconds(-limit - 1), RangeError);
             throws(() => Instant.fromEpochMilliseconds(limit + 1), RangeError);
             equal(`${Instant.fromEpochMilliseconds(-limit)}`, '-271821-04-20T00:00Z');
             equal(`${Instant.fromEpochMilliseconds(limit)}`, '+275760-09-13T00:00Z');
           });
           it('constructing from ISO string', () => {
             throws(() => Instant.from('-271821-04-19T23:59:59.999999999Z'), RangeError);
             throws(() => Instant.from('+275760-09-13T00:00:00.000000001Z'), RangeError);
             equal(`${Instant.from('-271821-04-20T00:00Z')}`, '-271821-04-20T00:00Z');
             equal(`${Instant.from('+275760-09-13T00:00Z')}`, '+275760-09-13T00:00Z');
           });
           it('converting from DateTime', () => {
             const min = Temporal.DateTime.from('-271821-04-19T00:00:00.000000001');
             const max = Temporal.DateTime.from('+275760-09-13T23:59:59.999999999');
             throws(() => min.toInstant('UTC'), RangeError);
             throws(() => max.toInstant('UTC'), RangeError);
             const utc = Temporal.TimeZone.from('UTC');
             throws(() => utc.getInstantFor(min), RangeError);
             throws(() => utc.getInstantFor(max), RangeError);
           });
           it('adding and subtracting beyond limit', () => {
             const min = Instant.from('-271821-04-20T00:00Z');
             const max = Instant.from('+275760-09-13T00:00Z');
             throws(() => min.minus({ nanoseconds: 1 }), RangeError);
             throws(() => max.plus({ nanoseconds: 1 }), RangeError);
           });
         });
         describe('Instant.toDateTime works', () => {
           const iso = '1976-11-18T14:23:30.123456789Z';
           const instant = Instant.from(iso);
           it('optional time zone parameter UTC', () => {
             const tz = Temporal.TimeZone.from('UTC');
             const dt = instant.toDateTime(tz);
             equal(instant.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
             equal(`${dt}`, '1976-11-18T14:23:30.123456789');
           });
           it('optional time zone parameter non-UTC', () => {
             const tz = Temporal.TimeZone.from('America/New_York');
             const dt = instant.toDateTime(tz);
             equal(instant.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
             equal(`${dt}`, '1976-11-18T09:23:30.123456789');
           });
         });
       });
       */
