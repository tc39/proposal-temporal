/**
 * Compare the given exact time to the business hours of a business located in
 * a particular time zone, and return a string indicating whether the business
 * is open, closed, opening soon, or closing soon. The length of "soon" can be
 * controlled using the `soonWindow` parameter.
 *
 * FIXME: This example should stop using TimeZone.getInstantFor as soon as the
 * ZonedDateTime.with(), add(), and subtract() methods get implemented.
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
  function inRange(i, start, end) {
    return Temporal.Instant.compare(i, start) >= 0 && Temporal.Instant.compare(i, end) < 0;
  }

  const dateTime = now.toPlainDateTime();
  const weekday = dateTime.dayOfWeek % 7; // convert to 0-based, for array indexing

  // Because of times wrapping around at midnight, we may need to consider
  // yesterday's and tomorrow's hours as well
  const today = dateTime.toPlainDate();
  const yesterday = today.subtract({ days: 1 });
  const tomorrow = today.add({ days: 1 });

  // Push any of the businessHours that overlap today's date into an array,
  // that we will subsequently check. Convert the businessHours Times into
  // DateTimes so that they no longer wrap around.
  const businessHoursOverlappingToday = [];
  const yesterdayHours = businessHours[(weekday + 6) % 7];
  if (yesterdayHours) {
    const { open, close } = yesterdayHours;
    if (Temporal.PlainTime.compare(close, open) < 0) {
      businessHoursOverlappingToday.push({
        open: now.timeZone.getInstantFor(yesterday.toPlainDateTime(open)),
        close: now.timeZone.getInstantFor(today.toPlainDateTime(close))
      });
    }
  }
  const todayHours = businessHours[weekday];
  if (todayHours) {
    const { open, close } = todayHours;
    const todayOrTomorrow = Temporal.PlainTime.compare(close, open) >= 0 ? today : tomorrow;
    businessHoursOverlappingToday.push({
      open: now.timeZone.getInstantFor(today.toPlainDateTime(open)),
      close: now.timeZone.getInstantFor(todayOrTomorrow.toPlainDateTime(close))
    });
  }

  // Check if any of the candidate business hours include the given time
  const nowInstant = now.toInstant();
  const soon = nowInstant.add(soonWindow);
  let openNow = false;
  let openSoon = false;
  for (const { open, close } of businessHoursOverlappingToday) {
    openNow = openNow || inRange(nowInstant, open, close);
    openSoon = openSoon || inRange(soon, open, close);
  }

  if (openNow) {
    if (!openSoon) return 'closing soon';
    return 'open';
  }
  if (openSoon) return 'opening soon';
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
