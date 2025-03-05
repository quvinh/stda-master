<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <CustomerSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý khách hàng"
      >
        <template #extra>
          <Authority :value="PermissionEnum.CUSTOMER_CREATE">
            <Space>
              <Button size="small" :href="`${BACKEND_URL}/excel/Customers.xlsx`">
                <Icon icon="ant-design:download-outlined" />
                File upload mẫu
              </Button>
              <Upload
                :action="`${BACKEND_URL}/api/v1/import-customers`"
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
              </Button>
              <Button size="small" type="primary" @click="handleCreate">
                <Icon icon="ant-design:plus-outlined" />
                Tạo mới
              </Button>
            </Space>
          </Authority>
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
      <CustomerModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getActionColumn, getBasicColumns } from './components/tableData';
  import { ICustomer } from '@/api/model/ICustomer';
  import { useModal } from '@/components/Modal';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import CustomerModal from './components/CustomerModal.vue';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { deleteCustomerApi, exportExcelData, searchCustomerApi } from '@/api/sys/customer';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import Authority from '@/components/Authority/src/Authority.vue';
  import { PermissionEnum } from '@/enums/permissionEnum';
  import CustomerSidebar from './components/CustomerSidebar.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const customers = ref<ICustomer[]>([]);
  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const filter = ref<any>({});

  const page = ref<number>(1);
  const pageSize = ref<number>(25);
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

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: customers,
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
    fetchCustomer();
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchCustomer({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchCustomer({ page: page.value, pageSize: size });
  }

  async function fetchCustomer(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchCustomerApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      // Set data
      customers.value = response.data ?? [];

      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = customers.value.length;
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

  /**
   * @description action create, open model
   */
  async function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  /**
   * @description action update, open model
   */
  async function handleUpdate(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  /**
   * @description action update
   */
  async function handleDelete(record: Recordable) {
    try {
      const result = await deleteCustomerApi(record?.id);
      if (result) {
        fetchCustomer();
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
    fetchCustomer();
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
          fetchCustomer();
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

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchCustomer({ ...values });
  }

  // function handleOpenRevisionHistoryModal(record) {
  //   openRevisionHistoryModal(true, {
  //     isUpdate: false,
  //     record,
  //   });
  // }
</script>
