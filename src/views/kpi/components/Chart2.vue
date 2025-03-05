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
          text: 'Biểu đồ chất lượng',
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
            crossStyle: {
              color: '#999',
            },
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: false },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ['Evaporation', 'Tỷ lệ lỗi'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Lỗi',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} lỗi',
            },
          },
          {
            type: 'value',
            name: 'Tỷ lệ lỗi',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} %',
            },
          },
        ],
        series: [
          {
            name: 'Lỗi',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + ' ml';
              },
            },
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          },
          {
            name: 'Tỷ lệ lỗi',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + '';
              },
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            symbol: 'circle', // Thiết lập dạng biểu tượng
            symbolSize: 10,
            lineStyle: {
              width: 3,
              color: '#e3ad30',
            },
            itemStyle: {
              color: '#e3ad30',
              borderWidth: 0, // Xóa outline trắng
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
