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
const { equal, notEqual, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainDate } = Temporal;

describe('Date', () => {
  describe('date.until() works', () => {
    const date = new PlainDate(1969, 7, 24);
    it('takes days per month into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-01');
      const date3 = PlainDate.from('2019-03-01');
      equal(`${date1.until(date2)}`, 'P31D');
      equal(`${date2.until(date3)}`, 'P28D');

      const date4 = PlainDate.from('2020-02-01');
      const date5 = PlainDate.from('2020-03-01');
      equal(`${date4.until(date5)}`, 'P29D');
    });
    it('takes days per year into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-06-01');
      const date3 = PlainDate.from('2020-01-01');
      const date4 = PlainDate.from('2020-06-01');
      const date5 = PlainDate.from('2021-01-01');
      const date6 = PlainDate.from('2021-06-01');
      equal(`${date1.until(date3)}`, 'P365D');
      equal(`${date3.until(date5)}`, 'P366D');
      equal(`${date2.until(date4)}`, 'P366D');
      equal(`${date4.until(date6)}`, 'P365D');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDate = date.add({ days: 42 });
      const weeksDifference = date.until(laterDate, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = date.until(laterDate, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    const earlier = PlainDate.from('2019-01-08');
    const later = PlainDate.from('2021-09-07');
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y');
      equal(`${earlier.until(later, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M');
      equal(`${earlier.until(later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W');
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${later.until(earlier, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      );
    });
    it('rounds to an increment of months', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P30M'
      );
    });
    it('rounds to an increment of weeks', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'halfExpand' })}`,
        'P144W'
      );
    });
    it('rounds to an increment of days', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'halfExpand' })}`,
        'P1000D'
      );
    });
    it('rounds relative to the receiver', () => {
      const date1 = Temporal.PlainDate.from('2019-01-01');
      const date2 = Temporal.PlainDate.from('2019-02-15');
      equal(`${date1.until(date2, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P2M');
      equal(`${date2.until(date1, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, '-P1M');
    });
  });
  describe('order of operations in until - TODO: add since', () => {
    const cases = [
      ['2019-03-01', '2019-01-29', 'P1M1D'],
      ['2019-01-29', '2019-03-01', '-P1M3D'],
      ['2019-03-29', '2019-01-30', 'P1M29D'],
      ['2019-01-30', '2019-03-29', '-P1M29D'],
      ['2019-03-30', '2019-01-31', 'P1M30D'],
      ['2019-01-31', '2019-03-30', '-P1M28D'],
      ['2019-03-31', '2019-01-31', 'P2M'],
      ['2019-01-31', '2019-03-31', '-P2M']
    ];
    for (const [end, start, expected] of cases) {
      it(`${start} until ${end} => ${expected}`, () => {
        const result = PlainDate.from(start).until(end, { largestUnit: 'months' });
        equal(result.toString(), expected);
      });
    }
  });
  describe('date.since() works', () => {
    const date = new PlainDate(1976, 11, 18);
    it('takes days per month into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-01');
      const date3 = PlainDate.from('2019-03-01');
      equal(`${date2.since(date1)}`, 'P31D');
      equal(`${date3.since(date2)}`, 'P28D');

      const date4 = PlainDate.from('2020-02-01');
      const date5 = PlainDate.from('2020-03-01');
      equal(`${date5.since(date4)}`, 'P29D');
    });
    it('takes days per year into account', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-06-01');
      const date3 = PlainDate.from('2020-01-01');
      const date4 = PlainDate.from('2020-06-01');
      const date5 = PlainDate.from('2021-01-01');
      const date6 = PlainDate.from('2021-06-01');
      equal(`${date3.since(date1)}`, 'P365D');
      equal(`${date5.since(date3)}`, 'P366D');
      equal(`${date4.since(date2)}`, 'P366D');
      equal(`${date6.since(date4)}`, 'P365D');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDate = date.add({ days: 42 });
      const weeksDifference = laterDate.since(date, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = laterDate.since(date, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    const earlier = PlainDate.from('2019-01-08');
    const later = PlainDate.from('2021-09-07');
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y');
      equal(`${later.since(earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M');
      equal(`${later.since(earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W');
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P139W'],
      ['days', 'P973D', '-P973D']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${earlier.since(later, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      );
    });
    it('rounds to an increment of months', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'months', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P30M'
      );
    });
    it('rounds to an increment of weeks', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'weeks', roundingIncrement: 12, roundingMode: 'halfExpand' })}`,
        'P144W'
      );
    });
    it('rounds to an increment of days', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'days', roundingIncrement: 100, roundingMode: 'halfExpand' })}`,
        'P1000D'
      );
    });
    it('rounds relative to the receiver', () => {
      const date1 = PlainDate.from('2019-01-01');
      const date2 = PlainDate.from('2019-02-15');
      equal(`${date2.since(date1, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P1M');
      equal(`${date1.since(date2, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, '-P2M');
    });
  });
  describe('date.add() works', () => {
    let date = new PlainDate(1976, 11, 18);
    it('date.add({ years: 43 })', () => {
      equal(`${date.add({ years: 43 })}`, '2019-11-18');
    });
    it('date.add({ months: 3 })', () => {
      equal(`${date.add({ months: 3 })}`, '1977-02-18');
    });
    it('date.add({ days: 20 })', () => {
      equal(`${date.add({ days: 20 })}`, '1976-12-08');
    });
    it('new Date(2019, 1, 31).add({ months: 1 })', () => {
      equal(`${new PlainDate(2019, 1, 31).add({ months: 1 })}`, '2019-02-28');
    });
    it('date.add(durationObj)', () => {
      equal(`${date.add(Temporal.Duration.from('P43Y'))}`, '2019-11-18');
    });
    it('casts argument', () => {
      equal(`${date.add('P43Y')}`, '2019-11-18');
    });
    it('constrain when overflowing result', () => {
      const jan31 = PlainDate.from('2020-01-31');
      equal(`${jan31.add({ months: 1 })}`, '2020-02-29');
      equal(`${jan31.add({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29');
    });
    it('throw when overflowing result with reject', () => {
      const jan31 = PlainDate.from('2020-01-31');
      throws(() => jan31.add({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('2019-11-18').add({ years: -43 })}`, '1976-11-18');
      equal(`${PlainDate.from('1977-02-18').add({ months: -3 })}`, '1976-11-18');
      equal(`${PlainDate.from('1976-12-08').add({ days: -20 })}`, '1976-11-18');
      equal(`${PlainDate.from('2019-02-28').add({ months: -1 })}`, '2019-01-28');
    });
    it("ignores lower units that don't balance up to a day", () => {
      equal(`${date.add({ hours: 1 })}`, '1976-11-18');
      equal(`${date.add({ minutes: 1 })}`, '1976-11-18');
      equal(`${date.add({ seconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ milliseconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ microseconds: 1 })}`, '1976-11-18');
      equal(`${date.add({ nanoseconds: 1 })}`, '1976-11-18');
    });
    it('adds lower units that balance up to a day or more', () => {
      equal(`${date.add({ hours: 24 })}`, '1976-11-19');
      equal(`${date.add({ hours: 36 })}`, '1976-11-19');
      equal(`${date.add({ hours: 48 })}`, '1976-11-20');
      equal(`${date.add({ minutes: 1440 })}`, '1976-11-19');
      equal(`${date.add({ seconds: 86400 })}`, '1976-11-19');
      equal(`${date.add({ milliseconds: 86400_000 })}`, '1976-11-19');
      equal(`${date.add({ microseconds: 86400_000_000 })}`, '1976-11-19');
      equal(`${date.add({ nanoseconds: 86400_000_000_000 })}`, '1976-11-19');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => date.add({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => date.add({ months: 1, days: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [{}, () => {}, undefined].forEach((options) => equal(`${date.add({ months: 1 }, options)}`, '1976-12-18'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => date.add({}), TypeError);
      throws(() => date.add({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${date.add({ month: 1, days: 1 })}`, '1976-11-19');
    });
  });
  describe('date.subtract() works', () => {
    const date = PlainDate.from('2019-11-18');
    it('date.subtract({ years: 43 })', () => {
      equal(`${date.subtract({ years: 43 })}`, '1976-11-18');
    });
    it('date.subtract({ months: 11 })', () => {
      equal(`${date.subtract({ months: 11 })}`, '2018-12-18');
    });
    it('date.subtract({ days: 20 })', () => {
      equal(`${date.subtract({ days: 20 })}`, '2019-10-29');
    });
    it('Date.from("2019-02-28").subtract({ months: 1 })', () => {
      equal(`${PlainDate.from('2019-02-28').subtract({ months: 1 })}`, '2019-01-28');
    });
    it('Date.subtract(durationObj)', () => {
      equal(`${date.subtract(Temporal.Duration.from('P43Y'))}`, '1976-11-18');
    });
    it('casts argument', () => {
      equal(`${date.subtract('P43Y')}`, '1976-11-18');
    });
    it('constrain when overflowing result', () => {
      const mar31 = PlainDate.from('2020-03-31');
      equal(`${mar31.subtract({ months: 1 })}`, '2020-02-29');
      equal(`${mar31.subtract({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29');
    });
    it('throw when overflowing result with reject', () => {
      const mar31 = PlainDate.from('2020-03-31');
      throws(() => mar31.subtract({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('1976-11-18').subtract({ years: -43 })}`, '2019-11-18');
      equal(`${PlainDate.from('2018-12-18').subtract({ months: -11 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-10-29').subtract({ days: -20 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-01-28').subtract({ months: -1 })}`, '2019-02-28');
    });
    it("ignores lower units that don't balance up to a day", () => {
      equal(`${date.subtract({ hours: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ minutes: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ seconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ milliseconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ microseconds: 1 })}`, '2019-11-18');
      equal(`${date.subtract({ nanoseconds: 1 })}`, '2019-11-18');
    });
    it('subtracts lower units that balance up to a day or more', () => {
      equal(`${date.subtract({ hours: 24 })}`, '2019-11-17');
      equal(`${date.subtract({ hours: 36 })}`, '2019-11-17');
      equal(`${date.subtract({ hours: 48 })}`, '2019-11-16');
      equal(`${date.subtract({ minutes: 1440 })}`, '2019-11-17');
      equal(`${date.subtract({ seconds: 86400 })}`, '2019-11-17');
      equal(`${date.subtract({ milliseconds: 86400_000 })}`, '2019-11-17');
      equal(`${date.subtract({ microseconds: 86400_000_000 })}`, '2019-11-17');
      equal(`${date.subtract({ nanoseconds: 86400_000_000_000 })}`, '2019-11-17');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => date.subtract({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => date.subtract({ months: 1, days: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [{}, () => {}, undefined].forEach((options) => equal(`${date.subtract({ months: 1 }, options)}`, '2019-10-18'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => date.subtract({}), TypeError);
      throws(() => date.subtract({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${date.subtract({ month: 1, days: 1 })}`, '2019-11-17');
    });
  });
  describe('date.toString() works', () => {
    it('new Date(1976, 11, 18).toString()', () => {
      equal(new PlainDate(1976, 11, 18).toString(), '1976-11-18');
    });
    it('new Date(1914, 2, 23).toString()', () => {
      equal(new PlainDate(1914, 2, 23).toString(), '1914-02-23');
    });
    const d = new PlainDate(1976, 11, 18);
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(d.toString({ calendarName: 'auto' }), '1976-11-18');
      equal(d.withCalendar('gregory').toString({ calendarName: 'auto' }), '1976-11-18[u-ca=gregory]');
    });
    it('shows ISO calendar if calendarName = always', () => {
      equal(d.toString({ calendarName: 'always' }), '1976-11-18[u-ca=iso8601]');
    });
    it('omits non-ISO calendar if calendarName = never', () => {
      equal(d.withCalendar('gregory').toString({ calendarName: 'never' }), '1976-11-18');
    });
    it('default is calendar = auto', () => {
      equal(d.toString(), '1976-11-18');
      equal(d.withCalendar('gregory').toString(), '1976-11-18[u-ca=gregory]');
    });
  });
  describe('Date.from() works', () => {
    it('Date.from("1976-11-18")', () => {
      const date = PlainDate.from('1976-11-18');
      equal(date.year, 1976);
      equal(date.month, 11);
      equal(date.day, 18);
    });
    it('Date.from("2019-06-30")', () => {
      const date = PlainDate.from('2019-06-30');
      equal(date.year, 2019);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+000050-06-30")', () => {
      const date = PlainDate.from('+000050-06-30');
      equal(date.year, 50);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("+010583-06-30")', () => {
      const date = PlainDate.from('+010583-06-30');
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-010583-06-30")', () => {
      const date = PlainDate.from('-010583-06-30');
      equal(date.year, -10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from("-000333-06-30")', () => {
      const date = PlainDate.from('-000333-06-30');
      equal(date.year, -333);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.from(1976-11-18) is not the same object', () => {
      const orig = new PlainDate(1976, 11, 18);
      const actual = PlainDate.from(orig);
      notEqual(actual, orig);
    });
    it('Date.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18', () =>
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18'));
    it('can be constructed with month and without monthCode', () =>
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18'));
    it('can be constructed with monthCode and without month', () =>
      equal(`${PlainDate.from({ year: 1976, monthCode: 'M11', day: 18 })}`, '1976-11-18'));
    it('month and monthCode must agree', () =>
      throws(() => PlainDate.from({ year: 1976, month: 11, monthCode: 'M12', day: 18 }), RangeError));
    it('Date.from({ year: 2019, day: 15 }) throws', () =>
      throws(() => PlainDate.from({ year: 2019, day: 15 }), TypeError));
    it('Date.from({ month: 12 }) throws', () => throws(() => PlainDate.from({ month: 12 }), TypeError));
    it('object must contain at least the required correctly-spelled properties', () => {
      throws(() => PlainDate.from({}), TypeError);
      throws(() => PlainDate.from({ year: 1976, months: 11, day: 18 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${PlainDate.from({ year: 1976, month: 11, day: 18, days: 15 })}`, '1976-11-18');
    });
    it('Date.from(required prop undefined) throws', () =>
      throws(() => PlainDate.from({ year: undefined, month: 11, day: 18 }), TypeError));
    it('Date.from(number) is converted to string', () => PlainDate.from(19761118).equals(PlainDate.from('19761118')));
    it('basic format', () => {
      equal(`${PlainDate.from('19761118')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118')}`, '1976-11-18');
    });
    it('mixture of basic and extended format', () => {
      equal(`${PlainDate.from('1976-11-18T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T15:23:30.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('1976-11-18T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('19761118T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+001976-11-18T152330.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T152330.1+00:00')}`, '1976-11-18');
      equal(`${PlainDate.from('+0019761118T152330.1+0000')}`, '1976-11-18');
    });
    it('no junk at end of string', () => throws(() => PlainDate.from('1976-11-18junk'), RangeError));
    it('ignores if a timezone is specified', () =>
      equal(`${PlainDate.from('2020-01-01[Asia/Kolkata]')}`, '2020-01-01'));
    it('options may only be an object or undefined', () => {
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${PlainDate.from({ year: 1976, month: 11, day: 18 }, options)}`, '1976-11-18')
      );
    });
    describe('Overflow', () => {
      const bad = { year: 2019, month: 1, day: 32 };
      it('reject', () => throws(() => PlainDate.from(bad, { overflow: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${PlainDate.from(bad)}`, '2019-01-31');
        equal(`${PlainDate.from(bad, { overflow: 'constrain' })}`, '2019-01-31');
      });
      it('throw when bad overflow', () => {
        [new PlainDate(1976, 11, 18), { year: 2019, month: 1, day: 1 }, '2019-01-31'].forEach((input) => {
          ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
            throws(() => PlainDate.from(input, { overflow }), RangeError)
          );
        });
      });
      it('constrain has no effect on invalid ISO string', () => {
        throws(() => PlainDate.from('2020-13-34', { overflow: 'constrain' }), RangeError);
      });
    });
  });
  describe('Date.compare works', () => {
    const d1 = PlainDate.from('1976-11-18');
    const d2 = PlainDate.from('2019-06-30');
    it('equal', () => equal(PlainDate.compare(d1, d1), 0));
    it('smaller/larger', () => equal(PlainDate.compare(d1, d2), -1));
    it('larger/smaller', () => equal(PlainDate.compare(d2, d1), 1));
    it('casts first argument', () => {
      equal(PlainDate.compare({ year: 1976, month: 11, day: 18 }, d2), -1);
      equal(PlainDate.compare('1976-11-18', d2), -1);
    });
    it('casts second argument', () => {
      equal(PlainDate.compare(d1, { year: 2019, month: 6, day: 30 }), -1);
      equal(PlainDate.compare(d1, '2019-06-30'), -1);
    });
    it('object must contain at least the required properties', () => {
      throws(() => PlainDate.compare({ year: 1976 }, d2), TypeError);
      throws(() => PlainDate.compare(d1, { year: 2019 }), TypeError);
    });
  });
  describe('Date.equal works', () => {
    const d1 = PlainDate.from('1976-11-18');
    const d2 = PlainDate.from('2019-06-30');
    it('equal', () => assert(d1.equals(d1)));
    it('unequal', () => assert(!d1.equals(d2)));
    it('casts argument', () => {
      assert(!d2.equals({ year: 1976, month: 11, day: 18 }));
      assert(!d2.equals('1976-11-18'));
    });
    it('object must contain at least the required properties', () => {
      throws(() => d2.equals({ year: 1976 }), TypeError);
    });
  });
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new PlainDate(-271821, 4, 18), RangeError);
      throws(() => new PlainDate(275760, 9, 14), RangeError);
      equal(`${new PlainDate(-271821, 4, 19)}`, '-271821-04-19');
      equal(`${new PlainDate(275760, 9, 13)}`, '+275760-09-13');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 18 };
      const tooLate = { year: 275760, month: 9, day: 14 };
      ['reject', 'constrain'].forEach((overflow) => {
        [tooEarly, tooLate].forEach((props) => {
          throws(() => PlainDate.from(props, { overflow }), RangeError);
        });
      });
      equal(`${PlainDate.from({ year: -271821, month: 4, day: 19 })}`, '-271821-04-19');
      equal(`${PlainDate.from({ year: 275760, month: 9, day: 13 })}`, '+275760-09-13');
    });
    it('constructing from ISO string', () => {
      ['reject', 'constrain'].forEach((overflow) => {
        ['-271821-04-18', '+275760-09-14'].forEach((str) => {
          throws(() => PlainDate.from(str, { overflow }), RangeError);
        });
      });
      equal(`${PlainDate.from('-271821-04-19')}`, '-271821-04-19');
      equal(`${PlainDate.from('+275760-09-13')}`, '+275760-09-13');
    });
    it('converting from DateTime', () => {
      const min = Temporal.PlainDateTime.from('-271821-04-19T00:00:00.000000001');
      const max = Temporal.PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      equal(`${min.toPlainDate()}`, '-271821-04-19');
      equal(`${max.toPlainDate()}`, '+275760-09-13');
    });
    it('converting from YearMonth', () => {
      const min = Temporal.PlainYearMonth.from('-271821-04');
      const max = Temporal.PlainYearMonth.from('+275760-09');
      throws(() => min.toPlainDate({ day: 1 }), RangeError);
      throws(() => max.toPlainDate({ day: 30 }), RangeError);
      equal(`${min.toPlainDate({ day: 19 })}`, '-271821-04-19');
      equal(`${max.toPlainDate({ day: 13 })}`, '+275760-09-13');
    });
    it('converting from MonthDay', () => {
      const jan1 = Temporal.PlainMonthDay.from('01-01');
      const dec31 = Temporal.PlainMonthDay.from('12-31');
      const minYear = -271821;
      const maxYear = 275760;
      throws(() => jan1.toPlainDate({ year: minYear }), RangeError);
      throws(() => dec31.toPlainDate({ year: maxYear }), RangeError);
      equal(`${jan1.toPlainDate({ year: minYear + 1 })}`, '-271820-01-01');
      equal(`${dec31.toPlainDate({ year: maxYear - 1 })}`, '+275759-12-31');
    });
    it('adding and subtracting beyond limit', () => {
      const min = PlainDate.from('-271821-04-19');
      const max = PlainDate.from('+275760-09-13');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => min.subtract({ days: 1 }, { overflow }), RangeError);
        throws(() => max.add({ days: 1 }, { overflow }), RangeError);
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
