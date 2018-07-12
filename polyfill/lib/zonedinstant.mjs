/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, validZone  } from './util.mjs';
import { fromEpoch, zoneOffset } from './epoch.mjs';
import { CivilDate } from './civildate.mjs';
import { CivilTime } from './civiltime.mjs';
import { CivilDateTime } from './civildatetime.mjs';

const INSTANT = Symbol('instant');
const ZONE = Symbol('zone');

export class ZonedInstant{
  constructor(instant, zone = 'SYSTEM') {
    zone = validZone(zone);
    this[INSTANT] = instant;
    this[ZONE] = zone;
  }

  get milliseconds() { return this[INSTANT].milliseconds; }
  get nanoseconds() { return this[INSTANT].nanoseconds; }
  get timeZone() { return this[ZONE]; }

  toCivilDateTime() {
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(this[INSTANT].milliseconds, this[ZONE]);
    const nanosecond = this[INSTANT].nanoseconds;
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
  toCivilTime() {
    const { hour, minute, second, millisecond } = fromEpoch(this[INSTANT].milliseconds, this[ZONE]);
    const nanosecond = this[INSTANT].nanoseconds;
    return new CivilTime(hour, minute, second, millisecond, nanosecond);
  }
  toCivilDate() {
    const { year, month, day } = fromEpoch(this[INSTANT].milliseconds, this[ZONE]);
    return new CivilDate(year, month, day);
  }
  toInstant() { return this[INSTANT]; }

  valueOf() {
    return this.toInstant().valueOf();
  }
  format(locale = navigator.language, options = {}) {
    const fmt = new Intl.DateTimeFormat(
      locale,
      Object.assign({}, options, { timeZone: this.timeZone })
    );
    return fmt.format(new Date(this.toInstant().milliseconds));
  }
  toString() {
    const ts = this[INSTANT].milliseconds;
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(ts, this[ZONE]);
    const nanosecond = this[INSTANT].nanoseconds;
    const offset = ([ 'UTC', '+00:00', '-00:00' ].indexOf(this[ZONE]) > -1) ? 'Z' : zoneOffset(ts, this[ZONE]);
    return `${pad(year,4)}-${pad(month,2)}-${pad(day,2)}T${pad(hour,2)}:${pad(minute,2)}:${pad(second,2)}.${pad(millisecond,3)}${pad(nanosecond,6)}${offset}`;
  }

  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})(Z|[+-]\d{2}:\d{2})$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    const civil = new CivilDateTime(+match[1], +match[2], +match[3], +match[4], +match[5], +match[6], +match[7], +match[8]);
    return civil.withZone(match[9] === 'Z' ? 'UTC' : match[9]);
  }

  static now(zone) {
    return Instant.now().withZone(zone);
  }
  static fromMilliseconds(milliseconds, zone) {
    return Instant.fromMilliseconds(milliseconds).withZone(zone);
  }
};

