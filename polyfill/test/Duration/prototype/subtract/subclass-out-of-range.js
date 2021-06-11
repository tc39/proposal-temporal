// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.subtract
includes: [compareArray.js]
features: [Temporal]
---*/

let called = 0;

class MyDuration extends Temporal.Duration {
  constructor(...args) {
    ++called;
    super(...args);
  }
}

const instance = new MyDuration(0, 0, 0, 0, 0, 0, 0, 0, 0, -Number.MAX_VALUE);
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.subtract({ nanoseconds: Number.MAX_VALUE }));
assert.sameValue(called, 1);
