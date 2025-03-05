<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ProductionPlanSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <div class="flex flex-col h-full">
        <div class="h-full flex flex-col">
          <Card
            class="h-full border-gray-300 border-1"
            :bodyStyle="{ padding: '5px!important', height: '85%' }"
            size="small"
            title="Kế hoạch sản xuất"
          >
            <template #extra>
              <Space>
                <Button size="small" :href="`${BACKEND_URL}/excel/MauKeHoachSanXuat.xlsx`">
                  <Icon icon="ant-design:download-outlined" />
                  Mẫu kế hoạch sản xuất
                </Button>
                <Upload
                  :action="`${BACKEND_URL}/api/v1/import-production-plans`"
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
                  <a-button type="primary" size="small">
                    <Icon icon="ant-design:upload-outlined" />
                    Upload file
                  </a-button>
                </Upload>
                <Button type="primary" size="small" @click="exportData">
                  <Icon icon="ant-design:download-outlined" />
                  Xuất Excel
                </Button>
              </Space>
            </template>
            <BasicTable @register="registerTable">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <TableAction
                    :actions="[
                      {
                        icon: 'ant-design:eye-outlined',
                        onClick: handleOpenViewModal.bind(null, record),
                      },
                    ]"
                  />
                </template>
              </template>
            </BasicTable>
          </Card>
        </div>
      </div>
    </div>
    <EditProductionPlanModal
      :width="500"
      :draggable="false"
      @register="registerModal"
      @success="null"
    />
    <ViewProductionPlanModal
      :width="1000"
      :draggable="false"
      @register="registerViewModal"
      @success="null"
    />
  </div>
</template>

<script setup lang="ts">
  import { searchApi, exportExcelData } from '@/api/sys/production-plan';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getToken } from '@/utils/auth';
  import { Button, message, Space, Upload, Card } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getActionColumn, getBasicColumnsProductionPlan } from './components/tableData';
  import { IPagination } from '@/store/types/pagination';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import Icon from '@/components/Icon/Icon.vue';
  import ProductionPlanSidebar from './components/ProductionPlanSidebar.vue';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { useModal } from '@/components/Modal';
  import EditProductionPlanModal from './components/EditProductionPlanModal.vue';
  import ViewProductionPlanModal from './components/ViewProductionPlanModal.vue';
  import { IProductionPlan } from '@/api/model/IProductionPlan';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const data = ref<IProductionPlan[]>([]);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const [registerModal] = useModal();
  const [registerViewModal, { openModal: openViewModal }] = useModal();
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
  const filter = ref<any>({
    // dates: [dayjs().subtract(7, 'day'), dayjs()],
    dates: [],
  });

  const [registerTable, { setPagination }] = useTable({
    dataSource: data,
    columns: getBasicColumnsProductionPlan(),
    actionColumn: getActionColumn(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
    tableSetting: { redo: false },
  });

  onMounted(() => {
    // fetchData({ page: page.value, pageSize: pageSize.value });
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
    console.log({ param });
    try {
      loading.value = true;
      const { data: resource, pagination } = await searchApi(param);
      if (resource) {
        console.log(resource);
        data.value = resource || [];
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
    // unset all empty values
    filter.value = values;
    Object.keys(values).forEach((key) => {
      if (values[key] === '' || values[key] === null) {
        delete values[key];
      }
    });
    fetchData(values);
  }

  function handleUploadChange(info: any) {
    try {
      uploading.value = true;
      loading.value = true;
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
      loading.value = false;
    }
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

  function handleOpenViewModal(record: unknown) {
    openViewModal(true, { record });
  }
</script>
