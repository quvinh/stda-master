<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-100 max-h-screen overflow-y-auto">
      <!-- Logo -->
      <div class="text-center mb-4">
        <img
          src="https://backmesv1.ors.vn/logo"
          alt="Logo"
          class="mx-auto mb-2"
        />
        <h1 class="text-lg font-bold text-gray-700">CÔNG TY CỔ PHẦN US MASTERBATCH</h1>
      </div>

      <!-- Simulator -->
      <div class="text-center mb-4">
        <a-button type="primary" block class="mb-2">Mô hình SX</a-button>
      </div>

      <!-- OI Section -->
      <div class="text-center mb-4">
        <Divider style="margin-bottom: 0">
          <span class="text-lg font-semibold text-gray-600 mb-2">SẢN XUẤT</span>
        </Divider>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <a-button type="primary" block>Sản xuất</a-button>
          <a-button type="primary" block>IQC</a-button>
          <a-button type="primary" block>PQC</a-button>
          <a-button type="primary" block>OQC</a-button>
        </div>
        <a-button type="primary" block>Thiết bị</a-button>
      </div>

      <!-- OI Section -->
      <div class="text-center mb-4">
        <Divider style="margin-bottom: 0">
          <span class="text-lg font-semibold text-gray-600 mb-2">KHO</span>
        </Divider>
        <div class="grid grid-cols-2 gap-2">
          <a-button type="primary" block>Kho TP</a-button>
          <a-button type="primary" block>Kho NVL</a-button>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="text-center mt-6">
        <a-button block class="mb-2" @click="handleLoginOut"
          ><Icon icon="ant-design:logout-outlined" /> Đăng xuất</a-button
        >
        <a-button block><Icon icon="ant-design:key-outlined" /> Đổi mật khẩu</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Divider } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';

  const userStore = useUserStore();

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }
</script>
