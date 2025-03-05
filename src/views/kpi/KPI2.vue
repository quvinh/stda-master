<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <KPISidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 flex flex-col gap-1 h-full w-[600px] bg-white overflow-y-auto">
      <div class="h-2/3">
        <TableChart />
      </div>
      <div class="h-1/3">
        <Card
          class="h-full border-gray-300 border-1"
          :bodyStyle="{ padding: '2px!important' }"
          size="small"
          title="Bảng thông tin chi tiết các chỉ số KPI"
        >
          <BasicTable @register="registerTable" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount, reactive } from 'vue';
  import echo from '@/utils/echo';
  import TableChart from './components/TableChart.vue';
  import KPISidebar from './components/KPISidebar.vue';
  import dayjs from 'dayjs';
  import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
  import { PagesReloadEnum } from '@/api/sys/enums/pagesReloadEnum';
  import { Card } from 'ant-design-vue';
  import { BasicTable, useTable } from '@/components/Table';

  dayjs.extend(isSameOrBefore);

  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });

  const dateRange = ref<string[]>([]);
  const columns = ref<any[]>([]);

  const kpiData = reactive([
    { name: 'Tỷ lệ hoàn thành kế hoạch', target: 90, ...generateResults() },
    { name: 'Hiệu suất thiết bị', target: 85, ...generateResults() },
    { name: 'Tỷ lệ đạt chất lượng OQC', target: 85, ...generateResults() },
    { name: 'Tỷ lệ lỗi công đoạn', target: 2, ...generateResults1() }, // Sử dụng generateResults1 cho chỉ số này
  ]);

  const [registerTable] = useTable({
    dataSource: kpiData,
    columns: columns,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    size: 'small',
    bordered: true,
    pagination: false,
    scroll: { x: 1200, y: 500 },
  });

  const oeeData = reactive<{ oee: any[]; a: any[]; p: any[]; q: any[] }>({
    oee: [
      { value: 25, name: 'Usage' },
      { value: 75, name: 'Remain' },
    ],
    a: [
      { value: 50, name: 'Usage' },
      { value: 50, name: 'Remain' },
    ],
    p: [
      { value: 50, name: 'Usage' },
      { value: 50, name: 'Remain' },
    ],
    q: [
      { value: 100, name: 'Usage' },
      { value: 0, name: 'Remain' },
    ],
  });

  onMounted(() => {
    loadEchoInit();
    const intervalId = setInterval(() => {
      const usageA = getRandomValue(70, 85);
      const usageP = getRandomValue(65, 85);
      const usageQ = getRandomValue(80, 99);
      const usageOEE = Number(((usageA * usageP * usageQ) / 10000).toFixed(1));
      oeeData.oee = [
        { value: usageOEE, name: 'Usage' },
        { value: 100 - usageOEE, name: 'Remain' },
      ];
      oeeData.a = [
        { value: usageA, name: 'Usage' },
        { value: 100 - usageA, name: 'Remain' },
      ];
      oeeData.p = [
        { value: usageP, name: 'Usage' },
        { value: 100 - usageP, name: 'Remain' },
      ];
      oeeData.q = [
        { value: usageQ, name: 'Usage' },
        { value: 100 - usageQ, name: 'Remain' },
      ];
    }, 3000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  });

  function getRandomValue(min: number, max: number): number {
    return parseInt((Math.random() * (max - min) + min).toFixed(2));
  }

  function handleSidebarFilter(values) {
    console.log('Data from sidebar', values);
  }

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

  onMounted(() => {
    const startDate = dayjs().subtract(6, 'day');
    const today = dayjs();
    let currentDate = startDate;

    while (currentDate.isSameOrBefore(today)) {
      dateRange.value.push(currentDate.format('DD-MM-YYYY'));
      currentDate = currentDate.add(1, 'day');
    }

    // Cập nhật lại kpiData sau khi dateRange đã được tính toán
    kpiData.forEach((item) => {
      const results = item.name === 'Tỷ lệ lỗi công đoạn' ? generateResults1() : generateResults(); // Kiểm tra tên chỉ số và gọi hàm tương ứng
      // Gán lại giá trị cho results của mỗi item
      Object.assign(item, results);
    });

    columns.value = [
      {
        title: 'Tên chỉ số',
        dataIndex: 'name',
        key: 'name',
        width: 250,
        fixed: 'left',
        align: 'center',
      },
      {
        title: 'Mục tiêu',
        dataIndex: 'target',
        key: 'target',
        width: 250,
        fixed: 'left',
        align: 'right',
      },
      {
        title: 'Kết quả',
        children: [
          ...dateRange.value.map((date) => ({
            title: date,
            dataIndex: date,
            key: date,
            width: 100,
            align: 'right',
          })),
        ],
      },
    ];
  });

  function generateResults() {
    const results: Record<string, number> = {};
    dateRange.value.forEach((date) => {
      results[date] = getRandomValue(85, 93);
    });
    return results; // Trả về object với kết quả mới cho từng chỉ số
  }

  function generateResults1() {
    const results: Record<string, number> = {};
    const valueDate = [0, 0, 2, 1, 0, 1, 0];

    dateRange.value.forEach((date, index) => {
      results[date] = valueDate[index] || 0;
    });

    return results;
  }

  onBeforeUnmount(() => {
    echo.leaveChannel('laravel_database_reloadchannel');
  });
</script>
