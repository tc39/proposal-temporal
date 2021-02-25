// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getoffsetstringfor
includes: [compareArray.js, temporalHelpers.js]
---*/

const actual = [];
const expected = [
  "get timeZone.getOffsetNanosecondsFor",
  "get timeZone.getPossibleInstantsFor",
  "get timeZone.toString",
  "call timeZone.getOffsetNanosecondsFor",
];

const instant = Temporal.Instant.from("1975-02-02T14:25:36.123456789Z");
const timeZone = new Proxy(Object.assign({}, MINIMAL_TIME_ZONE_OBJECT, {
  getOffsetNanosecondsFor(instantArg) {
    actual.push("call timeZone.getOffsetNanosecondsFor");
    assert.sameValue(instantArg, instant);
    return 9876543210123;
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

const result = Temporal.TimeZone.prototype.getOffsetStringFor.call(timeZone, instant);
assert.sameValue(result, "+02:44:36.543210123");
assert.compareArray(actual, expected);
