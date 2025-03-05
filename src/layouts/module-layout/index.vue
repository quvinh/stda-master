<template>
  <Layout class="oi-layout">
    <Header />
    <main class="flex-1 pt-13 pb-13 overflow-y-auto oi-content">
      <RouterView />
    </main>
  </Layout>
</template>

<script lang="ts" setup>
  import { Layout } from 'ant-design-vue';
  import Header from './components/Header.vue';

  defineOptions({ name: 'OILayout' });
</script>
