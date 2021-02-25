// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindate
includes: [compareArray.js, temporalHelpers.js]
---*/

const actual = [];
const expected = [
  "get Temporal.TimeZone.from",
  "call Temporal.TimeZone.from",
  "get timeZone.getOffsetNanosecondsFor",
  "get timeZone.getPossibleInstantsFor",
  "get timeZone.toString",
  "call timeZone.getOffsetNanosecondsFor",
];

Object.defineProperty(Temporal.PlainDateTime.prototype, "toPlainDate", {
  get() {
    actual.push("get Temporal.PlainDateTime.prototype.toPlainDate");
    return function() {
      actual.push("call Temporal.PlainDateTime.prototype.toPlainDate");
    };
  },
});

const timeZone = new Proxy(Object.assign({}, MINIMAL_TIME_ZONE_OBJECT, {
  getOffsetNanosecondsFor(instant) {
    actual.push("call timeZone.getOffsetNanosecondsFor");
    assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
    return 86399_999_999_999;
  },
}), {
  has(target, property) {
    actual.push(`has timeZone.${property}`);
    return property in target;
  },
  get(target, property) {
    actual.push(`get timeZone.${property}`);
    return target[property];
  },
});

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return function(argument) {
      actual.push("call Temporal.TimeZone.from");
      assert.sameValue(argument, "UTC");
      return timeZone;
    };
  },
});

const result = Temporal.now.plainDate("iso8601", "UTC");
assert.notSameValue(result, undefined);
assert.sameValue(result instanceof Temporal.PlainDate, true);

assert.compareArray(actual, expected);
