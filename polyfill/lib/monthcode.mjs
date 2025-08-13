import {
  String as StringCtor,
  RangeError as RangeErrorCtor,
  TypeError as TypeErrorCtor,
  StringPrototypePadStart,
  RegExpPrototypeExec
} from './primordials.mjs';

import Call from 'es-abstract/2024/Call.js';
import ToPrimitive from 'es-abstract/2024/ToPrimitive.js';

import { monthCode as MONTH_CODE_REGEX } from './regex.mjs';

export function ParseMonthCode(argument) {
  const value = ToPrimitive(argument, StringCtor);
  if (typeof value !== 'string') throw new TypeErrorCtor('month code must be a string');
  const match = Call(RegExpPrototypeExec, MONTH_CODE_REGEX, [value]);
  if (!match) throw new RangeErrorCtor(`bad month code ${value}; must match M01-M99 or M00L-M99L`);
  return {
    monthNumber: +(match[1] ?? match[3] ?? match[5]),
    isLeapMonth: (match[2] ?? match[4] ?? match[6]) === 'L'
  };
}

export function CreateMonthCode(monthNumber, isLeapMonth) {
  const numberPart = Call(StringPrototypePadStart, `${monthNumber}`, [2, '0']);
  return isLeapMonth ? `M${numberPart}L` : `M${numberPart}`;
}
