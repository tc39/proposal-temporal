// Display local time zone and three others
const here = Temporal.now.timeZone();
const now = Temporal.now.instant();
const timeZones = [
  { name: 'Here', tz: here },
  { name: 'New York', tz: Temporal.TimeZone.from('America/New_York') },
  { name: 'London', tz: Temporal.TimeZone.from('Europe/London') },
  { name: 'Tokyo', tz: Temporal.TimeZone.from('Asia/Tokyo') }
];

// Start the table at midnight local time
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const calendarNow = now.toPlainDateTime(here, browserCalendar);
const startTime = calendarNow
  .with(Temporal.PlainTime.from('00:00')) // midnight
  .toInstant(here);

// Build the table
const table = document.getElementById('meeting-planner');
timeZones.forEach(({ name, tz }) => {
  const row = document.createElement('tr');

  const title = document.createElement('td');
  title.textContent = `${name} (UTC${tz.getOffsetStringFor(now)})`;
  row.appendChild(title);

  for (let hours = 0; hours < 24; hours++) {
    const cell = document.createElement('td');

    const dt = startTime.add({ hours }).toPlainDateTime(tz);
    cell.className = `time-${dt.hour}`;

    // Highlight the current hour in each row
    if (hours === calendarNow.hour) cell.className += ' time-current';

    // Show the date in midnight cells
    let formatOptions;
    if (dt.hour === 0) {
      formatOptions = { month: 'short', day: 'numeric' };
    } else {
      formatOptions = { hour: 'numeric' };
    }
    cell.textContent = dt.toLocaleString(undefined, formatOptions);
    row.appendChild(cell);
  }

  table.appendChild(row);
});
