// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.instant
features: [Temporal]
---*/

const bigIntInstant = new Temporal.Instant(217175010123456789n);
assert(bigIntInstant instanceof Temporal.Instant, "BigInt instanceof");
assert.sameValue(bigIntInstant.epochSeconds, 217175010, "BigInt epochSeconds");
assert.sameValue(bigIntInstant.epochMilliseconds, 217175010123, "BigInt epochMilliseconds");

const stringInstant = new Temporal.Instant("217175010123456789");
assert(stringInstant instanceof Temporal.Instant, "BigInt instanceof");
assert.sameValue(stringInstant.epochSeconds, 217175010, "BigInt epochSeconds");
assert.sameValue(stringInstant.epochMilliseconds, 217175010123, "BigInt epochMilliseconds");

assert.throws(SyntaxError, () => new Temporal.Instant("abc123"), "invalid BigInt syntax");
