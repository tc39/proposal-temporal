import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainMonthDay } = Temporal;

describe('MonthDay', () => {
  describe('Construction', () => {
    describe('.from()', () => {
      it('ignores era/eraYear when determining the ISO reference year from month/day', () => {
        // 402
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, month: 11, day: 18, calendar: 'gregory' });
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, month: 11, day: 18, calendar: 'gregory' });
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      });
      it('ignores era/eraYear when determining the ISO reference year from monthCode/day', () => {
        // 402
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, monthCode: 'M11', day: 18, calendar: 'gregory' });
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, monthCode: 'M11', day: 18, calendar: 'gregory' });
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear);
      });
      it('MonthDay.from({month, day}) not allowed in other calendar', () =>
        // 402
        throws(() => PlainMonthDay.from({ month: 11, day: 18, calendar: 'gregory' }), TypeError));
      it('MonthDay.from({year, month, day}) allowed in other calendar', () => {
        // 402
        equal(
          `${PlainMonthDay.from({ year: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]'
        );
      });
      it('MonthDay.from({era, eraYear, month, day}) allowed in other calendar', () => {
        // 402
        equal(
          `${PlainMonthDay.from({ era: 'ce', eraYear: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]'
        );
      });
    });
    describe('.with()', () => {
      const md = PlainMonthDay.from('01-22');
      it('with(12-)', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-22'));
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'));
    });
  });
  describe('MonthDay.with()', () => {
    const md = PlainMonthDay.from('01-15');
    it('with({monthCode})', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-15'));
    it('with({month}) not accepted', () => {
      throws(() => md.with({ month: 12 }), TypeError);
    });
    it('with({month, monthCode}) accepted', () => equal(`${md.with({ month: 12, monthCode: 'M12' })}`, '12-15'));
    it('month and monthCode must agree', () => {
      throws(() => md.with({ month: 12, monthCode: 'M11' }), RangeError);
    });
    it('with({year, month}) accepted', () => equal(`${md.with({ year: 2000, month: 12 })}`, '12-15'));
    it('throws on bad overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        throws(() => md.with({ day: 1 }, { overflow }), RangeError)
      );
    });
    it('throws with calendar property', () => {
      throws(() => md.with({ day: 1, calendar: 'iso8601' }), TypeError);
    });
    it('throws with timeZone property', () => {
      throws(() => md.with({ day: 1, timeZone: 'UTC' }), TypeError);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => md.with({}), TypeError);
      throws(() => md.with({ months: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${md.with({ monthCode: 'M12', days: 1 })}`, '12-15');
    });
    it('year is ignored when determining ISO reference year', () => {
      equal(md.with({ year: 1900 }).getISOFields().isoYear, md.getISOFields().isoYear);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
