// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaindate.from
description: overflow property is extracted with string argument.
info: |
    1. If Type(_item_) is Object, then
      1. ...
      1. Return ? DateFromFields(_calendar_, _fields_, _options_).
    1. Perform ? ToTemporalOverflow(_options_).
includes: [compareArray.js]
---*/

const expected = [
  "get overflow",
  "get toString",
  "call toString",
];

let actual = [];
const object = {
  get overflow() {
    actual.push("get overflow");
    return {
      get toString() {
        actual.push("get toString");
        return function() {
          actual.push("call toString");
          return "reject";
        };
      },
    };
  }
};

const result = Temporal.PlainDate.from("2021-05-17", object);
assert.compareArray(actual, expected, "Successful call");
assert.sameValue(result.toString(), "2021-05-17");

actual = [];
assert.throws(RangeError, () => Temporal.PlainDate.from(7, object));
assert.compareArray(actual, expected, "Failing call");
