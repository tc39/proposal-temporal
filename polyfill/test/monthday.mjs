import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import { MonthDay } from 'tc39-temporal';

describe('MonthDay', () => {
  describe('Construction', () => {
    describe('Disambiguation', () => {
      it('reject', () => throws(() => new MonthDay(1, 32, 'reject'), RangeError));
      it('constrain', () => equal(`${new MonthDay(1, 32, 'constrain')}`, '01-31'));
      it('balance', () => equal(`${new MonthDay(1, 32, 'balance')}`, '02-01'));
      it('throw when bad disambiguation', () => throws(() => new MonthDay(1, 1, 'xyz'), TypeError));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);

