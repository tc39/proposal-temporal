import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal } = assert;

import { TruncatingDivModByPowerOf10 as div, FMAPowerOf10 as fma } from '../lib/math.mjs';

describe('Math', () => {
  describe('TruncatingDivModByPowerOf10', () => {
    it('12345/10**0 = 12345, 0', () => deepEqual(div(12345, 0), { div: 12345, mod: 0 }));
    it('12345/10**1 = 1234, 5', () => deepEqual(div(12345, 1), { div: 1234, mod: 5 }));
    it('12345/10**2 = 123, 45', () => deepEqual(div(12345, 2), { div: 123, mod: 45 }));
    it('12345/10**3 = 12, 345', () => deepEqual(div(12345, 3), { div: 12, mod: 345 }));
    it('12345/10**4 = 1, 2345', () => deepEqual(div(12345, 4), { div: 1, mod: 2345 }));
    it('12345/10**5 = 0, 12345', () => deepEqual(div(12345, 5), { div: 0, mod: 12345 }));
    it('12345/10**6 = 0, 12345', () => deepEqual(div(12345, 6), { div: 0, mod: 12345 }));

    it('-12345/10**0 = -12345, -0', () => deepEqual(div(-12345, 0), { div: -12345, mod: -0 }));
    it('-12345/10**1 = -1234, -5', () => deepEqual(div(-12345, 1), { div: -1234, mod: -5 }));
    it('-12345/10**2 = -123, -45', () => deepEqual(div(-12345, 2), { div: -123, mod: -45 }));
    it('-12345/10**3 = -12, -345', () => deepEqual(div(-12345, 3), { div: -12, mod: -345 }));
    it('-12345/10**4 = -1, -2345', () => deepEqual(div(-12345, 4), { div: -1, mod: -2345 }));
    it('-12345/10**5 = -0, -12345', () => deepEqual(div(-12345, 5), { div: -0, mod: -12345 }));
    it('-12345/10**6 = -0, -12345', () => deepEqual(div(-12345, 6), { div: -0, mod: -12345 }));

    it('0/10**27 = 0, 0', () => deepEqual(div(0, 27), { div: 0, mod: 0 }));
    it('-0/10**27 = -0, -0', () => deepEqual(div(-0, 27), { div: -0, mod: -0 }));

    it('1001/10**3 = 1, 1', () => deepEqual(div(1001, 3), { div: 1, mod: 1 }));
    it('-1001/10**3 = -1, -1', () => deepEqual(div(-1001, 3), { div: -1, mod: -1 }));

    it('4019125567429664768/10**3 = 4019125567429664, 768', () =>
      deepEqual(div(4019125567429664768, 3), { div: 4019125567429664, mod: 768 }));
    it('-4019125567429664768/10**3 = -4019125567429664, -768', () =>
      deepEqual(div(-4019125567429664768, 3), { div: -4019125567429664, mod: -768 }));
    it('3294477463410151260160/10**6 = 3294477463410151, 260160', () =>
      deepEqual(div(3294477463410151260160, 6), { div: 3294477463410151, mod: 260160 }));
    it('-3294477463410151260160/10**6 = -3294477463410151, -260160', () =>
      deepEqual(div(-3294477463410151260160, 6), { div: -3294477463410151, mod: -260160 }));
    it('7770017954545649059889152/10**9 = 7770017954545649, 59889152', () =>
      deepEqual(div(7770017954545649059889152, 9), { div: 7770017954545649, mod: 59889152 }));
    it('-7770017954545649059889152/-10**9 = -7770017954545649, -59889152', () =>
      deepEqual(div(-7770017954545649059889152, 9), { div: -7770017954545649, mod: -59889152 }));

    // Largest/smallest representable float that will result in a safe quotient,
    // for each of the divisors 10**3, 10**6, 10**9
    it('9007199254740990976/10**3 = MAX_SAFE_INTEGER-1, 976', () =>
      deepEqual(div(9007199254740990976, 3), { div: Number.MAX_SAFE_INTEGER - 1, mod: 976 }));
    it('-9007199254740990976/10**3 = -MAX_SAFE_INTEGER+1, -976', () =>
      deepEqual(div(-9007199254740990976, 3), { div: -Number.MAX_SAFE_INTEGER + 1, mod: -976 }));
    it('9007199254740990951424/10**6 = MAX_SAFE_INTEGER-1, 951424', () =>
      deepEqual(div(9007199254740990951424, 6), { div: Number.MAX_SAFE_INTEGER - 1, mod: 951424 }));
    it('-9007199254740990951424/10**6 = -MAX_SAFE_INTEGER+1, -951424', () =>
      deepEqual(div(-9007199254740990951424, 6), { div: -Number.MAX_SAFE_INTEGER + 1, mod: -951424 }));
    it('9007199254740990926258176/10**9 = MAX_SAFE_INTEGER-1, 926258176', () =>
      deepEqual(div(9007199254740990926258176, 9), { div: Number.MAX_SAFE_INTEGER - 1, mod: 926258176 }));
    it('-9007199254740990926258176/10**9 = -MAX_SAFE_INTEGER+1, -926258176', () =>
      deepEqual(div(-9007199254740990926258176, 9), { div: -Number.MAX_SAFE_INTEGER + 1, mod: -926258176 }));
  });

  describe('FMAPowerOf10', () => {
    it('0*10**0+0 = 0', () => equal(fma(0, 0, 0), 0));
    it('-0*10**0-0 = -0', () => equal(fma(-0, 0, -0), -0));
    it('1*10**0+0 = 1', () => equal(fma(1, 0, 0), 1));
    it('-1*10**0+0 = -1', () => equal(fma(-1, 0, 0), -1));
    it('0*10**50+1234 = 1234', () => equal(fma(0, 50, 1234), 1234));
    it('-0*10**50-1234 = -1234', () => equal(fma(-0, 50, -1234), -1234));
    it('1234*10**12+0', () => equal(fma(1234, 12, 0), 1234000000000000));
    it('-1234*10**12-0', () => equal(fma(-1234, 12, -0), -1234000000000000));

    it('2*10**2+45 = 245', () => equal(fma(2, 2, 45), 245));
    it('2*10**3+45 = 2045', () => equal(fma(2, 3, 45), 2045));
    it('2*10**4+45 = 20045', () => equal(fma(2, 4, 45), 20045));
    it('2*10**5+45 = 200045', () => equal(fma(2, 5, 45), 200045));
    it('2*10**6+45 = 2000045', () => equal(fma(2, 6, 45), 2000045));

    it('-2*10**2-45 = -245', () => equal(fma(-2, 2, -45), -245));
    it('-2*10**3-45 = -2045', () => equal(fma(-2, 3, -45), -2045));
    it('-2*10**4-45 = -20045', () => equal(fma(-2, 4, -45), -20045));
    it('-2*10**5-45 = -200045', () => equal(fma(-2, 5, -45), -200045));
    it('-2*10**6-45 = -2000045', () => equal(fma(-2, 6, -45), -2000045));

    it('8692288669465520*10**9+321414345 = 8692288669465520321414345, rounded to 8692288669465520839327744', () =>
      equal(fma(8692288669465520, 9, 321414345), 8692288669465520839327744));
    it('-8692288669465520*10**9-321414345 = -8692288669465520321414345, rounded to -8692288669465520839327744', () =>
      equal(fma(-8692288669465520, 9, -321414345), -8692288669465520839327744));

    it('MAX_SAFE_INTEGER*10**3+999 rounded to 9007199254740992000', () =>
      equal(fma(Number.MAX_SAFE_INTEGER, 3, 999), 9007199254740992000));
    it('-MAX_SAFE_INTEGER*10**3-999 rounded to -9007199254740992000', () =>
      equal(fma(-Number.MAX_SAFE_INTEGER, 3, -999), -9007199254740992000));
    it('MAX_SAFE_INTEGER*10**6+999999 rounded to 9007199254740992000000', () =>
      equal(fma(Number.MAX_SAFE_INTEGER, 6, 999999), 9007199254740992000000));
    it('-MAX_SAFE_INTEGER*10**6-999999 rounded to -9007199254740992000000', () =>
      equal(fma(-Number.MAX_SAFE_INTEGER, 6, -999999), -9007199254740992000000));
    it('MAX_SAFE_INTEGER*10**3+999 rounded to 9007199254740992000', () =>
      equal(fma(Number.MAX_SAFE_INTEGER, 9, 999999999), 9007199254740992000000000));
    it('-MAX_SAFE_INTEGER*10**3-999 rounded to -9007199254740992000', () =>
      equal(fma(-Number.MAX_SAFE_INTEGER, 9, -999999999), -9007199254740992000000000));
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
