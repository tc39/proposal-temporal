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
        eraYear: 51,
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
      const d = Temporal.PlainDate.from({ era: 'showa', eraYear: 51, month: 11, day: 18, calendar: 'japanese' });
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
      const ym = Temporal.PlainYearMonth.from({ era: 'showa', eraYear: 51, month: 11, calendar: 'japanese' });
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
    const monthday = Temporal.PlainMonthDay.from({ monthCode: 'M11', day: 18, calendar });
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
      const md = Temporal.PlainMonthDay.from({ monthCode: 'M11', day: 18, calendar: 'japanese' });
      equal(`${md.toLocaleString('en-US-u-ca-japanese')}`, '11/18');
    });
    it('throws when the calendar is not equal to the locale calendar', () => {
      const mdISO = Temporal.PlainMonthDay.from({ month: 11, day: 18 });
      throws(() => mdISO.toLocaleString('en-US-u-ca-japanese'), RangeError);
    });
  });

  describe('Non-ISO Calendars', () => {
    const testChineseData = new Date('2001-02-01T00:00Z').toLocaleString('en-US-u-ca-chinese', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      era: 'short',
      timeZone: 'UTC'
    });
    const hasOutdatedChineseIcuData = !testChineseData.endsWith('2001');
    const itOrSkip = (id) => ((id === 'chinese' || id === 'dangi') && hasOutdatedChineseIcuData ? it.skip : it);
    const nodeVersion = process.versions.node.split('.')[0];

    it('verify that Intl.DateTimeFormat.formatToParts output matches snapshot data', () => {
      // This test isn't testing Temporal. Instead, it's verifying that the
      // output of Intl.DateTimeFormat.formatToParts for non-ISO calendars
      // hasn't changed. There are a number of outstanding bugs in this output
      // that, when fixed, will break other tests. So this test is a signal that
      // other tests are broken because the comparison data needs to be updated,
      // not necessarily because Temporal is broken.
      const getLocalizedDates = (isoString) => {
        const calendars = [
          'iso8601',
          'buddhist',
          'chinese',
          'coptic',
          'dangi',
          'ethioaa',
          'ethiopic',
          'gregory',
          'hebrew',
          'indian',
          'islamic',
          'islamic-umalqura',
          'islamic-tbla',
          'islamic-civil',
          'islamic-rgsa',
          'islamicc',
          'japanese',
          'persian',
          'roc'
        ];
        const date = new Date(isoString);
        return calendars
          .map((id) => `${id}: ${date.toLocaleDateString(`en-US-u-ca-${id}`, { timeZone: 'UTC' })}`)
          .join('\n');
      };
      const year2000Content = getLocalizedDates('2000-01-01T00:00Z');
      // to generate snapshot: `          '${year2000Content.replaceAll('\n', "\\n' +\n          '")}',\n`
      const year1Content = getLocalizedDates('0001-01-01T00:00Z');
      // to generate snapshot: `          '${year1Content.replaceAll('\n', "\\n' +\n          '")}',\n`

      const year2000Snapshots = {
        node12:
          'iso8601: 1/1/2000\n' +
          'buddhist: 1/1/2543\n' +
          'chinese: 11/25/16\n' +
          'coptic: 4/22/1716\n' +
          'dangi: 11/25/16\n' +
          'ethioaa: 4/22/7492\n' +
          'ethiopic: 4/22/1992\n' +
          'gregory: 1/1/2000\n' +
          'hebrew: 4/23/5760\n' +
          'indian: 10/11/1921\n' +
          'islamic: 9/25/1420\n' +
          'islamic-umalqura: 9/24/1420\n' +
          'islamic-tbla: 9/25/1420\n' +
          'islamic-civil: 9/24/1420\n' +
          'islamic-rgsa: 9/25/1420\n' +
          'islamicc: 9/24/1420\n' +
          'japanese: 1/1/12\n' +
          'persian: 10/11/1378\n' +
          'roc: 1/1/89',
        node14:
          'iso8601: 1/1/2000\n' +
          'buddhist: 1/1/2543 BE\n' +
          'chinese: 11/25/1999\n' +
          'coptic: 4/22/1716 ERA1\n' +
          'dangi: 11/25/1999\n' +
          'ethioaa: 4/22/7492 ERA0\n' +
          'ethiopic: 4/22/1992 ERA1\n' +
          'gregory: 1/1/2000\n' +
          'hebrew: 23 Tevet 5760\n' +
          'indian: 10/11/1921 Saka\n' +
          'islamic: 9/25/1420 AH\n' +
          'islamic-umalqura: 9/24/1420 AH\n' +
          'islamic-tbla: 9/25/1420 AH\n' +
          'islamic-civil: 9/24/1420 AH\n' +
          'islamic-rgsa: 9/25/1420 AH\n' +
          'islamicc: 9/24/1420 AH\n' +
          'japanese: 1/1/12 H\n' +
          'persian: 10/11/1378 AP\n' +
          'roc: 1/1/89 Minguo',
        node16:
          'iso8601: 1/1/2000\n' +
          'buddhist: 1/1/2543 BE\n' +
          'chinese: 11/25/1999\n' +
          'coptic: 4/22/1716 ERA1\n' +
          'dangi: 11/25/1999\n' +
          'ethioaa: 4/22/7492 ERA0\n' +
          'ethiopic: 4/22/1992 ERA1\n' +
          'gregory: 1/1/2000\n' +
          'hebrew: 23 Tevet 5760\n' +
          'indian: 10/11/1921 Saka\n' +
          'islamic: 9/25/1420 AH\n' +
          'islamic-umalqura: 9/24/1420 AH\n' +
          'islamic-tbla: 9/25/1420 AH\n' +
          'islamic-civil: 9/24/1420 AH\n' +
          'islamic-rgsa: 9/25/1420 AH\n' +
          'islamicc: 9/24/1420 AH\n' +
          'japanese: 1/1/12 H\n' +
          'persian: 10/11/1378 AP\n' +
          'roc: 1/1/89 Minguo'
      };
      equal(year2000Content, year2000Snapshots[`node${nodeVersion}`]);

      const year1Snapshots = {
        node12:
          'iso8601: 1/1/1\n' +
          'buddhist: 1/3/544\n' +
          'chinese: 11/21/57\n' +
          'coptic: 5/8/284\n' +
          'dangi: 11/21/57\n' +
          'ethioaa: 5/8/5493\n' +
          'ethiopic: 5/8/5493\n' +
          'gregory: 1/1/1\n' +
          'hebrew: 4/18/3761\n' +
          'indian: 10/11/-78\n' +
          'islamic: -7/20/-639\n' +
          'islamic-umalqura: 5/18/-640\n' +
          'islamic-tbla: 5/19/-640\n' +
          'islamic-civil: 5/18/-640\n' +
          'islamic-rgsa: -7/20/-639\n' +
          'islamicc: 5/18/-640\n' +
          'japanese: 1/3/-643\n' +
          'persian: 10/11/-621\n' +
          'roc: 1/3/1911',
        node14:
          'iso8601: 1/1/1\n' +
          'buddhist: 1/3/544 BE\n' +
          'chinese: 11/21/0\n' +
          'coptic: 5/8/284 ERA0\n' +
          'dangi: 11/21/0\n' +
          'ethioaa: 5/8/5493 ERA0\n' +
          'ethiopic: 5/8/5493 ERA0\n' +
          'gregory: 1/1/1\n' +
          'hebrew: 18 Tevet 3761\n' +
          'indian: 10/11/-78 Saka\n' +
          'islamic: 5/20/-640 AH\n' +
          'islamic-umalqura: 5/18/-640 AH\n' +
          'islamic-tbla: 5/19/-640 AH\n' +
          'islamic-civil: 5/18/-640 AH\n' +
          'islamic-rgsa: 5/20/-640 AH\n' +
          'islamicc: 5/18/-640 AH\n' +
          'japanese: 1/3/-643 Taika (645–650)\n' +
          'persian: 10/11/-621 AP\n' +
          'roc: 1/3/1911 Before R.O.C.',
        node16:
          'iso8601: 1/1/1\n' +
          'buddhist: 1/3/544 BE\n' +
          'chinese: 11/21/0\n' +
          'coptic: 5/8/284 ERA0\n' +
          'dangi: 11/21/0\n' +
          'ethioaa: 5/8/5493 ERA0\n' +
          'ethiopic: 5/8/5493 ERA0\n' +
          'gregory: 1/1/1\n' +
          'hebrew: 18 Tevet 3761\n' +
          'indian: 10/11/-78 Saka\n' +
          'islamic: 5/20/-640 AH\n' +
          'islamic-umalqura: 5/18/-640 AH\n' +
          'islamic-tbla: 5/19/-640 AH\n' +
          'islamic-civil: 5/18/-640 AH\n' +
          'islamic-rgsa: 5/20/-640 AH\n' +
          'islamicc: 5/18/-640 AH\n' +
          'japanese: 1/3/-643 Taika (645–650)\n' +
          'persian: 10/11/-621 AP\n' +
          'roc: 1/3/1911 Before R.O.C.'
      };
      equal(year1Content, year1Snapshots[`node${nodeVersion}`]);
    });

    const fromWithCases = {
      iso8601: { year2000: { year: 2000, month: 1, day: 1 }, year1: { year: 1, month: 1, day: 1 } },
      buddhist: {
        year2000: { year: 2543, month: 1, day: 1, era: 'be' },
        // Pre-1582 (ISO) dates are broken by https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
        year1: RangeError
        // year1: { year: 544, month: 1, day: 1, era: 'be' }
      },
      chinese: {
        year2000: { year: 1999, month: 11, day: 25 },
        // There's a 3bis (4th month) leap month in this year
        year1: { year: 0, month: 12, monthCode: 'M11', day: 21 }
      },
      coptic: {
        year2000: { year: 1716, month: 4, day: 22, era: 'era1' },
        year1: { year: -283, eraYear: 284, month: 5, day: 8, era: 'era0' }
      },
      dangi: {
        year2000: { year: 1999, month: 11, day: 25 },
        // There's a 3bis (4th month) leap month in this year
        year1: { year: 0, month: 12, monthCode: 'M11', day: 21 }
      },
      ethioaa: {
        year2000: { year: 7492, month: 4, day: 22, era: 'era0' },
        year1: { year: 5493, month: 5, day: 8, era: 'era0' }
      },
      ethiopic: {
        year2000: { eraYear: 1992, year: 7492, month: 4, day: 22, era: 'era1' },
        year1: { year: 5493, month: 5, day: 8, era: 'era0' }
      },
      gregory: {
        year2000: { year: 2000, month: 1, day: 1, era: 'ce' },
        year1: { year: 1, month: 1, day: 1, era: 'ce' }
      },
      hebrew: { year2000: { year: 5760, month: 4, day: 23 }, year1: { year: 3761, month: 4, day: 18 } },
      indian: {
        year2000: { year: 1921, month: 10, day: 11, era: 'saka' },
        // with() fails due to https://bugs.chromium.org/p/v8/issues/detail?id=10529
        // from() succeeds because the bug only gets triggered before 1/1/1 ISO.
        // Fixed in later versions of Node 14/15/16
        year1: {
          with: { node12: RangeError, year: -78, month: 10, day: 11, era: 'saka' },
          from: { year: -78, month: 10, day: 11, era: 'saka' }
        }
      },
      // Older islamic dates will fail due to https://bugs.chromium.org/p/v8/issues/detail?id=10527
      // Fixed in later versions of Node 14/15/16
      islamic: {
        year2000: { year: 1420, month: 9, day: 25, era: 'ah' },
        year1: { node12: RangeError, year: -640, month: 5, day: 20, era: 'ah' }
      },
      'islamic-umalqura': {
        year2000: { year: 1420, month: 9, day: 24, era: 'ah' },
        year1: { year: -640, month: 5, day: 18, era: 'ah' }
      },
      'islamic-tbla': {
        year2000: { year: 1420, month: 9, day: 25, era: 'ah' },
        year1: { year: -640, month: 5, day: 19, era: 'ah' }
      },
      'islamic-civil': {
        year2000: { year: 1420, month: 9, day: 24, era: 'ah' },
        year1: { year: -640, month: 5, day: 18, era: 'ah' }
      },
      'islamic-rgsa': {
        year2000: { year: 1420, month: 9, day: 25, era: 'ah' },
        year1: { node12: RangeError, year: -640, month: 5, day: 20, era: 'ah' }
      },
      islamicc: {
        year2000: { year: 1420, month: 9, day: 24, era: 'ah' },
        year1: { year: -640, month: 5, day: 18, era: 'ah' }
      },
      japanese: {
        year2000: { year: 2000, eraYear: 12, month: 1, day: 1, era: 'heisei' },
        // Pre-1582 dates are broken by https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
        year1: RangeError
        // year1: { year: 1, eraYear: 1, month: 1, day: 1, era: 'ce' }
      },
      persian: {
        year2000: { year: 1378, month: 10, day: 11, era: 'ap' },
        year1: { year: -621, month: 10, day: 11, era: 'ap' }
      },
      roc: {
        year2000: { year: 89, month: 1, day: 1, era: 'minguo' },
        // Pre-1582 dates are broken by https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
        year1: RangeError
        // year1: { year: -1910, eraYear: 1911, month: 1, day: 3, era: 'before-roc' }
      }
    };
    // The current non-ISO calendar implementation is quite slow because it's
    // not calculating calendar info directly but is parsing the output of
    // `Intl.DateTimeFormat.formatToParts`. The advantage of this approach for a
    // non-production polyfill is that the results of Temporal will always match
    // the results of legacy Date and Intl calls. The downside is that it's
    // slooooooooow! To help diagnose and fix perf issues in future PRs, we're
    // leaving logging code below which would normally have been removed. To
    // measure perf, just set logPerf=true.
    const logPerf = false;
    let totalNow = 0;
    for (let [id, tests] of Object.entries(fromWithCases)) {
      const dates = {
        year2000: Temporal.PlainDate.from('2000-01-01'),
        year1: Temporal.PlainDate.from('0001-01-01')
      };
      for (const [name, date] of Object.entries(dates)) {
        const getValues = (type) => {
          let val = tests[name];
          if (val[type]) val = val[type];
          return val;
        };
        const fromValues = getValues('from');
        const fromErrorExpected =
          fromValues === RangeError || (nodeVersion === '12' && fromValues.node12 === RangeError);
        itOrSkip(id)(`from: ${id} ${name} ${fromErrorExpected ? ' (throws)' : ''}`, () => {
          const now = globalThis.performance ? globalThis.performance.now() : Date.now();
          const values = fromValues;
          if (fromErrorExpected) {
            // Some calendars will fail due to Chromium bugs noted in the test definitions
            throws(() => {
              const inCal = date.withCalendar(id);
              Temporal.PlainDate.from({
                calendar: id,
                year: inCal.year,
                day: inCal.day,
                monthCode: inCal.monthCode
              });
            }, RangeError);
            return;
          }
          const inCal = date.withCalendar(id);
          equal(`${name} ${id} day: ${inCal.day}`, `${name} ${id} day: ${values.day}`);
          if (values.eraYear === undefined && values.era !== undefined) values.eraYear = values.year;

          equal(`${name} ${id} eraYear: ${inCal.eraYear}`, `${name} ${id} eraYear: ${values.eraYear}`);
          equal(`${name} ${id} era: ${inCal.era}`, `${name} ${id} era: ${values.era}`);
          equal(`${name} ${id} year: ${inCal.year}`, `${name} ${id} year: ${values.year}`);

          equal(`${name} ${id} month: ${inCal.month}`, `${name} ${id} month: ${values.month}`);
          if (values.monthCode === undefined) values.monthCode = `M${values.month.toString().padStart(2, '0')}`;
          equal(`${name} ${id} monthCode: ${inCal.monthCode}`, `${name} ${id} monthCode: ${values.monthCode}`);

          if (values.era) {
            // Now reverse the operation: create using calendar dates and verify
            // that the same ISO date is returned.
            const dateRoundtrip1 = Temporal.PlainDate.from({
              calendar: id,
              eraYear: values.eraYear,
              era: values.era,
              day: values.day,
              monthCode: values.monthCode
            });
            equal(dateRoundtrip1.toString(), inCal.toString());

            // ensure that mismatches of year vs. era/eraYear are caught
            throws(
              () =>
                Temporal.PlainDate.from({
                  calendar: id,
                  eraYear: values.eraYear,
                  era: values.era,
                  day: values.day,
                  monthCode: values.monthCode,
                  year: values.year + 1
                }),
              RangeError
            );
          }
          const dateRoundtrip2 = Temporal.PlainDate.from({
            calendar: id,
            year: values.year,
            day: values.day,
            monthCode: values.monthCode
          });
          equal(dateRoundtrip2.toString(), inCal.toString());
          const dateRoundtrip3 = Temporal.PlainDate.from({
            calendar: id,
            year: values.year,
            day: values.day,
            month: values.month
          });
          equal(dateRoundtrip3.toString(), inCal.toString());
          const dateRoundtrip4 = Temporal.PlainDate.from({
            calendar: id,
            year: values.year,
            day: values.day,
            monthCode: values.monthCode
          });
          equal(dateRoundtrip4.toString(), inCal.toString());
          // ensure that mismatches of month vs. monthCode are caught
          throws(
            () =>
              Temporal.PlainDate.from({
                calendar: id,
                day: values.day,
                month: values.month === 1 ? 2 : values.month - 1,
                monthCode: values.monthCode,
                year: values.year
              }),
            RangeError
          );
          const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - now;
          totalNow += ms;
          // eslint-disable-next-line no-console
          if (logPerf) console.log(`from: ${id} ${name}: ${ms.toFixed(2)}ms, total: ${totalNow.toFixed(2)}ms`);
        });
        const withValues = getValues('with');
        const withErrorExpected =
          withValues === RangeError || (nodeVersion === '12' && withValues.node12 === RangeError);
        itOrSkip(id)(`with: ${id} ${name} ${withErrorExpected ? ' (throws)' : ''}`, () => {
          const now = globalThis.performance ? globalThis.performance.now() : Date.now();
          const inCal = date.withCalendar(id);
          if (withErrorExpected) {
            // Some calendars will fail due to Chromium bugs noted in the test definitions
            throws(() => inCal.with({ day: 1 }).year, RangeError);
            return;
          }
          const afterWithDay = inCal.with({ day: 1 });
          let t = '(after setting day)';
          equal(`${t} year: ${afterWithDay.year}`, `${t} year: ${inCal.year}`);
          equal(`${t} month: ${afterWithDay.month}`, `${t} month: ${inCal.month}`);
          equal(`${t} day: ${afterWithDay.day}`, `${t} day: 1`);
          const afterWithMonth = afterWithDay.with({ month: 1 });
          t = '(after setting month)';
          equal(`${t} year: ${afterWithMonth.year}`, `${t} year: ${inCal.year}`);
          equal(`${t} month: ${afterWithMonth.month}`, `${t} month: 1`);
          equal(`${t} day: ${afterWithMonth.day}`, `${t} day: 1`);
          // FYI: we're using 2220 here because it's larger than the ISO year 1582
          // in all calendars affected by https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
          const afterWithYear = afterWithMonth.with({ year: 2220 });
          t = '(after setting year)';
          equal(`${t} year: ${afterWithYear.year}`, `${t} year: 2220`);
          equal(`${t} month: ${afterWithYear.month}`, `${t} month: 1`);
          equal(`${t} day: ${afterWithYear.day}`, `${t} day: 1`);
          const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - now;
          totalNow += ms;
          // eslint-disable-next-line no-console
          if (logPerf) console.log(`with: ${id} ${name}: ${ms.toFixed(2)}ms, total: ${totalNow.toFixed(2)}ms`);
        });
      }
    }
    /*
      // This code below is useful for generating the snapshot content below in
      // case more variations are needed.
      year1Content = ['iso8601', 'buddhist', 'chinese', 'coptic', 'dangi', 'ethioaa', 'ethiopic', 'gregory', 'hebrew',
          'indian', 'islamic', 'islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc',
          'japanese', 'persian', 'roc'].map((id) => {
        const end = Temporal.PlainDate.from({ year: 2000, month: 1, day: 1, calendar: id }).add({months: 6});
        const { year, month, day, monthCode, eraYear, era } = end;
        const quotedId = id.includes('-') ? `'${id}'` : id;
        return `  ${quotedId}: { year: ${year}, month: ${month}, day: ${day}, monthCode: 'M${monthCode
                }', eraYear: ${eraYear}, era: ${era ? `'${era}'` : undefined} }`;
      }).join(',\n');
    */
    const addDaysWeeksCases = {
      iso8601: { year: 2000, month: 10, day: 7, monthCode: 'M10', eraYear: undefined, era: undefined },
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
      buddhist: RangeError, // { year: 2000, month: 10, day: 8, monthCode: 'M10', eraYear: 2000, era: 'be' },
      chinese: { year: 2000, month: 10, day: 16, monthCode: 'M10', eraYear: undefined, era: undefined },
      coptic: { year: 2000, month: 10, day: 11, monthCode: 'M10', eraYear: 2000, era: 'era1' },
      dangi: { year: 2000, month: 10, day: 16, monthCode: 'M10', eraYear: undefined, era: undefined },
      ethioaa: { year: 2000, month: 10, day: 11, monthCode: 'M10', eraYear: 2000, era: 'era0' },
      ethiopic: { year: 2000, month: 10, day: 11, monthCode: 'M10', eraYear: 2000, era: 'era0' },
      gregory: { year: 2000, month: 10, day: 7, monthCode: 'M10', eraYear: 2000, era: 'ce' },
      hebrew: { year: 2000, month: 10, day: 14, monthCode: 'M10', eraYear: undefined, era: undefined },
      indian: { year: 2000, month: 10, day: 6, monthCode: 'M10', eraYear: 2000, era: 'saka' },
      islamic: { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      'islamic-umalqura': { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      'islamic-tbla': { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      'islamic-civil': { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      'islamic-rgsa': { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      islamicc: { year: 2000, month: 10, day: 15, monthCode: 'M10', eraYear: 2000, era: 'ah' },
      japanese: { year: 2000, month: 10, day: 7, monthCode: 'M10', eraYear: 12, era: 'heisei' },
      persian: { year: 2000, month: 10, day: 5, monthCode: 'M10', eraYear: 2000, era: 'ap' },
      roc: { year: 2000, month: 10, day: 8, monthCode: 'M10', eraYear: 2000, era: 'minguo' }
    };
    const addMonthsCases = {
      iso8601: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: undefined, era: undefined },
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
      buddhist: RangeError, // { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'be' },
      chinese: { year: 2001, month: 6, day: 1, monthCode: 'M05', eraYear: undefined, era: undefined },
      coptic: { year: 2001, month: 5, day: 1, monthCode: 'M05', eraYear: 2001, era: 'era1' },
      dangi: { year: 2001, month: 6, day: 1, monthCode: 'M05', eraYear: undefined, era: undefined },
      ethioaa: { year: 2001, month: 5, day: 1, monthCode: 'M05', eraYear: 2001, era: 'era0' },
      ethiopic: { year: 2001, month: 5, day: 1, monthCode: 'M05', eraYear: 2001, era: 'era0' },
      gregory: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ce' },
      hebrew: { year: 2001, month: 6, day: 1, monthCode: 'M05L', eraYear: undefined, era: undefined },
      indian: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'saka' },
      islamic: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      'islamic-umalqura': { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      'islamic-tbla': { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      'islamic-civil': { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      'islamic-rgsa': { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      islamicc: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ah' },
      japanese: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 13, era: 'heisei' },
      persian: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'ap' },
      roc: { year: 2001, month: 6, day: 1, monthCode: 'M06', eraYear: 2001, era: 'minguo' }
    };
    const addYearsMonthsDaysCases = Object.entries(addMonthsCases).reduce((obj, entry) => {
      obj[entry[0]] = entry[1] === RangeError ? RangeError : { ...entry[1], day: 4 };
      return obj;
    }, {});
    const tests = {
      days: { duration: { days: 280 }, results: addDaysWeeksCases, startDate: { year: 2000, month: 1, day: 1 } },
      weeks: { duration: { weeks: 40 }, results: addDaysWeeksCases, startDate: { year: 2000, month: 1, day: 1 } },
      // 2001 is a leap year in both ICU lunisolar calendars: Hebrew and
      // Chinese/Dangi. By adding 6 months we're ensuring that addition
      // recognizes the leap month.
      months: { duration: { months: 6 }, results: addMonthsCases, startDate: { year: 2000, month: 12, day: 1 } },
      years: {
        duration: { years: 3, months: 6, days: 3 },
        results: addYearsMonthsDaysCases,
        startDate: { year: 1997, month: 12, day: 1 }
      }
    };
    const calendars = Object.keys(addMonthsCases);
    for (let id of calendars) {
      for (let [unit, { duration, results, startDate }] of Object.entries(tests)) {
        const values = results[id];
        duration = Temporal.Duration.from(duration);
        itOrSkip(id)(`${id} add ${duration}`, () => {
          const now = globalThis.performance ? globalThis.performance.now() : Date.now();
          if (values === RangeError) {
            throws(() => Temporal.PlainDate.from({ ...startDate, calendar: id }));
            return;
          }
          const start = Temporal.PlainDate.from({ ...startDate, calendar: id });
          const end = start.add(duration);
          equal(`add ${unit} ${id} day: ${end.day}`, `add ${unit} ${id} day: ${values.day}`);
          equal(`add ${unit} ${id} eraYear: ${end.eraYear}`, `add ${unit} ${id} eraYear: ${values.eraYear}`);
          equal(`add ${unit} ${id} era: ${end.era}`, `add ${unit} ${id} era: ${values.era}`);
          equal(`add ${unit} ${id} year: ${end.year}`, `add ${unit} ${id} year: ${values.year}`);
          equal(`add ${unit} ${id} month: ${end.month}`, `add ${unit} ${id} month: ${values.month}`);
          equal(`add ${unit} ${id} monthCode: ${end.monthCode}`, `add ${unit} ${id} monthCode: ${values.monthCode}`);
          const calculatedStart = end.subtract(duration);
          equal(`start ${calculatedStart.toString()}`, `start ${start.toString()}`);
          const diff = start.until(end, { largestUnit: unit });
          equal(`diff ${unit} ${id}: ${diff}`, `diff ${unit} ${id}: ${duration}`);
          const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - now;
          totalNow += ms;
          // eslint-disable-next-line no-console
          if (logPerf) console.log(`${id} add ${duration}: ${ms.toFixed(2)}ms, total: ${totalNow.toFixed(2)}ms`);
        });
      }
    }
    /*
      // content for tests below
      ['iso8601', 'buddhist', 'chinese', 'coptic', 'dangi', 'ethioaa', 'ethiopic', 'gregory', hebrew',
                'indian', 'islamic', 'islamic-umalqura', 'islamic-tbla', 'islamic-civil', 'islamic-rgsa', 'islamicc',
                'japanese', 'persian', 'roc'].map((id) => {
        const date = Temporal.PlainDate.from({ year: 2001, month: 1, day: 1, calendar: id });
        const monthsInYear = date.monthsInYear;
        const daysInMonthArray = [];
        let { year, inLeapYear: leap } = date;
        for (let i = 1; i <= monthsInYear; i++) {
          const monthStart = date.with({month: i});
          const { monthCode, daysInMonth } = monthStart;
          daysInMonthArray.push(monthStart.daysInMonth);
          if (monthStart.monthCode.endsWith('L')) leap = `'M${monthCode}'`;
        }
        const quotedId = id.includes('-') ? `'${id}'` : id;
        return `${quotedId}: { year: ${year}, leap: ${leap}, days: [${daysInMonthArray.join(', ')}] }`;
      }).join(',\n');
    */
    const daysInMonthCases = {
      iso8601: { year: 2001, leap: false, days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] },
      // Buddhist uses 4001 to avoid https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
      buddhist: { year: 4001, leap: false, days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] },
      chinese: { year: 2001, leap: 'M04L', days: [30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30] },
      coptic: { year: 2001, leap: false, days: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5] },
      dangi: { year: 2001, leap: 'M04L', days: [30, 30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 29, 30] },
      ethioaa: { year: 2001, leap: false, days: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5] },
      ethiopic: { year: 2001, leap: false, days: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5] },
      gregory: { year: 2001, leap: false, days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] },
      hebrew: { year: 2001, leap: 'M05L', days: [30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29] },
      indian: { year: 2001, leap: false, days: [30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30] },
      islamic: { year: 2001, leap: false, days: [29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29] },
      'islamic-umalqura': { year: 2001, leap: true, days: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30] },
      'islamic-tbla': { year: 2001, leap: true, days: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30] },
      'islamic-civil': { year: 2001, leap: true, days: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30] },
      'islamic-rgsa': { year: 2001, leap: false, days: [29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29] },
      islamicc: { year: 2001, leap: true, days: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30] },
      japanese: { year: 2001, leap: false, days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] },
      persian: { year: 2001, leap: false, days: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29] },
      roc: { year: 2001, leap: true, days: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }
    };
    totalNow = 0;
    for (let id of calendars) {
      let { year, leap, days } = daysInMonthCases[id];
      let date =
        hasOutdatedChineseIcuData && (id === 'chinese' || id === 'dangi')
          ? undefined
          : Temporal.PlainDate.from({ year, month: 1, day: 1, calendar: id });
      itOrSkip(id)(`${id} leap year check for year ${year}`, () => {
        if (typeof leap === 'boolean') {
          equal(date.inLeapYear, leap);
        } else {
          equal(date.inLeapYear, true);
          const leapMonth = date.with({ monthCode: leap });
          equal(leapMonth.monthCode, leap);
        }
      });
      itOrSkip(id)(`${id} months check for year ${year}`, () => {
        const now = globalThis.performance ? globalThis.performance.now() : Date.now();
        const { monthsInYear } = date;
        equal(monthsInYear, days.length);
        // This loop counts backwards so we'll have the right test for the month
        // before a leap month in lunisolar calendars.
        for (let i = monthsInYear, leapMonthIndex = undefined, monthStart = undefined; i >= 1; i--) {
          monthStart = monthStart ? monthStart.add({ months: -1 }) : date.add({ months: monthsInYear - 1 });
          const { month, monthCode, daysInMonth } = monthStart;
          equal(
            `${id} month ${i} (code ${monthCode}) days: ${daysInMonth}`,
            `${id} month ${i} (code ${monthCode}) days: ${days[i - 1]}`
          );
          if (monthCode.endsWith('L')) {
            equal(date.with({ monthCode }).monthCode, monthCode);
            leapMonthIndex = i;
          } else {
            if (leapMonthIndex && i === leapMonthIndex - 1) {
              const inLeapMonth = monthStart.with({ monthCode: `M${month.toString().padStart(2, '0')}L` });
              equal(inLeapMonth.monthCode, `${monthCode}L`);
            } else {
              throws(
                () => monthStart.with({ monthCode: `M${month.toString().padStart(2, '0')}L` }, { overflow: 'reject' }),
                RangeError
              );
              if (['chinese', 'dangi'].includes(id)) {
                if (i === 1 || i === 12 || i === 13) {
                  throws(() => monthStart.with({ monthCode: `M${month.toString().padStart(2, '0')}L` }), RangeError);
                } else {
                  // verify that non-leap "L" months are constrained down to last day of previous month
                  const fakeL = monthStart.with({ monthCode: `M${month.toString().padStart(2, '0')}L`, day: 5 });
                  equal(`fake leap month ${fakeL.monthCode}`, `fake leap month M${month.toString().padStart(2, '0')}`);
                  equal(fakeL.day, fakeL.daysInMonth);
                }
              }
            }
            if (!['chinese', 'dangi', 'hebrew'].includes(id)) {
              // leap months should only be allowed for lunisolar calendars
              throws(() => monthStart.with({ monthCode: `M${month.toString().padStart(2, '0')}L` }), RangeError);
            }
          }
          throws(() => monthStart.with({ day: daysInMonth + 1 }, { overflow: 'reject' }), RangeError);
          const oneDayPastMonthEnd = monthStart.with({ day: daysInMonth + 1 });
          equal(oneDayPastMonthEnd.day, daysInMonth);
        }
        const ms = (globalThis.performance ? globalThis.performance.now() : Date.now()) - now;
        totalNow += ms;
        // eslint-disable-next-line no-console
        if (logPerf) console.log(`${id} months check ${id}: ${ms.toFixed(2)}ms, total: ${totalNow.toFixed(2)}ms`);
      });
    }
    const monthDayCases = [
      { calendar: 'iso8601', isoReferenceYear: 1972, year: 2004, month: 2, day: 29 },
      // Buddhist calendar suffers pre-node15 https://bugs.chromium.org/p/chromium/issues/detail?id=1173158
      { calendar: 'buddhist', nodeBefore15: RangeError, isoReferenceYear: 1972, year: 2004, month: 2, day: 29 },
      { calendar: 'chinese', isoReferenceYear: 1963, year: 2001, month: 5, monthCode: 'M04L', day: 15 },
      { calendar: 'chinese', isoReferenceYear: 1971, year: 2000, month: 6, day: 30 },
      { calendar: 'coptic', isoReferenceYear: 1971, year: 2006, month: 13, day: 6 },
      { calendar: 'dangi', isoReferenceYear: 1963, year: 2001, month: 5, monthCode: 'M04L', day: 15 },
      { calendar: 'dangi', isoReferenceYear: 1971, year: 2000, month: 6, day: 30 },
      { calendar: 'ethiopic', isoReferenceYear: 1971, year: 2006, month: 13, day: 6 },
      { calendar: 'ethioaa', isoReferenceYear: 1971, year: 2006, month: 13, day: 6 },
      { calendar: 'gregory', isoReferenceYear: 1972, year: 2004, month: 2, day: 29 },
      { calendar: 'hebrew', isoReferenceYear: 1970, year: 5779, month: 6, monthCode: 'M05L', day: 15 },
      { calendar: 'hebrew', isoReferenceYear: 1971, year: 5776, month: 2, day: 30 },
      { calendar: 'hebrew', isoReferenceYear: 1971, year: 5772, month: 3, day: 30 },
      { calendar: 'indian', isoReferenceYear: 1968, year: 2002, month: 1, day: 31 },
      { calendar: 'islamic', isoReferenceYear: 1970, year: 2001, month: 1, day: 30 },
      { calendar: 'islamic-umalqura', isoReferenceYear: 1969, year: 2001, month: 1, day: 30 },
      { calendar: 'islamic-tbla', isoReferenceYear: 1971, year: 2001, month: 1, day: 30 },
      { calendar: 'islamic-civil', isoReferenceYear: 1971, year: 2001, month: 1, day: 30 },
      { calendar: 'islamic-rgsa', isoReferenceYear: 1970, year: 2001, month: 1, day: 30 },
      { calendar: 'islamicc', isoReferenceYear: 1971, year: 2001, month: 1, day: 30 },
      { calendar: 'japanese', isoReferenceYear: 1972, year: 2004, month: 2, day: 29 },
      { calendar: 'persian', isoReferenceYear: 1972, year: 2004, month: 12, day: 30 },
      { calendar: 'roc', isoReferenceYear: 1972, year: 93, month: 2, day: 29 }
    ];
    let i = 0;
    for (let test of monthDayCases) {
      const id = test.calendar;
      itOrSkip(`monthDay works for ${id} - ${++i}: ${test.monthCode || test.month}/${test.day}`, () => {
        const errorExpected =
          test === RangeError || ((nodeVersion === '14' || nodeVersion === '12') && test.nodeBefore15 === RangeError);
        if (errorExpected) {
          throws(() => Temporal.PlainMonthDay.from({ year, month, day, calendar }));
          return;
        }
        if (test.monthCode === undefined) test.monthCode = `M${test.month.toString().padStart(2, '0')}`;
        const { calendar, monthCode, month, day, year, isoReferenceYear } = test;
        const md = Temporal.PlainMonthDay.from({ year, month, day, calendar });
        const isoString = md.toString();
        const mdFromIso = Temporal.PlainMonthDay.from(isoString);
        equal(mdFromIso, md);
        const isoFields = md.getISOFields();
        equal(md.monthCode, monthCode);
        equal(md.day, day);
        equal(isoFields.isoYear, isoReferenceYear);
        const md2 = Temporal.PlainMonthDay.from({ monthCode, day, calendar });
        const isoFields2 = md2.getISOFields();
        equal(md2.monthCode, monthCode);
        equal(md2.day, day);
        equal(isoFields2.isoYear, isoReferenceYear);
        equal(md.equals(md2), true);
        throws(() => {
          Temporal.PlainMonthDay.from({ monthCode: 'M15', day: 1, calendar }, { overflow: 'reject' });
        }, RangeError);
        throws(() => {
          Temporal.PlainMonthDay.from({ monthCode: 'M15', day: 1, calendar });
        }, RangeError);
        throws(() => {
          Temporal.PlainMonthDay.from({ year, month: 15, day: 1, calendar }, { overflow: 'reject' });
        }, RangeError);
        const constrained = Temporal.PlainMonthDay.from({ year, month: 15, day: 1, calendar });
        const { monthCode: monthCodeConstrained } = constrained;
        assert(monthCodeConstrained === 'M12' || monthCodeConstrained === 'M13');
      });
    }
  });

  describe('Indian calendar', () => {
    it('throws in Node 12 & 14 before 1 CE', () => {
      // Dates before ISO 1 fail due to https://bugs.chromium.org/p/v8/issues/detail?id=10529
      // Fixed in Node 15
      const vulnerableToBceBug =
        new Date('0000-01-01T00:00Z').toLocaleDateString('en-US-u-ca-indian', { timeZone: 'UTC' }) !== '10/11/-79 Saka';
      if (vulnerableToBceBug) {
        throws(() => Temporal.PlainDate.from('0000-01-01').withCalendar('indian').day, RangeError);
      }
    });
    it('handles leap days', () => {
      const leapYearFirstDay = Temporal.PlainDate.from('2004-03-21[u-ca=indian]');
      equal(leapYearFirstDay.year, 2004 - 78);
      equal(leapYearFirstDay.month, 1);
      equal(leapYearFirstDay.day, 1);

      const leapYearLastDay = leapYearFirstDay.with({ day: 31 });
      equal(leapYearLastDay.year, 2004 - 78);
      equal(leapYearLastDay.month, 1);
      equal(leapYearLastDay.day, 31);
    });
    it('handles non-leap years', () => {
      const nonLeapYearFirstDay = Temporal.PlainDate.from('2005-03-22[u-ca=indian]');
      equal(nonLeapYearFirstDay.year, 2005 - 78);
      equal(nonLeapYearFirstDay.month, 1);
      equal(nonLeapYearFirstDay.day, 1);

      const leapYearLastDay = nonLeapYearFirstDay.with({ day: 31 });
      equal(leapYearLastDay.year, 2005 - 78);
      equal(leapYearLastDay.month, 1);
      equal(leapYearLastDay.day, 30);

      throws(() => nonLeapYearFirstDay.with({ day: 31 }, { overflow: 'reject' }));
    });
  });

  describe('Japanese eras', () => {
    it('Reiwa (2019-)', () => {
      let date = Temporal.PlainDate.from({ era: 'reiwa', eraYear: 2, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '2020-01-01[u-ca=japanese]');
    });
    it('Heisei (1989-2019)', () => {
      let date = Temporal.PlainDate.from({ era: 'heisei', eraYear: 2, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1990-01-01[u-ca=japanese]');
    });
    it('Showa (1926-1989)', () => {
      let date = Temporal.PlainDate.from({ era: 'showa', eraYear: 2, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1927-01-01[u-ca=japanese]');
    });
    it('Taisho (1912-1926)', () => {
      let date = Temporal.PlainDate.from({ era: 'taisho', eraYear: 2, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1913-01-01[u-ca=japanese]');
    });
    it('Meiji (1868-1912)', () => {
      let date = Temporal.PlainDate.from({ era: 'meiji', eraYear: 2, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1869-01-01[u-ca=japanese]');
    });
    it('Dates in same year before Japanese era starts will resolve to previous era', () => {
      let date = Temporal.PlainDate.from({ era: 'reiwa', eraYear: 1, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '2019-01-01[u-ca=japanese]');
      equal(date.era, 'heisei');
      equal(date.eraYear, 31);
      date = Temporal.PlainDate.from({ era: 'heisei', eraYear: 1, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1989-01-01[u-ca=japanese]');
      equal(date.era, 'showa');
      equal(date.eraYear, 64);
      date = Temporal.PlainDate.from({ era: 'showa', eraYear: 1, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1926-01-01[u-ca=japanese]');
      equal(date.era, 'taisho');
      equal(date.eraYear, 15);
      date = Temporal.PlainDate.from({ era: 'taisho', eraYear: 1, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1912-01-01[u-ca=japanese]');
      equal(date.era, 'meiji');
      equal(date.eraYear, 45);
      date = Temporal.PlainDate.from({ era: 'meiji', eraYear: 1, month: 1, day: 1, calendar: 'japanese' });
      equal(`${date}`, '1868-01-01[u-ca=japanese]');
      equal(date.era, 'ce');
      equal(date.eraYear, 1868);
      throws(
        () => Temporal.PlainDate.from({ era: 'bce', eraYear: 1, month: 1, day: 1, calendar: 'japanese' }),
        RangeError
      );
      // uncomment & revise `throws` above if https://bugs.chromium.org/p/chromium/issues/detail?id=1173158 is resolved
      // equal(`${date}`, '+000000-01-01[u-ca=japanese]');
      // equal(date.era, 'bce');
      // equal(date.eraYear, 1);
    });
  });

  describe('Hebrew leap months', () => {
    it('Valid leap month: Adar I 5779', () => {
      let date = Temporal.PlainDate.from({ year: 5779, month: 6, day: 1, calendar: 'hebrew' });
      equal(date.month, 6);
      equal(date.monthCode, 'M05L');
      equal(date.day, 1);
      date = Temporal.PlainDate.from({ year: 5779, monthCode: 'M05L', day: 1, calendar: 'hebrew' });
      equal(date.month, 6);
      equal(date.monthCode, 'M05L');
      equal(date.day, 1);
    });
    it('Invalid leap months: e.g. M02L', () => {
      for (let i = 1; i <= 12; i++) {
        if (i === 5) continue; // M05L is the only valid month (Adar I)
        throws(
          () =>
            Temporal.PlainDate.from({
              year: 5779,
              monthCode: `M${i.toString().padStart(2, '0')}L`,
              day: 1,
              calendar: 'hebrew'
            }),
          RangeError
        );
      }
    });
    it('Leap month in non-leap year (reject): Adar I 5780', () => {
      throws(
        () =>
          Temporal.PlainDate.from(
            { year: 5780, monthCode: 'M05L', day: 1, calendar: 'hebrew' },
            { overflow: 'reject' }
          ),
        RangeError
      );
    });
    it('Leap month in non-leap year (constrain): 15 Adar I 5780 => 30 Av 5780', () => {
      const date = Temporal.PlainDate.from({ year: 5780, monthCode: 'M05L', day: 15, calendar: 'hebrew' });
      equal(date.month, 5);
      equal(date.monthCode, 'M05');
      equal(date.day, 30);
    });
  });

  describe('DateTimeFormat', () => {
    describe('supportedLocalesOf', () => {
      it('should return an Array', () => assert(Array.isArray(Intl.DateTimeFormat.supportedLocalesOf())));
    });

    // Verify that inputs to DateTimeFormat constructor are immune to mutation.
    // Also verify that options properties are only read once.
    const onlyOnce = (value) => {
      const obj = {
        calls: 0,
        toString() {
          if (++this.calls > 1) throw new RangeError('prop read twice');
          return value;
        }
      };
      return obj;
    };
    const optionsAT = {
      timeZone: onlyOnce('Europe/Vienna')
    };
    const optionsUS = {
      calls: 0,
      value: 'America/New_York',
      get timeZone() {
        if (++this.calls > 1) throw new RangeError('prop read twice');
        return this.value;
      },
      set timeZone(val) {
        this.value = val;
      }
    };
    const localesAT = ['de-AT'];
    const us = new Intl.DateTimeFormat('en-US', optionsUS);
    const at = new Intl.DateTimeFormat(localesAT, optionsAT);
    optionsAT.timeZone = {
      toString: () => 'Bogus/Time-Zone',
      toJSON: () => 'Bogus/Time-Zone'
    };
    optionsUS.timeZone = 'Bogus/Time-Zone';
    const us2 = new Intl.DateTimeFormat('en-US');
    const at2 = new Intl.DateTimeFormat(localesAT);
    localesAT[0] = ['invalid locale'];
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
        const t = Temporal.PlainDate.from(t1);
        equal(us.format(t.withCalendar(usCalendar).toPlainYearMonth()), '11/1976');
        equal(at.format(t.withCalendar(atCalendar).toPlainYearMonth()), '11.1976');
      });
      it('should work for MonthDay', () => {
        const t = Temporal.PlainDate.from(t1);
        equal(us.format(t.withCalendar(usCalendar).toPlainMonthDay()), '11/18');
        equal(at.format(t.withCalendar(atCalendar).toPlainMonthDay()), '18.11.');
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
        const t = Temporal.PlainDate.from(t2);
        deepEqual(us.formatToParts(t.withCalendar(usCalendar).toPlainYearMonth()), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'year', value: '2020' }
        ]);
        deepEqual(at.formatToParts(t.withCalendar(atCalendar).toPlainYearMonth()), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '.' },
          { type: 'year', value: '2020' }
        ]);
      });
      it('should work for MonthDay', () => {
        const t = Temporal.PlainDate.from(t2);
        deepEqual(us.formatToParts(t.withCalendar(usCalendar).toPlainMonthDay()), [
          { type: 'month', value: '2' },
          { type: 'literal', value: '/' },
          { type: 'day', value: '20' }
        ]);
        deepEqual(at.formatToParts(t.withCalendar(atCalendar).toPlainMonthDay()), [
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
        const date1 = Temporal.PlainDate.from(t1);
        const date2 = Temporal.PlainDate.from(t2);
        equal(
          us.formatRange(
            date1.withCalendar(usCalendar).toPlainYearMonth(),
            date2.withCalendar(usCalendar).toPlainYearMonth()
          ),
          '11/1976 – 2/2020'
        );
        equal(
          at.formatRange(
            date1.withCalendar(atCalendar).toPlainYearMonth(),
            date2.withCalendar(atCalendar).toPlainYearMonth()
          ),
          '11.1976 – 02.2020'
        );
      });
      it('should work for MonthDay', () => {
        const date1 = Temporal.PlainDate.from(t1);
        const date2 = Temporal.PlainDate.from(t2);
        equal(
          us.formatRange(
            date2.withCalendar(usCalendar).toPlainMonthDay(),
            date1.withCalendar(usCalendar).toPlainMonthDay()
          ),
          '2/20 – 11/18'
        );
        equal(
          at.formatRange(
            date2.withCalendar(atCalendar).toPlainMonthDay(),
            date1.withCalendar(atCalendar).toPlainMonthDay()
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
        const date1 = Temporal.PlainDate.from(t1);
        const date2 = Temporal.PlainDate.from(t2);
        deepEqual(
          us.formatRangeToParts(
            date1.withCalendar(usCalendar).toPlainYearMonth(),
            date2.withCalendar(usCalendar).toPlainYearMonth()
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
            date1.withCalendar(atCalendar).toPlainYearMonth(),
            date2.withCalendar(atCalendar).toPlainYearMonth()
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
        const date1 = Temporal.PlainDate.from(t1);
        const date2 = Temporal.PlainDate.from(t2);
        deepEqual(
          us.formatRangeToParts(
            date2.withCalendar(usCalendar).toPlainMonthDay(),
            date1.withCalendar(usCalendar).toPlainMonthDay()
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
            date2.withCalendar(atCalendar).toPlainMonthDay(),
            date1.withCalendar(atCalendar).toPlainMonthDay()
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
