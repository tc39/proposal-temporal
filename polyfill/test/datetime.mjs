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
const { DateTime } = Temporal;

describe('DateTime', () => {
  describe('Structure', () => {
    it('DateTime is a Function', () => {
      equal(typeof DateTime, 'function');
    });
    it('DateTime has a prototype', () => {
      assert(DateTime.prototype);
      equal(typeof DateTime.prototype, 'object');
    });
    describe('DateTime.prototype', () => {
      it('DateTime.prototype has year', () => {
        assert('year' in DateTime.prototype);
      });
      it('DateTime.prototype has month', () => {
        assert('month' in DateTime.prototype);
      });
      it('DateTime.prototype has day', () => {
        assert('day' in DateTime.prototype);
      });
      it('DateTime.prototype has hour', () => {
        assert('hour' in DateTime.prototype);
      });
      it('DateTime.prototype has minute', () => {
        assert('minute' in DateTime.prototype);
      });
      it('DateTime.prototype has second', () => {
        assert('second' in DateTime.prototype);
      });
      it('DateTime.prototype has millisecond', () => {
        assert('millisecond' in DateTime.prototype);
      });
      it('DateTime.prototype has microsecond', () => {
        assert('microsecond' in DateTime.prototype);
      });
      it('DateTime.prototype has nanosecond', () => {
        assert('nanosecond' in DateTime.prototype);
      });
      it('DateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in DateTime.prototype);
      });
      it('DateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in DateTime.prototype);
      });
      it('DateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in DateTime.prototype);
      });
      it('DateTime.prototype.with is a Function', () => {
        equal(typeof DateTime.prototype.with, 'function');
      });
      it('DateTime.prototype.plus is a Function', () => {
        equal(typeof DateTime.prototype.plus, 'function');
      });
      it('DateTime.prototype.minus is a Function', () => {
        equal(typeof DateTime.prototype.minus, 'function');
      });
      it('DateTime.prototype.difference is a Function', () => {
        equal(typeof DateTime.prototype.difference, 'function');
      });
      it('DateTime.prototype.equals is a Function', () => {
        equal(typeof DateTime.prototype.equals, 'function');
      });
      it('DateTime.prototype.toAbsolute is a Function', () => {
        equal(typeof DateTime.prototype.toAbsolute, 'function');
      });
      it('DateTime.prototype.toDate is a Function', () => {
        equal(typeof DateTime.prototype.toDate, 'function');
      });
      it('DateTime.prototype.toTime is a Function', () => {
        equal(typeof DateTime.prototype.toTime, 'function');
      });
      it('DateTime.prototype.getFields is a Function', () => {
        equal(typeof DateTime.prototype.getFields, 'function');
      });
      it('DateTime.prototype.getISOCalendarFields is a Function', () => {
        equal(typeof DateTime.prototype.getISOCalendarFields, 'function');
      });
      it('DateTime.prototype.toString is a Function', () => {
        equal(typeof DateTime.prototype.toString, 'function');
      });
      it('DateTime.prototype.toJSON is a Function', () => {
        equal(typeof DateTime.prototype.toJSON, 'function');
      });
    });
    it('DateTime.from is a Function', () => {
      equal(typeof DateTime.from, 'function');
    });
    it('DateTime.compare is a Function', () => {
      equal(typeof DateTime.compare, 'function');
    });
  });
  describe('Construction', () => {
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789, calendar)', () => {
      let datetime;
      const calendar = Temporal.Calendar.from('iso8601');
      it('datetime can be constructed', () => {
        datetime = new DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789, calendar);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
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
      it('`${datetime}` is 1976-11-18T15:23:30.123456789', () => equal(`${datetime}`, '1976-11-18T15:23:30.123456789'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123, 456)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new DateTime(1976, 11, 18, 15, 23, 30, 123, 456);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
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
      it('`${datetime}` is 1976-11-18T15:23:30.123456', () => equal(`${datetime}`, '1976-11-18T15:23:30.123456'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30, 123)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new DateTime(1976, 11, 18, 15, 23, 30, 123);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
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
      it('`${datetime}` is 1976-11-18T15:23:30.123', () => equal(`${datetime}`, '1976-11-18T15:23:30.123'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23, 30)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new DateTime(1976, 11, 18, 15, 23, 30);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
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
      it('`${datetime}` is 1976-11-18T15:23:30', () => equal(`${datetime}`, '1976-11-18T15:23:30'));
    });
    describe('new DateTime(1976, 11, 18, 15, 23)', () => {
      let datetime;
      it('datetime can be constructed', () => {
        datetime = new DateTime(1976, 11, 18, 15, 23);
        assert(datetime);
        equal(typeof datetime, 'object');
      });
      it('datetime.year is 1976', () => equal(datetime.year, 1976));
      it('datetime.month is 11', () => equal(datetime.month, 11));
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
      it('`${datetime}` is 1976-11-18T15:23', () => equal(`${datetime}`, '1976-11-18T15:23'));
    });
    describe('new DateTime(1976, 11, 18, 15)', () => {
      const datetime = new DateTime(1976, 11, 18, 15);
      it('`${datetime}` is 1976-11-18T15:00', () => equal(`${datetime}`, '1976-11-18T15:00'));
    });
    describe('new DateTime(1976, 11, 18)', () => {
      const datetime = new DateTime(1976, 11, 18);
      it('`${datetime}` is 1976-11-18T00:00', () => equal(`${datetime}`, '1976-11-18T00:00'));
    });
  });
  describe('.with manipulation', () => {
    const datetime = new DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it('datetime.with({ year: 2019 } works', () => {
      equal(`${datetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789');
    });
    it('datetime.with({ month: 5 } works', () => {
      equal(`${datetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789');
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
    it('datetime.with(time) works', () => {
      const noon = Temporal.Time.from({ hour: 12 });
      equal(`${datetime.with(noon)}`, '1976-11-18T12:00');
    });
    it('datetime.with(date) works', () => {
      const date = Temporal.Date.from('1995-04-07');
      equal(`${datetime.with(date)}`, '1995-04-07T15:23:30.123456789');
    });
    it('datetime.with(monthDay) works', () => {
      const md = Temporal.MonthDay.from('01-01');
      equal(`${datetime.with(md)}`, '1976-01-01T15:23:30.123456789');
    });
    it('datetime.with(yearMonth) works', () => {
      const ym = Temporal.YearMonth.from('1977-10');
      equal(`${datetime.with(ym)}`, '1977-10-18T15:23:30.123456789');
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => datetime.with({ day: 5 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('DateTime.compare() works', () => {
    const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
    const dt2 = DateTime.from('2019-10-29T10:46:38.271986102');
    it('equal', () => equal(DateTime.compare(dt1, dt1), 0));
    it('smaller/larger', () => equal(DateTime.compare(dt1, dt2), -1));
    it('larger/smaller', () => equal(DateTime.compare(dt2, dt1), 1));
    it("doesn't cast first argument", () => {
      throws(() => DateTime.compare({ year: 1976, month: 11, day: 18, hour: 15 }, dt2), TypeError);
      throws(() => DateTime.compare('1976-11-18T15:23:30.123456789', dt2), TypeError);
    });
    it("doesn't cast second argument", () => {
      throws(() => DateTime.compare(dt1, { year: 2019, month: 10, day: 29, hour: 10 }), TypeError);
      throws(() => DateTime.compare('2019-10-29T10:46:38.271986102', dt2), TypeError);
    });
  });
  describe('DateTime.equals() works', () => {
    const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
    const dt2 = DateTime.from('2019-10-29T10:46:38.271986102');
    it('equal', () => assert(dt1.equals(dt1)));
    it('unequal', () => assert(!dt1.equals(dt2)));
    it("doesn't cast argument", () => {
      throws(() => dt2.equals({ year: 1976, month: 11, day: 18, hour: 15 }), TypeError);
      throws(() => dt2.equals('1976-11-18T15:23:30.123456789'), TypeError);
    });
  });
  describe("Comparison operators don't work", () => {
    const dt1 = DateTime.from('1963-02-13T09:36:29.123456789');
    const dt1again = DateTime.from('1963-02-13T09:36:29.123456789');
    const dt2 = DateTime.from('1976-11-18T15:23:30.123456789');
    it('=== is object equality', () => equal(dt1, dt1));
    it('!== is object equality', () => notEqual(dt1, dt1again));
    it('<', () => throws(() => dt1 < dt2));
    it('>', () => throws(() => dt1 > dt2));
    it('<=', () => throws(() => dt1 <= dt2));
    it('>=', () => throws(() => dt1 >= dt2));
  });
  describe('date/time maths', () => {
    const earlier = DateTime.from('1976-11-18T15:23:30.123456789');
    const later = DateTime.from('2019-10-29T10:46:38.271986102');
    ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].forEach((largestUnit) => {
      const diff = later.difference(earlier, { largestUnit });
      it(`(${earlier}).difference(${later}) == (${later}).difference(${earlier}).negated()`, () =>
        equal(`${earlier.difference(later, { largestUnit })}`, `${diff.negated()}`));
      it(`(${earlier}).plus(${diff}) == (${later})`, () => assert(earlier.plus(diff).equals(later)));
      it(`(${later}).minus(${diff}) == (${earlier})`, () => assert(later.minus(diff).equals(earlier)));
      it('symmetrical with regard to negative durations', () => {
        assert(earlier.minus(diff.negated()).equals(later));
        assert(later.plus(diff.negated()).equals(earlier));
      });
    });
  });
  describe('date/time maths: hours overflow', () => {
    it('minus result', () => {
      const later = DateTime.from('2019-10-29T10:46:38.271986102');
      const earlier = later.minus({ hours: 12 });
      equal(`${earlier}`, '2019-10-28T22:46:38.271986102');
    });
    it('plus result', () => {
      const earlier = DateTime.from('2020-05-31T23:12:38.271986102');
      const later = earlier.plus({ hours: 2 });
      equal(`${later}`, '2020-06-01T01:12:38.271986102');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${DateTime.from('2019-10-29T10:46:38.271986102').plus({ hours: -12 })}`, '2019-10-28T22:46:38.271986102');
      equal(`${DateTime.from('2020-05-31T23:12:38.271986102').minus({ hours: -2 })}`, '2020-06-01T01:12:38.271986102');
    });
  });
  describe('DateTime.plus() works', () => {
    const jan31 = DateTime.from('2020-01-31T15:00');
    it('constrain when ambiguous result', () => {
      equal(`${jan31.plus({ months: 1 })}`, '2020-02-29T15:00');
      equal(`${jan31.plus({ months: 1 }, { disambiguation: 'constrain' })}`, '2020-02-29T15:00');
    });
    it('symmetrical with regard to negative durations in the time part', () => {
      equal(`${jan31.plus({ minutes: -30 })}`, '2020-01-31T14:30');
      equal(`${jan31.plus({ seconds: -30 })}`, '2020-01-31T14:59:30');
    });
    it('throw when ambiguous result with reject', () => {
      throws(() => jan31.plus({ months: 1 }, { disambiguation: 'reject' }), RangeError);
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => DateTime.from('2019-11-18T15:00').plus({ months: 1 }, { disambiguation }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((disambiguation) =>
        throws(() => jan31.plus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('date.minus() works', () => {
    const mar31 = DateTime.from('2020-03-31T15:00');
    it('constrain when ambiguous result', () => {
      equal(`${mar31.minus({ months: 1 })}`, '2020-02-29T15:00');
      equal(`${mar31.minus({ months: 1 }, { disambiguation: 'constrain' })}`, '2020-02-29T15:00');
    });
    it('symmetrical with regard to negative durations in the time part', () => {
      equal(`${mar31.minus({ minutes: -30 })}`, '2020-03-31T15:30');
      equal(`${mar31.minus({ seconds: -30 })}`, '2020-03-31T15:00:30');
    });
    it('throw when ambiguous result with reject', () => {
      throws(() => mar31.minus({ months: 1 }, { disambiguation: 'reject' }), RangeError);
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => DateTime.from('2019-11-18T15:00').minus({ months: 1 }, { disambiguation }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((disambiguation) =>
        throws(() => mar31.plus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('DateTime.difference()', () => {
    const dt = DateTime.from('1976-11-18T15:23:30.123456789');
    it("doesn't cast argument", () => {
      throws(() => dt.difference({ year: 2019, month: 10, day: 29, hour: 10 }), TypeError);
      throws(() => dt.difference('2019-10-29T10:46:38.271986102'), TypeError);
    });
    const feb20 = DateTime.from('2020-02-01T00:00');
    const feb21 = DateTime.from('2021-02-01T00:00');
    it('defaults to returning days', () => {
      equal(`${feb21.difference(feb20)}`, 'P366D');
      equal(`${feb21.difference(feb20, { largestUnit: 'days' })}`, 'P366D');
      equal(`${DateTime.from('2021-02-01T00:00:00.000000001').difference(feb20)}`, 'P366DT0.000000001S');
      equal(`${feb21.difference(DateTime.from('2020-02-01T00:00:00.000000001'))}`, 'P365DT23H59M59.999999999S');
    });
    it('can return lower or higher units', () => {
      equal(`${feb21.difference(feb20, { largestUnit: 'years' })}`, 'P1Y');
      equal(`${feb21.difference(feb20, { largestUnit: 'months' })}`, 'P12M');
      equal(`${feb21.difference(feb20, { largestUnit: 'hours' })}`, 'PT8784H');
      equal(`${feb21.difference(feb20, { largestUnit: 'minutes' })}`, 'PT527040M');
      equal(`${feb21.difference(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S');
    });
    it('can return subseconds', () => {
      const later = feb20.plus({ days: 1, milliseconds: 250, microseconds: 250, nanoseconds: 250 });

      const msDiff = later.difference(feb20, { largestUnit: 'milliseconds' });
      equal(msDiff.seconds, 0);
      equal(msDiff.milliseconds, 86400250);
      equal(msDiff.microseconds, 250);
      equal(msDiff.nanoseconds, 250);

      const µsDiff = later.difference(feb20, { largestUnit: 'microseconds' });
      equal(µsDiff.milliseconds, 0);
      equal(µsDiff.microseconds, 86400250250);
      equal(µsDiff.nanoseconds, 250);

      const nsDiff = later.difference(feb20, { largestUnit: 'nanoseconds' });
      equal(nsDiff.microseconds, 0);
      equal(nsDiff.nanoseconds, 86400250250250);
    });
    it('does not include higher units than necessary', () => {
      const lastFeb20 = DateTime.from('2020-02-29T00:00');
      const lastFeb21 = DateTime.from('2021-02-28T00:00');
      equal(`${lastFeb21.difference(lastFeb20)}`, 'P365D');
      equal(`${lastFeb21.difference(lastFeb20, { largestUnit: 'months' })}`, 'P11M30D');
      equal(`${lastFeb21.difference(lastFeb20, { largestUnit: 'years' })}`, 'P11M30D');
    });
    it('weeks and months are mutually exclusive', () => {
      const laterDateTime = dt.plus({ days: 42, hours: 3 });
      const weeksDifference = laterDateTime.difference(dt, { largestUnit: 'weeks' });
      notEqual(weeksDifference.weeks, 0);
      equal(weeksDifference.months, 0);
      const monthsDifference = laterDateTime.difference(dt, { largestUnit: 'months' });
      equal(monthsDifference.weeks, 0);
      notEqual(monthsDifference.months, 0);
    });
    it('no two different calendars', () => {
      const dt1 = new DateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0);
      const dt2 = new DateTime(2000, 1, 1, 0, 0, 0, 0, 0, 0, Temporal.Calendar.from('japanese'));
      throws(() => dt1.difference(dt2), RangeError);
    });
  });
  describe('DateTime.from() works', () => {
    it('DateTime.from("1976-11-18 15:23:30")', () =>
      equal(`${DateTime.from('1976-11-18 15:23:30')}`, '1976-11-18T15:23:30'));
    it('DateTime.from("1976-11-18 15:23:30.001")', () =>
      equal(`${DateTime.from('1976-11-18 15:23:30.001')}`, '1976-11-18T15:23:30.001'));
    it('DateTime.from("1976-11-18 15:23:30.001123")', () =>
      equal(`${DateTime.from('1976-11-18 15:23:30.001123')}`, '1976-11-18T15:23:30.001123'));
    it('DateTime.from("1976-11-18 15:23:30.001123456")', () =>
      equal(`${DateTime.from('1976-11-18 15:23:30.001123456')}`, '1976-11-18T15:23:30.001123456'));
    it('DateTime.from(1976-11-18) == 1976-11-18', () => {
      const orig = new DateTime(1976, 11, 18, 15, 23, 20, 123, 456, 789);
      const actual = DateTime.from(orig);
      notEqual(actual, orig);
    });
    it('DateTime.from({ year: 1976, month: 11, day: 18 }) == 1976-11-18T00:00', () =>
      equal(`${DateTime.from({ year: 1976, month: 11, day: 18 })}`, '1976-11-18T00:00'));
    it('DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 }) == 1976-11-18T00:00:00.123', () =>
      equal(`${DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 })}`, '1976-11-18T00:00:00.123'));
    it('DateTime.from({ month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }) throws', () =>
      throws(
        () => DateTime.from({ month: 11, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }),
        TypeError
      ));
    it('DateTime.from({}) throws', () => throws(() => DateTime.from({}), TypeError));
    it('DateTime.from(required prop undefined) throws', () =>
      throws(() => DateTime.from({ year: undefined, month: 11, day: 18 }), TypeError));
    it('DateTime.from(ISO string leap second) is constrained', () => {
      equal(`${DateTime.from('2016-12-31T23:59:60')}`, '2016-12-31T23:59:59');
    });
    it('DateTime.from(number) is converted to string', () =>
      assert(DateTime.from(19761118).equals(DateTime.from('19761118'))));
    describe('Disambiguation', () => {
      const bad = { year: 2019, month: 1, day: 32 };
      it('reject', () => throws(() => DateTime.from(bad, { disambiguation: 'reject' }), RangeError));
      it('constrain', () => {
        equal(`${DateTime.from(bad)}`, '2019-01-31T00:00');
        equal(`${DateTime.from(bad, { disambiguation: 'constrain' })}`, '2019-01-31T00:00');
      });
      it('throw when bad disambiguation', () => {
        [new DateTime(1976, 11, 18, 15, 23), { year: 2019, month: 1, day: 1 }, '2019-01-31T00:00'].forEach((input) => {
          ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
            throws(() => DateTime.from(input, { disambiguation }), RangeError)
          );
        });
      });
      const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60 };
      it('reject leap second', () => throws(() => DateTime.from(leap, { disambiguation: 'reject' }), RangeError));
      it('constrain leap second', () => equal(`${DateTime.from(leap)}`, '2016-12-31T23:59:59'));
    });
    it('variant time separators', () => {
      equal(`${DateTime.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23');
      equal(`${DateTime.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23');
    });
    it('any number of decimal places', () => {
      equal(`${DateTime.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120');
      equal(`${DateTime.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123');
      equal(`${DateTime.from('1976-11-18T15:23:30.1234Z')}`, '1976-11-18T15:23:30.123400');
      equal(`${DateTime.from('1976-11-18T15:23:30.12345Z')}`, '1976-11-18T15:23:30.123450');
      equal(`${DateTime.from('1976-11-18T15:23:30.123456Z')}`, '1976-11-18T15:23:30.123456');
      equal(`${DateTime.from('1976-11-18T15:23:30.1234567Z')}`, '1976-11-18T15:23:30.123456700');
      equal(`${DateTime.from('1976-11-18T15:23:30.12345678Z')}`, '1976-11-18T15:23:30.123456780');
      equal(`${DateTime.from('1976-11-18T15:23:30.123456789Z')}`, '1976-11-18T15:23:30.123456789');
    });
    it('variant decimal separator', () => {
      equal(`${DateTime.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120');
    });
    it('variant minus sign', () => {
      equal(`${DateTime.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T15:23:30.120');
      equal(`${DateTime.from('\u2212009999-11-18T15:23:30.12')}`, '-009999-11-18T15:23:30.120');
    });
    it('mixture of basic and extended format', () => {
      equal(`${DateTime.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('19761118T152330.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100');
      equal(`${DateTime.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100');
    });
    it('optional parts', () => {
      equal(`${DateTime.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30');
      equal(`${DateTime.from('1976-11-18T15')}`, '1976-11-18T15:00');
      equal(`${DateTime.from('1976-11-18')}`, '1976-11-18T00:00');
    });
    it('no junk at end of string', () => throws(() => DateTime.from('1976-11-18T15:23:30.123456789junk'), RangeError));
  });
  describe('DateTime.toAbsolute() works', () => {
    it('recent date', () => {
      const dt = DateTime.from('2019-10-29T10:46:38.271986102');
      const tz = Temporal.TimeZone.from('Europe/Amsterdam');
      equal(`${dt.toAbsolute(tz)}`, '2019-10-29T09:46:38.271986102Z');
      equal(`${dt.toAbsolute('Europe/Amsterdam')}`, '2019-10-29T09:46:38.271986102Z');
    });
    it('year ≤ 99', () => {
      const dt = DateTime.from('+000098-10-29T10:46:38.271986102');
      equal(`${dt.toAbsolute('+06:00')}`, '+000098-10-29T04:46:38.271986102Z');
    });
    it('year < 1', () => {
      let dt = DateTime.from('+000000-10-29T10:46:38.271986102');
      equal(`${dt.toAbsolute('+06:00')}`, '+000000-10-29T04:46:38.271986102Z');
      dt = DateTime.from('-001000-10-29T10:46:38.271986102');
      equal(`${dt.toAbsolute('+06:00')}`, '-001000-10-29T04:46:38.271986102Z');
    });
    it('year 0 leap day', () => {
      const dt = Temporal.DateTime.from('+000000-02-29T00:00');
      const tz = Temporal.TimeZone.from('Europe/London');
      equal(`${dt.toAbsolute(tz)}`, '+000000-02-29T00:01:15Z');
    });
    it('datetime with multiple absolute - Fall DST in Brazil', () => {
      const dt = DateTime.from('2019-02-16T23:45');
      equal(`${dt.toAbsolute('America/Sao_Paulo')}`, '2019-02-17T01:45Z');
      equal(`${dt.toAbsolute('America/Sao_Paulo', { disambiguation: 'compatible' })}`, '2019-02-17T01:45Z');
      equal(`${dt.toAbsolute('America/Sao_Paulo', { disambiguation: 'earlier' })}`, '2019-02-17T01:45Z');
      equal(`${dt.toAbsolute('America/Sao_Paulo', { disambiguation: 'later' })}`, '2019-02-17T02:45Z');
      throws(() => dt.toAbsolute('America/Sao_Paulo', { disambiguation: 'reject' }), RangeError);
    });
    it('datetime with multiple absolute - Spring DST in Los Angeles', () => {
      const dt = DateTime.from('2020-03-08T02:30');
      equal(`${dt.toAbsolute('America/Los_Angeles')}`, '2020-03-08T10:30Z');
      equal(`${dt.toAbsolute('America/Los_Angeles', { disambiguation: 'compatible' })}`, '2020-03-08T10:30Z');
      equal(`${dt.toAbsolute('America/Los_Angeles', { disambiguation: 'earlier' })}`, '2020-03-08T09:30Z');
      equal(`${dt.toAbsolute('America/Los_Angeles', { disambiguation: 'later' })}`, '2020-03-08T10:30Z');
      throws(() => dt.toAbsolute('America/Los_Angeles', { disambiguation: 'reject' }), RangeError);
    });
    it('throws on bad disambiguation', () => {
      ['', 'EARLIER', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => DateTime.from('2019-10-29T10:46').toAbsolute('UTC', { disambiguation }), RangeError)
      );
    });
  });
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new DateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 0), RangeError);
      throws(() => new DateTime(275760, 9, 14, 0, 0, 0, 0, 0, 0), RangeError);
      equal(`${new DateTime(-271821, 4, 19, 0, 0, 0, 0, 0, 1)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${new DateTime(275760, 9, 13, 23, 59, 59, 999, 999, 999)}`, '+275760-09-13T23:59:59.999999999');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 19 };
      const tooLate = { year: 275760, month: 9, day: 14 };
      ['reject', 'constrain'].forEach((disambiguation) => {
        [tooEarly, tooLate].forEach((props) => {
          throws(() => DateTime.from(props, { disambiguation }), RangeError);
        });
      });
      equal(
        `${DateTime.from({ year: -271821, month: 4, day: 19, nanosecond: 1 })}`,
        '-271821-04-19T00:00:00.000000001'
      );
      equal(
        `${DateTime.from({
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
      ['reject', 'constrain'].forEach((disambiguation) => {
        ['-271821-04-19T00:00', '+275760-09-14T00:00'].forEach((str) => {
          throws(() => DateTime.from(str, { disambiguation }), RangeError);
        });
      });
      equal(`${DateTime.from('-271821-04-19T00:00:00.000000001')}`, '-271821-04-19T00:00:00.000000001');
      equal(`${DateTime.from('+275760-09-13T23:59:59.999999999')}`, '+275760-09-13T23:59:59.999999999');
    });
    it('converting from Absolute', () => {
      const min = Temporal.Absolute.from('-271821-04-20T00:00Z');
      const max = Temporal.Absolute.from('+275760-09-13T00:00Z');
      equal(`${min.toDateTime('-23:59')}`, '-271821-04-19T00:01');
      equal(`${max.toDateTime('+23:59')}`, '+275760-09-13T23:59');
    });
    it('converting from Date and Time', () => {
      const midnight = Temporal.Time.from('00:00');
      const firstNs = Temporal.Time.from('00:00:00.000000001');
      const lastNs = Temporal.Time.from('23:59:59.999999999');
      const min = Temporal.Date.from('-271821-04-19');
      const max = Temporal.Date.from('+275760-09-13');
      throws(() => min.toDateTime(midnight), RangeError);
      throws(() => midnight.toDateTime(min), RangeError);
      equal(`${min.toDateTime(firstNs)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${firstNs.toDateTime(min)}`, '-271821-04-19T00:00:00.000000001');
      equal(`${max.toDateTime(lastNs)}`, '+275760-09-13T23:59:59.999999999');
      equal(`${lastNs.toDateTime(max)}`, '+275760-09-13T23:59:59.999999999');
    });
    it('adding and subtracting beyond limit', () => {
      const min = DateTime.from('-271821-04-19T00:00:00.000000001');
      const max = DateTime.from('+275760-09-13T23:59:59.999999999');
      ['reject', 'constrain'].forEach((disambiguation) => {
        throws(() => min.minus({ nanoseconds: 1 }, { disambiguation }), RangeError);
        throws(() => max.plus({ nanoseconds: 1 }, { disambiguation }), RangeError);
      });
    });
  });
  describe('DateTime.toAbsolute() works', () => {
    const dt = DateTime.from('1976-11-18T15:23:30.123456789');
    it('without parameter', () => {
      throws(() => dt.toAbsolute(), RangeError);
    });
    it('time zone parameter UTC', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const abs = dt.toAbsolute(tz);
      equal(`${abs}`, '1976-11-18T15:23:30.123456789Z');
    });
    it('time zone parameter non-UTC', () => {
      const tz = Temporal.TimeZone.from('America/New_York');
      const abs = dt.toAbsolute(tz);
      equal(`${abs}`, '1976-11-18T20:23:30.123456789Z');
    });
  });
  describe('dateTime.getFields() works', () => {
    const calendar = Temporal.Calendar.from('iso8601');
    const dt1 = DateTime.from({
      year: 1976,
      month: 11,
      day: 18,
      hour: 15,
      minute: 23,
      second: 30,
      millisecond: 123,
      microsecond: 456,
      nanosecond: 789,
      calendar
    });
    const fields = dt1.getFields();
    it('fields', () => {
      equal(fields.year, 1976);
      equal(fields.month, 11);
      equal(fields.day, 18);
      equal(fields.hour, 15);
      equal(fields.minute, 23);
      equal(fields.second, 30);
      equal(fields.millisecond, 123);
      equal(fields.microsecond, 456);
      equal(fields.nanosecond, 789);
      equal(fields.calendar, calendar);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.year, 1976);
      equal(fields2.month, 11);
      equal(fields2.day, 18);
      equal(fields2.hour, 15);
      equal(fields2.minute, 23);
      equal(fields2.second, 30);
      equal(fields2.millisecond, 123);
      equal(fields2.microsecond, 456);
      equal(fields2.nanosecond, 789);
      equal(fields2.calendar, calendar);
    });
    it('as input to from()', () => {
      const dt2 = DateTime.from(fields);
      equal(DateTime.compare(dt1, dt2), 0);
    });
    it('as input to with()', () => {
      const dt2 = DateTime.from('2019-06-30').with(fields);
      equal(DateTime.compare(dt1, dt2), 0);
    });
  });
  describe('dateTime.getISOCalendarFields() works', () => {
    const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
    const fields = dt1.getISOCalendarFields();
    it('fields', () => {
      equal(fields.year, 1976);
      equal(fields.month, 11);
      equal(fields.day, 18);
      equal(fields.hour, 15);
      equal(fields.minute, 23);
      equal(fields.second, 30);
      equal(fields.millisecond, 123);
      equal(fields.microsecond, 456);
      equal(fields.nanosecond, 789);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.year, 1976);
      equal(fields2.month, 11);
      equal(fields2.day, 18);
      equal(fields2.hour, 15);
      equal(fields2.minute, 23);
      equal(fields2.second, 30);
      equal(fields2.millisecond, 123);
      equal(fields2.microsecond, 456);
      equal(fields2.nanosecond, 789);
    });
    it('as input to from()', () => {
      const dt2 = DateTime.from(fields);
      equal(DateTime.compare(dt1, dt2), 0);
    });
    it('as input to with()', () => {
      const dt2 = DateTime.from('2019-06-30').with(fields);
      equal(DateTime.compare(dt1, dt2), 0);
    });
  });
  describe('dateTime.withCalendar()', () => {
    const dt1 = DateTime.from('1976-11-18T15:23:30.123456789');
    it('works', () => {
      const calendar = Temporal.Calendar.from('iso8601');
      equal(`${dt1.withCalendar(calendar)}`, '1976-11-18T15:23:30.123456789');
    });
    it('casts its argument', () => {
      equal(`${dt1.withCalendar('iso8601')}`, '1976-11-18T15:23:30.123456789');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
