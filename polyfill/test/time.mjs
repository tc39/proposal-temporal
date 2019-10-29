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
    it('Time.fromString is a Function', () => {
      equal(typeof Time.fromString, 'function');
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
    describe('Time.fromString() works', () => {
      it('Time.fromString("15:23")', () => {
        equal(`${Time.fromString('15:23')}`, '15:23');
      });
      it('Time.fromString("15:23:30")', () => {
        equal(`${Time.fromString('15:23:30')}`, '15:23:30');
      });
      it('Time.fromString("15:23:30.123")', () => {
        equal(`${Time.fromString('15:23:30.123')}`, '15:23:30.123');
      });
      it('Time.fromString("15:23:30.123456")', () => {
        equal(`${Time.fromString('15:23:30.123456')}`, '15:23:30.123456');
      });
      it('Time.fromString("15:23:30.123456789")', () => {
        equal(`${Time.fromString('15:23:30.123456789')}`, '15:23:30.123456789');
      });
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
    it(`Temporal.Time.fromString("${iso}") === (${iso})`, () => equal(`${Time.fromString(iso)}`, iso));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
