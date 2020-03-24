// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.plus
features: [BigInt]
---*/

let called = 0;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    ++called;
    super(ns);
  }
}

const instance = MyAbsolute.fromEpochNanoseconds(8640000000000000000000n);
assert.sameValue(called, 1);

assert.throws(RangeError, () => instance.plus({ nanoseconds: 1 }));
assert.sameValue(called, 1);
