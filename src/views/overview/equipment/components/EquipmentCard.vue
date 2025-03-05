<template>
  <Card
    :class="`flex-1 border-gray-300 border-1 shadow-md ${props.value.percent === 0 ? 'bg-gray' : ''}`"
    size="small"
  >
    <div class="h-full w-full flex flex-col relative">
      <div
        :class="`absolute top-[-10px] right-[-10px] w-6 h-6 rounded-full ${props.value.percent === 0 ? 'bg-orange-500' : 'bg-green-500'}`"
      ></div>
      <div class="text-center font-bold text-xl">{{ props.title }}</div>

      <div class="flex flex-row w-full max-h-[300px]">
        <!-- <div class="w-1/4 font-semibold flex justify-center items-center">
          <div class="flex flex-col">
            <CountTo
              :startVal="1"
              :endVal="props.value.number1"
              class="text-2xl font-semibold text-blue-800"
            />
            <CountTo
              :startVal="1"
              :endVal="props.value.number2"
              class="text-2xl font-semibold text-blue-800"
            />
          </div>
        </div>
        <div class="w-3/4 h-[150px]">
          <EquipmentChart :value="props.chart" />
        </div> -->
        <div class="w-full h-[150px]">
          <EquipmentChart :value="props.chart" />
        </div>
      </div>
      <div class="text-center font-bold">
        <CountTo
          suffix="%"
          :startVal="1"
          :endVal="props.value.percent"
          :decimals="2"
          class="text-4xl font-semibold text-blue-800"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
  import CountTo from '@/components/CountTo/src/CountTo.vue';
  import { Card } from 'ant-design-vue';
  import EquipmentChart from './EquipmentChart.vue';

  const props = defineProps({
    loading: Boolean,
    title: {
      type: String as PropType<string>,
      default: 'Thiết bị',
    },
    value: {
      type: Object as PropType<{ number1: number; number2: number; percent: number }>,
      default: () => ({ number1: 0, number2: 0, percent: 0 }),
    },
    chart: {
      type: Array as PropType<{ name: string; value: number }[]>,
      default: () => [],
    },
  });
</script>
