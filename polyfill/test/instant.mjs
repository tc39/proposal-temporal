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
  describe('Structure', () => {
    it('Instant is a Function', () => {
      equal(typeof Instant, 'function');
    });
    it('Instant has a prototype', () => {
      assert(Instant.prototype);
      equal(typeof Instant.prototype, 'object');
    });
    describe('Instant.prototype', () => {
      it('Instant.prototype.equals is a Function', () => {
        equal(typeof Instant.prototype.equals, 'function');
      });
      it('Instant.prototype.round is a Function', () => {
        equal(typeof Instant.prototype.round, 'function');
      });
      it('Instant.prototype.toDateTimeISO is a Function', () => {
        equal(typeof Instant.prototype.toDateTimeISO, 'function');
      });
      it('Instant.prototype.toDateTime is a Function', () => {
        equal(typeof Instant.prototype.toDateTime, 'function');
      });
    });
    it('Instant.fromEpochSeconds is a Function', () => {
      equal(typeof Instant.fromEpochSeconds, 'function');
    });
    it('Instant.fromEpochMicroseconds is a Function', () => {
      equal(typeof Instant.fromEpochMicroseconds, 'function');
    });
    it('Instant.fromEpochMilliseconds is a Function', () => {
      equal(typeof Instant.fromEpochMilliseconds, 'function');
    });
    it('Instant.fromEpochNanoseconds is a Function', () => {
      equal(typeof Instant.fromEpochNanoseconds, 'function');
    });
    it('Instant.from is a Function', () => {
      equal(typeof Instant.from, 'function');
    });
    it('Instant.compare is a Function', () => {
      equal(typeof Instant.compare, 'function');
    });
  });
  describe('Construction', () => {
    it('can construct', () => {
      const epochMillis = Date.UTC(1976, 10, 18, 14, 23, 30, 123);
      const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
      const instant = new Instant(epochNanos);
      assert(instant);
      equal(typeof instant, 'object');
      equal(instant.getEpochSeconds(), Math.floor(Date.UTC(1976, 10, 18, 14, 23, 30, 123) / 1e3), 'getEpochSeconds');
      equal(instant.getEpochMilliseconds(), Date.UTC(1976, 10, 18, 14, 23, 30, 123), 'getEpochMilliseconds');
    });
    it('constructs from string', () => equal(`${new Instant('0')}`, '1970-01-01T00:00Z'));
    it('throws on number', () => throws(() => new Instant(1234), TypeError));
    it('throws on string that does not convert to BigInt', () => throws(() => new Instant('abc123'), SyntaxError));
  });
  describe('instant.toString() works', () => {
    it('`1976-11-18T14:23:30.123456789Z`.toString()', () => {
      const iso = '1976-11-18T14:23:30.123456789Z';
      const instant = Instant.from(iso);
      assert(instant);
      equal(`${instant}`, iso);
    });
    it('`1963-02-13T09:36:29.123456789Z`.toString()', () => {
      const iso = '1963-02-13T09:36:29.123456789Z';
      const instant = Instant.from(iso);
      assert(instant);
      equal(`${instant}`, iso);
    });
    it('optional time zone parameter UTC', () => {
      const iso = '1976-11-18T14:23:30.123456789Z';
      const inst = Instant.from(iso);
      const tz = Temporal.TimeZone.from('UTC');
      equal(inst.toString(tz), iso);
    });
    it('optional time zone parameter non-UTC', () => {
      const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
      const tz = Temporal.TimeZone.from('America/New_York');
      equal(inst.toString(tz), '1976-11-18T09:23:30.123456789-05:00[America/New_York]');
    });
  });
  describe('Instant.toJSON() works', () => {
    it('`1976-11-18T15:23:30.123456789+01:00`.toJSON()', () => {
      const inst = Instant.from('1976-11-18T15:23:30.123456789+01:00');
      assert(inst);
      equal(inst.toJSON(), '1976-11-18T14:23:30.123456789Z');
    });
    it('`1963-02-13T10:36:29.123456789+01:00`.toJSON()', () => {
      const inst = Instant.from('1963-02-13T10:36:29.123456789+01:00');
      assert(inst);
      equal(inst.toJSON(), '1963-02-13T09:36:29.123456789Z');
    });
    it('argument is ignored', () => {
      const inst = Instant.from('1976-11-18T15:23:30.123456789+01:00');
      equal(inst.toJSON('+01:00'), inst.toJSON());
    });
  });
  describe('Instant.getEpochSeconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochSeconds(), Math.trunc(epochMs / 1e3));
      equal(typeof inst.getEpochSeconds(), 'number');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochSeconds(), Math.trunc(epochMs / 1e3));
      equal(typeof inst.getEpochSeconds(), 'number');
    });
  });
  describe('Instant.fromEpochSeconds() works', () => {
    it('1976-11-18T15:23:30', () => {
      const epochSeconds = Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3);
      const instant = Instant.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
    it('1963-02-13T09:36:29', () => {
      const epochSeconds = Math.floor(Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1e3);
      const instant = Instant.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
  });
  describe('Instant.getEpochMilliseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochMilliseconds(), epochMs);
      equal(typeof inst.getEpochMilliseconds(), 'number');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochMilliseconds(), epochMs);
      equal(typeof inst.getEpochMilliseconds(), 'number');
    });
  });
  describe('Instant.fromEpochMilliseconds() works', () => {
    it('1976-11-18T15:23:30.123', () => {
      const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
    it('1963-02-13T09:36:29.123', () => {
      const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
  });
  describe('Instant.getEpochMicroseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
      equal(typeof inst.getEpochMicroseconds(), 'bigint');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
      equal(typeof inst.getEpochMicroseconds(), 'bigint');
    });
  });
  describe('Instant.fromEpochMicroseconds() works', () => {
    it('1976-11-18T15:23:30.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
    it('1963-02-13T09:36:29.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
  });
  describe('Instant.getEpochNanoseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochNanoseconds(), epochNs);
      equal(typeof inst.getEpochNanoseconds(), 'bigint');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const inst = new Instant(epochNs);
      equal(inst.getEpochNanoseconds(), epochNs);
      equal(typeof inst.getEpochNanoseconds(), 'bigint');
    });
  });
  describe('Instant.fromEpochNanoseconds() works', () => {
    it('1976-11-18T15:23:30.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('1963-02-13T09:36:29.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('-1n', () => {
      const instant = Instant.fromEpochNanoseconds(-1n);
      equal(`${instant}`, '1969-12-31T23:59:59.999999999Z');
    });
  });
  describe('Instant.from() works', () => {
    it('1976-11-18T15:23Z', () => {
      equal(Instant.from('1976-11-18T15:23Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23));
    });
    it('1976-11-18T15:23:30Z', () => {
      equal(Instant.from('1976-11-18T15:23:30Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30));
    });
    it('1976-11-18T15:23:30.123Z', () => {
      equal(Instant.from('1976-11-18T15:23:30.123Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30, 123));
    });
    it('1976-11-18T15:23:30.123456Z', () => {
      equal(
        Instant.from('1976-11-18T15:23:30.123456Z').getEpochMicroseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
      );
    });
    it('1976-11-18T15:23:30.123456789Z', () => {
      equal(
        Instant.from('1976-11-18T15:23:30.123456789Z').getEpochNanoseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
      );
    });
    it('2020-02-12T11:42-08:00', () => {
      equal(
        Instant.from('2020-02-12T11:42-08:00').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
      equal(
        Instant.from('2020-02-12T11:42-08:00[America/Vancouver]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00', () => {
      equal(
        Instant.from('2020-02-12T11:42+01:00').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
      equal(
        Instant.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
      equal(
        Instant.from('2019-02-16T23:45-02:00[America/Sao_Paulo]').getEpochNanoseconds(),
        BigInt(Date.UTC(2019, 1, 17, 1, 45)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
      equal(
        Instant.from('2019-02-16T23:45-03:00[America/Sao_Paulo]').getEpochNanoseconds(),
        BigInt(Date.UTC(2019, 1, 17, 2, 45)) * BigInt(1e6)
      );
    });
    it('throws when unable to disambiguate using offset', () => {
      throws(() => Instant.from('2019-02-16T23:45-04:00[America/Sao_Paulo]'), RangeError);
    });
    it('Instant.from(string-convertible) converts to string', () => {
      const obj = {
        toString() {
          return '2020-02-12T11:42+01:00[Europe/Amsterdam]';
        }
      };
      equal(`${Instant.from(obj)}`, '2020-02-12T10:42Z');
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
      equal(`${Instant.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23Z');
      equal(`${Instant.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23Z');
    });
    it('variant UTC designator', () => {
      equal(`${Instant.from('1976-11-18T15:23z')}`, '1976-11-18T15:23Z');
    });
    it('any number of decimal places', () => {
      equal(`${Instant.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.123400Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.123450Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.123456700Z');
      equal(`${Instant.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.123456780Z');
      equal(`${Instant.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('variant decimal separator', () => {
      equal(`${Instant.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120Z');
    });
    it('variant minus sign', () => {
      equal(`${Instant.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T17:23:30.120Z');
      equal(`${Instant.from('\u2212009999-11-18T15:23:30.12Z')}`, '-009999-11-18T15:23:30.120Z');
    });
    it('mixture of basic and extended format', () => {
      equal(`${Instant.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Instant.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
    });
    it('optional parts', () => {
      equal(`${Instant.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30Z');
      equal(`${Instant.from('1976-11-18T15Z')}`, '1976-11-18T15:00Z');
    });
    it('ignores any specified calendar', () =>
      equal(`${Instant.from('1976-11-18T15:23:30.123456789Z[c=discord]')}`, '1976-11-18T15:23:30.123456789Z'));
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
    it('inst.add(durationObj)', () => {
      const later = inst.add(Temporal.Duration.from('PT240H0.000000800S'));
      equal(`${later}`, '1970-01-04T12:23:45.678902034Z');
    });
    it('invalid to add years, months, weeks, or days', () => {
      throws(() => inst.add({ years: 1 }), RangeError);
      throws(() => inst.add({ months: 1 }), RangeError);
      throws(() => inst.add({ weeks: 1 }), RangeError);
      throws(() => inst.add({ days: 1 }), RangeError);
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
    it('inst.subtract(durationObj)', () => {
      const earlier = inst.subtract(Temporal.Duration.from('PT240H0.000000800S'));
      equal(`${earlier}`, '1969-12-15T12:23:45.678900434Z');
    });
    it('invalid to subtract years, months, weeks, or days', () => {
      throws(() => inst.subtract({ years: 1 }), RangeError);
      throws(() => inst.subtract({ months: 1 }), RangeError);
      throws(() => inst.subtract({ weeks: 1 }), RangeError);
      throws(() => inst.subtract({ days: 1 }), RangeError);
    });
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
    it("doesn't cast first argument", () => {
      throws(() => Instant.compare(i1, i1.toString()), TypeError);
      throws(() => Instant.compare(i1, {}), TypeError);
    });
    it("doesn't cast second argument", () => {
      throws(() => Instant.compare(i2.getEpochNanoseconds(), i2), TypeError);
      throws(() => Instant.compare({}, i2), TypeError);
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
    it("doesn't cast argument", () => {
      throws(() => i1.equals(i1.getEpochNanoseconds()), TypeError);
      throws(() => i1.equals({}), TypeError);
    });
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
  describe('Instant.difference works', () => {
    const earlier = Instant.from('1976-11-18T15:23:30.123456789Z');
    const later = Instant.from('2019-10-29T10:46:38.271986102Z');
    const diff = later.difference(earlier);
    it(`(${earlier}).difference(${later}) == (${later}).difference(${earlier}).negated()`, () =>
      equal(`${earlier.difference(later)}`, `${diff.negated()}`));
    it(`(${earlier}).add(${diff}) == (${later})`, () => assert(earlier.add(diff).equals(later)));
    it(`(${later}).subtract(${diff}) == (${earlier})`, () => assert(later.subtract(diff).equals(earlier)));
    it("doesn't cast argument", () => {
      throws(() => earlier.difference(later.toString()), TypeError);
      throws(() => earlier.difference({}), TypeError);
    });
    const feb20 = Instant.from('2020-02-01T00:00Z');
    const feb21 = Instant.from('2021-02-01T00:00Z');
    it('defaults to returning seconds', () => {
      equal(`${feb21.difference(feb20)}`, 'PT31622400S');
      equal(`${feb21.difference(feb20, { largestUnit: 'auto' })}`, 'PT31622400S');
      equal(`${feb21.difference(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
      equal(`${Instant.from('2021-02-01T00:00:00.000000001Z').difference(feb20)}`, 'PT31622400.000000001S');
      equal(`${feb21.difference(Instant.from('2020-02-01T00:00:00.000000001Z'))}`, 'PT31622399.999999999S');
    });
    it('can return minutes and hours', () => {
      equal(`${feb21.difference(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb21.difference(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
    });
    it('can return subseconds', () => {
      const later = feb20.add({ hours: 24, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = later.difference(feb20, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = later.difference(feb20, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = later.difference(feb20, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('cannot return days, weeks, months, and years', () => {
      throws(() => feb21.difference(feb20, { largestUnit: 'days' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'weeks' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'months' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'years' }), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb21.difference(feb20, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb21.difference(feb20, options)}`, 'PT31622400S'));
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => later.difference(earlier, { smallestUnit }), RangeError);
        }
      );
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => later.difference(earlier, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
      equal(`${later.difference(earlier, { smallestUnit: 'hours' })}`, 'PT376435H');
      equal(`${later.difference(earlier, { smallestUnit: 'minutes' })}`, 'PT22586123M');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => later.difference(earlier, { roundingMode: 'cile' }), RangeError);
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
      const roundingMode = 'nearest';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.difference(earlier, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.difference(later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['hours', 'PT376436H', '-PT376435H'],
      ['minutes', 'PT376435H24M', '-PT376435H23M'],
      ['seconds', 'PT376435H23M9S', '-PT376435H23M8S'],
      ['milliseconds', 'PT376435H23M8.149S', '-PT376435H23M8.148S'],
      ['microseconds', 'PT376435H23M8.148530S', '-PT376435H23M8.148529S'],
      ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.difference(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.difference(later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['hours', 'PT376435H', '-PT376436H'],
      ['minutes', 'PT376435H23M', '-PT376435H24M'],
      ['seconds', 'PT376435H23M8S', '-PT376435H23M9S'],
      ['milliseconds', 'PT376435H23M8.148S', '-PT376435H23M8.149S'],
      ['microseconds', 'PT376435H23M8.148529S', '-PT376435H23M8.148530S'],
      ['nanoseconds', 'PT376435H23M8.148529313S', '-PT376435H23M8.148529313S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.difference(earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.difference(later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative);
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
        equal(`${later.difference(earlier, { largestUnit, smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.difference(later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('nearest is the default', () => {
      equal(`${later.difference(earlier, { largestUnit, smallestUnit: 'milliseconds' })}`, 'PT376435H23M8.149S');
      equal(`${later.difference(earlier, { largestUnit, smallestUnit: 'microseconds' })}`, 'PT376435H23M8.148529S');
    });
    it('rounds to an increment of hours', () => {
      equal(`${later.difference(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 3 })}`, 'PT376434H');
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 30 })}`,
        'PT376435H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 15 })}`,
        'PT376435H23M15S'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 10 })}`,
        'PT376435H23M8.150S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 10 })}`,
        'PT376435H23M8.148530S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 10 })}`,
        'PT376435H23M8.148529310S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { largestUnit, smallestUnit: 'hours', roundingIncrement };
        assert(later.difference(earlier, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(later.difference(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { largestUnit, smallestUnit, roundingIncrement };
          assert(later.difference(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 29 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 29 }),
        RangeError
      );
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'microseconds', roundingIncrement: 1000 }),
        RangeError
      );
      throws(
        () => later.difference(earlier, { largestUnit, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }),
        RangeError
      );
    });
    it('accepts singular units', () => {
      equal(
        `${later.difference(earlier, { largestUnit: 'hour' })}`,
        `${later.difference(earlier, { largestUnit: 'hours' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'hour' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'hours' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit: 'minute' })}`,
        `${later.difference(earlier, { largestUnit: 'minutes' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'minute' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'minutes' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit: 'second' })}`,
        `${later.difference(earlier, { largestUnit: 'seconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'second' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'seconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit: 'millisecond' })}`,
        `${later.difference(earlier, { largestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'millisecond' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit: 'microsecond' })}`,
        `${later.difference(earlier, { largestUnit: 'microseconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'microsecond' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'microseconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit: 'nanosecond' })}`,
        `${later.difference(earlier, { largestUnit: 'nanoseconds' })}`
      );
      equal(
        `${later.difference(earlier, { largestUnit, smallestUnit: 'nanosecond' })}`,
        `${later.difference(earlier, { largestUnit, smallestUnit: 'nanoseconds' })}`
      );
    });
  });
  describe('Instant.round works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => inst.round(), TypeError);
    });
    it('throws without required smallestUnit parameter', () => {
      throws(() => inst.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => inst.round({ smallestUnit }), RangeError);
        }
      );
    });
    it('throws on invalid roundingMode', () => {
      throws(() => inst.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['hour', '1976-11-18T14:00Z'],
      ['minute', '1976-11-18T14:24Z'],
      ['second', '1976-11-18T14:23:30Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z'],
      ['microsecond', '1976-11-18T14:23:30.123457Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        equal(`${inst.round({ smallestUnit, roundingMode: 'nearest' })}`, expected));
    });
    const incrementOneCeil = [
      ['hour', '1976-11-18T15:00Z'],
      ['minute', '1976-11-18T14:24Z'],
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
      ['hour', '1976-11-18T14:00Z'],
      ['minute', '1976-11-18T14:23Z'],
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
    it('nearest is the default', () => {
      equal(`${inst.round({ smallestUnit: 'minute' })}`, '1976-11-18T14:24Z');
      equal(`${inst.round({ smallestUnit: 'second' })}`, '1976-11-18T14:23:30Z');
    });
    it('rounding down is towards the Big Bang, not towards the epoch', () => {
      const inst2 = Instant.from('1969-12-15T12:00:00.5Z');
      const smallestUnit = 'second';
      equal(`${inst2.round({ smallestUnit, roundingMode: 'ceil' })}`, '1969-12-15T12:00:01Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'floor' })}`, '1969-12-15T12:00Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'trunc' })}`, '1969-12-15T12:00Z');
      equal(`${inst2.round({ smallestUnit, roundingMode: 'nearest' })}`, '1969-12-15T12:00:01Z');
    });
    it('rounds to an increment of hours', () => {
      equal(`${inst.round({ smallestUnit: 'hour', roundingIncrement: 4 })}`, '1976-11-18T16:00Z');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${inst.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`, '1976-11-18T14:30Z');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${inst.round({ smallestUnit: 'second', roundingIncrement: 30 })}`, '1976-11-18T14:23:30Z');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${inst.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.120Z');
    });
    it('rounds to an increment of microseconds', () => {
      equal(`${inst.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.123460Z');
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(`${inst.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.123456790Z');
    });
    it('rounds to days by specifying increment of 86400 seconds in various units', () => {
      const expected = '1976-11-19T00:00Z';
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
      assert(inst.round({ smallestUnit: 'hours' }).equals(inst.round({ smallestUnit: 'hour' })));
      assert(inst.round({ smallestUnit: 'minutes' }).equals(inst.round({ smallestUnit: 'minute' })));
      assert(inst.round({ smallestUnit: 'seconds' }).equals(inst.round({ smallestUnit: 'second' })));
      assert(inst.round({ smallestUnit: 'milliseconds' }).equals(inst.round({ smallestUnit: 'millisecond' })));
      assert(inst.round({ smallestUnit: 'microseconds' }).equals(inst.round({ smallestUnit: 'microsecond' })));
      assert(inst.round({ smallestUnit: 'nanoseconds' }).equals(inst.round({ smallestUnit: 'nanosecond' })));
    });
  });
  describe('Min/max range', () => {
    it('constructing from ns', () => {
      const limit = 8_640_000_000_000_000_000_000n;
      throws(() => new Instant(-limit - 1n), RangeError);
      throws(() => new Instant(limit + 1n), RangeError);
      equal(`${new Instant(-limit)}`, '-271821-04-20T00:00Z');
      equal(`${new Instant(limit)}`, '+275760-09-13T00:00Z');
    });
    it('constructing from ms', () => {
      const limit = 86400e11;
      throws(() => Instant.fromEpochMilliseconds(-limit - 1), RangeError);
      throws(() => Instant.fromEpochMilliseconds(limit + 1), RangeError);
      equal(`${Instant.fromEpochMilliseconds(-limit)}`, '-271821-04-20T00:00Z');
      equal(`${Instant.fromEpochMilliseconds(limit)}`, '+275760-09-13T00:00Z');
    });
    it('constructing from ISO string', () => {
      throws(() => Instant.from('-271821-04-19T23:59:59.999999999Z'), RangeError);
      throws(() => Instant.from('+275760-09-13T00:00:00.000000001Z'), RangeError);
      equal(`${Instant.from('-271821-04-20T00:00Z')}`, '-271821-04-20T00:00Z');
      equal(`${Instant.from('+275760-09-13T00:00Z')}`, '+275760-09-13T00:00Z');
    });
    it('converting from DateTime', () => {
      const min = Temporal.DateTime.from('-271821-04-19T00:00:00.000000001');
      const max = Temporal.DateTime.from('+275760-09-13T23:59:59.999999999');
      throws(() => min.toInstant('UTC'), RangeError);
      throws(() => max.toInstant('UTC'), RangeError);
      const utc = Temporal.TimeZone.from('UTC');
      throws(() => utc.getInstantFor(min), RangeError);
      throws(() => utc.getInstantFor(max), RangeError);
    });
    it('adding and subtracting beyond limit', () => {
      const min = Instant.from('-271821-04-20T00:00Z');
      const max = Instant.from('+275760-09-13T00:00Z');
      throws(() => min.subtract({ nanoseconds: 1 }), RangeError);
      throws(() => max.add({ nanoseconds: 1 }), RangeError);
    });
  });
  describe('Instant.toDateTimeISO works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => inst.toDateTimeISO(), RangeError);
    });
    it('time zone parameter UTC', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const dt = inst.toDateTimeISO(tz);
      equal(inst.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T14:23:30.123456789');
    });
    it('time zone parameter non-UTC', () => {
      const tz = Temporal.TimeZone.from('America/New_York');
      const dt = inst.toDateTimeISO(tz);
      equal(inst.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T09:23:30.123456789');
    });
  });
  describe('Instant.toDateTime works', () => {
    const inst = Instant.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => inst.toDateTime(), RangeError);
    });
    it('throws with only one parameter', () => {
      throws(() => inst.toDateTime('Asia/Singapore'));
    });
    it('time zone parameter UTC', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const dt = inst.toDateTime(tz, 'gregory');
      equal(inst.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T14:23:30.123456789[c=gregory]');
    });
    it('time zone parameter non-UTC', () => {
      const tz = Temporal.TimeZone.from('America/New_York');
      const dt = inst.toDateTime(tz, 'gregory');
      equal(inst.getEpochNanoseconds(), dt.toInstant(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T09:23:30.123456789[c=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
