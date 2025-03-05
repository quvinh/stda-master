<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Quét QR"
    :show-ok-btn="true"
    @cancel="handleCancle"
    @ok="handleSubmit"
    style="top: 15px"
  >
    <div class="flex flex-col">
      <div :style="{ height: qrCodeHeight + 'px' }">
        <Html5QrcodePlugin
          ref="qrCodePluginRef"
          :fps="10"
          :qrbox="250"
          :disableFlip="true"
          :qrCodeSuccessCallback="handleScanResult"
        />
      </div>
      <Table
        class="mt-1"
        size="small"
        :columns="columnScanner"
        :data-source="Object.values(dataScanner ?? {}).length > 0 ? [dataScanner] : []"
        :pagination="false"
        :locale="{ emptyText: 'Chưa quét dữ liệu' }"
        :scroll="{ x: 500 }"
        bordered
      />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { createWarehouseHistory, searchLots } from '@/api/sys/warehouse';
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { message, Table } from 'ant-design-vue';
  import { ColumnType } from 'ant-design-vue/es/table';
  import { ref } from 'vue';

  const emit = defineEmits(['success']);

  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);
  const record = ref();
  const dataScanner = ref<{
    lot_id: string;
    quantity: number;
    unit_id?: string;
    unit_name?: string;
    warehouse_location_id?: string;
  }>();
  const columnScanner: ColumnType[] = [
    { title: 'Mã Lot', dataIndex: 'lot_id', align: 'left', width: 150 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      width: 90,
      customRender: ({ value }) => formatNumber(value),
    },
    { title: 'ĐVT', dataIndex: 'unit_name', align: 'center', width: 70 },
    {
      title: 'Vị trí',
      dataIndex: 'warehouse_location_id',
      align: 'center',
      fixed: 'right',
      width: 100,
    },
  ];

  /**
   * @description useModalInner
   */
  const [registerModal, { closeModal }] = useModalInner(async ({ data }) => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    qrCodePluginRef.value?.resetScan();
    record.value = data;
  });

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        const lotId = record.value?.lot_id ?? null;
        if (lotId === value) {
          const res: any = await searchLots(value);
          if (res?.id) {
            if (res?.warehouse_history_export?.id) {
              message.info(`LOT ${res.id} ĐÃ XUẤT KHO!`);
            } else {
              dataScanner.value = {
                lot_id: res.id,
                quantity: Number(record.value?.quantity),
                unit_name: record.value.unit?.unit_name,
                unit_id: record.value?.unit_id,
                warehouse_location_id: res.warehouse_history_import?.warehouse_location_id,
              };
            }
          }
        } else message.info(`MÃ LOT KHÔNG ĐÚNG VỚI LOT '${value}' ĐANG CHỌN!`);
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isScanningRef.value = true;
      }, 2500);
    }
  }

  function handleCancle() {
    if (resizeObserver.value && qrCodePluginRef.value?.$el) {
      resizeObserver.value.disconnect(); // Ngừng theo dõi khi component bị hủy
    }
    qrCodePluginRef.value.stopScan();
    closeModal();
  }

  async function handleSubmit() {
    const res = await createWarehouseHistory({
      ...dataScanner.value,
      type: 'export',
    });
    if (res) message.success('THAO TÁC THÀNH CÔNG');
    emit('success', {});
    handleCancle();
  }
</script>
