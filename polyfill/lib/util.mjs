/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { zones } from './zones.mjs';

export function plus(
  { year: ly = 0, month: lm = 0, day: ld = 0, hour: lhr = 0, minute: lmn = 0, second: lsd = 0, millisecond: lms = 0, nanosecond: lns = 0 } = {},
  { years: ry = 0, months: rm = 0, days: rd = 0, hours: rhr = 0, minutes: rmn = 0, seconds: rsd = 0, milliseconds: rms = 0, nanoseconds: rns = 0 } = {}
) {
  let year = num(ly) + num(ry);
  let month = num(lm) + num(rm);
  let day = num(ld) + num(rd);
  let hour = num(lhr) + num(rhr);
  let minute = num(lmn) + num(rmn);
  let second = num(lsd) + num(rsd);
  let millisecond = num(lms) + num(rms);
  let nanosecond = num(lns) + num(rns);

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
  const str = `${Math.abs(+num)}`;
  const prefix = (new Array(cnt)).fill('0').join('');
  return `${prefix}${`${str}`.trim()}`.slice(-1 * Math.max(cnt, str.length));
};
export function spad(num, cnt) {
  return `${+num < 0 ? '-' : ''}${pad(num, cnt)}`;
};

export function num(number = 0) {
  if (isNaN(+number)) throw new Error(`invalid number ${number}`);
  return +number;
};

export function dayOfWeek(year, month, day) {
    const m = month + ((month < 3) ? 10 : -2);
    const Y = year - ((month < 3) ? 1 : 0);

    const c = Math.floor(Y / 100);
    const y = Y - (c * 100);
    const d = day;

    const pD = d;
    const pM = Math.floor((2.6 * m) - 0.2);
    const pY = y + Math.floor(y / 4);
    const pC = Math.floor(c / 4) - (2 * c);

    const dow = (pD + pM + pY + pC) % 7;

    return dow + ((dow < 0) ? 7 : 0);
};

export function isLeapYear(year) {
    return (((year % 4) === 0) && !((year % 100) === 0)) || ((year % 400) === 0);
};

export function dayOfYear(year, month, day) {
    const dm = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    let days = day;
    for(let m = 0; m < (month - 1); m++) {
        days += dm[m];
    }
    days += (isLeapYear(year) && (month > 2)) ? 1 : 0;
    return days;
};

export function weekOfYear(year, month, day) {
    const doy = dayOfYear(year, month, day);
    const dow = dayOfWeek(year, month, day);
    const doj = dayOfWeek(year, 1, 1);

    return ((doy + 6) / 7) + ((dow < doj) ? 1 : 0);
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
