// == Exhaustive / snapshot testing framework ==
//
// To use: Import this file and use its API in your test file. See
// datedifference.mjs for an example.
//
// When you execute that file with `node`, by default it will test the Temporal
// polyfill. To update snapshots (i.e., matchSnapshot assertions will not fail
// and the snapshot file will be created or updated to match the current state
// of the Temporal polyfill) pass the -u argument.
//
// You can also test built-in implementations in other interpreters. It's
// easiest to install them using esvu if possible. You should be able to run
// this file with any JS interpreter, although it must be modern enough to
// support JSON imports.
//
// Snapshot updating is currently not available with other interpreters,
// although it could be implemented by printing to stdout.
//
// Timing on interpreters without process is done with Temporal.Now.instant(),
// so don't change the system clock while running the tests if you want accurate
// timing.

// First figure out a suitable way to output text
let output;
if (typeof console !== 'undefined') {
  // eslint-disable-next-line no-console
  output = console.log;
} else if (typeof print !== 'undefined') {
  output = print;
} else {
  throw new Error("can't find a suitable logging function");
}

// Second, find the Temporal object to be tested
export let temporalImpl;
if (typeof globalThis.Temporal === 'undefined') {
  output('Testing Temporal polyfill');
  temporalImpl = await import('../../lib/temporal.mjs');
} else {
  output('Testing built-in Temporal');
  temporalImpl = globalThis.Temporal;
}

// If run on a host that supports Node.js's command line API, figure out whether
// we are to write snapshots or only read them
let updateSnapshots = false;
if (typeof process !== 'undefined' && process.argv?.length > 2) {
  if (process.argv[2] !== '-u') throw new Error(`Usage: ${process.argv[1]} [-u]`);
  updateSnapshots = true;
}

class AssertionError extends Error {}

export function assertDurationsEqual(actual, expected, message) {
  if (!(actual instanceof temporalImpl.Duration)) throw new AssertionError(`${message}: not a duration`);
  if (
    actual.years !== expected.years ||
    actual.months !== expected.months ||
    actual.weeks !== expected.weeks ||
    actual.days !== expected.days ||
    actual.hours !== expected.hours ||
    actual.minutes !== expected.minutes ||
    actual.seconds !== expected.seconds ||
    actual.milliseconds !== expected.milliseconds ||
    actual.microseconds !== expected.microseconds ||
    actual.nanoseconds !== expected.nanoseconds
  ) {
    throw new AssertionError(`${message}: expected ${expected}, got ${actual}`);
  }
}

export function assertTemporalEqual(actual, expected, message) {
  if (!actual.equals(expected)) throw new AssertionError(`${message}: expected ${expected}, got ${actual}`);
}

export function createDateSkippingInvalidCombinations(y, m, d) {
  try {
    return new temporalImpl.PlainDate(y, m, d);
  } catch (e) {
    // leap day in a common year, skip:
    if (m === 2 && d === 29 && (y % 4 !== 0 || (y % 100 === 0 && y % 400 !== 0))) return null;
    if (y === -271821 && m < 4) return null; // too early for supported range
    if (y === 275760 && m > 9) return null; // too late for supported range
    throw new Error(`${y}-${m}-${d} is invalid: ${e}`);
  }
}

export function createYearMonthSkippingInvalidCombinations(y, m) {
  // Note: -271821-04 is allowed, but difference arithmetic cannot be performed
  // on it due to -271821-04-01 being out of range
  if (y === -271821 && m < 5) return null; // too early for supported range
  try {
    return new temporalImpl.PlainYearMonth(y, m);
  } catch (e) {
    if (y === 275760 && m > 9) return null; // too late for supported range
    throw new Error(`${y}-${m} is invalid: ${e}`);
  }
}

export const interestingDateTimes = [
  [2025, 9, 9, 13, 40, 18, 199, 6, 994], // a recent datetime
  [2025, 9, 8, 14, 41, 19, 200, 7, 995], // earlier date but later time
  [2025, 9, 10, 12, 39, 17, 198, 5, 993], // later date but earlier time
  [1970, 1, 1], // wall time at UTC epoch
  [1969, 12, 31, 23, 59, 59, 999, 999, 999], // wall time 1 ns before UTC epoch
  [2554, 7, 22, 2, 31, 7, 470, 371, 171], // wall time at >2**64 epoch ns
  [1385, 6, 11, 2, 31, 7, 470, 371, 171], // wall time at <-2**64 epoch ns
  [-271821, 4, 19, 0, 0, 0, 0, 0, 1], // earliest supported datetime
  [275760, 9, 13, 23, 59, 59, 999, 999, 999] // latest supported datetime
];

export const interestingMonthDays = [
  [1, 1], // first day of year
  [1, 3], // early day in Jan
  [1, 29], // one month before leap day
  [1, 31], // last day of Jan
  [2, 16], // mid day in Feb
  [2, 28], // day before leap day
  [2, 29], // leap day
  [3, 1], // day after leap day
  [3, 5], // early day in Mar
  [3, 29], // one month after leap day
  [3, 31], // last day of Mar
  [4, 19], // late day in short month, and monthday of earliest supported date
  [5, 1], // first day of long month
  [6, 30], // last day of short month
  [7, 31], // last day of long month
  [8, 14], // mid day in long month
  [9, 13], // early day in short month, and monthday of last supported date
  [10, 24], // late day in long month
  [11, 18], // mid day in short month
  [12, 31] // last day of year
];

