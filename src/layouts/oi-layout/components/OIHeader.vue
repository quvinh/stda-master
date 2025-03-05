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
        <span class="text-xl font-semibold">{{ oiHeaderStore.title }}</span>
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
              <MenuItem key="logout">
                <LogoutOutlined />
                Đăng xuất
              </MenuItem>
            </Menu>
          </template>
          <Button>
            <span class="text-dark">Admin</span>
            <DownOutlined />
          </Button>
        </Dropdown>
        <!-- <Button class="text-white" @click="openDrawer(true)">
          <MenuFoldOutlined />
        </Button> -->
      </div>
    </header>

    <!-- Main Content -->
    <!-- <main>
      <router-view />
    </main> -->

    <!-- <OIHeaderDrawer @register="register" /> -->
  </div>
</template>

<script setup lang="ts">
  import { DownOutlined, LogoutOutlined } from '@ant-design/icons-vue';
  import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  // import { useDrawer } from '@/components/Drawer';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { useUserStore } from '@/store/modules/user';
  import dayjs, { Dayjs } from 'dayjs';
  // import OIHeaderDrawer from './OIHeaderDrawer.vue';

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  // const [register, { openDrawer }] = useDrawer();
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
