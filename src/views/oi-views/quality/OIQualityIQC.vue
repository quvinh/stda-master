<template>
  <div class="h-screen p-1">
    <Row :gutter="[8, 8]">
      <Col span="24" class="section-top">
        <Row :gutter="[8, 8]">
          <Col :span="8" :xs="24" :sm="8">
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
                      :options="[{ label: 'QC', value: 'QC' }]"
                      class="oi-select"
                      optionFilterProp="label"
                      showSearch
                      defaultValue="QC"
                      disabled
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
                    <span>Line</span>
                  </Col>
                  <Col :span="14">
                    <Select
                      :loading="loading"
                      :options="[
                        { label: 'Tách bài', value: 'dd' },
                        { label: 'IQC', value: 'iqc' },
                        { label: 'PQC', value: 'pqc' },
                        { label: 'OQC', value: 'oqc' },
                      ]"
                      class="oi-select"
                      defaultValue="iqc"
                      @change="handleQCChange"
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
              :dataSource="dataTop"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 500 }"
            />
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="section-button">
        <Input
          class="w-full"
          placeholder="NHẬP MÃ HOẶC QUÉT QR"
          @press-enter="handleInputEnter"
          v-model:value="inputValue"
        >
          <template #prefix>
            <div class="cursor-pointer" @click="handelOpenScannerModal">
              <Icon icon="ant-design:qrcode-outlined" />
            </div>
          </template>
        </Input>
      </Col>
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="21" :xs="24" :sm="21" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddle"
              :dataSource="dataMiddle"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 700 }"
            />
          </Col>
          <Col :span="3" :xs="24" :sm="3">
            <div class="flex flex-row md:flex-col justify-around h-full gap-1">
              <Button
                :loading="loading"
                type="primary"
                block
                class="oi-row-button h-full"
                @click="handleCheck"
              >
                Kiểm tra chỉ tiêu
              </Button>
              <Button type="primary" block class="h-full" @click="handleOpenNGInputModal">
                <Icon icon="ant-design:edit-outlined" />
                Nhập SL NG
              </Button>
            </div>
          </Col>
        </Row>
      </Col>
      <!-- <Col :span="24" class="section-button">
        <div class="flex justify-between items-center gap-1">
          <DatePicker
            :value="dayjs()"
            format="DD/MM/YYYY"
            :allow-clear="false"
            size="small"
            class="w-full"
          />
          <DatePicker
            :value="dayjs()"
            format="DD/MM/YYYY"
            :allow-clear="false"
            size="small"
            class="w-full"
          />
        </div>
      </Col> -->
      <Col :span="24" class="bg-white">
        <Table
          class="table-production"
          size="small"
          :loading="loading"
          :columns="columnsBottom"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{ x: 1300, y: oiTableHeight('table-production', windowHeight) }"
          rowKey="id"
          :customRow="onRow"
          :rowClassName="rowClassName"
        />
      </Col>
    </Row>
    <OIQualityIQCModal
      :width="500"
      :draggable="false"
      :maskClosable="true"
      @register="registerModal"
      @success="handleSuccess"
    />
    <ScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerModal"
      @success="handleScannerSuccess"
    />
    <NGInputModal
      :width="500"
      :draggable="false"
      :maskClosable="true"
      @register="registerNGINputModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { IEquipment } from '@/api/model/IEquipment';
  import { IProcess } from '@/api/model/IProcess';
  import { searchPalletsApi } from '@/api/sys/warehouse';
  import { useModal } from '@/components/Modal';
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { useProcessStore } from '@/store/modules/states/process';
  import { ISelectOption } from '@/store/types/pagination';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { Button, Col, Input, message, Row, Select, Table } from 'ant-design-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { columnsBottom, columnsMiddle, columnsTop } from './components/tableOIQualityIQC';
  import { useGo } from '@/hooks/web/usePage';
  import Icon from '@/components/Icon/Icon.vue';
  import ScannerModal from './components/ScannerModal.vue';
  import OIQualityIQCModal from './components/OIQualityIQCModal.vue';
  import NGInputModal from './components/NGInputModal.vue';
  import { oiSummaryIQC } from '@/api/sys/summary';
  import { searchInspectionCriteriaApi } from '@/api/sys/inspection-criteria';

  const go = useGo();
  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const oiHeaderStore = useOIHeaderStore();
  const windowHeight = ref<number>(window.innerHeight);
  const [registerModal, { openModal }] = useModal();
  const page = ref<number>(1);

  const loading = ref<boolean>(false);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<ISelectOption[]>([]);
  const inputValue = ref();
  const criteria = ref<any[]>([]);
  const processSelected = ref<any>();
  const equipmentSelected = ref<any>();
  const [registerScannerModal, { openModal: openScannerModal }] = useModal();
  const [registerNGINputModal, { openModal: openNGInputModal }] = useModal();

  const dataMiddle = ref<any[]>([]);
  const dataTop = ref<any[]>([
    {
      total: 0,
      lot_ok: 0,
      percent_ng: 0,
    },
  ]);
  const dataBottom = ref<any[]>([]);

  onMounted(() => {
    oiHeaderStore.setTitle('QUẢN LÝ IQC');
    fetchProcess();
    fetchEquipment();
    fetchOISummaryIQC();
    fetchPallet();
    fetchCriteria();
  });

  function onRow(record: any) {
    return {
      onClick: () => {
        dataMiddle.value = [record];
      },
    };
  }

  function handleCheck() {
    if (dataMiddle.value.length > 0) {
      openModal(true, {
        data: dataMiddle.value[0],
        criteria: criteria.value,
      });
    } else message.info('KHÔNG CÓ PHIẾU NÀO ĐỂ KIỂM TRA');
  }

  async function handelOpenScannerModal() {
    // Request camera permissions
    await requestCameraPermissions();

    openScannerModal(true, {});
  }

  function handleSuccess() {
    fetchOISummaryIQC();
    fetchPallet();
    dataMiddle.value = [];
  }

  async function fetchProcess() {
    loading.value = true;
    const response = await processStore.search();
    if (response?.data) {
      processOptions.value = response.data?.map((item: IProcess) => ({
        label: item.id,
        value: item.id,
      }));
      if (processOptions.value.length > 0) processSelected.value = processOptions.value[0].value;
    }
    loading.value = false;
  }

  async function fetchCriteria(param: any = {}) {
    loading.value = true;
    param.process_id = 'iqc';
    param.evaluation_method = 'pass_fail';
    const response: any = await searchInspectionCriteriaApi(param);
    if (response?.data) {
      console.log(response.data);
      criteria.value = response.data || [];
    }
    loading.value = false;
  }

  async function fetchEquipment(params: any = {}) {
    loading.value = true;
    const response = await equipmentStore.search(params);
    if (response?.data) {
      equipmentOptions.value = response.data?.map((item: IEquipment) => ({
        label: item.id,
        value: item.id,
      }));
      if (equipmentOptions.value.length > 0) {
        equipmentSelected.value = equipmentOptions.value[0].value;
      }
    }
    loading.value = false;
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

  async function fetchPallet() {
    try {
      loading.value = true;
      const response: any = await searchPalletsApi({
        page: page.value,
        pageSize: 20,
        is_parent: true,
      });
      if (response?.data) {
        console.log(response.data);
        dataBottom.value = (response.data || [])
          // .filter((item) => item.is_separated === 0)
          .map((item) => ({
            ...item,
            supplier: item.material_receipt_item?.supplier?.supplier_name,
            unit1: item.unit1?.unit_name,
            unit2: item.unit2?.unit_name,
          }));
        sortDataBottom();
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchOISummaryIQC() {
    const res = await oiSummaryIQC();
    if (res) {
      const { not_checked, sum_ok, sum_ng } = res;
      const checked: number = Number(sum_ok) + Number(sum_ng);
      const percent_ng: number = checked
        ? Number(((Number(sum_ng) / checked) * 100).toFixed(2))
        : 0;
      dataTop.value = [{ not_checked, sum_ok, sum_ng, checked, percent_ng }];
    }
  }

  function handleQCChange(value) {
    switch (value) {
      case 'qc':
        go('/oi/quality');
        break;
      case 'dd':
        go('/oi/quality-dd');
        break;
      case 'iqc':
        go('/oi/quality-iqc');
        break;
      case 'pqc':
        go('/oi/quality-pqc');
        break;
      case 'oqc':
        go('/oi/quality-oqc');
        break;
      default:
        break;
    }
  }

  function handleScannerSuccess(value) {
    dataMiddle.value = [];
    dataMiddle.value.push({
      ...value.data,
      unit1: value.data.unit1?.unit_name,
      result: 'Chưa kiểm',
    });
  }

  function handleOpenNGInputModal() {
    if (dataMiddle.value?.length > 0) {
      openNGInputModal(true, {
        data: dataMiddle.value[0],
      });
    }
  }

  function rowClassName(record) {
    const result = record?.quality_check?.status;
    switch (String(result).toUpperCase()) {
      case 'OK':
        return 'table-row-grey';
      case 'NG':
        return 'table-row-red';
      default:
        return '';
    }
  }

  function sortDataBottom() {
    dataBottom.value.sort((a, b) => {
      const priority = (record: any) => {
        if (
          record?.quality_check?.result === null ||
          record?.quality_check?.result === 'Chưa kiểm'
        ) {
          return 3;
        } else if (record?.quality_check?.result === 'OK') {
          return 2;
        } else if (record?.quality_check?.result === 'NG') {
          return 1;
        }
        return 0;
      };

      return priority(a) - priority(b);
    });
  }

  async function handleInputEnter(e: any) {
    try {
      loading.value = true;
      const response: any = await searchPalletsApi({
        id: e.target.value,
        page: page.value,
        pageSize: 20,
      });
      if (response?.data) {
        dataMiddle.value = [];
        dataMiddle.value.push({
          ...response.data[0],
          unit1: response.data[0].unit1?.unit_name,
          result: 'Chưa kiểm',
        });
      }
    } catch (error) {
      console.error(error.error);
    } finally {
      loading.value = false;
    }
  }
</script>
