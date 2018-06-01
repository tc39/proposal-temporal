/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad, parse  } from './util.mjs';
import { toEpoch } from './epoch.mjs';
import { CivilDate } from './civildate.mjs';
import { CivilTime } from './civiltime.mjs';
import { Instant } from './instant.mjs';
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
    const millis = toEpoch(this, zone);
    const nanoseconds = (BigInt(millis) * BigInt(1e6)) + BigInt(this.nanosecond)
    const instant = new Instant(nanoseconds);
    return new ZonedInstant(instant, zone);
  }
  toString() {
    const { year, month, day, hour, minute, second, millisecond, nanosecond } = this;
    const nanos = (millisecond * 1E6) + nanosecond;
    return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanos, 9)}`;
  }

  toDate(zone) {
    return this.withZone(zone).toDate();
  }

  static from(date = {}, time = {}) {
    const { year, month, day } = date;
    const { hour, minute, second, millisecond, nanosecond } = time;
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
  static now(zone) {
    return ZonedInstant.now(zone).toCivilDateTime();
  }
  static fromDate(date, zone) {
    return ZonedInstant.fromDate(date, zone).toCivilDateTime();
  }

  static parse(string) {
    const { year, month, day, hour, minute, second, millisecond, nanosecond } = parse(string);
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, nanosecond);
  }
};
