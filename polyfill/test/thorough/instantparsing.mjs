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

const testCases = [];

for (const [dstr, [y, mon, d]] of parseableDates) {
  for (const [tstr, [h, min = 0, s = 0, ms = 0, µs = 0, ns = 0]] of parseableTimes) {
    const expected = new T.PlainDateTime(y, mon, d, h, min, s, ms, µs, ns);
    const negOffsetExpected = new T.PlainDateTime(y, mon, d, h + 4, min, s, ms, µs, ns);
    const posOffsetExpected = new T.PlainDateTime(y, mon, d, h - 1, min, s, ms, µs, ns);

    for (const t of ['T', 't', ' ']) {
      for (const annotation of parseableAnnotations) {
        for (const z of ['Z', 'z', ...parseableZeroOffsets]) {
          testCases.push([`${dstr}${t}${tstr}${z}${annotation}`, expected]);
        }

        for (const offset of parseableNegativeOffsets) {
          testCases.push([`${dstr}${t}${tstr}${offset}${annotation}`, negOffsetExpected]);
        }

        for (const offset of parseablePositiveOffsets) {
          for (const zone of parseablePlus1Zones) {
            testCases.push([`${dstr}${t}${tstr}${offset}[${zone}]${annotation}`, posOffsetExpected]);
          }
        }
      }
    }
  }
}

const total = testCases.length;

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const [isoString, expected] of testCases) {
    progress.tick(1, { test: isoString.slice(0, 40) });
    const instant = T.Instant.from(isoString);
    const datetime = instant.toZonedDateTimeISO('UTC').toPlainDateTime();
    assertTemporalEqual(datetime, expected, isoString);
  }

  return total;
});
