<template>
  <div class="flex pt-1 h-full pb-1">
    <div class="hidden lg:block w-[270px] mr-1">
      <WarehouseSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-1/2 border-gray-300 border-1 mb-1 w-full"
        :bodyStyle="{ height: '80%', padding: '5px!important' }"
        size="small"
      >
        <template #extra>
          <Button type="primary" size="small" @click="exportData"
            ><Icon icon="ant-design:download-outlined" /> Xuất dữ liệu</Button
          >
        </template>
        <TableChart :data="chartData" />
      </Card>
      <Card
        class="h-1/7 border-gray-300 border-1 mb-1 mr-1 w-full"
        :bodyStyle="{ height: '100%', padding: '5px!important' }"
      >
        <Table
          rowKey="id"
          class="table-production"
          size="small"
          :columns="getHeaderColumns()"
          :dataSource="dataMiddle"
          :locale="{ emptyText: '&nbsp' }"
          :bordered="true"
          :pagination="false"
        />
      </Card>
      <Card
        class="h-1/2 border-gray-300 border-1 w-full"
        :bodyStyle="{ padding: '1px!important', height: '86%' }"
        size="small"
        title="Quản lý kho"
      >
        <template #extra>
          <Button type="primary" size="small" @click="exportData"
            ><Icon icon="ant-design:download-outlined" /> Xuất dữ liệu</Button
          >
        </template>
        <BasicTable @register="registerTable" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    exportExcelDataWarehouseApi,
    searchFinishedProductInventory,
    searchWarehouseInventory,
  } from '@/api/sys/warehouse';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, message, Card, Table } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onMounted, ref, h } from 'vue';
  import { getBasicColumns } from './components/tableDataWarehouse';
  import WarehouseSidebar from './components/WarehouseSidebar.vue';
  import TableChart from './components/TableChart.vue';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  const data = ref<any[]>([]);
  const chartData = ref([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const dataMiddle = ref<any[]>([]);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  function getHeaderColumns(): any[] {
    return [
      {
        title: 'Số lượng (pcs)',
        dataIndex: 'quantityPcs',
        key: 'quantityPcs',
        align: 'center',
        width: 100,
        customRender: ({ value }) => h('div', { class: 'text-base' }, formatNumber(value)),
      },
      {
        title: 'Số lượng (kg)',
        dataIndex: 'quantityKg',
        key: 'quantityKg',
        align: 'center',
        width: 100,
        customRender: ({ value }) => h('div', { class: 'text-base' }, formatNumber(value)),
      },
      {
        title: 'Số lượng Lot',
        dataIndex: 'quantityLot',
        key: 'quantityLot',
        align: 'center',
        width: 100,
        customRender: ({ value }) => h('div', { class: 'text-base' }, formatNumber(value)),
      },
      {
        title: 'Ngày tồn',
        dataIndex: 'expiryDate',
        key: 'expiryDate',
        align: 'center',
        width: 100,
        customRender: ({ value }) => h('div', { class: 'text-base' }, formatNumber(value)),
      },
    ];
  }

  const method = ref<'all' | 'import' | 'export'>('all');

  const [registerTable, { setColumns }] = useTable({
    // title: 'Quản lý kho',
    dataSource: data,
    columns: getBasicColumns(method.value),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    pagination: false,
    isCanResizeParent: true,
  });

  onMounted(() => {
    // fetchData();
  });

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      var res;
      if (param.type === 'material') {
        res = await searchWarehouseInventory({
          page: page.value,
          pageSize: pageSize.value,
          ...param,
        });
      } else {
        res = await searchFinishedProductInventory({
          page: page.value,
          pageSize: pageSize.value,
          ...param,
        });
      }
      if (res) {
        data.value = res || [];
        chartData.value = res;
        let quantityPcs = 0,
          quantityKg = 0,
          lotQuantity = res.length,
          dayOfStock = 0;

        res.forEach((i) => {
          quantityPcs += Number(i?.import_quantity);
          dayOfStock += i?.days_in_stock;
        });
        dataMiddle.value = [
          {
            quantityPcs: quantityPcs,
            quantityKg: quantityKg,
            quantityLot: lotQuantity,
            expiryDate: dayOfStock,
          },
        ];
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    console.log('val = ', values);
    setColumns(getBasicColumns(values?.method || 'all'));
    fetchData(values);
  }

  async function exportData() {
    try {
      const response: any = await exportExcelDataWarehouseApi();
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
