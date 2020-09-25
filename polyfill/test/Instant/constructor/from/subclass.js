// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.from
features: [Symbol.species]
---*/

let called = false;

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    assert.sameValue(ns, 217_175_010_123_456_789n, "constructor argument");
    called = true;
    super(ns);
  }
}

const result = MyInstant.from("1976-11-18T14:23:30.123456789Z");
assert.sameValue(result.getEpochNanoseconds(), 217_175_010_123_456_789n, "getEpochNanoseconds result");
assert.sameValue(called, true);
assert.sameValue(Object.getPrototypeOf(result), MyInstant.prototype);
