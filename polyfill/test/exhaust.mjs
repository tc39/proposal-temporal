import * as Temporal from 'proposal-temporal';

const all = process.argv[2] === 'all';
const start = new Temporal.PlainDate(1999, 1, 1);
const end = new Temporal.PlainDate(2009, 12, 31);

console.log('Tap version 13');
console.log('1..N');
let idx = 0;
let cnt = 0;
let fail = 0;
const sts = Temporal.Now.instant();
for (let one = start; Temporal.PlainDate.compare(one, end); one = one.add('P1D')) {
  for (let two = one; Temporal.PlainDate.compare(two, end); two = two.add('P1D')) {
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
const ets = Temporal.Now.instant();
console.log(`1..${idx}`);
console.log(`# Sucess: ${cnt - fail}/${cnt} (${ets.since(sts)})`);

function test(one, two) {
  const dif = one.since(two);
  const add = `${one.add(dif)}` === `${two}`;
  const subtract = `${two.subtract(dif)}` === `${one}`;
  return add && subtract;
}
