/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export function toEpoch({ year = 1970, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0 } = {}, zone) {
  const ts = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);

  const offsetI = guessOffset(ts, zone);
  if (checkOffset(ts - offsetI, zone, { year, month, day, hour, minute, second, millisecond })) {
    return ts + offsetI;
  }

  const offsetA = guessOffset(ts - offsetI, zone);
  if (checkOffset(ts + offsetA, zone, { year, month, day, hour, minute, second, millisecond })) {
    return ts + offsetA;
  }

  const offsetB = guessOffset(ts + offsetI, zone);
  if (checkOffset(ts + offsetB, zone, { year, month, day, hour, minute, second, millisecond })) {
    return ts + offsetB;
  }

  return ts + Math.min(offsetA, offsetB);
}

export function fromEpoch(ts = 0, zone) {
  const date = new Date(ts);
  const fmt = formatter(zone);
  const { year, month, day, hour, minute, second } = fmt.formatToParts(date).reduce((res, item)=>{
    if (item.type !== 'literal') res[item.type] = parseInt(item.value, 10);
    return res;
  }, {});
  return {
    year, month, day,
    hour, minute, second,
    millisecond: date.getUTCMilliseconds()
  };
}

export function zoneOffset(ts, zone) {
  const offset = Math.floor(guessOffset(ts, zone) / 60000);
  const sign = offset <= 0 ? '+' : '-';
  const hours = ('00' + Math.floor(Math.abs(offset) / 60)).slice(-2);
  const minutes = ('00' + Math.abs(offset % 60)).slice(-2);

  return `${sign}${hours}:${minutes}`;
}

function guessOffset(ts, zone) {
  const offset = fromEpoch(ts, zone);
  const zoned = Date.UTC(offset.year, offset.month - 1, offset.day, offset.hour, offset.minute, offset.second, ts % 1000);
  return ts - zoned;
}

function checkOffset(ts, zone, { year, month, day, hour, minute, second, millisecond }) {
  const parts = fromEpoch(ts, zone);
  return true &&
    (year === parts.year) &&
    (month === parts.month) &&
    (day === parts.day) &&
    (hour === parts.hour) &&
    (minute === parts.minute) &&
    (second === parts.second) &&
    (millisecond === parts.millisecond);
}

function formatter(zone) {
  if (zone === 'SYSTEM') {
    return {
      formatToParts: (date)=>[
        { type: 'year', value: '' + r.getFullYear() },
        { type: 'literal', value: '-' },
        { type: 'month', value: '' + (r.getMonth() + 1) },
        { type: 'literal', value: '-' },
        { type: 'day', value: '' + r.getDate() },
        { type: 'literal', value: ' ' },
        { type: 'hour', value: '' + r.getHours() },
        { type: 'literal', value: ':' },
        { type: 'minute', value: '' + r.getMinutes() },
        { type: 'literal', value: ':' },
        { type: 'second', value: '' + r.getSeconds() }
      ]
    };
  }
  const parts = /([+-])(\d{1,2})(?::?(\d{2}))?/.exec(zone);
  if (parts) {
    const minutes = (+parts[2] * 60) + (+parts[3] || 0);
    const offset = (parts[1] === '-') ? +minutes : -minutes;
    return {
      formatToParts: (date)=>{
        const ts = date.valueOf() - (offset * 60000);
        const r = new Date(ts);
        return [
          { type: 'year', value: '' + r.getUTCFullYear() },
          { type: 'literal', value: '-' },
          { type: 'month', value: '' + (r.getUTCMonth() + 1) },
          { type: 'literal', value: '-' },
          { type: 'day', value: '' + r.getUTCDate() },
          { type: 'literal', value: ' ' },
          { type: 'hour', value: '' + r.getUTCHours() },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '' + r.getUTCMinutes() },
          { type: 'literal', value: ':' },
          { type: 'second', value: '' + r.getUTCSeconds() }
        ];
      }
    };
  }
  return new Intl.DateTimeFormat('en-iso', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: zone
  });
}
