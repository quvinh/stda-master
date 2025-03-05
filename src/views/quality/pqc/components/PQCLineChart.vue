<template>
  <div class="w-full h-full" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import dayjs from 'dayjs';

  const props = defineProps({
    data: {
      type: Array as PropType<
        Array<{
          date: string;
          processes: Array<{
            process_id: string;
            errors: number;
            rate: number;
          }>;
        }>
      >,
      default: () => [],
    },
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
    () => props.data,
    (newData) => {
      if (props.loading || newData.length === 0) {
        return;
      }
      const dates = newData
        .slice()
        .reverse()
        .map((item) => dayjs(item.date).format('DD/MM'));

      const processMap = new Map<string, number[]>();
      newData.forEach(() => {
        newData.forEach((item, index) => {
          item.processes.forEach((process) => {
            if (!processMap.has(process.process_id)) {
              processMap.set(process.process_id, new Array(newData.length).fill(0));
            }
            processMap.get(process.process_id)![index] = process.errors;
          });
        });
      });

      // Prepare series data for the chart
      const seriesData: any[] = [];
      const colors = ['#ff4d4f', '#ffa940', '#36cfc9', '#597ef7', '#722ed1', '#73d13d', '#f759ab'];
      let colorIndex = 0;

      for (const [process_id, dataArray] of processMap.entries()) {
        const color = colors[colorIndex % colors.length];
        seriesData.push({
          name: process_id,
          type: 'line',
          data: dataArray,
          symbol: 'circle',
          symbolSize: 8,
          fontFamily: 'Arial, sans-serif',
          lineStyle: {
            width: 2,
            color: color,
          },
          itemStyle: {
            color: color,
            borderWidth: 0,
          },
        });
        colorIndex++;
      }

      setOptions({
        // title: {
        //   text: 'Lỗi theo ngày',
        //   textStyle: {
        //     fontFamily: 'Arial, sans-serif',
        //     fontSize: 16,
        //     fontWeight: 'bold',
        //   },
        // },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          data: newData.length > 0 ? Array.from(processMap.keys()) : [],
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
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: newData.length > 0 ? dates : [],
        },
        yAxis: {
          type: 'value',
        },
        series: newData.length > 0 ? seriesData : [],
      });
    },
    { immediate: true },
  );
</script>

<!-- <style scoped>
  .title {
    font-family: 'Arial, sans-serif';
    font-size: 16;
    font-weight: 'bold';
  }
</style> -->
