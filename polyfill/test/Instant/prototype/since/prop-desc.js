// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
features: [Temporal]
---*/

const { Instant } = Temporal;
assert.sameValue(
  typeof Instant.prototype.since,
  "function",
  "`typeof Instant.prototype.since` is `function`"
);

verifyProperty(Instant.prototype, "since", {
  writable: true,
  enumerable: false,
  configurable: true,
});
