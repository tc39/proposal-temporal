import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { Duration } = Temporal;

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
      it('Duration.prototype.add is a Function', () => {
        equal(typeof Duration.prototype.add, 'function');
      });
      it('Duration.prototype.subtract is a Function', () => {
        equal(typeof Duration.prototype.subtract, 'function');
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
      it('Duration.prototype.round is a Function', () => {
        equal(typeof Duration.prototype.round, 'function');
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
    it('constructor treats -0 as 0', () => {
      const d = new Duration(-0, -0, -0, -0, -0, -0, -0, -0, -0, -0);
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
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => Duration.from({ hours: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(Duration.from({ hours: 1 }, options).hours, 1));
    });
    describe('Overflow', () => {
      it('mixed positive and negative values always throw', () => {
        ['constrain', 'balance'].forEach((overflow) =>
          throws(() => Duration.from({ hours: 1, minutes: -30 }, { overflow }), RangeError)
        );
      });
      it('excessive values unchanged when "constrain"', () => {
        equal(`${Duration.from({ minutes: 100 }, { overflow: 'constrain' })}`, 'PT100M');
      });
      it('excessive time units balance when "balance"', () => {
        equal(`${Duration.from({ nanoseconds: 1000 }, { overflow: 'balance' })}`, 'PT0.000001S');
        equal(`${Duration.from({ microseconds: 1000 }, { overflow: 'balance' })}`, 'PT0.001S');
        equal(`${Duration.from({ milliseconds: 1000 }, { overflow: 'balance' })}`, 'PT1S');
        equal(`${Duration.from({ seconds: 100 }, { overflow: 'balance' })}`, 'PT1M40S');
        equal(`${Duration.from({ minutes: 100 }, { overflow: 'balance' })}`, 'PT1H40M');
        equal(`${Duration.from({ hours: 100 }, { overflow: 'balance' })}`, 'P4DT4H');
      });
      it('excessive date units do not balance when "balance"', () => {
        equal(`${Duration.from({ months: 12 }, { overflow: 'balance' })}`, 'P12M');
        equal(`${Duration.from({ months: 12, seconds: 3600 }, { overflow: 'balance' })}`, 'P12MT1H');
        equal(`${Duration.from({ weeks: 6 }, { overflow: 'balance' })}`, 'P6W');
        equal(`${Duration.from({ weeks: 6, seconds: 3600 }, { overflow: 'balance' })}`, 'P6WT1H');
        equal(`${Duration.from({ days: 31 }, { overflow: 'balance' })}`, 'P31D');
        equal(`${Duration.from({ days: 31, seconds: 3600 }, { overflow: 'balance' })}`, 'P31DT1H');
      });
      it('throw on bad overflow', () => {
        [new Duration(3), { days: 0 }, 'P5Y'].forEach((input) => {
          ['', 'CONSTRAIN', 'reject', 'xyz', 3, null].forEach((overflow) =>
            throws(() => Duration.from(input, { overflow }), RangeError)
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
    it('negative sub-second units are balanced correctly', () => {
      equal(`${Duration.from({ milliseconds: -250 })}`, '-PT0.250S');
      equal(`${Duration.from({ milliseconds: -3500 })}`, '-PT3.500S');
      equal(`${Duration.from({ microseconds: -250 })}`, '-PT0.000250S');
      equal(`${Duration.from({ microseconds: -3500 })}`, '-PT0.003500S');
      equal(`${Duration.from({ nanoseconds: -250 })}`, '-PT0.000000250S');
      equal(`${Duration.from({ nanoseconds: -3500 })}`, '-PT0.000003500S');
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, -1111, -1111, -1111)}`, '-PT1.112112111S');
      equal(`${Duration.from({ seconds: -120, milliseconds: -3500 })}`, '-PT123.500S');
    });
    it('emits a negative sign for a negative duration', () => {
      equal(`${Duration.from({ weeks: -1, days: -1 })}`, '-P1W1D');
    });
    it("serializing balance doesn't trip out-of-range", () => {
      const d = Duration.from({ seconds: Number.MAX_VALUE, milliseconds: Number.MAX_VALUE });
      const str = d.toString();
      assert(str.startsWith('PT'));
      assert(str.endsWith('S'));
      // actual string representation may vary, since MAX_VALUE is not precise
    });
    it("serializing balance doesn't lose precision when values are precise", () => {
      const d = Duration.from({ milliseconds: Number.MAX_SAFE_INTEGER, microseconds: Number.MAX_SAFE_INTEGER });
      equal(`${d}`, 'PT9016206453995.731991S');
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
        throws(() => Duration.from({ [unit]: 1e309 }), RangeError);
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
      ].forEach((str) => throws(() => Duration.from(str), RangeError));
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
        doAsserts(new Duration(...Array(ix).fill(0), 1e26, ...Array(9 - ix).fill(0)));
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
        { overflow: 'balance' }
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
      ['constrain', 'balance'].forEach((overflow) =>
        throws(() => duration.with({ hours: 1, minutes: -1 }, { overflow }), RangeError)
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
    it('invalid overflow', () => {
      ['', 'CONSTRAIN', 'reject', 'xyz', 3, null].forEach((overflow) =>
        throws(() => duration.with({ days: 5 }, { overflow }), RangeError)
      );
    });
    it('sign cannot be manipulated independently', () => {
      throws(() => duration.with({ sign: -1 }), RangeError);
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => duration.with({ days: 5 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(duration.with({ days: 5 }, options).days, 5));
    });
  });
  describe('Duration.add()', () => {
    const duration = Duration.from({ days: 1, minutes: 5 });
    it('adds same units', () => {
      equal(`${duration.add({ days: 2, minutes: 5 })}`, 'P3DT10M');
    });
    it('adds different units', () => {
      equal(`${duration.add({ hours: 12, seconds: 30 })}`, 'P1DT12H5M30S');
    });
    it('symmetric with regard to negative durations', () => {
      equal(`${Duration.from('P3DT10M').add({ days: -2, minutes: -5 })}`, 'P1DT5M');
      equal(`${Duration.from('P1DT12H5M30S').add({ hours: -12, seconds: -30 }, { overflow: 'balance' })}`, 'P1DT5M');
    });
    it('does not balance units', () => {
      const d = Duration.from('P50M50W50DT50H50M50.500500500S');
      const result = d.add(d);
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
    it('always throws when addition overflows', () => {
      ['constrain', 'balance'].forEach((overflow) => {
        throws(() => max.add(max, { overflow }), RangeError);
      });
    });
    it('throws on invalid overflow', () => {
      ['', 'CONSTRAIN', 'reject', 3, null].forEach((overflow) =>
        throws(() => duration.add(duration, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'balance'].forEach((overflow) =>
        throws(() => duration.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => duration.add({ hours: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(duration.add({ hours: 1 }, options).hours, 1));
    });
  });
  describe('Duration.subtract()', () => {
    const duration = Duration.from({ days: 3, hours: 1, minutes: 10 });
    it('subtracts same units with positive result', () => {
      equal(`${duration.subtract({ days: 1, minutes: 5 })}`, 'P2DT1H5M');
    });
    it('subtracts same units with zero result', () => {
      equal(`${duration.subtract(duration)}`, 'PT0S');
      equal(`${duration.subtract({ days: 3 })}`, 'PT1H10M');
      equal(`${duration.subtract({ minutes: 10 })}`, 'P3DT1H');
    });
    it('balances when subtracting same units with negative result', () => {
      equal(`${duration.subtract({ minutes: 15 })}`, 'P3DT55M');
    });
    it('balances when subtracting different units', () => {
      equal(`${duration.subtract({ seconds: 30 })}`, 'P3DT1H9M30S');
    });
    it('symmetric with regard to negative durations', () => {
      equal(`${Duration.from('P2DT1H5M').subtract({ days: -1, minutes: -5 })}`, 'P3DT1H10M');
      equal(`${new Duration().subtract({ days: -3, hours: -1, minutes: -10 })}`, 'P3DT1H10M');
      equal(`${Duration.from('PT1H10M').subtract({ days: -3 })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT1H').subtract({ minutes: -10 })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT55M').subtract({ minutes: -15 }, { overflow: 'balance' })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT1H9M30S').subtract({ seconds: -30 }, { overflow: 'balance' })}`, 'P3DT1H10M');
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
      let result = d.subtract(less);
      equal(result.minutes, 90);
      equal(result.seconds, 90);
      equal(result.milliseconds, 1500);
      equal(result.microseconds, 1500);
      equal(result.nanoseconds, 1500);

      result = d.subtract(less, { overflow: 'constrain' });
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
      const result = d.subtract(less, { overflow: 'balance' });
      equal(result.hours, 1);
      equal(result.minutes, 31);
      equal(result.seconds, 31);
      equal(result.milliseconds, 501);
      equal(result.microseconds, 501);
      equal(result.nanoseconds, 500);
    });
    it('does not balance with units higher than days', () => {
      let d = Duration.from('P1M15D');
      throws(() => d.subtract({ days: 20 }), RangeError);
      d = Duration.from('P1W5D');
      throws(() => d.subtract({ days: 10 }), RangeError);
    });
    const tenYears = Duration.from('P10Y');
    const tenMinutes = Duration.from('PT10M');
    it('has correct negative result', () => {
      let result = tenYears.subtract({ years: 15 });
      equal(result.years, -5);
      result = tenMinutes.subtract({ minutes: 15 });
      equal(result.minutes, -5);
    });
    it('throws if result cannot be determined to be positive or negative', () => {
      ['constrain', 'balance'].forEach((overflow) => {
        throws(() => tenYears.subtract({ months: 5 }, { overflow }), RangeError);
        throws(() => tenYears.subtract({ weeks: 5 }, { overflow }), RangeError);
        throws(() => tenYears.subtract({ days: 5 }, { overflow }), RangeError);
        throws(() => tenYears.subtract({ hours: 5 }, { overflow }), RangeError);
        throws(() => tenYears.subtract({ minutes: 5 }, { overflow }), RangeError);
        throws(() => tenYears.subtract({ seconds: 5 }, { overflow }), RangeError);
      });
    });
    it('throws on invalid overflow', () => {
      ['', 'BALANCE', 'reject', 'xyz', 3, null].forEach((overflow) =>
        throws(() => duration.subtract(duration, { overflow }), RangeError)
      );
    });
    it('mixed positive and negative values always throw', () => {
      ['constrain', 'balance'].forEach((overflow) =>
        throws(() => duration.subtract({ hours: 1, minutes: -30 }, { overflow }), RangeError)
      );
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => duration.subtract({ hours: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(duration.subtract({ hours: 1 }, options).hours, 0));
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
      equal(zero2.years, 0);
      equal(zero2.months, 0);
      equal(zero2.weeks, 0);
      equal(zero2.days, 0);
      equal(zero2.hours, 0);
      equal(zero2.minutes, 0);
      equal(zero2.seconds, 0);
      equal(zero2.milliseconds, 0);
      equal(zero2.microseconds, 0);
      equal(zero2.nanoseconds, 0);
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
  describe('Duration.round()', () => {
    const d = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const d2 = new Duration(0, 0, 0, 5, 5, 5, 5, 5, 5, 5);
    const relativeTo = Temporal.DateTime.from('2020-01-01T00:00');
    it('options may only be an object', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) => throws(() => d.round(badOptions), TypeError));
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'nonsense'].forEach((smallestUnit) => {
        throws(() => d.round({ smallestUnit }), RangeError);
      });
    });
    it('throws if smallestUnit is larger than largestUnit', () => {
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
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx];
          const smallestUnit = units[smallestIdx];
          throws(() => d.round({ largestUnit, smallestUnit, relativeTo }), RangeError);
        }
      }
    });
    it('assumes a different default for largestUnit if smallestUnit is larger than the default', () => {
      const almostYear = Duration.from({ days: 364 });
      equal(`${almostYear.round({ smallestUnit: 'years', relativeTo })}`, 'P1Y');
      const almostMonth = Duration.from({ days: 27 });
      equal(`${almostMonth.round({ smallestUnit: 'months', relativeTo })}`, 'P1M');
      const almostWeek = Duration.from({ days: 6 });
      equal(`${almostWeek.round({ smallestUnit: 'weeks', relativeTo })}`, 'P1W');
      const almostDay = Duration.from({ seconds: 86399 });
      equal(`${almostDay.round({ smallestUnit: 'days' })}`, 'P1D');
      const almostHour = Duration.from({ seconds: 3599 });
      equal(`${almostHour.round({ smallestUnit: 'hours' })}`, 'PT1H');
      const almostMinute = Duration.from({ seconds: 59 });
      equal(`${almostMinute.round({ smallestUnit: 'minutes' })}`, 'PT1M');
      const almostSecond = Duration.from({ nanoseconds: 999999999 });
      equal(`${almostSecond.round({ smallestUnit: 'seconds' })}`, 'PT1S');
      const almostMillisecond = Duration.from({ nanoseconds: 999999 });
      equal(`${almostMillisecond.round({ smallestUnit: 'milliseconds' })}`, 'PT0.001S');
      const almostMicrosecond = Duration.from({ nanoseconds: 999 });
      equal(`${almostMicrosecond.round({ smallestUnit: 'microseconds' })}`, 'PT0.000001S');
    });
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ['2020-01-01', '2020-01-01T00:00:00.000000000', 20200101, 20200101n, { year: 2020, month: 1, day: 1 }].forEach(
        (relativeTo) => {
          equal(`${d.round({ relativeTo })}`, 'P5Y5M5W5DT5H5M5.005005005S');
        }
      );
    });
    it("throws on relativeTo that can't be converted to datetime string", () => {
      [3.14, true, null, 'hello', Symbol('foo'), 1n].forEach((relativeTo) => {
        throws(() => d.round({ relativeTo }));
      });
    });
    it('throws on invalid roundingMode', () => {
      throws(() => d2.round({ smallestUnit: 'nanoseconds', roundingMode: 'cile' }), RangeError);
    });
    it('throws if neither one of largestUnit or smallestUnit is given', () => {
      [undefined, {}, () => {}, { roundingMode: 'ceil' }].forEach((options) =>
        throws(() => d.round(options), RangeError)
      );
    });
    it('relativeTo is not required for rounding non-calendar units in durations without calendar units', () => {
      equal(`${d2.round({ smallestUnit: 'days' })}`, 'P5D');
      equal(`${d2.round({ smallestUnit: 'hours' })}`, 'P5DT5H');
      equal(`${d2.round({ smallestUnit: 'minutes' })}`, 'P5DT5H5M');
      equal(`${d2.round({ smallestUnit: 'seconds' })}`, 'P5DT5H5M5S');
      equal(`${d2.round({ smallestUnit: 'milliseconds' })}`, 'P5DT5H5M5.005S');
      equal(`${d2.round({ smallestUnit: 'microseconds' })}`, 'P5DT5H5M5.005005S');
      equal(`${d2.round({ smallestUnit: 'nanoseconds' })}`, 'P5DT5H5M5.005005005S');
    });
    it('relativeTo is required for rounding calendar units even in durations without calendar units', () => {
      throws(() => d2.round({ smallestUnit: 'years' }), RangeError);
      throws(() => d2.round({ smallestUnit: 'months' }), RangeError);
      throws(() => d2.round({ smallestUnit: 'weeks' }), RangeError);
    });
    it('relativeTo is required for rounding durations with calendar units', () => {
      throws(() => d.round({ largestUnit: 'years' }), RangeError);
      throws(() => d.round({ largestUnit: 'months' }), RangeError);
      throws(() => d.round({ largestUnit: 'weeks' }), RangeError);
      throws(() => d.round({ largestUnit: 'days' }), RangeError);
      throws(() => d.round({ largestUnit: 'hours' }), RangeError);
      throws(() => d.round({ largestUnit: 'minutes' }), RangeError);
      throws(() => d.round({ largestUnit: 'seconds' }), RangeError);
      throws(() => d.round({ largestUnit: 'milliseconds' }), RangeError);
      throws(() => d.round({ largestUnit: 'microseconds' }), RangeError);
      throws(() => d.round({ largestUnit: 'nanoseconds' }), RangeError);
    });
    it('durations do not balance beyond their current largest unit by default', () => {
      const fortyDays = Duration.from({ days: 40 });
      equal(`${fortyDays.round({ smallestUnit: 'seconds' })}`, 'P40D');
    });
    const roundAndBalanceResults = {
      // largestUnit
      years: {
        // smallestUnit
        years: 'P6Y',
        months: 'P5Y6M',
        weeks: 'P5Y5M6W',
        days: 'P5Y5M5W5D',
        hours: 'P5Y5M5W5DT5H',
        minutes: 'P5Y5M5W5DT5H5M',
        seconds: 'P5Y5M5W5DT5H5M5S',
        milliseconds: 'P5Y5M5W5DT5H5M5.005S',
        microseconds: 'P5Y5M5W5DT5H5M5.005005S',
        nanoseconds: 'P5Y5M5W5DT5H5M5.005005005S'
      },
      months: {
        months: 'P66M',
        weeks: 'P65M6W',
        days: 'P65M5W5D',
        hours: 'P65M5W5DT5H',
        minutes: 'P65M5W5DT5H5M',
        seconds: 'P65M5W5DT5H5M5S',
        milliseconds: 'P65M5W5DT5H5M5.005S',
        microseconds: 'P65M5W5DT5H5M5.005005S',
        nanoseconds: 'P65M5W5DT5H5M5.005005005S'
      },
      weeks: {
        weeks: 'P288W',
        days: 'P288W2D',
        hours: 'P288W2DT5H',
        minutes: 'P288W2DT5H5M',
        seconds: 'P288W2DT5H5M5S',
        milliseconds: 'P288W2DT5H5M5.005S',
        microseconds: 'P288W2DT5H5M5.005005S',
        nanoseconds: 'P288W2DT5H5M5.005005005S'
      },
      days: {
        days: 'P2018D',
        hours: 'P2018DT5H',
        minutes: 'P2018DT5H5M',
        seconds: 'P2018DT5H5M5S',
        milliseconds: 'P2018DT5H5M5.005S',
        microseconds: 'P2018DT5H5M5.005005S',
        nanoseconds: 'P2018DT5H5M5.005005005S'
      },
      hours: {
        hours: 'PT48437H',
        minutes: 'PT48437H5M',
        seconds: 'PT48437H5M5S',
        milliseconds: 'PT48437H5M5.005S',
        microseconds: 'PT48437H5M5.005005S',
        nanoseconds: 'PT48437H5M5.005005005S'
      },
      minutes: {
        minutes: 'PT2906225M',
        seconds: 'PT2906225M5S',
        milliseconds: 'PT2906225M5.005S',
        microseconds: 'PT2906225M5.005005S',
        nanoseconds: 'PT2906225M5.005005005S'
      },
      seconds: {
        seconds: 'PT174373505S',
        milliseconds: 'PT174373505.005S',
        microseconds: 'PT174373505.005005S',
        nanoseconds: 'PT174373505.005005005S'
      },
      milliseconds: {
        milliseconds: 'PT174373505.005S',
        microseconds: 'PT174373505.005005S',
        nanoseconds: 'PT174373505.005005005S'
      }
    };
    for (const [largestUnit, entry] of Object.entries(roundAndBalanceResults)) {
      for (const [smallestUnit, expected] of Object.entries(entry)) {
        it(`round(${largestUnit}, ${smallestUnit}) = ${expected}`, () => {
          equal(`${d.round({ largestUnit, smallestUnit, relativeTo })}`, expected);
        });
      }
    }
    const balanceLosePrecisionResults = {
      // largestUnit: smallestUnits
      microseconds: ['microseconds', 'nanoseconds'],
      nanoseconds: ['nanoseconds']
    };
    for (const [largestUnit, entry] of Object.entries(balanceLosePrecisionResults)) {
      for (const smallestUnit of entry) {
        it(`round(${largestUnit}, ${smallestUnit}) may lose precision below ms`, () => {
          assert(`${d.round({ largestUnit, smallestUnit, relativeTo })}`.startsWith('PT174373505.005'));
        });
      }
    }
    const roundingModeResults = {
      nearest: ['P6Y', '-P6Y'],
      ceil: ['P6Y', '-P5Y'],
      floor: ['P5Y', '-P6Y'],
      trunc: ['P5Y', '-P5Y']
    };
    for (const [roundingMode, [posResult, negResult]] of Object.entries(roundingModeResults)) {
      it(`rounds correctly in ${roundingMode} mode`, () => {
        equal(`${d.round({ smallestUnit: 'years', relativeTo, roundingMode })}`, posResult);
        equal(`${d.negated().round({ smallestUnit: 'years', relativeTo, roundingMode })}`, negResult);
      });
    }
    it('nearest is the default', () => {
      equal(`${d.round({ smallestUnit: 'years', relativeTo })}`, 'P6Y');
      equal(`${d.negated().round({ smallestUnit: 'years', relativeTo })}`, '-P6Y');
    });
    it('balances differently depending on relativeTo', () => {
      const fortyDays = Duration.from({ days: 40 });
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-01-01' })}`, 'P1M9D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-02-01' })}`, 'P1M11D');
    });
    it('balances up to the next unit after rounding', () => {
      const almostWeek = Duration.from({ days: 6, hours: 20 });
      equal(`${almostWeek.round({ largestUnit: 'weeks', smallestUnit: 'days', relativeTo: '2020-01-01' })}`, 'P1W');
    });
    it('balances days up to both years and months', () => {
      const twoYears = Duration.from({ months: 11, days: 396 });
      equal(`${twoYears.round({ largestUnit: 'years', relativeTo: '2017-01-01' })}`, 'P2Y');
    });
    it('does not balance up to weeks if largestUnit is larger than weeks', () => {
      const monthAlmostWeek = Duration.from({ months: 1, days: 6, hours: 20 });
      equal(`${monthAlmostWeek.round({ smallestUnit: 'days', relativeTo: '2020-01-01' })}`, 'P1M7D');
    });
    it('rounds to an increment of hours', () => {
      equal(`${d.round({ smallestUnit: 'hours', roundingIncrement: 3, relativeTo })}`, 'P5Y5M5W5DT6H');
    });
    it('rounds to an increment of minutes', () => {
      equal(`${d.round({ smallestUnit: 'minutes', roundingIncrement: 30, relativeTo })}`, 'P5Y5M5W5DT5H');
    });
    it('rounds to an increment of seconds', () => {
      equal(`${d.round({ smallestUnit: 'seconds', roundingIncrement: 15, relativeTo })}`, 'P5Y5M5W5DT5H5M');
    });
    it('rounds to an increment of milliseconds', () => {
      equal(`${d.round({ smallestUnit: 'milliseconds', roundingIncrement: 10, relativeTo })}`, 'P5Y5M5W5DT5H5M5.010S');
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${d.round({ smallestUnit: 'microseconds', roundingIncrement: 10, relativeTo })}`,
        'P5Y5M5W5DT5H5M5.005010S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${d.round({ smallestUnit: 'nanoseconds', roundingIncrement: 10, relativeTo })}`,
        'P5Y5M5W5DT5H5M5.005005010S'
      );
    });
    it('valid hour increments divide into 24', () => {
      [1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement, relativeTo };
        assert(d.round(options) instanceof Temporal.Duration);
      });
    });
    ['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement, relativeTo };
          assert(d.round(options) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement, relativeTo };
          assert(d.round(options) instanceof Temporal.Duration);
        });
      });
    });
    it('throws on increments that do not divide evenly into the next highest', () => {
      throws(() => d.round({ relativeTo, smallestUnit: 'hours', roundingIncrement: 11 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError);
    });
    it('throws on increments that are equal to the next highest', () => {
      throws(() => d.round({ relativeTo, smallestUnit: 'hours', roundingIncrement: 24 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError);
      throws(() => d.round({ relativeTo, smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError);
    });
    it('accepts singular units', () => {
      equal(`${d.round({ smallestUnit: 'year', relativeTo })}`, `${d.round({ smallestUnit: 'years', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'month', relativeTo })}`, `${d.round({ smallestUnit: 'months', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'week', relativeTo })}`, `${d.round({ smallestUnit: 'weeks', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'day', relativeTo })}`, `${d.round({ smallestUnit: 'days', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'hour', relativeTo })}`, `${d.round({ smallestUnit: 'hours', relativeTo })}`);
      equal(
        `${d.round({ smallestUnit: 'minute', relativeTo })}`,
        `${d.round({ smallestUnit: 'minutes', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'second', relativeTo })}`,
        `${d.round({ smallestUnit: 'seconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'millisecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'milliseconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'microsecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'microseconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'nanosecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'nanoseconds', relativeTo })}`
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
