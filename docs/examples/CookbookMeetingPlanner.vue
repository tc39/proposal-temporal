<template>
  <table id="meeting-planner"></table>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  import('../cookbook/meetingPlanner.js')
})
</script>

<style>
#meeting-planner {
  border-collapse: separate;
  border-spacing: 0 10px;
  font-size: 0.6rem;
  text-align: center;
}

/* https://materializecss.com/color.html */
.time-0, .time-1, .time-2, .time-3, .time-4, .time-5,
.time-22, .time-23 {
  background-color: #ef9a9a;  /* red lighten-3 */
  border-color: #e57373;  /* red lighten-2 */
  border-style: solid;
  border-width: 0 1px;
}
.time-6, .time-7, .time-18, .time-19, .time-20, .time-21 {
  background-color: #fff59d;  /* yellow lighten-3 */
  border-color: #ffd54f;  /* amber lighten-2 */
  border-style: solid;
  border-width: 0 1px;
}
.time-8, .time-9, .time-10, .time-11, .time-12, .time-13,
.time-14, .time-15, .time-16, .time-17 {
  background-color: #a5d6a7;  /* green lighten-3 */
  border-color: #81c784;  /* green lighten-2 */
  border-style: solid;
  border-width: 0 1px;
}

.time-0 {
  border-bottom-left-radius: 12px;
  border-left-color: white;
  border-left-width: 2px;
  border-top-left-radius: 12px;
  font-weight: bold;
}
.time-23 {
  border-bottom-right-radius: 12px;
  border-right-color: white;
  border-right-width: 2px;
  border-top-right-radius: 12px;
}

.time-current {
  border: 2px solid black;
}
</style>
