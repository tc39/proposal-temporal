import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

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

    describe('Disambiguation', () => {
      it('reject', () => throws(() => new YearMonth(2019, 13, 'reject'), RangeError));
      it('constrain', () => equal(`${new YearMonth(2019, 13, 'constrain')}`, '2019-12'));
      it('balance', () => equal(`${new YearMonth(2019, 13, 'balance')}`, '2020-01'));
      it('throw when bad disambiguation', () => throws(() => new YearMonth(2019, 1, 'xyz'), TypeError));
    });
    describe('.from()', () => {
      it('YearMonth.from(2019-10) == 2019-10', () => equal(`${YearMonth.from('2019-10')}`, '2019-10'));
      it('YearMonth.from(2019-10-01T09:00:00Z) == 2019-10', () =>
        equal(`${YearMonth.from('2019-10-01T09:00:00Z')}`, '2019-10'));
      it(`YearMonth.from('1976-11') == (1976-11)`, () => equal(`${YearMonth.from('1976-11')}`, '1976-11'));
      it(`YearMonth.from('1976-11-18') == (1976-11)`, () => equal(`${YearMonth.from('1976-11-18')}`, '1976-11'));
      it('YearMonth.from({ year: 2019, month: 11 }) == 2019-11', () => equal(`${ YearMonth.from({ year: 2019, month: 11 }) }`, '2019-11'));
      it('YearMonth.from(2019-11) == 2019-11', () => {
        const orig = new YearMonth(2019, 11);
        const actu = YearMonth.from(orig);
        equal(actu, orig);
      });
      it('YearMonth.from({ year: 2019 }) throws', () => throws(() => YearMonth.from({ year: 2019 }), TypeError));
      it('YearMonth.from({ month: 6 }) throws', () => throws(() => YearMonth.from({ month: 6 }), TypeError));
      it('YearMonth.from({}) throws', () => throws(() => YearMonth.from({}), TypeError));
      it('YearMonth.from(required prop undefined) throws', () =>
        throws(() => YearMonth.from({ year: undefined, month: 6 }), TypeError));
      it.skip('YearMonth.from(number) is converted to string', () =>
        equal(`${YearMonth.from(201906)}`, `${YearMonth.from('201906')}`))
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
  });
  describe('YearMonth.plus() works', () => {
    const ym = YearMonth.from('2019-11');
    it('(2019-11) plus 2 months === 2020-01', () =>
      equal(`${ym.plus({ months: 2 })}`, '2020-01'));
    it('(2019-11) plus 1 year === 2020-11', () =>
      equal(`${ym.plus({ years: 1 })}`, '2020-11'));
    it('yearMonth.plus(durationObj)', () => {
      equal(`${ym.plus(Temporal.Duration.from('P2M'))}`, '2020-01');
    });
  });
  describe('YearMonth.minus() works', () => {
    const ym = YearMonth.from('2019-11');
    it('(2019-11) minus 11 months === 2018-12', () =>
      equal(`${ym.minus({ months: 11 })}`, '2018-12'));
    it('(2019-11) minus 12 years === 2007-11', () =>
      equal(`${ym.minus({ years: 12 })}`, '2007-11'));
    it('yearMonth.minus(durationObj)', () => {
      equal(`${ym.minus(Temporal.Duration.from('P11M'))}`, '2018-12');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
