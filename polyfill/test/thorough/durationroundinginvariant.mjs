import {
  assertDurationsEqual,
  durationUnits,
  getProgressBar,
  isCalendarUnit,
  largerOfTwoDurationUnits,
  largestUnitPresent,
  makeDurationCasesAbbreviated,
  makeRelativeToCases,
  sensibleRoundingModes,
  temporalImpl as T,
  time
} from './support.mjs';

const roundingGranularities = {
  years: [1, 2, 10, 1e5, 547581],
  months: [1, 2, 10, 1e6, 6570976],
  weeks: [1, 2, 10, 1e7, 28571428],
  days: [1, 2, 10, 1e7, 1e8 - 1, 1e9],
  hours: [1, 2, 3, 4, 6, 8, 12],
  minutes: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  seconds: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30],
  milliseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  microseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500],
  nanoseconds: [1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500]
};

function smallestUnitPresent(duration) {
  for (const unit of durationUnits.toReversed()) {
    if (duration[unit] !== 0) return unit;
  }
  return 'none';
}

const earliestRelativeTo = new T.ZonedDateTime(-86400n * 100_000_000n * 1_000_000_000n, 'UTC');
const positiveCases = makeDurationCasesAbbreviated().filter(([duration]) => {
  // Filter out time-only durations, and durations that are too big to add to
  // any relativeTo. Time-only durations aren't affected by relativeTo.
  try {
    duration.total({ unit: 'days', relativeTo: earliestRelativeTo });
  } catch (e) {
    if (e instanceof RangeError) return false;
    throw e;
  }
  const largest = largestUnitPresent(duration);
  return isCalendarUnit(largest) || largest === 'days';
});
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
const relativeToCases = makeRelativeToCases().map(([relativeTo]) => relativeTo);
const interestingRelativeTo = Object.groupBy(relativeToCases, (r) => (r instanceof T.PlainDate ? 'plain' : 'zoned'));
const boringPlainRelativeTo = new T.PlainDateTime(1970, 1, 1);
const boringZonedRelativeTo = new T.ZonedDateTime(0n, 'UTC');
const total = (interestingCases.length * durationUnits.length * (durationUnits.length + 1)) / 2;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [duration, str] of interestingCases) {
    const largest = largestUnitPresent(duration);
    const smallest = smallestUnitPresent(duration);
    const isCalendarDuration = isCalendarUnit(largest);

    for (let [smallestUnit, increments] of Object.entries(roundingGranularities)) {
      const willRound = largerOfTwoDurationUnits(smallest, smallestUnit) !== smallest;

      for (const largestUnit of durationUnits) {
        // Skip invalid combinations of largest/smallestUnit (already
        // accounted for in triangular-number calculation of total)
        if (largerOfTwoDurationUnits(largestUnit, smallestUnit) !== largestUnit) continue;

        progress.tick(1, { test: `${str} ${smallestUnit}-${largestUnit}`.slice(0, 45) });

        // Don't bother testing increments when there won't be rounding. Also,
        // increments are not allowed when largestUnit ≠ smallestUnit and both
        // are calendar units
        let shouldTestIncrements = willRound;
        if (largestUnit !== smallestUnit && (isCalendarUnit(smallestUnit) || smallestUnit === 'days')) {
          shouldTestIncrements = false;
        }

        // Prune cases where different relativeTo's wouldn't change result
        const willBalanceDown = largerOfTwoDurationUnits(largest, largestUnit) !== largestUnit;
        const shouldTestManyRelativeTo = willBalanceDown || willRound;

        for (const roundingIncrement of shouldTestIncrements ? increments : [1]) {
          testZoned(duration, str, largestUnit, smallestUnit, roundingIncrement, shouldTestManyRelativeTo);

          // PlainDate relativeTo: only test calendar durations, because
          // durations of days or lesser untis aren't affected by a plain
          // relativeTo
          if (!isCalendarDuration) continue;

          testPlain(duration, str, largestUnit, smallestUnit, roundingIncrement, shouldTestManyRelativeTo);
        }
      }
    }
  }

  return total;
});

function testZoned(duration, str, largestUnit, smallestUnit, roundingIncrement, shouldTestManyRelativeTo) {
  const roundingMode = 'trunc';
  const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode };
  let result;
  try {
    result = duration.round({ ...options, relativeTo: boringZonedRelativeTo });
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
  }

  if (result) {
    assertDurationsEqual(
      boringZonedRelativeTo.until(boringZonedRelativeTo.add(duration), options),
      result,
      'd.round(relativeTo) should agree with relativeTo.until(relativeTo.add(d))'
    );
  }

  if (!shouldTestManyRelativeTo) return;

  for (const relativeTo of interestingRelativeTo.zoned) {
    const roundingModes = sensibleRoundingModes(duration, str, smallestUnit, roundingIncrement, relativeTo);
    for (const roundingMode of roundingModes) {
      const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode };
      let result;
      try {
        result = duration.round({ ...options, relativeTo });
      } catch (e) {
        if (!(e instanceof RangeError)) throw e;
      }

      if (!result) continue;

      assertDurationsEqual(
        relativeTo.until(relativeTo.add(duration), options),
        result,
        'd.round(relativeTo) should agree with relativeTo.until(relativeTo.add(d))'
      );
    }
  }
}

function testPlain(duration, str, largestUnit, smallestUnit, roundingIncrement, shouldTestManyRelativeTo) {
  const roundingMode = 'trunc';
  const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode };
  let result;
  try {
    result = duration.round({ ...options, relativeTo: boringPlainRelativeTo });
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
  }

  if (result) {
    assertDurationsEqual(
      boringPlainRelativeTo.until(boringPlainRelativeTo.add(duration), options),
      result,
      'd.round(relativeTo) should agree with relativeTo.until(relativeTo.add(d))'
    );
  }

  if (!shouldTestManyRelativeTo) return;

  for (const relativeTo of interestingRelativeTo.plain) {
    const roundingModes = sensibleRoundingModes(duration, str, smallestUnit, roundingIncrement, relativeTo);

    for (const roundingMode of roundingModes) {
      const options = { largestUnit, smallestUnit, roundingIncrement, roundingMode };
      let result;
      try {
        result = duration.round({ ...options, relativeTo });
      } catch (e) {
        if (!(e instanceof RangeError)) throw e;
      }

      if (!result) continue;

      const r = relativeTo.toPlainDateTime();
      assertDurationsEqual(
        r.until(r.add(duration), options),
        result,
        'd.round(relativeTo) should agree with relativeTo.until(relativeTo.add(d))'
      );
    }
  }
}
