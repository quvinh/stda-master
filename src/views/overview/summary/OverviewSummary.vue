<template>
  <div
    class="bg-white flex flex-col gap-1"
    style="width: 100%; height: calc(100vh - 60px) !important"
  >
    <div class="h-1/2 flex flex-row w-full gap-1">
      <div class="w-7/10 flex flex-col h-full gap-1">
        <div class="h-1/3 flex flex-row w-full gap-1">
          <!-- Cards -->
          <div class="w-1/5">
            <Card
              size="small"
              title="Đơn đã hoàn thành"
              class="h-full border-gray-300 border-1 shadow-md"
            >
              <CountTo :startVal="1" :endVal="23" class="text-2xl font-semibold text-blue-800" />
            </Card>
          </div>
          <div class="w-1/5">
            <Card
              size="small"
              title="Số lượng đầu ra"
              class="h-full border-gray-300 border-1 shadow-md"
            >
              <CountTo
                :startVal="1"
                :endVal="117500"
                class="text-2xl font-semibold text-blue-800"
              />
            </Card>
          </div>
          <div class="w-1/5">
            <Card
              size="small"
              title="Số lượng đạt"
              class="h-full border-gray-300 border-1 shadow-md"
            >
              <CountTo
                :startVal="1"
                :endVal="115900"
                class="text-2xl font-semibold text-blue-800"
              />
            </Card>
          </div>
          <div class="w-1/5">
            <Card
              size="small"
              title="Số lượng hàng lỗi"
              class="h-full border-gray-300 border-1 shadow-md"
            >
              <CountTo :startVal="1" :endVal="1600" class="text-2xl font-semibold text-blue-800" />
            </Card>
          </div>
          <div class="w-1/5">
            <Card
              size="small"
              title="Tỷ lệ đạt thẳng"
              class="h-full border-gray-300 border-1 shadow-md"
            >
              <CountTo
                suffix="%"
                :startVal="1"
                :endVal="98.64"
                :decimals="2"
                class="text-2xl font-semibold text-blue-800"
              />
            </Card>
          </div>
        </div>

        <div class="h-2/3 flex flex-row w-full gap-1">
          <div class="w-3/10">
            <!-- Tình hình đơn hàng sản xuất -->
            <ProductionOrderChart />
          </div>
          <div class="w-7/10">
            <!-- Sản lượng và tỷ lệ lỗi chất lượng -->
            <QualityErrorPercentChart />
          </div>
        </div>
      </div>

      <div class="w-3/10">
        <!-- Tỷ lệ thành phần lỗi chất lượng -->
        <ProductionErrorChart />
      </div>
    </div>
    <div class="h-1/2 flex flex-col h-full gap-1">
      <div class="h-1/2 flex flex-row w-full gap-1">
        <div class="w-6/10 flex flex-row w-full border-gray-300 border-1 shadow-md">
          <div class="w-1/4">
            <OEEGaugeChart title="OEE" :value="oeeGaugeData.oee" />
          </div>
          <div class="w-1/4">
            <OEEGaugeChart title="Tỷ lệ sẵn sàng" :value="oeeGaugeData.a" />
          </div>
          <div class="w-1/4">
            <OEEGaugeChart title="Hiệu suất" :value="oeeGaugeData.p" />
          </div>
          <div class="w-1/4">
            <OEEGaugeChart title="Chất lượng" :value="oeeGaugeData.q" />
          </div>
        </div>
        <div class="w-2/10">
          <EquipmentChart />
        </div>
        <div class="w-2/10">
          <!-- Hiệu suất công đoạn -->
          <ProcessPerformance />
        </div>
      </div>
      <div class="h-1/2 flex flex-row w-full gap-1">
        <div class="w-4/10">
          <OEEKPIChart />
        </div>
        <div class="w-4/10">
          <EquipmentActiveChart />
        </div>
        <div class="w-2/10 flex flex-col gap-1 h-full">
          <div
            class="h-1/4 w-full flex flex-col justify-center items-center gap-1 border-gray-300 border-1 shadow-md"
          >
            <CountTo :startVal="1" :endVal="64.4" :decimals="2" class="text-2xl text-red-500" />
            <div class="font-bold text-blue-800 dark:text-white">Dừng máy không kế hoạch</div>
          </div>

          <div
            class="h-1/4 w-full flex flex-col justify-center items-center gap-1 border-gray-300 border-1 shadow-md"
          >
            <CountTo :startVal="1" :endVal="26.7" :decimals="2" class="text-2xl" />
            <div class="font-bold text-blue-800 dark:text-white">Dừng máy có kế hoạch</div>
          </div>

          <div
            class="h-1/4 w-full flex flex-col justify-center items-center gap-1 border-gray-300 border-1 shadow-md"
          >
            <CountTo :startVal="1" :endVal="2" class="text-2xl text-red-500" />
            <div class="font-bold text-blue-800 dark:text-white">Máy không kế hoạch</div>
          </div>

          <div
            class="h-1/4 w-full flex flex-col justify-center items-center gap-1 border-gray-300 border-1 shadow-md"
          >
            <CountTo :startVal="1" :endVal="5" class="text-2xl" />
            <div class="font-bold text-blue-800 dark:text-white">Máy có kế hoạch</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CountTo from '@/components/CountTo/src/CountTo.vue';
  import { Card } from 'ant-design-vue';
  import ProductionErrorChart from './components/ProductionErrorChart.vue';
  import ProductionOrderChart from './components/ProductionOrderChart.vue';
  import QualityErrorPercentChart from './components/QualityErrorPercentChart.vue';
  import EquipmentChart from './components/EquipmentChart.vue';
  import ProcessPerformance from './components/ProcessPerformance.vue';
  import EquipmentActiveChart from './components/EquipmentActiveChart.vue';
  import OEEKPIChart from './components/OEEKPIChart.vue';
  import OEEGaugeChart from './components/OEEGaugeChart.vue';
  import { onMounted, reactive, onBeforeUnmount } from 'vue';
  import { useOIHeaderStore } from '@/store/modules/states/oi/header';

  const oiHeaderStore = useOIHeaderStore();
  const oeeGaugeData = reactive<{ oee: number; a: number; p: number; q: number }>({
    oee: 65.6,
    a: 85.8,
    p: 80.5,
    q: 90.6,
  });

  onMounted(() => {
    oiHeaderStore.setTitle('DASHBOARD TỔNG HỢP');
    const intervalId = setInterval(() => {
      oeeGaugeData.oee = getRandomValue(64.5, 70.5);
      oeeGaugeData.a = getRandomValue(85, 86.7);
      oeeGaugeData.p = getRandomValue(80.1, 82.5);
      oeeGaugeData.q = getRandomValue(90.2, 95.2);
    }, 3000);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  });

  function getRandomValue(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  }
</script>
