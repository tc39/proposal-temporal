// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal-instant-objects
description: Temporal.Instant.prototype meets the requirements for built-in objects
features: [Temporal]
---*/

const { Instant } = Temporal;

assert.sameValue(Object.isExtensible(Instant.prototype), true,
  "Built-in objects must be extensible.");

assert.sameValue(Object.getPrototypeOf(Instant.prototype), Object.prototype,
  "Built-in prototype objects must have Object.prototype as their prototype.");
