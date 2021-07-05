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
    it('higher units are not allowed', () => {
      throws(() => time1.until(time2, { largestUnit: 'days' }), RangeError);
      throws(() => time1.until(time2, { largestUnit: 'weeks' }), RangeError);
      throws(() => time1.until(time2, { largestUnit: 'months' }), RangeError);
      throws(() => time1.until(time2, { largestUnit: 'years' }), RangeError);
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
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => time.until(one, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${time.until(one, options)}`, 'PT1H'));
    });
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'years', 'months', 'weeks', 'days', 'year', 'month', 'week', 'day', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => earlier.until(later, { smallestUnit }), RangeError);
        }
      );
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => earlier.until(later, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('throws on invalid roundingMode', () => {
      throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError);
    });
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
    it('accepts singular units', () => {
      equal(`${earlier.until(later, { largestUnit: 'hour' })}`, `${earlier.until(later, { largestUnit: 'hours' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'hour' })}`, `${earlier.until(later, { smallestUnit: 'hours' })}`);
      equal(
        `${earlier.until(later, { largestUnit: 'minute' })}`,
        `${earlier.until(later, { largestUnit: 'minutes' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'minute' })}`,
        `${earlier.until(later, { smallestUnit: 'minutes' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'second' })}`,
        `${earlier.until(later, { largestUnit: 'seconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'second' })}`,
        `${earlier.until(later, { smallestUnit: 'seconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'millisecond' })}`,
        `${earlier.until(later, { largestUnit: 'milliseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'millisecond' })}`,
        `${earlier.until(later, { smallestUnit: 'milliseconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'microsecond' })}`,
        `${earlier.until(later, { largestUnit: 'microseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'microsecond' })}`,
        `${earlier.until(later, { smallestUnit: 'microseconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'nanosecond' })}`,
        `${earlier.until(later, { largestUnit: 'nanoseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'nanosecond' })}`,
        `${earlier.until(later, { smallestUnit: 'nanoseconds' })}`
      );
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
    it('higher units are not allowed', () => {
      throws(() => time2.since(time1, { largestUnit: 'days' }), RangeError);
      throws(() => time2.since(time1, { largestUnit: 'weeks' }), RangeError);
      throws(() => time2.since(time1, { largestUnit: 'months' }), RangeError);
      throws(() => time2.since(time1, { largestUnit: 'years' }), RangeError);
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
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => time.since(one, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${time.since(one, options)}`, 'PT1H'));
    });
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'years', 'months', 'weeks', 'days', 'year', 'month', 'week', 'day', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => later.since(earlier, { smallestUnit }), RangeError);
        }
      );
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => later.since(earlier, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('throws on invalid roundingMode', () => {
      throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError);
    });
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
    it('accepts singular units', () => {
      equal(`${later.since(earlier, { largestUnit: 'hour' })}`, `${later.since(earlier, { largestUnit: 'hours' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'hour' })}`, `${later.since(earlier, { smallestUnit: 'hours' })}`);
      equal(
        `${later.since(earlier, { largestUnit: 'minute' })}`,
        `${later.since(earlier, { largestUnit: 'minutes' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'minute' })}`,
        `${later.since(earlier, { smallestUnit: 'minutes' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'second' })}`,
        `${later.since(earlier, { largestUnit: 'seconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'second' })}`,
        `${later.since(earlier, { smallestUnit: 'seconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'millisecond' })}`,
        `${later.since(earlier, { largestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'millisecond' })}`,
        `${later.since(earlier, { smallestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'microsecond' })}`,
        `${later.since(earlier, { largestUnit: 'microseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'microsecond' })}`,
        `${later.since(earlier, { smallestUnit: 'microseconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'nanosecond' })}`,
        `${later.since(earlier, { largestUnit: 'nanoseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'nanosecond' })}`,
        `${later.since(earlier, { smallestUnit: 'nanoseconds' })}`
      );
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
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => time.round({ smallestUnit }), RangeError);
        }
      );
    });
    it('throws on invalid roundingMode', () => {
      throws(() => time.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError);
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
    it('accepts plural units', () => {
      assert(time.round({ smallestUnit: 'hours' }).equals(time.round({ smallestUnit: 'hour' })));
      assert(time.round({ smallestUnit: 'minutes' }).equals(time.round({ smallestUnit: 'minute' })));
      assert(time.round({ smallestUnit: 'seconds' }).equals(time.round({ smallestUnit: 'second' })));
      assert(time.round({ smallestUnit: 'milliseconds' }).equals(time.round({ smallestUnit: 'millisecond' })));
      assert(time.round({ smallestUnit: 'microseconds' }).equals(time.round({ smallestUnit: 'microsecond' })));
      assert(time.round({ smallestUnit: 'nanoseconds' }).equals(time.round({ smallestUnit: 'nanosecond' })));
    });
  });
  describe('Time.compare() works', () => {
    const t1 = PlainTime.from('08:44:15.321');
    const t2 = PlainTime.from('14:23:30.123');
    it('equal', () => equal(PlainTime.compare(t1, t1), 0));
    it('smaller/larger', () => equal(PlainTime.compare(t1, t2), -1));
    it('larger/smaller', () => equal(PlainTime.compare(t2, t1), 1));
    it('casts first argument', () => {
      equal(PlainTime.compare({ hour: 16, minute: 34 }, t2), 1);
      equal(PlainTime.compare('16:34', t2), 1);
    });
    it('casts second argument', () => {
      equal(PlainTime.compare(t1, { hour: 16, minute: 34 }), -1);
      equal(PlainTime.compare(t1, '16:34'), -1);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => PlainTime.compare({ hours: 16 }, t2), TypeError);
      throws(() => PlainTime.compare(t1, { hours: 16 }), TypeError);
    });
  });
  describe('time.equals() works', () => {
    const t1 = PlainTime.from('08:44:15.321');
    const t2 = PlainTime.from('14:23:30.123');
    it('equal', () => assert(t1.equals(t1)));
    it('unequal', () => assert(!t1.equals(t2)));
    it('casts argument', () => {
      assert(t1.equals('08:44:15.321'));
      assert(t1.equals({ hour: 8, minute: 44, second: 15, millisecond: 321 }));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => t1.equals({ hours: 8 }), TypeError);
    });
  });
  describe("Comparison operators don't work", () => {
    const t1 = PlainTime.from('09:36:29.123456789');
    const t1again = PlainTime.from('09:36:29.123456789');
    const t2 = PlainTime.from('15:23:30.123456789');
    it('=== is object equality', () => equal(t1, t1));
    it('!== is object equality', () => notEqual(t1, t1again));
    it('<', () => throws(() => t1 < t2));
    it('>', () => throws(() => t1 > t2));
    it('<=', () => throws(() => t1 <= t2));
    it('>=', () => throws(() => t1 >= t2));
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
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => time.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options is ignored', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n, {}, () => {}, undefined].forEach((options) =>
        equal(`${time.add({ hours: 1 }, options)}`, '16:23:30.123456789')
      );
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        equal(`${time.add({ hours: 1 }, { overflow })}`, '16:23:30.123456789')
      );
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => time.add({}), TypeError);
      throws(() => time.add({ minute: 12 }), TypeError);
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
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => time.subtract({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options is ignored', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n, {}, () => {}, undefined].forEach((options) =>
        equal(`${time.subtract({ hours: 1 }, options)}`, '14:23:30.123456789')
      );
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        equal(`${time.subtract({ hours: 1 }, { overflow })}`, '14:23:30.123456789')
      );
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => time.subtract({}), TypeError);
      throws(() => time.subtract({ minute: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${time.subtract({ minute: 1, hours: 1 })}`, '14:23:30.123456789');
    });
  });
  describe('time.toString() works', () => {
    it('new Time(15, 23).toString()', () => {
      equal(new PlainTime(15, 23).toString(), '15:23:00');
    });
    it('new Time(15, 23, 30).toString()', () => {
      equal(new PlainTime(15, 23, 30).toString(), '15:23:30');
    });
    it('new Time(15, 23, 30, 123).toString()', () => {
      equal(new PlainTime(15, 23, 30, 123).toString(), '15:23:30.123');
    });
    it('new Time(15, 23, 30, 123, 456).toString()', () => {
      equal(new PlainTime(15, 23, 30, 123, 456).toString(), '15:23:30.123456');
    });
    it('new Time(15, 23, 30, 123, 456, 789).toString()', () => {
      equal(new PlainTime(15, 23, 30, 123, 456, 789).toString(), '15:23:30.123456789');
    });
    const t1 = PlainTime.from('15:23');
    const t2 = PlainTime.from('15:23:30');
    const t3 = PlainTime.from('15:23:30.1234');
    it('default is to emit seconds and drop trailing zeros after the decimal', () => {
      equal(t1.toString(), '15:23:00');
      equal(t2.toString(), '15:23:30');
      equal(t3.toString(), '15:23:30.1234');
    });
    it('truncates to minute', () => {
      [t1, t2, t3].forEach((t) => equal(t.toString({ smallestUnit: 'minute' }), '15:23'));
    });
    it('other smallestUnits are aliases for fractional digits', () => {
      equal(t3.toString({ smallestUnit: 'second' }), t3.toString({ fractionalSecondDigits: 0 }));
      equal(t3.toString({ smallestUnit: 'millisecond' }), t3.toString({ fractionalSecondDigits: 3 }));
      equal(t3.toString({ smallestUnit: 'microsecond' }), t3.toString({ fractionalSecondDigits: 6 }));
      equal(t3.toString({ smallestUnit: 'nanosecond' }), t3.toString({ fractionalSecondDigits: 9 }));
    });
    it('throws on invalid or disallowed smallestUnit', () => {
      ['era', 'year', 'month', 'day', 'hour', 'nonsense'].forEach((smallestUnit) =>
        throws(() => t1.toString({ smallestUnit }), RangeError)
      );
    });
    it('accepts plural units', () => {
      equal(t3.toString({ smallestUnit: 'minutes' }), t3.toString({ smallestUnit: 'minute' }));
      equal(t3.toString({ smallestUnit: 'seconds' }), t3.toString({ smallestUnit: 'second' }));
      equal(t3.toString({ smallestUnit: 'milliseconds' }), t3.toString({ smallestUnit: 'millisecond' }));
      equal(t3.toString({ smallestUnit: 'microseconds' }), t3.toString({ smallestUnit: 'microsecond' }));
      equal(t3.toString({ smallestUnit: 'nanoseconds' }), t3.toString({ smallestUnit: 'nanosecond' }));
    });
    it('truncates or pads to 2 places', () => {
      const options = { fractionalSecondDigits: 2 };
      equal(t1.toString(options), '15:23:00.00');
      equal(t2.toString(options), '15:23:30.00');
      equal(t3.toString(options), '15:23:30.12');
    });
    it('pads to 7 places', () => {
      const options = { fractionalSecondDigits: 7 };
      equal(t1.toString(options), '15:23:00.0000000');
      equal(t2.toString(options), '15:23:30.0000000');
      equal(t3.toString(options), '15:23:30.1234000');
    });
    it('auto is the default', () => {
      [t1, t2, t3].forEach((dt) => equal(dt.toString({ fractionalSecondDigits: 'auto' }), dt.toString()));
    });
    it('throws on out of range or invalid fractionalSecondDigits', () => {
      [-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
        throws(() => t1.toString({ fractionalSecondDigits }), RangeError)
      );
    });
    it('accepts and truncates fractional fractionalSecondDigits', () => {
      equal(t3.toString({ fractionalSecondDigits: 5.5 }), '15:23:30.12340');
    });
    it('smallestUnit overrides fractionalSecondDigits', () => {
      equal(t3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 }), '15:23');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => t1.toString({ roundingMode: 'cile' }), RangeError);
    });
    it('rounds to nearest', () => {
      equal(t2.toString({ smallestUnit: 'minute', roundingMode: 'halfExpand' }), '15:24');
      equal(t3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' }), '15:23:30.123');
    });
    it('rounds up', () => {
      equal(t2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' }), '15:24');
      equal(t3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }), '15:23:30.124');
    });
    it('rounds down', () => {
      ['floor', 'trunc'].forEach((roundingMode) => {
        equal(t2.toString({ smallestUnit: 'minute', roundingMode }), '15:23');
        equal(t3.toString({ fractionalSecondDigits: 3, roundingMode }), '15:23:30.123');
      });
    });
    it('rounding can affect all units', () => {
      const t4 = PlainTime.from('23:59:59.999999999');
      equal(t4.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }), '00:00:00.00000000');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => t1.toString(badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(t1.toString(options), '15:23:00'));
    });
  });
  describe('Time.from() works', () => {
    it('Time.from("15:23")', () => {
      equal(`${PlainTime.from('15:23')}`, '15:23:00');
    });
    it('Time.from("15:23:30")', () => {
      equal(`${PlainTime.from('15:23:30')}`, '15:23:30');
    });
    it('Time.from("15:23:30.123")', () => {
      equal(`${PlainTime.from('15:23:30.123')}`, '15:23:30.123');
    });
    it('Time.from("15:23:30.123456")', () => {
      equal(`${PlainTime.from('15:23:30.123456')}`, '15:23:30.123456');
    });
    it('Time.from("15:23:30.123456789")', () => {
      equal(`${PlainTime.from('15:23:30.123456789')}`, '15:23:30.123456789');
    });
    it('Time.from({ hour: 15, minute: 23 })', () => equal(`${PlainTime.from({ hour: 15, minute: 23 })}`, '15:23:00'));
    it('Time.from({ minute: 30, microsecond: 555 })', () =>
      equal(`${PlainTime.from({ minute: 30, microsecond: 555 })}`, '00:30:00.000555'));
    it('Time.from(ISO string leap second) is constrained', () => {
      equal(`${PlainTime.from('23:59:60')}`, '23:59:59');
      equal(`${PlainTime.from('23:59:60', { overflow: 'reject' })}`, '23:59:59');
    });
    it('Time.from(number) is converted to string', () => equal(`${PlainTime.from(1523)}`, `${PlainTime.from('1523')}`));
    it('Time.from(time) returns the same properties', () => {
      const t = PlainTime.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]');
      equal(PlainTime.from(t).toString(), t.toString());
    });
    it('Time.from(dateTime) returns the same time properties', () => {
      const dt = PlainDateTime.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]');
      equal(PlainTime.from(dt).toString(), dt.toPlainTime().toString());
    });
    it('Time.from(time) is not the same object', () => {
      const t = PlainTime.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]');
      notEqual(PlainTime.from(t), t);
    });
    it('any number of decimal places', () => {
      equal(`${PlainTime.from('1976-11-18T15:23:30.1Z')}`, '15:23:30.1');
      equal(`${PlainTime.from('1976-11-18T15:23:30.12Z')}`, '15:23:30.12');
      equal(`${PlainTime.from('1976-11-18T15:23:30.123Z')}`, '15:23:30.123');
      equal(`${PlainTime.from('1976-11-18T15:23:30.1234Z')}`, '15:23:30.1234');
      equal(`${PlainTime.from('1976-11-18T15:23:30.12345Z')}`, '15:23:30.12345');
      equal(`${PlainTime.from('1976-11-18T15:23:30.123456Z')}`, '15:23:30.123456');
      equal(`${PlainTime.from('1976-11-18T15:23:30.1234567Z')}`, '15:23:30.1234567');
      equal(`${PlainTime.from('1976-11-18T15:23:30.12345678Z')}`, '15:23:30.12345678');
      equal(`${PlainTime.from('1976-11-18T15:23:30.123456789Z')}`, '15:23:30.123456789');
    });
    it('variant decimal separator', () => {
      equal(`${PlainTime.from('1976-11-18T15:23:30,12Z')}`, '15:23:30.12');
    });
    it('variant minus sign', () => {
      equal(`${PlainTime.from('1976-11-18T15:23:30.12\u221202:00')}`, '15:23:30.12');
    });
    it('basic format', () => {
      equal(`${PlainTime.from('152330')}`, '15:23:30');
      equal(`${PlainTime.from('152330.1')}`, '15:23:30.1');
      equal(`${PlainTime.from('152330-08')}`, '15:23:30');
      equal(`${PlainTime.from('152330.1-08')}`, '15:23:30.1');
      equal(`${PlainTime.from('152330-0800')}`, '15:23:30');
      equal(`${PlainTime.from('152330.1-0800')}`, '15:23:30.1');
    });
    it('mixture of basic and extended format', () => {
      equal(`${PlainTime.from('1976-11-18T152330.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('19761118T15:23:30.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('1976-11-18T15:23:30.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('1976-11-18T152330.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('19761118T15:23:30.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('19761118T152330.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('19761118T152330.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('+001976-11-18T152330.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('+0019761118T15:23:30.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('+001976-11-18T15:23:30.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('+001976-11-18T152330.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('+0019761118T15:23:30.1+0000')}`, '15:23:30.1');
      equal(`${PlainTime.from('+0019761118T152330.1+00:00')}`, '15:23:30.1');
      equal(`${PlainTime.from('+0019761118T152330.1+0000')}`, '15:23:30.1');
    });
    it('optional parts', () => {
      equal(`${PlainTime.from('15')}`, '15:00:00');
    });
    it('no junk at end of string', () => throws(() => PlainTime.from('15:23:30.100junk'), RangeError));
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => PlainTime.from({ hour: 12 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${PlainTime.from({ hour: 12 }, options)}`, '12:00:00'));
    });
    describe('Overflow', () => {
      const bad = { nanosecond: 1000 };
      it('reject', () => throws(() => PlainTime.from(bad, { overflow: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${PlainTime.from(bad)}`, '00:00:00.000000999');
        equal(`${PlainTime.from(bad, { overflow: 'constrain' })}`, '00:00:00.000000999');
      });
      it('throw on bad overflow', () => {
        [new PlainTime(15), { hour: 15 }, '15:00'].forEach((input) => {
          ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
            throws(() => PlainTime.from(input, { overflow }), RangeError)
          );
        });
      });
      const leap = { hour: 23, minute: 59, second: 60 };
      it('reject leap second', () => throws(() => PlainTime.from(leap, { overflow: 'reject' }), RangeError));
      it('constrain leap second', () => equal(`${PlainTime.from(leap)}`, '23:59:59'));
      it('constrain has no effect on invalid ISO string', () => {
        throws(() => PlainTime.from('24:60', { overflow: 'constrain' }), RangeError);
      });
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
  describe('time.getISOFields() works', () => {
    const t1 = PlainTime.from('15:23:30.123456789');
    const fields = t1.getISOFields();
    it('fields', () => {
      equal(fields.isoHour, 15);
      equal(fields.isoMinute, 23);
      equal(fields.isoSecond, 30);
      equal(fields.isoMillisecond, 123);
      equal(fields.isoMicrosecond, 456);
      equal(fields.isoNanosecond, 789);
      equal(fields.calendar.id, 'iso8601');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoHour, 15);
      equal(fields2.isoMinute, 23);
      equal(fields2.isoSecond, 30);
      equal(fields2.isoMillisecond, 123);
      equal(fields2.isoMicrosecond, 456);
      equal(fields2.calendar.id, 'iso8601');
    });
    it('as input to constructor', () => {
      const t2 = new PlainTime(
        fields.isoHour,
        fields.isoMinute,
        fields.isoSecond,
        fields.isoMillisecond,
        fields.isoMicrosecond,
        fields.isoNanosecond
      );
      assert(t1.equals(t2));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
