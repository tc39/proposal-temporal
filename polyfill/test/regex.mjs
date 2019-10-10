import { absolute, datetime, date, time, timezone, yearmonth, monthday, offset, duration } from '../lib/regex.mjs';

import { inspect } from 'util';
const failOnly = true;
let failures = 0;

test('absolute', absolute, '1976-11-18T15:23+01:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30+01:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123+01:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456+01:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23+1:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30+1:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123+1:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456+1:00[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456789+1:00[Europe/Vienna]');

test('absolute', absolute, '1976-11-18T15:23+0100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30+0100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123+0100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456+0100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456789+0100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23+100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('absolute', absolute, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');

test('absolute', absolute, '1976-11-18T15:23-04:00');
test('absolute', absolute, '1976-11-18T15:23:30-04:00');
test('absolute', absolute, '1976-11-18T15:23:30.123-04:00');
test('absolute', absolute, '1976-11-18T15:23:30.123456-04:00');
test('absolute', absolute, '1976-11-18T15:23:30.123456789-04:00');
test('absolute', absolute, '1976-11-18T15:23-4:00');
test('absolute', absolute, '1976-11-18T15:23:30-4:00');
test('absolute', absolute, '1976-11-18T15:23:30.123-4:00');
test('absolute', absolute, '1976-11-18T15:23:30.123456-4:00');
test('absolute', absolute, '1976-11-18T15:23:30.123456789-4:00');
test('absolute', absolute, '1976-11-18T15:23-0400');
test('absolute', absolute, '1976-11-18T15:23:30-0400');
test('absolute', absolute, '1976-11-18T15:23:30.123-0400');
test('absolute', absolute, '1976-11-18T15:23:30.123456-0400');
test('absolute', absolute, '1976-11-18T15:23:30.123456789-0400');
test('absolute', absolute, '1976-11-18T15:23-400');
test('absolute', absolute, '1976-11-18T15:23:30-400');
test('absolute', absolute, '1976-11-18T15:23:30.123-400');
test('absolute', absolute, '1976-11-18T15:23:30.123456-400');
test('absolute', absolute, '1976-11-18T15:23:30.123456789-400');

line();

