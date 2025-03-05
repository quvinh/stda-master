<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <DepartmentSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý phòng ban"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/Department.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-departments`"
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
            <!-- <Button size="small" type="primary" @click="exportData">
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
      <DepartmentModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IDepartment } from '@/api/model/IDepartment';
  import { deleteDepartmentApi, searchDepartmentApi } from '@/api/sys/department';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import DepartmentModal from './components/DepartmentModal.vue';
  import DepartmentSidebar from './components/DepartmentSidebar.vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const departments = ref<IDepartment[]>([]);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const filter = ref<any>({});

  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);

  const pageChange = (p, pz) => {
    page.value = p;
    pageSize.value = pz;
    fetchDepartment({ page: p, pageSize: pz });
  };

  const pageSizeChange = (_current, size) => {
    pageSize.value = size;
    fetchDepartment({ page: page.value, pageSize: size });
  };

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
    dataSource: departments,
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
    fetchDepartment();
  });

  async function fetchDepartment(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchDepartmentApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      departments.value = response.data ?? [];

      //set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = departments.value.length;
      if (pagination) totalRecord = pagination.total;
      paginationProp.value.current = page.value ?? 1;
      paginationProp.value.total = totalPage.value ?? 0;
      paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
      setPagination(paginationProp.value);
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }
  /**
   * @description action create, open model
   */
  const handleCreate = async () => {
    openModal(true, {
      isUpdate: false,
    });
  };
  /**
   * @description action update, open model
   */
  const handleUpdate = async (record: Recordable) => {
    openModal(true, {
      record,
      isUpdate: true,
    });
  };
  const handleDelete = (record: Recordable) => {
    try {
      const result: any = deleteDepartmentApi(record?.id);
      if (result) {
        fetchDepartment();
        message.success('Thao tác thành công');
      } else message.error('Thao tác thất bại');
    } catch (error) {
      message.error(error.message);
    }
  };
  /**
   * @description handle success
   * @param result
   */
  const handleSuccess = (result: any) => {
    console.log(result);
    fetchDepartment();
  };

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
          fetchDepartment();
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

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchDepartment({ ...values });
  }
</script>
