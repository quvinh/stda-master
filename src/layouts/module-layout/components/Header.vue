<template>
  <div>
    <!-- Header -->
    <header
      class="oi-bg-blue text-white p-2 flex items-center justify-between fixed top-0 left-0 w-full z-10 oi-header"
    >
      <!-- Logo -->
      <div class="md:flex items-center w-1/3 hidden">
        <img :src="`${BACKEND_URL}/logo`" alt="Logo" class="h-8" />
      </div>

      <!-- Tiêu đề -->
      <div class="flex-1 w-full md:w-1/3 text-left md:text-center">
        <span class="text-2xl font-semibold">{{ oiHeaderStore.title }}</span>
      </div>

      <!-- Thao tác -->
      <div class="flex items-center justify-end space-x-2 w-1/3">
        <div class="hidden md:block text-center">
          <div>{{ currentDate.format('DD/MM/YYYY') }}</div>
          <small>{{ currentDate.format('HH:mm:ss') }}</small>
        </div>
        <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <MenuItem key="ui">
                <Icon icon="ant-design:home-outlined" />
                Trang chủ
              </MenuItem>
              <MenuItem key="summary">
                <Icon icon="ant-design:bar-chart-outlined" />
                Dashboard tổng hợp
              </MenuItem>
              <MenuItem key="production">
                <Icon icon="ant-design:product-outlined" />
                Tình hình sản xuất
              </MenuItem>
              <MenuItem key="equipment">
                <Icon icon="ant-design:apartment-outlined" />
                Thiết bị
              </MenuItem>
              <MenuItem key="warehouse">
                <Icon icon="ant-design:code-sandbox-outlined" />
                Kho
              </MenuItem>
              <MenuItem key="simulator">
                <Icon icon="ant-design:warning-outlined" />
                Cảnh báo bất thường
              </MenuItem>
              <Menu.Divider />
              <MenuItem key="logout">
                <Icon icon="ant-design:logout-outlined" />
                Đăng xuất
              </MenuItem>
            </Menu>
          </template>
          <Button>
            <span class="text-dark dark:text-white">Menu</span>
            <DownOutlined class="text-dark dark:text-white" />
          </Button>
        </Dropdown>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/Icon/Icon.vue';
  import { useGo } from '@/hooks/web/usePage';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { useUserStore } from '@/store/modules/user';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { onBeforeUnmount, onMounted, ref } from 'vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const go = useGo();

  const currentDate = ref<Dayjs>(dayjs());
  const userStore = useUserStore();
  const oiHeaderStore = useOIHeaderStore();
  const updateClock = () => {
    currentDate.value = dayjs();
  };

  onMounted(() => {
    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  });

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'ui':
        go('/dashboard/analysis');
        // go('/kpi');
        break;
      case 'summary':
        go('/overview/summary');
        break;
      case 'production':
        go('/overview/production');
        break;
      case 'equipment':
        go('/overview/equipment');
        break;
      case 'warehouse':
        go('/overview/warehouse');
        break;
      case 'simulator':
        go('/overview/simulator');
        break;
      case 'logout':
        handleLoginOut();
        break;
      default:
        break;
    }
  };

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }
</script>
