import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import { Duration } from 'tc39-temporal';

describe('Duration', () => {
  describe('Construction', () => {
    describe('Disambiguation', () => {
      it('reject', () => throws(() => new Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'reject'), RangeError));
      it('constrain', () =>
        equal(`${new Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'constrain')}`, 'P1Y1M1DT1H1M1.001001001S'));
      it('balance', () => equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 0, 1000, 'balance')}`, 'PT0.000001S'));
      it('throw when bad disambiguation', () =>
        throws(() => new Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, 'xyz'), TypeError));
    });
  });
  describe('basic', () => {
    it('negative values throw when "reject"', () =>
      throws(() => new Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'reject'), RangeError));
    it('negative values invert when "constrain"', () =>
      equal(`${new Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1, 'constrain')}`, 'P1Y1M1DT1H1M1.001001001S'));
    it('excessive values balance when "balance"', () =>
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 0, 1000, 'balance')}`, 'PT0.000001S'));
    it('throw when bad disambiguation', () =>
      throws(() => new Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, 'xyz'), TypeError));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
