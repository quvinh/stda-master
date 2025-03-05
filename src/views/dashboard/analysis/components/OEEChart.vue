<template>
  <Card class="h-full" size="small" title="Tỷ lệ OEE" :loading="loading">
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
      setOptions({
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100, // Update max to 100
            splitNumber: 10, // Adjust split number if needed
            itemStyle: {
              color: '#FFAB91',
            },
            progress: {
              show: true,
              width: 30,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 30,
              },
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 20,
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '80%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 40,
              fontWeight: 'bolder',
              formatter: '{value}%',
              color: 'inherit',
            },
            data: [
              {
                value: 55,
                name: 'OEE',
              },
            ],
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100, // Update max to 100
            itemStyle: {
              color: '#FD7347',
            },
            progress: {
              show: true,
              width: 8,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 55,
                name: 'OEE',
              },
            ],
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
