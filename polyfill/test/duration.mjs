import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal } = assert;

import { Duration } from 'tc39-temporal';

describe('Duration', () => {
  describe('from()', () => {
    it('Duration.from(P5Y) == P5Y', () => {
      const orig = new Duration(5);
      const from = Duration.from(orig);
      equal(from, orig);
    });
    it('Duration.from({ milliseconds: 5 }) == PT0.005S', () =>
      equal(`${Duration.from({ milliseconds: 5 })}`, 'PT0.005S'));
    it('Duration.from("P1D") == P1D', () => equal(`${Duration.from('P1D')}`, 'P1D'));
    it('Duration.from({}) throws', () => throws(() => Duration.from({}), RangeError));
    describe('Disambiguation', () => {
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
      it('negative values throw when "reject"', () =>
        throws(() => Duration.from(negative, { disambiguation: 'reject' }), RangeError));
      it('excessive values unchanged when "reject"', () => {
        equal(`${Duration.from({ minutes: 100 }, { disambiguation: 'reject' })}`, 'PT100M');
      });
      it('negative values invert when "constrain"', () => {
        equal(`${Duration.from(negative)}`, 'P1Y1M1DT1H1M1.001001001S');
        equal(`${Duration.from(negative, { disambiguation: 'constrain' })}`, 'P1Y1M1DT1H1M1.001001001S');
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
    it('infinity is not allowed', () => {
      units.forEach((unit, ix) => {
        throws(() => new Duration(...Array(ix).fill(0), Infinity), RangeError);
        throws(() => Duration.from({ [unit]: Infinity }, { disambiguation: 'reject' }), RangeError);
      });
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
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
