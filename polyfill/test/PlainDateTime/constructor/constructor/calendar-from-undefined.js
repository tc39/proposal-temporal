// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.datetime
---*/

const dateTimeArgs = [2020, 12, 24, 12, 34, 56, 123, 456, 789];

let called = 0;
Object.defineProperty(Temporal.Calendar, "from", {
  get() {
    ++called;
    return undefined;
  },
});

const dateTime = new Temporal.PlainDateTime(...dateTimeArgs, "japanese");
assert.sameValue(called, 1);
assert.sameValue(dateTime.calendar.toString(), "japanese");
