/**
 * This sample implements a custom time zone that only allows PlainDateTime
 * values that are during the times that the New York Stock Exchange is open,
 * which is usually Monday through Friday 9:30 a.m. to 4:00 p.m. in
 * America/New_York. A more complete implementation would include market
 * holidays.
 *
 * `Temporal.Instants` when the market is closed will be disambiguated to the
 * start of the next day that the market is open. This makes it easy to
 * determine, for any instant, what market day that instant corresponds to, by
 * simply converting the instant to a ZonedDateTime in the 'NYSE' time zone.
 *
 * All `Temporal.Instant` values after market close on a particular market
 * display should be considered to be executed as of the market open on the next
 * market day.
 * */

const tz = Temporal.TimeZone.from('America/New_York');
const openTime = Temporal.PlainTime.from('09:30');
const closeTime = Temporal.PlainTime.from('16:00');
function isMarketOpenDate(date) {
  return date.dayOfWeek < 6; // not a weekend
}
function isDuringMarketHours(dt) {
  return isMarketOpenDate(dt) && !isBeforeMarketOpen(dt) && !isAfterMarketClose(dt);
}
function isBeforeMarketOpen(dt) {
  return isMarketOpenDate(dt) && Temporal.PlainTime.compare(dt, openTime) < 0;
}
function isAfterMarketClose(dt) {
  return isMarketOpenDate(dt) && Temporal.PlainTime.compare(dt, closeTime) >= 0;
}
function getNextMarketOpen(instant) {
  let zdt = instant.toZonedDateTimeISO(tz);

  // keep adding days until we get to a market day, unless today is a market day
  // before the market opens.
  if (!isBeforeMarketOpen(zdt)) {
    do {
      zdt = zdt.add({ days: 1 });
    } while (!isMarketOpenDate(zdt));
  }
  return zdt.toPlainDate().toZonedDateTime({ timeZone: tz, plainTime: openTime });
}
function getNextMarketClose(instant) {
  let zdt = instant.toZonedDateTimeISO(tz);

  // keep adding days until we get to a market day, unless today is a market day
  // before the market closes.
  if (isAfterMarketClose(zdt)) {
    do {
      zdt = zdt.add({ days: 1 });
    } while (!isMarketOpenDate(zdt));
  }
  return zdt.toPlainDate().toZonedDateTime({ timeZone: tz, plainTime: closeTime });
}
function getPreviousMarketOpen(instant) {
  let zdt = instant.toZonedDateTimeISO(tz);

  // keep subtracting days until we get to a market day, unless today is a market day
  // after the market opened.
  if (!isBeforeMarketOpen(zdt)) {
    do {
      zdt = zdt.subtract({ days: 1 });
    } while (!isMarketOpenDate(zdt));
  }
  return zdt.toPlainDate().toZonedDateTime({ timeZone: tz, plainTime: openTime });
}
function getPreviousMarketClose(instant) {
  let zdt = instant.toZonedDateTimeISO(tz);

  // keep adding days until we get to a market day, unless today is a market day
  // after the market closed.
  if (!isAfterMarketClose(zdt)) {
    do {
      zdt = zdt.subtract({ days: 1 });
    } while (!isMarketOpenDate(zdt));
  }
  return zdt.toPlainDate().toZonedDateTime({ timeZone: tz, plainTime: closeTime });
}

class NYSETimeZone extends Temporal.TimeZone {
  constructor() {
    super('America/New_York');
  }
  getPossibleInstantsFor(dt) {
    dt = Temporal.PlainDateTime.from(dt);
    const zdt = dt.toZonedDateTime(tz);
    const zdtWhenMarketIsOpen = isDuringMarketHours(zdt) ? zdt : getNextMarketOpen(zdt.toInstant());
    return [zdtWhenMarketIsOpen.toInstant()];
  }
  getInstantFor(dt) {
    dt = Temporal.PlainDateTime.from(dt);
    // `disambiguation` option is ignored. If the market is closed, then return the
    // opening time of the next market day.
    const zdt = dt.toZonedDateTime(tz);
    const zdtWhenMarketIsOpen = isDuringMarketHours(zdt) ? zdt : getNextMarketOpen(zdt.toInstant());
    return zdtWhenMarketIsOpen.toInstant();
  }
  getPlainDateTimeFor(instant) {
    instant = Temporal.Instant.from(instant);
    const zdt = instant.toZonedDateTimeISO(tz);
    const zdtWhenMarketIsOpen = isDuringMarketHours(zdt) ? zdt : getNextMarketOpen(zdt.toInstant());
    return zdtWhenMarketIsOpen.toPlainDateTime();
  }
  getNextTransition(instant) {
    instant = Temporal.Instant.from(instant);
    const nextOpen = getNextMarketOpen(instant);
    const nextClose = getNextMarketClose(instant);
    const zdtTransition = [nextOpen, nextClose].sort(Temporal.ZonedDateTime.compare)[0];
    return zdtTransition.toInstant();
  }
  getPreviousTransition(instant) {
    instant = Temporal.Instant.from(instant);
    const prevOpen = getPreviousMarketOpen(instant);
    const prevClose = getPreviousMarketClose(instant);
    const zdtTransition = [prevOpen, prevClose].sort(Temporal.ZonedDateTime.compare)[1];
    return zdtTransition.toInstant();
  }
  getOffsetNanosecondsFor(instant) {
    instant = Temporal.Instant.from(instant);
    const zdt = instant.toZonedDateTimeISO(tz);
    const zdtWhenMarketIsOpen = isDuringMarketHours(zdt) ? zdt : getNextMarketOpen(zdt.toInstant());
    const ns = zdt.offsetNanoseconds + zdt.until(zdtWhenMarketIsOpen, { largestUnit: 'nanosecond' }).nanoseconds;
    return ns;
  }
  toString() {
    return 'NYSE';
  }
}

