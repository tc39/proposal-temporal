import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal, throws } = assert;

import { CreateMonthCode, ParseMonthCode } from '../lib/monthcode.mjs';

function badMonthCode(code) {
  throws(() => ParseMonthCode(code), RangeError, code);
}

describe('ParseMonthCode', () => {
  it('all Gregorian month codes', () => {
    ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'].forEach((code, ix) => {
      deepEqual(ParseMonthCode(code), { monthNumber: ix + 1, isLeapMonth: false });
    });
  });
  it('Intercalary month 13', () => {
    deepEqual(ParseMonthCode('M13'), { monthNumber: 13, isLeapMonth: false });
  });
  it('all Chinese leap month codes', () => {
    ['M01L', 'M02L', 'M03L', 'M04L', 'M05L', 'M06L', 'M07L', 'M08L', 'M09L', 'M10L', 'M11L', 'M12L'].forEach(
      (code, ix) => {
        deepEqual(ParseMonthCode(code), { monthNumber: ix + 1, isLeapMonth: true });
      }
    );
  });
  it('M00L (valid but does not occur in currently supported calendars)', () => {
    deepEqual(ParseMonthCode('M00L'), { monthNumber: 0, isLeapMonth: true });
  });
  it('various other month codes that do not occur in currently supported calendars', () => {
    const tests = [
      ['M14', 14, false],
      ['M13L', 13, true],
      ['M99', 99, false],
      ['M99L', 99, true],
      ['M42', 42, false],
      ['M57L', 57, true]
    ];
    for (const [code, monthNumber, isLeapMonth] of tests) {
      deepEqual(ParseMonthCode(code), { monthNumber, isLeapMonth });
    }
  });
  it('goes through ToPrimitive', () => {
    ['toString', Symbol.toPrimitive].forEach((prop) => {
      const convertibleObject = {
        [prop]() {
          return 'M01';
        }
      };
      deepEqual(ParseMonthCode(convertibleObject), { monthNumber: 1, isLeapMonth: false }, prop);
    });
  });
  it('no M00', () => badMonthCode('M00'));
  it('missing leading zero', () => {
    badMonthCode('M1');
    badMonthCode('M5L');
  });
  it('number too big', () => {
    badMonthCode('M100');
    badMonthCode('M999L');
  });
  it('negative number', () => {
    badMonthCode('M-3');
    badMonthCode('M-7L');
  });
  it('decimal point', () => {
    badMonthCode('M2.');
    badMonthCode('M.9L');
    badMonthCode('M0.L');
  });
  it('no leading space', () => {
    badMonthCode('M 5');
    badMonthCode('M 9L');
  });
  it('not a number', () => {
    badMonthCode('M__');
    badMonthCode('MffL');
  });
  it('wrong leading character', () => {
    badMonthCode('m11');
    badMonthCode('N11L');
  });
  it('missing leading character', () => {
    badMonthCode('12');
    badMonthCode('03L');
  });
  it('wrong leap signifier', () => {
    badMonthCode('M06l');
    badMonthCode('M06T');
  });
  it('junk at end of string', () => badMonthCode('M04L+'));
  it('wrong primitive type', () => {
    [true, 3, Symbol('M01'), 7n].forEach((wrongType) => {
      throws(() => ParseMonthCode(wrongType), TypeError, typeof wrongType);
    });
  });
  it('wrong toString', () => {
    throws(() => ParseMonthCode({}), RangeError);
  });
});

describe('CreateMonthCode', () => {
  it('all Gregorian month codes', () => {
    ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'].forEach((code, ix) => {
      equal(CreateMonthCode(ix + 1, false), code);
    });
  });
  it('Intercalary month 13', () => equal(CreateMonthCode(13, false), 'M13'));
  it('all Chinese leap month codes', () => {
    ['M01L', 'M02L', 'M03L', 'M04L', 'M05L', 'M06L', 'M07L', 'M08L', 'M09L', 'M10L', 'M11L', 'M12L'].forEach(
      (code, ix) => {
        equal(CreateMonthCode(ix + 1, true), code);
      }
    );
  });
  it('M00L (valid but does not occur in currently supported calendars)', () => equal(CreateMonthCode(0, true), 'M00L'));
  it('various other month codes that do not occur in currently supported calendars', () => {
    const tests = [
      [14, false, 'M14'],
      [13, true, 'M13L'],
      [99, false, 'M99'],
      [99, true, 'M99L'],
      [42, false, 'M42'],
      [57, true, 'M57L']
    ];
    for (const [monthNumber, isLeapMonth, code] of tests) {
      equal(CreateMonthCode(monthNumber, isLeapMonth), code);
    }
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
