// Form parameters
const params = new URL(document.location).searchParams;
const futuredateParam = params.get('futuredate');

// Workaround to generate the string if the browser does not have
// Intl.DurationFormat. The workaround works only in English.
function englishPlural(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}
function formatDays(duration) {
  if (typeof Intl.DurationFormat === 'undefined') {
    return englishPlural(duration.days, 'day', 'days');
  }
  return duration.toLocaleString();
}
function formatMonths(duration) {
  if (typeof Intl.DurationFormat === 'undefined') {
    return (
      `${englishPlural(duration.months, 'month', 'months')}` +
      (duration.days !== 0 ? `, ${englishPlural(duration.days, 'day', 'days')}` : '')
    );
  }
  return duration.toLocaleString();
}

// When form data posted:
if (futuredateParam !== null) {
  const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
  const futureDate = Temporal.PlainDate.from(futuredateParam).withCalendar(browserCalendar);
  const today = Temporal.Now.plainDateISO().withCalendar(browserCalendar);
  const until = today.until(futureDate, { largestUnit: 'day' });
  const untilMonths = until.round({ largestUnit: 'month', relativeTo: today });

  const dayString = formatDays(until);
  const results = document.getElementById('futuredate-results');
  results.innerHTML = `
    <p>From and including: <strong>${today.toLocaleString()}</strong></p>
    <p>To but not including: <strong>${futureDate.toLocaleString()}</strong></p>
    <h4>Result: ${dayString}</h4>
    <p>It is ${dayString} from the start date to the end date, but not
    including the end date.</p>
    <p>Or ${formatMonths(untilMonths)} excluding the end date.</p>
  `;
}
