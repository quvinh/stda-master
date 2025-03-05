<template>
  <div
    class="p-1 border-gray-300 border-1 bg-white"
    ref="chartRef"
    :style="{ width, height }"
  ></div>
</template>

<script lang="ts" setup>
  import { useECharts } from '@/hooks/web/useECharts';
  import { reactive, Ref, ref, watch } from 'vue';

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

  // Mock data
  const dataChart = reactive<any>({
    categories: (function () {
      let now: any = new Date();
      let res: any[] = [];
      let len = 10;
      while (len--) {
        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
        now = new Date(+now - 2000);
      }
      return res;
    })(),
    categories2: (function () {
      let res: any[] = [];
      let len: number = 10;
      while (len--) {
        res.push(10 - len - 1);
      }
      return res;
    })(),
    data: (function () {
      let res: any[] = [];
      let len = 10;
      while (len--) {
        res.push(Math.round(Math.random() * 1000));
      }
      return res;
    })(),
    data2: (function () {
      let res: any[] = [];
      let len = 0;
      while (len < 10) {
        res.push(+(Math.random() * 10 + 5).toFixed(1));
        len++;
      }
      return res;
    })(),
  });

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        title: {
          text: 'Tỷ lệ lỗi chất lượng theo công đoạn',
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
              backgroundColor: '#283b56',
            },
          },
          textStyle: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        legend: {
          right: '12%', // Align legend to the right
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: dataChart.categories,
          },
          {
            type: 'category',
            boundaryGap: true,
            data: dataChart.categories2,
          },
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: 'Price',
            max: 30,
            min: 0,
            boundaryGap: [0.2, 0.2],
          },
          {
            type: 'value',
            scale: true,
            name: 'Order',
            max: 1200,
            min: 0,
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: 'Dynamic Bar',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: dataChart.data,
          },
          {
            name: 'Dynamic Line',
            type: 'line',
            data: dataChart.data2,
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
