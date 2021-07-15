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

describe('Temporal.Now', () => {
  describe('Structure', () => {
    it('Temporal.Now is an object', () => equal(typeof Temporal.Now, 'object'));
    it('Temporal.Now has 9 properties', () => equal(Object.keys(Temporal.Now).length, 9));
    it('Temporal.Now.instant is a function', () => equal(typeof Temporal.Now.instant, 'function'));
    it('Temporal.Now.plainDateTime is a function', () => equal(typeof Temporal.Now.plainDateTime, 'function'));
    it('Temporal.Now.plainDateTimeISO is a function', () => equal(typeof Temporal.Now.plainDateTimeISO, 'function'));
    it('Temporal.Now.plainDate is a function', () => equal(typeof Temporal.Now.plainDate, 'function'));
    it('Temporal.Now.plainDateISO is a function', () => equal(typeof Temporal.Now.plainDateISO, 'function'));
    it('Temporal.Now.plainTimeISO is a function', () => equal(typeof Temporal.Now.plainTimeISO, 'function'));
    it('Temporal.Now.timeZone is a function', () => equal(typeof Temporal.Now.timeZone, 'function'));
    it('Temporal.Now.zonedDateTimeISO is a function', () => equal(typeof Temporal.Now.zonedDateTimeISO, 'function'));
    it('Temporal.Now.zonedDateTime is a function', () => equal(typeof Temporal.Now.zonedDateTime, 'function'));
  });
  describe('Temporal.Now.instant()', () => {
    it('Temporal.Now.instant() returns an Instant', () => assert(Temporal.Now.instant() instanceof Temporal.Instant));
  });
  describe('Temporal.Now.plainDateTimeISO()', () => {
    it('returns a DateTime in the ISO calendar', () => {
      const dt = Temporal.Now.plainDateTimeISO();
      assert(dt instanceof Temporal.PlainDateTime);
      equal(dt.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.Now.plainDateTime()', () => {
    it('returns a DateTime in the correct calendar', () => {
      const dt = Temporal.Now.plainDateTime('gregory');
      assert(dt instanceof Temporal.PlainDateTime);
      equal(dt.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.Now.plainDateTime(), RangeError));
  });
  describe('Temporal.Now.zonedDateTimeISO()', () => {
    it('returns a ZonedDateTime in the correct calendar and system time zone', () => {
      const zdt = Temporal.Now.zonedDateTimeISO();
      const tz = Temporal.Now.timeZone();
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'iso8601');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, tz.id);
    });
    it('returns a ZonedDateTime in the correct calendar and specific time zone', () => {
      const zdt = Temporal.Now.zonedDateTimeISO('America/Los_Angeles');
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'iso8601');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, 'America/Los_Angeles');
    });
  });
  describe('Temporal.Now.zonedDateTime()', () => {
    it('returns a ZonedDateTime in the correct calendar and system time zone', () => {
      const zdt = Temporal.Now.zonedDateTime('gregory');
      const tz = Temporal.Now.timeZone();
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'gregory');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, tz.id);
    });
    it('returns a ZonedDateTime in the correct calendar and specific time zone', () => {
      const zdt = Temporal.Now.zonedDateTime('gregory', 'America/Los_Angeles');
      assert(zdt instanceof Temporal.ZonedDateTime);
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'gregory');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, 'America/Los_Angeles');
    });
    it('requires a calendar', () => throws(() => Temporal.Now.zonedDateTime(), RangeError));
  });
  describe('Temporal.Now.plainDateISO()', () => {
    it('returns a Date in the ISO calendar', () => {
      const d = Temporal.Now.plainDateISO();
      assert(d instanceof Temporal.PlainDate);
      equal(d.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.Now.plainDate()', () => {
    it('returns a Date in the correct calendar', () => {
      const d = Temporal.Now.plainDate('gregory');
      assert(d instanceof Temporal.PlainDate);
      equal(d.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.Now.plainDate(), RangeError));
  });
  describe('Temporal.Now.plainTimeISO()', () => {
    it('Temporal.Now.plainTimeISO() returns a Time', () => {
      const t = Temporal.Now.plainTimeISO();
      assert(t instanceof Temporal.PlainTime);
      equal(t.calendar.id, 'iso8601');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
