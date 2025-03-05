<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <WarehouseSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Tabs type="card" v-model:active-key="tabKey" @change="handleTabChange">
        <template #rightExtra>
          <Space class="mr-1">
            <Button type="primary" size="small" @click="exportData1"
              ><Icon icon="ant-design:download-outlined" /> Báo cáo nhập kho</Button
            >
            <Button type="primary" size="small" @click="exportData2"
              ><Icon icon="ant-design:download-outlined" /> Báo cáo tồn kho</Button
            >
          </Space>
        </template>
        <TabPane tab="Lịch sử nhập/xuất kho NVL" key="history">
          <BasicTable @register="registerTable" />
        </TabPane>
        <TabPane tab="Tồn kho nguyên vật liệu" key="inventory">
          <BasicTable @register="registerInventoryTable" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    exportExcelMaterial1Data,
    exportExcelMaterial2Data,
    searchWarehouseHistoryApi,
    searchWarehouseInventory,
  } from '@/api/sys/warehouse';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, message, Tabs, TabPane, Space } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import { getBasicColumns, getInventoryColumns } from './components/tableDataMaterial';
  import WarehouseSidebar from '../components/WarehouseSidebar.vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';

  const data = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const tabKey = ref<'history' | 'inventory'>('history');
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);
  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage) => `Total ${totalPage} items`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  const [registerTable, { setPagination }] = useTable({
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
  });

  const [registerInventoryTable] = useTable({
    dataSource: data,
    columns: getInventoryColumns(),
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

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      param.model = 'pallet';
      switch (tabKey.value) {
        case 'history':
          const response: any = await searchWarehouseHistoryApi(param);
          if (response?.data) {
            // Set data
            data.value = response.data ?? [];

            // Set pagination
            const pagination: IPagination = response?.pagination ?? null;
            let totalRecord = data.value.length;
            if (pagination) totalRecord = pagination.total;
            paginationProp.value.current = page.value ?? 1;
            paginationProp.value.total = totalRecord ?? 0;
            paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
            setPagination(paginationProp.value);
          }
          break;
        case 'inventory':
          const resInventory: any = await searchWarehouseInventory(param);
          if (resInventory) {
            // Set data
            data.value = resInventory ?? [];
          }
          break;
        default:
          message.error('Tabkey invalid');
          break;
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleTabChange() {
    page.value = 1;
    data.value = [];
    fetchData({ page: page.value, pageSize: pageSize.value });
  }

  function handleSidebarFilter(values) {
    filter.value = values;
    const payload: any = {};
    if (values?.dates) {
      payload.start_date = dayjs(values.dates[0]).format('YYYY-MM-DD');
      payload.end_date = dayjs(values.dates[1]).format('YYYY-MM-DD');
    }
    if (values?.tree) {
      const warehouse_ids: string[] = [];
      const warehouse_location_ids: string[] = [];
      [...values.tree]?.map(([key, value]) => {
        warehouse_ids.push(String(key));
        warehouse_location_ids.push(...Object.values(value).map((item) => String(item)));
      });
      payload.warehouse_ids = [...new Set(warehouse_ids)];
      payload.warehouse_location_ids = [...new Set(warehouse_location_ids)];
    }
    fetchData({ page: page.value, pageSize: pageSize.value, ...payload });
  }

  /**
   * @description báo cáo nhập kho
   */
  async function exportData1() {
    try {
      const response = await exportExcelMaterial1Data();
      const { data, type, file } = response;

      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }

      if (data && type && file) {
        downloadExcel(data, type, file);
      } else throw new Error('Thao tác thất bại');
    } catch (e) {
      message.error(e.message);
    }
  }

  /**
   * @description xuất file tồn kho
   */
  async function exportData2() {
    try {
      const response = await exportExcelMaterial2Data({ model: 'pallet' });
      const { data, type, file } = response;

      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }

      if (data && type && file) {
        downloadExcel(data, type, file);
      } else throw new Error('Thao tác thất bại');
    } catch (e) {
      message.error(e.message);
    }
  }
</script>
