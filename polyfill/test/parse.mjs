#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'tc39-temporal';

describe('Temporal.parse', () => {
  it('is a function', () => equal(typeof Temporal.parse, 'function'));
  it('fails for invalid ISO strings', () => throws(() => Temporal.parse('this is an invalid ISO string'), RangeError));
  it('does not fail for valid ISO strings', () => assert(() => Temporal.parse('1937-01-01T12:00:27.870+00:20')));

  it('can be used to salvage valid parts of invalid ISO strings', () => {
    const salvagedDate = Temporal.Date.from(Temporal.parse('1922-12-30T99:99:99Z').date);
    equal(salvagedDate.toString(), '1922-12-30');
  });

  const parsed = Temporal.parse('1937-01-01T12:00:27.870+00:20');
  it('can construct valid absolutes', () =>
    equal(Temporal.Absolute.from(parsed.absolute).toString(), '1937-01-01T11:40:27.870Z'));
  it('can construct valid dateTimes', () =>
    equal(Temporal.DateTime.from(parsed.dateTime).toString(), '1937-01-01T12:00:27.870'));
  it('can construct valid dates', () => equal(Temporal.Date.from(parsed.date).toString(), '1937-01-01'));
  it('can construct valid yearMonths', () => equal(Temporal.YearMonth.from(parsed.yearMonth).toString(), '1937-01'));
  it('can construct valid monthDays', () => equal(Temporal.MonthDay.from(parsed.monthDay).toString(), '01-01'));
  it('can construct valid times', () => equal(Temporal.Time.from(parsed.time).toString(), '12:00:27.870'));
  it('can construct valid timeZones', () => equal(Temporal.TimeZone.from(parsed.zone.offset).toString(), '+00:20'));
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
