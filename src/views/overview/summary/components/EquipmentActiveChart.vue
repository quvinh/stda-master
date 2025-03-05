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
          text: 'Thiết bị sẵn sàng',
          left: 'center',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680',
            },
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
        xAxis: {
          type: 'category',
          data: [...new Array(12)].map((_item, index) => `${index + 1}`),
        },
        yAxis: {
          type: 'value',
          max: 8000,
          splitNumber: 4,
        },
        series: [
          {
            data: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200, 4800],
            type: 'bar',
            barMaxWidth: 80,
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
