import {
  assertTemporalEqual,
  getProgressBar,
  makeZonedCases,
  makeDateTimePropertyBags,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

function needsOffsetToBeUnambiguous(zdt) {
  const { year, monthCode, day, hour, minute, timeZoneId: timeZone } = zdt;
  try {
    T.ZonedDateTime.from({ year, monthCode, day, hour, minute, timeZone }, { disambiguation: 'reject' });
    return false;
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
    return true;
  }
}

const interestingDateTimes = makeZonedCases();
const interestingPropertyBags = makeDateTimePropertyBags();
const total = interestingDateTimes.length * interestingPropertyBags.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./zonedmodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [dt, dtStr] of interestingDateTimes) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${dtStr}/${bagStr}`;
        progress.tick(1, { test: testName.slice(0, 40) });

        const rejectResult = matchSnapshotOrOutOfRange(() => dt.with(bag, { overflow: 'reject' }), testName);
        if (rejectResult) {
          // if 'reject' didn't throw, other options should produce the same
          // result
          assertTemporalEqual(dt.with(bag, { overflow: 'constrain' }), rejectResult);
        } else {
          matchSnapshotOrOutOfRange(() => dt.with(bag, { overflow: 'constrain' }), testName + 'c');
        }

        if (!needsOffsetToBeUnambiguous(dt)) continue;

        for (const offset of ['use', 'reject', 'prefer']) {
          matchSnapshotOrOutOfRange(() => dt.with(bag, { offset }), testName + offset.slice(0, 1));
        }

        // disambiguation only takes effect when offset = 'ignore', or when
        // offset = 'prefer' and a new offset is provided in the property bag,
        // which we don't test here
        for (const disambiguation of ['earlier', 'later', 'compatible']) {
          matchSnapshotOrOutOfRange(
            () => dt.with(bag, { disambiguation, offset: 'ignore' }),
            testName + disambiguation.slice(0, 1) + 'i'
          );
        }
      }
    }
  });

  return total;
});
