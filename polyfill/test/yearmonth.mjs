import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'tc39-temporal';
const { YearMonth } = Temporal;

describe('YearMonth', () => {
  describe('Structure', () => {
    it('YearMonth is a Function', () => {
      equal(typeof YearMonth, 'function');
    });
    it('YearMonth has a prototype', () => {
      assert(YearMonth.prototype);
      equal(typeof YearMonth.prototype, 'object');
    });
    describe('YearMonth.prototype', () => {
      it('YearMonth.prototype.difference is a Function', () => {
        equal(typeof YearMonth.prototype.difference, 'function');
      });
      it('YearMonth.prototype.getFields is a Function', () => {
        equal(typeof YearMonth.prototype.getFields, 'function');
      });
      it('YearMonth.prototype has daysInYear', () => {
        assert('daysInYear' in YearMonth.prototype);
      });
    });
    it('YearMonth.compare is a Function', () => {
      equal(typeof YearMonth.compare, 'function');
    });
  });
  describe('Construction', () => {
    let ym;
    it('YearMonth can be constructed', () => {
      ym = new YearMonth(1976, 11);
      assert(ym);
      equal(typeof ym, 'object');
    });
    it('ym.year is 1976', () => equal(ym.year, 1976));
    it('ym.month is 11', () => equal(ym.month, 11));
    it('ym.daysInMonth is 30', () => equal(ym.daysInMonth, 30));
    it('ym.daysInYear is 366', () => equal(ym.daysInYear, 366));
    describe('.from()', () => {
      it('YearMonth.from(2019-10) == 2019-10', () => equal(`${YearMonth.from('2019-10')}`, '2019-10'));
      it('YearMonth.from(2019-10-01T09:00:00Z) == 2019-10', () =>
        equal(`${YearMonth.from('2019-10-01T09:00:00Z')}`, '2019-10'));
      it("YearMonth.from('1976-11') == (1976-11)", () => equal(`${YearMonth.from('1976-11')}`, '1976-11'));
      it("YearMonth.from('1976-11-18') == (1976-11)", () => equal(`${YearMonth.from('1976-11-18')}`, '1976-11'));
      it('YearMonth.from({ year: 2019, month: 11 }) == 2019-11', () =>
        equal(`${YearMonth.from({ year: 2019, month: 11 })}`, '2019-11'));
      it('YearMonth.from(2019-11) is not the same object', () => {
        const orig = new YearMonth(2019, 11);
        const actu = YearMonth.from(orig);
        notEqual(actu, orig);
      });
      it('YearMonth.from({ year: 2019 }) throws', () => throws(() => YearMonth.from({ year: 2019 }), TypeError));
      it('YearMonth.from({ month: 6 }) throws', () => throws(() => YearMonth.from({ month: 6 }), TypeError));
      it('YearMonth.from({}) throws', () => throws(() => YearMonth.from({}), TypeError));
      it('YearMonth.from(required prop undefined) throws', () =>
        throws(() => YearMonth.from({ year: undefined, month: 6 }), TypeError));
      it('YearMonth.from(number) is converted to string', () =>
        equal(`${YearMonth.from(201906)}`, `${YearMonth.from('201906')}`));
      it('basic format', () => {
        equal(`${YearMonth.from('197611')}`, '1976-11');
        equal(`${YearMonth.from('+00197611')}`, '1976-11');
      });
      it('mixture of basic and extended format', () => {
        equal(`${YearMonth.from('1976-11-18T152330.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('19761118T15:23:30.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('1976-11-18T15:23:30.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('1976-11-18T152330.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('19761118T15:23:30.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('19761118T152330.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('19761118T152330.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('+001976-11-18T152330.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('+0019761118T15:23:30.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('+001976-11-18T152330.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('+0019761118T15:23:30.1+0000')}`, '1976-11');
        equal(`${YearMonth.from('+0019761118T152330.1+00:00')}`, '1976-11');
        equal(`${YearMonth.from('+0019761118T152330.1+0000')}`, '1976-11');
      });
      it('optional components', () => {
        equal(`${YearMonth.from('1976-11-18T15:23')}`, '1976-11');
        equal(`${YearMonth.from('1976-11-18T15')}`, '1976-11');
        equal(`${YearMonth.from('1976-11-18')}`, '1976-11');
      });
      describe('Disambiguation', () => {
        const bad = { year: 2019, month: 13 };
        it('reject', () => throws(() => YearMonth.from(bad, { disambiguation: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${YearMonth.from(bad)}`, '2019-12');
          equal(`${YearMonth.from(bad, { disambiguation: 'constrain' })}`, '2019-12');
        });
        it('balance', () => equal(`${YearMonth.from(bad, { disambiguation: 'balance' })}`, '2020-01'));
        it('throw when bad disambiguation', () => {
          [new YearMonth(2019, 1), { year: 2019, month: 1 }, '2019-01'].forEach((input) => {
            ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
              throws(() => YearMonth.from(input, { disambiguation }), RangeError)
            );
          });
        });
      });
    });
    describe('.with()', () => {
      const ym = YearMonth.from('2019-10');
      it('with(2020)', () => equal(`${ym.with({ year: 2020 })}`, '2020-10'));
      it('with(09)', () => equal(`${ym.with({ month: 9 })}`, '2019-09'));
    });
  });
  describe('YearMonth.compare() works', () => {
    const nov94 = YearMonth.from('1994-11');
    const jun13 = YearMonth.from('2013-06');
    it('equal', () => equal(YearMonth.compare(nov94, nov94), 0));
    it('smaller/larger', () => equal(YearMonth.compare(nov94, jun13), -1));
    it('larger/smaller', () => equal(YearMonth.compare(jun13, nov94), 1));
    it("doesn't cast first argument", () => {
      throws(() => YearMonth.compare({ year: 1994, month: 11 }, jun13), TypeError);
      throws(() => YearMonth.compare('1994-11', jun13), TypeError);
    });
    it("doesn't cast second argument", () => {
      throws(() => YearMonth.compare(nov94, { year: 2013, month: 6 }), TypeError);
      throws(() => YearMonth.compare(nov94, '2013-06'), TypeError);
    });
  });
  describe('YearMonth.difference() works', () => {
    const nov94 = YearMonth.from('1994-11');
    const jun13 = YearMonth.from('2013-06');
    const diff = nov94.difference(jun13);
    it(`${nov94}.difference(${jun13}) == ${jun13}.difference(${nov94})`, () =>
      equal(`${diff}`, `${jun13.difference(nov94)}`));
    it(`${nov94}.plus(${diff}) == ${jun13}`, () => equal(`${nov94.plus(diff)}`, `${jun13}`));
    it(`${jun13}.minus(${diff}) == ${nov94}`, () => equal(`${jun13.minus(diff)}`, `${nov94}`));
    it("doesn't cast argument", () => {
      throws(() => nov94.difference({ year: 2013, month: 6 }), TypeError);
      throws(() => nov94.difference('2013-06'), TypeError);
    });
    const feb20 = YearMonth.from('2020-02');
    const feb21 = YearMonth.from('2021-02');
    it('defaults to returning years', () => {
      equal(`${feb21.difference(feb20)}`, 'P1Y');
      equal(`${feb21.difference(feb20, { largestUnit: 'years' })}`, 'P1Y');
    });
    it('can return months', () => {
      equal(`${feb21.difference(feb20, { largestUnit: 'months' })}`, 'P12M');
    });
    it('cannot return lower units', () => {
      throws(() => feb21.difference(feb20, { largestUnit: 'days' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'hours' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'minutes' }), RangeError);
      throws(() => feb21.difference(feb20, { largestUnit: 'seconds' }), RangeError);
    });
  });
  describe('YearMonth.plus() works', () => {
    const ym = YearMonth.from('2019-11');
    it('(2019-11) plus 2 months === 2020-01', () => {
      equal(`${ym.plus({ months: 2 })}`, '2020-01');
      equal(`${ym.plus({ months: 2 }, { disambiguation: 'constrain' })}`, '2020-01');
      equal(`${ym.plus({ months: 2 }, { disambiguation: 'reject' })}`, '2020-01');
    });
    it('(2019-11) plus 1 year === 2020-11', () => {
      equal(`${ym.plus({ years: 1 })}`, '2020-11');
      equal(`${ym.plus({ years: 1 }, { disambiguation: 'constrain' })}`, '2020-11');
      equal(`${ym.plus({ years: 1 }, { disambiguation: 'reject' })}`, '2020-11');
    });
    it('yearMonth.plus(durationObj)', () => {
      equal(`${ym.plus(Temporal.Duration.from('P2M'))}`, '2020-01');
    });
    it("ignores lower units that don't balance up to the length of the month", () => {
      equal(`${ym.plus({ days: 1 })}`, '2019-11');
      equal(`${ym.plus({ days: 29 })}`, '2019-11');
      equal(`${ym.plus({ hours: 1 })}`, '2019-11');
      equal(`${ym.plus({ minutes: 1 })}`, '2019-11');
      equal(`${ym.plus({ seconds: 1 })}`, '2019-11');
      equal(`${ym.plus({ milliseconds: 1 })}`, '2019-11');
      equal(`${ym.plus({ microseconds: 1 })}`, '2019-11');
      equal(`${ym.plus({ nanoseconds: 1 })}`, '2019-11');
    });
    it('adds lower units that balance up to a month or more', () => {
      equal(`${ym.plus({ days: 30 })}`, '2019-12');
      equal(`${ym.plus({ days: 31 })}`, '2019-12');
      equal(`${ym.plus({ days: 60 })}`, '2019-12');
      equal(`${ym.plus({ days: 61 })}`, '2020-01');
      equal(`${ym.plus({ hours: 720 })}`, '2019-12');
      equal(`${ym.plus({ minutes: 43200 })}`, '2019-12');
      equal(`${ym.plus({ seconds: 2592000 })}`, '2019-12');
      equal(`${ym.plus({ milliseconds: 2592000_000 })}`, '2019-12');
      equal(`${ym.plus({ microseconds: 2592000_000_000 })}`, '2019-12');
      equal(`${ym.plus({ nanoseconds: 2592000_000_000_000 })}`, '2019-12');
    });
    it('balances days to months based on the number of days in the ISO month', () => {
      equal(`${YearMonth.from('2019-02').plus({ days: 27 })}`, '2019-02');
      equal(`${YearMonth.from('2019-02').plus({ days: 28 })}`, '2019-03');
      equal(`${YearMonth.from('2020-02').plus({ days: 28 })}`, '2020-02');
      equal(`${YearMonth.from('2020-02').plus({ days: 29 })}`, '2020-03');
      equal(`${YearMonth.from('2019-11').plus({ days: 29 })}`, '2019-11');
      equal(`${YearMonth.from('2019-11').plus({ days: 30 })}`, '2019-12');
      equal(`${YearMonth.from('2020-01').plus({ days: 30 })}`, '2020-01');
      equal(`${YearMonth.from('2020-01').plus({ days: 31 })}`, '2020-02');
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => ym.plus({ months: 1 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('YearMonth.minus() works', () => {
    const ym = YearMonth.from('2019-11');
    it('(2019-11) minus 11 months === 2018-12', () => {
      equal(`${ym.minus({ months: 11 })}`, '2018-12');
      equal(`${ym.minus({ months: 11 }, { disambiguation: 'constrain' })}`, '2018-12');
      equal(`${ym.minus({ months: 11 }, { disambiguation: 'reject' })}`, '2018-12');
    });
    it('(2019-11) minus 12 years === 2007-11', () => {
      equal(`${ym.minus({ years: 12 })}`, '2007-11');
      equal(`${ym.minus({ years: 12 }, { disambiguation: 'constrain' })}`, '2007-11');
      equal(`${ym.minus({ years: 12 }, { disambiguation: 'reject' })}`, '2007-11');
    });
    it('yearMonth.minus(durationObj)', () => {
      equal(`${ym.minus(Temporal.Duration.from('P11M'))}`, '2018-12');
    });
    it("ignores lower units that don't balance up to the length of the month", () => {
      equal(`${ym.minus({ days: 1 })}`, '2019-11');
      equal(`${ym.minus({ hours: 1 })}`, '2019-11');
      equal(`${ym.minus({ minutes: 1 })}`, '2019-11');
      equal(`${ym.minus({ seconds: 1 })}`, '2019-11');
      equal(`${ym.minus({ milliseconds: 1 })}`, '2019-11');
      equal(`${ym.minus({ microseconds: 1 })}`, '2019-11');
      equal(`${ym.minus({ nanoseconds: 1 })}`, '2019-11');
    });
    it('subtracts lower units that balance up to a day or more', () => {
      equal(`${ym.minus({ days: 29 })}`, '2019-11');
      equal(`${ym.minus({ days: 30 })}`, '2019-10');
      equal(`${ym.minus({ days: 60 })}`, '2019-10');
      equal(`${ym.minus({ days: 61 })}`, '2019-09');
      equal(`${ym.minus({ hours: 720 })}`, '2019-10');
      equal(`${ym.minus({ minutes: 43200 })}`, '2019-10');
      equal(`${ym.minus({ seconds: 2592000 })}`, '2019-10');
      equal(`${ym.minus({ milliseconds: 2592000_000 })}`, '2019-10');
      equal(`${ym.minus({ microseconds: 2592000_000_000 })}`, '2019-10');
      equal(`${ym.minus({ nanoseconds: 2592000_000_000_000 })}`, '2019-10');
    });
    it('balances days to months based on the number of days in the ISO month', () => {
      equal(`${YearMonth.from('2019-02').minus({ days: 27 })}`, '2019-02');
      equal(`${YearMonth.from('2019-02').minus({ days: 28 })}`, '2019-01');
      equal(`${YearMonth.from('2020-02').minus({ days: 28 })}`, '2020-02');
      equal(`${YearMonth.from('2020-02').minus({ days: 29 })}`, '2020-01');
      equal(`${YearMonth.from('2019-11').minus({ days: 29 })}`, '2019-11');
      equal(`${YearMonth.from('2019-11').minus({ days: 30 })}`, '2019-10');
      equal(`${YearMonth.from('2020-01').minus({ days: 30 })}`, '2020-01');
      equal(`${YearMonth.from('2020-01').minus({ days: 31 })}`, '2019-12');
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => ym.minus({ months: 1 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      throws(() => new YearMonth(-271821, 3), RangeError);
      throws(() => new YearMonth(275760, 10), RangeError);
      equal(`${new YearMonth(-271821, 4)}`, '-271821-04');
      equal(`${new YearMonth(275760, 9)}`, '+275760-09');
    });
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 3 };
      const tooLate = { year: 275760, month: 10 };
      [tooEarly, tooLate].forEach((props) => {
        ['reject', 'balance'].forEach((disambiguation) => {
          throws(() => YearMonth.from(props, { disambiguation }), RangeError);
        });
      });
      equal(`${YearMonth.from(tooEarly)}`, '-271821-04');
      equal(`${YearMonth.from(tooLate)}`, '+275760-09');
      equal(`${YearMonth.from({ year: -271821, month: 4 })}`, '-271821-04');
      equal(`${YearMonth.from({ year: 275760, month: 9 })}`, '+275760-09');
    });
    it('constructing from ISO string', () => {
      ['-271821-03', '+275760-10'].forEach((str) => {
        ['balance', 'reject'].forEach((disambiguation) => {
          throws(() => YearMonth.from(str, { disambiguation }), RangeError);
        });
      });
      equal(`${YearMonth.from('-271821-03')}`, '-271821-04');
      equal(`${YearMonth.from('+275760-10')}`, '+275760-09');
      equal(`${YearMonth.from('-271821-04')}`, '-271821-04');
      equal(`${YearMonth.from('+275760-09')}`, '+275760-09');
    });
    it('converting from Date', () => {
      const min = Temporal.Date.from('-271821-04-19');
      const max = Temporal.Date.from('+275760-09-13');
      equal(`${min.getYearMonth()}`, '-271821-04');
      equal(`${max.getYearMonth()}`, '+275760-09');
    });
    it('adding and subtracting beyond limit', () => {
      const min = YearMonth.from('-271821-04');
      const max = YearMonth.from('+275760-09');
      equal(`${min.minus({ months: 1 })}`, '-271821-04');
      equal(`${max.plus({ months: 1 })}`, '+275760-09');
      throws(() => min.minus({ months: 1 }, { disambiguation: 'reject' }), RangeError);
      throws(() => max.plus({ months: 1 }, { disambiguation: 'reject' }), RangeError);
    });
  });
  describe('YearMonth.with()', () => {
    it('throws on bad disambiguation', () => {
      ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => YearMonth.from(2019, 1).with({ month: 2 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('yearMonth.getFields() works', () => {
    const ym1 = YearMonth.from('1976-11');
    const fields = ym1.getFields();
    it('fields', () => {
      equal(fields.year, 1976);
      equal(fields.month, 11);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.year, 1976);
      equal(fields2.month, 11);
    });
    it('as input to from()', () => {
      const ym2 = YearMonth.from(fields);
      equal(YearMonth.compare(ym1, ym2), 0);
    });
    it('as input to with()', () => {
      const ym2 = YearMonth.from('2019-06').with(fields);
      equal(YearMonth.compare(ym1, ym2), 0);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
