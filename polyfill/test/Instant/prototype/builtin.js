// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { Instant } = Temporal;

assert.sameValue(Object.isExtensible(Instant.prototype), true,
  "Built-in objects must be extensible.");

assert.sameValue(Object.getPrototypeOf(Instant.prototype), Object.prototype,
  "Built-in prototype objects must have Object.prototype as their prototype.");
