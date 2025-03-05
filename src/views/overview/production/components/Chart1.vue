<template>
  <div
    ref="chartRef"
    :style="{
      width: width || '100%', // Đảm bảo chiều rộng chiếm toàn bộ thẻ chứa
      height: height || '300px', // Đặt chiều cao cố định hoặc tùy chỉnh
      maxWidth: '100%', // Đảm bảo không vượt quá thẻ chứa
      maxHeight: '100%', // Đảm bảo chiều cao không vượt quá
    }"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
  import dayjs from 'dayjs';
  import * as echarts from 'echarts';

  interface ProductionResultProps {
    date: string;
    planned_quantity: number;
    actual_quantity: number;
  }

  // Định nghĩa props mà component nhận vào
  const props = defineProps<{
    loading: boolean;
    width?: string;
    height?: string;
    data: ProductionResultProps[];
  }>();

  const chartRef = ref<HTMLElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  const chartDates = computed(() => props.data.map((item) => dayjs(item.date).format('DD/MM')));
  const plannedQuantities = computed(() => props.data.map((item) => item.planned_quantity));
  const actualQuantities = computed(() => props.data.map((item) => item.actual_quantity));

  const baseOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      textStyle: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    legend: {
      data: ['Kế hoạch', 'Kết quả'],
      right: 1,
      top: 3,
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
        data: chartDates.value,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
  };

  onMounted(() => {
    console.log(chartDates.value);
    if (chartRef.value) {
      chartInstance = echarts.init(chartRef.value as HTMLElement);
      updateChart();
      window.addEventListener('resize', handleResize);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    chartInstance?.dispose();
  });

  const handleResize = () => {
    chartInstance?.resize();
  };

  const updateChart = () => {
    if (!chartInstance) return;
    if (props.loading || props.data.length === 0) {
      chartInstance.setOption({
        ...baseOptions,
        xAxis: {
          ...baseOptions.xAxis[0],
          data: chartDates.value,
        },
      });
    } else {
      chartInstance.setOption({
        ...baseOptions,
        xAxis: {
          ...baseOptions.xAxis[0],
          data: chartDates.value,
        },
        series: [
          {
            name: 'Kế hoạch',
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series',
            },
            data: plannedQuantities.value,
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
            data: actualQuantities.value,
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
    }
  };

  watch(
    () => [props.loading, props.data],
    () => {
      updateChart();
    },
    { immediate: true },
  );
</script>

<style scoped>
  /* Thêm các kiểu cần thiết nếu cần */
</style>
