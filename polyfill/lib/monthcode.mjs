import {
  String as StringCtor,
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,
  StringPrototypeIndexOf,
  StringPrototypePadStart,
  StringPrototypeSlice
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';
import ToPrimitive from 'es-abstract/2024/ToPrimitive.js';

export function ParseMonthCode(argument) {
  const value = ToPrimitive(argument, StringCtor);
  if (typeof value !== 'string') throw new TypeErrorCtor('month code must be a string');
  if (
    value.length < 3 ||
    value.length > 4 ||
    value[0] !== 'M' ||
    Call(StringPrototypeIndexOf, '0123456789', [value[1]]) === -1 ||
    Call(StringPrototypeIndexOf, '0123456789', [value[2]]) === -1 ||
    (value[1] + value[2] === '00' && value[3] !== 'L') ||
    (value[3] !== 'L' && value[3] !== undefined)
  ) {
    throw new RangeErrorCtor(`bad month code ${value}; must match M01-M99 or M00L-M99L`);
  }
  const isLeapMonth = value.length === 4;
  const monthNumber = +Call(StringPrototypeSlice, value, [1, 3]);
  return { monthNumber, isLeapMonth };
}

export function CreateMonthCode(monthNumber, isLeapMonth) {
  const numberPart = Call(StringPrototypePadStart, `${monthNumber}`, [2, '0']);
  return isLeapMonth ? `M${numberPart}L` : `M${numberPart}`;
}
