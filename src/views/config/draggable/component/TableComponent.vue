<template>
  <Table
    size="small"
    :loading="loading"
    :columns="props.columns"
    :dataSource="props.data"
    :bordered="true"
    :pagination="false"
    :locale="{ emptyText: '&nbsp' }"
    :scroll="{ x: 500 }"
  />
</template>

<script setup lang="ts">
  import { Table } from 'ant-design-vue';

  const props = defineProps({
    loading: Boolean,
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });
</script>
