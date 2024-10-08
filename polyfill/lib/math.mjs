import {
  MathAbs,
  MathLog10,
  MathSign,
  MathTrunc,
  NumberParseInt,
  NumberPrototypeToPrecision,
  StringPrototypePadStart,
  StringPrototypeRepeat,
  StringPrototypeSlice
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';

// Computes trunc(x / 10**p) and x % 10**p, returning { div, mod }, with
// precision loss only once in the quotient, by string manipulation. If the
// quotient and remainder are safe integers, then they are exact. x must be an
// integer. p must be a non-negative integer. Both div and mod have the sign of
// x.
export function TruncatingDivModByPowerOf10(x, p) {
  if (x === 0) return { div: x, mod: x }; // preserves signed zero

  const sign = MathSign(x);
  x = MathAbs(x);

  const xDigits = MathTrunc(1 + MathLog10(x));
  if (p >= xDigits) return { div: sign * 0, mod: sign * x };
  if (p === 0) return { div: sign * x, mod: sign * 0 };

  // would perform nearest rounding if x was not an integer:
  const xStr = Call(NumberPrototypeToPrecision, x, [xDigits]);
  const div = sign * NumberParseInt(Call(StringPrototypeSlice, xStr, [0, xDigits - p]), 10);
  const mod = sign * NumberParseInt(Call(StringPrototypeSlice, xStr, [xDigits - p]), 10);

  return { div, mod };
}

// Computes x * 10**p + z with precision loss only at the end, by string
// manipulation. If the result is a safe integer, then it is exact. x must be
// an integer. p must be a non-negative integer. z must have the same sign as
// x and be less than 10**p.
export function FMAPowerOf10(x, p, z) {
  if (x === 0) return z;

  const sign = MathSign(x) || MathSign(z);
  x = MathAbs(x);
  z = MathAbs(z);

  const xStr = Call(NumberPrototypeToPrecision, x, [MathTrunc(1 + MathLog10(x))]);

  if (z === 0) return sign * NumberParseInt(xStr + Call(StringPrototypeRepeat, '0', [p]), 10);

  const zStr = Call(NumberPrototypeToPrecision, z, [MathTrunc(1 + MathLog10(z))]);

  const resStr = xStr + Call(StringPrototypePadStart, zStr, [p, '0']);
  return sign * NumberParseInt(resStr, 10);
}

export function GetUnsignedRoundingMode(mode, sign) {
  const index = +(sign === 'negative'); // 0 = positive, 1 = negative
  switch (mode) {
    case 'ceil':
      return ['infinity', 'zero'][index];
    case 'floor':
      return ['zero', 'infinity'][index];
    case 'expand':
      return 'infinity';
    case 'trunc':
      return 'zero';
    case 'halfCeil':
      return ['half-infinity', 'half-zero'][index];
    case 'halfFloor':
      return ['half-zero', 'half-infinity'][index];
    case 'halfExpand':
      return 'half-infinity';
    case 'halfTrunc':
      return 'half-zero';
    case 'halfEven':
      return 'half-even';
  }
}

// Omits first step from spec algorithm so that it can be used both for
// RoundNumberToIncrement and RoundTimeDurationToIncrement
export function ApplyUnsignedRoundingMode(r1, r2, cmp, evenCardinality, unsignedRoundingMode) {
  if (unsignedRoundingMode === 'zero') return r1;
  if (unsignedRoundingMode === 'infinity') return r2;
  if (cmp < 0) return r1;
  if (cmp > 0) return r2;
  if (unsignedRoundingMode === 'half-zero') return r1;
  if (unsignedRoundingMode === 'half-infinity') return r2;
  return evenCardinality ? r1 : r2;
}
