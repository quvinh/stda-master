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
                    <span>Công đoạn</span>
                  </Col>
                  <Col :span="14">
                    <Select
                      :loading="loading"
                      :options="processOptions"
                      :value="selectedProcessId"
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
                      v-model:value="selectedEquipmentId"
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
              class="h-full"
              size="small"
              :loading="loading"
              :columns="oiProductionTopColumns"
              :dataSource="Object.values(dataTop).length > 0 ? [dataTop] : []"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 600 }"
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
      <Col :span="24" :xs="24" :sm="24" class="bg-white section-middle">
        <Table
          size="small"
          class="color-white"
          :loading="loading"
          :columns="oiProductionMiddlecolumns"
          :dataSource="dataMiddle?.lot_id ? [dataMiddle] : []"
          :bordered="true"
          :pagination="false"
          :locale="{ emptyText: '&nbsp' }"
          :scroll="{ x: 1000 }"
        />
      </Col>
      <Col span="24" class="flex flex-row gap-1 w-full overflow-x-auto">
        <Button
          :loading="loading"
          type="primary"
          block
          @click="showModalInputQuantity"
          :disabled="!selfQcAble"
        >
          <Icon icon="ant-design:edit-outlined" size="20" />
          Nhập SL.NG
        </Button>

        <Button
          v-if="!iot_signal"
          :loading="loading"
          type="primary"
          block
          @click="showModalOKQuantity"
          :disabled="!editableOkQuantity"
        >
          <Icon icon="ant-design:edit-outlined" size="20" />
          {{ textInputOK.text }}
        </Button>

        <Button :loading="loading" type="primary" block>
          <Icon icon="ant-design:file-excel-outlined" size="20" />
          Y/c xuất kho
        </Button>

        <Button :loading="loading" type="primary" block @click="handlePrint">
          <Icon icon="ant-design:printer-outlined" size="20" />
          In
        </Button>

        <Button
          v-if="isPackagingProcess"
          :loading="loading"
          type="primary"
          block
          @click="handelOpenMergeModal"
        >
          <Icon icon="ant-design:merge-cells-outlined" size="20" />
          Tạo Pallet
        </Button>
      </Col>
      <Col :span="24" class="bg-white">
        <Table
          rowKey="id"
          class="table-production"
          size="small"
          :loading="loading"
          :columns="oiProductionBottomColumns"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{
            x: 1200,
            y: oiTableHeight(
              'table-production',
              windowHeight - 34 - (warningMessages.length > 0 ? 30 : 0),
            ),
          }"
          :rowClassName="rowClassName"
          :footer="renderFooter"
        />
      </Col>
    </Row>
    <InputQuantityModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerInputModal"
      @success="loadLotHistories"
    />
    <OKInputQuantityModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerOKInputModal"
      @success="loadLotHistories"
    />
    <ScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerModal"
      @success="onScannerReceiveValue"
    />

    <MergeLotModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerMergeModal"
    />

    <InputQuantityPrintModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerInputPrintModal"
      @success="loadLotHistories"
    />
  </div>
  <div class="hidden">
    <div ref="labelRef">
      <div v-html="htmlContent?.html"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IEquipment } from '@/api/model/IEquipment';
  import { IProcess } from '@/api/model/IProcess';
  import OiLotEntity from '@/api/model/OiManufacture/OiLotEntity';
  import ManufactureResource from '@/api/resource/ManufactureResource';
  import {
    getManufactureWarnings,
    getOiManufactureMiddle,
    getOiManufactureOverview,
    getOiManufactureRunningLotApi,
  } from '@/api/sys/production-plan';
  import { printPalletTemplate } from '@/api/sys/quality';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { useEquipmentStore } from '@/store/modules/states/equipment';
  import { useTabStore } from '@/store/modules/states/oi/tab';
  import { useProcessStore } from '@/store/modules/states/process';
  import { ISelectOption } from '@/store/types/pagination';
  import echo from '@/utils/echo';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { IHtmlContent } from '@/views/oi-views/warehouse/material/OIMaterialImport.vue';
  import { Button, Col, Input, message, Row, Select, Table } from 'ant-design-vue';
  import printJS from 'print-js';
  import { computed, h, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
  import InputQuantityModal from './components/InputQuantityModal.vue';
  import OKInputQuantityModal from './components/OKInputQuantityModal.vue';
  import ScannerModal from './components/ScannerModal.vue';
  import WarningSlider from './components/WarningSlider.vue';
  import {
    oiProductionBottomColumns,
    oiProductionMiddlecolumns,
    oiProductionTopColumns,
    OiProductionTopColumns,
  } from './components/tableOIProduction';
  import MergeLotModal from './components/MergeLotModal.vue';
  import InputQuantityPrintModal from './components/InputQuantityPrintModal.vue';

  import ApiResponse from '@/api/ApiResponse';
  import ILot from '@/api/model/ILot';
  import ILotHistory from '@/api/model/ILotHistory';
  import ILotPlan from '@/api/model/ILotPlan';
  import { isSafeForMappingApi } from '@/api/sys/equipment-tracker';
  import { ProcessType } from '@/enums/processType';

  const tabStore = useTabStore();

  interface DataMiddleProps {
    batch_code: string;
    lot_id: string;
    product_id: string;
    planned_quantity: number;
    actual_quantity: number;
    ng_quantity: number;
    batch_ng_quantity: number;
    customer_name: string | null;
    current_ng_quantity: number;
    status: string | null;
    instances: {
      lot: ILot;
      lot_history: ILotHistory;
      lot_plan: ILotPlan;
    };
  }

  const processStore = useProcessStore();
  const equipmentStore = useEquipmentStore();
  const isChecked = ref<boolean>(false);
  const windowHeight = ref<number>(window.innerHeight);
  const labelRef = ref<HTMLDivElement | null>(null);

  const [registerInputModal, { openModal: openInputModal }] = useModal();
  const [registerOKInputModal, { openModal: openOKInputModal }] = useModal();
  const [registerScannerModal, { openModal: openScannerModal }] = useModal();
  const [registerMergeModal, { openModal: openMergeModal }] = useModal();
  const [registerInputPrintModal, { openModal: openInputPrintModal }] = useModal();

  const inputValue = ref<string | undefined>();
  const loading = ref<boolean>(false);
  const htmlContent = ref<IHtmlContent | null>(null);
  const processOptions = ref<ISelectOption[]>([]);
  const equipmentOptions = ref<{ value: string; label: string; iot_signal: boolean }[]>([]);
  const selectedProcessId = ref<any>();
  const selectedEquipmentId = ref<IEquipment['id'] | undefined>();
  const iot_signal = ref<boolean>(false);
  const warningMessages = ref<string[]>([]);
  const lastWarning = ref<boolean>(false);
  const dataTop = ref<OiProductionTopColumns>({
    planned_quantity: 0,
    actual_quantity: 0,
    planned_percentage: 0,
    target_percentage: 0,
  });
  const dataMiddle = ref<DataMiddleProps | undefined>(undefined);
  const selfQcAble = computed<boolean>(() => {
    if (!dataMiddle.value?.lot_id) {
      return false;
    }
    const currentRecord = dataMiddle.value;
    const status = currentRecord?.status;
    if (!status) {
      return false;
    }
    return status === 'producing' || status === 'waiting_for_pqc' || status === 'waiting_for_print';
  });
  const dataBottom = ref<OiLotEntity[]>([]);
  const isScanningRef = ref<boolean>(true);

  const isPackagingProcess = computed(() => {
    return selectedProcessId.value === ProcessType.PACKING;
  });

  const textInputOK = computed<{ text: string; status: string }>(() => {
    if (dataMiddle.value?.lot_id) {
      const middle: any = dataMiddle.value;
      if (String(middle?.status) === 'waiting_for_fai') {
        return { text: 'Nhập SL thử bài', status: 'waiting_for_fai' };
      }
    }
    return { text: 'Nhập SL.OK', status: '' };
  });

  const editableOkQuantity = computed<boolean>(() => {
    if (iot_signal.value) {
      return false;
    }
    if (!dataMiddle.value?.lot_id) {
      return false;
    }
    const middle: any = dataMiddle.value;
    const status = middle?.status;
    return status === 'waiting_for_fai' || status === 'waiting_for_pqc' || status === 'producing';
  });

  onMounted(() => {
    loadEchoInit();
    fetchProcess();
  });

  onBeforeUnmount(() => {
    echo.leaveChannel('laravel_database_productionchannel');
  });

  function handleProcessChange(value: any) {
    selectedProcessId.value = value;
    tabStore.setProcessSelected(value);
    tabStore.setEquipmentSelected(null);
    dataMiddle.value = undefined;
    selectedEquipmentId.value = undefined;
    equipmentOptions.value = [];
    warningMessages.value = [];
    fetchEquipment({ process_id: value });
  }

  async function handleEquipmentChange(value) {
    selectedEquipmentId.value = value;
    tabStore.setEquipmentSelected(value);
    equipmentOptions.value.forEach((option) => {
      if (option.value === value) {
        iot_signal.value = option.iot_signal;
      }
    });
    dataTop.value = {
      planned_quantity: 0,
      actual_quantity: 0,
      planned_percentage: 0,
      target_percentage: 0,
    };
    dataMiddle.value = undefined;
    await loadLotHistories({ equipment_id: value });
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
        selectedProcessId.value = tabStore.getProcessSelected || processOptions.value[0].value;
        fetchEquipment({
          process_id: tabStore.getProcessSelected || processOptions.value[0].value,
        });
      }
    }
    loading.value = false;
  }

  async function fetchEquipment(params: any = {}) {
    loading.value = true;
    const response = await equipmentStore.search(params);
    if (response?.data) {
      equipmentOptions.value = response.data?.map((item) => ({
        label: item.id,
        value: item.id,
        iot_signal: item.iot_signal,
      }));
      if (response.data?.length > 0) {
        const first: IEquipment = response.data[0];
        if (tabStore.getEquipmentSelected) {
          selectedEquipmentId.value = tabStore.getEquipmentSelected;
          const getEquipment = response.data.find(
            (item) => item?.id === tabStore.getEquipmentSelected,
          );
          if (getEquipment) iot_signal.value = getEquipment?.iot_signal ?? false;
          loadLotHistories({
            equipment_id: tabStore.getEquipmentSelected,
          });
        } else {
          loadLotHistories({ equipment_id: first.id });
          tabStore.setEquipmentSelected(first.id);
          selectedEquipmentId.value = first.id;
          iot_signal.value = first.iot_signal;
        }
      } else {
        dataBottom.value = [];
      }
    }
    loading.value = false;
  }

  async function loadLotHistories(params: any = {}) {
    dataBottom.value = [];
    if (!params?.equipment_id) {
      params.equipment_id = selectedEquipmentId.value ?? null;
    }
    const response: any[] = await getOiManufactureRunningLotApi(params);
    if (response) {
      dataBottom.value = response || [];
    }

    const overviewResponse = await getOiManufactureOverview(params);
    if (overviewResponse) {
      dataTop.value = overviewResponse;
    }

    const middleResponse = await getOiManufactureMiddle(params);
    if (middleResponse) {
      dataMiddle.value = middleResponse;
    }

    const warningResponse = await getManufactureWarnings(params);
    if (warningResponse && Array.isArray(warningResponse) && warningResponse.length > 0) {
      warningMessages.value = warningResponse;
    }
  }

  async function handleInputEnter(e: any) {
    const value = e.target.value;
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        // Kiểm tra máy trong EquipmentTracker có đang sản xuất không?
        if (selectedEquipmentId.value) {
          const checkerResult = await isSafeForMapping(selectedEquipmentId.value);
          if (!checkerResult) {
            const { lot_id }: any = dataMiddle.value;
            message.warn(`LOT ${lot_id ?? 'TRƯỚC'} CHƯA HOÀN THÀNH!`);
            return;
          }
        }

        if (value) {
          const response: ApiResponse = await ManufactureResource.mappingOiManufactureLot({
            value,
            equipment_id: selectedEquipmentId.value,
          });

          if (response?.success) {
            await loadLotHistories({ equipment_id: selectedEquipmentId.value });
            lastWarning.value = false;
            inputValue.value = undefined;
          } else {
            console.warn('mappingOiManufactureLot không thành công.');
          }
        }
      } catch (error) {
        console.error('Lỗi khi gọi ManufactureResource.mappingOiManufactureLot:', error);
      }
    }
    setTimeout(() => {
      isScanningRef.value = true;
    }, 2500);
  }

  function showModalInputQuantity() {
    if (!dataMiddle.value?.lot_id) {
      message.error('Không có dữ liệu để nhập');
      return;
    }
    openInputModal(true, dataMiddle.value);
  }

  function showModalOKQuantity() {
    openOKInputModal(true, dataMiddle.value);
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

  function handleSidebarFilter(value) {
    isChecked.value = value;
  }

  async function handelOpenScannerModal() {
    // Request camera permissions
    await requestCameraPermissions();

    openScannerModal(true, {});
  }

  async function handelOpenMergeModal() {
    // Request camera permissions
    await requestCameraPermissions();

    openMergeModal(true, {
      equipment_id: selectedEquipmentId.value,
      process_id: selectedProcessId.value,
    });
  }

  async function onScannerReceiveValue(values) {
    if (values?.id) {
      const data = { target: { value: String(values.id).trim() } };
      handleInputEnter(data);
    }
  }

  function rowClassName(record) {
    const status = record?.status_code;
    switch (status) {
      case 'waiting_for_fai':
        return 'table-row-yellow';
      case 'waiting_for_pqc':
        return 'table-row-yellow';
      case 'producing':
        return 'table-row-green';
      case 'completed':
        return 'table-row-grey';
      default:
        return '';
    }
  }

  /**
   * @description connect websocket
   */
  function loadEchoInit() {
    echo.connector.socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    echo.channel('laravel_database_productionchannel').listen('.my-event', (event: any) => {
      // console.log(event);
      const data = event?.productionData;
      if (
        data?.equipment_id &&
        String(data?.equipment_id) === String(selectedEquipmentId.value) &&
        data?.quantity
      ) {
        const rowProducing: any = dataBottom.value.find(
          (item: any) => item?.status_code === 'producing',
        );

        if (rowProducing) {
          if (rowProducing?.lot_id === data?.lot_id) {
            // Update table bottom
            dataBottom.value = dataBottom.value.map((item: any) => {
              if (item?.lot_id === data?.lot_id) {
                const numberChanged = Number(data.quantity) - Number(item.actual_quantity);
                item.actual_quantity = Number(data.quantity);
                if (dataMiddle.value) {
                  dataMiddle.value.actual_quantity = Number(data.quantity);
                }
                if (numberChanged > 0 && dataTop.value.actual_quantity) {
                  dataTop.value.actual_quantity += numberChanged;
                }
              }
              return item;
            });
          } else {
            loadLotHistories();
          }
        }
      }
    });
  }

  /**
   * @description Handle print lot
   */
  async function handlePrint() {
    const lotId = dataMiddle.value?.lot_id;
    const quantity = Number(dataMiddle.value?.actual_quantity);
    if (!lotId) {
      return;
    }
    if (quantity <= 0) {
      message.info('CHƯA CÓ SẢN LƯỢNG ĐỂ IN TEM');
      return;
    }

    if (selectedProcessId.value === ProcessType.PACKING) {
      // Với công đoạn đóng gói (DG)
      openInputPrintModal(true, { lot_id: dataMiddle.value?.lot_id });
    } else {
      onPrintClick();
    }
  }

  async function onPrintClick() {
    const lotId = dataMiddle.value?.lot_id;
    const quantity = Number(dataMiddle.value?.actual_quantity);
    if (!lotId) {
      return;
    }
    if (quantity <= 0) {
      message.info('CHƯA CÓ SẢN LƯỢNG ĐỂ IN TEM');
      return;
    }
    const response: any = await printPalletTemplate({
      lot_id: lotId,
    });
    if (response) {
      // const decodedBase64 = decodeURIComponent(escape(atob(response)));
      const { html, width, height } = response;
      htmlContent.value = {
        html: html,
        width: width ?? 100,
        height: height ?? 60,
      };
      setTimeout(async () => {
        if (!labelRef.value || !htmlContent.value?.html) {
          alert('Không thể in tem');
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
    await loadLotHistories({ equipment_id: selectedEquipmentId.value });
    dataMiddle.value = undefined;
  }

  const renderFooter = () => {
    return warningMessages.value.length > 0
      ? h(WarningSlider, { warningMessages: warningMessages.value })
      : null;
  };

  async function isSafeForMapping(equipment_id: string): Promise<boolean> {
    try {
      const res: any = await isSafeForMappingApi({ equipment_id });
      if (res) {
        return res?.result ?? false;
      }
      return false;
    } catch (error) {
      console.error(error);
      message.error(error.message);
      return true;
    }
  }
</script>

<style lang="less" scoped>
  .table-production :deep(.ant-table-footer) {
    border-radius: 0 !important;
  }
</style>
