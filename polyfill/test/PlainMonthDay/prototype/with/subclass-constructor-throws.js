// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.prototype.with
---*/

function CustomError() {}

const monthday = Temporal.PlainMonthDay.from({ month: 5, day: 2 });
Object.defineProperty(monthday, "constructor", {
  get() {
    throw new CustomError();
  }
});

assert.throws(CustomError, () => monthday.with({ day: 20 }));
