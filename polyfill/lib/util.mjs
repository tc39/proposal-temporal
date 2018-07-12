/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { zones } from './zones.mjs';

export function plus(
  { year: ly = 0, month: lm = 0, day: ld = 0, hour: lhr = 0, minute: lmn = 0, second: lsd = 0, millisecond: lms = 0, nanosecond: lns = 0 } = {},
  { years: ry = 0, months: rm = 0, days: rd = 0, hours: rhr = 0, minutes: rmn = 0, seconds: rsd = 0, milliseconds: rms = 0, nanoseconds: rns = 0 } = {}
) {
  let year = ly + ry;
  let month = lm + rm;
  let day = ld + rd;
  let hour = lhr + rhr;
  let minute = lmn + rmn;
  let second = lsd + rsd;
  let millisecond = lms + rms;
  let nanosecond = lns + rns;

  while (nanosecond < 0) {
    nanosecond += 1E6;
    millisecond -= 1;
  }
  while (nanosecond >= 1E6) {
    nanosecond -= 1E6;
    millisecond += 1;
  }

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
    nanosecond
  };
};

export function pad(num, cnt) {
  const str = `${num}`;
  const prefix = (new Array(cnt)).fill('0').join('');
  return `${prefix}${`${str}`.trim()}`.slice(-1 * Math.max(cnt, str.length));
};

export function validZone(zone) {
  if (zone === 'UTC') { return 'UTC'; }
  zone = (zone === 'SYSTEM') ? systemTimeZone() : zone;
  const match = /([+-])?(\d{1,2})(:?(\d{1,2}))?/.exec(zone);
  if (!match) {
    const found = new Intl.DateTimeFormat('en-us', { timeZone: zone, timeZoneName: 'short' }).formatToParts().find((i)=>(i.type==='timeZoneName'));
    if (!found || !found.value) {
      throw new Error(`invalid timezone: ${zone}`);
    }
    return zone;
  }
  const sign = match[1] || '+';
  const offset = (+match[2] * 60) + (+match[3] || 0);
  const hours = Math.floor(offset / 60);
  const minutes = Math.floor(offset % 60);
  return `${sign}${pad(hours, 2)}:${pad(minutes,2)}`;
}

function systemTimeZone() {
  const zone = new Intl.DateTimeFormat('en-us', { timeZoneName: 'long' }).formatToParts().find((i)=>(i.type==='timeZoneName'));
  if (zones[zone.value]) { return zone.value; }

  const iana = Object.keys(zones);
  for (let iananame of iana) {
    const data = zones[iananame];
    if (Object.keys(data).find((off)=>(data[off] === zone.value))) {
      return iananame;
    };
  }

  const offset = (new Date()).getTimezoneOffset();
  const sign = offset < 0 ? '-' : '+';
  const hours = ('00' + Math.floor(Math.abs(offset) / 60)).slice(-2);
  const minutes = ('00' + Math.floor(Math.abs(offset) % 60)).slice(-2);
  const short = `${sign}${hours}:${minutes}`;

  for (let iananame of iana) {
    const data = iana[iananame];
    if (data[short]) { return iananame; }
  }
  return short;
}
