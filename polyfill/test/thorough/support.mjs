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

export function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new AssertionError(`${message}: expected ${expected}, got ${actual}`);
}

export function assertOffByLessThanOne(actual, expected, message) {
  if (Math.abs(actual - expected) >= 1) {
    throw new AssertionError(`${message}: expected ${expected} and ${actual} to differ by at most 1`);
  }
}

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

export const durationUnits = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds'
];
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

// No need to put negative durations in this list; tests should test the
// negations of these durations as well
export const interestingDurations = [
  [], // zero
  // one of each unit
  [1],
  [0, 1],
  [0, 0, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // one of all units
  // a small number of each of two consecutive units
  [5, 5],
  [0, 5, 5],
  [0, 0, 5, 5],
  [0, 0, 0, 5, 5],
  [0, 0, 0, 0, 5, 5],
  [0, 0, 0, 0, 0, 5, 5],
  [0, 0, 0, 0, 0, 0, 5, 5],
  [0, 0, 0, 0, 0, 0, 0, 5, 5],
  [0, 0, 0, 0, 0, 0, 0, 0, 5, 5],
  // a large number of each of two consecutive units
  [5432, 5432],
  [0, 5432, 5432],
  [0, 0, 5432, 5432],
  [0, 0, 0, 5432, 5432],
  [0, 0, 0, 0, 5432, 5432],
  [0, 0, 0, 0, 0, 5432, 5432],
  [0, 0, 0, 0, 0, 0, 5432, 5432],
  [0, 0, 0, 0, 0, 0, 0, 5432, 5432],
  [0, 0, 0, 0, 0, 0, 0, 0, 5432, 5432],
  // large calendar unit plus small time unit
  [2345, 0, 0, 0, 12],
  [0, 2345, 0, 0, 0, 45],
  [0, 0, 2345, 0, 0, 0, 15],
  // enough of each unit to overflow to the next highest
  [0, 13],
  [0, 0, 5],
  [0, 0, 0, 8],
  [0, 0, 0, 0, 25],
  [0, 0, 0, 0, 0, 61],
  [0, 0, 0, 0, 0, 0, 61],
  [0, 0, 0, 0, 0, 0, 0, 1001],
  [0, 0, 0, 0, 0, 0, 0, 0, 1001],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1001],
  [0, 13, 5, 40, 25, 61, 61, 1001, 1001, 1001], // enough of all to overflow
  // exact number for each unit that balances up to the next, assuming ISO cal
  [0, 12],
  [0, 0, 0, 7],
  [0, 0, 0, 0, 24],
  [0, 0, 0, 0, 0, 60],
  [0, 0, 0, 0, 0, 0, 60],
  [0, 0, 0, 0, 0, 0, 0, 1000],
  [0, 0, 0, 0, 0, 0, 0, 0, 1000],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1000],
  // multiple units balancing up to one higher unit
  [0, 0, 0, 6, 24],
  [0, 0, 0, 6, 23, 60],
  [0, 0, 0, 6, 23, 59, 60],
  [0, 0, 0, 6, 23, 59, 59, 1000],
  [0, 0, 0, 6, 23, 59, 59, 999, 1000],
  [0, 0, 0, 6, 23, 59, 59, 999, 999, 1000],
  [0, 0, 0, 0, 23, 60],
  [0, 0, 0, 0, 23, 59, 60],
  [0, 0, 0, 0, 23, 59, 59, 1000],
  [0, 0, 0, 0, 23, 59, 59, 999, 1000],
  [0, 0, 0, 0, 23, 59, 59, 999, 999, 1000],
  [0, 0, 0, 0, 0, 59, 60],
  [0, 0, 0, 0, 0, 59, 59, 1000],
  [0, 0, 0, 0, 0, 59, 59, 999, 1000],
  [0, 0, 0, 0, 0, 59, 59, 999, 999, 1000],
  [0, 0, 0, 0, 0, 0, 59, 1000],
  [0, 0, 0, 0, 0, 0, 59, 999, 1000],
  [0, 0, 0, 0, 0, 0, 59, 999, 999, 1000],
  [0, 0, 0, 0, 0, 0, 0, 999, 1000],
  [0, 0, 0, 0, 0, 0, 0, 999, 999, 1000],
  [0, 0, 0, 0, 0, 0, 0, 0, 999, 1000],
  // exactly half of a higher unit, for rounding
  [0, 6, 0, 1, 12], // half of a common ISO year relative to 01-01
  [0, 6, 0, 1], // half of a leap ISO year relative to 01-01
  [0, 0, 2], // half of a 28-day ISO month
  [0, 0, 2, 0, 12], // half of a 29-day ISO month
  [0, 0, 2, 1], // half of a 30-day ISO month
  [0, 0, 2, 1, 12], // half of a 31-day ISO month
  [0, 0, 0, 3, 12], // half an ISO week
  [0, 0, 0, 0, 12], // half a regular day
  [0, 0, 0, 0, 11, 30], // half a short DST day
  [0, 0, 0, 0, 12, 30], // half a long DST day
  [0, 0, 0, 0, 0, 30], // half an hour
  [0, 0, 0, 0, 0, 0, 30], // half a minute
  [0, 0, 0, 0, 0, 0, 0, 500], // half a second
  [0, 0, 0, 0, 0, 0, 0, 0, 500], // half a millisecond
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 500], // half a microsecond
  // various numbers of individual units
  [2],
  [10000],
  [0, 6],
  [0, 9],
  [0, 11],
  [0, 18],
  [0, 0, 3],
  [0, 0, 4],
  [0, 0, 52],
  [0, 0, 54],
  [0, 0, 0, 6],
  [0, 0, 0, 10],
  [0, 0, 0, 27],
  [0, 0, 0, 28],
  [0, 0, 0, 29],
  [0, 0, 0, 30],
  [0, 0, 0, 31],
  [0, 0, 0, 40],
  [0, 0, 0, 65],
  [0, 0, 0, 190],
  [0, 0, 0, 0, 2],
  [0, 0, 0, 0, 13],
  [0, 0, 0, 0, 22],
  [0, 0, 0, 0, 36],
  [0, 0, 0, 0, 48],
  [0, 0, 0, 0, 60],
  [0, 0, 0, 0, 2756],
  [0, 0, 0, 0, 0, 6],
  [0, 0, 0, 0, 0, 90],
  [0, 0, 0, 0, 0, 180],
  [0, 0, 0, 0, 0, 130],
  [0, 0, 0, 0, 0, 0, 45],
  [0, 0, 0, 0, 0, 0, 86400],
  [0, 0, 0, 0, 0, 0, 0, 200],
  [0, 0, 0, 0, 0, 0, 0, 3500],
  [0, 0, 0, 0, 0, 0, 0, 0, 144],
  [0, 0, 0, 0, 0, 0, 0, 0, 654321],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 222],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 123456789],
  // various other durations that have come up in bug reports or test cases
  [3, 11, 0, 28],
  [3, 11, 0, 27],
  [2, 3, 1, 5, 10, 59, 59, 999, 999, 999],
  [1, 8],
  [1, 6],
  [1, 2, 3, 4, 5, 6, 7, 987, 654, 321],
  [1, 13],
  [1, 1, 0, 0, 999],
  [1, 0, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 0, 24],
  [0, 50, 0, 50, 50, 100],
  [0, 3, 0, 12],
  [0, 10, 0, 15],
  [0, 1, 9, 15],
  [0, 1, 2],
  [0, 1, 1],
  [0, 1, 0, 30],
  [0, 1, 0, 16],
  [0, 1, 0, 15, 12],
  [0, 1, 0, 1],
  [0, 1, 0, 0, 24],
  [0, 1, 0, 0, 24, 0, 0, 0, 0, 1000000000],
  [0, 1, 0, 0, 10],
  [0, 0, 52, 20],
  [0, 0, 3, 8, 25, 61, 61],
  [0, 0, 2, 3],
  [0, 0, 1, 1],
  [0, 0, 1, 0, 168],
  [0, 0, 0, 3, 7, 0, 630],
  [0, 0, 0, 3, 6, 50],
  [0, 0, 0, 3, 4, 59],
  [0, 0, 0, 2, 6],
  [0, 0, 0, 10, 25],
  [0, 0, 0, 1, 23, 59, 59, 999, 999, 999],
  [0, 0, 0, 1, 1, 0, 43200],
  [0, 0, 0, 0, 79, 10],
  [0, 0, 0, 0, 24, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 2, 45],
  [0, 0, 0, 0, 2, 34, 18],
  [0, 0, 0, 0, 2, 30],
  [0, 0, 0, 0, 130, 20],
  [0, 0, 0, 0, 1, 30],
  [0, 0, 0, 0, 0, 10, 52],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 59, 0, 0, 999999999],
  [0, 0, 0, 0, 0, 0, 1, 999, 999, 999],
  [0, 0, 0, 0, 0, 0, 1, 500],
  [0, 0, 0, 0, 0, 0, 1, 234, 567, 890],
  [0, 0, 0, 0, 0, 0, 0, 2, 100],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 999],
  // span of min instant to max instant, in each largest unit
  [547581, 4, 0, 24],
  [0, 6570976, 0, 24],
  [0, 0, 28571428, 4],
  [0, 0, 0, 2e8],
  [0, 0, 0, 0, 48e8],
  [0, 0, 0, 0, 0, 288e9],
  [0, 0, 0, 0, 0, 0, 1728e10],
  [0, 0, 0, 0, 0, 0, 0, 1728e13],
  [0, 0, 0, 0, 0, 0, 0, 0, 1728e16],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1728e19],
  // max of each unit
  [2 ** 32 - 1],
  [0, 2 ** 32 - 1],
  [0, 0, 2 ** 32 - 1],
  [0, 0, 0, 104249991374],
  [0, 0, 0, 0, 2501999792983],
  [0, 0, 0, 0, 0, 150119987579016],
  [0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER],
  [0, 0, 0, 0, 0, 0, 0, Number(9_007_199_254_740_991_487n)],
  [0, 0, 0, 0, 0, 0, 0, 0, Number(9_007_199_254_740_991_475_711n)],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, Number(9_007_199_254_740_991_463_129_087n)],
  // max calendar unit plus 1 ns
  [2 ** 32 - 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 2 ** 32 - 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 2 ** 32 - 1, 0, 0, 0, 0, 0, 0, 1],
  // max safe number of subsecond units
  [0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER],
  [0, 0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER],
  // just below max safe number of subsecond units
  [0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER - 1],
  [0, 0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER - 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER - 1],
  // various expressions of max time duration
  [0, 0, 0, 1, 0, 0, 9007199254654591, 0, 0, 999999999],
  [0, 0, 0, 0, 0, 0, Number.MAX_SAFE_INTEGER, 0, 0, 999999999]
];

