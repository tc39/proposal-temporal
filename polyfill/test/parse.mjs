#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2020 Igalia S.L. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, strictEqual: equal, deepStrictEqual: dEqual, throws } = Assert;

import * as Temporal from 'tc39-temporal';

const sample = '2019-10-29T10:46:38.271986102Z+01:00';

describe('Temporal.parse', () => {
  describe('Structure', () => {
    it('is a function', () => equal(typeof Temporal.parse, 'function'));
    it('returns an object', () => equal(typeof Temporal.parse(sample), 'object'));
    it('returns an object with 2 properties', () => equal(Object.keys(Temporal.parse(sample)).length, 2));
    it('has a TimeZone property', () =>
      assert(Object.prototype.hasOwnProperty.call(Temporal.parse(sample), 'TimeZone')));
    it('has a DateTime property', () =>
      assert(Object.prototype.hasOwnProperty.call(Temporal.parse(sample), 'DateTime')));
  });
  describe('Behavior', () => {
    it('should throw a TypeError on non-string arguments', () => throws(() => Temporal.parse(42), TypeError));
    it('should throw a RangeError on invalid string arguments', () => throws(() => Temporal.parse('not a valid string'), RangeError));
    it('should work', () => {
      const result = Temporal.parse(sample);
      dEqual(result.DateTime, Temporal.DateTime.from('2019-10-29T10:46:38.271986102'));
      dEqual(result.TimeZone, new Temporal.TimeZone('+01:00'));
    });
    it('should roundtrip', () => {
      const result = Temporal.parse(sample);
      equal(sample, `${result.DateTime.toString()}Z${result.TimeZone.toString()}`);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
