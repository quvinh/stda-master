<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <EAVSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="EAV"
      >
        <template #extra>
          <Space>
            <!-- <Button size="small" :href="`${BACKEND_URL}/excel/data.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-data`"
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
              <Button type="primary" size="small">
                <Icon icon="ant-design:upload-outlined" />
                Upload file
              </Button>
            </Upload>
            <Button size="small" type="primary" @click="exportData">
              <Icon icon="ant-design:file-excel-outlined" />
              Xuất Excel
            </Button> -->
            <Button size="small" type="primary" @click="handleCreate">
              <Icon icon="ant-design:plus-outlined" />
              Tạo mới
            </Button>
          </Space>
        </template>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                :actions="[
                  {
                    // label: 'Sửa',
                    icon: 'ant-design:edit-outlined',
                    onClick: handleUpdate.bind(null, record),
                  },
                  {
                    // label: 'Xóa',
                    icon: 'ant-design:delete-outlined',
                    color: 'error',
                    popConfirm: {
                      title: 'Xác nhận xóa?',
                      placement: 'topLeft',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </Card>
      <EAVModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { deleteEAVApi, searchEAVApi } from '@/api/sys/eav';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  // import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, Card, message, Space } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import EAVModal from './component/EAVModal.vue';
  import EAVSidebar from './component/EAVSidebar.vue';
  import { getActionColumn, getBasicColumns } from './component/tableData';

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  // const uploading = ref<boolean>(false);
  const data = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);
  const filter = ref<any>({ model: 'mold' });
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

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
  });

  onMounted(() => {
    fetchData();
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchData();
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchData();
  }

  async function fetchData(payload: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchEAVApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...payload,
      });
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
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description action create, open model
   */
  async function handleCreate() {
    openModal(true, {
      isUpdate: false,
      filter: filter.value,
    });
  }

  /**
   * @description action update, open model
   */
  async function handleUpdate(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      filter: filter.value,
    });
  }

  /**
   * @description action update
   */
  async function handleDelete(record: Recordable) {
    try {
      const result = await deleteEAVApi(record?.id, { ...filter.value });
      if (result) {
        fetchData();
        message.success('Thao tác thành công');
      } else message.error('Thao tác thất bại');
    } catch (error) {
      message.error(error.message);
    }
  }

  /**
   * @description handle success
   */
  function handleSuccess() {
    fetchData();
  }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchData({ ...values });
  }
</script>
