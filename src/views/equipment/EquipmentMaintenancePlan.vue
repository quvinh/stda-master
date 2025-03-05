<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentMaintenancePlanSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Kế hoạch bảo dưỡng thiết bị"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/MaintenancePlan.xlsx`"
              ><Icon icon="ant-design:download-outlined" /> Tải excel mẫu</Button
            >
            <Upload
              action="/v1/import-maintenance-plan"
              name="file"
              accept=".xlsx"
              :showUploadList="false"
              :loading="uploading"
              :headers="{
                Authorization: String(getToken() ?? ''),
              }"
              :data="{}"
              @change="handleUploadChange"
            >
              <Button type="primary" size="small"
                ><Icon icon="ant-design:upload-outlined" /> Upload excel</Button
              >
            </Upload>
            <Button type="primary" size="small" @click="exportData"
              ><Icon icon="ant-design:download-outlined" /> Xuất excel</Button
            >
          </Space>
        </template>
        <BasicTable @register="registerTable" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { searchApi, exportExcelData } from '@/api/sys/equipment-maintenance-plan';
  import { Button, message, Upload, Space, Card } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getBasicColumns } from './components/EquipmentMaintenancePlan/tableDataEquipmentMaintenancePlan';
  import EquipmentMaintenancePlanSidebar from './components/EquipmentMaintenancePlan/EquipmentMaintenancePlanSidebar.vue';
  import dayjs from 'dayjs';
  import { IPagination } from '@/store/types/pagination';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { IEquipmentMaintenancePlan } from '@/api/model/IEquipmentMaintenancePlan';
  import { getToken } from '@/utils/auth';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const data = ref<IEquipmentMaintenancePlan[]>([]);
  const uploading = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);

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
    title: 'Kế hoạch bảo dưỡng thiết bị',
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

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData({ page: page.value, pageSize: size, ...filter.value });
  }

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value, ...filter.value });
  });

  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
    maintenanceType: data,
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const { data: resource, pagination } = await searchApi(param);
      if (resource) {
        console.log(resource);
        data.value = resource?.map((i) => ({
          ...i,
        }));

        // Set pagination
        const paginate: IPagination = pagination ?? null;
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
    console.log('Data from sidebar', values);
    filter.value = values;
    fetchData(values);
  }

  async function exportData() {
    try {
      const response: any = await exportExcelData();
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

  function handleUploadChange(info: any) {
    try {
      if (info.file.status === 'uploading') {
        uploading.value = true;
      } else {
        if (info.file.status === 'done') {
          if (!info.file?.response?.success)
            throw new Error(
              info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`,
            );
          message.success(`${info.file.name} - Upload thành công`);
          fetchData({ page: page.value, pageSize: pageSize.value });
        } else if (info.file.status === 'error') {
          message.error(info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`);
        }
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      uploading.value = false;
    }
  }
</script>
