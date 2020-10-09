// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.add
---*/

let called = 0;
let constructorArguments = [10n];

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    assert.sameValue(ns, constructorArguments.shift(), "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyInstant.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

MyInstant.prototype.constructor = undefined;

const result = instance.add({ nanoseconds: 5 });
assert.sameValue(result.getEpochNanoseconds(), 15n, "getEpochNanoseconds result");
assert.sameValue(called, 1);
assert.sameValue(Object.getPrototypeOf(result), Temporal.Instant.prototype);
