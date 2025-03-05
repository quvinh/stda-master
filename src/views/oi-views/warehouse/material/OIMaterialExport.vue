<template>
  <div class="h-screen p-2">
    <Row :gutter="[8, 8]">
      <Col :span="24" class="section-top bg-white">
        <Row :gutter="[6, 6]">
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
                      defaultValue="material-import"
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
              :columns="columnsTopExport"
              :dataSource="Object.values(dataTop).length > 0 ? [dataTop] : []"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
            />
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="24">
            <Input class="w-full" placeholder="NHẬP MÃ HOẶC QUÉT QR">
              <template #prefix>
                <div class="cursor-pointer" @click="handleOpenScanner">
                  <Icon icon="ant-design:qrcode-outlined" />
                </div>
              </template>
            </Input>
          </Col>
          <Col :span="20" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddleExport"
              :dataSource="dataMaterialExportItemSelected"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 'max-content' }"
            />
          </Col>
          <Col :span="4">
            <Button
              :loading="loading"
              type="primary"
              size="small"
              class="flex justify-center items-center"
              block
              style="height: 100%"
              @click="handleOpenPrinter"
            >
              <PrinterOutlined style="font-size: 25px" />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white">
        <!-- 
        :rowSelection="{
            type: 'radio',
            selectedRowKeys: [selectedRowKey],
            onSelect: onSelectChange,
          }"
        -->
        <Table
          class="table-production"
          size="small"
          :loading="loading"
          :columns="columnsMaterialExport"
          :dataSource="dataMaterialExportItem"
          :bordered="true"
          :pagination="false"
          :scroll="{ x: 600, y: oiTableHeight('table-production', windowHeight) }"
          :customRow="onRow"
          :rowClassName="rowClassName"
        />
      </Col>
    </Row>
    <MaterialExportScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
    <!-- <MaterialExportPrinterModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerPrinterModal"
    /> -->

    <div class="hidden">
      <div ref="labelRef">
        <!-- Safely renders HTML content -->
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { searchMaterialExportItemApi } from '@/api/sys/warehouse';
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { PrinterOutlined } from '@ant-design/icons-vue';
  import { Button, Col, Input, message, Row, Select, Table } from 'ant-design-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  // import MaterialExportPrinterModal from './components/MaterialExportPrinterModal.vue';
  import MaterialExportScannerModal from './components/MaterialExportScannerModal.vue';
  import {
    columnsMaterialExport,
    columnsMiddleExport,
    columnsTopExport,
  } from './components/tableOIWarehouse';
  import Icon from '@/components/Icon/Icon.vue';
  import printJS from 'print-js';
  import { printPallet } from '@/api/sys/print';
  import { getWarehouseHistorySummaryApi } from '@/api/sys/warehouse-history';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const go = useGo();
  const oiHeaderStore = useOIHeaderStore();

  const windowHeight = ref<number>(window.innerHeight);

  const loading = ref<boolean>(false);

  const dataTop = ref<any>({});
  const dataMaterialExportItem = ref<any[]>([]);
  const dataMaterialExportItemSelected = ref<any[]>([]);
  const tableHeight = ref<number | string>('40vh');
  const selectedRowKey = ref<any>();
  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);

  const [registerModal, { openModal }] = useModal();
  // const [registerPrinterModal, { openModal: openPrinterModal }] = useModal();

  onMounted(async () => {
    oiHeaderStore.setTitle('QUẢN LÝ KHO');
    await fetchMaterialExportItem();
    fetchSummary();

    setTimeout(() => {
      const tH = oiTableHeight('table-wh-export', windowHeight.value);
      if (tH) tableHeight.value = tH - 80;
    }, 300);
  });

  async function fetchSummary() {
    const res: any = await getWarehouseHistorySummaryApi({
      model: 'pallet',
    });
    if (res) {
      const needed: number = dataMaterialExportItem.value?.reduce(
        (a, b) => a + Number(b?.quantity),
        0,
      );
      let percent: number | string = 0;
      if (needed > 0) {
        percent = formatNumber((Number(res?.export) / needed) * 100);
      }
      dataTop.value = {
        ...res,
        needed: dataMaterialExportItem.value?.reduce((a, b) => a + Number(b?.quantity), 0),
        percent,
        // inventory: Number(res?.import) - Number(res?.export),
      };
    }
  }

  async function fetchMaterialExportItem() {
    loading.value = true;
    dataMaterialExportItemSelected.value = [];
    const response: any = await searchMaterialExportItemApi();
    if (response?.data) {
      dataMaterialExportItem.value = response.data?.map((item) => ({ key: item?.id, ...item }));
    }
    loading.value = false;
  }

  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

  function handleActionChange(value) {
    if (value === 'import') go('/oi/warehouse');
  }

  async function handleOpenScanner() {
    if (dataMaterialExportItemSelected.value.length > 0) {
      const record = dataMaterialExportItemSelected.value[0];
      if (record?.pallet?.warehouse_history_export?.id) {
        message.info('LỆNH NÀY ĐÃ XUẤT KHO!');
      } else {
        // Request camera permissions
        await requestCameraPermissions();

        openModal(true, { record });
      }
    } else message.info('KHÔNG CÓ DỮ LIỆU PHIẾU XUẤT!');
  }

  function handleOpenPrinter() {
    if (dataMaterialExportItemSelected.value.length > 0) {
      // openPrinterModal(true, { ...dataMaterialExportItemSelected.value[0] });
      const record: any = dataMaterialExportItemSelected.value[0];
      if (record?.pallet_id && record?.pallet?.warehouse_history_export?.id) {
        // handlePrintPallet({ ids: record.pallet?.parent?.childrens?.map((row) => row?.id) });
        handlePrintPallet({ ids: [record.pallet_id] });
      } else {
        message.info(`PALLET ${record.pallet_id} CHƯA HOÀN THÀNH XUẤT!`);
      }
    } else {
      message.info('VUI LÒNG CHỌN PHIẾU ĐÃ XUẤT');
    }
  }

  async function handleSuccess(values) {
    if (values?.parent?.childrens && values?.warehousehistoryable_id) {
      handlePrintPallet({ ids: [values.warehousehistoryable_id] });
    }
    // if (values?.parent?.childrens && values.parent.childrens?.length > 1) {
    //   handlePrintPallet({ ids: values.parent.childrens?.map((row) => row?.id) });
    // }
    await fetchMaterialExportItem();
    fetchSummary();
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

  // function handleMenuClick(e) {
  //   switch (e.key) {
  //     case 'material-import':
  //       go('/oi/warehouse');
  //       break;
  //     case 'finished-product-import':
  //       go('/oi/warehouse/finished-product-import');
  //       break;
  //     case 'semi-finished-product-import':
  //       go('/oi/warehouse/semi-finished-product-import');
  //       break;
  //   }
  // }

  function onRow(record: any) {
    return {
      onClick: () => {
        // if (record?.pallet?.warehouse_history_export?.type === 'export') {
        //   selectedRowKey.value = record?.id;
        //   dataMaterialExportItemSelected.value = [record];
        // }
        // if (record?.pallet_id) {
        //   selectedRowKey.value = record?.key;
        // } else {
        //   selectedRowKey.value = null;
        // }
        selectedRowKey.value = record?.key;
        dataMaterialExportItemSelected.value = [record];
      },
    };
  }

  function onSelectChange(record: any, selected: any) {
    console.log('onSelectChange', record, selected);
    // if (record?.pallet?.warehouse_history_export?.type === 'export') {
    //   selectedRowKey.value = record?.id;
    //   dataMaterialExportItemSelected.value = [record];
    // }
    // if (record?.pallet_id) {
    //   selectedRowKey.value = record?.key;
    // } else {
    //   selectedRowKey.value = null;
    // }
    selectedRowKey.value = record?.key;
    dataMaterialExportItemSelected.value = [record];
  }

  function rowClassName(record: any) {
    // if (record?.key === selectedRowKey.value) {
    //   return 'table-row-green';
    // }
    if (record?.pallet?.warehouse_history_export?.type === 'export') {
      return 'table-row-grey';
    }
    return '';
  }

  async function handlePrintPallet(record: any) {
    try {
      loading.value = true;
      const response = await printPallet({
        pallet_ids: record?.ids || [],
      });
      if (response) {
        htmlContent.value = response;
        setTimeout(async () => {
          if (!labelRef.value || !htmlContent.value?.html) return;
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
    } catch (error) {
      message.error(error.message);
    } finally {
      loading.value = false;
    }
  }
</script>
