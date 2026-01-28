import { assertDurationsEqual, getProgressBar, makeDurationCases, temporalImpl as T, time } from './support.mjs';

const interestingCases = makeDurationCases().concat(makeDurationCases().map(([d, str]) => [d.negated(), `-${str}`]));
const total = interestingCases.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [duration, durationStr] of interestingCases) {
    progress.tick(1, { test: durationStr });

    const { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;

    const propertyBag = {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    };
    assertDurationsEqual(T.Duration.from(propertyBag), duration, 'from property bag');

    // Durations where the subsecond units overflow don't roundtrip from a string
    if (Math.abs(milliseconds) > 999 || Math.abs(microseconds) > 999 || Math.abs(nanoseconds) > 999) continue;

    const isoString = duration.toString();
    assertDurationsEqual(T.Duration.from(isoString), duration, 'from ISO string');

    const sign = duration.sign < 0 ? '-' : '+';
    const f = Math.abs;
    const fracPart = String(f(milliseconds) * 1000000 + f(microseconds) * 1000 + f(nanoseconds)).padStart(9, '0');
    const weirdString = `${sign}p${f(years)}y${f(months)}m${f(weeks)}w${f(days)}dt${f(hours)}h${f(minutes)}m${f(
      seconds
    )},${fracPart}s`;
    assertDurationsEqual(T.Duration.from(weirdString), duration, 'from ISO string with weird but allowed formatting');
  }

  return total;
});
