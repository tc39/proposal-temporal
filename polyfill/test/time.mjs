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
const { equal, notEqual, throws, deepEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { Time, DateTime } = Temporal;

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
      it('Time.prototype.equals is a Function', () => {
        equal(typeof Time.prototype.equals, 'function');
      });
      it('Time.prototype.toDateTime is a Function', () => {
        equal(typeof Time.prototype.toDateTime, 'function');
      });
      it('Time.prototype.getFields is a Function', () => {
        equal(typeof Time.prototype.getFields, 'function');
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
    it('Time.compare is a Function', () => {
      equal(typeof Time.compare, 'function');
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
    describe('missing minute', () => {
      const time = new Time(15);
      it('`${time}` is 15:00', () => equal(`${time}`, '15:00'));
    });
    describe('missing all parameters', () => {
      const time = new Time();
      it('`${time}` is 00:00', () => equal(`${time}`, '00:00'));
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
      it('invalid disambiguation', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
          throws(() => time.with({ hour: 3 }, { disambiguation }), RangeError)
        );
      });
    });
    describe('time.toDateTime() works', () => {
      const time = Time.from('11:30:23.123456789');
      const dt = time.toDateTime(Temporal.Date.from('1976-11-18'));
      it('returns a Temporal.DateTime', () => assert(dt instanceof Temporal.DateTime));
      it('combines the date and time', () => equal(`${dt}`, '1976-11-18T11:30:23.123456789'));
      it("doesn't cast argument", () => {
        throws(() => time.toDateTime({ year: 1976, month: 11, day: 18 }), TypeError);
        throws(() => time.toDateTime('1976-11-18'), TypeError);
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
      it('reverse argument order will throw', () => {
        throws(() => one.difference(time, { largestUnit: 'minutes' }), RangeError);
      });
      it("doesn't cast argument", () => {
        throws(() => time.difference({ hour: 16, minute: 34 }), TypeError);
        throws(() => time.difference('16:34'), TypeError);
      });
      const time1 = Time.from('10:23:15');
      const time2 = Time.from('17:15:57');
      it('the default largest unit is at least hours', () => {
        equal(`${time2.difference(time1)}`, 'PT6H52M42S');
        equal(`${time2.difference(time1, { largestUnit: 'hours' })}`, 'PT6H52M42S');
      });
      it('higher units have no effect', () => {
        equal(`${time2.difference(time1, { largestUnit: 'days' })}`, 'PT6H52M42S');
        equal(`${time2.difference(time1, { largestUnit: 'weeks' })}`, 'PT6H52M42S');
        equal(`${time2.difference(time1, { largestUnit: 'months' })}`, 'PT6H52M42S');
        equal(`${time2.difference(time1, { largestUnit: 'years' })}`, 'PT6H52M42S');
      });
      it('can return lower units', () => {
        equal(`${time2.difference(time1, { largestUnit: 'minutes' })}`, 'PT412M42S');
        equal(`${time2.difference(time1, { largestUnit: 'seconds' })}`, 'PT24762S');
      });
      it('can return subseconds', () => {
        const time3 = time2.plus({ milliseconds: 250, microseconds: 250, nanoseconds: 250 });

        const msDiff = time3.difference(time1, { largestUnit: 'milliseconds' });
        equal(msDiff.seconds, 0);
        equal(msDiff.milliseconds, 24762250);
        equal(msDiff.microseconds, 250);
        equal(msDiff.nanoseconds, 250);

        const µsDiff = time3.difference(time1, { largestUnit: 'microseconds' });
        equal(µsDiff.milliseconds, 0);
        equal(µsDiff.microseconds, 24762250250);
        equal(µsDiff.nanoseconds, 250);

        const nsDiff = time3.difference(time1, { largestUnit: 'nanoseconds' });
        equal(nsDiff.microseconds, 0);
        equal(nsDiff.nanoseconds, 24762250250250);
      });
    });
    describe('Time.compare() works', () => {
      const t1 = Time.from('08:44:15.321');
      const t2 = Time.from('14:23:30.123');
      it('equal', () => equal(Time.compare(t1, t1), 0));
      it('smaller/larger', () => equal(Time.compare(t1, t2), -1));
      it('larger/smaller', () => equal(Time.compare(t2, t1), 1));
      it("doesn't cast first argument", () => {
        throws(() => Time.compare({ hour: 16, minute: 34 }, t2), TypeError);
        throws(() => Time.compare('16:34', t2), TypeError);
      });
      it("doesn't cast second argument", () => {
        throws(() => Time.compare(t1, { hour: 16, minute: 34 }), TypeError);
        throws(() => Time.compare(t1, '16:34'), TypeError);
      });
    });
    describe('time.equals() works', () => {
      const t1 = Time.from('08:44:15.321');
      const t2 = Time.from('14:23:30.123');
      it('equal', () => assert(t1.equals(t1)));
      it('unequal', () => assert(!t1.equals(t2)));
      it("doesn't cast argument", () => {
        throws(() => t1.equals('08:44:15.321'), TypeError);
        throws(() => t1.equals({ hour: 8, minute: 44, second: 15, millisecond: 321 }), TypeError);
      });
    });
    describe("Comparison operators don't work", () => {
      const t1 = Time.from('09:36:29.123456789');
      const t1again = Time.from('09:36:29.123456789');
      const t2 = Time.from('15:23:30.123456789');
      it('=== is object equality', () => equal(t1, t1));
      it('!== is object equality', () => notEqual(t1, t1again));
      it('<', () => throws(() => t1 < t2));
      it('>', () => throws(() => t1 > t2));
      it('<=', () => throws(() => t1 <= t2));
      it('>=', () => throws(() => t1 >= t2));
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
      it('symmetric with regard to negative durations', () => {
        equal(`${Time.from('07:23:30.123456789').plus({ hours: -16 })}`, '15:23:30.123456789');
        equal(`${Time.from('16:08:30.123456789').plus({ minutes: -45 })}`, '15:23:30.123456789');
        equal(`${Time.from('15:23:30.123457089').plus({ nanoseconds: -300 })}`, '15:23:30.123456789');
      });
      it('time.plus(durationObj)', () => {
        equal(`${time.plus(Temporal.Duration.from('PT16H'))}`, '07:23:30.123456789');
      });
      it('ignores higher units', () => {
        equal(`${time.plus({ days: 1 })}`, '15:23:30.123456789');
        equal(`${time.plus({ months: 1 })}`, '15:23:30.123456789');
        equal(`${time.plus({ years: 1 })}`, '15:23:30.123456789');
      });
      it('invalid disambiguation', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
          throws(() => time.plus({ hours: 1 }, { disambiguation }), RangeError)
        );
      });
      it('mixed positive and negative values always throw', () => {
        ['constrain', 'reject'].forEach((disambiguation) =>
          throws(() => time.plus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
        );
      });
    });
    describe('time.minus() works', () => {
      const time = Time.from('15:23:30.123456789');
      it(`(${time}).minus({ hours: 16 })`, () => equal(`${time.minus({ hours: 16 })}`, '23:23:30.123456789'));
      it(`(${time}).minus({ minutes: 45 })`, () => equal(`${time.minus({ minutes: 45 })}`, '14:38:30.123456789'));
      it(`(${time}).minus({ seconds: 45 })`, () => equal(`${time.minus({ seconds: 45 })}`, '15:22:45.123456789'));
      it(`(${time}).minus({ milliseconds: 800 })`, () =>
        equal(`${time.minus({ milliseconds: 800 })}`, '15:23:29.323456789'));
      it(`(${time}).minus({ microseconds: 800 })`, () =>
        equal(`${time.minus({ microseconds: 800 })}`, '15:23:30.122656789'));
      it(`(${time}).minus({ nanoseconds: 800 })`, () =>
        equal(`${time.minus({ nanoseconds: 800 })}`, '15:23:30.123455989'));
      it('symmetric with regard to negative durations', () => {
        equal(`${Time.from('23:23:30.123456789').minus({ hours: -16 })}`, '15:23:30.123456789');
        equal(`${Time.from('14:38:30.123456789').minus({ minutes: -45 })}`, '15:23:30.123456789');
        equal(`${Time.from('15:22:45.123456789').minus({ seconds: -45 })}`, '15:23:30.123456789');
        equal(`${Time.from('15:23:29.323456789').minus({ milliseconds: -800 })}`, '15:23:30.123456789');
        equal(`${Time.from('15:23:30.122656789').minus({ microseconds: -800 })}`, '15:23:30.123456789');
        equal(`${Time.from('15:23:30.123455989').minus({ nanoseconds: -800 })}`, '15:23:30.123456789');
      });
      it('time.minus(durationObj)', () => {
        equal(`${time.minus(Temporal.Duration.from('PT16H'))}`, '23:23:30.123456789');
      });
      it('ignores higher units', () => {
        equal(`${time.minus({ days: 1 })}`, '15:23:30.123456789');
        equal(`${time.minus({ months: 1 })}`, '15:23:30.123456789');
        equal(`${time.minus({ years: 1 })}`, '15:23:30.123456789');
      });
      it('invalid disambiguation', () => {
        ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
          throws(() => time.minus({ hours: 1 }, { disambiguation }), RangeError)
        );
      });
      it('mixed positive and negative values always throw', () => {
        ['constrain', 'reject'].forEach((disambiguation) =>
          throws(() => time.minus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
        );
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
      it('Time.from({ hour: 15, minute: 23 })', () => equal(`${Time.from({ hour: 15, minute: 23 })}`, '15:23'));
      it('Time.from({ minute: 30, microsecond: 555 })', () =>
        equal(`${Time.from({ minute: 30, microsecond: 555 })}`, '00:30:00.000555'));
      it('Time.from({})', () => equal(`${Time.from({})}`, `${new Time()}`));
      it('Time.from(ISO string leap second) is constrained', () => {
        equal(`${Time.from('23:59:60')}`, '23:59:59');
        equal(`${Time.from('23:59:60', { disambiguation: 'reject' })}`, '23:59:59');
      });
      it('Time.from(number) is converted to string', () => equal(`${Time.from(1523)}`, `${Time.from('1523')}`));
      it('Time.from(time) returns the same properties', () => {
        const t = Time.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
        deepEqual(Time.from(t).getFields(), t.getFields());
      });
      it('Time.from(dateTime) returns the same time properties', () => {
        const dt = DateTime.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
        deepEqual(Time.from(dt).getFields(), dt.toTime().getFields());
      });
      it('Time.from(time) is not the same object', () => {
        const t = Time.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
        notEqual(Time.from(t), t);
      });
      it('any number of decimal places', () => {
        equal(`${Time.from('1976-11-18T15:23:30.1Z')}`, '15:23:30.100');
        equal(`${Time.from('1976-11-18T15:23:30.12Z')}`, '15:23:30.120');
        equal(`${Time.from('1976-11-18T15:23:30.123Z')}`, '15:23:30.123');
        equal(`${Time.from('1976-11-18T15:23:30.1234Z')}`, '15:23:30.123400');
        equal(`${Time.from('1976-11-18T15:23:30.12345Z')}`, '15:23:30.123450');
        equal(`${Time.from('1976-11-18T15:23:30.123456Z')}`, '15:23:30.123456');
        equal(`${Time.from('1976-11-18T15:23:30.1234567Z')}`, '15:23:30.123456700');
        equal(`${Time.from('1976-11-18T15:23:30.12345678Z')}`, '15:23:30.123456780');
        equal(`${Time.from('1976-11-18T15:23:30.123456789Z')}`, '15:23:30.123456789');
      });
      it('variant decimal separator', () => {
        equal(`${Time.from('1976-11-18T15:23:30,12Z')}`, '15:23:30.120');
      });
      it('variant minus sign', () => {
        equal(`${Time.from('1976-11-18T15:23:30.12\u221202:00')}`, '15:23:30.120');
      });
      it('basic format', () => {
        equal(`${Time.from('152330')}`, '15:23:30');
        equal(`${Time.from('152330.1')}`, '15:23:30.100');
        equal(`${Time.from('152330-08')}`, '15:23:30');
        equal(`${Time.from('152330.1-08')}`, '15:23:30.100');
        equal(`${Time.from('152330-0800')}`, '15:23:30');
        equal(`${Time.from('152330.1-0800')}`, '15:23:30.100');
      });
      it('mixture of basic and extended format', () => {
        equal(`${Time.from('1976-11-18T152330.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('19761118T15:23:30.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('1976-11-18T15:23:30.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('1976-11-18T152330.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('19761118T15:23:30.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('19761118T152330.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('19761118T152330.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('+001976-11-18T152330.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('+0019761118T15:23:30.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('+001976-11-18T15:23:30.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('+001976-11-18T152330.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('+0019761118T15:23:30.1+0000')}`, '15:23:30.100');
        equal(`${Time.from('+0019761118T152330.1+00:00')}`, '15:23:30.100');
        equal(`${Time.from('+0019761118T152330.1+0000')}`, '15:23:30.100');
      });
      it('optional parts', () => {
        equal(`${Time.from('15')}`, '15:00');
      });
      it('no junk at end of string', () => throws(() => Time.from('15:23:30.100junk'), RangeError));
      describe('Disambiguation', () => {
        const bad = { nanosecond: 1000 };
        it('reject', () => throws(() => Time.from(bad, { disambiguation: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${Time.from(bad)}`, '00:00:00.000000999');
          equal(`${Time.from(bad, { disambiguation: 'constrain' })}`, '00:00:00.000000999');
        });
        it('throw when bad disambiguation', () => {
          [new Time(15), { hour: 15 }, '15:00'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
              throws(() => Time.from(input, { disambiguation }), RangeError)
            );
          });
        });
        const leap = { hour: 23, minute: 59, second: 60 };
        it('reject leap second', () => throws(() => Time.from(leap, { disambiguation: 'reject' }), RangeError));
        it('constrain leap second', () => equal(`${Time.from(leap)}`, '23:59:59'));
      });
    });
  });
  describe('time operations', () => {
    const datetime = { year: 2019, month: 10, day: 1, hour: 14, minute: 20, second: 36 };
    const fromed = new Time(14, 20, 36);
    it(`Temporal.Time.from(${JSON.stringify(datetime)}) instanceof Temporal.Time`, () =>
      assert(Time.from(datetime) instanceof Time));
    it(`Temporal.Time.from(${JSON.stringify(datetime)}) === ${fromed}`, () =>
      assert(Time.from(datetime).equals(fromed)));

    const iso = '20:18:32';
    it(`Temporal.Time.from("${iso}") === (${iso})`, () => equal(`${Time.from(iso)}`, iso));
  });
  describe('time.getFields() works', () => {
    const t1 = Time.from('15:23:30.123456789');
    const fields = t1.getFields();
    it('fields', () => {
      equal(fields.hour, 15);
      equal(fields.minute, 23);
      equal(fields.second, 30);
      equal(fields.millisecond, 123);
      equal(fields.microsecond, 456);
      equal(fields.nanosecond, 789);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.hour, 15);
      equal(fields2.minute, 23);
      equal(fields2.second, 30);
      equal(fields2.millisecond, 123);
      equal(fields2.microsecond, 456);
      equal(fields2.nanosecond, 789);
    });
    it('as input to from()', () => {
      const t2 = Time.from(fields);
      equal(Time.compare(t1, t2), 0);
    });
    it('as input to with()', () => {
      const t2 = Time.from('20:18:32').with(fields);
      equal(Time.compare(t1, t2), 0);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
