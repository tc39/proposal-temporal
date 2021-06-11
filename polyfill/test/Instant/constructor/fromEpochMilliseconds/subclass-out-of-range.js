// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.fromepochmilliseconds
features: [Temporal]
---*/

let called = false;

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    called = true;
    super(ns);
  }
}

assert.throws(RangeError, () => MyInstant.fromEpochMilliseconds(86400_00_000_000_001));
assert.sameValue(called, false);
