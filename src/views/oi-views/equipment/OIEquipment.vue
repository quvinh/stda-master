<template>
  <div class="h-screen p-2">
    <Row :gutter="[5, 5]">
      <Col span="24" class="section-top">
        <Row :gutter="[5, 5]">
          <Col :span="8" :xs="24" :sm="8">
            <Row style="height: 100%" class="bg-white">
              <Col :span="24">
                <Row style="height: 100%">
                  <Col
                    :span="10"
                    class="oi-bg-blue flex justify-center items-center text-white border-b border-white"
                  >
                    <span>Công đoạn </span>
                  </Col>
                  <Col :span="14">
                    <Select
                      :loading="loading"
                      :options="processOptions"
                      :value="processSelected"
                      class="oi-select"
                      optionFilterProp="label"
                      @change="handleProcessChange"
                    />
                  </Col>
                </Row>
              </Col>
              <Col :span="24">
                <Row style="height: 100%">
                  <Col
                    :span="10"
                    class="oi-bg-blue flex justify-center items-center text-white border-b border-white"
                  >
                    <span>Máy</span>
                  </Col>
                  <Col :span="14">
                    <Select
                      :loading="loading"
                      :options="equipmentOptions"
                      :value="equipmentSelected"
                      class="oi-select"
                      optionFilterProp="label"
                      @change="handleEquipmentChange"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col :span="16" :xs="24" :sm="16" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsTop"
              :dataSource="dataEquipmentOverview"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 500 }"
            />
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white h-full">
        <Tabs
          v-model:active-key="tabKey"
          class="custom-oi-tabs"
          size="small"
          defaultActiveKey="parameter"
          type="card"
          :animated="false"
          style="width: 100%"
          @change="() => loadTableData()"
        >
          <TabPane tab="Check list" key="check-list" v-if="false">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsCheckList"
              :dataSource="dataCheckList"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 900 }"
            />
          </TabPane>
          <TabPane tab="Thông số sản xuất" key="parameter">
            <Table
              class="table-equipment"
              size="small"
              :loading="loading"
              :columns="columnsEquipmentParameter"
              :dataSource="dataEquipmentParameter"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 500, y: tableHeight }"
            />
          </TabPane>
          <TabPane tab="Lỗi dừng máy" key="error">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsErrorEquipmentSelected"
              :dataSource="dataErrorEquipmentSelected"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 800 }"
              :rowKey="(record) => record.no"
              :locale="{ emptyText: ' ' }"
              :rowClassName="rowClassName"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <Button size="small" type="primary" @click="() => onButtonClick(record)"
                    >Nhập lỗi</Button
                  >
                </template>
              </template>
            </Table>
            <Table
              class="table-equipment"
              size="small"
              :loading="loading"
              :columns="columnsErrorEquipment"
              :dataSource="dataErrorEquipment"
              :bordered="true"
              :pagination="false"
              :scroll="{ y: tableHeight }"
              :rowKey="(record) => record.no"
              :customRow="customRow"
              :rowClassName="rowClassName"
            />
          </TabPane>
          <TabPane tab="Bảo dưỡng" key="maintenance" v-if="false">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsEquipmentMaintenance"
              :dataSource="dataEquipmentMaintenance"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 500 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <!-- Action: Bắt đầu -->
                  <Button
                    v-if="!record?.start_time"
                    size="small"
                    type="primary"
                    @click="() => handleSaveStartTime(record)"
                    >Bắt đầu</Button
                  >
                  <!-- Action: Nhập kết quả ghi nhận thời gian kết thúc bảo dưỡng -->
                  <Button
                    v-else-if="record?.start_time && !record?.end_time"
                    size="small"
                    type="primary"
                    @click="() => handleOpenMaintenanceModal(record)"
                    >Nhập kết quả</Button
                  >
                  <!-- Action: Nothing -->
                  <Button v-else size="small">Đã nhập</Button>
                </template>
              </template>
            </Table>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </div>
  <OIEquipmentModal
    :width="500"
    :draggable="false"
    @register="registerModal"
    @success="handleSuccess"
  />
  <OIMaintenanceModal
    :width="500"
    :draggable="false"
    @register="registerResultModal"
    @success="handleSuccess"
  />
</template>

