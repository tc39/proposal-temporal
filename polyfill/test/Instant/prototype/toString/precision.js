// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

const { Instant } = Temporal;

const isoString = '2020-01-01T23:58:57.012034Z';
const instant = Instant.from(isoString);
const instantIsoStrMicros = instant.toString({
  smallestUnit: 'microseconds'
});

assert.sameValue(instantIsoStrMicros, isoString);