const tzNYSE = Object.freeze(new NYSETimeZone());

let zdt;
let isOpen;
let date;
let inNYSE;
let nextOpen;
let todayClose;
let newDate;
let openInstant;
let closeInstant;

// 1. What is the market day associated with the Instant of a financial transaction?
zdt = Temporal.ZonedDateTime.from('2020-11-12T18:50-08:00[America/Los_Angeles]');
date = tzNYSE.getPlainDateTimeFor(zdt.toInstant()).toPlainDate();
assert.equal(date.toString(), '2020-11-13');
zdt = Temporal.ZonedDateTime.from('2020-11-12T06:50-08:00[America/Los_Angeles]');
date = tzNYSE.getPlainDateTimeFor(zdt.toInstant()).toPlainDate();
assert.equal(date.toString(), '2020-11-12');
zdt = Temporal.ZonedDateTime.from('2020-11-12T01:50-08:00[America/Los_Angeles]');
date = tzNYSE.getPlainDateTimeFor(zdt.toInstant()).toPlainDate();
assert.equal(date.toString(), '2020-11-12');

// 2. Is the stock market open on a particular date?
date = Temporal.PlainDate.from('2020-11-12');
isOpen = date.toZonedDateTime(tzNYSE).toPlainDate().equals(date);
assert.equal(isOpen, true);
date = Temporal.PlainDate.from('2020-11-14');
isOpen = date.toZonedDateTime(tzNYSE).toPlainDate().equals(date);
assert.equal(isOpen, false);

// 3. For a particular date, when is the next market day?
const getNextMarketDay = (date) => {
  date = Temporal.PlainDate.from(date);
  const zdt = date.toZonedDateTime(tzNYSE);
  if (zdt.toPlainDate().equals(date)) {
    // It's a market day, so find the next one
    return zdt.add({ days: 1 }).toPlainDate();
  } else {
    // the original date wasn't a market day, so we're already on the next one!
    return zdt.toPlainDate();
  }
};
date = Temporal.PlainDate.from('2020-11-09');
newDate = getNextMarketDay(date);
assert.equal(newDate.equals('2020-11-10'), true);
date = Temporal.PlainDate.from('2020-11-14');
newDate = getNextMarketDay(date);
assert.equal(newDate.equals('2020-11-16'), true);

// 4. For a particular date and time somewhere in the world, is the market open?
// If it's open, then when will it close?
// If it's closed, then when will it open next?
// Return a result in the local time zone, not NYC's time zone.
zdt = Temporal.ZonedDateTime.from('2020-11-12T18:50-08:00[America/Los_Angeles]');
inNYSE = zdt.withTimeZone(tzNYSE);
isOpen = inNYSE.toPlainDateTime().toZonedDateTime(tzNYSE).equals(inNYSE);
assert.equal(isOpen, false);
nextOpen = inNYSE.timeZone.getNextTransition(zdt.toInstant()).toZonedDateTimeISO(zdt.timeZone);
assert.equal(nextOpen.toString(), '2020-11-13T06:30:00-08:00[America/Los_Angeles]');

zdt = Temporal.ZonedDateTime.from('2020-11-12T12:50-08:00[America/Los_Angeles]');
inNYSE = zdt.withTimeZone(tzNYSE);
isOpen = inNYSE.toPlainDateTime().toZonedDateTime(tzNYSE).equals(inNYSE);
assert.equal(isOpen, true);
todayClose = inNYSE.timeZone.getNextTransition(zdt.toInstant()).toZonedDateTimeISO(zdt.timeZone);
assert.equal(todayClose.toString(), '2020-11-12T13:00:00-08:00[America/Los_Angeles]');

// 5. For any particular market date, what were the opening and closing clock times in NYC?
date = Temporal.PlainDate.from('2020-11-09');
openInstant = date.toZonedDateTime(tzNYSE).toInstant();
closeInstant = date.toZonedDateTime(tzNYSE).timeZone.getNextTransition(openInstant);
assert.equal(openInstant.toZonedDateTimeISO('America/New_York').toPlainTime().toString(), '09:30:00');
assert.equal(closeInstant.toZonedDateTimeISO('America/New_York').toPlainTime().toString(), '16:00:00');
