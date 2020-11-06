const datePicker = document.getElementById('calendar-input');
const today = Temporal.now.plainDateISO();
datePicker.max = today;
datePicker.value = today;
