import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert, AssertionError } from 'assert';
const { equal, throws } = assert;

import { TimeDuration } from '../lib/timeduration.mjs';

function check(timeDuration, sec, subsec) {
  equal(timeDuration.sec, sec);
  equal(timeDuration.subsec, subsec);
}

function checkBigInt(value, bigint) {
  if (value && typeof value === 'object') {
    equal(value.value, bigint); // bigInteger wrapper
  } else {
    equal(value, bigint); // real bigint
  }
}

function checkFloat(value, float) {
  if (!Number.isFinite(value) || Math.abs(value - float) > Number.EPSILON) {
    throw new AssertionError({
      message: `Expected ${value} to be within ɛ of ${float}`,
      expected: float,
      actual: value,
      operator: 'checkFloat'
    });
  }
}

describe('Normalized time duration', () => {
  describe('construction', () => {
    it('basic', () => {
      check(new TimeDuration(123456789, 987654321), 123456789, 987654321);
      check(new TimeDuration(-987654321, -123456789), -987654321, -123456789);
    });

    it('either sign with zero in the other component', () => {
      check(new TimeDuration(0, 123), 0, 123);
      check(new TimeDuration(0, -123), 0, -123);
      check(new TimeDuration(123, 0), 123, 0);
      check(new TimeDuration(-123, 0), -123, 0);
    });

    it('-0 is normalized', () => {
      const d = new TimeDuration(-0, -0);
      check(d, 0, 0);
      assert(!Object.is(d.sec, -0));
      assert(!Object.is(d.subsec, -0));
    });
  });

  describe('construction impossible', () => {
    it('out of range', () => {
      throws(() => new TimeDuration(2 ** 53, 0));
      throws(() => new TimeDuration(-(2 ** 53), 0));
      throws(() => new TimeDuration(Number.MAX_SAFE_INTEGER, 1e9));
      throws(() => new TimeDuration(-Number.MAX_SAFE_INTEGER, -1e9));
    });

    it('not an integer', () => {
      throws(() => new TimeDuration(Math.PI, 0));
      throws(() => new TimeDuration(0, Math.PI));
    });

    it('mixed signs', () => {
      throws(() => new TimeDuration(1, -1));
      throws(() => new TimeDuration(-1, 1));
    });
  });

  describe('fromEpochNsDiff()', () => {
    it('basic', () => {
      check(TimeDuration.fromEpochNsDiff(1695930183_043174412n, 1695930174_412168313n), 8, 631006099);
      check(TimeDuration.fromEpochNsDiff(1695930174_412168313n, 1695930183_043174412n), -8, -631006099);
    });

    it('pre-epoch', () => {
      check(TimeDuration.fromEpochNsDiff(-80000_987_654_321n, -86400_123_456_789n), 6399, 135802468);
      check(TimeDuration.fromEpochNsDiff(-86400_123_456_789n, -80000_987_654_321n), -6399, -135802468);
    });

    it('cross-epoch', () => {
      check(TimeDuration.fromEpochNsDiff(1_000_001_000n, -2_000_002_000n), 3, 3000);
      check(TimeDuration.fromEpochNsDiff(-2_000_002_000n, 1_000_001_000n), -3, -3000);
    });

    it('maximum epoch difference', () => {
      const max = 86400_0000_0000_000_000_000n;
      check(TimeDuration.fromEpochNsDiff(max, -max), 172800_0000_0000, 0);
      check(TimeDuration.fromEpochNsDiff(-max, max), -172800_0000_0000, 0);
    });
  });

  describe('normalize()', () => {
    it('basic', () => {
      check(TimeDuration.normalize(1, 1, 1, 1, 1, 1), 3661, 1001001);
      check(TimeDuration.normalize(-1, -1, -1, -1, -1, -1), -3661, -1001001);
    });

    it('overflow from one unit to another', () => {
      check(TimeDuration.normalize(1, 61, 61, 998, 1000, 1000), 7321, 999001000);
      check(TimeDuration.normalize(-1, -61, -61, -998, -1000, -1000), -7321, -999001000);
    });

    it('overflow from subseconds to seconds', () => {
      check(TimeDuration.normalize(0, 0, 1, 1000, 0, 0), 2, 0);
      check(TimeDuration.normalize(0, 0, -1, -1000, 0, 0), -2, 0);
    });

    it('multiple overflows from subseconds to seconds', () => {
      check(TimeDuration.normalize(0, 0, 0, 1234567890, 1234567890, 1234567890), 1235803, 692457890);
      check(TimeDuration.normalize(0, 0, 0, -1234567890, -1234567890, -1234567890), -1235803, -692457890);
    });

    it('fails on overflow', () => {
      throws(() => TimeDuration.normalize(2501999792984, 0, 0, 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(-2501999792984, 0, 0, 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 150119987579017, 0, 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, -150119987579017, 0, 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, 2 ** 53, 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, -(2 ** 53), 0, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, Number.MAX_SAFE_INTEGER, 1000, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, -Number.MAX_SAFE_INTEGER, -1000, 0, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, Number.MAX_SAFE_INTEGER, 0, 1000000, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, -Number.MAX_SAFE_INTEGER, 0, -1000000, 0), RangeError);
      throws(() => TimeDuration.normalize(0, 0, Number.MAX_SAFE_INTEGER, 0, 0, 1000000000), RangeError);
      throws(() => TimeDuration.normalize(0, 0, -Number.MAX_SAFE_INTEGER, 0, 0, -1000000000), RangeError);
    });
  });

  describe('abs()', () => {
    it('positive', () => {
      const d = new TimeDuration(123, 456_654_321);
      check(d.abs(), 123, 456_654_321);
    });

    it('negative', () => {
      const d = new TimeDuration(-123, -456_654_321);
      check(d.abs(), 123, 456_654_321);
    });

    it('zero', () => {
      const d = new TimeDuration(0, 0);
      check(d.abs(), 0, 0);
    });
  });

  describe('add()', () => {
    it('basic', () => {
      const d1 = new TimeDuration(123_456_654, 321_123_456);
      const d2 = new TimeDuration(654_321_123, 456_654_321);
      check(d1.add(d2), 777_777_777, 777_777_777);
    });

    it('negative', () => {
      const d1 = new TimeDuration(-123_456_654, -321_123_456);
      const d2 = new TimeDuration(-654_321_123, -456_654_321);
      check(d1.add(d2), -777_777_777, -777_777_777);
    });

    it('signs differ', () => {
      const d1 = new TimeDuration(333_333_333, 333_333_333);
      const d2 = new TimeDuration(-222_222_222, -222_222_222);
      check(d1.add(d2), 111_111_111, 111_111_111);

      const d3 = new TimeDuration(-333_333_333, -333_333_333);
      const d4 = new TimeDuration(222_222_222, 222_222_222);
      check(d3.add(d4), -111_111_111, -111_111_111);
    });

    it('cross zero', () => {
      const d1 = new TimeDuration(222_222_222, 222_222_222);
      const d2 = new TimeDuration(-333_333_333, -333_333_333);
      check(d1.add(d2), -111_111_111, -111_111_111);
    });

    it('overflow from subseconds to seconds', () => {
      const d1 = new TimeDuration(0, 999_999_999);
      const d2 = new TimeDuration(0, 2);
      check(d1.add(d2), 1, 1);
    });

    it('fails on overflow', () => {
      const d1 = new TimeDuration(2 ** 52, 0);
      throws(() => d1.add(d1), RangeError);
    });
  });

  describe('add24HourDays()', () => {
    it('basic', () => {
      const d = new TimeDuration(111_111_111, 111_111_111);
      check(d.add24HourDays(10), 111_975_111, 111_111_111);
    });

    it('negative', () => {
      const d = new TimeDuration(-111_111_111, -111_111_111);
      check(d.add24HourDays(-10), -111_975_111, -111_111_111);
    });

    it('signs differ', () => {
      const d1 = new TimeDuration(864000, 0);
      check(d1.add24HourDays(-5), 432000, 0);

      const d2 = new TimeDuration(-864000, 0);
      check(d2.add24HourDays(5), -432000, 0);
    });

    it('cross zero', () => {
      const d1 = new TimeDuration(86400, 0);
      check(d1.add24HourDays(-2), -86400, 0);

      const d2 = new TimeDuration(-86400, 0);
      check(d2.add24HourDays(3), 172800, 0);
    });

    it('overflow from subseconds to seconds', () => {
      const d1 = new TimeDuration(-86400, -333_333_333);
      check(d1.add24HourDays(2), 86399, 666_666_667);

      const d2 = new TimeDuration(86400, 333_333_333);
      check(d2.add24HourDays(-2), -86399, -666_666_667);
    });

    it('does not accept non-integers', () => {
      const d = new TimeDuration(0, 0);
      throws(() => d.add24HourDays(1.5), Error);
    });

    it('fails on overflow', () => {
      const d = new TimeDuration(0, 0);
      throws(() => d.add24HourDays(104249991375), RangeError);
      throws(() => d.add24HourDays(-104249991375), RangeError);
    });
  });

  describe('addToEpochNs()', () => {
    it('basic', () => {
      const d = new TimeDuration(123_456_654, 321_123_456);
      checkBigInt(d.addToEpochNs(654_321_123_456_654_321n), 777_777_777_777_777_777n);
    });

    it('negative', () => {
      const d = new TimeDuration(-123_456_654, -321_123_456);
      checkBigInt(d.addToEpochNs(-654_321_123_456_654_321n), -777_777_777_777_777_777n);
    });

    it('signs differ', () => {
      const d1 = new TimeDuration(333_333_333, 333_333_333);
      checkBigInt(d1.addToEpochNs(-222_222_222_222_222_222n), 111_111_111_111_111_111n);

      const d2 = new TimeDuration(-333_333_333, -333_333_333);
      checkBigInt(d2.addToEpochNs(222_222_222_222_222_222n), -111_111_111_111_111_111n);
    });

    it('cross zero', () => {
      const d = new TimeDuration(222_222_222, 222_222_222);
      checkBigInt(d.addToEpochNs(-333_333_333_333_333_333n), -111_111_111_111_111_111n);
    });

    it('does not fail on overflow, epochNs overflow is checked elsewhere', () => {
      const d = new TimeDuration(86400_0000_0000, 0);
      checkBigInt(d.addToEpochNs(86400_0000_0000_000_000_000n), 172800_0000_0000_000_000_000n);
    });
  });

  describe('cmp()', () => {
    it('equal', () => {
      const d1 = new TimeDuration(123, 456);
      const d2 = new TimeDuration(123, 456);
      equal(d1.cmp(d2), 0);
      equal(d2.cmp(d1), 0);
    });

    it('unequal', () => {
      const smaller = new TimeDuration(123, 456);
      const larger = new TimeDuration(654, 321);
      equal(smaller.cmp(larger), -1);
      equal(larger.cmp(smaller), 1);
    });

    it('cross sign', () => {
      const neg = new TimeDuration(-654, -321);
      const pos = new TimeDuration(123, 456);
      equal(neg.cmp(pos), -1);
      equal(pos.cmp(neg), 1);
    });
  });

  describe('divmod()', () => {
    it('divide by 1', () => {
      const d = new TimeDuration(1_234, 567_890_987);
      const { quotient, remainder } = d.divmod(1);
      equal(quotient, 1234567890987);
      check(remainder, 0, 0);
    });

    it('divide by self', () => {
      const d = new TimeDuration(1, 234_567_890);
      const { quotient, remainder } = d.divmod(1_234_567_890);
      equal(quotient, 1);
      check(remainder, 0, 0);
    });

    it('no remainder', () => {
      const d = new TimeDuration(1, 234_000_000);
      const { quotient, remainder } = d.divmod(1e6);
      equal(quotient, 1234);
      check(remainder, 0, 0);
    });

    it('divide by -1', () => {
      const d = new TimeDuration(1_234, 567_890_987);
      const { quotient, remainder } = d.divmod(-1);
      equal(quotient, -1_234_567_890_987);
      check(remainder, 0, 0);
    });

    it('zero seconds remainder has sign of dividend', () => {
      const d1 = new TimeDuration(1, 234_567_890);
      let { quotient, remainder } = d1.divmod(-1e6);
      equal(quotient, -1234);
      check(remainder, 0, 567890);
      const d2 = new TimeDuration(-1, -234_567_890);
      ({ quotient, remainder } = d2.divmod(1e6));
      equal(quotient, -1234);
      check(remainder, 0, -567890);
    });

    it('nonzero seconds remainder has sign of dividend', () => {
      const d1 = new TimeDuration(10, 234_567_890);
      let { quotient, remainder } = d1.divmod(-9e9);
      equal(quotient, -1);
      check(remainder, 1, 234567890);
      const d2 = new TimeDuration(-10, -234_567_890);
      ({ quotient, remainder } = d2.divmod(9e9));
      equal(quotient, -1);
      check(remainder, -1, -234567890);
    });

    it('negative with zero seconds remainder', () => {
      const d = new TimeDuration(-1, -234_567_890);
      const { quotient, remainder } = d.divmod(-1e6);
      equal(quotient, 1234);
      check(remainder, 0, -567890);
    });

    it('negative with nonzero seconds remainder', () => {
      const d = new TimeDuration(-10, -234_567_890);
      const { quotient, remainder } = d.divmod(-9e9);
      equal(quotient, 1);
      check(remainder, -1, -234567890);
    });

    it('quotient larger than seconds', () => {
      const d = TimeDuration.normalize(25 + 5 * 24, 0, 86401, 333, 666, 999);
      const { quotient, remainder } = d.divmod(86400e9);
      equal(quotient, 7);
      check(remainder, 3601, 333666999);
    });

    it('quotient smaller than seconds', () => {
      const d = new TimeDuration(90061, 333666999);
      const result1 = d.divmod(1000);
      equal(result1.quotient, 90061333666);
      check(result1.remainder, 0, 999);

      const result2 = d.divmod(10);
      equal(result2.quotient, 9006133366699);
      check(result2.remainder, 0, 9);

      const result3 = d.divmod(3);
      equal(result3.quotient, 30020444555666);
      check(result3.remainder, 0, 1);
    });

    it('divide by 0', () => {
      const d = new TimeDuration(90061_333666999n);
      throws(() => d.divmod(0), Error);
    });
  });

  describe('fdiv()', () => {
    it('divide by 1', () => {
      const d = new TimeDuration(1_234, 567_890_987);
      equal(d.fdiv(1), 1_234_567_890_987);
    });

    it('no remainder', () => {
      const d = new TimeDuration(1, 234_000_000);
      equal(d.fdiv(1e6), 1234);
    });

    it('divide by -1', () => {
      const d = new TimeDuration(1_234, 567_890_987);
      equal(d.fdiv(-1), -1_234_567_890_987);
    });

    it('opposite sign', () => {
      const d1 = new TimeDuration(1, 234_567_890);
      checkFloat(d1.fdiv(-1e6), -1234.56789);
      const d2 = new TimeDuration(-1, -234_567_890);
      checkFloat(d2.fdiv(1e6), -1234.56789);
      const d3 = new TimeDuration(-432n);
      checkFloat(d3.fdiv(864), -0.5);
    });

    it('negative', () => {
      const d = new TimeDuration(-1, -234_567_890);
      checkFloat(d.fdiv(-1e6), 1234.56789);
    });

    it('quotient larger than seconds', () => {
      const d = TimeDuration.normalize(25 + 5 * 24, 0, 86401, 333, 666, 999);
      checkFloat(d.fdiv(86400e9), 7.041682102627303);
    });

    it('quotient smaller than seconds', () => {
      const d = new TimeDuration(90061, 333666999);
      checkFloat(d.fdiv(1000), 90061333666.999);
      checkFloat(d.fdiv(10), 9006133366699.9);
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      checkFloat(d.fdiv(3), 30020444555666.333);
    });

    it('divide by 0', () => {
      const d = new TimeDuration(90061, 333666999);
      throws(() => d.fdiv(0), Error);
    });

    it('large number', () => {
      const d = new TimeDuration(2939649_187497660n);
      checkFloat(d.fdiv(3600e9), 816.56921874935);
    });
  });

  it('isZero()', () => {
    assert(new TimeDuration(0, 0).isZero());
    assert(!new TimeDuration(1, 0).isZero());
    assert(!new TimeDuration(0, -1).isZero());
    assert(!new TimeDuration(1, 1).isZero());
  });

  describe('round()', () => {
    it('basic', () => {
      const d = new TimeDuration(1, 234_567_890);
      check(d.round(1000, 'halfExpand'), 1, 234568000);
    });

    it('increment 1', () => {
      const d = new TimeDuration(1, 234_567_890);
      check(d.round(1, 'ceil'), 1, 234567890);
    });

    it('rounds up from subseconds to seconds', () => {
      const d = new TimeDuration(1, 999_999_999);
      check(d.round(1e9, 'halfExpand'), 2, 0);
    });

    describe('Rounding modes', () => {
      const increment = 100;
      const testValues = [-150, -100, -80, -50, -30, 0, 30, 50, 80, 100, 150];
      const expectations = {
        ceil: [-100, -100, 0, 0, 0, 0, 100, 100, 100, 100, 200],
        floor: [-200, -100, -100, -100, -100, 0, 0, 0, 0, 100, 100],
        trunc: [-100, -100, 0, 0, 0, 0, 0, 0, 0, 100, 100],
        expand: [-200, -100, -100, -100, -100, 0, 100, 100, 100, 100, 200],
        halfCeil: [-100, -100, -100, 0, 0, 0, 0, 100, 100, 100, 200],
        halfFloor: [-200, -100, -100, -100, 0, 0, 0, 0, 100, 100, 100],
        halfTrunc: [-100, -100, -100, 0, 0, 0, 0, 0, 100, 100, 100],
        halfExpand: [-200, -100, -100, -100, 0, 0, 0, 100, 100, 100, 200],
        halfEven: [-200, -100, -100, 0, 0, 0, 0, 0, 100, 100, 200]
      };
      for (const roundingMode of Object.keys(expectations)) {
        describe(roundingMode, () => {
          testValues.forEach((value, ix) => {
            const expected = expectations[roundingMode][ix];

            it(`rounds ${value} ns to ${expected} ns`, () => {
              const d = new TimeDuration(0, value);
              const result = d.round(increment, roundingMode);
              check(result, 0, expected);
            });

            it(`rounds ${value} s to ${expected} s`, () => {
              const d = new TimeDuration(value, 0);
              const result = d.round(increment * 1e9, roundingMode);
              check(result, expected, 0);
            });
          });
        });
      }
    });
  });

  it('sign()', () => {
    equal(new TimeDuration(0, 0).sign(), 0);
    equal(new TimeDuration(0, -1).sign(), -1);
    equal(new TimeDuration(-1, 0).sign(), -1);
    equal(new TimeDuration(0, 1).sign(), 1);
    equal(new TimeDuration(1, 0).sign(), 1);
  });

  describe('subtract', () => {
    it('basic', () => {
      const d1 = new TimeDuration(321, 987654321);
      const d2 = new TimeDuration(123, 123456789);
      check(d1.subtract(d2), 198, 864197532);
      check(d2.subtract(d1), -198, -864197532);
    });

    it('signs differ in result', () => {
      const d1 = new TimeDuration(3661, 1001001);
      const d2 = new TimeDuration(86400, 0);
      check(d1.subtract(d2), -82738, -998998999);
      check(d2.subtract(d1), 82738, 998998999);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
