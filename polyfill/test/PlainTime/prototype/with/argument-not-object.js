// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.with
info: |
    Temporal.PlainTime.prototype.with ( temporalTimeLike [ , options ] )

    3. If Type(temporalTimeLike) is not Object, then
        a. Throw a TypeError exception.
features: [Temporal]
---*/

const instance = new Temporal.PlainTime(12, 34, 56, 987, 654, 321);

assert.throws(TypeError, () => instance.with(undefined), "undefined");
assert.throws(TypeError, () => instance.with(null), "null");
assert.throws(TypeError, () => instance.with(true), "true");
assert.throws(TypeError, () => instance.with(""), "empty string");
assert.throws(TypeError, () => instance.with(Symbol()), "symbol");
assert.throws(TypeError, () => instance.with(1), "1");
assert.throws(TypeError, () => instance.with(1n), "1n");
