// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.time.with
---*/

function CustomError() {}

const time = Temporal.Time.from({ hour: 12, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
Object.defineProperty(time, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => time.with({ nanosecond: 1 }));
