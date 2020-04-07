// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.monthday.from
---*/

assert.throws(TypeError, () => Temporal.MonthDay.from.call(undefined, "05-02"), "undefined");
assert.throws(TypeError, () => Temporal.MonthDay.from.call(null, "05-02"), "null");
assert.throws(TypeError, () => Temporal.MonthDay.from.call(true, "05-02"), "true");
assert.throws(TypeError, () => Temporal.MonthDay.from.call("test", "05-02"), "string");
assert.throws(TypeError, () => Temporal.MonthDay.from.call(Symbol(), "05-02"), "Symbol");
assert.throws(TypeError, () => Temporal.MonthDay.from.call(7, "05-02"), "number");
assert.throws(TypeError, () => Temporal.MonthDay.from.call(7n, "05-02"), "bigint");
assert.throws(TypeError, () => Temporal.MonthDay.from.call({}, "05-02"), "Non-callable object");
