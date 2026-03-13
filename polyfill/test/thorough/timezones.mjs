import {
  assertDurationsEqual,
  assertEqual,
  assertTemporalEqual,
  getProgressBar,
  temporalImpl as T,
  time
} from './support.mjs';

const timeZones = Intl.supportedValuesOf('timeZone');
const total = timeZones.length;
const tinyDuration = new T.Duration(0, 0, 0, 0, 0, 0, 0, 0, 0, 1);

function assertReject(func, msg) {
  try {
    func();
  } catch (e) {
    if (!(e instanceof RangeError)) throw e;
    return;
  }
  throw new Error(msg);
}

function pdtToZdt(pdt, timeZone, disambiguation) {
  return pdt.toZonedDateTime(timeZone, { disambiguation });
}

function zdtFrom(pdt, timeZone, disambiguation) {
  return T.ZonedDateTime.from(
    {
      year: pdt.year,
      monthCode: pdt.monthCode,
      day: pdt.day,
      hour: pdt.hour,
      minute: pdt.minute,
      second: pdt.second,
      millisecond: pdt.millisecond,
      microsecond: pdt.microsecond,
      nanosecond: pdt.nanosecond,
      timeZone
    },
    { disambiguation }
  );
}

function zdtWith(pdt, timeZone, disambiguation) {
  // Find a suitable time from which we can jump back to the ambiguous time
  // using the "with" method
  let differentHour = 1;
  let otherTime;
  do {
    try {
      otherTime = pdt.subtract({ hours: differentHour }).toZonedDateTime(timeZone, { disambiguation: 'reject' });
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
      differentHour *= 2;
      continue;
    }
  } while (!otherTime);
  return otherTime.with(
    { year: pdt.year, monthCode: pdt.monthCode, day: pdt.day, hour: pdt.hour },
    { disambiguation, offset: 'ignore' }
  );
}

const disambiguationOps = [
  [pdtToZdt, 'PlainDateTime.toZonedDateTime'],
  [zdtFrom, 'ZonedDateTime.from'],
  [zdtWith, 'ZonedDateTime.with']
];

const offsetChanges = new Map();

function testTimeZoneTransitionInvariants(transition) {
  const timeZone = transition.timeZoneId;
  const rightBefore = transition.subtract(tinyDuration);
  const rightAfter = transition.add(tinyDuration);
  const offsetChange = rightAfter.offsetNanoseconds - rightBefore.offsetNanoseconds;
  offsetChanges.set(offsetChange, (offsetChanges.get(offsetChange) ?? 0) + 1);

  assertEqual(
    transition.offsetNanoseconds,
    rightAfter.offsetNanoseconds,
    `offset at transition ${transition} is the new offset`
  );
  const wallClockBefore = rightBefore.toPlainDateTime();
  const wallClockAfter = rightAfter.toPlainDateTime();
  const expectedWallClockDifference = T.Duration.from({ nanoseconds: offsetChange + 2 }).round({
    largestUnit: 'days'
  });
  assertDurationsEqual(
    wallClockBefore.until(wallClockAfter),
    expectedWallClockDifference,
    `${transition} wall clock difference`
  );

  const earlier = transition.subtract({ nanoseconds: Math.abs(offsetChange) / 2 });
  const later = transition.add({ nanoseconds: Math.abs(offsetChange) / 2 });

  const midTransition = wallClockBefore.add({ nanoseconds: 1 + offsetChange / 2 });
  for (const [op, descr] of disambiguationOps) {
    const earlierResult = op(midTransition, timeZone, 'earlier');
    assertTemporalEqual(earlierResult, earlier, descr + ' earlier');
    const laterResult = op(midTransition, timeZone, 'later');
    assertTemporalEqual(laterResult, later, descr + ' later');
    const compatibleResult = op(midTransition, timeZone, 'compatible');
    if (offsetChange > 0) {
      // Spring forward, DST gap
      assertTemporalEqual(compatibleResult, later, descr + ' compatible');
    } else {
      // Fall back, DST repeated time
      assertTemporalEqual(compatibleResult, earlier, descr + ' compatible');

      // Additionally test that `with({offset})` works for switching between
      // the two repeated times
      assertTemporalEqual(earlier.with({ offset: later.offset }), later, 'earlier + later offset = later');
      assertTemporalEqual(later.with({ offset: earlier.offset }), earlier, 'later + earlier offset = earlier');
    }
    assertReject(() => op(midTransition, timeZone, 'reject'), 'disambiguation reject should have rejected in ' + descr);
  }
}

// This covers many different sizes of UTC offset shift, from 24 hours down to
// 4 seconds

await time(async (start) => {
  const progress = getProgressBar(start, total);

  const earliest = T.Instant.from('1850-01-01T00Z');
  const contemporary = T.Instant.from('2000-01-01T00Z');

  for (const timeZone of timeZones) {
    progress.tick(1, { test: timeZone });

    // Test the first 5 transitions after 1850, they are likely to be weird
    let zdt = earliest.toZonedDateTimeISO(timeZone).getTimeZoneTransition('next');
    if (zdt === null) continue;

    for (let count = 0; count < 5; count++) {
      testTimeZoneTransitionInvariants(zdt);
      zdt = zdt.getTimeZoneTransition('next');
      if (zdt === null) break;
    }

    // Test the two transitions before 2000, which will cover one spring and
    // one fall in DST-using zones
    zdt = contemporary.toZonedDateTimeISO(timeZone).getTimeZoneTransition('previous');
    if (zdt === null) continue;
    for (let count = 0; count < 2; count++) {
      testTimeZoneTransitionInvariants(zdt);
      zdt = zdt.getTimeZoneTransition('previous');
      if (zdt === null) break;
    }
  }

  return total;
});
