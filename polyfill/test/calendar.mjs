#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { Calendar } = Temporal;

describe('Calendar', () => {
  describe('Structure', () => {
    it('Calendar is a Function', () => {
      equal(typeof Calendar, 'function');
    });
    it('Calendar has a prototype', () => {
      assert(Calendar.prototype);
      equal(typeof Calendar.prototype, 'object');
    });
    describe('Calendar.prototype', () => {
      it('Calendar.prototype has id', () => {
        assert('id' in Calendar.prototype);
      });
      it('Calendar.prototype.dateFromFields is a Function', () => {
        equal(typeof Calendar.prototype.dateFromFields, 'function');
      });
      it('Calendar.prototype.yearMonthFromFields is a Function', () => {
        equal(typeof Calendar.prototype.yearMonthFromFields, 'function');
      });
      it('Calendar.prototype.monthDayFromFields is a Function', () => {
        equal(typeof Calendar.prototype.monthDayFromFields, 'function');
      });
      it('Calendar.prototype.dateAdd is a Function', () => {
        equal(typeof Calendar.prototype.dateAdd, 'function');
      });
      it('Calendar.prototype.dateSubtract is a Function', () => {
        equal(typeof Calendar.prototype.dateSubtract, 'function');
      });
      it('Calendar.prototype.dateDifference is a Function', () => {
        equal(typeof Calendar.prototype.dateDifference, 'function');
      });
      it('Calendar.prototype.year is a Function', () => {
        equal(typeof Calendar.prototype.year, 'function');
      });
      it('Calendar.prototype.month is a Function', () => {
        equal(typeof Calendar.prototype.month, 'function');
      });
      it('Calendar.prototype.day is a Function', () => {
        equal(typeof Calendar.prototype.day, 'function');
      });
      it('Calendar.prototype.era is a Function', () => {
        equal(typeof Calendar.prototype.era, 'function');
      });
      it('Calendar.prototype.dayOfWeek is a Function', () => {
        equal(typeof Calendar.prototype.dayOfWeek, 'function');
      });
      it('Calendar.prototype.dayOfYear is a Function', () => {
        equal(typeof Calendar.prototype.dayOfYear, 'function');
      });
      it('Calendar.prototype.weekOfYear is a Function', () => {
        equal(typeof Calendar.prototype.weekOfYear, 'function');
      });
      it('Calendar.prototype.daysInWeek is a Function', () => {
        equal(typeof Calendar.prototype.daysInWeek, 'function');
      });
      it('Calendar.prototype.daysInMonth is a Function', () => {
        equal(typeof Calendar.prototype.daysInMonth, 'function');
      });
      it('Calendar.prototype.daysInYear is a Function', () => {
        equal(typeof Calendar.prototype.daysInYear, 'function');
      });
      it('Calendar.prototype.monthsInYear is a Function', () => {
        equal(typeof Calendar.prototype.monthsInYear, 'function');
      });
      it('Calendar.prototype.isLeapYear is a Function', () => {
        equal(typeof Calendar.prototype.isLeapYear, 'function');
      });
      it('Calendar.prototype.toString is a Function', () => {
        equal(typeof Calendar.prototype.toString, 'function');
      });
    });
    it('Calendar.from is a Function', () => {
      equal(typeof Calendar.from, 'function');
    });
  });
  describe('Calendar.from()', () => {
    describe('from identifier', () => {
      test('iso8601');
      test('gregory');
      test('japanese');
      function test(id) {
        const calendar = Calendar.from(id);
        it(`Calendar.from(${id}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${id}) has the correct ID`, () => equal(calendar.id, id));
      }
      it('other types with a calendar are accepted', () => {
        [
          Temporal.Date.from('1976-11-18[c=gregory]'),
          Temporal.DateTime.from('1976-11-18[c=gregory]'),
          Temporal.MonthDay.from('1972-11-18[c=gregory]'),
          Temporal.YearMonth.from('1976-11-01[c=gregory]')
        ].forEach((obj) => {
          const calFrom = Calendar.from(obj);
          assert(calFrom instanceof Calendar);
          equal(calFrom.id, 'gregory');
        });
      });
      it('property bag with calendar object is accepted', () => {
        const cal = new Calendar('iso8601');
        const calFrom = Calendar.from({ calendar: cal });
        assert(calFrom instanceof Calendar);
        equal(calFrom.id, 'iso8601');
      });
      it('property bag with string is accepted', () => {
        const calFrom = Calendar.from({ calendar: 'iso8601' });
        assert(calFrom instanceof Calendar);
        equal(calFrom.id, 'iso8601');
      });
      it('property bag with custom calendar is accepted', () => {
        const custom = { id: 'custom-calendar' };
        const calFrom = Calendar.from({ calendar: custom });
        equal(calFrom, custom);
      });
      it('throws with bad identifier', () => {
        throws(() => Calendar.from('local'), RangeError);
        throws(() => Calendar.from('iso-8601'), RangeError);
        throws(() => Calendar.from('[c=iso8601]'), RangeError);
      });
      it('throws with bad value in property bag', () => {
        throws(() => Calendar.from({ calendar: 'local' }), RangeError);
        throws(() => Calendar.from({ calendar: { calendar: 'iso8601' } }), RangeError);
      });
    });
    describe('Calendar.from(ISO string)', () => {
      test('1994-11-05T08:15:30-05:00', 'iso8601');
      test('1994-11-05T08:15:30-05:00[c=gregory]', 'gregory');
      test('1994-11-05T13:15:30Z[c=japanese]', 'japanese');
      function test(isoString, id) {
        const calendar = Calendar.from(isoString);
        it(`Calendar.from(${isoString}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${isoString}) has ID ${id}`, () => equal(calendar.id, id));
      }
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
