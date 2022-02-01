import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainYearMonth } = Temporal;

describe('YearMonth', () => {
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
    it('adding and subtracting beyond limit', () => {
      const max = PlainYearMonth.from('+275760-09');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => max.add({ months: 1 }, { overflow }), RangeError);
      });
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
    it('adding and subtracting beyond limit', () => {
      const min = PlainYearMonth.from('-271821-04');
      ['reject', 'constrain'].forEach((overflow) => {
        throws(() => min.subtract({ months: 1 }, { overflow }), RangeError);
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
