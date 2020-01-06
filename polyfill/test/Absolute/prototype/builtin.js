// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const {Absolute} = Temporal;

assert.sameValue(Object.isExtensible(Absolute.prototype), true,
                 "Built-in objects must be extensible.");

assert.sameValue(Object.getPrototypeOf(Absolute.prototype), Object.prototype,
                 "Built-in prototype objects must have Object.prototype as their prototype.");
