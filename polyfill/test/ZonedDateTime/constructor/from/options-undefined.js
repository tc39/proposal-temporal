// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.from
---*/

const overflowFields = { year: 2000, month: 13, day: 2, timeZone: "UTC" };

const overflowExplicit = Temporal.ZonedDateTime.from(overflowFields, undefined);
assert.sameValue(overflowExplicit.month, 12, "default overflow is constrain");

const overflowImplicit = Temporal.ZonedDateTime.from(overflowFields);
assert.sameValue(overflowImplicit.month, 12, "default overflow is constrain");

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
const disambiguationEarlierFields = { timeZone, year: 2000, month: 10, day: 29, hour: 1, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 };
const disambiguationLaterFields = { timeZone, year: 2000, month: 4, day: 2, hour: 2, minute: 34, second: 56, millisecond: 987, microsecond: 654, nanosecond: 321 };

const disambiguationEarlierExplicit = Temporal.ZonedDateTime.from(disambiguationEarlierFields, undefined);
assert.sameValue(disambiguationEarlierExplicit.epochNanoseconds, 972808496987654321n, "default disambiguation is compatible");

const disambiguationLaterExplicit = Temporal.ZonedDateTime.from(disambiguationLaterFields, undefined);
assert.sameValue(disambiguationLaterExplicit.epochNanoseconds, 954671696987654321n, "default disambiguation is compatible");

const disambiguationEarlierImplicit = Temporal.ZonedDateTime.from(disambiguationEarlierFields);
assert.sameValue(disambiguationEarlierImplicit.epochNanoseconds, 972808496987654321n, "default disambiguation is compatible");

const disambiguationLaterImplicit = Temporal.ZonedDateTime.from(disambiguationLaterFields);
assert.sameValue(disambiguationLaterImplicit.epochNanoseconds, 954671696987654321n, "default disambiguation is compatible");

const offsetFields = { year: 2000, month: 5, day: 2, offset: "+23:59", timeZone: "UTC" };
assert.throws(RangeError, () => Temporal.ZonedDateTime.from(offsetFields, undefined), "default offset is reject");
assert.throws(RangeError, () => Temporal.ZonedDateTime.from(offsetFields), "default offset is reject");
