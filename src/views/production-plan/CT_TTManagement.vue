<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <CT_TTManagementSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <div class="h-2/6 flex flex-row gap-1 p-1">
        <CT_TTManagementChart />
      </div>
      <div class="h-4/6 border-t-orange">
        <BasicTable @register="registerTable">
          <template #toolbar>
            <Button type="primary" size="small"
              ><Icon icon="ant-design:download-outlined" />Xuất file</Button
            >
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
  import { getBasicColumns } from './components/tableCT_TTManagement';
  import dayjs from 'dayjs';
  import CT_TTManagementSidebar from './components/CT_TTManagementSidebar.vue';
  import CT_TTManagementChart from './components/CT_TTManagementChart.vue';

  const CT_TTManagement = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const [registerTable] = useTable({
    title: 'Quản lý CT, TT',
    dataSource: CT_TTManagement,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    pagination: false,
    canResize: true,
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
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    console.log('Data from sidebar', values);
    loading.value = true;
    setTimeout(() => {
      loading.value = false; // Fake action
    }, 500);
  }
</script>
