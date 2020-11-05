/**
 * Get an exact time corresponding with a calendar date / wall-clock time in a
 * particular time zone, the same as Temporal.TimeZone.getInstantFor() or
 * Temporal.PlainDateTime.toInstant(), but with more disambiguation options.
 *
 * As well as the default Temporal disambiguation options 'compatible',
 * 'earlier', 'later', and 'reject', there are additional options possible:
 *
 * - 'clipEarlier': Equivalent to 'earlier' when turning the clock back, and
 *   when setting the clock forward returns the time just before the clock
 *   changes.
 * - 'clipLater': Equivalent to 'later' when turning the clock back, and when
 *   setting the clock forward returns the exact time of the clock change.
 *
 * @param {Temporal.PlainDateTime} dateTime - Calendar date and wall-clock time to
 *   convert
 * @param {Temporal.TimeZone} timeZone - Time zone in which to consider the
 *   wall-clock time
 * @param {string} [disambiguation='earlier'] - Disambiguation mode, see description.
 * @returns {Temporal.Instant} Absolute time in timeZone at the time of the
 *   calendar date and wall-clock time from dateTime
 */
function getInstantWithLocalTimeInZone(dateTime, timeZone, disambiguation = 'earlier') {
  // Handle the built-in modes first
  if (['compatible', 'earlier', 'later', 'reject'].includes(disambiguation)) {
    return timeZone.getInstantFor(dateTime, { disambiguation });
  }

  const possible = timeZone.getPossibleInstantsFor(dateTime);

  // Return only possibility if no disambiguation needed
  if (possible.length === 1) return possible[0];

  switch (disambiguation) {
    case 'clipEarlier':
      if (possible.length === 0) {
        const before = timeZone.getInstantFor(dateTime, { disambiguation: 'earlier' });
        return timeZone.getNextTransition(before).subtract({ nanoseconds: 1 });
      }
      return possible[0];
    case 'clipLater':
      if (possible.length === 0) {
        const before = timeZone.getInstantFor(dateTime, { disambiguation: 'earlier' });
        return timeZone.getNextTransition(before);
      }
      return possible[possible.length - 1];
  }
  throw new RangeError(`invalid disambiguation ${disambiguation}`);
}

const germany = Temporal.TimeZone.from('Europe/Berlin');
const nonexistentGermanWallTime = Temporal.PlainDateTime.from('2019-03-31T02:45');

const germanResults = {
  earlier: /*     */ '2019-03-31T01:45:00+01:00',
  later: /*       */ '2019-03-31T03:45:00+02:00',
  compatible: /*  */ '2019-03-31T03:45:00+02:00',
  clipEarlier: /* */ '2019-03-31T01:59:59.999999999+01:00',
  clipLater: /*   */ '2019-03-31T03:00:00+02:00'
};
for (const [disambiguation, result] of Object.entries(germanResults)) {
  assert.equal(
    getInstantWithLocalTimeInZone(nonexistentGermanWallTime, germany, disambiguation).toString({ timeZone: germany }),
    result
  );
}

const brazilEast = Temporal.TimeZone.from('America/Sao_Paulo');
const doubleEasternBrazilianWallTime = Temporal.PlainDateTime.from('2019-02-16T23:45');

const brazilianResults = {
  earlier: /*     */ '2019-02-16T23:45:00-02:00',
  later: /*       */ '2019-02-16T23:45:00-03:00',
  compatible: /*  */ '2019-02-16T23:45:00-02:00',
  clipEarlier: /* */ '2019-02-16T23:45:00-02:00',
  clipLater: /*   */ '2019-02-16T23:45:00-03:00'
};
for (const [disambiguation, result] of Object.entries(brazilianResults)) {
  assert.equal(
    getInstantWithLocalTimeInZone(doubleEasternBrazilianWallTime, brazilEast, disambiguation).toString({
      timeZone: brazilEast
    }),
    result
  );
}
