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
    describe('Leap day', () => {
      it('reject', () => equal(`${new MonthDay(2, 29, 'reject')}`, '02-29'));
      it('constrain', () => equal(`${new MonthDay(2, 29, 'constrain')}`, '02-29'));
      it('balance', () => equal(`${new MonthDay(2, 29, 'balance')}`, '02-29'));
    });
    describe('.from()', () => {
      it('MonthDay.from(10-01) == 10-01', () => equal(`${MonthDay.from('10-01')}`, '10-01'));
      it('MonthDay.from(2019-10-01T09:00:00Z) == 10-01', () =>
        equal(`${MonthDay.from('2019-10-01T09:00:00Z')}`, '10-01'));
      it(`MonthDay.from('11-18') == (11-18)`, () => equal(`${MonthDay.from('11-18')}`, '11-18'));
      it(`MonthDay.from('1976-11-18') == (11-18)`, () => equal(`${MonthDay.from('1976-11-18')}`, '11-18'));
      it('MonthDay.from({ month: 11, day: 18 }) == 11-18', () => equal(`${MonthDay.from({ month: 11, day: 18 }) }`, '11-18'));
      it('MonthDay.from(11-18) == 11-18', () => {
        const orig = new MonthDay(11, 18);
        const actu = MonthDay.from(orig);
        equal(actu, orig);
      });
      it('MonthDay.from({}) throws', () => throws(() => MonthDay.from({}), RangeError));
    });
    describe('getters', () => {
      let md = new MonthDay(1, 15);
      it(`(1-15).month === '1'`, () => {
        equal(`${md.month}`, '1');
      });
      it(`(1-15).day === '15'`, () => {
        equal(`${md.day}`, '15');
      });
    });
    describe('plus()', () => {
      let jan15 = new MonthDay(1, 15);
      let feb1 = new MonthDay(2, 1);
      let april15 = new MonthDay(4, 15);
      it(`(1-15) plus 1 day === '01-16'`, () => {
        let duration = new Duration(0, 0, 1);
        equal(`${jan15.plus(duration)}`, '01-16');
      });
      it(`(1-15) plus 16 days === '01-31'`, () => {
        let duration = new Duration(0, 0, 16);
        equal(`${jan15.plus(duration)}`, '01-31');
      });
      it(`(1-15) plus 17 days === '02-01'`, () => {
        let duration = new Duration(0, 0, 17);
        equal(`${jan15.plus(duration)}`, '02-01');
      });
      it(`(2-1) plus 28 days === '03-01'`, () => {
        let duration = new Duration(0, 0, 28);
        equal(`${feb1.plus(duration)}`, '03-01');
      });
      it(`(4-15) plus 16 days === '05-01'`, () => {
        let duration = new Duration(0, 0, 16);
        equal(`${april15.plus(duration)}`, '05-01');
      });
      it(`(4-15) plus 365 days === '04-15'`, () => {
        let duration = new Duration(0, 0, 365);
        equal(`${april15.plus(duration)}`, '04-15');
      });
    });
  });
});

import { normalize } from 'path';
import { Duration } from '../lib/duration.mjs';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
