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
const { throws } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainTime } = Temporal;

describe('Time', () => {
  describe('Time.from() works', () => {
    it('space not accepted as time designator prefix', () => {
      // TODO ptomato
      throws(() => PlainTime.from(' 15:23:30'), RangeError);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
