#! /usr/bin/env -S node --experimental-modules

// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { equal } = assert;

import * as Temporal from 'proposal-temporal';

describe('Built-in calendars (not standardized yet)', () => {
  describe('gregory', () => {
    it('era CE', () => {
      const date = Temporal.PlainDate.from('1999-12-31[u-ca=gregory]');
      equal(date.era, 'ce');
      equal(date.eraYear, 1999);
      equal(date.year, 1999);
    });
    it('era BCE', () => {
      const date = Temporal.PlainDate.from('-000001-12-31[u-ca=gregory]');
      equal(date.era, 'bce');
      equal(date.eraYear, 2);
      equal(date.year, -1);
    });
    it('can create from fields with era CE', () => {
      const date = Temporal.PlainDate.from({ era: 'ce', eraYear: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('era CE is the default', () => {
      const date = Temporal.PlainDate.from({ year: 1999, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '1999-12-31[u-ca=gregory]');
    });
    it('can create from fields with era BCE', () => {
      const date = Temporal.PlainDate.from({ era: 'bce', eraYear: 2, month: 12, day: 31, calendar: 'gregory' });
      equal(`${date}`, '-000001-12-31[u-ca=gregory]');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
