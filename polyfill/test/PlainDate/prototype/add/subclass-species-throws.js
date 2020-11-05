// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.add
features: [Symbol.species]
---*/

function CustomError() {}

const date = Temporal.PlainDate.from({ year: 2000, month: 5, day: 2 });
date.constructor = {
  get [Symbol.species]() {
    throw new CustomError();
  },
};

assert.throws(CustomError, () => date.add({ days: 1 }));
