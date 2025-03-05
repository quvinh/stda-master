<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Quét mã Pallet"
    :show-ok-btn="false"
    @cancel="handleCancle"
    style="top: 50px"
  >
    <div :style="{ height: qrCodeHeight + 'px' }">
      <Html5QrcodePlugin
        ref="qrCodePluginRef"
        :fps="10"
        :qrbox="250"
        :disableFlip="true"
        :qrCodeSuccessCallback="handleScanResult"
      />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import Html5QrcodePlugin from '@/components/Html5Qrcode/Html5QrcodePlugin.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref } from 'vue';
  import { searchPalletsApi } from '@/api/sys/warehouse';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['success']);

  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);
  const loading = ref<boolean>(false);
  const page = ref<number>(1);
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
  const [registerModal, { closeModal }] = useModalInner(async () => {
    const qrCodeElement = qrCodePluginRef.value?.$el;
    if (qrCodeElement) {
      resizeObserver.value = new ResizeObserver(() => {
        if (qrCodeElement.offsetHeight > 0) qrCodeHeight.value = Number(qrCodeElement.offsetHeight);
      });
      resizeObserver.value.observe(qrCodeElement); // Bắt đầu theo dõi phần tử này
    }

    qrCodePluginRef.value?.resetScan();
    dataScanner.value = undefined;
    stepScanner.value = 'pallet_id';
  });

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        loading.value = true;
        const response: any = await searchPalletsApi({ id: value, page: page.value, pageSize: 20 });
        if (response?.data) {
          if (
            response.data[0].quality_check?.result === 'Chưa kiểm' ||
            !response.data[0].quality_check?.result
          ) {
            emit('success', { data: response.data[0] });
          } else {
            message.error('Pallet đã được kiểm tra');
          }
          handleCancle();
        }
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
</script>
