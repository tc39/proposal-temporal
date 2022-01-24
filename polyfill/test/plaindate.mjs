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
const { equal } = assert;

import * as Temporal from 'proposal-temporal';
const { PlainDate } = Temporal;

describe('Date', () => {
  describe('date.add() works', () => {
    let date = new PlainDate(1976, 11, 18);
    it('date.add({ years: 43 })', () => {
      equal(`${date.add({ years: 43 })}`, '2019-11-18');
    });
    it('date.add({ months: 3 })', () => {
      equal(`${date.add({ months: 3 })}`, '1977-02-18');
    });
    it('date.add({ days: 20 })', () => {
      equal(`${date.add({ days: 20 })}`, '1976-12-08');
    });
    it('new Date(2019, 1, 31).add({ months: 1 })', () => {
      equal(`${new PlainDate(2019, 1, 31).add({ months: 1 })}`, '2019-02-28');
    });
    it('date.add(durationObj)', () => {
      equal(`${date.add(Temporal.Duration.from('P43Y'))}`, '2019-11-18');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('2019-11-18').add({ years: -43 })}`, '1976-11-18');
      equal(`${PlainDate.from('1977-02-18').add({ months: -3 })}`, '1976-11-18');
      equal(`${PlainDate.from('1976-12-08').add({ days: -20 })}`, '1976-11-18');
      equal(`${PlainDate.from('2019-02-28').add({ months: -1 })}`, '2019-01-28');
    });
  });
  describe('date.subtract() works', () => {
    const date = PlainDate.from('2019-11-18');
    it('date.subtract({ years: 43 })', () => {
      equal(`${date.subtract({ years: 43 })}`, '1976-11-18');
    });
    it('date.subtract({ months: 11 })', () => {
      equal(`${date.subtract({ months: 11 })}`, '2018-12-18');
    });
    it('date.subtract({ days: 20 })', () => {
      equal(`${date.subtract({ days: 20 })}`, '2019-10-29');
    });
    it('Date.from("2019-02-28").subtract({ months: 1 })', () => {
      equal(`${PlainDate.from('2019-02-28').subtract({ months: 1 })}`, '2019-01-28');
    });
    it('Date.subtract(durationObj)', () => {
      equal(`${date.subtract(Temporal.Duration.from('P43Y'))}`, '1976-11-18');
    });
    it('symmetrical with regard to negative durations', () => {
      equal(`${PlainDate.from('1976-11-18').subtract({ years: -43 })}`, '2019-11-18');
      equal(`${PlainDate.from('2018-12-18').subtract({ months: -11 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-10-29').subtract({ days: -20 })}`, '2019-11-18');
      equal(`${PlainDate.from('2019-01-28').subtract({ months: -1 })}`, '2019-02-28');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
