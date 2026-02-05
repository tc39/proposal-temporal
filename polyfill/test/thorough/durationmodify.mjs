import { getProgressBar, makeDurationCases, time, withSnapshotsFromFile } from './support.mjs';

function rotate(array) {
  const value = array.shift();
  array.push(value);
  return value;
}

function anyNegative(bag) {
  return Object.values(bag).some((val) => val < 0);
}

const interestingYears = [0, 1, 2, 10, 2 ** 32 - 1];
const interestingMonths = [0, 1, 12, 25, 2 ** 32 - 1];
const interestingWeeks = [0, 1, 6, 52, 2 ** 32 - 1];
const interestingDays = [0, 1, 7, 28, 29, 30, 31, 60, 356, 366, 1e8];
const interestingHours = [0, 1, 12, 24, 96, 100];
const interestingMinSec = [0, 1, 15, 60, 120, 86400];
const interestingSubsec = [0, 1, 123, 1000, 2000, 1_000_000_000];
const interestingPropertyBags = [];
for (let mask = 1; mask < 2 ** 10; mask++) {
  // Add 2 different property bags with each mask, both negative and positive,
  // otherwise the test is pretty short
  for (const sign of [1, -1]) {
    const bag = {};
    let desc = sign === -1 ? '\\' : '/';
    if (mask & 0x001) {
      const value = rotate(interestingYears);
      bag.years = value * sign;
      desc += `${value}y`;
    }
    if (mask & 0x002) {
      const value = rotate(interestingMonths);
      bag.months = value * sign;
      desc += `${value}m`;
    }
    if (mask & 0x004) {
      const value = rotate(interestingWeeks);
      bag.weeks = value * sign;
      desc += `${value}w`;
    }
    if (mask & 0x008) {
      const value = rotate(interestingDays);
      bag.days = value * sign;
      desc += `${value}d`;
    }
    if (mask & 0x010) {
      const value = rotate(interestingHours);
      bag.hours = value * sign;
      desc += `${value}h`;
    }
    if (mask & 0x020) {
      const value = rotate(interestingMinSec);
      bag.minutes = value * sign;
      desc += `${value}mn`;
    }
    if (mask & 0x040) {
      const value = rotate(interestingMinSec);
      bag.seconds = value * sign;
      desc += `${value}s`;
    }
    if (mask & 0x080) {
      const value = rotate(interestingSubsec);
      bag.milliseconds = value * sign;
      desc += `${value}ms`;
    }
    if (mask & 0x100) {
      const value = rotate(interestingSubsec);
      bag.microseconds = value * sign;
      desc += `${value}u`;
    }
    if (mask & 0x200) {
      const value = rotate(interestingSubsec);
      bag.nanoseconds = value * sign;
      desc += `${value}n`;
    }
    interestingPropertyBags.push([bag, desc]);
  }
}

const interestingDurations = makeDurationCases();
const total = interestingDurations.length * interestingPropertyBags.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationmodify.snapshot.json', (_, matchSnapshotOrOutOfRange) => {
    for (const [d, dStr] of interestingDurations) {
      for (const [bag, bagStr] of interestingPropertyBags) {
        const testName = `${dStr}${bagStr}`;
        progress.tick(1, { test: testName.slice(0, 40) });
        if (anyNegative(bag)) {
          matchSnapshotOrOutOfRange(() => d.negated().with(bag), testName);
        } else {
          matchSnapshotOrOutOfRange(() => d.with(bag), testName);
        }
      }
    }
  });

  return total;
});
