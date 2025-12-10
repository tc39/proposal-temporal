import { assertTemporalEqual, getProgressBar, makeTimeCases, temporalImpl as T, time } from './support.mjs';

const opts = { overflow: 'reject' };
const interestingTimes = makeTimeCases();
const total = interestingTimes.length;

await time(async (start) => {
  const progress = getProgressBar(start, total);

  for (const [time, timeStr] of interestingTimes) {
    progress.tick(1, { test: timeStr });

    const { hour, minute, second, millisecond, microsecond, nanosecond } = time;

    const propertyBag = { hour, minute, second, millisecond, microsecond, nanosecond };
    assertTemporalEqual(T.PlainTime.from(propertyBag, opts), time, 'from property bag');

    assertTemporalEqual(T.PlainTime.from(timeStr), time, 'from ISO string');

    const stringCalendar = time.toString({ calendarName: 'always' });
    assertTemporalEqual(T.PlainTime.from(stringCalendar), time, 'from ISO string with calendar');

    const hPart = String(hour).padStart(2, '0');
    const minPart = String(minute).padStart(2, '0');
    const sPart = String(second).padStart(2, '0');
    const msPart = String(millisecond).padStart(3, '0');
    const µsPart = String(microsecond).padStart(3, '0');
    const nsPart = String(nanosecond).padStart(3, '0');
    const weirdString = `t${hPart}${minPart}${sPart},${msPart}${µsPart}${nsPart}+1234`;
    assertTemporalEqual(T.PlainTime.from(weirdString), time, 'from ISO string with weird but allowed formatting');
  }

  return total;
});
