<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <SpecSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý thông tin sản phẩm (Spec)"
      >
        <template #extra>
          <Space>
            <Button
              size="small"
              :href="`${BACKEND_URL}/export-sample-file?class=SpecInstance&binary=true`"
            >
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-specs`"
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
      <SpecModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ISpec from '@/api/model/ISpec';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import dayjs from 'dayjs';
  import { onMounted, ref, watch } from 'vue';
  import SpecModal from './components/SpecModal.vue';
  import SpecSidebar from './components/SpecSidebar.vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import TableAction from '@/components/Table/src/components/TableAction.vue';
  import { deleteSpecApi, exportExcelDataSpec, searchSpecApi } from '@/api/sys/spec';
  import AttributeResource from '@/api/resource/AttributeResource';
  import IAttribute from '@/api/model/IAttribute';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const products = ref<ISpec[]>([]);
  const uploading = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);
  const attributes = ref<IAttribute[]>([]);
  const paginationProp = ref<PaginationProps | any>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: page,
    total: totalPage,
    pageSizeOptions,
    showTotal: (totalPage: number) => `Tổng ${totalPage} bản ghi`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setPagination, setColumns }] = useTable({
    dataSource: products,
    columns: getBasicColumns(),
    useSearchForm: false,
    actionColumn: getActionColumn(),
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
  });
  async function updateAttributes() {
    await AttributeResource.getAll<IAttribute>({ model: 'spec_instance' }).then((res) => {
      if (res.success) {
        attributes.value = res.data.data;
      }
    });
  }

  onMounted(() => {
    fetchSpec();
  });

  function pageChange(p: number, pz: number) {
    page.value = p;
    pageSize.value = pz;
    fetchSpec({ page: p, pageSize: pz, ...filter.value });
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchSpec({ page: page.value, pageSize: size, ...filter.value });
  }

  async function fetchSpec(param: any = {}) {
    try {
      loading.value = true;
      await updateAttributes();
      const response: any = await searchSpecApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      // Set data
      const specData = response.data ?? [];
      products.value = specData;
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

  watch(
    () => attributes.value,
    (newVal) => {
      setColumns(getBasicColumns(newVal));
    },
  );

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
      const result = await deleteSpecApi(record?.id);
      if (result) {
        await fetchSpec();
        message.success('Thao tác thành công');
      } else {
        message.error('Thao tác thất bại');
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  function handleSuccess() {
    fetchSpec();
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
          fetchSpec();
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
      const response: any = await exportExcelDataSpec();
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
    page.value = 1;
    filter.value = values;
    fetchSpec(values);
  }
</script>
