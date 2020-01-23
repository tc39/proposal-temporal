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
const { Absolute } = Temporal;

describe('Absolute', () => {
  describe('Structure', () => {
    it('Absolute is a Function', () => {
      equal(typeof Absolute, 'function');
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
    it('throws on number', () => throws(() => new Absolute(1234)));
    it('throws on string', () => throws(() => new Absolute('1234')));
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
      equal(
        Absolute.from('1976-11-18T15:23:30.123Z').getEpochMilliseconds(),
        Date.UTC(1976, 10, 18, 15, 23, 30, 123)
      );
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
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6));
    });
    it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
      equal(
        Absolute.from('2020-02-12T11:42-08:00[America/Vancouver]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 19, 42)) * BigInt(1e6));
    });
    it('2020-02-12T11:42+01:00', () => {
      equal(
        Absolute.from('2020-02-12T11:42+01:00').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6));
    });
    it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
      equal(
        Absolute.from('2020-02-12T11:42+01:00[Europe/Amsterdam]').getEpochNanoseconds(),
        BigInt(Date.UTC(2020, 1, 12, 10, 42)) * BigInt(1e6));
    });
    it('Absolute.from(1) throws', () => throws(() => Absolute.from(1), RangeError));
    it('Absolute.from(-1) throws', () => throws(() => Absolute.from(-1), RangeError));
    it('Absolute.from(1n) throws', () => throws(() => Absolute.from(1n), RangeError));
    it('Absolute.from(-1n) throws', () => throws(() => Absolute.from(-1n), RangeError));
    it('Absolute.from({}) throws', () => throws(() => Absolute.from({}), RangeError));
    it('Absolute.from(ISO string leap second) is constrained', () => {
      equal(`${Absolute.from('2016-12-31T23:59:60Z')}`, '2016-12-31T23:59:59Z');
    });
  });
  describe('Absolute.plus works', ()=>{
    const abs = Absolute.from('1969-12-25T12:23:45.678901234Z');
    describe('cross epoch in ms', ()=>{
      const one = abs.minus({ days: 10, nanoseconds: 800 });
      const two = abs.plus({ days: 10, nanoseconds: 800 });
      const three = two.minus({ days: 20, nanoseconds: 1600 });
      const four = one.plus({ days: 20, nanoseconds: 1600 });
      it(`(${abs}).minus({ days: 10, nanoseconds: 800 }) = ${one}`, () => equal(`${one}`, '1969-12-15T12:23:45.678900434Z'));
      it(`(${abs}).plus({ days: 10, nanoseconds: 800 }) = ${two}`, () => equal(`${two}`, '1970-01-04T12:23:45.678902034Z'));
      it(`(${two}).minus({ days: 20, nanoseconds: 1600 }) = ${one}`, () => equal(`${three}`, `${one}`));
      it(`(${one}).plus( days: 20, nanoseconds: 1600 }) = ${two}`, () => equal(`${four}`, `${two}`));
    });
    it('abs.plus(durationObj)', () => {
      const later = abs.plus(Temporal.Duration.from('P10DT0.000000800S'));
      equal(`${later}`, '1970-01-04T12:23:45.678902034Z');
    });
  });
  describe('Absolute.minus works', () => {
    const abs = Absolute.from('1969-12-25T12:23:45.678901234Z');
    it('abs.minus(durationObj)', () => {
      const earlier = abs.minus(Temporal.Duration.from('P10DT0.000000800S'));
      equal(`${earlier}`, '1969-12-15T12:23:45.678900434Z');
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
  describe('Absolute.difference works', () => {
    const earlier = Absolute.from('1976-11-18T15:23:30.123456789Z');
    const later = Absolute.from('2019-10-29T10:46:38.271986102Z');
    const diff = earlier.difference(later);
    it(`(${earlier}).difference(${later}) == (${later}).difference(${earlier})`, () =>
      equal(`${later.difference(earlier)}`, `${diff}`));
    it(`(${earlier}).plus(${diff}) == (${later})`, () => equal(`${earlier.plus(diff)}`, `${later}`));
    it(`(${later}).minus(${diff}) == (${earlier})`, () => equal(`${later.minus(diff)}`, `${earlier}`));
    it("doesn't cast argument", () => {
      throws(() => earlier.difference(later.toString()), TypeError);
      throws(() => earlier.difference({}), TypeError);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
