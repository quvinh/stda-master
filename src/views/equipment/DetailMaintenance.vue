<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <DetailMaintenanceSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] flex flex-col h-full">
      <div class="flex flex-col h-[calc(100%-4px)] gap-1">
        <div class="h-2/5 flex flex-col bg-white">
          <Card
            class="h-full border-gray-300 border-1"
            :bodyStyle="{ padding: '5px!important', height: '85%' }"
            size="small"
            title="Chi tiết trạng thái"
          >
            <template #extra>
              <div class="h-[28px] flex justify-between items-center">
                <div class="pe-2">
                  <Button
                    size="small"
                    type="primary"
                    class="mt-[4px]"
                    @click="exportMaintenanceData"
                    ><Icon icon="ant-design:download-outlined" /> Xuất dữ liệu</Button
                  >
                </div>
              </div>
            </template>
            <div class="h-full">
              <BasicTable @register="registerTable" />
            </div>
          </Card>
        </div>
        <div class="h-3/5 flex flex-col bg-white">
          <Card
            class="h-full border-gray-300 border-1"
            :bodyStyle="{ padding: '5px!important', height: '85%' }"
            size="small"
            title="Chi tiết kiểm tra"
          >
            <template #extra>
              <div class="h-[28px] flex justify-between items-center">
                <div class="pe-2">
                  <Space class="mt-[4px]">
                    <Button size="small" type="primary" @click="exportDetailMaintenanceData"
                      ><Icon icon="ant-design:download-outlined" /> Xuất dữ liệu</Button
                    >
                    <Button size="small" type="primary" @click="handleInputDetail"
                      ><Icon icon="ant-design:edit-outlined" /> Nhập kết quả</Button
                    >
                  </Space>
                </div>
              </div>
            </template>
            <div class="h-full">
              <BasicTable @register="registerDetailTable" />
            </div>
          </Card>
        </div>
      </div>
    </div>
    <DetailMaintenanceModal
      :width="600"
      :draggable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { Button, message, Space, Card } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import {
    getBasicColumns,
    getDetailColumns,
  } from './components/DetailMaintenance/tableDetailMaintenance';
  import DetailMaintenanceModal from './components/DetailMaintenance/DetailMaintenanceModal.vue';
  import DetailMaintenanceSidebar from './components/DetailMaintenance/DetailMaintenanceSidebar.vue';
  import dayjs from 'dayjs';
  import { useModal } from '@/components/Modal/src/hooks/useModal';
  import {
    getScheduledMaintenance,
    exportExcelData,
    exportDeatilExcelData,
  } from '@/api/sys/equipment-maintenance-schedules';
  import { downloadExcel } from '@/utils/downloadExcelData';

  const data = ref<any[]>([]);
  const dataDetail = ref<any[]>([]);

  const loading = ref<boolean>(false);
  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const selectedRowKey = ref<any>();
  const selectedRowDetailKey = ref<any>();

  const rowSelection: any = computed(() => ({
    type: 'radio',
    selectedRowKeys: [selectedRowKey.value],
    onChange: onSelectChange,
  }));

  const rowDetailSelection: any = computed(() => ({
    type: 'radio',
    selectedRowKeys: [selectedRowDetailKey.value],
    onChange: onSelectDetailChange,
  }));

  const [registerTable] = useTable({
    rowKey: 'equipment_id',
    dataSource: data,
    columns: getBasicColumns(),
    showIndexColumn: true,
    bordered: true,
    loading,
    pagination: false,
    isCanResizeParent: true,
    rowSelection: rowSelection,
    customRow: onRow,
  });

  const [registerDetailTable] = useTable({
    rowKey: 'id',
    dataSource: dataDetail,
    columns: getDetailColumns(),
    showIndexColumn: true,
    bordered: true,
    pagination: false,
    loading,
    isCanResizeParent: true,
    rowSelection: rowDetailSelection,
    customRow: onRowDetail,
  });

  const [registerModal, { openModal }] = useModal();

  // onMounted(() => {
  //   fetchData({ page: page.value, pageSize: pageSize.value });
  // });

  function onSelectChange(key: any) {
    console.log(key);

    if (key[0]) {
      selectedRowDetailKey.value = null;
      selectedRowKey.value = key[0];
    }
  }

  function onSelectDetailChange(key: any) {
    if (key[0]) {
      selectedRowDetailKey.value = key[0];
    }
  }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const res = await getScheduledMaintenance({ ...param, ...filter.value });
      data.value = res;
      const row: any = data.value.find((item) => item?.equipment_id === selectedRowKey.value);
      if (row?.details)
        dataDetail.value = row.details?.map((item, index) => ({
          key: index + 1,
          id: index + 1,
          process_id: row?.process_id,
          equipment_id: row?.equipment_id,
          maintenance_category_id: row?.maintenance_category_id,
          ...item,
        }));
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function onRow(record: any) {
    return {
      onClick: () => {
        selectedRowDetailKey.value = null;
        selectedRowKey.value = record?.equipment_id;
      },
    };
  }

  function onRowDetail(record: any) {
    return {
      onClick: () => {
        selectedRowDetailKey.value = record?.id;
      },
    };
  }

  function handleSidebarFilter(values) {
    filter.value = values;
    fetchData(values);
  }

  /**
   * @description handle success
   */
  function handleSuccess() {
    fetchData();
  }

  function handleInputDetail() {
    if (selectedRowDetailKey.value) {
      const record: any = dataDetail.value.find((item) => item?.id === selectedRowDetailKey.value);

      openModal(true, { record });
    } else {
      message.info('Vui lòng chọn chi tiết kiểm tra!');
    }
  }

  watch(
    () => ({ selectedRowKey: selectedRowKey.value, data: data.value }),
    (current) => {
      const row: any = current.data.find((item) => item?.equipment_id === current.selectedRowKey);
      if (row?.details)
        dataDetail.value = row.details?.map((item, index) => ({
          key: index + 1,
          id: index + 1,
          process_id: row?.process_id,
          equipment_id: row?.equipment_id,
          maintenance_category_id: row?.maintenance_category_id,
          ...item,
        }));
    },
  );

  async function exportMaintenanceData() {
    try {
      const response: any = await exportExcelData({ ...filter.value });
      const { data, type, file } = response;

      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }

      if (data && type && file) {
        downloadExcel(data, type, file);
      } else throw new Error('Thao tác thất bại');
    } catch (e) {
      message.error(e.message);
    }
  }

  async function exportDetailMaintenanceData() {
    try {
      const response: any = await exportDeatilExcelData({
        ...filter.value,
        equipment_id: selectedRowKey.value,
      });
      const { data, type, file } = response;

      try {
        if (data && type && file) {
          downloadExcel(data, type, file);
        } else message.error('Data invalid!');
      } catch (error) {
        console.log(error);
        message.error((error as Error).message);
      }

      if (data && type && file) {
        downloadExcel(data, type, file);
      } else throw new Error('Thao tác thất bại');
    } catch (e) {
      message.error(e.message);
    }
  }
</script>
