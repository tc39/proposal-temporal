// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.timezone.prototype.getinstantfor
features: [BigInt]
---*/

const datetimeEarlier = new Temporal.PlainDateTime(2000, 10, 29, 1, 34, 56, 987, 654, 321);
const datetimeLater = new Temporal.PlainDateTime(2000, 4, 2, 2, 34, 56, 987, 654, 321);

// Time zone that implements a spring-forward/fall-back transition, for the
// purpose of testing the disambiguation option, without depending on system
// time zone data
const timeZone = {
  getOffsetNanosecondsFor(instant) {
    if (instant.epochNanoseconds < 954669600_000_000_000n ||
      instant.epochNanoseconds >= 972810000_000_000_000n) {
      return -28800_000_000_000;
    }
    return -25200_000_000_000;
  },
  getInstantFor(datetime, options) {
    return Temporal.TimeZone.prototype.getInstantFor.call(this, datetime, options);
  },
  getPossibleInstantsFor(datetime) {
    const springForward = new Temporal.PlainDateTime(2000, 4, 2, 2);
    const fallBack = new Temporal.PlainDateTime(2000, 10, 29, 1);
    const { compare } = Temporal.PlainDateTime;
    if (compare(datetime, springForward) >= 0 && compare(datetime, springForward.add({ hours: 1 })) < 0) {
      return [];
    }
    const winterOffset = new Temporal.TimeZone('-08:00');
    const summerOffset = new Temporal.TimeZone('-07:00');
    if (compare(datetime, fallBack) >= 0 && compare(datetime, fallBack.add({ hours: 1 })) < 0) {
      return [summerOffset.getInstantFor(datetime), winterOffset.getInstantFor(datetime)];
    }
    if (compare(datetime, springForward) < 0 || compare(datetime, fallBack) >= 0) {
      return [winterOffset.getInstantFor(datetime)];
    }
    return [summerOffset.getInstantFor(datetime)];
  }
};

const explicitEarlier = timeZone.getInstantFor(datetimeEarlier, undefined);
assert.sameValue(explicitEarlier.epochNanoseconds, 972808496987654321n, "default disambiguation is compatible");

const explicitLater = timeZone.getInstantFor(datetimeLater, undefined);
assert.sameValue(explicitLater.epochNanoseconds, 954671696987654321n, "default disambiguation is compatible");

const implicitEarlier = timeZone.getInstantFor(datetimeEarlier);
assert.sameValue(implicitEarlier.epochNanoseconds, 972808496987654321n, "default disambiguation is compatible");

const implicitLater = timeZone.getInstantFor(datetimeLater);
assert.sameValue(implicitLater.epochNanoseconds, 954671696987654321n, "default disambiguation is compatible");
