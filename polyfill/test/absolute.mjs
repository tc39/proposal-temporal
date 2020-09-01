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
const { Absolute } = Temporal;

describe('Absolute', () => {
  describe('Structure', () => {
    it('Absolute is a Function', () => {
      equal(typeof Absolute, 'function');
    });
    it('Absolute has a prototype', () => {
      assert(Absolute.prototype);
      equal(typeof Absolute.prototype, 'object');
    });
    describe('Absolute.prototype', () => {
      it('Absolute.prototype.equals is a Function', () => {
        equal(typeof Absolute.prototype.equals, 'function');
      });
      it('Absolute.prototype.round is a Function', () => {
        equal(typeof Absolute.prototype.round, 'function');
      });
    });
    it('Absolute.fromEpochSeconds is a Function', () => {
      equal(typeof Absolute.fromEpochSeconds, 'function');
    });
    it('Absolute.fromEpochMicroseconds is a Function', () => {
      equal(typeof Absolute.fromEpochMicroseconds, 'function');
    });
    it('Absolute.fromEpochMilliseconds is a Function', () => {
      equal(typeof Absolute.fromEpochMilliseconds, 'function');
    });
    it('Absolute.fromEpochNanoseconds is a Function', () => {
      equal(typeof Absolute.fromEpochNanoseconds, 'function');
    });
    it('Absolute.from is a Function', () => {
      equal(typeof Absolute.from, 'function');
    });
    it('Absolute.compare is a Function', () => {
      equal(typeof Absolute.compare, 'function');
    });
  });
  describe('Construction', () => {
    it('can construct', () => {
      const epochMillis = Date.UTC(1976, 10, 18, 14, 23, 30, 123);
      const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
      const instant = new Absolute(epochNanos);
      assert(instant);
      equal(typeof instant, 'object');
      equal(instant.getEpochSeconds(), Math.floor(Date.UTC(1976, 10, 18, 14, 23, 30, 123) / 1e3), 'getEpochSeconds');
      equal(instant.getEpochMilliseconds(), Date.UTC(1976, 10, 18, 14, 23, 30, 123), 'getEpochMilliseconds');
    });
    it('constructs from string', () => equal(`${new Absolute('0')}`, '1970-01-01T00:00Z'));
    it('throws on number', () => throws(() => new Absolute(1234), TypeError));
    it('throws on string that does not convert to BigInt', () => throws(() => new Absolute('abc123'), SyntaxError));
  });
  describe('absolute.toString() works', () => {
    it('`1976-11-18T14:23:30.123456789Z`.toString()', () => {
      const iso = '1976-11-18T14:23:30.123456789Z';
      const instant = Absolute.from(iso);
      assert(instant);
      equal(`${instant}`, iso);
    });
    it('`1963-02-13T09:36:29.123456789Z`.toString()', () => {
      const iso = '1963-02-13T09:36:29.123456789Z';
      const instant = Absolute.from(iso);
      assert(instant);
      equal(`${instant}`, iso);
    });
    it('optional time zone parameter UTC', () => {
      const iso = '1976-11-18T14:23:30.123456789Z';
      const abs = Absolute.from(iso);
      const tz = Temporal.TimeZone.from('UTC');
      equal(abs.toString(tz), iso);
    });
    it('optional time zone parameter non-UTC', () => {
      const abs = Absolute.from('1976-11-18T14:23:30.123456789Z');
      const tz = Temporal.TimeZone.from('America/New_York');
      equal(abs.toString(tz), '1976-11-18T09:23:30.123456789-05:00[America/New_York]');
    });
  });
  describe('Absolute.toJSON() works', () => {
    it('`1976-11-18T15:23:30.123456789+01:00`.toJSON()', () => {
      const abs = Absolute.from('1976-11-18T15:23:30.123456789+01:00');
      assert(abs);
      equal(abs.toJSON(), '1976-11-18T14:23:30.123456789Z');
    });
    it('`1963-02-13T10:36:29.123456789+01:00`.toJSON()', () => {
      const abs = Absolute.from('1963-02-13T10:36:29.123456789+01:00');
      assert(abs);
      equal(abs.toJSON(), '1963-02-13T09:36:29.123456789Z');
    });
    it('argument is ignored', () => {
      const abs = Absolute.from('1976-11-18T15:23:30.123456789+01:00');
      equal(abs.toJSON('+01:00'), abs.toJSON());
    });
  });
  describe('Absolute.getEpochSeconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochSeconds(), Math.trunc(epochMs / 1e3));
      equal(typeof abs.getEpochSeconds(), 'number');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochSeconds(), Math.trunc(epochMs / 1e3));
      equal(typeof abs.getEpochSeconds(), 'number');
    });
  });
  describe('Absolute.fromEpochSeconds() works', () => {
    it('1976-11-18T15:23:30', () => {
      const epochSeconds = Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3);
      const instant = Absolute.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
    it('1963-02-13T09:36:29', () => {
      const epochSeconds = Math.floor(Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1e3);
      const instant = Absolute.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
  });
  describe('Absolute.getEpochMilliseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochMilliseconds(), epochMs);
      equal(typeof abs.getEpochMilliseconds(), 'number');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochMilliseconds(), epochMs);
      equal(typeof abs.getEpochMilliseconds(), 'number');
    });
  });
  describe('Absolute.fromEpochMilliseconds() works', () => {
    it('1976-11-18T15:23:30.123', () => {
      const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const instant = Absolute.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
    it('1963-02-13T09:36:29.123', () => {
      const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const instant = Absolute.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
  });
  describe('Absolute.getEpochMicroseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
      equal(typeof abs.getEpochMicroseconds(), 'bigint');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochMicroseconds(), BigInt(epochMs) * BigInt(1e3));
      equal(typeof abs.getEpochMicroseconds(), 'bigint');
    });
  });
  describe('Absolute.fromEpochMicroseconds() works', () => {
    it('1976-11-18T15:23:30.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Absolute.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
    it('1963-02-13T09:36:29.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Absolute.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
  });
  describe('Absolute.getEpochNanoseconds() works', () => {
    it('post-epoch', () => {
      const epochMs = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochNanoseconds(), epochNs);
      equal(typeof abs.getEpochNanoseconds(), 'bigint');
    });
    it('pre-epoch', () => {
      const epochMs = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const epochNs = BigInt(epochMs) * BigInt(1e6);
      const abs = new Absolute(epochNs);
      equal(abs.getEpochNanoseconds(), epochNs);
      equal(typeof abs.getEpochNanoseconds(), 'bigint');
    });
  });
  describe('Absolute.fromEpochNanoseconds() works', () => {
    it('1976-11-18T15:23:30.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Absolute.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('1963-02-13T09:36:29.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Absolute.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('-1n', () => {
      const instant = Absolute.fromEpochNanoseconds(-1n);
      equal(`${instant}`, '1969-12-31T23:59:59.999999999Z');
    });
  });
  describe('Absolute.from() works', () => {
    it('1976-11-18T15:23Z', () => {
      equal(Absolute.from('1976-11-18T15:23Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23));
    });
    it('1976-11-18T15:23:30Z', () => {
      equal(Absolute.from('1976-11-18T15:23:30Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30));
    });
    it('1976-11-18T15:23:30.123Z', () => {
      equal(Absolute.from('1976-11-18T15:23:30.123Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30, 123));
    });
    it('1976-11-18T15:23:30.123456Z', () => {
      equal(
        Absolute.from('1976-11-18T15:23:30.123456Z').getEpochMicroseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
      );
    });
    it('1976-11-18T15:23:30.123456789Z', () => {
      equal(
        Absolute.from('1976-11-18T15:23:30.123456789Z').getEpochNanoseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
      );
    });
    it('2020-02-12T11:42-08:00', () => {
      equal(
        Absolute.from('2020-02-12T11:42-08:00').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
      equal(
        Absolute.from('2020-02-12T11:42-08:00[America/Vancouver]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00', () => {
      equal(
        Absolute.from('2020-02-12T11:42+01:00').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
      equal(
        Absolute.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
      equal(
        Absolute.from('2019-02-16T23:45-02:00[America/Sao_Paulo]').getEpochNanoseconds(),
        BigInt(Date.UTC(2019, 1, 17, 1, 45)) * BigInt(1e6)
      );
    });
    it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
      equal(
        Absolute.from('2019-02-16T23:45-03:00[America/Sao_Paulo]').getEpochNanoseconds(),
        BigInt(Date.UTC(2019, 1, 17, 2, 45)) * BigInt(1e6)
      );
    });
    it('throws when unable to disambiguate using offset', () => {
      throws(() => Absolute.from('2019-02-16T23:45-04:00[America/Sao_Paulo]'), RangeError);
    });
    it('Absolute.from(string-convertible) converts to string', () => {
      const obj = {
        toString() {
          return '2020-02-12T11:42+01:00[Europe/Amsterdam]';
        }
      };
      equal(`${Absolute.from(obj)}`, '2020-02-12T10:42Z');
    });
    it('Absolute.from(1) throws', () => throws(() => Absolute.from(1), RangeError));
    it('Absolute.from(-1) throws', () => throws(() => Absolute.from(-1), RangeError));
    it('Absolute.from(1n) throws', () => throws(() => Absolute.from(1n), RangeError));
    it('Absolute.from(-1n) throws', () => throws(() => Absolute.from(-1n), RangeError));
    it('Absolute.from({}) throws', () => throws(() => Absolute.from({}), RangeError));
    it('Absolute.from(absolute) is not the same object', () => {
      const abs = Absolute.from('2020-02-12T11:42+01:00[Europe/Amsterdam]');
      notEqual(Absolute.from(abs), abs);
    });
    it('Absolute.from(ISO string leap second) is constrained', () => {
      equal(`${Absolute.from('2016-12-31T23:59:60Z')}`, '2016-12-31T23:59:59Z');
    });
    it('variant time separators', () => {
      equal(`${Absolute.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23Z');
      equal(`${Absolute.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23Z');
    });
    it('variant UTC designator', () => {
      equal(`${Absolute.from('1976-11-18T15:23z')}`, '1976-11-18T15:23Z');
    });
    it('any number of decimal places', () => {
      equal(`${Absolute.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.123400Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.123450Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.123456700Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.123456780Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('variant decimal separator', () => {
      equal(`${Absolute.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120Z');
    });
    it('variant minus sign', () => {
      equal(`${Absolute.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T17:23:30.120Z');
      equal(`${Absolute.from('\u2212009999-11-18T15:23:30.12Z')}`, '-009999-11-18T15:23:30.120Z');
    });
    it('mixture of basic and extended format', () => {
      equal(`${Absolute.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z');
      equal(`${Absolute.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100Z');
    });
    it('optional parts', () => {
      equal(`${Absolute.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30Z');
      equal(`${Absolute.from('1976-11-18T15Z')}`, '1976-11-18T15:00Z');
    });
    it('ignores any specified calendar', () =>
      equal(`${Absolute.from('1976-11-18T15:23:30.123456789Z[c=discordian]')}`, '1976-11-18T15:23:30.123456789Z'));
    it('no junk at end of string', () => throws(() => Absolute.from('1976-11-18T15:23:30.123456789Zjunk'), RangeError));
  });
  describe('Absolute.plus works', () => {
    const abs = Absolute.from('1969-12-25T12:23:45.678901234Z');
    describe('cross epoch in ms', () => {
      const one = abs.minus({ hours: 240, nanoseconds: 800 });
      const two = abs.plus({ hours: 240, nanoseconds: 800 });
      const three = two.minus({ hours: 480, nanoseconds: 1600 });
      const four = one.plus({ hours: 480, nanoseconds: 1600 });
      it(`(${abs}).minus({ hours: 240, nanoseconds: 800 }) = ${one}`, () =>
        equal(`${one}`, '1969-12-15T12:23:45.678900434Z'));
      it(`(${abs}).plus({ hours: 240, nanoseconds: 800 }) = ${two}`, () =>
        equal(`${two}`, '1970-01-04T12:23:45.678902034Z'));
      it(`(${two}).minus({ hours: 480, nanoseconds: 1600 }) = ${one}`, () => assert(three.equals(one)));
      it(`(${one}).plus({ hours: 480, nanoseconds: 1600 }) = ${two}`, () => assert(four.equals(two)));
    });
    it('abs.plus(durationObj)', () => {
      const later = abs.plus(Temporal.Duration.from('PT240H0.000000800S'));
      equal(`${later}`, '1970-01-04T12:23:45.678902034Z');
    });
    it('invalid to add years, months, weeks, or days', () => {
      throws(() => abs.plus({ years: 1 }), RangeError);
      throws(() => abs.plus({ months: 1 }), RangeError);
      throws(() => abs.plus({ weeks: 1 }), RangeError);
      throws(() => abs.plus({ days: 1 }), RangeError);
    });
    it('mixed positive and negative values always throw', () => {
      throws(() => abs.plus({ hours: 1, minutes: -30 }), RangeError);
    });
  });
  describe('Absolute.minus works', () => {
    const abs = Absolute.from('1969-12-25T12:23:45.678901234Z');
    it('abs.minus(durationObj)', () => {
      const earlier = abs.minus(Temporal.Duration.from('PT240H0.000000800S'));
      equal(`${earlier}`, '1969-12-15T12:23:45.678900434Z');
    });
    it('invalid to subtract years, months, weeks, or days', () => {
      throws(() => abs.minus({ years: 1 }), RangeError);
      throws(() => abs.minus({ months: 1 }), RangeError);
      throws(() => abs.minus({ weeks: 1 }), RangeError);
      throws(() => abs.minus({ days: 1 }), RangeError);
    });
    it('mixed positive and negative values always throw', () => {
      throws(() => abs.minus({ hours: 1, minutes: -30 }), RangeError);
    });
  });
  describe('Absolute.compare works', () => {
    const abs1 = Absolute.from('1963-02-13T09:36:29.123456789Z');
    const abs2 = Absolute.from('1976-11-18T15:23:30.123456789Z');
    const abs3 = Absolute.from('1981-12-15T14:34:31.987654321Z');
    it('pre epoch equal', () => equal(Absolute.compare(abs1, Absolute.from(abs1)), 0));
    it('epoch equal', () => equal(Absolute.compare(abs2, Absolute.from(abs2)), 0));
    it('cross epoch smaller/larger', () => equal(Absolute.compare(abs1, abs2), -1));
    it('cross epoch larger/smaller', () => equal(Absolute.compare(abs2, abs1), 1));
    it('epoch smaller/larger', () => equal(Absolute.compare(abs2, abs3), -1));
    it('epoch larger/smaller', () => equal(Absolute.compare(abs3, abs2), 1));
    it("doesn't cast first argument", () => {
      throws(() => Absolute.compare(abs1, abs1.toString()), TypeError);
      throws(() => Absolute.compare(abs1, {}), TypeError);
    });
    it("doesn't cast second argument", () => {
      throws(() => Absolute.compare(abs2.getEpochNanoseconds(), abs2), TypeError);
      throws(() => Absolute.compare({}, abs2), TypeError);
    });
  });
  describe('Absolute.equals works', () => {
    const abs1 = Absolute.from('1963-02-13T09:36:29.123456789Z');
    const abs2 = Absolute.from('1976-11-18T15:23:30.123456789Z');
    const abs3 = Absolute.from('1981-12-15T14:34:31.987654321Z');
    it('pre epoch equal', () => assert(abs1.equals(abs1)));
    it('epoch equal', () => assert(abs2.equals(abs2)));
    it('cross epoch unequal', () => assert(!abs1.equals(abs2)));
    it('epoch unequal', () => assert(!abs2.equals(abs3)));
    it("doesn't cast argument", () => {
      throws(() => abs1.equals(abs1.getEpochNanoseconds()), TypeError);
      throws(() => abs1.equals({}), TypeError);
    });
  });
  describe("Comparison operators don't work", () => {
    const abs1 = Absolute.from('1963-02-13T09:36:29.123456789Z');
    const abs1again = Absolute.from('1963-02-13T09:36:29.123456789Z');
    const abs2 = Absolute.from('1976-11-18T15:23:30.123456789Z');
    it('=== is object equality', () => equal(abs1, abs1));
    it('!== is object equality', () => notEqual(abs1, abs1again));
    it('<', () => throws(() => abs1 < abs2));
    it('>', () => throws(() => abs1 > abs2));
    it('<=', () => throws(() => abs1 <= abs2));
    it('>=', () => throws(() => abs1 >= abs2));
  });
  describe('Absolute.difference works', () => {
    const earlier = Absolute.from('1976-11-18T15:23:30.123456789Z');
    const later = Absolute.from('2019-10-29T10:46:38.271986102Z');
    const diff = later.difference(earlier);
    it(`(${earlier}).difference(${later}) == (${later}).difference(${earlier}).negated()`, () =>
      equal(`${earlier.difference(later)}`, `${diff.negated()}`));
    it(`(${earlier}).plus(${diff}) == (${later})`, () => assert(earlier.plus(diff).equals(later)));
    it(`(${later}).minus(${diff}) == (${earlier})`, () => assert(later.minus(diff).equals(earlier)));
    it("doesn't cast argument", () => {
      throws(() => earlier.difference(later.toString()), TypeError);
      throws(() => earlier.difference({}), TypeError);
    });
    const feb20 = Absolute.from('2020-02-01T00:00Z');
    const feb21 = Absolute.from('2021-02-01T00:00Z');
    it('defaults to returning seconds', () => {
      equal(`${feb21.difference(feb20)}`, 'PT31622400S');
      equal(`${feb21.difference(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
      equal(`${Absolute.from('2021-02-01T00:00:00.000000001Z').difference(feb20)}`, 'PT31622400.000000001S');
      equal(`${feb21.difference(Absolute.from('2020-02-01T00:00:00.000000001Z'))}`, 'PT31622399.999999999S');
    });
    it('can return minutes and hours', () => {
      equal(`${feb21.difference(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb21.difference(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
    });
    it('can return subseconds', () => {
      const later = feb20.plus({ hours: 24, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

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
  });
  describe('Absolute.round works', () => {
    const abs = Absolute.from('1976-11-18T14:23:30.123456789Z');
    it('throws without parameter', () => {
      throws(() => abs.round(), TypeError);
    });
    it('throws without required smallestUnit parameter', () => {
      throws(() => abs.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'year', 'month', 'week', 'day', 'hour', 'years', 'months', 'weeks', 'days', 'hours', 'nonsense'].forEach(
        (smallestUnit) => {
          throws(() => abs.round({ smallestUnit }), RangeError);
        }
      );
    });
    it('throws on invalid roundingMode', () => {
      throws(() => abs.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['minute', '1976-11-18T14:24Z'],
      ['second', '1976-11-18T14:23:30Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z'],
      ['microsecond', '1976-11-18T14:23:30.123457Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        equal(`${abs.round({ smallestUnit, roundingMode: 'nearest' })}`, expected));
    });
    const incrementOneCeil = [
      ['minute', '1976-11-18T14:24Z'],
      ['second', '1976-11-18T14:23:31Z'],
      ['millisecond', '1976-11-18T14:23:30.124Z'],
      ['microsecond', '1976-11-18T14:23:30.123457Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () => equal(`${abs.round({ smallestUnit, roundingMode: 'ceil' })}`, expected));
    });
    const incrementOneFloor = [
      ['minute', '1976-11-18T14:23Z'],
      ['second', '1976-11-18T14:23:30Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z'],
      ['microsecond', '1976-11-18T14:23:30.123456Z'],
      ['nanosecond', '1976-11-18T14:23:30.123456789Z']
    ];
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        equal(`${abs.round({ smallestUnit, roundingMode: 'floor' })}`, expected));
      it(`truncates to ${smallestUnit}`, () =>
        equal(`${abs.round({ smallestUnit, roundingMode: 'trunc' })}`, expected));
    });
    it('nearest is the default', () => {
      equal(`${abs.round({ smallestUnit: 'minute' })}`, '1976-11-18T14:24Z');
      equal(`${abs.round({ smallestUnit: 'second' })}`, '1976-11-18T14:23:30Z');
    });
    it('rounding down is towards the Big Bang, not towards the epoch', () => {
      const abs2 = Absolute.from('1969-12-15T12:00:00.5Z');
      const smallestUnit = 'second';
      equal(`${abs2.round({ smallestUnit, roundingMode: 'ceil' })}`, '1969-12-15T12:00:01Z');
      equal(`${abs2.round({ smallestUnit, roundingMode: 'floor' })}`, '1969-12-15T12:00Z');
      equal(`${abs2.round({ smallestUnit, roundingMode: 'trunc' })}`, '1969-12-15T12:00Z');
      equal(`${abs2.round({ smallestUnit, roundingMode: 'nearest' })}`, '1969-12-15T12:00:01Z');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${abs.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`, '1976-11-18T14:30Z');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${abs.round({ smallestUnit: 'second', roundingIncrement: 30 })}`, '1976-11-18T14:23:30Z');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${abs.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.120Z');
    });
    it('rounds to an increment of microseconds', () => {
      equal(`${abs.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.123460Z');
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(`${abs.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.123456790Z');
    });
    it('rounds to days by specifying increment of 86400 seconds in various units', () => {
      const expected = '1976-11-19T00:00Z';
      equal(`${abs.round({ smallestUnit: 'minute', roundingIncrement: 1440 })}`, expected);
      equal(`${abs.round({ smallestUnit: 'second', roundingIncrement: 86400 })}`, expected);
      equal(`${abs.round({ smallestUnit: 'millisecond', roundingIncrement: 86400e3 })}`, expected);
      equal(`${abs.round({ smallestUnit: 'microsecond', roundingIncrement: 86400e6 })}`, expected);
      equal(`${abs.round({ smallestUnit: 'nanosecond', roundingIncrement: 86400e9 })}`, expected);
    });
    it('allows increments that divide evenly into solar days', () => {
      assert(abs.round({ smallestUnit: 'second', roundingIncrement: 864 }) instanceof Absolute);
    });
    it('throws on increments that do not divide evenly into solar days', () => {
      throws(() => abs.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError);
      throws(() => abs.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError);
      throws(() => abs.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError);
      throws(() => abs.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError);
      throws(() => abs.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError);
    });
    it('accepts plural units', () => {
      assert(abs.round({ smallestUnit: 'minutes' }).equals(abs.round({ smallestUnit: 'minute' })));
      assert(abs.round({ smallestUnit: 'seconds' }).equals(abs.round({ smallestUnit: 'second' })));
      assert(abs.round({ smallestUnit: 'milliseconds' }).equals(abs.round({ smallestUnit: 'millisecond' })));
      assert(abs.round({ smallestUnit: 'microseconds' }).equals(abs.round({ smallestUnit: 'microsecond' })));
      assert(abs.round({ smallestUnit: 'nanoseconds' }).equals(abs.round({ smallestUnit: 'nanosecond' })));
    });
  });
  describe('Min/max range', () => {
    it('constructing from ns', () => {
      const limit = 8_640_000_000_000_000_000_000n;
      throws(() => new Absolute(-limit - 1n), RangeError);
      throws(() => new Absolute(limit + 1n), RangeError);
      equal(`${new Absolute(-limit)}`, '-271821-04-20T00:00Z');
      equal(`${new Absolute(limit)}`, '+275760-09-13T00:00Z');
    });
    it('constructing from ms', () => {
      const limit = 86400e11;
      throws(() => Absolute.fromEpochMilliseconds(-limit - 1), RangeError);
      throws(() => Absolute.fromEpochMilliseconds(limit + 1), RangeError);
      equal(`${Absolute.fromEpochMilliseconds(-limit)}`, '-271821-04-20T00:00Z');
      equal(`${Absolute.fromEpochMilliseconds(limit)}`, '+275760-09-13T00:00Z');
    });
    it('constructing from ISO string', () => {
      throws(() => Absolute.from('-271821-04-19T23:59:59.999999999Z'), RangeError);
      throws(() => Absolute.from('+275760-09-13T00:00:00.000000001Z'), RangeError);
      equal(`${Absolute.from('-271821-04-20T00:00Z')}`, '-271821-04-20T00:00Z');
      equal(`${Absolute.from('+275760-09-13T00:00Z')}`, '+275760-09-13T00:00Z');
    });
    it('converting from DateTime', () => {
      const min = Temporal.DateTime.from('-271821-04-19T00:00:00.000000001');
      const max = Temporal.DateTime.from('+275760-09-13T23:59:59.999999999');
      throws(() => min.toAbsolute('UTC'), RangeError);
      throws(() => max.toAbsolute('UTC'), RangeError);
      const utc = Temporal.TimeZone.from('UTC');
      throws(() => utc.getAbsoluteFor(min), RangeError);
      throws(() => utc.getAbsoluteFor(max), RangeError);
    });
    it('adding and subtracting beyond limit', () => {
      const min = Absolute.from('-271821-04-20T00:00Z');
      const max = Absolute.from('+275760-09-13T00:00Z');
      throws(() => min.minus({ nanoseconds: 1 }), RangeError);
      throws(() => max.plus({ nanoseconds: 1 }), RangeError);
    });
  });
  describe('Absolute.toDateTime works', () => {
    const iso = '1976-11-18T14:23:30.123456789Z';
    const abs = Absolute.from(iso);
    it('without parameter', () => {
      throws(() => abs.toDateTime(), RangeError);
    });
    it('time zone parameter UTC', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const dt = abs.toDateTime(tz);
      equal(abs.getEpochNanoseconds(), dt.toAbsolute(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T14:23:30.123456789');
    });
    it('time zone parameter non-UTC', () => {
      const tz = Temporal.TimeZone.from('America/New_York');
      const dt = abs.toDateTime(tz);
      equal(abs.getEpochNanoseconds(), dt.toAbsolute(tz).getEpochNanoseconds());
      equal(`${dt}`, '1976-11-18T09:23:30.123456789');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
