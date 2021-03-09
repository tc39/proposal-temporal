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
  describe('Structure', () => {
    it('DateTime is a Function', () => {
      equal(typeof PlainDateTime, 'function');
    });
    it('DateTime has a prototype', () => {
      assert(PlainDateTime.prototype);
      equal(typeof PlainDateTime.prototype, 'object');
    });
    describe('DateTime.prototype', () => {
      it('DateTime.prototype has year', () => {
        assert('year' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has month', () => {
        assert('month' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has monthCode', () => {
        assert('monthCode' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has day', () => {
        assert('day' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has hour', () => {
        assert('hour' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has minute', () => {
        assert('minute' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has second', () => {
        assert('second' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has millisecond', () => {
        assert('millisecond' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has microsecond', () => {
        assert('microsecond' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has nanosecond', () => {
        assert('nanosecond' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has daysInWeek', () => {
        assert('daysInWeek' in PlainDateTime.prototype);
      });
      it('DateTime.prototype has monthsInYear', () => {
        assert('monthsInYear' in PlainDateTime.prototype);
      });
      it('DateTime.prototype.with is a Function', () => {
        equal(typeof PlainDateTime.prototype.with, 'function');
      });
      it('DateTime.prototype.add is a Function', () => {
        equal(typeof PlainDateTime.prototype.add, 'function');
      });
      it('DateTime.prototype.subtract is a Function', () => {
        equal(typeof PlainDateTime.prototype.subtract, 'function');
      });
      it('DateTime.prototype.until is a Function', () => {
        equal(typeof PlainDateTime.prototype.until, 'function');
      });
      it('DateTime.prototype.since is a Function', () => {
        equal(typeof PlainDateTime.prototype.since, 'function');
      });
      it('DateTime.prototype.round is a Function', () => {
        equal(typeof PlainDateTime.prototype.round, 'function');
      });
      it('DateTime.prototype.equals is a Function', () => {
        equal(typeof PlainDateTime.prototype.equals, 'function');
      });
      it('DateTime.prototype.toZonedDateTime is a Function', () => {
        equal(typeof PlainDateTime.prototype.toZonedDateTime, 'function');
      });
      it('DateTime.prototype.toPlainDate is a Function', () => {
        equal(typeof PlainDateTime.prototype.toPlainDate, 'function');
      });
      it('DateTime.prototype.toPlainTime is a Function', () => {
        equal(typeof PlainDateTime.prototype.toPlainTime, 'function');
      });
      it('DateTime.prototype.getISOFields is a Function', () => {
        equal(typeof PlainDateTime.prototype.getISOFields, 'function');
      });
      it('DateTime.prototype.toString is a Function', () => {
        equal(typeof PlainDateTime.prototype.toString, 'function');
      });
      it('DateTime.prototype.toJSON is a Function', () => {
        equal(typeof PlainDateTime.prototype.toJSON, 'function');
      });
    });
    it('DateTime.from is a Function', () => {
      equal(typeof PlainDateTime.from, 'function');
    });
    it('DateTime.compare is a Function', () => {
      equal(typeof PlainDateTime.compare, 'function');
    });
  });
  describe('Construction', () => {
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789, calendar)', () => {
      let datetime;
      const calendar = Temporal.Calendar.from('iso8601');
      it('datetime can be constructed', () => {
        datetime = new PlainDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789, calendar);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
      it('datetime.monthCode is "M11"', () => equal(datetime.monthCode, 'M11'));
      it('datetime.day is 18', () => equal(datetime.day, 18));
      it('datetime.hour is 15', () => equal(datetime.hour, 15));
      it('datetime.minute is 23', () => equal(datetime.minute, 23));
      it('datetime.second is 30', () => equal(datetime.second, 30));
      it('datetime.millisecond is 123', () => equal(datetime.millisecond, 123));
      it('datetime.microsecond is 456', () => equal(datetime.microsecond, 456));
      it('datetime.nanosecond is 789', () => equal(datetime.nanosecond, 789));
      it('datetime.calendar is the object', () => equal(datetime.calendar, calendar));
      it('datetime.dayOfWeek is 4', () => equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', () => equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', () => equal(datetime.weekOfYear, 47));
      it('datetime.daysInWeek is 7', () => equal(datetime.daysInWeek, 7));
      it('datetime.monthsInYear is 12', () => equal(datetime.monthsInYear, 12));
      it('`${datetime}` is 1976-11-18T15:23:30.123456789', () => equal(`${datetime}`, '1976-11-18T15:23:30.123456789'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123, 456)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new PlainDateTime(1976, 11, 18, 15, 23, 30, 123, 456);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
      it('datetime.monthCode is "M11"', () => equal(datetime.monthCode, 'M11'));
      it('datetime.day is 18', () => equal(datetime.day, 18));
      it('datetime.hour is 15', () => equal(datetime.hour, 15));
      it('datetime.minute is 23', () => equal(datetime.minute, 23));
      it('datetime.second is 30', () => equal(datetime.second, 30));
      it('datetime.millisecond is 123', () => equal(datetime.millisecond, 123));
      it('datetime.microsecond is 456', () => equal(datetime.microsecond, 456));
      it('datetime.nanosecond is 0', () => equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', () => equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', () => equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', () => equal(datetime.weekOfYear, 47));
      it('datetime.daysInWeek is 7', () => equal(datetime.daysInWeek, 7));
      it('datetime.monthsInYear is 12', () => equal(datetime.monthsInYear, 12));
      it('`${datetime}` is 1976-11-18T15:23:30.123456', () => equal(`${datetime}`, '1976-11-18T15:23:30.123456'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new PlainDateTime(1976, 11, 18, 15, 23, 30, 123);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
      it('datetime.monthCode is "M11"', () => equal(datetime.monthCode, 'M11'));
      it('datetime.day is 18', () => equal(datetime.day, 18));
      it('datetime.hour is 15', () => equal(datetime.hour, 15));
      it('datetime.minute is 23', () => equal(datetime.minute, 23));
      it('datetime.second is 30', () => equal(datetime.second, 30));
      it('datetime.millisecond is 123', () => equal(datetime.millisecond, 123));
      it('datetime.microsecond is 0', () => equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', () => equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', () => equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', () => equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', () => equal(datetime.weekOfYear, 47));
      it('datetime.daysInWeek is 7', () => equal(datetime.daysInWeek, 7));
      it('datetime.monthsInYear is 12', () => equal(datetime.monthsInYear, 12));
      it('`${datetime}` is 1976-11-18T15:23:30.123', () => equal(`${datetime}`, '1976-11-18T15:23:30.123'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new PlainDateTime(1976, 11, 18, 15, 23, 30);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
      it('datetime.monthCode is "M11"', () => equal(datetime.monthCode, 'M11'));
      it('datetime.day is 18', () => equal(datetime.day, 18));
      it('datetime.hour is 15', () => equal(datetime.hour, 15));
      it('datetime.minute is 23', () => equal(datetime.minute, 23));
      it('datetime.second is 30', () => equal(datetime.second, 30));
      it('datetime.millisecond is 0', () => equal(datetime.millisecond, 0));
      it('datetime.microsecond is 0', () => equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', () => equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', () => equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', () => equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', () => equal(datetime.weekOfYear, 47));
      it('datetime.daysInWeek is 7', () => equal(datetime.daysInWeek, 7));
      it('datetime.monthsInYear is 12', () => equal(datetime.monthsInYear, 12));
      it('`${datetime}` is 1976-11-18T15:23:30', () => equal(`${datetime}`, '1976-11-18T15:23:30'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new PlainDateTime(1976, 11, 18, 15, 23);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
      it('datetime.monthCode is "M11"', () => equal(datetime.monthCode, 'M11'));
      it('datetime.day is 18', () => equal(datetime.day, 18));
      it('datetime.hour is 15', () => equal(datetime.hour, 15));
      it('datetime.minute is 23', () => equal(datetime.minute, 23));
      it('datetime.second is 0', () => equal(datetime.second, 0));
      it('datetime.millisecond is 0', () => equal(datetime.millisecond, 0));
      it('datetime.microsecond is 0', () => equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', () => equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', () => equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', () => equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', () => equal(datetime.weekOfYear, 47));
      it('datetime.daysInWeek is 7', () => equal(datetime.daysInWeek, 7));
      it('datetime.monthsInYear is 12', () => equal(datetime.monthsInYear, 12));
      it('`${datetime}` is 1976-11-18T15:23:00', () => equal(`${datetime}`, '1976-11-18T15:23:00'));
    });
    describe('new DateTime(1976, 11, 18, 15)', () => {
      const datetime = new PlainDateTime(1976, 11, 18, 15);
      it('`${datetime}` is 1976-11-18T15:00:00', () => equal(`${datetime}`, '1976-11-18T15:00:00'));
    });
    describe('new DateTime(1976, 11, 18)', () => {
      const datetime = new PlainDateTime(1976, 11, 18);
      it('`${datetime}` is 1976-11-18T00:00:00', () => equal(`${datetime}`, '1976-11-18T00:00:00'));
    });
    describe('constructor treats -0 as 0', () => {
      it('ignores the sign of -0', () => {
        const datetime = new PlainDateTime(1976, 11, 18, -0, -0, -0, -0, -0);
        equal(datetime.hour, 0);
        equal(datetime.minute, 0);
        equal(datetime.second, 0);
        equal(datetime.millisecond, 0);
        equal(datetime.microsecond, 0);
        equal(datetime.nanosecond, 0);
      });
    });
  });
  describe('.with manipulation', () => {
    const datetime = new PlainDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it('datetime.with({ year: 2019 } works', () => {
      equal(`${datetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789');
    });
    it('datetime.with({ month: 5 } works', () => {
      equal(`${datetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789');
    });
    it('datetime.with({ monthCode: "M05" } works', () => {
      equal(`${datetime.with({ monthCode: 'M05' })}`, '1976-05-18T15:23:30.123456789');
    });
    it('month and monthCode must agree', () => {
      throws(() => datetime.with({ month: 5, monthCode: 'M06' }), RangeError);
    });
    it('datetime.with({ day: 5 } works', () => {
      equal(`${datetime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789');
    });
    it('datetime.with({ hour: 5 } works', () => {
      equal(`${datetime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789');
    });
    it('datetime.with({ minute: 5 } works', () => {
      equal(`${datetime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789');
    });
    it('datetime.with({ second: 5 } works', () => {
      equal(`${datetime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789');
    });
    it('datetime.with({ millisecond: 5 } works', () => {
      equal(`${datetime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789');
    });
    it('datetime.with({ microsecond: 5 } works', () => {
      equal(`${datetime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789');
    });
    it('datetime.with({ nanosecond: 5 } works', () => {
      equal(`${datetime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005');
    });
    it('datetime.with({ month: 5, second: 15 } works', () => {
      equal(`${datetime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => datetime.with({ day: 5 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => datetime.with({ day: 5 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${datetime.with({ day: 5 }, options)}`, '1976-11-05T15:23:30.123456789')
      );
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => datetime.with({}), TypeError);
      throws(() => datetime.with({ months: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${datetime.with({ month: 12, days: 15 })}`, '1976-12-18T15:23:30.123456789');
    });
    it('datetime.with(string) throws', () => {
      throws(() => datetime.with('12:00'), TypeError);
      throws(() => datetime.with('1995-04-07'), TypeError);
      throws(() => datetime.with('2019-05-17T12:34:56.007007007'), TypeError);
      throws(() => datetime.with('2019-05-17T12:34:56.007007007Z'), TypeError);
      throws(() => datetime.with('42'), TypeError);
    });
    it('throws with calendar property', () => {
      throws(() => datetime.with({ year: 2021, calendar: 'iso8601' }), TypeError);
    });
    it('throws with timeZone property', () => {
      throws(() => datetime.with({ year: 2021, timeZone: 'UTC' }), TypeError);
    });
  });
  describe('.withPlainTime manipulation', () => {
    const dt = Temporal.PlainDateTime.from('2015-12-07T03:24:30.000003500');
    it('datetime.withPlainTime({ hour: 10 }) works', () => {
      equal(`${dt.withPlainTime({ hour: 10 })}`, '2015-12-07T10:00:00');
    });
    it('datetime.withPlainTime(time) works', () => {
      const time = Temporal.PlainTime.from('11:22');
      equal(`${dt.withPlainTime(time)}`, '2015-12-07T11:22:00');
    });
    it("datetime.withPlainTime('12:34') works", () => {
      equal(`${dt.withPlainTime('12:34')}`, '2015-12-07T12:34:00');
    });
    it('datetime.withPlainTime() defaults to midnight', () => {
      equal(`${dt.withPlainTime()}`, '2015-12-07T00:00:00');
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => dt.withPlainTime({}), TypeError);
      throws(() => dt.withPlainTime({ minutes: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${dt.withPlainTime({ hour: 10, seconds: 123 })}`, '2015-12-07T10:00:00');
    });
  });
  describe('.withPlainDate manipulation', () => {
    const dt = Temporal.PlainDateTime.from('1995-12-07T03:24:30');
    it('datetime.withPlainDate({ year: 2000, month: 6, day: 1 }) works', () => {
      equal(`${dt.withPlainDate({ year: 2000, month: 6, day: 1 })}`, '2000-06-01T03:24:30');
    });
    it('datetime.withPlainDate(plainDate) works', () => {
      const date = Temporal.PlainDate.from('2020-01-23');
      equal(`${dt.withPlainDate(date)}`, '2020-01-23T03:24:30');
    });
    it("datetime.withPlainDate('2018-09-15') works", () => {
      equal(`${dt.withPlainDate('2018-09-15')}`, '2018-09-15T03:24:30');
    });
    it('result contains a non-ISO calendar if present in the input', () => {
      equal(`${dt.withCalendar('japanese').withPlainDate('2008-09-06')}`, '2008-09-06T03:24:30[u-ca=japanese]');
    });
    it('calendar is unchanged if input has ISO calendar', () => {
      equal(`${dt.withPlainDate('2008-09-06[u-ca=japanese]')}`, '2008-09-06T03:24:30[u-ca=japanese]');
    });
    it('throws if both `this` and `other` have a non-ISO calendar', () => {
      throws(() => dt.withCalendar('gregory').withPlainDate('2008-09-06[u-ca=japanese]'), RangeError);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => dt.withPlainDate({}), TypeError);
      throws(() => dt.withPlainDate({ months: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${dt.withPlainDate({ year: 2000, month: 6, day: 1, months: 123 })}`, '2000-06-01T03:24:30');
    });
  });
  describe('DateTime.compare() works', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    const dt2 = PlainDateTime.from('2019-10-29T10:46:38.271986102');
    it('equal', () => equal(PlainDateTime.compare(dt1, dt1), 0));
    it('smaller/larger', () => equal(PlainDateTime.compare(dt1, dt2), -1));
    it('larger/smaller', () => equal(PlainDateTime.compare(dt2, dt1), 1));
    it('casts first argument', () => {
      equal(PlainDateTime.compare({ year: 1976, month: 11, day: 18, hour: 15 }, dt2), -1);
      equal(PlainDateTime.compare('1976-11-18T15:23:30.123456789', dt2), -1);
    });
    it('casts second argument', () => {
      equal(PlainDateTime.compare(dt1, { year: 2019, month: 10, day: 29, hour: 10 }), -1);
      equal(PlainDateTime.compare(dt1, '2019-10-29T10:46:38.271986102'), -1);
    });
    it('object must contain at least the required properties', () => {
      throws(() => PlainDateTime.compare({ year: 1976 }, dt2), TypeError);
      throws(() => PlainDateTime.compare(dt1, { year: 2019 }), TypeError);
    });
  });
  describe('DateTime.equals() works', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    const dt2 = PlainDateTime.from('2019-10-29T10:46:38.271986102');
    it('equal', () => assert(dt1.equals(dt1)));
    it('unequal', () => assert(!dt1.equals(dt2)));
    it('casts argument', () => {
      assert(!dt2.equals({ year: 1976, month: 11, day: 18, hour: 15 }));
      assert(!dt2.equals('1976-11-18T15:23:30.123456789'));
    });
    it('object must contain at least the required properties', () => {
      throws(() => dt2.equals({ year: 1976 }), TypeError);
    });
  });
  describe("Comparison operators don't work", () => {
    const dt1 = PlainDateTime.from('1963-02-13T09:36:29.123456789');
    const dt1again = PlainDateTime.from('1963-02-13T09:36:29.123456789');
    const dt2 = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    it('=== is object equality', () => equal(dt1, dt1));
    it('!== is object equality', () => notEqual(dt1, dt1again));
    it('<', () => throws(() => dt1 < dt2));
    it('>', () => throws(() => dt1 > dt2));
    it('<=', () => throws(() => dt1 <= dt2));
    it('>=', () => throws(() => dt1 >= dt2));
  });
  describe('date/time maths', () => {
    const earlier = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    const later = PlainDateTime.from('2019-10-29T10:46:38.271986102');
    ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].forEach((largestUnit) => {
      const diff = later.since(earlier, { largestUnit });
      it(`(${earlier}).since(${later}) == (${later}).since(${earlier}).negated()`, () =>
        equal(`${earlier.since(later, { largestUnit })}`, `${diff.negated()}`));
      it(`(${earlier}).until(${later}) == (${later}).since(${earlier})`, () =>
        equal(`${earlier.until(later, { largestUnit })}`, `${diff}`));
      it(`(${earlier}).add(${diff}) == (${later})`, () => assert(earlier.add(diff).equals(later)));
      it(`(${later}).subtract(${diff}) == (${earlier})`, () => assert(later.subtract(diff).equals(earlier)));
      it('symmetrical with regard to negative durations', () => {
        assert(earlier.subtract(diff.negated()).equals(later));
        assert(later.add(diff.negated()).equals(earlier));
      });
    });
  });
  describe('date/time maths: hours overflow', () => {
    it('subtract result', () => {
      const later = PlainDateTime.from('2019-10-29T10:46:38.271986102');
      const earlier = later.subtract({ hours: 12 });
      equal(`${earlier}`, '2019-10-28T22:46:38.271986102');
    });
    it('add result', () => {
      const earlier = PlainDateTime.from('2020-05-31T23:12:38.271986102');
      const later = earlier.add({ hours: 2 });
      equal(`${later}`, '2020-06-01T01:12:38.271986102');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(
        `${PlainDateTime.from('2019-10-29T10:46:38.271986102').add({ hours: -12 })}`,
        '2019-10-28T22:46:38.271986102'
      );
      equal(
        `${PlainDateTime.from('2020-05-31T23:12:38.271986102').subtract({ hours: -2 })}`,
        '2020-06-01T01:12:38.271986102'
      );
    });
  });
  describe('DateTime.add() works', () => {
    const jan31 = PlainDateTime.from('2020-01-31T15:00');
    it('constrain when ambiguous result', () => {
      equal(`${jan31.add({ months: 1 })}`, '2020-02-29T15:00:00');
      equal(`${jan31.add({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00:00');
    });
    it('symmetrical with regard to negative durations in the time part', () => {
      equal(`${jan31.add({ minutes: -30 })}`, '2020-01-31T14:30:00');
      equal(`${jan31.add({ seconds: -30 })}`, '2020-01-31T14:59:30');
    });
    it('throw when ambiguous result with reject', () => {
      throws(() => jan31.add({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => PlainDateTime.from('2019-11-18T15:00').add({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => jan31.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => jan31.add({ years: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${jan31.add({ years: 1 }, options)}`, '2021-01-31T15:00:00')
      );
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => jan31.add({}), TypeError);
      throws(() => jan31.add({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${jan31.add({ month: 1, days: 1 })}`, '2020-02-01T15:00:00');
    });
    it('casts argument', () => {
      equal(`${jan31.add(Temporal.Duration.from('P1MT1S'))}`, '2020-02-29T15:00:01');
      equal(`${jan31.add('P1MT1S')}`, '2020-02-29T15:00:01');
    });
  });
  describe('date.subtract() works', () => {
    const mar31 = PlainDateTime.from('2020-03-31T15:00');
    it('constrain when ambiguous result', () => {
      equal(`${mar31.subtract({ months: 1 })}`, '2020-02-29T15:00:00');
      equal(`${mar31.subtract({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00:00');
    });
    it('symmetrical with regard to negative durations in the time part', () => {
      equal(`${mar31.subtract({ minutes: -30 })}`, '2020-03-31T15:30:00');
      equal(`${mar31.subtract({ seconds: -30 })}`, '2020-03-31T15:00:30');
    });
    it('throw when ambiguous result with reject', () => {
      throws(() => mar31.subtract({ months: 1 }, { overflow: 'reject' }), RangeError);
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => PlainDateTime.from('2019-11-18T15:00').subtract({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => mar31.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => mar31.subtract({ years: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${mar31.subtract({ years: 1 }, options)}`, '2019-03-31T15:00:00')
      );
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => mar31.subtract({}), TypeError);
      throws(() => mar31.subtract({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${mar31.subtract({ month: 1, days: 1 })}`, '2020-03-30T15:00:00');
    });
    it('casts argument', () => {
      equal(`${mar31.subtract(Temporal.Duration.from('P1MT1S'))}`, '2020-02-29T14:59:59');
      equal(`${mar31.subtract('P1MT1S')}`, '2020-02-29T14:59:59');
    });
  });
  describe('DateTime.until()', () => {
    const dt = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    it('dt.until(later) === later.since(dt)', () => {
      const later = PlainDateTime.from({ year: 2016, month: 3, day: 3, hour: 18 });
      equal(`${dt.until(later)}`, `${later.since(dt)}`);
    });
    it('casts argument', () => {
      equal(`${dt.until({ year: 2019, month: 10, day: 29, hour: 10 })}`, 'P15684DT18H36M29.876543211S');
      equal(`${dt.until('2019-10-29T10:46:38.271986102')}`, 'P15684DT19H23M8.148529313S');
    });
    const feb20 = PlainDateTime.from('2020-02-01T00:00');
    const feb21 = PlainDateTime.from('2021-02-01T00:00');
    it('defaults to returning days', () => {
      equal(`${feb20.until(feb21)}`, 'P366D');
      equal(`${feb20.until(feb21, { largestUnit: 'auto' })}`, 'P366D');
      equal(`${feb20.until(feb21, { largestUnit: 'days' })}`, 'P366D');
      equal(`${feb20.until(PlainDateTime.from('2021-02-01T00:00:00.000000001'))}`, 'P366DT0.000000001S');
      equal(`${PlainDateTime.from('2020-02-01T00:00:00.000000001').until(feb21)}`, 'P365DT23H59M59.999999999S');
    });
    it('can return lower or higher units', () => {
      equal(`${feb20.until(feb21, { largestUnit: 'years' })}`, 'P1Y');
      equal(`${feb20.until(feb21, { largestUnit: 'months' })}`, 'P12M');
      equal(`${feb20.until(feb21, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb20.until(feb21, { largestUnit: 'minutes' })}`, 'PT527040M');
      equal(`${feb20.until(feb21, { largestUnit: 'seconds' })}`, 'PT31622400S');
    });
    it('can return subseconds', () => {
      const later = feb20.add({ days: 1, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = feb20.until(later, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = feb20.until(later, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = feb20.until(later, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('does not include higher units than necessary', () => {
      const lastFeb20 = PlainDateTime.from('2020-02-29T00:00');
      const lastFeb21 = PlainDateTime.from('2021-02-28T00:00');
      equal(`${lastFeb20.until(lastFeb21)}`, 'P365D');
      equal(`${lastFeb20.until(lastFeb21, { largestUnit: 'months' })}`, 'P12M');
      equal(`${lastFeb20.until(lastFeb21, { largestUnit: 'years' })}`, 'P1Y');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDateTime = dt.add({ days: 42, hours: 3 });
      const weeksDifference = dt.until(laterDateTime, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = dt.until(laterDateTime, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    it('no two different calendars', () => {
      const dt1 = new PlainDateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0);
      const dt2 = new PlainDateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0, Temporal.Calendar.from('japanese'));
      throws(() => dt1.until(dt2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb20.until(feb21, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb20.until(feb21, options)}`, 'P366D'));
    });
    const earlier = PlainDateTime.from('2019-01-08T08:22:36.123456789');
    const later = PlainDateTime.from('2021-09-07T12:39:40.987654321');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'nonsense'].forEach((smallestUnit) => {
        throws(() => earlier.until(later, { smallestUnit }), RangeError);
      });
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = [
        'years',
        'months',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds'
      ];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => earlier.until(later, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y');
      equal(`${earlier.until(later, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M');
      equal(`${earlier.until(later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S'],
      ['milliseconds', 'P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864198S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P140W', '-P139W'],
      ['days', 'P974D', '-P973D'],
      ['hours', 'P973DT5H', '-P973DT4H'],
      ['minutes', 'P973DT4H18M', '-P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S', '-P973DT4H17M4S'],
      ['milliseconds', 'P973DT4H17M4.865S', '-P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864198S', '-P973DT4H17M4.864197S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S', '-P973DT4H17M4.864197532S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P140W'],
      ['days', 'P973D', '-P974D'],
      ['hours', 'P973DT4H', '-P973DT5H'],
      ['minutes', 'P973DT4H17M', '-P973DT4H18M'],
      ['seconds', 'P973DT4H17M4S', '-P973DT4H17M5S'],
      ['milliseconds', 'P973DT4H17M4.864S', '-P973DT4H17M4.865S'],
      ['microseconds', 'P973DT4H17M4.864197S', '-P973DT4H17M4.864198S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S', '-P973DT4H17M4.864197532S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M4S'],
      ['milliseconds', 'P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864197S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${earlier.until(later, { smallestUnit: 'minutes' })}`, 'P973DT4H17M');
      equal(`${earlier.until(later, { smallestUnit: 'seconds' })}`, 'P973DT4H17M4S');
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
        'P973DT3H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
        'P973DT4H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.86S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.8642S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.86419753S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement };
        assert(earlier.until(later, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(earlier.until(later, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError);
    });
    it('accepts singular units', () => {
      equal(`${earlier.until(later, { largestUnit: 'year' })}`, `${earlier.until(later, { largestUnit: 'years' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'year' })}`, `${earlier.until(later, { smallestUnit: 'years' })}`);
      equal(`${earlier.until(later, { largestUnit: 'month' })}`, `${earlier.until(later, { largestUnit: 'months' })}`);
      equal(
        `${earlier.until(later, { smallestUnit: 'month' })}`,
        `${earlier.until(later, { smallestUnit: 'months' })}`
      );
      equal(`${earlier.until(later, { largestUnit: 'day' })}`, `${earlier.until(later, { largestUnit: 'days' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'day' })}`, `${earlier.until(later, { smallestUnit: 'days' })}`);
      equal(`${earlier.until(later, { largestUnit: 'hour' })}`, `${earlier.until(later, { largestUnit: 'hours' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'hour' })}`, `${earlier.until(later, { smallestUnit: 'hours' })}`);
      equal(
        `${earlier.until(later, { largestUnit: 'minute' })}`,
        `${earlier.until(later, { largestUnit: 'minutes' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'minute' })}`,
        `${earlier.until(later, { smallestUnit: 'minutes' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'second' })}`,
        `${earlier.until(later, { largestUnit: 'seconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'second' })}`,
        `${earlier.until(later, { smallestUnit: 'seconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'millisecond' })}`,
        `${earlier.until(later, { largestUnit: 'milliseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'millisecond' })}`,
        `${earlier.until(later, { smallestUnit: 'milliseconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'microsecond' })}`,
        `${earlier.until(later, { largestUnit: 'microseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'microsecond' })}`,
        `${earlier.until(later, { smallestUnit: 'microseconds' })}`
      );
      equal(
        `${earlier.until(later, { largestUnit: 'nanosecond' })}`,
        `${earlier.until(later, { largestUnit: 'nanoseconds' })}`
      );
      equal(
        `${earlier.until(later, { smallestUnit: 'nanosecond' })}`,
        `${earlier.until(later, { smallestUnit: 'nanoseconds' })}`
      );
    });
    it('rounds relative to the receiver', () => {
      const dt1 = PlainDateTime.from('2019-01-01');
      const dt2 = PlainDateTime.from('2020-07-02');
      equal(`${dt1.until(dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P2Y');
      equal(`${dt2.until(dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P1Y');
    });
  });
  describe('DateTime.since()', () => {
    const dt = PlainDateTime.from('1976-11-18T15:23:30.123456789');
    it('dt.since(earlier) === earlier.until(dt)', () => {
      const earlier = PlainDateTime.from({ year: 1966, month: 3, day: 3, hour: 18 });
      equal(`${dt.since(earlier)}`, `${earlier.until(dt)}`);
    });
    it('casts argument', () => {
      equal(`${dt.since({ year: 2019, month: 10, day: 29, hour: 10 })}`, '-P15684DT18H36M29.876543211S');
      equal(`${dt.since('2019-10-29T10:46:38.271986102')}`, '-P15684DT19H23M8.148529313S');
    });
    const feb20 = PlainDateTime.from('2020-02-01T00:00');
    const feb21 = PlainDateTime.from('2021-02-01T00:00');
    it('defaults to returning days', () => {
      equal(`${feb21.since(feb20)}`, 'P366D');
      equal(`${feb21.since(feb20, { largestUnit: 'auto' })}`, 'P366D');
      equal(`${feb21.since(feb20, { largestUnit: 'days' })}`, 'P366D');
      equal(`${PlainDateTime.from('2021-02-01T00:00:00.000000001').since(feb20)}`, 'P366DT0.000000001S');
      equal(`${feb21.since(PlainDateTime.from('2020-02-01T00:00:00.000000001'))}`, 'P365DT23H59M59.999999999S');
    });
    it('can return lower or higher units', () => {
      equal(`${feb21.since(feb20, { largestUnit: 'years' })}`, 'P1Y');
      equal(`${feb21.since(feb20, { largestUnit: 'months' })}`, 'P12M');
      equal(`${feb21.since(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb21.since(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
      equal(`${feb21.since(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
    });
    it('can return subseconds', () => {
      const later = feb20.add({ days: 1, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = later.since(feb20, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = later.since(feb20, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = later.since(feb20, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('does not include higher units than necessary', () => {
      const lastFeb20 = PlainDateTime.from('2020-02-29T00:00');
      const lastFeb21 = PlainDateTime.from('2021-02-28T00:00');
      equal(`${lastFeb21.since(lastFeb20)}`, 'P365D');
      equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'months' })}`, 'P11M28D');
      equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'years' })}`, 'P11M28D');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDateTime = dt.add({ days: 42, hours: 3 });
      const weeksDifference = laterDateTime.since(dt, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = laterDateTime.since(dt, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    it('no two different calendars', () => {
      const dt1 = new PlainDateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0);
      const dt2 = new PlainDateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0, Temporal.Calendar.from('japanese'));
      throws(() => dt1.since(dt2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb21.since(feb20, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb21.since(feb20, options)}`, 'P366D'));
    });
    const earlier = PlainDateTime.from('2019-01-08T08:22:36.123456789');
    const later = PlainDateTime.from('2021-09-07T12:39:40.987654321');
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'nonsense'].forEach((smallestUnit) => {
        throws(() => later.since(earlier, { smallestUnit }), RangeError);
      });
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = [
        'years',
        'months',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds'
      ];
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => later.since(earlier, { largestUnit, smallestUnit }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y');
      equal(`${later.since(earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M');
      equal(`${later.since(earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S'],
      ['milliseconds', 'P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864198S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P140W', '-P139W'],
      ['days', 'P974D', '-P973D'],
      ['hours', 'P973DT5H', '-P973DT4H'],
      ['minutes', 'P973DT4H18M', '-P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S', '-P973DT4H17M4S'],
      ['milliseconds', 'P973DT4H17M4.865S', '-P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864198S', '-P973DT4H17M4.864197S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S', '-P973DT4H17M4.864197532S']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P140W'],
      ['days', 'P973D', '-P974D'],
      ['hours', 'P973DT4H', '-P973DT5H'],
      ['minutes', 'P973DT4H17M', '-P973DT4H18M'],
      ['seconds', 'P973DT4H17M4S', '-P973DT4H17M5S'],
      ['milliseconds', 'P973DT4H17M4.864S', '-P973DT4H17M4.865S'],
      ['microseconds', 'P973DT4H17M4.864197S', '-P973DT4H17M4.864198S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S', '-P973DT4H17M4.864197532S']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M4S'],
      ['milliseconds', 'P973DT4H17M4.864S'],
      ['microseconds', 'P973DT4H17M4.864197S'],
      ['nanoseconds', 'P973DT4H17M4.864197532S']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${later.since(earlier, { smallestUnit: 'minutes' })}`, 'P973DT4H17M');
      equal(`${later.since(earlier, { smallestUnit: 'seconds' })}`, 'P973DT4H17M4S');
    });
    it('rounds to an increment of hours', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
        'P973DT3H'
      );
    });
    it('rounds to an increment of minutes', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
        'P973DT4H30M'
      );
    });
    it('rounds to an increment of seconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M'
      );
    });
    it('rounds to an increment of milliseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.86S'
      );
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.8642S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
        'P973DT4H17M4.86419753S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement };
        assert(later.since(earlier, options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement };
          assert(later.since(earlier, options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError);
    });
    it('accepts singular units', () => {
      equal(`${later.since(earlier, { largestUnit: 'year' })}`, `${later.since(earlier, { largestUnit: 'years' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'year' })}`, `${later.since(earlier, { smallestUnit: 'years' })}`);
      equal(`${later.since(earlier, { largestUnit: 'month' })}`, `${later.since(earlier, { largestUnit: 'months' })}`);
      equal(
        `${later.since(earlier, { smallestUnit: 'month' })}`,
        `${later.since(earlier, { smallestUnit: 'months' })}`
      );
      equal(`${later.since(earlier, { largestUnit: 'day' })}`, `${later.since(earlier, { largestUnit: 'days' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'day' })}`, `${later.since(earlier, { smallestUnit: 'days' })}`);
      equal(`${later.since(earlier, { largestUnit: 'hour' })}`, `${later.since(earlier, { largestUnit: 'hours' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'hour' })}`, `${later.since(earlier, { smallestUnit: 'hours' })}`);
      equal(
        `${later.since(earlier, { largestUnit: 'minute' })}`,
        `${later.since(earlier, { largestUnit: 'minutes' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'minute' })}`,
        `${later.since(earlier, { smallestUnit: 'minutes' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'second' })}`,
        `${later.since(earlier, { largestUnit: 'seconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'second' })}`,
        `${later.since(earlier, { smallestUnit: 'seconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'millisecond' })}`,
        `${later.since(earlier, { largestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'millisecond' })}`,
        `${later.since(earlier, { smallestUnit: 'milliseconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'microsecond' })}`,
        `${later.since(earlier, { largestUnit: 'microseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'microsecond' })}`,
        `${later.since(earlier, { smallestUnit: 'microseconds' })}`
      );
      equal(
        `${later.since(earlier, { largestUnit: 'nanosecond' })}`,
        `${later.since(earlier, { largestUnit: 'nanoseconds' })}`
      );
      equal(
        `${later.since(earlier, { smallestUnit: 'nanosecond' })}`,
        `${later.since(earlier, { smallestUnit: 'nanoseconds' })}`
      );
    });
    it('rounds relative to the receiver', () => {
      const dt1 = PlainDateTime.from('2019-01-01');
      const dt2 = PlainDateTime.from('2020-07-02');
      equal(`${dt2.since(dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P1Y');
      equal(`${dt1.since(dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P2Y');
    });
  });
  describe('DateTime.round works', () => {
    const dt = PlainDateTime.from('1976-11-18T14:23:30.123456789');
    it('throws without parameter', () => {
      throws(() => dt.round(), TypeError);
    });
    it('throws without required smallestUnit parameter', () => {
      throws(() => dt.round({}), RangeError);
      throws(() => dt.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError);
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'year', 'month', 'week', 'years', 'months', 'weeks', 'nonsense'].forEach((smallestUnit) => {
        throws(() => dt.round({ smallestUnit }), RangeError);
      });
    });
    it('throws on invalid roundingMode', () => {
      throws(() => dt.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['day', '1976-11-19T00:00:00'],
      ['hour', '1976-11-18T14:00:00'],
      ['minute', '1976-11-18T14:24:00'],
      ['second', '1976-11-18T14:23:30'],
      ['millisecond', '1976-11-18T14:23:30.123'],
      ['microsecond', '1976-11-18T14:23:30.123457'],
      ['nanosecond', '1976-11-18T14:23:30.123456789']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        equal(`${dt.round({ smallestUnit, roundingMode: 'halfExpand' })}`, expected));
    });
    const incrementOneCeil = [
      ['day', '1976-11-19T00:00:00'],
      ['hour', '1976-11-18T15:00:00'],
      ['minute', '1976-11-18T14:24:00'],
      ['second', '1976-11-18T14:23:31'],
      ['millisecond', '1976-11-18T14:23:30.124'],
      ['microsecond', '1976-11-18T14:23:30.123457'],
      ['nanosecond', '1976-11-18T14:23:30.123456789']
    ];
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () => equal(`${dt.round({ smallestUnit, roundingMode: 'ceil' })}`, expected));
    });
    const incrementOneFloor = [
      ['day', '1976-11-18T00:00:00'],
      ['hour', '1976-11-18T14:00:00'],
      ['minute', '1976-11-18T14:23:00'],
      ['second', '1976-11-18T14:23:30'],
      ['millisecond', '1976-11-18T14:23:30.123'],
      ['microsecond', '1976-11-18T14:23:30.123456'],
      ['nanosecond', '1976-11-18T14:23:30.123456789']
    ];
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        equal(`${dt.round({ smallestUnit, roundingMode: 'floor' })}`, expected));
      it(`truncates to ${smallestUnit}`, () => equal(`${dt.round({ smallestUnit, roundingMode: 'trunc' })}`, expected));
    });
    it('halfExpand is the default', () => {
      equal(`${dt.round({ smallestUnit: 'minute' })}`, '1976-11-18T14:24:00');
      equal(`${dt.round({ smallestUnit: 'second' })}`, '1976-11-18T14:23:30');
    });
    it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
      const dt2 = PlainDateTime.from('-000099-12-15T12:00:00.5Z');
      const smallestUnit = 'second';
      equal(`${dt2.round({ smallestUnit, roundingMode: 'ceil' })}`, '-000099-12-15T12:00:01');
      equal(`${dt2.round({ smallestUnit, roundingMode: 'floor' })}`, '-000099-12-15T12:00:00');
      equal(`${dt2.round({ smallestUnit, roundingMode: 'trunc' })}`, '-000099-12-15T12:00:00');
      equal(`${dt2.round({ smallestUnit, roundingMode: 'halfExpand' })}`, '-000099-12-15T12:00:01');
    });
    it('rounds to an increment of hours', () => {
      equal(`${dt.round({ smallestUnit: 'hour', roundingIncrement: 4 })}`, '1976-11-18T16:00:00');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${dt.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`, '1976-11-18T14:30:00');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${dt.round({ smallestUnit: 'second', roundingIncrement: 30 })}`, '1976-11-18T14:23:30');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${dt.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12');
    });
    it('rounds to an increment of microseconds', () => {
      equal(`${dt.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12346');
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(`${dt.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`, '1976-11-18T14:23:30.12345679');
    });
    it('1 day is a valid increment', () => {
      equal(`${dt.round({ smallestUnit: 'day', roundingIncrement: 1 })}`, '1976-11-19T00:00:00');
    });
    it('valid hour increments divide into 24', () => {
      const smallestUnit = 'hour';
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        assert(dt.round({ smallestUnit, roundingIncrement }) instanceof PlainDateTime);
      });
    });
    ['minute', 'second'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          assert(dt.round({ smallestUnit, roundingIncrement }) instanceof PlainDateTime);
        });
      });
    });
    ['millisecond', 'microsecond', 'nanosecond'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          assert(dt.round({ smallestUnit, roundingIncrement }) instanceof PlainDateTime);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => dt.round({ smallestUnit: 'day', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'hour', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => dt.round({ smallestUnit: 'hour', roundingIncrement: 24 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'minute', roundingIncrement: 60 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'second', roundingIncrement: 60 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'microsecond', roundingIncrement: 1000 }), RangeError);
      throws(() => dt.round({ smallestUnit: 'nanosecond', roundingIncrement: 1000 }), RangeError);
    });
    const bal = PlainDateTime.from('1976-11-18T23:59:59.999999999');
    ['day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'].forEach((smallestUnit) => {
      it(`balances to next ${smallestUnit}`, () => {
        equal(`${bal.round({ smallestUnit })}`, '1976-11-19T00:00:00');
      });
    });
    it('accepts plural units', () => {
      assert(dt.round({ smallestUnit: 'days' }).equals(dt.round({ smallestUnit: 'day' })));
      assert(dt.round({ smallestUnit: 'hours' }).equals(dt.round({ smallestUnit: 'hour' })));
      assert(dt.round({ smallestUnit: 'minutes' }).equals(dt.round({ smallestUnit: 'minute' })));
      assert(dt.round({ smallestUnit: 'seconds' }).equals(dt.round({ smallestUnit: 'second' })));
      assert(dt.round({ smallestUnit: 'milliseconds' }).equals(dt.round({ smallestUnit: 'millisecond' })));
      assert(dt.round({ smallestUnit: 'microseconds' }).equals(dt.round({ smallestUnit: 'microsecond' })));
      assert(dt.round({ smallestUnit: 'nanoseconds' }).equals(dt.round({ smallestUnit: 'nanosecond' })));
    });
  });
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
    it('variant time separators', () => {
      equal(`${PlainDateTime.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23:00');
      equal(`${PlainDateTime.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23:00');
    });
    it('any number of decimal places', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.1');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.12');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.1234');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.12345');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.1234567');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.12345678');
      equal(`${PlainDateTime.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789');
    });
    it('variant decimal separator', () => {
      equal(`${PlainDateTime.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.12');
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
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => PlainDateTime.from({ year: 1976, month: 11, day: 18 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(`${PlainDateTime.from({ year: 1976, month: 11, day: 18 }, options)}`, '1976-11-18T00:00:00')
      );
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
    it('options may only be an object or undefined', () => {
      const dt = PlainDateTime.from('2019-10-29T10:46:38.271986102');
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => dt.toZonedDateTime('America/Sao_Paulo', badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(
          `${dt.toZonedDateTime('America/Sao_Paulo', options)}`,
          '2019-10-29T10:46:38.271986102-03:00[America/Sao_Paulo]'
        )
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
    const dt2 = PlainDateTime.from('1976-11-18T15:23:30');
    const dt3 = PlainDateTime.from('1976-11-18T15:23:30.1234');
    it('default is to emit seconds and drop trailing zeros after the decimal', () => {
      equal(dt1.toString(), '1976-11-18T15:23:00');
      equal(dt2.toString(), '1976-11-18T15:23:30');
      equal(dt3.toString(), '1976-11-18T15:23:30.1234');
    });
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
    it('truncates to minute', () => {
      [dt1, dt2, dt3].forEach((dt) => equal(dt.toString({ smallestUnit: 'minute' }), '1976-11-18T15:23'));
    });
    it('other smallestUnits are aliases for fractional digits', () => {
      equal(dt3.toString({ smallestUnit: 'second' }), dt3.toString({ fractionalSecondDigits: 0 }));
      equal(dt3.toString({ smallestUnit: 'millisecond' }), dt3.toString({ fractionalSecondDigits: 3 }));
      equal(dt3.toString({ smallestUnit: 'microsecond' }), dt3.toString({ fractionalSecondDigits: 6 }));
      equal(dt3.toString({ smallestUnit: 'nanosecond' }), dt3.toString({ fractionalSecondDigits: 9 }));
    });
    it('throws on invalid or disallowed smallestUnit', () => {
      ['era', 'year', 'month', 'day', 'hour', 'nonsense'].forEach((smallestUnit) =>
        throws(() => dt1.toString({ smallestUnit }), RangeError)
      );
    });
    it('accepts plural units', () => {
      equal(dt3.toString({ smallestUnit: 'minutes' }), dt3.toString({ smallestUnit: 'minute' }));
      equal(dt3.toString({ smallestUnit: 'seconds' }), dt3.toString({ smallestUnit: 'second' }));
      equal(dt3.toString({ smallestUnit: 'milliseconds' }), dt3.toString({ smallestUnit: 'millisecond' }));
      equal(dt3.toString({ smallestUnit: 'microseconds' }), dt3.toString({ smallestUnit: 'microsecond' }));
      equal(dt3.toString({ smallestUnit: 'nanoseconds' }), dt3.toString({ smallestUnit: 'nanosecond' }));
    });
    it('truncates or pads to 2 places', () => {
      const options = { fractionalSecondDigits: 2 };
      equal(dt1.toString(options), '1976-11-18T15:23:00.00');
      equal(dt2.toString(options), '1976-11-18T15:23:30.00');
      equal(dt3.toString(options), '1976-11-18T15:23:30.12');
    });
    it('pads to 7 places', () => {
      const options = { fractionalSecondDigits: 7 };
      equal(dt1.toString(options), '1976-11-18T15:23:00.0000000');
      equal(dt2.toString(options), '1976-11-18T15:23:30.0000000');
      equal(dt3.toString(options), '1976-11-18T15:23:30.1234000');
    });
    it('auto is the default', () => {
      [dt1, dt2, dt3].forEach((dt) => equal(dt.toString({ fractionalSecondDigits: 'auto' }), dt.toString()));
    });
    it('throws on out of range or invalid fractionalSecondDigits', () => {
      [-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
        throws(() => dt1.toString({ fractionalSecondDigits }), RangeError)
      );
    });
    it('accepts and truncates fractional fractionalSecondDigits', () => {
      equal(dt3.toString({ fractionalSecondDigits: 5.5 }), '1976-11-18T15:23:30.12340');
    });
    it('smallestUnit overrides fractionalSecondDigits', () => {
      equal(dt3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 }), '1976-11-18T15:23');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => dt1.toString({ roundingMode: 'cile' }), RangeError);
    });
    it('rounds to nearest', () => {
      equal(dt2.toString({ smallestUnit: 'minute', roundingMode: 'halfExpand' }), '1976-11-18T15:24');
      equal(dt3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' }), '1976-11-18T15:23:30.123');
    });
    it('rounds up', () => {
      equal(dt2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' }), '1976-11-18T15:24');
      equal(dt3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }), '1976-11-18T15:23:30.124');
    });
    it('rounds down', () => {
      ['floor', 'trunc'].forEach((roundingMode) => {
        equal(dt2.toString({ smallestUnit: 'minute', roundingMode }), '1976-11-18T15:23');
        equal(dt3.toString({ fractionalSecondDigits: 3, roundingMode }), '1976-11-18T15:23:30.123');
      });
    });
    it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
      const dt4 = PlainDateTime.from('-000099-12-15T12:00:00.5');
      equal(dt4.toString({ smallestUnit: 'second', roundingMode: 'floor' }), '-000099-12-15T12:00:00');
    });
    it('rounding can affect all units', () => {
      const dt5 = PlainDateTime.from('1999-12-31T23:59:59.999999999');
      equal(dt5.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }), '2000-01-01T00:00:00.00000000');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => dt1.toString(badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(dt1.toString(options), '1976-11-18T15:23:00'));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
