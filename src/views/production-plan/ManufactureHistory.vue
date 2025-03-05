<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ManufactureHistorySidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 flex flex-col gap-1 h-full w-[600px] bg-white">
      <div class="h-2/5">
        <div class="flex flex-row w-full h-full gap-1">
          <Card
            title="Biểu đồ sản lượng"
            class="w-3/4 border-gray-300 border-1"
            :bodyStyle="{ padding: '0px!important', height: '85%' }"
            size="small"
          >
            <Chart1 :data="last7daysProductionData" :loading="loading" />
          </Card>
          <Card
            title="Takt time"
            class="w-3/4 border-gray-300 border-1"
            :bodyStyle="{ padding: '0px!important', height: '85%' }"
            size="small"
          >
            <Chart3 :data="last7daysCycleTime" :loading="loading" />
          </Card>
        </div>
      </div>
      <div class="h-2.95/5">
        <Card
          class="h-full border-gray-300 border-1"
          :bodyStyle="{
            padding: '5px!important',
            height: 'calc(100% - 60px) !important',
          }"
          size="small"
          title="Lịch sử sản xuất"
        >
          <template #extra>
            <Button size="small" type="primary" @click="handleExport">
              <Icon icon="ant-design:download-outlined" />
              Xuất dữ liệu
            </Button>
          </template>
          <div class="flex flex-col h-full">
            <div class="h-[65px]">
              <BasicTable @register="registerTableTop" />
            </div>
            <div class="h-full">
              <BasicTable @register="registerTableBottom" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Card } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import { getColumnsBottom, getColumnsTop } from './components/tableDataManufactureHistory';
  import Icon from '@/components/Icon/Icon.vue';
  import { IManufactureHistory } from '@/api/model/IManufactureHistory';
  import ManufactureHistorySidebar from './components/ManufactureHistorySidebar.vue';
  import Chart1 from '@/views/overview/production/components/Chart1.vue';
  import Chart3 from '@/views/overview/production/components/Chart3.vue';
  import axiosInstance from '@/api/resource/axiosInstance';
  import ApiResponse from '@/api/ApiResponse';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { getLast7DaysApi } from '@/api/sys/manufacture-history';

  const dataTop = ref<any[]>([]);
  const dataBottom = ref<IManufactureHistory[]>([]);
  const loading = ref<boolean>(false);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  interface ProductionResultProps {
    date: string;
    planned_quantity: number;
    actual_quantity: number;
  }

  const last7daysProductionData = ref<ProductionResultProps[]>([]);
  const last7daysCycleTime = ref<any[]>([]);

  const [registerTableTop] = useTable({
    rowKey: 'id',
    dataSource: dataTop,
    columns: getColumnsTop(),
    showIndexColumn: false,
    bordered: true,
    pagination: false,
    loading,
    isCanResizeParent: false,
    resizeHeightOffset: 40,
    maxHeight: 40,
  });

  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const total = ref<number>(0);
  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: total,
    pageSizeOptions,
    showTotal: (totalPage: number) => `Total ${totalPage} items`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  const [registerTableBottom, { setPagination }] = useTable({
    rowKey: 'id',
    dataSource: dataBottom,
    columns: getColumnsBottom(),
    showIndexColumn: true,
    bordered: true,
    loading,
    isCanResizeParent: true,
    // pagination: paginationProp.value,
  });

  onMounted(() => {
    // Uncomment the following line if you want to fetch data on mount
    // fetchData();
  });

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;

      // Fetch summary data
      const dataTopResponse: ApiResponse<any> = await axiosInstance.get(
        'v1/manufacture/production-result-summary',
        { params: param },
      );
      if (dataTopResponse.success) {
        const values = dataTopResponse.data ?? [];
        dataTop.value = [values];
      }

      // Fetch last 7 days production data
      const response: ApiResponse<any> = await axiosInstance.get(
        'v1/manufacture/last-7-days-production',
        { params: param },
      );
      if (response.success) {
        last7daysProductionData.value = response?.data ?? [];
        console.log('last7daysProductionData = ', last7daysProductionData.value);
      }

      const res: any = await getLast7DaysApi({});
      if (res) {
        last7daysCycleTime.value = res;
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleSidebarFilter(values: any = {}) {
    try {
      filter.value = values;
      loading.value = true;
      const filteredData: any = {};
      console.log('values:', values);
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value != null && (typeof value === 'string' ? value.trim() !== '' : true)) {
          filteredData[key] = value;
        }
      });
      console.log('filteredData:', filteredData);
      const response: ApiResponse<any> = await axiosInstance.get(
        'v1/manufacture/lot-production-summary',
        { params: filteredData }, // Ensure to pass filteredData as params
      );
      if (response?.success) {
        dataBottom.value = response?.data?.data ?? [];
        if (response.data.pagination) {
          total.value = response.data.pagination.total;
          paginationProp.value.current = page.value ?? 1;
          paginationProp.value.total = total.value ?? 0;
          paginationProp.value.showTotal = () => `Tổng ${total.value ?? 0} bản ghi`;
          setPagination(paginationProp.value);
        }
      }
      await fetchData(filteredData); // Pass filteredData to fetchData
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleExport(params: any) {
    try {
    } catch (error) {
      message.error(error.message || 'Đã xảy ra lỗi.');
    }
  }
</script>

<style scoped>
  .table-production {
    margin-top: 10px;
    margin-right: 4px;
    margin-left: 4px;
  }

  .ant-card .ant-card-body {
    padding: 0 !important;
  }
</style>
