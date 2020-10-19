#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal } = assert;

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
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
