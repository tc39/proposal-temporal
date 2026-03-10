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

const knownLongTransitions = new Set([
  '1996-01-01T03:00:00+00:00[America/Danmarkshavn]', // 3 h
  '1969-01-01T08:00:00+08:00[Antarctica/Casey]', // 8 h
  '2009-10-18T05:00:00+11:00[Antarctica/Casey]', // 3 h
  '2011-10-28T05:00:00+11:00[Antarctica/Casey]', // 3 h
  '1957-01-13T07:00:00+07:00[Antarctica/Davis]', // 7 h
  '1969-02-01T07:00:00+07:00[Antarctica/Davis]', // 7 h
  '1899-11-01T10:00:00+10:00[Antarctica/Macquarie]', // 10 h
  '1948-03-25T10:00:00+10:00[Antarctica/Macquarie]', // 10 h
  '1954-02-13T06:00:00+06:00[Antarctica/Mawson]', // 6 h
  '1957-12-16T07:00:00+07:00[Antarctica/Vostok]', // 7 h
  '1994-11-01T07:00:00+07:00[Antarctica/Vostok]', // 7 h
  '1942-05-01T02:30:00+09:00[Asia/Rangoon]', // 2.5 h
  '1981-04-01T03:00:00+12:00[Asia/Ust-Nera]', // 3 h
  '1942-05-01T02:30:00+09:00[Indian/Cocos]', // 2.5 h
  '1995-01-01T00:00:00+13:00[Pacific/Enderbury]', // 24 h
  '2011-12-31T00:00:00+13:00[Pacific/Fakaofo]', // 24 h
  '1995-01-01T00:00:00+14:00[Pacific/Kiritimati]', // 24 h
  '1993-08-22T00:00:00+12:00[Pacific/Kwajalein]', // 24 h
  '1945-09-08T02:30:00+11:30[Pacific/Nauru]' // 2.5 h
]);

function testTimeZoneTransitionInvariants(transition) {
  const timeZone = transition.timeZoneId;
  const rightBefore = transition.subtract(tinyDuration);
  const rightAfter = transition.add(tinyDuration);
  const offsetChange = rightAfter.offsetNanoseconds - rightBefore.offsetNanoseconds;

  if (offsetChange > 7200e9 && !knownLongTransitions.has(transition.toString())) {
    throw new Error(`offset change at ${transition} is ${offsetChange / 3600e9} h`);
  }

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
