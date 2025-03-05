<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentParameterSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Thông số thiết bị"
      >
        <template #extra hidden="hidden">
          <Button type="primary" size="small" hidden="hidden">
            <Icon icon="ant-design:download-outlined" />
            Xuất dữ liệu
          </Button>
        </template>
        <BasicTable @register="registerTable" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Card } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getBasicColumns } from './components/EquipmentParameter/tableDataEquipmentParameter';
  import EquipmentParameterSidebar from './components/EquipmentParameter/EquipmentParameterSidebar.vue';
  import dayjs from 'dayjs';
  import { IPagination } from '@/store/types/pagination';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import EquipmentParameterLogResource from '@/api/resource/EquipmentParameterLogResource';

  const data = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });
  const totalPage = ref<number>(0);

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

  const [registerTable, { setPagination }] = useTable({
    // title: 'Thông số thiết bị',
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    pagination: paginationProp,
    handleSearchInfoFn,
  });

  onMounted(() => {
    // fetchData({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  function pageChange(p: number, pz: number) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const response = await EquipmentParameterLogResource.getAll<any>(param);
      console.log(response);
      if (response.success) {
        data.value = response.data.data?.map((i) => ({
          ...i,
          process_id: i.equipment?.process_id,
        }));
        const paginate: IPagination | null = response?.data?.pagination ?? null;
        let totalRecord = data.value.length;
        if (paginate) totalRecord = paginate.total;
        paginationProp.value.current = page.value ?? 1;
        paginationProp.value.total = totalRecord ?? 0;
        paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
        setPagination(paginationProp.value);
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    filter.value = values;
    fetchData({ page: page.value, pageSize: pageSize.value, ...values });
  }
</script>
