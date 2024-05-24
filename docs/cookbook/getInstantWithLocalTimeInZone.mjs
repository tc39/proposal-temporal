/**
 * Get an exact time corresponding with a calendar date / wall-clock time in a
 * particular time zone, the same as
 * Temporal.PlainDateTime.toZonedDateTimeISO(), but with more disambiguation
 * options.
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
 * @param {string} timeZone - IANA identifier of time zone in which to consider the
 *   wall-clock time
 * @param {string} [disambiguation='earlier'] - Disambiguation mode, see description.
 * @returns {Temporal.Instant} Absolute time in timeZone at the time of the
 *   calendar date and wall-clock time from dateTime
 */
function getInstantWithLocalTimeInZone(dateTime, timeZone, disambiguation = 'earlier') {
  // Handle the built-in modes first
  if (['compatible', 'earlier', 'later', 'reject'].includes(disambiguation)) {
    return dateTime.toZonedDateTime(timeZone, { disambiguation }).toInstant();
  }

  const zdts = ['earlier', 'later'].map((disambiguation) => dateTime.toZonedDateTime(timeZone, { disambiguation }));
  const instants = zdts.map((zdt) => zdt.toInstant()).reduce((a, b) => (a.equals(b) ? [a] : [a, b]));

  // Return only possibility if no disambiguation needed
  if (instants.length === 1) return instants[0];

  switch (disambiguation) {
    case 'clipEarlier':
      if (zdts[0].toPlainDateTime().equals(dateTime)) {
        return instants[0];
      }
      return zdts[0].getTimeZoneTransition('next').subtract({ nanoseconds: 1 }).toInstant();
    case 'clipLater':
      if (zdts[1].toPlainDateTime().equals(dateTime)) {
        return instants[1];
      }
      return zdts[0].getTimeZoneTransition('next').toInstant();
  }
  throw new RangeError(`invalid disambiguation ${disambiguation}`);
}

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
    getInstantWithLocalTimeInZone(nonexistentGermanWallTime, 'Europe/Berlin', disambiguation).toString({
      timeZone: 'Europe/Berlin'
    }),
    result
  );
}

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
    getInstantWithLocalTimeInZone(doubleEasternBrazilianWallTime, 'America/Sao_Paulo', disambiguation).toString({
      timeZone: 'America/Sao_Paulo'
    }),
    result
  );
}
