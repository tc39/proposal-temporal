// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.fromepochseconds
features: [Temporal]
---*/

let called = false;

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    called = true;
    super(ns);
  }
}

assert.throws(RangeError, () => MyInstant.fromEpochSeconds(86400_00_000_001));
assert.sameValue(called, false);
