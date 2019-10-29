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
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
