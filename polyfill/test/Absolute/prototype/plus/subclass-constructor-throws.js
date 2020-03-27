// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.plus
---*/

function CustomError() {}

const absolute = Temporal.Absolute.fromEpochNanoseconds(10n);
Object.defineProperty(absolute, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => absolute.plus({ nanoseconds: 1 }));
