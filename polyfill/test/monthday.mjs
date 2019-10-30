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
    describe('.fromString()', ()=>{
      it('MonthDay.fromString(10-01) == 10-01', ()=>equal(`${MonthDay.fromString('10-01')}`, '10-01'));
      it('MonthDay.fromString(2019-10-01T09:00:00Z) == 10-01', ()=>equal(`${MonthDay.fromString('2019-10-01T09:00:00Z')}`, '10-01'));
      it(`MonthDay.fromString('11-18') == (11-18)`, ()=>equal(`${MonthDay.fromString('11-18')}`, '11-18'));
      it(`MonthDay.fromString('1976-11-18') == (11-18)`, ()=>equal(`${MonthDay.fromString('1976-11-18')}`, '11-18'));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
