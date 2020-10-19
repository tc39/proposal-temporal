// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.subtract
---*/

let called = 0;

const constructorArguments = [
  10n,
  5n,
];

class MyInstant extends Temporal.Instant {
  constructor(ns) {
    assert.sameValue(ns, constructorArguments.shift(), "constructor argument");
    ++called;
    super(ns);
  }
}

const instance = MyInstant.fromEpochNanoseconds(10n);
assert.sameValue(called, 1);

const result = instance.subtract({ nanoseconds: 5 });
assert.sameValue(result.epochNanoseconds, 5n, "epochNanoseconds result");
assert.sameValue(called, 2);
assert.sameValue(Object.getPrototypeOf(result), MyInstant.prototype);
