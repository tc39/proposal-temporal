import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import { YearMonth } from 'tc39-temporal';

describe('YearMonth', () => {
  describe('Construction', () => {
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
      it('YearMonth.from({}) throws', () => throws(() => YearMonth.from({}), RangeError));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
