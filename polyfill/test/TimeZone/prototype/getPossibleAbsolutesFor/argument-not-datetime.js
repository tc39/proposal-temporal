// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getpossibleabsolutesfor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(null), "null");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor("2020-01-02T12:34:56Z"), "string");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(5), "number");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getPossibleAbsolutesFor({}), "plain object");
