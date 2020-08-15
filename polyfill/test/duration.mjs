import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import { Duration } from 'proposal-temporal';

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
      it('Duration.prototype has sign', () => {
        assert('sign' in Duration.prototype);
      });
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
      it('Duration.prototype.negated is a Function', () => {
        equal(typeof Duration.prototype.negated, 'function');
      });
      it('Duration.prototype.abs is a Function', () => {
        equal(typeof Duration.prototype.abs, 'function');
      });
    });
  });
  describe('Construction', () => {
    it('positive duration, sets fields', () => {
      const d = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 0);
      equal(d.sign, 1);
      equal(d.years, 5);
      equal(d.months, 5);
      equal(d.weeks, 5);
      equal(d.days, 5);
      equal(d.hours, 5);
      equal(d.minutes, 5);
      equal(d.seconds, 5);
      equal(d.milliseconds, 5);
      equal(d.microseconds, 5);
      equal(d.nanoseconds, 0);
    });
    it('negative duration, sets fields', () => {
      const d = new Duration(-5, -5, -5, -5, -5, -5, -5, -5, -5, 0);
      equal(d.sign, -1);
      equal(d.years, -5);
      equal(d.months, -5);
      equal(d.weeks, -5);
      equal(d.days, -5);
      equal(d.hours, -5);
      equal(d.minutes, -5);
      equal(d.seconds, -5);
      equal(d.milliseconds, -5);
      equal(d.microseconds, -5);
      equal(d.nanoseconds, 0);
    });
    it('zero-length, sets fields', () => {
      const d = new Duration();
      equal(d.sign, 0);
      equal(d.years, 0);
      equal(d.months, 0);
      equal(d.weeks, 0);
      equal(d.days, 0);
      equal(d.hours, 0);
      equal(d.minutes, 0);
      equal(d.seconds, 0);
      equal(d.milliseconds, 0);
      equal(d.microseconds, 0);
      equal(d.nanoseconds, 0);
    });
    it('mixed positive and negative values throw', () => {
      throws(() => new Duration(-1, 1, 1, 1, 1, 1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, -1, 1, 1, 1, 1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, -1, 1, 1, 1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, -1, 1, 1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, -1, 1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, 1, -1, 1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, 1, 1, -1, 1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, 1, 1, 1, -1, 1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, 1, 1, 1, 1, -1, 1), RangeError);
      throws(() => new Duration(1, 1, 1, 1, 1, 1, 1, 1, 1, -1), RangeError);
    });
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
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1S')}`, 'P1Y1M1W1DT1H1M1.100S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12S')}`, 'P1Y1M1W1DT1H1M1.120S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123S')}`, 'P1Y1M1W1DT1H1M1.123S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1234S')}`, 'P1Y1M1W1DT1H1M1.123400S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12345S')}`, 'P1Y1M1W1DT1H1M1.123450S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123456S')}`, 'P1Y1M1W1DT1H1M1.123456S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1234567S')}`, 'P1Y1M1W1DT1H1M1.123456700S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12345678S')}`, 'P1Y1M1W1DT1H1M1.123456780S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123456789S')}`, 'P1Y1M1W1DT1H1M1.123456789S');
    });
    it('variant decimal separator', () => {
      equal(`${Duration.from('P1Y1M1W1DT1H1M1,12S')}`, 'P1Y1M1W1DT1H1M1.120S');
    });
    it('decimal places only allowed in seconds', () => {
      [
        'P0.5Y',
        'P1Y0,5M',
        'P1Y1M0.5W',
        'P1Y1M1W0,5D',
        'P1Y1M1W1DT0.5H',
        'P1Y1M1W1DT1H0,5M',
        'P1Y1M1W1DT1H0.5M0.5S'
      ].forEach((str) => throws(() => Duration.from(str), RangeError));
    });
    it('"P" by itself is not a valid string', () => {
      ['P', 'PT', '-P', '-PT', '+P', '+PT'].forEach((s) => throws(() => Duration.from(s), RangeError));
    });
    it('no junk at end of string', () => throws(() => Duration.from('P1Y1M1W1DT1H1M1.01Sjunk'), RangeError));
    it('with a + sign', () => {
      const d = Duration.from('+P1D');
      equal(d.days, 1);
    });
    it('with a - sign', () => {
      const d = Duration.from('-P1D');
      equal(d.days, -1);
    });
    it('variant minus sign', () => {
      const d = Duration.from('\u2212P1D');
      equal(d.days, -1);
    });
    it('all units have the same sign', () => {
      const d = Duration.from('-P1Y1M1W1DT1H1M1.123456789S');
      equal(d.years, -1);
      equal(d.months, -1);
      equal(d.weeks, -1);
      equal(d.days, -1);
      equal(d.hours, -1);
      equal(d.minutes, -1);
      equal(d.seconds, -1);
      equal(d.milliseconds, -123);
      equal(d.microseconds, -456);
      equal(d.nanoseconds, -789);
    });
    it('does not accept minus signs in individual units', () => {
      throws(() => Duration.from('P-1Y1M'), RangeError);
      throws(() => Duration.from('P1Y-1M'), RangeError);
    });
    describe('Disambiguation', () => {
      it('mixed positive and negative values always throw', () => {
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
        equal(`${Duration.from({ weeks: 6 }, { disambiguation: 'balance' })}`, 'P6W');
        equal(`${Duration.from({ weeks: 6, seconds: 3600 }, { disambiguation: 'balance' })}`, 'P6WT1H');
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
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 1111, 1111, 1111)}`, 'PT1.112112111S');
      equal(`${Duration.from({ seconds: 120, milliseconds: 3500 })}`, 'PT123.500S');
    });
    it('emits a negative sign for a negative duration', () => {
      equal(`${Duration.from({ weeks: -1, days: -1 })}`, '-P1W1D');
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
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
      'microseconds',
      'nanoseconds'
    ];
    it('minimum is zero', () => {
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)}`, 'PT0S');
      units.forEach((unit) => equal(`${Duration.from({ [unit]: 0 })}`, 'PT0S'));
      ['P0Y', 'P0M', 'P0W', 'P0D', 'PT0H', 'PT0M', 'PT0S'].forEach((str) => equal(`${Duration.from(str)}`, 'PT0S'));
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
        `P${manyNines}W`,
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
        'P9007199254740991W',
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
        doAsserts(new Duration(...Array(ix).fill(0), 1e26, ...Array(9 - ix).fill(0), 'reject'));
        doAsserts(Duration.from({ [units[ix]]: 1e26 }));
        if (!infix) doAsserts(Duration.from(`${prefix}100000000000000000000000000${suffix}`));
      }
      test(0, 'P', 'Y');
      test(1, 'P', 'M');
      test(2, 'P', 'W');
      test(3, 'P', 'D');
      test(4, 'PT', 'H');
      test(5, 'PT', 'M');
      test(6, 'PT', 'S');
      test(7, 'PT', 'S', '.');
      test(8, 'PT', 'S', '.');
      test(9, 'PT', 'S', '.');
    });
  });
  describe('Duration.with()', () => {
    const duration = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    it('duration.with({ years: 1 } works', () => {
      equal(`${duration.with({ years: 1 })}`, 'P1Y5M5W5DT5H5M5.005005005S');
    });
    it('duration.with({ months: 1 } works', () => {
      equal(`${duration.with({ months: 1 })}`, 'P5Y1M5W5DT5H5M5.005005005S');
    });
    it('duration.with({ weeks: 1 } works', () => {
      equal(`${duration.with({ weeks: 1 })}`, 'P5Y5M1W5DT5H5M5.005005005S');
    });
    it('duration.with({ days: 1 } works', () => {
      equal(`${duration.with({ days: 1 })}`, 'P5Y5M5W1DT5H5M5.005005005S');
    });
    it('duration.with({ hours: 1 } works', () => {
      equal(`${duration.with({ hours: 1 })}`, 'P5Y5M5W5DT1H5M5.005005005S');
    });
    it('duration.with({ minutes: 1 } works', () => {
      equal(`${duration.with({ minutes: 1 })}`, 'P5Y5M5W5DT5H1M5.005005005S');
    });
    it('duration.with({ seconds: 1 } works', () => {
      equal(`${duration.with({ seconds: 1 })}`, 'P5Y5M5W5DT5H5M1.005005005S');
    });
    it('duration.with({ milliseconds: 1 } works', () => {
      equal(`${duration.with({ milliseconds: 1 })}`, 'P5Y5M5W5DT5H5M5.001005005S');
    });
    it('duration.with({ microseconds: 1 } works', () => {
      equal(`${duration.with({ microseconds: 1 })}`, 'P5Y5M5W5DT5H5M5.005001005S');
    });
    it('duration.with({ nanoseconds: 1 } works', () => {
      equal(`${duration.with({ nanoseconds: 1 })}`, 'P5Y5M5W5DT5H5M5.005005001S');
    });
    it('duration.with({ months: 1, seconds: 15 } works', () => {
      equal(`${duration.with({ months: 1, seconds: 15 })}`, 'P5Y1M5W5DT5H5M15.005005005S');
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
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
        throws(() => duration.with({ hours: 1, minutes: -1 }, { disambiguation }), RangeError)
      );
    });
    it('can reverse the sign if all the fields are replaced', () => {
      const d = Duration.from({ years: 5, days: 1 });
      const d2 = d.with({ years: -1, days: -1, minutes: 0 });
      equal(`${d2}`, '-P1Y1D');
      notEqual(d.sign, d2.sign);
    });
    it('throws if new fields have a different sign from the old fields', () => {
      const d = Duration.from({ years: 5, days: 1 });
      throws(() => d.with({ months: -5, minutes: 0 }), RangeError);
    });
    it('invalid disambiguation', () => {
      ['', 'CONSTRAIN', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => duration.with({ days: 5 }, { disambiguation }), RangeError)
      );
    });
    it('sign cannot be manipulated independently', () => {
      throws(() => duration.with({ sign: -1 }), RangeError);
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
    it('symmetric with regard to negative durations', () => {
      equal(`${Duration.from('P3DT10M').plus({ days: -2, minutes: -5 })}`, 'P1DT5M');
      equal(
        `${Duration.from('P1DT12H5M30S').plus({ hours: -12, seconds: -30 }, { disambiguation: 'balance' })}`,
        'P1DT5M'
      );
    });
    it('does not balance units', () => {
      const d = Duration.from('P50M50W50DT50H50M50.500500500S');
      const result = d.plus(d);
      equal(result.months, 100);
      equal(result.weeks, 100);
      equal(result.days, 100);
      equal(result.hours, 100);
      equal(result.minutes, 100);
      equal(result.seconds, 100);
      equal(result.milliseconds, 1000);
      equal(result.microseconds, 1000);
      equal(result.nanoseconds, 1000);
    });
    const max = new Duration(...Array(10).fill(Number.MAX_VALUE));
    it('caps values at Number.MAX_VALUE by default', () => {
      const result = max.plus(max);
      equal(result.years, Number.MAX_VALUE);
      equal(result.months, Number.MAX_VALUE);
      equal(result.weeks, Number.MAX_VALUE);
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
      equal(result.weeks, Number.MAX_VALUE);
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
      ['', 'CONSTRAIN', 'balanceConstrain', 3, null].forEach((disambiguation) =>
        throws(() => duration.plus(duration, { disambiguation }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
        throws(() => duration.plus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
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
    it('symmetric with regard to negative durations', () => {
      equal(`${Duration.from('P2DT1H5M').minus({ days: -1, minutes: -5 })}`, 'P3DT1H10M');
      equal(`${new Duration().minus({ days: -3, hours: -1, minutes: -10 })}`, 'P3DT1H10M');
      equal(`${Duration.from('PT1H10M').minus({ days: -3 })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT1H').minus({ minutes: -10 })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT55M').minus({ minutes: -15 }, { disambiguation: 'balance' })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT1H9M30S').minus({ seconds: -30 }, { disambiguation: 'balance' })}`, 'P3DT1H10M');
    });
    it('never balances positive units in constrain mode', () => {
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

      result = d.minus(less, { disambiguation: 'constrain' });
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
      let d = Duration.from('P1M15D');
      throws(() => d.minus({ days: 20 }), RangeError);
      d = Duration.from('P1W5D');
      throws(() => d.minus({ days: 10 }), RangeError);
    });
    const tenYears = Duration.from('P10Y');
    const tenMinutes = Duration.from('PT10M');
    it('has correct negative result', () => {
      let result = tenYears.minus({ years: 15 });
      equal(result.years, -5);
      result = tenMinutes.minus({ minutes: 15 });
      equal(result.minutes, -5);
    });
    it('throws if result cannot be determined to be positive or negative', () => {
      ['constrain', 'balance'].forEach((disambiguation) => {
        throws(() => tenYears.minus({ months: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ weeks: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ days: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ hours: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ minutes: 5 }, { disambiguation }), RangeError);
        throws(() => tenYears.minus({ seconds: 5 }, { disambiguation }), RangeError);
      });
    });
    it('throws on invalid disambiguation', () => {
      ['', 'BALANCE', 'xyz', 3, null].forEach((disambiguation) =>
        throws(() => duration.minus(duration, { disambiguation }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'balance', 'reject'].forEach((disambiguation) =>
        throws(() => duration.minus({ hours: 1, minutes: -30 }, { disambiguation }), RangeError)
      );
    });
  });
  describe('duration.getFields() works', () => {
    const d1 = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const fields = d1.getFields();
    it('fields', () => {
      equal(fields.years, 5);
      equal(fields.months, 5);
      equal(fields.weeks, 5);
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
      equal(fields2.weeks, 5);
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
      equal(d2.weeks, 5);
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
      equal(d2.weeks, 5);
      equal(d2.days, 5);
      equal(d2.hours, 5);
      equal(d2.minutes, 5);
      equal(d2.seconds, 5);
      equal(d2.milliseconds, 5);
      equal(d2.microseconds, 5);
      equal(d2.nanoseconds, 5);
    });
    it('has correct sign', () => {
      const fields = Duration.from('-P5Y5M5W5DT5H5M5.005005005S');
      equal(fields.years, -5);
      equal(fields.months, -5);
      equal(fields.weeks, -5);
      equal(fields.days, -5);
      equal(fields.hours, -5);
      equal(fields.minutes, -5);
      equal(fields.seconds, -5);
      equal(fields.milliseconds, -5);
      equal(fields.microseconds, -5);
      equal(fields.nanoseconds, -5);
    });
    it('does not include the sign field', () => assert(!('sign' in fields)));
  });
  describe("Comparison operators don't work", () => {
    const d1 = Duration.from('P3DT1H');
    const d1again = Duration.from('P3DT1H');
    const d2 = Duration.from('PT2H20M30S');
    it('=== is object equality', () => equal(d1, d1));
    it('!== is object equality', () => notEqual(d1, d1again));
    it('<', () => throws(() => d1 < d2));
    it('>', () => throws(() => d1 > d2));
    it('<=', () => throws(() => d1 <= d2));
    it('>=', () => throws(() => d1 >= d2));
  });
  describe('Duration.negated()', () => {
    it('makes a positive duration negative', () => {
      const pos = Duration.from('P3DT1H');
      const neg = pos.negated();
      equal(`${neg}`, '-P3DT1H');
      equal(neg.sign, -1);
    });
    it('makes a negative duration positive', () => {
      const neg = Duration.from('-PT2H20M30S');
      const pos = neg.negated();
      equal(`${pos}`, 'PT2H20M30S');
      equal(pos.sign, 1);
    });
    it('makes a copy of a zero duration', () => {
      const zero = Duration.from('PT0S');
      const zero2 = zero.negated();
      equal(`${zero}`, `${zero2}`);
      notEqual(zero, zero2);
      equal(zero2.sign, 0);
    });
  });
  describe('Duration.abs()', () => {
    it('makes a copy of a positive duration', () => {
      const pos = Duration.from('P3DT1H');
      const pos2 = pos.abs();
      equal(`${pos}`, `${pos2}`);
      notEqual(pos, pos2);
      equal(pos2.sign, 1);
    });
    it('makes a negative duration positive', () => {
      const neg = Duration.from('-PT2H20M30S');
      const pos = neg.abs();
      equal(`${pos}`, 'PT2H20M30S');
      equal(pos.sign, 1);
    });
    it('makes a copy of a zero duration', () => {
      const zero = Duration.from('PT0S');
      const zero2 = zero.abs();
      equal(`${zero}`, `${zero2}`);
      notEqual(zero, zero2);
      equal(zero2.sign, 0);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
