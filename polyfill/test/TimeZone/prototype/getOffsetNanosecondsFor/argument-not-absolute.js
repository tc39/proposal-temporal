// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getoffsetnanosecondsfor
---*/

const timeZone = Temporal.TimeZone.from("UTC");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(undefined), "undefined");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(null), "null");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(true), "boolean");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor("2020-01-02T12:34:56Z"), "string");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(Symbol()), "Symbol");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(5), "number");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor(5n), "bigint");
assert.throws(TypeError, () => timeZone.getOffsetNanosecondsFor({}), "plain object");
