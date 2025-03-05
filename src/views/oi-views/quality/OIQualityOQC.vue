<template>
  <div class="h-screen p-1">
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
                      :options="[{ label: 'QC', value: 'QC' }]"
                      class="oi-select"
                      optionFilterProp="label"
                      showSearch
                      disabled
                      defaultValue="QC"
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
                      defaultValue="oqc"
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
        <Row :gutter="[5, 5]">
          <Col :span="20" :xs="24" :sm="20" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddle"
              :dataSource="dataMiddle"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 1000 }"
            />
          </Col>
          <Col :span="4" :xs="24" :sm="4">
            <div class="flex flex-row md:flex-col justify-around h-full gap-1">
              <Button
                :loading="loading"
                type="primary"
                block
                class="oi-row-button h-full"
                @click="handleCheck"
                :disabled="!selectedItem || (selectedItem?.disabled ?? false)"
              >
                Kiểm tra chỉ tiêu
              </Button>
              <Button
                type="primary"
                block
                class="h-full"
                @click="handleOpenInputNg"
                :disabled="!selectedItem || selectedItem?.can_update_errors == false"
              >
                <Icon icon="ant-design:edit-outlined" />
                Nhập SL NG
              </Button>
            </div>
          </Col>
          <!-- <Col :span="3">
            <Button
              type="primary"
              block
              class="h-full"
              @click="onPrintClick"
              :disabled="!selectedItem"
            >
              <Icon icon="ant-design:printer-outlined" style="font-size: 25px" />
              IN
            </Button>
          </Col> -->
        </Row>
      </Col>
      <Col :span="24" class="bg-white">
        <Table
          class="table-production"
          size="small"
          :loading="loading"
          :columns="columnsBottom"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{ x: 1450, y: oiTableHeight('table-production', windowHeight) }"
          rowKey="id"
          row-click="handleRowClick"
          :custom-row="customBottomRow"
          :rowClassName="rowClassName"
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
    <InputNgQuantityModal
      :visible="openInputNgQuantityModal"
      :lot_id="selectedItem?.lot_id"
      @ok="handleSubmitNgQuantity"
      @cancel="handleCancelINputNgQuantity"
      :process_id="selectedItem?.process_id"
      :error_qualities="[]"
    />
    <InputNGOQCModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerNGModal"
      @success="handleInputNGSuccess"
    />
    <ScannerOQCModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerModal"
      @success="handleScannerSuccess"
    />
    <div class="hidden">
      <div ref="labelRef">
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ApiResponse from '@/api/ApiResponse';
  import axiosInstance from '@/api/resource/axiosInstance';
  import { searchInspectionCriteriaApi } from '@/api/sys/inspection-criteria';
  import { getOQCLots } from '@/api/sys/quality';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { IHtmlContent } from '@/views/oi-views/warehouse/material/OIMaterialImport.vue';
  import { Button, Col, Input, message, Row, Select, Table } from 'ant-design-vue';
  import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
  import InputNGOQCModal from './components/InputNGOQCModal.vue';
  import InputNgQuantityModal from './components/InputNgQuantityModal.vue';
  import OIQualityModal from './components/OIQualityPqcOqcModal.vue';
  import ScannerOQCModal from './components/ScannerOQCModal.vue';
  import { columnsBottom, columnsMiddle, columnsTop } from './components/tableOIQualityPQC';

  const go = useGo();
  const labelRef = ref<HTMLDivElement | null>(null);
  const oiHeaderStore = useOIHeaderStore();
  const windowHeight = ref<number>(window.innerHeight);
  const [registerModal, { openModal }] = useModal();
  const [registerNGModal, { openModal: openNGModal }] = useModal();
  const [registerScannerModal, { openModal: openScannerModal }] = useModal();
  const dataTop = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const dataMiddle = ref<any[]>([]);
  const selectedItem = computed(() => (dataMiddle.value.length > 0 ? dataMiddle.value[0] : null));
  const dataBottom = ref<any[]>([]);
  const dataCriteria = ref<any[]>([]);
  const htmlContent = ref<IHtmlContent | null>(null);
  const inputValue = ref<any>();

  const fetchBottomLots = async () => {
    const response: ApiResponse<any> = await axiosInstance.get('v1/qc/get-oqc-lots');
    if (response.success && response.data) {
      dataBottom.value = response.data;
    }

    axiosInstance.get('v1/qc/pqc-oqc-overview', { params: { qc_type: 'oqc' } }).then((response) => {
      const convertedResponse: ApiResponse<any> = response as any;
      console.log('convertedResponse', convertedResponse);
      if (convertedResponse.success && convertedResponse.data) {
        dataTop.value = [convertedResponse.data];
      }
    });
  };

  function customBottomRow(record: unknown) {
    return {
      onClick: () => {
        dataMiddle.value = [record];
      },
    };
  }

  const handleCancelINputNgQuantity = () => {
    openInputNgQuantityModal.value = false;
  };

  const handleSubmitNgQuantity = (_data: {
    process_id: number;
    lot_id: number;
    ng_quantity: number;
  }) => {
    openInputNgQuantityModal.value = false;
  };

  onMounted(() => {
    oiHeaderStore.setTitle('QUẢN LÝ OQC');
    fetchBottomLots();
  });

  const interval = setInterval(() => {
    fetchBottomLots();
  }, 7000);

  onBeforeUnmount(() => {
    clearInterval(interval);
  });

  async function handleCheck() {
    const response: any = await searchInspectionCriteriaApi({ type: 'oqc' });
    const resource: any[] = response?.data || [];
    if (resource.length > 0) {
      dataCriteria.value = resource;
      openModal(true, {
        criteria: resource,
      });
    }
  }

  const openInputNgQuantityModal = ref<boolean>(false);

  async function handleSuccess({ values, result }) {
    const formData = Object.entries(values).map(([id, value]) => {
      const criterion = dataCriteria.value.find((item) => item.id === parseInt(id));
      return {
        inspection_criteria_id: id,
        measurement: value,
        result: criterion?.input_type == 'ok_ng' ? value : null,
      };
    });
    const response: ApiResponse = await axiosInstance.post('v1/qc/submit-final-oqc', {
      lot_id: dataMiddle.value[0].lot_id,
      ng_quantity: values?.ng_quantity ?? 0,
      result,
      criteria: formData,
    });
    if (response.success) {
      await fetchBottomLots();
      dataMiddle.value = [];
    }
  }

  /**
   * TODO: Truyền mã công đoạn vào modal
   */
  function handleOpenInputNg() {
    const record = selectedItem.value?.process_id;
    if (!record) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
      return;
    }
    openNGModal(true, {
      process_id: record,
      lot_history_id: selectedItem.value?.lot_history?.id,
      lot_id: selectedItem.value?.lot_id,
      unrepairable_ng_quantity: selectedItem.value?.unrepairable_ng_quantity,
      reuse_ng_quantity: selectedItem.value?.reuse_ng_quantity,
    });
  }

  async function handleInputNGSuccess(values: any) {
    const currentLotId = selectedItem.value?.lot_id;
    const error_qualities = values?.error_qualities;
    const reuse_ng_quantity = values?.reuse_ng_quantity;
    const unrepairable_ng_quantity = values?.unrepairable_ng_quantity;
    await axiosInstance.post('v1/qc/update-qc-errors', {
      lot_id: currentLotId,
      error_qualities,
      reuse_ng_quantity,
      unrepairable_ng_quantity,
    });
    openInputNgQuantityModal.value = false;
    dataMiddle.value = [];
    await fetchBottomLots();
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

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

  function rowClassName(record) {
    const status = record?.pqc_oqc_status;
    switch (status) {
      case 'ng':
        return 'table-row-red';
      case 'ok':
        return 'table-row-grey';
      default:
        return '';
    }
  }

  async function handelOpenScannerModal() {
    // Request camera permissions
    await requestCameraPermissions();

    openScannerModal(true, {});
  }

  async function handleInputEnter(e: any) {
    try {
      const lot_id = e.target.value;
      loading.value = true;
      if (lot_id) {
        const response: any = await getOQCLots({ lot_id });
        if (response?.length > 0) {
          dataMiddle.value = [response[0]];
        } else {
          message.info('KHÔNG TÌM THẤY THÔNG TIN PALLET');
        }
      }
    } catch (error) {
      console.error(error.error);
    } finally {
      loading.value = false;
    }
  }

  function handleScannerSuccess(value) {
    if (value) {
      dataMiddle.value = value;
    }
  }
</script>