<script lang="ts" setup>
  import { IEquipment } from '@/api/model/IEquipment';
  import { IProcess } from '@/api/model/IProcess';
  import { searchApi as searchEquipmentParameterLog } from '@/api/sys/equipment-parameter-log';
  import { searchErrorEquipmentLogApi } from '@/api/sys/error-equipment-log';
  import {
    searchApi as searchEquipmentMaintenance,
    updateApi as updateEquipmentMaintenance,
  } from '@/api/sys/equipment-maintenance-plan';
  import { useModal } from '@/components/Modal';
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useProcessStore } from '@/store/modules/states/process';
  import { ISelectOption } from '@/store/types/pagination';
  import { oiTableHeight } from '@/utils/helper/oiTable';
  import { Col, message, Row, Select, Table, TabPane, Tabs, Button } from 'ant-design-vue';
  import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
  import OIEquipmentModal from './components/OIEquipmentModal.vue';
  import {
    columnsEquipmentParameter,
    columnsErrorEquipment,
    columnsErrorEquipmentSelected,
    columnsEquipmentMaintenance,
    columnsTop,
    columnsCheckList,
  } from './components/tableOIEquipment';
  import dayjs from 'dayjs';
  import OIMaintenanceModal from './components/OIMaintenanceModal.vue';
  import { getOiEquipmentOverview } from '@/api/sys/equipment';
  import { useTabStore } from '@/store/modules/states/oi/tab';
  import { searchErrorEquipmentApi } from '@/api/sys/error-equipment';

  const tabStore = useTabStore();

  const DEFAULT_TIME_OUT = 7000;

  const processValue = tabStore.getProcessSelected;
  const equipmentValue = tabStore.getEquipmentSelected;

  const [registerModal, { openModal }] = useModal();
  const [registerResultModal, { openModal: openResultModal }] = useModal();

  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const windowHeight = ref<number>(window.innerHeight);
  const tableHeight = ref<number | string>('55vh');

  const loading = ref<boolean>(false);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);
  const processSelected = ref<any>();
  const idSelected = ref<number>(-1);
  const equipmentSelected = ref<any>();
  const tabKey = ref<'parameter' | 'error' | 'maintenance' | 'check-list'>('parameter');
  const dataEquipmentOverview = ref<any[]>([]);
  const dataEquipmentParameter = ref<any[]>([]);
  const dataErrorEquipment = ref<any[]>([]);
  const dataErrorEquipmentSelected = ref<any[]>([{ id: null }]);
  const dataEquipmentMaintenance = ref<any[]>([]);
  const errorList = ref<{ label: string; value: string }[]>([]);
  const dataCheckList = ref<any[]>([
    {
      hang_muc: 'Kiểm tra nhiệt độ',
      cong_viec: 'Đo nhiệt độ',
      time: '15:33',
      date: '02/10',
      confirm_type: 'input',
      confirm: '27',
    },
    {
      hang_muc: 'Kiểm tra độ ẩm',
      cong_viec: 'Đo độ ẩm',
      time: '15:33',
      date: '02/10',
      confirm_type: 'input',
      confirm: '70',
    },
    {
      hang_muc: 'Kiểm tra nguồn điện',
      cong_viec: 'Kiểm tra nguồn điện',
      time: '16:33',
      date: '02/10',
      confirm_type: 'checkbox',
      confirm: 1,
    },
  ]);

  onMounted(() => {
    fetchProcess();
    loadTableData();
    const interval = setInterval(() => loadTableData(), DEFAULT_TIME_OUT);
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    // fetchErrorEquipment();
  });

  async function fetchProcess() {
    loading.value = true;
    const response = await processStore.search();
    if (response?.data) {
      processOptions.value = response.data?.map((item: IProcess) => ({
        label: item.id,
        value: item.id,
      }));
      if (processOptions.value.length > 0) {
        processSelected.value = processValue || processOptions.value[0].value;
        fetchEquipment({ process_id: processValue || processOptions.value[0].value }, 'load');
      }
    }
    loading.value = false;
  }

  async function fetchEquipment(params: any = {}, type: string) {
    loading.value = true;
    const response = await equipmentStore.search(params);
    if (response?.data) {
      equipmentOptions.value = response.data?.map((item: IEquipment) => ({
        label: item.id,
        value: item.id,
      }));
      if (equipmentOptions.value.length > 0) {
        if (type === 'load') {
          equipmentSelected.value = equipmentValue || equipmentOptions.value[0].value;
          fetchErrorEquipment({ equipment_id: equipmentValue || equipmentSelected.value });
        } else {
          equipmentSelected.value = equipmentOptions.value[0].value;
          loadTableData();
          fetchErrorEquipment({ equipment_id: equipmentSelected.value });
        }
        loadTableData();
      } else {
        equipmentSelected.value = '';
        tabStore.setEquipmentSelected('');
      }
    }
    loading.value = false;
  }

  onBeforeMount(() => {
    setTimeout(() => {
      tableHeight.value = oiTableHeight('table-equipment', windowHeight.value - 30) ?? '55vh';
      console.log(tableHeight.value);
    }, 300);
  });

  function handleProcessChange(value) {
    processSelected.value = value;
    tabStore.setProcessSelected(value);
    fetchEquipment({ process_id: value }, 'select');
  }

  async function handleEquipmentChange(value) {
    equipmentSelected.value = value;
    tabStore.setEquipmentSelected(value);
    await loadTableData({ equipment_id: value });
  }

  const customRow = (record: any) => {
    return {
      onClick: () => {
        idSelected.value = record.id;
        dataErrorEquipmentSelected.value = [record];
      },
      style: {
        cursor: 'pointer',
      },
    };
  };

  const rowClassName = () => {
    return ''; //Trả về tên class cho hàng tương ứng
  };

  async function fetchErrorEquipment(params = {}) {
    const response: any = await searchErrorEquipmentApi(params);
    const errorData = response.data;
    if (errorData) {
      errorList.value = errorData?.map((i) => ({
        value: i.id,
        label: i.error_equipment_name,
      }));
    }
  }

  const onButtonClick = (record: Recordable) => {
    if (record?.id) {
      openModal(true, {
        idSelected,
        errorList,
        isUpdate: true,
      });
    } else {
      message.info('VUI LÒNG CHỌN THỜI GIAN DỪNG');
    }
  };

  /**
   * @description load equipment overview
   */
  async function loadOverview(params: any = {}) {
    const response: any = await getOiEquipmentOverview(params);
    if (response) {
      dataEquipmentOverview.value = response || [];
    }
  }
  /**
   * @description load table
   */
  function loadTableData(params: any = {}) {
    try {
      loading.value = true;
      if (equipmentSelected.value) {
        const payload: any = {
          page: 1,
          pageSize: 20,
          // start_date: dayjs().format('YYYY-MM-DD'),
          // end_date: dayjs().format('YYYY-MM-DD'),
          equipment_id: equipmentSelected.value,
          ...params,
        };
        loadOverview(payload);
        switch (tabKey.value) {
          case 'check-list':
            //
            break;
          case 'parameter':
            loadEquipmentParameterLog(payload);
            break;
          case 'error':
            loadEquipmentErrorLog(payload);
            break;
          case 'maintenance':
            loadEquipmentMaintenance(payload);
            break;
          default:
            throw new Error('TabKey invalid');
        }
      } else {
        dataEquipmentOverview.value = [];
        dataEquipmentParameter.value = [];
        dataErrorEquipment.value = [];
        dataErrorEquipmentSelected.value = [{ id: null }];
        dataEquipmentMaintenance.value = [];
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description load data equipment-parameter-log
   * @param params
   */
  async function loadEquipmentParameterLog(params: any = {}) {
    const response: any = await searchEquipmentParameterLog(params);
    if (response) {
      dataEquipmentParameter.value = response || [];
    }
  }

  /**
   * @description load data equipment-error-log
   * @param params
   */
  async function loadEquipmentErrorLog(params: any = {}) {
    const formattedTime = dayjs().format('YYYY-MM-DD 00:00:00');
    const response: any = await searchErrorEquipmentLogApi({
      ...params,
      created_at: formattedTime,
    });
    if (response) {
      console.log(response);
      dataErrorEquipment.value = response?.map((i, index) => ({
        no: index + 1,
        id: i.id,
        stop_time: i.stop_time,
        start_time: i.start_time,
        error_equipment_id: i.error_equipment_id,
        error_equipment_name: i?.equipment_error?.error_equipment_name ?? null,
        reason: i.equipment_error?.reason ?? null,
        fix: i.equipment_error?.fix ?? null,
        protection_measures: i.equipment_error?.protection_measures ?? null,
      }));
    }
  }

  /**
   * @description load data equipment-maintenance
   * @param params
   */
  async function loadEquipmentMaintenance(params: any = {}) {
    const formattedTime = dayjs().format('YYYY-MM-DD 00:00:00');
    const response: any = await searchEquipmentMaintenance({ params, created_at: formattedTime });
    if (response?.data) {
      dataEquipmentMaintenance.value = response.data || [];
    }
  }

  /**
   * @description lưu thời gian bắt đầu
   * @param record
   */
  async function handleSaveStartTime(record: any) {
    // loading.value = true;
    const formattedTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const response = await updateEquipmentMaintenance({
      id: record.id,
      start_time: formattedTime,
    });
    if (response) loadEquipmentMaintenance();
  }

  function handleSuccess() {
    // loadEquipmentErrorLog();
    // loadEquipmentMaintenance();
    loadTableData();
    dataErrorEquipmentSelected.value = [{ id: null }];
  }

  /**
   * @description open modal - ghi nhận kết quả
   * @param record
   */
  function handleOpenMaintenanceModal(record: any) {
    openResultModal(true, {
      isUpdate: true,
      record,
    });
  }
</script>
