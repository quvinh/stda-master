<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ElectricityConsumptionSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <div class="h-4/4 flex flex-row gap-1 p-1">
        <ElectricityConsumptionChart />
      </div>
      <div class="h-4/4 border-t-orange">
        <BasicTable @register="registerTable">
          <template #toolbar>
            <Button type="primary" size="small"
              ><Icon icon="ant-design:download-outlined" /> Xuất dữ liệu</Button
            >
          </template>
          <template #footer>
            <div>Tổng điện năng tiêu thụ: 1,630,929.50 kWh</div>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import {
    getBasicColumns,
    mockData,
  } from './components/ElectricityConsumption/tableElectricityConsumption';
  import dayjs from 'dayjs';
  import ElectricityConsumptionSidebar from './components/ElectricityConsumption/ElectricityConsumptionSidebar.vue';
  import ElectricityConsumptionChart from './components/ElectricityConsumption/ElectricityConsumptionChart.vue';

  const data = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const [registerTable] = useTable({
    title: 'Điện năng tiêu thụ',
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    pagination: false,
    handleSearchInfoFn,
  });

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      data.value = mockData();
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    console.log('Data from sidebar', values);
  }
</script>
