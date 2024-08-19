<template>
  <input type="date" id="calendar-input">
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  import('../cookbook/calendarInput.js')
})
</script>
