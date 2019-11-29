import * as Temporal from 'tc39-temporal';

const all = process.argv[2] === 'all';
const start = new Temporal.Date(1999, 1, 1);
const end = new Temporal.Date(2009, 12, 31);

console.log('Tap version 13');
console.log('1..N');
let idx = 0;
let cnt = 0;
let fail = 0;
const sts = Temporal.now.absolute();
for (let one = start; !!Temporal.Date.compare(one, end); one = one.plus('P1D')) {
  for (let two = one; !!Temporal.Date.compare(two, end); two = two.plus('P1D')) {
    const ok = test(one, two);
    cnt++;
    if (!(cnt % 100_000)) process.stderr.write('*');
    if (ok) {
      if (all) {
        idx++;
        console.log(`${ok ? 'ok' : 'not ok'} ${idx} < ${one} : ${two} >`);
      }
    } else {
      fail++;
      idx++;
      console.log(`${ok ? 'ok' : 'not ok'} ${idx} < ${one} : ${two} >`);
    }
  }
}
const ets = Temporal.now.absolute();
console.log(`1..${idx}`);
console.log(`# Sucess: ${cnt - fail}/${cnt} (${ets.difference(sts)})`);

function test(one, two) {
  const dif = one.difference(two);
  const plus = `${one.plus(dif)}` === `${two}`;
  const minus = `${two.minus(dif)}` === `${one}`;
  return plus && minus;
}
