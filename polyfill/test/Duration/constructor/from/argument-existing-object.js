// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.duration.from
---*/

const unbalanced = Temporal.Duration.from({ milliseconds: 1000 });
assert.sameValue(unbalanced.seconds, 0);
assert.sameValue(unbalanced.milliseconds, 1000);

const balanced = Temporal.Duration.from(unbalanced, { disambiguation: "balance" });
assert.notSameValue(balanced, unbalanced);
assert.sameValue(unbalanced.seconds, 0);
assert.sameValue(unbalanced.milliseconds, 1000);
assert.sameValue(balanced.seconds, 1);
assert.sameValue(balanced.milliseconds, 0);
