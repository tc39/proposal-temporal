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
const { ZonedDateTime } = Temporal;

describe('ZonedDateTime', () => {
  const tz = new Temporal.TimeZone('America/Los_Angeles');

  describe('Structure', () => {
    it('ZonedDateTime is a Function', () => {
      equal(typeof ZonedDateTime, 'function');
    });
    it('ZonedDateTime has a prototype', () => {
      assert(ZonedDateTime.prototype);
      equal(typeof ZonedDateTime.prototype, 'object');
    });
    describe('ZonedDateTime.prototype', () => {
      it('ZonedDateTime.prototype has calendar', () => {
        assert('calendar' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has timeZone', () => {
        assert('timeZone' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has year', () => {
        assert('year' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has month', () => {
        assert('month' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has day', () => {
        assert('day' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has hour', () => {
        assert('hour' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has minute', () => {
        assert('minute' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has second', () => {
        assert('second' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has millisecond', () => {
        assert('millisecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has microsecond', () => {
        assert('microsecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has nanosecond', () => {
        assert('nanosecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has epochSeconds', () => {
        assert('epochSeconds' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has epochMilliseconds', () => {
        assert('epochMilliseconds' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has epochMicroseconds', () => {
        assert('epochMicroseconds' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has epochNanoseconds', () => {
        assert('epochNanoseconds' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has hoursInDay', () => {
        assert('hoursInDay' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has daysInWeek', () => {
        assert('daysInWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has daysInMonth', () => {
        assert('daysInMonth' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has daysInYear', () => {
        assert('daysInYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has monthsInYear', () => {
        assert('daysInWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has inLeapYear', () => {
        assert('daysInWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has startOfDay', () => {
        assert('daysInWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has offset', () => {
        assert('daysInWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype.with is a Function', () => {
        equal(typeof ZonedDateTime.prototype.with, 'function');
      });
      it('ZonedDateTime.prototype.withTimeZone is a Function', () => {
        equal(typeof ZonedDateTime.prototype.withTimeZone, 'function');
      });
      it('ZonedDateTime.prototype.withCalendar is a Function', () => {
        equal(typeof ZonedDateTime.prototype.withCalendar, 'function');
      });
      it('ZonedDateTime.prototype.add is a Function', () => {
        equal(typeof ZonedDateTime.prototype.add, 'function');
      });
      it('ZonedDateTime.prototype.subtract is a Function', () => {
        equal(typeof ZonedDateTime.prototype.subtract, 'function');
      });
      it('ZonedDateTime.prototype.until is a Function', () => {
        equal(typeof ZonedDateTime.prototype.until, 'function');
      });
      it('ZonedDateTime.prototype.since is a Function', () => {
        equal(typeof ZonedDateTime.prototype.since, 'function');
      });
      it('ZonedDateTime.prototype.round is a Function', () => {
        equal(typeof ZonedDateTime.prototype.round, 'function');
      });
      it('ZonedDateTime.prototype.equals is a Function', () => {
        equal(typeof ZonedDateTime.prototype.equals, 'function');
      });
      it('ZonedDateTime.prototype.toString is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toString, 'function');
      });
      it('ZonedDateTime.prototype.toLocaleString is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toLocaleString, 'function');
      });
      it('ZonedDateTime.prototype.toJSON is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toJSON, 'function');
      });
      it('ZonedDateTime.prototype.valueOf is a Function', () => {
        equal(typeof ZonedDateTime.prototype.valueOf, 'function');
      });
      it('ZonedDateTime.prototype.toInstant is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toInstant, 'function');
      });
      it('ZonedDateTime.prototype.toDate is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDate, 'function');
      });
      it('ZonedDateTime.prototype.toTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toTime, 'function');
      });
      it('ZonedDateTime.prototype.toDateTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDateTime, 'function');
      });
      it('ZonedDateTime.prototype.toYearMonth is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDateTime, 'function');
      });
      it('ZonedDateTime.prototype.toMonthDay is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toDateTime, 'function');
      });
      it('ZonedDateTime.prototype.getFields is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getFields, 'function');
      });
      it('ZonedDateTime.prototype.getISOFields is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getISOFields, 'function');
      });
    });
    it('ZonedDateTime.from is a Function', () => {
      equal(typeof ZonedDateTime.from, 'function');
    });
    it('ZonedDateTime.compare is a Function', () => {
      equal(typeof ZonedDateTime.compare, 'function');
    });
  });

  describe('Construction and properties', () => {
    const epochMillis = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
    const epochNanos = BigInt(epochMillis) * BigInt(1e6) + BigInt(456789);
    it('works', () => {
      const zdt = new ZonedDateTime(epochNanos, tz);
      assert(zdt);
      equal(typeof zdt, 'object');
      equal(zdt.toInstant().epochSeconds, Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3), 'epochSeconds');
      equal(zdt.toInstant().epochMilliseconds, Date.UTC(1976, 10, 18, 15, 23, 30, 123), 'epochMilliseconds');
    });

    describe('ZonedDateTime for (1976, 11, 18, 15, 23, 30, 123, 456, 789)', () => {
      it('can be constructed', () => {
        const zdt = new ZonedDateTime(epochNanos, new Temporal.TimeZone('UTC'));
        assert(zdt);
        equal(typeof zdt, 'object');
      });
      const zdt = new ZonedDateTime(epochNanos, new Temporal.TimeZone('UTC'));
      it('zdt.year is 1976', () => equal(zdt.year, 1976));
      it('zdt.month is 11', () => equal(zdt.month, 11));
      it('zdt.day is 18', () => equal(zdt.day, 18));
      it('zdt.hour is 15', () => equal(zdt.hour, 15));
      it('zdt.minute is 23', () => equal(zdt.minute, 23));
      it('zdt.second is 30', () => equal(zdt.second, 30));
      it('zdt.millisecond is 123', () => equal(zdt.millisecond, 123));
      it('zdt.microsecond is 456', () => equal(zdt.microsecond, 456));
      it('zdt.nanosecond is 789', () => equal(zdt.nanosecond, 789));
      it('zdt.epochSeconds is 217178610', () => equal(zdt.epochSeconds, 217178610));
      it('zdt.epochMilliseconds is 217178610123', () => equal(zdt.epochMilliseconds, 217178610123));
      it('zdt.epochMicroseconds is 217178610123456n', () => equal(zdt.epochMicroseconds, 217178610123456n));
      it('zdt.epochNanoseconds is 217178610123456789n', () => equal(zdt.epochNanoseconds, 217178610123456789n));
      it('zdt.dayOfWeek is 4', () => equal(zdt.dayOfWeek, 4));
      it('zdt.dayOfYear is 323', () => equal(zdt.dayOfYear, 323));
      it('zdt.weekOfYear is 47', () => equal(zdt.weekOfYear, 47));
      it('zdt.daysInWeek is 7', () => equal(zdt.daysInWeek, 7));
      it('zdt.daysInMonth is 30', () => equal(zdt.daysInMonth, 30));
      it('zdt.daysInYear is 366', () => equal(zdt.daysInYear, 366));
      it('zdt.monthsInYear is 12', () => equal(zdt.monthsInYear, 12));
      it('zdt.inLeapYear is true', () => equal(zdt.inLeapYear, true));
      it('zdt.offset is +00:00', () => equal(zdt.offset, '+00:00'));
      it('string output is 1976-11-18T15:23:30.123456789+00:00[UTC]', () =>
        equal(`${zdt}`, '1976-11-18T15:23:30.123456789+00:00[UTC]'));
    });

    it('casts time zone', () => {
      const zdt = new ZonedDateTime(epochNanos, 'Asia/Seoul');
      equal(typeof zdt.timeZone, 'object');
      assert(zdt.timeZone instanceof Temporal.TimeZone);
      equal(zdt.timeZone.id, 'Asia/Seoul');
    });
    it('defaults to ISO calendar', () => {
      const zdt = new ZonedDateTime(epochNanos, tz);
      equal(typeof zdt.calendar, 'object');
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'iso8601');
    });
    it('casts calendar', () => {
      const zdt = new ZonedDateTime(epochNanos, Temporal.TimeZone.from('Asia/Tokyo'), 'japanese');
      equal(typeof zdt.calendar, 'object');
      assert(zdt.calendar instanceof Temporal.Calendar);
      equal(zdt.calendar.id, 'japanese');
    });
  });

  describe('string parsing', () => {
    it('parses with an IANA zone', () => {
      const zdt = ZonedDateTime.from('2020-03-08T01:00-08:00[America/Los_Angeles]');
      equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]');
    });
    it('parses with an IANA zone but no offset', () => {
      const zdt = ZonedDateTime.from('2020-03-08T01:00[America/Los_Angeles]');
      equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]');
    });
    it('parses with an IANA zone but no offset (with disambiguation)', () => {
      const zdt = ZonedDateTime.from('2020-03-08T02:30[America/Los_Angeles]', { disambiguation: 'earlier' });
      equal(zdt.toString(), '2020-03-08T01:30:00-08:00[America/Los_Angeles]');
    });
  });

  describe('ZonedDateTime.withTimeZone()', () => {
    const instant = Temporal.Instant.from('2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]');
    const zdt = instant.toZonedDateTimeISO('UTC');
    it('zonedDateTime.withTimeZone(America/Los_Angeles) works', () => {
      equal(`${zdt.withTimeZone(tz)}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]');
    });
    it('casts its argument', () => {
      equal(`${zdt.withTimeZone('America/Los_Angeles')}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]');
    });
    it('keeps instant and calendar the same', () => {
      const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789+01:00[Europe/Madrid][c=gregory]');
      const zdt2 = zdt.withTimeZone('America/Vancouver');
      equal(zdt.epochNanoseconds, zdt2.epochNanoseconds);
      equal(zdt2.calendar.id, 'gregory');
      equal(zdt2.timeZone.id, 'America/Vancouver');
      notEqual(`${zdt.toDateTime()}`, `${zdt2.toDateTime()}`);
    });
  });
  describe('ZonedDateTime.withCalendar()', () => {
    const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]');
    it('zonedDateTime.withCalendar(japanese) works', () => {
      const cal = Temporal.Calendar.from('japanese');
      equal(`${zdt.withCalendar(cal)}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles][c=japanese]');
    });
    it('casts its argument', () => {
      equal(`${zdt.withCalendar('japanese')}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles][c=japanese]');
    });
    it('keeps instant and time zone the same', () => {
      const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789+01:00[Europe/Madrid][c=gregory]');
      const zdt2 = zdt.withCalendar('japanese');
      equal(zdt.epochNanoseconds, zdt2.epochNanoseconds);
      equal(zdt2.calendar.id, 'japanese');
      equal(zdt2.timeZone.id, 'Europe/Madrid');
    });
  });

  describe('ZonedDateTime.equals()', () => {
    const tz = Temporal.TimeZone.from('America/New_York');
    const cal = Temporal.Calendar.from('gregory');
    const zdt = new ZonedDateTime(0n, tz, cal);
    it('constructed from equivalent parameters are equal', () => {
      const zdt2 = ZonedDateTime.from('1969-12-31T19:00-05:00[America/New_York][c=gregory]');
      assert(zdt.equals(zdt2));
      assert(zdt2.equals(zdt));
    });
    it('different instant not equal', () => {
      const zdt2 = new ZonedDateTime(1n, tz, cal);
      assert(!zdt.equals(zdt2));
    });
    it('different time zone not equal', () => {
      const zdt2 = new ZonedDateTime(0n, 'America/Chicago', cal);
      assert(!zdt.equals(zdt2));
    });
    it('different calendar not equal', () => {
      const zdt2 = new ZonedDateTime(0n, tz, 'iso8601');
      assert(!zdt.equals(zdt2));
    });
    it('casts its argument', () => {
      assert(zdt.equals('1969-12-31T19:00-05:00[America/New_York][c=gregory]'));
      assert(
        zdt.equals({
          year: 1969,
          month: 12,
          day: 31,
          hour: 19,
          timeZone: 'America/New_York',
          calendar: 'gregory'
        })
      );
    });
    it('at least the required properties must be present', () => {
      throws(
        () => zdt.equals({ years: 1969, months: 12, days: 31, timeZone: 'America/New_York', calendar: 'gregory' }),
        TypeError
      );
    });
  });
  describe('ZonedDateTime.toString()', () => {
    const zdt1 = ZonedDateTime.from('1976-11-18T15:23+01:00[Europe/Vienna]');
    const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30+01:00[Europe/Vienna]');
    const zdt3 = ZonedDateTime.from('1976-11-18T15:23:30.1234+01:00[Europe/Vienna]');
    it('default is to emit seconds and drop trailing zeros after the decimal', () => {
      equal(zdt1.toString(), '1976-11-18T15:23:00+01:00[Europe/Vienna]');
      equal(zdt2.toString(), '1976-11-18T15:23:30+01:00[Europe/Vienna]');
      equal(zdt3.toString(), '1976-11-18T15:23:30.1234+01:00[Europe/Vienna]');
    });
    it('truncates to minute', () => {
      [zdt1, zdt2, zdt3].forEach((zdt) =>
        equal(zdt.toString({ smallestUnit: 'minute' }), '1976-11-18T15:23+01:00[Europe/Vienna]')
      );
    });
    it('other smallestUnits are aliases for fractional digits', () => {
      equal(zdt3.toString({ smallestUnit: 'second' }), zdt3.toString({ fractionalSecondDigits: 0 }));
      equal(zdt3.toString({ smallestUnit: 'millisecond' }), zdt3.toString({ fractionalSecondDigits: 3 }));
      equal(zdt3.toString({ smallestUnit: 'microsecond' }), zdt3.toString({ fractionalSecondDigits: 6 }));
      equal(zdt3.toString({ smallestUnit: 'nanosecond' }), zdt3.toString({ fractionalSecondDigits: 9 }));
    });
    it('throws on invalid or disallowed smallestUnit', () => {
      ['era', 'year', 'month', 'day', 'hour', 'nonsense'].forEach((smallestUnit) =>
        throws(() => zdt1.toString({ smallestUnit }), RangeError)
      );
    });
    it('accepts plural units', () => {
      equal(zdt3.toString({ smallestUnit: 'minutes' }), zdt3.toString({ smallestUnit: 'minute' }));
      equal(zdt3.toString({ smallestUnit: 'seconds' }), zdt3.toString({ smallestUnit: 'second' }));
      equal(zdt3.toString({ smallestUnit: 'milliseconds' }), zdt3.toString({ smallestUnit: 'millisecond' }));
      equal(zdt3.toString({ smallestUnit: 'microseconds' }), zdt3.toString({ smallestUnit: 'microsecond' }));
      equal(zdt3.toString({ smallestUnit: 'nanoseconds' }), zdt3.toString({ smallestUnit: 'nanosecond' }));
    });
    it('truncates or pads to 2 places', () => {
      const options = { fractionalSecondDigits: 2 };
      equal(zdt1.toString(options), '1976-11-18T15:23:00.00+01:00[Europe/Vienna]');
      equal(zdt2.toString(options), '1976-11-18T15:23:30.00+01:00[Europe/Vienna]');
      equal(zdt3.toString(options), '1976-11-18T15:23:30.12+01:00[Europe/Vienna]');
    });
    it('pads to 7 places', () => {
      const options = { fractionalSecondDigits: 7 };
      equal(zdt1.toString(options), '1976-11-18T15:23:00.0000000+01:00[Europe/Vienna]');
      equal(zdt2.toString(options), '1976-11-18T15:23:30.0000000+01:00[Europe/Vienna]');
      equal(zdt3.toString(options), '1976-11-18T15:23:30.1234000+01:00[Europe/Vienna]');
    });
    it('auto is the default', () => {
      [zdt1, zdt2, zdt3].forEach((zdt) => equal(zdt.toString({ fractionalSecondDigits: 'auto' }), zdt.toString()));
    });
    it('throws on out of range or invalid fractionalSecondDigits', () => {
      [-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
        throws(() => zdt1.toString({ fractionalSecondDigits }), RangeError)
      );
    });
    it('accepts and truncates fractional fractionalSecondDigits', () => {
      equal(zdt3.toString({ fractionalSecondDigits: 5.5 }), '1976-11-18T15:23:30.12340+01:00[Europe/Vienna]');
    });
    it('smallestUnit overrides fractionalSecondDigits', () => {
      equal(
        zdt3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 }),
        '1976-11-18T15:23+01:00[Europe/Vienna]'
      );
    });
    it('throws on invalid roundingMode', () => {
      throws(() => zdt1.toString({ roundingMode: 'cile' }), RangeError);
    });
    it('rounds to nearest', () => {
      equal(
        zdt2.toString({ smallestUnit: 'minute', roundingMode: 'nearest' }),
        '1976-11-18T15:24+01:00[Europe/Vienna]'
      );
      equal(
        zdt3.toString({ fractionalSecondDigits: 3, roundingMode: 'nearest' }),
        '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'
      );
    });
    it('rounds up', () => {
      equal(zdt2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' }), '1976-11-18T15:24+01:00[Europe/Vienna]');
      equal(
        zdt3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }),
        '1976-11-18T15:23:30.124+01:00[Europe/Vienna]'
      );
    });
    it('rounds down', () => {
      ['floor', 'trunc'].forEach((roundingMode) => {
        equal(zdt2.toString({ smallestUnit: 'minute', roundingMode }), '1976-11-18T15:23+01:00[Europe/Vienna]');
        equal(
          zdt3.toString({ fractionalSecondDigits: 3, roundingMode }),
          '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'
        );
      });
    });
    it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
      const zdt4 = ZonedDateTime.from('-000099-12-15T12:00:00.5+00:00[UTC]');
      equal(zdt4.toString({ smallestUnit: 'second', roundingMode: 'floor' }), '-000099-12-15T12:00:00+00:00[UTC]');
    });
    it('rounding can affect all units', () => {
      const zdt5 = ZonedDateTime.from('1999-12-31T23:59:59.999999999+01:00[Europe/Berlin]');
      equal(
        zdt5.toString({ fractionalSecondDigits: 8, roundingMode: 'nearest' }),
        '2000-01-01T00:00:00.00000000+01:00[Europe/Berlin]'
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => zdt1.toString(badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) =>
        equal(zdt1.toString(options), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
      );
    });
  });
  describe('ZonedDateTime.toJSON()', () => {
    it('does the default toString', () => {
      const zdt1 = ZonedDateTime.from('1976-11-18T15:23+01:00[Europe/Vienna]');
      const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30+01:00[Europe/Vienna]');
      const zdt3 = ZonedDateTime.from('1976-11-18T15:23:30.1234+01:00[Europe/Vienna]');
      equal(zdt1.toJSON(), '1976-11-18T15:23:00+01:00[Europe/Vienna]');
      equal(zdt2.toJSON(), '1976-11-18T15:23:30+01:00[Europe/Vienna]');
      equal(zdt3.toJSON(), '1976-11-18T15:23:30.1234+01:00[Europe/Vienna]');
    });
  });
  describe("Comparison operators don't work", () => {
    const zdt1 = ZonedDateTime.from('1963-02-13T09:36:29.123456789+01:00[Europe/Vienna]');
    const zdt1again = ZonedDateTime.from('1963-02-13T09:36:29.123456789+01:00[Europe/Vienna]');
    const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
    it('=== is object equality', () => equal(zdt1, zdt1));
    it('!== is object equality', () => notEqual(zdt1, zdt1again));
    it('<', () => throws(() => zdt1 < zdt2));
    it('>', () => throws(() => zdt1 > zdt2));
    it('<=', () => throws(() => zdt1 <= zdt2));
    it('>=', () => throws(() => zdt1 >= zdt2));
  });

  describe('ZonedDateTime.toInstant()', () => {
    it('recent date', () => {
      const zdt = ZonedDateTime.from('2019-10-29T10:46:38.271986102+01:00[Europe/Amsterdam]');
      equal(`${zdt.toInstant()}`, '2019-10-29T09:46:38.271986102Z');
    });
    it('year ≤ 99', () => {
      const zdt = ZonedDateTime.from('+000098-10-29T10:46:38.271986102+00:00[UTC]');
      equal(`${zdt.toInstant()}`, '+000098-10-29T10:46:38.271986102Z');
    });
    it('year < 1', () => {
      let zdt = ZonedDateTime.from('+000000-10-29T10:46:38.271986102+00:00[UTC]');
      equal(`${zdt.toInstant()}`, '+000000-10-29T10:46:38.271986102Z');
      zdt = ZonedDateTime.from('-001000-10-29T10:46:38.271986102+00:00[UTC]');
      equal(`${zdt.toInstant()}`, '-001000-10-29T10:46:38.271986102Z');
    });
    it('year 0 leap day', () => {
      const zdt = ZonedDateTime.from('+000000-02-29T00:00-00:01:15[Europe/London]');
      equal(`${zdt.toInstant()}`, '+000000-02-29T00:01:15Z');
    });
  });
  describe('ZonedDateTime.toDate()', () => {
    it('works', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz);
      equal(`${zdt.toDate()}`, '2019-10-29');
    });
    it('preserves the calendar', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime(tz, 'gregory');
      equal(zdt.toDate().calendar.id, 'gregory');
    });
  });
  describe('ZonedDateTime.toTime()', () => {
    it('works', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz);
      equal(`${zdt.toTime()}`, '02:46:38.271986102');
    });
  });
  describe('ZonedDateTime.toYearMonth()', () => {
    it('works', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz);
      equal(`${zdt.toYearMonth()}`, '2019-10');
    });
    it('preserves the calendar', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime(tz, 'gregory');
      equal(zdt.toYearMonth().calendar.id, 'gregory');
    });
  });
  describe('ZonedDateTime.toMonthDay()', () => {
    it('works', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz);
      equal(`${zdt.toMonthDay()}`, '10-29');
    });
    it('preserves the calendar', () => {
      const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime(tz, 'gregory');
      equal(zdt.toMonthDay().calendar.id, 'gregory');
    });
  });

  describe('ZonedDateTime.getISOFields()', () => {
    const zdt1 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+08:00[Asia/Shanghai]');
    const fields = zdt1.getISOFields();
    it('fields', () => {
      equal(fields.isoYear, 1976);
      equal(fields.isoMonth, 11);
      equal(fields.isoDay, 18);
      equal(fields.hour, 15);
      equal(fields.minute, 23);
      equal(fields.second, 30);
      equal(fields.millisecond, 123);
      equal(fields.microsecond, 456);
      equal(fields.nanosecond, 789);
      equal(fields.offset, '+08:00');
      equal(fields.timeZone.id, 'Asia/Shanghai');
      equal(fields.calendar.id, 'iso8601');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoYear, 1976);
      equal(fields2.isoMonth, 11);
      equal(fields2.isoDay, 18);
      equal(fields2.hour, 15);
      equal(fields2.minute, 23);
      equal(fields2.second, 30);
      equal(fields2.millisecond, 123);
      equal(fields2.microsecond, 456);
      equal(fields2.nanosecond, 789);
      equal(fields2.offset, '+08:00');
      equal(fields2.timeZone, fields.timeZone);
      equal(fields2.calendar, fields.calendar);
    });
  });

  describe('ZonedDateTime.compare()', () => {
    const zdt1 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
    const zdt2 = ZonedDateTime.from('2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]');
    it('equal', () => equal(ZonedDateTime.compare(zdt1, zdt1), 0));
    it('smaller/larger', () => equal(ZonedDateTime.compare(zdt1, zdt2), -1));
    it('larger/smaller', () => equal(ZonedDateTime.compare(zdt2, zdt1), 1));
    it('casts first argument', () => {
      equal(ZonedDateTime.compare({ year: 1976, month: 11, day: 18, hour: 15, timeZone: 'Europe/Vienna' }, zdt2), -1);
      equal(ZonedDateTime.compare('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]', zdt2), -1);
    });
    it('casts second argument', () => {
      equal(ZonedDateTime.compare(zdt1, { year: 2019, month: 10, day: 29, hour: 10, timeZone: 'Europe/Vienna' }), -1);
      equal(ZonedDateTime.compare(zdt1, '2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]'), -1);
    });
    it('object must contain at least the required properties', () => {
      throws(
        () => ZonedDateTime.compare({ years: 1976, months: 11, day: 19, hours: 15, timeZone: 'Europe/Vienna' }, zdt2),
        TypeError
      );
      throws(
        () => ZonedDateTime.compare(zdt1, { years: 2019, months: 10, days: 29, hours: 10, timeZone: 'Europe/Vienna' }),
        TypeError
      );
    });
    it('compares time zone IDs if exact times are equal', () => {
      equal(ZonedDateTime.compare(zdt1, zdt1.withTimeZone('Asia/Kolkata')), 1);
    });
    it('compares calendar IDs if exact times and time zones are equal', () => {
      equal(ZonedDateTime.compare(zdt1, zdt1.withCalendar('japanese')), -1);
    });
    it('compares exact time, not clock time', () => {
      const clockBefore = ZonedDateTime.from('1999-12-31T23:30-08:00[America/Vancouver]');
      const clockAfter = ZonedDateTime.from('2000-01-01T01:30-04:00[America/Halifax]');
      equal(ZonedDateTime.compare(clockBefore, clockAfter), 1);
      equal(Temporal.DateTime.compare(clockBefore.toDateTime(), clockAfter.toDateTime()), -1);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
