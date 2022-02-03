import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainYearMonth } = Temporal;

describe('YearMonth', () => {
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
    it('nov94.add(diff) == jun13', () => {
      const nov94 = PlainYearMonth.from('1994-11');
      const jun13 = PlainYearMonth.from('2013-06');
      const diff = Temporal.Duration.from('P18Y7M');
      assert(nov94.add(diff).equals(jun13));
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
    it('jun13.subtract(P18Y8M) == nov94', () => {
      const nov94 = PlainYearMonth.from('1994-11');
      const jun13 = PlainYearMonth.from('2013-06');
      const diff = Temporal.Duration.from('P18Y7M');
      assert(jun13.subtract(diff).equals(nov94));
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
