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
    class ZeroBasedCalendar extends Temporal.Calendar {
      constructor() {
        super('iso8601');
      }
      toString() {
        return 'zero-based';
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
    const date = Temporal.PlainDate.from({ year: 2020, month: 5, day: 5, calendar: obj });
    const dt = Temporal.PlainDateTime.from({ year: 2020, month: 5, day: 5, hour: 12, calendar: obj });
    const ym = Temporal.PlainYearMonth.from({ year: 2020, month: 5, calendar: obj });
    const md = Temporal.PlainMonthDay.from({ month: 5, day: 5, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'zero-based'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('zero-based'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][c=zero-based]'), RangeError);
    });
    it('Temporal.PlainDate.from()', () => equal(`${date}`, '2020-06-05[c=zero-based]'));
    it('Temporal.PlainDate fields', () => {
      equal(date.year, 2020);
      equal(date.month, 5);
      equal(date.day, 5);
    });
    it('date.with()', () => {
      const date2 = date.with({ month: 0 });
      equal(date2.month, 0);
    });
    it('date.withCalendar()', () => {
      const date2 = Temporal.PlainDate.from('2020-06-05');
      assert(date2.withCalendar(obj).equals(date));
    });
    it('Temporal.PlainDateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00:00[c=zero-based]'));
    it('Temporal.PlainDateTime fields', () => {
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
      const dt2 = Temporal.PlainDateTime.from('2020-06-05T12:00');
      assert(dt2.withCalendar(obj).equals(dt));
    });
    it('Temporal.PlainYearMonth.from()', () => equal(`${ym}`, '2020-06-01[c=zero-based]'));
    it('Temporal.PlainYearMonth fields', () => {
      equal(dt.year, 2020);
      equal(dt.month, 5);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ month: 0 });
      equal(ym2.month, 0);
    });
    it('Temporal.PlainMonthDay.from()', () => equal(`${md}`, '1972-06-05[c=zero-based]'));
    it('Temporal.PlainMonthDay fields', () => {
      equal(dt.month, 5);
      equal(dt.day, 5);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ month: 0 });
      equal(md2.month, 0);
    });
    it('timezone.getPlainDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const instant = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getPlainDateTimeFor(instant, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.now.plainDateTime()', () => {
      const nowDateTime = Temporal.now.plainDateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.now.plainDate()', () => {
      const nowDate = Temporal.now.plainDate(obj, 'UTC');
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
        const d = Temporal.PlainDate.from(iso);
        equal(`${d}`, '1970-01-01[c=zero-based]');
      });
      it('works for Date.from(props)', () => {
        const d = Temporal.PlainDate.from({ year: 1970, month: 0, day: 1, calendar: 'zero-based' });
        equal(`${d}`, '1970-01-01[c=zero-based]');
      });
      it('works for Date.withCalendar', () => {
        const d = Temporal.PlainDate.from('1970-01-01');
        assert(d.withCalendar('zero-based').equals(Temporal.PlainDate.from(iso)));
      });
      it('works for DateTime.from(iso)', () => {
        const dt = Temporal.PlainDateTime.from(iso);
        equal(`${dt}`, '1970-01-01T00:00:00[c=zero-based]');
      });
      it('works for DateTime.from(props)', () => {
        const dt = Temporal.PlainDateTime.from({ year: 1970, month: 0, day: 1, hour: 12, calendar: 'zero-based' });
        equal(`${dt}`, '1970-01-01T12:00:00[c=zero-based]');
      });
      it('works for DateTime.withCalendar', () => {
        const dt = Temporal.PlainDateTime.from('1970-01-01T00:00');
        assert(dt.withCalendar('zero-based').equals(Temporal.PlainDateTime.from(iso)));
      });
      it('works for YearMonth.from(iso)', () => {
        const ym = Temporal.PlainYearMonth.from(iso);
        equal(`${ym}`, '1970-01-01[c=zero-based]');
      });
      it('works for YearMonth.from(props)', () => {
        const ym = Temporal.PlainYearMonth.from({ year: 1970, month: 0, calendar: 'zero-based' });
        equal(`${ym}`, '1970-01-01[c=zero-based]');
      });
      it('works for MonthDay.from(iso)', () => {
        const md = Temporal.PlainMonthDay.from(iso);
        equal(`${md}`, '1970-01-01[c=zero-based]');
      });
      it('works for MonthDay.from(props)', () => {
        const md = Temporal.PlainMonthDay.from({ month: 0, day: 1, calendar: 'zero-based' });
        equal(`${md}`, '1972-01-01[c=zero-based]');
      });
      it('works for TimeZone.getPlainDateTimeFor', () => {
        const tz = Temporal.TimeZone.from('UTC');
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = tz.getPlainDateTimeFor(inst, 'zero-based');
        equal(dt.calendar.id, 'zero-based');
      });
      it('works for Temporal.now.plainDateTime', () => {
        const nowDateTime = Temporal.now.plainDateTime('zero-based', 'UTC');
        equal(nowDateTime.calendar.id, 'zero-based');
      });
      it('works for Temporal.now.plainDate', () => {
        const nowDate = Temporal.now.plainDate('zero-based', 'UTC');
        equal(nowDate.calendar.id, 'zero-based');
      });
      after(() => {
        Temporal.Calendar.from = originalTemporalCalendarFrom;
      });
    });
  });
  describe('Trivial protocol implementation', () => {
    // For the purposes of testing, a nonsensical calendar that has 10-month
    // years, 10-day months, and the year zero is at the Unix epoch.
    function decimalToISO(year, month, day, overflow = 'constrain') {
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
      return new Temporal.PlainDate(1970, 1, 1, 'iso8601').add({ days });
    }
    function isoToDecimal(date) {
      let { isoYear, isoMonth, isoDay } = date.getISOFields();
      let isoDate = new Temporal.PlainDate(isoYear, isoMonth, isoDay);
      let { days } = isoDate.since(new Temporal.PlainDate(1970, 1, 1), {
        largestUnit: 'days'
      });
      let year = Math.floor(days / 100);
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
        const isoDateTime = decimalToISO(fields.year, fields.month, fields.day, 0, 0, 0, overflow);
        return new constructor(isoDateTime.year, isoDateTime.month, isoDateTime.day, this);
      },
      yearMonthFromFields(fields, options, constructor) {
        const { overflow = 'constrain' } = options ? options : {};
        const isoDate = decimalToISO(fields.year, fields.month, 1, 0, 0, 0, overflow);
        return new constructor(isoDate.year, isoDate.month, this, isoDate.day);
      },
      monthDayFromFields(fields, options, constructor) {
        const { overflow = 'constrain' } = options ? options : {};
        const isoDate = decimalToISO(0, fields.month, fields.day, 0, 0, 0, overflow);
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
      hour(time) {
        const { seconds } = isoToDecimal(time);
        return Math.floor(seconds / 100);
      },
      minute(time) {
        const { seconds } = isoToDecimal(time);
        return Math.floor(seconds / 10) % 10;
      },
      second(time) {
        const { seconds } = isoToDecimal(time);
        return seconds % 10;
      },
      millisecond(time) {
        const { isoMillisecond } = time.getISOFields();
        return isoMillisecond;
      },
      microsecond(time) {
        const { isoMicrosecond } = time.getISOFields();
        return isoMicrosecond;
      },
      nanosecond(time) {
        const { isoNanosecond } = time.getISOFields();
        return isoNanosecond;
      },
      era() {
        return undefined;
      },
      fields(fields) {
        return fields.slice();
      }
    };

    const date = Temporal.PlainDate.from({ year: 184, month: 2, day: 9, calendar: obj });
    const dt = Temporal.PlainDateTime.from({ year: 184, month: 2, day: 9, hour: 12, calendar: obj });
    const ym = Temporal.PlainYearMonth.from({ year: 184, month: 2, calendar: obj });
    const md = Temporal.PlainMonthDay.from({ month: 2, day: 9, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'decimal'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('decimal'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][c=decimal]'), RangeError);
    });
    it('Temporal.PlainDate.from()', () => equal(`${date}`, '2020-06-05[c=decimal]'));
    it('Temporal.PlainDate fields', () => {
      equal(date.year, 184);
      equal(date.month, 2);
      equal(date.day, 9);
    });
    it('date.with()', () => {
      const date2 = date.with({ year: 0 });
      equal(date2.year, 0);
    });
    it('date.withCalendar()', () => {
      const date2 = Temporal.PlainDate.from('2020-06-05T12:00');
      assert(date2.withCalendar(obj).equals(date));
    });
    it('Temporal.PlainDateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00:00[c=decimal]'));
    it('Temporal.PlainDateTime fields', () => {
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
      const dt2 = Temporal.PlainDateTime.from('2020-06-05T12:00');
      assert(dt2.withCalendar(obj).equals(dt));
    });
    it('Temporal.PlainYearMonth.from()', () => equal(`${ym}`, '2020-05-28[c=decimal]'));
    it('Temporal.PlainYearMonth fields', () => {
      equal(dt.year, 184);
      equal(dt.month, 2);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ year: 0 });
      equal(ym2.year, 0);
    });
    it('Temporal.PlainMonthDay.from()', () => equal(`${md}`, '1970-01-19[c=decimal]'));
    it('Temporal.PlainMonthDay fields', () => {
      equal(dt.month, 2);
      equal(dt.day, 9);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ month: 1 });
      equal(md2.month, 1);
    });
    it('timezone.getPlainDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const inst = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getPlainDateTimeFor(inst, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.now.plainDateTime()', () => {
      const nowDateTime = Temporal.now.plainDateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.now.plainDate()', () => {
      const nowDate = Temporal.now.plainDate(obj, 'UTC');
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
        const d = Temporal.PlainDate.from(iso);
        equal(`${d}`, '1970-01-01[c=decimal]');
      });
      it('works for Date.from(props)', () => {
        const d = Temporal.PlainDate.from({ year: 0, month: 1, day: 1, calendar: 'decimal' });
        equal(`${d}`, '1970-01-01[c=decimal]');
      });
      it('works for Date.withCalendar', () => {
        const d = Temporal.PlainDate.from('1970-01-01');
        assert(d.withCalendar('decimal').equals(Temporal.PlainDate.from(iso)));
      });
      it('works for DateTime.from(iso)', () => {
        const dt = Temporal.PlainDateTime.from(iso);
        equal(`${dt}`, '1970-01-01T00:00:00[c=decimal]');
      });
      it('works for DateTime.from(props)', () => {
        const dt = Temporal.PlainDateTime.from({ year: 0, month: 1, day: 1, hour: 12, calendar: 'decimal' });
        equal(`${dt}`, '1970-01-01T12:00:00[c=decimal]');
      });
      it('works for DateTime.withCalendar', () => {
        const dt = Temporal.PlainDateTime.from('1970-01-01T00:00');
        assert(dt.withCalendar('decimal').equals(Temporal.PlainDateTime.from(iso)));
      });
      it('works for YearMonth.from(iso)', () => {
        const ym = Temporal.PlainYearMonth.from(iso);
        equal(`${ym}`, '1970-01-01[c=decimal]');
      });
      it('works for YearMonth.from(props)', () => {
        const ym = Temporal.PlainYearMonth.from({ year: 0, month: 1, calendar: 'decimal' });
        equal(`${ym}`, '1970-01-01[c=decimal]');
      });
      it('works for MonthDay.from(iso)', () => {
        const md = Temporal.PlainMonthDay.from(iso);
        equal(`${md}`, '1970-01-01[c=decimal]');
      });
      it('works for MonthDay.from(props)', () => {
        const md = Temporal.PlainMonthDay.from({ month: 1, day: 1, calendar: 'decimal' });
        equal(`${md}`, '1970-01-01[c=decimal]');
      });
      it('works for TimeZone.getPlainDateTimeFor', () => {
        const tz = Temporal.TimeZone.from('UTC');
        const inst = Temporal.Instant.fromEpochSeconds(0);
        const dt = tz.getPlainDateTimeFor(inst, 'decimal');
        equal(dt.calendar.id, 'decimal');
      });
      it('works for Temporal.now.plainDateTime', () => {
        const nowDateTime = Temporal.now.plainDateTime('decimal', 'UTC');
        equal(nowDateTime.calendar.id, 'decimal');
      });
      it('works for Temporal.now.plainDate', () => {
        const nowDate = Temporal.now.plainDate('decimal', 'UTC');
        equal(nowDate.calendar.id, 'decimal');
      });
      after(() => {
        Temporal.Calendar.from = originalTemporalCalendarFrom;
      });
    });
  });
  describe('calendar with extra fields', () => {
    // Contrived example of a calendar identical to the ISO calendar except that
    // months are numbered 1, 2, 3, and each year has four seasons of 3 months
    // numbered 1, 2, 3, 4.
    class SeasonCalendar extends Temporal.Calendar {
      constructor() {
        super('iso8601');
        Object.defineProperty(Temporal.PlainDateTime.prototype, 'season', {
          get() {
            return this.calendar.season(this);
          },
          configurable: true
        });
        Object.defineProperty(Temporal.PlainDate.prototype, 'season', {
          get() {
            return this.calendar.season(this);
          },
          configurable: true
        });
        Object.defineProperty(Temporal.PlainYearMonth.prototype, 'season', {
          get() {
            return this.calendar.season(this);
          },
          configurable: true
        });
        Object.defineProperty(Temporal.PlainMonthDay.prototype, 'season', {
          get() {
            return this.calendar.season(this);
          },
          configurable: true
        });
      }
      toString() {
        return 'season';
      }
      month(date) {
        const { isoMonth } = date.getISOFields();
        return ((isoMonth - 1) % 3) + 1;
      }
      season(date) {
        const { isoMonth } = date.getISOFields();
        return Math.floor((isoMonth - 1) / 3) + 1;
      }
      dateFromFields(fields, options, constructor) {
        const isoMonth = (fields.season - 1) * 3 + fields.month;
        return super.dateFromFields({ ...fields, month: isoMonth }, options, constructor);
      }
      yearMonthFromFields(fields, options, constructor) {
        const isoMonth = (fields.season - 1) * 3 + fields.month;
        return super.yearMonthFromFields({ ...fields, month: isoMonth }, options, constructor);
      }
      monthDayFromFields(fields, options, constructor) {
        const isoMonth = (fields.season - 1) * 3 + fields.month;
        return super.monthDayFromFields({ ...fields, month: isoMonth }, options, constructor);
      }
      fields(fields) {
        fields = fields.slice();
        if (fields.includes('month')) fields.push('season');
        return fields;
      }
    }
    const calendar = new SeasonCalendar();
    const datetime = new Temporal.PlainDateTime(2019, 9, 15, 0, 0, 0, 0, 0, 0, calendar);
    const date = new Temporal.PlainDate(2019, 9, 15, calendar);
    const yearmonth = new Temporal.PlainYearMonth(2019, 9, calendar);
    const monthday = new Temporal.PlainMonthDay(9, 15, calendar);
    it('property getter works', () => {
      equal(datetime.season, 3);
      equal(datetime.month, 3);
      equal(date.season, 3);
      equal(date.month, 3);
      equal(yearmonth.season, 3);
      equal(yearmonth.month, 3);
      equal(monthday.season, 3);
      equal(monthday.month, 3);
    });
    it('accepts season in from()', () => {
      equal(
        `${Temporal.PlainDateTime.from({ year: 2019, season: 3, month: 3, day: 15, calendar })}`,
        '2019-09-15T00:00:00[c=season]'
      );
      equal(
        `${Temporal.PlainDate.from({ year: 2019, season: 3, month: 3, day: 15, calendar })}`,
        '2019-09-15[c=season]'
      );
      equal(`${Temporal.PlainYearMonth.from({ year: 2019, season: 3, month: 3, calendar })}`, '2019-09-01[c=season]');
      equal(`${Temporal.PlainMonthDay.from({ season: 3, month: 3, day: 15, calendar })}`, '1972-09-15[c=season]');
    });
    it('accepts season in with()', () => {
      equal(`${datetime.with({ season: 2 })}`, '2019-06-15T00:00:00[c=season]');
      equal(`${date.with({ season: 2 })}`, '2019-06-15[c=season]');
      equal(`${yearmonth.with({ season: 2 })}`, '2019-06-01[c=season]');
      equal(`${monthday.with({ season: 2 })}`, '1972-06-15[c=season]');
    });
    it('translates month correctly in with()', () => {
      equal(`${datetime.with({ month: 2 })}`, '2019-08-15T00:00:00[c=season]');
      equal(`${date.with({ month: 2 })}`, '2019-08-15[c=season]');
      equal(`${yearmonth.with({ month: 2 })}`, '2019-08-01[c=season]');
      equal(`${monthday.with({ month: 2 })}`, '1972-08-15[c=season]');
    });
    after(() => {
      delete Temporal.PlainDateTime.prototype.season;
      delete Temporal.PlainDate.prototype.season;
      delete Temporal.PlainYearMonth.prototype.season;
      delete Temporal.PlainMonthDay.prototype.season;
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
