// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.with
features: [Symbol.species]
---*/

function CustomError() {}

const duration = Temporal.Duration.from({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 987, microseconds: 654, nanoseconds: 321 });
duration.constructor = {
  get [Symbol.species]() {
    throw new CustomError();
  },
};

assert.throws(CustomError, () => duration.with({ nanoseconds: 1 }));
