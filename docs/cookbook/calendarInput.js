const datePicker = document.getElementById('calendar-input');
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const today = Temporal.now.date(browserCalendar);
datePicker.max = today;
datePicker.value = today;
