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

import { Absolute } from 'tc39-temporal';

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
    it('Absolute.from(-1n)', () => {
      equal(`${ Absolute.from(-1n) }`, '1969-12-31T23:59:59.999999999Z');
    });
    it('Absolute.from({}) throws', () => throws(() => Absolute.from({}), RangeError));
  });
  describe('Absolute.plus works', ()=>{
    describe('cross epoch in ms', ()=>{
      const abs = Absolute.from('1969-12-25T12:23:45.678901234Z');
      const one = abs.minus({ days: 10, nanoseconds: 800 });
      const two = abs.plus({ days: 10, nanoseconds: 800 });
      const three = two.minus({ days: 20, nanoseconds: 1600 });
      const four = one.plus({ days: 20, nanoseconds: 1600 });
      it(`(${abs}).minus({ days: 10, nanoseconds: 800 }) = ${one}`, () => equal(`${one}`, '1969-12-15T12:23:45.678900434Z'));
      it(`(${abs}).plus({ days: 10, nanoseconds: 800 }) = ${two}`, () => equal(`${two}`, '1970-01-04T12:23:45.678902034Z'));
      it(`(${two}).minus({ days: 20, nanoseconds: 1600 }) = ${one}`, () => equal(`${three}`, `${one}`));
      it(`(${one}).plus( days: 20, nanoseconds: 1600 }) = ${two}`, () => equal(`${four}`, `${two}`));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
