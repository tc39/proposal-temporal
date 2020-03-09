// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochnanoseconds
---*/

let called = false;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    assert.sameValue(ns, 10n, "constructor argument");
    called = true;
    super(ns);
  }
}

const result = MyAbsolute.fromEpochNanoseconds(10n);
assert.sameValue(result.getEpochNanoseconds(), 10n, "getEpochNanoseconds result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyAbsolute.prototype);
