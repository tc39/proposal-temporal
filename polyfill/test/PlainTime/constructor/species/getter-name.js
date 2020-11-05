// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.time-@@species
info: |
    The value of the "name" property of this function is "get [Symbol.species]".

    Unless otherwise specified, the "name" property of a built-in function object, if it exists,
    has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }.
includes: [propertyHelper.js]
features: [Symbol.species]
---*/

const descriptor = Object.getOwnPropertyDescriptor(Temporal.PlainTime, Symbol.species);
assert.sameValue(typeof descriptor, "object", "Symbol.species descriptor should exist");
verifyProperty(descriptor.get, "name", {
  value: "get [Symbol.species]",
  writable: false,
  enumerable: false,
  configurable: true,
});
