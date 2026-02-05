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

const parseableZeroZones = [
  '+00:00',
  '+00',
  '+0000',
  '-00:00',
  '-00',
  '-0000',
  'UTC',
  '!UTC',
  'utc',
  'uTc',
  'Etc/UTC',
  'Etc/GMT'
];

const parseableMinus4Zones = [
  '-04:00',
  '-04',
  '-0400',
  'America/La_Paz',
  '!America/La_Paz',
  'america/la_paz',
  'AMERICA/LA_PAZ',
  'aMeRiCa/lA_pAz'
];

// Array of [offset string to append, time zone ID, hours to adjust the
// wall-clock time]
const offsetZones = [];
for (const zone of parseableMinus4Zones) {
  for (const offset of parseableNegativeOffsets) {
    offsetZones.push([offset, zone, 0]);
  }
  offsetZones.push(['Z', zone, -4]);
  offsetZones.push(['z', zone, -4]);
  offsetZones.push(['', zone, 0]);
}
for (const zone of parseablePlus1Zones) {
  for (const offset of parseablePositiveOffsets) {
    offsetZones.push([offset, zone, 0]);
  }
  offsetZones.push(['Z', zone, 1]);
  offsetZones.push(['z', zone, 1]);
  offsetZones.push(['', zone, 0]);
}
for (const zone of parseableZeroZones) {
  for (const offset of parseableZeroOffsets) {
    offsetZones.push([offset, zone, 0]);
  }
  offsetZones.push(['Z', zone, 0]);
  offsetZones.push(['z', zone, 0]);
  offsetZones.push(['', zone, 0]);
}

const testCases = [];

for (const [dstr, [y, mon, d]] of parseableDates) {
  for (const [offset, zone, hours] of offsetZones) {
    // Avoid hardcoded offset for named time zones in the past when local mean
    // time was used
    const lcZone = zone.toLowerCase();
    if (y < 1933 && lcZone.includes('america/la_paz')) continue;
    if (y < 1920 && lcZone.includes('africa/lagos')) continue;

    const conversionZone = zone.startsWith('!') ? zone.slice(1) : zone;

    for (const [tstr, [h, min = 0, s = 0, ms = 0, µs = 0, ns = 0]] of parseableTimes) {
      const expected = new T.PlainDateTime(y, mon, d, h, min, s, ms, µs, ns)
        .add({ hours })
        .toZonedDateTime(conversionZone);

      for (const t of ['T', 't', ' ']) {
        for (const annotation of parseableAnnotations) {
          testCases.push([`${dstr}${t}${tstr}${offset}[${zone}]${annotation}`, expected]);
        }
      }
    }

    const expected = new T.PlainDateTime(y, mon, d).toZonedDateTime(conversionZone);
    for (const annotation of parseableAnnotations) {
      testCases.push([`${dstr}[${zone}]${annotation}`, expected]);
    }
  }
}

const total = testCases.length;

await time((start) => {
  const progress = getProgressBar(start, total);

  for (const [isoString, expected] of testCases) {
    progress.tick(1, { test: isoString.slice(0, 40) });
    const actual = T.ZonedDateTime.from(isoString);
    assertTemporalEqual(actual, expected, isoString);
  }

  return total;
});
