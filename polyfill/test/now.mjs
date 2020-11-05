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

describe('Temporal.now', () => {
  describe('Structure', () => {
    it('Temporal.now is an object', () => equal(typeof Temporal.now, 'object'));
    it('Temporal.now has 9 properties', () => equal(Object.keys(Temporal.now).length, 9));
    it('Temporal.now.instant is a function', () => equal(typeof Temporal.now.instant, 'function'));
    it('Temporal.now.plainDateTime is a function', () => equal(typeof Temporal.now.plainDateTime, 'function'));
    it('Temporal.now.plainDateTimeISO is a function', () => equal(typeof Temporal.now.plainDateTimeISO, 'function'));
    it('Temporal.now.plainDate is a function', () => equal(typeof Temporal.now.plainDate, 'function'));
    it('Temporal.now.plainDateISO is a function', () => equal(typeof Temporal.now.plainDateISO, 'function'));
    it('Temporal.now.plainTimeISO is a function', () => equal(typeof Temporal.now.plainTimeISO, 'function'));
    it('Temporal.now.timeZone is a function', () => equal(typeof Temporal.now.timeZone, 'function'));
    it('Temporal.now.zonedDateTimeISO is a function', () => equal(typeof Temporal.now.zonedDateTimeISO, 'function'));
    it('Temporal.now.zonedDateTime is a function', () => equal(typeof Temporal.now.zonedDateTime, 'function'));
  });
  describe('Temporal.now.instant()', () => {
    it('Temporal.now.instant() returns an Instant', () => assert(Temporal.now.instant() instanceof Temporal.Instant));
  });
  describe('Temporal.now.plainDateTimeISO()', () => {
    it('returns a DateTime in the ISO calendar', () => {
      const dt = Temporal.now.plainDateTimeISO();
      assert(dt instanceof Temporal.PlainDateTime);
      equal(dt.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.now.plainDateTime()', () => {
    it('returns a DateTime in the correct calendar', () => {
      const dt = Temporal.now.plainDateTime('gregory');
      assert(dt instanceof Temporal.PlainDateTime);
      equal(dt.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.now.plainDateTime(), RangeError));
  });
  describe('Temporal.now.zonedDateTimeISO()', () => {
    it('returns a ZonedDateTime in the correct calendar and system time zone', () => {
      const zdt = Temporal.now.zonedDateTimeISO();
      const tz = Temporal.now.timeZone();
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'iso8601');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, tz.id);
    });
    it('returns a ZonedDateTime in the correct calendar and specific time zone', () => {
      const zdt = Temporal.now.zonedDateTimeISO('America/Los_Angeles');
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'iso8601');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, 'America/Los_Angeles');
    });
  });
  describe('Temporal.now.zonedDateTime()', () => {
    it('returns a ZonedDateTime in the correct calendar and system time zone', () => {
      const zdt = Temporal.now.zonedDateTime('gregory');
      const tz = Temporal.now.timeZone();
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'gregory');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, tz.id);
    });
    it('returns a ZonedDateTime in the correct calendar and specific time zone', () => {
      const zdt = Temporal.now.zonedDateTime('gregory', 'America/Los_Angeles');
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'gregory');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, 'America/Los_Angeles');
    });
    it('requires a calendar', () => throws(() => Temporal.now.zonedDateTime(), RangeError));
  });
  describe('Temporal.now.plainDateISO()', () => {
    it('returns a Date in the ISO calendar', () => {
      const d = Temporal.now.plainDateISO();
      assert(d instanceof Temporal.PlainDate);
      equal(d.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.now.plainDate()', () => {
    it('returns a Date in the correct calendar', () => {
      const d = Temporal.now.plainDate('gregory');
      assert(d instanceof Temporal.PlainDate);
      equal(d.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.now.plainDate(), RangeError));
  });
  describe('Temporal.now.plainTimeISO()', () => {
    it('Temporal.now.plainTimeISO() returns a Time', () =>
      assert(Temporal.now.plainTimeISO() instanceof Temporal.PlainTime));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
