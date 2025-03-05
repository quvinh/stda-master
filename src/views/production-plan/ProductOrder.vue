<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ProductionOrderSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Danh sách đơn hàng"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/ProductOrders.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              Mẫu đơn hàng
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-production-orders`"
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
            <Button size="small" type="primary" @click="handleExport" style="margin-right: 10px">
              <Icon icon="ant-design:file-excel-outlined" />
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
                    // label: 'Sửa',
                    icon: 'ant-design:edit-outlined',
                    disabled: record?.status === 'pending' ? false : true,
                    onClick: handleUpdate.bind(null, record),
                  },
                  {
                    // label: 'Xóa',
                    icon: 'ant-design:delete-outlined',
                    color: 'error',
                    disabled: record?.status === 'pending' ? false : true,
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
      <ProductOrderModal
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
  import { useModal } from '@/components/Modal';
  import { message, Upload, Button, Card, Space } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { IProductionOrder } from '@/api/model/IProductionOrder';
  import ProductOrderModal from '@/views/master-data/productOrder/components/ProductOrderModal.vue';
  import {
    deleteProductOrderApi,
    exportProductOrderApi,
    searchProductOrderApi,
  } from '@/api/sys/production-order';
  import ProductionOrderSidebar from './ProductionOrderSidebar.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const productOrders = ref<IProductionOrder[]>([]);
  const uploading = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const totalPage = ref<number>(0);
  const filter = ref<object>({});
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

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: productOrders,
    columns: getBasicColumns(),
    useSearchForm: false,
    actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
  });

  onMounted(() => {
    // fetchProductOrder({ page: page.value, pageSize: pageSize.value });
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchProductOrder({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchProductOrder({ page: page.value, pageSize: size, ...filter.value });
  }

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchProductOrder(info);
  }

  async function fetchProductOrder(param: any = {}) {
    try {
      loading.value = true;
      if (!param?.customer_id) param.customer_id = null;
      if (!param?.product_id) param.product_id = null;
      const response: any = await searchProductOrderApi(param);
      const productOrderData = response.data ?? [];
      productOrders.value = productOrderData;

      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = productOrders.value.length;
      if (pagination) totalRecord = pagination.total;
      paginationProp.value.current = page.value ?? 1;
      paginationProp.value.total = totalRecord ?? 0;
      paginationProp.value.showTotal = () => `Tổng ${totalRecord ?? 0} bản ghi`;
      setPagination(paginationProp.value);
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
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

  function handleSidebarFilter(values: any) {
    filter.value = values;
    console.log(values);
    fetchProductOrder(values);
  }

  async function handleDelete(record: Recordable) {
    try {
      const result = await deleteProductOrderApi(record?.id);
      if (result) {
        fetchProductOrder({ page: page.value, pageSize: pageSize.value });
        message.success('Xóa thành công');
      } else {
        message.error('Xóa thất bại');
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  function handleSuccess(result: any) {
    console.log(result);
    fetchProductOrder({ page: page.value, pageSize: pageSize.value });
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
          fetchProductOrder({ page: page.value, pageSize: pageSize.value });
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
      const response = await exportProductOrderApi(params);
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
</script>
