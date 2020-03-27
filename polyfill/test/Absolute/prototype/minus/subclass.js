// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.minus
---*/

let called = 0;

const constructorArguments = [
  10n,
  5n,
];

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    assert.sameValue(ns, constructorArguments.shift(), "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyAbsolute.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

const result = instance.minus({ nanoseconds: 5 });
assert.sameValue(result.getEpochNanoseconds(), 5n, "getEpochNanoseconds result");
assert.sameValue(called, 2);
assert.sameValue(Object.getPrototypeOf(result), MyAbsolute.prototype);
