<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1 border-1 border-gray-300">
      <Menu
        class="w-full h-full"
        id="menu-account-settings"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :items="items"
      />
    </div>
    <div class="flex-1 w-[600px] bg-white h-full border-1 border-gray-300">
      <template v-if="selectedKeys[0] === 'info'">
        <AccountInfo @success="handleFilter" />
      </template>
      <template v-if="selectedKeys[0] === 'password'">
        <ChangePassword />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { KeyOutlined, UserOutlined } from '@ant-design/icons-vue';
  import { Menu } from 'ant-design-vue';
  import { VueElement, h, reactive, ref } from 'vue';
  import AccountInfo from './components/tabs/AccountInfo.vue';
  import ChangePassword from './components/tabs/ChangePassword.vue';

  const selectedKeys = ref<string[]>(['info']);

  function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: any[],
    type?: 'group',
  ): any {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as any;
  }

  const items: any[] = reactive([
    getItem('Thông tin tài khoản', 'info', () => h(UserOutlined)),
    getItem('Đổi mật khẩu', 'password', () => h(KeyOutlined)),
  ]);

  function handleFilter() {}
</script>
