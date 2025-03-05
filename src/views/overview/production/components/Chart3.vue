<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { useECharts } from '@/hooks/web/useECharts';
  import dayjs from 'dayjs';
  import { computed, Ref, ref, watch } from 'vue';

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
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
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
      const last7Days = computed(() => props.data.map((item) => dayjs(item.date).format('MM/DD')));
      const cycleTime = computed(() => props.data.map((item) => item.cycle_time));
      const dataa = computed(() => (last7Days.value.length > 0 ? ['Cycle time', 'Takt time'] : []));

      setOptions({
        legend: {
          top: 0,
          right: 0,
          data: dataa.value,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: last7Days.value,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Cycle time',
            type: 'bar',
            barWidth: '60%',
            data: cycleTime.value,
          },
          {
            name: 'Takt time', // Line series with dots
            type: 'line',
            data: cycleTime.value,
            smooth: true, // Make the line smooth
            lineStyle: {
              width: 2,
              color: '#ff0000', // Customize line color to match dots
            },
            itemStyle: {
              color: '#ff0000', // Set the color of the dots (matches the line)
              borderWidth: 2,
            },
            symbol: 'circle', // Set the shape of the dots (circle)
            symbolSize: 8, // Set the size of the dots
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
