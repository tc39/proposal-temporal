// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.fromepochmilliseconds
---*/

let called = false;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    called = true;
    super(ns);
  }
}

assert.throws(RangeError, () => MyAbsolute.fromEpochMilliseconds(86400_00_000_000_001n));
assert.sameValue(called, false);
