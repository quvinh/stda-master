<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import dayjs from 'dayjs';

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

    // Start from today and go backwards for 7 days
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
          text: 'Tỷ lệ lỗi theo line',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Line1', 'Line2', 'Line3'],
          right: 0,
          textStyle: {
            fontSize: 10,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: getLast7Days(),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Line1',
            type: 'line',
            step: 'start',
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: 'Line2',
            type: 'line',
            step: 'middle',
            data: [220, 282, 201, 234, 290, 430, 410],
          },
          {
            name: 'Line3',
            type: 'line',
            step: 'end',
            data: [450, 432, 401, 454, 590, 530, 510],
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
