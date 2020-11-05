// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.monthday-@@species
info: |
    Its get accessor function performs the following steps:
    1. Return the this value.
features: [Symbol.species]
---*/

const descriptor = Object.getOwnPropertyDescriptor(Temporal.PlainMonthDay, Symbol.species);
assert.sameValue(typeof descriptor, "object", "Symbol.species descriptor should exist");

const thisValue = {};
assert.sameValue(descriptor.get.call(thisValue), thisValue);
