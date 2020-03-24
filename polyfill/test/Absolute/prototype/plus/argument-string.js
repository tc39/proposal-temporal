// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.plus
---*/

const instance = Temporal.Absolute.fromEpochSeconds(10);
assert.throws(TypeError, () => instance.plus("P3D"));
