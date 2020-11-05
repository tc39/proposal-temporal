// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime.prototype.subtract
---*/

function CustomError() {}

const datetime = Temporal.PlainDateTime.from({ year: 2000, month: 5, day: 2, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 });
Object.defineProperty(datetime, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => datetime.subtract({ nanoseconds: 1 }));
