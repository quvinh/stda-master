<template>
  <div class="charts-container">
    <Card
      class="full-height-card border border-gray-300"
      :bodyStyle="{ padding: '8px', height: '100%' }"
      size="small"
      title="Tỷ lệ hoàn thành kế hoạch"
    >
      <Chart1 />
    </Card>

    <Card
      class="full-height-card border border-gray-300"
      :bodyStyle="{ padding: '8px', height: '100%' }"
      size="small"
      title="Hiệu suất thiết bị"
    >
      <Chart2 />
    </Card>

    <Card
      class="full-height-card border border-gray-300"
      :bodyStyle="{ padding: '8px', height: '100%' }"
      size="small"
      title="Tỷ lệ đạt chất lượng OQC"
    >
      <Chart3 />
    </Card>

    <Card
      class="full-height-card border border-gray-300"
      :bodyStyle="{ padding: '8px', height: '100%' }"
      size="small"
      title="Tỷ lệ lỗi công đoạn"
    >
      <Chart2 />
    </Card>
  </div>
</template>

<script setup lang="ts">
  import ApiResponse from '@/api/ApiResponse';
  import ILotHistory from '@/api/model/ILotHistory';
  import axiosInstance from '@/api/resource/axiosInstance';
  import { BasicTable, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { Button, Card, message } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { computed, onMounted, ref, watch } from 'vue';
  import { getBasicColumns } from '../assessment/components/tableData';
  import Chart1 from './Chart1.vue';
  import Chart2 from './Chart2.vue';
  import Chart3 from './Chart3.vue';

  const chartData = ref([]);
  const lineChartData = ref([]);

  const props = defineProps<{
    sidebarFilter: object;
  }>();

  const data = ref<ILotHistory[]>([]);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(10);
  const total = ref<number>(0);

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

  const [registerTable, { setPagination }] = useTable({
    dataSource: data,
    columns: getBasicColumns(),
    // actionColumn: getActionColumn(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
    tableSetting: { redo: false },
  });

  const combinedParams = computed(() => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      ...props.sidebarFilter,
    };
  });

  const downloadExcel = () => {
    const params = {
      ...combinedParams.value,
      export: true,
    };
    fetchData(params, true);
  };

  onMounted(() => {
    // fetchData(combinedParams.value);
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size });
  }

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  watch(
    () => props.sidebarFilter,
    () => {
      page.value = 1;
      fetchData(combinedParams.value);
    },
  );

  async function fetchData(param: any = {}, isExport: boolean = false) {
    loading.value = true;
    try {
      const res = await axiosInstance.get(`v1/qc/ui/pqc-histories`, {
        params: param,
        responseType: 'json',
      });
      if (isExport && res.data.excel) {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.data.excel}`;
        link.download = 'PQC.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        data.value = res.data.data;
        let totalRecord = res.data.data?.length;
        if (res.data.pagination) {
          totalRecord = res.data.pagination.total;
          paginationProp.value.current = page.value ?? 1;
          paginationProp.value.total = totalRecord ?? 0;
          paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
          setPagination(paginationProp.value);
        }
      }

      const chartRes: ApiResponse<any> = await axiosInstance.get(`v1/qc/ui/process-error-rate`, {
        params: { ...param, type: 'pqc' },
      });
      if (chartRes.success && chartRes.data) {
        chartData.value = chartRes.data;
      }

      const lineChartRes: ApiResponse<any> = await axiosInstance.get(
        `v1/qc/ui/last-7-days-process-errors`,
        {
          params: { ...param, type: 'pqc' },
        },
      );
      if (lineChartRes.success && lineChartRes.data) {
        lineChartData.value = lineChartRes.data;
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      loading.value = false;
    }
  }

  // function handleTableChange(pagination: any) {
  //   if (pagination.current !== page.value) {
  //     page.value = pagination.current;
  //   }
  //   if (pagination.pageSize !== pageSize.value) {
  //     pageSize.value = pagination.pageSize;
  //   }
  //   fetchData(combinedParams.value);
  // }
</script>
<style scoped>
  .charts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 cột */
    grid-template-rows: repeat(2, 1fr); /* 2 hàng */
    height: 100vh; /* Chiều cao full màn hình */

    /* padding: 8px; */
  }

  .full-height-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
