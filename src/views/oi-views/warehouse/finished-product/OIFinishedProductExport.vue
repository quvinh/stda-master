<template>
  <div class="h-screen p-2">
    <Row :gutter="[8, 8]">
      <!-- <Col :span="8" class="section-top bg-white">
        <div class="flex flex-col justify-stretch">
          <div
            class="text-center text-white font-600 h-[29.42px] flex justify-center items-center"
            style="background-color: #2462a3"
            >Thao tác</div
          >
          <Select
            :loading="loading"
            :options="[
              { label: 'Nhập', value: 'import' },
              { label: 'Xuất', value: 'export' },
            ]"
            defaultValue="export"
            @change="handleActionChange"
          />
        </div>
      </Col> -->
      <Col :span="8" :xs="24" :sm="8" class="section-top">
        <Row style="height: 100%" class="bg-white">
          <Col :span="24">
            <Row style="height: 100%">
              <Col
                :span="10"
                class="oi-bg-blue flex justify-center items-center text-white border-b border-white"
              >
                <span>Kho</span>
              </Col>
              <Col :span="14">
                <Select
                  :loading="loading"
                  :options="[
                    { label: 'Nguyên vật liệu', value: 'material-import' },
                    { label: 'Thành phẩm', value: 'finished-product-import' },
                    // { label: 'Bán thành phẩm', value: 'semi-finished-product-import' },
                  ]"
                  class="oi-select"
                  defaultValue="finished-product-import"
                  @change="handleWarehouseChange"
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
                <span>Thao tác</span>
              </Col>
              <Col :span="14">
                <Select
                  :loading="loading"
                  :options="[
                    { label: 'Nhập', value: 'import' },
                    { label: 'Xuất', value: 'export' },
                  ]"
                  class="oi-select"
                  defaultValue="export"
                  @change="handleActionChange"
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
          :scroll="{ x: 300 }"
        />
      </Col>
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="24" :xs="24" :sm="24">
            <Input class="w-full" placeholder="NHẬP MÃ HOẶC QUÉT QR">
              <template #prefix>
                <div class="cursor-pointer" @click="handleOpenModal">
                  <Icon icon="ant-design:qrcode-outlined" />
                </div>
              </template>
            </Input>
          </Col>
          <Col :span="24" :xs="24" :sm="24" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddleExport"
              :dataSource="dataMiddle"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 500 }"
            />
            <!-- <div class="mt-2 flex">
              <Col :span="12">
                <DatePicker @change="handleStartDateChange" class="w-full" />
              </Col>
              <Col :span="12">
                <DatePicker @change="handleEndDateChange" class="w-full" />
              </Col>
            </div> -->
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="">
        <Table
          size="small"
          :loading="loading"
          :columns="finishedProductColumnsBottom"
          :dataSource="dataBottom"
          :bordered="true"
          :customRow="customRow"
          :pagination="false"
          :scroll="{ x: 1100 }"
          :rowClassName="rowClassName"
        />
      </Col>
    </Row>
    <WarehouseScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { Col, Input, message, Row, Select, Table } from 'ant-design-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import {
    columnsMiddleExport,
    columnsTop,
    finishedProductColumnsBottom,
  } from './components/tableOIWarehouse';
  import WarehouseScannerModal from './components/WarehouseScannerModal.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { searchInventory } from '@/api/sys/warehouse';
  import { logOQC } from '@/api/sys/quality';

  const go = useGo();

  const windowHeight = ref<number>(window.innerHeight);
  const dataMiddle = ref<any[]>([]);

  const loading = ref<boolean>(false);

  const dataTop = ref<any[]>([]);
  const dataBottom = ref<any[]>([]);

  const [registerModal, { openModal }] = useModal();

  onMounted(() => {
    fetchData();
    fetchInventory();
  });

  async function fetchInventory(param?: any) {
    loading.value = true;
    const response = await searchInventory(param);
    if (response) {
      dataTop.value = [response];
    }
  }

  async function fetchData(param: any = {}) {
    loading.value = true;
    const response = await logOQC(param);
    if (response) {
      dataBottom.value = response?.filter((item) => item?.lot?.warehousehistoryimport?.id);
    }
    loading.value = false;
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

  function handleActionChange(value) {
    if (value === 'import') go('/oi/warehouse/finished-product-import');
  }

  async function handleOpenModal() {
    if (dataMiddle.value.length === 0) {
      message.info('CHƯA CÓ THÔNG TIN LOT ĐƯỢC CHỌN');
      return;
    }

    // Request camera permissions
    await requestCameraPermissions();

    openModal(true, {
      isUpdate: false,
      data: dataMiddle.value[0],
    });
  }

  function handleSuccess() {
    fetchData();
    fetchInventory();
  }

  function handleWarehouseChange(value) {
    switch (value) {
      case 'material-import':
        go('/oi/warehouse');
        break;
      case 'finished-product-import':
        go('/oi/warehouse/finished-product-import');
        break;
      case 'semi-finished-product-import':
        go('/oi/warehouse/semi-finished-product-import');
        break;
    }
  }

  const customRow = (record) => {
    return {
      onClick: () => {
        console.log(record);
        dataMiddle.value = [record];
      },
    };
  };

  function rowClassName(record) {
    const status = record?.lot?.warehousehistoryexport;
    return status ? 'table-row-grey' : '';
  }

  // const handleStartDateChange = (date) => {
  //   const formattedDate = dayjs(date).format('YYYY-MM-DD');
  //   if (activeTab.value === '1') {
  //     fetchFinishedProductExport({ start_date: formattedDate });
  //   } else {
  //     fetchData({ type: 'export', model: 'lot', start_date: formattedDate });
  //   }
  // };

  // const handleEndDateChange = (date) => {
  //   const formattedDate = dayjs(date).format('YYYY-MM-DD');
  //   if (activeTab.value === '1') {
  //     fetchFinishedProductExport({ end_date: formattedDate });
  //   } else {
  //     fetchData({ type: 'export', model: 'lot', end_date: formattedDate });
  //   }
  // };
</script>
