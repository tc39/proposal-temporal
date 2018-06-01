/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, pad  } from './util.mjs';
import { CivilDateTime } from './civildatetime.mjs';

const DATA = Symbol('data');

export class CivilDate {
  constructor(years, months, days) {
    const { year, month, day } = plus({}, { years, months, days });
    this[DATA] = { year, month, day };
  }

  get year() { return this[DATA].year; }
  get month() { return this[DATA].month; }
  get day() { return this[DATA].day; }

  plus(data) {
    const { year, month, day } = plus(this, data);
    return new CivilDate(year, month, day);
  }
  with({ year = this.year, month = this.month , day = this.day } = {}) {
    return new CivilDate(year, month, day);
  }
  withTime(time = CivilDateTime.now().toCivilTime()) {
    return new CivilDateTime.from(this, time);
  }
  toString() {
    const { year, month, day } = this;
    return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
  }

  toDate(zone, time) {
    return this.withTime(date).withZone(zone).toDate();
  }

  static now(zone) {
    return CivilDateTime.now(zone).toCivilDate();
  }
  static fromDate(date, zone) {
    return CivilDateTime.fromDate(date, zone).toCivilDate();
  }

  static parse(string) {
    return CivilDateTime.parse(string).toCivilDate();
  }
};
