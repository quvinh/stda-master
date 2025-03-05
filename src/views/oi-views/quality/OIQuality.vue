<template>
  <div class="h-screen p-1">
    <div class="flex justify-end items-center">
      <BreadcrumbQuality title="QUẢN LÝ CHẤT LƯỢNG" key-active="qc" />
    </div>
    <Row :gutter="[8, 8]">
      <Col :span="8" :xs="24" :sm="8" class="section-top">
        <Row style="height: 100%" class="bg-white">
          <Col :span="24">
            <Row style="height: 100%">
              <Col
                :span="10"
                class="oi-bg-blue flex justify-center items-center text-white border-b border-white"
              >
                <span>Công đoạn</span>
              </Col>
              <Col :span="14">
                <Select
                  :loading="loading"
                  :options="processOptions"
                  :value="processSelected"
                  class="oi-select"
                  optionFilterProp="label"
                  showSearch
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
                  showSearch
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
          :columns="columnsTopTK"
          :dataSource="[
            {
              kh_ngay: 1000,
              kh_thoi_diem: 100,
              sx_thoi_diem: 90,
              percent: 90,
            },
          ]"
          :bordered="true"
          :pagination="false"
          :locale="{ emptyText: '&nbsp' }"
          :scroll="{ x: 800 }"
        />
      </Col>
      <Col :span="24" class="flex flex-nowrap overflow-x-auto bg-white gap-1 section-button">
        <Button type="primary" size="small" block
          ><Icon icon="ant-design:edit-outlined" /> Nhập SL NG</Button
        >
        <Button type="primary" size="small" block @click="handleOpenScanner"
          ><Icon icon="ant-design:qrcode-outlined" /> Quét QR</Button
        >
      </Col>
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="24" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddleTK"
              :dataSource="dataMiddle"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 1500 }"
            >
              <template #bodyCell="{ column }">
                <template v-if="column.dataIndex === 'print'">
                  <Button size="small" type="primary" block
                    ><Icon icon="ant-design:printer-outlined"
                  /></Button>
                </template>
              </template>
            </Table>
          </Col>
          <Col :span="24" class="flex flex-nowrap overflow-x-auto bg-white gap-1 section-button">
            <Button type="primary" size="small" block @click="handleCheck">Thông tin SP</Button>
            <Button type="primary" size="small" block @click="handleCheck">Màu sắc</Button>
            <Button type="primary" size="small" block @click="handleCheck">Ngoại quan</Button>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white">
        <Table
          class="table-production"
          size="small"
          :loading="loading"
          :columns="columnsBottomTK"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{ x: 1500, y: oiTableHeight('table-production', windowHeight) }"
          rowKey="id"
          @row-click="handleRowClick"
        />
      </Col>
    </Row>
    <OIQualityModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
    <OIScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerModal"
      @success="handleScanSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { IEquipment } from '@/api/model/IEquipment';
  import { IProcess } from '@/api/model/IProcess';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { useProcessStore } from '@/store/modules/states/process';
  import { ISelectOption } from '@/store/types/pagination';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { Button, Col, message, Row, Select, Table } from 'ant-design-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import BreadcrumbQuality from './components/BreadcrumbQuality.vue';
  import OIQualityModal from './components/OIQualityIQCModal.vue';
  import OIScannerModal from './components/OIScannerModal.vue';
  import { columnsBottomTK, columnsMiddleTK, columnsTopTK } from './components/tableOIQualityOQC';

  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const oiHeaderStore = useOIHeaderStore();
  const windowHeight = ref<number>(window.innerHeight);
  const [registerModal, { openModal }] = useModal();
  const [registerScannerModal, { openModal: openScannerModal }] = useModal();

  const loading = ref<boolean>(false);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);
  const processSelected = ref<any>();
  const equipmentSelected = ref<any>();

  const dataMiddle = ref<any[]>([
    {
      po: 'PO002',
      pallet_lot: 'L01',
      product_id: 'DW6P05801',
      product_name: 'HỘP',
      quantity: 1000,
      actual_quantity: '',
      percent: '',
    },
  ]);
  const dataBottom = ref<any[]>([]);

  onMounted(() => {
    oiHeaderStore.setTitle('QUẢN LÝ CHẤT LƯỢNG');
    fetchProcess();
  });

  function handleRowClick(record) {
    console.log(record);
  }

  function handleCheck() {
    if (dataMiddle.value.length > 0) {
      // Fetch criteria
      openModal(true, {
        criteria: [
          {
            id: 1,
            criteria_name: 'Chi tiêu 1',
            description: null,
            acceptablerange: 'OK/NG',
            process_id: null,
            relationship_id: null,
            model: null,
            category: null,
          },
          {
            id: 2,
            criteria_name: 'Chi tiêu 2',
            description: null,
            acceptablerange: 'OK/NG',
            process_id: null,
            relationship_id: null,
            model: null,
            category: null,
          },
          {
            id: 3,
            criteria_name: 'Chi tiêu 3',
            description: null,
            acceptablerange: 'OK/NG',
            process_id: null,
            relationship_id: null,
            model: null,
            category: null,
          },
        ],
      });
    } else message.info('CHƯA QUÉT MÃ LÔ');
  }

  async function handleOpenScanner() {
    if (equipmentSelected.value) {
      // Request camera permissions
      await requestCameraPermissions();

      openScannerModal(true, { equipment_id: equipmentSelected.value });
    } else message.error('KHÔNG TÌM THẤY MÁY');
  }

  function handleSuccess() {}

  function handleScanSuccess(result) {
    dataMiddle.value = [result];
  }

  async function fetchProcess() {
    loading.value = true;
    const response = await processStore.search();
    if (response?.data) {
      processOptions.value = response.data?.map((item: IProcess) => ({
        label: item.id,
        value: item.id,
      }));
      if (processOptions.value.length > 0) {
        processSelected.value = processOptions.value[0].value;
        fetchEquipment({ process_id: processOptions.value[0].value });
      }
    }
    loading.value = false;
  }

  async function fetchEquipment(params: any = {}) {
    loading.value = true;
    const response = await equipmentStore.search(params);
    if (response?.data) {
      equipmentOptions.value = response.data?.map((item: IEquipment) => ({
        label: item.equipment_name,
        value: item.id,
      }));
      if (equipmentOptions.value.length > 0)
        equipmentSelected.value = equipmentOptions.value[0].value;
    }
    loading.value = false;
  }

  function handleProcessChange(value) {
    processSelected.value = value;
    fetchEquipment({ process_id: value });
  }

  async function handleEquipmentChange(value) {
    equipmentSelected.value = value;
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });
</script>
