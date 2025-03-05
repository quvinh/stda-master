<template>
  <div class="flex pt-1 h-full">
    <!-- Sidebar query -->
    <div class="hidden lg:block w-[270px] mr-1">
      <MoldSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý khuôn"
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
            <Button size="small" :href="`${BACKEND_URL}/export-sample-file?class=Mold&binary=true`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-molds`"
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
      <MoldModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
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
  import { IMold } from '@/api/model/IMold';
  import { deleteMoldApi, exportExcelDataMoldApi, searchMoldApi } from '@/api/sys/mold';
  import { printMold } from '@/api/sys/print';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import printJS from 'print-js';
  import { computed, onMounted, ref, watch } from 'vue';
  import MoldModal from './components/MoldModal.vue';
  import MoldSidebar from './components/MoldSidebar.vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';
  import IAttribute from '@/api/model/IAttribute';
  import AttributeResource from '@/api/resource/AttributeResource';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const molds = ref<IMold[]>([]);
  const attributes = ref<IAttribute[]>([]);
  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const filter = ref<any>({});

  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);
  const selectedRowKeys = ref<any[]>([]);

  const rowSelection: any = computed(() => ({
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
  }));

  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);
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

  onMounted(async () => {
    fetchData();
  });

  const columns = ref<any[]>([]);

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination, setColumns }] = useTable({
    dataSource: molds,
    columns: columns.value,
    useSearchForm: false,
    actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    bordered: true,
    loading,
    rowSelection,
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

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      await updateAttributes();
      const response = await searchMoldApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });

      molds.value = (response.data || []).map((item) => ({ ...item, key: item?.id }));
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = molds.value.length;
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

  async function updateAttributes() {
    await AttributeResource.getAll<IAttribute>({ model: 'mold' }).then((res) => {
      if (res.success) {
        attributes.value = res.data.data;
      }
    });
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
      const result = await deleteMoldApi(record?.id);
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
   * @param result
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
      selectedRowKeys.value = [];
    }
  }

  async function exportData() {
    try {
      const response: any = await exportExcelDataMoldApi();
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
      message.error(e.message);
    }
  }

  async function handlePrint() {
    try {
      loading.value = true;
      const response: IHtmlContent = await printMold({
        ids: selectedRowKeys.value,
      });
      if (response) {
        htmlContent.value = response;

        setTimeout(async () => {
          if (!labelRef.value || !htmlContent.value?.html) {
            return;
          }

          // size: ${htmlContent.value?.width}mm ${htmlContent.value?.height}mm;
          const style: string = `
            @page {
              size: A4;
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
  }

  function handleSidebarFilter(values: any) {
    // set page to 1 when filter
    page.value = 1;
    filter.value = values;
    fetchData({ ...values });
  }

  function onSelectChange(keys) {
    selectedRowKeys.value = keys;
  }

  watch(
    () => attributes.value,
    (newVal) => {
      setColumns(getBasicColumns(newVal));
    },
  );
</script>
