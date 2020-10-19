// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.fromepochnanoseconds
---*/

let called = false;

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    assert.sameValue(ns, 10n, "constructor argument");
    called = true;
    super(ns);
  }
}

const result = MyInstant.fromEpochNanoseconds(10n);
assert.sameValue(result.epochNanoseconds, 10n, "epochNanoseconds result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyInstant.prototype);
