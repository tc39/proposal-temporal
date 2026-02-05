import {
  assertTemporalEqual,
  getProgressBar,
  parseableAnnotations,
  parseableDates,
  parseableNegativeOffsets,
  parseablePlus1Zones,
  parseablePositiveOffsets,
  parseableTimes,
  parseableZeroOffsets,
  temporalImpl as T,
  time
} from './support.mjs';

const zones = [...parseablePlus1Zones, 'Custom/Vienna'];

const testCases = [];

for (const [dstr, [y, mon, d]] of parseableDates) {
  for (const [tstr, [h, min = 0, s = 0, ms = 0, µs = 0, ns = 0]] of parseableTimes) {
    const expected = new T.PlainDateTime(y, mon, d, h, min, s, ms, µs, ns);

    for (const t of ['T', 't', ' ']) {
      for (const annotation of parseableAnnotations) {
        for (const offset of ['', ...parseableZeroOffsets, ...parseableNegativeOffsets, ...parseablePositiveOffsets]) {
          testCases.push([`${dstr}${t}${tstr}${offset}${annotation}`, expected]);
        }

        for (const offset of ['', ...parseablePositiveOffsets]) {
          for (const zone of zones) {
            testCases.push([`${dstr}${t}${tstr}${offset}[${zone}]${annotation}`, expected]);
          }
        }
      }
    }
  }

  const expected = new T.PlainDateTime(y, mon, d);
  for (const annotation of parseableAnnotations) {
    testCases.push([`${dstr}${annotation}`, expected]);

    for (const zone of zones) {
      testCases.push([`${dstr}[${zone}]${annotation}`, expected]);
    }
  }
}

const total = testCases.length;

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const [isoString, expected] of testCases) {
    progress.tick(1, { test: isoString.slice(0, 40) });
    const actual = T.PlainDateTime.from(isoString);
    assertTemporalEqual(actual, expected, isoString);
  }

  return total;
});
