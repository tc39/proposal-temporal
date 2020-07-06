// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getoffsetstringfor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(null), "null");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getOffsetStringFor("2020-01-02T12:34:56Z"), "string");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(5), "number");
assert.throws(TypeError, () => timeZone.getOffsetStringFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getOffsetStringFor({}), "plain object");
