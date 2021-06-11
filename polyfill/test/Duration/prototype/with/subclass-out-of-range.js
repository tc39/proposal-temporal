// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
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

const instance = new MyDuration();
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.with({ days: Infinity }));
assert.sameValue(called, 1);
