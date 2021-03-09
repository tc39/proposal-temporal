import Demitasse from '@pipobscure/demitasse';
const { after, before, describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';

describe('fromString regex', () => {
  describe('instant', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, mon, d, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0] = components;
        const instant = Temporal.Instant.from(isoString);
        const utc = Temporal.TimeZone.from('UTC');
        const datetime = utc.getPlainDateTimeFor(instant);
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
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Without time component
    test('2020-01-01Z', [2020, 1, 1, 0, 0, 0]);
    // Time separators
    ['T', 't', ' '].forEach((timeSep) =>
      generateTest(`1976-11-18${timeSep}15:23`, 'Z', [1976, 11, 18, 15, 23, 30, 123, 456, 789])
    );
    // Time zone with bracketed name
    ['+01:00', '+01', '+0100', '+01:00:00', '+010000', '+01:00:00.000000000', '+010000.0'].forEach((zoneString) => {
      generateTest('1976-11-18T15:23', `${zoneString}[Europe/Vienna]`, [1976, 11, 18, 14, 23, 30, 123, 456, 789]);
      generateTest('1976-11-18T15:23', `+01:00[${zoneString}]`, [1976, 11, 18, 14, 23, 30, 123, 456, 789]);
    });
    // Time zone with only offset
    ['-04:00', '-04', '-0400', '-04:00:00', '-040000', '-04:00:00.000000000', '-040000.0'].forEach((zoneString) =>
      generateTest('1976-11-18T15:23', zoneString, [1976, 11, 18, 19, 23, 30, 123, 456, 789])
    );
    // Various numbers of decimal places
    test('1976-11-18T15:23:30.1Z', [1976, 11, 18, 15, 23, 30, 100]);
    test('1976-11-18T15:23:30.12Z', [1976, 11, 18, 15, 23, 30, 120]);
    test('1976-11-18T15:23:30.123Z', [1976, 11, 18, 15, 23, 30, 123]);
    test('1976-11-18T15:23:30.1234Z', [1976, 11, 18, 15, 23, 30, 123, 400]);
    test('1976-11-18T15:23:30.12345Z', [1976, 11, 18, 15, 23, 30, 123, 450]);
    test('1976-11-18T15:23:30.123456Z', [1976, 11, 18, 15, 23, 30, 123, 456]);
    test('1976-11-18T15:23:30.1234567Z', [1976, 11, 18, 15, 23, 30, 123, 456, 700]);
    test('1976-11-18T15:23:30.12345678Z', [1976, 11, 18, 15, 23, 30, 123, 456, 780]);
    // Lowercase UTC designator
    generateTest('1976-11-18T15:23', 'z', [1976, 11, 18, 15, 23, 30, 123, 456, 789]);
    // Comma decimal separator
    test('1976-11-18T15:23:30,1234Z', [1976, 11, 18, 15, 23, 30, 123, 400]);
    // Unicode minus sign
    ['\u221204:00', '\u221204', '\u22120400'].forEach((offset) =>
      test(`1976-11-18T15:23:30.1234${offset}`, [1976, 11, 18, 19, 23, 30, 123, 400])
    );
    test('\u2212009999-11-18T15:23:30.1234Z', [-9999, 11, 18, 15, 23, 30, 123, 400]);
    // Mixture of basic and extended format
    test('1976-11-18T152330Z', [1976, 11, 18, 15, 23, 30]);
    test('1976-11-18T152330.1234Z', [1976, 11, 18, 15, 23, 30, 123, 400]);
    test('19761118T15:23:30Z', [1976, 11, 18, 15, 23, 30]);
    test('19761118T152330Z', [1976, 11, 18, 15, 23, 30]);
    test('19761118T152330.1234Z', [1976, 11, 18, 15, 23, 30, 123, 400]);
    // Representations with reduced precision
    test('1976-11-18T15Z', [1976, 11, 18, 15]);
  });

  describe('datetime', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, mon, d, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0, cid = 'iso8601'] = components;
        const datetime = Temporal.PlainDateTime.from(isoString);
        equal(datetime.year, y);
        equal(datetime.month, mon);
        equal(datetime.day, d);
        equal(datetime.hour, h);
        equal(datetime.minute, min);
        equal(datetime.second, s);
        equal(datetime.millisecond, ms);
        equal(datetime.microsecond, µs);
        equal(datetime.nanosecond, ns);
        equal(datetime.calendar.id, cid);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11, 18, 15, 23, 30, 123, 456, 789];
      test(`${dateTimeString}${zoneString}`, components.slice(0, 5));
      test(`${dateTimeString}:30${zoneString}`, components.slice(0, 6));
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, ''));
    // Various forms of time zone
    [
      '+0100[Europe/Vienna]',
      '+01:00[Europe/Vienna]',
      '[Europe/Vienna]',
      '+01:00[Custom/Vienna]',
      '-0400',
      '-04:00',
      '-04:00:00.000000000',
      '+010000.0[Europe/Vienna]',
      '+01:00[+01:00]',
      '+01:00[+0100]',
      ''
    ].forEach((zoneString) => generateTest('1976-11-18T15:23', zoneString));
    // Various numbers of decimal places
    test('1976-11-18T15:23:30.1', [1976, 11, 18, 15, 23, 30, 100]);
    test('1976-11-18T15:23:30.12', [1976, 11, 18, 15, 23, 30, 120]);
    test('1976-11-18T15:23:30.123', [1976, 11, 18, 15, 23, 30, 123]);
    test('1976-11-18T15:23:30.1234', [1976, 11, 18, 15, 23, 30, 123, 400]);
    test('1976-11-18T15:23:30.12345', [1976, 11, 18, 15, 23, 30, 123, 450]);
    test('1976-11-18T15:23:30.123456', [1976, 11, 18, 15, 23, 30, 123, 456]);
    test('1976-11-18T15:23:30.1234567', [1976, 11, 18, 15, 23, 30, 123, 456, 700]);
    test('1976-11-18T15:23:30.12345678', [1976, 11, 18, 15, 23, 30, 123, 456, 780]);
    // Comma decimal separator
    test('1976-11-18T15:23:30,1234', [1976, 11, 18, 15, 23, 30, 123, 400]);
    // Unicode minus sign
    ['\u221204:00', '\u221204', '\u22120400'].forEach((offset) =>
      test(`1976-11-18T15:23:30.1234${offset}`, [1976, 11, 18, 15, 23, 30, 123, 400])
    );
    test('\u2212009999-11-18T15:23:30.1234', [-9999, 11, 18, 15, 23, 30, 123, 400]);
    // Mixture of basic and extended format
    test('1976-11-18T152330', [1976, 11, 18, 15, 23, 30]);
    test('1976-11-18T152330.1234', [1976, 11, 18, 15, 23, 30, 123, 400]);
    test('19761118T15:23:30', [1976, 11, 18, 15, 23, 30]);
    test('19761118T152330', [1976, 11, 18, 15, 23, 30]);
    test('19761118T152330.1234', [1976, 11, 18, 15, 23, 30, 123, 400]);
    // Representations with reduced precision
    test('1976-11-18T15', [1976, 11, 18, 15]);
    test('1976-11-18', [1976, 11, 18]);
    // Representations with calendar
    ['', 'Z', '+01:00[Europe/Vienna]', '+01:00[Custom/Vienna]', '[Europe/Vienna]'].forEach((zoneString) =>
      test(`1976-11-18T15:23:30.123456789${zoneString}[u-ca=iso8601]`, [1976, 11, 18, 15, 23, 30, 123, 456, 789])
    );
  });

  describe('date', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, m, d, cid = 'iso8601'] = components;
        const date = Temporal.PlainDate.from(isoString);
        equal(date.year, y);
        equal(date.month, m);
        equal(date.day, d);
        equal(date.calendar.id, cid);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11, 18];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, ''));
    // Various forms of time zone
    [
      '+0100[Europe/Vienna]',
      '[Europe/Vienna]',
      '+01:00[Custom/Vienna]',
      '-0400',
      '-04:00:00.000000000',
      '+01:00[+01:00]',
      '+01:00[+0100]',
      ''
    ].forEach((zoneString) => generateTest('1976-11-18T15:23', zoneString));
    // Various numbers of decimal places
    ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678'].forEach((decimals) =>
      test(`1976-11-18T15:23:30.${decimals}`, [1976, 11, 18])
    );
    [
      // Comma decimal separator
      '1976-11-18T15:23:30,1234',
      // Mixture of basic and extended format
      '1976-11-18T152330',
      '1976-11-18T152330.1234',
      '19761118T15:23:30',
      '19761118T152330',
      '19761118T152330.1234'
    ].forEach((str) => test(str, [1976, 11, 18]));
    // Unicode minus sign
    test('\u2212009999-11-18', [-9999, 11, 18]);
    // Representations with reduced precision
    test('1976-11-18T15', [1976, 11, 18]);
    // Date-only forms
    test('1976-11-18', [1976, 11, 18]);
    test('19761118', [1976, 11, 18]);
    test('+199999-11-18', [199999, 11, 18]);
    test('+1999991118', [199999, 11, 18]);
    test('-000300-11-18', [-300, 11, 18]);
    test('-0003001118', [-300, 11, 18]);
    test('1512-11-18', [1512, 11, 18]);
    test('15121118', [1512, 11, 18]);
    // Representations with calendar
    ['', 'Z', '+01:00[Europe/Vienna]', '[Europe/Vienna]', '+01:00[Custom/Vienna]'].forEach((zoneString) =>
      test(`1976-11-18T15:23:30.123456789${zoneString}[u-ca=iso8601]`, [1976, 11, 18])
    );
    test('1976-11-18[u-ca=iso8601]', [1976, 11, 18]);
  });

  describe('time', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [h = 0, m = 0, s = 0, ms = 0, µs = 0, ns = 0] = components;
        const time = Temporal.PlainTime.from(isoString);
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
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, ''));
    // Various forms of time zone
    [
      '+0100[Europe/Vienna]',
      '+01:00[Custom/Vienna]',
      '-0400',
      '-04:00:00.000000000',
      '+010000.0[Europe/Vienna]',
      '+01:00[+01:00]',
      '+01:00[+0100]',
      ''
    ].forEach((zoneString) => generateTest('1976-11-18T15:23', zoneString));
    // Various numbers of decimal places
    test('1976-11-18T15:23:30.1', [15, 23, 30, 100]);
    test('1976-11-18T15:23:30.12', [15, 23, 30, 120]);
    test('1976-11-18T15:23:30.123', [15, 23, 30, 123]);
    test('1976-11-18T15:23:30.1234', [15, 23, 30, 123, 400]);
    test('1976-11-18T15:23:30.12345', [15, 23, 30, 123, 450]);
    test('1976-11-18T15:23:30.123456', [15, 23, 30, 123, 456]);
    test('1976-11-18T15:23:30.1234567', [15, 23, 30, 123, 456, 700]);
    test('1976-11-18T15:23:30.12345678', [15, 23, 30, 123, 456, 780]);
    // Comma decimal separator
    test('1976-11-18T15:23:30,1234', [15, 23, 30, 123, 400]);
    // Mixture of basic and extended format
    test('1976-11-18T152330', [15, 23, 30]);
    test('1976-11-18T152330.1234', [15, 23, 30, 123, 400]);
    test('19761118T15:23:30', [15, 23, 30]);
    test('19761118T152330', [15, 23, 30]);
    test('19761118T152330.1234', [15, 23, 30, 123, 400]);
    // Representations with reduced precision
    test('1976-11-18T15', [15]);
    test('1976-11-18', []);
    // Time-only forms
    generateTest('15:23', '');
    ['+01:00[Europe/Vienna]', '[Europe/Vienna]', '+01:00[Custom/Vienna]', '-04:00', 'Z', ''].forEach((zoneStr) =>
      test(`15${zoneStr}`, [15])
    );
    // Representations with calendar
    ['', 'Z', '+01:00[Europe/Vienna]', '[Europe/Vienna]', '+01:00[Custom/Vienna]'].forEach((zoneString) =>
      test(`1976-11-18T15:23:30.123456789${zoneString}[u-ca=iso8601]`, [15, 23, 30, 123, 456, 789])
    );
    test('15:23:30.123456789[u-ca=iso8601]', [15, 23, 30, 123, 456, 789]);
  });

  describe('yearmonth', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [y, m, cid = 'iso8601'] = components;
        const yearMonth = Temporal.PlainYearMonth.from(isoString);
        equal(yearMonth.year, y);
        equal(yearMonth.month, m);
        equal(yearMonth.calendar.id, cid);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [1976, 11];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, ''));
    // Various forms of time zone
    [
      '+0100[Europe/Vienna]',
      '[Europe/Vienna]',
      '+01:00[Custom/Vienna]',
      '-0400',
      '-04:00:00.000000000',
      '+01:00:00.0[Europe/Vienna]',
      '+01:00[+01:00]',
      '+01:00[+0100]',
      ''
    ].forEach((zoneString) => generateTest('1976-11-18T15:23', zoneString));
    // Various numbers of decimal places
    ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678'].forEach((decimals) =>
      test(`1976-11-18T15:23:30.${decimals}`, [1976, 11])
    );
    [
      // Comma decimal separator
      '1976-11-18T15:23:30,1234',
      // Mixture of basic and extended format
      '1976-11-18T152330',
      '1976-11-18T152330.1234',
      '19761118T15:23:30',
      '19761118T152330',
      '19761118T152330.1234',
      // Representations with reduced precision
      '1976-11-18T15'
    ].forEach((str) => test(str, [1976, 11]));
    // Unicode minus sign
    test('\u2212009999-11-18T15:23:30.1234Z', [-9999, 11]);
    // Date-only forms
    test('1976-11-18', [1976, 11]);
    test('19761118', [1976, 11]);
    test('+199999-11-18', [199999, 11]);
    test('+1999991118', [199999, 11]);
    test('-000300-11-18', [-300, 11]);
    test('-0003001118', [-300, 11]);
    test('1512-11-18', [1512, 11]);
    test('15121118', [1512, 11]);
    // Year-month forms
    test('1976-11', [1976, 11]);
    test('197611', [1976, 11]);
    test('+199999-11', [199999, 11]);
    test('+19999911', [199999, 11]);
    test('-000300-11', [-300, 11]);
    test('-00030011', [-300, 11]);
    test('1512-11', [1512, 11]);
    test('151211', [1512, 11]);
    // Representations with calendar
    ['', 'Z', '+01:00[Europe/Vienna]', '[Europe/Vienna]', '+01:00[Custom/Vienna]'].forEach((zoneString) =>
      test(`1976-11-18T15:23:30.123456789${zoneString}[u-ca=iso8601]`, [1976, 11])
    );
    test('1976-11-01[u-ca=iso8601]', [1976, 11]);
  });

  describe('monthday', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const [m, d, cid = 'iso8601'] = components;
        const monthDay = Temporal.PlainMonthDay.from(isoString);
        equal(monthDay.monthCode, `M${m.toString().padStart(2, '0')}`);
        equal(monthDay.day, d);
        equal(monthDay.calendar.id, cid);
      });
    }
    function generateTest(dateTimeString, zoneString) {
      const components = [11, 18];
      test(`${dateTimeString}${zoneString}`, components);
      test(`${dateTimeString}:30${zoneString}`, components);
      test(`${dateTimeString}:30.123456789${zoneString}`, components);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, ''));
    // Various forms of time zone
    [
      '+0100[Europe/Vienna]',
      '[Europe/Vienna]',
      '+01:00[Custom/Vienna]',
      '-0400',
      '-04:00:00.000000000',
      '+010000.0[Europe/Vienna]',
      '+01:00[+01:00]',
      '+01:00[+0100]',
      ''
    ].forEach((zoneString) => generateTest('1976-11-18T15:23', zoneString));
    // Various numbers of decimal places
    ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678'].forEach((decimals) =>
      test(`1976-11-18T15:23:30.${decimals}`, [11, 18])
    );
    [
      // Comma decimal separator
      '1976-11-18T15:23:30,1234',
      // Unicode minus sign
      '\u2212009999-11-18',
      // Mixture of basic and extended format
      '1976-11-18T152330',
      '1976-11-18T152330.1234',
      '19761118T15:23:30',
      '19761118T152330',
      '19761118T152330.1234',
      // Representations with reduced precision
      '1976-11-18T15',
      // Date-only forms
      '1976-11-18',
      '19761118',
      '+199999-11-18',
      '+1999991118',
      '-000300-11-18',
      '-0003001118',
      '1512-11-18',
      '15121118'
    ].forEach((str) => test(str, [11, 18]));
    // Month-day forms
    test('11-18', [11, 18]);
    test('1118', [11, 18]);
    test('12-13', [12, 13]);
    test('1213', [12, 13]);
    test('02-02', [2, 2]);
    test('0202', [2, 2]);
    test('01-31', [1, 31]);
    test('0131', [1, 31]);
    // RFC 3339 month-day form
    test('--11-18', [11, 18]);
    test('--1118', [11, 18]);
    // Representations with calendar
    ['', 'Z', '+01:00[Europe/Vienna]', '[Europe/Vienna]', '+01:00[Custom/Vienna]'].forEach((zoneString) =>
      test(`1976-11-18T15:23:30.123456789${zoneString}[u-ca=iso8601]`, [11, 18])
    );
    test('1972-11-18[u-ca=iso8601]', [11, 18]);
  });

  describe('timezone', () => {
    function test(offsetString, expectedName) {
      it(offsetString, () => {
        const timeZone = Temporal.TimeZone.from(offsetString);
        equal(timeZone.id, expectedName);
      });
    }
    function generateTest(dateTimeString, zoneString, expectedName) {
      test(`${dateTimeString}${zoneString}`, expectedName);
      test(`${dateTimeString}:30${zoneString}`, expectedName);
      test(`${dateTimeString}:30.123456789${zoneString}`, expectedName);
    }
    // Time separators
    ['T', 't', ' '].forEach((timeSep) => generateTest(`1976-11-18${timeSep}15:23`, 'Z', 'UTC'));
    // Time zone with bracketed name
    ['+01:00', '+01', '+0100', '+01:00:00', '+010000', '+01:00:00.000000000', '+010000.0'].forEach((zoneString) => {
      generateTest('1976-11-18T15:23', `${zoneString}[Europe/Vienna]`, 'Europe/Vienna');
      generateTest('1976-11-18T15:23', `+01:00[${zoneString}]`, '+01:00');
    });
    // Time zone with only offset
    ['-04:00', '-04', '-0400', '-04:00:00', '-040000', '-04:00:00.000000000', '-040000.0'].forEach((zoneString) =>
      generateTest('1976-11-18T15:23', zoneString, '-04:00')
    );
    // Various numbers of decimal places
    ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678'].forEach((decimals) =>
      test(`1976-11-18T15:23:30.${decimals}Z`, 'UTC')
    );
    // Lowercase UTC designator
    generateTest('1976-11-18T15:23', 'z', 'UTC');
    // Comma decimal separator
    test('1976-11-18T15:23:30,1234Z', 'UTC');
    test('1976-11-18T15:23-04:00:00,000000000', '-04:00');
    test('1976-11-18T15:23+010000,0[Europe/Vienna]', 'Europe/Vienna');
    // Unicode minus sign
    ['\u221204:00', '\u221204', '\u22120400'].forEach((offset) => test(`1976-11-18T15:23${offset}`, '-04:00'));
    [
      // Mixture of basic and extended format
      '1976-11-18T152330',
      '1976-11-18T152330.1234',
      '19761118T15:23:30',
      '19761118T152330',
      '19761118T152330.1234',
      // Representations with reduced precision
      '1976-11-18T15'
    ].forEach((dateTimeString) => {
      ['+01:00', '+01', '+0100', ''].forEach((zoneString) =>
        test(`${dateTimeString}${zoneString}[Europe/Vienna]`, 'Europe/Vienna')
      );
      ['-04:00', '-04', '-0400'].forEach((zoneString) => test(`${dateTimeString}${zoneString}`, '-04:00'));
      test(`${dateTimeString}Z`, 'UTC');
    });
    // Offset-only forms
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
    test('\u22120000', '+00:00');
    test('\u221200:00', '+00:00');
    test('\u221200', '+00:00');
    test('\u22120300', '-03:00');
    test('\u221203:00', '-03:00');
    test('\u221203', '-03:00');
    test('+03:00:00', '+03:00');
    test('+030000', '+03:00');
    test('+03:00:00.000000000', '+03:00');
    test('+030000.0', '+03:00');
    test('-03:00:00', '-03:00');
    test('-030000', '-03:00');
    test('-03:00:00.000000000', '-03:00');
    test('-030000.0', '-03:00');
    // Representations with calendar
    test('1976-11-18T15:23:30.123456789Z[u-ca=iso8601]', 'UTC');
    test('1976-11-18T15:23:30.123456789-04:00[u-ca=iso8601]', '-04:00');
    test('1976-11-18T15:23:30.123456789[Europe/Vienna][u-ca=iso8601]', 'Europe/Vienna');
    test('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna][u-ca=iso8601]', 'Europe/Vienna');
  });

  describe('duration', () => {
    function test(isoString, components) {
      it(isoString, () => {
        const { y = 0, mon = 0, w = 0, d = 0, h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0 } = components;
        const duration = Temporal.Duration.from(isoString);
        equal(duration.years, y);
        equal(duration.months, mon);
        equal(duration.weeks, w);
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
      ['1Y', { y: 1 }],
      ['2M', { mon: 2 }],
      ['4W', { w: 4 }],
      ['3D', { d: 3 }],
      ['1Y2M', { y: 1, mon: 2 }],
      ['1Y3D', { y: 1, d: 3 }],
      ['2M3D', { mon: 2, d: 3 }],
      ['4W3D', { w: 4, d: 3 }],
      ['1Y2M3D', { y: 1, mon: 2, d: 3 }],
      ['1Y2M4W3D', { y: 1, mon: 2, w: 4, d: 3 }]
    ];
    const times = [
      ['', {}],
      ['4H', { h: 4 }],
      ['5M', { min: 5 }],
      ['4H5M', { h: 4, min: 5 }]
    ];
    const sec = [
      ['', {}],
      ['6S', { s: 6 }],
      ['7.1S', { s: 7, ms: 100 }],
      ['7.12S', { s: 7, ms: 120 }],
      ['7.123S', { s: 7, ms: 123 }],
      ['8.1234S', { s: 8, ms: 123, µs: 400 }],
      ['8.12345S', { s: 8, ms: 123, µs: 450 }],
      ['8.123456S', { s: 8, ms: 123, µs: 456 }],
      ['9.1234567S', { s: 9, ms: 123, µs: 456, ns: 700 }],
      ['9.12345678S', { s: 9, ms: 123, µs: 456, ns: 780 }],
      ['9.123456789S', { s: 9, ms: 123, µs: 456, ns: 789 }],
      ['0.123S', { ms: 123 }],
      ['0,123S', { ms: 123 }],
      ['0.123456S', { ms: 123, µs: 456 }],
      ['0,123456S', { ms: 123, µs: 456 }],
      ['0.123456789S', { ms: 123, µs: 456, ns: 789 }],
      ['0,123456789S', { ms: 123, µs: 456, ns: 789 }]
    ];
    const tim = sec
      .reduce((arr, [s, add]) => arr.concat(times.map(([p, expect]) => [`${p}${s}`, { ...expect, ...add }])), [])
      .slice(1);

    day.slice(1).forEach(([p, expect]) => {
      test(`P${p}`, expect);
      test(`p${p}`, expect);
      test(`p${p.toLowerCase()}`, expect);
    });
    tim.forEach(([p, expect]) => {
      test(`PT${p}`, expect);
      test(`Pt${p}`, expect);
      test(`pt${p.toLowerCase()}`, expect);
    });
    for (let [d, dexpect] of day) {
      for (let [t, texpect] of tim) {
        test(`P${d}T${t}`, { ...dexpect, ...texpect });
        test(`p${d}T${t.toLowerCase()}`, { ...dexpect, ...texpect });
        test(`P${d.toLowerCase()}t${t}`, { ...dexpect, ...texpect });
        test(`p${d.toLowerCase()}t${t.toLowerCase()}`, { ...dexpect, ...texpect });
      }
    }
  });

  // These can be tested again once the resolver options are accepted.
  describe.skip('time zone ID', () => {
    let oldTemporalTimeZoneFrom = Temporal.TimeZone.from;
    let fromCalledWith;
    before(() => {
      Temporal.TimeZone.from = function (item) {
        fromCalledWith = item;
        return new Temporal.TimeZone('UTC');
      };
    });
    function testTimeZoneID(id) {
      return Temporal.ZonedDateTime.from(`1970-01-01T00:00[${id}]`);
    }
    describe('valid', () => {
      [
        '.a',
        '..a',
        '...',
        '_',
        'a',
        'a-',
        'a-a',
        'a-aa',
        'a-aa-',
        'a-aa-a',
        'a-aa-aa',
        'a-aa-aa-',
        'Etc/.a',
        'Etc/..a',
        'Etc/...',
        'Etc/_',
        'Etc/a-a',
        'Etc/FourteenCharsZ',
        'Etc/FourteenCharsZ/FourteenCharsZ',
        'Etc/GMT-8',
        'Etc/GMT-12',
        'Etc/GMT+8',
        'Etc/GMT+12'
      ].forEach((id) => {
        it(id, () => {
          testTimeZoneID(id);
          equal(fromCalledWith, id);
        });
      });
    });
    describe('not valid', () => {
      [
        '.',
        '..',
        '-',
        '3',
        '-Foo',
        'Etc/.',
        'Etc/..',
        'Etc/-',
        'Etc/3',
        'Etc/-Foo',
        'Etc/😺',
        'Etc/FifteenCharsZZZ',
        'GMT-8',
        'GMT+8',
        'Foo/Etc/GMT-8'
      ].forEach((id) => {
        it(id, () => {
          throws(() => testTimeZoneID(id), RangeError);
        });
      });
    });
    after(() => {
      Temporal.TimeZone.from = oldTemporalTimeZoneFrom;
    });
  });

  // These can be tested again once the resolver options are accepted.
  describe.skip('calendar ID', () => {
    let oldTemporalCalendarFrom = Temporal.Calendar.from;
    let fromCalledWith;
    before(() => {
      Temporal.Calendar.from = function (item) {
        fromCalledWith = item;
        return new Temporal.Calendar('iso8601');
      };
    });
    function testCalendarID(id) {
      return Temporal.PlainDateTime.from(`1970-01-01T00:00+00:00[UTC][u-ca=${id}]`);
    }
    describe('valid', () => {
      ['aaa', 'aaa-aaa', 'eightZZZ', 'eightZZZ-eightZZZ'].forEach((id) => {
        it(id, () => {
          testCalendarID(id);
          equal(fromCalledWith, id);
        });
      });
    });
    describe('not valid', () => {
      ['a', 'a-a', 'aa', 'aa-aa', 'foo_', 'foo.', 'ninechars', 'ninechars-ninechars'].forEach((id) => {
        it(id, () => {
          throws(() => testCalendarID(id), RangeError);
        });
      });
    });
    after(() => {
      Temporal.Calendar.from = oldTemporalCalendarFrom;
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
