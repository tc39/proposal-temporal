/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad, spad  } from './util.mjs';
import { toEpoch } from './epoch.mjs';
import { CivilDate } from './civildate.mjs';
import { CivilTime } from './civiltime.mjs';
import { VALUE, Instant } from './instant.mjs';
import { ZonedInstant } from './zonedinstant.mjs';

const DATA = Symbol('data');

export class CivilDateTime {
  constructor(years, months, days, hours, minutes, seconds = 0, milliseconds = 0, nanoseconds = 0) {
    this[DATA] = plus({}, { years, months, days, hours, minutes, seconds, milliseconds, nanoseconds });
  }

  get year() { return this[DATA].year; }
  get month() { return this[DATA].month; }
  get day() { return this[DATA].day; }
  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }
  get millisecond() { return this[DATA].millisecond; }
  get nanosecond() { return this[DATA].nanosecond; }

  plus(data) {
    const { year, month, day, hour, minute, second, millisecond, nanosecond } = plus(this, data);
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
  with({ year = this.year, month = this.month , day = this.day, hour = this.hour, minute = this.minute, second = this.second, millisecond = this.millisecond, nanosecond = this.nanosecond } = {}) {
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
  toCivilDate() {
    const { year, month, day } = this;
    return new CivilDate(year, month, day);
  }
  toCivilTime() {
    const { hour, minute, second, millisecond, nanosecond } = this;
    return new CivilTime(hour, minute, second, millisecond, nanosecond);
  }
  withZone(zone) {
    const milliseconds = toEpoch(this, zone);
    const nanoseconds = this.nanosecond;
    const instant = Object.create(Instant.prototype);
    instant[VALUE] = { milliseconds, nanoseconds };
    return new ZonedInstant(instant, zone);
  }
  toString() {
    const { year, month, day, hour, minute, second, millisecond, nanosecond } = this;
    return `${spad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(millisecond,3)}${pad(nanosecond, 6)}`;
  }

  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})$/.exec(string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    return new CivilDateTime(+match[1], +match[2], +match[3], +match[4], +match[5], +match[6], +match[7], +match[8]);
  }

  static from(date = {}, time = {}) {
    const { year, month, day } = date;
    const { hour, minute, second, millisecond, nanosecond } = time;
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
  static fromMilliseconds(date, zone) {
    return ZonedInstant.fromMilliseconds(date, zone).toCivilDateTime();
  }
};
