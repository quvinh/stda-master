<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <ProductionCapacitySidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Năng lực sản xuất"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/Products.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              action="/v1/import-products"
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
            <Button type="primary" size="small" @click="exportData">
              <Icon icon="ant-design:file-excel-outlined" />
              Xuất Excel
            </Button>
            <a-button type="primary" size="small" @click="handleCreate">
              <Icon icon="ant-design:plus-outlined" />
              Tạo mới
            </a-button>
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
      <ProductionCapacityModal
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
  import { getActionColumn, getBasicColumns } from './components/tableProductionCapacity';
  import { useModal } from '@/components/Modal';
  import { Button, message, Space, Upload, Card } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { exportExcelData } from '@/api/sys/product';
  import dayjs from 'dayjs';
  import { useSpecStore } from '@/store/modules/states/spec';
  import ISpec from '@/api/model/ISpec';
  import ProductionCapacitySidebar from './components/ProductionCapacitySidebar.vue';
  import ProductionCapacityModal from './components/ProductionCapacityModal.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const specStore = useSpecStore();
  const products = ref<ISpec[]>([]);
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
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    // title: 'Năng lực sản xuất',
    dataSource: [],
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
    fetchSpec({ page: page.value, pageSize: pageSize.value });
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchSpec({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchSpec({ page: page.value, pageSize: size, ...filter.value });
  }

  // function handleSearchInfoFn(info) {
  //   page.value = 1;
  //   fetchSpec(info);
  // }

  async function fetchSpec(param: any = {}) {
    try {
      loading.value = true;
      const response = await specStore.search(param);
      // Set data
      const specData = response.data ?? [];
      products.value = specData.map((product) => ({
        ...product,
        product_name: product.product?.product_name,
        process_name: product.process?.name,
        equipment_name: product.equipment?.equipment_name,
      }));
      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = products.value.length;
      if (pagination) {
        totalRecord = pagination.total;
      }
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
      const result = await specStore.delete(record?.id);
      if (result) {
        await fetchSpec({ page: page.value, pageSize: pageSize.value });
        message.success('Thao tác thành công');
      } else {
        message.error('Thao tác thất bại');
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  function handleSuccess() {
    fetchSpec({ page: page.value, pageSize: pageSize.value });
  }

  function handleUploadChange(info: any) {
    try {
      if (info.file.status === 'uploading') {
        uploading.value = true;
      } else {
        if (info.file.status === 'done') {
          if (!info.file?.response?.success) {
            throw new Error(
              info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`,
            );
          }
          message.success(`${info.file.name} - Upload thành công`);
          fetchSpec({ page: page.value, pageSize: pageSize.value });
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
      // @ts-ignore
      const { data, type, file } = response;
      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else {
          message.error('Data invalid!');
        }
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }
    } catch (e) {
      message.error('Error exporting processes:', e);
    }
  }

  function handleSidebarFilter(values) {
    filter.value = values;
    fetchSpec(values);
  }
</script>
