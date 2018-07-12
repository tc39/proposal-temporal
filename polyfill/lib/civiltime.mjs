/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad  } from './util.mjs';
import { CivilDateTime } from './civildatetime.mjs';
import { CivilDate } from './civildate.mjs';

const DATA = Symbol('data');

export class CivilTime {
  constructor(hours, minutes, seconds = 0, milliseconds = 0, nanoseconds = 0) {
    const { hour, minute, second, millisecond, nanosecond } = plus({}, { hours, minutes, seconds, milliseconds, nanoseconds });
    this[DATA] = { hour, minute, second, millisecond, nanosecond };
  }

  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }
  get millisecond() { return this[DATA].millisecond; }
  get nanosecond() { return this[DATA].nanosecond; }

  plus(data) {
    const {
      hour,
      minute,
      second,
      millisecond,
      nanosecond
    } = plus(this, data);
    return new CivilTime(hour, minute, second, millisecond, nanosecond);
  }
  with({ hour = this.hour, minute = this.minute, second = this.second, millisecond = this.millisecond, nanosecond = this.nanosecond } = {}) {
    return new CivilTime(hour, minute, second, millisecond, nanosecond);
  }
  withDate(date = CivilDateTime.now().toCivilDate()) {
    return new CivilDateTime.from(date, this);
  }
  toString() {
    const { hour, minute, second, millisecond, nanosecond } = this;
    return `${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(millisecond, 3)}${pad(nanosecond, 6)}`;
  }

  static fromString(string) {
    const match = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})$/.exec(string);
    if (!match) {
      throw new Error(`invalid time-string ${string}`);
    }
    return new CivilTime(+match[1], +match[2], +match[3], +match[4], +match[5]);
  }

  static now(zone) {
    return CivilDateTime.now(zone).toCivilTime();
  }
  static fromMilliseconds(milliseconds, zone) {
    return CivilDateTime.fromMilliseconds(milliseconds, zone).toCivilTime();
  }
}
