import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainMonthDay } = Temporal;

describe('MonthDay', () => {
  describe('Construction', () => {
    describe('.from()', () => {
      it('ignores era/eraYear when determining the ISO reference year from month/day', () => {
        // 402
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, month: 11, day: 18, calendar: 'gregory' });
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, month: 11, day: 18, calendar: 'gregory' });
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      });
      it('ignores era/eraYear when determining the ISO reference year from monthCode/day', () => {
        // 402
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, monthCode: 'M11', day: 18, calendar: 'gregory' });
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, monthCode: 'M11', day: 18, calendar: 'gregory' });
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      });
      it('MonthDay.from({month, day}) not allowed in other calendar', () =>
        // 402
        throws(() => PlainMonthDay.from({ month: 11, day: 18, calendar: 'gregory' }), TypeError));
      it('MonthDay.from({year, month, day}) allowed in other calendar', () => {
        // 402
        equal(
          `${PlainMonthDay.from({ year: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]'
        );
      });
      it('MonthDay.from({era, eraYear, month, day}) allowed in other calendar', () => {
        // 402
        equal(
          `${PlainMonthDay.from({ era: 'ce', eraYear: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]'
        );
      });
      describe('Overflow', () => {
        const bad = { month: 1, day: 32 };
        it('reject', () => throws(() => PlainMonthDay.from(bad, { overflow: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${PlainMonthDay.from(bad)}`, '01-31');
          equal(`${PlainMonthDay.from(bad, { overflow: 'constrain' })}`, '01-31');
        });
        it('constrain has no effect on invalid ISO string', () => {
          throws(() => PlainMonthDay.from('13-34', { overflow: 'constrain' }), RangeError);
        });
      });
      describe('Leap day', () => {
        ['reject', 'constrain'].forEach((overflow) =>
          it(overflow, () => equal(`${PlainMonthDay.from({ month: 2, day: 29 }, { overflow })}`, '02-29'))
        );
        it("rejects when year isn't a leap year", () =>
          throws(() => PlainMonthDay.from({ month: 2, day: 29, year: 2001 }, { overflow: 'reject' }), RangeError));
        it('constrains non-leap year', () =>
          equal(`${PlainMonthDay.from({ month: 2, day: 29, year: 2001 }, { overflow: 'constrain' })}`, '02-28'));
      });
      describe('Leap day with calendar', () => {
        it('requires year with calendar', () =>
          throws(
            () => PlainMonthDay.from({ month: 2, day: 29, calendar: 'iso8601' }, { overflow: 'reject' }),
            TypeError
          ));
        it('rejects leap day with non-leap year', () =>
          throws(
            () => PlainMonthDay.from({ month: 2, day: 29, year: 2001, calendar: 'iso8601' }, { overflow: 'reject' }),
            RangeError
          ));
        it('constrains leap day', () =>
          equal(
            `${PlainMonthDay.from({ month: 2, day: 29, year: 2001, calendar: 'iso8601' }, { overflow: 'constrain' })}`,
            '02-28'
          ));
        it('accepts leap day with monthCode', () =>
          equal(
            `${PlainMonthDay.from({ monthCode: 'M02', day: 29, calendar: 'iso8601' }, { overflow: 'reject' })}`,
            '02-29'
          ));
      });
    });
    describe('.with()', () => {
      const md = PlainMonthDay.from('01-22');
      it('with(12-)', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-22'));
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'));
    });
  });
  describe('MonthDay.with()', () => {
    const md = PlainMonthDay.from('01-15');
    it('with({monthCode})', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-15'));
    it('with({month}) not accepted', () => {
      throws(() => md.with({ month: 12 }), TypeError);
    });
    it('with({month, monthCode}) accepted', () => equal(`${md.with({ month: 12, monthCode: 'M12' })}`, '12-15'));
    it('month and monthCode must agree', () => {
      throws(() => md.with({ month: 12, monthCode: 'M11' }), RangeError);
    });
    it('with({year, month}) accepted', () => equal(`${md.with({ year: 2000, month: 12 })}`, '12-15'));
    it('throws on bad overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => md.with({ day: 1 }, { overflow }), RangeError)
      );
    });
    it('throws with calendar property', () => {
      throws(() => md.with({ day: 1, calendar: 'iso8601' }), TypeError);
    });
    it('throws with timeZone property', () => {
      throws(() => md.with({ day: 1, timeZone: 'UTC' }), TypeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => md.with({ day: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${md.with({ day: 1 }, options)}`, '01-01'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => md.with({}), TypeError);
      throws(() => md.with({ months: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${md.with({ monthCode: 'M12', days: 1 })}`, '12-15');
    });
    it('year is ignored when determining ISO reference year', () => {
      equal(md.with({ year: 1900 }).getISOFields().isoYear, md.getISOFields().isoYear);
    });
  });
  describe('MonthDay.equals()', () => {
    const md1 = PlainMonthDay.from('01-22');
    const md2 = PlainMonthDay.from('12-15');
    it('equal', () => assert(md1.equals(md1)));
    it('unequal', () => assert(!md1.equals(md2)));
    it('casts argument', () => {
      assert(md1.equals('01-22'));
      assert(md1.equals({ month: 1, day: 22 }));
    });
    it('object must contain at least the required properties', () => {
      throws(() => md1.equals({ month: 1 }), TypeError);
    });
    it('takes [[ISOYear]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601');
      const md1 = new PlainMonthDay(1, 1, iso, 1972);
      const md2 = new PlainMonthDay(1, 1, iso, 2000);
      assert(!md1.equals(md2));
    });
  });
  describe("Comparison operators don't work", () => {
    const md1 = PlainMonthDay.from('02-13');
    const md1again = PlainMonthDay.from('02-13');
    const md2 = PlainMonthDay.from('11-18');
    it('=== is object equality', () => equal(md1, md1));
    it('!== is object equality', () => notEqual(md1, md1again));
    it('<', () => throws(() => md1 < md2));
    it('>', () => throws(() => md1 > md2));
    it('<=', () => throws(() => md1 <= md2));
    it('>=', () => throws(() => md1 >= md2));
  });
  describe('MonthDay.toPlainDate()', () => {
    const md = PlainMonthDay.from('01-22');
    it("doesn't take a primitive argument", () => {
      [2002, '2002', false, 2002n, Symbol('2002'), null].forEach((bad) => {
        throws(() => md.toPlainDate(bad), TypeError);
      });
    });
    it('takes an object argument with year property', () => {
      equal(`${md.toPlainDate({ year: 2002 })}`, '2002-01-22');
    });
    it('needs at least a year property on the object in the ISO calendar', () => {
      throws(() => md.toPlainDate({ something: 'nothing' }), TypeError);
    });
    it("constrains if the MonthDay doesn't exist in the year", () => {
      const leapDay = PlainMonthDay.from('02-29');
      equal(`${leapDay.toPlainDate({ year: 2019 })}`, '2019-02-28');
      equal(`${leapDay.toPlainDate({ year: 2019 }, { overflow: 'constrain' })}`, '2019-02-28');
    });
  });
  describe('MonthDay.toString()', () => {
    const md1 = PlainMonthDay.from('11-18');
    const md2 = PlainMonthDay.from({ monthCode: 'M11', day: 18, calendar: 'gregory' });
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(md1.toString({ calendarName: 'auto' }), '11-18');
      equal(md2.toString({ calendarName: 'auto' }), '1972-11-18[u-ca=gregory]');
    });
    it('shows ISO calendar if calendarName = always', () => {
      equal(md1.toString({ calendarName: 'always' }), '11-18[u-ca=iso8601]');
    });
    it('omits non-ISO calendar, but not year, if calendarName = never', () => {
      equal(md1.toString({ calendarName: 'never' }), '11-18');
      equal(md2.toString({ calendarName: 'never' }), '1972-11-18');
    });
    it('default is calendar = auto', () => {
      equal(md1.toString(), '11-18');
      equal(md2.toString(), '1972-11-18[u-ca=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
