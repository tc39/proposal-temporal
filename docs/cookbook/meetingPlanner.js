// Display local time zone and three others
const now = Temporal.now.localDateTime();
const timeZones = [
  { name: 'Here', tz: Temporal.now.timeZone() },
  { name: 'New York', tz: Temporal.TimeZone.from('America/New_York') },
  { name: 'London', tz: Temporal.TimeZone.from('Europe/London') },
  { name: 'Tokyo', tz: Temporal.TimeZone.from('Asia/Tokyo') }
];

// Start the table at midnight local time
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const startTime = now.with(Temporal.Time.from('00:00')).withCalendar(browserCalendar);

// Build the table
const table = document.getElementById('meeting-planner');
timeZones.forEach(({ name, tz }) => {
  const row = document.createElement('tr');

  const title = document.createElement('td');
  const nowThisTz = now.with({ timeZone: tz });
  title.textContent = `${name} (UTC${nowThisTz.timeZoneOffsetString})`;
  row.appendChild(title);
  const startThisTz = startTime.with({ timeZone: tz });

  for (let hours = 0; hours < 24; hours++) {
    const cell = document.createElement('td');

    const zdt = startThisTz.add({ hours });
    cell.className = `time-${zdt.hour}`;

    // Highlight the current hour in each row
    if (hours === now.hour) cell.className += ' time-current';

    // Show the date in midnight cells
    let formatOptions;
    if (zdt.hour === 0) {
      formatOptions = { month: 'short', day: 'numeric' };
    } else {
      formatOptions = { hour: 'numeric' };
    }
    cell.textContent = zdt.toLocaleString(undefined, formatOptions);
    row.appendChild(cell);
  }

  table.appendChild(row);
});
