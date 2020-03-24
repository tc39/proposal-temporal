// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.minus
---*/

const instance = Temporal.Absolute.fromEpochSeconds(10);
assert.throws(TypeError, () => instance.minus("P3D"));
