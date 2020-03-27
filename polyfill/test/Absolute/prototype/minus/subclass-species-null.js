// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.minus
---*/

let called = 0;

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    assert.sameValue(ns, 10n, "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyAbsolute.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

MyAbsolute.prototype.constructor = {
  [Symbol.species]: null,
};

const result = instance.minus({ nanoseconds: 5 });
assert.sameValue(result.getEpochNanoseconds(), 5n, "getEpochNanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.Absolute.prototype);
