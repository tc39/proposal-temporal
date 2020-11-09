// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.prototype.subtract
---*/

function CustomError() {}

const duration = Temporal.Duration.from({ days: 4, hours: 5, minutes: 6, seconds: 7, milliseconds: 987, microseconds: 654, nanoseconds: 321 });
Object.defineProperty(duration, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => duration.subtract({ nanoseconds: 1 }));
