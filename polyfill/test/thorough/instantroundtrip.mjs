import { assertTemporalEqual, getProgressBar, makeInstantCases, temporalImpl as T, time } from './support.mjs';

const interestingInstants = makeInstantCases();
const total = interestingInstants.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [instant, instantStr] of interestingInstants) {
    progress.tick(1, { test: instantStr });

    assertTemporalEqual(T.Instant.from(instantStr), instant, 'from ISO string');

    const stringTimeZone = instant.toString({ fractionalSecondDigits: 9, timeZone: 'UTC' });
    assertTemporalEqual(T.Instant.from(stringTimeZone), instant, 'from ISO string with full digits and time zone');

    const weirdString =
      stringTimeZone[0] + stringTimeZone.slice(1).replace('T', ' ').replace('.', ',').replaceAll(/-:/g, '');
    assertTemporalEqual(T.Instant.from(weirdString), instant, 'from ISO string with weird but allowed formatting');
  }

  return total;
});
