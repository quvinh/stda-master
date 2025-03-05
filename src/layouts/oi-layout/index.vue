<template>
  <Layout class="oi-layout">
    <OIHeader />
    <main class="flex-1 pt-13 pb-13 overflow-y-auto oi-content">
      <RouterView />
    </main>
    <OIFooter />
  </Layout>
</template>

<script lang="ts" setup>
  import { Layout } from 'ant-design-vue';
  import OIHeader from './components/OIHeader.vue';
  import OIFooter from './components/OIFooter.vue';
  import { onMounted } from 'vue';
  // import { requestCameraPermissions } from '@/utils/helper/oiTable';

  defineOptions({ name: 'OILayout' });

  onMounted(() => {
    // Request camera permissions
    // requestCameraPermissions();
  });
</script>
