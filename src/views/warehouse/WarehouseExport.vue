<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <WarehouseExportSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Quản lý lệnh xuất kho"
      >
        <template #extra
          ><Space>
            <Button
              size="small"
              :href="`${BACKEND_URL}/excel/${type === 1 ? 'MauLenhXuatKho.xlsx' : 'FinishedProductExportItems.xlsx'}`"
              ><Icon icon="ant-design:download-outlined" /> Mẫu lệnh xuất kho</Button
            >
            <Upload
              :action="`${BACKEND_URL}/api/v1/${type === 1 ? 'import-material-exports' : 'import-finished-product-exports'}`"
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
              <a-button type="primary" size="small"
                ><Icon icon="ant-design:upload-outlined" /> Upload file</a-button
              >
            </Upload>
            <Dropdown>
              <Button type="primary" size="small">
                Tạo lệnh xuất <Icon icon="ant-design:down-outlined" />
              </Button>
              <template #overlay>
                <Menu @click="handleMenuClick">
                  <Menu.Item key="add" @click="() => handleCreate"
                    ><Icon icon="ant-design:plus-outlined" class="mr-1" />Tạo lệnh xuất</Menu.Item
                  >
                  <Menu.Item key="add-from-plan" @click="() => handleCreate"
                    ><Icon icon="ant-design:plus-outlined" class="mr-1" />Tạo lệnh xuất từ
                    KHSX</Menu.Item
                  >
                </Menu>
              </template>
            </Dropdown>
          </Space></template
        >
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                class="flex"
                style="align-items: center; justify-content: center"
                :actions="[
                  {
                    // label: 'Sửa',
                    icon: 'ant-design:eye-outlined',
                    onClick: handleViewDetail.bind(null, record),
                  },
                  {
                    // label: 'Sửa',
                    icon: 'ant-design:edit-outlined',
                    disabled: record?.history?.length > 0 ? true : false,
                    onClick: handleUpdate.bind(null, record),
                  },
                  {
                    // label: 'Xóa',
                    icon: 'ant-design:delete-outlined',
                    color: 'error',
                    disabled: record?.history?.length > 0 ? true : false,
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
      <WarehouseExportModal
        @success="handleSidebarFilter"
        :width="800"
        :draggable="false"
        @register="registerImportModal"
      />
      <FinihedProductExportModal
        :width="800"
        :draggable="false"
        @register="registerExportModal"
        @success="handleSuccess"
      />
      <ViewWarehouseExportModal :width="800" :draggable="false" @register="registerModal" />
      <ViewFinishedProductExportModal
        :width="800"
        :draggable="false"
        @register="registerFPIModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IWarehouse } from '@/api/model/IWarehouse';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { Button, Dropdown, Menu, message, Space, Upload, Card } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import WarehouseExportSidebar from './components/WarehouseExportSidebar.vue';
  import { getBasicColumns, getActionColumn } from './components/tableDataWarehouseExport';
  import WarehouseExportModal from './components/WarehouseExportModal.vue';
  import ViewWarehouseExportModal from './components/ViewWarehouseExportModal.vue';
  import {
    deleteMaterialExportApi,
    searchMaterialExportApi,
    searchNVLWareHouseReceiptDataApi,
  } from '@/api/sys/warehouse';
  import { getToken } from '@/utils/auth';
  import FinihedProductExportModal from './components/FinihedProductExportModal.vue';
  import ViewFinishedProductExportModal from './components/ViewFinishedProductExportModal.vue';

  const [registerModal, { openModal }] = useModal();
  const [registerFPIModal, { openModal: openFPIModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const uploading = ref<boolean>(false);
  const type = ref(1);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const filter = ref<any>({
    dates: dayjs(),
  });
  const totalPage = ref<number>(0);
  const warehouse = ref<IWarehouse[]>([]);
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

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchDataMaterial({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchDataMaterial({ page: page.value, pageSize: size, ...filter.value });
  }

  const [registerTable, { setPagination }] = useTable({
    // title: 'Quản lý lệnh xuất kho',
    dataSource: warehouse,
    columns: getBasicColumns(),
    actionColumn: getActionColumn(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
  });

  onMounted(() => {
    // fetchDataMaterial({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    if (type.value === 1) fetchDataMaterial(info);
    else fetchDataFinishedProduct(info);
  }

  async function fetchDataMaterial(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchMaterialExportApi(param);
      console.log('res = ', response.data);
      // Set data
      const warehouseData = response.data ?? [];
      warehouse.value = warehouseData.map((warehouse) => ({
        ...warehouse,
        release_id: warehouse.id,
        release_note: warehouse.note,
        date_of_release: warehouse?.export_date
          ? dayjs(warehouse.export_date).format('DD/MM/YYYY')
          : '',
        entered_by: warehouse.user.name,
      }));

      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = warehouse.value.length;
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

  async function fetchDataFinishedProduct(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchNVLWareHouseReceiptDataApi(param);

      // Set data
      const warehouseData = response.data ?? [];
      warehouse.value = warehouseData.map((warehouse) => ({
        ...warehouse,
        release_id: warehouse.id,
        date_of_release: warehouse.export_date,
        entered_by: warehouse.user.name,
      }));

      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = warehouse.value.length;
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

  function handleSidebarFilter(values) {
    filter.value = values;
    if (values.type === 2) {
      type.value = 2;
      fetchDataFinishedProduct(values);
    } else {
      type.value = 1;
      fetchDataMaterial(values);
    }
  }

  function handleCreate() {
    if (type.value === 1) openImportModal(true, { isUpdate: false });
    else openExportModal(true, { isUpdate: false });
  }

  function handleUpdate(record: Recordable) {
    if (type.value === 1) openImportModal(true, { isUpdate: true, record });
    else openExportModal(true, { isUpdate: true, record });
  }

  async function handleDelete(record: Recordable) {
    const response = await deleteMaterialExportApi(record?.id);
    if (response) {
      handleSuccess();
      message.success('Thao tác thành công');
    }
  }

  function handleSuccess(value?: any) {
    if (value.type === 1) fetchDataMaterial();
    else fetchDataFinishedProduct();
  }

  function handleMenuClick(value) {
    switch (value.key) {
      case 'add':
        break;
      case 'add-from-plan':
        break;
      default:
        message.error('Value invalid');
        break;
    }
    handleCreate();
  }

  function handleViewDetail(record: Recordable) {
    if (type.value === 1) openModal(true, { isUpdate: true, record, type: 1 });
    else openFPIModal(true, { isUpdate: true, record, type: 2 });
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
          fetchDataMaterial({ page: page.value, pageSize: pageSize.value });
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
