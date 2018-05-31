/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { zones } from './zones';

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
  return `0000000000${`${num}`.trim()}`.slice(-1 * cnt);
};

let systemZone;
export function systemTimeZone() {
  if (systemZone) { return systemZone; }
  const zone = new Intl.DateTimeFormat('en-us', { timeZoneName: 'long' }).formatToParts().find((i)=>(i.type==='timeZoneName'));
  if (zones[zone.value]) { return zone.value; }
  const iana = Object.keys(zones);
  for (let iananame of iana) {
    const data = zones[iananame];
    if (Object.keys(data).find((off)=>(data[off] === zone.value))) {
      return (systemZone = iananame);
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
};

function findTimeZone(offset) {
  const base = Math.abs(Math.floor(offset / 60000))
  const hours = ('00' + Math.floor(base / 60)).slice(-2);
  const minutes = ('00' + (base % 60)).slice(-2);
  const string = `${offset < 0 ? '-' : '+'}${hours}:${minutes}`;

  const iana = Object.keys(zones);
  for (let iananame of iana) {
    const data = zones[iananame];
    if (data[string]) return iananame;
  }
  return undefined;
}

export function validZone(zone) {
  if (!!zones[zone]) { return zone; }
  const match = /([+-])?(\d{1,2})(:?(\d{1,2}))?/.exec(zone);
  if (!match) throw new TypeError(`Invalid Time-Zone: ${zone}`);
  const sign = match[1] || '+';
  const hours = ('00' + match[2]).slice(-2);
  const minutes = ('00' + (mathc[3] || '')).slice(-2);
  return `${sign}${hours}:{$minutes}`;
}

const parseExpression = (()=>{
  const date = '(\\d{4})-(\\d{2})-(\\d{2})';
  const time = '(\\d{2}):(\\d{2}):(\\d{2})(?:\\.(\\d{3,9}))';
  const offs = '([+-]?\\d{1,2}(?::?\\d{2})?)';
  const zone = '(?:\\[(\\w+\/\\w+)\\])';
  return new RegExp(`^${date}T${time}${offs}?${zone}?$`);
})();
const parseOffset = (str)=>{
  if (!str) return undefined;
  const match = /([+-]?\d{1,2}):?(\d{2})?/.exec(str) || [ null, '0', '0' ];
  const hour = match[1] || '0';
  const mins = match[2] || '0';
  return ((+hour * 60) + (+mins)) * 60000;
};

export function parse(str) {
  const match = parseExpression.exec(str) || [];
  const year = +match[1];
  const month = +match[2];
  const day = +match[3];
  const hour = +match[4];
  const minute = +match[5];
  const second = +match[6];
  const subsec = +(match[7] + '000000000').slice(0, 9).replace(/^0+/,'');

  const millisecond = Math.floor(subsec / 1e6);
  const nanosecond = (subsec % 1e6);

  const offset = parseOffset(match[8]);
  const zone = match[9] || findTimeZone(offset) || systemTimeZone();

  return {
    year, month, day,
    hour, minute, second,
    millisecond, nanosecond,
    offset, zone
  };
};
