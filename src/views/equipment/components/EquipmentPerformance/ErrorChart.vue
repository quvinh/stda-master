<template>
  <div class="p-1 w-full h-full" ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
  import { defineProps, onMounted, onBeforeUnmount, watch, ref } from 'vue';
  import * as echarts from 'echarts';

  interface EquipmentError {
    equipment_error_name: string;
    stop_times: number;
  }

  interface Props {
    data: EquipmentError[];
  }

  const props = defineProps<Props>();

  const chartRef = ref<HTMLDivElement | null>(null);
  let chartInstance: echarts.ECharts | null = null;

  const initChart = () => {
    if (chartRef.value) {
      chartInstance = echarts.init(chartRef.value);
      setChartOptions();
    }
  };

  const setChartOptions = () => {
    if (!chartInstance) return;
    if (props.data.length === 0) return;
    // const totalStops = props.data.reduce((sum, error) => sum + error.stop_times, 0);

    const option: echarts.EChartsOption = {
      // title: {
      //   text: 'Bảng phân bổ lỗi',
      //   left: 'center',
      //   top: 20,
      //   textStyle: {
      //     fontFamily: 'Arial, sans-serif',
      //     fontSize: 16,
      //   },
      // },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: 'Errors',
          type: 'pie',
          radius: '100%',
          data:
            props.data.length > 0
              ? props.data.map((item) => ({
                  value: item.stop_times,
                  name: item.equipment_error_name,
                }))
              : [],
          itemStyle: {
            borderWidth: 0,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {d}%',
            position: 'inside',
          },
        },
      ],
    };

    chartInstance.setOption(option);
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', resizeChart);
  });

  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
    window.removeEventListener('resize', resizeChart);
  });

  watch(
    () => ({ value: props.data }),
    (newData) => {
      if (newData.value.length === 0) {
        return;
      } else {
        setChartOptions();
      }
    },
    { deep: true, immediate: true },
  );

  const resizeChart = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };
</script>

<style scoped>
  /* Optional: Add any component-specific styles here */
</style>
