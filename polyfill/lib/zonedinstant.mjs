/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad, validZone, parse  } from './util';
import { fromEpoch, zoneOffset } from './epoch';
import { CivilDate } from './civildate';
import { CivilTime } from './civiltime';
import { CivilDateTime } from './civildatetime';

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
  toString() {
    const ts = this[INSTANT].milliseconds;
    const { year, month, day, hour, minute, second, millisecond } = fromEpoch(ts, this[ZONE]);
    const nanosecond = (millisecond * 1e6) + this[INSTANT].nanoseconds;
    const offset = zoneOffset(ts, this[ZONE]);
    const zone = ((this[ZONE].indexOf('/') > -1) || (this[ZONE] === 'UTC')) ? `[${this[ZONE]}]` : '';
    return `${pad(year,4)}-${pad(month,2)}-${pad(day,2)}T${pad(hour,2)}:${pad(minute,2)}:${pad(second,2)}.${pad(nanosecond,9)}${offset}${zone}`;
  }

  toDate() {
    return this.toInstant().toDate();
  }
  valueOf() {
    return this.toInstant().valueOf();
  }
  format(locale = navigator.language, options = {}) {
    const fmt = new Intl.DateTimeFormat(
      locale,
      Object.assign({}, options, { timeZone: this.timeZone })
    );
    return fmt.format(this.toDate());
  }

  static now(zone) {
    return Instant.now().withZone(zone);
  }
  static fromDate(date, zone) {
    return Instant.fromDate(date).withZone(zone);
  }

  static parse(string) {
    const { year, month, day, hour, minute, second, millisecond, nanosecond, zone } = parse(string);
    const civil = new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
    return civil.withZone(zone);
  }
};

