import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainMonthDay } = Temporal;

describe('MonthDay', () => {
  describe('Structure', () => {
    it('MonthDay is a Function', () => {
      equal(typeof PlainMonthDay, 'function');
    });
    it('MonthDay has a prototype', () => {
      assert(PlainMonthDay.prototype);
      equal(typeof PlainMonthDay.prototype, 'object');
    });
    describe('MonthDay.prototype', () => {
      it('MonthDay.prototype.equals is a Function', () => {
        equal(typeof PlainMonthDay.prototype.equals, 'function');
      });
      it('MonthDay.prototype.toString is a Function', () => {
        equal(typeof PlainMonthDay.prototype.toString, 'function');
      });
      it('MonthDay.prototype.getFields is a Function', () => {
        equal(typeof PlainMonthDay.prototype.getFields, 'function');
      });
      it('MonthDay.prototype.getISOFields is a Function', () => {
        equal(typeof PlainMonthDay.prototype.getISOFields, 'function');
      });
    });
  });
  describe('Construction', () => {
    it('Leap day', () => equal(`${new PlainMonthDay(2, 29)}`, '02-29'));
    describe('.from()', () => {
      it('MonthDay.from(10-01) == 10-01', () => equal(`${PlainMonthDay.from('10-01')}`, '10-01'));
      it('MonthDay.from(2019-10-01T09:00:00Z) == 10-01', () =>
        equal(`${PlainMonthDay.from('2019-10-01T09:00:00Z')}`, '10-01'));
      it("MonthDay.from('11-18') == (11-18)", () => equal(`${PlainMonthDay.from('11-18')}`, '11-18'));
      it("MonthDay.from('1976-11-18') == (11-18)", () => equal(`${PlainMonthDay.from('1976-11-18')}`, '11-18'));
      it('MonthDay.from({ month: 11, day: 18 }) == 11-18', () =>
        equal(`${PlainMonthDay.from({ month: 11, day: 18 })}`, '11-18'));
      it('MonthDay.from(11-18) is not the same object', () => {
        const orig = new PlainMonthDay(11, 18);
        const actu = PlainMonthDay.from(orig);
        notEqual(actu, orig);
      });
      it('MonthDay.from({ day: 15 }) throws', () => throws(() => PlainMonthDay.from({ day: 15 }), TypeError));
      it('MonthDay.from({ month: 12 }) throws', () => throws(() => PlainMonthDay.from({ month: 12 }), TypeError));
      it('MonthDay.from({}) throws', () => throws(() => PlainMonthDay.from({}), TypeError));
      it('MonthDay.from(required prop undefined) throws', () =>
        throws(() => PlainMonthDay.from({ month: undefined, day: 15 }), TypeError));
      it('MonthDay.from(number) is converted to string', () =>
        assert(PlainMonthDay.from(1201).equals(PlainMonthDay.from('12-01'))));
      it('basic format', () => {
        equal(`${PlainMonthDay.from('1118')}`, '11-18');
      });
      it('mixture of basic and extended format', () => {
        equal(`${PlainMonthDay.from('1976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('19761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('1976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('1976-11-18T152330.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('19761118T15:23:30.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('19761118T152330.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('19761118T152330.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('+001976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('+0019761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('+001976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('+001976-11-18T152330.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('+0019761118T15:23:30.1+0000')}`, '11-18');
        equal(`${PlainMonthDay.from('+0019761118T152330.1+00:00')}`, '11-18');
        equal(`${PlainMonthDay.from('+0019761118T152330.1+0000')}`, '11-18');
      });
      it('optional parts', () => {
        equal(`${PlainMonthDay.from('1976-11-18T15:23')}`, '11-18');
        equal(`${PlainMonthDay.from('1976-11-18T15')}`, '11-18');
        equal(`${PlainMonthDay.from('1976-11-18')}`, '11-18');
      });
      it('RFC 3339 month-day syntax', () => {
        equal(`${PlainMonthDay.from('--11-18')}`, '11-18');
        equal(`${PlainMonthDay.from('--1118')}`, '11-18');
      });
      it('no junk at end of string', () => throws(() => PlainMonthDay.from('11-18junk'), RangeError));
      it('options may only be an object or undefined', () => {
        [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
          throws(() => PlainMonthDay.from({ month: 11, day: 18 }, badOptions), TypeError)
        );
        [{}, () => {}, undefined].forEach((options) =>
          equal(`${PlainMonthDay.from({ month: 11, day: 18 }, options)}`, '11-18')
        );
      });
      describe('Overflow', () => {
        const bad = { month: 1, day: 32 };
        it('reject', () => throws(() => PlainMonthDay.from(bad, { overflow: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${PlainMonthDay.from(bad)}`, '01-31');
          equal(`${PlainMonthDay.from(bad, { overflow: 'constrain' })}`, '01-31');
        });
        it('throw on bad overflow', () => {
          [new PlainMonthDay(11, 18), { month: 1, day: 1 }, '01-31'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
              throws(() => PlainMonthDay.from(input, { overflow }), RangeError)
            );
          });
        });
      });
      describe('Leap day', () => {
        ['reject', 'constrain'].forEach((overflow) =>
          it(overflow, () => equal(`${PlainMonthDay.from({ month: 2, day: 29 }, { overflow })}`, '02-29'))
        );
      });
      it('object must contain at least the required correctly-spelled properties', () => {
        throws(() => PlainMonthDay.from({}), TypeError);
        throws(() => PlainMonthDay.from({ months: 12, day: 31 }), TypeError);
      });
      it('incorrectly-spelled properties are ignored', () => {
        equal(`${PlainMonthDay.from({ month: 12, day: 1, days: 31 })}`, '12-01');
      });
    });
    describe('getters', () => {
      let md = new PlainMonthDay(1, 15);
      it("(1-15).month === '1'", () => {
        equal(`${md.month}`, '1');
      });
      it("(1-15).day === '15'", () => {
        equal(`${md.day}`, '15');
      });
    });
    describe('.with()', () => {
      const md = PlainMonthDay.from('01-22');
      it('with(12-)', () => equal(`${md.with({ month: 12 })}`, '12-22'));
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'));
    });
  });
  describe('MonthDay.with()', () => {
    const md = PlainMonthDay.from('01-15');
    it('throws on bad overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => md.with({ day: 1 }, { overflow }), RangeError)
      );
    });
    it('throws on trying to change the calendar', () => {
      throws(() => md.with({ calendar: 'gregory' }), RangeError);
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
      equal(`${md.with({ month: 12, days: 1 })}`, '12-15');
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
      throws(() => md.toPlainDate(2002), TypeError);
      throws(() => md.toPlainDate('2002'), TypeError);
      throws(() => md.toPlainDate(null), TypeError);
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
    it("can also reject if the MonthDay doesn't exist in the year", () => {
      const leapDay = PlainMonthDay.from('02-29');
      throws(() => leapDay.toPlainDate({ year: 2019 }, { overflow: 'reject' }));
    });
  });
  describe('MonthDay.toString()', () => {
    const md1 = PlainMonthDay.from('11-18');
    const md2 = PlainMonthDay.from({ month: 11, day: 18, calendar: 'gregory' });
    it('shows only non-ISO calendar if calendar = auto', () => {
      equal(md1.toString({ calendar: 'auto' }), '11-18');
      equal(md2.toString({ calendar: 'auto' }), '1972-11-18[c=gregory]');
    });
    it('shows ISO calendar if calendar = always', () => {
      equal(md1.toString({ calendar: 'always' }), '11-18[c=iso8601]');
    });
    it('omits non-ISO calendar, but not year, if calendar = never', () => {
      equal(md1.toString({ calendar: 'never' }), '11-18');
      equal(md2.toString({ calendar: 'never' }), '1972-11-18');
    });
    it('default is calendar = auto', () => {
      equal(md1.toString(), '11-18');
      equal(md2.toString(), '1972-11-18[c=gregory]');
    });
    it('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendar) => {
        throws(() => md1.toString({ calendar }), RangeError);
      });
    });
  });
  describe('monthDay.getFields() works', () => {
    const calendar = Temporal.Calendar.from('iso8601');
    const md1 = PlainMonthDay.from({ month: 11, day: 18, calendar });
    const fields = md1.getFields();
    it('fields', () => {
      equal(fields.month, 11);
      equal(fields.day, 18);
      equal(fields.calendar, calendar);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.month, 11);
      equal(fields2.day, 18);
      equal(fields2.calendar, calendar);
    });
    it('as input to from()', () => {
      const md2 = PlainMonthDay.from(fields);
      assert(md1.equals(md2));
    });
  });
  describe('monthDay.getISOFields() works', () => {
    const md1 = PlainMonthDay.from('11-18');
    const fields = md1.getISOFields();
    it('fields', () => {
      equal(fields.isoMonth, 11);
      equal(fields.isoDay, 18);
      equal(fields.calendar.id, 'iso8601');
      equal(typeof fields.isoYear, 'number');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoMonth, 11);
      equal(fields2.isoDay, 18);
      equal(fields2.calendar, fields.calendar);
      equal(typeof fields2.isoYear, 'number');
    });
    it('as input to constructor', () => {
      const md2 = new PlainMonthDay(fields.isoMonth, fields.isoDay, fields.calendar, fields.isoYear);
      assert(md2.equals(md1));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
