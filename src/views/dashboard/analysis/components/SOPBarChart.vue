<template>
  <Card class="h-full" size="small" title="Thông số môi trường" :loading="loading">
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
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        legend: {
          data: ['Bốc hơi', 'Lượng mưa', 'Nhiệt độ'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Lượng mưa',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml',
            },
          },
          {
            type: 'value',
            name: 'Nhiệt độ',
            min: 0,
            max: 40,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C',
            },
          },
        ],
        series: [
          {
            name: 'Bốc hơi',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' ml';
              },
            },
            data: [5.0, 10.0, 15.0, 22.0, 30.0, 80.0, 140.0],
          },
          {
            name: 'Lượng mưa',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' ml';
              },
            },
            data: [10.0, 20.0, 30.0, 50.0, 70.0, 90.0, 110.0],
          },
          {
            name: 'Nhiệt độ',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' °C';
              },
            },
            data: [22.0, 24.0, 26.0, 28.0, 30.0, 32.0, 33.0],
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
