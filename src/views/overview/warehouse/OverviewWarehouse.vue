<template>
  <div
    class="bg-white dark:bg-gray-6 flex flex-row gap-1"
    style="width: 100%; height: calc(100vh - 65px) !important"
  >
    <div class="w-[400px] border-gray-300 border-1 flex flex-col gap-1">
      <Select
        v-model:value="warehouseSelected"
        :options="[
          { label: 'KHO NGUYÊN VẬT LIỆU', value: 'KHO1' },
          { label: 'KHO THÀNH PHẨM', value: 'KHO2' },
          { label: 'KHO BÁN THÀNH PHẨM', value: 'KHO3' },
        ]"
        class="w-full"
        placeholder="Chọn kho"
      />

      <div class="h-[300px] w-full">
        <WarehouseChart />
      </div>
      <div class="h-full w-full">
        <BasicTable @register="registerTable" />
      </div>
    </div>

    <!-- Layout warehouse -->
    <div class="border-gray-300 border-1 w-full h-full p-0 bg-gray-200 dark:bg-gray-6">
      <div class="grid grid-cols-2 gap-4 p-6">
        <!-- Khu A Section -->
        <div class="flex">
          <!-- Khu A Label (Vertical Text) -->
          <div class="flex items-center justify-center bg-blue-700 text-white p-2 w-16">
            <span class="transform -rotate-90 whitespace-nowrap font-bold">Khu A</span>
          </div>

          <!-- Khu A Data -->
          <div class="flex flex-col space-y-1 w-full">
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-18', capacity: 30000, remain: 30000 })"
              >AN-18 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-17', capacity: 30000, remain: 30000 })"
              >AN-17 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-16', capacity: 30000, remain: 27000 })"
              >AN-16 (10% - 27000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-15', capacity: 30000, remain: 30000 })"
              >AN-15 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-14', capacity: 30000, remain: 30000 })"
              >AN-14 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-13', capacity: 30000, remain: 30000 })"
              >AN-13 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-12', capacity: 30000, remain: 30000 })"
              >AN-12 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-11', capacity: 30000, remain: 30000 })"
              >AN-11 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-10', capacity: 30000, remain: 30000 })"
              >AN-10 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-09', capacity: 30000, remain: 27000 })"
              >AN-09 (10% - 27000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-08', capacity: 30000, remain: 30000 })"
              >AN-08 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-07', capacity: 30000, remain: 27000 })"
              >AN-07 (10% - 27000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-06', capacity: 30000, remain: 30000 })"
              >AN-06 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-05', capacity: 30000, remain: 29000 })"
              >AN-05 (3.3% - 29000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-04', capacity: 30000, remain: 28100 })"
              >AN-04 (6.3% - 28100)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-03', capacity: 30000, remain: 28100 })"
              >AN-03 (6.3% - 28100)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'AN-02', capacity: 30000, remain: 27000 })"
              >AN-02 (10% - 27000)</div
            >
            <!-- Sub-row blocks -->
            <div class="flex flex-row gap-1 mt-2 text-size-xs w-full">
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.10</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.9</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.8</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.7</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.6</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.5</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.4</div
              >
              <div
                class="bg-orange-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.3</div
              >
              <div
                class="bg-orange-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.2</div
              >
              <div
                class="bg-orange-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >AN-01.1</div
              >
            </div>
          </div>
        </div>

        <!-- Khu B Section -->
        <div class="flex">
          <!-- Khu B Label (Vertical Text) -->
          <div class="flex items-center justify-center bg-blue-700 text-white p-2 w-16">
            <span class="transform -rotate-90 whitespace-nowrap font-bold">Khu B</span>
          </div>

          <!-- Khu B Data -->
          <div class="flex flex-col space-y-1 w-full">
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-18', capacity: 30000, remain: 27625 })"
              >BN-18 (7.9% - 27625)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-17', capacity: 30000, remain: 30000 })"
              >BN-17 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-16', capacity: 30000, remain: 30000 })"
              >BN-16 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-15', capacity: 30000, remain: 29200 })"
              >BN-15 (2.7% - 29200)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-14', capacity: 30000, remain: 25300 })"
              >BN-14 (15.7% - 25300)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-13', capacity: 30000, remain: 30000 })"
              >BN-13 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-12', capacity: 30000, remain: 30000 })"
              >BN-12 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-11', capacity: 30000, remain: 23000 })"
              >BN-11 (23.3% - 23000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-10', capacity: 30000, remain: 18000 })"
              >BN-10 (40% - 18000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-09', capacity: 30000, remain: 30000 })"
              >BN-09 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-08', capacity: 30000, remain: 22000 })"
              >BN-08 (26.7% - 22000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-07', capacity: 30000, remain: 30000 })"
              >BN-07 (0% - 30000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-06', capacity: 30000, remain: 29000 })"
              >BN-06 (3.3% - 29000)</div
            >
            <div
              class="bg-blue-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-05', capacity: 30000, remain: 30000 })"
              >BN-05 (0% - 30000)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-04', capacity: 30000, remain: 28500 })"
              >BN-04 (5% - 28500)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-03', capacity: 30000, remain: 28500 })"
              >BN-03 (5% - 28500)</div
            >
            <div
              class="bg-orange-500 text-white p-2 text-center cursor-pointer"
              @click="() => showDetail({ id: 'BN-02', capacity: 30000, remain: 27200 })"
              >BN-02 (9.3% - 27200)</div
            >
            <!-- Sub-row blocks -->
            <div class="flex flex-row gap-1 mt-2 text-size-xs w-full">
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.10</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.9</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.8</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.7</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.6</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.5</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.4</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.3</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.2</div
              >
              <div
                class="bg-blue-500 text-white p-1 h-[32px] w-full flex justify-center items-center cursor-pointer"
                >BN-01.1</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <WarehouseModal :width="800" :draggable="true" :maskClosable="true" @register="registerModal" />
  </div>
</template>

<script setup lang="ts">
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';
  import { Select } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import WarehouseChart from './components/WarehouseChart.vue';
  import { useTable } from '@/components/Table';
  import BasicTable from '@/components/Table/src/BasicTable.vue';
  import { getBasicColumns, mockData } from './components/tableData';
  import { useModal } from '@/components/Modal';
  import WarehouseModal from './components/WarehouseModal.vue';

  const oiHeaderStore = useOIHeaderStore();
  const [registerModal, { openModal }] = useModal();

  const warehouseSelected = ref<string>('KHO1');
  const data = ref<any[]>([]);
  const [registerTable] = useTable({
    dataSource: data,
    columns: getBasicColumns(),
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    rowKey: 'id',
    bordered: true,
    pagination: false,
    canResize: true,
  });

  onMounted(() => {
    oiHeaderStore.setTitle('DASHBOARD KHO');
    data.value = mockData();
  });

  function showDetail(record: any) {
    openModal(true, record);
  }
</script>
