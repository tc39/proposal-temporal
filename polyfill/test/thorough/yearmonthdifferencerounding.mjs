import {
  abbrevs,
  getProgressBar,
  makeYearMonthCases,
  temporalImpl as T,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const units = ['years', 'months'];

const interestingCases = makeYearMonthCases();
const unitCombos = (units.length * (units.length + 1)) / 2;
const total = (unitCombos * interestingCases.length * (interestingCases.length - 1)) / 2;
// 1 month as a rounding increment is already covered in yearmonthdifference.mjs
const roundingGranularities = {
  years: [1, 2],
  months: [2]
};

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./yearmonthdifferencerounding.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [one, str1] of interestingCases) {
      for (const [two, str2] of interestingCases) {
        if (T.PlainYearMonth.compare(one, two) === 1) continue;

        units.forEach((largestUnit, largestUnitIndex) => {
          for (const smallestUnit of units.slice(largestUnitIndex)) {
            const testName = `${str1} : ${str2} ${largestUnit}-${smallestUnit}`;
            progress.tick(1, { test: testName });

            for (const roundingIncrement of roundingGranularities[smallestUnit]) {
              const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode: 'expand' };
              const key = `${str1}:${str2}${abbrevs[largestUnit]}${roundingIncrement}${abbrevs[smallestUnit]}`;

              matchSnapshotOrOutOfRange(() => one.until(two, options).toString(), key);
              matchSnapshotOrOutOfRange(() => two.since(one, options).toString(), `${key}s`);
            }
          }
        });
      }
    }
  });

  return total;
});