const randomCalendarDurations = [
  // 20 randomly generated durations, 0-100,000 of each unit
  [62308, 91609, 28102, 70221, 73421, 64190, 75687, 46717, 99418, 84900],
  [67714, 32306, 23868, 35450, 5844, 78105, 98308, 97986, 20512, 40261],
  [25446, 61680, 97488, 97293, 83545, 12073, 45328, 35765, 67805, 48581],
  [45009, 61959, 71382, 92859, 63805, 31371, 9694, 56928, 55931, 9869],
  [77397, 65671, 93650, 17115, 87744, 27768, 10239, 76472, 72329, 31649],
  [11838, 91376, 59389, 83598, 86810, 81399, 85485, 76353, 58021, 87636],
  [3843, 59711, 52041, 96361, 86864, 59254, 83974, 29361, 80396, 7252],
  [88542, 87243, 77762, 36972, 52350, 71209, 97625, 56711, 11203, 95642],
  [46053, 59659, 64005, 58777, 95495, 27240, 54291, 11494, 72475, 62302],
  [47109, 93575, 98776, 99612, 29002, 53011, 41302, 76241, 27484, 91807],
  [41739, 45710, 71014, 47701, 73961, 19262, 33439, 46711, 93693, 26008],
  [68211, 56145, 13327, 68832, 4563, 98043, 71310, 22752, 69486, 28181],
  [22092, 76377, 14965, 87706, 59784, 40392, 95987, 68812, 2363, 63307],
  [27648, 34638, 50467, 66503, 60827, 92730, 74204, 1960, 55682, 15094],
  [5840, 12367, 99041, 11805, 54571, 52287, 94758, 29152, 8413, 14944],
  [96283, 62964, 61595, 42935, 35791, 80487, 19173, 4511, 96571, 96362],
  [30820, 1953, 58834, 63529, 48771, 60249, 3789, 65163, 87122, 90258],
  [2337, 65668, 17940, 80817, 66845, 52165, 90996, 53223, 31467, 73807],
  [71588, 32883, 54629, 20118, 77194, 73183, 6898, 72709, 70019, 50730],
  [86446, 52438, 46372, 59141, 80719, 32999, 7608, 69960, 80104, 53107]
];

