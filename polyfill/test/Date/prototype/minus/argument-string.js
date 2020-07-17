// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.minus
---*/

const instance = Temporal.Date.from({ year: 2000, month: 5, day: 2 });
assert.throws(TypeError, () => instance.minus("P3D"));
