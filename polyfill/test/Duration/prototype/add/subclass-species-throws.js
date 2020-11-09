// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.add
features: [Symbol.species]
---*/

function CustomError() {}

const duration = Temporal.Duration.from({ days: 4, hours: 5, minutes: 6, seconds: 7, milliseconds: 987, microseconds: 654, nanoseconds: 321 });
duration.constructor = {
  get [Symbol.species]() {
    throw new CustomError();
  },
};

assert.throws(CustomError, () => duration.add({ nanoseconds: 1 }));
