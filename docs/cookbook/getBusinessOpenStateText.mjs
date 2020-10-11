// LocalDateTime POC notes
// - This sample's original implementation had a DST bug #698 that would have
//   been easier to prevent using `LocalDateTime`.
// - The result will be easier to work with because it has its time zone already
//   baked in.

/**
 * Compare the given exact time to the business hours of a business located in
 * a particular time zone, and return a string indicating whether the business
 * is open, closed, opening soon, or closing soon. The length of "soon" can be
 * controlled using the `soonWindow` parameter.
 *
 * @param {Temporal.LocalDateTime} now - Date and Time at which to consider
 *  whether the business is open
 * @param {(Object|null)[]} businessHours - Array of length 7 indicating
 *  business hours during the week
 * @param {Temporal.Time} businessHours[].open - Time at which the business
 *  opens
 * @param {Temporal.Time} businessHours[].close - Time at which the business
 *  closes. If this time is smaller than the `open` time, it means that the
 *  business hours wrap around midnight, so this time represents the closing
 *  time on the next day.
 * @param {Temporal.Duration} soonWindow - Length of time before the opening or
 *  closing time during which the business should be considered "opening soon"
 *  or "closing soon"
 * @returns {string} "open", "closed", "opening soon", or "closing soon"
 */
function getBusinessOpenStateText(now, businessHours, soonWindow) {
  const inRange = (localDateTime, start, end) =>
    Temporal.LocalDateTime.compare(localDateTime, start) >= 0 && Temporal.LocalDateTime.compare(localDateTime, end) < 0;

  // Because of times wrapping around at midnight, we may need to consider
  // yesterday's and tomorrow's hours as well
  for (const delta of [-1, 0, 1]) {
    const index = (now.dayOfWeek + 7 + delta) % 7; // convert to 0-based, for array indexing
    if (!businessHours[index]) continue;
    const openDate = now.toDate().add({ days: delta });
    const { open: openTime, close: closeTime } = businessHours[index];
    const open = now.with({ ...openDate.getFields(), ...openTime.getFields() });
    const isWrap = Temporal.Time.compare(closeTime, openTime) < 0;
    const closeDate = isWrap ? openDate.add({ days: 1 }) : openDate;
    const close = now.with({ ...closeDate.getFields(), ...closeTime.getFields() });
    if (inRange(now, open, close)) {
      return Temporal.LocalDateTime.compare(now, close.subtract(soonWindow)) >= 0 ? 'closing soon' : 'open';
    }
    if (inRange(now.add(soonWindow), open, close)) return 'opening soon';
  }
  return 'closed';
}

// For example, a restaurant or bar might have opening hours that go past
// midnight; make sure this is handled correctly
const businessHours = [
  /* Sun */ { open: Temporal.Time.from('13:00'), close: Temporal.Time.from('20:30') },
  /* Mon */ null, // closed Mondays
  /* Tue */ { open: Temporal.Time.from('11:00'), close: Temporal.Time.from('20:30') },
  /* Wed */ { open: Temporal.Time.from('11:00'), close: Temporal.Time.from('20:30') },
  /* Thu */ { open: Temporal.Time.from('11:00'), close: Temporal.Time.from('22:00') },
  /* Fri */ { open: Temporal.Time.from('11:00'), close: Temporal.Time.from('00:00') },
  /* Sat */ { open: Temporal.Time.from('11:00'), close: Temporal.Time.from('02:00') }
];

// This ISO string is intentionally conflicting, because the real TZ offset for
// that date is +02:00. The default behavior of from() on ISO strings is to
// throw if the offset isn't valid for the time zone, e.g. if the time zone
// definition has changed since the time was stored. (The user can force use of
// the ISO offset in this case via the 'use' option.)
const now = Temporal.LocalDateTime.from('2019-04-07T00:00+01:00[Europe/Berlin]', { offset: 'use' });
assert.equal(now.toString(), '2019-04-07T01:00+02:00[Europe/Berlin]');
const soonWindow = Temporal.Duration.from({ minutes: 30 });
const saturdayNightState = getBusinessOpenStateText(now, businessHours, soonWindow);
assert.equal(saturdayNightState, 'open');

const lastCall = now.add({ minutes: 50 });
assert.equal(lastCall.toString(), '2019-04-07T01:50+02:00[Europe/Berlin]');
const lastCallState = getBusinessOpenStateText(lastCall, businessHours, soonWindow);
assert.equal(lastCallState, 'closing soon');

const tuesdayEarly = now.add({ days: 2, hours: 6 });
const tuesdayEarlyState = getBusinessOpenStateText(tuesdayEarly, businessHours, soonWindow);
assert.equal(tuesdayEarlyState, 'closed');
