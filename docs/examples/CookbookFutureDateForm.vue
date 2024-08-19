<template>
  <form action="#how-many-days-until-a-future-date">
    <label>
      Enter future date:
      <input type="date" name="futuredate">
    </label>
    <button>Submit</button>
  </form>

  <div id="futuredate-results"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Do initialization that doesn't necessarily need to be included in
  // the example; see 'Calendar input element'
  const futureDatePicker = document.querySelector('input[name="futuredate"]');
  const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
  const today = Temporal.Now.plainDate(browserCalendar);
  futureDatePicker.min = today;
  futureDatePicker.value = today.add({ months: 1 });

  import('../cookbook/futureDateForm.js')
})
</script>
