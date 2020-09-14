#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { after, before, describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';

describe('Userland calendar', () => {
  describe('Trivial subclass', () => {
    // For the purposes of testing, a nonsensical calendar that uses 0-based
    // month numbers, like legacy Date
    const ISO8601Calendar = Temporal.Calendar.from('iso8601').constructor;
    class ZeroBasedCalendar extends ISO8601Calendar {
      constructor() {
        super('zero-based');
      }
      dateFromFields(fields, options, constructor) {
        fields.month++;
        return super.dateFromFields(fields, options, constructor);
      }
      yearMonthFromFields(fields, options, constructor) {
        fields.month++;
        return super.yearMonthFromFields(fields, options, constructor);
      }
      monthDayFromFields(fields, options, constructor) {
        fields.month++;
        return super.monthDayFromFields(fields, options, constructor);
      }
      month(date) {
        return date.getISOFields().isoMonth - 1;
      }
    }

    const obj = new ZeroBasedCalendar();
    const date = Temporal.Date.from({ year: 2020, month: 5, day: 5, calendar: obj });
    const dt = Temporal.DateTime.from({ year: 2020, month: 5, day: 5, hour: 12, calendar: obj });
    const ym = Temporal.YearMonth.from({ year: 2020, month: 5, calendar: obj });
    const md = Temporal.MonthDay.from({ month: 5, day: 5, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'zero-based'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('zero-based'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][c=zero-based]'), RangeError);
    });
    it('Temporal.Date.from()', () => equal(`${date}`, '2020-06-05[c=zero-based]'));
    it('Temporal.Date fields', () => {
      equal(date.year, 2020);
      equal(date.month, 5);
      equal(date.day, 5);
    });
    it('date.with()', () => {
      const date2 = date.with({ month: 0 });
      equal(date2.month, 0);
    });
    it('date.withCalendar()', () => {
      const date2 = Temporal.Date.from('2020-06-05');
      assert(date2.withCalendar(obj).equals(date));
    });
    it('Temporal.DateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00[c=zero-based]'));
    it('Temporal.DateTime fields', () => {
      equal(dt.year, 2020);
      equal(dt.month, 5);
      equal(dt.day, 5);
      equal(dt.hour, 12);
      equal(dt.minute, 0);
      equal(dt.second, 0);
      equal(dt.millisecond, 0);
      equal(dt.microsecond, 0);
      equal(dt.nanosecond, 0);
    });
    it('datetime.with()', () => {
      const dt2 = dt.with({ month: 0 });
      equal(dt2.month, 0);
    });
    it('datetime.withCalendar()', () => {
      const dt2 = Temporal.DateTime.from('2020-06-05T12:00');
      assert(dt2.withCalendar(obj).equals(dt));
    });
    it('Temporal.YearMonth.from()', () => equal(`${ym}`, '2020-06-01[c=zero-based]'));
    it('Temporal.YearMonth fields', () => {
      equal(dt.year, 2020);
      equal(dt.month, 5);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ month: 0 });
      equal(ym2.month, 0);
    });
    it('Temporal.MonthDay.from()', () => equal(`${md}`, '1972-06-05[c=zero-based]'));
    it('Temporal.MonthDay fields', () => {
      equal(dt.month, 5);
      equal(dt.day, 5);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ month: 0 });
      equal(md2.month, 0);
    });
    it('timezone.getDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const instant = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getDateTimeFor(instant, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('instant.toDateTime()', () => {
      const inst = Temporal.Instant.fromEpochSeconds(0);
      const dt = inst.toDateTime('UTC', obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.now.dateTime()', () => {
      const nowDateTime = Temporal.now.dateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.now.date()', () => {
      const nowDate = Temporal.now.date(obj, 'UTC');
      equal(nowDate.calendar.id, obj.id);
    });
    describe('Making available globally', () => {
      const originalTemporalCalendarFrom = Temporal.Calendar.from;
      before(() => {
        Temporal.Calendar.from = function (item) {
          let id;
          if (item instanceof Temporal.Calendar) {
            id = item.id;
          } else {
            id = `${item}`;
            // TODO: Use Temporal.parse here to extract the ID from an ISO string
          }
          if (id === 'zero-based') return new ZeroBasedCalendar();
          return originalTemporalCalendarFrom.call(this, id);
        };
      });
      it('works for Calendar.from(id)', () => {
        const tz = Temporal.Calendar.from('zero-based');
        assert(tz instanceof ZeroBasedCalendar);
      });
      const iso = '1970-01-01T00:00+00:00[c=zero-based]';
      it.skip('works for Calendar.from(ISO string)', () => {
        const tz = Temporal.Calendar.from(iso);
        assert(tz instanceof ZeroBasedCalendar);
      });
      it('works for Date.from(iso)', () => {
        const d = Temporal.Date.from(iso);
        equal(`${d}`, '1970-01-01[c=zero-based]');
      });
      it('works for Date.from(props)', () => {
        const d = Temporal.Date.from({ year: 1970, month: 0, day: 1, calendar: 'zero-based' });
        equal(`${d}`, '1970-01-01[c=zero-based]');
      });
      it('works for Date.with', () => {
        const d1 = Temporal.Date.from('1970-02-01');
        const d2 = d1.with({ month: 0, calendar: 'zero-based' });
        equal(`${d2}`, '1970-01-01[c=zero-based]');
      });
      it('works for Date.withCalendar', () => {
        const d = Temporal.Date.from('1970-01-01');
        assert(d.withCalendar('zero-based').equals(Temporal.Date.from(iso)));
      });
      it('works for DateTime.from(iso)', () => {
        const dt = Temporal.DateTime.from(iso);
        equal(`${dt}`, '1970-01-01T00:00[c=zero-based]');
      });
      it('works for DateTime.from(props)', () => {
        const dt = Temporal.DateTime.from({ year: 1970, month: 0, day: 1, hour: 12, calendar: 'zero-based' });
        equal(`${dt}`, '1970-01-01T12:00[c=zero-based]');
      });
      it('works for DateTime.with', () => {
        const dt1 = Temporal.DateTime.from('1970-02-01T12:00');
        const dt2 = dt1.with({ month: 0, calendar: 'zero-based' });
        equal(`${dt2}`, '1970-01-01T12:00[c=zero-based]');
      });
      it('works for DateTime.withCalendar', () => {
        const dt = Temporal.DateTime.from('1970-01-01T00:00');
        assert(dt.withCalendar('zero-based').equals(Temporal.DateTime.from(iso)));
      });
      it('works for YearMonth.from(iso)', () => {
        const ym = Temporal.YearMonth.from(iso);
        equal(`${ym}`, '1970-01-01[c=zero-based]');
      });
      it('works for YearMonth.from(props)', () => {
        const ym = Temporal.YearMonth.from({ year: 1970, month: 0, calendar: 'zero-based' });
        equal(`${ym}`, '1970-01-01[c=zero-based]');
      });
      it('works for MonthDay.from(iso)', () => {
        const md = Temporal.MonthDay.from(iso);
        equal(`${md}`, '1970-01-01[c=zero-based]');
      });
      it('works for MonthDay.from(props)', () => {
        const md = Temporal.MonthDay.from({ month: 0, day: 1, calendar: 'zero-based' });
        equal(`${md}`, '1972-01-01[c=zero-based]');
      });
      it('works for TimeZone.getDateTimeFor', () => {
        const tz = Temporal.TimeZone.from('UTC');
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = tz.getDateTimeFor(inst, 'zero-based');
        equal(dt.calendar.id, 'zero-based');
      });
      it('works for Instant.toDateTime', () => {
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = inst.toDateTime('UTC', 'zero-based');
        equal(dt.calendar.id, 'zero-based');
      });
      it('works for Temporal.now.dateTime', () => {
        const nowDateTime = Temporal.now.dateTime('zero-based', 'UTC');
        equal(nowDateTime.calendar.id, 'zero-based');
      });
      it('works for Temporal.now.date', () => {
        const nowDate = Temporal.now.date('zero-based', 'UTC');
        equal(nowDate.calendar.id, 'zero-based');
      });
      after(() => {
        Temporal.Calendar.from = originalTemporalCalendarFrom;
      });
    });
  });
  describe('Trivial protocol implementation', () => {
    // For the purposes of testing, a nonsensical calendar that has 10-month
    // years and 10-day months, and the year zero is at the Unix epoch
    function decimalToISO(year, month, day, overflow) {
      if (overflow === 'constrain') {
        if (month < 1) month = 1;
        if (month > 10) month = 10;
        if (day < 1) day = 1;
        if (day > 10) day = 10;
      } else if (overflow === 'reject') {
        if (month < 1 || month > 10 || day < 1 || day > 10) {
          throw new RangeError('invalid value');
        }
      }
      const days = year * 100 + (month - 1) * 10 + (day - 1);
      return new Temporal.Date(1970, 1, 1).add({ days });
    }
    function isoToDecimal(date) {
      const { isoYear, isoMonth, isoDay } = date.getISOFields();
      const isoDate = new Temporal.Date(isoYear, isoMonth, isoDay);
      let { days } = isoDate.difference(new Temporal.Date(1970, 1, 1), { largestUnit: 'days' });
      let year = Math.floor(days / 100);
      if (isoYear < 1970) year *= -1;
      days %= 100;
      return { year, days };
    }
    const obj = {
      get id() {
        return this.toString();
      },
      toString() {
        return 'decimal';
      },
      dateFromFields(fields, options, constructor) {
        const { overflow = 'constrain' } = options ? options : {};
        const isoDate = decimalToISO(fields.year, fields.month, fields.day, overflow);
        return new constructor(isoDate.year, isoDate.month, isoDate.day, this);
      },
      yearMonthFromFields(fields, options, constructor) {
        const { overflow = 'constrain' } = options ? options : {};
        const isoDate = decimalToISO(fields.year, fields.month, 1, overflow);
        return new constructor(isoDate.year, isoDate.month, this, isoDate.day);
      },
      monthDayFromFields(fields, options, constructor) {
        const { overflow = 'constrain' } = options ? options : {};
        const isoDate = decimalToISO(0, fields.month, fields.day, overflow);
        return new constructor(isoDate.month, isoDate.day, this, isoDate.year);
      },
      year(date) {
        return isoToDecimal(date).year;
      },
      month(date) {
        const { days } = isoToDecimal(date);
        return Math.floor(days / 10) + 1;
      },
      day(date) {
        const { days } = isoToDecimal(date);
        return (days % 10) + 1;
      },
      era() {
        return undefined;
      }
    };

    const date = Temporal.Date.from({ year: 184, month: 2, day: 9, calendar: obj });
    const dt = Temporal.DateTime.from({ year: 184, month: 2, day: 9, hour: 12, calendar: obj });
    const ym = Temporal.YearMonth.from({ year: 184, month: 2, calendar: obj });
    const md = Temporal.MonthDay.from({ month: 2, day: 9, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'decimal'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('decimal'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][c=decimal]'), RangeError);
    });
    it('Temporal.Date.from()', () => equal(`${date}`, '2020-06-05[c=decimal]'));
    it('Temporal.Date fields', () => {
      equal(date.year, 184);
      equal(date.month, 2);
      equal(date.day, 9);
    });
    it('date.with()', () => {
      const date2 = date.with({ year: 0 });
      equal(date2.year, 0);
    });
    it('date.withCalendar()', () => {
      const date2 = Temporal.Date.from('2020-06-05T12:00');
      assert(date2.withCalendar(obj).equals(date));
    });
    it('Temporal.DateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00[c=decimal]'));
    it('Temporal.DateTime fields', () => {
      equal(dt.year, 184);
      equal(dt.month, 2);
      equal(dt.day, 9);
      equal(dt.hour, 12);
      equal(dt.minute, 0);
      equal(dt.second, 0);
      equal(dt.millisecond, 0);
      equal(dt.microsecond, 0);
      equal(dt.nanosecond, 0);
    });
    it('datetime.with()', () => {
      const dt2 = dt.with({ year: 0 });
      equal(dt2.year, 0);
    });
    it('datetime.withCalendar()', () => {
      const dt2 = Temporal.DateTime.from('2020-06-05T12:00');
      assert(dt2.withCalendar(obj).equals(dt));
    });
    it('Temporal.YearMonth.from()', () => equal(`${ym}`, '2020-05-28[c=decimal]'));
    it('Temporal.YearMonth fields', () => {
      equal(dt.year, 184);
      equal(dt.month, 2);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ year: 0 });
      equal(ym2.year, 0);
    });
    it('Temporal.MonthDay.from()', () => equal(`${md}`, '1970-01-19[c=decimal]'));
    it('Temporal.MonthDay fields', () => {
      equal(dt.month, 2);
      equal(dt.day, 9);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ month: 1 });
      equal(md2.month, 1);
    });
    it('timezone.getDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const inst = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getDateTimeFor(inst, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('instant.toDateTime()', () => {
      const inst = Temporal.Instant.fromEpochSeconds(0);
      const dt = inst.toDateTime('UTC', obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.now.dateTime()', () => {
      const nowDateTime = Temporal.now.dateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.now.date()', () => {
      const nowDate = Temporal.now.date(obj, 'UTC');
      equal(nowDate.calendar.id, obj.id);
    });
    describe('Making available globally', () => {
      const originalTemporalCalendarFrom = Temporal.Calendar.from;
      before(() => {
        Temporal.Calendar.from = function (item) {
          let id;
          if (typeof item === 'object' && item) {
            id = item.id;
          } else {
            id = `${item}`;
            // TODO: Use Temporal.parse here to extract the ID from an ISO string
          }
          if (id === 'decimal') return obj;
          return originalTemporalCalendarFrom.call(this, id);
        };
      });
      it('works for Calendar.from(id)', () => {
        const cal = Temporal.Calendar.from('decimal');
        assert(Object.is(cal, obj));
      });
      const iso = '1970-01-01T00:00+00:00[c=decimal]';
      it.skip('works for Calendar.from(ISO string)', () => {
        const cal = Temporal.Calendar.from(iso);
        assert(Object.is(cal, obj));
      });
      it('works for Date.from(iso)', () => {
        const d = Temporal.Date.from(iso);
        equal(`${d}`, '1970-01-01[c=decimal]');
      });
      it('works for Date.from(props)', () => {
        const d = Temporal.Date.from({ year: 0, month: 1, day: 1, calendar: 'decimal' });
        equal(`${d}`, '1970-01-01[c=decimal]');
      });
      it('works for Date.with', () => {
        const d1 = Temporal.Date.from('1970-01-01');
        const d2 = d1.with({ month: 2, calendar: 'decimal' });
        equal(`${d2}`, '1970-01-11[c=decimal]');
      });
      it('works for Date.withCalendar', () => {
        const d = Temporal.Date.from('1970-01-01');
        assert(d.withCalendar('decimal').equals(Temporal.Date.from(iso)));
      });
      it('works for DateTime.from(iso)', () => {
        const dt = Temporal.DateTime.from(iso);
        equal(`${dt}`, '1970-01-01T00:00[c=decimal]');
      });
      it('works for DateTime.from(props)', () => {
        const dt = Temporal.DateTime.from({ year: 0, month: 1, day: 1, hour: 12, calendar: 'decimal' });
        equal(`${dt}`, '1970-01-01T12:00[c=decimal]');
      });
      it('works for DateTime.with', () => {
        const dt1 = Temporal.DateTime.from('1970-01-01T12:00');
        const dt2 = dt1.with({ month: 2, calendar: 'decimal' });
        equal(`${dt2}`, '1970-01-11T12:00[c=decimal]');
      });
      it('works for DateTime.withCalendar', () => {
        const dt = Temporal.DateTime.from('1970-01-01T00:00');
        assert(dt.withCalendar('decimal').equals(Temporal.DateTime.from(iso)));
      });
      it('works for YearMonth.from(iso)', () => {
        const ym = Temporal.YearMonth.from(iso);
        equal(`${ym}`, '1970-01-01[c=decimal]');
      });
      it('works for YearMonth.from(props)', () => {
        const ym = Temporal.YearMonth.from({ year: 0, month: 1, calendar: 'decimal' });
        equal(`${ym}`, '1970-01-01[c=decimal]');
      });
      it('works for MonthDay.from(iso)', () => {
        const md = Temporal.MonthDay.from(iso);
        equal(`${md}`, '1970-01-01[c=decimal]');
      });
      it('works for MonthDay.from(props)', () => {
        const md = Temporal.MonthDay.from({ month: 1, day: 1, calendar: 'decimal' });
        equal(`${md}`, '1970-01-01[c=decimal]');
      });
      it('works for TimeZone.getDateTimeFor', () => {
        const tz = Temporal.TimeZone.from('UTC');
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = tz.getDateTimeFor(inst, 'decimal');
        equal(dt.calendar.id, 'decimal');
      });
      it('works for Instant.toDateTime', () => {
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = inst.toDateTime('UTC', 'decimal');
        equal(dt.calendar.id, 'decimal');
      });
      it('works for Temporal.now.dateTime', () => {
        const nowDateTime = Temporal.now.dateTime('decimal', 'UTC');
        equal(nowDateTime.calendar.id, 'decimal');
      });
      it('works for Temporal.now.date', () => {
        const nowDate = Temporal.now.date('decimal', 'UTC');
        equal(nowDate.calendar.id, 'decimal');
      });
      after(() => {
        Temporal.Calendar.from = originalTemporalCalendarFrom;
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
