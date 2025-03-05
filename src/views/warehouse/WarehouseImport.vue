<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <WarehouseImportSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: '85%' }"
        size="small"
        title="Quản lý lệnh nhập kho"
      >
        <template #extra
          ><Space>
            <Button
              size="small"
              :href="`${BACKEND_URL}/excel/${type === 1 ? 'MauLenhNhapKho.xlsx' : 'FinishedProductImportItems.xlsx'}`"
              ><Icon icon="ant-design:download-outlined" /> Mẫu lệnh nhập kho</Button
            >
            <Upload
              :action="`${BACKEND_URL}/api/v1/${type === 1 ? 'import-material-receipts' : 'import-finished-product-imports'}`"
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
              <Button size="small" type="primary"
                ><Icon icon="ant-design:upload-outlined" /> Upload file</Button
              >
            </Upload>
            <Button type="primary" size="small" @click="handlePrint"
              ><Icon icon="ant-design:printer-outlined" /> In tem Pallet</Button
            >
            <Button type="primary" size="small" @click="handleCreate"
              ><Icon icon="ant-design:plus-outlined" /> Tạo lệnh nhập</Button
            >
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
                    icon: 'ant-design:eye-outlined',
                    onClick: handleViewDetail.bind(null, record),
                  },
                  {
                    // label: 'Sửa',
                    icon: 'ant-design:edit-outlined',
                    disabled: record.history && record.history.length > 0,
                    onClick: handleUpdate.bind(null, record),
                  },
                  {
                    // label: 'Xóa',
                    icon: 'ant-design:delete-outlined',
                    color: 'error',
                    disabled: record.history && record.history.length > 0,
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
      <WarehouseImportModal
        :width="950"
        :draggable="false"
        @register="registerImportModal"
        @success="handleSuccess"
      />
      <FinishedProductImportModal
        :width="950"
        :draggable="false"
        @register="registerFinishedProductImportModal"
        @success="handleSuccess"
      />
      <ViewWarehouseImportModal :width="900" :draggable="false" @register="registerModal" />
      <ViewFinishedProductImportModal
        :width="900"
        :draggable="false"
        @register="registerFPIModal"
      />
    </div>

    <div class="hidden">
      <div ref="labelRef">
        <!-- Safely renders HTML content -->
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { IPagination } from '@/store/types/pagination';
  import { Button, message, Space, Upload, Card } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import dayjs from 'dayjs';
  import { onMounted, ref, computed } from 'vue';
  import { getBasicColumns, getActionColumn } from './components/tableDataWarehouseImport';
  import WarehouseImportSidebar from './components/WarehouseImportSidebar.vue';
  import WarehouseImportModal from './components/WarehouseImportModal.vue';
  import ViewWarehouseImportModal from './components/ViewWarehouseImportModal.vue';
  import { deleteMaterialImportApi } from '@/api/sys/warehouse';
  import printJS from 'print-js';
  import { printPallet } from '@/api/sys/print';
  import { getToken } from '@/utils/auth';
  import FinishedProductImportModal from './components/FinishedProductImportModal.vue';
  import ViewFinishedProductImportModal from './components/ViewFinishedProductImportModal.vue';

  export interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const uploading = ref<boolean>(false);
  const info = ref();
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });
  const selectedRowKeys = ref<any[]>([]);
  const selectedPallets = ref<any[]>([]);
  const htmlContent = ref<IHtmlContent | null>(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const labelRef = ref<HTMLDivElement | null>(null);

  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerFinishedProductImportModal, { openModal: openFinishedProductImportModal }] =
    useModal();
  const [registerModal, { openModal }] = useModal();
  const [registerFPIModal, { openModal: openFPIModal }] = useModal();
  const warehouseStore = useWarehouseStore();
  const warehouse = ref<any[]>([]);
  const totalPage = ref<number>(0);
  const type = ref<number>(1);
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

  const rowSelection: any = computed(() => ({
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
  }));

  const [registerTable, { setPagination }] = useTable({
    // title: 'Quản lý lệnh nhập kho',
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
    rowSelection,
    // customRow: onRow,
  });

  function onSelectChange(keys, records) {
    selectedRowKeys.value = keys;
    const pallets =
      records?.reduce((acc, row) => {
        if (row?.items) {
          row.items.forEach((item) => {
            if (item?.pallets) {
              item.pallets.forEach((pallet) => {
                if (pallet?.id && !pallet?.parent_id) {
                  acc.push(pallet.id);
                }
              });
            }
          });
        }
        return acc;
      }, []) || [];
    if (pallets) selectedPallets.value = pallets;
  }

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchDataMaterial({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchDataMaterial({ page: page.value, pageSize: size, ...filter.value });
  }

  onMounted(() => {
    // fetchDataMaterial({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    if (type.value === 1) fetchDataMaterial(info);
    else fetchDataFinishedProduct(info);
  }

  async function fetchDataFinishedProduct(param: any = {}) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchOIFinishedProductImportApi(param);
      // Set data
      const warehouseData = response.data ?? [];
      console.log('data = ', warehouseData);
      warehouse.value = warehouseData?.map((item) => ({
        ...item,
        receipt_id: item.id,
        date_of_receipt: item?.import_date,
        entered_by: item?.user?.name,
        quantity: 0,
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

  async function fetchDataMaterial(param: any = {}) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchNVLWareHouseReceipt(param);
      // Set data
      const warehouseData = response.data ?? [];
      warehouse.value = warehouseData.map((warehouse) => ({
        ...warehouse,
        receipt_id: warehouse.id,
        date_of_receipt: warehouse?.receipt_date,
        entered_by: warehouse?.user?.name,
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
    info.value = values;
    if (values.type === 1) {
      type.value = 1;
      const payload: any = {};
      if (values?.material_receipt_id) payload.id = values.material_receipt_id;
      if (values?.receipt_date)
        payload.receipt_date = dayjs(values.receipt_date).format('YYYY-MM-DD');
      payload.created_by = values.created_by;
      if (values.canFetch === true)
        fetchDataMaterial({ page: page.value, pageSize: pageSize.value, ...payload });
    } else {
      type.value = 2;
      if (values.canFetch === true)
        fetchDataFinishedProduct({ page: page.value, pageSize: pageSize.value, ...values });
    }
  }

  function handleViewDetail(record: Recordable) {
    if (type.value === 1) openModal(true, { isUpdate: false, record, type: 1 });
    else openFPIModal(true, { isUpdate: false, record, type: 2 });
  }

  function handleCreate() {
    if (type.value === 1) openImportModal(true, { isUpdate: false });
    else openFinishedProductImportModal(true, { isUpdate: false });
  }

  function handleUpdate(record: Recordable) {
    setTimeout(() => {
      selectedRowKeys.value = [];
    }, 250);
    if (type.value === 1) openImportModal(true, { isUpdate: true, record, type: 1 });
    else openFinishedProductImportModal(true, { isUpdate: true, record, type: 2 });
  }

  async function handleDelete(record: Recordable) {
    setTimeout(() => {
      selectedRowKeys.value = [];
    }, 250);
    const response = await deleteMaterialImportApi(record?.id);
    if (response) {
      message.success('Thao tác thành công');
      handleSuccess();
    }
  }

  function handleSuccess(value?: any) {
    if (value?.type === 2) fetchDataFinishedProduct({ page: page.value, pageSize: pageSize.value });
    else fetchDataMaterial({ page: page.value, pageSize: pageSize.value });
  }

  async function handlePrint() {
    if (selectedPallets.value.length > 0) {
      try {
        loading.value = true;
        const response: IHtmlContent = await printPallet({
          pallet_ids: selectedPallets.value,
        });
        if (response) {
          htmlContent.value = response;
          setTimeout(async () => {
            if (!labelRef.value || !htmlContent.value?.html) return;
            const style: string = `
            @page {
              size: ${htmlContent.value?.width}mm ${htmlContent.value?.height}mm;
              margin: 0;
            }
            @media print {
              .label-print {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100% !important;
                height: 100% !important;
              }
            }
          `;
            printJS({
              printable: labelRef.value.outerHTML,
              type: 'raw-html',
              targetStyles: ['*'],
              style,
            });
          }, 500);
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        loading.value = false;
      }
    } else message.info('Không tìm thấy mã Pallet!');
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
