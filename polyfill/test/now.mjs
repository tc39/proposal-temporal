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
    it('Temporal.now has 7 properties', () => equal(Object.keys(Temporal.now).length, 7));
    it('Temporal.now.instant is a function', () => equal(typeof Temporal.now.instant, 'function'));
    it('Temporal.now.dateTime is a function', () => equal(typeof Temporal.now.dateTime, 'function'));
    it('Temporal.now.dateTimeISO is a function', () => equal(typeof Temporal.now.dateTimeISO, 'function'));
    it('Temporal.now.date is a function', () => equal(typeof Temporal.now.date, 'function'));
    it('Temporal.now.dateISO is a function', () => equal(typeof Temporal.now.dateISO, 'function'));
    it('Temporal.now.timeISO is a function', () => equal(typeof Temporal.now.timeISO, 'function'));
    it('Temporal.now.timeZone is a function', () => equal(typeof Temporal.now.timeZone, 'function'));
  });
  describe('Temporal.now.instant()', () => {
    it('Temporal.now.instant() returns an Instant', () => assert(Temporal.now.instant() instanceof Temporal.Instant));
  });
  describe('Temporal.now.dateTimeISO()', () => {
    it('returns a DateTime in the ISO calendar', () => {
      const dt = Temporal.now.dateTimeISO();
      assert(dt instanceof Temporal.DateTime);
      equal(dt.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.now.dateTime()', () => {
    it('returns a DateTime in the correct calendar', () => {
      const dt = Temporal.now.dateTime('gregory');
      assert(dt instanceof Temporal.DateTime);
      equal(dt.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.now.dateTime(), RangeError));
  });
  describe('Temporal.now.dateISO()', () => {
    it('returns a Date in the ISO calendar', () => {
      const d = Temporal.now.dateISO();
      assert(d instanceof Temporal.Date);
      equal(d.calendar.id, 'iso8601');
    });
  });
  describe('Temporal.now.date()', () => {
    it('returns a Date in the correct calendar', () => {
      const d = Temporal.now.date('gregory');
      assert(d instanceof Temporal.Date);
      equal(d.calendar.id, 'gregory');
    });
    it('requires a calendar', () => throws(() => Temporal.now.date(), RangeError));
  });
  describe('Temporal.now.timeISO()', () => {
    it('Temporal.now.timeISO() returns a Time', () => assert(Temporal.now.timeISO() instanceof Temporal.Time));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
