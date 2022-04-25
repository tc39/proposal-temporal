#! /usr/bin/env -S node --experimental-modules

/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal, throws } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainDateTime } = Temporal;

describe('DateTime', () => {
  describe('dateTime.toString()', () => {
    const dt1 = PlainDateTime.from('1976-11-18T15:23');
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(dt1.toString({ calendarName: 'auto' }), '1976-11-18T15:23:00');
      equal(dt1.withCalendar('gregory').toString({ calendarName: 'auto' }), '1976-11-18T15:23:00[u-ca=gregory]');
    });
    it('shows ISO calendar if calendarName = always', () => {
      equal(dt1.toString({ calendarName: 'always' }), '1976-11-18T15:23:00[u-ca=iso8601]');
    });
    it('omits non-ISO calendar if calendarName = never', () => {
      equal(dt1.withCalendar('gregory').toString({ calendarName: 'never' }), '1976-11-18T15:23:00');
    });
    it('default is calendar = auto', () => {
      equal(dt1.toString(), '1976-11-18T15:23:00');
      equal(dt1.withCalendar('gregory').toString(), '1976-11-18T15:23:00[u-ca=gregory]');
    });
    it('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
        throws(() => dt1.toString({ calendarName }), RangeError);
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
