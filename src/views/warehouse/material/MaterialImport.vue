<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <MaterialImportSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <!--          <Button type="primary" size="small" style="margin-right: 10px"-->
          <!--            ><Icon icon="ant-design:upload-outlined" /> Upload Excel</Button-->
          <!--          >-->
          <Button type="primary" size="small" @click="handleCreate"
            ><Icon icon="ant-design:plus-outlined" /> Tạo lệnh nhập</Button
          >
        </template>
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
      <MaterialImportModal
        :width="950"
        :draggable="false"
        @register="registerImportModal"
        @success="handleSuccess"
      />
      <ViewMaterialImportModal :width="800" :draggable="false" @register="registerModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IWarehouse } from '@/api/model/IWarehouse';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { IPagination } from '@/store/types/pagination';
  import { Button, message } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import dayjs from 'dayjs';
  import { onMounted, ref } from 'vue';
  import { getBasicColumns } from './components/tableDataMaterialImport';
  import MaterialImportSidebar from './components/MaterialImportSidebar.vue';
  import MaterialImportModal from './components/MaterialImportModal.vue';
  import ViewMaterialImportModal from './components/ViewMaterialImportModal.vue';
  import { deleteMaterialImportApi } from '@/api/sys/warehouse';

  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerModal, { openModal }] = useModal();
  const warehouseStore = useWarehouseStore();
  const warehouse = ref<IWarehouse[]>([]);
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

  const [registerTable, { setPagination }] = useTable({
    title: 'Quản lý phiếu nhập kho NVL',
    dataSource: warehouse,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
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

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value });
  });

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const response = await warehouseStore.searchNVLWareHouseReceipt(param);
      // Set data
      const warehouseData = response.data ?? [];
      warehouse.value = warehouseData.map((warehouse) => ({
        ...warehouse,
        receipt_id: warehouse.id,
        date_of_receipt: warehouse.receipt_date,
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
    const payload: any = {};
    if (values?.material_receipt_id) payload.id = values.material_receipt_id;
    if (values?.receipt_date)
      payload.receipt_date = dayjs(values.receipt_date).format('YYYY-MM-DD');
    fetchData({ page: page.value, pageSize: pageSize.value, ...payload });
  }

  function handleViewDetail(record: Recordable) {
    openModal(true, { record });
  }

  function handleCreate() {
    openImportModal(true, { isUpdate: false });
  }

  function handleUpdate(record: Recordable) {
    openImportModal(true, { isUpdate: true, record });
  }

  async function handleDelete(record: Recordable) {
    const response = await deleteMaterialImportApi(record?.id);
    if (response) {
      message.success('Thao tác thành công');
      handleSuccess();
    }
  }

  function handleSuccess() {
    fetchData({ page: page.value, pageSize: pageSize.value });
  }
</script>
