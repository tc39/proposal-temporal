import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal, throws } = assert;

import { DateTimeFormat } from '../lib/intl.mjs';
Intl.DateTimeFormat = DateTimeFormat;
import * as Temporal from 'proposal-temporal';

describe('Intl', () => {
  // TODO: move these to their respective test files.

  function maybeGetWeekdayOnlyFormat() {
    const fmt = new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: 'Europe/Vienna' });
    if (
      ['era', 'year', 'month', 'day', 'hour', 'minute', 'second', 'timeZoneName'].some(
        (prop) => prop in fmt.resolvedOptions()
      )
    ) {
      it.skip('no weekday-only format available', () => {});
      return null;
    }
    return fmt;
  }

  describe('instant.toLocaleString()', () => {
    const instant = Temporal.Instant.from('1976-11-18T14:23:30Z');
    it(`(${instant.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${instant.toLocaleString('en', { timeZone: 'America/New_York' })}`, '11/18/1976, 9:23:30 AM'));
    it(`(${instant.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${instant.toLocaleString('de', { timeZone: 'Europe/Vienna' })}`, '18.11.1976, 15:23:30'));
    const fmt = maybeGetWeekdayOnlyFormat();
    if (fmt) it('uses only the options in resolvedOptions', () => equal(fmt.format(instant), 'Thursday'));
    it('outputs timeZoneName if requested', () => {
      const str = instant.toLocaleString('en', { timeZone: 'America/New_York', timeZoneName: 'short' });
      assert(str.includes('EST'));
    });
  });
  describe('zoneddatetime.toLocaleString()', () => {
    const zdt = Temporal.ZonedDateTime.from('1976-11-18T15:23:30+01:00[Europe/Vienna]');
    it(`(${zdt}).toLocaleString('en-US')`, () => equal(zdt.toLocaleString('en'), '11/18/1976, 3:23:30 PM GMT+1'));
    it(`(${zdt}).toLocaleString('de-AT')`, () => equal(zdt.toLocaleString('de'), '18.11.1976, 15:23:30 MEZ'));
    const fmt = maybeGetWeekdayOnlyFormat();
    if (fmt) it('uses only the options in resolvedOptions', () => equal(fmt.format(zdt), 'Thursday'));
    it('can override the style of the time zone name', () => {
      equal(
        zdt.toLocaleString('en', { timeZoneName: 'long' }),
        '11/18/1976, 3:23:30 PM Central European Standard Time'
      );
    });
    it("works if the time zone given in options agrees with the object's time zone", () => {
      equal(zdt.toLocaleString('en', { timeZone: 'Europe/Vienna' }), '11/18/1976, 3:23:30 PM GMT+1');
    });
    it("throws if the time zone given in options disagrees with the object's time zone", () => {
      throws(() => zdt.toLocaleString('en', { timeZone: 'America/New_York' }), RangeError);
    });
    it("works when the object's calendar is the same as the locale's calendar", () => {
      const zdt = new Temporal.ZonedDateTime(0n, 'UTC', 'japanese');
      const result = zdt.toLocaleString('en-US-u-ca-japanese');
      assert(result === '1/1/45, 12:00:00 AM UTC' || result === '1/1/45 S, 12:00:00 AM UTC');
    });
    it("adopts the locale's calendar when the object's calendar is ISO", () => {
      const zdt = Temporal.ZonedDateTime.from('1976-11-18T15:23:30+00:00[UTC]');
      const result = zdt.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/18/51, 3:23:30 PM UTC' || result === '11/18/51 S, 3:23:30 PM UTC');
    });
    it('throws when the calendars are different and not ISO', () => {
      const zdt = new Temporal.ZonedDateTime(0n, 'UTC', 'gregory');
      throws(() => zdt.toLocaleString('en-US-u-ca-japanese'));
    });
  });
  describe('datetime.toLocaleString()', () => {
    const datetime = Temporal.PlainDateTime.from('1976-11-18T15:23:30');
    it(`(${datetime.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${datetime.toLocaleString('en', { timeZone: 'America/New_York' })}`, '11/18/1976, 3:23:30 PM'));
    it(`(${datetime.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${datetime.toLocaleString('de', { timeZone: 'Europe/Vienna' })}`, '18.11.1976, 15:23:30'));
    const fmt = maybeGetWeekdayOnlyFormat();
    if (fmt) it('uses only the options in resolvedOptions', () => equal(fmt.format(datetime), 'Thursday'));
    it('should ignore units not in the data type', () => {
      equal(datetime.toLocaleString('en', { timeZoneName: 'long' }), '11/18/1976, 3:23:30 PM');
    });
    it('should use compatible disambiguation option', () => {
      const dstStart = new Temporal.PlainDateTime(2020, 3, 8, 2, 30);
      equal(`${dstStart.toLocaleString('en', { timeZone: 'America/Los_Angeles' })}`, '3/8/2020, 3:30:00 AM');
    });
    it("works when the object's calendar is the same as the locale's calendar", () => {
      const dt = Temporal.PlainDateTime.from({
        era: 'showa',
        year: 51,
        month: 11,
        day: 18,
        hour: 15,
        minute: 23,
        second: 30,
        calendar: 'japanese'
      });
      const result = dt.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/18/51, 3:23:30 PM' || result === '11/18/51 S, 3:23:30 PM');
    });
    it("adopts the locale's calendar when the object's calendar is ISO", () => {
      const dt = Temporal.PlainDateTime.from('1976-11-18T15:23:30');
      const result = dt.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/18/51, 3:23:30 PM' || result === '11/18/51 S, 3:23:30 PM');
    });
    it('throws when the calendars are different and not ISO', () => {
      const dt = Temporal.PlainDateTime.from({
        year: 1976,
        month: 11,
        day: 18,
        hour: 15,
        minute: 23,
        second: 30,
        calendar: 'gregory'
      });
      throws(() => dt.toLocaleString('en-US-u-ca-japanese'));
    });
  });
  describe('time.toLocaleString()', () => {
    const time = Temporal.PlainTime.from('1976-11-18T15:23:30');
    it(`(${time.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${time.toLocaleString('en', { timeZone: 'America/New_York' })}`, '3:23:30 PM'));
    it(`(${time.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${time.toLocaleString('de', { timeZone: 'Europe/Vienna' })}`, '15:23:30'));
    it('should ignore units not in the data type', () => {
      equal(time.toLocaleString('en', { timeZoneName: 'long' }), '3:23:30 PM');
      equal(time.toLocaleString('en', { year: 'numeric' }), '3:23:30 PM');
      equal(time.toLocaleString('en', { month: 'numeric' }), '3:23:30 PM');
      equal(time.toLocaleString('en', { day: 'numeric' }), '3:23:30 PM');
      equal(time.toLocaleString('en', { weekday: 'long' }), '3:23:30 PM');
    });
  });
  describe('date.toLocaleString()', () => {
    const date = Temporal.PlainDate.from('1976-11-18T15:23:30');
    it(`(${date.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${date.toLocaleString('en', { timeZone: 'America/New_York' })}`, '11/18/1976'));
    it(`(${date.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${date.toLocaleString('de', { timeZone: 'Europe/Vienna' })}`, '18.11.1976'));
    const fmt = maybeGetWeekdayOnlyFormat();
    if (fmt) it('uses only the options in resolvedOptions', () => equal(fmt.format(date), 'Thursday'));
    it('should ignore units not in the data type', () => {
      equal(date.toLocaleString('en', { timeZoneName: 'long' }), '11/18/1976');
      equal(date.toLocaleString('en', { hour: 'numeric' }), '11/18/1976');
      equal(date.toLocaleString('en', { minute: 'numeric' }), '11/18/1976');
      equal(date.toLocaleString('en', { second: 'numeric' }), '11/18/1976');
    });
    it("works when the object's calendar is the same as the locale's calendar", () => {
      const d = Temporal.PlainDate.from({ era: 'showa', year: 51, month: 11, day: 18, calendar: 'japanese' });
      const result = d.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/18/51' || result === '11/18/51 S');
    });
    it("adopts the locale's calendar when the object's calendar is ISO", () => {
      const d = Temporal.PlainDate.from('1976-11-18');
      const result = d.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/18/51' || result === '11/18/51 S');
    });
    it('throws when the calendars are different and not ISO', () => {
      const d = Temporal.PlainDate.from({ year: 1976, month: 11, day: 18, calendar: 'gregory' });
      throws(() => d.toLocaleString('en-US-u-ca-japanese'));
    });
  });
  describe('yearmonth.toLocaleString()', () => {
    const calendar = new Intl.DateTimeFormat('en').resolvedOptions().calendar;
    const yearmonth = Temporal.PlainYearMonth.from({ year: 1976, month: 11, calendar });
    it(`(${yearmonth.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${yearmonth.toLocaleString('en', { timeZone: 'America/New_York' })}`, '11/1976'));
    it(`(${yearmonth.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${yearmonth.toLocaleString('de', { timeZone: 'Europe/Vienna', calendar })}`, '11.1976'));
    it('should ignore units not in the data type', () => {
      equal(yearmonth.toLocaleString('en', { timeZoneName: 'long' }), '11/1976');
      equal(yearmonth.toLocaleString('en', { day: 'numeric' }), '11/1976');
      equal(yearmonth.toLocaleString('en', { hour: 'numeric' }), '11/1976');
      equal(yearmonth.toLocaleString('en', { minute: 'numeric' }), '11/1976');
      equal(yearmonth.toLocaleString('en', { second: 'numeric' }), '11/1976');
      equal(yearmonth.toLocaleString('en', { weekday: 'long' }), '11/1976');
    });
    it("works when the object's calendar is the same as the locale's calendar", () => {
      const ym = Temporal.PlainYearMonth.from({ era: 'showa', year: 51, month: 11, calendar: 'japanese' });
      const result = ym.toLocaleString('en-US-u-ca-japanese');
      assert(result === '11/51' || result === '11/51 S');
    });
    it('throws when the calendar is not equal to the locale calendar', () => {
      const ymISO = Temporal.PlainYearMonth.from({ year: 1976, month: 11 });
      throws(() => ymISO.toLocaleString('en-US-u-ca-japanese'), RangeError);
    });
  });
  describe('monthday.toLocaleString()', () => {
    const calendar = new Intl.DateTimeFormat('en').resolvedOptions().calendar;
    const monthday = Temporal.PlainMonthDay.from({ month: 11, day: 18, calendar });
    it(`(${monthday.toString()}).toLocaleString('en-US', { timeZone: 'America/New_York' })`, () =>
      equal(`${monthday.toLocaleString('en', { timeZone: 'America/New_York' })}`, '11/18'));
    it(`(${monthday.toString()}).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })`, () =>
      equal(`${monthday.toLocaleString('de', { timeZone: 'Europe/Vienna', calendar })}`, '18.11.'));
    it('should ignore units not in the data type', () => {
      equal(monthday.toLocaleString('en', { timeZoneName: 'long' }), '11/18');
      equal(monthday.toLocaleString('en', { year: 'numeric' }), '11/18');
      equal(monthday.toLocaleString('en', { hour: 'numeric' }), '11/18');
      equal(monthday.toLocaleString('en', { minute: 'numeric' }), '11/18');
      equal(monthday.toLocaleString('en', { second: 'numeric' }), '11/18');
      equal(monthday.toLocaleString('en', { weekday: 'long' }), '11/18');
    });
    it("works when the object's calendar is the same as the locale's calendar", () => {
      const md = Temporal.PlainMonthDay.from({ month: 11, day: 18, calendar: 'japanese' });
      equal(`${md.toLocaleString('en-US-u-ca-japanese')}`, '11/18');
    });
    it('throws when the calendar is not equal to the locale calendar', () => {
      const mdISO = Temporal.PlainMonthDay.from({ month: 11, day: 18 });
      throws(() => mdISO.toLocaleString('en-US-u-ca-japanese'), RangeError);
    });
  });

  describe('DateTimeFormat', () => {
    describe('supportedLocalesOf', () => {
      it('should return an Array', () => assert(Array.isArray(Intl.DateTimeFormat.supportedLocalesOf())));
    });

    const us = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York' });
    const at = new Intl.DateTimeFormat('de-AT', { timeZone: 'Europe/Vienna' });
    const us2 = new Intl.DateTimeFormat('en-US');
    const at2 = new Intl.DateTimeFormat('de-AT');
    const usCalendar = us.resolvedOptions().calendar;
    const atCalendar = at.resolvedOptions().calendar;
    const t1 = '1976-11-18T14:23:30+00:00[UTC]';
    const t2 = '2020-02-20T15:44:56-05:00[America/New_York]';
    const start = new Date('1922-12-30'); // ☭
    const end = new Date('1991-12-26');

    describe('format', () => {
      it('should work for Instant', () => {
        equal(us.format(Temporal.Instant.from(t1)), '11/18/1976, 9:23:30 AM');
        equal(at.format(Temporal.Instant.from(t1)), '18.11.1976, 15:23:30');
      });
      it('should work for ZonedDateTime', () => {
        equal(us2.format(Temporal.ZonedDateTime.from(t1)), '11/18/1976, 2:23:30 PM UTC');
        equal(at2.format(Temporal.ZonedDateTime.from(t1)), '18.11.1976, 14:23:30 UTC');
      });
      it('should work for DateTime', () => {
        equal(us.format(Temporal.PlainDateTime.from(t1)), '11/18/1976, 2:23:30 PM');
        equal(at.format(Temporal.PlainDateTime.from(t1)), '18.11.1976, 14:23:30');
      });
      it('should work for Time', () => {
        equal(us.format(Temporal.PlainTime.from(t1)), '2:23:30 PM');
        equal(at.format(Temporal.PlainTime.from(t1)), '14:23:30');
      });
      it('should work for Date', () => {
        equal(us.format(Temporal.PlainDate.from(t1)), '11/18/1976');
        equal(at.format(Temporal.PlainDate.from(t1)), '18.11.1976');
      });
      it('should work for YearMonth', () => {
        const fields = Temporal.PlainYearMonth.from(t1).getFields();
        equal(us.format(Temporal.PlainYearMonth.from({ ...fields, calendar: usCalendar })), '11/1976');
        equal(at.format(Temporal.PlainYearMonth.from({ ...fields, calendar: atCalendar })), '11.1976');
      });
      it('should work for MonthDay', () => {
        const fields = Temporal.PlainMonthDay.from(t1).getFields();
        equal(us.format(Temporal.PlainMonthDay.from({ ...fields, calendar: usCalendar })), '11/18');
        equal(at.format(Temporal.PlainMonthDay.from({ ...fields, calendar: atCalendar })), '18.11.');
      });
      it('should not break legacy Date', () => {
        equal(us.format(start), '12/29/1922');
        equal(at.format(start), '30.12.1922');
      });
    });
    describe('formatToParts', () => {
      it('should work for Instant', () => {
        deepEqual(us.formatToParts(Temporal.Instant.from(t2)), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '3' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' },
          { type: 'literal', value: ' ' },
          { type: 'dayPeriod', value: 'PM' }
        ]);
        deepEqual(at.formatToParts(Temporal.Instant.from(t2)), [
          { type: 'day', value: '20' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '21' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' }
        ]);
      });
      it('should work for ZonedDateTime', () => {
        deepEqual(us2.formatToParts(Temporal.ZonedDateTime.from(t2)), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '3' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' },
          { type: 'literal', value: ' ' },
          { type: 'dayPeriod', value: 'PM' },
          { type: 'literal', value: ' ' },
          { type: 'timeZoneName', value: 'EST' }
        ]);
        deepEqual(at2.formatToParts(Temporal.ZonedDateTime.from(t2)), [
          { type: 'day', value: '20' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '15' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' },
          { type: 'literal', value: ' ' },
          { type: 'timeZoneName', value: 'GMT-5' }
        ]);
      });
      it('should work for DateTime', () => {
        deepEqual(us.formatToParts(Temporal.PlainDateTime.from(t2)), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '3' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' },
          { type: 'literal', value: ' ' },
          { type: 'dayPeriod', value: 'PM' }
        ]);
        deepEqual(at.formatToParts(Temporal.PlainDateTime.from(t2)), [
          { type: 'day', value: '20' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' },
          { type: 'literal', value: ', ' },
          { type: 'hour', value: '15' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' }
        ]);
      });
      it('should work for Time', () => {
        deepEqual(us.formatToParts(Temporal.PlainTime.from(t2)), [
          { type: 'hour', value: '3' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' },
          { type: 'literal', value: ' ' },
          { type: 'dayPeriod', value: 'PM' }
        ]);
        deepEqual(at.formatToParts(Temporal.PlainTime.from(t2)), [
          { type: 'hour', value: '15' },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '44' },
          { type: 'literal', value: ':' },
          { type: 'second', value: '56' }
        ]);
      });
      it('should work for Date', () => {
        deepEqual(us.formatToParts(Temporal.PlainDate.from(t2)), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' }
        ]);
        deepEqual(at.formatToParts(Temporal.PlainDate.from(t2)), [
          { type: 'day', value: '20' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' }
        ]);
      });
      it('should work for YearMonth', () => {
        const fields = Temporal.PlainYearMonth.from(t2).getFields();
        deepEqual(us.formatToParts(Temporal.PlainYearMonth.from({ ...fields, calendar: usCalendar })), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' }
        ]);
        deepEqual(at.formatToParts(Temporal.PlainYearMonth.from({ ...fields, calendar: atCalendar })), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' }
        ]);
      });
      it('should work for MonthDay', () => {
        const fields = Temporal.PlainMonthDay.from(t2).getFields();
        deepEqual(us.formatToParts(Temporal.PlainMonthDay.from({ ...fields, calendar: usCalendar })), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' }
        ]);
        deepEqual(at.formatToParts(Temporal.PlainMonthDay.from({ ...fields, calendar: atCalendar })), [
          { type: 'day', value: '20' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' }
        ]);
      });
      it('should not break legacy Date', () => {
        deepEqual(us.formatToParts(end), [
          { type: 'month', value: '12' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '25' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '1991' }
        ]);
        deepEqual(at.formatToParts(end), [
          { type: 'day', value: '26' },
          { type: 'literal', value: '.' },
          { type: 'month', value: '12' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '1991' }
        ]);
      });
    });
    describe('formatRange', () => {
      it('should work for Instant', () => {
        equal(
          us.formatRange(Temporal.Instant.from(t1), Temporal.Instant.from(t2)),
          '11/18/1976, 9:23:30 AM – 2/20/2020, 3:44:56 PM'
        );
        equal(
          at.formatRange(Temporal.Instant.from(t1), Temporal.Instant.from(t2)),
          '18.11.1976, 15:23:30 – 20.2.2020, 21:44:56'
        );
      });
      it('should work for ZonedDateTime', () => {
        const zdt1 = Temporal.ZonedDateTime.from(t1);
        const zdt2 = Temporal.ZonedDateTime.from(t2).withTimeZone(zdt1.timeZone);
        equal(us2.formatRange(zdt1, zdt2), '11/18/1976, 2:23:30 PM UTC – 2/20/2020, 8:44:56 PM UTC');
        equal(at2.formatRange(zdt1, zdt2), '18.11.1976, 14:23:30 UTC – 20.2.2020, 20:44:56 UTC');
      });
      it('should work for DateTime', () => {
        equal(
          us.formatRange(Temporal.PlainDateTime.from(t1), Temporal.PlainDateTime.from(t2)),
          '11/18/1976, 2:23:30 PM – 2/20/2020, 3:44:56 PM'
        );
        equal(
          at.formatRange(Temporal.PlainDateTime.from(t1), Temporal.PlainDateTime.from(t2)),
          '18.11.1976, 14:23:30 – 20.2.2020, 15:44:56'
        );
      });
      it('should work for Time', () => {
        equal(us.formatRange(Temporal.PlainTime.from(t1), Temporal.PlainTime.from(t2)), '2:23:30 PM – 3:44:56 PM');
        equal(at.formatRange(Temporal.PlainTime.from(t1), Temporal.PlainTime.from(t2)), '14:23:30 – 15:44:56');
      });
      it('should work for Date', () => {
        equal(us.formatRange(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2)), '11/18/1976 – 2/20/2020');
        equal(at.formatRange(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2)), '18.11.1976 – 20.02.2020');
      });
      it('should work for YearMonth', () => {
        const fields1 = Temporal.PlainYearMonth.from(t1).getFields();
        const fields2 = Temporal.PlainYearMonth.from(t2).getFields();
        equal(
          us.formatRange(
            Temporal.PlainYearMonth.from({ ...fields1, calendar: usCalendar }),
            Temporal.PlainYearMonth.from({ ...fields2, calendar: usCalendar })
          ),
          '11/1976 – 2/2020'
        );
        equal(
          at.formatRange(
            Temporal.PlainYearMonth.from({ ...fields1, calendar: atCalendar }),
            Temporal.PlainYearMonth.from({ ...fields2, calendar: atCalendar })
          ),
          '11.1976 – 02.2020'
        );
      });
      it('should work for MonthDay', () => {
        const fields1 = Temporal.PlainMonthDay.from(t1).getFields();
        const fields2 = Temporal.PlainMonthDay.from(t2).getFields();
        equal(
          us.formatRange(
            Temporal.PlainMonthDay.from({ ...fields2, calendar: usCalendar }),
            Temporal.PlainMonthDay.from({ ...fields1, calendar: usCalendar })
          ),
          '2/20 – 11/18'
        );
        equal(
          at.formatRange(
            Temporal.PlainMonthDay.from({ ...fields2, calendar: atCalendar }),
            Temporal.PlainMonthDay.from({ ...fields1, calendar: atCalendar })
          ),
          '20.02. – 18.11.'
        );
      });
      it('should not break legacy Date', () => {
        equal(us.formatRange(start, end), '12/29/1922 – 12/25/1991');
        equal(at.formatRange(start, end), '30.12.1922 – 26.12.1991');
      });
      it('should throw a TypeError when called with dissimilar types', () =>
        throws(() => us.formatRange(Temporal.Instant.from(t1), Temporal.PlainDateTime.from(t2)), TypeError));
      it('should throw a RangeError when called with different calendars', () => {
        throws(
          () =>
            us.formatRange(Temporal.PlainDateTime.from(t1), Temporal.PlainDateTime.from(t2).withCalendar('japanese')),
          RangeError
        );
        throws(
          () => us.formatRange(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2).withCalendar('japanese')),
          RangeError
        );
      });
      it('throws for two ZonedDateTimes with different time zones', () => {
        throws(() => us2.formatRange(Temporal.ZonedDateTime.from(t1), Temporal.ZonedDateTime.from(t2)), RangeError);
      });
    });
    describe('formatRangeToParts', () => {
      it('should work for Instant', () => {
        deepEqual(us.formatRangeToParts(Temporal.Instant.from(t1), Temporal.Instant.from(t2)), [
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '9', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'dayPeriod', value: 'AM', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '3', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'dayPeriod', value: 'PM', source: 'endRange' }
        ]);
        deepEqual(at.formatRangeToParts(Temporal.Instant.from(t1), Temporal.Instant.from(t2)), [
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '15', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '21', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' }
        ]);
      });
      it('should work for ZonedDateTime', () => {
        const zdt1 = Temporal.ZonedDateTime.from(t1);
        const zdt2 = Temporal.ZonedDateTime.from(t2).withTimeZone(zdt1.timeZone);
        deepEqual(us2.formatRangeToParts(zdt1, zdt2), [
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '2', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'dayPeriod', value: 'PM', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'timeZoneName', value: 'UTC', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '8', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'dayPeriod', value: 'PM', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'timeZoneName', value: 'UTC', source: 'endRange' }
        ]);
        deepEqual(at2.formatRangeToParts(zdt1, zdt2), [
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '14', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'timeZoneName', value: 'UTC', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '20', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'timeZoneName', value: 'UTC', source: 'endRange' }
        ]);
      });
      it('should work for DateTime', () => {
        deepEqual(us.formatRangeToParts(Temporal.PlainDateTime.from(t1), Temporal.PlainDateTime.from(t2)), [
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '2', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'dayPeriod', value: 'PM', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '3', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'dayPeriod', value: 'PM', source: 'endRange' }
        ]);
        deepEqual(at.formatRangeToParts(Temporal.PlainDateTime.from(t1), Temporal.PlainDateTime.from(t2)), [
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ', ', source: 'startRange' },
          { type: 'hour', value: '14', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' },
          { type: 'literal', value: ', ', source: 'endRange' },
          { type: 'hour', value: '15', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' }
        ]);
      });
      it('should work for Time', () => {
        deepEqual(us.formatRangeToParts(Temporal.PlainTime.from(t1), Temporal.PlainTime.from(t2)), [
          { type: 'hour', value: '2', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' ', source: 'startRange' },
          { type: 'dayPeriod', value: 'PM', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'hour', value: '3', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' },
          { type: 'literal', value: ' ', source: 'endRange' },
          { type: 'dayPeriod', value: 'PM', source: 'endRange' }
        ]);
        deepEqual(at.formatRangeToParts(Temporal.PlainTime.from(t1), Temporal.PlainTime.from(t2)), [
          { type: 'hour', value: '14', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'minute', value: '23', source: 'startRange' },
          { type: 'literal', value: ':', source: 'startRange' },
          { type: 'second', value: '30', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'hour', value: '15', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'minute', value: '44', source: 'endRange' },
          { type: 'literal', value: ':', source: 'endRange' },
          { type: 'second', value: '56', source: 'endRange' }
        ]);
      });
      it('should work for Date', () => {
        deepEqual(us.formatRangeToParts(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2)), [
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'month', value: '2', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' }
        ]);
        deepEqual(at.formatRangeToParts(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2)), [
          { type: 'day', value: '18', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'month', value: '11', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'year', value: '1976', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'day', value: '20', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'month', value: '02', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'year', value: '2020', source: 'endRange' }
        ]);
      });
      it('should work for YearMonth', () => {
        const fields1 = Temporal.PlainYearMonth.from(t1).getFields();
        const fields2 = Temporal.PlainYearMonth.from(t2).getFields();
        deepEqual(
          us.formatRangeToParts(
            Temporal.PlainYearMonth.from({ ...fields1, calendar: usCalendar }),
            Temporal.PlainYearMonth.from({ ...fields2, calendar: usCalendar })
          ),
          [
            { type: 'month', value: '11', source: 'startRange' },
            { type: 'literal', value: '/', source: 'startRange' },
            { type: 'year', value: '1976', source: 'startRange' },
            { type: 'literal', value: ' – ', source: 'shared' },
            { type: 'month', value: '2', source: 'endRange' },
            { type: 'literal', value: '/', source: 'endRange' },
            { type: 'year', value: '2020', source: 'endRange' }
          ]
        );
        deepEqual(
          at.formatRangeToParts(
            Temporal.PlainYearMonth.from({ ...fields1, calendar: atCalendar }),
            Temporal.PlainYearMonth.from({ ...fields2, calendar: atCalendar })
          ),
          [
            { type: 'month', value: '11', source: 'startRange' },
            { type: 'literal', value: '.', source: 'startRange' },
            { type: 'year', value: '1976', source: 'startRange' },
            { type: 'literal', value: ' – ', source: 'shared' },
            { type: 'month', value: '02', source: 'endRange' },
            { type: 'literal', value: '.', source: 'endRange' },
            { type: 'year', value: '2020', source: 'endRange' }
          ]
        );
      });
      it('should work for MonthDay', () => {
        const fields1 = Temporal.PlainMonthDay.from(t1).getFields();
        const fields2 = Temporal.PlainMonthDay.from(t2).getFields();
        deepEqual(
          us.formatRangeToParts(
            Temporal.PlainMonthDay.from({ ...fields2, calendar: usCalendar }),
            Temporal.PlainMonthDay.from({ ...fields1, calendar: usCalendar })
          ),
          [
            { type: 'month', value: '2', source: 'startRange' },
            { type: 'literal', value: '/', source: 'startRange' },
            { type: 'day', value: '20', source: 'startRange' },
            { type: 'literal', value: ' – ', source: 'shared' },
            { type: 'month', value: '11', source: 'endRange' },
            { type: 'literal', value: '/', source: 'endRange' },
            { type: 'day', value: '18', source: 'endRange' }
          ]
        );
        deepEqual(
          at.formatRangeToParts(
            Temporal.PlainMonthDay.from({ ...fields2, calendar: atCalendar }),
            Temporal.PlainMonthDay.from({ ...fields1, calendar: atCalendar })
          ),
          [
            { type: 'day', value: '20', source: 'startRange' },
            { type: 'literal', value: '.', source: 'startRange' },
            { type: 'month', value: '02', source: 'startRange' },
            { type: 'literal', value: '. – ', source: 'shared' },
            { type: 'day', value: '18', source: 'endRange' },
            { type: 'literal', value: '.', source: 'endRange' },
            { type: 'month', value: '11', source: 'endRange' },
            { type: 'literal', value: '.', source: 'shared' }
          ]
        );
      });
      it('should not break legacy Date', () => {
        deepEqual(us.formatRangeToParts(start, end), [
          { type: 'month', value: '12', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'day', value: '29', source: 'startRange' },
          { type: 'literal', value: '/', source: 'startRange' },
          { type: 'year', value: '1922', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'month', value: '12', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'day', value: '25', source: 'endRange' },
          { type: 'literal', value: '/', source: 'endRange' },
          { type: 'year', value: '1991', source: 'endRange' }
        ]);
        deepEqual(at.formatRangeToParts(start, end), [
          { type: 'day', value: '30', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'month', value: '12', source: 'startRange' },
          { type: 'literal', value: '.', source: 'startRange' },
          { type: 'year', value: '1922', source: 'startRange' },
          { type: 'literal', value: ' – ', source: 'shared' },
          { type: 'day', value: '26', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'month', value: '12', source: 'endRange' },
          { type: 'literal', value: '.', source: 'endRange' },
          { type: 'year', value: '1991', source: 'endRange' }
        ]);
      });
      it('should throw a TypeError when called with dissimilar types', () =>
        throws(() => at.formatRangeToParts(Temporal.Instant.from(t1), Temporal.PlainDateTime.from(t2)), TypeError));
      it('should throw a RangeError when called with different calendars', () => {
        throws(
          () =>
            at.formatRangeToParts(
              Temporal.PlainDateTime.from(t1),
              Temporal.PlainDateTime.from(t2).withCalendar('japanese')
            ),
          RangeError
        );
        throws(
          () =>
            at.formatRangeToParts(Temporal.PlainDate.from(t1), Temporal.PlainDate.from(t2).withCalendar('japanese')),
          RangeError
        );
      });
      it('throws for two ZonedDateTimes with different time zones', () => {
        throws(
          () => us2.formatRangeToParts(Temporal.ZonedDateTime.from(t1), Temporal.ZonedDateTime.from(t2)),
          RangeError
        );
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
