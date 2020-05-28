// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal-comparetemporaldate
---*/

function CustomError() {}

class AvoidGettersDate extends Temporal.Date {
  get year() {
    throw new CustomError();
  }
  get month() {
    throw new CustomError();
  }
  get day() {
    throw new CustomError();
  }
}

const one = new AvoidGettersDate(2000, 5, 2);
const two = new AvoidGettersDate(2006, 3, 25);
assert.sameValue(Temporal.Date.compare(one, two), -1);
