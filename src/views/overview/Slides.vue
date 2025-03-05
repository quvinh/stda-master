<template>
  <template v-if="currentView === 1">
    <Dashboard />
  </template>
  <template v-else-if="currentView === 2">
    <KPI />
  </template>
  <template v-else-if="currentView === 3">
    <OverviewSummary />
  </template>
  <template v-else-if="currentView === 4">
    <OverviewProduction />
  </template>
  <template v-else>
    <Simulator />
  </template>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import Dashboard from '@/views/dashboard/analysis/index.vue';
  import KPI from '@/views/kpi/KPI2.vue';
  import OverviewSummary from '@/views/overview/summary/OverviewSummary.vue';
  import OverviewProduction from '@/views/overview/production/OverviewProduction.vue';
  import Simulator from '@/views/overview/sketchfab/3DModel.vue';

  const currentView = ref(1);

  function cycleViews() {
    currentView.value = currentView.value === 5 ? 1 : currentView.value + 1;
  }

  let intervalId: number;

  onMounted(() => {
    intervalId = window.setInterval(() => {
      cycleViews();
    }, 30000);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });
</script>
