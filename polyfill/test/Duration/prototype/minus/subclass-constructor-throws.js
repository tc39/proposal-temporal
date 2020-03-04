// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.protoype.minus
---*/

function CustomError() {}

const duration = Temporal.Duration.from({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 987, microseconds: 654, nanoseconds: 321 });
Object.defineProperty(duration, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => duration.minus({ nanoseconds: 1 }));
