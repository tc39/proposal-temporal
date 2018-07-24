/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad, spad, num } from './util.mjs';
import { ZonedInstant } from './zonedinstant.mjs';
import { fromEpoch } from './epoch.mjs';

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
  valueOf() {
    return BigInt(this[VALUE].milliseconds) * BigInt(1e6) + BigInt(this[VALUE].nanoseconds);
  }
  format(locale, options) {
    return this.withZone().format(locale, options);
  }
  toString() {
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(this.milliseconds, 'UTC');
    const nanosecond = this.nanoseconds;
    return `${spad(year,4)}-${pad(month,2)}-${pad(day,2)}T${pad(hour,2)}:${pad(minute,2)}:${pad(second,2)}.${pad(millisecond,3)}${pad(nanosecond,6)}Z`;
  }

  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})Z$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    const milliseconds = Date.UTC(num(match[1]), num(match[2]) - 1, num(match[3]), num(match[4]), num(match[5]), num(match[6]), num(match[7]));
    const nanoseconds = num(match[8]);

    const instant = Object.create(Instant.prototype);
    instant[VALUE] = { milliseconds, nanoseconds };

    return instant;
  }

  static fromMilliseconds(milliseconds) {
    milliseconds = num(milliseconds);
    const object = Object.create(Instant.prototype);
    object[VALUE] = {
      milliseconds,
      nanoseconds: 0
    };
    return object;
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