export const interestingTimes = [
  [], // midnight
  [0, 0, 0, 0, 0, 1], // 1 ns after midnight
  [0, 0, 0, 0, 1], // 1 µs after midnight
  [0, 0, 0, 1], // 1 ms after midnight
  [0, 0, 1], // 1 s after midnight
  [0, 1], // 1 minute after midnight
  [0, 57, 27, 747, 612, 578],
  [1], // 1 hour after midnight
  [5, 38, 49, 848, 112, 687],
  [6, 20, 46, 408, 452, 805],
  [9, 17, 14, 520, 674, 386],
  [11, 25, 43, 957, 69, 27],
  [12], // noon
  [12, 3, 50, 616, 122, 145],
  [12, 48, 16, 240, 708, 441],
  [17, 1, 51, 609, 471, 506],
  [19, 38, 54, 588, 485, 756],
  [21, 7, 53, 438, 330, 45],
  [23], // 1 hour to midnight
  [23, 59], // 1 minute to midnight
  [23, 59, 59], // 1 second to midnight
  [23, 59, 59, 999], // 1 ms to midnight
  [23, 59, 59, 999, 999], // 1 µs to midnight
  [23, 59, 59, 999, 999, 999] // 1 ns to midnight
];

export const interestingYears = [
  2020, // recent leap year
  2016, // another recent leap year
  2017, // recent common year
  2019, // another recent common year
  2000, // exceptional leap year (divisible by 400)
  1972, // leap year soon after epoch
  1970, // epoch year
  1969, // last year before epoch
  1968, // leap year before epoch
  1900, // first year of computing century, and exceptional common year
  1581, // year before Gregorian calendar reform
  2100, // last non-approximated year of Chinese calendar
  0, // last year of BCE era, check that year 0 is not skipped
  -1, // negative ISO year
  -271821, // earliest supported year
  275760 // last supported year
];

// If process.hrtime is not available, misuse Temporal.Now
const nowBigInt = globalThis.process?.hrtime.bigint ?? (() => temporalImpl.Now.instant().epochNanoseconds);

export async function time(functionBody) {
  const start = nowBigInt();
  const total = await functionBody(start);
  const finish = nowBigInt();
  const elapsed = Number(finish - start) / 1_000_000_000;
  output(`\n${total} tests finished in ${elapsed.toFixed(1)} s`);
  return elapsed;
}

// Set up progress bar; don't print one if stdout isn't a terminal, instead use
// a mock object. (You can force that case by piping the output to cat)
let ProgressBar;
let useFancy = typeof process !== 'undefined' && process.stdout.isTTY;
if (useFancy) {
  try {
    ProgressBar = (await import('progress')).default;
  } catch (e) {
    useFancy = false;
  }
}

export function getProgressBar(start, total) {
  if (useFancy) {
    return new ProgressBar(':bar :percent (:current/:total) | :etas | :test', {
      total,
      complete: '\u2588',
      incomplete: '\u2591',
      width: 20,
      stream: process.stdout,
      renderThrottle: 50,
      clear: true
    });
  }
  return new (class FakeProgressBar {
    #done = 0;

    tick(delta = 1) {
      this.#done += delta;
      // Do print _something_ every 1000 tests, so that there is something to
      // look at while it is in progress.
      if (delta && this.#done % 1000 === 0) {
        const elapsed = Number(nowBigInt() - start) / 1_000_000_000;
        output(`${this.#done} tests completed in ${elapsed.toFixed(1)} seconds.`);
      }
    }

    interrupt() {}
  })();
}

export async function withSnapshotsFromFile(path, testBody) {
  if (updateSnapshots) output(`Snapshot file ${path} will be updated`);

  let snapshotCount = 0;
  let addCount = 0;
  let removeCount = 0;
  let updateCount = 0;
  let snapshots;
  try {
    snapshots = (await import(path, { with: { type: 'json' } })).default;
  } catch (e) {
    if (!updateSnapshots) throw e;
    snapshots = {};
  }
  const newSnapshotEntries = [];

  function matchSnapshot(actual, key) {
    const expected = snapshots[key];
    snapshotCount++;
    if (updateSnapshots) newSnapshotEntries.push([key, actual]);
    const wasPresent = key in snapshots;
    delete snapshots[key];

    if (!wasPresent) {
      if (!updateSnapshots) throw new AssertionError(`Missing or twice-used snapshot ${key}`);
      addCount++;
      return;
    }

    if (actual !== expected) {
      if (!updateSnapshots) {
        throw new AssertionError(`Expected snapshot "${key}" to match ${expected}, but got ${actual}`);
      }
      updateCount++;
    }
  }

  testBody(matchSnapshot);

  const remainingSnapshots = Object.keys(snapshots);
  if (updateSnapshots) {
    removeCount = remainingSnapshots.length;
  } else {
    if (remainingSnapshots.length > 20) {
      throw new AssertionError(
        `not all snapshots were compared:\n  ${remainingSnapshots.slice(0, 20).join('\n  ')}\n  ...and ${
          remainingSnapshots.length - 20
        } more`
      );
    } else if (remainingSnapshots.length !== 0) {
      throw new AssertionError('not all snapshots were compared:\n  ' + remainingSnapshots.join('\n  '));
    }
  }

  output(`${snapshotCount} snapshots compared`);
  if (updateSnapshots) {
    if (addCount || removeCount || updateCount) {
      const fs = await import('node:fs/promises');
      const outputURL = import.meta.resolve(path);
      newSnapshotEntries.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
      await fs.writeFile(new URL(outputURL), JSON.stringify(Object.fromEntries(newSnapshotEntries), undefined, 2));
      output(`${addCount} snapshots added, ${removeCount} removed, ${updateCount} updated`);
    } else {
      output('No updates necessary');
    }
  }
}
