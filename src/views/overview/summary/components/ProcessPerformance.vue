<template>
  <div class="border-gray-300 border-1 shadow-md" ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        title: {
          text: 'Hiệu suất công đoạn',
          left: 'center',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'CĐ IN', max: 6500 },
            { name: 'CĐ Bồi', max: 16000 },
            { name: 'CĐ Dán', max: 30000 },
            { name: 'CĐ Đóng gói', max: 38000 },
            { name: 'CĐ Cắt', max: 52000 },
            { name: 'CĐ Phủ', max: 25000 },
          ],
          radius: '58%',
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget',
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending',
              },
            ],
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
