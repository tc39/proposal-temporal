if (!globalThis.document) {
  // patch globalThis.document to make this run in Node.js
  globalThis.document = {
    location: "http://example.com/?futuredate=2024-01-01",
    getElementById: function() {
      return {};
    }
  };
}

// Form parameters
const params = new URL(document.location).searchParams;
const futuredateParam = params.get('futuredate');
const locale = new Intl.Locale('en-US-u-ca-hebrew');  // future: navigator.locales[0]
const calendar = locale.getLikelyCalendar();

// When form data posted:
if (futuredateParam !== null) {
  const futureDate = Temporal.Date.from(futuredateParam);  // from string => ISO calendar
  const today = Temporal.now.date().withCalendar(calendar);
  // Note: arithmetic with 'months' requires a calendar
  const until = today.difference(futureDate, { largestUnit: 'days' });
  const untilMonths = today.difference(futureDate, { largestUnit: 'months' });

  const dayString = until.days.toLocaleString(locale, { style: 'unit', unit: 'day' });
  const monthString = untilMonths.months.toLocaleString(locale, { style: 'unit', unit: 'month' });

  const results = document.getElementById('futuredate-results');
  results.innerHTML = `
    <p>From and including: <strong>${today.toLocaleString(locale)}</strong></p>
    <p>To but not including: <strong>${futureDate.toLocaleString(locale)}</strong></p>
    <h4>Result: ${dayString}</h4>
    <p>It is ${dayString} from the start date to the end date, but not
    including the end date.</p>
    <p>Or ${monthString} excluding the end date.</p>
  `;
  console.log(results.innerHTML);
}
