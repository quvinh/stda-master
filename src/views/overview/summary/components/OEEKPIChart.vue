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
          text: 'OEE KPI',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          data: ['OEE', 'Sẵn sàng', 'Hiệu suất', 'Chất lượng'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'OEE',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210],
            symbol: 'circle', // Thiết lập dạng biểu tượng
            symbolSize: 10,
            lineStyle: {
              width: 2,
              color: '#ff4d4f',
            },
            itemStyle: {
              color: '#ff4d4f',
              borderWidth: 0, // Xóa outline trắng
            },
          },
          {
            name: 'Sẵn sàng',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310],
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 2,
              color: '#ffa940',
            },
            itemStyle: {
              color: '#ffa940',
              borderWidth: 0,
            },
          },
          {
            name: 'Hiệu suất',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410],
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 2,
              color: '#36cfc9',
            },
            itemStyle: {
              color: '#36cfc9',
              borderWidth: 0,
            },
          },
          {
            name: 'Chất lượng',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320],
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 2,
              color: '#597ef7',
            },
            itemStyle: {
              color: '#597ef7',
              borderWidth: 0,
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
