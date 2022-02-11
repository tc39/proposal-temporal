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
const { PlainTime, PlainDateTime } = Temporal;

describe('Time', () => {
  describe('time.until() works', () => {
    const time = new PlainTime(15, 23, 30, 123, 456, 789);
    const one = new PlainTime(16, 23, 30, 123, 456, 789);
    it(`(${time}).until(${one}) => PT1H`, () => {
      const duration = time.until(one);
      equal(`${duration}`, 'PT1H');
    });
    const two = new PlainTime(17, 0, 30, 123, 456, 789);
    it(`(${time}).until(${two}) => PT1H37M`, () => {
      const duration = time.until(two);
      equal(`${duration}`, 'PT1H37M');
    });
    it(`(${two}).until(${time}) => -PT1H37M`, () => equal(`${two.until(time)}`, '-PT1H37M'));
    it(`(${time}).until(${two}) === (${two}).since(${time})`, () => equal(`${time.until(two)}`, `${two.since(time)}`));
    it('casts argument', () => {
      equal(`${time.until({ hour: 16, minute: 34 })}`, 'PT1H10M29.876543211S');
      equal(`${time.until('16:34')}`, 'PT1H10M29.876543211S');
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => time.until({}), TypeError);
      throws(() => time.until({ minutes: 30 }), TypeError);
    });
    const time1 = PlainTime.from('10:23:15');
    const time2 = PlainTime.from('17:15:57');
    it('the default largest unit is at least hours', () => {
      equal(`${time1.until(time2)}`, 'PT6H52M42S');
      equal(`${time1.until(time2, { largestUnit: 'auto' })}`, 'PT6H52M42S');
      equal(`${time1.until(time2, { largestUnit: 'hours' })}`, 'PT6H52M42S');
    });
    it('can return lower units', () => {
      equal(`${time1.until(time2, { largestUnit: 'minutes' })}`, 'PT412M42S');
      equal(`${time1.until(time2, { largestUnit: 'seconds' })}`, 'PT24762S');
    });
    it('can return subseconds', () => {
      const time3 = time2.add({ milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = time1.until(time3, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 24762250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = time1.until(time3, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 24762250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = time1.until(time3, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 24762250250250);
    });
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
    const incrementOneNearest = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864198S'],
      ['nanoseconds', 'PT4H17M4.864197532S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['hours', 'PT5H', '-PT4H'],
      ['minutes', 'PT4H18M', '-PT4H17M'],
      ['seconds', 'PT4H17M5S', '-PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.865S', '-PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864198S', '-PT4H17M4.864197S'],
      ['nanoseconds', 'PT4H17M4.864197532S', '-PT4H17M4.864197532S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['hours', 'PT4H', '-PT5H'],
      ['minutes', 'PT4H17M', '-PT4H18M'],
      ['seconds', 'PT4H17M4S', '-PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S', '-PT4H17M4.865S'],
      ['microseconds', 'PT4H17M4.864197S', '-PT4H17M4.864198S'],
      ['nanoseconds', 'PT4H17M4.864197532S', '-PT4H17M4.864197532S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864197S'],
      ['nanoseconds', 'PT4H17M4.864197532S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${earlier.until(later, { smallestUnit: 'minutes' })}`, 'PT4H17M');
      equal(`${earlier.until(later, { smallestUnit: 'seconds' })}`, 'PT4H17M4S');
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
        'PT3H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
        'PT4H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
        'PT4H17M'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.86S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.8642S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.86419753S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement };
        assert(earlier.until(later, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError);
    });
  });
  describe('time.since() works', () => {
    const time = new PlainTime(15, 23, 30, 123, 456, 789);
    const one = new PlainTime(14, 23, 30, 123, 456, 789);
    it(`(${time}).since(${one}) => PT1H`, () => {
      const duration = time.since(one);
      equal(`${duration}`, 'PT1H');
    });
    const two = new PlainTime(13, 30, 30, 123, 456, 789);
    it(`(${time}).since(${two}) => PT1H53M`, () => {
      const duration = time.since(two);
      equal(`${duration}`, 'PT1H53M');
    });
    it(`(${two}).since(${time}) => -PT1H53M`, () => equal(`${two.since(time)}`, '-PT1H53M'));
    it(`(${two}).since(${time}) === (${time}).until(${two})`, () => equal(`${two.since(time)}`, `${time.until(two)}`));
    it('casts argument', () => {
      equal(`${time.since({ hour: 16, minute: 34 })}`, '-PT1H10M29.876543211S');
      equal(`${time.since('16:34')}`, '-PT1H10M29.876543211S');
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => time.since({}), TypeError);
      throws(() => time.since({ minutes: 30 }), TypeError);
    });
    const time1 = PlainTime.from('10:23:15');
    const time2 = PlainTime.from('17:15:57');
    it('the default largest unit is at least hours', () => {
      equal(`${time2.since(time1)}`, 'PT6H52M42S');
      equal(`${time2.since(time1, { largestUnit: 'auto' })}`, 'PT6H52M42S');
      equal(`${time2.since(time1, { largestUnit: 'hours' })}`, 'PT6H52M42S');
    });
    it('can return lower units', () => {
      equal(`${time2.since(time1, { largestUnit: 'minutes' })}`, 'PT412M42S');
      equal(`${time2.since(time1, { largestUnit: 'seconds' })}`, 'PT24762S');
    });
    it('can return subseconds', () => {
      const time3 = time2.add({ milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = time3.since(time1, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 24762250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = time3.since(time1, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 24762250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = time3.since(time1, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 24762250250250);
    });
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
    const incrementOneNearest = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864198S'],
      ['nanoseconds', 'PT4H17M4.864197532S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['hours', 'PT5H', '-PT4H'],
      ['minutes', 'PT4H18M', '-PT4H17M'],
      ['seconds', 'PT4H17M5S', '-PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.865S', '-PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864198S', '-PT4H17M4.864197S'],
      ['nanoseconds', 'PT4H17M4.864197532S', '-PT4H17M4.864197532S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['hours', 'PT4H', '-PT5H'],
      ['minutes', 'PT4H17M', '-PT4H18M'],
      ['seconds', 'PT4H17M4S', '-PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S', '-PT4H17M4.865S'],
      ['microseconds', 'PT4H17M4.864197S', '-PT4H17M4.864198S'],
      ['nanoseconds', 'PT4H17M4.864197532S', '-PT4H17M4.864197532S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.864S'],
      ['microseconds', 'PT4H17M4.864197S'],
      ['nanoseconds', 'PT4H17M4.864197532S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${later.since(earlier, { smallestUnit: 'minutes' })}`, 'PT4H17M');
      equal(`${later.since(earlier, { smallestUnit: 'seconds' })}`, 'PT4H17M4S');
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
        'PT3H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
        'PT4H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
        'PT4H17M'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.86S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.8642S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'PT4H17M4.86419753S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement };
        assert(later.since(earlier, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError);
    });
  });
  describe('Time.round works', () => {
    const time = PlainTime.from('13:46:23.123456789');
    it('throws without parameter', () => {
      throws(() => time.round(), TypeError);
    });
    it('throws without required smallestUnit parameter', () => {
      throws(() => time.round({}), RangeError);
      throws(() => time.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
    });
    it('throws on disallowed or invalid smallestUnit (object param)', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => time.round({ smallestUnit }), RangeError);
        }
      );
    });
    const incrementOneNearest = [
      ['hour', '14:00:00'],
      ['minute', '13:46:00'],
      ['second', '13:46:23'],
      ['millisecond', '13:46:23.123'],
      ['microsecond', '13:46:23.123457'],
      ['nanosecond', '13:46:23.123456789']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        equal(`${time.round({ smallestUnit, roundingMode: 'halfExpand' })}`, expected));
    });
    const incrementOneCeil = [
      ['hour', '14:00:00'],
      ['minute', '13:47:00'],
      ['second', '13:46:24'],
      ['millisecond', '13:46:23.124'],
      ['microsecond', '13:46:23.123457'],
      ['nanosecond', '13:46:23.123456789']
    ];
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () =>
        equal(`${time.round({ smallestUnit, roundingMode: 'ceil' })}`, expected));
    });
    const incrementOneFloor = [
      ['hour', '13:00:00'],
      ['minute', '13:46:00'],
      ['second', '13:46:23'],
      ['millisecond', '13:46:23.123'],
      ['microsecond', '13:46:23.123456'],
      ['nanosecond', '13:46:23.123456789']
    ];
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        equal(`${time.round({ smallestUnit, roundingMode: 'floor' })}`, expected));
      it(`truncates to ${smallestUnit}`, () =>
        equal(`${time.round({ smallestUnit, roundingMode: 'trunc' })}`, expected));
    });
    it('halfExpand is the default', () => {
      equal(`${time.round({ smallestUnit: 'hour' })}`, '14:00:00');
      equal(`${time.round({ smallestUnit: 'minute' })}`, '13:46:00');
    });
    it('rounds to an increment of hours', () => {
      equal(`${time.round({ smallestUnit: 'hour', roundingIncrement: 3 })}`, '15:00:00');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${time.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`, '13:45:00');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${time.round({ smallestUnit: 'second', roundingIncrement: 30 })}`, '13:46:30');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${time.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`, '13:46:23.12');
    });
    it('rounds to an increment of microseconds', () => {
      equal(`${time.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`, '13:46:23.12346');
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(`${time.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`, '13:46:23.12345679');
    });
    it('valid hour increments divide into 24', () => {
      const smallestUnit = 'hour';
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        assert(time.round({ smallestUnit, roundingIncrement }) instanceof PlainTime);
      });
    });
    ['minute', 'second'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          assert(time.round({ smallestUnit, roundingIncrement }) instanceof PlainTime);
        });
      });
    });
    ['millisecond', 'microsecond', 'nanosecond'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          assert(time.round({ smallestUnit, roundingIncrement }) instanceof PlainTime);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => time.round({ smallestUnit: 'hour', roundingIncrement: 29 }), RangeError);
      throws(() => time.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError);
      throws(() => time.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError);
      throws(() => time.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError);
      throws(() => time.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError);
      throws(() => time.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => time.round({ smallestUnit: 'hour', roundingIncrement: 24 }), RangeError);
      throws(() => time.round({ smallestUnit: 'minute', roundingIncrement: 60 }), RangeError);
      throws(() => time.round({ smallestUnit: 'second', roundingIncrement: 60 }), RangeError);
      throws(() => time.round({ smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError);
      throws(() => time.round({ smallestUnit: 'microsecond', roundingIncrement: 1000 }), RangeError);
      throws(() => time.round({ smallestUnit: 'nanosecond', roundingIncrement: 1000 }), RangeError);
    });
    const bal = PlainTime.from('23:59:59.999999999');
    ['hour', 'minute', 'second', 'millisecond', 'microsecond'].forEach((smallestUnit) => {
      it(`balances to next ${smallestUnit}`, () => {
        equal(`${bal.round({ smallestUnit })}`, '00:00:00');
      });
    });
  });
  describe('time.add() works', () => {
    const time = new PlainTime(15, 23, 30, 123, 456, 789);
    it(`(${time}).add({ hours: 16 })`, () => {
      equal(`${time.add({ hours: 16 })}`, '07:23:30.123456789');
    });
    it(`(${time}).add({ minutes: 45 })`, () => {
      equal(`${time.add({ minutes: 45 })}`, '16:08:30.123456789');
    });
    it(`(${time}).add({ nanoseconds: 300 })`, () => {
      equal(`${time.add({ nanoseconds: 300 })}`, '15:23:30.123457089');
    });
    it('symmetric with regard to negative durations', () => {
      equal(`${PlainTime.from('07:23:30.123456789').add({ hours: -16 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('16:08:30.123456789').add({ minutes: -45 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('15:23:30.123457089').add({ nanoseconds: -300 })}`, '15:23:30.123456789');
    });
    it('time.add(durationObj)', () => {
      equal(`${time.add(Temporal.Duration.from('PT16H'))}`, '07:23:30.123456789');
    });
    it('casts argument', () => equal(`${time.add('PT16H')}`, '07:23:30.123456789'));
    it('ignores higher units', () => {
      equal(`${time.add({ days: 1 })}`, '15:23:30.123456789');
      equal(`${time.add({ months: 1 })}`, '15:23:30.123456789');
      equal(`${time.add({ years: 1 })}`, '15:23:30.123456789');
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${time.add({ minute: 1, hours: 1 })}`, '16:23:30.123456789');
    });
  });
  describe('time.subtract() works', () => {
    const time = PlainTime.from('15:23:30.123456789');
    it(`(${time}).subtract({ hours: 16 })`, () => equal(`${time.subtract({ hours: 16 })}`, '23:23:30.123456789'));
    it(`(${time}).subtract({ minutes: 45 })`, () => equal(`${time.subtract({ minutes: 45 })}`, '14:38:30.123456789'));
    it(`(${time}).subtract({ seconds: 45 })`, () => equal(`${time.subtract({ seconds: 45 })}`, '15:22:45.123456789'));
    it(`(${time}).subtract({ milliseconds: 800 })`, () =>
      equal(`${time.subtract({ milliseconds: 800 })}`, '15:23:29.323456789'));
    it(`(${time}).subtract({ microseconds: 800 })`, () =>
      equal(`${time.subtract({ microseconds: 800 })}`, '15:23:30.122656789'));
    it(`(${time}).subtract({ nanoseconds: 800 })`, () =>
      equal(`${time.subtract({ nanoseconds: 800 })}`, '15:23:30.123455989'));
    it('symmetric with regard to negative durations', () => {
      equal(`${PlainTime.from('23:23:30.123456789').subtract({ hours: -16 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('14:38:30.123456789').subtract({ minutes: -45 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('15:22:45.123456789').subtract({ seconds: -45 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('15:23:29.323456789').subtract({ milliseconds: -800 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('15:23:30.122656789').subtract({ microseconds: -800 })}`, '15:23:30.123456789');
      equal(`${PlainTime.from('15:23:30.123455989').subtract({ nanoseconds: -800 })}`, '15:23:30.123456789');
    });
    it('time.subtract(durationObj)', () => {
      equal(`${time.subtract(Temporal.Duration.from('PT16H'))}`, '23:23:30.123456789');
    });
    it('casts argument', () => equal(`${time.subtract('PT16H')}`, '23:23:30.123456789'));
    it('ignores higher units', () => {
      equal(`${time.subtract({ days: 1 })}`, '15:23:30.123456789');
      equal(`${time.subtract({ months: 1 })}`, '15:23:30.123456789');
      equal(`${time.subtract({ years: 1 })}`, '15:23:30.123456789');
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${time.subtract({ minute: 1, hours: 1 })}`, '14:23:30.123456789');
    });
  });
  describe('Time.from() works', () => {
    it('Time.from({ hour: 15, minute: 23 })', () => equal(`${PlainTime.from({ hour: 15, minute: 23 })}`, '15:23:00'));
    it('Time.from({ minute: 30, microsecond: 555 })', () =>
      equal(`${PlainTime.from({ minute: 30, microsecond: 555 })}`, '00:30:00.000555'));
    it('Time.from(ISO string leap second) is constrained', () => {
      equal(`${PlainTime.from('23:59:60')}`, '23:59:59');
      equal(`${PlainTime.from('23:59:60', { overflow: 'reject' })}`, '23:59:59');
    });
    it('Time.from(number) is converted to string', () => equal(`${PlainTime.from(1523)}`, `${PlainTime.from('1523')}`));
    it('Time.from(dateTime) returns the same time properties', () => {
      const dt = PlainDateTime.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]');
      equal(PlainTime.from(dt).toString(), dt.toPlainTime().toString());
    });
    it('space not accepted as time designator prefix', () => {
      throws(() => PlainTime.from(' 15:23:30'), RangeError);
    });
    describe('Overflow', () => {
      const bad = { nanosecond: 1000 };
      it('reject', () => throws(() => PlainTime.from(bad, { overflow: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${PlainTime.from(bad)}`, '00:00:00.000000999');
        equal(`${PlainTime.from(bad, { overflow: 'constrain' })}`, '00:00:00.000000999');
      });
      const leap = { hour: 23, minute: 59, second: 60 };
      it('reject leap second', () => throws(() => PlainTime.from(leap, { overflow: 'reject' }), RangeError));
      it('constrain leap second', () => equal(`${PlainTime.from(leap)}`, '23:59:59'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => PlainTime.from({}), TypeError);
      throws(() => PlainTime.from({ minutes: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${PlainTime.from({ minutes: 1, hour: 1 })}`, '01:00:00');
    });
  });
  describe('constructor treats -0 as 0', () => {
    it('ignores the sign of -0', () => {
      const datetime = new PlainTime(-0, -0, -0, -0, -0);
      equal(datetime.hour, 0);
      equal(datetime.minute, 0);
      equal(datetime.second, 0);
      equal(datetime.millisecond, 0);
      equal(datetime.microsecond, 0);
      equal(datetime.nanosecond, 0);
    });
  });
  describe('time operations', () => {
    const datetime = { year: 2019, month: 10, day: 1, hour: 14, minute: 20, second: 36 };
    const fromed = new PlainTime(14, 20, 36);
    it(`Temporal.PlainTime.from(${JSON.stringify(datetime)}) instanceof Temporal.PlainTime`, () =>
      assert(PlainTime.from(datetime) instanceof PlainTime));
    it(`Temporal.PlainTime.from(${JSON.stringify(datetime)}) === ${fromed}`, () =>
      assert(PlainTime.from(datetime).equals(fromed)));

    const iso = '20:18:32';
    it(`Temporal.PlainTime.from("${iso}") === (${iso})`, () => equal(`${PlainTime.from(iso)}`, iso));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
