// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal-now-@@tostringtag
features: [Symbol.toStringTag, Temporal]
---*/

assert.sameValue(String(Temporal.Now), "[object Temporal.Now]");
