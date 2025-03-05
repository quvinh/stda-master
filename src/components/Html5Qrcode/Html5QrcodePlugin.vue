<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode';
  import dayjs from 'dayjs';

  // Biến id cho khu vực quét mã QR
  const qrcodeRegionId = 'html5qr-code-full-region-' + dayjs().unix().toString();
  const qrcodeContainer = ref<HTMLElement | null>(null);

  // Props truyền vào component
  const props = defineProps({
    fps: Number,
    qrbox: Number,
    verbose: Boolean,
    disableFlip: Boolean,
    qrCodeSuccessCallback: Function,
    qrCodeErrorCallback: Function,
  });

  let previousResult;
  const onScannedSuccess = (decodedText: string, result: Html5QrcodeResult) => {
    console.log(previousResult, decodedText);
    if (previousResult !== decodedText) {
      props.qrCodeSuccessCallback && props.qrCodeSuccessCallback(decodedText, result);
      previousResult = decodedText;
    }
  };

  let html5QrcodeScanner: Html5QrcodeScanner | null = null;

  // Hàm khởi tạo khi component được mounted
  onMounted(() => {
    const config = {
      fps: props.fps || 10,
      qrbox: props.qrbox || 250,
      disableFlip: props.disableFlip || false,
    };

    html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, props.verbose || false);
    html5QrcodeScanner.render(onScannedSuccess, props.qrCodeErrorCallback);
  });

  // Hàm dọn dẹp khi component bị unmounted
  onBeforeUnmount(() => {
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear().catch(console.error);
    }
  });

  // Hàm để dừng quét QR
  const stopScan = () => {
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear().catch(console.error);
    }
  };

  // Hàm để reset việc quét QR
  const resetScan = () => {
    if (html5QrcodeScanner) {
      html5QrcodeScanner.render(onScannedSuccess, props.qrCodeErrorCallback);
    }
  };

  // Expose các hàm cho parent component
  defineExpose({
    stopScan,
    resetScan,
  });
</script>

<template>
  <div :id="qrcodeRegionId" ref="qrcodeContainer"></div>
</template>
