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
const { PlainDateTime } = Temporal;

describe('DateTime', () => {
  describe('DateTime.from() works', () => {
    it('DateTime.from("1976-11-18 15:23:30")', () =>
      equal(`${PlainDateTime.from('1976-11-18 15:23:30')}`, '1976-11-18T15:23:30'));
    it('DateTime.from("1976-11-18 15:23:30.001")', () =>
      equal(`${PlainDateTime.from('1976-11-18 15:23:30.001')}`, '1976-11-18T15:23:30.001'));
    it('DateTime.from("1976-11-18 15:23:30.001123")', () =>
      equal(`${PlainDateTime.from('1976-11-18 15:23:30.001123')}`, '1976-11-18T15:23:30.001123'));
    it('DateTime.from("1976-11-18 15:23:30.001123456")', () =>
      equal(`${PlainDateTime.from('1976-11-18 15:23:30.001123456')}`, '1976-11-18T15:23:30.001123456'));
    it('DateTime.from(1976-11-18) is not the same object', () => {
      const orig = new PlainDateTime(1976, 11, 18, 15, 23, 20, 123, 456, 789);
      const actual = PlainDateTime.from(orig);
      notEqual(actual, orig);
    });
    it('DateTime.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18T00:00:00', () =>
      equal(`${PlainDateTime.from({ year: 1976, month: 11, monthCode: 'M11', day: 18 })}`, '1976-11-18T00:00:00'));
    it('can be constructed with month and without monthCode', () =>
      equal(`${PlainDateTime.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18T00:00:00'));
    it('can be constructed with monthCode and without month', () =>
      equal(`${PlainDateTime.from({ year: 1976, monthCode: 'M11', day: 18 })}`, '1976-11-18T00:00:00'));
    it('month and monthCode must agree', () =>
      throws(() => PlainDateTime.from({ year: 1976, month: 11, monthCode: 'M12', day: 18 }), RangeError));
    it('DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 }) == 1976-11-18T00:00:00.123', () =>
      equal(`${PlainDateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 })}`, '1976-11-18T00:00:00.123'));
    it('DateTime.from({ year: 1976, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }) throws', () =>
      throws(
        () => PlainDateTime.from({ year: 1976, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }),
        TypeError
      ));
    it('DateTime.from({}) throws', () => throws(() => PlainDateTime.from({}), TypeError));
    it('DateTime.from(required prop undefined) throws', () =>
      throws(() => PlainDateTime.from({ year: 1976, month: undefined, monthCode: undefined, day: 18 }), TypeError));
    it('DateTime.from(ISO string leap second) is constrained', () => {
      equal(`${PlainDateTime.from('2016-12-31T23:59:60')}`, '2016-12-31T23:59:59');
    });
    it('DateTime.from(number) is converted to string', () =>
      assert(PlainDateTime.from(19761118).equals(PlainDateTime.from('19761118'))));
    describe('Overflow', () => {
      const bad = { year: 2019, month: 1, day: 32 };
      it('reject', () => throws(() => PlainDateTime.from(bad, { overflow: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${PlainDateTime.from(bad)}`, '2019-01-31T00:00:00');
        equal(`${PlainDateTime.from(bad, { overflow: 'constrain' })}`, '2019-01-31T00:00:00');
      });
      it('throw when bad overflow', () => {
        [new PlainDateTime(1976, 11, 18, 15, 23), { year: 2019, month: 1, day: 1 }, '2019-01-31T00:00'].forEach(
          (input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
              throws(() => PlainDateTime.from(input, { overflow }), RangeError)
            );
          }
        );
      });
      const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60 };
      it('reject leap second', () => throws(() => PlainDateTime.from(leap, { overflow: 'reject' }), RangeError));
      it('constrain leap second', () => equal(`${PlainDateTime.from(leap)}`, '2016-12-31T23:59:59'));
      it('constrain has no effect on invalid ISO string', () => {
        throws(() => PlainDateTime.from('2020-13-34T24:60', { overflow: 'constrain' }), RangeError);
      });
    });
    it('Z not supported', () => {
      throws(() => PlainDateTime.from('2019-10-01T09:00:00Z'), RangeError);
      throws(() => PlainDateTime.from('2019-10-01T09:00:00Z[Europe/Berlin]'), RangeError);
    });
    it('variant time separators', () => {
      equal(`${PlainDateTime.from('1976-11-18t15:23')}`, '1976-11-18T15:23:00');
      equal(`${PlainDateTime.from('1976-11-18 15:23')}`, '1976-11-18T15:23:00');
    });
    it('any number of decimal places', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12')}`, '1976-11-18T15:23:30.12');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123')}`, '1976-11-18T15:23:30.123');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1234')}`, '1976-11-18T15:23:30.1234');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12345')}`, '1976-11-18T15:23:30.12345');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123456')}`, '1976-11-18T15:23:30.123456');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1234567')}`, '1976-11-18T15:23:30.1234567');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12345678')}`, '1976-11-18T15:23:30.12345678');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123456789')}`, '1976-11-18T15:23:30.123456789');
    });
    it('variant decimal separator', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30,12')}`, '1976-11-18T15:23:30.12');
    });
    it('variant minus sign', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T15:23:30.12');
      equal(`${PlainDateTime.from('\u2212009999-11-18T15:23:30.12')}`, '-009999-11-18T15:23:30.12');
    });
    it('mixture of basic and extended format', () => {
      equal(`${PlainDateTime.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('19761118T152330.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.1');
    });
    it('optional parts', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30');
      equal(`${PlainDateTime.from('1976-11-18T15')}`, '1976-11-18T15:00:00');
      equal(`${PlainDateTime.from('1976-11-18')}`, '1976-11-18T00:00:00');
    });
    it('no junk at end of string', () =>
      throws(() => PlainDateTime.from('1976-11-18T15:23:30.123456789junk'), RangeError));
    it('ignores if a timezone is specified', () =>
      equal(`${PlainDateTime.from('2020-01-01T01:23:45[Asia/Kolkata]')}`, '2020-01-01T01:23:45'));
    it('options may be a function object', () => {
      equal(`${PlainDateTime.from({ year: 1976, month: 11, day: 18 }, () => {})}`, '1976-11-18T00:00:00');
    });
    it('object must contain at least the required correctly-spelled properties', () => {
      throws(() => PlainDateTime.from({}), TypeError);
      throws(() => PlainDateTime.from({ year: 1976, months: 11, day: 18 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${PlainDateTime.from({ year: 1976, month: 11, day: 18, hours: 12 })}`, '1976-11-18T00:00:00');
    });
  });
  describe('DateTime.toZonedDateTime()', () => {
    it('works', () => {
      const dt = Temporal.PlainDateTime.from('2020-01-01T00:00');
      const zdt = dt.toZonedDateTime('America/Los_Angeles');
      equal(zdt.toString(), '2020-01-01T00:00:00-08:00[America/Los_Angeles]');
    });
    it('works with disambiguation option', () => {
      const dt = Temporal.PlainDateTime.from('2020-03-08T02:00');
      const zdt = dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]');
    });
    it('datetime with multiple instants - Fall DST in Brazil', () => {
      const dt = PlainDateTime.from('2019-02-16T23:45');
      equal(`${dt.toZonedDateTime('America/Sao_Paulo')}`, '2019-02-16T23:45:00-02:00[America/Sao_Paulo]');
      equal(
        `${dt.toZonedDateTime('America/Sao_Paulo', { disambiguation: 'compatible' })}`,
        '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
      );
      equal(
        `${dt.toZonedDateTime('America/Sao_Paulo', { disambiguation: 'earlier' })}`,
        '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
      );
      equal(
        `${dt.toZonedDateTime('America/Sao_Paulo', { disambiguation: 'later' })}`,
        '2019-02-16T23:45:00-03:00[America/Sao_Paulo]'
      );
      throws(() => dt.toZonedDateTime('America/Sao_Paulo', { disambiguation: 'reject' }), RangeError);
    });
    it('datetime with multiple instants - Spring DST in Los Angeles', () => {
      const dt = PlainDateTime.from('2020-03-08T02:30');
      equal(`${dt.toZonedDateTime('America/Los_Angeles')}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]');
      equal(
        `${dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'compatible' })}`,
        '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
      );
      equal(
        `${dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'earlier' })}`,
        '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
      );
      equal(
        `${dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'later' })}`,
        '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
      );
      throws(() => dt.toZonedDateTime('America/Los_Angeles', { disambiguation: 'reject' }), RangeError);
    });
    it('outside of Instant range', () => {
      const max = Temporal.PlainDateTime.from('+275760-09-13T23:59:59.999999999');
      throws(() => max.toZonedDateTime('America/Godthab'), RangeError);
    });
    it('throws on bad disambiguation', () => {
      ['', 'EARLIER', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => PlainDateTime.from('2019-10-29T10:46').toZonedDateTime('UTC', { disambiguation }), RangeError)
      );
    });
    it('options may be a function object', () => {
      const dt = PlainDateTime.from('2019-10-29T10:46:38.271986102');
      equal(
        `${dt.toZonedDateTime('America/Sao_Paulo', () => {})}`,
        '2019-10-29T10:46:38.271986102-03:00[America/Sao_Paulo]'
      );
    });
  });
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
  describe('dateTime.getISOFields() works', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    const fields = dt1.getISOFields();
    it('fields', () => {
      equal(fields.isoYear, 1976);
      equal(fields.isoMonth, 11);
      equal(fields.isoDay, 18);
      equal(fields.isoHour, 15);
      equal(fields.isoMinute, 23);
      equal(fields.isoSecond, 30);
      equal(fields.isoMillisecond, 123);
      equal(fields.isoMicrosecond, 456);
      equal(fields.isoNanosecond, 789);
      equal(fields.calendar.id, 'iso8601');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoYear, 1976);
      equal(fields2.isoMonth, 11);
      equal(fields2.isoDay, 18);
      equal(fields2.isoHour, 15);
      equal(fields2.isoMinute, 23);
      equal(fields2.isoSecond, 30);
      equal(fields2.isoMillisecond, 123);
      equal(fields2.isoMicrosecond, 456);
      equal(fields2.isoNanosecond, 789);
      equal(fields2.calendar, fields.calendar);
    });
    it('as input to constructor', () => {
      const dt2 = new PlainDateTime(
        fields.isoYear,
        fields.isoMonth,
        fields.isoDay,
        fields.isoHour,
        fields.isoMinute,
        fields.isoSecond,
        fields.isoMillisecond,
        fields.isoMicrosecond,
        fields.isoNanosecond,
        fields.calendar
      );
      assert(dt2.equals(dt1));
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
