#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { after, before, describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'tc39-temporal';

describe('Userland calendar', () => {
  describe('Trivial subclass', () => {
    // For the purposes of testing, a nonsensical calendar that uses 0-based
    // month numbers, like legacy Date
    const ISO8601Calendar = Temporal.Calendar.from('iso8601').constructor;
    class ZeroBasedCalendar extends ISO8601Calendar {
      constructor() {
        super('zerobased');
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
        return date.getISOCalendarFields().month - 1;
      }
    }

    const obj = new ZeroBasedCalendar();
    const date = Temporal.Date.from({ year: 2020, month: 5, day: 5, calendar: obj });
    const dt = Temporal.DateTime.from({ year: 2020, month: 5, day: 5, hour: 12, calendar: obj });
    const ym = Temporal.YearMonth.from({ year: 2020, month: 5, calendar: obj });
    const md = Temporal.MonthDay.from({ month: 5, day: 5, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'zerobased'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('zerobased'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][c=zerobased]'), RangeError);
    });
    it('Temporal.Date.from()', () => equal(`${date}`, '2020-06-05[c=zerobased]'));
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
    it('Temporal.DateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00[c=zerobased]'));
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
    it('Temporal.YearMonth.from()', () => equal(`${ym}`, '2020-06-01[c=zerobased]'));
    it('Temporal.YearMonth fields', () => {
      equal(dt.year, 2020);
      equal(dt.month, 5);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ month: 0 });
      equal(ym2.month, 0);
    });
    it('Temporal.MonthDay.from()', () => equal(`${md}`, '1972-06-05[c=zerobased]'));
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
      const abs = Temporal.Absolute.fromEpochSeconds(0);
      const dt = tz.getDateTimeFor(abs, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('absolute.inTimeZone()', () => {
      const abs = Temporal.Absolute.fromEpochSeconds(0);
      const dt = abs.inTimeZone('UTC', obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.now.dateTime()', () => {
      const nowDateTime = Temporal.now.dateTime('UTC', obj);
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.now.date()', () => {
      const nowDate = Temporal.now.date('UTC', obj);
      equal(nowDate.calendar.id, obj.id);
    });
    describe('Making available globally', () => {
      const originalTemporalCalendarFrom = Temporal.Calendar.from;
      before(() => {
        Temporal.Calendar.from = function(item) {
          let id;
          if (item instanceof Temporal.Calendar) {
            id = item.id;
          } else {
            id = `${item}`;
            // TODO: Use Temporal.parse here to extract the ID from an ISO string
          }
          if (id === 'zerobased') return new ZeroBasedCalendar();
          return originalTemporalCalendarFrom.call(this, id);
        };
      });
      it('works for Calendar.from(id)', () => {
        const tz = Temporal.Calendar.from('zerobased');
        assert(tz instanceof ZeroBasedCalendar);
      });
      const iso = '1970-01-01T00:00+00:00[c=zerobased]';
      it.skip('works for Calendar.from(ISO string)', () => {
        const tz = Temporal.Calendar.from(iso);
        assert(tz instanceof ZeroBasedCalendar);
      });
      it('works for Date.from(iso)', () => {
        const d = Temporal.Date.from(iso);
        equal(`${d}`, '1970-01-01[c=zerobased]');
      });
      it('works for Date.from(props)', () => {
        const d = Temporal.Date.from({ year: 1970, month: 0, day: 1, calendar: 'zerobased' });
        equal(`${d}`, '1970-01-01[c=zerobased]');
      });
      it('works for Date.with', () => {
        const d1 = Temporal.Date.from('1970-02-01');
        const d2 = d1.with({ month: 0, calendar: 'zerobased' });
        equal(`${d2}`, '1970-01-01[c=zerobased]');
      });
      it('works for Date.withCalendar', () => {
        const d = Temporal.Date.from('1970-01-01');
        assert(d.withCalendar('zerobased').equals(Temporal.Date.from(iso)));
      });
      it('works for DateTime.from(iso)', () => {
        const dt = Temporal.DateTime.from(iso);
        equal(`${dt}`, '1970-01-01T00:00[c=zerobased]');
      });
      it('works for DateTime.from(props)', () => {
        const dt = Temporal.DateTime.from({ year: 1970, month: 0, day: 1, hour: 12, calendar: 'zerobased' });
        equal(`${dt}`, '1970-01-01T12:00[c=zerobased]');
      });
      it('works for DateTime.with', () => {
        const dt1 = Temporal.DateTime.from('1970-02-01T12:00');
        const dt2 = dt1.with({ month: 0, calendar: 'zerobased' });
        equal(`${dt2}`, '1970-01-01T12:00[c=zerobased]');
      });
      it('works for DateTime.withCalendar', () => {
        const dt = Temporal.DateTime.from('1970-01-01T00:00');
        assert(dt.withCalendar('zerobased').equals(Temporal.DateTime.from(iso)));
      });
      it('works for YearMonth.from(iso)', () => {
        const ym = Temporal.YearMonth.from(iso);
        equal(`${ym}`, '1970-01-01[c=zerobased]');
      });
      it('works for YearMonth.from(props)', () => {
        const ym = Temporal.YearMonth.from({ year: 1970, month: 0, calendar: 'zerobased' });
        equal(`${ym}`, '1970-01-01[c=zerobased]');
      });
      it('works for MonthDay.from(iso)', () => {
        const md = Temporal.MonthDay.from(iso);
        equal(`${md}`, '1970-01-01[c=zerobased]');
      });
      it('works for MonthDay.from(props)', () => {
        const md = Temporal.MonthDay.from({ month: 0, day: 1, calendar: 'zerobased' });
        equal(`${md}`, '1972-01-01[c=zerobased]');
      });
      it('works for TimeZone.getDateTimeFor', () => {
        const tz = Temporal.TimeZone.from('UTC');
        const abs = Temporal.Absolute.fromEpochSeconds(0);
        const dt = tz.getDateTimeFor(abs, 'zerobased');
        equal(dt.calendar.id, 'zerobased');
      });
      it('works for Absolute.inTimeZone', () => {
        const abs = Temporal.Absolute.fromEpochSeconds(0);
        const dt = abs.inTimeZone('UTC', 'zerobased');
        equal(dt.calendar.id, 'zerobased');
      });
      it('works for Temporal.now.dateTime', () => {
        const nowDateTime = Temporal.now.dateTime('UTC', 'zerobased');
        equal(nowDateTime.calendar.id, 'zerobased');
      });
      it('works for Temporal.now.date', () => {
        const nowDate = Temporal.now.date('UTC', 'zerobased');
        equal(nowDate.calendar.id, 'zerobased');
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
