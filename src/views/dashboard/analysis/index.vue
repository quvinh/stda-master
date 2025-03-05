<template>
  <div class="p-1">
    <GrowCard :loading="loading" class="enter-y" />
    <SiteAnalysis class="!my-1 enter-y shadow-md" :loading="loading" />
    <div class="md:flex enter-y">
      <SOPLineChart class="md:w-1/3 w-full shadow-md" :loading="loading" />
      <OEEChart class="md:w-1/3 !md:mx-1 !md:my-0 !my-1 w-full shadow-md" :loading="loading" />
      <SOPBarChart class="md:w-1/3 w-full shadow-md" :loading="loading" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import OEEChart from './components/OEEChart.vue';
  import SOPLineChart from './components/SOPLineChart.vue';
  import SOPBarChart from './components/SOPBarChart.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
