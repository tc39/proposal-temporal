/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad } from './util.mjs';
import { ZonedInstant } from './zonedinstant.mjs';

export const VALUE = Symbol('value');

export class Instant {
  constructor(nanos = 0) {
    if('bigint' !== typeof nanos) { nanos = BigInt(nanos); }
    const milliseconds = Number(nanos / BigInt(1e6));
    const nanoseconds = Number(nanos % BigInt(1e6));
    this[VALUE] = { milliseconds, nanoseconds };
  }

  get milliseconds() { return this[VALUE].milliseconds; }
  get nanoseconds() { return this[VALUE].nanoseconds; }

  plus(data) {
    const object = Object.create(Instant.prototype);
    object[VALUE] = fromParts(
      plus(
        toParts(this[VALUE]),
        data
      )
    );
    return object;
  }
  withZone(zone) {
    return new ZonedInstant(this, zone);
  }
  toString() {
    return this.withZone('UTC').toString();
  }

  toDate() {
    return new Date(this.milliseconds);
  }
  valueOf() {
    return BigInt(this[VALUE].milliseconds) * BigInt(1e6) + BigInt(this[VALUE].nanoseconds);
  }
  format(locale, options) {
    return this.withZone().format(locale, options);
  }

  static now() {
    const object = Object.create(Instant.prototype);
    object[VALUE] = {
      milliseconds: Date.now(),
      nanoseconds: 0
    };
    return object;
  }
  static fromDate(date) {
    const object = Object.create(Instant.prototype);
    object[VALUE] = {
      milliseconds: (date || 0).valueOf(),
      nanoseconds: 0
    };
    return object;
  }

  static parse(string) {
    return ZonedInstant.parse(string).toInstant();
  }
}

function toParts(value) {
  const millis = value.milliseconds;
  const date = new Date(millis);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const millisecond = date.getUTCMilliseconds();
  const nanosecond = value.nanoseconds;
  return { year, month, day, hour, minute, second, millisecond, nanosecond };
}
function fromParts({ year = 0, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0, nanoseconds = 0 }) {
  const milliseconds = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  return { milliseconds, nanoseconds };
}
