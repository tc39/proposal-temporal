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
const { Instant } = Temporal;

describe('Instant', () => {
  describe('instant.toString() works', () => {
    it('optional time zone parameter UTC', () => {
      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
      const timeZone = Temporal.TimeZone.from('UTC');
      equal(inst.toString({ timeZone }), '1976-11-18T14:23:30.123456789+00:00');
    });
    it('optional time zone parameter non-UTC', () => {
      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
      const timeZone = Temporal.TimeZone.from('America/New_York');
      equal(inst.toString({ timeZone }), '1976-11-18T09:23:30.123456789-05:00');
    });
    it('sub-minute offset', () => {
      const inst = Instant.from('1900-01-01T12:00Z');
      const timeZone = Temporal.TimeZone.from('Europe/Amsterdam');
      equal(inst.toString({ timeZone }), '1900-01-01T12:19:32+00:20');
    });
    const i1 = Instant.from('1976-11-18T15:23Z');
    const i2 = Instant.from('1976-11-18T15:23:30Z');
    const i3 = Instant.from('1976-11-18T15:23:30.1234Z');
    it('default is to emit seconds and drop trailing zeros after the decimal', () => {
      equal(i1.toString(), '1976-11-18T15:23:00Z');
      equal(i2.toString(), '1976-11-18T15:23:30Z');
    });
    it('truncates or pads to 2 places', () => {
      const options = { fractionalSecondDigits: 2 };
      equal(i1.toString(options), '1976-11-18T15:23:00.00Z');
      equal(i2.toString(options), '1976-11-18T15:23:30.00Z');
      equal(i3.toString(options), '1976-11-18T15:23:30.12Z');
    });
    it('pads to 7 places', () => {
      const options = { fractionalSecondDigits: 7 };
      equal(i1.toString(options), '1976-11-18T15:23:00.0000000Z');
      equal(i2.toString(options), '1976-11-18T15:23:30.0000000Z');
      equal(i3.toString(options), '1976-11-18T15:23:30.1234000Z');
    });
    it('auto is the default', () => {
      [i1, i2, i3].forEach((i) => equal(i.toString({ fractionalSecondDigits: 'auto' }), i.toString()));
    });
    it('smallestUnit overrides fractionalSecondDigits', () => {
      equal(i3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 }), '1976-11-18T15:23Z');
    });
    it('rounds to nearest', () => {
      equal(i2.toString({ smallestUnit: 'minute', roundingMode: 'halfExpand' }), '1976-11-18T15:24Z');
      equal(i3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' }), '1976-11-18T15:23:30.123Z');
    });
    it('rounds up', () => {
      equal(i2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' }), '1976-11-18T15:24Z');
      equal(i3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }), '1976-11-18T15:23:30.124Z');
    });
    it('rounds down', () => {
      ['floor', 'trunc'].forEach((roundingMode) => {
        equal(i2.toString({ smallestUnit: 'minute', roundingMode }), '1976-11-18T15:23Z');
        equal(i3.toString({ fractionalSecondDigits: 3, roundingMode }), '1976-11-18T15:23:30.123Z');
      });
    });
    it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
      const i4 = Instant.from('-000099-12-15T12:00:00.5Z');
      equal(i4.toString({ smallestUnit: 'second', roundingMode: 'floor' }), '-000099-12-15T12:00:00Z');
    });
    it('rounding can affect all units', () => {
      const i5 = Instant.from('1999-12-31T23:59:59.999999999Z');
      equal(i5.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }), '2000-01-01T00:00:00.00000000Z');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => i1.toString(badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(i1.toString(options), '1976-11-18T15:23:00Z'));
    });
  });
  describe('Instant.from() works', () => {
    it('1976-11-18T15:23Z', () => {
      equal(Instant.from('1976-11-18T15:23Z').epochMilliseconds, Date.UTC(1976, 10, 18, 15, 23));
    });
    it('1976-11-18T15:23:30Z', () => {
      equal(Instant.from('1976-11-18T15:23:30Z').epochMilliseconds, Date.UTC(1976, 10, 18, 15, 23, 30));
    });
    it('1976-11-18T15:23:30.123Z', () => {
      equal(Instant.from('1976-11-18T15:23:30.123Z').epochMilliseconds, Date.UTC(1976, 10, 18, 15, 23, 30, 123));
    });
    it('1976-11-18T15:23:30.123456Z', () => {
      equal(
        Instant.from('1976-11-18T15:23:30.123456Z').epochMicroseconds,
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
      );
    });
    it('1976-11-18T15:23:30.123456789Z', () => {
      equal(
        Instant.from('1976-11-18T15:23:30.123456789Z').epochNanoseconds,
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
      );
    });
    it('2020-02-12T11:42-08:00', () => {
      equal(
        Instant.from('2020-02-12T11:42-08:00').epochNanoseconds,
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
      equal(
        Instant.from('2020-02-12T11:42-08:00[America/Vancouver]').epochNanoseconds,
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00', () => {
      equal(
        Instant.from('2020-02-12T11:42+01:00').epochNanoseconds,
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
      equal(
        Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').epochNanoseconds,
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
      equal(
        Instant.from('2019-02-16T23:45-02:00[America/Sao_Paulo]').epochNanoseconds,
        BigInt(Date.UTC(2019, 1, 17, 1, 45)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
      equal(
        Instant.from('2019-02-16T23:45-03:00[America/Sao_Paulo]').epochNanoseconds,
        BigInt(Date.UTC(2019, 1, 17, 2, 45)) * BigInt(1e6)
      );
    });
    it('sub-minute offset', () => {
      equal(
        Instant.from('1900-01-01T12:19:32+00:19:32[Europe/Amsterdam]').epochNanoseconds,
        BigInt(Date.UTC(1900, 0, 1, 12)) * BigInt(1e6)
      );
    });
    it('Instant.from(string-convertible) converts to string', () => {
      const obj = {
        toString() {
          return '2020-02-12T11:42+01:00[Europe/Amsterdam]';
        }
      };
      equal(`${Instant.from(obj)}`, '2020-02-12T10:42:00Z');
    });
    it('Instant.from(1) throws', () => throws(() => Instant.from(1), RangeError));
    it('Instant.from(-1) throws', () => throws(() => Instant.from(-1), RangeError));
    it('Instant.from(1n) throws', () => throws(() => Instant.from(1n), RangeError));
    it('Instant.from(-1n) throws', () => throws(() => Instant.from(-1n), RangeError));
    it('Instant.from({}) throws', () => throws(() => Instant.from({}), RangeError));
    it('Instant.from(instant) is not the same object', () => {
      const inst = Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
      notEqual(Instant.from(inst), inst);
    });
    it('Instant.from(ISO string leap second) is constrained', () => {
      equal(`${Instant.from('2016-12-31T23:59:60Z')}`, '2016-12-31T23:59:59Z');
    });
    it('variant time separators', () => {
      equal(`${Instant.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23:00Z');
      equal(`${Instant.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23:00Z');
    });
    it('variant UTC designator', () => {
      equal(`${Instant.from('1976-11-18T15:23z')}`, '1976-11-18T15:23:00Z');
    });
    it('any number of decimal places', () => {
      equal(`${Instant.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.12Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.1234Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.12345Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.1234567Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.12345678Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('variant decimal separator', () => {
      equal(`${Instant.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.12Z');
    });
    it('variant minus sign', () => {
      equal(`${Instant.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T17:23:30.12Z');
      equal(`${Instant.from('\u2212009999-11-18T15:23:30.12Z')}`, '-009999-11-18T15:23:30.12Z');
    });
    it('mixture of basic and extended format', () => {
      equal(`${Instant.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1Z');
      equal(`${Instant.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.1Z');
    });
    it('optional parts', () => {
      equal(`${Instant.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30Z');
      equal(`${Instant.from('1976-11-18T15Z')}`, '1976-11-18T15:00:00Z');
    });
    it('ignores any specified calendar', () =>
      equal(`${Instant.from('1976-11-18T15:23:30.123456789Z[u-ca=discord]')}`, '1976-11-18T15:23:30.123456789Z'));
    it('no junk at end of string', () => throws(() => Instant.from('1976-11-18T15:23:30.123456789Zjunk'), RangeError));
  });
  describe('Instant.add works', () => {
    const inst = Instant.from('1969-12-25T12:23:45.678901234Z');
    describe('cross epoch in ms', () => {
      const one = inst.subtract({ hours: 240, nanoseconds: 800 });
      const two = inst.add({ hours: 240, nanoseconds: 800 });
      const three = two.subtract({ hours: 480, nanoseconds: 1600 });
      const four = one.add({ hours: 480, nanoseconds: 1600 });
      it(`(${inst}).subtract({ hours: 240, nanoseconds: 800 }) = ${one}`, () =>
        equal(`${one}`, '1969-12-15T12:23:45.678900434Z'));
      it(`(${inst}).add({ hours: 240, nanoseconds: 800 }) = ${two}`, () =>
        equal(`${two}`, '1970-01-04T12:23:45.678902034Z'));
      it(`(${two}).subtract({ hours: 480, nanoseconds: 1600 }) = ${one}`, () => assert(three.equals(one)));
      it(`(${one}).add({ hours: 480, nanoseconds: 1600 }) = ${two}`, () => assert(four.equals(two)));
    });
    it('mixed positive and negative values always throw', () => {
      throws(() => inst.add({ hours: 1, minutes: -30 }), RangeError);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => inst.add({}), TypeError);
      throws(() => inst.add({ hour: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${inst.add({ hour: 1, minutes: 1 })}`, '1969-12-25T12:24:45.678901234Z');
    });
  });
  describe('Instant.subtract works', () => {
    const inst = Instant.from('1969-12-25T12:23:45.678901234Z');
    it('mixed positive and negative values always throw', () => {
      throws(() => inst.subtract({ hours: 1, minutes: -30 }), RangeError);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => inst.subtract({}), TypeError);
      throws(() => inst.subtract({ hour: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${inst.subtract({ hour: 1, minutes: 1 })}`, '1969-12-25T12:22:45.678901234Z');
    });
  });
  describe('Instant.compare works', () => {
    const i1 = Instant.from('1963-02-13T09:36:29.123456789Z');
    const i2 = Instant.from('1976-11-18T15:23:30.123456789Z');
    const i3 = Instant.from('1981-12-15T14:34:31.987654321Z');
    it('pre epoch equal', () => equal(Instant.compare(i1, Instant.from(i1)), 0));
    it('epoch equal', () => equal(Instant.compare(i2, Instant.from(i2)), 0));
    it('cross epoch smaller/larger', () => equal(Instant.compare(i1, i2), -1));
    it('cross epoch larger/smaller', () => equal(Instant.compare(i2, i1), 1));
    it('epoch smaller/larger', () => equal(Instant.compare(i2, i3), -1));
    it('epoch larger/smaller', () => equal(Instant.compare(i3, i2), 1));
    it('only casts from a string', () => {
      throws(() => Instant.compare(i2.epochNanoseconds, i2), RangeError);
      throws(() => Instant.compare({}, i2), RangeError);
    });
  });
  describe('Instant.equals works', () => {
    const i1 = Instant.from('1963-02-13T09:36:29.123456789Z');
    const i2 = Instant.from('1976-11-18T15:23:30.123456789Z');
    const i3 = Instant.from('1981-12-15T14:34:31.987654321Z');
    it('pre epoch equal', () => assert(i1.equals(i1)));
    it('epoch equal', () => assert(i2.equals(i2)));
    it('cross epoch unequal', () => assert(!i1.equals(i2)));
    it('epoch unequal', () => assert(!i2.equals(i3)));
  });
  describe("Comparison operators don't work", () => {
    const i1 = Instant.from('1963-02-13T09:36:29.123456789Z');
    const i1again = Instant.from('1963-02-13T09:36:29.123456789Z');
    const i2 = Instant.from('1976-11-18T15:23:30.123456789Z');
    it('=== is object equality', () => equal(i1, i1));
    it('!== is object equality', () => notEqual(i1, i1again));
    it('<', () => throws(() => i1 < i2));
    it('>', () => throws(() => i1 > i2));
    it('<=', () => throws(() => i1 <= i2));
    it('>=', () => throws(() => i1 >= i2));
  });
  describe('Instant.since() works', () => {
    const earlier = Instant.from('1976-11-18T15:23:30.123456789Z');
    const later = Instant.from('2019-10-29T10:46:38.271986102Z');
    const diff = later.since(earlier);
    it(`(${earlier}).since(${later}) == (${later}).since(${earlier}).negated()`, () =>
      equal(`${earlier.since(later)}`, `${diff.negated()}`));
    it(`(${later}).since(${earlier}) == (${earlier}).until(${later})`, () =>
      equal(`${earlier.until(later)}`, `${diff}`));
    it(`(${earlier}).add(${diff}) == (${later})`, () => assert(earlier.add(diff).equals(later)));
    it(`(${later}).subtract(${diff}) == (${earlier})`, () => assert(later.subtract(diff).equals(earlier)));
    it('only casts from a string', () => {
      throws(() => later.since(earlier.epochNanoseconds), RangeError);
      throws(() => earlier.since({}), RangeError);
    });
    const feb20 = Instant.from('2020-02-01T00:00Z');
    const feb21 = Instant.from('2021-02-01T00:00Z');
    it('can return minutes and hours', () => {
      equal(`${feb21.since(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb21.since(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
    });
    it('can return subseconds', () => {
      const later = feb20.add({ hours: 24, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = later.since(feb20, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = later.since(feb20, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = later.since(feb20, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb21.since(feb20, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb21.since(feb20, options)}`, 'PT31622400S'));
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
      equal(`${later.since(earlier, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`, 'PT376435H');
      equal(`${later.since(earlier, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`, 'PT22586123M');
    });
    const largestUnit = 'hours';
    const incrementOneNearest = [
      ['hours', 'PT376435H'],
      ['minutes', 'PT376435H23M'],
      ['seconds', 'PT376435H23M8S'],
      ['milliseconds', 'PT376435H23M8.149S'],
      ['microseconds', 'PT376435H23M8.148529S'],
      ['nanoseconds', 'PT376435H23M8.148529313S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['hours', 'PT376436H', '-PT376435H'],
      ['minutes', 'PT376435H24M', '-PT376435H23M'],
      ['seconds', 'PT376435H23M9S', '-PT376435H23M8S'],
      ['milliseconds', 'PT376435H23M8.149S', '-PT376435H23M8.148S'],
      ['microseconds', 'PT376435H23M8.14853S', '-PT376435H23M8.148529S'],
      ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['hours', 'PT376435H', '-PT376436H'],
      ['minutes', 'PT376435H23M', '-PT376435H24M'],
      ['seconds', 'PT376435H23M8S', '-PT376435H23M9S'],
      ['milliseconds', 'PT376435H23M8.148S', '-PT376435H23M8.149S'],
      ['microseconds', 'PT376435H23M8.148529S', '-PT376435H23M8.14853S'],
      ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['hours', 'PT376435H'],
      ['minutes', 'PT376435H23M'],
      ['seconds', 'PT376435H23M8S'],
      ['milliseconds', 'PT376435H23M8.148S'],
      ['microseconds', 'PT376435H23M8.148529S'],
      ['nanoseconds', 'PT376435H23M8.148529313S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'hours',
          roundingIncrement: 3,
          roundingMode: 'halfExpand'
        })}`,
        'PT376434H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'minutes',
          roundingIncrement: 30,
          roundingMode: 'halfExpand'
        })}`,
        'PT376435H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'seconds',
          roundingIncrement: 15,
          roundingMode: 'halfExpand'
        })}`,
        'PT376435H23M15S'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'milliseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT376435H23M8.15S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'microseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT376435H23M8.14853S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${later.since(earlier, {
          largestUnit,
          smallestUnit: 'nanoseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT376435H23M8.14852931S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { largestUnit, smallestUnit: 'hours', roundingIncrement };
        assert(later.since(earlier, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 29 }),
        RangeError
      );
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => later.since(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => later.since(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }),
        RangeError
      );
    });
  });
  describe('Instant.until() works', () => {
    const earlier = Instant.from('1969-07-24T16:50:35.123456789Z');
    const later = Instant.from('2019-10-29T10:46:38.271986102Z');
    const diff = earlier.until(later);
    it(`(${later}).until(${earlier}) == (${earlier}).until(${later}).negated()`, () =>
      equal(`${later.until(earlier)}`, `${diff.negated()}`));
    it(`(${earlier}).until(${later}) == (${later}).since(${earlier})`, () =>
      equal(`${later.since(earlier)}`, `${diff}`));
    it(`(${earlier}).add(${diff}) == (${later})`, () => assert(earlier.add(diff).equals(later)));
    it(`(${later}).subtract(${diff}) == (${earlier})`, () => assert(later.subtract(diff).equals(earlier)));
    it('only casts from a string', () => {
      throws(() => earlier.until(later.epochNanoseconds), RangeError);
      throws(() => earlier.until({}), RangeError);
    });
    const feb20 = Instant.from('2020-02-01T00:00Z');
    const feb21 = Instant.from('2021-02-01T00:00Z');
    it('can return minutes and hours', () => {
      equal(`${feb20.until(feb21, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb20.until(feb21, { largestUnit: 'minutes' })}`, 'PT527040M');
    });
    it('can return subseconds', () => {
      const later = feb20.add({ hours: 24, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = feb20.until(later, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = feb20.until(later, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = feb20.until(later, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb20.until(feb21, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb20.until(feb21, options)}`, 'PT31622400S'));
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
      equal(`${earlier.until(later, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`, 'PT440610H');
      equal(`${earlier.until(later, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`, 'PT26436596M');
    });
    const largestUnit = 'hours';
    const incrementOneNearest = [
      ['hours', 'PT440610H'],
      ['minutes', 'PT440609H56M'],
      ['seconds', 'PT440609H56M3S'],
      ['milliseconds', 'PT440609H56M3.149S'],
      ['microseconds', 'PT440609H56M3.148529S'],
      ['nanoseconds', 'PT440609H56M3.148529313S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['hours', 'PT440610H', '-PT440609H'],
      ['minutes', 'PT440609H57M', '-PT440609H56M'],
      ['seconds', 'PT440609H56M4S', '-PT440609H56M3S'],
      ['milliseconds', 'PT440609H56M3.149S', '-PT440609H56M3.148S'],
      ['microseconds', 'PT440609H56M3.14853S', '-PT440609H56M3.148529S'],
      ['nanoseconds', 'PT440609H56M3.148529313S', '-PT440609H56M3.148529313S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['hours', 'PT440609H', '-PT440610H'],
      ['minutes', 'PT440609H56M', '-PT440609H57M'],
      ['seconds', 'PT440609H56M3S', '-PT440609H56M4S'],
      ['milliseconds', 'PT440609H56M3.148S', '-PT440609H56M3.149S'],
      ['microseconds', 'PT440609H56M3.148529S', '-PT440609H56M3.14853S'],
      ['nanoseconds', 'PT440609H56M3.148529313S', '-PT440609H56M3.148529313S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['hours', 'PT440609H'],
      ['minutes', 'PT440609H56M'],
      ['seconds', 'PT440609H56M3S'],
      ['milliseconds', 'PT440609H56M3.148S'],
      ['microseconds', 'PT440609H56M3.148529S'],
      ['nanoseconds', 'PT440609H56M3.148529313S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'hours',
          roundingIncrement: 4,
          roundingMode: 'halfExpand'
        })}`,
        'PT440608H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'minutes',
          roundingIncrement: 30,
          roundingMode: 'halfExpand'
        })}`,
        'PT440610H'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'seconds',
          roundingIncrement: 15,
          roundingMode: 'halfExpand'
        })}`,
        'PT440609H56M'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'milliseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT440609H56M3.15S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'microseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT440609H56M3.14853S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${earlier.until(later, {
          largestUnit,
          smallestUnit: 'nanoseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'PT440609H56M3.14852931S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { largestUnit, smallestUnit: 'hours', roundingIncrement };
        assert(earlier.until(later, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 29 }),
        RangeError
      );
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => earlier.until(later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => earlier.until(later, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }),
        RangeError
      );
    });
  });
  describe('Instant.round works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without required smallestUnit parameter', () => {
      throws(() => inst.round({}), RangeError);
      throws(() => inst.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
    });
    it('throws on disallowed or invalid smallestUnit (object param)', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => inst.round({ smallestUnit }), RangeError);
        }
      );
    });
    it('throws on disallowed or invalid smallestUnit (string param)', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => inst.round(smallestUnit), RangeError);
        }
      );
    });
    const incrementOneNearest = [
      ['hour', '1976-11-18T14:00:00Z'],
      ['minute', '1976-11-18T14:24:00Z'],
      ['second', '1976-11-18T14:23:30Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z'],
      ['microsecond', '1976-11-18T14:23:30.123457Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        equal(`${inst.round({ smallestUnit, roundingMode: 'halfExpand' })}`, expected));
    });
    const incrementOneCeil = [
      ['hour', '1976-11-18T15:00:00Z'],
      ['minute', '1976-11-18T14:24:00Z'],
      ['second', '1976-11-18T14:23:31Z'],
      ['millisecond', '1976-11-18T14:23:30.124Z'],
      ['microsecond', '1976-11-18T14:23:30.123457Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () =>
        equal(`${inst.round({ smallestUnit, roundingMode: 'ceil' })}`, expected));
    });
    const incrementOneFloor = [
      ['hour', '1976-11-18T14:00:00Z'],
      ['minute', '1976-11-18T14:23:00Z'],
      ['second', '1976-11-18T14:23:30Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z'],
      ['microsecond', '1976-11-18T14:23:30.123456Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        equal(`${inst.round({ smallestUnit, roundingMode: 'floor' })}`, expected));
      it(`truncates to ${smallestUnit}`, () =>
        equal(`${inst.round({ smallestUnit, roundingMode: 'trunc' })}`, expected));
    });
    it('rounding down is towards the Big Bang, not towards the epoch', () => {
      const inst2 = Instant.from('1969-12-15T12:00:00.5Z');
      const smallestUnit = 'second';
      equal(`${inst2.round({ smallestUnit, roundingMode: 'ceil' })}`, '1969-12-15T12:00:01Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'floor' })}`, '1969-12-15T12:00:00Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'trunc' })}`, '1969-12-15T12:00:00Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'halfExpand' })}`, '1969-12-15T12:00:01Z');
    });
    it('rounds to an increment of hours', () => {
      equal(`${inst.round({ smallestUnit: 'hour', roundingIncrement: 4 })}`, '1976-11-18T16:00:00Z');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${inst.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`, '1976-11-18T14:30:00Z');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${inst.round({ smallestUnit: 'second', roundingIncrement: 30 })}`, '1976-11-18T14:23:30Z');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${inst.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12Z');
    });
    it('rounds to an increment of microseconds', () => {
      equal(`${inst.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12346Z');
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(`${inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12345679Z');
    });
    it('rounds to days by specifying increment of 86400 seconds in various units', () => {
      const expected = '1976-11-19T00:00:00Z';
      equal(`${inst.round({ smallestUnit: 'hour', roundingIncrement: 24 })}`, expected);
      equal(`${inst.round({ smallestUnit: 'minute', roundingIncrement: 1440 })}`, expected);
      equal(`${inst.round({ smallestUnit: 'second', roundingIncrement: 86400 })}`, expected);
      equal(`${inst.round({ smallestUnit: 'millisecond', roundingIncrement: 86400e3 })}`, expected);
      equal(`${inst.round({ smallestUnit: 'microsecond', roundingIncrement: 86400e6 })}`, expected);
      equal(`${inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 86400e9 })}`, expected);
    });
    it('allows increments that divide evenly into solar days', () => {
      assert(inst.round({ smallestUnit: 'second', roundingIncrement: 864 }) instanceof Instant);
    });
    it('throws on increments that do not divide evenly into solar days', () => {
      throws(() => inst.round({ smallestUnit: 'hour', roundingIncrement: 7 }), RangeError);
      throws(() => inst.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError);
      throws(() => inst.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError);
      throws(() => inst.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError);
      throws(() => inst.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError);
      throws(() => inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError);
    });
    it('accepts plural units', () => {
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'].forEach((smallestUnit) => {
        assert(inst.round({ smallestUnit }).equals(inst.round({ smallestUnit: `${smallestUnit}s` })));
      });
    });
    it('accepts string parameter as shortcut for {smallestUnit}', () => {
      ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'].forEach((smallestUnit) => {
        assert(inst.round(smallestUnit).equals(inst.round({ smallestUnit })));
      });
    });
  });
  describe('Min/max range', () => {
    it('constructing from ns', () => {
      const limit = 8_640_000_000_000_000_000_000n;
      throws(() => new Instant(-limit - 1n), RangeError);
      throws(() => new Instant(limit + 1n), RangeError);
      equal(`${new Instant(-limit)}`, '-271821-04-20T00:00:00Z');
      equal(`${new Instant(limit)}`, '+275760-09-13T00:00:00Z');
    });
    it('constructing from ms', () => {
      const limit = 86400e11;
      throws(() => Instant.fromEpochMilliseconds(-limit - 1), RangeError);
      throws(() => Instant.fromEpochMilliseconds(limit + 1), RangeError);
      equal(`${Instant.fromEpochMilliseconds(-limit)}`, '-271821-04-20T00:00:00Z');
      equal(`${Instant.fromEpochMilliseconds(limit)}`, '+275760-09-13T00:00:00Z');
    });
    it('constructing from ISO string', () => {
      throws(() => Instant.from('-271821-04-19T23:59:59.999999999Z'), RangeError);
      throws(() => Instant.from('+275760-09-13T00:00:00.000000001Z'), RangeError);
      equal(`${Instant.from('-271821-04-20T00:00Z')}`, '-271821-04-20T00:00:00Z');
      equal(`${Instant.from('+275760-09-13T00:00Z')}`, '+275760-09-13T00:00:00Z');
      throws(() => Instant.from('-271821-04-20T00:00:00+00:01'), RangeError);
      throws(() => Instant.from('+275760-09-13T00:00:00-00:01'), RangeError);
    });
    it('converting from DateTime', () => {
      const min = Temporal.PlainDateTime.from('-271821-04-19T00:00:00.000000001');
      const max = Temporal.PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      const utc = Temporal.TimeZone.from('UTC');
      throws(() => utc.getInstantFor(min), RangeError);
      throws(() => utc.getInstantFor(max), RangeError);
    });
  });
  describe('Instant.toZonedDateTimeISO() works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => inst.toZonedDateTimeISO(), RangeError);
    });
    it('time zone parameter UTC', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const zdt = inst.toZonedDateTimeISO(tz);
      equal(inst.epochNanoseconds, zdt.epochNanoseconds);
      equal(`${zdt}`, '1976-11-18T14:23:30.123456789+00:00[UTC]');
    });
    it('time zone parameter non-UTC', () => {
      const tz = Temporal.TimeZone.from('America/New_York');
      const zdt = inst.toZonedDateTimeISO(tz);
      equal(inst.epochNanoseconds, zdt.epochNanoseconds);
      equal(`${zdt}`, '1976-11-18T09:23:30.123456789-05:00[America/New_York]');
    });
  });
  describe('Instant.toZonedDateTime() works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => inst.toZonedDateTime(), TypeError);
    });
    it('throws with a string parameter', () => {
      throws(() => inst.toZonedDateTime('Asia/Singapore'), TypeError);
    });
    it('time zone parameter UTC', () => {
      const timeZone = Temporal.TimeZone.from('UTC');
      const zdt = inst.toZonedDateTime({ timeZone, calendar: 'gregory' });
      equal(inst.epochNanoseconds, zdt.epochNanoseconds);
      equal(`${zdt}`, '1976-11-18T14:23:30.123456789+00:00[UTC][u-ca=gregory]');
    });
    it('time zone parameter non-UTC', () => {
      const timeZone = Temporal.TimeZone.from('America/New_York');
      const zdt = inst.toZonedDateTime({ timeZone, calendar: 'gregory' });
      equal(inst.epochNanoseconds, zdt.epochNanoseconds);
      equal(`${zdt}`, '1976-11-18T09:23:30.123456789-05:00[America/New_York][u-ca=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
