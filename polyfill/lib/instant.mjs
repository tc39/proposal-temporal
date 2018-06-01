/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad } from './util.mjs';
import { ZonedInstant } from './zonedinstant.mjs';

const VALUE = Symbol('value');

export class Instant {
  constructor(nanoseconds = 0) {
    this[VALUE] = BigInt(nanoseconds);
  }

  get milliseconds() { return Number(this[VALUE] / BigInt(1e6)); }
  get nanoseconds() { return Number(this[VALUE] % BigInt(1e6)); }

  plus(data) {
    const nanoseconds = fromParts(
      plus(
        toParts(this[VALUE]),
        data
      )
    );
    return new Instant(nanoseconds);
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
    return this[VALUE];
  }
  format(locale, options) {
    return this.withZone().format(locale, options);
  }

  static now() {
    return new Instant(BigInt(Date.now()) * BigInt(1e6));
  }
  static fromDate(date) {
    return new Instant(BigInt((date || 0).valueOf()) * BigInt(1e6));
  }

  static parse(string) {
    return ZonedInstant.parse(string).toInstant();
  }
}

function toParts(nanos) {
  const millis = Number(nanos / BigInt(1e6));
  const date = new Date(millis);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const millisecond = date.getUTCMilliseconds();
  const nanosecond = Number(nanos - (BigInt(millis) * BingInt(1e6)));
  return { year, month, day, hour, minute, second, millisecond, nanosecond };
}
function fromParts({ year = 0, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0, nanosecond = 0 }) {
  const milliseconds = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  return (BigInt(milliseconds) * BigInt(1e6)) + BigInt(nanosecond);
}
