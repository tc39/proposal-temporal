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
    // For the purposes of testing, a nonsensical calendar that uses 2-based
    // month numbers, instead of 1-based
    class TwoBasedCalendar extends Temporal.Calendar {
      constructor() {
        super('iso8601');
      }
      toString() {
        return 'two-based';
      }
      dateFromFields(fields, options) {
        let { year, month, monthCode, day } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        return super.dateFromFields({ year, monthCode: `M${(month - 1).toString().padStart(2, '0')}`, day }, options);
      }
      yearMonthFromFields(fields, options) {
        let { year, month, monthCode } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        return super.yearMonthFromFields({ year, monthCode: `M${(month - 1).toString().padStart(2, '0')}` }, options);
      }
      monthDayFromFields(fields, options) {
        let { month, monthCode, day } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        return super.monthDayFromFields({ monthCode: `M${(month - 1).toString().padStart(2, '0')}`, day }, options);
      }
      month(date) {
        return date.getISOFields().isoMonth + 1;
      }
      monthCode(date) {
        return `M${this.month(date).toString().padStart(2, '0')}`;
      }
    }

    const obj = new TwoBasedCalendar();
    const date = Temporal.PlainDate.from({ year: 2020, month: 5, day: 5, calendar: obj });
    const dt = Temporal.PlainDateTime.from({ year: 2020, month: 5, day: 5, hour: 12, calendar: obj });
    const ym = Temporal.PlainYearMonth.from({ year: 2020, month: 5, calendar: obj });
    const md = Temporal.PlainMonthDay.from({ monthCode: 'M05', day: 5, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    it('.id property', () => equal(obj.id, 'two-based'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('two-based'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][u-ca=two-based]'), RangeError);
    });
    it('Temporal.PlainDate.from()', () => equal(`${date}`, '2020-04-05[u-ca=two-based]'));
    it('Temporal.PlainDate fields', () => {
      equal(date.year, 2020);
      equal(date.month, 5);
      equal(date.day, 5);
    });
    it('date.with()', () => {
      const date2 = date.with({ month: 2 });
      equal(date2.month, 2);
    });
    it('date.withCalendar()', () => {
      const date2 = Temporal.PlainDate.from('2020-04-05');
      assert(date2.withCalendar(obj).equals(date));
    });
    it('Temporal.PlainDateTime.from()', () => equal(`${dt}`, '2020-04-05T12:00:00[u-ca=two-based]'));
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
      const dt2 = dt.with({ month: 2 });
      equal(dt2.month, 2);
    });
    it('datetime.withCalendar()', () => {
      const dt2 = Temporal.PlainDateTime.from('2020-04-05T12:00');
      assert(dt2.withCalendar(obj).equals(dt));
    });
    it('Temporal.PlainYearMonth.from()', () => equal(`${ym}`, '2020-04-01[u-ca=two-based]'));
    it('Temporal.PlainYearMonth fields', () => {
      equal(dt.year, 2020);
      equal(dt.month, 5);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ month: 2 });
      equal(ym2.month, 2);
    });
    it('Temporal.PlainMonthDay.from()', () => equal(`${md}`, '1972-04-05[u-ca=two-based]'));
    it('Temporal.PlainMonthDay fields', () => {
      equal(md.monthCode, 'M05');
      equal(md.day, 5);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ monthCode: 'M02' });
      equal(md2.monthCode, 'M02');
    });
    it('timezone.getPlainDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const instant = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getPlainDateTimeFor(instant, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.Now.plainDateTime()', () => {
      const nowDateTime = Temporal.Now.plainDateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.Now.plainDate()', () => {
      const nowDate = Temporal.Now.plainDate(obj, 'UTC');
      equal(nowDate.calendar.id, obj.id);
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
      toString() {
        return 'decimal';
      },
      dateFromFields(fields, options) {
        const { overflow = 'constrain' } = options ? options : {};
        let { month, monthCode } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        const isoDate = decimalToISO(fields.year, month, fields.day, 0, 0, 0, overflow);
        return new Temporal.PlainDate(isoDate.year, isoDate.month, isoDate.day, this);
      },
      yearMonthFromFields(fields, options) {
        const { overflow = 'constrain' } = options ? options : {};
        let { month, monthCode } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        const isoDate = decimalToISO(fields.year, month, 1, 0, 0, 0, overflow);
        return new Temporal.PlainYearMonth(isoDate.year, isoDate.month, this, isoDate.day);
      },
      monthDayFromFields(fields, options) {
        const { overflow = 'constrain' } = options ? options : {};
        let { month, monthCode } = fields;
        if (month === undefined) month = +monthCode.slice(1);
        const isoDate = decimalToISO(0, month, fields.day, 0, 0, 0, overflow);
        return new Temporal.PlainMonthDay(isoDate.month, isoDate.day, this, isoDate.year);
      },
      year(date) {
        return isoToDecimal(date).year;
      },
      month(date) {
        const { days } = isoToDecimal(date);
        return Math.floor(days / 10) + 1;
      },
      monthCode(date) {
        return `M${this.month(date).toString().padStart(2, '0')}`;
      },
      day(date) {
        const { days } = isoToDecimal(date);
        return (days % 10) + 1;
      }
    };

    const date = Temporal.PlainDate.from({ year: 184, month: 2, day: 9, calendar: obj });
    const dt = Temporal.PlainDateTime.from({ year: 184, month: 2, day: 9, hour: 12, calendar: obj });
    const ym = Temporal.PlainYearMonth.from({ year: 184, month: 2, calendar: obj });
    const md = Temporal.PlainMonthDay.from({ monthCode: 'M02', day: 9, calendar: obj });

    it('is a calendar', () => equal(typeof obj, 'object'));
    // FIXME: what should happen in Temporal.Calendar.from(obj)?
    it('.id is not available in from()', () => {
      throws(() => Temporal.Calendar.from('decimal'), RangeError);
      throws(() => Temporal.Calendar.from('2020-06-05T09:34-07:00[America/Vancouver][u-ca=decimal]'), RangeError);
    });
    it('Temporal.PlainDate.from()', () => equal(`${date}`, '2020-06-05[u-ca=decimal]'));
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
    it('Temporal.PlainDateTime.from()', () => equal(`${dt}`, '2020-06-05T12:00:00[u-ca=decimal]'));
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
    it('Temporal.PlainYearMonth.from()', () => equal(`${ym}`, '2020-05-28[u-ca=decimal]'));
    it('Temporal.PlainYearMonth fields', () => {
      equal(dt.year, 184);
      equal(dt.month, 2);
    });
    it('yearmonth.with()', () => {
      const ym2 = ym.with({ year: 0 });
      equal(ym2.year, 0);
    });
    it('Temporal.PlainMonthDay.from()', () => equal(`${md}`, '1970-01-19[u-ca=decimal]'));
    it('Temporal.PlainMonthDay fields', () => {
      equal(md.monthCode, 'M02');
      equal(md.day, 9);
    });
    it('monthday.with()', () => {
      const md2 = md.with({ monthCode: 'M01' });
      equal(md2.monthCode, 'M01');
    });
    it('timezone.getPlainDateTimeFor()', () => {
      const tz = Temporal.TimeZone.from('UTC');
      const inst = Temporal.Instant.fromEpochSeconds(0);
      const dt = tz.getPlainDateTimeFor(inst, obj);
      equal(dt.calendar.id, obj.id);
    });
    it('Temporal.Now.plainDateTime()', () => {
      const nowDateTime = Temporal.Now.plainDateTime(obj, 'UTC');
      equal(nowDateTime.calendar.id, obj.id);
    });
    it('Temporal.Now.plainDate()', () => {
      const nowDate = Temporal.Now.plainDate(obj, 'UTC');
      equal(nowDate.calendar.id, obj.id);
    });
  });
  describe('calendar with extra fields', () => {
    // Contrived example of a calendar identical to the ISO calendar except that
    // months are numbered 1, 2, 3, and each year has four seasons of 3 months
    // numbered 1, 2, 3, 4.
    class SeasonCalendar extends Temporal.Calendar {
      constructor() {
        super('iso8601');
      }
      toString() {
        return 'season';
      }
      month(date) {
        const { isoMonth } = date.getISOFields();
        return ((isoMonth - 1) % 3) + 1;
      }
      monthCode(date) {
        return `M${this.month(date).toString().padStart(2, '0')}`;
      }
      season(date) {
        const { isoMonth } = date.getISOFields();
        return Math.floor((isoMonth - 1) / 3) + 1;
      }
      _isoMonthCode(fields) {
        const month = fields.month || +fields.monthCode.slice(1);
        return `M${((fields.season - 1) * 3 + month).toString().padStart(2, '0')}`;
      }
      dateFromFields(fields, options) {
        const monthCode = this._isoMonthCode(fields);
        delete fields.month;
        return super.dateFromFields({ ...fields, monthCode }, options);
      }
      yearMonthFromFields(fields, options) {
        const monthCode = this._isoMonthCode(fields);
        delete fields.month;
        return super.yearMonthFromFields({ ...fields, monthCode }, options);
      }
      monthDayFromFields(fields, options) {
        const monthCode = this._isoMonthCode(fields);
        delete fields.month;
        return super.monthDayFromFields({ ...fields, monthCode }, options);
      }
      fields(fields) {
        fields = fields.slice();
        if (fields.includes('month') || fields.includes('monthCode')) fields.push('season');
        return fields;
      }
    }
    const calendar = new SeasonCalendar();
    const datetime = new Temporal.PlainDateTime(2019, 9, 15, 0, 0, 0, 0, 0, 0, calendar);
    const date = new Temporal.PlainDate(2019, 9, 15, calendar);
    const yearmonth = new Temporal.PlainYearMonth(2019, 9, calendar);
    const monthday = new Temporal.PlainMonthDay(9, 15, calendar);
    const zoned = new Temporal.ZonedDateTime(1568505600_000_000_000n, 'UTC', calendar);
    before(() => {
      const propDesc = {
        get() {
          return this.calendar.season(this);
        },
        configurable: true
      };
      Object.defineProperty(Temporal.PlainDateTime.prototype, 'season', propDesc);
      Object.defineProperty(Temporal.PlainDate.prototype, 'season', propDesc);
      Object.defineProperty(Temporal.PlainYearMonth.prototype, 'season', propDesc);
      Object.defineProperty(Temporal.PlainMonthDay.prototype, 'season', propDesc);
      Object.defineProperty(Temporal.ZonedDateTime.prototype, 'season', propDesc);
    });
    it('property getter works', () => {
      equal(datetime.season, 3);
      equal(datetime.month, 3);
      equal(datetime.monthCode, 'M03');
      equal(date.season, 3);
      equal(date.month, 3);
      equal(date.monthCode, 'M03');
      equal(yearmonth.season, 3);
      equal(yearmonth.month, 3);
      equal(yearmonth.monthCode, 'M03');
      equal(monthday.season, 3);
      equal(monthday.monthCode, 'M03');
      equal(zoned.season, 3);
      equal(zoned.month, 3);
      equal(zoned.monthCode, 'M03');
    });
    it('accepts season in from()', () => {
      equal(
        `${Temporal.PlainDateTime.from({ year: 2019, season: 3, month: 3, day: 15, calendar })}`,
        '2019-09-15T00:00:00[u-ca=season]'
      );
      equal(
        `${Temporal.PlainDate.from({ year: 2019, season: 3, month: 3, day: 15, calendar })}`,
        '2019-09-15[u-ca=season]'
      );
      equal(
        `${Temporal.PlainYearMonth.from({ year: 2019, season: 3, month: 3, calendar })}`,
        '2019-09-01[u-ca=season]'
      );
      equal(
        `${Temporal.PlainMonthDay.from({ season: 3, monthCode: 'M03', day: 15, calendar })}`,
        '1972-09-15[u-ca=season]'
      );
      equal(
        `${Temporal.ZonedDateTime.from({ year: 2019, season: 3, month: 3, day: 15, timeZone: 'UTC', calendar })}`,
        '2019-09-15T00:00:00+00:00[UTC][u-ca=season]'
      );
    });
    it('accepts season in with()', () => {
      equal(`${datetime.with({ season: 2 })}`, '2019-06-15T00:00:00[u-ca=season]');
      equal(`${date.with({ season: 2 })}`, '2019-06-15[u-ca=season]');
      equal(`${yearmonth.with({ season: 2 })}`, '2019-06-01[u-ca=season]');
      equal(`${monthday.with({ season: 2 })}`, '1972-06-15[u-ca=season]');
      equal(`${zoned.with({ season: 2 })}`, '2019-06-15T00:00:00+00:00[UTC][u-ca=season]');
    });
    it('translates month correctly in with()', () => {
      equal(`${datetime.with({ month: 2 })}`, '2019-08-15T00:00:00[u-ca=season]');
      equal(`${date.with({ month: 2 })}`, '2019-08-15[u-ca=season]');
      equal(`${yearmonth.with({ month: 2 })}`, '2019-08-01[u-ca=season]');
      equal(`${monthday.with({ monthCode: 'M02' })}`, '1972-08-15[u-ca=season]');
      equal(`${zoned.with({ month: 2 })}`, '2019-08-15T00:00:00+00:00[UTC][u-ca=season]');
    });
    after(() => {
      delete Temporal.PlainDateTime.prototype.season;
      delete Temporal.PlainDate.prototype.season;
      delete Temporal.PlainYearMonth.prototype.season;
      delete Temporal.PlainMonthDay.prototype.season;
      delete Temporal.ZonedDateTime.prototype.season;
    });
  });

  describe('calendar with nontrivial mergeFields implementation', () => {
    // Contrived example of a calendar identical to the ISO calendar except that
    // you can specify years as a combination of `century` (the 21st century is
    // the year 2001 through 2100) and `centuryYear` (1-100)
    class CenturyCalendar extends Temporal.Calendar {
      constructor() {
        super('iso8601');
      }
      toString() {
        return 'century';
      }
      century(date) {
        const { isoYear } = date.getISOFields();
        return Math.ceil(isoYear / 100);
      }
      centuryYear(date) {
        const { isoYear } = date.getISOFields();
        return isoYear % 100;
      }
      _validateFields(fields) {
        const { year, century, centuryYear } = fields;
        if ((century === undefined) !== (centuryYear === undefined)) {
          throw new TypeError('pass either both or neither of century and centuryYear');
        }
        if (year === undefined) return (century - 1) * 100 + centuryYear;
        if (century !== undefined) {
          let centuryCalculatedYear = (century - 1) * 100 + centuryYear;
          if (year !== centuryCalculatedYear) {
            throw new RangeError('year must agree with century/centuryYear if both given');
          }
        }
        return year;
      }
      dateFromFields(fields, options) {
        const isoYear = this._validateFields(fields);
        return super.dateFromFields({ ...fields, year: isoYear }, options);
      }
      yearMonthFromFields(fields, options) {
        const isoYear = this._validateFields(fields);
        return super.yearMonthFromFields({ ...fields, year: isoYear }, options);
      }
      monthDayFromFields(fields, options) {
        const isoYear = this._validateFields(fields);
        return super.monthDayFromFields({ ...fields, year: isoYear }, options);
      }
      fields(fields) {
        fields = fields.slice();
        if (fields.includes('year')) fields.push('century', 'centuryYear');
        return fields;
      }
      mergeFields(fields, additionalFields) {
        const { year, century, centuryYear, ...original } = fields;
        const { year: newYear, century: newCentury, centuryYear: newCenturyYear } = additionalFields;
        if (newYear === undefined) {
          original.century = century;
          original.centuryYear = centuryYear;
        }
        if (newCentury === undefined && newCenturyYear === undefined) {
          original.year === year;
        }
        return { ...original, ...additionalFields };
      }
    }
    const calendar = new CenturyCalendar();
    const datetime = new Temporal.PlainDateTime(2019, 9, 15, 0, 0, 0, 0, 0, 0, calendar);
    const date = new Temporal.PlainDate(2019, 9, 15, calendar);
    const yearmonth = new Temporal.PlainYearMonth(2019, 9, calendar);
    const zoned = new Temporal.ZonedDateTime(1568505600_000_000_000n, 'UTC', calendar);
    before(() => {
      const propDesc = {
        century: {
          get() {
            return this.calendar.century(this);
          },
          configurable: true
        },
        centuryYear: {
          get() {
            return this.calendar.centuryYear(this);
          },
          configurable: true
        }
      };
      Object.defineProperties(Temporal.PlainDateTime.prototype, propDesc);
      Object.defineProperties(Temporal.PlainDate.prototype, propDesc);
      Object.defineProperties(Temporal.PlainYearMonth.prototype, propDesc);
      Object.defineProperties(Temporal.ZonedDateTime.prototype, propDesc);
    });
    it('property getters work', () => {
      equal(datetime.century, 21);
      equal(datetime.centuryYear, 19);
      equal(date.century, 21);
      equal(date.centuryYear, 19);
      equal(yearmonth.century, 21);
      equal(yearmonth.centuryYear, 19);
      equal(zoned.century, 21);
      equal(zoned.centuryYear, 19);
    });
    it('correctly resolves century in with()', () => {
      equal(`${datetime.with({ century: 20 })}`, '1919-09-15T00:00:00[u-ca=century]');
      equal(`${date.with({ century: 20 })}`, '1919-09-15[u-ca=century]');
      equal(`${yearmonth.with({ century: 20 })}`, '1919-09-01[u-ca=century]');
      equal(`${zoned.with({ century: 20 })}`, '1919-09-15T00:00:00+00:00[UTC][u-ca=century]');
    });
    it('correctly resolves centuryYear in with()', () => {
      equal(`${datetime.with({ centuryYear: 5 })}`, '2005-09-15T00:00:00[u-ca=century]');
      equal(`${date.with({ centuryYear: 5 })}`, '2005-09-15[u-ca=century]');
      equal(`${yearmonth.with({ centuryYear: 5 })}`, '2005-09-01[u-ca=century]');
      equal(`${zoned.with({ centuryYear: 5 })}`, '2005-09-15T00:00:00+00:00[UTC][u-ca=century]');
    });
    it('correctly resolves year in with()', () => {
      equal(`${datetime.with({ year: 1974 })}`, '1974-09-15T00:00:00[u-ca=century]');
      equal(`${date.with({ year: 1974 })}`, '1974-09-15[u-ca=century]');
      equal(`${yearmonth.with({ year: 1974 })}`, '1974-09-01[u-ca=century]');
      equal(`${zoned.with({ year: 1974 })}`, '1974-09-15T00:00:00+00:00[UTC][u-ca=century]');
    });
    after(() => {
      delete Temporal.PlainDateTime.prototype.century;
      delete Temporal.PlainDateTime.prototype.centuryYear;
      delete Temporal.PlainDate.prototype.century;
      delete Temporal.PlainDate.prototype.centuryYear;
      delete Temporal.PlainYearMonth.prototype.century;
      delete Temporal.PlainYearMonth.prototype.centuryYear;
      delete Temporal.ZonedDateTime.prototype.century;
      delete Temporal.ZonedDateTime.prototype.centuryYear;
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
