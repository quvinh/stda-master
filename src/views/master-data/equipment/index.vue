<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý thiết bị"
      >
        <template #extra>
          <Space>
            <Button
              @click="handlePrint"
              :disabled="selectedRowKeys.length > 0 ? false : true"
              size="small"
              type="primary"
              ><Icon icon="ant-design:printer-outlined" /> In Tem</Button
            >
            <Button size="small" :href="`${BACKEND_URL}/excel/equipment_data.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-equipments`"
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
      <EquipmentModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>

    <div class="hidden">
      <div ref="labelRef">
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IEquipment } from '@/api/model/IEquipment';
  import { deleteEquipmentApi, exportEquipmentApi, searchEquipmentApi } from '@/api/sys/equipment';
  import { printBasic } from '@/api/sys/print';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import printJS from 'print-js';
  import { computed, onMounted, ref } from 'vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';
  import EquipmentSidebar from './components/EquipmentSidebar.vue';
  import EquipmentModal from './components/EquipmentModal.vue';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const equipmentParameter = ref<IEquipment[]>([]);
  const filter = ref<any>({});
  const selectedRowKeys = ref<any[]>([]);

  const rowSelection: any = computed(() => ({
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
  }));

  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
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
    dataSource: equipmentParameter,
    columns: getBasicColumns(),
    useSearchForm: false,
    actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    rowSelection,
  });

  onMounted(() => {
    fetchEquipment();
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchEquipment({ page: p, pageSize: pz });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchEquipment({ page: page.value, pageSize: size });
  }

  async function fetchEquipment(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchEquipmentApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });

      // Set data
      equipmentParameter.value = response.data ?? [];
      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = equipmentParameter.value.length;
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
      const result = await deleteEquipmentApi(record?.id);
      if (result) {
        fetchEquipment();
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
    fetchEquipment();
    selectedRowKeys.value = [];
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
          fetchEquipment();
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
      const response = await exportEquipmentApi(params);
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

  async function handlePrint() {
    try {
      loading.value = true;
      const response: IHtmlContent = await printBasic({
        ids: selectedRowKeys.value,
      });
      if (response) {
        htmlContent.value = response;
        setTimeout(async () => {
          if (!labelRef.value || !htmlContent.value?.html) {
            console.log('vao day');
            return;
          }

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
                font-size: 26px !important;
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
      selectedRowKeys.value = [];
    }
  }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchEquipment({ ...values });
  }

  function onSelectChange(keys) {
    selectedRowKeys.value = keys;
  }
</script>
