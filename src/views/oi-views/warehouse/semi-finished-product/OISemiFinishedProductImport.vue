<template>
  <div class="h-screen p-2">
    <!-- <div class="flex justify-end items-center">
      <Breadcrumb>
        <BreadcrumbItem href="/warehouse"
          ><span class="text-dark font-semibold"
            ><Icon icon="ant-design:star-outlined" /> KHO</span
          ></BreadcrumbItem
        >
        <BreadcrumbItem>
          <Dropdown>
            <span class="text-red-800 font-bold cursor-pointer"
              >KHO BÁN THÀNH PHẨM<Icon icon="ant-design:down-outlined"
            /></span>
            <template #overlay>
              <Menu @click="handleMenuClick">
                <MenuItem key="material-import">KHO NGUYÊN VẬT LIỆU</MenuItem>
                <MenuItem key="finished-product-import">KHO THÀNH PHẨM</MenuItem>
                <MenuItem key="semi-finished-product-import">KHO BÁN THÀNH PHẨM</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </BreadcrumbItem>
      </Breadcrumb>
    </div> -->
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
            :options="[{ label: 'Nhập', value: 'import' }]"
            defaultValue="import"
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
                  defaultValue="semi-finished-product-import"
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
      <Col :span="16" class="bg-white">
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
      <Col :span="24" class="section-middle">
        <Row :gutter="[8, 8]">
          <Col :span="21" :xs="24" :sm="21" class="bg-white">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsMiddle"
              :dataSource="[]"
              :bordered="true"
              :pagination="false"
              :locale="{ emptyText: '&nbsp' }"
              :scroll="{ x: 500 }"
            />
            <div class="mt-2 flex gap-4">
              <DatePicker @change="handleStartDateChange" class="w-170" />
              <DatePicker @change="handleEndDateChange" class="w-170" />
            </div>
          </Col>
          <Col :span="3" :xs="24" :sm="3">
            <div class="flex flex-row md:flex-col justify-around h-full gap-2">
              <Button
                :loading="loading"
                type="primary"
                block
                class="oi-row-button"
                style="height: 100%"
                @click="() => handleOpenModal(false)"
              >
                <QrcodeOutlined style="font-size: 25px" />Quét QR
              </Button>
            </div>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white h-full">
        <Table
          size="small"
          :loading="loading"
          :columns="columnsBottom1"
          :dataSource="dataBottom"
          :bordered="true"
          :pagination="false"
          :scroll="{ y: 250, x: '80vw' }"
        />
      </Col>
    </Row>
    <SemiFinishedProductImportScannerModal
      v-model:visible="isModal1Visible"
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
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { oiTableHeight } from '@/utils/helper/oiTable';
  import { QrcodeOutlined } from '@ant-design/icons-vue';
  import { Button, Col, DatePicker, Row, Select, Table } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import SemiFinishedProductImportScannerModal from './components/SemiFinishedProductImportScannerModal.vue';
  import { columnsBottom1, columnsMiddle, columnsTop } from './components/tableOIWarehouse';

  const go = useGo();

  const warehouseStore = useWarehouseStore();
  const windowHeight = ref<number>(window.innerHeight);
  const dataBottom = ref<any[]>([]);
  const loading = ref<boolean>(false);

  const dataTop = ref<any[]>([{ id: 1, import: 8600, export: 6800, inventory: 8600 - 6800 }]);

  const isModal1Visible = ref<boolean>(false);

  const [registerModal, { openModal }] = useModal();

  onMounted(() => {
    fetchData();
  });

  async function fetchData(param?: any) {
    loading.value = true;
    const response = await warehouseStore.searchOIFinishedProductImportApi(param);
    if (response.data) {
      console.log(response.data);
      dataBottom.value = response.data?.map((item: any, index) => ({
        stt: index + 1,
        finished_product_import_id: item.finished_product_import_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit: item.product.unit.unit_name,
        customer_id: item.customer_id,
      }));
    }
    loading.value = false;
  }
  onBeforeMount(() => {
    setTimeout(() => {
      oiTableHeight('table-production', windowHeight.value);
    }, 300);
  });

  function handleActionChange(value) {
    if (value === 'export') go('/oi/warehouse/semi-finished-product-export');
  }

  function handleOpenModal(x: boolean) {
    openModal(true, {
      isUpdate: x,
    });
  }

  function handleSuccess() {}

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

  const handleStartDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    fetchData({ start_date: formattedDate });
  };

  const handleEndDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    fetchData({ end_date: formattedDate });
  };
</script>
