// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.tostring
---*/

const calendar = {
  toString() { return "custom"; }
};
const datetime = new Temporal.ZonedDateTime(957270896_987_650_000n, "UTC", calendar);

const explicit = datetime.toString(undefined);
assert.sameValue(
  explicit,
  "2000-05-02T12:34:56.98765+00:00[UTC][c=custom]",
  "default show options are auto, precision is auto, and rounding is trunc"
);

const implicit = datetime.toString();
assert.sameValue(
  implicit,
  "2000-05-02T12:34:56.98765+00:00[UTC][c=custom]",
  "default show options are auto, precision is auto, and rounding is trunc"
);
