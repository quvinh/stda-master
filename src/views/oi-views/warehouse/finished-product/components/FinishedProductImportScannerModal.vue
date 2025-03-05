<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="stepScanner === 'lot_id' ? 'VUI LÒNG QUÉT MÃ LOT' : 'VUI LÒNG QUÉT MÃ VỊ TRÍ'"
    :show-ok-btn="true"
    @cancel="handleCancle"
    @ok="handleSubmit"
    style="top: 10px"
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
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { message, Table } from 'ant-design-vue';
  import { ref } from 'vue';
  import { getWarehouseLocationApi } from '@/api/sys/warehouse-location';
  import { createLotWarehouseEntry } from '@/api/sys/warehouse';
  import { formatNumber } from '@/utils/helper/tsxHelper';
  import { getLotApi } from '@/api/sys/lot';

  const columnScanner: any[] = [
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

  const emit = defineEmits(['success']);

  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);
  const dataScanner = ref<{
    lot_id: string;
    quantity: number;
    unit_id?: string;
    unit_name?: string;
    warehouse_location_id?: string;
  }>();
  const stepScanner = ref<'lot_id' | 'warehouse_location_id'>('lot_id');

  /**
   * @description useModalInner
   */
  const [registerModal, { closeModal }] = useModalInner(async () => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    // Reset values
    qrCodePluginRef.value.resetScan();
    dataScanner.value = undefined;
    stepScanner.value = 'lot_id';
  });

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        switch (stepScanner.value) {
          case 'lot_id':
            // TODO: Check Lot đã kiểm OQC OK
            const resPallet: any = await getLotApi(value);
            if (resPallet?.warehouse_history_import?.id) {
              message.info(`LOT: ${resPallet.id} ĐÃ NHẬP KHO!`);
            } else {
              const { id, product } = resPallet;
              dataScanner.value = {
                lot_id: id,
                quantity: resPallet?.actual_quantity ?? 0,
                unit_id: product?.unit?.id ?? null,
                unit_name: product?.unit?.unit_name ?? null,
              };
              stepScanner.value = 'warehouse_location_id';
              if (resPallet) {
                emit('success', {
                  resPallet: resPallet,
                  dataScanner: dataScanner.value,
                });
              }
            }
            break;
          case 'warehouse_location_id':
            const resLocation: any = await getWarehouseLocationApi(value);

            if (resLocation?.id && dataScanner.value) {
              dataScanner.value.warehouse_location_id = resLocation.id;
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isScanningRef.value = true;
      }, 2500);
    }
  }

  async function handleSubmit() {
    try {
      if (dataScanner.value?.lot_id && dataScanner.value?.warehouse_location_id) {
        const response = await createLotWarehouseEntry({
          ...dataScanner.value,
          status: 'import',
        });
        stepScanner.value = 'lot_id';
        if (response) {
          emit('success', { resPallet: {}, dataScanner: {} });
          message.success('THAO TÁC THÀNH CÔNG');
          handleCancle();
        } else {
          message.error('THAO TÁC THẤT BẠI');
        }
      } else throw new Error('CHƯA QUÉT ĐỦ DỮ LIỆU!');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function handleCancle() {
    if (resizeObserver.value && qrCodePluginRef.value?.$el) {
      resizeObserver.value.disconnect(); // Ngừng theo dõi khi component bị hủy
    }
    qrCodePluginRef.value.stopScan();
    closeModal();
  }
</script>
