const datePicker = document.getElementById('calendar-input');
const today = Temporal.now.date();
datePicker.max = today;
datePicker.value = today;
