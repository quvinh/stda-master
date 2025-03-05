<template>
  <div class="h-screen p-2">
    <div class="flex justify-end items-center">
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
    </div>
    <Row :gutter="[8, 8]">
      <Col :span="8" class="section-top bg-white">
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
                <QrcodeOutlined style="font-size: 25px" />
              </Button>
            </div>
          </Col>
        </Row>
      </Col>
      <Col :span="24" class="bg-white h-full">
        <Tabs
          class="custom-oi-tabs"
          v-model:activeKey="activeTab"
          size="small"
          defaultActiveKey="1"
          type="card"
          :animated="false"
          style="width: 100%"
        >
          <TabPane tab="Danh sách thành phẩm" key="1">
            <Table
              size="small"
              :loading="loading"
              :columns="finishedProductColumnsBottom"
              :dataSource="data"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 500 }"
            />
          </TabPane>
          <TabPane tab="Lịch sử xuất kho" key="2">
            <Table
              size="small"
              :loading="loading"
              :columns="columnsBottom"
              :dataSource="dataBottom"
              :bordered="true"
              :pagination="false"
              :scroll="{ x: 500 }"
            />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    <WarehouseScannerModal
      :width="800"
      :draggable="false"
      :maskClosable="false"
      @register="registerModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { useWarehouseStore } from '@/store/modules/states/warehouse';
  import { oiTableHeight } from '@/utils/helper/oiTable';
  import { QrcodeOutlined } from '@ant-design/icons-vue';
  import {
    Button,
    Col,
    Row,
    Select,
    Table,
    Dropdown,
    Menu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    TabPane,
    Tabs,
    DatePicker,
  } from 'ant-design-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import {
    columnsBottom,
    columnsMiddle,
    columnsTop,
    finishedProductColumnsBottom,
  } from './components/tableOIWarehouse';
  import { useGo } from '@/hooks/web/usePage';
  import WarehouseScannerModal from './components/WarehouseScannerModal.vue';
  import { useModal } from '@/components/Modal';
  import dayjs from 'dayjs';

  const go = useGo();

  const warehouseStore = useWarehouseStore();
  const windowHeight = ref<number>(window.innerHeight);
  const activeTab = ref('1');

  const loading = ref<boolean>(false);
  // const warehouseOptions = ref<ISelectOption[]>([]);
  // const warehouseSelected = ref<any>();
  const data = ref<any[]>([]);

  const dataTop = ref<any[]>([{ id: 1, import: 8600, export: 6800, inventory: 8600 - 6800 }]);
  const dataBottom = ref<any[]>([]);

  const [registerModal, { openModal }] = useModal();

  onMounted(() => {
    fetchFinishedProductExport();
    fetchExportHistories({ type: 'export', model: 'lot' });
  });

  async function fetchExportHistories(param?: any) {
    loading.value = true;
    const response = await warehouseStore.searchTPWareHouseExport(param);
    if (response?.data) {
      dataBottom.value = response.data?.map((item) => ({
        lot_id: item.lot.id,
        product_id: item.lot.product_id,
        product_name: item.lot.product.product_name,
        quantity: item.lot.quantity,
        warehouse_location_id: item.warehouse_location_id,
        create_time: item.created_at,
        created_by: item.created_by.name,
      }));
    }
    loading.value = false;
  }

  async function fetchFinishedProductExport(param?: any) {
    loading.value = true;
    const response = await warehouseStore.searchNVLWareHouseReceiptData(param);
    if (response?.data) {
      data.value = response.data?.map((item, index) => ({
        stt: index + 1,
        finished_product_id: item.product_id,
        finished_product_name: item.product.product_name,
        quantity: item.quantity,
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
    if (value === 'import') go('/oi/warehouse/semi-finished-product-import');
  }

  function handleOpenModal(x: boolean) {
    openModal(true, {
      isUpdate: x,
    });
  }

  function handleSuccess() {}

  function handleMenuClick(e) {
    switch (e.key) {
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

  const handleStartDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    if (activeTab.value === '1') {
      fetchFinishedProductExport({ start_date: formattedDate });
    } else {
      fetchExportHistories({ type: 'export', model: 'lot', start_date: formattedDate });
    }
  };

  const handleEndDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    if (activeTab.value === '1') {
      fetchFinishedProductExport({ end_date: formattedDate });
    } else {
      fetchExportHistories({ type: 'export', model: 'lot', end_date: formattedDate });
    }
  };
</script>
