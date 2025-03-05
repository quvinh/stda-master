<template>
  <div
    class="p-1 border-gray-300 border-1 bg-white"
    ref="chartRef"
    :style="{ width, height }"
  ></div>
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
          text: 'Biểu đồ điện năng tiêu thụ',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis', // Display the tooltip when hovering over the axis
          formatter: '{b}: {c} kWh', // Format of the tooltip content
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Background color of the tooltip
          textStyle: {
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
            symbol: 'triangle',
            symbolSize: 20,
            lineStyle: {
              color: '#5470C6',
              width: 4,
              type: 'dashed',
            },
            itemStyle: {
              borderWidth: 3,
              borderColor: '#EE6666',
              color: 'yellow',
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
