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

for (const [dstr, [y, m]] of parseableDates) {
  const expected = new T.PlainYearMonth(y, m);

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

const parseableYearMonths = [
  ['1976-11', [1976, 11]],
  ['197611', [1976, 11]],
  ['-009999-11', [-9999, 11]],
  ['-00999911', [-9999, 11]],
  ['+191976-11', [191976, 11]],
  ['+19197611', [191976, 11]]
];

for (const [ymstr, [y, m]] of parseableYearMonths) {
  const expected = new T.PlainYearMonth(y, m);

  for (const annotation of parseableAnnotations) {
    testCases.push([`${ymstr}${annotation}`, expected]);

    for (const zone of zones) {
      testCases.push([`${ymstr}[${zone}]${annotation}`, expected]);
    }
  }
}

const total = testCases.length;

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const [isoString, expected] of testCases) {
    progress.tick(1, { test: isoString.slice(0, 40) });
    const actual = T.PlainYearMonth.from(isoString);
    assertTemporalEqual(actual, expected, isoString);
  }

  return total;
});
