// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getpossibleabsolutesfor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(null), "null");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor("2020-01-02T12:34:56Z"), "string");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(5), "number");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getPossibleInstantsFor({}), "plain object");
