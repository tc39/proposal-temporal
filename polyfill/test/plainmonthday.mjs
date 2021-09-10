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
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
