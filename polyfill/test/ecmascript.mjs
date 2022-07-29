import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { deepEqual, throws } = assert;

import { ES } from '../lib/ecmascript.mjs';
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
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
