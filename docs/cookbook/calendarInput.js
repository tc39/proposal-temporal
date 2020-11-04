const datePicker = document.getElementById('calendar-input');
const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
const today = Temporal.now.plainDate(browserCalendar);
datePicker.max = today;
datePicker.value = today;
