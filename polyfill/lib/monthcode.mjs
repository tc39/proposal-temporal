import {
  String as StringCtor,
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,
  ArrayFrom,
  StringPrototypePadStart,
  StringPrototypeSlice
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';
import ToPrimitive from 'es-abstract/2024/ToPrimitive.js';

const digitsForMonthNumber = ArrayFrom({ length: 100 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

export function ParseMonthCode(argument) {
  const value = ToPrimitive(argument, StringCtor);
  if (typeof value !== 'string') throw new TypeErrorCtor('month code must be a string');
  const digits = Call(StringPrototypeSlice, value, [1, 3]);
  const monthNumber = digits.length === 2 ? +digits | 0 : -1; // -1 ensures failure
  const isLeapMonth = value.length === 4;
  if (
    !(monthNumber >= 0) ||
    digits !== digitsForMonthNumber[monthNumber] ||
    value[0] !== 'M' ||
    (isLeapMonth ? value[3] !== 'L' : value.length !== 3 || monthNumber === 0)
  ) {
    throw new RangeErrorCtor(`bad month code ${value}; must match M01-M99 or M00L-M99L`);
  }
  return { monthNumber, isLeapMonth };
}

export function CreateMonthCode(monthNumber, isLeapMonth) {
  const numberPart = Call(StringPrototypePadStart, `${monthNumber}`, [2, '0']);
  return isLeapMonth ? `M${numberPart}L` : `M${numberPart}`;
}
