// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.absolute.prototype.tostring
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.toString",
];

const absolute = Temporal.Absolute.from("1975-02-02T14:25:36.123456789+02:00");
const timeZone = new Temporal.TimeZone("UTC");
Object.defineProperty(timeZone, "toString", {
  get() {
    actual.push("get timeZone.toString");
    return undefined;
  },
});

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return undefined;
  },
});

assert.sameValue(absolute.toString(timeZone), "1975-02-02T12:25:36.123456789Z");
assert.compareArray(actual, expected);
