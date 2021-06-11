// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

assert.sameValue(typeof Temporal, "object");
verifyProperty(this, "Temporal", {
  writable: true,
  enumerable: false,
  configurable: true,
});
