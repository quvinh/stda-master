<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <EquipmentMaintenancePlanSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full border-1 border-gray-300">
      <!-- <BasicTable @register="registerTable">
        <template #toolbar>
          <Space>
            <Button size="small" :href="`${BACKEND_URL}/excel/MaintenancePlan.xlsx`"
              ><Icon icon="ant-design:download-outlined" /> Tải excel mẫu</Button
            >
            <Upload
              action="/v1/import-maintenance-plan"
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
              <Button type="primary" size="small"
                ><Icon icon="ant-design:upload-outlined" /> Upload excel</Button
              >
            </Upload>
            <Button type="primary" size="small" @click="exportData"
              ><Icon icon="ant-design:download-outlined" /> Xuất excel</Button
            >
          </Space>
        </template>
        <Calendar />
      </BasicTable> -->
      <div class="top flex justify-between p-2">
        <div class="top_left">
          <span class="font-500 text-base">Kế hoạch bảo dưỡng thiết bị</span>
        </div>
        <div class="top_right flex gap-2">
          <Button size="small" :href="`${BACKEND_URL}/excel/MaintenancePlan.xlsx`"
            ><Icon icon="ant-design:download-outlined" /> Tải excel mẫu</Button
          >
          <Upload
            :action="`${BACKEND_URL}/api/v1/import-maintenance-plan`"
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
            <Button type="primary" size="small"
              ><Icon icon="ant-design:upload-outlined" /> Upload excel</Button
            >
          </Upload>
          <Button type="primary" size="small" @click="exportData"
            ><Icon icon="ant-design:download-outlined" /> Xuất excel</Button
          >
        </div>
      </div>
      <div class="calendar-container flex relative flex-col">
        <div class="flex w-full justify-center">
          <Button type="text" @click="moveToPreviousMonth">
            <template #icon>
              <LeftOutlined />
            </template>
          </Button>
          <div
            style="align-items: center"
            class="flex justify-center flex-col align-center ml-3 mr-3"
          >
            <span class="font-700 font-size-[18px]">{{ selectedMonth.format('MM-YYYY') }}</span>
            <!-- <DatePicker
              v-model:value="seletedMonth"
              class="invisible w-0 h-0 p-0"
              :onChange="(value) => (selectedMonth.value = value)"
              :picker="'month'"
              :showNow="true"
            /> -->
          </div>
          <Button type="text" @click="moveToNextMonth">
            <template #icon>
              <RightOutlined />
            </template>
          </Button>
        </div>
        <div class="relative">
          <Table
            :pagination="false"
            :columns="columnCalendar"
            :dataSource="generateCalendarData()"
            :bordered="true"
            :scroll="{ x: true, y: 'calc(100vh - 235px)' }"
            :size="'small'"
            :className="'table-calendar'"
            :rowClassName="'fixed-height'"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key !== 'week'">
                <div
                  class="relative w-[100%] flex flex-col"
                  style="height: calc((100vh - 235px) / 5)"
                >
                  <div class="relative h-[25px] flex">
                    <!-- <div className="editable-header">
                      <EditOutlined
                        :style="{ color: 'blue', fontSize: 18 }"
                        @click="
                          openModal(true, {
                            isUpdate: false,
                          })
                        "
                      />
                    </div> -->
                    <div
                      className="date-header"
                      :style="{ opacity: record[column.key]?.isOutOfMonth ? 0.5 : 1 }"
                    >
                      {{ record[column.key]?.date }}
                    </div>
                  </div>
                  <div class="maintaince-table relative h-[75px] flex mt-2">
                    <Table
                      v-show="record[column.key]?.data?.length"
                      :pagination="false"
                      :bordered="true"
                      :columns="columnsCell"
                      :dataSource="record[column.key]?.data"
                      size="small"
                      class="overflow-auto"
                    />
                  </div>
                </div>
              </template>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <EquipmentMaintenancePlanCloneModal
      :width="1000"
      :draggable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { exportExcelData, searchApi } from '@/api/sys/equipment-maintenance-plan';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { getToken } from '@/utils/auth';
  import { downloadExcel } from '@/utils/downloadExcelData';
  import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
  import { Button, message, Table, Upload } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { onMounted, ref } from 'vue';
  import EquipmentMaintenancePlanCloneModal from './components/EquipmentMaintenancePlan/EquipmentMaintenancePlanCloneModal.vue';
  import EquipmentMaintenancePlanSidebar from './components/EquipmentMaintenancePlan/EquipmentMaintenancePlanSidebar.vue';

  dayjs.extend(isoWeek);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const data = ref<any>();
  const uploading = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
  const pageSize = ref<number>(20);

  const [registerModal, { openModal }] = useModal();

  const columnCalendar: any = [
    {
      title: 'Tuần',
      dataIndex: 'week',
      key: 'week',
      align: 'center',
      width: 100,
    },
    {
      title: 'T2',
      dataIndex: 'monday',
      key: 'monday',
      align: 'center',
      width: 200,
    },
    {
      title: 'T3',
      dataIndex: 'tuesday',
      key: 'tuesday',
      align: 'center',
      width: 200,
    },
    {
      title: 'T4',
      dataIndex: 'wednesday',
      key: 'wednesday',
      align: 'center',
      width: 200,
    },
    {
      title: 'T5',
      dataIndex: 'thursday',
      key: 'thursday',
      align: 'center',
      width: 200,
    },
    {
      title: 'T6',
      dataIndex: 'friday',
      key: 'friday',
      align: 'center',
      width: 200,
    },
    {
      title: 'T7',
      dataIndex: 'saturday',
      key: 'saturday',
      align: 'center',
      width: 200,
    },
    {
      title: 'CN',
      dataIndex: 'sunday',
      key: 'sunday',
      align: 'center',
      width: 200,
    },
  ];

  const columnsCell: any = [
    {
      title: 'CĐ',
      dataIndex: 'process_name',
      align: 'center',
      width: 20,
      ellipsis: true,
    },
    {
      title: 'Máy',
      dataIndex: 'equipment_id',
      align: 'center',
      width: 30,
      ellipsis: true,
    },
    {
      title: 'KH',
      dataIndex: 'plan',
      align: 'center',
      width: 20,
    },
    {
      title: 'Còn lại',
      dataIndex: 'remain',
      align: 'center',
      width: 40,
    },
    {
      title: 'KQ',
      dataIndex: 'done',
      align: 'center',
      width: 20,
    },
  ];

  const selectedMonth = ref<Dayjs>(dayjs());
  const moveToPreviousMonth = () => {
    selectedMonth.value = selectedMonth.value.subtract(1, 'month');
    fetchData();
  };
  const moveToNextMonth = () => {
    selectedMonth.value = selectedMonth.value.add(1, 'month');
    fetchData();
  };
  const generateCalendarData = () => {
    const startOfMonth = selectedMonth.value.startOf('month');
    const endOfMonth = selectedMonth.value.endOf('month');
    const startOfWeek = startOfMonth.isoWeekday(1);
    const endOfWeek = endOfMonth.isoWeekday(7);

    let currentWeekStart = startOfWeek;
    const dataSource = [];
    let weekCounter = selectedMonth.value.week();

    const maintenanceData = data.value;

    while (currentWeekStart.isBefore(endOfWeek)) {
      const weekData = {
        key: weekCounter,
        week: `Tuần ${weekCounter}`,
        monday: {
          date: currentWeekStart.date(),
          isOutOfMonth:
            currentWeekStart.isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData ? maintenanceData[currentWeekStart.format('YYYY-MM-DD')] : null,
        },
        tuesday: {
          date: currentWeekStart.add(1, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(1, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(1, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(1, 'day').format('YYYY-MM-DD')]
            : null,
        },
        wednesday: {
          date: currentWeekStart.add(2, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(2, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(2, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(2, 'day').format('YYYY-MM-DD')]
            : null,
        },
        thursday: {
          date: currentWeekStart.add(3, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(3, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(3, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(3, 'day').format('YYYY-MM-DD')]
            : null,
        },
        friday: {
          date: currentWeekStart.add(4, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(4, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(4, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(4, 'day').format('YYYY-MM-DD')]
            : null,
        },
        saturday: {
          date: currentWeekStart.add(5, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(5, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(5, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(5, 'day').format('YYYY-MM-DD')]
            : null,
        },
        sunday: {
          date: currentWeekStart.add(6, 'day').date(),
          isOutOfMonth:
            currentWeekStart.add(6, 'day').isBefore(selectedMonth.value.startOf('month')) ||
            currentWeekStart.add(6, 'day').isAfter(selectedMonth.value.endOf('month')),
          data: maintenanceData
            ? maintenanceData[currentWeekStart.add(6, 'day').format('YYYY-MM-DD')]
            : null,
        },
      } as never;
      dataSource.push(weekData);
      currentWeekStart = currentWeekStart.add(1, 'week');
      weekCounter++;
    }

    return dataSource;
  };

  onMounted(() => {
    fetchData({ page: page.value, pageSize: pageSize.value });
  });

  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
    maintenanceType: data,
  });

  // function handleSearchInfoFn(info) {
  //   page.value = 1;
  //   fetchData(info);
  // }

  async function fetchData(param: any = {}) {
    try {
      loading.value = true;
      const res = await searchApi({ ...param, date: selectedMonth.value });
      data.value = res;
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSidebarFilter(values) {
    fetchData(values);
  }

  async function exportData() {
    try {
      const response: any = await exportExcelData();
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
      message.error('Error exporting processes:', e);
    }
  }

  function handleUploadChange(info: any) {
    try {
      if (info.file.status === 'uploading') {
        uploading.value = true;
      } else {
        console.log(info);
        if (info.file.status === 'done') {
          if (!info.file?.response?.success)
            throw new Error(info.file?.response?.data ?? `${info.file.name} - Thực hiện thất bại`);
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

  function handleSuccess(result: any) {
    console.log('result = ' + result);
  }
</script>

<style>
  .calendar-container {
    position: relative;
    width: 100%;
    overflow-x: auto;
  }

  .ant-picker-calendar-date {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
    border: 1px solid #636060 !important;
    border-bottom: none !important;
    border-left: none !important;
  }

  .week {
    border: 1px solid #636060 !important;
    border-bottom: none !important;
  }

  tr:last-child td .ant-picker-calendar-date {
    border-bottom: 1px solid #636060 !important;
  }

  .week-last {
    border-bottom: 1px solid #636060 !important;
  }

  .ant-picker-calendar .ant-picker-panel .ant-picker-body {
    padding: 30px 0;
  }

  .ant-picker-calendar.ant-picker-calendar-full .ant-picker-panel .ant-picker-body th {
    padding-inline-end: 0;
  }

  .ant-picker-calendar.ant-picker-calendar-full .ant-picker-calendar-date {
    height: 100px !important;
  }

  .date-header {
    display: flex;
    position: absolute;
    top: auto;
    right: 0;
    justify-content: space-between;
    margin-top: 2px;
  }

  .editable-header {
    display: flex;
    position: absolute;
    top: auto;
    left: 0;
    justify-content: space-between;
    height: 100%;
  }

  .maintaince-table table td {
    padding: 0 !important;
    font-size: 8px !important;
  }

  .maintaince-table table th {
    padding: 0 !important;
    font-size: 8px !important;
  }

  .maintaince-table .ant-table {
    margin-inline: 0 !important;
  }
</style>
