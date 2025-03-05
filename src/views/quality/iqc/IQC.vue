<template>
  <div class="flex flex-col h-full">
    <Card
      class="h-full border-gray-300 border-1"
      :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
      size="small"
      title="Lịch sử IQC"
    >
      <template #extra>
        <div class="flex justify-between items-center">
          <Button type="primary" size="small" @click="downloadExcel">
            <Icon icon="ant-design:download-outlined" />
            Xuất dữ liệu
          </Button>
        </div>
      </template>
      <BasicTable @register="registerTable" />
    </Card>
  </div>
</template>

<script setup lang="ts">
  import ILotHistory from '@/api/model/ILotHistory';
  import axiosInstance from '@/api/resource/axiosInstance';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { Button, Card, message } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { computed, onMounted, ref, watch } from 'vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';

  const props = defineProps<{
    sidebarFilter: object;
  }>();

  const data = ref<ILotHistory[]>([]);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
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
      const res = await axiosInstance.get(`v1/qc/ui/iqc-histories`, {
        params: param,
        responseType: 'json',
      });
      if (isExport && res.data.excel) {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.data.excel}`;
        link.download = 'IQC.xlsx';
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
