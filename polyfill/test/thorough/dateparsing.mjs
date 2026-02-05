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

for (const [dstr, [y, m, d]] of parseableDates) {
  const expected = new T.PlainDate(y, m, d);

  for (const annotation of parseableAnnotations) {
    testCases.push([`${dstr}${annotation}`, expected]);

    for (const [tstr] of parseableTimes) {
      for (const t of ['T', 't', ' ']) {
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
    const actual = T.PlainDate.from(isoString);
    assertTemporalEqual(actual, expected, isoString);
  }

  return total;
});
