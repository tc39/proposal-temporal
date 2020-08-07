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

import * as Temporal from 'proposal-temporal';

describe('Date.difference(simple, simple)', () => {
  build('Before Leap Day', '2020-01-03', '2020-02-15');
  build('Before Leap Day', '2020-01-28', '2020-02-15');
  build('Before Leap Day', '2020-01-31', '2020-02-15');
  build('Cross Leap Day', '2020-01-31', '2020-06-30');
  build('After Leap Day', '2020-03-31', '2020-06-30');
  build('After Leap Day', '2020-03-25', '2020-07-31');
});
describe('Date.difference(normal, normal)', () => {
  build('Month<2 & Month<2', '2018-01-20', '2019-01-05');
  build('Month>2 & Month>2', '2018-03-20', '2019-03-05');
  build('Month>2 & Month>2', '2018-04-20', '2019-04-05');
  build('Month<2 & Month>2', '2018-01-20', '2019-04-05');
  build('Month>2 & Month<2', '2018-03-20', '2019-01-05');
  build('Month>2 & Month<2', '2018-04-20', '2019-01-05');
});
describe('Date.difference(leap, leap)', () => {
  build('Month<2 & Month<2', '2016-01-20', '2020-01-05');
  build('Month>2 & Month>2', '2016-03-20', '2020-04-05');
  build('Month>2 & Month>2', '2016-03-20', '2020-03-05');
  build('Month<2 & Month>2', '2016-01-20', '2020-02-05');
  build('Month>2 & Month<2', '2016-03-20', '2020-01-05');
  build('Month>2 & Month<2', '2016-04-20', '2020-01-05');
});
describe('Date.difference(leap, normal)', () => {
  build('Month<2 & Month<2', '2016-01-20', '2017-01-05');
  build('Month>2 & Month>2', '2016-03-20', '2017-04-05');
  build('Month>2 & Month>2', '2016-04-20', '2017-03-05');
  build('Month<2 & Month>2', '2016-01-20', '2017-04-05');
  build('Month>2 & Month<2', '2016-03-20', '2017-01-05');
  build('Month>2 & Month<2', '2016-04-20', '2017-01-05');
});
describe('Date.difference(normal, leap)', () => {
  build('Month<2 & Month<2', '2019-01-20', '2020-01-05');
  build('Month>2 & Month>2', '2019-03-20', '2020-04-05');
  build('Month>2 & Month>2', '2019-04-20', '2020-03-05');
  build('Month<2 & Month>2', '2019-01-20', '2020-04-05');
  build('Month>2 & Month<2', '2019-03-20', '2020-01-05');
  build('Month>2 & Month<2', '2019-04-20', '2020-01-05');
});

function build(name, sone, stwo) {
  const [one, two] = [Temporal.Date.from(sone), Temporal.Date.from(stwo)].sort(Temporal.Date.compare);
  describe(name, () => {
    const largestUnits = ['years', 'months', 'weeks', 'days'];
    buildSub(one, two, largestUnits);
    buildSub(one.with({ day: 25 }), two.with({ day: 5 }), largestUnits);
    buildSub(one.with({ day: 30 }), two.with({ day: 29 }), largestUnits);
    buildSub(one.with({ day: 30 }), two.with({ day: 5 }), largestUnits);
  });
}
function buildSub(one, two, largestUnits) {
  largestUnits.forEach((largestUnit) => {
    describe(`< ${one} : ${two} (${largestUnit})>`, () => {
      const dif = two.difference(one, { largestUnit });
      const disambiguation = 'reject';
      it(`(${one}).plus(${dif}) => ${two}`, () => assert(one.plus(dif, { disambiguation }).equals(two)));
      it(`(${two}).minus(${dif}) => ${one}`, () => assert(two.minus(dif, { disambiguation }).equals(one)));
      it(`(${one}).minus(-${dif}) => ${two}`, () => assert(one.minus(dif.negated(), { disambiguation }).equals(two)));
      it(`(${two}).plus(-${dif}) => ${one}`, () => assert(two.plus(dif.negated(), { disambiguation }).equals(one)));
    });
  });
}

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
