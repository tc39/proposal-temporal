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
const { ok: assert, equal } = Assert;

import * as Temporal from 'tc39-temporal';

describe('Exports', () => {
  const named = Object.keys(Temporal);
  it(`should be 13 things`, () => {
    equal(named.length, 13);
  });
  it('should contain `Absolute`', () => {
    assert(named.includes('Absolute'));
  });
  it('should contain `TimeZone`', () => {
    assert(named.includes('TimeZone'));
  });
  it('should contain `Date`', () => {
    assert(named.includes('Date'));
  });
  it('should contain `Time`', () => {
    assert(named.includes('Time'));
  });
  it('should contain `DateTime`', () => {
    assert(named.includes('DateTime'));
  });
  it('should contain `YearMonth`', () => {
    assert(named.includes('YearMonth'));
  });
  it('should contain `MonthDay`', () => {
    assert(named.includes('MonthDay'));
  });
  it('should contain `Duration`', () => {
    assert(named.includes('Duration'));
  });
  it('should contain `getAbsolute`', () => {
    assert(named.includes('getAbsolute'));
  });
  it('should contain `getDateTime`', () => {
    assert(named.includes('getDateTime'));
  });
  it('should contain `getTimeZone`', () => {
    assert(named.includes('getTimeZone'));
  });
  it('should contain `getTime`', () => {
    assert(named.includes('getTime'));
  });
  it('should contain `getDate`', () => {
    assert(named.includes('getDate'));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
