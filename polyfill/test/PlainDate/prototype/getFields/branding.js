// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.date.prototype.getfields
---*/

const getFields = Temporal.PlainDate.prototype.getFields;

assert.sameValue(typeof getFields, "function");

assert.throws(TypeError, () => getFields.call(undefined), "undefined");
assert.throws(TypeError, () => getFields.call(null), "null");
assert.throws(TypeError, () => getFields.call(true), "true");
assert.throws(TypeError, () => getFields.call(""), "empty string");
assert.throws(TypeError, () => getFields.call(Symbol()), "symbol");
assert.throws(TypeError, () => getFields.call(1), "1");
assert.throws(TypeError, () => getFields.call({}), "plain object");
assert.throws(TypeError, () => getFields.call(Temporal.PlainDate), "Temporal.PlainDate");
assert.throws(TypeError, () => getFields.call(Temporal.PlainDate.prototype), "Temporal.PlainDate.prototype");
