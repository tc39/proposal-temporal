import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

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
      it("MonthDay.from('11-18') == (11-18)", () => equal(`${MonthDay.from('11-18')}`, '11-18'));
      it("MonthDay.from('1976-11-18') == (11-18)", () => equal(`${MonthDay.from('1976-11-18')}`, '11-18'));
      it('MonthDay.from({ month: 11, day: 18 }) == 11-18', () =>
        equal(`${MonthDay.from({ month: 11, day: 18 })}`, '11-18'));
      it('MonthDay.from(11-18) is not the same object', () => {
        const orig = new MonthDay(11, 18);
        const actu = MonthDay.from(orig);
        notEqual(actu, orig);
      });
      it('MonthDay.from({ day: 15 }) throws', () => throws(() => MonthDay.from({ day: 15 }), TypeError));
      it('MonthDay.from({ month: 12 }) throws', () => throws(() => MonthDay.from({ month: 12 }), TypeError));
      it('MonthDay.from({}) throws', () => throws(() => MonthDay.from({}), TypeError));
      it('MonthDay.from(required prop undefined) throws', () =>
        throws(() => MonthDay.from({ month: undefined, day: 15 }), TypeError));
      it('MonthDay.from(number) is converted to string', () =>
        equal(`${MonthDay.from(1201)}`, `${MonthDay.from('12-01')}`));
      it('basic format', () => {
        equal(`${MonthDay.from('1118')}`, '11-18');
      });
      it('mixture of basic and extended format', () => {
        equal(`${MonthDay.from('1976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('19761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('19761118T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('19761118T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('19761118T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T152330.1+0000')}`, '11-18');
      });
      it('24:00 to mean next day midnight', () => {
        equal(`${MonthDay.from('1976-11-18T24:00:00Z')}`, '11-19');
        equal(`${MonthDay.from('1976-11-30T24:00:00Z')}`, '12-01');
        equal(`${MonthDay.from('1976-12-31T24:00:00Z')}`, '01-01');
        equal(`${MonthDay.from('1976-02-28T24:00:00Z')}`, '02-29');
        equal(`${MonthDay.from('1976-02-29T24:00:00Z')}`, '03-01');
        equal(`${MonthDay.from('1977-02-28T24:00:00Z')}`, '03-01');
      });
      it('0 is the only number valid with 24 hours', () => {
        [
          '1976-11-18T24:01Z',
          '1976-11-18T24:00:01Z',
          '1976-11-18T24:00:00.001Z',
          '1976-11-18T24:00:00.000001Z',
          '1976-11-18T24:00:00.000000001Z'
        ].forEach((str) => throws(() => MonthDay.from(str), RangeError));
      });
      it('optional parts', () => {
        equal(`${MonthDay.from('1976-11-18T15:23')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T15')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18')}`, '11-18');
      });
      it('RFC 3339 month-day syntax', () => {
        equal(`${MonthDay.from('--11-18')}`, '11-18');
        equal(`${MonthDay.from('--1118')}`, '11-18');
      });
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
              throws(() => MonthDay.from(input, { disambiguation }), RangeError)
            );
          });
        });
      });
      describe('Leap day', () => {
        ['reject', 'constrain', 'balance'].forEach((disambiguation) =>
          it(disambiguation, () => equal(`${MonthDay.from({ month: 2, day: 29 }, { disambiguation })}`, '02-29'))
        );
      });
    });
    describe('getters', () => {
      let md = new MonthDay(1, 15);
      it("(1-15).month === '1'", () => {
        equal(`${md.month}`, '1');
      });
      it("(1-15).day === '15'", () => {
        equal(`${md.day}`, '15');
      });
    });
    describe('.with()', () => {
      const md = MonthDay.from('01-22');
      it('with(12-)', () => equal(`${md.with({ month: 12 })}`, '12-22'));
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'));
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
        throws(() => MonthDay.from('01-15').with({ day: 1 }, { disambiguation }), RangeError)
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
