<template>
  <div class="h-screen p-2">
    <Row :gutter="[5, 5]">
      <Col :span="24">
        <Row class="section-top" :gutter="[5, 5]">
          <Col :span="8" :xs="24" :sm="8">
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
                      defaultValue="import"
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
              :dataSource="Object.values(dataTop).length > 0 ? [dataTop] : []"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 300 }"
            />
          </Col>
        </Row>
      </Col>
      <Col :span="24">
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
        <Table
          size="small"
          :loading="loading"
          :columns="columnsMiddle"
          :dataSource="dataMiddle"
          :bordered="true"
          :pagination="false"
          :locale="{ emptyText: '&nbsp' }"
          :scroll="{ x: 800 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'quantity_2'">
              <Button
                size="small"
                type="link"
                danger
                @click="handleOpenChangeQuantityModal(record)"
                >{{
                  record?.quantity_2 > 0 ? `${formatNumber(record.quantity_2)} [Sửa]` : `[Nhập SL]`
                }}</Button
              >
            </template>
          </template>
        </Table>
      </Col>
      <!-- <Col :span="4" :xs="24" :sm="4">
        <div class="flex flex-row md:flex-col justify-around h-full gap-1">
          <Button
            :loading="loading"
            type="primary"
            block
            class="flex justify-center items-center h-full"
            @click="() => handleOpenModal(true)"
          >
            <PlusOutlined style="font-size: 20px" /> Tạo pallet
          </Button>
          <Button type="primary" block @click="handlePrint" class="oi-row-button h-full"
            ><Icon icon="ant-design:printer-outlined" style="font-size: 20px" /> IN</Button
          >
        </div>
      </Col> -->

      <Col :span="24" class="bg-white h-full">
        <Table
          ref="tablePalletRef"
          class="table-wh-import"
          size="small"
          :loading="loading"
          :columns="columnsBottomMaterialImport"
          :dataSource="dataPallet"
          :bordered="true"
          :pagination="false"
          :customRow="onRow"
          :rowClassName="rowClassName"
          :scroll="{
            x: 1550,
            y: oiTableHeight(
              'table-wh-import',
              windowHeight - 34 - (warningMessages.length > 0 ? 30 : 0),
            ),
          }"
          :footer="renderFooter"
        />
      </Col>
    </Row>
    <MaterialImportScannerModal
      :width="500"
      :draggable="false"
      :maskClosable="false"
      @register="registerScannerModal"
      @success="handleScannerSuccess"
    />
    <ChangeQuantityModal
      :width="400"
      :draggable="false"
      :maskClosable="true"
      @register="registerChangeQuantityModal"
      @success="handleChangeQuantitySuccess"
    />
    <div class="hidden">
      <div ref="labelRef">
        <!-- Safely renders HTML content -->
        <div v-html="htmlContent?.html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  // import { ISelectOption } from '@/store/types/pagination';
  import { searchApi as getPallet } from '@/api/sys/pallet';
  import { searchPalletsApi } from '@/api/sys/warehouse';
  import { useModal } from '@/components/Modal';
  import { useGo } from '@/hooks/web/usePage';
  import { oiTableHeight, requestCameraPermissions } from '@/utils/helper/oiTable';
  import { Button, Col, Input, Row, Select, Table } from 'ant-design-vue';
  import { message } from 'ant-design-vue/lib';
  import { h, onBeforeUnmount, onMounted, ref } from 'vue';
  import MaterialImportScannerModal from './components/MaterialImportScannerModal.vue';
  import {
    columnsBottomMaterialImport,
    columnsMiddle,
    columnsTop,
  } from './components/tableOIWarehouse';
  // import printJS from 'print-js';
  // import { printPallet } from '@/api/sys/print';
  import { IPallet } from '@/api/model/IPallet';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  // import { updateApi as updatePallet } from '@/api/sys/pallet';
  import { getWarehouseHistorySummaryApi } from '@/api/sys/warehouse-history';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import ChangeQuantityModal from './components/ChangeQuantityModal.vue';
  import WarningSlider from './components/WarningSlider.vue';

  export interface IHtmlContent {
    html: string;
    width: number;
    height: number;
  }

  const go = useGo();
  const oiHeaderStore = useOIHeaderStore();

  const windowHeight = ref<number>(window.innerHeight);
  const dataPallet = ref<any[]>([]);
  const inputValue = ref();
  const dataMiddle = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const hasMore = ref<boolean>(true);
  const dataTop = ref<any>({});
  const tableHeight = ref<number | string>('40vh');
  const tablePalletRef = ref<InstanceType<(typeof import('ant-design-vue'))['Table']> | null>(null);
  const page = ref<number>(1);
  const selectedRowKeys = ref<any[]>([]);
  const htmlContent = ref<IHtmlContent | null>(null);
  const labelRef = ref<HTMLDivElement | null>(null);
  const warehouseData = ref();
  const palletData = ref<IPallet | null>();
  const warningMessages = ref<string[]>([]);

  const [registerScannerModal, { openModal: openScannerModal }] = useModal();
  const [registerChangeQuantityModal, { openModal: openChangeQuantityModal }] = useModal();

  onMounted(() => {
    oiHeaderStore.setTitle('QUẢN LÝ KHO');
    fetchSummary();
    fetchPallets();
    setTimeout(() => {
      const tH = oiTableHeight('table-wh-import', windowHeight.value);
      if (tH) tableHeight.value = tH - 25;
    }, 300);

    // Add event
    const scrollContainer = tablePalletRef.value?.$el.querySelector(
      '.ant-table-body',
    ) as HTMLElement;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
  });

  onBeforeUnmount(() => {
    const scrollContainer = tablePalletRef.value?.$el.querySelector(
      '.ant-table-body',
    ) as HTMLElement;
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  });

  // const rowSelection: any = computed(() => ({
  //   type: 'checkbox',
  //   selectedRowKeys: selectedRowKeys.value,
  //   onChange: onSelectChange,
  // }));

  async function fetchSummary() {
    const res: any = await getWarehouseHistorySummaryApi({
      model: 'pallet',
    });
    if (res) {
      dataTop.value = {
        ...res,
        // inventory: Number(res?.import) - Number(res?.export),
      };
    }
  }

  async function fetchPallets() {
    try {
      loading.value = true;
      const response: any = await searchPalletsApi({
        page: page.value,
        pageSize: 25,
        is_parent: true,
      });
      if (response?.data) {
        dataPallet.value = (response.data || []).map((item) => ({
          key: item?.id,
          ...item,
          supplier: item.material_import_item.supplier?.supplier_name,
          material_receipt_item_id: item?.material_import?.id,
          unit_id_1: item.unit1?.unit_name,
          unit_id_2: item.unit2?.unit_name,
          location: item.warehouse_inventory?.warehouse_location_id,
        }));
        warningMessages.value = [];
        dataPallet.value.forEach((i) => {
          if (i?.quality_check?.status === 'OK' && !i?.warehouse_inventory?.warehouse_location_id)
            warningMessages.value.push(i?.id);
        });
      }
    } catch (error) {
      message.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleActionChange(value) {
    if (value === 'export') go('/oi/warehouse/material-export');
  }

  async function handelOpenScannerModal() {
    // Request camera permissions
    await requestCameraPermissions();

    let check = 'warehouse_location_id';
    if (dataMiddle.value.length === 0) check = 'pallet_id';
    else {
      if (dataMiddle.value[0].quantity_2 === 0) check = 'pallet_id';
    }
    openScannerModal(true, { stepScanner: check, warehouseData: warehouseData.value });
  }

  function handleScannerSuccess(value) {
    const len = Object.keys(value.resPallet).length;
    if (len > 0) {
      if (dataMiddle.value.length > 0) dataMiddle.value = [];
      palletData.value = value.resPallet;
      dataMiddle.value.push({
        ...value.resPallet,
        material_receipt_id: value.resPallet.material_receipt?.id,
        unit_id_1: value.resPallet.unit1?.unit_name,
        unit_id_2: value.resPallet.unit2?.unit_name,
      });
    } else dataMiddle.value.length = 0;
    if (value.dataScanner) warehouseData.value = value.dataScanner;
    fetchSummary();
    fetchPallets();
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

  /**
   * @description load data khi scroll bảng pallet từ event scroll
   */
  async function loadMoreData() {
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    page.value += 1;
    const response: any = await searchPalletsApi({ page: page.value, pageSize: 25 });
    const result = response.data ?? [];
    if (result.length > 0) {
      const resource: any[] = response.data || [];
      dataPallet.value = [...dataPallet.value, ...resource].map((item) => ({
        key: item?.id,
        ...item,
      }));
    } else {
      hasMore.value = false;
      page.value -= 1;
    }
    loading.value = false;
  }

  function handleScroll(event) {
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollTop + clientHeight >= scrollHeight - 15) {
      loadMoreData();
    }
  }

  function onRow(record: any) {
    return {
      onClick: () => {
        const keys = [...selectedRowKeys.value];
        const index = keys.indexOf(record.id);
        if (index === -1) {
          keys.push(record.id);
        } else {
          keys.splice(index, 1);
        }
        selectedRowKeys.value = keys;
      },
    };
  }

  function rowClassName(record) {
    const result = record?.quality_check?.status ?? '';
    switch (String(result).toUpperCase()) {
      case 'NG':
        return 'table-row-red';
      case 'OK':
        return 'table-row-grey';
      default:
        return '';
    }
  }

  async function handleInputEnter(e: any) {
    try {
      loading.value = true;
      const resPallet: any = await getPallet({ id: e.target.value });
      console.log(resPallet);
      if (resPallet[0]?.id) {
        if (resPallet[0]?.quality_check?.result !== 'OK') {
          if (resPallet[0]?.quality_check?.result === 'NG')
            message.info('PALLET KHÔNG HỢP LỆ. VUI LÒNG KIỂM TRA LẠI');
          else message.info('PALLET CHƯA ĐƯỢC IQC');
        } else {
          if (resPallet[0]?.warehouse_entry?.warehouse_location_id) {
            message.info('PALLET ĐÃ CÓ TRONG KHO!');
          } else {
            const data = resPallet[0];
            dataMiddle.value = [];
            dataMiddle.value.push({
              ...data,
              material_receipt_id: data.material_receipt?.id,
              unit_id_1: data.unit1?.unit_name,
              unit_id_2: data.unit2?.unit_name,
            });
            if (data?.id) {
              warehouseData.value = {
                pallet_id: data.id,
                quantity_1: Number(data?.quantity_1),
                unit_id_1: data?.unit_id_1,
                unit_name_1: data.unit1?.unit_name,
              };
            }
          }
        }
      } else message.info('KHÔNG TÌM THẤY THÔNG TIN PALLET');
    } catch (error) {
      console.error(error.error);
    } finally {
      loading.value = false;
    }
  }

  function handleOpenChangeQuantityModal(value) {
    if (value?.id) {
      openChangeQuantityModal(true, { record: value });
    } else {
      message.info('KHÔNG CÓ THÔNG TIN PALLET!');
    }
  }

  function handleChangeQuantitySuccess(value) {
    console.log('value = ', value);
    fetchPallets();
  }

  const renderFooter = () => {
    return warningMessages.value.length > 0
      ? h(WarningSlider, { warningMessages: warningMessages.value })
      : null;
  };
</script>
