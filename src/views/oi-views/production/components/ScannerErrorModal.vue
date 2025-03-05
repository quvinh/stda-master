<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="Quét QR lỗi công đoạn"
    :show-ok-btn="false"
    @cancel="handleCancle"
    style="top: 10px"
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

  const emit = defineEmits(['success']);
  const qrCodePluginRef = ref<any>(null);
  const qrCodeHeight = ref<number>(300);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const isScanningRef = ref<boolean>(true);

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
    console.log(data);
  });

  async function handleScanResult(value) {
    if (value && isScanningRef.value) {
      isScanningRef.value = false;
      try {
        qrCodePluginRef.value.resetScan();
        emit('success', { id: value });
        handleCancle();
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
    qrCodePluginRef.value?.stopScan();
    closeModal();
  }
</script>
