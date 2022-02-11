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
const { PlainTime } = Temporal;

describe('Time', () => {
  describe('time.until() works', () => {
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
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
  });
  describe('time.since() works', () => {
    const earlier = PlainTime.from('08:22:36.123456789');
    const later = PlainTime.from('12:39:40.987654321');
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
  });
  describe('Time.round works', () => {
    const time = PlainTime.from('13:46:23.123456789');
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
