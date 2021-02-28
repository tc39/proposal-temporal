// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const { Duration } = Temporal;

const durationString = 'PT0.084000159S';
const duration = Duration.from(durationString);
const precisionString = duration.toString({
  smallestUnit: 'milliseconds'
});

assert.sameValue(durationString, duration.toString());
assert.sameValue(precisionString, "PT0.084S");
