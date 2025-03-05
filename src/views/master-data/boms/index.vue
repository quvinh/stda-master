<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <BomsSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>

    <!-- Content -->
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-full border-gray-300 border-1"
        :bodyStyle="{ padding: '5px!important', height: 'calc(100% - 60px) !important' }"
        size="small"
        title="Quản lý BOM"
      >
        <template #extra>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/BOM.xlsx`">
              <Icon icon="ant-design:download-outlined" />
              File upload mẫu
            </Button>
            <Upload
              :action="`${BACKEND_URL}/api/v1/import-boms`"
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
            <!-- <Button size="small" type="primary" @click="exportData">
              <Icon icon="ant-design:file-excel-outlined" />
              Xuất Excel
            </Button> -->
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
      <BomsModal
        :width="800"
        :draggable="false"
        @register="registerModal"
        @success="handleSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IBoms } from '@/api/model/IBoms';
  import { deleteBomApi, searchBomApi } from '@/api/sys/boms';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { pageSizeOptions } from '@/enums/paginationEnum';
  import { IPagination } from '@/store/types/pagination';
  import { getToken } from '@/utils/auth';
  import { Button, Card, message, Space, Upload } from 'ant-design-vue';
  import { PaginationProps } from 'ant-design-vue/lib';
  import { onMounted, ref } from 'vue';
  import { getActionColumn, getBasicColumns } from './components/tableData';
  import BomsModal from './components/BomsModal.vue';
  import BomsSidebar from './components/BomsSidebar.vue';
  // import BomsRevisionHistoryModal from './components/BomsRevisionHistoryModal.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const boms = ref<IBoms[]>([]);

  const loading = ref<boolean>(false);
  const uploading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(25);
  const totalPage = ref<number>(0);
  const filter = ref<any>({});
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
  // const [registerRevisionHistoryModal, { openModal: openRevisionHistoryModal }] = useModal();
  const [registerTable, { setPagination }] = useTable({
    dataSource: boms,
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
    fetchBoms();
  });

  function pageChange(p, pz) {
    page.value = p;
    pageSize.value = pz;
    fetchBoms();
  }

  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetchBoms();
  }

  async function fetchBoms(param: any = {}) {
    try {
      loading.value = true;
      const response: any = await searchBomApi({
        page: page.value,
        pageSize: pageSize.value,
        ...filter.value,
        ...param,
      });
      // Set data
      boms.value = response.data ?? [];
      // Set pagination
      const pagination: IPagination = response?.pagination ?? null;
      let totalRecord = boms.value.length;
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

  function handleUploadChange(info: any) {
    try {
      console.log(info.file);
      if (info.file.status === 'uploading') {
        uploading.value = true;
      } else {
        if (info.file.status === 'done') {
          if (!info.file?.response?.success)
            throw new Error(
              info.file?.response?.message ?? `${info.file.name} - Thực hiện thất bại`,
            );
          message.success(`${info.file.name} - Upload thành công`);
          fetchBoms();
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
      const result = await deleteBomApi(record?.id);
      if (result) {
        fetchBoms();
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
    fetchBoms();
  }

  // function handleOpenRevisionHistoryModal(record) {
  //   openRevisionHistoryModal(true, {
  //     isUpdate: false,
  //     record,
  //   });
  // }

  function handleSidebarFilter(values: any) {
    filter.value = values;
    fetchBoms({ ...values });
  }
</script>
