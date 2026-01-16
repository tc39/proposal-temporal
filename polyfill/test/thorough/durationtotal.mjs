import {
  assertEqual,
  assertOffByLessThanOne,
  durationUnits,
  getProgressBar,
  isCalendarUnit,
  makeDurationCases,
  makeRelativeToCases,
  time,
  withSnapshotsFromFile
} from './support.mjs';

const positiveCases = makeDurationCases();
const negativeCases = positiveCases.map(([duration, str]) => [duration.negated(), '-' + str]);
const interestingCases = positiveCases.concat(negativeCases);
const interestingRelativeTo = makeRelativeToCases();
const total = interestingCases.length * durationUnits.length;

// Source - https://stackoverflow.com/a/72267395
// Posted by Martin Braun, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-08, License - CC BY-SA 4.0
function roundHalfEven(x) {
  const n = x >= 0 ? 1 : -1;
  const r = n * Math.round(n * x);
  return Math.abs(x) % 1 === 0.5 && r % 2 !== 0 ? r - n : r;
}

// If the absolute value of the result of total() is ≥ this number, we cannot
// test the invariant that round() and total() must agree; round() will throw
// due to not being able to construct the upper bound for rounding, or when
// converting the internal duration back to JS numbers with ℝ(𝔽(nanoseconds)).
// Or in the case of sub-second units, total() may suffer from floating-point
// precision loss.
const maxTotals = {
  hours: Math.trunc(Number.MAX_SAFE_INTEGER / 3600) + 0.5,
  minutes: Math.trunc(Number.MAX_SAFE_INTEGER / 60) + 0.5,
  seconds: Number.MAX_SAFE_INTEGER,
  milliseconds: Number.MAX_SAFE_INTEGER,
  microseconds: Number.MAX_SAFE_INTEGER,
  nanoseconds: Number.MAX_SAFE_INTEGER
};

// round() may correctly round a result that is not exactly between two
// increments, while total() may give a result that is 0.5 due to precision
// loss, and can't be correctly rounded after the fact. This happens with
// milliseconds and microseconds.
function doubleRoundingMayBeWrong(absResult, unit) {
  return (
    (unit === 'milliseconds' || unit === 'microseconds') &&
    absResult >= Number.MAX_SAFE_INTEGER / 100 &&
    absResult % 1 === 0.5
  );
}

await time(async (start) => {
  const progress = getProgressBar(start, total);

  await withSnapshotsFromFile('./durationtotal.snapshot.json', (matchSnapshot, matchSnapshotOrOutOfRange) => {
    for (const [duration, str] of interestingCases) {
      const isCalendarDuration = duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0;

      for (const unit of durationUnits) {
        const testName = `${str} ${unit}`;
        progress.tick(1, { test: testName.slice(0, 45) });

        for (const [relativeTo, relativeStr] of interestingRelativeTo) {
          const result = matchSnapshotOrOutOfRange(
            () => duration.total({ unit, relativeTo }),
            `${testName} ${relativeStr}`
          );

          if (!result) continue;

          const absResult = Math.abs(result);

          // See note above maxTotals
          if (maxTotals[unit] && absResult >= maxTotals[unit]) {
            continue;
          }

          // We must use halfEven rounding here, because 𝔽(total) uses that
          // rounding mode, which is significant for cases where the nearest
          // integer is safe, but the fraction is not. We then have to re-round
          // total with half-even rounding to match the result from round(). In
          // rare cases it still may not be equal; see note below.
          const rounded = duration.round({
            largestUnit: unit,
            smallestUnit: unit,
            roundingMode: 'halfEven',
            relativeTo
          })[unit];

          if (doubleRoundingMayBeWrong(absResult, unit)) {
            assertOffByLessThanOne(result, rounded, 'relativeTo total() should agree with round()');
          } else {
            assertEqual(roundHalfEven(result), rounded, 'relativeTo total() should agree with round()');
          }
        }

        // Skip if testing without relativeTo would be invalid
        if (isCalendarUnit(unit) || isCalendarDuration) continue;
        const result = duration.total(unit);
        matchSnapshot(result.toString(), testName);

        // See above notes
        const absResult = Math.abs(result);
        if (maxTotals[unit] && absResult >= maxTotals[unit]) {
          continue;
        }

        const rounded = duration.round({ largestUnit: unit, smallestUnit: unit, roundingMode: 'halfEven' })[unit];
        if (doubleRoundingMayBeWrong(absResult, unit)) {
          assertOffByLessThanOne(result, rounded, 'total() should agree with round()');
        } else {
          assertEqual(roundHalfEven(result), rounded, 'total() should agree with round()');
        }
      }
    }
  });

  return total;
});
