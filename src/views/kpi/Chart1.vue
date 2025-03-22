<template>
  <div class="w-full h-full" ref="chartRef" :style="{ width, height }"></div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import * as echarts from 'echarts';

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

  type EChartsOption = echarts.EChartsOption;

  var chartDom = document.getElementById('main')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  const data1: number[] = [];
  for (let i = 0; i < 5; ++i) {
    data1.push(Math.round(Math.random() * 200));
  }

  option = {
    xAxis: {
      max: 'dataMax',
    },
    yAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D', 'E'],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 2, // only the largest 3 bars will be displayed
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: data1,
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
        },
      },
    ],
    legend: {
      show: true,
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  };

  function run() {
    for (var i = 0; i < data1.length; ++i) {
      if (Math.random() > 0.9) {
        data1[i] += Math.round(Math.random() * 2000);
      } else {
        data1[i] += Math.round(Math.random() * 200);
      }
    }
    myChart.setOption<echarts.EChartsOption>({
      series: [
        {
          type: 'bar',
          data1,
        },
      ],
    });
  }

  setTimeout(function () {
    run();
  }, 0);
  setInterval(function () {
    run();
  }, 3000);

  option && myChart.setOption(option);
</script>

<!-- <style scoped>
  .title {
    font-family: 'Arial, sans-serif';
    font-size: 16;
    font-weight: 'bold';
  }
</style> -->