const randomHumanScaleCalendarDurations = [
  // 50 randomly generated durations, 0-10000 of each subsecond unit and 0-100
  // of each other unit
  [55, 85, 30, 8, 10, 62, 4, 7489, 8207, 1623],
  [81, 94, 38, 52, 4, 59, 17, 488, 7874, 5472],
  [90, 20, 86, 67, 18, 5, 79, 8836, 1262, 8234],
  [1, 12, 78, 38, 74, 25, 52, 4572, 8794, 5573],
  [13, 89, 82, 11, 65, 62, 34, 7175, 2718, 7372],
  [65, 35, 44, 32, 67, 68, 68, 2021, 151, 1156],
  [78, 27, 88, 46, 39, 48, 99, 6439, 6366, 4547],
  [52, 11, 94, 42, 73, 34, 98, 2812, 7372, 5523],
  [31, 51, 45, 25, 60, 53, 58, 7801, 1467, 3134],
  [35, 75, 34, 3, 1, 80, 57, 4909, 5515, 115],
  [53, 69, 25, 97, 42, 41, 52, 2889, 5033, 1742],
  [10, 17, 11, 94, 31, 28, 54, 7254, 9352, 429],
  [35, 97, 73, 74, 19, 87, 61, 3610, 2422, 6413],
  [64, 61, 74, 9, 77, 68, 71, 2480, 4883, 3382],
  [17, 24, 80, 25, 11, 62, 79, 1257, 5325, 9424],
  [54, 56, 35, 99, 32, 44, 75, 8509, 2998, 4450],
  [76, 38, 28, 80, 63, 55, 74, 9431, 6194, 7521],
  [66, 36, 25, 91, 10, 36, 22, 3487, 7761, 4687],
  [66, 77, 72, 45, 25, 23, 16, 5550, 3351, 3279],
  [76, 14, 9, 49, 57, 19, 54, 7174, 4351, 2743],
  [27, 27, 33, 36, 62, 1, 77, 7522, 7684, 3458],
  [27, 85, 40, 86, 19, 14, 68, 5984, 5962, 6952],
  [29, 47, 25, 9, 64, 8, 96, 7602, 6679, 4324],
  [25, 13, 26, 57, 69, 39, 60, 7509, 436, 4279],
  [68, 49, 80, 21, 89, 44, 26, 8483, 724, 7783],
  [99, 23, 15, 99, 62, 1, 6, 7577, 5542, 7093],
  [21, 46, 75, 54, 79, 3, 84, 3513, 6060, 3482],
  [48, 10, 54, 67, 21, 17, 68, 6369, 1641, 1736],
  [26, 9, 85, 22, 75, 4, 10, 4176, 7463, 3262],
  [46, 59, 3, 41, 69, 0, 75, 2508, 2815, 6637],
  [48, 15, 7, 48, 50, 95, 65, 8083, 4953, 883],
  [21, 96, 57, 41, 15, 41, 75, 1432, 4430, 8323],
  [32, 10, 54, 50, 14, 85, 20, 8897, 972, 9926],
  [33, 0, 66, 65, 98, 20, 54, 539, 2532, 2882],
  [54, 10, 60, 28, 11, 11, 39, 2116, 9934, 8522],
  [58, 23, 89, 8, 40, 57, 40, 2271, 7131, 3123],
  [32, 90, 41, 57, 65, 54, 33, 7451, 8645, 5404],
  [49, 37, 39, 97, 63, 33, 82, 9608, 6310, 8055],
  [23, 46, 37, 12, 60, 33, 22, 3969, 8839, 1071],
  [32, 3, 72, 25, 19, 14, 78, 4987, 7197, 8915],
  [25, 66, 93, 46, 30, 97, 44, 1041, 2977, 3067],
  [33, 45, 44, 80, 62, 84, 4, 3160, 3353, 8448],
  [40, 27, 12, 79, 54, 7, 43, 4526, 3108, 3715],
  [95, 24, 14, 91, 2, 35, 66, 7852, 999, 8605],
  [64, 83, 84, 79, 84, 94, 25, 4604, 6616, 4839],
  [99, 8, 97, 91, 4, 47, 95, 8853, 7682, 2696],
  [40, 19, 19, 39, 72, 43, 68, 1345, 3231, 3473],
  [40, 68, 30, 92, 50, 34, 52, 9756, 1640, 7133],
  [40, 57, 1, 41, 75, 2, 44, 9140, 8976, 4961],
  [59, 81, 88, 52, 23, 92, 94, 3296, 5208, 4116]
];

