<template>
  <canvas id="storage-tank" width="600" height="400"></canvas>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(async () => {
  await import('https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js')
  // Generate fictitious "data"
  const start = Temporal.Now.instant().subtract({ hours: 24 });
  const blank = Array(24 * 12);
  const tankDataX = Array.from(blank, (_, ix) => start.add({ minutes: ix * 5 }));
  const tankDataY = Array.from(blank);
  tankDataY[0] = 25;
  for (let ix = 1; ix < tankDataY.length; ix++) {
    tankDataY[ix] = Math.max(0, tankDataY[ix - 1] + 3 * (Math.random() - 0.5));
  }

  window.tankDataX = tankDataX
  window.tankDataY = tankDataY
  import('../cookbook/storageTank.js')
})
</script>
