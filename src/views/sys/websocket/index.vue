<template>
  <PageWrapper title="Ví dụ về WebSocket">
    <div class="flex">
      <div class="w-1/3 bg-white p-4">
        <div class="flex items-center">
          <span class="text-lg font-medium mr-4">Trạng thái kết nối:</span>
          <Tag :color="getTagColor">{{ status }}</Tag>
        </div>
        <hr class="my-4" />

        <div class="flex">
          <!-- Bỏ disabled để cho phép người dùng nhập giá trị mới -->
          <a-input v-model:value="state.server" addon-before="Địa chỉ máy chủ" />
          <a-button :type="getIsOpen ? 'danger' : 'primary'" @click="toggle">
            {{ getIsOpen ? 'Đóng kết nối' : 'Mở kết nối' }}
          </a-button>
        </div>
        <p class="text-lg font-medium mt-4">Cài đặt</p>
        <hr class="my-4" />

        <InputTextArea
          placeholder="Nội dung cần gửi đến máy chủ"
          :disabled="!getIsOpen"
          v-model:value="state.sendValue"
          allowClear
        />

        <a-button type="primary" block class="mt-4" :disabled="!getIsOpen" @click="handlerSend">
          Gửi
        </a-button>
      </div>

      <div class="w-2/3 bg-white ml-4 p-4">
        <span class="text-lg font-medium mr-4">Nhật ký tin nhắn:</span>
        <hr class="my-4" />

        <div class="max-h-80 overflow-auto">
          <ul>
            <li v-for="item in getList" class="mt-2" :key="item.time">
              <div class="flex items-center">
                <span class="mr-2 text-primary font-medium">Nhận tin nhắn:</span>
                <span>{{ formatToDateTime(item.time) }}</span>
              </div>
              <div>
                {{ item.res }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { reactive, watchEffect, computed, toRef } from 'vue';
  import { Tag, Input } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import { useWebSocket } from '@vueuse/core';
  import { formatToDateTime } from '@/utils/dateUtil';

  const InputTextArea = Input.TextArea;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '127.0.0.1:8000';

  // Sử dụng reactive state
  const state = reactive({
    // Giá trị mặc định ban đầu, người dùng có thể thay đổi
    server: `wss://${String(BACKEND_URL).replace(':8000', '')}:6001/socket.io/?EIO=3&transport=websocket`,
    sendValue: '',
    recordList: [] as { id: number; time: number; res: string }[],
  });

  // Chuyển state.server thành reactive ref để theo dõi sự thay đổi
  const serverRef = toRef(state, 'server');

  // Khởi tạo kết nối WebSocket với serverRef
  const { status, data, send, close, open } = useWebSocket(serverRef, {
    autoReconnect: false,
    heartbeat: true,
  });

  // Theo dõi dữ liệu nhận được từ WebSocket
  watchEffect(() => {
    if (data.value) {
      try {
        const res = JSON.parse(data.value);
        state.recordList.push(res);
      } catch (error) {
        state.recordList.push({
          res: data.value,
          id: Math.ceil(Math.random() * 1000),
          time: new Date().getTime(),
        });
      }
    }
  });

  const getIsOpen = computed(() => status.value === 'OPEN');
  const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red'));
  const getList = computed(() => {
    return [...state.recordList].reverse();
  });

  function handlerSend() {
    send(state.sendValue);
    state.sendValue = '';
  }

  // Hàm toggle sẽ kiểm tra trạng thái kết nối hiện tại
  // Nếu đã mở thì đóng, nếu chưa mở thì mở kết nối mới (sử dụng giá trị hiện tại của state.server)
  function toggle() {
    if (getIsOpen.value) {
      close();
    } else {
      // Khi mở lại, useWebSocket sẽ sử dụng giá trị mới của serverRef
      open();
    }
  }
</script>
