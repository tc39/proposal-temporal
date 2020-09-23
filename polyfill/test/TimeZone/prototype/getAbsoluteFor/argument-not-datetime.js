// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getabsolutefor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getInstantFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getInstantFor(null), "null");
assert.throws(TypeError, () => timeZone.getInstantFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getInstantFor("2020-01-02T12:34:56"), "string");
assert.throws(TypeError, () => timeZone.getInstantFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getInstantFor(5), "number");
assert.throws(TypeError, () => timeZone.getInstantFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getInstantFor({ year: 2020 }), "plain object");
