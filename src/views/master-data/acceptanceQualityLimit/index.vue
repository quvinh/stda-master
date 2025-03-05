<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space>
          <Button size="small" :href="`${BACKEND_URL}/excel/AcceptanceQualityLimit.xlsx`">
            <Icon icon="ant-design:download-outlined" /> File upload mẫu</Button
          >
          <Upload
            :action="`${BACKEND_URL}/api/v1/import-acceptance-quality-limit`"
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
          <a-button size="small" type="primary"
            ><Icon icon="ant-design:file-excel-outlined" /> Xuất Excel</a-button
          >
          <a-button type="primary" size="small" @click="handleCreate">
            <Icon icon="ant-design:plus-outlined" /> Tạo mới
          </a-button>
        </Space>
      </template>
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
    <AcceptanceQualityLimitModal
      :width="800"
      :draggable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getActionColumn, getBasicColumns, getFormConfig } from './components/tableData';
  import { useAcceptanceQualityLimitStore } from '@/store/modules/states/acceptanceQualityLimit';
  import { ICustomer } from '@/api/model/ICustomer';
  import { useModal } from '@/components/Modal';
  import { Button, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import AcceptanceQualityLimitModal from './components/AcceptanceQualityLimitModal.vue';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const acceptanceStore = useAcceptanceQualityLimitStore();
  const customers = ref<ICustomer[]>([]);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);

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

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    title: 'Tiêu chuẩn bốc mẫu',
    dataSource: customers,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    actionColumn: getActionColumn(),
    showTableSetting: true,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    handleSearchInfoFn,
  });

  onMounted(() => {
    // fetchData({ page: page.value, pageSize: pageSize.value });
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

  function handleSearchInfoFn(info) {
    page.value = 1;
    fetchData(info);
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const response = await acceptanceStore.search(param);
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
      const result = await acceptanceStore.delete(record?.id);
      if (result) {
        fetchData({ page: page.value, pageSize: pageSize.value });
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
    fetchData({ page: page.value, pageSize: pageSize.value });
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
          fetchData({ page: page.value, pageSize: pageSize.value });
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
