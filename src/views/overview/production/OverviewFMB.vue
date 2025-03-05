<template>
  <div :style="{ display: selectedShow.view1 }">
    <div class="bg-white flex flex-col gap-1" style="width: 100%; margin-bottom: 100px">
      <BasicTable class="table-fmb" @register="registerTable" />
    </div>
    <div
      class="flex flex-row justify-around mt-4 row"
      style="display: flex; position: absolute; z-index: 1000; bottom: 0; width: 100%; height: 80px"
    >
      <div class="flex items-center wrapper" style="height: 65px">
        <div class="orange-cricle" style="width: 50px; height: 50px"></div>
        <span class="text">Đang dừng</span>
      </div>
      <div class="flex items-center wrapper" style="height: 65px">
        <div class="cricle" style="width: 50px; height: 50px"></div>
        <span class="text">Đang hoạt động</span>
      </div>
      <div class="flex items-center wrapper" style="height: 65px">
        <div class="blue-cricle" style="width: 50px; height: 50px"></div>
        <span class="text">Hoàn thành</span>
      </div>
    </div>
  </div>
  <div :style="{ display: selectedShow.view2 }">
    <ThreeDModel />
  </div>
</template>

<script setup lang="ts">
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { useTable } from '@/components/Table';
  import { getFMBColumns, mockFMBData, shuffleArray } from './components/tableData';
  import ApiResponse from '@/api/ApiResponse';
  import axiosInstance from '@/api/resource/axiosInstance';
  import ThreeDModel from '../sketchfab/3DModel.vue';
  import echo from '@/utils/echo';

  const oiHeaderStore = useOIHeaderStore();
  const selectedShow = ref<any>({
    view1: 'block',
    view2: 'none', // Khởi tạo với một chuỗi rỗng để lưu kết quả
  });

  export interface FmbColumnType {
    id: string;
    equipment_id: string;
    product_id: string;
    process_id: string;
    planned_quantity: number;
    production_plan_quantity: number;
    actual_quantity: number;
    ng_quantity: number;
    ng_percentage: number;
    complete_percentage: number;
    status: 'producing' | 'completed' | 'stopped';
  }

  const data = ref<FmbColumnType[]>([]);

  const [registerTable] = useTable({
    dataSource: data,
    columns: getFMBColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    bordered: true,
    pagination: false,
    canResize: true,
    size: 'middle',
    rowClassName: () => 'row-fmb',
  });

  const fetch = async () => {
    const response: ApiResponse<FmbColumnType[]> = await axiosInstance.get(
      'v1/manufacture/new-today-production-fmb',
      {
        params: {
          date: new Date().toISOString(),
        },
      },
    );
    if (response.success && response.data) {
      data.value = response.data;
    }
  };

  const scrollData = () => {
    const newData = [...data.value];
    const firstRow: FmbColumnType | undefined = newData.shift();
    if (firstRow) {
      newData.push(firstRow);
      data.value = newData;
    }
  };

  onMounted(() => {
    oiHeaderStore.setTitle('TÌNH HÌNH SẢN XUẤT');
    fetch();
    const intervalId = setInterval(() => {
      scrollData();
    }, 3000);

    const fetchId = setInterval(() => {
      fetch();
    }, 15000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
      clearInterval(fetchId);
    });
    loadEchoInit();
  });

  function loadEchoInit() {
    echo.connector.socket.on('connect', () => {
      console.log('WebSocket connected!');
    });
    echo.channel('laravel_database_abnormalchannel').listen('.abnormal-event', (event: any) => {
      console.log(event?.abnormalData);
      const data = event?.abnormalData;
      if (data && (data.status == 0 || data.status == 1)) {
        oiHeaderStore.setTitle('CẢNH BÁO BẤT THƯỜNG');
        selectedShow.value.view1 = 'none';
        selectedShow.value.view2 = 'block';
      } else {
        oiHeaderStore.setTitle('TÌNH HÌNH SẢN XUẤT');
        selectedShow.value.view1 = 'block';
        selectedShow.value.view2 = 'none';
      }
    });
  }
</script>

<style scoped>
  th > .ant-table-cell {
    font-size: 1.9rem !important;
  }

  .row {
    position: sticky;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: white;
  }

  .wrapper {
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    margin-right: 8px;
    margin-left: 8px;
    padding-right: 12px;
    padding-left: 12px;
    border-width: 1px;
    border-radius: 4px;
    border-color: grey;
  }

  .cricle {
    width: 60px;
    height: 60px;
    border-radius: 50px;
    background-color: green;
  }

  .orange-cricle {
    width: 60px;
    height: 60px;
    border-radius: 50px;
    background-color: orange;
  }

  .blue-cricle {
    width: 60px;
    height: 60px;
    border-radius: 50px;
    background-color: blue;
  }

  .text {
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .table-fmb {
    margin-bottom: 48px;
  }
</style>
