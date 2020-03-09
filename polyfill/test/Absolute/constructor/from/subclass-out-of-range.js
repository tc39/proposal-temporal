// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.from
---*/

let called = false;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    called = true;
    super(ns);
  }
}

assert.throws(RangeError, () => MyAbsolute.from("-271821-04-19T23:59:59.999999999Z"));
assert.throws(RangeError, () => MyAbsolute.from("+275760-09-13T00:00:00.000000001Z"));
assert.sameValue(called, false);
