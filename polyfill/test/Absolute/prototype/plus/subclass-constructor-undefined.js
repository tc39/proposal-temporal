// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.plus
---*/

let called = 0;
let constructorArguments = [10n];

class MyAbsolute extends Temporal.Absolute {
  constructor(ns) {
    assert.sameValue(ns, constructorArguments.shift(), "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyAbsolute.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

MyAbsolute.prototype.constructor = undefined;

const result = instance.plus({ nanoseconds: 5 });
assert.sameValue(result.getEpochNanoseconds(), 15n, "getEpochNanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.Absolute.prototype);