const randomNonCalendarDurations = [
  // 20 randomly generated durations, 0 calendar units and 0-100,000 of each
  // other unit
  [0, 0, 0, 30203, 1183, 28485, 15179, 29980, 99047, 75079],
  [0, 0, 0, 70466, 68156, 84166, 82858, 28367, 97441, 61900],
  [0, 0, 0, 58882, 23755, 20879, 1033, 4180, 70290, 79730],
  [0, 0, 0, 29565, 45186, 22220, 43466, 19744, 36560, 36903],
  [0, 0, 0, 97712, 78757, 87324, 43167, 17313, 66926, 31887],
  [0, 0, 0, 19938, 41118, 69264, 5112, 4396, 4767, 79643],
  [0, 0, 0, 13432, 8322, 99434, 71878, 69359, 10346, 47022],
  [0, 0, 0, 83012, 3703, 2072, 34125, 15888, 9000, 64602],
  [0, 0, 0, 47784, 78138, 37407, 94535, 14875, 22482, 50601],
  [0, 0, 0, 86199, 99674, 80974, 25866, 81674, 26111, 85383],
  [0, 0, 0, 8848, 10427, 84598, 26653, 41517, 98977, 79521],
  [0, 0, 0, 21413, 49675, 12596, 54682, 64284, 77664, 744],
  [0, 0, 0, 22587, 50961, 62364, 22120, 59539, 77590, 54345],
  [0, 0, 0, 95331, 7448, 32044, 14388, 81868, 60076, 12177],
  [0, 0, 0, 56057, 26640, 3804, 64036, 53464, 77275, 49095],
  [0, 0, 0, 96479, 44640, 77950, 14870, 93648, 15628, 45998],
  [0, 0, 0, 7502, 97107, 7034, 71314, 46018, 21087, 36799],
  [0, 0, 0, 99902, 92600, 22328, 27744, 97267, 96985, 37225],
  [0, 0, 0, 88429, 8091, 64854, 85372, 86949, 76719, 71318],
  [0, 0, 0, 9695, 6676, 79492, 33528, 38688, 49291, 2779]
];

