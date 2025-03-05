<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentPerformanceSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <div class="h-2/5 flex flex-row gap-1">
        <Card
          size="small"
          title="OEE"
          class="w-3/4 border-gray-300 border-1"
          :bodyStyle="{ padding: '0px!important', height: '80%' }"
          :headStyle="{ minHeight: '45px' }"
        >
          <OEEChart :data="oeeData" v-if="isQuery" />
        </Card>
        <Card
          size="small"
          title="Tần suất lỗi dừng máy"
          class="w-1/4 border-gray-300 border-1"
          :bodyStyle="{ padding: '10px!important', height: '80%' }"
          :headStyle="{ minHeight: '45px' }"
        >
          <ErrorChart :data="chartData" />
        </Card>
      </div>
      <div class="h-3/5 pt-1">
        <Card
          class="h-full border-gray-300 border-1"
          :bodyStyle="{ padding: '5px!important', height: '85%' }"
          size="small"
          title="Thông số lỗi"
        >
          <template #extra>
            <Button type="primary" size="small" @click="downloadExcel">
              <Icon icon="ant-design:download-outlined" />
              Xuất dữ liệu
            </Button>
          </template>
          <BasicTable @register="registerTable" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Card } from 'ant-design-vue';
  import { computed, onMounted, ref, unref } from 'vue';
  import OEEChart from './components/EquipmentPerformance/OEEChart.vue';
  import ErrorChart from './components/EquipmentPerformance/ErrorChart.vue';
  import { getBasicColumns } from './components/EquipmentPerformance/tableDataEquipmentPerformance';
  import EquipmentPerformanceSidebar from './components/EquipmentPerformance/EquipmentPerformanceSidebar.vue';
  import EquipmentErrorLogResource from '@/api/resource/EquipmentErrorLogResource';
  import EquipmentErrorLogEntity from '@/api/model/EquipmentErrorLogEntity';
  import axiosInstance from '@/api/resource/axiosInstance';
  import ApiResponse from '@/api/ApiResponse';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { searchOEEApi } from '@/api/sys/error-equipment-log';

  const data = ref<EquipmentErrorLogEntity[]>([]);
  const chartData = ref([]);
  const oeeData = ref([]);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const totalPage = ref<number>(0);
  const filter = ref<object>({});
  const isQuery = ref<boolean>(false);
  // const total = ref<number>(0);

  const combinedParams = computed(() => {
    return {
      ...filter.value,
      page: page.value,
      pageSize: pageSize.value,
    };
  });

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
    // title: 'Thông số lỗi',
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

  onMounted(() => {
    // fetchData({ page: page.value, pageSize: pageSize.value });
    fetchOEE();
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

  async function fetchOEE(params: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchOEEApi(params);
      if (response?.data) {
        oeeData.value = response.data;
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  const fetchChart = async (param: unknown) => {
    try {
      loading.value = true;
      const response: ApiResponse<any> = await axiosInstance.get(
        'v1/equipment/get-equipment-stop-error-rate',
        {
          params: param,
        },
      );
      if (response.success) {
        chartData.value = response.data;
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  };

  async function fetchData(param: object = {}, isExport: boolean = false) {
    fetchChart(param);
    fetchOEE(param);
    try {
      const res: any = await EquipmentErrorLogResource.getAll<EquipmentErrorLogEntity>(param);
      if (isExport && res.data?.excel) {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.data.excel}`;
        link.download = 'Thong so loi.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        data.value = res.data.data;
        if (res.data.pagination) {
          // page.value = res.data.pagination.page;
          // pageSize.value = res.data.pagination.pageSize;
          // total.value = res.data.pagination.total; // Đảm bảo giá trị này tồn tại
          // Set pagination
          const pagination: IPagination = res.data?.pagination ?? null;
          let totalRecord = res.data.data.length;
          if (pagination) totalRecord = pagination.total;
          paginationProp.value.current = page.value ?? 1;
          paginationProp.value.total = totalRecord ?? 0;
          paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
          setPagination(paginationProp.value);
        }
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values: object) {
    isQuery.value = true;
    filter.value = unref(values);
    fetchData(combinedParams.value);
  }

  const downloadExcel = () => {
    const params = {
      ...combinedParams.value,
      export: true,
    };
    fetchData(params, true);
  };
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
