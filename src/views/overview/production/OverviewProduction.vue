<template>
  <div
    class="bg-white flex flex-col gap-1"
    style="width: 100%; height: calc(100vh - 60px) !important"
  >
    <div class="h-2/5 flex flex-row w-full gap-1">
      <div class="w-1/3 border-gray-300 border-1 shadow-md">
        <Chart1 />
      </div>
      <div class="w-1/3 border-gray-300 border-1 shadow-md">
        <Chart2 />
      </div>
      <div class="w-1/3 border-gray-300 border-1 shadow-md">
        <Chart3 />
      </div>
    </div>
    <div class="h-3/5 border-gray-300 border-1 shadow-md w-full">
      <BasicTable @register="registerTable" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import Chart1 from './components/Chart1.vue';
  import Chart2 from './components/Chart2.vue';
  import Chart3 from './components/Chart3.vue';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { getBasicColumns, mockData, shuffleArray } from './components/tableData';

  const oiHeaderStore = useOIHeaderStore();

  const data = ref<any[]>([]);
  const [registerTable, { setTableData }] = useTable({
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    pagination: false,
    canResize: true,
  });

  onMounted(() => {
    oiHeaderStore.setTitle('TÌNH HÌNH SẢN XUẤT');
    data.value = mockData();

    const intervalId = setInterval(() => {
      setTableData(shuffleArray(mockData()));
    }, 3000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  });
</script>
