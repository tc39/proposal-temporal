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

import * as Temporal from 'tc39-temporal';
const { Time } = Temporal;

describe('Time', () => {
  describe('Structure', () => {
    it('Time is a Function', () => {
      equal(typeof Time, 'function');
    });
    it('Time has a prototype', () => {
      assert(Time.prototype);
      equal(typeof Time.prototype, 'object');
    });
    describe('Time.prototype', () => {
      it('Time.prototype has hour', () => {
        assert('hour' in Time.prototype);
      });
      it('Time.prototype has minute', () => {
        assert('minute' in Time.prototype);
      });
      it('Time.prototype has second', () => {
        assert('second' in Time.prototype);
      });
      it('Time.prototype has millisecond', () => {
        assert('millisecond' in Time.prototype);
      });
      it('Time.prototype has microsecond', () => {
        assert('microsecond' in Time.prototype);
      });
      it('Time.prototype has nanosecond', () => {
        assert('nanosecond' in Time.prototype);
      });
      it('Time.prototype.with is a Function', () => {
        equal(typeof Time.prototype.with, 'function');
      });
      it('Time.prototype.plus is a Function', () => {
        equal(typeof Time.prototype.plus, 'function');
      });
      it('Time.prototype.minus is a Function', () => {
        equal(typeof Time.prototype.minus, 'function');
      });
      it('Time.prototype.difference is a Function', () => {
        equal(typeof Time.prototype.difference, 'function');
      });
      it('Time.prototype.withDate is a Function', () => {
        equal(typeof Time.prototype.withDate, 'function');
      });
      it('Time.prototype.toString is a Function', () => {
        equal(typeof Time.prototype.toString, 'function');
      });
      it('Time.prototype.toJSON is a Function', () => {
        equal(typeof Time.prototype.toJSON, 'function');
      });
    });
    it('Time.from is a Function', () => {
      equal(typeof Time.from, 'function');
    });
  });
  describe('Construction', () => {
    describe('complete', () => {
      let time;
      it('time can be constructed', () => {
        time = new Time(15, 23, 30, 123, 456, 789);
        assert(time);
        equal(typeof time, 'object');
      });
      it('time.hour is 15', () => equal(time.hour, 15));
      it('time.minute is 23', () => equal(time.minute, 23));
      it('time.second is 30', () => equal(time.second, 30));
      it('time.millisecond is 123', () => equal(time.millisecond, 123));
      it('time.microsecond is 456', () => equal(time.microsecond, 456));
      it('time.nanosecond is 789', () => equal(time.nanosecond, 789));
      it('`${time}` is 15:23:30.123456789', () => equal(`${time}`, '15:23:30.123456789'));
    });
    describe('missing nanosecond', () => {
      let time;
      it('time can be constructed', () => {
        time = new Time(15, 23, 30, 123, 456);
        assert(time);
        equal(typeof time, 'object');
      });
      it('time.hour is 15', () => equal(time.hour, 15));
      it('time.minute is 23', () => equal(time.minute, 23));
      it('time.second is 30', () => equal(time.second, 30));
      it('time.millisecond is 123', () => equal(time.millisecond, 123));
      it('time.microsecond is 456', () => equal(time.microsecond, 456));
      it('time.nanosecond is 0', () => equal(time.nanosecond, 0));
      it('`${time}` is 15:23:30.123456', () => equal(`${time}`, '15:23:30.123456'));
    });
    describe('missing microsecond', () => {
      let time;
      it('time can be constructed', () => {
        time = new Time(15, 23, 30, 123);
        assert(time);
        equal(typeof time, 'object');
      });
      it('time.hour is 15', () => equal(time.hour, 15));
      it('time.minute is 23', () => equal(time.minute, 23));
      it('time.second is 30', () => equal(time.second, 30));
      it('time.millisecond is 123', () => equal(time.millisecond, 123));
      it('time.microsecond is 0', () => equal(time.microsecond, 0));
      it('time.nanosecond is 0', () => equal(time.nanosecond, 0));
      it('`${time}` is 15:23:30.123', () => equal(`${time}`, '15:23:30.123'));
    });
    describe('missing millisecond', () => {
      let time;
      it('time can be constructed', () => {
        time = new Time(15, 23, 30);
        assert(time);
        equal(typeof time, 'object');
      });
      it('time.hour is 15', () => equal(time.hour, 15));
      it('time.minute is 23', () => equal(time.minute, 23));
      it('time.second is 30', () => equal(time.second, 30));
      it('time.millisecond is 0', () => equal(time.millisecond, 0));
      it('time.microsecond is 0', () => equal(time.microsecond, 0));
      it('time.nanosecond is 0', () => equal(time.nanosecond, 0));
      it('`${time}` is 15:23:30', () => equal(`${time}`, '15:23:30'));
    });
    describe('missing second', () => {
      let time;
      it('time can be constructed', () => {
        time = new Time(15, 23);
        assert(time);
        equal(typeof time, 'object');
      });
      it('time.hour is 15', () => equal(time.hour, 15));
      it('time.minute is 23', () => equal(time.minute, 23));
      it('time.second is 0', () => equal(time.second, 0));
      it('time.millisecond is 0', () => equal(time.millisecond, 0));
      it('time.microsecond is 0', () => equal(time.microsecond, 0));
      it('time.nanosecond is 0', () => equal(time.nanosecond, 0));
      it('`${time}` is 15:23', () => equal(`${time}`, '15:23'));
    });
    describe('balance tests', () => {
      let balanceTests = [
        [[15, 23, 30, 123, 456, -1000], [15, 23, 30, 123, 455, 0], 'nanosecond = -1000'],
        [[15, 23, 30, 123, 456, -789], [15, 23, 30, 123, 455, 211], 'nanosecond = -789'],
        [[15, 23, 30, 123, 456, 1000], [15, 23, 30, 123, 457, 0], 'nanosecond = 1000'],
        [[15, 23, 30, 123, -1000, 456], [15, 23, 30, 122, 0, 456], 'microsecond = -1000'],
        [[15, 23, 30, 123, -789, 456], [15, 23, 30, 122, 211, 456], 'microsecond = -789'],
        [[15, 23, 30, 123, 1000, 456], [15, 23, 30, 124, 0, 456], 'microsecond = 1000'],
        [[15, 23, 30, -1000, 123, 456], [15, 23, 29, 0, 123, 456], 'millisecond = -1000'],
        [[15, 23, 30, -789, 123, 456], [15, 23, 29, 211, 123, 456], 'millisecond = -789'],
        [[15, 23, 30, 1000, 123, 456], [15, 23, 31, 0, 123, 456], 'millisecond = 1000'],
        [[15, 23, -60, 123, 456, 789], [15, 22, 0, 123, 456, 789], 'second = -60'],
        [[15, 23, -34, 123, 456, 789], [15, 22, 26, 123, 456, 789], 'second = -34'],
        [[15, 23, 60, 123, 456, 789], [15, 24, 0, 123, 456, 789], 'second = 60'],
        [[15, -60, 23, 123, 456, 789], [14, 0, 23, 123, 456, 789], 'minute = -60'],
        [[15, -34, 23, 123, 456, 789], [14, 26, 23, 123, 456, 789], 'minute = -34'],
        [[15, 60, 23, 123, 456, 789], [16, 0, 23, 123, 456, 789], 'minute = 60'],
        [[-24, 23, 30, 123, 456, 789], [0, 23, 30, 123, 456, 789], 'hour = -24'],
        [[-3, 23, 30, 123, 456, 789], [21, 23, 30, 123, 456, 789], 'hour = -3'],
        [[24, 23, 30, 123, 456, 789], [0, 23, 30, 123, 456, 789], 'hour = 24']
      ];
      for (const [args, expected, description] of balanceTests) {
        describe(description, () => {
          let time;
          it('time can be constructed', () => {
            time = new Time(...args, 'balance');
            assert(time);
            equal(typeof time, 'object');
          });
          it(`time.hour is ${expected[0]}`, () => equal(time.hour, expected[0]));
          it(`time.minute is ${expected[1]}`, () => equal(time.minute, expected[1]));
          it(`time.second is ${expected[2]}`, () => equal(time.second, expected[2]));
          it(`time.millisecond is ${expected[3]}`, () => equal(time.millisecond, expected[3]));
          it(`time.microsecond is ${expected[4]}`, () => equal(time.microsecond, expected[4]));
          it(`time.nanosecond is ${expected[5]}`, () => equal(time.nanosecond, expected[5]));
        });
      }
    });
    describe('.with manipulation', () => {
      const time = new Time(15, 23, 30, 123, 456, 789);
      it('time.with({ hour: 3 } works', () => {
        equal(`${time.with({ hour: 3 })}`, '03:23:30.123456789');
      });
      it('time.with({ minute: 3 } works', () => {
        equal(`${time.with({ minute: 3 })}`, '15:03:30.123456789');
      });
      it('time.with({ second: 3 } works', () => {
        equal(`${time.with({ second: 3 })}`, '15:23:03.123456789');
      });
      it('time.with({ millisecond: 3 } works', () => {
        equal(`${time.with({ millisecond: 3 })}`, '15:23:30.003456789');
      });
      it('time.with({ microsecond: 3 } works', () => {
        equal(`${time.with({ microsecond: 3 })}`, '15:23:30.123003789');
      });
      it('time.with({ nanosecond: 3 } works', () => {
        equal(`${time.with({ nanosecond: 3 })}`, '15:23:30.123456003');
      });
      it('time.with({ minute: 8, nanosecond: 3 } works', () => {
        equal(`${time.with({ minute: 8, nanosecond: 3 })}`, '15:08:30.123456003');
      });
    });
    describe('time.difference() works', () => {
      const time = new Time(15, 23, 30, 123, 456, 789);
      const one = new Time(14, 23, 30, 123, 456, 789);
      it(`(${time}).difference(${one}) => PT1H`, () => {
        const duration = time.difference(one);
        equal(`${duration}`, 'PT1H');
      });
      const two = new Time(13, 30, 30, 123, 456, 789);
      it(`(${time}).difference(${two}) => PT1H53M`, () => {
        const duration = time.difference(two);
        equal(`${duration}`, 'PT1H53M');
      });
    });
    describe('time.plus() works', () => {
      const time = new Time(15, 23, 30, 123, 456, 789);
      it(`(${time}).plus({ hours: 16 })`, () => {
        equal(`${time.plus({ hours: 16 })}`, '07:23:30.123456789');
      });
      it(`(${time}).plus({ minutes: 45 })`, () => {
        equal(`${time.plus({ minutes: 45 })}`, '16:08:30.123456789');
      });
      it(`(${time}).plus({ nanoseconds: 300 })`, () => {
        equal(`${time.plus({ nanoseconds: 300 })}`, '15:23:30.123457089');
      });
    });
    describe('time.toString() works', () => {
      it('new Time(15, 23).toString()', () => {
        equal(new Time(15, 23).toString(), '15:23');
      });
      it('new Time(15, 23, 30).toString()', () => {
        equal(new Time(15, 23, 30).toString(), '15:23:30');
      });
      it('new Time(15, 23, 30, 123).toString()', () => {
        equal(new Time(15, 23, 30, 123).toString(), '15:23:30.123');
      });
      it('new Time(15, 23, 30, 123, 456).toString()', () => {
        equal(new Time(15, 23, 30, 123, 456).toString(), '15:23:30.123456');
      });
      it('new Time(15, 23, 30, 123, 456, 789).toString()', () => {
        equal(new Time(15, 23, 30, 123, 456, 789).toString(), '15:23:30.123456789');
      });
    });
    describe('Time.from() works', () => {
      it('Time.from("15:23")', () => {
        equal(`${Time.from('15:23')}`, '15:23');
      });
      it('Time.from("15:23:30")', () => {
        equal(`${Time.from('15:23:30')}`, '15:23:30');
      });
      it('Time.from("15:23:30.123")', () => {
        equal(`${Time.from('15:23:30.123')}`, '15:23:30.123');
      });
      it('Time.from("15:23:30.123456")', () => {
        equal(`${Time.from('15:23:30.123456')}`, '15:23:30.123456');
      });
      it('Time.from("15:23:30.123456789")', () => {
        equal(`${Time.from('15:23:30.123456789')}`, '15:23:30.123456789');
      });
      it('Time.from({}) throws', () => throws(() => Time.from({}), RangeError));
    });
    describe('Disambiguation', () => {
      it('reject', () => throws(() => new Time(0, 0, 0, 0, 0, 1000, 'reject'), RangeError));
      it('constrain', () => equal(`${new Time(0, 0, 0, 0, 0, 1000, 'constrain')}`, '00:00:00.000000999'));
      it('balance', () => equal(`${new Time(0, 0, 0, 0, 0, 1000, 'balance')}`, '00:00:00.000001'));
      it('throw when bad disambiguation', () => throws(() => new Time(0, 0, 0, 0, 0, 1, 'xyz'), TypeError));
    });
  });
  describe('time operations', () => {
    const datetime = { year: 2019, month: 10, day: 1, hour: 14, minute: 20, second: 36 };
    const fromed = new Time(14, 20, 36);
    it(`Temporal.Time.from(${JSON.stringify(datetime)}) instanceof Temporal.Time`, () =>
      assert(Time.from(datetime) instanceof Time));
    it(`Temporal.Time.from(${JSON.stringify(datetime)}) === ${fromed}`, () =>
      equal(`${Time.from(datetime)}`, `${fromed}`));

    const iso = '20:18:32';
    it(`Temporal.Time.from("${iso}") === (${iso})`, () => equal(`${Time.from(iso)}`, iso));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
