// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochmilliseconds
---*/

let called = false;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    assert.sameValue(ns, 10_000_000n, "constructor argument");
    called = true;
    super(ns);
  }
}

const result = MyAbsolute.fromEpochMilliseconds(10);
assert.sameValue(result.getEpochNanoseconds(), 10_000_000n, "getEpochNanoseconds result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyAbsolute.prototype);
