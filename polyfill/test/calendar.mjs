#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { Calendar } = Temporal;

describe('Calendar', () => {
  const iso = Calendar.from('iso8601');
  describe('Calendar.from()', () => {
    describe('from identifier', () => {
      // 402
      test('gregory');
      test('japanese');
      function test(id) {
        const calendar = Calendar.from(id);
        it(`Calendar.from(${id}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${id}) has the correct ID`, () => equal(calendar.id, id));
      }
    });
    describe('Calendar.from(ISO string)', () => {
      test('1994-11-05T08:15:30-05:00[u-ca=gregory]', 'gregory');
      test('1994-11-05T13:15:30Z[u-ca=japanese]', 'japanese');
      function test(isoString, id) {
        const calendar = Calendar.from(isoString);
        it(`Calendar.from(${isoString}) is a calendar`, () => assert(calendar instanceof Calendar));
        it(`Calendar.from(${isoString}) has ID ${id}`, () => equal(calendar.id, id));
      }
    });
  });
  describe('Calendar.daysInWeek()', () => {
    const res = 7;
    it('accepts Date', () => equal(iso.daysInWeek(Temporal.PlainDate.from('1994-11-05')), res));
    it('accepts DateTime', () => equal(iso.daysInWeek(Temporal.PlainDateTime.from('1994-11-05T08:15:30')), res));
    it('casts argument', () => {
      equal(iso.daysInWeek({ year: 1994, month: 11, day: 5 }), res);
      equal(iso.daysInWeek('1994-11-05'), res);
    });
    it('object must contain at least the required properties', () => {
      throws(() => iso.daysInWeek({ year: 2000 }), TypeError);
    });
  });
  describe('Calendar.daysInMonth()', () => {
    const res = 30;
    it('accepts Date', () => equal(iso.daysInMonth(Temporal.PlainDate.from('1994-11-05')), res));
    it('accepts DateTime', () => equal(iso.daysInMonth(Temporal.PlainDateTime.from('1994-11-05T08:15:30')), res));
    it('accepts YearMonth', () => equal(iso.daysInMonth(Temporal.PlainYearMonth.from('1994-11')), res));
    it('casts argument', () => {
      equal(iso.daysInMonth({ year: 1994, month: 11, day: 5 }), res);
      equal(iso.daysInMonth('1994-11-05'), res);
    });
    it('object must contain at least the required properties', () => {
      throws(() => iso.daysInMonth({ year: 2000 }), TypeError);
    });
  });
  describe('Calendar.daysInYear()', () => {
    const res = 365;
    it('accepts Date', () => equal(iso.daysInYear(Temporal.PlainDate.from('1994-11-05')), res));
    it('accepts DateTime', () => equal(iso.daysInYear(Temporal.PlainDateTime.from('1994-11-05T08:15:30')), res));
    it('accepts YearMonth', () => equal(iso.daysInYear(Temporal.PlainYearMonth.from('1994-11')), res));
    it('casts argument', () => {
      equal(iso.daysInYear({ year: 1994, month: 11, day: 5 }), res);
      equal(iso.daysInYear('1994-11-05'), res);
    });
    it('object must contain at least the required properties', () => {
      throws(() => iso.daysInYear({ month: 11 }), TypeError);
    });
  });
  describe('Calendar.monthsInYear()', () => {
    const res = 12;
    it('accepts Date', () => equal(iso.monthsInYear(Temporal.PlainDate.from('1994-11-05')), res));
    it('accepts DateTime', () => equal(iso.monthsInYear(Temporal.PlainDateTime.from('1994-11-05T08:15:30')), res));
    it('accepts YearMonth', () => equal(iso.monthsInYear(Temporal.PlainYearMonth.from('1994-11')), res));
    it('casts argument', () => {
      equal(iso.monthsInYear({ year: 1994, month: 11, day: 5 }), res);
      equal(iso.monthsInYear('1994-11-05'), res);
    });
    it('object must contain at least the required properties', () => {
      throws(() => iso.monthsInYear({ month: 11 }), TypeError);
    });
  });
  describe('Calendar.inLeapYear()', () => {
    const res = false;
    it('accepts Date', () => equal(iso.inLeapYear(Temporal.PlainDate.from('1994-11-05')), res));
    it('accepts DateTime', () => equal(iso.inLeapYear(Temporal.PlainDateTime.from('1994-11-05T08:15:30')), res));
    it('accepts YearMonth', () => equal(iso.inLeapYear(Temporal.PlainYearMonth.from('1994-11')), res));
    it('casts argument', () => {
      equal(iso.inLeapYear({ year: 1994, month: 11, day: 5 }), res);
      equal(iso.inLeapYear('1994-11-05'), res);
    });
    it('object must contain at least the required properties', () => {
      throws(() => iso.inLeapYear({ month: 11 }), TypeError);
    });
  });
  describe('Calendar.dateAdd()', () => {
    const date = Temporal.PlainDate.from('1994-11-05');
    const duration = Temporal.Duration.from({ months: 1, weeks: 1 });
    it('casts date argument', () => {
      equal(
        `${iso.dateAdd(Temporal.PlainDateTime.from('1994-11-05T08:15:30'), duration, {}, Temporal.PlainDate)}`,
        '1994-12-12'
      );
      equal(`${iso.dateAdd({ year: 1994, month: 11, day: 5 }, duration, {}, Temporal.PlainDate)}`, '1994-12-12');
      equal(`${iso.dateAdd('1994-11-05', duration, {}, Temporal.PlainDate)}`, '1994-12-12');
    });
    it('date object must contain at least the required properties', () => {
      throws(() => iso.dateAdd({ month: 11 }, duration, {}, Temporal.PlainDate), TypeError);
    });
    it('casts duration argument', () => {
      equal(`${iso.dateAdd(date, { months: 1, weeks: 1 }, {}, Temporal.PlainDate)}`, '1994-12-12');
      equal(`${iso.dateAdd(date, 'P1M1W', {}, Temporal.PlainDate)}`, '1994-12-12');
    });
    it('duration object must contain at least one correctly-spelled property', () => {
      throws(() => iso.dateAdd(date, { month: 1 }, {}, Temporal.PlainDate), TypeError);
    });
  });
  describe('Calendar.dateAdd() (negative duration)', () => {
    const duration = Temporal.Duration.from({ months: 1, weeks: 1 }).negated();
    it('casts date argument', () => {
      equal(`${iso.dateAdd(Temporal.PlainDateTime.from('1994-11-05T08:15:30'), duration, {})}`, '1994-09-28');
      equal(`${iso.dateAdd({ year: 1994, month: 11, day: 5 }, duration, {})}`, '1994-09-28');
      equal(`${iso.dateAdd('1994-11-05', duration, {})}`, '1994-09-28');
    });
  });
  describe('Calendar.dateUntil()', () => {
    const date1 = Temporal.PlainDate.from('1999-09-03');
    const date2 = Temporal.PlainDate.from('2000-01-01');
    it('casts first argument', () => {
      equal(`${iso.dateUntil(Temporal.PlainDateTime.from('1999-09-03T08:15:30'), date2, {})}`, 'P120D');
      equal(`${iso.dateUntil({ year: 1999, month: 9, day: 3 }, date2, {})}`, 'P120D');
      equal(`${iso.dateUntil('1999-09-03', date2, {})}`, 'P120D');
    });
    it('casts second argument', () => {
      equal(`${iso.dateUntil(date1, Temporal.PlainDateTime.from('2000-01-01T08:15:30'), {})}`, 'P120D');
      equal(`${iso.dateUntil(date1, { year: 2000, month: 1, day: 1 }, {})}`, 'P120D');
      equal(`${iso.dateUntil(date1, '2000-01-01', {})}`, 'P120D');
    });
    it('objects must contain at least the required properties', () => {
      throws(() => iso.dateUntil({ month: 11 }, date2, {}), TypeError);
      throws(() => iso.dateUntil(date1, { month: 11 }, {}), TypeError);
    });
  });
});
describe('Built-in calendars (not standardized yet)', () => {
  describe('gregory', () => {
    it('era CE', () => {
      const date = Temporal.PlainDate.from('1999-12-31[u-ca=gregory]');
      equal(date.era, 'ce');
      equal(date.eraYear, 1999);
      equal(date.year, 1999);
    });
    it('era BCE', () => {
      const date = Temporal.PlainDate.from('-000001-12-31[u-ca=gregory]');
      equal(date.era, 'bce');
      equal(date.eraYear, 2);
      equal(date.year, -1);
    });
    it('can create from fields with era CE', () => {
      const date = Temporal.PlainDate.from({ era: 'ce', eraYear: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('era CE is the default', () => {
      const date = Temporal.PlainDate.from({ year: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('can create from fields with era BCE', () => {
      const date = Temporal.PlainDate.from({ era: 'bce', eraYear: 2, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '-000001-12-31[u-ca=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
