<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <QCSidebar :filter="sidebarFilter" @success="handleSidebarFilter" @quicker="handleQuicker" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <template v-if="quicker === 'ddqc'">
        <DDQC :sidebar-filter="sidebarFilter" />
      </template>
      <template v-else-if="quicker === 'iqc'">
        <IQC :sidebar-filter="sidebarFilter" />
      </template>
      <template v-else-if="quicker === 'pqc'">
        <PQC :sidebar-filter="sidebarFilter" />
      </template>
      <template v-else-if="quicker === 'oqc'">
        <OQC :sidebar-filter="sidebarFilter" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import QCSidebar from './components/QCSidebar.vue';
  import DDQC from '../ddqc/DDQC.vue';
  import IQC from '../iqc/IQC.vue';
  import PQC from '../pqc/PQC.vue';
  import OQC from '../oqc/OQC.vue';

  const quicker = ref<'ddqc' | 'iqc' | 'pqc' | 'oqc'>('ddqc');
  const sidebarFilter = ref<object>({});

  function handleSidebarFilter(values: object) {
    const unproxyValues = JSON.parse(JSON.stringify(values));
    console.log('handleSidebarFilter', unproxyValues);
    if (values) {
      sidebarFilter.value = values;
    }
  }

  function handleQuicker(values: { quicker: 'ddqc' | 'iqc' | 'pqc' | 'oqc' }) {
    if (values?.quicker) {
      quicker.value = values.quicker;
    }
  }
</script>