const randomHumanScaleTimeOnlyDurations = [
  // 50 randomly generated durations, 0-10000 of each subsecond unit, 0-100
  // of each other time unit, and 0 days or calendar units
  [0, 0, 0, 0, 10, 34, 20, 3414, 2533, 8950],
  [0, 0, 0, 0, 84, 29, 9, 3546, 4255, 6190],
  [0, 0, 0, 0, 42, 95, 57, 5713, 98, 3874],
  [0, 0, 0, 0, 73, 22, 16, 8630, 4149, 5478],
  [0, 0, 0, 0, 58, 23, 85, 7107, 5640, 8069],
  [0, 0, 0, 0, 6, 43, 62, 552, 6971, 4806],
  [0, 0, 0, 0, 29, 17, 48, 376, 2656, 7589],
  [0, 0, 0, 0, 3, 44, 15, 3988, 1721, 1396],
  [0, 0, 0, 0, 49, 81, 34, 7369, 392, 5181],
  [0, 0, 0, 0, 40, 56, 0, 7713, 7022, 8681],
  [0, 0, 0, 0, 74, 64, 74, 5383, 5157, 8895],
  [0, 0, 0, 0, 12, 71, 33, 921, 4190, 9753],
  [0, 0, 0, 0, 0, 41, 71, 9091, 1532, 5871],
  [0, 0, 0, 0, 84, 57, 0, 4210, 7213, 4876],
  [0, 0, 0, 0, 82, 70, 55, 58, 7467, 1147],
  [0, 0, 0, 0, 59, 48, 47, 4558, 9970, 4578],
  [0, 0, 0, 0, 47, 52, 26, 3022, 926, 719],
  [0, 0, 0, 0, 52, 1, 68, 832, 2116, 9707],
  [0, 0, 0, 0, 19, 40, 29, 9943, 7963, 1740],
  [0, 0, 0, 0, 31, 12, 24, 2698, 8937, 1445],
  [0, 0, 0, 0, 33, 79, 25, 2718, 1512, 8028],
  [0, 0, 0, 0, 63, 31, 91, 4543, 1817, 5169],
  [0, 0, 0, 0, 57, 96, 81, 8182, 1975, 689],
  [0, 0, 0, 0, 4, 31, 82, 2905, 1819, 9805],
  [0, 0, 0, 0, 37, 58, 53, 7095, 3477, 4436],
  [0, 0, 0, 0, 55, 39, 33, 2452, 4987, 4599],
  [0, 0, 0, 0, 50, 65, 46, 2227, 2427, 3063],
  [0, 0, 0, 0, 88, 6, 2, 1241, 1588, 5729],
  [0, 0, 0, 0, 18, 39, 33, 2123, 3060, 8829],
  [0, 0, 0, 0, 10, 32, 31, 803, 1873, 1931],
  [0, 0, 0, 0, 97, 29, 78, 5773, 4081, 3225],
  [0, 0, 0, 0, 34, 43, 37, 2391, 1230, 2367],
  [0, 0, 0, 0, 12, 40, 42, 651, 9598, 3987],
  [0, 0, 0, 0, 6, 19, 77, 7267, 8706, 7507],
  [0, 0, 0, 0, 46, 72, 86, 9972, 7521, 582],
  [0, 0, 0, 0, 68, 63, 81, 4135, 8164, 5408],
  [0, 0, 0, 0, 38, 71, 85, 6442, 3164, 2634],
  [0, 0, 0, 0, 21, 59, 35, 9167, 4202, 3938],
  [0, 0, 0, 0, 40, 42, 11, 7514, 6820, 3717],
  [0, 0, 0, 0, 56, 34, 51, 925, 7531, 9899],
  [0, 0, 0, 0, 40, 12, 7, 4284, 6667, 3195],
  [0, 0, 0, 0, 48, 19, 45, 406, 7392, 9400],
  [0, 0, 0, 0, 92, 72, 75, 6601, 155, 6257],
  [0, 0, 0, 0, 16, 24, 92, 9422, 8353, 887],
  [0, 0, 0, 0, 34, 74, 70, 2900, 9654, 499],
  [0, 0, 0, 0, 80, 44, 63, 6869, 3117, 9924],
  [0, 0, 0, 0, 50, 33, 69, 1862, 9966, 5748],
  [0, 0, 0, 0, 87, 87, 71, 3399, 5636, 3820],
  [0, 0, 0, 0, 6, 41, 32, 9318, 1453, 3044],
  [0, 0, 0, 0, 42, 18, 15, 8913, 7825, 335]
];

