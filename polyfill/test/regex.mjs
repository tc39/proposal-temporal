import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import assert from 'assert';
const { equal } = assert;

import * as Temporal from 'tc39-temporal';

describe('fromString regex', ()=>{
  describe('absolute', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, mon, d, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0] = components;
        const absolute = Temporal.Absolute.from(isoString);
        const datetime = absolute.inTimeZone('UTC');
        equal(datetime.year, y);
        equal(datetime.month, mon);
        equal(datetime.day, d);
        equal(datetime.hour, h);
        equal(datetime.minute, min);
        equal(datetime.second, s);
        equal(datetime.millisecond, ms);
        equal(datetime.microsecond, µs);
        equal(datetime.nanosecond, ns);
      });
    }
    function generateTest(dateTimeString, zoneString, components) {
      test(`${dateTimeString}${zoneString}`, components.slice(0, 5));
      test(`${dateTimeString}:30${zoneString}`, components.slice(0, 6));
      test(`${dateTimeString}:30.123${zoneString}`, components.slice(0, 7));
      test(`${dateTimeString}:30.123456${zoneString}`, components.slice(0, 8));
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+01:00', '+01', '+0100'].forEach((zoneString) =>
        generateTest(dateTimeString, `${zoneString}[Europe/Vienna]`, [1976, 11, 18, 14, 23, 30, 123, 456, 789]));
      ['-04:00', '-04', '-0400'].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString, [1976, 11, 18, 19, 23, 30, 123, 456, 789]));
      generateTest(dateTimeString, 'Z', [1976, 11, 18, 15, 23, 30, 123, 456, 789]);
    });
  });

  describe('datetime', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, mon, d, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0] = components;
        const datetime = Temporal.DateTime.from(isoString);
        equal(datetime.year, y);
        equal(datetime.month, mon);
        equal(datetime.day, d);
        equal(datetime.hour, h);
        equal(datetime.minute, min);
        equal(datetime.second, s);
        equal(datetime.millisecond, ms);
        equal(datetime.microsecond, µs);
        equal(datetime.nanosecond, ns);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11, 18, 15, 23, 30, 123, 456, 789];
      test(`${dateTimeString}${zoneString}`, components.slice(0, 5));
      test(`${dateTimeString}:30${zoneString}`, components.slice(0, 6));
      test(`${dateTimeString}:30.123${zoneString}`, components.slice(0, 7));
      test(`${dateTimeString}:30.123456${zoneString}`, components.slice(0, 8));
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+0100[Europe/Vienna]', '-0400', ''].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString));
    });
  });

  describe('date', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, m, d] = components;
        const date = Temporal.Date.from(isoString);
        equal(date.year, y);
        equal(date.month, m);
        equal(date.day, d);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11, 18];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123${zoneString}`, components);
      test(`${dateTimeString}:30.123456${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+0100[Europe/Vienna]', '-0400', ''].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString));
    });
    test('1976-11-18', [1976, 11, 18]);
    test('+999999-11-18', [999999, 11, 18]);
    test('-000300-11-18', [-300, 11, 18]);
    test('1512-11-18', [1512, 11, 18]);
  });

  describe('time', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [h = 0, m = 0, s = 0, ms = 0, µs = 0, ns = 0] = components;
        const time = Temporal.Time.from(isoString);
        equal(time.hour, h);
        equal(time.minute, m);
        equal(time.second, s);
        equal(time.millisecond, ms);
        equal(time.microsecond, µs);
        equal(time.nanosecond, ns);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [15, 23, 30, 123, 456, 789];
      test(`${dateTimeString}${zoneString}`, components.slice(0, 2));
      test(`${dateTimeString}:30${zoneString}`, components.slice(0, 3));
      test(`${dateTimeString}:30.123${zoneString}`, components.slice(0, 4));
      test(`${dateTimeString}:30.123456${zoneString}`, components.slice(0, 5));
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+0100[Europe/Vienna]', '-0400', ''].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString));
    });
    generateTest('15:23', '');
  });

  describe('yearmonth', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, m] = components;
        const yearMonth = Temporal.YearMonth.from(isoString);
        equal(yearMonth.year, y);
        equal(yearMonth.month, m);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123${zoneString}`, components);
      test(`${dateTimeString}:30.123456${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+0100[Europe/Vienna]', '-0400', ''].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString));
    });
    test('1976-11-18', [1976, 11]);
    test('+999999-11-18', [999999, 11]);
    test('-000300-11-18', [-300, 11]);
    test('1512-11-18', [1512, 11]);
    test('1976-11', [1976, 11]);
    test('+999999-11', [999999, 11]);
    test('-000300-11', [-300, 11]);
    test('1512-11', [1512, 11]);
  });

  describe('monthday', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [m, d] = components;
        const monthDay = Temporal.MonthDay.from(isoString);
        equal(monthDay.month, m);
        equal(monthDay.day, d);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [11, 18];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123${zoneString}`, components);
      test(`${dateTimeString}:30.123456${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+0100[Europe/Vienna]', '-0400', ''].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString));
    });
    test('1976-11-18', [11, 18]);
    test('+999999-11-18', [11, 18]);
    test('-000300-11-18', [11, 18]);
    test('1512-11-18', [11, 18]);
    test('11-18', [11, 18]);
    test('12-13', [12, 13]);
    test('02-02', [2, 2]);
    test('01-31', [1, 31]);
  });

  describe('timezone', () => {
    function test(offsetString, expectedName) {
      it(offsetString, () => {
        const timeZone = Temporal.TimeZone.from(offsetString);
        equal(timeZone.name, expectedName);
      });
    }
    function generateTest(dateTimeString, zoneString, expectedName) {
      test(`${dateTimeString}${zoneString}`, expectedName);
      test(`${dateTimeString}:30${zoneString}`, expectedName);
      test(`${dateTimeString}:30.123${zoneString}`, expectedName);
      test(`${dateTimeString}:30.123456${zoneString}`, expectedName);
      test(`${dateTimeString}:30.123456789${zoneString}`, expectedName);
    }
    ['1976-11-18T15:23', '1976-11-18 15:23'].forEach((dateTimeString) => {
      ['+01:00', '+0100', '+01'].forEach((zoneString) =>
        generateTest(dateTimeString, `${zoneString}[Europe/Vienna]`, 'Europe/Vienna'));
      ['-04:00', '-0400', '-04'].forEach((zoneString) =>
        generateTest(dateTimeString, zoneString, '-04:00'));
      generateTest(dateTimeString, 'Z', 'UTC');
    });

    test('+0000', '+00:00');
    test('-0000', '+00:00');
    test('+00:00', '+00:00');
    test('-00:00', '+00:00');
    test('+00', '+00:00');
    test('-00', '+00:00');
    test('+0300', '+03:00');
    test('-0300', '-03:00');
    test('+03:00', '+03:00');
    test('-03:00', '-03:00');
    test('+03', '+03:00');
    test('-03', '-03:00');
  });

  describe('duration', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const {y = 0, mon = 0, d = 0, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0} = components;
        const duration = Temporal.Duration.from(isoString);
        equal(duration.years, y);
        equal(duration.months, mon);
        equal(duration.days, d);
        equal(duration.hours, h);
        equal(duration.minutes, min);
        equal(duration.seconds, s);
        equal(duration.milliseconds, ms);
        equal(duration.microseconds, µs);
        equal(duration.nanoseconds, ns);
      });
    }

    const day = [
      ['', {}],
      ['1Y', {y: 1}],
      ['2M', {mon: 2}],
      ['3D', {d: 3}],
      ['1Y2M', {y: 1, mon: 2}],
      ['1Y3D', {y: 1, d: 3}],
      ['2M3D', {mon: 2, d: 3}],
      ['1Y2M3D', {y: 1, mon: 2, d: 3}],
    ];
    const times = [
      ['', {}],
      ['4H', {h: 4}],
      ['5M', {min: 5}],
      ['4H5M', {h: 4, min: 5}],
    ];
    const sec = [
      ['', {}],
      ['6S', {s: 6}],
      ['7.123S', {s: 7, ms: 123}],
      ['8.123456S', {s: 8, ms: 123, µs: 456}],
      ['9.123456789S', {s: 9, ms: 123, µs: 456, ns: 789}],
      ['0.123S', {ms: 123}],
      ['0.123456S', {ms: 123, µs: 456}],
      ['0.123456789S', {ms: 123, µs: 456, ns: 789}],
    ];
    const tim = sec.reduce((arr, [s, add]) =>
      arr.concat(times.map(([p, expect]) =>
        [`${p}${s}`, {...expect, ...add}])), []);

    day.forEach(([p, expect]) => test(`P${p}`, expect));
    tim.forEach(([p, expect]) => test(`PT${p}`, expect));
    for (let [d, dexpect] of day) {
      for (let [t, texpect] of tim) {
        test(`P${d}T${t}`, {...dexpect, ...texpect});
      }
    }
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
