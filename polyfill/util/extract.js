/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
**
** This is meant to extract TimeZone Information from the zoneinfo db
** It does not extract full information, only the names and descriptions
** for different timezones
**/

const fs = require('fs');

const zoneinfo = fs.readFileSync('/usr/share/zoneinfo/zone.tab', 'utf-8').split(/\r?\n/).filter(l=>l.trim() && !/^\s*#/.test(l));

const dates = (()=>{
  const dates = []
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day < 32; day++) {
      dates.push(new Date(2018, month, day, 0, 0, 0));
    }
  }
  return dates;
})();
// [
//   new Date(2018, 0, 15, 0, 0, 0),
//   new Date(2018, 1, 15, 0, 0, 0),
//   new Date(2018, 2, 15, 0, 0, 0),
//   new Date(2018, 3, 15, 0, 0, 0),
//   new Date(2018, 4, 15, 0, 0, 0),
//   new Date(2018, 5, 15, 0, 0, 0),
//   new Date(2018, 6, 15, 0, 0, 0),
//   new Date(2018, 7, 15, 0, 0, 0),
//   new Date(2018, 8, 15, 0, 0, 0),
//   new Date(2018, 9, 15, 0, 0, 0),
//   new Date(2018, 10, 15, 0, 0, 0),
//   new Date(2018, 11, 15, 0, 0, 0),
// ];

const zones = {};
zoneinfo.forEach((line)=>{
  const [ country, coords, zone, ...comments ] = line.split(/\s+/);
  try {
    const data = zones[zone] = info(zone);
  } catch(err) {
    console.error(`Ignore: ${zone} ${err.message}`);
  }
});
[
  'UTC',
  'GMT'
].forEach((zone)=>{
  try {
    const data = zones[zone] = info(zone);
  } catch(err) {
    console.error(`Ignore: ${zone} ${err.message}`);
  }
});

console.log('export const zones = ' + JSON.stringify(zones, undefined, '  ') + ';');

function info(zone) {
  const fmt = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: zone,
    timeZoneName: 'long'
  });

  const data = {};
  dates.forEach(date=>{
    const parts = fmt.formatToParts(date).reduce((agg, itm)=>{
      if (itm.type !== 'literal') { agg[itm.type] = itm.value; }
      return agg;
    }, {});

    const ts = date.getTime();
    const zts = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);

    const diff = Math.abs(ts - zts) / 60000;
    const sign = ts > zts ? '-' : '+';
    const hour = ('00' + Math.floor(diff / 60)).slice(-2);
    const minute = ('00' + Math.floor(diff % 60)).slice(-2);
    const offset = `${sign}${hour}:${minute}`;

    data[offset] = parts.timeZoneName;
  });
  return data;
}
