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
      it('Duration.prototype has blank', () => {
        assert('blank' in Duration.prototype);
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
    it('Duration.compare is a Function', () => {
      equal(typeof Duration.compare, 'function');
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
    it('lowercase variant', () => equal(`${Duration.from('p1y1m1dt1h1m1s')}`, 'P1Y1M1DT1H1M1S'));
    it('upto nine decimal places work', () => {
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1S')}`, 'P1Y1M1W1DT1H1M1.1S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12S')}`, 'P1Y1M1W1DT1H1M1.12S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123S')}`, 'P1Y1M1W1DT1H1M1.123S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1234S')}`, 'P1Y1M1W1DT1H1M1.1234S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12345S')}`, 'P1Y1M1W1DT1H1M1.12345S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123456S')}`, 'P1Y1M1W1DT1H1M1.123456S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.1234567S')}`, 'P1Y1M1W1DT1H1M1.1234567S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.12345678S')}`, 'P1Y1M1W1DT1H1M1.12345678S');
      equal(`${Duration.from('P1Y1M1W1DT1H1M1.123456789S')}`, 'P1Y1M1W1DT1H1M1.123456789S');
    });
    it('above nine decimal places throw', () => {
      throws(() => Duration.from('P1Y1M1W1DT1H1M1.123456789123S'), RangeError);
    });
    it('variant decimal separator', () => {
      equal(`${Duration.from('P1Y1M1W1DT1H1M1,12S')}`, 'P1Y1M1W1DT1H1M1.12S');
    });
    it('decimal places only allowed in time units', () => {
      [
        'P0.5Y',
        'P1Y0,5M',
        'P1Y1M0.5W',
        'P1Y1M1W0,5D',
        { years: 0.5 },
        { months: 0.5 },
        { weeks: 0.5 },
        { days: 0.5 }
      ].forEach((str) => throws(() => Duration.from(str), RangeError));
    });
    it('decimal places only allowed in last non-zero unit', () => {
      [
        'P1Y1M1W1DT0.5H5S',
        'P1Y1M1W1DT1.5H0,5M',
        'P1Y1M1W1DT1H0.5M0.5S',
        { hours: 0.5, minutes: 20 },
        { hours: 0.5, seconds: 15 },
        { minutes: 10.7, nanoseconds: 400 }
      ].forEach((str) => throws(() => Duration.from(str), RangeError));
    });
    it('decimal places are properly handled on valid units', () => {
      equal(`${Duration.from('P1DT0.5M')}`, 'P1DT30S');
      equal(`${Duration.from('P1DT0,5H')}`, 'P1DT30M');
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
    it('mixed positive and negative values throw', () => {
      throws(() => Duration.from({ hours: 1, minutes: -30 }), RangeError);
    });
    it('excessive values unchanged', () => {
      equal(`${Duration.from({ minutes: 100 })}`, 'PT100M');
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => Duration.from({}), TypeError);
      throws(() => Duration.from({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${Duration.from({ month: 1, days: 1 })}`, 'P1D');
    });
  });
  describe('toString()', () => {
    it('excessive sub-second units balance themselves when serializing', () => {
      equal(`${Duration.from({ milliseconds: 3500 })}`, 'PT3.5S');
      equal(`${Duration.from({ microseconds: 3500 })}`, 'PT0.0035S');
      equal(`${Duration.from({ nanoseconds: 3500 })}`, 'PT0.0000035S');
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, 1111, 1111, 1111)}`, 'PT1.112112111S');
      equal(`${Duration.from({ seconds: 120, milliseconds: 3500 })}`, 'PT123.5S');
    });
    it('negative sub-second units are balanced correctly', () => {
      equal(`${Duration.from({ milliseconds: -250 })}`, '-PT0.25S');
      equal(`${Duration.from({ milliseconds: -3500 })}`, '-PT3.5S');
      equal(`${Duration.from({ microseconds: -250 })}`, '-PT0.00025S');
      equal(`${Duration.from({ microseconds: -3500 })}`, '-PT0.0035S');
      equal(`${Duration.from({ nanoseconds: -250 })}`, '-PT0.00000025S');
      equal(`${Duration.from({ nanoseconds: -3500 })}`, '-PT0.0000035S');
      equal(`${new Duration(0, 0, 0, 0, 0, 0, 0, -1111, -1111, -1111)}`, '-PT1.112112111S');
      equal(`${Duration.from({ seconds: -120, milliseconds: -3500 })}`, '-PT123.5S');
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
    const d1 = new Duration(0, 0, 0, 0, 15, 23);
    const d2 = new Duration(0, 0, 0, 0, 15, 23, 30);
    const d3 = new Duration(0, 0, 0, 0, 15, 23, 30, 543, 200);
    it('smallestUnits are aliases for fractional digits', () => {
      equal(d3.toString({ smallestUnit: 'seconds' }), d3.toString({ fractionalSecondDigits: 0 }));
      equal(d3.toString({ smallestUnit: 'milliseconds' }), d3.toString({ fractionalSecondDigits: 3 }));
      equal(d3.toString({ smallestUnit: 'microseconds' }), d3.toString({ fractionalSecondDigits: 6 }));
      equal(d3.toString({ smallestUnit: 'nanoseconds' }), d3.toString({ fractionalSecondDigits: 9 }));
    });
    it('throws on invalid or disallowed smallestUnit', () => {
      ['eras', 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'nonsense'].forEach((smallestUnit) =>
        throws(() => d1.toString({ smallestUnit }), RangeError)
      );
    });
    it('accepts singular units', () => {
      equal(d3.toString({ smallestUnit: 'second' }), d3.toString({ smallestUnit: 'seconds' }));
      equal(d3.toString({ smallestUnit: 'millisecond' }), d3.toString({ smallestUnit: 'milliseconds' }));
      equal(d3.toString({ smallestUnit: 'microsecond' }), d3.toString({ smallestUnit: 'microseconds' }));
      equal(d3.toString({ smallestUnit: 'nanosecond' }), d3.toString({ smallestUnit: 'nanoseconds' }));
    });
    it('truncates or pads to 2 places', () => {
      const options = { fractionalSecondDigits: 2 };
      equal(d1.toString(options), 'PT15H23M0.00S');
      equal(d2.toString(options), 'PT15H23M30.00S');
      equal(d3.toString(options), 'PT15H23M30.54S');
    });
    it('pads to 7 places', () => {
      const options = { fractionalSecondDigits: 7 };
      equal(d1.toString(options), 'PT15H23M0.0000000S');
      equal(d2.toString(options), 'PT15H23M30.0000000S');
      equal(d3.toString(options), 'PT15H23M30.5432000S');
    });
    it('auto is the default', () => {
      [d1, d2, d3].forEach((d) => equal(d.toString({ fractionalSecondDigits: 'auto' }), d.toString()));
    });
    it('throws on out of range or invalid fractionalSecondDigits', () => {
      [-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
        throws(() => d1.toString({ fractionalSecondDigits }), RangeError)
      );
    });
    it('accepts and truncates fractional fractionalSecondDigits', () => {
      equal(d3.toString({ fractionalSecondDigits: 5.5 }), 'PT15H23M30.54320S');
    });
    it('smallestUnit overrides fractionalSecondDigits', () => {
      equal(d3.toString({ smallestUnit: 'seconds', fractionalSecondDigits: 9 }), 'PT15H23M30S');
    });
    it('throws on invalid roundingMode', () => {
      throws(() => d1.toString({ roundingMode: 'cile' }), RangeError);
    });
    it('rounds to nearest', () => {
      equal(d3.toString({ smallestUnit: 'seconds', roundingMode: 'halfExpand' }), 'PT15H23M31S');
      equal(d3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' }), 'PT15H23M30.543S');
    });
    it('rounds up', () => {
      equal(d3.toString({ smallestUnit: 'seconds', roundingMode: 'ceil' }), 'PT15H23M31S');
      equal(d3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }), 'PT15H23M30.544S');
    });
    it('rounds down', () => {
      equal(d3.negated().toString({ smallestUnit: 'seconds', roundingMode: 'floor' }), '-PT15H23M31S');
      equal(d3.negated().toString({ fractionalSecondDigits: 3, roundingMode: 'floor' }), '-PT15H23M30.544S');
    });
    it('truncates', () => {
      equal(d3.toString({ smallestUnit: 'seconds', roundingMode: 'trunc' }), 'PT15H23M30S');
      equal(d3.toString({ fractionalSecondDigits: 3, roundingMode: 'trunc' }), 'PT15H23M30.543S');
    });
    it('rounding can affect units up to seconds', () => {
      const d4 = Duration.from('P1Y1M1W1DT23H59M59.999999999S');
      equal(d4.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }), 'P1Y1M1W1DT23H59M60.00000000S');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => d1.toString(badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(d1.toString(options), 'PT15H23M'));
    });
  });
  describe('toJSON()', () => {
    it('is like toString but always with auto precision', () => {
      const d = Duration.from({ hours: 1 });
      equal(d.toJSON(), d.toString({ fractionalSecondDigits: 'auto' }));
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
    it('mixed positive and negative values throw', () => {
      throws(() => duration.with({ hours: 1, minutes: -1 }), RangeError);
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
    it('sign cannot be manipulated independently', () => {
      throws(() => duration.with({ sign: -1 }), TypeError);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => duration.with({}), TypeError);
      throws(() => duration.with({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${duration.with({ month: 1, days: 1 })}`, 'P5Y5M5W1DT5H5M5.005005005S');
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
      equal(`${Duration.from('P1DT12H5M30S').add({ hours: -12, seconds: -30 })}`, 'P1DT5M');
    });
    it('balances time units even if both operands are positive', () => {
      const d = Duration.from('P50DT50H50M50.500500500S');
      const result = d.add(d);
      equal(result.days, 104);
      equal(result.hours, 5);
      equal(result.minutes, 41);
      equal(result.seconds, 41);
      equal(result.milliseconds, 1);
      equal(result.microseconds, 1);
      equal(result.nanoseconds, 0);
    });
    it('balances correctly if adding different units flips the overall sign', () => {
      const d1 = Duration.from({ hours: -1, seconds: -60 });
      equal(`${d1.add({ minutes: 122 })}`, 'PT1H1M');
      const d2 = Duration.from({ hours: -1, seconds: -3721 });
      equal(`${d2.add({ minutes: 61, nanoseconds: 3722000000001 })}`, 'PT1M1.000000001S');
    });
    const max = new Duration(0, 0, 0, ...Array(7).fill(Number.MAX_VALUE));
    it('always throws when addition overflows', () => {
      throws(() => max.add(max), RangeError);
    });
    it('mixed positive and negative values always throw', () => {
      throws(() => duration.add({ hours: 1, minutes: -30 }), RangeError);
    });
    it('relativeTo required for years, months, and weeks', () => {
      const d = Duration.from({ hours: 1 });
      const dy = Duration.from({ years: 1 });
      const dm = Duration.from({ months: 1 });
      const dw = Duration.from({ weeks: 1 });
      throws(() => d.add(dy), RangeError);
      throws(() => d.add(dm), RangeError);
      throws(() => d.add(dw), RangeError);
      throws(() => dy.add(d), RangeError);
      throws(() => dm.add(d), RangeError);
      throws(() => dw.add(d), RangeError);
      const relativeTo = Temporal.PlainDateTime.from('2000-01-01');
      equal(`${d.add(dy, { relativeTo })}`, 'P1YT1H');
      equal(`${d.add(dm, { relativeTo })}`, 'P1MT1H');
      equal(`${d.add(dw, { relativeTo })}`, 'P1WT1H');
      equal(`${dy.add(d, { relativeTo })}`, 'P1YT1H');
      equal(`${dm.add(d, { relativeTo })}`, 'P1MT1H');
      equal(`${dw.add(d, { relativeTo })}`, 'P1WT1H');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => duration.add({ hours: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(duration.add({ hours: 1 }, options).hours, 1));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => duration.add({}), TypeError);
      throws(() => duration.add({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${duration.add({ month: 1, days: 1 })}`, 'P2DT5M');
    });
    it('casts argument', () => {
      equal(`${duration.add(Temporal.Duration.from('P2DT5M'))}`, 'P3DT10M');
      equal(`${duration.add('P2DT5M')}`, 'P3DT10M');
    });
    it('relativeTo affects year length', () => {
      const oneYear = new Duration(1);
      const days365 = new Duration(0, 0, 0, 365);
      equal(`${oneYear.add(days365, { relativeTo: Temporal.PlainDateTime.from('2016-01-01') })}`, 'P2Y');
      equal(`${oneYear.add(days365, { relativeTo: Temporal.PlainDateTime.from('2015-01-01') })}`, 'P1Y11M30D');
    });
    it('relativeTo affects month length', () => {
      const oneMonth = new Duration(0, 1);
      const days30 = new Duration(0, 0, 0, 30);
      equal(`${oneMonth.add(days30, { relativeTo: Temporal.PlainDateTime.from('2018-01-01') })}`, 'P2M2D');
      equal(`${oneMonth.add(days30, { relativeTo: Temporal.PlainDateTime.from('2018-02-01') })}`, 'P1M30D');
      equal(`${oneMonth.add(days30, { relativeTo: Temporal.PlainDateTime.from('2018-03-01') })}`, 'P2M');
    });
    it('first this is resolved against relativeTo, then the argument against relativeTo + this', () => {
      const d1 = new Duration(0, 1, 0, 1);
      const d2 = new Duration(0, 1, 0, 1);
      const relativeTo = new Temporal.PlainDateTime(2000, 1, 1);
      equal(`${d1.add(d2, { relativeTo })}`, 'P2M2D');
    });
    const oneDay = new Duration(0, 0, 0, 1);
    const hours24 = new Duration(0, 0, 0, 0, 24);
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      equal(`${oneDay.add(hours24, { relativeTo })}`, 'P2D');
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${oneDay.add(hours24, { relativeTo })}`, 'P2D');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const hours12 = new Duration(0, 0, 0, 0, 12);
    const hours25 = new Duration(0, 0, 0, 0, 25);
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        equal(`${hours25.add(oneDay, { relativeTo: inRepeatedHour })}`, 'P2D');
        equal(`${oneDay.add(hours25, { relativeTo: inRepeatedHour })}`, 'P2DT1H');
      });
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-05T01:00[America/Vancouver]');
        equal(`${hours25.negated().add(oneDay.negated(), { relativeTo })}`, '-P2DT1H');
        equal(`${oneDay.negated().add(hours25.negated(), { relativeTo })}`, '-P2D');
      });
      it('start inside repeated hour, end in skipped hour', () => {
        equal(`${hours25.add(Duration.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`, 'P126DT1H');
        // this takes you to 03:00 on the next skipped-hour day
        equal(`${oneDay.add(Duration.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`, 'P126DT1H');
      });
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-08T02:30[America/Vancouver]');
        equal(`${oneDay.add(hours25, { relativeTo })}`, 'P2DT1H');
        equal(`${hours25.add(oneDay, { relativeTo })}`, 'P2D');
      });
      it('start before skipped hour, end >1 day after', () => {
        equal(`${hours25.add(oneDay, { relativeTo: skippedHourDay })}`, 'P2DT2H');
        equal(`${oneDay.add(hours25, { relativeTo: skippedHourDay })}`, 'P2DT1H');
      });
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-11T00:00[America/Vancouver]');
        equal(`${hours25.negated().add(oneDay.negated(), { relativeTo })}`, '-P2DT2H');
        equal(`${oneDay.negated().add(hours25.negated(), { relativeTo })}`, '-P2DT1H');
      });
      it('start before skipped hour, end <1 day after', () => {
        equal(`${hours12.add(oneDay, { relativeTo: skippedHourDay })}`, 'P1DT13H');
        equal(`${oneDay.add(hours12, { relativeTo: skippedHourDay })}`, 'P1DT12H');
      });
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-10T12:00[America/Vancouver]');
        equal(`${hours12.negated().add(oneDay.negated(), { relativeTo })}`, '-P1DT13H');
        equal(`${oneDay.negated().add(hours12.negated(), { relativeTo })}`, '-P1DT12H');
      });
      it('start before repeated hour, end >1 day after', () => {
        equal(`${hours25.add(oneDay, { relativeTo: repeatedHourDay })}`, 'P2D');
        equal(`${oneDay.add(hours25, { relativeTo: repeatedHourDay })}`, 'P2DT1H');
      });
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-04T00:00[America/Vancouver]');
        equal(`${hours25.negated().add(oneDay.negated(), { relativeTo })}`, '-P2D');
        equal(`${oneDay.negated().add(hours25.negated(), { relativeTo })}`, '-P2DT1H');
      });
      it('start before repeated hour, end <1 day after', () => {
        equal(`${hours12.add(oneDay, { relativeTo: repeatedHourDay })}`, 'P1DT11H');
        equal(`${oneDay.add(hours12, { relativeTo: repeatedHourDay })}`, 'P1DT12H');
      });
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-03T12:00[America/Vancouver]');
        equal(`${hours12.negated().add(oneDay.negated(), { relativeTo })}`, '-P1DT11H');
        equal(`${oneDay.negated().add(hours12.negated(), { relativeTo })}`, '-P1DT12H');
      });
      it('Samoa skipped 24 hours', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2011-12-29T12:00-10:00[Pacific/Apia]');
        equal(`${hours25.add(oneDay, { relativeTo })}`, 'P3DT1H');
        equal(`${oneDay.add(hours25, { relativeTo })}`, 'P3DT1H');
      });
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(`${oneDay.add(hours24, { relativeTo: '2019-11-02T00:00[America/Vancouver]' })}`, 'P1DT24H');
      equal(
        `${oneDay.add(hours24, { relativeTo: { year: 2019, month: 11, day: 2, timeZone: 'America/Vancouver' } })}`,
        'P1DT24H'
      );
    });
    it('casts relativeTo to PlainDateTime if possible', () => {
      equal(`${oneDay.add(hours24, { relativeTo: '2019-11-02T00:00' })}`, 'P2D');
      equal(`${oneDay.add(hours24, { relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'P2D');
    });
    it('at least the required properties must be present in relativeTo', () => {
      throws(() => oneDay.add(hours24, { relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => oneDay.add(hours24, { relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => oneDay.add(hours24, { relativeTo: { year: 2019, day: 3 } }), TypeError);
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
      equal(`${Duration.from('P3DT55M').subtract({ minutes: -15 })}`, 'P3DT1H10M');
      equal(`${Duration.from('P3DT1H9M30S').subtract({ seconds: -30 })}`, 'P3DT1H10M');
    });
    it('balances positive units up to the largest nonzero unit', () => {
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
      const result = d.subtract(less);
      equal(result.minutes, 91);
      equal(result.seconds, 31);
      equal(result.milliseconds, 501);
      equal(result.microseconds, 501);
      equal(result.nanoseconds, 500);
    });
    const tenDays = Duration.from('P10D');
    const tenMinutes = Duration.from('PT10M');
    it('has correct negative result', () => {
      let result = tenDays.subtract({ days: 15 });
      equal(result.days, -5);
      result = tenMinutes.subtract({ minutes: 15 });
      equal(result.minutes, -5);
    });
    it('balances correctly if subtracting different units flips the overall sign', () => {
      const d1 = Duration.from({ hours: 1, seconds: 60 });
      equal(`${d1.subtract({ minutes: 122 })}`, '-PT1H1M');
      const d2 = Duration.from({ hours: 1, seconds: 3721 });
      equal(`${d2.subtract({ minutes: 61, nanoseconds: 3722000000001 })}`, '-PT1M1.000000001S');
    });
    it('mixed positive and negative values always throw', () => {
      throws(() => duration.subtract({ hours: 1, minutes: -30 }), RangeError);
    });
    it('relativeTo required for years, months, and weeks', () => {
      const d = Duration.from({ hours: 1 });
      const dy = Duration.from({ years: 1, hours: 1 });
      const dm = Duration.from({ months: 1, hours: 1 });
      const dw = Duration.from({ weeks: 1, hours: 1 });
      throws(() => d.subtract(dy), RangeError);
      throws(() => d.subtract(dm), RangeError);
      throws(() => d.subtract(dw), RangeError);
      throws(() => dy.subtract(d), RangeError);
      throws(() => dm.subtract(d), RangeError);
      throws(() => dw.subtract(d), RangeError);
      const relativeTo = Temporal.PlainDateTime.from('2000-01-01');
      equal(`${d.subtract(dy, { relativeTo })}`, '-P1Y');
      equal(`${d.subtract(dm, { relativeTo })}`, '-P1M');
      equal(`${d.subtract(dw, { relativeTo })}`, '-P1W');
      equal(`${dy.subtract(d, { relativeTo })}`, 'P1Y');
      equal(`${dm.subtract(d, { relativeTo })}`, 'P1M');
      equal(`${dw.subtract(d, { relativeTo })}`, 'P1W');
    });
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        throws(() => duration.subtract({ hours: 1 }, badOptions), TypeError)
      );
      [{}, () => {}, undefined].forEach((options) => equal(duration.subtract({ hours: 1 }, options).hours, 0));
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => duration.subtract({}), TypeError);
      throws(() => duration.subtract({ month: 12 }), TypeError);
    });
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${duration.subtract({ month: 1, days: 1 })}`, 'P2DT1H10M');
    });
    it('casts argument', () => {
      equal(`${duration.subtract(Temporal.Duration.from('P1DT5M'))}`, 'P2DT1H5M');
      equal(`${duration.subtract('P1DT5M')}`, 'P2DT1H5M');
    });
    it('relativeTo affects year length', () => {
      const oneYear = new Duration(1);
      const days365 = new Duration(0, 0, 0, 365);
      equal(`${oneYear.subtract(days365, { relativeTo: Temporal.PlainDateTime.from('2017-01-01') })}`, 'PT0S');
      equal(`${oneYear.subtract(days365, { relativeTo: Temporal.PlainDateTime.from('2016-01-01') })}`, 'P1D');
    });
    it('relativeTo affects month length', () => {
      const oneMonth = new Duration(0, 1);
      const days30 = new Duration(0, 0, 0, 30);
      equal(`${oneMonth.subtract(days30, { relativeTo: Temporal.PlainDateTime.from('2018-02-01') })}`, '-P2D');
      equal(`${oneMonth.subtract(days30, { relativeTo: Temporal.PlainDateTime.from('2018-03-01') })}`, 'P1D');
      equal(`${oneMonth.subtract(days30, { relativeTo: Temporal.PlainDateTime.from('2018-04-01') })}`, 'PT0S');
    });
    it('first this is resolved against relativeTo, then the argument against relativeTo + this', () => {
      const d1 = new Duration(0, 2, 1, 4);
      const d2 = new Duration(0, 1, 1, 1);
      const relativeTo = new Temporal.PlainDateTime(2000, 1, 1);
      equal(`${d1.subtract(d2, { relativeTo })}`, 'P1M3D');
    });
    const oneDay = new Duration(0, 0, 0, 1);
    const hours24 = new Duration(0, 0, 0, 0, 24);
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      equal(`${oneDay.subtract(hours24, { relativeTo })}`, 'PT0S');
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${oneDay.subtract(hours24, { relativeTo })}`, 'PT0S');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const twoDays = new Duration(0, 0, 0, 2);
    const threeDays = new Duration(0, 0, 0, 3);
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        equal(`${hours24.subtract(oneDay, { relativeTo: inRepeatedHour })}`, '-PT1H');
        equal(`${oneDay.subtract(hours24, { relativeTo: inRepeatedHour })}`, 'PT1H');
      });
      it('start inside repeated hour, end in skipped hour', () => {
        equal(`${Duration.from({ days: 127, hours: 1 }).subtract(oneDay, { relativeTo: inRepeatedHour })}`, 'P126DT1H');
        equal(`${Duration.from({ days: 127, hours: 1 }).subtract(hours24, { relativeTo: inRepeatedHour })}`, 'P126D');
      });
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-09T02:30[America/Vancouver]');
        equal(`${hours24.subtract(oneDay, { relativeTo })}`, 'PT1H');
        equal(`${oneDay.subtract(hours24, { relativeTo })}`, 'PT0S');
      });
      it('start before skipped hour, end >1 day after', () => {
        equal(`${threeDays.subtract(hours24, { relativeTo: skippedHourDay })}`, 'P2D');
        equal(`${hours24.subtract(threeDays, { relativeTo: skippedHourDay })}`, '-P1DT23H');
      });
      it('start before skipped hour, end <1 day after', () => {
        equal(`${twoDays.subtract(hours24, { relativeTo: skippedHourDay })}`, 'P1D');
        equal(`${hours24.subtract(twoDays, { relativeTo: skippedHourDay })}`, '-PT23H');
      });
      it('start before repeated hour, end >1 day after', () => {
        equal(`${threeDays.subtract(hours24, { relativeTo: repeatedHourDay })}`, 'P2D');
        equal(`${hours24.subtract(threeDays, { relativeTo: repeatedHourDay })}`, '-P2DT1H');
      });
      it('start before repeated hour, end <1 day after', () => {
        equal(`${twoDays.subtract(hours24, { relativeTo: repeatedHourDay })}`, 'P1D');
        equal(`${hours24.subtract(twoDays, { relativeTo: repeatedHourDay })}`, '-P1DT1H');
      });
      it('Samoa skipped 24 hours', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2011-12-29T12:00-10:00[Pacific/Apia]');
        equal(`${twoDays.subtract(Duration.from({ hours: 48 }), { relativeTo })}`, '-P1D');
        equal(`${Duration.from({ hours: 48 }).subtract(twoDays, { relativeTo })}`, 'P2D');
      });
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(`${oneDay.subtract(hours24, { relativeTo: '2019-11-03T00:00[America/Vancouver]' })}`, 'PT1H');
      equal(
        `${oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' } })}`,
        'PT1H'
      );
    });
    it('casts relativeTo to PlainDateTime if possible', () => {
      equal(`${oneDay.subtract(hours24, { relativeTo: '2019-11-02T00:00' })}`, 'PT0S');
      equal(`${oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'PT0S');
    });
    it('at least the required properties must be present in relativeTo', () => {
      throws(() => oneDay.subtract(hours24, { relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => oneDay.subtract(hours24, { relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
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
  describe('Duration.blank', () => {
    it('works', () => {
      assert(!Duration.from('P3DT1H').blank);
      assert(!Duration.from('-PT2H20M30S').blank);
      assert(Duration.from('PT0S').blank);
    });
    it('zero regardless of how many fields are in the duration', () => {
      const zero = Duration.from({
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        microseconds: 0,
        nanoseconds: 0
      });
      assert(zero.blank);
    });
  });
  describe('Duration.round()', () => {
    const d = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const d2 = new Duration(0, 0, 0, 5, 5, 5, 5, 5, 5, 5);
    const relativeTo = Temporal.PlainDateTime.from('2020-01-01T00:00');
    it('options may only be an object', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) => throws(() => d.round(badOptions), TypeError));
    });
    it('throws without parameter', () => {
      throws(() => d.round(), TypeError);
    });
    it('throws with empty object', () => {
      throws(() => d.round({}), RangeError);
    });
    it("succeeds with largestUnit: 'auto'", () => {
      equal(`${Duration.from({ hours: 25 }).round({ largestUnit: 'auto' })}`, 'PT25H');
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
    const hours25 = new Duration(0, 0, 0, 0, 25);
    it('days are 24 hours if relativeTo not given', () => {
      equal(`${hours25.round({ largestUnit: 'days' })}`, 'P1DT1H');
    });
    it('days are 24 hours if relativeTo is PlainDateTime', () => {
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P1DT1H');
    });
    it('days are 24 hours if relativeTo is ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P1DT1H');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const oneDay = new Duration(0, 0, 0, 1);
    const hours12 = new Duration(0, 0, 0, 0, 12);
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        equal(`${hours25.round({ largestUnit: 'days', relativeTo: inRepeatedHour })}`, 'P1D');
        equal(`${oneDay.round({ largestUnit: 'hours', relativeTo: inRepeatedHour })}`, 'PT25H');
      });
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-04T01:00[America/Vancouver]');
        equal(`${hours25.negated().round({ largestUnit: 'days', relativeTo })}`, '-P1D');
        equal(`${oneDay.negated().round({ largestUnit: 'hours', relativeTo })}`, '-PT25H');
      });
      it('start inside repeated hour, end in skipped hour', () => {
        equal(
          `${Duration.from({ days: 126, hours: 1 }).round({ largestUnit: 'days', relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        );
        equal(
          `${Duration.from({ days: 126, hours: 1 }).round({ largestUnit: 'hours', relativeTo: inRepeatedHour })}`,
          'PT3026H'
        );
      });
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-09T02:30[America/Vancouver]');
        equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P1DT1H');
        equal(`${oneDay.round({ largestUnit: 'hours', relativeTo })}`, 'PT24H');
      });
      it('start before skipped hour, end >1 day after', () => {
        equal(`${hours25.round({ largestUnit: 'days', relativeTo: skippedHourDay })}`, 'P1DT2H');
        equal(`${oneDay.round({ largestUnit: 'hours', relativeTo: skippedHourDay })}`, 'PT23H');
      });
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-11T00:00[America/Vancouver]');
        equal(`${hours25.negated().round({ largestUnit: 'days', relativeTo })}`, '-P1DT2H');
        equal(`${oneDay.negated().round({ largestUnit: 'hours', relativeTo })}`, '-PT23H');
      });
      it('start before skipped hour, end <1 day after', () => {
        equal(`${hours12.round({ largestUnit: 'days', relativeTo: skippedHourDay })}`, 'PT12H');
      });
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-10T12:00[America/Vancouver]');
        equal(`${hours12.negated().round({ largestUnit: 'days', relativeTo })}`, '-PT12H');
      });
      it('start before repeated hour, end >1 day after', () => {
        equal(`${hours25.round({ largestUnit: 'days', relativeTo: repeatedHourDay })}`, 'P1D');
        equal(`${oneDay.round({ largestUnit: 'hours', relativeTo: repeatedHourDay })}`, 'PT25H');
      });
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-04T00:00[America/Vancouver]');
        equal(`${hours25.negated().round({ largestUnit: 'days', relativeTo })}`, '-P1D');
        equal(`${oneDay.negated().round({ largestUnit: 'hours', relativeTo })}`, '-PT25H');
      });
      it('start before repeated hour, end <1 day after', () => {
        equal(`${hours12.round({ largestUnit: 'days', relativeTo: repeatedHourDay })}`, 'PT12H');
      });
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-03T12:00[America/Vancouver]');
        equal(`${hours12.negated().round({ largestUnit: 'days', relativeTo })}`, '-PT12H');
      });
      it('Samoa skipped 24 hours', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2011-12-29T12:00-10:00[Pacific/Apia]');
        equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P2DT1H');
        equal(`${Duration.from({ hours: 48 }).round({ largestUnit: 'days', relativeTo })}`, 'P3D');
      });
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(`${hours25.round({ largestUnit: 'days', relativeTo: '2019-11-03T00:00[America/Vancouver]' })}`, 'P1D');
      equal(
        `${hours25.round({
          largestUnit: 'days',
          relativeTo: { year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' }
        })}`,
        'P1D'
      );
    });
    it('casts relativeTo to PlainDateTime if possible', () => {
      equal(`${hours25.round({ largestUnit: 'days', relativeTo: '2019-11-02T00:00' })}`, 'P1DT1H');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'P1DT1H');
    });
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ['2020-01-01', '2020-01-01T00:00:00.000000000', 20200101, 20200101n, { year: 2020, month: 1, day: 1 }].forEach(
        (relativeTo) => {
          equal(`${d.round({ smallestUnit: 'seconds', relativeTo })}`, 'P5Y5M5W5DT5H5M5S');
        }
      );
    });
    it("throws on relativeTo that can't be converted to datetime string", () => {
      throws(() => d.round({ smallestUnit: 'seconds', relativeTo: Symbol('foo') }), TypeError);
    });
    it('throws on relativeTo that converts to an invalid datetime string', () => {
      [3.14, true, null, 'hello', 1n].forEach((relativeTo) => {
        throws(() => d.round({ smallestUnit: 'seconds', relativeTo }), RangeError);
      });
    });
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = Duration.from({ months: 1 });
      equal(
        `${oneMonth.round({ largestUnit: 'days', relativeTo: { year: 2020, month: 1, day: 1, months: 2 } })}`,
        'P31D'
      );
    });
    it('throws on invalid roundingMode', () => {
      throws(() => d2.round({ smallestUnit: 'nanoseconds', roundingMode: 'cile' }), RangeError);
    });
    it('throws if neither one of largestUnit or smallestUnit is given', () => {
      const hoursOnly = new Duration(0, 0, 0, 0, 1);
      [{}, () => {}, { roundingMode: 'ceil' }].forEach((options) => {
        throws(() => d.round(options), RangeError);
        throws(() => hoursOnly.round(options), RangeError);
      });
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
      halfExpand: ['P6Y', '-P6Y'],
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
    it('halfExpand is the default', () => {
      equal(`${d.round({ smallestUnit: 'years', relativeTo })}`, 'P6Y');
      equal(`${d.negated().round({ smallestUnit: 'years', relativeTo })}`, '-P6Y');
    });
    it('balances up differently depending on relativeTo', () => {
      const fortyDays = Duration.from({ days: 40 });
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-01-01' })}`, 'P1M9D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-02-01' })}`, 'P1M11D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-03-01' })}`, 'P1M9D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-04-01' })}`, 'P1M10D');
      const minusForty = Duration.from({ days: -40 });
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-02-01' })}`, '-P1M9D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-01-01' })}`, '-P1M9D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-03-01' })}`, '-P1M11D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-04-01' })}`, '-P1M9D');
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
    it('balances down differently depending on relativeTo', () => {
      const oneYear = Duration.from({ years: 1 });
      equal(`${oneYear.round({ largestUnit: 'days', relativeTo: '2019-01-01' })}`, 'P365D');
      equal(`${oneYear.round({ largestUnit: 'days', relativeTo: '2019-07-01' })}`, 'P366D');
      const minusYear = Duration.from({ years: -1 });
      equal(`${minusYear.round({ largestUnit: 'days', relativeTo: '2020-01-01' })}`, '-P365D');
      equal(`${minusYear.round({ largestUnit: 'days', relativeTo: '2020-07-01' })}`, '-P366D');
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
      equal(`${d.round({ smallestUnit: 'milliseconds', roundingIncrement: 10, relativeTo })}`, 'P5Y5M5W5DT5H5M5.01S');
    });
    it('rounds to an increment of microseconds', () => {
      equal(
        `${d.round({ smallestUnit: 'microseconds', roundingIncrement: 10, relativeTo })}`,
        'P5Y5M5W5DT5H5M5.00501S'
      );
    });
    it('rounds to an increment of nanoseconds', () => {
      equal(
        `${d.round({ smallestUnit: 'nanoseconds', roundingIncrement: 10, relativeTo })}`,
        'P5Y5M5W5DT5H5M5.00500501S'
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
      equal(`${d.round({ largestUnit: 'year', relativeTo })}`, `${d.round({ largestUnit: 'years', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'year', relativeTo })}`, `${d.round({ smallestUnit: 'years', relativeTo })}`);
      equal(`${d.round({ largestUnit: 'month', relativeTo })}`, `${d.round({ largestUnit: 'months', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'month', relativeTo })}`, `${d.round({ smallestUnit: 'months', relativeTo })}`);
      equal(`${d.round({ largestUnit: 'day', relativeTo })}`, `${d.round({ largestUnit: 'days', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'day', relativeTo })}`, `${d.round({ smallestUnit: 'days', relativeTo })}`);
      equal(`${d.round({ largestUnit: 'hour', relativeTo })}`, `${d.round({ largestUnit: 'hours', relativeTo })}`);
      equal(`${d.round({ smallestUnit: 'hour', relativeTo })}`, `${d.round({ smallestUnit: 'hours', relativeTo })}`);
      equal(`${d.round({ largestUnit: 'minute', relativeTo })}`, `${d.round({ largestUnit: 'minutes', relativeTo })}`);
      equal(
        `${d.round({ smallestUnit: 'minute', relativeTo })}`,
        `${d.round({ smallestUnit: 'minutes', relativeTo })}`
      );
      equal(`${d.round({ largestUnit: 'second', relativeTo })}`, `${d.round({ largestUnit: 'seconds', relativeTo })}`);
      equal(
        `${d.round({ smallestUnit: 'second', relativeTo })}`,
        `${d.round({ smallestUnit: 'seconds', relativeTo })}`
      );
      equal(
        `${d.round({ largestUnit: 'millisecond', relativeTo })}`,
        `${d.round({ largestUnit: 'milliseconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'millisecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'milliseconds', relativeTo })}`
      );
      equal(
        `${d.round({ largestUnit: 'microsecond', relativeTo })}`,
        `${d.round({ largestUnit: 'microseconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'microsecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'microseconds', relativeTo })}`
      );
      equal(
        `${d.round({ largestUnit: 'nanosecond', relativeTo })}`,
        `${d.round({ largestUnit: 'nanoseconds', relativeTo })}`
      );
      equal(
        `${d.round({ smallestUnit: 'nanosecond', relativeTo })}`,
        `${d.round({ smallestUnit: 'nanoseconds', relativeTo })}`
      );
    });
    it('counts the correct number of days when rounding relative to a date', () => {
      const days = Duration.from({ days: 45 });
      equal(`${days.round({ relativeTo: '2019-01-01', smallestUnit: 'months' })}`, 'P2M');
      equal(`${days.negated().round({ relativeTo: '2019-02-15', smallestUnit: 'months' })}`, '-P1M');
      const yearAndHalf = Duration.from({ days: 547, hours: 12 });
      equal(`${yearAndHalf.round({ relativeTo: '2018-01-01', smallestUnit: 'years' })}`, 'P2Y');
      equal(`${yearAndHalf.round({ relativeTo: '2018-07-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2019-01-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2019-07-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2020-01-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2020-07-01', smallestUnit: 'years' })}`, 'P2Y');
    });
  });
  describe('Duration.total()', () => {
    const d = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const d2 = new Duration(0, 0, 0, 5, 5, 5, 5, 5, 5, 5);
    const relativeTo = Temporal.PlainDateTime.from('2020-01-01T00:00');
    it('options may only be an object', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) => throws(() => d.total(badOptions), TypeError));
    });
    it('throws on disallowed or invalid smallestUnit', () => {
      ['era', 'nonsense'].forEach((unit) => {
        throws(() => d.total({ unit }), RangeError);
      });
    });
    it('does not lose precision for seconds and smaller units', () => {
      const s = Temporal.Duration.from({ milliseconds: 2, microseconds: 31 }).total({ unit: 'seconds' });
      equal(s, 0.002031);
    });
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ['2020-01-01', '2020-01-01T00:00:00.000000000', 20200101, 20200101n, { year: 2020, month: 1, day: 1 }].forEach(
        (relativeTo) => {
          const daysPastJuly1 = 5 * 7 + 5 - 30; // 5 weeks + 5 days - 30 days in June
          const partialDayNanos =
            d.hours * 3.6e12 +
            d.minutes * 6e10 +
            d.seconds * 1e9 +
            d.milliseconds * 1e6 +
            d.microseconds * 1e3 +
            d.nanoseconds;
          const partialDay = partialDayNanos / (3.6e12 * 24);
          const partialMonth = (daysPastJuly1 + partialDay) / 31;
          const totalMonths = 5 * 12 + 5 + 1 + partialMonth; // +1 for 5 weeks
          const total = d.total({ unit: 'months', relativeTo });
          equal(total.toPrecision(15), totalMonths.toPrecision(15)); // 66.32930780242619
        }
      );
    });
    it("throws on relativeTo that can't be converted to datetime string", () => {
      throws(() => d.total({ unit: 'months', relativeTo: Symbol('foo') }), TypeError);
    });
    it('throws on relativeTo that converts to an invalid datetime string', () => {
      [3.14, true, null, 'hello', 1n].forEach((relativeTo) => {
        throws(() => d.total({ unit: 'months', relativeTo }), RangeError);
      });
    });
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      throws(() => d.total({ unit: 'months', relativeTo: {} }), TypeError);
      throws(() => d.total({ unit: 'months', relativeTo: { years: 2020, month: 1, day: 1 } }), TypeError);
    });
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = Duration.from({ months: 1 });
      equal(oneMonth.total({ unit: 'months', relativeTo: { year: 2020, month: 1, day: 1, months: 2 } }), 1);
    });
    it('throws if unit is missing', () => {
      [undefined, {}, () => {}, { roundingMode: 'ceil' }].forEach((options) =>
        throws(() => d.total(options), RangeError)
      );
    });
    it('relativeTo is required for rounding calendar units even in durations without calendar units', () => {
      throws(() => d2.total({ unit: 'years' }), RangeError);
      throws(() => d2.total({ unit: 'months' }), RangeError);
      throws(() => d2.total({ unit: 'weeks' }), RangeError);
    });
    it('relativeTo is required for rounding durations with calendar units', () => {
      throws(() => d.total({ unit: 'years' }), RangeError);
      throws(() => d.total({ unit: 'months' }), RangeError);
      throws(() => d.total({ unit: 'weeks' }), RangeError);
      throws(() => d.total({ unit: 'days' }), RangeError);
      throws(() => d.total({ unit: 'hours' }), RangeError);
      throws(() => d.total({ unit: 'minutes' }), RangeError);
      throws(() => d.total({ unit: 'seconds' }), RangeError);
      throws(() => d.total({ unit: 'milliseconds' }), RangeError);
      throws(() => d.total({ unit: 'microseconds' }), RangeError);
      throws(() => d.total({ unit: 'nanoseconds' }), RangeError);
    });
    const d2Nanoseconds =
      d2.days * 24 * 3.6e12 +
      d2.hours * 3.6e12 +
      d2.minutes * 6e10 +
      d2.seconds * 1e9 +
      d2.milliseconds * 1e6 +
      d2.microseconds * 1e3 +
      d2.nanoseconds;
    const totalD2 = {
      days: d2Nanoseconds / (24 * 3.6e12),
      hours: d2Nanoseconds / 3.6e12,
      minutes: d2Nanoseconds / 6e10,
      seconds: d2Nanoseconds / 1e9,
      milliseconds: d2Nanoseconds / 1e6,
      microseconds: d2Nanoseconds / 1e3,
      nanoseconds: d2Nanoseconds
    };
    it('relativeTo not required to round fixed-length units in durations without variable units', () => {
      assert(Math.abs(d2.total({ unit: 'days' }) - totalD2.days) < Number.EPSILON);
      assert(Math.abs(d2.total({ unit: 'hours' }) - totalD2.hours) < Number.EPSILON);
      assert(Math.abs(d2.total({ unit: 'minutes' }) - totalD2.minutes) < Number.EPSILON);
      assert(Math.abs(d2.total({ unit: 'seconds' }) - totalD2.seconds) < Number.EPSILON);
      assert(Math.abs(d2.total({ unit: 'milliseconds' }) - totalD2.milliseconds) < Number.EPSILON);
      assert(Math.abs(d2.total({ unit: 'microseconds' }) - totalD2.microseconds) < Number.EPSILON);
      equal(d2.total({ unit: 'nanoseconds' }), totalD2.nanoseconds);
    });
    it('relativeTo not required to round fixed-length units in durations without variable units (negative)', () => {
      const negativeD2 = d2.negated();
      assert(Math.abs(negativeD2.total({ unit: 'days' }) - -totalD2.days) < Number.EPSILON);
      assert(Math.abs(negativeD2.total({ unit: 'hours' }) - -totalD2.hours) < Number.EPSILON);
      assert(Math.abs(negativeD2.total({ unit: 'minutes' }) - -totalD2.minutes) < Number.EPSILON);
      assert(Math.abs(negativeD2.total({ unit: 'seconds' }) - -totalD2.seconds) < Number.EPSILON);
      assert(Math.abs(negativeD2.total({ unit: 'milliseconds' }) - -totalD2.milliseconds) < Number.EPSILON);
      assert(Math.abs(negativeD2.total({ unit: 'microseconds' }) - -totalD2.microseconds) < Number.EPSILON);
      equal(negativeD2.total({ unit: 'nanoseconds' }), -totalD2.nanoseconds);
    });

    const endpoint = relativeTo.add(d);
    const options = (unit) => ({ largestUnit: unit, smallestUnit: unit, roundingMode: 'trunc' });
    const fullYears = 5;
    const fullDays = endpoint.since(relativeTo, options('days')).days;
    const fullMilliseconds = endpoint.since(relativeTo, options('milliseconds')).milliseconds;
    const partialDayMilliseconds = fullMilliseconds - fullDays * 24 * 3.6e6 + 0.005005;
    const fractionalDay = partialDayMilliseconds / (24 * 3.6e6);
    const partialYearDays = fullDays - (fullYears * 365 + 2);
    const fractionalYear = partialYearDays / 365 + fractionalDay / 365; // split to avoid precision loss
    const fractionalMonths = ((endpoint.day - 1) * (24 * 3.6e6) + partialDayMilliseconds) / (31 * 24 * 3.6e6);

    const totalResults = {
      years: fullYears + fractionalYear,
      months: 66 + fractionalMonths,
      weeks: (fullDays + fractionalDay) / 7,
      days: fullDays + fractionalDay,
      hours: fullDays * 24 + partialDayMilliseconds / 3.6e6,
      minutes: fullDays * 24 * 60 + partialDayMilliseconds / 60000,
      seconds: fullDays * 24 * 60 * 60 + partialDayMilliseconds / 1000,
      milliseconds: fullMilliseconds + 0.005005,
      microseconds: fullMilliseconds * 1000 + 5.005,
      nanoseconds: fullMilliseconds * 1e6 + 5005
    };
    for (const [unit, expected] of Object.entries(totalResults)) {
      it(`total(${unit}) = ${expected}`, () => {
        // Computed values above are approximate due to accumulated floating point
        // rounding errors, so just comparing the first 15 digits is good enough.
        equal(d.total({ unit, relativeTo }).toPrecision(15), expected.toPrecision(15));
      });
    }
    for (const unit of ['microseconds', 'nanoseconds']) {
      it(`total(${unit}) may lose precision below ms`, () => {
        assert(d.total({ unit, relativeTo }).toString().startsWith('174373505005'));
      });
    }
    it('balances differently depending on relativeTo', () => {
      const fortyDays = Duration.from({ days: 40 });
      equal(
        fortyDays.total({ unit: 'months', relativeTo: '2020-02-01' }).toPrecision(16),
        (1 + 11 / 31).toPrecision(16)
      );
      equal(
        fortyDays.total({ unit: 'months', relativeTo: '2020-01-01' }).toPrecision(16),
        (1 + 9 / 29).toPrecision(16)
      );
    });
    it('balances differently depending on relativeTo (negative)', () => {
      const negativeFortyDays = Duration.from({ days: -40 });
      equal(
        negativeFortyDays.total({ unit: 'months', relativeTo: '2020-03-01' }).toPrecision(16),
        (-(1 + 11 / 31)).toPrecision(16)
      );
      equal(
        negativeFortyDays.total({ unit: 'months', relativeTo: '2020-04-01' }).toPrecision(16),
        (-(1 + 9 / 29)).toPrecision(16)
      );
    });
    const oneDay = new Duration(0, 0, 0, 1);
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      equal(oneDay.total({ unit: 'hours', relativeTo }), 24);
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(oneDay.total({ unit: 'hours', relativeTo }), 24);
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const hours12 = new Duration(0, 0, 0, 0, 12);
    const hours25 = new Duration(0, 0, 0, 0, 25);
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        equal(hours25.total({ unit: 'days', relativeTo: inRepeatedHour }), 1);
        equal(oneDay.total({ unit: 'hours', relativeTo: inRepeatedHour }), 25);
      });
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-04T01:00[America/Vancouver]');
        equal(hours25.negated().total({ unit: 'days', relativeTo }), -1);
        equal(oneDay.negated().total({ unit: 'hours', relativeTo }), -25);
      });
      it('start inside repeated hour, end in skipped hour', () => {
        const totalDays = Duration.from({ days: 126, hours: 1 }).total({ unit: 'days', relativeTo: inRepeatedHour });
        assert(Math.abs(totalDays - (126 + 1 / 23)) < Number.EPSILON);
        equal(Duration.from({ days: 126, hours: 1 }).total({ unit: 'hours', relativeTo: inRepeatedHour }), 3026);
      });
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-09T02:30[America/Vancouver]');
        const totalDays = hours25.total({ unit: 'days', relativeTo });
        assert(Math.abs(totalDays - (1 + 1 / 24)) < Number.EPSILON);
        equal(oneDay.total({ unit: 'hours', relativeTo }), 24);
      });
      it('start before skipped hour, end >1 day after', () => {
        const totalDays = hours25.total({ unit: 'days', relativeTo: skippedHourDay });
        assert(Math.abs(totalDays - (1 + 2 / 24)) < Number.EPSILON);
        equal(oneDay.total({ unit: 'hours', relativeTo: skippedHourDay }), 23);
      });
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-11T00:00[America/Vancouver]');
        const totalDays = hours25.negated().total({ unit: 'days', relativeTo });
        assert(Math.abs(totalDays - (-1 - 2 / 24)) < Number.EPSILON);
        equal(oneDay.negated().total({ unit: 'hours', relativeTo }), -23);
      });
      it('start before skipped hour, end <1 day after', () => {
        const totalDays = hours12.total({ unit: 'days', relativeTo: skippedHourDay });
        assert(Math.abs(totalDays - 12 / 23) < Number.EPSILON);
      });
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-03-10T12:00[America/Vancouver]');
        const totalDays = hours12.negated().total({ unit: 'days', relativeTo });
        assert(Math.abs(totalDays - -12 / 23) < Number.EPSILON);
      });
      it('start before repeated hour, end >1 day after', () => {
        equal(hours25.total({ unit: 'days', relativeTo: repeatedHourDay }), 1);
        equal(oneDay.total({ unit: 'hours', relativeTo: repeatedHourDay }), 25);
      });
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-04T00:00[America/Vancouver]');
        equal(hours25.negated().total({ unit: 'days', relativeTo }), -1);
        equal(oneDay.negated().total({ unit: 'hours', relativeTo }), -25);
      });
      it('start before repeated hour, end <1 day after', () => {
        const totalDays = hours12.total({ unit: 'days', relativeTo: repeatedHourDay });
        assert(Math.abs(totalDays - 12 / 25) < Number.EPSILON);
      });
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2019-11-03T12:00[America/Vancouver]');
        const totalDays = hours12.negated().total({ unit: 'days', relativeTo });
        assert(Math.abs(totalDays - -12 / 25) < Number.EPSILON);
      });
      it('Samoa skipped 24 hours', () => {
        const relativeTo = Temporal.ZonedDateTime.from('2011-12-29T12:00-10:00[Pacific/Apia]');
        const totalDays = hours25.total({ unit: 'days', relativeTo });
        assert(Math.abs(totalDays - (2 + 1 / 24)) < Number.EPSILON);
        equal(Duration.from({ hours: 48 }).total({ unit: 'days', relativeTo }), 3);
        equal(Duration.from({ days: 2 }).total({ unit: 'hours', relativeTo }), 24);
        equal(Duration.from({ days: 3 }).total({ unit: 'hours', relativeTo }), 48);
      });
    });
    it('totaling back up to days', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2019-11-02T00:00[America/Vancouver]');
      equal(Duration.from({ hours: 48 }).total({ unit: 'days' }), 2);
      const totalDays = Duration.from({ hours: 48 }).total({ unit: 'days', relativeTo });
      assert(Math.abs(totalDays - (1 + 24 / 25)) < Number.EPSILON);
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(oneDay.total({ unit: 'hours', relativeTo: '2019-11-03T00:00[America/Vancouver]' }), 25);
      equal(
        oneDay.total({ unit: 'hours', relativeTo: { year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' } }),
        25
      );
    });
    it('balances up to the next unit after rounding', () => {
      const almostWeek = Duration.from({ days: 6, hours: 20 });
      const totalWeeks = almostWeek.total({ unit: 'weeks', relativeTo: '2020-01-01' });
      assert(Math.abs(totalWeeks - (6 + 20 / 24) / 7) < Number.EPSILON);
    });
    it('balances up to the next unit after rounding (negative)', () => {
      const almostWeek = Duration.from({ days: -6, hours: -20 });
      const totalWeeks = almostWeek.total({ unit: 'weeks', relativeTo: '2020-01-01' });
      assert(Math.abs(totalWeeks - -((6 + 20 / 24) / 7)) < Number.EPSILON);
    });
    it('balances days up to both years and months', () => {
      const twoYears = Duration.from({ months: 11, days: 396 });
      equal(twoYears.total({ unit: 'years', relativeTo: '2017-01-01' }), 2);
    });
    it('balances days up to both years and months (negative)', () => {
      const twoYears = Duration.from({ months: -11, days: -396 });
      equal(twoYears.total({ unit: 'years', relativeTo: '2017-01-01' }), -2);
    });
    it('accepts singular units', () => {
      equal(d.total({ unit: 'year', relativeTo }), d.total({ unit: 'years', relativeTo }));
      equal(d.total({ unit: 'month', relativeTo }), d.total({ unit: 'months', relativeTo }));
      equal(d.total({ unit: 'day', relativeTo }), d.total({ unit: 'days', relativeTo }));
      equal(d.total({ unit: 'hour', relativeTo }), d.total({ unit: 'hours', relativeTo }));
      equal(d.total({ unit: 'minute', relativeTo }), d.total({ unit: 'minutes', relativeTo }));
      equal(d.total({ unit: 'second', relativeTo }), d.total({ unit: 'seconds', relativeTo }));
      equal(d.total({ unit: 'second', relativeTo }), d.total({ unit: 'seconds', relativeTo }));
      equal(d.total({ unit: 'millisecond', relativeTo }), d.total({ unit: 'milliseconds', relativeTo }));
      equal(d.total({ unit: 'microsecond', relativeTo }), d.total({ unit: 'microseconds', relativeTo }));
      equal(d.total({ unit: 'nanosecond', relativeTo }), d.total({ unit: 'nanoseconds', relativeTo }));
    });
  });
  describe('Duration.compare', () => {
    describe('time units only', () => {
      const d1 = new Duration(0, 0, 0, 0, 5, 5, 5, 5, 5, 5);
      const d2 = new Duration(0, 0, 0, 0, 5, 4, 5, 5, 5, 5);
      it('equal', () => equal(Duration.compare(d1, d1), 0));
      it('smaller/larger', () => equal(Duration.compare(d2, d1), -1));
      it('larger/smaller', () => equal(Duration.compare(d1, d2), 1));
      it('negative/negative equal', () => equal(Duration.compare(d1.negated(), d1.negated()), 0));
      it('negative/negative smaller/larger', () => equal(Duration.compare(d2.negated(), d1.negated()), 1));
      it('negative/negative larger/smaller', () => equal(Duration.compare(d1.negated(), d2.negated()), -1));
      it('negative/positive', () => equal(Duration.compare(d1.negated(), d2), -1));
      it('positive/negative', () => equal(Duration.compare(d1, d2.negated()), 1));
    });
    describe('date units', () => {
      const d1 = new Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
      const d2 = new Duration(5, 5, 5, 5, 5, 4, 5, 5, 5, 5);
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      it('relativeTo is required', () => throws(() => Duration.compare(d1, d2)), RangeError);
      it('equal', () => equal(Duration.compare(d1, d1, { relativeTo }), 0));
      it('smaller/larger', () => equal(Duration.compare(d2, d1, { relativeTo }), -1));
      it('larger/smaller', () => equal(Duration.compare(d1, d2, { relativeTo }), 1));
      it('negative/negative equal', () => equal(Duration.compare(d1.negated(), d1.negated(), { relativeTo }), 0));
      it('negative/negative smaller/larger', () =>
        equal(Duration.compare(d2.negated(), d1.negated(), { relativeTo }), 1));
      it('negative/negative larger/smaller', () =>
        equal(Duration.compare(d1.negated(), d2.negated(), { relativeTo }), -1));
      it('negative/positive', () => equal(Duration.compare(d1.negated(), d2, { relativeTo }), -1));
      it('positive/negative', () => equal(Duration.compare(d1, d2.negated(), { relativeTo }), 1));
    });
    it('casts first argument', () => {
      equal(Duration.compare({ hours: 12 }, new Duration()), 1);
      equal(Duration.compare('PT12H', new Duration()), 1);
    });
    it('casts second argument', () => {
      equal(Duration.compare(new Duration(), { hours: 12 }), -1);
      equal(Duration.compare(new Duration(), 'PT12H'), -1);
    });
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => Duration.compare({ hour: 12 }, new Duration()), TypeError);
      throws(() => Duration.compare(new Duration(), { hour: 12 }), TypeError);
    });
    it('ignores incorrect properties', () => {
      equal(Duration.compare({ hours: 12, minute: 5 }, { hours: 12, day: 5 }), 0);
    });
    it('relativeTo affects year length', () => {
      const oneYear = new Duration(1);
      const days365 = new Duration(0, 0, 0, 365);
      equal(Duration.compare(oneYear, days365, { relativeTo: Temporal.PlainDateTime.from('2017-01-01') }), 0);
      equal(Duration.compare(oneYear, days365, { relativeTo: Temporal.PlainDateTime.from('2016-01-01') }), 1);
    });
    it('relativeTo affects month length', () => {
      const oneMonth = new Duration(0, 1);
      const days30 = new Duration(0, 0, 0, 30);
      equal(Duration.compare(oneMonth, days30, { relativeTo: Temporal.PlainDateTime.from('2018-04-01') }), 0);
      equal(Duration.compare(oneMonth, days30, { relativeTo: Temporal.PlainDateTime.from('2018-03-01') }), 1);
      equal(Duration.compare(oneMonth, days30, { relativeTo: Temporal.PlainDateTime.from('2018-02-01') }), -1);
    });
    const oneDay = new Duration(0, 0, 0, 1);
    const hours24 = new Duration(0, 0, 0, 0, 24);
    it('relativeTo not required for days', () => {
      equal(Duration.compare(oneDay, hours24), 0);
    });
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = Temporal.PlainDateTime.from('2017-01-01');
      equal(Duration.compare(oneDay, hours24, { relativeTo }), 0);
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(Duration.compare(oneDay, hours24, { relativeTo }), 0);
    });
    it('relativeTo does affect days if ZonedDateTime, and duration encompasses DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
      equal(Duration.compare(oneDay, hours24, { relativeTo }), 1);
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(Duration.compare(oneDay, hours24, { relativeTo: '2019-11-03T00:00[America/Vancouver]' }), 1);
      equal(
        Duration.compare(oneDay, hours24, {
          relativeTo: { year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' }
        }),
        1
      );
    });
    it('casts relativeTo to PlainDateTime if possible', () => {
      equal(Duration.compare(oneDay, hours24, { relativeTo: '2019-11-03T00:00' }), 0);
      equal(Duration.compare(oneDay, hours24, { relativeTo: { year: 2019, month: 11, day: 3 } }), 0);
    });
    it('at least the required properties must be present in relativeTo', () => {
      throws(() => Duration.compare(oneDay, hours24, { relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => Duration.compare(oneDay, hours24, { relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => Duration.compare(oneDay, hours24, { relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
    it('does not lose precision when totaling everything down to nanoseconds', () => {
      notEqual(Duration.compare({ days: 200 }, { days: 200, nanoseconds: 1 }), 0);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
