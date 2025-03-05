<template>
  <div class="flex pt-1 h-full">
    <div class="hidden lg:block w-[270px] mr-1">
      <LoadFactorSidebar :filter="filter" @success="handleSidebarFilter" />
    </div>
    <div class="flex-1 w-[600px] bg-white flex flex-col h-full">
      <Card
        class="h-1/2 border-gray-300 border-1"
        :bodyStyle="{ padding: '0px!important', height: '85%' }"
        size="small"
        title="Hệ số tải"
      >
        <template #extra>
          <div class="p-3 pl-3 font-500 flex justify-between">
            <div class="flex gap-2">
              <Button type="primary" size="small">Upload Excel</Button>
              <Button type="primary" size="small">Export Excel</Button>
            </div>
          </div>
        </template>
        <LoadFactorChart />
      </Card>
      <Card
        class="h-1/2 border-gray-300 border-1 mt-1"
        :bodyStyle="{ padding: '0px!important', height: '85%' }"
        size="small"
        title="Tiến độ sản xuất"
        ><BasicTable @register="registerMiddleTable"
      /></Card>
      <!-- <Card
        class="h-2.5/6 border-gray-300 border-1 mt-1"
        :bodyStyle="{ padding: '0px!important', height: '85%' }"
        size="small"
        title="Tiến độ sản xuất"
        ><BasicTable @register="registerTable"
      /></Card> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import LoadFactorChart from './components/LoadFactorChart.vue';
  import LoadFactorSidebar from './components/LoadFactorSidebar.vue';
  import { ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  // import { getBasicColumns } from './components/tableLoadFactor';
  import { Button, Card } from 'ant-design-vue';
  import { columns } from './components/tableLoadFactor';

  const data1 = ref([
    {
      key: 1,
      maCongDoan: 'BE',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 32752,
        plan: 17772,
        load_factor: 54.3,
      },
      day9: {
        machine_capa: 26803,
        plan: 11515,
        load_factor: 43.0,
      },
      day10: {
        machine_capa: 32422,
        plan: 20139,
        load_factor: 62.1,
      },
      day11: {
        machine_capa: 27491,
        plan: 12725,
        load_factor: 46.3,
      },
      day12: {
        machine_capa: 28454,
        plan: 15222,
        load_factor: 53.5,
      },
      day13: {
        machine_capa: 30169,
        plan: 15845,
        load_factor: 52.5,
      },
    },
    {
      key: 2,
      maCongDoan: 'BOI',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 27676,
        plan: 16812,
        load_factor: 60.7,
      },
      day9: {
        machine_capa: 22442,
        plan: 10917,
        load_factor: 48.6,
      },
      day10: {
        machine_capa: 23364,
        plan: 12741,
        load_factor: 54.5,
      },
      day11: {
        machine_capa: 26602,
        plan: 14160,
        load_factor: 53.2,
      },
      day12: {
        machine_capa: 21741,
        plan: 11121,
        load_factor: 52.2,
      },
    },
    {
      key: 3,
      maCongDoan: 'DAN',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 5152,
        plan: 1742,
        load_factor: 33.8,
      },
      day9: {
        machine_capa: 6401,
        plan: 3761,
        load_factor: 58.8,
      },
      day10: {
        machine_capa: 6399,
        plan: 3582,
        load_factor: 56.0,
      },
      day11: {
        machine_capa: 5880,
        plan: 3061,
        load_factor: 52.1,
      },
      day12: {
        machine_capa: 5679,
        plan: 2962,
        load_factor: 52.2,
      },
    },
    {
      key: 4,
      maCongDoan: 'EPNHU',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 5468,
        plan: 2566,
        load_factor: 46.9,
      },
      day9: {
        machine_capa: 6141,
        plan: 3154,
        load_factor: 51.4,
      },
      day10: {
        machine_capa: 5385,
        plan: 2224,
        load_factor: 41.3,
      },
      day11: {
        machine_capa: 5039,
        plan: 1702,
        load_factor: 33.8,
      },
      day12: {
        machine_capa: 5204,
        plan: 2377,
        load_factor: 45.7,
      },
    },
    {
      key: 5,
      maCongDoan: 'IN',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 10452,
        plan: 4815,
        load_factor: 46.1,
      },
      day9: {
        machine_capa: 12730,
        plan: 6476,
        load_factor: 50.9,
      },
      day10: {
        machine_capa: 13114,
        plan: 8270,
        load_factor: 63.1,
      },
      day11: {
        machine_capa: 14027,
        plan: 8767,
        load_factor: 62.5,
      },
      day12: {
        machine_capa: 13364,
        plan: 7438,
        load_factor: 55.7,
      },
    },
    {
      key: 5,
      maCongDoan: 'KIEMHANG',
      phanLoai: ['Capa máy', 'Kế hoạch', 'Hệ số tải'],
      day8: {
        machine_capa: 3237,
        plan: 1751,
        load_factor: 54.1,
      },
      day9: {
        machine_capa: 2934,
        plan: 1720,
        load_factor: 58.6,
      },
      day10: {
        machine_capa: 2080,
        plan: 970,
        load_factor: 46.6,
      },
      day11: {
        machine_capa: 3646,
        plan: 2135,
        load_factor: 58.6,
      },
      day12: {
        machine_capa: 3714,
        plan: 2620,
        load_factor: 70.5,
      },
    },
  ]);

  const filter = ref<any>({
    dates: [dayjs().subtract(7, 'day'), dayjs()],
  });
  const loading = ref<boolean>(false);

  // const [registerTable] = useTable({
  //   title: '',
  //   dataSource: [],
  //   columns: getBasicColumns(),
  //   useSearchForm: false,
  //   showTableSetting: false,
  //   showIndexColumn: true,
  //   rowKey: 'id',
  //   bordered: true,
  //   loading,
  //   pagination: true,
  //   // handleSearchInfoFn,
  // });

  const [registerMiddleTable] = useTable({
    dataSource: data1,
    columns: columns,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    rowKey: 'id',
    bordered: true,
    loading,
    isCanResizeParent: true,
  });

  function handleSidebarFilter(values) {
    console.log('Data from sidebar', values);
  }
</script>
