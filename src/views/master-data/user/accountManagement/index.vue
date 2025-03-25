<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <AccountSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý tài khoản"
      >
        <template #extra>
          <Space>
            <!-- <Button size="small" :href="`${BACKEND_URL}/excel/Users.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-users`"
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
            </Upload> -->
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
      <AccountModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { searchDepartmentApi } from '@/api/sys/department';
  import { searchRoleApi } from '@/api/sys/role';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { useUserStore } from '@/store/modules/user';
  import { IPagination } from '@/store/types/pagination';
  import { Button, Card, message, Space } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import AccountModal from './components/AccountModal.vue';
  import AccountSidebar from './components/AccountSidebar.vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const userStore = useUserStore();
  const users = ref<any[]>([]);
  const roles = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const departments = ref<any[]>([]);

  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const totalPage = ref<number>(0);
  const filter = ref<any>({});
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
    dataSource: users,
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
    fetchDepartment();
    fetchRoles();
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

  async function fetchRoles() {
    try {
      loading.value = true;
      const response = await searchRoleApi();
      // Set data
      roles.value = response?.data?.map((i) => ({
        value: i.id,
        label: i.name,
      }));
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const response = await userStore.search({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      // Set data
      users.value = response?.data?.map((item) => ({
        ...item,
        department: item.departments.map((e) => e.name).join(', '),
        position: item.roles.map((e) => e.name).join(', '),
      }));
      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = users.value.length;
      if (pagination) totalRecord = pagination.total;
      paginationProp.value.current = page.value ?? 1;
      paginationProp.value.total = totalRecord ?? 0;
      paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
      setPagination(paginationProp.value);
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function fetchDepartment() {
    try {
      loading.value = true;
      const response: any = await searchDepartmentApi();
      const departmentsData = response.data ?? [];
      //set data
      departments.value = departmentsData.map((i) => ({
        value: i.id,
        label: i.name,
      }));
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description action create, open modal
   */
  async function handleCreate() {
    openModal(true, {
      isUpdate: false,
      department: departments,
      role: roles,
    });
  }

  /**
   * @description action update, open modal
   */
  async function handleUpdate(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      department: departments,
      role: roles,
    });
  }

  /**
   * @description action delete
   */
  async function handleDelete(record: Recordable) {
    try {
      const result = await userStore.delete(record?.id);
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
          fetchData();
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
  // async function exportData() {
  //   try {
  //     const response: any = await exportExcelData();
  //     const { data, type, file } = response;
  //     try {
  //       if (data && type && file) {
  //         downloadExcel(data, type, file);
  //       } else message.error('Data invalid!');
  //     } catch (error) {
  //       console.log(error);
  //       message.error((error as Error).message);
  //     }
  //   } catch (e) {
  //     message.error('Error exporting processes:', e);
  //   }
  // }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchData({ ...values });
  }
</script>
