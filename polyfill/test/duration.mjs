import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';

describe('Duration', () => {
  describe('toString()', () => {
    it("serializing balance doesn't trip out-of-range", () => {
      const d = Temporal.Duration.from({ seconds: Number.MAX_VALUE, milliseconds: Number.MAX_VALUE });
      const str = d.toString();
      assert(str.startsWith('PT'));
      assert(str.endsWith('S'));
      // actual string representation may vary, since MAX_VALUE is not precise
    });
    it("serializing balance doesn't lose precision when values are precise", () => {
      const d = Temporal.Duration.from({
        milliseconds: Number.MAX_SAFE_INTEGER,
        microseconds: Number.MAX_SAFE_INTEGER
      });
      equal(`${d}`, 'PT9016206453995.731991S');
    });
    it('rounding can affect units up to seconds', () => {
      const d4 = Temporal.Duration.from('P1Y1M1W1DT23H59M59.999999999S');
      equal(d4.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }), 'P1Y1M1W1DT23H59M60.00000000S');
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
      equal(`${new Temporal.Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)}`, 'PT0S');
      units.forEach((unit) => equal(`${Temporal.Duration.from({ [unit]: 0 })}`, 'PT0S'));
      ['P0Y', 'P0M', 'P0W', 'P0D', 'PT0H', 'PT0M', 'PT0S'].forEach((str) =>
        equal(`${Temporal.Duration.from(str)}`, 'PT0S')
      );
    });
    it('unrepresentable number is not allowed', () => {
      units.forEach((unit, ix) => {
        // eslint-disable-next-line no-loss-of-precision,@typescript-eslint/no-loss-of-precision
        throws(() => new Temporal.Duration(...Array(ix).fill(0), 1e309), RangeError);
        // eslint-disable-next-line no-loss-of-precision,@typescript-eslint/no-loss-of-precision
        throws(() => Temporal.Duration.from({ [unit]: 1e309 }), RangeError);
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
      ].forEach((str) => throws(() => Temporal.Duration.from(str), RangeError));
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
        equal(`${new Temporal.Duration(...Array(ix).fill(0), Number.MAX_SAFE_INTEGER)}`, str);
        equal(`${Temporal.Duration.from(str)}`, str);
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
        doAsserts(new Temporal.Duration(...Array(ix).fill(0), 1e26, ...Array(9 - ix).fill(0)));
        doAsserts(Temporal.Duration.from({ [units[ix]]: 1e26 }));
        if (!infix) doAsserts(Temporal.Duration.from(`${prefix}100000000000000000000000000${suffix}`));
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
  describe('Temporal.Duration.add()', () => {
    const max = new Temporal.Duration(0, 0, 0, ...Array(7).fill(Number.MAX_VALUE));
    it('always throws when addition overflows', () => {
      throws(() => max.add(max), RangeError);
    });
    const oneDay = new Temporal.Duration(0, 0, 0, 1);
    const hours24 = new Temporal.Duration(0, 0, 0, 0, 24);
    it('relativeTo does not affect days if PlainDate', () => {
      const relativeTo = Temporal.PlainDate.from('2017-01-01');
      equal(`${oneDay.add(hours24, { relativeTo })}`, 'P2D');
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${oneDay.add(hours24, { relativeTo })}`, 'P2D');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const hours12 = new Temporal.Duration(0, 0, 0, 0, 12);
    const hours25 = new Temporal.Duration(0, 0, 0, 0, 25);
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
        equal(
          `${hours25.add(Temporal.Duration.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        );
        // this takes you to 03:00 on the next skipped-hour day
        equal(
          `${oneDay.add(Temporal.Duration.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        );
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
    it('casts relativeTo to PlainDate if possible', () => {
      equal(`${oneDay.add(hours24, { relativeTo: '2019-11-02' })}`, 'P2D');
      equal(`${oneDay.add(hours24, { relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'P2D');
    });
    it('throws on wrong offset for ZonedDateTime relativeTo string', () => {
      throws(() => oneDay.add(hours24, { relativeTo: '1971-01-01T00:00+02:00[Africa/Monrovia]' }), RangeError);
    });
    it('does not throw on HH:MM rounded offset for ZonedDateTime relativeTo string', () => {
      equal(`${oneDay.add(hours24, { relativeTo: '1971-01-01T00:00-00:45[Africa/Monrovia]' })}`, 'P2D');
    });
    it('throws on HH:MM rounded offset for ZonedDateTime relativeTo property bag', () => {
      throws(
        () =>
          oneDay.add(hours24, {
            relativeTo: { year: 1971, month: 1, day: 1, offset: '-00:45', timeZone: 'Africa/Monrovia' }
          }),
        RangeError
      );
    });
    it('at least the required properties must be present in relativeTo', () => {
      throws(() => oneDay.add(hours24, { relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => oneDay.add(hours24, { relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => oneDay.add(hours24, { relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
  });
  describe('Temporal.Duration.subtract()', () => {
    const oneDay = new Temporal.Duration(0, 0, 0, 1);
    const hours24 = new Temporal.Duration(0, 0, 0, 0, 24);
    it('relativeTo does not affect days if PlainDate', () => {
      const relativeTo = Temporal.PlainDate.from('2017-01-01');
      equal(`${oneDay.subtract(hours24, { relativeTo })}`, 'PT0S');
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${oneDay.subtract(hours24, { relativeTo })}`, 'PT0S');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const twoDays = new Temporal.Duration(0, 0, 0, 2);
    const threeDays = new Temporal.Duration(0, 0, 0, 3);
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        equal(`${hours24.subtract(oneDay, { relativeTo: inRepeatedHour })}`, '-PT1H');
        equal(`${oneDay.subtract(hours24, { relativeTo: inRepeatedHour })}`, 'PT1H');
      });
      it('start inside repeated hour, end in skipped hour', () => {
        equal(
          `${Temporal.Duration.from({ days: 127, hours: 1 }).subtract(oneDay, { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        );
        equal(
          `${Temporal.Duration.from({ days: 127, hours: 1 }).subtract(hours24, { relativeTo: inRepeatedHour })}`,
          'P126D'
        );
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
        equal(`${twoDays.subtract(Temporal.Duration.from({ hours: 48 }), { relativeTo })}`, '-P1D');
        equal(`${Temporal.Duration.from({ hours: 48 }).subtract(twoDays, { relativeTo })}`, 'P2D');
      });
    });
    it('casts relativeTo to ZonedDateTime if possible', () => {
      equal(`${oneDay.subtract(hours24, { relativeTo: '2019-11-03T00:00[America/Vancouver]' })}`, 'PT1H');
      equal(
        `${oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' } })}`,
        'PT1H'
      );
    });
    it('casts relativeTo to PlainDate if possible', () => {
      equal(`${oneDay.subtract(hours24, { relativeTo: '2019-11-02' })}`, 'PT0S');
      equal(`${oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'PT0S');
    });
    it('throws on wrong offset for ZonedDateTime relativeTo string', () => {
      throws(() => oneDay.subtract(hours24, { relativeTo: '1971-01-01T00:00+02:00[Africa/Monrovia]' }), RangeError);
    });
    it('does not throw on HH:MM rounded offset for ZonedDateTime relativeTo string', () => {
      equal(`${oneDay.subtract(hours24, { relativeTo: '1971-01-01T00:00-00:45[Africa/Monrovia]' })}`, 'PT0S');
    });
    it('throws on HH:MM rounded offset for ZonedDateTime relativeTo property bag', () => {
      throws(
        () =>
          oneDay.subtract(hours24, {
            relativeTo: { year: 1971, month: 1, day: 1, offset: '-00:45', timeZone: 'Africa/Monrovia' }
          }),
        RangeError
      );
    });
    it('at least the required properties must be present in relativeTo', () => {
      throws(() => oneDay.subtract(hours24, { relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => oneDay.subtract(hours24, { relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => oneDay.subtract(hours24, { relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
  });
  describe('Temporal.Duration.round()', () => {
    const d = new Temporal.Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const d2 = new Temporal.Duration(0, 0, 0, 5, 5, 5, 5, 5, 5, 5);
    const relativeTo = Temporal.PlainDate.from('2020-01-01');
    it("succeeds with largestUnit: 'auto'", () => {
      equal(`${Temporal.Duration.from({ hours: 25 }).round({ largestUnit: 'auto' })}`, 'PT25H');
    });
    const hours25 = new Temporal.Duration(0, 0, 0, 0, 25);
    it('days are 24 hours if relativeTo not given', () => {
      equal(`${hours25.round({ largestUnit: 'days' })}`, 'P1DT1H');
    });
    it('days are 24 hours if relativeTo is PlainDate', () => {
      const relativeTo = Temporal.PlainDate.from('2017-01-01');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P1DT1H');
    });
    it('days are 24 hours if relativeTo is ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo })}`, 'P1DT1H');
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const oneDay = new Temporal.Duration(0, 0, 0, 1);
    const hours12 = new Temporal.Duration(0, 0, 0, 0, 12);
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
          `${Temporal.Duration.from({ days: 126, hours: 1 }).round({
            largestUnit: 'days',
            relativeTo: inRepeatedHour
          })}`,
          'P126DT1H'
        );
        equal(
          `${Temporal.Duration.from({ days: 126, hours: 1 }).round({
            largestUnit: 'hours',
            relativeTo: inRepeatedHour
          })}`,
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
        equal(`${Temporal.Duration.from({ hours: 48 }).round({ largestUnit: 'days', relativeTo })}`, 'P3D');
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
    it('casts relativeTo to PlainDate if possible', () => {
      equal(`${hours25.round({ largestUnit: 'days', relativeTo: '2019-11-02' })}`, 'P1DT1H');
      equal(`${hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, month: 11, day: 2 } })}`, 'P1DT1H');
    });
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ['2020-01-01', '2020-01-01T00:00:00.000000000', 20200101n, { year: 2020, month: 1, day: 1 }].forEach(
        (relativeTo) => {
          equal(`${d.round({ smallestUnit: 'seconds', relativeTo })}`, 'P5Y5M5W5DT5H5M5S');
        }
      );
    });
    it('throws on wrong offset for ZonedDateTime relativeTo string', () => {
      throws(
        () => d.round({ smallestUnit: 'seconds', relativeTo: '1971-01-01T00:00+02:00[Africa/Monrovia]' }),
        RangeError
      );
    });
    it('does not throw on HH:MM rounded offset for ZonedDateTime relativeTo string', () => {
      equal(
        `${d.round({ smallestUnit: 'seconds', relativeTo: '1971-01-01T00:00-00:45[Africa/Monrovia]' })}`,
        'P5Y5M5W5DT5H5M5S'
      );
    });
    it('throws on HH:MM rounded offset for ZonedDateTime relativeTo property bag', () => {
      throws(
        () =>
          d.round({
            smallestUnit: 'seconds',
            relativeTo: { year: 1971, month: 1, day: 1, offset: '-00:45', timeZone: 'Africa/Monrovia' }
          }),
        RangeError
      );
    });
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { month: 11, day: 3 } }), TypeError);
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, month: 11 } }), TypeError);
      throws(() => hours25.round({ largestUnit: 'days', relativeTo: { year: 2019, day: 3 } }), TypeError);
    });
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = Temporal.Duration.from({ months: 1 });
      equal(
        `${oneMonth.round({ largestUnit: 'days', relativeTo: { year: 2020, month: 1, day: 1, months: 2 } })}`,
        'P31D'
      );
    });
    it('throws if neither one of largestUnit or smallestUnit is given', () => {
      const hoursOnly = new Temporal.Duration(0, 0, 0, 0, 1);
      [{}, () => {}, { roundingMode: 'ceil' }].forEach((roundTo) => {
        throws(() => d.round(roundTo), RangeError);
        throws(() => hoursOnly.round(roundTo), RangeError);
      });
    });
    it('relativeTo not required to round non-calendar units in durations w/o calendar units (string param)', () => {
      equal(`${d2.round('days')}`, 'P5D');
      equal(`${d2.round('hours')}`, 'P5DT5H');
      equal(`${d2.round('minutes')}`, 'P5DT5H5M');
      equal(`${d2.round('seconds')}`, 'P5DT5H5M5S');
      equal(`${d2.round('milliseconds')}`, 'P5DT5H5M5.005S');
      equal(`${d2.round('microseconds')}`, 'P5DT5H5M5.005005S');
      equal(`${d2.round('nanoseconds')}`, 'P5DT5H5M5.005005005S');
    });
    it('relativeTo is required to round calendar units even in durations w/o calendar units (string param)', () => {
      throws(() => d2.round('years'), RangeError);
      throws(() => d2.round('months'), RangeError);
      throws(() => d2.round('weeks'), RangeError);
    });
    it('relativeTo not required to round non-calendar units in durations w/o calendar units (object param)', () => {
      equal(`${d2.round({ smallestUnit: 'days' })}`, 'P5D');
      equal(`${d2.round({ smallestUnit: 'hours' })}`, 'P5DT5H');
      equal(`${d2.round({ smallestUnit: 'minutes' })}`, 'P5DT5H5M');
      equal(`${d2.round({ smallestUnit: 'seconds' })}`, 'P5DT5H5M5S');
      equal(`${d2.round({ smallestUnit: 'milliseconds' })}`, 'P5DT5H5M5.005S');
      equal(`${d2.round({ smallestUnit: 'microseconds' })}`, 'P5DT5H5M5.005005S');
      equal(`${d2.round({ smallestUnit: 'nanoseconds' })}`, 'P5DT5H5M5.005005005S');
    });
    it('relativeTo is required to round calendar units even in durations w/o calendar units (object param)', () => {
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
      const fortyDays = Temporal.Duration.from({ days: 40 });
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
      const fortyDays = Temporal.Duration.from({ days: 40 });
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-01-01' })}`, 'P1M9D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-02-01' })}`, 'P1M11D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-03-01' })}`, 'P1M9D');
      equal(`${fortyDays.round({ largestUnit: 'years', relativeTo: '2020-04-01' })}`, 'P1M10D');
      const minusForty = Temporal.Duration.from({ days: -40 });
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-02-01' })}`, '-P1M9D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-01-01' })}`, '-P1M9D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-03-01' })}`, '-P1M11D');
      equal(`${minusForty.round({ largestUnit: 'years', relativeTo: '2020-04-01' })}`, '-P1M9D');
    });
    it('balances up to the next unit after rounding', () => {
      const almostWeek = Temporal.Duration.from({ days: 6, hours: 20 });
      equal(`${almostWeek.round({ largestUnit: 'weeks', smallestUnit: 'days', relativeTo: '2020-01-01' })}`, 'P1W');
    });
    it('balances days up to both years and months', () => {
      const twoYears = Temporal.Duration.from({ months: 11, days: 396 });
      equal(`${twoYears.round({ largestUnit: 'years', relativeTo: '2017-01-01' })}`, 'P2Y');
    });
    it('does not balance up to weeks if largestUnit is larger than weeks', () => {
      const monthAlmostWeek = Temporal.Duration.from({ months: 1, days: 6, hours: 20 });
      equal(`${monthAlmostWeek.round({ smallestUnit: 'days', relativeTo: '2020-01-01' })}`, 'P1M7D');
    });
    it('balances down differently depending on relativeTo', () => {
      const oneYear = Temporal.Duration.from({ years: 1 });
      equal(`${oneYear.round({ largestUnit: 'days', relativeTo: '2019-01-01' })}`, 'P365D');
      equal(`${oneYear.round({ largestUnit: 'days', relativeTo: '2019-07-01' })}`, 'P366D');
      const minusYear = Temporal.Duration.from({ years: -1 });
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
          const roundTo = { smallestUnit, roundingIncrement, relativeTo };
          assert(d.round(roundTo) instanceof Temporal.Duration);
        });
      });
    });
    ['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const roundTo = { smallestUnit, roundingIncrement, relativeTo };
          assert(d.round(roundTo) instanceof Temporal.Duration);
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
      const days = Temporal.Duration.from({ days: 45 });
      equal(`${days.round({ relativeTo: '2019-01-01', smallestUnit: 'months' })}`, 'P2M');
      equal(`${days.negated().round({ relativeTo: '2019-02-15', smallestUnit: 'months' })}`, '-P1M');
      const yearAndHalf = Temporal.Duration.from({ days: 547, hours: 12 });
      equal(`${yearAndHalf.round({ relativeTo: '2018-01-01', smallestUnit: 'years' })}`, 'P2Y');
      equal(`${yearAndHalf.round({ relativeTo: '2018-07-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2019-01-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2019-07-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2020-01-01', smallestUnit: 'years' })}`, 'P1Y');
      equal(`${yearAndHalf.round({ relativeTo: '2020-07-01', smallestUnit: 'years' })}`, 'P2Y');
    });
  });
  describe('Temporal.Duration.total()', () => {
    const d = new Temporal.Duration(5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    const d2 = new Temporal.Duration(0, 0, 0, 5, 5, 5, 5, 5, 5, 5);
    const relativeTo = Temporal.PlainDate.from('2020-01-01');
    it('throws on disallowed or invalid unit (object param)', () => {
      ['era', 'nonsense'].forEach((unit) => {
        throws(() => d.total({ unit }), RangeError);
      });
    });
    it('throws on disallowed or invalid unit (string param)', () => {
      ['era', 'nonsense'].forEach((unit) => {
        throws(() => d.total(unit), RangeError);
      });
    });
    it('does not lose precision for seconds and smaller units', () => {
      const s = Temporal.Duration.from({ milliseconds: 2, microseconds: 31 }).total({ unit: 'seconds' });
      equal(s, 0.002031);
    });
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ['2020-01-01', '2020-01-01T00:00:00.000000000', 20200101n, { year: 2020, month: 1, day: 1 }].forEach(
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
    it('throws on wrong offset for ZonedDateTime relativeTo string', () => {
      throws(() => d.total({ unit: 'months', relativeTo: '1971-01-01T00:00+02:00[Africa/Monrovia]' }), RangeError);
    });
    it('does not throw on HH:MM rounded offset for ZonedDateTime relativeTo string', () => {
      const oneMonth = Temporal.Duration.from({ months: 1 });
      equal(oneMonth.total({ unit: 'months', relativeTo: '1971-01-01T00:00-00:45[Africa/Monrovia]' }), 1);
    });
    it('throws on HH:MM rounded offset for ZonedDateTime relativeTo property bag', () => {
      throws(
        () =>
          d.total({
            unit: 'months',
            relativeTo: { year: 1971, month: 1, day: 1, offset: '-00:45', timeZone: 'Africa/Monrovia' }
          }),
        RangeError
      );
    });
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      throws(() => d.total({ unit: 'months', relativeTo: {} }), TypeError);
      throws(() => d.total({ unit: 'months', relativeTo: { years: 2020, month: 1, day: 1 } }), TypeError);
    });
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = Temporal.Duration.from({ months: 1 });
      equal(oneMonth.total({ unit: 'months', relativeTo: { year: 2020, month: 1, day: 1, months: 2 } }), 1);
    });
    it('throws RangeError if unit property is missing', () => {
      [{}, () => {}, { roundingMode: 'ceil' }].forEach((roundTo) => throws(() => d.total(roundTo), RangeError));
    });
    it('relativeTo required to round calendar units even in durations w/o calendar units (object param)', () => {
      throws(() => d2.total({ unit: 'years' }), RangeError);
      throws(() => d2.total({ unit: 'months' }), RangeError);
      throws(() => d2.total({ unit: 'weeks' }), RangeError);
    });
    it('relativeTo required to round calendar units even in durations w/o calendar units (string param)', () => {
      throws(() => d2.total('years'), RangeError);
      throws(() => d2.total('months'), RangeError);
      throws(() => d2.total('weeks'), RangeError);
    });
    it('relativeTo is required to round durations with calendar units (object param)', () => {
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
    it('relativeTo is required to round durations with calendar units (string param)', () => {
      throws(() => d.total('years'), RangeError);
      throws(() => d.total('months'), RangeError);
      throws(() => d.total('weeks'), RangeError);
      throws(() => d.total('days'), RangeError);
      throws(() => d.total('hours'), RangeError);
      throws(() => d.total('minutes'), RangeError);
      throws(() => d.total('seconds'), RangeError);
      throws(() => d.total('milliseconds'), RangeError);
      throws(() => d.total('microseconds'), RangeError);
      throws(() => d.total('nanoseconds'), RangeError);
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

    const endpoint = relativeTo.toPlainDateTime().add(d);
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
      const fortyDays = Temporal.Duration.from({ days: 40 });
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
      const negativeFortyDays = Temporal.Duration.from({ days: -40 });
      equal(
        negativeFortyDays.total({ unit: 'months', relativeTo: '2020-03-01' }).toPrecision(16),
        (-(1 + 11 / 31)).toPrecision(16)
      );
      equal(
        negativeFortyDays.total({ unit: 'months', relativeTo: '2020-04-01' }).toPrecision(16),
        (-(1 + 9 / 29)).toPrecision(16)
      );
    });
    const oneDay = new Temporal.Duration(0, 0, 0, 1);
    it('relativeTo does not affect days if PlainDate', () => {
      const relativeTo = Temporal.PlainDate.from('2017-01-01');
      equal(oneDay.total({ unit: 'hours', relativeTo }), 24);
    });
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2017-01-01T00:00[America/Montevideo]');
      equal(oneDay.total({ unit: 'hours', relativeTo }), 24);
    });
    const skippedHourDay = Temporal.ZonedDateTime.from('2019-03-10T00:00[America/Vancouver]');
    const repeatedHourDay = Temporal.ZonedDateTime.from('2019-11-03T00:00[America/Vancouver]');
    const inRepeatedHour = Temporal.ZonedDateTime.from('2019-11-03T01:00-07:00[America/Vancouver]');
    const hours12 = new Temporal.Duration(0, 0, 0, 0, 12);
    const hours25 = new Temporal.Duration(0, 0, 0, 0, 25);
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
        const totalDays = Temporal.Duration.from({ days: 126, hours: 1 }).total({
          unit: 'days',
          relativeTo: inRepeatedHour
        });
        assert(Math.abs(totalDays - (126 + 1 / 23)) < Number.EPSILON);
        equal(
          Temporal.Duration.from({ days: 126, hours: 1 }).total({ unit: 'hours', relativeTo: inRepeatedHour }),
          3026
        );
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
        equal(Temporal.Duration.from({ hours: 48 }).total({ unit: 'days', relativeTo }), 3);
        equal(Temporal.Duration.from({ days: 2 }).total({ unit: 'hours', relativeTo }), 24);
        equal(Temporal.Duration.from({ days: 3 }).total({ unit: 'hours', relativeTo }), 48);
      });
    });
    it('totaling back up to days', () => {
      const relativeTo = Temporal.ZonedDateTime.from('2019-11-02T00:00[America/Vancouver]');
      equal(Temporal.Duration.from({ hours: 48 }).total({ unit: 'days' }), 2);
      const totalDays = Temporal.Duration.from({ hours: 48 }).total({ unit: 'days', relativeTo });
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
      const almostWeek = Temporal.Duration.from({ days: 6, hours: 20 });
      const totalWeeks = almostWeek.total({ unit: 'weeks', relativeTo: '2020-01-01' });
      assert(Math.abs(totalWeeks - (6 + 20 / 24) / 7) < Number.EPSILON);
    });
    it('balances up to the next unit after rounding (negative)', () => {
      const almostWeek = Temporal.Duration.from({ days: -6, hours: -20 });
      const totalWeeks = almostWeek.total({ unit: 'weeks', relativeTo: '2020-01-01' });
      assert(Math.abs(totalWeeks - -((6 + 20 / 24) / 7)) < Number.EPSILON);
    });
    it('balances days up to both years and months', () => {
      const twoYears = Temporal.Duration.from({ months: 11, days: 396 });
      equal(twoYears.total({ unit: 'years', relativeTo: '2017-01-01' }), 2);
    });
    it('balances days up to both years and months (negative)', () => {
      const twoYears = Temporal.Duration.from({ months: -11, days: -396 });
      equal(twoYears.total({ unit: 'years', relativeTo: '2017-01-01' }), -2);
    });
  });
  describe('Temporal.Duration.compare', () => {
    it('does not lose precision when totaling everything down to nanoseconds', () => {
      notEqual(Temporal.Duration.compare({ days: 200 }, { days: 200, nanoseconds: 1 }), 0);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
