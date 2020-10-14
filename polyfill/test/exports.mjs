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
const { equal } = assert;

import * as Temporal from 'proposal-temporal';

describe('Exports', () => {
  const named = Object.keys(Temporal);
  it('should be 10 things', () => {
    equal(named.length, 10);
  });
  it('should contain `Instant`', () => {
    assert(named.includes('Instant'));
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
  it('should contain `Calendar`', () => {
    assert(named.includes('Calendar'));
  });
  it('should contain `now`', () => {
    assert(named.includes('now'));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
