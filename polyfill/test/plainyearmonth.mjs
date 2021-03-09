import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainYearMonth } = Temporal;

describe('YearMonth', () => {
  describe('Structure', () => {
    it('YearMonth is a Function', () => {
      equal(typeof PlainYearMonth, 'function');
    });
    it('YearMonth has a prototype', () => {
      assert(PlainYearMonth.prototype);
      equal(typeof PlainYearMonth.prototype, 'object');
    });
    describe('YearMonth.prototype', () => {
      it('YearMonth.prototype has month', () => {
        assert('month' in PlainYearMonth.prototype);
      });
      it('YearMonth.prototype has monthCode', () => {
        assert('monthCode' in PlainYearMonth.prototype);
      });
      it('YearMonth.prototype.until is a Function', () => {
        equal(typeof PlainYearMonth.prototype.until, 'function');
      });
      it('YearMonth.prototype.since is a Function', () => {
        equal(typeof PlainYearMonth.prototype.since, 'function');
      });
      it('YearMonth.prototype.equals is a Function', () => {
        equal(typeof PlainYearMonth.prototype.equals, 'function');
      });
      it('YearMonth.prototype.toString is a Function', () => {
        equal(typeof PlainYearMonth.prototype.toString, 'function');
      });
      it('YearMonth.prototype.getISOFields is a Function', () => {
        equal(typeof PlainYearMonth.prototype.getISOFields, 'function');
      });
      it('YearMonth.prototype has daysInYear', () => {
        assert('daysInYear' in PlainYearMonth.prototype);
      });
      it('YearMonth.prototype has monthsInYear', () => {
        assert('monthsInYear' in PlainYearMonth.prototype);
      });
    });
    it('YearMonth.compare is a Function', () => {
      equal(typeof PlainYearMonth.compare, 'function');
    });
  });
  describe('Construction', () => {
    let ym;
    it('YearMonth can be constructed', () => {
      ym = new PlainYearMonth(1976, 11);
      assert(ym);
      equal(typeof ym, 'object');
    });
    it('ym.year is 1976', () => equal(ym.year, 1976));
    it('ym.month is 11', () => equal(ym.month, 11));
    it('ym.monthCode is "M11"', () => equal(ym.monthCode, 'M11'));
    it('ym.daysInMonth is 30', () => equal(ym.daysInMonth, 30));
    it('ym.daysInYear is 366', () => equal(ym.daysInYear, 366));
    it('ym.monthsInYear is 12', () => equal(ym.monthsInYear, 12));
    describe('.from()', () => {
      it('YearMonth.from(2019-10) == 2019-10', () => equal(`${PlainYearMonth.from('2019-10')}`, '2019-10'));
      it('YearMonth.from(2019-10-01T09:00:00Z) == 2019-10', () =>
        equal(`${PlainYearMonth.from('2019-10-01T09:00:00Z')}`, '2019-10'));
      it("YearMonth.from('1976-11') == (1976-11)", () => equal(`${PlainYearMonth.from('1976-11')}`, '1976-11'));
      it("YearMonth.from('1976-11-18') == (1976-11)", () => equal(`${PlainYearMonth.from('1976-11-18')}`, '1976-11'));
      it('can be constructed with monthCode and without month', () =>
        equal(`${PlainYearMonth.from({ year: 2019, monthCode: 'M11' })}`, '2019-11'));
      it('can be constructed with month and without monthCode', () =>
        equal(`${PlainYearMonth.from({ year: 2019, month: 11 })}`, '2019-11'));
      it('month and monthCode must agree', () =>
        throws(() => PlainYearMonth.from({ year: 2019, month: 11, monthCode: 'M12' }), RangeError));
      it('ignores day when determining the ISO reference day from year/month', () => {
        const one = PlainYearMonth.from({ year: 2019, month: 11, day: 1 });
        const two = PlainYearMonth.from({ year: 2019, month: 11, day: 2 });
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('ignores day when determining the ISO reference day from year/monthCode', () => {
        const one = PlainYearMonth.from({ year: 2019, monthCode: 'M11', day: 1 });
        const two = PlainYearMonth.from({ year: 2019, monthCode: 'M11', day: 2 });
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('ignores day when determining the ISO reference day from era/eraYear/month', () => {
        const one = PlainYearMonth.from({ era: 'ce', eraYear: 2019, month: 11, day: 1, calendar: 'gregory' });
        const two = PlainYearMonth.from({ era: 'ce', eraYear: 2019, month: 11, day: 2, calendar: 'gregory' });
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('ignores day when determining the ISO reference day from era/eraYear/monthCode', () => {
        const one = PlainYearMonth.from({ era: 'ce', eraYear: 2019, monthCode: 'M11', day: 1, calendar: 'gregory' });
        const two = PlainYearMonth.from({ era: 'ce', eraYear: 2019, monthCode: 'M11', day: 2, calendar: 'gregory' });
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('YearMonth.from(2019-11) is not the same object', () => {
        const orig = new PlainYearMonth(2019, 11);
        const actu = PlainYearMonth.from(orig);
        notEqual(actu, orig);
      });
      it('ignores day when determining the ISO reference day from other Temporal object', () => {
        const plainDate1 = Temporal.PlainDate.from('1976-11-01');
        const plainDate2 = Temporal.PlainDate.from('1976-11-18');
        const one = PlainYearMonth.from(plainDate1);
        const two = PlainYearMonth.from(plainDate2);
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('YearMonth.from({ year: 2019 }) throws', () => throws(() => PlainYearMonth.from({ year: 2019 }), TypeError));
      it('YearMonth.from({ month: 6 }) throws', () => throws(() => PlainYearMonth.from({ month: 6 }), TypeError));
      it('YearMonth.from({ monthCode: "M06" }) throws', () =>
        throws(() => PlainYearMonth.from({ monthCode: 'M06' }), TypeError));
      it('YearMonth.from({}) throws', () => throws(() => PlainYearMonth.from({}), TypeError));
      it('YearMonth.from(required prop undefined) throws', () =>
        throws(() => PlainYearMonth.from({ year: undefined, month: 6 }), TypeError));
      it('YearMonth.from(number) is converted to string', () =>
        assert(PlainYearMonth.from(201906).equals(PlainYearMonth.from('201906'))));
      it('basic format', () => {
        equal(`${PlainYearMonth.from('197611')}`, '1976-11');
        equal(`${PlainYearMonth.from('+00197611')}`, '1976-11');
      });
      it('variant minus sign', () => {
        equal(`${PlainYearMonth.from('\u2212009999-11')}`, '-009999-11');
        equal(`${PlainYearMonth.from('1976-11-18T15:23:30.1\u221202:00')}`, '1976-11');
      });
      it('mixture of basic and extended format', () => {
        equal(`${PlainYearMonth.from('1976-11-18T152330.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('19761118T15:23:30.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('1976-11-18T15:23:30.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('1976-11-18T152330.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('19761118T15:23:30.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('19761118T152330.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('19761118T152330.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('+001976-11-18T152330.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('+0019761118T15:23:30.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('+001976-11-18T152330.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('+0019761118T15:23:30.1+0000')}`, '1976-11');
        equal(`${PlainYearMonth.from('+0019761118T152330.1+00:00')}`, '1976-11');
        equal(`${PlainYearMonth.from('+0019761118T152330.1+0000')}`, '1976-11');
      });
      it('optional components', () => {
        equal(`${PlainYearMonth.from('1976-11-18T15:23')}`, '1976-11');
        equal(`${PlainYearMonth.from('1976-11-18T15')}`, '1976-11');
        equal(`${PlainYearMonth.from('1976-11-18')}`, '1976-11');
      });
      it('ignores day when determining the ISO reference day from string', () => {
        const one = PlainYearMonth.from('1976-11-01');
        const two = PlainYearMonth.from('1976-11-18');
        equal(one.getISOFields().isoDay, two.getISOFields().isoDay);
      });
      it('no junk at end of string', () => throws(() => PlainYearMonth.from('1976-11junk'), RangeError));
      it('options may only be an object or undefined', () => {
        [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
          throws(() => PlainYearMonth.from({ year: 1976, month: 11 }, badOptions), TypeError)
        );
        [{}, () => {}, undefined].forEach((options) =>
          equal(`${PlainYearMonth.from({ year: 1976, month: 11 }, options)}`, '1976-11')
        );
      });
      describe('Overflow', () => {
        const bad = { year: 2019, month: 13 };
        it('reject', () => throws(() => PlainYearMonth.from(bad, { overflow: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${PlainYearMonth.from(bad)}`, '2019-12');
          equal(`${PlainYearMonth.from(bad, { overflow: 'constrain' })}`, '2019-12');
        });
        it('throw on bad overflow', () => {
          [new PlainYearMonth(2019, 1), { year: 2019, month: 1 }, '2019-01'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
              throws(() => PlainYearMonth.from(input, { overflow }), RangeError)
            );
          });
        });
        it('constrain has no effect on invalid ISO string', () => {
          throws(() => PlainYearMonth.from('2020-13', { overflow: 'constrain' }), RangeError);
        });
      });
      it('object must contain at least the required correctly-spelled properties', () => {
        throws(() => PlainYearMonth.from({}), TypeError);
        throws(() => PlainYearMonth.from({ year: 1976, months: 11 }), TypeError);
      });
      it('incorrectly-spelled properties are ignored', () => {
        equal(`${PlainYearMonth.from({ year: 1976, month: 11, months: 12 })}`, '1976-11');
      });
    });
    describe('.with()', () => {
      const ym = PlainYearMonth.from('2019-10');
      it('with(2020)', () => equal(`${ym.with({ year: 2020 })}`, '2020-10'));
      it('with(09)', () => equal(`${ym.with({ month: 9 })}`, '2019-09'));
      it('with(monthCode)', () => equal(`${ym.with({ monthCode: 'M09' })}`, '2019-09'));
      it('month and monthCode must agree', () => throws(() => ym.with({ month: 9, monthCode: 'M10' }), RangeError));
    });
  });
  describe('YearMonth.with() works', () => {
    const ym = PlainYearMonth.from('2019-10');
    it('throws with calendar property', () => {
      throws(() => ym.with({ year: 2021, calendar: 'iso8601' }), TypeError);
    });
    it('throws with timeZone property', () => {
      throws(() => ym.with({ year: 2021, timeZone: 'UTC' }), TypeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => ym.with({ year: 2020 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${ym.with({ year: 2020 }, options)}`, '2020-10'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => ym.with({}), TypeError);
      throws(() => ym.with({ months: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${ym.with({ month: 1, years: 2020 })}`, '2019-01');
    });
    it('day is ignored when determining ISO reference day', () => {
      equal(ym.with({ year: ym.year, day: 31 }).getISOFields().isoDay, ym.getISOFields().isoDay);
    });
  });
  describe('YearMonth.compare() works', () => {
    const nov94 = PlainYearMonth.from('1994-11');
    const jun13 = PlainYearMonth.from('2013-06');
    it('equal', () => equal(PlainYearMonth.compare(nov94, nov94), 0));
    it('smaller/larger', () => equal(PlainYearMonth.compare(nov94, jun13), -1));
    it('larger/smaller', () => equal(PlainYearMonth.compare(jun13, nov94), 1));
    it('casts first argument', () => {
      equal(PlainYearMonth.compare({ year: 1994, month: 11 }, jun13), -1);
      equal(PlainYearMonth.compare('1994-11', jun13), -1);
    });
    it('casts second argument', () => {
      equal(PlainYearMonth.compare(nov94, { year: 2013, month: 6 }), -1);
      equal(PlainYearMonth.compare(nov94, '2013-06'), -1);
    });
    it('object must contain at least the required properties', () => {
      throws(() => PlainYearMonth.compare({ year: 1994 }, jun13), TypeError);
      throws(() => PlainYearMonth.compare(nov94, { year: 2013 }), TypeError);
    });
    it('takes [[ISODay]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601');
      const ym1 = new PlainYearMonth(2000, 1, iso, 1);
      const ym2 = new PlainYearMonth(2000, 1, iso, 2);
      equal(PlainYearMonth.compare(ym1, ym2), -1);
    });
  });
  describe('YearMonth.equals() works', () => {
    const nov94 = PlainYearMonth.from('1994-11');
    const jun13 = PlainYearMonth.from('2013-06');
    it('equal', () => assert(nov94.equals(nov94)));
    it('unequal', () => assert(!nov94.equals(jun13)));
    it('casts argument', () => {
      assert(nov94.equals({ year: 1994, month: 11 }));
      assert(nov94.equals('1994-11'));
    });
    it('object must contain at least the required properties', () => {
      throws(() => nov94.equals({ year: 1994 }), TypeError);
    });
    it('takes [[ISODay]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601');
      const ym1 = new PlainYearMonth(2000, 1, iso, 1);
      const ym2 = new PlainYearMonth(2000, 1, iso, 2);
      assert(!ym1.equals(ym2));
    });
  });
  describe("Comparison operators don't work", () => {
    const ym1 = PlainYearMonth.from('1963-02');
    const ym1again = PlainYearMonth.from('1963-02');
    const ym2 = PlainYearMonth.from('1976-11');
    it('=== is object equality', () => equal(ym1, ym1));
    it('!== is object equality', () => notEqual(ym1, ym1again));
    it('<', () => throws(() => ym1 < ym2));
    it('>', () => throws(() => ym1 > ym2));
    it('<=', () => throws(() => ym1 <= ym2));
    it('>=', () => throws(() => ym1 >= ym2));
  });
  describe('YearMonth.until() works', () => {
    const nov94 = PlainYearMonth.from('1994-11');
    const jun13 = PlainYearMonth.from('2013-06');
    const diff = nov94.until(jun13);
    it(`${jun13}.until(${nov94}) == ${nov94}.until(${jun13}).negated()`, () =>
      equal(`${jun13.until(nov94)}`, `${diff.negated()}`));
    it(`${nov94}.add(${diff}) == ${jun13}`, () => nov94.add(diff).equals(jun13));
    it(`${jun13}.subtract(${diff}) == ${nov94}`, () => jun13.subtract(diff).equals(nov94));
    it(`${nov94}.until(${jun13}) == ${jun13}.since(${nov94})`, () => equal(`${diff}`, `${jun13.since(nov94)}`));
    it('casts argument', () => {
      equal(`${nov94.until({ year: 2013, month: 6 })}`, `${diff}`);
      equal(`${nov94.until('2013-06')}`, `${diff}`);
    });
    it('object must contain at least the required properties', () => {
      throws(() => nov94.until({ year: 2013 }), TypeError);
    });
    const feb20 = PlainYearMonth.from('2020-02');
    const feb21 = PlainYearMonth.from('2021-02');
    it('defaults to returning years', () => {
      equal(`${feb20.until(feb21)}`, 'P1Y');
      equal(`${feb20.until(feb21, { largestUnit: 'auto' })}`, 'P1Y');
      equal(`${feb20.until(feb21, { largestUnit: 'years' })}`, 'P1Y');
    });
    it('can return months', () => {
      equal(`${feb20.until(feb21, { largestUnit: 'months' })}`, 'P12M');
    });
    it('cannot return lower units', () => {
      throws(() => feb20.until(feb21, { largestUnit: 'weeks' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'days' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'hours' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'minutes' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'seconds' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'milliseconds' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'microseconds' }), RangeError);
      throws(() => feb20.until(feb21, { largestUnit: 'nanoseconds' }), RangeError);
    });
    it('no two different calendars', () => {
      const ym1 = new PlainYearMonth(2000, 1);
      const ym2 = new PlainYearMonth(2000, 1, Temporal.Calendar.from('japanese'));
      throws(() => ym1.until(ym2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb20.until(feb21, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb20.until(feb21, options)}`, 'P1Y'));
    });
    const earlier = PlainYearMonth.from('2019-01');
    const later = PlainYearMonth.from('2021-09');
    it('throws on disallowed or invalid smallestUnit', () => {
      [
        'era',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds',
        'nonsense'
      ].forEach((smallestUnit) => {
        throws(() => earlier.until(later, { smallestUnit }), RangeError);
      });
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      throws(() => earlier.until(later, { largestUnit: 'months', smallestUnit: 'years' }), RangeError);
    });
    it('throws on invalid roundingMode', () => {
      throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P2Y8M']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P2Y8M']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected);
        equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${earlier.until(later, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${later.until(earlier, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(
        `${earlier.until(later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      );
    });
    it('rounds to an increment of months', () => {
      equal(`${earlier.until(later, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M');
      equal(
        `${earlier.until(later, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
        'P30M'
      );
    });
    it('accepts singular units', () => {
      equal(`${earlier.until(later, { largestUnit: 'year' })}`, `${earlier.until(later, { largestUnit: 'years' })}`);
      equal(`${earlier.until(later, { smallestUnit: 'year' })}`, `${earlier.until(later, { smallestUnit: 'years' })}`);
      equal(`${earlier.until(later, { largestUnit: 'month' })}`, `${earlier.until(later, { largestUnit: 'months' })}`);
      equal(
        `${earlier.until(later, { smallestUnit: 'month' })}`,
        `${earlier.until(later, { smallestUnit: 'months' })}`
      );
    });
  });
  describe('YearMonth.since() works', () => {
    const nov94 = PlainYearMonth.from('1994-11');
    const jun13 = PlainYearMonth.from('2013-06');
    const diff = jun13.since(nov94);
    it(`${nov94}.since(${jun13}) == ${jun13}.since(${nov94}).negated()`, () =>
      equal(`${nov94.since(jun13)}`, `${diff.negated()}`));
    it(`${nov94}.add(${diff}) == ${jun13}`, () => nov94.add(diff).equals(jun13));
    it(`${jun13}.subtract(${diff}) == ${nov94}`, () => jun13.subtract(diff).equals(nov94));
    it(`${jun13}.since(${nov94}) == ${nov94}.until(${jun13})`, () => equal(`${diff}`, `${nov94.until(jun13)}`));
    it('casts argument', () => {
      equal(`${jun13.since({ year: 1994, month: 11 })}`, `${diff}`);
      equal(`${jun13.since('1994-11')}`, `${diff}`);
    });
    it('object must contain at least the required properties', () => {
      throws(() => jun13.since({ year: 1994 }), TypeError);
    });
    const feb20 = PlainYearMonth.from('2020-02');
    const feb21 = PlainYearMonth.from('2021-02');
    it('defaults to returning years', () => {
      equal(`${feb21.since(feb20)}`, 'P1Y');
      equal(`${feb21.since(feb20, { largestUnit: 'auto' })}`, 'P1Y');
      equal(`${feb21.since(feb20, { largestUnit: 'years' })}`, 'P1Y');
    });
    it('can return months', () => {
      equal(`${feb21.since(feb20, { largestUnit: 'months' })}`, 'P12M');
    });
    it('cannot return lower units', () => {
      throws(() => feb21.since(feb20, { largestUnit: 'weeks' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'days' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'hours' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'minutes' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'seconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'milliseconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'microseconds' }), RangeError);
      throws(() => feb21.since(feb20, { largestUnit: 'nanoseconds' }), RangeError);
    });
    it('no two different calendars', () => {
      const ym1 = new PlainYearMonth(2000, 1);
      const ym2 = new PlainYearMonth(2000, 1, Temporal.Calendar.from('japanese'));
      throws(() => ym1.since(ym2), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => feb21.since(feb20, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${feb21.since(feb20, options)}`, 'P1Y'));
    });
    const earlier = PlainYearMonth.from('2019-01');
    const later = PlainYearMonth.from('2021-09');
    it('throws on disallowed or invalid smallestUnit', () => {
      [
        'era',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds',
        'microseconds',
        'nanoseconds',
        'nonsense'
      ].forEach((smallestUnit) => {
        throws(() => later.since(earlier, { smallestUnit }), RangeError);
      });
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
      throws(() => later.since(earlier, { largestUnit: 'months', smallestUnit: 'years' }), RangeError);
    });
    it('throws on invalid roundingMode', () => {
      throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError);
    });
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P2Y8M']
    ];
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand';
      it(`rounds to nearest ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ];
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil';
      it(`rounds up to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ];
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor';
      it(`rounds down to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative);
      });
    });
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P2Y8M']
    ];
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc';
      it(`truncates to ${smallestUnit}`, () => {
        equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected);
        equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`);
      });
    });
    it('trunc is the default', () => {
      equal(`${later.since(earlier, { smallestUnit: 'years' })}`, 'P2Y');
      equal(`${earlier.since(later, { smallestUnit: 'years' })}`, '-P2Y');
    });
    it('rounds to an increment of years', () => {
      equal(
        `${later.since(earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      );
    });
    it('rounds to an increment of months', () => {
      equal(`${later.since(earlier, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M');
      equal(
        `${later.since(earlier, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
        'P30M'
      );
    });
    it('accepts singular units', () => {
      equal(`${later.since(earlier, { largestUnit: 'year' })}`, `${later.since(earlier, { largestUnit: 'years' })}`);
      equal(`${later.since(earlier, { smallestUnit: 'year' })}`, `${later.since(earlier, { smallestUnit: 'years' })}`);
      equal(`${later.since(earlier, { largestUnit: 'month' })}`, `${later.since(earlier, { largestUnit: 'months' })}`);
      equal(
        `${later.since(earlier, { smallestUnit: 'month' })}`,
        `${later.since(earlier, { smallestUnit: 'months' })}`
      );
    });
  });
  describe('YearMonth.add() works', () => {
    const ym = PlainYearMonth.from('2019-11');
    it('(2019-11) plus 2 months === 2020-01', () => {
      equal(`${ym.add({ months: 2 })}`, '2020-01');
      equal(`${ym.add({ months: 2 }, { overflow: 'constrain' })}`, '2020-01');
      equal(`${ym.add({ months: 2 }, { overflow: 'reject' })}`, '2020-01');
    });
    it('(2019-11) plus 1 year === 2020-11', () => {
      equal(`${ym.add({ years: 1 })}`, '2020-11');
      equal(`${ym.add({ years: 1 }, { overflow: 'constrain' })}`, '2020-11');
      equal(`${ym.add({ years: 1 }, { overflow: 'reject' })}`, '2020-11');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainYearMonth.from('2020-01').add({ months: -2 })}`, '2019-11');
      equal(`${PlainYearMonth.from('2020-11').add({ years: -1 })}`, '2019-11');
    });
    it('yearMonth.add(durationObj)', () => {
      equal(`${ym.add(Temporal.Duration.from('P2M'))}`, '2020-01');
    });
    it('casts argument', () => equal(`${ym.add('P2M')}`, '2020-01'));
    it("ignores lower units that don't balance up to the length of the month", () => {
      equal(`${ym.add({ days: 1 })}`, '2019-11');
      equal(`${ym.add({ days: 29 })}`, '2019-11');
      equal(`${ym.add({ hours: 1 })}`, '2019-11');
      equal(`${ym.add({ minutes: 1 })}`, '2019-11');
      equal(`${ym.add({ seconds: 1 })}`, '2019-11');
      equal(`${ym.add({ milliseconds: 1 })}`, '2019-11');
      equal(`${ym.add({ microseconds: 1 })}`, '2019-11');
      equal(`${ym.add({ nanoseconds: 1 })}`, '2019-11');
    });
    it('adds lower units that balance up to a month or more', () => {
      equal(`${ym.add({ days: 30 })}`, '2019-12');
      equal(`${ym.add({ days: 31 })}`, '2019-12');
      equal(`${ym.add({ days: 60 })}`, '2019-12');
      equal(`${ym.add({ days: 61 })}`, '2020-01');
      equal(`${ym.add({ hours: 720 })}`, '2019-12');
      equal(`${ym.add({ minutes: 43200 })}`, '2019-12');
      equal(`${ym.add({ seconds: 2592000 })}`, '2019-12');
      equal(`${ym.add({ milliseconds: 2592000_000 })}`, '2019-12');
      equal(`${ym.add({ microseconds: 2592000_000_000 })}`, '2019-12');
      equal(`${ym.add({ nanoseconds: 2592000_000_000_000 })}`, '2019-12');
    });
    it('balances days to months based on the number of days in the ISO month', () => {
      equal(`${PlainYearMonth.from('2019-02').add({ days: 27 })}`, '2019-02');
      equal(`${PlainYearMonth.from('2019-02').add({ days: 28 })}`, '2019-03');
      equal(`${PlainYearMonth.from('2020-02').add({ days: 28 })}`, '2020-02');
      equal(`${PlainYearMonth.from('2020-02').add({ days: 29 })}`, '2020-03');
      equal(`${PlainYearMonth.from('2019-11').add({ days: 29 })}`, '2019-11');
      equal(`${PlainYearMonth.from('2019-11').add({ days: 30 })}`, '2019-12');
      equal(`${PlainYearMonth.from('2020-01').add({ days: 30 })}`, '2020-01');
      equal(`${PlainYearMonth.from('2020-01').add({ days: 31 })}`, '2020-02');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => ym.add({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => ym.add({ years: 1, months: -6 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => ym.add({ months: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${ym.add({ months: 1 }, options)}`, '2019-12'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => ym.add({}), TypeError);
      throws(() => ym.add({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${ym.add({ month: 1, years: 1 })}`, '2020-11');
    });
  });
  describe('YearMonth.subtract() works', () => {
    const ym = PlainYearMonth.from('2019-11');
    it('(2019-11) minus 11 months === 2018-12', () => {
      equal(`${ym.subtract({ months: 11 })}`, '2018-12');
      equal(`${ym.subtract({ months: 11 }, { overflow: 'constrain' })}`, '2018-12');
      equal(`${ym.subtract({ months: 11 }, { overflow: 'reject' })}`, '2018-12');
    });
    it('(2019-11) minus 12 years === 2007-11', () => {
      equal(`${ym.subtract({ years: 12 })}`, '2007-11');
      equal(`${ym.subtract({ years: 12 }, { overflow: 'constrain' })}`, '2007-11');
      equal(`${ym.subtract({ years: 12 }, { overflow: 'reject' })}`, '2007-11');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainYearMonth.from('2018-12').subtract({ months: -11 })}`, '2019-11');
      equal(`${PlainYearMonth.from('2007-11').subtract({ years: -12 })}`, '2019-11');
    });
    it('yearMonth.subtract(durationObj)', () => {
      equal(`${ym.subtract(Temporal.Duration.from('P11M'))}`, '2018-12');
    });
    it('casts argument', () => equal(`${ym.subtract('P11M')}`, '2018-12'));
    it("ignores lower units that don't balance up to the length of the month", () => {
      equal(`${ym.subtract({ days: 1 })}`, '2019-11');
      equal(`${ym.subtract({ hours: 1 })}`, '2019-11');
      equal(`${ym.subtract({ minutes: 1 })}`, '2019-11');
      equal(`${ym.subtract({ seconds: 1 })}`, '2019-11');
      equal(`${ym.subtract({ milliseconds: 1 })}`, '2019-11');
      equal(`${ym.subtract({ microseconds: 1 })}`, '2019-11');
      equal(`${ym.subtract({ nanoseconds: 1 })}`, '2019-11');
    });
    it('subtracts lower units that balance up to a day or more', () => {
      equal(`${ym.subtract({ days: 29 })}`, '2019-11');
      equal(`${ym.subtract({ days: 30 })}`, '2019-10');
      equal(`${ym.subtract({ days: 60 })}`, '2019-10');
      equal(`${ym.subtract({ days: 61 })}`, '2019-09');
      equal(`${ym.subtract({ hours: 720 })}`, '2019-10');
      equal(`${ym.subtract({ minutes: 43200 })}`, '2019-10');
      equal(`${ym.subtract({ seconds: 2592000 })}`, '2019-10');
      equal(`${ym.subtract({ milliseconds: 2592000_000 })}`, '2019-10');
      equal(`${ym.subtract({ microseconds: 2592000_000_000 })}`, '2019-10');
      equal(`${ym.subtract({ nanoseconds: 2592000_000_000_000 })}`, '2019-10');
    });
    it('balances days to months based on the number of days in the ISO month', () => {
      equal(`${PlainYearMonth.from('2019-02').subtract({ days: 27 })}`, '2019-02');
      equal(`${PlainYearMonth.from('2019-02').subtract({ days: 28 })}`, '2019-01');
      equal(`${PlainYearMonth.from('2020-02').subtract({ days: 28 })}`, '2020-02');
      equal(`${PlainYearMonth.from('2020-02').subtract({ days: 29 })}`, '2020-01');
      equal(`${PlainYearMonth.from('2019-11').subtract({ days: 29 })}`, '2019-11');
      equal(`${PlainYearMonth.from('2019-11').subtract({ days: 30 })}`, '2019-10');
      equal(`${PlainYearMonth.from('2020-01').subtract({ days: 30 })}`, '2020-01');
      equal(`${PlainYearMonth.from('2020-01').subtract({ days: 31 })}`, '2019-12');
    });
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => ym.subtract({ months: 1 }, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'reject'].forEach((overflow) =>
        throws(() => ym.subtract({ years: 1, months: -6 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => ym.subtract({ months: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${ym.subtract({ months: 1 }, options)}`, '2019-10'));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => ym.subtract({}), TypeError);
      throws(() => ym.subtract({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${ym.subtract({ month: 1, years: 1 })}`, '2018-11');
    });
  });
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new PlainYearMonth(-271821, 3), RangeError);
      throws(() => new PlainYearMonth(275760, 10), RangeError);
      equal(`${new PlainYearMonth(-271821, 4)}`, '-271821-04');
      equal(`${new PlainYearMonth(275760, 9)}`, '+275760-09');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 3 };
      const tooLate = { year: 275760, month: 10 };
      ['reject', 'constrain'].forEach((overflow) => {
        [tooEarly, tooLate].forEach((props) => {
          throws(() => PlainYearMonth.from(props, { overflow }), RangeError);
        });
      });
      equal(`${PlainYearMonth.from({ year: -271821, month: 4 })}`, '-271821-04');
      equal(`${PlainYearMonth.from({ year: 275760, month: 9 })}`, '+275760-09');
    });
    it('constructing from ISO string', () => {
      ['reject', 'constrain'].forEach((overflow) => {
        ['-271821-03', '+275760-10'].forEach((str) => {
          throws(() => PlainYearMonth.from(str, { overflow }), RangeError);
        });
      });
      equal(`${PlainYearMonth.from('-271821-04')}`, '-271821-04');
      equal(`${PlainYearMonth.from('+275760-09')}`, '+275760-09');
    });
    it('converting from Date', () => {
      const min = Temporal.PlainDate.from('-271821-04-19');
      const max = Temporal.PlainDate.from('+275760-09-13');
      equal(`${min.toPlainYearMonth()}`, '-271821-04');
      equal(`${max.toPlainYearMonth()}`, '+275760-09');
    });
    it('adding and subtracting beyond limit', () => {
      const min = PlainYearMonth.from('-271821-04');
      const max = PlainYearMonth.from('+275760-09');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => min.subtract({ months: 1 }, { overflow }), RangeError);
        throws(() => max.add({ months: 1 }, { overflow }), RangeError);
      });
    });
  });
  describe('YearMonth.with()', () => {
    it('throws on bad overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => PlainYearMonth.from({ year: 2019, month: 1 }).with({ month: 2 }, { overflow }), RangeError)
      );
    });
  });
  describe('YearMonth.toPlainDate()', () => {
    const ym = PlainYearMonth.from('2002-01');
    it("doesn't take a primitive argument", () => {
      [22, '22', false, 22n, Symbol('22'), null].forEach((bad) => {
        throws(() => ym.toPlainDate(bad), TypeError);
      });
    });
    it('takes an object argument with day property', () => {
      equal(`${ym.toPlainDate({ day: 22 })}`, '2002-01-22');
    });
    it('needs at least a day property on the object in the ISO calendar', () => {
      throws(() => ym.toPlainDate({ something: 'nothing' }), TypeError);
    });
  });
  describe('YearMonth.toString()', () => {
    const ym1 = PlainYearMonth.from('1976-11');
    const ym2 = PlainYearMonth.from({ year: 1976, month: 11, calendar: 'gregory' });
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(ym1.toString({ calendarName: 'auto' }), '1976-11');
      equal(ym2.toString({ calendarName: 'auto' }), '1976-11-01[u-ca=gregory]');
    });
    it('shows ISO calendar if calendarName = always', () => {
      equal(ym1.toString({ calendarName: 'always' }), '1976-11[u-ca=iso8601]');
    });
    it('omits non-ISO calendar, but not day, if calendarName = never', () => {
      equal(ym1.toString({ calendarName: 'never' }), '1976-11');
      equal(ym2.toString({ calendarName: 'never' }), '1976-11-01');
    });
    it('default is calendar = auto', () => {
      equal(ym1.toString(), '1976-11');
      equal(ym2.toString(), '1976-11-01[u-ca=gregory]');
    });
    it('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
        throws(() => ym1.toString({ calendarName }), RangeError);
      });
    });
  });
  describe('yearMonth.getISOFields() works', () => {
    const ym1 = PlainYearMonth.from('1976-11');
    const fields = ym1.getISOFields();
    it('fields', () => {
      equal(fields.isoYear, 1976);
      equal(fields.isoMonth, 11);
      equal(fields.calendar.id, 'iso8601');
      equal(typeof fields.isoDay, 'number');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.isoYear, 1976);
      equal(fields2.isoMonth, 11);
      equal(fields2.calendar, fields.calendar);
      equal(typeof fields2.isoDay, 'number');
    });
    it('as input to constructor', () => {
      const ym2 = new PlainYearMonth(fields.isoYear, fields.isoMonth, fields.calendar, fields.isoDay);
      assert(ym2.equals(ym1));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
