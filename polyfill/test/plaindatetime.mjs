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
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainDateTime } = Temporal;

describe('DateTime', () => {
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new PlainDateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 0), RangeError);
      throws(() => new PlainDateTime(275760, 9, 14, 0, 0, 0, 0, 0, 0), RangeError);
      equal(`${new PlainDateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 1)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${new PlainDateTime(275760, 9, 13, 23, 59, 59, 999, 999, 999)}`, '+275760-09-13T23:59:59.999999999');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 19 };
      const tooLate = { year: 275760, month: 9, day: 14 };
      ['reject', 'constrain'].forEach((overflow) => {
        [tooEarly, tooLate].forEach((props) => {
          throws(() => PlainDateTime.from(props, { overflow }), RangeError);
        });
      });
      equal(
        `${PlainDateTime.from({ year: -271821, month: 4, day: 19, nanosecond: 1 })}`,
        '-271821-04-19T00:00:00.000000001'
      );
      equal(
        `${PlainDateTime.from({
          year: 275760,
          month: 9,
          day: 13,
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999
        })}`,
        '+275760-09-13T23:59:59.999999999'
      );
    });
    it('constructing from ISO string', () => {
      ['reject', 'constrain'].forEach((overflow) => {
        ['-271821-04-19T00:00', '+275760-09-14T00:00'].forEach((str) => {
          throws(() => PlainDateTime.from(str, { overflow }), RangeError);
        });
      });
      equal(`${PlainDateTime.from('-271821-04-19T00:00:00.000000001')}`, '-271821-04-19T00:00:00.000000001');
      equal(`${PlainDateTime.from('+275760-09-13T23:59:59.999999999')}`, '+275760-09-13T23:59:59.999999999');
    });
    it('converting from Instant', () => {
      const min = Temporal.Instant.from('-271821-04-20T00:00Z');
      const offsetMin = Temporal.TimeZone.from('-23:59');
      equal(`${offsetMin.getPlainDateTimeFor(min, 'iso8601')}`, '-271821-04-19T00:01:00');
      const max = Temporal.Instant.from('+275760-09-13T00:00Z');
      const offsetMax = Temporal.TimeZone.from('+23:59');
      equal(`${offsetMax.getPlainDateTimeFor(max, 'iso8601')}`, '+275760-09-13T23:59:00');
    });
    it('converting from Date and Time', () => {
      const midnight = Temporal.PlainTime.from('00:00');
      const firstNs = Temporal.PlainTime.from('00:00:00.000000001');
      const lastNs = Temporal.PlainTime.from('23:59:59.999999999');
      const min = Temporal.PlainDate.from('-271821-04-19');
      const max = Temporal.PlainDate.from('+275760-09-13');
      throws(() => min.toPlainDateTime(midnight), RangeError);
      throws(() => midnight.toPlainDateTime(min), RangeError);
      equal(`${min.toPlainDateTime(firstNs)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${firstNs.toPlainDateTime(min)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${max.toPlainDateTime(lastNs)}`, '+275760-09-13T23:59:59.999999999');
      equal(`${lastNs.toPlainDateTime(max)}`, '+275760-09-13T23:59:59.999999999');
    });
    it('adding and subtracting beyond limit', () => {
      const min = PlainDateTime.from('-271821-04-19T00:00:00.000000001');
      const max = PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => min.subtract({ nanoseconds: 1 }, { overflow }), RangeError);
        throws(() => max.add({ nanoseconds: 1 }, { overflow }), RangeError);
      });
    });
    it('rounding beyond limit', () => {
      const min = PlainDateTime.from('-271821-04-19T00:00:00.000000001');
      const max = PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      ['day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'].forEach((smallestUnit) => {
        throws(() => min.round({ smallestUnit, roundingMode: 'floor' }), RangeError);
        throws(() => max.round({ smallestUnit, roundingMode: 'ceil' }), RangeError);
      });
    });
  });
  describe('dateTime.withCalendar()', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    it('works', () => {
      const calendar = Temporal.Calendar.from('iso8601');
      equal(`${dt1.withCalendar(calendar)}`, '1976-11-18T15:23:30.123456789');
    });
    it('casts its argument', () => {
      equal(`${dt1.withCalendar('iso8601')}`, '1976-11-18T15:23:30.123456789');
    });
  });
  describe('dateTime.toString()', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23');
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(dt1.toString({ calendarName: 'auto' }), '1976-11-18T15:23:00');
      equal(dt1.withCalendar('gregory').toString({ calendarName: 'auto' }), '1976-11-18T15:23:00[u-ca=gregory]');
    });
    it('shows ISO calendar if calendarName = always', () => {
      equal(dt1.toString({ calendarName: 'always' }), '1976-11-18T15:23:00[u-ca=iso8601]');
    });
    it('omits non-ISO calendar if calendarName = never', () => {
      equal(dt1.withCalendar('gregory').toString({ calendarName: 'never' }), '1976-11-18T15:23:00');
    });
    it('default is calendar = auto', () => {
      equal(dt1.toString(), '1976-11-18T15:23:00');
      equal(dt1.withCalendar('gregory').toString(), '1976-11-18T15:23:00[u-ca=gregory]');
    });
    it('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
        throws(() => dt1.toString({ calendarName }), RangeError);
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
