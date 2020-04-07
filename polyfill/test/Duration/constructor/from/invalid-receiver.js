// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
---*/

assert.throws(TypeError, () => Temporal.Duration.from.call(undefined, "P1Y2M3DT4H5M6.987654321S"), "undefined");
assert.throws(TypeError, () => Temporal.Duration.from.call(null, "P1Y2M3DT4H5M6.987654321S"), "null");
assert.throws(TypeError, () => Temporal.Duration.from.call(true, "P1Y2M3DT4H5M6.987654321S"), "true");
assert.throws(TypeError, () => Temporal.Duration.from.call("test", "P1Y2M3DT4H5M6.987654321S"), "string");
assert.throws(TypeError, () => Temporal.Duration.from.call(Symbol(), "P1Y2M3DT4H5M6.987654321S"), "Symbol");
assert.throws(TypeError, () => Temporal.Duration.from.call(7, "P1Y2M3DT4H5M6.987654321S"), "number");
assert.throws(TypeError, () => Temporal.Duration.from.call(7n, "P1Y2M3DT4H5M6.987654321S"), "bigint");
assert.throws(TypeError, () => Temporal.Duration.from.call({}, "P1Y2M3DT4H5M6.987654321S"), "Non-callable object");