test('datetime', datetime, '1976-11-18T15:23+100[Europe/Vienna]');
test('datetime', datetime, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('datetime', datetime, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('datetime', datetime, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('datetime', datetime, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
test('datetime', datetime, '1976-11-18T15:23-400');
test('datetime', datetime, '1976-11-18T15:23:30-400');
test('datetime', datetime, '1976-11-18T15:23:30.123-400');
test('datetime', datetime, '1976-11-18T15:23:30.123456-400');
test('datetime', datetime, '1976-11-18T15:23:30.123456789-400');
test('datetime', datetime, '1976-11-18T15:23');
test('datetime', datetime, '1976-11-18T15:23:30');
test('datetime', datetime, '1976-11-18T15:23:30.123');
test('datetime', datetime, '1976-11-18T15:23:30.123456');
test('datetime', datetime, '1976-11-18T15:23:30.123456789');

line();

test('date', date, '1976-11-18T15:23+100[Europe/Vienna]');
test('date', date, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('date', date, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('date', date, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('date', date, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
test('date', date, '1976-11-18T15:23-400');
test('date', date, '1976-11-18T15:23:30-400');
test('date', date, '1976-11-18T15:23:30.123-400');
test('date', date, '1976-11-18T15:23:30.123456-400');
test('date', date, '1976-11-18T15:23:30.123456789-400');
test('date', date, '1976-11-18T15:23');
test('date', date, '1976-11-18T15:23:30');
test('date', date, '1976-11-18T15:23:30.123');
test('date', date, '1976-11-18T15:23:30.123456');
test('date', date, '1976-11-18T15:23:30.123456789');
test('date', date, '1976-11-18');
test('date', date, '+999999-11-18');
test('date', date, '-000300-11-18');
test('date', date, '1976-11-18');
test('date', date, '1512-11-18');

line();

test('time', time, '1976-11-18T15:23+100[Europe/Vienna]');
test('time', time, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('time', time, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('time', time, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('time', time, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
test('time', time, '1976-11-18T15:23-400');
test('time', time, '1976-11-18T15:23:30-400');
test('time', time, '1976-11-18T15:23:30.123-400');
test('time', time, '1976-11-18T15:23:30.123456-400');
test('time', time, '1976-11-18T15:23:30.123456789-400');
test('time', time, '1976-11-18T15:23');
test('time', time, '1976-11-18T15:23:30');
test('time', time, '1976-11-18T15:23:30.123');
test('time', time, '1976-11-18T15:23:30.123456');
test('time', time, '1976-11-18T15:23:30.123456789');
test('time', time, '15:23');
test('time', time, '15:23:30');
test('time', time, '15:23:30.123');
test('time', time, '15:23:30.123456');
test('time', time, '15:23:30.123456789');

line();

test('yearmonth', yearmonth, '1976-11-18T15:23+100[Europe/Vienna]');
test('yearmonth', yearmonth, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
test('yearmonth', yearmonth, '1976-11-18T15:23-400');
test('yearmonth', yearmonth, '1976-11-18T15:23:30-400');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123-400');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456-400');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456789-400');
test('yearmonth', yearmonth, '1976-11-18T15:23');
test('yearmonth', yearmonth, '1976-11-18T15:23:30');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456');
test('yearmonth', yearmonth, '1976-11-18T15:23:30.123456789');
test('yearmonth', yearmonth, '1976-11-18');
test('yearmonth', yearmonth, '+999999-11-18');
test('yearmonth', yearmonth, '-000300-11-18');
test('yearmonth', yearmonth, '1976-11-18');
test('yearmonth', yearmonth, '1512-11-18');
test('yearmonth', yearmonth, '1976-11');
test('yearmonth', yearmonth, '+999999-11');
test('yearmonth', yearmonth, '-000300-11');
test('yearmonth', yearmonth, '1976-11');
test('yearmonth', yearmonth, '1512-11');

line();

test('monthday', monthday, '1976-11-18T15:23+100[Europe/Vienna]');
test('monthday', monthday, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('monthday', monthday, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('monthday', monthday, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('monthday', monthday, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');
test('monthday', monthday, '1976-11-18T15:23-400');
test('monthday', monthday, '1976-11-18T15:23:30-400');
test('monthday', monthday, '1976-11-18T15:23:30.123-400');
test('monthday', monthday, '1976-11-18T15:23:30.123456-400');
test('monthday', monthday, '1976-11-18T15:23:30.123456789-400');
test('monthday', monthday, '1976-11-18T15:23');
test('monthday', monthday, '1976-11-18T15:23:30');
test('monthday', monthday, '1976-11-18T15:23:30.123');
test('monthday', monthday, '1976-11-18T15:23:30.123456');
test('monthday', monthday, '1976-11-18T15:23:30.123456789');
test('monthday', monthday, '1976-11-18');
test('monthday', monthday, '+999999-11-18');
test('monthday', monthday, '-000300-11-18');
test('monthday', monthday, '1976-11-18');
test('monthday', monthday, '1512-11-18');
test('monthday', monthday, '1976-11-18');
test('monthday', monthday, '11-18');
test('monthday', monthday, '12-13');
test('monthday', monthday, '02-02');
test('monthday', monthday, '01-31');

line();

test('offset', offset, '+000');
test('offset', offset, '-000');
test('offset', offset, '+0000');
test('offset', offset, '-0000');
test('offset', offset, '+0:00');
test('offset', offset, '-0:00');
test('offset', offset, '+00:00');
test('offset', offset, '-00:00');
test('offset', offset, '+300');
test('offset', offset, '-300');
test('offset', offset, '+0300');
test('offset', offset, '-0300');
test('offset', offset, '+3:00');
test('offset', offset, '-3:00');
test('offset', offset, '+03:00');
test('offset', offset, '-03:00');

line();

test('timezone', timezone, '1976-11-18T15:23+100[Europe/Vienna]');
test('timezone', timezone, '1976-11-18T15:23:30+100[Europe/Vienna]');
test('timezone', timezone, '1976-11-18T15:23:30.123+100[Europe/Vienna]');
test('timezone', timezone, '1976-11-18T15:23:30.123456+100[Europe/Vienna]');
test('timezone', timezone, '1976-11-18T15:23:30.123456789+100[Europe/Vienna]');

test('timezone', timezone, '1976-11-18T15:23-04:00');
test('timezone', timezone, '1976-11-18T15:23:30-04:00');
test('timezone', timezone, '1976-11-18T15:23:30.123-04:00');
test('timezone', timezone, '1976-11-18T15:23:30.123456-04:00');
test('timezone', timezone, '1976-11-18T15:23:30.123456789-04:00');
test('timezone', timezone, '+100[Europe/Vienna]');
test('timezone', timezone, '+100[Europe/Vienna]');
test('timezone', timezone, '+100[Europe/Vienna]');
test('timezone', timezone, '+100[Europe/Vienna]');
test('timezone', timezone, '+100[Europe/Vienna]');
test('timezone', timezone, '-04:00');
test('timezone', timezone, '-04:00');
test('timezone', timezone, '-04:00');
test('timezone', timezone, '-04:00');
test('timezone', timezone, '-04:00');

line();

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

day.forEach((p) => test(p, duration, `P${p}`));
tim.forEach((p) => test(p, duration, `PT${p}`));
for (let d of day) {
  for (let t of tim) {
    test(`${d}T${t}`, duration, `P${d}T${t}`);
  }
}

function test(name, reg, str) {
  const match = reg.exec(str);
  failures += match ? 0 : 1;
  let line = `${name}.exec(${JSON.stringify(str)}) => ${!match ? 'failed' : inspect(match, false, 1, false)}`;
  if (!failOnly || !match) console.log(line.split(/\r?\n/).join(' '));
}
function line() {
  if (!failOnly)
    console.log(
      Array(100)
        .fill('=')
        .join('=')
    );
}

process.exit(failures);
