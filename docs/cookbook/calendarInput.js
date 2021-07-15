const datePicker = document.getElementById('calendar-input');
const today = Temporal.Now.plainDateISO();
datePicker.max = today;
datePicker.value = today;
