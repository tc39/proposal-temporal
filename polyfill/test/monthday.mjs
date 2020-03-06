import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import * as Temporal from 'tc39-temporal';
const { MonthDay } = Temporal;

describe('MonthDay', () => {
  describe('Structure', () => {
    it('MonthDay is a Function', () => {
      equal(typeof MonthDay, 'function');
    });
    it('MonthDay has a prototype', () => {
      assert(MonthDay.prototype);
      equal(typeof MonthDay.prototype, 'object');
    });
    it('MonthDay.compare is a Function', () => {
      equal(typeof MonthDay.compare, 'function');
    });
  });
  describe('Construction', () => {
    it('Leap day', () => equal(`${new MonthDay(2, 29)}`, '02-29'));
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
      it('MonthDay.from({ day: 15 }) throws', () => throws(() => MonthDay.from({ day: 15 }), TypeError));
      it('MonthDay.from({ month: 12 }) throws', () => throws(() => MonthDay.from({ month: 12 }), TypeError));
      it('MonthDay.from({}) throws', () => throws(() => MonthDay.from({}), TypeError));
      it('MonthDay.from(required prop undefined) throws', () =>
        throws(() => MonthDay.from({ month: undefined, day: 15 }), TypeError));
      it.skip('MonthDay.from(number) is converted to string', () =>
        equal(`${MonthDay.from(1201)}`, `${MonthDay.from('12-01')}`));
      describe('Disambiguation', () => {
        const bad = { month: 1, day: 32 };
        it('reject', () => throws(() => MonthDay.from(bad, { disambiguation: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${MonthDay.from(bad)}`, '01-31');
          equal(`${MonthDay.from(bad, { disambiguation: 'constrain' })}`, '01-31');
        });
        it('balance', () => equal(`${MonthDay.from(bad, { disambiguation: 'balance' })}`, '02-01'));
        it('throw when bad disambiguation', () => {
          [new MonthDay(11, 18), { month: 1, day: 1 }, '01-31'].forEach((input) => {
            ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
              throws(() => MonthDay.from(input, { disambiguation }), RangeError));
          });
        });
      });
      describe('Leap day', () => {
        ['reject', 'constrain', 'balance'].forEach((disambiguation) =>
          it(disambiguation, () =>
            equal(`${MonthDay.from({ month: 2, day: 29 }, { disambiguation })}`, '02-29')));
      });
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
  });
  describe('MonthDay.compare() works', () => {
    const jan15 = MonthDay.from('01-15');
    const feb1 = MonthDay.from('02-01');
    it('equal', () => equal(MonthDay.compare(jan15, jan15), 0));
    it('smaller/larger', () => equal(MonthDay.compare(jan15, feb1), -1));
    it('larger/smaller', () => equal(MonthDay.compare(feb1, jan15), 1));
    it("doesn't cast first argument", () => {
      throws(() => MonthDay.compare({ month: 1, day: 15 }, feb1), TypeError);
      throws(() => MonthDay.compare('01-15', feb1), TypeError);
    });
    it("doesn't cast second argument", () => {
      throws(() => MonthDay.compare(jan15, { month: 2, day: 1 }), TypeError);
      throws(() => MonthDay.compare(jan15, '02-01'), TypeError);
    });
  });
  describe('MonthDay.with()', () => {
    it('throws on bad disambiguation', () => {
      ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => MonthDay.from('01-15').with({ day: 1 }, { disambiguation }), RangeError));
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
