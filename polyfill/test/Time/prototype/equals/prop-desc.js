// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { Time } = Temporal;
assert.sameValue(
  typeof Time.prototype.equals,
  "function",
  "`typeof Time.prototype.equals` is `function`"
);

verifyProperty(Time.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
