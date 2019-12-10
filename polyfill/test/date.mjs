#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal, throws } = Assert;

import { Date } from 'tc39-temporal';

describe('Date', () => {
  describe('Structure', () => {
    it('Date is a Function', () => {
      equal(typeof Date, 'function');
    });
    it('Date has a prototype', () => {
      assert(Date.prototype);
      equal(typeof Date.prototype, 'object');
    });
    describe('Date.prototype', () => {
      it('Date.prototype has year', () => {
        assert('year' in Date.prototype);
      });
      it('Date.prototype has month', () => {
        assert('month' in Date.prototype);
      });
      it('Date.prototype has day', () => {
        assert('day' in Date.prototype);
      });
      it('Date.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in Date.prototype);
      });
      it('Date.prototype has dayOfYear', () => {
        assert('dayOfYear' in Date.prototype);
      });
      it('Date.prototype has weekOfYear', () => {
        assert('weekOfYear' in Date.prototype);
      });
      it('Date.prototype.with is a Function', () => {
        equal(typeof Date.prototype.with, 'function');
      });
      it('Date.prototype.plus is a Function', () => {
        equal(typeof Date.prototype.plus, 'function');
      });
      it('Date.prototype.minus is a Function', () => {
        equal(typeof Date.prototype.minus, 'function');
      });
      it('Date.prototype.difference is a Function', () => {
        equal(typeof Date.prototype.difference, 'function');
      });
      it('Date.prototype.withTime is a Function', () => {
        equal(typeof Date.prototype.withTime, 'function');
      });
      it('Date.prototype.getYearMonth is a Function', () => {
        equal(typeof Date.prototype.getYearMonth, 'function');
      });
      it('Date.prototype.getMonthDay is a Function', () => {
        equal(typeof Date.prototype.getMonthDay, 'function');
      });
      it('Date.prototype.toString is a Function', () => {
        equal(typeof Date.prototype.toString, 'function');
      });
      it('Date.prototype.toJSON is a Function', () => {
        equal(typeof Date.prototype.toJSON, 'function');
      });
    });
    it('Date.from is a Function', () => {
      equal(typeof Date.from, 'function');
    });
  });
  describe('Construction', () => {
    let date;
    it('date can be constructed', () => {
      date = new Date(1976, 11, 18);
      assert(date);
      equal(typeof date, 'object');
    });
    it('date.year is 1976', () => equal(date.year, 1976));
    it('date.month is 11', () => equal(date.month, 11));
    it('date.day is 18', () => equal(date.day, 18));
    it('date.dayOfWeek is 4', () => equal(date.dayOfWeek, 4));
    it('date.dayOfYear is 323', () => equal(date.dayOfYear, 323));
    it('date.weekOfYear is 47', () => equal(date.weekOfYear, 47));
    it('`${date}` is 1976-11-18', () => equal(`${date}`, '1976-11-18'));

    describe('Disambiguation', () => {
      it('reject', () => throws(() => new Date(2019, 1, 32, 'reject'), RangeError));
      it('constrain', () => equal(`${new Date(2019, 1, 32, 'constrain')}`, '2019-01-31'));
      it('balance', () => equal(`${new Date(2019, 1, 32, 'balance')}`, '2019-02-01'));
      it('throw when bad disambiguation', () => throws(() => new Date(2019, 1, 1, 'xyz'), TypeError));
    });
  });
  describe('date fields', () => {
    const date = new Date(2019, 10, 6);
    const datetime = { year: 2019, month: 10, day: 1, hour: 14, minute: 20, second: 36 };
    const fromed = new Date(2019, 10, 1);
    it(`(${date}).dayOfWeek === 7`, () => equal(date.dayOfWeek, 7));
    it(`Temporal.Date.from(${date}) === (${date})`, () => equal(Date.from(date), date));
    it(`Temporal.Date.from(${JSON.stringify(datetime)}) instanceof Temporal.date`, () =>
      assert(Date.from(datetime) instanceof Date));
    it(`Temporal.Date.from(${JSON.stringify(datetime)}) === (${fromed})`, () =>
      equal(`${Date.from(datetime)}`, `${fromed}`));
  });
  describe('.with manipulation', () => {
    const original = new Date(1976, 11, 18);
    it('date.with({ year: 2019 } works', () => {
      const date = original.with({ year: 2019 });
      equal(`${date}`, '2019-11-18');
    });
    it('date.with({ month: 5 } works', () => {
      const date = original.with({ month: 5 });
      equal(`${date}`, '1976-05-18');
    });
    it('date.with({ day: 17 } works', () => {
      const date = original.with({ day: 17 });
      equal(`${date}`, '1976-11-17');
    });
  });
  describe('date.difference() works', () => {
    const date = new Date(1976, 11, 18);
    it('date.difference({ year: 1976, month: 10, day: 5 })', () => {
      const duration = date.difference({ year: 1976, month: 10, day: 5 });

      equal(duration.years, 0);
      equal(duration.months, 1);
      equal(duration.days, 13);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('date.difference({ year: 2019, month: 11, day: 18 })', () => {
      const duration = date.difference({ year: 2019, month: 11, day: 18 });
      equal(duration.years, 43);
      equal(duration.months, 0);
      equal(duration.days, 0);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
  });
  describe('date.plus() works', () => {
    let date = new Date(1976, 11, 18);
    it('date.plus({ years: 43 })', () => {
      equal(`${date.plus({ years: 43 })}`, '2019-11-18');
    });
    it('date.plus({ months: 3 })', () => {
      equal(`${date.plus({ months: 3 })}`, '1977-02-18');
    });
    it('date.plus({ days: 20 })', () => {
      equal(`${date.plus({ days: 20 })}`, '1976-12-08');
    });
    it('new Date(2019, 1, 31).plus({ months: 1 })', () => {
      equal(`${new Date(2019, 1, 31).plus({ months: 1 })}`, '2019-02-28');
    });
  });
  describe('date.toString() works', () => {
    it('new Date(1976, 11, 18).toString()', () => {
      equal(new Date(1976, 11, 18).toString(), '1976-11-18');
    });
    it('new Date(1914, 2, 23).toString()', () => {
      equal(new Date(1914, 2, 23).toString(), '1914-02-23');
    });
  });
  describe('Date.from() works', () => {
    it('Date.from("1976-11-18")', () => {
      const date = Date.from('1976-11-18');
      equal(date.year, 1976);
      equal(date.month, 11);
      equal(date.day, 18);
    });
    it('Date.from("2019-06-30")', () => {
      const date = Date.from('2019-06-30');
      equal(date.year, 2019);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+000050-06-30")', () => {
      const date = Date.from('+000050-06-30');
      equal(date.year, 50);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+010583-06-30")', () => {
      const date = Date.from('+010583-06-30');
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-010583-06-30")', () => {
      const date = Date.from('-010583-06-30');
      equal(date.year, -10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-000333-06-30")', () => {
      const date = Date.from('-000333-06-30');
      equal(date.year, -333);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it ('Date.from(1976-11-18) == 1976-11-18', () => {
      const orig = new Date(1976, 11, 18);
      const actual = Date.from(orig);
      equal(actual, orig);
    });
    it('Date.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18', () => equal(`${Date.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18'));
    it('DateTime.from({}) throws', () => throws(() => Date.from({}), RangeError));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
