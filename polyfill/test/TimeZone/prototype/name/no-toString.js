// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.name
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.toString",
];

const timeZone = new Temporal.TimeZone("UTC");
Object.defineProperty(timeZone, "toString", {
  get() {
    actual.push("get timeZone.toString");
    return undefined;
  },
});

const descriptor = Object.getOwnPropertyDescriptor(Temporal.TimeZone.prototype, "name");
const result = descriptor.get.call(timeZone);
assert.sameValue(result, "UTC");

assert.compareArray(actual, expected);
