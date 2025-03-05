<template>
  <draggable
    v-model="chartItems"
    class="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1"
    item-key="id"
    animation="300"
    chosenClass="chosen"
    forceFallback="true"
  >
    <template #item="{ element }">
      <div class="col-span-1 row-span-1" :key="element.id">
        <component :is="element.component" v-bind="element.props" />
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import Chart1 from './components/Chart1.vue';
  import Chart2 from './components/Chart2.vue';
  import Chart3 from './components/Chart3.vue';
  import Chart4 from './components/Chart4.vue';
  import echo from '@/utils/echo';
  import { PagesReloadEnum } from '@/api/sys/enums/pagesReloadEnum';
  import draggable from 'vuedraggable/src/vuedraggable';

  const chartItems = ref<any[]>([
    { id: 1, component: Chart1, props: { title: 'Biểu đồ sản xuất', data: [1, 2, 3] } },
    { id: 2, component: Chart2, props: { title: 'Biểu đồ chất lượng', data: [] } },
    { id: 3, component: Chart3, props: { title: 'Biểu đồ điện năng tiêu thụ', data: [] } },
    { id: 4, component: Chart4, props: { title: 'Tỷ lệ lỗi chất lượng theo công đoạn', data: [] } },
  ]);

  onMounted(() => {
    loadEchoInit();
  });

  /**
   * @description connect websocket
   */
  function loadEchoInit() {
    echo.connector.socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    echo.channel('laravel_database_reloadchannel').listen('.reload-event', (event: any) => {
      const data: any = event?.data;
      if (data?.reload_window === true) {
        window.location.reload();
        return;
      }
      if (data?.page === PagesReloadEnum.KPI) {
        // Load data
        console.log('load data');
      }
    });
  }

  onBeforeUnmount(() => {
    echo.leaveChannel('laravel_database_reloadchannel');
  });
</script>
