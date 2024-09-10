// tankDataX and tankDataY are X and Y-axis data for the last 24 hours,
// obtained from elsewhere, e.g. const [tankDataX, tankDataY] = fetchData();
// tankDataX is an array of Temporal.Instant, and tankDataY is an array of numbers.

// Show data starting from the most recent midnight in the tank's location (Stockholm)
const tankTimeZone = 'Europe/Stockholm';
const labelFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  timeZone: Temporal.Now.timeZoneId()
});
const browserCalendar = labelFormatter.resolvedOptions().calendar;
const tankMidnight = Temporal.Now.zonedDateTimeISO()
  .withCalendar(browserCalendar)
  .withTimeZone(tankTimeZone)
  .startOfDay()
  .toInstant();
const atOrAfterMidnight = (x) => Temporal.Instant.compare(x, tankMidnight) >= 0;
const dataStartIndex = tankDataX.findIndex(atOrAfterMidnight);
const graphLabels = tankDataX.slice(dataStartIndex).map((x) => labelFormatter.format(x));
const graphPoints = tankDataY.slice(dataStartIndex);

const ctx = document.getElementById('storage-tank').getContext('2d');
// The graph is made with Chart.js (https://www.chartjs.org/)
new Chart(ctx, {
  type: 'line',
  data: {
    labels: graphLabels,
    datasets: [
      {
        label: 'Fill level',
        data: graphPoints
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Stockholm storage tank'
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
