import { absolute, datetime, date, time, timezone, yearmonth, monthday, offset, duration } from '../lib/regex.mjs';

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import assert from 'assert';

describe('fromString regex', ()=>{
  describe('absolute', () => {
    test(absolute, '1976-11-18T15:23+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456789+1:00[Europe/Vienna]');

    test(absolute, '1976-11-18T15:23+0100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30+0100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123+0100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456+0100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456789+0100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23+100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(absolute, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');

    test(absolute, '1976-11-18T15:23-04:00');
    test(absolute, '1976-11-18T15:23:30-04:00');
    test(absolute, '1976-11-18T15:23:30.123-04:00');
    test(absolute, '1976-11-18T15:23:30.123456-04:00');
    test(absolute, '1976-11-18T15:23:30.123456789-04:00');
    test(absolute, '1976-11-18T15:23-4:00');
    test(absolute, '1976-11-18T15:23:30-4:00');
    test(absolute, '1976-11-18T15:23:30.123-4:00');
    test(absolute, '1976-11-18T15:23:30.123456-4:00');
    test(absolute, '1976-11-18T15:23:30.123456789-4:00');
    test(absolute, '1976-11-18T15:23-0400');
    test(absolute, '1976-11-18T15:23:30-0400');
    test(absolute, '1976-11-18T15:23:30.123-0400');
    test(absolute, '1976-11-18T15:23:30.123456-0400');
    test(absolute, '1976-11-18T15:23:30.123456789-0400');
    test(absolute, '1976-11-18T15:23-400');
    test(absolute, '1976-11-18T15:23:30-400');
    test(absolute, '1976-11-18T15:23:30.123-400');
    test(absolute, '1976-11-18T15:23:30.123456-400');
    test(absolute, '1976-11-18T15:23:30.123456789-400');

    test(absolute, '1976-11-18 15:23+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456789+01:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456+1:00[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456789+1:00[Europe/Vienna]');

    test(absolute, '1976-11-18 15:23+0100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30+0100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123+0100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456+0100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456789+0100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23+100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(absolute, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');

    test(absolute, '1976-11-18 15:23-04:00');
    test(absolute, '1976-11-18 15:23:30-04:00');
    test(absolute, '1976-11-18 15:23:30.123-04:00');
    test(absolute, '1976-11-18 15:23:30.123456-04:00');
    test(absolute, '1976-11-18 15:23:30.123456789-04:00');
    test(absolute, '1976-11-18 15:23-4:00');
    test(absolute, '1976-11-18 15:23:30-4:00');
    test(absolute, '1976-11-18 15:23:30.123-4:00');
    test(absolute, '1976-11-18 15:23:30.123456-4:00');
    test(absolute, '1976-11-18 15:23:30.123456789-4:00');
    test(absolute, '1976-11-18 15:23-0400');
    test(absolute, '1976-11-18 15:23:30-0400');
    test(absolute, '1976-11-18 15:23:30.123-0400');
    test(absolute, '1976-11-18 15:23:30.123456-0400');
    test(absolute, '1976-11-18 15:23:30.123456789-0400');
    test(absolute, '1976-11-18 15:23-400');
    test(absolute, '1976-11-18 15:23:30-400');
    test(absolute, '1976-11-18 15:23:30.123-400');
    test(absolute, '1976-11-18 15:23:30.123456-400');
    test(absolute, '1976-11-18 15:23:30.123456789-400');
  });

  describe('datetime', () => {
    test(datetime, '1976-11-18T15:23+100[Europe/Vienna]');
    test(datetime, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(datetime, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(datetime, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(datetime, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
    test(datetime, '1976-11-18T15:23-400');
    test(datetime, '1976-11-18T15:23:30-400');
    test(datetime, '1976-11-18T15:23:30.123-400');
    test(datetime, '1976-11-18T15:23:30.123456-400');
    test(datetime, '1976-11-18T15:23:30.123456789-400');
    test(datetime, '1976-11-18T15:23');
    test(datetime, '1976-11-18T15:23:30');
    test(datetime, '1976-11-18T15:23:30.123');
    test(datetime, '1976-11-18T15:23:30.123456');
    test(datetime, '1976-11-18T15:23:30.123456789');

    test(datetime, '1976-11-18 15:23+100[Europe/Vienna]');
    test(datetime, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(datetime, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(datetime, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(datetime, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');
    test(datetime, '1976-11-18 15:23-400');
    test(datetime, '1976-11-18 15:23:30-400');
    test(datetime, '1976-11-18 15:23:30.123-400');
    test(datetime, '1976-11-18 15:23:30.123456-400');
    test(datetime, '1976-11-18 15:23:30.123456789-400');
    test(datetime, '1976-11-18 15:23');
    test(datetime, '1976-11-18 15:23:30');
    test(datetime, '1976-11-18 15:23:30.123');
    test(datetime, '1976-11-18 15:23:30.123456');
    test(datetime, '1976-11-18 15:23:30.123456789');
  });

  describe('date', () => {
    test(date, '1976-11-18T15:23+100[Europe/Vienna]');
    test(date, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(date, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(date, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(date, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
    test(date, '1976-11-18T15:23-400');
    test(date, '1976-11-18T15:23:30-400');
    test(date, '1976-11-18T15:23:30.123-400');
    test(date, '1976-11-18T15:23:30.123456-400');
    test(date, '1976-11-18T15:23:30.123456789-400');
    test(date, '1976-11-18T15:23');
    test(date, '1976-11-18T15:23:30');
    test(date, '1976-11-18T15:23:30.123');
    test(date, '1976-11-18T15:23:30.123456');
    test(date, '1976-11-18T15:23:30.123456789');
    test(date, '1976-11-18');
    test(date, '+999999-11-18');
    test(date, '-000300-11-18');
    test(date, '1976-11-18');
    test(date, '1512-11-18');
    test(date, '1976-11-18 15:23+100[Europe/Vienna]');
    test(date, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(date, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(date, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(date, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');
    test(date, '1976-11-18 15:23-400');
    test(date, '1976-11-18 15:23:30-400');
    test(date, '1976-11-18 15:23:30.123-400');
    test(date, '1976-11-18 15:23:30.123456-400');
    test(date, '1976-11-18 15:23:30.123456789-400');
    test(date, '1976-11-18 15:23');
    test(date, '1976-11-18 15:23:30');
    test(date, '1976-11-18 15:23:30.123');
    test(date, '1976-11-18 15:23:30.123456');
    test(date, '1976-11-18 15:23:30.123456789');
  });

  describe('time', () => {
    test(time, '1976-11-18T15:23+100[Europe/Vienna]');
    test(time, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(time, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(time, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(time, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
    test(time, '1976-11-18T15:23-400');
    test(time, '1976-11-18T15:23:30-400');
    test(time, '1976-11-18T15:23:30.123-400');
    test(time, '1976-11-18T15:23:30.123456-400');
    test(time, '1976-11-18T15:23:30.123456789-400');
    test(time, '1976-11-18T15:23');
    test(time, '1976-11-18T15:23:30');
    test(time, '1976-11-18T15:23:30.123');
    test(time, '1976-11-18T15:23:30.123456');
    test(time, '1976-11-18T15:23:30.123456789');
    test(time, '15:23');
    test(time, '15:23:30');
    test(time, '15:23:30.123');
    test(time, '15:23:30.123456');
    test(time, '15:23:30.123456789');
    test(time, '1976-11-18 15:23+100[Europe/Vienna]');
    test(time, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(time, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(time, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(time, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');
    test(time, '1976-11-18 15:23-400');
    test(time, '1976-11-18 15:23:30-400');
    test(time, '1976-11-18 15:23:30.123-400');
    test(time, '1976-11-18 15:23:30.123456-400');
    test(time, '1976-11-18 15:23:30.123456789-400');
    test(time, '1976-11-18 15:23');
    test(time, '1976-11-18 15:23:30');
    test(time, '1976-11-18 15:23:30.123');
    test(time, '1976-11-18 15:23:30.123456');
    test(time, '1976-11-18 15:23:30.123456789');
  });

  describe('yearmonth', () => {
    test(yearmonth, '1976-11-18T15:23+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18T15:23-400');
    test(yearmonth, '1976-11-18T15:23:30-400');
    test(yearmonth, '1976-11-18T15:23:30.123-400');
    test(yearmonth, '1976-11-18T15:23:30.123456-400');
    test(yearmonth, '1976-11-18T15:23:30.123456789-400');
    test(yearmonth, '1976-11-18T15:23');
    test(yearmonth, '1976-11-18T15:23:30');
    test(yearmonth, '1976-11-18T15:23:30.123');
    test(yearmonth, '1976-11-18T15:23:30.123456');
    test(yearmonth, '1976-11-18T15:23:30.123456789');
    test(yearmonth, '1976-11-18');
    test(yearmonth, '+999999-11-18');
    test(yearmonth, '-000300-11-18');
    test(yearmonth, '1976-11-18');
    test(yearmonth, '1512-11-18');
    test(yearmonth, '1976-11');
    test(yearmonth, '+999999-11');
    test(yearmonth, '-000300-11');
    test(yearmonth, '1976-11');
    test(yearmonth, '1512-11');
    test(yearmonth, '1976-11-18 15:23+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');
    test(yearmonth, '1976-11-18 15:23-400');
    test(yearmonth, '1976-11-18 15:23:30-400');
    test(yearmonth, '1976-11-18 15:23:30.123-400');
    test(yearmonth, '1976-11-18 15:23:30.123456-400');
    test(yearmonth, '1976-11-18 15:23:30.123456789-400');
    test(yearmonth, '1976-11-18 15:23');
    test(yearmonth, '1976-11-18 15:23:30');
    test(yearmonth, '1976-11-18 15:23:30.123');
    test(yearmonth, '1976-11-18 15:23:30.123456');
    test(yearmonth, '1976-11-18 15:23:30.123456789');
  });

  describe('monthday', () => {
    test(monthday, '1976-11-18T15:23+100[Europe/Vienna]');
    test(monthday, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(monthday, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(monthday, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(monthday, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
    test(monthday, '1976-11-18T15:23-400');
    test(monthday, '1976-11-18T15:23:30-400');
    test(monthday, '1976-11-18T15:23:30.123-400');
    test(monthday, '1976-11-18T15:23:30.123456-400');
    test(monthday, '1976-11-18T15:23:30.123456789-400');
    test(monthday, '1976-11-18T15:23');
    test(monthday, '1976-11-18T15:23:30');
    test(monthday, '1976-11-18T15:23:30.123');
    test(monthday, '1976-11-18T15:23:30.123456');
    test(monthday, '1976-11-18T15:23:30.123456789');
    test(monthday, '1976-11-18');
    test(monthday, '+999999-11-18');
    test(monthday, '-000300-11-18');
    test(monthday, '1976-11-18');
    test(monthday, '1512-11-18');
    test(monthday, '1976-11-18');
    test(monthday, '11-18');
    test(monthday, '12-13');
    test(monthday, '02-02');
    test(monthday, '01-31');
    test(monthday, '1976-11-18 15:23+100[Europe/Vienna]');
    test(monthday, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(monthday, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(monthday, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(monthday, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');
    test(monthday, '1976-11-18 15:23-400');
    test(monthday, '1976-11-18 15:23:30-400');
    test(monthday, '1976-11-18 15:23:30.123-400');
    test(monthday, '1976-11-18 15:23:30.123456-400');
    test(monthday, '1976-11-18 15:23:30.123456789-400');
    test(monthday, '1976-11-18 15:23');
    test(monthday, '1976-11-18 15:23:30');
    test(monthday, '1976-11-18 15:23:30.123');
    test(monthday, '1976-11-18 15:23:30.123456');
    test(monthday, '1976-11-18 15:23:30.123456789');
  });

  describe('offset', () => {
    test(offset, '+000');
    test(offset, '-000');
    test(offset, '+0000');
    test(offset, '-0000');
    test(offset, '+0:00');
    test(offset, '-0:00');
    test(offset, '+00:00');
    test(offset, '-00:00');
    test(offset, '+300');
    test(offset, '-300');
    test(offset, '+0300');
    test(offset, '-0300');
    test(offset, '+3:00');
    test(offset, '-3:00');
    test(offset, '+03:00');
    test(offset, '-03:00');
  });

  describe('timezone', () => {
    test(timezone, '1976-11-18T15:23+100[Europe/Vienna]');
    test(timezone, '1976-11-18T15:23:30+100[Europe/Vienna]');
    test(timezone, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
    test(timezone, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
    test(timezone, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');

    test(timezone, '1976-11-18T15:23-04:00');
    test(timezone, '1976-11-18T15:23:30-04:00');
    test(timezone, '1976-11-18T15:23:30.123-04:00');
    test(timezone, '1976-11-18T15:23:30.123456-04:00');
    test(timezone, '1976-11-18T15:23:30.123456789-04:00');
    test(timezone, '+100[Europe/Vienna]');
    test(timezone, '+100[Europe/Vienna]');
    test(timezone, '+100[Europe/Vienna]');
    test(timezone, '+100[Europe/Vienna]');
    test(timezone, '+100[Europe/Vienna]');
    test(timezone, '-04:00');
    test(timezone, '-04:00');
    test(timezone, '-04:00');
    test(timezone, '-04:00');
    test(timezone, '-04:00');

    test(timezone, '1976-11-18 15:23+100[Europe/Vienna]');
    test(timezone, '1976-11-18 15:23:30+100[Europe/Vienna]');
    test(timezone, '1976-11-18 15:23:30.123+100[Europe/Vienna]');
    test(timezone, '1976-11-18 15:23:30.123456+100[Europe/Vienna]');
    test(timezone, '1976-11-18 15:23:30.123456789+100[Europe/Vienna]');

    test(timezone, '1976-11-18 15:23-04:00');
    test(timezone, '1976-11-18 15:23:30-04:00');
    test(timezone, '1976-11-18 15:23:30.123-04:00');
    test(timezone, '1976-11-18 15:23:30.123456-04:00');
    test(timezone, '1976-11-18 15:23:30.123456789-04:00');
  });

  describe('duration', () => {
    const dp = ['1Y', '2M', '3D'];
    let day = [''];
    while (dp.length) {
      const n = dp.shift();
      day = day.concat(day.map((p) => `${p}${n}`));
    }

    const tp = ['4H', '5M', '6S', '7.123S', '8.123456S', '9.123456789S', '0.123S', '0.123456S', '0.123456789S'];
    let tim = [''];
    while (tp.length) {
      const n = tp.shift();
      tim = tim.concat(tim.map((p) => `${p}${n}`));
    }

    day.forEach((p) => test(duration, `P${p}`));
    tim.forEach((p) => test(duration, `PT${p}`));
    for (let d of day) {
      for (let t of tim) {
        test(duration, `P${d}T${t}`);
      }
    }
  });
});

function test(reg, str) {
  it(`${str}`, () => assert(!!reg.exec(str)));
}

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1]))
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
