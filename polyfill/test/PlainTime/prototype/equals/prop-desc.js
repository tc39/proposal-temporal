// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { PlainTime } = Temporal;
assert.sameValue(
  typeof PlainTime.prototype.equals,
  "function",
  "`typeof Time.prototype.equals` is `function`"
);

verifyProperty(PlainTime.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