export const interestingEpochNs = [
  1_000_000_000_000_000_000n, // round number after epoch
  -1_000_000_000_000_000_000n, // round number before epoch
  1n, // just after epoch
  0n, // epoch
  -1n, // just before epoch
  2n ** 64n, // maxuint64 + 1
  2n ** 64n - 1n, // maxuint64
  -(2n ** 64n), // -maxuint64 - 1
  -(2n ** 64n - 1n), // -maxuint64
  2n ** 63n, // maxint64 + 1
  2n ** 63n - 1n, // maxint64
  -(2n ** 63n + 1n), // minint64 - 1
  -(2n ** 63n), // minint64
  2n ** 32n, // maxuint32 + 1
  2n ** 32n - 1n, // maxuint32
  -(2n ** 32n), // -maxuint32 - 1
  -(2n ** 32n - 1n), // -maxuint32
  2n ** 31n, // maxint32 + 1
  2n ** 31n - 1n, // maxint32
  -(2n ** 31n + 1n), // minint32 - 1
  -(2n ** 31n), // minint32
  2n ** 53n + 123_456_789n, // max safe integer plus some sentinel digits
  -(2n ** 53n + 987_654_321n), // min safe integer plus some sentinel digits
  2n ** 31n * 1_000_000_000n, // year 2038 problem
  (2n ** 31n + 1n) * 1_000_000_000n, // year 2038 problem + 1 s
  -(2n ** 31n * 1_000_000_000n), // negative year 2038 problem
  -((2n ** 31n + 1n) * 1_000_000_000n), // negative year 2038 problem - 1 s
  253402300799000000000n, // 9999-12-31T23:59:59Z, common max in other systems
  253402300800000000000n, // 010000-01-01T00Z, above + 1 s
  -62135596800000000000n, // 0001-01-01T00Z, common min in other systems
  -62198755200000000000n, // -000001-01-01T00Z, year 1 BCE
  86400n * 100_000_000n * 1_000_000_000n, // last supported epoch ns
  -(86400n * 100_000_000n * 1_000_000_000n), // earliest supported epoch ns
  -(86400n * 99_999_999n * 1_000_000_000n) // earliest supported epoch ns + 1 d
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
  [1, 11, 30], // on a half minute
  [2, 36, 46, 269, 249, 500], // on a half µs
  [3, 30], // on a half hour
  [5, 38, 49, 848, 112, 687],
  [6, 20, 46, 408, 452, 805],
  [9, 17, 14, 520, 674, 386],
  [11, 25, 43, 957, 69, 27],
  [12], // noon
  [12, 3, 50, 616, 122, 145],
  [12, 48, 16, 240, 708, 441],
  [16, 58, 56, 500], // on a half second
  [17, 1, 51, 609, 471, 506],
  [18, 57, 22, 495, 500], // on a half ms
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

export const interestingZonedDateTimes = [
  ['America/Vancouver', 2025, 3, 9, 3, 0, 0, 0, 0, 0, -7], // recent spring-forward, negative offset
  ['America/Vancouver', 2025, 3, 9, 3, 0, 0, 0, 0, 1, -7], // 1 ns after
  ['America/Vancouver', 2025, 3, 9, 1, 59, 59, 999, 999, 999, -8], // 1 ns before
  ['America/Vancouver', 2024, 11, 3, 1, 0, 0, 0, 0, 0, -8], // recent fall-back, negative offset
  ['America/Vancouver', 2024, 11, 3, 1, 0, 0, 0, 0, 1, -8], // 1 ns after
  ['America/Vancouver', 2024, 11, 3, 1, 59, 59, 999, 999, 999, -7], // 1 ns before
  ['Europe/Amsterdam', 2025, 3, 30, 3, 0, 0, 0, 0, 0, +2], // recent spring-forward, positive offset
  ['Europe/Amsterdam', 2025, 3, 30, 3, 0, 0, 0, 0, 1, +2], // 1 ns after
  ['Europe/Amsterdam', 2025, 3, 30, 1, 59, 59, 999, 999, 999, +1], // 1 ns before
  ['Europe/Amsterdam', 2024, 10, 27, 2, 0, 0, 0, 0, 0, +1], // recent fall-back, positive offset
  ['Europe/Amsterdam', 2024, 10, 27, 2, 0, 0, 0, 0, 1, +1], // 1 ns after
  ['Europe/Amsterdam', 2024, 10, 27, 2, 59, 59, 999, 999, 999, +2], // 1 ns before
  ['America/Sao_Paulo', 2018, 2, 17, 23, 0, 0, 0, 0, 0, -3], // recent fall-back, around midnight
  ['America/Sao_Paulo', 2018, 2, 17, 23, 0, 0, 0, 0, 1, -3], // 1 ns after
  ['America/Sao_Paulo', 2018, 2, 17, 23, 59, 59, 999, 999, 999, -2], // 1 ns before
  ['America/Sao_Paulo', 2018, 11, 4, 1, 0, 0, 0, 0, 0, -2], // recent spring-forward, around midnight
  ['America/Sao_Paulo', 2018, 11, 4, 1, 0, 0, 0, 0, 1, -2], // 1 ns after
  ['America/Sao_Paulo', 2018, 11, 3, 23, 59, 59, 999, 999, 999, -3], // 1 ns before
  ['Pacific/Kiritimati', 2023, 7, 16, 16, 23, 11, 704, 192, 385, +14], // current most positive UTC offset on Earth
  ['Pacific/Niue', 2023, 7, 15, 15, 16, 23, 11, 704, 192, -11], // same instant, current most negative UTC offset
  ['Asia/Kathmandu', 2023, 6, 17, 9, 47, 33, 648, 291, 574, +5, 45], // non-whole-hour UTC offset
  ['Africa/Algiers', 2024, 2, 29, 1, 36, 49, 862, 917, 305, +1], // recent leap day
  ['Antarctica/Troll', 1987, 12, 31, 23, 59, 59, 999, 999, 999, 0], // last instant of year
  ['Antarctica/Casey', 1988, 1, 1, 0, 0, 0, 0, 0, 0, +8], // first instant of year
  ['Pacific/Apia', 2011, 12, 31, 0, 0, 0, 0, 0, 0, +14], // international date line change
  ['Pacific/Apia', 2011, 12, 29, 23, 59, 59, 999, 999, 999, -10], // 1 ns before
  ['America/Toronto', 1919, 3, 31, 12, 0, 0, 0, 0, 0, -4] // day after exceptional midnight-spanning transition
];

export function isCalendarUnit(unit) {
  return unit === 'years' || unit === 'months' || unit === 'weeks';
}

export function makeDateCases() {
  const interestingDates = [];
  for (const year of interestingYears) {
    for (const [month, day] of interestingMonthDays) {
      const date = createDateSkippingInvalidCombinations(year, month, day);
      if (!date) continue;
      // Pre-compute toString so it's not done repeatedly in each test
      interestingDates.push([date, date.toString()]);
    }
  }
  return interestingDates;
}

export function makeDateTimeCases() {
  // Every interesting date with every interesting time would take hours and
  // hours to run. That would be interesting too, but too long for a CI job. So
  // we take every interesting date combined with one of the interesting times
  // and then append the (shorter) list of interesting datetimes.
  let timeIndex = 0;
  const interestingDateTimeCases = [];
  for (const year of interestingYears) {
    for (const [month, day] of interestingMonthDays) {
      const date = createDateSkippingInvalidCombinations(year, month, day);
      if (!date) continue;
      const args = interestingTimes[timeIndex];
      timeIndex++;
      timeIndex %= interestingTimes.length;
      const time = new temporalImpl.PlainTime(...args);
      if (date.toString() === '-271821-04-19' && time.toString() === '00:00:00') continue;
      const datetime = date.toPlainDateTime(time);
      // Pre-compute toString so it's not done repeatedly in each test
      interestingDateTimeCases.push([datetime, datetime.toString()]);
    }
  }
  for (const args of interestingDateTimes) {
    const datetime = new temporalImpl.PlainDateTime(...args);
    interestingDateTimeCases.push([datetime, datetime.toString()]);
  }
  return interestingDateTimeCases;
}

export function makeDurationCases() {
  return interestingDurations
    .concat(randomCalendarDurations)
    .concat(randomHumanScaleCalendarDurations)
    .concat(randomNonCalendarDurations)
    .concat(randomHumanScaleTimeOnlyDurations)
    .map((args) => {
      const duration = new temporalImpl.Duration(...args);
      let string = duration.toString();
      // Disambiguate toString output when milliseconds, microseconds, or
      // nanoseconds overflow
      if (duration.milliseconds || duration.microseconds || duration.nanoseconds) {
        string += `(${BigInt(duration.milliseconds)},${BigInt(duration.microseconds)},${BigInt(duration.nanoseconds)})`;
      }
      return [duration, string];
    });
}

export function makeInstantCases() {
  return interestingEpochNs.map((epochNs) => {
    const instant = new temporalImpl.Instant(epochNs);
    // Pre-compute toString so it's not done repeatedly in each test
    return [instant, instant.toString()];
  });
}

export function makeRelativeToCases() {
  const abbreviatedInterestingYears = [1969, 1972, -271821, 275760];
  const abbreviatedInterestingEpochNs = [
    1n, // just after epoch
    0n, // epoch
    -1n, // just before epoch
    86400n * 100_000_000n * 1_000_000_000n, // last supported epoch ns
    -(86400n * 100_000_000n * 1_000_000_000n), // earliest supported epoch ns
    -(86400n * 99_999_999n * 1_000_000_000n) // earliest supported epoch ns + 1 d
  ];
  const interestingRelativeTo = [];

  for (const year of abbreviatedInterestingYears) {
    for (const [month, day] of interestingMonthDays) {
      const date = createDateSkippingInvalidCombinations(year, month, day);
      if (!date) continue;
      // Pre-compute toString so it's not done repeatedly in each test
      interestingRelativeTo.push([date, date.toString()]);
    }
  }

  for (const epochNs of abbreviatedInterestingEpochNs) {
    const dt = new temporalImpl.ZonedDateTime(epochNs, 'UTC');
    // Pre-compute toString so it's not done repeatedly in each test
    interestingRelativeTo.push([dt, dt.toString()]);
  }

  for (const params of interestingZonedDateTimes) {
    const [timeZone, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, hoff, moff = 0] =
      params;
    const offset = (hoff < 0 ? '-' : '+') + `${Math.abs(hoff)}`.padStart(2, '0') + ':' + `${moff}`.padStart(2, '0');
    const dt = temporalImpl.ZonedDateTime.from({
      timeZone,
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offset
    });
    interestingRelativeTo.push([dt, dt.toString()]);
  }
  return interestingRelativeTo;
}

export function makeTimeCases() {
  return interestingTimes.map((args) => {
    const time = new temporalImpl.PlainTime(...args);
    // Pre-compute toString so it's not done repeatedly in each test
    return [time, time.toString()];
  });
}

export function makeYearMonthCases() {
  const interestingYearMonths = [];
  for (const year of interestingYears) {
    for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      const ym = createYearMonthSkippingInvalidCombinations(year, month);
      if (!ym) continue;

      // Pre-compute toString so it's not done repeatedly in each test
      interestingYearMonths.push([ym, ym.toString()]);
    }
  }
  return interestingYearMonths;
}

