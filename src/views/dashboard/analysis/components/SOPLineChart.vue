<template>
  <Card class="h-full" size="small" title="Tỷ lệ thực thi SoP" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '300px',
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
      const xData = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const yData = [1400, 1450, 1500, 1480, 1520, 1600, 1650, 1700, 1750];
      const yData2 = [1350, 1400, 1450, 1420, 1500, 1580, 1600, 1680, 1730];
      setOptions({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['SoP Line', 'SoP Line 2'],
          top: '10px',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} k',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            name: 'SoP Line',
            type: 'line',
            data: yData,
            smooth: true,
            symbol: 'square',
            symbolSize: 10,
            lineStyle: {
              color: '#1890FF',
              width: 2,
            },
            itemStyle: {
              color: '#1890FF',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(24, 144, 255, 0.5)' }, // Blue color at the top
                  { offset: 1, color: 'rgba(24, 144, 255, 0)' }, // Transparent at the bottom
                ],
              },
            },
          },
          {
            name: 'SoP Line 2',
            type: 'line',
            data: yData2,
            smooth: true,
            symbol: 'square',
            symbolSize: 10,
            lineStyle: {
              color: '#52c41a',
              width: 2,
            },
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
