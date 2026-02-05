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

for (const annotation of parseableAnnotations) {
  for (const [dstr] of parseableDates) {
    testCases.push(`${dstr}${annotation}`);

    for (const [tstr] of parseableTimes) {
      for (const t of ['T', 't', ' ']) {
        for (const offset of ['', ...parseableZeroOffsets, ...parseableNegativeOffsets, ...parseablePositiveOffsets]) {
          testCases.push(`${dstr}${t}${tstr}${offset}${annotation}`);
        }

        for (const offset of ['', ...parseablePositiveOffsets]) {
          for (const zone of zones) {
            testCases.push(`${dstr}${t}${tstr}${offset}[${zone}]${annotation}`);
          }
        }
      }
    }

    for (const zone of zones) {
      testCases.push(`${dstr}[${zone}]${annotation}`);
    }
  }

  for (const mdstr of ['11-18', '1118', '--11-18', '--1118']) {
    for (const zone of zones) {
      testCases.push(`${mdstr}[${zone}]${annotation}`);
    }
  }
}

const total = testCases.length;
const expected = new T.PlainMonthDay(11, 18);

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const isoString of testCases) {
    progress.tick(1, { test: isoString.slice(0, 40) });
    const actual = T.PlainMonthDay.from(isoString);
    assertTemporalEqual(actual, expected, isoString);
  }

  return total;
});
