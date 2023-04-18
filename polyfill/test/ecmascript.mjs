import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, equal, throws } = assert;

import bigInt from 'big-integer';

import * as ES from '../lib/ecmascript.mjs';
import { GetSlot, TIMEZONE_ID } from '../lib/slots.mjs';
import { TimeZone } from '../lib/timezone.mjs';

describe('ECMAScript', () => {
  describe('GetFormatterParts', () => {
    // https://github.com/tc39/proposal-temporal/issues/575
    test(1589670000000, GetSlot(TimeZone.from('Europe/London'), TIMEZONE_ID), {
      year: 2020,
      month: 5,
      day: 17,
      hour: 0,
      minute: 0,
      second: 0
    });

    function test(nanos, zone, expected) {
      it(`${nanos} @ ${zone}`, () => deepEqual(ES.GetFormatterParts(zone, nanos), expected));
    }
  });

  describe('GetOptionsObject', () => {
    it('Options parameter can only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('1'), 1n].forEach((options) =>
        throws(() => ES.GetOptionsObject(options), TypeError)
      );
    });
  });

  describe('RoundNumberToIncrement', () => {
    const increment = bigInt(100);
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
          it(`rounds ${value} to ${expected}`, () => {
            const result = ES.RoundNumberToIncrement(bigInt(value), increment, roundingMode);
            equal(result.toJSNumber(), expected);
          });
        });
      });
    }
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
