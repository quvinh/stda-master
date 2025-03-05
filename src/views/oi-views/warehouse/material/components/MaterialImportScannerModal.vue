<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="stepScanner === 'pallet_id' ? 'VUI LÒNG QUÉT MÃ PALLET' : 'VUI LÒNG QUÉT MÃ VỊ TRÍ'"
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
        v-if="stepScanner !== 'pallet_id'"
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
  import { searchApi as getPallet } from '@/api/sys/pallet';
  import { getWarehouseLocationApi } from '@/api/sys/warehouse-location';
  import { createWarehouseEntry, searchWarehouseEntry } from '@/api/sys/warehouse';
  import { formatNumber } from '@/utils/helper/tsxHelper';

  const columnScanner: any[] = [
    { title: 'Mã Pallet', dataIndex: 'pallet_id', align: 'center', width: 120 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_1',
      align: 'center',
      width: 90,
      customRender: ({ value }) => formatNumber(value),
    },
    { title: 'ĐVT', dataIndex: 'unit_name_1', align: 'center', width: 90 },
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
    pallet_id: string;
    quantity_1: number;
    unit_id_1?: string;
    unit_name_1?: string;
    warehouse_location_id?: string;
  }>();
  const stepScanner = ref<'pallet_id' | 'warehouse_location_id'>('pallet_id');

  /**
   * @description useModalInner
   */
  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    qrCodePluginRef.value?.resetScan();
    dataScanner.value = undefined;
    if (data.warehouseData) dataScanner.value = data.warehouseData;
    stepScanner.value = data.stepScanner;
  });

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        const jsonData = JSON.parse(value);
        switch (stepScanner.value) {
          case 'pallet_id':
            const resPallet: any = await getPallet({ id: jsonData.value });
            if (resPallet[0]?.id) {
              if (resPallet[0]?.quality_check?.status !== 'OK') {
                if (resPallet[0]?.quality_check?.status === 'NG')
                  message.info('PALLET KHÔNG HỢP LỆ. VUI LÒNG KIỂM TRA LẠI');
                else message.info('PALLET CHƯA ĐƯỢC IQC');
              } else {
                const res = await searchWarehouseEntry({ lot_id: resPallet[0]?.id });
                if (res.length > 0) {
                  message.info('PALLET ĐÃ CÓ TRONG KHO!');
                  handleCancle();
                } else {
                  const { id, quantity_1, unit1 } = resPallet[0];
                  dataScanner.value = {
                    pallet_id: id,
                    quantity_1,
                    unit_id_1: unit1?.id,
                    unit_name_1: unit1?.unit_name,
                  };
                  stepScanner.value = 'warehouse_location_id';
                  if (resPallet) {
                    emit('success', {
                      resPallet: resPallet[0],
                      dataScanner: dataScanner.value,
                    });
                    handleCancle();
                  }
                }
              }
            } else message.info('KHÔNG TÌM THẤY THÔNG TIN PALLET');
            break;
          case 'warehouse_location_id':
            const resLocation: any = await getWarehouseLocationApi(jsonData.value);
            console.log('res = ', resLocation);
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
      const response = await createWarehouseEntry({
        ...dataScanner.value,
        quantity: dataScanner.value?.quantity_1,
        unit_id: dataScanner.value?.unit_id_1,
        status: 'test',
      });
      stepScanner.value = 'pallet_id';
      if (response) {
        emit('success', { resPallet: {}, dataScanner: {} });
        message.success('THAO TÁC THÀNH CÔNG');
        handleCancle();
      } else {
        message.error('THAO TÁC THẤT BẠI');
      }
    } catch (error) {
      console.error(error);
      emit('success', { resPallet: {}, dataScanner: {} });
      handleCancle();
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
