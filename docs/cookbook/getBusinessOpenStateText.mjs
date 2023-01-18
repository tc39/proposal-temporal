/**
 * Compare the given exact time to the business hours of a business located in
 * a particular time zone, and return a string indicating whether the business
 * is open, closed, opening soon, or closing soon. The length of "soon" can be
 * controlled using the `soonWindow` parameter.
 *
 * @param {Temporal.ZonedDateTime} now - Date and Time at which to consider
 *  whether the business is open
 * @param {(Object|null)[]} businessHours - Array of length 7 indicating
 *  business hours during the week
 * @param {Temporal.PlainTime} businessHours[].open - Time at which the business
 *  opens
 * @param {Temporal.PlainTime} businessHours[].close - Time at which the business
 *  closes
 * @param {Temporal.Duration} soonWindow - Length of time before the opening
 *  or closing time during which the business should be considered "opening
 *  soon" or "closing soon"
 * @returns {string} "open", "closed", "opening soon", or "closing soon"
 */
function getBusinessOpenStateText(now, businessHours, soonWindow) {
  const compare = Temporal.ZonedDateTime.compare;
  function inRange(zdt, start, end) {
    return compare(zdt, start) >= 0 && compare(zdt, end) < 0;
  }

  // Because of times wrapping around at midnight, we may need to consider
  // yesterday's and tomorrow's hours as well
  for (const delta of [-1, 0]) {
    const openDate = now.toPlainDate().add({ days: delta });
    // convert weekday (1..7) to 0-based index, for array:
    const index = (openDate.dayOfWeek + 7) % 7;
    if (!businessHours[index]) continue;

    const timeZone = now.timeZoneId;
    const { open: openTime, close: closeTime } = businessHours[index];
    const open = openDate.toZonedDateTime({ plainTime: openTime, timeZone });
    const isWrap = Temporal.PlainTime.compare(closeTime, openTime) < 0;
    const closeDate = isWrap ? openDate.add({ days: 1 }) : openDate;
    const close = closeDate.toZonedDateTime({ plainTime: closeTime, timeZone });

    if (inRange(now, open, close)) {
      return compare(now, close.subtract(soonWindow)) >= 0 ? 'closing soon' : 'open';
    }
    if (inRange(now.add(soonWindow), open, close)) return 'opening soon';
  }
  return 'closed';
}

// For example, a restaurant or bar might have opening hours that go past
// midnight; make sure this is handled correctly
const businessHours = [
  /* Sun */ { open: Temporal.PlainTime.from('13:00'), close: Temporal.PlainTime.from('20:30') },
  /* Mon */ null, // closed Mondays
  /* Tue */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('20:30') },
  /* Wed */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('20:30') },
  /* Thu */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('22:00') },
  /* Fri */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('00:00') },
  /* Sat */ { open: Temporal.PlainTime.from('11:00'), close: Temporal.PlainTime.from('02:00') }
];

const now = Temporal.ZonedDateTime.from('2019-04-07T00:00+02:00[Europe/Berlin]');
const soonWindow = Temporal.Duration.from({ minutes: 30 });
const saturdayNightState = getBusinessOpenStateText(now, businessHours, soonWindow);
assert.equal(saturdayNightState, 'open');

const lastCall = now.add({ hours: 1, minutes: 50 });
assert.equal(lastCall.toString(), '2019-04-07T01:50:00+02:00[Europe/Berlin]');
const lastCallState = getBusinessOpenStateText(lastCall, businessHours, soonWindow);
assert.equal(lastCallState, 'closing soon');

const tuesdayEarly = now.add({ days: 2, hours: 6 });
const tuesdayEarlyState = getBusinessOpenStateText(tuesdayEarly, businessHours, soonWindow);
assert.equal(tuesdayEarlyState, 'closed');
