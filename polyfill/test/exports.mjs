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
  it('should be 11 things', () => {
    equal(named.length, 11);
  });
  it('should contain `Instant`', () => {
    assert(named.includes('Instant'));
  });
  it('should contain `TimeZone`', () => {
    assert(named.includes('TimeZone'));
  });
  it('should contain `PlainDate`', () => {
    assert(named.includes('PlainDate'));
  });
  it('should contain `PlainTime`', () => {
    assert(named.includes('PlainTime'));
  });
  it('should contain `PlainDateTime`', () => {
    assert(named.includes('PlainDateTime'));
  });
  it('should contain `ZonedDateTime`', () => {
    assert(named.includes('ZonedDateTime'));
  });
  it('should contain `PlainYearMonth`', () => {
    assert(named.includes('PlainYearMonth'));
  });
  it('should contain `PlainMonthDay`', () => {
    assert(named.includes('PlainMonthDay'));
  });
  it('should contain `Duration`', () => {
    assert(named.includes('Duration'));
  });
  it('should contain `Calendar`', () => {
    assert(named.includes('Calendar'));
  });
  it('should contain `Now`', () => {
    assert(named.includes('Now'));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
