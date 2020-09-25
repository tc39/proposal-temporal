// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant.prototype.minus
features: [Symbol.species]
---*/

function CustomError() {}

const instant = Temporal.Instant.fromEpochNanoseconds(10n);
instant.constructor = {
  get [Symbol.species]() {
    throw new CustomError();
  },
};

assert.throws(CustomError, () => instant.minus({ nanoseconds: 1 }));
