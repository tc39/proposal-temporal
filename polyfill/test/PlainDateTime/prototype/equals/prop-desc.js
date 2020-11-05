// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
includes: [propertyHelper.js]
---*/

const { PlainDateTime } = Temporal;
assert.sameValue(
  typeof PlainDateTime.prototype.equals,
  "function",
  "`typeof DateTime.prototype.equals` is `function`"
);

verifyProperty(PlainDateTime.prototype, "equals", {
  writable: true,
  enumerable: false,
  configurable: true,
});
