// Display local time zone and three others
const here = Temporal.now.timeZone();
const now = Temporal.now.absolute();
const timeZones = [
  { name: 'Here', tz: here },
  { name: 'New York', tz: Temporal.TimeZone.from('America/New_York') },
  { name: 'London', tz: Temporal.TimeZone.from('Europe/London') },
  { name: 'Tokyo', tz: Temporal.TimeZone.from('Asia/Tokyo') }
];

// Start the table at midnight local time
const calendarNow = now.inTimeZone(here);
const startTime = calendarNow
  .getDate()
  .withTime(Temporal.Time.from('00:00')) // midnight
  .inTimeZone(here);

// Build the table
const table = document.getElementById('meeting-planner');
timeZones.forEach(({ name, tz }) => {
  const row = document.createElement('tr');

  const title = document.createElement('td');
  title.textContent = `${name} (UTC${tz.getOffsetFor(now)})`;
  row.appendChild(title);

  for (let hours = 0; hours < 24; hours++) {
    const cell = document.createElement('td');

    const dt = startTime.plus({ hours }).inTimeZone(tz);
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
