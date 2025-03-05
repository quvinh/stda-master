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
                      :options="processOptions"
                      :value="processSelected"
                      class="oi-select"
                      optionFilterProp="label"
                      showSearch
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
                      defaultValue="dd"
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
              :columns="oiProductionTopColumns"
              :dataSource="dataTop"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 500 }"
            />
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="21" :xs="24" :sm="21" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="oiQualityFaiMiddleColumns"
              :dataSource="dataMiddle"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 700 }"
            />
          </Col>
          <Col :span="3" :xs="24" :sm="3">
            <Button
              :loading="loading"
              type="primary"
              block
              class="oi-row-button h-full"
              @click="handleCheck"
              :disabled="!checkable"
            >
              Kiểm tra chỉ tiêu
            </Button>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white">
        <Table
          class="table-production"
          size="small"
          :loading="loading"
          :columns="oiQualityFaiBottomColumns"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{ x: 1300, y: oiTableHeight('table-production', windowHeight) }"
          rowKey="id"
          :custom-row="customRow"
          :rowClassName="rowClassName"
        />
      </Col>
    </Row>
    <Modal
      v-model:visible="isModalVisible"
      title="Kiểm tra chỉ tiêu"
      @ok="confirmModal"
      okText="Xác nhận"
      @cancel="isModalVisible = false"
    >
      <div class="flex justify-center space-x-4">
        <Button :type="selectedResult === 'ok' ? 'primary' : 'default'" @click="selectResult('ok')"
          >OK
        </Button>
        <Button :type="selectedResult === 'ng' ? 'primary' : 'default'" @click="selectResult('ng')"
          >NG
        </Button>
      </div>
    </Modal>

    <OIQualityDDModal
      :width="400"
      :minHeight="100"
      :draggable="false"
      :maskClosable="true"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { oiTableHeight } from '@/utils/helper/oiTable';
  import { Row, Col, Table, Select, Button, message, Modal } from 'ant-design-vue';
  import { onBeforeMount, ref, onMounted, watch } from 'vue';
  import { ISelectOption } from '@/store/types/pagination';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { useGo } from '@/hooks/web/usePage';
  import axiosInstance from '@/api/resource/axiosInstance';
  import {
    OiProductionBottomColumns,
    oiProductionTopColumns,
  } from '@/views/oi-views/production/components/tableOIProduction';
  import {
    oiQualityFaiBottomColumns,
    oiQualityFaiMiddleColumns,
  } from '@/views/oi-views/quality/components/tableOIQualityDD';
  import ApiResponse from '@/api/ApiResponse';
  import OIQualityDDModal from './components/OIQualityDDModal.vue';
  import { useModal } from '@/components/Modal';

  const go = useGo();
  const oiHeaderStore = useOIHeaderStore();
  const windowHeight = ref<number>(window.innerHeight);

  const [registerModal, { openModal }] = useModal();

  const loading = ref<boolean>(false);
  const processOptions = ref<ISelectOption[]>([{ label: 'QC', value: 'QC' }]);
  const processSelected = ref<string>('QC');
  const dataTop = ref<any[]>([
    {
      planned_quantity: null,
      actual_quantity: null,
      planned_percentage: null,
      target_percentage: null,
    },
  ]);
  const checkable = ref<boolean>(true);
  const dataMiddle = ref<OiProductionBottomColumns[] | undefined>();
  watch(
    () => dataMiddle.value,
    (value) => {
      if (!value || value?.length === 0) {
        checkable.value = false;
        return;
      }
      const status = value[0]?.status ?? '';
      checkable.value = status != 'ok';
    },
  );
  const dataBottom = ref<OiProductionBottomColumns[]>([]);
  const savedFormData = ref<any>({});
  const isModalVisible = ref<boolean>(false);
  const selectedResult = ref<string>('');

  const fetchLots = async () => {
    loading.value = true;
    try {
      const response: ApiResponse<any> = await axiosInstance.get('v1/qc/get-fai-lots');
      if (response.success && response.data) {
        dataBottom.value = response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  function customRow(record: any) {
    return {
      onClick: () => {
        dataMiddle.value = [record];
      },
    };
  }

  onMounted(() => {
    oiHeaderStore.setTitle('QUẢN LÝ TÁCH BÀI');
    fetchLots();
  });

  function handleCheck() {
    if (!dataMiddle.value || dataMiddle.value.length === 0) {
      message.info('VUI LÒNG CHỌN PALLET!');
      return;
    }
    // isModalVisible.value = true;
    openModal(true, {});
  }

  function confirmModal() {
    if (selectedResult.value) {
      handleSuccess({ result: selectedResult.value });
      selectedResult.value = '';
      isModalVisible.value = false;
    } else {
      message.error('Vui lòng chọn kết quả!');
    }
  }

  function handleSuccess({ result }) {
    if (!dataMiddle.value) {
      return;
    }
    const lot_id = dataMiddle.value[0].lot_id;
    if (!lot_id) {
      message.error('Vui lòng chọn pallet!');
      return;
    }
    axiosInstance
      .post('v1/qc/submit-final-fai', {
        lot_id,
        result: result.toLowerCase(),
      })
      .then(() => {
        savedFormData.value = {};
        dataMiddle.value = [];
        fetchLots();
      })
      .catch((error) => {
        console.error(error);
        message.error('Gửi thất bại!');
      });
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

  function selectResult(result: string) {
    selectedResult.value = result;
  }

  function rowClassName(record) {
    const status = record?.status;
    switch (status) {
      case 'ng':
        return 'table-row-red';
      case 'ok':
        return 'table-row-grey';
      default:
        return '';
    }
  }
</script>

<style scoped>
  .flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .items-center {
    align-items: center;
  }

  .space-x-4 > * + * {
    margin-left: 1rem;
  }
</style>
