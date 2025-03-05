<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <MoldSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 flex flex-col w-[600px] bg-white">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Danh sách khuôn"
      >
        <template #extra>
          <div class="flex justify-between items-center">
            <div class="pe-2">
              <Button
                type="primary"
                size="small"
                id="downloadExcel"
                style="margin-top: 10px"
                @click="exportData"
              >
                <Icon icon="ant-design:download-outlined" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <div class="h-[75px]">
            <BasicTable @register="registerTableTop" />
          </div>
          <div class="h-full">
            <BasicTable @register="registerTableMiddle" />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MoldSidebar from './components/Mold/MoldSidebar.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Card } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import { IPagination } from '@/store/types/pagination';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { searchMoldApi, exportExcelDataMoldApi } from '@/api/sys/mold';
  import Icon from '@/components/Icon/Icon.vue';
  import { getColumnsTop, getColumnsMiddle } from './components/Mold/tableDataMold';
  import { PaginationProps } from 'ant-design-vue/lib';

  const dataTop = ref<any[]>([]);
  const dataMiddle = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const totalPage = ref<number>(0);

  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });
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
  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage: number) => `Total ${totalPage} items`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current: unknown, size: number) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  const [registerTableMiddle, { setPagination }] = useTable({
    rowKey: 'id',
    dataSource: dataMiddle,
    columns: getColumnsMiddle(),
    showIndexColumn: true,
    bordered: true,
    loading,
  });
  onMounted(() => {
    // fetchData({ page: page.value, pageSize: pageSize.value });
  });

  async function fetchData(params: any = {}) {
    try {
      loading.value = true;

      const { data: resource, pagination } = await searchMoldApi(params);
      if (resource) {
        console.log(resource);
        dataMiddle.value = resource?.map((i) => ({
          ...i,
        }));
        // Set pagination
        const paginate: IPagination = pagination ?? null;
        let totalRecord = dataMiddle.value.length;
        if (paginate) totalRecord = paginate.total;
        paginationProp.value.current = page.value ?? 1;
        paginationProp.value.total = totalRecord ?? 0;
        paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
        setPagination(paginationProp.value);
        dataTop.value = [
          {
            total: totalRecord,
            // in_warehouse: 15%
            in_warehouse: Math.floor(totalRecord * 0.15),
            running_molds: totalRecord - 1,
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
    console.log('Data from sidebar', values);
    filter.value = values;
    fetchData(values);
  }

  async function exportData() {
    try {
      const response: any = await exportExcelDataMoldApi();
      const { data, type, file } = response;
      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }
    } catch (e) {
      message.error('Error exporting processes:', e);
    }
  }
</script>
