<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

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

  function getLast7Days(): string[] {
    const daysArray: string[] = [];
    for (let i = 6; i >= 0; i--) {
      daysArray.push(dayjs().subtract(i, 'day').format('DD/MM'));
    }
    return daysArray;
  }

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        title: {
          text: 'Biểu đồ sản xuất',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          data: ['Kế hoạch', 'Kết quả'],
          right: 0,
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
            boundaryGap: false,
            data: getLast7Days(),
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Kế hoạch',
            type: 'line',
            stack: 'Total',
            // areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [225, 185, 195, 235, 300, 330, 310],
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              width: 3,
              color: '#ffa940',
            },
            itemStyle: {
              color: '#ffa940',
              borderWidth: 0,
            },
          },
          {
            name: 'Kết quả',
            type: 'line',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(13, 89, 189, 0.5)' },
                { offset: 1, color: 'rgba(13, 89, 189, 0)' },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 280, 285],
            symbol: 'circle',
            symbolSize: 7,
            lineStyle: {
              width: 3,
              color: '#0d59bd',
            },
            itemStyle: {
              color: '#0d59bd',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
