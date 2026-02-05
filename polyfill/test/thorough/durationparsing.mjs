import { assertDurationsEqual, getProgressBar, time, temporalImpl as T } from './support.mjs';

const day = [
  ['', {}],
  ['1Y', { y: 1 }],
  ['2M', { mon: 2 }],
  ['4W', { w: 4 }],
  ['3D', { d: 3 }],
  ['1Y2M', { y: 1, mon: 2 }],
  ['1Y4W', { y: 1, w: 4 }],
  ['1Y3D', { y: 1, d: 3 }],
  ['2M4W', { mon: 2, w: 4 }],
  ['2M3D', { mon: 2, d: 3 }],
  ['4W3D', { w: 4, d: 3 }],
  ['1Y2M4W', { y: 1, mon: 2, w: 4 }],
  ['1Y2M3D', { y: 1, mon: 2, d: 3 }],
  ['1Y4W3D', { y: 1, w: 4, d: 3 }],
  ['2M4W3D', { mon: 2, w: 4, d: 3 }],
  ['1Y2M4W3D', { y: 1, mon: 2, w: 4, d: 3 }]
];
const times = [
  ['', {}],
  ['4H', { h: 4 }],
  ['5M', { min: 5 }],
  ['4H5M', { h: 4, min: 5 }]
];
const sec = [
  ['', {}],
  ['6S', { s: 6 }],
  ['7.1S', { s: 7, ms: 100 }],
  ['7.12S', { s: 7, ms: 120 }],
  ['7.123S', { s: 7, ms: 123 }],
  ['8.1234S', { s: 8, ms: 123, µs: 400 }],
  ['8.12345S', { s: 8, ms: 123, µs: 450 }],
  ['8.123456S', { s: 8, ms: 123, µs: 456 }],
  ['9.1234567S', { s: 9, ms: 123, µs: 456, ns: 700 }],
  ['9.12345678S', { s: 9, ms: 123, µs: 456, ns: 780 }],
  ['9.123456789S', { s: 9, ms: 123, µs: 456, ns: 789 }],
  ['0.123S', { ms: 123 }],
  ['0.000456S', { µs: 456 }],
  ['0.000000789S', { ns: 789 }],
  ['0.123456S', { ms: 123, µs: 456 }],
  ['0.123000789S', { ms: 123, ns: 789 }],
  ['0.000456789S', { µs: 456, ns: 789 }],
  ['0.123456789S', { ms: 123, µs: 456, ns: 789 }]
];
for (const [str, expect] of sec) {
  if (str.includes('.')) sec.push([str.replace('.', ','), expect]);
}

var tim = sec
  .reduce((arr, [s, add]) => arr.concat(times.map(([p, expect]) => [`${p}${s}`, { ...expect, ...add }])), [])
  .slice(1);

const testCases = [];

for (const [str, expectation] of day.slice(1)) {
  const { y = 0, mon = 0, w = 0, d = 0 } = expectation;
  const expected = new T.Duration(y, mon, w, d);

  for (const s of [str, str.toLowerCase()]) {
    for (const p of ['P', 'p']) {
      testCases.push([`${p}${s}`, expected]);
    }
  }
}
for (const [str, expectation] of tim) {
  const { h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0 } = expectation;
  const expected = new T.Duration(0, 0, 0, 0, h, min, s, ms, µs, ns);

  for (const s of [str, str.toLowerCase()]) {
    for (const p of ['P', 'p']) {
      for (const t of ['T', 't']) {
        testCases.push([`${p}${t}${s}`, expected]);
      }
    }
  }
}
for (const [dstr, { y = 0, mon = 0, w = 0, d = 0 }] of day) {
  for (const [tstr, { h = 0, min = 0, s = 0, ms = 0, µs = 0, ns = 0 }] of tim) {
    const expected = new T.Duration(y, mon, w, d, h, min, s, ms, µs, ns);

    for (const ds of [dstr, dstr.toLowerCase()]) {
      for (const ts of [tstr, tstr.toLowerCase()]) {
        for (const p of ['P', 'p']) {
          for (const t of ['T', 't']) {
            testCases.push([`${p}${ds}${t}${ts}`, expected]);
          }
        }
      }
    }
  }
}

const total = testCases.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [isoString, expected] of testCases) {
    progress.tick(1, { test: isoString });
    const actual = T.Duration.from(isoString);
    assertDurationsEqual(actual, expected, isoString);
  }

  return total;
});