export const interestingNonNamedTimeZones = ['UTC', '+01:23', '-12:34'];
export const interestingNamedTimeZones = ['America/Vancouver', 'Europe/Amsterdam'];

export function makeZonedCases() {
  const interestingZonedCases = [];

  for (const epochNs of interestingEpochNs) {
    for (const timeZone of interestingNonNamedTimeZones.concat(interestingNamedTimeZones)) {
      const dt = new temporalImpl.ZonedDateTime(epochNs, timeZone);
      // Pre-compute toString so it's not done repeatedly in each test
      interestingZonedCases.push([dt, dt.toString()]);
    }
  }

  for (const params of interestingZonedDateTimes) {
    const [timeZone, year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, hoff, moff = 0] =
      params;
    const offset = (hoff < 0 ? '-' : '+') + `${Math.abs(hoff)}`.padStart(2, '0') + ':' + `${moff}`.padStart(2, '0');
    const dt = temporalImpl.ZonedDateTime.from({
      timeZone,
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      microsecond,
      nanosecond,
      offset
    });
    interestingZonedCases.push([dt, dt.toString()]);
  }

  return interestingZonedCases;
}

// If process.hrtime is not available, misuse Temporal.Now
const nowBigInt = globalThis.process?.hrtime.bigint ?? (() => temporalImpl.Now.instant().epochNanoseconds);

export const roundingModes = [
  'ceil',
  'floor',
  'expand',
  'trunc',
  'halfCeil',
  'halfFloor',
  'halfExpand',
  'halfTrunc',
  'halfEven'
];

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
  let printInterval = 10;
  while (total > 100 * printInterval) printInterval *= 10;
  return new (class FakeProgressBar {
    #done = 0;

    tick(delta = 1) {
      this.#done += delta;
      // Do print _something_ periodically to demonstrate continued progress.
      if (delta && this.#done % printInterval === 0) {
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

  function matchSnapshotOrOutOfRange(callable, key) {
    let actual;
    try {
      actual = callable();
    } catch (e) {
      if (e instanceof RangeError) {
        matchSnapshot('RangeError', key);
        return;
      }
      throw e;
    }
    matchSnapshot(`${actual}`, key);
    return actual;
  }

  testBody(matchSnapshot, matchSnapshotOrOutOfRange);

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
