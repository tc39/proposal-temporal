#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it: itOriginal, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

type Handler = () => void | Promise<void>;
type Case = ReturnType<typeof itOriginal['skip']>;
type SafeIt = {
  (name: string, handler: Handler): Case;
  only(name: string, handler: Handler): Case;
  skip(name: string, handler: Handler): Case;
  todo(name: string, handler: Handler): Case;
};
const it = itOriginal as SafeIt;

import { Temporal } from '../../poc';
const { DateTime } = Temporal;
type DateTime = Temporal.DateTime;
import { ZonedDateTime } from './ZonedDateTime';

describe('ZonedDateTime', () => {
  const tz = new Temporal.TimeZone('America/Los_Angeles');
  // const dstEnd = ZonedDateTime.from({ ...new DateTime(2020, 11, 1, 2).getFields(), timeZone: tz });
  const hourBeforeDstStart = ZonedDateTime.from({ ...new DateTime(2020, 3, 8, 1).getFields(), timeZone: tz });
  const dayBeforeDstStart = ZonedDateTime.from({ ...new DateTime(2020, 3, 7, 2, 30).getFields(), timeZone: tz });

  describe('toZonedDateTime() on other Temporal objects', () => {
    it('Date.toZonedDateTime() works', () => {
      const date = Temporal.Date.from('2020-01-01');
      const time = Temporal.Time.from('12:00');
      const zdt = date.toZonedDateTime('America/Los_Angeles', time);
      equal(zdt.toString(), '2020-01-01T12:00-08:00[America/Los_Angeles]');
    });
    it('Date.toZonedDateTime() works with time omitted', () => {
      const date = Temporal.Date.from('2020-01-01');
      const zdt = date.toZonedDateTime('America/Los_Angeles');
      equal(zdt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('Date.toZonedDateTime() works with disambiguation option', () => {
      const date = Temporal.Date.from('2020-03-08');
      const time = Temporal.Time.from('02:00');
      const zdt = date.toZonedDateTime('America/Los_Angeles', time, { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('Time.toZonedDateTime works', () => {
      const date = Temporal.Date.from('2020-01-01');
      const time = Temporal.Time.from('12:00');
      const zdt = time.toZonedDateTime('America/Los_Angeles', date);
      equal(zdt.toString(), '2020-01-01T12:00-08:00[America/Los_Angeles]');
    });
    it('Time.toZonedDateTime() works with disambiguation option', () => {
      const date = Temporal.Date.from('2020-03-08');
      const time = Temporal.Time.from('02:00');
      const zdt = time.toZonedDateTime('America/Los_Angeles', date, { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('Instant.toZonedDateTime works', () => {
      const instant = Temporal.Instant.from('2020-01-01T00:00-08:00');
      const zdt = instant.toZonedDateTime('America/Los_Angeles');
      equal(zdt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('DateTime.toZonedDateTime works', () => {
      const dt = Temporal.DateTime.from('2020-01-01T00:00');
      const zdt = dt.toZonedDateTime('America/Los_Angeles');
      equal(zdt.toString(), '2020-01-01T00:00-08:00[America/Los_Angeles]');
    });
    it('DateTime.toZonedDateTime works with disambiguation option', () => {
      const dt = Temporal.DateTime.from('2020-03-08T02:00');
      const zdt = dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
  });

  describe('string parsing', () => {
    it('parses with an IANA zone', () => {
      const zdt = Temporal.ZonedDateTime.from('2020-03-08T01:00-08:00[America/Los_Angeles]');
      equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('parses with an IANA zone but no offset', () => {
      const zdt = Temporal.ZonedDateTime.from('2020-03-08T01:00[America/Los_Angeles]');
      equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]');
    });
    it('parses with an IANA zone but no offset (with disambiguation)', () => {
      const zdt = Temporal.ZonedDateTime.from('2020-03-08T02:30[America/Los_Angeles]', { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:30-08:00[America/Los_Angeles]');
    });
    it('parses with an offset in brackets', () => {
      const zdt = Temporal.ZonedDateTime.from('2020-03-08T01:00-08:00[-08:00]');
      equal(zdt.toString(), '2020-03-08T01:00-08:00[-08:00]');
    });
    it('parses with "Z" used as an offset', () => {
      const iso = '2020-03-08T01:00-08:00[America/Los_Angeles]';
      const instant = Temporal.ZonedDateTime.from(iso).toInstant();
      equal(instant.toString(), '2020-03-08T09:00Z');
      const zdt = Temporal.ZonedDateTime.from(`${instant.toString()}[America/Los_Angeles]`);
      equal(zdt.toString(), iso);
    });
    it('throws if no brackets', () => {
      // @ts-ignore
      throws(() => Temporal.ZonedDateTime.from('2020-03-08T01:00-08:00'));
    });
    it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
      // @ts-ignore
      throws(() => Temporal.ZonedDateTime.from('2020-03-08T01:00-04:00[-08:00]', { offset: 'reject' }));
    });
    it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
      // @ts-ignore
      throws(() => Temporal.ZonedDateTime.from('2020-03-08T01:00-04:00[America/Chicago]', { offset: 'reject' }));
    });
    it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
      const zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(zdt.toString(), '2020-11-01T01:30-07:00[America/Los_Angeles]');
    });
    it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
      const zdt = Temporal.ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(zdt.toString(), '2020-11-01T01:30-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'prefer' } if offset does not match time zone", () => {
      const zdt = Temporal.ZonedDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'prefer' });
      equal(zdt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'ignore' } uses time zone only", () => {
      const zdt = Temporal.ZonedDateTime.from('2020-11-01T04:00-12:00[America/Los_Angeles]', { offset: 'ignore' });
      equal(zdt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]');
    });
    it("{ offset: 'use' } uses offset only", () => {
      const zdt = Temporal.ZonedDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'use' });
      equal(zdt.toString(), '2020-11-01T03:00-08:00[America/Los_Angeles]');
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
      const dstEnd = ZonedDateTime.from('2020-11-01T01:00-08:00[America/Los_Angeles]');
      equal(dstEnd.hoursInDay, 25);
    });
    it('hoursInDay works when day starts at 1:00 due to DST start at midnight', () => {
      const zdt = Temporal.ZonedDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]');
      equal(zdt.hoursInDay, 23);
    });
    it('startOfDay works', () => {
      const start = dayBeforeDstStart.startOfDay;
      equal(start.toDate().toString(), dayBeforeDstStart.toDate().toString());
      equal('00:00', start.toTime().toString());
    });
    it('startOfDay works when day starts at 1:00 due to DST start at midnight', () => {
      const zdt = ZonedDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]');
      const start = zdt.startOfDay;
      equal('01:00', start.toTime().toString());
    });

    const dayAfterSamoaDateLineChange = ZonedDateTime.from('2011-12-31T22:00+14:00[Pacific/Apia]');
    const dayBeforeSamoaDateLineChange = ZonedDateTime.from('2011-12-29T22:00-10:00[Pacific/Apia]');
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
      const dstStart = hourBeforeDstStart.add({ hours: 1 });
      equal(dstStart.isOffsetTransition, true);
    });
    it('isOffsetTransition returns true at a DST end transition', () => {
      const dstEnd = ZonedDateTime.from('2020-11-01T01:00-08:00[America/Los_Angeles]');
      equal(dstEnd.isOffsetTransition, true);
    });
    it('isOffsetTransition returns true right after Samoa date line change', () => {
      const rightAfterSamoaDateLineChange = ZonedDateTime.from('2011-12-31T00:00+14:00[Pacific/Apia]');
      equal(rightAfterSamoaDateLineChange.isOffsetTransition, true);
    });
  });

  describe('math around DST', () => {
    it('add 1 hour to get to DST start', () => {
      const added = hourBeforeDstStart.add({ hours: 1 });
      equal(added.hour, 3);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 1);
      equal(diff.minutes, 0);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('add 2 hours to get to DST start +1', () => {
      const added = hourBeforeDstStart.add({ hours: 2 });
      equal(added.hour, 4);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 2);
      equal(diff.minutes, 0);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('add 1.5 hours to get to 0.5 hours after DST start', () => {
      const added = hourBeforeDstStart.add({ hours: 1, minutes: 30 });
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(hourBeforeDstStart, { largestUnit: 'hours' });
      equal(diff.days, 0);
      equal(diff.hours, 1);
      equal(diff.minutes, 30);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${hourBeforeDstStart}`);
    });

    it('Samoa date line change (add): 10:00PM 29 Dec 2011 -> 11:00PM 31 Dec 2011', () => {
      const dayBeforeSamoaDateLineChangeAbs = new Temporal.DateTime(2011, 12, 29, 22).toInstant('Pacific/Apia');
      const start = dayBeforeSamoaDateLineChangeAbs.toZonedDateTime('Pacific/Apia');
      const added = start.add({ days: 1, hours: 1 });
      equal(added.day, 31);
      equal(added.hour, 23);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 2);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${start}`);
    });

    it('Samoa date line change (subtract): 11:00PM 31 Dec 2011 -> 10:00PM 29 Dec 2011', () => {
      const dayAfterSamoaDateLineChangeAbs = new Temporal.DateTime(2011, 12, 31, 23).toInstant('Pacific/Apia');
      const start = dayAfterSamoaDateLineChangeAbs.toZonedDateTime('Pacific/Apia');
      const skipped = start.subtract({ days: 1, hours: 1 });
      equal(skipped.day, 31);
      equal(skipped.hour, 22);
      equal(skipped.minute, 0);
      const end = start.subtract({ days: 2, hours: 1 });
      equal(end.day, 29);
      equal(end.hour, 22);
      equal(end.minute, 0);
      const diff = end.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, -1);
      equal(diff.days, -2);
      const undo = start.add(diff);
      equal(`${undo}`, `${end}`);
    });

    it('3:30 day before DST start -> 3:30 day of DST start', () => {
      const start = dayBeforeDstStart.add({ hours: 1 }); // 3:30AM
      const added = start.add({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${start}`);
    });

    it('2:30 day before DST start -> 3:30 day of DST start', () => {
      const added = dayBeforeDstStart.add({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 30);
      const diff = added.difference(dayBeforeDstStart, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);
      const undo = dayBeforeDstStart.add(diff);
      equal(`${undo}`, `${added}`);
    });

    it('1:30 day DST starts -> 4:30 day DST starts', () => {
      const start = dayBeforeDstStart.add({ hours: 23 }); // 1:30AM
      const added = start.add({ hours: 2 });
      equal(added.day, 8);
      equal(added.hour, 4);
      equal(added.minute, 30);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 2);
      equal(diff.days, 0);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${start}`);
    });

    it('2:00 day before DST starts -> 3:00 day DST starts', () => {
      const start = hourBeforeDstStart.subtract({ days: 1 }).add({ hours: 1 }); // 2:00AM
      const added = start.add({ days: 1 });
      equal(added.day, 8);
      equal(added.hour, 3);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 1);

      const undo = start.add(diff);
      equal(`${undo}`, `${added}`);
    });

    it('1:00AM day DST starts -> (add 24 hours) -> 2:00AM day after DST starts', () => {
      const start = hourBeforeDstStart; // 1:00AM
      const added = start.add({ hours: 24 });
      equal(added.day, 9);
      equal(added.hour, 2);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 1);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${start}`);
    });

    it('12:00AM day DST starts -> (add 24 hours) -> 1:00AM day after DST starts', () => {
      const start = hourBeforeDstStart.subtract({ hours: 1 }); // 1:00AM
      const added = start.add({ hours: 24 });
      equal(added.day, 9);
      equal(added.hour, 1);
      equal(added.minute, 0);
      const diff = added.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 1);
      equal(diff.days, 1);
      const undo = added.subtract(diff);
      equal(`${undo}`, `${start}`);
    });

    it('Difference can return day length > 24 hours', () => {
      const start = ZonedDateTime.from('2020-10-30T01:45-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-11-02T01:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 30);
      equal(diff.hours, 24);
      equal(diff.days, 2);
      const undo = start.add(diff);
      equal(`${undo}`, `${end}`);
    });

    it('Difference rounding (nearest day) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { smallestUnit: 'days' }); // roundingMode: 'nearest'
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, -3);
    });

    it('Difference rounding (ceil day) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { smallestUnit: 'days', roundingMode: 'ceil' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, -2);
    });

    it('Difference rounding (trunc day) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { smallestUnit: 'days', roundingMode: 'trunc' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, -2);
    });

    it('Difference rounding (floor day) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { smallestUnit: 'days', roundingMode: 'floor' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, -3);
    });

    it('Difference rounding (nearest hour) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days', smallestUnit: 'hours' }); // roundingMode: 'nearest'
      equal(diff.minutes, 0);
      equal(diff.hours, -12);
      equal(diff.days, -2);
    });

    it('Difference rounding (ceil hour) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'ceil' });
      equal(diff.minutes, 0);
      equal(diff.hours, -12);
      equal(diff.days, -2);
    });

    it('Difference rounding (trunc hour) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'trunc' });
      equal(diff.minutes, 0);
      equal(diff.hours, -12);
      equal(diff.days, -2);
    });

    it('Difference rounding (floor hour) is DST-aware', () => {
      const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'floor' });
      equal(diff.minutes, 0);
      equal(diff.hours, -13);
      equal(diff.days, -2);
    });

    it('Difference when date portion ends inside a DST-skipped period', () => {
      const start = ZonedDateTime.from('2020-03-07T02:30-08:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-03-08T03:15-07:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 45);
      equal(diff.hours, 23);
      equal(diff.days, 0);
    });

    it("Difference when date portion ends inside day skipped by Samoa's 24hr 2011 transition", () => {
      const end = ZonedDateTime.from('2011-12-31T05:00+14:00[Pacific/Apia]');
      const start = ZonedDateTime.from('2011-12-28T10:00-10:00[Pacific/Apia]');
      const diff = end.difference(start, { largestUnit: 'days' });
      equal(diff.minutes, 0);
      equal(diff.hours, 19);
      equal(diff.days, 1);
    });

    it('Rounding up to hours causes one more day of overflow (positive)', () => {
      const start = ZonedDateTime.from('2020-01-01T00:00-08:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-01-03T23:59-08:00[America/Los_Angeles]');
      const diff = end.difference(start, { largestUnit: 'days', smallestUnit: 'hours' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, 3);
    });

    it('Rounding up to hours causes one more day of overflow (negative)', () => {
      const start = ZonedDateTime.from('2020-01-01T00:00-08:00[America/Los_Angeles]');
      const end = ZonedDateTime.from('2020-01-03T23:59-08:00[America/Los_Angeles]');
      const diff = start.difference(end, { largestUnit: 'days', smallestUnit: 'hours' });
      equal(diff.minutes, 0);
      equal(diff.hours, 0);
      equal(diff.days, -3);
    });

    it('addition and difference work near DST start', () => {
      // Test the difference between different distances near DST start
      const stepsPerHour = 2;
      const minutesPerStep = 60 / stepsPerHour;
      const hoursUntilEnd = 26;
      const startHourRange = 3;
      for (let i = 0; i < startHourRange * stepsPerHour; i++) {
        const start = hourBeforeDstStart.add({ minutes: minutesPerStep * i });
        for (let j = 0; j < hoursUntilEnd * stepsPerHour; j++) {
          const end = start.add({ minutes: j * minutesPerStep });
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

  describe('math order of operations and options', () => {
    const breakoutUnits = (
      op: 'add' | 'subtract',
      zdt: ZonedDateTime,
      d: Temporal.Duration,
      options: Temporal.ArithmeticOptions
    ) =>
      zdt[op]({ years: d.years }, options)
        [op]({ months: d.months }, options)
        [op]({ weeks: d.weeks }, options)
        [op]({ days: d.days }, options)
        [op](
          {
            hours: d.hours,
            minutes: d.minutes,
            seconds: d.seconds,
            milliseconds: d.milliseconds,
            microseconds: d.microseconds,
            nanoseconds: d.nanoseconds
          },
          options
        );

    it('order of operations: add / none', () => {
      const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = undefined;
      const result = zdt.add(d, options);
      equal(result.toString(), '2020-03-01T00:00-08:00[America/Los_Angeles]');
      equal(breakoutUnits('add', zdt, d, options).toString(), result.toString());
    });
    it('order of operations: add / constrain', () => {
      const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = { overflow: 'constrain' };
      const result = zdt.add(d, options);
      equal(result.toString(), '2020-03-01T00:00-08:00[America/Los_Angeles]');
      equal(breakoutUnits('add', zdt, d, options).toString(), result.toString());
    });
    it('order of operations: add / reject', () => {
      const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = { overflow: 'reject' };
      throws(() => zdt.add(d, options));
    });
    it('order of operations: subtract / none', () => {
      const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = undefined;
      const result = zdt.subtract(d, options);
      equal(result.toString(), '2020-02-28T00:00-08:00[America/Los_Angeles]');
      equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString());
    });
    it('order of operations: subtract / constrain', () => {
      const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = { overflow: 'constrain' };
      const result = zdt.subtract(d, options);
      equal(result.toString(), '2020-02-28T00:00-08:00[America/Los_Angeles]');
      equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString());
    });
    it('order of operations: subtract / reject', () => {
      const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]');
      const d = Temporal.Duration.from({ months: 1, days: 1 });
      const options: Temporal.ArithmeticOptions | undefined = { overflow: 'reject' };
      throws(() => zdt.subtract(d, options));
    });
  });
  describe('Structure', () => {
    it('ZonedDateTime is a Function', () => {
      equal(typeof ZonedDateTime, 'function');
    });
    it('ZonedDateTime has a prototype', () => {
      assert(ZonedDateTime.prototype);
      equal(typeof ZonedDateTime.prototype, 'object');
    });
    describe('ZonedDateTime.prototype', () => {
      it('ZonedDateTime.prototype has year', () => {
        assert('year' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has month', () => {
        assert('month' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has day', () => {
        assert('day' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has hour', () => {
        assert('hour' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has minute', () => {
        assert('minute' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has second', () => {
        assert('second' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has millisecond', () => {
        assert('millisecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has microsecond', () => {
        assert('microsecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has nanosecond', () => {
        assert('nanosecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype.with is a Function', () => {
        equal(typeof ZonedDateTime.prototype.with, 'function');
      });
      it('ZonedDateTime.prototype.add is a Function', () => {
        equal(typeof ZonedDateTime.prototype.add, 'function');
      });
      it('ZonedDateTime.prototype.subtract is a Function', () => {
        equal(typeof ZonedDateTime.prototype.subtract, 'function');
      });
      it('ZonedDateTime.prototype.difference is a Function', () => {
        equal(typeof ZonedDateTime.prototype.difference, 'function');
      });
      it('ZonedDateTime.prototype.equals is a Function', () => {
        equal(typeof ZonedDateTime.prototype.equals, 'function');
      });
      it('ZonedDateTime.prototype.getDate is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDate, 'function');
      });
      it('ZonedDateTime.prototype.getTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toTime, 'function');
      });
      it('ZonedDateTime.prototype.getFields is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getFields, 'function');
      });
      it('ZonedDateTime.prototype.getISOFields is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getISOFields, 'function');
      });
      it('ZonedDateTime.prototype.toString is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toString, 'function');
      });
      it('ZonedDateTime.prototype.toJSON is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toJSON, 'function');
      });
      it('ZonedDateTime.prototype has toInstant', () => {
        assert('toInstant' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has timeZone', () => {
        assert('timeZone' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has hoursInDay', () => {
        assert('hoursInDay' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has offsetNanoseconds', () => {
        assert('offsetNanoseconds' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has offsetString', () => {
        assert('offset' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype.getDateTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDateTime, 'function');
      });
    });
    it('ZonedDateTime.from is a Function', () => {
      equal(typeof ZonedDateTime.from, 'function');
    });
    it('ZonedDateTime.compare is a Function', () => {
      equal(typeof ZonedDateTime.compare, 'function');
    });
  });

  describe('Construction', () => {
    const epochMillis = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
    const zdt = new ZonedDateTime(epochNanos, tz);
    assert(zdt);
    equal(typeof zdt, 'object');
    equal(zdt.toInstant().epochSeconds, Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3), 'epochSeconds');
    equal(zdt.toInstant().epochMilliseconds, Date.UTC(1976, 10, 18, 15, 23, 30, 123), 'epochMilliseconds');

    describe('ZonedDateTime for (1976, 11, 18, 15, 23, 30, 123, 456, 789)', () => {
      it('datetime can be constructed', () => {
        const zonedDateTime = new ZonedDateTime(epochNanos, new Temporal.TimeZone('UTC'));
        assert(zonedDateTime);
        equal(typeof zonedDateTime, 'object');
      });
      const zonedDateTime: ZonedDateTime = new ZonedDateTime(epochNanos, new Temporal.TimeZone('UTC'));
      it('zonedDateTime.year is 1976', () => equal(zonedDateTime.year, 1976));
      it('zonedDateTime.month is 11', () => equal(zonedDateTime.month, 11));
      it('zonedDateTime.day is 18', () => equal(zonedDateTime.day, 18));
      it('zonedDateTime.hour is 15', () => equal(zonedDateTime.hour, 15));
      it('zonedDateTime.minute is 23', () => equal(zonedDateTime.minute, 23));
      it('zonedDateTime.second is 30', () => equal(zonedDateTime.second, 30));
      it('zonedDateTime.millisecond is 123', () => equal(zonedDateTime.millisecond, 123));
      it('zonedDateTime.microsecond is 456', () => equal(zonedDateTime.microsecond, 456));
      it('zonedDateTime.nanosecond is 789', () => equal(zonedDateTime.nanosecond, 789));
      it('zonedDateTime.dayOfWeek is 4', () => equal(zonedDateTime.dayOfWeek, 4));
      it('zonedDateTime.dayOfYear is 323', () => equal(zonedDateTime.dayOfYear, 323));
      it('zonedDateTime.weekOfYear is 47', () => equal(zonedDateTime.weekOfYear, 47));
      it('`${zonedDateTime}` is 1976-11-18T15:23:30.123456789+00:00[UTC]', () =>
        equal(`${zonedDateTime}`, '1976-11-18T15:23:30.123456789+00:00[UTC]'));
    });

    describe('epochXXX properties', () => {
      const ins = Temporal.Instant.from('1976-11-18T15:23:30.123456789Z');
      const zdt = ins.toZonedDateTime('America/Los_Angeles');
      it('zonedDateTime.epochNanoseconds is 217178610123456789n', () => equal(zdt.epochMicroseconds, 217178610123456n));
      it('zonedDateTime.epochMicroseconds is 217178610123456n', () => equal(zdt.epochMicroseconds, 217178610123456n));
      it('zonedDateTime.epochMilliseconds is 217178610123', () => equal(zdt.epochMilliseconds, 217178610123));
      it('zonedDateTime.epochSeconds is 217178610', () => equal(zdt.epochSeconds, 217178610));
    });
  });
  describe('.with manipulation', () => {
    const dt = new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    const zonedDateTime = ZonedDateTime.from({ ...dt.getFields(), timeZone: 'UTC' });
    it('zonedDateTime.with({ year: 2019 } works', () => {
      equal(`${zonedDateTime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ month: 5 } works', () => {
      equal(`${zonedDateTime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ day: 5 } works', () => {
      equal(`${zonedDateTime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ hour: 5 } works', () => {
      equal(`${zonedDateTime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ minute: 5 } works', () => {
      equal(`${zonedDateTime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ second: 5 } works', () => {
      equal(`${zonedDateTime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ millisecond: 5 } works', () => {
      equal(`${zonedDateTime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789+00:00[UTC]');
    });
    it('zonedDateTime.with({ microsecond: 5 } works', () => {
      equal(`${zonedDateTime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789+00:00[UTC]');
    });
    it('zonedDateTime.with({ nanosecond: 5 } works', () => {
      equal(`${zonedDateTime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005+00:00[UTC]');
    });
    it('zonedDateTime.with({ month: 5, second: 15 } works', () => {
      equal(`${zonedDateTime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789+00:00[UTC]');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        // @ts-ignore
        throws(() => zonedDateTime.with({ day: 5 }, { overflow }), RangeError)
      );
    });
  });
  describe('.withTimeZone manipulation', () => {
    it("zonedDateTime.withTimeZone('America/Los_Angeles') works", () => {
      const instant = Temporal.Instant.from('2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]');
      const zonedDateTime = instant.toZonedDateTime('UTC');
      equal(
        `${zonedDateTime.withTimeZone('America/Los_Angeles')}`,
        '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]'
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
