<template>
  <Layout>
    <!-- Content -->
    <RouterView />
  </Layout>
</template>

<script lang="ts" setup>
  import { Layout } from 'ant-design-vue';

  defineOptions({ name: 'OILayoutMenu' });
</script>
