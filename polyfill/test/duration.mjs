import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import { Duration } from 'tc39-temporal';

describe('Duration', () => {
  describe('Structure', () => {
    it('Duration is a Function', () => {
      equal(typeof Duration, 'function');
    });
    it('Duration has a prototype', () => {
      assert(Duration.prototype);
      equal(typeof Duration.prototype, 'object');
    });
    describe('Duration.prototype', () => {
      it('Duration.prototype.with is a Function', () => {
        equal(typeof Duration.prototype.with, 'function');
      });
      it('Duration.prototype.plus is a Function', () => {
        equal(typeof Duration.prototype.plus, 'function');
      });
      it('Duration.prototype.minus is a Function', () => {
        equal(typeof Duration.prototype.minus, 'function');
      });
      it('Duration.prototype.getFields is a Function', () => {
        equal(typeof Duration.prototype.getFields, 'function');
      });
    });
  });
  describe('Construction', () => {
    it('negative values throw', () => throws(() => new Duration(-1, -1, -1, -1, -1, -1, -1, -1, -1), RangeError));
  });
  describe('from()', () => {
    it('Duration.from(P5Y) is not the same object', () => {
      const orig = new Duration(5);
      const from = Duration.from(orig);
      notEqual(from, orig);
    });
    it('Duration.from({ milliseconds: 5 }) == PT0.005S', () =>
      equal(`${Duration.from({ milliseconds: 5 })}`, 'PT0.005S'));
    it('Duration.from("P1D") == P1D', () => equal(`${Duration.from('P1D')}`, 'P1D'));
    it('Duration.from({})', () => equal(`${Duration.from({})}`, `${new Duration()}`));
    it('lowercase variant', () => equal(`${Duration.from('p1y1m1dt1h1m1s')}`, 'P1Y1M1DT1H1M1S'));
    it('any number of decimal places works', () => {
      equal(`${Duration.from('P1Y1M1DT1H1M1.1S')}`, 'P1Y1M1DT1H1M1.100S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.12S')}`, 'P1Y1M1DT1H1M1.120S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.123S')}`, 'P1Y1M1DT1H1M1.123S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.1234S')}`, 'P1Y1M1DT1H1M1.123400S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.12345S')}`, 'P1Y1M1DT1H1M1.123450S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.123456S')}`, 'P1Y1M1DT1H1M1.123456S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.1234567S')}`, 'P1Y1M1DT1H1M1.123456700S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.12345678S')}`, 'P1Y1M1DT1H1M1.123456780S');
      equal(`${Duration.from('P1Y1M1DT1H1M1.123456789S')}`, 'P1Y1M1DT1H1M1.123456789S');
    });
    it('variant decimal separator', () => {
      equal(`${Duration.from('P1Y1M1DT1H1M1,12S')}`, 'P1Y1M1DT1H1M1.120S');
    });
    describe('Disambiguation', () => {
      it('negative values always throw', () => {
        const negative = {
          years: -1,
          months: -1,
          days: -1,
          hours: -1,
          minutes: -1,
          seconds: -1,
          milliseconds: -1,
          microseconds: -1,
          nanoseconds: -1
        };
        ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
          throws(() => Duration.from(negative, { disambiguation }), RangeError)
        );
      });
      it('negative values cannot balance', () => {
        ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
          throws(() => Duration.from({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
        );
      });
      it('excessive values unchanged when "reject"', () => {
        equal(`${Duration.from({ minutes: 100 }, { disambiguation: 'reject' })}`, 'PT100M');
      });
      it('excessive values unchanged when "constrain"', () => {
        equal(`${Duration.from({ minutes: 100 }, { disambiguation: 'constrain' })}`, 'PT100M');
      });
      it('excessive time units balance when "balance"', () => {
        equal(`${Duration.from({ nanoseconds: 1000 }, { disambiguation: 'balance' })}`, 'PT0.000001S');
        equal(`${Duration.from({ microseconds: 1000 }, { disambiguation: 'balance' })}`, 'PT0.001S');
        equal(`${Duration.from({ milliseconds: 1000 }, { disambiguation: 'balance' })}`, 'PT1S');
        equal(`${Duration.from({ seconds: 100 }, { disambiguation: 'balance' })}`, 'PT1M40S');
        equal(`${Duration.from({ minutes: 100 }, { disambiguation: 'balance' })}`, 'PT1H40M');
        equal(`${Duration.from({ hours: 100 }, { disambiguation: 'balance' })}`, 'P4DT4H');
      });
      it('excessive date units do not balance when "balance"', () => {
        equal(`${Duration.from({ months: 12 }, { disambiguation: 'balance' })}`, 'P12M');
        equal(`${Duration.from({ months: 12, seconds: 3600 }, { disambiguation: 'balance' })}`, 'P12MT1H');
        equal(`${Duration.from({ days: 31 }, { disambiguation: 'balance' })}`, 'P31D');
        equal(`${Duration.from({ days: 31, seconds: 3600 }, { disambiguation: 'balance' })}`, 'P31DT1H');
      });
      it('throw when bad disambiguation', () => {
        [new Duration(3), { days: 0 }, 'P5Y'].forEach((input) => {
          ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
            throws(() => Duration.from(input, { disambiguation }), RangeError)
          );
        });
      });
    });
  });
  describe('toString()', () => {
    it('excessive sub-second units balance themselves when serializing', () => {
      equal(`${Duration.from({ milliseconds: 3500 })}`, 'PT3.500S');
      equal(`${Duration.from({ microseconds: 3500 })}`, 'PT0.003500S');
      equal(`${Duration.from({ nanoseconds: 3500 })}`, 'PT0.000003500S');
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 1111, 1111, 1111)}`, 'PT1.112112111S');
      equal(`${Duration.from({ seconds: 120, milliseconds: 3500 })}`, 'PT123.500S');
    });
  });
  describe('toLocaleString()', () => {
    it('produces an implementation-defined string', () => {
      const duration = Duration.from({ hours: 12, minutes: 30 });
      equal(typeof duration.toLocaleString(), 'string');
    });
  });
  describe('min/max values', () => {
    const units = [
      'years',
      'months',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ];
    it('minimum is zero', () => {
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 0, 0)}`, 'PT0S');
      units.forEach((unit) => equal(`${Duration.from({ [unit]: 0 })}`, 'PT0S'));
      ['P0Y', 'P0M', 'P0D', 'PT0H', 'PT0M', 'PT0S'].forEach((str) => equal(`${Duration.from(str)}`, 'PT0S'));
    });
    it('unrepresentable number is not allowed', () => {
      units.forEach((unit, ix) => {
        throws(() => new Duration(...Array(ix).fill(0), 1e309), RangeError);
        throws(() => Duration.from({ [unit]: 1e309 }, { disambiguation: 'reject' }), RangeError);
      });
      const manyNines = '9'.repeat(309);
      [
        `P${manyNines}Y`,
        `P${manyNines}M`,
        `P${manyNines}D`,
        `PT${manyNines}H`,
        `PT${manyNines}M`,
        `PT${manyNines}S`
      ].forEach((str) => throws(() => Duration.from(str, { disambiguation: 'reject' }), RangeError));
    });
    it('max safe integer is allowed', () => {
      [
        'P9007199254740991Y',
        'P9007199254740991M',
        'P9007199254740991D',
        'PT9007199254740991H',
        'PT9007199254740991M',
        'PT9007199254740991S',
        'PT9007199254740.991S',
        'PT9007199254.740991S',
        'PT9007199.254740991S'
      ].forEach((str, ix) => {
        equal(`${new Duration(...Array(ix).fill(0), Number.MAX_SAFE_INTEGER)}`, str);
        equal(`${Duration.from({ [units[ix]]: Number.MAX_SAFE_INTEGER }, { disambiguation: 'reject' })}`, str);
        equal(`${Duration.from(str)}`, str);
      });
    });
    it('larger integers are allowed but may lose precision', () => {
      function test(ix, prefix, suffix, infix = '') {
        function doAsserts(duration) {
          const str = duration.toString();
          equal(str.slice(0, prefix.length + 10), `${prefix}1000000000`);
          assert(str.includes(infix));
          equal(str.slice(-1), suffix);
          equal(str.length, prefix.length + suffix.length + infix.length + 27);
        }
        doAsserts(new Duration(...Array(ix).fill(0), 1e26, ...Array(8 - ix).fill(0), 'reject'));
        doAsserts(Duration.from({ [units[ix]]: 1e26 }));
        if (!infix) doAsserts(Duration.from(`${prefix}100000000000000000000000000${suffix}`));
      }
      test(0, 'P', 'Y');
      test(1, 'P', 'M');
      test(2, 'P', 'D');
      test(3, 'PT', 'H');
      test(4, 'PT', 'M');
      test(5, 'PT', 'S');
      test(6, 'PT', 'S', '.');
      test(7, 'PT', 'S', '.');
      test(8, 'PT', 'S', '.');
    });
  });
  describe('Duration.with()', () => {
    const duration = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5);
    it('duration.with({ years: 1 } works', () => {
      equal(`${duration.with({ years: 1 })}`, 'P1Y5M5DT5H5M5.005005005S');
    });
    it('duration.with({ months: 1 } works', () => {
      equal(`${duration.with({ months: 1 })}`, 'P5Y1M5DT5H5M5.005005005S');
    });
    it('duration.with({ days: 1 } works', () => {
      equal(`${duration.with({ days: 1 })}`, 'P5Y5M1DT5H5M5.005005005S');
    });
    it('duration.with({ hours: 1 } works', () => {
      equal(`${duration.with({ hours: 1 })}`, 'P5Y5M5DT1H5M5.005005005S');
    });
    it('duration.with({ minutes: 1 } works', () => {
      equal(`${duration.with({ minutes: 1 })}`, 'P5Y5M5DT5H1M5.005005005S');
    });
    it('duration.with({ seconds: 1 } works', () => {
      equal(`${duration.with({ seconds: 1 })}`, 'P5Y5M5DT5H5M1.005005005S');
    });
    it('duration.with({ milliseconds: 1 } works', () => {
      equal(`${duration.with({ milliseconds: 1 })}`, 'P5Y5M5DT5H5M5.001005005S');
    });
    it('duration.with({ microseconds: 1 } works', () => {
      equal(`${duration.with({ microseconds: 1 })}`, 'P5Y5M5DT5H5M5.005001005S');
    });
    it('duration.with({ nanoseconds: 1 } works', () => {
      equal(`${duration.with({ nanoseconds: 1 })}`, 'P5Y5M5DT5H5M5.005005001S');
    });
    it('duration.with({ months: 1, seconds: 15 } works', () => {
      equal(`${duration.with({ months: 1, seconds: 15 })}`, 'P5Y1M5DT5H5M15.005005005S');
    });
    it('balance balances all values up to days', () => {
      const result = duration.with(
        {
          hours: 100,
          minutes: 100,
          seconds: 100,
          milliseconds: 3000,
          microseconds: 3000,
          nanoseconds: 3001
        },
        { disambiguation: 'balance' }
      );
      equal(result.years, 5);
      equal(result.months, 5);
      equal(result.days, 9);
      equal(result.hours, 5);
      equal(result.minutes, 41);
      equal(result.seconds, 43);
      equal(result.milliseconds, 3);
      equal(result.microseconds, 3);
      equal(result.nanoseconds, 1);
    });
    it('negative values always throw', () => {
      ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
        throws(() => duration.with({ minutes: -1 }, { disambiguation }), RangeError)
      );
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => duration.with({ day: 5 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('Duration.plus()', () => {
    const duration = Duration.from({ days: 1, minutes: 5 });
    it('adds same units', () => {
      equal(`${duration.plus({ days: 2, minutes: 5 })}`, 'P3DT10M');
    });
    it('adds different units', () => {
      equal(`${duration.plus({ hours: 12, seconds: 30 })}`, 'P1DT12H5M30S');
    });
    it('does not balance units', () => {
      const d = Duration.from('P50M50DT50H50M50.500500500S');
      const result = d.plus(d);
      equal(result.months, 100);
      equal(result.days, 100);
      equal(result.hours, 100);
      equal(result.minutes, 100);
      equal(result.seconds, 100);
      equal(result.milliseconds, 1000);
      equal(result.microseconds, 1000);
      equal(result.nanoseconds, 1000);
    });
    const max = new Duration(...Array(9).fill(Number.MAX_VALUE));
    it('caps values at Number.MAX_VALUE by default', () => {
      const result = max.plus(max);
      equal(result.years, Number.MAX_VALUE);
      equal(result.months, Number.MAX_VALUE);
      equal(result.days, Number.MAX_VALUE);
      equal(result.hours, Number.MAX_VALUE);
      equal(result.minutes, Number.MAX_VALUE);
      equal(result.seconds, Number.MAX_VALUE);
      equal(result.milliseconds, Number.MAX_VALUE);
      equal(result.microseconds, Number.MAX_VALUE);
      equal(result.nanoseconds, Number.MAX_VALUE);
    });
    it('caps values at Number.MAX_VALUE with constrain', () => {
      const result = max.plus(max, { disambiguation: 'constrain' });
      equal(result.years, Number.MAX_VALUE);
      equal(result.months, Number.MAX_VALUE);
      equal(result.days, Number.MAX_VALUE);
      equal(result.hours, Number.MAX_VALUE);
      equal(result.minutes, Number.MAX_VALUE);
      equal(result.seconds, Number.MAX_VALUE);
      equal(result.milliseconds, Number.MAX_VALUE);
      equal(result.microseconds, Number.MAX_VALUE);
      equal(result.nanoseconds, Number.MAX_VALUE);
    });
    it('throws if values become infinite with reject', () => {
      throws(() => max.plus(max, { disambiguation: 'reject' }), RangeError);
    });
    it('throws on invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => duration.plus(duration, { disambiguation }), RangeError)
      );
    });
  });
  describe('Duration.minus()', () => {
    const duration = Duration.from({ days: 3, hours: 1, minutes: 10 });
    it('subtracts same units with positive result', () => {
      equal(`${duration.minus({ days: 1, minutes: 5 })}`, 'P2DT1H5M');
    });
    it('subtracts same units with zero result', () => {
      equal(`${duration.minus(duration)}`, 'PT0S');
      equal(`${duration.minus({ days: 3 })}`, 'PT1H10M');
      equal(`${duration.minus({ minutes: 10 })}`, 'P3DT1H');
    });
    it('balances when subtracting same units with negative result', () => {
      equal(`${duration.minus({ minutes: 15 })}`, 'P3DT55M');
    });
    it('balances when subtracting different units', () => {
      equal(`${duration.minus({ seconds: 30 })}`, 'P3DT1H9M30S');
    });
    it('never balances positive units in balanceConstrain mode', () => {
      const d = Duration.from({
        minutes: 100,
        seconds: 100,
        milliseconds: 2000,
        microseconds: 2000,
        nanoseconds: 2000
      });
      const less = Duration.from({
        minutes: 10,
        seconds: 10,
        milliseconds: 500,
        microseconds: 500,
        nanoseconds: 500
      });
      let result = d.minus(less);
      equal(result.minutes, 90);
      equal(result.seconds, 90);
      equal(result.milliseconds, 1500);
      equal(result.microseconds, 1500);
      equal(result.nanoseconds, 1500);

      result = d.minus(less, { disambiguation: 'balanceConstrain' });
      equal(result.minutes, 90);
      equal(result.seconds, 90);
      equal(result.milliseconds, 1500);
      equal(result.microseconds, 1500);
      equal(result.nanoseconds, 1500);
    });
    it('balances positive units in balance mode', () => {
      const d = Duration.from({
        minutes: 100,
        seconds: 100,
        milliseconds: 2000,
        microseconds: 2000,
        nanoseconds: 2000
      });
      const less = Duration.from({
        minutes: 10,
        seconds: 10,
        milliseconds: 500,
        microseconds: 500,
        nanoseconds: 500
      });
      const result = d.minus(less, { disambiguation: 'balance' });
      equal(result.hours, 1);
      equal(result.minutes, 31);
      equal(result.seconds, 31);
      equal(result.milliseconds, 501);
      equal(result.microseconds, 501);
      equal(result.nanoseconds, 500);
    });
    it('does not balance with units higher than days', () => {
      const d = Duration.from('P1M15D');
      throws(() => d.minus({ days: 20 }), RangeError);
    });
    const tenYears = Duration.from('P10Y');
    const tenMinutes = Duration.from('PT10M');
    it('throws if result is negative', () => {
      ['balanceConstrain', 'balance'].forEach((disambiguation) => {
        throws(() => tenYears.minus({ years: 15 }, { disambiguation }), RangeError);
        throws(() => tenMinutes.minus({ minutes: 15 }, { disambiguation }), RangeError);
      });
    });
    it('throws if result cannot be determined to be positive or negative', () => {
      ['balanceConstrain', 'balance'].forEach((disambiguation) => {
        throws(() => tenYears.minus({ months: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ days: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ hours: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ minutes: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ seconds: 5 }, { disambiguation }), RangeError);
      });
    });
    it('throws on invalid disambiguation', () => {
      ['', 'BALANCE', 'constrain', 3, null].forEach((disambiguation) =>
        throws(() => duration.minus(duration, { disambiguation }), RangeError)
      );
    });
  });
  describe('duration.getFields() works', () => {
    const d1 = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5);
    const fields = d1.getFields();
    it('fields', () => {
      equal(fields.years, 5);
      equal(fields.months, 5);
      equal(fields.days, 5);
      equal(fields.hours, 5);
      equal(fields.minutes, 5);
      equal(fields.seconds, 5);
      equal(fields.milliseconds, 5);
      equal(fields.microseconds, 5);
      equal(fields.nanoseconds, 5);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.years, 5);
      equal(fields2.months, 5);
      equal(fields2.days, 5);
      equal(fields2.hours, 5);
      equal(fields2.minutes, 5);
      equal(fields2.seconds, 5);
      equal(fields2.milliseconds, 5);
      equal(fields2.microseconds, 5);
      equal(fields2.nanoseconds, 5);
    });
    it('as input to from()', () => {
      const d2 = Duration.from(fields);
      equal(d2.years, 5);
      equal(d2.months, 5);
      equal(d2.days, 5);
      equal(d2.hours, 5);
      equal(d2.minutes, 5);
      equal(d2.seconds, 5);
      equal(d2.milliseconds, 5);
      equal(d2.microseconds, 5);
      equal(d2.nanoseconds, 5);
    });
    it('as input to with()', () => {
      const d2 = Duration.from('P300YT20S').with(fields);
      equal(d2.years, 5);
      equal(d2.months, 5);
      equal(d2.days, 5);
      equal(d2.hours, 5);
      equal(d2.minutes, 5);
      equal(d2.seconds, 5);
      equal(d2.milliseconds, 5);
      equal(d2.microseconds, 5);
      equal(d2.nanoseconds, 5);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
