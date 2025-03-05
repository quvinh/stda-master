<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <SupplierSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý nhà cung cấp"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/Suppliers.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-suppliers`"
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
            <Button size="small" type="primary" @click="handleExport">
              <Icon icon="ant-design:file-excel-outlined" />
              Xuất Excel
            </Button>
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
      <SupplierModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ISupplier } from '@/api/model/ISupplier';
  import { deleteSupplierApi, exportSupplierApi, searchSupplierApi } from '@/api/sys/supplier';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import SupplierModal from './component/SupplierModal.vue';
  import SupplierSidebar from './component/SupplierSidebar.vue';
  import { getActionColumn, getBasicColumns } from './component/tableData';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const suppliers = ref<ISupplier[]>([]);
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
  const filter = ref<any>({});

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: suppliers,
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
    fetchSupplier();
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchSupplier({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchSupplier({ page: page.value, pageSize: size });
  }

  async function fetchSupplier(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchSupplierApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      // Set data
      const suppliersData = response.data ?? [];
      console.log(suppliersData);
      suppliers.value = suppliersData.map((product) => ({
        ...product,
        unit_name: product.unit?.unit_name || 'No Unit',
        product_category_name: product.product_category?.product_category_name || 'No Category',
      }));

      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = suppliers.value.length;
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
      const result = await deleteSupplierApi(record?.id);
      if (result) {
        fetchSupplier();
        message.success('Thao tác thành công');
      } else message.error('Thao tác thất bại');
    } catch (error) {
      message.error(error.message);
    }
  }

  /**
   * @description handle success
   * @param result
   */
  function handleSuccess(result: any) {
    console.log(result);
    fetchSupplier();
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
          fetchSupplier();
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

  async function handleExport(params: any) {
    try {
      const response = await exportSupplierApi(params);
      console.log(response.data);
      if (response && response.data) {
        const { file, type, data } = response;
        if (!data || typeof data !== 'string') {
          throw new Error('Dữ liệu không hợp lệ.');
        }
        const base64Data = data.split(',')[1];
        if (!base64Data) {
          throw new Error('Dữ liệu base64 không hợp lệ.');
        }
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }
    } catch (error) {
      message.error(error.message || 'Đã xảy ra lỗi.');
    }
  }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchSupplier({ ...values });
  }
</script>
